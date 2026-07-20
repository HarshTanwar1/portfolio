export interface SiteMeta {
  name: string;
  shortName: string;
  role: string;
  description: string;
  url: string;
  email: string;
  github: string;
  linkedin: string;
  resumePath: string | null;
}

export interface About {
  availability: string;
  paragraphs: string[];
  cta: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  highlights: string[];
  stack: string[];
  /** Two hex colors for the card header gradient (v1 stand-in for per-project imagery). */
  accent: [string, string];
  links: { repo: string; demo?: string };
}

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string; // "Present" for the current role
  location?: string;
  bullets: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  start: string;
  end: string;
  details?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Achievement {
  title: string;
  year?: string;
  description?: string;
}
