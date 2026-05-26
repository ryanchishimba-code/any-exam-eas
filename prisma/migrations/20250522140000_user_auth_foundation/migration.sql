-- User account foundation: track last successful login
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
