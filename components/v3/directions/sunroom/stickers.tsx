/**
 * Sunroom sticker set — flat, 2-color folk SVGs authored in-repo (no license
 * risk), in the style of the user-approved companion mockup. Each is a pure,
 * stateless component: decorative only, always `aria-hidden`, and sized via the
 * optional `size` prop (defaults to filling its container, which is how
 * `StickerField` drives them). Palette comes straight from the Sunroom tokens
 * (single source of truth) so a sticker reads the same wherever it is dropped.
 */

import { svgProps } from "@/components/v3/motion/svgProps";
import { SUNROOM } from "./tokens";

type StickerProps = Readonly<{
  /** Width in px; height follows the artwork's aspect ratio. Omit to fill. */
  size?: number;
  className?: string;
}>;

// Local aliases for the artwork palette — values live in tokens.ts only.
const ORANGE = SUNROOM.coral;
// Artwork gold is its OWN token (`SUNROOM.gold`), deliberately decoupled from
// `fields.achievements` (2026-08-08): the field retunes freely while the sun
// disc, flower centers and OG art keep the original vivid gold.
const YELLOW = SUNROOM.gold;
const GREEN = SUNROOM.ink;
const LEAF = SUNROOM.fields.hero;
const PAPER = SUNROOM.paper;

/** Flower — five coral petals around a butter center (shared with the OG card). */
function Flower({ size, className }: StickerProps) {
  // Five-petal daisy with a butter center — ported from the OG card's flower
  // (user preferred it over the original four-petal/paper-center version),
  // scaled so the artwork fills the 64-box like every other sticker.
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g fill={ORANGE}>
        <circle cx="32" cy="12.8" r="12.8" />
        <circle cx="50.24" cy="26.08" r="12.8" />
        <circle cx="43.28" cy="47.52" r="12.8" />
        <circle cx="20.72" cy="47.52" r="12.8" />
        <circle cx="13.76" cy="26.08" r="12.8" />
      </g>
      <circle cx="32" cy="32" r="10.4" fill={YELLOW} />
    </svg>
  );
}

