import { sitemapIndexResponse } from "@/lib/seo/sitemap-response";

export const revalidate = 3600;

/** Sitemap index. Child files live at /sitemap/{pages|study-guides|drugs|blog}.xml */
export function GET() {
  return sitemapIndexResponse();
}
