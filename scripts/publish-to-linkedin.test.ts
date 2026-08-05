import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_FILES: Record<string, string> = {
  "posts/with-image/index.en.md": `---
title: "With Image"
tags: ["ai", "automation"]
linkedin_description: "Custom LinkedIn blurb."
---
body
`,
  "posts/no-image/index.en.md": `---
title: "No Image"
tags: ["devops"]
---
body
`,
  "posts/with-image/cover.png": "fake-image-bytes",
};

const FIXTURE_DIRS: Record<string, string[]> = {
  "posts/with-image": ["index.en.md", "index.pl.md", "cover.png"],
  "posts/no-image": ["index.en.md"],
};

function normalize(p: string): string {
  return p.split(/[\\/]/).join("/").replace(/^.*(posts\/.*)$/, "$1");
}

vi.mock("fs", () => ({
  default: {
    readFileSync: (p: string) => {
      const key = normalize(p);
      if (!(key in FIXTURE_FILES)) throw new Error(`ENOENT: no fixture for ${p}`);
      return FIXTURE_FILES[key];
    },
    readdirSync: (p: string) => {
      const key = normalize(p);
      return FIXTURE_DIRS[key] ?? [];
    },
  },
}));

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("../lib/wait-for-url", () => ({
  waitForUrl: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../lib/linkedin", () => ({
  uploadImage: vi.fn().mockResolvedValue("urn:li:image:uploaded"),
  createPost: vi.fn().mockResolvedValue("urn:li:share:1"),
  contentTypeFor: () => "image/png",
}));

let mod: typeof import("./publish-to-linkedin");

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  mod = await import("./publish-to-linkedin");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("requireEnv", () => {
  it("returns the value when set", () => {
    process.env.SOME_TEST_VAR = "value";
    expect(mod.requireEnv("SOME_TEST_VAR")).toBe("value");
    delete process.env.SOME_TEST_VAR;
  });

  it("throws when unset", () => {
    delete process.env.SOME_TEST_VAR;
    expect(() => mod.requireEnv("SOME_TEST_VAR")).toThrow(/Missing required env var: SOME_TEST_VAR/);
  });
});

describe("getAddedPostSlugs", () => {
  it("extracts slugs from added index.en.md/index.pl.md files, deduped", async () => {
    const { execSync } = await import("child_process");
    (execSync as ReturnType<typeof vi.fn>).mockReturnValue(
      "posts/new-post/index.en.md\nposts/new-post/index.pl.md\nposts/other/index.en.md\n",
    );

    expect(mod.getAddedPostSlugs("base-sha", "head-sha")).toEqual(["new-post", "other"]);
  });

  it("ignores unrelated added files (e.g. an image, not an index file)", async () => {
    const { execSync } = await import("child_process");
    (execSync as ReturnType<typeof vi.fn>).mockReturnValue("posts/new-post/cover.png\n");

    expect(mod.getAddedPostSlugs("base-sha", "head-sha")).toEqual([]);
  });

  it("returns an empty array when nothing was added under posts/", async () => {
    const { execSync } = await import("child_process");
    (execSync as ReturnType<typeof vi.fn>).mockReturnValue("");

    expect(mod.getAddedPostSlugs("base-sha", "head-sha")).toEqual([]);
  });
});

describe("findImages", () => {
  it("returns only image files from the post's folder", () => {
    expect(mod.findImages("with-image")).toEqual([
      expect.stringContaining(path.join("with-image", "cover.png")),
    ]);
  });

  it("returns an empty array when the post has no image files", () => {
    expect(mod.findImages("no-image")).toEqual([]);
  });
});

describe("fetchOgImageBuffer", () => {
  it("returns the response body on a 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), { status: 200 })),
    );

    const buffer = await mod.fetchOgImageBuffer("https://example.com/opengraph-image", 0);
    expect(Array.from(buffer)).toEqual([1, 2, 3]);
  });

  it("retries a non-ok response until it succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 404 }))
        .mockResolvedValueOnce(new Response(new Uint8Array([9]), { status: 200 })),
    );

    const buffer = await mod.fetchOgImageBuffer("https://example.com/opengraph-image", 0);
    expect(Array.from(buffer)).toEqual([9]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting all attempts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    await expect(mod.fetchOgImageBuffer("https://example.com/opengraph-image", 0)).rejects.toThrow(
      /Failed to fetch OG image/,
    );
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe("publishPost", () => {
  const linkedin = { accessToken: "token", authorUrn: "urn:li:person:abc" };

  it("uploads the post's own image files and never fetches an OG image fallback", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const { uploadImage, createPost } = await import("../lib/linkedin");

    await mod.publishPost("with-image", "https://example.com", linkedin);

    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(createPost).toHaveBeenCalledWith(
      linkedin,
      expect.objectContaining({
        linkUrl: "https://example.com/en/posts/with-image",
        title: "With Image",
        imageUrns: ["urn:li:image:uploaded"],
      }),
    );
  });

  it("falls back to the generated OG image when the post has no image files", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(new Uint8Array([1]), { status: 200 })));
    const { uploadImage, createPost } = await import("../lib/linkedin");

    await mod.publishPost("no-image", "https://example.com", linkedin);

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/en/posts/no-image/opengraph-image",
      expect.anything(),
    );
    expect(uploadImage).toHaveBeenCalledWith(linkedin, expect.any(Buffer), "image/png");
    expect(createPost).toHaveBeenCalledWith(
      linkedin,
      expect.objectContaining({ imageUrns: ["urn:li:image:uploaded"] }),
    );
  });

  it("propagates a failure to fetch the OG image fallback instead of publishing an imageless post", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const { createPost } = await import("../lib/linkedin");

    const result = expect(mod.publishPost("no-image", "https://example.com", linkedin)).rejects.toThrow(
      /Failed to fetch OG image/,
    );
    await vi.runAllTimersAsync();
    await result;
    expect(createPost).not.toHaveBeenCalled();
  });
});
