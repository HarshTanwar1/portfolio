import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { stickers } from "@/components/v3/directions/sunroom/stickers";
import { SUNROOM } from "@/components/v3/directions/sunroom/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.shortName} — ${site.role}`;

// Satori (next/og) can't read CSS custom properties — but it CAN import the
// TypeScript tokens, so nothing is duplicated here: field/text colors come
// from SUNROOM and the sun/flower render from the shared sticker set.
const LEAF = SUNROOM.fields.hero; // field
const INK = SUNROOM.ink; // name + role
const BRICK = SUNROOM.accent; // url line — the functional text accent

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: LEAF,
          color: INK,
        }}
      >
        {/* Corner stickers frame the type without crowding it. */}
        <div style={{ position: "absolute", top: 70, right: 90, display: "flex" }}>
          <stickers.sun size={220} />
        </div>
        <div style={{ position: "absolute", bottom: 70, right: 150, display: "flex" }}>
          <stickers.flower size={100} />
        </div>

        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, opacity: 0.85 }}>
          hi, i&apos;m
        </div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1, marginTop: 8 }}>
          {site.shortName}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginTop: 24 }}>
          {site.role}
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, marginTop: 40, color: BRICK }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
