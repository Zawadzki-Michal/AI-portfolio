---
name: write-blog-post
description: Interactively draft a new blog post for this site (michalzawadzki.dev) by talking through the topic with Michał in chat, then writing it up in his own voice and creating the post file. Use this whenever he wants to write, draft, start, or brainstorm a new post, log entry, or article for the blog — "let's write a post about X", "I want to blog about the thing that happened at work today", "draft something about Y", "help me react to this article", or any conversational request to create blog content. This is the manual, conversational counterpart to the scheduled RSS-drafting pipeline (scripts/generate-draft.ts) — reach for this skill any time the request is a conversation about a post rather than "run the draft generator" or "check the scheduled drafts."
---

# Writing a blog post with Michał

This site's blog has one voice, produced two ways: a scheduled pipeline
that drafts from RSS items (`scripts/generate-draft.ts`), and this
skill, for when Michał wants to write about something himself — a work
moment, a topic he's been chewing on, or his own reaction to a link. A
reader shouldn't be able to tell which path produced a given post.

## Step 1 — read the style guide fresh, every time

Before drafting anything, read `automation/draft-instructions.md` in
full. That file is the single source of truth for voice, the "cut these
on sight" checklist of AI-writing tells, and the exact output contract
(front-matter keys, word count). Don't rely on a memory of it from
earlier in the conversation and don't paraphrase it here — it gets
edited independently of this skill, and re-reading it live is what
keeps a hand-written post and a pipeline-drafted post sounding like the
same person. If it's changed since you last read it, the new version
wins.

## Step 2 — find out what the post is actually about

If Michał's already given you a topic, an experience, or a link to
react to, don't re-ask for it. Fill gaps naturally, the way a colleague
would, rather than running down a rigid checklist:

- What's the post actually about — something that happened at work, a
  topic he's been thinking about, or a specific article/link he wants
  to react to?
- If it's a reaction to a link, get the URL — it becomes `source_url`
  and needs at least one inline reference in the body (per the output
  contract).
- Any concrete detail worth anchoring the post in (when this happened,
  what he was doing, what broke or clicked) — the style guide's "cut
  these on sight" list flags posts that stay too conceptual, so it's
  worth having at least one real anchor before you draft.

Don't interrogate him for every front-matter field — you can reasonably
default the rest yourself in the next step.

## Step 3 — work out the metadata

- **date**: today's date, unless he says otherwise.
- **slug**: lowercase, hyphenated, short — this becomes the folder name
  `posts/YYYY-MM-DD-slug/`.
- **tags**: 2-4 lowercase tags. The output contract in
  `automation/draft-instructions.md` lists a fixed set for
  pipeline-drafted posts, but check a couple of existing folders in
  `posts/` first — hand-written posts on this site also use tags like
  `personal` or `career` when the topic genuinely calls for it. Use
  your judgment; don't force-fit a post about a life update into
  `terraform`.
- **cta_text**: a short, low-key invitation to talk, in his voice — see
  the examples in `automation/draft-instructions.md` and existing posts
  under `posts/`.
- **cta_link**: always `/collaborate`.
- **source_url**: only if this post is reacting to a specific article
  he gave you.

Check the front-matter of the most recent post in `posts/` for the
exact YAML formatting (quoting, list style) so the new file matches.

## Step 4 — draft the post

300-500 words, following the voice guidance and the "cut these on
sight" checklist in `automation/draft-instructions.md` — all of it,
including the dash-usage rule. Before showing it to Michał, reread your
own draft against that checklist the way the automated pipeline's
self-critique pass does, and fix anything that matches.

## Step 5 — show him the draft before writing anything to disk

Post the full draft in chat — front-matter and body — and ask if he
wants changes. This is content going out under his name; never create
the file until he's actually seen it and is happy with it (or has
asked for specific edits you've made).

## Step 6 — create the file

Once he's approved it, write it to `posts/YYYY-MM-DD-slug/index.en.md`.
Blog content on this site is English-only by decision — don't create an
`index.pl.md` unless he specifically asks for one (see the README's
"Bilingual posts" section if you need the details on how that
resolves).

If the post references an image he wants included, remind him images
go in the same `posts/YYYY-MM-DD-slug/` folder and get referenced as
`/posts/your-slug/<filename>` (absolute path, per the README).

## Step 7 — tell him what happens next

Creating the file doesn't publish anything. Mention that it goes live
once it's committed, pushed, and merged to `main` via a PR (same as any
other change to this repo) — and that merging is also what triggers the
`publish-to-linkedin` GitHub Action for newly added posts. Offer to
open that PR if he wants, but don't do it without him saying so.
