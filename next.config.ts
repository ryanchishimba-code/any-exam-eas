import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
    qualities: [75, 82, 90],
  },
  async redirects() {
    return [
      {
        source: "/employee/login",
        destination: "/login?callbackUrl=%2Finternal",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
