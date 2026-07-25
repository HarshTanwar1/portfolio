"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { v3Copy } from "@/content/v3";
import { SplitReveal } from "@/components/v3/motion/SplitReveal";
import { usePinnedScrub } from "@/components/v3/motion/SectionChoreo";
import { useScrollAnchor, useScrollTo } from "@/components/v3/motion/SmoothScroll";
import { Magnetic } from "@/components/v3/motion/Magnetic";
import { StickerField, type StickerItem } from "@/components/v3/motion/StickerField";
import { gsap, ScrollTrigger, useGSAP } from "@/components/v3/motion/gsap";
import { dur, EASE } from "@/components/v3/motion/motion";
import { useUniformCardHeights } from "@/components/v3/motion/useUniformCardHeights";
import { SUNROOM } from "../tokens";
import { stickers } from "../stickers";

const { projectsKicker, projectsTitle, projectLinks } = v3Copy.sunroom;
const N = projects.length;
/** Brief settled hold (timeline units) after the fifth card lands, so the
 *  tumble finishes a beat before the pin releases — reads as an intentional
 *  dock, not an abrupt cut. */
const SETTLE = 0.45;
/** ScrollTrigger id for the pin, so a nav/CTA jump can look it up at click
 *  time and land INSIDE the pin (see the scroll-anchor resolver below). */
const PIN_ID = "sunroom-projects-pin";
/** Timeline time at which the FIRST card has fully landed: card `i` tweens
 *  over `[i, i+1]`, so card 0 finishes at t=1. Landing the jump here shows the
 *  first repo card settled and centered instead of the empty pin-start. */
const FIRST_CARD_LANDED = 1;

const accentStickers: StickerItem[] = [
  { node: <stickers.sun />, x: 8, y: 18, size: 66, drift: 0.5 },
  { node: <stickers.sprig />, x: 93, y: 24, size: 60, drift: 0.7 },
  { node: <stickers.grass />, x: 12, y: 82, size: 56, drift: 0.6 },
];

/**
 * Projects — the showcase centerpiece. On desktop (≥768px, motion on) the section
 * pins for `projects.length * 40vh` and a scrubbed timeline tumbles each card up
 * from below (`y: 110vh, rotation: ±9`) settling into a fanned deck
 * (`rotation: ±2`), then holds a short `SETTLE` beat before releasing; the later
 * card lands on top, and progress dots track the current card with a coral
 * active state. When the pin engages the section "docks": the progress dots pop
 * in crisply (see the docking-cue effect), signalling an intentional, sequenced
 * lock-on. The heading itself renders statically at all times — no pre-set/tween.
 *
 * On touch (<768px) and under reduced motion there is NO pin: the exact same
 * cards render in a vertical flow (single card tree — only the layout classes
 * and the pin-ref attachment are conditional), rising in with a Choreo-style
 * stagger under motion, or simply present under reduced motion. This keeps every
 * card link in DOM order and keyboard-reachable in every mode.
 */
