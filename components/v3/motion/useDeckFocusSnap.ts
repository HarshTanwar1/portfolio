"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "./gsap";
import { useScrollAnchor, useScrollTo } from "./SmoothScroll";

type DeckFocusSnapOptions = Readonly<{
  /** Anchor hash that nav jumps AND focus snaps resolve through. */
  hash: string;
  /** ScrollTrigger id of the section's pin (looked up live per event). */
  pinId: string;
  /**
   * Timeline time at which card `index` has just settled — the scrub target a
   * keyboard focus snaps to. Nav jumps land at `landedTime(0)`.
   */
  landedTime: (index: number) => number;
  /** The pinned deck container; the focus listener attaches here. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Per-card element refs, in DOM order. */
  cardRefs: React.RefObject<(HTMLElement | null)[]>;
  /** Deck mode only — flow mode has no pin, so native focus scrolling is correct. */
  enabled: boolean;
  /** Runs on keyboard focus of a card, before the snap (e.g. a focus-raise). */
  onKeyboardFocus?: (card: HTMLElement, index: number) => void;
}>;

/**
 * Keyboard-focus handling for a pinned, scrubbed card deck.
 *
 * The browser's native focus scroll-into-view is computed from the focused
 * link's pre-scrub rect and is blind to the pin (its scroll distance advances
 * the timeline, not the page), so tabbing into the deck overshoots the entire
 * pin — the deck lands fully dealt with the focused card buried or off-screen.
 * This hook corrects it the moment focus arrives: it registers the section's
 * scroll-anchor resolver (shared by nav jumps) and snaps — immediate, in the
 * same event turn, so the browser's wrong position never paints (verified:
 * the native jump fires BEFORE focusin) — to the offset where the focused
 * card has just settled. Tab/Shift+Tab then step the deck through its dealt
 * states in order. Keyboard-only via `:focus-visible` — mouse clicks on card
 * links keep the scroll exactly where it is.
 *
 * Two verified gotchas live here so consumers can't reintroduce them:
 * - The instant multi-write scroll sequence (browser jump → snap) leaves the
 *   pin's ScrollTrigger with a stale applied state — a subsequent real scroll
 *   does NOT recover it; only an instance-scoped refresh does (synchronous,
 *   so it lands before paint).
 * - That refresh juggles the pin-spacer DOM, which can BLUR the focused link
 *   — focus is restored without letting the browser scroll again
 *   (`preventScroll`), guarded against re-entering the handler.
 *
 * Returns the "snap in progress" ref — `true` during the refresh + refocus
 * dance — so consumers can ignore the transient blur in their own focusout
 * listeners.
 */
export function useDeckFocusSnap({
  hash,
  pinId,
  landedTime,
  rootRef,
  cardRefs,
  enabled,
  onKeyboardFocus,
}: DeckFocusSnapOptions): React.RefObject<boolean> {
  // Pending keyboard-focus target, consumed per resolve: nav jumps (nothing
  // pending) land at the first card's settle point; a focus snap retargets
  // the same resolver at the focused card's own.
  const focusSnapCard = useRef<number | null>(null);
  useScrollAnchor(
    hash,
    () => {
      const st = ScrollTrigger.getById(pinId);
      const total = st?.animation?.duration() ?? 0;
      if (!st || total <= 0) return null;
      const card = focusSnapCard.current ?? 0;
      focusSnapCard.current = null;
      const progress = Math.min(1, landedTime(card) / total);
      return st.start + progress * (st.end - st.start);
    },
    enabled
  );

  const scrollTo = useScrollTo();
  const snapActive = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;
    const onFocusIn = (e: FocusEvent) => {
      if (snapActive.current) return; // re-entry from our own refocus
      const el = e.target as HTMLElement | null;
      if (!el?.matches(":focus-visible")) return;
      const card = el.closest("article");
      const idx = cardRefs.current.findIndex((c) => c && c === card);
      if (idx < 0) return;
      onKeyboardFocus?.(card as HTMLElement, idx);
      focusSnapCard.current = idx;
      scrollTo(hash, { immediate: true });
      const st = ScrollTrigger.getById(pinId);
      if (st) {
        snapActive.current = true;
        st.refresh();
        if (document.activeElement !== el) el.focus({ preventScroll: true });
        snapActive.current = false;
      }
    };
    root.addEventListener("focusin", onFocusIn);
    return () => root.removeEventListener("focusin", onFocusIn);
  }, [enabled, hash, pinId, rootRef, cardRefs, scrollTo, onKeyboardFocus]);

  return snapActive;
}
