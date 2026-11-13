-- Second citation pass for served USMLE items that still had no real source, 2026-11-13.
-- Backup qbi_usmle_refs2_20261113_backup (179 rows) is created first.
-- Only the references column is updated.
-- Undo: scripts/undo-usmle-refs2-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_refs2_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmrpw57dt002i1yrt71mq3vkb',
    'cmr4dbe5m00ye1yky3podjd1n',
    'cmr4gkdq0029r1ykyb6tdyr34',
    'cmr8q40is01iu1ygi6k502fe4',
    'cmr4nxsmk00gq1y1etflxxxt4',
    'cmrpvdpub00251yncmxaza7m2',
    'cmrpw19bm00311yh5rkpq9zuj',
    'cmr4e6lhm01bt1ykyu9fjye67',
    'cmrr4y92800281y6pvb1udkvi',
    'cmrpwfg6t00761yh5rs6cgacl',
    'cmr9buy1201jz1ywyv6qhkj6a',
    'cmru3gdzs00b81y7wzdmq8je8',
    'cmr4fdk6301sa1ykymoo10xjy',
    'cmr4nxpmd00ft1y1e487pewgu',
    'cmr8d6gfj000t1yazetsabpcb',
    'cmqxe01x500e91ymaaeoj7831',
    'cmr8fhgyj01kj1yloj35i8s6q',
    'cmtpxgt63007m1ymu40nyqbi8',
    'cmtpxgtbp007o1ymupvp4hblu',
    'cmtpx8ran002u1ymu6rk8thvs',
    'cmrsewbqf00101y55d854olg6',
    'cmrru3q4s00b81y8wny9sw56h',
    'cmr4ievf700e01ydem355jqgk',
    'cmru6qyk3002cl104swmjj0t3',
    'cmrrvfjrr002x1yl8sfp03w8t',
    'cmrtg5xye000o1ydwta55xrce',
    'cmr8ie5y4029z1yloe8qo7dnb',
    'cmr8hggqh020o1yloh10kmfen',
    'cmrpwiw70006p1yrtkn1u2yjl',
    'cmr8kibis004l1ygi8613sdiz',
    'cmr8hgil102131ylopzyjdaoy',
    'cmr8hgj4z02151ylomr4zizq7',
    'cmr8ie9ou02b11ylon7yhaix2',
    'cmr8pgw9p01dh1ygity7tdlws',
    'cmr8om97m016u1ygiq5gxj8dd',
    'cmr8qv0cj01qj1ygi3ftmsxbl',
    'cmr8quzsu01qc1ygictnub1en',
    'cmr8quwq701pb1ygioc6loma5',
    'cmr4nxpp700fu1y1e7w1rlmxs',
    'cmr4mobo600ag1y1e8ke4u1tu',
    'cmr4ouq5e00m61y1eux3389bp',
    'cmr9aueo001841ywy9966urjl',
    'cmr89ozga00mf1yw2mrekd5f0',
    'cmr4qv92n00zl1y1eqcdlhvi3',
    'cmr99ihkl00u21ywyduh2dlos',
    'cmr8ny5dn01051ygi3d5skzvf',
    'cmr4jrakj00n11yde1ivbclau',
    'cmrruacam00cz1y8wl8mvpsw2',
    'cmrtprxt0000j1yqcs7pxirfp',
    'cmr8clqus019i1yw26cv2sdwt',
    'cmr98vp4d00o71ywy34nw96v8',
    'cmr9bv0fn01ks1ywym6i5vzl7',
    'cmr9a1008010e1ywydh1enonk',
    'cmr9a13q8011f1ywygahnn7g9',
    'cmr8nmky000xm1ygi5k3ymcep',
    'cmrthhr11007e1yax4ubni2zj',
    'cmrpw17a8002h1yh56v5dk5x2',
    'cmr8nmjg100x21ygi5bdrm3ke',
    'cmr8fhgv001ki1ylo4ndz9v6d',
    'cmr8jukue00181ygirs0jnpl3',
    'cmr985zx600dc1ywyygyavt5e',
    'cmr8d1xfo00r21ylo7fqpkxsw',
    'cmr4eekdb01ey1yky88kapwh9',
    'cmrtq0ur3001k1yqcnrr64d0w',
    'cmru3ucqs00h31y7w554bfsgk',
    'cmru7tiw500001yd6af90q0cm',
    'cmru96lfg003e1y0sscp4w6q8',
    'cmru96qa9004i1y0swkyke6yw',
    'cmru9d0rz007u1y0sorvbsop1',
    'cmr8fz8ej01ni1yloq2jt2907',
    'cmr8lqfkf00cq1ygi03ibd4wd',
    'b4x5c541adc784d99efeb0514e8',
    'cmr4lnlsm003t1y1e0sb2yb34',
    'cmr88g6nr00dr1yw2sa9kb476',
    'cmqxdy7ei00141y79llwnxk2q',
    'cmr4iy62e00ge1ydeyx4wmdlj',
    'cmr31dll600cajs045jgolta2',
    'cmr89lwvs010r1yr9d6u31w1z',
    'cmr4kip0u00tx1yde6sx1wbr7',
    'cmr85sy7a00161yr91wddyfao',
    'cmra6lzns0041ic0497olnf6y',
    'cmrpwg6fu00bv1yluan5n8lz5',
    'cmrrbware000xl104h3f036j9',
    'cmrrvfiys002n1yl8ss1b6wtw',
    'cmru6qthu0017l1041lu7ljvd',
    'cmrvm5yx5001fjw04azx8x16l',
    'cmrtq0uwm001m1yqc5xhgr8j9',
    'cmr4our2g00mh1y1e01r7frg8',
    'cmr4dj81j010x1yky258y1dap',
    'cmr4eema701fh1ykyft1s5jqc',
    'cmr8c3pb000hw1ylo1jgx0eh8',
    'cmr8mlsgk00mj1ygikjazwhho',
    'cmr8n3tof00r31ygiymd1dy3p',
    'cmr8mltwu00n11ygi9dhlzrh3',
    'cmr8n3pw800q01ygita18d8mz',
    'cmr8mluym00ne1ygid9y4x64p',
    'cmr8pvfk901ge1ygi5gwz8g2x',
    'cmr9860ry00dn1ywyzi1svtn0',
    'cmr99rioa00yl1ywyzv5aobn7',
    'cmru7tn5k001h1yd687q6yhxn',
    'cmrvwq44k001o1ye8916hjse7',
    'cmr8e5zny01811yloi8647ajy',
    'cmrvwwj3k00581ye87i5pk8qn',
    'cmrrvnj31006s1yl8qgckptpm',
    'cmr8bxzxt00e91yloyuylz9eo',
    'cmtpwsniy003y1y6h0mshpx3m',
    'cmtpx3f0z00b21y6hkhbr5tas',
    'cmqxee9xl00481y793d83cfjv',
    'cmr87izgi00ge1yr9756c04uz',
    'cmrrvb5me00031yl8l5tii6p9',
    'cmrrvfhyh002a1yl8ji64m5qc',
    'cmr8918tp00wk1yr9375h3l1f',
    'cmrsfd1lh002j1ynydp8fa39s',
    'cmr8br4xv00a61ylo3sv9bi07',
    'cmr8h1fxk01xf1ylo9gvzcyij',
    'cmrtggbxa00521ydwwpri7tas',
    'cmr4dbf9700yo1yky5ku23s6e',
    'cmr89p1ph00n61yw29u8h60y5',
    'cmrvwu6fk003u1ye8x8ffhid0',
    'cmrrvnldt007m1yl82l9l0bto',
    'cmruyiv1h002t1y2yxyosnwso',
    'cmtpx3db100ag1y6h4w42kl2a',
    'cmr869jnv003u1yr9stlhsip3',
    'cmr87j1a200gv1yr9utfznb8d',
    'cmr98vq4f00oj1ywyehaivvb8',
    'cmr8e5vtd016p1yloe89571zw',
    'cmr8dyo2f014i1yloagqqj81w',
    'cmr4b30d9000c1ykyr2h5ps0n',
    'cmru9czah007m1y0sbizqwj2y',
    'cmr877m3a00ea1yr9arn7wmqi',
    'cmr97qgbu007l1ywy6t3dfstl',
    'cmr98638500ei1ywyx4nzce7z',
    'cmr97qf5e00791ywyhtewny3h',
    'cmr9c38mj01og1ywyl5yxxcg3',
    'cmr8dykm5013k1ylobt7312gj',
    'cmr8dyn1y01481yloq5h1e4so',
    'cmr8dqe9r011g1ylo1hjbmnc3',
    'cmr89vdla013u1yr9a8ecpemz',
    'cmr4eehzi01ea1ykyh1vge5is',
    'cmru7tjyz000d1yd6zz33jv7p',
    'cmru7tlnj000y1yd6n9mzv2xl',
    'cmru9czep007n1y0sas7sgxre',
    'cmqxdeo7y009y1yma8dfh7bqf',
    'cmr88s0ca00tb1yr9hyyffd40',
    'cmr89va9j012q1yr9ap4iqvzh',
    'cmrpw0qvy005h1yluagx4i47k',
    'cmrrvvll100bw1yl8rl2jhxf4',
    'cmrtg5vxq00031ydwolyc2stt',
    'cmrtg5wwb000d1ydw0jue2ojw',
    'cmrrvrrvh009l1yl8sk1x77xc',
    'cmrrvrsnt009v1yl85hzikeod',
    'cmrrvvkei00bk1yl8x6g19c6q',
    'cmrsfgln8004i1yny3eqfrhuk',
    'cmrtexhpw00091y30lrny3y97',
    'cmrtprx6e000b1yqc537ydo77',
    'cmrtq0ul6001i1yqco371u3tc',
    'cmtpw0myp002a1ylcrm0jazst',
    'cmtpx3e3700aq1y6h99e98vtz',
    'cmqxdzxp200cs1ymad88el3l9',
    'cmqxdzz5200da1ymalk9yrl0m',
    'cmqxdzzuf00dj1ymabks3j254',
    'cmr4bggem00711ykyc0be6qna',
    'cmr4b2z7i00031ykynqxmzu82',
    'cmr4cbyej00li1ykyodf8ab66',
    'cmr4g0wfy022w1ykyin8mddk5',
    'cmr8j0pvl02hl1ylojllglvju',
    'cmr8ncqt700uc1ygiqtlsy96g',
    'cmr98dnqp00i31ywyi2zvehc6',
    'cmr98disl00gp1ywyxcshmobd',
    'cmr99ii2200u71ywy3w13ptqc',
    'cmr97qgwq007r1ywypilx1xdx',
    'cmr97qh75007u1ywyg7khltmv',
    'cmru3gd5w00ax1y7wridawkph',
    'cmr9c9nya01qz1ywy3hbutlhy',
    'cmru32lvh00411y7w1hpmw7or',
    'cmruymlqu004z1y2ylhtep7az',
    'cmruymm7j00541y2ycpw04gro',
    'cmqxdep7700a81ymahupmepn7',
    'cmqxeg7hy00gc1yma9vv2jdn0'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs2_20261113_backup) <> 179 THEN
    RAISE EXCEPTION 'backup row count %, expected 179', (SELECT COUNT(*) FROM qbi_usmle_refs2_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $j0$[{"label": "MedlinePlus. Hepatitis C.", "url": "https://medlineplus.gov/hepatitisc.html"}]$j0$::jsonb
WHERE id = 'cmrpw57dt002i1yrt71mq3vkb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j1$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j1$::jsonb
WHERE id = 'cmr4dbe5m00ye1yky3podjd1n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j2$[{"label": "MedlinePlus. Hepatitis C.", "url": "https://medlineplus.gov/hepatitisc.html"}]$j2$::jsonb
WHERE id = 'cmr4gkdq0029r1ykyb6tdyr34' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j3$[{"label": "MedlinePlus. Influenza (flu).", "url": "https://medlineplus.gov/flu.html"}]$j3$::jsonb
WHERE id = 'cmr8q40is01iu1ygi6k502fe4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j4$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j4$::jsonb
WHERE id = 'cmr4nxsmk00gq1y1etflxxxt4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j5$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j5$::jsonb
WHERE id = 'cmrpvdpub00251yncmxaza7m2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j6$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j6$::jsonb
WHERE id = 'cmrpw19bm00311yh5rkpq9zuj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j7$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j7$::jsonb
WHERE id = 'cmr4e6lhm01bt1ykyu9fjye67' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j8$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j8$::jsonb
WHERE id = 'cmrr4y92800281y6pvb1udkvi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j9$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j9$::jsonb
WHERE id = 'cmrpwfg6t00761yh5rs6cgacl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j10$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j10$::jsonb
WHERE id = 'cmr9buy1201jz1ywyv6qhkj6a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j11$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j11$::jsonb
WHERE id = 'cmru3gdzs00b81y7wzdmq8je8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j12$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j12$::jsonb
WHERE id = 'cmr4fdk6301sa1ykymoo10xjy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j13$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j13$::jsonb
WHERE id = 'cmr4nxpmd00ft1y1e487pewgu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j14$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j14$::jsonb
WHERE id = 'cmr8d6gfj000t1yazetsabpcb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j15$[{"label": "MedlinePlus Medical Encyclopedia. Testicular torsion.", "url": "https://medlineplus.gov/ency/article/000517.htm"}]$j15$::jsonb
WHERE id = 'cmqxe01x500e91ymaaeoj7831' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j16$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j16$::jsonb
WHERE id = 'cmr8fhgyj01kj1yloj35i8s6q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j17$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j17$::jsonb
WHERE id = 'cmtpxgt63007m1ymu40nyqbi8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j18$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j18$::jsonb
WHERE id = 'cmtpxgtbp007o1ymupvp4hblu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j19$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j19$::jsonb
WHERE id = 'cmtpx8ran002u1ymu6rk8thvs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j20$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j20$::jsonb
WHERE id = 'cmrsewbqf00101y55d854olg6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j21$[{"label": "MedlinePlus Medical Encyclopedia. Nephrotic syndrome.", "url": "https://medlineplus.gov/ency/article/000490.htm"}]$j21$::jsonb
WHERE id = 'cmrru3q4s00b81y8wny9sw56h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j22$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j22$::jsonb
WHERE id = 'cmr4ievf700e01ydem355jqgk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j23$[{"label": "MedlinePlus Medical Encyclopedia. Pyloric stenosis in infants.", "url": "https://medlineplus.gov/ency/article/000970.htm"}]$j23$::jsonb
WHERE id = 'cmru6qyk3002cl104swmjj0t3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j24$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j24$::jsonb
WHERE id = 'cmrrvfjrr002x1yl8sfp03w8t' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j25$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j25$::jsonb
WHERE id = 'cmrtg5xye000o1ydwta55xrce' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j26$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j26$::jsonb
WHERE id = 'cmr8ie5y4029z1yloe8qo7dnb' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j27$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j27$::jsonb
WHERE id = 'cmr8hggqh020o1yloh10kmfen' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j28$[{"label": "MedlinePlus Medical Encyclopedia. Nephrotic syndrome.", "url": "https://medlineplus.gov/ency/article/000490.htm"}]$j28$::jsonb
WHERE id = 'cmrpwiw70006p1yrtkn1u2yjl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j29$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j29$::jsonb
WHERE id = 'cmr8kibis004l1ygi8613sdiz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j30$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j30$::jsonb
WHERE id = 'cmr8hgil102131ylopzyjdaoy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j31$[{"label": "MedlinePlus Medical Encyclopedia. Intussusception in children.", "url": "https://medlineplus.gov/ency/article/000958.htm"}]$j31$::jsonb
WHERE id = 'cmr8hgj4z02151ylomr4zizq7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j32$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j32$::jsonb
WHERE id = 'cmr8ie9ou02b11ylon7yhaix2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j33$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j33$::jsonb
WHERE id = 'cmr8pgw9p01dh1ygity7tdlws' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j34$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j34$::jsonb
WHERE id = 'cmr8om97m016u1ygiq5gxj8dd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j35$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j35$::jsonb
WHERE id = 'cmr8qv0cj01qj1ygi3ftmsxbl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j36$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j36$::jsonb
WHERE id = 'cmr8quzsu01qc1ygictnub1en' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j37$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j37$::jsonb
WHERE id = 'cmr8quwq701pb1ygioc6loma5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j38$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j38$::jsonb
WHERE id = 'cmr4nxpp700fu1y1e7w1rlmxs' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j39$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j39$::jsonb
WHERE id = 'cmr4mobo600ag1y1e8ke4u1tu' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j40$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j40$::jsonb
WHERE id = 'cmr4ouq5e00m61y1eux3389bp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j41$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j41$::jsonb
WHERE id = 'cmr9aueo001841ywy9966urjl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j42$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j42$::jsonb
WHERE id = 'cmr89ozga00mf1yw2mrekd5f0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j43$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j43$::jsonb
WHERE id = 'cmr4qv92n00zl1y1eqcdlhvi3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j44$[{"label": "MedlinePlus. Lung cancer.", "url": "https://medlineplus.gov/lungcancer.html"}]$j44$::jsonb
WHERE id = 'cmr99ihkl00u21ywyduh2dlos' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j45$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j45$::jsonb
WHERE id = 'cmr8ny5dn01051ygi3d5skzvf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j46$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j46$::jsonb
WHERE id = 'cmr4jrakj00n11yde1ivbclau' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j47$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j47$::jsonb
WHERE id = 'cmrruacam00cz1y8wl8mvpsw2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j48$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j48$::jsonb
WHERE id = 'cmrtprxt0000j1yqcs7pxirfp' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j49$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j49$::jsonb
WHERE id = 'cmr8clqus019i1yw26cv2sdwt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j50$[{"label": "MedlinePlus. Hepatitis B.", "url": "https://medlineplus.gov/hepatitisb.html"}]$j50$::jsonb
WHERE id = 'cmr98vp4d00o71ywy34nw96v8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j51$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j51$::jsonb
WHERE id = 'cmr9bv0fn01ks1ywym6i5vzl7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j52$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j52$::jsonb
WHERE id = 'cmr9a1008010e1ywydh1enonk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j53$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j53$::jsonb
WHERE id = 'cmr9a13q8011f1ywygahnn7g9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j54$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j54$::jsonb
WHERE id = 'cmr8nmky000xm1ygi5k3ymcep' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j55$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j55$::jsonb
WHERE id = 'cmrthhr11007e1yax4ubni2zj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j56$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j56$::jsonb
WHERE id = 'cmrpw17a8002h1yh56v5dk5x2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j57$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j57$::jsonb
WHERE id = 'cmr8nmjg100x21ygi5bdrm3ke' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j58$[{"label": "MedlinePlus. Influenza (flu).", "url": "https://medlineplus.gov/flu.html"}]$j58$::jsonb
WHERE id = 'cmr8fhgv001ki1ylo4ndz9v6d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j59$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j59$::jsonb
WHERE id = 'cmr8jukue00181ygirs0jnpl3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j60$[{"label": "MedlinePlus. Lung cancer.", "url": "https://medlineplus.gov/lungcancer.html"}]$j60$::jsonb
WHERE id = 'cmr985zx600dc1ywyygyavt5e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j61$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j61$::jsonb
WHERE id = 'cmr8d1xfo00r21ylo7fqpkxsw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j62$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j62$::jsonb
WHERE id = 'cmr4eekdb01ey1yky88kapwh9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j63$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j63$::jsonb
WHERE id = 'cmrtq0ur3001k1yqcnrr64d0w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j64$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j64$::jsonb
WHERE id = 'cmru3ucqs00h31y7w554bfsgk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j65$[{"label": "MedlinePlus. Lung cancer.", "url": "https://medlineplus.gov/lungcancer.html"}]$j65$::jsonb
WHERE id = 'cmru7tiw500001yd6af90q0cm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j66$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j66$::jsonb
WHERE id = 'cmru96lfg003e1y0sscp4w6q8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j67$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j67$::jsonb
WHERE id = 'cmru96qa9004i1y0swkyke6yw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j68$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j68$::jsonb
WHERE id = 'cmru9d0rz007u1y0sorvbsop1' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j69$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j69$::jsonb
WHERE id = 'cmr8fz8ej01ni1yloq2jt2907' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j70$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j70$::jsonb
WHERE id = 'cmr8lqfkf00cq1ygi03ibd4wd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j71$[{"label": "MedlinePlus Medical Encyclopedia. Collapsed lung (pneumothorax).", "url": "https://medlineplus.gov/ency/article/000087.htm"}]$j71$::jsonb
WHERE id = 'b4x5c541adc784d99efeb0514e8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j72$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j72$::jsonb
WHERE id = 'cmr4lnlsm003t1y1e0sb2yb34' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j73$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j73$::jsonb
WHERE id = 'cmr88g6nr00dr1yw2sa9kb476' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j74$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j74$::jsonb
WHERE id = 'cmqxdy7ei00141y79llwnxk2q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j75$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j75$::jsonb
WHERE id = 'cmr4iy62e00ge1ydeyx4wmdlj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j76$[{"label": "MedlinePlus Medical Encyclopedia. Intussusception in children.", "url": "https://medlineplus.gov/ency/article/000958.htm"}]$j76$::jsonb
WHERE id = 'cmr31dll600cajs045jgolta2' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j77$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j77$::jsonb
WHERE id = 'cmr89lwvs010r1yr9d6u31w1z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j78$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j78$::jsonb
WHERE id = 'cmr4kip0u00tx1yde6sx1wbr7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j79$[{"label": "MedlinePlus. Influenza (flu).", "url": "https://medlineplus.gov/flu.html"}]$j79$::jsonb
WHERE id = 'cmr85sy7a00161yr91wddyfao' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j80$[{"label": "MedlinePlus Medical Encyclopedia. Pyloric stenosis in infants.", "url": "https://medlineplus.gov/ency/article/000970.htm"}]$j80$::jsonb
WHERE id = 'cmra6lzns0041ic0497olnf6y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j81$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j81$::jsonb
WHERE id = 'cmrpwg6fu00bv1yluan5n8lz5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j82$[{"label": "MedlinePlus Medical Encyclopedia. Pyloric stenosis in infants.", "url": "https://medlineplus.gov/ency/article/000970.htm"}]$j82$::jsonb
WHERE id = 'cmrrbware000xl104h3f036j9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j83$[{"label": "MedlinePlus. Hepatitis C.", "url": "https://medlineplus.gov/hepatitisc.html"}]$j83$::jsonb
WHERE id = 'cmrrvfiys002n1yl8ss1b6wtw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j84$[{"label": "MedlinePlus Medical Encyclopedia. Epiglottitis.", "url": "https://medlineplus.gov/ency/article/000605.htm"}]$j84$::jsonb
WHERE id = 'cmru6qthu0017l1041lu7ljvd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j85$[{"label": "MedlinePlus Medical Encyclopedia. Pyloric stenosis in infants.", "url": "https://medlineplus.gov/ency/article/000970.htm"}]$j85$::jsonb
WHERE id = 'cmrvm5yx5001fjw04azx8x16l' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j86$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j86$::jsonb
WHERE id = 'cmrtq0uwm001m1yqc5xhgr8j9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j87$[{"label": "MedlinePlus. Gout is caused by uric acid (urate) buildup, and joint fluid is checked for uric acid crystals.", "url": "https://medlineplus.gov/gout.html"}]$j87$::jsonb
WHERE id = 'cmr4our2g00mh1y1e01r7frg8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j88$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j88$::jsonb
WHERE id = 'cmr4dj81j010x1yky258y1dap' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j89$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j89$::jsonb
WHERE id = 'cmr4eema701fh1ykyft1s5jqc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j90$[{"label": "MedlinePlus Medical Encyclopedia. A kidney infection is called pyelonephritis.", "url": "https://medlineplus.gov/ency/article/000521.htm"}]$j90$::jsonb
WHERE id = 'cmr8c3pb000hw1ylo1jgx0eh8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j91$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j91$::jsonb
WHERE id = 'cmr8mlsgk00mj1ygikjazwhho' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j92$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j92$::jsonb
WHERE id = 'cmr8n3tof00r31ygiymd1dy3p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j93$[{"label": "MedlinePlus. Childbirth and the stages of labor.", "url": "https://medlineplus.gov/childbirth.html"}]$j93$::jsonb
WHERE id = 'cmr8mltwu00n11ygi9dhlzrh3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j94$[{"label": "MedlinePlus. Measles (rubeola).", "url": "https://medlineplus.gov/measles.html"}]$j94$::jsonb
WHERE id = 'cmr8n3pw800q01ygita18d8mz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j95$[{"label": "MedlinePlus. HIV.", "url": "https://medlineplus.gov/hiv.html"}]$j95$::jsonb
WHERE id = 'cmr8mluym00ne1ygid9y4x64p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j96$[{"label": "NIDDK. Chronic kidney disease.", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd"}]$j96$::jsonb
WHERE id = 'cmr8pvfk901ge1ygi5gwz8g2x' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j97$[{"label": "MedlinePlus. Hypothyroidism. Hashimoto's disease is an autoimmune disorder in which the immune system attacks the thyroid.", "url": "https://medlineplus.gov/hypothyroidism.html"}]$j97$::jsonb
WHERE id = 'cmr9860ry00dn1ywyzi1svtn0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j98$[{"label": "MedlinePlus. Hepatitis C.", "url": "https://medlineplus.gov/hepatitisc.html"}]$j98$::jsonb
WHERE id = 'cmr99rioa00yl1ywyzv5aobn7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j99$[{"label": "MedlinePlus. Hepatitis A.", "url": "https://medlineplus.gov/hepatitisa.html"}]$j99$::jsonb
WHERE id = 'cmru7tn5k001h1yd687q6yhxn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j100$[{"label": "MedlinePlus. Hemochromatosis (iron overload).", "url": "https://medlineplus.gov/hemochromatosis.html"}]$j100$::jsonb
WHERE id = 'cmrvwq44k001o1ye8916hjse7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j101$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j101$::jsonb
WHERE id = 'cmr8e5zny01811yloi8647ajy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j102$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j102$::jsonb
WHERE id = 'cmrvwwj3k00581ye87i5pk8qn' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j103$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j103$::jsonb
WHERE id = 'cmrrvnj31006s1yl8qgckptpm' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j104$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j104$::jsonb
WHERE id = 'cmr8bxzxt00e91yloyuylz9eo' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j105$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j105$::jsonb
WHERE id = 'cmtpwsniy003y1y6h0mshpx3m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j106$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j106$::jsonb
WHERE id = 'cmtpx3f0z00b21y6hkhbr5tas' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j107$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j107$::jsonb
WHERE id = 'cmqxee9xl00481y793d83cfjv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j108$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j108$::jsonb
WHERE id = 'cmr87izgi00ge1yr9756c04uz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j109$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j109$::jsonb
WHERE id = 'cmrrvb5me00031yl8l5tii6p9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j110$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j110$::jsonb
WHERE id = 'cmrrvfhyh002a1yl8ji64m5qc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j111$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j111$::jsonb
WHERE id = 'cmr8918tp00wk1yr9375h3l1f' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j112$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j112$::jsonb
WHERE id = 'cmrsfd1lh002j1ynydp8fa39s' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j113$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j113$::jsonb
WHERE id = 'cmr8br4xv00a61ylo3sv9bi07' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j114$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j114$::jsonb
WHERE id = 'cmr8h1fxk01xf1ylo9gvzcyij' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j115$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j115$::jsonb
WHERE id = 'cmrtggbxa00521ydwwpri7tas' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j116$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j116$::jsonb
WHERE id = 'cmr4dbf9700yo1yky5ku23s6e' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j117$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j117$::jsonb
WHERE id = 'cmr89p1ph00n61yw29u8h60y5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j118$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j118$::jsonb
WHERE id = 'cmrvwu6fk003u1ye8x8ffhid0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j119$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j119$::jsonb
WHERE id = 'cmrrvnldt007m1yl82l9l0bto' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j120$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j120$::jsonb
WHERE id = 'cmruyiv1h002t1y2yxyosnwso' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j121$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j121$::jsonb
WHERE id = 'cmtpx3db100ag1y6h4w42kl2a' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j122$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j122$::jsonb
WHERE id = 'cmr869jnv003u1yr9stlhsip3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j123$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j123$::jsonb
WHERE id = 'cmr87j1a200gv1yr9utfznb8d' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j124$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j124$::jsonb
WHERE id = 'cmr98vq4f00oj1ywyehaivvb8' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j125$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j125$::jsonb
WHERE id = 'cmr8e5vtd016p1yloe89571zw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j126$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j126$::jsonb
WHERE id = 'cmr8dyo2f014i1yloagqqj81w' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j127$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j127$::jsonb
WHERE id = 'cmr4b30d9000c1ykyr2h5ps0n' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j128$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j128$::jsonb
WHERE id = 'cmru9czah007m1y0sbizqwj2y' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j129$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j129$::jsonb
WHERE id = 'cmr877m3a00ea1yr9arn7wmqi' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j130$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j130$::jsonb
WHERE id = 'cmr97qgbu007l1ywy6t3dfstl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j131$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j131$::jsonb
WHERE id = 'cmr98638500ei1ywyx4nzce7z' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j132$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j132$::jsonb
WHERE id = 'cmr97qf5e00791ywyhtewny3h' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j133$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j133$::jsonb
WHERE id = 'cmr9c38mj01og1ywyl5yxxcg3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j134$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j134$::jsonb
WHERE id = 'cmr8dykm5013k1ylobt7312gj' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j135$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j135$::jsonb
WHERE id = 'cmr8dyn1y01481yloq5h1e4so' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j136$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j136$::jsonb
WHERE id = 'cmr8dqe9r011g1ylo1hjbmnc3' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j137$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j137$::jsonb
WHERE id = 'cmr89vdla013u1yr9a8ecpemz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j138$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j138$::jsonb
WHERE id = 'cmr4eehzi01ea1ykyh1vge5is' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j139$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j139$::jsonb
WHERE id = 'cmru7tjyz000d1yd6zz33jv7p' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j140$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j140$::jsonb
WHERE id = 'cmru7tlnj000y1yd6n9mzv2xl' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j141$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j141$::jsonb
WHERE id = 'cmru9czep007n1y0sas7sgxre' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j142$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j142$::jsonb
WHERE id = 'cmqxdeo7y009y1yma8dfh7bqf' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j143$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j143$::jsonb
WHERE id = 'cmr88s0ca00tb1yr9hyyffd40' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j144$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j144$::jsonb
WHERE id = 'cmr89va9j012q1yr9ap4iqvzh' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j145$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j145$::jsonb
WHERE id = 'cmrpw0qvy005h1yluagx4i47k' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j146$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j146$::jsonb
WHERE id = 'cmrrvvll100bw1yl8rl2jhxf4' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j147$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j147$::jsonb
WHERE id = 'cmrtg5vxq00031ydwolyc2stt' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j148$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j148$::jsonb
WHERE id = 'cmrtg5wwb000d1ydw0jue2ojw' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j149$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j149$::jsonb
WHERE id = 'cmrrvrrvh009l1yl8sk1x77xc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j150$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j150$::jsonb
WHERE id = 'cmrrvrsnt009v1yl85hzikeod' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j151$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j151$::jsonb
WHERE id = 'cmrrvvkei00bk1yl8x6g19c6q' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j152$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j152$::jsonb
WHERE id = 'cmrsfgln8004i1yny3eqfrhuk' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j153$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j153$::jsonb
WHERE id = 'cmrtexhpw00091y30lrny3y97' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j154$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j154$::jsonb
WHERE id = 'cmrtprx6e000b1yqc537ydo77' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j155$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j155$::jsonb
WHERE id = 'cmrtq0ul6001i1yqco371u3tc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j156$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j156$::jsonb
WHERE id = 'cmtpw0myp002a1ylcrm0jazst' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j157$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j157$::jsonb
WHERE id = 'cmtpx3e3700aq1y6h99e98vtz' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j158$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j158$::jsonb
WHERE id = 'cmqxdzxp200cs1ymad88el3l9' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j159$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j159$::jsonb
WHERE id = 'cmqxdzz5200da1ymalk9yrl0m' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j160$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j160$::jsonb
WHERE id = 'cmqxdzzuf00dj1ymabks3j254' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j161$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j161$::jsonb
WHERE id = 'cmr4bggem00711ykyc0be6qna' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j162$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j162$::jsonb
WHERE id = 'cmr4b2z7i00031ykynqxmzu82' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j163$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j163$::jsonb
WHERE id = 'cmr4cbyej00li1ykyodf8ab66' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j164$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j164$::jsonb
WHERE id = 'cmr4g0wfy022w1ykyin8mddk5' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j165$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j165$::jsonb
WHERE id = 'cmr8j0pvl02hl1ylojllglvju' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j166$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j166$::jsonb
WHERE id = 'cmr8ncqt700uc1ygiqtlsy96g' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j167$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j167$::jsonb
WHERE id = 'cmr98dnqp00i31ywyi2zvehc6' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j168$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j168$::jsonb
WHERE id = 'cmr98disl00gp1ywyxcshmobd' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j169$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j169$::jsonb
WHERE id = 'cmr99ii2200u71ywy3w13ptqc' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j170$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j170$::jsonb
WHERE id = 'cmr97qgwq007r1ywypilx1xdx' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j171$[{"label": "MedlinePlus. Antibiotics treat bacterial pneumonia and some fungal pneumonias. They do not work for viral pneumonia.", "url": "https://medlineplus.gov/pneumonia.html"}]$j171$::jsonb
WHERE id = 'cmr97qh75007u1ywyg7khltmv' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j172$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j172$::jsonb
WHERE id = 'cmru3gd5w00ax1y7wridawkph' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j173$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j173$::jsonb
WHERE id = 'cmr9c9nya01qz1ywy3hbutlhy' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j174$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j174$::jsonb
WHERE id = 'cmru32lvh00411y7w1hpmw7or' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j175$[{"label": "MedlinePlus Medical Encyclopedia. Thrombolytics for ischemic stroke are given within 3 hours of the first symptoms.", "url": "https://medlineplus.gov/ency/article/007089.htm"}]$j175$::jsonb
WHERE id = 'cmruymlqu004z1y2ylhtep7az' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j176$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j176$::jsonb
WHERE id = 'cmruymm7j00541y2ycpw04gro' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j177$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j177$::jsonb
WHERE id = 'cmqxdep7700a81ymahupmepn7' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
UPDATE "QuestionBankItem"
SET "references" = $j178$[{"label": "MedlinePlus Medical Encyclopedia. In heart failure, diuretics help the body get rid of extra fluid. Furosemide is one of the loop diuretics used for this.", "url": "https://medlineplus.gov/ency/patientinstructions/000112.htm"}]$j178$::jsonb
WHERE id = 'cmqxeg7hy00gc1yma9vv2jdn0' AND active = true AND (
  "references" IS NULL OR (
    jsonb_typeof("references") = 'array'
    AND jsonb_array_length("references") > 0
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
         OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
    )
  )
);
COMMIT;
