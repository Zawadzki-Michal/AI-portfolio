import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeletePostButton } from "./DeletePostButton";

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

beforeEach(() => {
  refreshMock.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("DeletePostButton", () => {
  it("does nothing when the confirmation is dismissed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<DeletePostButton slug="my-post" title="My Post" />);
    await user.click(screen.getByRole("button", { name: "delete" }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("deletes the post and refreshes on success", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(null, { status: 200 })));
    const user = userEvent.setup();

    render(<DeletePostButton slug="my-post" title="My Post" />);
    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() => expect(refreshMock).toHaveBeenCalled());
  });

  it("alerts on failure without refreshing", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(null, { status: 500 })));
    const user = userEvent.setup();

    render(<DeletePostButton slug="my-post" title="My Post" />);
    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Failed to delete post."));
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
