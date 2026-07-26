import { describe, expect, it } from "vitest";
import { getAllPosts, getAllPostSlugs, getPostBySlug, getPostSummary, postUrl } from "./posts";

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
    expect(summary.title).toContain("personal brand pipeline");
    expect(summary.tags).toContain("automation");
    expect(summary.cta_link).toBe("/collaborate");
  });

  it("renders markdown content to HTML", async () => {
    const post = await getPostBySlug("2026-07-26-personal-brand-automation");
    expect(post.contentHtml).toContain("<h2>");
    expect(post.contentHtml).toContain("The flow");
  });

  it("builds a post URL from its slug", () => {
    expect(postUrl("2026-07-26-personal-brand-automation")).toBe(
      "/posts/2026-07-26-personal-brand-automation",
    );
  });
});
