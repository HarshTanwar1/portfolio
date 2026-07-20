"use client";

import { useRef } from "react";
import { dur } from "./motion";
import { gsap, useGSAP } from "./gsap";

export type StickerItem = {
  /** The sticker artwork (inline SVG / element). */
  node: React.ReactNode;
  /** Horizontal anchor as a percentage of the field width. */
  x: number;
  /** Vertical anchor as a percentage of the field height. */
  y: number;
  /** Sticker width in px (height follows the artwork's aspect ratio). */
  size: number;
  /** Parallax/mouse-follow multiplier (default `0`, i.e. pinned). */
  drift?: number;
};

/**
 * Decorative sticker layer. Fills its nearest positioned ancestor (make the
 * enclosing section `relative`) and pins each sticker at `x%,y%`. On scroll the
 * stickers parallax vertically (`±drift*20px`, scrubbed) and on desktop they
 * lean toward the cursor (`±drift*8px`). Always `aria-hidden` and
 * `pointer-events: none` — purely visual. Under reduced motion both effects are
 * off and the stickers sit at their anchors.
 *
 * Each sticker nests three elements so the transforms never collide: the anchor
 * (static `left/top`), the parallax layer (scroll-driven `y`), and the follow
 * layer (cursor-driven `x/y`).
 */
export function StickerField({
  items,
}: Readonly<{ items: StickerItem[] }>) {
  const ref = useRef<HTMLDivElement>(null);

  // The effect re-runs on CONTENT changes, not reference changes: a consumer
  // passing an inline `items` array creates a fresh reference every parent
  // render, and keying the effect on it would tear down and recreate every
  // parallax tween/ScrollTrigger each time for an identical result. The
  // signature captures everything the effect actually reads (count, per-item
  // drift; x/y/size for completeness) — `node` is deliberately excluded, React
  // reconciles the artwork on its own and the tweens target the wrapper spans.
  const signature = items
    .map((it) => `${it.x},${it.y},${it.size},${it.drift ?? 0}`)
    .join("|");

  useGSAP(
    () => {
      if (dur() === 0) return; // reduced motion: no parallax, no follow.
      const root = ref.current;
      if (!root) return;

      // Scroll parallax — one scrubbed tween per drifting sticker.
      gsap.utils
        .toArray<HTMLElement>(root.querySelectorAll("[data-sticker-parallax]"))
        .forEach((el) => {
          const drift = Number(el.dataset.drift) || 0;
          if (!drift) return;
          gsap.fromTo(
            el,
            { y: -drift * 20 },
            {
              y: drift * 20,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

      // Mouse-follow — desktop (fine pointer) only.
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const followers = gsap.utils
        .toArray<HTMLElement>(root.querySelectorAll("[data-sticker-follow]"))
        .map((el) => ({
          drift: Number(el.dataset.drift) || 0,
          setX: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
          setY: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
        }));

      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1; // [-1, 1]
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        followers.forEach((f) => {
          f.setX(nx * f.drift * 8);
          f.setY(ny * f.drift * 8);
        });
      };

      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref, dependencies: [signature] }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            width: it.size,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            data-sticker-parallax
            data-drift={it.drift ?? 0}
            className="block will-change-transform"
          >
            <span
              data-sticker-follow
              data-drift={it.drift ?? 0}
              className="block will-change-transform"
            >
              {it.node}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
