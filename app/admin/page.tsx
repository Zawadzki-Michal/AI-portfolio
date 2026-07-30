import Link from "next/link";
import { listAdminPosts } from "@/lib/admin-posts";
import { getAllComments, isCommentsConfigured } from "@/lib/comments";

export default async function AdminDashboard() {
  const posts = await listAdminPosts();
  const commentsConfigured = isCommentsConfigured();
  const comments = commentsConfigured ? await getAllComments() : [];

  const stats: { label: string; value: number | string; href: string }[] = [
    { label: "Posts", value: posts.length, href: "/admin/posts" },
    { label: "Comments", value: commentsConfigured ? comments.length : "—", href: "/admin/comments" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="panel-card block p-6 transition hover:border-amber/50"
          >
            <p className="label-mono">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/posts/new"
          className="inline-block rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
        >
          + New post
        </Link>
      </div>
    </div>
  );
}
