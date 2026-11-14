-- CreateTable
CREATE TABLE "CrosswordProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "lastDate" TEXT,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "games" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrosswordProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrosswordProgress_userId_board_key" ON "CrosswordProgress"("userId", "board");

-- CreateIndex
CREATE INDEX "CrosswordProgress_userId_idx" ON "CrosswordProgress"("userId");

-- AddForeignKey
ALTER TABLE "CrosswordProgress" ADD CONSTRAINT "CrosswordProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
