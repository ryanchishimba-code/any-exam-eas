/** Shared types for the social/community feature (server + client safe). */

/** Share button targets. "copy" tracks copy-link clicks. */
export type SharePlatform = "x" | "linkedin" | "facebook" | "whatsapp" | "copy";

/** What is being shared — used for analytics grouping. */
export type ShareEntityType =
  | "question"
  | "result"
  | "progress"
  | "story"
  | "post"
  | "page";

/** Public-safe community post (no internal moderation fields). */
export type PublicSocialPost = {
  id: string;
  content: string;
  examType: string | null;
  likes: number;
  /** "official" for brand posts, "community" for approved UGC. */
  kind: "official" | "community";
  authorName: string | null;
  authorInitials: string | null;
  createdAt: string;
};

/** Admin/moderation view of a post (includes author + status). */
export type ModerationSocialPost = {
  id: string;
  userId: string;
  content: string;
  examType: string | null;
  likes: number;
  approved: boolean;
  /** Derived: pending | approved | rejected. */
  status: "pending" | "approved" | "rejected";
  reviewedAt: string | null;
  reviewedById: string | null;
  deletedAt: string | null;
  createdAt: string;
  authorName: string | null;
  authorEmail: string | null;
};

export type ShareAnalytics = {
  total: number;
  byPlatform: { platform: string; count: number }[];
  byEntityType: { entityType: string; count: number }[];
  dailyTotals: { date: string; count: number }[];
};

export type SocialEngagementSummary = {
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalLikes: number;
  shares: ShareAnalytics;
};
