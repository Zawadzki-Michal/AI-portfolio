/**
 * Scheduled health check for LINKEDIN_ACCESS_TOKEN, run independently of any
 * post publish. LinkedIn access tokens last 60 days and revocation isn't
 * automated here (see README "LinkedIn API notes") — without this, a dead
 * token is only discovered when a real post fails to publish. Fails loudly
 * (non-zero exit) so the workflow run shows red days ahead of the next post.
 *
 * Required env vars: LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN
 */

import { checkTokenHealth, type LinkedInConfig } from "../lib/linkedin";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function main() {
  const linkedin: LinkedInConfig = {
    accessToken: requireEnv("LINKEDIN_ACCESS_TOKEN"),
    authorUrn: requireEnv("LINKEDIN_AUTHOR_URN"),
  };

  await checkTokenHealth(linkedin);
  console.log("[check-linkedin-token] LINKEDIN_ACCESS_TOKEN is valid.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[check-linkedin-token] LINKEDIN_ACCESS_TOKEN check failed:", err);
    process.exit(1);
  });
