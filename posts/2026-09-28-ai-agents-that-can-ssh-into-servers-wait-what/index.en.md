---
title: "AI agents that can SSH into servers — wait, what?"
date: 2026-09-28
tags:
  - ai
  - devops
  - automation
cta_text: "Anyone else thinking about how to give AI tools access to real systems without losing sleep? Would love to hear how you're approaching it."
cta_link: "/collaborate"
source_url: "https://www.hashicorp.com/blog/secure-ai-agents-with-hashicorp-boundary"
---

Hi there. So I came across [this HashiCorp post about securing AI agents with Boundary](https://www.hashicorp.com/blog/secure-ai-agents-with-hashicorp-boundary) last night after work and I've been turning it over in my head since.

The basic idea is that AI agents are starting to do more than just chat — they're actually reaching into infrastructure, running diagnostics, pulling logs, that kind of thing. Which sounds incredibly useful for troubleshooting, but also made me immediately nervous. Like, an AI that can SSH into a production server? My first reaction was just "no thank you."

But the more I read, the more I started to get why they structured it the way they did. The agent doesn't just get credentials and go wild. There's this whole workflow where a human still authenticates, Boundary proxies the connection, Vault handles the secrets (short-lived ones, injected at session time, never actually handed to the agent), and everything gets recorded and audited. The agent operates within the same access controls you'd apply to a person.

I don't work with Boundary day-to-day — my Azure world is more Entra ID and managed identities — but the zero trust framing makes sense to me. The agent doesn't get a direct network path to the target. It doesn't hold credentials. If something goes wrong, an admin can kill the session. That's AI on a very short leash with a lot of logging.

What I'm still chewing on is the human-in-the-loop piece. In their demo, a platform engineer still has to authenticate before the agent can open a session. That feels safer, but I wonder how long it lasts. Once this stuff proves itself, the pressure to remove that step will be real. And then what's the governance story?

I'm not building AI agents that touch infrastructure right now. But I am thinking more about how automation in general — Terraform runs, pipeline service principals, all of it — should probably have better session-level controls than I currently give them. This post kind of poked at that.

The idea of asking an AI to "investigate memory pressure on app-server-01" and having it actually go do that is wild to me. Useful, maybe, but wild.
