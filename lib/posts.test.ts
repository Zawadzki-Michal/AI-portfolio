import { describe, expect, it } from "vitest";
import {
  collectSourceUrls,
  getAllPosts,
  getAllPostSlugs,
  getPostBySlug,
  getPostSummary,
  postUrl,
  type PostSummary,
} from "./posts";

describe("posts", () => {
  it("lists all post slugs from the posts/ directory", () => {
    const slugs = getAllPostSlugs();
    expect(slugs).toContain("2026-07-26-personal-brand-automation");
    expect(slugs).toContain("2026-07-12-terraform-disaster-recovery");
  });

  it("sorts posts by date, newest first", () => {
    const posts = getAllPosts();
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("parses front-matter fields on a summary", () => {
    const summary = getPostSummary("2026-07-26-personal-brand-automation");
    expect(summary.title).toContain("post itself to LinkedIn");
    expect(summary.tags).toContain("automation");
    expect(summary.cta_link).toBe("/collaborate");
  });

  it("renders markdown content to HTML", async () => {
    const post = await getPostBySlug("2026-07-26-personal-brand-automation");
    expect(post.contentHtml).toContain("<ol>");
    expect(post.contentHtml).toContain("GitHub Action");
  });

  it("builds a post URL from its slug", () => {
    expect(postUrl("2026-07-26-personal-brand-automation")).toBe(
      "/posts/2026-07-26-personal-brand-automation",
    );
  });
});

describe("collectSourceUrls", () => {
  const base: PostSummary = {
    slug: "x",
    title: "X",
    date: "2026-01-01",
    tags: [],
  };

  it("collects only posts that have a source_url", () => {
    const posts: PostSummary[] = [
      { ...base, slug: "a", source_url: "https://example.com/a" },
      { ...base, slug: "b" },
      { ...base, slug: "c", source_url: "https://example.com/c" },
    ];
    expect(collectSourceUrls(posts)).toEqual(
      new Set(["https://example.com/a", "https://example.com/c"]),
    );
  });

  it("returns an empty set when no posts have a source_url", () => {
    expect(collectSourceUrls([base])).toEqual(new Set());
  });
});
