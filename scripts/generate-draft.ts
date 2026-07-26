/**
 * Scheduled job: pulls recent items from configured RSS feeds, asks Claude
 * to draft a post in the site's voice and front-matter format, and writes
 * it to posts/YYYY-MM-DD-slug/index.md. The GitHub Action step that runs
 * this script then opens a PR with the new file for human review — nothing
 * here publishes automatically.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 * Optional env vars:
 *   RSS_FEEDS   comma-separated feed URLs (defaults below)
 */

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import Anthropic from "@anthropic-ai/sdk";

const POSTS_DIR = path.join(process.cwd(), "posts");

const DEFAULT_FEEDS = [
  "https://azure.microsoft.com/en-us/updates/feed/",
  "https://devblogs.microsoft.com/devops/feed/",
  "https://www.anthropic.com/news/rss.xml",
];

type FeedItem = {
  title: string;
  link: string;
  summary: string;
  source: string;
  isoDate: string;
};

async function collectFeedItems(feedUrls: string[]): Promise<FeedItem[]> {
  const parser = new Parser();
  const items: FeedItem[] = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        items.push({
          title: item.title ?? "",
          link: item.link ?? "",
          summary: item.contentSnippet ?? item.content ?? "",
          source: feed.title ?? url,
          isoDate: item.isoDate ?? new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`Failed to fetch feed ${url}:`, err);
    }
  }

  return items.sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function draftPost(item: FeedItem): Promise<string> {
  const anthropic = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  const today = new Date().toISOString().slice(0, 10);

  const systemPrompt = `You write for a personal engineering blog by a System Engineer working on Azure (IP whitelisting, Terraform, disaster recovery) who is deep into applied AI and DevOps. Voice: direct, technical, no hype, first person, grounded in real practice. Output ONLY a complete Markdown file: YAML front-matter followed by the article body. No commentary before or after.`;

  const userPrompt = `Source item:
Title: ${item.title}
Source: ${item.source}
Link: ${item.link}
Summary: ${item.summary}

Write a short (300-500 word) blog post reacting to or building on this item, from the author's Azure/AI/DevOps perspective. Reference the source link inline where relevant.

Use exactly this front-matter shape:
---
title: "..."
date: ${today}
tags: [tag1, tag2]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
---

Pick 2-4 relevant lowercase tags from: azure, ai, devops, terraform, disaster-recovery, automation, linkedin.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response contained no text block");
  }
  return textBlock.text.trim();
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function main() {
  const feedUrls = process.env.RSS_FEEDS
    ? process.env.RSS_FEEDS.split(",").map((s) => s.trim())
    : DEFAULT_FEEDS;

  const items = await collectFeedItems(feedUrls);
  if (items.length === 0) {
    console.log("No feed items found. Skipping draft generation.");
    return;
  }

  const chosen = items[0];
  console.log(`Drafting post from: "${chosen.title}" (${chosen.source})`);

  const markdown = await draftPost(chosen);
  const today = new Date().toISOString().slice(0, 10);
  const slug = `${today}-${slugify(chosen.title)}`;
  const dir = path.join(POSTS_DIR, slug);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.md"), markdown + "\n");

  console.log(`Draft written to posts/${slug}/index.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
