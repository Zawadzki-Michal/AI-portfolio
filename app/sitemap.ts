import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

// /search isn't included here: it has no query-specific content of its own
// to index (results render client-side), so a bare search page in a sitemap
// is just noise for crawlers rather than a useful URL to prioritize.
const STATIC_PATHS = ["", "/about", "/projects", "/posts", "/collaborate", "/tags", "/changelog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${siteConfig.url}/${locale}${path}`, changeFrequency: "weekly" });
    }

    for (const post of getAllPosts(locale)) {
      entries.push({
        url: `${siteConfig.url}/${locale}/posts/${post.slug}`,
        lastModified: post.date,
        changeFrequency: "monthly",
      });
    }

    for (const project of getProjects(locale)) {
      entries.push({
        url: `${siteConfig.url}/${locale}/projects/${project.slug}`,
        changeFrequency: "monthly",
      });
    }

    for (const { tag } of getAllTags(locale)) {
      entries.push({
        url: `${siteConfig.url}/${locale}/tags/${encodeURIComponent(tag)}`,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}
