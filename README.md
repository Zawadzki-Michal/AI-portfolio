# Personal Brand Automation

Portfolio site + automation pipeline: merge a post → site deploys on Vercel →
GitHub Action publishes it to LinkedIn with a link back to the article.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **i18n:** [next-intl](https://next-intl.dev/), English + Polish site UI (`/en/...`, `/pl/...`), language switcher in the nav — blog post content is English-only, see [Bilingual posts](#bilingual-posts)
- **Content:** Markdown files in `posts/YYYY-MM-DD-slug/index.en.md` (front-matter, no database)
- **Comments:** LinkedIn sign-in ([Auth.js](https://authjs.dev)) + Postgres ([Neon](https://neon.com)) — see [Post comments](#post-comments)
- **Admin panel:** `/admin`, GitHub sign-in restricted to the site owner, full post CRUD + comment moderation, commits straight to `main` via the GitHub API — see [Admin panel](#admin-panel)
- **SEO:** real per-page descriptions, Open Graph/Twitter cards, canonical + hreflang tags, JSON-LD, `robots.txt`, `sitemap.xml`, and generated favicons/OG images — see [SEO](#seo)
- **RSS:** `/feed.xml`, English-only (matches the blog itself), autodiscoverable via a `<link>` tag on every page
- **Analytics:** [Vercel Web Analytics](https://vercel.com/docs/analytics) — public site only, not `/admin`; needs enabling in the Vercel project dashboard to actually collect data
- **Hosting:** Vercel, auto-deploy on push to `main`
- **Automation:** GitHub Actions
  - `publish-to-linkedin.yml` — on push to `main` touching `posts/**`, waits for the new post's page to go live, then publishes it to LinkedIn. Also runnable manually (`workflow_dispatch`) with a `post_slug` input to retry a single post without a new commit.
  - `generate-draft.yml` — scheduled job that pulls RSS feeds, asks a model to draft a post, and opens a PR for review
  - `generate-linkedin-description.yml` — on push to any branch other than `main` touching `posts/**` (covers both a manually-pushed post and `generate-draft.yml`'s draft branch), fills in `linkedin_description` on any post that doesn't have one yet and commits it back to that branch — so the LinkedIn teaser is visible in the PR diff before merge, see [LinkedIn description](#linkedin-description). Also runnable manually (`workflow_dispatch`) to backfill an existing branch that predates this workflow, without needing a throwaway `posts/**` edit just to trigger it.
  - `linkedin-token-health-check.yml` — scheduled weekly job that reserves (but never completes) a LinkedIn image upload as a cheap way to confirm `LINKEDIN_ACCESS_TOKEN` is still valid, so a revoked/expired token (they last 60 days, see [LinkedIn API notes](#linkedin-api-notes)) is caught days ahead of the next post instead of failing mid-publish. Also runnable manually.
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
npm run generate-linkedin-description   # fill in linkedin_description on any post missing one
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
# optional — auto-filled by generate-linkedin-description.yml if left out;
# see [LinkedIn description](#linkedin-description)
linkedin_description: "..."
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

## Admin panel

`/admin` is a full CRUD panel for posts (create, edit, delete, image
uploads) plus comment moderation (delete), restricted to the site owner.
It's outside `app/[locale]` (own root layout, excluded from the next-intl
middleware) since it's single-user and doesn't need i18n.

- **Auth:** a separate Auth.js GitHub provider, identity-only — its `signIn`
  callback rejects any GitHub login except `ADMIN_GITHUB_LOGIN`. This is on
  top of the existing LinkedIn provider used for comments; the two don't
  interact.
- **Writes:** the admin API routes (`app/api/admin/**`) call GitHub's
  Contents API directly (`lib/github-content.ts`) and commit **straight to
  `main`** — no PR step, since editing through the panel's own preview is
  already the review step. This deliberately does *not* use the admin's
  OAuth session for the writes — a repo-scoped token never needs to reach
  the browser. Instead it uses `GITHUB_ADMIN_TOKEN`, a separate
  server-only token.
- Reads also go through the GitHub API rather than the local filesystem
  (unlike the public site's `lib/posts.ts`), so the panel always reflects
  the true state of `main`, not whatever was bundled into the currently
  running Vercel deployment.
- Saving still waits on the next Vercel deploy to show up on the live
  site, same as any other push to `main` — the panel doesn't change that.

Setup (one-time):

1. **GitHub OAuth App** (for login): github.com → Settings → Developer
   settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://<your-domain>`
   - Authorization callback URL: `https://<your-domain>/api/auth/callback/github`
     (and `http://localhost:3000/api/auth/callback/github` for local dev —
     GitHub OAuth Apps only accept one callback URL each, so use two
     separate OAuth Apps for local vs. prod, or just re-point the one App
     at localhost while developing).
   - Copy the Client ID, generate a Client Secret.
2. **Fine-grained personal access token** (for writes): github.com →
   Settings → Developer settings → Personal access tokens → Fine-grained
   tokens → Generate new token. Scope it to **this repository only**, with
   **Contents: Read and write** permission and nothing else.
3. Set these env vars (`.env.local` locally, and in Vercel):

   ```
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ADMIN_GITHUB_LOGIN=        # your GitHub username
   GITHUB_ADMIN_TOKEN=        # the fine-grained PAT from step 2
   ```

`AUTH_SECRET` is shared with the comments sign-in and only needs setting
once (see [Post comments](#post-comments)).

## SEO

- **`lib/seo.ts`'s `buildMetadata()`** — Next.js doesn't deep-merge
  `openGraph`/`twitter`/`alternates` between a layout's `generateMetadata`
  and a page's; whichever sets one of those keys fully replaces it. So
  every page builds its own complete metadata through this one helper
  (title, description, canonical, hreflang for both locales, Open
  Graph, Twitter card) instead of partially inheriting from
  `app/[locale]/layout.tsx`. That layout sets `metadataBase` — from
  `siteConfig.url` (`SITE_URL` env var, falls back to
  `https://michalzawadzki.dev`) — which *is* inherited and resolves every
  relative URL `buildMetadata()` returns.
- **Individual posts reuse `linkedin_description`** as the meta
  description — it's already a short (under 220 chars), human-reviewed
  teaser (see [LinkedIn description](#linkedin-description)), which is
  exactly what a good meta description is. Falls back to the post's tags
  for posts written before that field existed.
- **`app/robots.ts`, `app/sitemap.ts`** — sitemap covers every static page,
  post, and project, in both locales; robots disallows `/admin` and `/api`.
- **`app/icon.tsx`, `app/apple-icon.tsx`** — generated favicon /
  apple-touch-icon (a dark square + amber dot, matching the site's status-dot
  motif). These needed a `middleware.ts` matcher fix too: Next's generated
  `/icon`/`/apple-icon` routes have no file extension in the URL despite
  serving an image, so next-intl's middleware was catching them and 404ing
  under a locale prefix — excluded the same way `/admin` and `/api` are.
- **JSON-LD** (`lib/structured-data.ts` + `components/JsonLd.tsx`) —
  `Person`/`WebSite` on the homepage, `BlogPosting` per post.
- **Dynamic Open Graph images** — `app/[locale]/opengraph-image.tsx` (sitewide
  default) and `app/[locale]/posts/[slug]/opengraph-image.tsx` (post title +
  tags), so a post shared to LinkedIn gets a real branded preview image
  instead of nothing. Built with `next/og`'s `ImageResponse`; its renderer
  (Satori) needs every `<div>` with more than one child to have an explicit
  `display: "flex"` — it has no block-layout fallback.

Nothing here needs new secrets beyond `SITE_URL` (optional — only needed if
the production domain ever changes from the hardcoded fallback).

## Required configuration

### GitHub Actions secrets

| Secret | Used by | Notes |
| --- | --- | --- |
| `LINKEDIN_ACCESS_TOKEN` | publish-to-linkedin, linkedin-token-health-check | `w_member_social` scope, 60-day token (see below) |
| `LINKEDIN_AUTHOR_URN` | publish-to-linkedin, linkedin-token-health-check | e.g. `urn:li:person:xxxxxxxx` |
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

The admin panel (see [Admin panel](#admin-panel)) needs `GITHUB_CLIENT_ID`,
`GITHUB_CLIENT_SECRET`, `ADMIN_GITHUB_LOGIN`, and `GITHUB_ADMIN_TOKEN` set
as Vercel env vars — without them, `/admin` just shows the sign-in gate
(GitHub login will fail) or, once signed in, the API routes will 500 on any
write.

**Web Analytics** needs enabling once, separately from the code: Vercel
dashboard → your project → Analytics tab → Enable. The `<Analytics />`
component (`app/[locale]/layout.tsx`) is already wired in and no-ops
outside Vercel's production infrastructure (nothing sent from `localhost`
or a non-Vercel deploy), so there's no env var for it — just that one
dashboard toggle.

**Error monitoring** (see [Error monitoring](#error-monitoring)) needs
`NEXT_PUBLIC_SENTRY_DSN` set as a Vercel env var — without it, Sentry's
`init()` calls are no-ops (no crash, nothing reported). `SENTRY_ORG`,
`SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are optional and only needed to
upload source maps for readable stack traces.

## Error monitoring

[Sentry](https://sentry.io) catches unhandled errors across all three
runtimes and reports them with source-mapped stack traces:

- **`instrumentation.ts`** registers `sentry.server.config.ts` (Node runtime)
  or `sentry.edge.config.ts` (Edge runtime, e.g. `middleware.ts`) depending
  on `NEXT_RUNTIME`, and exports `onRequestError` so server-side rendering/
  route-handler errors get reported automatically.
- **`instrumentation-client.ts`** is the client-side equivalent (picked up
  automatically by Next.js, no config needed) — session replay is off by
  default to keep the client bundle small; flip `replaysOnErrorSampleRate`
  in that file if you want it.
- **`app/global-error.tsx`** is the last-resort boundary above every route's
  own `error.tsx` — catches anything that escapes those and reports it
  before rendering a fallback page.
- **`next.config.mjs`**'s `withSentryConfig` wrapper uploads source maps
  during `next build`, but only when `SENTRY_AUTH_TOKEN` is set (`silent`
  otherwise) — local dev and PRs without the secret build exactly the same,
  just without source-mapped traces on sentry.io.

All three `Sentry.init()` calls read the same `NEXT_PUBLIC_SENTRY_DSN` — a
DSN isn't a secret (it's fine to expose client-side), so one env var covers
server, edge, and client instead of juggling separate public/private ones.

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
  appended as plain text in the commentary. The `article` block doesn't
  crawl the URL for an `og:image` the way old-style shares did, so a post
  with no hand-picked images falls back to uploading the site's own
  generated OG image (`{post}/opengraph-image`) as its media instead of
  using the imageless `article` type.

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

## LinkedIn description

`publish-to-linkedin.yml` builds the post commentary from the front-matter
`title`, `linkedin_description`, and `tags` — see [LinkedIn API
notes](#linkedin-api-notes). Writing a good teaser by hand every time is
easy to skip, so `generate-linkedin-description.yml` fills it in
automatically: it runs on push to any branch other than `main` that touches
`posts/**`, and for any post missing `linkedin_description` it sends the
full post body to OpenRouter with the prompt in
`automation/linkedin-description-instructions.md`, writes the result back
into that post's front-matter, and commits it to the same branch. Because
this runs on the PR branch itself (both a manually-pushed post and
`generate-draft.yml`'s auto-draft branch trigger it), the generated teaser
shows up as a diff in the open PR — review it there, edit it by hand if it
misses the mark, before merging.

To generate one locally instead: `npm run generate-linkedin-description --
<slug>` (needs `OPENROUTER_API_KEY` in `.env.local`; omit the slug to check
every post). Posts that already have `linkedin_description` are left alone.

A branch built off `main` carries every already-deployed post along with it,
not just the new one the PR is actually about — so the script also skips any
post slug that already exists on `origin/main`, even if that post happens to
be missing `linkedin_description` too. Without that check, running this on
an unrelated PR would silently add a description (and commit) to a post
that's already live, which has nothing to do with that PR.

## Project structure

```
app/[locale]/               Localized routes (home, /about, /projects, /posts, /posts/[slug], /collaborate)
app/admin/                  Admin panel — own root layout, outside [locale] and next-intl, see Admin panel
app/api/admin/               Admin API routes (posts CRUD, comment moderation) — all check requireAdmin()
app/posts/[slug]/[...file]  Image-serving route — outside [locale], images aren't localized
app/projects/[slug]/[...file]  Screenshot-serving route — outside [locale], mirrors the posts route
app/api/contact/            Contact form API route — outside [locale]
app/robots.ts, app/sitemap.ts   Generated /robots.txt, /sitemap.xml
app/feed.xml/route.ts       RSS 2.0 feed, English posts only
app/icon.tsx, app/apple-icon.tsx   Generated favicon / apple-touch-icon
app/[locale]/opengraph-image.tsx, app/[locale]/posts/[slug]/opengraph-image.tsx   Generated OG share images
i18n/routing.ts             Locale list + default locale + prefix strategy
i18n/navigation.ts          Locale-aware Link/usePathname/useRouter (re-exported from next-intl)
i18n/request.ts             Loads messages/<locale>.json per request
messages/en.json, pl.json   All static UI copy, keyed by page/component
middleware.ts               next-intl locale detection/routing (excludes /admin and /api)
components/                 Design system components
components/admin/           Admin panel UI (PostForm, AdminNav, CommentModeration, DeletePostButton)
lib/posts.ts                Front-matter parsing / locale resolution (with en fallback) / source_url dedup — public site reads (local filesystem)
lib/admin-posts.ts          Post CRUD against the GitHub API — admin panel reads/writes (always current main, not the deployed bundle)
lib/github-content.ts       GitHub Contents API client (list/get/put/delete), used by lib/admin-posts.ts
lib/require-admin.ts        Session check shared by every app/api/admin/** route
lib/projects.ts             Project data — content is per-locale, see getProjects(locale)
lib/project-gallery.ts      Reads projects/<slug>/desktop|mobile screenshot folders
lib/site-config.ts          Name, role, headline, social links, canonical URL — edit this for your own bio
lib/seo.ts                  Shared buildMetadata() helper — every page's title/description/OG/canonical/hreflang
lib/structured-data.ts      JSON-LD schema builders (Person, WebSite, BlogPosting)
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
