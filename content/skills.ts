import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    category: "Backend",
    items: ["Python", "Java", "Django", "REST APIs", "MySQL", "MongoDB", "SQL"],
  },
  {
    category: "Frontend",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Ant Design",
      "React Bootstrap",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS",
    ],
  },
  {
    category: "AI & Data Science",
    items: [
      "scikit-learn",
      "pandas",
      "NumPy",
      "Jupyter",
      "Matplotlib & Seaborn",
      "OpenCV",
      "Ensemble learning",
      "LLM APIs",
      "Model serving",
    ],
  },
  {
    category: "Tools & Practices",
    items: [
      "Git & GitHub",
      "Playwright",
      "Figma",
      "UiPath Studio",
      "Web scraping",
      "Linux",
      "Vercel",
    ],
  },
];
