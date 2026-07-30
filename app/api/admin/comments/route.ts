import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAllComments, isCommentsConfigured } from "@/lib/comments";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!isCommentsConfigured()) {
    return NextResponse.json({ comments: [], configured: false });
  }

  const comments = await getAllComments();
  return NextResponse.json({ comments, configured: true });
}
