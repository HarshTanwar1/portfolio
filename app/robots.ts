import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Required marker for `output: "export"` builds (the public repo): metadata
// routes must declare themselves static to be emitted as files.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
