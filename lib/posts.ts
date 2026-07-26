import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostFrontMatter = {
  title: string;
  date: string;
  tags: string[];
  cta_text?: string;
  cta_link?: string;
  /** Source article URL, set on posts drafted from the RSS + LLM pipeline. Used to avoid re-drafting the same item. */
  source_url?: string;
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

export function getPostSummary(slug: string): PostSummary {
  const filePath = path.join(POSTS_DIR, slug, "index.md");
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

export function getAllPosts(): PostSummary[] {
  return readPostDirs()
    .map(getPostSummary)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIR, slug, "index.md");
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

export function postUrl(slug: string): string {
  return `/posts/${slug}`;
}

export function collectSourceUrls(posts: PostSummary[]): Set<string> {
  return new Set(posts.map((post) => post.source_url).filter((url): url is string => Boolean(url)));
}

/** Source URLs already covered by an existing post, for RSS dedup. */
export function getAllSourceUrls(): Set<string> {
  return collectSourceUrls(getAllPosts());
}
