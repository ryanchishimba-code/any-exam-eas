-- USMLE served-question content fix, 2026-11-13.
-- Target: Neon project lively-silence-56893462, database anyexameasy, table "QuestionBankItem".
-- Backup table qbi_usmle_fix_20261113_backup is created in this transaction before any update.
-- Undo: scripts/undo-usmle-fix-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_fix_20261113_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN (
    'cmru6qzpx0032l104c7m72n39',
    'cmrsewbf7000w1y55u7iov3y7',
    'cmr4gwg1d00091ydepsq9s7sx',
    'cmr8alc1l01an1yr9v6vasbta',
    '53985f0e-5441-49a7-acfa-dc279c2282ef',
    'b2xb40e4ce223dccf0c005a6993',
    'b6x900c4681b7a5d8cdf015310b',
    'cmru2q8z4000p1y7wxv2kbivc',
    'cmr8nco0g00tj1ygiz9knfoxf',
    'cmr8o9gw4012z1ygiiwjm6pc4',
    'cmr8ie7u502ai1ylofpnd9ky6',
    'cmr8mlw3u00ns1ygibi1tll69',
    'cmr8mlvy300nq1ygiwg7k9nnm',
    'cmr8nmhsu00wh1ygi2w1k5pvk',
    'cmr4bnwqs00ap1ykywn6udyuk',
    'cmr4bvedd00e71yky16oh2607',
    'cmr4cbuxw00kd1yky72d16q6e',
    'cmr4enig901i11ykye64c89yp',
    'cmr4exvl001mc1ykycxgwcq9n',
    'cmr8baitk00481yloc0iu1tdh',
    'cmr8baka0004m1ylon4cgrz2f',
    'cmr8ccire00kx1yloyjdnsjo7',
    'cmr8d1wto00qw1ylo7i2oryaa',
    'cmr8ei26j01b91ylopexb0u64',
    'cmr8f2k5z01gk1ylo0tjbeboa',
    'cmr8fheco01jt1ylor1yvtmwq',
    'cmr8h1fiw01xb1ylo3j5qscla',
    'cmr8hgj8w02161ylon8g0wyfd',
    'cmr8i0ci7027l1ylo702nt7w0',
    'cmr8ie5g9029u1ylo129cyqg6',
    'cmr8ie7mv02ag1ylowryvi57b',
    'cmr8m9f2n00kq1ygi9aar76bb',
    'cmr8n3trt00r41ygi8goafjt2',
    'cmr8q44kf01k91ygiqpy6xo8t',
    'cmr8qv0ic01ql1ygifvfvsyuw',
    'cmr9a14pq011p1ywy150mw2g1',
    'cmr9aueqx01851ywyy7r7dazj',
    'cmr9b2et901aw1ywyo2lklr0c',
    'cmr9b2g3u01bc1ywylsajcejm',
    'cmr9bnwg201gt1ywyofm8z38h',
    'cmr9bnyw601hg1ywymtdgwzi8',
    'cmtpx8qlr002l1ymuna0zclql',
    'cmr8bag1x003h1ylo94rfom7i',
    'cmr8bai6r00421ylo7mzb02os',
    'cmr8bajv8004i1ylo023anbrc',
    'cmr8d1umn00qb1ylolm4ebev9',
    'cmr8d1w7e00qq1ylolkvri23p',
    'cmr8d1x0v00qy1ylojav6pkwa',
    'cmr8d1zru00ro1ylo4bj14gr5',
    'cmr8dqd0q01141ylo9yauf1s0',
    'cmr8fheg801ju1yloi30ung13',
    'cmr8fhidi01kx1ylot702h9um',
    'cmr8gr93w01ut1ylonn8ypp24',
    'cmr8gr9be01uu1ylok953i7km',
    'cmr8hgell02021ylog9tfq6xr',
    'cmr8hgg5s020i1yloujoua6zr',
    'cmr8hggxo020q1ylo6suvatut',
    'cmr8hghmp020x1yloju35zktq',
    'cmr8i0b4s02741ylob1t11l2f',
    'cmr8ie74c02ab1ylozoshvyqp',
    'cmr8ie9ax02ax1ylof1ulgd76',
    'cmr8iea2n02b51ylolcaj0xia',
    'cmr8j9pi402jw1yloahdp7u1v',
    'cmr8juklm00151ygiuetp6tkq',
    'cmr8ki7qh003j1ygi746a2783',
    'cmr8ki8fv003q1ygi3d7yrdn7',
    'cmr8kiajd004b1ygipquj7kj4',
    'cmr8kiamu004c1ygi35l2halk',
    'cmr8m9f5f00kr1ygiclak0bnn',
    'cmr8mlu8w00n51ygi0frv50d7',
    'cmr8mlwnq00nz1ygiypxhkusc',
    'cmr8n3ppf00py1ygiqolo87vf',
    'cmr8n3tah00qz1ygied5ptqbb',
    'cmr8om7t7016c1ygimo5fmby4',
    'cmr8om8d0016j1ygi7uf3myh4',
    'cmr8omb7g017j1ygiju8m2g74',
    'cmr8ombaa017k1ygiby62ld1j',
    'cmr8ombd2017l1ygi1ttll7gj',
    'cmr8pgx6d01ds1ygi3i75a3yf',
    'cmr8qfour01ms1ygi7e24fw0n',
    'cmr8qfpfa01mz1ygiokjb1zuj',
    'cmr8qux3a01pf1ygi82n8w16f',
    'cmr8quxo801pm1ygiqr7yul96',
    'cmr8quxr301pn1ygi5r7p7cnd',
    'cmr8quyxg01q11ygip82eea6b',
    'cmr8quzen01q71ygihu0wikpv',
    'cmr8quzhk01q81ygi7o03f7h4',
    'cmr8qv0l701qm1ygi670jcuc4',
    'cmr97c2pa00031ywyx7jvqokg',
    'cmr9a118l010q1ywyg6wkcbq3',
    'cmr9a11xj010x1ywyotra8t9l',
    'cmr9a13ff011c1ywyu3j70zp5',
    'cmr9aemta013y1ywy3wia09n7',
    'cmr9aud3z017l1ywy2sy90ev1',
    'cmr9aueyk01871ywytxqhijzr',
    'cmr9b2cck01a21ywykdc59skc',
    'cmr9b2ebl01aq1ywy3fsg5icr',
    'cmr9b2ez701ay1ywy8uc5yew2',
    'cmr9bbv9y01el1ywy5lg42652',
    'cmr9bnwnk01gv1ywymwr18csw',
    'cmr9bnxd101h21ywy4gpqtv48',
    'cmr9bnzzp01hq1ywy3b2j9ieq',
    'cmr9bo0sy01hy1ywyts1gcmcw',
    'cmru3gany00a11y7wv83tnc2i',
    'cmru8v4gp000v1y0svrsu3lnl',
    'cmru8v4jo000w1y0sjihk0cr0',
    'cmru8v54100131y0sgwnet876',
    'cmru8v5od001a1y0sm19ajs2h',
    'cmru8v6ea001j1y0svuussfsk',
    'cmru96lx2003i1y0snf7tmcjg',
    'cmru96ouh00461y0sots29ol2',
    'cmtpx8qra002n1ymu1351nxox',
    'cmtpxc53u004r1ymuc2v1o63h',
    'cmtpxgrz100771ymuxbcx66w3',
    'cmtpxgsmc007f1ymuy6naq5r5',
    'cmr4gwfc100021ydeddg6pdrg',
    'cmr4hb1ia00461ydeb4dxzw2z',
    'cmr4hzumi00ac1yde2df5k1mp',
    'cmr4iesos00d21yde06jp5had',
    'cmr4ietnh00de1ydekkly2qqt',
    'cmr4iy8u800h91yde3gmvb1xq',
    'cmr4j8otf00k61ydehc9pcry8',
    'cmr4j8pwp00ki1ydeygqco6j1',
    'cmr4kip6m00tz1yde3m0cro19',
    'cmr86ydou00b61yr9u9b5bftj',
    'cmr886d8100mz1yr97ld6z77i',
    'cmr891b0f00x61yr9rxyq21qn',
    'cmr8al90m019n1yr9km667f03',
    'cmrpw0q7v00591ylu7yo99sly',
    'cmrtf2nn5000g1y30nzs5jg39',
    'cmrtf2o93000o1y30i0mlrhbl',
    'cmrtq0vn0001v1yqcbbhgf594',
    'cmr8bhfpn006l1yloz894dma6',
    'cmr8bhgsa006w1ylohrq7pphc',
    'cmr8bhhur00771ylo4ueaiaxl',
    'cmr8bhjpe007q1ylozivosopo',
    'cmr8esnr001du1ylo7ktky0pe',
    'cmr8j0ohh02h41ylosenaoxmq',
    'cmr8lc7td00an1ygifdm8y4nm',
    'cmr8ncn5400ta1ygip9cvdhtf',
    'cmr8ncqwp00ud1ygiyqjvwn3o',
    'cmr97i1s1004c1ywy4pnpk7sg',
    'cmr98645x00eu1ywysaf2wtsc',
    'cmr99imao00vf1ywyj9rsl1wx',
    'cmr9bv0on01kv1ywyvsdkt5fd',
    'cmru2q926000q1y7w5xrf7tzm',
    'cmru2q9q1000y1y7w9q3jb0nn',
    'cmru9cwbb006x1y0sazysv7e5',
    'cmru9d0f3007r1y0sr2i3xcno',
    'cmru9d1dh007z1y0szvu6y9zl',
    'cmru9is8400a91y0s6fphaloi',
    'cmtpx8qwq002p1ymuu22n2270',
    'b5x9374e60d47b4da21177036e0'
);

DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fix_20261113_backup) <> 153 THEN
    RAISE EXCEPTION 'backup row count % , expected 153', (SELECT COUNT(*) FROM qbi_usmle_fix_20261113_backup);
  END IF;
END
$check$;

UPDATE "QuestionBankItem"
SET
  options = $ufxcmru6qzpx003o${"options":["25","50","100","200","400"],"distractorRationale":{"50":"This is the NNT for a 2% absolute risk reduction. The stem is 0/2,000 versus 80/2,000, an absolute risk reduction of 4%, so the NNT is 25.","100":"An NNT of 100 would require an absolute risk reduction of 1%, not the 4% reduction in the stem.","200":"An NNT of 200 would require an absolute risk reduction of 0.5%. The placebo rate is 4% and the treatment rate is 0%.","400":"An NNT of 400 would require an absolute risk reduction of 0.25%. That is not the difference between 80/2,000 and 0/2,000."},"clinicalReasoning":"The treatment arm had 0 strokes in 2,000 patients and the placebo arm had 80 strokes in 2,000 patients. Absolute risk reduction is 0.04 (4%). NNT = 1/ARR = 25.","keyTakeaways":["NNT = 1/ARR. Here ARR is 80/2,000 minus 0/2,000, which is 0.04, so the NNT is 25."]}$ufxcmru6qzpx003o$,
  "correctAnswer" = $ufxcmru6qzpx003a$25$ufxcmru6qzpx003a$,
  explanation = $ufxcmru6qzpx003e$## Why this answer is correct
The NNT for Drug X to prevent one stroke is 25.
• **Absolute risk reduction (ARR)** is the placebo event rate minus the treatment event rate.
• The treatment group had **0 strokes in 2,000** patients (0%). The placebo group had **80 strokes in 2,000** patients (4%).
• ARR = 0.04. **NNT = 1/ARR = 25.**
**In practice:** NNT tells a patient how many people must be treated, over the same period, to prevent one stroke. An NNT of 25 is the figure that matches these trial counts.
## Why the other options are wrong

**50**
• Trap: Using event rates of 2% and 4% instead of the counts in the stem.
• Why it fails here: 50 is 1/0.02. The stem's absolute risk reduction is 80/2,000, which is 0.04, not 0.02.
• Remember: Read the numerators. Zero events is not a 2% rate.

**100**
• Trap: Taking 1 divided by the placebo rate's complement, or halving the reduction twice.
• Why it fails here: An NNT of 100 needs an absolute risk reduction of 1%. The reduction here is 4%.
• Remember: NNT = 1/ARR, and ARR is a difference in rates, not a head count.

**200**
• Trap: Dividing 2,000 by something other than the 80 prevented events, or using 0.5% as the reduction.
• Why it fails here: 200 would be the NNT only if ARR were 0.5%.
• Remember: 80 prevented events in 2,000 patients is 4 per 100, so 25 patients per event prevented.

**400**
• Trap: Treating 80/2,000 as 0.25% instead of 4%.
• Why it fails here: 80/2,000 is 0.04, and 1/0.04 is 25.
• Remember: Move the decimal before taking the reciprocal.
## Key takeaway
**NNT = 1/ARR. Zero versus 80 strokes in equal groups of 2,000 is an ARR of 4% and an NNT of 25.**

**Memory hook:** 80 prevented strokes in 2,000 people is 1 in 25.
$ufxcmru6qzpx003e$,
  "references" = $ufxcmru6qzpx003r$[{"label": "NNT = 1/ARR. AAPD evidence-based medicine calculation sheet.", "url": "https://www.aapd.org/globalassets/ebmcheatsheet__1_-1.pdf"}]$ufxcmru6qzpx003r$::jsonb,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmru6qzpx0032l104c7m72n39'
  AND "contentHash" = 'c1afaf0ae4627eec2d04da3274774c0ae127f3146ce93c0e1910edb4ae159fdb'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmrsewbf7000s$A 65-year-old woman with a history of hypertension and diabetes presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mmHg, and a CT scan of the head shows an ischemic stroke. She was last known well 80 minutes ago, takes no anticoagulant, and the fingerstick glucose is 118 mg/dL.$ufxcmrsewbf7000s$,
  explanation = $ufxcmrsewbf7000e$## Why this answer is correct
Starting intravenous thrombolysis is the best immediate treatment for this acute ischemic stroke. She was last known well 80 minutes ago, inside the 4.5-hour window in the 2019 AHA/ASA guideline. The CT shows ischemia rather than hemorrhage, she takes no anticoagulant, the glucose is 118 mg/dL, and her blood pressure of 180/100 mm Hg is already below 185/110 mm Hg, so alteplase does not need to be delayed for blood-pressure lowering.
• **Intravenous thrombolysis** with tissue plasminogen activator (tPA) is the most effective treatment for eligible patients within the time window.
• This therapy works by **dissolving** the clot that is obstructing blood flow to the brain.
• Timely intervention can significantly improve **neurological outcomes** and reduce long-term disability.
**In practice:** On the unit, administering tPA within the appropriate time frame can drastically change a patient's recovery trajectory and quality of life after a stroke.
## Why the other options are wrong



