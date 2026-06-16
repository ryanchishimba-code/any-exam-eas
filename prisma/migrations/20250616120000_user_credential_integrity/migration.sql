ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordAlgo" TEXT DEFAULT 'bcrypt_12';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordUpdatedAt" TIMESTAMP(3);

UPDATE "User"
SET "passwordAlgo" = 'bcrypt_12'
WHERE "passwordHash" IS NOT NULL
  AND ("passwordAlgo" IS NULL OR "passwordAlgo" = '');

UPDATE "User"
SET email = lower(trim(email))
WHERE email <> lower(trim(email));
