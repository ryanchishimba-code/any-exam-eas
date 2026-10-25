import { prisma } from "@/lib/prisma";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";

export function capChapterHeartbeatSeconds(
  requestedSeconds: number,
  rules = COMPLETION_RULES_V2
): number {
  return Math.min(Math.max(0, requestedSeconds), rules.chapterHeartbeatMaxSeconds);
}

export function isChapterComplete(
  scrollPct: number,
  verifiedSeconds: number,
  rules = COMPLETION_RULES_V2
): boolean {
  return (
    scrollPct >= rules.chapterScrollPctComplete &&
    verifiedSeconds >= rules.chapterVerifiedSecondsComplete
  );
}

export async function upsertSgChapterProgress(
  userId: string,
  chapterId: string,
  input: {
    scrollPct: number;
    heartbeatSeconds?: number;
    tabVisible?: boolean;
  }
) {
  const existing = await prisma.sgChapterProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId } },
  });

  const scrollPct = Math.max(existing?.scrollPct ?? 0, Math.min(100, input.scrollPct));
  let verifiedSeconds = existing?.verifiedSeconds ?? 0;
  if (input.tabVisible && input.heartbeatSeconds != null && input.heartbeatSeconds > 0) {
    verifiedSeconds += capChapterHeartbeatSeconds(input.heartbeatSeconds);
  }

  return prisma.sgChapterProgress.upsert({
    where: { userId_chapterId: { userId, chapterId } },
    create: {
      userId,
      chapterId,
      scrollPct,
      verifiedSeconds,
      lastReadAt: new Date(),
    },
    update: {
      scrollPct,
      verifiedSeconds,
      lastReadAt: new Date(),
    },
  });
}
