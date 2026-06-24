import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import { deriveInitials } from "@/lib/admin/testimonials-validators";
import type { CreateSocialPostInput } from "./validators";
import type { ModerationSocialPost, PublicSocialPost } from "./types";

/**
 * Data layer for community posts. Pure DB functions — authorization is enforced
 * by the calling route handlers (public vs. /api/admin/social/*).
 */

const MAX_FEED_LIMIT = 50;

function clampLimit(limit: number | undefined, fallback: number): number {
  if (!limit || Number.isNaN(limit)) return fallback;
  return Math.min(Math.max(1, Math.floor(limit)), MAX_FEED_LIMIT);
}

function statusOf(approved: boolean, reviewedAt: Date | null): ModerationSocialPost["status"] {
  if (approved) return "approved";
  return reviewedAt ? "rejected" : "pending";
}

/** Public, approved feed: official (staff-authored) + approved community posts. */
export async function listPublicFeed(opts: {
  examType?: string;
  limit?: number;
}): Promise<PublicSocialPost[]> {
  const rows = await prisma.userSocialPost.findMany({
    where: {
      approved: true,
      deletedAt: null,
      ...(opts.examType ? { examType: opts.examType } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: clampLimit(opts.limit, 30),
    select: {
      id: true,
      content: true,
      examType: true,
      likes: true,
      createdAt: true,
      user: { select: { name: true, role: true } },
    },
  });

  return rows.map((row) => {
    const name = row.user?.name ?? null;
    return {
      id: row.id,
      content: row.content,
      examType: row.examType,
      likes: row.likes,
      kind: isStaffRole(row.user?.role) ? "official" : "community",
      authorName: name,
      authorInitials: name ? deriveInitials(name).toUpperCase() : null,
      createdAt: row.createdAt.toISOString(),
    };
  });
}

/** Moderation queue for admins/moderators. */
export async function listModerationPosts(opts: {
  status?: "pending" | "approved" | "rejected";
  includeDeleted?: boolean;
  limit?: number;
}): Promise<ModerationSocialPost[]> {
  const statusWhere =
    opts.status === "approved"
      ? { approved: true }
      : opts.status === "rejected"
        ? { approved: false, reviewedAt: { not: null } }
        : opts.status === "pending"
          ? { approved: false, reviewedAt: null }
          : {};

  const rows = await prisma.userSocialPost.findMany({
    where: {
      ...(opts.includeDeleted ? {} : { deletedAt: null }),
      ...statusWhere,
    },
    orderBy: { createdAt: "desc" },
    take: clampLimit(opts.limit, 50),
    select: {
      id: true,
      userId: true,
      content: true,
      examType: true,
      likes: true,
      approved: true,
      reviewedAt: true,
      reviewedById: true,
      deletedAt: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    content: row.content,
    examType: row.examType,
    likes: row.likes,
    approved: row.approved,
    status: statusOf(row.approved, row.reviewedAt),
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    reviewedById: row.reviewedById,
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    authorName: row.user?.name ?? null,
    authorEmail: row.user?.email ?? null,
  }));
}

/** User-submitted post — always starts unapproved (pending moderation). */
export async function createUserPost(
  userId: string,
  input: CreateSocialPostInput
): Promise<{ id: string }> {
  const row = await prisma.userSocialPost.create({
    data: {
      userId,
      content: input.content.trim(),
      examType: input.examType ?? null,
      approved: false,
    },
    select: { id: true },
  });
  return row;
}

/** Admin-created "official" post — auto-approved and attributed to the admin. */
export async function createOfficialPost(
  adminId: string,
  input: CreateSocialPostInput
): Promise<{ id: string }> {
  const row = await prisma.userSocialPost.create({
    data: {
      userId: adminId,
      content: input.content.trim(),
      examType: input.examType ?? null,
      approved: true,
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
    select: { id: true },
  });
  return row;
}

/** Approve / reject / soft-delete / restore a post. Returns false if not found. */
export async function moderatePost(
  id: string,
  action: "approve" | "reject" | "delete" | "restore",
  reviewerId: string
): Promise<boolean> {
  const existing = await prisma.userSocialPost.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return false;

  const data =
    action === "approve"
      ? { approved: true, reviewedAt: new Date(), reviewedById: reviewerId, deletedAt: null }
      : action === "reject"
        ? { approved: false, reviewedAt: new Date(), reviewedById: reviewerId }
        : action === "delete"
          ? { deletedAt: new Date() }
          : { deletedAt: null };

  await prisma.userSocialPost.update({ where: { id }, data });
  return true;
}

/** Increment a post's like counter (public, approved posts only). */
export async function likePost(id: string): Promise<number | null> {
  const existing = await prisma.userSocialPost.findFirst({
    where: { id, approved: true, deletedAt: null },
    select: { id: true },
  });
  if (!existing) return null;
  const updated = await prisma.userSocialPost.update({
    where: { id },
    data: { likes: { increment: 1 } },
    select: { likes: true },
  });
  return updated.likes;
}
