-- Marketing campaign label. Nullable so existing discount codes stay unlabeled.
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "campaign" TEXT;
