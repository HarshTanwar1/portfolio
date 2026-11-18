import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { Stickers } from "@/components/v3/directions/sunroom/stickers";
import { SUNROOM } from "@/components/v3/directions/sunroom/tokens";

// Required marker for `output: "export"` builds (the public repo).
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.shortName} — ${site.role}`;

// Satori (next/og) can't read CSS custom properties — but it CAN import the
// TypeScript tokens, so nothing is duplicated here: field/text colors come
// from SUNROOM and the sun/flower render from the shared sticker set.
const LEAF = SUNROOM.fields.hero; // field
const INK = SUNROOM.ink; // name + role
const BRICK = SUNROOM.accent; // url line — the functional text accent

// Type sizes, top to bottom. The role line is sized so that it ends left of
// the sticker column (the sun and flower occupy roughly x ≥ 896 of the 1200px
// card): a longer role needs a smaller size — re-measure the generated PNG if
// `site.role` changes.
const KICKER_SIZE = 30;
const NAME_SIZE = 100;
const ROLE_SIZE = 33;
const URL_SIZE = 28;

// Optical alignment: at display size the name's first letter carries more
// built-in left spacing than the smaller lines, so its ink would start a few
// pixels to their right. The nudge pulls it back onto the same left edge —
// re-measure it in the generated PNG if NAME_SIZE or the name ever changes.
const NAME_NUDGE = -6;

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
          <Stickers.Sun size={220} />
        </div>
        <div style={{ position: "absolute", bottom: 70, right: 150, display: "flex" }}>
          <Stickers.Flower size={100} />
        </div>

        <div style={{ display: "flex", fontSize: KICKER_SIZE, fontWeight: 700, opacity: 0.85 }}>
          hi, i&apos;m
        </div>
        <div
          style={{
            display: "flex",
            fontSize: NAME_SIZE,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 8,
            marginLeft: NAME_NUDGE,
          }}
        >
          {site.shortName}
        </div>
        <div style={{ display: "flex", fontSize: ROLE_SIZE, fontWeight: 700, marginTop: 24 }}>
          {site.role}
        </div>
        <div style={{ display: "flex", fontSize: URL_SIZE, fontWeight: 700, marginTop: 40, color: BRICK }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
