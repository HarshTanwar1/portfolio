"use client";

import { useEffect, useState } from "react";
import { v3Copy } from "@/content/v3";
import { useScrollTo } from "@/components/v3/motion/SmoothScroll";
import { Magnetic } from "@/components/v3/motion/Magnetic";
import { SUNROOM } from "../tokens";

const { navLabels } = v3Copy.sunroom;

/**
 * Full-journey nav targets. Labels come from the copy module; the hashes
 * live here. Every anchor resolves to a section on
 * the one-pager, routed through Lenis via `useScrollTo`.
 */
const NAV_ITEMS = [
  { label: navLabels.about, hash: "#about" },
  { label: navLabels.work, hash: "#projects" },
  { label: navLabels.story, hash: "#experience" },
  { label: navLabels.contact, hash: "#contact" },
] as const;

/**
 * Fixed pill nav. On desktop a translucent-paper cluster sits top-right, each
 * pill a real anchor routed through Lenis via `useScrollTo` (keyboard-reachable,
 * visible ink focus ring, magnetic on pointer-fine devices). On mobile the
 * cluster is hidden — scroll is the nav — and a floating "↑ top" pill fades in
 * after two viewports to jump back to the hero.
 */
export function Nav() {
  const scrollTo = useScrollTo();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setShowTop(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(hash);
  };

  const pillBase =
    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <>
      <nav
        aria-label="Section navigation"
        className="fixed right-4 top-4 z-40 hidden items-center gap-1 rounded-full p-1 backdrop-blur-md sm:flex"
        style={{
          background: "rgba(255, 253, 246, 0.7)",
          fontFamily: "var(--font-body)",
          color: SUNROOM.ink,
          boxShadow: "0 6px 24px rgba(23, 66, 31, 0.12)",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Magnetic key={item.hash} strength={0.3}>
            <a
              href={item.hash}
              onClick={jump(item.hash)}
              data-cursor="pointer"
              className={`${pillBase} block hover:bg-[rgba(23,66,31,0.08)]`}
              style={{ outlineColor: SUNROOM.ink }}
            >
              {item.label}
            </a>
          </Magnetic>
        ))}
      </nav>

      <a
        href="#hero"
        onClick={jump("#hero")}
        data-cursor="pointer"
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{
          background: SUNROOM.ink,
          color: SUNROOM.paper,
          outlineColor: SUNROOM.ink,
        }}
      >
        ↑
      </a>
    </>
  );
}
