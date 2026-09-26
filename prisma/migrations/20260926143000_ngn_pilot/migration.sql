-- NGN pilot tables. Additive only.
-- Does not ALTER, DROP, or write QuestionBankItem or any existing table.
-- Apply on a non-production database only. This pull request does not run it.

CREATE TABLE "ngn_import_batch" (
    "batch_id" TEXT NOT NULL,
    "schema_version" TEXT NOT NULL,
    "board_profile" TEXT NOT NULL,
    "source_sha256" TEXT NOT NULL,
    "sources" JSONB NOT NULL,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imported_by" TEXT,
    "row_counts" JSONB NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ngn_import_batch_pkey" PRIMARY KEY ("batch_id")
);

CREATE TABLE "ngn_case" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "batch_id" TEXT NOT NULL,
    "board_profile" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "primary_client_need" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "patient" JSONB NOT NULL,
    "timepoints" JSONB NOT NULL,
    "chart" JSONB NOT NULL,
    "reveal_rule" TEXT NOT NULL,
    "references" JSONB NOT NULL,
    "supersedes_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ngn_case_pkey" PRIMARY KEY ("id", "version"),
    CONSTRAINT "ngn_case_status_chk" CHECK ("status" IN ('draft', 'in_review', 'approved', 'pilot', 'published', 'retired'))
);

CREATE TABLE "ngn_item" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "batch_id" TEXT NOT NULL,
    "case_id" TEXT,
    "case_version" INTEGER,
    "case_step" INTEGER,
    "item_type" TEXT NOT NULL,
    "cjmm_function" JSONB NOT NULL,
    "timepoint" TEXT,
    "response_format" TEXT NOT NULL,
    "scoring_rule" TEXT NOT NULL,
    "max_points" INTEGER NOT NULL,
    "stem" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "exhibit" JSONB,
    "rationale" JSONB NOT NULL,
    "client_needs" JSONB NOT NULL,
    "references" JSONB NOT NULL,
    "rn_flags" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "supersedes_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ngn_item_pkey" PRIMARY KEY ("id", "version"),
    CONSTRAINT "ngn_item_status_chk" CHECK ("status" IN ('draft', 'in_review', 'approved', 'pilot', 'published', 'retired')),
    CONSTRAINT "ngn_item_type_chk" CHECK ("item_type" IN ('case_item', 'bowtie', 'trend')),
    CONSTRAINT "ngn_item_format_chk" CHECK ("response_format" IN (
        'mc_single', 'mr_sata', 'mr_select_n', 'matrix_mc', 'matrix_mr',
        'dropdown_cloze', 'dropdown_rationale', 'highlight_text', 'bowtie'
    )),
    CONSTRAINT "ngn_item_scoring_chk" CHECK ("scoring_rule" IN ('zero_one', 'plus_minus', 'rationale')),
    CONSTRAINT "ngn_item_case_step_chk" CHECK ("case_step" IS NULL OR ("case_step" >= 1 AND "case_step" <= 6)),
    CONSTRAINT "ngn_item_max_points_chk" CHECK ("max_points" >= 0),
    CONSTRAINT "ngn_item_case_link_chk" CHECK (
        (
            "item_type" IN ('bowtie', 'trend')
            AND "case_id" IS NULL
            AND "case_version" IS NULL
            AND "case_step" IS NULL
        )
        OR
        (
            "item_type" = 'case_item'
            AND "case_id" IS NOT NULL
            AND "case_version" IS NOT NULL
            AND "case_step" BETWEEN 1 AND 6
        )
    )
);

CREATE TABLE "ngn_item_review" (
    "id" UUID NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_version" INTEGER NOT NULL,
    "reviewer_user_id" TEXT NOT NULL,
    "reviewer_name" TEXT NOT NULL,
    "license_type" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_state" TEXT NOT NULL,
    "multistate_nlc" BOOLEAN NOT NULL DEFAULT false,
    "nursys_verified_on" DATE NOT NULL,
    "nursys_result" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "rubric" JSONB NOT NULL,
    "flag_resolutions" JSONB NOT NULL,
    "comments" TEXT NOT NULL DEFAULT '',
    "minutes_spent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ngn_item_review_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ngn_item_review_decision_chk" CHECK ("decision" IN ('approve', 'revise', 'reject')),
    CONSTRAINT "ngn_item_review_minutes_chk" CHECK ("minutes_spent" >= 0)
);

CREATE INDEX "ngn_case_batch_id_idx" ON "ngn_case"("batch_id");
CREATE INDEX "ngn_case_status_idx" ON "ngn_case"("status");
CREATE INDEX "ngn_item_batch_id_idx" ON "ngn_item"("batch_id");
CREATE INDEX "ngn_item_status_idx" ON "ngn_item"("status");
CREATE INDEX "ngn_item_case_idx" ON "ngn_item"("case_id", "case_version");
CREATE INDEX "ngn_item_review_item_idx" ON "ngn_item_review"("item_id", "item_version");

ALTER TABLE "ngn_case"
    ADD CONSTRAINT "ngn_case_batch_id_fkey"
    FOREIGN KEY ("batch_id") REFERENCES "ngn_import_batch"("batch_id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ngn_item"
    ADD CONSTRAINT "ngn_item_batch_id_fkey"
    FOREIGN KEY ("batch_id") REFERENCES "ngn_import_batch"("batch_id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ngn_item"
    ADD CONSTRAINT "ngn_item_case_fkey"
    FOREIGN KEY ("case_id", "case_version") REFERENCES "ngn_case"("id", "version")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Append-only, except a transaction-local restore that sets ngn.allow_review_delete=on.
CREATE OR REPLACE FUNCTION ngn_item_review_append_only()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' AND current_setting('ngn.allow_review_delete', true) = 'on' THEN
        RETURN OLD;
    END IF;
    RAISE EXCEPTION 'ngn_item_review is append-only';
END;
$$;

CREATE TRIGGER ngn_item_review_append_only
BEFORE UPDATE OR DELETE ON ngn_item_review
FOR EACH ROW
EXECUTE FUNCTION ngn_item_review_append_only();

-- Review half of the publish gate: two distinct approvers with license fields.
-- Application canPublish() also requires validators to be green. There is no publish button.
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
