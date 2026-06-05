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
      {
        source: "/studygub",
        destination: "/study-hub",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/study-hub",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
