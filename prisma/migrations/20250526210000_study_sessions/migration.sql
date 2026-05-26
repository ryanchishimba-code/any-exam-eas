-- Study session engine: attempts + persisted sessions
CREATE TABLE "QuestionAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "bankItemId" TEXT,
    "fieldId" TEXT NOT NULL,
    "subjectId" TEXT,
    "questionType" TEXT NOT NULL DEFAULT 'multiple_choice',
    "stemPreview" TEXT,
    "correct" BOOLEAN NOT NULL,
    "confidence" INTEGER,
    "durationMs" INTEGER,
    "selectedAnswer" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "fieldId" TEXT NOT NULL,
    "subjectId" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'practice',
    "stateJson" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" REAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "QuestionAttempt_userId_fieldId_createdAt_idx" ON "QuestionAttempt"("userId", "fieldId", "createdAt");
CREATE INDEX "QuestionAttempt_userId_correct_createdAt_idx" ON "QuestionAttempt"("userId", "correct", "createdAt");
CREATE INDEX "QuestionAttempt_questionKey_correct_idx" ON "QuestionAttempt"("questionKey", "correct");
CREATE INDEX "QuestionAttempt_bankItemId_idx" ON "QuestionAttempt"("bankItemId");
CREATE INDEX "StudySession_userId_updatedAt_idx" ON "StudySession"("userId", "updatedAt");
CREATE INDEX "StudySession_userId_completed_idx" ON "StudySession"("userId", "completed");
