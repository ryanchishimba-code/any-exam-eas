-- Seed high-yield MPJE questions (federal + Oklahoma state focus).
-- Safe to re-run: ON CONFLICT updates existing rows by contentHash.

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "question", "options", "correctAnswer",
  "explanation", "source", "contentHash", "active", "tags", "updatedAt"
)
VALUES
(
  'mpje_seed_federal_01',
  'mpje',
  'federal-pharmacy-law',
  'Under the Federal Food, Drug, and Cosmetic Act (FDCA), which activity is primarily regulated by FDA for prescription drug products?',
  '["Manufacturing standards, labeling, and interstate distribution","State pharmacist-to-technician ratio requirements","Individual state pharmacy technician certification","Local municipal zoning for retail pharmacies"]',
  'Manufacturing standards, labeling, and interstate distribution',
  'The FDCA governs interstate commerce of drugs, including manufacturing, adulteration/misbranding, and labeling. State boards regulate practice within their jurisdiction.',
  'seed',
  'a42d8e21ef808e98bb10019c9e5ab9b72f932c660d557fa600f34257ff47e3d9',
  true,
  '["mpje","high-yield","federal","FDA","FDCA"]',
  CURRENT_TIMESTAMP
),
(
  'mpje_seed_cs_01',
  'mpje',
  'controlled-substances',
  'Federal law (DEA) permits how many refills on a Schedule II (C-II) prescription?',
  '["No refills — a new prescription is required","Up to five refills within six months","Unlimited refills if the patient requests them","Three refills within one year"]',
  'No refills — a new prescription is required',
  'Schedule II controlled substances cannot be refilled under federal law. A new prescription with all required elements is needed.',
  'seed',
  'bb6e7044a550f720de8f07a6b88254cacb6be402538cab3a7f7734a709d4f7e4',
  true,
  '["mpje","high-yield","federal","DEA","C-II"]',
  CURRENT_TIMESTAMP
),
(
  'mpje_seed_uniform_01',
  'mpje',
  'uniform-mpje',
  'Under typical uniform MPJE patterns, a valid prescription must generally include which element?',
  '["Patient name, drug name, strength, quantity, directions, prescriber signature, and date","Patient social security number only","Pharmacist''s personal license number on every refill","Insurance copay amount"]',
  'Patient name, drug name, strength, quantity, directions, prescriber signature, and date',
  'Uniform jurisprudence exams test core prescription validity elements adopted across most state practice acts and NABP model standards.',
  'seed',
  '97b6e2dde5b118b411a6397c981b2622914bf9c8bb4b1becab1f286aa0ba7f54',
  true,
  '["mpje","high-yield","uniform","UMPJE","prescription"]',
  CURRENT_TIMESTAMP
),
(
  'mpje_seed_ok_01',
  'mpje',
  'state-practice-act',
  'Under the Oklahoma Pharmacy Act, who is legally responsible for the overall operation of the pharmacy?',
  '["The pharmacist-in-charge (PIC) licensed by the Oklahoma Board of Pharmacy","The pharmacy''s marketing director","The lead pharmacy technician","The software vendor"]',
  'The pharmacist-in-charge (PIC) licensed by the Oklahoma Board of Pharmacy',
  'Oklahoma law designates the PIC as responsible for legal compliance, supervision, and pharmacy operations under board rules.',
  'seed',
  'd9228af7a504a0fc379e5c29a2cf5adcde9224aba46f50b305ff9fc15341124e',
  true,
  '["mpje","high-yield","state-OK","oklahoma","licensure","PIC"]',
  CURRENT_TIMESTAMP
),
(
  'mpje_seed_ok_02',
  'mpje',
  'state-practice-act',
  'An Oklahoma pharmacist wants to administer immunizations. Which requirement is typically necessary?',
  '["Current Oklahoma pharmacist immunization authority with documented training/protocol compliance","No training if the pharmacist has a retail license","Technician administration without pharmacist presence","Immunizations may only be given by physicians in Oklahoma"]',
  'Current Oklahoma pharmacist immunization authority with documented training/protocol compliance',
  'Oklahoma authorizes pharmacist-administered immunizations under board rules with training, protocols, and reporting requirements.',
  'seed',
  'ac3230bd70e308a796c24dc4da9bdcde0f7fb9c90caa119275c9014313652cc3',
  true,
  '["mpje","high-yield","state-OK","oklahoma","immunization","scope"]',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("contentHash") DO UPDATE SET
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "active" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
