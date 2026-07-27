---
title: "Relay markets and token fraud — not my world, but maybe closer than I think"
date: 2026-07-27
tags: [ai, automation]
cta_text: "Ever stumbled into a security rabbit hole that made you rethink your own setup? I'd be curious to hear about it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Hi there. So I sat down after work yesterday with no particular plan, just browsing through my usual feeds, and ended up spending way too long reading about something I'd never really thought about before — relay markets.

Simon Willison linked to [this piece about the relay market infrastructure](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) that powers token resellers and fraud operations, and honestly, it's one of those reads that makes you feel a bit naive about how the internet actually works behind the scenes.

I don't work in security. My day-to-day is mostly Azure infrastructure, deployments, the occasional Terraform rabbit hole. Fraud ecosystems aren't something I think about when I'm debugging a failed pipeline or figuring out why a VM won't talk to a storage account. But reading through this, I kept having this uncomfortable thought: the tokens these relay markets deal in, the API access they're reselling and abusing — that's the same kind of access I configure and manage, just on the other end of a very different transaction.

What got me was the scale and the infrastructure. There's a whole market layer, with its own economics, its own reliability concerns, its own version of what we'd call "service level agreements" in a legitimate context. They've essentially built DevOps for fraud. Automated, scalable, resilient.

I'm still not sure what to do with that knowledge, practically speaking. It's not like I'm going to wake up tomorrow and suddenly become a security researcher. But it does make me think differently about things like token rotation, access policies, how casually I sometimes treat service principals. Everything with an API is probably a target, whether I notice or not.

Just that weird feeling when you learn about a whole parallel infrastructure you'd never considered, and realize it's been humming along this whole time, doing its thing, while you were worrying about Terraform state files.
