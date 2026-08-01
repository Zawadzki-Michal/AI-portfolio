import { describe, expect, it } from "vitest";
import { postUrl, tagUrl } from "./post-url";

describe("postUrl", () => {
  it("builds a locale-prefixed post path", () => {
    expect(postUrl("my-post", "en")).toBe("/en/posts/my-post");
    expect(postUrl("my-post", "pl")).toBe("/pl/posts/my-post");
  });
});

describe("tagUrl", () => {
  it("builds a locale-prefixed tag path", () => {
    expect(tagUrl("azure", "en")).toBe("/en/tags/azure");
  });

  it("URL-encodes tags with special characters", () => {
    expect(tagUrl("c++", "en")).toBe("/en/tags/c%2B%2B");
    expect(tagUrl("ci/cd", "en")).toBe("/en/tags/ci%2Fcd");
  });
});
