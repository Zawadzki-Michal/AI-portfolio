"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: number;
  postSlug: string;
  authorName: string;
  authorImage: string | null;
  body: string;
  createdAt: string;
};

export function CommentModeration() {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/comments")
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments ?? []);
        setConfigured(data.configured ?? true);
      });
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment? This can't be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setComments((current) => current?.filter((c) => c.id !== id) ?? current);
    } else {
      alert("Failed to delete comment.");
    }
  }

  if (!configured) {
    return <p className="text-sm text-paper/60">Comments aren&apos;t configured (no DATABASE_URL set).</p>;
  }

  if (comments === null) {
    return <p className="text-sm text-paper/60">Loading…</p>;
  }

  if (comments.length === 0) {
    return <p className="text-sm text-paper/60">No comments yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <div key={comment.id} className="panel-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            {comment.authorImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={comment.authorImage} alt={comment.authorName} className="h-9 w-9 rounded-full" />
            )}
            <div>
              <p className="font-mono text-sm">
                {comment.authorName} <span className="text-paper/40">on {comment.postSlug}</span>
              </p>
              <p className="mt-1 text-sm text-paper/80">{comment.body}</p>
              <p className="label-mono mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(comment.id)}
            disabled={deletingId === comment.id}
            className="self-start font-mono text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
          >
            {deletingId === comment.id ? "deleting…" : "delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
