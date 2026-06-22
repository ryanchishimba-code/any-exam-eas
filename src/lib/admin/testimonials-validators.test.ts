/**
 * Unit tests for the testimonial admin validators + helpers.
 *
 * Project: unit (node env). Run:
 *   npx vitest run --project unit src/lib/admin/testimonials-validators.test.ts
 *
 * These guard the rules the admin form and API both depend on — keeping bad
 * data out of the public testimonials carousel.
 */

import { describe, expect, it } from "vitest";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  deriveInitials,
  gradientForName,
  TESTIMONIAL_AVATAR_GRADIENTS,
} from "@/lib/admin/testimonials-validators";

describe("createTestimonialSchema", () => {
  const valid = {
    name: "Prisca M.",
    exam: "NCLEX-RN",
    quote: "Passed on my first try thanks to the Roadmap.",
  };

  it("accepts a minimal valid testimonial", () => {
    const result = createTestimonialSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = createTestimonialSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short quote (< 10 chars)", () => {
    const result = createTestimonialSchema.safeParse({ ...valid, quote: "Great" });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range rating", () => {
    expect(createTestimonialSchema.safeParse({ ...valid, rating: 7 }).success).toBe(false);
    expect(createTestimonialSchema.safeParse({ ...valid, rating: 4 }).success).toBe(true);
  });

  it("rejects a non-image, non-URL photo string", () => {
    const result = createTestimonialSchema.safeParse({ ...valid, photoUrl: "javascript:alert(1)" });
    expect(result.success).toBe(false);
  });

  it("accepts a data-URL photo", () => {
    const result = createTestimonialSchema.safeParse({
      ...valid,
      photoUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an https photo URL", () => {
    const result = createTestimonialSchema.safeParse({
      ...valid,
      photoUrl: "https://cdn.example.com/avatar.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("coerces a numeric-string rating", () => {
    const result = createTestimonialSchema.safeParse({ ...valid, rating: "5" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.rating).toBe(5);
  });
});

describe("updateTestimonialSchema", () => {
  it("allows a partial update (status only)", () => {
    const result = updateTestimonialSchema.safeParse({ status: "approved" });
    expect(result.success).toBe(true);
  });

  it("allows the soft-delete flag", () => {
    const result = updateTestimonialSchema.safeParse({ deleted: true });
    expect(result.success).toBe(true);
  });

  it("rejects an empty update object", () => {
    const result = updateTestimonialSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status value", () => {
    const result = updateTestimonialSchema.safeParse({ status: "live" });
    expect(result.success).toBe(false);
  });
});

describe("deriveInitials", () => {
  it("takes the first letter of up to three name parts", () => {
    expect(deriveInitials("Prisca M.")).toBe("PM");
    expect(deriveInitials("gerard nguyen")).toBe("GN");
    expect(deriveInitials("Ana Maria De La Cruz")).toBe("AMD");
  });

  it("falls back to AE for an empty name", () => {
    expect(deriveInitials("   ")).toBe("AE");
  });
});

describe("gradientForName", () => {
  it("returns a known gradient", () => {
    expect(TESTIMONIAL_AVATAR_GRADIENTS).toContain(gradientForName("Prisca M."));
  });

  it("is deterministic for the same name", () => {
    expect(gradientForName("Nathan C.")).toBe(gradientForName("Nathan C."));
  });
});
