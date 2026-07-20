/**
 * V3 motion core — shared timing primitives.
 *
 * `dur()` is the single source of the v3 "reduced-motion gate": every v3
 * motion consumer (SmoothScroll, SplitReveal, FieldSweep, and the sections
 * built on top) routes its durations through here so the
 * `prefers-reduced-motion` contract lives in exactly one place.
 */

/**
 * Animation duration honoring `prefers-reduced-motion`.
 *
 * Returns `0` when the user asked for reduced motion (callers treat `0` as
 * "skip the animation, render the final state"), otherwise the passed seconds.
 * Called with no argument it returns `1` (a truthy "motion is on" sentinel) so
 * `dur() ? "smooth" : "auto"`-style checks read correctly.
 */
export function dur(seconds: number = 1): number {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return 0;
  }
  return seconds;
}

/** GSAP easing tokens shared across every v3 primitive and section. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  pop: "back.out(1.7)",
} as const;
