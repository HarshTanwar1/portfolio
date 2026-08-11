import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Required marker for `output: "export"` builds (the public repo): metadata
// routes must declare themselves static to be emitted as files.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
