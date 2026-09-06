-- Mastery Engine: UserCellState + optional NCLEX item tags
CREATE TABLE IF NOT EXISTS "UserCellState" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "examSlug" TEXT NOT NULL,
  "cellKey" TEXT NOT NULL,
  "systemKey" TEXT NOT NULL,
  "topicKey" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'unseen',
  "itemsAnswered" INTEGER NOT NULL DEFAULT 0,
  "recentTutorJson" TEXT NOT NULL DEFAULT '[]',
  "recentTimedJson" TEXT NOT NULL DEFAULT '[]',
  "lastSessionAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserCellState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserCellState_userId_examSlug_cellKey_key"
  ON "UserCellState"("userId", "examSlug", "cellKey");

CREATE INDEX IF NOT EXISTS "UserCellState_userId_examSlug_state_idx"
  ON "UserCellState"("userId", "examSlug", "state");

CREATE INDEX IF NOT EXISTS "UserCellState_userId_examSlug_systemKey_idx"
  ON "UserCellState"("userId", "examSlug", "systemKey");

DO $$ BEGIN
  ALTER TABLE "UserCellState"
    ADD CONSTRAINT "UserCellState_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "clientNeeds" TEXT;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "cjmmFunction" TEXT;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_clientNeeds_idx"
  ON "QuestionBankItem"("fieldId", "clientNeeds");
