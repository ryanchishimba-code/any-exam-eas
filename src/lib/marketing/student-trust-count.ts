import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const TRUST_TIERS = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000] as const;

export const NURSING_TRUST_AUDIENCE = "nurses and nursing students";

/** NCLEX board slug on {@link UserExamPreference}. */
export const NCLEX_TRUST_EXAM_SLUG = "nclex";

/**
 * Active users who selected NCLEX as their primary board in UserExamPreference.
 * Users without a preference row are excluded.
 */
export const nclexTrustAudienceCountWhere: Prisma.UserWhereInput = {
  accountStatus: "active",
  examPreference: { examSlug: NCLEX_TRUST_EXAM_SLUG },
};

/** Rounds down to the largest marketing tier at or below the real count. */
export function floorStudentTrustTier(count: number): number | null {
  if (!Number.isFinite(count) || count < 100) return null;
  let tier: number = TRUST_TIERS[0];
  for (const step of TRUST_TIERS) {
    if (count >= step) tier = step;
  }
  return tier;
}

export function studentTrustLabelFromCount(count: number): string {
  const tier = floorStudentTrustTier(count);
  if (tier !== null) {
    return `Trusted by ${tier.toLocaleString("en-US")}+ ${NURSING_TRUST_AUDIENCE}`;
  }
  return `Trusted by ${NURSING_TRUST_AUDIENCE}`;
}

async function readNclexTrustAudienceCount(): Promise<number> {
  try {
    return await prisma.user.count({ where: nclexTrustAudienceCountWhere });
  } catch {
    return 0;
  }
}

const loadCachedNclexTrustAudienceCount = unstable_cache(
  readNclexTrustAudienceCount,
  ["marketing-nclex-trust-audience-count-v1"],
  { revalidate: 300, tags: ["marketing-nclex-trust-audience-count"] }
);

/** Cached NCLEX-preference account total for the public trust badge (ISR-aligned 5 min). */
export async function getCachedNclexTrustAudienceCount(): Promise<number> {
  return loadCachedNclexTrustAudienceCount();
}

export type StudentTrustBadge = {
  /** Floored tier when count ≥ 100; otherwise null (label has no number). */
  tier: number | null;
  label: string;
};

/** Always returns a label — with N+ only when the NCLEX audience count is ≥ 100. */
export function studentTrustBadgeFromCount(count: number): StudentTrustBadge {
  return {
    tier: floorStudentTrustTier(count),
    label: studentTrustLabelFromCount(count),
  };
}
