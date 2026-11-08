import type { MetadataRoute } from "next";
import { quickBiteRouteBases } from "@/lib/quick-bites/boards";
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
        ...quickBiteRouteBases(),
        "/daily/confirm",
        "/daily/unsubscribe",
        "/email/unsubscribe",
      ],
    },
    sitemap: "https://www.anyexameasy.com/sitemap.xml",
    host: base,
  };
}
