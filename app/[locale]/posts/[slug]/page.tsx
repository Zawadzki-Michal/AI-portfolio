import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { postUrl, tagUrl } from "@/lib/post-url";
import { CtaBlock } from "@/components/CtaBlock";
import { StatusDot } from "@/components/StatusDot";
import { Comments } from "@/components/Comments";
import { PostList } from "@/components/PostList";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const post = await getPostBySlug(slug, locale as Locale);
    return buildMetadata({
      title: `${post.title} — System Status`,
      // linkedin_description is already a hand-tuned (or AI-generated,
      // human-reviewed) short teaser under 220 chars — exactly what a good
      // meta description should be. Falls back to the post's tags when a
      // post predates that field.
      description: post.linkedin_description ?? `Log entry — ${post.tags.join(", ")}.`,
      locale: locale as Locale,
      path: `/posts/${slug}`,
      type: "article",
      publishedTime: post.date,
    });
  } catch {
    return { title: "404 — System Status", robots: { index: false, follow: false } };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  let post;
  try {
    post = await getPostBySlug(slug, locale as Locale);
  } catch {
    notFound();
  }

  const related = getRelatedPosts(slug, locale as Locale);
  const tRelated = await getTranslations({ locale, namespace: "relatedPosts" });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <ReadingProgress />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.linkedin_description ?? `Log entry — ${post.tags.join(", ")}.`,
          datePublished: post.date,
          slug,
          locale: locale as Locale,
        })}
      />
      <div className="mb-6 flex items-center gap-3">
        <StatusDot />
        <time className="label-mono" dateTime={post.date}>
          {post.date}
        </time>
      </div>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={tagUrl(tag, locale as Locale)} className="label-mono transition hover:text-teal">
            #{tag}
          </Link>
        ))}
      </div>
      <div
        className="prose prose-headings:font-display prose-a:text-teal mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <ShareButtons url={`${siteConfig.url}${postUrl(slug, locale as Locale)}`} title={post.title} />
      <CtaBlock ctaText={post.cta_text} ctaLink={post.cta_link} />
      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold">{tRelated("heading")}</h2>
          <PostList posts={related} />
        </section>
      )}
      <Comments slug={slug} />
    </article>
  );
}
