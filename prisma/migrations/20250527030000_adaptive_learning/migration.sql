-- Adaptive learning: mastery profiles, enriched attempts
ALTER TABLE "QuestionAttempt" ADD COLUMN "tagsJson" TEXT;
ALTER TABLE "QuestionAttempt" ADD COLUMN "mistakeCategory" TEXT;
ALTER TABLE "QuestionAttempt" ADD COLUMN "guessedCorrect" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "QuestionAttempt" ADD COLUMN "difficultyAtAttempt" TEXT;

CREATE INDEX "QuestionAttempt_userId_mistakeCategory_idx" ON "QuestionAttempt"("userId", "mistakeCategory");

CREATE TABLE "LearningProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "studyStreakDays" INTEGER NOT NULL DEFAULT 0,
    "lastStudiedAt" TIMESTAMP(3),
    "metadataJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConceptMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "conceptKey" TEXT NOT NULL,
    "masteryScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retentionStrength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidenceReliability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptMastery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearningProfile_userId_key" ON "LearningProfile"("userId");
CREATE UNIQUE INDEX "ConceptMastery_userId_fieldId_conceptKey_key" ON "ConceptMastery"("userId", "fieldId", "conceptKey");
CREATE INDEX "ConceptMastery_userId_fieldId_masteryScore_idx" ON "ConceptMastery"("userId", "fieldId", "masteryScore");

ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConceptMastery" ADD CONSTRAINT "ConceptMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
