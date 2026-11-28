import type { NextConfig } from "next";
import {
  GOOGLE_TAG_CONNECT_HOSTS,
  GOOGLE_TAG_SCRIPT_HOSTS,
} from "./src/lib/analytics/google-tag-policy";
import { contentCanonicalRedirectRules } from "./src/lib/seo/canonical-redirects";
import { retiredStudyRedirects } from "./src/lib/navigation/retired-study-redirects";
import { legacyStudyGuideRedirects } from "./src/lib/study-guides/legacy-redirects";
import { STUDY_GUIDE_SERVER_FILES } from "./src/lib/study-guides/server-file-trace";

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

/**
 * Next 15.5 still copies `polyfills-[hash].js` (the legacy nomodule chunk,
 * about 113 KB) into every client build. A modern browserslist stops SWC
 * from downleveling, and this plugin deletes that asset before the build
 * manifest is written so the page does not reference it.
 */
function dropLegacyPolyfills(webpack: {
  Compilation: { PROCESS_ASSETS_STAGE_ADDITIONS: number };
}) {
  return new (class DropLegacyPolyfillsPlugin {
    apply(compiler: {
      hooks: {
        thisCompilation: {
          tap: (
            name: string,
            fn: (compilation: {
              hooks: {
                processAssets: {
                  tap: (
                    options: { name: string; stage: number },
                    callback: () => void
                  ) => void;
                };
              };
              getAssets: () => Array<{ name: string }>;
              deleteAsset: (name: string) => void;
            }) => void
          ) => void;
        };
      };
    }) {
      compiler.hooks.thisCompilation.tap("DropLegacyPolyfills", (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "DropLegacyPolyfills",
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          () => {
            for (const asset of compilation.getAssets()) {
              if (/(^|\/)polyfills(?:-[^/]+)?\.js$/.test(asset.name)) {
                compilation.deleteAsset(asset.name);
              }
            }
          }
        );
      });
    }
  })();
}

