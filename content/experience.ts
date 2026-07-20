import type { ExperienceEntry, EducationEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "AssessPrep",
    role: "Frontend Web Developer",
    start: "Apr 2025",
    end: "Present",
    location: "India",
    bullets: [
      "Built an AI-powered assessment creation tool that generates diverse question types from attached PDFs, images, and other media.",
      "Implemented AI-powered mark-scheme generation and per-question AI grading with configurable strict/lenient styles.",
      "Built automated grading workflows handling zero-attempt submissions, grading states, and cancellations, with a unified grading-progress sync across all application views.",
      "Optimized critical workflows by eliminating redundant backend requests, cutting latency across the app.",
    ],
  },
  {
    company: "CDAC",
    role: "Frontend Web Developer",
    start: "Apr 2024",
    end: "Apr 2025",
    location: "India",
    bullets: [
      "Designed Figma wireframes defining UI structure, workflows, and layouts.",
      "Turned wireframes into working frontends, wiring application logic to backend APIs.",
      "Refactored frontend code for maintainability and performance.",
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
