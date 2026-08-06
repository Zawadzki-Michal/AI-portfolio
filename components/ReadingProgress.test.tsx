import { afterEach, describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { ReadingProgress } from "./ReadingProgress";

function setScrollMetrics({ scrollHeight, clientHeight, scrollTop }: { scrollHeight: number; clientHeight: number; scrollTop: number }) {
  const doc = document.documentElement;
  Object.defineProperty(doc, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(doc, "clientHeight", { configurable: true, value: clientHeight });
  Object.defineProperty(doc, "scrollTop", { configurable: true, value: scrollTop });
}

afterEach(() => {
  ["scrollHeight", "clientHeight", "scrollTop"].forEach((prop) => {
    delete (document.documentElement as unknown as Record<string, unknown>)[prop];
  });
});

function bar(container: HTMLElement) {
  return container.querySelector(".bg-gradient-to-r") as HTMLElement;
}

describe("ReadingProgress", () => {
  it("renders 0% width when the page isn't scrollable", () => {
    setScrollMetrics({ scrollHeight: 500, clientHeight: 500, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);
    expect(bar(container).style.width).toBe("0%");
  });

  it("computes the scroll percentage on mount", () => {
    setScrollMetrics({ scrollHeight: 1000, clientHeight: 500, scrollTop: 250 });
    const { container } = render(<ReadingProgress />);
    // scrollable = 500, scrollTop 250 -> 50%
    expect(bar(container).style.width).toBe("50%");
  });

  it("updates on scroll and clamps to 100%", async () => {
    setScrollMetrics({ scrollHeight: 1000, clientHeight: 500, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);

    setScrollMetrics({ scrollHeight: 1000, clientHeight: 500, scrollTop: 5000 });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => expect(bar(container).style.width).toBe("100%"));
  });
});
