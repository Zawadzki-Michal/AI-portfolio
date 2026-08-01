import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "path";

const existsSync = vi.fn();
const readFileSync = vi.fn();
const getAllProjectGallerySlugs = vi.fn();
const getProjectGallery = vi.fn();

vi.mock("fs", () => ({
  default: {
    existsSync: (...args: unknown[]) => existsSync(...args),
    readFileSync: (...args: unknown[]) => readFileSync(...args),
    readdirSync: () => [],
  },
}));

vi.mock("@/lib/project-gallery", () => ({
  getAllProjectGallerySlugs: (...args: unknown[]) => getAllProjectGallerySlugs(...args),
  getProjectGallery: (...args: unknown[]) => getProjectGallery(...args),
}));

let GET: typeof import("./route").GET;
let generateStaticParams: typeof import("./route").generateStaticParams;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  getAllProjectGallerySlugs.mockReturnValue([]);
  getProjectGallery.mockReturnValue({ desktop: [], mobile: [] });
  ({ GET, generateStaticParams } = await import("./route"));
});

describe("generateStaticParams", () => {
  it("lists desktop and mobile images per project slug", () => {
    getAllProjectGallerySlugs.mockReturnValue(["lifeos"]);
    getProjectGallery.mockReturnValue({ desktop: ["a.png"], mobile: ["b.png", "c.png"] });

    expect(generateStaticParams()).toEqual([
      { slug: "lifeos", file: ["desktop", "a.png"] },
      { slug: "lifeos", file: ["mobile", "b.png"] },
      { slug: "lifeos", file: ["mobile", "c.png"] },
    ]);
  });
});

function params(slug: string, file: string[]) {
  return { params: Promise.resolve({ slug, file }) };
}

describe("GET /projects/[slug]/[...file]", () => {
  it("serves an image within the project's own gallery directory", async () => {
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(Buffer.from("fake-image-bytes"));

    const res = await GET(new Request("https://example.com") as never, params("lifeos", ["desktop", "shot.png"]));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    const expectedPath = path.resolve(path.join(process.cwd(), "projects"), "lifeos", "desktop", "shot.png");
    expect(readFileSync).toHaveBeenCalledWith(expectedPath);
  });

  it("blocks path traversal outside the project's directory", async () => {
    existsSync.mockReturnValue(true);

    const res = await GET(new Request("https://example.com") as never, params("lifeos", ["..", "..", "etc", "passwd"]));

    expect(res.status).toBe(404);
    expect(readFileSync).not.toHaveBeenCalled();
  });

  it("returns 404 when the requested file doesn't exist", async () => {
    existsSync.mockReturnValue(false);

    const res = await GET(new Request("https://example.com") as never, params("lifeos", ["desktop", "missing.png"]));

    expect(res.status).toBe(404);
  });
});
