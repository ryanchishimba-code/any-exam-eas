"use server";

import { incrementTopicReview, incrementTopicPractice } from "@/lib/edtech/topic-progress";

export async function recordTopicReview(topicId: string): Promise<{ reviewCount: number } | null> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return null;

  const reviewCount = await incrementTopicReview(session.user.id, topicId);
  return { reviewCount };
}

export async function recordTopicPractice(topicId: string): Promise<{ practiceCount: number } | null> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return null;

  const practiceCount = await incrementTopicPractice(session.user.id, topicId);
  return { practiceCount };
}
