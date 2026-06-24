import { prisma } from "@/lib/prisma";
import { getShareAnalytics } from "./shares";
import type { SocialEngagementSummary } from "./types";

/** Aggregate counts + share analytics for the admin social dashboard. */
export async function getSocialEngagementSummary(): Promise<SocialEngagementSummary> {
  const [pendingPosts, approvedPosts, rejectedPosts, likesAgg, shares] = await Promise.all([
    prisma.userSocialPost.count({ where: { approved: false, reviewedAt: null, deletedAt: null } }),
    prisma.userSocialPost.count({ where: { approved: true, deletedAt: null } }),
    prisma.userSocialPost.count({
      where: { approved: false, reviewedAt: { not: null }, deletedAt: null },
    }),
    prisma.userSocialPost.aggregate({
      where: { approved: true, deletedAt: null },
      _sum: { likes: true },
    }),
    getShareAnalytics(30),
  ]);

  return {
    pendingPosts,
    approvedPosts,
    rejectedPosts,
    totalLikes: likesAgg._sum.likes ?? 0,
    shares,
  };
}
