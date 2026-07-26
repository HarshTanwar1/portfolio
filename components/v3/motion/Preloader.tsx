"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dur, EASE } from "./motion";
import { gsap, useGSAP } from "./gsap";

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
 * The show/skip decision runs in a layout effect (before paint) so no hero
 * content flashes underneath before the curtain covers it.
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

  // Decide before paint whether the curtain plays at all.
  useIsoLayoutEffect(() => {
    let done = false;
    try {
      done = sessionStorage.getItem(storageKey) === "1";
    } catch {
      // sessionStorage unavailable (private mode) — treat as not-yet-played.
    }
    // Deep-link arrivals skip the intro: a visitor following a section hash
    // asked for that content, not the curtain (which would sandwich the
    // already-visible section between two reveals). The session ticket is NOT
    // stamped, so a later hash-less visit this session still gets the intro.
    const hashArrival = window.location.hash !== "";
    if (dur() === 0 || done || hashArrival) {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone?.();
      }
      return;
    }
    setShow(true);
    // onDone / dur are stable enough for a play-once decision; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chars = Array.from(word);

  useGSAP(
    () => {
      if (!show) return;
      const overlay = overlayRef.current;
      const counter = counterRef.current;
      if (!overlay || !counter) return;

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
