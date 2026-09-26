-- Additive: owner attestation may leave unknown license fields null.
-- scripts/ngn/publish.ts may set ngn_item / ngn_case status in production
-- when --apply is explicit. It does not edit stems, options, keys, or rationales.

ALTER TABLE "ngn_item_review" ALTER COLUMN "license_number" DROP NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "license_state" DROP NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "multistate_nlc" DROP NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "multistate_nlc" DROP DEFAULT;
ALTER TABLE "ngn_item_review" ALTER COLUMN "nursys_verified_on" DROP NOT NULL;
ALTER TABLE "ngn_item_review" ALTER COLUMN "nursys_result" DROP NOT NULL;

-- Two licensed approvers, or one RN owner attestation, open the review half.
-- Application canPublish() still requires validators to be green.
CREATE OR REPLACE FUNCTION "canPublish"(item_id text, version integer)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT
      (
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
      )
      OR
      (
        SELECT COUNT(*) >= 1
        FROM ngn_item_review
        WHERE ngn_item_review.item_id = $1
          AND ngn_item_review.item_version = $2
          AND decision = 'approve'
          AND license_type IS NOT NULL
          AND btrim(license_type) = 'RN'
          AND comments = 'owner attestation'
          AND reviewer_name IS NOT NULL
          AND btrim(reviewer_name) <> ''
      )
$$;
