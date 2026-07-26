import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation", () => {
    expect(slugify("Azure DR: what Terraform doesn't tell you!")).toBe(
      "azure-dr-what-terraform-doesn-t-tell-you",
    );
  });

  it("removes diacritics", () => {
    expect(slugify("Wdrożenie Terraform w Azure")).toBe("wdrozenie-terraform-w-azure");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--already-hyphenated--")).toBe("already-hyphenated");
  });

  it("caps length at 60 characters", () => {
    const longTitle = "a".repeat(100);
    expect(slugify(longTitle).length).toBe(60);
  });
});
