import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireAdminMock = vi.fn();
const getAdminPostMock = vi.fn();
const parsePostFormMock = vi.fn();
const updateAdminPostMock = vi.fn();
const deleteAdminPostMock = vi.fn();
const parseImagesFromFormMock = vi.fn();
const addPostImageMock = vi.fn();
const removePostImageMock = vi.fn();

vi.mock("@/lib/require-admin", () => ({ requireAdmin: requireAdminMock }));
vi.mock("@/lib/admin-posts", () => ({
  getAdminPost: getAdminPostMock,
  parsePostForm: parsePostFormMock,
  updateAdminPost: updateAdminPostMock,
  deleteAdminPost: deleteAdminPostMock,
  parseImagesFromForm: parseImagesFromFormMock,
  addPostImage: addPostImageMock,
  removePostImage: removePostImageMock,
}));

let GET: typeof import("./route").GET;
let PUT: typeof import("./route").PUT;
let DELETE: typeof import("./route").DELETE;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ GET, PUT, DELETE } = await import("./route"));
  parseImagesFromFormMock.mockResolvedValue([]);
});

function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function putReq(formData: FormData): NextRequest {
  return new NextRequest("https://example.com/api/admin/posts/x", { method: "PUT", body: formData });
}

describe("GET /api/admin/posts/[slug]", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await GET(new NextRequest("https://example.com"), params("a"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when the post doesn't exist", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    getAdminPostMock.mockResolvedValue(null);
    const res = await GET(new NextRequest("https://example.com"), params("missing"));
    expect(res.status).toBe(404);
  });

  it("returns the post", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    getAdminPostMock.mockResolvedValue({ slug: "a", title: "T" });
    const res = await GET(new NextRequest("https://example.com"), params("a"));
    expect(await res.json()).toEqual({ post: { slug: "a", title: "T" } });
  });
});

describe("PUT /api/admin/posts/[slug]", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await PUT(putReq(new FormData()), params("a"));
    expect(res.status).toBe(401);
  });

  it("returns 400 on an invalid form", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockImplementation(() => {
      throw new Error("title, date, and body are required");
    });
    const res = await PUT(putReq(new FormData()), params("a"));
    expect(res.status).toBe(400);
  });

  it("returns 404 when updateAdminPost fails", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockReturnValue({ title: "T", date: "2026-01-01", tags: [], body: "b" });
    updateAdminPostMock.mockRejectedValue(new Error("No post at posts/a"));
    const res = await PUT(putReq(new FormData()), params("a"));
    expect(res.status).toBe(404);
  });

  it("removes listed images and adds new ones", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockReturnValue({ title: "T", date: "2026-01-01", tags: [], body: "b" });
    updateAdminPostMock.mockResolvedValue(undefined);
    parseImagesFromFormMock.mockResolvedValue([{ filename: "new.png", base64: "abc" }]);

    const formData = new FormData();
    formData.set("removeImages", "old1.png, old2.png,");

    const res = await PUT(putReq(formData), params("a"));

    expect(removePostImageMock).toHaveBeenCalledWith("a", "old1.png");
    expect(removePostImageMock).toHaveBeenCalledWith("a", "old2.png");
    expect(addPostImageMock).toHaveBeenCalledWith("a", "new.png", "abc");
    expect(await res.json()).toEqual({ slug: "a" });
  });
});

describe("DELETE /api/admin/posts/[slug]", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await DELETE(new NextRequest("https://example.com", { method: "DELETE" }), params("a"));
    expect(res.status).toBe(401);
    expect(deleteAdminPostMock).not.toHaveBeenCalled();
  });

  it("deletes the post", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    const res = await DELETE(new NextRequest("https://example.com", { method: "DELETE" }), params("a"));
    expect(deleteAdminPostMock).toHaveBeenCalledWith("a");
    expect(await res.json()).toEqual({ ok: true });
  });
});
