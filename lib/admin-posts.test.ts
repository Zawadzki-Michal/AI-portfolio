import { beforeEach, describe, expect, it, vi } from "vitest";

const listPostSlugs = vi.fn();
const getFile = vi.fn();
const listDirectory = vi.fn();
const putFile = vi.fn();
const deleteFile = vi.fn();
const deletePostFiles = vi.fn();

vi.mock("./github-content", () => ({
  listPostSlugs: (...args: unknown[]) => listPostSlugs(...args),
  getFile: (...args: unknown[]) => getFile(...args),
  listDirectory: (...args: unknown[]) => listDirectory(...args),
  putFile: (...args: unknown[]) => putFile(...args),
  deleteFile: (...args: unknown[]) => deleteFile(...args),
  deletePost: (...args: unknown[]) => deletePostFiles(...args),
}));

let adminPosts: typeof import("./admin-posts");

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  adminPosts = await import("./admin-posts");
});

const RAW_MARKDOWN = `---
title: My Post
date: '2026-01-01'
tags:
  - ai
  - devops
cta_text: Talk to me
cta_link: /collaborate
---
Body content here.
`;

describe("slugFor", () => {
  it("prefixes the slugified title with the date", () => {
    expect(adminPosts.slugFor({ title: "Hello World!", date: "2026-01-01" })).toBe("2026-01-01-hello-world");
  });
});

describe("listAdminPosts", () => {
  it("parses every post's front matter and sorts newest first", async () => {
    listPostSlugs.mockResolvedValue(["a", "b"]);
    getFile.mockImplementation(async (path: string) =>
      path.includes("/a/")
        ? { content: RAW_MARKDOWN.replace("2026-01-01", "2026-01-01"), sha: "sha-a" }
        : { content: RAW_MARKDOWN.replace("2026-01-01", "2026-02-01").replace("My Post", "Later Post"), sha: "sha-b" },
    );

    const posts = await adminPosts.listAdminPosts();

    expect(posts.map((p) => p.slug)).toEqual(["b", "a"]);
    expect(posts[0].title).toBe("Later Post");
    expect(posts[1].tags).toEqual(["ai", "devops"]);
  });

  it("skips slugs whose file is missing", async () => {
    listPostSlugs.mockResolvedValue(["a", "ghost"]);
    getFile.mockImplementation(async (path: string) => (path.includes("/a/") ? { content: RAW_MARKDOWN, sha: "s" } : null));

    const posts = await adminPosts.listAdminPosts();
    expect(posts.map((p) => p.slug)).toEqual(["a"]);
  });
});

describe("getAdminPost", () => {
  it("returns the parsed post plus non-markdown image files", async () => {
    getFile.mockResolvedValue({ content: RAW_MARKDOWN, sha: "sha-a" });
    listDirectory.mockResolvedValue([
      { name: "index.en.md", path: "posts/a/index.en.md", sha: "1", type: "file", size: 1 },
      { name: "shot.png", path: "posts/a/shot.png", sha: "2", type: "file", size: 2 },
    ]);

    const post = await adminPosts.getAdminPost("a");
    expect(post?.title).toBe("My Post");
    expect(post?.images).toEqual(["shot.png"]);
  });

  it("returns null when the post doesn't exist", async () => {
    getFile.mockResolvedValue(null);
    expect(await adminPosts.getAdminPost("missing")).toBeNull();
  });
});

describe("createAdminPost", () => {
  it("throws if a post already exists at that slug", async () => {
    getFile.mockResolvedValue({ content: RAW_MARKDOWN, sha: "existing" });

    await expect(
      adminPosts.createAdminPost({ title: "My Post", date: "2026-01-01", tags: [], body: "hi" }),
    ).rejects.toThrow(/already exists/);
    expect(putFile).not.toHaveBeenCalled();
  });

  it("writes front matter and body via putFile", async () => {
    getFile.mockResolvedValue(null);

    const { slug } = await adminPosts.createAdminPost({
      title: "My Post",
      date: "2026-01-01",
      tags: ["ai"],
      body: "Body content here.",
    });

    expect(slug).toBe("2026-01-01-my-post");
    expect(putFile).toHaveBeenCalledTimes(1);
    const call = putFile.mock.calls[0][0];
    expect(call.path).toBe("posts/2026-01-01-my-post/index.en.md");
    expect(call.content).toContain("title: My Post");
    expect(call.content).toContain("Body content here.");
  });
});