/** Sun — solid disc ringed by triangular rays. */
function Sun({ size, className }: StickerProps) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g fill={YELLOW}>
        {rays.map((a) => (
          <path
            key={a}
            d="M32 1 L27 15 L37 15 Z"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="16" />
      </g>
    </svg>
  );
}

/** Leaf — deep-green blade with a curved center vein. */
function Leaf({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 46 60")} className={className}>
      <path
        d="M23 58C10 44 4 30 12 16 18 6 30 2 40 8c6 16-2 36-17 50z"
        fill={GREEN}
      />
      <path
        d="M23 54C29 40 33 26 38 12"
        stroke={LEAF}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sparkle — a four-point twinkle. */
function Sparkle({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 48 48")} className={className}>
      <path
        d="M24 2 C27 17 31 21 46 24 C31 27 27 31 24 46 C21 31 17 27 2 24 C17 21 21 17 24 2 Z"
        fill={PAPER}
      />
    </svg>
  );
}

/** Watering can — the paddy cascade's opening actor. Raised spout with a
 *  side-profile sprinkler head; pours only when tilted. */
function WateringCan({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 58 42")} className={className}>
      <path d="M30 26 L8.2 13.3 L9.8 16.7 L30 31 Z" fill={GREEN} />
      <path d="M9.7 17.4 L5.4 16.0 L8.2 11.4 L11.4 14.5 Z" fill={ORANGE} />
      <g fill={GREEN}>
        <rect x="22" y="12" width="26" height="22" rx="6" />
        <path d="M46 15 C59 15 59 31 46 31 L46 27.5 C55 27.5 55 18.5 46 18.5 Z" />
        <ellipse cx="35" cy="12" rx="9" ry="3.5" />
      </g>
      <path d="M26 17 C25 22 25 27 27 31" fill="none" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Harvest sheaf — ink stem, paper grains. Badge art AND corner sticker for
 *  the achievements section (deliberately not gold-on-gold: contrast). */
function Sheaf({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 30 36")} className={className}>
      <g stroke={GREEN} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M15 35 C15 22 13 15 9 7" />
        <path d="M15 26 C18 20 22 16 26 13" />
      </g>
      <g fill={PAPER}>
        <ellipse cx="8" cy="7" rx="2.8" ry="4.2" transform="rotate(-28 8 7)" />
        <ellipse cx="12" cy="11.5" rx="2.6" ry="4" transform="rotate(-18 12 11.5)" />
        <ellipse cx="25.5" cy="13" rx="2.5" ry="3.8" transform="rotate(30 25.5 13)" />
        <ellipse cx="21.5" cy="17" rx="2.5" ry="3.8" transform="rotate(22 21.5 17)" />
      </g>
    </svg>
  );
}

/** Heart — a soft coral heart. */
function Heart({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 56 52")} className={className}>
      <path
        d="M28 48 C6 32 2 20 12 12 C21 5 28 12 28 20 C28 12 35 5 44 12 C54 20 50 32 28 48 Z"
        fill={ORANGE}
      />
    </svg>
  );
}

/** Clover — three soft-heart leaflets, rounded ends outward, meeting at a
 *  single junction that a thin stem grows from. Deep green like the Leaf.
 *  Not yet placed in any field — authored ahead of use. */
function Clover({ size, className }: StickerProps) {
  const leaflet =
    "M32 32 C25.4 27 19.4 21 20 14.5 C20.5 9 24.8 5.8 29 7.3 C30.6 7.9 31.5 9 32 10.5 C32.5 9 33.4 7.9 35 7.3 C39.2 5.8 43.5 9 44 14.5 C44.6 21 38.6 27 32 32 Z";
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path
        d="M32 31.5 C32 40 33.5 49 40.5 58.5"
        stroke={GREEN}
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <g fill={GREEN}>
        {[0, 120, 240].map((a) => (
          <path key={a} d={leaflet} transform={`rotate(${a} 32 32)`} />
        ))}
      </g>
    </svg>
  );
}

/** Mushroom — bulbous spotted toadstool cap over a stout stem with a gently
 *  flared foot. Emoji red like the Ladybug (SUNROOM.art), white spots and
 *  stem — the white means it wants the colored fields, like Sheaf and
 *  Sparkle. Not yet placed — authored ahead of use. */
function Mushroom({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path
        d="M26 33 L38 33 C38 39 39 44 41.5 49 C42.8 51.8 40.5 53.5 37.5 53.5 L26.5 53.5 C23.5 53.5 21.2 51.8 22.5 49 C25 44 26 39 26 33 Z"
        fill={SUNROOM.art.white}
      />
      <path
        d="M9 27 C9 9.5 19.5 3 32 3 C44.5 3 55 9.5 55 27 C55 31.5 50.5 33 45 33 L19 33 C13.5 33 9 31.5 9 27 Z"
        fill={SUNROOM.art.red}
      />
      <g fill={SUNROOM.art.white}>
        <circle cx="23" cy="13" r="4.2" />
        <circle cx="41" cy="10.5" r="3.2" />
        <circle cx="46" cy="21.5" r="3.4" />
        <circle cx="17.5" cy="23" r="2.8" />
        <circle cx="32" cy="26" r="2.4" />
      </g>
    </svg>
  );
}

// Local alias for the emoji artwork palette — the fauna/produce stickers
// below use it instead of the field-token colors (see tokens.ts `art`).
const ART = SUNROOM.art;

/** Ladybug — red shell, charcoal head and dots, split wing line, antennae.
 *  Not yet placed — authored ahead of use. */
function Ladybug({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g stroke={ART.charcoal} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M27 9 C25 6.5 23 5.5 20.5 5" />
        <path d="M37 9 C39 6.5 41 5.5 43.5 5" />
      </g>
      <circle cx="32" cy="15.5" r="8.5" fill={ART.charcoal} />
      <ellipse cx="32" cy="38" rx="20" ry="21" fill={ART.red} />
      <path d="M32 17.5 L32 59" stroke={ART.charcoal} strokeWidth="2.2" />
      <g fill={ART.charcoal}>
        <circle cx="23" cy="30" r="3.4" />
        <circle cx="41" cy="30" r="3.4" />
        <circle cx="18.5" cy="42" r="3" />
        <circle cx="45.5" cy="42" r="3" />
        <circle cx="26" cy="51" r="2.7" />
        <circle cx="38" cy="51" r="2.7" />
      </g>
    </svg>
  );
}

/** Bee — amber body with two charcoal bands, gray-blue wings, stinger,
 *  gentle flying tilt. Not yet placed — authored ahead of use. */
function Bee({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g transform="rotate(-12 32 36)">
        <ellipse cx="29" cy="16" rx="9" ry="13.5" fill={ART.wing} transform="rotate(-16 29 16)" />
        <ellipse cx="42" cy="18.5" rx="7.5" ry="11" fill={ART.wing} transform="rotate(14 42 18.5)" />
        <path d="M49 36 L56.5 39 L49 42 Z" fill={ART.charcoal} />
        <ellipse cx="32" cy="39" rx="17.5" ry="13.5" fill={ART.amber} />
        <g stroke={ART.charcoal} strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M27.5 27.5 C26.3 34.5 26.3 44 27.5 51" />
          <path d="M38.5 27.8 C39.9 34.5 39.9 43.5 38.5 50.5" />
        </g>
        <circle cx="12.5" cy="39" r="7.8" fill={ART.charcoal} />
        <g stroke={ART.charcoal} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M9.5 32.5 C7.5 29 7.5 26 9 23" />
          <path d="M15.5 32 C15 28.5 16 25.5 18 23" />
        </g>
      </g>
    </svg>
  );
}

/** Sunflower — amber petal ring around a terracotta disc, on a long leafy
 *  stem. Not yet placed — authored ahead of use. */
function Sunflower({ size, className }: StickerProps) {
  const petalAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path
        d="M32 40 C31.5 48 32 55 33.5 62"
        stroke={ART.leaf}
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M31.8 55.5 C26.3 55.5 21.8 53 19.8 48.5 C24.8 47.5 29.3 50 31.5 54 Z" fill={ART.leaf} />
      <path d="M33.1 52 C38.3 51.3 42.3 48.3 43.8 43.7 C38.8 43.3 34.6 46.1 32.8 50.3 Z" fill={ART.leaf} />
      <g transform="translate(32 24) scale(0.74) translate(-32 -32)">
        <g fill={ART.amber}>
          {petalAngles.map((a) => (
            <ellipse key={a} cx="32" cy="12.5" rx="5" ry="11.5" transform={`rotate(${a} 32 32)`} />
          ))}
        </g>
        <circle cx="32" cy="32" r="13.5" fill={ART.disc} />
      </g>
    </svg>
  );
}

/** Strawberry — tilted red berry with a scalloped leafy crown seated on the
 *  pulp, side skirts, a stem with one small leaf, pale seeds. Not yet
 *  placed — authored ahead of use. */
function Strawberry({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g transform="rotate(-14 32 36)">
        <path
          d="M32 57.5 C22 51.5 14.5 43 14 33 C13.7 25.5 19.5 20.5 27 19.8 C29 19.6 30.8 20.2 32 21.2 C33.2 20.2 35 19.6 37 19.8 C44.5 20.5 50.3 25.5 50 33 C49.5 43 42 51.5 32 57.5 Z"
          fill={ART.red}
        />
        <path d="M17 21 C14.8 23.8 14 27.2 14.8 30.8 C17.6 28.8 19.2 26 19.6 22.6 Z" fill={ART.leaf} />
        <path d="M47 21 C49.2 23.8 50 27.2 49.2 30.8 C46.4 28.8 44.8 26 44.4 22.6 Z" fill={ART.leaf} />
        <path d="M32 17 L32 7" stroke={ART.stem} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M33 10.5 C35.5 8 38.8 7.3 41.8 8.5 C40.2 11.3 37 12.6 33.5 12 Z" fill={ART.leaf} />
        <path
          d="M32 15.5 C26.5 14.5 21 16 17.5 19.5 C16.5 21.5 16.3 24 17.2 26.5 C18.8 24.6 20.8 23.7 23 24 C22.5 26.8 23.3 29.3 25.2 31 C26.5 28.6 28.3 27.2 30.5 26.9 C30.7 29.5 31.6 31.6 33.4 33 C34.4 30.4 35.9 28.8 38 28.3 C38.6 30.6 39.9 32.3 41.9 33.2 C42.2 30.6 43.3 28.7 45.3 27.5 C46.5 25.4 46.9 23.2 46.5 20.9 C43 16.6 37.6 14.7 32 15.5 Z"
          fill={ART.leaf}
        />
        <g fill={ART.seed}>
          <ellipse cx="22.5" cy="37" rx="1.5" ry="2.4" />
          <ellipse cx="41.5" cy="37" rx="1.5" ry="2.4" />
          <ellipse cx="32" cy="39.5" rx="1.5" ry="2.4" />
          <ellipse cx="19" cy="42.5" rx="1.4" ry="2.2" />
          <ellipse cx="45" cy="42.5" rx="1.4" ry="2.2" />
          <ellipse cx="25.5" cy="47" rx="1.5" ry="2.4" />
          <ellipse cx="38.5" cy="47" rx="1.5" ry="2.4" />
          <ellipse cx="32" cy="52" rx="1.4" ry="2.2" />
        </g>
      </g>
    </svg>
  );
}

/** Tulip — pink three-tip cup on a stem with two leaves. Not yet placed. */
function Tulip({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path
        d="M20 14 C23 18 27 19.5 29 16.5 L32 11.5 L35 16.5 C37 19.5 41 18 44 14 L44 24 C44 32 39 37 32 37 C25 37 20 32 20 24 Z"
        fill={ART.pink}
      />
      <path d="M32 37 L32 57" stroke={ART.stem} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M32 51 C26.5 49.5 22.5 45 22 39 C27.5 40 31 44 32 49 Z" fill={ART.leaf} />
      <path d="M32 46 C37.5 44.5 41.5 40 42 34 C36.5 35 33 39 32 44 Z" fill={ART.leaf} />
    </svg>
  );
}

/** Potted plant — three leaf blades in a terracotta pot. Not yet placed. */
function PottedPlant({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M32 38 C30 29 30.5 20.5 33.5 13.5 C36 20.5 35.5 29.5 32 38 Z" fill={ART.leaf} />
      <path d="M30.5 38.5 C25.5 33.5 23 27 24 20 C28.5 24 30.8 30.8 30.8 38 Z" fill={ART.leaf} />
      <path d="M33.5 38.5 C38.5 33.5 41 27 40 20 C35.5 24 33.2 30.8 33.2 38 Z" fill={ART.leaf} />
      <rect x="19.5" y="37.5" width="25" height="5.5" rx="2.5" fill={ART.disc} />
      <path
        d="M22 44 L42 44 L40.3 56.5 C40.1 58 38.8 59 37.2 59 L26.8 59 C25.2 59 23.9 58 23.7 56.5 Z"
        fill={ART.disc}
      />
    </svg>
  );
}

/** Snail — cream body with eye stalks under a tan spiral shell. Cream body
 *  prefers the colored fields. Not yet placed. */
function Snail({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g stroke={ART.brown} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M13 29 C12 26.5 11 24.5 9.5 23" />
        <path d="M18 29 C18.5 26.5 19.5 24.5 21 23" />
      </g>
      <circle cx="9" cy="22.5" r="1.7" fill={ART.brown} />
      <circle cx="21.5" cy="22.5" r="1.7" fill={ART.brown} />
      <path
        d="M15 30 C11.5 30 9 33 9 37 L9 50 C9 53 11 55 14 55 L50 55 C53 55 55 53.3 55 51 C55 47 51 43.5 46 43.5 L27 43.5 C25 43.5 23.5 42 23 39.5 L21.5 34 C20.8 31.5 18.5 30 15 30 Z"
        fill={ART.cream}
      />
      <circle cx="38" cy="33" r="13.5" fill={ART.tan} />
      <path
        d="M47.5 33 C47.5 27 43 22.8 37.5 23.3 C32.5 23.8 29.5 28 30.5 32.5 C31.4 36.3 35.3 38.3 38.8 36.8 C41.5 35.6 42.6 32.4 41.3 29.9"
        stroke={ART.brown}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Lightning bolt — bright gold zigzag (the artwork gold). Not yet placed. */
function Bolt({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M42 2 L11 38 L26 38 L20 62 L53 24 L36 24 Z" fill={SUNROOM.gold} />
    </svg>
  );
}

/** Acorn — brown cap with a stem nub over a squat tan nut. Not yet placed. */
function Acorn({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M32 15.5 L32 10" stroke={ART.brown} strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M22.5 30 C22.5 37.5 26.5 43 32 44.5 C37.5 43 41.5 37.5 41.5 30 C38 31.7 35 32.3 32 32.3 C29 32.3 26 31.7 22.5 30 Z"
        fill={ART.tan}
      />
      <path
        d="M20 28.5 C20 20.5 25 16 32 16 C39 16 44 20.5 44 28.5 C40 30.6 36 31.5 32 31.5 C28 31.5 24 30.6 20 28.5 Z"
        fill={ART.brown}
      />
    </svg>
  );
}

/** Butterfly — two-tone blue wing pairs meeting at a slim charcoal body,
 *  antennae rooted to it. Not yet placed. */
function Butterfly({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <g transform="translate(0 4)">
        <path
          d="M31.5 28 C25 16.5 15.5 10.5 10 13 C6 15 6.5 22 11 27.5 C15.5 33 23 35.5 31 34.5 Z"
          fill={ART.blue}
        />
        <path
          d="M32.5 28 C39 16.5 48.5 10.5 54 13 C58 15 57.5 22 53 27.5 C48.5 33 41 35.5 33 34.5 Z"
          fill={ART.blue}
        />
        <circle cx="13.5" cy="19.5" r="2.6" fill={ART.deepBlue} />
        <circle cx="50.5" cy="19.5" r="2.6" fill={ART.deepBlue} />
      </g>
      <path
        d="M31.5 36 C25 36 19 39.5 16.5 44.5 C14.5 48.5 17 52.5 21.5 52.5 C26.5 52.5 30.5 48.5 31.5 42 Z"
        fill={ART.deepBlue}
      />
      <path
        d="M32.5 36 C39 36 45 39.5 47.5 44.5 C49.5 48.5 47 52.5 42.5 52.5 C37.5 52.5 33.5 48.5 32.5 42 Z"
        fill={ART.deepBlue}
      />
      <ellipse cx="32" cy="36.5" rx="2.6" ry="11.5" fill={ART.charcoal} />
      <g stroke={ART.charcoal} strokeWidth="1.9" fill="none" strokeLinecap="round">
        <path d="M31.2 26 C28.5 21.5 26.5 19 23.5 17.5" />
        <path d="M32.8 26 C35.5 21.5 37.5 19 40.5 17.5" />
      </g>
    </svg>
  );
}

/** Seedling sprout — mirrored leaf pair capping a stem that rises from a
 *  small earth mound. Not yet placed. */
function Sprout({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M12 56 L27 41 C29.5 38 34.5 38 37 41 L52 56 Z" fill={ART.brown} />
      <path d="M32 40 L32 22" stroke={ART.stem} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 22 C26 20.5 21.5 16 21 9.5 C27.5 10.5 31.7 15.5 32 21.5 Z" fill={ART.leaf} />
      <path d="M32 22 C38 20.5 42.5 16 43 9.5 C36.5 10.5 32.3 15.5 32 21.5 Z" fill={ART.leaf} />
    </svg>
  );
}

/** Berry sprig — cherry construction: brown stem and paired leaves at a
 *  junction, two stalks down to red berries. Not yet placed. */
function BerrySprig({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M36 12 L43.5 2" stroke={ART.brown} strokeWidth="4" fill="none" strokeLinecap="round" />
      <g stroke={ART.stem} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M36 12 C30 20 26 30 25.5 39.5" />
        <path d="M36 12 C40 20 43.5 28 44 36.5" />
      </g>
      <path d="M36 12 C40 7.5 46 6 51 8.5 C48 13.5 42.5 15.5 37 13.5 Z" fill={ART.leaf} />
      <path d="M36 12 C32 7.5 26 6 21 8.5 C24 13.5 29.5 15.5 35 13.5 Z" fill={ART.leaf} />
      <circle cx="25.5" cy="45" r="6.5" fill={ART.red} />
      <circle cx="44" cy="42" r="6.5" fill={ART.red} />
    </svg>
  );
}

/** Swallow — perched blue folk bird: amber beak, upturned tail, one sharp
 *  down-swept wing, standing on its own legs. Not yet placed. */
function Swallow({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 64 64")} className={className}>
      <path d="M18.5 18 L11 20.5 L18.5 23 Z" fill={ART.amber} />
      <path d="M42 28 L57 19.5 L56.5 26 L43.5 33 Z" fill={ART.deepBlue} />
      <circle cx="26" cy="20" r="9" fill={ART.blue} />
      <ellipse cx="33" cy="33" rx="13" ry="11" fill={ART.blue} />
      <path
        d="M26.5 30.5 C30.5 36.5 38 41.5 47 43.5 C46 36.5 41 30.5 33.5 28 C30 26.9 27.3 28 26.5 30.5 Z"
        fill={ART.deepBlue}
      />
      <circle cx="23" cy="17.5" r="1.7" fill={ART.charcoal} />
      <g stroke={ART.brown} strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 43.5 L28 51.5 L24.5 51.5" />
        <path d="M35 43.5 L35 51.5 L31.5 51.5" />
      </g>
    </svg>
  );
}

export const stickers = { flower: Flower, sun: Sun, leaf: Leaf, sparkle: Sparkle, heart: Heart, wateringCan: WateringCan, sheaf: Sheaf, clover: Clover, mushroom: Mushroom, ladybug: Ladybug, bee: Bee, sunflower: Sunflower, strawberry: Strawberry, tulip: Tulip, pottedPlant: PottedPlant, snail: Snail, bolt: Bolt, acorn: Acorn, butterfly: Butterfly, sprout: Sprout, berrySprig: BerrySprig, swallow: Swallow };
