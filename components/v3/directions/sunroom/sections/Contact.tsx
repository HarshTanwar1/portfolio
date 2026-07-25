"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { Choreo } from "@/components/v3/motion/SectionChoreo";
import { Magnetic } from "@/components/v3/motion/Magnetic";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { useCurrentYear } from "@/components/v3/motion/useCurrentYear";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { contactKicker, contactTitle, contactLinks } = v3Copy.sunroom;

/**
 * Flower + heart close the journey (binding composition) — flower up-left,
 * heart down-right, clear of the centered type column.
 */
function contactStickers(scale: number): StickerItem[] {
  const s = (n: number) => Math.round(n * scale);
  return [
    { node: <stickers.flower />, x: 12, y: 20, size: s(88), drift: 0.5 },
    { node: <stickers.sun />, x: 87, y: 72, size: s(122), drift: 0.6 },
  ];
}

const pillCls =
  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-base";

/**
 * Contact — the leaf field again, closing the FieldSweep full-circle back to
 * the hero green. Giant "say hello." split-char reveal, the email as a huge
 * underlined magnetic mailto, then GitHub / LinkedIn / Resume pills and a
 * modest plain-text footer. Everything lands instantly under reduced motion.
 */
export function Contact() {
  const [scale, setScale] = useState(1);
  const year = useCurrentYear();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setScale(mq.matches ? 0.62 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // `resumePath` is nullable in `SiteMeta`; drop the pill when there is none.
  const external = [
    { label: contactLinks.github, href: site.github },
    { label: contactLinks.linkedin, href: site.linkedin },
    ...(site.resumePath
      ? [{ label: contactLinks.resume, href: site.resumePath }]
      : []),
  ];

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden px-6 pt-24 sm:pt-32"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <StickerField items={contactStickers(scale)} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center">
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.14em]"
          style={{ color: SUNROOM.accent }}
          data-scroll-anchor
        >
          {contactKicker}
        </p>

        <SplitReveal
          as="h2"
          mode="chars"
          trigger="scroll"
          stagger={0.045}
          className="font-[family-name:var(--font-display)] text-[clamp(3.25rem,11vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.02em]"
        >
          {contactTitle}
        </SplitReveal>

        <Choreo className="mt-10 flex w-full flex-col items-center gap-9 sm:mt-12">
          <div data-choreo className="max-w-full">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${site.email}`}
                data-cursor="pointer"
                className="inline-block max-w-full break-words font-[family-name:var(--font-display)] text-[clamp(1.4rem,4.5vw,3.25rem)] font-bold leading-tight underline decoration-[0.09em] underline-offset-[0.22em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  color: SUNROOM.ink,
                  textDecorationColor: SUNROOM.accent,
                  // Keep the coral rule unbroken — skip-ink gaps the "@"
                  // descender, which reads as a glitch at this size.
                  textDecorationSkipInk: "none",
                  outlineColor: SUNROOM.ink,
                }}
              >
                {site.email}
              </a>
            </Magnetic>
          </div>

          <div data-choreo className="flex flex-wrap items-center justify-center gap-3">
            {external.map((link) => (
              <Magnetic key={link.label} strength={0.4}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="pointer"
                  className={pillCls}
                  style={{
                    background: SUNROOM.paper,
                    color: SUNROOM.ink,
                    border: `2px solid ${SUNROOM.ink}`,
                    outlineColor: SUNROOM.ink,
                  }}
                >
                  {link.label}
                  <span aria-hidden>↗</span>
                </a>
              </Magnetic>
            ))}
          </div>
        </Choreo>
      </div>

      {/* pb-20 on mobile keeps the last line clear of the fixed "↑ top" pill.
          opacity-90, not 70: ink at 70% blends to 3.28:1 on the leaf field
          (AA needs 4.5); 90% measures 4.91:1. */}
      <footer className="relative z-10 mt-16 pb-20 text-center text-sm opacity-90 sm:pb-7">
        © {year} · {site.name}
      </footer>
    </div>
  );
}
