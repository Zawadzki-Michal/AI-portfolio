---
title: "Ruff keeps getting faster and I keep not caring about lint performance"
date: 2026-07-26
tags: [devops, automation]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/25/ruff/#atom-everything"
---

Simon Willison [flagged the Ruff v0.16.0 release](https://simonwillison.net/2026/Jul/25/ruff/#atom-everything) and it reminded me how little I think about linter speed in my actual CI pipelines.

Ruff is absurdly fast. Everyone knows this. The Rust rewrite story is compelling and the benchmarks are real. But when I look at my pipeline telemetry, linting Python has never been the bottleneck. Terraform validation, Azure resource provisioning, container image builds — those eat minutes. Pylint or flake8 on a medium codebase? Maybe 30 seconds that nobody noticed.

This isn't a knock on Ruff. I switched months ago and stayed. The speed is nice but what actually kept me was the unified tooling. One binary handles formatting and linting. One config file. One thing to version-pin in my requirements. That operational simplicity matters more in my day-to-day than shaving 25 seconds off a lint job.

The release notes mention improved rule coverage and better error messages. Those are the features that change my workflow. When a linter catches something subtle before it hits code review, that's real value. When the error message points me to the exact fix instead of sending me to Stack Overflow, that's time saved.

I've seen teams obsess over CI performance in the wrong places. They'll parallelize test suites across four runners while ignoring the 90-second Terraform plan that runs on every PR. Or they'll cache aggressively but not measure what the cache actually skipped. Optimization without telemetry is just superstition.

If Ruff's speed matters to you — maybe you're linting a massive monorepo or running checks in a pre-commit hook where milliseconds add up — then v0.16.0 is probably worth the upgrade. For the rest of us, the real question is whether your pipeline is measuring the right things.

I keep a simple dashboard: time from PR open to green check, broken down by stage. Most of the red bars aren't linting. They're waiting for Azure to acknowledge that yes, this resource group does exist. Fix the slow things first.
