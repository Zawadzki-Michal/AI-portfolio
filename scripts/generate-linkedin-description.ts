/**
 * Fills in `linkedin_description` front-matter on any post that's missing
 * it. Sends the full post body to OpenRouter with the system prompt in
 * automation/linkedin-description-instructions.md, then writes the result
 * back into that post's index.en.md.
 *
 * Runs from generate-linkedin-description.yml on push to any branch other
 * than main that touches posts/** — so the generated teaser shows up as a
 * diff in the open PR before merge. Posts that already have
 * linkedin_description are left alone.
 *
 * A branch checked out from (or merged with) main carries every post that's
 * already deployed, not just the new one(s) the PR is actually about — so
 * this never touches a post slug that already exists on origin/main, even
 * if that post is missing linkedin_description too. Those are already
 * published; editing them here would just be a stray, unrelated diff on
 * someone else's PR.
 *
 * Required env vars:
 *   OPENROUTER_API_KEY
 * Optional env vars:
 *   OPENROUTER_MODEL  defaults to anthropic/claude-opus-4.5
 *
 * Usage:
 *   npm run generate-linkedin-description            # check every post
 *   npm run generate-linkedin-description -- <slug>  # check one post
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import { getAllPostSlugs } from "../lib/posts";
import { callOpenRouter } from "../lib/openrouter";

const POSTS_DIR = path.join(process.cwd(), "posts");
const INSTRUCTIONS_PATH = path.join(
  process.cwd(),
  "automation",
  "linkedin-description-instructions.md",
);

function postFilePath(slug: string): string {
  return path.join(POSTS_DIR, slug, "index.en.md");
}

/** Post slugs already on main — i.e. already deployed and off-limits here. */
function getDeployedSlugs(): Set<string> {
  try {
    execSync("git fetch origin main --quiet", { stdio: "ignore" });
  } catch {
    // Best effort — fall through to whatever origin/main ref is already
    // available locally (or fail closed below if there isn't one).
  }

  try {
    const output = execSync("git ls-tree -d --name-only origin/main:posts", {
      encoding: "utf8",
    });
    return new Set(output.split("\n").map((s) => s.trim()).filter(Boolean));
  } catch (err) {
    throw new Error(
      `Could not read the post list from origin/main — refusing to run without it, ` +
        `since that's what protects already-deployed posts from being edited: ${err}`,
    );
  }
}

/**
 * Inserts a field into the raw front-matter block by string manipulation
 * rather than `matter.stringify(content, data)`, which reformats every
 * field in the block (dates gain a time component, quoting style changes)
 * and would turn a one-field addition into a noisy diff across the whole
 * post.
 */
function appendFrontMatterField(raw: string, key: string, value: string): string {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error("Could not find a front-matter block to update");
  const updatedBlock = `---\n${match[1]}\n${key}: ${JSON.stringify(value)}\n---\n`;
  return raw.slice(0, match.index) + updatedBlock + raw.slice(match[0].length);
}

async function generateDescription(title: string, body: string): Promise<string> {
  const systemPrompt = fs.readFileSync(INSTRUCTIONS_PATH, "utf8");
  const userPrompt = `Title: ${title}\n\nBody:\n${body}`;
  return callOpenRouter(systemPrompt, userPrompt, { maxTokens: 200 });
}

async function processPost(slug: string, deployedSlugs: Set<string>): Promise<boolean> {
  if (deployedSlugs.has(slug)) {
    console.log(`Skipping ${slug}: already deployed on main`);
    return false;
  }

  const filePath = postFilePath(slug);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${slug}: no index.en.md`);
    return false;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (data.linkedin_description) {
    console.log(`Skipping ${slug}: linkedin_description already set`);
    return false;
  }

  console.log(`Generating LinkedIn description for ${slug}...`);
  const description = await generateDescription(data.title, content);

  const updated = appendFrontMatterField(raw, "linkedin_description", description);
  fs.writeFileSync(filePath, updated);
  console.log(`  -> "${description}"`);
  return true;
}

async function main() {
  const deployedSlugs = getDeployedSlugs();
  const requestedSlug = process.argv[2];
  const slugs = requestedSlug ? [requestedSlug] : getAllPostSlugs();

  let changed = 0;
  for (const slug of slugs) {
    if (await processPost(slug, deployedSlugs)) changed++;
  }

  console.log(
    changed === 0
      ? "No posts needed a LinkedIn description."
      : `Generated ${changed} LinkedIn description(s).`,
  );
}

// Force-exit on completion: open keep-alive sockets from fetch() can
// otherwise leave the event loop alive and hang the CI job indefinitely.
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
