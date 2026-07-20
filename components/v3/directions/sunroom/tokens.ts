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
  accent: "#F2622E",
  paper: "#FFFDF6",
  radius: "1.5rem",
} as const;
