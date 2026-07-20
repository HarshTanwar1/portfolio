"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { dur } from "./motion";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

/** Marks the wrapper element that carries the `--field` CSS variable. */
const ROOT_ATTR = "data-field-root";
/** Marks each section and stores its target field color. */
const FIELD_ATTR = "data-field-color";

/** Field color in effect above the first `<Field>` (the sweep's origin). */
const FieldSweepContext = createContext<string>("transparent");

/**
 * Full-viewport background whose color is driven by the `--field` CSS variable
 * and morphed between sections by the `<Field>` children. The variable lives on
 * this wrapper; the fixed layer inherits it.
 */
export function FieldSweepRoot({
  defaultColor,
  children,
}: Readonly<{
  defaultColor: string;
  children: React.ReactNode;
}>) {
  // Mirror the field color onto <body> so regions the fixed layer can't cover
  // (mobile browser-chrome collapse, overscroll rubber-banding) paint in the
  // current field color instead of the paper canvas. BODY, never <html>: with
  // <html> un-backgrounded, body's background is promoted to the document
  // canvas and paints BELOW the -z-10 field layer — the layer's visibility
  // depends on that promotion. A background on <html> cancels it and body's
  // paint order then covers the layer (the everything-went-paper incident).
  // `setField` in <Field> keeps it in sync on every sweep; restored on unmount.
  useEffect(() => {
    document.body.style.backgroundColor = defaultColor;
    return () => {
      document.body.style.removeProperty("background-color");
    };
  }, [defaultColor]);

  return (
    <FieldSweepContext.Provider value={defaultColor}>
      <div
        {...{ [ROOT_ATTR]: "" }}
        style={{ "--field": defaultColor } as React.CSSProperties}
      >
        {/* h-screen (100vh) is the fallback; the inline 100lvh wins where
            supported and sizes the layer to the LARGE viewport, so the strip
            Chrome/Brave reveal while their UI collapses is always covered
            (inset-0's bottom edge tracked the small layout viewport). */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-screen"
          style={{ background: "var(--field)", height: "100lvh" }}
        />
        {children}
      </div>
    </FieldSweepContext.Provider>
  );
}

/**
 * A section that, on scroll, sweeps the shared `--field` background from the
 * previous section's color to its own. With motion enabled it scrubs the
 * interpolation across the scroll range; under reduced motion it snaps the
 * color once the section reaches the middle of the viewport.
 */
export function Field({
  color,
  id,
  children,
}: Readonly<{
  color: string;
  id?: string;
  children: React.ReactNode;
}>) {
  const defaultColor = useContext(FieldSweepContext);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      // Resolve the wrapper from the DOM (fully committed before this layout
      // effect runs) — an ancestor ref would not yet be attached here.
      const root = el?.closest<HTMLElement>(`[${ROOT_ATTR}]`);
      if (!el || !root) return;

      // Sweep FROM the color of the field immediately above this one in the
      // DOM (order-independent, so StrictMode remounts stay correct).
      const fields = Array.from(
        root.querySelectorAll<HTMLElement>(`[${FIELD_ATTR}]`)
      );
      const idx = fields.indexOf(el);
      const fromColor =
        idx > 0
          ? fields[idx - 1].getAttribute(FIELD_ATTR) ?? color
          : defaultColor;

      const setField = (c: string) => {
        root.style.setProperty("--field", c);
        // Keep <body> in lockstep — see the FieldSweepRoot mirror comment.
        document.body.style.backgroundColor = c;
      };

      if (dur() === 0) {
        // Reduced motion: snap (no scrub) as the section crosses mid-viewport.
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          onEnter: () => setField(color),
          onLeaveBack: () => setField(fromColor),
        });
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "top 20%",
        scrub: true,
        onUpdate: (self) =>
          setField(gsap.utils.interpolate(fromColor, color, self.progress)),
      });
    },
    { scope: sectionRef, dependencies: [color] }
  );

  return (
    <section ref={sectionRef} id={id} {...{ [FIELD_ATTR]: color }}>
      {children}
    </section>
  );
}
