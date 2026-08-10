/**
 * Scheduled health check for LINKEDIN_ACCESS_TOKEN, run independently of any
 * post publish. LinkedIn access tokens last 60 days and revocation isn't
 * automated here (see README "LinkedIn API notes") — without this, a dead
 * token is only discovered when a real post fails to publish. Fails loudly
 * (non-zero exit) so the workflow run shows red days ahead of the next post.
 *
 * Required env vars: LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN
 */

import { checkTokenHealth, getUserInfoSub, type LinkedInConfig } from "../lib/linkedin";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/**
 * Diagnostic for the createPost 403 ACCESS_DENIED "Data Processing Exception"
 * on /author: checks whether LINKEDIN_AUTHOR_URN's ID actually is this
 * token's OIDC `sub` claim, and whether it's numeric (ugcPosts's `author`
 * field only validates urn:li:company:\d+ or urn:li:member:-?\d+). Logs
 * booleans only — never the raw id, sub, or urn.
 */
async function logIdentityDiagnostic(linkedin: LinkedInConfig) {
  const configuredId = linkedin.authorUrn.split(":").pop() ?? "";
  const sub = await getUserInfoSub(linkedin.accessToken);
  console.log(`[check-linkedin-token] LINKEDIN_AUTHOR_URN id matches token's OIDC sub: ${configuredId === sub}`);
  console.log(`[check-linkedin-token] configured id is numeric: ${/^-?\d+$/.test(configuredId)}`);
  console.log(`[check-linkedin-token] token's sub is numeric: ${/^-?\d+$/.test(sub)}`);
}

async function main() {
  const linkedin: LinkedInConfig = {
    accessToken: requireEnv("LINKEDIN_ACCESS_TOKEN"),
    authorUrn: requireEnv("LINKEDIN_AUTHOR_URN"),
  };

  await checkTokenHealth(linkedin);
  console.log("[check-linkedin-token] LINKEDIN_ACCESS_TOKEN is valid.");
  await logIdentityDiagnostic(linkedin);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[check-linkedin-token] LINKEDIN_ACCESS_TOKEN check failed:", err);
    process.exit(1);
  });
