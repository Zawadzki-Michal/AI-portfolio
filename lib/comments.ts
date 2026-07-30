import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

export function isCommentsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getSql(): NeonQueryFunction<false, false> {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set — comments are unconfigured");
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export type Comment = {
  id: number;
  postSlug: string;
  authorName: string;
  authorImage: string | null;
  authorLinkedinId: string;
  body: string;
  createdAt: string;
};

const MAX_BODY_LENGTH = 2000;

function rowToComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as number,
    postSlug: row.post_slug as string,
    authorName: row.author_name as string,
    authorImage: (row.author_image as string) ?? null,
    authorLinkedinId: row.author_linkedin_id as string,
    body: row.body as string,
    createdAt: (row.created_at as Date).toString(),
  };
}

export async function getCommentsForSlug(slug: string): Promise<Comment[]> {
  const rows = await getSql()`
    SELECT id, post_slug, author_name, author_image, author_linkedin_id, body, created_at
    FROM comments
    WHERE post_slug = ${slug}
    ORDER BY created_at ASC
  `;
  return rows.map(rowToComment);
}

export async function createComment(params: {
  slug: string;
  authorName: string;
  authorImage: string | null;
  authorLinkedinId: string;
  body: string;
}): Promise<Comment> {
  const body = params.body.trim().slice(0, MAX_BODY_LENGTH);
  const [row] = await getSql()`
    INSERT INTO comments (post_slug, author_name, author_image, author_linkedin_id, body)
    VALUES (${params.slug}, ${params.authorName}, ${params.authorImage}, ${params.authorLinkedinId}, ${body})
    RETURNING id, post_slug, author_name, author_image, author_linkedin_id, body, created_at
  `;
  return rowToComment(row);
}

/** Newest first, across every post — for the admin moderation view. */
export async function getAllComments(): Promise<Comment[]> {
  const rows = await getSql()`
    SELECT id, post_slug, author_name, author_image, author_linkedin_id, body, created_at
    FROM comments
    ORDER BY created_at DESC
  `;
  return rows.map(rowToComment);
}

/** Returns true if a comment with that id existed and was deleted. */
export async function deleteComment(id: number): Promise<boolean> {
  const rows = await getSql()`
    DELETE FROM comments WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
