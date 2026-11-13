-- COPD stem alignment to GOLD 2025 and BTS, 2026-11-13.
-- Backup qbi_usmle_copd2_20261113_backup (13 rows) is created first.
-- Undo: scripts/undo-usmle-copd2-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_copd2_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr4dj9pa011a1yky1oma2rrx',
    'cmr8esql701es1yloktyho2sl',
    'cmr98mpha00ll1ywy0bnsixop',
    'cmr8hrsyg023x1yloh2qr5qlm',
    'cmr8c3jvb00ge1ylox5yp3quh',
    'cmr8lyy2n00gc1ygi5edfmwuy',
    'cmru2q8k7000k1y7wsw1mj4st',
    'cmr8ncoho00to1ygi7ghvderp',
    'cmr4djent012e1yky86t2y3p1',
    'cmr98mmbx00kp1ywyp9tatqv9',
    'cmr8hru0g024a1ylolaj3ohb3',
    'cmr98mkgj00k61ywyhohnc82d',
    'cmr97hy7r003c1ywy2z6um3n1'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_copd2_20261113_backup) <> 13 THEN
    RAISE EXCEPTION 'backup row count %, expected 13', (SELECT COUNT(*) FROM qbi_usmle_copd2_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET
  scenario = $s0$A 72-year-old woman presents to the emergency department with severe shortness of breath and a productive cough. She has a history of COPD and is currently on a long-acting beta-agonist and inhaled corticosteroid. On examination, her respiratory rate is 28 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Arterial blood gas analysis reveals a pH of 7.32, PaCO2 of 58 mm Hg, and PaO2 of 60 mm Hg. These gas-exchange values persist after one hour of nebulized albuterol and ipratropium, systemic corticosteroids, and oxygen targeted to a saturation of 88% to 92%.$s0$,
  explanation = $p0$The acidosis is still present after an hour of nebulized bronchodilators, systemic corticosteroids, and controlled oxygen, so noninvasive ventilation is the next step. GOLD 2025 uses it as the first mode of ventilation in acute respiratory failure, and these gases meet the BTS threshold (pH under 7.35, PaCO2 at least 6.5 kPa, respiratory rate above 23).

$p0$ || explanation,
  "references" = $r0$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV for a COPD exacerbation when pH remains under 7.35 and PaCO2 is at least 6.5 kPa after medical therapy, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$r0$::jsonb,
  "contentHash" = $h0$85b5d336293be38d96eefc61959f524da766dc6e3d94b73fa8cdf9b2ed982872$h0$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr4dj9pa011a1yky1oma2rrx' AND active = true AND "contentHash" = 'c8eeabcb9fa1f9dae2ad055cad8869ca30855c62f2a7b5f65b81c84b6af74a52';
UPDATE "QuestionBankItem"
SET
  scenario = $s1$A 65-year-old woman presents to the emergency department with worsening shortness of breath over the past week. She has a history of chronic obstructive pulmonary disease (COPD) and is currently on a long-acting beta-agonist and inhaled corticosteroid. On examination, her respiratory rate is 24 breaths per minute, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no acute infiltrates. Her arterial blood gas analysis reveals pH 7.32, PaCO2 60 mmHg, and PaO2 55 mmHg. These gas-exchange values persist after one hour of nebulized albuterol and ipratropium, systemic corticosteroids, and oxygen targeted to a saturation of 88% to 92%.$s1$,
  explanation = $p1$The acidosis is still present after an hour of nebulized bronchodilators, systemic corticosteroids, and controlled oxygen, so noninvasive ventilation is the next step. GOLD 2025 uses it as the first mode of ventilation in acute respiratory failure, and these gases meet the BTS threshold (pH under 7.35, PaCO2 at least 6.5 kPa, respiratory rate above 23).

$p1$ || explanation,
  "references" = $r1$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV for a COPD exacerbation when pH remains under 7.35 and PaCO2 is at least 6.5 kPa after medical therapy, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$r1$::jsonb,
  "contentHash" = $h1$6a55081c43ab4faa6314c64484c0e32d7db70df47aac414da91a966c2c25df58$h1$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8esql701es1yloktyho2sl' AND active = true AND "contentHash" = 'f69296ce930f890d2463bc3937fb8bec9ad2047b02df730f81ac92c71109b1a1';
UPDATE "QuestionBankItem"
SET
  scenario = $s2$A 72-year-old woman presents to the emergency department with severe shortness of breath and a productive cough. She has a history of COPD and is currently on a long-acting beta-agonist and an inhaled corticosteroid. On examination, her respiratory rate is 22 breaths per minute, oxygen saturation is 93% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation of the lungs but no infiltrates. Her arterial blood gas reveals a pH of 7.38, PaCO2 of 42 mm Hg, and PaO2 of 68 mm Hg. She has not yet received a bronchodilator.$s2$,
  explanation = replace(explanation, $a20$The patient's hypoxemia and hypercapnia indicate respiratory failure, but she is not yet in a state that requires intubation.$a20$, $b20$The pH is 7.38 and the PaCO2 is 42 mm Hg, so she is not in hypercapnic respiratory failure and does not need ventilatory support. GOLD 2025 recommends a short-acting beta-agonist with or without a short-acting anticholinergic as the initial bronchodilator.$b20$),
  "references" = $r2$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV for a COPD exacerbation when pH remains under 7.35 and PaCO2 is at least 6.5 kPa after medical therapy, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$r2$::jsonb,
  "contentHash" = $h2$ce57c2124ce7a6d1e77cb91eec8107fa0ddcc403e617d44ac5954c2f2f94bed2$h2$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr98mpha00ll1ywy0bnsixop' AND active = true AND "contentHash" = '5807cb9be10cd129b94464040b5b277cc96787bbc2c3712b9310e50a2b00519e';
UPDATE "QuestionBankItem"
SET
  scenario = $s3$A 65-year-old woman presents to the emergency department with worsening shortness of breath over the past week. She has a history of chronic obstructive pulmonary disease (COPD) and is currently on a long-acting beta-agonist and inhaled corticosteroids. On examination, her respiratory rate is 22 breaths/min, oxygen saturation is 93% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no acute infiltrates. Arterial blood gas analysis reveals a pH of 7.38, PaCO2 of 42 mm Hg, and PaO2 of 68 mm Hg. She has not yet received a bronchodilator.$s3$,
  explanation = replace(explanation, $a30$This patient shows signs of an **acute exacerbation** of COPD, indicated by hypoxemia and hypercapnia.$a30$, $b30$This patient is wheezing and short of breath, but the pH is 7.38 and the PaCO2 is 42 mm Hg, so this is not hypercapnic respiratory failure. GOLD 2025 recommends nebulized short-acting bronchodilators as the initial treatment.$b30$),
  "references" = $r3$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}, {"label": "BTS/ICS adult NIV algorithm. Start NIV for a COPD exacerbation when pH remains under 7.35 and PaCO2 is at least 6.5 kPa after medical therapy, with a respiratory rate above 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}]$r3$::jsonb,
  "contentHash" = $h3$12efa3045d3c4c5c7e5749c27d2871bc177eecc7fe3c6dce9d96fe0081f311f8$h3$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8hrsyg023x1yloh2qr5qlm' AND active = true AND "contentHash" = '17dc8404b2f1de57268cd6e35ee59bd2f13a9cc6347cb63a9b732d7897a1013b';
UPDATE "QuestionBankItem"
SET
  scenario = $s4$A 72-year-old man with a history of chronic obstructive pulmonary disease (COPD) presents to the clinic with increased shortness of breath and a productive cough. His vital signs show a respiratory rate of 24 breaths/min, oxygen saturation of 88% on room air, and a peak flow of 150 L/min. He is currently on a long-acting beta-agonist and inhaled corticosteroid. He has already received two nebulized albuterol treatments during this visit, with little relief, and he is using accessory muscles.$s4$,
  explanation = $p4$Bronchodilators have already been given and he is still severely short of breath, with an oxygen saturation of 88% and a peak flow of 150 L/min. GOLD 2025 uses systemic corticosteroids for a severe exacerbation.

$p4$ || explanation,
  "references" = $r4$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$r4$::jsonb,
  "contentHash" = $h4$32f3de0d0fae981719b4910b0cb55510e6efac090763388ec46ce140820a4875$h4$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8c3jvb00ge1ylox5yp3quh' AND active = true AND "contentHash" = 'ca24ecf801b21940f0972e6b883fc6fe20709ff2febbce621d02e5b67a44320c';
UPDATE "QuestionBankItem"
SET
  scenario = $s5$A 72-year-old man with a history of COPD presents to the clinic with worsening shortness of breath over the past week. He reports increased sputum production and a change in sputum color. His vital signs show a respiratory rate of 24 breaths/min, oxygen saturation of 88% on room air, and a temperature of 100.4°F. A chest X-ray shows hyperinflation but no infiltrates. Nebulized albuterol has already been given during this visit, with incomplete relief, and he is still short of breath at rest.$s5$,
  explanation = $p5$A nebulized short-acting bronchodilator has already been given and he remains hypoxic and short of breath, with increased purulent sputum and no pneumonia on the chest radiograph. GOLD 2025 uses systemic corticosteroids for a severe exacerbation.

$p5$ || explanation,
  "references" = $r5$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$r5$::jsonb,
  "contentHash" = $h5$a087cfc3319fe4ce0a6af16e4f06ad719579203fe99e583ecfcadba5c82984f8$h5$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8lyy2n00gc1ygi5edfmwuy' AND active = true AND "contentHash" = '374d4885201c74cd5d640f1f6ae30302e14b779f1147613fb62c396e9d12a6e9';
UPDATE "QuestionBankItem"
SET
  scenario = $s6$A 72-year-old man with a history of chronic obstructive pulmonary disease (COPD) presents to the clinic with increased shortness of breath and a productive cough. His vital signs show a respiratory rate of 18 breaths/min, oxygen saturation of 95% on room air, and a peak expiratory flow rate of 75% of his personal best. He is speaking in full sentences and has not used a rescue inhaler today. He is currently on a long-acting beta-agonist and inhaled corticosteroid.$s6$,
  explanation = $p6$This exacerbation is mild: oxygen saturation is 95%, the respiratory rate is 18, and he has not used a rescue inhaler. GOLD 2025 recommends a short-acting beta-agonist as the initial bronchodilator. Systemic corticosteroids are reserved for severe exacerbations.

$p6$ || explanation,
  "references" = $r6$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$r6$::jsonb,
  "contentHash" = $h6$78d9775af3818fb636b0643291ee59a064663157241d576a444fe5feca5573cf$h6$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmru2q8k7000k1y7wsw1mj4st' AND active = true AND "contentHash" = '68df8a4b6e8a2045cbe7bdadc3f7f845c47922e773e503e8dca98fab42b69122';
UPDATE "QuestionBankItem"
SET
  scenario = $s7$A 60-year-old man with a history of COPD presents to the clinic with worsening shortness of breath for the past week. He reports increased sputum production and a change in sputum color. His vital signs show a respiratory rate of 18 breaths/min, oxygen saturation of 95% on room air, and a blood pressure of 130/80 mm Hg. He is speaking in full sentences and has not used a rescue inhaler today. A chest X-ray shows hyperinflation but no infiltrates.$s7$,
  explanation = $p7$This exacerbation is mild: oxygen saturation is 95% and the respiratory rate is 18, and he has not used a rescue inhaler. GOLD 2025 recommends a short-acting beta-agonist as the initial bronchodilator.

$p7$ || explanation,
  "references" = $r7$[{"label": "GOLD 2025 pocket guide. Short-acting beta-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation. Systemic corticosteroids are for severe exacerbations and are not continued beyond 5 days. Noninvasive ventilation is the first mode of ventilation in acute respiratory failure.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$r7$::jsonb,
  "contentHash" = $h7$459244fb95d2599839c1ede93536eebe851fe0da1e4aa290aa0fd76835ca3b22$h7$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ncoho00to1ygi7ghvderp' AND active = true AND "contentHash" = '3a1de436ea1cb99955cc1d7f6f9060fbc965b85babf759b0aec39eff25fd873d';
UPDATE "QuestionBankItem"
SET active = false,
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id IN (
    'cmr4djent012e1yky86t2y3p1',
    'cmr98mmbx00kp1ywyp9tatqv9',
    'cmr8hru0g024a1ylolaj3ohb3',
    'cmr98mkgj00k61ywyhohnc82d',
    'cmr97hy7r003c1ywy2z6um3n1'
) AND active = true;
COMMIT;
