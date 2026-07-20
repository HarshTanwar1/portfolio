"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { ScrollTrigger } from "./gsap";

/**
 * Uniform card heights. Sets every referenced card's inline `min-height` to the
 * TALLEST card's natural content height, so a set of content-sized cards reads
 * as one deck instead of ragged. Used by the Projects showcase — a
 * pinned deck on desktop and a vertical flow on mobile/reduced-motion. This is
 * layout, not animation, so it runs identically in every mode and is untouched
 * by reduced motion.
 *
 * Measurement details that matter:
 * - Clears each card's inline `min-height` BEFORE reading, so a stale (larger)
 *   override from a previous, wider viewport can't measure itself forever — the
 *   deck must be able to shrink back down, not only grow.
 * - Reads `offsetHeight`, not `getBoundingClientRect().height`: the decks settle
 *   with per-card GSAP rotations, and a rotated box's bounding rect is its
 *   inflated axis-aligned box, not its layout height. `offsetHeight` is the
 *   transform-invariant layout box (border + padding + content).
 * - Re-measures after `document.fonts.ready` (web-font metrics can re-wrap lines
 *   and change natural heights after the first layout pass) and on a debounced
 *   resize (a card's width is viewport-relative, so a width change can re-wrap).
 *
 * Two hardening details:
 * - The `document.fonts.ready` callback is guarded by a `disposed` flag: if the
 *   component unmounts before the font promise resolves, the stale closure
 *   short-circuits instead of scheduling a measure into a torn-down effect.
 * - When a RE-measure actually CHANGES the shared max (a late font swap or a
 *   resize re-wrap grew/shrank the tallest card), it calls
 *   `ScrollTrigger.refresh()`. A changed card height moves scroll-linked start
 *   points — the flow-mode entrance trigger, and any pin below — and without a
 *   refresh those drift. The first measure only records the baseline (no
 *   refresh); refreshes fire only on genuine subsequent changes.
 *
 * @param cardRefs Ref to the array of card elements (holes/`null` are skipped).
 * @param deps Re-run dependencies (e.g. the deck/flow mode flag), like a
 *   `useEffect` dependency list.
 */
export function useUniformCardHeights(
  cardRefs: RefObject<(HTMLElement | null)[]>,
  deps: DependencyList = []
) {
  useEffect(() => {
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let lastMax = -1;

    const measure = () => {
      const cards = (cardRefs.current ?? []).filter(Boolean) as HTMLElement[];
      if (cards.length === 0) return;
      // Clear any previous override before reading heights, so a stale (larger)
      // minHeight from before a viewport shrink doesn't measure itself forever.
      cards.forEach((card) => {
        card.style.minHeight = "";
      });
      const max = Math.max(...cards.map((card) => card.offsetHeight));
      cards.forEach((card) => {
        card.style.minHeight = `${max}px`;
      });
      // A changed max on a re-measure means a card's natural height shifted
      // (late font swap / resize re-wrap); scroll-linked triggers that depend
      // on it drift unless refreshed. Skip the very first measure (baseline).
      if (lastMax !== -1 && max !== lastMax) {
        ScrollTrigger.refresh();
      }
      lastMax = max;
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    scheduleMeasure();
    document.fonts?.ready
      .then(() => {
        if (!disposed) scheduleMeasure();
      })
      .catch(() => {});

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleMeasure, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
