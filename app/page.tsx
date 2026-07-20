import { SunroomRoute } from "@/components/v3/directions/sunroom/SunroomRoute";

// The Sunroom one-pager is the live home page. This route stays INDEXABLE: it
// sets no `robots` override, so it inherits the root layout's site-wide
// metadata/OG (title, description, opengraph-image) with no noindex.
export default function Home() {
  return <SunroomRoute />;
}
