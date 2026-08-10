"use client";

import { useEffect, useState } from "react";

/**
 * True while the viewport is `px` wide or narrower (`max-width` media query,
 * inclusive). SSR/first client render report `false` — wide-screen markup —
 * and correct in an effect, matching the sections' previous inline pattern.
 */
export function useBelow(px: number): boolean {
  const [below, setBelow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    const apply = () => setBelow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [px]);

  return below;
}
