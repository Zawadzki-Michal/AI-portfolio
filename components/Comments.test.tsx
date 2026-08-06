import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { Comments } from "./Comments";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      heading: "Comments",
      empty: "No comments yet.",
      placeholder: "Write a comment…",
      submit: "Post",
      submitting: "Posting…",
      error: "Failed to post — try again.",
      signIn: "Sign in with LinkedIn",
    })[key],
}));

const useSessionMock = vi.fn();
const signInMock = vi.fn();
vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useSession: () => useSessionMock(),
  signIn: (...args: unknown[]) => signInMock(...args),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function mockInitialFetch(configured: boolean, comments: unknown[] = []) {
  return vi.fn().mockResolvedValueOnce(
    new Response(JSON.stringify({ configured, comments }), { status: 200 }),
  );
}

describe("Comments", () => {
  it("renders nothing while comments aren't configured", async () => {
    vi.stubGlobal("fetch", mockInitialFetch(false));
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    const { container } = render(<Comments slug="my-post" />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("shows existing comments and a sign-in button when unauthenticated", async () => {
    vi.stubGlobal(
      "fetch",
      mockInitialFetch(true, [
        { id: 1, postSlug: "my-post", authorName: "Ada", authorImage: null, authorLinkedinId: "1", body: "Great post!", createdAt: "2026-01-01T00:00:00Z" },
      ]),
    );
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Comments slug="my-post" />);

    await waitFor(() => expect(screen.getByText("Great post!")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Sign in with LinkedIn" })).toBeInTheDocument();
  });

  it("calls signIn('linkedin') when the sign-in button is clicked", async () => {
    vi.stubGlobal("fetch", mockInitialFetch(true, []));
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });
    const user = userEvent.setup();

    render(<Comments slug="my-post" />);
    await waitFor(() => screen.getByRole("button", { name: "Sign in with LinkedIn" }));
    await user.click(screen.getByRole("button", { name: "Sign in with LinkedIn" }));

    expect(signInMock).toHaveBeenCalledWith("linkedin");
  });

  it("lets an authenticated user post a comment", async () => {
    const initialFetch = mockInitialFetch(true, []);
    vi.stubGlobal("fetch", initialFetch);
    useSessionMock.mockReturnValue({
      data: { user: { name: "Michał", id: "urn:li:person:abc" } },
      status: "authenticated",
    });

    render(<Comments slug="my-post" />);
    const textarea = await screen.findByPlaceholderText("Write a comment…");

    initialFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          comment: { id: 2, postSlug: "my-post", authorName: "Michał", authorImage: null, authorLinkedinId: "abc", body: "Thanks!", createdAt: "2026-01-02T00:00:00Z" },
        }),
        { status: 200 },
      ),
    );

    const user = userEvent.setup();
    await user.type(textarea, "Thanks!");
    await user.click(screen.getByRole("button", { name: "Post" }));

    await waitFor(() => expect(screen.getByText("Thanks!")).toBeInTheDocument());
    expect(initialFetch).toHaveBeenLastCalledWith(
      "/api/comments",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("disables the submit button for a blank draft", async () => {
    vi.stubGlobal("fetch", mockInitialFetch(true, []));
    useSessionMock.mockReturnValue({
      data: { user: { name: "Michał", id: "abc" } },
      status: "authenticated",
    });

    render(<Comments slug="my-post" />);
    await screen.findByRole("button", { name: "Post" });

    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });
});
