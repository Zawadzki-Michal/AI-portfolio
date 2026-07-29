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
 *   OPENROUTER_API_KEY        used to draft the post's LinkedIn teaser text
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
import { callModel } from "../lib/openrouter";
import { requireEnv } from "../lib/env";

const POSTS_DIR = path.join(process.cwd(), "posts");
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
// LinkedIn gets one post per article; English is the language published there.
const LINKEDIN_LOCALE = "en";
const TEASER_INSTRUCTIONS_PATH = path.join(
  process.cwd(),
  "automation",
  "linkedin-teaser-instructions.md",
);

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

/** Drafts the short hook text LinkedIn shows above the link preview, from the post's own title and body. */
async function generateTeaser(title: string, body: string): Promise<string> {
  const systemPrompt = fs.readFileSync(TEASER_INSTRUCTIONS_PATH, "utf8");
  const userPrompt = `Post title: ${title}\n\nFull post body:\n\n${body}`;
  return callModel(systemPrompt, userPrompt);
}

async function publishPost(slug: string, siteUrl: string, linkedin: LinkedInConfig) {
  const filePath = path.join(POSTS_DIR, slug, `index.${LINKEDIN_LOCALE}.md`);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

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

  console.log(`[publish] drafting LinkedIn teaser for "${data.title}"`);
  const teaser = await generateTeaser(data.title, content);

  const tags = (data.tags ?? []).map((t: string) => `#${t}`).join(" ");
  const commentary = [teaser, "", tags].filter(Boolean).join("\n");

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

// Force-exit on completion: open keep-alive sockets from fetch() can
// otherwise leave the event loop alive and hang the CI job indefinitely.
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
