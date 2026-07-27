---
title: "Relay markets and token fraud — not my world, but it got me thinking"
date: 2026-07-27
tags:
  - ai
  - automation
cta_text: "Run into anything like this in your own work? I'd be curious to hear how you think about it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Hi there,

So I came across [this piece on Simon Willison's blog](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) about relay markets — the infrastructure that powers token reselling and fraud at scale. Not my usual reading, honestly. I'm not hunting threat actors or building security tooling. My day-to-day is more "why is this deployment failing" than "who's exploiting this API."

But something about it stuck with me.

The part that got me was how organized and mundane the whole operation seems. There's this whole ecosystem of people reselling access, routing tokens through layers of infrastructure, treating it like any other supply chain problem. It's not some shadowy hacker in a basement. It's a market. With suppliers and buyers and, I assume, customer support tickets.

I don't know why that surprised me. I guess I still picture this stuff as chaotic and improvised. But of course it scales the same way everything else does. Someone builds the tooling, someone else builds on top of that, and before long you have relay markets with their own economics.

What I keep circling back to is how this connects to the AI stuff I've been poking at. Not directly — I'm not working on anything that would be a target for this kind of operation. But the tokens being moved around, the API access being resold, that's the same infrastructure I'm learning to use for legitimate purposes. Same building blocks, completely different game.

It makes me wonder about the defensive side. If I'm spinning up something that uses API tokens — even for a small personal project — what am I not thinking about? What assumptions am I making about how those tokens flow and who might want access to them? I don't have answers here, just the uncomfortable realization that I probably haven't thought about it enough.

There's a line in the piece about how the relay systems are designed to be invisible to both ends of the transaction. That's the part I keep coming back to. The infrastructure that makes something work smoothly is often the same infrastructure that makes abuse hard to spot. Same problem, different angle.

Anyway. Still processing this one. It's outside my usual lane but it feels like the kind of thing I should understand better, even if I'm not sure what to do with it yet.
