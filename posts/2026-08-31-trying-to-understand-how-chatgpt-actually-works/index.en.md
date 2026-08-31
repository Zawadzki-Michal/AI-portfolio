---
title: "Trying to understand how ChatGPT actually works"
date: 2026-08-31
tags:
  - ai
cta_text: "Got a better mental model for this stuff? I'm all ears."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Aug/30/understanding-chatgpt-work/"
---

Hi there. So I spent part of my Sunday morning reading through [Simon Willison's piece on understanding how ChatGPT works](https://simonwillison.net/2026/Aug/30/understanding-chatgpt-work/), and I'm still sitting with it.

I use these tools nearly every day now — for drafting scripts, poking at Terraform configs, sometimes just rubber-ducking a problem when I'm stuck. But I realised I've been treating the whole thing like a black box. Prompt goes in, answer comes out, and I judge it by whether it helps me or not. Which works, until it doesn't, and then I have no idea why.

What I liked about Simon's write-up is that he doesn't pretend this is simple or that there's one tidy mental model that explains everything. He walks through the mechanics — tokens, attention, the way context gets processed — but keeps circling back to the parts that are still genuinely weird and hard to reason about. That honesty is refreshing. A lot of AI explainers I've read either oversimplify into "it's just autocomplete" or go so deep into the maths that I lose the thread entirely.

I'm not claiming I now understand how these models work. I don't. But I think I'm starting to build a slightly better intuition for why certain prompts fall flat and others seem to unlock something useful. It's less about finding the right incantation and more about what information the model actually has to work with, and how I'm shaping that context window.

For my day-to-day Azure work this feels relevant because I keep reaching for AI assistants to help with things like ARM template debugging or piecing together CLI commands I half-remember. Sometimes the output is spot-on, sometimes it confidently hands me something that doesn't exist. Having even a rough sense of what's happening under the hood makes me a better user of the tool. Or at least a more skeptical one. Like, if it hallucinates a parameter name, I'm starting to get why that might happen, which helps me catch it faster.

I'm still pretty early in wrapping my head around all this. The more I understand about the tools I'm relying on, the better I can spot when they're actually helping versus when they're just sounding confident. Those two things look identical until you check.
