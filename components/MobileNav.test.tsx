import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const links = [
  { href: "/about", label: "about" },
  { href: "/posts", label: "posts" },
];

describe("MobileNav", () => {
  it("starts closed", () => {
    render(<MobileNav links={links} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "/about" })).not.toBeInTheDocument();
  });

  it("opens to reveal the nav links and toggles the button label", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={links} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "/about" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "/posts" })).toHaveAttribute("href", "/posts");
  });

  it("closes when a link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={links} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "/about" }));

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});
