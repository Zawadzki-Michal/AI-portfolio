import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { waitForUrl } from "./wait-for-url";

describe("waitForUrl", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves as soon as the response is ok and no content check is given", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response("", { status: 200 }));

    await expect(waitForUrl("https://example.com", { delayMs: 0 })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries a non-ok response until it succeeds", async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(new Response("", { status: 404 }))
      .mockResolvedValueOnce(new Response("", { status: 200 }));

    await expect(waitForUrl("https://example.com", { delayMs: 0 })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("treats a 200 without the expected content as not-ready yet", async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(new Response("<h1>stale page</h1>", { status: 200 }))
      .mockResolvedValueOnce(new Response("<h1>My New Post</h1>", { status: 200 }));

    await expect(
      waitForUrl("https://example.com", { delayMs: 0, expectedContent: "My New Post" }),
    ).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("matches expected content across HTML-escaped entities", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response("<h1>Michal &amp; the case of the missing &#x27;semicolon&#x27;</h1>", { status: 200 }),
    );

    await expect(
      waitForUrl("https://example.com", {
        delayMs: 0,
        expectedContent: "Michal & the case of the missing 'semicolon'",
      }),
    ).resolves.toBeUndefined();
  });

  it("throws after exhausting all attempts", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response("", { status: 500 }));

    await expect(waitForUrl("https://example.com", { attempts: 2, delayMs: 0 })).rejects.toThrow(
      /Timed out waiting/,
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("survives a network error and keeps retrying", async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(new Response("", { status: 200 }));

    await expect(waitForUrl("https://example.com", { delayMs: 0 })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
