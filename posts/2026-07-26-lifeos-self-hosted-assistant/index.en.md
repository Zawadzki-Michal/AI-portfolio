---
title: "I built an AI assistant that manages my life, then learned not to trust everything it tells me"
date: 2026-07-26
tags: [ai, self-hosted, automation]
cta_text: "Building something like this yourself? I'd like to hear how you're approaching it"
cta_link: "/collaborate"
---

For a while now I've been building an AI assistant for myself — not a demo,
something I actually use daily through Telegram and, more recently, a small
web app. It tracks goals, logs expenses, checks my calendar, all through
conversation instead of forms. Underneath it's a FastAPI backend that routes
between a local Ollama model and OpenRouter depending on how much a given
task actually needs.

The infrastructure side ended up being at least half the project, maybe
more. It started on a k3s cluster running inside WSL2 on my own machine,
with Grafana and Prometheus watching things like model latency and API
spend — and a few months in I moved production onto an actual Oracle Cloud
VM, Terraform-provisioned, with CI/CD that deploys on every push to main.
The original WSL2 setup is still running too, as a cold-standby I haven't
had the nerve to tear down yet. None of that was really the point when I
started — I just wanted a bot that could add a calendar event without me
opening five apps — but I kept pulling on threads (voice input, then
output, then "why not deploy this properly," then "why not deploy this
somewhere that isn't my gaming PC") until I ended up with something closer
to a real production stack than I expected to build for myself.

Moving it to the cloud came with its own small detour: the cluster still
needs to reach an Ollama model running back on my home machine, and
Tailscale connects the two fine from a normal shell — but pods on the
cluster couldn't resolve its hostnames at all, something about the
cluster's DNS running in a different network namespace than the one
Tailscale patches into. I never fully got to the bottom of why. I ended up
just hardcoding the Tailscale IP instead of the hostname, which works but
isn't the answer I actually wanted.

The thing that actually changed how I use it, though, wasn't a feature. It
was noticing that the model had, at least once, told me it saved something
to the database when it hadn't. Nothing catastrophic happened, but it was
enough to make me stop trusting a chat reply for anything that actually
matters — I keep a database admin panel open on the side now, specifically
so I can check what really happened instead of taking the assistant's word
for it. I didn't expect to need that going in, and I'm still not sure if
it's a model problem or a "give it a way to double-check itself" problem I
just haven't built yet.

Voice input/output was the fun part — recording a message, getting it
transcribed locally, hearing a spoken reply back — but it's also where I
learned the most about how quietly Docker bind-mounts can undo you. I'd
rebuild the frontend, restart the container, and nothing would change,
because the bind mount used for live-reload was shadowing whatever the
image had just built. Took longer than I'd like to admit to realize the fix
was rebuilding straight into the mounted folder instead of trusting the
image at all.

Is any of this necessary for an assistant only one person uses? Honestly,
no. But it's the first project where "learning DevOps by doing it" and
"wanting to actually use the thing I'm building" pointed the same
direction, instead of one being an excuse for the other.
