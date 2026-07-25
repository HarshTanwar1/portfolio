"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Lenis from "lenis";
import { dur } from "./motion";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Pixels of clearance between the viewport top and a jumped-to section's
 * HEADER, so the heading lands comfortably below the fixed nav (which tops out
 * ~56px) rather than jammed against the edge — and, crucially, near the TOP of
 * the screen rather than mid-viewport. Sections are `min-h-screen` with
 * centered / top-padded content, so scrolling their box to the top would drop
 * the heading into the middle with a large empty field above it.
 */
const NAV_CLEARANCE = 96;

/**
 * Resolves a hash to an absolute document scroll position (px), or `null` to
 * defer to the default header-anchor computation. Registered by sections whose
 * correct landing is NOT "header near the top" — e.g. a pinned scrubbed deck
 * that must land mid-pin at the scroll position where the first card has just
 * settled (at pin-start the timeline is at progress 0 and every card is parked
 * off-screen). Evaluated at CLICK time so it reads live layout / ScrollTrigger
 * geometry (pin-spacer distance, refreshed start/end).
 */
type ScrollTargetResolver = () => number | null;

/**
 * `immediate` lands the jump in the same event turn with no glide — used by
 * keyboard-focus corrections that must beat the next paint (e.g. the pinned
 * decks snapping to the focused card's settle point).
 */
type ScrollToFn = (hash: string, opts?: { immediate?: boolean }) => void;

type ScrollToApi = {
  scrollTo: ScrollToFn;
  registerAnchor: (hash: string, resolve: ScrollTargetResolver) => () => void;
};

/**
 * Absolute document Y that puts the target section's HEADER at `NAV_CLEARANCE`
 * below the viewport top. Prefers a `[data-scroll-anchor]` landmark inside the
 * section (the kicker/title block) so vertically-centered or top-padded
 * sections still land header-up; falls back to the section box itself. Returns
 * `null` when the hash resolves to nothing (forward-compatible with anchors
 * whose section is not mounted yet).
 */
function headerTargetY(hash: string): number | null {
  let section: Element | null = null;
  try {
    section = document.querySelector(hash);
  } catch {
    return null; // malformed selector
  }
  if (!section) return null;
  const anchor = section.querySelector("[data-scroll-anchor]") ?? section;
  const top = anchor.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, Math.round(top - NAV_CLEARANCE));
}

/** Native-scroll jump to an absolute Y (reduced motion / no Lenis). */
function nativeScrollToY(y: number, immediate = false): void {
  window.scrollTo({ top: y, behavior: immediate || !dur() ? "auto" : "smooth" });
}

/** Fallback API when no `<SmoothScroll>` is mounted: native header-anchored jumps. */
const defaultApi: ScrollToApi = {
  scrollTo: (hash, opts) => {
    const y = headerTargetY(hash);
    if (y != null) nativeScrollToY(y, opts?.immediate);
  },
  registerAnchor: () => () => {},
};

const ScrollToContext = createContext<ScrollToApi>(defaultApi);

/**
 * Mounts a single Lenis instance driving smooth `<html>` (window) scroll and
 * wires it into GSAP's ScrollTrigger. Lenis is intentionally NOT created under
 * reduced motion (`dur() === 0`) — the page falls back to native scrolling and
 * `useScrollTo` degrades to an instant native jump.
 */
export function SmoothScroll({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lenisRef = useRef<Lenis | null>(null);
  // Section-owned landing resolvers, keyed by hash. A ref (not state) so
  // registration never re-renders and `scrollTo` reads the live set at click
  // time.
  const anchorsRef = useRef(new Map<string, ScrollTargetResolver>());

  useEffect(() => {
    // Reduced motion: no Lenis at all, native scroll takes over.
    if (dur() === 0) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position and drive
    // Lenis from GSAP's ticker (a single rAF loop for the whole page).
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Home/End are scrolled NATIVELY by the browser — Lenis only virtualizes
    // wheel/touch — so a press that lands inside Lenis' animation window
    // (~1.1s after any wheel input) is overwritten by its next rAF write and
    // silently swallowed. Route both keys through Lenis instead: they get the
    // same smooth glide as everything else and can never fight the loop.
    // (No editable fields exist on the site today; the guard is one line of
    // insurance for any future form.)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Home" && e.key !== "End") return;
      const t = e.target as HTMLElement | null;
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName ?? "")) return;
      e.preventDefault();
      lenis.scrollTo(e.key === "Home" ? 0 : document.documentElement.scrollHeight);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(onTick);
      // Restore GSAP's default lag compensation (500ms threshold, 33ms
      // adjustment) — lagSmoothing(0) above is a global ticker setting that
      // would otherwise outlive this provider. Unreachable in practice (the
      // root provider never unmounts mid-session), but the cleanup keeps the
      // global-state pairing symmetric.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const registerAnchor = useCallback<ScrollToApi["registerAnchor"]>(
    (hash, resolve) => {
      anchorsRef.current.set(hash, resolve);
      return () => {
        // Only delete if we still own the slot (guards against a stale cleanup
        // clobbering a newer registration for the same hash).
        if (anchorsRef.current.get(hash) === resolve) {
          anchorsRef.current.delete(hash);
        }
      };
    },
    []
  );

  const scrollTo = useCallback<ScrollToFn>((hash, opts) => {
    // A section-owned resolver wins (e.g. a pinned deck landing mid-pin);
    // otherwise land the section's header near the top.
    const resolver = anchorsRef.current.get(hash);
    const resolved = resolver ? resolver() : null;
    const y =
      resolved != null ? Math.max(0, Math.round(resolved)) : headerTargetY(hash);
    if (y == null) return; // unknown target — no-op, as before

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(y, opts?.immediate ? { immediate: true } : undefined);
      return;
    }
    nativeScrollToY(y, opts?.immediate);
  }, []);

  const api = useMemo<ScrollToApi>(
    () => ({ scrollTo, registerAnchor }),
    [scrollTo, registerAnchor]
  );

  return (
    <ScrollToContext.Provider value={api}>{children}</ScrollToContext.Provider>
  );
}

/**
 * Returns a `scrollTo(hash)` for nav pills / anchor links. Lands the target
 * section's HEADER near the viewport top (or, for a section that registered a
 * custom resolver via `useScrollAnchor`, wherever that resolver points). Uses
 * Lenis when mounted, otherwise an instant native jump.
 */
export function useScrollTo(): ScrollToFn {
  return useContext(ScrollToContext).scrollTo;
}

/**
 * Registers a custom scroll-landing resolver for `hash` while `enabled` is
 * true. The resolver runs at CLICK time and returns an absolute document Y (or
 * `null` to fall back to the header-anchor default). Used by pinned sections
 * that must land INSIDE the pin (where the first card has settled) rather than
 * at the section top. The latest `resolve` closure is always used without
 * re-registering.
 */
export function useScrollAnchor(
  hash: string,
  resolve: ScrollTargetResolver,
  enabled: boolean = true
): void {
  const { registerAnchor } = useContext(ScrollToContext);
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;
  useEffect(() => {
    if (!enabled) return;
    return registerAnchor(hash, () => resolveRef.current());
  }, [hash, enabled, registerAnchor]);
}
