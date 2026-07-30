# Personal Brand Automation

Portfolio site + automation pipeline: merge a post → site deploys on Vercel →
GitHub Action publishes it to LinkedIn with a link back to the article.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **i18n:** [next-intl](https://next-intl.dev/), English + Polish site UI (`/en/...`, `/pl/...`), language switcher in the nav — blog post content is English-only, see [Bilingual posts](#bilingual-posts)
- **Content:** Markdown files in `posts/YYYY-MM-DD-slug/index.en.md` (front-matter, no database)
- **Comments:** LinkedIn sign-in ([Auth.js](https://authjs.dev)) + Postgres ([Neon](https://neon.com)) — see [Post comments](#post-comments)
- **Hosting:** Vercel, auto-deploy on push to `main`
- **Automation:** GitHub Actions
  - `publish-to-linkedin.yml` — on push to `main` touching `posts/**`, waits for the new post's page to go live, then publishes it to LinkedIn. Also runnable manually (`workflow_dispatch`) with a `post_slug` input to retry a single post without a new commit.
  - `generate-draft.yml` — scheduled job that pulls RSS feeds, asks a model to draft a post, and opens a PR for review
  - `ci.yml` — typecheck, unit tests, and build on every push/PR to `main`
- **AI drafting:** [OpenRouter](https://openrouter.ai/) (routed to a Claude model by default — see `automation/draft-instructions.md`)
- **Testing:** Vitest, unit tests for the content layer, the LinkedIn API client, and the draft pipeline's pure helpers

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest — lib/posts, lib/slugify, lib/linkedin, lib/markdown
npm run build       # production build
```

`.github/workflows/ci.yml` runs typecheck + tests + build on every push/PR to
`main`. None of this requires any secrets — the LinkedIn and OpenRouter env
vars are only read by the automation scripts, not by the site itself.

## Adding a post

Create `posts/YYYY-MM-DD-your-slug/index.en.md`. Blog content is
English-only (see [Bilingual posts](#bilingual-posts) below) — the site UI
itself still supports Polish, so a Polish reader gets Polish nav/chrome
around an English post:

```yaml
---
title: "..."
date: 2026-07-26
tags: [azure, ai, devops]
cta_text: "Been through something similar? I'd like to hear about it"
cta_link: "/collaborate"
# optional — only set on posts drafted from the RSS pipeline; used to skip
# re-drafting the same source article on later runs
source_url: "https://example.com/the-article-this-post-reacts-to"
---

Article body in Markdown.
```

Drop any images in the same folder — they're served at `/posts/your-slug/<filename>`
(no locale prefix; images aren't localized). Reference them from the Markdown
with that absolute path, e.g. `![alt](/posts/your-slug/photo.png)` (relative
paths won't resolve correctly since the page URL has no trailing slash).

Open a PR, merge to `main`. The post goes live on the next Vercel deploy; the
`publish-to-linkedin` workflow then publishes it to LinkedIn automatically
(only for **newly added** post folders, so editing an existing post never
re-publishes it). LinkedIn always gets the **English** version — see
`LINKEDIN_LOCALE` in `scripts/publish-to-linkedin.ts` if you want to change
that.

The URL used on-site is `/<locale>/posts/<folder-name>` (e.g.
`/en/posts/2026-07-26-my-post` or `/pl/posts/2026-07-26-my-post`) — the
folder name itself has no locale in it, only the URL prefix does.

### Bilingual posts

The blog is English-only by decision — machine-translating posts into
Polish added no real value, so `generate-draft.yml` only ever writes
`index.en.md`. `lib/posts.ts` resolves `index.<locale>.md` for the
requested locale and falls back to `index.en.md` if a translation doesn't
exist, so Polish-locale readers just see the English post content under
the `/pl/...` URL — the rest of the site (nav, chrome, other pages) is
still fully bilingual. A handful of older posts have a hand-written
`index.pl.md` from before this decision; those are left as-is, but new
posts don't get one. A bare `index.md` from before i18n was added is also
still supported as a last-resort fallback.

If you want a specific post translated anyway, add `index.pl.md` to its
folder by hand — the resolver picks it up automatically.

## Project screenshots

Drop images in `projects/<slug>/desktop/` and/or `projects/<slug>/mobile/`
(the `slug` is the project's `slug` field in `lib/projects.ts`, e.g.
`projects/lifeos/desktop/chat.png`). Any `.png`/`.jpg`/`.jpeg`/`.webp`/`.gif`
file in either folder shows up automatically on that project's page —
desktop shots in a browser-chrome frame, mobile shots in a phone frame,
both click-to-expand into a lightbox. No code change or manifest needed;
a project with no screenshots yet just doesn't render the gallery section.

## Post comments

Comments on post pages (`components/Comments.tsx`, `app/api/comments`) let
readers sign in with LinkedIn and post directly — comments publish
immediately, no moderation queue. This is the one part of the site backed by
a real database rather than flat files:

- **Auth:** [Auth.js](https://authjs.dev) v5 (`auth.ts`) with LinkedIn's
  "Sign In with LinkedIn using OpenID Connect" provider. Session is
  JWT-based — no user table needed, the LinkedIn `sub` claim is stored
  directly on each comment as `author_linkedin_id`.
- **Storage:** Postgres via [Neon](https://neon.com) (Vercel's native
  Postgres integration). `lib/comments.ts` reads/writes the `comments`
  table directly with `@neondatabase/serverless` — no ORM.

Setup (one-time — steps 1–2 need your own LinkedIn/Vercel accounts, not
something this codebase can do for you):

1. **LinkedIn app:** create one at
   [developer.linkedin.com](https://www.linkedin.com/developers/apps), add
   the "Sign In with LinkedIn using OpenID Connect" product, and set the
   redirect URL to `<your-domain>/api/auth/callback/linkedin` (and
   `http://localhost:3000/api/auth/callback/linkedin` for local dev). Copy
   the Client ID/Secret.
2. **Database:** in Vercel → Storage, create a Postgres database (or use
   [console.neon.tech](https://console.neon.tech) directly) and copy its
   connection string.
3. Set these env vars (`.env.local` locally, and in Vercel):

   ```
   AUTH_SECRET=            # npx auth secret
   LINKEDIN_CLIENT_ID=
   LINKEDIN_CLIENT_SECRET=
   DATABASE_URL=
   ```

4. Create the `comments` table once: `npm run db:init`.

Comments are keyed by post slug (`post_slug`), so no per-post setup is
needed beyond this.

## Required configuration

### GitHub Actions secrets

| Secret | Used by | Notes |
| --- | --- | --- |
| `LINKEDIN_ACCESS_TOKEN` | publish-to-linkedin | `w_member_social` scope, 60-day token (see below) |
| `LINKEDIN_AUTHOR_URN` | publish-to-linkedin | e.g. `urn:li:person:xxxxxxxx` |
| `OPENROUTER_API_KEY` | generate-draft | From [openrouter.ai/keys](https://openrouter.ai/keys) |

### GitHub Actions repository variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `SITE_URL` | publish-to-linkedin, generate-draft | e.g. `https://your-portfolio.vercel.app` |
| `RSS_FEEDS` | generate-draft | Comma-separated feed URLs (optional, has defaults) |
| `OPENROUTER_MODEL` | generate-draft | Defaults to `anthropic/claude-opus-4.5` — any [OpenRouter model slug](https://openrouter.ai/models) works |

### Vercel

Connect the repo, deploy on push to `main`, no extra config needed for the
site itself. Set `CONTACT_WEBHOOK_URL` as a Vercel env var if you want
`/collaborate` form submissions forwarded somewhere (Slack/Discord webhook
etc.) — without it, submissions are just logged server-side.

Post comments (see [Post comments](#post-comments)) need `AUTH_SECRET`,
`LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, and `DATABASE_URL` set as
Vercel env vars — without them, the comments section on post pages just
doesn't render (no crash, no build-time dependency).

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

`generate-draft.yml` runs weekly (and via manual dispatch):

1. Pulls items from the configured RSS feeds (default: Azure Updates, Azure
   DevOps Blog, HashiCorp Blog, GitHub Changelog, Simon Willison's blog —
   override with the `RSS_FEEDS` repo variable).
2. Skips any item whose link already appears as `source_url` on an existing
   post (`lib/posts.ts#getAllSourceUrls`) — so re-running the job doesn't
   redraft the same article just because it's still the newest one in a
   feed.
3. Sends the first un-drafted item to OpenRouter (`OPENROUTER_MODEL`,
   defaults to a Claude model) with the system prompt loaded straight from
   `automation/draft-instructions.md` — edit that file to change voice,
   formatting rules, or the tag taxonomy without touching any code.
4. Sends the draft back to the model for a self-critique/revise pass
   against the instructions' "Cut these on sight" checklist before
   finalizing it.
5. Writes the result to `posts/YYYY-MM-DD-slug/index.en.md` (the slug is
   derived from the title) and opens a PR with that one file. English
   only — see [Bilingual posts](#bilingual-posts).

Nothing is ever published without merging that PR first — images and edits
are added by hand before merge.

## Project structure

```
app/[locale]/               Localized routes (home, /about, /projects, /posts, /posts/[slug], /collaborate)
app/posts/[slug]/[...file]  Image-serving route — outside [locale], images aren't localized
app/projects/[slug]/[...file]  Screenshot-serving route — outside [locale], mirrors the posts route
app/api/contact/            Contact form API route — outside [locale]
i18n/routing.ts             Locale list + default locale + prefix strategy
i18n/navigation.ts          Locale-aware Link/usePathname/useRouter (re-exported from next-intl)
i18n/request.ts             Loads messages/<locale>.json per request
messages/en.json, pl.json   All static UI copy, keyed by page/component
middleware.ts               next-intl locale detection/routing
components/                 Design system components
lib/posts.ts                Front-matter parsing / locale resolution (with en fallback) / source_url dedup
lib/projects.ts             Project data — content is per-locale, see getProjects(locale)
lib/project-gallery.ts      Reads projects/<slug>/desktop|mobile screenshot folders
lib/site-config.ts          Name, role, headline, social links — edit this for your own bio
lib/linkedin.ts             LinkedIn REST API client (images + posts)
lib/slugify.ts, lib/markdown.ts   Small pure helpers shared by the scripts and covered by tests
posts/                       Content — one folder per post, index.en.md (English-only going forward)
projects/                    Screenshots — projects/<slug>/desktop/, projects/<slug>/mobile/
automation/draft-instructions.md  System prompt for the draft-generation model
scripts/                     CLI scripts run by GitHub Actions
.github/workflows/          publish-to-linkedin.yml, generate-draft.yml, ci.yml
```

## Pages

All routes are locale-prefixed (`/en/...`, `/pl/...`); `/` redirects to the
default locale (`en`).

- `/` — hero, about teaser, expertise tiles, selected work, latest log entries, collaborate CTA
- `/about` — bio, stack/skills grid ("what I'm working with," not a mastery claim)
- `/projects` — things actually worked on, most still with a lot left to learn
- `/posts`, `/posts/[slug]` — the blog/log
- `/collaborate` — genuine peer/networking invitation, contact form, and direct channels (email, LinkedIn, Telegram, GitHub)

To add UI copy in a new spot: add the key to **both** `messages/en.json` and
`messages/pl.json` (same nesting), then read it with `useTranslations()` /
`getTranslations()`. Nothing renders if a key is missing from either file.

## Contact channels

`lib/site-config.ts` holds `email` and `social.{linkedin,github,telegram}`.
Any channel left as an empty string renders as "pending setup" on
`/collaborate` instead of a broken/dead link — fill in `social.linkedin` and
`social.telegram` (handle only, no `@` or URL needed) once you have them.
