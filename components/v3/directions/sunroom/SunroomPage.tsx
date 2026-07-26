"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/v3/motion/SmoothScroll";
import { FieldSweepRoot, Field } from "@/components/v3/motion/FieldSweep";
import { Preloader } from "@/components/v3/motion/Preloader";
import { CursorDot } from "@/components/v3/motion/Magnetic";
import { DeferredSection } from "@/components/v3/motion/DeferredSection";
import { v3Copy } from "@/content/v3";
import { SUNROOM } from "./tokens";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";

/*
 * Below-fold sections are code-split and hydration-deferred (see
 * DeferredSection for the trigger rules). Each `load` thunk resolves the
 * section's REAL component for the wrapper to mount directly; the `dynamic()`
 * twins exist only to server-render the same modules into the document HTML
 * (the wrapper never renders them on the client — see the React.lazy
 * suspension note in DeferredSection). Both paths share one module-cache
 * entry. Hero and About stay in the main chunk: Hero is the LCP path, and
 * About is the first thing a scrolling visitor reaches, so deferring it would
 * maximize re-hide exposure for minimal savings.
 */
const loadProjects = () => import("./sections/Projects").then((m) => m.Projects);
const loadJourney = () => import("./sections/Journey").then((m) => m.Journey);
const loadSkills = () => import("./sections/Skills").then((m) => m.Skills);
const loadAchievements = () =>
  import("./sections/Achievements").then((m) => m.Achievements);
const loadContact = () => import("./sections/Contact").then((m) => m.Contact);
const Projects = dynamic(() => loadProjects().then((C) => ({ default: C })));
const Journey = dynamic(() => loadJourney().then((C) => ({ default: C })));
const Skills = dynamic(() => loadSkills().then((C) => ({ default: C })));
const Achievements = dynamic(() => loadAchievements().then((C) => ({ default: C })));
const Contact = dynamic(() => loadContact().then((C) => ({ default: C })));

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
            <DeferredSection load={loadProjects} hash="#projects">
              <Projects />
            </DeferredSection>
          </Field>

          <Field color={SUNROOM.fields.experience} id="experience">
            <DeferredSection load={loadJourney} hash="#experience">
              <Journey />
            </DeferredSection>
          </Field>

          <Field color={SUNROOM.fields.skills} id="skills">
            <DeferredSection load={loadSkills} hash="#skills">
              <Skills />
            </DeferredSection>
          </Field>

          <Field color={SUNROOM.fields.achievements} id="achievements">
            <DeferredSection load={loadAchievements} hash="#achievements">
              <Achievements />
            </DeferredSection>
          </Field>

          <Field color={SUNROOM.fields.contact} id="contact">
            <DeferredSection load={loadContact} hash="#contact">
              <Contact />
            </DeferredSection>
          </Field>
        </main>
      </FieldSweepRoot>
    </SmoothScroll>
  );
}
