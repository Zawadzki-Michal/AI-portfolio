"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This removes it (and its images) from main immediately.`)) return;
    setPending(true);
    const res = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    setPending(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete post.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="font-mono text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "deleting…" : "delete"}
    </button>
  );
}
