import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const TRUST_TIERS = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000] as const;

export const NURSING_TRUST_AUDIENCE = "nurses and nursing students";

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

async function readActiveAccountCount(): Promise<number> {
  try {
    return await prisma.user.count({ where: { accountStatus: "active" } });
  } catch {
    return 0;
  }
}

const loadCachedActiveAccountCount = unstable_cache(
  readActiveAccountCount,
  ["marketing-active-account-count-v1"],
  { revalidate: 300, tags: ["marketing-active-account-count"] }
);

/** Cached active account total for public trust badges (ISR-aligned 5 min). */
export async function getCachedActiveAccountCount(): Promise<number> {
  return loadCachedActiveAccountCount();
}

export type StudentTrustBadge = {
  /** Floored tier when count ≥ 100; otherwise null (label has no number). */
  tier: number | null;
  label: string;
};

/** Always returns a label — with N+ only when the real active account count is ≥ 100. */
export function studentTrustBadgeFromCount(count: number): StudentTrustBadge {
  return {
    tier: floorStudentTrustTier(count),
    label: studentTrustLabelFromCount(count),
  };
}
