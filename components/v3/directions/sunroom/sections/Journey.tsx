"use client";

import { useRef } from "react";
import { experience, education } from "@/content/experience";
import type { ExperienceEntry, EducationEntry } from "@/content/types";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { Choreo } from "@/components/v3/motion/SectionChoreo";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { gsap, useGSAP } from "@/components/v3/motion/gsap";
import { dur } from "@/components/v3/motion/motion";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { journeyKicker, journeyTitle, journeyColumns } = v3Copy.sunroom;

// Both hidden below sm: the single-column journey spans the full width on
// phones, leaving no safe whitespace for corner art. The wrapper span does
// the hiding — the sticker svg itself carries an inline display:block
// (svgProps) that would defeat a class on the svg.
const accentStickers: StickerItem[] = [
  {
    node: (
      <span className="hidden sm:block">
        <stickers.heart />
      </span>
    ),
    x: 94,
    y: 30,
    size: 46,
    drift: 0.5,
  },
  {
    node: (
      <span className="hidden sm:block">
        <stickers.grass />
      </span>
    ),
    x: 7,
    y: 86,
    size: 52,
    drift: 0.6,
  },
];

/**
 * Hand-drawn serpentine vine, generated from measured leaf positions — see
 * the build effect. Under motion it draws itself on scroll (stroke-dashoffset
 * scrub); under reduced motion (no dash set) it is simply rendered fully
 * drawn, as required.
 */
