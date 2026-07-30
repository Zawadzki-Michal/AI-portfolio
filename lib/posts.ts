import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostFrontMatter = {
  title: string;
  date: string;
  tags: string[];
  cta_text?: string;
  cta_link?: string;
  /** Source article URL, set on posts drafted from the RSS + LLM pipeline. Used to avoid re-drafting the same item. */
  source_url?: string;
  /** AI-generated LinkedIn teaser, set by scripts/generate-linkedin-description.ts. Not rendered on the site — used by publish-to-linkedin.ts as part of the post commentary. */
  linkedin_description?: string;
};

export type PostSummary = PostFrontMatter & {
  slug: string;
};

export type Post = PostSummary & {
  contentHtml: string;
};

function readPostDirs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getAllPostSlugs(): string[] {
  return readPostDirs();
}

/**
 * Resolves the content file for a post in the requested locale, falling
 * back to the default locale (English) when a translation doesn't exist
 * yet. Older posts written before i18n also fall back to a bare
 * `index.md` for backward compatibility.
 */
function resolvePostFilePath(slug: string, locale: Locale): string {
  const localized = path.join(POSTS_DIR, slug, `index.${locale}.md`);
  if (fs.existsSync(localized)) return localized;

  const defaultLocalized = path.join(POSTS_DIR, slug, `index.${routing.defaultLocale}.md`);
  if (fs.existsSync(defaultLocalized)) return defaultLocalized;

  return path.join(POSTS_DIR, slug, "index.md");
}

export function getPostSummary(slug: string, locale: Locale): PostSummary {
  const filePath = resolvePostFilePath(slug, locale);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date,
    tags: data.tags ?? [],
    cta_text: data.cta_text,
    cta_link: data.cta_link,
    source_url: data.source_url,
  };
}

export function getAllPosts(locale: Locale): PostSummary[] {
  return readPostDirs()
    .map((slug) => getPostSummary(slug, locale))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<Post> {
  const filePath = resolvePostFilePath(slug, locale);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkHtml).process(content);

  return {
    slug,
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date,
    tags: data.tags ?? [],
    cta_text: data.cta_text,
    cta_link: data.cta_link,
    source_url: data.source_url,
    contentHtml: processed.toString(),
  };
}

export function collectSourceUrls(posts: PostSummary[]): Set<string> {
  return new Set(posts.map((post) => post.source_url).filter((url): url is string => Boolean(url)));
}

/** Source URLs already covered by an existing post, for RSS dedup. Checked against the default locale, which every drafted post always has. */
export function getAllSourceUrls(): Set<string> {
  return collectSourceUrls(getAllPosts(routing.defaultLocale));
}
