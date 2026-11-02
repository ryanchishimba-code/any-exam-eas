import type { MetadataRoute } from "next";
import { gatedStudyGuidePaths } from "@/lib/seo/gated-study-guide-paths";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/nclex", "/naplex"],
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
        "/study-tools/",
        ...gatedStudyGuidePaths(),
        "/daily/confirm",
        "/daily/unsubscribe",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
