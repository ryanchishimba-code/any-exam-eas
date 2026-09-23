-- Confirmed mark-mastered rows for Review incorrect.
-- A later miss reopens the item in the shared mastery machine; this table is not a hard delete.

CREATE TABLE "RemediationMasteryMark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RemediationMasteryMark_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RemediationMasteryMark_userId_fieldId_itemId_key" ON "RemediationMasteryMark"("userId", "fieldId", "itemId");
CREATE INDEX "RemediationMasteryMark_userId_fieldId_idx" ON "RemediationMasteryMark"("userId", "fieldId");

ALTER TABLE "RemediationMasteryMark" ADD CONSTRAINT "RemediationMasteryMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
