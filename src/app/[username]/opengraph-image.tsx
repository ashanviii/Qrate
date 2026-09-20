import { ImageResponse } from "next/og";
import { getPublicPortfolio } from "@/lib/persistence-server";

export const alt = "Bento profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const portfolio = await getPublicPortfolio(username);

  const name = portfolio?.displayName ?? username;
  const tagline = portfolio?.bio || "A Bento page";
  const accent = portfolio?.theme.accent ?? "#6366f1";
  const bg = portfolio?.theme.background.solid ?? "#0a0a0a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: bg,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 9999,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, display: "flex" }}>{name}</div>
          <div style={{ fontSize: 30, opacity: 0.75, display: "flex", maxWidth: 900 }}>{tagline}</div>
          <div style={{ fontSize: 24, opacity: 0.5, display: "flex" }}>bento.app/{username}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
