-- Hybrid GA4 + internal conversion tracking (Neon Postgres)
CREATE TABLE "ConversionEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "sessionId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'web',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ConversionEvent_eventName_createdAt_idx" ON "ConversionEvent"("eventName", "createdAt");
CREATE INDEX "ConversionEvent_userId_createdAt_idx" ON "ConversionEvent"("userId", "createdAt");
CREATE INDEX "ConversionEvent_sessionId_createdAt_idx" ON "ConversionEvent"("sessionId", "createdAt");
CREATE INDEX "ConversionEvent_createdAt_idx" ON "ConversionEvent"("createdAt");

ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
