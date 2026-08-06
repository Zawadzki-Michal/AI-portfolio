/**
 * Minimal client for the LinkedIn REST API (`/rest/images`, `/rest/posts`)
 * under the `w_member_social` self-serve scope. Used by the publish script
 * that runs from GitHub Actions after a post merges to `main`.
 *
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api
 *       https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */

const LINKEDIN_API_BASE = "https://api.linkedin.com";
// LinkedIn supports each version for a minimum of 1 year, then sunsets it —
// bump this periodically (see https://learn.microsoft.com/en-us/linkedin/marketing/versioning).
const LINKEDIN_VERSION = "202607";
const REQUEST_TIMEOUT_MS = 30_000;

export type LinkedInConfig = {
  accessToken: string;
  authorUrn: string; // e.g. "urn:li:person:xxxxxxxx"
};

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

/**
 * Maps an image file extension to its MIME type for the LinkedIn upload
 * binary PUT. Falls back to image/jpeg for unrecognized extensions.
 */
export function contentTypeFor(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  return CONTENT_TYPES[ext] ?? "image/jpeg";
}

function authHeaders(config: LinkedInConfig, extra?: Record<string, string>) {
  return {
    Authorization: `Bearer ${config.accessToken}`,
    "LinkedIn-Version": LINKEDIN_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    ...extra,
  };
}

async function initializeImageUpload(
  config: LinkedInConfig,
): Promise<{ uploadUrl: string; imageUrn: string }> {
  const initRes = await fetch(`${LINKEDIN_API_BASE}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers: authHeaders(config, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      initializeUploadRequest: { owner: config.authorUrn },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!initRes.ok) {
    throw new Error(`LinkedIn initializeUpload failed: ${initRes.status} ${await initRes.text()}`);
  }

  const initData = await initRes.json();
  return { uploadUrl: initData.value.uploadUrl, imageUrn: initData.value.image };
}

/**
 * Uploads a single image buffer to LinkedIn and returns its image URN.
 */
export async function uploadImage(
  config: LinkedInConfig,
  imageBuffer: Buffer,
  contentType = "image/png",
): Promise<string> {
  const { uploadUrl, imageUrn } = await initializeImageUpload(config);

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": contentType,
    },
    body: new Uint8Array(imageBuffer),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!uploadRes.ok) {
    throw new Error(`LinkedIn image binary upload failed: ${uploadRes.status}`);
  }

  return imageUrn;
}

/**
 * Reserves (but never completes) an image upload as a cheap way to prove
 * LINKEDIN_ACCESS_TOKEN is still valid and still has the w_member_social
 * scope — the same failure mode (401 REVOKED_ACCESS_TOKEN) that only used
 * to surface when a real post tried to publish. An unfinished upload
 * session just expires on LinkedIn's side; nothing is created.
 */
export async function checkTokenHealth(config: LinkedInConfig): Promise<void> {
  await initializeImageUpload(config);
}

export type CreatePostOptions = {
  commentary: string;
  linkUrl: string;
  /** Required by LinkedIn's `article` content block (link preview, used when there are no images). */
  title: string;
  imageUrns?: string[];
  visibility?: "PUBLIC" | "CONNECTIONS";
};

/**
 * Publishes a post. If image URNs are supplied, the post is created as an
 * image/multi-image post with the article link appended to the commentary
 * text (LinkedIn's Posts API allows only one content type — image or
 * article link-preview — per post, not both). Without images, the post
 * uses the `article` content type so LinkedIn renders a link preview.
 */
export async function createPost(config: LinkedInConfig, options: CreatePostOptions) {
  const commentary = `${options.commentary}\n\n${options.linkUrl}`;

  let content: Record<string, unknown> | undefined;
  if (options.imageUrns && options.imageUrns.length === 1) {
    content = { media: { id: options.imageUrns[0] } };
  } else if (options.imageUrns && options.imageUrns.length > 1) {
    content = {
      multiImage: {
        images: options.imageUrns.map((id) => ({ id })),
      },
    };
  } else {
    content = { article: { source: options.linkUrl, title: options.title } };
  }

  const res = await fetch(`${LINKEDIN_API_BASE}/rest/posts`, {
    method: "POST",
    headers: authHeaders(config, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      author: config.authorUrn,
      commentary,
      visibility: options.visibility ?? "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content,
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn createPost failed: ${res.status} ${await res.text()}`);
  }

  return res.headers.get("x-restli-id") ?? res.headers.get("x-linkedin-id");
}
