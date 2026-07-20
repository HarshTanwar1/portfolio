import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.shortName} — ${site.role}`;

// Sunroom brand palette. Satori (next/og) can't read CSS custom properties, so
// these are hardcoded — keep them in sync with
// components/v3/directions/sunroom/tokens.ts.
const LEAF = "#9CC96B"; // field
const INK = "#17421F"; // name + role
const CORAL = "#F2622E"; // flower petals / sun rays
const BUTTER = "#FFD23F"; // sun disc / flower center

// Flat, Satori-safe stickers (plain SVG circles/lines) — the sunny-garden folk
// art from the live hero, reduced to shapes the OG renderer can draw.
function Sun() {
  return (
    <svg width="220" height="220" viewBox="-50 -50 100 100">
      <g stroke={CORAL} strokeWidth="6" strokeLinecap="round">
        <line x1="0" y1="-42" x2="0" y2="-30" />
        <line x1="29.7" y1="-29.7" x2="21.2" y2="-21.2" />
        <line x1="42" y1="0" x2="30" y2="0" />
        <line x1="29.7" y1="29.7" x2="21.2" y2="21.2" />
        <line x1="0" y1="42" x2="0" y2="30" />
        <line x1="-29.7" y1="29.7" x2="-21.2" y2="21.2" />
        <line x1="-42" y1="0" x2="-30" y2="0" />
        <line x1="-29.7" y1="-29.7" x2="-21.2" y2="-21.2" />
      </g>
      <circle cx="0" cy="0" r="22" fill={BUTTER} />
    </svg>
  );
}

function Flower() {
  return (
    <svg width="150" height="150" viewBox="-50 -50 100 100">
      <circle cx="0" cy="-24" r="16" fill={CORAL} />
      <circle cx="22.8" cy="-7.4" r="16" fill={CORAL} />
      <circle cx="14.1" cy="19.4" r="16" fill={CORAL} />
      <circle cx="-14.1" cy="19.4" r="16" fill={CORAL} />
      <circle cx="-22.8" cy="-7.4" r="16" fill={CORAL} />
      <circle cx="0" cy="0" r="13" fill={BUTTER} />
    </svg>
  );
}

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
          <Sun />
        </div>
        <div style={{ position: "absolute", bottom: 70, right: 150, display: "flex" }}>
          <Flower />
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
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, marginTop: 40, color: CORAL }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
