---
title: "Two Months of OpenCode Habits, Gone in a Few Days"
date: 2026-08-05
tags:
  - ai
  - automation
  - devops
cta_text: "Found dead code like this in your own agent setup? I'd like to hear about it."
cta_link: "/collaborate"
source_url: "https://addyosmani.com/blog/agent-harness-engineering/"
---

Hey, it's Michał. We only switched to Claude Code at work a few days ago, and tonight after work, kids finally asleep, I grabbed my last coffee of the day and placed it next to the laptop, then actually had time to sit with what that switch meant for my setup instead of just patching things enough to limp through the workday.

I've had my own OpenCode running for a few months before the switch, and I'm a little embarrassed by how attached I'd gotten to it. This is where I actually learned how to use AI, not just in a browser with a clean session every time. All the custom skills I'd written myself, a hand-rolled connection to our internal ticketing system, other connections that supported the agent in daily tasks, a little local database of support notes I could query, a pile of small Python scripts I reached for without remembering when I'd written half of them. Two months doesn't sound like long, but it was long enough that I'd stopped thinking of it as a tool and started thinking of it as just how my job worked. Then the switch happened, and a lot of that muscle memory stopped applying overnight, and honestly, it stung a bit more than I expected it to.

At first I tried to just carry everything over as-is, and it mostly seemed to work, which in hindsight was the misleading part, and also kind of a relief I probably didn't deserve. Tickets still came back when I asked for them. Skills still ran. Good enough, I thought, and went to bed that night not thinking about it again. It took actually sitting down tonight and going pillar by pillar, slower and grumpier than I wanted to be, to see how much of that was surface-level.

The tool connections were the first pillar, and the most obvious once I actually looked instead of just glancing. My skills were calling things using OpenCode's naming and calling conventions, and Claude Code doesn't work that way at all. Some of it had been quietly propped up by a fallback that stepped in whenever the real connection failed, so on the surface nothing looked broken, it just wasn't actually doing what I thought it was doing. Finding that felt like catching myself having quietly fooled myself for two weeks straight.

The second pillar was the skills themselves, not just what they called but how they were written. OpenCode and Claude Code structure that stuff differently enough that a straight copy-paste gets you something that loads without erroring and still doesn't behave right, which is almost worse than an obvious failure, because nothing nags you to go check it.

The third pillar took the most time and gave me the closest thing to an actual scare tonight: the config file the agent reads before doing anything at all. Mine had grown, over months of OpenCode use, into something like a thousand lines loading on every single session whether it was relevant or not. I rebuilt it as a router instead, a small always-on core plus a table pointing to detail files that only load when the situation calls for them. Cutting it down felt satisfying right up until I nearly deleted a few rules buried in there that were only a couple of lines each but genuinely mattered, the kind of thing that keeps you from looking careless in front of an actual customer. My stomach did a small drop when I realised how close I'd come. I only caught it by comparing old and new side by side before I let myself delete anything, which I'm choosing to call foresight, though it was probably luck.

Somewhere in the middle of tonight, tired and a little proud of myself in a way I probably hadn't earned yet, I went back to something I'd bookmarked a while ago and never got round to: Addy Osmani's writing on [agent harness engineering](https://addyosmani.com/blog/agent-harness-engineering/). It named something I'd been circling for hours without a word for it: the model is the model, and everything I'd spent the evening rebuilding, the config, the skills, the connections, is a separate thing sitting around it. He puts it plainly: "It's not a model problem. It's a configuration problem." Reading that at almost midnight felt like being handed a label for a mess I'd already been elbow-deep in for hours.

What tonight actually gave me was a smaller, less flattering realisation: how much of my own setup I'd stopped examining, simply because it had been running quietly for two months and nothing had ever forced me to look. A harness you build up slowly doesn't announce which parts of it you actually understand and which parts you'd just gotten used to trusting.

We're only a few days into this switch as a team, so there's probably more of this waiting for me. I'm a bit tired writing this, if it's not obvious. Curious how everyone else handled the same jump, especially if you also had a setup you'd quietly gotten attached to before you had to move it.
