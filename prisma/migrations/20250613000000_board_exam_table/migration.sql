-- Board exam catalog uses BoardExam; legacy user-generated exams stay on Exam (GeneratedExam).

CREATE TABLE IF NOT EXISTS "BoardExam" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "simulatedDurationMin" INTEGER NOT NULL,
    "simulatedQuestionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BoardExam_pkey" PRIMARY KEY ("slug")
);

ALTER TABLE "UserExamPreference" DROP CONSTRAINT IF EXISTS "UserExamPreference_examSlug_fkey";
ALTER TABLE "UserExamPreference" ADD CONSTRAINT "UserExamPreference_examSlug_fkey"
  FOREIGN KEY ("examSlug") REFERENCES "BoardExam"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "HighYieldTopic" DROP CONSTRAINT IF EXISTS "HighYieldTopic_examSlug_fkey";
ALTER TABLE "HighYieldTopic" ADD CONSTRAINT "HighYieldTopic_examSlug_fkey"
  FOREIGN KEY ("examSlug") REFERENCES "BoardExam"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
