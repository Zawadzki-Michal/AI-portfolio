import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { postUrl } from "@/lib/posts";
import { StatusDot } from "./StatusDot";

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-paper/50">No entries logged yet. First post incoming.</p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.slug} className="py-5">
          <Link href={postUrl(post.slug)} className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <StatusDot />
                <h3 className="font-display text-lg font-medium group-hover:text-amber">
                  {post.title}
                </h3>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 pl-5">
                {post.tags.map((tag) => (
                  <span key={tag} className="label-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <time className="label-mono shrink-0" dateTime={post.date}>
              {post.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
