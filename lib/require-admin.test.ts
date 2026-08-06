import { describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
vi.mock("@/auth", () => ({ auth: authMock }));

describe("requireAdmin", () => {
  it("returns the session when the signed-in user is the admin", async () => {
    authMock.mockResolvedValueOnce({ user: { isAdmin: true, name: "Michał" } });
    const { requireAdmin } = await import("./require-admin");

    const session = await requireAdmin();
    expect(session).toEqual({ user: { isAdmin: true, name: "Michał" } });
  });

  it("returns null when the user is signed in but not an admin", async () => {
    authMock.mockResolvedValueOnce({ user: { isAdmin: false } });
    const { requireAdmin } = await import("./require-admin");

    expect(await requireAdmin()).toBeNull();
  });

  it("returns null when there is no session", async () => {
    authMock.mockResolvedValueOnce(null);
    const { requireAdmin } = await import("./require-admin");

    expect(await requireAdmin()).toBeNull();
  });
});
