import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CtaBlock } from "./CtaBlock";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => ({ collaborateCta: "let's talk" })[key],
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("CtaBlock", () => {
  it("renders the default Polish CTA copy and collaborate link", () => {
    render(<CtaBlock />);
    expect(screen.getByText(/Chcesz wdrożyć coś podobnego/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "let's talk" })).toHaveAttribute("href", "/collaborate");
  });

  it("renders custom cta text and link", () => {
    render(<CtaBlock ctaText="Custom pitch" ctaLink="/custom" />);
    expect(screen.getByText("Custom pitch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "let's talk" })).toHaveAttribute("href", "/custom");
  });
});
