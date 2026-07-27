---
title: "Relay markets and the infrastructure I never thought about"
date: 2026-07-27
tags:
  - automation
  - networking
cta_text: "Ever stumbled into a corner of tech that made you rethink how things actually work? I'd love to hear about it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Hi there. So I came across [this piece on relay markets](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) over the weekend and honestly, I'm still chewing on it.

The basic idea is that there's this whole parallel economy — relay services that token resellers and fraudsters use to route their traffic, make requests look legitimate, cycle through residential IPs. These operations run like actual businesses. Pricing tiers, service level expectations, customer support apparently.

I've spent most of my time in Azure thinking about infrastructure from the defender's side, or at least what I thought was the defender's side. IP whitelisting, network security groups, making sure the right things can talk to each other and the wrong things can't. Pretty standard stuff for someone two years into this. But reading about how these relay operations work, how they're designed specifically to slip past exactly the kinds of controls I spend time configuring — that's a weird feeling.

It's not that I didn't know fraud existed. Obviously. But I think I had this vague mental model where attackers were either highly targeted (state actors, specific targets) or just blunt-force opportunists. The idea that there's mature, stable infrastructure specifically built to make bad traffic blend in with good traffic, and that it operates like any other B2B service? That sat with me differently.

I don't have direct experience with this stuff from the operations side. My day-to-day is more "make sure this deployment doesn't break" than "detect sophisticated fraud patterns." But it does make me wonder about the assumptions baked into the tools I use. When I set up a rule that says "allow traffic from these IPs," what am I actually filtering? If someone with a relay subscription can look like a residential user in the same region as my legitimate traffic, what does my NSG rule actually accomplish?

I'm not saying I have answers here. I'm still pretty early in understanding the security side of what I work on, honestly. But this felt like one of those pieces that shifts how you think about a problem even if it doesn't hand you a solution.

The infrastructure that makes fraud scale is built like a product. I sat with my coffee getting cold on Sunday morning, rereading the section on pricing models, and kept thinking about the NSG rules I'd pushed to production the week before. Whether they're doing what I thought they were doing. Still not sure.
