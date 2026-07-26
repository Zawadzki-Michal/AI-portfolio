import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAllPostSlugs } from "@/lib/posts";

const POSTS_DIR = path.join(process.cwd(), "posts");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export function generateStaticParams() {
  return getAllPostSlugs().flatMap((slug) => {
    const dir = path.join(POSTS_DIR, slug);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((name) => name !== "index.md")
      .map((name) => ({ slug, file: [name] }));
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string[] }> },
) {
  const { slug, file } = await params;
  const relPath = file.join("/");

  const dir = path.resolve(POSTS_DIR, slug);
  const filePath = path.resolve(dir, relPath);

  if (!filePath.startsWith(dir + path.sep) || relPath === "index.md") {
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
