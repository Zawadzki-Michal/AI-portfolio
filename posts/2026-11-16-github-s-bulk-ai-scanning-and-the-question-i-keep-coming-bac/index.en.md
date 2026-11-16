---
title: "GitHub's bulk AI scanning and the question I keep coming back to"
date: 2026-11-16
tags:
  - ai
  - devops
  - automation
cta_text: "Curious if anyone's already tried this at scale — how noisy is it really?"
cta_link: "/collaborate"
source_url: "https://github.blog/changelog/2026-11-16-bulk-start-ai-scan-for-repositories"
---

Hi there. Sat down this evening and spotted something in the GitHub changelog that caught my attention: you can now [bulk start AI Scan across repositories](https://github.blog/changelog/2026-11-16-bulk-start-ai-scan-for-repositories). Across the board if you want, all at once.

The pitch is that this AI scanning finds vulnerabilities that CodeQL misses, covers languages CodeQL doesn't touch, and surfaces additional issues even in languages CodeQL already handles. Okay, that sounds useful on paper. But I keep circling back to the same question I have with a lot of these AI-augmented security tools: what does the signal-to-noise ratio actually look like when you turn it loose on, say, fifty repos at once?

I've been through enough dependency scanner alerts to know that "more findings" doesn't automatically mean "more useful." Sometimes it means three days of triaging false positives before you get to the one thing that actually matters. I'm not saying that's what this will be, I genuinely don't know yet. The appeal of covering more languages is real though. At work we've got a mix of things, and the gaps in what CodeQL catches have come up before.

What I find myself wondering is whether this is the kind of tool you'd enable once, let it run, and then iterate on the noise level, or if it's more of a targeted thing you'd point at specific repos where you already suspect there's something lurking. The bulk option suggests GitHub thinks people want the full sweep approach. Maybe that's right. Maybe the AI is good enough now that the extra findings are genuinely worth having.

I haven't tried it yet, so I'm speculating here. But the tension between "scan everything, see what shakes out" and "please don't bury me in alerts I can't act on" is something I think about more than I probably should.

Might spin it up on a smaller set of repos first just to see what comes back. The worst case is I learn something about what it flags and what it doesn't, which is still more than I know right now.
