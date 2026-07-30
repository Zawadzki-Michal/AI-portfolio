import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

// getPostBySlug reads posts/** off disk (fs) — needs the Node runtime, not edge.
export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  let title = siteConfig.name;
  let tags: string[] = [];
  try {
    const post = await getPostBySlug(slug, locale as Locale);
    title = post.title;
    tags = post.tags;
  } catch {
    // Fall through to the site-name default below — a missing post 404s
    // on the actual page anyway, this image just shouldn't crash.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0E1116",
          color: "#ECE8E1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F2A93B" }} />
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#ECE8E1AA" }}>mz.status / log</div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#4FD1C5" }}>
          {tags.map((tag) => (
            <div key={tag} style={{ display: "flex" }}>
              #{tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
