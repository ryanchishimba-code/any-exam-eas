export { adjustDifficulty } from "@/lib/questions/adaptive";

import { prisma } from "@/lib/prisma";

/** Suggested difficulty for next question block based on recent accuracy. */
export async function suggestDifficulty(
  userId: string,
  fieldId: string
): Promise<"easy" | "medium" | "hard"> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 14);

  const attempts = await prisma.questionAttempt.findMany({
    where: { userId, fieldId, createdAt: { gte: since } },
    select: { correct: true },
    take: 40,
    orderBy: { createdAt: "desc" },
  });

  if (attempts.length < 5) return "medium";

  const accuracy = attempts.filter((a) => a.correct).length / attempts.length;
  if (accuracy >= 0.85) return "hard";
  if (accuracy <= 0.45) return "easy";
  return "medium";
}
