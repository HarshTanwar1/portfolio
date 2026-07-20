"use client";

import { useEffect, useLayoutEffect } from "react";

/** `useLayoutEffect` on the client, `useEffect` during SSR. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Dev/testing affordance shared by every route: visiting `?fresh=1` clears the
 * given preloader "already played this session" flag so the curtain replays.
 *
 * Rendered as the FIRST child before its `<Preloader>` so the flag is cleared
 * before the preloader reads it (sibling layout effects fire in tree order).
 * `storageKey` MUST match the key the matching `<Preloader>` uses — each
 * direction derives both from ONE exported constant (e.g. `SUNROOM_PRELOADER_KEY`
 * next to the page composer), so a rename can't desync the two. Renders nothing.
 */
export function PreloaderReset({
  storageKey,
}: Readonly<{ storageKey: string }>) {
  useIsoLayoutEffect(() => {
    if (new URLSearchParams(window.location.search).get("fresh") === "1") {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // sessionStorage unavailable — nothing to reset.
      }
    }
  }, [storageKey]);

  return null;
}
