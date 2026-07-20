import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/content/site";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.shortName} — ${site.role}`,
  description: site.description,
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
        <Analytics />
      </body>
    </html>
  );
}
