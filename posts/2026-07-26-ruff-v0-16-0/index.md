---
title: "Ruff keeps getting faster and I keep not caring about linter benchmarks"
date: 2026-07-26
tags: [devops, automation]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/25/ruff/#atom-everything"
---

Simon Willison [flagged the Ruff v0.16.0 release](https://simonwillison.net/2026/Jul/25/ruff/#atom-everything) and it reminded me how little I think about linter performance in isolation anymore.

Ruff is absurdly fast. That was true at 0.1, and it's still true now. The release notes will mention some percentage improvement and I'll nod and move on. The bottleneck in my Python CI pipelines has never been "waiting for the linter." It's waiting for Terraform plan to finish talking to Azure APIs. It's waiting for container images to push. It's waiting for integration tests that actually hit infrastructure.

What I do care about is Ruff's expanding rule coverage. Every release adds more checks I used to need flake8 plugins for. Fewer moving parts in my pre-commit config. Fewer dependency version conflicts when someone on the team runs `pip install` on a fresh machine.

The real win for me is consistency across projects. I maintain several internal tools and a handful of automation scripts that deploy Azure resources. Some are three years old. Some I wrote last month. Before Ruff, each had its own snowflake combination of pylint, flake8, isort, black. Now I drop in a `ruff.toml` and the whole mess collapses into one tool.

Speed matters most at the moment of adoption. When I'm convincing a team to add linting to a repo that never had it, "this will add 200ms to your commit hook" is an easier sell than "this will add 45 seconds." But once it's in place, I forget about the runtime entirely.

The thing I actually watch is whether the tool stays opinionated enough to prevent bikeshedding. Ruff's defaults are aggressive. That's a feature. I don't want to debate quote styles in code review for an Azure Function that sends alerts to Teams.

If you're still running a patchwork of Python linters, v0.16 is as good an excuse as any to migrate. The performance is a nice side effect. The real payoff is one fewer thing to debug when your CI pipeline breaks at 2am because some transitive dependency bumped a flake8 plugin.
