import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/routing";
import { getProject } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const project = getProject(slug, locale as Locale);
  const title = project?.title ?? siteConfig.name;
  const tags = project?.tags ?? [];

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
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#ECE8E1AA" }}>mz.status / project</div>
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