function Vine() {
  return (
    <svg
      aria-hidden
      data-vine-svg
      // h-full is load-bearing: an absolutely-positioned replaced element
      // ignores inset-0's vertical stretch and falls back to its intrinsic
      // (viewBox aspect) height — without it this svg renders 1000px tall,
      // overflowing the column and poisoning scrollHeight.
      className="pointer-events-none absolute inset-0 left-0 h-full w-10"
      viewBox="0 0 40 1000"
    >
      <path
        data-vine
        d="M20 0"
        fill="none"
        stroke={SUNROOM.ink}
        strokeOpacity={0.35}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A single leaf node sitting on the vine, centered in the 40px node gutter. */
function LeafNode() {
  return (
    <span
      aria-hidden
      className="relative z-10 flex w-10 shrink-0 justify-center pt-1"
    >
      <span
        data-leaf
        className="flex items-center justify-center rounded-full p-1.5"
        style={{ background: SUNROOM.fields.experience }}
      >
        <stickers.leaf size={22} />
      </span>
    </span>
  );
}

function DateLine({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p
      className="text-sm font-semibold uppercase tracking-[0.08em]"
      style={{ color: SUNROOM.accent }}
    >
      {children}
    </p>
  );
}

function ExperienceItem({ job }: Readonly<{ job: ExperienceEntry }>) {
  return (
    <div data-choreo className="flex items-start gap-4">
      <LeafNode />
      <div className="flex-1 pt-0.5">
        <DateLine>
          {job.start} — {job.end}
          {job.location ? ` · ${job.location}` : ""}
        </DateLine>
        <h4 className="mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold leading-tight sm:text-2xl">
          {job.role}
        </h4>
        <p className="text-base font-semibold opacity-80">{job.company}</p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[0.95rem] leading-relaxed opacity-90">
          {job.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EducationItem({ ed }: Readonly<{ ed: EducationEntry }>) {
  return (
    <div data-choreo className="flex items-start gap-4">
      <LeafNode />
      <div className="flex-1 pt-0.5">
        <DateLine>
          {ed.start} — {ed.end}
        </DateLine>
        <h4 className="mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold leading-tight sm:text-2xl">
          {ed.degree}
        </h4>
        <p className="text-base font-semibold opacity-80">{ed.institution}</p>
        {ed.details && (
          <p className="mt-2 text-[0.95rem] leading-relaxed opacity-90">
            Scored {ed.details}
          </p>
        )}
      </div>
    </div>
  );
}

function ColumnHeader({ label }: Readonly<{ label: string }>) {
  return (
    <h3
      className="mb-8 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-extrabold uppercase tracking-[0.12em]"
      style={{ color: SUNROOM.ink }}
    >
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-full"
        style={{ background: SUNROOM.accent }}
      />
      {label}
    </h3>
  );
}

/**
 * Journey — the Experience & Education timeline on the `#DFF0C8` field. Two
 * columns at ≥1024px (single column below), each a hand-drawn vine with leaf
 * sticker nodes; entries rise in via `Choreo`, dates in coral. Everything lands
 * instantly and the vine renders fully drawn under reduced motion.
 */
export function Journey() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Build each column's vine path from measured leaf positions, then draw it
  // on scroll (motion only). Reduced motion still builds the path (so leaves
  // stay aligned) but skips the draw scrub, leaving it rendered fully drawn.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cols = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-vine-col]"));
      const tweens: gsap.core.Tween[] = [];

      // Transform-immune y measurement (Choreo entrance translates entries;
      // getBoundingClientRect would bake that offset in mid-reveal).
      const offsetTopWithin = (el: HTMLElement, ancestor: HTMLElement) => {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n && n !== ancestor) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return y;
      };

      const build = () => {
        // Kill previous draw tweens before rebuilding paths (lengths change).
        tweens.splice(0).forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        cols.forEach((col) => {
          const svg = col.querySelector<SVGSVGElement>("[data-vine-svg]");
          const path = col.querySelector<SVGPathElement>("[data-vine]");
          const leaves = gsap.utils.toArray<HTMLElement>(col.querySelectorAll("[data-leaf]"));
          if (!svg || !path || leaves.length === 0) return;

          // clientHeight, not scrollHeight: the svg's h-full keeps it inside
          // the column, so the box heights agree and viewBox units stay 1:1.
          const H = col.clientHeight;
          svg.setAttribute("viewBox", `0 0 40 ${Math.max(1, H)}`);

          // Serpentine that crosses the gutter center (x=20) exactly at every
          // leaf's center, alternating bulge sides. It starts at the first
          // leaf and runs a tail alongside the LAST entry, ending exactly at
          // that entry's content bottom — never past it.
          const ys = leaves.map(
            (leaf) => offsetTopWithin(leaf, col) + leaf.offsetHeight / 2
          );
          const entries = gsap.utils.toArray<HTMLElement>(
            col.querySelectorAll("[data-choreo]")
          );
          const lastEntry = entries[entries.length - 1];
          const targets = ys.slice(1);
          if (lastEntry) {
            const tailY =
              offsetTopWithin(lastEntry, col) + lastEntry.offsetHeight;
            if (tailY > ys[ys.length - 1] + 8) targets.push(tailY);
          }
          let d = `M20 ${ys[0]}`;
          let dir = 1;
          let prev = ys[0];
          for (const y of targets) {
            const gap = y - prev;
            d += ` C ${20 + 11 * dir} ${prev + gap / 3}, ${20 + 11 * dir} ${prev + (2 * gap) / 3}, 20 ${y}`;
            dir = -dir;
            prev = y;
          }
          path.setAttribute("d", d);

          if (dur() === 0) return; // reduced motion: full vine, no draw scrub
          const len = path.getTotalLength();
          if (len < 1) return; // single-node column: nothing to draw-scrub
          tweens.push(
            gsap.fromTo(
              path,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  // Draw as the vine enters and finish while the entries are
                  // comfortably in view (not deep-scroll), so the vine reads
                  // as present whenever you are reading the timeline.
                  trigger: path,
                  start: "top 90%",
                  end: "top 45%",
                  scrub: true,
                },
              }
            )
          );
        });
      };

      build();
      // Entry heights settle after the display/body fonts load; re-anchor
      // then, and on debounced resize (wraps change entry heights). The
      // `alive` flag stops a StrictMode-retired closure's pending fonts.ready
      // callback from building an untracked tween generation.
      let alive = true;
      document.fonts.ready.then(() => {
        if (alive && rootRef.current) build();
      });
      let t: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(t);
        t = setTimeout(build, 250);
      };
      window.addEventListener("resize", onResize);
      return () => {
        alive = false;
        window.removeEventListener("resize", onResize);
        clearTimeout(t);
        // Generations built after fonts.ready/resize aren't captured by the
        // useGSAP context — kill the live one explicitly on unmount.
        tweens.splice(0).forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden px-6 py-24 sm:py-32"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <StickerField items={accentStickers} />

      <div className="relative z-10 mx-auto w-full max-w-5xl" data-scroll-anchor>
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]"
          style={{ color: SUNROOM.accent }}
        >
          {journeyKicker}
        </p>
        <SplitReveal
          as="h2"
          mode="words"
          trigger="scroll"
          stagger={0.05}
          className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.01em]"
        >
          {journeyTitle}
        </SplitReveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-14">
          <section aria-label={journeyColumns.experience}>
            <ColumnHeader label={journeyColumns.experience} />
            <div className="relative" data-vine-col>
              <Vine />
              <Choreo className="flex flex-col gap-12">
                {experience.map((job) => (
                  <ExperienceItem
                    key={`${job.company}-${job.role}-${job.start}`}
                    job={job}
                  />
                ))}
              </Choreo>
            </div>
          </section>

          <section aria-label={journeyColumns.education}>
            <ColumnHeader label={journeyColumns.education} />
            <div className="relative" data-vine-col>
              <Vine />
              <Choreo className="flex flex-col gap-12">
                {education.map((ed) => (
                  <EducationItem key={`${ed.institution}-${ed.degree}`} ed={ed} />
                ))}
              </Choreo>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
