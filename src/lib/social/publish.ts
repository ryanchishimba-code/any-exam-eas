import { prisma } from "@/lib/prisma";
import { socialPublisher } from "./ayrshare";
import type { CreateScheduledPostInput } from "./validators";

/**
 * Scheduling + publishing service for outbound brand posts.
 *
 * Our cron (/api/cron/social-publish) is the authoritative scheduler: it picks
 * up due rows and calls the publishing adapter. This keeps timing independent
 * of the provider and works even before a provider key is configured (rows just
 * stay "scheduled" until publishing succeeds).
 */

export type ScheduledPostView = {
  id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalRef: string | null;
  error: string | null;
  createdAt: string;
};

function serialize(row: {
  id: string;
  content: string;
  platforms: string;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  externalRef: string | null;
  error: string | null;
  createdAt: Date;
}): ScheduledPostView {
  return {
    id: row.id,
    content: row.content,
    platforms: row.platforms ? row.platforms.split(",").filter(Boolean) : [],
    status: row.status,
    scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    externalRef: row.externalRef,
    error: row.error,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listScheduledPosts(limit = 50): Promise<ScheduledPostView[]> {
  const rows = await prisma.scheduledSocialPost.findMany({
    orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
    take: Math.min(Math.max(1, limit), 100),
  });
  return rows.map(serialize);
}

/**
 * Create a scheduled/immediate post. If `scheduledAt` is in the future the row
 * waits for the cron; otherwise we attempt to publish right away.
 */
export async function createScheduledPost(
  input: CreateScheduledPostInput,
  createdById?: string | null
): Promise<ScheduledPostView> {
  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : null;
  const isFuture = scheduledAt ? scheduledAt.getTime() > Date.now() : false;

  const row = await prisma.scheduledSocialPost.create({
    data: {
      content: input.content.trim(),
      platforms: input.platforms.join(","),
      mediaUrls: input.mediaUrls?.length ? input.mediaUrls.join(",") : null,
      scheduledAt: scheduledAt ?? new Date(),
      status: "scheduled",
      createdById: createdById ?? null,
    },
  });

  if (!isFuture) {
    const published = await publishScheduledPost(row.id);
    return published ?? serialize(row);
  }
  return serialize(row);
}

/** Publish a single row immediately via the adapter and persist the outcome. */
export async function publishScheduledPost(id: string): Promise<ScheduledPostView | null> {
  const row = await prisma.scheduledSocialPost.findUnique({ where: { id } });
  if (!row || row.status === "published" || row.status === "canceled") {
    return row ? serialize(row) : null;
  }

  // Not configured yet — keep it queued so it publishes once a key is added.
  if (!socialPublisher.isConfigured()) {
    const kept = await prisma.scheduledSocialPost.update({
      where: { id },
      data: { status: "scheduled", error: "Publishing provider not configured yet." },
    });
    return serialize(kept);
  }

  await prisma.scheduledSocialPost.update({ where: { id }, data: { status: "publishing" } });

  const result = await socialPublisher.publish({
    content: row.content,
    platforms: row.platforms.split(",").filter(Boolean),
    mediaUrls: row.mediaUrls ? row.mediaUrls.split(",").filter(Boolean) : undefined,
  });

  const updated = await prisma.scheduledSocialPost.update({
    where: { id },
    data: result.ok
      ? {
          status: "published",
          publishedAt: new Date(),
          externalRef: result.externalRef,
          error: null,
        }
      : { status: "failed", error: result.error },
  });
  return serialize(updated);
}

export async function cancelScheduledPost(id: string): Promise<boolean> {
  const row = await prisma.scheduledSocialPost.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!row || row.status === "published") return false;
  await prisma.scheduledSocialPost.update({ where: { id }, data: { status: "canceled" } });
  return true;
}

/** Cron entry point: publish every row that is due. Returns a small summary. */
export async function runDueScheduledPosts(
  now = new Date()
): Promise<{ attempted: number; published: number; failed: number }> {
  if (!socialPublisher.isConfigured()) {
    return { attempted: 0, published: 0, failed: 0 };
  }

  const due = await prisma.scheduledSocialPost.findMany({
    where: { status: "scheduled", scheduledAt: { lte: now } },
    orderBy: { scheduledAt: "asc" },
    take: 25,
    select: { id: true },
  });

  let published = 0;
  let failed = 0;
  for (const { id } of due) {
    const result = await publishScheduledPost(id);
    if (result?.status === "published") published += 1;
    else if (result?.status === "failed") failed += 1;
  }
  return { attempted: due.length, published, failed };
}
