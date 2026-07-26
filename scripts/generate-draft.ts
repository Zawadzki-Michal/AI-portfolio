/**
 * Scheduled job: pulls recent items from configured RSS feeds, skips any
 * item already covered by an existing post (matched by front-matter
 * `source_url`), asks a model via OpenRouter to draft a post in the site's
 * voice (instructions in automation/draft-instructions.md) in both English
 * and Polish, and writes them to posts/YYYY-MM-DD-slug/index.en.md and
 * index.pl.md. The GitHub Action step that runs this script then opens a
 * PR for human review — nothing here publishes automatically.
 *
 * Required env vars:
 *   OPENROUTER_API_KEY
 * Optional env vars:
 *   RSS_FEEDS         comma-separated feed URLs (defaults below)
 *   OPENROUTER_MODEL  defaults to anthropic/claude-opus-4.5
 */

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import matter from "gray-matter";
import { slugify } from "../lib/slugify";
import { getAllSourceUrls } from "../lib/posts";
import { stripCodeFence } from "../lib/markdown";
import type { Locale } from "../i18n/routing";

const LANGUAGE_NAMES: Record<Locale, string> = { en: "English", pl: "Polish" };

const POSTS_DIR = path.join(process.cwd(), "posts");
const INSTRUCTIONS_PATH = path.join(process.cwd(), "automation", "draft-instructions.md");
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-opus-4.5";

const DEFAULT_FEEDS = [
  "https://azure.microsoft.com/en-us/updates/feed/",
  "https://devblogs.microsoft.com/devops/feed/",
  "https://www.hashicorp.com/blog/feed.xml",
  "https://github.blog/changelog/feed/",
  "https://simonwillison.net/atom/everything/",
];

type FeedItem = {
  title: string;
  link: string;
  summary: string;
  source: string;
  isoDate: string;
};

async function collectFeedItems(feedUrls: string[]): Promise<FeedItem[]> {
  // Some feed hosts reject requests with no/generic User-Agent (403s seen
  // in testing against devblogs.microsoft.com, github.blog, simonwillison.net).
  const parser = new Parser({
    timeout: 15_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PersonalBrandBot/1.0; +https://github.com/Zawadzki-Michal/ai-portfolio)",
    },
  });
  const items: FeedItem[] = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        if (!item.link) continue;
        items.push({
          title: item.title ?? "",
          link: item.link,
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

async function draftPost(item: FeedItem, locale: Locale): Promise<string> {
  const apiKey = requireEnv("OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const today = new Date().toISOString().slice(0, 10);
  const systemPrompt = fs.readFileSync(INSTRUCTIONS_PATH, "utf8");

  const userPrompt = `Source item:
Title: ${item.title}
Source: ${item.source}
Link: ${item.link}
Summary: ${item.summary}

Today's date (use as front-matter "date"): ${today}
Source link (use as front-matter "source_url"): ${item.link}

Write the entire article body in ${LANGUAGE_NAMES[locale]}. The "title" in
front-matter should also be in ${LANGUAGE_NAMES[locale]}. Keep front-matter
keys themselves in English (title, date, tags, cta_text, cta_link,
source_url) — only their values change language.`;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.SITE_URL || "https://github.com",
      "X-Title": "Personal Brand Draft Generator",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text: string | undefined = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenRouter response contained no content");
  }

  return stripCodeFence(text);
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
  const seenUrls = getAllSourceUrls();
  const candidate = items.find((item) => !seenUrls.has(item.link));

  if (!candidate) {
    console.log("No new (un-drafted) feed items found. Skipping draft generation.");
    return;
  }

  console.log(`Drafting post from: "${candidate.title}" (${candidate.source})`);

  const englishMarkdown = await draftPost(candidate, "en");
  const { data: englishFrontMatter } = matter(englishMarkdown);

  const today = new Date().toISOString().slice(0, 10);
  const slug = `${today}-${slugify(englishFrontMatter.title ?? candidate.title)}`;
  const dir = path.join(POSTS_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.en.md"), englishMarkdown + "\n");
  console.log(`Draft written to posts/${slug}/index.en.md`);

  const polishMarkdown = await draftPost(candidate, "pl");
  fs.writeFileSync(path.join(dir, "index.pl.md"), polishMarkdown + "\n");
  console.log(`Draft written to posts/${slug}/index.pl.md`);
}

// Force-exit on completion: open keep-alive sockets from fetch()/rss-parser
// can otherwise leave the event loop alive and hang the CI job indefinitely.
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
