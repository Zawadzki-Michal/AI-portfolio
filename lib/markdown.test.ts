import { describe, expect, it } from "vitest";
import { stripCodeFence } from "./markdown";

describe("stripCodeFence", () => {
  it("passes plain markdown through unchanged", () => {
    const input = "---\ntitle: \"x\"\n---\n\nBody text.";
    expect(stripCodeFence(input)).toBe(input);
  });

  it("strips a ```markdown fence wrapping the whole response", () => {
    const input = '```markdown\n---\ntitle: "x"\n---\n\nBody text.\n```';
    expect(stripCodeFence(input)).toBe('---\ntitle: "x"\n---\n\nBody text.');
  });

  it("strips a bare ``` fence", () => {
    const input = "```\nBody text.\n```";
    expect(stripCodeFence(input)).toBe("Body text.");
  });

  it("trims surrounding whitespace", () => {
    expect(stripCodeFence("  \n Body text. \n  ")).toBe("Body text.");
  });
});
