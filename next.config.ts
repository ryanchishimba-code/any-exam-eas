import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
    qualities: [75, 82, 90],
  },
};

export default nextConfig;
