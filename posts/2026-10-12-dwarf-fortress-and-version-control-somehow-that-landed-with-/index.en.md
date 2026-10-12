---
title: "Dwarf Fortress and version control, somehow that landed with me"
date: 2026-10-12
tags:
  - devops
  - automation
cta_text: "Anyone else find version control lessons in weird places? I'd genuinely like to hear about it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Oct/11/dwarf-fortress/"
---

Hi there. So this one's a bit of a stretch from my usual Azure and DevOps rambling, but bear with me.

I came across [this piece about Dwarf Fortress finally adopting version control](https://simonwillison.net/2026/Oct/11/dwarf-fortress/) and I just sat with it for a minute. Dwarf Fortress. The game that's been in development for over twenty years. The one with legendary complexity and a codebase that, by all accounts, has been held together by duct tape and one person's very specific memory of where everything lives. And now they're using version control.

I don't know why that hit me the way it did. Maybe because I've been two years into working with Azure infrastructure and I still catch myself thinking "oh, I'll just remember what I changed" before I push a Terraform config. How naive, right? I know better. I've seen what happens when you don't have a clean history to roll back to. And yet the impulse is still there, this weird confidence that my brain will track state better than Git will.

The Dwarf Fortress thing isn't really about games or indie development for me. I keep thinking about how long you can get away with skipping the obvious correct thing before reality forces your hand. Twenty-plus years is impressive, honestly. I've broken things in twenty-plus minutes that made me wish I'd committed more often.

I'm still not great at this, to be clear. My commit messages are inconsistent, I forget to branch when I should, and I've definitely done the thing where I make three unrelated changes and then try to describe them all in one message like "updated stuff." Not proud of it. Working on it.

What I keep coming back to is that version control isn't really about the tool. It's about admitting you're going to forget, you're going to break something, and future-you deserves a trail of breadcrumbs back to the last time things worked. Dwarf Fortress resisting that for so long and then finally giving in feels like a permission slip, somehow. If they can change a decades-old workflow, maybe my bad habits aren't permanent either.

I was reading this on Sunday evening, half-watching something on TV, and I ended up going back through my own recent commits just to see how bad the messages actually were. Worse than I remembered, if I'm honest. So maybe that's the takeaway here: even the most stubborn holdouts come around eventually, and I should probably commit more often.
