import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { StatusDot } from "@/components/StatusDot";

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
  return { title: t("metaTitle") };
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
      <PostList posts={posts} />
    </section>
  );
}
