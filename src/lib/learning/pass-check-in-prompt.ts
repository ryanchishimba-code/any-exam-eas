import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { isPassCheckInResult, shouldShowPassCheckIn } from "@/lib/learning/pass-check-in";
import { prisma } from "@/lib/prisma";
import type { ExamSlug } from "@/types/edtech";

export type PassCheckInPromptModel = {
  examName: string | null;
  examSlug: string | null;
};

/** Null when the student should not see the prompt, or the table is not migrated yet. */
export async function loadPassCheckInPrompt(userId: string): Promise<PassCheckInPromptModel | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });
    if (!user) return null;

    const [meta, pref, latest] = await Promise.all([
      getUserEdtechMetadata(userId),
      getUserExamPreference(userId).catch(() => null),
      prisma.examPassCheckIn.findFirst({
        where: { userId },
        orderBy: { recordedAt: "desc" },
        select: { result: true, recordedAt: true },
      }),
    ]);

    const examDates = Object.values(meta.examTestDates ?? {});
    const recorded =
      latest && isPassCheckInResult(latest.result)
        ? { result: latest.result, recordedAt: latest.recordedAt }
        : null;

    if (
      !shouldShowPassCheckIn({
        now: new Date(),
        accountCreatedAt: user.createdAt,
        examDates,
        latest: recorded,
      })
    ) {
      return null;
    }

    const examSlug = pref?.examSlug ?? null;
    const examName =
      examSlug && examSlug in EXAM_CATALOG ? EXAM_CATALOG[examSlug as ExamSlug].shortName : null;
    return { examName, examSlug };
  } catch (error) {
    console.warn(
      "[pass-check-in] prompt unavailable:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
