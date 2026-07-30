import matter from "gray-matter";
import { slugify } from "./slugify";
import {
  deleteFile,
  deletePost as deletePostFiles,
  getFile,
  listDirectory,
  listPostSlugs,
  putFile,
} from "./github-content";

export type AdminPostInput = {
  title: string;
  date: string;
  tags: string[];
  cta_text?: string;
  cta_link?: string;
  source_url?: string;
  linkedin_description?: string;
  body: string;
};

export type AdminPostSummary = AdminPostInput & { slug: string };

const POST_FILE = "index.en.md";

function postPath(slug: string): string {
  return `posts/${slug}/${POST_FILE}`;
}

function buildFileContent(input: AdminPostInput): string {
  const frontMatter: Record<string, unknown> = { title: input.title, date: input.date, tags: input.tags };
  if (input.cta_text) frontMatter.cta_text = input.cta_text;
  if (input.cta_link) frontMatter.cta_link = input.cta_link;
  if (input.source_url) frontMatter.source_url = input.source_url;
  if (input.linkedin_description) frontMatter.linkedin_description = input.linkedin_description;
  return matter.stringify(input.body.trim() + "\n", frontMatter);
}

function parseFileContent(slug: string, raw: string): AdminPostSummary {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ""),
    tags: data.tags ?? [],
    cta_text: data.cta_text,
    cta_link: data.cta_link,
    source_url: data.source_url,
    linkedin_description: data.linkedin_description,
    body: content.trim(),
  };
}

export function slugFor(input: { title: string; date: string }): string {
  return `${input.date}-${slugify(input.title)}`;
}

export async function listAdminPosts(): Promise<AdminPostSummary[]> {
  const slugs = await listPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await getFile(postPath(slug));
      if (!file) return null;
      return parseFileContent(slug, file.content);
    }),
  );
  return posts.filter((post): post is AdminPostSummary => post !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAdminPost(
  slug: string,
): Promise<(AdminPostSummary & { images: string[] }) | null> {
  const file = await getFile(postPath(slug));
  if (!file) return null;
  const entries = await listDirectory(`posts/${slug}`);
  const images = entries.filter((entry) => entry.type === "file" && entry.name !== POST_FILE).map((entry) => entry.name);
  return { ...parseFileContent(slug, file.content), images };
}

export async function createAdminPost(input: AdminPostInput): Promise<{ slug: string }> {
  const slug = slugFor(input);
  const existing = await getFile(postPath(slug));
  if (existing) {
    throw new Error(`A post already exists at posts/${slug}`);
  }
  await putFile({
    path: postPath(slug),
    content: buildFileContent(input),
    message: `content: add post — ${input.title}`,
  });
  return { slug };
}

export async function updateAdminPost(slug: string, input: AdminPostInput): Promise<void> {
  const existing = await getFile(postPath(slug));
  if (!existing) {
    throw new Error(`No post at posts/${slug}`);
  }
  await putFile({
    path: postPath(slug),
    content: buildFileContent(input),
    message: `content: update post — ${input.title}`,
    sha: existing.sha,
  });
}

export async function addPostImage(slug: string, filename: string, base64: string): Promise<void> {
  await putFile({
    path: `posts/${slug}/${filename}`,
    content: base64,
    encoding: "base64",
    message: `content: add image to ${slug}`,
  });
}

export async function removePostImage(slug: string, filename: string): Promise<void> {
  const entries = await listDirectory(`posts/${slug}`);
  const file = entries.find((entry) => entry.name === filename);
  if (!file) return;
  await deleteFile({ path: file.path, sha: file.sha, message: `content: remove image from ${slug}` });
}

export async function deleteAdminPost(slug: string): Promise<void> {
  await deletePostFiles(slug, `content: delete post ${slug}`);
}

/** Parses the shared create/edit form fields out of a multipart FormData submission. */
export function parsePostForm(formData: FormData): AdminPostInput {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const cta_text = String(formData.get("cta_text") ?? "").trim() || undefined;
  const cta_link = String(formData.get("cta_link") ?? "").trim() || undefined;
  const source_url = String(formData.get("source_url") ?? "").trim() || undefined;
  const linkedin_description = String(formData.get("linkedin_description") ?? "").trim() || undefined;

  if (!title || !date || !body.trim()) {
    throw new Error("title, date, and body are required");
  }

  return { title, date, tags, cta_text, cta_link, source_url, linkedin_description, body };
}

/** Extracts the "images" File entries from a submission, base64-encoded and ready for addPostImage. */
export async function parseImagesFromForm(
  formData: FormData,
): Promise<{ filename: string; base64: string }[]> {
  const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File);
  return Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      base64: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
}
