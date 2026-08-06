import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

const useLocaleMock = vi.fn();
vi.mock("next-intl", () => ({ useLocale: () => useLocaleMock() }));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, locale, children, ...props }: { href: string; locale: string; children: ReactNode }) => (
    <a href={href} data-locale={locale} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/posts/my-post",
}));

vi.mock("@/i18n/routing", () => ({ routing: { locales: ["en", "pl"] } }));

const { LanguageSwitcher } = await import("./LanguageSwitcher");

describe("LanguageSwitcher", () => {
  it("renders a link per locale", () => {
    useLocaleMock.mockReturnValue("en");
    render(<LanguageSwitcher />);
    expect(screen.getByRole("link", { name: "en" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "pl" })).toBeInTheDocument();
  });

  it("marks the active locale with aria-current and highlight styling", () => {
    useLocaleMock.mockReturnValue("en");
    render(<LanguageSwitcher />);

    const en = screen.getByRole("link", { name: "en" });
    const pl = screen.getByRole("link", { name: "pl" });
    expect(en).toHaveAttribute("aria-current", "true");
    expect(en.className).toContain("bg-amber");
    expect(pl).not.toHaveAttribute("aria-current");
    expect(pl.className).not.toContain("bg-amber");
  });

  it("switches which locale is marked active", () => {
    useLocaleMock.mockReturnValue("pl");
    render(<LanguageSwitcher />);
    expect(screen.getByRole("link", { name: "pl" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "en" })).not.toHaveAttribute("aria-current");
  });
});
