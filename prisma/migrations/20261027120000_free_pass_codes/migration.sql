-- Single-use complimentary passes. Nullable columns; existing discount codes stay discounts.
-- Do not apply this migration to production until the owner asks. Preview builds that
-- share the production DATABASE_URL will run `prisma migrate deploy` and add these columns.
ALTER TABLE "PromoCode" ADD COLUMN "compDays" INTEGER;
ALTER TABLE "PromoCode" ADD COLUMN "audience" TEXT;
