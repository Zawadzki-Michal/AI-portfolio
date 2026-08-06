import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { StatusDot } from "@/components/StatusDot";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "postsIndex" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    locale: locale as Locale,
    path: "/posts",
  });
}

export default async function PostsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("postsIndex");
  const posts = getAllPosts(locale as Locale);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <StatusDot label={t("entriesLabel", { count: posts.length })} />
      </div>
      <Link href="/tags" className="label-mono mb-6 inline-block transition hover:text-teal">
        {t("browseTags")}
      </Link>
      <PostList posts={posts} />
    </section>
  );
}
