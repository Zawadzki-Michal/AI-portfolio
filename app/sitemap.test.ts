import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posts", () => ({
  getAllPosts: (locale: string) => [{ slug: `post-${locale}`, date: "2026-01-01" }],
  getAllTags: (locale: string) => [{ tag: `tag-${locale}`, count: 1 }],
}));

vi.mock("@/lib/projects", () => ({
  getProjects: (locale: string) => [{ slug: `project-${locale}` }],
}));

const { default: sitemap } = await import("./sitemap");
const { siteConfig } = await import("@/lib/site-config");

describe("sitemap", () => {
  it("includes static paths, posts, projects, and tags for every locale", () => {
    const entries = sitemap();

    expect(entries).toContainEqual({ url: `${siteConfig.url}/en`, changeFrequency: "weekly" });
    expect(entries).toContainEqual({ url: `${siteConfig.url}/pl`, changeFrequency: "weekly" });
    expect(entries).toContainEqual(
      expect.objectContaining({ url: `${siteConfig.url}/en/posts/post-en`, changeFrequency: "monthly" }),
    );
    expect(entries).toContainEqual({ url: `${siteConfig.url}/en/projects/project-en`, changeFrequency: "monthly" });
    expect(entries).toContainEqual({ url: `${siteConfig.url}/en/tags/tag-en`, changeFrequency: "weekly" });
  });

  it("does not include a /search entry", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url.endsWith("/search"))).toBe(false);
  });

  it("URL-encodes tag names", () => {
    vi.doMock("@/lib/posts", () => ({
      getAllPosts: () => [],
      getAllTags: () => [{ tag: "c++", count: 1 }],
    }));
    vi.resetModules();
    return import("./sitemap").then(({ default: freshSitemap }) => {
      const entries = freshSitemap();
      expect(entries.some((e) => e.url.includes("/tags/c%2B%2B"))).toBe(true);
    });
  });
});
