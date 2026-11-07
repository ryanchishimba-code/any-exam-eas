import { describe, expect, it } from "vitest";
import {
  GOOGLE_REVIEW_COPY,
  GOOGLE_REVIEW_COOLDOWN_MS,
  GOOGLE_REVIEW_STORAGE_KEY,
  googleReviewHiddenUntil,
  googleReviewSurfaceForLength,
  googleReviewUrl,
  isGoogleReviewSuppressed,
  readGoogleReviewHiddenUntil,
  writeGoogleReviewHiddenUntil,
} from "@/lib/reviews/google-review";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem(key: string) {
      return key in data ? data[key] : null;
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
  };
}

describe("googleReviewUrl", () => {
  it("is off when the env value is missing, blank, or not http(s)", () => {
    expect(googleReviewUrl(undefined)).toBeNull();
    expect(googleReviewUrl(null)).toBeNull();
    expect(googleReviewUrl("")).toBeNull();
    expect(googleReviewUrl("   ")).toBeNull();
    expect(googleReviewUrl("not a url")).toBeNull();
    expect(googleReviewUrl("javascript:alert(1)")).toBeNull();
    expect(googleReviewUrl("ftp://example.com/review")).toBeNull();
  });

  it("accepts a trimmed http(s) review URL", () => {
    expect(googleReviewUrl("  https://search.google.com/local/writereview?placeid=abc  ")).toBe(
      "https://search.google.com/local/writereview?placeid=abc"
    );
    expect(googleReviewUrl("http://localhost:3000/review")).toBe("http://localhost:3000/review");
  });
});

describe("google review cooldown", () => {
  const now = Date.parse("2026-11-01T00:00:00.000Z");

  it("hides for 60 days after a dismiss or click, then shows again", () => {
    const until = googleReviewHiddenUntil(now);
    expect(until - now).toBe(GOOGLE_REVIEW_COOLDOWN_MS);
    expect(isGoogleReviewSuppressed(until, now)).toBe(true);
    expect(isGoogleReviewSuppressed(until, until - 1)).toBe(true);
    expect(isGoogleReviewSuppressed(until, until)).toBe(false);
    expect(isGoogleReviewSuppressed(null, now)).toBe(false);
  });

  it("round-trips the hidden-until timestamp and ignores bad storage", () => {
    const storage = memoryStorage();
    expect(readGoogleReviewHiddenUntil(storage)).toBeNull();
    writeGoogleReviewHiddenUntil(storage, 123);
    expect(storage.data[GOOGLE_REVIEW_STORAGE_KEY]).toBe("123");
    expect(readGoogleReviewHiddenUntil(storage)).toBe(123);
    expect(readGoogleReviewHiddenUntil(memoryStorage({ [GOOGLE_REVIEW_STORAGE_KEY]: "nope" }))).toBeNull();
  });
});

describe("google review copy", () => {
  const text = Object.values(GOOGLE_REVIEW_COPY).join(" ");

  it("asks for an honest review and names the Google action", () => {
    expect(text).toMatch(/honest/i);
    expect(GOOGLE_REVIEW_COPY.cardTitle).toBe("Review us on Google");
    expect(GOOGLE_REVIEW_COPY.cardAction).toBe("Review us on Google");
    expect(GOOGLE_REVIEW_COPY.linkLabel).toBe("Review us on Google");
  });

  it("stays clear of incentives, gates, pass promises, and competitor names", () => {
    expect(text).not.toMatch(/did you like|only if you|if you enjoyed|if you loved|5[- ]?stars?/i);
    expect(text).not.toMatch(/discount|coupon|gift|reward|incentive|free month|promo/i);
    expect(text).not.toMatch(/\bpass\b|guarantee|you'll pass|you will pass/i);
    expect(text).not.toMatch(/uworld|archer|bootcamp|kaplan|nursing\.com/i);
    expect(text).toMatch(/never required/i);
    expect(text).toMatch(/nothing is offered in return/i);
    expect(text).toContain("AnyExamEasy");
    expect(text).not.toContain("Any Exam Easy");
  });
});

describe("googleReviewSurfaceForLength", () => {
  it("treats a full-length sitting as the full exam and shorter forms as practice", () => {
    expect(googleReviewSurfaceForLength("full")).toBe("full_exam_results");
    expect(googleReviewSurfaceForLength("50")).toBe("practice_exam_results");
    expect(googleReviewSurfaceForLength("100")).toBe("practice_exam_results");
    expect(googleReviewSurfaceForLength(undefined)).toBe("practice_exam_results");
  });
});
