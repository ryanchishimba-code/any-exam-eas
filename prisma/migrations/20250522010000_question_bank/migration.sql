-- CreateTable
CREATE TABLE "QuestionBankItem" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "solutionSteps" TEXT,
    "tags" TEXT,
    "source" TEXT NOT NULL DEFAULT 'seed',
    "contentHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBankItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBankSync" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itemsTotal" INTEGER NOT NULL,
    "itemsCreated" INTEGER NOT NULL,
    "itemsUpdated" INTEGER NOT NULL,
    "itemsSkipped" INTEGER NOT NULL,
    "itemsRetired" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "finishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionBankSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBankItem_contentHash_key" ON "QuestionBankItem"("contentHash");

-- CreateIndex
CREATE INDEX "QuestionBankItem_fieldId_subjectId_active_idx" ON "QuestionBankItem"("fieldId", "subjectId", "active");
