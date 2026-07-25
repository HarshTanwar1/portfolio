/**
 * Sunroom design tokens — the sunny-garden palette.
 *
 * `fields` are the per-section background colors driven by `FieldSweep`. Hero,
 * About and Contact share the leaf green so the journey opens and closes on the
 * same note; the first color sweep happens entering Projects (cream). Skills
 * (young rice) and Achievements (gold harvest) sweep in sequence right before
 * the return to leaf green at Contact.
 */
export const SUNROOM = {
  fields: {
    hero: "#9CC96B",
    about: "#9CC96B",
    projects: "#F6F1E3",
    experience: "#DFF0C8",
    skills: "#C6D468",
    achievements: "#FFD23F",
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
