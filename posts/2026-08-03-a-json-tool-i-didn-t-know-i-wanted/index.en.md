---
title: "A JSON tool I didn't know I wanted"
date: 2026-08-03
tags:
  - automation
  - devops
cta_text: "Do you have any go-to tools for wrangling messy outputs? Would love to hear what's worked for you."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Aug/2/condense-json/#atom-everything"
---

Hi there. Quick one today because I stumbled across something that got me thinking about a problem I run into more often than I'd like to admit.

Simon Willison just released [condense-json 1.0](https://simonwillison.net/2026/Aug/2/condense-json/#atom-everything), and honestly the name alone made me click. I spend a lot of time staring at JSON outputs — Azure CLI responses, Terraform state files, API payloads when I'm debugging something that should have worked but didn't. And half the time the actual information I need is buried in this sprawling nested structure that makes my eyes glaze over.

I haven't had a chance to properly dig into condense-json yet, but the premise is exactly what I keep wishing for. Something that takes a big ugly blob of JSON and makes it... less. Without losing the parts that matter.

What I'm curious about is how it decides what to keep. That's always the tricky bit, right? I've tried piping things through jq queries before, and it works fine when I know exactly what I'm looking for. But sometimes I don't know what I'm looking for yet, I just know that 400 lines of output isn't helping me find it. Is this smarter about that? Does it have opinions about what's signal versus noise, or is it more of a formatting thing?

I'm also wondering how it handles the kind of deeply nested stuff Azure loves to return. You know the ones, where the actual value you need is five levels deep inside some property called `properties` inside another property also called `properties`. Classic.

Anyway, I'm going to try throwing some of my messier outputs at it this week and see what happens. Might be useful, might not fit how I work at all. But it's the kind of small utility that could save a surprising amount of squinting at terminal windows if it clicks. I was actually fighting with a particularly gnarly NSG rule export on Friday afternoon when I saw this come across my feed, which is probably why it caught my attention so quickly.
