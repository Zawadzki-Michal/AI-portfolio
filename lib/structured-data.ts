import type { Locale } from "@/i18n/routing";
import { siteConfig } from "./site-config";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
  locale: Locale;
}) {
  const url = `${siteConfig.url}/${params.locale}/posts/${params.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    datePublished: params.datePublished,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
    mainEntityOfPage: url,
  };
}
