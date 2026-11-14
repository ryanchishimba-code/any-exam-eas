-- Fourth citation batch for served USMLE Step 3 items with no URL, 2026-11-14.
-- Backup qbi_usmle_refs_s3d_20261114_backup (113 rows). Only references are updated.
-- The two previously flagged keys are not included.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3d-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3d_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr31dkrk00bkjs04nnbqo1zn',
    'cmr4b2yug00001ykykhow58nj',
    'cmr4bnux700a21ykytzhrcs7s',
    'cmr4d3vvx00v81ykyrpgj9g7x',
    'cmr4dqssn014y1ykysgtmqar2',
    'cmr4dqtjf01561ykycios3993',
    'cmr4dz8cz018a1ykyk3lv9370',
    'cmr4exs4201l51ykywd9xcxxw',
    'cmr4fl2w401vu1ykyw1kflnrs',
    'cmr4fthgo01zu1ykyc8fnllsx',
    'cmr4gbjmn02531yky76j0car9',
    'cmr8atvr6000r1ylok78h4od5',
    'cmr8atw6d000v1yloz8r9933a',
    'cmr8atww100121ylo2hefb5ct',
    'cmr8baha0003t1ylogcv7sgfe',
    'cmr8bhgoq006v1ylosu0xhau8',
    'cmr8br59t00aa1ylo74fnotxj',
    'cmr8br60k00aj1yloffw5avoi',
    'cmr8br8cx00bc1yloyhlyfm1x',
    'cmr8cn9oz00nm1ylo4noh9hsu',
    'cmr8cnc8q00og1ylo6skd70vp',
    'cmr8d1v1p00qf1yloxkgpag9g',
    'cmr8db6tx00tj1ylov8cj2dia',
    'cmr8db99w00u71ylonou3lno6',
    'cmr8dih9i00xh1ylovd9gejt9',
    'cmr8dyo61014j1ylo49xqfpp5',
    'cmr8e5y6s017j1ylo6bxq9e41',
    'cmr8e5ycp017l1yloozqx0n5j',
    'cmr8esotx01e71ylo5srmdyl5',
    'cmr8fz7x601nc1yloiedw06c8',
    'cmr8fz92901nq1yloryqhhhcj',
    'cmr8g7c1r01r51ylokle00908',
    'cmr8g7dq201rp1ylo8qttv5d3',
    'cmr8gr4hs01tp1ylo0fjbmaog',
    'cmr8gr5ik01tw1ylotpu4z9jc',
    'cmr8gr6jb01u31ylok38ow4u6',
    'cmr8gr8dt01um1ylohvs1i32a',
    'cmr8hgdf801zq1ylojjblwxd3',
    'cmr8j9pta02jz1ylojizl2s06',
    'cmr8ji8a502nm1ylofr0y3fg8',
    'cmr8juhph00061ygi74c59ylv',
    'cmr8julu4001k1ygi0y6fppwb',
    'cmr8l1mp700771ygin0euaypx',
    'cmr8l1nt3007i1ygiyt9kmmh7',
    'cmr8lqh6g00d81ygihoul1i2z',
    'cmr8lqif600dh1ygiysto6iyb',
    'cmr8lqjjb00dt1ygibz0j2uyh',
    'cmr8lql0100eb1ygiwg43g947',
    'cmr8m9b3n00jy1ygid7u2u8z2',
    'cmr8m9c7700kc1ygiun0y5beo',
    'cmr8n3pej00pv1ygiqhv61acj',
    'cmr8nco3t00tk1ygifm48huu6',
    'cmr8ncr7900ug1ygi92art24w',
    'cmr8nmh6c00w91ygiuommq5bf',
    'cmr8nmhn100wf1ygi5er9t5t7',
    'cmr8nmilg00wr1ygijdl97ilx',
    'cmr8nmjtg00x71ygiyfurk1sh',
    'cmr8ny66f010f1ygiusbn9v5g',
    'cmr8p29ba01an1ygi40rnhcuc',
    'cmr8pved401g21ygio6hv3g3a',
    'cmr8pvf6001ga1ygirljmnfzi',
    'cmr8pvfno01gf1ygi2g82rgs0',
    'cmr8pvh2401gt1ygit72htmta',
    'cmr8q426r01jf1ygiqa7eazgl',
    'cmr8q43iz01jw1ygizrzqc19p',
    'cmr8qfpth01n41ygi0e36sm13',
    'cmr97c2zx00061ywyb0leyzbp',
    'cmr97c72z001b1ywyxaygr3y6',
    'cmr97c7yq001k1ywy96k68buw',
    'cmr97hyzt003k1ywy83l70fab',
    'cmr97i2d9004i1ywy4xph55pg',
    'cmr97qid200861ywyeln7thtk',
    'cmr97z00l00ap1ywyh8bp9kjy',
    'cmr98605e00df1ywyydpg8uq8',
    'cmr98mk9i00k41ywyieqd2r6m',
    'cmr98vndf00nm1ywye3rkh8x7',
    'cmr98vq7a00ok1ywyy0n9phsg',
    'cmr98vr7x00ow1ywy7nhark2x',
    'cmr996kc800re1ywy87o4ip7t',
    'cmr99igox00tt1ywycp1dfoxi',
    'cmr99reqf00x81ywybvz7tel0',
    'cmr99rf2t00xc1ywy2gokkf94',
    'cmr99rfh300xh1ywyauleyp2i',
    'cmr99rfy500xn1ywyy6viyvmm',
    'cmr99rgzj00y01ywyqb12366v',
    'cmr9aen5901421ywym50i0dt9',
    'cmr9aubj401721ywyg5v30dgm',
    'cmr9bbsll01dv1ywy1gku2jwt',
    'cmr9bbt8m01e11ywy25kvzf1r',
    'cmr9bv0rj01kw1ywy9g89t33y',
    'cmr9c9mux01qo1ywyvl8jbjxx',
    'cmr9c9p9h01rc1ywy8nncao38',
    'cmru2q9h5000v1y7wy0po9irr',
    'cmru3gdb900az1y7w69ryawi9',
    'cmru3n5uj00e21y7wm1jfmnk4',
    'cmru3n7gj00ek1y7wfclmul7w',
    'cmru3ugqk00i91y7wadvdcylh',
    'cmru7tne5001k1yd68cpexr9e',
    'cmru855pt003u1yd6rr1hzcyo',
    'cmru857gw004g1yd60h6x0a1r',
    'cmru8589n004q1yd67c734l2t',
    'cmru8hylh00ar1yd68d62vnbm',
    'cmru96ni1003v1y0smzzi2mhx',
    'cmru9iqwk009y1y0sk4hvfmp6',
    'cmru9irqq00a51y0sbial3q1n',
    'cmru9it2b00ag1y0srnxbs731',
    'cmruih1w0002j1yce8p2qugal',
    'cmruyj6yj00361y2ye4g1mmkw',
    'cmruyj71700371y2y5f1n22vu',
    'cmrvwq41t001n1ye883nsw924',
    'cmrvwqxjb00221ye8okdkqxww',
    'cmrvwvpmx004t1ye8bnxnwpal',
    'cmtpxc4pi004m1ymuzs90uetk'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3d_20261114_backup;
  IF n <> 113 THEN RAISE EXCEPTION 'backup %, expected 113', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3d_0$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_0$::jsonb
