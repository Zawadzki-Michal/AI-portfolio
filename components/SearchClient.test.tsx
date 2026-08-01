import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchClient } from "./SearchClient";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    ({
      placeholder: "Search…",
      searching: "Searching…",
      noResults: `No results for "${values?.query}"`,
    })[key],
}));

function fakePagefind(results: { url: string; meta: { title?: string }; excerpt: string }[]) {
  return {
    search: vi.fn().mockResolvedValue({
      results: results.map((r) => ({ id: r.url, data: () => Promise.resolve(r) })),
    }),
  };
}

beforeEach(() => {
  delete (window as unknown as { __pagefind?: unknown }).__pagefind;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SearchClient", () => {
  it("renders an empty search box with no results initially", () => {
    render(<SearchClient />);
    expect(screen.getByPlaceholderText("Search…")).toHaveValue("");
    expect(screen.queryByText(/No results/)).not.toBeInTheDocument();
  });

  it("debounces input, searches pagefind, and shows locale-matching results", async () => {
    window.__pagefind = Promise.resolve(
      fakePagefind([
        { url: "/en/posts/my-post.html", meta: { title: "My Post" }, excerpt: "an excerpt" },
        { url: "/pl/posts/inny.html", meta: { title: "Inny" }, excerpt: "wycinek" },
      ]) as never,
    );
    const user = userEvent.setup();
    render(<SearchClient />);

    await user.type(screen.getByPlaceholderText("Search…"), "post");

    await waitFor(() => expect(screen.getByRole("link", { name: /My Post/ })).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /My Post/ })).toHaveAttribute("href", "/en/posts/my-post");
    expect(screen.queryByText("Inny")).not.toBeInTheDocument();
  });

  it("shows a no-results message when the search comes back empty", async () => {
    window.__pagefind = Promise.resolve(fakePagefind([]) as never);
    const user = userEvent.setup();
    render(<SearchClient />);

    await user.type(screen.getByPlaceholderText("Search…"), "nothing");

    await waitFor(() => expect(screen.getByText('No results for "nothing"')).toBeInTheDocument());
  });

  it("clears results when the query is cleared", async () => {
    window.__pagefind = Promise.resolve(
      fakePagefind([{ url: "/en/posts/x.html", meta: { title: "X" }, excerpt: "e" }]) as never,
    );
    const user = userEvent.setup();
    render(<SearchClient />);
    const input = screen.getByPlaceholderText("Search…");

    await user.type(input, "x");
    await waitFor(() => expect(screen.getByRole("link", { name: /X/ })).toBeInTheDocument());

    await user.clear(input);
    await waitFor(() => expect(screen.queryByRole("link", { name: /X/ })).not.toBeInTheDocument());
  });
});
