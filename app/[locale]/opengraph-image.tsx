import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0E1116",
          color: "#ECE8E1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F2A93B" }} />
          <div style={{ fontSize: 32, letterSpacing: 2, color: "#ECE8E1AA" }}>mz.status</div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, marginTop: 40 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#4FD1C5", marginTop: 16 }}>
          {siteConfig.role}
        </div>
      </div>
    ),
    { ...size },
  );
}
