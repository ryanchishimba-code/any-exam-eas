import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN, ROBOTS_ALLOW, robotsDisallowPaths } from "@/lib/seo/crawl-policy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [...ROBOTS_ALLOW],
      disallow: ["/study-tools/", ...robotsDisallowPaths()],
    },
    sitemap: "https://www.anyexameasy.com/sitemap.xml",
    host: CANONICAL_ORIGIN,
  };
}
