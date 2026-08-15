import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.shortName} — ${site.role}`,
  description: site.description,
  // Author metadata — read by link-preview inspectors (e.g. LinkedIn's).
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  // Google Search Console ownership proof (URL-prefix property; the pages.dev
  // DNS zone is Cloudflare's, so DNS verification is unavailable). Must stay —
  // Google re-checks it periodically and unverifies the property if it drops.
  verification: {
    google: "nO9Bgs1uUnTKiUe95hcwrqqCv-vxCD5FbsiYal-KHNA",
  },
  openGraph: {
    title: `${site.shortName} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.shortName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — ${site.role}`,
    description: site.description,
  },
};

// Person structured data (JSON-LD) — inert to browsers (never executed),
// read by search engines to bind the site, the name, and the public profiles
// into one entity for name searches.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.shortName,
  jobTitle: site.role,
  url: site.url,
  sameAs: [site.github, site.linkedin, site.leetcode, site.hackerrank],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-canvas font-sans text-fg antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
