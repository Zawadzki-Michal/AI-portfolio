import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { deleteComment } from "@/lib/comments";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const deleted = await deleteComment(parsedId);
  if (!deleted) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
