"use client";

import { useEffect, useRef, useState } from "react";
import { dur, EASE, isCoarsePointer } from "./motion";
import { gsap, useGSAP } from "./gsap";

/**
 * Shared listener fan-out for every mounted `<Magnetic>`. A page renders ~19 of
 * them on `/`; a handful of window listeners dispatching to a subscriber
 * registry is far cheaper than ~19 independent sets, and behaves identically —
 * each subscriber is an isolated closure with its own bounds/spring state. The
 * listeners attach lazily when the first subscriber arrives and detach at zero,
 * so a page with no Magnetics (or all on a coarse pointer) holds none.
 *
 * Beyond `pointermove` (the drift), the fan-out also broadcasts a `reset` on
 * two events that move an element out from under a STATIONARY pointer without
 * emitting any `pointermove` — so the drift would otherwise stick:
 *   - `scroll`  — a jumped-to / scrolled-past CTA freezes mid-drift (the pill
 *     scrolls away, no pointermove fires, `pointerout` never comes). Lenis
 *     drives real window scroll, so this also covers smooth nav jumps.
 *   - `pointerout` off the window — the cursor leaves the page entirely; no
 *     in-document pointermove can spring it home.
 * `reset` is a no-op on any subscriber that isn't currently drifted, so normal
 * hover behavior is completely unchanged.
 *
 * The scroll reset is additionally BOUNDS-CHECKED against the last known
 * pointer position: `position: fixed` pills (the nav) don't move on scroll, so
 * a pointer hovering one is still in range after the event — springing home
 * would just snap-and-re-engage (visible flutter on momentum scroll). Only the
 * window-leave reset is unconditional; there the pointer is gone for certain.
 */
type MagneticSubscriber = {
  onMove: (e: PointerEvent) => void;
  /** `force` skips the bounds check (pointer known to have left the window). */
  reset: (force: boolean) => void;
};
const magneticSubscribers = new Set<MagneticSubscriber>();

/** Last pointer position seen by the fan-out — consulted by scroll resets. */
let lastPointer: { x: number; y: number } | null = null;

function dispatchMagneticMove(e: PointerEvent) {
  lastPointer = { x: e.clientX, y: e.clientY };
  magneticSubscribers.forEach((s) => s.onMove(e));
}

function handleWindowScroll() {
  magneticSubscribers.forEach((s) => s.reset(false));
}

// Only when the pointer leaves the window entirely (no element it moved to).
function handleWindowPointerOut(e: PointerEvent) {
  if (!e.relatedTarget) {
    lastPointer = null;
    magneticSubscribers.forEach((s) => s.reset(true));
  }
}

function subscribeMagnetic(sub: MagneticSubscriber): () => void {
  const wasEmpty = magneticSubscribers.size === 0;
  magneticSubscribers.add(sub);
  if (wasEmpty) {
    window.addEventListener("pointermove", dispatchMagneticMove);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("pointerout", handleWindowPointerOut);
  }
  return () => {
    magneticSubscribers.delete(sub);
    if (magneticSubscribers.size === 0) {
      window.removeEventListener("pointermove", dispatchMagneticMove);
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("pointerout", handleWindowPointerOut);
    }
  };
}

type MagneticProps = {
  /** Fraction of the cursor offset the child follows (default `0.3`). */
  strength?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Wraps a child (a pill / CTA) so it drifts toward the cursor while the pointer
 * is within 1.5× the element's bounds, then springs back with an elastic ease
 * on leave. No-op under reduced motion or a coarse pointer — the child simply
 * renders in place with no listeners attached.
 */
export function Magnetic({
  strength = 0.3,
  className,
  children,
}: Readonly<MagneticProps>) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (dur() === 0 || isCoarsePointer()) return;
      const el = ref.current;
      if (!el) return;

      let active = false;
      const springHome = () => {
        active = false;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
          overwrite: true,
        });
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        // 1.5× bounds → half-extent is 0.75× the width/height.
        if (Math.abs(dx) < r.width * 0.75 && Math.abs(dy) < r.height * 0.75) {
          active = true;
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.4,
            ease: EASE.out,
            overwrite: true,
          });
        } else if (active) {
          springHome();
        }
      };
      // Spring home when the element can no longer be "under" the pointer but
      // no qualifying pointermove will arrive (scroll, pointer left the
      // window). No-op unless currently drifted, so hover is untouched.
      // Scroll resets (`force: false`) first re-check the element's CURRENT
      // bounds against the last pointer position: an in-flow CTA that scrolled
      // away fails the check and springs home (the original stuck-drift bug),
      // while a fixed nav pill still under the pointer keeps its drift — the
      // next pointermove re-syncs it exactly.
      const reset = (force: boolean) => {
        if (!active) return;
        if (!force && lastPointer) {
          const r = el.getBoundingClientRect();
          const dx = lastPointer.x - (r.left + r.width / 2);
          const dy = lastPointer.y - (r.top + r.height / 2);
          if (Math.abs(dx) < r.width * 0.75 && Math.abs(dy) < r.height * 0.75) {
            return;
          }
        }
        springHome();
      };

      return subscribeMagnetic({ onMove, reset });
    },
    { scope: ref, dependencies: [strength] }
  );

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/**
 * Custom cursor: a 12px dot that tracks the pointer tightly and a 36px ring
 * that trails it (both via `gsap.quickTo`, not per-move tweens). The ring
 * scales up while hovering anything marked `data-cursor="pointer"`. Renders
 * null on a coarse pointer or under reduced motion (the cursor is pure motion).
 */
export function CursorDot() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dur() === 0 || isCoarsePointer()) return;
    setEnabled(true);
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };
      const pointerTarget = (t: EventTarget | null) =>
        t instanceof Element ? t.closest('[data-cursor="pointer"]') : null;
      const onOver = (e: PointerEvent) => {
        if (pointerTarget(e.target)) {
          gsap.to(ring, { scale: 1.8, duration: 0.3, ease: EASE.out });
        }
      };
      const onOut = (e: PointerEvent) => {
        const from = pointerTarget(e.target);
        const to = pointerTarget(e.relatedTarget);
        if (from && from !== to) {
          gsap.to(ring, { scale: 1, duration: 0.3, ease: EASE.out });
        }
      };

      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 rounded-full border-2"
        style={{ borderColor: "currentColor" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-3 w-3 rounded-full"
        style={{ background: "currentColor" }}
      />
    </>
  );
}
