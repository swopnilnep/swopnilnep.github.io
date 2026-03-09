# swopnil.com

Personal portfolio and blog built with Eleventy.

## Development

```bash
# Install dependencies
npm install

# Run local dev server
npm run serve

# Build for production
npm run build
```

## Deployment

Automatically deploys to GitHub Pages via GitHub Actions when pushing to `main` branch.

- **main branch**: Source files
- **deploy branch**: Built site (auto-generated)

## Structure

```
src/
├── index.html          # Landing page
├── style.css           # Global styles
├── blog/
│   ├── index.html      # Blog listing
│   └── *.md            # Blog posts
├── _layouts/
│   └── post.html       # Blog post template
└── _includes/          # Reusable components
```

## Adding Blog Posts

Create a new `.md` file in `src/blog/`:

```markdown
---
layout: post
title: "Your Post Title"
date: 2024-03-09
tags: [tag1, tag2]
---

Your content here...
```

---
© Swopnil Shrestha. All Rights Reserved.
