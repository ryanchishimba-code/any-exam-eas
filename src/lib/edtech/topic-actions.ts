"use server";

import { incrementTopicReview } from "@/lib/edtech/topic-progress";

export async function recordTopicReview(topicId: string): Promise<{ reviewCount: number } | null> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return null;

  const reviewCount = await incrementTopicReview(session.user.id, topicId);
  return { reviewCount };
}
