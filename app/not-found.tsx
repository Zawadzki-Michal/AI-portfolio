import { getTranslations } from "next-intl/server";
import { NotFoundContent } from "@/components/NotFoundContent";
import { ThemeScript } from "@/components/ThemeScript";
import { routing } from "@/i18n/routing";
import "./globals.css";

// Catches genuinely-unmatched URLs (typos, dead links, pre-i18n bookmarks) —
// nested app/[locale]/not-found.tsx only fires for an explicit notFound()
// call from within a matched route (e.g. a missing post slug), not for a
// path that doesn't match any route at all. That case lands here instead,
// outside the [locale] segment entirely, so there's no reliable locale to
// read — this always renders in the site's default locale, same fallback
// app/[locale]/not-found.tsx itself uses when params are unavailable.
export async function generateMetadata() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "notFound" });
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function RootNotFound() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "notFound" });

  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <body className="bg-ink font-body text-paper">
        <ThemeScript />
        <NotFoundContent
          status={t("status")}
          title={t("title")}
          description={t("description")}
          cta={t("cta")}
          homeHref={`/${routing.defaultLocale}`}
        />
      </body>
    </html>
  );
}
