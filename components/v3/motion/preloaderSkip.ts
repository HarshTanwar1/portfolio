/**
 * Single source of truth for the "skip the preloader curtain?" decision,
 * shared by BOTH of its consumers:
 *
 *   1. `Preloader` calls it at hydration to decide whether the curtain plays.
 *   2. `veilSkipScript()` serializes THE SAME FUNCTION (via `toString()`) into
 *      the parse-time inline `<script>` that removes the first-paint veil for
 *      visitors who won't get the curtain (see the veil block in
 *      `SunroomPage`).
 *
 * Because the inline script embeds whatever this function compiles to, the
 * two consumers cannot drift apart — the rules have exactly one definition.
 *
 * LOAD-BEARING CONSTRAINT: `preloaderSkip` must stay fully self-contained —
 * no imports, no references to module-scope values, everything in via
 * parameters — because `Function.prototype.toString()` captures only the
 * function's own body. A violation surfaces immediately as a ReferenceError
 * from the inline script on the very first page load, not silently.
 */

/** DOM id of the sunroom first-paint veil (`SunroomPage` renders it). */
export const PRELOADER_VEIL_ID = "v3-veil";

/**
 * True when the intro curtain should NOT play for this pageview: it already
 * played this session, the visitor deep-linked to a `#section` (they asked
 * for that content, not the intro — and the session ticket is deliberately
 * not stamped, so a later hash-less visit still gets the intro), or they
 * prefer reduced motion (the same gate `dur() === 0` expresses — restated
 * inline here so the serialized script needs no import).
 */
export function preloaderSkip(storageKey: string): boolean {
  let done = false;
  try {
    done = sessionStorage.getItem(storageKey) === "1";
  } catch {
    // sessionStorage unavailable (private mode) — treat as not-yet-played.
  }
  return (
    done ||
    window.location.hash !== "" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Body of the parse-time inline `<script>` paired with the veil: re-runs the
 * exact skip decision DURING HTML PARSE (before first paint) and removes the
 * veil whenever the curtain would be skipped, so repeat / `#hash` /
 * reduced-motion visitors get content as their first paint — byte-identical
 * to builds without the veil.
 */
export function veilSkipScript(storageKey: string): string {
  return (
    `(${preloaderSkip.toString()})(${JSON.stringify(storageKey)})` +
    `&&document.getElementById(${JSON.stringify(PRELOADER_VEIL_ID)})?.remove();`
  );
}
