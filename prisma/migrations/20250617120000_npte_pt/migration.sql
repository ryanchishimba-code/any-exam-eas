-- NPTE-PT exam infrastructure: FSBPT 2024 blueprint reference tables + read-only questions view.

CREATE TABLE IF NOT EXISTS "npte_pt_blueprint_categories" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "kind"        TEXT NOT NULL,
  "label"       TEXT NOT NULL,
  "weight"      DOUBLE PRECISION NOT NULL,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "npte_pt_blueprint_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "npte_pt_blueprint_categories_slug_key"
  ON "npte_pt_blueprint_categories"("slug");

CREATE INDEX IF NOT EXISTS "npte_pt_blueprint_categories_kind_sortOrder_idx"
  ON "npte_pt_blueprint_categories"("kind", "sortOrder");

CREATE TABLE IF NOT EXISTS "npte_pt_topics" (
  "id"               TEXT NOT NULL,
  "slug"             TEXT NOT NULL,
  "label"            TEXT NOT NULL,
  "contentCategory"  TEXT,
  "taskCategory"     TEXT,
  "subjectId"        TEXT,
  "reviewModuleSlug" TEXT,
  "sortOrder"        INTEGER NOT NULL DEFAULT 0,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "npte_pt_topics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "npte_pt_topics_slug_key"
  ON "npte_pt_topics"("slug");

CREATE INDEX IF NOT EXISTS "npte_pt_topics_contentCategory_sortOrder_idx"
  ON "npte_pt_topics"("contentCategory", "sortOrder");

CREATE INDEX IF NOT EXISTS "npte_pt_topics_subjectId_idx"
  ON "npte_pt_topics"("subjectId");

-- FSBPT 2024 body-system content areas (~72% of exam).
INSERT INTO "npte_pt_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('npte-cat-msk',              'musculoskeletal',           'body-system', 'Musculoskeletal System',              0.20,  0, 'Largest content area — ortho, manual therapy, exercise prescription'),
  ('npte-cat-neuro',            'neuromuscular-nervous',     'body-system', 'Neuromuscular & Nervous Systems',     0.17,  1, 'Stroke, SCI, TBI, Parkinson, gait and balance'),
  ('npte-cat-cardiopulm',       'cardiovascular-pulmonary',  'body-system', 'Cardiovascular & Pulmonary Systems', 0.10,  2, 'COPD, CHF, post-MI rehab, oxygen titration'),
  ('npte-cat-integumentary',    'integumentary',             'body-system', 'Integumentary System',                0.04,  3, 'Pressure injuries, wound care, burns'),
  ('npte-cat-metabolic',        'metabolic-endocrine',       'body-system', 'Metabolic & Endocrine Systems',       0.02,  4, 'Diabetes exercise, osteoporosis'),
  ('npte-cat-gi',               'gastrointestinal',          'body-system', 'Gastrointestinal System',             0.018, 5, 'Post-abdominal surgery, pelvic floor'),
  ('npte-cat-gu',               'genitourinary',             'body-system', 'Genitourinary System',                0.014, 6, 'Incontinence, pelvic floor'),
  ('npte-cat-lymphatic',        'lymphatic',                 'body-system', 'Lymphatic System',                    0.022, 7, 'Lymphedema, CDT'),
  ('npte-cat-system-interact',  'system-interactions',       'body-system', 'System Interactions',               0.036, 8, 'Comorbidities, frailty, multi-system cases')
ON CONFLICT ("slug") DO NOTHING;

-- FSBPT 2024 non-system content areas (~28%).
INSERT INTO "npte_pt_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('npte-cat-equipment',        'equipment-devices',         'non-system', 'Equipment, Devices & Technologies',   0.022, 10, 'Wheelchair, AD, orthotics, prosthetics'),
  ('npte-cat-modalities',       'therapeutic-modalities',    'non-system', 'Therapeutic Modalities',            0.02,  11, 'US, e-stim, heat, cold'),
  ('npte-cat-safety',           'safety-protection',         'non-system', 'Safety & Protection',               0.024, 12, 'Falls, BBP, body mechanics'),
  ('npte-cat-professional',     'professional-responsibilities', 'non-system', 'Professional Responsibilities', 0.018, 13, 'Ethics, documentation, supervision'),
  ('npte-cat-research',         'research-evidence',         'non-system', 'Research & Evidence-Based Practice', 0.016, 14, 'EBP, outcome measures, study design')
ON CONFLICT ("slug") DO NOTHING;

-- FSBPT process categories (examination, evaluation/Dx/prognosis, interventions).
INSERT INTO "npte_pt_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('npte-task-examination',     'examination',                    'process', 'Physical Therapy Examination',                    0.18, 20, NULL),
  ('npte-task-evaluation',      'evaluation-diagnosis-prognosis', 'process', 'Evaluation, Differential Diagnosis & Prognosis', 0.24, 21, NULL),
  ('npte-task-interventions',   'interventions',                  'process', 'Interventions',                                   0.21, 22, NULL)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "npte_pt_topics" ("id", "slug", "label", "contentCategory", "taskCategory", "subjectId", "reviewModuleSlug", "sortOrder")
VALUES
  ('npte-t-msk-shoulder',     'rotator-cuff',        'Rotator Cuff Rehabilitation',     'musculoskeletal',          'interventions',                  'musculoskeletal',          'msk-rehabilitation', 0),
  ('npte-t-msk-knee',         'acl-rehab',           'ACL Reconstruction Rehab',        'musculoskeletal',          'interventions',                  'musculoskeletal',          'msk-rehabilitation', 1),
  ('npte-t-msk-spine',        'low-back-pain',       'Low Back Pain Management',        'musculoskeletal',          'evaluation-diagnosis-prognosis', 'musculoskeletal',          'msk-rehabilitation', 2),
  ('npte-t-neuro-stroke',     'stroke-rehab',        'Post-Stroke Rehabilitation',      'neuromuscular-nervous',    'interventions',                  'neuromuscular-nervous',    'stroke-rehabilitation', 0),
  ('npte-t-neuro-sci',        'sci-mobility',        'SCI Mobility & Wheelchair',       'neuromuscular-nervous',    'interventions',                  'neuromuscular-nervous',    'stroke-rehabilitation', 1),
  ('npte-t-neuro-parkinson',  'parkinson-gait',      'Parkinson Disease Gait Training', 'neuromuscular-nervous',    'interventions',                  'neuromuscular-nervous',    NULL, 2),
  ('npte-t-cardio-copd',      'copd-rehab',          'COPD Pulmonary Rehabilitation',   'cardiovascular-pulmonary', 'interventions',                  'cardiovascular-pulmonary', 'cardiopulmonary-rehab', 0),
  ('npte-t-cardio-chf',       'chf-exercise',        'CHF Exercise Prescription',       'cardiovascular-pulmonary', 'interventions',                  'cardiovascular-pulmonary', 'cardiopulmonary-rehab', 1),
  ('npte-t-modality-us',      'therapeutic-ultrasound', 'Therapeutic Ultrasound',       'therapeutic-modalities',   'interventions',                  'therapeutic-modalities',   'therapeutic-modalities', 0),
  ('npte-t-safety-falls',     'fall-prevention',     'Fall Prevention',                 'safety-protection',        'interventions',                  'safety-protection',          NULL, 0),
  ('npte-t-prof-ethics',      'pt-ethics',           'Professional Ethics & Scope',     'professional-responsibilities', 'evaluation-diagnosis-prognosis', 'professional-responsibilities', NULL, 0)
ON CONFLICT ("slug") DO NOTHING;

CREATE OR REPLACE VIEW "npte_pt_questions" AS
SELECT
  "id",
  "fieldId" AS "field_id",
  "subjectId" AS "subject_id",
  "scenario" AS "vignette",
  "question" AS "question_text",
  "options",
  "correctAnswer" AS "correct_answer",
  "explanation",
  "difficulty",
  "topicCategory" AS "topic_category",
  "blueprintDomain" AS "blueprint_domain",
  "taskCategory" AS "task_category",
  "blueprintTopic" AS "blueprint_topic",
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
  "lastReviewedAt" AS "last_reviewed_at",
  "createdAt" AS "created_at",
  "updatedAt" AS "updated_at"
FROM "QuestionBankItem"
WHERE "fieldId" = 'npte-pt';
