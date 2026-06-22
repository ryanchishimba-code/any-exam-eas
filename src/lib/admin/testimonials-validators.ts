import { z } from "zod";

/**
 * Validation schemas for admin testimonial management.
 *
 * Used by the `/api/admin/testimonials` route handlers. Keep these the single
 * source of truth for what an admin can submit — the client form mirrors these
 * rules for instant feedback, but the server always re-validates.
 */

/** Allowed moderation states. Only "approved" is shown publicly. */
export const TESTIMONIAL_STATUSES = ["pending", "approved", "rejected"] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

/** Curated avatar gradients (match the look used by the static success stories). */
export const TESTIMONIAL_AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
] as const;

// Photos are stored inline as compressed data URLs (no blob infra required).
// Cap the payload so a giant base64 string can't bloat the row / response.
const MAX_PHOTO_CHARS = 600_000; // ~430KB binary — plenty for a small avatar

const photoSchema = z
  .string()
  .trim()
  .max(MAX_PHOTO_CHARS, "Image is too large — use a smaller photo.")
  .refine(
    (v) => v === "" || v.startsWith("data:image/") || /^https?:\/\//.test(v),
    "Photo must be an uploaded image or an http(s) URL."
  )
  .optional();

/** Shared field rules between create and update. */
const baseFields = {
  name: z.string().trim().min(1, "Name is required.").max(80),
  exam: z.string().trim().min(1, "Exam / role is required.").max(80),
  quote: z.string().trim().min(10, "Quote should be at least 10 characters.").max(600),
  longQuote: z.string().trim().max(1200).optional(),
  outcome: z.string().trim().max(120).optional(),
  detail: z.string().trim().max(160).optional(),
  initials: z.string().trim().max(3).optional(),
  photoUrl: photoSchema,
  avatarGradient: z.string().trim().max(200).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  status: z.enum(TESTIMONIAL_STATUSES).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
};

export const createTestimonialSchema = z.object(baseFields);

/** Update allows any subset of fields (PATCH semantics). */
export const updateTestimonialSchema = z
  .object({
    ...baseFields,
    name: baseFields.name.optional(),
    exam: baseFields.exam.optional(),
    quote: baseFields.quote.optional(),
    /** Soft-delete / restore flag handled out-of-band. */
    deleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "No changes provided.");

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

/** Derive up-to-3 uppercase initials from a name when none are supplied. */
export function deriveInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length === 0) return "AE";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

/** Stable gradient pick so the same name keeps the same fallback avatar color. */
export function gradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TESTIMONIAL_AVATAR_GRADIENTS[hash % TESTIMONIAL_AVATAR_GRADIENTS.length];
}
