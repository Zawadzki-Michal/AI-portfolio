import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createComment, getCommentsForSlug, isCommentsConfigured } from "@/lib/comments";

export async function GET(req: NextRequest) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ comments: [], configured: false });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const comments = await getCommentsForSlug(slug);
  return NextResponse.json({ comments, configured: true });
}

export async function POST(req: NextRequest) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ error: "comments are not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "sign in required" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.slug !== "string" || typeof body.body !== "string" || !body.body.trim()) {
    return NextResponse.json({ error: "invalid submission" }, { status: 400 });
  }

  const comment = await createComment({
    slug: body.slug,
    authorName: session.user.name ?? "LinkedIn user",
    authorImage: session.user.image ?? null,
    authorLinkedinId: session.user.id,
    body: body.body,
  });

  return NextResponse.json({ comment });
}
