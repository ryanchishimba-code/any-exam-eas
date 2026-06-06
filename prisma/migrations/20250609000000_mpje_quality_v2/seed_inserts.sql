-- Auto-generated MPJE quality v2 seeds (50 items)
-- Regenerate: node scripts/generate-mpje-quality-sql.mjs

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  'OK',
  4,
  'controlled-substances',
  'mpje-jurisprudence',
  'k_type',
  'A PIC at a Tulsa chain pharmacy reviews a weekend emergency order for oxycodone 10 mg tablets after a post-surgical patient runs out on Saturday night.',
  'Regarding controlled substance handling at an Oklahoma community pharmacy, which statements are correct?',
  '{"statements":["I. Schedule II prescriptions may not be refilled without a new written order.","II. Partial fills of Schedule II are permitted when the patient is in a LTC facility or terminally ill with prescriber notation.","III. An Oklahoma pharmacist may accept an oral emergency C-II prescription only when state and federal rules both allow documentation within 7 days."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'All of the above',
  'Federal law bars C-II refills; limited partial-fill exceptions exist. Oklahoma follows federal CS rules with board-specific documentation for emergencies.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","C-II","partial-fill"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  'be325dc7eb7f1ed7f96d09dfb22561f1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'state-practice-act',
  'OK',
  4,
  'state-practice-act',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'An Oklahoma pharmacist-in-charge is updating technician supervision policies. Which statements are correct?',
  '{"statements":["I. The PIC remains legally responsible for all dispensing even when tasks are delegated to technicians.","II. Technicians may perform final verification of pharmacist-only functions if the store is busy.","III. Board rules define technician training and ratio requirements the PIC must enforce."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'PIC liability cannot be delegated. Final verification and clinical judgment remain pharmacist-only; technicians work within board-defined scope.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","PIC","technician"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '092634b063e896a70f2c31ae1104ab7e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  'OK',
  3,
  'dispensing-procedures',
  'mpje-jurisprudence',
  'k_type',
  'Mrs. Chen, 68, moves from Norman to a rural Oklahoma town and wants every active Rx moved to a new local pharmacy before her trip.',
  'A patient requests transfer of all Oklahoma prescriptions to a mail-order pharmacy. Which statements are correct?',
  '{"statements":["I. The receiving pharmacy must document transfer per board rules and maintain a retrievable record.","II. Controlled substance prescriptions may be transferred only once between pharmacies if schedules and rules permit.","III. Transfer of C-II prescriptions between pharmacies is generally prohibited under federal law."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'All of the above',
  'Non-controlled transfers follow state documentation rules. C-III–V may transfer once if permitted; C-II transfers are federally prohibited.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","transfer"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '991fc8829aed395db534a5e721a0522f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-operations',
  'OK',
  3,
  'pharmacy-operations',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'Regarding pharmacist immunization practice in Oklahoma, which statements are correct?',
  '{"statements":["I. Pharmacists must complete board-approved training before administering vaccines.","II. A standing protocol or prescriber authorization is required for pharmacist-administered immunizations.","III. Technicians may independently administer influenza vaccines without pharmacist presence."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'Oklahoma immunization authority requires pharmacist training and protocol/prescriber oversight. Vaccine administration is not in technician scope.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","immunization"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '624e333f5df40a93df5962c76d2b148c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'compounding-regulations',
  'OK',
  4,
  'compounding-regulations',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'An Oklahoma inspector reviews compounding records. Which statements are correct?',
  '{"statements":["I. Non-sterile compounding must follow USP <795> standards adopted by the board.","II. Beyond-use dating must be assigned and documented for compounded preparations.","III. Compounding logs may be discarded after 30 days regardless of board retention rules."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'USP <795> BUD and documentation apply. Oklahoma requires retention per board rules—often years, not 30 days.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","USP-795"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '382916fbdbd9691f76ea3c9d3e9ae3db',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  'OK',
  4,
  'controlled-substances',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'A pharmacy receives a suspicious cash payer for multiple early oxycodone refills in Oklahoma City. Which statements are correct?',
  '{"statements":["I. The pharmacist should evaluate red flags and may refuse to fill if a valid medical purpose is not established.","II. Oklahoma pharmacies must report every early refill to DEA within 24 hours regardless of suspicion.","III. PDMP review is part of corresponding responsibility before dispensing controlled substances."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'Corresponding responsibility and PDMP checks are mandatory practices; suspicious orders are reported when warranted, not every early fill automatically.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","red-flags","PDMP"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  'eff8d5e622183c822678a929d41a92e2',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  'OK',
  2,
  'patient-privacy',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'Regarding confidentiality at an Oklahoma pharmacy counter, which statements are correct?',
  '{"statements":["I. HIPAA minimum necessary applies when discussing PHI with caregivers present.","II. A spouse may always receive full medication profiles without patient consent.","III. Counseling offers must be documented when required by state and federal rules."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'Disclosures to family require patient permission or permitted exceptions. Offer-to-counsel documentation is a dispensing compliance element.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","HIPAA","counseling"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  'd783738fe756356f73769c6ee483b7c0',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-ethics',
  'OK',
  2,
  'pharmacy-ethics',
  'mpje-jurisprudence',
  'k_type',
  NULL,
  'An Oklahoma pharmacist discovers a colleague diverting tramadol. Which statements are correct?',
  '{"statements":["I. Mandatory reporting to the board or appropriate authority may be required when impairment or diversion is suspected.","II. The pharmacist should document internal findings and secure controlled substance records.","III. Ignoring diversion protects patient privacy and avoids workplace conflict."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'Professional duty and board rules require action on diversion; documentation and CS record integrity are essential.',
  '["mpje","high-yield","k-type","v2","state-OK","oklahoma","diversion","ethics"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '6a3ca5dd01547ec5595e5243258aedcd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'k_type',
  NULL,
  'A mail-order pharmacy ships Schedule III refills interstate. Which federal statements are correct?',
  '{"statements":["I. C-III prescriptions may be refilled up to five times within six months if authorized.","II. C-III refills require no quantity limits or authorization on the original prescription.","III. Federal law preempts less restrictive state refill rules for controlled substances."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I only',
  '21 CFR Part 1306 limits C-III–V refills to five in six months. States may be more restrictive; federal does not preempt stricter state law.',
  '["mpje","high-yield","k-type","v2","federal","federal","C-III","refills"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '293e083f6583e481ebfaecd42a14cdd8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  NULL,
  3,
  'dispensing-procedures',
  'umpje-uniform',
  'k_type',
  'After a tornado, a volunteer clinic sends a nurse practitioner oral order for antibiotic suspension for a child with no written Rx available.',
  'A hospital pharmacist receives a disaster-relief oral order. Which statements are correct under typical federal/uniform patterns?',
  '{"statements":["I. Emergency oral orders must be reduced to writing with required elements within the permitted timeframe.","II. Quantity limits for emergency supplies may be restricted by state and institutional policy.","III. Technicians may accept prescriber orders for new controlled substances without pharmacist involvement."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'Emergency oral Rx rules require pharmacist involvement and written follow-up. Technicians cannot accept new CS orders independently.',
  '["mpje","high-yield","k-type","v2","federal","federal","emergency","oral-Rx"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '35da980553e9547ddadffb76568d4fcf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'federal-pharmacy-law',
  NULL,
  4,
  'federal-pharmacy-law',
  'umpje-uniform',
  'k_type',
  NULL,
  'Regarding DSCSA product tracing at a retail pharmacy, which statements are correct?',
  '{"statements":["I. Pharmacies must quarantine suspect products lacking required transaction history.","II. Dispensing without verifying trading partners is acceptable for urgent patient needs.","III. Suspect or illegitimate product investigations must be documented."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'DSCSA requires investigation and quarantine of suspect products; shortcuts bypassing tracing violate federal supply-chain rules.',
  '["mpje","high-yield","k-type","v2","federal","federal","DSCSA"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '3ce7a9732c4881545c7d21eb3e468be9',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'compounding-regulations',
  NULL,
  4,
  'compounding-regulations',
  'umpje-uniform',
  'k_type',
  NULL,
  'A specialty pharmacy compounds sterile chemotherapy. Which statements are correct?',
  '{"statements":["I. USP <797> standards apply to sterile compounding risk levels.","II. Garbing, environmental monitoring, and BUD assignment are required elements.","III. Non-sterile compounding rules alone satisfy oncology IV admixture requirements."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'Sterile hazardous compounding requires USP <797> (and <800> for hazardous drugs), not only <795>.',
  '["mpje","high-yield","k-type","v2","federal","federal","USP-797","sterile"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'fcd28056f4fc9b95cd4d0a78ba57a24e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  NULL,
  2,
  'patient-privacy',
  'umpje-uniform',
  'k_type',
  NULL,
  'An employer requests workers'' compensation claim records from a pharmacy. Which HIPAA statements are correct?',
  '{"statements":["I. Disclosure may be permitted without patient authorization when required by workers'' comp law.","II. The pharmacy may disclose the entire patient profile to any employer on request.","III. Minimum necessary standard still applies to permitted disclosures."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'HIPAA permits certain workers'' comp disclosures by law but limits scope to minimum necessary—not blanket profile release.',
  '["mpje","high-yield","k-type","v2","federal","federal","HIPAA","workers-comp"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '1744103b872de684cdd114e59d57b9f4',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'k_type',
  NULL,
  'A wholesaler delivers damaged C-II bottles with broken seals. Which statements are correct?',
  '{"statements":["I. The pharmacist should refuse acceptance and document the discrepancy.","II. DEA Form 222 or electronic equivalent integrity must be maintained for C-II procurement.","III. Damaged seals may be ignored if the invoice matches the shipment count."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'CS receiving requires intact chain of custody; damaged seals trigger investigation and refusal per DEA rules.',
  '["mpje","high-yield","k-type","v2","federal","federal","DEA","receiving"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'ba4aa7a937dde0c3fead6f023fa7abae',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'federal-pharmacy-law',
  NULL,
  4,
  'federal-pharmacy-law',
  'umpje-uniform',
  'k_type',
  NULL,
  'Regarding FDA OTC switch and pharmacist counseling, which statements are correct?',
  '{"statements":["I. Pharmacists must offer counseling on new prescriptions including those for newly OTC-switched products when dispensed by Rx.","II. OTC status eliminates all labeling requirements for former prescription products.","III. Misbranding rules under the FDCA still apply to OTC labeling claims."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'Rx counseling rules attach to dispensed prescriptions. OTC products remain subject to FDA labeling and misbranding standards.',
  '["mpje","high-yield","k-type","v2","federal","federal","FDA","OTC"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '20f40dce4220daa62d6cdb2819c61281',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'state-practice-act',
  NULL,
  4,
  'state-practice-act',
  'umpje-uniform',
  'k_type',
  NULL,
  'A pharmacy intern precepts at a university site. Which uniform licensure statements are correct?',
  '{"statements":["I. Interns must practice under a preceptor pharmacist within board-defined ratios.","II. Interns may serve as PIC during the preceptor''s lunch break without notification.","III. Intern hours must be documented for board licensure credit."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'Intern scope is supervised and documented; PIC duties require a licensed pharmacist in charge.',
  '["mpje","high-yield","k-type","v2","federal","uniform","intern","licensure"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '49cf08e2954decabc32f17be1fbf35ef',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  NULL,
  2,
  'patient-privacy',
  'umpje-uniform',
  'k_type',
  NULL,
  'A patient requests a HIPAA restriction on disclosure to a health plan for a self-pay item. Which statements are correct?',
  '{"statements":["I. Pharmacies must comply with valid restriction requests when paid out-of-pocket in full.","II. Restrictions apply to all future disclosures to any party without limitation.","III. The pharmacy should document the restriction in policies and train staff."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and III only',
  'HIPAA right to restrict applies to self-pay situations with specific scope—not unlimited global restriction.',
  '["mpje","high-yield","k-type","v2","federal","federal","HIPAA","restriction"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '96a2fa447789e5462ad77fc2b5574230',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'k_type',
  NULL,
  'During a DEA inspection, which inventory statements are correct?',
  '{"statements":["I. Biennial inventory of controlled substances is required for pharmacies.","II. Perpetual inventory is required for Schedule II substances.","III. Annual inventory alone satisfies all Schedule II record requirements."],"itemFormat":"k_type","options":["I only","II only","III only","I and II only","I and III only","II and III only","All of the above"]}',
  'I and II only',
  'DEA requires biennial inventory plus ongoing perpetual records for C-II; annual-only is insufficient.',
  '["mpje","high-yield","k-type","v2","federal","federal","DEA","inventory"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'def5f9deaccc4fbb46a787bdf927ff87',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  'OK',
  4,
  'controlled-substances',
  'mpje-jurisprudence',
  'select_all',
  'A college student presents a hydrocodone 7.5/325 prescription with mismatched prescriber DEA number and no office stamp.',
  'Which actions are appropriate when a Oklahoma pharmacist identifies a forged hydrocodone prescription? Select all that apply.',
  '["Refuse to dispense and document the incident","Retain the prescription if permitted by state law","Notify local law enforcement or board as required","Dispense a partial quantity to avoid confrontation","Contact the prescriber to verify only after dispensing"]',
  'Refuse to dispense and document the incident|||Retain the prescription if permitted by state law|||Notify local law enforcement or board as required',
  'Forgery requires refusal, documentation, retention per law, and reporting. Partial fills or dispense-first approaches violate corresponding responsibility.',
  '["mpje","high-yield","sata","v2","state-OK","oklahoma","forgery"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '3211f8bd8cfce9706110b149421a9181',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'uniform-mpje',
  NULL,
  3,
  'uniform-mpje',
  'umpje-uniform',
  'select_all',
  NULL,
  'Which elements are typically required for a valid prescription under uniform MPJE patterns? Select all that apply.',
  '["Patient identification","Drug name and strength","Quantity and directions for use","Prescriber signature and date","Pharmacist''s social security number"]',
  'Patient identification|||Drug name and strength|||Quantity and directions for use|||Prescriber signature and date',
  'Core validity elements are tested nationally; pharmacist SSN is not a prescription requirement.',
  '["mpje","high-yield","sata","v2","federal","uniform","validity"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '3500b9e3c1e92718ee8af2684a1ed601',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-operations',
  NULL,
  3,
  'pharmacy-operations',
  'umpje-uniform',
  'select_all',
  NULL,
  'Which records should be available during a routine board inspection? Select all that apply.',
  '["Prescription files (electronic or hard copy)","Controlled substance perpetual inventory","Compounding master formulation records","Employee personal credit reports","Policies for technician supervision"]',
  'Prescription files (electronic or hard copy)|||Controlled substance perpetual inventory|||Compounding master formulation records|||Policies for technician supervision',
  'Inspections focus on dispensing, CS, compounding, and supervision policies—not personal credit data.',
  '["mpje","high-yield","sata","v2","federal","inspection","records"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'ec38ae3353e476ac29ce5ede9779acee',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-operations',
  'OK',
  3,
  'pharmacy-operations',
  'mpje-jurisprudence',
  'select_all',
  NULL,
  'A Oklahoma LTC consultant pharmacist reviews psychotropic utilization. Which duties apply? Select all that apply.',
  '["Monthly drug regimen review with documented recommendations","Reporting irregularities to the medical director and DON","Independent prescriptive authority to change all orders without contact","Ensuring unnecessary medications are identified","Delegating the entire review to uncertified dietary staff"]',
  'Monthly drug regimen review with documented recommendations|||Reporting irregularities to the medical director and DON|||Ensuring unnecessary medications are identified',
  'Consultant pharmacists perform regimen reviews and report issues; they do not unilaterally change orders or delegate clinical review to non-pharmacy staff.',
  '["mpje","high-yield","sata","v2","state-OK","oklahoma","LTC","consultant"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '1c2d54ce00eeee3fb8b28ae8cb0bde0b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'select_all',
  NULL,
  'Which are federal Schedule I characteristics? Select all that apply.',
  '["No currently accepted medical use in the United States","High potential for abuse","May be refilled up to five times in six months","Not typically dispensed at retail pharmacies","Same partial-fill rules as Schedule III"]',
  'No currently accepted medical use in the United States|||High potential for abuse|||Not typically dispensed at retail pharmacies',
  'Schedule I drugs lack accepted medical use and are not retail-dispensed; refill rules apply to C-III–V.',
  '["mpje","high-yield","sata","v2","federal","federal","schedule-I"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '9fcf7e325532e9e1202659b42acd3933',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  NULL,
  3,
  'dispensing-procedures',
  'umpje-uniform',
  'select_all',
  NULL,
  'Which counseling or privacy steps apply when a teenager picks up isotretinoin? Select all that apply.',
  '["Verify iPLEDGE requirements and REMS documentation","Provide mandatory patient counseling per REMS","Post the patient''s diagnosis on the pickup bag","Offer confidential counseling away from the counter crowd","Share records with the patient''s employer without authorization"]',
  'Verify iPLEDGE requirements and REMS documentation|||Provide mandatory patient counseling per REMS|||Offer confidential counseling away from the counter crowd',
  'REMS programs require documentation and counseling; PHI must not be publicized or disclosed to employers without permission.',
  '["mpje","high-yield","sata","v2","federal","federal","REMS","counseling"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'd25766bb2fb338f2d4479ae8b4d4616b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'select_all',
  NULL,
  'Which steps are required after a significant theft of C-II stock? Select all that apply.',
  '["File DEA Form 106","Notify local law enforcement as required","Update perpetual inventory and investigate root cause","Resume dispensing C-II without documentation to avoid backlog","Notify the state board of pharmacy if required"]',
  'File DEA Form 106|||Notify local law enforcement as required|||Update perpetual inventory and investigate root cause|||Notify the state board of pharmacy if required',
  'Theft triggers DEA 106, law enforcement, inventory reconciliation, and board notification per state rules.',
  '["mpje","high-yield","sata","v2","federal","federal","theft","DEA-106"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '881093195f33ba639e4e5bf06bb4a87e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  'OK',
  3,
  'dispensing-procedures',
  'mpje-jurisprudence',
  'vignette',
  'An Oklahoma retail pharmacist receives two electronic prescriptions from different prescribers: metformin 1000 mg BID and metformin 500 mg QAM + 1000 mg QPM for the same patient.',
  'What is the pharmacist''s best next step?',
  '["Verify the order with the prescriber and clarify the duplicate before dispensing either Rx","Dispense both prescriptions because the patient insists","Fill only the newer prescription and discard the older one","Ask the technician to choose the lower-cost option"]',
  'Verify the order with the prescriber and clarify the duplicate before dispensing either Rx',
  'Therapeutic duplication requires pharmacist intervention and prescriber clarification under Oklahoma dispensing standards.',
  '["mpje","high-yield","v2","state-OK","oklahoma","DUR","duplication"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  'fa15bd791aad8e9091207dbb699dcf9d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  'OK',
  4,
  'controlled-substances',
  'mpje-jurisprudence',
  'vignette',
  'A patient moving from Edmond to Stillwater asks the pharmacist to transfer an active oxycodone 5 mg prescription to another Oklahoma pharmacy.',
  'How should the pharmacist handle the transfer request?',
  '["Explain that C-II prescriptions cannot be transferred and contact the prescriber for a new prescription at the receiving pharmacy","Transfer the C-II using the interstate transfer form","Transfer once and document in the profile note","Ask the patient to photocopy the bottle label as a new Rx"]',
  'Explain that C-II prescriptions cannot be transferred and contact the prescriber for a new prescription at the receiving pharmacy',
  'Federal law prohibits transfer of C-II prescriptions between pharmacies.',
  '["mpje","high-yield","v2","state-OK","oklahoma","transfer","C-II"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '0cb8e92c695680b5d3585e1f010f8538',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  'OK',
  3,
  'dispensing-procedures',
  'mpje-jurisprudence',
  'vignette',
  'A patient presents a smartphone photo of a hydrocodone prescription left as voicemail by a clinic that closed for the day.',
  'What action complies with Oklahoma and federal rules?',
  '["Decline to fill until a valid hard copy or compliant electronic prescription is received","Fill a 30-day supply based on the patient''s verbal assurance","Allow the technician to document the prescriber''s cell number as authorization","Fill an emergency quantity without any record"]',
  'Decline to fill until a valid hard copy or compliant electronic prescription is received',
  'C-II requires a written or compliant EPCS order; voicemail alone is insufficient except in narrow emergency rules with strict documentation.',
  '["mpje","high-yield","v2","state-OK","oklahoma","C-II","voicemail"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '10ef98bbb02989ee9c23c4a6e84a1a47',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  'OK',
  2,
  'patient-privacy',
  'mpje-jurisprudence',
  'vignette',
  'An elderly patient with mild cognitive impairment picks up donepezil with an adult daughter who demands to know whether the patient has been adherent.',
  'The Oklahoma pharmacist should:',
  '["Offer private counseling and verify whether the caregiver is authorized to receive PHI","Announce the medication name loudly so the waiting room can assist","Refuse to dispense because a caregiver is present","Mail the medication to the caregiver without patient consent"]',
  'Offer private counseling and verify whether the caregiver is authorized to receive PHI',
  'HIPAA and professional standards require confidential counseling and authorized disclosures only.',
  '["mpje","high-yield","v2","state-OK","oklahoma","counseling","caregiver"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  'a0251201079cdf90a760a4a2f247a110',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'federal-pharmacy-law',
  NULL,
  4,
  'federal-pharmacy-law',
  'umpje-uniform',
  'vignette',
  'A wholesaler shipment of insulin pens arrives without 3T transaction history at an Oklahoma pharmacy during a shortage.',
  'The PIC''s best response is:',
  '["Implement quarantine, notify the wholesaler, and investigate tracing data before dispensing","Dispense immediately because the NDC matches","Return to stock and ignore if no patient complaints occur","Destroy product without recording the event"]',
  'Implement quarantine, notify the wholesaler, and investigate tracing data before dispensing',
  'DSCSA mandates investigation of missing tracing and quarantine of suspect product.',
  '["mpje","high-yield","v2","federal","federal","DSCSA","quarantine"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'e77abbdbeb9460f56e5f17341cc4ad21',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  'OK',
  3,
  'dispensing-procedures',
  'mpje-jurisprudence',
  'vignette',
  'PDMP review shows a patient received opioid prescriptions from two prescribers; the pharmacist also notes a 2-year esomeprazole refill with no diagnosis on file.',
  'The pharmacist should:',
  '["Contact the prescriber to clarify indication and document rationale if continued therapy is appropriate","Auto-refill indefinitely because the insurance plan allows 90-day supplies","Switch the patient to an OTC alternative without prescriber approval","Cancel the prescription without notifying anyone"]',
  'Contact the prescriber to clarify indication and document rationale if continued therapy is appropriate',
  'Long-term PPI use requires DUR and prescriber collaboration to prevent inappropriate continuation.',
  '["mpje","high-yield","v2","state-OK","oklahoma","DUR","PPI"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '7896e8f7fe0e442ca65d52bcb39e9e52',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'vignette',
  'A hospice nurse requests a 10-tablet partial fill of oxycodone 20 mg with prescriber notation ''terminal illness'' on the prescription.',
  'Under DEA rules, the pharmacist may:',
  '["Provide a partial fill and document the remaining quantity with prescriber authorization when permitted","Refill the remaining tablets next month without documentation","Transfer the remainder to another pharmacy as a C-II transfer","Discard leftover tablets without inventory adjustment"]',
  'Provide a partial fill and document the remaining quantity with prescriber authorization when permitted',
  'Partial fills of C-II are limited to LTC/terminally ill with notation; documentation and inventory updates are mandatory.',
  '["mpje","high-yield","v2","federal","federal","partial-fill"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'ad197c4c0fe242c336d69ee7d75f4822',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'state-practice-act',
  'OK',
  4,
  'state-practice-act',
  'mpje-jurisprudence',
  'vignette',
  'Board investigation reveals a busy Oklahoma store where technicians performed final verification on 40 new prescriptions during a pharmacist lunch break.',
  'The Oklahoma board would most likely find:',
  '["A violation for inadequate supervision and dispensing without pharmacist verification","Full compliance because technicians are certified","No issue if no patient harm occurred","Acceptable if the store met script count quotas"]',
  'A violation for inadequate supervision and dispensing without pharmacist verification',
  'Pharmacist verification of dispensing is non-delegable; technician certification does not replace pharmacist check.',
  '["mpje","high-yield","v2","state-OK","oklahoma","supervision","violation"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '475c5be398105a5f3c1f8b76beed91a5',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  NULL,
  3,
  'dispensing-procedures',
  'umpje-uniform',
  'vignette',
  'A patient needs semaglutide pens but the pharmacy is out of stock; a different GLP-1 is available.',
  'The pharmacist''s appropriate action is:',
  '["Use professional judgment to dispense a therapeutic equivalent only if the prescriber approves substitution","Substitute another GLP-1 because it is in the same class","Refuse and tell the patient to switch pharmacies permanently","Substitute without contact because the drug is unavailable nationwide"]',
  'Use professional judgment to dispense a therapeutic equivalent only if the prescriber approves substitution',
  'Therapeutic substitution of non-equivalent agents requires prescriber authorization.',
  '["mpje","high-yield","v2","federal","uniform","substitution"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'b74bb694b5ebef8ed22aed624bc17bbf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'compounding-regulations',
  NULL,
  4,
  'compounding-regulations',
  'umpje-uniform',
  'vignette',
  'An oncology clinic requests compounded hazardous preparations shipped from a Oklahoma compounding pharmacy.',
  'Compliance requires the pharmacy to:',
  '["Maintain separate records, security, and labeling standards for hazardous drug compounding per USP <800>","Treat hazardous compounding like OTC repackaging","Skip environmental controls if batch size is under five units","Allow food in the compounding area to boost staff morale"]',
  'Maintain separate records, security, and labeling standards for hazardous drug compounding per USP <800>',
  'USP <800> governs hazardous drug handling, storage, and documentation beyond general <795>/<797>.',
  '["mpje","high-yield","v2","federal","federal","USP-800"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'f3fe47dcb871f3de98ea0d8f0c7252b0',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  NULL,
  3,
  'dispensing-procedures',
  'umpje-uniform',
  'vignette',
  'A patient on phenelzine requests OTC pseudoephedrine for congestion and becomes upset when the pharmacist raises a hypertensive crisis risk.',
  'The pharmacist should:',
  '["Decline to fill and counsel on dangerous interaction; contact prescriber if patient insists","Dispense both because the patient signed a waiver","Fill the MAOI and hold the pseudoephedrine for later without documentation","Ask the cashier to resolve the interaction"]',
  'Decline to fill and counsel on dangerous interaction; contact prescriber if patient insists',
  'Severe drug interactions trigger corresponding responsibility; waivers do not override pharmacist duty.',
  '["mpje","high-yield","v2","federal","uniform","DUR","interaction"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '7896e8f7fe0e442ca65d52bcb39e9e52',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'uniform-mpje',
  NULL,
  3,
  'uniform-mpje',
  'umpje-uniform',
  'mcq',
  NULL,
  'Under typical MPJE uniform rules, electronic prescriptions must:',
  '["Meet federal and state EPCS standards with prescriber authentication","Be accepted from any emailed PDF without verification","Replace all record-keeping requirements","Bypass DUR because they are digital"]',
  'Meet federal and state EPCS standards with prescriber authentication',
  'Valid e-prescribing requires compliant systems and authentication; email PDFs are not automatically valid.',
  '["mpje","high-yield","v2","federal","uniform","EPCS"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'f0c81e742ef03901c9bd8a9d4667b90e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'state-practice-act',
  'OK',
  4,
  'state-practice-act',
  'mpje-jurisprudence',
  'vignette',
  'A pharmacy school intern from out of state begins an Oklahoma rotation and asks to verify prescriptions solo on the first day.',
  'The Oklahoma pharmacist should:',
  '["Verify intern status with the board, ensure preceptor availability, and document supervision","Allow independent PIC shifts for the intern immediately","Permit the intern to counsel on controlled substances without oversight","Skip documentation if the intern is enrolled in an out-of-state program"]',
  'Verify intern status with the board, ensure preceptor availability, and document supervision',
  'Intern practice requires active intern registration and documented preceptor supervision per Oklahoma rules.',
  '["mpje","high-yield","v2","state-OK","oklahoma","intern"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '9421e958b4e6d2c9ee0b347623220adc',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'federal-pharmacy-law',
  NULL,
  4,
  'federal-pharmacy-law',
  'umpje-uniform',
  'vignette',
  'A customer attempts to purchase multiple boxes of pseudoephedrine for a ''church trip'' during allergy season.',
  'Federal law requires the pharmacy to:',
  '["Maintain a bound or compliant electronic logbook with required patient identifiers for each sale","Sell unlimited pseudoephedrine without identification","Record sales only when purchases exceed 9 grams per year automatically without daily logs","Delegate all meth precursor compliance to the cashier without pharmacist oversight"]',
  'Maintain a bound or compliant electronic logbook with required patient identifiers for each sale',
  'Combat Methamphetamine Epidemic Act mandates logbooks, ID verification, and quantity limits for OTC sympathomimetics.',
  '["mpje","high-yield","v2","federal","federal","meth-precursor","logbook"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '7b792c7c1a51f540df3187aee4bdf56e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-operations',
  'OK',
  3,
  'pharmacy-operations',
  'mpje-jurisprudence',
  'vignette',
  'Monthly review at an Oklahoma nursing home flags diphenhydramine use for sleep in a patient with dementia.',
  'The consultant pharmacist should:',
  '["Document the recommendation in the medical record and communicate with the interdisciplinary team","Stop the medication unilaterally without prescriber involvement","Ignore the order because the patient is asymptomatic","Delegate the decision to nursing only"]',
  'Document the recommendation in the medical record and communicate with the interdisciplinary team',
  'Consultant pharmacists recommend changes through proper channels; they do not unilaterally discontinue prescriber orders.',
  '["mpje","high-yield","v2","state-OK","oklahoma","LTC"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '97616bc58f9908c1dd84cf65b41cde15',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  'OK',
  4,
  'controlled-substances',
  'mpje-jurisprudence',
  'vignette',
  'A new patient pays cash for brand-name oxycodone, declines insurance, and requests ''the strongest you have'' while appearing sedated.',
  'The pharmacist''s best action is:',
  '["Review PDMP, assess red flags, and refuse or clarify if no legitimate medical purpose exists","Fill because the prescription appears valid on its face","Fill a 2-day supply only without documentation","Report the patient to media outlets"]',
  'Review PDMP, assess red flags, and refuse or clarify if no legitimate medical purpose exists',
  'Corresponding responsibility requires PDMP review and refusal when red flags indicate potential diversion.',
  '["mpje","high-yield","v2","state-OK","oklahoma","PDMP","red-flags"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '640cfef650b85baad6340a180001d4ff',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  NULL,
  2,
  'patient-privacy',
  'umpje-uniform',
  'mcq',
  NULL,
  'HIPAA permits this disclosure when:',
  '["The patient is present and does not object to the caregiver receiving information needed for care","The neighbor asks politely at the drive-through","The pharmacy posts pickup names on a public screen","An employer requests adherence data for wellness incentives without authorization"]',
  'The patient is present and does not object to the caregiver receiving information needed for care',
  'HIPAA allows incidental disclosures to caregivers involved in care when the patient does not object.',
  '["mpje","high-yield","v2","federal","federal","HIPAA","caregiver"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '57d13148eec38fd49df7af2827613119',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'patient-privacy',
  NULL,
  2,
  'patient-privacy',
  'umpje-uniform',
  'mcq',
  NULL,
  'The pharmacy must:',
  '["Provide a notice of privacy practices and honor patient rights to access and amend records","Share all records with marketing partners by default","Deny patients access to their own medication lists","Destroy records immediately after each fill"]',
  'Provide a notice of privacy practices and honor patient rights to access and amend records',
  'Covered entities must distribute NPP and facilitate access/amendment rights under HIPAA.',
  '["mpje","high-yield","v2","federal","federal","HIPAA","NPP"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '2c7ff1d0ea31ae4cbe0dda8f632fc1d1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-ethics',
  'OK',
  2,
  'pharmacy-ethics',
  'mpje-jurisprudence',
  'vignette',
  'Staff report that the Oklahoma PIC has been arriving with slurred speech and dilated pupils before the morning shift.',
  'The pharmacist should:',
  '["Report to the Oklahoma Board of Pharmacy and cooperate with the investigation while ensuring patient safety","Continue working without disclosure to avoid defamation claims","Post details on social media to warn the community","Ask the impaired pharmacist to self-prescribe stimulants"]',
  'Report to the Oklahoma Board of Pharmacy and cooperate with the investigation while ensuring patient safety',
  'Impairment threatens public safety; mandatory reporting and board cooperation are required.',
  '["mpje","high-yield","v2","state-OK","oklahoma","impairment","ethics"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '1e5046d14f6b0212d39939ec59acf755',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'controlled-substances',
  NULL,
  4,
  'controlled-substances',
  'umpje-uniform',
  'vignette',
  'A patient requests a refill of alprazolam 0.5 mg (#30, five refills) written four months ago with one refill used.',
  'Under federal law, the refill authorization on this C-IV prescription:',
  '["May be refilled up to five times within six months of the date written if authorized","May be refilled unlimited times within one year","Cannot be refilled because all controlled substances prohibit refills","Requires a new DEA Form 222 for each refill"]',
  'May be refilled up to five times within six months of the date written if authorized',
  'C-IV follows the five-refills-in-six-months federal rule when authorized on the prescription.',
  '["mpje","high-yield","v2","federal","federal","C-IV","refills"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'f531d83bd44632c8210150a9ec893bce',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-operations',
  'OK',
  3,
  'pharmacy-operations',
  'mpje-jurisprudence',
  'vignette',
  'A bystander requests intranasal naloxone under Oklahoma''s pharmacist access protocol after a family member''s overdose.',
  'The Oklahoma pharmacist should:',
  '["Counsel on device technique, storage, and board-required documentation for naloxone distribution","Dispense without counseling because it is OTC in some contexts","Refuse because the patient has no opioid prescription on file","Provide only one unit per lifetime without records"]',
  'Counsel on device technique, storage, and board-required documentation for naloxone distribution',
  'Oklahoma naloxone access protocols require pharmacist counseling and documentation even when supplied under standing order.',
  '["mpje","high-yield","v2","state-OK","oklahoma","naloxone"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '009691d425d3907946164c58f2f13fea',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'pharmacy-ethics',
  NULL,
  2,
  'pharmacy-ethics',
  'umpje-uniform',
  'vignette',
  'A dispensing error investigation reveals a technician misread a strength on a pediatric liquid antibiotic.',
  'The pharmacy''s legal obligation is to:',
  '["Maintain confidentiality of the error investigation while implementing corrective action plans","Publish the technician''s name on the store website","Ignore the event if the patient was not harmed","Delete surveillance footage immediately"]',
  'Maintain confidentiality of the error investigation while implementing corrective action plans',
  'Medication error investigations require QI processes with confidentiality and corrective actions, not public shaming.',
  '["mpje","high-yield","v2","federal","uniform","medication-error"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'b61b7e902ed019ea6df2018015e44f71',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'federal-pharmacy-law',
  NULL,
  4,
  'federal-pharmacy-law',
  'umpje-uniform',
  'mcq',
  NULL,
  'The wholesaler must provide:',
  '["An electronic pedigree or 3T documentation interoperable with DSCSA requirements","Only a verbal assurance of authenticity","Marketing brochures instead of transaction statements","A handwritten note from the sales representative"]',
  'An electronic pedigree or 3T documentation interoperable with DSCSA requirements',
  'DSCSA requires electronic tracing between trading partners; verbal assurances are non-compliant.',
  '["mpje","high-yield","v2","federal","federal","DSCSA","wholesaler"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  'f679c3eadd13cee2cdda084716f59bd1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'dispensing-procedures',
  'OK',
  3,
  'dispensing-procedures',
  'mpje-jurisprudence',
  'vignette',
  'After-hours call from an Oklahoma urgent care physician requests an oral antibiotic for a child with documented penicillin allergy.',
  'The pharmacist should:',
  '["Authenticate the caller, verify prescriber credentials, and document required elements before dispensing","Fill immediately because the clinic is well known","Allow the technician to take the order without pharmacist involvement","Fill the maximum quantity allowed for six months of refills on the oral order"]',
  'Authenticate the caller, verify prescriber credentials, and document required elements before dispensing',
  'Emergency oral orders require pharmacist authentication of prescriber and strict documentation under Oklahoma rules.',
  '["mpje","high-yield","v2","state-OK","oklahoma","oral-order"]',
  '[{"label":"Oklahoma Pharmacy Act / OBN rules","citation":"63 O.S. § 1521 et seq.; OAC 535:15"}]'::jsonb,
  'seed',
  '7896e8f7fe0e442ca65d52bcb39e9e52',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  'state-practice-act',
  NULL,
  4,
  'state-practice-act',
  'umpje-uniform',
  'mcq',
  NULL,
  'Uniform MPJE testing emphasizes that foreign pharmacy graduates must:',
  '["Obtain FPGEC certification and meet state licensure requirements including exams","Practice immediately with a technician license","Skip MPJE if they have overseas experience only","Register with DEA instead of the state board"]',
  'Obtain FPGEC certification and meet state licensure requirements including exams',
  'FPGEC and state licensure (NAPLEX/MPJE) are standard requirements for foreign graduates in uniform patterns.',
  '["mpje","high-yield","v2","federal","uniform","FPGEC","licensure"]',
  '[{"label":"Federal pharmacy law","citation":"21 CFR / DEA / HIPAA"}]'::jsonb,
  'seed',
  '7c463a3503c67314673b3f13d7357075',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;
