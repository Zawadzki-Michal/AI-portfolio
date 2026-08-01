import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentModeration } from "./CommentModeration";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const COMMENT = {
  id: 1,
  postSlug: "my-post",
  authorName: "Ada",
  authorImage: null,
  body: "Great post!",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("CommentModeration", () => {
  it("shows a loading state before the fetch resolves", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    render(<CommentModeration />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows an unconfigured message when comments have no DATABASE_URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ comments: [], configured: false }), { status: 200 })),
    );
    render(<CommentModeration />);
    await waitFor(() => expect(screen.getByText(/aren't configured/)).toBeInTheDocument());
  });

  it("shows an empty state with no comments", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ comments: [], configured: true }), { status: 200 })),
    );
    render(<CommentModeration />);
    await waitFor(() => expect(screen.getByText("No comments yet.")).toBeInTheDocument());
  });

  it("lists comments and deletes one on confirm", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ comments: [COMMENT], configured: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();

    render(<CommentModeration />);
    await screen.findByText("Great post!");

    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() => expect(screen.getByText("No comments yet.")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenLastCalledWith("/api/admin/comments/1", { method: "DELETE" });
  });

  it("keeps the comment and alerts when deletion fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ comments: [COMMENT], configured: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    render(<CommentModeration />);
    await screen.findByText("Great post!");
    await user.click(screen.getByRole("button", { name: "delete" }));

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Failed to delete comment."));
    expect(screen.getByText("Great post!")).toBeInTheDocument();
  });

  it("does not delete when the confirmation is dismissed", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ comments: [COMMENT], configured: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();

    render(<CommentModeration />);
    await screen.findByText("Great post!");
    await user.click(screen.getByRole("button", { name: "delete" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
