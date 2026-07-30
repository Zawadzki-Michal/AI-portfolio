/**
 * One-time setup: creates the `comments` table on the Neon/Vercel Postgres
 * database pointed to by DATABASE_URL. Safe to re-run — uses
 * CREATE TABLE IF NOT EXISTS.
 *
 * Required env vars:
 *   DATABASE_URL   Neon/Vercel Postgres connection string
 *
 * Usage:
 *   npm run db:init
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_slug TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_image TEXT,
      author_linkedin_id TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS comments_post_slug_idx ON comments (post_slug)
  `;

  console.log("comments table ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
