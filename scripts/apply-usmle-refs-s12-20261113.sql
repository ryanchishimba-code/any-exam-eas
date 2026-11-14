-- Add checked citations to served USMLE Step 1 and Step 2 items that had no real source, 2026-11-13.
-- Backup qbi_usmle_refs_s12_20261113_backup (248 rows) is created first.
-- Only the references column is updated. Step 3 rows are not in this set.
-- Undo: scripts/undo-usmle-refs-s12-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'b1xd0aca7ed1fbc20fd35357b5f',
    'cmqkgnt8c0g4sl304eki6ebat',
    'cmqxc0tk8000k1yma8k9h10sb',
    'cmqxcjtiv003i1ymabfkjs629',
    'cmr4kx5wu00031y1enelklblo',
    'cmr4kx7cv000f1y1e6p5vwxs1',
    'cmr4kx9pq00121y1e3kdhyy0f',
    'cmr4kxber001j1y1esiescvdn',
    'cmr4kxbia001k1y1evszvjr26',
    'cmr4lnl77003n1y1efahdegcs',
    'cmr4lnn9k00471y1e9gp3zakc',
    'cmr4lno9c004f1y1ebygs6ys8',
    'cmr4m1ik800711y1er29chb81',
    'cmr4moa44009x1y1e82nqr4dw',
    'cmr4moark00a51y1etq6ypwn0',
    'cmr4n503r00ci1y1e84krb5rb',
    'cmr4n53xe00ds1y1e64fj9dhv',
    'cmr4n551c00dy1y1eg6eqbpak',
    'cmr4outff00na1y1ep52vuezo',
    'cmr4pbdox00p01y1epkkp9eld',
    'cmr4pbebl00p61y1ephgsdldz',
    'cmr4pbetf00pc1y1efvwxqzd0',
    'cmr4pbfag00pi1y1ea44rg9s1',
    'cmr4pbflr00pm1y1ez6evp7u0',
    'cmr4pbfop00pn1y1e471kzzx1',
    'cmr4pbg5p00pt1y1elmson1wi',
    'cmr4pbh6c00q51y1ejv6b3ed3',
    'cmr4pbi4n00qh1y1e14ftdic4',
    'cmr4pz4dc00sf1y1ex99dgmkh',
    'cmr4pz7ff00ta1y1efvrcwd9s',
    'cmr4pz8jq00tl1y1eagnmxip3',
    'cmr4qbs4500vb1y1etbfnaa1k',
    'cmr4qbs7400vc1y1eccwjlypr',
    'cmr4qbuh600w41y1eqt58ti5e',
    'cmr4qbuvr00w91y1egvmcawhd',
    'cmr4qbvfz00wg1y1e6nu4x9r7',
    'cmr4qv5fz00yf1y1e98o27g9r',
    'cmr4qv7fq00z21y1ete0yysrl',
    'cmr85ui7l000r1yw2e50fcmng',
    'cmr85uip3000w1yw20o2xc5bq',
    'cmr85ujut00181yw2sj51hrga',
    'cmr86gv29003w1yw24cybfwes',
    'cmr86gvlx00431yw2q7dznjot',
    'cmr86y70b007g1yw29tsjopga',
    'cmr86y8ro007x1yw23zkryxn6',
    'cmr87iymk009n1yw2ufdh52cx',
    'cmr87iz5r009s1yw2troohoyd',
    'cmr87j34200b21yw2fmxa5qvg',
    'cmr88g4cd00d41yw2qktdg61o',
    'cmr88g7tb00e21yw2qcbslsvn',
    'cmr88g8qs00eb1yw2a9jklieo',
    'cmr89azd300j21yw20o1l74so',
    'cmr89b1kn00jo1yw25eggjln8',
    'cmr89b3rw00ka1yw2fyy7azhh',
    'cmr89b4h700kh1yw2saz5vmlj',
    'cmr89p0mj00mt1yw2ckmmyh4q',
    'cmr89p1mj00n51yw2mdoxmrf6',
    'cmr89p3t200nq1yw2kv798nd1',
    'cmr89zvzv00qe1yw2vyq9nbu3',
    'cmr8adx6m00t21yw21q80u7vj',
    'cmr8adyf500te1yw2v7xo4leq',
    'cmr8adz1j00tk1yw2an7h9c62',
    'cmr8ae0uf00u01yw232sfmwxz',
    'cmr8ae0y000u11yw2jdlksjey',
    'cmr8ae22p00uc1yw2ophwqsfp',
    'cmr8aypwx00w71yw2rvl02usm',
    'cmr8ayrlj00wo1yw2su7q4s18',
    'cmr8ays7400wu1yw21lv8bq81',
    'cmr8aytlb00x81yw285byv2yi',
    'cmr8bfz0s00z61yw24rkeig4s',
    'cmr8bg0vr00zs1yw2vcqpb8s4',
    'cmr8bg1dr00zy1yw2oiw508v0',
    'cmr8bg1mp01011yw2lc1a7jd9',
    'cmr8by2fg012h1yw2esug8qws',
    'cmr8by3eb012t1yw267ssvjon',
    'cmr8by4b601341yw2urwv7226',
    'cmr8by54s013e1yw2ir1apqlm',
    'cmr8by655013q1yw29pbtpiy3',
    'cmr8cciip015p1yw24dfalhno',
    'cmr8ccjia01611yw2wazthzh8',
    'cmr8cckfs016c1yw2vrrcrxic',
    'cmr8ccmes016z1yw2pd527aka',
    'cmr8clom2018r1yw2ehn7oc23',
    'cmr8clq4g01991yw2mzi8gzne',
    'cmr8d6eoy000c1yazyoj9mifc',
    'cmr8d6f7q000h1yazqknsglbh',
    'cmr8d6hk100141yaza5r8bv6l',
    'cmr8d6im3001e1yaznntyija7',
    'cmr8dn37n003n1yaz3tkv6zs2',
    'cmr8dn4fa003z1yaz4hhce11x',
    'cmr8dyjqv006a1yazvz5035yl',
    'cmr8dylb2006t1yazhgxt7eqh',
    'cmr8ei0n2009g1yazd5qxjw33',
    'cmr8ei1tv009s1yazzsq0xtlv',
    'cmr8ei41300ae1yazfeaqacwu',
    'cmr8f0j9v00ci1yazupwtotjs',
    'cmr8f0ke400cu1yaz89mfr18a',
    'cmr8f0na800ds1yazwh0oz4o5',
    'cmr8f0nd700dt1yazwq0ic8za',
    'cmra6lyzb0036ic04rhk09zzi',
    'cmrpv8flk00041ynceghdq9gj',
    'cmrpv8fog00051ync63u9e4wy',
    'cmrpv8hhz000s1yncornsxfkc',
    'cmrpvdq0300271yncmubvfz8r',
    'cmrpvds4b002y1yncf84dkwmc',
    'cmrpvdsjm00331yncibw34wxh',
    'cmrpvdss000361yncotf7zp9j',
    'cmrpvuxwh000r1yh5idkpxyf8',
    'cmrpvuy8z000v1yh5a2u8z3wc',
    'cmrpvyvwe000f1yrtcrs99gnc',
    'cmrpvyvz9000g1yrt99xizetx',
    'cmrpvyx0j000t1yrtk02l4hq8',
    'cmrpw171f002e1yh5tus3hd43',
    'cmrpw18po002u1yh5h6rwsu2t',
    'cmrpw57ac002h1yrto7ko63hk',
    'cmrpw57h9002j1yrt9v7wtusz',
    'cmrpw57oa002l1yrtbo2dzb2f',
    'cmrpw58dj002s1yrtdryq9pfg',
    'cmrpw5a2k00391yrt0soex2m6',
    'cmrpw7b3l004q1yh5dah0v4zq',
    'cmrpw7bc5004t1yh5r2bn75o0',
    'cmrpwcip5004h1yrtbas6b6yc',
    'cmrpwcjsy004u1yrtxpw51ise',
    'cmrpwfdza006k1yh5ktngqi18',
    'cmrpwffho006z1yh5ne84kxif',
    'cmrpwfga900771yh50y405hyc',
    'cmrpwfgha00791yh5u3edvlkp',
    'cmrpwfgru007c1yh5uv5lpw3o',
    'cmrpwiwry006v1yrt2ipwflb3',
    'cmrpwiwz3006x1yrtkgg8c3pw',
    'cmrpwixrb00751yrt1xm429ds',
    'cmrr4ycn3002l1y6pxpiby1u0',
    'cmrr4ycqn002m1y6pohywtrce',
    'cmrr4yd29002p1y6pb7iptt3m',
    'cmrr4yeli002x1y6p00xfob66',
    'cmrr4yg4700381y6psje614lh',
    'cmrrbwa7w000dl104bzwzzw1v',
    'cmrrtm6fc004n1y8wh427mmqo',
    'cmrrtm7w100521y8wga6v8lia',
    'cmrrtm8um005c1y8wifcow1my',
    'cmrru3pap00az1y8wgjymi99x',
    'cmrru3rku00bo1y8w13pcsqom',
    'cmrruac4y00cy1y8wwsnci0fq',
    'cmrruafbj00db1y8wyv97v8lr',
    'cmrrufy5z00fg1y8wxfsthuxi',
    'cmrrufznq00fw1y8wma0cserf',
    'cmrrum7x300hw1y8w422gf18f',
    'cmrruxugz00m31y8wh1qn2z1f',
    'cmrrv65o700od1y8wpgr7knpt',
    'cmrsew96q00031y552pb0dwio',
    'cmrsewaq9000n1y557f5qjn6a',
    'cmrsewaye000q1y553v8379f1',
    'cmrsewb6w000t1y558qh2gdov',
    'cmrsf3gt200291y55you8bhlf',
    'cmrsf3iav002o1y550u450ied',
    'cmrsf3ihz002q1y5557otyapm',
    'cmrtffir400061yx2jr9eotne',
    'cmrtfrrga000z1yx2cbaqkli5',
    'cmrtg0vk000181yx2a5t0s73k',
    'cmrtg0wii001g1yx29x4bi7id',
    'cmrtg0wzc001k1yx2sroc78z5',
    'cmrthhqya007d1yaxjkpxlhtl',
    'cmrtqfygk00001yx3rmok3vwq',
    'cmrvm5ych000rjw04dtoflv9t',
    'b1x7840d384e12598d79f098a15',
    'b2x34e2fa23bdd9674443b0294c',
    'b3x6a1c073b8850154c6c85fe88',
    'cmpnjhcau002f1ymxty8q5eqc',
    'cmpnjjcsd09cy1ymxf8b2sydj',
    'cmqxd0on200661ymazj4sr92q',
    'cmqxd0opn00671ymaexrjcogp',
    'cmqxd0ovw00691yma7zwej1oq',
    'cmqxd0pcj006e1yma0n4zjzj5',
    'cmqxd0prh006j1yma922hejmb',
    'cmqxd0s2m00721yma3kw70v5j',
    'cmqxdeop300a31yma3gjof544',
    'cmqxdeq3k00ah1yma21xk0ftv',
    'cmqxdy4j600041y7907vclno6',
    'cmqxdy4or00061y79cfdojwx8',
    'cmqxdy62q000n1y79xfv1snpb',
    'cmqxeea4h004a1y799jx5xe3q',
    'cmr4gwg95000b1ydeg1jfbyjq',
    'cmr4hnntd00801yde74xil0zv',
    'cmr4hzudw00a91ydemnlxhisu',
    'cmr4j8njf00jr1ydeb976fqs0',
    'cmr4jrbzf00ni1ydebg0mky5g',
    'cmr4k49dh00q71ydezaift44s',
    'cmr4k49v400qd1yde0rfelxk7',
    'cmr869iea003h1yr9gkh3b3zo',
    'cmr86obok007w1yr9dcr6f9t1',
    'cmr86ycr300av1yr9h4aftemq',
    'cmr877ikh00d31yr93aqqk5ka',
    'cmr877ky000dw1yr9j6ef4rjd',
    'cmr87iyu900g81yr9jp8wl1ng',
    'cmr87j2ed00h61yr9avv0wgza',
    'cmr87sjhc00je1yr94kggxded',
    'cmr87sk8y00jm1yr9nwj3wu12',
    'cmr87sln800k31yr9qrddzi9e',
    'cmr87slq600k41yr942h0ihgk',
    'cmr87smpu00kg1yr9wesb4x27',
    'cmr87smyp00kj1yr94jfvia2n',
    'cmr87so3s00kx1yr9zuib8pln',
    'cmr88ickh00q51yr91m1eb7p9',
    'cmr88igl700r81yr9pmkc9ga4',
    'cmr88ih3d00rd1yr9zo1gaxyo',
    'cmr891a7p00wy1yr9ghrsmvxs',
    'cmr891ee800y41yr96l2sipc7',
    'cmr89vafc012s1yr942d5fm42',
    'cmr89vb3w01301yr9iu40zc13',
    'cmr89vc0n013b1yr92uykrdym',
    'cmr89ve2r01401yr9msjgw3ft',
    'cmr8abeze016r1yr92yvk3oh8',
    'cmr8abfk7016y1yr9qzbssgkg',
    'cmr8al85g019e1yr9yfsqa2xm',
    'cmr8al947019o1yr9pcj0cot8',
    'cmr8al9jy019t1yr9i5n257p8',
    'cmr8albj801ah1yr9vbhuv66b',
    'cmrpvqaqr000x1yludmhg6a5x',
    'cmrqh92nv000k1ypxadw5hq2l',
    'cmrqhfo5d00351ypxwr84xxsf',
    'cmrqhwmey007f1ypx0uozv5f5',
    'cmrqhwmte007j1ypx98nwn13u',
    'cmrrbwath000zl104qyhhqlna',
    'cmrrvb5tm00051yl8g0fctnke',
    'cmrrvrqm900951yl8ftntdwxy',
    'cmrrvztsz00dp1yl8pw0kyjrh',
    'cmrrvzvx600e81yl89zaqnqgv',
    'cmrrw4x0q00fv1yl86hj8l56r',
    'cmrrw4z9900gn1yl8r6zurt3k',
    'cmrsfgmd8004r1ynyz7r7ybo8',
    'cmrtexh6p00021y30rjatkdz2',
    'cmrtf2o3l000m1y309oe4wpvk',
    'cmrtf2oh9000r1y30ncbsg9tp',
    'cmrtg5ycg000s1ydwj5sin6hw',
    'cmrtggafo004j1ydw7lyot374',
    'cmrtggb4h004s1ydwdyhjeey8',
    'cmrtprwjo00031yqcwpoxcrgi',
    'cmru6qymi002fl104kllsz4s3',
    'cmrvm5yz4001ijw049n92tmhu',
    'cmtps7u5y00071y1q3m679u8i',
    'cmtps7vu9000t1y1qcf1guhzt',
    'cmtpw0njn002i1ylc2ttubtxi',
    'cmtpw0qeb003b1ylcmx1ku5b5',
    'cmtpwlceb00001y6hinm6aq2i',
    'cmtpwldrk000h1y6h3kn0vu73',
    'cmtpwleuf000t1y6hj0x44c5m',
    'cmtpwlgg8001d1y6hl2rtzhku',
    'cmtpwlh30001l1y6hm2d2j9rp'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12_20261113_backup) <> 248 THEN
    RAISE EXCEPTION 'backup row count %, expected 248', (SELECT COUNT(*) FROM qbi_usmle_refs_s12_20261113_backup);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_refs_s12_20261113_backup
    WHERE "fieldId" NOT IN ('usmle-step-1', 'usmle-step-2')
  ) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $j0$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j0$::jsonb
