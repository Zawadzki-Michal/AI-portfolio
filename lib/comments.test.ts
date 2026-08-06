import { beforeEach, describe, expect, it, vi } from "vitest";

const neonMock = vi.fn();
vi.mock("@neondatabase/serverless", () => ({ neon: (...args: unknown[]) => neonMock(...args) }));

let sqlFn: ReturnType<typeof vi.fn>;
let comments: typeof import("./comments");

beforeEach(async () => {
  vi.resetModules();
  neonMock.mockReset();
  sqlFn = vi.fn();
  neonMock.mockReturnValue(sqlFn);
  process.env.DATABASE_URL = "postgres://example";
  comments = await import("./comments");
});

const ROW = {
  id: 1,
  post_slug: "my-post",
  author_name: "Michał",
  author_image: "https://example.com/avatar.png",
  author_linkedin_id: "urn:li:person:abc",
  body: "hi there",
  created_at: new Date("2026-01-01T00:00:00Z"),
};

describe("isCommentsConfigured", () => {
  it("is true when DATABASE_URL is set", () => {
    expect(comments.isCommentsConfigured()).toBe(true);
  });

  it("is false when DATABASE_URL is unset", () => {
    delete process.env.DATABASE_URL;
    expect(comments.isCommentsConfigured()).toBe(false);
  });
});

describe("getCommentsForSlug", () => {
  it("maps rows to Comment objects", async () => {
    sqlFn.mockResolvedValueOnce([ROW]);

    const result = await comments.getCommentsForSlug("my-post");

    expect(result).toEqual([
      {
        id: 1,
        postSlug: "my-post",
        authorName: "Michał",
        authorImage: "https://example.com/avatar.png",
        authorLinkedinId: "urn:li:person:abc",
        body: "hi there",
        createdAt: ROW.created_at.toString(),
      },
    ]);
  });

  it("normalizes a null author_image to null", async () => {
    sqlFn.mockResolvedValueOnce([{ ...ROW, author_image: null }]);
    const [comment] = await comments.getCommentsForSlug("my-post");
    expect(comment.authorImage).toBeNull();
  });

  it("throws when DATABASE_URL is unset", async () => {
    delete process.env.DATABASE_URL;
    await expect(comments.getCommentsForSlug("x")).rejects.toThrow(/DATABASE_URL is not set/);
  });
});

describe("createComment", () => {
  it("trims and truncates the body before inserting", async () => {
    sqlFn.mockResolvedValueOnce([ROW]);
    const longBody = "  " + "a".repeat(2100) + "  ";

    await comments.createComment({
      slug: "my-post",
      authorName: "Michał",
      authorImage: null,
      authorLinkedinId: "urn:li:person:abc",
      body: longBody,
    });

    const values = sqlFn.mock.calls[0].slice(1);
    const insertedBody = values[values.length - 1];
    expect(insertedBody).toHaveLength(2000);
    expect(insertedBody.startsWith(" ")).toBe(false);
  });

  it("returns the inserted row mapped to a Comment", async () => {
    sqlFn.mockResolvedValueOnce([ROW]);
    const comment = await comments.createComment({
      slug: "my-post",
      authorName: "Michał",
      authorImage: null,
      authorLinkedinId: "urn:li:person:abc",
      body: "hi",
    });
    expect(comment.id).toBe(1);
    expect(comment.postSlug).toBe("my-post");
  });
});

describe("getAllComments", () => {
  it("returns every row mapped to a Comment, newest first per the query", async () => {
    sqlFn.mockResolvedValueOnce([ROW, { ...ROW, id: 2 }]);
    const result = await comments.getAllComments();
    expect(result.map((c) => c.id)).toEqual([1, 2]);
  });
});

describe("deleteComment", () => {
  it("returns true when a row was deleted", async () => {
    sqlFn.mockResolvedValueOnce([{ id: 1 }]);
    expect(await comments.deleteComment(1)).toBe(true);
  });

  it("returns false when no row matched", async () => {
    sqlFn.mockResolvedValueOnce([]);
    expect(await comments.deleteComment(999)).toBe(false);
  });
});