const nextConfig: NextConfig = {
  // Streaming metadata lands after </head> for normal browsers, so Lighthouse
  // reports a missing description. Block metadata for every user agent.
  htmlLimitedBots: /.*/,
  ...(useStandaloneOutput ? { output: "standalone" as const } : {}),
  ...(devDeploymentId ? { deploymentId: devDeploymentId } : {}),
  poweredByHeader: false,
  // Default trailing-slash redirects are 308. Send a 301 to the no-slash canonical URL.
  skipTrailingSlashRedirect: true,
  // Quiz JSON is read from disk at request time so a reviewed file can be swapped in.
  outputFileTracingExcludes: Object.fromEntries(
    [
      "/nclex-study-guide",
      "/naplex-study-guide",
      "/pance-study-guide",
      "/aanp-fnp-study-guide",
      "/npte-pt-study-guide",
      "/usmle-study-guide",
      "/usmle-study-guide/[step]",
    ].map((route) => [
      route,
      [
        ".git/**",
        "node_modules/@prisma/**",
        "node_modules/prisma/**",
        "node_modules/@next/swc-linux-x64-gnu/**",
        "node_modules/@next/swc-linux-x64-musl/**",
        "node_modules/typescript/**",
        "node_modules/three/**",
        "node_modules/three-stdlib/**",
        "node_modules/@img/**",
        "node_modules/lucide-react/**",
      ],
    ])
  ),
  outputFileTracingIncludes: {
    "/api/quick-bites/[slug]/quiz": ["./src/lib/quick-bites/quizzes/**/*"],
    "/api/quick-bites-pharmacy/[slug]/quiz": ["./src/lib/quick-bites/quizzes-pharmacy/**/*"],
    "/api/quick-bites-usmle/[slug]/quiz": ["./src/lib/quick-bites/quizzes-usmle/**/*"],
    "/api/quick-bites-medmath/[slug]/quiz": ["./src/lib/quick-bites/quizzes-medmath/**/*"],
    "/api/pance-feed/cards": ["./content/pance-feed/**/*"],
    "/api/pance-feed/cards/[id]": ["./content/pance-feed/**/*"],
    "/api/study-feed/[exam]/cards": [
      "./content/nclex-feed/**/*",
      "./content/naplex-feed/**/*",
      "./content/fnp-feed/**/*",
      "./content/usmle-feed/**/*",
    ],
    "/api/study-feed/[exam]/cards/[id]": [
      "./content/nclex-feed/**/*",
      "./content/naplex-feed/**/*",
      "./content/fnp-feed/**/*",
      "./content/usmle-feed/**/*",
    ],
    "/api/study-feed/[exam]/progress": [
      "./content/nclex-feed/**/*",
      "./content/naplex-feed/**/*",
      "./content/fnp-feed/**/*",
      "./content/usmle-feed/**/*",
    ],
    // Public study guides readdir markdown (and figure headers) on revalidation.
    ...STUDY_GUIDE_SERVER_FILES,
  },
  serverExternalPackages: ["stripe", "pg"],
  // CI runs lint + typecheck; skipping both on Vercel avoids build OOM on this app.
  eslint: { ignoreDuringBuilds: onVercel },
  typescript: { ignoreBuildErrors: onVercel },
  productionBrowserSourceMaps: false,
  experimental: {
    // Keep route CSS in a cacheable file. Inlining duplicated the stylesheet
    // into every HTML document and the RSC payload.
    inlineCss: false,
    // Single-threaded compile on Vercel avoids OOM SIGKILL during large app builds.
    ...(onVercel ? { cpus: 1, workerThreads: false, webpackMemoryOptimizations: true } : {}),
    staleTimes: {
      // Soft-nav client cache for dynamic RSC. The Today mix is not in this
      // payload — it loads from a no-store preview — so a return from Bank or
      // Analytics can paint the shell immediately. Zero here showed loading.tsx
      // and waited out the whole dashboard on every visit.
      dynamic: 45,
      // Dev: avoid client router serving a 5‑minute-old static homepage shell.
      static: isProd ? 300 : 0,
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
  },
  webpack: (config, { webpack, isServer }) => {
    if (onVercel) config.parallelism = 1;
    if (!isServer) {
      config.plugins ??= [];
      config.plugins.push(dropLegacyPolyfills(webpack));
    }
    return config;
  },
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 82, 90],
    // Cache optimized images at the CDN edge for a day (hero LCP benefit on repeat visits).
    minimumCacheTTL: 86400,
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
          `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com ${GOOGLE_TAG_SCRIPT_HOSTS.join(" ")}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "media-src 'self' blob: https://*.private.blob.vercel-storage.com",
          "font-src 'self' data:",
          `connect-src 'self' https://api.stripe.com https://*.stripe.com https://cdn.jsdelivr.net ${GOOGLE_TAG_CONNECT_HOSTS.join(" ")}`,
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
        source: "/(.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|woff2|txt|xml|mp4|webm))",
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
      ...[
        "/",
        "/nclex",
        "/naplex",
        "/usmle",
        "/pance",
        "/aanp-fnp",
        "/npte-pt",
        "/pricing",
        "/compare",
        "/toolkit",
        "/blog",
        "/blog/:path*",
        "/resources/:path*",
        "/crossword",
        "/crossword/:path*",
        "/anatomy",
        "/study/drugs300",
        "/free-guides",
        "/about",
        "/faq",
        "/nclex-study-guide",
        "/nclex-study-guide/:path*",
        "/naplex-study-guide",
        "/naplex-study-guide/:path*",
        "/pance-study-guide",
        "/aanp-fnp-study-guide",
        "/aanp-fnp-study-guide/:path*",
        "/usmle-study-guide",
        "/usmle-study-guide/:path*",
        "/npte-pt-study-guide",
      ].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      })),
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/sitemap/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      ...["/daily", "/daily/:path*"].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=86400",
          },
        ],
      })),
      ...["/dashboard/:path*", "/question-bank", "/question-bank/:path*", "/settings", "/checkout", "/api/:path*"].map(
        (source) => ({
          source,
          headers: [{ key: "Cache-Control", value: "private, no-store" }],
        })
      ),
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
      ...retiredStudyRedirects(),
      ...legacyStudyGuideRedirects(),
      ...contentCanonicalRedirectRules(),
      {
        source: "/employee/login",
        destination: "/auth/login?callbackUrl=%2Finternal",
        permanent: false,
      },
      {
        source: "/qbank",
        destination: "/question-bank",
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
        source: "/:path+/",
        destination: "/:path+",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
