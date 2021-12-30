---
title: "Homebrew: Remove All Dependencies for a Package"
date: 2021-10-10T17:05:59-05:00
description: "Removing a package (formula) and all the packages that are its dependencies in Homebrew using join"
draft: false
keywords: [MacOS, Homebrew, Brew, Package, Brew Package]
tags: [macos, linux]
toc: false
---

TLDR: Use the following command to remove a Homebrew package with all dependencies.
```bash
$ pkg=[FORMULA]; brew rm ${pkg}; brew rm $(join <(brew leaves) <(brew deps ${pkg}))
```

---

Homebrew is quite convenient when installing and upgrading packages, however, with a relatively large package (a.k.a formula), such as `ffmpeg`, Homebrew can end up installing numerous dependencies on your system.


When we inspect the dependencies of `ffmpeg` we notice that the formula has over 20 dependencies that will get installed onto your system. Furthermore, many of these dependencies have their own sub-dependencies.

```bash

$ brew info ffmpeg 

ffmpeg: stable 4.4 (bottled), HEAD
Play, record, convert, and stream audio and video
https://ffmpeg.org/
Not installed
From: https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/ffmpeg.rb
License: GPL-2.0-or-later
==> Dependencies
Build: nasm ✘, pkg-config ✔
Required: aom ✘, dav1d ✘, fontconfig ✘, freetype ✘, frei0r ✘, gnutls ✘, lame ✘, libass ✘, libbluray ✘, libsoxr ✘, libvidstab ✘, libvorbis ✘, libvpx ✘, opencore-amr ✘, openjpeg ✘, opus ✘, rav1e ✘, rubberband ✘, sdl2 ✘, snappy ✘, speex ✘, srt ✘, tesseract ✘, theora ✘, webp ✘, x264 ✘, x265 ✘, xvid ✘, xz ✘, zeromq ✘, zimg ✘
==> Options
--HEAD
        Install HEAD version
==> Analytics
install: 69,644 (30 days), 232,638 (90 days), 1,609,320 (365 days)
install-on-request: 54,902 (30 days), 184,917 (90 days), 1,330,816 (365 days)
build-error: 0 (30 days)

```

Brew has a command that removes a package,

```bash
$ brew remove [FORMULA]
```

however this will only remove the main formula and not any of the dependencies.

To remove the main package and all its dependencies, we will use the following command. Remember to replace `[FORMULA]`, with the package that you want to remove with all dependencies. 

```bash
$ pkg=[FORMULA]; brew rm ${pkg}; brew rm $(join <(brew leaves) <(brew deps ${pkg}))
```

**What is the logic here?**
1. We create a variable `pkg` and set it to the package to be uninstalled
1. We remove the main package `pkg`
3. We use join to list all the packages installed in the system, and find packages that are solely dependencies of `pkg` and uninstall each of those packages 