export function Projects() {
  // Deck mode = wide viewport AND motion enabled. Starts false to match SSR
  // (no `window`), flips in an effect — so the client never hydrates a
  // different tree, and on mobile/reduced-motion the pin never engages.
  const [isDeck, setIsDeck] = useState(false);
  // `false` until the client has read the media query. Distinguishes the
  // "mode not yet known" mount pass (where `isDeck` is a placeholder `false`)
  // from a genuine flow-mode `false`, so the flow-entrance tween below is never
  // created on the deck path — see its comment.
  const [resolved, setResolved] = useState(false);
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);
  const flowRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDeck(mq.matches && dur() !== 0);
    apply();
    setResolved(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Uniform card sizing: the deck (and the mobile flow) should read as one
  // set, so every card's min-height is set to the TALLEST card's natural
  // content height — otherwise each content-sized card renders at its own
  // height and the stack reads ragged. Card width is viewport-relative
  // (`min(90vw,600px)` in deck mode, capped by `max-w-xl` in flow mode), so
  // the mode flip (`isDeck`) is a re-measure dependency. Layout-only by
  // construction (inline `min-height`, never transforms), so the tumble
  // timeline's time-0 parks and ±2° settle rotations are never disturbed. See
  // the shared hook for the offsetHeight / fonts.ready / resize details.
  useUniformCardHeights(cardRefs, [isDeck]);

  // Pinned tumbling-deck timeline. Length is 0 (and the ref is detached) unless
  // in deck mode, so the hook builds no pin on mobile/reduced motion. Encoding
  // the mode in `lengthVh` also makes it a `useGSAP` dependency inside
  // `usePinnedScrub`: with `revertOnUpdate: true` set there, the old
  // pin/pin-spacer is reverted before the effect re-runs whenever the mode
  // flips.
  const build = (tl: gsap.core.Timeline) => {
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;
    // Seat every card in its off-screen tumble-start at time 0 with a `set` (not
    // a `fromTo` from-state): a time-0 `set` is re-applied whenever the playhead
    // is past 0, so cards whose tween hasn't run yet stay hidden below — even
    // after `invalidateOnRefresh` clears future tweens' recorded from-values.
    cards.forEach((card, i) => {
      tl.set(
        card,
        {
          xPercent: -50,
          yPercent: -50,
          y: () => window.innerHeight * 1.1,
          rotate: i % 2 ? 9 : -9,
        },
        0
      );
    });
    cards.forEach((card, i) => {
      tl.to(
        card,
        {
          y: 0,
          rotate: i % 2 ? 2 : -2,
          ease: EASE.out,
          duration: 1,
        },
        i
      );
    });
    // Trailing hold: an empty SETTLE-long beat anchored at `N` — the instant
    // the last card lands (its tween runs `N-1`→`N`) — so the finished deck
    // holds a moment before the pin releases. Total duration is `N + SETTLE`.
    tl.to({}, { duration: SETTLE }, N);
    tl.eventCallback("onUpdate", () => {
      const idx = Math.min(
        N - 1,
        Math.max(0, Math.floor(tl.progress() * tl.duration()))
      );
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    });
  };

  const pinRef = usePinnedScrub<HTMLDivElement>(build, isDeck ? N * 40 : 0, {
    id: PIN_ID,
  });

  // Nav/CTA jumps to #projects (deck mode only): land INSIDE the pin at the
  // scroll position where the first card has just settled, not at the pin's
  // empty start (progress 0, every card parked off-screen). Computed at click
  // time from the live pin trigger so it survives ScrollTrigger refreshes and
  // the pin-spacer geometry. `start`/`end` are the pin's document scroll range;
  // scrub maps timeline progress linearly across it. Returns null (→ header
  // fallback) until the trigger and its timeline exist. Not registered in flow
  // mode — there the section header anchor is correct and cards show statically.
  // A pending keyboard-focus snap (set below, consumed per resolve) retargets
  // the same resolver at that card's settle point: card i tumbles over
  // `[i, i+1]`, so it has landed at `i + FIRST_CARD_LANDED`.
  const focusSnapCard = useRef<number | null>(null);
  useScrollAnchor(
    "#projects",
    () => {
      const st = ScrollTrigger.getById(PIN_ID);
      const total = st?.animation?.duration() ?? 0;
      if (!st || total <= 0) return null;
      const card = focusSnapCard.current ?? 0;
      focusSnapCard.current = null;
      const progress = Math.min(1, (card + FIRST_CARD_LANDED) / total);
      return st.start + progress * (st.end - st.start);
    },
    isDeck
  );

  // Keyboard focus inside the pinned deck: the browser's native
  // scroll-into-view is computed from the focused link's pre-scrub rect and is
  // blind to the pin (its scroll distance advances the timeline, not the
  // page), so tabbing into the deck overshoots the entire pin — the deck lands
  // fully dealt with the focused card buried and off-screen. Correct it the
  // moment focus arrives: snap (immediate — same event turn, so the browser's
  // wrong position never paints) to the offset where the focused card has just
  // settled. Tab/Shift+Tab then step the deck through its dealt states in
  // order. Keyboard-only via :focus-visible — mouse clicks on card links keep
  // the scroll exactly where it is.
  const scrollTo = useScrollTo();
  const focusSnapActive = useRef(false);
  useEffect(() => {
    if (!isDeck) return;
    const root = flowRef.current;
    if (!root) return;
    const onFocusIn = (e: FocusEvent) => {
      if (focusSnapActive.current) return; // re-entry from our own refocus
      const el = e.target as HTMLElement | null;
      if (!el?.matches(":focus-visible")) return;
      const card = el.closest("article");
      const idx = cardRefs.current.findIndex((c) => c && c === card);
      if (idx < 0) return;
      focusSnapCard.current = idx;
      scrollTo("#projects", { immediate: true });
      // The instant multi-write scroll sequence (browser jump → snap, same
      // event turn) leaves this pin's ScrollTrigger with a stale applied
      // state — a subsequent real scroll does NOT recover it (verified), only
      // a refresh does. Instance-scoped and synchronous so it lands before
      // paint. The refresh juggles the pin-spacer DOM, which can BLUR the
      // focused link — restore focus without letting the browser scroll again
      // (`preventScroll`), guarded against re-entering this handler.
      const st = ScrollTrigger.getById(PIN_ID);
      if (st) {
        focusSnapActive.current = true;
        st.refresh();
        if (document.activeElement !== el) el.focus({ preventScroll: true });
        focusSnapActive.current = false;
      }
    };
    root.addEventListener("focusin", onFocusIn);
    return () => root.removeEventListener("focusin", onFocusIn);
  }, [isDeck, scrollTo]);

  // Flow-mode Choreo-style rise (mobile, motion on). Waits for `resolved`: the
  // tween applies `opacity: 0` immediately (immediateRender) and owns a
  // scroll-triggered reveal, so creating it during the pre-resolve mount pass —
  // when `isDeck` is a placeholder `false` — leaked a live tween into deck mode.
  // The stale trigger then faded the cards up into a finished-looking deck as the
  // section scrolled in, before the pin engaged. Gating on `resolved` means it is
  // only ever built once the mode is known, and never on the deck path. Still
  // gated by `isDeck`/reduced motion (the pin owns the cards; reduced motion
  // renders them in place). `revertOnUpdate: true` reverts this tween before
  // the effect re-runs whenever `isDeck`/`resolved` change, so a tween created
  // in flow mode can't survive a mid-session resize into deck mode.
  useGSAP(
    () => {
      if (!resolved || isDeck || dur() === 0) return;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (cards.length === 0 || !flowRef.current) return;
      // The deck's pinned timeline (`build` above) drives these same cards via
      // `xPercent`/`yPercent`/`rotate`. GSAP caches those transform components
      // per element, and `revert()` on the deck's context kills its
      // ScrollTrigger/timeline but doesn't clear that cache — so after a
      // desktop-to-mobile resize, `gsap.from()` below would read the deck's
      // last cached offset/rotation as this tween's implicit end state (its
      // `.from()` semantics animate *to* whatever the target's current/cached
      // values are). This `.set()` overwrites the cache with neutral values
      // first, so the `.from()` below has a clean end state to animate to.
      gsap.set(cards, { xPercent: 0, yPercent: 0, rotate: 0, y: 0 });
      gsap.from(cards, {
        y: 48,
        opacity: 0,
        duration: dur(0.6),
        ease: EASE.out,
        stagger: 0.1,
        scrollTrigger: { trigger: flowRef.current, start: "top 75%" },
      });
    },
    { scope: flowRef, dependencies: [isDeck, resolved], revertOnUpdate: true }
  );

  // Docking cue (deck mode only). A quick, one-shot "lock-on" the instant the
  // pin engages — deliberately NOT part of the scrubbed deck timeline: it is a
  // fixed ~0.3s ease (dur()-gated), so it reads as an intentional settle rather
  // than a scroll-tied motion. The progress dots pop in crisply AT dock
  // (pre-dock they are parked hidden by the `set` below) — the sole docking
  // cue; the heading renders statically and is untouched by this effect. Its
  // own ScrollTrigger shares the pin's `top top` start; scrolling back above
  // resets it so a re-entry re-pops. Gated by `isDeck` (the flow tree owns
  // these under mobile/reduced motion) with `revertOnUpdate` so a resize out
  // of deck mode reverts the pre-dock `set` and kills the trigger.
  useGSAP(
    () => {
      if (!isDeck || dur() === 0) return;
      const dots = dotsRef.current;
      const pin = pinRef.current;
      if (!dots || !pin) return;

      gsap.set(dots, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });

      const dock = gsap.timeline({ paused: true });
      dock.to(dots, { autoAlpha: 1, scale: 1, duration: dur(0.3), ease: EASE.pop }, 0);

      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        onEnter: () => dock.play(),
        onLeaveBack: () => dock.pause(0),
      });
      // Landed already docked (reload mid-pin / deep-link past the top): show the
      // docked state immediately instead of a hidden indicator.
      if (st.progress > 0) dock.progress(1).pause();
    },
    { scope: pinRef, dependencies: [isDeck], revertOnUpdate: true }
  );

  const wrapperCls = isDeck
    ? "relative h-screen overflow-hidden"
    : "relative overflow-hidden px-6 py-24 sm:py-28";

  const headerCls = isDeck
    ? "absolute inset-x-0 top-[7vh] z-20 px-6 text-center"
    : "relative z-10 mx-auto mb-14 max-w-2xl text-center";

  const deckCls = isDeck
    ? "absolute inset-0 z-10"
    : "relative z-10 mx-auto flex max-w-xl flex-col gap-8";

  // Both modes are flex columns so the paper panel (`grow` below) always
  // fills the article — required for the uniform min-height (the measurement
  // effect above) to read on the visible card, not just its layout box.
  // No focus z-raise here (unlike the fan on the other showcase): this deck
  // stacks in DEAL ORDER (`zIndex: i`, later on top), and the keyboard
  // focus-snap below always lands at "card i JUST dealt" — so the focused
  // card is the topmost dealt card by construction. Hit-testing every card's
  // focused link under natural stacking measured 0/5 points occluded.
  const cardCls = isDeck
    ? "absolute left-1/2 top-1/2 flex w-[min(90vw,600px)] flex-col will-change-transform"
    : "relative flex w-full flex-col";

  return (
    <div
      ref={isDeck ? pinRef : undefined}
      className={wrapperCls}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <StickerField items={accentStickers} />

      <div className={headerCls} data-scroll-anchor>
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]"
          style={{ color: SUNROOM.accent }}
        >
          {projectsKicker}
        </p>
        <SplitReveal
          as="h2"
          mode="words"
          trigger="scroll"
          stagger={0.05}
          className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.01em]"
        >
          {projectsTitle}
        </SplitReveal>
      </div>

      <div ref={flowRef} className={deckCls}>
        {projects.map((project, i) => (
          <article
            key={project.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={cardCls}
            style={isDeck ? { zIndex: i } : undefined}
          >
            <div
              className="flex grow flex-col overflow-hidden shadow-[0_18px_50px_rgba(23,66,31,0.18)]"
              style={{
                background: SUNROOM.paper,
                borderRadius: SUNROOM.radius,
              }}
            >
              <div
                className="h-2.5 w-full shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${project.accent[0]}, ${project.accent[1]})`,
                }}
              />
              <div className="flex grow flex-col p-7 sm:p-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight sm:text-3xl">
                    {project.name}
                  </h3>
                  <span
                    aria-hidden
                    className="font-[family-name:var(--font-display)] text-xl font-bold sm:text-2xl"
                    style={{ color: SUNROOM.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-3 text-base leading-relaxed opacity-80 sm:text-lg">
                  {project.tagline}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: SUNROOM.fields.experience,
                        color: SUNROOM.ink,
                      }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {/* `mt-auto` pushes the links to the card's bottom edge; on a
                    card shorter than the uniform min-height the spare space
                    collects above them, and `pt-6` keeps at least a 24px gap
                    from the content above. */}
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Magnetic strength={0.4}>
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="pointer"
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        background: SUNROOM.ink,
                        color: SUNROOM.paper,
                        outlineColor: SUNROOM.ink,
                      }}
                    >
                      {projectLinks.repo}
                      <span aria-hidden>→</span>
                    </a>
                  </Magnetic>

                  {project.links.demo && (
                    <Magnetic strength={0.4}>
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          background: SUNROOM.paper,
                          color: SUNROOM.ink,
                          border: `2px solid ${SUNROOM.ink}`,
                          outlineColor: SUNROOM.ink,
                        }}
                      >
                        {projectLinks.demo}
                        <span aria-hidden>↗</span>
                      </a>
                    </Magnetic>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Positioning wrapper owns the centering transform; the inner <ol> holds
          only layout so the docking-cue scale/opacity (GSAP) never clobbers the
          `-translate-y-1/2` centering. */}
      <div
        aria-hidden
        className={
          isDeck
            ? "absolute right-4 top-1/2 z-30 -translate-y-1/2 sm:right-8"
            : "hidden"
        }
      >
        <ol ref={dotsRef} className="flex flex-col gap-3">
          {projects.map((project, i) => (
            <li key={project.slug} className="flex items-center justify-center">
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 13 : 9,
                  height: i === active ? 13 : 9,
                  background:
                    i === active ? SUNROOM.accent : "rgba(23,66,31,0.22)",
                }}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
