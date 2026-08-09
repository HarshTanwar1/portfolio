/**
 * Sunroom design tokens — the sunny-garden palette.
 *
 * `fields` are the per-section background colors driven by `FieldSweep`. Hero,
 * About and Contact share the leaf green so the journey opens and closes on the
 * same note; the first color sweep happens entering Projects (cream). Skills
 * (young rice) and Achievements (honey harvest) sweep in sequence right before
 * the return to leaf green at Contact.
 */
export const SUNROOM = {
  fields: {
    hero: "#9CC96B",
    about: "#9CC96B",
    projects: "#F6F1E3",
    experience: "#DFF0C8",
    skills: "#C6D468",
    achievements: "#F7DE6E",
    contact: "#9CC96B",
  },
  ink: "#17421F",
  /**
   * The ARTWORK color — sticker fills, OG-card art, the favicon dot, the
   * ::selection tint. Deliberately NOT the functional text accent (see
   * `accent` below): artwork is decorative, so it keeps the original bright
   * coral that text can no longer use under WCAG AA.
   */
  coral: "#F2622E",
  /**
   * The ARTWORK gold — sun disc and rays, flower centers, shared with the OG
   * card via the sticker set. Split from `fields.achievements` so the field
   * can be retuned without recoloring the artwork; keep this at the original
   * vivid gold unless the sticker set itself is being redesigned.
   */
  gold: "#FFD23F",
  /**
   * Emoji-flavored artwork palette — the fauna/produce stickers (ladybug,
   * bee, sunflower, strawberry) are deliberately painted in emoji-faithful
   * colors rather than field tokens, so they read as decals stuck ON the
   * site instead of shapes grown from it. Decorative only — never text.
   */
  art: {
    red: "#DD2E44",
    amber: "#FFCC4D",
    charcoal: "#31373D",
    wing: "#CCD6DD",
    leaf: "#77B255",
    stem: "#5C913B",
    disc: "#A8432E",
    seed: "#FFE8B6",
    white: "#FFFFFF",
    blue: "#5DADEC",
    deepBlue: "#3B88C3",
    pink: "#EA596E",
    tan: "#D99E5B",
    cream: "#EFD3A0",
    brown: "#915A34",
  },
  /**
   * Functional accent (kickers, availability pill, vine labels, progress
   * dots): brick — chosen from an AA-compliant candidate board. Passes WCAG
   * AA (4.5:1) as TEXT on every field above; worst case is 4.52:1 on the
   * leaf field, so there is almost NO headroom — do not lighten this value
   * without re-running the contrast math. The original bright coral #F2622E
   * lives on in the sticker artwork, which has its own fills and is purely
   * decorative.
   */
  accent: "#951919",
  paper: "#FFFDF6",
  radius: "1.5rem",
} as const;
