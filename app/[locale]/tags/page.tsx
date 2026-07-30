import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllTags } from "@/lib/posts";
import { tagUrl } from "@/lib/post-url";
import { StatusDot } from "@/components/StatusDot";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tagsIndex" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    locale: locale as Locale,
    path: "/tags",
  });
}

export default async function TagsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("tagsIndex");
  const tags = getAllTags(locale as Locale);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <StatusDot label={t("countLabel", { count: tags.length })} />
      </div>
      {tags.length === 0 ? (
        <p className="text-paper/50">{t("emptyMsg")}</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={tagUrl(tag, locale as Locale)}
              className="panel-card flex items-center gap-2 px-4 py-2 font-mono text-sm text-paper/80 transition hover:border-teal hover:text-paper"
            >
              #{tag}
              <span className="text-paper/40">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
