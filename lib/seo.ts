import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "./site-config";

/**
 * Next.js doesn't deep-merge `openGraph`/`twitter`/`alternates` between a
 * layout's generateMetadata and a page's — whichever segment sets one of
 * those keys fully replaces it. So every page builds its own complete
 * metadata via this helper rather than relying on partial inheritance from
 * the root layout. `metadataBase` (set once in app/[locale]/layout.tsx) is
 * the one field that *is* inherited, which is why canonical/openGraph URLs
 * below are relative paths, not full URLs.
 */
export function buildMetadata(params: {
  title: string;
  description: string;
  locale: Locale;
  /** Path without the locale prefix, e.g. "/about", "/posts/my-slug", "" for home. */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const canonicalPath = `/${params.locale}${params.path}`;
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `/${locale}${params.path}`]),
  );

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: canonicalPath,
      languages,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url: canonicalPath,
      siteName: siteConfig.name,
      type: params.type ?? "website",
      locale: params.locale,
      ...(params.publishedTime ? { publishedTime: params.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
    },
  };
}
