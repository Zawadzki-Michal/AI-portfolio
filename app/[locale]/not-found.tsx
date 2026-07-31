import { getTranslations, setRequestLocale } from "next-intl/server";
import { NotFoundContent } from "@/components/NotFoundContent";
import { routing, type Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params?: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = (resolved?.locale as Locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "notFound" });
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function NotFound({ params }: { params?: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = (resolved?.locale as Locale) ?? routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <NotFoundContent
      status={t("status")}
      title={t("title")}
      description={t("description")}
      cta={t("cta")}
      homeHref={`/${locale}`}
    />
  );
}
