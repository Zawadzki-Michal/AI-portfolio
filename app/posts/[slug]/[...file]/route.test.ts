import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "path";

const existsSync = vi.fn();
const readFileSync = vi.fn();
const readdirSync = vi.fn();
const getAllPostSlugs = vi.fn();

vi.mock("fs", () => ({
  default: {
    existsSync: (...args: unknown[]) => existsSync(...args),
    readFileSync: (...args: unknown[]) => readFileSync(...args),
    readdirSync: (...args: unknown[]) => readdirSync(...args),
  },
}));

vi.mock("@/lib/posts", () => ({ getAllPostSlugs: (...args: unknown[]) => getAllPostSlugs(...args) }));

let GET: typeof import("./route").GET;
let generateStaticParams: typeof import("./route").generateStaticParams;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  readdirSync.mockReturnValue([]);
  getAllPostSlugs.mockReturnValue([]);
  ({ GET, generateStaticParams } = await import("./route"));
});

describe("generateStaticParams", () => {
  it("lists every non-content file in each post's directory", () => {
    getAllPostSlugs.mockReturnValue(["my-post"]);
    existsSync.mockReturnValue(true);
    readdirSync.mockReturnValue(["index.en.md", "index.pl.md", "shot.png", "photo.jpg"]);

    expect(generateStaticParams()).toEqual([
      { slug: "my-post", file: ["shot.png"] },
      { slug: "my-post", file: ["photo.jpg"] },
    ]);
  });

  it("skips slugs whose directory doesn't exist", () => {
    getAllPostSlugs.mockReturnValue(["ghost"]);
    existsSync.mockReturnValue(false);

    expect(generateStaticParams()).toEqual([]);
  });
});

function params(slug: string, file: string[]) {
  return { params: Promise.resolve({ slug, file }) };
}

describe("GET /posts/[slug]/[...file]", () => {
  it("serves an image file within the post's own directory", async () => {
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(Buffer.from("fake-image-bytes"));

    const res = await GET(new Request("https://example.com") as never, params("my-post", ["shot.png"]));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    const expectedPath = path.resolve(path.join(process.cwd(), "posts"), "my-post", "shot.png");
    expect(readFileSync).toHaveBeenCalledWith(expectedPath);
  });

  it("blocks path traversal outside the post's directory", async () => {
    existsSync.mockReturnValue(true);

    const res = await GET(new Request("https://example.com") as never, params("my-post", ["..", "..", "etc", "passwd"]));

    expect(res.status).toBe(404);
    expect(readFileSync).not.toHaveBeenCalled();
  });

  it("blocks serving the post's own markdown content file", async () => {
    existsSync.mockReturnValue(true);

    const res = await GET(new Request("https://example.com") as never, params("my-post", ["index.en.md"]));

    expect(res.status).toBe(404);
    expect(readFileSync).not.toHaveBeenCalled();
  });

  it("returns 404 when the requested file doesn't exist", async () => {
    existsSync.mockReturnValue(false);

    const res = await GET(new Request("https://example.com") as never, params("my-post", ["missing.png"]));

    expect(res.status).toBe(404);
  });

  it("falls back to application/octet-stream for unknown extensions", async () => {
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(Buffer.from("data"));

    const res = await GET(new Request("https://example.com") as never, params("my-post", ["archive.zip"]));

    expect(res.headers.get("Content-Type")).toBe("application/octet-stream");
  });
});
