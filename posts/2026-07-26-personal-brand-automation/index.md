---
title: "Building a personal brand pipeline: commit to LinkedIn in one merge"
date: 2026-07-26
tags: [devops, ai, automation]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
---

Most "personal brand" advice treats content as a manual chore: write a post,
open LinkedIn, paste, format, publish, repeat. I wanted it to work like the
infrastructure I already run — declarative, versioned, and automated.

## The flow

1. Open a PR with a new folder under `posts/YYYY-MM-DD-slug/`.
2. Merge to `main`.
3. Vercel deploys the site.
4. A GitHub Action waits for the deploy to go live, uploads any images to
   LinkedIn, and publishes a post linking back to the article.

No dashboards, no copy-pasting — the same review process I use for
infrastructure changes now drives what shows up on LinkedIn.

## Why this matters

Content becomes an artifact of the repo, not a side project. Every post is
reviewable, diffable, and reproducible — and the publishing step is exactly
as reliable as the rest of the pipeline.
