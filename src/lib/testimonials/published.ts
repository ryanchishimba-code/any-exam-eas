import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { deriveInitials, gradientForName } from "@/lib/admin/testimonials-validators";

/**
 * Public-facing testimonials source.
 *
 * Returns admin-approved testimonials only. Empty table or DB errors return
 * [] — never invented student quotes.
 */
export async function getPublishedTestimonials(
  limit = 12
): Promise<LandingSuccessStory[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { status: "approved", deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    });

    return rows.map((row) => ({
      quote: row.quote,
      longQuote: row.longQuote ?? undefined,
      name: row.name,
      exam: row.exam,
      initials: (row.initials || deriveInitials(row.name)).toUpperCase(),
      outcome: row.outcome ?? "",
      detail: row.detail ?? undefined,
      featured: row.featured,
      avatarGradient: row.avatarGradient || gradientForName(row.name),
      photoUrl: row.photoUrl ?? undefined,
    }));
  } catch {
    return [];
  }
}

async function fetchPublishedTestimonials(limit: number): Promise<LandingSuccessStory[]> {
  return getPublishedTestimonials(limit);
}

const fetchCachedPublishedTestimonials = unstable_cache(
  async (limit: number) => fetchPublishedTestimonials(limit),
  ["published-testimonials"],
  { revalidate: 3600, tags: ["published-testimonials"] }
);

/** Cached testimonials for public marketing pages. */
export async function getCachedPublishedTestimonials(
  limit = 12
): Promise<LandingSuccessStory[]> {
  return fetchCachedPublishedTestimonials(limit);
}
