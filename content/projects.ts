import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "django-crud-generator",
    name: "Django CRUD Generator",
    tagline: "Design tables with clicks, not code — working CRUD screens included",
    problem:
      "Every Django project rebuilds the same admin plumbing — authentication, roles, and CRUD screens — by hand.",
    solution:
      "A full-featured Django + AdminLTE 3 admin panel with custom authentication and role-based access control, where users create tables and define their fields straight from the UI — ready-to-use CRUD screens included, no code written.",
    highlights: [
      "Tables and fields created from the UI, CRUD screens generated dynamically",
      "Role-based access control on top of custom authentication",
      "AdminLTE 3 interface for a polished back-office out of the box",
    ],
    stack: ["Django", "Python", "AdminLTE 3", "SQLite", "JavaScript"],
    accent: ["#a855f7", "#6366f1"],
    links: { repo: "https://github.com/HarshTanwar1/django-crud-generator" },
  },
  {
    slug: "grapher-mart",
    name: "Grapher Mart",
    tagline: "Where photographers and clients find each other — chat built in",
    problem:
      "Photographers and customers lack a direct marketplace to discover each other, review work, and coordinate a shoot.",
    solution:
      "A React + Firebase marketplace connecting photographers with customers, featuring real-time chat and portfolio management.",
    highlights: [
      "Real-time chat between photographers and customers",
      "Portfolio management for showcasing photographers' work",
      "Firebase-backed auth and realtime data sync",
    ],
    stack: ["React", "Firebase", "Firestore", "JavaScript"],
    accent: ["#ec4899", "#f59e0b"],
    links: { repo: "https://github.com/HarshTanwar1/grapher-mart" },
  },
  {
    slug: "question-overflow",
    name: "Question Overflow",
    tagline: "Search Stack Overflow without hammering the API — cached and rate-limited",
    problem:
      "Hitting a third-party API on every request is slow, brittle, and gets you throttled.",
    solution:
      "A Django search app over the Stack Exchange API with response caching and per-IP rate limiting, so repeat queries are fast and abusive clients are contained.",
    highlights: [
      "Response caching eliminates duplicate upstream API calls",
      "Per-IP rate limiting protects the API quota",
      "Defensive error handling around the upstream API",
    ],
    stack: ["Django", "Python", "Stack Exchange API", "SQLite"],
    accent: ["#f59e0b", "#ef4444"],
    links: { repo: "https://github.com/HarshTanwar1/question-overflow" },
  },
  {
    slug: "realtime-ml",
    name: "Realtime ML",
    tagline: "From notebook to browser, serving live predictions",
    problem:
      "ML models often die in notebooks — they never get served to real users with real latency constraints.",
    solution:
      "A Django app that loads two serialized scikit-learn ensembles (heart-disease classifier and fuel-economy regressor) behind a shared preprocessing pipeline, serving real-time predictions through a web UI.",
    highlights: [
      "Serialized model loading with a reusable preprocessing pipeline",
      "Two live models — classification and regression — on one serving architecture",
      "Clean separation between ML artifacts and the web layer",
    ],
    stack: ["Django", "scikit-learn", "pandas", "NumPy", "Python"],
    accent: ["#6366f1", "#22d3ee"],
    links: { repo: "https://github.com/HarshTanwar1/realtime-ml" },
  },
  {
    slug: "quizze",
    name: "Quizze",
    tagline: "Timed quizzes that grade themselves, results on the spot",
    problem:
      "Conducting timed assessments online needs reliable timing, grading, and instant result delivery without manual work.",
    solution:
      "A Django + MySQL web app for timed online quizzes with automatic grading and instant results.",
    highlights: [
      "Timed quiz sessions enforced server-side",
      "Automatic grading with instant results",
      "Relational MySQL schema for quizzes, questions, and attempts",
    ],
    stack: ["Django", "Python", "MySQL", "Bootstrap", "JavaScript"],
    accent: ["#10b981", "#22d3ee"],
    links: { repo: "https://github.com/HarshTanwar1/quizze" },
  },
];