**Administer aspirin**
• Trap: Students may think aspirin is appropriate for immediate stroke management.
• Why it fails here: Aspirin is typically used for **secondary prevention** of stroke, not for the acute treatment of ischemic stroke.
• Remember: Understanding the role of medications in acute versus chronic management is crucial.

**Obtain a carotid ultrasound**
• Trap: There may be a belief that imaging studies should be prioritized in acute settings.
• Why it fails here: While a carotid ultrasound is important for evaluating stroke risk factors, it is not an **immediate management step** in acute stroke treatment.
• Remember: Recognizing the difference between diagnostic workup and urgent treatment is essential.

**Initiate anticoagulation therapy**
• Trap: Some may confuse anticoagulation with thrombolysis as both are used in stroke management.
• Why it fails here: Anticoagulation is not indicated in acute ischemic stroke unless there is evidence of **atrial fibrillation** or other specific indications.
• Remember: It's important to differentiate between types of strokes and their appropriate treatments.
## Key takeaway
**When faced with an acute ischemic stroke, prioritize intravenous thrombolysis within the treatment window.**

**Memory hook:** Think 'tPA for the win' when you see acute ischemic stroke.$ufxcmrsewbf7000e$,
  "references" = $ufxcmrsewbf7000r$[{"label": "2019 AHA/ASA guideline for the early management of acute ischemic stroke. IV alteplase within 4.5 hours of last known well; lower blood pressure below 185/110 mm Hg before treatment if it is higher.", "url": "https://www.ahajournals.org/doi/10.1161/STR.0000000000000211"}]$ufxcmrsewbf7000r$::jsonb,
  "contentHash" = $ufxcmrsewbf7000h$9f9b98ebe9ea47048c7eb804f4a3f252514d9f52f24ec6e5482de5fe23765099$ufxcmrsewbf7000h$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmrsewbf7000w1y55u7iov3y7'
  AND "contentHash" = '6f71790fc10cfa2df77147c51af01742b3a647b227163aebb330b437b22c730f'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr4gwg1d000s$A 72-year-old woman presents to the emergency department with acute shortness of breath that started two hours ago. She has a history of hypertension and heart failure, and her medications include lisinopril and furosemide. On examination, her blood pressure is 128/78 mm Hg, heart rate is 110 bpm, and she has bilateral crackles on auscultation. A chest X-ray shows pulmonary edema.$ufxcmr4gwg1d000s$,
  options = $ufxcmr4gwg1d000o${"kind":"image_based","stepLevel":"step2","blueprintSystem":"pediatrics","blueprintTopic":"developmental-milestones","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783054430164","qcScore":8.2,"slotIndex":9,"stepLevel":"step2","examNumber":9201,"generatedAt":"2026-07-03T04:56:18.016Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer intravenous furosemide","Initiate nitroglycerin infusion","Perform urgent endotracheal intubation","Start intravenous fluids"],"taskCategory":"communication"}$ufxcmr4gwg1d000o$,
  explanation = $ufxcmr4gwg1d000e$## Why this answer is correct
Administering intravenous furosemide is the best immediate step. Her blood pressure is 128/78 mm Hg, so she is not hypotensive, and the chest radiograph shows pulmonary edema. The 2022 AHA/ACC/HFSA guideline recommends prompt intravenous loop diuretics for heart failure with significant fluid overload.
• **Furosemide** is a loop diuretic that promotes diuresis, helping to reduce fluid overload.
• The patient shows signs of **acute heart failure** with pulmonary edema, requiring urgent management.
• Immediate treatment focuses on **relieving congestion** and improving hemodynamics.
**In practice:** On the unit, administering furosemide can quickly alleviate symptoms of heart failure, improving the patient's respiratory status and overall stability.
## Why the other options are wrong



**Initiate nitroglycerin infusion**
• Trap: Students may think nitroglycerin is a go-to for all heart-related issues.
• Why it fails here: The 2022 AHA/ACC/HFSA guideline says intravenous nitroglycerin may be considered as an adjunct for dyspnea only when the patient does not have systemic hypotension. Her blood pressure is 128/78 mm Hg, not a hypertensive emergency, and the treatment for pulmonary edema with fluid overload is an intravenous loop diuretic. Nitroglycerin is not a substitute for that diuretic.
• Remember: This highlights the importance of targeting the underlying cause of acute heart failure rather than just alleviating symptoms.

**Perform urgent endotracheal intubation**
• Trap: There may be a tendency to assume that intubation is necessary for any patient with respiratory distress.
• Why it fails here: Intubation is only indicated if the patient is in respiratory failure or unable to protect their airway, which is not the case here as the primary issue is fluid overload.
• Remember: This emphasizes the need to assess the cause of respiratory distress before resorting to invasive measures.

**Start intravenous fluids**
• Trap: Some may incorrectly believe that fluids are always beneficial in cases of hypotension.
• Why it fails here: Her blood pressure is 128/78 mm Hg, so she is not in shock, but she has pulmonary edema. Intravenous fluid would add volume and worsen the edema.
• Remember: This underlines the critical concept that in heart failure, managing fluid status is paramount.
## Key takeaway
**When managing acute heart failure with pulmonary edema, prioritize diuretics to relieve fluid overload.**

**Memory hook:** Remember: In heart failure, **diuretics first**, fluids last!$ufxcmr4gwg1d000e$,
  "references" = $ufxcmr4gwg1d000r$[{"label": "2022 AHA/ACC/HFSA heart failure guideline. Intravenous loop diuretics for significant fluid overload. Intravenous nitroglycerin only as an adjunct in the absence of systemic hypotension.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063"}]$ufxcmr4gwg1d000r$::jsonb,
  "contentHash" = $ufxcmr4gwg1d000h$3530dabb77295eb8ad1029d68cbeb6620aec55da929e923eccfc059719f32188$ufxcmr4gwg1d000h$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr4gwg1d00091ydepsq9s7sx'
  AND "contentHash" = 'ab3cd4658bfd93840a8b4fe003473aae572250788d85b6f0db9f84696dfc4350'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8alc1l01as$A 58-year-old man presents to the emergency department with hematemesis and melena. He has a history of chronic alcohol use and was recently diagnosed with cirrhosis. His vital signs show a blood pressure of 100/60 mm Hg and a heart rate of 110 bpm. Laboratory tests reveal a hemoglobin level of 8 g/dL and an elevated INR of 2.5. He weighs 58 kg.$ufxcmr8alc1l01as$,
  explanation = $ufxcmr8alc1l01ae$## Why this answer is correct
The maintenance rate for 58 kg by the 4-2-1 rule is 98 mL/hr, and 100 mL/hr is the closest listed option. Calculation: 4 mL/kg/hour for the first 10 kg (40) plus 2 mL/kg/hour for the next 10 kg (20) plus 1 mL/kg/hour for the remaining 38 kg (38) = 98 mL/hour. This is the maintenance rate the question asks for. Hypotensive gastrointestinal bleeding also needs volume resuscitation and blood; a maintenance rate is not that resuscitation.
• **Fluid resuscitation** is critical in acute gastrointestinal bleeding.
• The **4-2-1 rule** helps calculate the maintenance fluid rate based on body weight.
• This patient, weighing approximately 58 kg, requires adequate hydration to manage his **cirrhosis** and blood loss.
**In practice:** On the unit, this means ensuring the patient receives enough fluids to prevent complications from dehydration and to support recovery from the bleeding episode.
## Why the other options are wrong



