import { beforeEach, describe, expect, it, vi } from "vitest";
import { postUrl } from "./post-url";

const FIXTURE_FILES: Record<string, string> = {
  "posts/newer-post/index.en.md": `---
title: "Newer post itself to LinkedIn"
date: "2026-02-01"
tags: ["automation", "ai"]
cta_link: "/collaborate"
source_url: "https://example.com/newer"
---
1. Step one
2. Step two with a GitHub Action mention
`,
  "posts/newer-post/index.pl.md": `---
title: "Nowszy wpis o LinkedIn"
date: "2026-02-01"
tags: ["automation", "ai"]
cta_link: "/collaborate"
---
1. Krok pierwszy
`,
  "posts/older-post/index.en.md": `---
title: "Older post"
date: "2026-01-01"
tags: ["devops"]
---
Just some older content.
`,
};

vi.mock("fs", () => {
  const POSTS_DIR = "posts";
  return {
    default: {
      existsSync: (p: string) => {
        const key = p.split(/[\\/]/).join("/").replace(/^.*(posts(\/.*)?)$/, "$1");
        if (key === POSTS_DIR) return true;
        return key in FIXTURE_FILES;
      },
      readFileSync: (p: string) => {
        const key = p.split(/[\\/]/).join("/").replace(/^.*(posts\/.*)$/, "$1");
        if (!(key in FIXTURE_FILES)) throw new Error(`ENOENT: no fixture for ${p}`);
        return FIXTURE_FILES[key];
      },
      readdirSync: () => [
        { name: "newer-post", isDirectory: () => true },
        { name: "older-post", isDirectory: () => true },
      ],
    },
  };
});

let posts: typeof import("./posts");

beforeEach(async () => {
  vi.resetModules();
  posts = await import("./posts");
});

describe("posts", () => {
  it("lists all post slugs from the posts/ directory", () => {
    const slugs = posts.getAllPostSlugs();
    expect(slugs).toContain("newer-post");
    expect(slugs).toContain("older-post");
  });

  it("sorts posts by date, newest first", () => {
    const all = posts.getAllPosts("en");
    const dates = all.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("parses front-matter fields on a summary", () => {
    const summary = posts.getPostSummary("newer-post", "en");
    expect(summary.title).toContain("post itself to LinkedIn");
    expect(summary.tags).toContain("automation");
    expect(summary.cta_link).toBe("/collaborate");
  });

  it("resolves the requested locale's content", () => {
    const enSummary = posts.getPostSummary("newer-post", "en");
    const plSummary = posts.getPostSummary("newer-post", "pl");
    expect(enSummary.title).not.toBe(plSummary.title);
    expect(plSummary.title).toContain("LinkedIn");
  });

  it("falls back to the default locale when a translation doesn't exist", () => {
    const summary = posts.getPostSummary("older-post", "pl");
    expect(summary.title).toBe("Older post");
  });

  it("renders markdown content to HTML", async () => {
    const post = await posts.getPostBySlug("newer-post", "en");
    expect(post.contentHtml).toContain("<ol>");
    expect(post.contentHtml).toContain("GitHub Action");
  });

  it("builds a locale-prefixed post URL from its slug", () => {
    expect(postUrl("newer-post", "en")).toBe("/en/posts/newer-post");
    expect(postUrl("newer-post", "pl")).toBe("/pl/posts/newer-post");
  });
});

describe("collectSourceUrls", () => {
  const base: import("./posts").PostSummary = {
    slug: "x",
    title: "X",
    date: "2026-01-01",
    tags: [],
  };

  it("collects only posts that have a source_url", () => {
    const items: import("./posts").PostSummary[] = [
      { ...base, slug: "a", source_url: "https://example.com/a" },
      { ...base, slug: "b" },
      { ...base, slug: "c", source_url: "https://example.com/c" },
    ];
    expect(posts.collectSourceUrls(items)).toEqual(
      new Set(["https://example.com/a", "https://example.com/c"]),
    );
  });

  it("returns an empty set when no posts have a source_url", () => {
    expect(posts.collectSourceUrls([base])).toEqual(new Set());
  });
});
