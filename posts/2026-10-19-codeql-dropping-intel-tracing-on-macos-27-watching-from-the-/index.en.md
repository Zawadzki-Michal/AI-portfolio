---
title: "CodeQL dropping Intel tracing on macOS 27 — watching from the Azure side"
date: 2026-10-19
tags:
  - devops
  - automation
cta_text: "Working with CodeQL or dealing with architecture shifts in your pipelines? I'd love to hear how you're handling it."
cta_link: "/collaborate"
source_url: "https://github.blog/changelog/2026-10-19-codeql-changes-for-macos-27-xcode-27-and-swift-6-4"
---

Hi there. Came across something this morning that caught my attention even though it's not directly in my usual Azure wheelhouse — GitHub's [changelog post about CodeQL changes for macOS 27 and Xcode 27](https://github.blog/changelog/2026-10-19-codeql-changes-for-macos-27-xcode-27-and-swift-6-4).

The gist is that Apple's dropping Intel code from some system binaries and libraries that CodeQL uses to trace builds. So if you're running code analysis on Swift projects with the newer tooling, there's a shift happening under the hood.

I don't work with Swift or Xcode day to day. My work is mostly Azure infrastructure, Terraform, the usual DevOps pipeline stuff on Linux and Windows. But I still found myself reading through it a couple of times, because architecture transitions like this — one platform quietly pulling the rug out from tooling that depended on how things used to work — that's a pattern I keep seeing everywhere.

It reminds me of smaller moments I've hit where an update to a base image or a runtime version broke something in a pipeline that had been humming along for months. You don't think about the assumptions baked into your tooling until one of them isn't true anymore. And then you're scrambling to figure out what changed and why the logs suddenly look different.

I'm curious how teams that do rely on CodeQL for their macOS builds are handling this. Do you just update and hope the new tracing method works the same? Is there a testing period where you run both in parallel somehow? I genuinely don't know how that would look in practice for a Swift codebase.

From where I sit, it's also a reminder that even when you're not on a particular platform, keeping half an eye on these kinds of changes can be useful. The next time someone asks about code analysis options or CI/CD for a mixed-platform project, knowing that macOS tooling is in the middle of an architecture shift might actually be relevant.

Anyway, one of those changelog entries that isn't for me, and I ended up thinking about it longer than I expected to.
