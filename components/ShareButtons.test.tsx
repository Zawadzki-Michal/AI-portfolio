import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShareButtons } from "./ShareButtons";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ label: "Share this post", linkedin: "Share on LinkedIn", facebook: "Share on Facebook", x: "Share on X" })[key],
}));

describe("ShareButtons", () => {
  it("renders the share label and a link per platform", () => {
    render(<ShareButtons url="https://www.michalzawadzki.dev/en/posts/my-post" title="My Post" />);

    expect(screen.getByText("Share this post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on X" })).toBeInTheDocument();
  });

  it("encodes the post URL and title into each share link", () => {
    render(<ShareButtons url="https://example.com/posts/my post?x=1" title="Hello & Welcome" />);

    const encodedUrl = encodeURIComponent("https://example.com/posts/my post?x=1");
    expect(screen.getByRole("link", { name: "Share on LinkedIn" })).toHaveAttribute(
      "href",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    );
    expect(screen.getByRole("link", { name: "Share on Facebook" })).toHaveAttribute(
      "href",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    );
    const xHref = screen.getByRole("link", { name: "Share on X" }).getAttribute("href");
    expect(xHref).toContain(`url=${encodedUrl}`);
    expect(xHref).toContain(`text=${encodeURIComponent("Hello & Welcome")}`);
  });

  it("opens share links in a new tab safely", () => {
    render(<ShareButtons url="https://example.com" title="T" />);
    for (const name of ["Share on LinkedIn", "Share on Facebook", "Share on X"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
