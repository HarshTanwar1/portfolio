/**
 * Chrome copy for the site (kickers, CTA labels, section titles).
 *
 * The identity data — name, role, email, socials, bio, availability — always
 * comes from the shared content modules (`site`, `about`, …) and is never
 * duplicated in this file. The page may *present* that data with its own voice
 * (e.g. the hero lowercases the role line and uppercases the display name),
 * but the source of truth stays in `content/*`.
 */
export const v3Copy = {
  /** Sunroom (sunny garden). */
  sunroom: {
    /** Word the preloader spells out while the counter runs. */
    preloaderWord: "hello!",
    /** Warm eyebrow above the display name in the hero. */
    heroKicker: "hi, i'm",
    /** Hero CTA labels (the "↓" is added by the component). */
    heroCtas: { work: "view work", hello: "say hello" },
    /** About section heading. */
    aboutTitle: "a little about me",
    /** Small eyebrow above the About heading. */
    aboutKicker: "the human behind the commits",
    /** Small eyebrow above the Projects heading. */
    projectsKicker: "selected work",
    /** Projects showcase heading. */
    projectsTitle: "things i've shipped",
    /** Project card link labels (hrefs come from `projects[].links`). */
    projectLinks: { repo: "view code", demo: "live demo" },
    /** Small eyebrow above the Journey heading. */
    journeyKicker: "experience & education",
    /** Journey timeline heading. */
    journeyTitle: "the road so far",
    /** Journey column headers (displayed uppercase). */
    journeyColumns: { experience: "experience", education: "education" },
    /** Small eyebrow above the Skills heading. */
    skillsKicker: "the toolbox",
    /** Skills section heading. */
    skillsTitle: "things i build with",
    /** Small eyebrow above the Achievements heading. */
    achievementsKicker: "bragging rights",
    /** Header over the achievement plaques. */
    achievementsTitle: "harvested from the fields above",
    /** Small eyebrow above the Contact heading. */
    contactKicker: "the garden gate is open",
    /** Contact heading. */
    contactTitle: "say hello.",
    /** Contact pill labels (hrefs come from `site`). */
    contactLinks: { github: "github", linkedin: "linkedin", resume: "resume" },
    /** Nav pill labels (hashes live in the Nav component). */
    navLabels: { about: "about", work: "work", story: "story", contact: "contact" },
  },
} as const;
