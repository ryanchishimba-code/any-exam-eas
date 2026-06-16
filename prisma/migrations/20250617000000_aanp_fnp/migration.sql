-- AANP FNP exam infrastructure: blueprint reference tables, patient age group tagging,
-- and a read-only view over the shared QuestionBankItem table (fieldId = 'aanp-fnp').

-- Patient lifespan band for AANP FNP analytics (cross-cutting blueprint dimension).
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "patientAgeGroup" TEXT;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_patientAgeGroup_active_idx"
  ON "QuestionBankItem" ("fieldId", "patientAgeGroup", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_blueprintDomain_patientAgeGroup_active_idx"
  ON "QuestionBankItem" ("fieldId", "blueprintDomain", "patientAgeGroup", "active");

-- Official AANPCB FNP blueprint categories (domains + patient age groups + clinical systems).
CREATE TABLE IF NOT EXISTS "aanp_fnp_blueprint_categories" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "kind"        TEXT NOT NULL,
  "label"       TEXT NOT NULL,
  "weight"      DOUBLE PRECISION NOT NULL,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "aanp_fnp_blueprint_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "aanp_fnp_blueprint_categories_slug_key"
  ON "aanp_fnp_blueprint_categories"("slug");

CREATE INDEX IF NOT EXISTS "aanp_fnp_blueprint_categories_kind_sortOrder_idx"
  ON "aanp_fnp_blueprint_categories"("kind", "sortOrder");

-- High-yield topics linked to blueprint domains and clinical systems.
CREATE TABLE IF NOT EXISTS "aanp_fnp_topics" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "label"       TEXT NOT NULL,
  "categorySlug" TEXT,
  "domainSlug"  TEXT,
  "subjectId"   TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "aanp_fnp_topics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "aanp_fnp_topics_slug_key"
  ON "aanp_fnp_topics"("slug");

CREATE INDEX IF NOT EXISTS "aanp_fnp_topics_domainSlug_sortOrder_idx"
  ON "aanp_fnp_topics"("domainSlug", "sortOrder");

CREATE INDEX IF NOT EXISTS "aanp_fnp_topics_subjectId_idx"
  ON "aanp_fnp_topics"("subjectId");

-- Seed blueprint domains (AANPCB 2024+ content outline).
INSERT INTO "aanp_fnp_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('aanp-dom-assess',   'assess',   'domain', 'Assess',   0.32,   0, 'Domain I — health assessment, screening, diagnostic selection'),
  ('aanp-dom-diagnose', 'diagnose', 'domain', 'Diagnose', 0.265,  1, 'Domain II — differential diagnosis and clinical reasoning'),
  ('aanp-dom-plan',     'plan',     'domain', 'Plan',     0.265,  2, 'Domain III — pharmacologic and non-pharmacologic therapy'),
  ('aanp-dom-evaluate', 'evaluate', 'domain', 'Evaluate', 0.15,   3, 'Domain IV — outcomes monitoring and care plan modification')
ON CONFLICT ("slug") DO NOTHING;

-- Seed patient age groups (cross-cutting lifespan distribution).
INSERT INTO "aanp_fnp_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('aanp-age-newborn',      'newborn',      'age_group', 'Newborn (0–28 days)',       0.02,  10, NULL),
  ('aanp-age-infant',       'infant',       'age_group', 'Infant (1–12 months)',      0.03,  11, NULL),
  ('aanp-age-toddler',      'toddler',      'age_group', 'Toddler (1–3 years)',       0.04,  12, NULL),
  ('aanp-age-child',        'child',        'age_group', 'Child (3–12 years)',        0.04,  13, NULL),
  ('aanp-age-adolescent',   'adolescent',   'age_group', 'Adolescent (13–17 years)',  0.09,  14, NULL),
  ('aanp-age-young-adult',  'young-adult',  'age_group', 'Young Adult (18–39 years)', 0.22,  15, NULL),
  ('aanp-age-middle-adult', 'middle-adult', 'age_group', 'Middle Adult (40–64 years)',0.26,  16, NULL),
  ('aanp-age-older-adult',  'older-adult',  'age_group', 'Older Adult (65+ years)',   0.30,  17, NULL)
ON CONFLICT ("slug") DO NOTHING;

-- Seed clinical system categories.
INSERT INTO "aanp_fnp_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('aanp-sys-cardiovascular',       'cardiovascular',       'clinical_system', 'Cardiovascular',              0, 20, NULL),
  ('aanp-sys-pulmonary',            'pulmonary',            'clinical_system', 'Pulmonary',                   0, 21, NULL),
  ('aanp-sys-endocrine',            'endocrine',            'clinical_system', 'Endocrine & Metabolic',       0, 22, NULL),
  ('aanp-sys-womens-health',        'womens-health',        'clinical_system', 'Women''s Health',             0, 23, NULL),
  ('aanp-sys-pediatrics',           'pediatrics',           'clinical_system', 'Pediatrics',                  0, 24, NULL),
  ('aanp-sys-geriatrics',           'geriatrics',           'clinical_system', 'Geriatrics',                  0, 25, NULL),
  ('aanp-sys-psychiatry-behavioral', 'psychiatry-behavioral', 'clinical_system', 'Psychiatry & Behavioral',  0, 26, NULL),
  ('aanp-sys-infectious-disease',   'infectious-disease',   'clinical_system', 'Infectious Disease',          0, 27, NULL)
ON CONFLICT ("slug") DO NOTHING;

-- Seed high-yield topics (domain + system cross-links).
INSERT INTO "aanp_fnp_topics" ("id", "slug", "label", "categorySlug", "domainSlug", "subjectId", "sortOrder")
VALUES
  ('aanp-t-assess-screening',     'assess-screening',     'Screening & Preventive Assessment', 'assess',   'assess',   'assess',   0),
  ('aanp-t-assess-pe',            'assess-physical-exam', 'Focused Physical Examination',      'assess',   'assess',   'assess',   1),
  ('aanp-t-diagnose-ddx',         'diagnose-ddx',         'Differential Diagnosis',            'diagnose', 'diagnose', 'diagnose', 0),
  ('aanp-t-diagnose-red-flags',   'diagnose-red-flags',   'Red Flag Recognition',              'diagnose', 'diagnose', 'diagnose', 1),
  ('aanp-t-plan-pharm',          'plan-pharmacotherapy', 'Pharmacotherapy Selection',         'plan',     'plan',     'plan',     0),
  ('aanp-t-plan-counseling',      'plan-counseling',      'Patient Education & Counseling',    'plan',     'plan',     'plan',     1),
  ('aanp-t-eval-monitor',         'evaluate-monitoring',  'Treatment Monitoring',              'evaluate', 'evaluate', 'evaluate', 0),
  ('aanp-t-eval-adverse',         'evaluate-adverse',     'Adverse Effects & Modification',    'evaluate', 'evaluate', 'evaluate', 1),
  ('aanp-t-cv-htn',               'cv-hypertension',      'Hypertension Management',         'cardiovascular', 'plan', 'cardiovascular', 0),
  ('aanp-t-cv-acs',               'cv-acs',               'Acute Coronary Syndrome',           'cardiovascular', 'diagnose', 'cardiovascular', 1),
  ('aanp-t-pulm-copd',            'pulm-copd',            'COPD & Asthma',                     'pulmonary', 'plan', 'pulmonary', 0),
  ('aanp-t-endo-diabetes',        'endo-diabetes',        'Diabetes Management',               'endocrine', 'plan', 'endocrine', 0),
  ('aanp-t-wh-prenatal',          'wh-prenatal',          'Prenatal Care',                     'womens-health', 'assess', 'womens-health', 0),
  ('aanp-t-peds-fever',           'peds-febrile-infant',  'Febrile Infant Workup',             'pediatrics', 'diagnose', 'pediatrics', 0),
  ('aanp-t-geri-polypharm',       'geri-polypharmacy',    'Polypharmacy & Beers Criteria',     'geriatrics', 'plan', 'geriatrics', 0),
  ('aanp-t-psych-depression',     'psych-depression',     'Major Depressive Disorder',         'psychiatry-behavioral', 'plan', 'psychiatry-behavioral', 0),
  ('aanp-t-id-cap',               'id-cap',               'Community-Acquired Pneumonia',      'infectious-disease', 'plan', 'infectious-disease', 0)
ON CONFLICT ("slug") DO NOTHING;

-- Read-only view: AANP FNP questions live in the shared QuestionBankItem table.
CREATE OR REPLACE VIEW "aanp_fnp_questions" AS
SELECT
  "id",
  "fieldId",
  "subjectId",
  "scenario" AS "vignette",
  "question" AS "question_text",
  "options",
  "correctAnswer" AS "correct_answer",
  "explanation",
  "difficulty",
  "topicCategory" AS "topic_category",
  "blueprintDomain" AS "blueprint_domain",
  "patientAgeGroup" AS "patient_age_group",
  "blueprintTopic" AS "blueprint_topic",
  "taskCategory" AS "task_category",
  "itemType" AS "item_type",
  "tags",
  "references",
  "source",
  "contentHash" AS "content_hash",
  "active",
  "qaPassed" AS "qa_passed",
  "qaAuditedAt" AS "qa_audited_at",
  "reviewStatus" AS "review_status",
  "generationVersion" AS "generation_version",
  "generationMeta" AS "generation_meta",
  "createdAt" AS "created_at",
  "updatedAt" AS "updated_at"
FROM "QuestionBankItem"
WHERE "fieldId" = 'aanp-fnp';
