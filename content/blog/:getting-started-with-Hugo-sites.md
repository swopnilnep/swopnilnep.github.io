---
title: "Setting Up: Getting Started with Hugo Sites"
date: 2020-10-16T02:40:57-05:00
description: "How publish your own fast, simple and robust application using Hugo, the GoLang based static website generator. Companion tutorial to ACM Luther College."
draft: false
keywords: [Hugo, Personal Website, Website, Static Site]
tags: [software-engineering, hugo]
toc: true
---

Welcome to this ACM Luther tutorial to create a static site using Hugo. This blog post is intended to accompany the "Building a Personal Static Website" workshop on **2020, Oct 18th**.

If you have any questions or trouble with this tutorial, you can message the [Luther ACM Slack channel](https://luthercs.slack.com/archives/C6Z17T3CK). 

## Philosophy

Hugo is a fast, flexible static site generator, one of the most popular open source generators among the [numerous static site generators](https://jamstack.org/generators/) available. In can be a handy tool to create static websites fast on the go. It can also be an effective tool to host blogs, small web projects or other personal content. 

In the workshop we will go over how to build a personal portfolio using Hugo. We will then host the website on [GitHub Pages](https://pages.github.com/), in a website that looks like [this](https://luthercss.github.io).

## Prerequisites

Basic familiarity with Git version control is recommended. If you don't plan to publish your website, Git will not be required. If you have already configured and used Git to push and pull from a repository, skip to Step 2.

Not familiar with Git? Do not worry! This assumption in this tutorial will be that you are unfamiliar with Git. I still recommend you to take a look at this [Git Cheatsheet](https://education.github.com/git-cheat-sheet-education.pdf) to get familiar with some basic commands.


The only commands we will be using for this tutorial are:

```bash
$ git status
$ git add <location>
$ git commit -m "Your commit message"
$ git push <remote> <master>
```

### Step 1: Git & GitHub

More importantly, be sure to setup your Git and GitHub account, so that your deployment into your GitHub site will work properly.

1. If you don't have an account already, create a [GitHub account](https://github.com/). You can sign up with any username that you like. 
2. If you haven't installed Git, go ahead and install it in your computer. Here are the installation links for:
    * [Windows](https://gitforwindows.org/)
    * [MacOS](https://sourceforge.net/projects/git-osx-installer/files/git-2.23.0-intel-universal-mavericks.dmg/download?use_mirror=autoselect)
    * Ubuntu
        * Open your Terminal and run the command:
        * `sudo apt-get install git-all`
3. Now, configure your identity on Git. Open any terminal app you have and enter the following. Replace the given examples with your details.
```bash
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```
4. Now, follow this tutorial to [Generate a new SSH key and add it to the ssh-agent](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Remember to use the tutorial specific to your operating system.
5. Last step for this section, [Add the new SSH key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account).

### Step 2: Installing Hugo (Windows)

For Windows users, you can either go through this [text tutorial](https://gohugo.io/getting-started/installing/#windows) or watch a [video tutorial](https://www.youtube.com/watch?v=G7umPCU-8xc). Both yield the same result of installing Hugo on your computer.

### Step 2: Installing Hugo (MacOS / Linux)

If you are on MacOS or Linux i.e. any UNIX based operating system, you need to have `brew` configured beforehand to install `hugo`. To check if you have `brew` installed, open your terminal and enter

```bash
$ brew -v
```

1. Install `brew` if you haven't already.

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. Run `brew` to install `hugo`

```bash
brew install hugo
```

3. Check that `hugo` is installed properly

```bash

# show the location of the hugo executable
which hugo
/usr/local/bin/hugo

# show the installed version
ls -l $( which hugo )
lrwxr-xr-x  1 mdhender admin  30 Mar 28 22:19 /usr/local/bin/hugo -> ../Cellar/hugo/0.13_1/bin/hugo

# verify that hugo runs correctly
hugo version
Hugo Static Site Generator v0.13 BuildDate: 2015-03-09T21:34:47-05:00

```

If you get the output, congratulations! You should be all set for the workshop.

## Event


Once you have setup both Git and Hugo on your computer, you are all set to begin. See you on Sunday! Let us know you have any questions or trouble with the setup.

## Author

This tutorial is authored by [Swopnil Shrestha](https://swopnil.com) as part of a workshop series for ACM Luther College for the 2020-2021 academic year.