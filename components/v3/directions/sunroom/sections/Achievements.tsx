"use client";

import { useRef } from "react";
import { achievements } from "@/content/achievements";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { gsap, useGSAP } from "@/components/v3/motion/gsap";
import { dur, EASE } from "@/components/v3/motion/motion";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { achievementsKicker, achievementsTitle } = v3Copy.sunroom;

/** Downpour grain look — caramel ripe-grain fill, fine ink edge (user-tuned). */
const GRAIN_FILL = "#A8742A";
const GRAIN_EDGE = "rgba(23,66,31,0.55)";
/** Badge disc gold (kept separate from the grains so they tune independently). */
const BADGE_GOLD = "#F2A21C";
const GRAIN_COUNT = 26;

/** Corner set: coral heart lower-left, large grass tuft lower-right. */
const cornerStickers: StickerItem[] = [
  { node: <stickers.heart />, x: 8, y: 78, size: 60, drift: 0.5 },
  { node: <stickers.grass />, x: 91, y: 86, size: 60, drift: 0.6 },
];

/**
 * Achievements — the harvest. The skills paddy's produce, on the gold the
 * skills section used to own. Content-sized (four plaques don't fill a
 * viewport), standard section anatomy: coral kicker, split-reveal title,
 * 2×2 plaque grid with golden sheaf badges. On scroll-in a grain downpour
 * rains from the top for ~1.5s while the plaques pop up one by one, reading
 * order, badges pulsing as each lands — the rain becomes the trophies. Plays
 * once per page load; under reduced motion the section is simply present.
 */
export function Achievements() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const plaques = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-plaque]"));
      const badges = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-plaque-badge]"));
      const grains = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-grain]"));

      // Reduced motion: no rain, no pops — the section is simply present.
      if (dur() === 0) return;

      gsap.set(plaques, { autoAlpha: 0, scale: 0.6, y: 16, transformOrigin: "50% 60%" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 50%", once: true },
      });

      // Downpour: burst-then-taper over ~1.5s. Grains start clipped above the
      // section (overflow-hidden root) and fall past its bottom; each hides
      // itself on landing so the section ends perfectly still. The fall
      // distance is a function-based value: the timeline is built at mount
      // but plays at scroll-in, and the section's height can change between
      // the two (font reflow, resize) — evaluate it at play time, not now.
      grains.forEach((grain, i) => {
        const delay = (i % 13) * 0.1 + Math.floor(i / 13) * 0.05;
        tl.fromTo(
          grain,
          { y: -24, x: 0, rotate: (i * 47) % 360, autoAlpha: 1 },
          {
            y: () => root.offsetHeight + 30,
            x: ((i % 5) - 2) * 14,
            rotate: ((i * 47) % 360) + 140,
            duration: 0.85,
            ease: "power1.in",
            onComplete: () => gsap.set(grain, { autoAlpha: 0 }),
          },
          delay
        );
      });

      // The rain becomes the trophies: plaques pop while grains still fall,
      // reading order, badges taking the catch with a pulse.
      plaques.forEach((plaque, i) => {
        const at = 0.7 + i * 0.4;
        tl.to(plaque, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: EASE.pop }, at);
        if (badges[i]) {
          tl.fromTo(
            badges[i],
            { scale: 1 },
            { scale: 1.22, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" },
            at + 0.22
          );
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden px-6 py-24 sm:py-32"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        {Array.from({ length: GRAIN_COUNT }, (_, i) => (
          <span
            key={i}
            data-grain
            className="absolute top-0 h-[11px] w-[7px] rounded-full opacity-0"
            style={{
              left: `${(i * 3.7 + 1.2) % 96}%`,
              background: GRAIN_FILL,
              border: `1.5px solid ${GRAIN_EDGE}`,
            }}
          />
        ))}
      </div>

      <StickerField items={cornerStickers} />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]"
          style={{ color: SUNROOM.accent }}
        >
          {achievementsKicker}
        </p>
        <SplitReveal
          as="h2"
          mode="words"
          trigger="scroll"
          stagger={0.05}
          className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.01em]"
        >
          {achievementsTitle}
        </SplitReveal>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
          {achievements.map((achievement) => (
            <article
              key={achievement.title}
              data-plaque
              className="flex items-start gap-4 p-6 shadow-[0_14px_40px_rgba(23,66,31,0.14)] sm:p-7"
              style={{ background: SUNROOM.paper, borderRadius: SUNROOM.radius }}
            >
              <span
                data-plaque-badge
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: BADGE_GOLD }}
              >
                <stickers.sheaf size={26} />
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-extrabold leading-snug sm:text-xl">
                  {achievement.title}
                </h3>
                {achievement.description && (
                  <p className="mt-1.5 text-sm leading-relaxed opacity-80 sm:text-base">
                    {achievement.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
