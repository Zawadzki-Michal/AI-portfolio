import { afterEach, describe, expect, it, vi } from "vitest";
import { checkTokenHealth, contentTypeFor, createPost, uploadImage, type LinkedInConfig } from "./linkedin";

const config: LinkedInConfig = {
  accessToken: "token-123",
  authorUrn: "urn:li:person:abc",
};

function registerUploadResponse(uploadUrl: string, asset: string) {
  return new Response(
    JSON.stringify({
      value: {
        uploadMechanism: {
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": { uploadUrl },
        },
        asset,
      },
    }),
    { status: 200 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("contentTypeFor", () => {
  it("maps known extensions", () => {
    expect(contentTypeFor("photo.png")).toBe("image/png");
    expect(contentTypeFor("photo.JPG")).toBe("image/jpeg");
    expect(contentTypeFor("photo.webp")).toBe("image/webp");
  });

  it("falls back to jpeg for unknown extensions", () => {
    expect(contentTypeFor("photo.bmp")).toBe("image/jpeg");
  });
});

describe("uploadImage", () => {
  it("registers the upload, PUTs the binary, and returns the image URN", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(registerUploadResponse("https://upload.example/target", "urn:li:digitalmediaAsset:xyz"))
      .mockResolvedValueOnce(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const urn = await uploadImage(config, Buffer.from("fake-image-bytes"), "image/png");

    expect(urn).toBe("urn:li:digitalmediaAsset:xyz");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("/v2/assets?action=registerUpload");
    expect(fetchMock.mock.calls[1][0]).toBe("https://upload.example/target");
  });

  it("throws if registerUpload fails", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("nope", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(uploadImage(config, Buffer.from("x"))).rejects.toThrow(/registerUpload failed/);
  });
});

describe("checkTokenHealth", () => {
  it("resolves without completing an upload when registerUpload succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(registerUploadResponse("https://upload.example/target", "urn:li:digitalmediaAsset:xyz"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkTokenHealth(config)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/v2/assets?action=registerUpload");
  });

  it("throws when the token is invalid or revoked", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"code":"REVOKED_ACCESS_TOKEN"}', { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkTokenHealth(config)).rejects.toThrow(/registerUpload failed/);
  });
});

describe("createPost", () => {
  function mockFetchOnce(status: number, headers: Record<string, string> = {}) {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("", { status, headers }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("uses an IMAGE share for one or more images", async () => {
    const fetchMock = mockFetchOnce(201, { "x-restli-id": "urn:li:share:1" });

    await createPost(config, {
      commentary: "hello",
      linkUrl: "https://example.com/posts/foo",
      title: "Foo",
      imageUrns: ["urn:li:digitalmediaAsset:1"],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const content = body.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.shareMediaCategory).toBe("IMAGE");
    expect(content.media).toEqual([{ status: "READY", media: "urn:li:digitalmediaAsset:1" }]);
    expect(content.shareCommentary.text).toContain("https://example.com/posts/foo");
  });

  it("includes one media entry per image for multiple images", async () => {
    const fetchMock = mockFetchOnce(201);

    await createPost(config, {
      commentary: "hello",
      linkUrl: "https://example.com/posts/foo",
      title: "Foo",
      imageUrns: ["urn:li:digitalmediaAsset:1", "urn:li:digitalmediaAsset:2"],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const content = body.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.media).toEqual([
      { status: "READY", media: "urn:li:digitalmediaAsset:1" },
      { status: "READY", media: "urn:li:digitalmediaAsset:2" },
    ]);
  });

  it("falls back to an article link preview with no images", async () => {
    const fetchMock = mockFetchOnce(201);

    await createPost(config, {
      commentary: "hello",
      linkUrl: "https://example.com/posts/foo",
      title: "Foo",
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const content = body.specificContent["com.linkedin.ugc.ShareContent"];
    expect(content.shareMediaCategory).toBe("ARTICLE");
    expect(content.media).toEqual([
      { status: "READY", originalUrl: "https://example.com/posts/foo", title: { text: "Foo" } },
    ]);
  });

  it("throws on a non-ok response", async () => {
    mockFetchOnce(500);

    await expect(
      createPost(config, { commentary: "hi", linkUrl: "https://example.com", title: "Hi" }),
    ).rejects.toThrow(/createPost failed/);
  });
});
