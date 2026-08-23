"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dur, EASE } from "./motion";
import { gsap, useGSAP } from "./gsap";
import { PRELOADER_VEIL_ID, preloaderSkip } from "./preloaderSkip";

/** Default session key marking the preloader as already played this session. */
const DEFAULT_DONE_KEY = "v3-preloader-done";

/** `useLayoutEffect` on the client, `useEffect` on the server (SSR-safe). */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type PreloaderProps = {
  /** Word split into rising characters while the fake progress counts up. */
  word: string;
  /** Fired once the curtain has lifted (also fires immediately when skipped). */
  onDone?: () => void;
  /**
   * Session-storage key for the "already played" flag. Defaults to
   * `"v3-preloader-done"`; callers may pass a distinct key to scope the
   * once-per-session curtain.
   */
  storageKey?: string;
};

/**
 * Full-viewport intro curtain, colored by the shared `--field` variable.
 *
 * Plays once per session: the split characters of `word` rise into place while
 * a fake-but-fast progress counter runs 0→100 (~1.2s), then the curtain slides
 * up (`yPercent: -100`) revealing the hero, whose own split-reveal takes over.
 * It stamps `sessionStorage["v3-preloader-done"]` and renders nothing on any
 * later mount, and renders nothing at all under reduced motion — in both skip
 * cases `onDone` still fires so the hero can start on its own.
 *
 * The show/skip decision runs in a layout effect (before paint) via the shared
 * `preloaderSkip` predicate. That covers every paint AFTER hydration; the
 * pre-hydration window is covered by the sunroom first-paint veil (see the
 * veil block in `SunroomPage` + `preloaderSkip.ts`), which this component
 * removes as soon as it takes over — curtain mounting or skip, either way.
 */
export function Preloader({
  word,
  onDone,
  storageKey = DEFAULT_DONE_KEY,
}: Readonly<PreloaderProps>) {
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const firedRef = useRef(false);

  // Decide before paint whether the curtain plays at all. The rules (played
  // this session / #hash deep link / reduced motion) live in `preloaderSkip`,
  // the SAME function the sunroom veil's parse-time script embeds — see
  // preloaderSkip.ts for why the two can't drift.
  useIsoLayoutEffect(() => {
    if (preloaderSkip(storageKey)) {
      // Belt: on skip paths the parse-time script already removed the veil;
      // repeat here so the two deciders can never leave it stranded.
      document.getElementById(PRELOADER_VEIL_ID)?.remove();
      if (!firedRef.current) {
        firedRef.current = true;
        onDone?.();
      }
      return;
    }
    setShow(true);
    // onDone / storageKey are stable enough for a play-once decision; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chars = Array.from(word);

  useGSAP(
    () => {
      if (!show) return;
      const overlay = overlayRef.current;
      const counter = counterRef.current;
      if (!overlay || !counter) return;

      // The curtain (same field color) is in the DOM above the veil in this
      // same pre-paint frame — drop the veil so exactly one cover exists.
      document.getElementById(PRELOADER_VEIL_ID)?.remove();

      const finish = () => {
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {
          // ignore — the curtain still lifts, it just replays next session.
        }
        // Neutralize the (now off-screen) overlay, then unmount on the next
        // frame so the inert/aria-hidden state actually lands in the DOM.
        overlay.setAttribute("inert", "");
        overlay.setAttribute("aria-hidden", "true");
        if (!firedRef.current) {
          firedRef.current = true;
          onDone?.();
        }
        requestAnimationFrame(() => setShow(false));
      };

      const progress = { value: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.from("[data-pl-char]", {
        yPercent: 110,
        duration: dur(0.6),
        ease: EASE.out,
        stagger: 0.04,
      });
      tl.to(
        progress,
        {
          value: 100,
          duration: dur(1.2),
          ease: "none",
          onUpdate: () => {
            const v = Math.round(progress.value);
            counter.textContent = `${v}%`;
            overlay.setAttribute("aria-valuenow", String(v));
          },
        },
        0.1
      );
      tl.to(overlay, {
        yPercent: -100,
        duration: dur(0.7),
        ease: EASE.inOut,
      });
    },
    { scope: overlayRef, dependencies: [show] }
  );

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      role="progressbar"
      aria-label={`Loading ${word}`}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--field, currentColor)" }}
    >
      <div ref={wordRef} className="flex overflow-hidden" aria-hidden>
        {chars.map((c, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              data-pl-char
              className="inline-block will-change-transform"
              style={{ fontSize: "clamp(2.5rem, 12vw, 8rem)", fontWeight: 800 }}
            >
              {c === " " ? " " : c}
            </span>
          </span>
        ))}
      </div>
      <span
        ref={counterRef}
        aria-hidden
        className="text-lg font-semibold tabular-nums opacity-70"
      >
        0%
      </span>
    </div>
  );
}
