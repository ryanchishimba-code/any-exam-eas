import { z } from "zod";

/** Allowed exam tags for community posts (kept loose; UI offers a subset). */
export const EXAM_TAGS = [
  "NCLEX",
  "USMLE",
  "NAPLEX",
  "PANCE",
  "AANP FNP",
  "NPTE-PT",
  "General",
] as const;

export const SHARE_PLATFORM_VALUES = ["x", "linkedin", "facebook", "whatsapp", "copy"] as const;
export const SHARE_ENTITY_VALUES = [
  "question",
  "result",
  "progress",
  "story",
  "post",
  "page",
] as const;

/** Public/user: submit a community post (starts unapproved). */
export const createSocialPostSchema = z.object({
  content: z.string().trim().min(10, "Share a little more detail.").max(500),
  examType: z.enum(EXAM_TAGS).optional(),
});
export type CreateSocialPostInput = z.infer<typeof createSocialPostSchema>;

/** Public: share-tracking beacon. */
export const shareBeaconSchema = z.object({
  platform: z.enum(SHARE_PLATFORM_VALUES),
  entityType: z.enum(SHARE_ENTITY_VALUES),
  entityId: z.string().max(200).optional(),
  url: z.string().url().max(2000).optional(),
  sessionId: z.string().max(120).optional(),
});
export type ShareBeaconInput = z.infer<typeof shareBeaconSchema>;

/** Admin: moderate a post. */
export const moderatePostSchema = z.object({
  action: z.enum(["approve", "reject", "delete", "restore"]),
});
export type ModeratePostInput = z.infer<typeof moderatePostSchema>;

/** Brand channels we can publish to (Phase 2 — outbound). */
export const PUBLISH_PLATFORMS = ["x", "linkedin", "facebook"] as const;
export type PublishPlatform = (typeof PUBLISH_PLATFORMS)[number];

/** Admin: create/schedule an outbound brand post. */
export const createScheduledPostSchema = z.object({
  content: z.string().trim().min(10, "Write a little more.").max(1000),
  platforms: z.array(z.enum(PUBLISH_PLATFORMS)).min(1, "Pick at least one channel."),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
  /** ISO timestamp. Omit (or past) to publish on the next cron tick. */
  scheduledAt: z.string().datetime().optional(),
});
export type CreateScheduledPostInput = z.infer<typeof createScheduledPostSchema>;
