---
layout: post
title: "Fixing the CSS Integrity Digest Error in Hugo"
summary: "When a Hugo site loads unstyled with 'Failed to find a valid digest in the integrity attribute', the stylesheet changed after Hugo fingerprinted it. Three common causes, in the order to check them."
date: 2021-07-11
---

## Symptom

The deployed site renders as unstyled HTML, while `hugo server` looks fine locally. The browser console shows:

```text
Failed to find a valid digest in the 'integrity' attribute for resource '…/style.min.<hash>.css'
with computed SHA-256 integrity '…'. The resource has been blocked.
```

## Why it happens

Many Hugo themes use [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI). At build time, Hugo fingerprints the stylesheet and writes its hash into the page:

```html
<link rel="stylesheet" href="{{ $style.Permalink }}" integrity="{{ $style.Data.Integrity }}" crossorigin="anonymous">
```

The browser hashes the file it actually downloads and refuses to apply it if the two hashes differ. So this error always means one thing: **the bytes the browser received are not the bytes Hugo hashed.** Something between the build and the browser changed the file.

## Cause 1: a CDN rewrote the file

If the site sits behind Cloudflare, its optimizations could modify assets in transit:

- **Auto Minify** (retired by Cloudflare in August 2024) re-minified CSS and JavaScript, which changes the bytes and breaks the hash.
- **Rocket Loader** rewrites how scripts load.

Disable these optimizations for the site, then purge the cache (**Caching → Configuration → Purge Everything**, or purge just the affected URLs). Cached copies keep failing until they expire or are purged.

## Cause 2: line endings changed in Git

If the theme or its assets were committed from different operating systems, Git can convert line endings (LF ↔ CRLF). The file in the build environment then differs from the one that was fingerprinted elsewhere. This was the confirmed fix for several people in the [Anatole theme thread](https://github.com/lxndrblz/anatole/issues/114).

Normalize line endings for the repository:

```bash
# macOS / Linux: convert CRLF to LF on commit, never on checkout
git config --global core.autocrlf input
```

```bash
# Windows: check out CRLF, commit LF
git config --global core.autocrlf true
```

Then re-normalize the files already in the repository:

```bash
git add --renormalize .
git commit -m "Normalize line endings"
```

A committed `.gitattributes` file (for example, `* text=auto eol=lf`) is more reliable than per-machine settings, because it travels with the repository. See GitHub's guide on [configuring Git to handle line endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings).

## Cause 3 (last resort): remove the integrity check

If you can't find what is modifying the file, you can remove the `integrity` attribute from the theme's template, usually in `layouts/_default/baseof.html` or a `head` partial:

```html
<link rel="stylesheet" href="{{ $style.Permalink }}">
```

This makes the error go away by turning off the check, not by fixing the cause. SRI matters most for files served from a third-party CDN; for a stylesheet served from your own origin, removing it is a smaller risk. Prefer fixing causes 1 and 2.

## References

- [Subresource Integrity, MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [Configuring Git to handle line endings, GitHub Docs](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)
- [Valid digest integrity issue, Anatole theme](https://github.com/lxndrblz/anatole/issues/114)
- [SHA-256 integrity issue, hugo-theme-bootstrap4-blog](https://github.com/alanorth/hugo-theme-bootstrap4-blog/issues/53)
