"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { PostSummary } from "@/lib/posts";
import { postUrl, tagUrl } from "@/lib/post-url";
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
      {posts.map((post, i) => (
        <motion.li
          key={post.slug}
          className="py-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link href={postUrl(post.slug, locale)} className="group flex items-center gap-3">
              <StatusDot />
              <h3 className="font-display text-lg font-medium transition-transform group-hover:translate-x-1 group-hover:text-amber">
                {post.title}
              </h3>
            </Link>
            <time className="label-mono shrink-0" dateTime={post.date}>
              {post.date}
            </time>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 pl-5">
            {post.tags.map((tag) => (
              <Link key={tag} href={tagUrl(tag, locale)} className="label-mono transition hover:text-teal">
                #{tag}
              </Link>
            ))}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
