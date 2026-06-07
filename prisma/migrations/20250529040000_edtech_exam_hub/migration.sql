-- Edtech Study Hub: exams, preferences, high-yield topics, topic progress

CREATE TABLE "Exam" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "simulatedDurationMin" INTEGER NOT NULL,
    "simulatedQuestionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Exam_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "UserExamPreference" (
    "userId" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "lastStudiedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserExamPreference_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "HighYieldTopic" (
    "id" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "keyConcepts" JSONB NOT NULL,
    "mustKnowFacts" JSONB NOT NULL,
    "pearls" JSONB NOT NULL,
    "pitfalls" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "practiceTopicSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HighYieldTopic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserTopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "lastViewedAt" TIMESTAMP(3),
    "practiceCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserTopicProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HighYieldTopic_examSlug_slug_key" ON "HighYieldTopic"("examSlug", "slug");
CREATE INDEX "HighYieldTopic_examSlug_sortOrder_idx" ON "HighYieldTopic"("examSlug", "sortOrder");
CREATE INDEX "HighYieldTopic_examSlug_category_idx" ON "HighYieldTopic"("examSlug", "category");
CREATE UNIQUE INDEX "UserTopicProgress_userId_topicId_key" ON "UserTopicProgress"("userId", "topicId");
CREATE INDEX "UserTopicProgress_userId_idx" ON "UserTopicProgress"("userId");

ALTER TABLE "UserExamPreference" ADD CONSTRAINT "UserExamPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserExamPreference" ADD CONSTRAINT "UserExamPreference_examSlug_fkey" FOREIGN KEY ("examSlug") REFERENCES "Exam"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "HighYieldTopic" ADD CONSTRAINT "HighYieldTopic_examSlug_fkey" FOREIGN KEY ("examSlug") REFERENCES "Exam"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HighYieldTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
