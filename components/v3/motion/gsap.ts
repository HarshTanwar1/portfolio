"use client";

/**
 * Shared GSAP entrypoint for the v3 motion core.
 *
 * ScrollTrigger (and the `useGSAP` React integration) are registered here
 * exactly once. Because ES modules are singletons this side effect runs a
 * single time per client bundle; the `typeof window` guard keeps it from
 * touching browser globals during SSR. Every v3 consumer imports `gsap`,
 * `ScrollTrigger`, and `useGSAP` from THIS module rather than from the
 * packages directly, so plugin registration can never be duplicated (which
 * would surface as a console warning).
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export { gsap, ScrollTrigger, useGSAP };
