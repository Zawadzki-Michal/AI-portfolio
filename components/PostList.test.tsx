import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PostSummary } from "@/lib/posts";
import { PostList } from "./PostList";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => ({ emptyMsg: "No entries logged yet." })[key],
}));

const posts: PostSummary[] = [
  { slug: "a", title: "Post A", date: "2026-01-01", tags: ["ai", "devops"] },
  { slug: "b", title: "Post B", date: "2026-02-01", tags: [] },
];

describe("PostList", () => {
  it("shows the empty state when there are no posts", () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText("No entries logged yet.")).toBeInTheDocument();
  });

  it("renders a link and date per post", () => {
    render(<PostList posts={posts} />);
    expect(screen.getByRole("link", { name: /Post A/ })).toHaveAttribute("href", "/en/posts/a");
    expect(screen.getByRole("link", { name: /Post B/ })).toHaveAttribute("href", "/en/posts/b");
    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
  });

  it("renders a tag link per tag, linking to the tag page", () => {
    render(<PostList posts={posts} />);
    expect(screen.getByRole("link", { name: "#ai" })).toHaveAttribute("href", "/en/tags/ai");
    expect(screen.getByRole("link", { name: "#devops" })).toHaveAttribute("href", "/en/tags/devops");
  });
});
