import { afterEach, describe, expect, it, vi } from "vitest";
import { getChangelog } from "./changelog";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getChangelog", () => {
  it("maps published releases and renders markdown bodies to HTML", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            tag_name: "v1.2.0",
            name: "v1.2.0 — Feature",
            body: "- did a thing",
            published_at: "2026-01-01T00:00:00Z",
            html_url: "https://github.com/x/y/releases/tag/v1.2.0",
            draft: false,
            prerelease: false,
          },
        ]),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { entries, ok } = await getChangelog();

    expect(ok).toBe(true);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ tag: "v1.2.0", title: "v1.2.0 — Feature" });
    expect(entries[0].bodyHtml).toContain("<li>did a thing</li>");
  });

  it("falls back to the tag name when the release has no name", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            tag_name: "v1.0.0",
            name: null,
            body: "",
            published_at: null,
            html_url: "https://example.com",
            draft: false,
            prerelease: false,
          },
        ]),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { entries } = await getChangelog();
    expect(entries[0].title).toBe("v1.0.0");
    expect(entries[0].publishedAt).toBe("");
  });

  it("filters out draft and prerelease entries", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          { tag_name: "v1", name: "v1", body: "", published_at: null, html_url: "", draft: true, prerelease: false },
          { tag_name: "v2", name: "v2", body: "", published_at: null, html_url: "", draft: false, prerelease: true },
          { tag_name: "v3", name: "v3", body: "", published_at: null, html_url: "", draft: false, prerelease: false },
        ]),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { entries } = await getChangelog();
    expect(entries.map((e) => e.tag)).toEqual(["v3"]);
  });

  it("returns ok: false and no entries when the GitHub API responds with an error", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("nope", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const { entries, ok } = await getChangelog();
    expect(ok).toBe(false);
    expect(entries).toEqual([]);
  });

  it("returns ok: false and no entries when the fetch itself throws", async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const { entries, ok } = await getChangelog();
    expect(ok).toBe(false);
    expect(entries).toEqual([]);
  });
});
