# Personal Brand Automation

Portfolio site + automation pipeline: merge a post → site deploys on Vercel →
GitHub Action publishes it to LinkedIn with a link back to the article.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Content:** Markdown files in `posts/YYYY-MM-DD-slug/index.md` (front-matter, no database)
- **Hosting:** Vercel, auto-deploy on push to `main`
- **Automation:** GitHub Actions
  - `publish-to-linkedin.yml` — on push to `main` touching `posts/**`, waits for the new post's page to go live, then publishes it to LinkedIn
  - `generate-draft.yml` — scheduled job that pulls RSS feeds, asks Claude to draft a post, and opens a PR for review
- **AI drafting:** Anthropic API (Claude)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding a post

Create `posts/YYYY-MM-DD-your-slug/index.md`:

```yaml
---
title: "..."
date: 2026-07-26
tags: [azure, ai, devops]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
---

Article body in Markdown.
```

Drop any images in the same folder — they're served at `/posts/your-slug/<filename>`.
Reference them from the Markdown with that absolute path, e.g.
`![alt](/posts/your-slug/photo.png)` (relative paths won't resolve correctly
since the page URL has no trailing slash).

Open a PR, merge to `main`. The post goes live on the next Vercel deploy; the
`publish-to-linkedin` workflow then publishes it to LinkedIn automatically
(only for **newly added** post folders, so editing an existing post never
re-publishes it).

The URL used everywhere (site link + LinkedIn link) is `/posts/<folder-name>`,
i.e. the full `YYYY-MM-DD-slug` folder name.

## Required configuration

### GitHub Actions secrets

| Secret | Used by | Notes |
| --- | --- | --- |
| `LINKEDIN_ACCESS_TOKEN` | publish-to-linkedin | `w_member_social` scope, 60-day token (see below) |
| `LINKEDIN_AUTHOR_URN` | publish-to-linkedin | e.g. `urn:li:person:xxxxxxxx` |
| `ANTHROPIC_API_KEY` | generate-draft | Claude API key |

### GitHub Actions repository variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `SITE_URL` | publish-to-linkedin | e.g. `https://your-portfolio.vercel.app` |
| `RSS_FEEDS` | generate-draft | Comma-separated feed URLs (optional, has defaults) |

### Vercel

Connect the repo, deploy on push to `main`, no extra config needed for the
site itself. Set `CONTACT_WEBHOOK_URL` as a Vercel env var if you want
`/collaborate` form submissions forwarded somewhere (Slack/Discord webhook
etc.) — without it, submissions are just logged server-side.

## LinkedIn API notes

- Self-serve developer program, `w_member_social` scope.
- Access tokens last 60 days; refresh tokens last 365 days — **token refresh
  is not automated here** (LinkedIn has no long-lived server-to-server auth
  for this scope). Plan to rotate `LINKEDIN_ACCESS_TOKEN` manually or add a
  scheduled refresh job before the 60-day expiry.
- Rate limit: ~100 calls/day — each post = 1 call for the post + 1 per image
  uploaded, well within limits for a personal cadence.
- LinkedIn's Posts API allows only one content type per post: an image/
  multi-image block, **or** a link-preview (`article`) block — not both. If
  a post has images, they're attached as media and the article link is
  appended as plain text in the commentary; if it has no images, the post
  uses the `article` content type so LinkedIn renders a link preview.

## Draft generation

`generate-draft.yml` runs weekly (and via manual dispatch), pulls the most
recent RSS item across the configured feeds, asks Claude to draft a post in
the site's voice/format, and opens a PR with the new `posts/` folder. Nothing
is ever published without merging that PR first — images and edits are added
by hand before merge.

## Project structure

```
app/                 Next.js routes (home, /posts, /posts/[slug], /collaborate, /api/contact)
components/          Design system components
lib/posts.ts         Front-matter parsing / post listing
lib/linkedin.ts       LinkedIn REST API client (images + posts)
posts/                Content — one folder per post
scripts/              CLI scripts run by GitHub Actions
.github/workflows/    publish-to-linkedin.yml, generate-draft.yml
```
