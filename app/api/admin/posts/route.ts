import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { addPostImage, createAdminPost, listAdminPosts, parseImagesFromForm, parsePostForm } from "@/lib/admin-posts";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const posts = await listAdminPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const formData = await req.formData();

  let input;
  try {
    input = parsePostForm(formData);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  let slug: string;
  try {
    ({ slug } = await createAdminPost(input));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 409 });
  }

  const images = await parseImagesFromForm(formData);
  for (const image of images) {
    await addPostImage(slug, image.filename, image.base64);
  }

  return NextResponse.json({ slug });
}
