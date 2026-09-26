-- Reverse the owner-attestation nullability. Fails if any license field is null.
UPDATE "ngn_item_review" SET "multistate_nlc" = false WHERE "multistate_nlc" IS NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "license_number" SET NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "license_state" SET NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "multistate_nlc" SET DEFAULT false;
ALTER TABLE "ngn_item_review" ALTER COLUMN "multistate_nlc" SET NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "nursys_verified_on" SET NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "nursys_result" SET NOT NULL;

CREATE OR REPLACE FUNCTION "canPublish"(item_id text, version integer)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(DISTINCT reviewer_user_id) >= 2
    FROM ngn_item_review
    WHERE ngn_item_review.item_id = $1
      AND ngn_item_review.item_version = $2
      AND decision = 'approve'
      AND reviewer_user_id IS NOT NULL
      AND btrim(reviewer_user_id) <> ''
      AND license_type IS NOT NULL
      AND btrim(license_type) <> ''
      AND license_number IS NOT NULL
      AND btrim(license_number) <> ''
      AND license_state IS NOT NULL
      AND btrim(license_state) <> ''
$$;
