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
// ⚠️ Deliberate coupling: the artwork gold IS the achievements field — the
// site has ONE canonical gold. Retuning `fields.achievements` recolors the
// sun disc and flower centers with it (correct brand behavior, but real: if
// that ever becomes unwanted, split a dedicated artwork-gold token instead).
const YELLOW = SUNROOM.fields.achievements;
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

/** Sprig — a curving stem with a rooted side blade and a full terminal blade
 *  capping the stem's end. The corners' botanical art; the journey vine discs
 *  keep the plain Leaf. */
function Sprig({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 46 72")} className={className}>
      <path
        d="M18 70 C17 56 20 42 26 32 C29 26 31 24 33 21"
        stroke={GREEN}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M21 38 C12 38 4 32 2 22 C11 20 19 27 23 35 Z" fill={GREEN} />
      <path d="M31 24 C28 15 33 6 43 2 C46 11 41 20 33 25 Z" fill={GREEN} />
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

/** Grass tuft — five ink blades fanning from the base. */
function Grass({ size, className }: StickerProps) {
  return (
    <svg {...svgProps(size, "0 0 40 28")} className={className}>
      <g stroke={GREEN} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M20 28 C19 14 20 8 20 2" />
        <path d="M20 28 C20 18 17 10 13 5" />
        <path d="M20 28 C20 16 23 10 27 5" />
        <path d="M13 28 C13 20 10 14 6 11" />
        <path d="M27 28 C27 20 30 14 34 11" />
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

export const stickers = { flower: Flower, sun: Sun, leaf: Leaf, sparkle: Sparkle, heart: Heart, wateringCan: WateringCan, sheaf: Sheaf, grass: Grass, sprig: Sprig };
