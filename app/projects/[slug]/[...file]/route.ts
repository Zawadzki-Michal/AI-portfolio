import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAllProjectGallerySlugs, getProjectGallery } from "@/lib/project-gallery";

const PROJECTS_DIR = path.join(process.cwd(), "projects");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function generateStaticParams() {
  return getAllProjectGallerySlugs().flatMap((slug) => {
    const { desktop, mobile } = getProjectGallery(slug);
    return [
      ...desktop.map((name) => ({ slug, file: ["desktop", name] })),
      ...mobile.map((name) => ({ slug, file: ["mobile", name] })),
    ];
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string[] }> },
) {
  const { slug, file } = await params;
  const relPath = file.join("/");

  const dir = path.resolve(PROJECTS_DIR, slug);
  const filePath = path.resolve(dir, relPath);

  if (!filePath.startsWith(dir + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const data = fs.readFileSync(filePath);

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
