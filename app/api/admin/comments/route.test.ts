import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const isCommentsConfiguredMock = vi.fn();
const getAllCommentsMock = vi.fn();

vi.mock("@/lib/require-admin", () => ({ requireAdmin: requireAdminMock }));
vi.mock("@/lib/comments", () => ({
  isCommentsConfigured: isCommentsConfiguredMock,
  getAllComments: getAllCommentsMock,
}));

let GET: typeof import("./route").GET;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  ({ GET } = await import("./route"));
});

describe("GET /api/admin/comments", () => {
  it("returns 401 when not an admin", async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(getAllCommentsMock).not.toHaveBeenCalled();
  });

  it("reports unconfigured without querying", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    isCommentsConfiguredMock.mockReturnValue(false);
    const res = await GET();
    expect(await res.json()).toEqual({ comments: [], configured: false });
  });

  it("returns every comment for an admin", async () => {
    requireAdminMock.mockResolvedValue({ user: { isAdmin: true } });
    isCommentsConfiguredMock.mockReturnValue(true);
    getAllCommentsMock.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await GET();
    expect(await res.json()).toEqual({ comments: [{ id: 1 }, { id: 2 }], configured: true });
  });
});