**50 mL/hr**
• Trap: Students may think this lower rate is sufficient for hydration.
• Why it fails here: This rate is inadequate for a patient experiencing significant blood loss, risking further complications such as shock.
• Remember: Fluid resuscitation must be aggressive in cases of acute bleeding to maintain hemodynamic stability.

**75 mL/hr**
• Trap: Some may believe this is a reasonable compromise for maintenance fluids.
• Why it fails here: This rate is still below the calculated maintenance requirement and may not provide enough support for the patient's needs.
• Remember: Proper fluid management is essential in patients with significant blood loss to prevent deterioration.

**125 mL/hr**
• Trap: Students might think that higher fluid rates are always better for resuscitation.
• Why it fails here: This rate risks fluid overload, particularly in a patient with cirrhosis, which can lead to complications such as pulmonary edema.
• Remember: Fluid balance is crucial in cirrhotic patients to avoid exacerbating their condition.
## Key takeaway
**When calculating maintenance IV fluid rates, use the 4-2-1 rule to ensure adequate hydration, especially in cases of acute bleeding.**

**Memory hook:** Remember: 4-2-1 for fluid rates — it’s your guide to keeping patients hydrated!$ufxcmr8alc1l01ae$,
  "references" = $ufxcmr8alc1l01ar$[{"label": "UCSF pediatric IV fluid consensus: 4 mL/kg/hour for the first 10 kg, 2 mL/kg/hour for the next 10 kg, and 1 mL/kg/hour above 20 kg (Holliday-Segar 4-2-1 rule).", "url": "https://medconnection.ucsfbenioffchildrens.org/maintenance-iv-fluid"}]$ufxcmr8alc1l01ar$::jsonb,
  "contentHash" = $ufxcmr8alc1l01ah$433ea2d66165110e5cf2c6d667db36140d552c6622293a8befe7b9080ec37221$ufxcmr8alc1l01ah$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8alc1l01an1yr9v6vasbta'
  AND "contentHash" = 'ff9f0e310c319e99ea8309506059bf8a38ad4e4a10d27cf8bf226bad12c79c98'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  options = $ufx53985f0e5441o${"options":["Intravenous lorazepam","Dantrolene as the only seizure drug","Intravenous phenytoin","Oral lithium with a sip of water during the convulsion","Succinylcholine without airway control"],"blueprintSystem":"behavioral-nervous","taskCategory":"pharmacotherapy","blueprintTopic":"Lithium toxicity after ibuprofen and volume loss","kind":"vignette"}$ufx53985f0e5441o$,
  explanation = $ufx53985f0e5441e$Nonsteroidal anti-inflammatory drugs reduce lithium clearance, and vomiting without salt and water replacement raises the level further. Together they explain new confusion, hyperreflexia, and a seizure in a previously stable patient. The immediate drug for the convulsion is intravenous lorazepam, not another dose of the precipitant and not a swallowed lithium tablet. Dantrolene is the specific treatment for malignant hyperthermia, which occurs during or just after a volatile anesthetic or succinylcholine and features a rising end-tidal carbon dioxide and mixed acidosis. She has had no anesthetic exposure, so stiffness and a seizure do not make this malignant hyperthermia. Succinylcholine would paralyze the body without treating the brain seizure and is itself a trigger for malignant hyperthermia in susceptible people. Hold lithium and ibuprofen, give isotonic fluid, and check a lithium level, but do those things while lorazepam is given, not instead of it. Serotonin syndrome is unlikely without a serotonergic drug combination; neuroleptic malignant syndrome is unlikely without a dopamine blocker. The precipitant is pharmacokinetic, and the first pharmacologic act is still the benzodiazepine. Intravenous phenytoin is not the immediate drug: the American Epilepsy Society recommends a benzodiazepine (intravenous lorazepam when intravenous access is already present) for a convulsion that has continued past 5 minutes. Phenytoin or fosphenytoin is a later option if the seizure continues after a benzodiazepine.$ufx53985f0e5441e$,
  "references" = $ufx53985f0e5441r$[{"label": "American Epilepsy Society guideline for convulsive status epilepticus. A benzodiazepine, including intravenous lorazepam, is initial therapy. Fosphenytoin is a second-line option.", "url": "https://www.acep.org/siteassets/uploads/uploaded-files/acep/clinical-and-practice-management/clinical-policies/aesconvulsivestatusepilepticus.pdf"}]$ufx53985f0e5441r$::jsonb,
  "contentHash" = $ufx53985f0e5441h$72b2612abdbf19ec0a603081db3222d6d52972b28717dbe15a26d109df1b6898$ufx53985f0e5441h$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = '53985f0e-5441-49a7-acfa-dc279c2282ef'
  AND "contentHash" = '0fb45a6c96fede2ec5e6a26c91b80bfcc61c60bcea362113660da049518e624e'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  options = $ufxb2xb40e4ce22o$["Trendelenburg","Sitting only, with the bleeding side up as the goal","Right side down","Left side down","Supine with the head of the bed flat"]$ufxb2xb40e4ce22o$,
  explanation = $ufxb2xb40e4ce22e$Massive hemoptysis is managed by protecting the airway and keeping the bleeding lung down, not by lying on the good side. Right side down keeps blood from flooding the better left lung. Left side down puts the good lung down, where blood will run. Supine with the head of the bed flat lets blood spill into both lungs, including the better left lung. Trendelenburg is not the hemoptysis position. Sitting only, with the bleeding side up as the goal, is the opposite of keeping the bleeding side dependent. This approach has been standard care since 2018.$ufxb2xb40e4ce22e$,
  "references" = $ufxb2xb40e4ce22r$[{"label": "Massive hemoptysis review: position the bleeding side down so blood does not flood the better lung.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5696556/"}]$ufxb2xb40e4ce22r$::jsonb,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'b2xb40e4ce223dccf0c005a6993'
  AND "contentHash" = '2dada52dcfe047d18256d46fff82c7e9a50b5e4f47dc003fbb266d88352a9adf'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  options = $ufxb6x900c4681bo$["The desmopressin dose in the trial was subtherapeutic","Sodium of 150 mEq/L means the duct is sensitive","Lithium causes only a missing hormone, not a resistant kidney","Eight liters means the hormone is working","The kidney did not respond, so more hormone will not either"]$ufxb6x900c4681bo$,
  explanation = $ufxb6x900c4681be$A failed desmopressin trial on lithium means more hormone will not work, so a higher dose is the wrong drug. The kidney did not respond, so more hormone will not either. The desmopressin dose in the trial was subtherapeutic ignores an adequate trial. Sodium of 150 mEq/L means the duct is sensitive is the water loss. Lithium causes only a missing hormone, not a resistant kidney is usually a resistant kidney. Eight liters means the hormone is working would be a small volume of concentrated urine.$ufxb6x900c4681be$,
  "references" = $ufxb6x900c4681br$[{"label": "Lithium nephrogenic diabetes insipidus. Desmopressin is not accepted treatment once the kidney has failed to respond; the usual treatments are amiloride, a thiazide, and stopping lithium when possible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6711641/"}]$ufxb6x900c4681br$::jsonb,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'b6x900c4681b7a5d8cdf015310b'
  AND "contentHash" = 'bfcc9213fa9497e31f1493c44b3614a92787240955c987348d971c16007099c1'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmru2q8z4000s$A 65-year-old woman presents to the emergency department with a 3-day history of worsening shortness of breath and cough. She has a history of COPD and is currently on a tiotropium inhaler. On examination, her respiratory rate is 24 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Arterial blood gas analysis reveals a pH of 7.32, PaCO2 of 60 mmHg, and PaO2 of 55 mmHg. These gas values persist after one hour of nebulized bronchodilators, systemic corticosteroids, and oxygen targeted to a saturation of 88% to 92%.$ufxcmru2q8z4000s$,
  explanation = $ufxcmru2q8z4000e$The pH of 7.32 with an elevated PaCO2 is still present after an hour of nebulized bronchodilators, corticosteroids, and controlled oxygen. GOLD recommends noninvasive ventilation as the first mode of ventilation for this degree of acute hypercapnic failure, and the BTS/ICS threshold for starting it is a persisting pH below 7.35 with PaCO2 at least 6.5 kPa (about 49 mm Hg) and a respiratory rate above 23. Intubation is not the next step at a pH of 7.32.

