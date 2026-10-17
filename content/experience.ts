import type { ExperienceEntry, EducationEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "AssessPrep",
    role: "Software Development Engineer",
    start: "Apr 2025",
    end: "Present",
    location: "India",
    bullets: [
      "Built an AI-powered assessment generation tool covering 9 question types and 7 file formats, turning uploaded files into ready-to-use questions.",
      "Shipped AI mark-scheme and teacher-explanation generation for 9 question types, plus AI grading for 11 question types with automated feedback and strict, neutral, and lenient modes.",
      "Built a superadmin feature-flag system managing 210 features across 253 schools — 3-state status controls and 2 plan tiers for controlled rollouts.",
      "Synchronized grading updates across 10 UI displays and 4 shared data stores, eliminating post-save refetches.",
      "Cut the frontend build by 73% (11 MB to 3 MB) through code splitting, lazy loading, and bundle optimization, and trimmed redundant backend API requests by ~30% across pages.",
      "Co-architected 120+ automated feature tests across web, macOS, and iPad on GitHub Actions to catch post-deploy regressions, and resolved 150+ production issues across global regions including China.",
    ],
  },
  {
    company: "CDAC",
    role: "Frontend Web Developer",
    start: "Apr 2024",
    end: "Mar 2025",
    location: "India",
    bullets: [
      "Translated requirements into Figma wireframes and built responsive frontends to the design specs.",
      "Implemented frontend business logic and integrated backend APIs for reliable end-to-end workflows.",
      "Built a reusable, configurable CRUD interface with dynamic fields for flexible data management.",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    institution: "CDAC ACTS",
    degree: "PG Diploma in Big Data Analytics",
    start: "Sep 2023",
    end: "Feb 2024",
    details: "82.25%",
  },
  {
    institution: "JK Lakshmipat University",
    degree: "B.Tech in Computer Science and Engineering",
    start: "May 2019",
    end: "Nov 2023",
    details: "85.69%",
  },
  {
    institution: "St. Anselm’s Sr. Sec. School",
    degree: "XII",
    start: "Apr 2017",
    end: "May 2018",
    details: "82.40%",
  },
  {
    institution: "St. Anselm’s Sr. Sec. School",
    degree: "X",
    start: "Apr 2015",
    end: "May 2016",
    details: "85.50%",
  },
];
