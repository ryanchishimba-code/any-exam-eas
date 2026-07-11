import { z } from "zod";

/** Fixed starter categories — admins can still type a custom category string. */
export const BLOG_CATEGORIES = [
  "Study Tips",
  "NCLEX",
  "USMLE",
  "NAPLEX",
  "Product Updates",
  "Career",
] as const;

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Rough read-time from HTML/plain text (~200 wpm). */
export function estimateReadTimeMinutes(htmlOrText: string): number {
  const text = htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

const tagsSchema = z
  .union([z.array(z.string()), z.string()])
  .transform((value) => {
    const list = Array.isArray(value)
      ? value
      : value.split(",").map((t) => t.trim());
    return [...new Set(list.map((t) => t.trim()).filter(Boolean))].slice(0, 12);
  });

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .optional(),
  excerpt: z.string().trim().max(400).optional().default(""),
  content: z.string().max(200_000).optional().default(""),
  coverImage: z.string().trim().max(2_000_000).optional().nullable(),
  category: z.string().trim().min(1).max(60).optional().default("Study Tips"),
  tags: tagsSchema.optional().default([]),
  published: z.boolean().optional().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(170).optional().nullable(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  published: z.boolean().optional(),
});

export const bulkBlogActionSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(50),
  action: z.enum(["publish", "unpublish", "delete"]),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
