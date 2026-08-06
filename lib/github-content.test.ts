import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  process.env.GITHUB_ADMIN_TOKEN = "test-token";
});

afterEach(() => {
  delete process.env.GITHUB_ADMIN_TOKEN;
  vi.unstubAllGlobals();
});

describe("listDirectory", () => {
  it("throws when GITHUB_ADMIN_TOKEN is unset", async () => {
    delete process.env.GITHUB_ADMIN_TOKEN;
    const { listDirectory } = await import("./github-content");
    await expect(listDirectory("posts")).rejects.toThrow(/GITHUB_ADMIN_TOKEN/);
  });

  it("returns an empty array on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("not found", { status: 404 })));
    const { listDirectory } = await import("./github-content");
    expect(await listDirectory("posts/missing")).toEqual([]);
  });

  it("wraps a single-file response in an array", async () => {
    const file = { name: "index.en.md", path: "posts/x/index.en.md", sha: "abc", type: "file", size: 10 };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(file), { status: 200 })));
    const { listDirectory } = await import("./github-content");
    expect(await listDirectory("posts/x/index.en.md")).toEqual([file]);
  });

  it("throws with the response body on other errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("boom", { status: 500 })));
    const { listDirectory } = await import("./github-content");
    await expect(listDirectory("posts")).rejects.toThrow(/listDirectory\(posts\) failed: 500/);
  });

  it("sends the auth header and API version", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { listDirectory } = await import("./github-content");
    await listDirectory("posts");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/repos/Zawadzki-Michal/AI-portfolio/contents/posts?ref=main");
    expect(init.headers.Authorization).toBe("Bearer test-token");
  });
});

describe("getFile", () => {
  it("returns null on 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("nope", { status: 404 })));
    const { getFile } = await import("./github-content");
    expect(await getFile("posts/x/index.en.md")).toBeNull();
  });

  it("decodes base64 content and returns the sha", async () => {
    const content = Buffer.from("hello world").toString("base64");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ content, sha: "sha123" }), { status: 200 })),
    );
    const { getFile } = await import("./github-content");
    expect(await getFile("posts/x/index.en.md")).toEqual({ content: "hello world", sha: "sha123" });
  });
});

describe("putFile", () => {
  it("base64-encodes utf8 content by default", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { putFile } = await import("./github-content");

    await putFile({ path: "posts/x/index.en.md", content: "hello", message: "add post" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/repos/Zawadzki-Michal/AI-portfolio/contents/posts/x/index.en.md");
    expect(init.method).toBe("PUT");
    const body = JSON.parse(init.body as string);
    expect(body.content).toBe(Buffer.from("hello").toString("base64"));
    expect(body.message).toBe("add post");
    expect(body.branch).toBe("main");
  });

  it("passes base64 content through unchanged when encoding is base64", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { putFile } = await import("./github-content");

    await putFile({ path: "posts/x/img.png", content: "QUJD", message: "add image", encoding: "base64" });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.content).toBe("QUJD");
  });

  it("throws with response body on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("conflict", { status: 409 })));
    const { putFile } = await import("./github-content");
    await expect(putFile({ path: "p", content: "c", message: "m" })).rejects.toThrow(/putFile\(p\) failed: 409/);
  });
});

describe("deleteFile", () => {
  it("sends a DELETE with the sha and message", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { deleteFile } = await import("./github-content");

    await deleteFile({ path: "posts/x/img.png", sha: "sha1", message: "remove image" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("DELETE");
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({ message: "remove image", sha: "sha1", branch: "main" });
  });
});

describe("listPostSlugs", () => {
  it("returns only directory entries under posts/", async () => {
    const entries = [
      { name: "post-a", path: "posts/post-a", sha: "1", type: "dir", size: 0 },
      { name: "README.md", path: "posts/README.md", sha: "2", type: "file", size: 10 },
      { name: "post-b", path: "posts/post-b", sha: "3", type: "dir", size: 0 },
    ];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(entries), { status: 200 })));
    const { listPostSlugs } = await import("./github-content");
    expect(await listPostSlugs()).toEqual(["post-a", "post-b"]);
  });
});

describe("deletePost", () => {
  it("deletes every file entry in the post's folder", async () => {
    const entries = [
      { name: "index.en.md", path: "posts/x/index.en.md", sha: "sha1", type: "file", size: 1 },
      { name: "index.pl.md", path: "posts/x/index.pl.md", sha: "sha2", type: "file", size: 1 },
      { name: "images", path: "posts/x/images", sha: "sha3", type: "dir", size: 0 },
    ];
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(entries), { status: 200 }))
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { deletePost } = await import("./github-content");

    await deletePost("x", "content: delete post x");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][1].method).toBe("DELETE");
    expect(fetchMock.mock.calls[2][1].method).toBe("DELETE");
  });
});
