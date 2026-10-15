---
layout: post
title: "Benchmarking Strands Decider: multi-question latency and prefix caching"
summary: "Measuring Strands Decider 2B across 1 to 128 questions on a single state. How shared-prefix caching scales, where it saves tokens, and what marginal questions cost."
date: 2026-10-01
---

Decision models evaluate typed predicates directly without autoregressive text generation. A core architectural argument for this class of model is amortized multi-question evaluation: encoding a document once, then scoring multiple questions in parallel against the cached representation.

To evaluate how this scales in practice, I benchmarked Strands Decider 2B across 1 to 128 questions over a single document, comparing its shared-prefix cache against a naive re-encoding baseline. The benchmark code and data are available on [GitHub](https://github.com/swopnilnep/strands-decider-benchmark).

## Benchmark setup

- **State:** A 2,201-token synthetic service specification covering 48 services, each detailing route, authentication, rate limits, ownership, and latency targets.
- **Questions:** 128 typed yes/no questions (`NoulQuestion`) evaluating service properties.
- **Paths tested:**
  - *Shared prefix* (`use_prefix_cache=True`, default): Encodes the state once per batch (default `max_batch=32`), broadcasting the cached key-value states to evaluate question suffixes.
  - *Naive re-encode* (`use_prefix_cache=False`): Concatenates state and question for each query, re-encoding the full prompt every time.
- **Metrics:** Median wall-clock latency across repeated runs and input token counts reported by the model engine.
- **Environment:** Apple M3 Pro (MPS backend). The hybrid torso runs its reference implementation because `causal_conv1d` is not installed, so absolute latencies are conservative. The token model and relative ratios remain hardware-independent.

## Latency and token scaling

| Questions | Shared prefix (ms) | Naive re-encode (ms) | Shared tokens | Naive tokens |
|---:|---:|---:|---:|---:|
| 1 | 2,120 | 2,118 | 2,283 | 2,283 |
| 2 | 2,299 | 4,514 | 2,358 | 4,568 |
| 4 | 2,438 | 9,093 | 2,520 | 9,150 |
| 8 | 2,730 | 18,413 | 2,826 | 18,296 |
| 16 | 3,474 | (not run) | 3,443 | (not run) |
| 32 | 4,936 | (not run) | 4,675 | (not run) |
| 64 | 9,889 | (not run) | 9,363 | (not run) |
| 128 | 19,414 | (not run) | 18,722 | (not run) |

<figure>
  <img src="/img/blog/decider-battery.png" alt="Log-log plots of latency and input tokens versus question count for shared-prefix and naive paths." loading="lazy">
  <figcaption>Figure 1. Latency and processed tokens versus question count on a 2,201-token state.</figcaption>
</figure>

## Token accounting

The observed token usage follows a predictable piecewise model:

```text
naive(n)  = n * (state + question)
          = n * 2,278

shared(n) = ceil(n / 32) * state + n * question
          = ceil(n / 32) * 2,201 + n * 77.5
```

The shared-prefix path eliminates redundant re-encoding of the 2,201-token state for every question within a batch. At n = 8, this reduces processed tokens from 18,296 to 2,826 (a 6.5x reduction), which directly translates to a 6.7x reduction in wall-clock latency (2.73 s vs. 18.41 s).

## Marginal cost per question

While prefix caching provides substantial throughput gains, marginal questions are not free:

1. **Within a batch:** Adding a question costs approximately 90 ms in the shared path versus approximately 2.3 s in the naive path (a 25x difference). Each suffix must still attend across the 2,201-token cached state, so execution time grows with question count even before re-encoding.
2. **Across batch boundaries:** The engine enforces a batch ceiling (`max_batch=32`) to bound memory during KV-cache broadcast. When crossing batch boundaries (n = 33, 65, 97), the state must be re-encoded for the new batch. This produces step increases in latency at 32, 64, and 128 questions.

## Conclusion

The multi-question efficiency of decision models is real and significant: 6.7x speedup at 8 questions, scaling to more than 15x asymptotically as question count increases. However, the performance profile is determined by batch boundaries and attention over the cached prefix rather than zero-marginal-cost scaling. Systems relying on high-volume evaluation batteries should align query batches with the engine's batch limit.

All benchmark scripts, raw JSON outputs, and plotting code are available at [swopnilnep/strands-decider-benchmark](https://github.com/swopnilnep/strands-decider-benchmark).
