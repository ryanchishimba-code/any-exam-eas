-- One shared faculty pass. Complimentary days only: no Stripe coupon, no card,
-- no renewal. Inserted when this migration is applied. Safe to re-run.
INSERT INTO "PromoCode" (
  "id",
  "code",
  "discountPercent",
  "discountAmount",
  "expiryDate",
  "maxUses",
  "currentUses",
  "stripeCouponId",
  "compDays",
  "audience",
  "campaign",
  "active",
  "createdAt",
  "updatedAt"
) VALUES (
  'faculty_outreach_2026',
  'FACULTY30',
  NULL,
  NULL,
  TIMESTAMP '2027-05-09 23:59:59',
  50,
  0,
  NULL,
  30,
  'faculty',
  'Faculty outreach',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("code") DO NOTHING;
