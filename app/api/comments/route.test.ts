import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const authMock = vi.fn();
const isCommentsConfiguredMock = vi.fn();
const getCommentsForSlugMock = vi.fn();
const createCommentMock = vi.fn();

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("@/lib/comments", () => ({
  isCommentsConfigured: isCommentsConfiguredMock,
  getCommentsForSlug: getCommentsForSlugMock,
  createComment: createCommentMock,
}));

let GET: typeof import("./route").GET;
let POST: typeof import("./route").POST;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ GET, POST } = await import("./route"));
});

function getRequest(url: string): NextRequest {
  return new NextRequest(url);
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest("https://example.com/api/comments", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/comments", () => {
  it("reports unconfigured without querying the slug", async () => {
    isCommentsConfiguredMock.mockReturnValue(false);
    const res = await GET(getRequest("https://example.com/api/comments"));
    expect(await res.json()).toEqual({ comments: [], configured: false });
    expect(getCommentsForSlugMock).not.toHaveBeenCalled();
  });

  it("requires a slug query param", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    const res = await GET(getRequest("https://example.com/api/comments"));
    expect(res.status).toBe(400);
  });

  it("returns comments for the requested slug", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    getCommentsForSlugMock.mockResolvedValue([{ id: 1 }]);
    const res = await GET(getRequest("https://example.com/api/comments?slug=my-post"));
    expect(getCommentsForSlugMock).toHaveBeenCalledWith("my-post");
    expect(await res.json()).toEqual({ comments: [{ id: 1 }], configured: true });
  });
});

describe("POST /api/comments", () => {
  it("returns 503 when comments aren't configured", async () => {
    isCommentsConfiguredMock.mockReturnValue(false);
    const res = await POST(postRequest({ slug: "x", body: "hi" }));
    expect(res.status).toBe(503);
  });

  it("returns 401 when there is no session", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    authMock.mockResolvedValue(null);
    const res = await POST(postRequest({ slug: "x", body: "hi" }));
    expect(res.status).toBe(401);
  });

  it("rejects an invalid submission", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    authMock.mockResolvedValue({ user: { id: "abc", name: "Michał" } });
    const res = await POST(postRequest({ slug: "x", body: "   " }));
    expect(res.status).toBe(400);
  });

  it("creates the comment using the signed-in session's identity", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    authMock.mockResolvedValue({ user: { id: "urn:li:person:abc", name: "Michał", image: "https://img" } });
    createCommentMock.mockResolvedValue({ id: 1, body: "hello" });

    const res = await POST(postRequest({ slug: "my-post", body: "hello" }));

    expect(createCommentMock).toHaveBeenCalledWith({
      slug: "my-post",
      authorName: "Michał",
      authorImage: "https://img",
      authorLinkedinId: "urn:li:person:abc",
      body: "hello",
    });
    expect(await res.json()).toEqual({ comment: { id: 1, body: "hello" } });
  });

  it("falls back to a default author name when the session has none", async () => {
    isCommentsConfiguredMock.mockReturnValue(true);
    authMock.mockResolvedValue({ user: { id: "urn:li:person:abc" } });
    createCommentMock.mockResolvedValue({ id: 2 });

    await POST(postRequest({ slug: "my-post", body: "hello" }));

    expect(createCommentMock).toHaveBeenCalledWith(expect.objectContaining({ authorName: "LinkedIn user", authorImage: null }));
  });
});
