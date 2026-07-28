import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "projects");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export type GalleryVariant = "desktop" | "mobile";

export type ProjectGalleryImages = {
  desktop: string[];
  mobile: string[];
};

function readImages(slug: string, variant: GalleryVariant): string[] {
  const dir = path.join(PROJECTS_DIR, slug, variant);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();
}

/** Screenshots for a project, read from `projects/<slug>/desktop/` and `projects/<slug>/mobile/` — empty arrays if the folders don't exist yet. */
export function getProjectGallery(slug: string): ProjectGalleryImages {
  return {
    desktop: readImages(slug, "desktop"),
    mobile: readImages(slug, "mobile"),
  };
}

export function getAllProjectGallerySlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
