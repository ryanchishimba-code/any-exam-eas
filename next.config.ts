import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["stripe"],
  images: {
    remotePatterns: [],
    qualities: [75, 82, 90],
  },
  async redirects() {
    return [
      {
        source: "/employee/login",
        destination: "/auth/login?callbackUrl=%2Finternal",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/forgot-password",
        destination: "/auth/forgot-password",
        permanent: false,
      },
      {
        source: "/reset-password",
        destination: "/auth/reset-password",
        permanent: false,
      },
      {
        source: "/mpje",
        destination: "/exams/mpje",
        permanent: false,
      },
      {
        source: "/studygub",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/study-hub",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/prep/:exam",
        destination: "/exams/:exam",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
