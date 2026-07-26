import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { PostSummary } from "@/lib/posts";
import { postUrl } from "@/lib/posts";
import type { Locale } from "@/i18n/routing";
import { StatusDot } from "./StatusDot";

export function PostList({ posts }: { posts: PostSummary[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("postsIndex");

  if (posts.length === 0) {
    return <p className="text-paper/50">{t("emptyMsg")}</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.slug} className="py-5">
          <Link
            href={postUrl(post.slug, locale)}
            className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
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
