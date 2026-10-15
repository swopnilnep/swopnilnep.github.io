---
layout: post
title: "Homebrew: Remove a Formula and Its Unused Dependencies"
summary: "brew uninstall removes only the formula you name. Here is how to clean up the dependencies it pulled in, and why the built-in command is safer than the shell one-liner."
date: 2021-10-10
---

Large formulae pull in a lot of dependencies. At the time of writing, `ffmpeg` depended on more than 30 other formulae, many with dependencies of their own. `brew uninstall ffmpeg` removes `ffmpeg` and leaves all of them behind.

```bash
brew info ffmpeg
# ==> Dependencies
# Build: nasm, pkg-config
# Required: aom, dav1d, fontconfig, freetype, frei0r, gnutls, lame, libass, ...
```

## The short answer

Since Homebrew 2.5.9 (late 2020), the built-in way is:

```bash
brew uninstall ffmpeg
brew autoremove --dry-run   # review what would be removed
brew autoremove
```

`autoremove` uninstalls formulae that were installed only as dependencies and that nothing else installed still needs. It reads Homebrew's own record of what you asked for (`installed_on_request`) and what came along as a dependency, so it won't remove a dependency that another formula still uses, or one you installed directly.

## The older one-liner

Before `autoremove`, the common approach looked like this. I originally published it in this post:

```bash
pkg=ffmpeg
brew uninstall "$pkg"
brew uninstall $(join <(brew leaves) <(brew deps "$pkg"))
```

How it works:

1. `brew deps "$pkg"` lists the formula's dependencies.
2. `brew leaves` lists installed formulae that no other installed formula depends on.
3. `join` keeps the names in both lists: dependencies of `pkg` that are now leaves, so nothing else needs them.

It works for simple cases but has sharp edges:

- **It can remove things you meant to keep.** `brew leaves` includes formulae you installed on purpose. If you installed `pkg-config` yourself, it is still a leaf and still a dependency of `ffmpeg`, so it gets removed. `autoremove` knows the difference.
- **It only cleans up one level.** Sub-dependencies become leaves only after their parents are removed, so you have to run it repeatedly.
- **`join` assumes sorted input.** Both commands happen to print sorted output today; nothing guarantees it.

Use `brew autoremove`, and pass `--dry-run` first whenever you're unsure.
