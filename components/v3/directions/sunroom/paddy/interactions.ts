"use client";

import { dur, EASE } from "@/components/v3/motion/motion";
import { gsap, useGSAP } from "@/components/v3/motion/gsap";
import { RIPPLE_STROKE } from "./constants";

/**
 * The paddy's only motion at rest is *caused* motion (spec §4): hovering or
 * tapping any pill — skill chip or coral category tag — lifts it and spawns
 * ripple rings in its bed; the water itself stays still. Reduced motion:
 * ripples become a static ring fade (opacity only).
 *
 * Rings are plain DOM in a per-bed pool of 3 (never React state — purely
 * decorative, aria-hidden). All listeners are delegated on the root.
 */
export function usePaddyInteractions(
  rootRef: React.RefObject<HTMLDivElement | null>
) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduced = dur() === 0;

      // --- ripple ring pool -------------------------------------------------
      const pools = new Map<HTMLElement, { rings: HTMLSpanElement[]; i: number }>();
      const acquire = (bed: HTMLElement) => {
        let pool = pools.get(bed);
        if (!pool) {
          pool = { rings: [], i: 0 };
          for (let k = 0; k < 3; k++) {
            const ring = document.createElement("span");
            ring.setAttribute("aria-hidden", "true");
            ring.style.cssText = `position:absolute;z-index:5;border-radius:999px;pointer-events:none;opacity:0;border:2px solid ${RIPPLE_STROKE}`;
            bed.appendChild(ring);
            pool.rings.push(ring);
          }
          pools.set(bed, pool);
        }
        const ring = pool.rings[pool.i % pool.rings.length];
        pool.i++;
        gsap.killTweensOf(ring);
        return ring;
      };

      const spawnRipple = (chip: HTMLElement) => {
        const bed = chip.closest<HTMLElement>("[data-bed]");
        if (!bed) return;
        const b = bed.getBoundingClientRect();
        const c = chip.getBoundingClientRect();
        const ring = acquire(bed);
        gsap.set(ring, {
          left: c.left - b.left - 3,
          top: c.top - b.top - 3,
          width: c.width + 6,
          height: c.height + 6,
          autoAlpha: 0.85,
          scale: 1,
        });
        if (reduced) {
          gsap.to(ring, { autoAlpha: 0, duration: 0.6, ease: "power1.out" });
          return;
        }
        gsap.to(ring, { scale: 1.65, autoAlpha: 0, duration: 1, ease: "power1.out" });
      };

      // --- delegated pointer handling --------------------------------------
      // Skill chips and the coral category tags get the same treatment.
      const pillOf = (e: Event) =>
        (e.target as HTMLElement).closest<HTMLElement>("[data-chip], [data-tag]");

      const onOver = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const pill = pillOf(e);
        if (!pill) return;
        if (!reduced) gsap.to(pill, { y: -2, duration: 0.18, ease: EASE.out });
        spawnRipple(pill);
      };
      const onOut = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || reduced) return;
        const pill = pillOf(e);
        if (pill) gsap.to(pill, { y: 0, duration: 0.25, ease: EASE.out });
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return; // touch/pen tap only
        const pill = pillOf(e);
        if (pill) spawnRipple(pill);
      };

      root.addEventListener("pointerover", onOver);
      root.addEventListener("pointerout", onOut);
      root.addEventListener("pointerdown", onDown);

      return () => {
        root.removeEventListener("pointerover", onOver);
        root.removeEventListener("pointerout", onOut);
        root.removeEventListener("pointerdown", onDown);
        pools.forEach((p) => p.rings.forEach((r) => r.remove()));
      };
    },
    { scope: rootRef }
  );
}
