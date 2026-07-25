"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { Magnetic } from "@/components/v3/motion/Magnetic";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { useScrollTo } from "@/components/v3/motion/SmoothScroll";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { heroKicker, heroCtas } = v3Copy.sunroom;

/**
 * Sticker placements (binding composition): sun top-right, flower left of the
 * name, leaf bottom-right, sparkle by the CTAs. `scale` shrinks the whole set
 * on small screens so the folk art frames — never crowds — the centered type.
 */
function heroStickers(scale: number): StickerItem[] {
  const s = (n: number) => Math.round(n * scale);
  return [
    { node: <stickers.sun />, x: 87, y: 15, size: s(122), drift: 0.6 },
    { node: <stickers.flower />, x: 11, y: 40, size: s(96), drift: 0.4 },
    { node: <stickers.sprig />, x: 86, y: 79, size: s(78), drift: 0.8 },
    { node: <stickers.sparkle />, x: 33, y: 73, size: s(38), drift: 0.5 },
  ];
}

/**
 * Hero — a full-viewport leaf field. The reveal is gated on `ready` (flipped by
 * the preloader's `onDone`) so the split-char headline assembles *after* the
 * curtain lifts, never underneath it: that handoff is the signature moment. The
 * min-height is reserved even before `ready` so nothing reflows when the content
 * mounts. Under reduced motion `ready` is true on the first paint and every
 * reveal renders instantly.
 */
export function Hero({ ready }: Readonly<{ ready: boolean }>) {
  const scrollTo = useScrollTo();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setScale(mq.matches ? 0.62 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const goWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo("#projects");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* SSR / pre-reveal fallback. The animated hero below mounts only on
          `ready` (flipped by the preloader's onDone), so the server-rendered
          HTML — now the INDEXED home page — would otherwise carry no name or
          role for crawlers. This visually-hidden block puts the real <h1> name
          and role text in the initial HTML, then unmounts the instant the
          animated hero mounts (`!ready` ⇄ `ready` are mutually exclusive), so
          there is never a visible flash, never two <h1>s, and never a double
          announcement to assistive tech. */}
      {!ready && (
        <div className="sr-only">
          <h1>{site.shortName}</h1>
          <p>{site.role}</p>
        </div>
      )}

      {/* No-JS fallback. The animated hero (and every section below) mounts only
          on the client, so a visitor with JavaScript disabled would otherwise
          see a blank leaf field. This gives them a visible, styled hero — name,
          role, and the two links as plain anchors — on the same field. The
          semantic <h1> already lives in the sr-only block above (present in the
          server HTML), so the name here is a styled <p> to avoid a second h1. */}
      <noscript>
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ color: SUNROOM.ink, fontFamily: "var(--font-body)" }}
        >
          {/* opacity-90, not 80: ink at 80% blends to 4.01:1 on the leaf
              field (AA needs 4.5); 90% measures 4.91:1. */}
          <p className="mb-3 text-base font-medium opacity-90">{heroKicker}</p>
          <p className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
            {site.shortName}
          </p>
          <p className="mt-5 max-w-[34ch] text-lg font-medium">
            {site.role.toLowerCase()}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
              style={{ background: SUNROOM.ink, color: SUNROOM.paper }}
            >
              {heroCtas.work} ↓
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center rounded-full px-7 py-3.5 text-base font-semibold"
              style={{
                background: SUNROOM.paper,
                color: SUNROOM.ink,
                border: `2px solid ${SUNROOM.ink}`,
              }}
            >
              {heroCtas.hello}
            </a>
          </div>
        </div>
      </noscript>

      {ready && (
        <>
          <StickerField items={heroStickers(scale)} />

          <div
            className="relative z-10 flex flex-col items-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <SplitReveal
              as="p"
              mode="words"
              trigger="load"
              className="mb-3 text-base font-medium opacity-90 sm:text-lg"
              from={{ y: 20, rotate: 0 }}
            >
              {heroKicker}
            </SplitReveal>

            {/* Name split into per-word blocks so it stacks cleanly (HARSH /
                TANWAR) and never breaks mid-word — `chars` mode makes every
                letter a wrap opportunity, so the words must be their own
                blocks. Words are derived from `site.shortName`, not hard-coded. */}
            <h1
              aria-label={site.shortName}
              className="flex flex-col items-center font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]"
            >
              {site.shortName.split(" ").map((word, i) => (
                <SplitReveal
                  key={word}
                  as="span"
                  mode="chars"
                  trigger="load"
                  stagger={0.05}
                  className="block"
                  from={{ y: 60, rotate: -8, delay: i * 0.12 }}
                >
                  {word}
                </SplitReveal>
              ))}
            </h1>

            <SplitReveal
              as="p"
              mode="words"
              trigger="load"
              stagger={0.05}
              from={{ y: 24, rotate: 0, delay: 0.5 }}
              className="mt-5 max-w-[34ch] text-lg font-medium sm:text-xl"
            >
              {site.role.toLowerCase()}
            </SplitReveal>

            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
              style={{ animation: "sunroomFade 0.6s ease 0.9s both" }}
            >
              <Magnetic strength={0.4}>
                <a
                  href="#projects"
                  onClick={goWork}
                  data-cursor="pointer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-md transition-transform"
                  style={{ background: SUNROOM.ink, color: SUNROOM.paper }}
                >
                  {heroCtas.work}
                  <span aria-hidden>↓</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="pointer"
                  className="inline-flex items-center rounded-full px-7 py-3.5 text-base font-semibold shadow-md transition-transform"
                  style={{
                    background: SUNROOM.paper,
                    color: SUNROOM.ink,
                    border: `2px solid ${SUNROOM.ink}`,
                  }}
                >
                  {heroCtas.hello}
                </a>
              </Magnetic>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes sunroomFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sunroomFade"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
