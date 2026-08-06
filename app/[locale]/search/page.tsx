import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { SearchClient } from "@/components/SearchClient";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    locale: locale as Locale,
    path: "/search",
  });
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("search");

  return (
    <section className="mx-auto max-w-3xl px-6 py-16" data-pagefind-ignore>
      <h1 className="mb-8 font-display text-3xl font-semibold">{t("title")}</h1>
      <SearchClient />
    </section>
  );
}
