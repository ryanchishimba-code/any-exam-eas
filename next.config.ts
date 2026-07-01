import type { NextConfig } from "next";

/** Standalone is for Docker/AWS only — Vercel uses its own serverless output (faster builds). */
const useStandaloneOutput = !process.env.VERCEL;
const onVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  ...(useStandaloneOutput ? { output: "standalone" as const } : {}),
  poweredByHeader: false,
  serverExternalPackages: ["stripe"],
  // CI runs lint + typecheck; skipping ESLint on Vercel avoids build OOM on large apps.
  eslint: { ignoreDuringBuilds: onVercel },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
    // Vercel default builders OOM on parallel Next/webpack workers for this app.
    ...(process.env.VERCEL
      ? {
          cpus: 1,
          webpackBuildWorker: false,
        }
      : {}),
  },
  images: {
    remotePatterns: [],
    qualities: [75, 82, 90],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
      securityHeaders.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://api.stripe.com https://*.stripe.com https://cdn.jsdelivr.net",
          "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
          "worker-src 'self' blob:",
        ].join("; "),
      });
    }

    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2|txt|xml))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/resources",
        destination: "/toolkit",
        permanent: true,
      },
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
        source: "/practice-hub",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/exams/:exam",
        destination: "/:exam",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
