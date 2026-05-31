-- Top 300 Drugs canonical catalog table
CREATE TABLE "Top300Drug" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "generic" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "drugClass" TEXT NOT NULL,
    "indications" TEXT NOT NULL,
    "sideEffects" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "examNclex" BOOLEAN NOT NULL DEFAULT true,
    "examUsmle" BOOLEAN NOT NULL DEFAULT true,
    "examNaplex" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Top300Drug_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Top300Drug_rank_key" ON "Top300Drug"("rank");
CREATE INDEX "Top300Drug_category_idx" ON "Top300Drug"("category");
CREATE INDEX "Top300Drug_examNclex_idx" ON "Top300Drug"("examNclex");
CREATE INDEX "Top300Drug_examUsmle_idx" ON "Top300Drug"("examUsmle");
CREATE INDEX "Top300Drug_examNaplex_idx" ON "Top300Drug"("examNaplex");
