import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

// Blog content is English-only (see README "Bilingual posts") — one feed,
// not a per-locale pair.
const FEED_LOCALE = "en";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts(FEED_LOCALE);

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/${FEED_LOCALE}/posts/${post.slug}`;
      const description = post.linkedin_description ?? post.tags.join(", ");
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Log</title>
    <link>${siteConfig.url}/${FEED_LOCALE}/posts</link>
    <description>${escapeXml(siteConfig.headline)}</description>
    <language>${FEED_LOCALE}</language>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
