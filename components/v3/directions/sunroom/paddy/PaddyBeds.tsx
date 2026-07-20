"use client";

import { useRef } from "react";
import { skills } from "@/content/skills";
import { SUNROOM } from "../tokens";
import { WATER_FILL, WATER_SURFACE, SPRAY_FILL, RIPPLE_STROKE } from "./constants";
import { dur, EASE } from "@/components/v3/motion/motion";
import { gsap, useGSAP } from "@/components/v3/motion/gsap";
import { stickers } from "../stickers";
import { usePaddyInteractions } from "./interactions";

/** One shower stream: a fromTo pair (horizontal throw + gravity fall) landing
 *  inside bed 1. Split out to keep spawnShower's nesting shallow. */
function throwSpray(drop: HTMLElement, fx: number, fy: number, landY: number, i: number) {
  const throwX = -(50 + i * 4); // outer streams fly further, all landing inside bed 1
  const delay = i * 0.07;
  const fall = 0.5;
  gsap.fromTo(
    drop,
    { x: fx + (i % 3) * 3, y: fy + i * 2, autoAlpha: 0 },
    {
      x: fx + (i % 3) * 3 + throwX,
      duration: fall,
      ease: "none",
      delay,
      repeat: 1,
      repeatDelay: 0.08,
      onStart: () => gsap.set(drop, { autoAlpha: 0.95 }),
      onComplete: () => gsap.set(drop, { autoAlpha: 0 }),
    }
  );
  gsap.fromTo(
    drop,
    { y: fy + i * 2 },
    { y: landY, duration: fall, ease: "power2.in", delay, repeat: 1, repeatDelay: 0.08 }
  );
}

/** One splash ring pulsing at the waterline where a stream lands.
 *  repeat: 1 (not 2) — with yoyo:true this returns to autoAlpha 0 on the
 *  final leg. repeat:2 would end the pulse visible at 0.8, which violates
 *  "every spray/splash element ends at opacity 0". */
function pulseSplash(splash: HTMLElement, fx: number, landY: number, i: number) {
  gsap.fromTo(
    splash,
    { x: fx - 62 + i * 14, y: landY - 4, scale: 0.4, autoAlpha: 0 },
    {
      scale: 1.5,
      autoAlpha: 0.8,
      duration: 0.35,
      delay: 0.45 + i * 0.18,
      repeat: 1,
      repeatDelay: 0.15,
      yoyo: true,
      ease: "power1.out",
    }
  );
}

/**
 * The rice-paddy skills beds (spec §§1-3). Four connected terraces, one per
 * skill group: coral tag column + wrapping ink pills over a (for now dormant)
 * water layer. Spillways sit between beds, alternating right/left/right so the
 * Task-2 cascade can snake down the terraces. Beds are real lists for AT; every
 * water/spill layer is aria-hidden decoration.
 */