The correct answer is to initiate non-invasive ventilation (NIV) for this patient with acute exacerbation of COPD and respiratory acidosis. NIV can improve gas exchange and reduce the work of breathing. Administering systemic corticosteroids is important, but it is not the immediate next step in this acute setting. Starting intravenous antibiotics is not indicated unless there is evidence of infection, which is not present here. Providing supplemental oxygen alone is insufficient given her severe respiratory acidosis and hypoxemia; NIV is necessary to support her respiratory function.

Clinical reasoning: Assess the patient's respiratory status and arterial blood gas results, which indicate acute respiratory failure. Analyze the need for immediate intervention to improve ventilation and oxygenation. Integrate the use of non-invasive ventilation to manage her exacerbation effectively.

Why other options are incorrect:
• Administer systemic corticosteroids: While corticosteroids are beneficial in COPD exacerbations, they do not address the immediate respiratory failure.
• Start intravenous antibiotics: This patient does not show signs of infection, making antibiotics unnecessary at this stage.
• Provide supplemental oxygen only: Oxygen alone does not address the underlying respiratory acidosis and may not be sufficient for her condition.$ufxcmru2q8z4000e$,
  "references" = $ufxcmru2q8z4000r$[{"label": "BTS/ICS adult NIV algorithm: start NIV for COPD when pH < 7.35 and PaCO2 ≥ 6.5 kPa persist after medical therapy, with respiratory rate > 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}, {"label": "GOLD 2024 pocket guide: noninvasive ventilation is the first mode of ventilation for a COPD exacerbation with acute respiratory failure and no contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/02/POCKET-GUIDE-GOLD-2024-ver-1.2-11Jan2024_WMV.pdf"}]$ufxcmru2q8z4000r$::jsonb,
  "contentHash" = $ufxcmru2q8z4000h$d56b934549c0fd02941686d4346b747fbfd6d60aa3cdb5644b37db2222608ef1$ufxcmru2q8z4000h$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmru2q8z4000p1y7wxv2kbivc'
  AND "contentHash" = '9787e1df986e69df1de0221256ebd8a7a75285f16bf8b17421e647eb4ed25b9a'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8nco0g00ts$A 62-year-old woman presents to the emergency department with a 2-day history of worsening shortness of breath and a productive cough. She has a history of chronic obstructive pulmonary disease (COPD) and is currently on a long-acting beta-agonist and a corticosteroid. On examination, her respiratory rate is 24 breaths per minute, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Her arterial blood gas reveals pH 7.32, PaCO2 58 mmHg, and PaO2 55 mmHg. These gas values persist after one hour of nebulized bronchodilators, systemic corticosteroids, and oxygen targeted to a saturation of 88% to 92%.$ufxcmr8nco0g00ts$,
  explanation = $ufxcmr8nco0g00te$The pH of 7.32 with an elevated PaCO2 is still present after an hour of nebulized bronchodilators, corticosteroids, and controlled oxygen. GOLD recommends noninvasive ventilation as the first mode of ventilation for this degree of acute hypercapnic failure, and the BTS/ICS threshold for starting it is a persisting pH below 7.35 with PaCO2 at least 6.5 kPa (about 49 mm Hg) and a respiratory rate above 23. Intubation is not the next step at a pH of 7.32.

The correct answer is to initiate non-invasive ventilation (NIV) for this patient with acute exacerbation of COPD and respiratory acidosis. NIV can improve gas exchange and reduce the work of breathing, which is critical given her elevated PaCO2 and low pH. Administering intravenous corticosteroids is important but should follow the initiation of NIV in this acute setting. Starting intravenous antibiotics is unnecessary as there is no evidence of pneumonia on the chest X-ray. Intubation is a more invasive option that should be reserved for patients who do not respond to NIV or have severe respiratory failure. This case illustrates the importance of recognizing acute exacerbations of COPD and the role of NIV in management (USMLE Content Outline 2026).

Clinical reasoning: The patient presents with acute respiratory distress due to COPD exacerbation, evidenced by hypoxemia and hypercapnia. The arterial blood gas results indicate respiratory acidosis, necessitating immediate intervention to improve ventilation. Non-invasive ventilation is the most appropriate next step to address her respiratory failure effectively.

Why other options are incorrect:
• Administer intravenous corticosteroids: While corticosteroids are beneficial in managing COPD exacerbations, they are not the immediate next step in this case where respiratory failure is present.
• Start intravenous antibiotics: There is no evidence of infection or pneumonia, making antibiotics unnecessary at this time.
• Perform intubation: Intubation is invasive and should only be considered if non-invasive ventilation fails or the patient is unable to protect their airway.$ufxcmr8nco0g00te$,
  "references" = $ufxcmr8nco0g00tr$[{"label": "BTS/ICS adult NIV algorithm: start NIV for COPD when pH < 7.35 and PaCO2 ≥ 6.5 kPa persist after medical therapy, with respiratory rate > 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}, {"label": "GOLD 2024 pocket guide: noninvasive ventilation is the first mode of ventilation for a COPD exacerbation with acute respiratory failure and no contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/02/POCKET-GUIDE-GOLD-2024-ver-1.2-11Jan2024_WMV.pdf"}]$ufxcmr8nco0g00tr$::jsonb,
  "contentHash" = $ufxcmr8nco0g00th$d37b4d1fd3a21bdb1c45ae269ba9a64c601b21caa629485e7af28070d80e4a66$ufxcmr8nco0g00th$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8nco0g00tj1ygiz9knfoxf'
  AND "contentHash" = 'ccfb49ffa6a75739f7910f7b9435428a2c31fda4fd7dbb98909c683ad352b97f'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8o9gw4012s$A 62-year-old woman presents to the emergency department with a 2-day history of worsening shortness of breath and productive cough. She has a history of COPD and is currently on tiotropium and albuterol. On examination, her respiratory rate is 24 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Her arterial blood gas reveals a pH of 7.32, PaCO2 of 55 mm Hg, and PaO2 of 60 mm Hg. These gas values persist after one hour of nebulized bronchodilators, systemic corticosteroids, and oxygen targeted to a saturation of 88% to 92%.$ufxcmr8o9gw4012s$,
  explanation = $ufxcmr8o9gw4012e$The pH of 7.32 with an elevated PaCO2 is still present after an hour of nebulized bronchodilators, corticosteroids, and controlled oxygen. GOLD recommends noninvasive ventilation as the first mode of ventilation for this degree of acute hypercapnic failure, and the BTS/ICS threshold for starting it is a persisting pH below 7.35 with PaCO2 at least 6.5 kPa (about 49 mm Hg) and a respiratory rate above 23. Intubation is not the next step at a pH of 7.32.

The correct answer is to initiate non-invasive ventilation (NIV) for this patient with acute respiratory failure due to COPD exacerbation. NIV can improve oxygenation and reduce the work of breathing, which is critical given her elevated PaCO2 and low pH indicating respiratory acidosis. Administering systemic corticosteroids is important but is not the immediate next step in acute management. Starting intravenous antibiotics is inappropriate as there is no evidence of pneumonia on the chest X-ray. Providing nebulized saline may offer some symptomatic relief but does not address the underlying respiratory failure.

Clinical reasoning: Assess the patient's clinical status, noting the signs of respiratory distress and hypoxemia. Analyze the arterial blood gas results to confirm respiratory acidosis and the need for intervention. Integrate knowledge of COPD management to determine that non-invasive ventilation is the most effective immediate step.

Why other options are incorrect:
• Administer systemic corticosteroids: While corticosteroids are beneficial in COPD exacerbations, they do not address the acute respiratory failure directly and should follow stabilization.
• Start intravenous antibiotics: This option is incorrect as the patient does not show signs of pneumonia or infection requiring antibiotics.
• Provide nebulized saline: Nebulized saline does not provide significant therapeutic benefit in acute exacerbations and does not address respiratory failure.$ufxcmr8o9gw4012e$,
  "references" = $ufxcmr8o9gw4012r$[{"label": "BTS/ICS adult NIV algorithm: start NIV for COPD when pH < 7.35 and PaCO2 ≥ 6.5 kPa persist after medical therapy, with respiratory rate > 23.", "url": "https://www.brit-thoracic.org.uk/document-library/quality-improvement/niv/appendix-4b-niv-algorithm-icht/"}, {"label": "GOLD 2024 pocket guide: noninvasive ventilation is the first mode of ventilation for a COPD exacerbation with acute respiratory failure and no contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/02/POCKET-GUIDE-GOLD-2024-ver-1.2-11Jan2024_WMV.pdf"}]$ufxcmr8o9gw4012r$::jsonb,
  "contentHash" = $ufxcmr8o9gw4012h$b7d140083302bf848b0c23622835c78f562e5824e1d51ba049eae64aea2c4ad0$ufxcmr8o9gw4012h$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8o9gw4012z1ygiiwjm6pc4'
  AND "contentHash" = '210309fe42ea49e63c173dd4324e582f3e794ffa1fba323b8af92df601123ecf'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8ie7u502as$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions and a cervical exam showing 4 cm dilation. Her vital signs are stable, with a blood pressure of 120/80 mm Hg and a heart rate of 80 bpm. The fetal heart rate tracing shows a reassuring pattern. She has no significant medical history and is not on any medications. A test under consideration has a sensitivity of 80% and a false-positive rate of 40%.$ufxcmr8ie7u502as$,
  explanation = $ufxcmr8ie7u502ae$Positive likelihood ratio = sensitivity / (1 − specificity). The stem now includes the sensitivity and the false-positive rate or specificity used below.

The positive likelihood ratio (LR+) is calculated by dividing the sensitivity of the test by the false positive rate. In this case, with a sensitivity of 80% and a false positive rate of 40%, the LR+ is 2.0. This indicates that a positive test result is twice as likely to occur in patients with the condition compared to those without it. The other options represent common miscalculations or misunderstandings of the LR+ formula. Understanding how to calculate and interpret LR+ is crucial for assessing diagnostic tests in obstetric care. (USMLE Content Outline 2026, Section 3: Obstetrics and Gynecology)

Clinical reasoning: Assess the patient's labor status and fetal heart rate tracing. Analyze the sensitivity and specificity of the test being evaluated. Integrate this information to calculate the LR+ accurately.

Why other options are incorrect:
• 1.5: This option reflects a miscalculation of sensitivity and specificity, leading to an underestimation of the LR+. Common trap: confusing sensitivity with specificity.
• 3.0: This option suggests a higher LR+ than calculated, which may stem from misunderstanding the relationship between sensitivity and specificity. Common trap: assuming a higher LR+ indicates better test performance without proper calculation.
• 4.0: This option indicates a significant overestimation of the LR+, likely due to incorrect sensitivity or specificity values being used. Common trap: misapplying the LR+ formula.$ufxcmr8ie7u502ae$,
  "references" = $ufxcmr8ie7u502ar$[{"label": "Positive likelihood ratio = sensitivity / (1 − specificity). Akobeng, Acta Paediatrica, 2007.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2556590/"}]$ufxcmr8ie7u502ar$::jsonb,
  "contentHash" = $ufxcmr8ie7u502ah$8a914960e5abe59d42ed7ceadc5a03324bb2317bd7a70efe5338151e898c00bd$ufxcmr8ie7u502ah$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ie7u502ai1ylofpnd9ky6'
  AND "contentHash" = '9e2825f47e477d1bf24881a81d894966be72f7633b946caa6aad7115f7d7ed4a'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8mlw3u00ns$A 36-year-old woman presents to the clinic for a routine follow-up after a recent delivery. She reports persistent fatigue and mood swings. On examination, her blood pressure is 110/70 mm Hg, and her heart rate is 75 bpm. The physician is considering the implications of her symptoms and the need for further evaluation. A test under consideration has a sensitivity of 80% and a specificity of 60%.$ufxcmr8mlw3u00ns$,
  explanation = $ufxcmr8mlw3u00ne$Positive likelihood ratio = sensitivity / (1 − specificity). The stem now includes the sensitivity and the false-positive rate or specificity used below.

The positive likelihood ratio (LR+) is calculated as the sensitivity of a test divided by the false positive rate. In this case, if the sensitivity is 80% and the specificity is 60%, the LR+ would be 0.8 / (1 - 0.6) = 2.0. Each distractor represents a common misunderstanding of LR+. For instance, 1.5 underestimates the LR+ based on the calculated values, while 2.5 and 3.0 overestimate it, which could mislead clinical decisions.

Clinical reasoning: Assess the sensitivity and specificity of the test to determine the LR+. Analyze the values to calculate the LR+. Integrate the results to select the most accurate LR+.

Why other options are incorrect:
• 1.5: Underestimates the true LR+ based on sensitivity and specificity.
• 2.5: Overestimates the LR+, leading to misinterpretation of test accuracy.
• 3.0: Significantly overestimates the LR+, which could mislead clinical decisions.$ufxcmr8mlw3u00ne$,
  "references" = $ufxcmr8mlw3u00nr$[{"label": "Positive likelihood ratio = sensitivity / (1 − specificity). Akobeng, Acta Paediatrica, 2007.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2556590/"}]$ufxcmr8mlw3u00nr$::jsonb,
  "contentHash" = $ufxcmr8mlw3u00nh$043792456de4795de759660cb205c785ffb264ecb96bc2df7edc137dee171aa8$ufxcmr8mlw3u00nh$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlw3u00ns1ygibi1tll69'
  AND "contentHash" = '4faf80f0743978a06c96fa95d50d8027cbf91860a1049417a1c902fdd78b44a6'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  scenario = $ufxcmr8mlvy300ns$A 40-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of endometriosis and recently underwent a hysterectomy. On examination, she has a fever of 101°F, and laboratory tests show elevated white blood cell count and CRP. The physician is considering the next steps in management. A treatment being considered has an absolute risk reduction of 10%.$ufxcmr8mlvy300ns$,
  explanation = $ufxcmr8mlvy300ne$NNT = 1/ARR. An absolute risk reduction of 10% (0.10) gives NNT = 1/0.10 = 10. The stem states that reduction.

The number needed to treat (NNT) is a measure of how many patients need to be treated to prevent one additional bad outcome. In this scenario, if the treatment has an absolute risk reduction of 10%, the NNT would be calculated as 1/0.1 = 10. Each distractor represents a common miscalculation of NNT. For example, 5 underestimates the number of patients needed, while 15 and 20 overestimate it, leading to potential misallocation of resources.

Clinical reasoning: Assess the treatment's efficacy and its impact on patient outcomes. Analyze the absolute risk reduction to calculate the NNT accurately. Integrate this information to select the correct NNT.

Why other options are incorrect:
• 5: Underestimates the NNT, suggesting overly optimistic treatment efficacy.
• 15: Overestimates the NNT, which could mislead treatment decisions.
• 20: Significantly overestimates the NNT, risking unnecessary treatment.$ufxcmr8mlvy300ne$,
  "references" = $ufxcmr8mlvy300nr$[{"label": "NNT = 1/ARR. AAPD evidence-based medicine calculation sheet.", "url": "https://www.aapd.org/globalassets/ebmcheatsheet__1_-1.pdf"}]$ufxcmr8mlvy300nr$::jsonb,
  "contentHash" = $ufxcmr8mlvy300nh$cf1e9659fb487963f6ba5e95b368699ffc517f64e99c111017e3cbb58697526e$ufxcmr8mlvy300nh$,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlvy300nq1ygiwg7k9nnm'
  AND "contentHash" = '1430a2217fc06513c421429087ffb2ac33bb0d9b1e8b018b70bd153a4d1fa9f8'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  explanation = $ufxcmr8nmhsu00we$## Why this answer is correct
Adding a thiazide diuretic is the best next step for managing this patient's stage 2 hypertension.
• **Stage 2 hypertension** requires more aggressive treatment.
• The 2017 ACC/AHA guideline defines stage 2 hypertension as a systolic pressure of at least 140 mm Hg or a diastolic pressure of at least 90 mm Hg. Thiazide diuretics, calcium-channel blockers, ACE inhibitors, and ARBs are the first-line classes. This patient is already taking lisinopril and his pressure is 160/95 mm Hg, so adding a thiazide from a different first-line class is appropriate.
• Combining a thiazide with lisinopril can enhance **blood pressure control**.
**In practice:** In practice, this means we need to effectively manage blood pressure to reduce the risk of cardiovascular events. Adding a thiazide diuretic can help achieve target blood pressure levels.
## Why the other options are wrong



**Increase the dose of lisinopril**
• Trap: Students might think that simply increasing the dose of the current medication is sufficient.
• Why it fails here: While increasing lisinopril may lower blood pressure, it is often not enough alone for stage 2 hypertension, and a combination therapy is more effective.
• Remember: This highlights the importance of using a multi-drug approach for managing higher stages of hypertension.

**Start a beta-blocker**
• Trap: There is a common belief that beta-blockers are a go-to option for hypertension management.
• Why it fails here: Beta-blockers are not first-line agents for hypertension unless there are specific indications, such as heart disease or heart failure.
• Remember: A beta-blocker is not a first-line drug for hypertension unless there is a compelling cardiac indication, and this history does not give one.

**Initiate lifestyle modifications only**
• Trap: Some may think that lifestyle changes alone can adequately manage high blood pressure.
• Why it fails here: Given the patient's current blood pressure of 160/95 mmHg, lifestyle modifications alone are insufficient and should be combined with pharmacotherapy.
• Remember: This emphasizes the need for a comprehensive approach to managing hypertension, especially at higher stages.
## Key takeaway
**When managing stage 2 hypertension, always consider adding a thiazide diuretic to enhance blood pressure control.**

**Memory hook:** Think 'Thiazide for Two' when you see stage 2 hypertension!$ufxcmr8nmhsu00we$,
  "references" = $ufxcmr8nmhsu00wr$[{"label": "2017 ACC/AHA high blood pressure guideline. Stage 2 is ≥140/90 mm Hg. First-line classes are thiazide diuretics, dihydropyridine calcium-channel blockers, ACE inhibitors, and ARBs.", "url": "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065"}]$ufxcmr8nmhsu00wr$::jsonb,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id = 'cmr8nmhsu00wh1ygi2w1k5pvk'
  AND "contentHash" = 'ea37ea85b7651e71bdf2e0a376b86774b095847ef796f6f8e5d31dce3eccf2d8'
  AND active = true;

UPDATE "QuestionBankItem"
SET
  active = false,
  manual_correction = true,
  "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
  "updatedAt" = NOW()
WHERE id IN (
    'cmr4bnwqs00ap1ykywn6udyuk',
    'cmr4bvedd00e71yky16oh2607',
    'cmr4cbuxw00kd1yky72d16q6e',
    'cmr4enig901i11ykye64c89yp',
    'cmr4exvl001mc1ykycxgwcq9n',
    'cmr8baitk00481yloc0iu1tdh',
    'cmr8baka0004m1ylon4cgrz2f',
    'cmr8ccire00kx1yloyjdnsjo7',
    'cmr8d1wto00qw1ylo7i2oryaa',
    'cmr8ei26j01b91ylopexb0u64',
    'cmr8f2k5z01gk1ylo0tjbeboa',
    'cmr8fheco01jt1ylor1yvtmwq',
    'cmr8h1fiw01xb1ylo3j5qscla',
    'cmr8hgj8w02161ylon8g0wyfd',
    'cmr8i0ci7027l1ylo702nt7w0',
    'cmr8ie5g9029u1ylo129cyqg6',
    'cmr8ie7mv02ag1ylowryvi57b',
    'cmr8m9f2n00kq1ygi9aar76bb',
    'cmr8n3trt00r41ygi8goafjt2',
    'cmr8q44kf01k91ygiqpy6xo8t',
    'cmr8qv0ic01ql1ygifvfvsyuw',
    'cmr9a14pq011p1ywy150mw2g1',
    'cmr9aueqx01851ywyy7r7dazj',
    'cmr9b2et901aw1ywyo2lklr0c',
    'cmr9b2g3u01bc1ywylsajcejm',
    'cmr9bnwg201gt1ywyofm8z38h',
    'cmr9bnyw601hg1ywymtdgwzi8',
    'cmtpx8qlr002l1ymuna0zclql',
    'cmr8bag1x003h1ylo94rfom7i',
    'cmr8bai6r00421ylo7mzb02os',
    'cmr8bajv8004i1ylo023anbrc',
    'cmr8d1umn00qb1ylolm4ebev9',
    'cmr8d1w7e00qq1ylolkvri23p',
    'cmr8d1x0v00qy1ylojav6pkwa',
    'cmr8d1zru00ro1ylo4bj14gr5',
    'cmr8dqd0q01141ylo9yauf1s0',
    'cmr8fheg801ju1yloi30ung13',
    'cmr8fhidi01kx1ylot702h9um',
    'cmr8gr93w01ut1ylonn8ypp24',
    'cmr8gr9be01uu1ylok953i7km',
    'cmr8hgell02021ylog9tfq6xr',
    'cmr8hgg5s020i1yloujoua6zr',
    'cmr8hggxo020q1ylo6suvatut',
    'cmr8hghmp020x1yloju35zktq',
    'cmr8i0b4s02741ylob1t11l2f',
    'cmr8ie74c02ab1ylozoshvyqp',
    'cmr8ie9ax02ax1ylof1ulgd76',
    'cmr8iea2n02b51ylolcaj0xia',
    'cmr8j9pi402jw1yloahdp7u1v',
    'cmr8juklm00151ygiuetp6tkq',
    'cmr8ki7qh003j1ygi746a2783',
    'cmr8ki8fv003q1ygi3d7yrdn7',
    'cmr8kiajd004b1ygipquj7kj4',
    'cmr8kiamu004c1ygi35l2halk',
    'cmr8m9f5f00kr1ygiclak0bnn',
    'cmr8mlu8w00n51ygi0frv50d7',
    'cmr8mlwnq00nz1ygiypxhkusc',
    'cmr8n3ppf00py1ygiqolo87vf',
    'cmr8n3tah00qz1ygied5ptqbb',
    'cmr8om7t7016c1ygimo5fmby4',
    'cmr8om8d0016j1ygi7uf3myh4',
    'cmr8omb7g017j1ygiju8m2g74',
    'cmr8ombaa017k1ygiby62ld1j',
    'cmr8ombd2017l1ygi1ttll7gj',
    'cmr8pgx6d01ds1ygi3i75a3yf',
    'cmr8qfour01ms1ygi7e24fw0n',
    'cmr8qfpfa01mz1ygiokjb1zuj',
    'cmr8qux3a01pf1ygi82n8w16f',
    'cmr8quxo801pm1ygiqr7yul96',
    'cmr8quxr301pn1ygi5r7p7cnd',
    'cmr8quyxg01q11ygip82eea6b',
    'cmr8quzen01q71ygihu0wikpv',
    'cmr8quzhk01q81ygi7o03f7h4',
    'cmr8qv0l701qm1ygi670jcuc4',
    'cmr97c2pa00031ywyx7jvqokg',
    'cmr9a118l010q1ywyg6wkcbq3',
    'cmr9a11xj010x1ywyotra8t9l',
    'cmr9a13ff011c1ywyu3j70zp5',
    'cmr9aemta013y1ywy3wia09n7',
    'cmr9aud3z017l1ywy2sy90ev1',
    'cmr9aueyk01871ywytxqhijzr',
    'cmr9b2cck01a21ywykdc59skc',
    'cmr9b2ebl01aq1ywy3fsg5icr',
    'cmr9b2ez701ay1ywy8uc5yew2',
    'cmr9bbv9y01el1ywy5lg42652',
    'cmr9bnwnk01gv1ywymwr18csw',
    'cmr9bnxd101h21ywy4gpqtv48',
    'cmr9bnzzp01hq1ywy3b2j9ieq',
    'cmr9bo0sy01hy1ywyts1gcmcw',
    'cmru3gany00a11y7wv83tnc2i',
    'cmru8v4gp000v1y0svrsu3lnl',
    'cmru8v4jo000w1y0sjihk0cr0',
    'cmru8v54100131y0sgwnet876',
    'cmru8v5od001a1y0sm19ajs2h',
    'cmru8v6ea001j1y0svuussfsk',
    'cmru96lx2003i1y0snf7tmcjg',
    'cmru96ouh00461y0sots29ol2',
    'cmtpx8qra002n1ymu1351nxox',
    'cmtpxc53u004r1ymuc2v1o63h',
    'cmtpxgrz100771ymuxbcx66w3',
    'cmtpxgsmc007f1ymuy6naq5r5',
    'cmr4gwfc100021ydeddg6pdrg',
    'cmr4hb1ia00461ydeb4dxzw2z',
    'cmr4hzumi00ac1yde2df5k1mp',
    'cmr4iesos00d21yde06jp5had',
    'cmr4ietnh00de1ydekkly2qqt',
    'cmr4iy8u800h91yde3gmvb1xq',
    'cmr4j8otf00k61ydehc9pcry8',
    'cmr4j8pwp00ki1ydeygqco6j1',
    'cmr4kip6m00tz1yde3m0cro19',
    'cmr86ydou00b61yr9u9b5bftj',
    'cmr886d8100mz1yr97ld6z77i',
    'cmr891b0f00x61yr9rxyq21qn',
    'cmr8al90m019n1yr9km667f03',
    'cmrpw0q7v00591ylu7yo99sly',
    'cmrtf2nn5000g1y30nzs5jg39',
    'cmrtf2o93000o1y30i0mlrhbl',
    'cmrtq0vn0001v1yqcbbhgf594',
    'cmr8bhfpn006l1yloz894dma6',
    'cmr8bhgsa006w1ylohrq7pphc',
    'cmr8bhhur00771ylo4ueaiaxl',
    'cmr8bhjpe007q1ylozivosopo',
    'cmr8esnr001du1ylo7ktky0pe',
    'cmr8j0ohh02h41ylosenaoxmq',
    'cmr8lc7td00an1ygifdm8y4nm',
    'cmr8ncn5400ta1ygip9cvdhtf',
    'cmr8ncqwp00ud1ygiyqjvwn3o',
    'cmr97i1s1004c1ywy4pnpk7sg',
    'cmr98645x00eu1ywysaf2wtsc',
    'cmr99imao00vf1ywyj9rsl1wx',
    'cmr9bv0on01kv1ywyvsdkt5fd',
    'cmru2q926000q1y7w5xrf7tzm',
    'cmru2q9q1000y1y7w9q3jb0nn',
    'cmru9cwbb006x1y0sazysv7e5',
    'cmru9d0f3007r1y0sr2i3xcno',
    'cmru9d1dh007z1y0szvu6y9zl',
    'cmru9is8400a91y0s6fphaloi',
    'cmtpx8qwq002p1ymuu22n2270',
    'b5x9374e60d47b4da21177036e0'
)
  AND active = true;

COMMIT;

-- Follow-up in the same change, after the transaction above committed.
-- The weaker lithium/desmopressin duplicate stays hidden, and its joke distractor is replaced too.
UPDATE "QuestionBankItem"
SET
  options = replace(options, 'A failed trial means the dose was homeopathic', 'The desmopressin dose in the trial was subtherapeutic'),
  explanation = replace(explanation, 'A failed trial means the dose was homeopathic', 'The desmopressin dose in the trial was subtherapeutic'),
  "references" = '[{"label":"Lithium nephrogenic diabetes insipidus. Desmopressin is not accepted treatment once the kidney has failed to respond.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC6711641/"}]'::jsonb,
  "updatedAt" = NOW()
WHERE id = 'b5x9374e60d47b4da21177036e0'
  AND active = false
  AND options LIKE '%homeopathic%';

