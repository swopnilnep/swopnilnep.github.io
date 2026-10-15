---
layout: post
title: "Agent workflows are distributed systems in a different paradigm"
summary: "A one-page set of principles: the problems we solve in distributed systems, the AWS tools we use for them, and how each one applies to agent workflows."
date: 2025-11-18
---

Any system built from independent parts has to answer the same questions. How do the parts talk to each other? What happens when one fails? How do you know what actually happened?

A distributed system is a set of predictable workers talking over an unreliable network. An agent workflow is a set of unpredictable workers talking over a reliable network. The questions stay the same, and so do most of the answers.

| Principle | Distributed systems | Agent workflows |
|---|---|---|
| Observability | CloudWatch Logs and metrics, X-Ray traces | Run traces: prompts, context loaded, tool calls, outputs |
| Contracts | API schemas, API Gateway request validation | Tool schemas and structured output checked before use |
| State | DynamoDB as the source of truth, TTL for old data | Small context, real state read from systems, stale docs expired |
| Retries | SQS redelivery, idempotency keys | Safe tool retries, check before you create |
| Limits | Lambda timeouts, Step Functions max attempts, dead-letter queues | Step limits, attempt limits, hand off to a human |
| Verification | Health checks, CloudWatch Synthetics canaries | Tests, validators, and a review step after the agent |
| Permissions | IAM least privilege, security groups | Read-only access, sandboxes, approval before changes |
| Testing | Integration tests, canary deployments | Eval sets of real tasks, rerun on every prompt change |

## Observability

In a distributed system, CloudWatch Logs and X-Ray let you follow a request across services and see where it slowed down or failed. An agent needs the same trail. Record the prompt, the context it loaded, every tool call and result, and the final output for each run. When an agent makes a bad change, the trace shows whether it had the wrong context, picked the wrong tool, or misread a result.

## Contracts

Services agree on request and response shapes, and API Gateway can reject a malformed request before it reaches your code. Agents need the same agreement. Define each tool with a schema, ask for structured output, and validate it before anything downstream uses it.

## State

A service keeps its truth in a database like DynamoDB and expires old records with TTL. An agent's equivalent is its context. Keep it small, load what the current task needs, and remove outdated documentation, because an agent will follow a stale runbook as confidently as a current one. When you need to know what happened, read the real system, not the chat history.

## Retries

SQS can deliver a message more than once, so consumers use idempotency keys to avoid doing the same work twice. Agents retry too. Before a tool creates a pull request, a ticket, or a deployment, check whether it already exists.

## Limits

Lambda functions have timeouts, and Step Functions caps retry attempts and can route failures to a dead-letter queue. Agents can loop on a failing step indefinitely. Cap the number of steps and attempts, and when the cap is reached, stop and hand the task to a person.

## Verification

Load balancers run health checks, and CloudWatch Synthetics canaries exercise an endpoint to confirm it really works. An agent can report success when a step failed. Run the tests, validate the output, or add a review step before you accept the result.

## Permissions

IAM roles give each service only the access it needs. Give agents the same treatment: read-only access by default, a sandbox for running code, and an approval step before anything that writes to production, sends a message, or spends money. This also limits the damage from malicious input that tries to steer the agent.

## Testing

Integration tests and canary deployments catch regressions before customers see them. For agents, keep a set of real tasks with known good answers and rerun it every time you change a prompt, a tool, or the context.

The model is one component in a larger system. The engineering practices that keep distributed systems reliable are the same ones that keep agent workflows reliable.
