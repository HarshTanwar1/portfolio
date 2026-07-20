"use client";

import { useEffect, useState } from "react";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";
import { PaddyBeds } from "../paddy/PaddyBeds";

const { skillsKicker, skillsTitle } = v3Copy.sunroom;

/**
 * Stickers avoid the vertical middle band, which the paddy beds own. On
 * mobile the headline and the beds span the full width, so the set shrinks
 * and tucks into the top/bottom padding strips instead.
 */
function skillStickers(mobile: boolean): StickerItem[] {
  return mobile
    ? [
        { node: <stickers.flower />, x: 89, y: 2.6, size: 44, drift: 0.5 },
        { node: <stickers.sparkle />, x: 90, y: 97, size: 20, drift: 0.5 },
      ]
    : [
        { node: <stickers.flower />, x: 92, y: 14, size: 64, drift: 0.5 },
        { node: <stickers.sprig />, x: 5, y: 86, size: 54, drift: 0.7 },
        { node: <stickers.sparkle />, x: 93, y: 90, size: 28, drift: 0.5 },
      ];
}

/**
 * Skills — the young-rice field. Below the headline, the paddy: four
 * garden-bed terraces (see paddy/PaddyBeds). Achievements moved to their own
 * section on the gold field just below.
 */
export function Skills() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden py-24 sm:py-32"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <StickerField items={skillStickers(mobile)} />

      <div className="relative z-10">
        <div className="mx-auto w-full max-w-5xl px-6" data-scroll-anchor>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]"
            style={{ color: SUNROOM.accent }}
          >
            {skillsKicker}
          </p>
          <SplitReveal
            as="h2"
            mode="words"
            trigger="scroll"
            stagger={0.05}
            className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.01em]"
          >
            {skillsTitle}
          </SplitReveal>
        </div>

        <PaddyBeds />
      </div>
    </div>
  );
}
