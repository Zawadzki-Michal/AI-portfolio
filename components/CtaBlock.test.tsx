import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CtaBlock } from "./CtaBlock";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) =>
    (
      {
        home: { collaborateCta: "let's talk" },
        projectPage: { cta: "Working on something similar? I'd like to hear about it" },
      } as Record<string, Record<string, string>>
    )[namespace]?.[key],
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("CtaBlock", () => {
  it("falls back to the translated CTA copy when no ctaText is provided", () => {
    render(<CtaBlock />);
    expect(
      screen.getByText("Working on something similar? I'd like to hear about it"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "let's talk" })).toHaveAttribute("href", "/collaborate");
  });

  it("renders custom cta text and link", () => {
    render(<CtaBlock ctaText="Custom pitch" ctaLink="/custom" />);
    expect(screen.getByText("Custom pitch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "let's talk" })).toHaveAttribute("href", "/custom");
  });
});
