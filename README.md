# Harsh Tanwar — Portfolio

A sunny, scroll-choreographed one-page portfolio, live at **[harshtanwar1.vercel.app](https://harshtanwar1.vercel.app)**.

Bold type, hand-drawn stickers, and a GSAP-driven motion system carry the whole story on a single page — from a preloader curtain and split-text hero reveal, through a pinned project deck, to a rice-paddy skills field that gets watered chip by chip.

## Signature moments

- **Field sweeps** — the page background is one continuous canvas that re-tints as you scroll between sections, ending on a golden "harvest" field.
- **Projects deck** — a pinned, scrub-driven card deck with docking indicators; cards deal out as you scroll and rewind on the way back.
- **Journey vines** — experience and education timelines traced by SVG vines generated from the measured positions of their leaf nodes, drawn in by scroll.
- **Rice-paddy skills** — a watering can slides in, tilts, and pours a parabolic shower into the first bed; terraced beds flood one another through spillways while skill chips sprout with the rising water. Hovering any chip pools ripple rings around it.
- **Grain downpour** — the achievements section opens with a once-per-visit rain of grain that the award plaques pop up through, badges pulsing as they land.
- **Sticker field** — a paper-cutout sticker system (suns, sprigs, grass, hearts, flowers, sparkles) dresses every section's corners, tuned per breakpoint.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static export per route) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- [GSAP 3](https://gsap.com) + ScrollTrigger via `@gsap/react` for all choreography
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Vercel for hosting and analytics

## Accessibility & performance

- Full `prefers-reduced-motion` support — every animation has a static or simplified path, and content is never gated behind motion.
- Semantic heading hierarchy, keyboard-reachable navigation (including keyboard focus that lifts project cards above the deck), focus-visible styling.
- Fully responsive, including mobile-specific sticker layouts and browser-chrome-safe backgrounds.
- Lighthouse scores in the high 90s.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TS pass
npm run build      # production build
```

## Content

All copy and data live in typed modules under `content/` (`site.ts`, `about.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `achievements.ts`) — the sections render entirely from them, so updating the portfolio is a data edit, not a component edit.

---

Copyright © Harshverrdhon Singh Tanwar. Source visible for review, not licensed for reuse.
