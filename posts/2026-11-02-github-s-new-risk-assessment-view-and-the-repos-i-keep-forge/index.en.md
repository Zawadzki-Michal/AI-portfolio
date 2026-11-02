---
title: "GitHub's new risk assessment view and the repos I keep forgetting about"
date: 2026-11-02
tags:
  - devops
  - automation
cta_text: "Got any repos lurking in the corner you'd forgotten about? I'd be curious to hear how you keep track."
cta_link: "/collaborate"
source_url: "https://github.blog/changelog/2026-11-02-security-risk-assessments-include-repository-protection-status"
---

Hi there. Spotted something in the GitHub changelog this morning that made me wince a little, in a good way.

GitHub's security risk assessments now [show whether your findings live in protected or unprotected repositories](https://github.blog/changelog/2026-11-02-security-risk-assessments-include-repository-protection-status). Which sounds simple enough, but it immediately made me think about a handful of repos I know I've left sitting around without branch protection rules, without any secret scanning enabled, basically without anything resembling guardrails.

I do know better. Those repos started as quick experiments or one-off scripts, and then they just... stayed there. Some of them have actual credentials hardcoded in old commits because past-me thought "I'll clean that up later" and then never did. The idea that a dashboard could now surface exactly which of my findings are sitting in those unprotected corners is both useful and slightly uncomfortable.

I think what I like about this update is that it connects the vulnerability count to something you can actually act on. A secret exposed in a repo with no protection rules is a different kind of urgent than one in a repo where you've at least got some baseline controls. Knowing that difference helps you figure out where to spend your time first.

What I'm less clear on is how this works in practice for organisations with hundreds of repos, some of which were created years ago by people who've since left. Does this make it easier to find those orphaned experiments that nobody remembers owning? Or does it just add another column to a spreadsheet that's already overwhelming? I genuinely don't know yet.

For my own setup, which is small, this is probably just the nudge I need to go back and either archive the junk repos or actually turn on protection for the ones I'm still using. I keep saying I'll do a cleanup weekend. Maybe this is the weekend.