WHERE id = 'b1xd0aca7ed1fbc20fd35357b5f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j1$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j1$::jsonb
WHERE id = 'cmqkgnt8c0g4sl304eki6ebat'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j2$[{"label": "MedComm (2020). 2026. Alzheimer's Disease: Mechanisms and Therapeutic Advances. Alzheimer's disease (AD) is a devastating neurodegenerative condition accompanied by widespread central nervous system damage and complex networked pathogenesis spanning molecular, cellular, and systemic dimensions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732115/"}]$j2$::jsonb
WHERE id = 'cmqxc0tk8000k1yma8k9h10sb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j3$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j3$::jsonb
WHERE id = 'cmqxcjtiv003i1ymabfkjs629'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j4$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j4$::jsonb
WHERE id = 'cmr4kx5wu00031y1enelklblo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j5$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j5$::jsonb
WHERE id = 'cmr4kx7cv000f1y1e6p5vwxs1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j6$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j6$::jsonb
WHERE id = 'cmr4kx9pq00121y1e3kdhyy0f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j7$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j7$::jsonb
WHERE id = 'cmr4kxber001j1y1esiescvdn'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j8$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j8$::jsonb
WHERE id = 'cmr4kxbia001k1y1evszvjr26'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j9$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j9$::jsonb
WHERE id = 'cmr4lnl77003n1y1efahdegcs'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j10$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j10$::jsonb
WHERE id = 'cmr4lnn9k00471y1e9gp3zakc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j11$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j11$::jsonb
WHERE id = 'cmr4lno9c004f1y1ebygs6ys8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j12$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j12$::jsonb
WHERE id = 'cmr4m1ik800711y1er29chb81'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j13$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j13$::jsonb
WHERE id = 'cmr4moa44009x1y1e82nqr4dw'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j14$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j14$::jsonb
WHERE id = 'cmr4moark00a51y1etq6ypwn0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j15$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j15$::jsonb
WHERE id = 'cmr4n503r00ci1y1e84krb5rb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j16$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j16$::jsonb
WHERE id = 'cmr4n53xe00ds1y1e64fj9dhv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j17$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j17$::jsonb
WHERE id = 'cmr4n551c00dy1y1eg6eqbpak'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j18$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j18$::jsonb
WHERE id = 'cmr4outff00na1y1ep52vuezo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j19$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j19$::jsonb
WHERE id = 'cmr4pbdox00p01y1epkkp9eld'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j20$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j20$::jsonb
WHERE id = 'cmr4pbebl00p61y1ephgsdldz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j21$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j21$::jsonb
WHERE id = 'cmr4pbetf00pc1y1efvwxqzd0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j22$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j22$::jsonb
WHERE id = 'cmr4pbfag00pi1y1ea44rg9s1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j23$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j23$::jsonb
WHERE id = 'cmr4pbflr00pm1y1ez6evp7u0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j24$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j24$::jsonb
WHERE id = 'cmr4pbfop00pn1y1e471kzzx1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j25$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j25$::jsonb
WHERE id = 'cmr4pbg5p00pt1y1elmson1wi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j26$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j26$::jsonb
WHERE id = 'cmr4pbh6c00q51y1ejv6b3ed3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j27$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j27$::jsonb
WHERE id = 'cmr4pbi4n00qh1y1e14ftdic4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j28$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j28$::jsonb
WHERE id = 'cmr4pz4dc00sf1y1ex99dgmkh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j29$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j29$::jsonb
WHERE id = 'cmr4pz7ff00ta1y1efvrcwd9s'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j30$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j30$::jsonb
WHERE id = 'cmr4pz8jq00tl1y1eagnmxip3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j31$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j31$::jsonb
WHERE id = 'cmr4qbs4500vb1y1etbfnaa1k'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j32$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j32$::jsonb
WHERE id = 'cmr4qbs7400vc1y1eccwjlypr'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j33$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j33$::jsonb
WHERE id = 'cmr4qbuh600w41y1eqt58ti5e'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j34$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j34$::jsonb
WHERE id = 'cmr4qbuvr00w91y1egvmcawhd'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j35$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j35$::jsonb
WHERE id = 'cmr4qbvfz00wg1y1e6nu4x9r7'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j36$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j36$::jsonb
WHERE id = 'cmr4qv5fz00yf1y1e98o27g9r'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j37$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j37$::jsonb
WHERE id = 'cmr4qv7fq00z21y1ete0yysrl'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j38$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j38$::jsonb
WHERE id = 'cmr85ui7l000r1yw2e50fcmng'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j39$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j39$::jsonb
WHERE id = 'cmr85uip3000w1yw20o2xc5bq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j40$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j40$::jsonb
WHERE id = 'cmr85ujut00181yw2sj51hrga'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j41$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j41$::jsonb
WHERE id = 'cmr86gv29003w1yw24cybfwes'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j42$[{"label": "Brain Sci. 2021. Imaging of Substantia Nigra in Parkinson's Disease: A Narrative Review. Parkinson's disease (PD) is a progressive neurodegenerative disorder, characterized by motor and non-motor symptoms due to the degeneration of the pars compacta of the substantia nigra (SNc) with dopaminergic denervation of the striatum.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8230134/"}]$j42$::jsonb
WHERE id = 'cmr86gvlx00431yw2q7dznjot'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j43$[{"label": "Cerebrovasc Dis. 2026. Advances in Stereotactic Hematoma Evacuation for Hypertensive Intracerebral Hemorrhage and the Value of Multimodal Monitoring. Background Hypertensive intracerebral hemorrhage (HICH) is a common spontaneous intracerebral hemorrhage with high morbidity and mortality.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13623338/"}]$j43$::jsonb
WHERE id = 'cmr86y70b007g1yw29tsjopga'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j44$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j44$::jsonb
WHERE id = 'cmr86y8ro007x1yw23zkryxn6'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j45$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j45$::jsonb
WHERE id = 'cmr87iymk009n1yw2ufdh52cx'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j46$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j46$::jsonb
WHERE id = 'cmr87iz5r009s1yw2troohoyd'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j47$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j47$::jsonb
WHERE id = 'cmr87j34200b21yw2fmxa5qvg'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j48$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j48$::jsonb
WHERE id = 'cmr88g4cd00d41yw2qktdg61o'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j49$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j49$::jsonb
WHERE id = 'cmr88g7tb00e21yw2qcbslsvn'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j50$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j50$::jsonb
WHERE id = 'cmr88g8qs00eb1yw2a9jklieo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j51$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j51$::jsonb
WHERE id = 'cmr89azd300j21yw20o1l74so'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j52$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j52$::jsonb
WHERE id = 'cmr89b1kn00jo1yw25eggjln8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j53$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j53$::jsonb
WHERE id = 'cmr89b3rw00ka1yw2fyy7azhh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j54$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j54$::jsonb
WHERE id = 'cmr89b4h700kh1yw2saz5vmlj'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j55$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j55$::jsonb
WHERE id = 'cmr89p0mj00mt1yw2ckmmyh4q'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j56$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j56$::jsonb
WHERE id = 'cmr89p1mj00n51yw2mdoxmrf6'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j57$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j57$::jsonb
WHERE id = 'cmr89p3t200nq1yw2kv798nd1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j58$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j58$::jsonb
WHERE id = 'cmr89zvzv00qe1yw2vyq9nbu3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j59$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j59$::jsonb
WHERE id = 'cmr8adx6m00t21yw21q80u7vj'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j60$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j60$::jsonb
WHERE id = 'cmr8adyf500te1yw2v7xo4leq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j61$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j61$::jsonb
WHERE id = 'cmr8adz1j00tk1yw2an7h9c62'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j62$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j62$::jsonb
WHERE id = 'cmr8ae0uf00u01yw232sfmwxz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j63$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j63$::jsonb
WHERE id = 'cmr8ae0y000u11yw2jdlksjey'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j64$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j64$::jsonb
WHERE id = 'cmr8ae22p00uc1yw2ophwqsfp'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j65$[{"label": "Hepatol Commun. 2024. Management of alcohol withdrawal syndrome in patients with alcohol-associated liver disease. Alcohol withdrawal syndrome (AWS) can be dangerous, is a common barrier to AUD recovery, and may complicate inpatient admissions for liver-related complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10805424/"}]$j65$::jsonb
WHERE id = 'cmr8aypwx00w71yw2rvl02usm'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j66$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j66$::jsonb
WHERE id = 'cmr8ayrlj00wo1yw2su7q4s18'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j67$[{"label": "Nutrients. 2026. The Broad Effect of Iodine in Graves' Hyperthyroidism and Its Relationship with the Gut Microbiota. Graves' disease, the most common cause of hyperthyroidism, is a relevant condition for exploring dietary interventions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13074327/"}]$j67$::jsonb
WHERE id = 'cmr8ays7400wu1yw21lv8bq81'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j68$[{"label": "Brain Sci. 2021. Imaging of Substantia Nigra in Parkinson's Disease: A Narrative Review. Parkinson's disease (PD) is a progressive neurodegenerative disorder, characterized by motor and non-motor symptoms due to the degeneration of the pars compacta of the substantia nigra (SNc) with dopaminergic denervation of the striatum.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8230134/"}]$j68$::jsonb
WHERE id = 'cmr8aytlb00x81yw285byv2yi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j69$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j69$::jsonb
WHERE id = 'cmr8bfz0s00z61yw24rkeig4s'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j70$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j70$::jsonb
WHERE id = 'cmr8bg0vr00zs1yw2vcqpb8s4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j71$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j71$::jsonb
WHERE id = 'cmr8bg1dr00zy1yw2oiw508v0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j72$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j72$::jsonb
WHERE id = 'cmr8bg1mp01011yw2lc1a7jd9'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j73$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j73$::jsonb
WHERE id = 'cmr8by2fg012h1yw2esug8qws'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j74$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j74$::jsonb
WHERE id = 'cmr8by3eb012t1yw267ssvjon'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j75$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j75$::jsonb
WHERE id = 'cmr8by4b601341yw2urwv7226'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j76$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j76$::jsonb
WHERE id = 'cmr8by54s013e1yw2ir1apqlm'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j77$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j77$::jsonb
WHERE id = 'cmr8by655013q1yw29pbtpiy3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j78$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j78$::jsonb
WHERE id = 'cmr8cciip015p1yw24dfalhno'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j79$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j79$::jsonb
WHERE id = 'cmr8ccjia01611yw2wazthzh8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j80$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j80$::jsonb
WHERE id = 'cmr8cckfs016c1yw2vrrcrxic'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j81$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j81$::jsonb
WHERE id = 'cmr8ccmes016z1yw2pd527aka'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j82$[{"label": "Rev Cardiovasc Med. 2024. The Upper Common Pathway in Atrioventricular Nodal Reentrant Tachycardia: A Comprehensive Review of Evidence and Current Perspectives. Atrioventricular nodal reentrant tachycardia (AVNRT) is the most common form of paroxysmal supraventricular tachycardia, and its diagnostic and therapeutic approaches have been well-established.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11263828/"}]$j82$::jsonb
WHERE id = 'cmr8clom2018r1yw2ehn7oc23'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j83$[{"label": "Rev Cardiovasc Med. 2024. The Upper Common Pathway in Atrioventricular Nodal Reentrant Tachycardia: A Comprehensive Review of Evidence and Current Perspectives. Atrioventricular nodal reentrant tachycardia (AVNRT) is the most common form of paroxysmal supraventricular tachycardia, and its diagnostic and therapeutic approaches have been well-established.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11263828/"}]$j83$::jsonb
WHERE id = 'cmr8clq4g01991yw2mzi8gzne'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j84$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j84$::jsonb
WHERE id = 'cmr8d6eoy000c1yazyoj9mifc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j85$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j85$::jsonb
WHERE id = 'cmr8d6f7q000h1yazqknsglbh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j86$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j86$::jsonb
WHERE id = 'cmr8d6hk100141yaza5r8bv6l'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j87$[{"label": "Antioxidants (Basel). 2026. Uric Acid as a Redox Switch in Gout. Gout is a crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate (MSU) crystal deposition.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13509686/"}]$j87$::jsonb
WHERE id = 'cmr8d6im3001e1yaznntyija7'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j88$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j88$::jsonb
WHERE id = 'cmr8dn37n003n1yaz3tkv6zs2'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j89$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j89$::jsonb
WHERE id = 'cmr8dn4fa003z1yaz4hhce11x'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j90$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j90$::jsonb
WHERE id = 'cmr8dyjqv006a1yazvz5035yl'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j91$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j91$::jsonb
WHERE id = 'cmr8dylb2006t1yazhgxt7eqh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j92$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j92$::jsonb
WHERE id = 'cmr8ei0n2009g1yazd5qxjw33'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j93$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j93$::jsonb
WHERE id = 'cmr8ei1tv009s1yazzsq0xtlv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j94$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j94$::jsonb
WHERE id = 'cmr8ei41300ae1yazfeaqacwu'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j95$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j95$::jsonb
WHERE id = 'cmr8f0j9v00ci1yazupwtotjs'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j96$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j96$::jsonb
WHERE id = 'cmr8f0ke400cu1yaz89mfr18a'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j97$[{"label": "Exp Physiol. 2026. Exploring lifestyle management in polycystic ovary syndrome through implementation frameworks. Polyendocrine metabolic ovarian syndrome [PMOS; previously known as polycystic ovary syndrome (PCOS)] is an endocrine condition affecting 10%-13% of women of reproductive age, with cardiometabolic, reproductive and psychological features.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13475995/"}]$j97$::jsonb
WHERE id = 'cmr8f0na800ds1yazwh0oz4o5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j98$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j98$::jsonb
WHERE id = 'cmr8f0nd700dt1yazwq0ic8za'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j99$[{"label": "MedComm (2020). 2026. G Protein-Coupled Receptor in High-Altitude Diseases: Mechanistic Insights and Therapeutic Opportunities. High-altitude diseases (HADs) encompass a spectrum of acute and chronic disorders-including acute mountain sickness, high-altitude cerebral edema, high-altitude pulmonary edema, high-altitude polycythemia, high-altitude pulmonary hypertension, and high-altitude heart disease-that arise from insufficient adaptation to hypobaric hypoxia.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13634171/"}]$j99$::jsonb
WHERE id = 'cmra6lyzb0036ic04rhk09zzi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j100$[{"label": "Res Pract Thromb Haemost. 2026. von Willebrand disease: an illustrated review. First described 100 years ago, von Willebrand disease (VWD) is the most common inherited bleeding disorder, characterized by a quantitative or qualitative deficiency of von Willebrand factor (VWF), a large multimeric glycoprotein central to hemostasis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13471213/"}]$j100$::jsonb
WHERE id = 'cmrpv8flk00041ynceghdq9gj'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j101$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j101$::jsonb
WHERE id = 'cmrpv8fog00051ync63u9e4wy'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j102$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j102$::jsonb
WHERE id = 'cmrpv8hhz000s1yncornsxfkc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j103$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j103$::jsonb
WHERE id = 'cmrpvdq0300271yncmubvfz8r'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j104$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j104$::jsonb
WHERE id = 'cmrpvds4b002y1yncf84dkwmc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j105$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j105$::jsonb
WHERE id = 'cmrpvdsjm00331yncibw34wxh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j106$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j106$::jsonb
WHERE id = 'cmrpvdss000361yncotf7zp9j'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j107$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j107$::jsonb
WHERE id = 'cmrpvuxwh000r1yh5idkpxyf8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j108$[{"label": "Food Sci Nutr. 2026. Effects of Naringenin on Diabetic Nephropathy: A Systematic Review and Meta-Analysis of Rodent Studies. Diabetic nephropathy (DN) is a common complication of diabetes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13501257/"}]$j108$::jsonb
WHERE id = 'cmrpvuy8z000v1yh5a2u8z3wc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j109$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j109$::jsonb
WHERE id = 'cmrpvyvwe000f1yrtcrs99gnc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j110$[{"label": "J Bone Oncol. 2016. P62: An emerging oncotarget for osteolytic metastasis. The pathogenesis of osteolytic metastasis is a \"vicious cycle\" between tumor cells and bone cells (primarily the osteoclasts), which is mediated by secretory factors.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4782024/"}]$j110$::jsonb
WHERE id = 'cmrpvyvz9000g1yrt99xizetx'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j111$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j111$::jsonb
WHERE id = 'cmrpvyx0j000t1yrtk02l4hq8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j112$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j112$::jsonb
WHERE id = 'cmrpw171f002e1yh5tus3hd43'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j113$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j113$::jsonb
WHERE id = 'cmrpw18po002u1yh5h6rwsu2t'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j114$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j114$::jsonb
WHERE id = 'cmrpw57ac002h1yrto7ko63hk'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j115$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j115$::jsonb
WHERE id = 'cmrpw57h9002j1yrt9v7wtusz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j116$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j116$::jsonb
WHERE id = 'cmrpw57oa002l1yrtbo2dzb2f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j117$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j117$::jsonb
WHERE id = 'cmrpw58dj002s1yrtdryq9pfg'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j118$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j118$::jsonb
WHERE id = 'cmrpw5a2k00391yrt0soex2m6'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j119$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j119$::jsonb
WHERE id = 'cmrpw7b3l004q1yh5dah0v4zq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j120$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j120$::jsonb
WHERE id = 'cmrpw7bc5004t1yh5r2bn75o0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j121$[{"label": "J Bone Oncol. 2016. P62: An emerging oncotarget for osteolytic metastasis. The pathogenesis of osteolytic metastasis is a \"vicious cycle\" between tumor cells and bone cells (primarily the osteoclasts), which is mediated by secretory factors.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4782024/"}]$j121$::jsonb
WHERE id = 'cmrpwcip5004h1yrtbas6b6yc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j122$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j122$::jsonb
WHERE id = 'cmrpwcjsy004u1yrtxpw51ise'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j123$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j123$::jsonb
WHERE id = 'cmrpwfdza006k1yh5ktngqi18'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j124$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j124$::jsonb
WHERE id = 'cmrpwffho006z1yh5ne84kxif'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j125$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j125$::jsonb
WHERE id = 'cmrpwfga900771yh50y405hyc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j126$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j126$::jsonb
WHERE id = 'cmrpwfgha00791yh5u3edvlkp'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j127$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j127$::jsonb
WHERE id = 'cmrpwfgru007c1yh5uv5lpw3o'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j128$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j128$::jsonb
WHERE id = 'cmrpwiwry006v1yrt2ipwflb3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j129$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j129$::jsonb
WHERE id = 'cmrpwiwz3006x1yrtkgg8c3pw'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j130$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j130$::jsonb
WHERE id = 'cmrpwixrb00751yrt1xm429ds'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j131$[{"label": "Rev Cardiovasc Med. 2026. Surgical Management of Acute Type A Aortic Dissection. Acute type A aortic dissection (ATAAD) is a life-threatening cardiovascular emergency characterized by disruption of the ascending aortic intima with subsequent propagation of a false lumen.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732653/"}]$j131$::jsonb
WHERE id = 'cmrr4ycn3002l1y6pxpiby1u0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j132$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j132$::jsonb
WHERE id = 'cmrr4ycqn002m1y6pohywtrce'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j133$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j133$::jsonb
WHERE id = 'cmrr4yd29002p1y6pb7iptt3m'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j134$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j134$::jsonb
WHERE id = 'cmrr4yeli002x1y6p00xfob66'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j135$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j135$::jsonb
WHERE id = 'cmrr4yg4700381y6psje614lh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j136$[{"label": "MedComm (2020). 2026. G Protein-Coupled Receptor in High-Altitude Diseases: Mechanistic Insights and Therapeutic Opportunities. High-altitude diseases (HADs) encompass a spectrum of acute and chronic disorders-including acute mountain sickness, high-altitude cerebral edema, high-altitude pulmonary edema, high-altitude polycythemia, high-altitude pulmonary hypertension, and high-altitude heart disease-that arise from insufficient adaptation to hypobaric hypoxia.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13634171/"}]$j136$::jsonb
WHERE id = 'cmrrbwa7w000dl104bzwzzw1v'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j137$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j137$::jsonb
WHERE id = 'cmrrtm6fc004n1y8wh427mmqo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j138$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j138$::jsonb
WHERE id = 'cmrrtm7w100521y8wga6v8lia'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j139$[{"label": "MedComm (2020). 2026. Alzheimer's Disease: Mechanisms and Therapeutic Advances. Alzheimer's disease (AD) is a devastating neurodegenerative condition accompanied by widespread central nervous system damage and complex networked pathogenesis spanning molecular, cellular, and systemic dimensions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732115/"}]$j139$::jsonb
WHERE id = 'cmrrtm8um005c1y8wifcow1my'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j140$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j140$::jsonb
WHERE id = 'cmrru3pap00az1y8wgjymi99x'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j141$[{"label": "Food Sci Nutr. 2026. Effects of Naringenin on Diabetic Nephropathy: A Systematic Review and Meta-Analysis of Rodent Studies. Diabetic nephropathy (DN) is a common complication of diabetes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13501257/"}]$j141$::jsonb
WHERE id = 'cmrru3rku00bo1y8w13pcsqom'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j142$[{"label": "Food Sci Nutr. 2026. Effects of Naringenin on Diabetic Nephropathy: A Systematic Review and Meta-Analysis of Rodent Studies. Diabetic nephropathy (DN) is a common complication of diabetes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13501257/"}]$j142$::jsonb
WHERE id = 'cmrruac4y00cy1y8wwsnci0fq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j143$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j143$::jsonb
WHERE id = 'cmrruafbj00db1y8wyv97v8lr'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j144$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j144$::jsonb
WHERE id = 'cmrrufy5z00fg1y8wxfsthuxi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j145$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j145$::jsonb
WHERE id = 'cmrrufznq00fw1y8wma0cserf'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j146$[{"label": "Front Med (Lausanne). 2026. Treatment and practical considerations of IgA nephropathy. IgA nephropathy is a common cause of glomerular disease that may result in kidney failure.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13714490/"}]$j146$::jsonb
WHERE id = 'cmrrum7x300hw1y8w422gf18f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j147$[{"label": "Rev Cardiovasc Med. 2026. Surgical Management of Acute Type A Aortic Dissection. Acute type A aortic dissection (ATAAD) is a life-threatening cardiovascular emergency characterized by disruption of the ascending aortic intima with subsequent propagation of a false lumen.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732653/"}]$j147$::jsonb
WHERE id = 'cmrruxugz00m31y8wh1qn2z1f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j148$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j148$::jsonb
WHERE id = 'cmrrv65o700od1y8wpgr7knpt'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j149$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j149$::jsonb
WHERE id = 'cmrsew96q00031y552pb0dwio'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j150$[{"label": "Front Med (Lausanne). 2026. Treatment and practical considerations of IgA nephropathy. IgA nephropathy is a common cause of glomerular disease that may result in kidney failure.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13714490/"}]$j150$::jsonb
WHERE id = 'cmrsewaq9000n1y557f5qjn6a'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j151$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j151$::jsonb
WHERE id = 'cmrsewaye000q1y553v8379f1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j152$[{"label": "Front Med (Lausanne). 2026. Treatment and practical considerations of IgA nephropathy. IgA nephropathy is a common cause of glomerular disease that may result in kidney failure.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13714490/"}]$j152$::jsonb
WHERE id = 'cmrsewb6w000t1y558qh2gdov'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j153$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j153$::jsonb
WHERE id = 'cmrsf3gt200291y55you8bhlf'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j154$[{"label": "Food Sci Nutr. 2026. Effects of Naringenin on Diabetic Nephropathy: A Systematic Review and Meta-Analysis of Rodent Studies. Diabetic nephropathy (DN) is a common complication of diabetes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13501257/"}]$j154$::jsonb
WHERE id = 'cmrsf3iav002o1y550u450ied'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j155$[{"label": "Kidney Res Clin Pract. 2018. Immune mechanisms in the different phases of acute tubular necrosis. Acute kidney injury is a clinical syndrome that can be caused by numerous diseases including acute tubular necrosis (ATN).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6147180/"}]$j155$::jsonb
WHERE id = 'cmrsf3ihz002q1y5557otyapm'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j156$[{"label": "FDA label, DailyMed. Fluoxetine hydrochloride capsules. Fluoxetine capsules are a selective serotonin reuptake inhibitor indicated for: Acute and maintenance treatment of Major Depressive Disorder (MDD).", "url": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77d5c10a-0cfc-4b89-942c-0fb5c67ae409"}]$j156$::jsonb
WHERE id = 'cmrtffir400061yx2jr9eotne'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j157$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j157$::jsonb
WHERE id = 'cmrtfrrga000z1yx2cbaqkli5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j158$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j158$::jsonb
WHERE id = 'cmrtg0vk000181yx2a5t0s73k'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j159$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j159$::jsonb
WHERE id = 'cmrtg0wii001g1yx29x4bi7id'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j160$[{"label": "Ther Clin Risk Manag. 2022. Review of Treatment for Adenosine Deaminase Deficiency (ADA) Severe Combined Immunodeficiency (SCID). Adenosine deaminase deficiency (ADA) is a purine salvage pathway deficiency that results in buildup of toxic metabolites causing death in rapidly dividing cells, especially lymphocytes.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9512634/"}]$j160$::jsonb
WHERE id = 'cmrtg0wzc001k1yx2sroc78z5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j161$[{"label": "Front Neurol. 2026. Cerebral venous sinus thrombosis in pregnancy and the postpartum period: epidemiology, management, and maternal mortality-a systematic review and meta-analysis. Background Cerebral venous sinus thrombosis is a rare cerebrovascular disease of importance both during pregnancy and in the puerperium.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13612440/"}]$j161$::jsonb
WHERE id = 'cmrthhqya007d1yaxjkpxlhtl'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j162$[{"label": "J Clin Med. 2025. The Etiopathogenesis of Preeclampsia: Where Do We Stand Now? The maternal syndrome is characterized by an excess of antiangiogenic factors and appears in the second half of pregnancy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12653203/"}]$j162$::jsonb
WHERE id = 'cmrtqfygk00001yx3rmok3vwq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j163$[{"label": "MedComm (2020). 2026. G Protein-Coupled Receptor in High-Altitude Diseases: Mechanistic Insights and Therapeutic Opportunities. High-altitude diseases (HADs) encompass a spectrum of acute and chronic disorders-including acute mountain sickness, high-altitude cerebral edema, high-altitude pulmonary edema, high-altitude polycythemia, high-altitude pulmonary hypertension, and high-altitude heart disease-that arise from insufficient adaptation to hypobaric hypoxia.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13634171/"}]$j163$::jsonb
WHERE id = 'cmrvm5ych000rjw04dtoflv9t'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j164$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j164$::jsonb
WHERE id = 'b1x7840d384e12598d79f098a15'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j165$[{"label": "Res Heart Yield Transl Med. 2026. Ankle-Brachial Index as a Predictor of Cardiovascular and Cerebrovascular Events in Hypertension: A Systematic Review. The ankle-brachial index (ABI) is a simple, noninvasive test usually used for peripheral artery disease detection, but its prognostic value in hypertensive patients is still poorly defined.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13614910/"}]$j165$::jsonb
WHERE id = 'b2x34e2fa23bdd9674443b0294c'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j166$[{"label": "Res Heart Yield Transl Med. 2026. Ankle-Brachial Index as a Predictor of Cardiovascular and Cerebrovascular Events in Hypertension: A Systematic Review. The ankle-brachial index (ABI) is a simple, noninvasive test usually used for peripheral artery disease detection, but its prognostic value in hypertensive patients is still poorly defined.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13614910/"}]$j166$::jsonb
WHERE id = 'b3x6a1c073b8850154c6c85fe88'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j167$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j167$::jsonb
WHERE id = 'cmpnjhcau002f1ymxty8q5eqc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j168$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j168$::jsonb
WHERE id = 'cmpnjjcsd09cy1ymxf8b2sydj'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j169$[{"label": "J Am Heart Assoc. 2022. Malignant Hypertension: Current Perspectives and Challenges. Malignant hypertension is a hypertensive emergency, with rapid disease progression and poor prognosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9075423/"}]$j169$::jsonb
WHERE id = 'cmqxd0on200661ymazj4sr92q'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j170$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j170$::jsonb
WHERE id = 'cmqxd0opn00671ymaexrjcogp'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j171$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j171$::jsonb
WHERE id = 'cmqxd0ovw00691yma7zwej1oq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j172$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j172$::jsonb
WHERE id = 'cmqxd0pcj006e1yma0n4zjzj5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j173$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j173$::jsonb
WHERE id = 'cmqxd0prh006j1yma922hejmb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j174$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j174$::jsonb
WHERE id = 'cmqxd0s2m00721yma3kw70v5j'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j175$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j175$::jsonb
WHERE id = 'cmqxdeop300a31yma3gjof544'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j176$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j176$::jsonb
WHERE id = 'cmqxdeq3k00ah1yma21xk0ftv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j177$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j177$::jsonb
WHERE id = 'cmqxdy4j600041y7907vclno6'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j178$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j178$::jsonb
WHERE id = 'cmqxdy4or00061y79cfdojwx8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j179$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j179$::jsonb
WHERE id = 'cmqxdy62q000n1y79xfv1snpb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j180$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j180$::jsonb
WHERE id = 'cmqxeea4h004a1y799jx5xe3q'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j181$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j181$::jsonb
WHERE id = 'cmr4gwg95000b1ydeg1jfbyjq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j182$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j182$::jsonb
WHERE id = 'cmr4hnntd00801yde74xil0zv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j183$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j183$::jsonb
WHERE id = 'cmr4hzudw00a91ydemnlxhisu'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j184$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j184$::jsonb
WHERE id = 'cmr4j8njf00jr1ydeb976fqs0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j185$[{"label": "Res Pract Thromb Haemost. 2026. von Willebrand disease: an illustrated review. First described 100 years ago, von Willebrand disease (VWD) is the most common inherited bleeding disorder, characterized by a quantitative or qualitative deficiency of von Willebrand factor (VWF), a large multimeric glycoprotein central to hemostasis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13471213/"}]$j185$::jsonb
WHERE id = 'cmr4jrbzf00ni1ydebg0mky5g'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j186$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j186$::jsonb
WHERE id = 'cmr4k49dh00q71ydezaift44s'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j187$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j187$::jsonb
WHERE id = 'cmr4k49v400qd1yde0rfelxk7'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j188$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j188$::jsonb
WHERE id = 'cmr869iea003h1yr9gkh3b3zo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j189$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j189$::jsonb
WHERE id = 'cmr86obok007w1yr9dcr6f9t1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j190$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j190$::jsonb
WHERE id = 'cmr86ycr300av1yr9h4aftemq'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j191$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j191$::jsonb
WHERE id = 'cmr877ikh00d31yr93aqqk5ka'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j192$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j192$::jsonb
WHERE id = 'cmr877ky000dw1yr9j6ef4rjd'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j193$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j193$::jsonb
WHERE id = 'cmr87iyu900g81yr9jp8wl1ng'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j194$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j194$::jsonb
WHERE id = 'cmr87j2ed00h61yr9avv0wgza'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j195$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j195$::jsonb
WHERE id = 'cmr87sjhc00je1yr94kggxded'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j196$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j196$::jsonb
WHERE id = 'cmr87sk8y00jm1yr9nwj3wu12'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j197$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j197$::jsonb
WHERE id = 'cmr87sln800k31yr9qrddzi9e'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j198$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j198$::jsonb
WHERE id = 'cmr87slq600k41yr942h0ihgk'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j199$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j199$::jsonb
WHERE id = 'cmr87smpu00kg1yr9wesb4x27'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j200$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j200$::jsonb
WHERE id = 'cmr87smyp00kj1yr94jfvia2n'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j201$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j201$::jsonb
WHERE id = 'cmr87so3s00kx1yr9zuib8pln'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j202$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j202$::jsonb
WHERE id = 'cmr88ickh00q51yr91m1eb7p9'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j203$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j203$::jsonb
WHERE id = 'cmr88igl700r81yr9pmkc9ga4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j204$[{"label": "MedComm (2020). 2026. Alzheimer's Disease: Mechanisms and Therapeutic Advances. Alzheimer's disease (AD) is a devastating neurodegenerative condition accompanied by widespread central nervous system damage and complex networked pathogenesis spanning molecular, cellular, and systemic dimensions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732115/"}]$j204$::jsonb
WHERE id = 'cmr88ih3d00rd1yr9zo1gaxyo'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j205$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j205$::jsonb
WHERE id = 'cmr891a7p00wy1yr9ghrsmvxs'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j206$[{"label": "Front Pharmacol. 2026. Treatment of vascular dementia based on neuroprotection and neural repair strategies: from pathophysiology to natural products. Vascular dementia (VaD) is a heterogeneous cognitive disorder associated with cerebrovascular pathology and persistent vascular dysfunction.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13727566/"}]$j206$::jsonb
WHERE id = 'cmr891ee800y41yr96l2sipc7'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j207$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j207$::jsonb
WHERE id = 'cmr89vafc012s1yr942d5fm42'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j208$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j208$::jsonb
WHERE id = 'cmr89vb3w01301yr9iu40zc13'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j209$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j209$::jsonb
WHERE id = 'cmr89vc0n013b1yr92uykrdym'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j210$[{"label": "JGH Open. 2024. Impact of fecal microbiota transplantation in severe alcoholic hepatitis: A systematic review and meta-analysis. Background and aim Severe alcoholic hepatitis (SAH) is a serious condition with few treatments.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11331245/"}]$j210$::jsonb
WHERE id = 'cmr89ve2r01401yr9msjgw3ft'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j211$[{"label": "Hepatol Commun. 2024. Management of alcohol withdrawal syndrome in patients with alcohol-associated liver disease. Alcohol withdrawal syndrome (AWS) can be dangerous, is a common barrier to AUD recovery, and may complicate inpatient admissions for liver-related complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10805424/"}]$j211$::jsonb
WHERE id = 'cmr8abeze016r1yr92yvk3oh8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j212$[{"label": "Nutrients. 2026. The Broad Effect of Iodine in Graves' Hyperthyroidism and Its Relationship with the Gut Microbiota. Graves' disease, the most common cause of hyperthyroidism, is a relevant condition for exploring dietary interventions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13074327/"}]$j212$::jsonb
WHERE id = 'cmr8abfk7016y1yr9qzbssgkg'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j213$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j213$::jsonb
WHERE id = 'cmr8al85g019e1yr9yfsqa2xm'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j214$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j214$::jsonb
WHERE id = 'cmr8al947019o1yr9pcj0cot8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j215$[{"label": "Front Neurol. 2026. Cerebral venous sinus thrombosis in pregnancy and the postpartum period: epidemiology, management, and maternal mortality-a systematic review and meta-analysis. Background Cerebral venous sinus thrombosis is a rare cerebrovascular disease of importance both during pregnancy and in the puerperium.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13612440/"}]$j215$::jsonb
WHERE id = 'cmr8al9jy019t1yr9i5n257p8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j216$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j216$::jsonb
WHERE id = 'cmr8albj801ah1yr9vbhuv66b'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j217$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j217$::jsonb
WHERE id = 'cmrpvqaqr000x1yludmhg6a5x'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j218$[{"label": "Nutrients. 2026. The Broad Effect of Iodine in Graves' Hyperthyroidism and Its Relationship with the Gut Microbiota. Graves' disease, the most common cause of hyperthyroidism, is a relevant condition for exploring dietary interventions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13074327/"}]$j218$::jsonb
WHERE id = 'cmrqh92nv000k1ypxadw5hq2l'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j219$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j219$::jsonb
WHERE id = 'cmrqhfo5d00351ypxwr84xxsf'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j220$[{"label": "Front Cell Infect Microbiol. 2026. The gut microbiota in Graves' disease: mechanistic insights and clinical implications. Graves' disease (GD) is an autoimmune form of hyperthyroidism characterized by loss of immune tolerance to the thyrotropin receptor and sustained thyroid hormone excess.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574598/"}]$j220$::jsonb
WHERE id = 'cmrqhwmey007f1ypx0uozv5f5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j221$[{"label": "Hepatol Commun. 2024. Management of alcohol withdrawal syndrome in patients with alcohol-associated liver disease. Alcohol withdrawal syndrome (AWS) can be dangerous, is a common barrier to AUD recovery, and may complicate inpatient admissions for liver-related complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10805424/"}]$j221$::jsonb
WHERE id = 'cmrqhwmte007j1ypx98nwn13u'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j222$[{"label": "Front Neurol. 2025. Functional MRI in optic neuritis: insights into cortical modulation and possible recovery mechanisms. Optic neuritis (ON) is an inflammatory, demyelinating optic neuropathy commonly associated with multiple sclerosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12708295/"}]$j222$::jsonb
WHERE id = 'cmrrbwath000zl104qyhhqlna'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j223$[{"label": "Cerebrovasc Dis. 2026. Advances in Stereotactic Hematoma Evacuation for Hypertensive Intracerebral Hemorrhage and the Value of Multimodal Monitoring. Background Hypertensive intracerebral hemorrhage (HICH) is a common spontaneous intracerebral hemorrhage with high morbidity and mortality.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13623338/"}]$j223$::jsonb
WHERE id = 'cmrrvb5tm00051yl8g0fctnke'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j224$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j224$::jsonb
WHERE id = 'cmrrvrqm900951yl8ftntdwxy'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j225$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j225$::jsonb
WHERE id = 'cmrrvztsz00dp1yl8pw0kyjrh'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j226$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j226$::jsonb
WHERE id = 'cmrrvzvx600e81yl89zaqnqgv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j227$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j227$::jsonb
WHERE id = 'cmrrw4x0q00fv1yl86hj8l56r'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j228$[{"label": "Cureus. 2026. Prevalence, Clinical Profile, and Outcomes of Diabetic Ketoacidosis (DKA) in Pediatric ICU Patients in the Middle East: A Systematic Review and Meta-Analysis. Diabetic ketoacidosis (DKA) is a life-threatening complication of type 1 diabetes mellitus (T1DM) in children.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12998401/"}]$j228$::jsonb
WHERE id = 'cmrrw4z9900gn1yl8r6zurt3k'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j229$[{"label": "Cureus. 2026. Prevalence, Clinical Profile, and Outcomes of Diabetic Ketoacidosis (DKA) in Pediatric ICU Patients in the Middle East: A Systematic Review and Meta-Analysis. Diabetic ketoacidosis (DKA) is a life-threatening complication of type 1 diabetes mellitus (T1DM) in children.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12998401/"}]$j229$::jsonb
WHERE id = 'cmrsfgmd8004r1ynyz7r7ybo8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j230$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j230$::jsonb
WHERE id = 'cmrtexh6p00021y30rjatkdz2'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j231$[{"label": "Front Pharmacol. 2026. Treatment of vascular dementia based on neuroprotection and neural repair strategies: from pathophysiology to natural products. Vascular dementia (VaD) is a heterogeneous cognitive disorder associated with cerebrovascular pathology and persistent vascular dysfunction.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13727566/"}]$j231$::jsonb
WHERE id = 'cmrtf2o3l000m1y309oe4wpvk'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j232$[{"label": "JACC Asia. 2026. Applied Anatomy of Perimembranous Ventricular Septal Defect for Transcatheter Device Closure. Perimembranous ventricular septal defect is a common congenital heart disease effectively treated by transcatheter device closure with high success rates and minimal complications.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13350687/"}]$j232$::jsonb
WHERE id = 'cmrtf2oh9000r1y30ncbsg9tp'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j233$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j233$::jsonb
WHERE id = 'cmrtg5ycg000s1ydwj5sin6hw'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j234$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j234$::jsonb
WHERE id = 'cmrtggafo004j1ydw7lyot374'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j235$[{"label": "Front Endocrinol (Lausanne). 2026. Interprofessional collaboration in emergency department nursing care for patients with diabetic ketoacidosis. Diabetic ketoacidosis (DKA) is an acute metabolic emergency requiring timely risk recognition, fluid resuscitation, insulin therapy, electrolyte correction, dynamic monitoring, and coordinated care transitions.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13713269/"}]$j235$::jsonb
WHERE id = 'cmrtggb4h004s1ydwdyhjeey8'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j236$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j236$::jsonb
WHERE id = 'cmrtprwjo00031yqcwpoxcrgi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j237$[{"label": "Front Neurol. 2025. Functional MRI in optic neuritis: insights into cortical modulation and possible recovery mechanisms. Optic neuritis (ON) is an inflammatory, demyelinating optic neuropathy commonly associated with multiple sclerosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12708295/"}]$j237$::jsonb
WHERE id = 'cmru6qymi002fl104kllsz4s3'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j238$[{"label": "Front Neurol. 2025. Functional MRI in optic neuritis: insights into cortical modulation and possible recovery mechanisms. Optic neuritis (ON) is an inflammatory, demyelinating optic neuropathy commonly associated with multiple sclerosis.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12708295/"}]$j238$::jsonb
WHERE id = 'cmrvm5yz4001ijw049n92tmhu'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j239$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j239$::jsonb
WHERE id = 'cmtps7u5y00071y1q3m679u8i'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j240$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j240$::jsonb
WHERE id = 'cmtps7vu9000t1y1qcf1guhzt'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j241$[{"label": "ESC Heart Fail. 2026. Lower limb compression in acute heart failure and predominant tissue congestion. Acute decompensated heart failure (ADHF) is often treated with diuretic agents in both the inpatient and ambulatory settings.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13557009/"}]$j241$::jsonb
WHERE id = 'cmtpw0njn002i1ylc2ttubtxi'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j242$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j242$::jsonb
WHERE id = 'cmtpw0qeb003b1ylcmx1ku5b5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j243$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j243$::jsonb
WHERE id = 'cmtpwlceb00001y6hinm6aq2i'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j244$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j244$::jsonb
WHERE id = 'cmtpwldrk000h1y6h3kn0vu73'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j245$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j245$::jsonb
WHERE id = 'cmtpwleuf000t1y6hj0x44c5m'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j246$[{"label": "Circ Heart Fail. 2026. Hypoperfusion-Shock Continuum in Acute Decompensated Heart Failure. Acute decompensated heart failure is a clinical syndrome characterized by upregulation of neurohormonal compensatory mechanisms that, while intended to preserve organ perfusion as a response to reduced cardiac output, progressively exacerbate systemic congestion.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13574355/"}]$j246$::jsonb
WHERE id = 'cmtpwlgg8001d1y6hl2rtzhku'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $j247$[{"label": "Front Cardiovasc Med. 2026. Integrated management of acute pulmonary embolism and the post-pulmonary embolism syndrome: risk stratification, modern therapies, and long-term follow-up. Pulmonary embolism (PE) is increasingly recognized as an episode of care that extends well beyond hospital discharge.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13732469/"}]$j247$::jsonb
WHERE id = 'cmtpwlh30001l1y6hm2d2j9rp'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
DO $verify$
DECLARE unchanged integer;
BEGIN
  SELECT COUNT(*) INTO unchanged
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s12_20261113_backup b ON b.id = q.id
  WHERE q."references" IS NOT DISTINCT FROM b."references";
  IF unchanged <> 0 THEN
    RAISE EXCEPTION '% rows were not updated', unchanged;
  END IF;
END
$verify$;
COMMIT;
