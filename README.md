<div align="center">

# 🌻 Portfolio

A sunny, scroll-choreographed one-page portfolio

Bold type, hand-drawn stickers, and a GSAP-driven motion system carry the whole story on a single page — from a preloader curtain and split-text hero reveal, through a pinned project deck, to a rice-paddy skills field that gets watered chip by chip

🌐 **Live at [harshtanwar1.vercel.app](https://harshtanwar1.vercel.app)**

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<br>

## ✨ Overview

**Portfolio** is a single-page site where the scroll itself is the navigation: one continuous canvas that re-tints field by field as you move through the story — hero, about, projects, journey, skills, achievements, contact — with every section choreographed by GSAP ScrollTrigger and smoothed by Lenis. All copy and data live in typed content modules, so the site is re-skinnable from data alone.

<br>

## 🌟 Key Highlights

- ♿ **Motion with a conscience** — full `prefers-reduced-motion` support; every animation has a static or simplified path, and content is never gated behind motion.
- ⌨️ **Keyboard-first details** — focus-visible styling everywhere, keyboard focus lifts project cards above the deck, and Home/End keys glide through the smooth-scroll engine instead of fighting it.
- 📱 **Fully responsive** — pinned showcases become vertical flows on touch, stickers re-layout per breakpoint, and backgrounds stay painted through mobile browser-chrome collapse.
- ⚡ **Fast where it counts** — statically exported, Lighthouse scores in the high 90s, server-rendered headline for SEO.
- 🗂️ **Content as data** — sections render entirely from typed modules under `content/`; updating the portfolio is a data edit, not a component edit.

<br>

## 🛠️ Tech Stack

| Layer             | Technologies                                                       |
| :---------------- | :----------------------------------------------------------------- |
| **Framework**     | Next.js 16 (App Router, static export) · React 19                 |
| **Language**      | TypeScript 5                                                       |
| **Styling**       | Tailwind CSS 4                                                     |
| **Animation**     | GSAP 3 + ScrollTrigger via `@gsap/react`                          |
| **Smooth scroll** | Lenis                                                              |
| **Hosting**       | Vercel (+ Analytics)                                               |

<br>

## 🚀 Features & Functionality

- 🎨 **Field sweeps** — the page background is one continuous canvas that re-tints as you scroll between sections, ending on a golden "harvest" field.
- 🃏 **Projects deck** — a pinned, scrub-driven card deck with docking indicators; cards deal out as you scroll and rewind on the way back.
- 🌿 **Journey vines** — experience and education timelines traced by SVG vines generated from the measured positions of their leaf nodes, drawn in by scroll.
- 🌾 **Rice-paddy skills** — a watering can slides in, tilts, and pours a parabolic shower into the first bed; terraced beds flood one another through spillways while skill chips sprout with the rising water. Hovering any chip pools ripple rings around it.
- 🌧️ **Grain downpour** — the achievements section opens with a once-per-visit rain of grain that the award plaques pop up through, badges pulsing as they land.
- ✂️ **Sticker field** — a paper-cutout sticker system (suns, sprigs, grass, hearts, flowers, sparkles) dresses every section's corners, tuned per breakpoint.
- 🧲 **Micro-interactions** — magnetic pills that drift toward the cursor, a trailing cursor ring, split-text reveals, and a counting preloader curtain.

<br>

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HarshTanwar1/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Then open **http://localhost:3000/** in your browser and scroll away! 🎉

> 🔧 `npm run typecheck` runs the strict TS pass, and `npm run build` produces the static production build.

<br>

## 📚 What I Learned

- 🎬 **Scroll choreography at scale** — pinned scrub timelines, docking cues, and keeping a dozen ScrollTriggers measurement-safe through font swaps and resizes.
- 🖱️ **Native scroll vs. virtual scroll** — integrating Lenis with GSAP's ticker, and routing keyboard scrolling through the engine so no input gets swallowed.
- 📐 **Transform-immune measurement** — generating SVG vine paths from `offsetTop` chains so entrance animations can't poison the geometry.
- 🎨 **Paint-order pitfalls** — CSS canvas background propagation, negative z-index layers, and why background fixes must be verified in pixels, not computed styles.
- ♿ **Reduced-motion parity** — designing every animation with an equivalent static state instead of bolting accessibility on afterwards.

<br>

## 🔮 Future Improvements

- 🌗 **Theme variants** — a dusk/night palette driven by the same field-sweep system.
- 🧩 **More showcase entries** — the projects deck scales from data, so new cards are a content edit away.
- 🌍 **Internationalization** — the typed content modules make a locale switch structurally straightforward.
- 🎥 **View Transitions API** — smoother section-to-section deep links as browser support matures.

<br>

---

<div align="center">

⭐ _If you found this project interesting, consider giving it a star!_ ⭐

Copyright © Harshverrdhon Singh Tanwar. Source visible for review, not licensed for reuse.

</div>