export function PaddyBeds() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const can = canRef.current;
      if (!root || !can) return;

      const waters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-water]"));
      const spills = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-spill]"));
      const beds = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-bed]"));
      const chipsPerBed = beds.map((bed) =>
        gsap.utils.toArray<HTMLElement>(bed.querySelectorAll("[data-chip]"))
      );
      const tags = beds.map((bed) => bed.querySelector<HTMLElement>("[data-tag]"));

      // Reduced motion: final state, zero animation (spec §6). No spray is
      // ever built — the shower's spans simply stay at their initial opacity-0.
      if (dur() === 0) {
        gsap.set(waters, { scaleY: 1 });
        return;
      }

      // Pre-entrance states. Chips exist in server HTML (SEO) and are hidden
      // only now, at hydration — same convention as the direction's reveals.
      gsap.set(chipsPerBed.flat(), { scale: 0, transformOrigin: "50% 100%" });
      gsap.set(tags, { scale: 0, transformOrigin: "50% 100%" });
      // Can lives at bed 1's RIGHT end (clear of the section header on the
      // left); it slides in from beyond the right edge, spout pointing inward.
      gsap.set(can, { x: 90, transformOrigin: "70% 60%" });

      // Builds the parabolic shower lazily, once the can is already tilted —
      // the sprinkler face's world position (and bed 1's landing line) can
      // only be measured after the tilt tween has actually applied.
      function spawnShower() {
        const tip = root!.querySelector<HTMLElement>("[data-spout-tip]");
        const bed1 = root!.querySelector<HTMLElement>("[data-bed]");
        if (!tip || !bed1) return;
        const rootRect = root!.getBoundingClientRect();
        const tipRect = tip.getBoundingClientRect(); // world position, tilt included
        const bedRect = bed1.getBoundingClientRect();
        const fx = tipRect.left - rootRect.left;
        const fy = tipRect.top - rootRect.top;
        const landY = bedRect.top - rootRect.top + 10; // just past bed 1's rim, water rises to meet it

        const dropsEls = gsap.utils.toArray<HTMLElement>(root!.querySelectorAll("[data-spray]"));
        const splashes = gsap.utils.toArray<HTMLElement>(root!.querySelectorAll("[data-splash]"));

        dropsEls.forEach((drop, i) => throwSpray(drop, fx, fy, landY, i));
        splashes.forEach((splash, i) => pulseSplash(splash, fx, landY, i));
      }

      const buildSpray = contextSafe ? contextSafe(spawnShower) : spawnShower;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
        defaults: { ease: EASE.inOut },
      });

      // The can enters, tilts, and pours — bed 1 only (spec §3). The shower is
      // built once the tilt has fully landed at -38deg, so the sprinkler
      // face's measured position matches where it's actually drawn.
      tl.to(can, { autoAlpha: 1, x: 0, duration: 0.5, ease: EASE.out })
        .to(can, { rotate: -38, duration: 0.25 }, ">-0.05")
        .addLabel("pour")
        .call(buildSpray, undefined, "pour+=0.15");

      // Bed 1 floods as the shower lands; its pills sprout with the fill.
      tl.addLabel("bed0", "pour+=0.55")
        .to(waters[0], { scaleY: 1, duration: 0.9, ease: "power1.inOut" }, "bed0")
        .to(tags[0], { scale: 1, duration: 0.4, ease: EASE.pop }, "bed0+=0.1")
        .to(
          chipsPerBed[0],
          { scale: 1, duration: 0.5, ease: EASE.pop, stagger: 0.06 },
          "bed0+=0.2"
        )
        // Can exits only once the whole shower (spray + splash rings) has
        // finished settling — ~1.8s after "pour" — plus slack.
        .to(can, { rotate: 0, duration: 0.2 }, "pour+=2.0")
        .to(can, { x: 90, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, ">");

      // Connected terraces: spillway N-1 opens, bed N floods, pills sprout.
      for (let i = 1; i < waters.length; i++) {
        const at = `bed0+=${0.85 * i}`;
        tl.addLabel(`bed${i}`, at)
          .to(spills[i - 1], { scaleY: 1, duration: 0.18, ease: "power1.in" }, `bed${i}`)
          .to(waters[i], { scaleY: 1, duration: 0.8, ease: "power1.inOut" }, `bed${i}+=0.12`)
          .to(tags[i], { scale: 1, duration: 0.4, ease: EASE.pop }, `bed${i}+=0.2`)
          .to(
            chipsPerBed[i],
            { scale: 1, duration: 0.5, ease: EASE.pop, stagger: 0.06 },
            `bed${i}+=0.3`
          )
          .to(spills[i - 1], { autoAlpha: 0, duration: 0.25 }, `bed${i}+=1.05`);
      }
    },
    { scope: rootRef }
  );

  usePaddyInteractions(rootRef);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto mt-12 w-full max-w-5xl px-6 sm:mt-16"
    >
      <div
        ref={canRef}
        aria-hidden
        className="pointer-events-none absolute -top-14 right-8 z-20 opacity-0 sm:right-14"
      >
        <stickers.wateringCan size={72} />
        {/* ⚠️ STANDING CAVEAT: this marker sits at the sprinkler FACE of the
            WateringCan SVG (face center 6.8/58 ≈ 11.7% x, 13.7/42 ≈ 32.6% y of
            its viewBox) and the shower's throw distances were tuned so streams
            land inside bed 1 from the can's current position. If the can's
            artwork, size, position, or the bed geometry ever changes,
            re-verify the spray registration in the browser (streams must leave
            the sprinkler face and land inside bed 1). */}
        <span
          data-spout-tip
          aria-hidden
          className="absolute"
          style={{ left: "11.7%", top: "32.6%", width: 1, height: 1 }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={`spray-${i}`}
            data-spray
            className="absolute w-1 h-2 rounded-full opacity-0"
            style={{ background: SPRAY_FILL }}
          />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={`splash-${i}`}
            data-splash
            className="absolute h-3 w-3 rounded-full opacity-0"
            style={{ border: `2px solid ${RIPPLE_STROKE}` }}
          />
        ))}
      </div>
      <ul role="list" className="m-0 list-none space-y-3.5 p-0 sm:space-y-4">
        {skills.map((group, i) => (
          <li key={group.category} data-bedwrap className="relative">
            {i > 0 && (
              <span
                data-spill
                aria-hidden
                className="absolute -top-3.5 z-0 h-[15px] w-2.5 origin-top rounded-b-md"
                style={{
                  background: WATER_FILL,
                  transform: "scaleY(0)",
                  ...(i % 2 === 1 ? { right: 40 } : { left: 40 }),
                }}
              />
            )}
            <div
              data-bed
              className="relative overflow-hidden rounded-2xl border-2 px-4 py-3.5 sm:px-5 sm:py-4"
              style={{
                borderColor: "rgba(23,66,31,0.18)",
                background: "rgba(23,66,31,0.05)",
              }}
            >
              <div
                data-water
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-full origin-bottom"
                style={{ background: WATER_FILL, transform: "scaleY(0)" }}
              >
                <span
                  data-surface
                  className="absolute inset-x-0 top-0 block h-[3px] origin-top"
                  style={{ background: WATER_SURFACE }}
                />
              </div>
              <div className="relative z-10 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-4">
                <div className="shrink-0 sm:w-44 sm:pt-0.5">
                  <span
                    data-tag
                    id={`paddy-tag-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em]"
                    style={{ background: SUNROOM.accent, color: SUNROOM.paper }}
                  >
                    {group.category.toLowerCase()}
                  </span>
                </div>
                <ul
                  role="list"
                  aria-labelledby={`paddy-tag-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="m-0 flex list-none flex-wrap items-center gap-2 p-0 sm:gap-2.5"
                >
                  {group.items.map((item) => (
                    <li
                      key={item}
                      data-chip
                      className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold sm:text-base"
                      style={{ background: SUNROOM.ink, color: SUNROOM.paper }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
