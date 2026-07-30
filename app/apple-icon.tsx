import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E1116",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "#F2A93B",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
