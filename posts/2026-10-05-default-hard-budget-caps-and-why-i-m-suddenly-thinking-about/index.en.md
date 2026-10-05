---
title: "Default hard budget caps, and why I'm suddenly thinking about guardrails"
date: 2026-10-05
tags:
  - ai
  - azure
  - automation
cta_text: "You running into similar cost-surprise moments? Would love to hear how you're handling it."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/"
---

Hi there. So I read Simon Willison's piece on [default hard budget caps](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/) the other day and it's been rattling around in my head since.

The basic argument is that as AI services get embedded into more and more things, we're going to need hard spending limits baked in from the start, on by default. Otherwise people are going to get blindsided by costs they never saw coming.

And I think he's right. But what got me thinking wasn't the AI angle specifically, it was how much this mirrors stuff I've already run into with Azure.

Anyone who's worked with cloud infrastructure for more than a few months has a story about a runaway cost. Maybe a VM left running over a weekend, maybe a storage account that ballooned because nobody set a retention policy, maybe — and this one still stings a little — a logging solution that got very enthusiastic about how much telemetry it was ingesting. The cloud is pay-as-you-go, which sounds great until you realize "go" can mean "go very fast in a direction you didn't intend."

Azure has budget alerts, cost analysis tools, all of that. But alerts aren't caps. An alert tells you after the fact that something happened. A hard cap would have stopped it from happening in the first place.

I've been getting better at setting up budgets and alerts as part of my Terraform configs, making it part of the default deploy rather than something I remember to add later. But I'm still not doing hard caps, because honestly I'm not sure how you even do that cleanly in most scenarios without just breaking things. If your app hits a spending limit and just... stops... that's its own kind of problem.

Simon's talking about AI APIs specifically, but the principle is the same everywhere. The default should be bounded. Opt into more risk if you understand what you're doing.

I sat with this for a while after reading it, and I keep coming back to the same question: what would it actually look like to make guardrails the starting point for the stuff I touch day-to-day? I'm still working that out.
