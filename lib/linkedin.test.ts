import { afterEach, describe, expect, it, vi } from "vitest";
import { contentTypeFor, createPost, uploadImage, type LinkedInConfig } from "./linkedin";

const config: LinkedInConfig = {
  accessToken: "token-123",
  authorUrn: "urn:li:person:abc",
};

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
  it("initializes the upload, PUTs the binary, and returns the image URN", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            value: { uploadUrl: "https://upload.example/target", image: "urn:li:image:xyz" },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const urn = await uploadImage(config, Buffer.from("fake-image-bytes"), "image/png");

    expect(urn).toBe("urn:li:image:xyz");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("/rest/images?action=initializeUpload");
    expect(fetchMock.mock.calls[1][0]).toBe("https://upload.example/target");
  });

  it("throws if initializeUpload fails", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("nope", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(uploadImage(config, Buffer.from("x"))).rejects.toThrow(/initializeUpload failed/);
  });
});

describe("createPost", () => {
  function mockFetchOnce(status: number, headers: Record<string, string> = {}) {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("", { status, headers }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("uses a single media block for one image", async () => {
    const fetchMock = mockFetchOnce(201, { "x-restli-id": "urn:li:share:1" });

    await createPost(config, {
      commentary: "hello",
      linkUrl: "https://example.com/posts/foo",
      title: "Foo",
      imageUrns: ["urn:li:image:1"],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.content).toEqual({ media: { id: "urn:li:image:1" } });
    expect(body.commentary).toContain("https://example.com/posts/foo");
  });

  it("uses a multiImage block for more than one image", async () => {
    const fetchMock = mockFetchOnce(201);

    await createPost(config, {
      commentary: "hello",
      linkUrl: "https://example.com/posts/foo",
      title: "Foo",
      imageUrns: ["urn:li:image:1", "urn:li:image:2"],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.content.multiImage.images).toEqual([
      { id: "urn:li:image:1" },
      { id: "urn:li:image:2" },
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
    expect(body.content).toEqual({
      article: { source: "https://example.com/posts/foo", title: "Foo" },
    });
  });

  it("throws on a non-ok response", async () => {
    mockFetchOnce(500);

    await expect(
      createPost(config, { commentary: "hi", linkUrl: "https://example.com", title: "Hi" }),
    ).rejects.toThrow(/createPost failed/);
  });
});
