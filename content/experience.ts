import type { ExperienceEntry, EducationEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "AssessPrep",
    role: "Software Development Engineer",
    start: "Apr 2025",
    end: "Present",
    location: "India",
    bullets: [
      "Built LLM-powered assessment generation in Python and Django covering 9 question types and 7 file formats, turning uploaded files into ready-to-use questions.",
      "Shipped Generative AI mark-scheme and teacher-explanation generation for 9 question types, plus LLM-powered automated grading for 11 question types with feedback in strict, neutral, and lenient modes.",
      "Developed secure Java Spring Boot microservices and REST APIs, cut a complex PostgreSQL query's execution time by 25% through query optimization, and containerized the services with Docker.",
      "Implemented CI/CD pipelines on GitHub Actions that automatically trigger a co-architected suite of 120+ Playwright feature tests across web, macOS, and iPad after every production deployment.",
      "Built a feature-flag management system in React and TypeScript managing 210 features across 253 schools — 3-state controls and 2 subscription tiers for controlled rollouts.",
      "Synchronized grading updates across 10 React UI displays and 4 shared Zustand stores, eliminating post-save refetches.",
      "Cut the React frontend bundle by 75% (6.1 MB to 1.5 MB) through code splitting, lazy loading, and bundle optimization, and trimmed redundant backend API requests by ~30% across pages.",
      "Resolved 150+ production issues across global regions, including China, in grading, student accommodations, caching, and API workflows, working in Agile/Scrum sprints with peer code reviews of pull requests.",
    ],
  },
  {
    company: "CDAC",
    role: "Frontend Web Developer",
    start: "Apr 2024",
    end: "Mar 2025",
    location: "India",
    bullets: [
      "Translated requirements into Figma wireframes and built responsive React interfaces with Tailwind CSS and React Bootstrap.",
      "Implemented frontend business logic in JavaScript and TypeScript and integrated backend APIs for end-to-end workflows.",
      "Built a reusable, configurable CRUD interface for an AIIMS application, with dynamic fields across multiple data types.",
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
    start: "Sep 2019",
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
