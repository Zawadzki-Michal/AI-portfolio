---
title: "PHP2Shell and the reminder that my pipelines aren't the whole picture"
date: 2026-10-26
tags: [azure, devops, automation]
cta_text: "Running into similar 'wait, what about X?' moments with your pipelines? I'd like to hear about it."
cta_link: "/collaborate"
source_url: "https://devblogs.microsoft.com/devops/php2shell-and-azure-devops-what-to-check/"
---

Hi there. So this PHP2Shell thing dropped last week, and honestly my first reaction was relief — I don't write PHP, my day-to-day is mostly Azure stuff, so I figured I could scroll past it. Then I actually read [Microsoft's advisory about Azure DevOps and PHP2Shell](https://devblogs.microsoft.com/devops/php2shell-and-azure-devops-what-to-check/) and felt that familiar "oh, right" feeling.

The short version: Azure DevOps itself doesn't use PHP for handling requests, so the service isn't directly vulnerable. But that's not the end of the story, is it? Because my pipelines pull in containers, spin up runtimes, deploy applications — and any of those could be running PHP somewhere in the chain. The advisory is pretty clear that patching there is on me, not on Microsoft.

I'll admit I hadn't thought hard enough about this before. When I think about pipeline security I'm usually worried about secrets management, or whether my service principal has too many permissions, or whether I've accidentally committed something I shouldn't have. The idea that a vulnerability in a language runtime I'm not even consciously using could matter — that's a different angle. It might be lurking in a base image I pulled six months ago and haven't really looked at since.

So I spent part of the weekend just poking around. What containers am I actually using? When were they last updated? Do any of them have PHP installed even if I'm not calling it directly? I don't have clean answers yet. Some of my older test environments are a bit of a mess, frankly. I found one container image that's been sitting unchanged since early 2025, which, ouch.

The advisory mentions that deployment scope covers both cloud and on-prem, which I appreciate — it would've been easy for them to just say "DevOps Services is fine, good luck" and move on. Instead there's at least a nudge toward thinking about the whole surface area.

I'm still sorting out what a sensible routine looks like here. Probably something where I'm actually checking image freshness on some kind of schedule instead of only when something breaks. For now I'm just glad I read past the headline instead of assuming it wasn't my problem.
