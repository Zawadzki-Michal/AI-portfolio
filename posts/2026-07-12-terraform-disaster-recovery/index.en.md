---
title: "What disaster recovery drills taught me that the docs didn't"
date: 2026-07-12
tags: [azure, terraform, disaster-recovery]
cta_text: "Been through something similar? I'd like to hear about it"
cta_link: "/collaborate"
---

I've been part of a few disaster recovery drills for our Azure workloads
recently, and it's made me rethink something I used to assume: that if the
infrastructure is in Terraform, recovery is basically solved. It isn't, and
it took actually sitting through a drill for that to click.

Terraform gets you to a known state. It does not tell you what to do at
3am when a region is down and someone's asking for an ETA. Those are
different problems, and I hadn't really separated them in my head before.

A few things that stuck with me:

Your `.tfstate` describes what should exist, not what to do when it
doesn't. I knew that in theory. Watching a drill made it concrete.

Failover regions need the same IP whitelisting rules as production,
provisioned ahead of time — not figured out mid-incident. This one I
genuinely hadn't thought about until someone more experienced than me
pointed it out.

A runbook nobody's actually run through is closer to a hypothesis than a
procedure. I'm still working out how much of DR is the code and how much
is just people knowing what to do and trusting each other under pressure.
I suspect it's more of the second than I assumed a few months ago.
