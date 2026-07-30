import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostList } from "@/components/PostList";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const tags = getAllTags(routing.defaultLocale);
  return routing.locales.flatMap((locale) => tags.map(({ tag }) => ({ locale, tag })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  const t = await getTranslations({ locale, namespace: "tagsIndex" });
  return buildMetadata({
    title: `#${tag} — ${t("title")}`,
    description: t("metaDescription"),
    locale: locale as Locale,
    path: `/tags/${tag}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("tagPage");
  const posts = getPostsByTag(tag, locale as Locale);

  if (posts.length === 0) notFound();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Link href={`/${locale}/tags`} className="label-mono transition hover:text-paper">
        {t("back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">#{tag}</h1>
      <p className="label-mono mt-2">{t("countLabel", { count: posts.length })}</p>
      <div className="mt-8">
        <PostList posts={posts} />
      </div>
    </section>
  );
}
