import type { MetadataRoute } from "next";
import { isMerchPageAvailable } from "@/lib/merch/merch";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const disallow = [
    "/api/",
    "/employee/",
    "/checkout",
    "/internal/",
    "/dashboard/",
    "/prep/",
    "/library/",
    "/analytics/",
    "/admin/",
  ];
  if (!isMerchPageAvailable()) disallow.push("/merch");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
