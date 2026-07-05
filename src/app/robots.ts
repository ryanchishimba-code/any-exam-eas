import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/employee/",
        "/checkout",
        "/internal/",
        "/dashboard/",
        "/prep/",
        "/library/",
        "/analytics/",
        "/admin/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
