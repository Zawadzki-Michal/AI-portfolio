import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import {
  addPostImage,
  deleteAdminPost,
  getAdminPost,
  parseImagesFromForm,
  parsePostForm,
  removePostImage,
  updateAdminPost,
} from "@/lib/admin-posts";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const post = await getAdminPost(slug);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const formData = await req.formData();

  let input;
  try {
    input = parsePostForm(formData);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    await updateAdminPost(slug, input);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 });
  }

  const removeImages = String(formData.get("removeImages") ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  for (const filename of removeImages) {
    await removePostImage(slug, filename);
  }

  const images = await parseImagesFromForm(formData);
  for (const image of images) {
    await addPostImage(slug, image.filename, image.base64);
  }

  return NextResponse.json({ slug });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  await deleteAdminPost(slug);
  return NextResponse.json({ ok: true });
}
