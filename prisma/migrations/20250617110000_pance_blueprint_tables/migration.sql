-- PANCE exam infrastructure: NCCPA 2025 blueprint reference tables + read-only questions view.
-- Questions remain in QuestionBankItem (fieldId = 'pance'); view exposes pance_questions for analytics/SQL.

CREATE TABLE IF NOT EXISTS "pance_blueprint_categories" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "kind"        TEXT NOT NULL,
  "label"       TEXT NOT NULL,
  "weight"      DOUBLE PRECISION NOT NULL,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pance_blueprint_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "pance_blueprint_categories_slug_key"
  ON "pance_blueprint_categories"("slug");

CREATE INDEX IF NOT EXISTS "pance_blueprint_categories_kind_sortOrder_idx"
  ON "pance_blueprint_categories"("kind", "sortOrder");

CREATE TABLE IF NOT EXISTS "pance_topics" (
  "id"               TEXT NOT NULL,
  "slug"             TEXT NOT NULL,
  "label"            TEXT NOT NULL,
  "contentCategory"  TEXT,
  "taskCategory"     TEXT,
  "subjectId"        TEXT,
  "reviewModuleSlug" TEXT,
  "sortOrder"        INTEGER NOT NULL DEFAULT 0,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pance_topics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "pance_topics_slug_key"
  ON "pance_topics"("slug");

CREATE INDEX IF NOT EXISTS "pance_topics_contentCategory_sortOrder_idx"
  ON "pance_topics"("contentCategory", "sortOrder");

CREATE INDEX IF NOT EXISTS "pance_topics_subjectId_idx"
  ON "pance_topics"("subjectId");

-- NCCPA 2025 medical content categories (94% of exam; professional practice is separate 6%).
INSERT INTO "pance_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('pance-cat-cardiovascular',       'cardiovascular',       'content', 'Cardiovascular System',              0.11,  0, 'ACS, heart failure, arrhythmias, hypertension, valvular disease'),
  ('pance-cat-pulmonary',          'pulmonary',          'content', 'Pulmonary System',                   0.09,  1, 'COPD, asthma, pneumonia, PE, pleural disease'),
  ('pance-cat-gastrointestinal',   'gastrointestinal',   'content', 'Gastrointestinal System/Nutrition',  0.08,  2, 'GERD, pancreatitis, hepatitis, IBD, GI bleeding'),
  ('pance-cat-musculoskeletal',    'musculoskeletal',    'content', 'Musculoskeletal System',             0.08,  3, 'Fractures, arthritis, back pain, compartment syndrome'),
  ('pance-cat-infectious-diseases','infectious-diseases','content', 'Infectious Diseases',                0.07,  4, 'Sepsis, HIV, meningitis, skin infections, antibiotic selection'),
  ('pance-cat-neurologic',         'neurologic',         'content', 'Neurologic System',                  0.07,  5, 'Stroke, seizure, headache, MS, neuropathy'),
  ('pance-cat-psychiatry',         'psychiatry',         'content', 'Psychiatry/Behavioral Science',      0.07,  6, 'Depression, anxiety, psychosis, substance use'),
  ('pance-cat-reproductive',       'reproductive',       'content', 'Reproductive System',                0.07,  7, 'Pregnancy complications, STIs, contraception'),
  ('pance-cat-endocrine',          'endocrine',          'content', 'Endocrine System',                   0.06,  8, 'Diabetes, thyroid, DKA, adrenal disorders'),
  ('pance-cat-eent',               'eent',               'content', 'Eyes, Ears, Nose, and Throat',       0.06,  9, 'Red eye, otitis, sinusitis, pharyngitis, vertigo'),
  ('pance-cat-hematologic',        'hematologic',        'content', 'Hematologic System',                 0.05, 10, 'Anemia, coagulopathy, thrombocytopenia'),
  ('pance-cat-renal',              'renal',              'content', 'Renal System',                       0.05, 11, 'AKI, CKD, electrolytes, acid-base'),
  ('pance-cat-dermatologic',       'dermatologic',       'content', 'Dermatologic System',                0.04, 12, 'Cellulitis, rash patterns, drug eruptions'),
  ('pance-cat-genitourinary',      'genitourinary',      'content', 'Genitourinary System',               0.04, 13, 'UTI, BPH, nephrolithiasis'),
  ('pance-cat-professional-practice','professional-practice','content','Professional Practice',           0.06, 14, 'Ethics, consent, scope of practice, patient safety')
ON CONFLICT ("slug") DO NOTHING;

-- NCCPA 2025 task categories (Managing Patients subtasks included).
INSERT INTO "pance_blueprint_categories" ("id", "slug", "kind", "label", "weight", "sortOrder", "description")
VALUES
  ('pance-task-history-physical', 'history-physical', 'task', 'History Taking & Physical Examination', 0.16, 20, NULL),
  ('pance-task-diagnosis',        'diagnosis',        'task', 'Formulating Most Likely Diagnosis',   0.18, 21, NULL),
  ('pance-task-labs',             'labs',             'task', 'Using Diagnostic & Laboratory Studies', 0.10, 22, NULL),
  ('pance-task-prevention',       'prevention',       'task', 'Health Maintenance & Prevention',     0.11, 23, NULL),
  ('pance-task-intervention',     'intervention',     'task', 'Clinical Intervention',               0.16, 24, NULL),
  ('pance-task-pharmacotherapy',  'pharmacotherapy',  'task', 'Pharmaceutical Therapeutics',         0.15, 25, NULL),
  ('pance-task-foundational',     'foundational',     'task', 'Applying Basic Scientific Concepts',  0.08, 26, NULL),
  ('pance-task-professional',     'professional',     'task', 'Professional Practice',               0.06, 27, NULL)
ON CONFLICT ("slug") DO NOTHING;

-- High-yield topics with Deep Dive module linkage.
INSERT INTO "pance_topics" ("id", "slug", "label", "contentCategory", "taskCategory", "subjectId", "reviewModuleSlug", "sortOrder")
VALUES
  ('pance-t-cv-acs',        'acs',                 'Acute Coronary Syndrome',     'cardiovascular',       'intervention',     'cardiovascular',       'acute-coronary-syndrome', 0),
  ('pance-t-cv-hf',         'heart-failure',       'Heart Failure Management',  'cardiovascular',       'pharmacotherapy',  'cardiovascular',       NULL, 1),
  ('pance-t-cv-htn',        'hypertension',        'Hypertension',              'cardiovascular',       'pharmacotherapy',  'cardiovascular',       'primary-care-hypertension', 2),
  ('pance-t-pulm-copd',     'copd',                'COPD Exacerbation',         'pulmonary',            'intervention',     'pulmonary',            'copd-exacerbation', 0),
  ('pance-t-pulm-asthma',   'asthma',              'Asthma Control',            'pulmonary',            'pharmacotherapy',  'pulmonary',            NULL, 1),
  ('pance-t-pulm-pe',       'pe',                  'Pulmonary Embolism',        'pulmonary',            'labs',             'pulmonary',            NULL, 2),
  ('pance-t-gi-bleed',      'gi-bleeding',         'GI Bleeding',               'gastrointestinal',     'diagnosis',        'gastrointestinal',     NULL, 0),
  ('pance-t-gi-pancreatitis','pancreatitis',       'Acute Pancreatitis',        'gastrointestinal',     'diagnosis',        'gastrointestinal',     NULL, 1),
  ('pance-t-msk-fracture',  'fracture',            'Fracture Management',       'musculoskeletal',      'intervention',     'musculoskeletal',      NULL, 0),
  ('pance-t-id-sepsis',     'sepsis',              'Sepsis Recognition',        'infectious-diseases',  'intervention',     'infectious-diseases',  'sepsis-bundle', 0),
  ('pance-t-id-cap',        'cap',                 'Community-Acquired Pneumonia','infectious-diseases',  'pharmacotherapy',  'infectious-diseases',  'infectious-disease', 1),
  ('pance-t-neuro-stroke',  'stroke',              'Acute Ischemic Stroke',     'neurologic',           'intervention',     'neurologic',           'acute-ischemic-stroke', 0),
  ('pance-t-neuro-seizure', 'seizure',             'Seizure Management',        'neurologic',           'pharmacotherapy',  'neurologic',           NULL, 1),
  ('pance-t-psych-depression','depression',        'Major Depression',          'psychiatry',           'pharmacotherapy',  'psychiatry',           NULL, 0),
  ('pance-t-repro-preeclampsia','preeclampsia',    'Preeclampsia',              'reproductive',         'intervention',     'reproductive',         NULL, 0),
  ('pance-t-endo-dka',      'dka',                 'DKA Management',            'endocrine',            'intervention',     'endocrine',              'dka-management', 0),
  ('pance-t-endo-thyroid',  'hypothyroidism',      'Hypothyroidism',            'endocrine',            'diagnosis',          'endocrine',            NULL, 1),
  ('pance-t-eent-otitis',   'otitis-media',        'Acute Otitis Media',        'eent',                 'pharmacotherapy',  'eent',                 NULL, 0),
  ('pance-t-heme-anemia',   'anemia',              'Anemia Workup',             'hematologic',          'labs',             'hematologic',          NULL, 0),
  ('pance-t-renal-aki',     'aki',                 'Acute Kidney Injury',       'renal',                'diagnosis',          'renal',                NULL, 0),
  ('pance-t-derm-cellulitis','cellulitis',         'Cellulitis',                'dermatologic',         'pharmacotherapy',  'dermatologic',         NULL, 0),
  ('pance-t-gu-uti',        'uti',                 'Urinary Tract Infection',   'genitourinary',        'pharmacotherapy',  'genitourinary',        NULL, 0),
  ('pance-t-prof-ethics',   'informed-consent',    'Informed Consent & Ethics', 'professional-practice','professional',     'professional-practice',NULL, 0)
ON CONFLICT ("slug") DO NOTHING;

CREATE OR REPLACE VIEW "pance_questions" AS
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
WHERE "fieldId" = 'pance';
