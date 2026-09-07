import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Required marker for `output: "export"` builds (the public repo): metadata
// routes must declare themselves static to be emitted as files.
export const dynamic = "force-static";

// Spec-minimal by design (2026-09-07 audit vs Google's build-sitemap doc):
// `loc` only, in the trailing-slash form that matches the GSC property and
// served canonical. `lastModified` is deliberately ABSENT — the old
// `new Date()` stamped BUILD time, which Google's doc distrusts ("only if
// consistently and verifiably accurate"); `changeFrequency`/`priority` are
// documented as ignored by Google. Don't re-add any of the three.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
    },
  ];
}
