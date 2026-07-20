"use client";

import { useRef } from "react";
import { dur, EASE } from "./motion";
import { gsap, useGSAP } from "./gsap";

type ChoreoProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

/**
 * Scroll-enter choreography. Every descendant marked `data-choreo` rises and
 * fades in on a `0.08` stagger when the container reaches `top 75%`. Under
 * reduced motion the tween is skipped and the items render in place.
 */
export function Choreo({
  as: Tag = "div",
  className,
  children,
}: Readonly<ChoreoProps>) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (dur() === 0) return; // reduced motion: items render in place.
      const el = ref.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-choreo]")
      );
      if (items.length === 0) return;

      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: dur(0.6),
        ease: EASE.out,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Optional tuning for {@link usePinnedScrub}. */
type PinnedScrubOptions = {
  /**
   * ScrollTrigger id for the pin. Purely additive: when omitted the trigger is
   * anonymous (unchanged behavior). Set it so callers can look the pin up at
   * runtime (`ScrollTrigger.getById`) — e.g. to compute the scroll position at
   * which the first card has landed, for a nav jump that must land inside the
   * pin rather than at its (empty) start.
   */
  id?: string;
};

/**
 * Pins the returned-ref section for `lengthVh` viewport-heights and scrubs a
 * caller-built timeline through the pin — the Projects-showcase engine. The
 * builder receives an empty timeline to populate (`.from`/`.to` on elements
 * inside the section).
 *
 * This hook builds ONLY the pinned deck timeline; its end-states are deck
 * transforms (fanned/tumbled card positions) that only make sense in the pinned
 * layout and would wreck a normal document flow. So consumers must detach the
 * returned ref (and pass `lengthVh` 0) whenever they are NOT in deck mode —
 * mobile, and reduced motion — and render the section themselves in a plain
 * flow. Under reduced motion this hook therefore no-ops: there is nothing to
 * pin and nothing to seek.
 */
export function usePinnedScrub<T extends HTMLElement = HTMLDivElement>(
  buildTimeline: (tl: gsap.core.Timeline) => void,
  lengthVh: number,
  options?: PinnedScrubOptions
) {
  const ref = useRef<T>(null);
  // Keep the latest builder without forcing the effect to re-run on identity.
  const buildRef = useRef(buildTimeline);
  buildRef.current = buildTimeline;
  const id = options?.id;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reduced motion: no pin. Consumers detach the ref outside deck mode, so
      // reaching here under reduced motion would mean a consumer attached the
      // ref anyway — still nothing to do, because seeking the deck timeline to
      // its end would apply deck transforms to a flow layout. Early-return.
      if (dur() === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          id, // undefined ⇒ anonymous trigger (default, unchanged)
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (lengthVh / 100)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // A pin higher on the page must refresh before triggers below it so
          // they pick up the pin-spacer's pushed distance; without this a
          // scroll-linked section after the pin (e.g. a FieldSweep) computes its
          // start in the pin's collapsed coordinate space and fires ~lengthVh
          // too early. See GSAP's ScrollTrigger `refreshPriority` guidance.
          refreshPriority: 1,
        },
      });
      buildRef.current(tl);
    },
    { scope: ref, dependencies: [lengthVh, id], revertOnUpdate: true }
  );

  return ref;
}
