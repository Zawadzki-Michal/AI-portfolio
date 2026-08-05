/**
 * Run from CI after a merge to `main`. Finds post folders that were newly
 * added in the push, waits for the Vercel deploy of each post's URL to go
 * live, uploads any images to LinkedIn, and publishes a post with a link
 * back to the article.
 *
 * Required env vars:
 *   SITE_URL                 e.g. https://twojastrona.pl
 *   LINKEDIN_ACCESS_TOKEN
 *   LINKEDIN_AUTHOR_URN       e.g. urn:li:person:xxxxxxxx
 *
 * For push-triggered runs (detects newly added post folders automatically):
 *   GITHUB_BASE_SHA           SHA before the push (previous main)
 *   GITHUB_HEAD_SHA           SHA after the push (current main)
 *
 * For a manual retry of one specific post (e.g. via workflow_dispatch after
 * a failed run), set POST_SLUG instead — GITHUB_BASE_SHA/GITHUB_HEAD_SHA are
 * not needed in that case.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import { createPost, uploadImage, contentTypeFor, type LinkedInConfig } from "../lib/linkedin";
import { postUrl } from "../lib/post-url";
import { waitForUrl } from "../lib/wait-for-url";

const POSTS_DIR = path.join(process.cwd(), "posts");
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
// LinkedIn gets one post per article; English is the language published there.
const LINKEDIN_LOCALE = "en";

function getAddedPostSlugs(baseSha: string, headSha: string): string[] {
  const diffOutput = execSync(
    `git diff --diff-filter=A --name-only ${baseSha} ${headSha} -- posts`,
    { encoding: "utf8" },
  );

  const slugs = new Set<string>();
  for (const line of diffOutput.split("\n")) {
    const match = line.match(/^posts\/([^/]+)\/index\.(en|pl)\.md$/);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}

function findImages(slug: string): string[] {
  const dir = path.join(POSTS_DIR, slug);
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()))
    .map((name) => path.join(dir, name));
}

/**
 * LinkedIn's `article` (link-preview) content type doesn't crawl the URL for
 * an og:image the way old-style shares did — without an uploaded image it
 * renders as bare text. Fetches the site's own generated OG image so posts
 * without a hand-picked image still show a picture.
 */
async function fetchOgImageBuffer(url: string): Promise<Buffer> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    console.log(`[publish] OG image fetch -> ${res.status}, retrying (${attempt}/3)`);
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 3_000));
  }
  throw new Error(`Failed to fetch OG image at ${url}`);
}

async function publishPost(slug: string, siteUrl: string, linkedin: LinkedInConfig) {
  const filePath = path.join(POSTS_DIR, slug, `index.${LINKEDIN_LOCALE}.md`);
  const { data } = matter(fs.readFileSync(filePath, "utf8"));

  const articleUrl = new URL(postUrl(slug, LINKEDIN_LOCALE), siteUrl).toString();
  console.log(`[publish] waiting for deploy: ${articleUrl}`);
  await waitForUrl(articleUrl, { expectedContent: data.title });

  const imagePaths = findImages(slug);
  console.log(`[publish] found ${imagePaths.length} image(s) for ${slug}`);

  const imageUrns: string[] = [];
  for (const imagePath of imagePaths) {
    const buffer = fs.readFileSync(imagePath);
    const urn = await uploadImage(linkedin, buffer, contentTypeFor(imagePath));
    imageUrns.push(urn);
  }

  if (imageUrns.length === 0) {
    const ogImageUrl = new URL(`${postUrl(slug, LINKEDIN_LOCALE)}/opengraph-image`, siteUrl).toString();
    console.log(`[publish] no post images, falling back to generated OG image: ${ogImageUrl}`);
    const buffer = await fetchOgImageBuffer(ogImageUrl);
    imageUrns.push(await uploadImage(linkedin, buffer, "image/png"));
  }

  const tags = (data.tags ?? []).map((t: string) => `#${t}`).join(" ");
  const commentary = [data.title, data.linkedin_description, tags].filter(Boolean).join("\n");

  const id = await createPost(linkedin, {
    commentary,
    linkUrl: articleUrl,
    title: data.title,
    imageUrns,
  });

  console.log(`[publish] published "${data.title}" -> ${id ?? "(no id returned)"}`);
}

async function main() {
  const siteUrl = requireEnv("SITE_URL");
  const linkedin: LinkedInConfig = {
    accessToken: requireEnv("LINKEDIN_ACCESS_TOKEN"),
    authorUrn: requireEnv("LINKEDIN_AUTHOR_URN"),
  };

  const manualSlug = process.env.POST_SLUG?.trim();
  const slugs = manualSlug
    ? [manualSlug]
    : getAddedPostSlugs(requireEnv("GITHUB_BASE_SHA"), requireEnv("GITHUB_HEAD_SHA"));

  if (slugs.length === 0) {
    console.log("No new posts in this push. Nothing to publish.");
    return;
  }

  console.log(`Found ${slugs.length} new post(s): ${slugs.join(", ")}`);
  for (const slug of slugs) {
    await publishPost(slug, siteUrl, linkedin);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Force-exit on completion: open keep-alive sockets from fetch() can
// otherwise leave the event loop alive and hang the CI job indefinitely.
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
