-- Memory card mastery for Reference Hub (got-it / need-review)

CREATE TABLE "MemoryCardMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryCardMastery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemoryCardMastery_userId_examSlug_cardId_key" ON "MemoryCardMastery"("userId", "examSlug", "cardId");
CREATE INDEX "MemoryCardMastery_userId_examSlug_status_idx" ON "MemoryCardMastery"("userId", "examSlug", "status");
CREATE INDEX "MemoryCardMastery_userId_examSlug_updatedAt_idx" ON "MemoryCardMastery"("userId", "examSlug", "updatedAt");

ALTER TABLE "MemoryCardMastery" ADD CONSTRAINT "MemoryCardMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
