import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  LANDING_SUCCESS_STORIES,
  type LandingSuccessStory,
} from "@/lib/landing/content";
import { deriveInitials, gradientForName } from "@/lib/admin/testimonials-validators";

/**
 * Public-facing testimonials source.
 *
 * Returns admin-approved testimonials from the database, shaped as
 * `LandingSuccessStory[]` so existing landing components can consume them
 * unchanged. When the table is empty (or on any DB error) it falls back to the
 * curated static stories — so the public site is never blank and existing
 * behavior is preserved until an admin publishes their own.
 *
 * NOTE: a `photoUrl` is intentionally NOT part of `LandingSuccessStory` today
 * (avatars are gradient + initials). When wiring real photos into the public
 * cards, extend `LandingSuccessStory` with an optional `photoUrl` and render it.
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

    if (rows.length === 0) return LANDING_SUCCESS_STORIES;

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
    // DB unavailable / table not migrated yet — keep the site working.
    return LANDING_SUCCESS_STORIES;
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
