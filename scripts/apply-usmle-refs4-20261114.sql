-- Citations for served USMLE items that still had no real source, 2026-11-14.
-- 57 items. Only references. Each URL was fetched with curl and returned HTTP 200.
-- Backup qbi_usmle_refs4_20261114_backup.
-- Undo: scripts/undo-usmle-refs4-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs4_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr88s43700ub1yr9n61woi66',
    'cmr86y5s600741yw2k8llqtzr',
    'cmrr4t30t000z1y6ppojfnpvl',
    'cmr8ccffd00kd1ylo5r5eisvg',
    'b8xac385f851f216e2832121154',
    'cmqxdzyts00d61yma4svvtfit',
    'cmrtf2ny3000k1y30je09ewn2',
    'cmrrt9fe5000l1y8w5fgnhcn0',
    'cmrtgrhxy000x1yaxwftp5935',
    'cmqxcjvgk00471yma4ui29gcp',
    'cmrrtqxy6006v1y8wzb52ypxb',
    'cmr8ayq4300w91yw299z6nnqr',
    'cmra6lzah003lic0484rq9z6s',
    'cmrpvuwwm000f1yh5pqd687ex',
    'cmr8bhk01007t1yloq09k6kjw',
    'cmr8e5wjd016y1ylo3iprr6kq',
    'cmrsf3ipo002s1y55aruvrnxa',
    'cmr8ccekr00k31yloypct6y07',
    'cmrrbwafr000ll104b5zznwy4',
    'cmrpw58h5002t1yrt01uznn4h',
    'cmrsew94000021y55m1kj4015',
    'cmrrt94u9000d1y8wwrf6wym7',
    'cmrrt957w000f1y8we0jpyhvw',
    'cmrrtm6th004r1y8woj4vdfb0',
    'cmrrbwaqh000wl1046zg3cd5g',
    'cmrpw59ro00361yrt8z5vi5er',
    'cmrruaj0d00dk1y8w409y3ts1',
    'cmrruxte700lq1y8winn4r2h3',
    'cmrtgrf0k00031yaxktltkkds',
    'cmru6qy2w001ul104y5drxip0',
    'cmrvm5ykj000zjw04qmblgzjb',
    'cmrtqfyn600011yx3qmgfq69n',
    'b4x0de8b70207f555e1f903a617',
    'cmr4een7a01fq1ykyyd6k4rtw',
    'cmr8j0q1k02hn1ylosgrd8dem',
    'cmrtf2nvb000j1y30zixak805',
    'cmru396h9007g1y7wghsvoxz3',
    'b10x765747f952211fdc9b3a2d6d',
    'b6x8edd1edeb9a9416d23d01815',
    'cmr8p26wo019t1ygi16b7xqw2',
    'cmrubf2kv00011yu7or9m9f5v',
    'cmruye63y00051y2y2bniyp8f',
    'cmruye69t00071y2y8k9trobo',
    'cmr8o9h2401311ygichvc01eh',
    'cmr31djmj00a8js04dt5c8dh2',
    'cmr89lv1901051yr9l24lhmj5',
    'cmr8ccgwg015i1yw290tjr7sf',
    'cmr8f0kst00cz1yazqps0oss0',
    'cmr8juj0u000m1ygiv1xk3dnh',
    'cmru7tlqc000z1yd6pk57jvxp',
    'cmruyfhoo00111y2yfa6kwird',
    'cmruidthk000s1yce4porudmm',
    'cmruihp58002v1yceoqdr1yzi',
    'cmruyf60x000r1y2ytrn8fqx8',
    'cmruyfu6300171y2ydo1zhwf3',
    'cmqd1n0g800bm1ychr8drjwnk',
    'cmqxdy5ro000j1y79mxgtmskz'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs4_20261114_backup) <> 57 THEN
    RAISE EXCEPTION 'backup row count %, expected 57', (SELECT COUNT(*) FROM qbi_usmle_refs4_20261114_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" SET "references" = $j0$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j0$::jsonb WHERE id = 'cmr88s43700ub1yr9n61woi66' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j1$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j1$::jsonb WHERE id = 'cmr86y5s600741yw2k8llqtzr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j2$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j2$::jsonb WHERE id = 'cmrr4t30t000z1y6ppojfnpvl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j3$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j3$::jsonb WHERE id = 'cmr8ccffd00kd1ylo5r5eisvg' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j4$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j4$::jsonb WHERE id = 'b8xac385f851f216e2832121154' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j5$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j5$::jsonb WHERE id = 'cmqxdzyts00d61yma4svvtfit' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j6$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j6$::jsonb WHERE id = 'cmrtf2ny3000k1y30je09ewn2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j7$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j7$::jsonb WHERE id = 'cmrrt9fe5000l1y8w5fgnhcn0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j8$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j8$::jsonb WHERE id = 'cmrtgrhxy000x1yaxwftp5935' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j9$[{"label": "MedlinePlus. Cirrhosis.", "url": "https://medlineplus.gov/cirrhosis.html"}]$j9$::jsonb WHERE id = 'cmqxcjvgk00471yma4ui29gcp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j10$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j10$::jsonb WHERE id = 'cmrrtqxy6006v1y8wzb52ypxb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j11$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j11$::jsonb WHERE id = 'cmr8ayq4300w91yw299z6nnqr' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j12$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j12$::jsonb WHERE id = 'cmra6lzah003lic0484rq9z6s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j13$[{"label": "MedlinePlus. Meningitis.", "url": "https://medlineplus.gov/meningitis.html"}]$j13$::jsonb WHERE id = 'cmrpvuwwm000f1yh5pqd687ex' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j14$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j14$::jsonb WHERE id = 'cmr8bhk01007t1yloq09k6kjw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j15$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j15$::jsonb WHERE id = 'cmr8e5wjd016y1ylo3iprr6kq' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j16$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and do not treat viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j16$::jsonb WHERE id = 'cmrsf3ipo002s1y55aruvrnxa' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j17$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j17$::jsonb WHERE id = 'cmr8ccekr00k31yloypct6y07' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j18$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j18$::jsonb WHERE id = 'cmrrbwafr000ll104b5zznwy4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j19$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j19$::jsonb WHERE id = 'cmrpw58h5002t1yrt01uznn4h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j20$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j20$::jsonb WHERE id = 'cmrsew94000021y55m1kj4015' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j21$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j21$::jsonb WHERE id = 'cmrrt94u9000d1y8wwrf6wym7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j22$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j22$::jsonb WHERE id = 'cmrrt957w000f1y8we0jpyhvw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j23$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and do not treat viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j23$::jsonb WHERE id = 'cmrrtm6th004r1y8woj4vdfb0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j24$[{"label": "MedlinePlus Medical Encyclopedia. A high potassium level is a high level in the blood and can affect the heart.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j24$::jsonb WHERE id = 'cmrrbwaqh000wl1046zg3cd5g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j25$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j25$::jsonb WHERE id = 'cmrpw59ro00361yrt8z5vi5er' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j26$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j26$::jsonb WHERE id = 'cmrruaj0d00dk1y8w409y3ts1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j27$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j27$::jsonb WHERE id = 'cmrruxte700lq1y8winn4r2h3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j28$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j28$::jsonb WHERE id = 'cmrtgrf0k00031yaxktltkkds' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j29$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j29$::jsonb WHERE id = 'cmru6qy2w001ul104y5drxip0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j30$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j30$::jsonb WHERE id = 'cmrvm5ykj000zjw04qmblgzjb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j31$[{"label": "MedlinePlus Genetics. GCK-MODY causes mild fasting hyperglycemia.", "url": "https://medlineplus.gov/genetics/condition/maturity-onset-diabetes-of-the-young/"}]$j31$::jsonb WHERE id = 'cmrtqfyn600011yx3qmgfq69n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j32$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j32$::jsonb WHERE id = 'b4x0de8b70207f555e1f903a617' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j33$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j33$::jsonb WHERE id = 'cmr4een7a01fq1ykyyd6k4rtw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j34$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j34$::jsonb WHERE id = 'cmr8j0q1k02hn1ylosgrd8dem' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j35$[{"label": "MedlinePlus. Tuberculosis.", "url": "https://medlineplus.gov/tuberculosis.html"}]$j35$::jsonb WHERE id = 'cmrtf2nvb000j1y30zixak805' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j36$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j36$::jsonb WHERE id = 'cmru396h9007g1y7wghsvoxz3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j37$[{"label": "MedlinePlus. Sickle cell disease.", "url": "https://medlineplus.gov/sicklecelldisease.html"}]$j37$::jsonb WHERE id = 'b10x765747f952211fdc9b3a2d6d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j38$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j38$::jsonb WHERE id = 'b6x8edd1edeb9a9416d23d01815' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j39$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j39$::jsonb WHERE id = 'cmr8p26wo019t1ygi16b7xqw2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j40$[{"label": "MedlinePlus. Hypothyroidism.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j40$::jsonb WHERE id = 'cmrubf2kv00011yu7or9m9f5v' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j41$[{"label": "MedlinePlus. Depression.", "url": "https://medlineplus.gov/depression.html"}]$j41$::jsonb WHERE id = 'cmruye63y00051y2y2bniyp8f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j42$[{"label": "MedlinePlus. Migraine.", "url": "https://medlineplus.gov/migraine.html"}]$j42$::jsonb WHERE id = 'cmruye69t00071y2y8k9trobo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j43$[{"label": "NIDDK. GLP-1 receptor agonists are diabetes medicines. They are not substitutes for insulin.", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"}]$j43$::jsonb WHERE id = 'cmr8o9h2401311ygichvc01eh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j44$[{"label": "MedlinePlus Medical Encyclopedia. A high potassium level is a high level in the blood and can affect the heart.", "url": "https://medlineplus.gov/ency/article/001179.htm"}]$j44$::jsonb WHERE id = 'cmr31djmj00a8js04dt5c8dh2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j45$[{"label": "MedlinePlus. Daily asthma control medicines reduce airway inflammation.", "url": "https://medlineplus.gov/asthma.html"}]$j45$::jsonb WHERE id = 'cmr89lv1901051yr9l24lhmj5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j46$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j46$::jsonb WHERE id = 'cmr8ccgwg015i1yw290tjr7sf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j47$[{"label": "MedlinePlus. Multiple sclerosis.", "url": "https://medlineplus.gov/multiplesclerosis.html"}]$j47$::jsonb WHERE id = 'cmr8f0kst00cz1yazqps0oss0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j48$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and do not treat viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j48$::jsonb WHERE id = 'cmr8juj0u000m1ygiv1xk3dnh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j49$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and do not treat viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j49$::jsonb WHERE id = 'cmru7tlqc000z1yd6pk57jvxp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j50$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j50$::jsonb WHERE id = 'cmruyfhoo00111y2yfa6kwird' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j51$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j51$::jsonb WHERE id = 'cmruidthk000s1yce4porudmm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j52$[{"label": "MedlinePlus. Rheumatoid arthritis.", "url": "https://medlineplus.gov/rheumatoidarthritis.html"}]$j52$::jsonb WHERE id = 'cmruihp58002v1yceoqdr1yzi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j53$[{"label": "MedlinePlus. Heart failure.", "url": "https://medlineplus.gov/heartfailure.html"}]$j53$::jsonb WHERE id = 'cmruyf60x000r1y2ytrn8fqx8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j54$[{"label": "MedlinePlus. Stroke.", "url": "https://medlineplus.gov/stroke.html"}]$j54$::jsonb WHERE id = 'cmruyfu6300171y2ydo1zhwf3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j55$[{"label": "MedlinePlus. Anemia.", "url": "https://medlineplus.gov/anemia.html"}]$j55$::jsonb WHERE id = 'cmqd1n0g800bm1ychr8drjwnk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem" SET "references" = $j56$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j56$::jsonb WHERE id = 'cmqxdy5ro000j1y79mxgtmskz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references")='array' AND jsonb_array_length("references")>0 AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','')<>'' OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
COMMIT;
