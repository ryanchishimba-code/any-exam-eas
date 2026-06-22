import { prisma } from "@/lib/prisma";
import {
  deriveInitials,
  gradientForName,
  type CreateTestimonialInput,
  type UpdateTestimonialInput,
} from "@/lib/admin/testimonials-validators";

/**
 * Admin data layer for testimonials. Pure DB functions used by the
 * `/api/admin/testimonials` route handlers — no auth here (the routes gate).
 */

export type AdminTestimonial = {
  id: string;
  name: string;
  exam: string;
  quote: string;
  longQuote: string | null;
  outcome: string | null;
  detail: string | null;
  initials: string | null;
  photoUrl: string | null;
  avatarGradient: string | null;
  rating: number | null;
  featured: boolean;
  status: string;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function serialize(row: {
  id: string;
  name: string;
  exam: string;
  quote: string;
  longQuote: string | null;
  outcome: string | null;
  detail: string | null;
  initials: string | null;
  photoUrl: string | null;
  avatarGradient: string | null;
  rating: number | null;
  featured: boolean;
  status: string;
  sortOrder: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): AdminTestimonial {
  return {
    ...row,
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Drop empty-string optionals so we store NULL rather than "". */
function clean<T extends Record<string, unknown>>(input: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === "" || value === undefined) continue;
    out[key] = value;
  }
  return out as Partial<T>;
}

export type ListTestimonialsOptions = {
  /** When true, include soft-deleted rows (for the "recently deleted" view). */
  includeDeleted?: boolean;
  /** Optional status filter. */
  status?: string;
};

export async function listTestimonials(
  opts: ListTestimonialsOptions = {}
): Promise<AdminTestimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: {
      ...(opts.includeDeleted ? {} : { deletedAt: null }),
      ...(opts.status ? { status: opts.status } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(serialize);
}

export async function getTestimonial(id: string): Promise<AdminTestimonial | null> {
  const row = await prisma.testimonial.findUnique({ where: { id } });
  return row ? serialize(row) : null;
}

export async function createTestimonial(
  input: CreateTestimonialInput,
  createdById?: string | null
): Promise<AdminTestimonial> {
  const cleaned = clean(input);
  const name = input.name.trim();
  const row = await prisma.testimonial.create({
    data: {
      ...cleaned,
      name,
      exam: input.exam.trim(),
      quote: input.quote.trim(),
      initials: (input.initials?.trim() || deriveInitials(name)).toUpperCase(),
      avatarGradient: input.avatarGradient?.trim() || gradientForName(name),
      // New testimonials start unpublished — admins approve before they go live.
      status: input.status ?? "pending",
      createdById: createdById ?? null,
    },
  });
  return serialize(row);
}

export async function updateTestimonial(
  id: string,
  input: UpdateTestimonialInput
): Promise<AdminTestimonial | null> {
  const { deleted, ...fields } = input;
  const cleaned = clean(fields);

  // Re-derive initials when the name changes but initials weren't provided.
  if (typeof fields.name === "string" && fields.name.trim() && input.initials === undefined) {
    cleaned.initials = deriveInitials(fields.name).toUpperCase();
  }

  const data: Record<string, unknown> = { ...cleaned };
  if (typeof deleted === "boolean") {
    data.deletedAt = deleted ? new Date() : null;
  }

  const existing = await prisma.testimonial.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return null;

  const row = await prisma.testimonial.update({ where: { id }, data });
  return serialize(row);
}

/** Soft delete (keeps the row so the admin can undo). */
export async function softDeleteTestimonial(id: string): Promise<boolean> {
  const existing = await prisma.testimonial.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return false;
  await prisma.testimonial.update({ where: { id }, data: { deletedAt: new Date() } });
  return true;
}

export async function restoreTestimonial(id: string): Promise<AdminTestimonial | null> {
  const existing = await prisma.testimonial.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return null;
  const row = await prisma.testimonial.update({ where: { id }, data: { deletedAt: null } });
  return serialize(row);
}
