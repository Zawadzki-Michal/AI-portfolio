---
title: "Running a small business's appointment reminders off a spare phone's SIM card"
date: 2026-07-26
tags: [ai, automation, devops]
cta_text: "Building something similar for someone in your life? I'd like to compare notes"
cta_link: "/collaborate"
---

Someone close to me runs a small, one-person, appointment-based business —
the kind of thing that used to run entirely on a paper calendar and a phone
number. Over the past few months I've been building the software behind
it: client records, a calendar that stays in sync with Google Calendar,
income tracking, and an AI chat assistant that can add a client or book a
session just from typing or saying a sentence instead of filling out a
form.

The part I didn't expect to spend the most time on was appointment
reminders. Every paid SMS API I looked at either charges per message in a
way that adds up fast for a single-person business, or wants a level of
setup that felt disproportionate to "send a text the day before an
appointment." So I ended up running a self-hosted SMS gateway on an old
Android phone with a real SIM card in it — the phone just stays online and
an app on it relays messages. It sounds like a hack, and I guess it is one,
but it's been reliable, and it means replies come back too — someone can
text "can we move this" and that reply shows up right in their profile,
like a normal chat thread, instead of disappearing into a phone nobody's
watching.

The AI side runs on a local model through Ollama rather than anything
cloud-based, mostly because client names, phone numbers, and notes are
exactly the kind of data I didn't want passing through a third-party API
just to save someone a few form fields. That constraint made the
tool-calling setup harder than I expected — getting a local model to
reliably pick the right function and fill in the right fields, instead of
inventing a client that doesn't exist, took more prompt iteration than I
want to admit.

None of this is groundbreaking engineering. It's a FastAPI backend, a
Postgres database, a React frontend that installs like an app on a phone,
and a lot of small integration decisions that only mattered because
someone real is using this daily to run their income. That last part
changed how carefully I test things — enough that I finally set up a real
GitHub Actions pipeline running the test suite against a throwaway Postgres
database on every push, instead of just running pytest locally and hoping
I remembered to before pushing. A bug in a personal project is annoying, a
bug that double-books someone's afternoon is a real problem for someone
else's day.
