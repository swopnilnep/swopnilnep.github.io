---
layout: post
title: "Workshop Prep: Building a Personal Site with Hugo"
summary: "Setup instructions for an ACM Luther workshop on building a personal static site with Hugo and publishing it on GitHub Pages."
date: 2020-10-16
---

*This post accompanied the ACM Luther workshop "Building a Personal Static Website" on October 18, 2020. The commands have been updated to work today.*

## Why a static site generator

[Hugo](https://gohugo.io/) is a fast, open-source static site generator. You write content in Markdown, Hugo renders it to plain HTML, and you can host the result almost anywhere for free. In the workshop we built a personal portfolio and published it on [GitHub Pages](https://pages.github.com/); the [workshop example site](https://luthercss.github.io) is still online.

Before the workshop, set up Git and install Hugo.

## Step 1: Git and GitHub

The workshop uses only a handful of Git commands:

```bash
git status
git add <path>
git commit -m "Describe your change"
git push origin main
```

If Git is new to you, GitHub's [Git cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf) is a good one-page reference.

1. Create a [GitHub account](https://github.com/) if you don't have one.
2. Install Git:
    - **Windows:** [Git for Windows](https://gitforwindows.org/)
    - **macOS:** run `git --version`; if Git isn't installed, macOS offers to install the Command Line Tools.
    - **Ubuntu / Debian:** `sudo apt install git`
3. Set your name and email. Git records them on every commit.

```bash
git config --global user.name "Jane Doe"
git config --global user.email jane@example.com
```

4. [Generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [add it to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account), so you can push without typing a password.

## Step 2: Install Hugo

Follow the [official installation guide](https://gohugo.io/installation/) for your platform. The common options:

```bash
# macOS (Homebrew, from https://brew.sh)
brew install hugo

# Windows (winget)
winget install Hugo.Hugo.Extended

# Ubuntu / Debian
sudo apt install hugo
```

Many themes need the **extended** edition of Hugo for Sass support. The Homebrew and winget packages are extended; distribution packages may lag behind, so check the version.

## Step 3: Verify

```bash
hugo version
# hugo v0.xxx.x+extended ...
```

If that prints a version, you're ready for the workshop.

*Prepared by [Swopnil Shrestha](https://swopnil.com) for ACM Luther's 2020–21 workshop series.*
