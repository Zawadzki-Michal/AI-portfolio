/**
 * Minimal client for LinkedIn's legacy UGC Post API (`/v2/ugcPosts`,
 * `/v2/assets`) under the `w_member_social` self-serve scope granted by the
 * "Share on LinkedIn" product. Used by the publish script that runs from
 * GitHub Actions after a post merges to `main`.
 *
 * Deliberately targets the unversioned `/v2/*` endpoints, not the newer
 * `/rest/images` + `/rest/posts` REST API — those live under LinkedIn's
 * Community Management API product, which requires a registered business
 * address to request and can't be added alongside Share on LinkedIn on the
 * same app (LinkedIn requires it be the app's only product). Share on
 * LinkedIn has no such requirement and is what this individual/self-serve
 * app actually has.
 *
 * Docs: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
 */

const LINKEDIN_API_BASE = "https://api.linkedin.com";
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
    "X-Restli-Protocol-Version": "2.0.0",
    ...extra,
  };
}

async function registerImageUpload(
  config: LinkedInConfig,
): Promise<{ uploadUrl: string; imageUrn: string }> {
  const registerRes = await fetch(`${LINKEDIN_API_BASE}/v2/assets?action=registerUpload`, {
    method: "POST",
    headers: authHeaders(config, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      registerUploadRequest: {
        owner: config.authorUrn,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        serviceRelationships: [
          { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" },
        ],
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!registerRes.ok) {
    throw new Error(`LinkedIn registerUpload failed: ${registerRes.status} ${await registerRes.text()}`);
  }

  const registerData = await registerRes.json();
  const uploadUrl =
    registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
      .uploadUrl;
  return { uploadUrl, imageUrn: registerData.value.asset };
}

/**
 * Uploads a single image buffer to LinkedIn and returns its image (asset) URN.
 */
export async function uploadImage(
  config: LinkedInConfig,
  imageBuffer: Buffer,
  contentType = "image/png",
): Promise<string> {
  const { uploadUrl, imageUrn } = await registerImageUpload(config);

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
 * Registers (but never completes) an image upload as a cheap way to prove
 * LINKEDIN_ACCESS_TOKEN is still valid and still has the w_member_social
 * scope — the same failure mode that only used to surface when a real post
 * tried to publish. An unfinished upload registration just expires on
 * LinkedIn's side; nothing is created.
 */
export async function checkTokenHealth(config: LinkedInConfig): Promise<void> {
  await registerImageUpload(config);
}

/**
 * Fetches the OpenID Connect `sub` claim for the access token's owner via
 * LinkedIn's `/v2/userinfo` endpoint (the same claim Auth.js stores as
 * `author_linkedin_id` on comments). Used to check whether LINKEDIN_AUTHOR_URN
 * was actually built from this claim, since `/v2/ugcPosts` rejects it in ways
 * that suggest it may expect a different member identifier entirely.
 */
export async function getUserInfoSub(accessToken: string): Promise<string> {
  const res = await fetch(`${LINKEDIN_API_BASE}/v2/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn userinfo failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.sub;
}

export type CreatePostOptions = {
  commentary: string;
  linkUrl: string;
  /** Used as the link preview title when there are no images. */
  title: string;
  imageUrns?: string[];
  visibility?: "PUBLIC" | "CONNECTIONS";
};

/**
 * Publishes a post via the UGC Post API. If image URNs are supplied, the
 * post is created as an image post with the article link appended to the
 * commentary text (the legacy API allows only one media category per post,
 * so images and an ARTICLE preview can't be combined). Without images, the
 * post uses the ARTICLE media category so LinkedIn renders a link preview.
 */
/**
 * `/v2/ugcPosts` validates its `author` field against
 * `urn:li:company:\d+|urn:li:member:-?\d+` — it rejects the `urn:li:person:`
 * form that LINKEDIN_AUTHOR_URN is configured with (and that `/v2/assets`
 * registerUpload's `owner` field accepts fine). Rewrite just for this call.
 */
function ugcAuthorUrn(authorUrn: string): string {
  return authorUrn.replace(/^urn:li:person:/, "urn:li:member:");
}

export async function createPost(config: LinkedInConfig, options: CreatePostOptions) {
  const commentary = `${options.commentary}\n\n${options.linkUrl}`;

  let shareMediaCategory: string;
  let media: Record<string, unknown>[] | undefined;
  if (options.imageUrns && options.imageUrns.length > 0) {
    shareMediaCategory = "IMAGE";
    media = options.imageUrns.map((urn) => ({ status: "READY", media: urn }));
  } else {
    shareMediaCategory = "ARTICLE";
    media = [{ status: "READY", originalUrl: options.linkUrl, title: { text: options.title } }];
  }

  const res = await fetch(`${LINKEDIN_API_BASE}/v2/ugcPosts`, {
    method: "POST",
    headers: authHeaders(config, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      author: ugcAuthorUrn(config.authorUrn),
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: commentary },
          shareMediaCategory,
          media,
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": options.visibility ?? "PUBLIC",
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn createPost failed: ${res.status} ${await res.text()}`);
  }

  return res.headers.get("x-restli-id") ?? res.headers.get("x-linkedin-id");
}
