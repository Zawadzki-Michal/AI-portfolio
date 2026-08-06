"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import type { Comment } from "@/lib/comments";

export function Comments({ slug }: { slug: string }) {
  const t = useTranslations("comments");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [initialComments, setInitialComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        setConfigured(Boolean(data.configured));
        setInitialComments(data.comments ?? []);
      })
      .catch(() => setFetchError(true));
  }, [slug]);

  if (fetchError) {
    return <p className="mt-16 text-sm text-paper/60">{t("unavailable")}</p>;
  }

  if (!configured) return null;

  return (
    <SessionProvider>
      <CommentsBody slug={slug} initialComments={initialComments} />
    </SessionProvider>
  );
}

function CommentsBody({ slug, initialComments }: { slug: string; initialComments: Comment[] }) {
  const t = useTranslations("comments");
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || submitting) return;

    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body: draft }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setDraft("");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="status-dot" />
        <span className="label-mono">{t("heading")}</span>
      </div>

      {comments.length === 0 && <p className="text-sm text-paper/60">{t("empty")}</p>}

      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="panel-card flex gap-3 p-4">
            {comment.authorImage ? (
              <Image
                src={comment.authorImage}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-line font-mono text-sm">
                {comment.authorName.charAt(0)}
              </span>
            )}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-sm font-medium">{comment.authorName}</span>
                <time className="label-mono" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-paper/90">{comment.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {status === "authenticated" && session?.user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="panel-card w-full resize-none p-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !draft.trim()}
                className="shrink-0 rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90 disabled:opacity-50"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
              {error && <span className="text-sm text-paper/60">{t("error")}</span>}
            </div>
          </form>
        ) : status === "loading" ? null : (
          <button
            type="button"
            onClick={() => signIn("linkedin")}
            className="rounded-md bg-[#0a66c2] px-4 py-2 font-mono text-sm font-medium text-white transition hover:bg-[#0a66c2]/90"
          >
            {t("signIn")}
          </button>
        )}
      </div>
    </div>
  );
}
