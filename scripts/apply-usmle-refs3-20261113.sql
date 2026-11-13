-- Third citation pass, 2026-11-13. Only references.
-- Backup qbi_usmle_refs3_20261113_backup (49 rows).
-- Undo: scripts/undo-usmle-refs3-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_refs3_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr98vpd800oa1ywyb8ohrb31',
    'b7xc5dcadb5ae2ff2423ac6aad7',
    'cmrwa0yfs00111ynhn2avomjc',
    'cmr8juily000h1ygiid2sbhlz',
    'cmr8m9d0m00kh1ygie4q0v58t',
    'cmr9bbvhe01en1ywy46cstqkl',
    'cmr97c4e9000k1ywy2gsvvh2a',
    'cmr8atx3i00141ylobz265i3v',
    'cmr8pgudh01cu1ygiv0x69rt9',
    'cmrvm5zj2001zjw04a0b6t5zo',
    'cmruyejab000c1y2y3vzt2t2p',
    'cmru8hze300az1yd6a1vcy2cy',
    'cmr8j0no202gu1yloehp1paf0',
    'b9x7280c0f1521a9f835448e0c0',
    'cmrtq0u4m001c1yqc9d1uaxpa',
    'cmru6qyxb002pl104g0t28pce',
    'cmr8juhmj00051ygiqby5qjxv',
    'cmrvwsatm002s1ye8tqv1basu',
    'cmrrv651n00o71y8wwe9xb6k4',
    'cmr87slbk00jz1yr9h3zl7pv8',
    'b4x1df379eaf5f7d3f86442610b',
    'cmrrw4xqv00g41yl8gxdom0w7',
    'cmr85uk1p001a1yw2c0lo2i36',
    'cmr4bvgbk00ev1ykyfcmbvjrm',
    'cmr8ji60r02mu1ylohk4o3og1',
    'cmr8nmh9200wa1ygi1mbmvnq0',
    'cmr8dq8x001011ylop6d3uhcc',
    'cmr8esnky01ds1yloo6imcs24',
    'cmr8lz2au00hg1ygie0dig3vt',
    'cmruymbr1004r1y2yme1s4ewr',
    'cmr8dqc0b010u1ylotk5ralqn',
    'cmr4bnv0300a31ykysahtwnt8',
    'cmr9c9rjb01ry1ywyjxyshvcn',
    'cmr8bfzye00zh1yw2xg87danr',
    'cmr8dih3600xf1ylos0us6tp2',
    'cmr97i22q004f1ywyryz70oww',
    'cmru9iwb200b71y0sci9ys6ov',
    'cmr4f6bcq01p31ykylw1u8zkl',
    'cmr8ji5rv02mr1yloeqjyehbu',
    'cmr9862wi00ee1ywy4a9fm733',
    'cmru9cvh7006q1y0szixfrf84',
    'cmrwa2lhk00211ynhqnqc3jya',
    'cmru39f7q00801y7wlp75kbr7',
    'cmru2q9w600101y7w6gdcrb4r',
    'cmru38yw5006w1y7wm6e1kn74',
    'cmr8bhi1f00791ylo3trlvnx8',
    'cmru7tmzw001f1yd6i572o3r4',
    'cmr4b336f00151ykyfqiy83sn',
    'cmr4c4t0a00hf1ykywaivgt9e'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs3_20261113_backup) <> 49 THEN
    RAISE EXCEPTION 'backup row count %, expected 49', (SELECT COUNT(*) FROM qbi_usmle_refs3_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" SET "references" = $j0$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j0$::jsonb WHERE id = 'cmr98vpd800oa1ywyb8ohrb31' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j1$[{"label": "MedlinePlus Medical Encyclopedia. Collapsed lung (pneumothorax).", "url": "https://medlineplus.gov/ency/article/000087.htm"}]$j1$::jsonb WHERE id = 'b7xc5dcadb5ae2ff2423ac6aad7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j2$[{"label": "MedlinePlus. Pelvic inflammatory disease is often caused by gonorrhea and chlamydia and is treated with antibiotics.", "url": "https://medlineplus.gov/pelvicinflammatorydisease.html"}]$j2$::jsonb WHERE id = 'cmrwa0yfs00111ynhn2avomjc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j3$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j3$::jsonb WHERE id = 'cmr8juily000h1ygiid2sbhlz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j4$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j4$::jsonb WHERE id = 'cmr8m9d0m00kh1ygie4q0v58t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j5$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j5$::jsonb WHERE id = 'cmr9bbvhe01en1ywy46cstqkl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j6$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j6$::jsonb WHERE id = 'cmr97c4e9000k1ywy2gsvvh2a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j7$[{"label": "MedlinePlus Medical Encyclopedia. Atelectasis is common after surgery. Treatment includes incentive spirometry, and chest imaging is used.", "url": "https://medlineplus.gov/ency/article/000065.htm"}]$j7$::jsonb WHERE id = 'cmr8atx3i00141ylobz265i3v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j8$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j8$::jsonb WHERE id = 'cmr8pgudh01cu1ygiv0x69rt9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j9$[{"label": "MedlinePlus. Gonorrhea.", "url": "https://medlineplus.gov/gonorrhea.html"}]$j9$::jsonb WHERE id = 'cmrvm5zj2001zjw04a0b6t5zo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j10$[{"label": "MedlinePlus. Lung cancer.", "url": "https://medlineplus.gov/lungcancer.html"}]$j10$::jsonb WHERE id = 'cmruyejab000c1y2y3vzt2t2p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j11$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j11$::jsonb WHERE id = 'cmru8hze300az1yd6a1vcy2cy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j12$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j12$::jsonb WHERE id = 'cmr8j0no202gu1yloehp1paf0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j13$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in the hospital with insulin and replacement fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j13$::jsonb WHERE id = 'b9x7280c0f1521a9f835448e0c0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j14$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j14$::jsonb WHERE id = 'cmrtq0u4m001c1yqc9d1uaxpa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j15$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in the hospital with insulin and replacement fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j15$::jsonb WHERE id = 'cmru6qyxb002pl104g0t28pce' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j16$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j16$::jsonb WHERE id = 'cmr8juhmj00051ygiqby5qjxv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j17$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j17$::jsonb WHERE id = 'cmrvwsatm002s1ye8tqv1basu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j18$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j18$::jsonb WHERE id = 'cmrrv651n00o71y8wwe9xb6k4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j19$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j19$::jsonb WHERE id = 'cmr87slbk00jz1yr9h3zl7pv8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j20$[{"label": "MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis is treated in the hospital with insulin and replacement fluids.", "url": "https://medlineplus.gov/ency/article/000320.htm"}]$j20$::jsonb WHERE id = 'b4x1df379eaf5f7d3f86442610b' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j21$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j21$::jsonb WHERE id = 'cmrrw4xqv00g41yl8gxdom0w7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j22$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j22$::jsonb WHERE id = 'cmr85uk1p001a1yw2c0lo2i36' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j23$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j23$::jsonb WHERE id = 'cmr4bvgbk00ev1ykyfcmbvjrm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j24$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j24$::jsonb WHERE id = 'cmr8ji60r02mu1ylohk4o3og1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j25$[{"label": "MedlinePlus Medical Encyclopedia. Emergency treatment of high potassium includes calcium given into a vein for the heart effects.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j25$::jsonb WHERE id = 'cmr8nmh9200wa1ygi1mbmvnq0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j26$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j26$::jsonb WHERE id = 'cmr8dq8x001011ylop6d3uhcc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j27$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j27$::jsonb WHERE id = 'cmr8esnky01ds1yloo6imcs24' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j28$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j28$::jsonb WHERE id = 'cmr8lz2au00hg1ygie0dig3vt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j29$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j29$::jsonb WHERE id = 'cmruymbr1004r1y2yme1s4ewr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j30$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j30$::jsonb WHERE id = 'cmr8dqc0b010u1ylotk5ralqn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j31$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j31$::jsonb WHERE id = 'cmr4bnv0300a31ykysahtwnt8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j32$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j32$::jsonb WHERE id = 'cmr9c9rjb01ry1ywyjxyshvcn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j33$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j33$::jsonb WHERE id = 'cmr8bfzye00zh1yw2xg87danr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j34$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j34$::jsonb WHERE id = 'cmr8dih3600xf1ylos0us6tp2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j35$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j35$::jsonb WHERE id = 'cmr97i22q004f1ywyryz70oww' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j36$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j36$::jsonb WHERE id = 'cmru9iwb200b71y0sci9ys6ov' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j37$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j37$::jsonb WHERE id = 'cmr4f6bcq01p31ykylw1u8zkl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j38$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j38$::jsonb WHERE id = 'cmr8ji5rv02mr1yloeqjyehbu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j39$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j39$::jsonb WHERE id = 'cmr9862wi00ee1ywy4a9fm733' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j40$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j40$::jsonb WHERE id = 'cmru9cvh7006q1y0szixfrf84' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j41$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j41$::jsonb WHERE id = 'cmrwa2lhk00211ynhqnqc3jya' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j42$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j42$::jsonb WHERE id = 'cmru39f7q00801y7wlp75kbr7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j43$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j43$::jsonb WHERE id = 'cmru2q9w600101y7w6gdcrb4r' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j44$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j44$::jsonb WHERE id = 'cmru38yw5006w1y7wm6e1kn74' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j45$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j45$::jsonb WHERE id = 'cmr8bhi1f00791ylo3trlvnx8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j46$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j46$::jsonb WHERE id = 'cmru7tmzw001f1yd6i572o3r4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j47$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j47$::jsonb WHERE id = 'cmr4b336f00151ykyfqiy83sn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j48$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines that can reduce hunger and weight. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j48$::jsonb WHERE id = 'cmr4c4t0a00hf1ykywaivgt9e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
COMMIT;
