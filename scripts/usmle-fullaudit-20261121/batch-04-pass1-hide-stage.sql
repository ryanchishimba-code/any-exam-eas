-- Stage pass 1, batch 4. Hide 8 Step 1 items with no single best answer.
-- Sets up a backup and a staging table. Does not update "QuestionBankItem".
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-04-pass1-hide-stage.sql
BEGIN;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b4_stage;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b4_backup;
CREATE TABLE qbi_usmle_fullaudit_20261121_b4_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmr4m1ire00731y1ent2m6uca',
    'cmr8cloa7018n1yw27h3csrq5',
    'cmr8d6el2000b1yaz5588xd8k',
    'cmrpv8h9k000p1yncy3i8tiva',
    'cmrpvdq3400281ync2s2aj4mx',
    'cmrrv649500nz1y8wcwq47bpn',
    'cmrrv64cr00o01y8wt24yefh7',
    'cmrth11i1002v1yax4juzw01h'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup) <> 8 THEN
    RAISE EXCEPTION 'backup row count %, expected 8',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_fullaudit_20261121_b4_backup WHERE active IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'a hide candidate is already inactive';
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_fullaudit_20261121_b4_stage (
  id text PRIMARY KEY,
  hide_reason text NOT NULL,
  active boolean NOT NULL
);
INSERT INTO qbi_usmle_fullaudit_20261121_b4_stage (id, hide_reason, active) VALUES
  ('cmr4m1ire00731y1ent2m6uca', 'Headaches and nausea on a combined pill do not by themselves require a progestin-only pill.', false),
  ('cmr8cloa7018n1yw27h3csrq5', 'Blood pressure 220/130 mm Hg with a sudden headache and a negative CT can be subarachnoid hemorrhage or hypertensive emergency.', false),
  ('cmr8d6el2000b1yaz5588xd8k', 'Peak flow 60% of personal best needs more bronchodilator and a corticosteroid.', false),
  ('cmrpv8h9k000p1yncy3i8tiva', 'A COPD exacerbation needs both a short-acting bronchodilator and systemic corticosteroids.', false),
  ('cmrpvdq3400281ync2s2aj4mx', 'Creatinine 1.8 mg/dL on lisinopril has no baseline, so increasing the dose is not clearly safe.', false),
  ('cmrrv649500nz1y8wcwq47bpn', 'Risk-reducing mastectomy is not the single next step for a 22-year-old with a BRCA1 variant.', false),
  ('cmrrv64cr00o01y8wt24yefh7', 'Pleuritic pain in asthma is not automatically a chest radiograph.', false),
  ('cmrth11i1002v1yax4juzw01h', 'This COPD exacerbation meets indications for corticosteroids and for ventilatory support.', false);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_stage) <> 8 THEN
    RAISE EXCEPTION 'stage row count %, expected 8',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_stage);
  END IF;
END
$check$;
COMMIT;