describe("updateAdminPost", () => {
  it("throws when the post doesn't exist", async () => {
    getFile.mockResolvedValue(null);
    await expect(adminPosts.updateAdminPost("missing", { title: "T", date: "2026-01-01", tags: [], body: "b" })).rejects.toThrow(
      /No post at/,
    );
  });

  it("passes the existing sha through to putFile", async () => {
    getFile.mockResolvedValue({ content: RAW_MARKDOWN, sha: "sha-a" });
    await adminPosts.updateAdminPost("a", { title: "Updated", date: "2026-01-01", tags: [], body: "b" });

    expect(putFile).toHaveBeenCalledWith(expect.objectContaining({ sha: "sha-a" }));
  });
});

describe("removePostImage", () => {
  it("no-ops when the named file isn't found", async () => {
    listDirectory.mockResolvedValue([]);
    await adminPosts.removePostImage("a", "missing.png");
    expect(deleteFile).not.toHaveBeenCalled();
  });

  it("deletes the matching file entry", async () => {
    listDirectory.mockResolvedValue([{ name: "shot.png", path: "posts/a/shot.png", sha: "sha1", type: "file", size: 1 }]);
    await adminPosts.removePostImage("a", "shot.png");
    expect(deleteFile).toHaveBeenCalledWith({ path: "posts/a/shot.png", sha: "sha1", message: expect.any(String) });
  });
});

describe("deleteAdminPost", () => {
  it("delegates to deletePost with a commit message", async () => {
    await adminPosts.deleteAdminPost("a");
    expect(deletePostFiles).toHaveBeenCalledWith("a", expect.stringContaining("a"));
  });
});

describe("parsePostForm", () => {
  function formWith(fields: Record<string, string>): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
  }

  it("throws when required fields are missing", () => {
    expect(() => adminPosts.parsePostForm(formWith({ title: "", date: "2026-01-01", body: "x" }))).toThrow(
      /required/,
    );
    expect(() => adminPosts.parsePostForm(formWith({ title: "T", date: "", body: "x" }))).toThrow(/required/);
    expect(() => adminPosts.parsePostForm(formWith({ title: "T", date: "2026-01-01", body: "   " }))).toThrow(
      /required/,
    );
  });

  it("splits and trims a comma-separated tags field", () => {
    const input = adminPosts.parsePostForm(
      formWith({ title: "T", date: "2026-01-01", body: "b", tags: " ai ,  devops ,, azure " }),
    );
    expect(input.tags).toEqual(["ai", "devops", "azure"]);
  });

  it("leaves optional fields undefined when blank", () => {
    const input = adminPosts.parsePostForm(formWith({ title: "T", date: "2026-01-01", body: "b" }));
    expect(input.cta_text).toBeUndefined();
    expect(input.cta_link).toBeUndefined();
    expect(input.source_url).toBeUndefined();
    expect(input.linkedin_description).toBeUndefined();
  });
});

describe("parseImagesFromForm", () => {
  it("base64-encodes each uploaded image file", async () => {
    const fd = new FormData();
    fd.append("images", new File([new Uint8Array([1, 2, 3])], "shot.png", { type: "image/png" }));
    fd.append("images", "not-a-file");

    const images = await adminPosts.parseImagesFromForm(fd);

    expect(images).toHaveLength(1);
    expect(images[0].filename).toBe("shot.png");
    expect(images[0].base64).toBe(Buffer.from([1, 2, 3]).toString("base64"));
  });
});
