-- Stage the USMLE 240-item audit. Creates a backup of the current rows and a
-- staging table of the proposed values. Does not update "QuestionBankItem".
-- 236 served items.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/stage-usmle-audit240-20261114.sql
BEGIN;
-- Safe to re-run only before apply. Re-running after apply would replace the
-- undo snapshot with the already-updated rows.
DROP TABLE IF EXISTS qbi_usmle_audit240_20261114_stage;
DROP TABLE IF EXISTS qbi_usmle_audit240_20261114_backup;
CREATE TABLE qbi_usmle_audit240_20261114_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmqxc0tn1000l1ymamy3ui3ub',
    'cmr8f0kst00cz1yazqps0oss0',
    'cmr8ccjxd01661yw2p1anttp1',
    'cmrpvdqka002e1yncru1gtuh6',
    'cmrr4ydcr002q1y6pfnfazodg',
    'cmrth8awr005c1yax9bwjn86i',
    'cmrpwiwl0006t1yrthg9m5uvm',
    'cmrrtw7wp009n1y8wv1sune9p',
    'cmrsewbcg000v1y55qfwcsddx',
    'cmrru3r3m00bj1y8wn8sztwo1',
    'cmrrum1cu00hi1y8wrru12a6s',
    'cmrpvuy8z000v1yh5a2u8z3wc',
    'cmrpvyvwe000f1yrtcrs99gnc',
    'cmrpw57oa002l1yrtbo2dzb2f',
    'cmrpwfgru007c1yh5uv5lpw3o',
    'cmrpw16sy002b1yh5v9azodfx',
    'cmrpvdpub00251yncmxaza7m2',
    'cmr8bg1su01031yw29iy48ez2',
    'cmr89p24d00nb1yw2dp1cbdre',
    'cmr8dyk8y006g1yazarhp5uco',
    'cmr8dym1f00721yaz93i07rue',
    'cmrpvdr6d002m1yncpdrv20xq',
    'cmrth8bb2005g1yax15cu6j80',
    'cmr87j34200b21yw2fmxa5qvg',
    'd1924316-1d88-4d02-863d-9efa44f3fc46',
    'cmr4pbfop00pn1y1e471kzzx1',
    'ae455eed-f457-4b80-8d5b-9a83629093d2',
    '472e875c-1f80-4ccc-86cc-4932281b45bc',
    'cmr4nxtqt00h41y1edmbgwj2c',
    '353f87aa-eafa-4b6b-89d3-3a8decea2922',
    'cmr4ouq5e00m61y1eux3389bp',
    'cmr88g7b700dx1yw2lufaujue',
    'cmr8d6fip000k1yazfsid42lh',
    'e7d6f9a1-c553-46bd-b740-b0231a2b85ec',
    'cmr8cclku016p1yw2qkp7qnqk',
    'cmr8ei2tu00a21yazj9fki812',
    'cmr8ei3ix00a91yaz0r2h3v04',
    'cmr8dn23m003c1yazr39zl2l5',
    'cmra6lubd000wic04exfx82r6',
    '9f48e06d-8be3-4126-90ba-7c745f6a8f48',
    '270d5eb5-5278-412a-ad62-88d8b7e81e0a',
    '224a3028-b94e-44e7-bbbb-ce7d1e86f0b2',
    'cmrtqq5o900181yx3g6qwed9r',
    'cmrru3pr100b41y8wf19jebl3',
    'cmrrv66zo00op1y8wcpj3nt9r',
    'b10x294ebb06186a9e0515f9895b',
    'cmra6lu1r000jic0497uhqtw7',
    'b4x435b36206913524df5371c2f',
    'b4x51807a33241a8f22d5c8d98a',
    'b8xa9f03945dd42ca2e3d1bd751',
    'b4xbd2546b2d8210b5bf9900545',
    'b4x17c26eea7657424635f63ce9',
    'b7xf986c97db2fffd23c84475d9',
    'b8x53cc4eac02e3a72ff69caeac',
    'b4xbc501408f6e5a158eac86f8f',
    'b4x6e0a5ba215df82c902514a8b',
    'b1xbfc54bc9021edc6e0fceef63',
    'b8x81ff5e0dcf780e33aef2eaa6',
    'b8x505a26f881a35e075ae733c2',
    'b7xb6cd39d373d26f387163d637',
    'b8xfbd51d5d37765aca2f1fbe8c',
    'b7x73458c4a8a2c773e494762c6',
    'b1x5a8a06c308382c8bd94cf6a6',
    'cmrpvux64000i1yh5al51283d',
    'cmrpvyuu700021yrtpwkdjcvn',
    'cmrpwck7i004z1yrtaajh5ghh',
    'cmrpvuw9500071yh5mo0pstv8',
    'cmrpw18yw002x1yh5k5xqmicm',
    'cmrr4y8wf00271y6p6btbtqp9',
    'cmrthhpzp00711yax0u3mc7o6',
    'cmrtg0wbc001e1yx29o5t8rif',
    'cmr89b4oc00kj1yw2ydxc7lrf',
    'cmr4m1i0n006w1y1es8cei0x1',
    '9c18482f-a03f-40a0-8efd-7c3a0218f735',
    'b1x396959c176153b243af9d811',
    'plt0dd804bb9b598275073184c3',
    'cmrr4t1u0000k1y6pg528ivkh',
    'cmr89zvio00q81yw2dehw8v84',
    'cmrvm5zrm0024jw04sbmd2efy',
    'cmrrvb5me00031yl8l5tii6p9',
    'cmtpw0njn002i1ylc2ttubtxi',
    'cmr85su6800011yr9yvxqw6oe',
    'cmtpx3e8u00as1y6ha53ax9wh',
    'cmtpwso8900471y6hbmzfru0z',
    'cmtpwsnu400421y6h36zbpv6i',
    'cmtpwsmza003r1y6hbfr6o1gh',
    'cmr89vboy01371yr99hpuageu',
    'cmr86o9dt00741yr94txeje4g',
    'cmrqhnyxf00561ypxczqf70wj',
    'cmr891bwq00xf1yr9h77x9i2g',
    'cmrpw0p34004v1ylubp6ief43',
    'cmrvm5yz4001ijw049n92tmhu',
    'cmrrvfikq002i1yl8n8oculdv',
    'cmrsfgn5700511yny1hwg9imh',
    'cmru6qyus002ml1046skcnxf2',
    'b9x08eef0a62b9d0649adcfea20',
    'cmru6qzlx0031l1044rxkc2pn',
    'cmrsfd35x00321ynyq5erb2w2',
    'cmrpw5xp0006w1ylu2a8o5cb4',
    'cmr86y8pw009j1yr9awm48k2v',
    'cmrtprxyy000l1yqc3pmh6wc0',
    'cmr4kimu100t61yde1z9b1447',
    'cmrrvvkei00bk1yl8x6g19c6q',
    'c22aa238-8361-41c5-8a93-56e285e0281c',
    '6c25a232-447a-4566-8b3a-2654778b3064',
    '3d0ec122-3947-49d7-ada9-6c1923d3a434',
    'cmr4hnmsb007q1yde54yl7pcg',
    'cmtpwsmwi003q1y6hihvhe7uq',
    'cmrqhwley00751ypxrrhpi8mz',
    'cmr891cek00xk1yr9y99slybu',
    'cmqxdeoer00a01ymachr6ljlg',
    'cmqxdesnf00b71ymakh47svrd',
    'cmr891deo00xu1yr97s3hteu4',
    'cmrpwahuf009q1ylurnf1m2xe',
    'cmr88s01100t81yr97a1ksfnw',
    'cmrrbwb2h0015l104ot4ug6r8',
    'cmr4hzvwr00aq1ydej0741bkr',
    'cmr87smmx00kf1yr9eag6rzkl',
    'cmr877hrt00cw1yr95673if5b',
    'cmrtq47sb00251yqc9009nuai',
    'cmrsrb3bf001fl40496r73pg8',
    'cceb80cf-3d73-400c-b7cc-deb17b291ca0',
    'cmrsrb22f000vl404hxmqp537',
    'f71c7e0c-da4f-49cc-a8b5-ffa35526dd24',
    'cmtpwlh06001k1y6hsekhu6ci',
    'cmtpwzz2400741y6hstk0ysy8',
    'cmtpvy0dm000u1ylcldo2neph',
    'b9xe7d9e6dfa04b9f378a991576',
    'b6x55dd6eb417a0c7f007d87203',
    'b4x3e24a5eb3d7f098bdee1e812',
    'b5xda3b13958d4051a52d401d76',
    'b7x6fdbeca8695031240e5a2f3b',
    'pltc05d1e65c28f3afc7b1d108c',
    'b3x7ba55c81b6a6807d371ff3de',
    'b3x4a2dabd78de1933c561300f8',
    'b4xf93dc3d1c59419885444db7c',
    'b1x6970a37f4ead240bcb74de12',
    'b3xc262bbced297ab7e8a9a958f',
    'b3xcd2bb39ed5c3648a1c123ab4',
    'b1x20c9c71edb762b6e5ef2f21e',
    'b1x2c1b608b49804eef87b7ecde',
    'b3x2160c034da8cfbc5a964c930',
    'b7x8bd39baeb93f70356d62f1ad',
    'b4xefc2dc58903d538c408d7ac8',
    'b8xc8b54e3b5440548b44393d0a',
    'b6x843004d64ee739a71a249c54',
    'b8x240aa2727ea35285fbead1bf',
    'cmr88s2ys00u01yr9omx3g3zw',
    'cmrtexhyh000c1y30m0t8lovi',
    'cmr4gwhst000q1ydefvjtj6c5',
    'cmrtq0v7s001q1yqcygdc32zd',
    'cmr4hno9u00821ydej200idic',
    '7bd2087a-93bc-42c1-8ac8-1da0484d6aec',
    'cmr891ee800y41yr96l2sipc7',
    '607e3ea2-d090-48ca-b372-babe2ed33a6f',
    'ca03f35f-ba97-4e38-a900-32719bb60969',
    'cmqxdy83y001d1y79rx61wczw',
    'cmr9b2enc01au1ywyqmxwu15x',
    'cmru96r8x004q1y0sx6ptfv5t',
    'cmr9buzdm01kf1ywy82opxsb5',
    'cmr4f6dh701pu1yky397pr5qx',
    'cmr98dkkz00h71ywywhzzbztp',
    'cmr8atufa000e1yloazrchfw5',
    'cmr8qfqdz01nb1ygin9j57cbm',
    'cmr8j9s0302kk1ylon9v0kk9m',
    'cmr98dnu400i41ywy3m5tkn3v',
    'cmr8cn9a000nh1ylootexq7kj',
    'cmr8qfqgt01nc1ygicatjc4za',
    'cmr8h1eql01x31ylokjmxz9lx',
    'cmr8h1he201xt1ylozgbye2ng',
    'cmru6qys4002kl104w8g56khi',
    'cmru8hway00a41yd6i7gqzktn',
    'cmr98dmv200hu1ywyj0rd85ht',
    'cmrx1lubr001il705c00n8cs0',
    'cmr4baeou00421ykywheq1yz2',
    'cmr4cbw6800ks1yky3bq8y4vp',
    'cmr97z2ad00bc1ywyh45tv06o',
    'cmr8fz7zy01nd1ylonhqdd1oe',
    'cmr8nmh9200wa1ygi1mbmvnq0',
    'cmr4c4vyr00i81yky4f2n3d98',
    'cmr97qi2l00831ywy0f1oimge',
    'cmr8db8vm00u31ylo12as98es',
    'cmr97qh3s007t1ywynm7eqzoy',
    'cmr8lqgp100d21ygixsmb9teg',
    'cmr97z11900az1ywyov4k1tlp',
    'cmr8g7ard01qp1ylom2o6a8r4',
    'cmr8lqjm900du1ygi0bdlu642',
    'cmr8nmkq400xj1ygifwrv2uvu',
    'cmr8f2lxo01h61ylo9ms02mlf',
    'cmr99iig100ub1ywyl34wyfrt',
    'cmr8bhff4006i1ylo3hdv21ga',
    'cmru7tn2o001g1yd6flymj1p0',
    'cmr8bhj7p007l1ylovxfagwaz',
    'cmr8ncoho00to1ygi7ghvderp',
    'cmr9860ry00dn1ywyzi1svtn0',
    'cmru9cykp007g1y0sz587ou9i',
    'cmr8ncmr900t61ygin88hs08t',
    'cmr8lc5we009z1ygivfcggaqs',
    'cmr9buy1201jz1ywyv6qhkj6a',
    'cmqxe01j400e41yma6y8snsq0',
    'cmr8quz6201q41ygi1ehzwzx5',
    'cmr8ei0oj01ar1ylo2j4qcs59',
    'b572c695-38fb-4b12-a9ac-a5dcdae51662',
    'cmr8ccgwg00kn1ylo90ngavte',
    'cmrwa1ywv001n1ynhwrkj3lkh',
    '0916ff4c-f1e8-4b53-8dce-9faa14f3ade7',
    '0bdc0c21-afa0-40ad-8fb2-0f5d42eac481',
    '0e7382de-a43d-4542-b065-65e263e05ce9',
    'cmrwa0y2a000x1ynhx0k6nbdy',
    '1b35d25d-76d6-4bc6-b063-27d0d5c17c8e',
    'dc430b91-da37-481d-beb1-553095b5b579',
    'b7ff8ff1-001c-4a69-93b7-c556695159fb',
    'cmr8p26lg019p1ygiafdexu19',
    'cmr8isc9602dc1yloekuvu6vs',
    'cmq33a2dp007e1yiurzvru5c0',
    'cmr8gr79d01ua1yloafusp3nt',
    'cmqxeg7s700gf1ymawk72bm1l',
    'cmrvwxwxo005v1ye8q1hqvqvl',
    'cmr8e5y9o017k1ylog5cpqpf1',
    'cmqxdzxp200cs1ymad88el3l9',
    'cmrwa2w5i002e1ynh6o2cvpmh',
    'cmru32kes003j1y7whksb5ds4',
    'cmr8bxxuq00do1ylo9r451m19',
    'cmru8bfsg007l1yd6euupuq5y',
    'cmr8lz0tr00h11ygigykz4yxx',
    'cmru39g6d00831y7wxhclf710',
    'cmruifog0001l1ycelduzbh95',
    'cmr8g7dq201rp1ylo8qttv5d3',
    'cmrx1lugk001nl705dcpbs91q',
    'cmr8hggjo020m1ylovv8kjd0w',
    'cmtpx6cxd000f1ymuqtewjxsg',
    'cmr8mlwcf00nv1ygitr6bbt4y',
    'cmr8atvyl000t1ylomai0a6f3',
    'cmr8diira00xz1ylo132h88u6',
    'cmr8br63k00ak1yloavpirwkg',
    'cmr8n3pw800q01ygita18d8mz'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> 236 THEN
    RAISE EXCEPTION 'backup row count %, expected 236',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_audit240_20261114_stage (
  id text PRIMARY KEY,
  fix_types text NOT NULL,
  scenario text,
  question text NOT NULL,
  options text NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty smallint,
  blueprint_domain text,
  blueprint_topic text,
  source_url text,
  source_label text,
  source_quote text,
  content_hash text NOT NULL,
  active boolean NOT NULL,
  "references" jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id0$cmqxc0tn1000l1ymamy3ui3ub$id0$,
  $fx0$re-key|re-rate|rewrite$fx0$,
  $sc0$A 24-year-old woman comes to the emergency department because of anxiety and tremor. She has used cocaine daily for the past month. Heart rate is 110 beats per minute, blood pressure is 145/90 mm Hg, and the pupils are dilated. She is agitated. A urine toxicology screen is positive for cocaine.$sc0$,
  $qu0$Which mechanism best explains the tachycardia, hypertension, and dilated pupils?$qu0$,
  $op0${"options":["Dopamine release into the nucleus accumbens","Blockade of norepinephrine reuptake pumps","Serotonin reuptake blockade at nerve terminals","GABA-A receptor potentiation at the synapse"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"drug-moa-side-effects","blueprintSystem":"multisystem","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step1-1782622322072","qcScore":8,"slotIndex":22,"stepLevel":"step1","examNumber":9072,"generatedAt":"2026-06-28T04:58:08.079Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op0$,
  $ky0$Blockade of norepinephrine reuptake pumps$ky0$,
  $ex0$Cocaine blocks reuptake of norepinephrine, and that noradrenergic surge produces tachycardia, hypertension, and dilated pupils. Release of dopamine into the nucleus accumbens is the reward effect, and cocaine raises dopamine by blocking reuptake rather than by increasing release. Serotonin reuptake blockade does not account for this blood pressure, heart rate, and pupillary examination. Potentiation at GABA-A receptors would sedate the patient and would not raise the blood pressure or dilate the pupils. The autonomic findings therefore track norepinephrine reuptake blockade.$ex0$,
  3,
  $dm0$multisystem$dm0$,
  $tp0$drug-moa-side-effects$tp0$,
  $su0$https://www.merckmanuals.com/professional/special-subjects/illicit-drugs-and-intoxicants/cocaine$su0$,
  $sl0$Cocaine - Merck Manual Professional Edition: noradrenergic activity causes the sympathomimetic signs$sl0$,
  $sq0$Increased noradrenergic activity accounts for its sympathomimetic effects (tachycardia, hypertension, mydriasis, diaphoresis, vasoconstriction, and hyperthermia).$sq0$,
  $ch0$72b1f00c735dbec3dae502949b7939fa0e955a04e0169d369209612b48359132$ch0$,
  true,
  $ref0$[{"label":"Cocaine - Merck Manual Professional Edition: noradrenergic activity causes the sympathomimetic signs","url":"https://www.merckmanuals.com/professional/special-subjects/illicit-drugs-and-intoxicants/cocaine"}]$ref0$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id1$cmr8f0kst00cz1yazqps0oss0$id1$,
  $fx1$re-rate|re-tag|rewrite$fx1$,
  $sc1$A 32-year-old woman has had two neurologic episodes separated by 4 months. The first was painful loss of vision in one eye that resolved over 3 weeks. She now has 2 weeks of worsening leg weakness. Reflexes are brisk and the Babinski sign is present. MRI shows several ovoid white-matter lesions next to the ventricles. She has no fever.$sc1$,
  $qu1$What is the most likely diagnosis?$qu1$,
  $op1${"kind":"biostats","stepLevel":"step1","blueprintSystem":"behavioral-nervous","blueprintTopic":"ms-pathology","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783292825641","qcScore":8,"slotIndex":17,"stepLevel":"step1","examNumber":9105,"generatedAt":"2026-07-05T23:08:04.535Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Motor-neuron degeneration in cord and cortex","Multiple sclerosis with central demyelination","Monophasic postinfectious encephalomyelitis","Demyelinating neuropathy of peripheral nerves"],"taskCategory":"health-maintenance"}$op1$,
  $ky1$Multiple sclerosis with central demyelination$ky1$,
  $ex1$Two central episodes months apart, brisk reflexes, a Babinski sign, and ovoid white-matter lesions beside the ventricles fit multiple sclerosis. Multiple sclerosis produces varied central deficits with remissions and later exacerbations. Motor-neuron degeneration does not create multifocal white-matter lesions. A monophasic postinfectious encephalomyelitis is a single illness, not attacks separated by months. A peripheral demyelinating neuropathy causes hyporeflexia, and this patient has brisk reflexes and a Babinski sign.$ex1$,
  2,
  $dm1$behavioral-nervous$dm1$,
  $tp1$ms-pathology$tp1$,
  $su1$https://www.merckmanuals.com/professional/neurologic-disorders/demyelinating-disorders/multiple-sclerosis-ms$su1$,
  $sl1$Multiple Sclerosis - Merck Manual Professional Edition: relapsing central deficits and periventricular lesions$sl1$,
  $sq1$Multiple sclerosis is characterized by varied CNS deficits, with remissions and recurring exacerbations.$sq1$,
  $ch1$820b97fbcbf45ef95004bb27011161142ae86d53b6123da0a77e0184ef2f53ad$ch1$,
  true,
  $ref1$[{"label":"Multiple Sclerosis - Merck Manual Professional Edition: relapsing central deficits and periventricular lesions","url":"https://www.merckmanuals.com/professional/neurologic-disorders/demyelinating-disorders/multiple-sclerosis-ms"}]$ref1$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id2$cmr8ccjxd01661yw2p1anttp1$id2$,
  $fx2$re-rate|re-tag|rewrite$fx2$,
  $sc2$A 45-year-old woman has the sudden onset of weakness of the right face and arm, greater than the leg, and nonfluent speech. The deficit has been present for 14 hours. Blood pressure is 180/100 mm Hg. She has hypertension and hyperlipidemia. CT of the head shows a hypodense area in the left lateral cerebrum and no blood.$sc2$,
  $qu2$What is the most likely diagnosis?$qu2$,
  $op2${"options":["Hemorrhage into the cerebral parenchyma","Transient ischemia without tissue injury","Ischemic infarction of cerebral tissue","Primary neoplasm of the cerebral hemisphere"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"stroke-localization","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783288533710","qcScore":8.3,"slotIndex":28,"stepLevel":"step1","examNumber":9114,"generatedAt":"2026-07-05T22:00:54.059Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op2$,
  $ky2$Ischemic infarction of cerebral tissue$ky2$,
  $ex2$By 14 hours a medium or large infarct can appear as a hypodensity on CT, which is what this scan shows. CT is obtained to exclude hemorrhage, and this scan shows no blood. A transient ischemic attack does not leave a visible infarct. A primary brain tumor does not reach maximum deficit at the first moment and then match an acute vascular hypodensity. The sudden deficit with a hypodensity and no blood is ischemic infarction.$ex2$,
  1,
  $dm2$behavioral-nervous$dm2$,
  $tp2$stroke-localization$tp2$,
  $su2$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su2$,
  $sl2$Ischemic Stroke - Merck Manual Professional Edition: infarcts appear as CT hypodensities and CT excludes hemorrhage$sl2$,
  $sq2$Within 6 to 12 hours of ischemia, medium-sized to large infarcts start to become visible as hypodensities.$sq2$,
  $ch2$3eb15b79d61aa1bf60e512d4e871e3b5601dcdb5a3e3e68a336759e01abdcc36$ch2$,
  true,
  $ref2$[{"label":"Ischemic Stroke - Merck Manual Professional Edition: infarcts appear as CT hypodensities and CT excludes hemorrhage","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref2$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id3$cmrpvdqka002e1yncru1gtuh6$id3$,
  $fx3$re-tag|rewrite$fx3$,
  $sc3$A 45-year-old woman with gallstones has had intermittent pain under the right ribs for a month. The pain is now severe, and she is jaundiced. Temperature is 36.8 C, blood pressure is 128/76 mm Hg, and heart rate is 84 beats per minute. The right upper abdomen is tender and the sclerae are yellow. AST is 150 U/L, ALT is 180 U/L, alkaline phosphatase is 300 U/L, and the leukocyte count is 8000/mcL.$sc3$,
  $qu3$What is the most likely diagnosis?$qu3$,
  $op3${"kind":"biostats","stepLevel":"step1","blueprintSystem":"gastrointestinal","blueprintTopic":"liver-pathology","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784348853328","qcScore":8.4,"slotIndex":10,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:28:18.571Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Ascending bacterial cholangitis of the bile duct","Choledocholithiasis with bile-duct obstruction","Acute cholecystitis within the gallbladder wall","Acute viral hepatitis with injured hepatocytes"],"taskCategory":"communication"}$op3$,
  $ky3$Choledocholithiasis with bile-duct obstruction$ky3$,
  $ex3$Pain under the right ribs, jaundice, gallstones, and a high alkaline phosphatase indicate biliary obstruction by a duct stone. More complete obstruction causes jaundice and only later ascending infection. Cholangitis adds fever or chills, and this patient is afebrile with a normal leukocyte count and stable blood pressure. Gallbladder-wall inflammation typically brings fever without this jaundice and alkaline phosphatase rise. Viral hepatitis is not tied to known gallstones and a tender right upper abdomen in this pattern. The illness is choledocholithiasis without cholangitis.$ex3$,
  2,
  $dm3$gastrointestinal$dm3$,
  $tp3$liver-pathology$tp3$,
  $su3$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis$su3$,
  $sl3$Choledocholithiasis and Cholangitis - Merck Manual Professional Edition: obstruction causes jaundice before infected cholangitis$sl3$,
  $sq3$More complete obstruction causes duct dilation, jaundice and, eventually, ascending cholangitis with bacterial infection.$sq3$,
  $ch3$5ec217b22217fd7f35552ea681cd50dcb0015ae5634fb42c5077bf2338f49ec9$ch3$,
  true,
  $ref3$[{"label":"Choledocholithiasis and Cholangitis - Merck Manual Professional Edition: obstruction causes jaundice before infected cholangitis","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$ref3$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id4$cmrr4ydcr002q1y6pfnfazodg$id4$,
  $fx4$re-rate|re-tag$fx4$,
  $sc4$A 45-year-old woman presents to the emergency department with jaundice and abdominal pain. She has a history of obesity and type 2 diabetes. On examination, her vital signs are stable, but she has scleral icterus and tenderness in the right upper quadrant. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and an alkaline phosphatase level of 250 U/L. An abdominal ultrasound shows gallstones in the gallbladder and a dilated common bile duct.$sc4$,
  $qu4$What is the most likely mechanism of this patient's condition?$qu4$,
  $op4${"options":["Obstruction of the common bile duct due to gallstones","Infection of the bile duct leading to cholangitis","Autoimmune destruction of bile ducts (immune destruction of the bile ducts)","Hepatocellular injury due to alcohol consumption"],"distractorRationale":{"Infection of the bile duct leading to cholangitis":"This option is incorrect because the patient does not exhibit signs of infection such as fever or leukocytosis, which are typically present in cholangitis.","Autoimmune destruction of bile ducts (immune destruction of the bile ducts)":"This option is not correct as primary biliary cholangitis usually presents with different symptoms and lab findings, including antimitochondrial antibodies.","Hepatocellular injury due to alcohol consumption":"This option is incorrect because the liver enzyme pattern does not suggest alcohol-related liver disease, which typically shows a higher AST/ALT ratio."},"clinicalReasoning":"Assess the patient's symptoms of jaundice and abdominal pain, analyze the lab findings indicating elevated alkaline phosphatase, and integrate the ultrasound results showing gallstones to conclude that the obstruction of the common bile duct is the most likely mechanism.","keyTakeaways":["When evaluating jaundice, prioritize identifying biliary obstruction, especially in the presence of gallstones."],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"ethics-professionalism","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784425396655","qcScore":8.1,"slotIndex":19,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-19T01:45:15.210Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op4$,
  $ky4$Obstruction of the common bile duct due to gallstones$ky4$,
  $ex4$## Why this answer is correct
The patient's condition is caused by obstruction of the common bile duct due to gallstones.
• **Jaundice** and **abdominal pain** indicate a potential biliary obstruction.
• Elevated **alkaline phosphatase** suggests cholestasis (bile flow blockage).
• Ultrasound findings of **gallstones** and a **dilated common bile duct** confirm the obstruction.
**In practice:** In practice, recognizing gallstone obstruction is crucial for timely intervention to prevent complications like cholangitis or pancreatitis.
## Why the other options are wrong



**Infection of the bile duct leading to cholangitis**
• Trap: Students may think cholangitis is common with jaundice and abdominal pain.
• Why it fails here: This patient lacks fever and leukocytosis, which are key indicators of cholangitis.
• Remember: Cholangitis typically follows biliary obstruction but requires additional signs of infection.

**Autoimmune destruction of bile ducts (immune destruction of the bile ducts)**
• Trap: Some may confuse primary biliary cholangitis with gallstone obstruction due to similar symptoms.
• Why it fails here: Primary biliary cholangitis usually presents with different lab findings, such as elevated antimitochondrial antibodies, and is more common in women over 40.
• Remember: Understanding the demographics and lab findings helps differentiate autoimmune conditions from obstructive causes.

**Hepatocellular injury due to alcohol consumption**
• Trap: Students might associate elevated liver enzymes with alcohol-related liver disease.
• Why it fails here: In this case, the elevated alkaline phosphatase and the presence of gallstones point to biliary obstruction rather than hepatocellular injury, which would show a different enzyme pattern.
• Remember: Recognizing the specific enzyme patterns helps clarify the underlying mechanism of liver dysfunction.
## Key takeaway
**When evaluating jaundice, prioritize identifying biliary obstruction, especially in the presence of gallstones.**

**Memory hook:** Remember the '4 Fs' for gallstones: female, fat, fertile, and forty.$ex4$,
  2,
  $dm4$gastrointestinal$dm4$,
  $tp4$liver-pathology$tp4$,
  NULL,
  NULL,
  NULL,
  $ch4$9a19c30207b0dcd7bc5e359fabbb9e6dc07178a59ed21f05dbd3128c3b97df33$ch4$,
  true,
  $ref4$[{"label":"Gastrointestinal Pathophysiology Guidelines"}]$ref4$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id5$cmrth8awr005c1yax9bwjn86i$id5$,
  $fx5$re-rate|re-tag$fx5$,
  $sc5$A 60-year-old man with a history of chronic alcohol use presents with confusion and ataxia. He has a low serum magnesium level of 1.2 mg/dL (normal range 1.7-2.2 mg/dL) and a history of recurrent vomiting. Neurological examination reveals nystagmus and ophthalmoplegia.$sc5$,
  $qu5$What is the most likely underlying mechanism of this patient's condition?$qu5$,
  $op5${"options":["Thiamine deficiency leading to Wernicke's encephalopathy","Vitamin B12 deficiency causing subacute combined degeneration","Hypomagnesemia affecting neuromuscular transmission","Folate deficiency leading to megaloblastic anemia"],"distractorRationale":{"Vitamin B12 deficiency causing subacute combined degeneration":"This option fails as it does not explain the acute presentation or the specific symptoms of confusion and ophthalmoplegia.","Hypomagnesemia affecting neuromuscular transmission":"This option is incorrect because while hypomagnesemia can cause neuromuscular symptoms, it does not account for the classic triad of Wernicke's encephalopathy.","Folate deficiency leading to megaloblastic anemia":"This option is misleading as folate deficiency does not typically present with neurological symptoms like those seen in this patient."},"clinicalReasoning":"The symptoms and history of alcohol use point to thiamine deficiency, leading to Wernicke's encephalopathy, which is characterized by the classic triad of confusion, ataxia, and ophthalmoplegia.","keyTakeaways":["When assessing a patient with confusion and ataxia, especially with a history of alcohol use, prioritize thiamine deficiency as a potential cause."],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"ethics-professionalism","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784566857884","qcScore":8.1,"slotIndex":32,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-20T17:02:55.148Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op5$,
  $ky5$Thiamine deficiency leading to Wernicke's encephalopathy$ky5$,
  $ex5$## Why this answer is correct
Thiamine deficiency leading to Wernicke's encephalopathy is the most likely underlying mechanism.
• **Wernicke's encephalopathy** is characterized by confusion, ataxia, and ophthalmoplegia.
• Chronic **alcohol use** often results in poor nutritional intake, particularly of thiamine (vitamin B1).
• The **neurological symptoms** presented align with classic signs of thiamine deficiency.
**In practice:** In practice, recognizing Wernicke's encephalopathy is critical, as timely thiamine administration can prevent progression to Korsakoff syndrome, a more severe condition.
## Why the other options are wrong



**Vitamin B12 deficiency causing subacute combined degeneration**
• Trap: Students may confuse the neurological symptoms with those seen in vitamin B12 deficiency.
• Why it fails here: However, vitamin B12 deficiency typically presents with subacute combined degeneration of the spinal cord, leading to symptoms like weakness and sensory loss, not the acute confusion and ophthalmoplegia seen here.
• Remember: This highlights the importance of differentiating between types of neurological deficits based on vitamin deficiencies.

**Hypomagnesemia affecting neuromuscular transmission**
• Trap: Some may think that low magnesium levels alone could explain the neurological symptoms.
• Why it fails here: While hypomagnesemia can cause neuromuscular symptoms such as muscle cramps or spasms, it does not account for the specific neurological findings of confusion and ophthalmoplegia.
• Remember: This reinforces the need to connect specific symptoms to the correct deficiency.

**Folate deficiency leading to megaloblastic anemia**
• Trap: Students might assume that any vitamin deficiency could lead to neurological symptoms.
• Why it fails here: Folate deficiency primarily results in megaloblastic anemia and does not typically cause the acute neurological symptoms observed in this patient.
• Remember: Understanding the specific clinical manifestations of each deficiency is crucial for accurate diagnosis.
## Key takeaway
**When assessing a patient with confusion and ataxia, especially with a history of alcohol use, prioritize thiamine deficiency as a potential cause.**

**Memory hook:** Remember: **Wernicke's** = **W**eakness, **E**thanol, **N**ystagmus, **C**onfusion, **K**orsakoff if untreated.$ex5$,
  2,
  $dm5$behavioral-nervous$dm5$,
  $tp5$psychiatric-pharmacology$tp5$,
  NULL,
  NULL,
  NULL,
  $ch5$57bc163563f91571cb0e46069f5d925db48d889fa0514f00d164a0ec30e2a3b2$ch5$,
  true,
  $ref5$[{"label":"USMLE Content Outline 2026"}]$ref5$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id6$cmrpwiwl0006t1yrthg9m5uvm$id6$,
  $fx6$re-tag$fx6$,
  $sc6$A 55-year-old woman presents to the emergency department with a complaint of severe abdominal pain and jaundice. She has a history of chronic alcohol use and has been experiencing weight loss over the past few months. On examination, she has a temperature of 38.2°C (100.8°F) and scleral icterus. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 120 U/L) and a total bilirubin of 5.2 mg/dL. An abdominal ultrasound shows gallstones in the gallbladder and a dilated common bile duct.$sc6$,
  $qu6$Which pathophysiologic process best explains these findings?$qu6$,
  $op6${"options":["Obstruction of the common bile duct due to gallstones","Hepatic parenchymal damage due to alcohol toxicity","Acute pancreatitis secondary to gallstone disease (sudden inflammation of the pancreas)","Intrahepatic cholestasis due to liver cirrhosis"],"distractorRationale":{"Hepatic parenchymal damage due to alcohol toxicity":"This option is incorrect because while alcohol can cause liver damage, it does not explain the acute presentation of jaundice and the findings of biliary obstruction.","Acute pancreatitis secondary to gallstone disease (sudden inflammation of the pancreas)":"This option is incorrect as the primary issue in this vignette is biliary obstruction, not pancreatitis, which would present differently.","Intrahepatic cholestasis due to liver cirrhosis":"This option is incorrect because there is no evidence of cirrhosis in this patient; the ultrasound findings suggest a mechanical obstruction."},"clinicalReasoning":"The patient's symptoms of abdominal pain and jaundice, along with laboratory findings of elevated liver enzymes and bilirubin, suggest a problem with bile flow. The ultrasound findings of gallstones and a dilated common bile duct confirm the diagnosis of obstruction due to gallstones, leading to cholestasis.","keyTakeaways":["When evaluating jaundice, prioritize identifying potential obstructions like gallstones in the bile duct."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"sdoh-health-equity","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350723633","qcScore":8.2,"slotIndex":16,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-18T05:01:38.151Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op6$,
  $ky6$Obstruction of the common bile duct due to gallstones$ky6$,
  $ex6$## Why this answer is correct
Obstruction of the common bile duct due to gallstones explains the patient's jaundice and elevated bilirubin.
• **Cholestasis** (bile flow blockage) is indicated by jaundice and high bilirubin levels.
• Ultrasound shows **gallstones** and a **dilated common bile duct**, confirming obstruction.
• The patient's **history of alcohol use** complicates liver health but does not directly cause the current biliary obstruction.
**In practice:** In practice, recognizing biliary obstruction is crucial as it can lead to serious complications like cholangitis. Prompt intervention can prevent further liver damage.
## Why the other options are wrong



**Hepatic parenchymal damage due to alcohol toxicity**
• Trap: Students may think alcohol damage is the primary cause of jaundice in all cases.
• Why it fails here: While alcohol can cause liver damage, it does not account for the acute biliary obstruction and elevated bilirubin seen here.
• Remember: This option fails because the acute presentation is more consistent with obstruction rather than chronic liver damage.

**Acute pancreatitis secondary to gallstone disease (sudden inflammation of the pancreas)**
• Trap: Some may confuse biliary obstruction with pancreatitis as both can occur with gallstones.
• Why it fails here: The primary issue in this vignette is the obstruction of the bile duct, not the pancreas, which is not indicated by the ultrasound findings.
• Remember: This option is incorrect because the patient's symptoms and imaging point to biliary obstruction rather than pancreatitis.

**Intrahepatic cholestasis due to liver cirrhosis**
• Trap: Students might assume that jaundice is always due to liver cirrhosis.
• Why it fails here: There is no evidence of cirrhosis in this patient, and the ultrasound findings suggest an obstruction rather than intrahepatic issues.
• Remember: This option fails because the clinical picture aligns more with extrahepatic obstruction than intrahepatic cholestasis.
## Key takeaway
**When evaluating jaundice, prioritize identifying potential obstructions like gallstones in the bile duct.**

**Memory hook:** Think of gallstones as 'traffic jams' in the bile duct causing jaundice.$ex6$,
  2,
  $dm6$gastrointestinal$dm6$,
  $tp6$liver-pathology$tp6$,
  NULL,
  NULL,
  NULL,
  $ch6$cd6ce236ee22e0fc561a7f903549d8c44eddc7091cf155abc6eec084817a92ea$ch6$,
  true,
  $ref6$[{"label":"Gastroenterology textbooks on biliary obstruction and gallstone disease"}]$ref6$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id7$cmrrtw7wp009n1y8wv1sune9p$id7$,
  $fx7$re-rate|re-tag|rewrite$fx7$,
  $sc7$A 35-year-old man has had weight gain, fatigue, and increased thirst. He is sedentary, and a parent has diabetes. Fasting plasma glucose is 130 mg/dL and hemoglobin A1c is 6.5%. He has not had vomiting or deep, rapid breathing.$sc7$,
  $qu7$Which process best explains the hyperglycemia?$qu7$,
  $op7${"options":["Autoimmune destruction of pancreatic beta cells","Excess insulin secretion from an islet tumor","Insulin resistance with inadequate secretion","Exocrine pancreatic enzyme secretion failure"],"kind":"vignette","taskCategory":"communication","blueprintTopic":"diabetes-pathophysiology","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784467289628","qcScore":8,"slotIndex":35,"stepLevel":"step1","examNumber":9105,"generatedAt":"2026-07-19T13:22:12.265Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$op7$,
  $ky7$Insulin resistance with inadequate secretion$ky7$,
  $ex7$Thirst with an elevated fasting glucose and hemoglobin A1c, weight gain, inactivity, and a family history fit type 2 diabetes. Type 2 diabetes is insulin resistance together with insulin secretion that is inadequate for that resistance. Autoimmune destruction of beta cells is the mechanism of type 1 diabetes, which this gradual adult course without ketoacidosis does not suggest. An islet-cell tumor secretes excess insulin and causes hypoglycemia rather than fasting hyperglycemia. Loss of exocrine enzyme secretion causes maldigestion, not a high glucose.$ex7$,
  1,
  $dm7$reproductive-endocrine$dm7$,
  $tp7$diabetes-pathophysiology$tp7$,
  $su7$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus$su7$,
  $sl7$Type 2 Diabetes Mellitus - Merck Manual Professional Edition: insulin resistance with inadequate insulin secretion$sl7$,
  $sq7$Type 2 diabetes mellitus is characterized by insulin resistance and inadequate insulin secretion relative to needs.$sq7$,
  $ch7$e4d7fa1ac09421c1fddd0d01e6b60fd1ea31ce64bb6d15e5b0e3ec31c6e4b457$ch7$,
  true,
  $ref7$[{"label":"Type 2 Diabetes Mellitus - Merck Manual Professional Edition: insulin resistance with inadequate insulin secretion","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus"}]$ref7$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id8$cmrsewbcg000v1y55qfwcsddx$id8$,
  $fx8$re-rate|re-tag$fx8$,
  $sc8$A 28-year-old man presents to the emergency department with severe epigastric pain radiating to his back, accompanied by nausea and vomiting. He has a history of alcohol use disorder and reports not eating for the past two days due to abdominal discomfort. Laboratory tests reveal elevated serum amylase at 450 U/L and lipase at 600 U/L, consistent with acute pancreatitis.$sc8$,
  $qu8$What is the underlying mechanism of this patient's condition?$qu8$,
  $op8${"options":["Increased pancreatic duct pressure","Inhibition of pancreatic enzyme secretion (less secretion of pancreatic enzymes)","Activation of pancreatic enzymes within the pancreas","Decreased blood flow to the pancreas"],"distractorRationale":{"Increased pancreatic duct pressure":"While increased duct pressure can contribute to the development of pancreatitis, it is not the primary mechanism causing the condition in this case. (Understanding that the primary issue is enzyme activation clarifies the pathophysiology of acute pancreatitis.)","Inhibition of pancreatic enzyme secretion (less secretion of pancreatic enzymes)":"This option fails because acute pancreatitis is characterized by elevated enzyme levels, not inhibition of their secretion. (Recognizing that enzyme activation, rather than inhibition, is key to understanding acute pancreatitis.)","Decreased blood flow to the pancreas":"Decreased blood flow is not a recognized mechanism for acute pancreatitis and does not explain the elevated enzyme levels seen in this patient. (Linking the condition to enzyme activation rather than blood flow issues is essential for accurate diagnosis.)"},"clinicalReasoning":"The primary mechanism of acute pancreatitis is the activation of pancreatic enzymes within the pancreas. **Acute pancreatitis** occurs when pancreatic enzymes become activated prematurely. This leads to **autodigestion**, where the pancreas essentially digests itself.","keyTakeaways":["When diagnosing acute pancreatitis, prioritize understanding the activation of pancreatic enzymes as the core mechanism."],"taskCategory":"professionalism","blueprintTopic":"aki-mechanisms","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784502584405","qcScore":8.1,"slotIndex":33,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T23:10:31.400Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op8$,
  $ky8$Activation of pancreatic enzymes within the pancreas$ky8$,
  $ex8$## Why this answer is correct
The primary mechanism of acute pancreatitis is the activation of pancreatic enzymes within the pancreas.
• **Acute pancreatitis** occurs when pancreatic enzymes become activated prematurely.
• This leads to **autodigestion**, where the pancreas essentially digests itself.
• Risk factors include **alcohol use** and fasting, both of which this patient has.
• Elevated **amylase** and **lipase** confirm the diagnosis.
**In practice:** At the bedside, recognizing this mechanism is crucial for effective management and prevention of complications. It helps guide treatment strategies, such as addressing the underlying causes and monitoring for potential complications.
## Why the other options are wrong



**Increased pancreatic duct pressure**
• Trap: Students may think that duct pressure is the main issue leading to pancreatitis.
• Why it fails here: While increased duct pressure can contribute to the development of pancreatitis, it is not the primary mechanism causing the condition in this case.
• Remember: Understanding that the primary issue is enzyme activation clarifies the pathophysiology of acute pancreatitis.

**Inhibition of pancreatic enzyme secretion (less secretion of pancreatic enzymes)**
• Trap: Some may believe that reduced secretion of enzymes is a cause of pancreatitis.
• Why it fails here: This option fails because acute pancreatitis is characterized by elevated enzyme levels, not inhibition of their secretion.
• Remember: Recognizing that enzyme activation, rather than inhibition, is key to understanding acute pancreatitis.

**Decreased blood flow to the pancreas**
• Trap: Students might confuse ischemia (reduced blood flow) with the mechanisms of pancreatitis.
• Why it fails here: Decreased blood flow is not a recognized mechanism for acute pancreatitis and does not explain the elevated enzyme levels seen in this patient.
• Remember: Linking the condition to enzyme activation rather than blood flow issues is essential for accurate diagnosis.
## Key takeaway
**When diagnosing acute pancreatitis, prioritize understanding the activation of pancreatic enzymes as the core mechanism.**

**Memory hook:** Remember: 'Activated enzymes attack!' — they digest the pancreas itself.$ex8$,
  2,
  $dm8$gastrointestinal$dm8$,
  $tp8$pancreatitis-enzymes$tp8$,
  NULL,
  NULL,
  NULL,
  $ch8$0ec79af272fed4cc7aeddba83c694bfd1dc21a2ae396bb7c4b5718920dc54295$ch8$,
  true,
  $ref8$[{"url":"https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis","label":"Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself."}]$ref8$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id9$cmrru3r3m00bj1y8wn8sztwo1$id9$,
  $fx9$re-rate|re-tag|rewrite$fx9$,
  $sc9$A 50-year-old woman has a severe headache and blurred vision. Blood pressure is 180/110 mm Hg. She has hypertension treated with lisinopril. Both retinas show hemorrhages.$sc9$,
  $qu9$Which mechanism best explains the retinal hemorrhages?$qu9$,
  $op9${"options":["Protective vasoconstriction of brain vessels","Rupture of a coronary atherosclerotic plaque","Pressure transmitted into the capillary bed","Acute hemorrhage reducing circulating volume"],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"hypertension-mechanisms","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784467535092","qcScore":8.3,"slotIndex":24,"stepLevel":"step1","examNumber":9106,"generatedAt":"2026-07-19T13:26:16.660Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"clinical-intervention"}$op9$,
  $ky9$Pressure transmitted into the capillary bed$ky9$,
  $ex9$Blood pressure of 180/110 mm Hg with headache, blurred vision, and retinal hemorrhages is a hypertensive emergency. When autoregulation fails, the vessels dilate and the high pressure is transmitted into the capillary bed, with exudation of plasma. Retinal hemorrhage is part of the retinopathy seen in this emergency. Protective vasoconstriction is the response that has failed, so it does not explain the hemorrhages. Coronary plaque rupture causes myocardial ischemia, which is not this examination. Acute blood loss would lower the blood pressure.$ex9$,
  3,
  $dm9$cardiovascular$dm9$,
  $tp9$hypertension-mechanisms$tp9$,
  $su9$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies$su9$,
  $sl9$Hypertensive Emergencies - Merck Manual Professional Edition: failed autoregulation transmits pressure into capillaries$sl9$,
  $sq9$As a result, the very high BP is transmitted directly to the capillary bed with transudation and exudation of plasma into the brain, causing cerebral edema, including papilledema.$sq9$,
  $ch9$dd93832238885435ffad16f411ef332bc4285a0b7cd15c57e6df015c60e708b2$ch9$,
  true,
  $ref9$[{"label":"Hypertensive Emergencies - Merck Manual Professional Edition: failed autoregulation transmits pressure into capillaries","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies"}]$ref9$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id10$cmrrum1cu00hi1y8wrru12a6s$id10$,
  $fx10$re-tag$fx10$,
  $sc10$A 68-year-old man is admitted to the emergency department with acute respiratory distress. He has a history of chronic obstructive pulmonary disease (COPD) and is currently on a bronchodilator. On examination, he is tachypneic with a respiratory rate of 28 breaths per minute and an oxygen saturation of 88% on room air. Arterial blood gas analysis reveals a pH of 7.30, PaCO2 of 60 mmHg, and PaO2 of 55 mmHg. He is wheezing. The chest radiograph shows hyperinflation and no focal consolidation.$sc10$,
  $qu10$Which of the following best explains the patient's finding?$qu10$,
  $op10${"kind":"exhibit","stepLevel":"step1","blueprintSystem":"respiratory-renal","blueprintTopic":"ards-pathology","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784468457420","qcScore":8,"slotIndex":7,"stepLevel":"step1","examNumber":9109,"generatedAt":"2026-07-19T13:42:16.064Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"title":"Chest X-ray Findings","description":"Bilateral infiltrates consistent with ARDS.","findings":["Bilateral opacities","No pleural effusions","Increased vascular markings"],"options":["The increased pulmonary capillary permeability due to inflammation","Decreased surfactant production leading to atelectasis","Increased airway resistance causing ventilation-perfusion mismatch","Decreased pulmonary blood flow due to hypoventilation"],"taskCategory":"clinical-intervention"}$op10$,
  $ky10$Increased airway resistance causing ventilation-perfusion mismatch$ky10$,
  $ex10$He has a COPD exacerbation: wheeze, hyperinflation without consolidation, hypoxemia, and CO2 retention. Airflow obstruction raises airway resistance and causes ventilation-perfusion mismatch. Bilateral inflammatory permeability and surfactant loss describe ARDS, which this radiograph does not show. Hypoventilation does not decrease pulmonary blood flow as the main mechanism here.$ex10$,
  2,
  $dm10$respiratory-renal$dm10$,
  $tp10$asthma-copd-pathology$tp10$,
  NULL,
  NULL,
  NULL,
  $ch10$34588a2af05fc1dbdbe7fe74ce514fe25d87a082a0eb551f7bb7ecace708fdf7$ch10$,
  true,
  $ref10$[{"label":"Acute Respiratory Distress Syndrome: Pathophysiology and Management"}]$ref10$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id11$cmrpvuy8z000v1yh5a2u8z3wc$id11$,
  $fx11$re-rate|re-tag$fx11$,
  $sc11$A 58-year-old woman with type 2 diabetes for 15 years and hypertension is seen because her creatinine has risen. She has had no acute illness. Blood pressure is 148/88 mm Hg. Fundoscopy shows retinal microaneurysms. Creatinine is 2.1 mg/dL, up from 1.4 mg/dL one year ago. Urinalysis shows 3+ protein and no red blood cells or casts.$sc11$,
  $qu11$What is the most likely diagnosis?$qu11$,
  $op11${"options":["Chronic kidney disease","Diabetic nephropathy","Acute glomerulonephritis","Hypertensive nephrosclerosis"],"distractorRationale":{"Chronic kidney disease":"This option is too broad and does not specify the underlying cause, which is essential for diagnosis.","Acute glomerulonephritis":"This condition usually presents with acute symptoms and specific urinalysis findings such as casts, which are not mentioned in this case.","Hypertensive nephrosclerosis":"While this can cause renal impairment, the significant proteinuria and history of diabetes are more indicative of diabetic nephropathy."},"clinicalReasoning":"Assess the patient's symptoms and lab results to identify the underlying cause of her renal impairment. Analyze the presence of proteinuria and the patient's history of diabetes to integrate the findings and arrive at the diagnosis of diabetic nephropathy.","keyTakeaways":["When evaluating renal impairment in diabetic patients, prioritize the presence of proteinuria as a key indicator of diabetic nephropathy."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"transplant-immunology","blueprintSystem":"hematology-immunology","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349531909","qcScore":8.4,"slotIndex":33,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:44:01.975Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op11$,
  $ky11$Diabetic nephropathy$ky11$,
  $ex11$Longstanding diabetes, retinopathy, a slow creatinine rise, and heavy proteinuria without hematuria or casts is diabetic nephropathy. Acute glomerulonephritis would show hematuria and red-cell casts over days. Hypertensive nephrosclerosis causes less proteinuria. 'Chronic kidney disease' names the stage, not the diabetic lesion.$ex11$,
  3,
  $dm11$respiratory-renal$dm11$,
  $tp11$glomerular-diseases$tp11$,
  NULL,
  NULL,
  NULL,
  $ch11$986440c21ff178f0ab2b5e17fe5d9460c4be3197192ec5776401f5d30c328c17$ch11$,
  true,
  $ref11$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13501257/","label":"Food Sci Nutr. 2026. Effects of Naringenin on Diabetic Nephropathy: A Systematic Review and Meta-Analysis of Rodent Studies. Diabetic nephropathy (DN) is a common complication of diabetes."}]$ref11$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id12$cmrpvyvwe000f1yrtcrs99gnc$id12$,
  $fx12$re-rate|re-tag|rewrite$fx12$,
  $sc12$A 45-year-old woman has sudden shortness of breath and pleuritic chest pain that began at rest. Blood pressure is 100/60 mm Hg, heart rate is 110 beats per minute, and oxygen saturation is 88% on room air. Temperature is 36.9 C and the lungs are clear. She had a deep-vein thrombosis last year and takes an oral contraceptive. The pain is not tearing, and the limb pulses are symmetric.$sc12$,
  $qu12$What is the most likely diagnosis?$qu12$,
  $op12${"options":["Bacterial infection of the lung tissue","Embolus lodged in a pulmonary artery","Acute coronary artery plaque rupture","Tear through layers of the aortic wall"],"taskCategory":"clinical-intervention","blueprintTopic":"pe-pathophysiology","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349795144","qcScore":7.8,"slotIndex":15,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:46:11.440Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op12$,
  $ky12$Embolus lodged in a pulmonary artery$ky12$,
  $ex12$Sudden dyspnea and pleuritic pain, tachycardia, a low blood pressure, and hypoxemia with clear lungs form the usual pattern of pulmonary embolism. A prior deep-vein thrombosis and an oral contraceptive are risk factors for that embolism. Lung infection is unlikely when the temperature is normal and the lungs are clear. Coronary plaque rupture is not the cause of pleuritic pain with this degree of hypoxemia and a previous leg clot. A tear through the aortic wall causes tearing pain and unequal pulses, which are absent here.$ex12$,
  1,
  $dm12$respiratory-renal$dm12$,
  $tp12$pe-pathophysiology$tp12$,
  $su12$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$su12$,
  $sl12$Pulmonary Embolism - Merck Manual Professional Edition: sudden dyspnea and pleuritic pain; oral contraceptives are a risk factor$sl12$,
  $sq12$Symptoms of pulmonary embolism are nonspecific and include dyspnea, pleuritic chest pain, and, in more severe cases, light-headedness, presyncope, syncope, or cardiorespiratory arrest.$sq12$,
  $ch12$115b7ff4907140c2a860279395df1d792b1a0d3631d6af84d3a90b7049b9518f$ch12$,
  true,
  $ref12$[{"label":"Pulmonary Embolism - Merck Manual Professional Edition: sudden dyspnea and pleuritic pain; oral contraceptives are a risk factor","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$ref12$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id13$cmrpw57oa002l1yrtbo2dzb2f$id13$,
  $fx13$re-rate|re-tag$fx13$,
  $sc13$A 45-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of chronic alcohol use and has been experiencing increasing fatigue over the past month. On examination, she has jaundice and ascites. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 120 U/L), bilirubin 3.5 mg/dL, and a prothrombin time of 18 seconds. An abdominal ultrasound shows hepatomegaly and ascitic fluid.$sc13$,
  $qu13$What is the most likely diagnosis?$qu13$,
  $op13${"options":["Alcoholic hepatitis","Cholecystitis","Pancreatitis","Hepatocellular carcinoma"],"distractorRationale":{"Cholecystitis":"Cholecystitis typically presents with right upper quadrant pain and signs of gallbladder inflammation, not with jaundice and ascites.","Pancreatitis":"Pancreatitis usually presents with elevated amylase/lipase levels and abdominal pain, not primarily with jaundice and ascites.","Hepatocellular carcinoma":"While hepatocellular carcinoma can cause liver dysfunction, it usually presents with more chronic symptoms or a mass on imaging."},"clinicalReasoning":"The patient's history of chronic alcohol use and acute presentation with jaundice and ascites suggest liver injury. The elevated liver enzymes indicate hepatocellular damage, consistent with alcoholic hepatitis. The acute nature of her symptoms, combined with the findings of ascites, supports this diagnosis.","keyTakeaways":["When assessing a patient with chronic alcohol use and acute liver dysfunction, suspect alcoholic hepatitis first."],"kind":"calculation","taskCategory":"diagnosis","blueprintTopic":"biostatistics-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350086595","qcScore":8.3,"slotIndex":12,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:49:47.559Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op13$,
  $ky13$Alcoholic hepatitis$ky13$,
  $ex13$## Why this answer is correct
The patient's symptoms and history strongly indicate alcoholic hepatitis.
• **Chronic alcohol use** is a key risk factor for liver disease.
• Symptoms like **jaundice** and **ascites** suggest significant liver dysfunction.
• Elevated **liver enzymes** (AST and ALT) support the diagnosis of liver inflammation.
**In practice:** On the unit, recognizing alcoholic hepatitis early can guide management and prevent complications. Patients often require supportive care and monitoring for liver failure.
## Why the other options are wrong



**Cholecystitis**
• Trap: Students may confuse abdominal pain from liver dysfunction with gallbladder issues.
• Why it fails here: Cholecystitis typically presents with right upper quadrant pain, fever, and signs like Murphy's sign, which are absent here.
• Remember: The systemic signs of liver dysfunction (jaundice, ascites) point away from cholecystitis.

**Pancreatitis**
• Trap: Some may think abdominal pain and vomiting automatically indicate pancreatitis.
• Why it fails here: Pancreatitis would usually show elevated amylase and lipase levels, which are not reported in this case.
• Remember: The liver enzyme elevation and jaundice are more indicative of liver inflammation rather than pancreatic issues.

**Hepatocellular carcinoma**
• Trap: Students might consider hepatocellular carcinoma due to the presence of liver dysfunction.
• Why it fails here: Hepatocellular carcinoma typically presents with chronic symptoms and is less likely to present acutely without prior signs of liver disease.
• Remember: The acute presentation and history of alcohol use align more closely with alcoholic hepatitis than with cancer.
## Key takeaway
**When assessing a patient with chronic alcohol use and acute liver dysfunction, suspect alcoholic hepatitis first.**

**Memory hook:** Remember: **Alcohol** leads to **A**lcoholic hepatitis, especially with **A**scites and **A**bdominal pain.$ex13$,
  2,
  $dm13$gastrointestinal$dm13$,
  $tp13$liver-pathology$tp13$,
  NULL,
  NULL,
  NULL,
  $ch13$df657302e9ad474d58433db658533e73f4b897ee3d3bc9761c1064587b9ed966$ch13$,
  true,
  $ref13$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/","label":"JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments."}]$ref13$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id14$cmrpwfgru007c1yh5uv5lpw3o$id14$,
  $fx14$re-rate|re-tag|rewrite$fx14$,
  $sc14$A 58-year-old man has had jaundice and dark urine for one week, with fatigue and pain under the right ribs. He drinks heavily every day, and the liver is enlarged and tender. Blood pressure is 128/74 mm Hg. Total bilirubin is 4.5 mg/dL, direct bilirubin is 3.0 mg/dL, AST is 240 U/L, ALT is 96 U/L, and alkaline phosphatase is 115 U/L. Hepatitis C RNA was undetectable after recent treatment.$sc14$,
  $qu14$What is the most likely diagnosis?$qu14$,
  $op14${"options":["Recurrent hepatitis C with active viremia","Choledocholithiasis blocking the bile duct","Alcoholic hepatitis with hepatocyte injury","Ischemic hepatitis from hepatic hypoperfusion"],"taskCategory":"diagnosis","blueprintTopic":"liver-pathology","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350479160","qcScore":7.9,"slotIndex":38,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-18T05:00:20.228Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op14$,
  $ky14$Alcoholic hepatitis with hepatocyte injury$ky14$,
  $ex14$Daily heavy drinking, a tender enlarged liver, jaundice, and an AST of 240 U/L with an ALT of 96 U/L give an AST-to-ALT ratio of at least 2, with both values under 300 U/L. That ratio is the laboratory pattern of alcohol-related liver injury, including alcoholic hepatitis. Hepatitis C RNA is undetectable, so there is no active hepatitis C viremia. A blocking duct stone would raise the alkaline phosphatase well above this near-normal value. Ischemic hepatitis produces much higher aminotransferases and follows hypotension, and the blood pressure is normal.$ex14$,
  3,
  $dm14$gastrointestinal$dm14$,
  $tp14$liver-pathology$tp14$,
  $su14$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$su14$,
  $sl14$Alcohol-Related Liver Disease - Merck Manual Professional Edition: AST to ALT ratio at least 2 in alcoholic hepatitis$sl14$,
  $sq14$The ratio of aspartate aminotransferase (AST) to alanine aminotransferase (ALT) is ≥ 2.$sq14$,
  $ch14$b17a8e2ad38238053889e42fe15b8170ca1a90596281ae222a9eb57097a78a6d$ch14$,
  true,
  $ref14$[{"label":"Alcohol-Related Liver Disease - Merck Manual Professional Edition: AST to ALT ratio at least 2 in alcoholic hepatitis","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$ref14$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id15$cmrpw16sy002b1yh5v9azodfx$id15$,
  $fx15$re-tag$fx15$,
  $sc15$A 55-year-old man presents with jaundice and fatigue that have developed over several months. He does not drink alcohol. AST is 70 U/L and ALT is 150 U/L. Hepatitis C antibody is positive and hepatitis C RNA is detected. Ultrasound shows no biliary dilation and no gallstones.$sc15$,
  $qu15$What is the most likely underlying mechanism of liver damage in this patient?$qu15$,
  $op15${"options":["Direct hepatocyte toxicity from viral replication","Autoimmune destruction of liver cells","Chronic inflammation leading to fibrosis","Bile duct obstruction due to gallstones"],"distractorRationale":{"Autoimmune destruction of liver cells":"This patient shows no signs of autoimmune disease, such as elevated autoimmune markers or a relevant clinical history. (The absence of autoimmune indicators makes this option unlikely in the context of hepatitis C.)","Chronic inflammation leading to fibrosis":"While chronic inflammation can lead to fibrosis over time, the patient's acute symptoms and positive hepatitis C test indicate that the immediate cause is viral replication, not chronic changes. (This highlights the importance of differentiating between acute and chronic liver damage mechanisms.)","Bile duct obstruction due to gallstones":"The clinical findings do not support biliary obstruction, as there are no signs of gallstones or biliary colic. (Understanding the specific causes of jaundice is crucial for accurate diagnosis.)"},"clinicalReasoning":"The primary mechanism of liver damage in this patient is direct hepatocyte toxicity from viral replication. **Hepatitis C virus** infects liver cells, causing cell death. This leads to **elevated liver enzymes** due to hepatocyte injury.","keyTakeaways":["When evaluating liver damage in a patient with hepatitis C, prioritize direct hepatocyte toxicity from viral replication."],"taskCategory":"health-maintenance","blueprintTopic":"biostatistics-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349901374","qcScore":8.1,"slotIndex":6,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:45:49.091Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op15$,
  $ky15$Chronic inflammation leading to fibrosis$ky15$,
  $ex15$Chronic hepatitis C injures the liver through persistent inflammation that leads to fibrosis. He does not drink, the ALT is higher than the AST, and the bile ducts are not blocked. Direct viral cytotoxicity is not the main mechanism of hepatitis C injury, and this is not autoimmune hepatitis.$ex15$,
  2,
  $dm15$gastrointestinal$dm15$,
  $tp15$liver-pathology$tp15$,
  NULL,
  NULL,
  NULL,
  $ch15$028eb60fc157acbffb8d1fda40fc3d62d12362d691c7df0dd66c9f08ada9492d$ch15$,
  true,
  $ref15$[{"label":"USMLE Content Outline 2026"}]$ref15$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id16$cmrpvdpub00251yncmxaza7m2$id16$,
  $fx16$re-rate|re-tag$fx16$,
  $sc16$A 45-year-old man presents to the emergency department with jaundice and dark urine after returning from a tropical vacation. He reports consuming undercooked seafood during his trip. Laboratory tests reveal elevated liver enzymes: AST 120 U/L, ALT 150 U/L, and total bilirubin 4.5 mg/dL, along with a fever of 38.5°C (101.3°F).$sc16$,
  $qu16$What is the most likely diagnosis?$qu16$,
  $op16${"options":["Acute hepatitis A","Cholecystitis","Hemolytic anemia","Acute hepatitis B","Alcoholic liver disease"],"distractorRationale":{"Cholecystitis":"Cholecystitis typically presents with **right upper quadrant pain** and may cause jaundice, but the primary symptoms here are jaundice and dark urine without pain. (This highlights the importance of correlating symptoms with the underlying pathology.)","Hemolytic anemia":"Hemolytic anemia would present with signs of **anemia** (like fatigue or pallor) and **reticulocytosis**, which are absent in this case. (Understanding the specific signs of liver dysfunction versus hemolysis is crucial.)","Acute hepatitis B":"Acute hepatitis B typically requires risk factors such as intravenous drug use or unprotected sex, which are not mentioned here. (Recognizing the different transmission routes for hepatitis viruses is essential for accurate diagnosis.)","Alcoholic liver disease":"Alcoholic liver disease usually requires a significant history of alcohol consumption, which is not present in this patient. (Linking patient history with clinical findings is vital for diagnosis.)"},"clinicalReasoning":"The patient's symptoms and travel history strongly indicate acute hepatitis A. **Jaundice** and **dark urine** are classic signs of liver dysfunction. Recent travel to a **tropical region** and consumption of **undercooked seafood** are key risk factors for hepatitis A.","keyTakeaways":["When a patient presents with jaundice, dark urine, and recent travel to a tropical area, suspect hepatitis A first."],"taskCategory":"clinical-intervention","blueprintTopic":"biostatistics-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784348853328","qcScore":7.8,"slotIndex":0,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:28:18.054Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op16$,
  $ky16$Acute hepatitis A$ky16$,
  $ex16$## Why this answer is correct
The patient's symptoms and travel history strongly indicate acute hepatitis A.
• **Jaundice** and **dark urine** are classic signs of liver dysfunction.
• Recent travel to a **tropical region** and consumption of **undercooked seafood** are key risk factors for hepatitis A.
• Elevated **liver enzymes** (AST and ALT) and fever support an infectious etiology.
**In practice:** In practice, recognizing hepatitis A early can help prevent further transmission and guide appropriate management, including vaccination for close contacts.
## Why the other options are wrong



**Cholecystitis**
• Trap: Students may confuse jaundice with gallbladder issues.
• Why it fails here: Cholecystitis typically presents with **right upper quadrant pain** and may cause jaundice, but the primary symptoms here are jaundice and dark urine without pain.
• Remember: This highlights the importance of correlating symptoms with the underlying pathology.

**Hemolytic anemia**
• Trap: Some may think jaundice always indicates hemolysis.
• Why it fails here: Hemolytic anemia would present with signs of **anemia** (like fatigue or pallor) and **reticulocytosis**, which are absent in this case.
• Remember: Understanding the specific signs of liver dysfunction versus hemolysis is crucial.

**Acute hepatitis B**
• Trap: Students might assume all hepatitis infections present similarly.
• Why it fails here: Acute hepatitis B typically requires risk factors such as intravenous drug use or unprotected sex, which are not mentioned here.
• Remember: Recognizing the different transmission routes for hepatitis viruses is essential for accurate diagnosis.

**Alcoholic liver disease**
• Trap: Some may incorrectly associate liver enzyme elevation with alcohol use.
• Why it fails here: Alcoholic liver disease usually requires a significant history of alcohol consumption, which is not present in this patient.
• Remember: Linking patient history with clinical findings is vital for diagnosis.
## Key takeaway
**When a patient presents with jaundice, dark urine, and recent travel to a tropical area, suspect hepatitis A first.**

**Memory hook:** Think 'A' for 'A'cute hepatitis A when you hear 'travel' and 'seafood'!$ex16$,
  2,
  $dm16$gastrointestinal$dm16$,
  $tp16$liver-pathology$tp16$,
  NULL,
  NULL,
  NULL,
  $ch16$d8955335a045fd4dd1a81626877fc626a8fb36ec7a160e456c82048b2688f9a2$ch16$,
  true,
  $ref16$[{"url":"https://medlineplus.gov/hepatitisa.html","label":"MedlinePlus. Hepatitis A."}]$ref16$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id17$cmr8bg1su01031yw29iy48ez2$id17$,
  $fx17$re-rate|re-tag$fx17$,
  $sc17$A 28-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She reports that the pain started suddenly and is located in the right upper quadrant. On examination, she has a fever of 38.5°C (101.3°F) and tenderness in the right upper quadrant with a positive Murphy's sign. Laboratory tests reveal elevated white blood cell count (WBC 15,000/mm³) and elevated liver enzymes (AST 120 U/L, ALT 150 U/L).$sc17$,
  $qu17$What is the most likely diagnosis?$qu17$,
  $op17${"options":["Acute cholecystitis","Acute pancreatitis","Hepatitis","Peptic ulcer disease"],"distractorRationale":{"Acute pancreatitis":"While acute pancreatitis can cause abdominal pain, it typically presents with epigastric pain and elevated lipase levels, not localized right upper quadrant pain.","Hepatitis":"Hepatitis usually presents with systemic symptoms like jaundice and does not typically cause localized abdominal pain or a positive Murphy's sign.","Peptic ulcer disease":"Peptic ulcer disease may cause abdominal pain but is less likely to present with fever and elevated WBC count, which are indicative of an inflammatory process."},"clinicalReasoning":"The patient's symptoms and lab findings indicate an inflammatory process in the right upper quadrant, leading to the diagnosis of acute cholecystitis. The presence of fever and leukocytosis supports this diagnosis, while the absence of epigastric pain and elevated lipase levels helps rule out pancreatitis.","keyTakeaways":["When you see right upper quadrant pain with fever and elevated WBC, think acute cholecystitis first."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"study-designs","blueprintSystem":"biochemistry-genetics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783286885652","qcScore":8.2,"slotIndex":38,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-05T21:35:58.297Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op17$,
  $ky17$Acute cholecystitis$ky17$,
  $ex17$## Why this answer is correct
The patient's symptoms and lab findings confirm acute cholecystitis.
• **Right upper quadrant pain** and **positive Murphy's sign** indicate gallbladder inflammation.
• **Elevated white blood cell count** (WBC 15,000/mm³) suggests an inflammatory process.
• **Elevated liver enzymes** (AST 120 U/L, ALT 150 U/L) support liver involvement, common in cholecystitis.
**In practice:** In practice, recognizing acute cholecystitis early can lead to timely surgical intervention, reducing complications like perforation or abscess formation.
## Why the other options are wrong



**Acute pancreatitis**
• Trap: Students may confuse the abdominal pain location, thinking it could be pancreatitis.
• Why it fails here: Acute pancreatitis typically presents with **epigastric pain** radiating to the back and is associated with elevated lipase levels, which are not mentioned here.
• Remember: Understanding the specific pain location is crucial for diagnosing abdominal conditions.

**Hepatitis**
• Trap: Some may think elevated liver enzymes alone indicate hepatitis.
• Why it fails here: Hepatitis usually presents with **jaundice** and generalized abdominal discomfort rather than localized pain and fever.
• Remember: Recognizing the pattern of symptoms helps differentiate hepatitis from gallbladder issues.

**Peptic ulcer disease**
• Trap: Students might consider peptic ulcer disease due to abdominal pain.
• Why it fails here: Peptic ulcers typically do not present with fever or elevated WBC counts, which are indicative of an inflammatory process like cholecystitis.
• Remember: Linking fever and leukocytosis to localized inflammation is key in this scenario.
## Key takeaway
**When you see right upper quadrant pain with fever and elevated WBC, think acute cholecystitis first.**

**Memory hook:** Remember: **Murphy's sign** = gallbladder; **epigastric pain** = pancreas.$ex17$,
  1,
  $dm17$gastrointestinal$dm17$,
  $tp17$liver-pathology$tp17$,
  NULL,
  NULL,
  NULL,
  $ch17$6bd1e9d51981574eb3ebd3c459d2b537d410c0c2aff6f88a2fa9eba6ca903755$ch17$,
  true,
  $ref17$[{"label":"Gastrointestinal Pathology Guidelines"}]$ref17$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id18$cmr89p24d00nb1yw2dp1cbdre$id18$,
  $fx18$re-tag$fx18$,
  $sc18$A 45-year-old man with a history of hypertension presents to the clinic for a routine check-up. He reports occasional headaches and blurred vision. His blood pressure is 160/100 mm Hg, and laboratory tests reveal a serum creatinine level of 1.5 mg/dL. A urinalysis shows mild proteinuria. An abdominal bruit is heard. The right kidney measures 8 cm and the left measures 11 cm. Creatinine rose from 1.1 to 1.6 mg/dL after lisinopril was started.$sc18$,
  $qu18$What is the most likely underlying mechanism of this patient's hypertension?$qu18$,
  $op18${"options":["Increased renin secretion","Primary aldosterone excess","Increased sympathetic tone","Increased vascular compliance"],"distractorRationale":{"Primary aldosterone excess":"While decreased renal blood flow can contribute to hypertension, it is not the primary mechanism in this case.","Increased sympathetic tone":"Increased sympathetic tone can contribute to hypertension but is not the most likely mechanism given the renal findings.","Increased vascular compliance":"Increased vascular compliance would lead to lower blood pressure, not hypertension."},"clinicalReasoning":"Assess the patient's blood pressure and renal function, analyze the urinalysis findings, and integrate the clinical context to determine that increased renin secretion is the likely mechanism.","keyTakeaways":["When evaluating hypertension, prioritize renal mechanisms like increased renin secretion as potential causes."],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"sensitivity-specificity","blueprintSystem":"biochemistry-genetics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783284099384","qcScore":8.2,"slotIndex":41,"stepLevel":"step1","examNumber":9108,"generatedAt":"2026-07-05T20:42:37.692Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op18$,
  $ky18$Increased renin secretion$ky18$,
  $ex18$A bruit, a small kidney, and a creatinine rise after an ACE inhibitor indicate renal artery stenosis. The underperfused kidney secretes renin, and angiotensin II raises the blood pressure. Primary aldosterone excess would suppress renin. Vascular compliance is not increased in this setting, and sympathetic tone is not the specific mechanism.$ex18$,
  3,
  $dm18$cardiovascular$dm18$,
  $tp18$hypertension-mechanisms$tp18$,
  NULL,
  NULL,
  NULL,
  $ch18$8b45557824da1f2f3bc566e34fb0b8c8e4cc8a1964a99493275bc7840f2e6e77$ch18$,
  true,
  $ref18$[{"label":"USMLE Content Outline 2026"}]$ref18$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id19$cmr8dyk8y006g1yazarhp5uco$id19$,
  $fx19$re-rate|re-tag$fx19$,
  $sc19$A 45-year-old woman presents to her primary care physician with fatigue and weight gain over the past six months. She reports feeling cold all the time and has noticed her hair becoming brittle. On examination, she has a heart rate of 60 bpm, and her blood pressure is 110/70 mm Hg. Laboratory tests reveal an elevated TSH level and low free T4.$sc19$,
  $qu19$What is the most likely underlying mechanism of this patient's condition?$qu19$,
  $op19${"kind":"image_based","stepLevel":"step1","blueprintSystem":"biochemistry-genetics","blueprintTopic":"study-designs","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783291380243","qcScore":8.3,"slotIndex":11,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-05T22:44:04.858Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Autoimmune destruction of the thyroid gland","Iodine deficiency","Pituitary adenoma secreting thyroid-stimulating hormone","Thyroid hormone resistance"],"taskCategory":"diagnosis"}$op19$,
  $ky19$Autoimmune destruction of the thyroid gland$ky19$,
  $ex19$## Why this answer is correct
The patient's condition is primarily due to autoimmune destruction of the thyroid gland.
• **Autoimmune** destruction, such as in Hashimoto's thyroiditis, is the most common cause of primary hypothyroidism.
• Elevated **TSH** and low **free T4** indicate the pituitary is responding to low thyroid hormone levels.
• Symptoms like **fatigue**, **weight gain**, and **cold intolerance** are classic for hypothyroidism.
**In practice:** Recognizing autoimmune thyroiditis is crucial for timely management. On the unit, this means monitoring thyroid function and potentially starting hormone replacement therapy.
## Why the other options are wrong



**Iodine deficiency**
• Trap: Students may think iodine deficiency is a common cause of hypothyroidism.
• Why it fails here: While iodine deficiency can lead to hypothyroidism, it is rare in developed countries due to iodized salt and dietary sources.
• Remember: This highlights the importance of considering the most prevalent causes of hypothyroidism in the population.

**Pituitary adenoma secreting thyroid-stimulating hormone**
• Trap: Some may confuse a TSH-secreting adenoma with primary hypothyroidism.
• Why it fails here: A pituitary adenoma would typically cause elevated TSH and T4 levels, not low T4, which contradicts the lab findings.
• Remember: Understanding the feedback loop of thyroid hormone regulation is essential in differentiating these conditions.

**Thyroid hormone resistance**
• Trap: Students might consider this option due to the elevated TSH levels.
• Why it fails here: Thyroid hormone resistance is rare and would not explain the elevated TSH in conjunction with low T4, as it usually presents with elevated T4 levels.
• Remember: This reinforces the need to connect clinical findings with the underlying pathophysiology.
## Key takeaway
**When evaluating hypothyroidism, prioritize autoimmune causes like Hashimoto's thyroiditis over less common etiologies.**

**Memory hook:** Remember: **Hashimoto's** is the **most common** cause of hypothyroidism; think **autoimmune** first!$ex19$,
  1,
  $dm19$reproductive-endocrine$dm19$,
  $tp19$thyroid-disorders$tp19$,
  NULL,
  NULL,
  NULL,
  $ch19$8dec526fc7d33b3de4df42fb8b88486ad281110ed53ba80cc5af1ec38a54a80f$ch19$,
  true,
  $ref19$[{"url":"https://medlineplus.gov/hypothyroidism.html","label":"MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid."}]$ref19$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id20$cmr8dym1f00721yaz93i07rue$id20$,
  $fx20$re-rate|re-tag$fx20$,
  $sc20$A 5-year-old boy is brought to the pediatric clinic by his mother due to recurrent episodes of abdominal pain and diarrhea. His mother reports that the boy has been increasingly irritable and has difficulty concentrating at school. On examination, he has a pale appearance, and laboratory tests reveal a hemoglobin level of 9.5 g/dL and elevated levels of lead in his blood. The mother mentions that they live in an older home with peeling paint.$sc20$,
  $qu20$Which pathophysiologic process best explains these findings?$qu20$,
  $op20${"options":["Inhibition of heme synthesis due to lead poisoning","Increased destruction of red blood cells due to hemolysis","Impaired absorption of iron in the gastrointestinal tract","Deficiency of vitamin B12 affecting red blood cell production"],"distractorRationale":{"Increased destruction of red blood cells due to hemolysis":"Common trap: hemolytic anemia can cause similar symptoms, but the lead levels and history point to lead poisoning as the cause.","Impaired absorption of iron in the gastrointestinal tract":"This would typically present with microcytic anemia and is not consistent with lead exposure.","Deficiency of vitamin B12 affecting red blood cell production":"This would present with macrocytic anemia and neurological symptoms, not the acute abdominal pain seen here."},"clinicalReasoning":"Assess the patient's symptoms and lab findings, which indicate anemia and elevated lead levels. Analyze the potential causes of anemia in children, particularly focusing on environmental exposures. Integrate the clinical context of lead poisoning, which is known to inhibit heme synthesis, leading to the observed symptoms.","keyTakeaways":["When evaluating anemia in children, always consider lead poisoning, especially with a history of exposure."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"lysosomal-storage","blueprintSystem":"biochemistry-genetics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783291380243","qcScore":8.2,"slotIndex":33,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-05T22:48:28.114Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op20$,
  $ky20$Inhibition of heme synthesis due to lead poisoning$ky20$,
  $ex20$## Why this answer is correct
Lead poisoning inhibits heme synthesis, causing anemia and systemic effects.
• **Lead poisoning** disrupts heme synthesis by inhibiting key enzymes.
• This leads to **anemia** due to decreased red blood cell production.
• Symptoms like **abdominal pain** and irritability are common in affected children.
**In practice:** In practice, recognizing lead poisoning is crucial, especially in children living in older homes. Prompt identification can prevent further complications and guide treatment.
## Why the other options are wrong



**Increased destruction of red blood cells due to hemolysis**
• Trap: Students may confuse lead poisoning with hemolytic anemia due to overlapping symptoms.
• Why it fails here: While hemolysis can cause anemia, the elevated lead levels and the child's living conditions strongly indicate lead poisoning as the primary cause.
• Remember: Understanding the specific effects of lead on heme synthesis clarifies why hemolysis is not the correct explanation.

**Impaired absorption of iron in the gastrointestinal tract**
• Trap: Some may think that iron deficiency is the cause of anemia in this scenario.
• Why it fails here: Iron deficiency typically results in microcytic anemia, which does not align with the symptoms and elevated lead levels seen here.
• Remember: Recognizing the specific impact of lead on heme synthesis helps differentiate it from iron absorption issues.

**Deficiency of vitamin B12 affecting red blood cell production**
• Trap: Students might consider vitamin B12 deficiency due to the presence of anemia.
• Why it fails here: Vitamin B12 deficiency leads to macrocytic anemia and neurological symptoms, which are not present in this case.
• Remember: Linking the correct type of anemia to the underlying cause is essential for accurate diagnosis.
## Key takeaway
**When evaluating anemia in children, always consider lead poisoning, especially with a history of exposure.**

**Memory hook:** Think 'Lead = Abdominal pain + Anemia' when assessing pediatric patients.$ex20$,
  1,
  $dm20$blood-lymph-immune$dm20$,
  $tp20$anemia-workup$tp20$,
  NULL,
  NULL,
  NULL,
  $ch20$552a872a244e5dddf545be8c07ca74a896bf9f22f731a12aa929a3f941a10374$ch20$,
  true,
  $ref20$[{"label":"Lysosomal Storage Diseases: An Overview"}]$ref20$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id21$cmrpvdr6d002m1yncpdrv20xq$id21$,
  $fx21$re-tag$fx21$,
  $sc21$A 45-year-old woman presents to the emergency department with severe abdominal pain and jaundice. She has a history of gallstones and has been experiencing intermittent episodes of right upper quadrant pain for the past month. On examination, her temperature is 38.2°C (100.8°F), and she has scleral icterus. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and bilirubin levels (total bilirubin 3.5 mg/dL).$sc21$,
  $qu21$What is the most likely diagnosis?$qu21$,
  $op21${"options":["Acute cholecystitis","Cholangitis","Acute pancreatitis","Hepatitis"],"distractorRationale":{"Acute cholecystitis":"This condition involves inflammation of the gallbladder and typically presents with localized right upper quadrant pain and tenderness, fever, and possibly leukocytosis, but not the systemic signs of infection seen here.","Acute pancreatitis":"This condition usually presents with severe epigastric pain, often with nausea and vomiting, and elevated pancreatic enzymes (amylase/lipase), which are not indicated in this case.","Hepatitis":"While hepatitis can cause elevated liver enzymes and jaundice, it typically does not present with the acute severe abdominal pain and systemic signs of infection seen in this patient."},"clinicalReasoning":"Assessing the patient's symptoms and lab results indicates a systemic infection (fever, jaundice) with abdominal pain, suggesting an obstructive process in the biliary system. Analyzing the differential diagnoses, cholangitis fits best due to the combination of fever, jaundice, and right upper quadrant pain, leading to the conclusion that this is the most likely diagnosis.","keyTakeaways":["When you see fever, jaundice, and right upper quadrant pain, think cholangitis first."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"biostatistics-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784348853328","qcScore":8.2,"slotIndex":18,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:29:44.737Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op21$,
  $ky21$Cholangitis$ky21$,
  $ex21$## Why this answer is correct
Cholangitis is the most likely diagnosis due to the classic triad of symptoms.
• **Cholangitis** is characterized by fever, jaundice, and right upper quadrant pain.
• The **obstruction** of the bile duct, often from gallstones, leads to infection.
• Elevated liver enzymes and bilirubin levels support the diagnosis of **biliary obstruction**.
**In practice:** In practice, recognizing cholangitis is critical as it can lead to severe complications if not treated promptly. Early intervention can significantly improve patient outcomes.
## Why the other options are wrong



**Acute cholecystitis**
• Trap: Students may confuse acute cholecystitis with cholangitis due to overlapping symptoms.
• Why it fails here: Acute cholecystitis typically presents with localized right upper quadrant pain and tenderness, often without systemic signs like fever, which are present in this case.
• Remember: Understanding the difference between localized pain in cholecystitis and systemic symptoms in cholangitis is key.

**Acute pancreatitis**
• Trap: Some may think acute pancreatitis is a possibility due to abdominal pain and elevated liver enzymes.
• Why it fails here: Acute pancreatitis usually presents with severe epigastric pain that may radiate to the back, along with elevated amylase and lipase levels, which are not mentioned here.
• Remember: Recognizing the distinct pain patterns helps differentiate pancreatitis from biliary issues.

**Hepatitis**
• Trap: Students might consider hepatitis due to elevated liver enzymes and jaundice.
• Why it fails here: While hepatitis can cause these lab findings, it does not typically present with the acute severe abdominal pain and fever seen in this patient.
• Remember: Differentiating between viral hepatitis and obstructive processes is essential for accurate diagnosis.
## Key takeaway
**When you see fever, jaundice, and right upper quadrant pain, think cholangitis first.**

**Memory hook:** Remember the triad: **Fever, Jaundice, Pain** — think **Cholangitis**!$ex21$,
  2,
  $dm21$gastrointestinal$dm21$,
  $tp21$liver-pathology$tp21$,
  NULL,
  NULL,
  NULL,
  $ch21$a1c49a8e50c61469ac9238ea4ce43ab9b8d2cdd879a2a62536a10a90d07fe5a3$ch21$,
  true,
  $ref21$[{"label":"Gastroenterology and Hepatology: A Comprehensive Review"}]$ref21$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id22$cmrth8bb2005g1yax15cu6j80$id22$,
  $fx22$re-rate|re-tag$fx22$,
  $sc22$A 40-year-old woman presents with a 1-week history of severe headache, visual disturbances, and nausea. She has a blood pressure of 180/110 mm Hg and a urine analysis shows proteinuria. A fundoscopic examination reveals retinal hemorrhages.$sc22$,
  $qu22$What is the most likely pathophysiologic process responsible for this patient's findings?$qu22$,
  $op22${"options":["Endothelial dysfunction leading to increased vascular permeability","Increased renin-angiotensin-aldosterone system activity","Systemic vasodilation due to nitric oxide release","Increased sympathetic nervous system activity (higher sympathetic nerve activity)"],"distractorRationale":{"Increased renin-angiotensin-aldosterone system activity":"This option fails because it does not directly explain the end-organ damage seen in this patient.","Systemic vasodilation due to nitric oxide release":"This option is incorrect as it contradicts the patient's severe hypertension.","Increased sympathetic nervous system activity (higher sympathetic nerve activity)":"This option is misleading because while it may contribute to hypertension, it does not explain the proteinuria and retinal hemorrhages."},"clinicalReasoning":"The combination of severe hypertension, proteinuria, and retinal hemorrhages suggests a pathophysiologic process involving endothelial dysfunction, leading to increased vascular permeability and subsequent end-organ damage.","keyTakeaways":["When faced with severe hypertension and end-organ damage, prioritize identifying **endothelial dysfunction** as the underlying cause."],"kind":"vignette","taskCategory":"interpretation","blueprintTopic":"emergency-acls","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784566857884","qcScore":8.1,"slotIndex":36,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-20T17:02:55.149Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"interpretation"}$op22$,
  $ky22$Endothelial dysfunction leading to increased vascular permeability$ky22$,
  $ex22$She is not described as pregnant. A blood pressure of 180/110 mm Hg with headache, retinal hemorrhages, and proteinuria is a hypertensive emergency. The vessel injury is endothelial dysfunction with increased permeability. This is not preeclampsia. A primary surge in nitric oxide would lower, not raise, the blood pressure.$ex22$,
  3,
  $dm22$cardiovascular$dm22$,
  $tp22$hypertension-mechanisms$tp22$,
  NULL,
  NULL,
  NULL,
  $ch22$44a561ad90903915a80240e12eebd10ff44650768291d179898a7b903305125a$ch22$,
  true,
  $ref22$[{"url":"https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf","label":"AHA highlights of the 2017 ACC/AHA guideline, Table 2. Hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new target-organ damage."}]$ref22$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id23$cmr87j34200b21yw2fmxa5qvg$id23$,
  $fx23$re-rate|rewrite$fx23$,
  $sc23$A 28-year-old woman has irregular menses and has not conceived for a year. Body mass index is 32 kg/m2. Hair on the face and abdomen has increased gradually over several years. Blood pressure is 130/85 mm Hg. Serum testosterone is elevated, 17-hydroxyprogesterone is normal, and there is no clitoromegaly or deepening of the voice. Ultrasound shows many small follicles in both ovaries and no unilateral mass.$sc23$,
  $qu23$What is the most likely diagnosis?$qu23$,
  $op23${"options":["Virilizing androgen-secreting ovarian tumor","Nonclassic congenital adrenal hyperplasia","Polycystic ovary syndrome with anovulation","Hypothalamic amenorrhea from low energy intake"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"pcos-endocrine","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783280139158","qcScore":8.3,"slotIndex":53,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-05T19:50:34.144Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op23$,
  $ky23$Polycystic ovary syndrome with anovulation$ky23$,
  $ex23$Irregular menses, infertility, gradual hirsutism, elevated testosterone, and many small ovarian follicles meet the combination of ovulatory dysfunction, hyperandrogenism, and polycystic morphology. A virilizing ovarian tumor causes rapid severe androgen excess and a unilateral mass, which are absent. Nonclassic congenital adrenal hyperplasia is unlikely when 17-hydroxyprogesterone is normal. Hypothalamic amenorrhea accompanies low body weight, not a body mass index of 32 with high testosterone. Imaging was done to exclude a virilizing tumor, and none is present.$ex23$,
  1,
  $dm23$reproductive-endocrine$dm23$,
  $tp23$pcos-endocrine$tp23$,
  $su23$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormal-uterine-bleeding/polyendocrine-metabolic-ovarian-syndrome-pmos$su23$,
  $sl23$Polyendocrine Metabolic Ovarian Syndrome - Merck Manual Professional Edition: two of three among hyperandrogenism, ovulatory dysfunction, and polycystic morphology$sl23$,
  $sq23$Polyendocrine metabolic ovarian syndrome (formerly, polycystic ovary syndrome) is a clinical syndrome defined by the presence 2 of 3 findings: hyperandrogenism (eg, hirsutism, acne), ovulatory dysfunction, and polycystic ovarian morphology.$sq23$,
  $ch23$8e5067abb3c2ccf63cc77d5ed42f4bb935fdcca58141e7d2bbf229c3d68d79e2$ch23$,
  true,
  $ref23$[{"label":"Polyendocrine Metabolic Ovarian Syndrome - Merck Manual Professional Edition: two of three among hyperandrogenism, ovulatory dysfunction, and polycystic morphology","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormal-uterine-bleeding/polyendocrine-metabolic-ovarian-syndrome-pmos"}]$ref23$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id24$d1924316-1d88-4d02-863d-9efa44f3fc46$id24$,
  $fx24$re-rate|rewrite$fx24$,
  $sc24$Three patients each have a low TSH and a high free T4. Patient A has a diffuse goiter, pretibial myxedema, and high radioiodine uptake. Patient B had a sore throat last week; the gland is tender, radioiodine uptake is near zero, and serum thyroglobulin is high. Patient C has no goiter, radioiodine uptake is near zero, and serum thyroglobulin is low.$sc24$,
  $qu24$Which assignment of the diagnoses is correct?$qu24$,
  $op24${"options":["B has Graves disease and A takes thyroid hormone","A has Graves disease and C takes thyroid hormone","C has Graves disease and B takes thyroid hormone","A has thyroiditis and C has Graves disease","B takes thyroid hormone and A has thyroiditis"],"blueprintSystem":"reproductive-endocrine","taskCategory":"interpretation","blueprintTopic":"thyroid-disorders","kind":"vignette"}$op24$,
  $ky24$A has Graves disease and C takes thyroid hormone$ky24$,
  $ex24$Pretibial myxedema is the infiltrative dermopathy of Graves disease, and patient A also has a diffuse goiter with high radioiodine uptake. High uptake marks Graves disease, whereas uptake near zero marks thyroiditis. Patient B has a tender gland, uptake near zero, and high thyroglobulin, which is leakage from thyroiditis rather than stimulation of the gland. Patient C has uptake near zero and low thyroglobulin, and low thyroglobulin indicates factitious hormone because every other cause of hyperthyroidism does not suppress thyroglobulin that way. Calling the tender low-uptake gland Graves disease, or calling the high-uptake patient a hormone taker, reverses these patterns.$ex24$,
  3,
  $dm24$reproductive-endocrine$dm24$,
  $tp24$thyroid-disorders$tp24$,
  $su24$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism$su24$,
  $sl24$Hyperthyroidism - Merck Manual Professional Edition: low thyroglobulin indicates factitious hormone; pretibial myxedema is Graves dermopathy$sl24$,
  $sq24$If thyrotoxicosis factitia is suspected, serum thyroglobulin can be measured; it is usually low or low-normal—unlike in all other causes of hyperthyroidism.$sq24$,
  $ch24$bbcab48c2808f440b233565e4b1816874f5718e6c66c67e8776906eeeea933da$ch24$,
  true,
  $ref24$[{"label":"Hyperthyroidism - Merck Manual Professional Edition: low thyroglobulin indicates factitious hormone; pretibial myxedema is Graves dermopathy","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism"}]$ref24$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id25$cmr4pbfop00pn1y1e471kzzx1$id25$,
  $fx25$re-rate|rewrite$fx25$,
  $sc25$A 28-year-old woman at 34 weeks of pregnancy has a severe headache and visual change. Blood pressure is 160/110 mm Hg. Urinalysis shows 3+ protein. The hands and feet have swollen over the past week, and the liver enzymes are elevated. She was previously healthy.$sc25$,
  $qu25$Which maternal factor best explains the hypertension?$qu25$,
  $op25${"options":["Increased prostacyclin production by endothelium","Decreased endothelin secretion by endothelium","Increased circulating soluble Flt-1 activity","Anti-basement-membrane antibody deposition"],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"preeclampsia-mechanism","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783068347748","qcScore":8.1,"slotIndex":29,"stepLevel":"step1","examNumber":9109,"generatedAt":"2026-07-03T08:53:01.203Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op25$,
  $ky25$Increased circulating soluble Flt-1 activity$ky25$,
  $ex25$New hypertension, proteinuria, headache, visual change, edema, and elevated liver enzymes at 34 weeks are preeclampsia. Increased soluble Flt-1, a circulating receptor for vascular endothelial growth factor, is one of the factors that contribute to the vasospasm. Prostacyclin, an endothelial vasodilator, is decreased in this illness, so increased prostacyclin is the wrong direction. Endothelin, an endothelial vasoconstrictor, is increased, so decreased endothelin is the wrong direction. Antibody deposition on the glomerular basement membrane is a different renal disease and is not the placental factor described here.$ex25$,
  3,
  $dm25$reproductive-endocrine$dm25$,
  $tp25$preeclampsia-mechanism$tp25$,
  $su25$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/preeclampsia-and-eclampsia$su25$,
  $sl25$Preeclampsia and Eclampsia - Merck Manual Professional Edition: increased soluble Flt-1 contributes to vasospasm$sl25$,
  $sq25$Factors that may contribute to vasospasm include decreased prostacyclin (an endothelium-derived vasodilator), increased endothelin (an endothelium-derived vasoconstrictor), and increased soluble Flt-1 (a circulating receptor for vascular endothelial growth factor).$sq25$,
  $ch25$662e75629b21d3191a611e2dae499e66c0255d0f307c71bfd18a17a410916b8c$ch25$,
  true,
  $ref25$[{"label":"Preeclampsia and Eclampsia - Merck Manual Professional Edition: increased soluble Flt-1 contributes to vasospasm","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/preeclampsia-and-eclampsia"}]$ref25$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id26$ae455eed-f457-4b80-8d5b-9a83629093d2$id26$,
  $fx26$re-rate|rewrite$fx26$,
  $sc26$A 29-year-old woman with Graves disease is euthyroid while taking methimazole and plans to become pregnant.$sc26$,
  $qu26$Which treatment is most appropriate during pregnancy?$qu26$,
  $op26${"options":["Radioiodine once a pregnancy test is positive","Propylthiouracil, with radioiodine avoided","Levothyroxine in place of antithyroid treatment","Methimazole as the preferred drug in pregnancy","High-dose iodine instead of a thioamide drug"],"blueprintSystem":"reproductive-endocrine","taskCategory":"interpretation","blueprintTopic":"thyroid-disorders","kind":"vignette"}$op26$,
  $ky26$Propylthiouracil, with radioiodine avoided$ky26$,
  $ex26$Pregnant patients with this disease are usually treated with the lowest effective dose of propylthiouracil. Radioiodine is not used during pregnancy because it crosses the placenta and can cause severe fetal hypothyroidism. Methimazole is an alternative antithyroid drug, not the drug named as the usual choice in pregnancy. Levothyroxine replaces hormone and does not block synthesis in Graves disease. High-dose iodine is not the antithyroid treatment used to manage Graves disease through pregnancy.$ex26$,
  3,
  $dm26$reproductive-endocrine$dm26$,
  $tp26$thyroid-disorders$tp26$,
  $su26$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/pregnancy-complicated-by-disease/thyroid-disorders-in-pregnancy$su26$,
  $sl26$Thyroid Disorders in Pregnancy - Merck Manual Professional Edition: propylthiouracil is the usual antithyroid drug in pregnancy$sl26$,
  $sq26$Usually, pregnant women are given the lowest possible dose of oral propylthiouracil (50 to 100 mg every 8 hours).$sq26$,
  $ch26$e69691ecba56b941d147a05fdf27ba850b71104ba8f6dbb1f99b7e43f4086b3c$ch26$,
  true,
  $ref26$[{"label":"Thyroid Disorders in Pregnancy - Merck Manual Professional Edition: propylthiouracil is the usual antithyroid drug in pregnancy","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/pregnancy-complicated-by-disease/thyroid-disorders-in-pregnancy"}]$ref26$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id27$472e875c-1f80-4ccc-86cc-4932281b45bc$id27$,
  $fx27$re-rate|rewrite$fx27$,
  $sc27$A toddler who had been well between illnesses stopped eating during a viral illness and is now lethargic. Glucose is 30 mg/dL, urine ketones are absent, and the acylcarnitine profile shows medium-chain species.$sc27$,
  $qu27$Which enzyme defect best explains these findings?$qu27$,
  $op27${"options":["Insulin deficiency causing diabetic ketoacidosis","Hepatic glucose-6-phosphatase enzyme deficiency","Medium-chain acyl-CoA dehydrogenase deficiency","Carnitine palmitoyltransferase I deficiency","Very-long-chain acyl-CoA dehydrogenase deficiency"],"blueprintSystem":"biostats-epi","taskCategory":"interpretation","blueprintTopic":"inborn-errors","kind":"vignette"}$op27$,
  $ky27$Medium-chain acyl-CoA dehydrogenase deficiency$ky27$,
  $ex27$Hypoglycemia after fasting, absent urine ketones, and medium-chain acylcarnitines are the attack of medium-chain acyl-CoA dehydrogenase deficiency. The diagnosis is made by finding those medium-chain carnitine conjugates, and ketogenesis fails when feeding stops. Diabetic ketoacidosis requires ketones, and this urine has none. Glucose-6-phosphatase deficiency can cause fasting hypoglycemia but not this medium-chain acylcarnitine result. Carnitine palmitoyltransferase I deficiency does not produce medium-chain species. Very-long-chain acyl-CoA dehydrogenase deficiency elevates C14 to C18 acylcarnitines rather than the medium-chain species shown here.$ex27$,
  3,
  $dm27$biostats-epi$dm27$,
  $tp27$inborn-errors$tp27$,
  $su27$https://www.merckmanuals.com/professional/pediatrics/inherited-disorders-of-metabolism/beta-oxidation-cycle-disorders$su27$,
  $sl27$Beta-Oxidation Cycle Disorders - Merck Manual Professional Edition: MCAD causes hypoketotic hypoglycemia and medium-chain acylcarnitines$sl27$,
  $sq27$Diagnosis of MCADD is by detecting medium-chain fatty acid conjugates of carnitine in plasma or glycine in urine or by detecting enzyme deficiency in cultured fibroblasts.$sq27$,
  $ch27$1b176e75f65a21812c1e986217c40506a39201925f3769585c9bf5d324fee024$ch27$,
  true,
  $ref27$[{"label":"Beta-Oxidation Cycle Disorders - Merck Manual Professional Edition: MCAD causes hypoketotic hypoglycemia and medium-chain acylcarnitines","url":"https://www.merckmanuals.com/professional/pediatrics/inherited-disorders-of-metabolism/beta-oxidation-cycle-disorders"}]$ref27$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id28$cmr4nxtqt00h41y1edmbgwj2c$id28$,
  $fx28$re-rate|rewrite$fx28$,
  $sc28$A 58-year-old man has had pain and swelling of both wrists and of the metacarpophalangeal and proximal interphalangeal joints for three months. Morning stiffness lasts more than an hour. Rheumatoid factor is positive. The distal interphalangeal joints are spared. There is no rash, and the nails are normal.$sc28$,
  $qu28$Which process best explains the joint findings?$qu28$,
  $op28${"options":["Degenerative loss of articular cartilage","Deposition of monosodium urate crystals","Autoimmune inflammation of synovial joints","Bacterial infection inside the joint space"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"rheumatoid-arthritis","blueprintSystem":"msk-skin","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783065470453","qcScore":8,"slotIndex":58,"stepLevel":"step1","examNumber":9106,"generatedAt":"2026-07-03T08:19:30.482Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op28$,
  $ky28$Autoimmune inflammation of synovial joints$ky28$,
  $ex28$Symmetric wrist, metacarpophalangeal, and proximal interphalangeal swelling for three months, morning stiffness beyond an hour, and rheumatoid factor are the synovial pattern of rheumatoid arthritis. Stiffness in this disease characteristically lasts more than 60 minutes after rising. Cartilage loss from osteoarthritis favors the distal interphalangeal joints, which are spared, and causes much shorter stiffness. Urate crystals cause an acute attack of one joint, not a symmetric illness lasting months. Bacteria in a joint cause an acute monoarthritis, not this three-month pattern.$ex28$,
  1,
  $dm28$msk-skin$dm28$,
  $tp28$rheumatoid-arthritis$tp28$,
  $su28$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra$su28$,
  $sl28$Rheumatoid Arthritis - Merck Manual Professional Edition: symmetric small-joint synovitis with prolonged morning stiffness$sl28$,
  $sq28$Typically, stiffness lasts > 60 minutes after rising in the morning but may occur after any prolonged inactivity (called gelling).$sq28$,
  $ch28$5b204182ae3e9f7bad7fa4d321fd896065855c83bf39831a6c4760cbc643a86b$ch28$,
  true,
  $ref28$[{"label":"Rheumatoid Arthritis - Merck Manual Professional Edition: symmetric small-joint synovitis with prolonged morning stiffness","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra"}]$ref28$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id29$353f87aa-eafa-4b6b-89d3-3a8decea2922$id29$,
  $fx29$re-rate|rewrite$fx29$,
  $sc29$A 60-year-old man has shoulder pain at night. Active abduction is painful between 60 and 120 degrees, and passive motion is less painful. With the arm held forward and the thumb pointed down, resisted downward pressure is weak and painful. Resisted external rotation is strong. He can lift the hand off the lower back and hold it there.$sc29$,
  $qu29$Which tendon is affected?$qu29$,
  $op29${"options":["Infraspinatus tendon of the rotator cuff","Subscapularis tendon of the rotator cuff","Supraspinatus tendon of the rotator cuff","Teres minor tendon of the rotator cuff","Long head of the biceps brachii tendon"],"blueprintSystem":"msk-skin","taskCategory":"interpretation","blueprintTopic":"myopathies","kind":"vignette"}$op29$,
  $ky29$Supraspinatus tendon of the rotator cuff$ky29$,
  $ex29$Night pain and pain through the middle of active abduction, with less pain when the arm is moved for him, point to the rotator cuff. The empty-can maneuver, arm forward with the thumb down against downward pressure, is the test of supraspinatus, and that test is weak and painful. Infraspinatus and teres minor are tested by resisted external rotation, which is strong. Subscapularis is tested by lifting the hand off the lower back, which he can do. The long head of the biceps is not the tendon isolated by the empty-can test.$ex29$,
  2,
  $dm29$msk-skin$dm29$,
  $tp29$myopathies$tp29$,
  $su29$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/approach-to-the-patient-with-joint-symptoms/evaluation-of-the-shoulder$su29$,
  $sl29$Evaluation of the Shoulder - Merck Manual Professional Edition: the empty-can test assesses supraspinatus$sl29$,
  $sq29$The supraspinatus is assessed by having the patient resist downward pressure on the arms held in flexion (forward) with the thumbs pointing downward and the elbow extended (empty can, or Jobe test).$sq29$,
  $ch29$b77a1bbfefbb399f18e9a4bf3573abc4fea07f4285a60abf0d1d85536d8177a3$ch29$,
  true,
  $ref29$[{"label":"Evaluation of the Shoulder - Merck Manual Professional Edition: the empty-can test assesses supraspinatus","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/approach-to-the-patient-with-joint-symptoms/evaluation-of-the-shoulder"}]$ref29$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id30$cmr4ouq5e00m61y1eux3389bp$id30$,
  $fx30$rewrite$fx30$,
  $sc30$A 58-year-old man woke last night with severe pain, redness, and swelling of the right first metatarsophalangeal joint. Temperature is 36.8 C. He had two identical attacks in the past year, and each resolved over several days. There is no recent injury. He takes lisinopril and atorvastatin.$sc30$,
  $qu30$Which process best explains this attack?$qu30$,
  $op30${"kind":"image_based","stepLevel":"step1","blueprintSystem":"msk-skin","blueprintTopic":"gout-crystals","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783067353644","qcScore":8.1,"slotIndex":8,"stepLevel":"step1","examNumber":9108,"generatedAt":"2026-07-03T08:31:24.306Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Bacterial infection within the joint space","Monosodium urate crystals within the joint","Hemorrhage into the joint after trauma","Autoimmune synovitis of multiple joints"],"taskCategory":"clinical-intervention"}$op30$,
  $ky30$Monosodium urate crystals within the joint$ky30$,
  $ex30$A sudden nocturnal attack in the first metatarsophalangeal joint, called podagra, is the usual first pattern of gout from monosodium urate crystals. The temperature is normal, and earlier identical attacks resolved over days, which is not untreated bacterial arthritis. There is no injury, so blood in the joint is not the cause. Autoimmune synovitis involves many joints and does not flare and resolve in a single great toe overnight. Gout is precipitation of monosodium urate in and around joints, most often in this recurrent pattern.$ex30$,
  2,
  $dm30$msk-skin$dm30$,
  $tp30$gout-crystals$tp30$,
  $su30$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout$su30$,
  $sl30$Gout - Merck Manual Professional Edition: monosodium urate crystals cause recurrent podagra$sl30$,
  $sq30$Gout is a disorder caused by the precipitation of monosodium urate crystals in and around joints, most often causing recurrent acute or chronic arthritis.$sq30$,
  $ch30$1f549ce2a9ddba066866f1051b85819f3c811f9a75f08b950f882a2d3f05fae8$ch30$,
  true,
  $ref30$[{"label":"Gout - Merck Manual Professional Edition: monosodium urate crystals cause recurrent podagra","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$ref30$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id31$cmr88g7b700dx1yw2lufaujue$id31$,
  $fx31$re-rate|rewrite$fx31$,
  $sc31$A 68-year-old woman has had increasing back pain for six months. She takes calcium and vitamin D. She has lost 2 inches of height and stands stooped. The DXA T-score is -2.8. Serum calcium is 9.0 mg/dL, phosphate is 3.2 mg/dL, alkaline phosphatase is normal, parathyroid hormone is normal, and 25-hydroxy vitamin D is normal.$sc31$,
  $qu31$Which process best explains the loss of height?$qu31$,
  $op31${"options":["Impaired mineralization of newly formed osteoid","Decreased bone mass with intact mineralization","Excess parathyroid hormone driving bone loss","Vitamin D deficiency with impaired mineralization"],"kind":"vignette","taskCategory":"communication","blueprintTopic":"osteoporosis-bone","blueprintSystem":"msk-skin","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783281111916","qcScore":8,"slotIndex":42,"stepLevel":"step1","examNumber":9105,"generatedAt":"2026-07-05T20:12:35.259Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$op31$,
  $ky31$Decreased bone mass with intact mineralization$ky31$,
  $ex31$Height loss, a stooped posture, and a T-score of -2.8 are loss of bone mass with fragile vertebrae. Osteoporosis decreases bone mineral density while the mineral content of the remaining bone is preserved. Calcium, phosphate, alkaline phosphatase, parathyroid hormone, and vitamin D are all normal, so new osteoid is being mineralized. Osteomalacia is impaired mineralization, usually from prolonged vitamin D deficiency, and vitamin D is normal. Excess parathyroid hormone would not leave both the hormone level and the calcium normal.$ex31$,
  3,
  $dm31$msk-skin$dm31$,
  $tp31$osteoporosis-bone$tp31$,
  $su31$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/osteoporosis/osteoporosis$su31$,
  $sl31$Osteoporosis - Merck Manual Professional Edition: decreased bone mineral density with structural deterioration$sl31$,
  $sq31$Osteoporosis is a progressive metabolic bone disease that decreases bone mineral density (bone mass per unit volume), with deterioration of bone structure.$sq31$,
  $ch31$2522901cc8fb4a0e0b753cf4ed43e5dbd2d8d2a92cf82ce61db6524ccc27060a$ch31$,
  true,
  $ref31$[{"label":"Osteoporosis - Merck Manual Professional Edition: decreased bone mineral density with structural deterioration","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/osteoporosis/osteoporosis"}]$ref31$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id32$cmr8d6fip000k1yazfsid42lh$id32$,
  $fx32$re-rate|rewrite$fx32$,
  $sc32$A 28-year-old woman has had 2 weeks of pain and swelling in the hands and knees and a rash on the cheeks. Blood pressure is 148/94 mm Hg. Urinalysis shows 3+ protein, red blood cells, and red-cell casts. Antinuclear antibodies and anti-double-stranded DNA antibodies are positive. Serum C3 and C4 are low.$sc32$,
  $qu32$Which mechanism is most directly responsible for the kidney injury?$qu32$,
  $op32${"options":["Glomerular basement-membrane antibody attack","T-cell-mediated injury of the renal tubules","Pauci-immune vasculitis of small kidney vessels","Immune-complex deposition that fixes complement"],"blueprintTopic":"lupus-pathology","blueprintSystem":"msk-skin"}$op32$,
  $ky32$Immune-complex deposition that fixes complement$ky32$,
  $ex32$The cheek rash, joint swelling, anti-dsDNA antibodies, low C3 and C4, heavy protein, and red-cell casts are lupus nephritis. The glomerular injury is deposition of immune complexes that contain nuclear antigens and complement-fixing antibodies. Complement is consumed, which is why C3 and C4 are low. Antibody attack on the glomerular basement membrane is a different disease and is not this immune-complex injury. T-cell injury of tubules does not produce this active urinary sediment with low complement. Pauci-immune small-vessel vasculitis has little immune-complex material and does not fix complement in this pattern.$ex32$,
  2,
  $dm32$msk-skin$dm32$,
  $tp32$lupus-pathology$tp32$,
  $su32$https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/lupus-nephritis$su32$,
  $sl32$Lupus Nephritis - Merck Manual Professional Edition: immune-complex deposition causes the glomerulonephritis$sl32$,
  $sq32$Pathophysiology involves immune complex deposition with development of glomerulonephritis.$sq32$,
  $ch32$9239c04684cded9c2be55707d8191d13dd29ca02bf652f7979f39b134c42f256$ch32$,
  true,
  $ref32$[{"label":"Lupus Nephritis - Merck Manual Professional Edition: immune-complex deposition causes the glomerulonephritis","url":"https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/lupus-nephritis"}]$ref32$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id33$e7d6f9a1-c553-46bd-b740-b0231a2b85ec$id33$,
  $fx33$re-rate|rewrite$fx33$,
  $sc33$After repair of a thoracic aortic aneurysm, a patient cannot move either leg and cannot feel pain or temperature below the nipples. Vibration and position sense are intact.$sc33$,
  $qu33$Which vessel occlusion best explains this pattern?$qu33$,
  $op33${"options":["Left posterior spinal artery infarction of cord","Anterior spinal artery infarction of the cord","Right posterior spinal artery infarction of cord","Left middle cerebral artery brain infarction","Left anterior cerebral artery brain infarction"],"blueprintSystem":"behavioral-nervous","taskCategory":"interpretation","blueprintTopic":"stroke-localization","kind":"vignette"}$op33$,
  $ky33$Anterior spinal artery infarction of the cord$ky33$,
  $ex33$Bilateral weakness with loss of pain and temperature sense and spared vibration and position sense, just after aortic surgery, is anterior spinal artery infarction. The anterior spinal artery is the vessel typically affected, and the posterior columns that carry vibration and position sense are spared. Infarction of a posterior spinal artery would damage vibration and position sense. A middle cerebral or anterior cerebral artery infarct is a brain lesion and does not cause a bilateral spinal level after aortic repair. Clamping or injury of an aortic feeder is the usual setting for this cord infarct.$ex33$,
  3,
  $dm33$behavioral-nervous$dm33$,
  $tp33$stroke-localization$tp33$,
  $su33$https://www.merckmanuals.com/professional/neurologic-disorders/spinal-cord-disorders/spinal-cord-infarction$su33$,
  $sl33$Spinal Cord Infarction - Merck Manual Professional Edition: anterior spinal artery infarct spares posterior-column sensation$sl33$,
  $sq33$Pain and temperature sensation are disproportionately impaired; position and vibration sensation, conducted by the posterior columns, and often light touch are relatively spared.$sq33$,
  $ch33$a1889e7f087b64547510daa23e3c1024c458aca79ac0de7baeddfca791a13570$ch33$,
  true,
  $ref33$[{"label":"Spinal Cord Infarction - Merck Manual Professional Edition: anterior spinal artery infarct spares posterior-column sensation","url":"https://www.merckmanuals.com/professional/neurologic-disorders/spinal-cord-disorders/spinal-cord-infarction"}]$ref33$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id34$cmr8cclku016p1yw2qkp7qnqk$id34$,
  $fx34$re-rate|rewrite$fx34$,
  $sc34$A 67-year-old man has the sudden onset of weakness of the right face and arm, greater than the leg, and nonfluent aphasia. Blood pressure is 180/100 mm Hg. He has hypertension and hyperlipidemia. The pulse is regular.$sc34$,
  $qu34$Occlusion of which artery best explains these findings?$qu34$,
  $op34${"options":["Left anterior cerebral artery","Left posterior cerebral artery","Right middle cerebral artery","Left middle cerebral artery"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"stroke-localization","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783288533710","qcScore":8.1,"slotIndex":48,"stepLevel":"step1","examNumber":9114,"generatedAt":"2026-07-05T22:04:31.075Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op34$,
  $ky34$Left middle cerebral artery$ky34$,
  $ex34$Weakness that is worse in the face and arm than in the leg, plus aphasia, is the dominant middle cerebral artery syndrome. Language is carried in the left hemisphere in this pattern, so the artery is the left middle cerebral artery. The anterior cerebral artery weakens the leg more than the arm and does not produce this aphasia. The posterior cerebral artery affects vision and memory rather than language and face-and-arm strength. A right middle cerebral artery lesion would weaken the left limbs and would not cause aphasia with a left-language hemisphere. The pulse is regular, and the question is the territory, not whether a clot formed locally or traveled.$ex34$,
  3,
  $dm34$behavioral-nervous$dm34$,
  $tp34$stroke-localization$tp34$,
  $su34$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su34$,
  $sl34$Ischemic Stroke - Merck Manual Professional Edition: dominant middle cerebral artery causes face-and-arm weakness plus aphasia$sl34$,
  $sq34$Contralateral hemiparesis (worse in the arm and face than in the leg), dysarthria, hemianesthesia, contralateral homonymous hemianopia, aphasia (if the dominant hemisphere is affected) or apraxia and sensory neglect (if the nondominant hemisphere is affected) Middle cerebral artery (common).$sq34$,
  $ch34$58cf81f568f89fff4462944abf5901960139b539ee6dca4bc74135fe3698f600$ch34$,
  true,
  $ref34$[{"label":"Ischemic Stroke - Merck Manual Professional Edition: dominant middle cerebral artery causes face-and-arm weakness plus aphasia","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref34$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id35$cmr8ei2tu00a21yazj9fki812$id35$,
  $fx35$re-rate|rewrite$fx35$,
  $sc35$A 28-year-old woman with epilepsy takes oxcarbazepine as prescribed. For 2 days she has been confused and has had more seizures than usual. Vital signs are stable. She has started no other medicine.$sc35$,
  $qu35$Which laboratory abnormality is the most likely cause of these breakthrough seizures?$qu35$,
  $op35${"options":["Elevated serum creatinine concentration","Decreased serum sodium concentration","Increased serum potassium concentration","Elevated hepatic enzyme concentration"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"drug-moa-side-effects","blueprintSystem":"multisystem","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783291916188","qcScore":8,"slotIndex":23,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-05T22:56:59.991Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op35$,
  $ky35$Decreased serum sodium concentration$ky35$,
  $ex35$Oxcarbazepine causes hyponatremia. A low serum sodium produces confusion and can cause seizures. The new confusion and extra seizures in a patient taking the drug as prescribed are therefore expected from a decreased serum sodium. A high creatinine is not the listed effect that links this drug to seizures. A high potassium is not that effect. A rise in hepatic enzymes is not the oxcarbazepine abnormality that lowers the seizure threshold.$ex35$,
  1,
  $dm35$multisystem$dm35$,
  $tp35$drug-moa-side-effects$tp35$,
  $su35$https://www.merckmanuals.com/professional/neurologic-disorders/seizure-disorders/antiseizure-medications$su35$,
  $sl35$Antiseizure Medications - Merck Manual Professional Edition: oxcarbazepine causes hyponatremia$sl35$,
  $sq35$Fatigue, nausea, abdominal pain, headache, dizziness, somnolence, leukopenia, diplopia, hyponatremia (in 2.5%).$sq35$,
  $ch35$3ad86bc97c6a5946e42429e8a2a7e94cee2304cf9ab52c01958a380bc01f78e5$ch35$,
  true,
  $ref35$[{"label":"Antiseizure Medications - Merck Manual Professional Edition: oxcarbazepine causes hyponatremia","url":"https://www.merckmanuals.com/professional/neurologic-disorders/seizure-disorders/antiseizure-medications"}]$ref35$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id36$cmr8ei3ix00a91yaz0r2h3v04$id36$,
  $fx36$re-rate|rewrite$fx36$,
  $sc36$A 45-year-old woman with major depressive disorder was switched from fluoxetine to venlafaxine because fluoxetine had not relieved the depression. Vital signs are stable.$sc36$,
  $qu36$Which mechanism best explains the antidepressant effect of venlafaxine?$qu36$,
  $op36${"options":["Serotonin reuptake blockade, not norepinephrine","Neuronal monoamine oxidase enzyme inhibition","Serotonin and norepinephrine reuptake blockade","Dopamine D2 receptor blockade in striatum"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"psychiatric-pharmacology","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783291916188","qcScore":8.3,"slotIndex":31,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-05T22:58:35.024Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op36$,
  $ky36$Serotonin and norepinephrine reuptake blockade$ky36$,
  $ex36$Venlafaxine belongs to the drugs that block reuptake of both serotonin and norepinephrine. Fluoxetine, which failed her, blocks serotonin reuptake without that norepinephrine action, so serotonin blockade without norepinephrine does not describe the new drug. Monoamine oxidase inhibition is a different antidepressant class. Blockade of dopamine D2 receptors is the action of antipsychotic drugs, not of venlafaxine. The useful change in mechanism is addition of norepinephrine reuptake blockade to serotonin reuptake blockade.$ex36$,
  2,
  $dm36$behavioral-nervous$dm36$,
  $tp36$psychiatric-pharmacology$tp36$,
  $su36$https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/medications-for-treatment-of-depression$su36$,
  $sl36$Medications for Treatment of Depression - Merck Manual Professional Edition: venlafaxine blocks serotonin and norepinephrine reuptake$sl36$,
  $sq36$These medications (eg, desvenlafaxine , duloxetine , levomilnacipran , milnacipran , venlafaxine ) have a dual 5-HT and norepinephrine mechanism of action, as do tricyclic antidepressants (TCAs).$sq36$,
  $ch36$54ea2c33346d1c1f001f1d405c85086239918c2b40f6a4fb800d5d0bb019e1c8$ch36$,
  true,
  $ref36$[{"label":"Medications for Treatment of Depression - Merck Manual Professional Edition: venlafaxine blocks serotonin and norepinephrine reuptake","url":"https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/medications-for-treatment-of-depression"}]$ref36$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id37$cmr8dn23m003c1yazr39zl2l5$id37$,
  $fx37$re-rate|rewrite$fx37$,
  $sc37$A 32-year-old man started carbamazepine three weeks ago. He has a fever of 101 F, a widespread pruritic rash, and facial swelling. The eosinophil count and the liver enzymes are elevated. The mouth and eyes have no sores, and no skin is detaching.$sc37$,
  $qu37$What is the most likely diagnosis?$qu37$,
  $op37${"options":["Stevens-Johnson syndrome involving skin and mucosa","Toxic epidermal necrolysis with widespread detachment","Drug reaction with eosinophilia and systemic symptoms","Erythema multiforme limited to target skin lesions"],"blueprintTopic":"hypersensitivity","blueprintSystem":"blood-lymph-immune"}$op37$,
  $ky37$Drug reaction with eosinophilia and systemic symptoms$ky37$,
  $ex37$Fever, facial edema, a widespread rash, eosinophilia, and hepatitis beginning three weeks after carbamazepine match drug reaction with eosinophilia and systemic symptoms. That reaction appears two to six weeks after a first dose, and antiseizure drugs are typical causes. Stevens-Johnson syndrome and toxic epidermal necrolysis involve both skin and mucosa, and toxic epidermal necrolysis adds epidermal detachment. This patient has no mucosal sores and no detaching skin. Erythema multiforme limited to target lesions does not combine eosinophilia with hepatitis in this way.$ex37$,
  1,
  $dm37$blood-lymph-immune$dm37$,
  $tp37$hypersensitivity$tp37$,
  $su37$https://www.merckmanuals.com/professional/dermatologic-disorders/hypersensitivity-and-reactive-skin-disorders/drug-eruptions-and-reactions$su37$,
  $sl37$Drug Eruptions and Reactions - Merck Manual Professional Edition: DRESS is fever, facial edema, rash, eosinophilia, and hepatitis weeks after a drug$sl37$,
  $sq37$Manifests as fever, facial edema, and rash 2–6 weeks after first dose of a medication.$sq37$,
  $ch37$678e63a136b9de2f4a834a97d3225ac3aaef72ee5710f80bd0f90d00364b43bc$ch37$,
  true,
  $ref37$[{"label":"Drug Eruptions and Reactions - Merck Manual Professional Edition: DRESS is fever, facial edema, rash, eosinophilia, and hepatitis weeks after a drug","url":"https://www.merckmanuals.com/professional/dermatologic-disorders/hypersensitivity-and-reactive-skin-disorders/drug-eruptions-and-reactions"}]$ref37$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id38$cmra6lubd000wic04exfx82r6$id38$,
  $fx38$re-rate|rewrite$fx38$,
  $sc38$A 35-year-old man ingested a pesticide that contains an organophosphate. He has excess salivation, tearing, urination, and diarrhea, and the muscles are twitching. Heart rate is 48 beats per minute, blood pressure is 86/50 mm Hg, and he is confused.$sc38$,
  $qu38$What is the most appropriate next drug?$qu38$,
  $op38${"options":["Give intravenous pralidoxime immediately","Give intravenous naloxone immediately","Give intravenous atropine immediately","Give intravenous physostigmine immediately"],"blueprintTopic":"autonomic-pharmacology","blueprintSystem":"multisystem"}$op38$,
  $ky38$Give intravenous atropine immediately$ky38$,
  $ex38$Salivation, tearing, urination, diarrhea, bradycardia, and muscle twitching after an organophosphate are cholinergic poisoning from cholinesterase inhibition. Atropine is given for the muscarinic features, including secretions and bradycardia. Pralidoxime is given after atropine, for the neuromuscular toxicity, so it is not the first drug. Naloxone is not a treatment of organophosphate poisoning. Physostigmine is not a treatment of this cholinesterase-inhibitor poisoning and would not reverse it.$ex38$,
  2,
  $dm38$multisystem$dm38$,
  $tp38$autonomic-pharmacology$tp38$,
  $su38$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning$su38$,
  $sl38$Organophosphate Poisoning and Carbamate Poisoning - Merck Manual Professional Edition: give pralidoxime after atropine$sl38$,
  $sq38$Pralidoxime (2-PAM) is given after atropine to relieve neuromuscular symptoms.$sq38$,
  $ch38$2a8cec1b850fe9b9332c47e025a63598ad15206aa21b462e70a0b12298896e13$ch38$,
  true,
  $ref38$[{"label":"Organophosphate Poisoning and Carbamate Poisoning - Merck Manual Professional Edition: give pralidoxime after atropine","url":"https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning"}]$ref38$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id39$9f48e06d-8be3-4126-90ba-7c745f6a8f48$id39$,
  $fx39$re-rate|rewrite$fx39$,
  $sc39$A teenager ingested a large amount of aspirin and is breathing rapidly. Arterial pH is 7.48, PaCO2 is 18 mm Hg, and the anion gap is 22. He is becoming lethargic.$sc39$,
  $qu39$Which acid-base disturbances are present?$qu39$,
  $op39${"options":["Metabolic alkalosis with a normal anion gap","Respiratory acidosis from primary hypoventilation","Respiratory alkalosis and anion-gap acidosis","Non-anion-gap acidosis with metabolic alkalosis","Anion-gap acidosis plus respiratory acidosis"],"blueprintSystem":"respiratory-renal","taskCategory":"interpretation","blueprintTopic":"acid-base-physiology","kind":"vignette"}$op39$,
  $ky39$Respiratory alkalosis and anion-gap acidosis$ky39$,
  $ex39$A pH of 7.48 with a PaCO2 of 18 mm Hg is a respiratory alkalosis, and salicylate stimulates the medullary respiratory centers to produce that primary change. An anion gap of 22 is the accompanying metabolic acidosis, the mixed disorder of salicylate poisoning. A metabolic alkalosis with a normal anion gap would not open the gap or lower the PaCO2 in this way. Primary respiratory acidosis would raise the PaCO2, and the PaCO2 is 18 mm Hg. A non-anion-gap acidosis does not fit an anion gap of 22. Increasing lethargy is the point at which hyperventilation can fail and the respiratory alkalosis can give way to hypoventilation.$ex39$,
  3,
  $dm39$respiratory-renal$dm39$,
  $tp39$acid-base-physiology$tp39$,
  $su39$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning$su39$,
  $sl39$Aspirin and Other Salicylate Poisoning - Merck Manual Professional Edition: respiratory alkalosis plus metabolic acidosis$sl39$,
  $sq39$Usually, ABGs or VBGs show primary respiratory alkalosis during the first few hours after ingestion; later, they show compensated metabolic acidosis or mixed metabolic acidosis/respiratory alkalosis.$sq39$,
  $ch39$87bb1aa8b551648aa9f94b4b0b447d5538096d9aec7f5b33164c95e7305b7b20$ch39$,
  true,
  $ref39$[{"label":"Aspirin and Other Salicylate Poisoning - Merck Manual Professional Edition: respiratory alkalosis plus metabolic acidosis","url":"https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning"}]$ref39$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id40$270d5eb5-5278-412a-ad62-88d8b7e81e0a$id40$,
  $fx40$re-rate|rewrite$fx40$,
  $sc40$An older adult has lymph nodes that enlarge and then shrink over months. Biopsy shows a follicular architecture, and t(14;18) is present.$sc40$,
  $qu40$Which protein change best explains the accumulation of these cells?$qu40$,
  $op40${"options":["BCR-ABL tyrosine kinase driving proliferation","MYC overexpression speeding the cell cycle","BCL2 overexpression inhibiting cell apoptosis","Cyclin D1 excess in mantle-cell lymphoma","PML-RARA fusion blocking myeloid maturation"],"blueprintSystem":"blood-lymph-immune","taskCategory":"interpretation","blueprintTopic":"leukemia-classification","kind":"vignette"}$op40$,
  $ky40$BCL2 overexpression inhibiting cell apoptosis$ky40$,
  $ex40$Follicular architecture with a BCL2 rearrangement is follicular lymphoma. BCL2 is rearranged in more than 90 percent of these lymphomas, and overexpression of BCL2 inhibits apoptosis so the cells are not cleared. The nodes enlarge and shrink because the cells accumulate slowly rather than because a myeloid fusion gene is active. BCR-ABL is the kinase of chronic myeloid leukemia, and PML-RARA blocks maturation in acute promyelocytic leukemia. MYC overexpression and cyclin D1 excess are other lymphoma mechanisms, not the BCL2 change of follicular lymphoma.$ex40$,
  2,
  $dm40$blood-lymph-immune$dm40$,
  $tp40$leukemia-classification$tp40$,
  $su40$https://www.cancer.gov/types/lymphoma/hp/adult-nhl-treatment-pdq$su40$,
  $sl40$Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ) - NCI: BCL2 overexpression inhibits apoptosis in follicular lymphoma$sl40$,
  $sq40$Overexpression of the BCL2 protein is associated with the inability to eradicate the lymphoma by inhibiting apoptosis.$sq40$,
  $ch40$817297b41c153e55a383d146df14efe0d9ff4bd2630e069892ec2408645a867f$ch40$,
  true,
  $ref40$[{"label":"Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ) - NCI: BCL2 overexpression inhibits apoptosis in follicular lymphoma","url":"https://www.cancer.gov/types/lymphoma/hp/adult-nhl-treatment-pdq"}]$ref40$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id41$224a3028-b94e-44e7-bbbb-ce7d1e86f0b2$id41$,
  $fx41$re-rate|rewrite$fx41$,
  $sc41$A fellow resident says she has been drinking a pint of vodka every night. Two days ago she drove to the hospital still feeling affected by alcohol and worked a ward shift. This morning she is sober, steady, and about to start another inpatient shift. She asks you to keep the story between friends and says she will quit on her own. She does not want any supervisor told. No patient has yet been identified as harmed. She plans to drive home after the shift.$sc41$,
  $qu41$Which action is the most appropriate next step?$qu41$,
  $op41${"options":["Allow the shift if she self-reports to the program tomorrow","Keep her confidence and urge her to seek care herself","Relieve her of duty and notify the physician health program","Supervise her patients while she completes this shift","Notify law enforcement before any clinical supervisor"],"blueprintSystem":"social-sciences","taskCategory":"professionalism","blueprintTopic":"ethics-professionalism","kind":"vignette"}$op41$,
  $ky41$Relieve her of duty and notify the physician health program$ky41$,
  $ex41$She has already worked while affected by alcohol, she is about to start another shift, and she plans to drive again. An impaired colleague should cease practicing and should receive prompt help from a physician health program so that patients are protected. Letting her finish the shift and self-report tomorrow leaves patients in her care today. Keeping the confidence, or quietly watching her patients, does not remove her from duty. Law enforcement is not the first step when she can be relieved of duty and referred for evaluation.$ex41$,
  3,
  $dm41$social-sciences$dm41$,
  $tp41$ethics-professionalism$tp41$,
  $su41$https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7537421/$su41$,
  $sl41$The opioid-impaired provider - NIH PMC: stop an impaired colleague from practicing and use a physician health program$sl41$,
  $sq41$Intervene in a timely manner to ensure that impaired colleagues cease practicing and receive appropriate assistance from a physician health program.$sq41$,
  $ch41$c56e5201261069629f3686e8a68772094899063d516ccbfb3bd7a88b6704ccce$ch41$,
  true,
  $ref41$[{"label":"The opioid-impaired provider - NIH PMC: stop an impaired colleague from practicing and use a physician health program","url":"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7537421/"}]$ref41$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id42$cmrtqq5o900181yx3g6qwed9r$id42$,
  $fx42$re-rate|rewrite$fx42$,
  $sc42$A 45-year-old woman has had diarrhea, weight loss, and abdominal cramping for 2 weeks. She has celiac disease and has continued to eat gluten. Albumin is 2.5 g/dL, and anti-tissue transglutaminase antibodies are high. The abdomen is distended.$sc42$,
  $qu42$Which process best explains the diarrhea and low albumin?$qu42$,
  $op42${"options":["Pancreatic enzyme deficiency causing steatorrhea","Villous atrophy with small-bowel malabsorption","Bile-acid malabsorption from ileal resection","Lactase deficiency with symptoms after dairy"],"kind":"vignette","stepLevel":"step1","blueprintSystem":"gastrointestinal","blueprintTopic":"malabsorption","physicianTask":"diagnosis","generationMeta":{"batchId":"raise-exam-ready-usmle-step-1-1784582122419","examNumber":9001,"slotIndex":15,"stepLevel":"step1","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-20T21:28:37.542Z"}}$op42$,
  $ky42$Villous atrophy with small-bowel malabsorption$ky42$,
  $ex42$Continued gluten exposure, diarrhea, weight loss, a low albumin, and high anti-tissue transglutaminase antibodies are active celiac disease. The inflammatory response to gluten causes villous atrophy and malabsorption in the small bowel. Pancreatic enzyme deficiency can cause steatorrhea but does not raise tissue transglutaminase antibodies. She has not had an ileal resection, so bile-acid loss from a missing ileum is not the mechanism. Symptoms limited to dairy ingestion would be lactase deficiency, which does not lower the albumin or raise this antibody.$ex42$,
  1,
  $dm42$gastrointestinal$dm42$,
  $tp42$malabsorption$tp42$,
  $su42$https://www.merckmanuals.com/professional/gastrointestinal-disorders/malabsorption-syndromes/celiac-disease$su42$,
  $sl42$Celiac Disease - Merck Manual Professional Edition: gluten-driven inflammation causes villous atrophy and malabsorption$sl42$,
  $sq42$The inflammatory response causes characteristic mucosal villous atrophy in the small bowel.$sq42$,
  $ch42$3449f821e86d816bf07c59abb5178d1414013a971d77b237995b1fee8441516f$ch42$,
  true,
  $ref42$[{"label":"Celiac Disease - Merck Manual Professional Edition: gluten-driven inflammation causes villous atrophy and malabsorption","url":"https://www.merckmanuals.com/professional/gastrointestinal-disorders/malabsorption-syndromes/celiac-disease"}]$ref42$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id43$cmrru3pr100b41y8wf19jebl3$id43$,
  $fx43$re-rate|rewrite$fx43$,
  $sc43$A 65-year-old man with hypertension and type 2 diabetes has had vomiting and poor intake for 2 days and is making little urine. Blood pressure is 88/56 mm Hg, heart rate is 118 beats per minute, and the mucous membranes are dry. Creatinine was 0.9 mg/dL a month ago and is 3.2 mg/dL now. Urine output over the past day is 280 mL, urine sodium is 8 mEq/L, and urine osmolality is 640 mOsm/kg. The sediment has no casts. Bladder residual volume is negligible, and ultrasound shows no hydronephrosis. He has no rash and has started no new drug.$sc43$,
  $qu43$What is the most likely mechanism of this acute kidney injury?$qu43$,
  $op43${"kind":"sequential","stepLevel":"step1","blueprintSystem":"respiratory-renal","blueprintTopic":"aki-mechanisms","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784467535092","qcScore":8.3,"slotIndex":8,"stepLevel":"step1","examNumber":9106,"generatedAt":"2026-07-19T13:27:15.495Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Acute tubular necrosis from toxic epithelial injury","Postrenal failure from obstruction of urine flow","Prerenal failure from inadequate renal perfusion","Acute interstitial nephritis from a drug reaction"],"taskCategory":"diagnosis"}$op43$,
  $ky43$Prerenal failure from inadequate renal perfusion$ky43$,
  $ex43$Vomiting, poor intake, blood pressure of 88/56 mm Hg, tachycardia, and dry membranes show a low circulating volume, and the creatinine has risen from 0.9 to 3.2 mg/dL. Urine output of 280 mL in a day is oliguria, and the low urine sodium with high urine osmolality means the kidney is still reabsorbing sodium because perfusion is poor. That is prerenal injury from inadequate renal perfusion. Toxic tubular necrosis would raise the urine sodium and produce granular casts, which are absent. Urine is not obstructed: the bladder is empty and there is no hydronephrosis. Interstitial nephritis from a drug needs a new drug, a rash, or white-cell casts, and none of those is present.$ex43$,
  3,
  $dm43$respiratory-renal$dm43$,
  $tp43$aki-mechanisms$tp43$,
  $su43$https://www.merckmanuals.com/professional/genitourinary-disorders/acute-kidney-injury/acute-kidney-injury-aki$su43$,
  $sl43$Acute Kidney Injury - Merck Manual Professional Edition: prerenal injury is poor perfusion with low urine sodium$sl43$,
  $sq43$Hypoperfusion of an otherwise functioning kidney leads to enhanced reabsorption of sodium and water, resulting in oliguria (urine output < 500 mL/day) with high urine osmolality and low urine sodium.$sq43$,
  $ch43$5a67ddd00efc6fbffdf124832edeae51a0dbc69c7bfe9c245f3cef31206666a1$ch43$,
  true,
  $ref43$[{"label":"Acute Kidney Injury - Merck Manual Professional Edition: prerenal injury is poor perfusion with low urine sodium","url":"https://www.merckmanuals.com/professional/genitourinary-disorders/acute-kidney-injury/acute-kidney-injury-aki"}]$ref43$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id44$cmrrv66zo00op1y8wcpj3nt9r$id44$,
  $fx44$re-rate|rewrite$fx44$,
  $sc44$A 28-year-old woman developed severe pneumonia yesterday and is now in respiratory failure. Before intubation the respiratory rate was 30 breaths per minute. On the ventilator the FiO2 is 0.80, PEEP is 8 cm H2O, and PaO2 is 64 mm Hg. Arterial pH is 7.32, PaCO2 is 55 mm Hg, and bicarbonate is 24 mEq/L. The chest radiograph shows bilateral opacities. Echocardiography shows normal left-ventricular function. She has no history of heart failure.$sc44$,
  $qu44$Which diagnosis best accounts for the respiratory failure?$qu44$,
  $op44${"options":["Cardiogenic edema from high left-heart pressure","Embolus occluding a branch pulmonary artery","Air under pressure in both pleural spaces","Diffuse lung injury with hypoxemic failure"],"taskCategory":"interpretation","blueprintTopic":"ards-pathology","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784469290353","qcScore":7.8,"slotIndex":34,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-19T13:55:41.775Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op44$,
  $ky44$Diffuse lung injury with hypoxemic failure$ky44$,
  $ex44$Respiratory failure began within a day of severe pneumonia, with bilateral opacities and a PaO2 of 64 mm Hg on an FiO2 of 0.80 while PEEP is 8 cm H2O. The failure is not explained by heart failure: ventricular function is normal and she has no heart-failure history. Those features are acute respiratory distress syndrome from diffuse lung injury. High left-heart pressure would be required for cardiogenic edema, and the echocardiogram does not show that. An embolus in a pulmonary artery branch does not produce bilateral alveolar opacities after pneumonia. Air in both pleural spaces would be pneumothorax, not bilateral lung opacities.$ex44$,
  2,
  $dm44$respiratory-renal$dm44$,
  $tp44$ards-pathology$tp44$,
  $su44$https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/acute-hypoxemic-respiratory-failure-ahrf-ards$su44$,
  $sl44$Acute Hypoxemic Respiratory Failure - Merck Manual Professional Edition: bilateral opacities and respiratory failure not explained by heart failure$sl44$,
  $sq44$Respiratory failure not fully explained by heart failure or fluid overload.$sq44$,
  $ch44$a85274ed64c5d1d09b533f124591b1b1cb6f68c4c2df6f35ab33766783568114$ch44$,
  true,
  $ref44$[{"label":"Acute Hypoxemic Respiratory Failure - Merck Manual Professional Edition: bilateral opacities and respiratory failure not explained by heart failure","url":"https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/acute-hypoxemic-respiratory-failure-ahrf-ards"}]$ref44$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id45$b10x294ebb06186a9e0515f9895b$id45$,
  $fx45$re-rate|rewrite$fx45$,
  $sc45$A 45-year-old man has been vomiting for two days. Glucose is 480 mg/dL, serum ketones are positive, pH is 7.40, and bicarbonate is 24 mEq/L. The anion gap is 28 mEq/L. He has no diarrhea.$sc45$,
  $qu45$Why is the pH normal despite the large anion gap?$qu45$,
  $op45${"options":["A metabolic alkalosis from vomiting offsets the ketoacidosis","A normal bicarbonate means this anion gap is not an acidosis","Loss of gastric fluid is what opened this anion gap of 28","The glucose of 480 mg/dL is what restored the bicarbonate","A normal pH means that no primary acid-base disorder exists"],"blueprintTopic":"acid-base-physiology","blueprintSystem":"respiratory-renal"}$op45$,
  $ky45$A metabolic alkalosis from vomiting offsets the ketoacidosis$ky45$,
  $ex45$The anion gap of 28 means a metabolic acidosis is present, and the positive ketones with a glucose of 480 mg/dL identify that acidosis as ketoacidosis. Vomiting adds a metabolic alkalosis, and the two processes pull pH and bicarbonate in opposite directions, so both can sit in the normal range. A normal pH is therefore compatible with two disorders at once. Loss of gastric fluid does not open the anion gap. The glucose does not restore bicarbonate, and a normal bicarbonate does not erase an acidosis that the gap has already shown.$ex45$,
  3,
  $dm45$respiratory-renal$dm45$,
  $tp45$acid-base-physiology$tp45$,
  $su45$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/acid-base-regulation-and-disorders/acid-base-disorders$su45$,
  $sl45$Acid-Base Disorders - Merck Manual Professional Edition — mixed disorders can leave measured values deceptively normal$sl45$,
  $sq45$In these mixed disorders, values may be deceptively normal.$sq45$,
  $ch45$999fff85fcbe11268f325cb33b69ba545ac8a1cc640e1cd62b9e28af9b559707$ch45$,
  true,
  $ref45$[{"label":"Acid-Base Disorders - Merck Manual Professional Edition — mixed disorders can leave measured values deceptively normal","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/acid-base-regulation-and-disorders/acid-base-disorders"}]$ref45$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id46$cmra6lu1r000jic0497uhqtw7$id46$,
  $fx46$re-rate|rewrite$fx46$,
  $sc46$A 28-year-old woman at 37 weeks of gestation has a severe headache and blurred vision. The pregnancy had been uncomplicated. Blood pressure is 168/104 mm Hg, and she has hyperreflexia with clonus. Proteinuria is 3+. The platelet count is 90,000/mm3, AST is 120 U/L (laboratory upper limit 40 U/L), and creatinine is 1.0 mg/dL. Lactate dehydrogenase is 180 U/L, bilirubin is normal, and the smear shows no schistocytes.$sc46$,
  $qu46$What is the most likely diagnosis?$qu46$,
  $op46${"options":["Preeclampsia accompanied by severe features","Preeclampsia that lacks any severe features","Gestational hypertension and no proteinuria","Chronic hypertension present before pregnancy","HELLP syndrome that includes red-cell hemolysis"],"blueprintTopic":"preeclampsia-mechanism","blueprintSystem":"reproductive-endocrine"}$op46$,
  $ky46$Preeclampsia accompanied by severe features$ky46$,
  $ex46$New hypertension at 37 weeks, proteinuria, a blood pressure of 168/104 mm Hg, headache, blurred vision, and hyperreflexia with clonus meet criteria for preeclampsia with severe features. Aminotransferases more than twice the upper limit and thrombocytopenia add further end-organ injury. HELLP syndrome requires hemolysis as well, including a lactate dehydrogenase of at least 600 IU/L, and this value is 180 U/L with no schistocytes and a normal bilirubin. Gestational hypertension does not include proteinuria or this end-organ injury. Preeclampsia without severe features does not include this blood pressure or these cerebral findings, and chronic hypertension would have preceded the pregnancy.$ex46$,
  2,
  $dm46$reproductive-endocrine$dm46$,
  $tp46$preeclampsia-mechanism$tp46$,
  $su46$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-of-pregnancy/preeclampsia-and-eclampsia$su46$,
  $sl46$Preeclampsia and Eclampsia - Merck Manual Professional Edition — severe features are severe hypertension or end-organ injury, and HELLP also requires hemolysis$sl46$,
  $sq46$Preeclampsia with severe features is diagnosed in patients with new onset of persistent severe hypertension and/or signs or symptoms of end-organ damage.$sq46$,
  $ch46$0d1eb150fd934ba8cfc842f2175a10fc64db2d897965f12cd7bf7f7d2253bb67$ch46$,
  true,
  $ref46$[{"label":"Preeclampsia and Eclampsia - Merck Manual Professional Edition — severe features are severe hypertension or end-organ injury, and HELLP also requires hemolysis","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-of-pregnancy/preeclampsia-and-eclampsia"}]$ref46$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id47$b4x435b36206913524df5371c2f$id47$,
  $fx47$re-rate|rewrite$fx47$,
  $sc47$In a cohort of adults, coffee drinkers have more pancreatic cancer in the unadjusted table. Smokers drink more coffee, and smoking is already associated with this cancer. After the analysis balances smoking between coffee drinkers and other adults, the coffee association disappears.$sc47$,
  $qu47$Why did the coffee association disappear?$qu47$,
  $op47${"options":["Smoking was mixed into the crude coffee association","Balancing smoking created a new bias toward coffee","Coffee leads to smoking, so coffee remains the cause","Loss of the link shows that coffee prevents cancer","A confounder stays tied to cancer after adjustment"],"blueprintTopic":"study-designs","blueprintSystem":"biostats-epi"}$op47$,
  $ky47$Smoking was mixed into the crude coffee association$ky47$,
  $ex47$Smoking is associated with coffee drinking and is already associated with pancreatic cancer, so it is a confounder of the crude coffee association. Balancing smoking removes that shared path, and the coffee association disappears because it was not an effect of coffee. Adjustment did not create a new bias toward coffee. The disappearance does not show that coffee prevents cancer, and it does not mean coffee causes smoking. A confounder is a factor that distorts the crude association, so its influence should not remain after it has been balanced.$ex47$,
  2,
  $dm47$biostats-epi$dm47$,
  $tp47$study-designs$tp47$,
  $su47$https://pmc.ncbi.nlm.nih.gov/articles/PMC5384727/$su47$,
  $sl47$Control of confounding in the analysis phase – an overview for clinicians — a confounder is associated with both the exposure and the outcome$sl47$,
  $sq47$Confounding arises when a factor is associated with both the exposure (or treatment) and the outcome, eg, a disease or death, and is not part of the causal pathway from exposure to outcome.$sq47$,
  $ch47$1bb7b231bce4a3c1555a8dce43c997211628edaa563bc95c2263a4749c23cebb$ch47$,
  true,
  $ref47$[{"label":"Control of confounding in the analysis phase – an overview for clinicians — a confounder is associated with both the exposure and the outcome","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC5384727/"}]$ref47$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id48$b4x51807a33241a8f22d5c8d98a$id48$,
  $fx48$re-rate|rewrite$fx48$,
  $sc48$A 2-week-old infant girl has ambiguous genitalia and vomiting. Sodium is 124 mEq/L, potassium is 6.4 mEq/L, and blood pressure is 70/40 mm Hg. Cortisol is low, and 17-hydroxyprogesterone is markedly elevated.$sc48$,
  $qu48$Why do virilization and salt wasting occur together?$qu48$,
  $op48${"options":["The block shunts precursors to androgens and stops aldosterone","The block raises aldosterone and it suppresses adrenal androgens","Salt loss here comes from diarrhea, apart from the adrenal","Virilization in this pattern requires a high cortisol level","Elevated 17-hydroxyprogesterone is produced by the kidney"],"blueprintTopic":"adrenal-disorders","blueprintSystem":"reproductive-endocrine"}$op48$,
  $ky48$The block shunts precursors to androgens and stops aldosterone$ky48$,
  $ex48$A 21-hydroxylase block prevents formation of cortisol and of aldosterone, and the backed-up precursors are shunted into androgen production. That is why this infant is virilized and also wastes salt, with hyponatremia, hyperkalemia, hypotension, low cortisol, and a high 17-hydroxyprogesterone. The block does not raise aldosterone or suppress androgens. Diarrhea is not the source of the salt loss in this steroid pattern. Virilization here occurs with a low cortisol, and 17-hydroxyprogesterone accumulates in the adrenal cortex rather than the kidney.$ex48$,
  2,
  $dm48$reproductive-endocrine$dm48$,
  $tp48$adrenal-disorders$tp48$,
  $su48$https://www.merckmanuals.com/professional/pediatrics/endocrine-disorders-in-children/congenital-adrenal-hyperplasia-caused-by-21-hydroxylase-deficiency$su48$,
  $sl48$Congenital Adrenal Hyperplasia Caused by 21-Hydroxylase Deficiency - Merck Manual Professional Edition — precursors enter androgen synthesis while aldosterone deficiency wastes salt$sl48$,
  $sq48$The salt-wasting form of classic 21-hydroxylase deficiency causes hyponatremia (sometimes severe), hyperkalemia, and hypotension as well as virilization.$sq48$,
  $ch48$6bd673031daa22fd934a29468d7e9869f23b6384798b3f430eb40ddbedc638e5$ch48$,
  true,
  $ref48$[{"label":"Congenital Adrenal Hyperplasia Caused by 21-Hydroxylase Deficiency - Merck Manual Professional Edition — precursors enter androgen synthesis while aldosterone deficiency wastes salt","url":"https://www.merckmanuals.com/professional/pediatrics/endocrine-disorders-in-children/congenital-adrenal-hyperplasia-caused-by-21-hydroxylase-deficiency"}]$ref48$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id49$b8xa9f03945dd42ca2e3d1bd751$id49$,
  $fx49$re-rate|rewrite$fx49$,
  $sc49$A newborn boy bleeds again from a circumcision site on the second day of life. The prothrombin time and the partial thromboplastin time are normal, and the platelet count is normal. A clot that was solid at 30 minutes dissolves after it sits in urea. His brother's clot stays intact in the same urea bath.$sc49$,
  $qu49$Why were the clotting times normal when the clot could not hold?$qu49$,
  $op49${"options":["Those assays miss factor XIII, which is the cross-link urea attacks","A normal clotting time means the urea-stable cross-link already formed","Bleeding on the second day means the fibrin strands did not form","A clot that falls apart in urea means the platelets are missing","The brother's intact clot shows that urea dissolves a normal clot"],"blueprintTopic":"coagulation-cascade","blueprintSystem":"blood-lymph-immune"}$op49$,
  $ky49$Those assays miss factor XIII, which is the cross-link urea attacks$ky49$,
  $ex49$Prothrombin time and partial thromboplastin time detect formation of the first fibrin, and they do not measure factor XIII. Factor XIII cross-links that fibrin, and a clot dissolves in urea when the cross-link is missing, which is why his clot failed while his brother's did not. A normal clotting time therefore does not show that the cross-link formed. Delayed bleeding does not mean fibrin failed to appear. Platelets were normal, so the urea finding is not a platelet defect, and urea does not dissolve a cross-linked clot.$ex49$,
  3,
  $dm49$blood-lymph-immune$dm49$,
  $tp49$coagulation-cascade$tp49$,
  $su49$https://www.merckmanuals.com/professional/hematology/hemostasis/excessive-bleeding$su49$,
  $sl49$Excessive Bleeding - Merck Manual Professional Edition — standard clotting times do not measure factor XIII, and a factor XIII-deficient clot lyses in urea$sl49$,
  $sq49$The aPTT tests for deficiencies of all clotting factors except factor VII (measured by the PT) and factor XIII (measured by a factor XIII assay).$sq49$,
  $ch49$db9c0beb262893d94a0ade8563101429b774353aba401b0f8cc1c75b3acac610$ch49$,
  true,
  $ref49$[{"label":"Excessive Bleeding - Merck Manual Professional Edition — standard clotting times do not measure factor XIII, and a factor XIII-deficient clot lyses in urea","url":"https://www.merckmanuals.com/professional/hematology/hemostasis/excessive-bleeding"}]$ref49$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id50$b4xbd2546b2d8210b5bf9900545$id50$,
  $fx50$re-rate|rewrite$fx50$,
  $sc50$A sensitive screening test is positive in a 45-year-old adult. A second test will decide whether that positive screen was false. One candidate second test is extremely sensitive and moderately specific. The other candidate is extremely specific.$sc50$,
  $qu50$Which property should the second test emphasize?$qu50$,
  $op50${"options":["Specificity, so a positive second result is unlikely false","Sensitivity, which repeats the same kind of screening test","A likelihood ratio of one, which leaves the odds unchanged","The same false-positive rate the screening test already has","Disease prevalence, which the laboratory can reset at will"],"blueprintTopic":"sensitivity-specificity","blueprintSystem":"biostats-epi"}$op50$,
  $ky50$Specificity, so a positive second result is unlikely false$ky50$,
  $ex50$A test used to confirm disease should emphasize specificity, so a positive result is unlikely to be a false alarm left by the sensitive screen. Repeating a highly sensitive test piles on the same false-positive problem. A likelihood ratio of one would leave the odds unchanged. Matching the screen's false-positive rate does not confirm the result. Prevalence is a property of the population, not a knob the laboratory sets on the assay.$ex50$,
  2,
  $dm50$biostats-epi$dm50$,
  $tp50$sensitivity-specificity$tp50$,
  $su50$https://www.merckmanuals.com/professional/special-subjects/clinical-decision-making/understanding-medical-tests-and-test-results$su50$,
  $sl50$Understanding Medical Tests and Test Results - Merck Manual Professional Edition — a confirmatory cutoff favors specificity over sensitivity$sl50$,
  $sq50$If a test is designed to confirm a disease, a cutoff point with greater specificity and lower sensitivity is selected.$sq50$,
  $ch50$3f665f22997a5e635b033ae1a8ff4f2f6bed5c8cb903763b135c59f242715a40$ch50$,
  true,
  $ref50$[{"label":"Understanding Medical Tests and Test Results - Merck Manual Professional Edition — a confirmatory cutoff favors specificity over sensitivity","url":"https://www.merckmanuals.com/professional/special-subjects/clinical-decision-making/understanding-medical-tests-and-test-results"}]$ref50$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id51$b4x17c26eea7657424635f63ce9$id51$,
  $fx51$re-rate|rewrite$fx51$,
  $sc51$A 66-year-old man with severe heart failure has edema, a sodium of 126 mEq/L, and a low plasma osmolality. Antidiuretic hormone is measurable in plasma. Blood pressure is 96/60 mm Hg. He is not taking a thiazide and is not drinking seawater.$sc51$,
  $qu51$Why is antidiuretic hormone present when the plasma is already dilute?$qu51$,
  $op51${"options":["Low effective volume releases it even though plasma is dilute","His plasma osmolality is high, which is what released the hormone","Heart failure suppresses the release of antidiuretic hormone","The osmoreceptor reads the low sodium as concentrated plasma","The assay measured aldosterone rather than antidiuretic hormone"],"blueprintTopic":"heart-failure-pathophysiology","blueprintSystem":"cardiovascular"}$op51$,
  $ky51$Low effective volume releases it even though plasma is dilute$ky51$,
  $ex51$In heart failure, effective circulating volume is low even though extracellular volume is high, and that fall in effective volume releases vasopressin. The hormone is therefore present while plasma osmolality and sodium are already low, and the kidneys keep water, which sustains the hyponatremia. His osmolality is low, not high. Heart failure does not suppress this release. The osmoreceptor reads dilute plasma as a signal to turn the hormone off, and the measured hormone is antidiuretic hormone rather than aldosterone.$ex51$,
  2,
  $dm51$cardiovascular$dm51$,
  $tp51$heart-failure-pathophysiology$tp51$,
  $su51$https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyponatremia$su51$,
  $sl51$Hyponatremia - Merck Manual Professional Edition — low effective circulating volume in heart failure releases vasopressin$sl51$,
  $sq51$In each of these disorders, a decrease in effective circulating volume results in the release of vasopressin and angiotensin II.$sq51$,
  $ch51$0adc64cf8976a5918afa50482420c62cbb0e266345e2b9c18c945f965efc3bf2$ch51$,
  true,
  $ref51$[{"label":"Hyponatremia - Merck Manual Professional Edition — low effective circulating volume in heart failure releases vasopressin","url":"https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyponatremia"}]$ref51$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id52$b7xf986c97db2fffd23c84475d9$id52$,
  $fx52$re-rate|rewrite$fx52$,
  $sc52$A 55-year-old patient cannot climb stairs. Scaly red papules lie over the knuckles, and the eyelids are violet. Creatine kinase is high. Muscle biopsy shows atrophy along the outer edge of each fascicle. There is no calf enlargement and no family history of muscle disease.$sc52$,
  $qu52$Why is the atrophy at the edge of the fascicle rather than scattered through it?$qu52$,
  $op52${"options":["Small vessels at the fascicle edge are the site of injury","A missing membrane protein is replacing edge fibers with fat","A dying axon is pulling away from fibers at the fascicle edge","Mitochondrial failure inside each fiber makes this edge pattern","Endomysial T cells are what produce this edge-of-bundle atrophy"],"blueprintTopic":"myopathies","blueprintSystem":"msk-skin"}$op52$,
  $ky52$Small vessels at the fascicle edge are the site of injury$ky52$,
  $ex52$Knuckle papules, violet eyelids, proximal weakness, and a high creatine kinase are dermatomyositis, a complement-mediated injury of small muscle vessels. The fibers at the edge of the fascicle lose their supply first, so atrophy sits at the periphery. A dystrophin defect would tend to enlarge calves and run in families, which this history does not show. A dying axon does not raise creatine kinase in this pattern or cause this rash. Mitochondrial disease does not produce this perifascicular, perivascular picture, and endomysial T-cell injury is the pattern of polymyositis, which lacks this rash and this edge accent.$ex52$,
  3,
  $dm52$msk-skin$dm52$,
  $tp52$myopathies$tp52$,
  $su52$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/autoimmune-myositis$su52$,
  $sl52$Idiopathic Inflammatory Myopathies - Merck Manual Professional Edition — dermatomyositis is a small-vessel vasculopathy with perifascicular inflammation$sl52$,
  $sq52$Dermatomyositis is characterized by immune complex deposition in the vessels and is considered a complement-mediated vasculopathy.$sq52$,
  $ch52$c6169f0193cfa1868eba2ad204b28c9c1cf5233844335bfb814c6482ec3fd9a6$ch52$,
  true,
  $ref52$[{"label":"Idiopathic Inflammatory Myopathies - Merck Manual Professional Edition — dermatomyositis is a small-vessel vasculopathy with perifascicular inflammation","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/autoimmune-myositis"}]$ref52$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id53$b8x53cc4eac02e3a72ff69caeac$id53$,
  $fx53$re-rate|rewrite$fx53$,
  $sc53$Two patients are euvolemic and each has a sodium of 124 mEq/L with low plasma osmolality. A 28-year-old drinks water through the day and has a urine osmolality of 80 mOsm/kg. A 60-year-old with a lung mass is not thirsty and has a urine osmolality of 600 mOsm/kg.$sc53$,
  $qu53$Why can the younger patient dilute the urine while the older patient cannot?$qu53$,
  $op53${"options":["Water load suppressed his hormone; the other patient cannot","A urine osmolality of 600 means that hormone has turned off","Euvolemia means the hormone is suppressed in both patients","The lung mass is what makes that patient's urine dilute","Constant water drinking pushes urine osmolality above plasma"],"blueprintTopic":"aki-mechanisms","blueprintSystem":"respiratory-renal"}$op53$,
  $ky53$Water load suppressed his hormone; the other patient cannot$ky53$,
  $ex53$Urine osmolality of 80 mOsm/kg is below plasma, so antidiuretic hormone is off and the younger patient is excreting the water load. Urine osmolality of 600 mOsm/kg is not maximally dilute despite low plasma osmolality and euvolemia, which is inappropriate antidiuretic hormone release, here in a patient with a lung mass. A urine osmolality of 600 means the hormone is on, not off. Euvolemia is the setting in which that inappropriate release is diagnosed, not proof that both patients have suppressed the hormone. The lung mass is not a cause of dilute urine, and drinking water does not raise urine osmolality above plasma.$ex53$,
  3,
  $dm53$respiratory-renal$dm53$,
  $tp53$aki-mechanisms$tp53$,
  $su53$https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyponatremia$su53$,
  $sl53$Hyponatremia - Merck Manual Professional Edition — inappropriate antidiuretic hormone leaves the urine less than maximally dilute despite low plasma osmolality$sl53$,
  $sq53$The syndrome of inappropriate ADH ( vasopressin ) secretion is attributed to excessive vasopressin release.$sq53$,
  $ch53$f1f9678adc93583fa95d093780b63f93b796be40a2a4b2eb305b8abe3717392d$ch53$,
  true,
  $ref53$[{"label":"Hyponatremia - Merck Manual Professional Edition — inappropriate antidiuretic hormone leaves the urine less than maximally dilute despite low plasma osmolality","url":"https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyponatremia"}]$ref53$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id54$b4xbc501408f6e5a158eac86f8f$id54$,
  $fx54$re-rate|rewrite$fx54$,
  $sc54$A 46-year-old man takes azathioprine after a kidney transplant. Allopurinol is started for gout, and the azathioprine dose is left unchanged. Two weeks later the leukocyte count is 1,200/mm3. Creatinine is stable. He has no fever and no rash.$sc54$,
  $qu54$Why did the leukocyte count fall?$qu54$,
  $op54${"options":["Allopurinol slowed clearance of the azathioprine metabolite","Allopurinol hypersensitivity suppressed marrow by itself here","Azathioprine blocked clearance of allopurinol into a toxin","A stable creatinine means graft rejection consumed leukocytes","Gout crystals entered the marrow and destroyed white cells"],"blueprintTopic":"pharmacology-interactions","blueprintSystem":"multisystem"}$op54$,
  $ky54$Allopurinol slowed clearance of the azathioprine metabolite$ky54$,
  $ex54$Allopurinol inhibits xanthine oxidase and decreases metabolism of azathioprine, so the active metabolite accumulates and its cytolytic effect on marrow intensifies. The azathioprine dose was not changed, creatinine is stable, and the leukocyte count fell after allopurinol was added. Hypersensitivity to allopurinol is a poor fit with no rash and no fever. Azathioprine does not block clearance of allopurinol. A stable creatinine argues against graft rejection, and gout crystals do not destroy marrow cells in this pattern.$ex54$,
  3,
  $dm54$multisystem$dm54$,
  $tp54$pharmacology-interactions$tp54$,
  $su54$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout$su54$,
  $sl54$Gout - Merck Manual Professional Edition — allopurinol decreases azathioprine metabolism and potentiates marrow toxicity$sl54$,
  $sq54$Allopurinol is contraindicated in patients taking azathioprine or mercaptopurine because it can decrease metabolism of these medications and thus potentiate their immunosuppressive and cytolytic effects.$sq54$,
  $ch54$e313695168b681bc9133bf999bdd74f205c0f84385d32363d0145d93e1c68163$ch54$,
  true,
  $ref54$[{"label":"Gout - Merck Manual Professional Edition — allopurinol decreases azathioprine metabolism and potentiates marrow toxicity","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$ref54$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id55$b4x6e0a5ba215df82c902514a8b$id55$,
  $fx55$re-rate|rewrite$fx55$,
  $sc55$A 25-year-old man has a normal luteinizing hormone, a low follicle-stimulating hormone, a high inhibin B, and a normal testosterone. The sperm count is low because of a separate testicular problem. He asks how one pituitary hormone fell while the other stayed normal.$sc55$,
  $qu55$Why can follicle-stimulating hormone fall while luteinizing hormone stays normal?$qu55$,
  $op55${"options":["Inhibin restrains follicle-stimulating hormone and spares luteinizing hormone","Inhibin restrains both pituitary hormones and the luteinizing assay failed","Testosterone restrains follicle-stimulating hormone and spares luteinizing hormone","The hypothalamus uses two releasing hormones, one for each pituitary hormone","Follicle-stimulating hormone is made in the testis and was consumed there"],"blueprintTopic":"pcos-endocrine","blueprintSystem":"reproductive-endocrine"}$op55$,
  $ky55$Inhibin restrains follicle-stimulating hormone and spares luteinizing hormone$ky55$,
  $ex55$Inhibin B from Sertoli cells inhibits follicle-stimulating hormone, while estradiol is the main inhibitor of luteinizing hormone. A high inhibin B can therefore lower follicle-stimulating hormone while luteinizing hormone and testosterone stay normal. Inhibin does not restrain both hormones, so a failed luteinizing-hormone assay is not required. Testosterone is normal and is not a selective brake on follicle-stimulating hormone. One gonadotropin-releasing hormone drives both pituitary hormones, and follicle-stimulating hormone is made in the pituitary, not the testis.$ex55$,
  2,
  $dm55$reproductive-endocrine$dm55$,
  $tp55$pcos-endocrine$tp55$,
  $su55$https://www.merckmanuals.com/professional/genitourinary-disorders/male-reproductive-endocrinology-and-related-disorders/male-reproductive-endocrinology$su55$,
  $sl55$Male Reproductive Endocrinology - Merck Manual Professional Edition — inhibin B inhibits FSH, whereas estradiol is the main inhibitor of LH$sl55$,
  $sq55$In males, estradiol is the main inhibitor of LH production, whereas both estradiol and inhibin B, a peptide produced by Sertoli cells of the testes, inhibit production of FSH.$sq55$,
  $ch55$350c3accac39ce2ff5723b1ec43a824ebabbc1679418c454cd2e7c8b862cb9f2$ch55$,
  true,
  $ref55$[{"label":"Male Reproductive Endocrinology - Merck Manual Professional Edition — inhibin B inhibits FSH, whereas estradiol is the main inhibitor of LH","url":"https://www.merckmanuals.com/professional/genitourinary-disorders/male-reproductive-endocrinology-and-related-disorders/male-reproductive-endocrinology"}]$ref55$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id56$b1xbfc54bc9021edc6e0fceef63$id56$,
  $fx56$re-rate|rewrite$fx56$,
  $sc56$A 60-year-old man received a tenfold insulin dose because a decimal point was misplaced. His glucose fell to 28 mg/dL. He recovered after intravenous dextrose, is awake, has decision-making capacity, and asks why he felt so ill.$sc56$,
  $qu56$Which response is appropriate?$qu56$,
  $op56${"options":["Tell him the dosing error, its effect, and the plan to prevent a repeat","Wait until the full review ends before saying that an error occurred","Apologize for his symptoms without stating that the insulin dose was wrong","Explain the dosing error to his family and do not discuss it with him","Tell him an error occurred but omit the effect and the prevention plan"],"blueprintTopic":"ethics-professionalism","blueprintSystem":"social-sciences"}$op56$,
  $ky56$Tell him the dosing error, its effect, and the plan to prevent a repeat$ky56$,
  $ex56$After a harmful dosing error, the patient who is awake and asking should be told promptly what happened, what it did to him, and what will be done so it does not happen again. Waiting for a finished review withholds facts that are already known. An apology that hides the wrong dose does not disclose the event. He has capacity and is the person who asked, so the explanation goes to him rather than stopping with his family. Naming an error while omitting the glucose effect and the prevention plan leaves out the consequences and the remedy.$ex56$,
  1,
  $dm56$social-sciences$dm56$,
  $tp56$ethics-professionalism$tp56$,
  $su56$https://pmc.ncbi.nlm.nih.gov/articles/PMC80781/$su56$,
  $sl56$Bioethics for clinicians: 23. Disclosure of medical error — tell the patient what happened, the consequences, and the plan to prevent recurrence$sl56$,
  $sq56$Disclose promptly what you know about the event.$sq56$,
  $ch56$edabd0594fa8a69a64a9fd5435978ba83cab93b926caa9590f5c80d1201188dd$ch56$,
  true,
  $ref56$[{"label":"Bioethics for clinicians: 23. Disclosure of medical error — tell the patient what happened, the consequences, and the plan to prevent recurrence","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC80781/"}]$ref56$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id57$b8x81ff5e0dcf780e33aef2eaa6$id57$,
  $fx57$re-rate|rewrite$fx57$,
  $sc57$A 66-year-old man vomits for two days and then takes ibuprofen. Creatinine rises from 1.0 to 2.2 mg/dL. Before the vomiting, the same dose had not changed the creatinine. He is volume depleted, afebrile, and not septic. The urine sediment is bland, and he has no rash.$sc57$,
  $qu57$Why did filtration fall after the vomiting but not before?$qu57$,
  $op57${"options":["Volume loss left the afferent vessel dependent on dilation he blocked","Volume depletion on its own raises pressure inside the glomerulus","Ibuprofen constricts the efferent arteriole and so lowers filtration","A bland sediment means the renal tubules have undergone necrosis","Vomiting itself caused afferent constriction before this drug was given"],"blueprintTopic":"aki-mechanisms","blueprintSystem":"respiratory-renal"}$op57$,
  $ky57$Volume loss left the afferent vessel dependent on dilation he blocked$ky57$,
  $ex57$Ibuprofen reduces renal perfusion by constricting the afferent arteriole. After vomiting left him volume depleted, filtration depended on that afferent vessel staying open, so the same dose that had been tolerated then lowered the creatinine clearance. Volume depletion does not raise glomerular pressure. Efferent constriction is the pattern of angiotensin-blocking drugs, not this one, and would not be the lesion named for this drug. A bland sediment without fever or rash argues against tubular necrosis and against acute interstitial nephritis. Vomiting did not create afferent constriction that made the earlier doses safe; the drug became harmful once volume had fallen.$ex57$,
  2,
  $dm57$respiratory-renal$dm57$,
  $tp57$aki-mechanisms$tp57$,
  $su57$https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki$su57$,
  $sl57$Acute Kidney Injury - Merck Manual Professional Edition — NSAIDs reduce renal perfusion by afferent arteriolar constriction, and volume depletion is a prerenal state$sl57$,
  $sq57$Medications that reduce renal perfusion (eg, nonsteroidal anti-inflammatory drugs, angiotensin-converting enzyme inhibitors or angiotensin II receptor blockers, calcineurin inhibitors).$sq57$,
  $ch57$0d9cd2ab1c086e45add38eab5ac627914c75224e96762d54a7afef388fea341a$ch57$,
  true,
  $ref57$[{"label":"Acute Kidney Injury - Merck Manual Professional Edition — NSAIDs reduce renal perfusion by afferent arteriolar constriction, and volume depletion is a prerenal state","url":"https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki"}]$ref57$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id58$b8x505a26f881a35e075ae733c2$id58$,
  $fx58$re-rate|rewrite$fx58$,
  $sc58$A 50-year-old patient's finger tremor grows as the finger nears the examiner's finger and is quiet when the hand rests in the lap. A 70-year-old patient's hand shakes while it rests in the lap and quiets when he reaches. Both have trouble using the hand.$sc58$,
  $qu58$Why does the first tremor grow as the finger nears the target?$qu58$,
  $op58${"options":["Cerebellar smoothing fails, so the error grows toward the target","A tremor that is quiet while the hand rests is the cerebellar form","The lap tremor that quiets on reaching is a failure of cerebellar aim","Both tremors come from one circuit and differ by speed of the reach","Moving toward a target damps this tremor along with every other tremor"],"blueprintTopic":"neurodegenerative","blueprintSystem":"behavioral-nervous"}$op58$,
  $ky58$Cerebellar smoothing fails, so the error grows toward the target$ky58$,
  $ex58$An intention tremor increases as the limb approaches its target because the cerebellum is failing to correct the movement in real time. The first patient's tremor is quiet at rest and grows near the target, which is that cerebellar pattern. A tremor that is quiet in the lap and appears at rest is the parkinsonian pattern, and it lessens during activity rather than representing a failure of aim. The two tremors are separated by when they appear, not by the speed of one shared circuit. Approaching a target does not damp this tremor; it is when the tremor grows.$ex58$,
  2,
  $dm58$behavioral-nervous$dm58$,
  $tp58$neurodegenerative$tp58$,
  $su58$https://www.merckmanuals.com/professional/neurologic-disorders/movement-and-cerebellar-disorders/tremor$su58$,
  $sl58$Tremor - Merck Manual Professional Edition — intention tremor increases as the limb reaches its target, while a resting tremor lessens with activity$sl58$,
  $sq58$Intention tremors have a crescendo and increase as the affected body part reaches its target.$sq58$,
  $ch58$61b8a27f5bf608b2811b9bd5577fb8408b3dcc0f5efff5aa4735e845b46a0443$ch58$,
  true,
  $ref58$[{"label":"Tremor - Merck Manual Professional Edition — intention tremor increases as the limb reaches its target, while a resting tremor lessens with activity","url":"https://www.merckmanuals.com/professional/neurologic-disorders/movement-and-cerebellar-disorders/tremor"}]$ref58$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id59$b7xb6cd39d373d26f387163d637$id59$,
  $fx59$re-rate|rewrite$fx59$,
  $sc59$A 70-year-old man who smoked for decades has a low ratio of forced expiratory volume in one second to forced vital capacity, and that ratio falls further when he exhales as hard as he can. Lung compliance is high, residual volume is large, and he produces almost no sputum. A quiet breath obstructs him less than a forced blow.$sc59$,
  $qu59$Why does a harder blow worsen the obstruction?$qu59$,
  $op59${"options":["Lost radial tether lets pleural pressure collapse unsupported airways","High compliance means the small airways are fibrotic and fixed shut","A large residual volume props the small airways open during a hard blow","Almost no sputum means the limit is a mass inside a main bronchus","A quiet breath generates more collapsing pressure than a forced blow"],"blueprintTopic":"asthma-copd-pathology","blueprintSystem":"respiratory-renal"}$op59$,
  $ky59$Lost radial tether lets pleural pressure collapse unsupported airways$ky59$,
  $ex59$Emphysema destroys parenchyma, so elastic recoil, alveolar septa, and radial airway traction are lost and unsupported airways collapse when pleural pressure rises in a forced blow. High compliance is a lung that empties too readily, not a fibrotic fixed airway. The large residual volume is air trapped behind that collapse, not a force that props airways open. Almost no sputum fits loss of tethering throughout the lung rather than one obstructing bronchial mass. A quiet breath generates less positive pleural pressure than a forced blow, which is why the quiet breath obstructs him less.$ex59$,
  3,
  $dm59$respiratory-renal$dm59$,
  $tp59$asthma-copd-pathology$tp59$,
  $su59$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd$su59$,
  $sl59$Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition — loss of radial airway traction in emphysema lets airways collapse$sl59$,
  $sq59$Emphysema is destruction of lung parenchyma leading to a loss of elastic recoil, loss of alveolar septa, and radial airway traction, which increases the tendency for airway collapse.$sq59$,
  $ch59$917616b9e1ce23bfecf09f93954303a7fd25634822a14b8893118eca5d3b9744$ch59$,
  true,
  $ref59$[{"label":"Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition — loss of radial airway traction in emphysema lets airways collapse","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$ref59$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id60$b8xfbd51d5d37765aca2f1fbe8c$id60$,
  $fx60$re-rate|rewrite$fx60$,
  $sc60$A 27-year-old patient develops ascending weakness and loses deep-tendon reflexes one week after a diarrheal illness. Spinal-fluid protein is high and the spinal-fluid white-cell count is normal. He has no fever, and sensation is largely spared. A classmate attributes the high protein to bacterial meningitis.$sc60$,
  $qu60$Why does the normal spinal-fluid cell count reject bacterial meningitis?$qu60$,
  $op60${"options":["Bacteria bring in white cells; this protein leaked from roots without them","Lost reflexes mean the spinal fluid must contain a neutrophil response","Diarrhea a week earlier means bacteria are now inside the spinal fluid","Absence of fever still fits fluid that is full of bacteria and has no cells","High protein with a normal cell count is the bacterial fluid pattern"],"blueprintTopic":"ms-pathology","blueprintSystem":"behavioral-nervous"}$op60$,
  $ky60$Bacteria bring in white cells; this protein leaked from roots without them$ky60$,
  $ex60$This pattern is albuminocytologic dissociation: protein is high because inflamed nerve roots leak it, while the white-cell count stays normal. Bacterial meningitis brings white cells into the fluid along with the organism, so a normal cell count rejects that diagnosis. Lost reflexes here are the nerve roots, not a requirement for neutrophils in the fluid. The earlier diarrhea is a trigger for the immune attack and does not mean bacteria are now in the spinal fluid. Absence of fever fits this root process, and high protein without cells is not the bacterial pattern.$ex60$,
  2,
  $dm60$behavioral-nervous$dm60$,
  $tp60$ms-pathology$tp60$,
  $su60$https://www.merckmanuals.com/professional/neurologic-disorders/peripheral-nervous-system-and-motor-unit-disorders/guillain-barr%C3%A9-syndrome-gbs$su60$,
  $sl60$Guillain-Barré Syndrome - Merck Manual Professional Edition — cerebrospinal fluid can show high protein with a normal white-cell count$sl60$,
  $sq60$CSF analysis may detect albuminocytologic dissociation (increased protein but normal white blood cell count), but it may not appear for up to 1 week and does not develop in 10% of patients.$sq60$,
  $ch60$8e98e3a81c60bb220b9f24e5222f21b5589d85e259aecf9c079f7cb38da711b8$ch60$,
  true,
  $ref60$[{"label":"Guillain-Barré Syndrome - Merck Manual Professional Edition — cerebrospinal fluid can show high protein with a normal white-cell count","url":"https://www.merckmanuals.com/professional/neurologic-disorders/peripheral-nervous-system-and-motor-unit-disorders/guillain-barr%C3%A9-syndrome-gbs"}]$ref60$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id61$b7x73458c4a8a2c773e494762c6$id61$,
  $fx61$re-rate|rewrite$fx61$,
  $sc61$A 42-year-old patient cannot make a fist for two hours each morning and then loosens, and the knuckles are swollen. A 72-year-old patient has knee pain after walking and stiffness that lasts ten minutes. Neither patient has a fever.$sc61$,
  $qu61$Why does two-hour morning stiffness point to inflamed synovium rather than worn cartilage?$qu61$,
  $op61${"options":["Inflamed synovium loosens slowly, while worn cartilage stiffens briefly","Ten minutes of morning stiffness is the pattern of synovial inflammation","Knuckle swelling is the usual pattern of cartilage wear in large joints","Pain brought on by walking means the synovial membrane is inflamed","The two patterns are one disease separated by the age of the patient"],"blueprintTopic":"rheumatoid-arthritis","blueprintSystem":"msk-skin"}$op61$,
  $ky61$Inflamed synovium loosens slowly, while worn cartilage stiffens briefly$ky61$,
  $ex61$Morning stiffness lasting two hours, with swollen knuckles, is inflamed synovium, as in rheumatoid arthritis, where stiffness after inactivity lasts more than an hour. Stiffness of about ten minutes that follows walking is worn cartilage, which loosens quickly and hurts with load. Ten minutes of stiffness is not synovial inflammation. Knuckle swelling is a small-joint synovial pattern, not cartilage wear of large joints. Pain after walking is mechanical load across worn cartilage, and age by itself does not make these one disease.$ex61$,
  1,
  $dm61$msk-skin$dm61$,
  $tp61$rheumatoid-arthritis$tp61$,
  $su61$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra$su61$,
  $sl61$Rheumatoid Arthritis - Merck Manual Professional Edition — inflammatory stiffness lasts more than 60 minutes after rising$sl61$,
  $sq61$Typically, stiffness lasts > 60 minutes after rising in the morning but may occur after any prolonged inactivity (called gelling).$sq61$,
  $ch61$5ba0e718205c9cc77ef5053bf4e10da1a0ecc08ea18a9f22d475d7b73bd6d844$ch61$,
  true,
  $ref61$[{"label":"Rheumatoid Arthritis - Merck Manual Professional Edition — inflammatory stiffness lasts more than 60 minutes after rising","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra"}]$ref61$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id62$b1x5a8a06c308382c8bd94cf6a6$id62$,
  $fx62$re-rate|rewrite$fx62$,
  $sc62$A 62-year-old man with long-standing hypertension has sudden tearing pain between the shoulder blades. Blood pressure is 180/100 mm Hg in the right arm and 110/70 mm Hg in the left arm. The chest film shows a widened mediastinum. He has no fever.$sc62$,
  $qu62$Which wall layer has torn?$qu62$,
  $op62${"options":["Intima, with blood tracking in the aortic media","Adventitia torn, with the aortic lumen left intact","Myocardium of the left ventricular free wall","A coronary plaque, with the aortic wall spared","Pericardium, with no tear through the aortic wall"],"blueprintTopic":"atherosclerosis-mechanisms","blueprintSystem":"cardiovascular"}$op62$,
  $ky62$Intima, with blood tracking in the aortic media$ky62$,
  $ex62$Sudden tearing pain between the shoulder blades, unequal arm pressures, and a widened mediastinum are an aortic dissection: blood surges through a tear in the intima and tracks in the media. An adventitial tear with an intact lumen would not create that false channel or the unequal pulses. Left ventricular free-wall rupture follows infarction and fills the pericardium rather than widening the mediastinum in this way. A coronary plaque causes ischemic pain without a widened mediastinum or a pulse deficit between the arms. The pericardium is not the layer that has torn.$ex62$,
  2,
  $dm62$cardiovascular$dm62$,
  $tp62$atherosclerosis-mechanisms$tp62$,
  $su62$https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection$su62$,
  $sl62$Aortic Dissection - Merck Manual Professional Edition — blood enters through an intimal tear and splits the media$sl62$,
  $sq62$Aortic dissection is the surging of blood through a tear in the aortic intima with separation of the intima and media and creation of a false lumen (channel).$sq62$,
  $ch62$2e291da0a754d9199e1296e4f944066e435197ee88709c47bdff1d3c8856fe3c$ch62$,
  true,
  $ref62$[{"label":"Aortic Dissection - Merck Manual Professional Edition — blood enters through an intimal tear and splits the media","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection"}]$ref62$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id63$cmrpvux64000i1yh5al51283d$id63$,
  $fx63$re-rate|rewrite$fx63$,
  $sc63$A 25-year-old woman has fever, joint pain, and a rash that began on the cheeks, spared the nasolabial folds, and spread to the arms. Antinuclear antibody is positive, and anti-double-stranded DNA antibody is positive. She takes no medications. Muscle strength is normal, and creatine kinase is normal.$sc63$,
  $qu63$What is the most likely diagnosis?$qu63$,
  $op63${"options":["Systemic lupus erythematosus with anti-DNA antibody","Dermatomyositis presenting as a violet eyelid rash","Drug-induced lupus caused by a prescribed medicine","Rheumatoid arthritis limited to the small hand joints"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"lupus-pathology","blueprintSystem":"msk-skin","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349531909","qcScore":8.3,"slotIndex":20,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:39:31.269Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op63$,
  $ky63$Systemic lupus erythematosus with anti-DNA antibody$ky63$,
  $ex63$A malar rash that spares the nasolabial folds, fever, joint pain, a positive antinuclear antibody, and anti-double-stranded DNA antibody are systemic lupus erythematosus. Anti-double-stranded DNA antibody is highly specific for that disease. Dermatomyositis is unlikely with normal strength and a normal creatine kinase and without knuckle papules. Drug-induced lupus requires a culprit drug, and she takes none. Rheumatoid arthritis does not produce this malar rash or this antibody.$ex63$,
  1,
  $dm63$msk-skin$dm63$,
  $tp63$lupus-pathology$tp63$,
  $su63$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/systemic-lupus-erythematosus-sle$su63$,
  $sl63$Systemic Lupus Erythematosus - Merck Manual Professional Edition — anti-dsDNA antibody is highly specific for systemic lupus erythematosus$sl63$,
  $sq63$Positive ANA should prompt more specific testing such as anti-dsDNA antibodies; anti-dsDNA is highly specific for SLE.$sq63$,
  $ch63$1aba1891f7bdd9484375e27fb91f18c8fea6a335811f559d5f03ede20932b326$ch63$,
  true,
  $ref63$[{"label":"Systemic Lupus Erythematosus - Merck Manual Professional Edition — anti-dsDNA antibody is highly specific for systemic lupus erythematosus","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/systemic-lupus-erythematosus-sle"}]$ref63$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id64$cmrpvyuu700021yrtpwkdjcvn$id64$,
  $fx64$re-rate|rewrite$fx64$,
  $sc64$A 45-year-old woman with systemic lupus erythematosus has two days of fever, a malar rash, and swollen joints. She takes hydroxychloroquine. Creatinine is 1.5 mg/dL. Urinalysis shows 3+ protein and many red cells. Antinuclear antibody is positive.$sc64$,
  $qu64$Which laboratory result best supports active lupus nephritis?$qu64$,
  $op64${"options":["A low serum C3 and a low serum C4","An elevated serum uric acid level","A leukocyte count rich in eosinophils","Rising serum C3 and rising serum C4"],"kind":"lab_interpretation","taskCategory":"pharmacotherapy","blueprintTopic":"lupus-pathology","blueprintSystem":"msk-skin","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349795144","qcScore":8.1,"slotIndex":2,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:44:34.483Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op64$,
  $ky64$A low serum C3 and a low serum C4$ky64$,
  $ex64$Proteinuria, hematuria, and a rising creatinine in a patient with systemic lupus erythematosus point to lupus nephritis, and low C3 and C4 support immune-complex activity. A high uric acid does not mark that activity. Eosinophil-rich leukocytosis suggests an allergic interstitial nephritis, which this chronic hydroxychloroquine course and the lupus picture do not show. Rising complement would move against active immune-complex disease rather than support it.$ex64$,
  2,
  $dm64$msk-skin$dm64$,
  $tp64$lupus-pathology$tp64$,
  $su64$https://www.merckmanuals.com/professional/genitourinary-disorders/glomerular-disorders/lupus-nephritis$su64$,
  $sl64$Lupus Nephritis - Merck Manual Professional Edition — low complement and anti-dsDNA antibody indicate active lupus nephritis$sl64$,
  $sq64$Elevated anti-dsDNA antibody titers and low complement levels often indicate active lupus nephritis and support the diagnosis.$sq64$,
  $ch64$63c3d4e1356fa7c6ab429cc516d518509dc23edc2a1933f441164a105d4b7c1d$ch64$,
  true,
  $ref64$[{"label":"Lupus Nephritis - Merck Manual Professional Edition — low complement and anti-dsDNA antibody indicate active lupus nephritis","url":"https://www.merckmanuals.com/professional/genitourinary-disorders/glomerular-disorders/lupus-nephritis"}]$ref64$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id65$cmrpwck7i004z1yrtaajh5ghh$id65$,
  $fx65$re-rate|rewrite$fx65$,
  $sc65$A 54-year-old man has fatigue and left-upper-quadrant fullness. The spleen is enlarged. The leukocyte count is 120,000/mm3, with a left shift, 8% basophils, and 2% blasts. Hemoglobin is 11 g/dL, and the platelet count is 480,000/mm3.$sc65$,
  $qu65$Which molecular lesion drives this illness?$qu65$,
  $op65${"options":["BCR-ABL fusion with constitutive kinase activity","JAK2 mutation with cytokine-independent signaling","FLT3 mutation inside a dominant blast population","TP53 loss as the founding driver of this blood count"],"taskCategory":"diagnosis","blueprintTopic":"leukemia-classification","blueprintSystem":"blood-lymph-immune","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350382703","qcScore":7.7,"slotIndex":25,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-18T04:53:50.812Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op65$,
  $ky65$BCR-ABL fusion with constitutive kinase activity$ky65$,
  $ex65$Marked leukocytosis with a left shift, basophilia, few blasts, and splenomegaly is chronic-phase chronic myeloid leukemia. That disease is driven by BCR-ABL fusion kinase activity from the chromosome 9 and 22 rearrangement. A JAK2 mutation fits a myeloproliferative picture dominated by high hemoglobin or an isolated platelet rise, not this basophilic left shift. FLT3 belongs to acute myeloid leukemia, and blasts are 2%, not a blast-dominant marrow. TP53 loss is not the founding lesion of this chronic myeloid picture.$ex65$,
  1,
  $dm65$blood-lymph-immune$dm65$,
  $tp65$leukemia-classification$tp65$,
  $su65$https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/chronic-myeloid-leukemia-cml$su65$,
  $sl65$Chronic Myeloid Leukemia - Merck Manual Professional Edition — BCR-ABL fusion kinase drives the disease, and the smear shows immature granulocytes and basophilia$sl65$,
  $sq65$The chimeric fusion gene BCR::ABL is responsible for production of the oncoprotein BCR::ABL tyrosine kinase.$sq65$,
  $ch65$097c685c091877a4c01acb09a0f4840354be680ebed25a4147e7b426c681684f$ch65$,
  true,
  $ref65$[{"label":"Chronic Myeloid Leukemia - Merck Manual Professional Edition — BCR-ABL fusion kinase drives the disease, and the smear shows immature granulocytes and basophilia","url":"https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/chronic-myeloid-leukemia-cml"}]$ref65$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id66$cmrpvuw9500071yh5mo0pstv8$id66$,
  $fx66$re-rate|rewrite$fx66$,
  $sc66$A 45-year-old woman with systemic lupus erythematosus takes hydroxychloroquine and no other drug. For two days she has had fever, joint pain, and a malar rash. Temperature is 38.5 C. Antinuclear antibody is positive, anti-double-stranded DNA antibody is positive, and C3 and C4 are low.$sc66$,
  $qu66$What is the most likely diagnosis?$qu66$,
  $op66${"kind":"sequential","stepLevel":"step1","blueprintSystem":"msk-skin","blueprintTopic":"lupus-pathology","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349531909","qcScore":8.1,"slotIndex":8,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:41:02.661Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["A flare of her systemic lupus erythematosus","Drug-induced lupus from hydroxychloroquine","New rheumatoid arthritis as a separate illness","A viral exanthem causing the facial rash"],"taskCategory":"clinical-intervention"}$op66$,
  $ky66$A flare of her systemic lupus erythematosus$ky66$,
  $ex66$Fever, joint pain, a malar rash, anti-double-stranded DNA antibody, and low C3 and C4 in a woman who already has systemic lupus erythematosus are a flare with increased disease activity. Hydroxychloroquine is not one of the drugs that cause drug-induced lupus, such as hydralazine, procainamide, or tumor necrosis factor inhibitors. New rheumatoid arthritis does not produce this malar rash, this antibody, or low complement. A viral exanthem does not generate anti-double-stranded DNA antibody or consume complement.$ex66$,
  1,
  $dm66$msk-skin$dm66$,
  $tp66$lupus-pathology$tp66$,
  $su66$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/systemic-lupus-erythematosus-sle$su66$,
  $sl66$Systemic Lupus Erythematosus - Merck Manual Professional Edition — anti-dsDNA antibody marks lupus, and drug-induced lupus follows other medicines$sl66$,
  $sq66$Positive ANA should prompt more specific testing such as anti-dsDNA antibodies; anti-dsDNA is highly specific for SLE.$sq66$,
  $ch66$4bb302182a3aa42da5ee40b2c8e6a1b14958a3f79f2eb7d559b7b8408c66a95c$ch66$,
  true,
  $ref66$[{"label":"Systemic Lupus Erythematosus - Merck Manual Professional Edition — anti-dsDNA antibody marks lupus, and drug-induced lupus follows other medicines","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/autoimmune-rheumatic-disorders/systemic-lupus-erythematosus-sle"}]$ref66$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id67$cmrpw18yw002x1yh5k5xqmicm$id67$,
  $fx67$rewrite$fx67$,
  $sc67$A 45-year-old woman has obesity and type 2 diabetes and drinks no alcohol. She feels well. AST is 48 U/L, ALT is 72 U/L, bilirubin is 0.8 mg/dL, and alkaline phosphatase is normal. Hepatitis B surface antigen and hepatitis C antibody are negative. Ferritin and transferrin saturation are normal. Ultrasound shows hepatic steatosis.$sc67$,
  $qu67$What is the most likely diagnosis?$qu67$,
  $op67${"options":["Nonalcoholic fatty liver disease","Alcohol-associated hepatic steatosis","Chronic hepatitis B or C infection","Iron overload from hemochromatosis"],"taskCategory":"interpretation","blueprintTopic":"liver-pathology","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349901374","qcScore":7.9,"slotIndex":30,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:45:52.059Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op67$,
  $ky67$Nonalcoholic fatty liver disease$ky67$,
  $ex67$Hepatic steatosis in a woman with obesity and type 2 diabetes who drinks no alcohol is nonalcoholic fatty liver disease. ALT is higher than AST, bilirubin is normal, and alkaline phosphatase is normal, which fits that pattern rather than alcohol-related injury. Viral hepatitis is excluded by the negative hepatitis B surface antigen and hepatitis C antibody. Hereditary hemochromatosis is excluded by the normal ferritin and transferrin saturation.$ex67$,
  2,
  $dm67$gastrointestinal$dm67$,
  $tp67$liver-pathology$tp67$,
  $su67$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/approach-to-the-patient-with-liver-disease/metabolic-dysfunction-associated-steatotic-liver-disease-masld$su67$,
  $sl67$Metabolic Dysfunction–Associated Steatotic Liver Disease - Merck Manual Professional Edition — steatosis with a metabolic risk factor and little or no alcohol, with AST/ALT usually below 1$sl67$,
  $sq67$Metabolic dysfunction–associated steatotic liver disease (MASLD, previously known as fatty liver or nonalcoholic fatty liver disease [NAFLD]) is defined as the presence of hepatic steatosis in individuals with at least one metabolic risk factor (eg, obesity, dyslipidemia) and minimal or no alcohol consumption$sq67$,
  $ch67$45e4029abe300ed446d9f85bf63c373e7213c639783bfc6ff32eed757153d169$ch67$,
  true,
  $ref67$[{"label":"Metabolic Dysfunction–Associated Steatotic Liver Disease - Merck Manual Professional Edition — steatosis with a metabolic risk factor and little or no alcohol, with AST/ALT usually below 1","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/approach-to-the-patient-with-liver-disease/metabolic-dysfunction-associated-steatotic-liver-disease-masld"}]$ref67$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id68$cmrr4y8wf00271y6p6btbtqp9$id68$,
  $fx68$re-rate|rewrite$fx68$,
  $sc68$A 45-year-old woman has fatigue, fever of 38.1 C, and jaundice after a month of heavy drinking. AST is 220 U/L, ALT is 85 U/L, total bilirubin is 3.2 mg/dL, and alkaline phosphatase is normal. The liver is enlarged and tender. Ultrasound shows no gallstones and no bile-duct dilation. Hepatitis B surface antigen, hepatitis C antibody, and antinuclear antibody are negative.$sc68$,
  $qu68$Which process best explains these findings?$qu68$,
  $op68${"options":["Alcoholic hepatitis with an AST-predominant pattern","Simple hepatic steatosis without inflammatory injury","Autoimmune hepatitis provoked by recent drinking","Extrahepatic obstruction from a bile-duct stone"],"kind":"lab_interpretation","taskCategory":"clinical-intervention","blueprintTopic":"liver-pathology","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784425396655","qcScore":8.2,"slotIndex":0,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-19T01:44:05.675Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"clinical-intervention"}$op68$,
  $ky68$Alcoholic hepatitis with an AST-predominant pattern$ky68$,
  $ex68$Fever, jaundice, and a tender enlarged liver after heavy drinking, with AST greater than twice ALT and both enzymes under 300 U/L, are alcoholic hepatitis. Simple steatosis is often asymptomatic, and the liver is not usually tender. Autoimmune hepatitis is unlikely with a negative antinuclear antibody and this alcohol-linked enzyme ratio. A gallstone does not fit a normal alkaline phosphatase and an ultrasound without stones or duct dilation.$ex68$,
  2,
  $dm68$gastrointestinal$dm68$,
  $tp68$liver-pathology$tp68$,
  $su68$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$su68$,
  $sl68$Alcohol-Related Liver Disease - Merck Manual Professional Edition — moderate alcoholic hepatitis causes fever, jaundice, and tender hepatomegaly, with AST/ALT at least 2$sl68$,
  $sq68$Most patients with moderate disease are undernourished and present with fatigue, fever, jaundice, right upper quadrant pain, tender hepatomegaly, and sometimes a hepatic bruit.$sq68$,
  $ch68$a164e88a58679ebdf3d6646bd65fca1079fba93d4d534a38aa912b95e0839396$ch68$,
  true,
  $ref68$[{"label":"Alcohol-Related Liver Disease - Merck Manual Professional Edition — moderate alcoholic hepatitis causes fever, jaundice, and tender hepatomegaly, with AST/ALT at least 2","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$ref68$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id69$cmrthhpzp00711yax0u3mc7o6$id69$,
  $fx69$re-rate|rewrite$fx69$,
  $sc69$A 60-year-old man with chronic obstructive pulmonary disease has worsening dyspnea, a respiratory rate of 28 breaths per minute, and oxygen saturation of 88% on room air. He has been using his albuterol inhaler more often. Examination shows wheezing and a prolonged expiratory phase. The chest film shows hyperinflation and no infiltrate.$sc69$,
  $qu69$What is the mechanism of the inhaler he has been using more often?$qu69$,
  $op69${"options":["Beta-2 agonism that relaxes bronchial smooth muscle","Muscarinic blockade that relaxes bronchial smooth muscle","Phosphodiesterase inhibition that raises cyclic AMP","Leukotriene-receptor blockade that limits constriction"],"taskCategory":"pharmacotherapy","blueprintTopic":"drug-moa-side-effects","blueprintSystem":"multisystem","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784567195670","qcScore":7.6,"slotIndex":13,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-20T17:07:42.745Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op69$,
  $ky69$Beta-2 agonism that relaxes bronchial smooth muscle$ky69$,
  $ex69$Albuterol is a short-acting beta-2 agonist bronchodilator, so the mechanism of the inhaler he is using more often is beta-2 agonism that relaxes bronchial smooth muscle. Muscarinic blockade is the action of ipratropium, which is not the inhaler named here. Phosphodiesterase inhibition is the action of a methylxanthine, not albuterol. Leukotriene-receptor blockade is a controller medicine and is not this rescue inhaler.$ex69$,
  2,
  $dm69$multisystem$dm69$,
  $tp69$drug-moa-side-effects$tp69$,
  $su69$https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/wheezing$su69$,
  $sl69$Wheezing - Merck Manual Professional Edition — albuterol is a short-acting beta-2 agonist bronchodilator$sl69$,
  $sq69$Wheezing itself can be relieved with inhaled short acting beta2-agonist bronchodilators (eg, albuterol 2.5 mg nebulized solution or 108 mcg metered dose inhalation).$sq69$,
  $ch69$6448205b9dd1bb73460d63062fd5d5d72b34ecc996bd69d8fbf787ba9af8f283$ch69$,
  true,
  $ref69$[{"label":"Wheezing - Merck Manual Professional Edition — albuterol is a short-acting beta-2 agonist bronchodilator","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/wheezing"}]$ref69$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id70$cmrtg0wbc001e1yx29o5t8rif$id70$,
  $fx70$re-rate|rewrite$fx70$,
  $sc70$A 58-year-old man has palpitations and lightheadedness. Blood pressure is 110/70 mm Hg, and the heart rate is 150 beats per minute. The electrocardiogram shows a regular narrow-complex rhythm and continuous sawtooth atrial waves in leads II, III, and aVF.$sc70$,
  $qu70$What is the most likely rhythm?$qu70$,
  $op70${"options":["Atrial flutter conducted 2-to-1 to the ventricles","AV nodal reentrant tachycardia with a narrow QRS","Atrial fibrillation with rapid ventricular response","Ventricular tachycardia arising in ventricular muscle"],"kind":"vignette","stepLevel":"step1","blueprintSystem":"cardiovascular","blueprintTopic":"arrhythmia-electrophysiology","physicianTask":"communication","generationMeta":{"batchId":"raise-exam-ready-usmle-step-1-1784563583382","examNumber":9002,"slotIndex":12,"stepLevel":"step1","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-20T16:28:58.549Z"}}$op70$,
  $ky70$Atrial flutter conducted 2-to-1 to the ventricles$ky70$,
  $ex70$Continuous sawtooth atrial waves in the inferior leads are typical atrial flutter, and a regular ventricular rate of 150 beats per minute is the usual 2-to-1 conduction of an atrial rate near 300. Atrioventricular nodal reentrant tachycardia is also regular and narrow, but it does not show continuous sawtooth flutter waves. Atrial fibrillation is irregular. Ventricular tachycardia has a wide QRS complex, and this QRS is narrow.$ex70$,
  3,
  $dm70$cardiovascular$dm70$,
  $tp70$arrhythmia-electrophysiology$tp70$,
  $su70$https://www.merckmanuals.com/professional/cardiovascular-disorders/arrhythmias-and-conduction-disorders/atrial-flutter$su70$,
  $sl70$Atrial Flutter - Merck Manual Professional Edition — 2-to-1 conduction gives a regular ventricular rate near 150 with sawtooth flutter waves$sl70$,
  $sq70$Because the atrioventricular (AV) node cannot usually conduct at this rate, typically half of the impulses get through (2:1 block), resulting in a regular ventricular rate of 150 beats/minute.$sq70$,
  $ch70$59e1ecf1f33c62e6b5f81b2269fd6bc87c7819c5f7ac12f101648ed2cd454185$ch70$,
  true,
  $ref70$[{"label":"Atrial Flutter - Merck Manual Professional Edition — 2-to-1 conduction gives a regular ventricular rate near 150 with sawtooth flutter waves","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/arrhythmias-and-conduction-disorders/atrial-flutter"}]$ref70$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id71$cmr89b4oc00kj1yw2ydxc7lrf$id71$,
  $fx71$re-rate$fx71$,
  $sc71$A 28-year-old woman is evaluated for a fasting plasma glucose of 118 mg/dL on two separate mornings. Her hemoglobin A1c is 6.4%. She is lean, has no polyuria, and has never had ketoacidosis. Her mother and maternal grandfather have had the same mild fasting hyperglycemia since early adulthood and have never needed insulin. Glutamic acid decarboxylase antibodies are negative.$sc71$,
  $qu71$Which enzyme deficiency is most likely?$qu71$,
  $op71${"options":["Glucokinase deficiency","Phosphofructokinase deficiency","Hexokinase deficiency","Fructose-1,6-bisphosphatase deficiency"],"distractorRationale":{"Glucokinase deficiency":"Correct answer; associated with impaired insulin secretion and hyperglycemia.","Phosphofructokinase deficiency":"Incorrect; primarily affects glycolysis and would not cause hyperglycemia in this context.","Hexokinase deficiency":"Incorrect; while it affects glucose metabolism, it is less common and would not typically present with this clinical picture.","Fructose-1,6-bisphosphatase deficiency":"Incorrect; relates to gluconeogenesis and would not explain the hyperglycemia in a diabetic patient."},"clinicalReasoning":"The patient's presentation of confusion and excessive thirst, along with elevated blood glucose levels, suggests a metabolic derangement likely due to an enzyme deficiency affecting glucose metabolism. Glucokinase deficiency leads to impaired insulin secretion, which can explain the hyperglycemic state observed in this patient.","keyTakeaways":["When evaluating hyperglycemia in diabetes, consider glucokinase deficiency as a potential cause of insulin secretion impairment."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"diabetes-pathophysiology","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783283355343","qcScore":8,"slotIndex":59,"stepLevel":"step1","examNumber":9107,"generatedAt":"2026-07-05T20:41:30.227Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op71$,
  $ky71$Glucokinase deficiency$ky71$,
  $ex71$This is maturity-onset diabetes of the young from a glucokinase (GCK) variant: lifelong mild fasting hyperglycemia, a similarly affected parent and grandparent, no ketoacidosis, and negative islet antibodies. Glucokinase sets the glucose threshold for insulin release. Phosphofructokinase, hexokinase, and fructose-1,6-bisphosphatase defects do not produce this stable autosomal-dominant fasting pattern.$ex71$,
  3,
  $dm71$reproductive-endocrine$dm71$,
  $tp71$diabetes-pathophysiology$tp71$,
  NULL,
  NULL,
  NULL,
  $ch71$3bec3c39c62761bfcf5b81a34d079ad1583a96ac1b997c47c179a3751a19adb4$ch71$,
  true,
  $ref71$[{"url":"https://medlineplus.gov/genetics/condition/maturity-onset-diabetes-of-the-young/","label":"MedlinePlus Genetics. GCK-MODY is a mild form of maturity-onset diabetes of the young, with slightly high fasting blood glucose."}]$ref71$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id72$cmr4m1i0n006w1y1es8cei0x1$id72$,
  $fx72$re-rate$fx72$,
  NULL,
  $qu72$A 28-year-old woman comes to the clinic because of irregular menstrual cycles, hirsutism and weight gain over the past year. Examination shows acanthosis nigricans on her neck, and blood pressure is 130/85 mm Hg. Serum testosterone is elevated, and pelvic ultrasound shows enlarged ovaries with multiple small peripheral follicles. Which of the following additional laboratory findings is most consistent with this diagnosis?$qu72$,
  $op72$["Elevated FSH", "Elevated luteal-phase progesterone", "Increased fasting insulin", "Elevated prolactin"]$op72$,
  $ky72$Increased fasting insulin$ky72$,
  $ex72$Correct answer: C. Increased fasting insulin. Irregular cycles, hirsutism with elevated testosterone and polycystic-appearing ovaries indicate PCOS, and acanthosis nigricans is a skin marker of insulin resistance with hyperinsulinemia. Why the other options are wrong: A. FSH is normal or low-normal in PCOS. B. Anovulation means luteal progesterone is low. D. Hyperprolactinemia is a mimic excluded during the workup, not a feature of PCOS.$ex72$,
  3,
  $dm72$reproductive-endocrine$dm72$,
  $tp72$pcos-endocrine$tp72$,
  NULL,
  NULL,
  NULL,
  $ch72$9876dbe3372f7a2c90379a41d4ee2e455a7e7f6c066c721b74a771178ca7839c$ch72$,
  true,
  $ref72$[{"label":"PCOS: Pathophysiology and Management, Journal of Clinical Endocrinology & Metabolism"}]$ref72$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id73$9c18482f-a03f-40a0-8efd-7c3a0218f735$id73$,
  $fx73$re-rate$fx73$,
  $sc73$A 3-year-old boy spent his first two years moving between institutions and had no consistent caregiver. In the exam room he climbs into the examiner lap within a minute, asks to go home with the examiner, and does not look back at the foster parent who brought him. He greeted the receptionist with the same immediate familiarity. He speaks in sentences and points to show the foster parent a toy, so social communication is not absent. There is no motor regression and no fever. The foster parent says this happens with every new adult. He is not afraid of the examiner.$sc73$,
  $qu73$Which of the following best interprets this approach to strangers?$qu73$,
  $op73${"options": ["Disinhibited social engagement after early absence of a selective attachment figure", "Secure attachment, because friendliness with adults means the separation did no harm", "Normal stranger anxiety, which would make him cling to the foster parent and refuse the examiner", "Autism spectrum disorder, which would reduce social approach rather than produce indiscriminate approach", "Avoidant attachment limited to one caregiver, which would not include leaving with a stranger just met"], "blueprintSystem": "human-development", "taskCategory": "interpretation", "blueprintTopic": "dev-09", "kind": "vignette"}$op73$,
  $ky73$Disinhibited social engagement after early absence of a selective attachment figure$ky73$,
  $ex73$After early care with no stable attachment figure, some children approach any adult, sit in a stranger lap, and are willing to leave with someone they just met. That indiscriminate pattern, repeated with the receptionist and the examiner, and without checking back with the foster parent, is disinhibited social engagement. Preserved sentences and pointing make a primary social-communication disorder less likely. Secure attachment, because friendliness with adults means the separation did no harm, misreads indiscriminate friendliness as security; a secure child prefers a familiar caregiver and uses that person as a base. Normal stranger anxiety, which would make him cling to the foster parent and refuse the examiner, is the opposite of climbing into a new lap. Autism spectrum disorder, which would reduce social approach rather than produce indiscriminate approach, is unlikely when he is socially eager, points to show toys, and speaks in sentences. Avoidant attachment limited to one caregiver, which would not include leaving with a stranger just met, describes coolness toward a specific caregiver, not a willingness to depart with every new adult.$ex73$,
  3,
  $dm73$behavioral-nervous$dm73$,
  $tp73$psychiatric-pharmacology$tp73$,
  NULL,
  NULL,
  NULL,
  $ch73$50b2ae5c7fcbac9fe6895b1dc32ed194778233a49665977a158caca70123692d$ch73$,
  true,
  $ref73$[{"url":"https://shop.elsevier.com/books/guyton-and-hall-textbook-of-medical-physiology/hall/978-0-323-59712-8","label":"Hall JE, Hall ME. Guyton and Hall Textbook of Medical Physiology. 14th ed. Elsevier 2021"}]$ref73$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id74$b1x396959c176153b243af9d811$id74$,
  $fx74$re-rate$fx74$,
  $sc74$A 2-week-old boy is limp after days of vomiting. Blood pressure is 68/40 mm Hg. Sodium is 124 mEq/L and potassium is 6.8 mEq/L. The phallus is enlarged and the scrotum is pigmented.$sc74$,
  $qu74$Which enzyme is deficient?$qu74$,
  $op74$["Aromatase","5-alpha-reductase","21-hydroxylase","17-alpha-hydroxylase","11-beta-hydroxylase"]$op74$,
  $ky74$21-hydroxylase$ky74$,
  $ex74$A virilized infant in salt-wasting shock has 21-hydroxylase deficiency. 21-hydroxylase loss removes cortisol and aldosterone and shunts steroid precursors into androgens. 17-alpha-hydroxylase causes hypertension with absent sex steroids, not salt-wasting shock. 11-beta-hydroxylase virilizes but raises blood pressure through deoxycorticosterone. Aromatase deficiency virilizes a female fetus and does not cause neonatal salt loss in a boy. 5-alpha-reductase deficiency prevents dihydrotestosterone formation and under-virilizes genetic males.$ex74$,
  2,
  $dm74$reproductive-endocrine$dm74$,
  $tp74$adrenal-disorders$tp74$,
  NULL,
  NULL,
  NULL,
  $ch74$e348a74ed6537150d323a33d53fe7bebd7988a277704266896339e30d9cbe2d3$ch74$,
  true,
  NULL
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id75$plt0dd804bb9b598275073184c3$id75$,
  $fx75$re-rate$fx75$,
  $sc75$A 7-month-old boy has had two pneumonias and bulky, foul stools. Sweat chloride is 92 mmol/L. Both CFTR alleles lack phenylalanine at position 508.$sc75$,
  $qu75$What happens to this mutant CFTR protein?$qu75$,
  $op75$["It is synthesized, reaches the apical membrane, and then cannot open its gate", "It misfolds and is degraded in the endoplasmic reticulum before it reaches the membrane", "It is never translated because the transcript is destroyed, as a description of that mechanism alone", "It reaches the membrane but conducts chloride more slowly than normal, as a description of that mechanism alone", "It is routed to the basolateral membrane and secretes chloride the wrong way"]$op75$,
  $ky75$It misfolds and is degraded in the endoplasmic reticulum before it reaches the membrane$ky75$,
  $ex75$Deletion of phenylalanine 508 makes CFTR misfold so it is degraded in the endoplasmic reticulum and never reaches the apical membrane. It misfolds and is degraded in the endoplasmic reticulum before it reaches the membrane, which is why sweat chloride stays high and the airway surface dries. It is synthesized, reaches the apical membrane, and then cannot open its gate describes a class III gating mutant, not delta-F508. It is never translated because the transcript is destroyed is a class I null. It reaches the membrane but conducts chloride more slowly than normal is a class IV conductance mutant. It is routed to the basolateral membrane and secretes chloride the wrong way is not the trafficking error of this allele.$ex75$,
  2,
  $dm75$biostats-epi$dm75$,
  $tp75$dna-repair-genetics$tp75$,
  NULL,
  NULL,
  NULL,
  $ch75$5293f73b1ff427f05c8eb4259d45e9c53b545b72b47f9036dcb5bb8ff11c915a$ch75$,
  true,
  NULL
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id76$cmrr4t1u0000k1y6pg528ivkh$id76$,
  $fx76$re-rate$fx76$,
  $sc76$A 45-year-old man with a history of hypertension and diabetes presents for a routine check-up. His laboratory results show a serum creatinine of 2.3 mg/dL and a blood urea nitrogen (BUN) of 30 mg/dL. He has not experienced any recent changes in medication or diet. His blood pressure is 150/90 mm Hg. Serum sodium is 140 mEq/L, chloride is 104 mEq/L, and bicarbonate is 24 mEq/L.$sc76$,
  $qu76$What is the anion gap (mEq/L)?$qu76$,
  $op76${"options":["10","12","14","16"],"distractorRationale":{"10":"This value is lower than the typical normal range for anion gap, which suggests an error in calculation or assumption of electrolyte values.","14":"This value is slightly above the normal range but does not account for the typical values seen in patients with renal impairment.","16":"This value may be correct if electrolyte levels are abnormal, but without specific values, it cannot be assumed."},"clinicalReasoning":"Assess the patient's renal function and typical lab values to calculate the anion gap. Analyze the clinical context of chronic conditions affecting electrolyte balance.","keyTakeaways":["When calculating the anion gap, always use standard electrolyte values unless specific lab results suggest otherwise."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"transplant-immunology","blueprintSystem":"hematology-immunology","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784425001227","qcScore":8.1,"slotIndex":21,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T01:37:32.604Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op76$,
  $ky76$12$ky76$,
  $ex76$Anion gap = sodium − (chloride + bicarbonate) = 140 − (104 + 24) = 12 mEq/L. The gap is normal. The creatinine and urea do not enter this calculation.$ex76$,
  3,
  $dm76$respiratory-renal$dm76$,
  $tp76$acid-base-physiology$tp76$,
  NULL,
  NULL,
  NULL,
  $ch76$ae33453c7bd358f31a628316a364f7751065a6095ccf23bf1abbd0d0a69cf4a1$ch76$,
  true,
  $ref76$[{"label":"USMLE Content Outline 2026"}]$ref76$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id77$cmr89zvio00q81yw2dehw8v84$id77$,
  $fx77$re-rate$fx77$,
  $sc77$A 58-year-old man presents to the emergency department with palpitations and shortness of breath. He has a history of hypertension and is currently taking lisinopril. On examination, his blood pressure is 142/88 mm Hg, heart rate is 120 beats per minute, and he appears anxious. An ECG shows narrow QRS complexes with a regular rhythm. Laboratory tests reveal a potassium level of 4.1 mEq/L.$sc77$,
  $qu77$What is the most likely underlying mechanism contributing to this patient's arrhythmia?$qu77$,
  $op77${"options":["Increased intracellular potassium concentration","Decreased vagal tone","Increased sympathetic stimulation","Altered conduction velocity in the atrioventricular node"],"distractorRationale":{"Decreased vagal tone":"This option is a common trap as it is often assumed that decreased vagal tone is the primary cause of tachycardia, but it does not address the underlying hyperkalemia.","Increased sympathetic stimulation":"This distractor is misleading because while sympathetic stimulation can increase heart rate, it does not explain the arrhythmia caused by hyperkalemia.","Altered conduction velocity in the atrioventricular node":"This option fails because it does not directly relate to the mechanism of arrhythmia caused by elevated potassium levels."},"clinicalReasoning":"Assess the patient's symptoms and lab results, noting the elevated potassium level. Analyze the relationship between hyperkalemia and cardiac conduction, integrating this knowledge to conclude that increased intracellular potassium concentration is the primary mechanism for the arrhythmia.","keyTakeaways":["When you see elevated potassium levels, think of their potential to cause serious cardiac arrhythmias due to altered myocardial depolarization."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"arrhythmia-electrophysiology","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783284752963","qcScore":8.4,"slotIndex":29,"stepLevel":"step1","examNumber":9109,"generatedAt":"2026-07-05T20:56:37.673Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op77$,
  $ky77$Increased sympathetic stimulation$ky77$,
  $ex77$He is anxious, with a regular narrow-complex rate of 120 and a normal potassium. That is sinus tachycardia from sympathetic drive. Hyperkalemia raises extracellular, not intracellular, potassium and widens the QRS. Vagal tone is not decreased as the specific finding, and an isolated AV-node conduction change is not required for sinus tachycardia.$ex77$,
  3,
  $dm77$cardiovascular$dm77$,
  $tp77$arrhythmia-electrophysiology$tp77$,
  NULL,
  NULL,
  NULL,
  $ch77$02152f53fa07ff6933a4c89f29a2a82100bf370f38bb9cf6e6ffa4f7057dd468$ch77$,
  true,
  $ref77$[{"url":"https://medlineplus.gov/ency/article/001179.htm","label":"MedlinePlus Medical Encyclopedia. A high potassium level is a high level in the blood, and severe elevation affects the heart."}]$ref77$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id78$cmrvm5zrm0024jw04sbmd2efy$id78$,
  $fx78$hide dup$fx78$,
  $sc78$A 16-year-old girl presents to a family planning clinic for contraceptive counseling. She is sexually active with one partner and expresses a desire to keep her visit confidential, stating she does not want her mother, who is in the waiting room, to be informed. The patient demonstrates a clear understanding of the risks and benefits of contraception, and state law allows minors to access reproductive health services confidentially. Her vital signs are stable, and there are no signs of distress.$sc78$,
  $qu78$What is the most appropriate response to the mother's demand for information?$qu78$,
  $op78${"options": ["Disclose the visit details to the mother because the patient is a minor", "Refuse contraception until parental consent is obtained, as a description of that mechanism alone", "Respect confidentiality and discuss contraception with the patient alone", "Report the patient to child protective services for sexual activity, as a description of that mechanism alone", "Schedule a family meeting and require the patient to disclose first"], "distractorRationale": {"Disclose the visit details to the mother because the patient is a minor": "While minors often need parental consent for many medical decisions, state laws allow for confidential access to reproductive health services when the minor demonstrates maturity. (This option fails to recognize the legal protections in place for minors regarding reproductive health.)", "Refuse contraception until parental consent is obtained, as a description of that mechanism alone": "In this case, the law permits minors to access contraceptive services without parental consent, especially when they show understanding and maturity. (This option overlooks the legal framework that supports adolescent autonomy in healthcare.)", "Report the patient to child protective services for sexual activity, as a description of that mechanism alone": "The patient is engaging in consensual sexual activity, which does not warrant a report to child protective services; such actions are reserved for cases of abuse or exploitation. (This option misinterprets the criteria for mandatory reporting and the nature of the patient's situation.)", "Schedule a family meeting and require the patient to disclose first": "Forcing the patient to disclose her visit to her mother could breach her confidentiality and trust, potentially deterring her from seeking care in the future. (This option fails to prioritize the patient's right to confidentiality and autonomy.)"}, "clinicalReasoning": "Respecting confidentiality is essential for patient trust and legal compliance. **Confidentiality** is a legal right for minors seeking reproductive health services. The patient demonstrates **maturity** and understanding of her health choices.", "keyTakeaways": ["When dealing with adolescent patients, prioritize their confidentiality and autonomy to foster trust and compliance with healthcare services."]}$op78$,
  $ky78$Respect confidentiality and discuss contraception with the patient alone$ky78$,
  $ex78$## Why this answer is correct
Respecting confidentiality is essential for patient trust and legal compliance.
• **Confidentiality** is a legal right for minors seeking reproductive health services.
• The patient demonstrates **maturity** and understanding of her health choices.
• **Trust** is crucial in the patient-provider relationship, especially for adolescents.
**In practice:** On the unit, this means that maintaining confidentiality encourages adolescents to seek necessary care without fear of parental involvement, ultimately supporting their health and autonomy.
## Why the other options are wrong



**Disclose the visit details to the mother because the patient is a minor**
• Trap: Students may think that being a minor automatically requires parental notification.
• Why it fails here: While minors often need parental consent for many medical decisions, state laws allow for confidential access to reproductive health services when the minor demonstrates maturity.
• Remember: This option fails to recognize the legal protections in place for minors regarding reproductive health.

**Refuse contraception until parental consent is obtained**
• Trap: There is a common belief that parental consent is always necessary for minors.
• Why it fails here: In this case, the law permits minors to access contraceptive services without parental consent, especially when they show understanding and maturity.
• Remember: This option overlooks the legal framework that supports adolescent autonomy in healthcare.

**Report the patient to child protective services for sexual activity**
• Trap: Students might confuse consensual sexual activity with abuse or neglect.
• Why it fails here: The patient is engaging in consensual sexual activity, which does not warrant a report to child protective services; such actions are reserved for cases of abuse or exploitation.
• Remember: This option misinterprets the criteria for mandatory reporting and the nature of the patient's situation.

**Schedule a family meeting and require the patient to disclose first**
• Trap: There may be an assumption that family involvement is always beneficial in healthcare decisions.
• Why it fails here: Forcing the patient to disclose her visit to her mother could breach her confidentiality and trust, potentially deterring her from seeking care in the future.
• Remember: This option fails to prioritize the patient's right to confidentiality and autonomy.
## Key takeaway
**When dealing with adolescent patients, prioritize their confidentiality and autonomy to foster trust and compliance with healthcare services.**

**Memory hook:** Remember: **Confidentiality is key** for minors in reproductive health—think 'trust first, consent later.'$ex78$,
  3,
  $dm78$multisystem$dm78$,
  $tp78$pre-post-op-care$tp78$,
  NULL,
  NULL,
  NULL,
  $ch78$48c219f083d16f1ac6acfa4116fa3d4c80ea659b256e9fadcf3f659570cf4884$ch78$,
  false,
  NULL
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id79$cmrrvb5me00031yl8l5tii6p9$id79$,
  $fx79$hide dup$fx79$,
  $sc79$A 70-year-old man with a history of heart failure presents to the emergency department with worsening dyspnea and edema. He is afebrile, with a blood pressure of 130/80 mm Hg, heart rate of 88 bpm, and has elevated B-type natriuretic peptide (BNP) levels of 800 pg/mL. Chest X-ray shows cardiomegaly and pulmonary congestion.$sc79$,
  $qu79$What is the most appropriate next step in management?$qu79$,
  $op79${"options":["Administer diuretics","Start beta-blocker therapy","Initiate ACE inhibitor therapy","Obtain echocardiography"],"distractorRationale":{"Start beta-blocker therapy":"This option is incorrect as beta-blockers are not indicated in acute heart failure exacerbation and may worsen symptoms initially.","Initiate ACE inhibitor therapy":"While ACE inhibitors are critical in heart failure management, they should not be started during acute exacerbations without prior stabilization.","Obtain echocardiography":"This option is incorrect as echocardiography is not the immediate next step in managing acute heart failure; diuretics should be prioritized."},"clinicalReasoning":"Analyze the patient's symptoms and lab results to prioritize interventions that relieve heart failure symptoms effectively.","keyTakeaways":["When managing acute heart failure exacerbation, prioritize diuretics to relieve fluid overload symptoms first."],"kind":"lab_interpretation","taskCategory":"professionalism","blueprintTopic":"biostatistics-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784469725856","qcScore":8.2,"slotIndex":3,"stepLevel":"step2","examNumber":9201,"generatedAt":"2026-07-19T14:03:00.171Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$op79$,
  $ky79$Administer diuretics$ky79$,
  $ex79$## Why this answer is correct
Administering diuretics is the most appropriate next step to relieve symptoms of heart failure exacerbation.
• **Diuretics** are first-line treatment for acute heart failure to reduce fluid overload.
• They help alleviate **pulmonary congestion** and **peripheral edema**, improving patient comfort.
• Other medications like **beta-blockers** and **ACE inhibitors** are important but not for immediate relief.
**In practice:** On the unit, administering diuretics quickly can significantly improve a patient's breathing and overall comfort, which is crucial in acute settings.
## Why the other options are wrong



**Start beta-blocker therapy**
• Trap: Students may think beta-blockers are beneficial for heart failure management in all situations.
• Why it fails here: Beta-blockers can worsen symptoms during an acute heart failure exacerbation and are not indicated until the patient is stabilized.
• Remember: This highlights the importance of prioritizing immediate symptom relief over long-term management strategies.

**Initiate ACE inhibitor therapy**
• Trap: There is a common belief that ACE inhibitors should be started early in heart failure management.
• Why it fails here: ACE inhibitors should only be initiated after the patient is stabilized, as they can cause hypotension and worsen acute symptoms.
• Remember: This reinforces the need to focus on immediate interventions that address acute symptoms.

**Obtain echocardiography**
• Trap: Students might think that further diagnostic imaging is necessary before treatment.
• Why it fails here: While echocardiography is useful for assessing heart function, it is not urgent in the context of acute management where diuretics are needed first.
• Remember: This emphasizes the principle of addressing acute clinical needs before pursuing additional diagnostics.
## Key takeaway
**When managing acute heart failure exacerbation, prioritize diuretics to relieve fluid overload symptoms first.**

**Memory hook:** Think 'D for Diuretics, D for Drowning' — diuretics help dry out the patient in heart failure.$ex79$,
  2,
  $dm79$biostats-epi$dm79$,
  $tp79$biostatistics-interpretation$tp79$,
  NULL,
  NULL,
  NULL,
  $ch79$996520f02126dc8dcd80a12decd64e5a2b50b023a3b16796d5a6bec24ebe2c4c$ch79$,
  false,
  $ref79$[{"url":"https://medlineplus.gov/ency/patientinstructions/000112.htm","label":"MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this."}]$ref79$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id80$cmtpw0njn002i1ylc2ttubtxi$id80$,
  $fx80$re-rate|re-tag|rewrite$fx80$,
  $sc80$A 72-year-old woman with heart failure has two days of worsening dyspnea despite taking her oral furosemide. Blood pressure is 118/74 mm Hg, and the heart rate is 104 beats per minute. She is alert, and the extremities are warm. She has jugular venous distention, bilateral crackles, and leg edema. The chest film shows cardiomegaly and pulmonary congestion. Oxygen saturation is 91% on room air.$sc80$,
  $qu80$What is the most appropriate next step in management?$qu80$,
  $op80${"kind":"ethics","stepLevel":"step2","blueprintSystem":"cardiovascular","blueprintTopic":"chf-management","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788703609139","examNumber":9202,"slotIndex":9,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-09-06T14:07:40.111Z"},"options":["Give intravenous furosemide for the congestion","Start an oral beta blocker for the heart rate","Obtain an echocardiogram before any treatment","Start intravenous nitroglycerin for the congestion"]}$op80$,
  $ky80$Give intravenous furosemide for the congestion$ky80$,
  $ex80$She is volume overloaded and still congested on oral furosemide, and she is alert with warm extremities and a blood pressure of 118/74 mm Hg, so she is perfusing and is not in cardiogenic shock. The mainstay of treatment for this acute congestion is an intravenous loop diuretic. An oral beta blocker is not started into acute congestion. An echocardiogram does not remove the fluid. Intravenous nitroglycerin does not replace the loop diuretic as the treatment of this salt-and-water overload at a blood pressure that is not severely elevated.$ex80$,
  3,
  $dm80$cardiovascular$dm80$,
  $tp80$chf-management$tp80$,
  $su80$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure$su80$,
  $sl80$Acute Heart Failure - Merck Manual Professional Edition — intravenous loop diuretics are the mainstay of decongestion$sl80$,
  $sq80$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide, torsemide, bumetanide) in either oral or intravenous form.$sq80$,
  $ch80$f4d1d360a05b87ac10680f59cb7296abd00799c480661b10ef5d20d9f01588a6$ch80$,
  true,
  $ref80$[{"label":"Acute Heart Failure - Merck Manual Professional Edition — intravenous loop diuretics are the mainstay of decongestion","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$ref80$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id81$cmr85su6800011yr9yvxqw6oe$id81$,
  $fx81$re-rate|re-tag|rewrite$fx81$,
  $sc81$A 6-year-old girl who has not received routine vaccines has had fever of 39.4 C for three days, with cough, runny nose, and red watery eyes. Yesterday a maculopapular rash started at the hairline and has spread onto the trunk. She is alert, the neck is supple, the lungs are clear, and she has had no diarrhea.$sc81$,
  $qu81$What is the most likely diagnosis?$qu81$,
  $op81${"options":["Measles with cough, coryza, and a descending rash","Bacterial meningitis with fever and neck findings","Bacterial pneumonia with fever and lung findings","Viral gastroenteritis with fever but no diarrhea"],"kind":"vignette","taskCategory":"interpretation","blueprintTopic":"pediatric-infections","blueprintSystem":"human-development","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783277450710","qcScore":8.2,"slotIndex":1,"stepLevel":"step2","examNumber":9201,"generatedAt":"2026-07-05T18:52:39.583Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"interpretation"}$op81$,
  $ky81$Measles with cough, coryza, and a descending rash$ky81$,
  $ex81$Fever, cough, a runny nose, red watery eyes, and a maculopapular rash that started at the hairline and spread downward, in a child who has not been vaccinated, are measles. She is alert with a supple neck, so this is not bacterial meningitis. The lungs are clear, so this is not bacterial pneumonia. She has had no diarrhea, so this is not viral gastroenteritis.$ex81$,
  3,
  $dm81$human-development$dm81$,
  $tp81$pediatric-infections$tp81$,
  $su81$https://www.merckmanuals.com/professional/pediatrics/common-viral-infections-in-infants-and-children/measles$su81$,
  $sl81$Measles - Merck Manual Professional Edition — fever, cough, coryza, conjunctivitis, and a rash that spreads cephalocaudally$sl81$,
  $sq81$It is characterized by fever, cough, coryza, conjunctivitis, a characteristic enanthem (Koplik spots) on the oral mucosa, and a maculopapular exanthem that spreads cephalocaudally.$sq81$,
  $ch81$777a04312353bb413cf9230a171fe7b06422ef308f3e56ff989bc8b9c099f5ee$ch81$,
  true,
  $ref81$[{"label":"Measles - Merck Manual Professional Edition — fever, cough, coryza, conjunctivitis, and a rash that spreads cephalocaudally","url":"https://www.merckmanuals.com/professional/pediatrics/common-viral-infections-in-infants-and-children/measles"}]$ref81$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id82$cmtpx3e8u00as1y6ha53ax9wh$id82$,
  $fx82$re-rate|re-tag$fx82$,
  $sc82$A 50-year-old man with a history of type 2 diabetes presents to the emergency department with confusion and a blood glucose level of 450 mg/dL. He has a dry mucous membrane and a fruity odor on his breath. His vital signs show a heart rate of 120 bpm and blood pressure of 90/60 mm Hg.$sc82$,
  $qu82$What is the most likely diagnosis?$qu82$,
  $op82${"kind":"ethics","stepLevel":"step2","blueprintSystem":"social-sciences","blueprintTopic":"child-abuse-red-flags","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788705383676","examNumber":9204,"slotIndex":33,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:36:53.777Z"},"options":["Diabetic ketoacidosis","Hyperglycemic hyperosmolar state","Hypoglycemia","Acute pancreatitis"]}$op82$,
  $ky82$Diabetic ketoacidosis$ky82$,
  $ex82$The patient's presentation of hyperglycemia, confusion, dry mucous membranes, and fruity breath odor indicates Diabetic Ketoacidosis (DKA). This condition is characterized by metabolic acidosis, ketone production, and dehydration. Hyperglycemic hyperosmolar state typically presents with higher glucose levels and more profound dehydration without significant acidosis. Hypoglycemia would present with altered mental status but with low blood glucose levels. Acute pancreatitis would present with abdominal pain and elevated lipase levels.

Clinical reasoning: Assess the patient's symptoms and lab results, analyze the signs of dehydration and metabolic derangement, and integrate these findings to conclude that the most likely diagnosis is DKA.

Why other options are incorrect:
• Hyperglycemic hyperosmolar state: Fails due to the absence of significant acidosis and the lower glucose level compared to typical presentations.
• Hypoglycemia: Fails because the blood glucose level is elevated, not low.
• Acute pancreatitis: Fails as it would present with abdominal pain and not the classic signs of DKA.$ex82$,
  1,
  $dm82$reproductive-endocrine$dm82$,
  $tp82$diabetes-dka-management$tp82$,
  NULL,
  NULL,
  NULL,
  $ch82$d3c38991e6db727ecf843fb5257f08c1735952414fece47cbdfb6c6036834cab$ch82$,
  true,
  $ref82$[{"url":"https://medlineplus.gov/ency/article/000320.htm","label":"MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced."}]$ref82$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id83$cmtpwso8900471y6hbmzfru0z$id83$,
  $fx83$re-rate|re-tag$fx83$,
  $sc83$A 62-year-old woman presents to the emergency department with chest pain that began 30 minutes ago while she was gardening. She has a history of hypertension and hyperlipidemia, and she takes lisinopril and atorvastatin. On examination, her blood pressure is 150/90 mm Hg, heart rate is 98 beats per minute, and she has a mild diaphoresis. An ECG shows ST-segment elevation in leads II, III, and aVF.$sc83$,
  $qu83$What is the most likely diagnosis?$qu83$,
  $op83${"options":["Acute inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism (a clot in a pulmonary artery)"],"distractorRationale":{"Unstable angina":"Fails because unstable angina does not present with ST-segment elevation on ECG.","Aortic dissection":"Fails due to the absence of classic symptoms like tearing pain and unequal blood pressures.","Pulmonary embolism (a clot in a pulmonary artery)":"Fails as it typically presents with respiratory distress and does not show ST-segment elevation."},"clinicalReasoning":"The patient exhibits classic signs of myocardial infarction, including chest pain and diaphoresis, alongside ECG changes indicative of inferior STEMI. The presence of risk factors further supports this diagnosis, while the other options do not align with the clinical findings.","kind":"vignette","stepLevel":"step2","blueprintSystem":"msk-skin","blueprintTopic":"rheumatology-autoimmune","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788704702892","examNumber":9202,"slotIndex":30,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-09-06T14:29:17.578Z"}}$op83$,
  $ky83$Acute inferior ST-elevation myocardial infarction$ky83$,
  $ex83$The patient's presentation is consistent with an acute inferior STEMI, as evidenced by the ST-segment elevation in the inferior leads (II, III, and aVF) on the ECG. This indicates myocardial ischemia due to occlusion of the right coronary artery in a patient with risk factors such as hypertension and hyperlipidemia. Unstable angina would not show ST-segment elevation, making it less likely. Aortic dissection typically presents with severe, tearing chest pain and may have different vital signs, while pulmonary embolism usually presents with pleuritic chest pain and respiratory symptoms. Thus, the correct diagnosis is acute inferior STEMI.

Clinical reasoning: The patient exhibits classic signs of myocardial infarction, including chest pain and diaphoresis, alongside ECG changes indicative of inferior STEMI. The presence of risk factors further supports this diagnosis, while the other options do not align with the clinical findings.

Why other options are incorrect:
• Unstable angina: Fails because unstable angina does not present with ST-segment elevation on ECG.
• Aortic dissection: Fails due to the absence of classic symptoms like tearing pain and unequal blood pressures.
• Pulmonary embolism (a clot in a pulmonary artery): Fails as it typically presents with respiratory distress and does not show ST-segment elevation.$ex83$,
  1,
  $dm83$cardiovascular$dm83$,
  $tp83$acs-management$tp83$,
  NULL,
  NULL,
  NULL,
  $ch83$c5a13224b3956fc85b533d8029b449c85ddea5c52a0259c7fd63b144ac2c1f84$ch83$,
  true,
  $ref83$[{"label":"ACCF/AHA Guidelines for the Management of Patients with ST-Elevation Myocardial Infarction"}]$ref83$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id84$cmtpwsnu400421y6h36zbpv6i$id84$,
  $fx84$re-rate|re-tag$fx84$,
  $sc84$A 50-year-old man presents to the emergency department with severe abdominal pain, nausea, and vomiting. His vital signs show a blood pressure of 100/60 mm Hg and a heart rate of 110 bpm. Laboratory tests reveal an elevated white blood cell count of 18,000/mm³ and elevated lipase levels at 500 U/L.$sc84$,
  $qu84$What is the most likely diagnosis?$qu84$,
  $op84${"options":["Acute pancreatitis","Cholecystitis (inflammation of the gallbladder)","Gastroenteritis","Bowel obstruction"],"distractorRationale":{"Cholecystitis (inflammation of the gallbladder)":"This is incorrect as cholecystitis would show tenderness in the right upper quadrant.","Gastroenteritis":"This option fails because the patient does not present with diarrhea or fever typical of gastroenteritis.","Bowel obstruction":"This is incorrect as the patient lacks signs of distension or changes in bowel habits."},"clinicalReasoning":"Evaluate the patient's symptoms and laboratory findings to differentiate between potential abdominal diagnoses. Analyze the clinical context to arrive at the most likely diagnosis based on elevated lipase and clinical presentation.","kind":"vignette","stepLevel":"step2","blueprintSystem":"msk-skin","blueprintTopic":"burns-management","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788704702892","examNumber":9202,"slotIndex":25,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:25:28.801Z"}}$op84$,
  $ky84$Acute pancreatitis$ky84$,
  $ex84$The most likely diagnosis is acute pancreatitis, supported by the patient's severe abdominal pain, elevated lipase, and leukocytosis. Cholecystitis (inflammation of the gallbladder) could present similarly but would typically show gallbladder tenderness on examination. Gastroenteritis would present with diarrhea and is less likely given the severe pain. Bowel obstruction would typically present with abdominal distension and changes in bowel habits. Understanding the key laboratory findings and clinical presentation is essential for diagnosing acute pancreatitis.

Clinical reasoning: Evaluate the patient's symptoms and laboratory findings to differentiate between potential abdominal diagnoses. Analyze the clinical context to arrive at the most likely diagnosis based on elevated lipase and clinical presentation.

Why other options are incorrect:
• Cholecystitis (inflammation of the gallbladder): This is incorrect as cholecystitis would show tenderness in the right upper quadrant.
• Gastroenteritis: This option fails because the patient does not present with diarrhea or fever typical of gastroenteritis.
• Bowel obstruction: This is incorrect as the patient lacks signs of distension or changes in bowel habits.$ex84$,
  1,
  $dm84$gastrointestinal$dm84$,
  $tp84$pancreatitis-hepatitis$tp84$,
  NULL,
  NULL,
  NULL,
  $ch84$4a153dee5b9a00a591348bf01662b015235428389fb7567321c0a5d25dd5fe6f$ch84$,
  true,
  $ref84$[{"url":"https://medlineplus.gov/pancreatitis.html","label":"MedlinePlus. Pancreatitis."}]$ref84$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id85$cmtpwsmza003r1y6hbfr6o1gh$id85$,
  $fx85$re-rate|re-tag|rewrite$fx85$,
  $sc85$A 45-year-old woman who smokes has severe left shoulder pain and dyspnea. Blood pressure is 150/90 mm Hg, and the heart rate is 110 beats per minute. Breath sounds are decreased at the left base, percussion there is dull, and tactile fremitus is absent. The chest radiograph shows blunting of the left costophrenic angle and no visceral pleural line.$sc85$,
  $qu85$What is the most likely diagnosis?$qu85$,
  $op85${"options":["A layer of pleural fluid on the left","Air collected in the pleural space","A clot lodged in a pulmonary artery","Injury of the left ventricular muscle"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"pneumonia-workup","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788704702892","examNumber":9202,"slotIndex":14,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:28:26.641Z"}}$op85$,
  $ky85$A layer of pleural fluid on the left$ky85$,
  $ex85$Decreased breath sounds, dull percussion, absent tactile fremitus, and blunting of the costophrenic angle are a pleural effusion. Shoulder pain can be referred from the diaphragmatic pleura. Pneumothorax is hyper-resonant and would show a visceral pleural line, which this film does not. Pulmonary embolism can cause tachycardia and dyspnea, but it does not dull the base or blunt the costophrenic angle. Infarction of the myocardium likewise does not produce this percussion and radiograph pattern.$ex85$,
  1,
  $dm85$respiratory-renal$dm85$,
  $tp85$pneumonia-workup$tp85$,
  $su85$https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion$su85$,
  $sl85$Pleural Effusion - Merck Manual Professional Edition — dullness, decreased breath sounds, and blunting of the costophrenic angle$sl85$,
  $sq85$Physical examination may reveal decreased breath sounds on the side of the effusion, dullness to percussion, and absent tactile fremitus.$sq85$,
  $ch85$304f4a355ea01e994b3dddfea9a5a58ae8ea97b8b31010c74dee2de926f665b6$ch85$,
  true,
  $ref85$[{"label":"Pleural Effusion - Merck Manual Professional Edition — dullness, decreased breath sounds, and blunting of the costophrenic angle","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$ref85$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id86$cmr89vboy01371yr99hpuageu$id86$,
  $fx86$re-rate|re-tag$fx86$,
  $sc86$A 72-year-old woman presents to the emergency department with acute shortness of breath and a cough productive of pink, frothy sputum. She has a history of hypertension and coronary artery disease. On examination, her blood pressure is 90/60 mm Hg, heart rate is 120 beats per minute, respiratory rate is 28 breaths per minute, and oxygen saturation is 85% on room air. Chest X-ray shows bilateral pulmonary edema.$sc86$,
  $qu86$What is the most likely diagnosis?$qu86$,
  $op86${"options":["Congestive heart failure","Pulmonary embolism","Pneumonia","Chronic obstructive pulmonary disease exacerbation"],"distractorRationale":{"Pulmonary embolism":"This option fails because the presence of bilateral pulmonary edema and pink, frothy sputum is more indicative of CHF than a PE, which typically presents with sudden onset dyspnea and pleuritic chest pain without the frothy sputum.","Pneumonia":"This option is incorrect as pneumonia usually presents with fever, chills, and localized lung findings, rather than the classic signs of CHF such as pink, frothy sputum.","Chronic obstructive pulmonary disease exacerbation":"This distractor is misleading because while COPD can cause dyspnea, it does not typically present with pink, frothy sputum or bilateral pulmonary edema."},"clinicalReasoning":"The patient's acute respiratory distress, hypoxia, and characteristic sputum suggest CHF, particularly given her history of hypertension and coronary artery disease. The clinical signs and imaging findings support this diagnosis over the other options.","keyTakeaways":["When faced with acute shortness of breath and pink, frothy sputum, think congestive heart failure first."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"dementia-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783284603991","qcScore":8.2,"slotIndex":21,"stepLevel":"step2","examNumber":9213,"generatedAt":"2026-07-05T20:53:16.587Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$op86$,
  $ky86$Congestive heart failure$ky86$,
  $ex86$## Why this answer is correct
The most likely diagnosis is congestive heart failure due to classic symptoms and imaging findings.
• **Acute shortness of breath** and **pink, frothy sputum** are hallmark signs of CHF.
• Bilateral **pulmonary edema** on chest X-ray supports fluid overload typical in heart failure.
• The patient's **history of hypertension** and coronary artery disease increases her risk for CHF.
**In practice:** On the unit, recognizing CHF early can lead to prompt management, including diuretics and oxygen therapy, which are critical in improving patient outcomes.
## Why the other options are wrong



**Pulmonary embolism**
• Trap: Students may think of pulmonary embolism due to acute respiratory distress.
• Why it fails here: However, pulmonary embolism typically presents with unilateral findings and does not usually cause pink, frothy sputum or bilateral pulmonary edema.
• Remember: This highlights the importance of differentiating between acute respiratory conditions based on clinical presentation.

**Pneumonia**
• Trap: Pneumonia might be considered due to the cough and sputum production.
• Why it fails here: Yet, pneumonia usually presents with fever, localized lung findings, and often does not cause pink, frothy sputum or significant bilateral edema.
• Remember: Understanding the typical presentations of pneumonia helps in ruling it out in this scenario.

**Chronic obstructive pulmonary disease exacerbation**
• Trap: Students might confuse COPD exacerbation with CHF due to respiratory distress.
• Why it fails here: COPD exacerbations are characterized by increased sputum production and wheezing, not typically pink, frothy sputum or bilateral pulmonary edema.
• Remember: Recognizing the distinct features of COPD exacerbation is essential for accurate diagnosis.
## Key takeaway
**When faced with acute shortness of breath and pink, frothy sputum, think congestive heart failure first.**

**Memory hook:** Remember: **Pink frothy = CHF**; it’s a classic sign!$ex86$,
  1,
  $dm86$cardiovascular$dm86$,
  $tp86$chf-management$tp86$,
  NULL,
  NULL,
  NULL,
  $ch86$a483680507906c97b220a6f4d9f87911c67364819d865a2e9b2ae476cb9e75b1$ch86$,
  true,
  $ref86$[{"label":"Hurst's The Heart, 14th Edition"}]$ref86$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id87$cmr86o9dt00741yr94txeje4g$id87$,
  $fx87$re-tag$fx87$,
  $sc87$A 45-year-old woman with asthma comes to the emergency department because of 2 days of worsening shortness of breath. On arrival, respirations are 28/min, oxygen saturation is 88% on room air, and peak flow is 250 L/min (personal best 450 L/min). She receives oxygen titrated to a saturation of 94%, three treatments of nebulized albuterol with ipratropium, and oral prednisone. One hour later she is alert but still working hard to breathe, with diffuse wheezing and a peak flow of 180 L/min.$sc87$,
  $qu87$Which of the following is the most appropriate next step in management?$qu87$,
  $op87$["Administer a second dose of oral prednisone", "Increase oxygen to maintain a saturation of 100%", "Discharge home with an oral corticosteroid taper", "Administer intravenous magnesium sulfate"]$op87$,
  $ky87$Administer intravenous magnesium sulfate$ky87$,
  $ex87$Correct answer: D. Administer intravenous magnesium sulfate. Despite oxygen, three nebulized albuterol-ipratropium treatments and oral prednisone, her peak flow has fallen from 250 to 180 L/min (40% of her 450 L/min best) and she is still working hard to breathe; IV magnesium is recommended for severe exacerbations that do not respond to initial treatment. Why the other options are wrong: A. She received prednisone 1 hour ago; a second dose adds nothing, and corticosteroids take hours to act. B. Oxygen should be titrated to an upper limit of about 95%; aiming for 100% risks hyperoxia without benefit. C. Discharge is unsafe with a falling peak flow and ongoing respiratory distress.$ex87$,
  2,
  $dm87$respiratory-renal$dm87$,
  $tp87$copd-asthma-exacerbation$tp87$,
  NULL,
  NULL,
  NULL,
  $ch87$2d36bbb1133a93a9cc081b43074ff668698549aeb6b6f799fc9e15f613da2e36$ch87$,
  true,
  $ref87$[{"label":"National Asthma Education and Prevention Program (NAEPP) Guidelines"}]$ref87$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id88$cmrqhnyxf00561ypxczqf70wj$id88$,
  $fx88$re-rate|re-tag$fx88$,
  $sc88$A 25-year-old male presents to the emergency department with severe abdominal pain and vomiting. He reports a history of binge drinking over the weekend. On examination, he has a tender abdomen, and his vital signs show BP 100/60 mmHg and HR 120 bpm. His serum lipase is elevated at 800 U/L.$sc88$,
  $qu88$What is the most likely diagnosis?$qu88$,
  $op88${"options":["Acute pancreatitis","Cholecystitis","Gastritis","Appendicitis (inflammation of the appendix)"],"distractorRationale":{"Cholecystitis":"Could present similarly but would typically show gallbladder tenderness and elevated WBC.","Gastritis":"Less likely given the severity of abdominal pain and elevated lipase.","Appendicitis (inflammation of the appendix)":"Unlikely given the patient's symptoms and elevated lipase."},"clinicalReasoning":"Assess the patient's symptoms and lab results. Analyze the potential causes of elevated lipase and abdominal pain. Integrate knowledge of acute pancreatitis to confirm the diagnosis.","keyTakeaways":["When a patient presents with severe abdominal pain, elevated lipase, and a history of binge drinking, think acute pancreatitis first."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"personality-disorders","blueprintSystem":"psychiatry","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784386139864","qcScore":8.1,"slotIndex":28,"stepLevel":"step2","examNumber":9203,"generatedAt":"2026-07-18T14:49:48.820Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$op88$,
  $ky88$Acute pancreatitis$ky88$,
  $ex88$## Why this answer is correct
The most likely diagnosis is acute pancreatitis due to binge drinking and elevated lipase levels.
• **Binge drinking** is a common cause of acute pancreatitis.
• Elevated **lipase** levels (greater than 3 times the normal) are indicative of pancreatitis.
• Severe **abdominal pain** and vomiting are classic symptoms of this condition.
**In practice:** On the unit, recognizing acute pancreatitis early can lead to timely management, including hydration and pain control, which are crucial for patient recovery.
## Why the other options are wrong



**Cholecystitis**
• Trap: Students may confuse cholecystitis with pancreatitis due to overlapping symptoms.
• Why it fails here: Cholecystitis typically presents with **gallbladder tenderness** and may show an elevated white blood cell count, which are not noted in this case.
• Remember: Understanding the specific signs and lab findings associated with each condition is essential for accurate diagnosis.

**Gastritis**
• Trap: Some may think gastritis could cause abdominal pain and elevated lipase.
• Why it fails here: Gastritis usually presents with milder symptoms and does not typically cause such high levels of lipase; the severity of pain here suggests a more serious condition.
• Remember: Differentiating between gastrointestinal conditions based on symptom severity and lab results is critical.

**Appendicitis (inflammation of the appendix)**
• Trap: Students might consider appendicitis due to abdominal pain.
• Why it fails here: Appendicitis (inflammation of the appendix) usually presents with localized pain in the right lower quadrant and does not cause elevated lipase levels, making it less likely in this scenario.
• Remember: Recognizing the typical presentation of appendicitis helps in ruling it out when lab results suggest pancreatitis.
## Key takeaway
**When a patient presents with severe abdominal pain, elevated lipase, and a history of binge drinking, think acute pancreatitis first.**

**Memory hook:** Remember: **Binge drinking + Elevated lipase = Pancreatitis**.$ex88$,
  1,
  $dm88$gastrointestinal$dm88$,
  $tp88$pancreatitis-hepatitis$tp88$,
  NULL,
  NULL,
  NULL,
  $ch88$a0cf04a92daee3a76ead925cb864d7921dd7f48c80a38573af257c355d403927$ch88$,
  true,
  $ref88$[{"url":"https://medlineplus.gov/pancreatitis.html","label":"MedlinePlus. Pancreatitis."}]$ref88$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id89$cmr891bwq00xf1yr9h77x9i2g$id89$,
  $fx89$re-tag$fx89$,
  $sc89$A 30-year-old man has had fever, cough, and pleuritic chest pain for 3 days. He has no cancer, heart failure, liver disease, kidney disease, or stroke. He is alert. Temperature is 38.6°C, heart rate 96 beats per minute, respiratory rate 22 breaths per minute, and blood pressure 122/74 mm Hg. Oxygen saturation is 96% on room air. Blood urea nitrogen is 12 mg/dL, sodium is 138 mEq/L, and glucose is 98 mg/dL. Chest radiography shows a single right-lower-lobe opacity and no pleural effusion.$sc89$,
  $qu89$What is the most appropriate initial management?$qu89$,
  $op89${"options":["Start intravenous antibiotics","Obtain a sputum culture","Perform a thoracentesis","Prescribe oral antibiotics"],"distractorRationale":{"Obtain a sputum culture":"While important, this should not delay antibiotic treatment in a patient with significant symptoms.","Perform a thoracentesis":"This is not the immediate step unless there is clear evidence of a pleural effusion requiring drainage.","Prescribe oral antibiotics":"Oral antibiotics are inadequate for a patient showing signs of moderate to severe pneumonia."},"clinicalReasoning":"Assess the patient's clinical presentation, noting the hypoxia and chest X-ray findings. Analyze the severity of the symptoms and the need for immediate antibiotic therapy. Integrate this information to conclude that starting intravenous antibiotics is the best initial management.","keyTakeaways":["When managing pneumonia with hypoxia, prioritize starting intravenous antibiotics immediately."],"kind":"vignette","taskCategory":"interpretation","blueprintTopic":"thyroid-storm","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783283214476","qcScore":8.1,"slotIndex":33,"stepLevel":"step2","examNumber":9211,"generatedAt":"2026-07-05T20:28:05.845Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"interpretation"}$op89$,
  $ky89$Prescribe oral antibiotics$ky89$,
  $ex89$The Pneumonia Severity Index is the tool the 2019 ATS/IDSA guideline prefers over CURB-65 when deciding on hospitalization. His only points are his age (30). Risk class I–II is treated out of the hospital. He is not hypoxic, hypotensive, or confused, so oral antibiotics are appropriate and intravenous therapy, a culture-first delay, and thoracentesis are not.$ex89$,
  2,
  $dm89$respiratory-renal$dm89$,
  $tp89$pneumonia-workup$tp89$,
  NULL,
  NULL,
  NULL,
  $ch89$ede6b55be0c4dc72ad1ba449c0b7c0dd10479eee85999b6d92d40e0b5898bf42$ch89$,
  true,
  $ref89$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/","label":"ATS/IDSA 2019 guideline (PMC6812437). Use the Pneumonia Severity Index in preference to CURB-65 to decide whether an adult with community-acquired pneumonia needs hospitalization."}]$ref89$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id90$cmrpw0p34004v1ylubp6ief43$id90$,
  $fx90$re-tag|rewrite$fx90$,
  $sc90$A 72-year-old man with chronic obstructive pulmonary disease has worsening dyspnea. Sputum volume is unchanged, and the sputum remains white. Temperature is 37.0 C. He has already received supplemental oxygen and a nebulized bronchodilator. Respiratory rate is 24 breaths per minute, and oxygen saturation is 92% on 2 L per minute. Arterial pH is 7.36 and PaCO2 is 48 mm Hg. He is alert and is not using accessory muscles. The chest film shows hyperinflation and no infiltrate.$sc90$,
  $qu90$What is the most appropriate next step in management?$qu90$,
  $op90${"options":["Begin a course of systemic corticosteroid therapy","Begin noninvasive positive-pressure ventilation","Begin antibiotic therapy directed at airway bacteria","Obtain a computed tomography scan of the chest"],"taskCategory":"interpretation","blueprintTopic":"copd-asthma-exacerbation","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784349927082","qcScore":7.9,"slotIndex":13,"stepLevel":"step2","examNumber":9203,"generatedAt":"2026-07-18T04:46:10.420Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op90$,
  $ky90$Begin a course of systemic corticosteroid therapy$ky90$,
  $ex90$He is dyspneic and hypoxemic from a COPD exacerbation that is more than mild, and systemic glucocorticoids are started for that exacerbation. Sputum is not more purulent or more copious, and he is not being ventilated, so the cardinal indications for antibiotics are absent. Noninvasive ventilation is used for a severe exacerbation with pH below 7.30, and his pH is 7.36 without worsening distress after oxygen and a bronchodilator. Chest computed tomography is not the next step when the film already shows hyperinflation without an infiltrate and the picture is an uncomplicated exacerbation.$ex90$,
  2,
  $dm90$respiratory-renal$dm90$,
  $tp90$copd-asthma-exacerbation$tp90$,
  $su90$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation$su90$,
  $sl90$Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition — systemic glucocorticoids are started for exacerbations that are not mild; antibiotics require purulent sputum or ventilatory support$sl90$,
  $sq90$Systemic glucocorticoids should be initiated immediately for all but mild exacerbations.$sq90$,
  $ch90$d40477c4280c74fba1c1f467198ff2b3b56a41cb884b29a56331b2d8ce0db20c$ch90$,
  true,
  $ref90$[{"label":"Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition — systemic glucocorticoids are started for exacerbations that are not mild; antibiotics require purulent sputum or ventilatory support","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation"}]$ref90$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id91$cmrvm5yz4001ijw049n92tmhu$id91$,
  $fx91$re-rate|re-tag$fx91$,
  $sc91$A 28-year-old woman presents to the emergency department with acute onset of unilateral vision loss in her right eye over the past 24 hours. She reports significant pain with eye movement and has a history of multiple sclerosis. On examination, her right eye shows a relative afferent pupillary defect, and visual acuity is reduced to 20/200.$sc91$,
  $qu91$What is the most likely diagnosis?$qu91$,
  $op91${"options":["Optic neuritis","Retinal detachment","Glaucoma","Cataract"],"distractorRationale":{"Retinal detachment":"Retinal detachment typically presents with a curtain-like shadow in the visual field and is not associated with pain, which is a key symptom in this case. (Understanding the specific symptoms of retinal detachment helps differentiate it from optic neuritis.)","Glaucoma":"Glaucoma usually presents with gradual vision loss and increased intraocular pressure, not the acute pain and RAPD seen in this patient. (Recognizing the gradual nature of glaucoma's symptoms is essential for accurate diagnosis.)","Cataract":"Cataracts lead to gradual vision loss without acute pain or RAPD, which are present in this case. (Differentiating cataracts from conditions like optic neuritis is vital for appropriate management.)"},"clinicalReasoning":"The most likely diagnosis is optic neuritis due to its characteristic symptoms and association with multiple sclerosis. **Acute vision loss** **Pain with eye movement**","keyTakeaways":["When faced with acute unilateral vision loss and pain with eye movement, think optic neuritis, especially in patients with a history of multiple sclerosis."]}$op91$,
  $ky91$Optic neuritis$ky91$,
  $ex91$## Why this answer is correct
The most likely diagnosis is optic neuritis due to its characteristic symptoms and association with multiple sclerosis.
• **Acute vision loss**
• **Pain with eye movement**
• **Relative afferent pupillary defect (RAPD)**
• **Association with multiple sclerosis**
**In practice:** On the unit, recognizing optic neuritis is crucial as it may indicate a flare of multiple sclerosis and requires prompt management to preserve vision.
## Why the other options are wrong



**Retinal detachment**
• Trap: Students may confuse retinal detachment with optic neuritis due to the vision loss.
• Why it fails here: Retinal detachment typically presents with a curtain-like shadow in the visual field and is not associated with pain, which is a key symptom in this case.
• Remember: Understanding the specific symptoms of retinal detachment helps differentiate it from optic neuritis.

**Glaucoma**
• Trap: Some may think glaucoma is a cause of acute vision loss due to its impact on vision.
• Why it fails here: Glaucoma usually presents with gradual vision loss and increased intraocular pressure, not the acute pain and RAPD seen in this patient.
• Remember: Recognizing the gradual nature of glaucoma's symptoms is essential for accurate diagnosis.

**Cataract**
• Trap: Cataracts may be considered because they can cause vision impairment.
• Why it fails here: Cataracts lead to gradual vision loss without acute pain or RAPD, which are present in this case.
• Remember: Differentiating cataracts from conditions like optic neuritis is vital for appropriate management.
## Key takeaway
**When faced with acute unilateral vision loss and pain with eye movement, think optic neuritis, especially in patients with a history of multiple sclerosis.**

**Memory hook:** Remember: **Optic neuritis** = **O**ne eye, **P**ainful movement, **M**ultiple sclerosis.$ex91$,
  1,
  $dm91$behavioral-nervous$dm91$,
  $tp91$ms-pathology$tp91$,
  NULL,
  NULL,
  NULL,
  $ch91$9eb57792807260d61c68f846e06d79a9d4e9ec4dbd44fefe907dbc66dca1a8c3$ch91$,
  true,
  $ref91$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12708295/","label":"Front Neurol. 2025. Functional MRI in optic neuritis: insights into cortical modulation and possible recovery mechanisms. Optic neuritis (ON) is an inflammatory, demyelinating optic neuropathy commonly associated with multiple sclerosis."}]$ref91$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id92$cmrrvfikq002i1yl8n8oculdv$id92$,
  $fx92$re-rate|re-tag|rewrite$fx92$,
  $sc92$A 72-year-old woman comes to the emergency department with acute shortness of breath and chest tightness. She has chronic obstructive pulmonary disease treated with a long-acting beta-agonist and an inhaled corticosteroid. Respiratory rate is 28 breaths per minute, oxygen saturation is 88 percent on room air, and she has bilateral wheezing. She is afebrile, and her sputum volume and color are unchanged. A chest radiograph shows hyperinflation and no focal infiltrate.$sc92$,
  $qu92$What is the most appropriate initial treatment?$qu92$,
  $op92${"kind":"sequential","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784469914630","qcScore":8.1,"slotIndex":9,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-19T14:06:40.472Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Nebulized bronchodilator, glucocorticoid, and oxygen","Chest computed tomography before any drug treatment","Immediate endotracheal intubation and ventilation","Antibiotics with no bronchodilator or glucocorticoid"],"taskCategory":"professionalism"}$op92$,
  $ky92$Nebulized bronchodilator, glucocorticoid, and oxygen$ky92$,
  $ex92$She is hypoxemic and wheezing from an acute exacerbation, so the initial treatment is a bronchodilator, a systemic glucocorticoid, and supplemental oxygen. Those measures relieve airflow obstruction and correct the low saturation while she is still breathing on her own. Computed tomography delays treatment and adds nothing once the radiograph has excluded a focal infiltrate. Intubation is not the first step in a patient who is protecting her airway and has not failed medical therapy. Antibiotics are not the opening treatment when there is no fever, no change in sputum, and no infiltrate.$ex92$,
  2,
  $dm92$respiratory-renal$dm92$,
  $tp92$copd-asthma-exacerbation$tp92$,
  $su92$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd$su92$,
  $sl92$Merck Manual Professional, Chronic Obstructive Pulmonary Disease: exacerbation treatment is bronchodilators, glucocorticoids, and oxygen when needed$sl92$,
  $sq92$Treatment is with bronchodilators, glucocorticoids, and, when necessary, oxygen and antibiotics.$sq92$,
  $ch92$0050344b757ae3e57e133574cd012677555f55b53fdb9f8c3f11e59d230a5bf3$ch92$,
  true,
  $ref92$[{"label":"Merck Manual Professional, Chronic Obstructive Pulmonary Disease: exacerbation treatment is bronchodilators, glucocorticoids, and oxygen when needed","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$ref92$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id93$cmrsfgn5700511yny1hwg9imh$id93$,
  $fx93$re-rate|re-tag|rewrite$fx93$,
  $sc93$A 28-year-old woman with type 1 diabetes is brought to the emergency department with confusion, nausea, and abdominal pain. She missed her insulin doses for two days. Blood glucose is 450 mg/dL and serum bicarbonate is 12 mEq/L. Her breath smells fruity.$sc93$,
  $qu93$What is the most likely diagnosis?$qu93$,
  $op93${"options":["Diabetic ketoacidosis after missed insulin doses","Hyperosmolar hyperglycemic state without ketones","Alcoholic ketoacidosis without hyperglycemia","Gallstone pancreatitis as the cause of acidosis"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"diabetes-dka-management","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784503592677","qcScore":8.1,"slotIndex":22,"stepLevel":"step2","examNumber":9203,"generatedAt":"2026-07-19T23:27:13.695Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$op93$,
  $ky93$Diabetic ketoacidosis after missed insulin doses$ky93$,
  $ex93$Missed insulin in type 1 diabetes, marked hyperglycemia, a low bicarbonate, and fruity breath from acetone are the picture of diabetic ketoacidosis. A hyperosmolar hyperglycemic state produces severe hyperglycemia with little ketoacidosis, which does not fit a fruity breath and a bicarbonate of 12 mEq/L. Alcoholic ketoacidosis causes ketoacidosis without significant hyperglycemia, and this glucose is 450 mg/dL. Gallstone pancreatitis can cause abdominal pain, but it does not tie together missed insulin, this degree of hyperglycemia, and acetone on the breath.$ex93$,
  1,
  $dm93$reproductive-endocrine$dm93$,
  $tp93$diabetes-dka-management$tp93$,
  $su93$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus$su93$,
  $sl93$Merck Manual Professional, Acute Complications of Diabetes: DKA is hyperglycemia, hyperketonemia, and metabolic acidosis, often with fruity breath$sl93$,
  $sq93$Diabetic ketoacidosis (DKA) is an acute metabolic complication of diabetes characterized by hyperglycemia, hyperketonemia, and metabolic acidosis.$sq93$,
  $ch93$39d2db4d9a12d836685523cb0f18b56be1dd211dfb4441a5ee091baf46f826e5$ch93$,
  true,
  $ref93$[{"label":"Merck Manual Professional, Acute Complications of Diabetes: DKA is hyperglycemia, hyperketonemia, and metabolic acidosis, often with fruity breath","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus"}]$ref93$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id94$cmru6qyus002ml1046skcnxf2$id94$,
  $fx94$re-rate|re-tag$fx94$,
  $sc94$A 58-year-old woman presents to the emergency department with sudden onset dyspnea and pleuritic chest pain that began earlier today. She has a history of smoking and reports right leg swelling. On examination, her heart rate is 112 beats per minute, respiratory rate is 24 breaths per minute, and oxygen saturation is 91% on room air. Lung auscultation reveals clear breath sounds bilaterally.$sc94$,
  $qu94$What is the most likely diagnosis?$qu94$,
  $op94${"options":["Pulmonary embolism","Community-acquired pneumonia","Spontaneous pneumothorax","Acute asthma exacerbation"],"distractorRationale":{"Community-acquired pneumonia":"However, pneumonia typically presents with cough, fever, and abnormal lung sounds, none of which are present in this case. (This highlights the importance of differentiating between respiratory conditions based on specific symptoms.)","Spontaneous pneumothorax":"Spontaneous pneumothorax usually presents with decreased breath sounds on the affected side, which is not observed here. (Understanding the physical exam findings is crucial in distinguishing between these acute conditions.)","Acute asthma exacerbation":"Acute asthma exacerbation typically shows wheezing and a prior history of asthma, which this patient lacks. (Recognizing the absence of a wheezing history helps clarify the diagnosis.)"},"clinicalReasoning":"The most likely diagnosis is pulmonary embolism due to classic presenting symptoms. **Sudden onset dyspnea** and **pleuritic chest pain** are hallmark signs of pulmonary embolism. The patient's **unilateral leg swelling** suggests possible deep vein thrombosis, a common precursor to PE.","keyTakeaways":["When faced with sudden dyspnea and pleuritic chest pain, consider pulmonary embolism first, especially with risk factors like leg swelling."]}$op94$,
  $ky94$Pulmonary embolism$ky94$,
  $ex94$## Why this answer is correct
The most likely diagnosis is pulmonary embolism due to classic presenting symptoms.
• **Sudden onset dyspnea** and **pleuritic chest pain** are hallmark signs of pulmonary embolism.
• The patient's **unilateral leg swelling** suggests possible deep vein thrombosis, a common precursor to PE.
• Tachycardia and **hypoxemia** (low oxygen saturation) further support the diagnosis of a thromboembolic event.
**In practice:** In practice, recognizing these symptoms can lead to timely diagnosis and treatment of pulmonary embolism, which is critical for patient survival.
## Why the other options are wrong



**Community-acquired pneumonia**
• Trap: Students may think this is a possibility due to the patient's respiratory symptoms.
• Why it fails here: However, pneumonia typically presents with cough, fever, and abnormal lung sounds, none of which are present in this case.
• Remember: This highlights the importance of differentiating between respiratory conditions based on specific symptoms.

**Spontaneous pneumothorax**
• Trap: Some may confuse this with PE due to the acute chest pain.
• Why it fails here: Spontaneous pneumothorax usually presents with decreased breath sounds on the affected side, which is not observed here.
• Remember: Understanding the physical exam findings is crucial in distinguishing between these acute conditions.

**Acute asthma exacerbation**
• Trap: Students might consider this option because of the patient's respiratory distress.
• Why it fails here: Acute asthma exacerbation typically shows wheezing and a prior history of asthma, which this patient lacks.
• Remember: Recognizing the absence of a wheezing history helps clarify the diagnosis.
## Key takeaway
**When faced with sudden dyspnea and pleuritic chest pain, consider pulmonary embolism first, especially with risk factors like leg swelling.**

**Memory hook:** Remember: **DVT** (Deep Vein Thrombosis) can lead to **PE** (Pulmonary Embolism) — think of the leg swelling as a clue!$ex94$,
  1,
  $dm94$respiratory-renal$dm94$,
  $tp94$pe-workup$tp94$,
  NULL,
  NULL,
  NULL,
  $ch94$0cf9c1e1528e126778d5bae5d45921fd73fe20e2401eb7fffc6d914b5d9f0054$ch94$,
  true,
  $ref94$[{"url":"https://medlineplus.gov/pulmonaryembolism.html","label":"MedlinePlus. Pulmonary embolism."}]$ref94$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id95$b9x08eef0a62b9d0649adcfea20$id95$,
  $fx95$re-rate|re-tag|rewrite$fx95$,
  $sc95$A 70-year-old man has a TSH of 80 mIU/L, a very low free T4, hypothermia, and a puffy, slowed appearance. He has a new wrist fracture. A standard morphine dose is given for the pain, and his respiratory rate falls to 6 breaths per minute.$sc95$,
  $qu95$Why was that standard opioid dose the wrong dose?$qu95$,
  $op95${"options":["Low thyroid hormone slows morphine clearance and deepens sedation","Hypothermia by itself slows morphine clearance enough to stop breathing","A high TSH speeds hepatic morphine clearance and raises the safe dose","A rate of six breaths per minute is his usual myxedema baseline","New fracture pain still requires his full usual morphine dose anyway"],"blueprintTopic":"thyroid-disorders","blueprintSystem":"reproductive-endocrine"}$op95$,
  $ky95$Low thyroid hormone slows morphine clearance and deepens sedation$ky95$,
  $ex95$Severe hypothyroidism slows drug metabolism, so an ordinary morphine dose lasts longer and depresses ventilation, which is what the fall in respiratory rate shows. Hypothermia is part of the same hypothyroid state, but it is not a separate reason to ignore the low thyroid hormone. A high TSH does not speed morphine clearance or make a larger dose safer. The rate of 6 appeared after the dose, so it is not his baseline. Fracture pain does not erase the need to reduce the sedative dose when thyroid hormone is this low.$ex95$,
  2,
  $dm95$reproductive-endocrine$dm95$,
  $tp95$thyroid-disorders$tp95$,
  $su95$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism$su95$,
  $sl95$Merck Manual Professional, Hypothyroidism: medications must be given cautiously because they are metabolized more slowly$sl95$,
  $sq95$Finally, all medications should be given cautiously because they are metabolized more slowly than in healthy people.$sq95$,
  $ch95$4bd2429523e4fbdfd2eeb66559fe19ee39255e64bc622ef7b83fca47acaab88b$ch95$,
  true,
  $ref95$[{"label":"Merck Manual Professional, Hypothyroidism: medications must be given cautiously because they are metabolized more slowly","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism"}]$ref95$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id96$cmru6qzlx0031l1044rxkc2pn$id96$,
  $fx96$re-rate|re-tag|rewrite$fx96$,
  $sc96$A 16-year-old girl requests contraceptive counseling. She is sexually active with a boyfriend her own age, understands the benefits and risks of the methods discussed, and asks that her parents not be told. Her mother, waiting outside, demands to know the reason for the visit and which method will be used. The clinic provides confidential contraceptive care for adolescents in her situation. The history and examination show no coercion, assault, or other abuse.$sc96$,
  $qu96$What is the most appropriate response to the mother?$qu96$,
  $op96${"options":["Provide contraception and keep the visit from her mother","Tell her mother the visit details because she is a minor","Delay contraception until a parent signs a consent form","Report consensual sexual activity to protective services","Require a family meeting before any contraceptive care"],"blueprintTopic":"ethics-professionalism","blueprintSystem":"social-sciences"}$op96$,
  $ky96$Provide contraception and keep the visit from her mother$ky96$,
  $ex96$She has asked that this reproductive visit stay private, she understands the decision, and nothing in the visit suggests abuse, so contraception can be provided without telling her mother. Sharing the history with a parent is not automatic when the patient objects and the care is confidential reproductive care. Parental consent is not a prerequisite for that care in this clinic setting. Consensual activity with a peer, without signs of abuse, is not a mandated report to protective services. A family meeting she did not agree to would disclose the visit she asked to keep private.$ex96$,
  1,
  $dm96$social-sciences$dm96$,
  $tp96$ethics-professionalism$tp96$,
  $su96$https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa$su96$,
  $sl96$Merck Manual Professional, Confidentiality and HIPAA: communication should follow patient preferences, and information is not shared with family when the patient objects$sl96$,
  $sq96$Health care professionals should take reasonable steps to ensure that their communications with the patient are confidential and in accord with patient preferences.$sq96$,
  $ch96$6e7c525e05277f9e22149200283e4630712aeeb28e0e7dd1f68ed05a27fbf712$ch96$,
  true,
  $ref96$[{"label":"Merck Manual Professional, Confidentiality and HIPAA: communication should follow patient preferences, and information is not shared with family when the patient objects","url":"https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa"}]$ref96$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id97$cmrsfd35x00321ynyq5erb2w2$id97$,
  $fx97$re-rate|re-tag$fx97$,
  $sc97$A 28-year-old woman with a history of type 1 diabetes presents to the emergency department with confusion and excessive thirst after experiencing significant stress in her personal life. On examination, she is disoriented, and her vital signs reveal tachycardia. Laboratory tests show a blood glucose level of 450 mg/dL, arterial blood gas analysis indicates a pH of 7.25, and bicarbonate is measured at 15 mEq/L.$sc97$,
  $qu97$What is the most likely diagnosis?$qu97$,
  $op97${"options":["Diabetic ketoacidosis","Hyperglycemic hyperosmolar state","Lactic acidosis","Acute renal failure"],"distractorRationale":{"Hyperglycemic hyperosmolar state":"HHS typically presents with even higher blood glucose levels (often >600 mg/dL) and a higher arterial pH, indicating less acidosis, which does not match this patient's findings. (Understanding the differences in presentation between DKA and HHS is key to accurate diagnosis.)","Lactic acidosis":"Lactic acidosis usually occurs with normal or low blood glucose levels and is not characterized by the significant hyperglycemia seen here. (Recognizing the specific metabolic derangements helps differentiate between types of acidosis.)","Acute renal failure":"Acute renal failure does not typically present with such high blood glucose levels or the specific metabolic acidosis seen in this case. (Understanding the clinical context of diabetes and its complications is essential for accurate diagnosis.)"},"clinicalReasoning":"The patient's presentation is consistent with diabetic ketoacidosis (DKA). **Diabetic ketoacidosis** (DKA) is characterized by **hyperglycemia**, **metabolic acidosis**, and often occurs in individuals with type 1 diabetes. The **low pH** (7.25) and **bicarbonate** level (15 mEq/L) indicate significant **acidosis**.","keyTakeaways":["When faced with a patient with diabetes presenting with confusion and metabolic acidosis, think DKA first."],"taskCategory":"health-maintenance","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784503327650","qcScore":7.9,"slotIndex":32,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-19T23:22:48.925Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op97$,
  $ky97$Diabetic ketoacidosis$ky97$,
  $ex97$## Why this answer is correct
The patient's presentation is consistent with diabetic ketoacidosis (DKA).
• **Diabetic ketoacidosis** (DKA) is characterized by **hyperglycemia**, **metabolic acidosis**, and often occurs in individuals with type 1 diabetes.
• The **low pH** (7.25) and **bicarbonate** level (15 mEq/L) indicate significant **acidosis**.
• Stress can lead to **inadequate insulin therapy**, triggering DKA.
**In practice:** On the unit, recognizing DKA is crucial for prompt treatment, as it can lead to severe complications if not addressed quickly. Immediate insulin therapy and fluid resuscitation are essential.
## Why the other options are wrong



**Hyperglycemic hyperosmolar state**
• Trap: Students may confuse HHS with DKA due to both conditions involving high blood glucose levels.
• Why it fails here: HHS typically presents with even higher blood glucose levels (often >600 mg/dL) and a higher arterial pH, indicating less acidosis, which does not match this patient's findings.
• Remember: Understanding the differences in presentation between DKA and HHS is key to accurate diagnosis.

**Lactic acidosis**
• Trap: Some may think that any metabolic acidosis indicates lactic acidosis, especially in a stressed patient.
• Why it fails here: Lactic acidosis usually occurs with normal or low blood glucose levels and is not characterized by the significant hyperglycemia seen here.
• Remember: Recognizing the specific metabolic derangements helps differentiate between types of acidosis.

**Acute renal failure**
• Trap: Students might consider acute renal failure due to the patient's confusion and metabolic derangements.
• Why it fails here: Acute renal failure does not typically present with such high blood glucose levels or the specific metabolic acidosis seen in this case.
• Remember: Understanding the clinical context of diabetes and its complications is essential for accurate diagnosis.
## Key takeaway
**When faced with a patient with diabetes presenting with confusion and metabolic acidosis, think DKA first.**

**Memory hook:** Remember: DKA has the '3 H's' - **High glucose**, **High ketones**, and **Hydrogen ions** (acidosis).$ex97$,
  1,
  $dm97$reproductive-endocrine$dm97$,
  $tp97$diabetes-dka-management$tp97$,
  NULL,
  NULL,
  NULL,
  $ch97$5c0ade56060eea9d814cdfe655f3e096d752fefefc9d168487bb57d74834abad$ch97$,
  true,
  $ref97$[{"url":"https://medlineplus.gov/ency/article/000320.htm","label":"MedlinePlus Medical Encyclopedia. Diabetic ketoacidosis: high blood sugar is corrected with insulin, and fluids are replaced."}]$ref97$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id98$cmrpw5xp0006w1ylu2a8o5cb4$id98$,
  $fx98$re-rate|re-tag$fx98$,
  $sc98$A 45-year-old woman presents to the emergency department with severe abdominal pain that started suddenly two hours ago. She has a history of hypertension and is currently on lisinopril. On examination, her blood pressure is 90/60 mm Hg, heart rate is 120 bpm, and she appears diaphoretic. Laboratory tests reveal elevated white blood cell count and elevated serum amylase. A CT scan shows a 3 cm gallstone in the common bile duct. She is afebrile and not jaundiced.$sc98$,
  $qu98$What is the most appropriate next step in management?$qu98$,
  $op98${"kind":"sequential","stepLevel":"step2","blueprintSystem":"surgery-acute-care","blueprintTopic":"trauma-atls","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784350171186","qcScore":8.1,"slotIndex":7,"stepLevel":"step2","examNumber":9204,"generatedAt":"2026-07-18T04:50:43.451Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Endoscopic retrograde cholangiopancreatography","Laparoscopic cholecystectomy","Intravenous fluids and observation","Magnetic resonance cholangiopancreatography (MRCP)"],"taskCategory":"professionalism"}$op98$,
  $ky98$Intravenous fluids and observation$ky98$,
  $ex98$Sudden pain, hypotension, a high amylase, and a common-bile-duct stone is gallstone pancreatitis. She has no fever and no jaundice, so she does not have cholangitis. Early ERCP is reserved for cholangitis or obstruction that does not clear. The immediate treatment is intravenous fluid. Cholecystectomy is later, and MRCP is unnecessary because CT already shows the stone.$ex98$,
  3,
  $dm98$gastrointestinal$dm98$,
  $tp98$pancreatitis-hepatitis$tp98$,
  NULL,
  NULL,
  NULL,
  $ch98$6fc3b3c325b1651076a810efe6e15cec5a31893d88ce182f73758feadb82fd8c$ch98$,
  true,
  $ref98$[{"label":"American College of Gastroenterology guidelines on the management of acute cholangitis"}]$ref98$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id99$cmr86y8pw009j1yr9awm48k2v$id99$,
  $fx99$re-tag|rewrite$fx99$,
  $sc99$A 45-year-old woman comes to the emergency department with severe right-upper-quadrant pain and vomiting. She has known gallstones and a month of intermittent pain in the same location. Temperature is 38.3 C, and the right upper quadrant is tender. The leukocyte count is 15,000/mm3. Serum bilirubin is 0.9 mg/dL, alkaline phosphatase is slightly above the reference range, and lipase is within the reference range.$sc99$,
  $qu99$Which of the following is the most likely diagnosis?$qu99$,
  $op99${"options":["Acute calculous cholecystitis from gallstones","Choledocholithiasis with common-duct obstruction","Ascending cholangitis from an infected duct","Acute biliary pancreatitis from a passed stone"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"appendicitis-cholecystitis","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783279676470","qcScore":8.2,"slotIndex":0,"stepLevel":"step2","examNumber":9204,"generatedAt":"2026-07-05T19:29:13.040Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$op99$,
  $ky99$Acute calculous cholecystitis from gallstones$ky99$,
  $ex99$Fever, right-upper-quadrant tenderness, leukocytosis, and known gallstones, with a normal bilirubin and a lipase in the reference range, are acute calculous cholecystitis. A common-duct stone would be expected to raise the bilirubin or alkaline phosphatase more than this slight change. Ascending cholangitis needs that biliary obstruction picture together with systemic infection, which the normal bilirubin does not support. Pancreatitis is not the diagnosis when the lipase is within the reference range.$ex99$,
  2,
  $dm99$gastrointestinal$dm99$,
  $tp99$appendicitis-cholecystitis$tp99$,
  $su99$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis$su99$,
  $sl99$Merck Manual Professional, Acute Cholecystitis: right-upper-quadrant pain, tenderness, and fever, with normal or slightly elevated liver tests when uncomplicated$sl99$,
  $sq99$In uncomplicated acute cholecystitis, liver tests are normal or only slightly elevated.$sq99$,
  $ch99$16e33fb44f8fe30273621850f80d5b8dcfea1ea000bf1bf2e10aeab2d3515cf9$ch99$,
  true,
  $ref99$[{"label":"Merck Manual Professional, Acute Cholecystitis: right-upper-quadrant pain, tenderness, and fever, with normal or slightly elevated liver tests when uncomplicated","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis"}]$ref99$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id100$cmrtprxyy000l1yqc3pmh6wc0$id100$,
  $fx100$re-rate|re-tag$fx100$,
  $sc100$A 72-year-old woman presents to the emergency department with acute shortness of breath and chest pain that started 2 hours ago. She has a history of hypertension and hyperlipidemia, and she is currently on lisinopril and atorvastatin. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she has bilateral crackles on auscultation. An ECG shows ST-segment elevations in leads II, III, and aVF.$sc100$,
  $qu100$What is the most likely diagnosis?$qu100$,
  $op100${"options":["Acute coronary syndrome (STEMI)","Pulmonary embolism","Aortic dissection","Congestive heart failure exacerbation"],"distractorRationale":{"Pulmonary embolism":"This condition typically presents with sudden dyspnea and pleuritic chest pain, often with hypoxemia, but would not show ST-segment elevation on ECG.","Aortic dissection":"While it can cause chest pain and hypotension, the pain is usually described as 'tearing' and the ECG findings differ from STEMI.","Congestive heart failure exacerbation":"This could explain the crackles and dyspnea, but it does not account for the acute chest pain and ST-segment elevation."},"clinicalReasoning":"Assess the patient's symptoms and vital signs, noting the hypotension and tachycardia. Analyze the ECG findings for ST-segment elevation, which is indicative of myocardial ischemia. Integrate this information with the patient's risk factors to conclude that the most likely diagnosis is STEMI.","keyTakeaways":["When you see ST-segment elevation with chest pain, think STEMI first."],"kind":"vignette","stepLevel":"step2","blueprintSystem":"pediatrics","blueprintTopic":"developmental-milestones","physicianTask":"interpretation","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9500,"slotIndex":38,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-20T21:03:06.151Z"}}$op100$,
  $ky100$Acute coronary syndrome (STEMI)$ky100$,
  $ex100$## Why this answer is correct
The patient's symptoms and ECG findings confirm an acute coronary syndrome (STEMI).
• **ST-segment elevation** in leads II, III, and aVF indicates myocardial ischemia.
• The presence of **chest pain** and **shortness of breath** aligns with a myocardial infarction.
• Hypotension and tachycardia suggest **hemodynamic instability**, common in STEMI.
**In practice:** On the unit, recognizing STEMI early is crucial for timely intervention, which can significantly improve patient outcomes.
## Why the other options are wrong



**Pulmonary embolism**
• Trap: Students may confuse the acute onset of dyspnea and chest pain with a pulmonary embolism.
• Why it fails here: While pulmonary embolism can cause similar symptoms, it typically does not present with ST-segment elevation on ECG.
• Remember: Understanding the specific ECG changes is key to differentiating between these conditions.

**Aortic dissection**
• Trap: Some may think of aortic dissection due to the acute chest pain and hypotension.
• Why it fails here: Aortic dissection usually presents with a tearing chest pain and may show different ECG changes, such as ST-segment depression or no changes at all.
• Remember: Recognizing the characteristic pain and associated findings helps in accurate diagnosis.

**Congestive heart failure exacerbation**
• Trap: Students might consider CHF exacerbation due to the crackles and shortness of breath.
• Why it fails here: CHF exacerbation does not typically present with acute chest pain or ST-segment elevation, which are critical indicators of STEMI.
• Remember: Differentiating between respiratory symptoms and cardiac events is essential in acute care.
## Key takeaway
**When you see ST-segment elevation with chest pain, think STEMI first.**

**Memory hook:** Remember the '3 E's' of STEMI: Elevation, Emergency, and Early intervention.$ex100$,
  1,
  $dm100$cardiovascular$dm100$,
  $tp100$acs-management$tp100$,
  NULL,
  NULL,
  NULL,
  $ch100$c2019f51be51c66050182b57bac8c6f3c98a2f7cb87ab04ca9a35fdba94eb528$ch100$,
  true,
  $ref100$[{"url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs","label":"Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery"}]$ref100$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id101$cmr4kimu100t61yde1z9b1447$id101$,
  $fx101$re-rate|re-tag|rewrite$fx101$,
  $sc101$A 12-year-old girl has had fever to 39.5 C, sore throat, and pain with swallowing for two days. The tonsils are swollen and covered with white exudate, and the anterior cervical nodes are tender. A rapid antigen test for group A streptococcus is positive. She has no penicillin allergy.$sc101$,
  $qu101$Which antibiotic is most appropriate?$qu101$,
  $op101${"options":["Oral amoxicillin for group A streptococcus","Oral azithromycin for group A streptococcus","Intramuscular ceftriaxone for this pharyngitis","Oral clindamycin for group A streptococcus"],"kind":"vignette","taskCategory":"communication","blueprintTopic":"pediatric-infections","blueprintSystem":"human-development","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783060393212","qcScore":8,"slotIndex":21,"stepLevel":"step2","examNumber":9210,"generatedAt":"2026-07-03T06:34:10.377Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$op101$,
  $ky101$Oral amoxicillin for group A streptococcus$ky101$,
  $ex101$A positive rapid antigen test confirms streptococcal pharyngitis, and amoxicillin is an effective oral treatment when the patient is not allergic to penicillin. A macrolide is reserved for penicillin allergy, which she does not have. Ceftriaxone is not the usual oral or single-dose choice for uncomplicated pharyngitis in a child who can take oral medicine. Clindamycin is an alternative antibiotic, not the first choice in a patient who can take penicillin or amoxicillin.$ex101$,
  1,
  $dm101$human-development$dm101$,
  $tp101$pediatric-infections$tp101$,
  $su101$https://www.merckmanuals.com/professional/ear-nose-and-throat-disorders/oral-and-pharyngeal-disorders/tonsillopharyngitis$su101$,
  $sl101$Merck Manual Professional, Tonsillopharyngitis: penicillin is preferred for group A streptococcus and amoxicillin is also effective; macrolides are for penicillin allergy$sl101$,
  $sq101$Amoxicillin is also effective and more palatable if a liquid preparation is required.$sq101$,
  $ch101$fc493dc5aff61065d095845f91b520b8afc92ead7282c2ff452a1ae2c5140c05$ch101$,
  true,
  $ref101$[{"label":"Merck Manual Professional, Tonsillopharyngitis: penicillin is preferred for group A streptococcus and amoxicillin is also effective; macrolides are for penicillin allergy","url":"https://www.merckmanuals.com/professional/ear-nose-and-throat-disorders/oral-and-pharyngeal-disorders/tonsillopharyngitis"}]$ref101$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id102$cmrrvvkei00bk1yl8x6g19c6q$id102$,
  $fx102$re-rate|re-tag|rewrite$fx102$,
  $sc102$A 60-year-old man with congestive heart failure comes in with worsening shortness of breath and leg edema over three days. Blood pressure is 130/85 mm Hg, heart rate is 95 beats per minute, and oxygen saturation is 94 percent on room air. He is speaking in full sentences. A B-type natriuretic peptide level is 800 pg/mL. The lungs have crackles, and both legs have pitting edema. He has no chest pain.$sc102$,
  $qu102$What is the most appropriate initial medication?$qu102$,
  $op102${"kind":"ethics","stepLevel":"step2","blueprintSystem":"cardiovascular","blueprintTopic":"chf-management","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784470686389","qcScore":8.2,"slotIndex":11,"stepLevel":"step2","examNumber":9206,"generatedAt":"2026-07-19T14:18:38.992Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Intravenous loop diuretic for the lung congestion","A new beta-blocker during active volume overload","An intravenous bolus of isotonic saline solution now","Urgent coronary angiography for this congestion"],"taskCategory":"communication"}$op102$,
  $ky102$Intravenous loop diuretic for the lung congestion$ky102$,
  $ex102$Acute heart failure with crackles, edema, and an elevated natriuretic peptide is treated first with a loop diuretic to remove the fluid overload. A beta-blocker is part of therapy after the congestion has stabilized, not a drug to start while he is still volume overloaded. Saline adds volume to a patient who is already fluid overloaded. Coronary angiography is not the initial step when there is no chest pain or other feature of an acute coronary syndrome.$ex102$,
  1,
  $dm102$cardiovascular$dm102$,
  $tp102$chf-management$tp102$,
  $su102$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure$su102$,
  $sl102$Merck Manual Professional, Acute Heart Failure: the mainstay of initial drug treatment is a loop diuretic for congestion$sl102$,
  $sq102$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.$sq102$,
  $ch102$f7ed8dcb06eaba170fdd57fde222f127d7749021330f07d22cd65bf5ffaf3d0b$ch102$,
  true,
  $ref102$[{"label":"Merck Manual Professional, Acute Heart Failure: the mainstay of initial drug treatment is a loop diuretic for congestion","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$ref102$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id103$c22aa238-8361-41c5-8a93-56e285e0281c$id103$,
  $fx103$re-rate|rewrite$fx103$,
  $sc103$A 27-year-old man admitted with diabetic ketoacidosis is improving, is conversing, and has not asked anyone to contact an outside agency. Glucose and the anion gap are correcting on the protocol. A visitor says immigration authorities should be called because the patient is undocumented and should not be using the emergency department. There is no criminal threat and no public-health condition that the law requires you to report.$sc103$,
  $qu103$What is the appropriate next step?$qu103$,
  $op103${"options":["Continue treatment and do not report immigration status","Report immigration status after the emergency resolves","Discharge him so the hospital can end this admission","Have security hold him until an immigration officer comes","Record immigration status as a discharge diagnosis"],"blueprintSystem":"social-sciences","taskCategory":"professionalism","blueprintTopic":"ethics-professionalism","kind":"vignette"}$op103$,
  $ky103$Continue treatment and do not report immigration status$ky103$,
  $ex103$Immigration status is not a clinical finding and not one of the conditions this encounter requires you to report, so treatment of the ketoacidosis continues and the status is not disclosed. Ending the emergency does not create a duty to notify immigration. Discharging him to stop the admission would withhold care that is still underway. Holding him for an outside officer uses the hospital to detain him for a purpose unrelated to his medical care. Putting the status on the diagnosis list places nonclinical information into the record for others to pass on.$ex103$,
  2,
  $dm103$social-sciences$dm103$,
  $tp103$ethics-professionalism$tp103$,
  $su103$https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa$su103$,
  $sl103$Merck Manual Professional, Confidentiality and HIPAA: protected health information is not used for purposes unrelated to health care$sl103$,
  $sq103$In most situations, PHI may not be used for purposes unrelated to health care.$sq103$,
  $ch103$5fe238ba0f4452ba798159408bfb7f066c073c8a7c1ca72aedd7015b40780163$ch103$,
  true,
  $ref103$[{"label":"Merck Manual Professional, Confidentiality and HIPAA: protected health information is not used for purposes unrelated to health care","url":"https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa"}]$ref103$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id104$6c25a232-447a-4566-8b3a-2654778b3064$id104$,
  $fx104$re-rate|rewrite$fx104$,
  $sc104$You held a 17-year-old varsity athlete out of practice after the history and examination. He asks you not to tell the coach the diagnosis and agrees that the coach may hear that he is restricted from practice. The condition is not one the law requires you to report, and no other player is endangered by it. The coach, who is on the phone, says the team physician owes the program the diagnosis.$sc104$,
  $qu104$What is the appropriate next step?$qu104$,
  $op104${"options":["Tell the coach about the restriction but not the diagnosis","Give the coach the diagnosis because team doctors report to him","Clear the athlete so that no health detail must be discussed","Let the athletic director choose what the coach may hear","Leave a voicemail for the coach that includes the diagnosis"],"blueprintSystem":"social-sciences","taskCategory":"communication","blueprintTopic":"ethics-professionalism","kind":"vignette"}$op104$,
  $ky104$Tell the coach about the restriction but not the diagnosis$ky104$,
  $ex104$The athlete has set the limit of disclosure, and there is no legal report and no danger to another person that would override it, so the coach may hear the participation restriction and not the diagnosis. Employment by the team does not make the coach the owner of the history. Clearing him would trade a medical restriction for an easier phone call. An athletic director cannot authorize a release the athlete refused. A voicemail that states the diagnosis breaks the limit he set.$ex104$,
  2,
  $dm104$social-sciences$dm104$,
  $tp104$ethics-professionalism$tp104$,
  $su104$https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa$su104$,
  $sl104$Merck Manual Professional, Confidentiality and HIPAA: disclosures should follow the patient's preferences$sl104$,
  $sq104$Health care professionals should take reasonable steps to ensure that their communications with the patient are confidential and in accord with patient preferences.$sq104$,
  $ch104$958f4f85ad619ed4ec1af8f08b6e381f9fd911979fe0c4448a7ee0d3386a1120$ch104$,
  true,
  $ref104$[{"label":"Merck Manual Professional, Confidentiality and HIPAA: disclosures should follow the patient's preferences","url":"https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/confidentiality-and-hipaa"}]$ref104$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id105$3d0ec122-3947-49d7-ada9-6c1923d3a434$id105$,
  $fx105$re-rate|rewrite$fx105$,
  $sc105$At 6:10 a.m. a 29-year-old night-float resident smells of alcohol. He misses two straightforward intravenous attempts and laughs when the nurse asks whether he is fit to hand off. He is assigned to place a central line after sign-out on a patient whose access has just failed. He says he had one drink at dinner and that replacing him will make the team late. The line has not been started. The attending is not in the hospital.$sc105$,
  $qu105$What is the appropriate next step?$qu105$,
  $op105${"options":["Remove him from duty now and notify the supervising physician","Supervise the central line and report the alcohol after the shift","Cover his patients quietly and address the alcohol if it recurs","Wait to act until the attending physician arrives this afternoon","Send him to the call room and leave the episode off the incident log"],"blueprintSystem":"social-sciences","taskCategory":"professionalism","blueprintTopic":"ethics-professionalism","kind":"vignette"}$op105$,
  $ky105$Remove him from duty now and notify the supervising physician$ky105$,
  $ex105$The odor of alcohol, the missed attempts, and an impending invasive procedure show impairment during the shift, so he comes off clinical duty now and the supervising physician is notified. Standing beside him for the line leaves an impaired operator on the procedure. Quiet coverage hides the episode and leaves the next patient exposed. Waiting until afternoon delays removal from a shift that is unsafe now. Resting off the record does not stop him from returning to patient care and does not alert anyone responsible for the service.$ex105$,
  2,
  $dm105$social-sciences$dm105$,
  $tp105$ethics-professionalism$tp105$,
  $su105$https://pmc.ncbi.nlm.nih.gov/articles/PMC10332520/$su105$,
  $sl105$NIH PMC, impaired-provider scenario: recognize impairment, remove the colleague from clinical care, and notify the supervising contact$sl105$,
  $sq105$This simulation scenario is intended to provide an opportunity for learners to recognize an impaired colleague in a clinical setting, remove them from the clinical care environment, and notify the appropriate contacts, such as a Program Director, Department Chair, or nursing supervisor.$sq105$,
  $ch105$532feba5c6031a1f74ceaae9debbdc94e074d7e7cfbdb62aea088063ce849627$ch105$,
  true,
  $ref105$[{"label":"NIH PMC, impaired-provider scenario: recognize impairment, remove the colleague from clinical care, and notify the supervising contact","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10332520/"}]$ref105$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id106$cmr4hnmsb007q1yde54yl7pcg$id106$,
  $fx106$re-rate|rewrite$fx106$,
  $sc106$Police bring a 5-year-old girl to the emergency department after she was found alone, in pajamas, wandering outside at 2 a.m. Her mother arrives and says she was asleep and did not know the child had left. The mother cannot explain bruises on the child's arms and legs and says the child has become withdrawn. The child is fearful and avoids eye contact. Temperature is 37 C, pulse is 90 beats per minute, and blood pressure is 100/60 mm Hg. The physician is not certain whether abuse or neglect has occurred.$sc106$,
  $qu106$Which action is most appropriate?$qu106$,
  $op106${"options":["Report suspected neglect to child protective services now","Wait for imaging to prove abuse before making any report","Ask the mother for an explanation and report if she has none","Arrange psychiatry follow-up and send the child home with her"],"blueprintTopic":"child-abuse-red-flags","blueprintSystem":"social-sciences"}$op106$,
  $ky106$Report suspected neglect to child protective services now$ky106$,
  $ex106$A young child found outside alone at night, with unexplained bruises and a new fearful, withdrawn manner, is suspected neglect and possible physical abuse, and that suspicion is reported now. Proof by imaging is the role of the investigation, not a requirement before the report. The mother has already been unable to explain the bruises, and an acceptable story is not the threshold for reporting. A psychiatry referral does not replace the protective report or make it safe to send her home with the same caregiver.$ex106$,
  1,
  $dm106$social-sciences$dm106$,
  $tp106$child-abuse-red-flags$tp106$,
  $su106$https://www.merckmanuals.com/professional/pediatrics/child-maltreatment/overview-of-child-maltreatment$su106$,
  $sl106$Merck Manual Professional, Child Maltreatment: physicians must report suspected child abuse or neglect$sl106$,
  $sq106$In the United States, physicians and other professionals in contact with children (eg, nurses, physician assistants, nurse practitioners, social workers, psychologists, teachers, day care workers, police) are mandated reporters who are required by law in every state to report incidents of suspected child abuse or neglect (see Mandatory Reporters of Child Abuse and Neglect ).$sq106$,
  $ch106$4dcc709f86911cdd80ebcdc5c189dffba7ad40050ed763e4c4454556b3b1b704$ch106$,
  true,
  $ref106$[{"label":"Merck Manual Professional, Child Maltreatment: physicians must report suspected child abuse or neglect","url":"https://www.merckmanuals.com/professional/pediatrics/child-maltreatment/overview-of-child-maltreatment"}]$ref106$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id107$cmtpwsmwi003q1y6hihvhe7uq$id107$,
  $fx107$re-rate|rewrite$fx107$,
  $sc107$A 45-year-old woman is in the emergency department after a hot-oil burn covering 30 percent of her total body surface area. She is in severe pain. Heart rate is 120 beats per minute and blood pressure is 90/60 mm Hg. Serum sodium is 130 mEq/L and potassium is 4.5 mEq/L. She has no drug allergies.$sc107$,
  $qu107$What is the most appropriate immediate next step?$qu107$,
  $op107${"options":["Intravenous lactated Ringer solution for volume resuscitation","Intravenous morphine as the first intervention for burn pain","Oral ibuprofen for inflammatory pain from the burn wound","Oral acetaminophen for comfort while the blood pressure is low"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"msk-skin","blueprintTopic":"burns-management","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788704702892","examNumber":9202,"slotIndex":13,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:28:21.934Z"}}$op107$,
  $ky107$Intravenous lactated Ringer solution for volume resuscitation$ky107$,
  $ex107$A burn larger than 20 percent of body surface area with tachycardia and hypotension requires immediate intravenous fluid resuscitation, and lactated Ringer solution is the fluid used for that replacement. Morphine is appropriate for severe burn pain, but it does not restore the intravascular volume she is losing and is not the first intervention while she is hypotensive. Ibuprofen does not resuscitate burn shock and can worsen kidney perfusion and bleeding risk in this setting. Acetaminophen does not treat the volume loss that is driving the low blood pressure.$ex107$,
  2,
  $dm107$msk-skin$dm107$,
  $tp107$burns-management$tp107$,
  $su107$https://www.merckmanuals.com/professional/injuries-poisoning/burns/burns$su107$,
  $sl107$Merck Manual Professional, Burns: large burns require fluid resuscitation with lactated Ringer solution$sl107$,
  $sq107$Patients with large burns ( > 20% TBSA) require fluid resuscitation.$sq107$,
  $ch107$2632fd5b0594649af782e4e9f3529c970be18b733ba06be8bb3b9191293d7fbf$ch107$,
  true,
  $ref107$[{"label":"Merck Manual Professional, Burns: large burns require fluid resuscitation with lactated Ringer solution","url":"https://www.merckmanuals.com/professional/injuries-poisoning/burns/burns"}]$ref107$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id108$cmrqhwley00751ypxrrhpi8mz$id108$,
  $fx108$re-rate|rewrite$fx108$,
  $sc108$A 28-year-old woman comes to the emergency department after two weeks of auditory hallucinations and paranoia. She believes people are watching her and has withdrawn from friends and family. She is disheveled. Blood pressure is 120/80 mm Hg and heart rate is 78 beats per minute. A urine drug screen is positive for cannabinoids and negative for other substances. She has no prior diagnosis of a psychotic disorder and no witnessed seizures.$sc108$,
  $qu108$What is the most appropriate next step?$qu108$,
  $op108${"options":["Urgent psychiatric evaluation of the acute psychotic symptoms","Outpatient substance counseling with no psychiatric assessment","Neurology consultation to investigate a seizure disorder","A housing referral as the response to the hallucinations"],"taskCategory":"interpretation","blueprintTopic":"schizophrenia-psychosis","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784386528278","qcScore":7.9,"slotIndex":19,"stepLevel":"step2","examNumber":9204,"generatedAt":"2026-07-18T14:58:28.012Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op108$,
  $ky108$Urgent psychiatric evaluation of the acute psychotic symptoms$ky108$,
  $ex108$Two weeks of hallucinations and paranoia require prompt psychiatric evaluation and supervision, whether or not cannabis contributed. That interval is far shorter than the six months of symptoms required before schizophrenia is diagnosed, so the evaluation should not be framed as a schizophrenia diagnosis. Substance counseling addresses the cannabinoid result but does not replace assessment of active psychosis. There are no seizures to justify a neurology consultation as the next step. Housing help does not evaluate or treat the hallucinations.$ex108$,
  2,
  $dm108$behavioral-nervous$dm108$,
  $tp108$schizophrenia-psychosis$tp108$,
  $su108$https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/brief-psychotic-disorder$su108$,
  $sl108$Merck Manual Professional, Brief Psychotic Disorder: psychotic symptoms for days to a month may need supervision and short-term antipsychotic treatment$sl108$,
  $sq108$Treatment of brief psychotic disorder is similar to treatment of an acute exacerbation of schizophrenia ; supervision and short-term treatment with antipsychotics may be required.$sq108$,
  $ch108$97b38b07fd4a231cce7a2aae8501e2b140d4d4bb8b2abe534132a903e9d088c8$ch108$,
  true,
  $ref108$[{"label":"Merck Manual Professional, Brief Psychotic Disorder: psychotic symptoms for days to a month may need supervision and short-term antipsychotic treatment","url":"https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/brief-psychotic-disorder"}]$ref108$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id109$cmr891cek00xk1yr9y99slybu$id109$,
  $fx109$rewrite$fx109$,
  $sc109$A 72-year-old woman has sudden right-sided weakness and difficulty speaking. Her husband last saw her well 80 minutes ago, and the deficits have been present since he found her. She has hypertension and hyperlipidemia, takes no anticoagulant, and has had no recent surgery, trauma, or bleeding. Blood pressure is 180/100 mm Hg. There is a right facial droop and right arm and leg weakness. Computed tomography of the head shows no hemorrhage.$sc109$,
  $qu109$What is the most appropriate next step in management?$qu109$,
  $op109${"options":["Intravenous alteplase for this acute ischemic stroke","Aspirin therapy and no intravenous reperfusion drug","Brain magnetic resonance imaging before stroke treatment","Warfarin anticoagulation for the new neurologic deficit"],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"stroke-management","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783283214476","qcScore":8.2,"slotIndex":38,"stepLevel":"step2","examNumber":9211,"generatedAt":"2026-07-05T20:31:17.238Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$op109$,
  $ky109$Intravenous alteplase for this acute ischemic stroke$ky109$,
  $ex109$Disabling deficits, a last-known-well time 80 minutes ago, no hemorrhage on computed tomography, and a blood pressure below the exclusion threshold make her a candidate for intravenous alteplase. Aspirin is used when reperfusion therapy is not given, and it is not a substitute inside the treatment window. Magnetic resonance imaging would delay a therapy that depends on time from when she was last known to be well. Warfarin is not the acute treatment of an ischemic stroke, and nothing in the history establishes a cardioembolic source that would change the immediate choice.$ex109$,
  3,
  $dm109$behavioral-nervous$dm109$,
  $tp109$stroke-management$tp109$,
  $su109$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su109$,
  $sl109$Merck Manual Professional, Ischemic Stroke: alteplase may be given within 3 hours of last known well when contraindications, including hemorrhage on CT, are absent$sl109$,
  $sq109$Recombinant tPA ( alteplase ) can be used for patients with acute ischemic stroke up to 3 hours after symptom onset if they have no contraindications to tPA (see table Exclusion Criteria for Use of Tissue Plasminogen Activator in Stroke ).$sq109$,
  $ch109$a7b26987b28058ab90eb1fbfa7c19bb0e5e409299ec3fee52d5a44dc4f84ef21$ch109$,
  true,
  $ref109$[{"label":"Merck Manual Professional, Ischemic Stroke: alteplase may be given within 3 hours of last known well when contraindications, including hemorrhage on CT, are absent","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref109$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id110$cmqxdeoer00a01ymachr6ljlg$id110$,
  $fx110$re-rate|rewrite$fx110$,
  $sc110$A 58-year-old man with type 2 diabetes comes to the emergency department with confusion and fruity breath. He has had polyuria and polydipsia for a week. Blood glucose is 450 mg/dL, serum bicarbonate is 15 mEq/L, anion gap is 18 mEq/L, and venous pH is 7.22. Serum potassium is 4.4 mEq/L. An infusion of isotonic saline is already running.$sc110$,
  $qu110$Which medication is most appropriate now?$qu110$,
  $op110${"options":["Continuous intravenous infusion of regular insulin","Intravenous sodium bicarbonate infusion for acidosis","Oral metformin for this degree of hyperglycemia","Subcutaneous glargine and no intravenous insulin"],"kind":"lab_interpretation","taskCategory":"pharmacotherapy","blueprintTopic":"diabetes-dka-management","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782625221692","qcScore":8.1,"slotIndex":5,"stepLevel":"step2","examNumber":1692,"generatedAt":"2026-06-28T05:42:05.722Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"pharmacotherapy","labTable":[{"test":"Blood Glucose","value":"450 mg/dL"},{"test":"Serum Bicarbonate","value":"15 mEq/L"},{"test":"Anion Gap","value":"18 mEq/L"}]}$op110$,
  $ky110$Continuous intravenous infusion of regular insulin$ky110$,
  $ex110$With volume replacement already underway and potassium at 4.4 mEq/L, the drug that stops ketogenesis and lowers the glucose is a continuous intravenous infusion of regular insulin. Bicarbonate is not routine at a pH of 7.22. Metformin does not treat ketoacidosis and is unsafe in this acute illness. A single subcutaneous dose of long-acting insulin, without an intravenous infusion, does not provide the continuous insulin this acidosis requires.$ex110$,
  1,
  $dm110$reproductive-endocrine$dm110$,
  $tp110$diabetes-dka-management$tp110$,
  $su110$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus$su110$,
  $sl110$Merck Manual Professional, Diabetic Ketoacidosis: intravenous regular insulin is given when potassium is at least 3.3 mEq/L, after volume replacement$sl110$,
  $sq110$Then, whether or not a bolus has been given, adults should be administered a continuous IV infusion of regular insulin 0.1 unit/kg/hour in 0.9% saline solution.$sq110$,
  $ch110$6b551e8b547f29be852877ff32d4c037054d986f73fe76779ad187720a4da9a8$ch110$,
  true,
  $ref110$[{"label":"Merck Manual Professional, Diabetic Ketoacidosis: intravenous regular insulin is given when potassium is at least 3.3 mEq/L, after volume replacement","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus"}]$ref110$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id111$cmqxdesnf00b71ymakh47svrd$id111$,
  $fx111$rewrite$fx111$,
  $sc111$A 40-year-old woman has had heavy menstrual bleeding with large clots for two weeks and feels fatigued. She is pale. Blood pressure is 90/60 mm Hg and heart rate is 110 beats per minute. On pelvic examination the uterus is enlarged and has an irregular, nodular contour.$sc111$,
  $qu111$Which of the following is the most likely diagnosis?$qu111$,
  $op111${"options":["Uterine leiomyomas causing the heavy bleeding","Adenomyosis causing the heavy menstrual bleeding","Endometrial carcinoma causing the heavy bleeding","A coagulation disorder causing the heavy bleeding"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"menstrual-disorders","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782625221692","qcScore":8.4,"slotIndex":52,"stepLevel":"step2","examNumber":1692,"generatedAt":"2026-06-28T05:41:04.603Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$op111$,
  $ky111$Uterine leiomyomas causing the heavy bleeding$ky111$,
  $ex111$Heavy bleeding with clots and an enlarged uterus whose contour is irregular and nodular is the pelvic-examination finding of uterine leiomyomas. Adenomyosis tends to produce a soft, slightly and diffusely enlarged uterus rather than a nodular contour. Endometrial carcinoma can cause heavy bleeding, but it does not create a nodular enlargement of the uterine body on examination. A coagulation disorder does not change the shape or size of the uterus.$ex111$,
  2,
  $dm111$reproductive-endocrine$dm111$,
  $tp111$menstrual-disorders$tp111$,
  $su111$https://medlineplus.gov/ency/article/000914.htm$su111$,
  $sl111$MedlinePlus, Uterine fibroids: heavy menstrual bleeding, and a pelvic exam may show a change in the shape and size of the uterus$sl111$,
  $sq111$This may show that you have a change in the shape and size of your womb.$sq111$,
  $ch111$91db2c7337e59892cd7e2f64d52944fb0c08d883c8dd659a9d8aedda7a969575$ch111$,
  true,
  $ref111$[{"label":"MedlinePlus, Uterine fibroids: heavy menstrual bleeding, and a pelvic exam may show a change in the shape and size of the uterus","url":"https://medlineplus.gov/ency/article/000914.htm"}]$ref111$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id112$cmr891deo00xu1yr97s3hteu4$id112$,
  $fx112$re-rate|rewrite$fx112$,
  $sc112$A 45-year-old woman has severe epigastric pain that began suddenly two hours ago. She has gallstones and a month of intermittent abdominal discomfort. Blood pressure is 120/80 mm Hg and heart rate is 88 beats per minute. The right upper quadrant is tender. Serum lipase is eight times the upper limit of normal, and the leukocyte count is 12,000/mm3.$sc112$,
  $qu112$What is the most likely diagnosis?$qu112$,
  $op112${"options":["Acute gallstone pancreatitis","Acute calculous cholecystitis","A perforated duodenal ulcer","Chronic calcific pancreatitis"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pancreatitis-hepatitis","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783283214476","qcScore":8.2,"slotIndex":49,"stepLevel":"step2","examNumber":9211,"generatedAt":"2026-07-05T20:33:11.134Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$op112$,
  $ky112$Acute gallstone pancreatitis$ky112$,
  $ex112$Sudden severe epigastric pain plus a lipase more than three times the upper limit of normal establishes acute pancreatitis, and the gallstones supply the cause. Right-upper-quadrant tenderness can suggest cholecystitis, but cholecystitis does not raise the lipase to this level. A perforated ulcer can cause sudden pain, yet it does not produce this lipase elevation. Chronic pancreatitis presents with repeated pain and does not cause an abrupt lipase rise of this degree two hours into a first attack.$ex112$,
  1,
  $dm112$gastrointestinal$dm112$,
  $tp112$pancreatitis-hepatitis$tp112$,
  $su112$https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis$su112$,
  $sl112$Merck Manual Professional, Acute Pancreatitis: diagnosis requires compatible pain plus lipase more than three times the upper limit of normal$sl112$,
  $sq112$Serum amylase and/or lipase > 3 times the upper limit of normal (normal range of amylase and lipase levels can differ depending on the assay used)$sq112$,
  $ch112$430084e51ab2a914a5d48d89adf38b1dba8268ef4225bc813a8e814d3aeff5ad$ch112$,
  true,
  $ref112$[{"label":"Merck Manual Professional, Acute Pancreatitis: diagnosis requires compatible pain plus lipase more than three times the upper limit of normal","url":"https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$ref112$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id113$cmrpwahuf009q1ylurnf1m2xe$id113$,
  $fx113$re-rate|rewrite$fx113$,
  $sc113$A 72-year-old woman has sudden severe abdominal pain that began four hours ago. She has hypertension and diabetes. The abdomen is distended and tender, and bowel sounds are diminished. Blood pressure is 90/60 mm Hg and heart rate is 110 beats per minute. Computed tomography shows a large-bowel obstruction with bowel-wall ischemia.$sc113$,
  $qu113$What is the most appropriate next step in management?$qu113$,
  $op113${"options":["Intravenous fluids plus urgent operative exploration","Intravenous fluids with operative exploration the next day","Oral laxatives intended to clear the bowel obstruction","Nasogastric suction used as definitive obstruction care"],"taskCategory":"diagnosis","blueprintTopic":"bowel-obstruction","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784350417637","qcScore":7.9,"slotIndex":28,"stepLevel":"step2","examNumber":9205,"generatedAt":"2026-07-18T04:56:20.902Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op113$,
  $ky113$Intravenous fluids plus urgent operative exploration$ky113$,
  $ex113$Ischemic large-bowel obstruction in a hypotensive patient needs intravenous volume replacement and operative exploration rather than either measure by itself. Fluids treat the shock, and exploration treats the ischemic bowel before infarction progresses. Delaying the operation until the next day leaves ischemic bowel in place for many hours. Oral laxatives are dangerous in mechanical obstruction. Nasogastric suction is supportive care and does not remove ischemic colon.$ex113$,
  2,
  $dm113$gastrointestinal$dm113$,
  $tp113$bowel-obstruction$tp113$,
  $su113$https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/intestinal-obstruction$su113$,
  $sl113$Merck Manual Professional, Intestinal Obstruction: suspected bowel ischemia is treated with resuscitation and operative exploration$sl113$,
  $sq113$If bowel ischemia or infarction is suspected, antibiotics should be given (eg, a third-generation cephalosporin, such as cefotetan or cefoxitin ) before operative exploration.$sq113$,
  $ch113$ae705d5267a3adef5b6554f51970cf41e461c4e35c057eaf94fc3f29f5988274$ch113$,
  true,
  $ref113$[{"label":"Merck Manual Professional, Intestinal Obstruction: suspected bowel ischemia is treated with resuscitation and operative exploration","url":"https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/intestinal-obstruction"}]$ref113$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id114$cmr88s01100t81yr97a1ksfnw$id114$,
  $fx114$re-rate|rewrite$fx114$,
  $sc114$A 60-year-old man with chronic obstructive pulmonary disease comes to the emergency department with worsening shortness of breath and a productive cough. Respiratory rate is 30 breaths per minute, oxygen saturation is 88 percent on room air, and temperature is 38 C. Auscultation shows wheezing and decreased breath sounds. A chest radiograph shows hyperinflation and no focal infiltrate.$sc114$,
  $qu114$Which of the following treatments is contraindicated?$qu114$,
  $op114${"options":["Sedative drug that suppresses respiratory drive","Inhaled short-acting beta-agonist treatment","Systemic glucocorticoid for airway inflammation","Supplemental oxygen for documented hypoxemia"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"copd-asthma-exacerbation","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783282762745","qcScore":8.1,"slotIndex":3,"stepLevel":"step2","examNumber":9210,"generatedAt":"2026-07-05T20:20:35.210Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$op114$,
  $ky114$Sedative drug that suppresses respiratory drive$ky114$,
  $ex114$He is already tachypneic and hypoxemic from an exacerbation, and a drug that suppresses ventilatory drive can precipitate ventilatory failure. An inhaled short-acting beta-agonist is a standard bronchodilator for the wheezing. A systemic glucocorticoid is part of exacerbation treatment. Supplemental oxygen is indicated for the saturation of 88 percent, not withheld.$ex114$,
  2,
  $dm114$respiratory-renal$dm114$,
  $tp114$copd-asthma-exacerbation$tp114$,
  $su114$https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/ventilatory-failure$su114$,
  $sl114$Merck Manual Professional, Ventilatory Failure: drugs that suppress ventilatory drive cause hypercapnic respiratory failure, as do severe COPD exacerbations$sl114$,
  $sq114$Common causes are severe acute exacerbations of chronic obstructive pulmonary disease (COPD), overdoses of drugs that suppress ventilatory drive, and conditions that cause respiratory muscle weakness (eg, Guillain-Barré syndrome, myasthenia gravis, botulism).$sq114$,
  $ch114$7a345efd9d7f24be84d051617d5fddc9fc7d3b41a80cfbe2121fa02d45e11c23$ch114$,
  true,
  $ref114$[{"label":"Merck Manual Professional, Ventilatory Failure: drugs that suppress ventilatory drive cause hypercapnic respiratory failure, as do severe COPD exacerbations","url":"https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/ventilatory-failure"}]$ref114$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id115$cmrrbwb2h0015l104ot4ug6r8$id115$,
  $fx115$re-rate|rewrite$fx115$,
  $sc115$A 54-year-old man arrives with two hours of chest pressure that radiates to the jaw and is worse with exertion. He has hypertension and hyperlipidemia. Blood pressure is 150/90 mm Hg and heart rate is 88 beats per minute. The electrocardiogram shows 1 mm of ST-segment depression in leads V4 through V6 and no ST-segment elevation. The first troponin result is not yet back.$sc115$,
  $qu115$What is the most appropriate initial classification?$qu115$,
  $op115${"options":["Non-ST-elevation acute coronary syndrome","ST-segment-elevation myocardial infarction","Chronic stable angina without acute injury","Acute pericarditis with diffuse ST elevation"],"blueprintTopic":"acs-management","blueprintSystem":"cardiovascular"}$op115$,
  $ky115$Non-ST-elevation acute coronary syndrome$ky115$,
  $ex115$New prolonged chest pressure with ST-segment depression and no ST elevation is non-ST-elevation acute coronary syndrome, covering unstable angina and non-ST-elevation infarction until the troponin returns. ST-elevation infarction requires ST elevation, which is absent. Chronic stable angina is not a two-hour episode with new ischemic ST depression. Pericarditis typically causes diffuse ST elevation, not exertional pain with ST depression.$ex115$,
  1,
  $dm115$cardiovascular$dm115$,
  $tp115$acs-management$tp115$,
  $su115$https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs$su115$,
  $sl115$Merck Manual Professional, Acute Coronary Syndromes: unstable angina and NSTEMI together are non-ST-elevation ACS$sl115$,
  $sq115$Unstable angina and NSTEMI are also collectively referred to as non-ST elevation ACS (NSTE-ACS).$sq115$,
  $ch115$3cded988fa197e1ad6ac3278c71038cbb1e25ed5725e99b96d90ba51bc3ec050$ch115$,
  true,
  $ref115$[{"label":"Merck Manual Professional, Acute Coronary Syndromes: unstable angina and NSTEMI together are non-ST-elevation ACS","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$ref115$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id116$cmr4hzvwr00aq1ydej0741bkr$id116$,
  $fx116$re-rate|rewrite$fx116$,
  $sc116$An 18-month-old girl has spells of deeper cyanosis while playing that ease when she squats. Between spells her lips are mildly cyanotic. Heart rate is 120 beats per minute and respiratory rate is 30 breaths per minute. A harsh systolic ejection murmur is loudest at the left upper sternal border. Femoral pulses are strong, and blood pressure is similar in the arms and the legs. There is no continuous murmur.$sc116$,
  $qu116$What is the most likely diagnosis?$qu116$,
  $op116${"options":["Tetralogy of Fallot with pulmonary outflow obstruction","Atrial septal defect with a left-to-right atrial shunt","Ventricular septal defect with a left-to-right shunt","Aortic coarctation with a lower-extremity pressure drop"],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"congenital-heart-disease","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783056257561","qcScore":8.2,"slotIndex":38,"stepLevel":"step2","examNumber":9204,"generatedAt":"2026-07-03T05:31:03.455Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$op116$,
  $ky116$Tetralogy of Fallot with pulmonary outflow obstruction$ky116$,
  $ex116$Cyanotic spells that improve with squatting, plus a harsh systolic ejection murmur at the left upper sternal border, are tetralogy of Fallot, in which the murmur is from pulmonary stenosis and squatting raises systemic resistance and reduces right-to-left shunting. An atrial septal defect causes a left-to-right shunt and does not produce cyanotic spells relieved by squatting. A ventricular septal defect murmur is holosystolic and the shunt is left to right in the absence of cyanotic spells. Coarctation lowers blood pressure and pulses in the legs, which are normal here.$ex116$,
  3,
  $dm116$cardiovascular$dm116$,
  $tp116$congenital-heart-disease$tp116$,
  $su116$https://www.merckmanuals.com/professional/pediatrics/congenital-cardiovascular-anomalies/tetralogy-of-fallot$su116$,
  $sl116$Merck Manual Professional, Tetralogy of Fallot: toddlers squat during play, and a harsh systolic ejection murmur is heard at the left upper sternal border$sl116$,
  $sq116$During play, some toddlers may intermittently squat, a position that increases systemic vascular resistance and aortic pressure, which decreases right-to-left ventricular shunting and thus raises arterial oxygen saturation.$sq116$,
  $ch116$d7a8332b796d565a02d1f287fc9b4fb3c2f16443ebdf0eeda8f56a18d2cde2fe$ch116$,
  true,
  $ref116$[{"label":"Merck Manual Professional, Tetralogy of Fallot: toddlers squat during play, and a harsh systolic ejection murmur is heard at the left upper sternal border","url":"https://www.merckmanuals.com/professional/pediatrics/congenital-cardiovascular-anomalies/tetralogy-of-fallot"}]$ref116$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id117$cmr87smmx00kf1yr9eag6rzkl$id117$,
  $fx117$re-rate|rewrite$fx117$,
  $sc117$A 72-year-old woman with hypertension and chronic heart failure has had worsening shortness of breath for two days. Blood pressure is 150/90 mm Hg and heart rate is 95 beats per minute. Both lungs have crackles. A chest radiograph shows cardiomegaly and pulmonary congestion. Serum B-type natriuretic peptide is 800 pg/mL. She has no chest pain, and the electrocardiogram shows no ST-segment elevation.$sc117$,
  $qu117$What is the most appropriate initial management?$qu117$,
  $op117${"options":["Intravenous loop diuretic for pulmonary edema","New beta-blocker while the lungs remain congested","Intravenous digoxin loading for fluid overload","Urgent coronary angiography for pulmonary edema"],"kind":"vignette","taskCategory":"communication","blueprintTopic":"chf-management","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783281113424","qcScore":8.1,"slotIndex":38,"stepLevel":"step2","examNumber":9207,"generatedAt":"2026-07-05T19:56:24.781Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$op117$,
  $ky117$Intravenous loop diuretic for pulmonary edema$ky117$,
  $ex117$Pulmonary congestion, crackles, and an elevated natriuretic peptide are treated initially with an intravenous loop diuretic. A new beta-blocker is started after the patient is stabilized, not while the lungs are still wet. Digoxin does not remove the acute fluid overload. Coronary angiography is not the first step without chest pain or ST elevation.$ex117$,
  1,
  $dm117$cardiovascular$dm117$,
  $tp117$chf-management$tp117$,
  $su117$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure$su117$,
  $sl117$Merck Manual Professional, Acute Heart Failure: loop diuretics are the initial decongestive therapy$sl117$,
  $sq117$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.$sq117$,
  $ch117$e1e1ae7ef906831ab95184f2a017502dc9233ec05b3297cf50bcc252c5cb1534$ch117$,
  true,
  $ref117$[{"label":"Merck Manual Professional, Acute Heart Failure: loop diuretics are the initial decongestive therapy","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$ref117$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id118$cmr877hrt00cw1yr95673if5b$id118$,
  $fx118$rewrite$fx118$,
  $sc118$A 65-year-old woman has sudden shortness of breath and chest pain. She has hypertension and formerly smoked. Blood pressure is 90/60 mm Hg, heart rate is 110 beats per minute, and oxygen saturation is 88 percent on room air. Computed tomographic angiography shows a filling defect in the right pulmonary artery. She has no active bleeding, no recent surgery, and no prior hemorrhagic stroke. Systemic thrombolysis is available in the department.$sc118$,
  $qu118$What is the most appropriate initial treatment?$qu118$,
  $op118${"options":["Volume resuscitation and systemic thrombolytic therapy","Anticoagulation without systemic thrombolytic therapy","Immediate surgical removal of the pulmonary embolus","Intravenous metoprolol for control of sinus tachycardia"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"pe-workup","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783280145452","qcScore":8.1,"slotIndex":0,"stepLevel":"step2","examNumber":9205,"generatedAt":"2026-07-05T19:37:04.446Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"diagnosis"}$op118$,
  $ky118$Volume resuscitation and systemic thrombolytic therapy$ky118$,
  $ex118$Hypotension from a documented pulmonary embolus is hemodynamic compromise, so she needs a cautious fluid bolus and systemic thrombolysis when no contraindication is present and the drug is available. Anticoagulation is used for pulmonary embolism, but anticoagulation without thrombolysis does not meet the recommendation for patients in shock. Surgical embolectomy is for thrombolysis that is contraindicated, unavailable, or unsuccessful. Metoprolol would further lower the blood pressure in a patient who is already hypotensive.$ex118$,
  3,
  $dm118$respiratory-renal$dm118$,
  $tp118$pe-workup$tp118$,
  $su118$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$su118$,
  $sl118$Merck Manual Professional, Pulmonary Embolism: systemic thrombolysis is given for hemodynamic compromise when contraindications are absent$sl118$,
  $sq118$Experts agree that systemic thrombolytic therapy should be given to patients with hemodynamic compromise if there are no contraindications, particularly when other means of rapidly reducing clot burden are not readily available.$sq118$,
  $ch118$e85eb045c483c5f5f7cc3507d25547adf3b9d9a893885c3d77baf77816b53d8b$ch118$,
  true,
  $ref118$[{"label":"Merck Manual Professional, Pulmonary Embolism: systemic thrombolysis is given for hemodynamic compromise when contraindications are absent","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$ref118$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id119$cmrtq47sb00251yqc9009nuai$id119$,
  $fx119$re-rate|rewrite$fx119$,
  $sc119$A 45-year-old woman who smokes has had two days of worsening shortness of breath and cough. She has hypertension. Blood pressure is 130/85 mm Hg, heart rate is 102 beats per minute, respiratory rate is 24 breaths per minute, and oxygen saturation is 88 percent on room air. The chest radiograph shows hyperinflation and a flattened diaphragm. Arterial blood gas shows pH 7.32, PaCO2 60 mm Hg, and PaO2 55 mm Hg. She is awake and protecting her airway.$sc119$,
  $qu119$What is the most appropriate initial respiratory support?$qu119$,
  $op119${"options":["Noninvasive ventilation plus supplemental oxygen","A systemic glucocorticoid and no ventilatory support","Immediate endotracheal intubation and a ventilator","Chest computed tomography before breathing support"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"health-maintenance","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9502,"slotIndex":12,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-20T21:14:22.229Z"}}$op119$,
  $ky119$Noninvasive ventilation plus supplemental oxygen$ky119$,
  $ex119$Hypercapnic acidosis with hypoxemia in an exacerbation is acute-on-chronic respiratory failure, for which noninvasive ventilation is the preferred initial ventilatory treatment, given together with oxygen for the PaO2 of 55 mm Hg. A glucocorticoid treats airway inflammation but does not by itself correct this ventilatory failure. She is awake and protecting her airway, so immediate intubation is not preferred over a trial of noninvasive ventilation. Computed tomography delays oxygen and ventilatory support.$ex119$,
  3,
  $dm119$respiratory-renal$dm119$,
  $tp119$copd-asthma-exacerbation$tp119$,
  $su119$https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/ventilatory-failure$su119$,
  $sl119$Merck Manual Professional, Ventilatory Failure: noninvasive ventilation is the preferred initial treatment for acute-on-chronic respiratory failure from COPD$sl119$,
  $sq119$NIPPV is the preferred initial treatment for many patients with ACRF, resulting in decreased rates of ventilator-associated pneumonia , length of stay, and mortality compared with endotracheal intubation .$sq119$,
  $ch119$b978924944117b2dc2a07497745674f97df0c06e01c68250483130e3de6cfa64$ch119$,
  true,
  $ref119$[{"label":"Merck Manual Professional, Ventilatory Failure: noninvasive ventilation is the preferred initial treatment for acute-on-chronic respiratory failure from COPD","url":"https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/ventilatory-failure"}]$ref119$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id120$cmrsrb3bf001fl40496r73pg8$id120$,
  $fx120$re-rate|rewrite$fx120$,
  $sc120$A 67-year-old man with advanced dementia is admitted with aspiration pneumonia. He does not recognize his spouse and cannot communicate a decision. Before the dementia, he completed a valid advance directive refusing cardiopulmonary resuscitation and intubation. His daughter, who is next of kin, says to do everything because he would want to live. Antibiotics and oxygen by face mask are available.$sc120$,
  $qu120$What is the most appropriate plan?$qu120$,
  $op120${"options":["Honor the directive and treat pneumonia without intubation","Intubate for worsening pneumonia because the daughter insists","Seek a court order before following the written directive","Withhold antibiotics because resuscitation was declined","Sedate him and defer discussion of the written directive"],"blueprintTopic":"ethics-professionalism","blueprintSystem":"social-sciences"}$op120$,
  $ky120$Honor the directive and treat pneumonia without intubation$ky120$,
  $ex120$A valid advance directive is how he told clinicians and family which treatments he would accept, and it refuses resuscitation and intubation while still allowing antibiotics and oxygen. His daughter's request does not replace the directive he already signed. A court order is not required to follow a clear, valid refusal of those two interventions. Refusing resuscitation is not a refusal of antibiotics. Sedation that postpones the plan leaves the documented choice unused.$ex120$,
  1,
  $dm120$social-sciences$dm120$,
  $tp120$ethics-professionalism$tp120$,
  $su120$https://medlineplus.gov/advancedirectives.html$su120$,
  $sl120$MedlinePlus, Advance Directives: these documents state end-of-life choices, including refusal of resuscitation and breathing machines, for clinicians and family$sl120$,
  $sq120$Advance directives are legal documents that allow you to spell out your decisions about end-of-life care ahead of time.$sq120$,
  $ch120$d56e1a72c64503374f551ce9bef574c1e9b00d14f06bfe00238259b641d55bc9$ch120$,
  true,
  $ref120$[{"label":"MedlinePlus, Advance Directives: these documents state end-of-life choices, including refusal of resuscitation and breathing machines, for clinicians and family","url":"https://medlineplus.gov/advancedirectives.html"}]$ref120$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id121$cceb80cf-3d73-400c-b7cc-deb17b291ca0$id121$,
  $fx121$re-rate|rewrite$fx121$,
  $sc121$A 6-month-old boy who was born at 28 weeks and still uses 0.25 L of home oxygen for chronic lung disease of prematurity has cough, wheeze, and poor feeding. Respiratory rate is 64 breaths per minute, oxygen saturation is 88 percent on his baseline oxygen, and he has intercostal retractions. Temperature is 37.7 C. He is sleepier than usual, the fontanelle is normal, and there is no rash and no lobar finding. The family asks for a steroid and an oral antibiotic so they can avoid admission.$sc121$,
  $qu121$Which disposition and treatment are most appropriate?$qu121$,
  $op121${"options":["Hospital admission for oxygen and supportive hydration","Discharge home on oral dexamethasone plus azithromycin","Discharge with instructions to return if breathing worsens","Discharge on scheduled albuterol and unchanged oxygen","Discharge after chest physiotherapy and a clinic visit"],"blueprintSystem":"human-development","taskCategory":"clinical-intervention","blueprintTopic":"pediatric-infections","kind":"vignette"}$op121$,
  $ky121$Hospital admission for oxygen and supportive hydration$ky121$,
  $ex121$Prematurity and chronic lung disease put him at risk of severe bronchiolitis, and he already has hypoxia below his baseline, retractions, poor feeding, and fatigue, so he is admitted for oxygen and hydration. Corticosteroids are not recommended for a first episode of bronchiolitis, and antibiotics are not indicated without a bacterial complication. Discharge with return instructions leaves a high-risk, hypoxemic infant unmonitored. Scheduled albuterol and unchanged oxygen do not correct a saturation of 88 percent on his baseline flow. Chest physiotherapy is not the treatment of bronchiolitis.$ex121$,
  2,
  $dm121$human-development$dm121$,
  $tp121$pediatric-infections$tp121$,
  $su121$https://www.merckmanuals.com/professional/pediatrics/respiratory-disorders-in-young-children/bronchiolitis$su121$,
  $sl121$Merck Manual Professional, Bronchiolitis: high-risk infants are hospitalized, and care is supportive oxygen and hydration rather than routine corticosteroids or antibiotics$sl121$,
  $sq121$Patients who are at risk of developing severe disease should be hospitalized.$sq121$,
  $ch121$f17dc62bb782710d987ff8012cefe2c4670868e0e3f027754b7523bc26401e29$ch121$,
  true,
  $ref121$[{"label":"Merck Manual Professional, Bronchiolitis: high-risk infants are hospitalized, and care is supportive oxygen and hydration rather than routine corticosteroids or antibiotics","url":"https://www.merckmanuals.com/professional/pediatrics/respiratory-disorders-in-young-children/bronchiolitis"}]$ref121$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id122$cmrsrb22f000vl404hxmqp537$id122$,
  $fx122$re-rate|rewrite$fx122$,
  $sc122$A 28-year-old woman has had generalized edema and fatigue for a month. She reports no recent infection and no new medication. Blood pressure is normal. A 24-hour urine collection contains 4.2 g of protein, the sediment has no red cells and no casts, and the antinuclear antibody test is negative. A serum anti-PLA2R antibody assay is positive.$sc122$,
  $qu122$What is the most likely diagnosis?$qu122$,
  $op122${"options":["Primary membranous nephropathy","Focal segmental glomerulosclerosis","Minimal change disease in an adult","IgA nephropathy with proteinuria"],"blueprintTopic":"nephrotic-nephritic","blueprintSystem":"respiratory-renal"}$op122$,
  $ky122$Primary membranous nephropathy$ky122$,
  $ex122$Nephrotic-range protein, edema, a bland sediment, and a positive anti-PLA2R antibody in an adult indicate primary membranous nephropathy, a common adult cause of nephrotic syndrome whose target antigen is PLA2R. Focal segmental glomerulosclerosis can cause adult nephrotic syndrome but is not linked to PLA2R antibody. Minimal change disease is a less common adult cause and is not identified by this antibody. IgA nephropathy is a nephritic disease with hematuria, and this sediment has no red cells.$ex122$,
  2,
  $dm122$respiratory-renal$dm122$,
  $tp122$nephrotic-nephritic$tp122$,
  $su122$https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/membranous-nephropathy$su122$,
  $sl122$Merck Manual Professional, Membranous Nephropathy: PLA2R is the major antigen, and the disease is a common cause of nephrotic syndrome in adults$sl122$,
  $sq122$Membranous nephropathy mostly affects adults, in whom it is a common cause of nephrotic syndrome ( 1 ).$sq122$,
  $ch122$4a585b4c83c3ea0f89998cc67388db82182e871362a89a55e6149f2dfb0fd249$ch122$,
  true,
  $ref122$[{"label":"Merck Manual Professional, Membranous Nephropathy: PLA2R is the major antigen, and the disease is a common cause of nephrotic syndrome in adults","url":"https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/membranous-nephropathy"}]$ref122$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id123$f71c7e0c-da4f-49cc-a8b5-ffa35526dd24$id123$,
  $fx123$re-rate|rewrite$fx123$,
  $sc123$A 64-year-old man has neither diabetes nor a heart-failure diagnosis. The estimated glomerular filtration rate is 38 mL/min/1.73 m2, and the urine albumin-creatinine ratio is 450 mg/g. Losartan is already at the maximum tolerated dose. A chart note says SGLT2 inhibitors are diabetes drugs and should not be used. Potassium is 4.5 mEq/L, and he is euvolemic.$sc123$,
  $qu123$What is the most appropriate addition?$qu123$,
  $op123${"options":["Start an SGLT2 inhibitor and continue daily losartan","Withhold an SGLT2 inhibitor because diabetes is absent","Add ramipril in combination with current losartan","Stop losartan and substitute an SGLT2 inhibitor","Add finerenone for albuminuria without diabetes"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"aki-ckd-electrolytes","kind":"vignette"}$op123$,
  $ky123$Start an SGLT2 inhibitor and continue daily losartan$ky123$,
  $ex123$An SGLT2 inhibitor slows progression of proteinuric chronic kidney disease whether or not the patient has diabetes, so it is added while losartan is continued. The absence of diabetes is not a reason to withhold the class in proteinuric chronic kidney disease. Adding ramipril to losartan is dual renin-angiotensin blockade, which increases complications and does not slow the decline in kidney function. Stopping losartan discards a therapy he tolerates at full dose. Finerenone is discussed for albuminuria in type 2 diabetes, which he does not have.$ex123$,
  2,
  $dm123$respiratory-renal$dm123$,
  $tp123$aki-ckd-electrolytes$tp123$,
  $su123$https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease$su123$,
  $sl123$Merck Manual Professional, Chronic Kidney Disease: SGLT2 inhibitors slow proteinuric CKD with or without diabetes, and combined ACE inhibitor plus ARB therapy is not recommended$sl123$,
  $sq123$Sodium-glucose cotransporter-2 (SGLT2) inhibitors delay progression of proteinuric CKD in patients with or without diabetes, although these medications are contraindicated in patients with type 1 diabetes mellitus ( 3 ).$sq123$,
  $ch123$a2726f96808c88570eea67163c463577e2bd218206f336000e0cee2f33a1afde$ch123$,
  true,
  $ref123$[{"label":"Merck Manual Professional, Chronic Kidney Disease: SGLT2 inhibitors slow proteinuric CKD with or without diabetes, and combined ACE inhibitor plus ARB therapy is not recommended","url":"https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease"}]$ref123$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id124$cmtpwlh06001k1y6hsekhu6ci$id124$,
  $fx124$re-rate|rewrite$fx124$,
  $sc124$A 65-year-old woman with chronic obstructive pulmonary disease has had three days of worsening cough, fever, and pleuritic chest pain. Temperature is 38.5 C, respiratory rate is 24 breaths per minute, and oxygen saturation is 88 percent on room air. A chest radiograph shows a right-lower-lobe infiltrate.$sc124$,
  $qu124$What is the most appropriate initial management?$qu124$,
  $op124${"options":["Empiric antibiotics plus oxygen for hypoxemia","Empiric antibiotics and no supplemental oxygen","A bronchodilator and no antibiotic or oxygen","Chest CT before antibiotics or supplemental oxygen"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"pneumonia-workup","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788704525319","examNumber":9201,"slotIndex":56,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-09-06T14:24:40.741Z"}}$op124$,
  $ky124$Empiric antibiotics plus oxygen for hypoxemia$ky124$,
  $ex124$Fever, pleuritic pain, and a lobar infiltrate are pneumonia, which is treated with empiric antibiotics, and a saturation of 88 percent is hypoxemia that is treated with oxygen. Antibiotics without oxygen leave the hypoxemia untreated. A bronchodilator may help the underlying lung disease but does not treat the infection or the low saturation. Another scan is unnecessary once the radiograph already shows the infiltrate, and it delays both treatments.$ex124$,
  2,
  $dm124$respiratory-renal$dm124$,
  $tp124$pneumonia-workup$tp124$,
  $su124$https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia$su124$,
  $sl124$Merck Manual Professional, Community-Acquired Pneumonia: treatment is empiric antibiotics, and hypoxemia is treated with oxygen$sl124$,
  $sq124$Supportive care includes fluids, antipyretics (as needed for high-grade fever), analgesics, and, for patients with hypoxemia, oxygen.$sq124$,
  $ch124$ebcc8617dcf4118a58e664a6ef329890cc012ac69b2e449ddf29a557eb1ec8a2$ch124$,
  true,
  $ref124$[{"label":"Merck Manual Professional, Community-Acquired Pneumonia: treatment is empiric antibiotics, and hypoxemia is treated with oxygen","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia"}]$ref124$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id125$cmtpwzz2400741y6hstk0ysy8$id125$,
  $fx125$re-rate|rewrite$fx125$,
  $sc125$A 45-year-old man with HIV has had two weeks of gradually worsening fever, cough, fatigue, drenching night sweats, and a 5 kg weight loss. Temperature is 38.3 C and respiratory rate is 22 breaths per minute. Sputum is scant and not purulent. Breath sounds are decreased on the right. A chest radiograph shows a unilateral right pleural effusion and no diffuse bilateral infiltrate. The CD4 count is 150 cells/mm3.$sc125$,
  $qu125$What is the most likely diagnosis?$qu125$,
  $op125${"options":["Tuberculosis with a unilateral pleural effusion","Pneumocystis pneumonia with bilateral infiltrates","Acute bacterial community-acquired pneumonia","Endemic fungal pneumonia with a pleural effusion"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"blood-lymph-immune","blueprintTopic":"hiv-opportunistic","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788705041511","examNumber":9203,"slotIndex":15,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-09-06T14:32:32.400Z"}}$op125$,
  $ky125$Tuberculosis with a unilateral pleural effusion$ky125$,
  $ex125$Subacute fever, cough, drenching night sweats, weight loss, and a unilateral pleural effusion in a patient with HIV are the clinical picture of tuberculosis, and HIV is the strongest predisposing infection for it. Pneumocystis pneumonia causes fever, dyspnea, and dry cough with diffuse bilateral perihilar infiltrates, not a unilateral effusion as the main finding. Acute bacterial pneumonia is a short illness with purulent sputum and lobar consolidation, not a two-week course dominated by night sweats and weight loss. An endemic fungus can involve the lung, but this combination of night sweats, weight loss, HIV, and a unilateral effusion points to tuberculosis first.$ex125$,
  3,
  $dm125$blood-lymph-immune$dm125$,
  $tp125$hiv-opportunistic$tp125$,
  $su125$https://www.merckmanuals.com/professional/infectious-diseases/mycobacteria/tuberculosis-tb$su125$,
  $sl125$Merck Manual Professional, Tuberculosis: night sweats are classic, pleural effusion causes dyspnea, and HIV is the major predisposing infection$sl125$,
  $sq125$Dyspnea may result from lung parenchymal damage, spontaneous pneumothorax, or pleural TB with effusion.$sq125$,
  $ch125$dc89b87742856a3c61716abb9955cebba660e29b146c6f28e44a4003bea0fafb$ch125$,
  true,
  $ref125$[{"label":"Merck Manual Professional, Tuberculosis: night sweats are classic, pleural effusion causes dyspnea, and HIV is the major predisposing infection","url":"https://www.merckmanuals.com/professional/infectious-diseases/mycobacteria/tuberculosis-tb"}]$ref125$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id126$cmtpvy0dm000u1ylcldo2neph$id126$,
  $fx126$re-rate|rewrite$fx126$,
  $sc126$A 45-year-old man with HIV comes to the emergency department with fever, a nonproductive cough for two weeks, and shortness of breath. His CD4 count is 150 cells/mm³ and he is taking antiretroviral therapy. Temperature is 38.5°C, respiratory rate is 24 breaths/min, and oxygen saturation is 88% on room air. The chest radiograph shows bilateral interstitial infiltrates without cavitation.$sc126$,
  $qu126$Which antimicrobial is most appropriate?$qu126$,
  $op126${"options":["Trimethoprim-sulfamethoxazole","Intravenous fluconazole therapy","Isoniazid plus rifampin therapy","Oral azithromycin for five days"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"blood-lymph-immune","blueprintTopic":"hiv-opportunistic","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788703290753","examNumber":9201,"slotIndex":30,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:02:03.890Z"}}$op126$,
  $ky126$Trimethoprim-sulfamethoxazole$ky126$,
  $ex126$Hypoxemic bilateral interstitial pneumonia and a nonproductive cough in a person with HIV and a CD4 count of 150 cells/mm³ is treated with trimethoprim-sulfamethoxazole, the first-line antimicrobial for Pneumocystis jirovecii pneumonia. People with HIV are at high risk for this pneumonia when the CD4 count is below 200 cells/mm³. Intravenous fluconazole does not treat Pneumocystis. Isoniazid plus rifampin is tuberculosis therapy, and this radiograph shows no cavitation. Azithromycin does not treat Pneumocystis pneumonia. Adjunctive glucocorticoids are used when room-air saturation is below 92%, but they do not replace trimethoprim-sulfamethoxazole.$ex126$,
  2,
  $dm126$blood-lymph-immune$dm126$,
  $tp126$hiv-opportunistic$tp126$,
  $su126$https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/pneumocystis-jirovecii-pneumonia$su126$,
  $sl126$Pneumocystis jirovecii Pneumonia, Merck Manual Professional Edition: first-line treatment is trimethoprim-sulfamethoxazole$sl126$,
  $sq126$The first-line treatment of Pneumocystis jirovecii pneumonia is with sulfamethoxazole/ trimethoprim (TMP/SMX) ( 1 ).$sq126$,
  $ch126$8975e964768186e2bef246dbff17301f0d0c1b9faee776d16dd1b2b00f5e4dad$ch126$,
  true,
  $ref126$[{"label":"Pneumocystis jirovecii Pneumonia, Merck Manual Professional Edition: first-line treatment is trimethoprim-sulfamethoxazole","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/pneumocystis-jirovecii-pneumonia"}]$ref126$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id127$b9xe7d9e6dfa04b9f378a991576$id127$,
  $fx127$re-rate|rewrite$fx127$,
  $sc127$A 64-year-old patient with protein in the urine starts an ACE inhibitor. The creatinine rises from 1.0 to 1.2 mg/dL and then stays there. The potassium is 4.6 mEq/L. The blood pressure improved. There is no renal bruit.$sc127$,
  $qu127$Which statement about this creatinine change is correct?$qu127$,
  $op127${"options":["A modest rise that plateaus is an expected tolerated change","A potassium of 4.6 mEq/L means the inhibitor has failed","No renal bruit means this rise is bilateral artery stenosis","A creatinine that stays up after the bump is ongoing injury","Improved blood pressure means the rise must be stopped now"],"blueprintTopic":"aki-ckd-electrolytes","blueprintSystem":"respiratory-renal"}$op127$,
  $ky127$A modest rise that plateaus is an expected tolerated change$ky127$,
  $ex127$A rise from 1.0 to 1.2 mg/dL is about 20%, and patients given an ACE inhibitor can usually tolerate an increase in serum creatinine of up to 30 to 35% above baseline when the value then plateaus. An acute rise of at least 50% is the change that raises concern for renal artery stenosis, which this stable bump has not reached. A potassium of 4.6 mEq/L does not mean the inhibitor has failed. Absence of a renal bruit does not turn this small stable rise into bilateral renal artery stenosis. A creatinine that rises once and then holds is not ongoing tubular injury, and the improved blood pressure is the intended effect rather than a reason to stop the drug.$ex127$,
  2,
  $dm127$respiratory-renal$dm127$,
  $tp127$aki-ckd-electrolytes$tp127$,
  $su127$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/medications-for-hypertension$su127$,
  $sl127$Medications for Hypertension, Merck Manual Professional Edition: a limited creatinine rise on an ACE inhibitor is usually tolerated$sl127$,
  $sq127$Patients who have stage 3 nephropathy (estimated GFR of < 60 mL/minute to > 30 mL/minute) and are given ACE inhibitors can usually tolerate an increase in serum creatinine up to 30 to 35% above baseline.$sq127$,
  $ch127$1b43b3d89a8810b3c3968316bb892ab0607cfd2886b12b0c6bf5cfcfa3b34637$ch127$,
  true,
  $ref127$[{"label":"Medications for Hypertension, Merck Manual Professional Edition: a limited creatinine rise on an ACE inhibitor is usually tolerated","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/medications-for-hypertension"}]$ref127$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id128$b6x55dd6eb417a0c7f007d87203$id128$,
  $fx128$re-rate|rewrite$fx128$,
  $sc128$A 72-year-old man has atrial fibrillation at 150 beats/min, a blood pressure of 80/50 mm Hg, and confusion. The rhythm began this hour. He has a pulse. A classmate orders intravenous metoprolol to slow the rate.$sc128$,
  $qu128$Which management is most appropriate?$qu128$,
  $op128${"options":["Immediate synchronized cardioversion","Intravenous metoprolol for rate control","Oral digoxin and a clinic follow-up","A dose of adenosine for this rhythm","Bedside observation during this hour"],"blueprintTopic":"arrhythmias-management","blueprintSystem":"cardiovascular"}$op128$,
  $ky128$Immediate synchronized cardioversion$ky128$,
  $ex128$Confusion and a blood pressure of 80/50 mm Hg are hemodynamic compromise from atrial fibrillation that began this hour, so sinus rhythm should be restored. Immediate synchronized cardioversion restores the rhythm without a drug that can lower the pressure further. Intravenous metoprolol slows the rate and can drop a pressure that is already 80/50 mm Hg. Oral digoxin and clinic follow-up act too slowly for shock. Adenosine does not convert atrial fibrillation. A palpable pulse does not make him stable while he is confused and hypotensive.$ex128$,
  2,
  $dm128$cardiovascular$dm128$,
  $tp128$arrhythmias-management$tp128$,
  $su128$https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-fibrillation$su128$,
  $sl128$Atrial Fibrillation, Merck Manual Professional Edition: hemodynamic compromise calls for restoration of sinus rhythm$sl128$,
  $sq128$In patients with heart failure or other hemodynamic compromise directly attributable to new-onset atrial fibrillation, restoration of normal sinus rhythm is indicated to improve cardiac output ( 1 ).$sq128$,
  $ch128$b311e9f42dee31f8cd523e69264ce8cf5b2a1fa3709624b5e0d6834df699a740$ch128$,
  true,
  $ref128$[{"label":"Atrial Fibrillation, Merck Manual Professional Edition: hemodynamic compromise calls for restoration of sinus rhythm","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-fibrillation"}]$ref128$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id129$b4x3e24a5eb3d7f098bdee1e812$id129$,
  $fx129$re-rate|rewrite$fx129$,
  $sc129$A 28-year-old woman has diarrhea, weight loss, and a positive tissue-transglutaminase antibody. She wants to stop eating gluten tonight. A duodenal biopsy is scheduled in ten days. A colleague tells her to start a gluten-free diet before the endoscopy so the pathologist sees a treated bowel.$sc129$,
  $qu129$Which instruction is appropriate before the biopsy?$qu129$,
  $op129${"options":["Keep eating gluten until the biopsy is done","Stop gluten tonight so the mucosa can heal","Cancel biopsy because the antibody is positive","Start a lactose-free diet before the scope","Delay biopsy until the weight loss reverses"],"blueprintTopic":"malabsorption","blueprintSystem":"gastrointestinal"}$op129$,
  $ky129$Keep eating gluten until the biopsy is done$ky129$,
  $ex129$A gluten-free diet started before diagnostic testing can change the test result, so she should keep eating gluten until the duodenal biopsy is taken. Stopping tonight can let the mucosa heal and erase the lesion. A positive tissue-transglutaminase antibody does not cancel the biopsy that is already planned. A lactose-free diet does not answer whether gluten is injuring the bowel. Delaying the biopsy until the weight loss reverses postpones the sample that confirms the disease.$ex129$,
  1,
  $dm129$gastrointestinal$dm129$,
  $tp129$malabsorption$tp129$,
  $su129$https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis$su129$,
  $sl129$Diagnosis of Celiac Disease, NIDDK: do not start a gluten-free diet before diagnostic testing$sl129$,
  $sq129$Doctors don’t recommend starting a gluten-free diet before diagnostic testing because a gluten-free diet can affect test results.$sq129$,
  $ch129$b464705f0b46c32811a64b17fd08c9be2574121d9abf95aa1b544d185ad54e10$ch129$,
  true,
  $ref129$[{"label":"Diagnosis of Celiac Disease, NIDDK: do not start a gluten-free diet before diagnostic testing","url":"https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis"}]$ref129$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id130$b5xda3b13958d4051a52d401d76$id130$,
  $fx130$re-rate|rewrite$fx130$,
  $sc130$An unidentified 70-year-old patient is unconscious after trauma. No documents and no family are found. A neighbor in the waiting room demands an operation the surgeons think would only prolong dying. The patient never spoke to that neighbor about care.$sc130$,
  $qu130$Whose judgment guides the decision?$qu130$,
  $op130${"options":["The team's judgment of medically required care","The neighbor, because he is present in the room","The most aggressive operation that can be offered","The neighbor's demand that the operation go ahead","No decision until a relative appears next week"],"blueprintTopic":"ethics-professionalism","blueprintSystem":"social-sciences"}$op130$,
  $ky130$The team's judgment of medically required care$ky130$,
  $ex130$This unconscious patient has no authorized surrogate, so immediate decisions follow presumed consent for care that is medically required. The neighbor was never given that authority, and standing in the waiting room does not create it. An operation the surgeons believe would only prolong dying is not medically required care. The neighbor's demand that the operation proceed does not override that judgment. Waiting until next week for a relative to appear delays a decision the team can make now.$ex130$,
  2,
  $dm130$social-sciences$dm130$,
  $tp130$ethics-professionalism$tp130$,
  $su130$https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/consent-and-surrogate-decision-making$su130$,
  $sl130$Consent and Surrogate Decision Making, Merck Manual Professional Edition: presumed consent when no surrogate is available$sl130$,
  $sq130$When immediate decisions are medically required, the patient is incapacitated , and an authorized surrogate is not immediately available, the doctrine of presumed consent applies.$sq130$,
  $ch130$e33f5df72fe68ed4e781a3e76e7d78b0bed55a0487664671a2d15121bd2cf449$ch130$,
  true,
  $ref130$[{"label":"Consent and Surrogate Decision Making, Merck Manual Professional Edition: presumed consent when no surrogate is available","url":"https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/consent-and-surrogate-decision-making"}]$ref130$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id131$b7x6fdbeca8695031240e5a2f3b$id131$,
  $fx131$re-rate|rewrite$fx131$,
  $sc131$A surgeon operated after several drinks. The patient is stable in recovery. A partner says the good outcome means no report is needed. The surgeon is on the schedule again tomorrow. Nobody was told last night.$sc131$,
  $qu131$Which action is required?$qu131$,
  $op131${"options":["Report the impairment before tomorrow's cases","Treat the stable recovery as closing the case","Wait to see the outcome of tomorrow's operation","Let the partner decide that no report is needed","Ask the recovered patient whether to report it"],"blueprintTopic":"ethics-professionalism","blueprintSystem":"social-sciences"}$op131$,
  $ky131$Report the impairment before tomorrow's cases$ky131$,
  $ex131$Operating after drinking undermines the safety of care, and a stable recovery does not erase that. The surgeon is scheduled again tomorrow, so the next patient is still exposed. Treating the good outcome as the end of the matter leaves that exposure in place. Waiting to see tomorrow's operation, or letting a partner decide that silence is enough, is not a review. Confidential reporting is how this behavior is supposed to be raised, and the recovered patient does not have to request it first.$ex131$,
  1,
  $dm131$social-sciences$dm131$,
  $tp131$ethics-professionalism$tp131$,
  $su131$https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/01/behavior-that-undermines-a-culture-of-safety$su131$,
  $sl131$Behavior That Undermines a Culture of Safety, ACOG: confidential reporting systems should be established for physicians whose behavior threatens safety$sl131$,
  $sq131$Confidential reporting systems and assistance programs for physicians who exhibit disruptive behavior should be established.$sq131$,
  $ch131$4335b0700a2db394ac38849a6e542b2d7682084271269b9af9fe928e4f56b054$ch131$,
  true,
  $ref131$[{"label":"Behavior That Undermines a Culture of Safety, ACOG: confidential reporting systems should be established for physicians whose behavior threatens safety","url":"https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/01/behavior-that-undermines-a-culture-of-safety"}]$ref131$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id132$pltc05d1e65c28f3afc7b1d108c$id132$,
  $fx132$re-rate|rewrite$fx132$,
  $sc132$A 31-year-old man says he wrote a note, bought a firearm yesterday, and will use it tonight if he is sent home. He states the date, the name of the hospital, and that dying is permanent. He refuses voluntary admission. He is not intoxicated. The friend in the waiting room cannot stay with him.$sc132$,
  $qu132$Which plan is the most appropriate next step?$qu132$,
  $op132${"options":["Involuntary psychiatric hospitalization","Outpatient clinic visit in seven days","Discharge to home with a safety plan","Benzodiazepine plus locking the firearm","No-harm contract and discharge tonight"],"blueprintTopic":"suicide-risk","blueprintSystem":"behavioral-nervous"}$op132$,
  $ky132$Involuntary psychiatric hospitalization$ky132$,
  $ex132$He has a firearm and a plan to use it tonight if he is sent home, he refuses voluntary admission, and no one can stay with him. A patient at imminent risk should not be left alone until he is in a secure environment, which here means involuntary psychiatric hospitalization. A clinic visit in seven days does not cover tonight. Discharge home, with or without a safety plan, is the course he says will lead him to use the firearm. A benzodiazepine and locking the gun do not provide supervision tonight. A no-harm contract does not remove an imminent plan when he refuses to stay.$ex132$,
  1,
  $dm132$behavioral-nervous$dm132$,
  $tp132$suicide-risk$tp132$,
  $su132$https://www.merckmanuals.com/professional/psychiatric-disorders/suicidal-behavior/suicidal-behavior$su132$,
  $sl132$Suicidal Behavior, Merck Manual Professional Edition: imminently suicidal patients stay in a secure setting$sl132$,
  $sq132$At-risk patients should not be left alone until they are in a secure environment (often a psychiatric facility or emergency department).$sq132$,
  $ch132$8076cab4c43e1487a986287c1b28607db885d49eaef147ab60ed6a4a5cae2b30$ch132$,
  true,
  $ref132$[{"label":"Suicidal Behavior, Merck Manual Professional Edition: imminently suicidal patients stay in a secure setting","url":"https://www.merckmanuals.com/professional/psychiatric-disorders/suicidal-behavior/suicidal-behavior"}]$ref132$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id133$b3x7ba55c81b6a6807d371ff3de$id133$,
  $fx133$re-rate|rewrite$fx133$,
  $sc133$A 72-year-old man shuffles, has a resting tremor, and falls. The examination shows cogwheel rigidity. He is not taking a dopamine-blocking drug. Walking at home is failing.$sc133$,
  $qu133$Which treatment is most appropriate?$qu133$,
  $op133${"options":["Levodopa-carbidopa for gait failure","Haloperidol for his resting tremor","Propranolol for his resting tremor","Observation despite repeated falling","Benztropine for his gait failure"],"blueprintTopic":"neurodegenerative","blueprintSystem":"behavioral-nervous"}$op133$,
  $ky133$Levodopa-carbidopa for gait failure$ky133$,
  $ex133$Shuffling, a resting tremor, cogwheel rigidity, and falls, without a dopamine-blocking drug, are Parkinson disease. Levodopa is the most effective treatment for the bradykinesia and rigidity that are making him fall. Haloperidol is an antipsychotic and can worsen the syndrome. Propranolol is used for essential tremor, not this rigid resting tremor. Observation leaves the repeated falls untreated. Benztropine is not the most effective drug for bradykinesia and gait failure.$ex133$,
  1,
  $dm133$behavioral-nervous$dm133$,
  $tp133$neurodegenerative$tp133$,
  $su133$https://www.merckmanuals.com/professional/neurologic-disorders/movement-and-cerebellar-disorders/parkinson-disease$su133$,
  $sl133$Parkinson Disease, Merck Manual Professional Edition: levodopa is most effective for bradykinesia and rigidity$sl133$,
  $sq133$Levodopa is most effective at relieving bradykinesia and rigidity and often substantially reduces tremor ( 2 ).$sq133$,
  $ch133$1d14574e74fb02a53ba330b8f4b84541737b7cbfb492c9afae9da3fe73589804$ch133$,
  true,
  $ref133$[{"label":"Parkinson Disease, Merck Manual Professional Edition: levodopa is most effective for bradykinesia and rigidity","url":"https://www.merckmanuals.com/professional/neurologic-disorders/movement-and-cerebellar-disorders/parkinson-disease"}]$ref133$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id134$b3x4a2dabd78de1933c561300f8$id134$,
  $fx134$re-rate|rewrite$fx134$,
  $sc134$A 70-year-old man with severe COPD has sudden pleuritic chest pain and shortness of breath. The radiograph shows a small pneumothorax on the right. Oxygen saturation is 86% on his usual oxygen. The trachea is midline.$sc134$,
  $qu134$Which management is most appropriate?$qu134$,
  $op134${"options":["Tube thoracostomy for secondary pneumothorax","Observation with a repeat film in four hours","Needle decompression for tension physiology","Antibiotics aimed at reexpanding the lung","Higher oxygen flow and a flight home tonight"],"blueprintTopic":"copd-asthma-exacerbation","blueprintSystem":"respiratory-renal"}$op134$,
  $ky134$Tube thoracostomy for secondary pneumothorax$ky134$,
  $ex134$A pneumothorax in severe COPD is a secondary pneumothorax, and tube thoracostomy is the treatment used for secondary pneumothorax. Underlying lung disease has already reduced his reserve, and he is short of breath with an oxygen saturation of 86% on his usual oxygen. Observation is for an asymptomatic primary pneumothorax, not this one. The film shows a small pneumothorax and the trachea is midline, so this is not tension physiology. Antibiotics do not evacuate pleural air. Flying home while a pneumothorax is present is unsafe.$ex134$,
  2,
  $dm134$respiratory-renal$dm134$,
  $tp134$copd-asthma-exacerbation$tp134$,
  $su134$https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pneumothorax$su134$,
  $sl134$Pneumothorax, Merck Manual Professional Edition: tube thoracostomy for secondary pneumothorax$sl134$,
  $sq134$Tube thoracostomy for secondary and traumatic pneumothoraces$sq134$,
  $ch134$ce4d197c075afdffeaae0a55ee4c873e3dcc63e06af5f24914ccb40c371aa991$ch134$,
  true,
  $ref134$[{"label":"Pneumothorax, Merck Manual Professional Edition: tube thoracostomy for secondary pneumothorax","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pneumothorax"}]$ref134$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id135$b4xf93dc3d1c59419885444db7c$id135$,
  $fx135$re-rate|rewrite$fx135$,
  $sc135$A 70-year-old man has a creatinine of 3.5 mg/dL that has been rising for years. Both kidneys are 8 cm and echogenic. The urine has a little protein and no casts. He is not nephrotic. A colleague wants a biopsy tomorrow to find a reversible disease.$sc135$,
  $qu135$Why is kidney biopsy the wrong study?$qu135$,
  $op135${"options":["Small fibrotic kidneys make biopsy low yield and risky","Echogenic kidneys mean an acute recoverable disease","Absent casts make tomorrow's kidney biopsy mandatory","The films show a short illness rather than years of rise","Small kidneys give the safest and highest-yield tissue"],"blueprintTopic":"aki-ckd-electrolytes","blueprintSystem":"respiratory-renal"}$op135$,
  $ky135$Small fibrotic kidneys make biopsy low yield and risky$ky135$,
  $ex135$Years of a rising creatinine with small echogenic kidneys means chronic scarring. Biopsy is not recommended when ultrasound shows small fibrotic kidneys, because the bleeding risk outweighs the chance of a result that changes care. Echogenic small kidneys are not the picture of an acute recoverable disease. Absent casts do not make a biopsy mandatory. The history is years of decline, not a short illness. Small scarred kidneys are a poor specimen, not the safest or highest-yield tissue.$ex135$,
  2,
  $dm135$respiratory-renal$dm135$,
  $tp135$aki-ckd-electrolytes$tp135$,
  $su135$https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease$su135$,
  $sl135$Chronic Kidney Disease, Merck Manual Professional Edition: biopsy is not recommended for small fibrotic kidneys$sl135$,
  $sq135$The definitive diagnostic tool is renal biopsy , but it is not recommended when ultrasound indicates small, fibrotic kidneys; high procedural risk outweighs low diagnostic yield.$sq135$,
  $ch135$dfe608e2e4888369870c9511cc28b68d56072a3bf7d36b115b21e9a430935d35$ch135$,
  true,
  $ref135$[{"label":"Chronic Kidney Disease, Merck Manual Professional Edition: biopsy is not recommended for small fibrotic kidneys","url":"https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease"}]$ref135$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id136$b1x6970a37f4ead240bcb74de12$id136$,
  $fx136$re-rate|rewrite$fx136$,
  $sc136$A 64-year-old man has a red, hot first metatarsophalangeal joint. Needle aspiration shows needle-shaped negatively birefringent crystals. The eGFR is 28 mL/min/1.73 m². He is not on urate-lowering therapy. There is no infection.$sc136$,
  $qu136$Which drug is most appropriate for this flare?$qu136$,
  $op136${"options":["Oral prednisone for this acute flare","Indomethacin started for this acute flare","Allopurinol started for this acute flare","Probenecid started for this acute flare","Antibiotics for six weeks of therapy"],"blueprintTopic":"rheumatology-autoimmune","blueprintSystem":"msk-skin"}$op136$,
  $ky136$Oral prednisone for this acute flare$ky136$,
  $ex136$Needle-shaped negatively birefringent crystals in a hot first metatarsophalangeal joint are an acute gout flare, and oral prednisone is a glucocorticoid used to treat that flare. Indomethacin can raise the creatinine, which matters when renal disease is already present at an eGFR of 28. Allopurinol lowers urate production but does not end the flare. Probenecid increases urate excretion as prevention, not as treatment of the inflamed joint. Antibiotics treat infection, which the crystals have excluded.$ex136$,
  2,
  $dm136$msk-skin$dm136$,
  $tp136$rheumatology-autoimmune$tp136$,
  $su136$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout$su136$,
  $sl136$Gout, Merck Manual Professional Edition: glucocorticoids treat acute flares; NSAIDs can raise creatinine when renal disease is present$sl136$,
  $sq136$Glucocorticoids are used to treat acute flares.$sq136$,
  $ch136$9cdcb846b7922b31e5f486fff98a2afbf839da5dd4549197492e9e997225f458$ch136$,
  true,
  $ref136$[{"label":"Gout, Merck Manual Professional Edition: glucocorticoids treat acute flares; NSAIDs can raise creatinine when renal disease is present","url":"https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$ref136$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id137$b3xc262bbced297ab7e8a9a958f$id137$,
  $fx137$re-rate|rewrite$fx137$,
  $sc137$A 27-year-old man with Crohn disease has a draining perianal fistula. Imaging shows no abscess. He is not septic. A colleague wants a long course of prednisone as the treatment.$sc137$,
  $qu137$Which therapy is most appropriate for the fistula?$qu137$,
  $op137${"options":["TNF inhibitor plus metronidazole and ciprofloxacin","Prolonged prednisone course for this perianal fistula","Mesalamine suppositories for this perianal tract","Proctectomy as the initial operation for the tract","Observation until a perianal abscess is obvious"],"blueprintTopic":"ibd-mechanisms","blueprintSystem":"gastrointestinal"}$op137$,
  $ky137$TNF inhibitor plus metronidazole and ciprofloxacin$ky137$,
  $ex137$A perianal Crohn fistula is treated initially with a TNF inhibitor, and metronidazole plus ciprofloxacin are added to that regimen. Imaging shows no abscess and he is not septic, so this medical regimen can start now. A prolonged prednisone course is not the initial treatment of a perianal fistula. Mesalamine suppositories do not close the tract. Proctectomy is not the first operation when there is no abscess. Waiting until an abscess appears delays therapy that should begin now.$ex137$,
  2,
  $dm137$gastrointestinal$dm137$,
  $tp137$ibd-mechanisms$tp137$,
  $su137$https://www.merckmanuals.com/professional/gastrointestinal-disorders/inflammatory-bowel-disease-ibd/crohn-disease$su137$,
  $sl137$Crohn Disease, Merck Manual Professional Edition: perianal fistulas are started on a TNF inhibitor, with antibiotics added$sl137$,
  $sq137$Patients who have perianal fistulas are treated initially with a TNF inhibitor (eg, infliximab or adalimumab ) ( 1 ).$sq137$,
  $ch137$5aa04bbce0ff8ef900d63b115a01dbf1f55ccedb1d11bbed6c6ce972e67ccd82$ch137$,
  true,
  $ref137$[{"label":"Crohn Disease, Merck Manual Professional Edition: perianal fistulas are started on a TNF inhibitor, with antibiotics added","url":"https://www.merckmanuals.com/professional/gastrointestinal-disorders/inflammatory-bowel-disease-ibd/crohn-disease"}]$ref137$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id138$b3xcd2bb39ed5c3648a1c123ab4$id138$,
  $fx138$re-rate|rewrite$fx138$,
  $sc138$A 62-year-old man is day 2 after an anterior infarct. He has positional chest pain, a pericardial rub, and a fever of 38.2°C. The ECG shows diffuse ST elevation that was not on the post-procedure tracing. Blood pressure is 128/76 mm Hg and the neck veins are flat. He is already taking dual antiplatelet therapy. A colleague wants to add a heparin infusion for the pain.$sc138$,
  $qu138$Which added treatment is most appropriate?$qu138$,
  $op138${"options":["Higher anti-inflammatory doses of aspirin","Continuous intravenous heparin for the pain","Fibrinolytic therapy for this chest pain","Surgical pericardial drainage at this time","Broad-spectrum antibiotics for pericarditis"],"blueprintTopic":"acs-management","blueprintSystem":"cardiovascular"}$op138$,
  $ky138$Higher anti-inflammatory doses of aspirin$ky138$,
  $ex138$Positional pain, a rub, fever, and new diffuse ST elevation on day 2 after infarction are early postinfarction pericarditis, and aspirin or another NSAID usually relieves the symptoms. A heparin infusion is not that treatment, and hemorrhagic pericarditis can complicate this early phase. Fibrinolysis is for coronary occlusion, not a diffuse pericardial rub. A blood pressure of 128/76 mm Hg and flat neck veins do not show tamponade that needs surgical drainage. Nothing in the story suggests bacterial pericarditis.$ex138$,
  2,
  $dm138$cardiovascular$dm138$,
  $tp138$acs-management$tp138$,
  $su138$https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/complications-of-acute-coronary-syndromes$su138$,
  $sl138$Complications of Acute Coronary Syndromes, Merck Manual Professional Edition: aspirin or an NSAID relieves postinfarction pericarditis$sl138$,
  $sq138$Aspirin or another nonsteroidal anti-inflammatory drug (NSAID) usually relieves symptoms.$sq138$,
  $ch138$a526a5a1549e9e3224359ca7b5b8fe007a1f89d2f20a7cfebd07a6cca252ac19$ch138$,
  true,
  $ref138$[{"label":"Complications of Acute Coronary Syndromes, Merck Manual Professional Edition: aspirin or an NSAID relieves postinfarction pericarditis","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/complications-of-acute-coronary-syndromes"}]$ref138$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id139$b1x20c9c71edb762b6e5ef2f21e$id139$,
  $fx139$re-rate|rewrite$fx139$,
  $sc139$A 72-year-old man has an incidental infrarenal abdominal aortic aneurysm measuring 5.6 cm. He has no back pain and no tenderness. He walks a mile without angina. The creatinine is 1.0 mg/dL. He smoked for 40 years and quit last year.$sc139$,
  $qu139$Which plan is the most appropriate next step?$qu139$,
  $op139${"options":["Referral for elective aneurysm repair","Repeat imaging of the aorta in five years","A six-week course of directed antibiotics","Catheter-directed thrombolysis of the sac","Bed rest until the sac diameter is 8 cm"],"blueprintTopic":"pre-post-op-care","blueprintSystem":"multisystem"}$op139$,
  $ky139$Referral for elective aneurysm repair$ky139$,
  $ex139$In a man, repair is indicated when an abdominal aortic aneurysm is larger than 5.5 cm and the risk of surgery is lower than the risk of rupture. He walks a mile without angina and his creatinine is 1.0 mg/dL, so elective repair is appropriate for this 5.6 cm aneurysm. Repeating imaging in five years is surveillance for a smaller sac. Six weeks of antibiotics would treat an infected aneurysm, which this painless incidental finding is not. Catheter-directed thrombolysis does not repair the wall. Bed rest until the diameter is 8 cm waits past the size at which repair is indicated.$ex139$,
  1,
  $dm139$multisystem$dm139$,
  $tp139$pre-post-op-care$tp139$,
  $su139$https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/abdominal-aortic-aneurysms-aaa$su139$,
  $sl139$Abdominal Aortic Aneurysms, Merck Manual Professional Edition: repair above 5.5 cm in a man at acceptable operative risk$sl139$,
  $sq139$When the aneurysm becomes > 5 cm in a female or > 5.5 cm in a male and if risk of perioperative complications is lower than estimated risk of rupture, AAA repair is indicated ( 1 ).$sq139$,
  $ch139$ee2f0c960402e1767e06c87babacad139fc23df082ea7b7f4793ab69a7f0d4f8$ch139$,
  true,
  $ref139$[{"label":"Abdominal Aortic Aneurysms, Merck Manual Professional Edition: repair above 5.5 cm in a man at acceptable operative risk","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/abdominal-aortic-aneurysms-aaa"}]$ref139$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id140$b1x2c1b608b49804eef87b7ecde$id140$,
  $fx140$re-rate|rewrite$fx140$,
  $sc140$A 29-year-old woman has just delivered the placenta. She is bleeding briskly and the uterus is soft. Estimated loss is 900 mL. There is no cervical laceration. Blood pressure is 100/60 mm Hg. She has no hypertension.$sc140$,
  $qu140$Which plan is the most appropriate next step?$qu140$,
  $op140${"options":["Uterine massage plus oxytocin","Proceed directly to hysterectomy","Uterine artery embolization first","Continued observation of bleeding","Antibiotics without a uterotonic"],"blueprintTopic":"labor-delivery","blueprintSystem":"reproductive-endocrine"}$op140$,
  $ky140$Uterine massage plus oxytocin$ky140$,
  $ex140$Brisk bleeding from a soft uterus just after the placenta, with no cervical laceration, is uterine atony. Hemostasis is attempted first with uterine massage and intravenous oxytocin. Hysterectomy is not the opening move while the blood pressure is 100/60 mm Hg. Uterine artery embolization skips the uterotonic. Observation lets the bleeding continue. Antibiotics do not make a soft uterus contract.$ex140$,
  1,
  $dm140$reproductive-endocrine$dm140$,
  $tp140$labor-delivery$tp140$,
  $su140$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage$su140$,
  $sl140$Postpartum Hemorrhage, Merck Manual Professional Edition: massage and oxytocin for uterine atony$sl140$,
  $sq140$Hemostasis is attempted by bimanual uterine massage and IV oxytocin infusion.$sq140$,
  $ch140$b8eaf601437569ddf1d58d6ffc22557503495c1c57dfa5e73a79546bf47f924d$ch140$,
  true,
  $ref140$[{"label":"Postpartum Hemorrhage, Merck Manual Professional Edition: massage and oxytocin for uterine atony","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage"}]$ref140$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id141$b3x2160c034da8cfbc5a964c930$id141$,
  $fx141$re-rate|rewrite$fx141$,
  $sc141$A 68-year-old man with septic shock oozes from a line and a venipuncture site. Fibrinogen is 80 mg/dL, platelets are 40,000/mm³, and the INR is 2.2. The D-dimer is high. He is still hypotensive from the infection.$sc141$,
  $qu141$Which plan addresses the bleeding?$qu141$,
  $op141${"options":["Treat the sepsis and replace consumed factors","Heparin infusion without treating the sepsis","Platelet transfusion without treating sepsis","Vitamin K therapy without treating the sepsis","Observation despite fibrinogen of 80 mg/dL"],"blueprintTopic":"coagulation-cascade","blueprintSystem":"blood-lymph-immune"}$op141$,
  $ky141$Treat the sepsis and replace consumed factors$ky141$,
  $ex141$Oozing from several sites with a low fibrinogen, low platelets, a high INR, and a high D-dimer during septic shock is disseminated intravascular coagulation. The cause is corrected and the consumed platelets, clotting factors, and fibrinogen are replaced while he is bleeding. Heparin is not indicated in rapidly evolving DIC with bleeding, and an infusion that leaves the sepsis untreated misses the driver. Platelet transfusion without treating the infection replaces only one consumed element and leaves the cause in place. Vitamin K repletes a warfarin or nutritional deficit, not factors that are being consumed. Watching a fibrinogen of 80 mg/dL while he oozes does not replace what he has lost.$ex141$,
  2,
  $dm141$blood-lymph-immune$dm141$,
  $tp141$coagulation-cascade$tp141$,
  $su141$https://www.merckmanuals.com/professional/hematology/coagulation-disorders/disseminated-intravascular-coagulation-dic$su141$,
  $sl141$Disseminated Intravascular Coagulation, Merck Manual Professional Edition: treat the cause and replace consumed factors when bleeding$sl141$,
  $sq141$Treatment includes correction of the cause and replacement of platelets, coagulation factors (in fresh frozen plasma), and fibrinogen (in cryoprecipitate) to control severe bleeding.$sq141$,
  $ch141$207b23ca5f6434d2bf8cb99a4d3272c929fc89a7ce6d8ab05790fb127bda9d52$ch141$,
  true,
  $ref141$[{"label":"Disseminated Intravascular Coagulation, Merck Manual Professional Edition: treat the cause and replace consumed factors when bleeding","url":"https://www.merckmanuals.com/professional/hematology/coagulation-disorders/disseminated-intravascular-coagulation-dic"}]$ref141$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id142$b7x8bd39baeb93f70356d62f1ad$id142$,
  $fx142$re-rate|rewrite$fx142$,
  $sc142$A 29-year-old patient in labor has abrupt drops in the fetal heart rate that look like V shapes. They improve when she rolls onto her side. A classmate only turns up the oxygen and leaves her on her back. The tracing between the drops is reassuring. The membranes are ruptured.$sc142$,
  $qu142$Which statement explains these decelerations?$qu142$,
  $op142${"options":["Position change relieves this cord compression","These abrupt drops are late placental decelerations","A reassuring baseline means overt cord prolapse","Ruptured membranes make repositioning irrelevant","Oxygen flow is what relieves the cord pressure"],"blueprintTopic":"labor-delivery","blueprintSystem":"reproductive-endocrine"}$op142$,
  $ky142$Position change relieves this cord compression$ky142$,
  $ex142$Abrupt V-shaped drops are variable decelerations, a pattern that can reflect cord compression, and changing her position is what may take the pressure off the cord. The drops improve when she rolls, and the tracing between them is reassuring, so this is not a persistent prolapse that requires immediate cesarean delivery. Late decelerations are gradual and tied to placental flow, not abrupt drops that resolve with turning. Ruptured membranes do not make her position irrelevant. Turning up the oxygen while she stays on her back does not move the cord.$ex142$,
  2,
  $dm142$reproductive-endocrine$dm142$,
  $tp142$labor-delivery$tp142$,
  $su142$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/umbilical-cord-prolapse$su142$,
  $sl142$Umbilical Cord Prolapse, Merck Manual Professional Edition: variable decelerations suggest cord compression, and position change may relieve it$sl142$,
  $sq142$Changing the woman’s position may relieve pressure on the cord; however, if the abnormal fetal heart rate pattern persists, immediate cesarean delivery is necessary.$sq142$,
  $ch142$5835395de289a570e9b98300b12acee910007bd1283da9054e3c27361234a9c0$ch142$,
  true,
  $ref142$[{"label":"Umbilical Cord Prolapse, Merck Manual Professional Edition: variable decelerations suggest cord compression, and position change may relieve it","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/umbilical-cord-prolapse"}]$ref142$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id143$b4xefc2dc58903d538c408d7ac8$id143$,
  $fx143$re-rate|rewrite$fx143$,
  $sc143$A 70-year-old man with atrial fibrillation and a CHA2DS2-VASc score of 1 stops warfarin for three days around a colonoscopy. He has no prior stroke and no mechanical valve. A colleague orders a heparin bridge for the entire gap. He has had no bleeding.$sc143$,
  $qu143$Why is heparin bridging the wrong addition?$qu143$,
  $op143${"options":["His short-gap clot risk is too low to justify bridging","No prior stroke means heparin bridging is mandatory here","This three-day warfarin hold requires a heparin bridge","A score of 1 matches a mechanical mitral valve risk","Colonoscopy itself creates a high risk of arterial clot"],"blueprintTopic":"arrhythmias-management","blueprintSystem":"cardiovascular"}$op143$,
  $ky143$His short-gap clot risk is too low to justify bridging$ky143$,
  $ex143$Routine heparin bridging is not recommended when the perioperative risk of thromboembolism is low or moderate. A CHA2DS2-VASc score of 1, with no prior stroke and no mechanical valve, puts him in that lower-risk group for a brief warfarin hold. The absence of a prior stroke is a reason to skip the bridge, not a reason to require it. A score of 1 is not the risk of a mechanical mitral valve, for which bridging is considered. A three-day hold for colonoscopy does not itself create a high risk of arterial clotting.$ex143$,
  2,
  $dm143$cardiovascular$dm143$,
  $tp143$arrhythmias-management$tp143$,
  $su143$https://www.merckmanuals.com/professional/special-subjects/care-of-the-surgical-patient/perioperative-management$su143$,
  $sl143$Perioperative Management, Merck Manual Professional Edition: do not routinely bridge low-to-moderate thromboembolic risk$sl143$,
  $sq143$Routine bridging therapy with heparin is not recommended for patients undergoing surgery who are at low‐to‐moderate risk of thromboembolism.$sq143$,
  $ch143$5b43a02389b297ee93e31e2e62cb58b8e8d92021885f822525b60cacf712216e$ch143$,
  true,
  $ref143$[{"label":"Perioperative Management, Merck Manual Professional Edition: do not routinely bridge low-to-moderate thromboembolic risk","url":"https://www.merckmanuals.com/professional/special-subjects/care-of-the-surgical-patient/perioperative-management"}]$ref143$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id144$b8xc8b54e3b5440548b44393d0a$id144$,
  $fx144$re-rate|rewrite$fx144$,
  $sc144$A 4-year-old has repeated syllables for two months. He is not frustrated, he plays with friends, and his other language is full sentences. The repetitions are mild. Hearing is normal. A classmate starts intensive daily speech therapy this week.$sc144$,
  $qu144$Why is intensive therapy this week the wrong urgency?$qu144$,
  $op144${"options":["Mild repetitions often settle without daily therapy","Two months of repetition means a permanent stutter","Playing with peers means daily therapy is required","Normal hearing means these repetitions are severe","Calm behavior means a daily program is still required"],"blueprintTopic":"developmental-milestones","blueprintSystem":"human-development"}$op144$,
  $ky144$Mild repetitions often settle without daily therapy$ky144$,
  $ex144$Most children outgrow stuttering, and about three quarters recover. Evaluation is generally recommended when stuttering has lasted 3 to 6 months or the child struggles, and this boy has had only mild repetitions for two months without frustration. Two months of mild repetition is not a permanent stutter. Playing with peers shows he is not avoiding speech and does not require daily therapy this week. Normal hearing removes a hearing cause and does not make the repetitions severe. Calm behavior without frustration is a reason to wait, not a reason to start a daily program.$ex144$,
  2,
  $dm144$human-development$dm144$,
  $tp144$developmental-milestones$tp144$,
  $su144$https://www.nidcd.nih.gov/health/stuttering$su144$,
  $sl144$Stuttering, NIDCD: most children outgrow stuttering; evaluate after 3 to 6 months or if the child struggles$sl144$,
  $sq144$Most children outgrow stuttering.$sq144$,
  $ch144$75693179f3ac5ce6036ca75d31240f9a8a16b51b078bae65fbbac314dd04b150$ch144$,
  true,
  $ref144$[{"label":"Stuttering, NIDCD: most children outgrow stuttering; evaluate after 3 to 6 months or if the child struggles","url":"https://www.nidcd.nih.gov/health/stuttering"}]$ref144$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id145$b6x843004d64ee739a71a249c54$id145$,
  $fx145$re-rate|rewrite$fx145$,
  $sc145$A 72-year-old woman has an acute ischemic stroke. Blood pressure is 170/95 mm Hg. She is not a candidate for thrombolysis. A classmate lowers the pressure to 120/70 mm Hg in the first hour. The arm weakness deepens as the pressure falls.$sc145$,
  $qu145$Why did the arm worsen as the pressure was lowered?$qu145$,
  $op145${"options":["Perfusion of the ischemic brain needed the higher pressure","Worsening during the drop means the pressure was still too high","A systolic target near 120 protects the tissue at the edge","Ischemic stroke needs a normal pressure in the first hour","A reading of 170/95 must be lowered when lysis is withheld"],"blueprintTopic":"stroke-management","blueprintSystem":"behavioral-nervous"}$op145$,
  $ky145$Perfusion of the ischemic brain needed the higher pressure$ky145$,
  $ex145$Perfusion of ischemic brain may require a higher pressure because autoregulation is lost, so the pressure is not driven down in the first day unless it is at least 220 mm Hg systolic or 120 mm Hg diastolic, or the patient is receiving reperfusion therapy. She is not a thrombolysis candidate, and 170/95 mm Hg is below that threshold. The arm worsened as the pressure fell, which is the result of removing the pressure the ischemic tissue was using. That worsening does not mean the pressure was still too high, and a systolic target near 120 mm Hg is not protective in this first hour. Withholding thrombolysis is not a reason to normalize a pressure of 170/95 mm Hg.$ex145$,
  2,
  $dm145$behavioral-nervous$dm145$,
  $tp145$stroke-management$tp145$,
  $su145$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su145$,
  $sl145$Ischemic Stroke, Merck Manual Professional Edition: do not lower blood pressure in acute ischemic stroke except above 220/120 or for reperfusion therapy$sl145$,
  $sq145$Perfusion of an ischemic brain area may require an elevated blood pressure (BP) because autoregulation is lost; thus, BP should not be decreased except in the following cases:$sq145$,
  $ch145$cb4b11224a6020949ddefa6377d76ddf48cccbb8559856973e367f9c82d71081$ch145$,
  true,
  $ref145$[{"label":"Ischemic Stroke, Merck Manual Professional Edition: do not lower blood pressure in acute ischemic stroke except above 220/120 or for reperfusion therapy","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref145$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id146$b8x240aa2727ea35285fbead1bf$id146$,
  $fx146$re-rate|rewrite$fx146$,
  $sc146$A 22-year-old patient is hot, agitated, and tachycardic, with wet skin and normal-sized pupils. Bowel sounds are present. He has been at a party. The skin is sweaty rather than flushed and dry. A classmate prepares physostigmine, the antidote used for anticholinergic poisoning.$sc146$,
  $qu146$Why is that antidote the wrong drug?$qu146$,
  $op146${"options":["Sweat and bowel sounds show cholinergic synapses still work","Wet skin is the expected finding in anticholinergic poisoning","Normal pupils plus sweating indicate muscarinic blockade","Agitation after a party establishes anticholinergic poisoning","Present bowel sounds indicate that the intestine is paralyzed"],"blueprintTopic":"autonomic-pharmacology","blueprintSystem":"multisystem"}$op146$,
  $ky146$Sweat and bowel sounds show cholinergic synapses still work$ky146$,
  $ex146$Anticholinergic poisoning causes warm dry skin, dilated pupils, urinary retention, and ileus, and physostigmine is the antidote for that pattern. This patient is sweaty, has normal-sized pupils, and has bowel sounds, so the synapses that pattern shuts off are still working. Wet skin is the opposite of the dry skin of anticholinergic poisoning. Normal pupils plus sweat are not muscarinic blockade. Agitation after a party does not by itself establish anticholinergic poisoning. Bowel sounds that are present mean the intestine is not paralyzed.$ex146$,
  3,
  $dm146$multisystem$dm146$,
  $tp146$autonomic-pharmacology$tp146$,
  $su146$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/general-principles-of-poisoning$su146$,
  $sl146$General Principles of Poisoning, Merck Manual Professional Edition: anticholinergic toxidrome is dry skin, mydriasis, and ileus; physostigmine is the antidote$sl146$,
  $sq146$Tachycardia, hyperthermia, mydriasis, warm and dry skin, urinary retention, ileus, delirium$sq146$,
  $ch146$17202c4416a88aaeecce5eee62b46add72a11db83d5c9352f5268849e53d6da9$ch146$,
  true,
  $ref146$[{"label":"General Principles of Poisoning, Merck Manual Professional Edition: anticholinergic toxidrome is dry skin, mydriasis, and ileus; physostigmine is the antidote","url":"https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/general-principles-of-poisoning"}]$ref146$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id147$cmr88s2ys00u01yr9omx3g3zw$id147$,
  $fx147$re-rate|rewrite$fx147$,
  $sc147$A 30-year-old man is brought to the emergency department after a motorcycle crash. He is conscious and in severe pain. Blood pressure is 90/60 mm Hg, heart rate is 120 beats/min, and respiratory rate is 28 breaths/min. FAST shows free intraperitoneal fluid. He takes lisinopril for hypertension.$sc147$,
  $qu147$Which plan is most appropriate?$qu147$,
  $op147${"options":["Immediate exploratory laparotomy for shock","Intravenous crystalloid and no laparotomy","Abdominal CT before the operative decision","Intravenous antibiotics and no laparotomy"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"trauma-atls","blueprintSystem":"multisystem","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783282762745","qcScore":8.4,"slotIndex":31,"stepLevel":"step2","examNumber":9210,"generatedAt":"2026-07-05T20:20:39.595Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$op147$,
  $ky147$Immediate exploratory laparotomy for shock$ky147$,
  $ex147$A blood pressure of 90/60 mm Hg, a heart rate of 120 beats/min, and free intraperitoneal fluid mean hemodynamic instability from abdominal bleeding. Patients with hemodynamic instability due to abdominal trauma go to exploratory laparotomy rather than further testing. Intravenous crystalloid without laparotomy does not stop the hemorrhage. Computed tomography means leaving the resuscitation area and is for a more stable patient. Antibiotics without laparotomy do not control bleeding. Lisinopril does not explain shock together with intraperitoneal blood.$ex147$,
  2,
  $dm147$multisystem$dm147$,
  $tp147$trauma-atls$tp147$,
  $su147$https://www.merckmanuals.com/professional/injuries-poisoning/abdominal-trauma/overview-of-abdominal-trauma$su147$,
  $sl147$Overview of Abdominal Trauma, Merck Manual Professional Edition: hemodynamic instability from abdominal trauma goes to laparotomy rather than more testing$sl147$,
  $sq147$a few patients require exploratory laparotomy rather than testing, including those with: Peritonitis Hemodynamic instability due to abdominal trauma$sq147$,
  $ch147$9b8a020ef8248a821b80862316ee3b855af98d93e8da90da65279a4d3154e227$ch147$,
  true,
  $ref147$[{"label":"Overview of Abdominal Trauma, Merck Manual Professional Edition: hemodynamic instability from abdominal trauma goes to laparotomy rather than more testing","url":"https://www.merckmanuals.com/professional/injuries-poisoning/abdominal-trauma/overview-of-abdominal-trauma"}]$ref147$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id148$cmrtexhyh000c1y30m0t8lovi$id148$,
  $fx148$re-rate|rewrite$fx148$,
  $sc148$A 5-year-old girl has had a fever of 39.5°C for two days, a sore throat, and poor appetite. She is irritable. The pharynx is red, the tongue is strawberry red, and a diffuse sandpaper-textured rash covers the trunk while she is still febrile. There is no conjunctival injection, no swelling of the hands or feet, and no vesicles on the palms, soles, or oral mucosa. The leukocyte count is elevated with a left shift.$sc148$,
  $qu148$Which diagnosis is most likely?$qu148$,
  $op148${"options":["Acute streptococcal scarlet fever","Kawasaki mucocutaneous syndrome","Roseola after fever defervescence","Enteroviral hand-foot-mouth illness"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"human-development","blueprintTopic":"pediatric-infections","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784562899459","examNumber":9500,"slotIndex":30,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-20T15:55:52.460Z"}}$op148$,
  $ky148$Acute streptococcal scarlet fever$ky148$,
  $ex148$A sandpaper rash during fever, pharyngitis, and a strawberry tongue in a school-aged child is scarlet fever, which usually follows a pharyngeal streptococcal infection. Kawasaki disease begins with fever lasting at least 5 days and usually includes conjunctival injection, which this two-day illness without red eyes does not show. Roseola produces the rash as the fever breaks and is typical from 6 months to 3 years of age, not a sandpaper rash in a still-febrile 5-year-old. Hand-foot-and-mouth disease causes vesicles on the hands, feet, and mouth, which are absent. The neutrophilic leukocytosis fits bacterial pharyngitis with this rash rather than those viral illnesses.$ex148$,
  3,
  $dm148$human-development$dm148$,
  $tp148$pediatric-infections$tp148$,
  $su148$https://www.merckmanuals.com/professional/infectious-diseases/gram-positive-cocci/streptococcal-infections$su148$,
  $sl148$Streptococcal Infections, Merck Manual Professional Edition: scarlet fever follows pharyngeal streptococcal infection and has a sandpaper rash$sl148$,
  $sq148$Scarlet fever (sometimes called scarlatina), a predominantly childhood disease, usually follows a pharyngeal streptococcal infection; less commonly, it follows streptococcal infections at other sites (eg, the skin).$sq148$,
  $ch148$58f049d5ee7b18bfe277ffd907d42838761759f53a754a4ef7729fa6ea340678$ch148$,
  true,
  $ref148$[{"label":"Streptococcal Infections, Merck Manual Professional Edition: scarlet fever follows pharyngeal streptococcal infection and has a sandpaper rash","url":"https://www.merckmanuals.com/professional/infectious-diseases/gram-positive-cocci/streptococcal-infections"}]$ref148$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id149$cmr4gwhst000q1ydefvjtj6c5$id149$,
  $fx149$re-rate|rewrite$fx149$,
  $sc149$A 6-month-old boy has had a fever of 39.5°C for two days, poor feeding, and vomiting. He is lethargic but responsive. Heart rate is 160 beats/min and respiratory rate is 40 breaths/min. The anterior fontanelle is bulging and the neck is stiff. He is up to date on vaccinations. The leukocyte count is 15,000/mm³ with 80% neutrophils.$sc149$,
  $qu149$Which initial plan is most appropriate?$qu149$,
  $op149${"options":["Lumbar puncture plus prompt intravenous antibiotics","Antipyretics and observation for twenty-four hours","Blood cultures, with treatment deferred until results","Intravenous fluid without cultures or antibiotics"],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"pediatric-infections","blueprintSystem":"human-development","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783054430164","qcScore":7.6,"slotIndex":26,"stepLevel":"step2","examNumber":9201,"generatedAt":"2026-07-03T04:58:30.961Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$op149$,
  $ky149$Lumbar puncture plus prompt intravenous antibiotics$ky149$,
  $ex149$A bulging fontanelle, a stiff neck, lethargy, and fever at 6 months mean bacterial meningitis is suspected. Lumbar puncture is performed when meningitis is suspected, and empiric intravenous antibiotics directed at the usual pathogens in infants older than 3 months are started promptly. Antipyretics and a day of observation leave meningitis untreated. Deferring treatment until culture results return delays therapy of a rapidly progressive infection. Intravenous fluid without cultures or antibiotics does neither the diagnostic tap nor the treatment. Being up to date on vaccines does not exclude meningitis when these signs are present.$ex149$,
  3,
  $dm149$human-development$dm149$,
  $tp149$pediatric-infections$tp149$,
  $su149$https://www.merckmanuals.com/professional/pediatrics/miscellaneous-bacterial-infections-in-infants-and-children/bacterial-meningitis-in-infants-over-3-months-of-age$su149$,
  $sl149$Bacterial Meningitis in Infants Over 3 Months of Age, Merck Manual Professional Edition: lumbar puncture when meningitis is suspected, plus empiric antibiotics$sl149$,
  $sq149$In general, lumbar puncture should be performed whenever the diagnosis of meningitis is known or suspected in an infant.$sq149$,
  $ch149$1992657daecb542be094ef8fc2a513bfecc8b2a0087cbe60cf2f02c784714291$ch149$,
  true,
  $ref149$[{"label":"Bacterial Meningitis in Infants Over 3 Months of Age, Merck Manual Professional Edition: lumbar puncture when meningitis is suspected, plus empiric antibiotics","url":"https://www.merckmanuals.com/professional/pediatrics/miscellaneous-bacterial-infections-in-infants-and-children/bacterial-meningitis-in-infants-over-3-months-of-age"}]$ref149$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id150$cmrtq0v7s001q1yqcygdc32zd$id150$,
  $fx150$re-rate|rewrite$fx150$,
  $sc150$A 6-month-old girl is in clinic for her scheduled visit. She was born at term, is afebrile, and weighs 7.5 kg. She received hepatitis B vaccine at birth and the routine 2-month and 4-month immunizations. She has no international travel planned. She is due for the vaccines given at 6 months.$sc150$,
  $qu150$Which vaccine is indicated at this visit?$qu150$,
  $op150${"options":["Diphtheria-tetanus-pertussis dose","Measles-mumps-rubella vaccine","Live-attenuated varicella vaccine","Human papillomavirus vaccine now"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"human-development","blueprintTopic":"vaccination-schedules","physicianTask":"clinical-intervention","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9501,"slotIndex":42,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-20T21:10:49.868Z"}}$op150$,
  $ky150$Diphtheria-tetanus-pertussis dose$ky150$,
  $ex150$Diphtheria-tetanus-pertussis vaccine is given at 2, 4, and 6 months, so a dose is due today after the earlier doses. Measles-mumps-rubella vaccine is routinely given at 12 to 15 months and again at 4 to 6 years, and she has no travel planned. Varicella vaccine is given at 12 to 15 months and at 4 to 6 years. Human papillomavirus vaccine is recommended at 11 or 12 years and can start at 9 years, not at 6 months. The birth dose of hepatitis B does not replace the 6-month pertussis-containing dose.$ex150$,
  3,
  $dm150$human-development$dm150$,
  $tp150$vaccination-schedules$tp150$,
  $su150$https://www.merckmanuals.com/professional/infectious-diseases/immunization/diphtheria-tetanus-pertussis-vaccine$su150$,
  $sl150$Diphtheria-Tetanus-Pertussis Vaccine, Merck Manual Professional Edition: DTaP at 2, 4, and 6 months$sl150$,
  $sq150$The DTaP vaccine is administered as a 5-dose primary series during childhood as follows: at age 2 months, 4 months, 6 months, 15 to 18 months, and 4 to 6 years (before school entry).$sq150$,
  $ch150$4efc6d3ffff1ca5b5b7bd7dc632024057fb51e5081d38e40ba41799ce9719019$ch150$,
  true,
  $ref150$[{"label":"Diphtheria-Tetanus-Pertussis Vaccine, Merck Manual Professional Edition: DTaP at 2, 4, and 6 months","url":"https://www.merckmanuals.com/professional/infectious-diseases/immunization/diphtheria-tetanus-pertussis-vaccine"}]$ref150$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id151$cmr4hno9u00821ydej200idic$id151$,
  $fx151$rewrite$fx151$,
  $sc151$A 2-month-old girl is brought to the emergency department with a fever of 38.6°C and irritability. She has fed poorly, and she has had a runny nose for two days. Heart rate is 160 beats/min and respiratory rate is 40 breaths/min. She is lethargic. The leukocyte count is 15,000/mm³ with 80% neutrophils.$sc151$,
  $qu151$Which plan is most appropriate?$qu151$,
  $op151${"options":["Lumbar puncture and empiric intravenous antibiotics","Urine culture, then discharge if the sample is sent","Oral antibiotics and reexamination the next morning","Reassurance and discharge without laboratory testing"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"febrile-infant","blueprintSystem":"human-development","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783055671330","qcScore":8.4,"slotIndex":58,"stepLevel":"step2","examNumber":9203,"generatedAt":"2026-07-03T05:23:56.325Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"diagnosis"}$op151$,
  $ky151$Lumbar puncture and empiric intravenous antibiotics$ky151$,
  $ex151$A lethargic 2-month-old with a temperature of 38.6°C is an ill-appearing febrile infant between 1 and 3 months of age. She is admitted for lumbar puncture and given empiric intravenous antibiotics, and the correct plan states both. Sending a urine culture and discharging her leaves possible meningitis untreated. Oral antibiotics and a visit the next morning are not parenteral therapy in the hospital. A runny nose does not make this lethargic infant safe to send home. Reassurance without testing misses the risk of serious bacterial infection.$ex151$,
  3,
  $dm151$human-development$dm151$,
  $tp151$febrile-infant$tp151$,
  $su151$https://www.merckmanuals.com/professional/pediatrics/symptoms-in-infants-and-children/fever-in-infants-and-children$su151$,
  $sl151$Fever in Infants and Children, Merck Manual Professional Edition: ill-appearing infants 1 to 3 months get lumbar puncture and empiric parenteral antibiotics$sl151$,
  $sq151$These infants should be given age-specific empiric parenteral antibiotic therapy (eg, ceftriaxone ) until serious bacterial infection is ruled out by negative cultures or a specific diagnosis is made.$sq151$,
  $ch151$6dd8db766c93091922722901cd83ff694242fdb07639006be971a468495b4454$ch151$,
  true,
  $ref151$[{"label":"Fever in Infants and Children, Merck Manual Professional Edition: ill-appearing infants 1 to 3 months get lumbar puncture and empiric parenteral antibiotics","url":"https://www.merckmanuals.com/professional/pediatrics/symptoms-in-infants-and-children/fever-in-infants-and-children"}]$ref151$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id152$7bd2087a-93bc-42c1-8ac8-1da0484d6aec$id152$,
  $fx152$re-rate$fx152$,
  $sc152$A 45-year-old woman has a 16-hour history of a headache that began abruptly while she was lifting a suitcase, reached maximum intensity within a minute, and is still severe. She vomited twice and has neck stiffness. She has a history of migraine, but she says this headache is different in onset and intensity. Neurologic examination shows no focal weakness. A high-quality noncontrast CT, read by a neuroradiologist, shows no blood and no mass. She has no bleeding disorder and is not on an anticoagulant. Photophobia is present. A clinician prepares discharge papers for a migraine cocktail.$sc152$,
  $qu152$What is the most appropriate next diagnostic step?$qu152$,
  $op152${"options":["Lumbar puncture","Discharge with oral sumatriptan","MRI of the brain scheduled next week","Start nimodipine without proving blood","Intravenous alteplase"],"blueprintSystem":"behavioral-nervous","taskCategory":"diagnosis","blueprintTopic":"Negative late CT does not exclude subarachnoid hemorrhage","kind":"vignette"}$op152$,
  $ky152$Lumbar puncture$ky152$,
  $ex152$Noncontrast CT is very sensitive for subarachnoid blood in the first hours, but sensitivity falls as blood is cleared and diluted. A negative study 16 hours after a sudden severe headache with meningismus does not exclude aneurysmal subarachnoid hemorrhage. The next diagnostic step is a lumbar puncture, looking for red cells that do not clear between tubes and for xanthochromia. Stopping at the CT is the error this presentation is built to cause, especially when a migraine history offers a comforting alternative. Sumatriptan can worsen vasoconstriction and has no role until bleeding is excluded. Outpatient MRI next week misses a sentinel or active bleed that can rebleed within hours to days. Nimodipine is started after the diagnosis is made, not instead of making it. Alteplase is contraindicated when subarachnoid hemorrhage is the leading concern. If the CT had been performed within about six hours on a modern scanner and read as definitively negative, the conversation about lumbar puncture would be different; at 16 hours that shortcut does not apply.$ex152$,
  3,
  $dm152$behavioral-nervous$dm152$,
  $tp152$seizures-headaches$tp152$,
  NULL,
  NULL,
  NULL,
  $ch152$8eb7c5a6cc9ac6195a7247f4cbca6dea67ed3361921b82d959c0ffed1ad5f458$ch152$,
  true,
  $ref152$[{"url":"https://pubmed.ncbi.nlm.nih.gov/37212182/","label":"Hoh BL et al. 2023 Guideline for the Management of Patients With Aneurysmal Subarachnoid Hemorrhage. Stroke 2023"}]$ref152$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id153$cmr891ee800y41yr96l2sipc7$id153$,
  $fx153$re-rate$fx153$,
  $sc153$A 72-year-old woman with longstanding hypertension is brought in because her thinking has worsened in steps. She had a left hemiparesis two years ago and dysarthria eight months ago, and each time her memory was worse afterward. She is afebrile. Blood pressure is 168/96 mm Hg. CT shows several old lacunar infarcts and no mass or acute hemorrhage.$sc153$,
  $qu153$What is the most likely diagnosis?$qu153$,
  $op153${"options":["Alzheimer's disease","Normal pressure hydrocephalus","Vascular dementia","Delirium"],"distractorRationale":{"Alzheimer's disease":"This option is incorrect because Alzheimer's typically presents with a gradual decline in memory and cognitive function without the acute changes seen in this patient.","Normal pressure hydrocephalus":"This is incorrect as the classic symptoms of gait disturbance, urinary incontinence, and cognitive decline are not fully present.","Delirium":"This option fails because delirium is an acute condition, while this patient has a chronic presentation of cognitive decline."},"clinicalReasoning":"Assess the patient's symptoms of confusion and gait difficulties, analyze the CT findings and lab results, and integrate this information to conclude that vascular dementia is the most likely diagnosis.","keyTakeaways":["When assessing cognitive decline in older adults, consider vascular dementia if there are stepwise changes and gait disturbances."],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"dementia-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783283214476","qcScore":8.5,"slotIndex":59,"stepLevel":"step2","examNumber":9211,"generatedAt":"2026-07-05T20:33:56.207Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$op153$,
  $ky153$Vascular dementia$ky153$,
  $ex153$Stepwise cognitive loss after clinically evident strokes, with hypertension and old lacunes, is vascular dementia. Alzheimer disease is gradual and lacks this stroke history. Normal-pressure hydrocephalus is gait change, incontinence, and dementia without multiple infarcts. She is afebrile and the decline has been over years, so this is not delirium.$ex153$,
  3,
  $dm153$behavioral-nervous$dm153$,
  $tp153$dementia-workup$tp153$,
  NULL,
  NULL,
  NULL,
  $ch153$3232b1b4f6e03b49eb5fdd26aadf510506a8d77f9293a820134baa5c59e5bf93$ch153$,
  true,
  $ref153$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13727566/","label":"Front Pharmacol. 2026. Treatment of vascular dementia based on neuroprotection and neural repair strategies: from pathophysiology to natural products. Vascular dementia (VaD) is a heterogeneous cognitive disorder associated with cerebrovascular pathology and persistent vascular dysfunction."}]$ref153$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id154$607e3ea2-d090-48ca-b372-babe2ed33a6f$id154$,
  $fx154$re-rate$fx154$,
  $sc154$A 42-year-old woman is seen in a breast clinic for an unrelated sebaceous cyst that she wants removed. She has no family history of breast or ovarian cancer, no personal history of atypia, and no chest-wall radiation. She has never had a mammogram. She feels well and the cyst is benign on examination. A clinician tells her screening starts at 50 and that she needs a screening MRI now because she is in a surgical clinic. She has no breast symptoms.$sc154$,
  $qu154$Which screening recommendation is most appropriate?$qu154$,
  $op154${"options":["Start biennial screening mammography","No breast screening until age 50","Screening breast MRI now","Screening breast ultrasound as the first test","BRCA testing for every woman before any mammogram"],"blueprintSystem":"reproductive-endocrine","taskCategory":"diagnosis","blueprintTopic":"Biennial mammography starts at age 40 for average risk","kind":"vignette"}$op154$,
  $ky154$Start biennial screening mammography$ky154$,
  $ex154$Average-risk women are offered biennial screening mammography from age 40 through 74. The older threshold of 50 is out of date for this recommendation, so telling her to wait until 50 withholds screening she should be offered now. MRI and ultrasound are not the first screening tests for an average-risk woman without dense-breast supplemental questions even arising yet, and a sebaceous cyst does not change breast-cancer risk. Universal BRCA testing before any mammogram is not the screening guideline; genetic counseling is for women whose family history meets risk criteria, which hers does not. The cyst can be managed on its own merits and should not be used as a reason to order advanced imaging. Explain the biennial interval, the benefit and the chance of false positives, and how to obtain the mammogram. If a future mammogram is extremely dense, supplemental MRI or ultrasound still lacks a clear recommendation for or against, which is a different conversation from starting ordinary screening. Today the indicated test is a mammogram.$ex154$,
  2,
  $dm154$social-sciences$dm154$,
  $tp154$preventive-screening$tp154$,
  NULL,
  NULL,
  NULL,
  $ch154$4bc1c85189c30b3ab632b97f2e0cc2a7cb9f47a683fced16ed5879e89e6a203e$ch154$,
  true,
  $ref154$[{"url":"https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening","label":"US Preventive Services Task Force. Screening for Breast Cancer. JAMA 2024"}]$ref154$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id155$ca03f35f-ba97-4e38-a900-32719bb60969$id155$,
  $fx155$re-rate$fx155$,
  $sc155$A 35-year-old woman was diagnosed with ITP five weeks ago. A steroid course raised the platelets briefly, then they fell to 22,000/µL. Bleeding is petechiae. The surgical service can do a splenectomy next Tuesday and describes it as definitive first relapse management. Vaccines have not been discussed. She had hoped to avoid an operation this month.$sc155$,
  $qu155$What is the most appropriate surgical plan?$qu155$,
  $op155${"options": ["Splenectomy next Tuesday as the standard first relapse step, as a description of that mechanism alone", "Do not perform splenectomy this early; use medical therapy and delay surgery toward at least a year", "Splenectomy tonight without vaccines because the count is 22,000", "Splenectomy plus ongoing high-dose prednisone for six months", "No medical therapy and no surgery; see her in six months, that procedure rather than a medication"], "blueprintSystem": "blood-lymph-immune", "taskCategory": "clinical-intervention", "blueprintTopic": "itp-delay-splenectomy", "kind": "vignette"}$op155$,
  $ky155$Do not perform splenectomy this early; use medical therapy and delay surgery toward at least a year$ky155$,
  $ex155$The deciding fact is that only five weeks have passed since diagnosis. ASH's second-line comparisons apply to ITP lasting at least three months, and the panel says splenectomy should be delayed for at least a year when possible because spontaneous remission is still common in the first year. A brief steroid response followed by a fall to 22,000 is disappointing and is not a surgical indication at week five. Operating without vaccines ignores the good-practice statement on pre-splenectomy immunization even when surgery is eventually chosen. Adding six months of high-dose prednisone pairs an early operation with the steroid duration the guideline forbids. Watching for six months with no treatment at 22,000 under-treats a count that still merits medical therapy. Continue or adjust medical treatment, plan vaccines only if surgery later becomes the choice, and tell the surgical service the one-year horizon is the recommendation, not a scheduling preference.$ex155$,
  3,
  $dm155$blood-lymph-immune$dm155$,
  $tp155$coagulation-cascade$tp155$,
  NULL,
  NULL,
  NULL,
  $ch155$7146b67f31f49fd9ce9f61735dd3bb372f0b07f5864f918cb138e0c395b1c76d$ch155$,
  true,
  $ref155$[{"url":"https://pubmed.ncbi.nlm.nih.gov/31794604/","label":"Neunert C et al. American Society of Hematology 2019 guidelines for immune thrombocytopenia. Blood Adv 2019"}]$ref155$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id156$cmqxdy83y001d1y79rx61wczw$id156$,
  $fx156$re-rate$fx156$,
  $sc156$A 3-day-old boy is evaluated for jaundice. He was born at 38 weeks' gestation by vaginal delivery after an uncomplicated pregnancy and is breastfeeding well, with adequate wet diapers and stools. Jaundice was first noticed on the second day of life. He is now 72 hours old and appears well. Total serum bilirubin is 12 mg/dL, with a direct bilirubin of 1 mg/dL.$sc156$,
  $qu156$Which of the following is the most appropriate next step in management?$qu156$,
  $op156$["Phototherapy, as a description of that mechanism alone", "Exchange transfusion, as a description of that mechanism alone", "Continue breastfeeding with follow-up bilirubin assessment", "Discontinue breastfeeding and give formula"]$op156$,
  $ky156$Continue breastfeeding with follow-up bilirubin assessment$ky156$,
  $ex156$Correct answer: C. Continue breastfeeding with follow-up bilirubin assessment. A well 38-week infant whose jaundice began on day 2 and whose total serum bilirubin is 12 mg/dL at 72 hours (direct 1 mg/dL, so unconjugated) is well below the phototherapy threshold for his gestational age and age in hours; continued frequent breastfeeding and follow-up bilirubin measurement are appropriate. Why the other options are wrong: A. Phototherapy is not indicated because the bilirubin is below the hour-specific threshold. B. Exchange transfusion is reserved for levels far higher or for signs of acute bilirubin encephalopathy. D. Interrupting breastfeeding is not recommended; he is feeding well, and breastfeeding should continue.$ex156$,
  2,
  $dm156$human-development$dm156$,
  $tp156$pediatric-infections$tp156$,
  NULL,
  NULL,
  NULL,
  $ch156$9c47d9945f6fe82d9768d88456d44c684920737bc8a933d3567541cddcce3d93$ch156$,
  true,
  $ref156$[{"label":"USMLE Content Outline 2026"}]$ref156$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id157$cmr9b2enc01au1ywyqmxwu15x$id157$,
  $fx157$hide dup$fx157$,
  $sc157$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. Her vital signs are stable, with a blood pressure of 120/80 mm Hg and a heart rate of 80 bpm. Upon examination, the cervix is 4 cm dilated, 80% effaced, and the fetal heart rate is within normal limits. She has no significant medical history and is currently taking prenatal vitamins. Her membranes are intact.$sc157$,
  $qu157$Which of the following is the most likely diagnosis?$qu157$,
  $op157${"options":["Active labor","False labor","Preterm labor","Labor dystocia"],"distractorRationale":{"False labor":"This option is incorrect because false labor typically involves irregular contractions without significant cervical change, which is not the case here.","Preterm labor":"This option is incorrect as preterm labor occurs before 37 weeks of gestation, while this patient is at 39 weeks.","Labor dystocia":"This option is incorrect because labor dystocia refers to a situation where labor is not progressing adequately, which is not indicated in this patient's presentation."},"clinicalReasoning":"The patient's presentation of regular contractions and cervical changes indicates active labor. Assessing the timing and nature of contractions, along with cervical dilation, helps differentiate between active labor and other conditions such as false labor or preterm labor. Given the gestational age and clinical findings, the diagnosis of active labor is confirmed.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"ob-labor-ccs","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783347145768","examNumber":9315,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T14:15:56.425Z"}}$op157$,
  $ky157$Active labor$ky157$,
  $ex157$The correct answer is 'Active labor' because the patient is at term (39 weeks), experiencing regular contractions, and has cervical dilation of 4 cm with 80% effacement, indicating that she is in the active phase of labor. 'False labor' is incorrect as the contractions are regular and associated with cervical changes. 'Preterm labor' is not applicable since she is at term. 'Labor dystocia' refers to abnormal labor progress, which does not apply here as the patient is progressing normally.

Clinical reasoning: The patient's presentation of regular contractions and cervical changes indicates active labor. Assessing the timing and nature of contractions, along with cervical dilation, helps differentiate between active labor and other conditions such as false labor or preterm labor. Given the gestational age and clinical findings, the diagnosis of active labor is confirmed.

Why other options are incorrect:
• False labor: This option is incorrect because false labor typically involves irregular contractions without significant cervical change, which is not the case here.
• Preterm labor: This option is incorrect as preterm labor occurs before 37 weeks of gestation, while this patient is at 39 weeks.
• Labor dystocia: This option is incorrect because labor dystocia refers to a situation where labor is not progressing adequately, which is not indicated in this patient's presentation.$ex157$,
  2,
  $dm157$reproductive-endocrine$dm157$,
  $tp157$ob-labor-ccs$tp157$,
  NULL,
  NULL,
  NULL,
  $ch157$577fa350180cf00d8dd711d86e4d1ca2e13a55a2bec5f28c665fc2c85697a2e4$ch157$,
  false,
  $ref157$[{"url":"https://www.nice.org.uk/guidance/ng235/chapter/Recommendations","label":"NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm."}]$ref157$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id158$cmru96r8x004q1y0sx6ptfv5t$id158$,
  $fx158$hide dup$fx158$,
  $sc158$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She reports a history of gestational diabetes managed with diet. On examination, her blood pressure is 120/80 mm Hg, and the fetal heart rate is 140 bpm with moderate variability. A cervical exam reveals 4 cm dilation and 80% effacement. She is concerned about the possibility of needing a cesarean delivery.$sc158$,
  $qu158$Which of the following is the most likely diagnosis?$qu158$,
  $op158${"options":["Active labor","False labor","Preterm labor","Labor dystocia"],"distractorRationale":{"False labor":"This option fails because the patient exhibits regular contractions and cervical changes, which are not characteristic of false labor.","Preterm labor":"This option is incorrect as the patient is at term (39 weeks), making preterm labor irrelevant.","Labor dystocia":"This option is misleading because the patient shows signs of effective labor, not a failure to progress."},"clinicalReasoning":"Assess the patient's symptoms and examination findings, noting the gestational age and cervical dilation. Analyze the regularity of contractions and their association with cervical changes to determine the stage of labor. Integrate this information to conclude that the patient is in active labor, as indicated by the dilation and effacement.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"ob-labor-ccs","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784613610899","examNumber":9302,"slotIndex":58,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T06:08:50.680Z"}}$op158$,
  $ky158$Active labor$ky158$,
  $ex158$The correct answer is 'Active labor' because the patient is at term with regular contractions and cervical changes consistent with the active phase of labor (4 cm dilation and 80% effacement). 'False labor' is incorrect as the contractions are regular and associated with cervical changes. 'Preterm labor' is not applicable since the patient is at 39 weeks of gestation. 'Labor dystocia' refers to a prolonged labor due to inadequate contractions or pelvic issues, which is not indicated in this scenario as contractions are present and effective.

Clinical reasoning: Assess the patient's symptoms and examination findings, noting the gestational age and cervical dilation. Analyze the regularity of contractions and their association with cervical changes to determine the stage of labor. Integrate this information to conclude that the patient is in active labor, as indicated by the dilation and effacement.

Why other options are incorrect:
• False labor: This option fails because the patient exhibits regular contractions and cervical changes, which are not characteristic of false labor.
• Preterm labor: This option is incorrect as the patient is at term (39 weeks), making preterm labor irrelevant.
• Labor dystocia: This option is misleading because the patient shows signs of effective labor, not a failure to progress.$ex158$,
  2,
  $dm158$reproductive-endocrine$dm158$,
  $tp158$ob-labor-ccs$tp158$,
  NULL,
  NULL,
  NULL,
  $ch158$bb3a4003610cb3b83f31333ad67d4fea3456df0ccb5751c8ccc85c76aa008e47$ch158$,
  false,
  $ref158$[{"url":"https://www.nice.org.uk/guidance/ng235/chapter/Recommendations","label":"NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm."}]$ref158$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id159$cmr9buzdm01kf1ywy82opxsb5$id159$,
  $fx159$hide dup$fx159$,
  $sc159$A 45-year-old man with a history of type 2 diabetes presents to the clinic for a routine check-up. He reports increased thirst and frequent urination over the past few days. His vital signs are stable, and laboratory tests reveal a blood glucose level of 350 mg/dL and an HbA1c of 9.5%.$sc159$,
  $qu159$What is the next best step in management?$qu159$,
  $op159${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"nnt-arr","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783348528574","examNumber":9318,"slotIndex":21,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T14:36:28.360Z"},"options":["Start insulin therapy","Increase metformin dosage","Initiate a GLP-1 receptor agonist","Refer to endocrinology"]}$op159$,
  $ky159$Start insulin therapy$ky159$,
  $ex159$Given the patient's significantly elevated blood glucose level and HbA1c, starting insulin therapy is the most appropriate next step in management. This is especially important considering his symptoms of polyuria and polydipsia, which indicate poor glycemic control. Increasing metformin dosage may not be sufficient for such high glucose levels. Initiating a GLP-1 receptor agonist could be considered, but insulin is more effective for immediate control. Referral to endocrinology might be appropriate later, but immediate management is necessary.

Clinical reasoning: Evaluate the patient's symptoms and lab results to determine the most effective management strategy. Analyze the implications of the elevated blood glucose and HbA1c levels to decide on the urgency of treatment. Integrate the standard management protocols for type 2 diabetes to conclude that starting insulin therapy is the best next step.

Why other options are incorrect:
• Increase metformin dosage: While metformin is a first-line treatment for type 2 diabetes, the patient's blood glucose level is too high for this approach alone.
• Initiate a GLP-1 receptor agonist: GLP-1 receptor agonists are effective but not the first-line treatment for immediate glycemic control in this scenario.
• Refer to endocrinology: Referral may be necessary in the future, but immediate management is required to address the patient's hyperglycemia.$ex159$,
  5,
  $dm159$biostats-epi$dm159$,
  $tp159$nnt-arr$tp159$,
  NULL,
  NULL,
  NULL,
  $ch159$9311385f3d67aa8050bffbfbc7a05426629578c91815302aedafb1dc7fc7c523$ch159$,
  false,
  $ref159$[{"url":"https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management","label":"NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets."}]$ref159$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id160$cmr4f6dh701pu1yky397pr5qx$id160$,
  $fx160$hide dup$fx160$,
  $sc160$A 62-year-old woman presents to the emergency department with worsening shortness of breath over the past week. She has a history of hypertension and type 2 diabetes. On examination, her blood pressure is 150/90 mm Hg, heart rate is 110 beats per minute, respiratory rate is 24 breaths per minute, and she has bilateral crackles on lung auscultation. A chest X-ray shows cardiomegaly and pulmonary congestion. Laboratory tests reveal a BNP level of 800 pg/mL.$sc160$,
  $qu160$What is the next best step in management?$qu160$,
  $op160${"options":["Administer furosemide","Start metoprolol","Obtain a cardiac MRI","Initiate digoxin therapy"],"distractorRationale":{"Start metoprolol":"This option fails because beta-blockers are usually not started during acute heart failure exacerbations, as they can worsen symptoms initially.","Obtain a cardiac MRI":"This is incorrect because imaging studies like MRI are not urgent in the acute setting and do not provide immediate therapeutic benefit.","Initiate digoxin therapy":"This option is inappropriate as digoxin is not a first-line agent for acute heart failure management and takes time to have an effect."},"clinicalReasoning":"The patient presents with acute heart failure symptoms, characterized by dyspnea and pulmonary congestion. The elevated BNP level supports this diagnosis. The immediate management should focus on relieving fluid overload, making diuretics the next best step.","keyTakeaways":["When managing acute heart failure with congestion, prioritize diuretics like furosemide for rapid symptom relief."],"kind":"vignette","taskCategory":"interpretation","blueprintTopic":"diagnostic-test-interpretation","blueprintSystem":"pharm-advertising","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783051694611","qcScore":8.2,"slotIndex":58,"stepLevel":"step3","examNumber":9319,"generatedAt":"2026-07-03T04:14:33.968Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"interpretation"}$op160$,
  $ky160$Administer furosemide$ky160$,
  $ex160$## Why this answer is correct
Administering furosemide is the best step to relieve fluid overload in acute heart failure.
• **Furosemide** is a loop diuretic that effectively reduces fluid retention.
• The patient shows signs of **pulmonary congestion** and elevated **BNP**, indicating heart failure.
• Immediate management focuses on **symptom relief** and stabilizing the patient.
**In practice:** In practice, administering furosemide helps quickly alleviate symptoms like shortness of breath, improving patient comfort and oxygenation. This is crucial in emergency settings.
## Why the other options are wrong



**Start metoprolol**
• Trap: Students may think beta-blockers are beneficial for heart failure management.
• Why it fails here: However, beta-blockers are not initiated during acute exacerbations; they can worsen fluid retention initially.
• Remember: This highlights the importance of prioritizing immediate symptom relief in acute heart failure.

**Obtain a cardiac MRI**
• Trap: There may be a belief that advanced imaging is necessary for diagnosis.
• Why it fails here: In acute settings, imaging like MRI is not needed and does not address the immediate management of heart failure.
• Remember: This emphasizes that acute management should focus on treatment rather than diagnostic imaging.

**Initiate digoxin therapy**
• Trap: Some may think digoxin is a quick solution for heart failure symptoms.
• Why it fails here: Digoxin is not a first-line treatment for acute heart failure and takes time to work, making it inappropriate in this scenario.
• Remember: This reinforces the need for immediate action with diuretics rather than slower-acting medications.
## Key takeaway
**When managing acute heart failure with congestion, prioritize diuretics like furosemide for rapid symptom relief.**

**Memory hook:** Remember: In acute heart failure, think 'Furosemide First' for fluid overload.$ex160$,
  3,
  $dm160$biostats-epi$dm160$,
  $tp160$diagnostic-test-interpretation$tp160$,
  NULL,
  NULL,
  NULL,
  $ch160$1e637c39864ab5c5a9e297e828898330a71d737970c8feddb49c748e0f26161b$ch160$,
  false,
  $ref160$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13608559/","label":"Gembillo G et al. Personalized sequential nephron blockade for diuretic resistance in acute decompensated heart failure. J Pers Med. 2026. Loop diuretics have remained the cornerstone of decongestive therapy in acute congestive decompensation."}]$ref160$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id161$cmr98dkkz00h71ywywhzzbztp$id161$,
  $fx161$re-rate|re-tag$fx161$,
  $sc161$A 54-year-old man with type 2 diabetes is brought to the emergency department because he is confused. He has been drinking very little. Mucous membranes are dry. Glucose is 780 mg/dL, sodium is 150 mEq/L, bicarbonate is 23 mEq/L, and serum osmolality is 345 mOsm/kg. Urine ketones are negative.$sc161$,
  $qu161$What is the most likely diagnosis?$qu161$,
  $op161${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-orders-sequence","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783342652092","examNumber":9306,"slotIndex":21,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T12:58:32.287Z"},"options":["Diabetic ketoacidosis","Hyperglycemic hyperosmolar state","Type 2 diabetes mellitus","Hypoglycemia (a low blood glucose)"]}$op161$,
  $ky161$Hyperglycemic hyperosmolar state$ky161$,
  $ex161$Extremely high glucose without ketones, dehydration, and decreased alertness is hyperosmolar hyperglycemic syndrome. Bicarbonate is 23 mEq/L, so this is not ketoacidosis. He is not hypoglycemic. The glucose of 780 with an osmolality of 345 is far beyond ordinary type 2 diabetes follow-up.$ex161$,
  1,
  $dm161$reproductive-endocrine$dm161$,
  $tp161$diabetes-dka-management$tp161$,
  NULL,
  NULL,
  NULL,
  $ch161$3c282a6c5a05d5a3687dc51604e5288b57c00efeab8514857c512fa5be39f619$ch161$,
  true,
  $ref161$[{"url":"https://medlineplus.gov/ency/article/000304.htm","label":"MedlinePlus Medical Encyclopedia. Hyperosmolar hyperglycemic syndrome is extremely high blood glucose without ketones, with dehydration and decreased alertness."}]$ref161$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id162$cmr8atufa000e1yloazrchfw5$id162$,
  $fx162$re-rate|re-tag|rewrite$fx162$,
  $sc162$A 50-year-old woman has fatigue and weight gain over six months. She feels cold, and her hair is thinning. Heart rate is 60 beats/min. The skin is dry, and the deep tendon reflexes relax slowly. The TSH is elevated and the free T4 is low.$sc162$,
  $qu162$Which treatment is most appropriate?$qu162$,
  $op162${"options":["Daily levothyroxine replacement","Methimazole to block new hormone","Propylthiouracil for this patient","Radioactive iodine gland ablation"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"thyroid-disorders","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783286257734","examNumber":9301,"slotIndex":14,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-05T21:18:40.153Z"}}$op162$,
  $ky162$Daily levothyroxine replacement$ky162$,
  $ex162$Fatigue, weight gain, cold intolerance, a slow pulse, dry skin, delayed reflexes, a high TSH, and a low free T4 are primary hypothyroidism. Levothyroxine is the preferred replacement. Methimazole blocks new hormone synthesis and is used when the gland is overactive. Propylthiouracil is another drug for hyperthyroidism, the pattern in which TSH is low and free T4 is high. Radioactive iodine destroys thyroid tissue and would worsen this deficiency.$ex162$,
  1,
  $dm162$reproductive-endocrine$dm162$,
  $tp162$thyroid-disorders$tp162$,
  $su162$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism$su162$,
  $sl162$Hypothyroidism, Merck Manual Professional Edition: levothyroxine is preferred replacement$sl162$,
  $sq162$Levothyroxine is preferred; the usual maintenance dose is 75 to 150 mcg orally once a day, depending on age, body mass index, and absorption (for pediatric treatment, see Hypothyroidism in Infants and Children ).$sq162$,
  $ch162$9061ff2258570e8a1c5c54736d3e29c863727c955daacec53cf1830ed153d415$ch162$,
  true,
  $ref162$[{"label":"Hypothyroidism, Merck Manual Professional Edition: levothyroxine is preferred replacement","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism"}]$ref162$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id163$cmr8qfqdz01nb1ygin9j57cbm$id163$,
  $fx163$re-rate|re-tag|rewrite$fx163$,
  $sc163$A 29-year-old woman has fatigue, weight gain, and cold intolerance. Heart rate is 58 beats/min. The skin is dry and the hair is thinning. The TSH is 8.5 microIU/mL and the free T4 is 0.6 ng/dL.$sc163$,
  $qu163$Which diagnosis fits these laboratory results?$qu163$,
  $op163${"options":["Overt primary hypothyroidism","Subclinical thyroid hypofunction","Primary thyroid hyperfunction","Central hypothyroidism pattern"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"thyroid-disorders","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312326769","examNumber":9319,"slotIndex":44,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-06T04:33:14.901Z"}}$op163$,
  $ky163$Overt primary hypothyroidism$ky163$,
  $ex163$A high TSH with a low free T4 is overt primary hypothyroidism, because the failing thyroid lets TSH rise while circulating hormone falls. Subclinical hypothyroidism would raise the TSH and leave the free T4 normal, which 0.6 ng/dL is not. Primary hyperthyroidism lowers the TSH and raises the free T4. Central hypothyroidism lowers the free T4 while the TSH is low or inappropriately normal, not elevated to 8.5 microIU/mL. The fatigue, weight gain, cold intolerance, and heart rate of 58 beats/min fit the low free T4.$ex163$,
  1,
  $dm163$reproductive-endocrine$dm163$,
  $tp163$thyroid-disorders$tp163$,
  $su163$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism$su163$,
  $sl163$Hypothyroidism, Merck Manual Professional Edition: primary disease raises TSH and lowers free T4; central disease lowers both$sl163$,
  $sq163$serum TSH is always elevated, whereas serum free T4 is low.$sq163$,
  $ch163$0052aa39ab9fa9775103f94a773e81d8af847832b63efb3cc736df956dbe1a62$ch163$,
  true,
  $ref163$[{"label":"Hypothyroidism, Merck Manual Professional Edition: primary disease raises TSH and lowers free T4; central disease lowers both","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hypothyroidism"}]$ref163$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id164$cmr8j9s0302kk1ylon9v0kk9m$id164$,
  $fx164$re-rate|re-tag$fx164$,
  $sc164$A 32-year-old male presents to the emergency department after a motorcycle accident. He is conscious but in severe pain. His vital signs show BP 90/60 mm Hg, HR 120 bpm, and respiratory rate 24 breaths/min. On examination, there is significant abdominal distension and tenderness. A focused assessment with sonography for trauma (FAST) reveals free fluid in the abdomen. Laboratory tests show hemoglobin of 8 g/dL.$sc164$,
  $qu164$What is the next best step in management?$qu164$,
  $op164${"options":["Immediate laparotomy","CT scan of the abdomen","Fluid resuscitation","Observation"],"distractorRationale":{"CT scan of the abdomen":"Incorrect because a CT scan is not appropriate in an unstable patient who requires immediate surgical intervention.","Fluid resuscitation":"While important, it is not the definitive next step in a patient showing signs of hemorrhagic shock with free fluid.","Observation":"Incorrect as the patient's unstable condition necessitates immediate surgical evaluation."},"clinicalReasoning":"Assess the patient's vital signs and physical examination findings to recognize the signs of shock and intra-abdominal injury. Analyze the need for immediate surgical intervention versus other management strategies, and integrate the clinical picture to determine that immediate laparotomy is the most appropriate next step.","kind":"vignette","stepLevel":"step3","blueprintSystem":"surgery","blueprintTopic":"emergency-management","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783300410935","examNumber":9329,"slotIndex":41,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T01:14:37.025Z"}}$op164$,
  $ky164$Immediate laparotomy$ky164$,
  $ex164$In a patient with hypotension, tachycardia, and evidence of free fluid in the abdomen after trauma, immediate laparotomy is warranted to assess for intra-abdominal injuries and control bleeding. While fluid resuscitation is critical, it is not the definitive management in this scenario where there is a high suspicion of significant intra-abdominal injury. A CT scan is contraindicated in unstable patients, and observation is inappropriate given the clinical signs of hemorrhagic shock.

Clinical reasoning: Assess the patient's vital signs and physical examination findings to recognize the signs of shock and intra-abdominal injury. Analyze the need for immediate surgical intervention versus other management strategies, and integrate the clinical picture to determine that immediate laparotomy is the most appropriate next step.

Why other options are incorrect:
• CT scan of the abdomen: Incorrect because a CT scan is not appropriate in an unstable patient who requires immediate surgical intervention.
• Fluid resuscitation: While important, it is not the definitive next step in a patient showing signs of hemorrhagic shock with free fluid.
• Observation: Incorrect as the patient's unstable condition necessitates immediate surgical evaluation.$ex164$,
  2,
  $dm164$multisystem$dm164$,
  $tp164$trauma-atls$tp164$,
  NULL,
  NULL,
  NULL,
  $ch164$51f43fa3a9cbe65cdf6279771604f8493afe5b16dbfad5e6e09ce1de55182c74$ch164$,
  true,
  $ref164$[{"label":"USMLE Content Outline 2026"}]$ref164$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id165$cmr98dnu400i41ywy3m5tkn3v$id165$,
  $fx165$re-tag|rewrite$fx165$,
  $sc165$A 50-year-old woman with hypertension and obesity is seen for a routine visit. She has no symptoms of hyperglycemia. Blood pressure is 140/85 mm Hg and body mass index is 32. A fasting plasma glucose is 110 mg/dL.$sc165$,
  $qu165$Which plan is most appropriate?$qu165$,
  $op165${"kind":"sequential","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"ambulatory-chronic-care","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783342652092","examNumber":9306,"slotIndex":54,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T12:58:32.156Z"},"options":["Diet and activity changes for prediabetes","Metformin started for a diabetes diagnosis","Insulin started for this fasting glucose","Recheck the fasting glucose again next year"]}$op165$,
  $ky165$Diet and activity changes for prediabetes$ky165$,
  $ex165$A fasting plasma glucose of 110 mg/dL sits in the prediabetes range of 100 to 125 mg/dL and is below the diabetes threshold of 126 mg/dL. Progression is delayed by a reduced-calorie eating plan and physical activity on most days, which also addresses a body mass index of 32. Metformin is a question to ask rather than automatic first treatment, and it is not started here as therapy for diabetes. Insulin is not the treatment of an asymptomatic fasting glucose of 110 mg/dL. Waiting a year to repeat the glucose postpones the diet and activity changes.$ex165$,
  2,
  $dm165$multisystem$dm165$,
  $tp165$ambulatory-chronic-care$tp165$,
  $su165$https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-type-2-diabetes$su165$,
  $sl165$Preventing Type 2 Diabetes, NIDDK: reduced-calorie eating and physical activity delay progression; fasting glucose 100 to 125 mg/dL is prediabetes$sl165$,
  $sq165$You can help prevent or delay type 2 diabetes by losing a modest amount of weight by following a reduced-calorie eating plan and being physically active most days of the week.$sq165$,
  $ch165$6cae3aa5d07799ac2883caaec3cf000d3eecf16d15e836bc03ecee9e734cd9a4$ch165$,
  true,
  $ref165$[{"label":"Preventing Type 2 Diabetes, NIDDK: reduced-calorie eating and physical activity delay progression; fasting glucose 100 to 125 mg/dL is prediabetes","url":"https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-type-2-diabetes"}]$ref165$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id166$cmr8cn9a000nh1ylootexq7kj$id166$,
  $fx166$re-tag|rewrite$fx166$,
  $sc166$A 40-year-old woman notices a lump in the right breast. She has no other medical history and takes no medicines. Her mother was diagnosed with breast cancer at age 50. Examination shows a firm, nontender mass in the upper outer quadrant and no lymphadenopathy.$sc166$,
  $qu166$Which test is the most appropriate next step?$qu166$,
  $op166${"options":["Ultrasound to tell a cyst from a solid mass","Genetic counseling before any breast imaging","Needle biopsy before imaging of the mass","Reexamination of the lump in twelve months"],"blueprintTopic":"gyn-cancers","blueprintSystem":"reproductive-endocrine"}$op166$,
  $ky166$Ultrasound to tell a cyst from a solid mass$ky166$,
  $ex166$The first step for a palpable breast mass is to distinguish a cyst from a solid mass, and that is typically done with ultrasound. Genetic counseling does not define the lump, even though her mother had breast cancer at age 50. Needle biopsy before imaging skips the step that separates cysts, which are rarely cancer, from solid masses that then go on to mammography. Reexamining the lump in twelve months delays exclusion of cancer.$ex166$,
  2,
  $dm166$reproductive-endocrine$dm166$,
  $tp166$gyn-cancers$tp166$,
  $su166$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/breast-disorders/breast-masses$su166$,
  $sl166$Breast Masses, Merck Manual Professional Edition: ultrasound is the usual first test to separate a cyst from a solid mass$sl166$,
  $sq166$Typically, this is determined with breast ultrasound ( 1 ).$sq166$,
  $ch166$3140a417bd6d5db167fd36e1103a21ef34ae1b29892387b8551611887a1ec780$ch166$,
  true,
  $ref166$[{"label":"Breast Masses, Merck Manual Professional Edition: ultrasound is the usual first test to separate a cyst from a solid mass","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/breast-disorders/breast-masses"}]$ref166$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id167$cmr8qfqgt01nc1ygicatjc4za$id167$,
  $fx167$re-rate|re-tag|rewrite$fx167$,
  $sc167$A 75-year-old woman is brought to the emergency department after a fall at home. She is confused. Blood pressure is 90/60 mm Hg, heart rate is 110 beats per minute, and urine output is 15 mL per hour. She is afebrile. Serum creatinine is 3.0 mg/dL; two weeks ago it was 0.9 mg/dL. Blood urea nitrogen is 28 mg/dL. Urine microscopy shows many brown granular casts and no white blood cells.$sc167$,
  $qu167$Which of the following is the most likely diagnosis?$qu167$,
  $op167${"options":["Acute ischemic tubular necrosis","Chronic intrinsic kidney disease","Hypovolemic prerenal azotemia","Acute bacterial pyelonephritis"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"aki-ckd-electrolytes","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312326769","examNumber":9319,"slotIndex":45,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:33:14.902Z"}}$op167$,
  $ky167$Acute ischemic tubular necrosis$ky167$,
  $ex167$Hypotension after a fall, oliguria, and a creatinine rise from 0.9 mg/dL to 3.0 mg/dL establish an acute process rather than chronic kidney disease. Brown granular casts and a blood urea nitrogen-to-creatinine ratio below 10 are the sediment and laboratory pattern of renal tubular injury. That pattern after a period of poor perfusion is ischemic acute tubular necrosis. Prerenal azotemia from hypovolemia produces a urea-to-creatinine ratio above 20 and does not produce pigmented granular casts. Pyelonephritis is unlikely in an afebrile patient whose urine contains no white blood cells.$ex167$,
  1,
  $dm167$respiratory-renal$dm167$,
  $tp167$aki-ckd-electrolytes$tp167$,
  $su167$https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki$su167$,
  $sl167$Acute Kidney Injury (AKI) - Merck Manual Professional Edition: brown granular casts indicate renal tubular injury$sl167$,
  $sq167$With renal tubular injury, the sediment characteristically contains tubular cells, tubular cell casts, and many granular casts (often with brown pigmentation).$sq167$,
  $ch167$a2a68a4d8bc46b100fec9c372dbfc4daec15a3b17761ca96da81fdd40a6cdf0d$ch167$,
  true,
  $ref167$[{"label":"Acute Kidney Injury (AKI) - Merck Manual Professional Edition: brown granular casts indicate renal tubular injury","url":"https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki"}]$ref167$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id168$cmr8h1eql01x31ylokjmxz9lx$id168$,
  $fx168$re-rate|re-tag|rewrite$fx168$,
  $sc168$A 67-year-old woman has had a sudden severe headache, nausea, and photophobia for 12 hours. She has hypertension treated with lisinopril. Blood pressure is 150/88 mm Hg and heart rate is 92 beats per minute. She is alert. The neck is stiff, and there is no focal weakness. Noncontrast CT of the head, performed on arrival, shows no blood.$sc168$,
  $qu168$Which of the following is the most appropriate next step in management?$qu168$,
  $op168${"options":["Perform a diagnostic lumbar puncture","Treat the blood pressure before a tap","Order magnetic resonance imaging next","Start intravenous saline and observe"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"seizures-headaches","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783296610296","examNumber":9322,"slotIndex":24,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T00:11:41.779Z"}}$op168$,
  $ky168$Perform a diagnostic lumbar puncture$ky168$,
  $ex168$Sudden headache with neck stiffness is concerning for subarachnoid hemorrhage, and the CT was obtained 12 hours after onset. When that diagnosis is still suspected and neuroimaging has not shown blood, the next study is a lumbar puncture. Her systolic pressure is 150 mm Hg, which is not above the 160 mm Hg level at which hypertension from this bleed is treated, and the mean pressure from 150/88 mm Hg is not above 130 mm Hg. MRI can show blood but is not the immediate test after a negative CT. Saline does not identify the cause of the headache or the stiff neck.$ex168$,
  3,
  $dm168$behavioral-nervous$dm168$,
  $tp168$seizures-headaches$tp168$,
  $su168$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage$su168$,
  $sl168$Subarachnoid Hemorrhage - Merck Manual Professional Edition: lumbar puncture if CT does not show the bleed$sl168$,
  $sq168$If subarachnoid hemorrhage is suspected clinically but not identified by neuroimaging, or if neuroimaging is not immediately available, lumbar puncture is performed.$sq168$,
  $ch168$2caca7f38327291e85f4b7723a77a603650fbad6a8da6248077120603d178145$ch168$,
  true,
  $ref168$[{"label":"Subarachnoid Hemorrhage - Merck Manual Professional Edition: lumbar puncture if CT does not show the bleed","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage"}]$ref168$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id169$cmr8h1he201xt1ylozgbye2ng$id169$,
  $fx169$re-tag|rewrite$fx169$,
  $sc169$A 62-year-old woman is on the surgical ward on the second day after laparoscopic cholecystectomy. Temperature is 101.5 F (38.6 C), heart rate is 110 beats per minute, and blood pressure is 120/80 mm Hg. The white blood cell count is 15,000/mm3. The incision is clean, without redness or drainage. She has been walking, but incisional pain makes her splint the abdomen, and breath sounds are diminished at both lung bases.$sc169$,
  $qu169$Which of the following is the most appropriate next step in management?$qu169$,
  $op169${"options":["Start incentive spirometry","Give intravenous antibiotics","Order an abdominal CT scan","Give acetaminophen for fever"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"post-op-fever","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783296610296","examNumber":9322,"slotIndex":50,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T00:11:40.486Z"}}$op169$,
  $ky169$Start incentive spirometry$ky169$,
  $ex169$Fever early after an operation is often the inflammatory response to surgery, and this incision has no sign of infection. She is splinting and has reduced breath sounds at the bases, so the lungs are not being expanded. Incentive spirometry is the step that addresses that and lowers the chance of pneumonia. Intravenous antibiotics are not the next step without an infected wound, an infiltrate, or instability. Abdominal CT is not required for a nonfocal fever when the blood pressure is normal. Acetaminophen may lower the temperature but does not expand the bases.$ex169$,
  2,
  $dm169$multisystem$dm169$,
  $tp169$post-op-fever$tp169$,
  $su169$https://www.merckmanuals.com/professional/special-subjects/care-of-the-surgical-patient/postoperative-care$su169$,
  $sl169$Postoperative Care - Merck Manual Professional Edition: encourage incentive spirometry after surgery$sl169$,
  $sq169$Incentive spirometry and periodic coughing can help decrease risk of pneumonia and should be encouraged up to 10 times once every hour.$sq169$,
  $ch169$bdd5c4d55eb97350e9aa3075db50f0f52cda4dde912dfb6165bfb7c55b943902$ch169$,
  true,
  $ref169$[{"label":"Postoperative Care - Merck Manual Professional Edition: encourage incentive spirometry after surgery","url":"https://www.merckmanuals.com/professional/special-subjects/care-of-the-surgical-patient/postoperative-care"}]$ref169$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id170$cmru6qys4002kl104w8g56khi$id170$,
  $fx170$re-rate|re-tag|rewrite$fx170$,
  $sc170$A 25-year-old man with type 1 diabetes ran out of insulin two days ago. He has polyuria, polydipsia, nausea, and abdominal pain. Heart rate is 118 beats per minute, the mucous membranes are dry, and the respirations are deep and rapid. Blood pressure is 110/70 mm Hg. Laboratory studies show glucose 486 mg/dL, arterial pH 7.18, bicarbonate 10 mEq/L, anion gap 22 mEq/L, and potassium 5.1 mEq/L.$sc170$,
  $qu170$Which of the following is the most appropriate next step in management?$qu170$,
  $op170${"options":["Intravenous saline and insulin","Potassium repletion before insulin","Sodium bicarbonate infusion now","Subcutaneous insulin and discharge"],"blueprintTopic":"diabetes-dka-management","blueprintSystem":"reproductive-endocrine"}$op170$,
  $ky170$Intravenous saline and insulin$ky170$,
  $ex170$Missed insulin, hyperglycemia, a wide anion-gap acidosis, and volume loss are diabetic ketoacidosis. The urgent treatment is intravascular saline together with intravenous insulin. Potassium is 5.1 mEq/L, which is above 3.3 mEq/L, so insulin should not be held for potassium replacement. Bicarbonate is not the initial infusion at a pH of 7.18. Subcutaneous insulin and discharge do not treat this degree of acidosis and dehydration.$ex170$,
  2,
  $dm170$reproductive-endocrine$dm170$,
  $tp170$diabetes-dka-management$tp170$,
  $su170$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus$su170$,
  $sl170$Acute Complications of Diabetes Mellitus - Merck Manual Professional Edition: saline and insulin for diabetic ketoacidosis$sl170$,
  $sq170$The most urgent goals for treating diabetic ketoacidosis are rapid intravascular volume repletion, correction of hyperglycemia and acidosis, and prevention of hypokalemia ( 1 , 2 , 3 ).$sq170$,
  $ch170$1d5d74bfa2d7346d8884bc7c81a03edd4133d37da8bf33ff04af9bd64f7d46b9$ch170$,
  true,
  $ref170$[{"label":"Acute Complications of Diabetes Mellitus - Merck Manual Professional Edition: saline and insulin for diabetic ketoacidosis","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus"}]$ref170$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id171$cmru8hway00a41yd6i7gqzktn$id171$,
  $fx171$re-rate|re-tag$fx171$,
  $sc171$A 30-year-old pregnant woman at 36 weeks of gestation presents to the labor and delivery unit with severe headache and visual disturbances. Her blood pressure is 160/110 mm Hg, and she has 2+ edema in her lower extremities. Laboratory tests reveal elevated liver enzymes and thrombocytopenia. A fetal ultrasound shows a non-stress test with decreased variability.$sc171$,
  $qu171$What is the most likely diagnosis?$qu171$,
  $op171${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-monitoring-escalation","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784612691636","examNumber":9304,"slotIndex":13,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T05:45:52.446Z"},"options":["Gestational hypertension","Preeclampsia","Eclampsia","Chronic hypertension"]}$op171$,
  $ky171$Preeclampsia$ky171$,
  $ex171$The clinical presentation is consistent with preeclampsia, characterized by hypertension, edema, and signs of end-organ dysfunction (elevated liver enzymes and thrombocytopenia). Preeclampsia typically occurs after 20 weeks of gestation and can lead to severe complications if untreated. Gestational hypertension lacks the end-organ damage seen here, while eclampsia involves seizures, which are not reported in this vignette. Chronic hypertension would not present with the acute symptoms and lab findings observed.

Clinical reasoning: The patient exhibits classic signs of preeclampsia, including hypertension, edema, and laboratory abnormalities indicating end-organ dysfunction. Analyzing the clinical data, the presence of elevated liver enzymes and thrombocytopenia alongside hypertension confirms the diagnosis of preeclampsia, necessitating careful monitoring and management.

Why other options are incorrect:
• Gestational hypertension: This option is incorrect because gestational hypertension does not involve the end-organ dysfunction seen in this patient.
• Eclampsia: This option is incorrect as eclampsia is characterized by seizures, which this patient does not exhibit.
• Chronic hypertension: This option is incorrect because chronic hypertension would not present with the acute symptoms and lab findings seen in this case.$ex171$,
  1,
  $dm171$reproductive-endocrine$dm171$,
  $tp171$preeclampsia-eclampsia$tp171$,
  NULL,
  NULL,
  NULL,
  $ch171$5170f5f9a0b5a8e6bbf33d96f2c6c46a1cdb614c6d72ebff93092437636159ea$ch171$,
  true,
  $ref171$[{"url":"https://www.nice.org.uk/guidance/ng133/chapter/Recommendations","label":"NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction."}]$ref171$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id172$cmr98dmv200hu1ywyj0rd85ht$id172$,
  $fx172$re-rate|re-tag|rewrite$fx172$,
  $sc172$A 50-year-old woman comes to the emergency department because of severe headache and blurred vision. Blood pressure is 210/128 mm Hg. She takes lisinopril. She is alert and has no focal weakness. Fundoscopy shows bilateral flame hemorrhages and cotton-wool spots. Serum creatinine is 2.4 mg/dL; three months ago it was 0.9 mg/dL.$sc172$,
  $qu172$Which of the following is the most likely diagnosis?$qu172$,
  $op172${"kind":"sequential","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"emergency-management","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783342652092","examNumber":9306,"slotIndex":44,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T12:58:34.085Z"},"options":["Severe hypertensive emergency","Severe hypertensive urgency","Acute ischemic cerebral stroke","Migraine headache with aura"]}$op172$,
  $ky172$Severe hypertensive emergency$ky172$,
  $ex172$A pressure of 210/128 mm Hg with flame hemorrhages, cotton-wool spots, and a creatinine rise from 0.9 mg/dL to 2.4 mg/dL is severe hypertension with acute damage to the retina and kidney. That is a hypertensive emergency. Hypertensive urgency is a similarly high pressure without new target-organ injury. There is no focal weakness to support acute cerebral infarction. Migraine does not raise the creatinine or produce bilateral retinal hemorrhages and exudates.$ex172$,
  1,
  $dm172$multisystem$dm172$,
  $tp172$emergency-management$tp172$,
  $su172$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies$su172$,
  $sl172$Hypertensive Emergencies - Merck Manual Professional Edition: severe hypertension plus target-organ damage$sl172$,
  $sq172$A hypertensive emergency is severe hypertension (often defined as systolic blood pressure (BP) ≥ 180 mm Hg and/or diastolic blood pressure ≥ 120 mm Hg) with signs of damage to target organs (primarily the brain, cardiovascular system, and kidneys).$sq172$,
  $ch172$62a921f6f426b81cbe699e3defd28e51f52f89d1a3adfc42f0b28ce01d4540fc$ch172$,
  true,
  $ref172$[{"label":"Hypertensive Emergencies - Merck Manual Professional Edition: severe hypertension plus target-organ damage","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies"}]$ref172$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id173$cmrx1lubr001il705c00n8cs0$id173$,
  $fx173$re-rate|re-tag|rewrite$fx173$,
  $sc173$A 67-year-old woman has sudden weakness of the right arm and leg and aphasia. She was last known to be well 70 minutes ago. Blood pressure is 178/96 mm Hg and heart rate is 88 beats per minute. Fingerstick glucose is 112 mg/dL. Noncontrast CT of the head shows no hemorrhage. She takes no anticoagulant.$sc173$,
  $qu173$Which of the following is the most appropriate next step in management?$qu173$,
  $op173${"stepLevel":"step3","blueprintSystem":"behavioral-nervous","kind":"ccs_prompt","caseData":{"setting":"ED — acute neuro deficit","presentation":"67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal","vitals":"BP 178/96, HR 88","timeline":"Ischemic stroke evaluation — tPA window"},"structureIds":["brain","spinal-cord","carotid-artery"],"options":["Give intravenous alteplase now","Lower blood pressure before lysis","Give aspirin instead of alteplase","Obtain an MRI before treatment"],"blueprintTopic":"stroke-management"}$op173$,
  $ky173$Give intravenous alteplase now$ky173$,
  $ex173$Sudden hemiparesis and aphasia, a CT without hemorrhage, and onset 70 minutes ago are an acute ischemic stroke inside the 3-hour window for alteplase. Blood pressure is 178/96 mm Hg, which does not exceed the exclusion threshold of systolic pressure above 185 mm Hg or diastolic pressure above 110 mm Hg, so lysis should not be delayed to lower it. Aspirin does not replace thrombolysis in a patient who meets the criteria for alteplase. MRI would postpone treatment after CT has already excluded hemorrhage.$ex173$,
  1,
  $dm173$behavioral-nervous$dm173$,
  $tp173$stroke-management$tp173$,
  $su173$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su173$,
  $sl173$Ischemic Stroke - Merck Manual Professional Edition: alteplase within 3 hours if no contraindication$sl173$,
  $sq173$Recombinant tPA ( alteplase ) can be used for patients with acute ischemic stroke up to 3 hours after symptom onset if they have no contraindications to tPA$sq173$,
  $ch173$f8a18838cd0b403044a2b959796450efa462fba77f7062f2e096245f0a591fb1$ch173$,
  true,
  $ref173$[{"label":"Ischemic Stroke - Merck Manual Professional Edition: alteplase within 3 hours if no contraindication","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref173$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id174$cmr4baeou00421ykywheq1yz2$id174$,
  $fx174$re-rate|re-tag$fx174$,
  NULL,
  $qu174$A 25-year-old man comes to the clinic because of fever, chills, dysuria, urinary frequency, and urgency for 3 days. He has no urethral discharge, and he is tolerating oral fluids. His temperature is 38.3°C (101°F), blood pressure is 120/80 mm Hg, and heart rate is 90/min. Urinalysis is positive for nitrites and leukocyte esterase. He has no drug allergies, and local fluoroquinolone resistance is low. Which of the following is the most appropriate initial management?$qu174$,
  $op174$["Obtain a urine culture and start oral ciprofloxacin", "Phenazopyridine alone", "Increased oral fluid intake alone", "Obtain a urine culture and withhold antibiotics until results return"]$op174$,
  $ky174$Obtain a urine culture and start oral ciprofloxacin$ky174$,
  $ex174$Correct answer: A. Obtain a urine culture and start oral ciprofloxacin. A urinary tract infection with fever in a man is a complicated infection; a urine culture should be sent to guide therapy, and because he is stable and tolerating oral fluids with low local fluoroquinolone resistance, oral ciprofloxacin can be started at once. Why the other options are wrong: B. Phenazopyridine relieves dysuria but does not treat infection. C. Drinking more fluids does not treat a febrile bacterial infection. D. Withholding antibiotics until the culture returns delays treatment of a febrile infection; empiric therapy should start once the culture is sent.$ex174$,
  2,
  $dm174$blood-lymph-immune$dm174$,
  $tp174$gram-negative-fungi-parasites$tp174$,
  NULL,
  NULL,
  NULL,
  $ch174$9aeb807570f2c535f2f4c209e6515b9c956786faf8d32c7f47e0ef9877f3f229$ch174$,
  true,
  $ref174$[{"label":"USMLE Step 2 CK Content Outline 2026"}]$ref174$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id175$cmr4cbw6800ks1yky3bq8y4vp$id175$,
  $fx175$re-rate|re-tag$fx175$,
  $sc175$A 62-year-old woman presents to the emergency department with a 2-day history of worsening shortness of breath and a productive cough. She has a history of COPD and is currently on tiotropium and albuterol. On examination, her respiratory rate is 24 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Her initial arterial blood gas reveals a pH of 7.32, pCO2 of 60 mmHg, and pO2 of 58 mmHg.$sc175$,
  $qu175$What is the most appropriate next step in management?$qu175$,
  $op175${"options":["Administer intravenous corticosteroids","Initiate non-invasive positive pressure ventilation","Start intravenous antibiotics (give antibiotics through a vein)","Provide supplemental oxygen via nasal cannula"],"distractorRationale":{"Administer intravenous corticosteroids":"While corticosteroids are important in managing COPD exacerbations, they do not address the immediate respiratory failure.","Start intravenous antibiotics (give antibiotics through a vein)":"This option assumes a bacterial infection without evidence; antibiotics are not indicated in the absence of pneumonia.","Provide supplemental oxygen via nasal cannula":"Oxygen can worsen hypercapnia in COPD patients; NIPPV is preferred to manage respiratory acidosis."},"clinicalReasoning":"The patient's presentation of worsening shortness of breath, hypoxemia, and hypercapnia indicates acute respiratory failure due to COPD exacerbation. Analyzing her arterial blood gas shows respiratory acidosis, necessitating intervention to improve ventilation. Integrating this with her clinical status, NIPPV is the most effective management strategy to prevent intubation and improve her respiratory function.","keyTakeaways":["When managing acute respiratory failure in COPD, prioritize NIPPV to enhance ventilation and prevent intubation."],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"ethics-professionalism","blueprintSystem":"pharm-advertising","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783046983637","qcScore":8.1,"slotIndex":26,"stepLevel":"step3","examNumber":9307,"generatedAt":"2026-07-03T02:52:28.615Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"clinical-intervention"}$op175$,
  $ky175$Initiate non-invasive positive pressure ventilation$ky175$,
  $ex175$## Why this answer is correct
Initiating non-invasive positive pressure ventilation (NIPPV) is the best choice for this patient in acute respiratory failure.
• **NIPPV** improves ventilation and oxygenation, crucial in acute exacerbations of COPD.
• It reduces the **work of breathing**, helping to stabilize the patient.
• This intervention can prevent the need for **intubation** in severe cases.
**In practice:** In practice, using NIPPV can significantly enhance patient outcomes by addressing respiratory failure effectively, allowing for better management of COPD exacerbations.
## Why the other options are wrong

**Administer intravenous corticosteroids**
• Trap: Students may think corticosteroids are always the first step in managing COPD exacerbations.
• Why it fails here: While corticosteroids are important for reducing inflammation, they do not address the immediate need for improved ventilation in acute respiratory failure.
• Remember: In acute settings, immediate interventions like NIPPV take precedence over corticosteroid administration.

**Start intravenous antibiotics (give antibiotics through a vein)**
• Trap: There is a common belief that antibiotics are necessary for all COPD exacerbations.
• Why it fails here: Antibiotics are only indicated if there is clear evidence of a bacterial infection, which is not present in this case.
• Remember: Without signs of infection, initiating antibiotics would be inappropriate and could lead to unnecessary side effects.

**Provide supplemental oxygen via nasal cannula**
• Trap: Students might think that oxygen therapy is always the first step for hypoxemia.
• Why it fails here: In COPD patients with hypercapnia, supplemental oxygen can worsen carbon dioxide retention and respiratory acidosis.
• Remember: Understanding the risks of oxygen therapy in COPD is crucial for effective management.
## Key takeaway
**When managing acute respiratory failure in COPD, prioritize NIPPV to enhance ventilation and prevent intubation.**

**Memory hook:** Remember: NIPPV is your go-to for COPD exacerbations — it’s like giving the lungs a helping hand!

The board takeaway is that Initiate non-invasive positive pressure ventilation is the single best answer, and the rationale above is what the student should leave with. GOLD 2024 COPD guidance: start noninvasive ventilation for a severe COPD exacerbation with respiratory acidosis or tiring work of breathing.$ex175$,
  2,
  $dm175$respiratory-renal$dm175$,
  $tp175$copd-asthma-exacerbation$tp175$,
  NULL,
  NULL,
  NULL,
  $ch175$b04e011048a865b161cd57908f2d632ed7cf740a2b11ca754358dfabb0b9dbe4$ch175$,
  true,
  $ref175$[{"url":"https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf","label":"GOLD 2025 pocket guide, management of exacerbations: noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication."}]$ref175$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id176$cmr97z2ad00bc1ywyh45tv06o$id176$,
  $fx176$re-rate|re-tag|rewrite$fx176$,
  $sc176$A 60-year-old man comes to the clinic because of fatigue and increased urination for several weeks. He has hypertension. Blood pressure is 150/90 mm Hg and body mass index is 32 kg/m2. He has not lost weight. Fasting plasma glucose is 180 mg/dL. Urinalysis shows glucose and no ketones. Serum bicarbonate is 24 mEq/L. He is alert.$sc176$,
  $qu176$Which of the following is the most likely diagnosis?$qu176$,
  $op176${"kind":"ethics","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"ambulatory-chronic-care","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341924348","examNumber":9304,"slotIndex":51,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T12:46:19.218Z"},"options":["Adult-onset type 2 diabetes","Autoimmune type 1 diabetes","Central diabetes insipidus","Hyperosmolar nonketotic state"]}$op176$,
  $ky176$Adult-onset type 2 diabetes$ky176$,
  $ex176$A fasting glucose of 180 mg/dL with polyuria is diabetes. Age 60, body mass index of 32, stable weight, absent ketones, and a normal bicarbonate fit type 2 diabetes, which is driven by insulin resistance with relatively insufficient insulin. Autoimmune destruction of beta cells is the type 1 pattern and tends to present with ketosis and weight loss, which he does not have. Central diabetes insipidus does not raise the plasma glucose or put glucose in the urine. A hyperosmolar nonketotic state requires extreme hyperglycemia and altered mentation, not a glucose of 180 mg/dL in an alert clinic patient.$ex176$,
  2,
  $dm176$multisystem$dm176$,
  $tp176$ambulatory-chronic-care$tp176$,
  $su176$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/overview-of-diabetes-mellitus$su176$,
  $sl176$Overview of Diabetes Mellitus - Merck Manual Professional Edition: type 2 diabetes is insulin resistance with relative insulin deficiency$sl176$,
  $sq176$Type 1 diabetes is primarily characterized by inadequate insulin production due to autoimmune destruction of pancreatic beta cells, whereas type 2 diabetes is primarily characterized by insulin resistance and a relative insufficiency of insulin.$sq176$,
  $ch176$dc05537569f18cf070370fa209b8cf955c0eccff8a71c061569c43cabfe02799$ch176$,
  true,
  $ref176$[{"label":"Overview of Diabetes Mellitus - Merck Manual Professional Edition: type 2 diabetes is insulin resistance with relative insulin deficiency","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/overview-of-diabetes-mellitus"}]$ref176$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id177$cmr8fz7zy01nd1ylonhqdd1oe$id177$,
  $fx177$re-rate|re-tag|rewrite$fx177$,
  $sc177$A 72-year-old woman with advanced Alzheimer disease is admitted with fever and cough. Temperature is 102 F (38.9 C), heart rate is 110 beats per minute, and blood pressure is 90/60 mm Hg. A chest radiograph shows consolidation in the right lower lobe. She is too confused to discuss treatment. Her family is unsure what she would want regarding resuscitation.$sc177$,
  $qu177$Which of the following is the most appropriate next step in management?$qu177$,
  $op177${"kind":"ethics","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"sepsis-bundles","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783294476526","qcScore":8.2,"slotIndex":18,"stepLevel":"step3","examNumber":9319,"generatedAt":"2026-07-05T23:41:58.075Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Give intravenous fluids and antibiotics","Hold all treatment for a family meeting","Write a do-not-resuscitate order now","Request an ethics consult before care"],"taskCategory":"professionalism"}$op177$,
  $ky177$Give intravenous fluids and antibiotics$ky177$,
  $ex177$Fever, tachycardia, hypotension, and lobar consolidation are septic shock from pneumonia. Early management is intravenous fluid resuscitation and antibiotics, and that treatment starts as soon as the syndrome is recognized. A discussion of her values matters, but it does not come before resuscitation while she is hypotensive. A do-not-resuscitate order should not be written before anyone has talked with the family about her wishes. An ethics consult is not the first action in unstable infection.$ex177$,
  2,
  $dm177$multisystem$dm177$,
  $tp177$sepsis-bundles$tp177$,
  $su177$https://www.merckmanuals.com/professional/critical-care-medicine/sepsis-and-septic-shock/sepsis-and-septic-shock$su177$,
  $sl177$Sepsis and Septic Shock - Merck Manual Professional Edition: early fluids and antibiotics$sl177$,
  $sq177$Because sepsis may progress rapidly, management requires early identification, aggressive fluid resuscitation, antibiotics, and source control.$sq177$,
  $ch177$124e686356a0b4044ffb38e3e2764b59aaf59f8ead7293534b5f76e2b96f6623$ch177$,
  true,
  $ref177$[{"label":"Sepsis and Septic Shock - Merck Manual Professional Edition: early fluids and antibiotics","url":"https://www.merckmanuals.com/professional/critical-care-medicine/sepsis-and-septic-shock/sepsis-and-septic-shock"}]$ref177$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id178$cmr8nmh9200wa1ygi1mbmvnq0$id178$,
  $fx178$re-rate|re-tag|rewrite$fx178$,
  $sc178$A 50-year-old man with chronic kidney disease has confusion and lethargy. Blood pressure is 130/80 mm Hg, heart rate is 88 beats per minute, and respiratory rate is 18 breaths per minute. Serum potassium is 6.8 mEq/L and creatinine is 3.5 mg/dL. The electrocardiogram shows peaked T waves, loss of P waves, and a widened QRS complex.$sc178$,
  $qu178$Which of the following is the most appropriate next step in management?$qu178$,
  $op178${"kind":"ethics","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"aki-ckd-electrolytes","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783307689930","qcScore":8.4,"slotIndex":4,"stepLevel":"step3","examNumber":9311,"generatedAt":"2026-07-06T03:15:58.929Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Give calcium, insulin, and glucose intravenously","Give insulin and glucose while deferring calcium","Begin hemodialysis before any calcium infusion","Give sodium bicarbonate as the first infusion"],"taskCategory":"communication"}$op178$,
  $ky178$Give calcium, insulin, and glucose intravenously$ky178$,
  $ex178$A potassium of 6.8 mEq/L with loss of P waves and QRS widening is severe hyperkalemia affecting cardiac conduction. Intravenous calcium and insulin with glucose are both indicated for these electrocardiographic changes. Insulin and glucose shift potassium into cells but do not replace calcium when the QRS is wide. Hemodialysis may be needed later because of his kidney disease, but it is not the first action before the membrane is stabilized. Bicarbonate is not the initial treatment for this tracing.$ex178$,
  3,
  $dm178$respiratory-renal$dm178$,
  $tp178$aki-ckd-electrolytes$tp178$,
  $su178$https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyperkalemia$su178$,
  $sl178$Hyperkalemia - Merck Manual Professional Edition: calcium plus insulin and glucose for QRS widening$sl178$,
  $sq178$If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated$sq178$,
  $ch178$b2d7fc6c3ea77dc6bbabe50fed0d3afb15b59869b184badfec19f6723d494b60$ch178$,
  true,
  $ref178$[{"label":"Hyperkalemia - Merck Manual Professional Edition: calcium plus insulin and glucose for QRS widening","url":"https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hyperkalemia"}]$ref178$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id179$cmr4c4vyr00i81yky4f2n3d98$id179$,
  $fx179$re-rate|re-tag|rewrite$fx179$,
  $sc179$A 62-year-old woman has had slurred speech and a left facial droop since this morning, and both findings are still present. Blood pressure is 150/95 mm Hg and heart rate is 88 beats per minute. She has hypertension and hyperlipidemia and takes no medications. Noncontrast CT of the head shows a hypoattenuating area in the right middle cerebral artery territory and no blood.$sc179$,
  $qu179$Which of the following is the most likely diagnosis?$qu179$,
  $op179${"kind":"ethics","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"stroke-management","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783046542691","qcScore":8.4,"slotIndex":54,"stepLevel":"step3","examNumber":9306,"generatedAt":"2026-07-03T02:49:01.610Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Acute cerebral infarction","Transient ischemic attack","Intracerebral hemorrhage","Cortical venous thrombosis"],"taskCategory":"health-maintenance"}$op179$,
  $ky179$Acute cerebral infarction$ky179$,
  $ex179$A persisting facial droop and dysarthria, with a hypoattenuating middle-cerebral-artery lesion and no blood on CT, is an acute cerebral infarct. CT is used to exclude hemorrhage and to show the extent of ischemic stroke. A transient ischemic attack is not accompanied by infarction, and this deficit has not resolved. Intracerebral hemorrhage would appear as blood on CT, which is absent. Cortical venous thrombosis does not typically produce a single arterial-territory area of low attenuation.$ex179$,
  1,
  $dm179$behavioral-nervous$dm179$,
  $tp179$stroke-management$tp179$,
  $su179$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su179$,
  $sl179$Ischemic Stroke - Merck Manual Professional Edition: CT excludes hemorrhage and confirms the infarct$sl179$,
  $sq179$Diagnosis is clinical, but CT or MRI is performed to exclude hemorrhage and confirm the presence and extent of stroke.$sq179$,
  $ch179$a7cf6030ea864911f83e90815bd34ce7e94ea9ac6f1d42c80d14a946dc1f55d2$ch179$,
  true,
  $ref179$[{"label":"Ischemic Stroke - Merck Manual Professional Edition: CT excludes hemorrhage and confirms the infarct","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref179$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id180$cmr97qi2l00831ywy0f1oimge$id180$,
  $fx180$re-rate|re-tag|rewrite$fx180$,
  $sc180$A 45-year-old man has had constant right-upper-quadrant pain for 12 hours. He is known to have gallstones. Temperature is 101 F (38.3 C). Palpation of the right upper quadrant stops inspiration. The white blood cell count is 15,000/mm3. Bilirubin is 0.9 mg/dL, alkaline phosphatase is 90 U/L, and lipase is normal. Ultrasound shows gallstones, a gallbladder wall 5 mm thick, fluid around the gallbladder, and a common bile duct 4 mm in diameter.$sc180$,
  $qu180$Which of the following is the most likely diagnosis?$qu180$,
  $op180${"kind":"ethics","stepLevel":"step3","blueprintSystem":"gastrointestinal","blueprintTopic":"appendicitis-cholecystitis","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341531766","examNumber":9303,"slotIndex":53,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-06T12:39:50.340Z"},"options":["Acute calculous cholecystitis","Acute bacterial cholangitis","Acute gallstone pancreatitis","Impacted common bile duct stone"]}$op180$,
  $ky180$Acute calculous cholecystitis$ky180$,
  $ex180$Fever, leukocytosis, gallstones, a thickened gallbladder wall, fluid around the gallbladder, and inspiratory arrest during right-upper-quadrant palpation indicate acute calculous cholecystitis. Cholangitis requires biliary obstruction with jaundice, and his bilirubin is 0.9 mg/dL with a 4 mm duct. Pancreatitis is unlikely with a normal lipase. An impacted duct stone would dilate the duct and raise the bilirubin, and neither finding is present.$ex180$,
  1,
  $dm180$gastrointestinal$dm180$,
  $tp180$appendicitis-cholecystitis$tp180$,
  $su180$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis$su180$,
  $sl180$Acute Cholecystitis - Merck Manual Professional Edition: wall thickening or pericholecystic fluid means acute inflammation$sl180$,
  $sq180$Pericholecystic fluid or thickening of the gallbladder wall indicates acute inflammation.$sq180$,
  $ch180$5171de49fdba692088f99953ca3262961d94881831fa3240d16575852b1d9635$ch180$,
  true,
  $ref180$[{"label":"Acute Cholecystitis - Merck Manual Professional Edition: wall thickening or pericholecystic fluid means acute inflammation","url":"https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis"}]$ref180$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id181$cmr8db8vm00u31ylo12as98es$id181$,
  $fx181$re-rate|re-tag|rewrite$fx181$,
  $sc181$A 45-year-old woman has severe abdominal pain and vomiting two days after laparoscopic removal of the gallbladder for gallstones. Temperature is 101 F (38.3 C), and the abdomen is tender. The white blood cell count is 15,000/mm3 and alkaline phosphatase is 200 U/L. Bilirubin is 0.8 mg/dL and lipase is normal. Ultrasound shows a fluid collection in the gallbladder fossa and a common bile duct 4 mm in diameter.$sc181$,
  $qu181$Which of the following is the most likely diagnosis?$qu181$,
  $op181${"kind":"ethics","stepLevel":"step3","blueprintSystem":"gastrointestinal","blueprintTopic":"appendicitis-cholecystitis","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783290392553","qcScore":8.2,"slotIndex":28,"stepLevel":"step3","examNumber":9310,"generatedAt":"2026-07-05T22:30:31.402Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Postoperative bile duct injury","Retained common bile duct stone","Uncomplicated postoperative ileus","Postoperative acute pancreatitis"],"taskCategory":"diagnosis"}$op181$,
  $ky181$Postoperative bile duct injury$ky181$,
  $ex181$Fever, leukocytosis, and a fluid collection in the gallbladder fossa two days after laparoscopic gallbladder removal, with a nondilated duct and a normal bilirubin, indicate bile leaking from an injured duct. A retained duct stone causes obstruction, which dilates the duct and raises the bilirubin. Ileus does not produce this fluid collection, fever, and alkaline phosphatase elevation. Pancreatitis is unlikely with a normal lipase. Injury of the common bile duct is a recognized risk of this operation.$ex181$,
  3,
  $dm181$gastrointestinal$dm181$,
  $tp181$appendicitis-cholecystitis$tp181$,
  $su181$https://medlineplus.gov/ency/article/007371.htm$su181$,
  $sl181$Laparoscopic gallbladder removal - MedlinePlus: common bile duct injury is a risk of the operation$sl181$,
  $sq181$Risks for gallbladder surgery include: Damage to the blood vessels that go to the liver Injury to the common bile duct Injury to the small intestine or colon Inflammation of the pancreas (pancreatitis)$sq181$,
  $ch181$9e3aa0ece18592d6dacf19a5e6b66693c8b8d1805c05c74f19b5affceec11513$ch181$,
  true,
  $ref181$[{"label":"Laparoscopic gallbladder removal - MedlinePlus: common bile duct injury is a risk of the operation","url":"https://medlineplus.gov/ency/article/007371.htm"}]$ref181$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id182$cmr97qh3s007t1ywynm7eqzoy$id182$,
  $fx182$re-rate|re-tag|rewrite$fx182$,
  $sc182$A 55-year-old man with type 2 diabetes is brought in confused and lethargic. He often misses his medications. Plasma glucose is 640 mg/dL and serum osmolality is 330 mOsm/kg. Arterial pH is 7.36 and bicarbonate is 22 mEq/L. The urine contains no ketones.$sc182$,
  $qu182$Which of the following is the most likely diagnosis?$qu182$,
  $op182${"kind":"ethics","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"diabetes-dka-management","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341531766","examNumber":9303,"slotIndex":43,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T12:39:50.908Z"},"options":["Hyperosmolar hyperglycemic state","Diabetic ketoacidosis with coma","Hypertonic acute kidney injury","Chronically poor glycemic control"]}$op182$,
  $ky182$Hyperosmolar hyperglycemic state$ky182$,
  $ex182$Confusion with glucose of 640 mg/dL and osmolality of 330 mOsm/kg, without ketones and with pH 7.36 and bicarbonate 22 mEq/L, is hyperosmolar hyperglycemic state. In this state the glucose is typically above 600 mg/dL and the osmolality above 320 mOsm/L, far beyond ordinary ketoacidosis, because enough insulin remains to limit ketone formation. Diabetic ketoacidosis requires acidosis and ketones, which are absent. Acute kidney injury does not by itself produce this glucose and osmolality. Longstanding poor control does not explain acute lethargy at this osmolality.$ex182$,
  1,
  $dm182$reproductive-endocrine$dm182$,
  $tp182$diabetes-dka-management$tp182$,
  $su182$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus$su182$,
  $sl182$Acute Complications of Diabetes Mellitus - Merck Manual Professional Edition: HHS has very high glucose and osmolality without ketoacidosis$sl182$,
  $sq182$This causes more severe dehydration before presentation, and thus plasma glucose ( > 600 mg/dL [ > 33.3 mmol/L]) and osmolality ( > 320 mOsm/L) are typically much higher than in diabetic ketoacidosis.$sq182$,
  $ch182$e238b5ca607d7a10a8e01f9e272aacaa19fadc1206b2f9ab18fe6bff040e06e9$ch182$,
  true,
  $ref182$[{"label":"Acute Complications of Diabetes Mellitus - Merck Manual Professional Edition: HHS has very high glucose and osmolality without ketoacidosis","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus"}]$ref182$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id183$cmr8lqgp100d21ygixsmb9teg$id183$,
  $fx183$re-rate|re-tag|rewrite$fx183$,
  $sc183$A 60-year-old woman with COPD comes to the emergency department with two days of dyspnea. She has been using her albuterol inhaler more often. Respiratory rate is 24 breaths per minute and oxygen saturation is 88% on room air. She is alert and speaks in full sentences. Both lungs wheeze. Sputum volume and color are unchanged. A chest radiograph shows no infiltrate. Blood pressure is 138/82 mm Hg.$sc183$,
  $qu183$Which of the following is the most appropriate next step in management?$qu183$,
  $op183${"kind":"ethics","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783304307445","qcScore":8.1,"slotIndex":12,"stepLevel":"step3","examNumber":9305,"generatedAt":"2026-07-06T02:19:38.285Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Oxygen, bronchodilators, and prednisone","Prednisone without oxygen or bronchodilators","Antibiotics without oxygen or prednisone","Noninvasive ventilation instead of oxygen"],"taskCategory":"diagnosis"}$op183$,
  $ky183$Oxygen, bronchodilators, and prednisone$ky183$,
  $ex183$Saturation of 88%, wheezing, and increased albuterol use are an acute COPD exacerbation that is more than mild. Oxygen, a short-acting bronchodilator, and a systemic corticosteroid are started together. Prednisone without oxygen leaves the hypoxemia untreated, and the bronchodilator is what reverses the obstruction. Antibiotics are for an increase in sputum purulence along with more dyspnea or more sputum, and her sputum is unchanged. Noninvasive ventilation is used for a severe exacerbation with pH below 7.30, which is not shown, and she is still speaking in sentences.$ex183$,
  2,
  $dm183$respiratory-renal$dm183$,
  $tp183$copd-asthma-exacerbation$tp183$,
  $su183$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation$su183$,
  $sl183$Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: oxygen, bronchodilators, and glucocorticoids together$sl183$,
  $sq183$Beta-agonists and anticholinergics, with or without glucocorticoids, should be started concurrently with oxygen therapy (regardless of how oxygen is administered) with the aim of reversing airway obstruction ( 1 ).$sq183$,
  $ch183$aeb794164a94f8e8cabdc1bfc8be041028294b647c975ff047afca55edfe8300$ch183$,
  true,
  $ref183$[{"label":"Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: oxygen, bronchodilators, and glucocorticoids together","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation"}]$ref183$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id184$cmr97z11900az1ywyov4k1tlp$id184$,
  $fx184$re-rate|re-tag$fx184$,
  $sc184$A 55-year-old man with a history of chronic alcohol use presents to the emergency department with confusion, tremors, and diaphoresis. His vital signs show a blood pressure of 120/80 mm Hg, heart rate of 110 bpm, and temperature of 99°F. Laboratory tests reveal a serum ethanol level of 0.0 mg/dL. The patient is agitated and has a tremor in his hands.$sc184$,
  $qu184$What is the most appropriate initial management for this patient?$qu184$,
  $op184${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"informed-consent-capacity","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341924348","examNumber":9304,"slotIndex":37,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T12:46:22.186Z"},"options":["Administer benzodiazepines","Start intravenous fluids","Provide thiamine supplementation","Initiate haloperidol"]}$op184$,
  $ky184$Administer benzodiazepines$ky184$,
  $ex184$The most appropriate initial management for this patient, who is likely experiencing alcohol withdrawal, is to administer benzodiazepines to alleviate withdrawal symptoms. Starting intravenous fluids (wrong option) may be necessary for hydration but does not address the withdrawal symptoms directly. Providing thiamine supplementation (wrong option) is important to prevent Wernicke's encephalopathy but is not the immediate priority. Initiating haloperidol (wrong option) is contraindicated in this setting, as it can worsen agitation and confusion. Understanding the management of alcohol withdrawal is crucial for patient safety (USMLE 2026 Content Outline).

Clinical reasoning: Assess the patient's symptoms and vital signs. Analyze the need for immediate intervention in alcohol withdrawal. Integrate the management guidelines to determine the appropriate initial therapy.

Why other options are incorrect:
• Start intravenous fluids: Does not directly address withdrawal symptoms.
• Provide thiamine supplementation: Important but not the immediate priority.
• Initiate haloperidol: Contraindicated as it can worsen symptoms.$ex184$,
  1,
  $dm184$behavioral-nervous$dm184$,
  $tp184$substance-use-disorders$tp184$,
  NULL,
  NULL,
  NULL,
  $ch184$b2273a7bda0abd177c5d4d0be8c9d08ce2ab7dc15c4f4c9e90cbf86aba7bb455$ch184$,
  true,
  $ref184$[{"url":"https://www.nice.org.uk/guidance/cg100/chapter/Recommendations","label":"NICE CG100. For acute alcohol withdrawal, consider offering a benzodiazepine."}]$ref184$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id185$cmr8g7ard01qp1ylom2o6a8r4$id185$,
  $fx185$re-rate|re-tag|rewrite$fx185$,
  $sc185$A 30-year-old woman has shortness of breath and wheezing after exposure to a known allergen. She has asthma and uses an inhaler as needed. Respiratory rate is 24 breaths per minute, oxygen saturation is 96% on room air, and peak expiratory flow is 60% of her personal best. She speaks in phrases and has diffuse wheezing.$sc185$,
  $qu185$Which of the following is the most appropriate initial management?$qu185$,
  $op185${"options":["Give repeated inhaled albuterol","Give an oral corticosteroid first","Give nasal oxygen as sole treatment","Give intravenous magnesium sulfate"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783295305274","examNumber":9320,"slotIndex":22,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-05T23:49:21.298Z"}}$op185$,
  $ky185$Give repeated inhaled albuterol$ky185$,
  $ex185$Wheezing after an allergen, with peak flow at 60% of her personal best, is an acute asthma exacerbation that needs an inhaled short-acting beta agonist now. An oral corticosteroid is usually added, but it does not replace immediate bronchodilation. Nasal oxygen is for hypoxemia, to keep saturation above 90%, and hers is already 96%. Intravenous magnesium is an adjunct for severe attacks that have not responded to inhaled beta agonists and glucocorticoids, which has not happened here.$ex185$,
  1,
  $dm185$respiratory-renal$dm185$,
  $tp185$copd-asthma-exacerbation$tp185$,
  $su185$https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations$su185$,
  $sl185$Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: inhaled albuterol is the initial reliever$sl185$,
  $sq185$Patients having an asthma exacerbation are instructed to self-administer 2 to 4 puffs of inhaled albuterol or a similar short-acting beta agonist up to 3 times spaced 20 minutes apart for an acute exacerbation and to measure peak expiratory flow (PEF) if possible.$sq185$,
  $ch185$c010a0a026c809e418800a8d110d0920671d4341047ca29ef79732e83c267dbb$ch185$,
  true,
  $ref185$[{"label":"Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: inhaled albuterol is the initial reliever","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations"}]$ref185$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id186$cmr8lqjm900du1ygi0bdlu642$id186$,
  $fx186$re-rate|re-tag|rewrite$fx186$,
  $sc186$A 72-year-old woman has severe shortness of breath and chest pain. Blood pressure is 90/60 mm Hg, heart rate is 120 beats per minute, and oxygen saturation is 88% on room air. A chest radiograph shows bilateral infiltrates. The electrocardiogram shows ST-segment elevation in leads II, III, and aVF. She has hypertension and hyperlipidemia.$sc186$,
  $qu186$Which of the following is the most likely diagnosis?$qu186$,
  $op186${"kind":"ethics","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"acs-management","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783304307445","qcScore":8.2,"slotIndex":40,"stepLevel":"step3","examNumber":9305,"generatedAt":"2026-07-06T02:19:33.904Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Inferior ST-elevation infarction","Massive acute pulmonary embolism","Acute decompensated heart failure","Bilateral pneumonia with shock"],"taskCategory":"diagnosis"}$op186$,
  $ky186$Inferior ST-elevation infarction$ky186$,
  $ex186$ST-segment elevation in leads II, III, and aVF is the electrocardiographic pattern of an acute inferior infarction, and hypotension with pulmonary edema fits its hemodynamic effect. Massive pulmonary embolism can cause shock and hypoxia but not ST elevation in a coronary distribution. Decompensated heart failure explains congestion but not this territorial ST elevation. Bilateral pneumonia can cause infiltrates and shock but not this electrocardiogram.$ex186$,
  1,
  $dm186$cardiovascular$dm186$,
  $tp186$acs-management$tp186$,
  $su186$https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/acute-myocardial-infarction-mi$su186$,
  $sl186$Acute Myocardial Infarction - Merck Manual Professional Edition: ST elevation in II, III, and aVF is inferior infarction$sl186$,
  $sq186$There is hyperacute ST-segment elevation in leads II, III, and aVF and reciprocal depression in other leads.$sq186$,
  $ch186$8f81b820013e15aeda2d6d57ad8714f90b38d323a3e803b0dc8b636e4ef9575a$ch186$,
  true,
  $ref186$[{"label":"Acute Myocardial Infarction - Merck Manual Professional Edition: ST elevation in II, III, and aVF is inferior infarction","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/acute-myocardial-infarction-mi"}]$ref186$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id187$cmr8nmkq400xj1ygifwrv2uvu$id187$,
  $fx187$re-rate|re-tag|rewrite$fx187$,
  $sc187$A 64-year-old man with COPD comes to the clinic because walking across a room makes him short of breath. For three days he has used his albuterol inhaler every two hours without relief. Sputum volume and color are unchanged. Blood pressure is 130/80 mm Hg, heart rate is 88 beats per minute, respiratory rate is 22 breaths per minute, and oxygen saturation is 93% on room air. He speaks in full sentences. A chest radiograph shows hyperinflation and no infiltrate.$sc187$,
  $qu187$Which of the following is the most appropriate next step in management?$qu187$,
  $op187${"kind":"ethics","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783307689930","qcScore":8.1,"slotIndex":51,"stepLevel":"step3","examNumber":9311,"generatedAt":"2026-07-06T03:16:00.563Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Prednisone and a short-acting bronchodilator","A long-acting bronchodilator for maintenance","Antibiotics without a systemic corticosteroid","Chest computed tomography before treatment"],"taskCategory":"pharmacotherapy"}$op187$,
  $ky187$Prednisone and a short-acting bronchodilator$ky187$,
  $ex187$Dyspnea that limits walking across a room, with albuterol every two hours and no relief, is an acute COPD exacerbation that is more than mild and can still be treated out of the hospital at a saturation of 93%. A short-acting bronchodilator and oral prednisone are both indicated. A long-acting bronchodilator is maintenance therapy and does not treat the acute obstruction. Antibiotics are not indicated when sputum volume and color are unchanged. CT is not needed before treatment when the radiograph shows no infiltrate.$ex187$,
  2,
  $dm187$respiratory-renal$dm187$,
  $tp187$copd-asthma-exacerbation$tp187$,
  $su187$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation$su187$,
  $sl187$Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: systemic glucocorticoids for exacerbations that are not mild, with a short-acting beta agonist$sl187$,
  $sq187$Systemic glucocorticoids should be initiated immediately for all but mild exacerbations.$sq187$,
  $ch187$f9f399473fd39e3f0e64b57de407e4c8ef9ae3bd60111b8416a485efa39e0043$ch187$,
  true,
  $ref187$[{"label":"Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: systemic glucocorticoids for exacerbations that are not mild, with a short-acting beta agonist","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation"}]$ref187$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id188$cmr8f2lxo01h61ylo9ms02mlf$id188$,
  $fx188$re-rate|re-tag$fx188$,
  NULL,
  $qu188$A 62-year-old woman is on the surgical ward after a laparoscopic cholecystectomy. On postoperative day 3, she has a temperature of 38.6°C (101.5°F) and worsening abdominal pain, whereas she had been improving the day before. Blood pressure is 130/80 mm Hg and heart rate is 90/min. The abdomen is mildly distended and tender in the right upper quadrant without peritoneal signs. She is receiving IV fluids and analgesics. Leukocyte count is 12,000/mm³. Which of the following is the most appropriate next step in management?$qu188$,
  $op188$["Contrast-enhanced CT of the abdomen", "Oral antipyretics and incentive spirometry with reassessment the next day", "Exploratory laparotomy", "Upper gastrointestinal endoscopy"]$op188$,
  $ky188$Contrast-enhanced CT of the abdomen$ky188$,
  $ex188$Correct answer: A. Contrast-enhanced CT of the abdomen. A patient who develops fever, tachycardia or worsening abdominal pain with leukocytosis after laparoscopic cholecystectomy instead of recovering steadily must be evaluated for a bile leak, biloma or abscess; with stable blood pressure and no peritonitis, abdominal CT is the first-line study to find a collection that can then be drained. Why the other options are wrong: B. Antipyretics and incentive spirometry treat only the fever and ignore the new abdominal pain and leukocytosis that point to an intra-abdominal complication. C. Exploratory laparotomy is not the first step in a hemodynamically stable patient without peritoneal signs; imaging first identifies whether percutaneous drainage is enough. D. Upper endoscopy examines the esophagus, stomach and duodenum and cannot show a collection or bile leak in the gallbladder bed.$ex188$,
  2,
  $dm188$multisystem$dm188$,
  $tp188$post-op-fever$tp188$,
  NULL,
  NULL,
  NULL,
  $ch188$a3e010c63027c216cb248877bb74cca2274a3e1483f3fa99bef2d08a90a5ee0f$ch188$,
  true,
  $ref188$[{"label":"USMLE Content Outline 2026"}]$ref188$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id189$cmr99iig100ub1ywyl34wyfrt$id189$,
  $fx189$re-rate|re-tag|rewrite$fx189$,
  $sc189$A 62-year-old woman has had worsening shortness of breath for one week. She has hypertension and type 2 diabetes and takes lisinopril and metformin. Blood pressure is 150/90 mm Hg, respiratory rate is 24 breaths per minute, and oxygen saturation is 88% on room air. Oxygen by nasal cannula is started. A chest radiograph shows cardiomegaly and pulmonary congestion. B-type natriuretic peptide is 800 pg/mL.$sc189$,
  $qu189$Which of the following is the most appropriate next step in management?$qu189$,
  $op189${"kind":"biostats","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"chf-management","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783344355339","examNumber":9310,"slotIndex":19,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T13:32:02.250Z"},"options":["Intravenous loop diuretic therapy","An intravenous inotrope infusion","Start a new oral beta-blocker now","A bolus of normal saline infusion"]}$op189$,
  $ky189$Intravenous loop diuretic therapy$ky189$,
  $ex189$Pulmonary congestion, an elevated natriuretic peptide, and hypoxemia are acute heart failure, and oxygen has already been started. Decongestion with an intravenous loop diuretic is the mainstay of treatment. An inotrope is for low-output failure with cardiogenic shock, and her blood pressure is 150/90 mm Hg. A new beta blocker is added after she is stabilized, not while she is congested and hypoxic. A saline bolus adds volume to lungs that are already wet.$ex189$,
  1,
  $dm189$cardiovascular$dm189$,
  $tp189$chf-management$tp189$,
  $su189$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure$su189$,
  $sl189$Acute Heart Failure - Merck Manual Professional Edition: loop diuretics are the mainstay of decongestion$sl189$,
  $sq189$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide, torsemide, bumetanide) in either oral or intravenous form.$sq189$,
  $ch189$a6093422e3df9c974e35aa6e163eb4d99cb265bfe69882340463440f3cb23410$ch189$,
  true,
  $ref189$[{"label":"Acute Heart Failure - Merck Manual Professional Edition: loop diuretics are the mainstay of decongestion","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$ref189$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id190$cmr8bhff4006i1ylo3hdv21ga$id190$,
  $fx190$re-rate|re-tag$fx190$,
  $sc190$A 28-year-old woman presents to the clinic with a 3-month history of fatigue, weight gain, and cold intolerance. She has a family history of thyroid disease. On examination, her heart rate is 60 bpm, and she has dry skin and hair loss. Laboratory tests reveal an elevated thyroid-stimulating hormone (TSH) level of 8.5 mIU/L and a low free thyroxine (T4) level.$sc190$,
  $qu190$What is the most appropriate next step in management for this patient?$qu190$,
  $op190${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"sensitivity-specificity-lr","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783287433114","examNumber":9303,"slotIndex":4,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-05T21:38:18.608Z"},"options":["Start levothyroxine therapy","Obtain thyroid antibodies","Schedule a thyroid ultrasound","Refer to an endocrinologist"]}$op190$,
  $ky190$Start levothyroxine therapy$ky190$,
  $ex190$The most appropriate next step in management is to start levothyroxine therapy, as the patient has primary hypothyroidism indicated by elevated TSH and low free T4 levels. Obtaining thyroid antibodies may be helpful in determining the etiology of hypothyroidism but is not necessary for initiating treatment. Scheduling a thyroid ultrasound is not indicated in this case, as there is no suspicion of thyroid nodules or malignancy. Referring to an endocrinologist may be considered if there are complications or uncertainties, but immediate treatment is warranted.

Clinical reasoning: Assess the patient's symptoms and lab results indicating hypothyroidism. Analyze the need for immediate treatment versus further testing. Integrate this information to determine that starting levothyroxine is the most appropriate next step.

Why other options are incorrect:
• Obtain thyroid antibodies: While this may provide information about the cause of hypothyroidism, it does not change the immediate need for treatment.
• Schedule a thyroid ultrasound: An ultrasound is not indicated unless there are concerns about nodules or malignancy.
• Refer to an endocrinologist: Referral is not necessary for straightforward cases of hypothyroidism; treatment can be initiated by the primary care physician.$ex190$,
  2,
  $dm190$reproductive-endocrine$dm190$,
  $tp190$thyroid-disorders$tp190$,
  NULL,
  NULL,
  NULL,
  $ch190$9df5164bc57148e2c7491a32b7e8061d0494f655c80df1be91c1602f313fd779$ch190$,
  true,
  $ref190$[{"label":"American Thyroid Association Guidelines"}]$ref190$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id191$cmru7tn2o001g1yd6flymj1p0$id191$,
  $fx191$re-rate|re-tag|rewrite$fx191$,
  $sc191$A 28-year-old woman has shortness of breath and wheezing after exposure to a known allergen. She has asthma. Respiratory rate is 28 breaths per minute, oxygen saturation is 88% on room air, and she is using accessory muscles. She speaks in short phrases, and wheezes are heard throughout both lungs.$sc191$,
  $qu191$Which of the following is the most appropriate initial management?$qu191$,
  $op191${"kind":"biostats","options":["Oxygen, repeated albuterol, ipratropium, and prednisone","Repeated albuterol, omitting oxygen and a corticosteroid","Prednisone, omitting oxygen and inhaled bronchodilators","Endotracheal intubation while wheezing is still heard","Discharge home to continue the usual rescue inhaler"],"stepLevel":"step3","physicianTask":"health-maintenance","blueprintTopic":"copd-asthma-exacerbation","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1784611601719","qcScore":7.9,"slotIndex":52,"stepLevel":"step3","examNumber":9301,"generatedAt":"2026-07-21T05:27:27.621Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"blueprintSystem":"respiratory-renal"}$op191$,
  $ky191$Oxygen, repeated albuterol, ipratropium, and prednisone$ky191$,
  $ex191$Accessory-muscle use, a respiratory rate of 28, short phrases, and saturation of 88% are a severe asthma exacerbation. She needs oxygen to raise saturation above 90%, repeated albuterol, ipratropium added to the beta agonist, and a systemic corticosteroid. Albuterol without oxygen and a corticosteroid leaves hypoxemia and airway inflammation untreated. Prednisone without oxygen and inhaled bronchodilators does not open the airway or correct the saturation. Intubation is for respiratory failure, and she is still wheezing and moving air. Discharge on the home inhaler leaves a severe exacerbation untreated.$ex191$,
  1,
  $dm191$respiratory-renal$dm191$,
  $tp191$copd-asthma-exacerbation$tp191$,
  $su191$https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations$su191$,
  $sl191$Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: oxygen to keep saturation above 90%, plus inhaled bronchodilators and a glucocorticoid$sl191$,
  $sq191$Supplemental oxygen is indicated for hypoxemia and should be given by nasal cannula or face mask at a flow rate or concentration sufficient to maintain oxygen saturation > 90%.$sq191$,
  $ch191$0f88c42a6bd04da2f11e84faa8ae0b10b3a8655a3d9066414dd4eb64ebaac45e$ch191$,
  true,
  $ref191$[{"label":"Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: oxygen to keep saturation above 90%, plus inhaled bronchodilators and a glucocorticoid","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations"}]$ref191$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id192$cmr8bhj7p007l1ylovxfagwaz$id192$,
  $fx192$re-rate|re-tag|rewrite$fx192$,
  $sc192$A 35-year-old man comes to the clinic because of increased thirst, frequent urination, and fatigue for 3 months. His weight has been stable. His body mass index is 34 kg/m2, and his father and sister have type 2 diabetes. Examination shows velvety hyperpigmented plaques in the axillae and on the back of the neck. Fasting blood glucose is 210 mg/dL and hemoglobin A1c is 9.2%. Urine ketones are negative.$sc192$,
  $qu192$Which of the following is the most likely underlying cause of this patient's condition?$qu192$,
  $op192${"options":["Marked peripheral insulin resistance","Autoimmune pancreatic beta-cell loss","A heterozygous glucokinase mutation","Primary absolute insulin deficiency"],"blueprintTopic":"diabetes-pathophysiology","blueprintSystem":"reproductive-endocrine"}$op192$,
  $ky192$Marked peripheral insulin resistance$ky192$,
  $ex192$Obesity, a strong family history of type 2 diabetes, velvety axillary and neck pigmentation, fasting glucose of 210 mg/dL, and hemoglobin A1c of 9.2% without ketones or weight loss indicate type 2 diabetes. That disease is characterized by peripheral insulin resistance with insulin secretion that is inadequate for the resistance, and the skin change is a marker of that resistance. Autoimmune beta-cell loss causes type 1 diabetes and tends to produce ketosis and weight loss, which he does not have. A glucokinase mutation causes mild, stable hyperglycemia rather than an A1c of 9.2% with this skin finding. Primary absolute insulin deficiency is the type 1 pattern, not this ketone-negative presentation.$ex192$,
  1,
  $dm192$reproductive-endocrine$dm192$,
  $tp192$diabetes-pathophysiology$tp192$,
  $su192$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus$su192$,
  $sl192$Type 2 Diabetes Mellitus - Merck Manual Professional Edition: insulin resistance with inadequate insulin secretion$sl192$,
  $sq192$Type 2 diabetes mellitus is characterized by insulin resistance and inadequate insulin secretion relative to needs.$sq192$,
  $ch192$2f87f2ef7b77ffabdd9d26fa5d82fd970ae30fea0672d568839f76f90df1d5b4$ch192$,
  true,
  $ref192$[{"label":"Type 2 Diabetes Mellitus - Merck Manual Professional Edition: insulin resistance with inadequate insulin secretion","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus"}]$ref192$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id193$cmr8ncoho00to1ygi7ghvderp$id193$,
  $fx193$re-tag|rewrite$fx193$,
  $sc193$A 60-year-old man with COPD has had worsening shortness of breath for one week. The volume of sputum has increased, and the sputum has turned yellow-green. Respiratory rate is 18 breaths per minute, oxygen saturation is 95% on room air, and blood pressure is 130/80 mm Hg. He speaks in full sentences. A chest radiograph shows hyperinflation and no infiltrate.$sc193$,
  $qu193$Which of the following is the most appropriate next step in management?$qu193$,
  $op193${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783307273791","examNumber":9310,"slotIndex":31,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T03:09:05.041Z"},"options":["Inhaled bronchodilator, prednisone, and antibiotic","Prednisone and bronchodilator without antibiotic","Antibiotic and prednisone without bronchodilator","Chest computed tomography prior to starting therapy"]}$op193$,
  $ky193$Inhaled bronchodilator, prednisone, and antibiotic$ky193$,
  $ex193$Increased dyspnea, increased sputum volume, and newly purulent yellow-green sputum are the three cardinal symptoms of a COPD exacerbation. Antibiotics are indicated for that triad, and treatment of the exacerbation also includes a bronchodilator and a systemic corticosteroid. Prednisone and a bronchodilator without an antibiotic leave out therapy that the purulent increase requires. An antibiotic and prednisone without a bronchodilator leave the airway obstruction untreated. Chest CT is not the next step when the radiograph shows no infiltrate and the three symptoms already direct treatment.$ex193$,
  3,
  $dm193$respiratory-renal$dm193$,
  $tp193$copd-asthma-exacerbation$tp193$,
  $su193$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation$su193$,
  $sl193$Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: antibiotics for increased dyspnea, sputum volume, and purulence$sl193$,
  $sq193$Antibiotics should be initiated if any of the following conditions are met: Presence of three cardinal symptoms: Increase in dyspnea, increase in sputum volume, and increase in sputum purulence.$sq193$,
  $ch193$5b28916bf036216a620bb31707ba7cced7d6f1e01e71748c023e14885053bb32$ch193$,
  true,
  $ref193$[{"label":"Treatment of Acute COPD Exacerbation - Merck Manual Professional Edition: antibiotics for increased dyspnea, sputum volume, and purulence","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/treatment-of-acute-copd-exacerbation"}]$ref193$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id194$cmr9860ry00dn1ywyzi1svtn0$id194$,
  $fx194$re-rate|re-tag|rewrite$fx194$,
  $sc194$A 50-year-old woman has fatigue, weight gain, and cold intolerance. Heart rate is 58 beats per minute and blood pressure is 130/85 mm Hg. The thyroid is firm and nontender. TSH is 12 mIU/L, free T4 is low, and thyroid peroxidase antibodies are present in high titer.$sc194$,
  $qu194$Which of the following is the most likely underlying cause of her condition?$qu194$,
  $op194${"kind":"biostats","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"thyroid-disorders","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783342324031","examNumber":9305,"slotIndex":14,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T12:52:55.129Z"},"options":["Chronic lymphocytic thyroiditis","Severe dietary iodine deficiency","A hyperfunctioning thyroid adenoma","A nonfunctioning pituitary adenoma"]}$op194$,
  $ky194$Chronic lymphocytic thyroiditis$ky194$,
  $ex194$Fatigue, weight gain, cold intolerance, a high TSH, and a low free T4 are primary hypothyroidism. A firm nontender thyroid and high-titer thyroid peroxidase antibodies identify chronic autoimmune thyroiditis, which is diagnosed by those antibodies and is the most common cause of primary hypothyroidism in North America. Iodine deficiency can enlarge the thyroid, but it is not diagnosed by peroxidase antibodies. A hyperfunctioning adenoma suppresses TSH and raises thyroid hormone. A pituitary mass that destroys thyrotrophs lowers TSH rather than raising it.$ex194$,
  1,
  $dm194$reproductive-endocrine$dm194$,
  $tp194$thyroid-disorders$tp194$,
  $su194$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hashimoto-thyroiditis$su194$,
  $sl194$Hashimoto Thyroiditis - Merck Manual Professional Edition: diagnosis by high-titer thyroid peroxidase antibodies$sl194$,
  $sq194$Diagnosis involves demonstration of high titers of thyroid peroxidase antibodies.$sq194$,
  $ch194$58122bb1360e9974972b5cc94011a272427f8142c22eba4b5c33096e8ffee54b$ch194$,
  true,
  $ref194$[{"label":"Hashimoto Thyroiditis - Merck Manual Professional Edition: diagnosis by high-titer thyroid peroxidase antibodies","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hashimoto-thyroiditis"}]$ref194$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id195$cmru9cykp007g1y0sz587ou9i$id195$,
  $fx195$re-rate|re-tag|rewrite$fx195$,
  $sc195$A 65-year-old woman has had worsening shortness of breath and cough for two days. She has COPD treated with a long-acting beta agonist. Temperature is 98.6 F (37 C). Respiratory rate is 24 breaths per minute and oxygen saturation is 88% on room air. She has bilateral wheezing, no chest pain, and no leg swelling. A chest radiograph shows hyperinflation and no infiltrate. Arterial blood gas shows pH 7.32, PaCO2 60 mm Hg, and PaO2 58 mm Hg.$sc195$,
  $qu195$Which of the following is the most likely diagnosis?$qu195$,
  $op195${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784614152465","examNumber":9303,"slotIndex":37,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-21T06:12:23.064Z"},"options":["An acute exacerbation of COPD","Community-acquired pneumonia","An acute pulmonary embolism","Uncomplicated acute bronchitis"]}$op195$,
  $ky195$An acute exacerbation of COPD$ky195$,
  $ex195$Known COPD with a new increase in dyspnea and cough, wheezing, hypoxemia, and carbon dioxide retention is an acute exacerbation, which is an increase in symptom severity during the course of the disease. She is afebrile and the radiograph shows hyperinflation without an infiltrate, so pneumonia is unlikely. Pulmonary embolism is unlikely with diffuse wheezing, no chest pain, and a PaCO2 of 60 mm Hg. Uncomplicated bronchitis does not account for this degree of ventilatory failure in a patient who already has COPD.$ex195$,
  1,
  $dm195$respiratory-renal$dm195$,
  $tp195$copd-asthma-exacerbation$tp195$,
  $su195$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd$su195$,
  $sl195$Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition: an exacerbation is a sporadic increase in symptom severity$sl195$,
  $sq195$Acute exacerbations occur sporadically during the course of COPD and are heralded by increased symptom severity.$sq195$,
  $ch195$20625b485a1911923b56a3e5167e8ffa563725f0799fa86181d4b9a22e8d0075$ch195$,
  true,
  $ref195$[{"label":"Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition: an exacerbation is a sporadic increase in symptom severity","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$ref195$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id196$cmr8ncmr900t61ygin88hs08t$id196$,
  $fx196$re-rate|re-tag$fx196$,
  $sc196$A 30-year-old man presents to the emergency department with severe abdominal pain and vomiting. He has a history of alcohol use disorder and has not eaten for the past two days. His vital signs show a heart rate of 110 bpm and blood pressure of 90/60 mm Hg. Laboratory tests reveal an elevated lipase level.$sc196$,
  $qu196$What is the most appropriate next step in management?$qu196$,
  $op196${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"nnt-arr","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783307273791","examNumber":9310,"slotIndex":13,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T03:09:02.991Z"},"options":["Administer intravenous fluids","Start broad-spectrum antibiotics","Perform an abdominal ultrasound","Initiate pain management"]}$op196$,
  $ky196$Administer intravenous fluids$ky196$,
  $ex196$The patient is presenting with signs of acute pancreatitis, likely secondary to alcohol use and fasting. The first step in management is to stabilize the patient with intravenous fluids to address potential hypovolemia and prevent complications. While pain management is important, it is not the immediate next step. Broad-spectrum antibiotics are not routinely indicated unless there is evidence of infection. An abdominal ultrasound may be considered later for further evaluation. (USMLE Content Outline 2026, Emergency Management).

Clinical reasoning: Assess the patient's presentation and lab results to confirm the diagnosis of acute pancreatitis. Analyze the need for stabilization and hydration before any other interventions. Integrate this information to determine that administering IV fluids is the most appropriate next step.

Why other options are incorrect:
• Start broad-spectrum antibiotics: This is incorrect as antibiotics are not indicated unless there is evidence of infection.
• Perform an abdominal ultrasound: While this may be part of the workup, it is not the immediate priority.
• Initiate pain management: Pain management is important but should not precede stabilization with fluids.$ex196$,
  1,
  $dm196$gastrointestinal$dm196$,
  $tp196$pancreatitis-hepatitis$tp196$,
  NULL,
  NULL,
  NULL,
  $ch196$aba1e620867e92630975935bb42c15c86f438d600438cd70dc2b51c8418e773e$ch196$,
  true,
  $ref196$[{"url":"https://www.nice.org.uk/guidance/cg174/chapter/Recommendations","label":"NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation."}]$ref196$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id197$cmr8lc5we009z1ygivfcggaqs$id197$,
  $fx197$re-rate|re-tag$fx197$,
  $sc197$A 28-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She reports that the pain started suddenly and is located in the right upper quadrant. On examination, her temperature is 100.8°F, and she has tenderness in the right upper quadrant with a positive Murphy's sign. Laboratory tests reveal elevated liver enzymes and bilirubin levels.$sc197$,
  $qu197$What is the most likely diagnosis?$qu197$,
  $op197${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"nnt-arr","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783303814341","qcScore":8.1,"slotIndex":22,"stepLevel":"step3","examNumber":9304,"generatedAt":"2026-07-06T02:11:28.531Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Acute cholecystitis","Acute pancreatitis","Hepatitis","Peptic ulcer disease"],"taskCategory":"clinical-intervention"}$op197$,
  $ky197$Acute cholecystitis$ky197$,
  $ex197$## Why this answer is correct
The most likely diagnosis is acute cholecystitis due to the classic presentation of symptoms.
• **Right upper quadrant pain** and a positive **Murphy's sign** indicate gallbladder inflammation.
• Elevated **liver enzymes** and **bilirubin** levels support biliary obstruction.
• Acute cholecystitis is commonly caused by **gallstones** blocking the cystic duct.
**In practice:** In practice, recognizing acute cholecystitis early can lead to timely surgical intervention, which is critical to prevent complications like perforation or infection.
## Why the other options are wrong



**Acute pancreatitis**
• Trap: Students may confuse the abdominal pain location, thinking it could also be in the right upper quadrant.
• Why it fails here: Acute pancreatitis typically presents with **epigastric pain** that can radiate to the back, not localized right upper quadrant pain or a positive Murphy's sign.
• Remember: Understanding the specific pain location and associated signs is crucial for accurate diagnosis.

**Hepatitis**
• Trap: Some may think hepatitis could cause similar lab findings without recognizing the symptom differences.
• Why it fails here: Hepatitis usually presents with more **systemic symptoms** like fatigue and jaundice, and does not typically cause localized tenderness in the right upper quadrant.
• Remember: Differentiating between systemic and localized symptoms is key in diagnosing liver-related conditions.

**Peptic ulcer disease**
• Trap: Students might assume that any abdominal pain could be due to ulcers, overlooking specific signs.
• Why it fails here: Peptic ulcer disease generally does not cause a positive Murphy's sign or the specific lab findings seen in this patient, such as elevated liver enzymes.
• Remember: Recognizing the unique clinical signs associated with each condition helps in making the correct diagnosis.
## Key takeaway
**When a patient presents with right upper quadrant pain and a positive Murphy's sign, think acute cholecystitis first.**

**Memory hook:** Remember: Murphy's sign = gallbladder trouble!$ex197$,
  1,
  $dm197$gastrointestinal$dm197$,
  $tp197$appendicitis-cholecystitis$tp197$,
  NULL,
  NULL,
  NULL,
  $ch197$0297796183b2f0cfd0bfb113cd6199014bd19b5b79d51b00815ffe33f1563cf7$ch197$,
  true,
  $ref197$[{"url":"https://medlineplus.gov/ency/article/000264.htm","label":"MedlinePlus Medical Encyclopedia. Acute cholecystitis."}]$ref197$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id198$cmr9buy1201jz1ywyv6qhkj6a$id198$,
  $fx198$re-rate|re-tag|rewrite$fx198$,
  $sc198$A 50-year-old woman with chronic kidney disease has fatigue and pallor. Blood pressure is 128/76 mm Hg. Hemoglobin is 8 g/dL, mean corpuscular volume is 90 fL, ferritin is 150 ng/mL, and creatinine is 3.5 mg/dL. She reports no black stools. There is no glossitis and no numbness in the feet.$sc198$,
  $qu198$Which of the following is the most likely cause of this patient's anemia?$qu198$,
  $op198${"kind":"biostats","stepLevel":"step3","blueprintSystem":"blood-lymph-immune","blueprintTopic":"anemia-workup","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783348528574","examNumber":9318,"slotIndex":5,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T14:36:15.556Z"},"options":["Reduced erythropoietin production","Iron deficiency from chronic bleeding","Impaired intestinal cobalamin uptake","Acute gastrointestinal blood loss"]}$op198$,
  $ky198$Reduced erythropoietin production$ky198$,
  $ex198$A hemoglobin of 8 g/dL with a normal mean corpuscular volume and a creatinine of 3.5 mg/dL is the anemia of chronic kidney disease. That anemia is usually caused by deficient erythropoietin production as functioning renal mass falls. Iron deficiency is unlikely with a ferritin of 150 ng/mL and a normal red-cell volume. Cobalamin deficiency is unlikely with a normal cell volume and no glossitis or numbness. Acute blood loss is unlikely with a stable blood pressure and no black stools.$ex198$,
  1,
  $dm198$blood-lymph-immune$dm198$,
  $tp198$anemia-workup$tp198$,
  $su198$https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease$su198$,
  $sl198$Chronic Kidney Disease - Merck Manual Professional Edition: the anemia is usually from deficient erythropoietin$sl198$,
  $sq198$It is usually caused by deficient erythropoietin production due to a reduction of functional renal mass (see page Anemias Caused by Deficient Erythropoiesis ).$sq198$,
  $ch198$655fe839ea99239ed6d29fb0f2255c42dbb7126b0c1b43ca3248d649b3f4a5c5$ch198$,
  true,
  $ref198$[{"label":"Chronic Kidney Disease - Merck Manual Professional Edition: the anemia is usually from deficient erythropoietin","url":"https://www.merckmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease"}]$ref198$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id199$cmqxe01j400e41yma6y8snsq0$id199$,
  $fx199$re-tag|rewrite$fx199$,
  $sc199$A 2-year-old girl is in the clinic for her routine immunizations. She is up to date. Her mother says the child has had a mild cold for a few days. Temperature is 100.4 F (38 C). She is playful, well hydrated, and in no respiratory distress.$sc199$,
  $qu199$Which of the following is the most appropriate next step?$qu199$,
  $op199${"options":["Give the vaccines scheduled for this visit","Postpone vaccines until the cold has resolved","Postpone the live vaccines at this visit","Start oseltamivir and defer the vaccines"],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"vaccination-schedules","blueprintSystem":"human-development","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step3-1782625870621","qcScore":8,"slotIndex":55,"stepLevel":"step3","examNumber":2621,"generatedAt":"2026-06-28T06:04:34.135Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"clinical-intervention"}$op199$,
  $ky199$Give the vaccines scheduled for this visit$ky199$,
  $ex199$A playful toddler with a mild cold and a temperature of 100.4 F has a mild illness, not a moderate or severe one. Vaccination during a mild illness is appropriate, so the vaccines due at this visit should be given. Deferral is reserved for moderate or severe acute illness. Live vaccines are not held back for a mild cold. Oseltamivir is not treatment for an undifferentiated cold and is not a reason to defer immunization.$ex199$,
  2,
  $dm199$human-development$dm199$,
  $tp199$vaccination-schedules$tp199$,
  $su199$https://www.immunize.org/ask-experts/topic/contraindications-precautions/$su199$,
  $sl199$Immunize.org Ask the Experts. A mild acute illness with or without fever is not a precaution, and vaccines may be given.$sl199$,
  $sq199$A mild acute illness (e.g., diarrhea or mild upper-respiratory tract infection) with or without fever is not a precaution, and vaccines may be given.$sq199$,
  $ch199$368e8a05f0da9c8331778d2a35141fe11a37eb2ff8ca33eed0b10ed75c5f8e4f$ch199$,
  true,
  $ref199$[{"label":"Immunize.org Ask the Experts. A mild acute illness with or without fever is not a precaution, and vaccines may be given.","url":"https://www.immunize.org/ask-experts/topic/contraindications-precautions/"}]$ref199$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id200$cmr8quz6201q41ygi1ehzwzx5$id200$,
  $fx200$re-rate|rewrite$fx200$,
  $sc200$A 28-year-old woman at 39 weeks of gestation has had regular contractions every 5 minutes for the past hour. She has not given birth before. Blood pressure is 110/70 mm Hg and heart rate is 85 beats per minute. The cervix is 4 cm dilated and 80% effaced. The fetal heart-rate tracing shows moderate variability, and early decelerations mirror the contractions.$sc200$,
  $qu200$Which of the following best describes this patient's labor?$qu200$,
  $op200${"options":["Latent phase of first-stage labor","Active phase of first-stage labor","Preterm labor despite term dating","False labor without cervical dilation"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"labor-delivery","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312868949","examNumber":9320,"slotIndex":32,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T04:49:52.472Z"}}$op200$,
  $ky200$Latent phase of first-stage labor$ky200$,
  $ex200$Regular contractions and a cervix dilated to 4 cm at 39 weeks mean she is in the first stage of labor. The latent phase is the interval before the active phase, and during it the cervix dilates into the range of 4 to 6 cm. The active phase is accelerated dilation, and failure of progress in that phase is judged after 6 cm, which she has not reached. Preterm labor is excluded by a gestation of 39 weeks. False labor does not dilate the cervix to 4 cm. Moderate variability with early decelerations does not change the phase of labor.$ex200$,
  1,
  $dm200$reproductive-endocrine$dm200$,
  $tp200$labor-delivery$tp200$,
  $su200$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/management-of-normal-labor$su200$,
  $sl200$Management of Normal Labor - Merck Manual Professional Edition: the latent phase precedes the active phase and includes dilation to 4 to 6 cm$sl200$,
  $sq200$The latent phase is the interval from the onset of labor to the onset of the active phase ( 1 ).$sq200$,
  $ch200$7bc44208c31300240596991d4ba1d1e598be534738005370bf5844455cbc9bd6$ch200$,
  true,
  $ref200$[{"label":"Management of Normal Labor - Merck Manual Professional Edition: the latent phase precedes the active phase and includes dilation to 4 to 6 cm","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/management-of-normal-labor"}]$ref200$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id201$cmr8ei0oj01ar1ylo2j4qcs59$id201$,
  $fx201$re-rate|rewrite$fx201$,
  $sc201$A 45-year-old man with type 2 diabetes comes for follow-up. For one week he has had increased thirst, frequent urination, and an unintentional loss of 8 pounds. Plasma glucose is 350 mg/dL and hemoglobin A1c is 10.6%. He takes metformin 1000 mg twice daily. Vital signs are stable and serum bicarbonate is 24 mEq/L.$sc201$,
  $qu201$Which of the following is the most appropriate next step in management?$qu201$,
  $op201${"options":["Start basal and bolus insulin","Add a GLP-1 receptor agonist","Raise the current metformin dose","Dietary advice and daily walking"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"diabetes-dka-management","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783292258170","examNumber":9315,"slotIndex":31,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T22:58:41.476Z"}}$op201$,
  $ky201$Start basal and bolus insulin$ky201$,
  $ex201$Polyuria, polydipsia, an 8-pound weight loss, glucose of 350 mg/dL, and hemoglobin A1c of 10.6% while taking metformin 1000 mg twice daily are symptomatic, catabolic hyperglycemia. Insulin is indicated when there is unintentional weight loss or when hyperglycemic symptoms accompany an A1c above 10% and a glucose of at least 300 mg/dL. A GLP-1 receptor agonist does not replace insulin for this degree of hyperglycemia and catabolism. Raising the metformin dose is not the treatment of this presentation. Diet and walking are useful but are not sufficient for a glucose of 350 mg/dL with weight loss.$ex201$,
  3,
  $dm201$reproductive-endocrine$dm201$,
  $tp201$diabetes-dka-management$tp201$,
  $su201$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus$su201$,
  $sl201$Type 2 Diabetes Mellitus - Merck Manual Professional Edition: start insulin for catabolism or for symptomatic hyperglycemia at this glucose and A1c$sl201$,
  $sq201$Insulin should generally be considered in patients with evidence of ongoing catabolism (unintentional weight loss) or symptoms of hyperglycemia (ie, polyuria, polydipsia) with HbA1C levels > 10% (86 mmol/mol) and blood glucose levels ≥ 300 mg/dL (16.7 mmol/L) ( 10 ).$sq201$,
  $ch201$811facea1a6ab7b0d6cf9c81ef420c4c24b4937748fba4e3c355eb2d71a2d42e$ch201$,
  true,
  $ref201$[{"label":"Type 2 Diabetes Mellitus - Merck Manual Professional Edition: start insulin for catabolism or for symptomatic hyperglycemia at this glucose and A1c","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/type-2-diabetes-mellitus"}]$ref201$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id202$b572c695-38fb-4b12-a9ac-a5dcdae51662$id202$,
  $fx202$re-rate|rewrite$fx202$,
  $sc202$A 62-year-old man is admitted to a medical ward with fever, cough, and a focal infiltrate on the chest radiograph. He has no chronic lung disease. He has not been hospitalized and has not received intravenous antibiotics in the past 90 days. He is not in shock. Oxygen saturation is 94% while he receives 2 L/min by nasal cannula. Blood pressure is 128/76 mm Hg.$sc202$,
  $qu202$Which of the following regimens is most appropriate?$qu202$,
  $op202${"options":["Ceftriaxone combined with azithromycin therapy","Cefepime, vancomycin, and azithromycin therapy","Vancomycin as the whole antibiotic regimen","Hold antibiotics until sputum cultures return","Metronidazole combined with azithromycin therapy"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"pneumonia-workup","kind":"vignette"}$op202$,
  $ky202$Ceftriaxone combined with azithromycin therapy$ky202$,
  $ex202$This is ward-level community-acquired pneumonia without shock. He has no prior respiratory isolation of MRSA or Pseudomonas and no recent hospitalization with intravenous antibiotics, which are the risk factors that would add those coverages. The regimen for an inpatient outside the ICU without those risks is a beta-lactam such as ceftriaxone plus a macrolide such as azithromycin. Cefepime plus vancomycin covers organisms he has no risk factors for. Vancomycin does not cover the typical and atypical respiratory pathogens as a complete regimen. Waiting for sputum delays treatment, and metronidazole does not cover the usual causes of this pneumonia.$ex202$,
  2,
  $dm202$respiratory-renal$dm202$,
  $tp202$pneumonia-workup$tp202$,
  $su202$https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia$su202$,
  $sl202$Community-Acquired Pneumonia - Merck Manual Professional Edition: without MRSA or Pseudomonas risk factors, use a beta-lactam plus a macrolide$sl202$,
  $sq202$Risk factors for MRSA or Pseudomonas aeruginosa include prior respiratory isolation of MRSA or P. aeruginosa or recent hospitalization + receipt of parenteral antibiotics (in the last 90 days).$sq202$,
  $ch202$5ba9aeb60fd239ff6e503ce483138688de63c042ebe22d9767de9580beecde3f$ch202$,
  true,
  $ref202$[{"label":"Community-Acquired Pneumonia - Merck Manual Professional Edition: without MRSA or Pseudomonas risk factors, use a beta-lactam plus a macrolide","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia"}]$ref202$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id203$cmr8ccgwg00kn1ylo90ngavte$id203$,
  $fx203$rewrite$fx203$,
  $sc203$A 70-year-old man with COPD has increased shortness of breath and a productive cough. Temperature is 101 F (38.3 C) and respiratory rate is 28 breaths per minute. Breath sounds are decreased, and wheezes are heard in both lungs, without a focal patch of crackles. He has no chest pain and no leg swelling. A chest radiograph shows hyperinflation and no infiltrate.$sc203$,
  $qu203$Which of the following is the most likely diagnosis?$qu203$,
  $op203${"kind":"sequential","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-asthma-exacerbation","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783288792039","qcScore":8.1,"slotIndex":33,"stepLevel":"step3","examNumber":9307,"generatedAt":"2026-07-05T22:01:07.582Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["An acute exacerbation of COPD","Community-acquired pneumonia","An acute pulmonary embolism","Uncomplicated acute bronchitis"],"taskCategory":"clinical-intervention"}$op203$,
  $ky203$An acute exacerbation of COPD$ky203$,
  $ex203$Increased dyspnea, cough, fever, and diffuse wheezing in a patient with COPD, with hyperinflation and no infiltrate, are an acute increase in the severity of his COPD. Pneumonia is unlikely without a focal infiltrate or a focal patch of crackles. Pulmonary embolism is unlikely without chest pain or leg swelling when the examination shows airway obstruction. Uncomplicated acute bronchitis, as a diagnosis separate from his COPD, does not capture this degree of tachypnea and fever in established COPD.$ex203$,
  2,
  $dm203$respiratory-renal$dm203$,
  $tp203$copd-asthma-exacerbation$tp203$,
  $su203$https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd$su203$,
  $sl203$Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition: exacerbations are heralded by increased symptom severity$sl203$,
  $sq203$Acute exacerbations occur sporadically during the course of COPD and are heralded by increased symptom severity.$sq203$,
  $ch203$6792468c7292350016c61c1c19ff7d7ee58a9afd365932da3cf5a6bec645dcb0$ch203$,
  true,
  $ref203$[{"label":"Chronic Obstructive Pulmonary Disease - Merck Manual Professional Edition: exacerbations are heralded by increased symptom severity","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$ref203$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id204$cmrwa1ywv001n1ynhwrkj3lkh$id204$,
  $fx204$re-rate|rewrite$fx204$,
  $sc204$A 24-year-old man comes to the emergency department with sudden shortness of breath and wheezing. He has asthma and left his inhaler at home. He is in distress and speaks in short phrases. Blood pressure is 118/76 mm Hg, heart rate is 110 beats per minute, respiratory rate is 28 breaths per minute, temperature is 98.2 F (36.8 C), and oxygen saturation is 88% on room air. Wheezes are heard throughout both lungs.$sc204$,
  $qu204$Which of the following is the most appropriate initial treatment?$qu204$,
  $op204${"stepLevel":"step3","kind":"ccs_prompt","caseData":{"setting":"emergency department","presentation":"24-year-old male with acute shortness of breath and wheezing","vitals":"BP: 118/76, HR: 110, RR: 28, Temp: 98.2°F, O2 Sat: 92%","timeline":"within 30 minutes"},"structureIds":["prostate","sternum"],"options":["Give oxygen plus repeated nebulized albuterol","Systemic corticosteroid before a bronchodilator","Intravenous magnesium before a bronchodilator","Chest radiograph before asthma treatment starts"],"blueprintTopic":"copd-asthma-exacerbation","blueprintSystem":"respiratory-renal"}$op204$,
  $ky204$Give oxygen plus repeated nebulized albuterol$ky204$,
  $ex204$Short phrases, a respiratory rate of 28, saturation of 88%, and diffuse wheezing are a severe asthma exacerbation. Oxygen is indicated to raise saturation above 90%, and repeated nebulized albuterol is the immediate bronchodilator. A systemic corticosteroid is part of treatment, but it should not be given ahead of the bronchodilator. Intravenous magnesium is reserved for severe attacks that do not respond to initial inhaled therapy. A chest radiograph is not the first step when the picture is a typical asthma attack.$ex204$,
  2,
  $dm204$respiratory-renal$dm204$,
  $tp204$copd-asthma-exacerbation$tp204$,
  $su204$https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations$su204$,
  $sl204$Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: oxygen for saturation at or below 90% and immediate inhaled albuterol$sl204$,
  $sq204$Supplemental oxygen is indicated for hypoxemia and should be given by nasal cannula or face mask at a flow rate or concentration sufficient to maintain oxygen saturation > 90%.$sq204$,
  $ch204$4d9b5b2ad55e010a525592eefb04ceedd86d40f9d47360557584b4ba9d24d92d$ch204$,
  true,
  $ref204$[{"label":"Treatment of Acute Asthma Exacerbations - Merck Manual Professional Edition: oxygen for saturation at or below 90% and immediate inhaled albuterol","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/treatment-of-acute-asthma-exacerbations"}]$ref204$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id205$0916ff4c-f1e8-4b53-8dce-9faa14f3ade7$id205$,
  $fx205$re-rate|rewrite$fx205$,
  $sc205$A 22-year-old woman has had an asthma attack for six hours. Her respiratory rate is 30 breaths per minute, she speaks one word at a time, and oxygen saturation is 90% on room air. Arterial blood gas shows pH 7.38 and PaCO2 40 mm Hg.$sc205$,
  $qu205$Which plan is most appropriate?$qu205$,
  $op205${"options":["Treat in the hospital as life-threatening asthma","Discharge her because a normal PaCO2 is safe","Give an anxiolytic to slow her breathing rate","Send her home on azithromycin after one nebulizer","Order a chest radiograph and withhold asthma care"],"blueprintSystem":"respiratory-renal","taskCategory":"clinical-intervention","blueprintTopic":"copd-asthma-exacerbation","kind":"vignette"}$op205$,
  $ky205$Treat in the hospital as life-threatening asthma$ky205$,
  $ex205$A normal PaCO2 while she is still breathing 30 times a minute and speaking one word at a time signals impending respiratory fatigue, and that finding places a severe attack in the life-threatening category. She needs hospital treatment rather than a discharge prescription. An anxiolytic slows the drive she is using to ventilate and does not relieve the bronchospasm. Azithromycin after one nebulizer leaves the airway obstruction untreated. A chest radiograph does not replace oxygen, bronchodilators, and continued observation.$ex205$,
  2,
  $dm205$respiratory-renal$dm205$,
  $tp205$copd-asthma-exacerbation$tp205$,
  $su205$https://pmc.ncbi.nlm.nih.gov/articles/PMC8806296/$su205$,
  $sl205$PMC review of acute asthma: a normal PaCO2 during a severe attack signals impending respiratory fatigue and is listed with life-threatening asthma.$sl205$,
  $sq205$A normal partial pressure of CO 2 (PaCO 2 )in a patient with a severe asthma attack can be a sign of impending respiratory fatigue.$sq205$,
  $ch205$92c8362fb6e3b48838fe3c3861a6cf4d4a7ce12b7b1e3f9194a0f4d8e8c4b6b7$ch205$,
  true,
  $ref205$[{"label":"PMC review of acute asthma: a normal PaCO2 during a severe attack signals impending respiratory fatigue and is listed with life-threatening asthma.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC8806296/"}]$ref205$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id206$0bdc0c21-afa0-40ad-8fb2-0f5d42eac481$id206$,
  $fx206$re-rate|rewrite$fx206$,
  $sc206$A 66-year-old man has fever, a new oxygen requirement, and a focal infiltrate on the chest radiograph. Procalcitonin is 0.08 ng/mL. Blood pressure is 110/68 mm Hg and the respiratory rate is 24 breaths per minute. He is ill enough to stay in the hospital.$sc206$,
  $qu206$Which treatment plan is most appropriate?$qu206$,
  $op206${"options":["Begin empiric antibiotics despite the low procalcitonin","Repeat procalcitonin tomorrow and treat if the value rises","Give oseltamivir and wait on the sputum culture result","Give one antibiotic dose and stop if the level stays low","Withhold antibiotics because this procalcitonin result is low"],"blueprintSystem":"respiratory-renal","taskCategory":"pharmacotherapy","blueprintTopic":"pneumonia-workup","kind":"vignette"}$op206$,
  $ky206$Begin empiric antibiotics despite the low procalcitonin$ky206$,
  $ex206$He already has fever, hypoxia, and a radiographic infiltrate, which is clinically suspected and radiographically confirmed pneumonia. Empiric antibiotics are started regardless of the initial procalcitonin. Waiting a day to see whether the value rises leaves the infection untreated. Oseltamivir does not treat bacterial pneumonia, and no influenza test is described. A single dose that is then stopped does not complete therapy. Withholding antibiotics because the procalcitonin is low is the decision the guideline rejects in confirmed pneumonia.$ex206$,
  2,
  $dm206$respiratory-renal$dm206$,
  $tp206$pneumonia-workup$tp206$,
  $su206$https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/$su206$,
  $sl206$ATS/IDSA community-acquired pneumonia guideline: start empiric antibiotics regardless of the initial procalcitonin.$sl206$,
  $sq206$We recommend that empiric antibiotic therapy should be initiated in adults with clinically suspected and radiographically confirmed CAP regardless of initial serum procalcitonin level (strong recommendation, moderate quality of evidence).$sq206$,
  $ch206$19ccc744f5d2ff319dcadd58e6b4747ff849658044da082956febdcbe360a2f4$ch206$,
  true,
  $ref206$[{"label":"ATS/IDSA community-acquired pneumonia guideline: start empiric antibiotics regardless of the initial procalcitonin.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"}]$ref206$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id207$0e7382de-a43d-4542-b065-65e263e05ce9$id207$,
  $fx207$re-rate|rewrite$fx207$,
  $sc207$A 26-year-old woman is stabbed in zone II of the neck. A hematoma is expanding, her voice is hoarse, and she is drooling. Oxygen saturation is 91% and falling.$sc207$,
  $qu207$Which next step is most appropriate?$qu207$,
  $op207${"options":["Secure her airway before any computed tomography","Perform CT angiography before the airway is secured","Give oral antibiotics and wrap the open neck wound","Discharge her if hoarseness lessens while she rests","Start a heparin infusion for the expanding hematoma"],"blueprintSystem":"multisystem","taskCategory":"clinical-intervention","blueprintTopic":"trauma-atls","kind":"vignette"}$op207$,
  $ky207$Secure her airway before any computed tomography$ky207$,
  $ex207$An expanding neck hematoma can obstruct the airway, and drooling with a falling saturation means protection and oxygenation are already uncertain. The airway is secured before imaging. Computed tomography before the airway is controlled leaves her unprotected while the hematoma expands. Oral antibiotics and a wrap do not open the airway. Discharge ignores an unstable neck wound. Heparin does not secure the airway and can worsen bleeding into the neck.$ex207$,
  2,
  $dm207$multisystem$dm207$,
  $tp207$trauma-atls$tp207$,
  $su207$https://www.merckmanuals.com/professional/injuries-poisoning/approach-to-the-trauma-patient/approach-to-the-trauma-patient$su207$,
  $sl207$Merck Manual, Approach to the Trauma Patient: uncertain airway protection or oxygenation requires endotracheal intubation, and a neck hematoma can threaten the airway.$sl207$,
  $sq207$Obtunded patients whose airway patency, airway protective mechanisms, oxygenation, or ventilation is uncertain and patients with significant oropharyngeal injury require endotracheal intubation$sq207$,
  $ch207$0874712dc5ac1fb7fc62bfad565f7dccebab100542303af1f9901292755ad666$ch207$,
  true,
  $ref207$[{"label":"Merck Manual, Approach to the Trauma Patient: uncertain airway protection or oxygenation requires endotracheal intubation, and a neck hematoma can threaten the airway.","url":"https://www.merckmanuals.com/professional/injuries-poisoning/approach-to-the-trauma-patient/approach-to-the-trauma-patient"}]$ref207$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id208$cmrwa0y2a000x1ynhx0k6nbdy$id208$,
  $fx208$re-rate|rewrite$fx208$,
  $sc208$A 58-year-old postmenopausal woman has fatigue, pallor, and dyspnea on exertion. Blood pressure is 140/90 mm Hg, heart rate is 95 beats per minute, and oxygen saturation is 98% on room air. Hemoglobin is 8 g/dL, mean corpuscular volume is 72 fL, and ferritin is 8 ng/mL.$sc208$,
  $qu208$Which plan is most appropriate?$qu208$,
  $op208${"stepLevel":"step3","kind":"ccs_prompt","caseData":{"setting":"outpatient-clinic","presentation":"A 58-year-old female with hypertension and diabetes presents with fatigue, pallor, and shortness of breath on exertion.","vitals":"BP: 140/90 mmHg, HR: 95 bpm, RR: 18/min, Temp: 98.4°F, O2 Sat: 98% on room air","timeline":"Next day"},"structureIds":["heart","lungs","kidneys"],"options":["Start iron and arrange colonoscopy plus upper endoscopy","Start oral iron and skip any gastrointestinal evaluation","Refer her for bone marrow biopsy before giving iron","Start parenteral vitamin B12 and observe the anemia"],"blueprintTopic":"gi-bleed-management","blueprintSystem":"gastrointestinal"}$op208$,
  $ky208$Start iron and arrange colonoscopy plus upper endoscopy$ky208$,
  $ex208$Low ferritin with a microcytic anemia establishes iron deficiency, iron is replaced to rebuild stores, and blood loss is looked for with both colonoscopy and upper endoscopy. Iron without a gastrointestinal evaluation can leave a bleeding lesion, including a malignancy, undiscovered. Bone marrow biopsy is not the first test once iron deficiency is already shown by the ferritin. Vitamin B12 deficiency produces a macrocytic anemia, not a low ferritin and a low mean corpuscular volume.$ex208$,
  3,
  $dm208$gastrointestinal$dm208$,
  $tp208$gi-bleed-management$tp208$,
  $su208$https://medlineplus.gov/ency/article/000584.htm$su208$,
  $sl208$MedlinePlus, Iron deficiency anemia: iron supplements rebuild stores, and colonoscopy and upper endoscopy are used to look for blood loss.$sl208$,
  $sq208$To check for causes of blood loss, your provider may order: Colonoscopy Fecal occult blood test Upper endoscopy$sq208$,
  $ch208$65c33aef54cf1da36cb0305a07cf4e78af821d4d006ef016b909e9b50ddd3e6c$ch208$,
  true,
  $ref208$[{"label":"MedlinePlus, Iron deficiency anemia: iron supplements rebuild stores, and colonoscopy and upper endoscopy are used to look for blood loss.","url":"https://medlineplus.gov/ency/article/000584.htm"}]$ref208$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id209$1b35d25d-76d6-4bc6-b063-27d0d5c17c8e$id209$,
  $fx209$re-rate|rewrite$fx209$,
  $sc209$A 22-year-old man has had type 1 diabetes since age 9. A recent C-peptide level was undetectable. He has had ketoacidosis twice after omitting basal insulin. The A1c is 7.6%. He wants to stop insulin and use a friend's semaglutide to lose weight.$sc209$,
  $qu209$Which plan is most appropriate?$qu209$,
  $op209${"options":["Continue insulin; a GLP-1 agonist cannot replace it","Stop the insulin and start semaglutide in its place","Stop the insulin on days when he is eating less food","Stop the insulin and start metformin in its place","Use correction-scale insulin and drop the basal dose"],"blueprintSystem":"reproductive-endocrine","taskCategory":"pharmacotherapy","blueprintTopic":"diabetes-dka-management","kind":"vignette"}$op209$,
  $ky209$Continue insulin; a GLP-1 agonist cannot replace it$ky209$,
  $ex209$People with type 1 diabetes do not make enough insulin and develop ketoacidosis without it, which he has already done when he skipped basal insulin. An undetectable C-peptide confirms that a GLP-1 receptor agonist cannot stand in for insulin. Stopping insulin for semaglutide removes the hormone he lacks. Skipping insulin on days he eats less is the same omission that previously caused ketoacidosis. Metformin does not replace insulin. Correction doses without basal insulin leave him without background coverage.$ex209$,
  1,
  $dm209$reproductive-endocrine$dm209$,
  $tp209$diabetes-dka-management$tp209$,
  $su209$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/drug-treatment-of-diabetes-mellitus$su209$,
  $sl209$Merck Manual, drug treatment of diabetes: insulin is required in type 1 diabetes because these patients develop ketoacidosis without it.$sl209$,
  $sq209$Insulin is required for all patients with type 1 diabetes mellitus because they do not produce adequate insulin (due to destruction of the pancreatic beta-cells) and will develop ketoacidosis without it.$sq209$,
  $ch209$9f5f930dd175441d1bb867a7de4fcc2017f60a440b31b8e8ff0c81a8deaf2026$ch209$,
  true,
  $ref209$[{"label":"Merck Manual, drug treatment of diabetes: insulin is required in type 1 diabetes because these patients develop ketoacidosis without it.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/drug-treatment-of-diabetes-mellitus"}]$ref209$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id210$dc430b91-da37-481d-beb1-553095b5b579$id210$,
  $fx210$re-rate|rewrite$fx210$,
  $sc210$A 46-year-old woman with type 2 diabetes has continued empagliflozin while eating little for two days. Glucose is 136 mg/dL, venous pH is 7.18, and bicarbonate is 9 mEq/L. Serum ketones are large. She has nausea.$sc210$,
  $qu210$Which plan is most appropriate?$qu210$,
  $op210${"options":["Stop empagliflozin and infuse dextrose, insulin, and potassium","Discharge her from the hospital because glucose is under 200","Give insulin in dextrose-free fluid and keep empagliflozin","Double the empagliflozin and repeat the laboratory panel tomorrow","Start metformin and send her home once the nausea improves"],"blueprintSystem":"reproductive-endocrine","taskCategory":"pharmacotherapy","blueprintTopic":"diabetes-dka-management","kind":"vignette"}$op210$,
  $ky210$Stop empagliflozin and infuse dextrose, insulin, and potassium$ky210$,
  $ex210$An SGLT2 inhibitor can cause ketoacidosis while the glucose is normal or only mildly elevated, and her pH, bicarbonate, and large ketones show that this has happened. The drug is stopped. Because the glucose is already well below the range at which dextrose is added, the insulin infusion is given in dextrose-containing fluid, and potassium is replaced as the protocol requires. A glucose under 200 mg/dL does not make the acidosis safe for discharge. Insulin in dextrose-free fluid, while the offending drug is continued, risks hypoglycemia before the ketones clear. More empagliflozin adds the precipitant. Metformin does not treat ketoacidosis.$ex210$,
  2,
  $dm210$reproductive-endocrine$dm210$,
  $tp210$diabetes-dka-management$tp210$,
  $su210$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka$su210$,
  $sl210$Merck Manual, diabetic ketoacidosis: SGLT2 inhibitors can cause euglycemic ketoacidosis, and dextrose is added to insulin therapy when glucose is already low.$sl210$,
  $sq210$In pregnant patients and in patients taking SGLT2 inhibitors, DKA may occur at lower or even normal blood glucose levels (euglycemic DKA).$sq210$,
  $ch210$6f6bda0237387ccae5572cf0da15fd8c339e5ded5b3c6ad681d2b7b095fad168$ch210$,
  true,
  $ref210$[{"label":"Merck Manual, diabetic ketoacidosis: SGLT2 inhibitors can cause euglycemic ketoacidosis, and dextrose is added to insulin therapy when glucose is already low.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka"}]$ref210$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id211$b7ff8ff1-001c-4a69-93b7-c556695159fb$id211$,
  $fx211$re-rate|rewrite$fx211$,
  $sc211$A 46-year-old man with type 2 diabetes takes 30 units of basal insulin each day. He has a stomach illness and is eating about half his usual food. Glucose values are 180 to 220 mg/dL and ketones are negative. He plans to skip the basal insulin until his appetite returns.$sc211$,
  $qu211$Which plan is most appropriate?$qu211$,
  $op211${"options":["Continue his prescribed basal insulin during illness","Stop every insulin dose until his appetite returns","Double his basal insulin dose for this whole illness","Replace his insulin with a sulfonylurea instead","Have him exercise during the illness to lower glucose"],"blueprintSystem":"reproductive-endocrine","taskCategory":"pharmacotherapy","blueprintTopic":"diabetes-dka-management","kind":"vignette"}$op211$,
  $ky211$Continue his prescribed basal insulin during illness$ky211$,
  $ex211$Basal insulin suppresses hepatic glucose production, especially in the fasting state, so it is continued while he is eating less and glucose is still 180 to 220 mg/dL. Stopping every dose removes that background insulin. Doubling the basal dose is not called for by these readings while intake is down. A sulfonylurea does not replace the insulin he is already using, and exercise during an acute stomach illness is not the way to manage this glucose.$ex211$,
  1,
  $dm211$reproductive-endocrine$dm211$,
  $tp211$diabetes-dka-management$tp211$,
  $su211$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetes-mellitus-dm$su211$,
  $sl211$Merck Manual Professional. Basal insulin suppresses hepatic glucose production, especially in the fasting state.$sl211$,
  $sq211$is used to simulate basal insulin production that suppresses hepatic glucose production, especially in the fasting state$sq211$,
  $ch211$fd11a863d4a04987e21791d413cadd3d85b4bd258c343882dda0e5fb3d97fe4f$ch211$,
  true,
  $ref211$[{"label":"Merck Manual Professional. Basal insulin suppresses hepatic glucose production, especially in the fasting state.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetes-mellitus-dm"}]$ref211$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id212$cmr8p26lg019p1ygiafdexu19$id212$,
  $fx212$re-rate|rewrite$fx212$,
  $sc212$A 32-year-old woman who takes lithium for bipolar disorder comes to the emergency department with nausea and a coarse tremor. She is alert and oriented. Blood pressure is 130/85 mm Hg and heart rate is 96 beats per minute. The serum lithium level is 2.5 mEq/L and creatinine is 0.8 mg/dL. She has had no seizure.$sc212$,
  $qu212$Which next step is most appropriate?$qu212$,
  $op212${"options":["Give intravenous saline and discontinue lithium","Begin hemodialysis for this serum lithium level","Give activated charcoal and continue the lithium","Give lorazepam and keep the lithium at this dose"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"medication-monitoring","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783309815509","examNumber":9315,"slotIndex":20,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-06T03:51:18.813Z"}}$op212$,
  $ky212$Give intravenous saline and discontinue lithium$ky212$,
  $ex212$This is lithium toxicity during ongoing therapy, with nausea and tremor but preserved alertness and a normal creatinine. Hydration and stopping the drug are the initial measures. Hemodialysis is reserved for a level above 4 mEq/L, end-organ damage, or severe symptoms, and she has none of those. Activated charcoal is not the listed treatment and would leave her on lithium. Lorazepam may blunt distress but does not stop the exposure or clear the drug.$ex212$,
  3,
  $dm212$behavioral-nervous$dm212$,
  $tp212$medication-monitoring$tp212$,
  $su212$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/symptoms-and-treatment-of-specific-poisons$su212$,
  $sl212$Merck Manual, specific poisons: lithium toxicity is treated with hydration, and dialysis is for a level above 4 mEq/L, end-organ damage, or severe symptoms.$sl212$,
  $sq212$Acute: Hydration, diazepam , possibly dialysis for end-organ damage or serum lithium level > 4 mEq/L (4 mmol/L)$sq212$,
  $ch212$9acb7e52d8e96c1248aab563e3784fd6a2adf37d495ac601b31b69e54e75efc4$ch212$,
  true,
  $ref212$[{"label":"Merck Manual, specific poisons: lithium toxicity is treated with hydration, and dialysis is for a level above 4 mEq/L, end-organ damage, or severe symptoms.","url":"https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/symptoms-and-treatment-of-specific-poisons"}]$ref212$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id213$cmr8isc9602dc1yloekuvu6vs$id213$,
  $fx213$re-rate|rewrite$fx213$,
  $sc213$A 45-year-old woman has had anxiety, palpitations, tremor, sweating, and weight loss for one month. She takes sertraline. Blood pressure is 160/95 mm Hg and heart rate is 110 beats per minute. TSH is 0.1 mIU/L and free T4 is 2.5 ng/dL.$sc213$,
  $qu213$Which diagnosis is most likely?$qu213$,
  $op213${"options":["Hyperthyroidism with a suppressed TSH","Serotonin syndrome from the sertraline","Panic disorder as the cause of the illness","Pheochromocytoma with these thyroid tests"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"thyroid-disorders","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783299363408","examNumber":9327,"slotIndex":18,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T00:59:51.120Z"}}$op213$,
  $ky213$Hyperthyroidism with a suppressed TSH$ky213$,
  $ex213$Hyperthyroidism is a hypermetabolic state with elevated free thyroid hormone, and the TSH is suppressed except in rare pituitary causes. A month of weight loss, tremor, sweating, and palpitations with a low TSH and a high free T4 is that illness. Serotonin syndrome is an acute drug reaction with neuromuscular findings, not a month of weight loss and these thyroid tests. Panic disorder does not suppress TSH or raise free T4. Pheochromocytoma can cause palpitations and sweating, but it does not produce this thyroid pattern.$ex213$,
  1,
  $dm213$reproductive-endocrine$dm213$,
  $tp213$thyroid-disorders$tp213$,
  $su213$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism$su213$,
  $sl213$Merck Manual, Hyperthyroidism: the syndrome is hypermetabolism with elevated free thyroid hormone, and TSH is suppressed.$sl213$,
  $sq213$Hyperthyroidism is characterized by hypermetabolism and elevated serum levels of free thyroid hormones.$sq213$,
  $ch213$b43f1a1d1c380c03dbb81bb1ee089c7c60e36094786b4b5285fae10750076950$ch213$,
  true,
  $ref213$[{"label":"Merck Manual, Hyperthyroidism: the syndrome is hypermetabolism with elevated free thyroid hormone, and TSH is suppressed.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism"}]$ref213$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id214$cmq33a2dp007e1yiurzvru5c0$id214$,
  $fx214$re-rate|rewrite$fx214$,
  $sc214$A 62-year-old woman has the sudden onset of right-sided weakness and slurred speech. She has atrial fibrillation and takes no anticoagulant. Blood pressure is 178/96 mm Hg and the pulse is irregular at 88 beats per minute. Examination shows a right hemiparesis, a right facial droop, and dysarthria. Glucose is 142 mg/dL. Noncontrast head CT shows no hemorrhage.$sc214$,
  $qu214$Which mechanism best explains the deficit?$qu214$,
  $op214${"options":["Cardiac thrombus embolized into a cerebral artery","Demyelinating plaque in the cervical spinal cord","Lower motor neuron injury at the fifth cervical root","Metabolic encephalopathy without a focal brain lesion"],"blueprintTopic":"stroke-localization","blueprintSystem":"behavioral-nervous","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:45:22.735Z","rationaleQualityScore":100}}$op214$,
  $ky214$Cardiac thrombus embolized into a cerebral artery$ky214$,
  $ex214$Atrial fibrillation produces cardiac thrombi that embolize into the cerebral arterial tree, and a sudden hemiparesis with facial weakness and dysarthria is a focal ischemic deficit. The CT shows no hemorrhage, so the deficit is not a bleed. A spinal demyelinating plaque does not appear in one moment with an irregular pulse and this hemispheric pattern. A lower motor neuron lesion at one cervical root does not cause face and speech involvement together with hemiparesis. A metabolic encephalopathy is not a sudden focal syndrome, and the glucose is not low.$ex214$,
  1,
  $dm214$behavioral-nervous$dm214$,
  $tp214$stroke-localization$tp214$,
  $su214$https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke$su214$,
  $sl214$Merck Manual, Ischemic Stroke: emboli may originate as cardiac thrombi, especially in atrial fibrillation.$sl214$,
  $sq214$Emboli may originate as cardiac thrombi, especially in the following conditions: Atrial fibrillation$sq214$,
  $ch214$09b56ad313eada566a3c86a4fbc89e2d7d1595f7a7bbf4f91a889e02db940c2b$ch214$,
  true,
  $ref214$[{"label":"Merck Manual, Ischemic Stroke: emboli may originate as cardiac thrombi, especially in atrial fibrillation.","url":"https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$ref214$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id215$cmr8gr79d01ua1yloafusp3nt$id215$,
  $fx215$re-rate|rewrite$fx215$,
  $sc215$A 32-year-old woman with generalized anxiety disorder has taken sertraline 100 mg daily for 8 weeks. Anxiety and insomnia have improved only partly. Blood pressure is 120/75 mm Hg and heart rate is 78 beats per minute. She takes no other medication and has not had psychotherapy.$sc215$,
  $qu215$Which next step is most appropriate?$qu215$,
  $op215${"options":["Add cognitive therapy and continue sertraline","Replace sertraline with a standing benzodiazepine","Stop sertraline and observe her off all treatment","Add an antipsychotic for the remaining anxiety"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"anxiety-disorders","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783295681707","examNumber":9321,"slotIndex":34,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-06T00:02:38.800Z"}}$op215$,
  $ky215$Add cognitive therapy and continue sertraline$ky215$,
  $ex215$An SSRI is a preferred medicine for generalized anxiety disorder, and psychotherapy can be used with medication. She has had eight weeks of partial benefit and has not started psychotherapy, so the next step is to add that treatment and keep the sertraline. A standing benzodiazepine can cause physical dependence and is not the preferred ongoing treatment. Stopping a partly effective SSRI leaves her without the medicine that has already helped. An antipsychotic is not the preferred treatment for this disorder.$ex215$,
  2,
  $dm215$behavioral-nervous$dm215$,
  $tp215$anxiety-disorders$tp215$,
  $su215$https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/generalized-anxiety-disorder$su215$,
  $sl215$Merck Manual, Generalized Anxiety Disorder: treatment is psychotherapy, an SSRI or SNRI, or both, and sustained benzodiazepine use can cause dependence.$sl215$,
  $sq215$Treatment includes behavioral interventions, psychotherapy, pharmacotherapy, or a combination.$sq215$,
  $ch215$5ff3affd5a0be95dd22437ac5e1f0d2a4d51f28f99aca4e1cc3a57d8ae728ad6$ch215$,
  true,
  $ref215$[{"label":"Merck Manual, Generalized Anxiety Disorder: treatment is psychotherapy, an SSRI or SNRI, or both, and sustained benzodiazepine use can cause dependence.","url":"https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/generalized-anxiety-disorder"}]$ref215$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id216$cmqxeg7s700gf1ymawk72bm1l$id216$,
  $fx216$re-rate|rewrite$fx216$,
  $sc216$A 65-year-old woman has had decreased urine output for two days. She has hypertension and type 2 diabetes. Blood pressure is 150/90 mm Hg and heart rate is 110 beats per minute. Creatinine is 2.5 mg/dL and potassium is 6.8 mEq/L. The electrocardiogram shows peaked T waves and a widened QRS.$sc216$,
  $qu216$Which next step is most appropriate?$qu216$,
  $op216${"kind":"image_based","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"aki-ckd-electrolytes","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step3-1782626867172","qcScore":8.3,"slotIndex":6,"stepLevel":"step3","examNumber":9172,"generatedAt":"2026-06-28T06:09:48.385Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Give intravenous calcium before other measures","Start hemodialysis and give no intravenous calcium","Give sodium polystyrene sulfonate and nothing more","Recheck the potassium level on the following day"],"taskCategory":"health-maintenance"}$op216$,
  $ky216$Give intravenous calcium before other measures$ky216$,
  $ex216$Potassium of 6.8 mEq/L with a widened QRS is moderate to severe hyperkalemia affecting the cardiac membrane. Intravenous calcium antagonizes that effect within minutes and is a temporizing step while insulin, glucose, and, if needed, dialysis are arranged. Hemodialysis without calcium first skips the immediate membrane protection. A resin alone acts over hours and is the approach used for milder elevations, not a widened QRS. Waiting until the next day leaves the conduction abnormality untreated.$ex216$,
  1,
  $dm216$respiratory-renal$dm216$,
  $tp216$aki-ckd-electrolytes$tp216$,
  $su216$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su216$,
  $sl216$Merck Manual, Hyperkalemia: intravenous calcium antagonizes the cardiac effect and is a temporizing measure while other treatment or dialysis is arranged.$sl216$,
  $sq216$Calcium infusion is a temporizing measure while awaiting the effects of other treatments or initiation of hemodialysis and may need to be repeated.$sq216$,
  $ch216$7e92b119e54c031fda8b89a2eff538a48850466da5cffe0d3d53a0a2a6c9306a$ch216$,
  true,
  $ref216$[{"label":"Merck Manual, Hyperkalemia: intravenous calcium antagonizes the cardiac effect and is a temporizing measure while other treatment or dialysis is arranged.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia"}]$ref216$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id217$cmrvwxwxo005v1ye8q1hqvqvl$id217$,
  $fx217$re-rate|rewrite$fx217$,
  $sc217$A 32-year-old woman at 39 weeks of gestation is in labor, and the membranes ruptured 3 hours ago. She is receiving oxytocin. Blood pressure is 110/70 mm Hg, heart rate is 80 beats per minute, and she is afebrile. The fetal heart tracing shows recurrent late decelerations with absent baseline variability.$sc217$,
  $qu217$Which next step is most appropriate?$qu217$,
  $op217${"stepLevel":"step3","kind":"ccs_prompt","caseData":{"setting":"labor and delivery","presentation":"32-year-old pregnant woman in labor at 39 weeks with ruptured membranes","vitals":"BP: 110/70 mmHg, HR: 80 bpm, RR: 18/min, Temp: 98.6°F","timeline":"Ruptured membranes 3 hours ago"},"structureIds":["heart"],"options":["Give oxygen, reposition, stop oxytocin, and prepare delivery","Increase the oxytocin rate to accelerate progress of labor","Use amnioinfusion as the treatment for these late decelerations","Continue to observe and leave the present labor plan unchanged"],"blueprintTopic":"labor-delivery","blueprintSystem":"reproductive-endocrine"}$op217$,
  $ky217$Give oxygen, reposition, stop oxytocin, and prepare delivery$ky217$,
  $ex217$Absent variability plus recurrent late decelerations is an abnormal tracing and calls for immediate correction, including oxygen, repositioning, and stopping oxytocin, together with preparation for expedited delivery. Increasing oxytocin does the opposite of stopping the uterotonic that may be contributing. Amnioinfusion is not the corrective step described for this late-deceleration pattern. Observation without a change leaves an abnormal tracing untreated.$ex217$,
  2,
  $dm217$reproductive-endocrine$dm217$,
  $tp217$labor-delivery$tp217$,
  $su217$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/fetal-monitoring-during-labor-and-delivery$su217$,
  $sl217$Merck Manual, fetal monitoring: an abnormal pattern, including absent variability with recurrent late decelerations, requires oxygen, repositioning, stopping oxytocin, or preparation for expedited delivery.$sl217$,
  $sq217$Abnormal patterns require prompt actions to correct them (eg, supplemental oxygen, repositioning, treatment of maternal hypotension, discontinuation of oxytocin ) or preparation for an expedited delivery.$sq217$,
  $ch217$4a0ea0360c9e3c420d36c4f8311c25d3494767f4d1d7f8504ed2c7590a147e1b$ch217$,
  true,
  $ref217$[{"label":"Merck Manual, fetal monitoring: an abnormal pattern, including absent variability with recurrent late decelerations, requires oxygen, repositioning, stopping oxytocin, or preparation for expedited delivery.","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/fetal-monitoring-during-labor-and-delivery"}]$ref217$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id218$cmr8e5y9o017k1ylog5cpqpf1$id218$,
  $fx218$re-rate|rewrite$fx218$,
  $sc218$A 62-year-old woman with heart failure is seen one week after discharge for an exacerbation. She takes lisinopril, furosemide, and metoprolol and reports good adherence. She has new ankle swelling, sleeps on two pillows, and has gained 3 pounds. Blood pressure is 130/80 mm Hg and the pulse is 72 beats per minute. She has bibasilar crackles and pitting edema to the mid-shins.$sc218$,
  $qu218$Which next step is most appropriate?$qu218$,
  $op218${"options":["Increase the dose of furosemide she takes daily","Arrange the next clinic visit for about one month","Have her weigh herself daily and change no medicine","Stop the furosemide because her swelling seems mild"],"blueprintTopic":"chf-management","blueprintSystem":"cardiovascular"}$op218$,
  $ky218$Increase the dose of furosemide she takes daily$ky218$,
  $ex218$New orthopnea, weight gain, crackles, and edema are congestion, and acute heart failure is treated by decongestion with a loop diuretic such as furosemide. The dose she is already taking has not kept her dry, so it is increased. A visit in a month leaves the fluid in place. Daily weights are useful later, but they do not treat congestion that is already present. Stopping furosemide removes the diuretic while she is volume overloaded.$ex218$,
  1,
  $dm218$cardiovascular$dm218$,
  $tp218$chf-management$tp218$,
  $su218$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$su218$,
  $sl218$Merck Manual, Heart Failure: acute congestion is treated with a loop diuretic such as furosemide, given orally or intravenously.$sl218$,
  $sq218$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.$sq218$,
  $ch218$11b3f8f0a2ca6f4c36d5a3532b083b5e044d5bf8bc51bd262a7eb7660cfe458a$ch218$,
  true,
  $ref218$[{"label":"Merck Manual, Heart Failure: acute congestion is treated with a loop diuretic such as furosemide, given orally or intravenously.","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$ref218$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id219$cmqxdzxp200cs1ymad88el3l9$id219$,
  $fx219$re-rate|rewrite$fx219$,
  $sc219$A 68-year-old woman with heart failure and an ejection fraction of 35% takes furosemide 40 mg daily. She has worsening dyspnea and leg edema. Blood pressure is 110/70 mm Hg and heart rate is 85 beats per minute. The lungs have bilateral crackles, and she has pitting edema of both legs.$sc219$,
  $qu219$Which next step is most appropriate?$qu219$,
  $op219${"options":["Increase the loop diuretic for this congestion","Start digoxin as treatment for the congestion","Start a beta-blocker during this acute congestion","Give intravenous nitroglycerin for this congestion"],"kind":"lab_interpretation","taskCategory":"communication","blueprintTopic":"chf-management","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step3-1782625870621","qcScore":8.4,"slotIndex":2,"stepLevel":"step3","examNumber":2621,"generatedAt":"2026-06-28T05:52:32.690Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"communication","labTable":{"BNP":"950 pg/mL","K+":"4.0 mEq/L"}}$op219$,
  $ky219$Increase the loop diuretic for this congestion$ky219$,
  $ex219$Dyspnea, crackles, and edema are fluid overload, and the immediate treatment of acute heart failure is a loop diuretic, by mouth or vein. She is already on a modest dose of furosemide that has not relieved the congestion, so the diuretic is increased. Digoxin is not the decongestive therapy. A new beta-blocker is not the treatment of acute fluid overload. Intravenous nitroglycerin is used when high blood pressure is part of the picture, and her pressure is 110/70 mm Hg.$ex219$,
  2,
  $dm219$cardiovascular$dm219$,
  $tp219$chf-management$tp219$,
  $su219$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$su219$,
  $sl219$Merck Manual, Heart Failure: loop diuretics are the decongestive treatment for acute heart failure.$sl219$,
  $sq219$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.$sq219$,
  $ch219$4b9ce6064bbd850493acdd76e5900552a1b08a4e71342433c34f75216fc3390f$ch219$,
  true,
  $ref219$[{"label":"Merck Manual, Heart Failure: loop diuretics are the decongestive treatment for acute heart failure.","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$ref219$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id220$cmrwa2w5i002e1ynh6o2cvpmh$id220$,
  $fx220$re-rate|rewrite$fx220$,
  $sc220$A 70-year-old woman with hypertension has had three sudden losses of consciousness in the past month, the most recent yesterday. Each began without warning while she was seated, and she recovered fully within a minute. She takes amlodipine. Blood pressure is 135/80 mm Hg with no orthostatic drop, and the heart rate is 72 beats per minute. The examination is normal. The electrocardiogram shows right bundle branch block and left anterior fascicular block.$sc220$,
  $qu220$Which next step is most appropriate?$qu220$,
  $op220${"options":["Order electrophysiology testing for the syncope","Order outpatient Holter monitoring for the syncope","Order tilt-table testing for this syncope episode","Order brain MRI and routine follow-up for syncope"],"blueprintTopic":"arrhythmias-management","blueprintSystem":"cardiovascular"}$op220$,
  $ky220$Order electrophysiology testing for the syncope$ky220$,
  $ex220$Syncope without warning and with immediate recovery suggests a transient arrhythmia, and the electrocardiogram already shows bifascicular block. When a conduction abnormality is detected or strongly suspected, the evaluation proceeds to electrophysiologic testing rather than to ambulatory monitoring meant for an unclear tracing. A tilt-table test is for a suspected reflex cause, and she has no prodrome and no orthostatic drop. Brain imaging does not explain sudden syncope with immediate full recovery and a normal examination.$ex220$,
  3,
  $dm220$cardiovascular$dm220$,
  $tp220$arrhythmias-management$tp220$,
  $su220$https://www.merckmanuals.com/professional/cardiovascular-disorders/symptoms-of-cardiovascular-disorders/syncope$su220$,
  $sl220$Merck Manual, Syncope: if the ECG is unclear, consider a Holter monitor; electrophysiologic testing is used when an abnormality is detected or strongly suspected.$sl220$,
  $sq220$Electrophysiologic testing if abnormalities detected or strongly suspected$sq220$,
  $ch220$6f053c204939d5f9eb5803dfe9b0e7978e51bb01c182ab1773425c08b0c93d3c$ch220$,
  true,
  $ref220$[{"label":"Merck Manual, Syncope: if the ECG is unclear, consider a Holter monitor; electrophysiologic testing is used when an abnormality is detected or strongly suspected.","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/symptoms-of-cardiovascular-disorders/syncope"}]$ref220$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id221$cmru32kes003j1y7whksb5ds4$id221$,
  $fx221$re-rate|rewrite$fx221$,
  $sc221$A 75-year-old woman with advanced dementia is admitted with aspiration pneumonia and cannot make medical decisions. Her daughter is the designated health care agent and says the patient previously stated she would not want cardiopulmonary resuscitation. Temperature is 101.5°F, respiratory rate is 24 breaths per minute, and blood pressure is 110/70 mm Hg. The daughter asks that this preference be written as an order.$sc221$,
  $qu221$Which initial step is most appropriate?$qu221$,
  $op221${"kind":"ethics","stepLevel":"step3","blueprintSystem":"social-sciences","blueprintTopic":"end-of-life-ethics","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784603307639","examNumber":9302,"slotIndex":7,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-21T03:09:52.507Z"},"options":["Enter a do-not-resuscitate order from her stated wish","Convene an ethics committee before entering any order","Treat the pneumonia and leave her status full code","Wait for a second physician before entering the order"]}$op221$,
  $ky221$Enter a do-not-resuscitate order from her stated wish$ky221$,
  $ex221$She lacks capacity, and her designated agent is reporting a previously expressed wish against resuscitation. A surrogate may make the code decision on that basis, so a do-not-resuscitate order is entered. An ethics committee is for conflict or uncertainty, and the agent and the prior wish agree. Treating the pneumonia is appropriate medical care, but leaving her full code ignores the preference the agent is authorized to convey. Waiting for another physician delays an order that the surrogate has already requested.$ex221$,
  2,
  $dm221$social-sciences$dm221$,
  $tp221$end-of-life-ethics$tp221$,
  $su221$https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/do-not-resuscitate-dnr-orders-and-portable-medical-orders$su221$,
  $sl221$Merck Manual, DNR orders: if the patient cannot decide about CPR, a surrogate decides from previously expressed preferences.$sl221$,
  $sq221$If the patient is incapable of making a decision about CPR, a surrogate may make the decision based on the patient’s previously expressed preferences$sq221$,
  $ch221$5fe7fc60b1f0abe6a257fbc86b5ea2180b3db8f56706025fa5093b2af8ab0678$ch221$,
  true,
  $ref221$[{"label":"Merck Manual, DNR orders: if the patient cannot decide about CPR, a surrogate decides from previously expressed preferences.","url":"https://www.merckmanuals.com/professional/special-subjects/medicolegal-issues/do-not-resuscitate-dnr-orders-and-portable-medical-orders"}]$ref221$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id222$cmr8bxxuq00do1ylo9r451m19$id222$,
  $fx222$re-rate|rewrite$fx222$,
  $sc222$A 45-year-old woman feels well and has no breast symptoms. She has had no prior breast biopsy, no chest irradiation, and no known mutation that raises breast-cancer risk. Blood pressure is 128/82 mm Hg.$sc222$,
  $qu222$Which screening test is most appropriate?$qu222$,
  $op222${"options":["Screening mammography every one to two years","Breast ultrasound as the cancer screening test","Breast magnetic resonance as the screening test","Clinical breast examination without any imaging"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"social-sciences","blueprintTopic":"preventive-screening","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783288209717","examNumber":9305,"slotIndex":24,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-05T21:51:00.335Z"}}$op222$,
  $ky222$Screening mammography every one to two years$ky222$,
  $ex222$She is at average risk, and screening mammography is recommended every 1 to 2 years beginning at age 40. Ultrasound is not the screening test for an average-risk woman without a symptom or a dense-breast problem described here. Magnetic resonance imaging is not the average-risk screening test. Clinical examination without imaging omits the mammogram that the screening schedule starts at her age.$ex222$,
  1,
  $dm222$social-sciences$dm222$,
  $tp222$preventive-screening$tp222$,
  $su222$https://www.acog.org/womens-health/faqs/mammography-and-other-screening-tests-for-breast-problems$su222$,
  $sl222$ACOG, Mammography and other screening tests: average-risk screening mammography is recommended every 1 to 2 years beginning at age 40.$sl222$,
  $sq222$If you are at average risk of breast cancer, screening mammography is recommended every 1 to 2 years beginning at age 40.$sq222$,
  $ch222$fb3a996ec8117fa672cec300d452a5ccb7c3d8a23cf89bb31d227f7d18b2f694$ch222$,
  true,
  $ref222$[{"label":"ACOG, Mammography and other screening tests: average-risk screening mammography is recommended every 1 to 2 years beginning at age 40.","url":"https://www.acog.org/womens-health/faqs/mammography-and-other-screening-tests-for-breast-problems"}]$ref222$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id223$cmru8bfsg007l1yd6euupuq5y$id223$,
  $fx223$rewrite$fx223$,
  $sc223$A 72-year-old woman with type 2 diabetes is confused and lethargic. Blood pressure is 150/90 mm Hg, heart rate is 80 beats per minute, and she is afebrile. Glucose is 780 mg/dL, serum osmolality is 330 mOsm/kg, venous pH is 7.36, and bicarbonate is 22 mEq/L. Urine ketones are trace and the anion gap is 12 mEq/L.$sc223$,
  $qu223$Which diagnosis is most likely?$qu223$,
  $op223${"options":["Hyperosmolar hyperglycemic state","Diabetic ketoacidosis with coma","Acute kidney injury as the cause","Hypoglycemia from diabetes drugs"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"diabetes-dka-management","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784612400875","examNumber":9303,"slotIndex":42,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T05:40:49.656Z"}}$op223$,
  $ky223$Hyperosmolar hyperglycemic state$ky223$,
  $ex223$Hyperosmolar hyperglycemic state is severe hyperglycemia and plasma hyperosmolality without significant ketosis, usually in type 2 diabetes, and it causes altered consciousness. Her glucose, osmolality, trace ketones, pH, and bicarbonate fit that pattern rather than an acidosis. Diabetic ketoacidosis requires significant ketosis and acidosis, which these labs do not show. Acute kidney injury is not defined by this glucose and osmolality. Hypoglycemia is excluded by a glucose of 780 mg/dL.$ex223$,
  3,
  $dm223$reproductive-endocrine$dm223$,
  $tp223$diabetes-dka-management$tp223$,
  $su223$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus$su223$,
  $sl223$Merck Manual, acute diabetes complications: hyperosmolar hyperglycemic state is severe hyperglycemia and hyperosmolality without significant ketosis.$sl223$,
  $sq223$Hyperosmolar hyperglycemic state is diagnosed by severe hyperglycemia and plasma hyperosmolality in the absence of significant ketosis.$sq223$,
  $ch223$9915bcbe418c1e1bbb0fc18ea7151a309a4aaacce3505704c5a1440835af09b4$ch223$,
  true,
  $ref223$[{"label":"Merck Manual, acute diabetes complications: hyperosmolar hyperglycemic state is severe hyperglycemia and hyperosmolality without significant ketosis.","url":"https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus"}]$ref223$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id224$cmr8lz0tr00h11ygigykz4yxx$id224$,
  $fx224$re-rate|rewrite$fx224$,
  $sc224$A 60-year-old woman takes lisinopril 20 mg daily for hypertension. Home readings over two weeks average 158/96 mm Hg, and the clinic pressure is 160/100 mm Hg. She also takes atorvastatin. Potassium and creatinine are normal, and she has no cough or swelling.$sc224$,
  $qu224$Which next step is most appropriate?$qu224$,
  $op224${"options":["Add a thiazide or a calcium-channel blocker","Raise the lisinopril dose and add nothing else","Stop lisinopril and start a beta-blocker","Refer to cardiology and change no medication"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"ambulatory-chronic-care","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783304975882","examNumber":9306,"slotIndex":36,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T02:30:45.829Z"}}$op224$,
  $ky224$Add a thiazide or a calcium-channel blocker$ky224$,
  $ex224$Her pressure is stage 2 hypertension, which is treated with two first-line drugs: an ACE inhibitor or an ARB plus either a diuretic or a calcium-channel blocker. She is already on lisinopril, so a thiazide or a calcium-channel blocker is added. Raising the lisinopril dose and adding nothing else leaves stage 2 hypertension on one drug. Stopping the ACE inhibitor for a beta-blocker drops a first-line agent and does not supply the two-drug combination. Referral without a medication change leaves the pressure untreated.$ex224$,
  3,
  $dm224$multisystem$dm224$,
  $tp224$ambulatory-chronic-care$tp224$,
  $su224$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertension$su224$,
  $sl224$Merck Manual, Hypertension: stage 2 hypertension is treated with an ACE inhibitor or ARB plus a diuretic or a calcium-channel blocker.$sl224$,
  $sq224$Adults with stage 2 hypertension (systolic BP ≥ 140/diastolic BP ≥ 90 mm Hg) should be treated initially with 2 first line medications: an ACE inhibitor or ARB combined with either a diuretic or a calcium channel blocker.$sq224$,
  $ch224$b2ad8fe1710b51cd0f0dc1c6bb5ab944288fb2298e9f0b56b8af320e04d45ea0$ch224$,
  true,
  $ref224$[{"label":"Merck Manual, Hypertension: stage 2 hypertension is treated with an ACE inhibitor or ARB plus a diuretic or a calcium-channel blocker.","url":"https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertension"}]$ref224$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id225$cmru39g6d00831y7wxhclf710$id225$,
  $fx225$re-rate|rewrite$fx225$,
  $sc225$A 72-year-old woman falls at home and is confused. Blood pressure is 110/70 mm Hg and heart rate is 100 beats per minute. She takes warfarin for atrial fibrillation, and the INR is 3.4. CT shows a 6-mm acute subdural hematoma and no midline shift.$sc225$,
  $qu225$Which next step is most appropriate?$qu225$,
  $op225${"options":["Give four-factor prothrombin complex concentrate","Proceed to craniotomy as the immediate next action","Give intravenous saline and repeat the head CT later","Observe in intensive care without reversing warfarin"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"trauma-atls","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784603883973","examNumber":9303,"slotIndex":54,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T03:19:01.522Z"}}$op225$,
  $ky225$Give four-factor prothrombin complex concentrate$ky225$,
  $ex225$She is bleeding inside the skull while taking warfarin, and four-factor prothrombin complex concentrate is the first choice for urgent warfarin reversal. A 6-mm hematoma without midline shift does not make immediate craniotomy the first action. Saline and a later scan do not reverse the anticoagulant. Observation without reversal leaves the warfarin effect in place while the hematoma is present.$ex225$,
  2,
  $dm225$multisystem$dm225$,
  $tp225$trauma-atls$tp225$,
  $su225$https://www.merckmanuals.com/professional/hematology/transfusion-medicine/blood-products$su225$,
  $sl225$Merck Manual, Blood Products: four-factor prothrombin complex concentrate is the first choice for urgent warfarin reversal.$sl225$,
  $sq225$FFP is used for urgent warfarin reversal only when a 4 factor- prothrombin complex concentrate (4F-PCC is the first choice) is unavailable.$sq225$,
  $ch225$bfdfdc8c929e4d162906ba427dc644cd9c0b3a3513a47cf0ab1832d532773439$ch225$,
  true,
  $ref225$[{"label":"Merck Manual, Blood Products: four-factor prothrombin complex concentrate is the first choice for urgent warfarin reversal.","url":"https://www.merckmanuals.com/professional/hematology/transfusion-medicine/blood-products"}]$ref225$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id226$cmruifog0001l1ycelduzbh95$id226$,
  $fx226$re-rate|rewrite$fx226$,
  $sc226$A drug listing describes lisinopril, an ACE inhibitor used for hypertension and heart failure, and warns about angioedema. A 58-year-old man with hypertension and heart failure starts lisinopril. One week later he has facial swelling and no hives. He is breathing comfortably and the tongue is not enlarged.$sc226$,
  $qu226$Which course is most appropriate?$qu226$,
  $op226${"stepLevel":"step3","kind":"drug_ad","ad":{"drug":"Lisinopril","headline":"ACE Inhibitor for Blood Pressure Control","indications":"Hypertension, heart failure, post-myocardial infarction","warnings":"Risk of angioedema and hyperkalemia"},"structureIds":["heart","lungs","kidneys"],"options":["Stop lisinopril and discuss a later ARB trial","Continue lisinopril and add an antihistamine","Lower the lisinopril dose and continue it","Stop lisinopril and start losartan this evening"],"blueprintTopic":"pharmacology-interactions","blueprintSystem":"multisystem"}$op226$,
  $ky226$Stop lisinopril and discuss a later ARB trial$ky226$,
  $ex226$Facial swelling a week after an ACE inhibitor is angioedema, and it usually resolves in 24 to 48 hours after the drug is stopped. He still needs treatment for heart failure and hypertension, so a later angiotensin-receptor blocker trial is discussed after the swelling resolves rather than started while the face is swollen. Continuing lisinopril and adding an antihistamine does not stop bradykinin-mediated swelling. A lower dose is still an exposure to the drug that caused the reaction. Starting losartan the same evening begins a related drug during the acute swelling.$ex226$,
  2,
  $dm226$multisystem$dm226$,
  $tp226$pharmacology-interactions$tp226$,
  $su226$https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/angioedema$su226$,
  $sl226$Merck Manual, Angioedema: ACE-inhibitor angioedema usually resolves within 24 to 48 hours after the drug is stopped.$sl226$,
  $sq226$Angioedema due to ACE inhibitor use usually resolves about 24 to 48 hours after stopping the medication.$sq226$,
  $ch226$48851788b95bcee2720014e0d468f13c6e566b2872627c3a0bd30ecf844d5bf9$ch226$,
  true,
  $ref226$[{"label":"Merck Manual, Angioedema: ACE-inhibitor angioedema usually resolves within 24 to 48 hours after the drug is stopped.","url":"https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/angioedema"}]$ref226$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id227$cmr8g7dq201rp1ylo8qttv5d3$id227$,
  $fx227$re-rate|rewrite$fx227$,
  $sc227$A 45-year-old woman has had fever, chills, and a productive cough for two days. She uses a low-dose inhaled corticosteroid for asthma. Temperature is 102°F, heart rate is 110 beats per minute, respiratory rate is 32 breaths per minute, blood pressure is 86/52 mm Hg, and oxygen saturation is 88% on room air. The chest radiograph shows a right lower lobe infiltrate. The leukocyte count is 15,000/mm³.$sc227$,
  $qu227$Which next step is most appropriate?$qu227$,
  $op227${"options":["Admit her to the hospital and start intravenous antibiotics","Collect sputum and delay antibiotics until the cultures return","Give a bronchodilator and then discharge her from hospital","Discharge her from the hospital with an oral antibiotic"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"pneumonia-workup","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783295305274","examNumber":9320,"slotIndex":59,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T23:54:34.102Z"}}$op227$,
  $ky227$Admit her to the hospital and start intravenous antibiotics$ky227$,
  $ex227$Pneumonia is suspected from the fever, cough, and infiltrate, and the severity of the illness decides whether care is outpatient or in the hospital. Hypotension, a respiratory rate of 32, and oxygen saturation of 88% place her in the hospital, where treatment is empiric antibiotics given intravenously. Waiting for a sputum culture delays that treatment. A bronchodilator does not treat the infiltrate, and she is not described as wheezing. Discharge on an oral antibiotic does not match this severity.$ex227$,
  2,
  $dm227$respiratory-renal$dm227$,
  $tp227$pneumonia-workup$tp227$,
  $su227$https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia$su227$,
  $sl227$Merck Manual, Community-acquired pneumonia: clinical severity determines inpatient versus outpatient treatment, and treatment is empiric antibiotics.$sl227$,
  $sq227$In general, the clinical severity (ie, risk stratification) of the pneumonia determines the treatment setting (ie, outpatient versus inpatient).$sq227$,
  $ch227$1ebe38f787f4d1263a595e70eab09620e644f5987f6e4e6707313a83689d36e2$ch227$,
  true,
  $ref227$[{"label":"Merck Manual, Community-acquired pneumonia: clinical severity determines inpatient versus outpatient treatment, and treatment is empiric antibiotics.","url":"https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia"}]$ref227$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id228$cmrx1lugk001nl705dcpbs91q$id228$,
  $fx228$re-rate|rewrite$fx228$,
  $sc228$A boy born at 39 weeks is now 48 hours old and is breastfeeding well. Total bilirubin is 17.2 mg/dL. There is no blood-group incompatibility, no hemolysis, no G6PD deficiency, and no sign of sepsis. Vital signs are stable.$sc228$,
  $qu228$Which next step is most appropriate?$qu228$,
  $op228${"stepLevel":"step3","blueprintSystem":"human-development","kind":"ccs_prompt","caseData":{"setting":"Newborn nursery day 3","presentation":"Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs","vitals":"Stable; feeding well","timeline":"Hyperbilirubinemia — phototherapy threshold"},"structureIds":["heart","lungs","brain"],"options":["Start phototherapy for this bilirubin","Perform exchange transfusion at this level","Discharge him and arrange no follow-up","Stop breastfeeding and do not resume it"],"blueprintTopic":"pediatric-ccs"}$op228$,
  $ky228$Start phototherapy for this bilirubin$ky228$,
  $ex228$For a newborn of at least 35 weeks, phototherapy follows a gestational-age curve, and the thresholds are lower when neurotoxicity risk factors are present. He was born at 39 weeks, is well, and has no hemolysis, G6PD deficiency, or sepsis, so he is on the curve for infants without those risk factors. At 48 hours his bilirubin sits above that phototherapy curve, so phototherapy is started. Exchange transfusion is for a higher threshold than this phototherapy curve. Discharge with no follow-up leaves a rising risk unwatched. Breastfeeding is not stopped permanently for this level.$ex228$,
  1,
  $dm228$human-development$dm228$,
  $tp228$pediatric-ccs$tp228$,
  $su228$https://www.merckmanuals.com/professional/pediatrics/metabolic-electrolyte-and-toxic-disorders-in-neonates/neonatal-hyperbilirubinemia$su228$,
  $sl228$Merck Manual, Neonatal Hyperbilirubinemia: phototherapy thresholds for infants born at 35 weeks or later depend on gestational age and neurotoxicity risk factors.$sl228$,
  $sq228$For neonates born at ≥ 35 weeks gestation, there are gestational age-specific phototherapy guidelines.$sq228$,
  $ch228$268358d2f46ac5b4280707b4ab1ca954c6e4850c0ccf1a429f761066fd46d074$ch228$,
  true,
  $ref228$[{"label":"Merck Manual, Neonatal Hyperbilirubinemia: phototherapy thresholds for infants born at 35 weeks or later depend on gestational age and neurotoxicity risk factors.","url":"https://www.merckmanuals.com/professional/pediatrics/metabolic-electrolyte-and-toxic-disorders-in-neonates/neonatal-hyperbilirubinemia"}]$ref228$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id229$cmr8hggjo020m1ylovv8kjd0w$id229$,
  $fx229$rewrite$fx229$,
  $sc229$A 15-year-old girl had menarche at age 11. For two years her menses have come every three to six months. She has moderate facial hirsutism, body mass index is 32, and blood pressure is 130/85 mm Hg. Serum testosterone is persistently above the adult reference range. Glucose is normal, TSH is normal, and she has no purple striae.$sc229$,
  $qu229$Which diagnosis is most likely?$qu229$,
  $op229${"options":["Polycystic ovary syndrome","Thyroid hormone deficiency","Endogenous Cushing syndrome","Type 2 diabetes mellitus"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"pcos-endocrine","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783297087485","examNumber":9323,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T00:19:09.608Z"}}$op229$,
  $ky229$Polycystic ovary syndrome$ky229$,
  $ex229$In an adolescent, this syndrome requires both an abnormal bleeding pattern that has persisted for 1 to 2 years and hyperandrogenism, such as a testosterone level above the adult range or moderate hirsutism. She has both, beginning well after menarche. Thyroid hormone deficiency is unlikely with a normal TSH and does not raise testosterone. Cushing syndrome is not supported without the exam features that go with it, and glucose is normal, so this is not diabetes. The abnormal cycles and androgen excess are the syndrome itself.$ex229$,
  2,
  $dm229$reproductive-endocrine$dm229$,
  $tp229$pcos-endocrine$tp229$,
  $su229$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormal-uterine-bleeding/polyendocrine-metabolic-ovarian-syndrome-pmos$su229$,
  $sl229$Merck Manual, polyendocrine metabolic ovarian syndrome (polycystic ovary syndrome): adolescents need both a persistent abnormal bleeding pattern and hyperandrogenism.$sl229$,
  $sq229$These criteria require that both of the following conditions be present: Abnormal uterine bleeding pattern (abnormal for age or gynecologic age [age minus age at menarche] or symptoms that persist for 1 to 2 years) Evidence of hyperandrogenism (persistently elevated serum testosterone levels above adult norms, moderate to severe hirsutism, or moderate to severe inflammatory acne vulgaris)$sq229$,
  $ch229$ceb1640a80acaf97c8813d5f1816b9b5c32ce40bdaa8abca615621c3a358ef06$ch229$,
  true,
  $ref229$[{"label":"Merck Manual, polyendocrine metabolic ovarian syndrome (polycystic ovary syndrome): adolescents need both a persistent abnormal bleeding pattern and hyperandrogenism.","url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormal-uterine-bleeding/polyendocrine-metabolic-ovarian-syndrome-pmos"}]$ref229$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id230$cmtpx6cxd000f1ymuqtewjxsg$id230$,
  $fx230$re-rate|rewrite$fx230$,
  $sc230$A 72-year-old woman with osteoporosis falls at home and has severe right hip pain. The right leg is shortened and externally rotated, and she cannot walk. Blood pressure is 130/80 mm Hg and heart rate is 78 beats per minute.$sc230$,
  $qu230$Which diagnosis is most likely?$qu230$,
  $op230${"options":["Displaced proximal femur fracture","Posterior dislocation of the hip","Acute septic arthritis of the hip","Contusion of the quadriceps muscle"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"pre-post-op-care","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1788705565470","examNumber":9301,"slotIndex":15,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-09-06T14:40:27.449Z"}}$op230$,
  $ky230$Displaced proximal femur fracture$ky230$,
  $ex230$After a fall, a patient who cannot walk and has a shortened, externally rotated leg has a displaced hip fracture. That description covers a displaced fracture of the proximal femur and does not require a named subtype. Posterior dislocation is a different injury and is not the deformity described for the displaced fracture. Septic arthritis is not the result of a fall with this posture. A quadriceps contusion does not shorten and externally rotate the leg.$ex230$,
  1,
  $dm230$multisystem$dm230$,
  $tp230$pre-post-op-care$tp230$,
  $su230$https://www.merckmanuals.com/professional/injuries-poisoning/fractures/hip-fractures$su230$,
  $sl230$Merck Manual, Hip Fractures: a displaced fracture leaves the leg shortened and externally rotated, and the patient cannot walk.$sl230$,
  $sq230$Patients with displaced fractures cannot walk and have significant pain; the affected leg may appear shortened and externally rotated.$sq230$,
  $ch230$33c8b5b5f47eed2b25be5b2d8c2e5771bfba70d48576278cd67b158aa76450ca$ch230$,
  true,
  $ref230$[{"label":"Merck Manual, Hip Fractures: a displaced fracture leaves the leg shortened and externally rotated, and the patient cannot walk.","url":"https://www.merckmanuals.com/professional/injuries-poisoning/fractures/hip-fractures"}]$ref230$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id231$cmr8mlwcf00nv1ygitr6bbt4y$id231$,
  $fx231$re-rate$fx231$,
  $sc231$A 32-year-old woman presents to the emergency department two weeks after a vaginal delivery. She reports increasing fatigue, palpitations, and shortness of breath on exertion. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 beats per minute, and she has a pale appearance. Laboratory tests reveal a hemoglobin level of 8.5 g/dL and a reticulocyte count of 5%. She is soaking more than one pad an hour and passing clots. The uterus is boggy.$sc231$,
  $qu231$What is the most likely diagnosis?$qu231$,
  $op231${"options":["Postpartum hemorrhage","Iron deficiency anemia","Thrombotic thrombocytopenic purpura","Gestational hypertension"],"distractorRationale":{"Iron deficiency anemia":"This option is incorrect because the acute presentation and elevated reticulocyte count suggest a response to acute blood loss rather than a chronic deficiency.","Thrombotic thrombocytopenic purpura":"This is incorrect as TTP presents with a specific set of symptoms (microangiopathic hemolytic anemia, thrombocytopenia) not seen in this patient.","Gestational hypertension":"This option is incorrect as it does not account for the anemia and hypotension observed in this patient."},"clinicalReasoning":"Assess the patient's clinical presentation, including vital signs and laboratory results. Analyze the symptoms of fatigue, palpitations, and hypotension in the context of recent delivery. Integrate the findings of low hemoglobin and elevated reticulocyte count to conclude that postpartum hemorrhage is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":51,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T02:52:42.845Z"}}$op231$,
  $ky231$Postpartum hemorrhage$ky231$,
  $ex231$Two weeks after delivery she is bleeding heavily, with a boggy uterus, hypotension, tachycardia, anemia, and a high reticulocyte count. That is delayed postpartum hemorrhage. Iron deficiency is a slower process and does not produce this acute bleed. Thrombotic thrombocytopenic purpura and gestational hypertension do not fit heavy vaginal bleeding with a boggy uterus.$ex231$,
  3,
  $dm231$reproductive-endocrine$dm231$,
  $tp231$postpartum-complications$tp231$,
  NULL,
  NULL,
  NULL,
  $ch231$d0701c60292373df9f3245df57392fd34a7abb79212b8584254e144d2ef4ff7b$ch231$,
  true,
  $ref231$[{"url":"https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage","label":"Merck Manual Professional. postpartum hemorrhage. Postpartum hemorrhage is blood loss of > 1000 mL or blood loss accompanied by symptoms or signs of hypovolemia within 24 hours after childbirth."}]$ref231$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id232$cmr8atvyl000t1ylomai0a6f3$id232$,
  $fx232$re-rate$fx232$,
  $sc232$A 62-year-old woman is admitted to the surgical ward following a laparoscopic cholecystectomy. On postoperative day 6, a port-site incision is red and draining pus, and her temperature is 101.5°F (38.6°C). Her vital signs are stable, with a blood pressure of 120/75 mm Hg and heart rate of 88 bpm. Laboratory tests reveal a white blood cell count of 12,000/mm³. She has no history of prior infections and is currently on IV fluids and analgesics.$sc232$,
  $qu232$What is the most likely diagnosis?$qu232$,
  $op232${"options":["Wound infection","Pneumonia","Urinary tract infection","Deep vein thrombosis"],"distractorRationale":{"Pneumonia":"This distractor fails because the patient does not exhibit respiratory symptoms such as cough or dyspnea, which are typically associated with pneumonia.","Urinary tract infection":"This option is incorrect as the patient shows no urinary symptoms, and her fever is more likely related to a surgical site infection.","Deep vein thrombosis":"While DVT can cause fever, it is usually accompanied by leg swelling or pain, which this patient does not report."},"clinicalReasoning":"Assess the patient's postoperative status, analyze the symptoms, and integrate knowledge of common postoperative complications to arrive at the diagnosis of a wound infection.","kind":"vignette","stepLevel":"step3","blueprintSystem":"surgery","blueprintTopic":"post-op-fever","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783286257734","examNumber":9301,"slotIndex":29,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-05T21:20:58.919Z"}}$op232$,
  $ky232$Wound infection$ky232$,
  $ex232$Purulent drainage from the incision on day 6 is a surgical-site infection. Wound infections are uncommon on day 2, when atelectasis is the usual fever. She has no cough to support pneumonia, no urinary symptoms, and no leg swelling to support thrombosis.$ex232$,
  3,
  $dm232$multisystem$dm232$,
  $tp232$post-op-fever$tp232$,
  NULL,
  NULL,
  NULL,
  $ch232$8f4d436c6c07d6b8060e2433b5d5fc208dad712a14b91993b651343451932104$ch232$,
  true,
  $ref232$[{"url":"https://www.nice.org.uk/guidance/ng125/chapter/Recommendations","label":"NICE NG125. When surgical site infection is suspected because of cellulitis, or the wound has been opened to drain pus, treat with an antibiotic that covers the likely organisms."}]$ref232$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id233$cmr8diira00xz1ylo132h88u6$id233$,
  $fx233$re-rate$fx233$,
  NULL,
  $qu233$A 45-year-old man with COPD is sent from clinic to the emergency department because of increased shortness of breath and a cough productive of green sputum. Temperature is 101°F. In the emergency department, he has received nebulized albuterol-ipratropium and oral prednisone 40 mg, and oral doxycycline has been started for purulent sputum. He is alert, speaks in full sentences, and is not using accessory muscles. Respiratory rate is 24/min, and oxygen saturation is 84% on room air. A chest x-ray shows hyperinflation and no infiltrates. Arterial blood gas on room air shows pH 7.38, PaCO2 44 mm Hg, and PaO2 50 mm Hg. What is the most appropriate next step in management?$qu233$,
  $op233$["Start systemic corticosteroids", "Initiate antibiotics", "Order a CT scan of the chest (image the chest with computed tomography)", "Controlled oxygen by Venturi mask titrated to SpO2 88%-92%"]$op233$,
  $ky233$Controlled oxygen by Venturi mask titrated to SpO2 88%-92%$ky233$,
  $ex233$Correct answer: D. Controlled oxygen by Venturi mask titrated to SpO2 88%-92%. Despite nebulized albuterol-ipratropium and prednisone 40 mg, oxygen saturation is 84% on room air and PaO2 is 50 mm Hg, so he needs oxygen. In COPD, oxygen is given as controlled oxygen titrated to SpO2 88%-92% (TSANZ, Grade B), which corrects the hypoxemia while limiting oxygen-induced hypercapnia; PaCO2 is 44 mm Hg now and should be rechecked on oxygen. Why the other options are wrong: A. Systemic corticosteroid has already been given (prednisone 40 mg); repeating it does not correct the hypoxemia. B. Doxycycline has already been started for purulent sputum; changing to another antibiotic does not treat the hypoxemia. C. The chest x-ray already shows no consolidation; a CT scan is not indicated and does not treat the hypoxemia.$ex233$,
  3,
  $dm233$respiratory-renal$dm233$,
  $tp233$copd-asthma-exacerbation$tp233$,
  NULL,
  NULL,
  NULL,
  $ch233$c14891a6bece547b990706bb760d7f6d105efe242fd35572e964dbe19855aec2$ch233$,
  true,
  $ref233$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/","label":"O'Driscoll BR et al. BTS guideline for oxygen use in adults in healthcare and emergency settings. For most patients with known COPD, a target saturation of 88-92% is suggested pending blood gas results."}]$ref233$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id234$cmr8br63k00ak1yloavpirwkg$id234$,
  $fx234$re-rate$fx234$,
  NULL,
  $qu234$A 75-year-old woman with advanced dementia is admitted with pneumonia. She has a do-not-resuscitate order. Temperature is 101°F, pulse is 98/min and blood pressure is 118/70 mm Hg. Her family met with the primary team yesterday, but they remain divided and distressed about whether antibiotics are consistent with her values, and they are asking for more support in reaching a decision. Which of the following is the most appropriate next step?$qu234$,
  $op234$["Start intravenous antibiotics without further discussion", "Consult palliative care", "Repeat the same risk-benefit discussion and ask for a decision today", "Reassess her vital signs before doing anything"]$op234$,
  $ky234$Consult palliative care$ky234$,
  $ex234$Correct answer: B. Consult palliative care. The primary team has already discussed goals with the family, who remain divided and are asking for help; palliative care can support advance care planning by helping the family understand and apply her values and preferences to this decision. Why the other options are wrong: A. The family is the surrogate and has not decided; treatment should follow her values and goals as expressed through them. C. The team has already had this discussion and the family needs more support, not pressure. D. She is stable; reassessing vital signs does not address the unresolved goals-of-care question.$ex234$,
  2,
  $dm234$social-sciences$dm234$,
  $tp234$end-of-life-ethics$tp234$,
  NULL,
  NULL,
  NULL,
  $ch234$68e3fad5ba5c275591dedf7611228223a45694f795508b37767a8ab921f2175a$ch234$,
  true,
  $ref234$[{"label":"American Geriatrics Society. (2019). Choosing Wisely: Five Things Physicians and Patients Should Question."}]$ref234$::jsonb
);
INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $id235$cmr8n3pw800q01ygita18d8mz$id235$,
  $fx235$re-rate$fx235$,
  $sc235$A 2-year-old girl presents to the emergency department with a high fever of 102°F (38.9°C) and a rash that started on her face and spread down over her trunk. The mother reports that the child has been irritable and has had a runny nose for the past few days. On examination, the child has conjunctivitis and a maculopapular rash.$sc235$,
  $qu235$What is the most likely diagnosis?$qu235$,
  $op235${"options":["Measles","Rubella","Roseola","Scarlet fever"],"distractorRationale":{"Rubella":"Rubella has a milder rash and is less likely to present with conjunctivitis and high fever.","Roseola":"Roseola typically presents with a high fever followed by a rash that starts on the trunk, not the face.","Scarlet fever":"Scarlet fever presents with a sore throat and a sandpaper-like rash, which is not seen here."},"clinicalReasoning":"Assess the child's symptoms and rash. Analyze the classic presentation of measles, integrating knowledge of its epidemiology and clinical features. The diagnosis is confirmed by the clinical presentation.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pediatrics","blueprintTopic":"pediatric-ccs","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783306437425","examNumber":9309,"slotIndex":14,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-06T02:54:56.476Z"}}$op235$,
  $ky235$Measles$ky235$,
  $ex235$Fever, cough, coryza, conjunctivitis, and a maculopapular rash that starts on the head and moves down the body is measles. Rubella is milder. Roseola starts on the trunk after the fever breaks. Scarlet fever is a sandpaper rash with pharyngitis, not this cephalocaudal viral exanthem.$ex235$,
  2,
  $dm235$human-development$dm235$,
  $tp235$pediatric-infections$tp235$,
  NULL,
  NULL,
  NULL,
  $ch235$69297859520588e6cd3fde35f028026df7632c6acb76905de6165582e80831c1$ch235$,
  true,
  $ref235$[{"url":"https://medlineplus.gov/measles.html","label":"MedlinePlus. The measles rash often starts on the head and moves down the body, with fever, cough, runny nose, and conjunctivitis."}]$ref235$::jsonb
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage) <> 236 THEN
    RAISE EXCEPTION 'stage row count %, expected 236',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage);
  END IF;
END
$check$;
COMMIT;
