---
title: "Relay markets and token reselling — not my world, but fascinating"
date: 2026-07-27
tags:
  - ai
  - automation
cta_text: "Seen anything like this in the wild? I'd genuinely like to hear about it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Hi there,

So I stumbled across [this piece on relay markets powering token resellers and fraud](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) and honestly, it's one of those reads that makes you realize how much is happening in corners of tech you never think about.

I'll be upfront — this isn't really my area. I'm not doing security research, I'm not hunting down fraud rings, and my day-to-day is much more "why is this Terraform deployment failing" than "how are bad actors laundering API tokens through relay infrastructure." But that's kind of why I found it interesting? It's a window into a whole ecosystem I didn't know existed.

The basic idea, as I understand it, is that there's this layer of infrastructure specifically built to help people resell or abuse tokens at scale. Not the tokens themselves, but the relay systems that move them around, obscure their origin, make the whole thing harder to trace. It's weirdly entrepreneurial in the worst way — someone saw a gap in the market for "making fraud more efficient" and built tooling for it.

What got me thinking was how this connects, even loosely, to stuff I actually deal with. When I'm setting up service principals in Azure or managing API keys for automation, I'm mostly worried about rotation schedules, making sure secrets don't end up in git, the usual. But reading about relay markets makes you realize those credentials exist in a broader ecosystem where someone, somewhere, might actually want to get their hands on them. Not because I'm a target specifically, but because everything is a potential target if the tooling exists to exploit it at scale.

I don't have any grand conclusions here. I'm not about to pretend I know how to defend against relay-based fraud — that's way outside what I work on. But it's a good reminder that the systems we build don't exist in isolation. The authentication tokens I generate, the automation I set up, it all plugs into a bigger picture where some people are building things and other people are figuring out how to abuse those things.

Still chewing on what, if anything, I should do differently. Probably nothing dramatic — just stay curious about the threat landscape even when it feels far removed from my actual job.
