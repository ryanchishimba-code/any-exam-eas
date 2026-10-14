-- Precomputed active-question groups for marketing and Qbank counts.
--
-- Additive. Creates two new tables and does not lock or rewrite
-- "QuestionBankItem". The live count scans option JSON on every bank row
-- and exceeds the 5s statement timeout; an index on that table would not
-- remove the JSON work, so the sync cron writes the groups here instead.
--
-- The write path deletes and inserts only these tables, inside one short
-- transaction, after the live scan has finished. Readers keep the previous
-- snapshot until that transaction commits.
--
-- Rollback, after the app is no longer reading these tables:
--   DROP TABLE IF EXISTS "ActiveInventoryCount";
--   DROP TABLE IF EXISTS "ActiveInventoryStampRow";

-- CreateTable
CREATE TABLE "ActiveInventoryCount" (
    "fieldId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL DEFAULT '',
    "clientNeeds" TEXT NOT NULL DEFAULT '',
    "itemType" TEXT NOT NULL DEFAULT 'mcq',
    "count" INTEGER NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveInventoryCount_pkey" PRIMARY KEY ("fieldId","subjectId","clientNeeds","itemType")
);

-- CreateTable
CREATE TABLE "ActiveInventoryStampRow" (
    "id" INTEGER NOT NULL,
    "published" INTEGER NOT NULL,
    "touchedAt" TIMESTAMP(3),
    "refreshedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveInventoryStampRow_pkey" PRIMARY KEY ("id")
);
