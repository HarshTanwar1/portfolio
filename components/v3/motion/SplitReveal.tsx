"use client";

import { useRef } from "react";
import { dur, EASE } from "./motion";
import { gsap, useGSAP } from "./gsap";

type SplitRevealProps = {
  /** Element rendered for the container (default `div`). */
  as?: React.ElementType;
  /** How the text is broken up before animating. */
  mode: "chars" | "words";
  /** `load` animates on mount; `scroll` animates when scrolled into view. */
  trigger: "load" | "scroll";
  /** Per-part stagger in seconds (default `0.04`). */
  stagger?: number;
  /** Overrides for the animation's "from" state (merged over the defaults). */
  from?: gsap.TweenVars;
  className?: string;
  /** The string to reveal. */
  children: string;
};

/** A single whitespace run is preserved verbatim so wrapping/kerning survive. */
const isWhitespace = (part: string) => /^\s+$/.test(part);

/**
 * Accessible split-text reveal. The container carries `aria-label` with the
 * full string and every generated span is `aria-hidden`, so assistive tech
 * reads the intact text while sighted users see the per-part animation.
 *
 * Under reduced motion (`dur() === 0`) the GSAP tween is skipped entirely and
 * the spans render in their natural, fully-visible position.
 */
export function SplitReveal({
  as: Tag = "div",
  mode,
  trigger,
  stagger,
  from,
  className,
  children: text,
}: Readonly<SplitRevealProps>) {
  const containerRef = useRef<HTMLElement>(null);

  // `chars` → one span per character; `words` → split on whitespace, keeping
  // the whitespace runs as their own (non-animated) parts.
  const parts = mode === "chars" ? Array.from(text) : text.split(/(\s+)/);

  useGSAP(
    () => {
      if (dur(0.7) === 0) return; // reduced motion: leave spans in place.
      const el = containerRef.current;
      if (!el) return;

      const spans = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-split]")
      );
      if (spans.length === 0) return;

      gsap.from(spans, {
        y: 40,
        rotate: -6,
        opacity: 0,
        ...from,
        duration: dur(0.7),
        ease: EASE.pop,
        stagger: stagger ?? 0.04,
        scrollTrigger:
          trigger === "scroll" ? { trigger: el, start: "top 80%" } : undefined,
      });
    },
    { scope: containerRef, dependencies: [text, mode, trigger] }
  );

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      {parts.map((part, i) =>
        part === "" ? null : isWhitespace(part) ? (
          // Plain span: preserves the space, no transform so words can wrap.
          <span key={i} aria-hidden>
            {part}
          </span>
        ) : (
          <span
            key={i}
            data-split
            aria-hidden
            className="inline-block will-change-transform"
          >
            {part}
          </span>
        )
      )}
    </Tag>
  );
}
