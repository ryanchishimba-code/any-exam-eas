import { sitemapFileResponse } from "@/lib/seo/sitemap-response";

export const revalidate = 3600;

export function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return context.params.then(({ id }) => sitemapFileResponse(id));
}
