import { beforeEach, describe, expect, it, vi } from "vitest";

const FIXTURE_DIRS: Record<string, { name: string; isFile: boolean }[]> = {
  "projects/lifeos/desktop": [
    { name: "SCR-2.png", isFile: true },
    { name: "SCR-1.jpg", isFile: true },
    { name: "notes.txt", isFile: true },
    { name: "subdir", isFile: false },
  ],
  "projects/lifeos/mobile": [{ name: "shot.webp", isFile: true }],
};

function normalize(p: string): string {
  return p.split(/[\\/]/).join("/").replace(/^.*(projects(\/.*)?)$/, "$1");
}

vi.mock("fs", () => ({
  default: {
    existsSync: (p: string) => {
      const key = normalize(p);
      return key === "projects" || key in FIXTURE_DIRS;
    },
    readdirSync: (p: string) => {
      const key = normalize(p);
      if (key === "projects") {
        return [{ name: "lifeos", isDirectory: () => true }];
      }
      const entries = FIXTURE_DIRS[key] ?? [];
      return entries.map((entry) => ({
        name: entry.name,
        isFile: () => entry.isFile,
        isDirectory: () => !entry.isFile,
      }));
    },
  },
}));

let gallery: typeof import("./project-gallery");

beforeEach(async () => {
  vi.resetModules();
  gallery = await import("./project-gallery");
});

describe("getProjectGallery", () => {
  it("returns sorted image files, filtering out non-images", () => {
    const images = gallery.getProjectGallery("lifeos");
    expect(images.desktop).toEqual(["SCR-1.jpg", "SCR-2.png"]);
    expect(images.mobile).toEqual(["shot.webp"]);
  });

  it("returns empty arrays when the project has no gallery folders", () => {
    const images = gallery.getProjectGallery("unknown-project");
    expect(images).toEqual({ desktop: [], mobile: [] });
  });
});

describe("getAllProjectGallerySlugs", () => {
  it("lists directories under projects/", () => {
    expect(gallery.getAllProjectGallerySlugs()).toEqual(["lifeos"]);
  });
});
