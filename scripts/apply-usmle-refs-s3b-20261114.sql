-- Second citation batch for served USMLE Step 3 items that still had no URL, 2026-11-14.
-- Backup qbi_usmle_refs_s3b_20261114_backup (248 rows) is created first.
-- Only the references column is updated. The two keys flagged on 2026-11-13 are not in this list.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3b-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3b_20261114_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmqxe01zy00ea1ymava7y2dk9',
    'cmqxf0p0q001o1yf1aj6hns0q',
    'cmr31dki100b9js04p7os14o7',
    'cmr31dkjp00bbjs049lt2fmtd',
    'cmr4bagvn004o1ykyepyxsgbq',
    'cmr4bahqr004x1ykyschj9fa1',
    'cmr4bahxl004z1yky28nvfuzd',
    'cmr4bnykh00bc1ykynwibtaih',
    'cmr4bvdkm00dy1ykypx6rz093',
    'cmr4c4scb00h91ykyvrh4obef',
    'cmr4c4ufj00ht1ykywstku186',
    'cmr4c4w9o00ib1ykybhgolgha',
    'cmr4c4wi500id1ykytlq335io',
    'cmr4cbvrd00kn1ykyhd2sl9rs',
    'cmr4cvbb300qy1yky4l91kwry',
    'cmr4cvf5m00s81ykytmjiadr9',
    'cmr4d3ti300ug1yky3vizxp8g',
    'cmr4d3tx000ul1ykygjhp4mzd',
    'cmr4d3u6k00uo1ykyd1jdhopp',
    'cmr4dbb1y00xm1ykyuivmyjht',
    'cmr4dbby600xu1ykypkxzpg5w',
    'cmr4dzaf201901yky840p2hi7',
    'cmr4enkl601ir1ykyo4qy9p16',
    'cmr4extpo01lp1ykyce6j1wqb',
    'cmr4exv4101m61ykymi38udrq',
    'cmr4fdlny01sk1ykyh82bc80b',
    'cmr4ftfbw01z31ykyahy2czpt',
    'cmr4ftg1h01zc1ykyuaa45ck0',
    'cmr8attx500091ylo6hoxjvgh',
    'cmr8atu0v000a1ylo1lpjw8bk',
    'cmr8atvux000s1yloy8t7la9y',
    'cmr8aty4c001e1ylo88qkocsz',
    'cmr8aty80001f1yloss6imt5g',
    'cmr8bhfio006j1yloin556eq7',
    'cmr8bhft5006m1ylolf93jz8i',
    'cmr8bhibu007c1ylomrfx3fa8',
    'cmr8bhj45007k1yloahg0ti38',
    'cmr8bhkld007z1ylofx5lsp51',
    'cmr8br3qx009s1ylonnwk69df',
    'cmr8br47k009x1ylovnoltnjz',
    'cmr8br50q00a71ylog5v086qg',
    'cmr8br6f900ao1yloqwfux2gx',
    'cmr8br6kz00aq1ylocvfemwqd',
    'cmr8br72500aw1yloom1b3glc',
    'cmr8br7dt00b01yloxrd29qqn',
    'cmr8ccdu400ju1ylolfi8g26k',
    'cmr8ccenp00k41yloewfnfu2d',
    'cmr8ccj0a00l01yloj1h4hv1a',
    'cmr8cn7yv00n31ylooktivms2',
    'cmr8cn9sd00nn1ylokatc5kvv',
    'cmr8cnaaj00nt1yloh7kzc7un',
    'cmr8cnchh00oj1ylot7753ctx',
    'cmr8d1yzs00rh1ylozuwjrjay',
    'cmr8db6f700tf1ylodhz2o16a',
    'cmr8db7z500tu1yloaicsfplw',
    'cmr8db82r00tv1ylocu14mhyo',
    'cmr8dba7g00ug1ylo81vl4egz',
    'cmr8diftz00x01ylos7osnrdv',
    'cmr8dihid00xk1ylo0vgu8s1u',
    'cmr8diic900xu1yloxcfgo3m1',
    'cmr8dq9zk010b1ylo69vga815',
    'cmr8dyl0l013o1ylo3g57iw4e',
    'cmr8dym8101401yloc5e4un4j',
    'cmr8dyoob014o1ylohflpb8vk',
    'cmr8e5xbj01781yloak296ujx',
    'cmr8esoo601e51yloz5ll2mcl',
    'cmr8espbg01ed1ylolv09n259',
    'cmr8f2nmw01hr1ylo5vuop7s5',
    'cmr8fhi9x01kw1ylogpdfue3z',
    'cmr8fz73n01n21ylofwctd9hd',
    'cmr8fz7ua01nb1ylord321l5v',
    'cmr8fz9gw01nv1yloeultf1jv',
    'cmr8fza7d01o41ylowhr2ut3t',
    'cmr8fzb0u01oe1ylo02jbxnhn',
    'cmr8fzb3r01of1ylosmu4psan',
    'cmr8g7a6z01qi1ylobk04aq0b',
    'cmr8g7caz01r81ylo178f96rw',
    'cmr8h1e8v01wy1ylo0wm3fd20',
    'cmr8h1f1201x61ylo083ur6ss',
    'cmr8h1g8901xi1ylopzcr52nn',
    'cmr8h1i4b01y01ylo9s8j6nfg',
    'cmr8hgdmg01zs1ylo0iswrovx',
    'cmr8hrsf0023q1yloobt632k1',
    'cmr8hrt1c023y1yloec845t9i',
    'cmr8i0a0u026q1ylo44ou4lsm',
    'cmr8ie5ct029t1ylogotp14ga',
    'cmr8ieadl02b81yloz0gy39ne',
    'cmr8j0m2h02gb1yloi7etqgqm',
    'cmr8j0nl602gt1ylo05ubs7ca',
    'cmr8j9px402k01yloljca94fq',
    'cmr8j9qz402ka1ylo8c0eq0ab',
    'cmr8j9tj202kz1yloch155f73',
    'cmr8ji6nx02n21ylo726awzy0',
    'cmr8ji77s02n91ylomtvuehj7',
    'cmr8ji84a02nk1ylo1fv315q2',
    'cmr8ji8xh02nu1ylov6dodlru',
    'cmr8ji9gb02o01ylojpj794sl',
    'cmr8juhsh00071ygiygvtgv88',
    'cmr8juiiz000g1ygil7txezlw',
    'cmr8juiow000i1ygibb8mrakh',
    'cmr8jul0j001a1ygiq53g2m9f',
    'cmr8jul3n001b1ygi5yoexrjy',
    'cmr8julr5001j1ygiyz73ekzp',
    'cmr8lc48g009e1ygig2noa3nt',
    'cmr8lc4h8009h1ygiq3rpqnci',
    'cmr8lc8g100au1ygi6rgyt0py',
    'cmr8lqgda00cy1ygi8zgnxnml',
    'cmr8lqi5t00df1ygicyrpzymt',
    'cmr8lqkir00e51ygiu4pq2rqw',
    'cmr8lz0tr00h11ygigykz4yxx',
    'cmr8lz0x300h21ygilvat7kt0',
    'cmr8lz1lz00h91ygir7lervzt',
    'cmr8lz23w00he1ygilqo4tifh',
    'cmr8lz2e900hh1ygi3a60epue',
    'cmr8m99zz00jk1ygipllpoe8v',
    'cmr8m9a8c00jn1ygizrq0nl45',
    'cmr8mluhf00n81ygicydxr3ky',
    'cmr8mlumx00na1ygikrz3l0e4',
    'cmr8mlv7i00nh1ygiegjtuhbe',
    'cmr8mlvv900np1ygi8rrb8yxp',
    'cmr8mlwi400nx1ygi28suv3fy',
    'cmr8mlwtb00o11ygi3aidldkh',
    'cmr8nclkn00su1ygi6ogjaqib',
    'cmr8ncmkc00t41ygi94qk85ys',
    'cmr8ncmr900t61ygin88hs08t',
    'cmr8ncpnj00u01ygikb2ryi7p',
    'cmr8ncpqz00u11ygimha4kqp0',
    'cmr8nmh0y00w71ygiukydue8w',
    'cmr8nmhk600we1ygi2uklskxu',
    'cmr8nmi2f00wk1ygiyvtsj0c0',
    'cmr8nmkks00xh1ygixornp7il',
    'cmr8nmlb900xr1ygiyx69pfeh',
    'cmr8ny4kc00zw1ygiz4hieyjn',
    'cmr8o9i5s013f1ygip4m7rgob',
    'cmr8oma0t01741ygi2l3zr06d',
    'cmr8omacf01781ygiai9uu1ih',
    'cmr8omb1v017h1ygigtlmi9fr',
    'cmr8p26r3019r1ygiohamrelo',
    'cmr8pvcjq01fk1ygiiyy152nm',
    'cmr8q42ce01jh1ygi97em94dd',
    'cmr8qfo7d01mk1ygigusidthf',
    'cmr8qfog101mn1ygiudi63erk',
    'cmr8qfpzm01n61ygihvfpi56f',
    'cmr8qfqjk01nd1ygi7vow0tw7',
    'cmr8qux0601pe1ygiahlu2xcf',
    'cmr8qux6601pg1ygivpm5uem3',
    'cmr8quy1201pq1ygijz7v2tek',
    'cmr8quy9y01pt1ygidkwzi4vd',
    'cmr8quyuj01q01ygist8un6t0',
    'cmr97c3ea000a1ywyyi3u1j89',
    'cmr97c6al00131ywy495jmdua',
    'cmr97c6lb00161ywyjst17fs1',
    'cmr97c7do001e1ywy81cadkeb',
    'cmr97hz6x003m1ywycvpzd38n',
    'cmr97i2uv004n1ywyiuaf92nc',
    'cmr97qde5006r1ywyc52rd5ef',
    'cmr97qe9d00701ywy4ols9nsx',
    'cmr97qik000881ywy09ghvzcc',
    'cmr97yxnf00a11ywyf8wy1588',
    'cmr97yz0g00af1ywyzwfhbhgs',
    'cmr97z04200aq1ywy1du1rk35',
    'cmr97z09300ar1ywy5uawf8vh',
    'cmr97z11900az1ywyov4k1tlp',
    'cmr97z23i00ba1ywy4nezwyl2',
    'cmr97z26y00bb1ywynkzvljfw',
    'cmr98dkvm00ha1ywy8bdildeg',
    'cmr98mo3q00l71ywyk5f364sv',
    'cmr98vmm700nd1ywyc3aojxzs',
    'cmr98vosj00o31ywyqobu75ug',
    'cmr98vqjw00oo1ywyir4ftxrd',
    'cmr99ih9z00tz1ywy9qm4znfk',
    'cmr99iho300u31ywy89clvs9s',
    'cmr99ikrh00uz1ywyo06t8wff',
    'cmr99ikut00v01ywyfrzvijxc',
    'cmr99ikyb00v11ywyo8vvy8x3',
    'cmr99rfjy00xi1ywy997v7vff',
    'cmr99rglb00xv1ywyzpxbph7s',
    'cmr99rgnz00xw1ywyho9atfwq',
    'cmr99rhdo00y51ywyq290ze9w',
    'cmr99rhsd00ya1ywy3wyu5jke',
    'cmr99ri3w00ye1ywyk9zt6trm',
    'cmr9a1151010p1ywyij16o9ql',
    'cmr9a11u0010w1ywygodsbzgi',
    'cmr9a12bv01111ywymlbnlxun',
    'cmr9a12ix01131ywyiklp2bg2',
    'cmr9a130s01181ywywk8z0vrg',
    'cmr9a147t011k1ywyfrrxdo1b',
    'cmr9a14te011q1ywyzotv8mu6',
    'cmr9aepxb01501ywyuqqdt6a6',
    'cmr9b2c9h01a11ywyzco1pyly',
    'cmr9b2dkx01ah1ywyilkxiba4',
    'cmr9b2enc01au1ywyqmxwu15x',
    'cmr9b2fy501ba1ywye9lqykjq',
    'cmr9bbvdp01em1ywygm2ip39d',
    'cmr9bbvl801eo1ywy897ipx4z',
    'cmr9bv1bu01l31ywytbakl9be',
    'cmr9bv20001lb1ywy1jmhgo1g',
    'cmr9c39df01op1ywycap61l8e',
    'cmr9c9pr901rh1ywyvbqntcd6',
    'cmr9c9qub01rr1ywykr3mk76u',
    'cmru2q7uk000c1y7wdveafujn',
    'cmru2qaba00151y7wfwkl4bzs',
    'cmru2qbex001i1y7wltrmpyl4',
    'cmru32lpi003z1y7wibr7nsly',
    'cmru32mr8004c1y7wy1w99ih7',
    'cmru32o12004s1y7wfcy8yrlx',
    'cmru32ofc004x1y7wns4re605',
    'cmru3905m00711y7w2r0k4qea',
    'cmru3gc8a00al1y7wlpv0bg1q',
    'cmru3n4ld00do1y7wlnvbstq2',
    'cmru3n5bm00dw1y7wgitithvu',
    'cmru3n5kg00dz1y7wci3uqpaz',
    'cmru3uc9v00gy1y7wu80eovb2',
    'cmru3ud1200h61y7wxltdaw8n',
    'cmru3udsa00he1y7wpj45agp1',
    'cmru3uejf00hm1y7weivugh7i',
    'cmru3ufav00hu1y7wr725klhc',
    'cmru7tjc000051yd6rh79q66k',
    'cmru7tlf2000v1yd6u28kmoh3',
    'cmru7tn8e001i1yd68zydj1k9',
    'cmru7tnmz001n1yd6s2l4e18z',
    'cmru8558p003o1yd6s6aifwvd',
    'cmru856wx00491yd6n6ml3atj',
    'cmru857sa004k1yd6u9c38vam',
    'cmru8bcsa006k1yd628y1sx37',
    'cmru8bf15007c1yd6q8size7c',
    'cmru8hwhx00a61yd69yaqyfzy',
    'cmru8hyi000aq1yd6pdtsups2',
    'cmru96l6l003c1y0sa2arb3o5',
    'cmru96lss003h1y0sf0ssl6vk',
    'cmru96ndq003u1y0siletewhf',
    'cmru96o8f00411y0sb2j8320w',
    'cmru96p7i00491y0scocl1kdh',
    'cmru96pg6004b1y0sw4gplnzu',
    'cmru96px7004f1y0se4i81bkq',
    'cmru96qvx004n1y0shied4jhr',
    'cmru96r8x004q1y0sx6ptfv5t',
    'cmru9ir9i00a11y0srz2a8wyh',
    'cmru9it6i00ah1y0sr2acm08q',
    'cmruihpbs002x1yceixr1di0c',
    'cmruyigtw002k1y2y6gvc7mw1',
    'cmruyihdh002r1y2yo4z2rpqf',
    'cmruyk809003t1y2ys9kt9ixa',
    'cmruylxnb004i1y2y7bnh8ewt',
    'cmrvwuwxp004f1ye8nwnno1y0',
    'cmrvwxxb4005z1ye86cqnqbv2',
    'cmrwa2vru002a1ynhawg5qf5e',
    'cmtpxgteg007p1ymuyhp1d6c8'
)
AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3b_20261114_backup;
  IF n <> 248 THEN
    RAISE EXCEPTION 'backup row count %, expected 248', n;
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $s3b_0$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_0$::jsonb
WHERE id = 'cmqxe01zy00ea1ymava7y2dk9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_1$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_1$::jsonb
WHERE id = 'cmqxf0p0q001o1yf1aj6hns0q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_2$[{"label": "NICE NG185. Offer people with acute STEMI a single loading dose of 300 mg aspirin as soon as possible unless they are allergic to it.", "url": "https://www.nice.org.uk/guidance/ng185/chapter/Recommendations"}]$s3b_2$::jsonb
WHERE id = 'cmr31dki100b9js04p7os14o7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_3$[{"label": "NICE NG185. Offer people with acute STEMI a single loading dose of 300 mg aspirin as soon as possible unless they are allergic to it.", "url": "https://www.nice.org.uk/guidance/ng185/chapter/Recommendations"}]$s3b_3$::jsonb
WHERE id = 'cmr31dkjp00bbjs049lt2fmtd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_4$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_4$::jsonb
WHERE id = 'cmr4bagvn004o1ykyepyxsgbq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_5$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_5$::jsonb
WHERE id = 'cmr4bahqr004x1ykyschj9fa1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_6$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_6$::jsonb
WHERE id = 'cmr4bahxl004z1yky28nvfuzd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_7$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_7$::jsonb
WHERE id = 'cmr4bnykh00bc1ykynwibtaih' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_8$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_8$::jsonb
WHERE id = 'cmr4bvdkm00dy1ykypx6rz093' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_9$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_9$::jsonb
WHERE id = 'cmr4c4scb00h91ykyvrh4obef' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_10$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_10$::jsonb
WHERE id = 'cmr4c4ufj00ht1ykywstku186' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_11$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_11$::jsonb
WHERE id = 'cmr4c4w9o00ib1ykybhgolgha' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_12$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_12$::jsonb
WHERE id = 'cmr4c4wi500id1ykytlq335io' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_13$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_13$::jsonb
WHERE id = 'cmr4cbvrd00kn1ykyhd2sl9rs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_14$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_14$::jsonb
WHERE id = 'cmr4cvbb300qy1yky4l91kwry' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_15$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_15$::jsonb
WHERE id = 'cmr4cvf5m00s81ykytmjiadr9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_16$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_16$::jsonb
WHERE id = 'cmr4d3ti300ug1yky3vizxp8g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_17$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_17$::jsonb
WHERE id = 'cmr4d3tx000ul1ykygjhp4mzd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_18$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_18$::jsonb
WHERE id = 'cmr4d3u6k00uo1ykyd1jdhopp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_19$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_19$::jsonb
WHERE id = 'cmr4dbb1y00xm1ykyuivmyjht' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_20$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_20$::jsonb
WHERE id = 'cmr4dbby600xu1ykypkxzpg5w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_21$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_21$::jsonb
WHERE id = 'cmr4dzaf201901yky840p2hi7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_22$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_22$::jsonb
WHERE id = 'cmr4enkl601ir1ykyo4qy9p16' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_23$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_23$::jsonb
WHERE id = 'cmr4extpo01lp1ykyce6j1wqb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_24$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_24$::jsonb
WHERE id = 'cmr4exv4101m61ykymi38udrq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_25$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_25$::jsonb
WHERE id = 'cmr4fdlny01sk1ykyh82bc80b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_26$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_26$::jsonb
WHERE id = 'cmr4ftfbw01z31ykyahy2czpt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_27$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_27$::jsonb
WHERE id = 'cmr4ftg1h01zc1ykyuaa45ck0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_28$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_28$::jsonb
WHERE id = 'cmr8attx500091ylo6hoxjvgh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_29$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_29$::jsonb
WHERE id = 'cmr8atu0v000a1ylo1lpjw8bk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_30$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_30$::jsonb
WHERE id = 'cmr8atvux000s1yloy8t7la9y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_31$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_31$::jsonb
WHERE id = 'cmr8aty4c001e1ylo88qkocsz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_32$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_32$::jsonb
WHERE id = 'cmr8aty80001f1yloss6imt5g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_33$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_33$::jsonb
WHERE id = 'cmr8bhfio006j1yloin556eq7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_34$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_34$::jsonb
WHERE id = 'cmr8bhft5006m1ylolf93jz8i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_35$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_35$::jsonb
WHERE id = 'cmr8bhibu007c1ylomrfx3fa8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_36$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_36$::jsonb
WHERE id = 'cmr8bhj45007k1yloahg0ti38' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_37$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_37$::jsonb
WHERE id = 'cmr8bhkld007z1ylofx5lsp51' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_38$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_38$::jsonb
WHERE id = 'cmr8br3qx009s1ylonnwk69df' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_39$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_39$::jsonb
WHERE id = 'cmr8br47k009x1ylovnoltnjz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_40$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_40$::jsonb
WHERE id = 'cmr8br50q00a71ylog5v086qg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_41$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_41$::jsonb
WHERE id = 'cmr8br6f900ao1yloqwfux2gx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_42$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_42$::jsonb
WHERE id = 'cmr8br6kz00aq1ylocvfemwqd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_43$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_43$::jsonb
WHERE id = 'cmr8br72500aw1yloom1b3glc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_44$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_44$::jsonb
WHERE id = 'cmr8br7dt00b01yloxrd29qqn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_45$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_45$::jsonb
WHERE id = 'cmr8ccdu400ju1ylolfi8g26k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_46$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_46$::jsonb
WHERE id = 'cmr8ccenp00k41yloewfnfu2d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_47$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_47$::jsonb
WHERE id = 'cmr8ccj0a00l01yloj1h4hv1a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_48$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_48$::jsonb
WHERE id = 'cmr8cn7yv00n31ylooktivms2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_49$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_49$::jsonb
WHERE id = 'cmr8cn9sd00nn1ylokatc5kvv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_50$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_50$::jsonb
WHERE id = 'cmr8cnaaj00nt1yloh7kzc7un' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_51$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_51$::jsonb
WHERE id = 'cmr8cnchh00oj1ylot7753ctx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_52$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_52$::jsonb
WHERE id = 'cmr8d1yzs00rh1ylozuwjrjay' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_53$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_53$::jsonb
WHERE id = 'cmr8db6f700tf1ylodhz2o16a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_54$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_54$::jsonb
WHERE id = 'cmr8db7z500tu1yloaicsfplw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_55$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_55$::jsonb
WHERE id = 'cmr8db82r00tv1ylocu14mhyo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_56$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_56$::jsonb
WHERE id = 'cmr8dba7g00ug1ylo81vl4egz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_57$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_57$::jsonb
WHERE id = 'cmr8diftz00x01ylos7osnrdv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_58$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_58$::jsonb
WHERE id = 'cmr8dihid00xk1ylo0vgu8s1u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_59$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_59$::jsonb
WHERE id = 'cmr8diic900xu1yloxcfgo3m1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_60$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_60$::jsonb
WHERE id = 'cmr8dq9zk010b1ylo69vga815' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_61$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_61$::jsonb
WHERE id = 'cmr8dyl0l013o1ylo3g57iw4e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_62$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_62$::jsonb
WHERE id = 'cmr8dym8101401yloc5e4un4j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_63$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_63$::jsonb
WHERE id = 'cmr8dyoob014o1ylohflpb8vk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_64$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_64$::jsonb
WHERE id = 'cmr8e5xbj01781yloak296ujx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_65$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_65$::jsonb
WHERE id = 'cmr8esoo601e51yloz5ll2mcl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_66$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_66$::jsonb
WHERE id = 'cmr8espbg01ed1ylolv09n259' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_67$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_67$::jsonb
WHERE id = 'cmr8f2nmw01hr1ylo5vuop7s5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_68$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_68$::jsonb
WHERE id = 'cmr8fhi9x01kw1ylogpdfue3z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_69$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_69$::jsonb
WHERE id = 'cmr8fz73n01n21ylofwctd9hd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_70$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_70$::jsonb
WHERE id = 'cmr8fz7ua01nb1ylord321l5v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_71$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_71$::jsonb
WHERE id = 'cmr8fz9gw01nv1yloeultf1jv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_72$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_72$::jsonb
WHERE id = 'cmr8fza7d01o41ylowhr2ut3t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_73$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_73$::jsonb
WHERE id = 'cmr8fzb0u01oe1ylo02jbxnhn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_74$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_74$::jsonb
WHERE id = 'cmr8fzb3r01of1ylosmu4psan' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_75$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_75$::jsonb
WHERE id = 'cmr8g7a6z01qi1ylobk04aq0b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_76$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_76$::jsonb
WHERE id = 'cmr8g7caz01r81ylo178f96rw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_77$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_77$::jsonb
WHERE id = 'cmr8h1e8v01wy1ylo0wm3fd20' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_78$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_78$::jsonb
WHERE id = 'cmr8h1f1201x61ylo083ur6ss' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_79$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_79$::jsonb
WHERE id = 'cmr8h1g8901xi1ylopzcr52nn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_80$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_80$::jsonb
WHERE id = 'cmr8h1i4b01y01ylo9s8j6nfg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_81$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_81$::jsonb
WHERE id = 'cmr8hgdmg01zs1ylo0iswrovx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_82$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_82$::jsonb
WHERE id = 'cmr8hrsf0023q1yloobt632k1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_83$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_83$::jsonb
WHERE id = 'cmr8hrt1c023y1yloec845t9i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_84$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_84$::jsonb
WHERE id = 'cmr8i0a0u026q1ylo44ou4lsm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_85$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_85$::jsonb
WHERE id = 'cmr8ie5ct029t1ylogotp14ga' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_86$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_86$::jsonb
WHERE id = 'cmr8ieadl02b81yloz0gy39ne' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_87$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_87$::jsonb
WHERE id = 'cmr8j0m2h02gb1yloi7etqgqm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_88$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_88$::jsonb
WHERE id = 'cmr8j0nl602gt1ylo05ubs7ca' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_89$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_89$::jsonb
WHERE id = 'cmr8j9px402k01yloljca94fq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_90$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_90$::jsonb
WHERE id = 'cmr8j9qz402ka1ylo8c0eq0ab' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_91$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_91$::jsonb
WHERE id = 'cmr8j9tj202kz1yloch155f73' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_92$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_92$::jsonb
WHERE id = 'cmr8ji6nx02n21ylo726awzy0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_93$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_93$::jsonb
WHERE id = 'cmr8ji77s02n91ylomtvuehj7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_94$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_94$::jsonb
WHERE id = 'cmr8ji84a02nk1ylo1fv315q2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_95$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_95$::jsonb
WHERE id = 'cmr8ji8xh02nu1ylov6dodlru' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_96$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_96$::jsonb
WHERE id = 'cmr8ji9gb02o01ylojpj794sl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_97$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_97$::jsonb
WHERE id = 'cmr8juhsh00071ygiygvtgv88' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_98$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_98$::jsonb
WHERE id = 'cmr8juiiz000g1ygil7txezlw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_99$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_99$::jsonb
WHERE id = 'cmr8juiow000i1ygibb8mrakh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_100$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_100$::jsonb
WHERE id = 'cmr8jul0j001a1ygiq53g2m9f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_101$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_101$::jsonb
WHERE id = 'cmr8jul3n001b1ygi5yoexrjy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_102$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_102$::jsonb
WHERE id = 'cmr8julr5001j1ygiyz73ekzp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_103$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_103$::jsonb
WHERE id = 'cmr8lc48g009e1ygig2noa3nt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_104$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_104$::jsonb
WHERE id = 'cmr8lc4h8009h1ygiq3rpqnci' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_105$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_105$::jsonb
WHERE id = 'cmr8lc8g100au1ygi6rgyt0py' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_106$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_106$::jsonb
WHERE id = 'cmr8lqgda00cy1ygi8zgnxnml' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_107$[{"label": "NICE NG145. When TSH is above the reference range, free T4 is measured in the same sample. Levothyroxine is first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_107$::jsonb
WHERE id = 'cmr8lqi5t00df1ygicyrpzymt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_108$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_108$::jsonb
WHERE id = 'cmr8lqkir00e51ygiu4pq2rqw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_109$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_109$::jsonb
WHERE id = 'cmr8lz0tr00h11ygigykz4yxx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_110$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_110$::jsonb
WHERE id = 'cmr8lz0x300h21ygilvat7kt0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_111$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_111$::jsonb
WHERE id = 'cmr8lz1lz00h91ygir7lervzt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_112$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_112$::jsonb
WHERE id = 'cmr8lz23w00he1ygilqo4tifh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_113$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_113$::jsonb
WHERE id = 'cmr8lz2e900hh1ygi3a60epue' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_114$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_114$::jsonb
WHERE id = 'cmr8m99zz00jk1ygipllpoe8v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_115$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_115$::jsonb
WHERE id = 'cmr8m9a8c00jn1ygizrq0nl45' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_116$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_116$::jsonb
WHERE id = 'cmr8mluhf00n81ygicydxr3ky' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_117$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_117$::jsonb
WHERE id = 'cmr8mlumx00na1ygikrz3l0e4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_118$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_118$::jsonb
WHERE id = 'cmr8mlv7i00nh1ygiegjtuhbe' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_119$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_119$::jsonb
WHERE id = 'cmr8mlvv900np1ygi8rrb8yxp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_120$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_120$::jsonb
WHERE id = 'cmr8mlwi400nx1ygi28suv3fy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_121$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_121$::jsonb
WHERE id = 'cmr8mlwtb00o11ygi3aidldkh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_122$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_122$::jsonb
WHERE id = 'cmr8nclkn00su1ygi6ogjaqib' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_123$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_123$::jsonb
WHERE id = 'cmr8ncmkc00t41ygi94qk85ys' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_124$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_124$::jsonb
WHERE id = 'cmr8ncmr900t61ygin88hs08t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_125$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_125$::jsonb
WHERE id = 'cmr8ncpnj00u01ygikb2ryi7p' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_126$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_126$::jsonb
WHERE id = 'cmr8ncpqz00u11ygimha4kqp0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_127$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_127$::jsonb
WHERE id = 'cmr8nmh0y00w71ygiukydue8w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_128$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_128$::jsonb
WHERE id = 'cmr8nmhk600we1ygi2uklskxu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_129$[{"label": "NICE NG145. When TSH is above the reference range, free T4 is measured in the same sample. Levothyroxine is first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_129$::jsonb
WHERE id = 'cmr8nmi2f00wk1ygiyvtsj0c0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_130$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_130$::jsonb
WHERE id = 'cmr8nmkks00xh1ygixornp7il' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_131$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_131$::jsonb
WHERE id = 'cmr8nmlb900xr1ygiyx69pfeh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_132$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_132$::jsonb
WHERE id = 'cmr8ny4kc00zw1ygiz4hieyjn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_133$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_133$::jsonb
WHERE id = 'cmr8o9i5s013f1ygip4m7rgob' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_134$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_134$::jsonb
WHERE id = 'cmr8oma0t01741ygi2l3zr06d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_135$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_135$::jsonb
WHERE id = 'cmr8omacf01781ygiai9uu1ih' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_136$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_136$::jsonb
WHERE id = 'cmr8omb1v017h1ygigtlmi9fr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_137$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_137$::jsonb
WHERE id = 'cmr8p26r3019r1ygiohamrelo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_138$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_138$::jsonb
WHERE id = 'cmr8pvcjq01fk1ygiiyy152nm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_139$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_139$::jsonb
WHERE id = 'cmr8q42ce01jh1ygi97em94dd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_140$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_140$::jsonb
WHERE id = 'cmr8qfo7d01mk1ygigusidthf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_141$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_141$::jsonb
WHERE id = 'cmr8qfog101mn1ygiudi63erk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_142$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_142$::jsonb
WHERE id = 'cmr8qfpzm01n61ygihvfpi56f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_143$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_143$::jsonb
WHERE id = 'cmr8qfqjk01nd1ygi7vow0tw7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_144$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_144$::jsonb
WHERE id = 'cmr8qux0601pe1ygiahlu2xcf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_145$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_145$::jsonb
WHERE id = 'cmr8qux6601pg1ygivpm5uem3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_146$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_146$::jsonb
WHERE id = 'cmr8quy1201pq1ygijz7v2tek' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_147$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_147$::jsonb
WHERE id = 'cmr8quy9y01pt1ygidkwzi4vd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_148$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_148$::jsonb
WHERE id = 'cmr8quyuj01q01ygist8un6t0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_149$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_149$::jsonb
WHERE id = 'cmr97c3ea000a1ywyyi3u1j89' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_150$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_150$::jsonb
WHERE id = 'cmr97c6al00131ywy495jmdua' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_151$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_151$::jsonb
WHERE id = 'cmr97c6lb00161ywyjst17fs1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_152$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_152$::jsonb
WHERE id = 'cmr97c7do001e1ywy81cadkeb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_153$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_153$::jsonb
WHERE id = 'cmr97hz6x003m1ywycvpzd38n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_154$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_154$::jsonb
WHERE id = 'cmr97i2uv004n1ywyiuaf92nc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_155$[{"label": "NICE NG145. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_155$::jsonb
WHERE id = 'cmr97qde5006r1ywyc52rd5ef' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_156$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_156$::jsonb
WHERE id = 'cmr97qe9d00701ywy4ols9nsx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_157$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_157$::jsonb
WHERE id = 'cmr97qik000881ywy09ghvzcc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_158$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_158$::jsonb
WHERE id = 'cmr97yxnf00a11ywyf8wy1588' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_159$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_159$::jsonb
WHERE id = 'cmr97yz0g00af1ywyzwfhbhgs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_160$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_160$::jsonb
WHERE id = 'cmr97z04200aq1ywy1du1rk35' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_161$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_161$::jsonb
WHERE id = 'cmr97z09300ar1ywy5uawf8vh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_162$[{"label": "NICE CG100. For acute alcohol withdrawal, consider offering a benzodiazepine.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3b_162$::jsonb
WHERE id = 'cmr97z11900az1ywyov4k1tlp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_163$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_163$::jsonb
WHERE id = 'cmr97z23i00ba1ywy4nezwyl2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_164$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_164$::jsonb
WHERE id = 'cmr97z26y00bb1ywynkzvljfw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_165$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_165$::jsonb
WHERE id = 'cmr98dkvm00ha1ywy8bdildeg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_166$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_166$::jsonb
WHERE id = 'cmr98mo3q00l71ywyk5f364sv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_167$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_167$::jsonb
WHERE id = 'cmr98vmm700nd1ywyc3aojxzs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_168$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_168$::jsonb
WHERE id = 'cmr98vosj00o31ywyqobu75ug' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_169$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_169$::jsonb
WHERE id = 'cmr98vqjw00oo1ywyir4ftxrd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_170$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_170$::jsonb
WHERE id = 'cmr99ih9z00tz1ywy9qm4znfk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_171$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_171$::jsonb
WHERE id = 'cmr99iho300u31ywy89clvs9s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_172$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_172$::jsonb
WHERE id = 'cmr99ikrh00uz1ywyo06t8wff' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_173$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_173$::jsonb
WHERE id = 'cmr99ikut00v01ywyfrzvijxc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_174$[{"label": "NICE NG145. When TSH is above the reference range, free T4 is measured in the same sample. Levothyroxine is first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_174$::jsonb
WHERE id = 'cmr99ikyb00v11ywyo8vvy8x3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_175$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_175$::jsonb
WHERE id = 'cmr99rfjy00xi1ywy997v7vff' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_176$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_176$::jsonb
WHERE id = 'cmr99rglb00xv1ywyzpxbph7s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_177$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_177$::jsonb
WHERE id = 'cmr99rgnz00xw1ywyho9atfwq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_178$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_178$::jsonb
WHERE id = 'cmr99rhdo00y51ywyq290ze9w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_179$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_179$::jsonb
WHERE id = 'cmr99rhsd00ya1ywy3wyu5jke' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_180$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_180$::jsonb
WHERE id = 'cmr99ri3w00ye1ywyk9zt6trm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_181$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_181$::jsonb
WHERE id = 'cmr9a1151010p1ywyij16o9ql' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_182$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_182$::jsonb
WHERE id = 'cmr9a11u0010w1ywygodsbzgi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_183$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_183$::jsonb
WHERE id = 'cmr9a12bv01111ywymlbnlxun' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_184$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_184$::jsonb
WHERE id = 'cmr9a12ix01131ywyiklp2bg2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_185$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_185$::jsonb
WHERE id = 'cmr9a130s01181ywywk8z0vrg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_186$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_186$::jsonb
WHERE id = 'cmr9a147t011k1ywyfrrxdo1b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_187$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_187$::jsonb
WHERE id = 'cmr9a14te011q1ywyzotv8mu6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_188$[{"label": "NICE CG100. For acute alcohol withdrawal, consider offering a benzodiazepine.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3b_188$::jsonb
WHERE id = 'cmr9aepxb01501ywyuqqdt6a6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_189$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_189$::jsonb
WHERE id = 'cmr9b2c9h01a11ywyzco1pyly' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_190$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_190$::jsonb
WHERE id = 'cmr9b2dkx01ah1ywyilkxiba4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_191$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_191$::jsonb
WHERE id = 'cmr9b2enc01au1ywyqmxwu15x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_192$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_192$::jsonb
WHERE id = 'cmr9b2fy501ba1ywye9lqykjq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_193$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_193$::jsonb
WHERE id = 'cmr9bbvdp01em1ywygm2ip39d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_194$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_194$::jsonb
WHERE id = 'cmr9bbvl801eo1ywy897ipx4z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_195$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_195$::jsonb
WHERE id = 'cmr9bv1bu01l31ywytbakl9be' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_196$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_196$::jsonb
WHERE id = 'cmr9bv20001lb1ywy1jmhgo1g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_197$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_197$::jsonb
WHERE id = 'cmr9c39df01op1ywycap61l8e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_198$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_198$::jsonb
WHERE id = 'cmr9c9pr901rh1ywyvbqntcd6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_199$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_199$::jsonb
WHERE id = 'cmr9c9qub01rr1ywykr3mk76u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_200$[{"label": "NICE NG145. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_200$::jsonb
WHERE id = 'cmru2q7uk000c1y7wdveafujn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_201$[{"label": "NICE NG145. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_201$::jsonb
WHERE id = 'cmru2qaba00151y7wfwkl4bzs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_202$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_202$::jsonb
WHERE id = 'cmru2qbex001i1y7wltrmpyl4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_203$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_203$::jsonb
WHERE id = 'cmru32lpi003z1y7wibr7nsly' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_204$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_204$::jsonb
WHERE id = 'cmru32mr8004c1y7wy1w99ih7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_205$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_205$::jsonb
WHERE id = 'cmru32o12004s1y7wfcy8yrlx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_206$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_206$::jsonb
WHERE id = 'cmru32ofc004x1y7wns4re605' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_207$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_207$::jsonb
WHERE id = 'cmru3905m00711y7w2r0k4qea' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_208$[{"label": "NICE NG145. When TSH is above the reference range, free T4 is measured in the same sample. Levothyroxine is first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_208$::jsonb
WHERE id = 'cmru3gc8a00al1y7wlpv0bg1q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_209$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_209$::jsonb
WHERE id = 'cmru3n4ld00do1y7wlnvbstq2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_210$[{"label": "NICE NG145. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_210$::jsonb
WHERE id = 'cmru3n5bm00dw1y7wgitithvu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_211$[{"label": "NICE NG104. Acute pancreatitis is confirmed by blood lipase or amylase, which are usually raised, together with the clinical picture.", "url": "https://www.nice.org.uk/guidance/ng104/chapter/Recommendations"}]$s3b_211$::jsonb
WHERE id = 'cmru3n5kg00dz1y7wci3uqpaz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_212$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_212$::jsonb
WHERE id = 'cmru3uc9v00gy1y7wu80eovb2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_213$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_213$::jsonb
WHERE id = 'cmru3ud1200h61y7wxltdaw8n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_214$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_214$::jsonb
WHERE id = 'cmru3udsa00he1y7wpj45agp1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_215$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_215$::jsonb
WHERE id = 'cmru3uejf00hm1y7weivugh7i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_216$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_216$::jsonb
WHERE id = 'cmru3ufav00hu1y7wr725klhc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_217$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_217$::jsonb
WHERE id = 'cmru7tjc000051yd6rh79q66k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_218$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_218$::jsonb
WHERE id = 'cmru7tlf2000v1yd6u28kmoh3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_219$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_219$::jsonb
WHERE id = 'cmru7tn8e001i1yd68zydj1k9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_220$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_220$::jsonb
WHERE id = 'cmru7tnmz001n1yd6s2l4e18z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_221$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_221$::jsonb
WHERE id = 'cmru8558p003o1yd6s6aifwvd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_222$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_222$::jsonb
WHERE id = 'cmru856wx00491yd6n6ml3atj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_223$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_223$::jsonb
WHERE id = 'cmru857sa004k1yd6u9c38vam' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_224$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_224$::jsonb
WHERE id = 'cmru8bcsa006k1yd628y1sx37' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_225$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_225$::jsonb
WHERE id = 'cmru8bf15007c1yd6q8size7c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_226$[{"label": "NICE NG145. When TSH is above the reference range, free T4 is measured in the same sample. Levothyroxine is first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3b_226$::jsonb
WHERE id = 'cmru8hwhx00a61yd69yaqyfzy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_227$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_227$::jsonb
WHERE id = 'cmru8hyi000aq1yd6pdtsups2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_228$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_228$::jsonb
WHERE id = 'cmru96l6l003c1y0sa2arb3o5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_229$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_229$::jsonb
WHERE id = 'cmru96lss003h1y0sf0ssl6vk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_230$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_230$::jsonb
WHERE id = 'cmru96ndq003u1y0siletewhf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_231$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_231$::jsonb
WHERE id = 'cmru96o8f00411y0sb2j8320w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_232$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_232$::jsonb
WHERE id = 'cmru96p7i00491y0scocl1kdh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_233$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_233$::jsonb
WHERE id = 'cmru96pg6004b1y0sw4gplnzu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_234$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_234$::jsonb
WHERE id = 'cmru96px7004f1y0se4i81bkq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_235$[{"label": "NICE NG194. After birth, abdominal or pelvic pain, fever, or vaginal discharge with an unpleasant smell can indicate infection, including endometritis.", "url": "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations"}]$s3b_235$::jsonb
WHERE id = 'cmru96qvx004n1y0shied4jhr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_236$[{"label": "NICE NG235. The established first stage of labour is regular contractions with progressive cervical dilatation from 4 cm.", "url": "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations"}]$s3b_236$::jsonb
WHERE id = 'cmru96r8x004q1y0sx6ptfv5t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_237$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_237$::jsonb
WHERE id = 'cmru9ir9i00a11y0srz2a8wyh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_238$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_238$::jsonb
WHERE id = 'cmru9it6i00ah1y0sr2acm08q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_239$[{"label": "NICE NG250. Put in place processes to allow diagnosis, including chest X-ray, of community-acquired pneumonia in adults within 4 hours of presentation to hospital.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3b_239$::jsonb
WHERE id = 'cmruihpbs002x1yceixr1di0c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_240$[{"label": "NICE NG240. For suspected bacterial meningitis, perform blood tests and lumbar puncture before antibiotics when it is safe and will not significantly delay antibiotics.", "url": "https://www.nice.org.uk/guidance/ng240/chapter/Recommendations"}]$s3b_240$::jsonb
WHERE id = 'cmruyigtw002k1y2y6gvc7mw1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_241$[{"label": "NICE NG250. Put in place processes to allow diagnosis, including chest X-ray, of community-acquired pneumonia in adults within 4 hours of presentation to hospital.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3b_241$::jsonb
WHERE id = 'cmruyihdh002r1y2yo4z2rpqf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_242$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_242$::jsonb
WHERE id = 'cmruyk809003t1y2ys9kt9ixa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_243$[{"label": "NICE CG174. A systolic blood pressure below 100 mmHg is an indicator that an adult in hospital may need urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_243$::jsonb
WHERE id = 'cmruylxnb004i1y2y7bnh8ewt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_244$[{"label": "NICE NG136. If hypertension is not controlled on an ACE inhibitor or ARB, offer a calcium-channel blocker or a thiazide-like diuretic in addition.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3b_244$::jsonb
WHERE id = 'cmrvwuwxp004f1ye8nwnno1y0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_245$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_245$::jsonb
WHERE id = 'cmrvwxxb4005z1ye86cqnqbv2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_246$[{"label": "NICE CG174. Adults in hospital with signs of hypovolaemia need assessment for urgent intravenous fluid resuscitation.", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$s3b_246$::jsonb
WHERE id = 'cmrwa2vru002a1ynhawg5qf5e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3b_247$[{"label": "NICE NG128. Thrombolysis (alteplase or tenecteplase) is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3b_247$::jsonb
WHERE id = 'cmtpxgteg007p1ymuyhp1d6c8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3b_20261114_backup b ON b.id = q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 248 THEN
    RAISE EXCEPTION 'rows with a citation URL %, expected 248', n;
  END IF;
END
$cited$;
COMMIT;
