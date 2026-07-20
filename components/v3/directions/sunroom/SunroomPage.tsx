"use client";

import { useCallback, useState } from "react";
import { SmoothScroll } from "@/components/v3/motion/SmoothScroll";
import { FieldSweepRoot, Field } from "@/components/v3/motion/FieldSweep";
import { Preloader } from "@/components/v3/motion/Preloader";
import { CursorDot } from "@/components/v3/motion/Magnetic";
import { v3Copy } from "@/content/v3";
import { SUNROOM } from "./tokens";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Projects } from "./sections/Projects";
import { Journey } from "./sections/Journey";
import { Skills } from "./sections/Skills";
import { Achievements } from "./sections/Achievements";
import { Contact } from "./sections/Contact";

/**
 * Per-session "preloader already played" flag for this page. Exported so
 * the matching `<PreloaderReset>` keys off the SAME string (a rename can't
 * desync the two). Used below on `<Preloader>`.
 */
export const SUNROOM_PRELOADER_KEY = "v3-preloader-done:sunroom";

/**
 * Sunroom page composer. Wires the shared motion core
 * (SmoothScroll → FieldSweepRoot → Preloader / CursorDot / Nav / Fields) around
 * the Sunroom sections.
 *
 * The critical sequencing: the preloader curtain (same leaf green as the hero
 * field) plays over an empty hero, then its `onDone` flips `ready`, which mounts
 * the hero's split-char reveal — so the name assembles *after* the curtain
 * lifts, never beneath it. Under reduced motion the preloader skips and calls
 * `onDone` immediately, so `ready` is true on the first paint and the hero is
 * simply present.
 *
 * The wrapper carries the display font as its default so the preloader word
 * inherits Baloo 2; each section sets the body font on its own content.
 */
export function SunroomPage() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <SmoothScroll>
      <FieldSweepRoot defaultColor={SUNROOM.fields.hero}>
        <main
          className="min-h-screen"
          style={{
            color: SUNROOM.ink,
            fontFamily: "var(--font-display)",
          }}
        >
          <Preloader
            word={v3Copy.sunroom.preloaderWord}
            onDone={onDone}
            storageKey={SUNROOM_PRELOADER_KEY}
          />
          <CursorDot />
          <Nav />

          <Field color={SUNROOM.fields.hero} id="hero">
            <Hero ready={ready} />
          </Field>

          <Field color={SUNROOM.fields.about} id="about">
            <About />
          </Field>

          <Field color={SUNROOM.fields.projects} id="projects">
            <Projects />
          </Field>

          <Field color={SUNROOM.fields.experience} id="experience">
            <Journey />
          </Field>

          <Field color={SUNROOM.fields.skills} id="skills">
            <Skills />
          </Field>

          <Field color={SUNROOM.fields.achievements} id="achievements">
            <Achievements />
          </Field>

          <Field color={SUNROOM.fields.contact} id="contact">
            <Contact />
          </Field>
        </main>
      </FieldSweepRoot>
    </SmoothScroll>
  );
}
