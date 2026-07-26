import type { Locale } from "@/i18n/routing";

/**
 * Pure URL builder with zero server-only dependencies (no `fs`), so it's
 * safe to import from Client Components — importing it from lib/posts.ts
 * instead would pull that module's `fs`/`path` usage into the browser bundle.
 */
export function postUrl(slug: string, locale: Locale): string {
  return `/${locale}/posts/${slug}`;
}
