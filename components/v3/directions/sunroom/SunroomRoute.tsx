import { Baloo_2, Inter } from "next/font/google";
import { PreloaderReset } from "@/components/v3/motion/PreloaderReset";
import { SunroomPage, SUNROOM_PRELOADER_KEY } from "./SunroomPage";

// Route-scoped fonts: chunky rounded display + clean body, exposed as CSS vars
// on the page wrapper only (the root layout stays untouched).
const display = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Chrome for the home page (`/`). `PreloaderReset` and `<Preloader>` (inside
 * `SunroomPage`) both key off `SUNROOM_PRELOADER_KEY`, so `?fresh=1` replays
 * the curtain.
 */
export function SunroomRoute() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      {/* Dev affordance: `?fresh=1` replays the preloader. */}
      <PreloaderReset storageKey={SUNROOM_PRELOADER_KEY} />
      <SunroomPage />
    </div>
  );
}
