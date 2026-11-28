import { SITEMAP_IDS } from "@/lib/seo/sitemap-catalog";
import { sitemapFileResponse } from "@/lib/seo/sitemap-response";

export const dynamic = "force-static";
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SITEMAP_IDS.flatMap((id) => [{ id }, { id: `${id}.xml` }]);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return sitemapFileResponse(id);
}
