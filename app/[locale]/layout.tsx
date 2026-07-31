import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing, type Locale } from "@/i18n/routing";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeScript } from "@/components/ThemeScript";
import { siteConfig } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    // Inherited by every page in this tree, used to resolve every relative
    // canonical/openGraph URL returned by lib/seo.ts's buildMetadata().
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      // ThemeScript sets data-theme on this element synchronously, before
      // hydration, based on localStorage — React has no way to know that
      // value during SSR, so without this it flags a hydration mismatch on
      // every page load for anyone who's picked the light theme.
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <ThemeScript />
        <NextIntlClientProvider>
          <SiteNav />
          {/* data-pagefind-body: scopes the search index (see postbuild script)
              to actual page content, skipping nav/footer boilerplate. Once any
              page on the site has this attribute, Pagefind only indexes pages
              that do — which also quietly excludes standalone routes like
              sentry-example-page that don't share this layout. */}
          <main className="flex-1" data-pagefind-body>
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
