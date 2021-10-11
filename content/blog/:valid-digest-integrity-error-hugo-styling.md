---
title: "Fixing the CSS Integrity Digest Error in Hugo"
date: 2021-07-11T20:57:54-05:00
slug: ""
description: "How to fix the valid digest "
keywords: [hugo, css, styling, integrity]
draft: false
tags: [hugo, integrity error, css, not showing, showing on server]
math: false
toc: false
---

## Issue 

While using Hugo and installing a theme, I encountered this issue. Here are some characteristics. 

While using Hugo, the CSS / styling of the page is not loaded, and the page contains just the plain document, with all the HTML as it is in the source code in the deployed website.

On the hugo server, in a new browser session the content loads properly as well as all the related styles / CSS.

Lastly, when opening the browser console on the deployed website, the following error is found:

```
Failed to find a valid digest in the 'integrity' attribute for resource '***' with computed SHA-256 integrity '***'. The resource has been blocked.
```

## Debugging the Issue

While researching this issue, for my setup, I noticed there are 3 parts to my pipeline / deployment environment that could have caused this problem. If you use any of these tools for your deployment, you can apply the solution specific to the tools that you are using.

### Solution 1: CloudFlare Cache

Firstly, if you are using CloudFlare as your DNS Provider, this could be a DNS Cache Issue. Although in this case your issue should resolve itself in 24-28 hours automatically. 

Nevertheless, you can try the following:
1. Purge the Cache 

    * CloudFlare →  Caching Configurations → Purge Cache
    * If the root domain is your Hugo website, **Purge Everything**
    * Otherwise, you can selectively purge the subdomains, pages where Hugo is hosted.

2. If your theme relies on JavaScript for some styling, disable **RocketLoader** as well in CloudFlare settings

### Solution 2: Git LF Line Ending

Depending on which service you are using to host your code and deploy from, you may have run into an issue with Git, where line endings aren't common across development environments. If you are collaborating with someone or you are using multiple systems to commit your code follow this tutorial.

The goal is to automatically use the same character encoding [CRLF](https://en.wikipedia.org/wiki/Newline) for the newline character. If you are using GitHub.com as your code repository, follow this tutorial, otherwise refer to the relevant server [here](https://docs.github.com/en/enterprise-server@3.0/get-started/getting-started-with-git/configuring-git-to-handle-line-endings).

Based on your operating system, run the commands:

<small>MacOS / Linux</small>
```bash
$ git config --global core.autocrlf input
```

<small>Windows</small>
```
$ git config --global core.autocrlf true
```

Next, refresh the repository:

1. Start by moving all the files (including the hidden . files) from your current folder to a backup folder
2. Add and commit the empty folder

    ```
    $ git add . -u
    $ git commit -m "Empty folder to prepare for line ending fix"

    ```
3. Add back all the moved files from your backup folder
4. Normalize and commit the files

    ```
    $ git add . --renormalize
    $ git commit -m "Normalize all line endings"
    ```


### Solution 3: Remove Integrity Altogether

The last solution is to remove css file integrity altogether. Although, be warned, you don't want to do this if CORS is a concern for your website.

You can do this by going into the `baseof.html`. Usually the path to this file is:

`layouts/_default/baseof.html`, 

but it may differ based on the theme you are using.

After opening the file, 
1. Find the reference link to the CSS file. It looks like the following with integrity enabled:
    ```html
    <link rel="preload" href="{{ $styles.Permalink }}" integrity="{{ $styles.Data.Integrity }}" as="style" crossorigin="anonymous">
    ```
2. Remove Integrity (replace with empty string)
    ```html
    <link rel="preload" href="{{ $styles.Permalink }}" integrity="" as="style" crossorigin="anonymous">
    ```
3. You may repeat this for all the resources that are not loading. This will ensure that none of the `.css` file in your optimized build requires CORS integrity.


## References
* [Configuring Git Line Endings | GitHub](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)
* [Valid Digest Integrity Issue | GitHub](https://github.com/lxndrblz/anatole/issues/114#issuecomment-828750909)
* [SHA-256 Integrity Issue](https://github.com/alanorth/hugo-theme-bootstrap4-blog/issues/53)