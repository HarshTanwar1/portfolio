import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: next build writes the whole site to out/ as plain files;
  // the host serves that directory directly.
  output: "export",
};

export default nextConfig;
