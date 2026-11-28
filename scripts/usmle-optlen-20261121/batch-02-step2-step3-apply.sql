-- Served USMLE option-length fix, 2026-11-21, batch 2 (Step 2 and Step 3).
-- Wording only. The same choice stays correct. correctAnswer is updated only when its option text changes, and it stays an exact option string.
-- Staging table: qbi_usmle_optlen_20261121_stage
-- Backup: qbi_usmle_optlen_20261121_b2_backup (79 rows), created in this transaction.
-- Undo: scripts/usmle-optlen-20261121/batch-02-step2-step3-undo.sql
-- Do not run against production until this draft is reviewed. This file does not apply itself.
BEGIN;

CREATE TABLE IF NOT EXISTS qbi_usmle_optlen_20261121_stage (
  id text PRIMARY KEY,
  step text NOT NULL,
  batch integer NOT NULL,
  old_options text NOT NULL,
  new_options text NOT NULL,
  old_correct text NOT NULL,
  new_correct text NOT NULL,
  old_explanation text NOT NULL,
  new_explanation text NOT NULL,
  old_key_len integer NOT NULL,
  old_second_len integer NOT NULL,
  new_key_len integer NOT NULL,
  new_second_len integer NOT NULL,
  old_length_ratio numeric NOT NULL,
  new_length_ratio numeric NOT NULL
);

DO $guard$
BEGIN
  IF to_regclass('public.qbi_usmle_optlen_20261121_b2_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_optlen_20261121_b2_backup already exists; undo or drop it before re-applying';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_stage WHERE batch = 2) <> 0 THEN
    RAISE EXCEPTION 'staging table already has batch 2 rows';
  END IF;
END
$guard$;

CREATE TABLE qbi_usmle_optlen_20261121_b2_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
  $bk23945d493$3945d493-479d-48ed-9a92-6db3f6fc4b32$bk23945d493$,
  $bk23e3863f6$3e3863f6-928f-4d04-89f1-edbfa672ead0$bk23e3863f6$,
  $bk2459ef180$459ef180-c381-4af1-b7fc-650d04529291$bk2459ef180$,
  $bk258d4cbcb$58d4cbcb-2599-43b8-97d7-6b67e5fe252b$bk258d4cbcb$,
  $bk268705928$68705928-18b1-45db-8f75-88b2c91eaccf$bk268705928$,
  $bk28b7da117$8b7da117-9732-4f1d-b0fa-211840d2f871$bk28b7da117$,
  $bk2a0ebcb7f$a0ebcb7f-75e4-4d8a-a957-abccc112a932$bk2a0ebcb7f$,
  $bk2b10x812e$b10x812eba9787236b08fd74e213$bk2b10x812e$,
  $bk2b10xdcc3$b10xdcc323b352ece439bf9f8d1f$bk2b10xdcc3$,
  $bk2b7x55535$b7x5553587c70d9532f5826da44$bk2b7x55535$,
  $bk2b7x5a54e$b7x5a54e4754e66de4049cae722$bk2b7x5a54e$,
  $bk2b7xcfbe1$b7xcfbe1dbc680407dc91444698$bk2b7xcfbe1$,
  $bk2b8x205af$b8x205afe3b147f348c03cde9b0$bk2b8x205af$,
  $bk2b8x7b03a$b8x7b03a47fe101c0953d74ccdb$bk2b8x7b03a$,
  $bk2b8xb1695$b8xb1695d0f4c858e03afaf507d$bk2b8xb1695$,
  $bk2b8xb1987$b8xb1987408b9c5c744ff91889e$bk2b8xb1987$,
  $bk2b8xb5de5$b8xb5de566d86f4268d064c22e7$bk2b8xb5de5$,
  $bk2b8xe612c$b8xe612c1fd50e8bbec64753ff2$bk2b8xe612c$,
  $bk2cmpnjgx1$cmpnjgx1b001t1ymxdcrs99j7$bk2cmpnjgx1$,
  $bk2cmpnjhav$cmpnjhav700211ymxhu3gprmr$bk2cmpnjhav$,
  $bk2cmpnjhb2$cmpnjhb2900221ymxlz4v3t94$bk2cmpnjhb2$,
  $bk2cmpnjjlx$cmpnjjlxf0awe1ymxp2alr335$bk2cmpnjjlx$,
  $bk2cmpnjjlx$cmpnjjlxf0awj1ymxqx4p6knk$bk2cmpnjjlx$,
  $bk2cmqiy35g$cmqiy35gn000u1yugv3j579ri$bk2cmqiy35g$,
  $bk2cmqvw643$cmqvw643d00d2ju04yoxj3men$bk2cmqvw643$,
  $bk2cmr87slw$cmr87slw000k61yr9gfb0d3p5$bk2cmr87slw$,
  $bk2cmr891c0$cmr891c0900xg1yr9rftwycdk$bk2cmr891c0$,
  $bk2cmrrvrs4$cmrrvrs4c009o1yl88swzb7zp$bk2cmrrvrs4$,
  $bk2db380a15$db380a15-5831-431f-90fb-ba207a4dbf64$bk2db380a15$,
  $bk205d41302$05d41302-d7a1-4401-9f54-566fd02884c8$bk205d41302$,
  $bk2119f9e59$119f9e59-5807-4953-9ff0-e4082b48a80a$bk2119f9e59$,
  $bk21ccdf247$1ccdf247-4621-4a03-8bff-5f3e6212f55c$bk21ccdf247$,
  $bk22631a2e1$2631a2e1-a0da-422e-befb-b746d4bb75b3$bk22631a2e1$,
  $bk24dd34b8f$4dd34b8f-2b82-4796-be63-bee4bf49d988$bk24dd34b8f$,
  $bk24f7e30b9$4f7e30b9-1a8a-45c8-bf94-7141a5c15960$bk24f7e30b9$,
  $bk2594198c6$594198c6-e5de-4918-811c-1872bde294bb$bk2594198c6$,
  $bk25e4308ad$5e4308ad-368b-4622-8505-86eb94e68afa$bk25e4308ad$,
  $bk270c4dd4c$70c4dd4c-81bd-4600-872f-136129131122$bk270c4dd4c$,
  $bk2a79db614$a79db614-f061-4de6-9068-10c83bb6fcb0$bk2a79db614$,
  $bk2aed73106$aed73106-13aa-49d4-a00a-121cff8e8057$bk2aed73106$,
  $bk2cbe57fa6$cbe57fa6-9d83-499e-898c-cef23ac8e2eb$bk2cbe57fa6$,
  $bk2cc41e7c7$cc41e7c7-b5b4-4d5e-996a-720e1f9828a6$bk2cc41e7c7$,
  $bk2cmq33a0f$cmq33a0fk006p1yiudpaxp96g$bk2cmq33a0f$,
  $bk2cmqasnpt$cmqasnptt001t1ycy3gi05t2s$bk2cmqasnpt$,
  $bk2cmr31djy$cmr31djye00aljs04bxy0r40b$bk2cmr31djy$,
  $bk2cmr4bny3$cmr4bny3k00b61ykyudwqivun$bk2cmr4bny3$,
  $bk2cmr4ftej$cmr4ftejd01yt1ykyt4klux7p$bk2cmr4ftej$,
  $bk2cmr4g0up$cmr4g0up9022a1ykyb19agdh7$bk2cmr4g0up$,
  $bk2cmr8br7p$cmr8br7pc00b41ylof91njnqa$bk2cmr8br7p$,
  $bk2cmr8e5vk$cmr8e5vko016m1ylofmq6eiaf$bk2cmr8e5vk$,
  $bk2cmr8e5wa$cmr8e5wat016v1ylosf5q1qfo$bk2cmr8e5wa$,
  $bk2cmr8e5wd$cmr8e5wdr016w1yloi18qya32$bk2cmr8e5wd$,
  $bk2cmr8g794$cmr8g794001q51ylokr7o2c50$bk2cmr8g794$,
  $bk2cmr8hrv2$cmr8hrv2l024n1yloznxxd1wn$bk2cmr8hrv2$,
  $bk2cmr8ie5j$cmr8ie5jt029v1yloaiph46j7$bk2cmr8ie5j$,
  $bk2cmr8ie84$cmr8ie84s02al1ylolxh8hfon$bk2cmr8ie84$,
  $bk2cmr8mlt4$cmr8mlt4p00mr1ygie3vkinga$bk2cmr8mlt4$,
  $bk2cmr8mltl$cmr8mltld00mx1ygigxhk7mmt$bk2cmr8mltl$,
  $bk2cmr8quyg$cmr8quyg501pv1ygil5gqi87p$bk2cmr8quyg$,
  $bk2cmr8qv0q$cmr8qv0qv01qo1ygi5ig67gks$bk2cmr8qv0q$,
  $bk2cmr98602$cmr98602p00de1ywyyk62gz1l$bk2cmr98602$,
  $bk2cmr996io$cmr996io400qu1ywyub9s2kn0$bk2cmr996io$,
  $bk2cmr99ij4$cmr99ij4a00ui1ywyo96w27zq$bk2cmr99ij4$,
  $bk2cmr9b2cx$cmr9b2cxo01a91ywy6hrnwllf$bk2cmr9b2cx$,
  $bk2cmr9b2fs$cmr9b2fsa01b81ywy1pdhfm45$bk2cmr9b2fs$,
  $bk2cmru32ne$cmru32ne4004k1y7w5aklg504$bk2cmru32ne$,
  $bk2cmru3n5e$cmru3n5em00dx1y7w7x8reyny$bk2cmru3n5e$,
  $bk2cmru6qyt$cmru6qytb002ll104s58x9sjt$bk2cmru6qyt$,
  $bk2cmru96kg$cmru96kg300361y0sxybovjci$bk2cmru96kg$,
  $bk2cmru96ko$cmru96koy00381y0szeypjpp5$bk2cmru96ko$,
  $bk2cmrvm5z3$cmrvm5z3h001kjw04iwhbev9b$bk2cmrvm5z3$,
  $bk2cmrvm5zj$cmrvm5zj2001zjw04a0b6t5zo$bk2cmrvm5zj$,
  $bk2cmrx1ltu$cmrx1ltuq0014l705e32qeuxo$bk2cmrx1ltu$,
  $bk2cmrx1luh$cmrx1luhf001ol7057gkr09tb$bk2cmrx1luh$,
  $bk2cmryh2h4$cmryh2h4v000el40443gu17n5$bk2cmryh2h4$,
  $bk2cmtpx6e8$cmtpx6e87000w1ymuyqwdwquv$bk2cmtpx6e8$,
  $bk2cmwfxt05$cmwfxt05o0000lj08rhtqqg47$bk2cmwfxt05$,
  $bk2cmwfxt08$cmwfxt0880001lj08rtvdwbsj$bk2cmwfxt08$,
  $bk2fbc40daf$fbc40daf-8e04-4aa1-8919-4bb6ffa1ac30$bk2fbc40daf$
);

DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup) <> 79 THEN
    RAISE EXCEPTION 'backup row count %, expected 79', (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup);
  END IF;
END
$check$;

INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_0id$3945d493-479d-48ed-9a92-6db3f6fc4b32$s2_0id$,
  $s2_0st$usmle-step-2$s2_0st$,
  2,
  $s2_0oo${"options":["Blood cultures if they do not delay treatment, immediate intravenous antibiotics, and 30 mL/kg crystalloid, with norepinephrine if hypotension persists","Oral amoxicillin and clinic follow-up tomorrow","Hydrocortisone as the only initial therapy","Nicardipine to lower the blood pressure further","Wait for sputum culture sensitivities before any antibiotic"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"Adolescent septic shock uses the adult-hour bundle","kind":"vignette"}$s2_0oo$,
  $s2_0no${"options":["Blood cultures if they do not delay care, immediate IV antibiotics, 30 mL/kg crystalloid, and norepinephrine if hypotension persists","Oral amoxicillin and a clinic visit tomorrow if the fever and pressure improve overnight","Hydrocortisone as the only initial therapy, before fluids, cultures, or an antibiotic","Nicardipine to push the blood pressure still lower while cultures are pending","Wait for final sputum culture susceptibilities before any antibiotic, crystalloid bolus, or vasopressor is started today"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"Adolescent septic shock uses the adult-hour bundle","kind":"vignette"}$s2_0no$,
  $s2_0oc$Blood cultures if they do not delay treatment, immediate intravenous antibiotics, and 30 mL/kg crystalloid, with norepinephrine if hypotension persists$s2_0oc$,
  $s2_0nc$Blood cultures if they do not delay care, immediate IV antibiotics, 30 mL/kg crystalloid, and norepinephrine if hypotension persists$s2_0nc$,
  $s2_0oe$This adolescent has septic shock from pneumonia: fever, hypotension, lactate above 4 mmol/L, and organ dysfunction in the form of confusion and hypoxia. At this age and size the adult sepsis bundle applies. Obtain blood cultures if doing so does not substantially delay antibiotics, start broad intravenous antibiotics within the hour, and give about 30 mL/kg of crystalloid, reassessing perfusion. If mean arterial pressure remains below 65 mm Hg, norepinephrine is the first vasopressor. Oral amoxicillin and next-day follow-up are the plan for a well outpatient, not for shock. Corticosteroids are considered only when shock is refractory to fluids and vasopressors; they are not the first and only drug. Nicardipine would worsen hypotension. Waiting for sputum sensitivities withholds the time-critical antibiotic. A neonate would not receive a reflexive 30 mL/kg adult bolus; this 17-year-old is physiologically in the population the adult bundle was written for. Source control here is antibiotics and oxygen, with drainage only if an empyema is later defined.$s2_0oe$,
  $s2_0ne$This adolescent has septic shock from pneumonia: fever, hypotension, lactate above 4 mmol/L, and organ dysfunction in the form of confusion and hypoxia. At this age and size the adult sepsis bundle applies. Obtain blood cultures if doing so does not substantially delay antibiotics, start broad intravenous antibiotics within the hour, and give about 30 mL/kg of crystalloid, reassessing perfusion. If mean arterial pressure remains below 65 mm Hg, norepinephrine is the first vasopressor. Oral amoxicillin and next-day follow-up are the plan for a well outpatient, not for shock. Corticosteroids are considered only when shock is refractory to fluids and vasopressors; they are not the first and only drug. Nicardipine would worsen hypotension. Waiting for sputum sensitivities withholds the time-critical antibiotic. A neonate would not receive a reflexive 30 mL/kg adult bolus; this 17-year-old is physiologically in the population the adult bundle was written for. Source control here is antibiotics and oxygen, with drainage only if an empyema is later defined.$s2_0ne$,
  151, 59, 132, 120,
  2.559322, 1.100000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_1id$3e3863f6-928f-4d04-89f1-edbfa672ead0$s2_1id$,
  $s2_1st$usmle-step-2$s2_1st$,
  2,
  $s2_1oo${"options":["Antenatal corticosteroids and delivery at 34 weeks if she remains stable, with magnesium when delivery is undertaken","Cesarean tonight solely because the diagnosis is severe preeclampsia","Expectant management until 39 weeks","Lisinopril and discharge","No corticosteroids and no plan for delivery"],"blueprintSystem":"reproductive-endocrine","taskCategory":"clinical-intervention","blueprintTopic":"Stable severe preeclampsia before 34 weeks can be expectant","kind":"vignette"}$s2_1oo$,
  $s2_1no${"options":["Antenatal corticosteroids and delivery at 34 weeks if she remains stable, with magnesium when delivery is undertaken","Cesarean tonight solely because the diagnosis is severe preeclampsia, before steroids or magnesium","Expectant management until 39 weeks with home pressure checks and no steroids","Lisinopril for the pressure, then discharge with outpatient follow-up","No corticosteroids and no delivery plan while the pressure stays controlled on bed rest"],"blueprintSystem":"reproductive-endocrine","taskCategory":"clinical-intervention","blueprintTopic":"Stable severe preeclampsia before 34 weeks can be expectant","kind":"vignette"}$s2_1no$,
  $s2_1oc$Antenatal corticosteroids and delivery at 34 weeks if she remains stable, with magnesium when delivery is undertaken$s2_1oc$,
  $s2_1nc$Antenatal corticosteroids and delivery at 34 weeks if she remains stable, with magnesium when delivery is undertaken$s2_1nc$,
  $s2_1oe$Severe preeclampsia before 34 weeks may be managed expectantly if the mother and fetus are stable, in a facility that can care for both, with a plan to deliver at 34 weeks. Immediate cesarean is not required by the diagnosis alone when blood pressure is controlled, there is no pulmonary edema, laboratories are acceptable, and the fetus is reassured. Waiting until 39 weeks ignores the natural history of severe disease. Antenatal corticosteroids are given for fetal lung maturity because delivery is planned inside the window where they help, and they should not be skipped just because she might remain stable for a week. Magnesium sulfate is used for seizure prophylaxis when she is delivered, and it is part of inpatient surveillance now according to the severity that brought her in. Lisinopril is contraindicated. The route of delivery at 34 weeks depends on obstetric factors, not on an automatic cesarean tonight. This is the narrow window between 'deliver now' for instability and 'deliver at 37 weeks' for preeclampsia without severe features. Recheck symptoms, pressures, and laboratories frequently, and abandon expectant care if any unstable feature appears.$s2_1oe$,
  $s2_1ne$Severe preeclampsia before 34 weeks may be managed expectantly if the mother and fetus are stable, in a facility that can care for both, with a plan to deliver at 34 weeks. Immediate cesarean is not required by the diagnosis alone when blood pressure is controlled, there is no pulmonary edema, laboratories are acceptable, and the fetus is reassured. Waiting until 39 weeks ignores the natural history of severe disease. Antenatal corticosteroids are given for fetal lung maturity because delivery is planned inside the window where they help, and they should not be skipped just because she might remain stable for a week. Magnesium sulfate is used for seizure prophylaxis when she is delivered, and it is part of inpatient surveillance now according to the severity that brought her in. Lisinopril is contraindicated. The route of delivery at 34 weeks depends on obstetric factors, not on an automatic cesarean tonight. This is the narrow window between 'deliver now' for instability and 'deliver at 37 weeks' for preeclampsia without severe features. Recheck symptoms, pressures, and laboratories frequently, and abandon expectant care if any unstable feature appears.$s2_1ne$,
  116, 68, 116, 98,
  1.705882, 1.183673
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_2id$459ef180-c381-4af1-b7fc-650d04529291$s2_2id$,
  $s2_2st$usmle-step-2$s2_2st$,
  2,
  $s2_2oo${"options":["Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement","Emergency-department closure and oral antibiotics only","No antibiotics because the wound was rinsed","Primary closure and a walking boot tonight","Observation for ten days before any antibiotic"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"Open fractures need antibiotics and operative debridement","kind":"vignette"}$s2_2oo$,
  $s2_2no${"options":["Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement","Emergency-department closure and oral antibiotics only, with no trip to the operating room","No antibiotics, because the wound was rinsed with saline before it was dressed","Primary closure tonight in a walking boot, saving antibiotics for a later fever","Observation for ten days before antibiotics, tetanus prophylaxis, or a washout"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"Open fractures need antibiotics and operative debridement","kind":"vignette"}$s2_2no$,
  $s2_2oc$Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement$s2_2oc$,
  $s2_2nc$Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement$s2_2nc$,
  $s2_2oe$An open fracture communicates with the environment and needs early intravenous antibiotics, tetanus prophylaxis when immunization is outdated, splinting, and operative irrigation and debridement. Closing the wound in the emergency department traps contamination and is not definitive care. Oral cephalexin and a ten-day delay are not the trauma plan, even if the foot is well perfused and there is no compartment syndrome. A rinse at the bedside does not replace operative debridement of bone and soft tissue. The absence of shock means he does not need a laparotomy, not that the fracture can be treated like a clean laceration. Update tetanus because eight years exceeds the interval used for a contaminated wound. Choose the antibiotic spectrum in the operating-room pathway according to contamination and fracture grade rather than with a leftover oral prescription. The limb-threatening misses in this scenario would be a missed compartment syndrome or a vascular injury; those examinations are currently acceptable, so the error to correct is the outpatient closure.$s2_2oe$,
  $s2_2ne$An open fracture communicates with the environment and needs early intravenous antibiotics, tetanus prophylaxis when immunization is outdated, splinting, and operative irrigation and debridement. Closing the wound in the emergency department traps contamination and is not definitive care. Oral cephalexin and a ten-day delay are not the trauma plan, even if the foot is well perfused and there is no compartment syndrome. A rinse at the bedside does not replace operative debridement of bone and soft tissue. The absence of shock means he does not need a laparotomy, not that the fracture can be treated like a clean laceration. Update tetanus because eight years exceeds the interval used for a contaminated wound. Choose the antibiotic spectrum in the operating-room pathway according to contamination and fracture grade rather than with a leftover oral prescription. The limb-threatening misses in this scenario would be a missed compartment syndrome or a vascular injury; those examinations are currently acceptable, so the error to correct is the outpatient closure.$s2_2ne$,
  97, 54, 97, 90,
  1.796296, 1.077778
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_3id$58d4cbcb-2599-43b8-97d7-6b67e5fe252b$s2_3id$,
  $s2_3st$usmle-step-2$s2_3st$,
  2,
  $s2_3oo${"options":["A home inotrope infusion because the ejection fraction is under 35%","Digoxin alone, because a low ejection fraction is a digoxin deficiency","Start an ARNI or an ACE inhibitor or ARB, an evidence-based beta blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor","Diltiazem in place of a beta blocker","Daily ibuprofen for the fatigue of heart failure"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"hfref-start-foundational-therapy","kind":"vignette"}$s2_3oo$,
  $s2_3no${"options":["A home inotrope infusion because the ejection fraction is under 35% and congestion is mild","Digoxin alone, because a reduced ejection fraction is simply a digoxin deficiency and needs no other disease-modifying drug","Start an ARNI, ACE inhibitor, or ARB, plus an evidence-based beta blocker, a mineralocorticoid antagonist, and an SGLT2 inhibitor","Diltiazem in place of a beta blocker to slow the rate and improve filling","Daily ibuprofen for the fatigue and aching that come with heart failure"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"hfref-start-foundational-therapy","kind":"vignette"}$s2_3no$,
  $s2_3oc$Start an ARNI or an ACE inhibitor or ARB, an evidence-based beta blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor$s2_3oc$,
  $s2_3nc$Start an ARNI, ACE inhibitor, or ARB, plus an evidence-based beta blocker, a mineralocorticoid antagonist, and an SGLT2 inhibitor$s2_3nc$,
  $s2_3oe$HFrEF with EF 30% is treated with four foundational drugs, titrated as tolerated: an ARNI (or an ACE inhibitor or ARB), an evidence-based beta blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor. Digoxin alone does not replace that regimen and is not first-line disease-modifying therapy. Daily ibuprofen promotes sodium retention and can precipitate another decompensation. Diltiazem is a negative inotrope and is not a substitute for carvedilol, metoprolol succinate, or bisoprolol in HFrEF. A home inotrope is for selected stage D patients who remain advanced and refractory, not for a euvolemic man who walks a block on a loop diuretic only.$s2_3oe$,
  $s2_3ne$HFrEF with EF 30% is treated with four foundational drugs, titrated as tolerated: an ARNI (or an ACE inhibitor or ARB), an evidence-based beta blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor. Digoxin alone does not replace that regimen and is not first-line disease-modifying therapy. Daily ibuprofen promotes sodium retention and can precipitate another decompensation. Diltiazem is a negative inotrope and is not a substitute for carvedilol, metoprolol succinate, or bisoprolol in HFrEF. A home inotrope is for selected stage D patients who remain advanced and refractory, not for a euvolemic man who walks a block on a loop diuretic only.$s2_3ne$,
  137, 70, 129, 123,
  1.957143, 1.048780
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_4id$68705928-18b1-45db-8f75-88b2c91eaccf$s2_4id$,
  $s2_4st$usmle-step-2$s2_4st$,
  2,
  $s2_4oo${"options":["Vancomycin 500 mg enterally four times daily plus intravenous metronidazole, and surgical consultation","Loperamide and oral metronidazole only","Intravenous vancomycin as the only antibiotic","Fidaxomicin and discharge to psychiatry","Diphenoxylate and observation"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"Fulminant C. difficile needs high-dose enteral vancomycin and intravenous metronidazole","kind":"vignette"}$s2_4oo$,
  $s2_4no${"options":["Vancomycin 500 mg enterally four times daily plus intravenous metronidazole, and surgical consultation","Loperamide plus oral metronidazole only, with no enteral vancomycin and no surgical consult","Intravenous vancomycin as the only antibiotic, with nothing given into the gut","Fidaxomicin, then discharge to psychiatry without a surgical evaluation","Diphenoxylate and ward observation, with no antibiotic and no operation"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"Fulminant C. difficile needs high-dose enteral vancomycin and intravenous metronidazole","kind":"vignette"}$s2_4no$,
  $s2_4oc$Vancomycin 500 mg enterally four times daily plus intravenous metronidazole, and surgical consultation$s2_4oc$,
  $s2_4nc$Vancomycin 500 mg enterally four times daily plus intravenous metronidazole, and surgical consultation$s2_4nc$,
  $s2_4oe$Hypotension, ileus, and megacolon define fulminant C. difficile infection. The antimicrobial regimen is vancomycin 500 mg four times daily by mouth or nasogastric tube, plus intravenous metronidazole 500 mg every 8 hours. If ileus is complete, rectal vancomycin is considered so drug still reaches the colon. Loperamide and diphenoxylate are stopped; antimotility agents worsen megacolon. Intravenous vancomycin alone does not treat the lumen. Fidaxomicin is for non-fulminant disease and does not replace surgery consultation when the colon is dilating and she is in shock. She also needs the sepsis bundle, fluids and early antibiotics, but the disease-specific addition is the high-dose enteral vancomycin, intravenous metronidazole, and a surgeon, because perforation or a colon that fails medical therapy requires subtotal colectomy. Transfer to psychiatry without source control is how these patients arrest on a floor that cannot operate. Stop the loperamide that was given overnight before any more doses are given.$s2_4oe$,
  $s2_4ne$Hypotension, ileus, and megacolon define fulminant C. difficile infection. The antimicrobial regimen is vancomycin 500 mg four times daily by mouth or nasogastric tube, plus intravenous metronidazole 500 mg every 8 hours. If ileus is complete, rectal vancomycin is considered so drug still reaches the colon. Loperamide and diphenoxylate are stopped; antimotility agents worsen megacolon. Intravenous vancomycin alone does not treat the lumen. Fidaxomicin is for non-fulminant disease and does not replace surgery consultation when the colon is dilating and she is in shock. She also needs the sepsis bundle, fluids and early antibiotics, but the disease-specific addition is the high-dose enteral vancomycin, intravenous metronidazole, and a surgeon, because perforation or a colon that fails medical therapy requires subtotal colectomy. Transfer to psychiatry without source control is how these patients arrest on a floor that cannot operate. Stop the loperamide that was given overnight before any more doses are given.$s2_4ne$,
  102, 45, 102, 91,
  2.266667, 1.120879
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_5id$8b7da117-9732-4f1d-b0fa-211840d2f871$s2_5id$,
  $s2_5st$usmle-step-2$s2_5st$,
  2,
  $s2_5oo${"options":["Long-acting beta-agonist plus long-acting muscarinic antagonist only","Triple therapy with a long-acting beta-agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid","Inhaled corticosteroid monotherapy","Chronic oral prednisone","No maintenance inhaler until he stops smoking"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"copd-high-eosinophils-triple","kind":"vignette"}$s2_5oo$,
  $s2_5no${"options":["A long-acting beta-agonist plus a long-acting muscarinic antagonist only, holding the inhaled corticosteroid","Triple therapy with a long-acting beta-agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid","Inhaled corticosteroid monotherapy until the next exacerbation declares itself","Chronic oral prednisone as the daily anti-inflammatory maintenance drug","No maintenance inhaler until he has stopped smoking and symptoms are still present"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"copd-high-eosinophils-triple","kind":"vignette"}$s2_5no$,
  $s2_5oc$Triple therapy with a long-acting beta-agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid$s2_5oc$,
  $s2_5nc$Triple therapy with a long-acting beta-agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid$s2_5nc$,
  $s2_5oe$The deciding fact is the eosinophil count of 380 cells/µL in a patient who already meets the frequent-exacerbation group. GOLD supports starting an inhaled corticosteroid together with dual long-acting bronchodilators when eosinophils are at least 300 and exacerbations are frequent. Pneumonia risk is real and is why eosinophils below 100 argue against a steroid; it is not a reason to withhold triple therapy at 380. Inhaled corticosteroid monotherapy does not bronchodilate and is not COPD maintenance. Oral prednisone as a standing drug causes harm without the benefits of the inhaled regimen. Smoking cessation matters and does not have to be completed before an indicated inhaler is started; withholding therapy until abstinence uses a behavior as a gate. Prescribe triple therapy, offer cessation treatment the same day, and review inhaler technique before he leaves the clinic.$s2_5oe$,
  $s2_5ne$The deciding fact is the eosinophil count of 380 cells/µL in a patient who already meets the frequent-exacerbation group. GOLD supports starting an inhaled corticosteroid together with dual long-acting bronchodilators when eosinophils are at least 300 and exacerbations are frequent. Pneumonia risk is real and is why eosinophils below 100 argue against a steroid; it is not a reason to withhold triple therapy at 380. Inhaled corticosteroid monotherapy until the next exacerbation declares itself does not bronchodilate and is not COPD maintenance. Oral prednisone as a standing drug causes harm without the benefits of the inhaled regimen. Smoking cessation matters and does not have to be completed before an indicated inhaler is started; withholding therapy until abstinence uses a behavior as a gate. Prescribe triple therapy, offer cessation treatment the same day, and review inhaler technique before he leaves the clinic.$s2_5ne$,
  114, 68, 114, 108,
  1.676471, 1.055556
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_6id$a0ebcb7f-75e4-4d8a-a957-abccc112a932$s2_6id$,
  $s2_6st$usmle-step-2$s2_6st$,
  2,
  $s2_6oo${"options":["Reassessed isotonic fluid boluses, cultures, and immediate parenteral antibiotics, without delaying antibiotics for lumbar puncture","Home observation because a sibling has a cold","Oral amoxicillin and a clinic visit tomorrow","Albuterol and nasal suction only","Wait 48 hours for culture results before any antibiotic"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"Toxic neonate with fever is resuscitated as sepsis","kind":"vignette"}$s2_6oo$,
  $s2_6no${"options":["Repeated isotonic boluses, cultures, and immediate IV antibiotics, not delayed for lumbar puncture","Home observation, because a sibling has a cold and this illness is likely viral","Oral amoxicillin and a clinic visit tomorrow if the fever is no better","Albuterol and nasal suction only, with no parenteral antibiotic and no fluid bolus","Wait 48 hours for culture results before any antibiotic or fluid resuscitation"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"Toxic neonate with fever is resuscitated as sepsis","kind":"vignette"}$s2_6no$,
  $s2_6oc$Reassessed isotonic fluid boluses, cultures, and immediate parenteral antibiotics, without delaying antibiotics for lumbar puncture$s2_6oc$,
  $s2_6nc$Repeated isotonic boluses, cultures, and immediate IV antibiotics, not delayed for lumbar puncture$s2_6nc$,
  $s2_6oe$A febrile, poorly perfused neonate is in septic shock until proven otherwise. The first month of life is the highest-risk age band for invasive bacterial infection, and this infant already has hypotension, delayed refill, and lethargy, so the bronchiolitis and 'viral sibling' pathways used in older infants do not apply. Give isotonic fluid in cautious boluses with reassessment, draw cultures, and start parenteral antibiotics immediately. Lumbar puncture is important but must not delay antibiotics in an unstable infant; it is performed once he can tolerate positioning. Waiting for cultures or sending him home on oral amoxicillin misses the time-critical hour. Albuterol treats neither shock nor neonatal sepsis. Adult 30 mL/kg dosing is not the neonatal fluid prescription; boluses are smaller and reassessed so fluid overload is not added to a sick newborn. Early-onset pathogens include group B streptococcus, E. coli, and Listeria, which is why the antibiotic choice is parenteral and broad for this age, not a single oral agent. The age, not the sibling's cold, sets the urgency.$s2_6oe$,
  $s2_6ne$A febrile, poorly perfused neonate is in septic shock until proven otherwise. The first month of life is the highest-risk age band for invasive bacterial infection, and this infant already has hypotension, delayed refill, and lethargy, so the bronchiolitis and 'viral sibling' pathways used in older infants do not apply. Give isotonic fluid in cautious boluses with reassessment, draw cultures, and start parenteral antibiotics immediately. Lumbar puncture is important but must not delay antibiotics in an unstable infant; it is performed once he can tolerate positioning. Waiting for cultures or sending him home on oral amoxicillin misses the time-critical hour. Albuterol treats neither shock nor neonatal sepsis. Adult 30 mL/kg dosing is not the neonatal fluid prescription; boluses are smaller and reassessed so fluid overload is not added to a sick newborn. Early-onset pathogens include group B streptococcus, E. coli, and Listeria, which is why the antibiotic choice is parenteral and broad for this age, not a single oral agent. The age, not the sibling's cold, sets the urgency.$s2_6ne$,
  131, 55, 98, 82,
  2.381818, 1.195122
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_7id$b10x812eba9787236b08fd74e213$s2_7id$,
  $s2_7st$usmle-step-2$s2_7st$,
  2,
  $s2_7oo$["Near-syncope after nitrate means the valve was not the limiter","His orifice is fixed and tiny, so preload reduction leaves the ventricle unable to fill enough to push through it","A valve area of 2.0 cm2 is the one that cannot tolerate preload loss","Chest pain means both valves will crash with nitrate","A pressure of 70 means the nitrate opened his orifice"]$s2_7oo$,
  $s2_7no$["Near-syncope after a nitrate means the valve was not what limited his output","His orifice is fixed and tiny, so preload loss leaves the ventricle unable to push across it","A valve area of 2.0 cm2 is the stenosis that cannot tolerate preload loss","Chest pain means the stenotic valve and a regurgitant valve will both crash on a nitrate","A pressure of 70 mm Hg means the nitrate widened his orifice and forward flow rose"]$s2_7no$,
  $s2_7oc$His orifice is fixed and tiny, so preload reduction leaves the ventricle unable to fill enough to push through it$s2_7oc$,
  $s2_7nc$His orifice is fixed and tiny, so preload loss leaves the ventricle unable to push across it$s2_7nc$,
  $s2_7oe$Nitrate drops his pressure because the valve area is 0.6, and the left ventricle has no reserve orifice. His orifice is fixed and tiny, so preload reduction leaves the ventricle unable to fill enough to push through it. A valve area of 2.0 cm2 is the one that cannot tolerate preload loss is a wide valve. Chest pain means both valves will crash with nitrate only the tight one does. A pressure of 70 means the nitrate opened his orifice means output fell. Near-syncope after nitrate means the valve was not the limiter is the fixed orifice.$s2_7oe$,
  $s2_7ne$Nitrate drops his pressure because the valve area is 0.6, and the left ventricle has no reserve orifice. His orifice is fixed and tiny, so preload loss leaves the ventricle unable to push across it. A valve area of 2.0 cm2 is the stenosis that cannot tolerate preload loss is a wide valve. Chest pain means the stenotic valve and a regurgitant valve will both crash on a nitrate only the tight one does. A pressure of 70 mm Hg means the nitrate widened his orifice and forward flow rose means output fell. Near-syncope after a nitrate means the valve was not what limited his output is the fixed orifice.$s2_7ne$,
  113, 68, 92, 88,
  1.661765, 1.045455
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_8id$b10xdcc323b352ece439bf9f8d1f$s2_8id$,
  $s2_8st$usmle-step-2$s2_8st$,
  2,
  $s2_8oo$["A heart rate of 120 means an antipsychotic replaces the missing inhibition","A prior withdrawal seizure means haloperidol is protective","No hallucinations yet means the syndrome is not withdrawal","A pressure of 160/100 mm Hg means the tremor is psychiatric agitation only","This is autonomic withdrawal that can seize, and the drug lowers the seizure threshold without replacing the inhibitory tone"]$s2_8oo$,
  $s2_8no$["A heart rate of 120 means an antipsychotic replaces the missing central inhibition","A prior withdrawal seizure means haloperidol protects him from another convulsion","No hallucinations yet means this is not withdrawal and observation is enough","A pressure of 160/100 mm Hg means the tremor is psychiatric agitation and nothing further","This withdrawal can seize; haloperidol lowers the seizure threshold and does not replace the inhibitory tone"]$s2_8no$,
  $s2_8oc$This is autonomic withdrawal that can seize, and the drug lowers the seizure threshold without replacing the inhibitory tone$s2_8oc$,
  $s2_8nc$This withdrawal can seize; haloperidol lowers the seizure threshold and does not replace the inhibitory tone$s2_8nc$,
  $s2_8oe$An antipsychotic alone is the wrong drug, because the tremor and the pulse mean withdrawal that can seize. This is autonomic withdrawal that can seize, and the drug lowers the seizure threshold without replacing the inhibitory tone. A heart rate of 120 means an antipsychotic replaces the missing inhibition does not. A prior withdrawal seizure means haloperidol is protective is a reason to avoid it alone. No hallucinations yet means the syndrome is not withdrawal is still withdrawal. A pressure of 160/100 mm Hg means the tremor is psychiatric agitation only is autonomic hyperactivity.$s2_8oe$,
  $s2_8ne$An antipsychotic alone is the wrong drug, because the tremor and the pulse mean withdrawal that can seize. This withdrawal can seize; haloperidol lowers the seizure threshold and does not replace the inhibitory tone. A heart rate of 120 means an antipsychotic replaces the missing central inhibition does not. A prior withdrawal seizure means haloperidol protects him from another convulsion is a reason to avoid it alone. No hallucinations yet means this is not withdrawal and observation is enough is still withdrawal. A pressure of 160/100 mm Hg means the tremor is psychiatric agitation and nothing further is autonomic hyperactivity.$s2_8ne$,
  124, 74, 108, 89,
  1.675676, 1.213483
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_9id$b7x5553587c70d9532f5826da44$s2_9id$,
  $s2_9st$usmle-step-2$s2_9st$,
  2,
  $s2_9oo$["Pale stools with a palpable gallbladder are viral hepatitis","Weight loss of 8 kg is typical of an acute virus and against a mass","No fever means a stone is impacted and the gallbladder cannot swell","Painless jaundice is never obstruction","A gallbladder that can be felt means the blockage is below it, so the duct is obstructed rather than the liver inflamed"]$s2_9oo$,
  $s2_9no$["Pale stools with a palpable gallbladder are viral hepatitis until the serologies return negative","Loss of 8 kg is typical of an acute hepatitis virus and against a malignant mass","No fever means a stone is impacted, so the gallbladder cannot swell beyond it","Painless jaundice is never obstruction, even when the gallbladder can be felt","A palpable gallbladder means the block is below it, so the duct is obstructed and the liver is not inflamed"]$s2_9no$,
  $s2_9oc$A gallbladder that can be felt means the blockage is below it, so the duct is obstructed rather than the liver inflamed$s2_9oc$,
  $s2_9nc$A palpable gallbladder means the block is below it, so the duct is obstructed and the liver is not inflamed$s2_9nc$,
  $s2_9oe$Painless jaundice with a palpable gallbladder is a downstream blockage, often malignant, so a plan aimed at viral hepatitis misses the mass. A gallbladder that can be felt means the blockage is below it, so the duct is obstructed rather than the liver inflamed. Pale stools with a palpable gallbladder are viral hepatitis are no bile reaching the gut. Weight loss of 8 kg is typical of an acute virus and against a mass is the mass. No fever means a stone is impacted and the gallbladder cannot swell is a Courvoisier pattern, more often a mass than a chronic scarred gallbladder from stones. Painless jaundice is never obstruction is exactly how a distal mass presents.$s2_9oe$,
  $s2_9ne$Painless jaundice with a palpable gallbladder is a downstream blockage, often malignant, so a plan aimed at viral hepatitis misses the mass. A palpable gallbladder means the block is below it, so the duct is obstructed and the liver is not inflamed. Pale stools with a palpable gallbladder are viral hepatitis until the serologies return negative are no bile reaching the gut. Loss of 8 kg is typical of an acute hepatitis virus and against a malignant mass is the mass. No fever means a stone is impacted, so the gallbladder cannot swell beyond it is a Courvoisier pattern, more often a mass than a chronic scarred gallbladder from stones. Painless jaundice is never obstruction, even when the gallbladder can be felt is exactly how a distal mass presents.$s2_9ne$,
  119, 67, 107, 96,
  1.776119, 1.114583
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_10id$b7x5a54e4754e66de4049cae722$s2_10id$,
  $s2_10st$usmle-step-2$s2_10st$,
  2,
  $s2_10oo$["The gallbladder contracts when the fatty meal reaches the duodenum, which is later than an ulcer's meal timing","Scapular radiation an hour after fat is a duodenal ulcer","No black stool means the pain cannot be biliary","Pain that waits an hour is acid in an empty stomach","Fried food relaxes the gallbladder and tightens an ulcer"]$s2_10oo$,
  $s2_10no$["The gallbladder contracts once a fatty meal reaches the duodenum, later than the timing of ulcer pain","Scapular pain an hour after a fatty meal is the usual timing of a duodenal ulcer flare","No black stool means the pain is peptic and the biliary tree is not involved","Pain that waits an hour is acid in an empty stomach after the meal has gone","Fried food relaxes the gallbladder and provokes an ulcer in the duodenum"]$s2_10no$,
  $s2_10oc$The gallbladder contracts when the fatty meal reaches the duodenum, which is later than an ulcer's meal timing$s2_10oc$,
  $s2_10nc$The gallbladder contracts once a fatty meal reaches the duodenum, later than the timing of ulcer pain$s2_10nc$,
  $s2_10oe$Pain that starts after the fatty meal has left the stomach is the gallbladder contracting, so an antacid for ulcer disease misses the timing. The gallbladder contracts when the fatty meal reaches the duodenum, which is later than an ulcer's meal timing. Scapular radiation an hour after fat is a duodenal ulcer is biliary colic. No black stool means the pain cannot be biliary argues against an ulcer bleed and fits the biliary timing. Pain that waits an hour is acid in an empty stomach is the meal arriving at the duodenum. Fried food relaxes the gallbladder and tightens an ulcer makes the gallbladder contract.$s2_10oe$,
  $s2_10ne$Pain that starts after the fatty meal has left the stomach is the gallbladder contracting, so an antacid for ulcer disease misses the timing. The gallbladder contracts once a fatty meal reaches the duodenum, later than the timing of ulcer pain. Scapular pain an hour after a fatty meal is the usual timing of a duodenal ulcer flare is biliary colic. No black stool means the pain is peptic and the biliary tree is not involved argues against an ulcer bleed and fits the biliary timing. Pain that waits an hour is acid in an empty stomach after the meal has gone is the meal arriving at the duodenum. Fried food relaxes the gallbladder and provokes an ulcer in the duodenum makes the gallbladder contract.$s2_10ne$,
  110, 56, 101, 86,
  1.964286, 1.174419
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_11id$b7xcfbe1dbc680407dc91444698$s2_11id$,
  $s2_11st$usmle-step-2$s2_11st$,
  2,
  $s2_11oo$["The forehead is in the lesion, so this is the facial nerve, and the window for a clot drug has also closed","Reduced taste means a cortical clot","A clear ear means the facial nerve is spared","Inability to close the eye is an upper-motor-neuron sign","Onset yesterday is inside the window for a thrombolytic"]$s2_11oo$,
  $s2_11no$["Forehead involvement means the facial nerve, and yesterday's onset is outside the thrombolytic window","Reduced taste on the anterior tongue means a cortical clot in the face area","A clear ear canal means the facial nerve is spared and the lesion is supranuclear in the cortex","Inability to close the eye is an upper-motor-neuron sign of a hemispheric clot","Onset yesterday is still inside the window for a thrombolytic aimed at cortex"]$s2_11no$,
  $s2_11oc$The forehead is in the lesion, so this is the facial nerve, and the window for a clot drug has also closed$s2_11oc$,
  $s2_11nc$Forehead involvement means the facial nerve, and yesterday's onset is outside the thrombolytic window$s2_11nc$,
  $s2_11oe$A facial droop that includes the forehead, with a clear ear, is a peripheral nerve, so a brain-clot drug aimed at a cortical lesion is the wrong drug. The forehead is in the lesion, so this is the facial nerve, and the window for a clot drug has also closed. Reduced taste means a cortical clot is the facial nerve in the canal. A clear ear means the facial nerve is spared removes zoster and leaves the nerve. Inability to close the eye is an upper-motor-neuron sign is peripheral, because the forehead is involved. Onset yesterday is inside the window for a thrombolytic is far outside it.$s2_11oe$,
  $s2_11ne$A facial droop that includes the forehead, with a clear ear, is a peripheral nerve, so a brain-clot drug aimed at a cortical lesion is the wrong drug. Forehead involvement means the facial nerve, and yesterday's onset is outside the thrombolytic window. Reduced taste on the anterior tongue means a cortical clot in the face area is the facial nerve in the canal. A clear ear canal means the facial nerve is spared and the lesion is supranuclear in the cortex removes zoster and leaves the nerve. Inability to close the eye is an upper-motor-neuron sign of a hemispheric clot is peripheral, because the forehead is involved. Onset yesterday is still inside the window for a thrombolytic aimed at cortex is far outside it.$s2_11ne$,
  106, 56, 101, 95,
  1.892857, 1.063158
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_12id$b8x205afe3b147f348c03cde9b0$s2_12id$,
  $s2_12st$usmle-step-2$s2_12st$,
  2,
  $s2_12oo$["Normal platelet count means the bleeding time must be normal","Heavy periods are joint-type bleeding","She is missing the carrier protein that also sticks platelets, which his joint bleeds and normal bleeding time do not","A long bleeding time means she needs the same factor VIII concentrate","A mildly long partial thromboplastin time is severe factor VIII deficiency"]$s2_12oo$,
  $s2_12no$["A normal platelet count means the bleeding time must be normal","Heavy menses are the joint-bleeding pattern of the factor her brother lacks","She lacks the carrier protein that also binds platelets; his joint bleeds and normal bleeding time do not match that protein","A long bleeding time means she needs the same factor VIII concentrate he receives","A mildly prolonged partial thromboplastin time means severe factor VIII deficiency, the same disease as her brother"]$s2_12no$,
  $s2_12oc$She is missing the carrier protein that also sticks platelets, which his joint bleeds and normal bleeding time do not$s2_12oc$,
  $s2_12nc$She lacks the carrier protein that also binds platelets; his joint bleeds and normal bleeding time do not match that protein$s2_12nc$,
  $s2_12oe$Her bleeding time is long and her brother’s was normal, so his factor product does not replace the protein she is missing. She is missing the carrier protein that also sticks platelets, which his joint bleeds and normal bleeding time do not. A long bleeding time means she needs the same factor VIII concentrate is the platelet-plug defect. A mildly long partial thromboplastin time is severe factor VIII deficiency is a mild secondary drop of the factor the carrier holds. Normal platelet count means the bleeding time must be normal does not, when the carrier is missing. Heavy periods are joint-type bleeding are mucosal.$s2_12oe$,
  $s2_12ne$Her bleeding time is long and her brother’s was normal, so his factor product does not replace the protein she is missing. She lacks the carrier protein that also binds platelets; his joint bleeds and normal bleeding time do not match that protein. A long bleeding time means she needs the same factor VIII concentrate he receives is the platelet-plug defect. A mildly prolonged partial thromboplastin time means severe factor VIII deficiency, the same disease as her brother is a mild secondary drop of the factor the carrier holds. A normal platelet count means the bleeding time must be normal does not, when the carrier is missing. Heavy menses are the joint-bleeding pattern of the factor her brother lacks are mucosal.$s2_12ne$,
  117, 74, 124, 115,
  1.581081, 1.078261
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_13id$b8x7b03a47fe101c0953d74ccdb$s2_13id$,
  $s2_13st$usmle-step-2$s2_13st$,
  2,
  $s2_13oo$["Low oxygen with a high diffusing capacity is emphysema","Extra blood in the lung from small abnormal vessels takes up more carbon monoxide, which a scarred membrane cannot do","Clubbing means the membrane is fibrotic","Nosebleeds and lip telangiectasias lower the diffusing capacity","A film without fibrosis still means the diffusing capacity is low"]$s2_13oo$,
  $s2_13no$["Hypoxemia with a high diffusing capacity is the usual gas-transfer pattern of emphysema","Extra blood in small abnormal pulmonary vessels takes up more carbon monoxide than a scarred membrane can","Clubbing means the alveolar membrane is fibrotic, so diffusing capacity should be high","Nosebleeds and lip telangiectasias lower diffusing capacity by scarring alveoli","A film without fibrosis still implies a low diffusing capacity when oxygen is low"]$s2_13no$,
  $s2_13oc$Extra blood in the lung from small abnormal vessels takes up more carbon monoxide, which a scarred membrane cannot do$s2_13oc$,
  $s2_13nc$Extra blood in small abnormal pulmonary vessels takes up more carbon monoxide than a scarred membrane can$s2_13nc$,
  $s2_13oe$The carbon monoxide diffusing capacity is high, so the low oxygen is extra blood, not a destroyed membrane. Extra blood in the lung from small abnormal vessels takes up more carbon monoxide, which a scarred membrane cannot do. Clubbing means the membrane is fibrotic also happens with these vessels. Nosebleeds and lip telangiectasias lower the diffusing capacity mark the vascular disease that raises it. A film without fibrosis still means the diffusing capacity is low would be low if the membrane were the problem. Low oxygen with a high diffusing capacity is emphysema lowers the diffusing capacity.$s2_13oe$,
  $s2_13ne$The carbon monoxide diffusing capacity is high, so the low oxygen is extra blood, not a destroyed membrane. Extra blood in small abnormal pulmonary vessels takes up more carbon monoxide than a scarred membrane can. Clubbing means the alveolar membrane is fibrotic, so diffusing capacity should be high also happens with these vessels. Nosebleeds and lip telangiectasias lower diffusing capacity by scarring alveoli mark the vascular disease that raises it. A film without fibrosis still implies a low diffusing capacity when oxygen is low would be low if the membrane were the problem. Hypoxemia with a high diffusing capacity is the usual gas-transfer pattern of emphysema lowers the diffusing capacity.$s2_13ne$,
  117, 65, 105, 87,
  1.800000, 1.206897
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_14id$b8xb1695d0f4c858e03afaf507d$s2_14id$,
  $s2_14st$usmle-step-2$s2_14st$,
  2,
  $s2_14oo$["A rising creatinine means a ureteral stone on both sides","Modest protein means the basement membrane is normal","A father with a transplant and deafness is unrelated to hematuria","The same collagen is in the ear and the glomerular basement membrane, and stones do not run in deaf families","Painless microscopic hematuria for years is a passing stone"]$s2_14oo$,
  $s2_14no$["A rising creatinine means ureteral stones are blocking both kidneys at once","Modest proteinuria means the glomerular basement membrane is structurally normal","A father with a renal transplant and deafness is unrelated to years of hematuria","The same collagen is in the cochlea and the glomerular basement membrane; stones do not track with deafness","Painless microscopic hematuria over years is a stone that passed without injuring the basement membrane"]$s2_14no$,
  $s2_14oc$The same collagen is in the ear and the glomerular basement membrane, and stones do not run in deaf families$s2_14oc$,
  $s2_14nc$The same collagen is in the cochlea and the glomerular basement membrane; stones do not track with deafness$s2_14nc$,
  $s2_14oe$Hearing loss with lifelong blood in the urine is the shared collagen, so a stone workup misses the basement membrane. The same collagen is in the ear and the glomerular basement membrane, and stones do not run in deaf families. Painless microscopic hematuria for years is a passing stone is not colic. A rising creatinine means a ureteral stone on both sides is glomerular disease. Modest protein means the basement membrane is normal is thin or split membrane disease. A father with a transplant and deafness is unrelated to hematuria is the inheritance.$s2_14oe$,
  $s2_14ne$Hearing loss with lifelong blood in the urine is the shared collagen, so a stone workup misses the basement membrane. The same collagen is in the cochlea and the glomerular basement membrane; stones do not track with deafness. Painless microscopic hematuria over years is a stone that passed without injuring the basement membrane is not colic. A rising creatinine means ureteral stones are blocking both kidneys at once is glomerular disease. Modest proteinuria means the glomerular basement membrane is structurally normal is thin or split membrane disease. A father with a renal transplant and deafness is unrelated to years of hematuria is the inheritance.$s2_14ne$,
  108, 65, 107, 103,
  1.661538, 1.038835
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_15id$b8xb1987408b9c5c744ff91889e$s2_15id$,
  $s2_15st$usmle-step-2$s2_15st$,
  2,
  $s2_15oo$["A dose that has held him should be stopped at the first lapse","Daily use before treatment is the same as his use this month","The lapse occurred on a treatment that sharply reduced use, and stopping it returns him to daily use and overdose risk","One positive urine means the treatment has had no effect","Working and not overdosing means the medicine is optional"]$s2_15oo$,
  $s2_15no$["A dose that has held him should be stopped at the first lapse","Daily use before treatment is the same as the reduced use he has had this month","A lapse on treatment that cut use; stopping it restores daily use and overdose risk","One positive urine means the treatment has had no effect","Working and not overdosing means the medicine is optional"]$s2_15no$,
  $s2_15oc$The lapse occurred on a treatment that sharply reduced use, and stopping it returns him to daily use and overdose risk$s2_15oc$,
  $s2_15nc$A lapse on treatment that cut use; stopping it restores daily use and overdose risk$s2_15nc$,
  $s2_15oe$One positive urine is not a reason to stop the treatment that took him from daily use to a single lapse. The lapse occurred on a treatment that sharply reduced use, and stopping it returns him to daily use and overdose risk. One positive urine means the treatment has had no effect ignores the change from daily use. Working and not overdosing means the medicine is optional is the stability the medicine is supporting. A dose that has held him should be stopped at the first lapse is the dose to continue. Daily use before treatment is the same as his use this month was the baseline the treatment changed.$s2_15oe$,
  $s2_15ne$One positive urine is not a reason to stop the treatment that took him from daily use to a single lapse. A lapse on treatment that cut use; stopping it restores daily use and overdose risk. One positive urine means the treatment has had no effect ignores the change from daily use. Working and not overdosing means the medicine is optional is the stability the medicine is supporting. A dose that has held him should be stopped at the first lapse is the dose to continue. Daily use before treatment is the same as the reduced use he has had this month was the baseline the treatment changed.$s2_15ne$,
  118, 61, 83, 79,
  1.934426, 1.050633
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_16id$b8xb5de566d86f4268d064c22e7$s2_16id$,
  $s2_16st$usmle-step-2$s2_16st$,
  2,
  $s2_16oo$["Posterior ribs break from squeezing, which a fall off a bed does not do, and the ages do not match one event","Infants commonly fracture posterior ribs by rolling off a bed","Fractures of two ages mean one fall","No metabolic bone disease means any fracture story is true","Forehead bruises are the same mechanism as posterior ribs"]$s2_16oo$,
  $s2_16no$["Posterior ribs break from squeezing, not a fall off a bed, and the ages do not match one event","Infants commonly fracture posterior ribs by rolling off a bed onto a hard floor at home","Fractures of two ages are explained by one fall","No metabolic bone disease means any fracture story is true","Forehead bruises are the same mechanism as posterior ribs"]$s2_16no$,
  $s2_16oc$Posterior ribs break from squeezing, which a fall off a bed does not do, and the ages do not match one event$s2_16oc$,
  $s2_16nc$Posterior ribs break from squeezing, not a fall off a bed, and the ages do not match one event$s2_16nc$,
  $s2_16oe$Posterior rib fractures of different ages are not produced by the falls the caregiver describes. Posterior ribs break from squeezing, which a fall off a bed does not do, and the ages do not match one event. Infants commonly fracture posterior ribs by rolling off a bed do not. Fractures of two ages mean one fall mean repeated injury. No metabolic bone disease means any fracture story is true removes the brittle-bone alternative and leaves the mechanism. Forehead bruises are the same mechanism as posterior ribs are a different, more typical impact.$s2_16oe$,
  $s2_16ne$Posterior rib fractures of different ages are not produced by the falls the caregiver describes. Posterior ribs break from squeezing, not a fall off a bed, and the ages do not match one event. Infants commonly fracture posterior ribs by rolling off a bed onto a hard floor at home do not. Fractures of two ages are explained by one fall mean repeated injury. No metabolic bone disease means any fracture story is true removes the brittle-bone alternative and leaves the mechanism. Forehead bruises are the same mechanism as posterior ribs are a different, more typical impact.$s2_16ne$,
  108, 61, 94, 87,
  1.770492, 1.080460
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_17id$b8xe612c1fd50e8bbec64753ff2$s2_17id$,
  $s2_17st$usmle-step-2$s2_17st$,
  2,
  $s2_17oo$["Fatty meals that do not provoke pain are the biliary pattern","Acid in an empty stomach is buffered by food, which is the opposite of a gallbladder that contracts after fat","Night pain eased by food is the gallbladder contracting","Pale stools are required before timing can be used","No fever means the pain is biliary colic"]$s2_17oo$,
  $s2_17no$["Fatty meals that do not provoke pain are the biliary pattern","Food buffers acid in an empty stomach, the opposite of a gallbladder that contracts after fat","Night pain eased by food means the gallbladder is contracting after a fatty meal","Pale stools are required before timing can be used","No fever means the pain is biliary colic"]$s2_17no$,
  $s2_17oc$Acid in an empty stomach is buffered by food, which is the opposite of a gallbladder that contracts after fat$s2_17oc$,
  $s2_17nc$Food buffers acid in an empty stomach, the opposite of a gallbladder that contracts after fat$s2_17nc$,
  $s2_17oe$Pain that wakes him and is eased by food is acid when the stomach is empty, so a gallbladder plan aimed at fatty meals misses the timing. Acid in an empty stomach is buffered by food, which is the opposite of a gallbladder that contracts after fat. Night pain eased by food is the gallbladder contracting is acid. Pale stools are required before timing can be used are absent, which also argues against obstruction. No fever means the pain is biliary colic does not choose the organ. Fatty meals that do not provoke pain are the biliary pattern are the opposite.$s2_17oe$,
  $s2_17ne$Pain that wakes him and is eased by food is acid when the stomach is empty, so a gallbladder plan aimed at fatty meals misses the timing. Food buffers acid in an empty stomach, the opposite of a gallbladder that contracts after fat. Night pain eased by food means the gallbladder is contracting after a fatty meal is acid. Pale stools are required before timing can be used are absent, which also argues against obstruction. No fever means the pain is biliary colic does not choose the organ. Fatty meals that do not provoke pain are the biliary pattern are the opposite.$s2_17ne$,
  109, 60, 93, 80,
  1.816667, 1.162500
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_18id$cmpnjgx1b001t1ymxdcrs99j7$s2_18id$,
  $s2_18st$usmle-step-2$s2_18st$,
  2,
  $s2_18oo${"options":["Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs","Aggressive IV fluids, pain control, monitor for organ failure; NPO initially with early enteral nutrition when tolerated","Prophylactic broad-spectrum antibiotics for all mild pancreatitis","Oral feeding and discharge with lipase recheck in 1 month only"],"distractorRationale":{"Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs":"ERCP is only indicated if there are signs of bile duct obstruction, which this patient does not have, as evidenced by the normal biliary tree on ultrasound. (This highlights the importance of assessing for complications before deciding on invasive procedures.)","Prophylactic broad-spectrum antibiotics for all mild pancreatitis":"Prophylactic antibiotics are not recommended for mild pancreatitis unless there are specific indications such as infected necrosis. (This emphasizes the need for targeted treatment rather than blanket antibiotic use.)","Oral feeding and discharge with lipase recheck in 1 month only":"In acute pancreatitis, patients should remain NPO initially to allow the pancreas to rest, and discharge should only occur after careful monitoring and stabilization. (This reinforces the need for proper management and monitoring in acute pancreatitis cases.)"},"clinicalReasoning":"Aggressive IV fluids and supportive care are crucial for managing acute pancreatitis. **Acute pancreatitis** management relies on supportive care, including hydration and pain control. **IV fluid resuscitation** is vital to prevent complications such as hypovolemic shock.","keyTakeaways":["When managing acute pancreatitis, prioritize aggressive hydration, pain control, and monitoring for complications."],"blueprintTopic":"gi-bleed-management","blueprintSystem":"gastrointestinal","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:00.296Z","rationaleQualityScore":100}}$s2_18oo$,
  $s2_18no${"options":["Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs","Aggressive IV fluids, pain control, monitoring for organ failure, and early enteral feeding","Prophylactic broad-spectrum antibiotics for all mild pancreatitis","Oral feeding and discharge with lipase recheck in 1 month only"],"distractorRationale":{"Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs":"ERCP is only indicated if there are signs of bile duct obstruction, which this patient does not have, as evidenced by the normal biliary tree on ultrasound. (This highlights the importance of assessing for complications before deciding on invasive procedures.)","Prophylactic broad-spectrum antibiotics for all mild pancreatitis":"Prophylactic antibiotics are not recommended for mild pancreatitis unless there are specific indications such as infected necrosis. (This emphasizes the need for targeted treatment rather than blanket antibiotic use.)","Oral feeding and discharge with lipase recheck in 1 month only":"In acute pancreatitis, patients should remain NPO initially to allow the pancreas to rest, and discharge should only occur after careful monitoring and stabilization. (This reinforces the need for proper management and monitoring in acute pancreatitis cases.)"},"clinicalReasoning":"Aggressive IV fluids and supportive care are crucial for managing acute pancreatitis. **Acute pancreatitis** management relies on supportive care, including hydration and pain control. **IV fluid resuscitation** is vital to prevent complications such as hypovolemic shock.","keyTakeaways":["When managing acute pancreatitis, prioritize aggressive hydration, pain control, and monitoring for complications."],"blueprintTopic":"gi-bleed-management","blueprintSystem":"gastrointestinal","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:00.296Z","rationaleQualityScore":100}}$s2_18no$,
  $s2_18oc$Aggressive IV fluids, pain control, monitor for organ failure; NPO initially with early enteral nutrition when tolerated$s2_18oc$,
  $s2_18nc$Aggressive IV fluids, pain control, monitoring for organ failure, and early enteral feeding$s2_18nc$,
  $s2_18oe$## Why this answer is correct
Aggressive IV fluids and supportive care are crucial for managing acute pancreatitis.
• **Acute pancreatitis** management relies on supportive care, including hydration and pain control.
• **IV fluid resuscitation** is vital to prevent complications such as hypovolemic shock.
• Monitoring for **organ failure** is essential, especially in severe cases.
• Patients are kept **NPO** (nothing by mouth) initially, with **early enteral nutrition** introduced when tolerated.
**In practice:** On the unit, this means prioritizing hydration and pain management to stabilize the patient and prevent further complications from pancreatitis.
## Clinical pearl
On the unit, this means prioritizing hydration and pain management to stabilize the patient and prevent further complications from pancreatitis.
## Why the other options are wrong



**Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs**
• Trap: Students may think ERCP (endoscopic retrograde cholangiopancreatography) is necessary for all cases of pancreatitis.
• Why it fails here: ERCP is only indicated if there are signs of bile duct obstruction, which this patient does not have, as evidenced by the normal biliary tree on ultrasound.
• Remember: This highlights the importance of assessing for complications before deciding on invasive procedures.

**Prophylactic broad-spectrum antibiotics for all mild pancreatitis**
• Trap: There is a common belief that antibiotics should be given to all patients with pancreatitis to prevent infection.
• Why it fails here: Prophylactic antibiotics are not recommended for mild pancreatitis unless there are specific indications such as infected necrosis.
• Remember: This emphasizes the need for targeted treatment rather than blanket antibiotic use.

**Oral feeding and discharge with lipase recheck in 1 month only**
• Trap: Some students might think that early oral feeding is safe and that monitoring can be delayed.
• Why it fails here: In acute pancreatitis, patients should remain NPO initially to allow the pancreas to rest, and discharge should only occur after careful monitoring and stabilization.
• Remember: This reinforces the need for proper management and monitoring in acute pancreatitis cases.
## Key takeaway
**When managing acute pancreatitis, prioritize aggressive hydration, pain control, and monitoring for complications.**

**Memory hook:** Remember: For pancreatitis, think 'NPO and fluids first!'$s2_18oe$,
  $s2_18ne$## Why this answer is correct
Aggressive IV fluids and supportive care are crucial for managing acute pancreatitis.
• **Acute pancreatitis** management relies on supportive care, including hydration and pain control.
• **IV fluid resuscitation** is vital to prevent complications such as hypovolemic shock.
• Monitoring for **organ failure** is essential, especially in severe cases.
• Patients are kept **NPO** (nothing by mouth) initially, with **early enteral nutrition** introduced when tolerated.
**In practice:** On the unit, this means prioritizing hydration and pain management to stabilize the patient and prevent further complications from pancreatitis.
## Clinical pearl
On the unit, this means prioritizing hydration and pain management to stabilize the patient and prevent further complications from pancreatitis.
## Why the other options are wrong



**Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs**
• Trap: Students may think ERCP (endoscopic retrograde cholangiopancreatography) is necessary for all cases of pancreatitis.
• Why it fails here: ERCP is only indicated if there are signs of bile duct obstruction, which this patient does not have, as evidenced by the normal biliary tree on ultrasound.
• Remember: This highlights the importance of assessing for complications before deciding on invasive procedures.

**Prophylactic broad-spectrum antibiotics for all mild pancreatitis**
• Trap: There is a common belief that antibiotics should be given to all patients with pancreatitis to prevent infection.
• Why it fails here: Prophylactic antibiotics are not recommended for mild pancreatitis unless there are specific indications such as infected necrosis.
• Remember: This emphasizes the need for targeted treatment rather than blanket antibiotic use.

**Oral feeding and discharge with lipase recheck in 1 month only**
• Trap: Some students might think that early oral feeding is safe and that monitoring can be delayed.
• Why it fails here: In acute pancreatitis, patients should remain NPO initially to allow the pancreas to rest, and discharge should only occur after careful monitoring and stabilization.
• Remember: This reinforces the need for proper management and monitoring in acute pancreatitis cases.
## Key takeaway
**When managing acute pancreatitis, prioritize aggressive hydration, pain control, and monitoring for complications.**

**Memory hook:** Remember: For pancreatitis, think 'NPO and fluids first!'$s2_18ne$,
  120, 77, 91, 77,
  1.558442, 1.181818
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_19id$cmpnjhav700211ymxhu3gprmr$s2_19id$,
  $s2_19st$usmle-step-2$s2_19st$,
  2,
  $s2_19oo${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin outpatient therapy","Ceftriaxone plus vancomycin (add ampicillin if Listeria risk); dexamethasone before or with first antibiotic dose","MRI brain only without LP or blood cultures"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"Delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis. (Remember: Prompt treatment is essential in suspected bacterial meningitis to improve patient outcomes.)","Oral amoxicillin outpatient therapy":"Bacterial meningitis is a medical emergency that requires intravenous antibiotics, not outpatient oral therapy. (Intravenous antibiotics are critical for managing severe infections like bacterial meningitis.)","MRI brain only without LP or blood cultures":"In suspected bacterial meningitis, a lumbar puncture is essential for diagnosis and should not be delayed by imaging. (Immediate evaluation and treatment are vital in suspected cases of bacterial meningitis.)"},"clinicalReasoning":"Ceftriaxone plus vancomycin is the best choice for suspected bacterial meningitis. **Bacterial meningitis** requires immediate treatment to prevent severe complications. Empirical **antibiotic therapy** should begin before confirming the diagnosis to improve outcomes.","keyTakeaways":["When you suspect bacterial meningitis, initiate broad-spectrum IV antibiotics immediately, along with dexamethasone."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:40.256Z","rationaleQualityScore":100}}$s2_19oo$,
  $s2_19no${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin as outpatient therapy","Ceftriaxone, vancomycin, ampicillin if Listeria risk, and dexamethasone before or with the first dose","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"Delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis. (Remember: Prompt treatment is essential in suspected bacterial meningitis to improve patient outcomes.)","Oral amoxicillin as outpatient therapy":"Bacterial meningitis is a medical emergency that requires intravenous antibiotics, not outpatient oral therapy. (Intravenous antibiotics are critical for managing severe infections like bacterial meningitis.)","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics":"In suspected bacterial meningitis, a lumbar puncture is essential for diagnosis and should not be delayed by imaging. (Immediate evaluation and treatment are vital in suspected cases of bacterial meningitis.)"},"clinicalReasoning":"Ceftriaxone plus vancomycin is the best choice for suspected bacterial meningitis. **Bacterial meningitis** requires immediate treatment to prevent severe complications. Empirical **antibiotic therapy** should begin before confirming the diagnosis to improve outcomes.","keyTakeaways":["When you suspect bacterial meningitis, initiate broad-spectrum IV antibiotics immediately, along with dexamethasone."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:40.256Z","rationaleQualityScore":100}}$s2_19no$,
  $s2_19oc$Ceftriaxone plus vancomycin (add ampicillin if Listeria risk); dexamethasone before or with first antibiotic dose$s2_19oc$,
  $s2_19nc$Ceftriaxone, vancomycin, ampicillin if Listeria risk, and dexamethasone before or with the first dose$s2_19nc$,
  $s2_19oe$## Why this answer is correct
Ceftriaxone plus vancomycin is the best choice for suspected bacterial meningitis.
• **Bacterial meningitis** requires immediate treatment to prevent severe complications.
• Empirical **antibiotic therapy** should begin before confirming the diagnosis to improve outcomes.
• **Dexamethasone** is administered to reduce **inflammation** and enhance recovery.
**In practice:** On the unit, timely administration of antibiotics can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Clinical pearl
On the unit, timely administration of antibiotics can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Why the other options are wrong



**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think it's safer to wait for definitive diagnosis before treatment.
• Why it fails here: Delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis.
• Remember: Remember: Prompt treatment is essential in suspected bacterial meningitis to improve patient outcomes.

**Oral amoxicillin outpatient therapy**
• Trap: Some may believe that outpatient oral antibiotics are sufficient for serious infections.
• Why it fails here: Bacterial meningitis is a medical emergency that requires intravenous antibiotics, not outpatient oral therapy.
• Remember: Intravenous antibiotics are critical for managing severe infections like bacterial meningitis.

**MRI brain only without LP or blood cultures**
• Trap: Students might think imaging is the first step in diagnosing all neurological conditions.
• Why it fails here: In suspected bacterial meningitis, a lumbar puncture is essential for diagnosis and should not be delayed by imaging.
• Remember: Immediate evaluation and treatment are vital in suspected cases of bacterial meningitis.
## Key takeaway
**When you suspect bacterial meningitis, initiate broad-spectrum IV antibiotics immediately, along with dexamethasone.**

**Memory hook:** Think 'ABCs' for meningitis: **A**ntibiotics, **B**road-spectrum, **C**orticosteroids.$s2_19oe$,
  $s2_19ne$## Why this answer is correct
Ceftriaxone plus vancomycin is the best choice for suspected bacterial meningitis.
• **Bacterial meningitis** requires immediate treatment to prevent severe complications.
• Empirical **antibiotic therapy** should begin before confirming the diagnosis to improve outcomes.
• **Dexamethasone** is administered to reduce **inflammation** and enhance recovery.
**In practice:** On the unit, timely administration of antibiotics can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Clinical pearl
On the unit, timely administration of antibiotics can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Why the other options are wrong



**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think it's safer to wait for definitive diagnosis before treatment.
• Why it fails here: Delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis.
• Remember: Remember: Prompt treatment is essential in suspected bacterial meningitis to improve patient outcomes.

**Oral amoxicillin as outpatient therapy**
• Trap: Some may believe that outpatient oral antibiotics are sufficient for serious infections.
• Why it fails here: Bacterial meningitis is a medical emergency that requires intravenous antibiotics, not outpatient oral therapy.
• Remember: Intravenous antibiotics are critical for managing severe infections like bacterial meningitis.

**MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics**
• Trap: Students might think imaging is the first step in diagnosing all neurological conditions.
• Why it fails here: In suspected bacterial meningitis, a lumbar puncture is essential for diagnosis and should not be delayed by imaging.
• Remember: Immediate evaluation and treatment are vital in suspected cases of bacterial meningitis.
## Key takeaway
**When you suspect bacterial meningitis, initiate broad-spectrum IV antibiotics immediately, along with dexamethasone.**

**Memory hook:** Think 'ABCs' for meningitis: **A**ntibiotics, **B**road-spectrum, **C**orticosteroids.$s2_19ne$,
  113, 56, 101, 86,
  2.017857, 1.174419
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_20id$cmpnjhb2900221ymxlz4v3t94$s2_20id$,
  $s2_20st$usmle-step-2$s2_20st$,
  2,
  $s2_20oo${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin outpatient therapy","Ceftriaxone plus vancomycin (add ampicillin if Listeria risk); dexamethasone before or with first antibiotic dose","MRI brain only without LP or blood cultures"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"In bacterial meningitis, delaying antibiotics can lead to rapid deterioration and increased risk of severe complications, including death. (This highlights the urgency of treating suspected bacterial infections without delay.)","Oral amoxicillin outpatient therapy":"Oral amoxicillin is inadequate for treating bacterial meningitis, which typically requires intravenous antibiotics due to the severity of the condition. (This option underestimates the seriousness of bacterial meningitis and the need for immediate, aggressive treatment.)","MRI brain only without LP or blood cultures":"In cases of suspected meningitis, a lumbar puncture (LP) is crucial for diagnosis and should not be delayed by imaging, especially when immediate treatment is warranted. (This option misprioritizes diagnostic imaging over essential therapeutic interventions.)"},"clinicalReasoning":"Immediate broad-spectrum antibiotics and dexamethasone are essential for suspected bacterial meningitis. **Bacterial meningitis** requires urgent treatment to prevent complications. The combination of **ceftriaxone** and **vancomycin** provides broad coverage against common pathogens.","keyTakeaways":["When you suspect bacterial meningitis, think immediate broad-spectrum antibiotics and dexamethasone first."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:47.025Z","rationaleQualityScore":100}}$s2_20oo$,
  $s2_20no${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin as outpatient therapy","Ceftriaxone, vancomycin, ampicillin if Listeria risk, and dexamethasone before or with the first dose","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"In bacterial meningitis, delaying antibiotics can lead to rapid deterioration and increased risk of severe complications, including death. (This highlights the urgency of treating suspected bacterial infections without delay.)","Oral amoxicillin as outpatient therapy":"Oral amoxicillin is inadequate for treating bacterial meningitis, which typically requires intravenous antibiotics due to the severity of the condition. (This option underestimates the seriousness of bacterial meningitis and the need for immediate, aggressive treatment.)","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics":"In cases of suspected meningitis, a lumbar puncture (LP) is crucial for diagnosis and should not be delayed by imaging, especially when immediate treatment is warranted. (This option misprioritizes diagnostic imaging over essential therapeutic interventions.)"},"clinicalReasoning":"Immediate broad-spectrum antibiotics and dexamethasone are essential for suspected bacterial meningitis. **Bacterial meningitis** requires urgent treatment to prevent complications. The combination of **ceftriaxone** and **vancomycin** provides broad coverage against common pathogens.","keyTakeaways":["When you suspect bacterial meningitis, think immediate broad-spectrum antibiotics and dexamethasone first."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:47.025Z","rationaleQualityScore":100}}$s2_20no$,
  $s2_20oc$Ceftriaxone plus vancomycin (add ampicillin if Listeria risk); dexamethasone before or with first antibiotic dose$s2_20oc$,
  $s2_20nc$Ceftriaxone, vancomycin, ampicillin if Listeria risk, and dexamethasone before or with the first dose$s2_20nc$,
  $s2_20oe$## Why this answer is correct
Immediate broad-spectrum antibiotics and dexamethasone are essential for suspected bacterial meningitis.
• **Bacterial meningitis** requires urgent treatment to prevent complications.
• The combination of **ceftriaxone** and **vancomycin** provides broad coverage against common pathogens.
• **Dexamethasone** helps reduce inflammation and improve outcomes.
**In practice:** In practice, starting antibiotics promptly can significantly reduce morbidity and mortality associated with bacterial meningitis. On the unit, this means ensuring the patient receives the right medications without delay.
## Clinical pearl
In practice, starting antibiotics promptly can significantly reduce morbidity and mortality associated with bacterial meningitis. On the unit, this means ensuring the patient receives the right medications without delay.
## Why the other options are wrong



**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think that waiting for lab results is safe.
• Why it fails here: In bacterial meningitis, delaying antibiotics can lead to rapid deterioration and increased risk of severe complications, including death.
• Remember: This highlights the urgency of treating suspected bacterial infections without delay.

**Oral amoxicillin outpatient therapy**
• Trap: Some may believe that outpatient therapy is sufficient for serious infections.
• Why it fails here: Oral amoxicillin is inadequate for treating bacterial meningitis, which typically requires intravenous antibiotics due to the severity of the condition.
• Remember: This option underestimates the seriousness of bacterial meningitis and the need for immediate, aggressive treatment.

**MRI brain only without LP or blood cultures**
• Trap: Students might think imaging is the first step in managing neurological symptoms.
• Why it fails here: In cases of suspected meningitis, a lumbar puncture (LP) is crucial for diagnosis and should not be delayed by imaging, especially when immediate treatment is warranted.
• Remember: This option misprioritizes diagnostic imaging over essential therapeutic interventions.
## Key takeaway
**When you suspect bacterial meningitis, think immediate broad-spectrum antibiotics and dexamethasone first.**

**Memory hook:** Remember: 'Meningitis needs meds, not just tests!'$s2_20oe$,
  $s2_20ne$## Why this answer is correct
Immediate broad-spectrum antibiotics and dexamethasone are essential for suspected bacterial meningitis.
• **Bacterial meningitis** requires urgent treatment to prevent complications.
• The combination of **ceftriaxone** and **vancomycin** provides broad coverage against common pathogens.
• **Dexamethasone** helps reduce inflammation and improve outcomes.
**In practice:** In practice, starting antibiotics promptly can significantly reduce morbidity and mortality associated with bacterial meningitis. On the unit, this means ensuring the patient receives the right medications without delay.
## Clinical pearl
In practice, starting antibiotics promptly can significantly reduce morbidity and mortality associated with bacterial meningitis. On the unit, this means ensuring the patient receives the right medications without delay.
## Why the other options are wrong



**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think that waiting for lab results is safe.
• Why it fails here: In bacterial meningitis, delaying antibiotics can lead to rapid deterioration and increased risk of severe complications, including death.
• Remember: This highlights the urgency of treating suspected bacterial infections without delay.

**Oral amoxicillin as outpatient therapy**
• Trap: Some may believe that outpatient therapy is sufficient for serious infections.
• Why it fails here: Oral amoxicillin is inadequate for treating bacterial meningitis, which typically requires intravenous antibiotics due to the severity of the condition.
• Remember: This option underestimates the seriousness of bacterial meningitis and the need for immediate, aggressive treatment.

**MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics**
• Trap: Students might think imaging is the first step in managing neurological symptoms.
• Why it fails here: In cases of suspected meningitis, a lumbar puncture (LP) is crucial for diagnosis and should not be delayed by imaging, especially when immediate treatment is warranted.
• Remember: This option misprioritizes diagnostic imaging over essential therapeutic interventions.
## Key takeaway
**When you suspect bacterial meningitis, think immediate broad-spectrum antibiotics and dexamethasone first.**

**Memory hook:** Remember: 'Meningitis needs meds, not just tests!'$s2_20ne$,
  113, 56, 101, 86,
  2.017857, 1.174419
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_21id$cmpnjjlxf0awe1ymxp2alr335$s2_21id$,
  $s2_21st$usmle-step-2$s2_21st$,
  2,
  $s2_21oo${"options":["Moderately aggressive lactated Ringer resuscitation (about 1.5 mL/kg/h, with a 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated","Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs","Prophylactic broad-spectrum antibiotics for all mild pancreatitis","Oral feeding and discharge with lipase recheck in 1 month only"],"distractorRationale":{"Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs":"ERCP is only indicated if there is evidence of **bile duct obstruction**; performing it unnecessarily can lead to complications. (This option fails because it overlooks the need for proper assessment before invasive procedures.)","Prophylactic broad-spectrum antibiotics for all mild pancreatitis":"Prophylactic antibiotics are not recommended for mild pancreatitis unless there is a clear indication of infection. (This option fails because it misapplies the use of antibiotics without evidence of infection.)","Oral feeding and discharge with lipase recheck in 1 month only":"Patients with acute pancreatitis require careful monitoring and management before considering discharge; early feeding can exacerbate symptoms. (This option fails because it neglects the need for ongoing management and monitoring of the patient's condition.)"},"clinicalReasoning":"Aggressive IV fluids, pain control, and monitoring for organ failure are essential in managing acute pancreatitis. **Acute pancreatitis** requires prompt stabilization with **IV fluids** to prevent complications. Pain control is crucial for **patient comfort** and recovery.","keyTakeaways":["When managing acute pancreatitis, prioritize hydration, pain control, and monitoring for complications before considering discharge."],"blueprintTopic":"gi-bleed-management","blueprintSystem":"gastrointestinal","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T16:52:09.488Z","rationaleQualityScore":100}}$s2_21oo$,
  $s2_21no${"options":["Lactated Ringer at about 1.5 mL/kg/h, a 10 mL/kg bolus only if hypovolemic, pain control, and early enteral feeding","Immediate ERCP for all pancreatitis whether or not bile-duct obstruction or ascending cholangitis is present","Prophylactic broad-spectrum antibiotics for all mild pancreatitis","Oral feeding and discharge with lipase recheck in 1 month only"],"distractorRationale":{"Immediate ERCP for all pancreatitis whether or not bile-duct obstruction or ascending cholangitis is present":"ERCP is only indicated if there is evidence of **bile duct obstruction**; performing it unnecessarily can lead to complications. (This option fails because it overlooks the need for proper assessment before invasive procedures.)","Prophylactic broad-spectrum antibiotics for all mild pancreatitis":"Prophylactic antibiotics are not recommended for mild pancreatitis unless there is a clear indication of infection. (This option fails because it misapplies the use of antibiotics without evidence of infection.)","Oral feeding and discharge with lipase recheck in 1 month only":"Patients with acute pancreatitis require careful monitoring and management before considering discharge; early feeding can exacerbate symptoms. (This option fails because it neglects the need for ongoing management and monitoring of the patient's condition.)"},"clinicalReasoning":"Aggressive IV fluids, pain control, and monitoring for organ failure are essential in managing acute pancreatitis. **Acute pancreatitis** requires prompt stabilization with **IV fluids** to prevent complications. Pain control is crucial for **patient comfort** and recovery.","keyTakeaways":["When managing acute pancreatitis, prioritize hydration, pain control, and monitoring for complications before considering discharge."],"blueprintTopic":"gi-bleed-management","blueprintSystem":"gastrointestinal","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T16:52:09.488Z","rationaleQualityScore":100}}$s2_21no$,
  $s2_21oc$Moderately aggressive lactated Ringer resuscitation (about 1.5 mL/kg/h, with a 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated$s2_21oc$,
  $s2_21nc$Lactated Ringer at about 1.5 mL/kg/h, a 10 mL/kg bolus only if hypovolemic, pain control, and early enteral feeding$s2_21nc$,
  $s2_21oe$## Why this answer is correct
Moderately aggressive lactated Ringer resuscitation, pain control, and monitoring for organ failure are the initial management of acute pancreatitis. The WATERFALL aggressive protocol (20 mL/kg bolus, then 3 mL/kg/h) increased fluid overload without improving outcomes and is not the regimen to choose.
• **Acute pancreatitis** requires prompt stabilization with **IV fluids** to prevent complications.
• Pain control is crucial for **patient comfort** and recovery.
• Monitoring for **organ failure** is vital due to the risk of complications from inflammation.
• Patients should be **NPO** (nothing by mouth) initially, with early enteral nutrition introduced when tolerated.
**In practice:** On the unit, this means prioritizing hydration and pain management to support recovery and prevent further complications from pancreatitis.
## Clinical pearl
On the unit, this means prioritizing hydration and pain management to support recovery and prevent further complications from pancreatitis.
## Why the other options are wrong

**Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs**
• Trap: Students may think ERCP is a standard procedure for all cases of pancreatitis.
• Why it fails here: ERCP is only indicated if there is evidence of **bile duct obstruction**; performing it unnecessarily can lead to complications.
• Remember: This option fails because it overlooks the need for proper assessment before invasive procedures.

**Prophylactic broad-spectrum antibiotics for all mild pancreatitis**
• Trap: There is a common belief that antibiotics are necessary for all cases of pancreatitis to prevent infection.
• Why it fails here: Prophylactic antibiotics are not recommended for mild pancreatitis unless there is a clear indication of infection.
• Remember: This option fails because it misapplies the use of antibiotics without evidence of infection.

**Oral feeding and discharge with lipase recheck in 1 month only**
• Trap: Students might think that early discharge is appropriate once lipase levels are checked.
• Why it fails here: Patients with acute pancreatitis require careful monitoring and management before considering discharge; early feeding can exacerbate symptoms.
• Remember: This option fails because it neglects the need for ongoing management and monitoring of the patient's condition.
## Key takeaway
**When managing acute pancreatitis, prioritize hydration, pain control, and monitoring for complications before considering discharge.**

**Memory hook:** Think of the '3 P's': **Pain**, **Prevention** (of complications), and **Patient stability**.

Fluid correction: ACG 2024 suggests moderately aggressive lactated Ringer, about 1.5 mL/kg/h if not hypovolemic, and a 10 mL/kg bolus only if hypovolemic (https://journals.lww.com/ajg/fulltext/2024/03000/american_college_of_gastroenterology_guidelines_.14.aspx). WATERFALL stopped the aggressive arm for more fluid overload without better outcomes (https://www.nejm.org/doi/full/10.1056/NEJMoa2202884). Immediate ERCP for every case is not indicated without cholangitis or persistent biliary obstruction. Prophylactic antibiotics are not for mild pancreatitis without infection. Discharge with a later lipase check does not treat this presentation.$s2_21oe$,
  $s2_21ne$## Why this answer is correct
Moderately aggressive lactated Ringer resuscitation, pain control, and monitoring for organ failure are the initial management of acute pancreatitis. The WATERFALL aggressive protocol (20 mL/kg bolus, then 3 mL/kg/h) increased fluid overload without improving outcomes and is not the regimen to choose.
• **Acute pancreatitis** requires prompt stabilization with **IV fluids** to prevent complications.
• Pain control is crucial for **patient comfort** and recovery.
• Monitoring for **organ failure** is vital due to the risk of complications from inflammation.
• Patients should be **NPO** (nothing by mouth) initially, with early enteral nutrition introduced when tolerated.
**In practice:** On the unit, this means prioritizing hydration and pain management to support recovery and prevent further complications from pancreatitis.
## Clinical pearl
On the unit, this means prioritizing hydration and pain management to support recovery and prevent further complications from pancreatitis.
## Why the other options are wrong

**Immediate ERCP for all pancreatitis whether or not bile-duct obstruction or ascending cholangitis is present**
• Trap: Students may think ERCP is a standard procedure for all cases of pancreatitis.
• Why it fails here: ERCP is only indicated if there is evidence of **bile duct obstruction**; performing it unnecessarily can lead to complications.
• Remember: This option fails because it overlooks the need for proper assessment before invasive procedures.

**Prophylactic broad-spectrum antibiotics for all mild pancreatitis**
• Trap: There is a common belief that antibiotics are necessary for all cases of pancreatitis to prevent infection.
• Why it fails here: Prophylactic antibiotics are not recommended for mild pancreatitis unless there is a clear indication of infection.
• Remember: This option fails because it misapplies the use of antibiotics without evidence of infection.

**Oral feeding and discharge with lipase recheck in 1 month only**
• Trap: Students might think that early discharge is appropriate once lipase levels are checked.
• Why it fails here: Patients with acute pancreatitis require careful monitoring and management before considering discharge; early feeding can exacerbate symptoms.
• Remember: This option fails because it neglects the need for ongoing management and monitoring of the patient's condition.
## Key takeaway
**When managing acute pancreatitis, prioritize hydration, pain control, and monitoring for complications before considering discharge.**

**Memory hook:** Think of the '3 P's': **Pain**, **Prevention** (of complications), and **Patient stability**.

Fluid correction: ACG 2024 suggests moderately aggressive lactated Ringer, about 1.5 mL/kg/h if not hypovolemic, and a 10 mL/kg bolus only if hypovolemic (https://journals.lww.com/ajg/fulltext/2024/03000/american_college_of_gastroenterology_guidelines_.14.aspx). WATERFALL stopped the aggressive arm for more fluid overload without better outcomes (https://www.nejm.org/doi/full/10.1056/NEJMoa2202884). Immediate ERCP for every case is not indicated without cholangitis or persistent biliary obstruction. Prophylactic antibiotics are not for mild pancreatitis without infection. Discharge with a later lipase check does not treat this presentation.$s2_21ne$,
  170, 77, 115, 108,
  2.207792, 1.064815
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_22id$cmpnjjlxf0awj1ymxqx4p6knk$s2_22id$,
  $s2_22st$usmle-step-2$s2_22st$,
  2,
  $s2_22oo${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin outpatient therapy","Empiric IV antibiotics and dexamethasone immediately; do not delay treatment for imaging if unstable","MRI brain only without LP or blood cultures"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"This approach is dangerous; delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis. (Immediate treatment is crucial in suspected bacterial meningitis to prevent severe outcomes.)","Oral amoxicillin outpatient therapy":"This patient requires intravenous antibiotics due to the severity of symptoms and the risk of serious complications from bacterial meningitis. (Outpatient therapy is inadequate for a potentially life-threatening condition like bacterial meningitis.)","MRI brain only without LP or blood cultures":"In cases of suspected bacterial meningitis, immediate treatment takes precedence over imaging, especially if the patient is unstable. (Delaying treatment for imaging can worsen the patient's condition in bacterial meningitis.)"},"clinicalReasoning":"Empiric IV antibiotics and dexamethasone are essential for suspected bacterial meningitis. **Bacterial meningitis** requires urgent treatment to prevent complications. The patient exhibits signs of **meningeal irritation** and **neutrophilic pleocytosis** in CSF.","keyTakeaways":["When you suspect bacterial meningitis, start IV antibiotics and dexamethasone immediately, without waiting for tests."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T16:52:27.373Z","rationaleQualityScore":100}}$s2_22oo$,
  $s2_22no${"options":["Wait for CSF culture results before starting antibiotics","Oral amoxicillin as outpatient therapy","Empiric IV antibiotics and dexamethasone now; do not delay them for imaging if unstable","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics"],"distractorRationale":{"Wait for CSF culture results before starting antibiotics":"This approach is dangerous; delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis. (Immediate treatment is crucial in suspected bacterial meningitis to prevent severe outcomes.)","Oral amoxicillin as outpatient therapy":"This patient requires intravenous antibiotics due to the severity of symptoms and the risk of serious complications from bacterial meningitis. (Outpatient therapy is inadequate for a potentially life-threatening condition like bacterial meningitis.)","MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics":"In cases of suspected bacterial meningitis, immediate treatment takes precedence over imaging, especially if the patient is unstable. (Delaying treatment for imaging can worsen the patient's condition in bacterial meningitis.)"},"clinicalReasoning":"Empiric IV antibiotics and dexamethasone are essential for suspected bacterial meningitis. **Bacterial meningitis** requires urgent treatment to prevent complications. The patient exhibits signs of **meningeal irritation** and **neutrophilic pleocytosis** in CSF.","keyTakeaways":["When you suspect bacterial meningitis, start IV antibiotics and dexamethasone immediately, without waiting for tests."],"blueprintTopic":"seizures-headaches","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-18T16:52:27.373Z","rationaleQualityScore":100}}$s2_22no$,
  $s2_22oc$Empiric IV antibiotics and dexamethasone immediately; do not delay treatment for imaging if unstable$s2_22oc$,
  $s2_22nc$Empiric IV antibiotics and dexamethasone now; do not delay them for imaging if unstable$s2_22nc$,
  $s2_22oe$## Why this answer is correct
Empiric IV antibiotics and dexamethasone are essential for suspected bacterial meningitis.
• **Bacterial meningitis** requires urgent treatment to prevent complications.
• The patient exhibits signs of **meningeal irritation** and **neutrophilic pleocytosis** in CSF.
• Starting antibiotics and dexamethasone without delay is crucial, especially if the patient is unstable.
**In practice:** In practice, timely administration of antibiotics and dexamethasone can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Clinical pearl
In practice, timely administration of antibiotics and dexamethasone can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Why the other options are wrong

**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think it's safe to wait for lab results before treating.
• Why it fails here: This approach is dangerous; delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis.
• Remember: Immediate treatment is crucial in suspected bacterial meningitis to prevent severe outcomes.

**Oral amoxicillin outpatient therapy**
• Trap: Some may believe that outpatient management is appropriate for this presentation.
• Why it fails here: This patient requires intravenous antibiotics due to the severity of symptoms and the risk of serious complications from bacterial meningitis.
• Remember: Outpatient therapy is inadequate for a potentially life-threatening condition like bacterial meningitis.

**MRI brain only without LP or blood cultures**
• Trap: Students might think imaging is a priority before starting treatment.
• Why it fails here: In cases of suspected bacterial meningitis, immediate treatment takes precedence over imaging, especially if the patient is unstable.
• Remember: Delaying treatment for imaging can worsen the patient's condition in bacterial meningitis.
## Key takeaway
**When you suspect bacterial meningitis, start IV antibiotics and dexamethasone immediately, without waiting for tests.**

**Memory hook:** Think 'Time is brain' — in meningitis, every minute counts!

IDSA 2004 bacterial meningitis guideline: start empiric antibiotics immediately and give dexamethasone with or before the first dose.$s2_22oe$,
  $s2_22ne$## Why this answer is correct
Empiric IV antibiotics and dexamethasone are essential for suspected bacterial meningitis.
• **Bacterial meningitis** requires urgent treatment to prevent complications.
• The patient exhibits signs of **meningeal irritation** and **neutrophilic pleocytosis** in CSF.
• Starting antibiotics and dexamethasone without delay is crucial, especially if the patient is unstable.
**In practice:** In practice, timely administration of antibiotics and dexamethasone can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Clinical pearl
In practice, timely administration of antibiotics and dexamethasone can significantly reduce morbidity and mortality associated with bacterial meningitis.
## Why the other options are wrong

**Wait for CSF culture results before starting antibiotics**
• Trap: Students may think it's safe to wait for lab results before treating.
• Why it fails here: This approach is dangerous; delaying antibiotics can lead to rapid deterioration and increased risk of complications in bacterial meningitis.
• Remember: Immediate treatment is crucial in suspected bacterial meningitis to prevent severe outcomes.

**Oral amoxicillin as outpatient therapy**
• Trap: Some may believe that outpatient management is appropriate for this presentation.
• Why it fails here: This patient requires intravenous antibiotics due to the severity of symptoms and the risk of serious complications from bacterial meningitis.
• Remember: Outpatient therapy is inadequate for a potentially life-threatening condition like bacterial meningitis.

**MRI of the brain only, without lumbar puncture, blood cultures, or empiric antibiotics**
• Trap: Students might think imaging is a priority before starting treatment.
• Why it fails here: In cases of suspected bacterial meningitis, immediate treatment takes precedence over imaging, especially if the patient is unstable.
• Remember: Delaying treatment for imaging can worsen the patient's condition in bacterial meningitis.
## Key takeaway
**When you suspect bacterial meningitis, start IV antibiotics and dexamethasone immediately, without waiting for tests.**

**Memory hook:** Think 'Time is brain' — in meningitis, every minute counts!

IDSA 2004 bacterial meningitis guideline: start empiric antibiotics immediately and give dexamethasone with or before the first dose.$s2_22ne$,
  100, 56, 87, 86,
  1.785714, 1.011628
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_23id$cmqiy35gn000u1yugv3j579ri$s2_23id$,
  $s2_23st$usmle-step-2$s2_23st$,
  2,
  $s2_23oo${"options":["Repeat blood cultures in one week if symptoms persist","Start vancomycin and ceftriaxone after obtaining three blood culture sets, and obtain transesophageal echocardiography","Oral amoxicillin for endocarditis prophylaxis","Rheumatology referral for vasculitis workup first","Immediate valve replacement without antibiotics"],"stepLevel":"step2","kind":"vignette","structureIds":["heart","aorta"]}$s2_23oo$,
  $s2_23no${"options":["Repeat blood cultures in one week if symptoms persist","Start vancomycin and ceftriaxone after three blood culture sets, and obtain transesophageal echocardiography","Oral amoxicillin for endocarditis prophylaxis","Rheumatology referral for a complete serologic vasculitis workup before antibiotics or echocardiography","Immediate valve replacement without antibiotics"],"stepLevel":"step2","kind":"vignette","structureIds":["heart","aorta"]}$s2_23no$,
  $s2_23oc$Start vancomycin and ceftriaxone after obtaining three blood culture sets, and obtain transesophageal echocardiography$s2_23oc$,
  $s2_23nc$Start vancomycin and ceftriaxone after three blood culture sets, and obtain transesophageal echocardiography$s2_23nc$,
  $s2_23oe$High suspicion for infective endocarditis in an IVDU with fever, new murmur, and peripheral stigmata. Obtain multiple blood culture sets, start empiric IV antibiotics covering staphylococci and streptococci, and pursue TEE for vegetation assessment. Delaying treatment is harmful. Prophylaxis is not curative therapy. Vasculitis is less likely with this constellation. Surgery requires diagnosis and antibiotics first except in fulminant instability.$s2_23oe$,
  $s2_23ne$High suspicion for infective endocarditis in an IVDU with fever, new murmur, and peripheral stigmata. Obtain multiple blood culture sets, start empiric IV antibiotics covering staphylococci and streptococci, and pursue TEE for vegetation assessment. Delaying treatment is harmful. Prophylaxis is not curative therapy. Vasculitis is less likely with this constellation. Surgery requires diagnosis and antibiotics first except in fulminant instability.$s2_23ne$,
  118, 53, 108, 103,
  2.226415, 1.048544
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_24id$cmqvw643d00d2ju04yoxj3men$s2_24id$,
  $s2_24st$usmle-step-2$s2_24st$,
  2,
  $s2_24oo${"options":["Viral lymphocytic pleocytosis with normal CSF glucose","Ruptured berry aneurysm causing xanthochromia without infection","Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein","Autoimmune demyelination as acute febrile meningismus"],"distractorRationale":{"Viral lymphocytic pleocytosis with normal CSF glucose":"However, the CSF findings here show a high white blood cell count with a predominance of neutrophils and low glucose, which are not typical for viral infections. (This highlights the importance of differentiating between viral and bacterial meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia without infection":"However, the CSF analysis does not show xanthochromia (yellow discoloration due to blood breakdown), and the clinical picture is more consistent with meningitis. (Understanding the specific CSF findings is key to distinguishing between different causes of meningeal irritation.)","Autoimmune demyelination as acute febrile meningismus":"However, autoimmune demyelination typically does not present with such a high white blood cell count or low glucose levels in the CSF. (This emphasizes the need to recognize the distinct laboratory findings that point towards infectious causes rather than autoimmune processes.)"},"clinicalReasoning":"The patient's symptoms are due to pathogenic bacteria crossing the blood-brain barrier, leading to neutrophilic pleocytosis, low CSF glucose, and elevated protein. **Bacterial meningitis** typically presents with fever, headache, and neck stiffness. Lumbar puncture findings show **neutrophilic pleocytosis** (high white blood cell count with predominance of neutrophils), **low glucose**, and **elevated protein**.","keyTakeaways":["When faced with fever, neck stiffness, and CSF findings of neutrophilic pleocytosis with low glucose, suspect bacterial meningitis first."],"blueprintTopic":"rheumatology-autoimmune","blueprintSystem":"internal-medicine"}$s2_24oo$,
  $s2_24no${"options":["Viral lymphocytic pleocytosis with a normal CSF glucose","Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection","Bacteria cross the blood-brain barrier and cause neutrophilic pleocytosis, low glucose, and high protein","Autoimmune demyelination presenting as acute febrile meningismus"],"distractorRationale":{"Viral lymphocytic pleocytosis with a normal CSF glucose":"However, the CSF findings here show a high white blood cell count with a predominance of neutrophils and low glucose, which are not typical for viral infections. (This highlights the importance of differentiating between viral and bacterial meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection":"However, the CSF analysis does not show xanthochromia (yellow discoloration due to blood breakdown), and the clinical picture is more consistent with meningitis. (Understanding the specific CSF findings is key to distinguishing between different causes of meningeal irritation.)","Autoimmune demyelination presenting as acute febrile meningismus":"However, autoimmune demyelination typically does not present with such a high white blood cell count or low glucose levels in the CSF. (This emphasizes the need to recognize the distinct laboratory findings that point towards infectious causes rather than autoimmune processes.)"},"clinicalReasoning":"The patient's symptoms are due to pathogenic bacteria crossing the blood-brain barrier, leading to neutrophilic pleocytosis, low CSF glucose, and elevated protein. **Bacterial meningitis** typically presents with fever, headache, and neck stiffness. Lumbar puncture findings show **neutrophilic pleocytosis** (high white blood cell count with predominance of neutrophils), **low glucose**, and **elevated protein**.","keyTakeaways":["When faced with fever, neck stiffness, and CSF findings of neutrophilic pleocytosis with low glucose, suspect bacterial meningitis first."],"blueprintTopic":"rheumatology-autoimmune","blueprintSystem":"internal-medicine"}$s2_24no$,
  $s2_24oc$Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein$s2_24oc$,
  $s2_24nc$Bacteria cross the blood-brain barrier and cause neutrophilic pleocytosis, low glucose, and high protein$s2_24nc$,
  $s2_24oe$## Why this answer is correct
The patient's symptoms are due to pathogenic bacteria crossing the blood-brain barrier, leading to neutrophilic pleocytosis, low CSF glucose, and elevated protein.
• **Bacterial meningitis** typically presents with fever, headache, and neck stiffness.
• Lumbar puncture findings show **neutrophilic pleocytosis** (high white blood cell count with predominance of neutrophils), **low glucose**, and **elevated protein**.
• The patient's **positive Kernig and Brudzinski signs** indicate meningeal irritation, consistent with meningitis.
**In practice:** Recognizing bacterial meningitis quickly is crucial, as it requires immediate treatment with antibiotics to prevent serious complications or death. On the unit, timely intervention can significantly improve patient outcomes.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with normal CSF glucose**
• Trap: Students may choose this because viral meningitis is common and can present similarly.
• Why it fails here: However, the CSF findings here show a high white blood cell count with a predominance of neutrophils and low glucose, which are not typical for viral infections.
• Remember: This highlights the importance of differentiating between viral and bacterial meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia without infection**
• Trap: This option might be considered due to the presence of a headache and neck stiffness, which can occur in subarachnoid hemorrhage.
• Why it fails here: However, the CSF analysis does not show xanthochromia (yellow discoloration due to blood breakdown), and the clinical picture is more consistent with meningitis.
• Remember: Understanding the specific CSF findings is key to distinguishing between different causes of meningeal irritation.

**Autoimmune demyelination as acute febrile meningismus**
• Trap: Students may think of autoimmune conditions due to the symptoms of fever and neck stiffness.
• Why it fails here: However, autoimmune demyelination typically does not present with such a high white blood cell count or low glucose levels in the CSF.
• Remember: This emphasizes the need to recognize the distinct laboratory findings that point towards infectious causes rather than autoimmune processes.
## Key takeaway
**When faced with fever, neck stiffness, and CSF findings of neutrophilic pleocytosis with low glucose, suspect bacterial meningitis first.**

**Memory hook:** Remember: **Bacterial meningitis** = **High WBC, Low Glucose, High Protein** in CSF.$s2_24oe$,
  $s2_24ne$## Why this answer is correct
The patient's symptoms are due to pathogenic bacteria crossing the blood-brain barrier, leading to neutrophilic pleocytosis, low CSF glucose, and elevated protein.
• **Bacterial meningitis** typically presents with fever, headache, and neck stiffness.
• Lumbar puncture findings show **neutrophilic pleocytosis** (high white blood cell count with predominance of neutrophils), **low glucose**, and **elevated protein**.
• The patient's **positive Kernig and Brudzinski signs** indicate meningeal irritation, consistent with meningitis.
**In practice:** Recognizing bacterial meningitis quickly is crucial, as it requires immediate treatment with antibiotics to prevent serious complications or death. On the unit, timely intervention can significantly improve patient outcomes.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with a normal CSF glucose**
• Trap: Students may choose this because viral meningitis is common and can present similarly.
• Why it fails here: However, the CSF findings here show a high white blood cell count with a predominance of neutrophils and low glucose, which are not typical for viral infections.
• Remember: This highlights the importance of differentiating between viral and bacterial meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection**
• Trap: This option might be considered due to the presence of a headache and neck stiffness, which can occur in subarachnoid hemorrhage.
• Why it fails here: However, the CSF analysis does not show xanthochromia (yellow discoloration due to blood breakdown), and the clinical picture is more consistent with meningitis.
• Remember: Understanding the specific CSF findings is key to distinguishing between different causes of meningeal irritation.

**Autoimmune demyelination presenting as acute febrile meningismus**
• Trap: Students may think of autoimmune conditions due to the symptoms of fever and neck stiffness.
• Why it fails here: However, autoimmune demyelination typically does not present with such a high white blood cell count or low glucose levels in the CSF.
• Remember: This emphasizes the need to recognize the distinct laboratory findings that point towards infectious causes rather than autoimmune processes.
## Key takeaway
**When faced with fever, neck stiffness, and CSF findings of neutrophilic pleocytosis with low glucose, suspect bacterial meningitis first.**

**Memory hook:** Remember: **Bacterial meningitis** = **High WBC, Low Glucose, High Protein** in CSF.$s2_24ne$,
  111, 63, 104, 95,
  1.761905, 1.094737
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_25id$cmr87slw000k61yr9gfb0d3p5$s2_25id$,
  $s2_25st$usmle-step-2$s2_25st$,
  2,
  $s2_25oo$["Unopposed TSH-receptor antibody stimulation of the thyroid after stopping antithyroid therapy", "Autoimmune destruction of thyroid tissue", "Overtreatment of hypothyroidism with levothyroxine", "Resistance to thyroid hormone"]$s2_25oo$,
  $s2_25no$["TSH-receptor antibody stimulation of the thyroid after antithyroid therapy is stopped", "Autoimmune destruction of thyroid follicular tissue", "Overtreatment of preexisting hypothyroidism with an excessive daily levothyroxine dose", "Peripheral resistance to thyroid hormone"]$s2_25no$,
  $s2_25oc$Unopposed TSH-receptor antibody stimulation of the thyroid after stopping antithyroid therapy$s2_25oc$,
  $s2_25nc$TSH-receptor antibody stimulation of the thyroid after antithyroid therapy is stopped$s2_25nc$,
  $s2_25oe$Correct answer: A. Unopposed TSH-receptor antibody stimulation of the thyroid after stopping antithyroid therapy. He has Graves disease and stopped methimazole 1 month ago, so TSH-receptor-stimulating antibodies drive unchecked hormone synthesis; with fever of 39.5 C, confusion and tachycardia this has progressed to thyroid storm. Why the other options are wrong: B. Autoimmune destruction of the thyroid (Hashimoto thyroiditis) causes hypothyroidism. C. He has Graves disease, not hypothyroidism, and is not described as taking levothyroxine. D. Thyroid hormone resistance causes elevated thyroid hormone with a nonsuppressed TSH; his TSH is suppressed.$s2_25oe$,
  $s2_25ne$Correct answer: A. TSH-receptor antibody stimulation of the thyroid after antithyroid therapy is stopped. He has Graves disease and stopped methimazole 1 month ago, so TSH-receptor-stimulating antibodies drive unchecked hormone synthesis; with fever of 39.5 C, confusion and tachycardia this has progressed to thyroid storm. Why the other options are wrong: B. Autoimmune destruction of the thyroid (Hashimoto thyroiditis) causes hypothyroidism. C. He has Graves disease, not hypothyroidism, and is not described as taking levothyroxine. D. Thyroid hormone resistance causes elevated thyroid hormone with a nonsuppressed TSH; his TSH is suppressed.$s2_25ne$,
  93, 50, 85, 86,
  1.860000, 0.988372
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_26id$cmr891c0900xg1yr9rftwycdk$s2_26id$,
  $s2_26st$usmle-step-2$s2_26st$,
  2,
  $s2_26oo$["Start antihypertensive medication today", "Confirm with home or ambulatory blood pressure monitoring and advise lifestyle modification", "Refer to a cardiologist", "Order a 24-hour urine metanephrine collection"]$s2_26oo$,
  $s2_26no$["Start antihypertensive medication at this visit without confirmatory readings", "Confirm with home or ambulatory monitoring and advise lifestyle changes", "Refer to a cardiologist for blood pressure care", "Order a 24-hour urine metanephrine collection"]$s2_26no$,
  $s2_26oc$Confirm with home or ambulatory blood pressure monitoring and advise lifestyle modification$s2_26oc$,
  $s2_26nc$Confirm with home or ambulatory monitoring and advise lifestyle changes$s2_26nc$,
  $s2_26oe$Correct answer: B. Confirm with home or ambulatory blood pressure monitoring and advise lifestyle modification. The 2025 AHA/ACC guideline states that 'a single reading is inadequate for clinical decision-making' and that 'it is reasonable to exclude white-coat hypertension using out-of-office BP monitoring for adults with high office BP (ie, SBP/DBP ≥130/80 mm Hg)'; lifestyle changes 'are strongly recommended'. If hypertension is confirmed, a targeted secondary evaluation follows. Why the other options are wrong: A. Drugs before confirmation are premature at <160/100. C. Referral is not needed. D. Nothing suggests pheochromocytoma.$s2_26oe$,
  $s2_26ne$Correct answer: B. Confirm with home or ambulatory monitoring and advise lifestyle changes. The 2025 AHA/ACC guideline states that 'a single reading is inadequate for clinical decision-making' and that 'it is reasonable to exclude white-coat hypertension using out-of-office BP monitoring for adults with high office BP (ie, SBP/DBP ≥130/80 mm Hg)'; lifestyle changes 'are strongly recommended'. If hypertension is confirmed, a targeted secondary evaluation follows. Why the other options are wrong: A. Drugs before confirmation are premature at <160/100. C. Referral is not needed. D. Nothing suggests pheochromocytoma.$s2_26ne$,
  91, 45, 71, 77,
  2.022222, 0.922078
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_27id$cmrrvrs4c009o1yl88swzb7zp$s2_27id$,
  $s2_27st$usmle-step-2$s2_27st$,
  2,
  $s2_27oo$["Urgent hemodialysis", "Intravenous calcium gluconate", "Start a potassium binder (sodium zirconium cyclosilicate or patiromer), reinforce a low-potassium diet, and recheck potassium", "Increase oral fluid intake"]$s2_27oo$,
  $s2_27no$["Urgent hemodialysis for this potassium elevation", "Intravenous calcium gluconate now to stabilize the cardiac membranes", "Start a potassium binder, reinforce a low-potassium diet, and recheck the level", "Increase oral fluid intake to lower the potassium"]$s2_27no$,
  $s2_27oc$Start a potassium binder (sodium zirconium cyclosilicate or patiromer), reinforce a low-potassium diet, and recheck potassium$s2_27oc$,
  $s2_27nc$Start a potassium binder, reinforce a low-potassium diet, and recheck the level$s2_27nc$,
  $s2_27oe$Correct answer: C. Start a potassium binder (sodium zirconium cyclosilicate or patiromer), reinforce a low-potassium diet, and recheck potassium. She has confirmed, asymptomatic, moderate hyperkalemia (6.1-6.2 mEq/L, pseudohyperkalemia excluded) with a normal ECG, in CKD on an ACE inhibitor. The KDIGO Controversies Conference supports newer binders to lower potassium and allow continued RAAS-inhibitor therapy, which protects the kidneys. Metformin should also be reviewed because her eGFR is below 30. Why the other options are wrong: A. Dialysis is for refractory or life-threatening hyperkalemia or ESKD, not for a stable outpatient with a normal ECG. B. IV calcium stabilizes the myocardium when there are ECG changes or severe hyperkalemia; it does not lower potassium and is not indicated with a normal ECG. D. Extra fluid does not meaningfully lower potassium in CKD and may cause volume overload.$s2_27oe$,
  $s2_27ne$Correct answer: C. Start a potassium binder, reinforce a low-potassium diet, and recheck the level. She has confirmed, asymptomatic, moderate hyperkalemia (6.1-6.2 mEq/L, pseudohyperkalemia excluded) with a normal ECG, in CKD on an ACE inhibitor. The KDIGO Controversies Conference supports newer binders to lower potassium and allow continued RAAS-inhibitor therapy, which protects the kidneys. Metformin should also be reviewed because her eGFR is below 30. Why the other options are wrong: A. Dialysis is for refractory or life-threatening hyperkalemia or ESKD, not for a stable outpatient with a normal ECG. B. IV calcium stabilizes the myocardium when there are ECG changes or severe hyperkalemia; it does not lower potassium and is not indicated with a normal ECG. D. Extra fluid does not meaningfully lower potassium in CKD and may cause volume overload.$s2_27ne$,
  125, 29, 79, 68,
  4.310345, 1.161765
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_28id$db380a15-5831-431f-90fb-ba207a4dbf64$s2_28id$,
  $s2_28st$usmle-step-2$s2_28st$,
  2,
  $s2_28oo${"options":["Transfuse and operate emergently; parental refusal does not permit withholding life-saving blood from a child","Honor the refusal and continue crystalloid only","Wait for a scheduled court date next week before any blood","Discharge against medical advice to the parents","Give blood secretly and never document it"],"blueprintSystem":"human-development","taskCategory":"clinical-intervention","blueprintTopic":"Parents cannot refuse life-saving blood for a child","kind":"vignette"}$s2_28oo$,
  $s2_28no${"options":["Transfuse and operate now; parental refusal cannot withhold life-saving blood from a child","Honor the refusal and continue crystalloid only","Wait for a scheduled court date next week before giving any packed blood product","Discharge the child against medical advice to the parents","Give blood secretly and never document it"],"blueprintSystem":"human-development","taskCategory":"clinical-intervention","blueprintTopic":"Parents cannot refuse life-saving blood for a child","kind":"vignette"}$s2_28no$,
  $s2_28oc$Transfuse and operate emergently; parental refusal does not permit withholding life-saving blood from a child$s2_28oc$,
  $s2_28nc$Transfuse and operate now; parental refusal cannot withhold life-saving blood from a child$s2_28nc$,
  $s2_28oe$A capacitated adult may refuse blood for himself or herself, even if the decision is fatal. Parents do not have the same authority to refuse life-saving treatment for a child. Hemorrhagic shock with a hemoglobin of 5.1 g/dL and an operative source is an emergency in which delay for a non-urgent court calendar causes death. Transfuse and proceed with hemorrhage control, while child-protection and legal teams are notified as institutional policy requires; in an immediate emergency, treatment does not wait on that paperwork. Continuing crystalloid alone in uncontrolled hemorrhage will not restore oxygen-carrying capacity. Discharging an unconscious child to honor a parental religious refusal abandons the patient. Secret transfusion without documentation is dishonest and unnecessary, because the ethical and legal authority to treat exists and should be written in the chart. Speak to the parents with respect, explain that the team is obligated to the child, and do not frame them as malicious. The distinction between adult refusal and parental refusal is the entire decision.$s2_28oe$,
  $s2_28ne$A capacitated adult may refuse blood for himself or herself, even if the decision is fatal. Parents do not have the same authority to refuse life-saving treatment for a child. Hemorrhagic shock with a hemoglobin of 5.1 g/dL and an operative source is an emergency in which delay for a non-urgent court calendar causes death. Transfuse and proceed with hemorrhage control, while child-protection and legal teams are notified as institutional policy requires; in an immediate emergency, treatment does not wait on that paperwork. Continuing crystalloid alone in uncontrolled hemorrhage will not restore oxygen-carrying capacity. Discharging an unconscious child to honor a parental religious refusal abandons the patient. Secret transfusion without documentation is dishonest and unnecessary, because the ethical and legal authority to treat exists and should be written in the chart. Speak to the parents with respect, explain that the team is obligated to the child, and do not frame them as malicious. The distinction between adult refusal and parental refusal is the entire decision.$s2_28ne$,
  109, 58, 90, 80,
  1.879310, 1.125000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_29id$05d41302-d7a1-4401-9f54-566fd02884c8$s2_29id$,
  $s2_29st$usmle-step-3$s2_29st$,
  2,
  $s2_29oo${"options":["Calcium only","Start an oral bisphosphonate once she can stay upright, after calcium and vitamin D are addressed","High-dose prednisone to strengthen bone","Estrogen as the first osteoporosis drug","No drug because the fracture already happened"],"blueprintSystem":"msk-skin","taskCategory":"pharmacotherapy","blueprintTopic":"bisphosphonate-after-hip-fracture","kind":"vignette"}$s2_29oo$,
  $s2_29no${"options":["Calcium supplementation only","Start an oral bisphosphonate once she can stay upright, after calcium and vitamin D","High-dose prednisone to strengthen the bone","Estrogen as the first-line osteoporosis drug","No drug therapy because the osteoporotic fracture has already occurred"],"blueprintSystem":"msk-skin","taskCategory":"pharmacotherapy","blueprintTopic":"bisphosphonate-after-hip-fracture","kind":"vignette"}$s2_29no$,
  $s2_29oc$Start an oral bisphosphonate once she can stay upright, after calcium and vitamin D are addressed$s2_29oc$,
  $s2_29nc$Start an oral bisphosphonate once she can stay upright, after calcium and vitamin D$s2_29nc$,
  $s2_29oe$A fragility hip fracture is treated with an antiresorptive such as a bisphosphonate, after calcium and vitamin D are adequate and she can remain upright. Calcium alone, estrogen first-line, doing nothing, and prednisone are wrong.$s2_29oe$,
  $s2_29ne$A fragility hip fracture is treated with an antiresorptive such as a bisphosphonate, after calcium and vitamin D are adequate and she can remain upright. Calcium alone, estrogen first-line, doing nothing, and prednisone are wrong.$s2_29ne$,
  97, 45, 83, 70,
  2.155556, 1.185714
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_30id$119f9e59-5807-4953-9ff0-e4082b48a80a$s2_30id$,
  $s2_30st$usmle-step-3$s2_30st$,
  2,
  $s2_30oo${"options":["No antithrombotic drug","Dual antiplatelet therapy for life","Warfarin with an INR target of 4","Aspirin indefinitely and no anticoagulant","Start anticoagulation now that the infarct is small and imaging shows no bleed, and stop using aspirin as the long-term stroke drug"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"anticoagulate-af-after-stroke-not-aspirin-forever","kind":"vignette"}$s2_30oo$,
  $s2_30no${"options":["No antithrombotic drug after this infarct","Dual antiplatelet therapy for life as secondary prevention after this stroke","Warfarin with an INR target of 4","Aspirin indefinitely and no oral anticoagulant","Anticoagulate this small nonhemorrhagic infarct and do not continue aspirin long term"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"anticoagulate-af-after-stroke-not-aspirin-forever","kind":"vignette"}$s2_30no$,
  $s2_30oc$Start anticoagulation now that the infarct is small and imaging shows no bleed, and stop using aspirin as the long-term stroke drug$s2_30oc$,
  $s2_30nc$Anticoagulate this small nonhemorrhagic infarct and do not continue aspirin long term$s2_30nc$,
  $s2_30oe$Atrial fibrillation caused the indication for anticoagulation, and a small infarct without hemorrhage can be anticoagulated by this point rather than left on aspirin. Aspirin does not provide comparable stroke prevention. An INR target of 4 is excessive. Lifelong dual antiplatelet therapy adds bleeding and is not the AF regimen. No antithrombotic drug returns her to the risk that produced the stroke.$s2_30oe$,
  $s2_30ne$Atrial fibrillation caused the indication for anticoagulation, and a small infarct without hemorrhage can be anticoagulated by this point rather than left on aspirin. Aspirin does not provide comparable stroke prevention. An INR target of 4 is excessive. Lifelong dual antiplatelet therapy adds bleeding and is not the AF regimen. No antithrombotic drug after this infarct returns her to the risk that produced the stroke.$s2_30ne$,
  131, 41, 85, 76,
  3.195122, 1.118421
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_31id$1ccdf247-4621-4a03-8bff-5f3e6212f55c$s2_31id$,
  $s2_31st$usmle-step-3$s2_31st$,
  2,
  $s2_31oo${"options":["Stop the drug forever because she has no symptoms","No eye care is needed on hydroxychloroquine","Double the dose because the eyes feel fine","Refer for a baseline-or-interval retinal examination and continue the drug if the eyes are clear","Add chloroquine on top"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"hydroxychloroquine-eye-exam","kind":"vignette"}$s2_31oo$,
  $s2_31no${"options":["Stop the drug forever because she has no visual symptoms","No baseline or follow-up eye examination is needed during hydroxychloroquine treatment","Double the dose because the eyes feel fine","Refer for baseline or interval retinal examination and continue the drug if the eyes are clear","Add chloroquine on top of the current drug"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"hydroxychloroquine-eye-exam","kind":"vignette"}$s2_31no$,
  $s2_31oc$Refer for a baseline-or-interval retinal examination and continue the drug if the eyes are clear$s2_31oc$,
  $s2_31nc$Refer for baseline or interval retinal examination and continue the drug if the eyes are clear$s2_31nc$,
  $s2_31oe$Hydroxychloroquine needs retinal screening on a schedule even when vision is normal. Stopping it without an exam, doubling it, adding chloroquine, or skipping eye care are wrong.$s2_31oe$,
  $s2_31ne$Hydroxychloroquine needs retinal screening on a schedule even when vision is normal. Stopping it without an exam, doubling it, adding chloroquine, or skipping eye care are wrong.$s2_31ne$,
  96, 49, 94, 86,
  1.959184, 1.093023
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_32id$2631a2e1-a0da-422e-befb-b746d4bb75b3$s2_32id$,
  $s2_32st$usmle-step-3$s2_32st$,
  2,
  $s2_32oo${"options":["Stop diphenhydramine and oxybutynin, and look for other reversible causes before standing antipsychotics","Add a benzodiazepine for sleep","Four-point restraints as the treatment of delirium","Scheduled haloperidol without stopping the anticholinergics","Ignore the confusion because it is nighttime"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"delirium-stop-anticholinergic","kind":"vignette"}$s2_32oo$,
  $s2_32no${"options":["Stop diphenhydramine and oxybutynin, and look for reversible causes before an antipsychotic","Add a benzodiazepine at bedtime for sleep","Four-point restraints as the treatment of this delirium","Scheduled haloperidol doses without first stopping diphenhydramine and oxybutynin","Ignore the confusion because it occurs at night"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"delirium-stop-anticholinergic","kind":"vignette"}$s2_32no$,
  $s2_32oc$Stop diphenhydramine and oxybutynin, and look for other reversible causes before standing antipsychotics$s2_32oc$,
  $s2_32nc$Stop diphenhydramine and oxybutynin, and look for reversible causes before an antipsychotic$s2_32nc$,
  $s2_32oe$Anticholinergics are a common, reversible cause of delirium. Stop them and check for infection, retention, and pain before committing to standing haloperidol. Adding a benzodiazepine worsens delirium except in specific withdrawal states he does not have. Restraints are not therapy. Nighttime is when delirium shows itself; it is not a reason to skip the evaluation.$s2_32oe$,
  $s2_32ne$Anticholinergics are a common, reversible cause of delirium. Stop them and check for infection, retention, and pain before committing to standing haloperidol. Adding a benzodiazepine worsens delirium except in specific withdrawal states he does not have. Restraints are not therapy. Nighttime is when delirium shows itself; it is not a reason to skip the evaluation.$s2_32ne$,
  104, 59, 91, 81,
  1.762712, 1.123457
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_33id$4dd34b8f-2b82-4796-be63-bee4bf49d988$s2_33id$,
  $s2_33st$usmle-step-3$s2_33st$,
  2,
  $s2_33oo${"options":["Discharge with an incentive spirometer","Needle both sides of the chest","Immediate bilateral thoracotomy","Heparin","Support oxygenation and ventilation; do not place bilateral chest tubes for a flail chest alone"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"flail-chest-support-ventilation","kind":"vignette"}$s2_33oo$,
  $s2_33no${"options":["Discharge home with an incentive spirometer","Needle decompression of both sides of the chest","Immediate bilateral thoracotomy to stabilize the acute flail chest wall","Heparin anticoagulation","Support oxygenation and ventilation; no bilateral chest tubes for flail chest alone"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"flail-chest-support-ventilation","kind":"vignette"}$s2_33no$,
  $s2_33oc$Support oxygenation and ventilation; do not place bilateral chest tubes for a flail chest alone$s2_33oc$,
  $s2_33nc$Support oxygenation and ventilation; no bilateral chest tubes for flail chest alone$s2_33nc$,
  $s2_33oe$Flail chest needs oxygen and ventilatory support, plus pain control. It is not tension pneumothorax, so bilateral needles and thoracotomy are not the first move when breath sounds are present and the trachea is midline. Heparin and discharge ignore respiratory failure.$s2_33oe$,
  $s2_33ne$Flail chest needs oxygen and ventilatory support, plus pain control. It is not tension pneumothorax, so bilateral needles and thoracotomy are not the first move when breath sounds are present and the trachea is midline. Heparin anticoagulation and discharge ignore respiratory failure.$s2_33ne$,
  95, 38, 83, 71,
  2.500000, 1.169014
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_34id$4f7e30b9-1a8a-45c8-bf94-7141a5c15960$s2_34id$,
  $s2_34st$usmle-step-3$s2_34st$,
  2,
  $s2_34oo${"options":["Protamine","Platelet transfusion","Give oral vitamin K and recheck; do not give clotting factor for this INR without bleeding","Stop warfarin forever and start aspirin","Four-factor PCC and intensive care"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"inr-above-10-vitamin-k","kind":"vignette"}$s2_34oo$,
  $s2_34no${"options":["Protamine sulfate","Platelet transfusion","Give oral vitamin K and recheck; withhold clotting factor for this INR without bleeding","Stop warfarin forever and start aspirin","Four-factor prothrombin complex concentrate plus admission for intensive care"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"inr-above-10-vitamin-k","kind":"vignette"}$s2_34no$,
  $s2_34oc$Give oral vitamin K and recheck; do not give clotting factor for this INR without bleeding$s2_34oc$,
  $s2_34nc$Give oral vitamin K and recheck; withhold clotting factor for this INR without bleeding$s2_34nc$,
  $s2_34oe$An INR above 10 without bleeding is treated with oral vitamin K and a pause in warfarin, not with PCC, which is for serious bleeding. Platelets and protamine do not reverse warfarin. Permanent aspirin is not the substitute.$s2_34oe$,
  $s2_34ne$An INR above 10 without bleeding is treated with oral vitamin K and a pause in warfarin, not with PCC, which is for serious bleeding. Platelets and protamine do not reverse warfarin. Permanent aspirin is not the substitute.$s2_34ne$,
  90, 39, 87, 77,
  2.307692, 1.129870
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_35id$594198c6-e5de-4918-811c-1872bde294bb$s2_35id$,
  $s2_35st$usmle-step-3$s2_35st$,
  2,
  $s2_35oo${"options":["Prochlorperazine","Metoclopramide","Haloperidol for the nausea","Stop levodopa so metoclopramide can be used","Do not give metoclopramide; choose an antiemetic that does not block dopamine"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"avoid-metoclopramide-in-parkinson","kind":"vignette"}$s2_35oo$,
  $s2_35no${"options":["Prochlorperazine for the nausea","Metoclopramide for nausea","Haloperidol for the nausea","Stop levodopa in order to permit a dopamine-blocking antiemetic","Avoid metoclopramide; choose an antiemetic that does not block dopamine"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"avoid-metoclopramide-in-parkinson","kind":"vignette"}$s2_35no$,
  $s2_35oc$Do not give metoclopramide; choose an antiemetic that does not block dopamine$s2_35oc$,
  $s2_35nc$Avoid metoclopramide; choose an antiemetic that does not block dopamine$s2_35nc$,
  $s2_35oe$Metoclopramide and other dopamine blockers worsen Parkinson disease. Haloperidol and prochlorperazine do the same. Stopping levodopa to allow a blocker is backwards.$s2_35oe$,
  $s2_35ne$Metoclopramide for nausea and other dopamine blockers worsen Parkinson disease. Haloperidol and prochlorperazine do the same. Stopping levodopa to allow a blocker is backwards.$s2_35ne$,
  77, 43, 71, 63,
  1.790698, 1.126984
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_36id$5e4308ad-368b-4622-8505-86eb94e68afa$s2_36id$,
  $s2_36st$usmle-step-3$s2_36st$,
  2,
  $s2_36oo${"options":["Isotonic saline and stop lithium; arrange dialysis if the level or the neurologic findings warrant it","Continue lithium at half dose","Activated charcoal as the specific binder","Hemodialysis is forbidden above a level of 2","A loop diuretic to 'clear lithium'"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"lithium-toxicity-saline-not-diuretic","kind":"vignette"}$s2_36oo$,
  $s2_36no${"options":["Isotonic saline, stop lithium, and dialyze if the level or neurologic findings warrant it","Continue lithium at half the current dose","Activated charcoal given acutely as a specific gastrointestinal binder for lithium","Hemodialysis is forbidden above a level of 2","A loop diuretic to 'clear lithium'"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"lithium-toxicity-saline-not-diuretic","kind":"vignette"}$s2_36no$,
  $s2_36oc$Isotonic saline and stop lithium; arrange dialysis if the level or the neurologic findings warrant it$s2_36oc$,
  $s2_36nc$Isotonic saline, stop lithium, and dialyze if the level or neurologic findings warrant it$s2_36nc$,
  $s2_36oe$Lithium is stopped and volume is restored with saline, which helps lithium clearance. A loop diuretic can worsen toxicity. Continuing the drug is wrong. Charcoal does not bind lithium. Dialysis is considered for a high level with neurologic toxicity; it is not forbidden.$s2_36oe$,
  $s2_36ne$Lithium is stopped and volume is restored with saline, which helps lithium clearance. A loop diuretic can worsen toxicity. Continuing the drug is wrong. Charcoal does not bind lithium. Dialysis is considered for a high level with neurologic toxicity; it is not forbidden.$s2_36ne$,
  101, 44, 89, 82,
  2.295455, 1.085366
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_37id$70c4dd4c-81bd-4600-872f-136129131122$s2_37id$,
  $s2_37st$usmle-step-3$s2_37st$,
  2,
  $s2_37oo${"options":["Give blood secretly and never document it","Discharge against medical advice","Honor the refusal and continue crystalloid only","Wait for a court date next week","Transfuse and operate; parental refusal does not allow withholding life-saving blood from a child"],"blueprintSystem":"social-sciences","taskCategory":"clinical-intervention","blueprintTopic":"minor-life-saving-transfusion-despite-parent","kind":"vignette"}$s2_37oo$,
  $s2_37no${"options":["Give blood secretly and never document it","Discharge the child against medical advice","Honor the refusal and continue crystalloid only","Wait for a scheduled court date next week before allowing any transfusion","Transfuse and operate; parental refusal cannot withhold life-saving blood from a child"],"blueprintSystem":"social-sciences","taskCategory":"clinical-intervention","blueprintTopic":"minor-life-saving-transfusion-despite-parent","kind":"vignette"}$s2_37no$,
  $s2_37oc$Transfuse and operate; parental refusal does not allow withholding life-saving blood from a child$s2_37oc$,
  $s2_37nc$Transfuse and operate; parental refusal cannot withhold life-saving blood from a child$s2_37nc$,
  $s2_37oe$Parents cannot refuse life-saving transfusion for a child. Crystalloid alone, a next-week court date, and discharge abandon the child. Secret transfusion without a record is the wrong way to do the right act; treat and document.$s2_37oe$,
  $s2_37ne$Parents cannot refuse life-saving transfusion for a child. Crystalloid alone, a next-week court date, and discharge abandon the child. Secret transfusion without a record is the wrong way to do the right act; treat and document.$s2_37ne$,
  97, 47, 86, 73,
  2.063830, 1.178082
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_38id$a79db614-f061-4de6-9068-10c83bb6fcb0$s2_38id$,
  $s2_38st$usmle-step-3$s2_38st$,
  2,
  $s2_38oo${"options":["No further rhythm or anticoagulation follow-up","Switch to aspirin now that she is in sinus rhythm","Stop apixaban today","Stop anticoagulation and start dual antiplatelet therapy","Continue anticoagulation for at least four weeks, and long-term because her stroke risk remains high"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"continue-anticoagulation-after-cardioversion","kind":"vignette"}$s2_38oo$,
  $s2_38no${"options":["No further rhythm or anticoagulation follow-up","Switch to aspirin now that she is back in sinus rhythm","Stop apixaban at this visit","Stop her anticoagulation and replace it with long-term dual antiplatelet therapy","Continue anticoagulation for at least four weeks and long-term, because stroke risk stays high"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"continue-anticoagulation-after-cardioversion","kind":"vignette"}$s2_38no$,
  $s2_38oc$Continue anticoagulation for at least four weeks, and long-term because her stroke risk remains high$s2_38oc$,
  $s2_38nc$Continue anticoagulation for at least four weeks and long-term, because stroke risk stays high$s2_38nc$,
  $s2_38oe$After cardioversion, anticoagulation continues for at least four weeks because atrial stunning persists, and her CHA2DS2-VASc score of 4 means long-term anticoagulation regardless of the current rhythm. Stopping today, or substituting aspirin or dual antiplatelet therapy, removes stroke prevention. She still needs follow-up of rhythm and bleeding risk.$s2_38oe$,
  $s2_38ne$After cardioversion, anticoagulation continues for at least four weeks because atrial stunning persists, and her CHA2DS2-VASc score of 4 means long-term anticoagulation regardless of the current rhythm. Stopping today, or substituting aspirin or dual antiplatelet therapy, removes stroke prevention. She still needs follow-up of rhythm and bleeding risk.$s2_38ne$,
  100, 56, 94, 80,
  1.785714, 1.175000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_39id$aed73106-13aa-49d4-a00a-121cff8e8057$s2_39id$,
  $s2_39st$usmle-step-3$s2_39st$,
  2,
  $s2_39oo${"options":["Adenosine as a diagnostic test in this irregular wide rhythm","Intravenous digoxin","Do not give an atrioventricular nodal blocker; cardiovert if he becomes unstable, or use procainamide if he stays stable","Intravenous diltiazem","Intravenous metoprolol as the preferred drug"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"wpw-af-avoid-nodal-blocker","kind":"vignette"}$s2_39oo$,
  $s2_39no${"options":["Adenosine as a diagnostic test in this irregular wide-complex tachycardia","Intravenous digoxin for rate control","No atrioventricular nodal blocker; cardiovert if unstable, or procainamide if stable","Intravenous diltiazem for rate control","Intravenous metoprolol as the preferred rate-control drug"],"blueprintSystem":"cardiovascular","taskCategory":"pharmacotherapy","blueprintTopic":"wpw-af-avoid-nodal-blocker","kind":"vignette"}$s2_39no$,
  $s2_39oc$Do not give an atrioventricular nodal blocker; cardiovert if he becomes unstable, or use procainamide if he stays stable$s2_39oc$,
  $s2_39nc$No atrioventricular nodal blocker; cardiovert if unstable, or procainamide if stable$s2_39nc$,
  $s2_39oe$Pre-excited atrial fibrillation can accelerate into ventricular fibrillation if an atrioventricular nodal blocker is given. Diltiazem, digoxin, and metoprolol are all the wrong class. A stable patient can receive procainamide; an unstable patient is cardioverted. Adenosine is not a treatment or a safe diagnostic maneuver for an irregular wide-complex tachycardia.$s2_39oe$,
  $s2_39ne$Pre-excited atrial fibrillation can accelerate into ventricular fibrillation if an atrioventricular nodal blocker is given. Diltiazem, digoxin, and metoprolol are all the wrong class. A stable patient can receive procainamide; an unstable patient is cardioverted. Adenosine is not a treatment or a safe diagnostic maneuver for an irregular wide-complex tachycardia.$s2_39ne$,
  120, 60, 84, 73,
  2.000000, 1.150685
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_40id$cbe57fa6-9d83-499e-898c-cef23ac8e2eb$s2_40id$,
  $s2_40st$usmle-step-3$s2_40st$,
  2,
  $s2_40oo${"options":["Add antibiotics only and recheck tomorrow","Urgent source control to decompress the kidney, in addition to antibiotics and resuscitation","Nephrectomy tonight as the first procedure","Stop fluids because antibiotics were given","Oral antibiotics and a clinic visit in three days"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"sepsis-source-control-not-broader-antibiotics-alone","kind":"vignette"}$s2_40oo$,
  $s2_40no${"options":["Add antibiotics only and recheck tomorrow","Urgent decompression of the kidney, plus antibiotics and resuscitation","Nephrectomy tonight as the first procedure","Stop intravenous fluids because antibiotics have already been given","Oral antibiotics and a clinic visit in three days"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"sepsis-source-control-not-broader-antibiotics-alone","kind":"vignette"}$s2_40no$,
  $s2_40oc$Urgent source control to decompress the kidney, in addition to antibiotics and resuscitation$s2_40oc$,
  $s2_40nc$Urgent decompression of the kidney, plus antibiotics and resuscitation$s2_40nc$,
  $s2_40oe$Obstructed pyelonephritis with septic shock needs decompression, usually a stent or nephrostomy, not another antibiotic in place of drainage. Tomorrow and a three-day clinic delay are source-control failures. Stopping fluids removes resuscitation. Nephrectomy is not the first procedure when drainage can save the kidney.$s2_40oe$,
  $s2_40ne$Obstructed pyelonephritis with septic shock needs decompression, usually a stent or nephrostomy, not another antibiotic in place of drainage. Tomorrow and a three-day clinic delay are source-control failures. Stopping fluids removes resuscitation. Nephrectomy is not the first procedure when drainage can save the kidney.$s2_40ne$,
  92, 49, 70, 67,
  1.877551, 1.044776
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_41id$cc41e7c7-b5b4-4d5e-996a-720e1f9828a6$s2_41id$,
  $s2_41st$usmle-step-3$s2_41st$,
  2,
  $s2_41oo${"options":["Triple therapy with a long-acting beta agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid","Inhaled corticosteroid monotherapy","A long-acting beta agonist plus a muscarinic antagonist only","Chronic oral prednisone","No inhaler until he stops smoking"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"triple-therapy-high-eosinophils","kind":"vignette"}$s2_41oo$,
  $s2_41no${"options":["Inhaled corticosteroid, long-acting beta agonist, and long-acting muscarinic antagonist","Inhaled corticosteroid monotherapy","Dual long-acting bronchodilator therapy without an inhaled corticosteroid","Chronic daily oral prednisone","No inhaler until he stops smoking"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"triple-therapy-high-eosinophils","kind":"vignette"}$s2_41no$,
  $s2_41oc$Triple therapy with a long-acting beta agonist, a long-acting muscarinic antagonist, and an inhaled corticosteroid$s2_41oc$,
  $s2_41nc$Inhaled corticosteroid, long-acting beta agonist, and long-acting muscarinic antagonist$s2_41nc$,
  $s2_41oe$Two exacerbations and eosinophils well above 300 support starting triple therapy, not dual bronchodilation alone, a steroid inhaler alone, daily prednisone, or no inhaler.$s2_41oe$,
  $s2_41ne$Two exacerbations and eosinophils well above 300 support starting triple therapy, not dual bronchodilation alone, a steroid inhaler alone, daily prednisone, or no inhaler.$s2_41ne$,
  114, 60, 87, 73,
  1.900000, 1.191781
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_42id$cmq33a0fk006p1yiudpaxp96g$s2_42id$,
  $s2_42st$usmle-step-3$s2_42st$,
  2,
  $s2_42oo${"options":["Primary CNS vasospasm without placental or endothelial pathology","Gestational diabetes causing visual changes without hypertension","Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia","Cortical venous thrombosis as most likely without focal deficits"],"distractorRationale":{"Primary CNS vasospasm without placental or endothelial pathology":"This fails here because primary CNS vasospasm does not account for the systemic hypertension and proteinuria present in this case. (Preeclampsia is characterized by hypertension and proteinuria due to placental dysfunction, which this option overlooks.)","Gestational diabetes causing visual changes without hypertension":"This fails here as gestational diabetes does not typically cause hypertension or significant proteinuria, both of which are critical in this patient's presentation. (Preeclampsia is defined by the presence of hypertension and proteinuria, which are absent in gestational diabetes.)","Cortical venous thrombosis as most likely without focal deficits":"This fails here because cortical venous thrombosis usually presents with focal neurological deficits, which this patient does not exhibit. (The systemic signs of preeclampsia, such as hypertension and proteinuria, are not explained by cortical venous thrombosis.)"},"clinicalReasoning":"Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia Placental malperfusion leads to inadequate blood flow, triggering systemic endothelial dysfunction. Endothelial dysfunction results in hypertension and proteinuria, hallmark signs of preeclampsia.","keyTakeaways":["Recognizing the systemic nature of preeclampsia is essential for timely intervention and management."],"blueprintTopic":"ob-labor-ccs","blueprintSystem":"reproductive-endocrine","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:44:49.032Z","rationaleQualityScore":100}}$s2_42oo$,
  $s2_42no${"options":["Primary CNS vasospasm alone, without placental ischemia or systemic endothelial injury","Gestational diabetes causing visual changes without hypertension","Placental malperfusion causing endothelial dysfunction, hypertension, proteinuria, and organ ischemia","Cortical venous thrombosis as the cause, without focal deficits"],"distractorRationale":{"Primary CNS vasospasm alone, without placental ischemia or systemic endothelial injury":"This fails here because primary CNS vasospasm does not account for the systemic hypertension and proteinuria present in this case. (Preeclampsia is characterized by hypertension and proteinuria due to placental dysfunction, which this option overlooks.)","Gestational diabetes causing visual changes without hypertension":"This fails here as gestational diabetes does not typically cause hypertension or significant proteinuria, both of which are critical in this patient's presentation. (Preeclampsia is defined by the presence of hypertension and proteinuria, which are absent in gestational diabetes.)","Cortical venous thrombosis as the cause, without focal deficits":"This fails here because cortical venous thrombosis usually presents with focal neurological deficits, which this patient does not exhibit. (The systemic signs of preeclampsia, such as hypertension and proteinuria, are not explained by cortical venous thrombosis.)"},"clinicalReasoning":"Placental malperfusion causing endothelial dysfunction, hypertension, proteinuria, and organ ischemia Placental malperfusion leads to inadequate blood flow, triggering systemic endothelial dysfunction. Endothelial dysfunction results in hypertension and proteinuria, hallmark signs of preeclampsia.","keyTakeaways":["Recognizing the systemic nature of preeclampsia is essential for timely intervention and management."],"blueprintTopic":"ob-labor-ccs","blueprintSystem":"reproductive-endocrine","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:44:49.032Z","rationaleQualityScore":100}}$s2_42no$,
  $s2_42oc$Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia$s2_42oc$,
  $s2_42nc$Placental malperfusion causing endothelial dysfunction, hypertension, proteinuria, and organ ischemia$s2_42nc$,
  $s2_42oe$## Why this answer is correct
Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia
• Placental malperfusion leads to inadequate blood flow, triggering systemic endothelial dysfunction.
• Endothelial dysfunction results in hypertension and proteinuria, hallmark signs of preeclampsia.
• End-organ ischemia can occur due to impaired perfusion, evidenced by the patient's symptoms.
**In practice:** This 27-year-old woman at 37 weeks gestation presents with hypertension, proteinuria, and neurological symptoms, all indicative of preeclampsia, which is primarily driven by placental malperfusion.
## Clinical pearl
This 27-year-old woman at 37 weeks gestation presents with hypertension, proteinuria, and neurological symptoms, all indicative of preeclampsia, which is primarily driven by placental malperfusion.
## Why the other options are wrong

**Primary CNS vasospasm without placental or endothelial pathology**
• Trap: Confusing primary CNS issues as the sole cause of symptoms.
• Why it fails here: This fails here because primary CNS vasospasm does not account for the systemic hypertension and proteinuria present in this case.
• Remember: Preeclampsia is characterized by hypertension and proteinuria due to placental dysfunction, which this option overlooks.

**Gestational diabetes causing visual changes without hypertension**
• Trap: Assuming visual changes are solely due to gestational diabetes.
• Why it fails here: This fails here as gestational diabetes does not typically cause hypertension or significant proteinuria, both of which are critical in this patient's presentation.
• Remember: Preeclampsia is defined by the presence of hypertension and proteinuria, which are absent in gestational diabetes.

**Cortical venous thrombosis as most likely without focal deficits**
• Trap: Considering venous thrombosis as a cause of headache and visual changes.
• Why it fails here: This fails here because cortical venous thrombosis usually presents with focal neurological deficits, which this patient does not exhibit.
• Remember: The systemic signs of preeclampsia, such as hypertension and proteinuria, are not explained by cortical venous thrombosis.
## Key takeaway
**Recognizing the systemic nature of preeclampsia is essential for timely intervention and management.**

**Memory hook:** Remember the triad: hypertension, proteinuria, and end-organ dysfunction in preeclampsia.

## Educational objective

Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia

## Clinical reasoning pathway

1. Assess the patient's vital signs: elevated blood pressure (168/104 mmHg) indicates hypertension.
2. Evaluate the neurological symptoms: headache and visual changes suggest possible CNS involvement.
3. Check laboratory findings: proteinuria (3+), low platelets (98,000/mm³), and elevated AST (88 U/L) indicate end-organ dysfunction.
4. Recognize that these findings align with preeclampsia, which is caused by placental malperfusion.
5. Consider the systemic effects of endothelial dysfunction, leading to hypertension and proteinuria.

## Clinical pearl

In preeclampsia, the presence of hypertension and proteinuria is critical for diagnosis, and early recognition can prevent severe maternal and fetal complications.

## High-yield facts

• Preeclampsia typically occurs after 20 weeks of gestation and is characterized by hypertension and proteinuria.
• Endothelial dysfunction in preeclampsia can lead to complications such as HELLP syndrome (hemolysis, elevated liver enzymes, low platelets).
• Management of preeclampsia includes monitoring, antihypertensives, and possible delivery depending on severity.

## Common pitfalls

• Misinterpreting visual changes as solely due to gestational diabetes.
• Overlooking the significance of proteinuria in the context of hypertension.
• Failing to recognize the systemic nature of preeclampsia and attributing symptoms to isolated CNS issues.

## Next step in care

Initiate antihypertensive therapy and consider delivery if the patient's condition worsens or does not stabilize.

## Test-taking tip

Look for key indicators of preeclampsia such as hypertension and proteinuria in the vignette, which often signal the underlying pathophysiology.

## Real-world clinical application

On the wards, be vigilant for signs of preeclampsia in pregnant patients, especially those presenting with headaches, visual changes, or elevated blood pressure.

## Layered depth

**Basic:** Preeclampsia is a pregnancy complication characterized by hypertension and proteinuria.

**Intermediate:** The condition arises from placental malperfusion leading to systemic endothelial dysfunction.

**Advanced:** Recognize that severe cases can progress to eclampsia or HELLP syndrome, necessitating urgent intervention.

## Visual cues

• **Preeclampsia Diagnostic Criteria:** A flowchart outlining the diagnostic criteria for preeclampsia, including hypertension and proteinuria.

## Related topics

• **Step2CK — Preeclampsia:** Preeclampsia is a key topic in obstetrics and internal medicine.
• **Step1 — Endothelial Dysfunction:** Understanding endothelial dysfunction is crucial for pathophysiology.$s2_42oe$,
  $s2_42ne$## Why this answer is correct
Placental malperfusion causing endothelial dysfunction, hypertension, proteinuria, and organ ischemia
• Placental malperfusion leads to inadequate blood flow, triggering systemic endothelial dysfunction.
• Endothelial dysfunction results in hypertension and proteinuria, hallmark signs of preeclampsia.
• End-organ ischemia can occur due to impaired perfusion, evidenced by the patient's symptoms.
**In practice:** This 27-year-old woman at 37 weeks gestation presents with hypertension, proteinuria, and neurological symptoms, all indicative of preeclampsia, which is primarily driven by placental malperfusion.
## Clinical pearl
This 27-year-old woman at 37 weeks gestation presents with hypertension, proteinuria, and neurological symptoms, all indicative of preeclampsia, which is primarily driven by placental malperfusion.
## Why the other options are wrong

**Primary CNS vasospasm alone, without placental ischemia or systemic endothelial injury**
• Trap: Confusing primary CNS issues as the sole cause of symptoms.
• Why it fails here: This fails here because primary CNS vasospasm does not account for the systemic hypertension and proteinuria present in this case.
• Remember: Preeclampsia is characterized by hypertension and proteinuria due to placental dysfunction, which this option overlooks.

**Gestational diabetes causing visual changes without hypertension**
• Trap: Assuming visual changes are solely due to gestational diabetes.
• Why it fails here: This fails here as gestational diabetes does not typically cause hypertension or significant proteinuria, both of which are critical in this patient's presentation.
• Remember: Preeclampsia is defined by the presence of hypertension and proteinuria, which are absent in gestational diabetes.

**Cortical venous thrombosis as the cause, without focal deficits**
• Trap: Considering venous thrombosis as a cause of headache and visual changes.
• Why it fails here: This fails here because cortical venous thrombosis usually presents with focal neurological deficits, which this patient does not exhibit.
• Remember: The systemic signs of preeclampsia, such as hypertension and proteinuria, are not explained by cortical venous thrombosis.
## Key takeaway
**Recognizing the systemic nature of preeclampsia is essential for timely intervention and management.**

**Memory hook:** Remember the triad: hypertension, proteinuria, and end-organ dysfunction in preeclampsia.

## Educational objective

Placental malperfusion causing endothelial dysfunction, hypertension, proteinuria, and organ ischemia

## Clinical reasoning pathway

1. Assess the patient's vital signs: elevated blood pressure (168/104 mmHg) indicates hypertension.
2. Evaluate the neurological symptoms: headache and visual changes suggest possible CNS involvement.
3. Check laboratory findings: proteinuria (3+), low platelets (98,000/mm³), and elevated AST (88 U/L) indicate end-organ dysfunction.
4. Recognize that these findings align with preeclampsia, which is caused by placental malperfusion.
5. Consider the systemic effects of endothelial dysfunction, leading to hypertension and proteinuria.

## Clinical pearl

In preeclampsia, the presence of hypertension and proteinuria is critical for diagnosis, and early recognition can prevent severe maternal and fetal complications.

## High-yield facts

• Preeclampsia typically occurs after 20 weeks of gestation and is characterized by hypertension and proteinuria.
• Endothelial dysfunction in preeclampsia can lead to complications such as HELLP syndrome (hemolysis, elevated liver enzymes, low platelets).
• Management of preeclampsia includes monitoring, antihypertensives, and possible delivery depending on severity.

## Common pitfalls

• Misinterpreting visual changes as solely due to gestational diabetes.
• Overlooking the significance of proteinuria in the context of hypertension.
• Failing to recognize the systemic nature of preeclampsia and attributing symptoms to isolated CNS issues.

## Next step in care

Initiate antihypertensive therapy and consider delivery if the patient's condition worsens or does not stabilize.

## Test-taking tip

Look for key indicators of preeclampsia such as hypertension and proteinuria in the vignette, which often signal the underlying pathophysiology.

## Real-world clinical application

On the wards, be vigilant for signs of preeclampsia in pregnant patients, especially those presenting with headaches, visual changes, or elevated blood pressure.

## Layered depth

**Basic:** Preeclampsia is a pregnancy complication characterized by hypertension and proteinuria.

**Intermediate:** The condition arises from placental malperfusion leading to systemic endothelial dysfunction.

**Advanced:** Recognize that severe cases can progress to eclampsia or HELLP syndrome, necessitating urgent intervention.

## Visual cues

• **Preeclampsia Diagnostic Criteria:** A flowchart outlining the diagnostic criteria for preeclampsia, including hypertension and proteinuria.

## Related topics

• **Step2CK — Preeclampsia:** Preeclampsia is a key topic in obstetrics and internal medicine.
• **Step1 — Endothelial Dysfunction:** Understanding endothelial dysfunction is crucial for pathophysiology.$s2_42ne$,
  109, 64, 101, 86,
  1.703125, 1.174419
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_43id$cmqasnptt001t1ycy3gi05t2s$s2_43id$,
  $s2_43st$usmle-step-3$s2_43st$,
  2,
  $s2_43oo${"options":["Viral lymphocytic pleocytosis with normal CSF glucose","Ruptured berry aneurysm causing xanthochromia without infection","Autoimmune demyelination as acute febrile meningismus","Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein"],"distractorRationale":{"Viral lymphocytic pleocytosis with normal CSF glucose":"In viral meningitis, the CSF typically shows lymphocytic pleocytosis with normal glucose levels, which does not match this patient's findings of low glucose and neutrophilic predominance. (This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia without infection":"However, a ruptured berry aneurysm would present with xanthochromia (yellowish discoloration of CSF due to blood) and not the neutrophilic pleocytosis and low glucose seen in this case. (Understanding the CSF profile is essential for differentiating between hemorrhagic and infectious processes.)","Autoimmune demyelination as acute febrile meningismus":"Autoimmune demyelination typically does not cause significant neutrophilic pleocytosis or low glucose levels in the CSF, which are hallmark signs of bacterial meningitis. (This reinforces the need to recognize specific CSF findings that indicate infection versus autoimmune processes.)"},"clinicalReasoning":"Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein levels. **Bacterial meningitis** is characterized by the presence of **neutrophils** in the cerebrospinal fluid (CSF). In bacterial infections, the **blood-brain barrier** is breached, allowing bacteria to enter the CNS.","keyTakeaways":["When evaluating a patient with fever and meningeal signs, prioritize bacterial meningitis if CSF shows neutrophilic pleocytosis and low glucose."],"blueprintTopic":"post-op-fever","blueprintSystem":"surgery"}$s2_43oo$,
  $s2_43no${"options":["Viral lymphocytic pleocytosis with a normal CSF glucose","Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection","Autoimmune demyelination presenting as acute febrile meningismus","Bacteria cross the blood-brain barrier and cause neutrophilic pleocytosis, low glucose, and high protein"],"distractorRationale":{"Viral lymphocytic pleocytosis with a normal CSF glucose":"In viral meningitis, the CSF typically shows lymphocytic pleocytosis with normal glucose levels, which does not match this patient's findings of low glucose and neutrophilic predominance. (This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.)","Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection":"However, a ruptured berry aneurysm would present with xanthochromia (yellowish discoloration of CSF due to blood) and not the neutrophilic pleocytosis and low glucose seen in this case. (Understanding the CSF profile is essential for differentiating between hemorrhagic and infectious processes.)","Autoimmune demyelination presenting as acute febrile meningismus":"Autoimmune demyelination typically does not cause significant neutrophilic pleocytosis or low glucose levels in the CSF, which are hallmark signs of bacterial meningitis. (This reinforces the need to recognize specific CSF findings that indicate infection versus autoimmune processes.)"},"clinicalReasoning":"Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein levels. **Bacterial meningitis** is characterized by the presence of **neutrophils** in the cerebrospinal fluid (CSF). In bacterial infections, the **blood-brain barrier** is breached, allowing bacteria to enter the CNS.","keyTakeaways":["When evaluating a patient with fever and meningeal signs, prioritize bacterial meningitis if CSF shows neutrophilic pleocytosis and low glucose."],"blueprintTopic":"post-op-fever","blueprintSystem":"surgery"}$s2_43no$,
  $s2_43oc$Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein$s2_43oc$,
  $s2_43nc$Bacteria cross the blood-brain barrier and cause neutrophilic pleocytosis, low glucose, and high protein$s2_43nc$,
  $s2_43oe$## Why this answer is correct
Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein levels.
• **Bacterial meningitis** is characterized by the presence of **neutrophils** in the cerebrospinal fluid (CSF).
• In bacterial infections, the **blood-brain barrier** is breached, allowing bacteria to enter the CNS.
• This results in **low CSF glucose** levels and **elevated protein** due to inflammation and cellular response.
**In practice:** Recognizing these CSF findings is crucial for diagnosing bacterial meningitis, which requires prompt treatment to prevent serious complications.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with normal CSF glucose**
• Trap: Students may confuse viral meningitis with bacterial meningitis due to overlapping symptoms.
• Why it fails here: In viral meningitis, the CSF typically shows lymphocytic pleocytosis with normal glucose levels, which does not match this patient's findings of low glucose and neutrophilic predominance.
• Remember: This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia without infection**
• Trap: This option may seem plausible due to the presence of headache and neck stiffness.
• Why it fails here: However, a ruptured berry aneurysm would present with xanthochromia (yellowish discoloration of CSF due to blood) and not the neutrophilic pleocytosis and low glucose seen in this case.
• Remember: Understanding the CSF profile is essential for differentiating between hemorrhagic and infectious processes.

**Autoimmune demyelination as acute febrile meningismus**
• Trap: Students might think autoimmune conditions can present similarly to infections.
• Why it fails here: Autoimmune demyelination typically does not cause significant neutrophilic pleocytosis or low glucose levels in the CSF, which are hallmark signs of bacterial meningitis.
• Remember: This reinforces the need to recognize specific CSF findings that indicate infection versus autoimmune processes.
## Key takeaway
**When evaluating a patient with fever and meningeal signs, prioritize bacterial meningitis if CSF shows neutrophilic pleocytosis and low glucose.**

**Memory hook:** Remember: In bacterial meningitis, think 'neutrophils and low glucose' for the CSF!$s2_43oe$,
  $s2_43ne$## Why this answer is correct
Pathogenic bacteria crossing the blood-brain barrier leads to neutrophilic pleocytosis, low CSF glucose, and elevated protein levels.
• **Bacterial meningitis** is characterized by the presence of **neutrophils** in the cerebrospinal fluid (CSF).
• In bacterial infections, the **blood-brain barrier** is breached, allowing bacteria to enter the CNS.
• This results in **low CSF glucose** levels and **elevated protein** due to inflammation and cellular response.
**In practice:** Recognizing these CSF findings is crucial for diagnosing bacterial meningitis, which requires prompt treatment to prevent serious complications.
## Why the other options are wrong

**Viral lymphocytic pleocytosis with a normal CSF glucose**
• Trap: Students may confuse viral meningitis with bacterial meningitis due to overlapping symptoms.
• Why it fails here: In viral meningitis, the CSF typically shows lymphocytic pleocytosis with normal glucose levels, which does not match this patient's findings of low glucose and neutrophilic predominance.
• Remember: This highlights the importance of differentiating between viral and bacterial causes of meningitis based on CSF analysis.

**Ruptured berry aneurysm causing xanthochromia and a sudden headache without meningeal infection**
• Trap: This option may seem plausible due to the presence of headache and neck stiffness.
• Why it fails here: However, a ruptured berry aneurysm would present with xanthochromia (yellowish discoloration of CSF due to blood) and not the neutrophilic pleocytosis and low glucose seen in this case.
• Remember: Understanding the CSF profile is essential for differentiating between hemorrhagic and infectious processes.

**Autoimmune demyelination presenting as acute febrile meningismus**
• Trap: Students might think autoimmune conditions can present similarly to infections.
• Why it fails here: Autoimmune demyelination typically does not cause significant neutrophilic pleocytosis or low glucose levels in the CSF, which are hallmark signs of bacterial meningitis.
• Remember: This reinforces the need to recognize specific CSF findings that indicate infection versus autoimmune processes.
## Key takeaway
**When evaluating a patient with fever and meningeal signs, prioritize bacterial meningitis if CSF shows neutrophilic pleocytosis and low glucose.**

**Memory hook:** Remember: In bacterial meningitis, think 'neutrophils and low glucose' for the CSF!$s2_43ne$,
  111, 63, 104, 95,
  1.761905, 1.094737
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_44id$cmr31djye00aljs04bxy0r40b$s2_44id$,
  $s2_44st$usmle-step-3$s2_44st$,
  2,
  $s2_44oo${"options":["30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate","Oral fluids and discharge","MRI brain before fluids","Elective cardiac catheterization"],"distractorRationale":{"Oral fluids and discharge":"This patient is in septic shock, which requires IV fluids for effective resuscitation and cannot be managed with oral fluids. (In septic shock, oral fluids are insufficient and can lead to rapid deterioration.)","MRI brain before fluids":"Imaging is not a priority in septic shock; immediate stabilization with fluids and antibiotics is critical. (In emergencies like septic shock, the focus must be on life-saving interventions, not diagnostics.)","Elective cardiac catheterization":"This patient's presentation is due to septic shock from a urinary tract infection, making cardiac catheterization irrelevant. (Elective procedures are inappropriate in acute scenarios where immediate treatment is necessary.)"},"clinicalReasoning":"Immediate IV crystalloid, blood cultures, and antibiotics are essential in septic shock. **Septic shock** requires rapid intervention to restore hemodynamic stability. Administering **30 mL/kg IV crystalloid** helps to improve blood volume and pressure.","keyTakeaways":["When managing septic shock, prioritize IV fluids, antibiotics, and monitoring to stabilize the patient quickly."],"blueprintTopic":"ccs-initial-workup","blueprintSystem":"ccs"}$s2_44oo$,
  $s2_44no${"options":["30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, and lactate","Oral fluids and discharge home","MRI of the brain before any fluids","Elective cardiac catheterization scheduled before any emergency sepsis resuscitation"],"distractorRationale":{"Oral fluids and discharge home":"This patient is in septic shock, which requires IV fluids for effective resuscitation and cannot be managed with oral fluids. (In septic shock, oral fluids are insufficient and can lead to rapid deterioration.)","MRI of the brain before any fluids":"Imaging is not a priority in septic shock; immediate stabilization with fluids and antibiotics is critical. (In emergencies like septic shock, the focus must be on life-saving interventions, not diagnostics.)","Elective cardiac catheterization scheduled before any emergency sepsis resuscitation":"This patient's presentation is due to septic shock from a urinary tract infection, making cardiac catheterization irrelevant. (Elective procedures are inappropriate in acute scenarios where immediate treatment is necessary.)"},"clinicalReasoning":"Immediate IV crystalloid, blood cultures, and antibiotics are essential in septic shock. **Septic shock** requires rapid intervention to restore hemodynamic stability. Administering **30 mL/kg IV crystalloid** helps to improve blood volume and pressure.","keyTakeaways":["When managing septic shock, prioritize IV fluids, antibiotics, and monitoring to stabilize the patient quickly."],"blueprintTopic":"ccs-initial-workup","blueprintSystem":"ccs"}$s2_44no$,
  $s2_44oc$30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate$s2_44oc$,
  $s2_44nc$30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, and lactate$s2_44nc$,
  $s2_44oe$## Why this answer is correct
Immediate IV crystalloid, blood cultures, and antibiotics are essential in septic shock.
• **Septic shock** requires rapid intervention to restore hemodynamic stability.
• Administering **30 mL/kg IV crystalloid** helps to improve blood volume and pressure.
• Starting **broad-spectrum antibiotics** within 1 hour is crucial to combat infection.
• Monitoring **lactate levels** helps assess the severity of shock and response to treatment.
**In practice:** On the unit, this means prioritizing fluid resuscitation and antibiotic therapy to prevent organ failure and improve patient outcomes.
## Why the other options are wrong



**Oral fluids and discharge**
• Trap: Students may think that mild symptoms can be managed with oral hydration.
• Why it fails here: This patient is in septic shock, which requires IV fluids for effective resuscitation and cannot be managed with oral fluids.
• Remember: In septic shock, oral fluids are insufficient and can lead to rapid deterioration.

**MRI brain before fluids**
• Trap: There may be a belief that imaging is necessary to rule out other conditions before treatment.
• Why it fails here: Imaging is not a priority in septic shock; immediate stabilization with fluids and antibiotics is critical.
• Remember: In emergencies like septic shock, the focus must be on life-saving interventions, not diagnostics.

**Elective cardiac catheterization**
• Trap: Some may confuse the need for cardiac evaluation with the patient's current condition.
• Why it fails here: This patient's presentation is due to septic shock from a urinary tract infection, making cardiac catheterization irrelevant.
• Remember: Elective procedures are inappropriate in acute scenarios where immediate treatment is necessary.
## Key takeaway
**When managing septic shock, prioritize IV fluids, antibiotics, and monitoring to stabilize the patient quickly.**

**Memory hook:** Remember: In septic shock, think 'FLUIDS first' — **F**luid resuscitation, **L**actate monitoring, **U**rgent antibiotics, **I**nfection control, **D**iagnostics can wait, **S**tabilize first.$s2_44oe$,
  $s2_44ne$## Why this answer is correct
Immediate IV crystalloid, blood cultures, and antibiotics are essential in septic shock.
• **Septic shock** requires rapid intervention to restore hemodynamic stability.
• Administering **30 mL/kg IV crystalloid** helps to improve blood volume and pressure.
• Starting **broad-spectrum antibiotics** within 1 hour is crucial to combat infection.
• Monitoring **lactate levels** helps assess the severity of shock and response to treatment.
**In practice:** On the unit, this means prioritizing fluid resuscitation and antibiotic therapy to prevent organ failure and improve patient outcomes.
## Why the other options are wrong



**Oral fluids and discharge home**
• Trap: Students may think that mild symptoms can be managed with oral hydration.
• Why it fails here: This patient is in septic shock, which requires IV fluids for effective resuscitation and cannot be managed with oral fluids.
• Remember: In septic shock, oral fluids are insufficient and can lead to rapid deterioration.

**MRI of the brain before any fluids**
• Trap: There may be a belief that imaging is necessary to rule out other conditions before treatment.
• Why it fails here: Imaging is not a priority in septic shock; immediate stabilization with fluids and antibiotics is critical.
• Remember: In emergencies like septic shock, the focus must be on life-saving interventions, not diagnostics.

**Elective cardiac catheterization scheduled before any emergency sepsis resuscitation**
• Trap: Some may confuse the need for cardiac evaluation with the patient's current condition.
• Why it fails here: This patient's presentation is due to septic shock from a urinary tract infection, making cardiac catheterization irrelevant.
• Remember: Elective procedures are inappropriate in acute scenarios where immediate treatment is necessary.
## Key takeaway
**When managing septic shock, prioritize IV fluids, antibiotics, and monitoring to stabilize the patient quickly.**

**Memory hook:** Remember: In septic shock, think 'FLUIDS first' — **F**luid resuscitation, **L**actate monitoring, **U**rgent antibiotics, **I**nfection control, **D**iagnostics can wait, **S**tabilize first.$s2_44ne$,
  98, 32, 94, 84,
  3.062500, 1.119048
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_45id$cmr4bny3k00b61ykyudwqivun$s2_45id$,
  $s2_45st$usmle-step-3$s2_45st$,
  2,
  $s2_45oo$["Broad-spectrum antibiotics", "Controlled supplemental oxygen titrated to a saturation of 88% to 92%", "Systemic corticosteroids", "CT scan of the chest"]$s2_45oo$,
  $s2_45no$["Broad-spectrum antibiotics before supplemental oxygen", "Controlled oxygen titrated to a saturation of 88% to 92%", "Systemic corticosteroids before oxygen", "CT scan of the chest before oxygen"]$s2_45no$,
  $s2_45oc$Controlled supplemental oxygen titrated to a saturation of 88% to 92%$s2_45oc$,
  $s2_45nc$Controlled oxygen titrated to a saturation of 88% to 92%$s2_45nc$,
  $s2_45oe$Correct answer: B. Controlled supplemental oxygen titrated to a saturation of 88% to 92%. An oxygen saturation of 84% with accessory muscle use is significant hypoxemia that must be corrected first; in COPD, oxygen is titrated to 88% to 92% to avoid worsening hypercapnia. Why the other options are wrong: A. His sputum is unchanged in volume and color and the chest x-ray shows no pneumonia, so there is no indication for antibiotics. C. Systemic corticosteroids are part of exacerbation treatment but act over hours and do not correct the immediate hypoxemia. D. CT adds nothing to initial management and would delay treatment of hypoxemia.$s2_45oe$,
  $s2_45ne$Correct answer: B. Controlled oxygen titrated to a saturation of 88% to 92%. An oxygen saturation of 84% with accessory muscle use is significant hypoxemia that must be corrected first; in COPD, oxygen is titrated to 88% to 92% to avoid worsening hypercapnia. Why the other options are wrong: A. His sputum is unchanged in volume and color and the chest x-ray shows no pneumonia, so there is no indication for antibiotics. C. Systemic corticosteroids before oxygen are part of exacerbation treatment but act over hours and do not correct the immediate hypoxemia. D. CT adds nothing to initial management and would delay treatment of hypoxemia.$s2_45ne$,
  69, 26, 56, 53,
  2.653846, 1.056604
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_46id$cmr4ftejd01yt1ykyt4klux7p$s2_46id$,
  $s2_46st$usmle-step-3$s2_46st$,
  2,
  $s2_46oo$["Ask the patient to complete a living will", "Hold a goals-of-care discussion with her health care proxy about what she would have wanted", "Write a do-not-resuscitate order immediately", "Defer the discussion until she recovers capacity"]$s2_46oo$,
  $s2_46no$["Ask the patient to complete a living will now", "Discuss goals of care with her proxy about what she would have wanted", "Write a do-not-resuscitate order immediately", "Defer the discussion until she recovers decision-making capacity"]$s2_46no$,
  $s2_46oc$Hold a goals-of-care discussion with her health care proxy about what she would have wanted$s2_46oc$,
  $s2_46nc$Discuss goals of care with her proxy about what she would have wanted$s2_46nc$,
  $s2_46oe$Correct answer: B. Hold a goals-of-care discussion with her health care proxy about what she would have wanted. She lacks capacity and has no written directive, so decisions fall to her designated proxy. The first step is a goals-of-care discussion in which the proxy draws on her known values and preferences (substituted judgment) to guide decisions about life-sustaining treatment, including code status. Why the other options are wrong: A. She lacks the capacity to make or record decisions, so she cannot complete a living will now. C. Code status should come out of a discussion of her values with her surrogate, not be imposed without it. D. She has advanced dementia and will not regain capacity, and decisions may be needed soon.$s2_46oe$,
  $s2_46ne$Correct answer: B. Discuss goals of care with her proxy about what she would have wanted. She lacks capacity and has no written directive, so decisions fall to her designated proxy. The first step is a goals-of-care discussion in which the proxy draws on her known values and preferences (substituted judgment) to guide decisions about life-sustaining treatment, including code status. Why the other options are wrong: A. She lacks the capacity to make or record decisions, so she cannot complete a living will now. C. Code status should come out of a discussion of her values with her surrogate, not be imposed without it. D. She has advanced dementia and will not regain capacity, and decisions may be needed soon.$s2_46ne$,
  91, 48, 69, 64,
  1.895833, 1.078125
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_47id$cmr4g0up9022a1ykyb19agdh7$s2_47id$,
  $s2_47st$usmle-step-3$s2_47st$,
  2,
  $s2_47oo$["Single-pill combination of two first-line agents of different classes (eg, an ACE inhibitor and a dihydropyridine calcium channel blocker)", "Lifestyle modification alone with recheck in 6 months", "Beta-blocker monotherapy", "Referral to a hypertension specialist before starting any medication"]$s2_47oo$,
  $s2_47no$["Single-pill combination of two first-line agents from different classes", "Lifestyle modification alone, with a blood pressure recheck in 6 months", "Beta-blocker monotherapy as initial treatment", "Referral to a hypertension specialist before starting any medication"]$s2_47no$,
  $s2_47oc$Single-pill combination of two first-line agents of different classes (eg, an ACE inhibitor and a dihydropyridine calcium channel blocker)$s2_47oc$,
  $s2_47nc$Single-pill combination of two first-line agents from different classes$s2_47nc$,
  $s2_47oe$Correct answer: A. Single-pill combination of two first-line agents of different classes (eg, an ACE inhibitor and a dihydropyridine calcium channel blocker). She has confirmed stage 2 hypertension (≥140/90 mm Hg) without hypertensive emergency. The 2025 AHA/ACC guideline: 'For all adults with stage 2 hypertension, the initiation of antihypertensive drug therapy with 2 first-line agents of different classes in a single-pill, fixed-dose combination is preferred over 2 separate pills'. The goal is <130/80 mm Hg, and lifestyle changes are added. Why the other options are wrong: B. Lifestyle alone is inadequate for stage 2 hypertension. C. Beta-blockers are not first-line without a compelling indication. D. Uncomplicated stage 2 hypertension is started on therapy in primary care.$s2_47oe$,
  $s2_47ne$Correct answer: A. Single-pill combination of two first-line agents from different classes. She has confirmed stage 2 hypertension (≥140/90 mm Hg) without hypertensive emergency. The 2025 AHA/ACC guideline: 'For all adults with stage 2 hypertension, the initiation of antihypertensive drug therapy with 2 first-line agents of different classes in a single-pill, fixed-dose combination is preferred over 2 separate pills'. The goal is <130/80 mm Hg, and lifestyle changes are added. Why the other options are wrong: B. Lifestyle alone is inadequate for stage 2 hypertension. C. Beta-blockers are not first-line without a compelling indication. D. Uncomplicated stage 2 hypertension is started on therapy in primary care.$s2_47ne$,
  138, 68, 71, 71,
  2.029412, 1.000000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_48id$cmr8br7pc00b41ylof91njnqa$s2_48id$,
  $s2_48st$usmle-step-3$s2_48st$,
  2,
  $s2_48oo$["Start metformin at a higher dose", "Start a continuous intravenous insulin infusion while continuing IV fluids with potassium replacement", "Add a second oral hypoglycemic agent", "Oral hydration and discharge home"]$s2_48oo$,
  $s2_48no$["Start metformin at a higher dose", "Start continuous IV insulin and continue IV fluids with potassium replacement", "Add a second oral hypoglycemic agent and discharge the patient home", "Oral hydration and discharge home"]$s2_48no$,
  $s2_48oc$Start a continuous intravenous insulin infusion while continuing IV fluids with potassium replacement$s2_48oc$,
  $s2_48nc$Start continuous IV insulin and continue IV fluids with potassium replacement$s2_48nc$,
  $s2_48oe$Correct answer: B. Start a continuous intravenous insulin infusion while continuing IV fluids with potassium replacement. This is SGLT2-inhibitor-associated DKA (pH 7.15, HCO3- 11, BHB 5.4, anion gap 134 - (98 + 11) = 25) with only modest hyperglycemia. Potassium is 4.5 (>3.5), so insulin can start. Glucose is now 280 mg/dL, so dextrose is not yet needed; 'Once the blood glucose falls below 250 mg/dL (13.9 mmol/L), 5–10% dextrose should be added', and insulin continues until the ketoacidosis resolves. Why the other options are wrong: A. Metformin does not treat ketoacidosis and should be held in a patient with acidosis (pH 7.15) and volume depletion. C. A second oral agent does not treat ketoacidosis; DKA needs an IV insulin infusion. D. Outpatient care is unsafe: pH 7.15, HCO3- 11 mEq/L and ongoing vomiting need IV insulin and fluids in hospital.$s2_48oe$,
  $s2_48ne$Correct answer: B. Start continuous IV insulin and continue IV fluids with potassium replacement. This is SGLT2-inhibitor-associated DKA (pH 7.15, HCO3- 11, BHB 5.4, anion gap 134 - (98 + 11) = 25) with only modest hyperglycemia. Potassium is 4.5 (>3.5), so insulin can start. Glucose is now 280 mg/dL, so dextrose is not yet needed; 'Once the blood glucose falls below 250 mg/dL (13.9 mmol/L), 5–10% dextrose should be added', and insulin continues until the ketoacidosis resolves. Why the other options are wrong: A. Metformin does not treat ketoacidosis and should be held in a patient with acidosis (pH 7.15) and volume depletion. C. A second oral agent does not treat ketoacidosis; DKA needs an IV insulin infusion. D. Outpatient care is unsafe: pH 7.15, HCO3- 11 mEq/L and ongoing vomiting need IV insulin and fluids in hospital.$s2_48ne$,
  101, 36, 77, 67,
  2.805556, 1.149254
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_49id$cmr8e5vko016m1ylofmq6eiaf$s2_49id$,
  $s2_49st$usmle-step-3$s2_49st$,
  2,
  $s2_49oo$["IV antibiotics and percutaneous drainage of the collection, with ERCP if a bile leak is confirmed", "Exploratory laparotomy", "Discharge with oral analgesics", "Repeat abdominal ultrasound in 1 week"]$s2_49oo$,
  $s2_49no$["IV antibiotics and percutaneous drainage, with ERCP if a bile leak is confirmed", "Exploratory laparotomy tonight as the first procedure for the collection", "Discharge home with oral analgesics", "Repeat abdominal ultrasound in 1 week"]$s2_49no$,
  $s2_49oc$IV antibiotics and percutaneous drainage of the collection, with ERCP if a bile leak is confirmed$s2_49oc$,
  $s2_49nc$IV antibiotics and percutaneous drainage, with ERCP if a bile leak is confirmed$s2_49nc$,
  $s2_49oe$Correct answer: A. IV antibiotics and percutaneous drainage of the collection, with ERCP if a bile leak is confirmed. Fever, right upper quadrant pain, vomiting and leukocytosis 2 days after cholecystectomy with a gallbladder-fossa collection indicate a probable bile leak (biloma) or infected collection; in a stable patient without peritonitis this is managed with antibiotics and percutaneous drainage, and a confirmed leak is treated endoscopically. Why the other options are wrong: B. Laparotomy is reserved for peritonitis or instability, neither of which is present; most post-cholecystectomy collections are controlled by percutaneous and endoscopic treatment. C. Discharge ignores fever, leukocytosis and a collection that needs treatment. D. Waiting a week leaves a symptomatic, possibly infected collection undrained.$s2_49oe$,
  $s2_49ne$Correct answer: A. IV antibiotics and percutaneous drainage, with ERCP if a bile leak is confirmed. Fever, right upper quadrant pain, vomiting and leukocytosis 2 days after cholecystectomy with a gallbladder-fossa collection indicate a probable bile leak (biloma) or infected collection; in a stable patient without peritonitis this is managed with antibiotics and percutaneous drainage, and a confirmed leak is treated endoscopically. Why the other options are wrong: B. Laparotomy is reserved for peritonitis or instability, neither of which is present; most post-cholecystectomy collections are controlled by percutaneous and endoscopic treatment. C. Discharge ignores fever, leukocytosis and a collection that needs treatment. D. Waiting a week leaves a symptomatic, possibly infected collection undrained.$s2_49ne$,
  97, 37, 79, 72,
  2.621622, 1.097222
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_50id$cmr8e5wat016v1ylosf5q1qfo$s2_50id$,
  $s2_50st$usmle-step-3$s2_50st$,
  2,
  $s2_50oo$["Oral antibiotics and discharge home", "Start controlled supplemental oxygen and transfer to the emergency department for hospital admission", "CT scan of the chest", "Nebulized bronchodilator alone"]$s2_50oo$,
  $s2_50no$["Oral antibiotics and discharge home", "Start controlled oxygen and transfer to the emergency department for admission", "CT scan of the chest before oxygen", "A nebulized bronchodilator alone, with no supplemental oxygen or hospital transfer"]$s2_50no$,
  $s2_50oc$Start controlled supplemental oxygen and transfer to the emergency department for hospital admission$s2_50oc$,
  $s2_50nc$Start controlled oxygen and transfer to the emergency department for admission$s2_50nc$,
  $s2_50oe$Correct answer: B. Start controlled supplemental oxygen and transfer to the emergency department for hospital admission. Bilateral pneumonia with confusion, tachypnea and hypoxemia in an older patient with COPD is severe enough to require hospitalization; controlled oxygen corrects his hypoxemia while he is transferred for IV antibiotics and monitoring. Why the other options are wrong: A. A confused, hypoxemic patient with bilateral pneumonia cannot be managed safely at home. C. The chest x-ray has already shown the infiltrates, and CT would only delay treatment. D. A bronchodilator alone treats neither the hypoxemia nor the pneumonia.$s2_50oe$,
  $s2_50ne$Correct answer: B. Start controlled oxygen and transfer to the emergency department for admission. Bilateral pneumonia with confusion, tachypnea and hypoxemia in an older patient with COPD is severe enough to require hospitalization; controlled oxygen corrects his hypoxemia while he is transferred for IV antibiotics and monitoring. Why the other options are wrong: A. A confused, hypoxemic patient with bilateral pneumonia cannot be managed safely at home. C. The chest x-ray has already shown the infiltrates, and CT would only delay treatment. D. A bronchodilator alone treats neither the hypoxemia nor the pneumonia.$s2_50ne$,
  100, 35, 78, 82,
  2.857143, 0.951220
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_51id$cmr8e5wdr016w1yloi18qya32$s2_51id$,
  $s2_51st$usmle-step-3$s2_51st$,
  2,
  $s2_51oo$["Confirm the diagnosis with home or ambulatory blood pressure monitoring and begin lifestyle modification", "Start a thiazide diuretic today", "Start a two-drug single-pill combination today", "Reassure her and recheck in 3 years"]$s2_51oo$,
  $s2_51no$["Confirm with home or ambulatory monitoring and begin lifestyle modification", "Start a thiazide diuretic at this visit", "Start a two-drug single-pill combination during this office visit", "Reassure her and recheck the pressure in 3 years"]$s2_51no$,
  $s2_51oc$Confirm the diagnosis with home or ambulatory blood pressure monitoring and begin lifestyle modification$s2_51oc$,
  $s2_51nc$Confirm with home or ambulatory monitoring and begin lifestyle modification$s2_51nc$,
  $s2_51oe$Correct answer: A. Confirm the diagnosis with home or ambulatory blood pressure monitoring and begin lifestyle modification. A single visit is not enough to diagnose hypertension; the 2025 AHA/ACC guideline says 'a single reading is inadequate for clinical decision-making' and that 'it is reasonable to exclude white-coat hypertension using out-of-office BP monitoring for adults with high office BP (ie, SBP/DBP ≥130/80 mm Hg)'. Lifestyle changes (weight loss, DASH diet, sodium reduction, activity) 'are strongly recommended' for all adults with elevated BP. Why the other options are wrong: B. Starting a thiazide today is premature: the diagnosis is not yet confirmed with out-of-office readings, and her office readings (142/92 and 140/90 mm Hg) are below the ≥160/100 mm Hg level at which the guideline advises prompt treatment. C. A two-drug single-pill combination is also premature for the same reasons: hypertension is unconfirmed, and her office BP is below 160/100 mm Hg. D. Office BP ≥130/80 needs confirmation and follow-up, not a 3-year interval.$s2_51oe$,
  $s2_51ne$Correct answer: A. Confirm with home or ambulatory monitoring and begin lifestyle modification. A single visit is not enough to diagnose hypertension; the 2025 AHA/ACC guideline says 'a single reading is inadequate for clinical decision-making' and that 'it is reasonable to exclude white-coat hypertension using out-of-office BP monitoring for adults with high office BP (ie, SBP/DBP ≥130/80 mm Hg)'. Lifestyle changes (weight loss, DASH diet, sodium reduction, activity) 'are strongly recommended' for all adults with elevated BP. Why the other options are wrong: B. Starting a thiazide today is premature: the diagnosis is not yet confirmed with out-of-office readings, and her office readings (142/92 and 140/90 mm Hg) are below the ≥160/100 mm Hg level at which the guideline advises prompt treatment. C. A two-drug single-pill combination is also premature for the same reasons: hypertension is unconfirmed, and her office BP is below 160/100 mm Hg. D. Office BP ≥130/80 needs confirmation and follow-up, not a 3-year interval.$s2_51ne$,
  104, 46, 75, 65,
  2.260870, 1.153846
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_52id$cmr8g794001q51ylokr7o2c50$s2_52id$,
  $s2_52st$usmle-step-3$s2_52st$,
  2,
  $s2_52oo${"kind": "vignette", "options": ["Oxygen titrated to 93-95%, repeated inhaled albuterol, inhaled ipratropium, and prednisone 40-50 mg", "Nebulized albuterol alone", "Oral prednisone alone", "Intubate now", "Discharge on the current rescue inhaler"], "stepLevel": "step3", "physicianTask": "interpretation", "blueprintTopic": "emergency-acls", "generationMeta": {"model": "gpt-4o-mini", "batchId": "usmle-gap-usmle-step-3-1783295305274", "qcScore": 8.1, "slotIndex": 1, "stepLevel": "step3", "examNumber": 9320, "generatedAt": "2026-07-05T23:49:20.208Z", "pipelineVersion": "gpt-4o-mini-usmle-full-exam-v1"}, "blueprintSystem": "pharm-advertising", "clinicalReasoning": "The patient’s symptoms indicate an acute asthma attack. The best immediate management is to provide nebulized albuterol to relieve bronchospasm and improve oxygenation.", "distractorRationale": {"Intubate now": "Intubation is for failure of this treatment or a silent chest, drowsiness, or confusion. It is not the first step while the patient is still moving air.", "Oral prednisone alone": "Prednisone 40-50 mg is part of treatment. It does not replace oxygen, repeated albuterol, or ipratropium.", "Nebulized albuterol alone": "A short-acting beta agonist is part of treatment. GINA 2025 also gives oxygen, inhaled ipratropium, and a systemic corticosteroid immediately for a severe exacerbation.", "Discharge on the current rescue inhaler": "Peak flow at half of personal best, hypoxia, a respiratory rate of 28, or accessory-muscle use is a severe exacerbation. Discharge on the home inhaler does not treat it."}}$s2_52oo$,
  $s2_52no${"kind": "vignette", "options": ["Oxygen to 93-95%, repeated albuterol, ipratropium, and prednisone 40-50 mg", "Repeated nebulized albuterol treatment without a steroid or ipratropium", "Oral prednisone without bronchodilators", "Endotracheal intubation at this moment", "Discharge on the current rescue inhaler"], "stepLevel": "step3", "physicianTask": "interpretation", "blueprintTopic": "emergency-acls", "generationMeta": {"model": "gpt-4o-mini", "batchId": "usmle-gap-usmle-step-3-1783295305274", "qcScore": 8.1, "slotIndex": 1, "stepLevel": "step3", "examNumber": 9320, "generatedAt": "2026-07-05T23:49:20.208Z", "pipelineVersion": "gpt-4o-mini-usmle-full-exam-v1"}, "blueprintSystem": "pharm-advertising", "clinicalReasoning": "The patient’s symptoms indicate an acute asthma attack. The best immediate management is to provide nebulized albuterol to relieve bronchospasm and improve oxygenation.", "distractorRationale": {"Endotracheal intubation at this moment": "Intubation is for failure of this treatment or a silent chest, drowsiness, or confusion. It is not the first step while the patient is still moving air.", "Oral prednisone without bronchodilators": "Prednisone 40-50 mg is part of treatment. It does not replace oxygen, repeated albuterol, or ipratropium.", "Repeated nebulized albuterol treatment without a steroid or ipratropium": "A short-acting beta agonist is part of treatment. GINA 2025 also gives oxygen, inhaled ipratropium, and a systemic corticosteroid immediately for a severe exacerbation.", "Discharge on the current rescue inhaler": "Peak flow at half of personal best, hypoxia, a respiratory rate of 28, or accessory-muscle use is a severe exacerbation. Discharge on the home inhaler does not treat it."}}$s2_52no$,
  $s2_52oc$Oxygen titrated to 93-95%, repeated inhaled albuterol, inhaled ipratropium, and prednisone 40-50 mg$s2_52oc$,
  $s2_52nc$Oxygen to 93-95%, repeated albuterol, ipratropium, and prednisone 40-50 mg$s2_52nc$,
  $s2_52oe$This is a severe asthma exacerbation: respiratory rate 28, saturation 88% on room air, and peak flow 50% of personal best after smoke exposure. GINA 2025 says to give oxygen, repeated inhaled albuterol, inhaled ipratropium, and a systemic corticosteroid immediately. Adult oxygen is titrated to 93-95%. Prednisone or prednisolone is 40-50 mg daily for 5-7 days.

Albuterol alone, prednisone alone, and discharge each leave out part of that treatment. Intubation is not the first step while he is still moving air.

Source: GINA summary guide 2025. https://ginasthma.org/wp-content/uploads/2025/11/GINA-Summary-Guide-2025-WEB_FINAL-WMS.pdf$s2_52oe$,
  $s2_52ne$This is a severe asthma exacerbation: respiratory rate 28, saturation 88% on room air, and peak flow 50% of personal best after smoke exposure. GINA 2025 says to give oxygen, repeated inhaled albuterol, inhaled ipratropium, and a systemic corticosteroid immediately. Adult oxygen is titrated to 93-95%. Prednisone or prednisolone is 40-50 mg daily for 5-7 days.

Albuterol alone, prednisone alone, and discharge each leave out part of that treatment. Intubation is not the first step while he is still moving air.

Source: GINA summary guide 2025. https://ginasthma.org/wp-content/uploads/2025/11/GINA-Summary-Guide-2025-WEB_FINAL-WMS.pdf$s2_52ne$,
  99, 39, 74, 71,
  2.538462, 1.042254
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_53id$cmr8hrv2l024n1yloznxxd1wn$s2_53id$,
  $s2_53st$usmle-step-3$s2_53st$,
  2,
  $s2_53oo$["Intravenous balanced crystalloid, about 2 L (30 mL/kg) within 3 hours, with frequent reassessment", "Intravenous furosemide", "CT scan of the chest", "Dobutamine infusion"]$s2_53oo$,
  $s2_53no$["Balanced crystalloid, about 30 mL/kg within 3 hours, with frequent reassessment", "Intravenous furosemide for the lactate elevation", "CT scan of the chest before more fluid", "A dobutamine infusion aimed at this hyperdynamic left ventricle now"]$s2_53no$,
  $s2_53oc$Intravenous balanced crystalloid, about 2 L (30 mL/kg) within 3 hours, with frequent reassessment$s2_53oc$,
  $s2_53nc$Balanced crystalloid, about 30 mL/kg within 3 hours, with frequent reassessment$s2_53nc$,
  $s2_53oe$Correct answer: A. Intravenous balanced crystalloid, about 2 L (30 mL/kg) within 3 hours, with frequent reassessment. She has septic shock from pneumonia (fever, hypotension, lactate 4.2 mmol/L, warm extremities, flat neck veins, hyperdynamic LV). Cultures and antibiotics are already done. Surviving Sepsis 2026 suggests 'at least 30 mL/kg of IV crystalloid in the first 3 hr' for sepsis-induced hypoperfusion (30 x 70 kg = 2,100 mL). Norepinephrine is added if hypotension persists (SSC 2026 suggests an initial MAP range of 60-65 mm Hg for patients aged 65 or older, and allows starting it alongside fluids, case by case, in unstable shock). Why the other options are wrong: B. Furosemide would worsen hypovolemic, distributive shock; there is no volume overload (flat JVP, focal rather than diffuse infiltrate). C. CT delays resuscitation in an unstable patient and the x-ray already shows the source. D. Dobutamine is an inotrope for low-output cardiogenic shock; the LV is hyperdynamic, and dobutamine can worsen hypotension.$s2_53oe$,
  $s2_53ne$Correct answer: A. Balanced crystalloid, about 30 mL/kg within 3 hours, with frequent reassessment. She has septic shock from pneumonia (fever, hypotension, lactate 4.2 mmol/L, warm extremities, flat neck veins, hyperdynamic LV). Cultures and antibiotics are already done. Surviving Sepsis 2026 suggests 'at least 30 mL/kg of IV crystalloid in the first 3 hr' for sepsis-induced hypoperfusion (30 x 70 kg = 2,100 mL). Norepinephrine is added if hypotension persists (SSC 2026 suggests an initial MAP range of 60-65 mm Hg for patients aged 65 or older, and allows starting it alongside fluids, case by case, in unstable shock). Why the other options are wrong: B. Furosemide would worsen hypovolemic, distributive shock; there is no volume overload (flat JVP, focal rather than diffuse infiltrate). C. CT delays resuscitation in an unstable patient and the x-ray already shows the source. D. Dobutamine is an inotrope for low-output cardiogenic shock; the LV is hyperdynamic, and dobutamine can worsen hypotension.$s2_53ne$,
  97, 22, 79, 67,
  4.409091, 1.179104
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_54id$cmr8ie5jt029v1yloaiph46j7$s2_54id$,
  $s2_54st$usmle-step-3$s2_54st$,
  2,
  $s2_54oo${"options":["Uterine atony","Retained placental tissue","Coagulation disorder","Endometritis"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause bleeding, it is less likely to present acutely in the first two weeks postpartum without prior signs of retained products.","Coagulation disorder":"Coagulation disorders would typically present with more generalized bleeding rather than localized heavy bleeding and clots.","Endometritis":"Endometritis typically presents later with fever and uterine tenderness, not immediately after delivery."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and vital signs indicating hypovolemic shock. Analyze the timing and characteristics of the bleeding to differentiate between uterine atony and other causes. Integrate the clinical findings to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783298714274","examNumber":9326,"slotIndex":5,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T00:47:14.180Z"}}$s2_54oo$,
  $s2_54no${"options":["Uterine atony","Retained placental tissue","Maternal coagulation disorder","Endometritis"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause bleeding, it is less likely to present acutely in the first two weeks postpartum without prior signs of retained products.","Maternal coagulation disorder":"Maternal coagulation disorders would typically present with more generalized bleeding rather than localized heavy bleeding and clots.","Endometritis":"Endometritis typically presents later with fever and uterine tenderness, not immediately after delivery."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and vital signs indicating hypovolemic shock. Analyze the timing and characteristics of the bleeding to differentiate between uterine atony and other causes. Integrate the clinical findings to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783298714274","examNumber":9326,"slotIndex":5,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T00:47:14.180Z"}}$s2_54no$,
  $s2_54oc$Retained placental tissue$s2_54oc$,
  $s2_54nc$Retained placental tissue$s2_54nc$,
  $s2_54oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_54oe$,
  $s2_54ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_54ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_55id$cmr8ie84s02al1ylolxh8hfon$s2_55id$,
  $s2_55st$usmle-step-3$s2_55st$,
  2,
  $s2_55oo${"options":["Uterine atony","Retained placental tissue","Endometritis","Vaginal laceration"],"distractorRationale":{"Retained placental tissue":"This condition typically presents later with different symptoms, such as fever and foul-smelling discharge.","Endometritis":"This is characterized by fever and uterine tenderness rather than acute hemorrhage.","Vaginal laceration":"While this can cause bleeding, it is less likely to cause significant hypotension compared to uterine atony."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and vital signs indicating hypovolemia. Analyze the timing and potential causes of postpartum hemorrhage. Integrate knowledge of common postpartum complications to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783298714274","examNumber":9326,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-06T00:51:48.653Z"}}$s2_55oo$,
  $s2_55no${"options":["Uterine atony","Retained placental tissue","Endometritis","High vaginal sidewall laceration"],"distractorRationale":{"Retained placental tissue":"This condition typically presents later with different symptoms, such as fever and foul-smelling discharge.","Endometritis":"This is characterized by fever and uterine tenderness rather than acute hemorrhage.","High vaginal sidewall laceration":"While this can cause bleeding, it is less likely to cause significant hypotension compared to uterine atony."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and vital signs indicating hypovolemia. Analyze the timing and potential causes of postpartum hemorrhage. Integrate knowledge of common postpartum complications to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783298714274","examNumber":9326,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-06T00:51:48.653Z"}}$s2_55no$,
  $s2_55oc$Retained placental tissue$s2_55oc$,
  $s2_55nc$Retained placental tissue$s2_55nc$,
  $s2_55oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_55oe$,
  $s2_55ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_55ne$,
  25, 18, 25, 32,
  1.388889, 0.781250
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_56id$cmr8mlt4p00mr1ygie3vkinga$s2_56id$,
  $s2_56st$usmle-step-3$s2_56st$,
  2,
  $s2_56oo${"options":["Uterine atony","Retained placental tissue","Coagulation disorder","Infection"],"distractorRationale":{"Retained placental tissue":"This condition usually causes delayed bleeding and may not present with acute hypotension.","Coagulation disorder":"While it can cause bleeding, the acute presentation and vital signs suggest uterine atony is more likely.","Infection":"Infection would typically present with fever and systemic signs rather than acute hypotension and heavy bleeding."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and hypotension to identify the most likely cause. Analyze the timing and clinical context, which points towards uterine atony as the primary issue. Integrate knowledge of postpartum complications to conclude that uterine atony is the most common cause of early postpartum hemorrhage.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":9,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T02:47:23.847Z"}}$s2_56oo$,
  $s2_56no${"options":["Uterine atony","Retained placental tissue","Maternal coagulation disorder","Postpartum infection"],"distractorRationale":{"Retained placental tissue":"This condition usually causes delayed bleeding and may not present with acute hypotension.","Maternal coagulation disorder":"While it can cause bleeding, the acute presentation and vital signs suggest uterine atony is more likely.","Postpartum infection":"Postpartum infection would typically present with fever and systemic signs rather than acute hypotension and heavy bleeding."},"clinicalReasoning":"Assess the patient's presentation of heavy bleeding and hypotension to identify the most likely cause. Analyze the timing and clinical context, which points towards uterine atony as the primary issue. Integrate knowledge of postpartum complications to conclude that uterine atony is the most common cause of early postpartum hemorrhage.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":9,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T02:47:23.847Z"}}$s2_56no$,
  $s2_56oc$Retained placental tissue$s2_56oc$,
  $s2_56nc$Retained placental tissue$s2_56nc$,
  $s2_56oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_56oe$,
  $s2_56ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_56ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_57id$cmr8mltld00mx1ygigxhk7mmt$s2_57id$,
  $s2_57st$usmle-step-3$s2_57st$,
  2,
  $s2_57oo${"options":["Uterine atony","Retained placental tissue","Coagulation disorder","Uterine rupture"],"distractorRationale":{"Retained placental tissue":"This condition typically presents with prolonged bleeding after delivery, often accompanied by other signs such as foul-smelling discharge, which are not present in this case.","Coagulation disorder":"While this could lead to bleeding, the patient's normal platelet count and lack of history suggest this is not the underlying issue.","Uterine rupture":"This serious condition would present with acute pain and signs of peritoneal irritation, which are not observed in this patient."},"clinicalReasoning":"Assess the patient's symptoms and vital signs to identify the most likely cause of her postpartum hemorrhage. Analyze the clinical presentation, including the timing of the bleeding and the patient's hemodynamic status. Integrate the knowledge of common postpartum complications to arrive at the diagnosis of uterine atony.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":15,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T02:48:15.263Z"}}$s2_57oo$,
  $s2_57no${"options":["Uterine atony","Retained placental tissue","Maternal coagulation disorder","Uterine rupture"],"distractorRationale":{"Retained placental tissue":"This condition typically presents with prolonged bleeding after delivery, often accompanied by other signs such as foul-smelling discharge, which are not present in this case.","Maternal coagulation disorder":"While this could lead to bleeding, the patient's normal platelet count and lack of history suggest this is not the underlying issue.","Uterine rupture":"This serious condition would present with acute pain and signs of peritoneal irritation, which are not observed in this patient."},"clinicalReasoning":"Assess the patient's symptoms and vital signs to identify the most likely cause of her postpartum hemorrhage. Analyze the clinical presentation, including the timing of the bleeding and the patient's hemodynamic status. Integrate the knowledge of common postpartum complications to arrive at the diagnosis of uterine atony.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":15,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T02:48:15.263Z"}}$s2_57no$,
  $s2_57oc$Retained placental tissue$s2_57oc$,
  $s2_57nc$Retained placental tissue$s2_57nc$,
  $s2_57oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_57oe$,
  $s2_57ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_57ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_58id$cmr8quyg501pv1ygil5gqi87p$s2_58id$,
  $s2_58st$usmle-step-3$s2_58st$,
  2,
  $s2_58oo${"options":["Uterine atony","Retained placental tissue","Vaginal laceration","Coagulation disorder"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause postpartum hemorrhage, the firm and contracted uterus suggests that uterine atony is the primary issue.","Vaginal laceration":"This would typically present with localized pain and may not explain the significant hypotension and pallor observed in this patient.","Coagulation disorder":"Although a coagulation disorder could lead to bleeding, the acute presentation and normal platelet count make this diagnosis less likely."},"clinicalReasoning":"Assess the patient's vital signs and clinical presentation to identify the most likely cause of postpartum hemorrhage. Analyze the examination findings, particularly the firmness of the uterus, and integrate this with common causes of postpartum bleeding to arrive at the diagnosis of uterine atony.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312868949","examNumber":9320,"slotIndex":21,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:47:36.573Z"}}$s2_58oo$,
  $s2_58no${"options":["Uterine atony","Retained placental tissue","High vaginal laceration","Maternal coagulation disorder"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause postpartum hemorrhage, the firm and contracted uterus suggests that uterine atony is the primary issue.","High vaginal laceration":"This would typically present with localized pain and may not explain the significant hypotension and pallor observed in this patient.","Maternal coagulation disorder":"Although a coagulation disorder could lead to bleeding, the acute presentation and normal platelet count make this diagnosis less likely."},"clinicalReasoning":"Assess the patient's vital signs and clinical presentation to identify the most likely cause of postpartum hemorrhage. Analyze the examination findings, particularly the firmness of the uterus, and integrate this with common causes of postpartum bleeding to arrive at the diagnosis of uterine atony.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312868949","examNumber":9320,"slotIndex":21,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:47:36.573Z"}}$s2_58no$,
  $s2_58oc$Retained placental tissue$s2_58oc$,
  $s2_58nc$Retained placental tissue$s2_58nc$,
  $s2_58oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_58oe$,
  $s2_58ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_58ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_59id$cmr8qv0qv01qo1ygi5ig67gks$s2_59id$,
  $s2_59st$usmle-step-3$s2_59st$,
  2,
  $s2_59oo${"options":["Uterine atony","Retained placental tissue","Uterine rupture","Coagulation disorder"],"distractorRationale":{"Retained placental tissue":"This could cause bleeding, but the acute presentation and uterine findings suggest atony is more likely.","Uterine rupture":"Less common and typically presents with severe abdominal pain and signs of peritoneal irritation.","Coagulation disorder":"Would lead to more generalized bleeding rather than localized uterine bleeding."},"clinicalReasoning":"Assess the patient's signs and symptoms, analyze the clinical presentation, and integrate knowledge of postpartum complications to determine that uterine atony is the most likely diagnosis given the context of heavy bleeding and uterine findings.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312868949","examNumber":9320,"slotIndex":53,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:52:21.569Z"}}$s2_59oo$,
  $s2_59no${"options":["Uterine atony","Retained placental tissue","Uterine rupture","Maternal coagulation disorder"],"distractorRationale":{"Retained placental tissue":"This could cause bleeding, but the acute presentation and uterine findings suggest atony is more likely.","Uterine rupture":"Less common and typically presents with severe abdominal pain and signs of peritoneal irritation.","Maternal coagulation disorder":"Would lead to more generalized bleeding rather than localized uterine bleeding."},"clinicalReasoning":"Assess the patient's signs and symptoms, analyze the clinical presentation, and integrate knowledge of postpartum complications to determine that uterine atony is the most likely diagnosis given the context of heavy bleeding and uterine findings.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312868949","examNumber":9320,"slotIndex":53,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:52:21.569Z"}}$s2_59no$,
  $s2_59oc$Retained placental tissue$s2_59oc$,
  $s2_59nc$Retained placental tissue$s2_59nc$,
  $s2_59oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_59oe$,
  $s2_59ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_59ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_60id$cmr98602p00de1ywyyk62gz1l$s2_60id$,
  $s2_60st$usmle-step-3$s2_60st$,
  2,
  $s2_60oo$["Intravenous vitamin K alone", "Four-factor prothrombin complex concentrate plus intravenous vitamin K", "Platelet transfusion", "Protamine sulfate"]$s2_60oo$,
  $s2_60no$["Intravenous vitamin K alone, without clotting-factor replacement", "Four-factor prothrombin complex concentrate plus intravenous vitamin K", "Platelet transfusion for the hematoma", "Protamine sulfate for warfarin reversal"]$s2_60no$,
  $s2_60oc$Four-factor prothrombin complex concentrate plus intravenous vitamin K$s2_60oc$,
  $s2_60nc$Four-factor prothrombin complex concentrate plus intravenous vitamin K$s2_60nc$,
  $s2_60oe$Correct answer: B. Four-factor prothrombin complex concentrate plus intravenous vitamin K. This is a warfarin-associated traumatic intracranial hemorrhage (INR 3.1). Emergency reversal limits hematoma expansion, and the European trauma-bleeding guideline recommends 'the early use of both PCC and 5-10 mg i.v. phytomenadione (vitamin K1)'. PCC corrects the INR within minutes, and vitamin K sustains the correction after PCC wears off. A 6-mm SDH without shift does not meet surgical criteria (>10 mm or shift >5 mm), so the immediate priority is reversal plus neurosurgical observation. Why the other options are wrong: A. Vitamin K alone takes 12-24 hours to restore clotting factors, which is too slow for intracranial bleeding. C. The platelet count is normal and she takes no antiplatelet agent, so platelets do not address the coagulopathy. D. Protamine reverses heparin, not warfarin.$s2_60oe$,
  $s2_60ne$Correct answer: B. Four-factor prothrombin complex concentrate plus intravenous vitamin K. This is a warfarin-associated traumatic intracranial hemorrhage (INR 3.1). Emergency reversal limits hematoma expansion, and the European trauma-bleeding guideline recommends 'the early use of both PCC and 5-10 mg i.v. phytomenadione (vitamin K1)'. PCC corrects the INR within minutes, and vitamin K sustains the correction after PCC wears off. A 6-mm SDH without shift does not meet surgical criteria (>10 mm or shift >5 mm), so the immediate priority is reversal plus neurosurgical observation. Why the other options are wrong: A. Vitamin K alone takes 12-24 hours to restore clotting factors, which is too slow for intracranial bleeding. C. The platelet count is normal and she takes no antiplatelet agent, so platelets do not address the coagulopathy. D. Protamine reverses heparin, not warfarin.$s2_60ne$,
  70, 27, 70, 64,
  2.592593, 1.093750
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_61id$cmr996io400qu1ywyub9s2kn0$s2_61id$,
  $s2_61st$usmle-step-3$s2_61st$,
  2,
  $s2_61oo$["Stop lithium and hydrochlorothiazide, give intravenous isotonic fluids and repeat lithium levels", "Start haloperidol for agitation", "Arrange urgent hemodialysis", "Continue lithium at a lower dose and discharge"]$s2_61oo$,
  $s2_61no$["Stop lithium and hydrochlorothiazide, give isotonic fluids, and repeat the lithium level", "Start haloperidol for the unsteadiness", "Arrange urgent hemodialysis for this level", "Continue lithium at a reduced outpatient dose and discharge home the same day"]$s2_61no$,
  $s2_61oc$Stop lithium and hydrochlorothiazide, give intravenous isotonic fluids and repeat lithium levels$s2_61oc$,
  $s2_61nc$Stop lithium and hydrochlorothiazide, give isotonic fluids, and repeat the lithium level$s2_61nc$,
  $s2_61oe$Correct answer: A. Stop lithium and hydrochlorothiazide, give intravenous isotonic fluids and repeat lithium levels. Thiazide diuretics increase lithium reabsorption, so starting hydrochlorothiazide raised her lithium level to 1.9 mEq/L with tremor, GI upset and ataxia (lithium toxicity); treatment is to stop lithium and the thiazide, restore volume with IV isotonic fluids and follow serial levels, reserving extracorporeal treatment for severe toxicity. Why the other options are wrong: B. She is not agitated, and adding an antipsychotic does not treat lithium toxicity. C. She is alert with normal kidney function and a normal ECG, so she does not meet the usual criteria for extracorporeal treatment; supportive care comes first. D. Her symptoms and level indicate toxicity; lithium must be held and she needs monitoring with repeat levels.$s2_61oe$,
  $s2_61ne$Correct answer: A. Stop lithium and hydrochlorothiazide, give isotonic fluids, and repeat the lithium level. Thiazide diuretics increase lithium reabsorption, so starting hydrochlorothiazide raised her lithium level to 1.9 mEq/L with tremor, GI upset and ataxia (lithium toxicity); treatment is to stop lithium and the thiazide, restore volume with IV isotonic fluids and follow serial levels, reserving extracorporeal treatment for severe toxicity. Why the other options are wrong: B. She is not agitated, and adding an antipsychotic does not treat lithium toxicity. C. She is alert with normal kidney function and a normal ECG, so she does not meet the usual criteria for extracorporeal treatment; supportive care comes first. D. Her symptoms and level indicate toxicity; lithium must be held and she needs monitoring with repeat levels.$s2_61ne$,
  96, 46, 88, 77,
  2.086957, 1.142857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_62id$cmr99ij4a00ui1ywyo96w27zq$s2_62id$,
  $s2_62st$usmle-step-3$s2_62st$,
  2,
  $s2_62oo$["Biopsy of the enlarged paratracheal node by endobronchial ultrasound-guided needle aspiration", "Start chemotherapy", "Repeat CT in 6 months", "Sputum cytology"]$s2_62oo$,
  $s2_62no$["Endobronchial ultrasound-guided needle aspiration of the enlarged paratracheal node", "Start systemic chemotherapy now, before obtaining any tissue diagnosis", "Repeat CT of the chest in 6 months", "Sputum cytology as the staging test"]$s2_62no$,
  $s2_62oc$Biopsy of the enlarged paratracheal node by endobronchial ultrasound-guided needle aspiration$s2_62oc$,
  $s2_62nc$Endobronchial ultrasound-guided needle aspiration of the enlarged paratracheal node$s2_62nc$,
  $s2_62oe$Correct answer: A. Biopsy of the enlarged paratracheal node by endobronchial ultrasound-guided needle aspiration. A hilar mass with an enlarged paratracheal node in a heavy smoker with weight loss is suspected lung cancer. CT of the chest, liver, adrenals and lower neck has been done, and the enlarged node is sampled in preference to the primary because it gives both the diagnosis and the nodal stage with the least risk; EBUS-guided needle aspiration is used for paratracheal lesions. Why the other options are wrong: B. Treatment is not started without a tissue diagnosis and stage. C. A hilar mass with weight loss in a heavy smoker needs a diagnosis now. D. Sputum cytology is used only in people who cannot tolerate or decline invasive tests, and he is fit.$s2_62oe$,
  $s2_62ne$Correct answer: A. Endobronchial ultrasound-guided needle aspiration of the enlarged paratracheal node. A hilar mass with an enlarged paratracheal node in a heavy smoker with weight loss is suspected lung cancer. CT of the chest, liver, adrenals and lower neck has been done, and the enlarged node is sampled in preference to the primary because it gives both the diagnosis and the nodal stage with the least risk; EBUS-guided needle aspiration is used for paratracheal lesions. Why the other options are wrong: B. Treatment is not started without a tissue diagnosis and stage. C. A hilar mass with weight loss in a heavy smoker needs a diagnosis now. D. Sputum cytology as the staging test is used only in people who cannot tolerate or decline invasive tests, and he is fit.$s2_62ne$,
  93, 21, 83, 70,
  4.428571, 1.185714
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_63id$cmr9b2cxo01a91ywy6hrnwllf$s2_63id$,
  $s2_63st$usmle-step-3$s2_63st$,
  2,
  $s2_63oo${"options":["Uterine atony","Retained placental tissue","Coagulation disorder","Infection"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause postpartum hemorrhage, it typically presents later than 10 days postpartum and is often associated with additional symptoms such as foul-smelling discharge.","Coagulation disorder":"Coagulation disorders usually present with bleeding issues during pregnancy or after delivery but are less common than uterine atony as a cause of acute postpartum hemorrhage.","Infection":"Infection can lead to postpartum complications but is less likely to be the immediate cause of heavy bleeding in this scenario, especially without signs of systemic infection."},"clinicalReasoning":"Assess the patient's vital signs and hemoglobin level to determine the severity of bleeding. Analyze the clinical presentation, which is consistent with uterine atony, the most common cause of early postpartum hemorrhage. Integrate this knowledge to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783347145768","examNumber":9315,"slotIndex":12,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T14:14:18.668Z"}}$s2_63oo$,
  $s2_63no${"options":["Uterine atony","Retained placental tissue","Maternal coagulation disorder","Postpartum infection"],"distractorRationale":{"Retained placental tissue":"While retained placental tissue can cause postpartum hemorrhage, it typically presents later than 10 days postpartum and is often associated with additional symptoms such as foul-smelling discharge.","Maternal coagulation disorder":"Maternal coagulation disorders usually present with bleeding issues during pregnancy or after delivery but are less common than uterine atony as a cause of acute postpartum hemorrhage.","Postpartum infection":"Postpartum infection can lead to postpartum complications but is less likely to be the immediate cause of heavy bleeding in this scenario, especially without signs of systemic infection."},"clinicalReasoning":"Assess the patient's vital signs and hemoglobin level to determine the severity of bleeding. Analyze the clinical presentation, which is consistent with uterine atony, the most common cause of early postpartum hemorrhage. Integrate this knowledge to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783347145768","examNumber":9315,"slotIndex":12,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T14:14:18.668Z"}}$s2_63no$,
  $s2_63oc$Retained placental tissue$s2_63oc$,
  $s2_63nc$Retained placental tissue$s2_63nc$,
  $s2_63oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_63oe$,
  $s2_63ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_63ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_64id$cmr9b2fsa01b81ywy1pdhfm45$s2_64id$,
  $s2_64st$usmle-step-3$s2_64st$,
  2,
  $s2_64oo$["Explain that diet-controlled gestational diabetes alone is not an indication for cesarean and continue to monitor labor progress", "Perform a cesarean delivery because of the gestational diabetes", "Start oxytocin to shorten labor", "Advise an elective cesarean at her next pregnancy"]$s2_64oo$,
  $s2_64no$["Diet-controlled gestational diabetes alone is not a cesarean indication; continue monitoring labor", "Perform a cesarean delivery during this labor solely because of gestational diabetes", "Start oxytocin now to shorten labor", "Advise an elective cesarean at her next pregnancy"]$s2_64no$,
  $s2_64oc$Explain that diet-controlled gestational diabetes alone is not an indication for cesarean and continue to monitor labor progress$s2_64oc$,
  $s2_64nc$Diet-controlled gestational diabetes alone is not a cesarean indication; continue monitoring labor$s2_64nc$,
  $s2_64oe$Correct answer: A. Explain that diet-controlled gestational diabetes alone is not an indication for cesarean and continue to monitor labor progress. Most women with gestational diabetes can have a vaginal birth; cesarean is discussed when the fetus is thought too large for safe vaginal delivery, which an estimated fetal weight of 3,500 g does not suggest. She is in normal spontaneous labor, so labor should continue with routine monitoring. Why the other options are wrong: B. Gestational diabetes alone does not require cesarean; cesarean is discussed when the fetus is suspected to be macrosomic, which it is not. C. She is in spontaneous labor with regular contractions and no arrest of progress, so augmentation is not indicated. D. Her diabetes and a normal-weight fetus do not justify planning a cesarean in a future pregnancy.$s2_64oe$,
  $s2_64ne$Correct answer: A. Diet-controlled gestational diabetes alone is not a cesarean indication; continue monitoring labor. Most women with gestational diabetes can have a vaginal birth; cesarean is discussed when the fetus is thought too large for safe vaginal delivery, which an estimated fetal weight of 3,500 g does not suggest. She is in normal spontaneous labor, so labor should continue with routine monitoring. Why the other options are wrong: B. Gestational diabetes alone does not require cesarean; cesarean is discussed when the fetus is suspected to be macrosomic, which it is not. C. She is in spontaneous labor with regular contractions and no arrest of progress, so augmentation is not indicated. D. Her diabetes and a normal-weight fetus do not justify planning a cesarean in a future pregnancy.$s2_64ne$,
  128, 63, 98, 84,
  2.031746, 1.166667
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_65id$cmru32ne4004k1y7w5aklg504$s2_65id$,
  $s2_65st$usmle-step-3$s2_65st$,
  2,
  $s2_65oo$["Request a formal psychiatric evaluation before accepting her decision", "Ask her to explain in her own words her understanding of her condition, the proposed test, the alternatives, and the consequences of declining", "Schedule the colonoscopy because her recent confusion invalidates her refusal", "Ask her daughter to make the decision as surrogate"]$s2_65oo$,
  $s2_65no$["Request a formal psychiatric evaluation before accepting her decision", "Ask her to explain the condition, the test, the alternatives, and the consequences of declining", "Schedule the colonoscopy now because her recent confusion invalidates her refusal", "Ask her daughter to make the decision as surrogate"]$s2_65no$,
  $s2_65oc$Ask her to explain in her own words her understanding of her condition, the proposed test, the alternatives, and the consequences of declining$s2_65oc$,
  $s2_65nc$Ask her to explain the condition, the test, the alternatives, and the consequences of declining$s2_65nc$,
  $s2_65oe$Correct answer: B. Ask her to explain in her own words her understanding of her condition, the proposed test, the alternatives, and the consequences of declining. Decision-making capacity is decision-specific, and any treating physician can assess it at the bedside. Her hyponatremia-related delirium has resolved. The AMA Code (Opinion 2.1.1) directs physicians to 'Assess the patient's ability to understand relevant medical information and the implications of treatment alternatives and to make an independent, voluntary decision'. The teach-back question tests understanding, appreciation and reasoning; if she has capacity, her refusal is honored. Why the other options are wrong: A. Psychiatry consultation is not routinely required, and the treating physician should assess capacity first. C. Past confusion does not remove present capacity; overriding a capacitated refusal is battery. D. A surrogate decides only when the patient lacks capacity.$s2_65oe$,
  $s2_65ne$Correct answer: B. Ask her to explain the condition, the test, the alternatives, and the consequences of declining. Decision-making capacity is decision-specific, and any treating physician can assess it at the bedside. Her hyponatremia-related delirium has resolved. The AMA Code (Opinion 2.1.1) directs physicians to 'Assess the patient's ability to understand relevant medical information and the implications of treatment alternatives and to make an independent, voluntary decision'. The teach-back question tests understanding, appreciation and reasoning; if she has capacity, her refusal is honored. Why the other options are wrong: A. Psychiatry consultation is not routinely required, and the treating physician should assess capacity first. C. Past confusion does not remove present capacity; overriding a capacitated refusal is battery. D. A surrogate decides only when the patient lacks capacity.$s2_65ne$,
  142, 77, 95, 81,
  1.844156, 1.172840
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_66id$cmru3n5em00dx1y7w7x8reyny$s2_66id$,
  $s2_66st$usmle-step-3$s2_66st$,
  2,
  $s2_66oo$["Syndrome of inappropriate antidiuretic hormone secretion (SIADH).", "Adrenal insufficiency.", "Cirrhosis.", "Renal failure."]$s2_66oo$,
  $s2_66no$["Syndrome of inappropriate antidiuretic hormone secretion (SIADH).", "Primary adrenal insufficiency.", "Decompensated hepatic cirrhosis with portal hypertension.", "Acute renal failure."]$s2_66no$,
  $s2_66oc$Syndrome of inappropriate antidiuretic hormone secretion (SIADH).$s2_66oc$,
  $s2_66nc$Syndrome of inappropriate antidiuretic hormone secretion (SIADH).$s2_66nc$,
  $s2_66oe$Correct answer: A. Syndrome of inappropriate antidiuretic hormone secretion (SIADH). He meets the essential criteria for SIADH: serum osmolality 250 mOsm/kg (below 275), urine osmolality 450 mOsm/kg (above 100), urine sodium 50 mEq/L (above 30), clinical euvolemia, normal thyroid, adrenal and renal function, and no diuretic use. Why the other options are wrong: B. His morning cortisol is normal, and the SIADH criteria require excluding adrenal insufficiency, which has been done. C. He is euvolemic without edema or ascites and has normal liver tests, so there is no evidence of cirrhosis. D. His creatinine is 0.9 mg/dL, so there is no renal insufficiency.$s2_66oe$,
  $s2_66ne$Correct answer: A. Syndrome of inappropriate antidiuretic hormone secretion (SIADH). He meets the essential criteria for SIADH: serum osmolality 250 mOsm/kg (below 275), urine osmolality 450 mOsm/kg (above 100), urine sodium 50 mEq/L (above 30), clinical euvolemia, normal thyroid, adrenal and renal function, and no diuretic use. Why the other options are wrong: B. His morning cortisol is normal, and the SIADH criteria require excluding adrenal insufficiency, which has been done. C. He is euvolemic without edema or ascites and has normal liver tests, so there is no evidence of cirrhosis. D. His creatinine is 0.9 mg/dL, so there is no renal insufficiency.$s2_66ne$,
  65, 22, 65, 57,
  2.954545, 1.140351
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_67id$cmru6qytb002ll104s58x9sjt$s2_67id$,
  $s2_67st$usmle-step-3$s2_67st$,
  2,
  $s2_67oo$["Add or increase an inhaled corticosteroid, give a written action plan, and give oral corticosteroids if the exacerbation is severe", "Continue SABA alone and review in 1 month", "Start a long-acting beta-agonist alone", "Prescribe antibiotics and order a chest x-ray"]$s2_67oo$,
  $s2_67no$["Add or step up the inhaled corticosteroid, give an action plan, and add an oral steroid if the flare is severe", "Continue the short-acting bronchodilator alone and reassess her daytime symptoms again in 1 month", "Start a long-acting beta agonist alone", "Prescribe antibiotics and order a chest x-ray"]$s2_67no$,
  $s2_67oc$Add or increase an inhaled corticosteroid, give a written action plan, and give oral corticosteroids if the exacerbation is severe$s2_67oc$,
  $s2_67nc$Add or step up the inhaled corticosteroid, give an action plan, and add an oral steroid if the flare is severe$s2_67nc$,
  $s2_67oe$Correct answer: A. Add or increase an inhaled corticosteroid, give a written action plan, and give oral corticosteroids if the exacerbation is severe. Hourly SABA use and three nights of waking show loss of control on SABA alone; she speaks in full sentences with saturation of 93%, so this is a mild-to-moderate exacerbation suitable for clinic care. The plan is ICS-containing treatment, a written action plan, and oral corticosteroids if the exacerbation is severe or not responding. Why the other options are wrong: B. SABA-only treatment carries a higher risk of severe exacerbations and does not treat the underlying inflammation. C. LABA without an inhaled corticosteroid is not recommended in asthma. D. Antibiotics and chest x-ray are not routinely indicated in asthma exacerbations.$s2_67oe$,
  $s2_67ne$Correct answer: A. Add or step up the inhaled corticosteroid, give an action plan, and add an oral steroid if the flare is severe. Hourly SABA use and three nights of waking show loss of control on SABA alone; she speaks in full sentences with saturation of 93%, so this is a mild-to-moderate exacerbation suitable for clinic care. The plan is ICS-containing treatment, a written action plan, and oral corticosteroids if the exacerbation is severe or not responding. Why the other options are wrong: B. SABA-only treatment carries a higher risk of severe exacerbations and does not treat the underlying inflammation. C. LABA without an inhaled corticosteroid is not recommended in asthma. D. Antibiotics and chest x-ray are not routinely indicated in asthma exacerbations.$s2_67ne$,
  130, 45, 110, 97,
  2.888889, 1.134021
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_68id$cmru96kg300361y0sxybovjci$s2_68id$,
  $s2_68st$usmle-step-3$s2_68st$,
  2,
  $s2_68oo${"options":["Uterine atony","Retained placental tissue","Endometritis","Coagulation disorder"],"distractorRationale":{"Retained placental tissue":"This condition can cause bleeding but is more likely to present later than two weeks postpartum and often with signs of infection or abnormal uterine size.","Endometritis":"Endometritis typically presents with fever, uterine tenderness, and foul-smelling lochia, which are not described in this vignette.","Coagulation disorder":"While a coagulation disorder can lead to bleeding, the acute presentation and specific symptoms here are more indicative of uterine atony."},"clinicalReasoning":"Assess the patient's symptoms and vital signs, which indicate significant blood loss. Analyze the timeline since delivery and the nature of the bleeding to differentiate between common postpartum complications. Integrate knowledge of postpartum hemorrhage causes to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784613610899","examNumber":9302,"slotIndex":1,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T06:01:39.144Z"}}$s2_68oo$,
  $s2_68no${"options":["Uterine atony","Retained placental tissue","Postpartum endometritis","Maternal coagulation disorder"],"distractorRationale":{"Retained placental tissue":"This condition can cause bleeding but is more likely to present later than two weeks postpartum and often with signs of infection or abnormal uterine size.","Postpartum endometritis":"Postpartum endometritis typically presents with fever, uterine tenderness, and foul-smelling lochia, which are not described in this vignette.","Maternal coagulation disorder":"While a coagulation disorder can lead to bleeding, the acute presentation and specific symptoms here are more indicative of uterine atony."},"clinicalReasoning":"Assess the patient's symptoms and vital signs, which indicate significant blood loss. Analyze the timeline since delivery and the nature of the bleeding to differentiate between common postpartum complications. Integrate knowledge of postpartum hemorrhage causes to conclude that uterine atony is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784613610899","examNumber":9302,"slotIndex":1,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T06:01:39.144Z"}}$s2_68no$,
  $s2_68oc$Retained placental tissue$s2_68oc$,
  $s2_68nc$Retained placental tissue$s2_68nc$,
  $s2_68oe$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_68oe$,
  $s2_68ne$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Postpartum endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$s2_68ne$,
  25, 20, 25, 29,
  1.250000, 0.862069
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_69id$cmru96koy00381y0szeypjpp5$s2_69id$,
  $s2_69st$usmle-step-3$s2_69st$,
  2,
  $s2_69oo$["Place two large-bore IV lines, begin crystalloid and activate blood product transfusion while giving uterotonics", "Obtain a pelvic ultrasound before any treatment", "Perform dilation and curettage immediately", "Give oral iron and arrange follow-up in 1 week"]$s2_69oo$,
  $s2_69no$["Place two large-bore IVs, start crystalloid, activate transfusion, and give uterotonics", "Obtain a pelvic ultrasound before starting any intravenous fluid resuscitation", "Perform dilation and curettage immediately", "Give oral iron and arrange follow-up in 1 week"]$s2_69no$,
  $s2_69oc$Place two large-bore IV lines, begin crystalloid and activate blood product transfusion while giving uterotonics$s2_69oc$,
  $s2_69nc$Place two large-bore IVs, start crystalloid, activate transfusion, and give uterotonics$s2_69nc$,
  $s2_69oe$Correct answer: A. Place two large-bore IV lines, begin crystalloid and activate blood product transfusion while giving uterotonics. She has secondary postpartum hemorrhage with hemorrhagic shock (shock index 118/88 = 1.3, Hgb down from 11.9 to 8.5 g/dL) and a boggy uterus. ACOG defines hemorrhage as blood loss 'accompanied by signs or symptoms of hypovolemia'. Resuscitation (IV access, volume, blood) and uterotonics (oxytocin, then methylergonovine or carboprost if needed, and tranexamic acid) run together; ultrasound for retained products follows once she is being resuscitated. Why the other options are wrong: B. Imaging before resuscitation delays treatment of shock. C. Curettage is for confirmed retained products and is done only after resuscitation; uterine atony alone does not require it, and premature curettage risks perforation. D. Oral iron and delayed follow-up ignore active hemorrhagic shock.$s2_69oe$,
  $s2_69ne$Correct answer: A. Place two large-bore IVs, start crystalloid, activate transfusion, and give uterotonics. She has secondary postpartum hemorrhage with hemorrhagic shock (shock index 118/88 = 1.3, Hgb down from 11.9 to 8.5 g/dL) and a boggy uterus. ACOG defines hemorrhage as blood loss 'accompanied by signs or symptoms of hypovolemia'. Resuscitation (IV access, volume, blood) and uterotonics (oxytocin, then methylergonovine or carboprost if needed, and tranexamic acid) run together; ultrasound for retained products follows once she is being resuscitated. Why the other options are wrong: B. Imaging before resuscitation delays treatment of shock. C. Curettage is for confirmed retained products and is done only after resuscitation; uterine atony alone does not require it, and premature curettage risks perforation. D. Oral iron and delayed follow-up ignore active hemorrhagic shock.$s2_69ne$,
  112, 47, 87, 78,
  2.382979, 1.115385
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_70id$cmrvm5z3h001kjw04iwhbev9b$s2_70id$,
  $s2_70st$usmle-step-3$s2_70st$,
  2,
  $s2_70oo$["30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate","Oral fluids and discharge","MRI brain before fluids","Elective cardiac catheterization"]$s2_70oo$,
  $s2_70no$["30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, and lactate","Oral fluids and discharge home","MRI of the brain before any fluids","Elective cardiac catheterization scheduled before any emergency sepsis resuscitation"]$s2_70no$,
  $s2_70oc$30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate$s2_70oc$,
  $s2_70nc$30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, and lactate$s2_70nc$,
  $s2_70oe$In septic shock, immediate administration of IV fluids, obtaining blood cultures, and starting broad-spectrum antibiotics are critical to improve outcomes. Monitoring lactate helps assess the response to treatment.

Clinical reasoning: This patient exhibits signs of septic shock, including hypotension and elevated lactate. The sepsis management guidelines recommend rapid fluid resuscitation and initiation of antibiotics to address the underlying infection.

Why other options are incorrect:
• Oral fluids and discharge: This option is inappropriate due to the patient's hypotension and signs of septic shock.
• MRI brain before fluids: Imaging is not a priority in the setting of septic shock; immediate resuscitation is crucial.
• Elective cardiac catheterization: This is not indicated in the context of septic shock and would delay necessary treatment.$s2_70oe$,
  $s2_70ne$In septic shock, immediate administration of IV fluids, obtaining blood cultures, and starting broad-spectrum antibiotics are critical to improve outcomes. Monitoring lactate helps assess the response to treatment.

Clinical reasoning: This patient exhibits signs of septic shock, including hypotension and elevated lactate. The sepsis management guidelines recommend rapid fluid resuscitation and initiation of antibiotics to address the underlying infection.

Why other options are incorrect:
• Oral fluids and discharge home: This option is inappropriate due to the patient's hypotension and signs of septic shock.
• MRI of the brain before any fluids: Imaging is not a priority in the setting of septic shock; immediate resuscitation is crucial.
• Elective cardiac catheterization scheduled before any emergency sepsis resuscitation: This is not indicated in the context of septic shock and would delay necessary treatment.$s2_70ne$,
  98, 32, 94, 84,
  3.062500, 1.119048
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_71id$cmrvm5zj2001zjw04a0b6t5zo$s2_71id$,
  $s2_71st$usmle-step-3$s2_71st$,
  2,
  $s2_71oo${"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"ccs_prompt","caseData":{"setting":"Urgent care — pelvic pain","presentation":"22 y/o sexually active, fever, cervical motion tenderness, mucopurulent discharge","vitals":"T 38.3°C, HR 96","timeline":"Suspected PID — treat and prevent sequelae"},"structureIds":["c1-vertebra","spinal-cord","c2-vertebra"],"options":["Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy","Antibiotics only if culture positive","IUD must be removed in all cases before antibiotics","Single-dose fluconazole"]}$s2_71oo$,
  $s2_71no${"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"ccs_prompt","caseData":{"setting":"Urgent care — pelvic pain","presentation":"22 y/o sexually active, fever, cervical motion tenderness, mucopurulent discharge","vitals":"T 38.3°C, HR 96","timeline":"Suspected PID — treat and prevent sequelae"},"structureIds":["c1-vertebra","spinal-cord","c2-vertebra"],"options":["Empiric gonorrhea and chlamydia antibiotics, partner treatment, and admission for abscess or pregnancy","Antibiotics only if the culture is positive","The IUD must be removed in all cases before the first intravenous antibiotic dose is given","Single-dose oral fluconazole"]}$s2_71no$,
  $s2_71oc$Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy$s2_71oc$,
  $s2_71nc$Empiric gonorrhea and chlamydia antibiotics, partner treatment, and admission for abscess or pregnancy$s2_71nc$,
  $s2_71oe$Fever, cervical motion tenderness, and mucopurulent discharge in a sexually active young woman are pelvic inflammatory disease. Gonorrhea and chlamydia are the most common causes, so treatment is empiric antibiotics that cover both, and partners should be tested. More severe illness, including a tubo-ovarian abscess or pregnancy, is managed in the hospital.$s2_71oe$,
  $s2_71ne$Fever, cervical motion tenderness, and mucopurulent discharge in a sexually active young woman are pelvic inflammatory disease. Gonorrhea and chlamydia are the most common causes, so treatment is empiric antibiotics that cover both, and partners should be tested. More severe illness, including a tubo-ovarian abscess or pregnancy, is managed in the hospital.$s2_71ne$,
  127, 51, 102, 90,
  2.490196, 1.133333
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_72id$cmrx1ltuq0014l705e32qeuxo$s2_72id$,
  $s2_72st$usmle-step-3$s2_72st$,
  2,
  $s2_72oo${"stepLevel":"step3","blueprintSystem":"respiratory","kind":"ccs_prompt","caseData":{"setting":"Ambulatory CCS — Day 2","presentation":"45 y/o with asthma, worsening wheeze, using SABA hourly, awakened nightly ×3","vitals":"SpO2 93% RA, RR 20, speaking sentences","timeline":"Office visit — adjust controller therapy"},"structureIds":["lungs","trachea","diaphragm"],"options":["Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation","SABA alone indefinitely","Stop all inhalers","Antibiotic for all asthma flares"]}$s2_72oo$,
  $s2_72no${"stepLevel":"step3","blueprintSystem":"respiratory","kind":"ccs_prompt","caseData":{"setting":"Ambulatory CCS — Day 2","presentation":"45 y/o with asthma, worsening wheeze, using SABA hourly, awakened nightly ×3","vitals":"SpO2 93% RA, RR 20, speaking sentences","timeline":"Office visit — adjust controller therapy"},"structureIds":["lungs","trachea","diaphragm"],"options":["Add or increase the inhaled corticosteroid, give an action plan, and add an oral steroid if severe","Continue a short-acting beta agonist alone indefinitely, with no steroid inhaler","Stop all inhalers","An antibiotic for all asthma flares"]}$s2_72no$,
  $s2_72oc$Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation$s2_72oc$,
  $s2_72nc$Add or increase the inhaled corticosteroid, give an action plan, and add an oral steroid if severe$s2_72nc$,
  $s2_72oe$Nightly awakenings and hourly use of a short-acting beta-agonist mean this asthma is poorly controlled. Daily control medicines reduce airway inflammation and should be increased. A severe attack that does not respond to quick-relief medicine needs urgent care, which can include a systemic corticosteroid. He is still speaking in sentences with an oxygen saturation of 93%, so the immediate plan is to step up the controller and give an action plan.$s2_72oe$,
  $s2_72ne$Nightly awakenings and hourly use of a short-acting beta-agonist mean this asthma is poorly controlled. Daily control medicines reduce airway inflammation and should be increased. A severe attack that does not respond to quick-relief medicine needs urgent care, which can include a systemic corticosteroid. He is still speaking in sentences with an oxygen saturation of 93%, so the immediate plan is to step up the controller and give an action plan.$s2_72ne$,
  93, 32, 98, 80,
  2.906250, 1.225000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_73id$cmrx1luhf001ol7057gkr09tb$s2_73id$,
  $s2_73st$usmle-step-3$s2_73st$,
  2,
  $s2_73oo${"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Pediatric clinic — injury pattern","presentation":"2 y/o with multiple bruises in different stages, deferential delay, no plausible mechanism from caregiver","vitals":"Stable","timeline":"Child safety evaluation"},"structureIds":["heart","lungs","brain"],"options":["Report to child protective services per state law; document; full trauma survey; consider skeletal survey","Schedule routine follow-up without reporting","Confront caregiver alone and discharge","Ignore unless fracture present"]}$s2_73oo$,
  $s2_73no${"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Pediatric clinic — injury pattern","presentation":"2 y/o with multiple bruises in different stages, deferential delay, no plausible mechanism from caregiver","vitals":"Stable","timeline":"Child safety evaluation"},"structureIds":["heart","lungs","brain"],"options":["Report to child protective services, document, survey for trauma, and consider skeletal films","Schedule routine follow-up without reporting","Confront the caregiver alone and then discharge","Ignore the bruises and other injuries unless a fracture is already visible on film"]}$s2_73no$,
  $s2_73oc$Report to child protective services per state law; document; full trauma survey; consider skeletal survey$s2_73oc$,
  $s2_73nc$Report to child protective services, document, survey for trauma, and consider skeletal films$s2_73nc$,
  $s2_73oe$Clinicians must report reasonable suspicion of abuse; parallel medical evaluation for occult injury.$s2_73oe$,
  $s2_73ne$Clinicians must report reasonable suspicion of abuse; parallel medical evaluation for occult injury.$s2_73ne$,
  105, 44, 93, 82,
  2.386364, 1.134146
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_74id$cmryh2h4v000el40443gu17n5$s2_74id$,
  $s2_74st$usmle-step-3$s2_74st$,
  2,
  $s2_74oo${"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"drug_ad","ad":{"drug":"Lisinopril 10 mg","headline":"ACE inhibitor for hypertension and HFrEF","indications":"HTN, HFrEF, post-MI LV dysfunction, diabetic nephropathy","warnings":"Contraindicated in pregnancy — fetal renal toxicity. Monitor K+ and creatinine. Angioedema risk."},"structureIds":["heart","brain","adrenal-glands"],"options":["Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral","Continue — BP control paramount","Add ARB for synergy","Double dose until delivery"]}$s2_74oo$,
  $s2_74no${"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"drug_ad","ad":{"drug":"Lisinopril 10 mg","headline":"ACE inhibitor for hypertension and HFrEF","indications":"HTN, HFrEF, post-MI LV dysfunction, diabetic nephropathy","warnings":"Contraindicated in pregnancy — fetal renal toxicity. Monitor K+ and creatinine. Angioedema risk."},"structureIds":["heart","brain","adrenal-glands"],"options":["Stop the ACE inhibitor, switch to labetalol or nifedipine, and refer to obstetrics","Continue the ACE inhibitor because blood-pressure control comes first","Add an angiotensin-receptor blocker for synergy","Double the dose and continue it until delivery"]}$s2_74no$,
  $s2_74oc$Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral$s2_74oc$,
  $s2_74nc$Stop the ACE inhibitor, switch to labetalol or nifedipine, and refer to obstetrics$s2_74nc$,
  $s2_74oe$ACE inhibitors/ARBs are contraindicated in pregnancy due to fetal harm — substitute safe agents urgently.$s2_74oe$,
  $s2_74ne$ACE inhibitors/ARBs are contraindicated in pregnancy due to fetal harm — substitute safe agents urgently.$s2_74ne$,
  110, 31, 82, 69,
  3.548387, 1.188406
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_75id$cmtpx6e87000w1ymuyqwdwquv$s2_75id$,
  $s2_75st$usmle-step-3$s2_75st$,
  2,
  $s2_75oo$["Blood cultures, IV crystalloid bolus, and broad-spectrum IV antibiotics, followed by abdominal CT", "Abdominal CT before any treatment is given", "Oral antipyretics and observation", "Exploratory laparotomy"]$s2_75oo$,
  $s2_75no$["Blood cultures, an IV crystalloid bolus, broad-spectrum antibiotics, then abdominal CT", "Abdominal CT imaging before any intravenous fluids, cultures, or antibiotics", "Oral antipyretics and continued observation", "Immediate exploratory laparotomy"]$s2_75no$,
  $s2_75oc$Blood cultures, IV crystalloid bolus, and broad-spectrum IV antibiotics, followed by abdominal CT$s2_75oc$,
  $s2_75nc$Blood cultures, an IV crystalloid bolus, broad-spectrum antibiotics, then abdominal CT$s2_75nc$,
  $s2_75oe$Correct answer: A. Blood cultures, IV crystalloid bolus, and broad-spectrum IV antibiotics, followed by abdominal CT. Fever, tachycardia, hypotension, confusion, leukocytosis and an elevated lactate after cholecystectomy indicate sepsis with hypoperfusion, most likely from an intra-abdominal source such as a bile leak or abscess; resuscitation with crystalloid and prompt antibiotics after cultures must start immediately, and CT then locates the source for drainage. Why the other options are wrong: B. Imaging before treatment delays antibiotics and fluids in a hypotensive septic patient; CT should follow resuscitation, not replace it. C. Antipyretics and observation ignore hypotension, confusion and an elevated lactate, which signal life-threatening sepsis. D. Laparotomy is not the first step without peritonitis; the patient should be resuscitated and the source imaged first because a collection can often be drained percutaneously.$s2_75oe$,
  $s2_75ne$Correct answer: A. Blood cultures, an IV crystalloid bolus, broad-spectrum antibiotics, then abdominal CT. Fever, tachycardia, hypotension, confusion, leukocytosis and an elevated lactate after cholecystectomy indicate sepsis with hypoperfusion, most likely from an intra-abdominal source such as a bile leak or abscess; resuscitation with crystalloid and prompt antibiotics after cultures must start immediately, and CT then locates the source for drainage. Why the other options are wrong: B. Imaging before treatment delays antibiotics and fluids in a hypotensive septic patient; CT should follow resuscitation, not replace it. C. Antipyretics and observation ignore hypotension, confusion and an elevated lactate, which signal life-threatening sepsis. D. Laparotomy is not the first step without peritonitis; the patient should be resuscitated and the source imaged first because a collection can often be drained percutaneously.$s2_75ne$,
  97, 42, 86, 76,
  2.309524, 1.131579
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_76id$cmwfxt05o0000lj08rhtqqg47$s2_76id$,
  $s2_76st$usmle-step-3$s2_76st$,
  2,
  $s2_76oo${"stepLevel":"step3","blueprintSystem":"neurology","kind":"ccs_prompt","caseData":{"setting":"ED — acute neuro deficit","presentation":"67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal","vitals":"BP 178/96, HR 88","timeline":"Ischemic stroke evaluation — tPA window"},"structureIds":["brain","spinal-cord","carotid-artery"],"options":["IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol","Aspirin only and discharge","Immediate carotid endarterectomy in ED","MRI before any treatment regardless of delay"]}$s2_76oo$,
  $s2_76no${"stepLevel":"step3","blueprintSystem":"neurology","kind":"ccs_prompt","caseData":{"setting":"ED — acute neuro deficit","presentation":"67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal","vitals":"BP 178/96, HR 88","timeline":"Ischemic stroke evaluation — tPA window"},"structureIds":["brain","spinal-cord","carotid-artery"],"options":["Alteplase if within 4.5 hours and eligible, stroke-unit admission, and protocol blood-pressure care","Aspirin only, then discharge home","Immediate carotid endarterectomy in the emergency department before thrombolytic therapy","MRI before any treatment regardless of the delay"]}$s2_76no$,
  $s2_76oc$IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol$s2_76oc$,
  $s2_76nc$Alteplase if within 4.5 hours and eligible, stroke-unit admission, and protocol blood-pressure care$s2_76nc$,
  $s2_76oe$Eligible acute ischemic stroke within window warrants thrombolysis after hemorrhage excluded on CT.$s2_76oe$,
  $s2_76ne$Eligible acute ischemic stroke within window warrants thrombolysis after hemorrhage excluded on CT.$s2_76ne$,
  92, 44, 99, 88,
  2.090909, 1.125000
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_77id$cmwfxt0880001lj08rtvdwbsj$s2_77id$,
  $s2_77st$usmle-step-3$s2_77st$,
  2,
  $s2_77oo${"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Newborn nursery day 3","presentation":"Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs","vitals":"Stable; feeding well","timeline":"Hyperbilirubinemia — phototherapy threshold"},"structureIds":["heart","lungs","brain"],"options":["Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors","Exchange transfusion now for all bilirubin >15","Discharge without follow-up","Stop breastfeeding permanently"]}$s2_77oo$,
  $s2_77no${"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Newborn nursery day 3","presentation":"Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs","vitals":"Stable; feeding well","timeline":"Hyperbilirubinemia — phototherapy threshold"},"structureIds":["heart","lungs","brain"],"options":["Start phototherapy above the age-specific threshold, encourage feeds, follow bilirubin, and check hemolysis risk","Exchange transfusion now for all serum bilirubin values above 15 mg/dL, regardless of age in hours","Discharge home without a bilirubin follow-up plan","Stop breastfeeding permanently"]}$s2_77no$,
  $s2_77oc$Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors$s2_77oc$,
  $s2_77nc$Start phototherapy above the age-specific threshold, encourage feeds, follow bilirubin, and check hemolysis risk$s2_77nc$,
  $s2_77oe$Phototherapy thresholds depend on age and risk; monitor and treat per AAP hyperbilirubinemia guidelines.$s2_77oe$,
  $s2_77ne$Phototherapy thresholds depend on age and risk; monitor and treat per AAP hyperbilirubinemia guidelines.$s2_77ne$,
  119, 46, 112, 98,
  2.586957, 1.142857
);
INSERT INTO qbi_usmle_optlen_20261121_stage (
  id, step, batch, old_options, new_options, old_correct, new_correct,
  old_explanation, new_explanation, old_key_len, old_second_len, new_key_len, new_second_len,
  old_length_ratio, new_length_ratio
) VALUES (
  $s2_78id$fbc40daf-8e04-4aa1-8919-4bb6ffa1ac30$s2_78id$,
  $s2_78st$usmle-step-3$s2_78st$,
  2,
  $s2_78oo${"options":["A walking boot and primary closure tonight","Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement","Emergency-department closure and oral antibiotics only","No antibiotics because the wound was rinsed","Observation for ten days before any antibiotic"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"open-fracture-antibiotics-and-debridement","kind":"vignette"}$s2_78oo$,
  $s2_78no${"options":["A walking boot and primary closure tonight","IV antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement","Emergency-department skin closure tonight and a course of oral antibiotics only","No antibiotics because the wound was rinsed","Observation for ten days before any antibiotic"],"blueprintSystem":"msk-skin","taskCategory":"clinical-intervention","blueprintTopic":"open-fracture-antibiotics-and-debridement","kind":"vignette"}$s2_78no$,
  $s2_78oc$Intravenous antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement$s2_78oc$,
  $s2_78nc$IV antibiotics, tetanus prophylaxis, splinting, and operative irrigation and debridement$s2_78nc$,
  $s2_78oe$An open fracture needs early intravenous antibiotics, tetanus update, immobilization, and operative debridement. Closing it in the emergency department and relying on oral antibiotics traps contamination. Rinsing does not sterilize bone. A walking boot on an unfixed open fracture is not care. Waiting ten days for the first antibiotic invites osteomyelitis.$s2_78oe$,
  $s2_78ne$An open fracture needs early intravenous antibiotics, tetanus update, immobilization, and operative debridement. Closing it in the emergency department and relying on oral antibiotics traps contamination. Rinsing does not sterilize bone. A walking boot on an unfixed open fracture is not care. Waiting ten days for the first antibiotic invites osteomyelitis.$s2_78ne$,
  97, 54, 88, 79,
  1.796296, 1.113924
);

DO $apply$
DECLARE
  n integer;
BEGIN
  WITH upd AS (
    UPDATE "QuestionBankItem" AS q
    SET
      options = s.new_options,
      "correctAnswer" = s.new_correct,
      explanation = s.new_explanation,
      manual_correction = true,
      "generationMeta" = CASE
        WHEN q."generationMeta" IS NULL THEN '{"manualCorrection": true, "optlenBatch": "20261121-2"}'::jsonb
        WHEN jsonb_typeof(q."generationMeta") = 'object' THEN jsonb_set(
          jsonb_set(q."generationMeta", '{manualCorrection}', 'true'::jsonb, true),
          '{optlenBatch}',
          '"20261121-2"'::jsonb,
          true
        )
        ELSE q."generationMeta"
      END,
      "updatedAt" = NOW()
    FROM qbi_usmle_optlen_20261121_stage AS s
    WHERE q.id = s.id
      AND s.batch = 2
      AND q.options = s.old_options
      AND q."correctAnswer" = s.old_correct
      AND q.explanation = s.old_explanation
    RETURNING q.id
  )
  SELECT COUNT(*) INTO n FROM upd;
  IF n <> 79 THEN
    RAISE EXCEPTION 'updated % rows, expected 79', n;
  END IF;
END
$apply$;

COMMIT;
