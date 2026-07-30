/**
 * Thin client for GitHub's Contents API, used by the admin panel to read
 * and write posts/** directly against `main` — no local git checkout
 * involved, since the admin routes run as Vercel serverless functions.
 *
 * Reads go straight to the GitHub API rather than the local filesystem
 * (unlike lib/posts.ts, which the public site uses) so the admin panel
 * always reflects the true current repo state, not whatever was bundled
 * into the currently-running deployment.
 *
 * Auth is a fine-grained personal access token (GITHUB_ADMIN_TOKEN) scoped
 * to Contents: read & write on this repo only — deliberately separate from
 * the GitHub OAuth login used to gate /admin (see auth.ts), so a repo-write
 * credential never ends up in a browser session.
 */

const GITHUB_API_BASE = "https://api.github.com";
const OWNER = "Zawadzki-Michal";
const REPO = "AI-portfolio";
const BRANCH = "main";
const REQUEST_TIMEOUT_MS = 30_000;

export type GitHubFile = {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  size: number;
};

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_ADMIN_TOKEN;
  if (!token) throw new Error("Missing required env var: GITHUB_ADMIN_TOKEN");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${GITHUB_API_BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

/** Lists the entries of a directory at HEAD of main. Empty array if it doesn't exist. */
export async function listDirectory(path: string): Promise<GitHubFile[]> {
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`GitHub listDirectory(${path}) failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

/** Reads a single file's content + sha at HEAD of main. Null if it doesn't exist. */
export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub getFile(${path}) failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return { content: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

/**
 * Creates or updates a file in a single commit to main. Pass `sha` (from a
 * prior getFile/listDirectory) when updating an existing file — omit it to
 * create a new one. `encoding: "base64"` skips the UTF-8 re-encode for
 * binary content (image uploads) that's already base64.
 */
export async function putFile(params: {
  path: string;
  content: string;
  message: string;
  sha?: string;
  encoding?: "utf8" | "base64";
}): Promise<void> {
  const base64Content =
    params.encoding === "base64" ? params.content : Buffer.from(params.content, "utf8").toString("base64");

  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${params.path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: params.message,
      content: base64Content,
      sha: params.sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub putFile(${params.path}) failed: ${res.status} ${await res.text()}`);
  }
}

export async function deleteFile(params: { path: string; message: string; sha: string }): Promise<void> {
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${params.path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: params.message,
      sha: params.sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub deleteFile(${params.path}) failed: ${res.status} ${await res.text()}`);
  }
}

export async function listPostSlugs(): Promise<string[]> {
  const entries = await listDirectory("posts");
  return entries.filter((entry) => entry.type === "dir").map((entry) => entry.name);
}

/**
 * Deletes every file in a post's folder. One commit per file (the Contents
 * API has no multi-file delete) — acceptable for a personal admin tool
 * where a handful of extra commits in history isn't a real cost.
 */
export async function deletePost(slug: string, message: string): Promise<void> {
  const files = await listDirectory(`posts/${slug}`);
  for (const file of files) {
    if (file.type !== "file") continue;
    await deleteFile({ path: file.path, message, sha: file.sha });
  }
}
