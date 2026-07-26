---
title: "Disaster recovery on Azure: what Terraform doesn't tell you"
date: 2026-07-12
tags: [azure, terraform, disaster-recovery]
cta_text: "Planning a DR strategy for your Azure estate? Let's talk"
cta_link: "/collaborate"
---

Terraform gets your infrastructure to a known state — it doesn't get you
through a failover at 3am. A few lessons from building DR runbooks around
Terraform-managed Azure environments:

- **State is not a recovery plan.** Your `.tfstate` describes what should
  exist, not what to do when a region is down.
- **IP whitelisting rules need a DR twin.** Failover regions need the same
  allow-lists as production, provisioned ahead of time, not during an
  incident.
- **Test the failover, not just the plan.** A DR runbook nobody has executed
  is a hypothesis, not a procedure.

The infrastructure-as-code layer is necessary but not sufficient — the
runbook around it is where resilience actually lives.
