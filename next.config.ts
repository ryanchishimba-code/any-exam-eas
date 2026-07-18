import type { NextConfig } from "next";

/** Standalone is for Docker/AWS only — Vercel uses its own serverless output (faster builds). */
const useStandaloneOutput = !process.env.VERCEL;
const onVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === "production";

/**
 * In `next dev`, chunk URLs like `/_next/static/chunks/app/(marketing)/page.js` are stable.
 * If they were ever served with `Cache-Control: immutable`, browsers keep the old JS forever
 * and hydrate over correct SSR HTML. A per-process deploymentId appends `?dpl=…` to assets
 * so those stale entries cannot match.
 */
const devDeploymentId = !isProd ? `dev-${Date.now()}` : undefined;

const nextConfig: NextConfig = {
  ...(useStandaloneOutput ? { output: "standalone" as const } : {}),
  ...(devDeploymentId ? { deploymentId: devDeploymentId } : {}),
  poweredByHeader: false,
  serverExternalPackages: ["stripe"],
  // CI runs lint + typecheck; skipping both on Vercel avoids build OOM on this app.
  eslint: { ignoreDuringBuilds: onVercel },
  typescript: { ignoreBuildErrors: onVercel },
  productionBrowserSourceMaps: false,
  experimental: {
    // Single-threaded compile on Vercel avoids OOM SIGKILL during large app builds.
    ...(onVercel ? { cpus: 1, workerThreads: false, webpackMemoryOptimizations: true } : {}),
    staleTimes: {
      dynamic: 30,
      // Dev: avoid client router serving a 5‑minute-old static homepage shell.
      static: isProd ? 300 : 0,
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
  },
  ...(onVercel
    ? {
        webpack: (config) => {
          config.parallelism = 1;
          return config;
        },
      }
    : {}),
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
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

    if (isProd) {
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
          {
            key: "Cache-Control",
            // Production builds use content-hashed filenames — immutable is correct.
            // In `next dev` chunk URLs are stable, so immutable caching freezes stale JS
            // (e.g. old homepage hero) across edits. Never cache those in development.
            value: isProd
              ? "public, max-age=31536000, immutable"
              : "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/(.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2|txt|xml|mp4|webm))",
        headers: [
          {
            key: "Cache-Control",
            value: isProd
              ? "public, max-age=86400, stale-while-revalidate=604800"
              : "no-store, must-revalidate",
          },
        ],
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
        headers: [
          ...securityHeaders,
          // Dev: do not let browsers / intermediaries cache HTML or RSC payloads.
          // (Prod omits this — CDN / platform cache headers apply as usual.)
          ...(isProd
            ? []
            : [
                {
                  key: "Cache-Control",
                  value: "no-store, must-revalidate",
                },
              ]),
        ],
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
        destination: "/naplex",
        permanent: true,
      },
      {
        source: "/exams/mpje",
        destination: "/naplex",
        permanent: true,
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
