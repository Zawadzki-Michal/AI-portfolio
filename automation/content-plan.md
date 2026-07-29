# Content plan — LinkedIn comeback

Living doc, not a one-time brief. Update the status section as posts go
out; the rest is reference for *why* the queue is ordered the way it is.
Goal behind all of it: make Michał look like a strong candidate for an
AI-driven DevOps role — not "AI commentator," not generic thought
leadership.

Restored 2026-07-29 after being dropped earlier the same day for being
premature (placeholders not filled in). It's being kept this time because
the actual Phase 1 posts below are now written for real, not scaffolded —
see `posts/2026-07-29-where-ive-been/index.en.md`.

**One-post rule:** every post here is written once, for the blog. LinkedIn
is not a separate draft — `publish-to-linkedin.ts` auto-generates the
LinkedIn share (title + hashtags from `tags` + link back) from the same
post on merge to `main`. Don't hand-write a second LinkedIn-specific
version of a post's body.

## Status

- [x] Phase 1, post 1 — "Where I've been" (`posts/2026-07-29-where-ive-been/index.en.md`) — drafted 2026-07-29, pending review/merge. Scope note: this one post deliberately breaks the "no pre-Azure backstory, no employer name" rule in `draft-instructions.md` — confirmed with Michał on 2026-07-29 that the reintroduction post is the one place that story belongs. Posts after this one go back to following `draft-instructions.md` as written (no employer name, no trucking/tiling/bootcamp color).
- [ ] Phase 1, post 2 — "How AI actually showed up in my day job"
- [ ] Phase 1, post 3 — "I built a pipeline that writes, critiques, and publishes my own posts"
- [ ] Phase 2 started (steady-state rotation, 1x/week baseline)

## Cadence

- **Phase 1 (comeback):** 2x/week for ~10 days. Enough to signal
  momentum without reading as a content-machine relaunch.
- **Phase 2 (steady state):** 1x/week baseline, 2x/week ceiling — only
  go to 2x if there's real bandwidth to review each post properly
  (images, edits) before it merges. A missed week is invisible; a
  hollow rubber-stamped post isn't.
- Consistency over months beats volume over weeks. That's the actual
  signal a hiring manager reads from a posting history.

## Phase 1 — the comeback (hand-written, not pipeline-generated)

The automation pipeline (`generate-draft.yml`) only knows how to react
to an RSS `source_url` — it has no "personal update" mode. These three
need to be written by hand (or drafted once, by request, using the
voice file as reference), in this order:

1. **"Where I've been"** — the reintroduction. Why it's been quiet, what
   you've actually been doing. Short, honest, not an apology tour. Pure
   trust-rebuilding; nothing else lands until this exists.
2. **"How AI actually showed up in my day job"** — the bridge. Not "AI
   is transforming DevOps," but the specific small way it entered your
   actual work. Reintroduces the voice, signals the new focus without
   announcing it.
3. **"I built a pipeline that writes, critiques, and publishes my own
   posts"** — the strongest opening move available. The RSS pipeline,
   the self-critique pass, the voice-tuning-from-old-posts process, the
   anti-pattern checklist. A live demonstration of the exact skill set
   being aimed at, not a claim about it.

## Phase 2 — steady state (starts once Phase 1 is done)

Rotation weighted roughly **2:2:1:1 per month**:

- **MCP / automation (strongest, most differentiated angle)** — anything
  actually built or wired up.
- **Infra-grounded posts (Azure/Terraform/DevOps, AI as a lens not the
  subject)** — the floor that keeps this from drifting into "AI
  commentator." At least 1 in 3 posts overall, no exceptions.
- **AI-use reflections** — one specific thing that worked, told as a
  story. Never "the right way to."
- **AI-misuse near-misses** — something that almost went wrong or wasted
  time, told at personal scale. Never "companies are burning money."

**Pillar "new enterprise productivity tools" has no fixed slot.** Only
write it when something's actually been tried hands-on. Treat as a
wildcard, not a rotation member — the one most likely to slide into
generic content if it becomes a habit instead of a reaction.

### Seed queue — next six posts once Phase 1 wraps, in order

1. MCP-specific — a concrete tool/integration actually wired up, what it changed
2. Infra-grounded — extend the Terraform DR work, or a new small Azure story
3. "This worked" reflection — one tool, one task, specific
4. Near-miss/waste story — something that cost more than it saved, at personal scale
5. Infra or MCP/automation again — keep the floor identity present
6. Open slot — whatever's genuinely current when the queue gets here

### Project posts (folded in 2026-07-29 from an earlier, simpler queue)

Each of Michał's showcased projects gets its own post at some point —
these aren't locked to a specific slot above, slot them into Phase 2's
rotation (they read as "infra-grounded" or "MCP/automation" depending on
angle) whenever there's something real to say about that project:

- **LifeOS** — the personal-assistant/life-management project (this
  portfolio site's automation pipeline is arguably part of this story
  too — may overlap with Phase 1 post 3).
- **The small-business booking assistant** ("beauty support" project) —
  confirm current name/scope with Michał before drafting.
- **This portfolio/blog site itself** — the Next.js + i18n + content
  pipeline build. Overlaps heavily with Phase 1 post 3; probably the
  same post, not two.

## Non-negotiables

- Pillar 1 (AI misuse) and pillar 2 (right way to use AI) stay at "this
  happened to me," never "here's the right way" or "here's what
  companies get wrong." That's the exact tone `draft-instructions.md`
  is built to avoid, and it's also the most crowded, least memorable
  lane on LinkedIn right now — half the platform posted some version of
  "the right way to use AI at work" this month alone.
- At least 1 in 3 posts is infra-grounded, not AI-opinion.
- If a week has nothing genuine to post, skip it. Don't force the RSS
  pipeline to manufacture a reaction just to hit a cadence target.
