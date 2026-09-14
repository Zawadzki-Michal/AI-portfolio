---
title: "Cleaning up git history with AI — curious but cautious"
date: 2026-09-14
tags:
  - ai
  - devops
  - automation
cta_text: "Tried anything like this with your own commits? I'm curious how it went."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Sep/14/commit-rewriter/"
---

Hi there. Came across something this weekend that's been rattling around in my head — Simon Willison released a tool called [commit-rewriter](https://simonwillison.net/2026/Sep/14/commit-rewriter/), version 0.1, and I've been thinking about whether I'd actually use it.

The idea is pretty straightforward: you point it at a git history and it rewrites your commit messages to be clearer, more consistent, whatever style you're going for. AI doing the rewriting, obviously.

My first reaction was honestly a little defensive. Like, my commit messages aren't *that* bad. But then I thought about some of the stuff I've actually pushed at 11pm after a frustrating debugging session. "fixed it" and "try this" show up more than I'd like to admit. And when I go back months later trying to figure out why I changed something, those messages are useless.

So I get the appeal. A cleaner history, especially on personal projects or learning repos where I'm less disciplined, could actually help future-me understand what past-me was thinking.

But I keep circling back to something that feels a bit off about it. Part of what makes a commit message useful is that it captures what I thought was important *at that moment*. Even a bad message tells you something — maybe that I was tired, maybe that I didn't fully understand what I was doing, maybe that I was rushing. Rewriting that away feels like smoothing over the actual messy process of building something.

I don't know. Maybe that's overthinking it. Maybe the point is just to have history that's *useful*, and usefulness and authenticity don't always line up.

I haven't tried it yet. Part of me wants to run it against some old learning projects and see what it does. The weird, honest mess of my original messages might actually be more valuable than a polished version. Or maybe I'd look at the cleaned-up history and immediately prefer it. Hard to say without trying.

This is clearly a DevOps-adjacent tool more than an Azure thing, so it's a bit outside my day-to-day. The question it raises about when to let AI clean up your work keeps nagging at me, though.
