"use client";

import { useEffect, useState } from "react";
import { about } from "@/content/about";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { Choreo } from "@/components/v3/motion/SectionChoreo";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { aboutTitle, aboutKicker } = v3Copy.sunroom;

function aboutStickers(scale: number): StickerItem[] {
  const s = (n: number) => Math.round(n * scale);
  return [
    { node: <stickers.sparkle />, x: 90, y: 16, size: s(32), drift: 0.7 },
    // Hidden below sm (wrapper span — the sticker svg's inline display:block
    // defeats a class on the svg itself): collides with the availability
    // pill area on narrow screens.
    {
      node: (
        <span className="hidden sm:block">
          <stickers.heart />
        </span>
      ),
      x: 9,
      y: 82,
      size: s(56),
      drift: 0.5,
    },
    { node: <stickers.grass />, x: 89, y: 84, size: s(58), drift: 0.6 },
  ];
}

/**
 * About — shares the hero's leaf field (no color sweep yet; the first sweep is
 * entering Projects). A scroll-triggered split headline, the bio paragraphs in
 * a 60ch measure staggered in by `Choreo`, and the availability as a coral
 * pill-badge. Under reduced motion every reveal lands instantly.
 */
export function About() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setScale(mq.matches ? 0.62 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 sm:py-32"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <StickerField items={aboutStickers(scale)} />

      <div className="relative z-10 mx-auto w-full max-w-4xl" data-scroll-anchor>
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.14em]"
          style={{ color: SUNROOM.accent }}
        >
          {aboutKicker}
        </p>

        <SplitReveal
          as="h2"
          mode="words"
          trigger="scroll"
          stagger={0.05}
          className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.01em]"
        >
          {aboutTitle}
        </SplitReveal>

        <Choreo className="mt-8 flex max-w-[60ch] flex-col gap-6">
          {about.paragraphs.map((para) => (
            <p
              key={para.slice(0, 24)}
              data-choreo
              className="text-lg leading-relaxed sm:text-xl"
            >
              {para}
            </p>
          ))}

          <div data-choreo className="mt-2">
            <span
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm"
              style={{ background: SUNROOM.accent, color: SUNROOM.paper }}
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: SUNROOM.paper }}
              />
              {about.availability}
            </span>
          </div>
        </Choreo>
      </div>
    </div>
  );
}
