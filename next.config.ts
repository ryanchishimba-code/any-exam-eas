import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["stripe"],
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
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
