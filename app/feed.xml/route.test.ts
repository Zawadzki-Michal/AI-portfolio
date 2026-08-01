import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllPostsMock = vi.fn();
vi.mock("@/lib/posts", () => ({ getAllPosts: (...args: unknown[]) => getAllPostsMock(...args) }));

let GET: typeof import("./route").GET;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ GET } = await import("./route"));
});

describe("GET /feed.xml", () => {
  it("fetches English posts only", async () => {
    getAllPostsMock.mockReturnValue([]);
    await GET();
    expect(getAllPostsMock).toHaveBeenCalledWith("en");
  });

  it("serves valid RSS XML with the right content type", async () => {
    getAllPostsMock.mockReturnValue([
      { slug: "my-post", title: "My Post", date: "2026-01-01", tags: ["ai"], linkedin_description: "A short teaser" },
    ]);

    const res = await GET();

    expect(res.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    const xml = await res.text();
    expect(xml).toContain("<rss version=\"2.0\">");
    expect(xml).toContain("<title>My Post</title>");
    expect(xml).toContain("<description>A short teaser</description>");
    expect(xml).toContain("/en/posts/my-post");
  });

  it("falls back to the tag list when there's no linkedin_description", async () => {
    getAllPostsMock.mockReturnValue([{ slug: "x", title: "X", date: "2026-01-01", tags: ["ai", "devops"] }]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<description>ai, devops</description>");
  });

  it("escapes XML-significant characters in titles and descriptions", async () => {
    getAllPostsMock.mockReturnValue([
      { slug: "x", title: "Cats & Dogs <3", date: "2026-01-01", tags: [], linkedin_description: 'He said "hi" & left' },
    ]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<title>Cats &amp; Dogs &lt;3</title>");
    expect(xml).toContain("<description>He said &quot;hi&quot; &amp; left</description>");
    expect(xml).not.toContain("<3</title>");
  });
});
