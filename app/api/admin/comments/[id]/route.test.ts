import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireAdminMock = vi.fn();
const deleteCommentMock = vi.fn();

vi.mock("@/lib/require-admin", () => ({ requireAdmin: requireAdminMock }));
vi.mock("@/lib/comments", () => ({ deleteComment: deleteCommentMock }));

let DELETE: typeof import("./route").DELETE;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ DELETE } = await import("./route"));
});

function req(): NextRequest {
  return new NextRequest("https://example.com/api/admin/comments/1", { method: "DELETE" });
}

describe("DELETE /api/admin/comments/[id]", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await DELETE(req(), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(401);
    expect(deleteCommentMock).not.toHaveBeenCalled();
  });

  it("rejects a non-numeric id", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    const res = await DELETE(req(), { params: Promise.resolve({ id: "not-a-number" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 when nothing was deleted", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    deleteCommentMock.mockResolvedValue(false);
    const res = await DELETE(req(), { params: Promise.resolve({ id: "42" }) });
    expect(res.status).toBe(404);
  });

  it("deletes the comment by numeric id", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    deleteCommentMock.mockResolvedValue(true);
    const res = await DELETE(req(), { params: Promise.resolve({ id: "42" }) });
    expect(deleteCommentMock).toHaveBeenCalledWith(42);
    expect(await res.json()).toEqual({ ok: true });
  });
});
