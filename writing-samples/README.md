# Writing samples

Drop your old blog posts (or any writing you want the voice modeled on) in
this folder — one file per post. Plain `.md` or `.txt` is fine, no
front-matter or particular structure required; just the actual text.

This folder is **not** part of the site build and is never read by
`app/`, `lib/posts.ts`, or the publishing pipeline — it exists purely as
reference material for tuning `automation/draft-instructions.md`, the
system prompt used to draft new posts.

Once there's enough here, the plan is:
1. Read through the samples
2. Pull out concrete voice patterns — sentence structure, recurring
   phrases/habits, how you open and close posts, how technical vs.
   personal the tone runs, what you tend to avoid
3. Rewrite the "Voice" and "Rules" sections of
   `automation/draft-instructions.md` to match, instead of the generic
   placeholder voice currently in there

Note: this repository is public, so treat this folder like anything else
in it — fine for previously-published blog content, not the place for
anything you haven't already put out publicly.
