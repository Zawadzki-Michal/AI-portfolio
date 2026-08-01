import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireAdminMock = vi.fn();
const listAdminPostsMock = vi.fn();
const parsePostFormMock = vi.fn();
const createAdminPostMock = vi.fn();
const parseImagesFromFormMock = vi.fn();
const addPostImageMock = vi.fn();

vi.mock("@/lib/require-admin", () => ({ requireAdmin: requireAdminMock }));
vi.mock("@/lib/admin-posts", () => ({
  listAdminPosts: listAdminPostsMock,
  parsePostForm: parsePostFormMock,
  createAdminPost: createAdminPostMock,
  parseImagesFromForm: parseImagesFromFormMock,
  addPostImage: addPostImageMock,
}));

let GET: typeof import("./route").GET;
let POST: typeof import("./route").POST;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ GET, POST } = await import("./route"));
  parseImagesFromFormMock.mockResolvedValue([]);
});

function postReq(formData: FormData): NextRequest {
  return new NextRequest("https://example.com/api/admin/posts", { method: "POST", body: formData });
}

describe("GET /api/admin/posts", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("lists admin posts", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    listAdminPostsMock.mockResolvedValue([{ slug: "a" }]);
    const res = await GET();
    expect(await res.json()).toEqual({ posts: [{ slug: "a" }] });
  });
});

describe("POST /api/admin/posts", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await POST(postReq(new FormData()));
    expect(res.status).toBe(401);
    expect(parsePostFormMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the form is invalid", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockImplementation(() => {
      throw new Error("title, date, and body are required");
    });
    const res = await POST(postReq(new FormData()));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "title, date, and body are required" });
  });

  it("returns 409 when the post already exists", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockReturnValue({ title: "T", date: "2026-01-01", tags: [], body: "b" });
    createAdminPostMock.mockRejectedValue(new Error("A post already exists at posts/x"));
    const res = await POST(postReq(new FormData()));
    expect(res.status).toBe(409);
  });

  it("creates the post and uploads any images", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    parsePostFormMock.mockReturnValue({ title: "T", date: "2026-01-01", tags: [], body: "b" });
    createAdminPostMock.mockResolvedValue({ slug: "2026-01-01-t" });
    parseImagesFromFormMock.mockResolvedValue([{ filename: "shot.png", base64: "abc" }]);

    const res = await POST(postReq(new FormData()));

    expect(addPostImageMock).toHaveBeenCalledWith("2026-01-01-t", "shot.png", "abc");
    expect(await res.json()).toEqual({ slug: "2026-01-01-t" });
  });
});
