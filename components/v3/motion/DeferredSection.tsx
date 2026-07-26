"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

/**
 * Deferred-hydration island for a below-fold, code-split section.
 *
 * The children are a `next/dynamic` (lazy) component — rendered ONLY on the
 * server, so the full section HTML ships in the document. On the client the
 * pre-mount branch re-injects a SNAPSHOT of that server HTML (see below), so
 * the section stays visible and full-height while its module is still
 * pending. When a trigger fires, `load` resolves the section's real component
 * and we render THAT directly, never the lazy wrapper. This distinction is
 * load-bearing: React.lazy suspends for at least a microtask on its first
 * render even when the module is already cached, which blanks the section for
 * a frame, collapses the document, and lets the browser clamp the scroll
 * position of anyone reading below. Mounting the resolved component renders
 * the full subtree synchronously in one commit — height never dips.
 *
 * Why the snapshot: React 19 hydration APPLIES a client-rendered
 * `dangerouslySetInnerHTML` even when it mismatches the server DOM — an empty
 * string would blank all deferred sections at hydration (measured: the
 * document collapsed from ~8600px to ~1700px and clamped a bottom reader's
 * scroll position). So the wrapper captures each section's server innerHTML
 * BEFORE React commits over it — reads happen in the hydration render phase,
 * while the server DOM is still intact — and hands those same bytes back to
 * React: identical markup, identical height, no visible change.
 *
 * Triggers, in priority order:
 * 1. Wide viewports (min-width: 768px) mount IMMEDIATELY. 768 mirrors the
 *    Projects deck's own layout breakpoint: everywhere the pinned deck can
 *    run, hydration must not lag, so pin geometry and scroll anchors appear
 *    as early as they always have. Deferral only ever applies to viewports
 *    where every section renders its simple vertical flow.
 * 2. ANY hash arrival mounts immediately too — the visitor lands mid-page, so
 *    deferral saves nothing, and the settle-time landing correction (see the
 *    hash effect in SmoothScroll) needs final layout as soon as possible.
 * 3. Otherwise: requestIdleCallback with a timeout leash (falls back to a
 *    plain timer where rIC is unavailable), so hydration can neither compete
 *    with the load window nor starve behind a busy main thread.
 */

/** Idle leash: mount no later than this even if the main thread stays busy. */
const IDLE_TIMEOUT_MS = 1500;

/**
 * Server-HTML snapshots keyed by section hash, captured once per page load.
 * Reading the DOM during render is impure in general; here it is memoized,
 * idempotent, and MUST happen in the hydration render phase — after commit,
 * React has already overwritten the element's content.
 */
const snapshots = new Map<string, string>();

function serverHTML(hash: string): string {
  let html = snapshots.get(hash);
  if (html === undefined) {
    html =
      document.querySelector(`[data-defer-key="${CSS.escape(hash)}"]`)
        ?.innerHTML ?? "";
    snapshots.set(hash, html);
  }
  return html;
}

export function DeferredSection({
  children,
  load,
  hash,
}: Readonly<{
  children: ReactNode;
  /** Resolves the section's actual component (not a lazy wrapper). */
  load: () => Promise<ComponentType>;
  /** This section's anchor (e.g. "#skills") — the stable snapshot key. */
  hash: string;
}>) {
  const [Live, setLive] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      load().then((Section) => {
        if (!cancelled) setLive(() => Section);
      });
    };

    const eager =
      window.matchMedia("(min-width: 768px)").matches ||
      window.location.hash !== "";
    if (eager) {
      mount();
      return () => {
        cancelled = true;
      };
    }

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(mount, { timeout: IDLE_TIMEOUT_MS });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = setTimeout(mount, IDLE_TIMEOUT_MS);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
    // load/hash are stable for a section's lifetime; the decision runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Live) {
    return (
      <div key="live" data-hydrate="live">
        <Live />
      </div>
    );
  }
  if (typeof window === "undefined") {
    return (
      <div key="ssr" data-hydrate="ssr" data-defer-key={hash}>
        {children}
      </div>
    );
  }
  return (
    <div
      key="ssr"
      data-hydrate="ssr"
      data-defer-key={hash}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serverHTML(hash) }}
    />
  );
}
