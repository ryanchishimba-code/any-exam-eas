import { prisma } from "@/lib/prisma";
import type { TopicWeakness } from "@/lib/questions/adaptive";

export async function buildTopicWeakness(
  userId: string,
  fieldId?: string,
  days = 90
): Promise<TopicWeakness[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const attempts = await prisma.questionAttempt.findMany({
    where: {
      userId,
      createdAt: { gte: since },
      ...(fieldId ? { fieldId } : {}),
    },
    select: {
      correct: true,
      tagsJson: true,
      subjectId: true,
    },
  });

  const byTag = new Map<string, { attempts: number; misses: number }>();

  for (const a of attempts) {
    const tags = parseTags(a.tagsJson, a.subjectId);
    for (const tag of tags) {
      const entry = byTag.get(tag) ?? { attempts: 0, misses: 0 };
      entry.attempts++;
      if (!a.correct) entry.misses++;
      byTag.set(tag, entry);
    }
  }

  return Array.from(byTag.entries()).map(([tag, v]) => ({
    tag,
    attempts: v.attempts,
    misses: v.misses,
    missRate: v.attempts > 0 ? v.misses / v.attempts : 0,
  }));
}

export function parseTags(tagsJson: string | null, subjectId: string | null): string[] {
  const tags: string[] = [];
  if (tagsJson) {
    try {
      const parsed = JSON.parse(tagsJson) as unknown;
      if (Array.isArray(parsed)) {
        for (const t of parsed) {
          if (typeof t === "string") tags.push(t.toLowerCase());
        }
      }
    } catch {
      /* ignore */
    }
  }
  if (subjectId) tags.push(`subject:${subjectId}`);
  if (tags.length === 0) tags.push("general");
  return tags;
}

export function tagsToJson(tags: string[] | undefined): string | null {
  if (!tags?.length) return null;
  return JSON.stringify(tags.map((t) => t.toLowerCase()));
}
