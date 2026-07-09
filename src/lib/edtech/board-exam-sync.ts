import { cacheGetOrSetDeduped, cacheKey, CACHE_TTL } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { EXAM_CATALOG, EXAM_SLUGS, isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

const BOARD_EXAM_BOOTSTRAP_KEY = cacheKey(["board-exams", "bootstrapped"]);

function boardExamFields(slug: ExamSlug) {
  const exam = EXAM_CATALOG[slug];
  return {
    slug,
    name: exam.name,
    shortName: exam.shortName,
    fieldId: exam.fieldId,
    description: exam.description,
    simulatedDurationMin: exam.simulatedDurationMin,
    simulatedQuestionCount: exam.simulatedQuestionCount,
  };
}

/** Ensures a BoardExam row exists so UserExamPreference FK writes succeed without manual seed. */
export async function ensureBoardExam(slug: ExamSlug): Promise<void> {
  if (!isExamSlug(slug)) return;

  const fields = boardExamFields(slug);
  await prisma.boardExam.upsert({
    where: { slug },
    create: fields,
    update: {
      name: fields.name,
      shortName: fields.shortName,
      fieldId: fields.fieldId,
      description: fields.description,
      simulatedDurationMin: fields.simulatedDurationMin,
      simulatedQuestionCount: fields.simulatedQuestionCount,
    },
  });
}

/**
 * Idempotent bootstrap for all catalog exams.
 * Serialized upserts + cross-instance dedup — avoids P2024 pool timeouts when
 * connection_limit=1 on Vercel serverless.
 */
export async function ensureAllBoardExams(): Promise<void> {
  await cacheGetOrSetDeduped(
    BOARD_EXAM_BOOTSTRAP_KEY,
    CACHE_TTL.examCatalog,
    async () => {
      for (const slug of EXAM_SLUGS) {
        await ensureBoardExam(slug);
      }
      return true;
    }
  );
}
