import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  NCLEX_TRUST_EXAM_SLUG,
  floorStudentTrustTier,
  getCachedNclexTrustAudienceCount,
  nclexTrustAudienceCountWhere,
  studentTrustBadgeFromCount,
  studentTrustLabelFromCount,
} from "@/lib/marketing/student-trust-count";

const userCount = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: (...args: unknown[]) => userCount(...args),
    },
  },
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<number>) => fn,
}));

describe("nclexTrustAudienceCountWhere", () => {
  it("counts only active users with NCLEX as their selected board", () => {
    expect(nclexTrustAudienceCountWhere).toEqual({
      accountStatus: "active",
      examPreference: { examSlug: NCLEX_TRUST_EXAM_SLUG },
    });
  });
});

describe("getCachedNclexTrustAudienceCount", () => {
  beforeEach(() => {
    userCount.mockReset();
  });

  it("queries prisma.user.count with the NCLEX preference filter", async () => {
    userCount.mockResolvedValue(42);
    await expect(getCachedNclexTrustAudienceCount()).resolves.toBe(42);
    expect(userCount).toHaveBeenCalledWith({ where: nclexTrustAudienceCountWhere });
  });
});

describe("studentTrustLabelFromCount", () => {
  it("omits a number below 100 accounts", () => {
    expect(studentTrustLabelFromCount(0)).toBe("Trusted by nurses and nursing students");
    expect(studentTrustLabelFromCount(99)).toBe("Trusted by nurses and nursing students");
  });

  it("includes a floored tier at or above 100", () => {
    expect(studentTrustLabelFromCount(100)).toBe("Trusted by 100+ nurses and nursing students");
    expect(studentTrustLabelFromCount(249)).toBe("Trusted by 100+ nurses and nursing students");
    expect(studentTrustLabelFromCount(250)).toBe("Trusted by 250+ nurses and nursing students");
    expect(studentTrustLabelFromCount(1200)).toBe("Trusted by 1,000+ nurses and nursing students");
  });
});

describe("studentTrustBadgeFromCount", () => {
  it("always returns a badge object", () => {
    const low = studentTrustBadgeFromCount(42);
    expect(low.tier).toBeNull();
    expect(low.label).toMatch(/Trusted by nurses and nursing students/);

    const high = studentTrustBadgeFromCount(500);
    expect(high.tier).toBe(500);
    expect(high.label).toBe("Trusted by 500+ nurses and nursing students");
  });
});

describe("floorStudentTrustTier", () => {
  it("returns null under 100", () => {
    expect(floorStudentTrustTier(99)).toBeNull();
  });
});