WHERE id = 'cmr31dkrk00bkjs04nnbqo1zn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_1$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_1$::jsonb
WHERE id = 'cmr4b2yug00001ykykhow58nj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_2$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_2$::jsonb
WHERE id = 'cmr4bnux700a21ykytzhrcs7s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_3$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_3$::jsonb
WHERE id = 'cmr4d3vvx00v81ykyrpgj9g7x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_4$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_4$::jsonb
WHERE id = 'cmr4dqssn014y1ykysgtmqar2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_5$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_5$::jsonb
WHERE id = 'cmr4dqtjf01561ykycios3993' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_6$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_6$::jsonb
WHERE id = 'cmr4dz8cz018a1ykyk3lv9370' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_7$[{"label": "NICE NG31. If a person may be entering the last days of life, gather and document their goals and wishes and the views of those important to them.", "url": "https://www.nice.org.uk/guidance/ng31/chapter/Recommendations"}]$s3d_7$::jsonb
WHERE id = 'cmr4exs4201l51ykywd9xcxxw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_8$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_8$::jsonb
WHERE id = 'cmr4fl2w401vu1ykyw1kflnrs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_9$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_9$::jsonb
WHERE id = 'cmr4fthgo01zu1ykyc8fnllsx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_10$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_10$::jsonb
WHERE id = 'cmr4gbjmn02531yky76j0car9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_11$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_11$::jsonb
WHERE id = 'cmr8atvr6000r1ylok78h4od5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_12$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_12$::jsonb
WHERE id = 'cmr8atw6d000v1yloz8r9933a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_13$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_13$::jsonb
WHERE id = 'cmr8atww100121ylo2hefb5ct' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_14$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_14$::jsonb
WHERE id = 'cmr8baha0003t1ylogcv7sgfe' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_15$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_15$::jsonb
WHERE id = 'cmr8bhgoq006v1ylosu0xhau8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_16$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_16$::jsonb
WHERE id = 'cmr8br59t00aa1ylo74fnotxj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_17$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_17$::jsonb
WHERE id = 'cmr8br60k00aj1yloffw5avoi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_18$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_18$::jsonb
WHERE id = 'cmr8br8cx00bc1yloyhlyfm1x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_19$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_19$::jsonb
WHERE id = 'cmr8cn9oz00nm1ylo4noh9hsu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_20$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_20$::jsonb
WHERE id = 'cmr8cnc8q00og1ylo6skd70vp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_21$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_21$::jsonb
WHERE id = 'cmr8d1v1p00qf1yloxkgpag9g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_22$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_22$::jsonb
WHERE id = 'cmr8db6tx00tj1ylov8cj2dia' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_23$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_23$::jsonb
WHERE id = 'cmr8db99w00u71ylonou3lno6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_24$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_24$::jsonb
WHERE id = 'cmr8dih9i00xh1ylovd9gejt9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_25$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_25$::jsonb
WHERE id = 'cmr8dyo61014j1ylo49xqfpp5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_26$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_26$::jsonb
WHERE id = 'cmr8e5y6s017j1ylo6bxq9e41' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_27$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_27$::jsonb
WHERE id = 'cmr8e5ycp017l1yloozqx0n5j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_28$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_28$::jsonb
WHERE id = 'cmr8esotx01e71ylo5srmdyl5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_29$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_29$::jsonb
WHERE id = 'cmr8fz7x601nc1yloiedw06c8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_30$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_30$::jsonb
WHERE id = 'cmr8fz92901nq1yloryqhhhcj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_31$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_31$::jsonb
WHERE id = 'cmr8g7c1r01r51ylokle00908' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_32$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_32$::jsonb
WHERE id = 'cmr8g7dq201rp1ylo8qttv5d3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_33$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_33$::jsonb
WHERE id = 'cmr8gr4hs01tp1ylo0fjbmaog' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_34$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_34$::jsonb
WHERE id = 'cmr8gr5ik01tw1ylotpu4z9jc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_35$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_35$::jsonb
WHERE id = 'cmr8gr6jb01u31ylok38ow4u6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_36$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_36$::jsonb
WHERE id = 'cmr8gr8dt01um1ylohvs1i32a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_37$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_37$::jsonb
WHERE id = 'cmr8hgdf801zq1ylojjblwxd3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_38$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_38$::jsonb
WHERE id = 'cmr8j9pta02jz1ylojizl2s06' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_39$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_39$::jsonb
WHERE id = 'cmr8ji8a502nm1ylofr0y3fg8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_40$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_40$::jsonb
WHERE id = 'cmr8juhph00061ygi74c59ylv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_41$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_41$::jsonb
WHERE id = 'cmr8julu4001k1ygi0y6fppwb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_42$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_42$::jsonb
WHERE id = 'cmr8l1mp700771ygin0euaypx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_43$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_43$::jsonb
WHERE id = 'cmr8l1nt3007i1ygiyt9kmmh7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_44$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_44$::jsonb
WHERE id = 'cmr8lqh6g00d81ygihoul1i2z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_45$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_45$::jsonb
WHERE id = 'cmr8lqif600dh1ygiysto6iyb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_46$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_46$::jsonb
WHERE id = 'cmr8lqjjb00dt1ygibz0j2uyh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_47$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_47$::jsonb
WHERE id = 'cmr8lql0100eb1ygiwg43g947' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_48$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_48$::jsonb
WHERE id = 'cmr8m9b3n00jy1ygid7u2u8z2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_49$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_49$::jsonb
WHERE id = 'cmr8m9c7700kc1ygiun0y5beo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_50$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_50$::jsonb
WHERE id = 'cmr8n3pej00pv1ygiqhv61acj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_51$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_51$::jsonb
WHERE id = 'cmr8nco3t00tk1ygifm48huu6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_52$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_52$::jsonb
WHERE id = 'cmr8ncr7900ug1ygi92art24w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_53$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_53$::jsonb
WHERE id = 'cmr8nmh6c00w91ygiuommq5bf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_54$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_54$::jsonb
WHERE id = 'cmr8nmhn100wf1ygi5er9t5t7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_55$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_55$::jsonb
WHERE id = 'cmr8nmilg00wr1ygijdl97ilx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_56$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_56$::jsonb
WHERE id = 'cmr8nmjtg00x71ygiyfurk1sh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_57$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_57$::jsonb
WHERE id = 'cmr8ny66f010f1ygiusbn9v5g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_58$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_58$::jsonb
WHERE id = 'cmr8p29ba01an1ygi40rnhcuc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_59$[{"label": "NICE NG31. If a person may be entering the last days of life, gather and document their goals and wishes and the views of those important to them.", "url": "https://www.nice.org.uk/guidance/ng31/chapter/Recommendations"}]$s3d_59$::jsonb
WHERE id = 'cmr8pved401g21ygio6hv3g3a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_60$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_60$::jsonb
WHERE id = 'cmr8pvf6001ga1ygirljmnfzi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_61$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_61$::jsonb
WHERE id = 'cmr8pvfno01gf1ygi2g82rgs0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_62$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_62$::jsonb
WHERE id = 'cmr8pvh2401gt1ygit72htmta' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_63$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_63$::jsonb
WHERE id = 'cmr8q426r01jf1ygiqa7eazgl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_64$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_64$::jsonb
WHERE id = 'cmr8q43iz01jw1ygizrzqc19p' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_65$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_65$::jsonb
WHERE id = 'cmr8qfpth01n41ygi0e36sm13' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_66$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_66$::jsonb
WHERE id = 'cmr97c2zx00061ywyb0leyzbp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_67$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_67$::jsonb
WHERE id = 'cmr97c72z001b1ywyxaygr3y6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_68$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_68$::jsonb
WHERE id = 'cmr97c7yq001k1ywy96k68buw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_69$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_69$::jsonb
WHERE id = 'cmr97hyzt003k1ywy83l70fab' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_70$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_70$::jsonb
WHERE id = 'cmr97i2d9004i1ywy4xph55pg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_71$[{"label": "NICE NG31. If a person may be entering the last days of life, gather and document their goals and wishes and the views of those important to them.", "url": "https://www.nice.org.uk/guidance/ng31/chapter/Recommendations"}]$s3d_71$::jsonb
WHERE id = 'cmr97qid200861ywyeln7thtk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_72$[{"label": "NICE NG31. If a person may be entering the last days of life, gather and document their goals and wishes and the views of those important to them.", "url": "https://www.nice.org.uk/guidance/ng31/chapter/Recommendations"}]$s3d_72$::jsonb
WHERE id = 'cmr97z00l00ap1ywyh8bp9kjy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_73$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_73$::jsonb
WHERE id = 'cmr98605e00df1ywyydpg8uq8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_74$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_74$::jsonb
WHERE id = 'cmr98mk9i00k41ywyieqd2r6m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_75$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_75$::jsonb
WHERE id = 'cmr98vndf00nm1ywye3rkh8x7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_76$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_76$::jsonb
WHERE id = 'cmr98vq7a00ok1ywyy0n9phsg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_77$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_77$::jsonb
WHERE id = 'cmr98vr7x00ow1ywy7nhark2x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_78$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_78$::jsonb
WHERE id = 'cmr996kc800re1ywy87o4ip7t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_79$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_79$::jsonb
WHERE id = 'cmr99igox00tt1ywycp1dfoxi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_80$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_80$::jsonb
WHERE id = 'cmr99reqf00x81ywybvz7tel0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_81$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_81$::jsonb
WHERE id = 'cmr99rf2t00xc1ywy2gokkf94' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_82$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_82$::jsonb
WHERE id = 'cmr99rfh300xh1ywyauleyp2i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_83$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_83$::jsonb
WHERE id = 'cmr99rfy500xn1ywyy6viyvmm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_84$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_84$::jsonb
WHERE id = 'cmr99rgzj00y01ywyqb12366v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_85$[{"label": "NICE CG100. The guideline covers recognition and management of acute alcohol withdrawal, including seizures and delirium tremens.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3d_85$::jsonb
WHERE id = 'cmr9aen5901421ywym50i0dt9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_86$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_86$::jsonb
WHERE id = 'cmr9aubj401721ywyg5v30dgm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_87$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_87$::jsonb
WHERE id = 'cmr9bbsll01dv1ywy1gku2jwt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_88$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Useful diagnostic features are fever, right-upper-quadrant pain or tenderness, Murphy's sign, an elevated white-cell count, and imaging signs of gallbladder inflammation.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_88$::jsonb
WHERE id = 'cmr9bbt8m01e11ywy25kvzf1r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_89$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_89$::jsonb
WHERE id = 'cmr9bv0rj01kw1ywy9g89t33y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_90$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_90$::jsonb
WHERE id = 'cmr9c9mux01qo1ywyvl8jbjxx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_91$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_91$::jsonb
WHERE id = 'cmr9c9p9h01rc1ywy8nncao38' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_92$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_92$::jsonb
WHERE id = 'cmru2q9h5000v1y7wy0po9irr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_93$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_93$::jsonb
WHERE id = 'cmru3gdb900az1y7w69ryawi9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_94$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_94$::jsonb
WHERE id = 'cmru3n5uj00e21y7wm1jfmnk4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_95$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_95$::jsonb
WHERE id = 'cmru3n7gj00ek1y7wfclmul7w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_96$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_96$::jsonb
WHERE id = 'cmru3ugqk00i91y7wadvdcylh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_97$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_97$::jsonb
WHERE id = 'cmru7tne5001k1yd68cpexr9e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_98$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_98$::jsonb
WHERE id = 'cmru855pt003u1yd6rr1hzcyo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_99$[{"label": "NICE NG31. If a person may be entering the last days of life, gather and document their goals and wishes and the views of those important to them.", "url": "https://www.nice.org.uk/guidance/ng31/chapter/Recommendations"}]$s3d_99$::jsonb
WHERE id = 'cmru857gw004g1yd60h6x0a1r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_100$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_100$::jsonb
WHERE id = 'cmru8589n004q1yd67c734l2t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_101$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_101$::jsonb
WHERE id = 'cmru8hylh00ar1yd68d62vnbm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_102$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_102$::jsonb
WHERE id = 'cmru96ni1003v1y0smzzi2mhx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_103$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_103$::jsonb
WHERE id = 'cmru9iqwk009y1y0sk4hvfmp6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_104$[{"label": "Pisano M et al. 2020 WSES guidelines for acute calculus cholecystitis. Early laparoscopic cholecystectomy should be the standard of care whenever possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"}]$s3d_104$::jsonb
WHERE id = 'cmru9irqq00a51y0sbial3q1n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_105$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_105$::jsonb
WHERE id = 'cmru9it2b00ag1y0srnxbs731' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_106$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT when acute stroke may need thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3d_106$::jsonb
WHERE id = 'cmruih1w0002j1yce8p2qugal' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_107$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_107$::jsonb
WHERE id = 'cmruyj6yj00361y2ye4g1mmkw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_108$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT when acute stroke may need thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3d_108$::jsonb
WHERE id = 'cmruyj71700371y2y5f1n22vu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_109$[{"label": "NICE NG133. For severe pre-eclampsia or eclampsia, give magnesium sulfate using the Collaborative Eclampsia Trial regimen, a 4 g intravenous loading dose.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3d_109$::jsonb
WHERE id = 'cmrvwq41t001n1ye883nsw924' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_110$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3d_110$::jsonb
WHERE id = 'cmrvwqxjb00221ye8okdkqxww' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_111$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT when acute stroke may need thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3d_111$::jsonb
WHERE id = 'cmrvwvpmx004t1ye8bnxnwpal' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3d_112$[{"label": "Metlay JP et al. ATS/IDSA guideline for community-acquired pneumonia, 2019. Empiric antibiotics should be started for adults with clinically suspected and radiographically confirmed pneumonia, regardless of the procalcitonin result.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$s3d_112$::jsonb
WHERE id = 'cmtpxc4pi004m1ymuzs90uetk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3d_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 113 THEN RAISE EXCEPTION 'cited %, expected 113', n; END IF;
END $cited$;
COMMIT;
