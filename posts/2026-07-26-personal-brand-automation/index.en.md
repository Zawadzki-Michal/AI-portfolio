---
title: "I wired this blog to post itself to LinkedIn, mostly to see if I could"
date: 2026-07-26
tags: [devops, ai, automation]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
---

Most "build a personal brand" advice treats posting as a manual chore:
write something, open LinkedIn, paste it in, format it, publish, repeat.
I don't have much patience for repetitive manual steps — probably from
spending a lot of time around infrastructure that's automated by default,
so anything manual bugs me. So I tried making this blog
work more like the infrastructure I'm learning at work: something you
change through a PR, not a form you fill in by hand.

Here's roughly how it works now:

1. I open a PR with a new folder under `posts/YYYY-MM-DD-slug/`.
2. Once it's merged to `main`, the site deploys.
3. A GitHub Action waits until the new page is actually live, uploads any
   images to LinkedIn, and publishes a post linking back to it.

I'm not going to pretend I got this right on the first try — I did, in
fact, ship a version that could hang a CI job forever if a request never
came back, and only found out when a run sat "in progress" for eight
minutes doing nothing. Small thing, but it's the kind of mistake that
taught me more about how Node actually handles open connections than any
tutorial did.

What I like about the result is that a post is now just a file in a repo,
reviewed the same way I'd review anything else. Whether that's actually a
better system than just posting manually, I'm honestly not sure yet — but
it's been a fun thing to build and debug.
