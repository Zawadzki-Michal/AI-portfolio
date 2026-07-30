import Link from "next/link";
import { listAdminPosts } from "@/lib/admin-posts";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export default async function AdminPostsPage() {
  const posts = await listAdminPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-ink transition hover:bg-amber/90"
        >
          + New post
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {posts.length === 0 && <p className="text-sm text-paper/60">No posts yet.</p>}
        {posts.map((post) => (
          <div
            key={post.slug}
            className="panel-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display font-medium">{post.title}</p>
              <p className="label-mono mt-1">
                {post.date} · {post.slug}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/posts/${post.slug}`} className="font-mono text-xs text-teal hover:text-teal/80">
                edit
              </Link>
              <DeletePostButton slug={post.slug} title={post.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
