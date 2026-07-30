import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { CtaBlock } from "@/components/CtaBlock";
import { StatusDot } from "@/components/StatusDot";
import { Comments } from "@/components/Comments";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

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
    return { title: "Post not found" };
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

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
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
          <span key={tag} className="label-mono">
            #{tag}
          </span>
        ))}
      </div>
      <div
        className="prose prose-invert prose-headings:font-display prose-a:text-teal mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <CtaBlock ctaText={post.cta_text} ctaLink={post.cta_link} />
      <Comments slug={slug} />
    </article>
  );
}
