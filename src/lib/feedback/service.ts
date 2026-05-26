import { prisma } from "@/lib/prisma";
import { hashIp, getUserAgent } from "@/lib/analytics/request-context";
import type { FeedbackListItem, FeedbackSort, FeedbackStatus } from "./types";
import type { SubmitFeedbackInput } from "./validators";

export async function createFeedback(
  input: SubmitFeedbackInput,
  opts?: { userId?: string; req?: Request }
): Promise<{ id: string }> {
  const name = input.name?.trim() || null;
  const email = input.email?.trim().toLowerCase() || null;

  const row = await prisma.userFeedback.create({
    data: {
      name,
      email,
      category: input.category,
      message: input.message.trim(),
      rating: input.rating,
      userId: opts?.userId ?? null,
      ipHash: hashIp(opts?.req),
      userAgent: getUserAgent(opts?.req) ?? null,
    },
    select: { id: true },
  });

  return row;
}

function mapRow(row: {
  id: string;
  name: string | null;
  email: string | null;
  category: string;
  message: string;
  rating: number;
  status: string;
  userId: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}): FeedbackListItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    category: row.category,
    message: row.message,
    rating: row.rating,
    status: row.status as FeedbackStatus,
    userId: row.userId,
    createdAt: row.createdAt.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  };
}

function orderBy(sort: FeedbackSort) {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" as const };
    case "rating_high":
      return [{ rating: "desc" as const }, { createdAt: "desc" as const }];
    case "rating_low":
      return [{ rating: "asc" as const }, { createdAt: "desc" as const }];
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}

export async function listFeedback(params: {
  category?: string;
  status?: FeedbackStatus;
  search?: string;
  sort?: FeedbackSort;
  limit?: number;
  offset?: number;
}): Promise<{ items: FeedbackListItem[]; total: number }> {
  const where: {
    category?: string;
    status?: string;
    OR?: Array<
      | { message: { contains: string } }
      | { email: { contains: string } }
      | { name: { contains: string } }
    >;
  } = {};

  if (params.category) where.category = params.category;
  if (params.status) where.status = params.status;

  const q = params.search?.trim();
  if (q) {
    where.OR = [
      { message: { contains: q } },
      { email: { contains: q } },
      { name: { contains: q } },
    ];
  }

  const limit = Math.min(params.limit ?? 50, 100);
  const offset = params.offset ?? 0;
  const sort = params.sort ?? "newest";

  const [rows, total] = await Promise.all([
    prisma.userFeedback.findMany({
      where,
      orderBy: orderBy(sort),
      take: limit,
      skip: offset,
    }),
    prisma.userFeedback.count({ where }),
  ]);

  return { items: rows.map(mapRow), total };
}

export async function setFeedbackResolved(
  id: string,
  resolved: boolean,
  actorId: string
): Promise<FeedbackListItem | null> {
  const existing = await prisma.userFeedback.findUnique({ where: { id } });
  if (!existing) return null;

  const row = await prisma.userFeedback.update({
    where: { id },
    data: resolved
      ? {
          status: "resolved",
          resolvedAt: new Date(),
          resolvedById: actorId,
        }
      : {
          status: "open",
          resolvedAt: null,
          resolvedById: null,
        },
  });

  return mapRow(row);
}

export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    await prisma.userFeedback.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getFeedbackTrends(
  from: Date,
  to: Date
): Promise<{ date: string; count: number; avgRating: number }[]> {
  const rows = await prisma.userFeedback.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { createdAt: true, rating: true },
    orderBy: { createdAt: "asc" },
  });

  const byDay = new Map<string, { count: number; sum: number }>();
  for (const r of rows) {
    const date = r.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(date) ?? { count: 0, sum: 0 };
    entry.count += 1;
    entry.sum += r.rating;
    byDay.set(date, entry);
  }

  return Array.from(byDay.entries())
    .map(([date, v]) => ({
      date,
      count: v.count,
      avgRating: v.count ? Math.round((v.sum / v.count) * 10) / 10 : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
