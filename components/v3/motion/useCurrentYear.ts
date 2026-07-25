"use client";

import { useEffect, useState } from "react";

/**
 * Module scope: identical on the server and hydrating client render — but for
 * a static export that means the BUILD year.
 */
const BUILD_YEAR = new Date().getFullYear();

/**
 * The year for footer copyright lines. Renders the build-baked year (so
 * SSR/hydration match), then corrects to the viewer's actual year after
 * hydration — the footer can't go stale across a New Year with no rebuild.
 */
export function useCurrentYear(): number {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return year;
}
