-- Stage the USMLE 80-per-step audit from 2026-11-21.
-- Creates a backup of the current rows and a staging table of proposed values.
-- Does not update "QuestionBankItem".
-- 175 served items with at least one defect.
-- Command (do not run against production until the dry run is accepted):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/stage-usmle-audit80b-20261121.sql
BEGIN;
-- Safe to re-run only before apply. Re-running after apply would replace the
-- undo snapshot with the already-updated rows.
DROP TABLE IF EXISTS qbi_usmle_audit80b_20261121_stage;
DROP TABLE IF EXISTS qbi_usmle_audit80b_20261121_backup;
CREATE TABLE qbi_usmle_audit80b_20261121_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'b1xa4c02a033c5002746c81f1e6',
    'b3x71e8916391659ab46c2009fb',
    'b5x5fb8c4c870b93fe30e06afd0',
    'b8xb5edbe3652c596a1e4122ecc',
    'cmqgt4w7s001k1y0q15m8wcey',
    'cmr4qv9rm00zt1y1ezskmcg0i',
    'cmr8aytwc00xb1yw2dcc1kbzq',
    'cmr8d6fbh000i1yaztwvty1wy',
    'cmrpwcip5004h1yrtbas6b6yc',
    'cmrrum8xu00i31y8wsnkpfs8g',
    'cmrth11oy002x1yaxefl6sl6n',
    '301f07cd-1df1-473c-b732-cbff63c47cb6',
    'cmr4fthdz01zt1ykyopk9mf5l',
    'cmr8e5wgk016x1yloyc0gfuna',
    'cmr8hrrl1023g1ylodd9v80i5',
    'cmr8nmka500xd1ygi1z93ogd8',
    'cmr97hzdz003o1ywy8qq1qi38',
    'cmru32lpi003z1y7wibr7nsly',
    'cmru8bdlj006u1yd6qfboiua1',
    'cmrvwn0eg000g1ye864mcpcca',
    'cmrvwtumd003r1ye85azdg38n',
    'd77639ba-9867-476e-9203-348e45bfc80e',
    '069e38d9-f232-4a5a-8ade-7e178a22ab40',
    'b2x378f7323ee32a69e3ae61b26',
    'b8xf777beab51f3bf71159b91c1',
    'cmpnjjcsd09cv1ymxcxoj7f5g',
    'cmr4hzy9700b51yde0r0eye2u',
    'cmr88icd900q31yr98cakrhdh',
    'cmrtgb20a002c1ydwlc0jle9d',
    'cmrvm5unh0008jw04wm49tiyd',
    'cmtpw0nh2002h1ylc4hhyr5ed',
    '2b0a8cbd-8df4-4962-bdf5-d2f2f999f281',
    'b1xcebac02cb8e3262617bba821',
    'b4x71da6a48b3a69db5e20134bb',
    'b5x676b5d9ff393fecd1322779d',
    'b8xcdb6e3ca03df86a8a3f680c6',
    'cmqxc0sq6000b1ymaidqgf5ei',
    'cmr8bg0vr00zs1yw2vcqpb8s4',
    'cmr8dn4q600421yaz7do9zw1z',
    'cmrpvuwkz000b1yh5bg9zfm2j',
    'cmrr4t0ta00071y6p5jygmzxt',
    'cmrruxvq000mj1y8whj3qzskq',
    'cmr4gc43j026b1ykyv5fk17fo',
    'cmr8cn9sd00nn1ylokatc5kvv',
    'cmr8ehz8w01a91ylo0ftj0gae',
    'cmr8isfb702ed1ylo7pl7fdsl',
    'cmr8lc4st009l1ygiq5vr5fb0',
    'cmr97i3r1004w1ywyxuwcigyv',
    'cmru3gc8a00al1y7wlpv0bg1q',
    'cmru8v4ax000t1y0sh8a9c8kp',
    'cmrvwolmp00171ye85e3z94dz',
    'cmrwa0apt000n1ynhey6hoxxc',
    '6be163e9-ffc5-4080-a943-2d5ac73a7514',
    'b14-s2-82',
    'b17-s2-10',
    'cmqiy33sw000p1yug4nv1ug9p',
    'cmr4kilgu00sp1ydekkgxudlk',
    'cmr88ie7k00ql1yr9hbxm46pt',
    'cmrtgb28k002f1ydwpge8g4v3',
    'cmrvm5urr000ejw040q016s43',
    'cmtpwzxx6006q1y6h6at28nni',
    '47dc94ef-d48e-4cc8-9821-80c846053759',
    'b1xdd6a387cf0f586fea441e50e',
    'b4x84cf525e5e84bff2d0ca2bcf',
    'b6x65819e3d631a7dc6f9c5a5dd',
    'b9a3e2c1-a1b4-44ba-a5f2-9ddc446be987',
    'cmqxc0v4f00141ymaa139pr5b',
    'cmr88g5ui00dj1yw2xxe0davn',
    'cmrpvux2z000h1yh521ueufa4',
    'cmrr4yaj8002e1y6pl228e6zf',
    'cmrsew9ko00081y55wz7unbd9',
    'cmr4bvd0q00dr1ykyzupw8ukc',
    'cmr8atu4h000b1ylobllir8pl',
    'cmr8d1xbv00r11ylokdmlr0dc',
    'cmr8fz8hj01nj1ylomnu1nqic',
    'cmr8j0q1k02hn1ylosgrd8dem',
    'cmr8lqk4900e01ygia8llui6h',
    'cmr8pgw9p01dh1ygity7tdlws',
    'cmr97i3ul004x1ywys4doi1yd',
    'cmru7tlkp000x1yd6rrfzqpxn',
    'cmru9cuvv006l1y0sja2mlptc',
    'cmrvwqxjb00221ye8okdkqxww',
    'cmrwa1zah001r1ynhrbempihv',
    'b17-s2-90',
    'b3xfc560b7297d57d3d868ce07a',
    'b9x8b1bbe8c9326d32aff9f738c',
    'cmqxd0pcj006e1yma0n4zjzj5',
    'cmqxee8lv003u1y79z180nru9',
    'cmr88s2v000tz1yr9644hpxxn',
    'cmrtgb2y4002o1ydwzjf88gpe',
    'cmrvm5z58001ljw04yfpwleqr',
    'cmwfsamvi0009jsep58ty12by',
    'b2x47235e2861835c6173c88c3a',
    'b4xdd869f2dd6afbc61b7a7af58',
    'b7x666facc3fe91e41048c0468d',
    'cmqxcjtiv003i1ymabfkjs629',
    'cmr88v3v600ge1yw2h50v2k0k',
    'cmr8by2lb012j1yw2cmas9iop',
    'cmr8ei1tv009s1yazzsq0xtlv',
    'cmrpw18ff002r1yh58ego4k83',
    'cmrrtqznf007d1y8wu5q7lcf2',
    'cmr4dbe5m00ye1yky3podjd1n',
    'cmr8atyu2001l1ylo539g4hef',
    'cmr8d1zvi00rp1ylo3owbpgua',
    'cmr8g7a9u01qj1ylogojtt94g',
    'cmr8j9seo02ko1ylocdw6yw9k',
    'cmr8m9ap900jt1ygig7s2hrf9',
    'cmr99iixe00ug1ywyksv9dd52',
    'cmru7tlqc000z1yd6pk57jvxp',
    'cmru9iqf7009u1y0sx5hdgw71',
    'cmrvwt03d00351ye8e96qjq7j',
    'cmrwa34ug002h1ynhgu1p9os2',
    'b10x7581aef4c23ea8842efd9703',
    'b4x5a004954d996cd6a39bd6af8',
    'b9xdbfd0b2c682325ccaac4f794',
    'cmqxd0prh006j1yma922hejmb',
    'cmr4gwkt6001j1ydepij2m2hu',
    'cmr8al947019o1yr9pcj0cot8',
    'cmrqhflp5002g1ypxtg8jm5u0',
    'cmwfsan1a001ejsepk5fert4s',
    'b1x2d6fe9ea2d2b8fa81a1d1bab',
    'b2xe5ceb80cad9ceee325d8695a',
    'b4xe4fc851cdb1d841eac718e47',
    'b7xc8ba55578e4335caa6d1958d',
    'cmqd1mz4e00ba1ychegqmr0n0',
    'cmr4kxaih001a1y1ef0n1gwte',
    'cmr89zumj00px1yw27lpvqzm2',
    'cmr8clos2018t1yw2j5ccdzy2',
    'cmrpw57vd002n1yrtop44siwc',
    'cmrru3pks00b21y8wf3vhcmqi',
    'cmrtffjpl000i1yx20v41do98',
    'cmr4e6ict01b61ykyq8xv5dst',
    'cmr8ccekr00k31yloypct6y07',
    'cmr8g7caz01r81ylo178f96rw',
    'cmr8ji8xh02nu1ylov6dodlru',
    'cmr8mluvw00nd1yginl2pje0v',
    'cmr8pvgcz01gm1ygi7vg1vavj',
    'cmr99rfpl00xk1ywya8vyrdh8',
    'cmru8586q004p1yd6u29vhybi',
    'cmruihp8h002w1ycelgaiewuc',
    'cmrvwtu2b003l1ye8he45di2m',
    'cmtpxc5tm00501ymuhqxxrriz',
    'b10xaf941354e6eb740bdd7beeb8',
    'b1x811514783cff9fe9e9e33672',
    'b6x7f8ee272e8c71c765f445633',
    'cmqxder6600as1ymaxmdguhdu',
    'cmr4hayu5003f1ydeoga7zdxw',
    'cmr87izyi00gi1yr9esbabivh',
    'cmra6lzf5003ric045lsu60kz',
    'cmrqhnxof004r1ypxeoo9w37z',
    'cmrtq0tnf00161yqcwaxsnmsj',
    'cmtpvxz6h000g1ylcpu70zerx',
    'b5x0e8336d5ea7d253ffabf11b1',
    'b8x2ef388fa8398f78163783f88',
    'cmqgt4rhq00091y0q52ddvtpd',
    'cmr8ayr7700wk1yw2a6vinvin',
    'cmr8clr3n019l1yw2k0y96tou',
    'cmrpvdr3n002l1yncvg2a1m0c',
    'cmrpw59ro00361yrt8z5vi5er',
    'cmrth10ff002k1yaxsay1cgiv',
    'cmr4eems001fm1yky8mhrhayj',
    'cmr8ccfcj00kc1ylo5bcs86wm',
    'cmr8hgjg302181ylor4piufzp',
    'cmr8qfn8s01m81ygiwdfyc215',
    'cmr9a12ix01131ywyiklp2bg2',
    'cmru858o1004v1yd6i3oeyllm',
    'cmruyeuwu000g1y2yn3cwf7om',
    'cmrvwtucd003o1ye87roun8ma',
    'cmtpxc6iq00591ymub6okoxkc',
    'b8xf4bb704331cd755058519ead',
    'cmpnjhaom001z1ymx6pqd9dwv',
    'cmr886ckh00mr1yr9k8us6bw0',
    'cmrrvfiys002n1yl8ss1b6wtw',
    'cmrtq47v000261yqcc8j81087',
    'cmtpw0n98002e1ylcr5nrzce0'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup) <> 175 THEN
    RAISE EXCEPTION 'backup row count %, expected 175',
      (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_audit80b_20261121_stage (
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
INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida0$b1xa4c02a033c5002746c81f1e6$ida0$,
  $fxa0$wrong_blueprint$fxa0$,
  $sca0$A 74-year-old woman has forgotten how to pay bills over two years. She gets lost in her neighborhood. MRI shows diffuse cortical atrophy, worse in the hippocampi. There is no resting tremor and strength is normal.$sca0$,
  $qua0$Which transmitter is depleted in the basal forebrain?$qua0$,
  $opa0${"options":["GABA from the striatum","Norepinephrine from the locus ceruleus as the sole loss","Acetylcholine","Dopamine","Serotonin"],"blueprintTopic":"alzheimer-acetylcholine","blueprintSystem":"behavioral-nervous"}$opa0$,
  $kya0$Acetylcholine$kya0$,
  $exa0$Progressive memory loss with cortical atrophy is loss of cholinergic neurons in the nucleus basalis of Meynert. Acetylcholine from that nucleus supports memory, and its loss tracks Alzheimer disease. Dopamine loss causes a resting tremor and rigidity she does not have. Serotonin from the raphe modulates mood more than this cortical memory decline. GABA from the striatum is lost in Huntington disease. Norepinephrine from the locus ceruleus as the sole loss is not the transmitter deficit that defines this hippocampal picture.$exa0$,
  3,
  $dma0$behavioral-nervous$dma0$,
  $tpa0$alzheimer-acetylcholine$tpa0$,
  $sua0$https://www.ncbi.nlm.nih.gov/books/NBK499922/$sua0$,
  $sla0$https://www.ncbi.nlm.nih.gov/books/NBK499922/$sla0$,
  $sqa0$The Cholinergic Hypothesis proposes that the reduced levels of acetylcholine (ACh) in the brain, resulting from neuronal loss in the Nucleus Basalis of Meynert, play a significant role in AD development.$sqa0$,
  $cha0$9a1e0ba26e5b9bcf22d77d26786eb19da2be76ac0770d05d4737eb19765791d8$cha0$,
  true,
  $rfa0$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499922/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499922/"}]$rfa0$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida1$b3x71e8916391659ab46c2009fb$ida1$,
  $fxa1$template_artifact|wrong_blueprint|difficulty$fxa1$,
  $sca1$A 30-year-old man receives a liter of saline. Venous pressure rises and stroke volume rises with it. Heart rate is unchanged. He is not in failure. He asks why a fuller heart ejected more, before any hormone changed.$sca1$,
  $qua1$Why did the fuller heart eject more?$qua1$,
  $opa1${"options":["Contractility fell and each contraction generated less force","Sarcomeres were stretched closer to optimal overlap","Heart rate rose and more beats were ejected each minute","Afterload fell to zero and ejection became effortless","The pericardium vanished and filling was unrestricted"],"blueprintTopic":"frank-starling","blueprintSystem":"cardiovascular"}$opa1$,
  $kya1$Sarcomeres were stretched closer to optimal overlap$kya1$,
  $exa1$The Frank-Starling mechanism matches output to venous return, so a sudden increase in preload raises stroke volume up to a point. Sarcomeres were stretched closer to optimal overlap. Heart rate rose contradicts an unchanged rate. Afterload fell to zero is not what saline does. The pericardium vanished would be a rupture. Contractility fell would lower stroke volume.$exa1$,
  2,
  $dma1$cardiovascular$dma1$,
  $tpa1$frank-starling$tpa1$,
  $sua1$https://www.ncbi.nlm.nih.gov/books/NBK459390/$sua1$,
  $sla1$https://www.ncbi.nlm.nih.gov/books/NBK459390/$sla1$,
  $sqa1$Increases in preload stretch the ventricular myocytes to a length closer to the optimum value leading to an increase in active tension.$sqa1$,
  $cha1$bbed60e5c5d1c8dd725e593981c966d55b6871235994a99a2dc363ebcd027c55$cha1$,
  true,
  $rfa1$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459390/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459390/"}]$rfa1$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida2$b5x5fb8c4c870b93fe30e06afd0$ida2$,
  $fxa2$template_artifact|wrong_blueprint|difficulty$fxa2$,
  $sca2$Two 28-year-old patients fail to concentrate urine after water deprivation. After desmopressin, one concentrates and the other stays dilute. Both were polyuric. A colleague says both kidneys are broken because deprivation failed.$sca2$,
  $qua2$Why did only one patient concentrate after desmopressin?$qua2$,
  $opa2${"options":["Desmopressin repairs a broken collecting-duct receptor","Both patients stayed dilute, so the desmopressin result was misread","Water deprivation should have concentrated the broken duct","The patient who responded is the one with collecting-duct disease","That patient's missing signal was replaced and the duct still works"],"blueprintTopic":"diabetes-insipidus","blueprintSystem":"reproductive-endocrine"}$opa2$,
  $kya2$That patient's missing signal was replaced and the duct still works$kya2$,
  $exa2$Central diabetes insipidus concentrates after desmopressin, while nephrogenic diabetes insipidus does not, because the collecting duct cannot answer the hormone. That patient's missing signal was replaced and the duct still works. Desmopressin repairs a broken collecting-duct receptor is what did not happen in the second patient. Both stayed dilute, so the result was misread contradicts the stem. Water deprivation should have concentrated the broken duct is why deprivation alone cannot separate them. The patient who responded has the duct disease swaps the two diagnoses.$exa2$,
  3,
  $dma2$reproductive-endocrine$dma2$,
  $tpa2$diabetes-insipidus$tpa2$,
  $sua2$https://www.ncbi.nlm.nih.gov/books/NBK537591/$sua2$,
  $sla2$https://www.ncbi.nlm.nih.gov/books/NBK537591/$sla2$,
  $sqa2$Administration of desmopressin after water deprivation should help with differentiating patients with central DI from those with nephrogenic DI as the former should be able to concentrate the urine once the deficient action of AVP is replaced with desmopressin, while the latter should not show a significant response due to end-organ resistance to the action of AVP or its analogues.$sqa2$,
  $cha2$90bca8e7aa92e973c0df65d6d381b819b1b3ed80fe3fc5e4ec46cc0af2e48e5d$cha2$,
  true,
  $rfa2$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK537591/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK537591/"}]$rfa2$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida3$b8xb5edbe3652c596a1e4122ecc$ida3$,
  $fxa3$template_artifact|wrong_blueprint|difficulty$fxa3$,
  $sca3$A 17-year-old patient has never menstruated. She has normal pubic hair, normal breast development, a normal female testosterone, and no uterus. Ovaries are present. A classmate says absent pubic hair would be required for a missing uterus. The vagina ends in a blind pouch.$sca3$,
  $qua3$Why does the pubic hair mean the uterus problem is not androgen resistance?$qua3$,
  $opa3${"options":["Breasts with no uterus mean the androgen receptor is absent in this patient","Ovaries cannot be present if the uterus never formed during fetal life","A blind vaginal pouch means both androgen resistance and a formed uterus","Androgen action clearly worked, so the missing piece is formation of the uterus itself","A normal female testosterone level is the change that removes the uterus"],"blueprintTopic":"mullerian-agenesis","blueprintSystem":"reproductive-endocrine"}$opa3$,
  $kya3$Androgen action clearly worked, so the missing piece is formation of the uterus itself$kya3$,
  $exa3$Pubic hair and a normal female testosterone mean the androgen receptor works, so the absent uterus is a duct that never formed. Androgen action clearly worked, so the missing piece is formation of the uterus itself. Normal female testosterone removes the uterus is compatible with ovaries and an absent uterus from a different failure. Breasts with no uterus mean the androgen receptor is absent would lack pubic hair and have a male-range testosterone. Ovaries cannot be present if the uterus never formed are present here. A blind pouch means both androgen resistance and a formed uterus is the lower vagina without a uterus.$exa3$,
  3,
  $dma3$reproductive-endocrine$dma3$,
  $tpa3$mullerian-agenesis$tpa3$,
  $sua3$https://www.ncbi.nlm.nih.gov/books/NBK554469/$sua3$,
  $sla3$https://www.ncbi.nlm.nih.gov/books/NBK554469/$sla3$,
  $sqa3$Anomalies in the development of these patients include sparse pubic hair due to abnormal androgen receptors, well-developed breasts due to the presence of estrogen, and a blind vaginal pouch without a uterus on an exam.$sqa3$,
  $cha3$14c657d5a6b131cd269013bec0601e774a37d7519d888d94b0c43433390038bf$cha3$,
  true,
  $rfa3$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK554469/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK554469/"}]$rfa3$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida4$cmqgt4w7s001k1y0q15m8wcey$ida4$,
  $fxa4$template_artifact|wrong_blueprint|difficulty$fxa4$,
  NULL,
  $qua4$A 32-year-old man of Mediterranean descent comes to the emergency department with fatigue, dark urine and yellow eyes 3 days after starting trimethoprim-sulfamethoxazole for a urinary tract infection. Hemoglobin is 9.0 g/dL (14.5 g/dL last year), reticulocyte count is 8%, indirect bilirubin is 3.2 mg/dL, and haptoglobin is low. The peripheral smear shows bite cells and Heinz bodies, and a direct antiglobulin (Coombs) test is negative. Which of the following is the most likely mechanism of this patient's condition?$qua4$,
  $opa4${"options":["Antibody-mediated destruction of circulating red blood cells caused this hemolysis","Blockade of heme synthesis caused ineffective erythropoiesis and a low marrow output","Deficiency of glucose-6-phosphate dehydrogenase, leaving red cells vulnerable to oxidant injury","Splenic sequestration from hypersplenism removed red cells from the circulation"],"blueprintTopic":"g6pd-deficiency","blueprintSystem":"blood-lymph-immune"}$opa4$,
  $kya4$Deficiency of glucose-6-phosphate dehydrogenase, leaving red cells vulnerable to oxidant injury$kya4$,
  $exa4$Correct answer: C. Deficiency of glucose-6-phosphate dehydrogenase, leaving red cells vulnerable to oxidant injury. An oxidant drug started 3 days ago triggered a Coombs-negative hemolysis with bite cells and Heinz bodies (denatured hemoglobin) in a man of Mediterranean descent. This is the oxidative, non-immune hemolysis of G6PD deficiency. Why the other options are wrong: A. A negative direct Coombs test argues against antibody-mediated hemolysis. B. Ineffective erythropoiesis gives a low reticulocyte count, not 8% with bite cells. D. Nothing suggests splenomegaly, and sequestration does not produce bite cells and Heinz bodies after a drug.$exa4$,
  3,
  $dma4$blood-lymph-immune$dma4$,
  $tpa4$g6pd-deficiency$tpa4$,
  $sua4$https://www.ncbi.nlm.nih.gov/books/NBK470315/$sua4$,
  $sla4$https://www.ncbi.nlm.nih.gov/books/NBK470315/$sla4$,
  $sqa4$Peripheral smears may display bite and blister cells, while supravital staining demonstrates Heinz bodies.$sqa4$,
  $cha4$f86077dc12660191b1bcdc9e67721ec54d921e2932e82c0521f29643e855cd1d$cha4$,
  true,
  $rfa4$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470315/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470315/"}]$rfa4$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida5$cmr4qv9rm00zt1y1ezskmcg0i$ida5$,
  $fxa5$wrong_blueprint$fxa5$,
  $sca5$A 45-year-old woman presents to the emergency department with joint pain and swelling in her hands and knees. She has a history of hypertension and is currently taking lisinopril. On examination, her blood pressure is 130/85 mm Hg, and she has a rash on her cheeks. Laboratory tests reveal a positive antinuclear antibody (ANA) and anti-double-stranded DNA antibodies. Her complement levels are low.$sca5$,
  $qua5$What is the most likely diagnosis?$qua5$,
  $opa5${"options":["Rheumatoid arthritis (an autoimmune joint disease)","Systemic lupus erythematosus","Psoriatic arthritis","Osteoarthritis"],"distractorRationale":{"Rheumatoid arthritis (an autoimmune joint disease)":"Fails to account for the malar rash and specific autoantibodies associated with SLE.","Psoriatic arthritis":"Does not explain the systemic symptoms and positive anti-dsDNA antibodies.","Osteoarthritis":"Incorrectly assumes a degenerative process without systemic involvement or autoantibody positivity."},"clinicalReasoning":"Assess the patient's symptoms and laboratory findings to analyze the autoimmune nature of the condition. Integrate the presence of specific autoantibodies and clinical manifestations to arrive at the diagnosis of SLE.","keyTakeaways":["When evaluating joint pain with a rash and positive autoantibodies, consider systemic lupus erythematosus first."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"systemic-lupus-erythematosus","blueprintSystem":"musculoskeletal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783070823919","qcScore":8.3,"slotIndex":57,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-03T09:41:22.293Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$opa5$,
  $kya5$Systemic lupus erythematosus$kya5$,
  $exa5$Why this answer is correct
The most likely diagnosis is systemic lupus erythematosus (SLE) due to characteristic symptoms and lab findings.
Joint pain and swelling in multiple areas are common in SLE.
The malar rash (butterfly rash) is a classic skin manifestation of SLE.
Positive anti-double-stranded DNA antibodies and low complement levels indicate an autoimmune process.
In practice: In practice, recognizing SLE early can lead to timely management and prevent complications. Understanding the autoimmune nature of SLE helps guide treatment decisions.
Why the other options are wrong

Rheumatoid arthritis (an autoimmune joint disease)
Trap: Students may confuse SLE with rheumatoid arthritis due to overlapping symptoms like joint pain.
Why it fails here: Rheumatoid arthritis (an autoimmune joint disease) typically presents with symmetric polyarthritis and does not feature a malar rash or positive anti-dsDNA antibodies, which are specific to SLE.
Remember: This highlights the importance of distinguishing between autoimmune disorders based on specific clinical and laboratory findings.

Psoriatic arthritis
Trap: Students might think of psoriatic arthritis due to joint involvement and skin symptoms.
Why it fails here: Psoriatic arthritis is associated with psoriasis and usually affects distal joints, lacking the systemic symptoms and specific autoantibodies seen in SLE.
Remember: Recognizing the distinct features of each type of arthritis is crucial for accurate diagnosis.

Osteoarthritis
Trap: Some may consider osteoarthritis due to the presence of joint pain.
Why it fails here: Osteoarthritis is a degenerative joint disease that does not present with systemic symptoms or positive autoantibodies, which are key indicators of SLE.
Remember: Understanding the differences between degenerative and autoimmune conditions is essential for proper diagnosis.
Key takeaway
When evaluating joint pain with a rash and positive autoantibodies, consider systemic lupus erythematosus first.

Memory hook: Think of SLE as the 'triad' of joint pain, rash, and positive ANA.$exa5$,
  3,
  $dma5$msk-skin$dma5$,
  $tpa5$systemic-lupus-erythematosus$tpa5$,
  $sua5$https://medlineplus.gov/lupus.html$sua5$,
  $sla5$https://medlineplus.gov/lupus.html$sla5$,
  $sqa5$Red rash, most often on the face (also called the "butterfly rash").$sqa5$,
  $cha5$891a554af324113261921c9fc0b7c071aa5498555189ee9b3beb77183732ca4c$cha5$,
  true,
  $rfa5$[{"label": "https://medlineplus.gov/lupus.html", "url": "https://medlineplus.gov/lupus.html"}]$rfa5$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida6$cmr8aytwc00xb1yw2dcc1kbzq$ida6$,
  $fxa6$cue|rationale$fxa6$,
  $sca6$A 45-year-old woman presents to the emergency department with a 2-week history of worsening anxiety, insomnia, and increased irritability. She reports that she recently stopped taking sertraline due to gastrointestinal side effects. On examination, her blood pressure is 130/85 mm Hg, heart rate is 92 bpm, and she appears agitated. A urine toxicology screen is negative for illicit substances.$sca6$,
  $qua6$Which drug mechanism best accounts for this adverse effect?$qua6$,
  $opa6${"options":["Inhibition of serotonin reuptake","Antagonism of dopamine receptors","Inhibition of norepinephrine reuptake","Inhibition of gamma-aminobutyric acid (GABA) receptors"],"distractorRationale":{"Antagonism of dopamine receptors":"This mechanism is associated with antipsychotic medications, which do not explain the patient's anxiety and irritability after stopping an SSRI.","Inhibition of norepinephrine reuptake":"This mechanism pertains to norepinephrine reuptake inhibitors, which are not relevant to the patient's current symptoms after SSRI discontinuation.","Inhibition of gamma-aminobutyric acid (GABA) receptors":"This mechanism is related to benzodiazepines, which are not indicated in this case and do not account for the withdrawal symptoms from an SSRI."},"clinicalReasoning":"The patient's symptoms of anxiety and irritability after discontinuing her SSRI suggest withdrawal effects due to the mechanism of serotonin reuptake inhibition. Analyzing her presentation and understanding the pharmacological principles of SSRIs allows for a clear connection between the drug mechanism and her adverse effects.","keyTakeaways":["When a patient stops taking an SSRI, think withdrawal symptoms due to **serotonin reuptake inhibition** first."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"psychiatric-pharmacology","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783285915604","qcScore":8.1,"slotIndex":50,"stepLevel":"step1","examNumber":9111,"generatedAt":"2026-07-05T21:24:06.425Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$opa6$,
  $kya6$Inhibition of serotonin reuptake$kya6$,
  $exa6$Why this answer is correct
Inhibition of serotonin reuptake explains the patient's withdrawal symptoms.
SSRIs (selective serotonin reuptake inhibitors) increase serotonin levels by blocking its reabsorption in the brain.
Discontinuation of SSRIs can lead to withdrawal symptoms like anxiety and irritability due to decreased serotonin availability.
The patient's agitation and anxiety are consistent with the effects of stopping her SSRI.
In practice: In practice, recognizing SSRI withdrawal is essential for providing appropriate support and education to patients. This helps prevent relapse and encourages adherence to treatment.
Why the other options are wrong

Antagonism of dopamine receptors
Trap: Students may think this option relates to anxiety symptoms because dopamine is involved in mood regulation.
Why it fails here: However, dopamine receptor antagonism is primarily associated with antipsychotic medications, which do not directly explain the withdrawal symptoms from SSRIs.
Remember: This highlights the importance of understanding the specific mechanisms of different psychiatric medications.

Inhibition of norepinephrine reuptake
Trap: Some may confuse norepinephrine reuptake inhibition with anxiety treatment, thinking it could alleviate symptoms.
Why it fails here: Norepinephrine reuptake inhibitors are a different class of medications and do not account for the withdrawal effects seen after stopping an SSRI.
Remember: This emphasizes the need to differentiate between the mechanisms of various antidepressants.

Inhibition of gamma-aminobutyric acid (GABA) receptors
Trap: Students might believe that GABA receptor inhibition could relate to anxiety management due to its calming effects.
Why it fails here: Benzodiazepine anxiolytics increase GABA-A chloride-channel opening rather than inhibit GABA receptors, and that mechanism does not explain the symptoms that follow stopping sertraline.
Remember: Understanding the role of GABA and serotonin in anxiety treatment is crucial for accurate pharmacological reasoning.
Key takeaway
When a patient stops taking an SSRI, think withdrawal symptoms due to serotonin reuptake inhibition first.

Memory hook: Remember: SSRIs stop serotonin from being 'reabsorbed' — when they’re gone, anxiety can 'reappear'.$exa6$,
  3,
  $dma6$behavioral-nervous$dma6$,
  $tpa6$psychiatric-pharmacology$tpa6$,
  $sua6$https://www.ncbi.nlm.nih.gov/books/NBK547689/$sua6$,
  $sla6$https://www.ncbi.nlm.nih.gov/books/NBK547689/$sla6$,
  $sqa6$Sertraline is an antidepressant with primarily inhibitory effects on presynaptic serotonin reuptake.$sqa6$,
  $cha6$88f2c02b5ded3aed4063d9b300d2b1249d27663685e65dd9c7e30343cced9ad0$cha6$,
  true,
  $rfa6$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK547689/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK547689/"}]$rfa6$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida7$cmr8d6fbh000i1yaztwvty1wy$ida7$,
  $fxa7$cue$fxa7$,
  $sca7$A 68-year-old woman presents to the clinic with complaints of increasing back pain and difficulty standing for long periods. On examination, her height is noted to have decreased by 2 inches over the past year. Laboratory tests reveal a serum calcium of 9.2 mg/dL and a vitamin D level of 20 ng/mL.$sca7$,
  $qua7$Which of the following is the most likely diagnosis?$qua7$,
  $opa7${"options":["Osteoporosis","Osteomalacia","Paget's disease","Multiple myeloma"],"distractorRationale":{"Osteomalacia":"This condition is caused by vitamin D deficiency but does not typically lead to significant height loss as seen in osteoporosis.","Paget's disease":"Paget's disease involves abnormal bone remodeling and would present with localized pain and deformities, not just height loss.","Multiple myeloma":"This malignancy often presents with systemic symptoms and bone pain, but the absence of anemia or renal issues makes it unlikely."},"clinicalReasoning":"Assessing the patient's history of osteoporosis and symptoms of height loss leads to the diagnosis of osteoporosis. Analyzing the lab results shows normal calcium but low vitamin D, which does not directly correlate with osteomalacia in this context. Integrating these findings confirms osteoporosis as the most likely diagnosis.","keyTakeaways":["When evaluating a patient with back pain and height loss, prioritize osteoporosis as the likely diagnosis, especially in older adults."],"kind":"calculation","taskCategory":"diagnosis","blueprintTopic":"osteoporosis-bone","blueprintSystem":"musculoskeletal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783289680145","qcScore":8.1,"slotIndex":20,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-05T22:15:41.473Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$opa7$,
  $kya7$Osteoporosis$kya7$,
  $exa7$Why this answer is correct
The most likely diagnosis is osteoporosis due to decreased bone density and height loss.
Osteoporosis is characterized by reduced bone density, leading to increased fracture risk.
A 2-inch height loss in one year is the usual result of vertebral compression, which supports osteoporosis.
Normal serum calcium levels and low vitamin D indicate that while vitamin D deficiency is present, it does not explain the height loss.
In practice: On the unit, recognizing osteoporosis is crucial for managing patients at risk of fractures. This understanding helps guide treatment and preventive measures.
Why the other options are wrong

Osteomalacia
Trap: Students may consider osteomalacia due to the low vitamin D level.
Why it fails here: However, osteomalacia typically presents with bone pain and muscle weakness rather than significant height loss, which is a hallmark of osteoporosis.
Remember: This highlights the importance of differentiating between conditions that cause bone pain versus those that lead to structural changes like height loss.

Paget's disease
Trap: Some may confuse Paget's disease with osteoporosis due to the presence of bone pain.
Why it fails here: Paget's disease is characterized by localized bone pain and deformities, not generalized height loss, which is more indicative of osteoporosis.
Remember: Understanding the distinct presentations of these conditions is key to accurate diagnosis.

Multiple myeloma
Trap: Students might think of multiple myeloma due to the patient's age and back pain.
Why it fails here: Multiple myeloma typically presents with systemic symptoms such as anemia, renal dysfunction, and bone lesions, none of which are indicated in this case.
Remember: Recognizing the specific clinical features of multiple myeloma helps avoid misdiagnosis.
Key takeaway
When evaluating a patient with back pain and height loss, prioritize osteoporosis as the likely diagnosis, especially in older adults.

Memory hook: Think 'Osteoporosis = Old age + Height loss' to remember the key signs.$exa7$,
  3,
  $dma7$msk-skin$dma7$,
  $tpa7$osteoporosis-bone$tpa7$,
  $sua7$https://www.ncbi.nlm.nih.gov/books/NBK279049/$sua7$,
  $sla7$https://www.ncbi.nlm.nih.gov/books/NBK279049/$sla7$,
  $sqa7$A height loss of 1.5 inches (4.0 cm) or more compared to the historical maximum or a loss of 0.75 inches (2.0 cm) or more compared to a previous measured height suggests a high likelihood of vertebral fracture.$sqa7$,
  $cha7$74087911c5519731d3c05323ec304aaa01c67267d6f7fcaed1eba08d73492423$cha7$,
  true,
  $rfa7$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK279049/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK279049/"}]$rfa7$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida8$cmrpwcip5004h1yrtbas6b6yc$ida8$,
  $fxa8$wrong_blueprint|rationale$fxa8$,
  $sca8$A 70-year-old woman with a history of breast cancer presents with new-onset back pain and weakness in her legs. MRI of the spine reveals a compression fracture at T12 and multiple lytic lesions in the vertebrae. Laboratory tests show elevated calcium levels (12.5 mg/dL) and elevated alkaline phosphatase.$sca8$,
  $qua8$Which pathophysiologic process best explains these findings?$qua8$,
  $opa8${"kind":"image_based","stepLevel":"step1","blueprintSystem":"msk-skin","blueprintTopic":"osteolytic-metastasis","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350382703","qcScore":8.1,"slotIndex":5,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-18T04:53:49.884Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Osteolytic metastasis","Osteoblastic metastasis","Primary hyperparathyroidism","Multiple myeloma"],"taskCategory":"health-maintenance"}$opa8$,
  $kya8$Osteolytic metastasis$kya8$,
  $exa8$Why this answer is correct
Osteolytic metastasis explains the patient's elevated calcium and lytic lesions.
Osteolytic metastasis occurs when cancer cells invade bone, causing bone destruction.
Breast cancer often spreads to bone, leading to lytic lesions that weaken the structure.
Elevated calcium levels (hypercalcemia) result from bone breakdown and release of calcium into the bloodstream.
In practice: In practice, recognizing osteolytic metastasis is crucial for managing pain and preventing fractures in patients with a history of cancer.
Why the other options are wrong

Osteoblastic metastasis
Trap: Students may confuse osteoblastic with osteolytic processes, thinking both can cause similar symptoms.
Why it fails here: Osteoblastic metastasis typically leads to increased bone density and does not present with lytic lesions, which are characteristic of osteolytic processes.
Remember: Understanding the difference between osteolytic and osteoblastic metastasis is key to interpreting imaging findings correctly.

Primary hyperparathyroidism
Trap: Some may think hyperparathyroidism alone can explain both hypercalcemia and lytic lesions.
Why it fails here: Primary hyperparathyroidism causes hypercalcemia and can cause lytic brown tumors, but brown tumors do not explain multiple vertebral lesions and leg weakness in a woman with known breast cancer.
Remember: Recognizing that lytic lesions are not a feature of primary hyperparathyroidism helps clarify the diagnosis.

Multiple myeloma
Trap: Students might consider multiple myeloma due to its association with bone lesions and hypercalcemia.
Why it fails here: However, the presence of a known primary malignancy (breast cancer) and the specific imaging findings favor osteolytic metastasis over multiple myeloma.
Remember: Differentiating between multiple myeloma and metastatic disease is essential when evaluating patients with a history of cancer.
Key takeaway
When evaluating bone lesions in cancer patients, prioritize osteolytic metastasis if lytic lesions and hypercalcemia are present.

Memory hook: Think 'lytic = lost bone' for osteolytic metastasis.$exa8$,
  2,
  $dma8$msk-skin$dma8$,
  $tpa8$osteolytic-metastasis$tpa8$,
  $sua8$https://pmc.ncbi.nlm.nih.gov/articles/PMC6663953/$sua8$,
  $sla8$https://pmc.ncbi.nlm.nih.gov/articles/PMC6663953/$sla8$,
  $sqa8$The radiological features of browns tumours in the reported cases mainly consisted of single or multiple well-defined osteolytic lesions.$sqa8$,
  $cha8$0eaec918417fa3c82ad2b630976879ba9ab657ff29886fcfb7dc1ac7caebd1e7$cha8$,
  true,
  $rfa8$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6663953/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6663953/"}]$rfa8$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida9$cmrrum8xu00i31y8wsnkpfs8g$ida9$,
  $fxa9$wrong_key|difficulty|wrong_blueprint$fxa9$,
  $sca9$A 65-year-old man presents to the emergency department with a 2-day history of decreased urine output and fatigue. He has a history of hypertension and type 2 diabetes mellitus, and he takes lisinopril and metformin. On examination, his blood pressure is 150/90 mm Hg, heart rate is 92 bpm, and he has mild edema in his lower extremities. Laboratory results show serum creatinine of 2.5 mg/dL, potassium of 6.8 mEq/L, sodium of 140 mEq/L, chloride of 102 mEq/L, and bicarbonate of 20 mEq/L.$sca9$,
  $qua9$What is the anion gap (mEq/L)?$qua9$,
  $opa9${"options":["14","16","18","20"],"distractorRationale":{"14":"Underestimates the AG due to potential miscalculation.","16":"Suggests a mild increase in AG but does not reflect the significant renal impairment.","20":"Overestimates the AG, not supported by clinical data."},"clinicalReasoning":"Assess the patient's history of diabetes and hypertension, which can lead to renal dysfunction. Analyze the lab results indicating elevated creatinine and potassium levels. Integrate the AG calculation to determine the metabolic status, confirming the diagnosis of AKI.","keyTakeaways":["When calculating the anion gap, always consider the patient's renal function and clinical context to avoid misinterpretation."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"anion-gap","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784468457420","qcScore":8.3,"slotIndex":29,"stepLevel":"step1","examNumber":9109,"generatedAt":"2026-07-19T13:44:36.154Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$opa9$,
  $kya9$18$kya9$,
  $exa9$The anion gap without potassium is sodium minus (chloride + bicarbonate): 140 - (102 + 20) = 18 mEq/L. The original stem gave creatinine and potassium only, so none of the listed numbers could be calculated. An elevated gap fits a metabolic acidosis, which can accompany this acute kidney injury. The other choices are arithmetic misses around that same calculation.$exa9$,
  2,
  $dma9$respiratory-renal$dma9$,
  $tpa9$anion-gap$tpa9$,
  $sua9$https://mdcalc.scholasticahq.com/article/154676-updated-review-of-serum-anion-gap$sua9$,
  $sla9$https://mdcalc.scholasticahq.com/article/154676-updated-review-of-serum-anion-gap$sla9$,
  $sqa9$Anion gap, mEq/L = sodium, mEq/L - (chloride, mEq/L+ bicarbonate, mEq/L)$sqa9$,
  $cha9$028c578c6a404286584534f4c9f7d0c83c4a5b57ea0a78b812758bb9ec1d7e1c$cha9$,
  true,
  $rfa9$[{"label": "https://mdcalc.scholasticahq.com/article/154676-updated-review-of-serum-anion-gap", "url": "https://mdcalc.scholasticahq.com/article/154676-updated-review-of-serum-anion-gap"}]$rfa9$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida10$cmrth11oy002x1yaxefl6sl6n$ida10$,
  $fxa10$wrong_blueprint|rationale$fxa10$,
  $sca10$A 58-year-old man presents to the emergency department with increasing fatigue, weakness, and jaundice over the past month. He has a medical history of hypertension and type 2 diabetes, managed with metformin and lisinopril. On examination, he has scleral icterus, a blood pressure of 142/88 mm Hg, and laboratory tests reveal a hemoglobin level of 9.0 g/dL, reticulocyte count of 5.0%, and total bilirubin of 3.2 mg/dL. A peripheral blood smear shows bite cells and Heinz bodies.$sca10$,
  $qua10$What is the most likely enzyme deficiency responsible for this patient's condition?$qua10$,
  $opa10${"options":["Glucose-6-phosphate dehydrogenase deficiency","Pyruvate kinase deficiency (a red-cell enzyme defect)","Fructose-1,6-bisphosphatase deficiency","Hexokinase deficiency"],"distractorRationale":{"Pyruvate kinase deficiency (a red-cell enzyme defect)":"However, pyruvate kinase deficiency typically does not present with Heinz bodies or bite cells, which are characteristic of G6PD deficiency. (This highlights the importance of specific blood smear findings in diagnosing the type of hemolytic anemia.)","Fructose-1,6-bisphosphatase deficiency":"This deficiency primarily leads to metabolic acidosis and hypoglycemia, not hemolytic anemia, making it irrelevant in this context. (Understanding the metabolic pathways involved helps clarify why this option does not fit the clinical picture.)","Hexokinase deficiency":"Hexokinase deficiency is extremely rare and does not typically present with the classic signs of hemolytic anemia seen in this patient. (This reinforces the need to focus on common enzyme deficiencies that lead to specific clinical findings.)"},"clinicalReasoning":"Glucose-6-phosphate dehydrogenase deficiency is the most likely enzyme deficiency in this patient. **G6PD deficiency** leads to hemolytic anemia due to oxidative stress. The presence of **Heinz bodies** and **bite cells** on the blood smear indicates oxidative damage to red blood cells.","keyTakeaways":["When evaluating hemolytic anemia, remember that G6PD deficiency is a leading cause associated with oxidative stress and specific blood smear findings."],"taskCategory":"communication","blueprintTopic":"g6pd-deficiency","blueprintSystem":"blood-lymph-immune","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784566411523","qcScore":7.9,"slotIndex":24,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-20T16:57:27.196Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa10$,
  $kya10$Glucose-6-phosphate dehydrogenase deficiency$kya10$,
  $exa10$Why this answer is correct
Glucose-6-phosphate dehydrogenase deficiency is the most likely enzyme deficiency in this patient.
G6PD deficiency leads to hemolytic anemia due to oxidative stress.
The presence of Heinz bodies and bite cells on the blood smear indicates oxidative damage to red blood cells.
Elevated reticulocyte count shows the bone marrow's response to anemia.
In practice: In practice, recognizing G6PD deficiency is crucial because it can lead to severe hemolytic episodes, especially after exposure to certain medications or infections. Understanding this condition helps guide appropriate management and patient education.
Why the other options are wrong

Pyruvate kinase deficiency (a red-cell enzyme defect)
Trap: Students may think this option is correct because it also causes hemolytic anemia.
Why it fails here: However, pyruvate kinase deficiency typically does not present with Heinz bodies or bite cells, which are characteristic of G6PD deficiency.
Remember: This highlights the importance of specific blood smear findings in diagnosing the type of hemolytic anemia.

Fructose-1,6-bisphosphatase deficiency
Trap: Some may confuse this with metabolic disorders that cause fatigue and weakness.
Why it fails here: This deficiency primarily leads to metabolic acidosis and hypoglycemia, not hemolytic anemia, making it irrelevant in this context.
Remember: Understanding the metabolic pathways involved helps clarify why this option does not fit the clinical picture.

Hexokinase deficiency
Trap: Students might think this is a plausible option due to its association with glycolysis.
Why it fails here: Hexokinase deficiency is extremely rare and does not typically present with the classic signs of hemolytic anemia seen in this patient.
Remember: This reinforces the need to focus on common enzyme deficiencies that lead to specific clinical findings.
Key takeaway
When evaluating hemolytic anemia, remember that G6PD deficiency is a leading cause associated with oxidative stress and specific blood smear findings.

Memory hook: Heinz bodies are denatured hemoglobin, and bite cells are what remain after the spleen pits them out.$exa10$,
  4,
  $dma10$blood-lymph-immune$dma10$,
  $tpa10$g6pd-deficiency$tpa10$,
  $sua10$https://www.ncbi.nlm.nih.gov/books/NBK470315/$sua10$,
  $sla10$https://www.ncbi.nlm.nih.gov/books/NBK470315/$sla10$,
  $sqa10$Peripheral smears may display bite and blister cells, while supravital staining demonstrates Heinz bodies.$sqa10$,
  $cha10$7d87c1542ef6f3fadafc560b5c60a22ec2c12ddcd3eafb0088d49494fcefc3aa$cha10$,
  true,
  $rfa10$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470315/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470315/"}]$rfa10$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida11$301f07cd-1df1-473c-b732-cbff63c47cb6$ida11$,
  $fxa11$difficulty$fxa11$,
  $sca11$A 30-year-old woman is receiving magnesium sulfate for preeclampsia with severe features. Respiratory rate falls to 8, deep-tendon reflexes are absent, and oxygen saturation is 90% on room air. Blood pressure is 140/90 mm Hg. The infusion is still running. She is drowsy.$sca11$,
  $qua11$Which plan is most appropriate?$qua11$,
  $opa11${"options":["Stop magnesium and give calcium gluconate","Increase the magnesium infusion","Naloxone as the specific antidote","Nifedipine as the magnesium antidote","Furosemide (a loop diuretic) to bind magnesium"],"blueprintSystem":"reproductive-endocrine","taskCategory":"pharmacotherapy","blueprintTopic":"magnesium-toxicity-calcium-gluconate","kind":"vignette"}$opa11$,
  $kya11$Stop magnesium and give calcium gluconate$kya11$,
  $exa11$Loss of reflexes and hypoventilation during a magnesium infusion are magnesium toxicity. Stop the infusion and give intravenous calcium. More magnesium deepens the block. Nifedipine is an antihypertensive, not the antidote, and combined with magnesium it can worsen weakness. Naloxone reverses opioids. Furosemide does not reverse acute magnesium toxicity.$exa11$,
  2,
  $dma11$reproductive-endocrine$dma11$,
  $tpa11$magnesium-toxicity-calcium-gluconate$tpa11$,
  $sua11$https://www.ncbi.nlm.nih.gov/books/NBK554593/$sua11$,
  $sla11$https://www.ncbi.nlm.nih.gov/books/NBK554593/$sla11$,
  $sqa11$For severe, life-threatening manifestations, such as ECG abnormalities, profound hypotension, or respiratory depression, intravenous calcium provides immediate but temporary antagonism of magnesium-induced cardiotoxicity and neuromuscular blockade.$sqa11$,
  $cha11$9db7bd3d28412a2e7a0b0b0ea0e4941f045fc1d1117ff5b9d128dfa0b730ecce$cha11$,
  true,
  $rfa11$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK554593/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK554593/"}]$rfa11$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida12$cmr4fthdz01zt1ykyopk9mf5l$ida12$,
  $fxa12$wrong_blueprint|rationale$fxa12$,
  $sca12$A 50-year-old male with a history of hypertension and hyperlipidemia presents for a routine check-up. His blood pressure is 160/100 mm Hg, and his LDL cholesterol is 160 mg/dL. He is currently on lisinopril and atorvastatin. He expresses concern about his cardiovascular risk and asks about lifestyle changes.$sca12$,
  $qua12$What is the most appropriate counseling point regarding lifestyle modifications?$qua12$,
  $opa12${"kind":"ethics","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"cardiovascular-lifestyle","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783052779242","examNumber":9322,"slotIndex":55,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-03T04:27:17.496Z"},"options":["Increase physical activity to at least 150 minutes per week","Limit sodium intake to less than 4 grams per day","Reduce intake of saturated fats to less than 30% of total calories","Increase dietary fiber to 50 grams per day"]}$opa12$,
  $kya12$Increase physical activity to at least 150 minutes per week$kya12$,
  $exa12$For cardiovascular risk reduction, one of the most effective lifestyle modifications is to increase physical activity to at least 150 minutes per week. This recommendation aligns with guidelines for managing hypertension and hyperlipidemia. Limiting sodium intake is also important, but the threshold of less than 4 grams is excessive; less than 2.3 grams is more appropriate. Reducing saturated fat to less than 30% of calories is incorrect advice, because the American Heart Association limit is about 6% of calories. Increasing dietary fiber to 50 grams per day is excessive and not practical for most individuals.

Clinical reasoning: Evaluate the patient's cardiovascular risk factors and current management. Analyze the most impactful lifestyle changes that can be made. Integrate this information to determine that increasing physical activity is the most appropriate counseling point.

Why other options are incorrect:
• Limit sodium intake to less than 4 grams per day: Common trap: This recommendation is too high; guidelines suggest less than 2.3 grams.
• Reduce intake of saturated fats to less than 30% of total calories: This target is far too high. Saturated fat should be limited to about 6% of calories.
• Increase dietary fiber to 50 grams per day: Misconception: This is impractical; general recommendations are around 25-30 grams.$exa12$,
  3,
  $dma12$cardiovascular$dma12$,
  $tpa12$cardiovascular-lifestyle$tpa12$,
  $sua12$https://www.heart.org/en/news/2026/02/02/what-can-you-do-today-to-improve-your-heart-health-simple-steps-can-make-a-difference$sua12$,
  $sla12$https://www.heart.org/en/news/2026/02/02/what-can-you-do-today-to-improve-your-heart-health-simple-steps-can-make-a-difference$sla12$,
  $sqa12$The American Heart Association recommends 150 minutes a week of moderate-intensity aerobic activity or 75 minutes a week of vigorous aerobic activity, or a combination of both, preferably spread throughout the week.$sqa12$,
  $cha12$8bf30c5a356b5556051f0d53923e23e4cd2f72c6f31597df891be0e390032166$cha12$,
  true,
  $rfa12$[{"label": "https://www.heart.org/en/news/2026/02/02/what-can-you-do-today-to-improve-your-heart-health-simple-steps-can-make-a-difference", "url": "https://www.heart.org/en/news/2026/02/02/what-can-you-do-today-to-improve-your-heart-health-simple-steps-can-make-a-difference"}]$rfa12$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida13$cmr8e5wgk016x1yloyc0gfuna$ida13$,
  $fxa13$wrong_blueprint|difficulty$fxa13$,
  $sca13$A 45-year-old man presents to the emergency department with severe abdominal pain that started suddenly. He has a history of gallstones and reports nausea and vomiting. On examination, he has a fever of 101°F, and his abdomen is tender in the right upper quadrant. A right upper quadrant ultrasound shows gallbladder wall thickening and pericholecystic fluid.$sca13$,
  $qua13$What is the most likely diagnosis?$qua13$,
  $opa13${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"acute-cholecystitis","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783291918174","qcScore":7.9,"slotIndex":13,"stepLevel":"step3","examNumber":9314,"generatedAt":"2026-07-05T22:52:56.686Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Acute cholecystitis","Pancreatitis (inflammation of the pancreas)","Appendicitis","Diverticulitis"],"taskCategory":"pharmacotherapy"}$opa13$,
  $kya13$Acute cholecystitis$kya13$,
  $exa13$Why this answer is correct
The patient's symptoms and ultrasound findings confirm acute cholecystitis.
Severe abdominal pain in the right upper quadrant is a hallmark symptom.
Fever and gallbladder wall thickening on ultrasound indicate inflammation.
Pericholecystic fluid suggests complications from gallbladder obstruction.
In practice: In practice, recognizing acute cholecystitis early is crucial for timely surgical intervention, which can prevent complications like perforation or abscess formation.
Why the other options are wrong

Pancreatitis (inflammation of the pancreas)
Trap: Students may confuse the abdominal pain location, thinking it could be pancreatitis.
Why it fails here: Pancreatitis (inflammation of the pancreas) typically presents with epigastric pain that may radiate to the back, not localized right upper quadrant pain.
Remember: Understanding the specific location of pain helps differentiate between abdominal conditions.

Appendicitis
Trap: Some may incorrectly associate right upper quadrant pain with appendicitis due to its proximity.
Why it fails here: Appendicitis usually presents with right lower quadrant pain and tenderness, which is not the case here.
Remember: Recognizing the typical pain patterns is essential for accurate diagnosis.

Diverticulitis
Trap: Students might think of diverticulitis due to abdominal pain, overlooking the pain's location.
Why it fails here: Diverticulitis typically presents with left lower quadrant pain, which is inconsistent with this patient's symptoms.
Remember: Differentiating pain locations is key to diagnosing gastrointestinal conditions accurately.
Key takeaway
When a patient presents with right upper quadrant pain, fever, and ultrasound findings of gallbladder inflammation, think acute cholecystitis first.

Memory hook: Remember: RUQ pain + fever + gallbladder issues = cholecystitis!$exa13$,
  2,
  $dma13$gastrointestinal$dma13$,
  $tpa13$acute-cholecystitis$tpa13$,
  $sua13$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua13$,
  $sla13$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla13$,
  $sqa13$Findings suggestive of acute calculous cholecystitis include a thickened gallbladder wall >3 mm, edema, pericholecystic fluid, and the presence of gallstones.$sqa13$,
  $cha13$4c7362a868c5bef64f9d02dab90d440f1f0b949a2249f166bae98ebc7d6dab6e$cha13$,
  true,
  $rfa13$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa13$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida14$cmr8hrrl1023g1ylodd9v80i5$ida14$,
  $fxa14$not_single_best|rationale$fxa14$,
  $sca14$A 68-year-old woman presents to the emergency department with shortness of breath and a productive cough for the past three days. She has a history of COPD and is currently on tiotropium and albuterol. On examination, her respiratory rate is 24 breaths/min, oxygen saturation is 94% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Laboratory tests reveal a white blood cell count of 12,000/mm³ with a left shift.$sca14$,
  $qua14$What is the next best step in management?$qua14$,
  $opa14${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-initial-workup","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783297789167","qcScore":8.2,"slotIndex":16,"stepLevel":"step3","examNumber":9324,"generatedAt":"2026-07-06T00:32:50.590Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Initiate systemic corticosteroids","Start intravenous antibiotics (give antibiotics through a vein)","Administer nebulized bronchodilators","Provide supplemental oxygen"],"taskCategory":"clinical-intervention"}$opa14$,
  $kya14$Administer nebulized bronchodilators$kya14$,
  $exa14$Why this answer is correct
Administering nebulized bronchodilators is the best immediate step for this COPD exacerbation.
Bronchodilators relieve bronchospasm quickly, improving airflow.
This patient shows signs of an acute exacerbation of COPD with wheezing, and the oxygen saturation does not require supplemental oxygen.
Immediate treatment focuses on symptom relief before addressing other issues.
In practice: In practice, rapid bronchodilation can significantly improve a patient's respiratory status, making it easier for them to breathe and reducing the risk of further complications.
Why the other options are wrong

Initiate systemic corticosteroids
Trap: Students may think corticosteroids are always the first step in managing COPD exacerbations.
Why it fails here: While corticosteroids are important for reducing inflammation, they are not the immediate priority in this acute setting where bronchodilation is needed first.
Remember: This highlights the importance of addressing acute symptoms before starting anti-inflammatory treatments.

Start intravenous antibiotics (give antibiotics through a vein)
Trap: There may be an assumption that antibiotics are necessary for all respiratory exacerbations.
Why it fails here: Antibiotics are used when sputum is purulent along with increased dyspnea or sputum volume. A productive cough without purulence does not meet that bar, a chest infiltrate is not required for a bacterial exacerbation, and intravenous antibiotics are not the default.
Remember: This emphasizes the need to differentiate between infection and exacerbation in COPD management.

Provide supplemental oxygen
Trap: Students might believe that oxygen is the primary treatment for hypoxia in respiratory distress.
Why it fails here: The saturation is 94%, above the 88% to 92% COPD oxygen target, so supplemental oxygen is not the next step. Bronchodilators treat the wheeze.
Remember: This illustrates the importance of treating the root cause of symptoms rather than just the symptoms themselves.
Key takeaway
When managing a COPD exacerbation, prioritize bronchodilator therapy to relieve bronchospasm first.

Memory hook: Think 'B for Bronchodilator, B for Breathing' — focus on bronchodilation to improve airflow.

The board takeaway is that Administer nebulized bronchodilators is the single best answer, and the rationale above is what the student should leave with. GOLD 2024 COPD guidance: treat an acute exacerbation with an inhaled short-acting bronchodilator and add a systemic corticosteroid.$exa14$,
  2,
  $dma14$respiratory-renal$dma14$,
  $tpa14$copd-asthma-exacerbation$tpa14$,
  $sua14$https://www.nature.com/articles/s41533-023-00349-4$sua14$,
  $sla14$https://www.nature.com/articles/s41533-023-00349-4$sla14$,
  $sqa14$Supplemental oxygen for hypoxemia should be titrated to a target saturation of 88-92%.$sqa14$,
  $cha14$c0a8e91ad904d0cda937210371828b79fcc1384e7812351e28878d7ccba420db$cha14$,
  true,
  $rfa14$[{"label": "https://www.nature.com/articles/s41533-023-00349-4", "url": "https://www.nature.com/articles/s41533-023-00349-4"}]$rfa14$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida15$cmr8nmka500xd1ygi1z93ogd8$ida15$,
  $fxa15$wrong_key|wrong_blueprint$fxa15$,
  $sca15$A 50-year-old woman with hypertension, type 2 diabetes, and hyperlipidemia presents to the clinic for routine follow-up. She is currently taking lisinopril and atorvastatin 10 mg daily. Her blood pressure is 130/80 mm Hg, and her lipid panel shows LDL 130 mg/dL.$sca15$,
  $qua15$What is the next best step in management?$qua15$,
  $opa15${"kind":"ethics","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"statin-intensification","physicianTask":"interpretation","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783307689930","qcScore":8.2,"slotIndex":45,"stepLevel":"step3","examNumber":9311,"generatedAt":"2026-07-06T03:16:00.694Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Increase atorvastatin dosage","Add ezetimibe","Start a low-dose aspirin regimen","Refer to a cardiologist"],"taskCategory":"interpretation"}$opa15$,
  $kya15$Increase atorvastatin dosage$kya15$,
  $exa15$Increase the atorvastatin dose. She is 50, has diabetes and hypertension, and is taking atorvastatin 10 mg, which is moderate intensity, while the LDL cholesterol is still 130 mg/dL. For diabetes at higher risk, including age 50 to 75 years or multiple risk factors, a high-intensity statin such as atorvastatin 40 to 80 mg is reasonable before a nonstatin is added. Ezetimibe is added only after a maximally tolerated statin leaves LDL cholesterol above the threshold for that risk group. Routine primary-prevention aspirin is not the next step, and this decision stays in primary care.$exa15$,
  2,
  $dma15$cardiovascular$dma15$,
  $tpa15$statin-intensification$tpa15$,
  $sua15$https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000625$sua15$,
  $sla15$https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000625$sla15$,
  $sqa15$In patients with diabetes mellitus at higher risk, especially those with multiple risk factors or those 50 to 75 years of age, it is reasonable to use a high-intensity statin to reduce the LDL-C level by ≥50%.$sqa15$,
  $cha15$a98f006ca5d1d5fd8018f1f517b9d7c3d2c01e2977e9929e9cbfcc231897a24f$cha15$,
  true,
  $rfa15$[{"label": "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000625", "url": "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000625"}]$rfa15$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida16$cmr97hzdz003o1ywy8qq1qi38$ida16$,
  $fxa16$wrong_blueprint$fxa16$,
  NULL,
  $qua16$A 30-year-old man comes to the clinic because of fever, sore throat, and fatigue for 1 week. He reports recent unprotected sexual intercourse. Examination shows posterior cervical lymphadenopathy and a rash on his trunk. A laboratory HIV-1/2 antigen/antibody test is reactive, and plasma HIV RNA is 450,000 copies/mL. His CD4 count is 450/mm³. Baseline laboratory studies, including HIV genotype resistance testing, have been drawn and results are pending. He wants to begin treatment. Which of the following is the most appropriate next step in management?$qua16$,
  $opa16${"options":["Start antiretroviral therapy now","Wait for the genotype results before starting antiretroviral therapy","Start trimethoprim-sulfamethoxazole prophylaxis against Pneumocystis","Defer antiretroviral therapy until the CD4 count falls below 350/mm³"],"blueprintTopic":"hiv-antiretroviral-therapy","blueprintSystem":"blood-lymph-immune"}$opa16$,
  $kya16$Start antiretroviral therapy now$kya16$,
  $exa16$Correct answer: A. Start antiretroviral therapy now. HIV infection is confirmed by a reactive antigen/antibody test and a high HIV RNA level during an acute retroviral syndrome; antiretroviral therapy is recommended for everyone with HIV and should begin immediately after diagnosis once baseline labs are drawn, which shortens the time to viral suppression and prevents transmission. Why the other options are wrong: B. Treatment does not need to wait for genotype results; an initial regimen can be started and adjusted if resistance is found. C. Pneumocystis prophylaxis is indicated when the CD4 count is low, and his CD4 count of 450/mm³ does not require it. D. Antiretroviral therapy is recommended at any CD4 count; deferring it until the count falls exposes him to disease progression and ongoing transmission.$exa16$,
  5,
  $dma16$blood-lymph-immune$dma16$,
  $tpa16$hiv-antiretroviral-therapy$tpa16$,
  $sua16$https://www.merckmanuals.com/professional/infectious-diseases/human-immunodeficiency-virus-hiv/human-immunodeficiency-virus-hiv-infection$sua16$,
  $sla16$https://www.merckmanuals.com/professional/infectious-diseases/human-immunodeficiency-virus-hiv/human-immunodeficiency-virus-hiv-infection$sla16$,
  $sqa16$Treatment with ART is recommended for all patients, because disease-related complications can occur even in untreated patients with high CD4 counts.$sqa16$,
  $cha16$4be124eaff217636cbdf6988cccafeb484dd01db6a316bed82af82cd1a083d11$cha16$,
  true,
  $rfa16$[{"label": "https://www.merckmanuals.com/professional/infectious-diseases/human-immunodeficiency-virus-hiv/human-immunodeficiency-virus-hiv-infection", "url": "https://www.merckmanuals.com/professional/infectious-diseases/human-immunodeficiency-virus-hiv/human-immunodeficiency-virus-hiv-infection"}]$rfa16$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida17$cmru32lpi003z1y7wibr7nsly$ida17$,
  $fxa17$wrong_blueprint$fxa17$,
  $sca17$A 65-year-old woman presents to the emergency department with severe abdominal pain and vomiting. Her medical history includes hypertension and type 2 diabetes. On examination, she has a blood pressure of 90/60 mm Hg, a heart rate of 110 bpm, and tenderness in the right upper quadrant. Laboratory tests reveal an elevated white blood cell count of 15,000/mm³ and a bilirubin level of 3.2 mg/dL. An abdominal ultrasound shows gallstones and a thickened gallbladder wall.$sca17$,
  $qua17$What is the next best step in management?$qua17$,
  $opa17${"kind":"ethics","stepLevel":"step3","blueprintSystem":"gastrointestinal","blueprintTopic":"acute-cholecystitis","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784603307639","examNumber":9302,"slotIndex":23,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T03:13:01.232Z"},"options":["Administer intravenous fluids and antibiotics","Perform an urgent cholecystectomy","Obtain a computed tomography scan of the abdomen","Start oral analgesics and observe"]}$opa17$,
  $kya17$Administer intravenous fluids and antibiotics$kya17$,
  $exa17$The correct answer is to administer intravenous fluids and antibiotics. This patient is presenting with signs of acute cholecystitis, indicated by her abdominal pain, elevated white blood cell count, and imaging findings. Immediate management involves stabilizing the patient with fluids and starting broad-spectrum antibiotics before surgical intervention. Performing an urgent cholecystectomy is a common next step but is typically done after initial stabilization. A CT scan is not necessary as the diagnosis is already clear from the ultrasound. Starting oral analgesics and observing is inappropriate given her unstable vital signs and potential for sepsis.

Clinical reasoning: Assess the patient's presentation of abdominal pain, hypotension, and leukocytosis to recognize acute cholecystitis. Analyze the need for stabilization before any surgical decision and integrate the urgency of treating potential sepsis.

Why other options are incorrect:
• Perform an urgent cholecystectomy: This option fails because surgical intervention should follow stabilization with fluids and antibiotics, especially in the context of hypotension.
• Obtain a computed tomography scan of the abdomen: This distractor is incorrect as the diagnosis of acute cholecystitis is already established with ultrasound; a CT scan would not change management.
• Start oral analgesics and observe: This option is a common trap as it underestimates the severity of the patient's condition; she requires urgent intervention, not observation.$exa17$,
  3,
  $dma17$gastrointestinal$dma17$,
  $tpa17$acute-cholecystitis$tpa17$,
  $sua17$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua17$,
  $sla17$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla17$,
  $sqa17$Initial management of acute cholecystitis typically involves intravenous fluid resuscitation and prompt initiation of broad-spectrum antibiotics effective against gram-negative rods and anaerobes.$sqa17$,
  $cha17$a6a49e1feae5eb436b03d3852430cca13999db1206197003ff5f0644a742bcff$cha17$,
  true,
  $rfa17$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa17$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida18$cmru8bdlj006u1yd6qfboiua1$ida18$,
  $fxa18$wrong_blueprint$fxa18$,
  $sca18$A 28-year-old woman presents to the clinic for a routine check-up. She is asymptomatic, but her family history is significant for breast cancer. She inquires about breast cancer screening recommendations. Her last mammogram was 2 years ago.$sca18$,
  $qua18$What is the most appropriate next step in management?$qua18$,
  $opa18${"options":["Schedule a mammogram","Perform a clinical breast exam","Discuss genetic testing","Advise her to perform self-breast exams"],"distractorRationale":{"Perform a clinical breast exam":"This option is incorrect as a clinical exam does not replace the need for mammography.","Discuss genetic testing":"This option is incorrect because genetic testing is not the immediate priority without further risk assessment.","Advise her to perform self-breast exams":"This option is incorrect as self-exams do not replace the need for regular mammograms."},"clinicalReasoning":"Assess the patient's risk factors and current screening guidelines, analyze the need for mammography, and integrate this information to conclude that scheduling a mammogram is the best next step.","kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"brca-risk-assessment","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784612400875","examNumber":9303,"slotIndex":14,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-21T05:40:47.769Z"}}$opa18$,
  $kya18$Discuss genetic testing$kya18$,
  $exa18$3 is correct: at 28, with a family history of breast cancer and an unclear risk level, the next step is a familial risk assessment and a discussion of genetic counseling/testing (USPSTF BRCA recommendation). 1 (mammogram) is wrong because routine screening starts at 40 (USPSTF 2024) unless high risk is established. 2 (clinical breast exam) is wrong because it is not recommended as a screening method by USPSTF. 4 (self-exam) is wrong because routine self-exam teaching is not recommended.$exa18$,
  3,
  $dma18$reproductive-endocrine$dma18$,
  $tpa18$brca-risk-assessment$tpa18$,
  $sua18$https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/brca-related-cancer-risk-assessment-genetic-counseling-and-genetic-testing$sua18$,
  $sla18$https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/brca-related-cancer-risk-assessment-genetic-counseling-and-genetic-testing$sla18$,
  $sqa18$The USPSTF recommends that primary care clinicians assess women with a personal or family history of breast, ovarian, tubal, or peritoneal cancer or who have an ancestry associated with breast cancer susceptibility 1 and 2 (BRCA1/2) gene mutations with an appropriate brief familial risk assessment tool.$sqa18$,
  $cha18$c42eb3d555b2402db7d274d208321346629b63f31cee1b65517925bdc3bce837$cha18$,
  true,
  $rfa18$[{"label": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/brca-related-cancer-risk-assessment-genetic-counseling-and-genetic-testing", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/brca-related-cancer-risk-assessment-genetic-counseling-and-genetic-testing"}]$rfa18$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida19$cmrvwn0eg000g1ye864mcpcca$ida19$,
  $fxa19$template_artifact$fxa19$,
  $sca19$Abstract — Non-inferiority Trial Analysis
Source: USMLE Step 3
A pharmaceutical company conducted a non-inferiority trial comparing a new anticoagulant, Drug A, to a standard anticoagulant, Drug B, in preventing thromboembolic events in patients with atrial fibrillation. The trial enrolled 5,000 patients, with 2,500 patients in each group. The primary endpoint was the occurrence of thromboembolic events over a 1-year period. The results showed that Drug A had a 3.5% event rate, while Drug B had a 3.0% event rate. The pre-specified non-inferiority margin was set at 1.0%. The 95% confidence interval for the difference in event rates was -0.2% to 1.2%.$sca19$,
  $qua19$Based on the results of the trial, what can be concluded regarding the non-inferiority of Drug A compared to Drug B?$qua19$,
  $opa19${"stepLevel":"step3","kind":"abstract","abstract":{"title":"Non-inferiority Trial Analysis","source":"USMLE Step 3","body":"A pharmaceutical company conducted a non-inferiority trial comparing a new anticoagulant, Drug A, to a standard anticoagulant, Drug B, in preventing thromboembolic events in patients with atrial fibrillation. The trial enrolled 5,000 patients, with 2,500 patients in each group. The primary endpoint was the occurrence of thromboembolic events over a 1-year period. The results showed that Drug A had a 3.5% event rate, while Drug B had a 3.0% event rate. The pre-specified non-inferiority margin was set at 1.0%. The 95% confidence interval for the difference in event rates was -0.2% to 1.2%."},"structureIds":["lungs","nasal-concha-l"],"options":["Drug A is non-inferior to Drug B","Drug A is superior to Drug B","Drug A is inferior to Drug B","The trial results are inconclusive"]}$opa19$,
  $kya19$The trial results are inconclusive$kya19$,
  $exa19$4 is correct: the 95% CI for the difference (A minus B) is -0.2% to 1.2%; its upper bound exceeds the 1.0% non-inferiority margin, so non-inferiority is not shown, and because the CI includes 0, inferiority is not shown either, so the result is inconclusive (CONSORT). 1 (non-inferior) is wrong because the upper bound exceeds the margin. 2 (superior) is wrong because Drug A had MORE events (3.5% vs 3.0%) and the CI crosses 0. 3 (inferior) is wrong because the CI includes 0.$exa19$,
  3,
  $dma19$biostats-epi$dma19$,
  $tpa19$pharmaceutical-ads-abstracts$tpa19$,
  $sua19$https://www.fda.gov/regulatory-information/search-fda-guidance-documents/non-inferiority-clinical-trials$sua19$,
  $sla19$https://www.fda.gov/regulatory-information/search-fda-guidance-documents/non-inferiority-clinical-trials$sla19$,
  $sqa19$Non-Inferiority Clinical Trials$sqa19$,
  $cha19$03b190df1f8d3d23b7fa3036b709a75358054a274e02e20d32814948d343c521$cha19$,
  true,
  $rfa19$[{"label": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/non-inferiority-clinical-trials", "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/non-inferiority-clinical-trials"}]$rfa19$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida20$cmrvwtumd003r1ye85azdg38n$ida20$,
  $fxa20$wrong_blueprint|difficulty$fxa20$,
  $sca20$A 60-year-old male with a 40-pack-year smoking history presents to the outpatient clinic with a persistent cough and unintentional weight loss over the past 3 months. On examination, he exhibits digital clubbing and has a past medical history significant for hyperlipidemia. Vital signs are stable, but his symptoms raise concern for a serious pulmonary condition.$sca20$,
  $qua20$What is the next best step in management for this patient?$qua20$,
  $opa20${"options":["Order chest X-ray","Refer to pulmonology","Schedule a CT scan of the chest","Perform spirometry"],"blueprintTopic":"lung-cancer-workup"}$opa20$,
  $kya20$Order chest X-ray$kya20$,
  $exa20$Given the patient's significant smoking history, persistent cough, weight loss, and digital clubbing, there is a high suspicion for lung pathology, such as malignancy or interstitial lung disease. A chest X-ray is the most appropriate initial diagnostic step to evaluate for any masses or abnormalities. If the X-ray shows concerning findings, further imaging with a CT scan or referral to pulmonology may be warranted. Spirometry is not indicated at this stage as it does not address the immediate concern of potential malignancy.

Clinical reasoning: The patient's combination of risk factors and symptoms suggests a serious underlying lung condition. A chest X-ray is essential for initial evaluation before considering more invasive tests or specialist referrals.

Why other options are incorrect:
• Refer to pulmonology: While referral may be necessary later, it is premature without initial imaging to guide the referral.
• Schedule a CT scan of the chest: A CT scan is more sensitive but is not the first step; a chest X-ray should be performed first to assess for abnormalities.
• Perform spirometry: Spirometry is not appropriate at this stage as it does not provide information on potential malignancies or structural lung issues.$exa20$,
  3,
  $dma20$respiratory-renal$dma20$,
  $tpa20$lung-cancer-workup$tpa20$,
  $sua20$https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer$sua20$,
  $sla20$https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer$sla20$,
  $sqa20$Offer an urgent, direct access chest X-ray to assess for lung cancer in people aged 40 and over if they have 2 or more of the following unexplained symptoms, or if they have ever smoked and have 1 or more of the following unexplained symptoms.$sqa20$,
  $cha20$ba38545360a11efd0f2204d057af93174103666ec1d82c9ecdcdc0ac419bc991$cha20$,
  true,
  $rfa20$[{"label": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}]$rfa20$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida21$d77639ba-9867-476e-9203-348e45bfc80e$ida21$,
  $fxa21$template_artifact|difficulty$fxa21$,
  $sca21$A 45-year-old man is pulled from a house fire. He is hypotensive at 80/40 mm Hg, comatose, and the lactate is 16 mmol/L. Soot is in the mouth. Oxygen saturation is low and he is being ventilated. A plan waits for a cyanide level before any antidote and gives methylene blue.$sca21$,
  $qua21$Which plan is most appropriate?$qua21$,
  $opa21${"options":["Methylene blue as the cyanide antidote","A beta blocker for the hypotension","Hydroxocobalamin now, with continued oxygen","Wait for a confirmatory cyanide level","Naloxone alone for this smoke inhalation"],"blueprintSystem":"multisystem","taskCategory":"pharmacotherapy","blueprintTopic":"cyanide-hydroxocobalamin","kind":"vignette"}$opa21$,
  $kya21$Hydroxocobalamin now, with continued oxygen$kya21$,
  $exa21$Coma, shock, and a very high lactate after smoke inhalation are treated as cyanide poisoning. Hydroxocobalamin is given immediately, with oxygen. A send-out level must not delay the antidote. Methylene blue treats methemoglobinemia, not cyanide. Naloxone does not reverse cyanide. A beta blocker worsens shock.$exa21$,
  3,
  $dma21$multisystem$dma21$,
  $tpa21$cyanide-hydroxocobalamin$tpa21$,
  $sua21$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/carbon-monoxide-poisoning$sua21$,
  $sla21$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/carbon-monoxide-poisoning$sla21$,
  $sqa21$Treatment with hydroxocobalamin for cyanide exposure from a fire may interfere with measurement of carboxyhemoglobin.$sqa21$,
  $cha21$aca3a4338b703c6311ac31f78091ffeb20db9c42a7d7b2c1f04594ee5c671701$cha21$,
  true,
  $rfa21$[{"label": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/carbon-monoxide-poisoning", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/carbon-monoxide-poisoning"}]$rfa21$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida22$069e38d9-f232-4a5a-8ade-7e178a22ab40$ida22$,
  $fxa22$difficulty$fxa22$,
  $sca22$A 67-year-old man is brought from a meeting with palpitations that began this afternoon. He is pale and confused, and he reports crushing chest pain. The monitor shows atrial fibrillation at 164 beats per minute. Blood pressure is 78/50 mm Hg. The skin is cool. An electrocardiogram shows ST-segment depression. Onset of the arrhythmia is otherwise unknown. A colleague wants a transesophageal echocardiogram in the morning before any shock.$sca22$,
  $qua22$Which immediate plan is most appropriate?$qua22$,
  $opa22${"options":["Fibrinolytic therapy instead of treating the rhythm","A digoxin load and discharge","Delay cardioversion for a transesophageal echocardiogram tomorrow","Oral metoprolol and a clinic visit in three days","Synchronized cardioversion now"],"blueprintSystem":"cardiovascular","taskCategory":"clinical-intervention","blueprintTopic":"unstable-af-immediate-cardioversion","kind":"vignette"}$opa22$,
  $kya22$Synchronized cardioversion now$kya22$,
  $exa22$Hypotension, ischemic chest pain, and cool skin make this atrial fibrillation unstable, so synchronized cardioversion is immediate. A transesophageal echocardiogram tomorrow leaves an unstable patient in a harmful rhythm so that a clot search can be scheduled. Oral metoprolol and a delayed clinic visit do not treat shock. Digoxin loading is slow and does not fix ischemia and hypotension. Fibrinolysis treats coronary occlusion, not an unstable tachyarrhythmia whose next step is to restore a perfusing rhythm.$exa22$,
  2,
  $dma22$cardiovascular$dma22$,
  $tpa22$unstable-af-immediate-cardioversion$tpa22$,
  $sua22$https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673$sua22$,
  $sla22$https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673$sla22$,
  $sqa22$If hemodynamic instability is attributable to AF, electrical cardioversion should be performed immediately to restore sinus rhythm.$sqa22$,
  $cha22$5f4daeb94e326b42b970b7bd88f4bdbad249f69d48befe1f0c684f333ef64f93$cha22$,
  true,
  $rfa22$[{"label": "https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673", "url": "https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673"}]$rfa22$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida23$b2x378f7323ee32a69e3ae61b26$ida23$,
  $fxa23$wrong_blueprint$fxa23$,
  $sca23$A 24-year-old man has four bloody stools a day, no fever, and a pulse of 80 bpm. Hemoglobin is 13 g/dL. Colonoscopy shows continuous inflammation from the rectum to the sigmoid and a normal right colon. He is eating. He has not been treated before.$sca23$,
  $qua23$Which drug is the most appropriate next step?$qua23$,
  $opa23${"options":["Mesalamine","Intravenous methylprednisolone","Infliximab first","An antibiotic as the only drug","Loperamide alone"],"blueprintTopic":"ulcerative-colitis","blueprintSystem":"gastrointestinal"}$opa23$,
  $kya23$Mesalamine$kya23$,
  $exa23$Mild ulcerative colitis is treated with mesalamine, and systemic steroids are for disease that mesalamine does not control. Mesalamine is the ACG first drug for this mild, limited colitis. Intravenous methylprednisolone is for severe disease with systemic toxicity he does not have. Infliximab first is for moderate to severe disease that has failed simpler drugs. An antibiotic as the only drug does not treat ulcerative colitis. Loperamide alone can mask worsening and is not the treatment.$exa23$,
  4,
  $dma23$gastrointestinal$dma23$,
  $tpa23$ulcerative-colitis$tpa23$,
  $sua23$https://gi.org/journals-publications/ebgi/alkazzi_aug2025/$sua23$,
  $sla23$https://gi.org/journals-publications/ebgi/alkazzi_aug2025/$sla23$,
  $sqa23$In patients with mildly to moderately active left-sided UC, we suggest rectal 5-ASA enemas at a dose of at least 1 g/daily combined with oral 5-ASA at a dose of at least 2.0 g/daily compared with oral 5-ASA therapy alone for induction of remission.$sqa23$,
  $cha23$5253695464a31a36bef0e3185cc873425703d86d3174b116702e5c8876598614$cha23$,
  true,
  $rfa23$[{"label": "https://gi.org/journals-publications/ebgi/alkazzi_aug2025/", "url": "https://gi.org/journals-publications/ebgi/alkazzi_aug2025/"}]$rfa23$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida24$b8xf777beab51f3bf71159b91c1$ida24$,
  $fxa24$template_artifact|wrong_blueprint|difficulty$fxa24$,
  $sca24$A 62-year-old patient arrives with a blood pressure of 230/130 mm Hg and a mild headache. Over one hour the pressure is driven to 120/70 mm Hg. He becomes confused and weak on one side. A classmate calls 120/70 a successful normalization. There is no hemorrhage on the scan.$sca24$,
  $qua24$Why did a normal number make him worse?$qua24$,
  $opa24${"options":["No hemorrhage means the new weakness is unrelated to the pressure drop","Mild headache means cerebral autoregulation has already reset downward","One hour is a slow drop for a pressure that started at 230/130 mm Hg","The brain was perfused at the high pressure, and the sudden normal left it underfilled","A pressure of 120/70 mm Hg is below what any brain can tolerate in health"],"blueprintTopic":"hypertensive-emergency"}$opa24$,
  $kya24$The brain was perfused at the high pressure, and the sudden normal left it underfilled$kya24$,
  $exa24$Confusion worsened when the pressure was driven to normal, because the brain had reset its autoregulation to the high pressure. The brain was perfused at the high pressure, and the sudden normal left it underfilled. A pressure of 120/70 mm Hg is below what any brain can tolerate is too low for a brain that had shifted its curve. No hemorrhage means the new weakness is unrelated to the pressure drop is hypoperfusion. Mild headache means autoregulation has already reset downward had reset upward. One hour is a slow drop for a pressure of 230/130 mm Hg is a fast drop.$exa24$,
  3,
  $dma24$cardiovascular$dma24$,
  $tpa24$hypertensive-emergency$tpa24$,
  $sua24$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies$sua24$,
  $sla24$https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies$sla24$,
  $sqa24$Hypertensive encephalopathy may involve a failure of cerebral autoregulation of blood flow.$sqa24$,
  $cha24$b5ffeb3c15832ddcfea03d9c1f010bdf956b1f89f36e1ee59f78a28f207e6e3e$cha24$,
  true,
  $rfa24$[{"label": "https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/hypertension/hypertensive-emergencies"}]$rfa24$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida25$cmpnjjcsd09cv1ymxcxoj7f5g$ida25$,
  $fxa25$difficulty$fxa25$,
  NULL,
  $qua25$A 63-year-old woman is brought to the emergency department after her husband found her with right-sided weakness and slurred speech. He did not see the onset, and he cannot say when she was last known to be well. She has atrial fibrillation and is not anticoagulated. Blood pressure is 178/96 mm Hg, heart rate is 88 and irregular, and oxygen saturation is 98% on room air. Examination shows a right hemiparesis, a right facial droop, and dysarthria (NIH Stroke Scale 12). Glucose is 142 mg/dL and INR is 1.1. Noncontrast head CT shows no hemorrhage.

What is the next best step?$qua25$,
  $opa25${"kind": "exhibit", "media": [{"id": "ecg-afib-schematic", "alt": "Schematic ECG showing atrial fibrillation with irregular RR intervals", "url": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20310%22%20role%3D%22img%22%20aria-label%3D%22Atrial%20fibrillation%20with%20irregular%20RR%20intervals%20and%20no%20P%20waves%22%3E%0A%20%20%0A%20%20%3Crect%20width%3D%22760%22%20height%3D%2256%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%226%22%20height%3D%2256%22%20fill%3D%22%2338bdf8%22%2F%3E%0A%20%20%3Ctext%20x%3D%2220%22%20y%3D%2224%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22800%22%20fill%3D%22%23f8fafc%22%3EECG%20%E2%80%94%20atrial%20fibrillation%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%2220%22%20y%3D%2244%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20fill%3D%22%2394a3b8%22%3EIrregularly%20irregular%20%C2%B7%20no%20discrete%20P%20waves%3C%2Ftext%3E%0A%20%20%3Crect%20x%3D%22642%22%20y%3D%2216%22%20width%3D%22100%22%20height%3D%2224%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%23334155%22%2F%3E%0A%20%20%3Ctext%20x%3D%22692%22%20y%3D%2232%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2210%22%20font-weight%3D%22700%22%20letter-spacing%3D%220.06em%22%20fill%3D%22%2394a3b8%22%3EECG%3C%2Ftext%3E%0A%20%20%3Crect%20x%3D%220%22%20y%3D%2256%22%20width%3D%22760%22%20height%3D%22186%22%20fill%3D%22%23fff1f2%22%2F%3E%0A%3Cg%20aria-hidden%3D%22true%22%3E%3Cline%20x1%3D%220%22%20y1%3D%2256%22%20x2%3D%220%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%226%22%20y1%3D%2256%22%20x2%3D%226%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2212%22%20y1%3D%2256%22%20x2%3D%2212%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2218%22%20y1%3D%2256%22%20x2%3D%2218%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2256%22%20x2%3D%2224%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2230%22%20y1%3D%2256%22%20x2%3D%2230%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2236%22%20y1%3D%2256%22%20x2%3D%2236%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2242%22%20y1%3D%2256%22%20x2%3D%2242%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2248%22%20y1%3D%2256%22%20x2%3D%2248%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2254%22%20y1%3D%2256%22%20x2%3D%2254%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%2256%22%20x2%3D%2260%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2266%22%20y1%3D%2256%22%20x2%3D%2266%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2272%22%20y1%3D%2256%22%20x2%3D%2272%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2278%22%20y1%3D%2256%22%20x2%3D%2278%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2284%22%20y1%3D%2256%22%20x2%3D%2284%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2290%22%20y1%3D%2256%22%20x2%3D%2290%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2296%22%20y1%3D%2256%22%20x2%3D%2296%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22102%22%20y1%3D%2256%22%20x2%3D%22102%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22108%22%20y1%3D%2256%22%20x2%3D%22108%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22114%22%20y1%3D%2256%22%20x2%3D%22114%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%2256%22%20x2%3D%22120%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22126%22%20y1%3D%2256%22%20x2%3D%22126%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22132%22%20y1%3D%2256%22%20x2%3D%22132%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22138%22%20y1%3D%2256%22%20x2%3D%22138%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22144%22%20y1%3D%2256%22%20x2%3D%22144%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22150%22%20y1%3D%2256%22%20x2%3D%22150%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22156%22%20y1%3D%2256%22%20x2%3D%22156%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22162%22%20y1%3D%2256%22%20x2%3D%22162%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22168%22%20y1%3D%2256%22%20x2%3D%22168%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22174%22%20y1%3D%2256%22%20x2%3D%22174%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%2256%22%20x2%3D%22180%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22186%22%20y1%3D%2256%22%20x2%3D%22186%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22192%22%20y1%3D%2256%22%20x2%3D%22192%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22198%22%20y1%3D%2256%22%20x2%3D%22198%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22204%22%20y1%3D%2256%22%20x2%3D%22204%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22210%22%20y1%3D%2256%22%20x2%3D%22210%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22216%22%20y1%3D%2256%22%20x2%3D%22216%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22222%22%20y1%3D%2256%22%20x2%3D%22222%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22228%22%20y1%3D%2256%22%20x2%3D%22228%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22234%22%20y1%3D%2256%22%20x2%3D%22234%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%2256%22%20x2%3D%22240%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22246%22%20y1%3D%2256%22%20x2%3D%22246%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22252%22%20y1%3D%2256%22%20x2%3D%22252%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22258%22%20y1%3D%2256%22%20x2%3D%22258%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22264%22%20y1%3D%2256%22%20x2%3D%22264%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22270%22%20y1%3D%2256%22%20x2%3D%22270%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22276%22%20y1%3D%2256%22%20x2%3D%22276%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22282%22%20y1%3D%2256%22%20x2%3D%22282%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22288%22%20y1%3D%2256%22%20x2%3D%22288%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22294%22%20y1%3D%2256%22%20x2%3D%22294%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%2256%22%20x2%3D%22300%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22306%22%20y1%3D%2256%22%20x2%3D%22306%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22312%22%20y1%3D%2256%22%20x2%3D%22312%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22318%22%20y1%3D%2256%22%20x2%3D%22318%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22324%22%20y1%3D%2256%22%20x2%3D%22324%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22330%22%20y1%3D%2256%22%20x2%3D%22330%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22336%22%20y1%3D%2256%22%20x2%3D%22336%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22342%22%20y1%3D%2256%22%20x2%3D%22342%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22348%22%20y1%3D%2256%22%20x2%3D%22348%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22354%22%20y1%3D%2256%22%20x2%3D%22354%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22360%22%20y1%3D%2256%22%20x2%3D%22360%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22366%22%20y1%3D%2256%22%20x2%3D%22366%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22372%22%20y1%3D%2256%22%20x2%3D%22372%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22378%22%20y1%3D%2256%22%20x2%3D%22378%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22384%22%20y1%3D%2256%22%20x2%3D%22384%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22390%22%20y1%3D%2256%22%20x2%3D%22390%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22396%22%20y1%3D%2256%22%20x2%3D%22396%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22402%22%20y1%3D%2256%22%20x2%3D%22402%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22408%22%20y1%3D%2256%22%20x2%3D%22408%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22414%22%20y1%3D%2256%22%20x2%3D%22414%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22420%22%20y1%3D%2256%22%20x2%3D%22420%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22426%22%20y1%3D%2256%22%20x2%3D%22426%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22432%22%20y1%3D%2256%22%20x2%3D%22432%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22438%22%20y1%3D%2256%22%20x2%3D%22438%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22444%22%20y1%3D%2256%22%20x2%3D%22444%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22450%22%20y1%3D%2256%22%20x2%3D%22450%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22456%22%20y1%3D%2256%22%20x2%3D%22456%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22462%22%20y1%3D%2256%22%20x2%3D%22462%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22468%22%20y1%3D%2256%22%20x2%3D%22468%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22474%22%20y1%3D%2256%22%20x2%3D%22474%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22480%22%20y1%3D%2256%22%20x2%3D%22480%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22486%22%20y1%3D%2256%22%20x2%3D%22486%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22492%22%20y1%3D%2256%22%20x2%3D%22492%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22498%22%20y1%3D%2256%22%20x2%3D%22498%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22504%22%20y1%3D%2256%22%20x2%3D%22504%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22510%22%20y1%3D%2256%22%20x2%3D%22510%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22516%22%20y1%3D%2256%22%20x2%3D%22516%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22522%22%20y1%3D%2256%22%20x2%3D%22522%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22528%22%20y1%3D%2256%22%20x2%3D%22528%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22534%22%20y1%3D%2256%22%20x2%3D%22534%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22540%22%20y1%3D%2256%22%20x2%3D%22540%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22546%22%20y1%3D%2256%22%20x2%3D%22546%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22552%22%20y1%3D%2256%22%20x2%3D%22552%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22558%22%20y1%3D%2256%22%20x2%3D%22558%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22564%22%20y1%3D%2256%22%20x2%3D%22564%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22570%22%20y1%3D%2256%22%20x2%3D%22570%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22576%22%20y1%3D%2256%22%20x2%3D%22576%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22582%22%20y1%3D%2256%22%20x2%3D%22582%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22588%22%20y1%3D%2256%22%20x2%3D%22588%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22594%22%20y1%3D%2256%22%20x2%3D%22594%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22600%22%20y1%3D%2256%22%20x2%3D%22600%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22606%22%20y1%3D%2256%22%20x2%3D%22606%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22612%22%20y1%3D%2256%22%20x2%3D%22612%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22618%22%20y1%3D%2256%22%20x2%3D%22618%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22624%22%20y1%3D%2256%22%20x2%3D%22624%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22630%22%20y1%3D%2256%22%20x2%3D%22630%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22636%22%20y1%3D%2256%22%20x2%3D%22636%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22642%22%20y1%3D%2256%22%20x2%3D%22642%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22648%22%20y1%3D%2256%22%20x2%3D%22648%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22654%22%20y1%3D%2256%22%20x2%3D%22654%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22660%22%20y1%3D%2256%22%20x2%3D%22660%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22666%22%20y1%3D%2256%22%20x2%3D%22666%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22672%22%20y1%3D%2256%22%20x2%3D%22672%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22678%22%20y1%3D%2256%22%20x2%3D%22678%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22684%22%20y1%3D%2256%22%20x2%3D%22684%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22690%22%20y1%3D%2256%22%20x2%3D%22690%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22696%22%20y1%3D%2256%22%20x2%3D%22696%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22702%22%20y1%3D%2256%22%20x2%3D%22702%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22708%22%20y1%3D%2256%22%20x2%3D%22708%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22714%22%20y1%3D%2256%22%20x2%3D%22714%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22720%22%20y1%3D%2256%22%20x2%3D%22720%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22726%22%20y1%3D%2256%22%20x2%3D%22726%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22732%22%20y1%3D%2256%22%20x2%3D%22732%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22738%22%20y1%3D%2256%22%20x2%3D%22738%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22744%22%20y1%3D%2256%22%20x2%3D%22744%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22750%22%20y1%3D%2256%22%20x2%3D%22750%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22756%22%20y1%3D%2256%22%20x2%3D%22756%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2256%22%20x2%3D%22760%22%20y2%3D%2256%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2262%22%20x2%3D%22760%22%20y2%3D%2262%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2268%22%20x2%3D%22760%22%20y2%3D%2268%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2274%22%20x2%3D%22760%22%20y2%3D%2274%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2280%22%20x2%3D%22760%22%20y2%3D%2280%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2286%22%20x2%3D%22760%22%20y2%3D%2286%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2292%22%20x2%3D%22760%22%20y2%3D%2292%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2298%22%20x2%3D%22760%22%20y2%3D%2298%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22104%22%20x2%3D%22760%22%20y2%3D%22104%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22110%22%20x2%3D%22760%22%20y2%3D%22110%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22116%22%20x2%3D%22760%22%20y2%3D%22116%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22122%22%20x2%3D%22760%22%20y2%3D%22122%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22128%22%20x2%3D%22760%22%20y2%3D%22128%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22134%22%20x2%3D%22760%22%20y2%3D%22134%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22140%22%20x2%3D%22760%22%20y2%3D%22140%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22146%22%20x2%3D%22760%22%20y2%3D%22146%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22152%22%20x2%3D%22760%22%20y2%3D%22152%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22158%22%20x2%3D%22760%22%20y2%3D%22158%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22164%22%20x2%3D%22760%22%20y2%3D%22164%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22170%22%20x2%3D%22760%22%20y2%3D%22170%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22176%22%20x2%3D%22760%22%20y2%3D%22176%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22182%22%20x2%3D%22760%22%20y2%3D%22182%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22188%22%20x2%3D%22760%22%20y2%3D%22188%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22194%22%20x2%3D%22760%22%20y2%3D%22194%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22200%22%20x2%3D%22760%22%20y2%3D%22200%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22206%22%20x2%3D%22760%22%20y2%3D%22206%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22212%22%20x2%3D%22760%22%20y2%3D%22212%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22218%22%20x2%3D%22760%22%20y2%3D%22218%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22224%22%20x2%3D%22760%22%20y2%3D%22224%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22230%22%20x2%3D%22760%22%20y2%3D%22230%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22236%22%20x2%3D%22760%22%20y2%3D%22236%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22242%22%20x2%3D%22760%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3C%2Fg%3E%0A%20%20%0A%20%20%3Cpath%20d%3D%22M18%20205%20h10%20v-20%20h10%20v40%20h10%20v-20%20h10%22%20fill%3D%22none%22%20stroke%3D%22%230f172a%22%20stroke-width%3D%221.8%22%2F%3E%0A%20%20%3Ctext%20x%3D%2218%22%20y%3D%22233%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%2364748b%22%3E25%20mm%2Fs%3C%2Ftext%3E%0A%0A%20%20%3C!--%20Fibrillatory%20baseline%20%2B%20irregular%20QRS%20--%3E%0A%20%20%3Cpath%20d%3D%22M70%20200%0A%20%20%20%20Q78%20192%2086%20200%20Q94%20208%20102%20199%20Q110%20191%20118%20201%0A%20%20%20%20L128%20118%20L142%20252%20L154%20200%0A%20%20%20%20Q166%20190%20178%20202%20Q190%20210%20205%20198%20Q218%20188%20232%20201%20Q244%20208%20258%20197%0A%20%20%20%20L270%20112%20L285%20255%20L298%20200%0A%20%20%20%20Q318%20188%20340%20204%20Q360%20212%20378%20196%20Q392%20188%20410%20202%20Q422%20210%20438%20198%0A%20%20%20%20L450%20120%20L465%20250%20L478%20200%0A%20%20%20%20Q500%20188%20530%20204%20Q555%20214%20575%20192%20Q590%20186%20608%20200%0A%20%20%20%20L620%20115%20L635%20252%20L648%20200%0A%20%20%20%20Q665%20190%20685%20202%20Q702%20210%20720%20198%20Q735%20190%20748%20200%22%0A%20%20%20%20fill%3D%22none%22%20stroke%3D%22%230f172a%22%20stroke-width%3D%222.5%22%20stroke-linejoin%3D%22round%22%20stroke-linecap%3D%22round%22%2F%3E%0A%0A%20%20%3C!--%20RR%20brackets%20ABOVE%20the%20strip%2C%20clear%20of%20footer%20--%3E%0A%20%20%3Cline%20x1%3D%22142%22%20y1%3D%2278%22%20x2%3D%22285%22%20y2%3D%2278%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%223%22%2F%3E%0A%20%20%3Cline%20x1%3D%22142%22%20y1%3D%2274%22%20x2%3D%22142%22%20y2%3D%2282%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2274%22%20x2%3D%22285%22%20y2%3D%2282%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ctext%20x%3D%22214%22%20y%3D%2272%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%231d4ed8%22%3Elonger%20RR%3C%2Ftext%3E%0A%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2298%22%20x2%3D%22465%22%20y2%3D%2298%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%223%22%2F%3E%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2294%22%20x2%3D%22285%22%20y2%3D%22102%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22465%22%20y1%3D%2294%22%20x2%3D%22465%22%20y2%3D%22102%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ctext%20x%3D%22375%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%23b91c1c%22%3Eshorter%20RR%3C%2Ftext%3E%0A%0A%20%20%0A%20%20%3Crect%20x%3D%22500%22%20y%3D%22230%22%20width%3D%22156%22%20height%3D%2226%22%20rx%3D%227%22%20fill%3D%22%23fef2f2%22%20stroke%3D%22%23f87171%22%20stroke-width%3D%221.5%22%2F%3E%0A%20%20%3Ctext%20x%3D%22578%22%20y%3D%22247%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%23991b1b%22%3ENo%20P%20waves%20%C2%B7%20f%20waves%3C%2Ftext%3E%0A%20%20%0A%20%20%3Crect%20x%3D%2212%22%20y%3D%22278%22%20width%3D%22736%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22%23f1f5f9%22%20stroke%3D%22%23e2e8f0%22%2F%3E%0A%20%20%3Ctext%20x%3D%2224%22%20y%3D%22296%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22600%22%20fill%3D%22%230f172a%22%3EIrregularly%20irregular%20%2B%20absent%20P%20waves%20%3D%20AFib%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22736%22%20y%3D%22296%22%20text-anchor%3D%22end%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%2394a3b8%22%3EAnyExamEasy%3C%2Ftext%3E%0A%3C%2Fsvg%3E", "kind": "ecg", "topics": ["atrial-fibrillation", "arrhythmias", "ecg-interpretation"], "caption": "AFib — irregularly irregular, no P waves", "license": "AnyExamEasy original educational SVG", "reviewedAt": "2026-09-07", "sourceNote": "Teaching strip — not a patient tracing", "organSystem": "cardiovascular", "reviewStatus": "approved"}], "options": ["Determine the time last known well before any thrombolytic or thrombectomy decision", "Give intravenous alteplase now because the CT shows no hemorrhage", "Start aspirin and defer vessel imaging for 24 hours", "Lower systolic blood pressure below 120 millimeters of mercury before a reperfusion decision", "Perform a lumbar puncture before treatment"], "blueprintTopic": "stroke-management", "generationMeta": {"rationaleModel": "gpt-4o-mini", "visualRationale": [{"kind": "lab_table", "rows": [{"label": "Blood pressure", "value": "178/96 mmHg", "abnormal": true, "reference": "90–120 / 60–80 mmHg"}, {"label": "Heart rate", "value": "88", "abnormal": false, "reference": "60–100 bpm"}, {"label": "Respiratory rate", "value": "16", "abnormal": false, "reference": "12–20 /min"}, {"label": "INR", "value": "1.1", "abnormal": false, "reference": "0.8–1.2 (no anticoagulation)"}, {"label": "Blood glucose", "value": "142", "abnormal": true, "reference": "70–140 mg/dL"}], "title": "Key findings (abnormal values highlighted)"}, {"alt": "Schematic ECG showing atrial fibrillation with irregular RR intervals", "url": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20310%22%20role%3D%22img%22%20aria-label%3D%22Atrial%20fibrillation%20with%20irregular%20RR%20intervals%20and%20no%20P%20waves%22%3E%0A%20%20%0A%20%20%3Crect%20width%3D%22760%22%20height%3D%2256%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%226%22%20height%3D%2256%22%20fill%3D%22%2338bdf8%22%2F%3E%0A%20%20%3Ctext%20x%3D%2220%22%20y%3D%2224%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2215%22%20font-weight%3D%22800%22%20fill%3D%22%23f8fafc%22%3EECG%20%E2%80%94%20atrial%20fibrillation%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%2220%22%20y%3D%2244%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20fill%3D%22%2394a3b8%22%3EIrregularly%20irregular%20%C2%B7%20no%20discrete%20P%20waves%3C%2Ftext%3E%0A%20%20%3Crect%20x%3D%22642%22%20y%3D%2216%22%20width%3D%22100%22%20height%3D%2224%22%20rx%3D%226%22%20fill%3D%22%231e293b%22%20stroke%3D%22%23334155%22%2F%3E%0A%20%20%3Ctext%20x%3D%22692%22%20y%3D%2232%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2210%22%20font-weight%3D%22700%22%20letter-spacing%3D%220.06em%22%20fill%3D%22%2394a3b8%22%3EECG%3C%2Ftext%3E%0A%20%20%3Crect%20x%3D%220%22%20y%3D%2256%22%20width%3D%22760%22%20height%3D%22186%22%20fill%3D%22%23fff1f2%22%2F%3E%0A%3Cg%20aria-hidden%3D%22true%22%3E%3Cline%20x1%3D%220%22%20y1%3D%2256%22%20x2%3D%220%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%226%22%20y1%3D%2256%22%20x2%3D%226%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2212%22%20y1%3D%2256%22%20x2%3D%2212%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2218%22%20y1%3D%2256%22%20x2%3D%2218%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2256%22%20x2%3D%2224%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2230%22%20y1%3D%2256%22%20x2%3D%2230%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2236%22%20y1%3D%2256%22%20x2%3D%2236%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2242%22%20y1%3D%2256%22%20x2%3D%2242%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2248%22%20y1%3D%2256%22%20x2%3D%2248%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2254%22%20y1%3D%2256%22%20x2%3D%2254%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2260%22%20y1%3D%2256%22%20x2%3D%2260%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2266%22%20y1%3D%2256%22%20x2%3D%2266%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2272%22%20y1%3D%2256%22%20x2%3D%2272%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2278%22%20y1%3D%2256%22%20x2%3D%2278%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2284%22%20y1%3D%2256%22%20x2%3D%2284%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%2290%22%20y1%3D%2256%22%20x2%3D%2290%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%2296%22%20y1%3D%2256%22%20x2%3D%2296%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22102%22%20y1%3D%2256%22%20x2%3D%22102%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22108%22%20y1%3D%2256%22%20x2%3D%22108%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22114%22%20y1%3D%2256%22%20x2%3D%22114%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22120%22%20y1%3D%2256%22%20x2%3D%22120%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22126%22%20y1%3D%2256%22%20x2%3D%22126%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22132%22%20y1%3D%2256%22%20x2%3D%22132%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22138%22%20y1%3D%2256%22%20x2%3D%22138%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22144%22%20y1%3D%2256%22%20x2%3D%22144%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22150%22%20y1%3D%2256%22%20x2%3D%22150%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22156%22%20y1%3D%2256%22%20x2%3D%22156%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22162%22%20y1%3D%2256%22%20x2%3D%22162%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22168%22%20y1%3D%2256%22%20x2%3D%22168%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22174%22%20y1%3D%2256%22%20x2%3D%22174%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22180%22%20y1%3D%2256%22%20x2%3D%22180%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22186%22%20y1%3D%2256%22%20x2%3D%22186%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22192%22%20y1%3D%2256%22%20x2%3D%22192%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22198%22%20y1%3D%2256%22%20x2%3D%22198%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22204%22%20y1%3D%2256%22%20x2%3D%22204%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22210%22%20y1%3D%2256%22%20x2%3D%22210%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22216%22%20y1%3D%2256%22%20x2%3D%22216%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22222%22%20y1%3D%2256%22%20x2%3D%22222%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22228%22%20y1%3D%2256%22%20x2%3D%22228%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22234%22%20y1%3D%2256%22%20x2%3D%22234%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%2256%22%20x2%3D%22240%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22246%22%20y1%3D%2256%22%20x2%3D%22246%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22252%22%20y1%3D%2256%22%20x2%3D%22252%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22258%22%20y1%3D%2256%22%20x2%3D%22258%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22264%22%20y1%3D%2256%22%20x2%3D%22264%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22270%22%20y1%3D%2256%22%20x2%3D%22270%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22276%22%20y1%3D%2256%22%20x2%3D%22276%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22282%22%20y1%3D%2256%22%20x2%3D%22282%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22288%22%20y1%3D%2256%22%20x2%3D%22288%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22294%22%20y1%3D%2256%22%20x2%3D%22294%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22300%22%20y1%3D%2256%22%20x2%3D%22300%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22306%22%20y1%3D%2256%22%20x2%3D%22306%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22312%22%20y1%3D%2256%22%20x2%3D%22312%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22318%22%20y1%3D%2256%22%20x2%3D%22318%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22324%22%20y1%3D%2256%22%20x2%3D%22324%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22330%22%20y1%3D%2256%22%20x2%3D%22330%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22336%22%20y1%3D%2256%22%20x2%3D%22336%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22342%22%20y1%3D%2256%22%20x2%3D%22342%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22348%22%20y1%3D%2256%22%20x2%3D%22348%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22354%22%20y1%3D%2256%22%20x2%3D%22354%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22360%22%20y1%3D%2256%22%20x2%3D%22360%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22366%22%20y1%3D%2256%22%20x2%3D%22366%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22372%22%20y1%3D%2256%22%20x2%3D%22372%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22378%22%20y1%3D%2256%22%20x2%3D%22378%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22384%22%20y1%3D%2256%22%20x2%3D%22384%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22390%22%20y1%3D%2256%22%20x2%3D%22390%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22396%22%20y1%3D%2256%22%20x2%3D%22396%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22402%22%20y1%3D%2256%22%20x2%3D%22402%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22408%22%20y1%3D%2256%22%20x2%3D%22408%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22414%22%20y1%3D%2256%22%20x2%3D%22414%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22420%22%20y1%3D%2256%22%20x2%3D%22420%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22426%22%20y1%3D%2256%22%20x2%3D%22426%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22432%22%20y1%3D%2256%22%20x2%3D%22432%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22438%22%20y1%3D%2256%22%20x2%3D%22438%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22444%22%20y1%3D%2256%22%20x2%3D%22444%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22450%22%20y1%3D%2256%22%20x2%3D%22450%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22456%22%20y1%3D%2256%22%20x2%3D%22456%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22462%22%20y1%3D%2256%22%20x2%3D%22462%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22468%22%20y1%3D%2256%22%20x2%3D%22468%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22474%22%20y1%3D%2256%22%20x2%3D%22474%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22480%22%20y1%3D%2256%22%20x2%3D%22480%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22486%22%20y1%3D%2256%22%20x2%3D%22486%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22492%22%20y1%3D%2256%22%20x2%3D%22492%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22498%22%20y1%3D%2256%22%20x2%3D%22498%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22504%22%20y1%3D%2256%22%20x2%3D%22504%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22510%22%20y1%3D%2256%22%20x2%3D%22510%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22516%22%20y1%3D%2256%22%20x2%3D%22516%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22522%22%20y1%3D%2256%22%20x2%3D%22522%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22528%22%20y1%3D%2256%22%20x2%3D%22528%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22534%22%20y1%3D%2256%22%20x2%3D%22534%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22540%22%20y1%3D%2256%22%20x2%3D%22540%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22546%22%20y1%3D%2256%22%20x2%3D%22546%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22552%22%20y1%3D%2256%22%20x2%3D%22552%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22558%22%20y1%3D%2256%22%20x2%3D%22558%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22564%22%20y1%3D%2256%22%20x2%3D%22564%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22570%22%20y1%3D%2256%22%20x2%3D%22570%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22576%22%20y1%3D%2256%22%20x2%3D%22576%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22582%22%20y1%3D%2256%22%20x2%3D%22582%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22588%22%20y1%3D%2256%22%20x2%3D%22588%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22594%22%20y1%3D%2256%22%20x2%3D%22594%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22600%22%20y1%3D%2256%22%20x2%3D%22600%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22606%22%20y1%3D%2256%22%20x2%3D%22606%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22612%22%20y1%3D%2256%22%20x2%3D%22612%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22618%22%20y1%3D%2256%22%20x2%3D%22618%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22624%22%20y1%3D%2256%22%20x2%3D%22624%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22630%22%20y1%3D%2256%22%20x2%3D%22630%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22636%22%20y1%3D%2256%22%20x2%3D%22636%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22642%22%20y1%3D%2256%22%20x2%3D%22642%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22648%22%20y1%3D%2256%22%20x2%3D%22648%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22654%22%20y1%3D%2256%22%20x2%3D%22654%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22660%22%20y1%3D%2256%22%20x2%3D%22660%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22666%22%20y1%3D%2256%22%20x2%3D%22666%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22672%22%20y1%3D%2256%22%20x2%3D%22672%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22678%22%20y1%3D%2256%22%20x2%3D%22678%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22684%22%20y1%3D%2256%22%20x2%3D%22684%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22690%22%20y1%3D%2256%22%20x2%3D%22690%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22696%22%20y1%3D%2256%22%20x2%3D%22696%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22702%22%20y1%3D%2256%22%20x2%3D%22702%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22708%22%20y1%3D%2256%22%20x2%3D%22708%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22714%22%20y1%3D%2256%22%20x2%3D%22714%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22720%22%20y1%3D%2256%22%20x2%3D%22720%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22726%22%20y1%3D%2256%22%20x2%3D%22726%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22732%22%20y1%3D%2256%22%20x2%3D%22732%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22738%22%20y1%3D%2256%22%20x2%3D%22738%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22744%22%20y1%3D%2256%22%20x2%3D%22744%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%22750%22%20y1%3D%2256%22%20x2%3D%22750%22%20y2%3D%22242%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%22756%22%20y1%3D%2256%22%20x2%3D%22756%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2256%22%20x2%3D%22760%22%20y2%3D%2256%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2262%22%20x2%3D%22760%22%20y2%3D%2262%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2268%22%20x2%3D%22760%22%20y2%3D%2268%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2274%22%20x2%3D%22760%22%20y2%3D%2274%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2280%22%20x2%3D%22760%22%20y2%3D%2280%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2286%22%20x2%3D%22760%22%20y2%3D%2286%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2292%22%20x2%3D%22760%22%20y2%3D%2292%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2298%22%20x2%3D%22760%22%20y2%3D%2298%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22104%22%20x2%3D%22760%22%20y2%3D%22104%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22110%22%20x2%3D%22760%22%20y2%3D%22110%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22116%22%20x2%3D%22760%22%20y2%3D%22116%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22122%22%20x2%3D%22760%22%20y2%3D%22122%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22128%22%20x2%3D%22760%22%20y2%3D%22128%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22134%22%20x2%3D%22760%22%20y2%3D%22134%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22140%22%20x2%3D%22760%22%20y2%3D%22140%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22146%22%20x2%3D%22760%22%20y2%3D%22146%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22152%22%20x2%3D%22760%22%20y2%3D%22152%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22158%22%20x2%3D%22760%22%20y2%3D%22158%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22164%22%20x2%3D%22760%22%20y2%3D%22164%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22170%22%20x2%3D%22760%22%20y2%3D%22170%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22176%22%20x2%3D%22760%22%20y2%3D%22176%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22182%22%20x2%3D%22760%22%20y2%3D%22182%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22188%22%20x2%3D%22760%22%20y2%3D%22188%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22194%22%20x2%3D%22760%22%20y2%3D%22194%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22200%22%20x2%3D%22760%22%20y2%3D%22200%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22206%22%20x2%3D%22760%22%20y2%3D%22206%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22212%22%20x2%3D%22760%22%20y2%3D%22212%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22218%22%20x2%3D%22760%22%20y2%3D%22218%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22224%22%20x2%3D%22760%22%20y2%3D%22224%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22230%22%20x2%3D%22760%22%20y2%3D%22230%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22236%22%20x2%3D%22760%22%20y2%3D%22236%22%20stroke%3D%22%23fb7185%22%20stroke-width%3D%221.15%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22242%22%20x2%3D%22760%22%20y2%3D%22242%22%20stroke%3D%22%23fecdd3%22%20stroke-width%3D%220.55%22%2F%3E%3C%2Fg%3E%0A%20%20%0A%20%20%3Cpath%20d%3D%22M18%20205%20h10%20v-20%20h10%20v40%20h10%20v-20%20h10%22%20fill%3D%22none%22%20stroke%3D%22%230f172a%22%20stroke-width%3D%221.8%22%2F%3E%0A%20%20%3Ctext%20x%3D%2218%22%20y%3D%22233%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%2364748b%22%3E25%20mm%2Fs%3C%2Ftext%3E%0A%0A%20%20%3C!--%20Fibrillatory%20baseline%20%2B%20irregular%20QRS%20--%3E%0A%20%20%3Cpath%20d%3D%22M70%20200%0A%20%20%20%20Q78%20192%2086%20200%20Q94%20208%20102%20199%20Q110%20191%20118%20201%0A%20%20%20%20L128%20118%20L142%20252%20L154%20200%0A%20%20%20%20Q166%20190%20178%20202%20Q190%20210%20205%20198%20Q218%20188%20232%20201%20Q244%20208%20258%20197%0A%20%20%20%20L270%20112%20L285%20255%20L298%20200%0A%20%20%20%20Q318%20188%20340%20204%20Q360%20212%20378%20196%20Q392%20188%20410%20202%20Q422%20210%20438%20198%0A%20%20%20%20L450%20120%20L465%20250%20L478%20200%0A%20%20%20%20Q500%20188%20530%20204%20Q555%20214%20575%20192%20Q590%20186%20608%20200%0A%20%20%20%20L620%20115%20L635%20252%20L648%20200%0A%20%20%20%20Q665%20190%20685%20202%20Q702%20210%20720%20198%20Q735%20190%20748%20200%22%0A%20%20%20%20fill%3D%22none%22%20stroke%3D%22%230f172a%22%20stroke-width%3D%222.5%22%20stroke-linejoin%3D%22round%22%20stroke-linecap%3D%22round%22%2F%3E%0A%0A%20%20%3C!--%20RR%20brackets%20ABOVE%20the%20strip%2C%20clear%20of%20footer%20--%3E%0A%20%20%3Cline%20x1%3D%22142%22%20y1%3D%2278%22%20x2%3D%22285%22%20y2%3D%2278%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%223%22%2F%3E%0A%20%20%3Cline%20x1%3D%22142%22%20y1%3D%2274%22%20x2%3D%22142%22%20y2%3D%2282%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2274%22%20x2%3D%22285%22%20y2%3D%2282%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ctext%20x%3D%22214%22%20y%3D%2272%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%231d4ed8%22%3Elonger%20RR%3C%2Ftext%3E%0A%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2298%22%20x2%3D%22465%22%20y2%3D%2298%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%223%22%2F%3E%0A%20%20%3Cline%20x1%3D%22285%22%20y1%3D%2294%22%20x2%3D%22285%22%20y2%3D%22102%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22465%22%20y1%3D%2294%22%20x2%3D%22465%22%20y2%3D%22102%22%20stroke%3D%22%23dc2626%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ctext%20x%3D%22375%22%20y%3D%2292%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%23b91c1c%22%3Eshorter%20RR%3C%2Ftext%3E%0A%0A%20%20%0A%20%20%3Crect%20x%3D%22500%22%20y%3D%22230%22%20width%3D%22156%22%20height%3D%2226%22%20rx%3D%227%22%20fill%3D%22%23fef2f2%22%20stroke%3D%22%23f87171%22%20stroke-width%3D%221.5%22%2F%3E%0A%20%20%3Ctext%20x%3D%22578%22%20y%3D%22247%22%20text-anchor%3D%22middle%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22800%22%20fill%3D%22%23991b1b%22%3ENo%20P%20waves%20%C2%B7%20f%20waves%3C%2Ftext%3E%0A%20%20%0A%20%20%3Crect%20x%3D%2212%22%20y%3D%22278%22%20width%3D%22736%22%20height%3D%2228%22%20rx%3D%228%22%20fill%3D%22%23f1f5f9%22%20stroke%3D%22%23e2e8f0%22%2F%3E%0A%20%20%3Ctext%20x%3D%2224%22%20y%3D%22296%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22600%22%20fill%3D%22%230f172a%22%3EIrregularly%20irregular%20%2B%20absent%20P%20waves%20%3D%20AFib%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22736%22%20y%3D%22296%22%20text-anchor%3D%22end%22%20font-family%3D%22ui-sans-serif%2C%20system-ui%2C%20-apple-system%2C%20'Segoe%20UI'%2C%20Roboto%2C%20Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%229%22%20fill%3D%22%2394a3b8%22%3EAnyExamEasy%3C%2Ftext%3E%0A%3C%2Fsvg%3E", "kind": "image", "title": "AFib — irregularly irregular, no P waves", "caption": "AFib — irregularly irregular, no P waves"}], "rationaleEnrichedAt": "2026-09-06T12:26:25.113Z", "rationaleQualityScore": 100}, "blueprintSystem": "cardiovascular"}$opa25$,
  $kya25$Determine the time last known well before any thrombolytic or thrombectomy decision$kya25$,
  $exa25$The CT has already excluded hemorrhage, and the syndrome is an acute ischemic stroke in atrial fibrillation. A thrombolytic or a thrombectomy decision still depends on the time last known well. That time is not available: her husband found her and cannot say when she was last well. The next step is to establish that time before any reperfusion drug. Giving alteplase now treats an unknown clock as if it were known. Aspirin does not replace vessel imaging, and imaging has already been done, so deferring it for 24 hours is backward. Systolic pressure of 178 mm Hg is below the usual 185 mm Hg threshold used before alteplase; driving it under 120 mm Hg is not the next step. Lumbar puncture is not the study for this CT-negative focal stroke. Source: Powers WJ et al. AHA/ASA 2019 guideline. https://www.ahajournals.org/doi/10.1161/STR.0000000000000211$exa25$,
  4,
  $dma25$behavioral-nervous$dma25$,
  $tpa25$stroke-management$tpa25$,
  $sua25$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sua25$,
  $sla25$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sla25$,
  $sqa25$The key BP target before starting alteplase (t-PA) is < 185/110 mm Hg.$sqa25$,
  $cha25$816cbd82e696873de4bba4ab4f3a4af44ea69cf0af359e250a61d3ba8074c9bf$cha25$,
  true,
  $rfa25$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/"}]$rfa25$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida26$cmr4hzy9700b51yde0r0eye2u$ida26$,
  $fxa26$wrong_key|rationale|wrong_blueprint$fxa26$,
  $sca26$A 3-month-old infant presents to the emergency department with a fever of 38.9°C (102°F) and irritability. The mother reports that the infant has not been feeding well and has been unusually lethargic. On examination, the infant has a bulging fontanelle and a stiff neck. A lumbar puncture is performed, revealing cloudy cerebrospinal fluid with an elevated white blood cell count and a predominance of neutrophils. Gram stain of the cerebrospinal fluid shows gram-positive diplococci.$sca26$,
  $qua26$What is the most appropriate preventive measure?$qua26$,
  $opa26${"options":["Meningococcal vaccination","Hib vaccination","Pneumococcal vaccination","Varicella vaccination"],"distractorRationale":{"Meningococcal vaccination":"This vaccine is important but is not typically given until later in childhood.","Pneumococcal vaccination":"While important, it does not specifically prevent the most likely cause of meningitis in this age group.","Varicella vaccination":"This vaccine is not relevant to the current presentation of meningitis."},"clinicalReasoning":"Evaluate the infant's symptoms and lumbar puncture findings, indicating bacterial meningitis. Analyze the prevention strategies for common pathogens in this age group. Integrate knowledge of vaccination schedules to determine Hib vaccination as the most appropriate preventive measure.","keyTakeaways":["When assessing a febrile infant with signs of meningitis, prioritize Hib vaccination to prevent the most common bacterial cause."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"bacterial-meningitis-prevention","blueprintSystem":"pediatrics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783056257561","qcScore":8.1,"slotIndex":53,"stepLevel":"step2","examNumber":9204,"generatedAt":"2026-07-03T05:25:22.706Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"pharmacotherapy"}$opa26$,
  $kya26$Pneumococcal vaccination$kya26$,
  $exa26$Gram-positive diplococci in cloudy, neutrophil-rich cerebrospinal fluid are Streptococcus pneumoniae. Pneumococcal vaccination is the immunization that prevents that organism. Hib vaccine prevents Haemophilus influenzae type b, a gram-negative coccobacillus, and Hib is no longer the leading cause of bacterial meningitis in young U.S. children. Meningococcal vaccine does not cover pneumococcus as the routine infant series, and varicella vaccine does not prevent bacterial meningitis.$exa26$,
  3,
  $dma26$human-development$dma26$,
  $tpa26$bacterial-meningitis-prevention$tpa26$,
  $sua26$https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-17-pneumococcal-disease.html$sua26$,
  $sla26$https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-17-pneumococcal-disease.html$sla26$,
  $sqa26$With the decline of invasive Haemophilus influenzae type b (Hib) disease, S. pneumoniae has become the leading cause of bacterial meningitis among children younger than age 5 years in the United States.$sqa26$,
  $cha26$519af2cb9fd5e487c11b28284eee8fd74738eaa48a6c27505f2fed3341830e2d$cha26$,
  true,
  $rfa26$[{"label": "https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-17-pneumococcal-disease.html", "url": "https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-17-pneumococcal-disease.html"}]$rfa26$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida27$cmr88icd900q31yr98cakrhdh$ida27$,
  $fxa27$wrong_blueprint$fxa27$,
  $sca27$A 60-year-old man with a history of hypertension and hyperlipidemia presents to the clinic with complaints of fatigue and palpitations. His blood pressure is 150/90 mm Hg, heart rate is 120 bpm, and he appears anxious. An ECG shows atrial fibrillation with a rapid ventricular response. He is currently taking lisinopril and atorvastatin.$sca27$,
  $qua27$What is the most appropriate next step in management?$qua27$,
  $opa27${"options":["Start beta-blocker therapy","Initiate anticoagulation","Order a thyroid function test","Refer for cardioversion"],"distractorRationale":{"Initiate anticoagulation":"While anticoagulation is important in atrial fibrillation, it is not the immediate priority in this case.","Order a thyroid function test":"This test is not urgent and does not address the immediate symptoms of rapid heart rate.","Refer for cardioversion":"Cardioversion is not the first step; rate control should be prioritized."},"clinicalReasoning":"Evaluate the patient's symptoms and ECG findings to determine the urgency of management. Analyze the need for rate control versus anticoagulation. Integrate the clinical context to decide on starting beta-blocker therapy as the most appropriate next step.","keyTakeaways":["When managing atrial fibrillation with rapid ventricular response, prioritize rate control with beta-blockers first."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"atrial-fibrillation-rate-control","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783282201889","qcScore":8.1,"slotIndex":11,"stepLevel":"step2","examNumber":9209,"generatedAt":"2026-07-05T20:11:11.632Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"health-maintenance"}$opa27$,
  $kya27$Start beta-blocker therapy$kya27$,
  $exa27$Why this answer is correct
Starting beta-blocker therapy is the best immediate step for rate control in this patient with atrial fibrillation.
Atrial fibrillation can lead to rapid heart rates, causing symptoms like fatigue and palpitations.
The goal of initial management is rate control to alleviate symptoms and stabilize the patient.
Beta-blockers are effective for reducing heart rate and improving patient comfort.
In practice: On the unit, this means prioritizing interventions that stabilize the patient's heart rate to prevent further complications and improve their overall well-being.
Why the other options are wrong

Initiate anticoagulation
Trap: Students may think anticoagulation is always the first step in atrial fibrillation management.
Why it fails here: While anticoagulation is crucial to prevent thromboembolism, it is not the immediate priority in this case without additional risk factors.
Remember: This highlights the importance of addressing acute symptoms first before considering long-term anticoagulation.

Order a thyroid function test
Trap: There is a belief that diagnosing the underlying cause of atrial fibrillation is always the first step.
Why it fails here: Although hyperthyroidism could be a contributing factor, the immediate need is to manage the rapid heart rate and symptoms, making this test non-urgent.
Remember: This emphasizes the need for symptomatic management over diagnostic testing in acute situations.

Refer for cardioversion
Trap: Students might think that cardioversion is the quickest way to resolve atrial fibrillation.
Why it fails here: Cardioversion is typically considered after rate control is achieved or if the patient is severely symptomatic despite medical management.
Remember: This reinforces the principle that rate control is the first step in managing atrial fibrillation with a rapid ventricular response.
Key takeaway
When managing atrial fibrillation with rapid ventricular response, prioritize rate control with beta-blockers first.

Memory hook: Think 'Beta for Beat' — beta-blockers first for controlling the heart rate.$exa27$,
  2,
  $dma27$cardiovascular$dma27$,
  $tpa27$atrial-fibrillation-rate-control$tpa27$,
  $sua27$https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673$sua27$,
  $sla27$https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673$sla27$,
  $sqa27$For patients with AF with a rapid ventricular response who are hemodynamically stable, beta blockers or nondihydropyridine calcium channel blockers are recommended for acute rate control.$sqa27$,
  $cha27$73f42df1ed2c9f2e7ca71b17dadc24d5a28461a817b72d7a66b8a986ecb8222e$cha27$,
  true,
  $rfa27$[{"label": "https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673", "url": "https://assets.contenthub.wolterskluwer.com/api/public/content/3525777-gls098-guideline-summary-atrial-fibrillation-december-2024-94d6fe8673"}]$rfa27$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida28$cmrtgb20a002c1ydwlc0jle9d$ida28$,
  $fxa28$wrong_blueprint|difficulty$fxa28$,
  $sca28$A 28-year-old woman presents to the emergency department with a severe headache, photophobia, and neck stiffness. She has a fever of 102°F and a heart rate of 100 bpm. A lumbar puncture is performed, and the cerebrospinal fluid (CSF) analysis shows an elevated white blood cell count with a predominance of lymphocytes, elevated protein, and normal glucose levels.$sca28$,
  $qua28$What is the most likely diagnosis?$qua28$,
  $opa28${"kind":"image_based","stepLevel":"step2","blueprintSystem":"behavioral-nervous","blueprintTopic":"viral-meningitis","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784565406373","qcScore":8,"slotIndex":5,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-20T16:37:40.458Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Viral meningitis","Bacterial meningitis","Tuberculous meningitis","Fungal meningitis"],"taskCategory":"clinical-intervention"}$opa28$,
  $kya28$Viral meningitis$kya28$,
  $exa28$Why this answer is correct
The CSF findings indicate viral meningitis due to lymphocytic predominance and normal glucose levels.
Lymphocytic predominance in CSF is typical for viral infections.
Normal glucose levels help differentiate viral meningitis from bacterial causes.
Elevated protein levels can occur in both viral and bacterial meningitis, but glucose levels are key for diagnosis.
In practice: On the unit, recognizing viral meningitis allows for appropriate supportive care and avoids unnecessary antibiotics, which are critical for patient safety.
Why the other options are wrong

Bacterial meningitis
Trap: Students may confuse the symptoms with bacterial meningitis due to the acute presentation.
Why it fails here: Bacterial meningitis would show a neutrophilic predominance and low glucose levels in the CSF, which are not present here.
Remember: Understanding the CSF profile is essential to differentiate between viral and bacterial meningitis.

Tuberculous meningitis
Trap: Some may think of tuberculous meningitis due to the patient's fever and neck stiffness.
Why it fails here: Tuberculous meningitis typically presents with low glucose levels and a more chronic course, which is inconsistent with this acute presentation.
Remember: Recognizing the CSF findings helps in identifying the type of meningitis accurately.

Fungal meningitis
Trap: Students might consider fungal meningitis due to the patient's symptoms and CSF findings.
Why it fails here: Fungal meningitis usually presents with low glucose levels and is less common in acute settings like this one.
Remember: Differentiating between types of meningitis based on CSF analysis is crucial for proper management.
Key takeaway
When CSF shows lymphocytic predominance and normal glucose, think viral meningitis first.

Memory hook: Remember: Lymphocytes and normal glucose = Viral; Neutrophils and low glucose = Bacterial.$exa28$,
  2,
  $dma28$behavioral-nervous$dma28$,
  $tpa28$viral-meningitis$tpa28$,
  $sua28$https://www.msdmanuals.com/professional/multimedia/table/cerebrospinal-fluid-findings-in-meningitis$sua28$,
  $sla28$https://www.msdmanuals.com/professional/multimedia/table/cerebrospinal-fluid-findings-in-meningitis$sla28$,
  $sqa28$Viral meningitis | Lymphocytes (may be mixed; PMNs and lymphocytes during the first 24–48 hours) | Elevated | Usually normal$sqa28$,
  $cha28$0adb664d94c93f35301259bfc80fe4ae7fe652edcfe0b1974281cc3bce506caa$cha28$,
  true,
  $rfa28$[{"label": "https://www.msdmanuals.com/professional/multimedia/table/cerebrospinal-fluid-findings-in-meningitis", "url": "https://www.msdmanuals.com/professional/multimedia/table/cerebrospinal-fluid-findings-in-meningitis"}]$rfa28$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida29$cmrvm5unh0008jw04wm49tiyd$ida29$,
  $fxa29$wrong_blueprint$fxa29$,
  $sca29$A 55-year-old man presents to the emergency department with shortness of breath and confusion. He has a history of type 2 diabetes and chronic kidney disease. On examination, his respiratory rate is 30 breaths per minute, and he exhibits deep, labored breathing. Arterial blood gas analysis reveals a pH of 7.25 and a bicarbonate level of 15 mEq/L.$sca29$,
  $qua29$What is the most likely diagnosis for this patient's respiratory pattern?$qua29$,
  $opa29${"options":["Metabolic acidosis","Metabolic alkalosis","Hypercapnia without acidosis","Opioid toxicity"],"distractorRationale":{"Metabolic alkalosis":"Metabolic alkalosis typically presents with **hypoventilation** and respiratory compensation, not Kussmaul respirations. (Understanding the respiratory patterns associated with different acid-base disorders is crucial.)","Hypercapnia without acidosis":"Hypercapnia usually leads to **shallow breathing** due to respiratory depression, not the deep, labored breathing seen here. (Recognizing the distinction between respiratory patterns in different conditions helps in accurate diagnosis.)","Opioid toxicity":"Opioid toxicity typically causes **respiratory depression**, leading to shallow breathing rather than Kussmaul respirations. (Understanding the effects of opioids on respiration is essential for distinguishing between different causes of altered breathing patterns.)"},"clinicalReasoning":"The patient's respiratory pattern indicates metabolic acidosis. **Deep, labored breathing** (Kussmaul respirations) is a compensatory response to acidosis. The **low pH** (7.25) and **bicarbonate level** (15 mEq/L) confirm metabolic acidosis.","keyTakeaways":["When you see deep, labored breathing, think metabolic acidosis first."],"blueprintTopic":"metabolic-acidosis","blueprintSystem":"respiratory-renal"}$opa29$,
  $kya29$Metabolic acidosis$kya29$,
  $exa29$Why this answer is correct
The patient's respiratory pattern indicates metabolic acidosis.
Deep, labored breathing (Kussmaul respirations) is a compensatory response to acidosis.
The low pH (7.25) and bicarbonate level (15 mEq/L) confirm metabolic acidosis.
In metabolic acidosis, the body increases ventilation to eliminate CO2 and correct pH.
In practice: On the unit, recognizing Kussmaul respirations can guide immediate treatment for metabolic acidosis, such as addressing the underlying cause and improving ventilation.
Why the other options are wrong

Metabolic alkalosis
Trap: Students may confuse metabolic alkalosis with respiratory patterns.
Why it fails here: Metabolic alkalosis typically presents with hypoventilation and respiratory compensation, not Kussmaul respirations.
Remember: Understanding the respiratory patterns associated with different acid-base disorders is crucial.

Hypercapnia without acidosis
Trap: There is a belief that hypercapnia can cause deep, labored breathing.
Why it fails here: Hypercapnia usually leads to shallow breathing due to respiratory depression, not the deep, labored breathing seen here.
Remember: Recognizing the distinction between respiratory patterns in different conditions helps in accurate diagnosis.

Opioid toxicity
Trap: Some may think that opioid toxicity can present with Kussmaul respirations.
Why it fails here: Opioid toxicity typically causes respiratory depression, leading to shallow breathing rather than Kussmaul respirations.
Remember: Understanding the effects of opioids on respiration is essential for distinguishing between different causes of altered breathing patterns.
Key takeaway
When you see deep, labored breathing, think metabolic acidosis first.

Memory hook: Kussmaul respirations = Kick up CO2 loss in Acidosis.$exa29$,
  2,
  $dma29$respiratory-renal$dma29$,
  $tpa29$metabolic-acidosis$tpa29$,
  $sua29$https://pmc.ncbi.nlm.nih.gov/articles/PMC6347653/$sua29$,
  $sla29$https://pmc.ncbi.nlm.nih.gov/articles/PMC6347653/$sla29$,
  $sqa29$The presence of metabolic acidosis will normally generate a respiratory response.$sqa29$,
  $cha29$6a9a038c12d017775de53acf51b2ed954a1cd50be8c161b54e89b8fb66677013$cha29$,
  true,
  $rfa29$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6347653/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6347653/"}]$rfa29$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida30$cmtpw0nh2002h1ylc4hhyr5ed$ida30$,
  $fxa30$wrong_blueprint$fxa30$,
  $sca30$A 72-year-old woman presents to the emergency department with acute onset of right-sided weakness and slurred speech that began 2 hours ago. She has a history of hypertension and hyperlipidemia, and her current medications include lisinopril and atorvastatin. On examination, her blood pressure is 160/95 mm Hg, and she has a right-sided facial droop and weakness in her right arm and leg. A non-contrast CT scan of the head shows no acute hemorrhage.$sca30$,
  $qua30$What is the next best step in management?$qua30$,
  $opa30${"kind":"ethics","stepLevel":"step2","blueprintSystem":"behavioral-nervous","blueprintTopic":"stroke-thrombolysis","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788703609139","examNumber":9202,"slotIndex":8,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-09-06T14:07:35.058Z"},"options":["Administer intravenous thrombolysis with alteplase","Obtain a carotid Doppler ultrasound","Start aspirin therapy","Perform a lumbar puncture (sample the cerebrospinal fluid)"]}$opa30$,
  $kya30$Administer intravenous thrombolysis with alteplase$kya30$,
  $exa30$The correct answer is to administer intravenous thrombolysis with alteplase, as this patient is presenting with an acute ischemic stroke within the 3-4.5 hour window for thrombolytic therapy. This intervention can significantly improve outcomes if administered promptly. The other options are incorrect: obtaining a carotid Doppler ultrasound (wrong next step) is not appropriate in the acute setting; starting aspirin therapy (premature intervention) is not recommended until after the thrombolysis decision; and performing a lumbar puncture (contraindicated) is not indicated in the setting of an acute stroke without evidence of subarachnoid hemorrhage.

Clinical reasoning: The patient presents with classic signs of an ischemic stroke, and the CT scan rules out hemorrhagic stroke. The time window for thrombolysis is critical, making it the most appropriate next step in management.

Why other options are incorrect:
• Obtain a carotid Doppler ultrasound: This is a diagnostic step that is not appropriate as an immediate management strategy in the acute stroke setting.
• Start aspirin therapy: Aspirin is typically used for secondary prevention but is not the first-line treatment in the acute phase of ischemic stroke.
• Perform a lumbar puncture (sample the cerebrospinal fluid): This is contraindicated in the setting of an acute stroke, especially when there is a risk of increased intracranial pressure.$exa30$,
  4,
  $dma30$behavioral-nervous$dma30$,
  $tpa30$stroke-thrombolysis$tpa30$,
  $sua30$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sua30$,
  $sla30$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sla30$,
  $sqa30$The key BP target before starting alteplase (t-PA) is < 185/110 mm Hg, and the maintenance BP after tPA administration is < 180/105 mm Hg.$sqa30$,
  $cha30$227a85a0b32fdb993b4a1611e7fda8d6e8f228eed5f6fbad8cf6eed8e0227cd8$cha30$,
  true,
  $rfa30$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/"}]$rfa30$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida31$2b0a8cbd-8df4-4962-bdf5-d2f2f999f281$ida31$,
  $fxa31$template_artifact$fxa31$,
  $sca31$A man of northern European ancestry has a cord in the palm that pulls the ring finger into flexion. He cannot flatten the hand on the table. Sensation is normal and there is no night pain. A student calls it a trigger finger because the finger sticks, and another calls it an ulnar claw from a nerve.$sca31$,
  $qua31$What is contracting?$qua31$,
  $opa31${"options":["The palmar fascia is what contracts, not a tendon or a nerve","A flexor-tendon nodule of trigger finger locks and then snaps","Ulnar nerve palsy numbs the little finger and weakens spread","A Dupuytren cord is a rheumatoid swan-neck deformity of the finger","Normal sensation means the median nerve is trapped at the wrist"],"blueprintSystem":"msk-skin","taskCategory":"interpretation","blueprintTopic":"Dupuytren","kind":"vignette"}$opa31$,
  $kya31$The palmar fascia is what contracts, not a tendon or a nerve$kya31$,
  $exa31$Dupuytren contracture is myofibroblast thickening of the palmar fascia, often the ring finger, and the table-top test fails. It is not a tendon. Trigger finger snaps and locks from a flexor tendon nodule at the A1 pulley and does not pull the finger down at rest the same way. Ulnar claw comes with sensory loss and weak interossei. Swan-neck is a rheumatoid tendon balance problem, hyperextension of the PIP. Intact sensation argues against a nerve entrapment; the median nerve would numb the radial digits and is not this cord.$exa31$,
  4,
  $dma31$msk-skin$dma31$,
  $tpa31$Dupuytren$tpa31$,
  $sua31$https://www.ncbi.nlm.nih.gov/books/NBK526074/$sua31$,
  $sla31$https://www.ncbi.nlm.nih.gov/books/NBK526074/$sla31$,
  $sqa31$Dupuytren disease is predominantly a myofibroblastic disease that affects the palmar and digital fascia of the hand and results in contracture deformities.$sqa31$,
  $cha31$beaf247af3fde3dd6eff38cbda32a1eeb914662f5b9633476765910e82e84a10$cha31$,
  true,
  $rfa31$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK526074/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK526074/"}]$rfa31$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida32$b1xcebac02cb8e3262617bba821$ida32$,
  $fxa32$wrong_blueprint$fxa32$,
  $sca32$A 6-year-old boy is in hemorrhagic shock after trauma. Hemoglobin is 5.1 g/dL and he is tachycardic despite crystalloid. His parents refuse all blood products. There is no time for a court hearing before he needs transfusion.$sca32$,
  $qua32$Which action is required?$qua32$,
  $opa32${"options":["Wait for a full trial","Ask the child to sign a refusal","Discharge the family","Transfuse now","Honor the refusal exactly"],"blueprintTopic":"emergency-transfusion-minor","blueprintSystem":"social-sciences"}$opa32$,
  $kya32$Transfuse now$kya32$,
  $exa32$In an emergency, a child who is bleeding is transfused even if the parents refuse blood products. Transfuse now treats a life-threatening hemorrhage; parental refusal does not extend to refusing lifesaving care for a minor. Honor the refusal exactly would apply to a capacitated adult. Wait for a full trial delays blood he needs now. Ask the child to sign a refusal treats a 6-year-old as a decision-maker. Discharge the family abandons the emergency.$exa32$,
  3,
  $dma32$social-sciences$dma32$,
  $tpa32$emergency-transfusion-minor$tpa32$,
  $sua32$https://code-medical-ethics.ama-assn.org/ethics-opinions/pediatric-decision-making$sua32$,
  $sla32$https://code-medical-ethics.ama-assn.org/ethics-opinions/pediatric-decision-making$sla32$,
  $sqa32$In giving or withholding permission for medical treatment for their children, parents/guardians are expected to safeguard their children's physical health and well-being.$sqa32$,
  $cha32$088c6d43b39a5733a191c5cd655a33cf1cdc312e157a2f7015e3095d5b91641e$cha32$,
  true,
  $rfa32$[{"label": "https://code-medical-ethics.ama-assn.org/ethics-opinions/pediatric-decision-making", "url": "https://code-medical-ethics.ama-assn.org/ethics-opinions/pediatric-decision-making"}]$rfa32$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida33$b4x71da6a48b3a69db5e20134bb$ida33$,
  $fxa33$wrong_blueprint|difficulty$fxa33$,
  $sca33$A 68-year-old man suddenly flings his left arm in wide movements. Strength between the flings is present. MRI shows a tiny lesion in the right subthalamic region. Sensation is intact. He asks why a lesion that small produced wild movement rather than weakness.$sca33$,
  $qua33$Why did losing that nucleus release movement?$qua33$,
  $opa33${"options":["Wild movement means the cerebellum lost inhibition of the cord","The nucleus secretes dopamine, and loss caused rigidity","It had been driving the pallidum that inhibits the thalamus","It is a motor cortex for the left arm","The left subthalamic region was the one injured"],"blueprintTopic":"hemiballismus","blueprintSystem":"behavioral-nervous"}$opa33$,
  $kya33$It had been driving the pallidum that inhibits the thalamus$kya33$,
  $exa33$Loss of the subthalamic nucleus removes the drive to the inhibitory pallidum, so the thalamus is released and the opposite limbs fling. It had been driving the pallidum that inhibits the thalamus. It is a motor cortex for the left arm would have caused weakness, which he does not have between flings. The left subthalamic region was the one injured contradicts the right-sided MRI. Wild movement means the cerebellum lost inhibition of the cord is a different circuit. The nucleus secretes dopamine, and loss caused rigidity confuses this nucleus with the substantia nigra.$exa33$,
  3,
  $dma33$behavioral-nervous$dma33$,
  $tpa33$hemiballismus$tpa33$,
  $sua33$https://www.ncbi.nlm.nih.gov/books/NBK559002/$sua33$,
  $sla33$https://www.ncbi.nlm.nih.gov/books/NBK559002/$sla33$,
  $sqa33$Lesions of the subthalamic nucleus can disrupt the inhibition of movement by the internal globus pallidus and result in hemiballismus.$sqa33$,
  $cha33$611bf4d234771832523b405e23a9afa395eee7945c4fe15dc5c02f7d9258dbc6$cha33$,
  true,
  $rfa33$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK559002/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK559002/"}]$rfa33$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida34$b5x676b5d9ff393fecd1322779d$ida34$,
  $fxa34$wrong_blueprint|difficulty$fxa34$,
  $sca34$A 54-year-old man has a tumor in the right temporal lobe. He cannot see the upper left quadrant with either eye. The lower fields are spared. A classmate says temporal lesions should hit the lower field because the lobe sits low.$sca34$,
  $qua34$Why is the lost field the upper one?$qua34$,
  $opa34${"options":["Temporal lesions always cut the lower field","Only the left eye lost vision","Upper-field fibers travel in the parietal lobe","A spared lower field means the optic nerve, not the radiation","The fibers for the upper field loop through the temporal lobe"],"blueprintTopic":"meyer-loop","blueprintSystem":"behavioral-nervous"}$opa34$,
  $kya34$The fibers for the upper field loop through the temporal lobe$kya34$,
  $exa34$Lower retinal fibers loop through the temporal lobe, so a temporal lesion cuts the upper field of the opposite side. The fibers for the upper field loop through the temporal lobe. Temporal lesions always cut the lower field is the classmate's map, and it is the parietal radiation that carries the lower field. Only the left eye lost vision contradicts both eyes. Upper-field fibers travel in the parietal lobe swaps the two loops. A spared lower field means the optic nerve, not the radiation would not be homonymous.$exa34$,
  3,
  $dma34$behavioral-nervous$dma34$,
  $tpa34$meyer-loop$tpa34$,
  $sua34$https://www.ncbi.nlm.nih.gov/books/NBK558982/$sua34$,
  $sla34$https://www.ncbi.nlm.nih.gov/books/NBK558982/$sla34$,
  $sqa34$Ventral fibers that transmit visual information from the inferior quadrants of the retina (superior visual field) initially travel through the anterior temporal lobe around the inferior horn of the lateral ventricle (Meyer loop).$sqa34$,
  $cha34$bc0ff0a63459e31528769cd8061d4f6dc767588d09858514a68170d7f89313b4$cha34$,
  true,
  $rfa34$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK558982/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558982/"}]$rfa34$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida35$b8xcdb6e3ca03df86a8a3f680c6$ida35$,
  $fxa35$rationale$fxa35$,
  $sca35$Two patients have a bicarbonate of 10 mEq/L. A 30-year-old patient with diarrhea has a carbon dioxide of 23 mm Hg and a pH of 7.28. A 55-year-old patient has the same bicarbonate, a carbon dioxide of 40 mm Hg, and a pH of 7.02. He is sleepy from a sedative. Both have a normal anion gap.$sca35$,
  $qua35$Why is the sleepy patient’s pH lower?$qua35$,
  $opa35$["A carbon dioxide of 40 millimeters of mercury is the expected compensation for a bicarbonate of 10","Diarrhea raises carbon dioxide","A normal anion gap means the pH cannot fall further","Sleepiness from a sedative increases ventilation","He did not hyperventilate, so a respiratory acidosis sits on top of the metabolic one"]$opa35$,
  $kya35$He did not hyperventilate, so a respiratory acidosis sits on top of the metabolic one$kya35$,
  $exa35$Both patients have normal-anion-gap metabolic acidosis with bicarbonate 10 mEq/L. Diarrhea causes that acidosis by gastrointestinal bicarbonate loss; it does not raise carbon dioxide. Winter's formula, expected PCO2 = 1.5 x bicarbonate + 8 ± 2, predicts a PCO2 near 23 mm Hg. The patient with diarrhea has a PCO2 of 23 mm Hg, which is appropriate compensation, and a pH of 7.28. The sleepy patient did not hyperventilate: a sedative depresses ventilation, so his PCO2 stays 40 mm Hg. That respiratory acidosis sits on the metabolic acidosis and the pH falls to about 7.02. A normal anion gap does not stop the pH from falling further.$exa35$,
  5,
  $dma35$multisystem$dma35$,
  $tpa35$emergency-management$tpa35$,
  $sua35$https://www.ncbi.nlm.nih.gov/books/NBK482146/$sua35$,
  $sla35$https://www.ncbi.nlm.nih.gov/books/NBK482146/$sla35$,
  $sqa35$If the pCO2 is greater than expected, this indicates an additional respiratory acidosis.$sqa35$,
  $cha35$65f3c056445408eff8a7c5023b71fc9add3aa9323c97a3cecba798a244600e16$cha35$,
  true,
  $rfa35$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK482146/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482146/"}]$rfa35$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida36$cmqxc0sq6000b1ymaidqgf5ei$ida36$,
  $fxa36$rationale|difficulty$fxa36$,
  $sca36$A 28-year-old woman presents to the clinic with fatigue and a history of recurrent urinary tract infections. Laboratory tests reveal a serum creatinine of 1.2 mg/dL and urinalysis shows proteinuria of 4+ with no hematuria. She denies any history of hypertension or diabetes.$sca36$,
  $qua36$What is the most likely underlying mechanism of this patient's condition?$qua36$,
  $opa36${"kind":"image_based","stepLevel":"step1","blueprintSystem":"respiratory-renal","blueprintTopic":"asthma-copd-pathology","physicianTask":"interpretation","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step1-1782622322072","qcScore":8,"slotIndex":11,"stepLevel":"step1","examNumber":9072,"generatedAt":"2026-06-28T04:53:02.344Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Glomerular hyperpermeability","Tubular reabsorption defect","Increased glomerular filtration rate","Decreased renal perfusion"],"taskCategory":"interpretation"}$opa36$,
  $kya36$Glomerular hyperpermeability$kya36$,
  $exa36$Four-plus proteinuria means the glomerular filter is letting plasma proteins through. That is glomerular hyperpermeability, the mechanism of nephrotic-range proteinuria. Absence of hematuria favors a nephrotic pattern over a nephritic one; it does not separate glomerular disease from tubular disease, because nephritic sediment is also glomerular. A tubular reabsorption defect causes small amounts of protein plus other solute wasting, not isolated 4+ protein. A high filtration rate does not by itself produce heavy proteinuria, and nephrotic syndrome usually has a normal or reduced GFR. Low renal perfusion raises creatinine from prerenal azotemia rather than causing isolated heavy proteinuria.$exa36$,
  2,
  $dma36$respiratory-renal$dma36$,
  $tpa36$asthma-copd-pathology$tpa36$,
  $sua36$https://www.ncbi.nlm.nih.gov/books/NBK559169/$sua36$,
  $sla36$https://www.ncbi.nlm.nih.gov/books/NBK559169/$sla36$,
  $sqa36$The lack of active sediments with the absence of hematuria and red cell casts in urine microscopy differentiates it from nephritic syndromes.$sqa36$,
  $cha36$3cdb8e53262c092f107f909500a7991ccd729a46afa9283525ba6e2288e0cec0$cha36$,
  true,
  $rfa36$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK559169/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK559169/"}]$rfa36$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida37$cmr8bg0vr00zs1yw2vcqpb8s4$ida37$,
  $fxa37$wrong_blueprint$fxa37$,
  $sca37$A 32-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and has been experiencing polyuria and polydipsia for the past few days. On examination, her blood pressure is 100/60 mm Hg, heart rate is 120 bpm, and she has dry mucous membranes. Laboratory tests reveal a blood glucose level of 450 mg/dL and a serum bicarbonate of 15 mEq/L.$sca37$,
  $qua37$What is the most likely diagnosis?$qua37$,
  $opa37${"options":["Diabetic ketoacidosis","Hyperglycemic hyperosmolar state","Acute pancreatitis","Chronic kidney disease"],"distractorRationale":{"Hyperglycemic hyperosmolar state":"This condition is less likely due to the patient's age and the presence of metabolic acidosis.","Acute pancreatitis":"While it can cause abdominal pain, it does not typically present with such high blood glucose levels or acidosis.","Chronic kidney disease":"This condition would not explain the acute presentation of severe abdominal pain and metabolic acidosis."},"clinicalReasoning":"Assess the patient's symptoms and lab results to identify the underlying metabolic derangement. Analyze the presence of hyperglycemia, acidosis, and dehydration to differentiate between DKA and other conditions. Integrate the clinical presentation with the pathophysiological understanding of diabetes to arrive at the diagnosis.","keyTakeaways":["When faced with severe hyperglycemia and metabolic acidosis in a diabetic patient, think DKA first."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"diabetic-ketoacidosis","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783286885652","qcScore":8.5,"slotIndex":26,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-05T21:33:11.003Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$opa37$,
  $kya37$Diabetic ketoacidosis$kya37$,
  $exa37$Why this answer is correct
The most likely diagnosis is diabetic ketoacidosis (DKA) due to severe hyperglycemia and metabolic acidosis.
Diabetic ketoacidosis is characterized by high blood glucose levels, low bicarbonate, and ketones in the blood.
The patient's symptoms of abdominal pain, vomiting, and dehydration align with DKA.
The lab findings show metabolic acidosis, indicated by a low serum bicarbonate level.
In practice: On the unit, recognizing DKA promptly is crucial for initiating treatment, which includes insulin therapy and fluid resuscitation to prevent complications.
Why the other options are wrong

Hyperglycemic hyperosmolar state
Trap: Students may confuse DKA with hyperglycemic hyperosmolar state (HHS) due to both conditions involving high blood sugar.
Why it fails here: HHS typically occurs in older adults and is characterized by severe hyperglycemia without significant acidosis, which is not the case here as the patient has metabolic acidosis.
Remember: Understanding the key differences in presentation between DKA and HHS is essential for accurate diagnosis.

Acute pancreatitis
Trap: Some may think acute pancreatitis is the cause due to the abdominal pain.
Why it fails here: While abdominal pain is a symptom, acute pancreatitis would not typically cause such severe hyperglycemia or metabolic acidosis without other signs like elevated pancreatic enzymes.
Remember: Differentiating abdominal pain causes requires considering associated metabolic derangements.

Chronic kidney disease
Trap: Students might consider chronic kidney disease due to the patient's dehydration and polyuria.
Why it fails here: Chronic kidney disease usually presents with more chronic symptoms and does not typically cause acute severe hyperglycemia or metabolic acidosis.
Remember: Recognizing the acute nature of this presentation is key to diagnosing DKA over chronic conditions.
Key takeaway
When faced with severe hyperglycemia and metabolic acidosis in a diabetic patient, think DKA first.

Memory hook: Remember: DKA is like a fire in a diabetic's body — high sugar, low bicarbonate, and signs of dehydration signal an urgent need for intervention.$exa37$,
  4,
  $dma37$reproductive-endocrine$dma37$,
  $tpa37$diabetic-ketoacidosis$tpa37$,
  $sua37$https://www.ncbi.nlm.nih.gov/books/NBK560723/$sua37$,
  $sla37$https://www.ncbi.nlm.nih.gov/books/NBK560723/$sla37$,
  $sqa37$Diabetic ketoacidosis (DKA) represents a critical metabolic emergency marked by hyperglycemia, acidosis, and ketonemia.$sqa37$,
  $cha37$5ebd7813200d1f0dc32f15377ecfded2203ccac86e802806ec6744a99f131e26$cha37$,
  true,
  $rfa37$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK560723/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK560723/"}]$rfa37$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida38$cmr8dn4q600421yaz7do9zw1z$ida38$,
  $fxa38$cue|template_artifact|rationale$fxa38$,
  $sca38$A 28-year-old woman with epilepsy, treated with lamotrigine for the past year, is brought to the emergency department after a witnessed spell. She suddenly became unresponsive, her whole body stiffened, and then all four limbs jerked rhythmically for about 2 minutes. She was confused and exhausted afterward. Neurological examination shows no focal deficits, vital signs are stable, and the serum sodium is 136 mEq/L.$sca38$,
  $qua38$Which of the following is the most likely diagnosis?$qua38$,
  $opa38${"options":["Focal seizure with awareness preserved","Generalized tonic-clonic seizure","Absence seizure with a brief stare","Myoclonic seizure of isolated jerks"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"seizure-mechanisms","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783290603309","qcScore":8.1,"slotIndex":39,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-05T22:38:28.582Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$opa38$,
  $kya38$Generalized tonic-clonic seizure$kya38$,
  $exa38$Sudden unresponsiveness, whole-body stiffening, rhythmic jerking of all limbs for about 2 minutes, and postictal confusion are a generalized tonic-clonic seizure. A focal seizure with preserved awareness stays localized and the person remains aware. Focal seizures can impair awareness, so loss of consciousness alone does not prove a seizure is generalized; bilateral tonic stiffening followed by clonic jerking does. An absence seizure is a brief stare without a convulsion and without a prolonged postictal state. A myoclonic seizure is a single brief jerk or a short cluster of jerks, not a 2-minute convulsion.$exa38$,
  3,
  $dma38$behavioral-nervous$dma38$,
  $tpa38$seizure-mechanisms$tpa38$,
  $sua38$https://www.ncbi.nlm.nih.gov/books/NBK519030/$sua38$,
  $sla38$https://www.ncbi.nlm.nih.gov/books/NBK519030/$sla38$,
  $sqa38$A thorough description of the episode, including the sequence of events, nature of onset, any loss of consciousness, motor or convulsive activity, bilateral involvement, tongue bite, incontinence, stare, automatisms, eye movements, postictal confusion, recovery, and duration of events are essential to elicit.$sqa38$,
  $cha38$1996067712b6420538c83b047ba0fa2cf43936b72bf958b4a6ccdeaf5f939a49$cha38$,
  true,
  $rfa38$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK519030/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK519030/"}]$rfa38$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida39$cmrpvuwkz000b1yh5bg9zfm2j$ida39$,
  $fxa39$rationale$fxa39$,
  $sca39$A 28-year-old woman presents to the clinic with fatigue, pallor, and shortness of breath during physical activity. She reports a history of heavy menstrual periods, and her laboratory results show a hemoglobin level of 8 g/dL, mean corpuscular volume (MCV) of 70 fL, and a reticulocyte count of 2%. Physical examination reveals conjunctival pallor and a heart rate of 100 beats per minute.$sca39$,
  $qua39$What is the most likely mechanism of this patient's condition?$qua39$,
  $opa39${"options":["Iron deficiency due to chronic blood loss","Vitamin B12 deficiency leading to impaired erythropoiesis","Bone marrow infiltration by malignant cells","Sideroblastic anemia due to lead poisoning"],"distractorRationale":{"Vitamin B12 deficiency leading to impaired erythropoiesis":"This option fails because vitamin B12 deficiency typically results in **macrocytic anemia**, characterized by larger red blood cells, which is not consistent with the patient's low MCV of 70 fL. (Understanding the types of anemia helps differentiate between microcytic and macrocytic causes.)","Bone marrow infiltration by malignant cells":"This option is incorrect because bone marrow infiltration would typically present with **pancytopenia** (low red and white blood cells and platelets) rather than isolated microcytic anemia. (Recognizing the specific laboratory findings is crucial for accurate diagnosis.)","Sideroblastic anemia due to lead poisoning":"This option does not apply here as sideroblastic anemia is characterized by the presence of **ringed sideroblasts** in the bone marrow, which is not indicated in this case. (Differentiating between types of microcytic anemia is essential for proper diagnosis.)"},"clinicalReasoning":"The patient's condition is most likely due to iron deficiency from chronic blood loss. **Microcytic anemia** is characterized by low hemoglobin and low mean corpuscular volume (MCV). The patient's **heavy menstrual periods** suggest a source of chronic blood loss.","keyTakeaways":["When evaluating anemia, always consider the patient's history of blood loss, especially in cases of microcytic anemia."],"taskCategory":"professionalism","blueprintTopic":"anemia-workup","blueprintSystem":"hematology-immunology","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349531909","qcScore":8.1,"slotIndex":12,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:39:44.282Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa39$,
  $kya39$Iron deficiency due to chronic blood loss$kya39$,
  $exa39$Heavy menses, hemoglobin 8 g/dL, and MCV 70 fL are iron deficiency from chronic blood loss. The corrected reticulocyte count is the reticulocyte percent times the patient's hematocrit divided by a normal hematocrit. At this hemoglobin a raw reticulocyte count of 2% corrects to less than 2%, so production is not keeping up. That hypoproliferative pattern fits iron deficiency. Vitamin B12 deficiency causes macrocytic anemia. Marrow infiltration usually lowers more than one cell line. Lead-related sideroblastic anemia is not suggested by menstrual blood loss, and ring sideroblasts are not described.$exa39$,
  3,
  $dma39$blood-lymph-immune$dma39$,
  $tpa39$anemia-workup$tpa39$,
  $sua39$https://www.ncbi.nlm.nih.gov/books/NBK499994/$sua39$,
  $sla39$https://www.ncbi.nlm.nih.gov/books/NBK499994/$sla39$,
  $sqa39$The etiology of anemia depends on whether the anemia is hypoproliferative (i.e., corrected reticulocyte count <2%) or hyperproliferative (i.e., corrected reticulocyte count >2%).$sqa39$,
  $cha39$4e697a76a1d50ea27662e40a95a965eac272d482f05c12e9f61c42f6e3dc75f4$cha39$,
  true,
  $rfa39$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499994/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499994/"}]$rfa39$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida40$cmrr4t0ta00071y6p5jygmzxt$ida40$,
  $fxa40$template_artifact$fxa40$,
  $sca40$A 62-year-old man presents to the emergency department with fatigue and weight loss over the past three months. He has a history of smoking and chronic obstructive pulmonary disease (COPD). On examination, he has pallor and lymphadenopathy. Laboratory tests reveal a hemoglobin level of 9.5 g/dL and an elevated white blood cell count with 70% lymphocytes. A peripheral blood smear shows atypical lymphocytes. The physician suspects a hematologic malignancy.$sca40$,
  $qua40$Which pathophysiologic process best explains these findings?$qua40$,
  $opa40${"kind":"image_based","stepLevel":"step1","blueprintSystem":"hematology-immunology","blueprintTopic":"tumor-markers","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784425001227","qcScore":8.4,"slotIndex":7,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T01:38:35.167Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Clonal expansion of lymphocytes due to a genetic mutation","Autoimmune destruction of circulating red blood cells","Infiltration of bone marrow by a metastatic carcinoma","Increased erythropoietin production due to hypoxia"],"taskCategory":"health-maintenance"}$opa40$,
  $kya40$Clonal expansion of lymphocytes due to a genetic mutation$kya40$,
  $exa40$Why this answer is correct
Clonal expansion of lymphocytes due to a genetic mutation explains the patient's hematologic findings.
Clonal expansion refers to the proliferation of a single type of lymphocyte, which is a hallmark of hematologic malignancies like chronic lymphocytic leukemia (CLL).
The patient's anemia (low hemoglobin) and lymphadenopathy (swollen lymph nodes) are consistent with this diagnosis.
A peripheral blood smear showing atypical lymphocytes further supports the presence of a malignancy.
In practice: In practice, recognizing clonal expansion helps guide further diagnostic testing and treatment options for patients suspected of having hematologic cancers. Early identification can significantly impact patient outcomes.
Why the other options are wrong

Autoimmune destruction of red blood cells
Trap: Students may think this option fits due to the presence of anemia.
Why it fails here: However, autoimmune hemolytic anemia typically does not present with lymphadenopathy or atypical lymphocytes, which are key features in this case.
Remember: This highlights the importance of understanding the specific clinical features associated with different hematologic disorders.

Infiltration of bone marrow by metastatic cancer
Trap: This option might be chosen because the patient has a history of smoking, which could suggest lung cancer.
Why it fails here: However, metastatic cancer usually leads to more severe cytopenias (low blood cell counts) and does not typically cause the presence of atypical lymphocytes seen in this patient.
Remember: Understanding the distinction between primary hematologic malignancies and secondary effects of solid tumors is crucial.

Increased erythropoietin production due to hypoxia
Trap: Students might consider this option due to the patient's history of COPD, which can cause hypoxia.
Why it fails here: Increased erythropoietin would lead to increased red blood cell production, not atypical lymphocytes or lymphadenopathy, which are indicative of a malignancy.
Remember: This reinforces the need to connect clinical symptoms with the underlying pathophysiological processes.
Key takeaway
When evaluating hematologic conditions, remember that atypical lymphocytes often indicate a clonal expansion process, commonly seen in malignancies like CLL.

Memory hook: Think of 'CLL' for 'Clonal Lymphocyte Leukemia' when you see atypical lymphocytes in a patient with fatigue and lymphadenopathy.$exa40$,
  2,
  $dma40$blood-lymph-immune$dma40$,
  $tpa40$tumor-markers$tpa40$,
  $sua40$https://medlineplus.gov/chroniclymphocyticleukemia.html$sua40$,
  $sla40$https://medlineplus.gov/chroniclymphocyticleukemia.html$sla40$,
  $sqa40$CLL happens when there are changes in the genetic material (DNA) in bone marrow cells.$sqa40$,
  $cha40$81c66646d2f1374f562fb66c982f0ff3869526a5dc4771ef7ba60143653dd89b$cha40$,
  true,
  $rfa40$[{"label": "https://medlineplus.gov/chroniclymphocyticleukemia.html", "url": "https://medlineplus.gov/chroniclymphocyticleukemia.html"}]$rfa40$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida41$cmrruxvq000mj1y8whj3qzskq$ida41$,
  $fxa41$wrong_blueprint|cue|rationale$fxa41$,
  $sca41$A 30-year-old woman who lives in the United States presents with fatigue, weight gain, and cold intolerance. On examination, her heart rate is 58 beats/min, she has dry skin and hair loss, and the thyroid is diffusely firm and nontender. Laboratory tests reveal an elevated TSH level and a low free T4 level.$sca41$,
  $qua41$What is the most likely underlying mechanism of this patient's condition?$qua41$,
  $opa41${"options":["Autoimmune destruction of thyroid tissue","Iodine deficiency","Pituitary adenoma","Thyroid hormone resistance (tissues that do not respond to thyroid hormone)"],"distractorRationale":{"Iodine deficiency":"Less common in developed countries due to iodine supplementation.","Pituitary adenoma":"Would typically cause elevated TSH and not low free T4.","Thyroid hormone resistance (tissues that do not respond to thyroid hormone)":"Rare condition that does not present with these lab findings."},"clinicalReasoning":"Assess the clinical presentation and lab findings to analyze the underlying mechanism of hypothyroidism.","keyTakeaways":["When evaluating hypothyroidism, prioritize autoimmune destruction of the thyroid gland as the most common cause."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"hypothyroidism","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784469099475","qcScore":8.1,"slotIndex":34,"stepLevel":"step1","examNumber":9111,"generatedAt":"2026-07-19T13:52:26.422Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$opa41$,
  $kya41$Autoimmune destruction of thyroid tissue$kya41$,
  $exa41$High TSH with low free T4 is primary hypothyroidism. In the United States the most common cause is autoimmune destruction of the thyroid, and a diffusely firm nontender gland fits that process. Too little iodine can cause the same labs, but it is uncommon where iodine is supplemented. A pituitary adenoma that causes hypothyroidism leaves TSH low or inappropriately normal while free T4 is low. A TSH-secreting adenoma raises both TSH and free T4. Thyroid hormone resistance usually has a normal or high free T4, not a low one.$exa41$,
  3,
  $dma41$reproductive-endocrine$dma41$,
  $tpa41$hypothyroidism$tpa41$,
  $sua41$https://medlineplus.gov/hypothyroidism.html$sua41$,
  $sla41$https://medlineplus.gov/hypothyroidism.html$sla41$,
  $sqa41$Hashimoto's disease, an autoimmune disorder where your immune system attacks your thyroid. This is the most common cause.$sqa41$,
  $cha41$7811f51434d7f42be8b10024d4c4426812072364ea6b41050ff3ec6373138057$cha41$,
  true,
  $rfa41$[{"label": "https://medlineplus.gov/hypothyroidism.html", "url": "https://medlineplus.gov/hypothyroidism.html"}]$rfa41$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida42$cmr4gc43j026b1ykyv5fk17fo$ida42$,
  $fxa42$rationale$fxa42$,
  $sca42$A 72-year-old woman is admitted to the hospital with acute heart failure exacerbation. She has a history of hypertension and coronary artery disease. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she has bilateral crackles on lung auscultation. A chest X-ray shows pulmonary congestion. Initial laboratory results reveal a BNP of 1200 pg/mL.$sca42$,
  $qua42$What is the most appropriate next step in the management of this patient?$qua42$,
  $opa42${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-discharge-planning","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783053515892","qcScore":8.4,"slotIndex":50,"stepLevel":"step3","examNumber":9324,"generatedAt":"2026-07-03T04:44:48.592Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Start oral beta-blocker therapy","Obtain a cardiac echocardiogram","Initiate intravenous furosemide","Administer morphine sulfate"],"taskCategory":"health-maintenance"}$opa42$,
  $kya42$Initiate intravenous furosemide$kya42$,
  $exa42$Bilateral crackles, pulmonary congestion, and a BNP of 1200 pg/mL are volume-overload acute heart failure. The immediate drug treatment is an intravenous loop diuretic such as furosemide. Hypotension is not the reason to give the diuretic; congestion is. A systolic pressure of 90 mm Hg is a reason to avoid intravenous nitroglycerin, which is contraindicated when shock is a concern, and it is a reason not to start an oral beta-blocker during the acute decompensation. Morphine is not routine therapy for acute heart failure. Echocardiography guides later care but should not delay diuresis for pulmonary edema.$exa42$,
  4,
  $dma42$cardiovascular$dma42$,
  $tpa42$chf-management$tpa42$,
  $sua42$https://www.nice.org.uk/guidance/cg187/chapter/Recommendations$sua42$,
  $sla42$https://www.nice.org.uk/guidance/cg187/chapter/Recommendations$sla42$,
  $sqa42$Offer intravenous diuretic therapy to people with acute heart failure.$sqa42$,
  $cha42$7969d8d48d10093664b3cb4699a2c4a191e99625d92ed00b2e46b4b7b46af93a$cha42$,
  true,
  $rfa42$[{"label": "https://www.nice.org.uk/guidance/cg187/chapter/Recommendations", "url": "https://www.nice.org.uk/guidance/cg187/chapter/Recommendations"}]$rfa42$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida43$cmr8cn9sd00nn1ylokatc5kvv$ida43$,
  $fxa43$wrong_blueprint$fxa43$,
  $sca43$A 50-year-old woman with a history of hypertension and hyperlipidemia undergoes an elective knee replacement in the surgical unit. On postoperative day 1, she presents with hypotension, with a blood pressure of 80/50 mm Hg and a heart rate of 120 bpm. Additionally, her urine output has decreased significantly, raising concerns for possible hypovolemia or opioid-related side effects.$sca43$,
  $qua43$What is the most appropriate next step in the management of this patient?$qua43$,
  $opa43${"options":["Administer intravenous fluids","Increase morphine (an opioid analgesic) dosage","Administer a vasopressor","Obtain a stat echocardiogram"],"blueprintTopic":"postoperative-hypotension","blueprintSystem":"multisystem"}$opa43$,
  $kya43$Administer intravenous fluids$kya43$,
  $exa43$In this scenario, the patient is likely experiencing hypotension due to either hypovolemia or opioid-induced side effects. The most appropriate initial management step is to administer intravenous fluids to restore blood volume and improve hemodynamics. Increasing the morphine dosage would likely worsen hypotension, while administering a vasopressor may not address the underlying cause. A stat echocardiogram is not immediately necessary without further evidence of cardiac dysfunction.

Clinical reasoning: The patient's hypotension and decreased urine output suggest a need for volume resuscitation. Administering intravenous fluids is the standard first-line treatment for hypotension in postoperative patients, particularly when hypovolemia is suspected. Other interventions may be considered if the patient does not respond to fluid therapy.

Why other options are incorrect:
• Increase morphine (an opioid analgesic) dosage: This option would likely exacerbate the patient's hypotension and is contraindicated in this scenario.
• Administer a vasopressor: While vasopressors can be used for hypotension, they are not the first-line treatment in the setting of suspected hypovolemia.
• Obtain a stat echocardiogram: This is not the immediate priority; fluid resuscitation should be attempted first to assess the response before further cardiac evaluation.$exa43$,
  4,
  $dma43$multisystem$dma43$,
  $tpa43$postoperative-hypotension$tpa43$,
  $sua43$https://www.nice.org.uk/guidance/cg174/chapter/Recommendations$sua43$,
  $sla43$https://www.nice.org.uk/guidance/cg174/chapter/Recommendations$sla43$,
  $sqa43$Indicators that a patient may need urgent fluid resuscitation include: systolic blood pressure is less than 100 mmHg.$sqa43$,
  $cha43$bf21bcbbc22a5bb2f4be4aba1f03efc776cca99cee33693d8b25d2ded7d52f10$cha43$,
  true,
  $rfa43$[{"label": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations", "url": "https://www.nice.org.uk/guidance/cg174/chapter/Recommendations"}]$rfa43$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida44$cmr8ehz8w01a91ylo0ftj0gae$ida44$,
  $fxa44$wrong_key|rationale|wrong_blueprint|difficulty$fxa44$,
  $sca44$A 35-year-old man presents to the emergency department with a 1-hour history of sudden onset left-sided weakness and slurred speech. His blood pressure is 180/110 mm Hg, and a CT scan of the head shows no acute intracranial hemorrhage. He has a history of hypertension and hyperlipidemia but is not on any medications.$sca44$,
  $qua44$What is the next best step in management?$qua44$,
  $opa44${"options":["Administer thrombolytics","Start aspirin therapy","Obtain an MRI of the brain","Initiate intravenous antihypertensives"],"distractorRationale":{"Administer thrombolytics":"Correct answer; this is the most appropriate acute management for an ischemic stroke without hemorrhage.","Start aspirin therapy":"While aspirin is important for secondary prevention, it is not the immediate treatment for acute ischemic stroke.","Obtain an MRI of the brain":"An MRI is not necessary in the acute setting when CT has ruled out hemorrhage.","Initiate intravenous antihypertensives":"Blood pressure management is not needed unless the patient is symptomatic from hypertension."},"clinicalReasoning":"The patient's acute neurological symptoms and CT findings suggest an ischemic stroke. Analyzing the time frame and treatment options, thrombolytics are indicated. Integrating this information confirms the decision to administer thrombolytics.","kind":"vignette","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"acute-ischemic-stroke","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783292258170","examNumber":9315,"slotIndex":13,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T22:58:42.767Z"}}$opa44$,
  $kya44$Initiate intravenous antihypertensives$kya44$,
  $exa44$Sudden focal deficits within 1 hour and a CT scan without hemorrhage make him a candidate for thrombolysis, but only after the blood pressure is below 185/110 mm Hg. His pressure is 180/110 mm Hg, so the diastolic value is not yet below 110. The next step is an intravenous antihypertensive such as labetalol or nicardipine, with the pressure rechecked before alteplase. Aspirin is used for acute ischemic stroke when thrombolysis is not given, and it is delayed about 24 hours after alteplase. MRI is not required once CT has excluded hemorrhage. Symptomatic hypertension is not the rule that decides blood-pressure treatment in this setting.$exa44$,
  4,
  $dma44$behavioral-nervous$dma44$,
  $tpa44$acute-ischemic-stroke$tpa44$,
  $sua44$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sua44$,
  $sla44$https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/$sla44$,
  $sqa44$If intravenous tPA (alteplase) is to be administered, carefully lower systolic BP to < 185 mm Hg and diastolic BP < 110 mm Hg before initiating fibrinolytic therapy.$sqa44$,
  $cha44$8c9810bec7624ec27ce42bd6b13d188b3ecb7e7c9ac9a0ea3dbccb33591b8188$cha44$,
  true,
  $rfa44$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7803067/"}]$rfa44$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida45$cmr8isfb702ed1ylo7pl7fdsl$ida45$,
  $fxa45$wrong_blueprint|difficulty$fxa45$,
  $sca45$A 35-year-old woman presents to the clinic with fatigue and weight gain over the past year. She reports feeling cold all the time and has noticed her hair becoming thinner. On examination, her blood pressure is 110/70 mm Hg, heart rate is 60 bpm, and she has dry skin and a delayed reflex. Laboratory tests reveal a TSH of 8.5 mIU/L and free T4 of 0.6 ng/dL.$sca45$,
  $qua45$What is the most likely diagnosis?$qua45$,
  $opa45${"options":["Hyperthyroidism","Hypothyroidism","Hashimoto's thyroiditis","Subclinical hypothyroidism"],"distractorRationale":{"Hyperthyroidism":"This condition would show low TSH and high T4 levels, which is not the case here.","Hashimoto's thyroiditis":"While this is a cause of hypothyroidism, it does not describe the condition itself.","Subclinical hypothyroidism":"This would have a normal T4 level, which is not present in this patient."},"clinicalReasoning":"Assess the patient's symptoms and laboratory results. Analyze the elevated TSH and low free T4 levels to confirm the diagnosis of hypothyroidism. Integrate this information to conclude that the patient has hypothyroidism.","kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"hypothyroidism","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783299363408","examNumber":9327,"slotIndex":56,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T00:57:10.024Z"}}$opa45$,
  $kya45$Hypothyroidism$kya45$,
  $exa45$The correct answer is hypothyroidism, as indicated by the elevated TSH and low free T4 levels, along with the patient's symptoms of fatigue, weight gain, and cold intolerance. Hyperthyroidism (wrong option 1) would present with low TSH and high T4 levels. Hashimoto's thyroiditis (wrong option 2) is a cause of hypothyroidism but does not specifically describe the condition itself. Subclinical hypothyroidism (wrong option 3) would have a normal T4 level, which is not the case here. Key takeaway: Hypothyroidism can lead to significant metabolic changes and requires appropriate management. Memory hook: Remember the symptoms of hypothyroidism: Weight gain, Cold intolerance, and Fatigue.

Clinical reasoning: Assess the patient's symptoms and laboratory results. Analyze the elevated TSH and low free T4 levels to confirm the diagnosis of hypothyroidism. Integrate this information to conclude that the patient has hypothyroidism.

Why other options are incorrect:
• Hyperthyroidism: This condition would show low TSH and high T4 levels, which is not the case here.
• Hashimoto's thyroiditis: While this is a cause of hypothyroidism, it does not describe the condition itself.
• Subclinical hypothyroidism: This would have a normal T4 level, which is not present in this patient.$exa45$,
  2,
  $dma45$reproductive-endocrine$dma45$,
  $tpa45$hypothyroidism$tpa45$,
  $sua45$https://medlineplus.gov/hypothyroidism.html$sua45$,
  $sla45$https://medlineplus.gov/hypothyroidism.html$sla45$,
  $sqa45$Hypothyroidism, or underactive thyroid, happens when your thyroid gland doesn't make enough thyroid hormones to meet your body's needs.$sqa45$,
  $cha45$4b1a49e23365be42661d553522da02fff1f645d2a570dc0fec93e733e3784b90$cha45$,
  true,
  $rfa45$[{"label": "https://medlineplus.gov/hypothyroidism.html", "url": "https://medlineplus.gov/hypothyroidism.html"}]$rfa45$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida46$cmr8lc4st009l1ygiq5vr5fb0$ida46$,
  $fxa46$wrong_blueprint$fxa46$,
  $sca46$A 45-year-old woman presents to the emergency department with a 3-day history of fever, chills, and a productive cough. She has a history of asthma and is currently taking albuterol as needed. On examination, her temperature is 102°F, respiratory rate is 22 breaths/min, and she has decreased breath sounds on the right side. A chest X-ray shows a right lower lobe opacity. Laboratory tests reveal a white blood cell count of 15,000/mm³ with a left shift.$sca46$,
  $qua46$What is the most likely diagnosis?$qua46$,
  $opa46${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"pneumonia","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783303814341","qcScore":8.1,"slotIndex":8,"stepLevel":"step3","examNumber":9304,"generatedAt":"2026-07-06T02:12:09.525Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Pneumonia","Pulmonary embolism","Asthma exacerbation","Bronchitis"],"taskCategory":"clinical-intervention"}$opa46$,
  $kya46$Pneumonia$kya46$,
  $exa46$Why this answer is correct
The most likely diagnosis is pneumonia due to the patient's fever, cough, and chest X-ray findings.
Fever and productive cough are classic signs of pneumonia.
The chest X-ray shows a right lower lobe opacity, indicating infection.
An elevated white blood cell count with a left shift suggests a bacterial cause.
In practice: In practice, recognizing pneumonia early is crucial for timely antibiotic treatment, which can significantly improve patient outcomes.
Why the other options are wrong

Pulmonary embolism
Trap: Students may confuse pneumonia with pulmonary embolism due to respiratory symptoms.
Why it fails here: Pulmonary embolism typically presents with sudden onset dyspnea and pleuritic chest pain, not fever and productive cough, and chest X-ray findings usually do not show opacity indicative of infection.
Remember: Understanding the typical presentations of respiratory conditions helps differentiate pneumonia from other diagnoses.

Asthma exacerbation
Trap: Some may think asthma exacerbation is the cause due to the patient's history of asthma.
Why it fails here: Asthma exacerbation does not typically present with fever or localized opacity on chest X-ray, which are key indicators of pneumonia.
Remember: Recognizing that asthma exacerbations primarily cause wheezing and not fever or opacity is essential for accurate diagnosis.

Bronchitis
Trap: Students might consider bronchitis due to the productive cough.
Why it fails here: While bronchitis can cause a cough, it usually does not lead to significant opacity on chest X-ray or fever as seen in pneumonia.
Remember: Differentiating between bronchitis and pneumonia is important, especially when imaging shows signs of infection.
Key takeaway
When a patient presents with fever, cough, and chest X-ray opacity, think pneumonia first.

Memory hook: Remember: Fever + Cough + Opacity = Pneumonia.$exa46$,
  2,
  $dma46$respiratory-renal$dma46$,
  $tpa46$pneumonia$tpa46$,
  $sua46$https://medlineplus.gov/pneumonia.html$sua46$,
  $sla46$https://medlineplus.gov/pneumonia.html$sla46$,
  $sqa46$Pneumonia is an infection in one or both of your lungs.$sqa46$,
  $cha46$0190ec62a3733223c7c0c3543b4fd7a99ae0f034a329c34c6f1b282705796203$cha46$,
  true,
  $rfa46$[{"label": "https://medlineplus.gov/pneumonia.html", "url": "https://medlineplus.gov/pneumonia.html"}]$rfa46$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida47$cmr97i3r1004w1ywyxuwcigyv$ida47$,
  $fxa47$wrong_blueprint$fxa47$,
  $sca47$A 62-year-old woman presents to the emergency department with a 2-day history of worsening shortness of breath and a productive cough. She has a history of COPD and is currently on a long-acting bronchodilator. Vital signs reveal a respiratory rate of 24 breaths/min, oxygen saturation of 88% on room air, and a blood pressure of 130/80 mm Hg. A chest X-ray shows hyperinflation but no consolidation. Her laboratory tests show a white blood cell count of 12,000/mm³ with a left shift.$sca47$,
  $qua47$What is the most likely diagnosis?$qua47$,
  $opa47${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-exacerbation","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341257709","examNumber":9302,"slotIndex":58,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T12:38:34.500Z"},"options":["Acute exacerbation of chronic obstructive pulmonary disease","Pneumonia","Congestive heart failure (a heart that cannot pump enough blood)","Pulmonary embolism"]}$opa47$,
  $kya47$Acute exacerbation of chronic obstructive pulmonary disease$kya47$,
  $exa47$The correct diagnosis is an acute exacerbation of COPD, which is characterized by worsening respiratory symptoms, often triggered by infections or environmental factors. The patient's history of COPD, productive cough, and hypoxia indicate this exacerbation. Pneumonia could be considered, but the absence of consolidation on chest X-ray and the patient's COPD history make it less likely. Congestive heart failure (a heart that cannot pump enough blood) typically presents with different signs, such as edema and elevated jugular venous pressure, which are not noted here. Pulmonary embolism is less likely given the absence of pleuritic chest pain or hemoptysis.

Clinical reasoning: Assess the patient's history of COPD and current symptoms. Analyze the vital signs and lab results, noting the elevated respiratory rate and low oxygen saturation. Integrate this information with the imaging findings to conclude that the most likely diagnosis is an acute exacerbation of COPD.

Why other options are incorrect:
• Pneumonia: While pneumonia could present similarly, the lack of consolidation on imaging and the patient's known COPD history make this less likely.
• Congestive heart failure (a heart that cannot pump enough blood): This condition usually presents with signs of fluid overload, which are not present in this patient.
• Pulmonary embolism: This diagnosis typically presents with sudden onset dyspnea and may include pleuritic pain, which is not described in this case.$exa47$,
  2,
  $dma47$respiratory-renal$dma47$,
  $tpa47$copd-exacerbation$tpa47$,
  $sua47$https://goldcopd.org/wp-content/uploads/2024/12/Pocket-Guide-2025-v1.2-FINAL-covered-13Dec2024_WMV.pdf$sua47$,
  $sla47$https://goldcopd.org/wp-content/uploads/2024/12/Pocket-Guide-2025-v1.2-FINAL-covered-13Dec2024_WMV.pdf$sla47$,
  $sqa47$An exacerbation of COPD is defined as an event characterized by dyspnea and/or cough and sputum that worsen over < 14 days.$sqa47$,
  $cha47$dcec43153f2a52463ffa470d34c7512ab250f22acab213491f3c25bc18e04d9f$cha47$,
  true,
  $rfa47$[{"label": "https://goldcopd.org/wp-content/uploads/2024/12/Pocket-Guide-2025-v1.2-FINAL-covered-13Dec2024_WMV.pdf", "url": "https://goldcopd.org/wp-content/uploads/2024/12/Pocket-Guide-2025-v1.2-FINAL-covered-13Dec2024_WMV.pdf"}]$rfa47$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida48$cmru3gc8a00al1y7wlpv0bg1q$ida48$,
  $fxa48$wrong_blueprint$fxa48$,
  $sca48$A 50-year-old woman presents to the clinic with fatigue and weight gain over the past few months. She reports feeling cold all the time and has noticed her hair thinning. On examination, her heart rate is 60 bpm, and she has dry skin and a delayed reflex response. Laboratory tests reveal an elevated TSH and low free T4.$sca48$,
  $qua48$What is the most likely diagnosis?$qua48$,
  $opa48${"kind":"sequential","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"hypothyroidism","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784604203681","examNumber":9304,"slotIndex":24,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-21T03:24:16.890Z"},"options":["Hyperthyroidism","Hypothyroidism","Hashimoto's thyroiditis","Thyroid storm"]}$opa48$,
  $kya48$Hypothyroidism$kya48$,
  $exa48$The patient's symptoms of fatigue, weight gain, cold intolerance, and dry skin, along with laboratory findings of elevated TSH and low free T4, are indicative of hypothyroidism. This condition is characterized by insufficient thyroid hormone production. Hyperthyroidism would present with weight loss, heat intolerance, and increased heart rate. Hashimoto's thyroiditis is an autoimmune cause of hypothyroidism, but the vignette does not specify autoimmune features. Thyroid storm is a life-threatening condition associated with hyperthyroidism, which this patient does not have.

Clinical reasoning: Assess the patient's symptoms and lab results, analyze the thyroid function tests, and integrate the findings to confirm the diagnosis of hypothyroidism.

Why other options are incorrect:
• Hyperthyroidism: This condition typically presents with weight loss, heat intolerance, and increased heart rate, which are not present here.
• Hashimoto's thyroiditis: While it can cause hypothyroidism, the vignette does not provide evidence of autoimmune features.
• Thyroid storm: This is associated with severe hyperthyroidism and presents with symptoms of hypermetabolism, which this patient does not exhibit.$exa48$,
  2,
  $dma48$reproductive-endocrine$dma48$,
  $tpa48$hypothyroidism$tpa48$,
  $sua48$https://medlineplus.gov/hypothyroidism.html$sua48$,
  $sla48$https://medlineplus.gov/hypothyroidism.html$sla48$,
  $sqa48$The symptoms of hypothyroidism can vary from person to person and may include fatigue, weight gain, trouble tolerating cold, dry skin, dry thinning hair, and slowed heart rate.$sqa48$,
  $cha48$87c847fabfb2421e6793f6c3da7e4608fdfe5cacd9eae988bd190d5357a666ce$cha48$,
  true,
  $rfa48$[{"label": "https://medlineplus.gov/hypothyroidism.html", "url": "https://medlineplus.gov/hypothyroidism.html"}]$rfa48$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida49$cmru8v4ax000t1y0sh8a9c8kp$ida49$,
  $fxa49$not_single_best$fxa49$,
  $sca49$A 7-year-old boy with a history of asthma presents to the emergency department with wheezing and difficulty breathing after playing outside. His mother reports that he forgot to take his controller medication today. On examination, he has a respiratory rate of 30 breaths per minute, an oxygen saturation of 95% on room air, and diffuse wheezing on auscultation.$sca49$,
  $qua49$What is the most appropriate next step in management?$qua49$,
  $opa49${"options":["Administer oral corticosteroids","Give nebulized albuterol","Provide oxygen therapy","Initiate magnesium sulfate"],"distractorRationale":{"Administer oral corticosteroids":"This option fails because oral corticosteroids are not the first-line treatment for immediate relief of acute asthma symptoms.","Provide oxygen therapy":"While oxygen is important, it does not address the underlying bronchospasm, which is the primary issue.","Initiate magnesium sulfate":"Magnesium sulfate is typically reserved for more severe cases and is not appropriate at this stage."},"clinicalReasoning":"In this acute asthma exacerbation, the child's wheezing and low oxygen saturation indicate the need for immediate bronchodilation. Administering nebulized albuterol is the most effective initial management step.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pediatrics","blueprintTopic":"pediatric-ccs","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784613000508","examNumber":9301,"slotIndex":32,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-21T05:51:01.043Z"}}$opa49$,
  $kya49$Give nebulized albuterol$kya49$,
  $exa49$He is wheezing with known asthma and an oxygen saturation of 95%, so supplemental oxygen is not needed to reach a saturation of at least 90%. The immediate treatment of the bronchospasm is nebulized albuterol, a short-acting beta-agonist. Oral corticosteroids are added for a moderate or severe exacerbation or when the response to the beta-agonist is incomplete; they are not the first drug for this attack. Intravenous magnesium is reserved for a severe exacerbation that does not respond to initial treatment.$exa49$,
  3,
  $dma49$human-development$dma49$,
  $tpa49$pediatric-ccs$tpa49$,
  $sua49$https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf$sua49$,
  $sla49$https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf$sla49$,
  $sqa49$Oxygen to achieve SaO2 ≥90% Inhaled SABA by nebulizer or MDI with valved holding chamber, up to 3 doses in first hour$sqa49$,
  $cha49$c332f0198425ce819fb3532e507225f9fd0d00d94c5f766b1aed229934b15e7e$cha49$,
  true,
  $rfa49$[{"label": "https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf", "url": "https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf"}]$rfa49$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida50$cmrvwolmp00171ye85e3z94dz$ida50$,
  $fxa50$wrong_blueprint$fxa50$,
  $sca50$Pharmaceutical advertisement — Levothyroxine
Levothyroxine: Dosing Considerations in Hypothyroidism
Indications: Hypothyroidism, thyroid hormone replacement
Warnings: Over-treatment may cause symptoms of hyperthyroidism, such as osteoporosis and atrial fibrillation$sca50$,
  $qua50$A 50-year-old woman with hypothyroidism is on levothyroxine. Her TSH is suppressed, and she reports palpitations. What should be the next step?$qua50$,
  $opa50${"stepLevel":"step3","kind":"drug_ad","ad":{"drug":"Levothyroxine","headline":"Levothyroxine: Dosing Considerations in Hypothyroidism","indications":"Hypothyroidism, thyroid hormone replacement","warnings":"Over-treatment may cause symptoms of hyperthyroidism, such as osteoporosis and atrial fibrillation"},"structureIds":["heart","lungs","kidneys"],"options":["Increase levothyroxine dose","Maintain current dose and recheck TSH in 6 months","Reduce levothyroxine dose","Switch to liothyronine"],"blueprintTopic":"levothyroxine-dosing","blueprintSystem":"reproductive-endocrine"}$opa50$,
  $kya50$Reduce levothyroxine dose$kya50$,
  $exa50$Suppressed TSH and symptoms like palpitations suggest over-treatment. Reducing the levothyroxine dose will help restore normal thyroid hormone levels and prevent complications.$exa50$,
  3,
  $dma50$reproductive-endocrine$dma50$,
  $tpa50$levothyroxine-dosing$tpa50$,
  $sua50$https://www.aafp.org/afp/2021/0515/p605.pdf$sua50$,
  $sla50$https://www.aafp.org/afp/2021/0515/p605.pdf$sla50$,
  $sqa50$When TSH is low (over-replacement), the daily dosage should be decreased by 12.5 to 25 mcg.$sqa50$,
  $cha50$f95cb1af5d1e440fbf5bea7f5d43570f132a392c66f39fc16c65b5b0bc8ada90$cha50$,
  true,
  $rfa50$[{"label": "https://www.aafp.org/afp/2021/0515/p605.pdf", "url": "https://www.aafp.org/afp/2021/0515/p605.pdf"}]$rfa50$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida51$cmrwa0apt000n1ynhey6hoxxc$ida51$,
  $fxa51$wrong_blueprint$fxa51$,
  NULL,
  $qua51$A 40-year-old man with untreated hypertension comes to the emergency department 1 hour after the sudden onset of severe tearing chest pain radiating to his back. Temperature is 36.8°C (98.3°F), heart rate is 105/min, blood pressure is 210/110 mm Hg in both arms and oxygen saturation is 98% on room air. The ECG shows sinus tachycardia without ST-segment changes. CT angiography shows a type B aortic dissection beginning beyond the left subclavian artery, with no rupture or malperfusion. Which of the following is the most appropriate next step in management?$qua51$,
  $opa51${"options":["Emergency open surgical repair","Repeat the CT angiography in 6 hours","Administer intravenous labetalol","Start intravenous nitroprusside alone"],"blueprintTopic":"aortic-dissection","blueprintSystem":"cardiovascular"}$opa51$,
  $kya51$Administer intravenous labetalol$kya51$,
  $exa51$Correct answer: C. Administer intravenous labetalol. He has an acute uncomplicated type B aortic dissection. Initial treatment is anti-impulse therapy to reduce aortic wall stress, starting with an intravenous beta-blocker such as labetalol, aiming for a systolic pressure below 120 mm Hg and a heart rate of 60 to 80/min. Why the other options are wrong: A. Uncomplicated type B dissection, without rupture or malperfusion, is managed medically at first. B. The diagnosis is made; the priority is reducing aortic wall stress now. D. A vasodilator alone does not slow the heart; anti-impulse therapy starts with an intravenous beta-blocker, adding a vasodilator if needed.$exa51$,
  5,
  $dma51$cardiovascular$dma51$,
  $tpa51$aortic-dissection$tpa51$,
  $sua51$https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection$sua51$,
  $sla51$https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection$sla51$,
  $sqa51$Treatment of aortic dissection uses beta-blockers and other medications to control blood pressure, and usually endovascular repair or open surgical repair.$sqa51$,
  $cha51$1b710ceab1ed366d7ac8a7f0eafa6f1c3fc34bbdb0824a0eac3aead8bd31acd1$cha51$,
  true,
  $rfa51$[{"label": "https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/diseases-of-the-aorta-and-its-branches/aortic-dissection"}]$rfa51$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida52$6be163e9-ffc5-4080-a943-2d5ac73a7514$ida52$,
  $fxa52$template_artifact$fxa52$,
  $sca52$A 29-year-old woman at 32 weeks of gestation is found to have platelets of 18,000/uL. She has new gingival bleeding and several oral blood blisters. Blood pressure is 118/72 mm Hg, there is no proteinuria, and aminotransferases are normal. Hemoglobin and leukocytes are normal and the smear shows no schistocytes. She had ITP in her twenties that responded to prednisone. The fetus is growing well with a normal tracing. An obstetric colleague recommends cesarean delivery today solely because the platelet count is low.$sca52$,
  $qua52$Which plan is most appropriate?$qua52$,
  $opa52${"options":["Prednisone or IVIG, with delivery based on obstetric indications","Cesarean delivery today solely because the platelet count is low","Daily warfarin until delivery to prevent a placental clot","Immediate splenectomy before any trial of medical therapy","Aspirin 162 milligrams each day until delivery"],"blueprintSystem":"blood-lymph-immune","taskCategory":"pharmacotherapy","blueprintTopic":"ITP treatment in pregnancy","kind":"vignette"}$opa52$,
  $kya52$Prednisone or IVIG, with delivery based on obstetric indications$kya52$,
  $exa52$Pregnant patients with ITP who are bleeding or whose platelet count is very low in the third trimester are treated with prednisone or intravenous immunoglobulin, the same classes of therapy used outside pregnancy and chosen because they can be given without the fetal concerns of several other ITP drugs. This patient has mucosal bleeding at 18,000/uL, so observation alone is not enough, and preeclampsia is not the diagnosis: blood pressure, urine protein, and liver enzymes are normal and there are no schistocytes. The route of delivery is decided by obstetric factors, not by ITP itself; a low maternal count is not an indication for immediate cesarean at 32 weeks. Warfarin is teratogenic and causes fetal bleeding and has no role in ITP. Splenectomy is not initial therapy, particularly in the third trimester when medical treatment is available. Aspirin impairs platelet function and is the wrong direction while she is bleeding. Dexamethasone pulses and rituximab are not the pregnancy regimen being chosen here; prednisone or IVIG is.$exa52$,
  5,
  $dma52$blood-lymph-immune$dma52$,
  $tpa52$ITP treatment in pregnancy$tpa52$,
  $sua52$https://www.merckmanuals.com/professional/hematology-and-oncology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp$sua52$,
  $sla52$https://www.merckmanuals.com/professional/hematology-and-oncology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp$sla52$,
  $sqa52$ITP tends to worsen during pregnancy but with adequate treatment is not associated with increased maternal or fetal risk.$sqa52$,
  $cha52$da0c57df42393dd73b68428893b63b8097f1db731a48f2aac78a44454df8f9ff$cha52$,
  true,
  $rfa52$[{"label": "https://www.merckmanuals.com/professional/hematology-and-oncology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp", "url": "https://www.merckmanuals.com/professional/hematology-and-oncology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp"}]$rfa52$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida53$b14-s2-82$ida53$,
  $fxa53$wrong_blueprint$fxa53$,
  $sca53$A 34-year-old man has a 4 cm fluctuant tender abscess on the arm and a fever of 38.6 C. He is otherwise stable.$sca53$,
  $qua53$What is the essential procedure, and when is an antibiotic added?$qua53$,
  $opa53${"options":["An antibiotic and no drainage","Drain it. Add an antibiotic because he has a fever","Drainage and no antibiotic, despite the fever","Warm soaks for a week as the only care of a 4 cm collection","Incision without sending him home on any follow-up if he is febrile"],"blueprintSystem":"msk-skin"}$opa53$,
  $kya53$Drain it. Add an antibiotic because he has a fever$kya53$,
  $exa53$A skin abscess is drained. Antibiotics are added when there is systemic illness, not as a substitute for drainage. Drainage is the treatment of a fluctuant abscess. Fever is a reason to add an antibiotic, not a reason to skip the knife. Loscalzo J, Fauci AS, Kasper DL, Hauser SL, Longo DL, Jameson JL, eds. Harrison's Principles of Internal Medicine. 21st ed. Chapter 122: Approach to the Acutely Ill Infected Febrile Patient. McGraw Hill; 2022.

Drain it. Add an antibiotic because he has a fever
An antibiotic and no drainage — A drug cannot empty a walled-off collection.
Drainage and no antibiotic, despite the fever — Fever is a systemic sign that supports adding an antibiotic after drainage.
Warm soaks for a week as the only care of a 4 cm collection — A 4 cm fluctuant abscess is drained, not soaked for a week.
Incision without sending him home on any follow-up if he is febrile — He can often go home after drainage if he is stable, with the antibiotic and a recheck. Fever does not by itself mean admission.$exa53$,
  3,
  $dma53$msk-skin$dma53$,
  $tpa53$abscess$tpa53$,
  $sua53$https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections$sua53$,
  $sla53$https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections$sla53$,
  $sqa53$Cutaneous abscesses are collections of pus within the dermis and deeper skin tissues.$sqa53$,
  $cha53$6f3f3e4149e7ef1eb03a0814f53a0e7257526b131f1078a4751bc960d175089b$cha53$,
  true,
  $rfa53$[{"label": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections", "url": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections"}]$rfa53$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida54$b17-s2-10$ida54$,
  $fxa54$template_artifact$fxa54$,
  $sca54$A 52-year-old woman with leukemia has had fever and a neutrophil count of 100 for five days on broad antibiotics. Cultures are negative and the CT shows no bacterium yet. She is still febrile.$sca54$,
  $qua54$What drug class is added, and why do negative cultures not end the decision?$qua54$,
  $opa54${"options":["Add no new antifungal and keep watching","Stop the antibiotics because cultures are negative","Give a corticosteroid as treatment for the fever","Colony-stimulating factor as a substitute for the antifungal","Add an antifungal drug; do not wait for a positive culture"]}$opa54$,
  $kya54$Add an antifungal drug; do not wait for a positive culture$kya54$,
  $exa54$Neutropenic fever that persists after about four to seven days of broad antibiotics is treated with an antifungal drug. A longer wait for a positive culture is not required. Persistent fever in prolonged neutropenia is often fungal even when cultures are silent. The antifungal is added on clinical timing. Loscalzo J, Fauci AS, Kasper DL, Hauser SL, Longo DL, Jameson JL, eds. Harrison's Principles of Internal Medicine. 21st ed. Chapter 74: Infections in Patients with Cancer. McGraw Hill; 2022.

Add an antifungal drug A longer wait for a positive.
Add no new drug — Five days of fever on broad antibiotics is the signal.
Stop the antibiotics because cultures are negative — Bacterial cover continues while fungus is added.
A steroid for the fever — A steroid can worsen a hidden fungus.
Colony-stimulating factor as a substitute for the antifungal — A growth factor may be considered. It does not treat fungus.$exa54$,
  3,
  $dma54$blood-lymph-immune$dma54$,
  $tpa54$antifungal-nf$tpa54$,
  $sua54$https://www.merckmanuals.com/professional/infectious-diseases/fungi/candidiasis-invasive$sua54$,
  $sla54$https://www.merckmanuals.com/professional/infectious-diseases/fungi/candidiasis-invasive$sla54$,
  $sqa54$Patients who have neutropenia (for example during cancer chemotherapy or after stem cell transplantation) are at high risk.$sqa54$,
  $cha54$aa0077852b33006f53d5baad6702b02d3694d10b1921d0a2a36f1d2e4be04a8f$cha54$,
  true,
  $rfa54$[{"label": "https://www.merckmanuals.com/professional/infectious-diseases/fungi/candidiasis-invasive", "url": "https://www.merckmanuals.com/professional/infectious-diseases/fungi/candidiasis-invasive"}]$rfa54$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida55$cmqiy33sw000p1yug4nv1ug9p$ida55$,
  $fxa55$wrong_blueprint$fxa55$,
  $sca55$A 3-year-old boy is brought to the office in December with three days of runny nose and cough. His mother says he "sounds wheezy at night." He attends daycare and several classmates are sick. He has no fever today, is drinking well, and is playful in the exam room. Temperature 37.4°C (99.3°F), RR 28/min, O₂ sat 98% on room air. TMs mildly dull without bulging. Throat mildly erythematous. Scattered expiratory wheezes; no retractions. Rapid influenza A/B: negative. Rapid strep: negative.$sca55$,
  $qua55$Which of the following is the most appropriate management?$qua55$,
  $opa55${"options":["Azithromycin for 5 days","Amoxicillin-clavulanate for 10 days","Albuterol inhaler with spacer as needed","Oral prednisolone (a corticosteroid) for 5 days","Chest radiograph and blood cultures"],"stepLevel":"step2","kind":"vignette","structureIds":["heart","lungs","brain"],"blueprintTopic":"viral-wheeze","blueprintSystem":"respiratory-renal"}$opa55$,
  $kya55$Albuterol inhaler with spacer as needed$kya55$,
  $exa55$Well-appearing child with viral upper respiratory symptoms and mild reactive airways (expiratory wheeze, no hypoxia/distress) — supportive care with bronchodilator PRN is standard. Antibiotics are not indicated without bacterial focus (otitis with bulging TM, pneumonia, strep pharyngitis). Prednisone is reserved for moderate-severe wheeze or asthma exacerbation, not mild viral wheeze in a comfortable toddler.$exa55$,
  3,
  $dma55$respiratory-renal$dma55$,
  $tpa55$viral-wheeze$tpa55$,
  $sua55$https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf$sua55$,
  $sla55$https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf$sla55$,
  $sqa55$SABA to relieve airflow obstruction, with addition of inhaled ipratropium bromide in severe exacerbations (Evidence A).$sqa55$,
  $cha55$d2f960065da3c50b999f9749b62a1ecb1c67655d25854447b1c1162cd225f930$cha55$,
  true,
  $rfa55$[{"label": "https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf", "url": "https://www.nhlbi.nih.gov/files/docs/guidelines/11_sec5_exacerb.pdf"}]$rfa55$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida56$cmr4kilgu00sp1ydekkgxudlk$ida56$,
  $fxa56$wrong_key|rationale|wrong_blueprint|difficulty$fxa56$,
  $sca56$A 4-year-old boy is brought to the emergency department with a high fever of 39.0°C (102.2°F) and a rash that started on his face and spread to his trunk and extremities. His mother reports that he had a runny nose and cough for the past few days. On examination, he has conjunctivitis and Koplik spots in his mouth. His vaccination history shows that he received the MMR vaccine at age 1.$sca56$,
  $qua56$Which of the following is the most likely diagnosis?$qua56$,
  $opa56${"options":["Measles","Rubella","Roseola","Varicella"],"kind":"lab_interpretation","taskCategory":"clinical-intervention","blueprintTopic":"measles","blueprintSystem":"multisystem","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783060393212","qcScore":8,"slotIndex":4,"stepLevel":"step2","examNumber":9210,"generatedAt":"2026-07-03T06:34:17.275Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$opa56$,
  $kya56$Measles$kya56$,
  $exa56$Fever, cough, coryza, conjunctivitis, a rash that began on the face, and Koplik spots are measles. One dose of MMR at age 1 does not rule it out. Rubella is a milder rash illness and does not produce Koplik spots. Roseola is a high fever in a younger child that breaks as a trunk rash appears. Varicella is a vesicular rash in different stages. Creatinine clearance cannot be estimated from this stem because height and serum creatinine are not provided.$exa56$,
  2,
  $dma56$multisystem$dma56$,
  $tpa56$measles$tpa56$,
  $sua56$https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-13-measles.html$sua56$,
  $sla56$https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-13-measles.html$sla56$,
  $sqa56$Koplik spots, present on mucous membranes, are considered to be unique to measles.$sqa56$,
  $cha56$a61c2d5ffc440ae91756ccb21f6ccaad2fd49c0d1e93a6cd709e97bba79919e0$cha56$,
  true,
  $rfa56$[{"label": "https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-13-measles.html", "url": "https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-13-measles.html"}]$rfa56$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida57$cmr88ie7k00ql1yr9hbxm46pt$ida57$,
  $fxa57$not_single_best|rationale$fxa57$,
  $sca57$A 72-year-old woman presents to the emergency department with acute shortness of breath and a productive cough. She has a history of COPD and is currently on a long-acting beta-agonist and inhaled corticosteroid. On examination, her respiratory rate is 28 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Her arterial blood gas reveals a pH of 7.32, PaCO2 of 60 mmHg, and PaO2 of 55 mmHg. Nebulized albuterol and ipratropium have just been given, and she is still in distress.$sca57$,
  $qua57$What is the most appropriate next step in management?$qua57$,
  $opa57${"options":["Administer nebulized albuterol and ipratropium","Initiate systemic corticosteroids","Intubate the patient for respiratory failure","Start non-invasive positive pressure ventilation"],"distractorRationale":{"Initiate systemic corticosteroids":"While corticosteroids are important for inflammation, they are not the immediate step in acute management.","Intubate the patient for respiratory failure":"The patient is not yet in respiratory failure requiring intubation, as she is still able to breathe spontaneously.","Start non-invasive positive pressure ventilation":"This may be considered later but is not the immediate step for this patient at this time."},"clinicalReasoning":"The patient presents with acute shortness of breath and wheezing, indicating an exacerbation of her COPD. The arterial blood gas results show respiratory acidosis with hypoxemia, confirming the severity of her condition. The immediate management should focus on relieving bronchospasm and improving oxygenation. Administering nebulized bronchodilators is the most appropriate next step.","keyTakeaways":["When managing acute COPD exacerbations, prioritize bronchodilator therapy to relieve bronchospasm before other interventions."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"nephrotic-nephritic","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783282201889","qcScore":8.2,"slotIndex":29,"stepLevel":"step2","examNumber":9209,"generatedAt":"2026-07-05T20:14:47.878Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$opa57$,
  $kya57$Start non-invasive positive pressure ventilation$kya57$,
  $exa57$She has an acute COPD exacerbation with pH 7.32 and PaCO2 60 mm Hg after a nebulized bronchodilator treatment. Noninvasive ventilation is recommended for acute respiratory acidosis from COPD when the pH is 7.35 or lower, and it is the initial mode of ventilation rather than immediate intubation. Systemic corticosteroids are also indicated, but they do not correct this gas-exchange failure as the next step. Another bronchodilator treatment has already been started. Intubation is for noninvasive-ventilation failure, inability to protect the airway, or more severe ventilatory failure.$exa57$,
  4,
  $dma57$respiratory-renal$dma57$,
  $tpa57$nephrotic-nephritic$tpa57$,
  $sua57$https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/$sua57$,
  $sla57$https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/$sla57$,
  $sqa57$We recommend NIV for patients with acute respiratory failure leading to acute or acute-on-chronic respiratory acidosis (pH ≤ 7.35) due to COPD exacerbation.$sqa57$,
  $cha57$e37cb81b07e39554e0c28075ba0e46b0f713673a2e4c46d7d579ef6468e03a88$cha57$,
  true,
  $rfa57$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/"}]$rfa57$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida58$cmrtgb28k002f1ydwpge8g4v3$ida58$,
  $fxa58$wrong_blueprint|rationale$fxa58$,
  $sca58$A 72-year-old woman with a history of chronic obstructive pulmonary disease (COPD) presents to the emergency department with acute shortness of breath and a productive cough. She is currently taking tiotropium and albuterol. On examination, her respiratory rate is 28 breaths/min, oxygen saturation is 88% on room air, and auscultation reveals diffuse wheezing and crackles bilaterally. A chest X-ray shows hyperinflation but no signs of infection.$sca58$,
  $qua58$What is the most appropriate next step in the management of this patient?$qua58$,
  $opa58${"options":["Administer intravenous corticosteroids","Initiate non-invasive positive pressure ventilation","Start intravenous antibiotics","Perform a bronchoscopy"],"distractorRationale":{"Initiate non-invasive positive pressure ventilation":"NIPPV is reserved for patients showing signs of respiratory failure, such as altered mental status or severe hypoxemia, which this patient does not exhibit at this time. (Understanding when to use NIPPV is essential; it is not the immediate step for all COPD exacerbations.)","Start intravenous antibiotics":"Antibiotics are only indicated if there is evidence of a bacterial infection, which is not present in this patient as the chest X-ray shows no signs of infection. (Recognizing the absence of infection is key to avoiding unnecessary antibiotic use.)","Perform a bronchoscopy":"Bronchoscopy is not indicated in this scenario as it does not address the immediate need to reduce airway inflammation and is typically reserved for other specific indications. (Understanding the role of bronchoscopy helps clarify when it is appropriate versus when to focus on medical management.)"},"clinicalReasoning":"Administering intravenous corticosteroids is the best immediate step for managing this COPD exacerbation. **Corticosteroids** reduce airway inflammation, which is critical in acute exacerbations. This patient shows signs of an **exacerbation** due to her COPD, requiring prompt treatment.","keyTakeaways":["When managing an acute COPD exacerbation, prioritize corticosteroids to reduce inflammation and improve breathing."],"taskCategory":"communication","blueprintTopic":"copd-exacerbation","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784565406373","qcScore":7.9,"slotIndex":8,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-20T16:38:10.126Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa58$,
  $kya58$Administer intravenous corticosteroids$kya58$,
  $exa58$Wheezing, hypoxia, and hyperinflation without a new infiltrate are an acute COPD exacerbation. Systemic corticosteroids improve lung function and shorten recovery. Oral prednisolone is as effective as an intravenous corticosteroid when the patient can swallow; intravenous treatment is acceptable, but it is not preferred because it acts faster. The chest radiograph shows no infection, and a productive cough alone does not establish a bacterial exacerbation that needs antibiotics. Bronchoscopy is not the treatment of airway inflammation. Noninvasive ventilation is for acute respiratory acidosis or ventilatory failure, which is not shown here.$exa58$,
  4,
  $dma58$respiratory-renal$dma58$,
  $tpa58$copd-exacerbation$tpa58$,
  $sua58$https://www.nature.com/articles/s41533-023-00349-4$sua58$,
  $sla58$https://www.nature.com/articles/s41533-023-00349-4$sla58$,
  $sqa58$Short-acting inhaled β2-agonists (SABA), with or without short-acting anticholinergics (SAMA), are the initial bronchodilators for acute treatment of ECOPD.$sqa58$,
  $cha58$b68d774a4fd0473082e40c879fadef83adac337a4acf31a2131b940c55b8c47f$cha58$,
  true,
  $rfa58$[{"label": "https://www.nature.com/articles/s41533-023-00349-4", "url": "https://www.nature.com/articles/s41533-023-00349-4"}]$rfa58$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida59$cmrvm5urr000ejw040q016s43$ida59$,
  $fxa59$template_artifact|wrong_blueprint$fxa59$,
  $sca59$A 65-year-old man with a history of chronic kidney disease and hypertension presents to the emergency department with worsening blood pressure control and new bilateral lower extremity edema. He is currently taking multiple antihypertensive medications, including a diuretic. On examination, his blood pressure is 180/110 mmHg, and laboratory tests reveal a serum creatinine of 2.5 mg/dL and a potassium level of 5.8 mEq/L.$sca59$,
  $qua59$What is the underlying mechanism that makes ACE inhibitors contraindicated in this patient with bilateral renal artery stenosis?$qua59$,
  $opa59${"options":["Reduce GFR via efferent arteriole dilation","Increase aldosterone secretion only","Cause hyperkalemia as the only effect","Block antidiuretic hormone in the pituitary"],"blueprintTopic":"renal-artery-stenosis","blueprintSystem":"respiratory-renal"}$opa59$,
  $kya59$Reduce GFR via efferent arteriole dilation$kya59$,
  $exa59$Why this answer is correct
ACE inhibitors are contraindicated in bilateral renal artery stenosis due to their effect on GFR.
Efferent arteriole dilation reduces glomerular pressure, which is crucial for maintaining GFR.
In bilateral renal artery stenosis, the kidneys rely on efferent arteriolar constriction to sustain filtration.
ACE inhibitors inhibit angiotensin II, leading to decreased pressure and potential renal failure.
In practice: In practice, this means that using ACE inhibitors in such patients can lead to acute kidney injury due to inadequate glomerular filtration pressure.
Why the other options are wrong

Increase aldosterone only
Trap: Students may think ACE inhibitors primarily increase aldosterone levels.
Why it fails here: ACE inhibitors actually decrease aldosterone secretion by inhibiting the renin-angiotensin system, which is not the main issue in this scenario.
Remember: This misconception overlooks the critical role of GFR reduction due to efferent arteriole dilation.

Cause hyperkalemia only
Trap: Some may focus solely on the risk of hyperkalemia associated with ACE inhibitors.
Why it fails here: While hyperkalemia is a concern, the primary issue in bilateral renal artery stenosis is the risk of reduced GFR and potential renal failure.
Remember: This distractor fails to address the fundamental problem of maintaining glomerular filtration pressure.

Block ADH
Trap: Students might incorrectly believe that ACE inhibitors have a direct effect on antidiuretic hormone (ADH).
Why it fails here: ACE inhibitors do not block ADH; their primary action is on the renin-angiotensin system, which does not directly involve ADH regulation.
Remember: This option misrepresents the mechanism of ACE inhibitors, diverting attention from their impact on renal hemodynamics.
Key takeaway
When considering ACE inhibitors, remember they can worsen renal function in conditions like bilateral renal artery stenosis due to their effect on GFR.

Memory hook: Think 'ACE = Affects Constriction of Efferent' to remember their role in GFR.$exa59$,
  3,
  $dma59$respiratory-renal$dma59$,
  $tpa59$renal-artery-stenosis$tpa59$,
  $sua59$https://pmc.ncbi.nlm.nih.gov/articles/PMC1768825/$sua59$,
  $sla59$https://pmc.ncbi.nlm.nih.gov/articles/PMC1768825/$sla59$,
  $sqa59$ACE inhibitor induced acute renal failure (ARF) occurs in settings where glomerular afferent arteriolar blood flow is reduced, and GFR is therefore dependent on AII mediated efferent arteriolar vasoconstriction.$sqa59$,
  $cha59$e28d7c3c55738e0b5a42358d56d4f6dec7bfcf94613d75e2836c81ae2e294041$cha59$,
  true,
  $rfa59$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1768825/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1768825/"}]$rfa59$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida60$cmtpwzxx6006q1y6h6at28nni$ida60$,
  $fxa60$difficulty$fxa60$,
  $sca60$A 32-year-old man with a history of HIV presents to the emergency department with a fever of 39.5°C (103.1°F), cough, and shortness of breath. His CD4 count is 150 cells/mm³, and he has not been compliant with his antiretroviral therapy. On examination, he has decreased breath sounds on the left side. Chest X-ray shows a left pleural effusion.$sca60$,
  $qua60$Which of the following is the most appropriate referral?$qua60$,
  $opa60${"options":["Pulmonology for thoracentesis","Infectious disease for antiretroviral therapy","Oncology for lung cancer evaluation","Cardiology for heart failure management"],"distractorRationale":{"Infectious disease for antiretroviral therapy":"While antiretroviral therapy is crucial, the immediate issue is the pleural effusion requiring intervention.","Oncology for lung cancer evaluation":"There is no evidence of malignancy; pleural effusions in HIV patients are often infectious.","Cardiology for heart failure management":"The patient's symptoms are primarily respiratory, not cardiac."},"clinicalReasoning":"Assess the patient’s respiratory symptoms and immunocompromised status. Analyze the need for immediate intervention for the pleural effusion. Integrate the clinical urgency of respiratory care with the patient's HIV status to determine the best referral.","kind":"vignette","stepLevel":"step2","blueprintSystem":"blood-lymph-immune","blueprintTopic":"hiv-opportunistic","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788705041511","examNumber":9203,"slotIndex":0,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-09-06T14:31:13.388Z"}}$opa60$,
  $kya60$Pulmonology for thoracentesis$kya60$,
  $exa60$The correct answer is to refer the patient to pulmonology for thoracentesis, as he presents with a significant pleural effusion likely due to pneumonia or another infectious process, which requires drainage for both diagnosis and symptomatic relief. The other options fail because: Infectious disease referral is not the immediate priority; while antiretroviral therapy is important, the acute respiratory issue needs addressing first (trap: thinking therapy is the priority). Oncology is inappropriate as there is no evidence of malignancy (trap: assuming all effusions are cancer-related). Cardiology is also not relevant since the patient’s symptoms are primarily respiratory (trap: misattributing symptoms to heart failure). Key takeaway: In HIV patients, respiratory symptoms with pleural effusion require urgent evaluation by pulmonology. Memory hook: Think of the lungs first in respiratory distress.

Clinical reasoning: Assess the patient’s respiratory symptoms and immunocompromised status. Analyze the need for immediate intervention for the pleural effusion. Integrate the clinical urgency of respiratory care with the patient's HIV status to determine the best referral.

Why other options are incorrect:
• Infectious disease for antiretroviral therapy: While antiretroviral therapy is crucial, the immediate issue is the pleural effusion requiring intervention.
• Oncology for lung cancer evaluation: There is no evidence of malignancy; pleural effusions in HIV patients are often infectious.
• Cardiology for heart failure management: The patient's symptoms are primarily respiratory, not cardiac.$exa60$,
  3,
  $dma60$blood-lymph-immune$dma60$,
  $tpa60$hiv-opportunistic$tpa60$,
  $sua60$https://medlineplus.gov/ency/article/003420.htm$sua60$,
  $sla60$https://medlineplus.gov/ency/article/003420.htm$sla60$,
  $sqa60$The test is performed to determine the cause of the extra fluid and to relieve symptoms from the fluid buildup.$sqa60$,
  $cha60$320c4e98b749545bc8757b55a50868d8683cf60a61d6ae52c9b6e72fd22311c7$cha60$,
  true,
  $rfa60$[{"label": "https://medlineplus.gov/ency/article/003420.htm", "url": "https://medlineplus.gov/ency/article/003420.htm"}]$rfa60$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida61$47dc94ef-d48e-4cc8-9821-80c846053759$ida61$,
  $fxa61$template_artifact$fxa61$,
  $sca61$An hour after plasma, a patient is hypoxic with bilateral infiltrates and a normal heart size. Blood pressure is not high and he was not volume overloaded before the unit. A second patient, known to have heart failure, gets several units and develops hypoxia, hypertension, and an elevated BNP.$sca61$,
  $qua61$Which is antibody-mediated lung injury, and which is overload?$qua61$,
  $opa61${"options":["The first is TRALI from donor antibodies activating recipient neutrophils; the second is circulatory overload","Both are ABO hemolysis because any hypoxia after a plasma transfusion proves red-cell destruction","The first is cardiogenic because any post-transfusion infiltrate is caused by the heart","The second is TRALI because a patient with heart failure cannot develop circulatory overload","Diuretics are first-line therapy for TRALI and are harmful when the problem is volume overload"],"blueprintSystem":"multisystem","taskCategory":"interpretation","blueprintTopic":"TRALI versus TACO","kind":"vignette"}$opa61$,
  $kya61$The first is TRALI from donor antibodies activating recipient neutrophils; the second is circulatory overload$kya61$,
  $exa61$TRALI is noncardiogenic edema during or soon after transfusion, often from donor anti-HLA or anti-neutrophil antibodies. The heart is not the problem, pressures are not those of failure, and diuretics are not the treatment. TACO is too much volume for a weak heart: hypertension, high BNP, and a response to diuretics. Hypoxia alone is not hemolysis. Calling every infiltrate cardiogenic misses a normal heart size and normal filling story. Heart-failure patients are exactly who overload. Diuretics help overload and do not fix capillary leak from TRALI.$exa61$,
  5,
  $dma61$multisystem$dma61$,
  $tpa61$TRALI versus TACO$tpa61$,
  $sua61$https://pmc.ncbi.nlm.nih.gov/articles/PMC6324877/$sua61$,
  $sla61$https://pmc.ncbi.nlm.nih.gov/articles/PMC6324877/$sla61$,
  $sqa61$In the setting of a systemic inflammatory process, recipient neutrophils are then activated by a sufficient quantity of cognate antibody in a transfused blood component.$sqa61$,
  $cha61$c985f1d8ba7fab394f9eba553e0c90716676f75d8ecfb420f124455420cf6689$cha61$,
  true,
  $rfa61$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6324877/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6324877/"}]$rfa61$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida62$b1xdd6a387cf0f586fea441e50e$ida62$,
  $fxa62$template_artifact|wrong_blueprint$fxa62$,
  $sca62$A 72-year-old man has an acutely swollen knee. He has had no toe pain. The film shows chondrocalcinosis of the meniscus. Aspirate under polarized light shows rhomboid crystals that are blue when parallel to the compensator.$sca62$,
  $qua62$Which crystal is in the joint?$qua62$,
  $opa62${"options":["Monosodium urate","Cholesterol crystals from a chronic effusion","Hydroxyapatite crystals from calcific tendonitis","Calcium oxalate","Calcium pyrophosphate"],"blueprintTopic":"calcium-pyrophosphate-deposition","blueprintSystem":"msk-skin"}$opa62$,
  $kya62$Calcium pyrophosphate$kya62$,
  $exa62$Positively birefringent rhomboid crystals in a swollen knee are calcium pyrophosphate, not monosodium urate. Calcium pyrophosphate is the pseudogout crystal, rhomboid and positively birefringent, often with chondrocalcinosis. Monosodium urate is needle-shaped and negatively birefringent and prefers the first toe. Cholesterol crystals are plates in chronic effusions, not an acute knee with chondrocalcinosis. Hydroxyapatite is not birefringent and causes calcific tendonitis. Calcium oxalate crystals occur in oxalosis, not this meniscal calcification.$exa62$,
  4,
  $dma62$msk-skin$dma62$,
  $tpa62$calcium-pyrophosphate-deposition$tpa62$,
  $sua62$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/calcium-pyrophosphate-deposition-disease$sua62$,
  $sla62$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/calcium-pyrophosphate-deposition-disease$sla62$,
  $sqa62$The positively birefringent CPP crystals appear blue when parallel to the optical axis of the compensator and yellow when perpendicular to it.$sqa62$,
  $cha62$74f6b1a9fcca9dc5f8fd1b716b269474ccaabaa6a2f0fbe4e812344f2b747d90$cha62$,
  true,
  $rfa62$[{"label": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/calcium-pyrophosphate-deposition-disease", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/calcium-pyrophosphate-deposition-disease"}]$rfa62$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida63$b4x84cf525e5e84bff2d0ca2bcf$ida63$,
  $fxa63$wrong_blueprint|difficulty$fxa63$,
  $sca63$A 15-year-old boy's bone is being remodeled. Under a microscope, mineral disappears only in a small pit beneath one cell. The rest of the bone surface is intact. The cell has a sealed edge and a folded membrane. Systemic pH is 7.40.$sca63$,
  $qua63$Why does mineral dissolve only under that cell?$qua63$,
  $opa63${"options":["A sealed acid compartment is limited to the pit","Blood pH of 7.40 is low enough to melt all mineral","Osteoblasts secrete the acid","The pit is where alkaline phosphatase dissolves crystal","Calcium pumps deposit acid into the marrow"],"blueprintTopic":"osteoclast-bone-resorption","blueprintSystem":"msk-skin"}$opa63$,
  $kya63$A sealed acid compartment is limited to the pit$kya63$,
  $exa63$Osteoclasts seal a compartment and pump acid onto mineral, so hydroxyapatite dissolves only under the ruffled border. A sealed acid compartment is limited to the pit. Blood pH of 7.40 is low enough to melt all mineral is false. Osteoblasts secrete the acid swaps the cell. The pit is where alkaline phosphatase dissolves crystal gives the formation enzyme a resorption job. Calcium pumps deposit acid into the marrow misses the sealed ruffled border.$exa63$,
  2,
  $dma63$msk-skin$dma63$,
  $tpa63$osteoclast-bone-resorption$tpa63$,
  $sua63$https://pmc.ncbi.nlm.nih.gov/articles/PMC4920143/$sua63$,
  $sla63$https://pmc.ncbi.nlm.nih.gov/articles/PMC4920143/$sla63$,
  $sqa63$The sealing zone creates an isolated extracellular microenvironment, enclosed by the cell and the bone surface, where bone resorption takes place.$sqa63$,
  $cha63$17aca62aeb68b6e36c5b395c3cca62ce6fe40f2bdc45e579605a830db5b436ac$cha63$,
  true,
  $rfa63$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4920143/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4920143/"}]$rfa63$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida64$b6x65819e3d631a7dc6f9c5a5dd$ida64$,
  $fxa64$wrong_blueprint|rationale$fxa64$,
  $sca64$Two 28-year-old patients are anemic and jaundiced. One has red plasma and a haptoglobin that is undetectable. The other has a normal haptoglobin and a spleen that is large. A classmate says any hemolysis drops haptoglobin.$sca64$,
  $qua64$Why is haptoglobin low in only one of them?$qua64$,
  $opa64${"options":["Splenic destruction spills hemoglobin into the plasma the same way","A large spleen means haptoglobin must be low","Red plasma means haptoglobin is high","Jaundice requires a low haptoglobin in both","Only that patient is spilling hemoglobin into the plasma"],"blueprintTopic":"intravascular-hemolysis","blueprintSystem":"blood-lymph-immune"}$opa64$,
  $kya64$Only that patient is spilling hemoglobin into the plasma$kya64$,
  $exa64$Haptoglobin binds free hemoglobin in plasma, so the patient with red plasma has an undetectable level because hemoglobin has been released into the blood. Red plasma is hemoglobinemia and marks intravascular release. Haptoglobin also falls in many extravascular hemolytic states, so a low level does not by itself prove the site; this second patient is simply not spilling free hemoglobin into the plasma. Jaundice can come from either site. A large spleen does not force the haptoglobin down, and red plasma means haptoglobin is being consumed rather than increased.$exa64$,
  4,
  $dma64$blood-lymph-immune$dma64$,
  $tpa64$intravascular-hemolysis$tpa64$,
  $sua64$https://pmc.ncbi.nlm.nih.gov/articles/PMC4706896/$sua64$,
  $sla64$https://pmc.ncbi.nlm.nih.gov/articles/PMC4706896/$sla64$,
  $sqa64$Haptoglobin is significantly decreased during hemolysis, both in intravascular forms, due to increased free plasma Hb and altered free/complexed haptoglobin balance, and in extravascular cases, where little intravascular lysis of structurally altered RBC escaped from reticuloendothelial clearance may be present.$sqa64$,
  $cha64$6e14f8a371ec07104db243db3b0ce141a0a44ff6bb626a234847287ba07bcd77$cha64$,
  true,
  $rfa64$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4706896/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4706896/"}]$rfa64$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida65$b9a3e2c1-a1b4-44ba-a5f2-9ddc446be987$ida65$,
  $fxa65$template_artifact|difficulty$fxa65$,
  $sca65$A 54-year-old man received another patient morning dose of metoprolol because of a labeling error. His heart rate fell to 48 beats per minute, he felt briefly lightheaded, the dose was held, and he was monitored. By afternoon his heart rate and blood pressure are back to his baseline and he is comfortable. The charge nurse says no lasting harm was done, telling him will only make him angry and could cause a lawsuit, and the note should describe a vasovagal episode. He is awake and asks why he felt faint after the morning medicines.$sca65$,
  $qua65$Which of the following is the most appropriate next step?$qua65$,
  $opa65${"options":["Tell him a medication error occurred, what was done, and how he is being monitored","Document a vasovagal episode so the record matches a harmless story","Disclose the error only if he later develops heart block","Ask the nurse to apologize alone and keep the physician out of the conversation","Offer a settlement payment before explaining what happened"],"blueprintSystem":"social-sciences","taskCategory":"communication","blueprintTopic":"medication-error-disclosure","kind":"vignette"}$opa65$,
  $kya65$Tell him a medication error occurred, what was done, and how he is being monitored$kya65$,
  $exa65$The wrong drug reached the patient and caused transient bradycardia. An error that reaches a patient is disclosed even when the outcome is now back to baseline. He should hear what happened, what was done, and how he is being watched. Hiding it to avoid anger or a lawsuit is the trap these facts rule out. Document a vasovagal episode so the record matches a harmless story falsifies the chart and deceives him. Disclose the error only if he later develops heart block makes disclosure depend on a later complication instead of on the error that already occurred. The ask the nurse to apologize alone and keep the physician out of the conversation abandons the physician duty to disclose and singles out one colleague. Offer a settlement payment before explaining what happened substitutes money for the explanation he is already requesting and can look like an attempt to buy silence.$exa65$,
  3,
  $dma65$social-sciences$dma65$,
  $tpa65$medication-error-disclosure$tpa65$,
  $sua65$https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety$sua65$,
  $sla65$https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety$sla65$,
  $sqa65$Disclose the occurrence of the error, explain the nature of the (potential) harm, and provide the information needed to enable the patient to make informed decisions about future medical care.$sqa65$,
  $cha65$a43d86e432025487445236a1f189a1b17d276e7b6c90e9f89a584141d2bdd397$cha65$,
  true,
  $rfa65$[{"label": "https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety", "url": "https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety"}]$rfa65$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida66$cmqxc0v4f00141ymaa139pr5b$ida66$,
  $fxa66$not_single_best|rationale|template_artifact|wrong_blueprint$fxa66$,
  $sca66$A 58-year-old man comes to the emergency department because of severe right knee pain that began overnight. The knee is warm, red, and exquisitely tender. He had the same pain at the base of the great toe last year. Serum uric acid is 8.5 mg/dL. The hands are not swollen, and he has no prolonged morning stiffness.$sca66$,
  $qua66$Which laboratory finding is most consistent with this diagnosis?$qua66$,
  $opa66${"options":["Presence of negatively birefringent crystals in synovial fluid","Elevated anti-citrullinated protein antibodies in the serum","Increased serum alkaline phosphatase without another explanation","Presence of rheumatoid factor without crystals in the fluid"],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"gout","blueprintSystem":"musculoskeletal","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step1-1782622322072","qcScore":8,"slotIndex":45,"stepLevel":"step1","examNumber":9072,"generatedAt":"2026-06-28T05:05:52.963Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$opa66$,
  $kya66$Presence of negatively birefringent crystals in synovial fluid$kya66$,
  $exa66$Overnight monoarthritis of the knee, a prior attack at the first toe, and hyperuricemia indicate gout. Negatively birefringent needle-shaped monosodium urate crystals in synovial fluid confirm it. Anti-citrullinated peptide antibodies and rheumatoid factor mark rheumatoid arthritis, which causes symmetric small-joint disease rather than this pattern. Alkaline phosphatase is not a diagnostic test for gout.$exa66$,
  3,
  $dma66$msk-skin$dma66$,
  $tpa66$gout$tpa66$,
  $sua66$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout$sua66$,
  $sla66$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout$sla66$,
  $sqa66$The initial attack (flare) of gout is usually monoarticular and often involves the first metatarsophalangeal joint.$sqa66$,
  $cha66$9555c4383cb9e89a10784c14411b1c42af02fa3e05830b3d9a616637b927381c$cha66$,
  true,
  $rfa66$[{"label": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$rfa66$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida67$cmr88g5ui00dj1yw2xxe0davn$ida67$,
  $fxa67$template_artifact$fxa67$,
  NULL,
  $qua67$A 58-year-old man comes to the clinic because of joint pain and morning stiffness lasting more than 1 hour for 3 months. He has hypertension and hyperlipidemia treated with lisinopril and atorvastatin. The metacarpophalangeal and proximal interphalangeal joints of both hands are swollen, and the squeeze test is positive. ESR is 45 mm/h and rheumatoid factor is positive. Blood pressure is 130/85 mm Hg. Which of the following mediators is most central to the synovial inflammation and joint erosion in this condition?$qua67$,
  $opa67${"options":["Tumor necrosis factor-alpha","Histamine released from mast cells","Immunoglobulin E","Decreased RANKL activity"]}$opa67$,
  $kya67$Tumor necrosis factor-alpha$kya67$,
  $exa67$Correct answer: A. Tumor necrosis factor-alpha. Symmetric small-joint synovitis of the hands with morning stiffness over 1 hour, a positive squeeze test, ESR of 45 mm/h and positive rheumatoid factor indicate RA; macrophage- and T-cell-derived TNF-alpha drives synovial inflammation, pannus formation and osteoclast activation, which is why TNF inhibitors are effective. Why the other options are wrong: B. Histamine mediates type I allergic reactions, not chronic synovitis. C. IgE mediates allergy, not RA. D. RANKL is increased, not decreased, in RA, activating osteoclasts that erode bone.$exa67$,
  2,
  $dma67$msk-skin$dma67$,
  $tpa67$rheumatoid-arthritis$tpa67$,
  $sua67$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra$sua67$,
  $sla67$https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra$sla67$,
  $sqa67$The synovial lining cells produce various materials, including collagenase and stromelysin, which contribute to cartilage destruction, and interleukin-1 (IL-1) and TNF-alpha, which stimulate cartilage destruction, osteoclast-mediated bone absorption, synovial inflammation, and prostaglandins (which potentiate inflammation).$sqa67$,
  $cha67$6516e4bb231db8264f90940dbb5a86bb8f0926d3e2a3f03e44bffe1708f71b39$cha67$,
  true,
  $rfa67$[{"label": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/joint-disorders/rheumatoid-arthritis-ra"}]$rfa67$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida68$cmrpvux2z000h1yh521ueufa4$ida68$,
  $fxa68$rationale|template_artifact|wrong_blueprint$fxa68$,
  $sca68$A 19-year-old man has had fatigue and unintentional weight loss for one month. Examination shows pallor and splenomegaly. Hemoglobin is 8.4 g/dL, the leukocyte count is 42,000/mm³ with numerous lymphoblasts, and the platelet count is 40,000/mm³.$sca68$,
  $qua68$Which pathophysiologic process best explains these findings?$qua68$,
  $opa68${"options":["Increased production of abnormal lymphocytes in the bone marrow","Autoimmune destruction of circulating red blood cells","Infiltration of the bone marrow by a metastatic carcinoma","Decreased erythropoietin production because of renal failure"],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"acute-lymphoblastic-leukemia","blueprintSystem":"hematology-immunology","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349531909","qcScore":8.4,"slotIndex":19,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-18T04:42:37.779Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$opa68$,
  $kya68$Increased production of abnormal lymphocytes in the bone marrow$kya68$,
  $exa68$Numerous circulating lymphoblasts with anemia and thrombocytopenia indicate a lymphoblastic leukemia. The abnormal lymphocytes are produced in the marrow. Autoimmune hemolysis does not put lymphoblasts in the blood. Metastatic carcinoma more often causes a leukoerythroblastic smear than a blast-filled differential. Nothing in the vignette supports renal failure or erythropoietin deficiency.$exa68$,
  2,
  $dma68$blood-lymph-immune$dma68$,
  $tpa68$acute-lymphoblastic-leukemia$tpa68$,
  $sua68$https://medlineplus.gov/ency/imagepages/2275.htm$sua68$,
  $sla68$https://medlineplus.gov/ency/imagepages/2275.htm$sla68$,
  $sqa68$This picture shows large, atypical lymphocytes (white blood cells). These cells are seen in viral infections, most commonly caused by the Epstein-Barr virus (infectious mononucleosis), cytomegalovirus diseases, and occasionally infectious hepatitis.$sqa68$,
  $cha68$b3f81ef4c3bd36038c706a32f2233abdffb52b173f5bf9c2641feaa0555f932e$cha68$,
  true,
  $rfa68$[{"label": "https://medlineplus.gov/ency/imagepages/2275.htm", "url": "https://medlineplus.gov/ency/imagepages/2275.htm"}]$rfa68$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida69$cmrr4yaj8002e1y6pl228e6zf$ida69$,
  $fxa69$wrong_key|rationale|wrong_blueprint$fxa69$,
  $sca69$A 45-year-old woman presents to the emergency department with jaundice and abdominal pain. She has a history of chronic alcohol use and was recently diagnosed with hepatitis C. On examination, she has scleral icterus and tenderness in the right upper quadrant. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and total bilirubin of 4.5 mg/dL. An abdominal ultrasound shows hepatomegaly but no gallstones.$sca69$,
  $qua69$What is the most likely mechanism of this patient's condition?$qua69$,
  $opa69${"kind":"image_based","stepLevel":"step1","blueprintSystem":"gastrointestinal","blueprintTopic":"hepatitis-c","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784425396655","qcScore":8.1,"slotIndex":7,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-19T01:44:24.218Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Immune-mediated destruction of hepatocytes","Direct viral cytopathic effect on liver cells","Inhibition of bile salt transport","Accumulation of toxic metabolites in hepatocytes"],"taskCategory":"clinical-intervention"}$opa69$,
  $kya69$Immune-mediated destruction of hepatocytes$kya69$,
  $exa69$Liver injury in hepatitis C is mainly immune-mediated. CD8 T cells kill infected hepatocytes, and once chronic infection is established the virus is not considered directly cytopathic. This patient's ALT of 180 U/L exceeds the AST of 150 U/L, which is not the alcoholic pattern, in which AST is usually at least twice ALT. Inhibition of bile-salt transport is a cholestatic mechanism and does not fit this hepatocellular enzyme pattern. Accumulation of toxic metabolites is the mechanism of alcoholic hepatitis, which this ratio does not support.$exa69$,
  3,
  $dma69$gastrointestinal$dma69$,
  $tpa69$hepatitis-c$tpa69$,
  $sua69$https://pmc.ncbi.nlm.nih.gov/articles/PMC3441205/$sua69$,
  $sla69$https://pmc.ncbi.nlm.nih.gov/articles/PMC3441205/$sla69$,
  $sqa69$The immune-mediated damage, although considered the main mechanism for HCV-related liver injury, is not exclusive, and a direct viral cytopathic effect has been suggested on the basis of experimental data.$sqa69$,
  $cha69$96fbc3b9a3835cfd597bae26aa42cce21eb5b9caf73020024a596906ec060697$cha69$,
  true,
  $rfa69$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3441205/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3441205/"}]$rfa69$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida70$cmrsew9ko00081y55wz7unbd9$ida70$,
  $fxa70$wrong_key|rationale$fxa70$,
  $sca70$A 65-year-old man has been oliguric for two days after septic shock, during which his blood pressure was 70/40 mm Hg for several hours. He has hypertension and type 2 diabetes. Blood pressure is now 110/70 mm Hg. Serum creatinine has risen from 0.9 mg/dL to 2.5 mg/dL, and potassium is 6.1 mEq/L. Urine microscopy shows muddy brown casts.$sca70$,
  $qua70$What is the most likely underlying mechanism of this patient's acute kidney injury?$qua70$,
  $opa70${"kind":"sequential","stepLevel":"step1","blueprintSystem":"respiratory-renal","blueprintTopic":"aki-mechanisms","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784502584405","qcScore":8.5,"slotIndex":9,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T23:11:24.885Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Acute tubular necrosis due to ischemia","Post-renal obstruction from benign prostatic hyperplasia","Acute interstitial nephritis from medication","Glomerulonephritis due to diabetes mellitus"],"taskCategory":"pharmacotherapy"}$opa70$,
  $kya70$Acute tubular necrosis due to ischemia$kya70$,
  $exa70$Prolonged hypotension from septic shock injured the tubules. Muddy brown casts and a rising creatinine after that insult are ischemic acute tubular necrosis, an intrinsic renal injury. Prerenal azotemia is hypoperfusion before the tubules are damaged and would not leave this sediment after perfusion is restored. Nothing suggests bladder obstruction, a new drug exposure, or an acute glomerulonephritis. Diabetic nephropathy is a chronic process, not this sudden cast-positive injury.$exa70$,
  4,
  $dma70$respiratory-renal$dma70$,
  $tpa70$aki-mechanisms$tpa70$,
  $sua70$https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki$sua70$,
  $sla70$https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki$sla70$,
  $sqa70$Acute tubular necrosis (ATN) is a form of kidney injury affecting the renal tubules, most commonly caused by ischemia.$sqa70$,
  $cha70$ea49785348fd4a7b56642856fd6373b9b668b648ce8f5c049f7e4bf55a422907$cha70$,
  true,
  $rfa70$[{"label": "https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki", "url": "https://www.merckmanuals.com/professional/nephrology/acute-kidney-injury/acute-kidney-injury-aki"}]$rfa70$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida71$cmr4bvd0q00dr1ykyzupw8ukc$ida71$,
  $fxa71$wrong_blueprint|rationale|template_artifact$fxa71$,
  $sca71$A 72-year-old man with a history of chronic obstructive pulmonary disease (COPD) presents to the emergency department with worsening shortness of breath and a productive cough. His vital signs show a respiratory rate of 28 breaths/min, oxygen saturation of 88% on room air, and he has a fever of 101°F. A chest X-ray shows increased hyperinflation and no infiltrates.$sca71$,
  $qua71$What is the most appropriate next step in management?$qua71$,
  $opa71${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-exacerbation","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783046193545","qcScore":8.3,"slotIndex":13,"stepLevel":"step3","examNumber":9305,"generatedAt":"2026-07-03T02:37:32.591Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Start intravenous antibiotics","Initiate bronchodilator therapy","Obtain a sputum culture","Administer corticosteroids"],"taskCategory":"health-maintenance"}$opa71$,
  $kya71$Initiate bronchodilator therapy$kya71$,
  $exa71$Short-acting bronchodilators, with or without a short-acting anticholinergic, are the initial treatment of airflow obstruction in a moderate or severe COPD exacerbation. Systemic corticosteroids are also recommended, but they do not replace that initial bronchodilator step. Antibiotics are used when sputum is purulent, there is a prior lung infection, or the patient needs ventilatory support. Absence of an infiltrate does not make that decision, and purulence is not described here. A sputum culture is not the immediate priority while he is in respiratory distress.$exa71$,
  4,
  $dma71$respiratory-renal$dma71$,
  $tpa71$copd-exacerbation$tpa71$,
  $sua71$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua71$,
  $sla71$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla71$,
  $sqa71$SABAs, with or without short-acting anticholinergics, are recommended as the initial bronchodilators to treat moderate/severe exacerbations.$sqa71$,
  $cha71$789ac4a123e7a93b1124137bd6fb87e9822e472e107c7b53a339d02845b4d979$cha71$,
  true,
  $rfa71$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa71$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida72$cmr8atu4h000b1ylobllir8pl$ida72$,
  $fxa72$cue|wrong_blueprint$fxa72$,
  $sca72$A 60-year-old man with hypertension and diabetes comes for a routine visit. Blood pressure is 160/95 mm Hg and fasting glucose is 130 mg/dL. He reports occasional headaches and blurred vision. Fundoscopy shows arteriovenous nicking, copper-wire arterioles, and a few flame-shaped hemorrhages. There are no microaneurysms or neovascularization.$sca72$,
  $qua72$What is the most likely diagnosis?$qua72$,
  $opa72${"options":["Diabetic retinopathy","Hypertensive retinopathy","Cerebrovascular accident","Chronic kidney disease"],"distractorRationale":{"Diabetic retinopathy":"While the patient has diabetes, the specific findings point to hypertension as the primary cause of retinal changes.","Cerebrovascular accident":"There are no acute neurological symptoms or findings to suggest a stroke.","Chronic kidney disease":"Although hypertension can lead to CKD, the current presentation is more consistent with hypertensive retinopathy."},"clinicalReasoning":"Assess the patient's history of hypertension and diabetes alongside his clinical findings. Analyze the retinal changes observed during the fundoscopic exam to conclude that they are indicative of hypertensive retinopathy. Integrate this understanding to arrive at the diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"hypertensive-retinopathy","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783286257734","examNumber":9301,"slotIndex":11,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-05T21:18:40.151Z"}}$opa72$,
  $kya72$Hypertensive retinopathy$kya72$,
  $exa72$Arteriovenous nicking, copper-wire arterioles, and flame-shaped hemorrhages are the funduscopic pattern of hypertensive retinopathy, and the blood pressure is 160/95 mm Hg. Diabetic retinopathy is suggested by microaneurysms, dot-blot hemorrhages, and neovascularization, which are absent. There is no acute neurologic deficit to diagnose stroke, and these retinal findings do not establish chronic kidney disease.$exa72$,
  2,
  $dma72$cardiovascular$dma72$,
  $tpa72$hypertensive-retinopathy$tpa72$,
  $sua72$https://www.merckmanuals.com/professional/eye-disorders/retinal-disorders/hypertensive-retinopathy$sua72$,
  $sla72$https://www.merckmanuals.com/professional/eye-disorders/retinal-disorders/hypertensive-retinopathy$sla72$,
  $sqa72$Funduscopic examination shows arteriolar constriction, arteriovenous nicking, vascular wall changes, flame-shaped hemorrhages, cotton-wool spots, yellow hard exudates, and optic disc edema.$sqa72$,
  $cha72$3a528d280b6d2a98aca6bf04a1d76241e4bcf8f111c4b1f4bb3c543f7b51aa7d$cha72$,
  true,
  $rfa72$[{"label": "https://www.merckmanuals.com/professional/eye-disorders/retinal-disorders/hypertensive-retinopathy", "url": "https://www.merckmanuals.com/professional/eye-disorders/retinal-disorders/hypertensive-retinopathy"}]$rfa72$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida73$cmr8d1xbv00r11ylokdmlr0dc$ida73$,
  $fxa73$wrong_blueprint|difficulty$fxa73$,
  $sca73$A 5-year-old girl visits the pediatric clinic for her routine well-child check-up. She is up to date on vaccinations and has no significant medical history. During the visit, her blood pressure is 110/70 mm Hg, and her height and weight are at the 50th percentile for her age. Her parents express concern about her upcoming entry into kindergarten and inquire about any additional vaccinations that may be needed.$sca73$,
  $qua73$What is the most appropriate ethical principle guiding the recommendation for vaccinations in this child?$qua73$,
  $opa73${"options":["Beneficence","Justice","Autonomy","Nonmaleficence"],"blueprintTopic":"vaccination-ethics","blueprintSystem":"social-sciences"}$opa73$,
  $kya73$Beneficence$kya73$,
  $exa73$The principle of beneficence is most relevant in this scenario as it emphasizes the obligation of healthcare providers to act in the best interest of the patient, which includes ensuring that the child receives appropriate vaccinations to protect her health and the health of others. Justice refers to fairness in healthcare distribution, autonomy involves respecting the patient's rights and choices, and nonmaleficence is the duty to do no harm. In this case, ensuring the child is vaccinated aligns with beneficence as it promotes her well-being and public health. 

The other options fail as follows: 
- Justice: While important, it is less relevant here since the focus is on the individual child's health rather than equitable resource distribution. 
- Autonomy: This principle is more applicable to older adolescents or adults who can make their own healthcare decisions; a 5-year-old cannot fully exercise autonomy. 
- Nonmaleficence: While avoiding harm is critical, the proactive approach of vaccination embodies beneficence more directly in this context. 

Key takeaway: The principle of beneficence is crucial in pediatric care, especially regarding vaccinations, to ensure the child's health and safety. 

Memory hook: Remember that beneficence is about 'doing good' for the patient, especially in preventive care.

Clinical reasoning: In pediatric care, the ethical principle of beneficence is paramount when discussing vaccinations. It underscores the healthcare provider's responsibility to promote the child's health and prevent disease, particularly as she prepares to enter kindergarten. This proactive approach aligns with the best interests of the child and the community.

Why other options are incorrect:
• Justice: This principle focuses on fairness and equity in healthcare, which is not the primary concern in this individual scenario.
• Autonomy: This principle is less applicable to young children who cannot make informed decisions about their health.
• Nonmaleficence: While avoiding harm is important, the proactive nature of vaccination aligns more closely with beneficence.$exa73$,
  2,
  $dma73$social-sciences$dma73$,
  $tpa73$vaccination-ethics$tpa73$,
  $sua73$https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety$sua73$,
  $sla73$https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety$sla73$,
  $sqa73$Physicians have an obligation to deal honestly with patients at all times, in addition to their obligation to promote patient welfare and safety.$sqa73$,
  $cha73$61ac599ce3093a122daac306f0430bb6a1769a2ecc4610991213cf0988cc9f02$cha73$,
  true,
  $rfa73$[{"label": "https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety", "url": "https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety"}]$rfa73$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida74$cmr8fz8hj01nj1ylomnu1nqic$ida74$,
  $fxa74$wrong_blueprint|template_artifact$fxa74$,
  NULL,
  $qua74$A 65-year-old woman with COPD comes to the emergency department because of increased shortness of breath and a productive cough; she has used her albuterol inhaler more often over the past week. In the emergency department, she has received nebulized albuterol-ipratropium and oral prednisone 40 mg. She is alert, speaks in full sentences, and is not using accessory muscles. Respiratory rate is 30/min, and oxygen saturation is 84% on room air. A chest x-ray shows hyperinflation and no infiltrates. Sputum is white and not purulent. Arterial blood gas on room air shows pH 7.38, PaCO2 44 mm Hg, and PaO2 50 mm Hg. What is the most appropriate next step in management?$qua74$,
  $opa74${"options":["Start systemic corticosteroids","Repeat nebulized ipratropium for airway obstruction","Controlled oxygen by Venturi mask titrated to SpO2 88%-92%","Initiate noninvasive ventilation for respiratory acidosis"],"blueprintTopic":"copd-controlled-oxygen","blueprintSystem":"respiratory-renal"}$opa74$,
  $kya74$Controlled oxygen by Venturi mask titrated to SpO2 88%-92%$kya74$,
  $exa74$Correct answer: C. Controlled oxygen by Venturi mask titrated to SpO2 88%-92%. Despite nebulized albuterol-ipratropium and prednisone 40 mg, oxygen saturation is 84% on room air and PaO2 is 50 mm Hg, so she needs oxygen. In COPD, oxygen is given as controlled oxygen titrated to SpO2 88%-92% (TSANZ, Grade B), which corrects the hypoxemia while limiting oxygen-induced hypercapnia; PaCO2 is 44 mm Hg now and should be rechecked on oxygen. Why the other options are wrong: A. Systemic corticosteroid has already been given (prednisone 40 mg); repeating it does not correct the hypoxemia. B. Nebulized albuterol-ipratropium has already been given; the persistent hypoxemia needs oxygen. D. NIV criteria are not met: pH is 7.38 and PaCO2 is 44 mm Hg (no hypercapnic acidosis), there are no signs of respiratory muscle fatigue, and oxygen has not yet been tried.$exa74$,
  5,
  $dma74$respiratory-renal$dma74$,
  $tpa74$copd-controlled-oxygen$tpa74$,
  $sua74$https://bestpractice.bmj.com/topics/en-us/8/management-approach$sua74$,
  $sla74$https://bestpractice.bmj.com/topics/en-us/8/management-approach$sla74$,
  $sqa74$Controlled oxygen should be titrated to a target saturation of 88% to 92% as COPD patients are considered at risk for hypercarbic (type 2) respiratory failure.$sqa74$,
  $cha74$81df51246023cb2eb7f65b6d550cedd6a5d560ceac25b57f2e6ea770ae6e05f8$cha74$,
  true,
  $rfa74$[{"label": "https://bestpractice.bmj.com/topics/en-us/8/management-approach", "url": "https://bestpractice.bmj.com/topics/en-us/8/management-approach"}]$rfa74$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida75$cmr8j0q1k02hn1ylosgrd8dem$ida75$,
  $fxa75$wrong_blueprint|template_artifact|difficulty$fxa75$,
  $sca75$A 60-year-old man with a history of diabetes presents to the clinic for routine follow-up. He reports increased thirst and urination. His fasting blood glucose is 180 mg/dL, and an HbA1c level is 8.5%. He is currently on metformin but has not made significant lifestyle changes.$sca75$,
  $qua75$What is the most appropriate next step in management?$qua75$,
  $opa75${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"type-2-diabetes-intensification","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783300023028","qcScore":8.1,"slotIndex":55,"stepLevel":"step3","examNumber":9328,"generatedAt":"2026-07-06T01:08:33.587Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Increase the dose of metformin","Add insulin therapy","Initiate a GLP-1 receptor agonist","Refer to a diabetes educator"],"taskCategory":"pharmacotherapy"}$opa75$,
  $kya75$Initiate a GLP-1 receptor agonist$kya75$,
  $exa75$Why this answer is correct
Initiating a GLP-1 receptor agonist is the best next step for this patient.
Inadequate glycemic control is indicated by the patient's HbA1c of 8.5%.
GLP-1 receptor agonists not only improve glycemic control but also promote weight loss.
This approach aligns with the stepwise management of diabetes when metformin alone is insufficient.
In practice: In practice, starting a GLP-1 receptor agonist can lead to better long-term outcomes for patients struggling with diabetes management, especially when lifestyle changes have not been effective.
Why the other options are wrong

Increase the dose of metformin (a biguanide)
Trap: Students may think that simply increasing the dose of metformin is sufficient for all patients with elevated blood glucose.
Why it fails here: Given the patient's HbA1c of 8.5%, increasing metformin alone is unlikely to achieve the desired glycemic control and may not address the patient's needs effectively.
Remember: This highlights the importance of considering additional medications when metformin is inadequate.

Add insulin therapy
Trap: There is a belief that insulin should be added early in treatment for any patient with poor control.
Why it fails here: Insulin therapy is typically reserved for more severe cases or when rapid glycemic control is necessary, which is not the case here.
Remember: This emphasizes the need to follow a stepwise approach rather than jumping to insulin.

Refer to a diabetes educator
Trap: Students might think that education alone can solve the problem of poor glycemic control.
Why it fails here: While education is important, it does not directly address the patient's immediate need for medication adjustment to improve glycemic control.
Remember: This illustrates that educational referrals should complement, not replace, pharmacotherapy.
Key takeaway
When a patient on metformin has inadequate glycemic control, think GLP-1 receptor agonist next.

Memory hook: Remember: GLP-1 for better control when metformin isn't enough.$exa75$,
  3,
  $dma75$reproductive-endocrine$dma75$,
  $tpa75$type-2-diabetes-intensification$tpa75$,
  $sua75$https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment$sua75$,
  $sla75$https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment$sla75$,
  $sqa75$In adults with type 2 diabetes and no evidence of insulin deficiency, a GLP-1 RA, including a dual GIP and GLP-1 RA, is preferred to insulin.$sqa75$,
  $cha75$d881ba7d84cf434f8cc06863d6a33186b94ad49bdb4fd785887813362c974c45$cha75$,
  true,
  $rfa75$[{"label": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rfa75$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida76$cmr8lqk4900e01ygia8llui6h$ida76$,
  $fxa76$difficulty$fxa76$,
  $sca76$A 72-year-old woman with advanced lung cancer is admitted to the hospital for palliative care. She has a history of chronic obstructive pulmonary disease (COPD) and is currently receiving oxygen therapy. Her vital signs show a blood pressure of 90/60 mm Hg, heart rate of 120 bpm, and respiratory rate of 28 breaths per minute. Her family expresses a desire to ensure that her end-of-life wishes are respected, including the possibility of not resuscitating her in the event of cardiac arrest.$sca76$,
  $qua76$What is the most appropriate next step in addressing the family's concerns regarding the patient's end-of-life care?$qua76$,
  $opa76${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"end-of-life-ethics","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783304307445","examNumber":9305,"slotIndex":46,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T02:26:02.063Z"},"options":["Initiate a do-not-resuscitate (DNR) order based on the patient's advanced directive.","Discuss the patient's prognosis and clarify her wishes regarding resuscitation.","Consult with the hospital ethics committee for guidance on end-of-life decisions.","Provide aggressive treatment options to prolong life as much as possible."]}$opa76$,
  $kya76$Discuss the patient's prognosis and clarify her wishes regarding resuscitation.$kya76$,
  $exa76$The correct answer is to discuss the patient's prognosis and clarify her wishes regarding resuscitation. This step is crucial in ensuring that the patient's values and preferences are understood and respected, especially in the context of advanced illness. Initiating a DNR order without discussing the patient's wishes may not align with her desires, and it is essential to have an open dialogue with both the patient (if possible) and her family. The other options fail because initiating a DNR order without discussion (common trap: assuming the family knows the patient's wishes), consulting the ethics committee may not be necessary at this stage (common trap: over-relying on external resources), and providing aggressive treatments contradicts the principles of palliative care, which focuses on comfort rather than prolonging life at all costs.

Clinical reasoning: Assess the patient's current condition and the family's concerns regarding her end-of-life care. Analyze the importance of understanding the patient's wishes in the context of her advanced illness and prognosis. Integrate this understanding to determine that discussing her prognosis and wishes is the most appropriate next step.

Why other options are incorrect:
• Initiate a do-not-resuscitate (DNR) order based on the patient's advanced directive.: This option assumes that the advanced directive is clear and unambiguous, which may not be the case. It is essential to confirm the patient's wishes with her family first.
• Consult with the hospital ethics committee for guidance on end-of-life decisions.: While the ethics committee can provide valuable input, it is premature to involve them without first discussing the patient's wishes and prognosis with the family.
• Provide aggressive treatment options to prolong life as much as possible.: This option contradicts the principles of palliative care and may not align with the patient's goals of care, which should be clarified first.$exa76$,
  3,
  $dma76$social-sciences$dma76$,
  $tpa76$end-of-life-ethics$tpa76$,
  $sua76$https://medlineplus.gov/advancedirectives.html$sua76$,
  $sla76$https://medlineplus.gov/advancedirectives.html$sla76$,
  $sqa76$A living will tells which treatments you want if you are dying or permanently unconscious.$sqa76$,
  $cha76$4ed1c7537c1d3d9ea19ed8ee8bad1a32d09c4acf657c8d6eb258931351b54f8f$cha76$,
  true,
  $rfa76$[{"label": "https://medlineplus.gov/advancedirectives.html", "url": "https://medlineplus.gov/advancedirectives.html"}]$rfa76$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida77$cmr8pgw9p01dh1ygity7tdlws$ida77$,
  $fxa77$wrong_blueprint$fxa77$,
  $sca77$A 3-year-old girl presents to the emergency department with fever, irritability, and a rash. The rash started on her face and has now spread to her trunk and extremities. She has a history of receiving the measles, mumps, and rubella (MMR) vaccine at 12 months. On examination, her temperature is 39°C (102.2°F), and she has conjunctivitis and Koplik spots.$sca77$,
  $qua77$Which of the following is the most likely diagnosis?$qua77$,
  $opa77${"options":["Scarlet fever","Measles","Rubella","Roseola"],"distractorRationale":{"Scarlet fever":"Presents with a different rash and is associated with strep throat.","Rubella":"Has a milder rash and does not present with Koplik spots.","Roseola":"Characterized by high fever followed by a trunk rash, not facial."},"clinicalReasoning":"Assess the signs and symptoms to determine the likely diagnosis. Analyze the presentation against known diseases to conclude that measles is the most fitting diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pediatrics","blueprintTopic":"measles","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783310559494","examNumber":9316,"slotIndex":44,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T04:03:54.256Z"}}$opa77$,
  $kya77$Measles$kya77$,
  $exa77$The clinical presentation, including the fever, rash that starts on the face and spreads, conjunctivitis, and Koplik spots, is characteristic of measles. The history of vaccination does not rule out measles, as vaccine failure can occur. Scarlet fever typically presents with a different rash and is associated with streptococcal infection. Rubella has a milder rash and is not associated with Koplik spots. Roseola typically presents with a high fever followed by a rash that starts on the trunk. The key takeaway is that recognizing the classic signs of measles is crucial for diagnosis.

Clinical reasoning: Assess the signs and symptoms to determine the likely diagnosis. Analyze the presentation against known diseases to conclude that measles is the most fitting diagnosis.

Why other options are incorrect:
• Scarlet fever: Presents with a different rash and is associated with strep throat.
• Rubella: Has a milder rash and does not present with Koplik spots.
• Roseola: Characterized by high fever followed by a trunk rash, not facial.$exa77$,
  2,
  $dma77$human-development$dma77$,
  $tpa77$measles$tpa77$,
  $sua77$https://medlineplus.gov/measles.html$sua77$,
  $sla77$https://medlineplus.gov/measles.html$sla77$,
  $sqa77$The rash often starts on the head and moves down the body.$sqa77$,
  $cha77$d417fdf976fe56084b2b1b9dacbef69b308db9075959ff0ea4f9a43932092bf4$cha77$,
  true,
  $rfa77$[{"label": "https://medlineplus.gov/measles.html", "url": "https://medlineplus.gov/measles.html"}]$rfa77$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida78$cmr97i3ul004x1ywys4doi1yd$ida78$,
  $fxa78$wrong_blueprint$fxa78$,
  NULL,
  $qua78$A 72-year-old woman with hypertension and COPD comes to the emergency department with 1 week of increasing shortness of breath and leg swelling. Blood pressure is 150/90 mm Hg, pulse is 110/min, respiratory rate is 24/min and oxygen saturation is 94% on room air. Chest x-ray shows bilateral pulmonary edema and BNP is 800 pg/mL. Which of the following is the most appropriate next step?$qua78$,
  $opa78${"options":["Administer an intravenous loop diuretic","Start high-flow oxygen","Start a beta-blocker","Obtain a computed tomography scan of the chest"],"blueprintTopic":"acute-decompensated-heart-failure","blueprintSystem":"cardiovascular"}$opa78$,
  $kya78$Administer an intravenous loop diuretic$kya78$,
  $exa78$Correct answer: A. Administer an intravenous loop diuretic. Bilateral pulmonary edema, leg swelling and BNP of 800 pg/mL indicate acute decompensated heart failure with fluid overload; with adequate oxygen saturation, prompt IV loop diuretic therapy is the next step. Why the other options are wrong: B. Her saturation of 94% is already adequate, so oxygen is not the priority. C. Beta-blockers are not started during acute decompensation with pulmonary edema. D. The chest x-ray and BNP already establish pulmonary edema; CT would delay treatment.$exa78$,
  3,
  $dma78$cardiovascular$dma78$,
  $tpa78$acute-decompensated-heart-failure$tpa78$,
  $sua78$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$sua78$,
  $sla78$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$sla78$,
  $sqa78$The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide, torsemide, bumetanide) in either oral or intravenous form.$sqa78$,
  $cha78$6430175c85259157a4c74085775bd1cd5e344dc18a99fee7e500211f8e33f7bd$cha78$,
  true,
  $rfa78$[{"label": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$rfa78$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida79$cmru7tlkp000x1yd6rrfzqpxn$ida79$,
  $fxa79$wrong_blueprint$fxa79$,
  $sca79$A 28-year-old male presents to the emergency department with a severe headache, photophobia, and neck stiffness. He reports that the headache started suddenly and is the worst he has ever experienced. His temperature is 100.4°F, and a lumbar puncture reveals cloudy cerebrospinal fluid (CSF) with a white blood cell count of 1,200 cells/mm³, predominantly lymphocytes.$sca79$,
  $qua79$What is the most likely diagnosis?$qua79$,
  $opa79${"kind":"biostats","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"viral-meningitis","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784611601719","examNumber":9301,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-21T05:27:27.028Z"},"options":["Bacterial meningitis","Viral meningitis","Subarachnoid hemorrhage","Cerebral venous sinus thrombosis"]}$opa79$,
  $kya79$Viral meningitis$kya79$,
  $exa79$The clinical presentation of severe headache, photophobia, and neck stiffness, along with the CSF findings of elevated white blood cell count with lymphocytic predominance, is suggestive of viral meningitis. The cloudy appearance of the CSF indicates an inflammatory process, but the predominance of lymphocytes rather than neutrophils suggests a viral etiology. Bacterial meningitis would typically show a predominance of neutrophils and a higher white blood cell count. Subarachnoid hemorrhage would present with a sudden severe headache but would not show a lymphocytic predominance in CSF. Cerebral venous sinus thrombosis could present similarly but is less likely given the CSF profile.

Clinical reasoning: Assess the patient's symptoms and CSF findings, analyze the predominance of lymphocytes, and integrate this information to conclude that the diagnosis is viral meningitis.

Why other options are incorrect:
• Bacterial meningitis: This would show a predominance of neutrophils and a higher white blood cell count, which is not seen here.
• Subarachnoid hemorrhage: While it presents with a severe headache, CSF findings would show xanthochromia or red blood cells, not lymphocytic predominance.
• Cerebral venous sinus thrombosis: This condition could present with similar symptoms but would not typically show a lymphocytic predominance in CSF.$exa79$,
  4,
  $dma79$behavioral-nervous$dma79$,
  $tpa79$viral-meningitis$tpa79$,
  $sua79$https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/viral-meningitis$sua79$,
  $sla79$https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/viral-meningitis$sla79$,
  $sqa79$Other findings include pleocytosis with a lymphocytic predominance.$sqa79$,
  $cha79$b8a568c2c6201238722949601a68add2b2f2c7f1d86074b4c6014e38d61b931c$cha79$,
  true,
  $rfa79$[{"label": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/viral-meningitis", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/viral-meningitis"}]$rfa79$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida80$cmru9cuvv006l1y0sja2mlptc$ida80$,
  $fxa80$not_single_best|wrong_blueprint$fxa80$,
  $sca80$A 62-year-old woman presents to the emergency department with complaints of increasing shortness of breath over the past week. Her vital signs show a blood pressure of 130/85 mm Hg, heart rate of 98 bpm, and oxygen saturation at 96% on room air. A chest X-ray reveals bilateral pleural effusions, and her laboratory results show a BNP level of 800 pg/mL. She has a history of hypertension and type 2 diabetes mellitus.$sca80$,
  $qua80$What is the most appropriate next step in management?$qua80$,
  $opa80${"kind":"biostats","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"acute-decompensated-heart-failure","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784614152465","examNumber":9303,"slotIndex":6,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-21T06:10:21.719Z"},"options":["Administer diuretics","Perform a thoracentesis","Initiate oxygen therapy","Start an ACE inhibitor"]}$opa80$,
  $kya80$Administer diuretics$kya80$,
  $exa80$Bilateral effusions, dyspnea, and a BNP of 800 pg/mL indicate acute heart failure with fluid overload. Oxygen saturation is already 96%, so supplemental oxygen is not the priority. Intravenous loop diuretics are the treatment for that congestion. Thoracentesis is not the first step for bilateral effusions caused by heart failure. An ACE inhibitor is not the immediate treatment of acute volume overload.$exa80$,
  3,
  $dma80$cardiovascular$dma80$,
  $tpa80$acute-decompensated-heart-failure$tpa80$,
  $sua80$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$sua80$,
  $sla80$https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf$sla80$,
  $sqa80$Decongestive therapy uses diuretics, namely loop diuretics such as furosemide, torsemide, or bumetanide.$sqa80$,
  $cha80$2ea0fb4a5e5272a183435e4c86f8030e1672837a2e301155184222045f7f68da$cha80$,
  true,
  $rfa80$[{"label": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$rfa80$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida81$cmrvwqxjb00221ye8okdkqxww$ida81$,
  $fxa81$template_artifact|rationale$fxa81$,
  $sca81$A 32-year-old female presents to the emergency department with acute shortness of breath and pleuritic chest pain after a long-haul flight. Her vital signs show a blood pressure of 110/70 mmHg, heart rate of 110 beats per minute, respiratory rate of 28 breaths per minute, and oxygen saturation of 88% on room air. Physical examination reveals mild swelling in the right calf, raising suspicion for a thromboembolic event.$sca81$,
  $qua81$What is the next best step in the management of this patient?$qua81$,
  $opa81${"options":["Order a D-dimer assay before any chest imaging","Start supplemental oxygen and order CT pulmonary angiogram","Administer nebulized albuterol for presumed bronchospasm","Order a chest radiograph as the definitive diagnostic test"]}$opa81$,
  $kya81$Start supplemental oxygen and order CT pulmonary angiogram$kya81$,
  $exa81$Sudden dyspnea, pleuritic pain, tachycardia, a saturation of 88%, a long flight, and unilateral calf swelling make pulmonary embolism likely. Supplemental oxygen treats the hypoxemia, and CT pulmonary angiography is the preferred confirmatory test when pretest probability is high. A D-dimer is used when probability is low or intermediate, not to delay imaging here. Albuterol treats bronchospasm, which is not described. A chest radiograph can look for other diagnoses but does not confirm embolism.$exa81$,
  5,
  $dma81$respiratory-renal$dma81$,
  $tpa81$pe-workup$tpa81$,
  $sua81$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$sua81$,
  $sla81$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$sla81$,
  $sqa81$CT angiography is the preferred imaging technique for diagnosing acute pulmonary embolism.$sqa81$,
  $cha81$0921beba826418ca7923724e3dbe53b46707ef61049b98a40e790d9d90e87271$cha81$,
  true,
  $rfa81$[{"label": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$rfa81$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida82$cmrwa1zah001r1ynhrbempihv$ida82$,
  $fxa82$wrong_blueprint|difficulty$fxa82$,
  $sca82$outpatient clinic
48-year-old male with persistent cough and hemoptysis
Vitals: BP: 135/85, HR: 90, RR: 18, Temp: 99.0°F, O2 Sat: 97%
for the past 2 months$sca82$,
  $qua82$A 48-year-old male presents with a 2-month history of persistent cough and occasional hemoptysis. He is a smoker with a 30-pack-year history. There is no significant weight loss or night sweats. Examination reveals decreased breath sounds on the right.$qua82$,
  $opa82${"stepLevel":"step3","kind":"ccs_prompt","caseData":{"setting":"outpatient clinic","presentation":"48-year-old male with persistent cough and hemoptysis","vitals":"BP: 135/85, HR: 90, RR: 18, Temp: 99.0°F, O2 Sat: 97%","timeline":"for the past 2 months"},"structureIds":["heart","lungs","kidneys"],"options":["Order a chest X-ray","Prescribe antibiotics for pneumonia","Start smoking cessation therapy","Order a CT scan of the chest"],"blueprintTopic":"hemoptysis-evaluation"}$opa82$,
  $kya82$Order a chest X-ray$kya82$,
  $exa82$In a smoker with hemoptysis and persistent cough, lung cancer must be considered. The initial step in evaluating a patient with these symptoms is ordering a chest X-ray to assess for any masses or abnormalities. A CT scan can be considered if the X-ray findings are suspicious or inconclusive. Antibiotics are not indicated without evidence of infection, and smoking cessation is important but not the immediate diagnostic step.$exa82$,
  2,
  $dma82$respiratory-renal$dma82$,
  $tpa82$hemoptysis-evaluation$tpa82$,
  $sua82$https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/hemoptysis$sua82$,
  $sla82$https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/hemoptysis$sla82$,
  $sqa82$All patients with hemoptysis should have chest radiograph and pulse oximetry.$sqa82$,
  $cha82$69aa7bf10b8b2287fa6cb0d8b8efc102daabdfbb2391b7766a80aa44495badb2$cha82$,
  true,
  $rfa82$[{"label": "https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/hemoptysis", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/symptoms-of-pulmonary-disorders/hemoptysis"}]$rfa82$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida83$b17-s2-90$ida83$,
  $fxa83$wrong_blueprint$fxa83$,
  $sca83$A 41-year-old man on stable buprenorphine breaks a bone and has severe pain. He is in the emergency department.$sca83$,
  $qua83$Is buprenorphine stopped, and how is the pain treated?$qua83$,
  $opa83${"options":["Stop it and give no opioid","Give a benzodiazepine as the fracture drug","Refuse all analgesia because of the opioid history","Discharge with no plan and the fracture unset","Continue it and treat the pain"],"blueprintTopic":"buprenorphine-acute-pain","blueprintSystem":"behavioral-nervous"}$opa83$,
  $kya83$Continue it and treat the pain$kya83$,
  $exa83$Acute severe pain in a patient on buprenorphine is treated by continuing buprenorphine and adding a short-acting opioid or other analgesia, coordinated with the prescriber. Stopping buprenorphine abruptly is not the pain plan. Stopping a stable dose precipitates withdrawal and still leaves the fracture untreated. Analgesia is added. The usual prescriber is involved. American Medical Association. Code of Medical Ethics. Chicago: AMA; 2017.

Continue it and treat the pain
Stop it and give no opioid — That choice causes withdrawal and ignores the fracture.
Give a benzodiazepine as the fracture drug — A sedative is not bone-pain treatment.
Refuse all analgesia because of the opioid history — Acute severe pain is treated.
Discharge with no plan and the fracture unset — The bone and the pain both need a plan.$exa83$,
  3,
  $dma83$behavioral-nervous$dma83$,
  $tpa83$buprenorphine-acute-pain$tpa83$,
  $sua83$https://pmc.ncbi.nlm.nih.gov/articles/PMC11282871/$sua83$,
  $sla83$https://pmc.ncbi.nlm.nih.gov/articles/PMC11282871/$sla83$,
  $sqa83$If a patient is maintained on buprenorphine for OUD before a surgery or is hospitalized with acute pain for nonsurgical reasons, buprenorphine should be continued.$sqa83$,
  $cha83$46fb0f776f0c65d85a44006278846b6eb13b4f1cf50d2cb0ec9a959b998d3b44$cha83$,
  true,
  $rfa83$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11282871/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11282871/"}]$rfa83$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida84$b3xfc560b7297d57d3d868ce07a$ida84$,
  $fxa84$wrong_blueprint$fxa84$,
  $sca84$A 42-year-old man has triglycerides of 1,800 mg/dL. He had pancreatitis last year. LDL is not the main abnormality. He still eats a high-fat diet. Glucose is 100 mg/dL.$sca84$,
  $qua84$Which plan addresses 1,800 mg/dL?$qua84$,
  $opa84${"options":["Diet with no drug and no change in fat","Niacin as the only modern plan","Observation until the next attack","A fibrate and a very-low-fat diet","A statin as the only drug"],"blueprintTopic":"hypertriglyceridemia","blueprintSystem":"reproductive-endocrine"}$opa84$,
  $kya84$A fibrate and a very-low-fat diet$kya84$,
  $exa84$Triglycerides above 1000 mg/dL risk pancreatitis and are lowered with a fibrate and a very-low-fat diet, not with a statin alone. A fibrate and a very-low-fat diet is the plan that targets this number. A statin as the only drug lowers LDL more than it lowers triglycerides this high. Diet with no drug and no change in fat leaves the risk. Niacin as the only modern plan is not preferred. Observation until the next attack waits for pancreatitis.$exa84$,
  4,
  $dma84$reproductive-endocrine$dma84$,
  $tpa84$hypertriglyceridemia$tpa84$,
  $sua84$https://pmc.ncbi.nlm.nih.gov/articles/PMC3431581/$sua84$,
  $sla84$https://pmc.ncbi.nlm.nih.gov/articles/PMC3431581/$sla84$,
  $sqa84$We recommend that a fibrate be used as a first-line agent for reduction of triglycerides in patients at risk for triglyceride-induced pancreatitis.$sqa84$,
  $cha84$a677d1933dbf7bb8554fa27e4f746965b0cfd290d3ce7596b5bd418bea61bbff$cha84$,
  true,
  $rfa84$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3431581/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3431581/"}]$rfa84$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida85$b9x8b1bbe8c9326d32aff9f738c$ida85$,
  $fxa85$template_artifact|wrong_blueprint$fxa85$,
  $sca85$A 78-year-old patient has vomiting, a distended small bowel, and air in the biliary tree on the film. She has never had abdominal surgery. A classmate calls it ordinary adhesions and places a tube only. There is no hernia. The pain comes in waves. She is not passing gas.$sca85$,
  $qua85$Why do adhesions not explain this film?$qua85$,
  $opa85${"options":["Not passing gas means the air in the biliary tree is an incidental finding","Absence of a hernia means this bowel obstruction cannot be caused by a stone","Air in the biliary tree without prior biliary surgery means a stone has entered the bowel","No prior abdominal surgery is the usual setting for adhesive obstruction","A distended small bowel with waves of pain is always caused by adhesions"],"blueprintTopic":"gallstone-ileus","blueprintSystem":"gastrointestinal"}$opa85$,
  $kya85$Air in the biliary tree without prior biliary surgery means a stone has entered the bowel$kya85$,
  $exa85$Air in the biliary tree changes the obstruction from adhesions to a stone that eroded into the bowel. Air in the biliary tree without prior biliary surgery means a stone has entered the bowel. No prior abdominal surgery is the usual setting for adhesions is why adhesions are unlikely. A distended small bowel with waves of pain is always adhesions can be a stone. Not passing gas means the biliary air is incidental is the obstruction. Absence of a hernia means the obstruction cannot be a stone leaves the stone.$exa85$,
  5,
  $dma85$gastrointestinal$dma85$,
  $tpa85$gallstone-ileus$tpa85$,
  $sua85$https://pmc.ncbi.nlm.nih.gov/articles/PMC5849656/$sua85$,
  $sla85$https://pmc.ncbi.nlm.nih.gov/articles/PMC5849656/$sla85$,
  $sqa85$Rigler described his famous triad of radiological signs in 1941 for gallstone ileus on plain film: air within the biliary tree (pneumobilia), signs of small bowel obstruction, and ectopic radio-opaque gallstones.$sqa85$,
  $cha85$ada68a2edeefe6df19fd2b9461e68aa5c7963c826dd9b70fd867e2da9d8c6956$cha85$,
  true,
  $rfa85$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5849656/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5849656/"}]$rfa85$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida86$cmqxd0pcj006e1yma0n4zjzj5$ida86$,
  $fxa86$rationale$fxa86$,
  $sca86$A 45-year-old woman presents to the emergency department with jaundice and fatigue for the past week. She has a history of alcohol use disorder and has been drinking heavily for the past month. On examination, her vital signs are stable, but she has scleral icterus and mild abdominal tenderness. Laboratory tests reveal total bilirubin of 4.5 mg/dL, AST 280 U/L, ALT 100 U/L, and an alkaline phosphatase of 100 U/L.$sca86$,
  $qua86$What is the most likely diagnosis?$qua86$,
  $opa86${"kind":"image_based","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"pancreatitis-hepatitis","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782624429375","qcScore":8.4,"slotIndex":11,"stepLevel":"step2","examNumber":1375,"generatedAt":"2026-06-28T05:31:20.039Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Alcoholic hepatitis","Cholecystitis","Hepatitis A","Non-alcoholic fatty liver disease"],"taskCategory":"diagnosis"}$opa86$,
  $kya86$Alcoholic hepatitis$kya86$,
  $exa86$AST 280 U/L and ALT 100 U/L give a ratio greater than 2:1, with only moderate enzyme elevations, jaundice, a normal alkaline phosphatase, and a month of heavy drinking. That pattern is alcoholic hepatitis. Cholecystitis would raise the alkaline phosphatase and cause more focal right-upper-quadrant pain and fever. Hepatitis A usually drives ALT much higher than AST. Nonalcoholic fatty liver disease does not present as an acute jaundice illness with this enzyme pattern.$exa86$,
  4,
  $dma86$gastrointestinal$dma86$,
  $tpa86$pancreatitis-hepatitis$tpa86$,
  $sua86$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$sua86$,
  $sla86$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$sla86$,
  $sqa86$The ratio of aspartate aminotransferase (AST) to alanine aminotransferase (ALT) is ≥ 2.$sqa86$,
  $cha86$4343bff059eb5d69fd65a3b074dd80eb15f90be392889c86a98931b4f974d911$cha86$,
  true,
  $rfa86$[{"label": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$rfa86$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida87$cmqxee8lv003u1y79z180nru9$ida87$,
  $fxa87$wrong_key|rationale|template_artifact|difficulty$fxa87$,
  $sca87$A 45-year-old woman with type 2 diabetes presents with three days of vomiting and diffuse abdominal pain. Her medications are metformin and lisinopril. Blood pressure is 100/60 mm Hg and heart rate is 110 bpm. The abdomen is soft and mildly tender without guarding. Glucose is 350 mg/dL, serum bicarbonate is 12 mEq/L, arterial pH is 7.22, and serum beta-hydroxybutyrate is elevated.$sca87$,
  $qua87$What is the most appropriate initial management for this patient?$qua87$,
  $opa87${"kind":"image_based","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"diabetes-dka-management","physicianTask":"interpretation","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782626775815","qcScore":8.1,"slotIndex":8,"stepLevel":"step2","examNumber":7815,"generatedAt":"2026-06-28T06:09:06.407Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Intravenous fluids and insulin therapy","Subcutaneous insulin administration","Oral hypoglycemic agents","Immediate surgical consultation"],"taskCategory":"interpretation"}$opa87$,
  $kya87$Intravenous fluids and insulin therapy$kya87$,
  $exa87$Hyperglycemia, a bicarbonate of 12 mEq/L, pH 7.22, and an elevated beta-hydroxybutyrate establish diabetic ketoacidosis. Initial treatment is intravenous volume expansion and intravenous insulin. Subcutaneous insulin and oral agents do not correct this degree of acidosis and dehydration. The abdomen is soft and without guarding, so surgical consultation is not the initial step.$exa87$,
  3,
  $dma87$reproductive-endocrine$dma87$,
  $tpa87$diabetes-dka-management$tpa87$,
  $sua87$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka$sua87$,
  $sla87$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka$sla87$,
  $sqa87$DKA is diagnosed by detection of hyperketonemia and anion gap metabolic acidosis in the presence of hyperglycemia.$sqa87$,
  $cha87$01db577c128cca728a718e871c52c82eb971d971548dbef98c5a851e5292095c$cha87$,
  true,
  $rfa87$[{"label": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka"}]$rfa87$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida88$cmr88s2v000tz1yr9644hpxxn$ida88$,
  $fxa88$wrong_blueprint|template_artifact$fxa88$,
  $sca88$A 45-year-old woman presents to the emergency department with severe abdominal pain in the right lower quadrant. She has a history of intermittent abdominal pain over the past year but denies any fever or vomiting. On examination, her vital signs are stable with a temperature of 98.6°F, BP 120/80 mm Hg, and tenderness in the right lower quadrant. A complete blood count shows leukocytosis with a white blood cell count of 14,000 cells/mm³.$sca88$,
  $qua88$Which of the following is the most likely diagnosis?$qua88$,
  $opa88${"options":["Acute appendicitis","Ovarian torsion","Diverticulitis","Ectopic pregnancy"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"appendicitis","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783282762745","qcScore":8.2,"slotIndex":30,"stepLevel":"step2","examNumber":9210,"generatedAt":"2026-07-05T20:20:39.594Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"diagnosis"}$opa88$,
  $kya88$Acute appendicitis$kya88$,
  $exa88$Why this answer is correct
Acute appendicitis is the most likely diagnosis due to classic symptoms and lab findings.
Right lower quadrant pain is a hallmark of acute appendicitis.
Leukocytosis (elevated white blood cell count) indicates an inflammatory process.
The patient's stable vital signs and lack of fever suggest a non-perforated appendicitis.
In practice: In practice, recognizing acute appendicitis early is crucial to prevent complications like perforation. This means timely surgical intervention can significantly improve patient outcomes.
Why the other options are wrong

Ovarian torsion
Trap: Students may confuse ovarian torsion with appendicitis due to similar abdominal pain.
Why it fails here: However, ovarian torsion typically presents with adnexal tenderness and may include nausea or vomiting, which are absent in this case.
Remember: Understanding the specific signs associated with ovarian torsion helps differentiate it from appendicitis.

Diverticulitis
Trap: Some students might think diverticulitis is a possibility due to abdominal pain and leukocytosis.
Why it fails here: Diverticulitis usually presents with left lower quadrant pain and is more common in older adults, making it unlikely in this younger patient with right-sided pain.
Remember: Recognizing the typical presentation of diverticulitis is key to accurate diagnosis.

Ectopic pregnancy (a pregnancy outside the uterus)
Trap: Ectopic pregnancy (a pregnancy outside the uterus) may be considered due to the patient's gender and age.
Why it fails here: However, it often presents with additional symptoms like vaginal bleeding or a positive pregnancy test, which are not present here.
Remember: Differentiating ectopic pregnancy from appendicitis requires awareness of its specific clinical signs.
Key takeaway
When faced with right lower quadrant pain and leukocytosis, prioritize acute appendicitis as the likely diagnosis.

Memory hook: Remember: Appendicitis = Right side + Inflammation (leukocytosis).$exa88$,
  2,
  $dma88$gastrointestinal$dma88$,
  $tpa88$appendicitis$tpa88$,
  $sua88$https://medlineplus.gov/appendicitis.html$sua88$,
  $sla88$https://medlineplus.gov/appendicitis.html$sla88$,
  $sqa88$The main symptom is pain in the abdomen, often on the right side.$sqa88$,
  $cha88$05e1a151f5d696543bdf9904237d3592ef0a801f11a102ab800ae6655ba7508e$cha88$,
  true,
  $rfa88$[{"label": "https://medlineplus.gov/appendicitis.html", "url": "https://medlineplus.gov/appendicitis.html"}]$rfa88$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida89$cmrtgb2y4002o1ydwzjf88gpe$ida89$,
  $fxa89$wrong_blueprint|template_artifact$fxa89$,
  $sca89$A 72-year-old woman presents to the emergency department with acute shortness of breath and a productive cough that has worsened over the past three days. She has a history of chronic obstructive pulmonary disease (COPD) and is currently on a long-acting beta-agonist. Her vital signs are: BP 130/85 mm Hg, HR 102 bpm, RR 24 breaths/min, and oxygen saturation 88% on room air. A chest X-ray reveals hyperinflation but no acute infiltrates. Arterial blood gas analysis shows pH 7.32, pCO2 60 mm Hg, and pO2 55 mm Hg.$sca89$,
  $qua89$What is the next best step in management?$qua89$,
  $opa89${"options":["Initiate noninvasive positive pressure ventilation","Administer systemic corticosteroids for airway inflammation","Start intravenous antibiotics for a presumed lung infection","Provide supplemental oxygen without ventilatory support"],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"copd-noninvasive-ventilation","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784565406373","qcScore":8.1,"slotIndex":17,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-20T16:38:42.402Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"diagnosis"}$opa89$,
  $kya89$Initiate noninvasive positive pressure ventilation$kya89$,
  $exa89$Why this answer is correct
Initiating noninvasive positive pressure ventilation (NPPV) is essential for managing acute respiratory failure in this patient.
Acute respiratory failure is indicated by the patient's low pH and high pCO2 levels.
NPPV helps improve ventilation and reduces the work of breathing.
It is a first-line intervention for COPD exacerbations with respiratory acidosis.
In practice: On the unit, using NPPV can stabilize patients by enhancing gas exchange and preventing the need for intubation, which is critical in acute settings.
Why the other options are wrong

Administer systemic corticosteroids
Trap: Students may think corticosteroids are the primary treatment for all COPD exacerbations.
Why it fails here: While corticosteroids reduce inflammation and are important in managing COPD exacerbations, they do not directly address the immediate respiratory failure caused by hypercapnia and acidosis.
Remember: This highlights the need to prioritize interventions that directly improve ventilation in acute respiratory failure.

Start intravenous antibiotics (give antibiotics through a vein)
Trap: There is a common belief that antibiotics should be the first step in any respiratory distress scenario.
Why it fails here: Antibiotics are only necessary if there is a clear indication of infection, which is not established in this vignette; the immediate concern is the patient's respiratory status.
Remember: This emphasizes the importance of addressing the underlying cause of respiratory failure before considering antibiotics.

Provide supplemental oxygen only
Trap: Students might think that oxygen therapy alone is sufficient for any patient with low oxygen saturation.
Why it fails here: While oxygen is crucial, it does not correct the underlying hypercapnia (elevated carbon dioxide) and acidosis, which are critical in this case.
Remember: This reinforces the concept that oxygen therapy must be part of a broader strategy to manage acute respiratory failure.
Key takeaway
When faced with acute respiratory failure in COPD exacerbations, prioritize noninvasive positive pressure ventilation to improve ventilation and gas exchange.

Memory hook: Think of NPPV as a 'breath of fresh air' for patients in respiratory distress.$exa89$,
  5,
  $dma89$respiratory-renal$dma89$,
  $tpa89$copd-noninvasive-ventilation$tpa89$,
  $sua89$https://bestpractice.bmj.com/topics/en-us/8/management-approach$sua89$,
  $sla89$https://bestpractice.bmj.com/topics/en-us/8/management-approach$sla89$,
  $sqa89$Respiratory acidosis (partial pressure of carbon dioxide [PaCO 2] ≥6.0 kPa or 45 mmHg and arterial pH ≤7.35)$sqa89$,
  $cha89$53fbd9fcae5026df2c545bc54ebe7c3d580a27e2680a57e399aa1c22dfe93c48$cha89$,
  true,
  $rfa89$[{"label": "https://bestpractice.bmj.com/topics/en-us/8/management-approach", "url": "https://bestpractice.bmj.com/topics/en-us/8/management-approach"}]$rfa89$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida90$cmrvm5z58001ljw04yfpwleqr$ida90$,
  $fxa90$wrong_blueprint|difficulty$fxa90$,
  $sca90$A 58-year-old woman presents to the emergency department with sudden onset dyspnea and pleuritic chest pain. She has a history of smoking and reports right leg swelling that developed over the past few days. On examination, her heart rate is 112 beats per minute, respiratory rate is 24 breaths per minute, and oxygen saturation is 91% on room air. Lung auscultation reveals clear breath sounds bilaterally.$sca90$,
  $qua90$What is the most likely diagnosis?$qua90$,
  $opa90${"options":["Pulmonary embolism","Community-acquired pneumonia","Spontaneous pneumothorax","Acute asthma exacerbation"],"distractorRationale":{"Community-acquired pneumonia":"However, pneumonia typically presents with abnormal lung findings such as crackles or wheezing, which are absent in this patient. (This highlights the importance of auscultation findings in differentiating respiratory conditions.)","Spontaneous pneumothorax":"Spontaneous pneumothorax usually presents with unilateral decreased breath sounds and acute respiratory distress, neither of which are observed here. (Understanding the typical presentation of pneumothorax helps clarify its distinction from pulmonary embolism.)","Acute asthma exacerbation":"An acute asthma exacerbation would typically show wheezing and a history of asthma, which are not present in this case. (Recognizing the absence of wheezing and asthma history is crucial for accurate diagnosis.)"},"clinicalReasoning":"The most likely diagnosis is pulmonary embolism due to the patient's sudden dyspnea and pleuritic chest pain. **Sudden onset** dyspnea and pleuritic chest pain are classic symptoms of pulmonary embolism. The **history of leg swelling** suggests possible deep vein thrombosis, a common source of emboli.","keyTakeaways":["When faced with sudden dyspnea and pleuritic chest pain, always consider pulmonary embolism as a top diagnosis, especially with leg swelling."],"blueprintTopic":"pulmonary-embolism"}$opa90$,
  $kya90$Pulmonary embolism$kya90$,
  $exa90$Why this answer is correct
The most likely diagnosis is pulmonary embolism due to the patient's sudden dyspnea and pleuritic chest pain.
Sudden onset dyspnea and pleuritic chest pain are classic symptoms of pulmonary embolism.
The history of leg swelling suggests possible deep vein thrombosis, a common source of emboli.
Tachycardia and hypoxemia (low oxygen saturation) further support the diagnosis of a pulmonary embolism.
In practice: In practice, recognizing the signs of pulmonary embolism is critical because it can rapidly become life-threatening. Prompt diagnosis and treatment can significantly improve patient outcomes.
Why the other options are wrong

Community-acquired pneumonia
Trap: Students may think this is a possibility due to the presence of respiratory symptoms.
Why it fails here: However, pneumonia typically presents with abnormal lung findings such as crackles or wheezing, which are absent in this patient.
Remember: This highlights the importance of auscultation findings in differentiating respiratory conditions.

Spontaneous pneumothorax
Trap: Some may confuse the acute dyspnea with pneumothorax due to its sudden onset.
Why it fails here: Spontaneous pneumothorax usually presents with unilateral decreased breath sounds and acute respiratory distress, neither of which are observed here.
Remember: Understanding the typical presentation of pneumothorax helps clarify its distinction from pulmonary embolism.

Acute asthma exacerbation
Trap: Students might consider asthma due to the respiratory distress.
Why it fails here: An acute asthma exacerbation would typically show wheezing and a history of asthma, which are not present in this case.
Remember: Recognizing the absence of wheezing and asthma history is crucial for accurate diagnosis.
Key takeaway
When faced with sudden dyspnea and pleuritic chest pain, always consider pulmonary embolism as a top diagnosis, especially with leg swelling.

Memory hook: Think 'PE' for 'Pleuritic pain and Edema' when assessing for pulmonary embolism.$exa90$,
  2,
  $dma90$respiratory-renal$dma90$,
  $tpa90$pulmonary-embolism$tpa90$,
  $sua90$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$sua90$,
  $sla90$https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe$sla90$,
  $sqa90$Symptoms of pulmonary embolism are nonspecific and include dyspnea, pleuritic chest pain, and, in more severe cases, light-headedness, presyncope, syncope, or cardiorespiratory arrest.$sqa90$,
  $cha90$1606cea7d0cd87c5a28232f0172c53f2ce26cd0fa8c5ead9c4ce4f4aac4de347$cha90$,
  true,
  $rfa90$[{"label": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$rfa90$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida91$cmwfsamvi0009jsep58ty12by$ida91$,
  $fxa91$difficulty$fxa91$,
  $sca91$A 32-year-old woman, gravida 2 para 1, is pushing at 39 weeks. The fetal head delivers and then retracts against the perineum. Gentle downward traction does not deliver the anterior shoulder. The fetal heart rate was 140/min before the head delivered. She has an epidural and can still flex her hips. Estimated fetal weight on the last scan was 4100 g.$sca91$,
  $qua91$Which of the following is the most appropriate next step in management?$qua91$,
  $opa91${"options":["More downward traction on the fetal head","Immediate Zavanelli replacement of the head","Stop and move to cesarean with the head delivered","McRoberts flexion with suprapubic pressure","Fundal pressure while she keeps pushing"],"kind":"vignette","blueprintSystem":"reproductive-endocrine","blueprintTopic":"McRoberts maneuver for shoulder dystocia","taskCategory":"clinical-intervention"}$opa91$,
  $kya91$McRoberts flexion with suprapubic pressure$kya91$,
  $exa91$After the head delivers and the shoulder is stuck, the first maneuvers are to call for help, stop extra pushing and traction, flex and abduct the hips (McRoberts), and apply suprapubic pressure. Fundal pressure drives the shoulder into the pubic bone. "Fundal pressure while she keeps pushing" is not the best choice because Fundal pressure worsens impaction of the anterior shoulder and is avoided. "Immediate Zavanelli replacement of the head" is not the best choice because Cephalic replacement is a last-resort maneuver after first- and second-line steps fail. "More downward traction on the fetal head" is not the best choice because Increasing traction raises the risk of brachial plexus injury and does not relieve the bony impaction. "Stop and move to cesarean with the head delivered" is not the best choice because The head is already out. Abdominal delivery is not the next maneuver.$exa91$,
  3,
  $dma91$reproductive-endocrine$dma91$,
  $tpa91$McRoberts maneuver for shoulder dystocia$tpa91$,
  $sua91$https://www.aafp.org/afp/2020/0715/p84$sua91$,
  $sla91$https://www.aafp.org/afp/2020/0715/p84$sla91$,
  $sqa91$ACOG, the Royal College of Obstetricians and Gynaecologists, and the Advanced Life Support in Obstetrics program recommend using the McRoberts maneuver first, followed by suprapubic pressure if necessary.$sqa91$,
  $cha91$07803b88e8564a06b80ac073864001914a9d1576e41c57800f42d5d28db5c73e$cha91$,
  true,
  $rfa91$[{"label": "https://www.aafp.org/afp/2020/0715/p84", "url": "https://www.aafp.org/afp/2020/0715/p84"}]$rfa91$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida92$b2x47235e2861835c6173c88c3a$ida92$,
  $fxa92$wrong_blueprint$fxa92$,
  $sca92$A 22-year-old student must choose a design. Age and smoking can be written down, but frailty cannot. One design lets clinicians pick who gets the drug. Another assigns the drug by a random number. She asks which design balances the frailty she cannot measure.$sca92$,
  $qua92$Which design balances the unmeasured frailty?$qua92$,
  $opa92${"options":["Letting clinicians choose","Random assignment","A case series","Asking patients to pick","Matching only on age after the fact"],"blueprintTopic":"randomization","blueprintSystem":"biostats-epi"}$opa92$,
  $kya92$Random assignment$kya92$,
  $exa92$Random assignment is what balances unmeasured frailty, which clinician choice and patient choice both leave unbalanced. Random assignment balances frailty she cannot measure. Letting clinicians choose puts sicker patients in one arm. A case series has no comparison arm. Asking patients to pick recreates the confounding. Matching only on age after the fact does not balance unmeasured frailty.$exa92$,
  3,
  $dma92$biostats-epi$dma92$,
  $tpa92$randomization$tpa92$,
  $sua92$https://www.ncbi.nlm.nih.gov/books/NBK305495/$sua92$,
  $sla92$https://www.ncbi.nlm.nih.gov/books/NBK305495/$sla92$,
  $sqa92$Randomization should ensure that any potential confounding factors, whether known or unknown, are similarly distributed in each of the intervention groups and therefore cannot bias the comparisons of outcome measures between the groups.$sqa92$,
  $cha92$1e6579f9705f841beba433fbeb17f3694670bfb3aad03ff66000d7913c6c6d69$cha92$,
  true,
  $rfa92$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK305495/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK305495/"}]$rfa92$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida93$b4xdd869f2dd6afbc61b7a7af58$ida93$,
  $fxa93$template_artifact|wrong_blueprint$fxa93$,
  $sca93$A 19-year-old woman took a large number of aspirin tablets. Respiratory rate is 30. PCO2 is 18 mm Hg. pH is 7.46 now. The anion gap is 22. Temperature is 38.6 C. A colleague says a low PCO2 and a high gap cannot exist together.$sca93$,
  $qua93$Why do a low PCO2 and a high anion gap coexist?$qua93$,
  $opa93${"options":["The drug drives ventilation and also generates organic acids","The low PCO2 is compensation for a metabolic alkalosis","The anion gap is produced by a low albumin concentration alone","Ventilation fell, and the PCO2 number is misread","Fever by itself is what opened the anion gap"],"blueprintTopic":"salicylate-toxicity","blueprintSystem":"respiratory-renal"}$opa93$,
  $kya93$The drug drives ventilation and also generates organic acids$kya93$,
  $exa93$High-dose salicylate stimulates breathing and also produces an organic acidosis, so PCO2 is low while the anion gap is high. The drug drives ventilation and also generates organic acids. The low PCO2 is compensation for a metabolic alkalosis is the wrong primary process; the gap acids are metabolic acidosis, and the hyperventilation is also direct. The gap is from albumin only would not reach 22 this way as the lead explanation. Ventilation fell, and the PCO2 number is misread contradicts a rate of 30 and a PCO2 of 18. Fever alone opens the anion gap does not.$exa93$,
  5,
  $dma93$respiratory-renal$dma93$,
  $tpa93$salicylate-toxicity$tpa93$,
  $sua93$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning$sua93$,
  $sla93$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning$sla93$,
  $sqa93$Salicylate poisoning causes respiratory alkalosis and, by an independent mechanism, metabolic acidosis.$sqa93$,
  $cha93$b12431f22b0142cc5b90d320fd2e36003b15a3a0413f643207fc49c62cd8bd5a$cha93$,
  true,
  $rfa93$[{"label": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning"}]$rfa93$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida94$b7x666facc3fe91e41048c0468d$ida94$,
  $fxa94$template_artifact|wrong_blueprint$fxa94$,
  $sca94$An 8-year-old patient develops severe pain in the hands and feet during a long flight. A film made after the blood sits without air shows crescent-shaped cells. Each parent has a mild anemia and target cells but has never had this pain. Oxygen on the plane was lower than at home.$sca94$,
  $qua94$Why does the flight hurt him when the same cabin does not hurt his parents?$qua94$,
  $opa94${"options":["Only his cells contain enough of the variant chain to stack into rigid polymers when oxygen comes off","Target cells already present in his parents are stacks of polymerized hemoglobin","Cabin hypoxia breaks down the red-cell membrane to the same degree in all three of them","Pain requires a second enzyme defect that the flight supplies","The parents' hemoglobin binds oxygen so loosely that it never unloads"],"blueprintTopic":"sickle-cell-disease","blueprintSystem":"blood-lymph-immune"}$opa94$,
  $kya94$Only his cells contain enough of the variant chain to stack into rigid polymers when oxygen comes off$kya94$,
  $exa94$Pain on a flight means his red cells hold enough variant hemoglobin to polymerize when oxygen falls, and his parents' cells do not. Only his cells contain enough of the variant chain to stack into rigid polymers when oxygen comes off. Target cells in the parents are already polymers are a membrane-excess shape, not a stack of hemoglobin. Cabin pressure breaks down the membrane equally in all three would have hurt the parents. Pain requires a second enzyme defect that the flight supplies is the oxygen drop acting on the polymer. The parents' hemoglobin binds oxygen so loosely that it never unloads reverses trait hemoglobin, which still unloads but does not stack at this oxygen level.$exa94$,
  4,
  $dma94$blood-lymph-immune$dma94$,
  $tpa94$sickle-cell-disease$tpa94$,
  $sua94$https://www.ncbi.nlm.nih.gov/books/NBK537130/$sua94$,
  $sla94$https://www.ncbi.nlm.nih.gov/books/NBK537130/$sla94$,
  $sqa94$Typically, patients with sickle cell trait remain asymptomatic with HbS levels less than 35%.$sqa94$,
  $cha94$1deb1c93397778891822b5d3634727d8869d94dbf167473844f3c6a4bf71847f$cha94$,
  true,
  $rfa94$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK537130/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK537130/"}]$rfa94$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida95$cmqxcjtiv003i1ymabfkjs629$ida95$,
  $fxa95$rationale|difficulty$fxa95$,
  $sca95$A 28-year-old woman presents to the clinic with irregular menstrual cycles and difficulty conceiving for the past year. She reports weight gain and increased facial hair over the last few months. On examination, her blood pressure is 130/85 mm Hg, and her BMI is 32. Laboratory tests reveal elevated testosterone levels and an ultrasound shows multiple cysts on her ovaries.$sca95$,
  $qua95$What is the most likely diagnosis?$qua95$,
  $opa95${"options":["Polycystic ovary syndrome","Hypothyroidism","Cushing's syndrome","Primary ovarian insufficiency"],"distractorRationale":{"Hypothyroidism":"Fails to explain the elevated testosterone levels and ultrasound findings of multiple cysts.","Cushing's syndrome":"Does not account for the specific combination of symptoms and lab findings seen in this case.","Primary ovarian insufficiency":"Incorrect as it typically presents with elevated FSH and amenorrhea, not irregular cycles with cysts."},"clinicalReasoning":"Assessing the patient's symptoms and lab findings leads to the analysis of potential diagnoses. The combination of irregular cycles, hirsutism, obesity, and ultrasound findings of cystic ovaries points towards PCOS as the most likely diagnosis.","keyTakeaways":["When assessing a young woman with irregular cycles, hirsutism, and obesity, think PCOS first."],"kind":"lab_interpretation","taskCategory":"communication","blueprintTopic":"pcos-endocrine","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step1-1782623545922","qcScore":8.4,"slotIndex":1,"stepLevel":"step1","examNumber":8922,"generatedAt":"2026-06-28T05:14:18.988Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$opa95$,
  $kya95$Polycystic ovary syndrome$kya95$,
  $exa95$Irregular cycles, elevated testosterone with hirsutism, and polycystic ovaries meet standard criteria for polycystic ovary syndrome. FSH was not measured. Primary ovarian insufficiency is a high-FSH, low-estrogen state with missed periods, not elevated testosterone and polycystic ovaries. Hypothyroidism does not raise testosterone or produce this ovarian appearance. Cushing syndrome usually adds moon facies, wide violaceous striae, or proximal weakness, which are absent here.$exa95$,
  2,
  $dma95$reproductive-endocrine$dma95$,
  $tpa95$pcos-endocrine$tpa95$,
  $sua95$https://www.nichd.nih.gov/health/topics/poi/conditioninfo/diagnosed$sua95$,
  $sla95$https://www.nichd.nih.gov/health/topics/poi/conditioninfo/diagnosed$sla95$,
  $sqa95$If the ovaries are not working properly, as is the case in POI, the level of FSH in the blood increases.$sqa95$,
  $cha95$043eb5fb994e3b3316760c1ace1845c243dd8c81c9f1b33da9284b26b758a05d$cha95$,
  true,
  $rfa95$[{"label": "https://www.nichd.nih.gov/health/topics/poi/conditioninfo/diagnosed", "url": "https://www.nichd.nih.gov/health/topics/poi/conditioninfo/diagnosed"}]$rfa95$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida96$cmr88v3v600ge1yw2h50v2k0k$ida96$,
  $fxa96$wrong_blueprint|not_single_best|rationale$fxa96$,
  $sca96$A 45-year-old woman presents to the emergency department with 8 hours of severe right-upper-quadrant pain radiating to the scapula, vomiting, and fever. She has diabetes and hypertension. Temperature is 38.6 C, blood pressure is 128/76 mm Hg, and the right upper quadrant is tender with a positive Murphy sign. The leukocyte count is 15,000/mm3 and serum lipase is normal. Ultrasound shows gallstones, gallbladder wall thickness of 5 mm, and pericholecystic fluid.$sca96$,
  $qua96$What is the most likely diagnosis?$qua96$,
  $opa96${"options":["Acute cholecystitis","Pancreatitis (inflammation of the pancreas)","Acute appendicitis","Bowel obstruction"],"distractorRationale":{"Acute cholecystitis":"Correct diagnosis.","Pancreatitis (inflammation of the pancreas)":"While pancreatitis can cause abdominal pain and elevated glucose, the ultrasound findings of gallstones point more towards cholecystitis.","Acute appendicitis":"This typically presents with right lower quadrant pain and is not supported by the ultrasound findings.","Bowel obstruction":"Although it can cause abdominal pain, the presence of gallstones and the patient's symptoms are more indicative of cholecystitis."},"clinicalReasoning":"Assessing the patient's symptoms and lab findings, the elevated white blood cell count and ultrasound findings of gallstones strongly indicate acute cholecystitis. Analyzing the differential diagnoses, pancreatitis and appendicitis do not align with the ultrasound results, while bowel obstruction lacks the specific findings present.","keyTakeaways":["When a patient presents with abdominal pain and gallstones on ultrasound, think acute cholecystitis first."],"kind":"calculation","taskCategory":"communication","blueprintTopic":"acute-cholecystitis","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783282658277","qcScore":8.2,"slotIndex":20,"stepLevel":"step1","examNumber":9106,"generatedAt":"2026-07-05T20:18:54.094Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$opa96$,
  $kya96$Acute cholecystitis$kya96$,
  $exa96$Right-upper-quadrant pain, fever, a Murphy sign, leukocytosis, and ultrasound showing gallstones with wall thickening and pericholecystic fluid are acute calculous cholecystitis. A normal lipase and a sonographic Murphy sign make pancreatitis unlikely; gallstones can cause pancreatitis, but they do not prove it when the lipase is normal. Appendicitis is right-lower-quadrant pain and does not thicken the gallbladder wall. Bowel obstruction is not the ultrasound diagnosis here.$exa96$,
  4,
  $dma96$gastrointestinal$dma96$,
  $tpa96$acute-cholecystitis$tpa96$,
  $sua96$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua96$,
  $sla96$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla96$,
  $sqa96$Findings suggestive of acute calculous cholecystitis include a thickened gallbladder wall >3 mm, edema, pericholecystic fluid, and the presence of gallstones.$sqa96$,
  $cha96$74600460b8f092df470c48f3d96bd98fd6e579127bfc48beeed07a68200e98e0$cha96$,
  true,
  $rfa96$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa96$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida97$cmr8by2lb012j1yw2cmas9iop$ida97$,
  $fxa97$rationale$fxa97$,
  $sca97$A 45-year-old woman presents to the emergency department with progressive muscle weakness and difficulty climbing stairs over the past month. She reports recent weight loss and has a rash on her eyelids. Vital signs are stable, and a physical examination reveals proximal muscle weakness and heliotrope rash. Laboratory tests show elevated creatine kinase levels (CK 800 U/L) and positive anti-Jo-1 antibodies. A muscle biopsy is planned to confirm the diagnosis.$sca97$,
  $qua97$What is the most likely underlying mechanism of this patient's condition?$qua97$,
  $opa97${"kind":"image_based","stepLevel":"step1","blueprintSystem":"musculoskeletal","blueprintTopic":"myopathies","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783287690127","qcScore":8.2,"slotIndex":9,"stepLevel":"step1","examNumber":9113,"generatedAt":"2026-07-05T21:44:25.197Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Autoimmune-mediated destruction of muscle fibers","Dysfunction of the urea cycle leading to ammonia accumulation","Deficiency of dystrophin protein in muscle cells","Infiltration of muscle tissue by malignant cells"],"taskCategory":"health-maintenance"}$opa97$,
  $kya97$Autoimmune-mediated destruction of muscle fibers$kya97$,
  $exa97$A heliotrope eyelid rash with proximal weakness is dermatomyositis. Polymyositis is a proximal myopathy defined by excluding patients who have a dermatomyositis rash. The muscle injury is autoimmune, which is why anti-Jo-1 antibodies and a high creatine kinase fit. A urea-cycle defect causes hyperammonemic neurologic disease, not this rash. Dystrophin deficiency is Duchenne or Becker muscular dystrophy and does not cause a heliotrope rash. Malignant cells do not have to invade the muscle; the weakness is from the inflammatory myopathy.$exa97$,
  4,
  $dma97$msk-skin$dma97$,
  $tpa97$myopathies$tpa97$,
  $sua97$https://pmc.ncbi.nlm.nih.gov/articles/PMC7388349/$sua97$,
  $sla97$https://pmc.ncbi.nlm.nih.gov/articles/PMC7388349/$sla97$,
  $sqa97$PM is best defined as a subacute proximal myopathy that evolves muscle weakness over weeks to months, affects adults but rarely children, and excludes those who have a rash.$sqa97$,
  $cha97$de52303331b85714a0d69af6754dce7ea003d7b308796caa514a53bd9ebb8506$cha97$,
  true,
  $rfa97$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7388349/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7388349/"}]$rfa97$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida98$cmr8ei1tv009s1yazzsq0xtlv$ida98$,
  $fxa98$rationale|rationale$fxa98$,
  $sca98$A 45-year-old woman presents to the emergency department with a 2-week history of worsening depression and increased anxiety. She reports difficulty sleeping and has lost interest in activities she once enjoyed. Her current medications include sertraline, which she has been taking for the past six months. On examination, her blood pressure is 120/80 mm Hg, heart rate is 72 bpm, and she appears anxious. Laboratory tests show a sodium level of 130 mEq/L.$sca98$,
  $qua98$Which drug mechanism best accounts for this adverse effect?$qua98$,
  $opa98${"kind":"sequential","stepLevel":"step1","blueprintSystem":"behavioral-nervous","blueprintTopic":"psychiatric-pharmacology","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783291916188","qcScore":8.1,"slotIndex":13,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-05T22:56:04.817Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Inhibition of serotonin reuptake","Inhibition of norepinephrine reuptake","Antagonism of dopamine receptors","Inhibition of monoamine oxidase"],"taskCategory":"pharmacotherapy"}$opa98$,
  $kya98$Inhibition of serotonin reuptake$kya98$,
  $exa98$Sertraline inhibits serotonin reuptake. SSRIs can cause the syndrome of inappropriate antidiuretic hormone, which impairs water excretion and dilutes the serum sodium. That is water retention, not sodium retention. Inhibition of norepinephrine reuptake is not the action of sertraline; SNRIs can also cause hyponatremia, but that is not this drug. Dopamine-receptor blockade and monoamine oxidase inhibition are different drug classes.$exa98$,
  3,
  $dma98$behavioral-nervous$dma98$,
  $tpa98$psychiatric-pharmacology$tpa98$,
  $sua98$https://www.ncbi.nlm.nih.gov/books/NBK507777/$sua98$,
  $sla98$https://www.ncbi.nlm.nih.gov/books/NBK507777/$sla98$,
  $sqa98$SIADH is characterized by impaired water excretion leading to hyponatremia with hypervolemia or euvolemia.$sqa98$,
  $cha98$1122f7e5b653bed6ad1405dd1a06141e961017e5bc277264d00822dad79b68b6$cha98$,
  true,
  $rfa98$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK507777/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK507777/"}]$rfa98$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida99$cmrpw18ff002r1yh58ego4k83$ida99$,
  $fxa99$cue|wrong_blueprint$fxa99$,
  $sca99$A 58-year-old man presents to the emergency department with severe chest pain radiating to his left arm and shortness of breath. His vital signs reveal a blood pressure of 142/88 mm Hg, heart rate of 110 bpm, and oxygen saturation of 92% on room air. An ECG shows ST-segment elevation in leads II, III, and aVF. He has a history of hypertension and hyperlipidemia but is not currently taking any medications.$sca99$,
  $qua99$What is the most likely diagnosis for this patient?$qua99$,
  $opa99${"options":["Unstable angina","ST-elevation myocardial infarction","Non-ST elevation myocardial infarction","Aortic dissection"],"distractorRationale":{"Unstable angina":"However, unstable angina does not show ST-segment elevation on the ECG, which is a key differentiator. (Understanding the ECG changes is essential for distinguishing between unstable angina and STEMI.)","Non-ST elevation myocardial infarction":"NSTEMI would show ischemic changes but would not present with ST-segment elevation, which this patient clearly has. (Recognizing the type of myocardial infarction based on ECG findings is critical for appropriate management.)","Aortic dissection":"However, aortic dissection typically presents with different pain characteristics and may show other ECG findings, not ST-segment elevation. (Differentiating between types of chest pain presentations is vital for accurate diagnosis.)"},"clinicalReasoning":"The diagnosis is ST-elevation myocardial infarction (STEMI) due to clear ECG evidence of acute coronary occlusion. **ST-segment elevation** in leads II, III, and aVF indicates significant coronary artery blockage. The patient presents with **classic symptoms**: severe chest pain and shortness of breath.","keyTakeaways":["When you see ST-segment elevation on an ECG with chest pain, think STEMI first."],"taskCategory":"interpretation","blueprintTopic":"inferior-stemi","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784349901374","qcScore":7.8,"slotIndex":23,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:47:36.226Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa99$,
  $kya99$ST-elevation myocardial infarction$kya99$,
  $exa99$Why this answer is correct
The diagnosis is ST-elevation myocardial infarction (STEMI) due to clear ECG evidence of acute coronary occlusion.
ST-segment elevation in leads II, III, and aVF indicates significant coronary artery blockage.
The patient presents with classic symptoms: severe chest pain and shortness of breath.
Immediate recognition of STEMI is crucial for timely intervention and management.
In practice: On the unit, this means the patient requires urgent treatment such as reperfusion therapy to restore blood flow and minimize heart damage.
Why the other options are wrong

Unstable angina
Trap: Students may confuse unstable angina with STEMI due to similar symptoms.
Why it fails here: However, unstable angina does not show ST-segment elevation on the ECG, which is a key differentiator.
Remember: Understanding the ECG changes is essential for distinguishing between unstable angina and STEMI.

Non-ST elevation myocardial infarction
Trap: Some may think NSTEMI is a possibility because the patient has chest pain.
Why it fails here: NSTEMI would show ischemic changes but would not present with ST-segment elevation, which this patient clearly has.
Remember: Recognizing the type of myocardial infarction based on ECG findings is critical for appropriate management.

Aortic dissection
Trap: Students might consider aortic dissection due to the severe chest pain.
Why it fails here: However, aortic dissection typically presents with different pain characteristics and may show other ECG findings, not ST-segment elevation.
Remember: Differentiating between types of chest pain presentations is vital for accurate diagnosis.
Key takeaway
When you see ST-segment elevation on an ECG with chest pain, think STEMI first.

Memory hook: Remember: STEMI = Severe Threat to Energy of the Myocardium Immediately.$exa99$,
  3,
  $dma99$cardiovascular$dma99$,
  $tpa99$inferior-stemi$tpa99$,
  $sua99$https://www.ncbi.nlm.nih.gov/books/NBK470572/$sua99$,
  $sla99$https://www.ncbi.nlm.nih.gov/books/NBK470572/$sla99$,
  $sqa99$The most common ECG finding associated with an inferior wall myocardial infarction is ST-segment elevation in leads II, III, and aVF, accompanied by reciprocal ST-segment depression in leads I and aVL.$sqa99$,
  $cha99$396e653ded5194b9ae328ee420a42881faa9cb725df883d86518359717522a29$cha99$,
  true,
  $rfa99$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470572/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470572/"}]$rfa99$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida100$cmrrtqznf007d1y8wu5q7lcf2$ida100$,
  $fxa100$wrong_blueprint$fxa100$,
  $sca100$A 58-year-old man presents to the emergency department with a 2-day history of worsening shortness of breath and fatigue. He has a history of hypertension and type 2 diabetes mellitus. On examination, his blood pressure is 142/88 mm Hg, heart rate is 92 bpm, and he has bilateral crackles on lung auscultation. A chest X-ray shows cardiomegaly and pulmonary congestion. Laboratory tests reveal a serum BNP level of 550 pg/mL.$sca100$,
  $qua100$What is the most likely underlying mechanism contributing to this patient's condition?$qua100$,
  $opa100${"options":["Increased preload due to fluid overload","Decreased cardiac output from myocardial ischemia","Increased afterload from systemic hypertension","Decreased compliance of the left ventricle"],"distractorRationale":{"Decreased cardiac output from myocardial ischemia":"This option is incorrect because there is no evidence of ischemic heart disease in the vignette.","Increased afterload from systemic hypertension":"While hypertension can contribute to heart failure, it is not the primary mechanism in this case of acute pulmonary congestion.","Decreased compliance of the left ventricle":"This option is incorrect as it suggests a chronic condition rather than the acute fluid overload indicated in the vignette."},"clinicalReasoning":"Assess the patient's symptoms and lab findings, analyze the role of fluid overload in heart failure, and integrate the clinical presentation with the underlying pathophysiology to arrive at the correct answer.","keyTakeaways":["When assessing heart failure, prioritize understanding **increased preload** due to fluid overload as a key mechanism."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"heart-failure","blueprintSystem":"cardiovascular","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784467068497","qcScore":8.1,"slotIndex":32,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-19T13:20:20.523Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$opa100$,
  $kya100$Increased preload due to fluid overload$kya100$,
  $exa100$Why this answer is correct
The underlying mechanism is increased preload due to fluid overload, a hallmark of heart failure.
Increased preload occurs when the heart is overloaded with fluid, leading to heart failure.
The elevated BNP (B-type natriuretic peptide) level indicates heart strain and fluid retention.
Pulmonary congestion and crackles suggest fluid accumulation in the lungs, consistent with heart failure.
In practice: On the unit, recognizing fluid overload helps guide diuretics and other treatments to relieve symptoms and improve patient outcomes.
Why the other options are wrong

Decreased cardiac output from myocardial ischemia
Trap: Students may think ischemia is always the primary cause of heart failure.
Why it fails here: This patient shows no signs of ischemia, such as chest pain or EKG changes, making this option irrelevant.
Remember: Understanding that heart failure can arise from fluid overload rather than ischemic events is crucial.

Increased afterload from systemic hypertension
Trap: Some may assume that hypertension is the main contributor to heart failure.
Why it fails here: While hypertension can lead to heart failure over time, the acute presentation here suggests fluid overload is the immediate issue.
Remember: Recognizing the difference between chronic and acute mechanisms in heart failure is essential for diagnosis.

Decreased compliance of the left ventricle
Trap: Students might confuse decreased compliance with all heart failure cases.
Why it fails here: This option refers to diastolic heart failure, which is not the primary issue in this acute fluid overload scenario.
Remember: Differentiating between types of heart failure helps clarify the underlying mechanisms at play.
Key takeaway
When assessing heart failure, prioritize understanding increased preload due to fluid overload as a key mechanism.

Memory hook: Think of fluid overload as a bathtub overflowing — the heart can't handle the excess water.$exa100$,
  2,
  $dma100$cardiovascular$dma100$,
  $tpa100$heart-failure$tpa100$,
  $sua100$https://www.ncbi.nlm.nih.gov/books/NBK557611/$sua100$,
  $sla100$https://www.ncbi.nlm.nih.gov/books/NBK557611/$sla100$,
  $sqa100$Cardiogenic or volume-overload pulmonary edema arises due to a rapid elevation in the hydrostatic pressure of the pulmonary capillaries.$sqa100$,
  $cha100$d699cf6ad55718cf51498029089253ec052118b2f83e6b23c1639e44cdbe7d16$cha100$,
  true,
  $rfa100$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK557611/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557611/"}]$rfa100$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida101$cmr4dbe5m00ye1yky3podjd1n$ida101$,
  $fxa101$wrong_blueprint$fxa101$,
  $sca101$A 50-year-old woman presents to the clinic with fatigue and weight gain. She reports feeling cold and has noticed her hair thinning. On examination, her heart rate is 58 bpm, and her blood pressure is 110/70 mm Hg. Laboratory tests reveal an elevated TSH level and low free T4.$sca101$,
  $qua101$What is the most likely diagnosis?$qua101$,
  $opa101${"options":["Graves' disease","Hashimoto's thyroiditis","Thyroid storm","Subclinical hyperthyroidism"],"distractorRationale":{"Graves' disease":"This condition is characterized by hyperthyroidism, presenting with low TSH and high T4.","Thyroid storm":"This is an acute hyperthyroid state, not consistent with the patient's symptoms and lab results.","Subclinical hyperthyroidism":"This would show normal T4 levels, which does not match the patient's findings."},"clinicalReasoning":"The patient's elevated TSH and low T4, along with her clinical symptoms, indicate primary hypothyroidism due to Hashimoto's thyroiditis, making it the most likely diagnosis.","keyTakeaways":["When you see elevated TSH and low free T4, think Hashimoto's thyroiditis first."],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"hashimoto-thyroiditis","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783048617090","qcScore":8.2,"slotIndex":34,"stepLevel":"step3","examNumber":9311,"generatedAt":"2026-07-03T03:17:54.280Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"diagnosis"}$opa101$,
  $kya101$Hashimoto's thyroiditis$kya101$,
  $exa101$Why this answer is correct
The most likely diagnosis is Hashimoto's thyroiditis due to elevated TSH and low free T4 levels.
Elevated TSH indicates primary hypothyroidism.
Low free T4 confirms inadequate thyroid hormone production.
Symptoms like fatigue, weight gain, and cold intolerance align with hypothyroidism.
In practice: In practice, recognizing Hashimoto's thyroiditis early can prevent complications associated with untreated hypothyroidism, such as cardiovascular issues and severe fatigue.
Why the other options are wrong

Graves' disease
Trap: Students may confuse Graves' disease with hypothyroidism due to overlapping symptoms.
Why it fails here: Graves' disease presents with low TSH and elevated T4 levels, indicating hyperthyroidism, which is not consistent with this patient's lab results.
Remember: Understanding the lab values is crucial in differentiating between hyperthyroid and hypothyroid conditions.

Thyroid storm
Trap: Some may think thyroid storm could occur in any thyroid dysfunction.
Why it fails here: Thyroid storm is an acute, life-threatening condition characterized by severe hyperthyroid symptoms, which this patient does not exhibit.
Remember: Recognizing the acute nature of thyroid storm helps in identifying true emergencies versus chronic conditions.

Subclinical hyperthyroidism
Trap: Students might misinterpret the lab findings as indicating subclinical hyperthyroidism due to the elevated TSH.
Why it fails here: Subclinical hyperthyroidism would show normal T4 levels, which contradicts this patient's low free T4 result.
Remember: Differentiating between subclinical and overt thyroid dysfunction is essential for accurate diagnosis.
Key takeaway
When you see elevated TSH and low free T4, think Hashimoto's thyroiditis first.

Memory hook: Remember: High TSH, Low T4 = Hashimoto's.$exa101$,
  3,
  $dma101$reproductive-endocrine$dma101$,
  $tpa101$hashimoto-thyroiditis$tpa101$,
  $sua101$https://www.ncbi.nlm.nih.gov/books/NBK459262/$sua101$,
  $sla101$https://www.ncbi.nlm.nih.gov/books/NBK459262/$sla101$,
  $sqa101$It is the most common cause of hypothyroidism in developed countries.$sqa101$,
  $cha101$c944022f65d4b74f4afa36195ec0969d5269e126797bc86b1b3d3ec7731004f4$cha101$,
  true,
  $rfa101$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459262/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459262/"}]$rfa101$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida102$cmr8atyu2001l1ylo539g4hef$ida102$,
  $fxa102$not_single_best|rationale|difficulty|wrong_blueprint$fxa102$,
  $sca102$A 35-year-old woman presents to the clinic with fatigue and weight gain over the past few months. She reports feeling cold all the time and has dry skin. On examination, her heart rate is 60 bpm, and she has a goiter. Laboratory tests reveal a TSH level of 12 mIU/L and a free T4 of 0.4 ng/dL.$sca102$,
  $qua102$What is the most likely diagnosis?$qua102$,
  $opa102${"options":["Hypothyroidism","Hyperthyroidism","Central hypothyroidism","Thyroid cancer"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"surgery","blueprintTopic":"hypothyroidism","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783286257734","examNumber":9301,"slotIndex":58,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T21:18:53.035Z"}}$opa102$,
  $kya102$Hypothyroidism$kya102$,
  $exa102$A TSH of 12 mIU/L with a free T4 of 0.4 ng/dL is overt primary hypothyroidism. Hyperthyroidism suppresses TSH and raises free T4. Central hypothyroidism does not raise TSH. Thyroid cancer is not diagnosed from these labs when no nodule is described.$exa102$,
  2,
  $dma102$reproductive-endocrine$dma102$,
  $tpa102$hypothyroidism$tpa102$,
  $sua102$https://www.ncbi.nlm.nih.gov/books/NBK459262/$sua102$,
  $sla102$https://www.ncbi.nlm.nih.gov/books/NBK459262/$sla102$,
  $sqa102$This disease is also known as chronic autoimmune thyroiditis and chronic lymphocytic thyroiditis.$sqa102$,
  $cha102$3255234b57f18f3ccac06287af3c4efa8e1859fc06001f1cc29c3001ed99553f$cha102$,
  true,
  $rfa102$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459262/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459262/"}]$rfa102$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida103$cmr8d1zvi00rp1ylo3owbpgua$ida103$,
  $fxa103$wrong_blueprint$fxa103$,
  $sca103$A 5-year-old girl presents to the pediatric clinic with a 2-week history of worsening cough and wheezing. She has a known history of asthma and has been using her albuterol inhaler multiple times daily without relief. On examination, her peak expiratory flow rate (PEFR) is measured at 65% of her personal best, and she appears to be in mild respiratory distress. Her mother is concerned about the effectiveness of her current asthma management plan.$sca103$,
  $qua103$What is the most appropriate next step in the management of this patient's asthma?$qua103$,
  $opa103${"options":["Increase the dose of albuterol.","Add a daily inhaled corticosteroid.","Prescribe oral corticosteroids.","Refer to a pulmonologist.","Obtain a chest X-ray."],"blueprintTopic":"asthma-exacerbation","blueprintSystem":"respiratory-renal"}$opa103$,
  $kya103$Prescribe oral corticosteroids.$kya103$,
  $exa103$3 is correct: an exacerbation with PEF 65% of best and respiratory distress despite frequent albuterol needs a short course of oral corticosteroids (then a daily controller), per GINA. 1 (more albuterol) is wrong because it is already failing. 2 (daily ICS) is wrong because it is needed but too slow to treat the exacerbation. 4 (pulmonology referral) is wrong because it is not the immediate step. 5 (chest X-ray) is wrong because it is not routinely needed.$exa103$,
  4,
  $dma103$respiratory-renal$dma103$,
  $tpa103$asthma-exacerbation$tpa103$,
  $sua103$https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf$sua103$,
  $sla103$https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf$sla103$,
  $sqa103$Start oral corticosteroids (except for mild exacerbations): Adults: prednisolone 40–50 mg each morning for 5–7 days.$sqa103$,
  $cha103$0c887731ddbd2a99f19230e41241e4cba5757608e8dcfbacb1ed1e19c759ee2b$cha103$,
  true,
  $rfa103$[{"label": "https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf", "url": "https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf"}]$rfa103$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida104$cmr8g7a9u01qj1ylogojtt94g$ida104$,
  $fxa104$wrong_blueprint$fxa104$,
  $sca104$A 62-year-old woman presents to the emergency department with worsening shortness of breath and a productive cough over the past week. She has a history of COPD and is currently on a long-acting beta-agonist and a corticosteroid inhaler. On examination, her respiratory rate is 24 breaths per minute, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no signs of pneumonia.$sca104$,
  $qua104$What is the most likely diagnosis?$qua104$,
  $opa104${"options":["Acute exacerbation of chronic obstructive pulmonary disease","Pneumonia","Congestive heart failure (a heart that cannot pump enough blood)","Pulmonary embolism"],"distractorRationale":{"Pneumonia":"This option fails because the patient does not exhibit fever or signs of consolidation on imaging, which are typically present in pneumonia.","Congestive heart failure (a heart that cannot pump enough blood)":"This distractor is misleading as it could cause dyspnea, but the patient lacks signs such as peripheral edema and elevated blood pressure.","Pulmonary embolism":"While PE can cause acute dyspnea, the absence of sudden onset symptoms and risk factors makes this diagnosis less likely."},"clinicalReasoning":"Assess the patient's history of COPD and current symptoms. Analyze the physical exam findings and imaging results to rule out pneumonia and heart failure. Integrate this information to conclude that an acute exacerbation of COPD is the most fitting diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"copd-exacerbation","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783295305274","examNumber":9320,"slotIndex":16,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T23:50:40.441Z"}}$opa104$,
  $kya104$Acute exacerbation of chronic obstructive pulmonary disease$kya104$,
  $exa104$The correct answer is an acute exacerbation of COPD, which is characterized by increased dyspnea, cough, and sputum production, often triggered by infections or environmental factors. Given the patient's history of COPD, wheezing, and hypoxia, this diagnosis fits well. Pneumonia is less likely due to the absence of fever and consolidation on chest X-ray. Congestive heart failure (a heart that cannot pump enough blood) could cause similar symptoms but would likely present with additional signs such as edema or elevated jugular venous pressure. Pulmonary embolism is also a consideration but would typically present with sudden onset dyspnea and possibly pleuritic chest pain, which is not described here. Thus, the clinical context strongly supports an acute exacerbation of COPD.

Clinical reasoning: Assess the patient's history of COPD and current symptoms. Analyze the physical exam findings and imaging results to rule out pneumonia and heart failure. Integrate this information to conclude that an acute exacerbation of COPD is the most fitting diagnosis.

Why other options are incorrect:
• Pneumonia: This option fails because the patient does not exhibit fever or signs of consolidation on imaging, which are typically present in pneumonia.
• Congestive heart failure (a heart that cannot pump enough blood): This distractor is misleading as it could cause dyspnea, but the patient lacks signs such as peripheral edema and elevated blood pressure.
• Pulmonary embolism: While PE can cause acute dyspnea, the absence of sudden onset symptoms and risk factors makes this diagnosis less likely.$exa104$,
  2,
  $dma104$respiratory-renal$dma104$,
  $tpa104$copd-exacerbation$tpa104$,
  $sua104$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua104$,
  $sla104$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla104$,
  $sqa104$An exacerbation of COPD is an acute event with symptoms worsening over a few days (up to 14 days) and characterized by increased dyspnea and/or cough and sputum that may be accompanied by tachypnea and/or tachycardia.$sqa104$,
  $cha104$9fe6b24b393485f46d6b83f67adda64b11f1234c2545fba85c6d47eb9c222a78$cha104$,
  true,
  $rfa104$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa104$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida105$cmr8j9seo02ko1ylocdw6yw9k$ida105$,
  $fxa105$wrong_blueprint$fxa105$,
  $sca105$A 50-year-old woman presents to the emergency department with severe headache, visual disturbances, and elevated blood pressure of 180/110 mm Hg. She is 32 weeks pregnant and has a history of gestational hypertension. On examination, she has proteinuria and edema. Laboratory tests show elevated liver enzymes and low platelets.$sca105$,
  $qua105$What is the most likely diagnosis?$qua105$,
  $opa105${"options":["Preeclampsia","Gestational hypertension","Eclampsia","Chronic hypertension"],"distractorRationale":{"Gestational hypertension":"Incorrect as it does not involve proteinuria or end-organ dysfunction, which are present in this case.","Eclampsia":"Incorrect because eclampsia is characterized by seizures, which the patient does not exhibit.","Chronic hypertension":"Incorrect as chronic hypertension does not present with the acute symptoms and complications seen here."},"clinicalReasoning":"Assess the patient's clinical presentation, including vital signs and laboratory findings, to recognize the signs of preeclampsia. Analyze the symptoms and differentiate them from other hypertensive disorders in pregnancy, integrating this information to conclude that preeclampsia is the most likely diagnosis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"preeclampsia","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783300410935","examNumber":9329,"slotIndex":45,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T01:14:37.026Z"}}$opa105$,
  $kya105$Preeclampsia$kya105$,
  $exa105$The patient's symptoms of severe headache, visual disturbances, elevated blood pressure, proteinuria, and signs of liver dysfunction indicate preeclampsia, a pregnancy-related hypertensive disorder. Gestational hypertension does not involve proteinuria or end-organ dysfunction. Eclampsia would involve seizures, and chronic hypertension would not typically present with the acute symptoms seen in this case.

Clinical reasoning: Assess the patient's clinical presentation, including vital signs and laboratory findings, to recognize the signs of preeclampsia. Analyze the symptoms and differentiate them from other hypertensive disorders in pregnancy, integrating this information to conclude that preeclampsia is the most likely diagnosis.

Why other options are incorrect:
• Gestational hypertension: Incorrect as it does not involve proteinuria or end-organ dysfunction, which are present in this case.
• Eclampsia: Incorrect because eclampsia is characterized by seizures, which the patient does not exhibit.
• Chronic hypertension: Incorrect as chronic hypertension does not present with the acute symptoms and complications seen here.$exa105$,
  4,
  $dma105$reproductive-endocrine$dma105$,
  $tpa105$preeclampsia$tpa105$,
  $sua105$https://preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf$sua105$,
  $sla105$https://preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf$sla105$,
  $sqa105$Eclampsia is defined by new-onset tonic-clonic, focal, or multifocal seizures in the absence of other causative conditions such as epilepsy, cerebral arterial ischemia and infarction, intracranial hemorrhage, or drug use.$sqa105$,
  $cha105$27d1ecbf7166873b4893c9ece70344e30f9cb8e21b204606391073a45734b4d0$cha105$,
  true,
  $rfa105$[{"label": "https://preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf", "url": "https://preeclampsia.org/frontend/assets/img/advocacy_resource/Gestational_Hypertension_and_Preeclampsia_ACOG_Practice_Bulletin,_Number_222_1605448006.pdf"}]$rfa105$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida106$cmr8m9ap900jt1ygig7s2hrf9$ida106$,
  $fxa106$wrong_blueprint$fxa106$,
  NULL,
  $qua106$A 62-year-old woman has a fever on postoperative day 2 after a laparoscopic cholecystectomy. She has mild incisional soreness but no worsening abdominal pain, nausea, chills, cough, or urinary symptoms. Temperature is 38.6°C (101.5°F), pulse is 88/min, blood pressure is 120/75 mm Hg, respiratory rate is 16/min, and oxygen saturation is 97% on room air. The lungs are clear. The abdomen is soft with mild tenderness only at the port sites, and the incisions are clean. The calves are nontender. Leukocyte count is 12,000/mm³, and liver tests and urinalysis are normal. What is the most likely cause of the fever?$qua106$,
  $opa106${"options":["Wound infection","Pulmonary embolism (a clot in a pulmonary artery)","Normal postoperative inflammatory response","Urinary tract infection"],"blueprintTopic":"postoperative-fever","blueprintSystem":"multisystem"}$opa106$,
  $kya106$Normal postoperative inflammatory response$kya106$,
  $exa106$Correct answer: C. Normal postoperative inflammatory response. A fever on postoperative day 2 with normal heart rate, oxygen saturation, and liver tests, a soft abdomen, clean incisions, and normal urinalysis is most often the inflammatory response to surgery. Why the other options are wrong: A. Wound infections usually appear after postoperative day 5, and the incision is clean. B. Heart rate is 88/min and oxygen saturation is 97% on room air with clear lungs; nothing suggests PE. D. Urinalysis is normal.$exa106$,
  2,
  $dma106$multisystem$dma106$,
  $tpa106$postoperative-fever$tpa106$,
  $sua106$https://www.ncbi.nlm.nih.gov/books/NBK482299/$sua106$,
  $sla106$https://www.ncbi.nlm.nih.gov/books/NBK482299/$sla106$,
  $sqa106$Most early fevers are related to the physiologic inflammatory response to surgical trauma, hematoma formation, or blood transfusion reactions, and often resolve spontaneously without intervention.$sqa106$,
  $cha106$54deb089a1aebebf30055d70eb9cf082987b609702463809da444067ae9f5fdb$cha106$,
  true,
  $rfa106$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK482299/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482299/"}]$rfa106$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida107$cmr99iixe00ug1ywyksv9dd52$ida107$,
  $fxa107$wrong_blueprint$fxa107$,
  $sca107$A 28-year-old woman presents to the emergency department with a severe allergic reaction after eating peanuts. She reports difficulty breathing, swelling of the lips and tongue, and a rash. Her vital signs show a blood pressure of 80/50 mm Hg and a heart rate of 120 bpm.$sca107$,
  $qua107$What is the most appropriate initial management?$qua107$,
  $opa107${"kind":"biostats","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"anaphylaxis","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783344355339","examNumber":9310,"slotIndex":24,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T13:30:42.090Z"},"options":["Administer epinephrine","Give antihistamines","Start intravenous fluids","Intubate the patient"]}$opa107$,
  $kya107$Administer epinephrine$kya107$,
  $exa107$In cases of anaphylaxis, the first-line treatment is epinephrine, which is critical for reversing the symptoms of anaphylaxis, including hypotension and airway swelling. While intravenous fluids may be necessary, they should not be the first step. Antihistamines are not sufficient alone for anaphylaxis, and intubation is not indicated unless there is severe airway compromise that cannot be managed otherwise. (USMLE Content Outline 2026, Emergency Medicine)

Clinical reasoning: Assess the patient's symptoms and vital signs, analyze the severity of the allergic reaction, and integrate this information to conclude that administering epinephrine is the most appropriate initial management.

Why other options are incorrect:
• Give antihistamines: This option is incorrect as antihistamines are not sufficient for treating anaphylaxis and should not be the first-line treatment.
• Start intravenous fluids: While fluids may be necessary, they are not the first step in managing anaphylaxis.
• Intubate the patient: Intubation is not indicated unless there is severe airway compromise that cannot be managed with epinephrine.$exa107$,
  4,
  $dma107$multisystem$dma107$,
  $tpa107$anaphylaxis$tpa107$,
  $sua107$https://www.ncbi.nlm.nih.gov/books/NBK482124/$sua107$,
  $sla107$https://www.ncbi.nlm.nih.gov/books/NBK482124/$sla107$,
  $sqa107$Repeat studies have shown that providers often wait too long before giving epinephrine; it is the treatment of choice, and the rapid benefit much outweighs the risks of withholding treatment.$sqa107$,
  $cha107$c96d25cd7411cce9ca4569b2ec4133b62b1e3eeba11a90690f0cce066682ebeb$cha107$,
  true,
  $rfa107$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK482124/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482124/"}]$rfa107$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida108$cmru7tlqc000z1yd6pk57jvxp$ida108$,
  $fxa108$template_artifact|wrong_blueprint$fxa108$,
  $sca108$A 50-year-old woman presents to the emergency department with a 3-day history of fever, chills, and cough. She is a smoker and has a history of chronic bronchitis. On examination, her temperature is 102 F, respiratory rate is 22 breaths/min, and oxygen saturation is 90% on room air. A chest X-ray shows a right lower lobe infiltrate.$sca108$,
  $qua108$What is the most likely causative organism?$qua108$,
  $opa108${"kind":"biostats","stepLevel":"step3","blueprintSystem":"respiratory-renal","blueprintTopic":"community-acquired-pneumonia","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784611601719","examNumber":9301,"slotIndex":35,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T05:27:27.029Z"},"options":["Streptococcus pneumoniae","Haemophilus influenzae","Mycoplasma pneumoniae","Chlamydia pneumoniae"]}$opa108$,
  $kya108$Streptococcus pneumoniae$kya108$,
  $exa108$The most likely causative organism for this patient's pneumonia is Streptococcus pneumoniae, which is the most common cause of community-acquired pneumonia, especially in smokers and individuals with chronic lung disease. The presence of fever, chills, cough, and the right lower lobe infiltrate on chest X-ray supports this diagnosis. Haemophilus influenzae can also cause pneumonia in patients with chronic bronchitis but is less common than S. pneumoniae. Mycoplasma pneumoniae typically presents with a more gradual onset and is often associated with atypical pneumonia. Chlamydia pneumoniae is also less common and presents similarly to Mycoplasma.

Clinical reasoning: Assess the patient's symptoms and risk factors, analyze the chest X-ray findings, and integrate this information to conclude that Streptococcus pneumoniae is the most likely causative organism.

Why other options are incorrect:
• Haemophilus influenzae: While it can cause pneumonia in patients with chronic bronchitis, it is less common than S. pneumoniae.
• Mycoplasma pneumoniae: This organism typically presents with a more gradual onset and atypical pneumonia symptoms.
• Chlamydia pneumoniae: This organism is less common and presents similarly to Mycoplasma pneumoniae.$exa108$,
  2,
  $dma108$respiratory-renal$dma108$,
  $tpa108$community-acquired-pneumonia$tpa108$,
  $sua108$https://www.ncbi.nlm.nih.gov/books/NBK470537/$sua108$,
  $sla108$https://www.ncbi.nlm.nih.gov/books/NBK470537/$sla108$,
  $sqa108$Streptococcus pneumoniae is the bacterium that has historically been the most common pathogen to cause CAP worldwide.$sqa108$,
  $cha108$fe3ccbaee0f3901f2587f8bf0de858d91813b8e02c219358cec06856018e29ee$cha108$,
  true,
  $rfa108$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470537/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470537/"}]$rfa108$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida109$cmru9iqf7009u1y0sx5hdgw71$ida109$,
  $fxa109$cue|rationale|wrong_blueprint$fxa109$,
  $sca109$A 72-year-old woman is brought to the emergency department after experiencing sudden onset weakness on her right side and difficulty speaking. Her blood pressure is 180/100 mm Hg, and her heart rate is 80 bpm. A CT scan of the head shows no acute hemorrhage.$sca109$,
  $qua109$What is the most likely diagnosis?$qua109$,
  $opa109${"kind":"biostats","stepLevel":"step3","blueprintSystem":"behavioral-nervous","blueprintTopic":"ischemic-stroke","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784614445080","examNumber":9304,"slotIndex":2,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T06:14:56.488Z"},"options":["Transient ischemic attack","Ischemic stroke","Intracerebral hemorrhage","Subarachnoid hemorrhage"]}$opa109$,
  $kya109$Ischemic stroke$kya109$,
  $exa109$Sudden unilateral weakness and speech difficulty that are still present, with no hemorrhage on CT, are an ischemic stroke. A transient ischemic attack is a transient episode, typically lasting minutes and often resolved by the time of evaluation; this patient's deficits are present in the emergency department. Intracerebral and subarachnoid hemorrhage would show blood on CT. The stem does not establish that 24 hours have passed.$exa109$,
  4,
  $dma109$behavioral-nervous$dma109$,
  $tpa109$ischemic-stroke$tpa109$,
  $sua109$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sua109$,
  $sla109$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sla109$,
  $sqa109$A plain CT scan of the head is recommended within 20 minutes of patient presentation to exclude hemorrhage.$sqa109$,
  $cha109$9d4a059a6429691dcd657fffd7a1466842ec9bdd4294c9ad0cb9b9cd5db2f3fe$cha109$,
  true,
  $rfa109$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499997/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$rfa109$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida110$cmrvwt03d00351ye8e96qjq7j$ida110$,
  $fxa110$wrong_blueprint$fxa110$,
  $sca110$A 65-year-old male with a history of chronic obstructive pulmonary disease (COPD) is admitted to the medical unit due to worsening dyspnea and purulent sputum production. His vital signs show a blood pressure of 130/85 mmHg, heart rate of 92 bpm, respiratory rate of 26 breaths per minute, temperature of 99.1°F, and oxygen saturation of 88% on room air. Despite being placed on supplemental oxygen, he continues to experience significant shortness of breath.$sca110$,
  $qua110$What is the next best step in management for this patient?$qua110$,
  $opa110${"options":["Increase oxygen flow rate","Start intravenous antibiotics (give antibiotics through a vein)","Administer nebulized albuterol","Order chest X-ray"],"blueprintTopic":"copd-exacerbation"}$opa110$,
  $kya110$Administer nebulized albuterol$kya110$,
  $exa110$In this patient with an exacerbation of COPD, the immediate management should focus on relieving bronchospasm. Administering nebulized albuterol, a bronchodilator, is crucial for improving airflow and alleviating dyspnea. While increasing oxygen flow may help with hypoxemia, it does not address the underlying bronchospasm. Intravenous antibiotics may be necessary if there is evidence of infection, but they are not the first step in acute management. A chest X-ray can be useful to rule out other complications but is not the immediate priority in this scenario.

Clinical reasoning: The patient's presentation suggests an acute exacerbation of COPD, characterized by increased dyspnea and purulent sputum. The priority in managing such exacerbations is to provide bronchodilator therapy to relieve airway obstruction and improve respiratory function.

Why other options are incorrect:
• Increase oxygen flow rate: While this may help with hypoxemia, it does not directly relieve bronchospasm, which is the primary issue in this exacerbation.
• Start intravenous antibiotics (give antibiotics through a vein): Antibiotics may be indicated if there is a confirmed infection, but the immediate management should focus on bronchodilation to alleviate acute symptoms.
• Order chest X-ray: A chest X-ray can help identify complications such as pneumonia or pneumothorax, but it is not the immediate step needed to address the patient's acute respiratory distress.$exa110$,
  5,
  $dma110$respiratory-renal$dma110$,
  $tpa110$copd-exacerbation$tpa110$,
  $sua110$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua110$,
  $sla110$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla110$,
  $sqa110$SABAs, with or without short-acting anticholinergics, are recommended as the initial bronchodilators to treat moderate/severe exacerbations.$sqa110$,
  $cha110$0e3d0f25bf6179fcad63a9ea33ae6ed66fded3b9d14ef0ef241fa9c13f4eadac$cha110$,
  true,
  $rfa110$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa110$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida111$cmrwa34ug002h1ynhgu1p9os2$ida111$,
  $fxa111$rationale|wrong_blueprint$fxa111$,
  $sca111$A 30-year-old G2P1 at 39 weeks gestation presents in labor with contractions. Membranes ruptured spontaneously 20 hours ago. Blood pressure is 120/70 mm Hg, heart rate is 90/min, respiratory rate is 18/min, and temperature is 102.2 F (39.0 C). The fetal heart rate is 170/min with moderate variability, and the amniotic fluid is meconium stained.$sca111$,
  $qua111$Which of the following is the most appropriate next step?$qua111$,
  $opa111${"stepLevel":"step3","kind":"ccs_prompt","caseData":{"setting":"labor and delivery","presentation":"A 30-year-old G2P1 at 39 weeks gestation presents with contractions and spontaneous rupture of membranes 12 hours ago.","vitals":"BP: 120/70 mmHg, HR: 90/min, RR: 18/min, Temp: 101.2°F.","timeline":"12 hours"},"structureIds":["heart","spleen"],"options":["Administer oxytocin","Administer antibiotics","Immediate cesarean section","Augment with amniotomy"],"blueprintTopic":"chorioamnionitis","blueprintSystem":"reproductive-endocrine"}$opa111$,
  $kya111$Administer antibiotics$kya111$,
  $exa111$A maternal temperature of 39.0 C is suspected intraamniotic infection, and the fetal heart rate of 170/min is tachycardia. Intrapartum antibiotics are recommended. Moderate variability means immediate cesarean delivery is not required for the fetal heart rate. The membranes are already ruptured, so amniotomy is not possible. Oxytocin does not treat the infection.$exa111$,
  5,
  $dma111$reproductive-endocrine$dma111$,
  $tpa111$chorioamnionitis$tpa111$,
  $sua111$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/intra-amniotic-infection$sua111$,
  $sla111$https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/intra-amniotic-infection$sla111$,
  $sqa111$Symptoms include fever, uterine tenderness, foul-smelling amniotic fluid, and purulent cervical discharge.$sqa111$,
  $cha111$f833c1515700a1e98b91ba988ce2d3ae339cf3b2e20442b39e528954622f98a2$cha111$,
  true,
  $rfa111$[{"label": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/intra-amniotic-infection", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/intra-amniotic-infection"}]$rfa111$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida112$b10x7581aef4c23ea8842efd9703$ida112$,
  $fxa112$template_artifact|wrong_blueprint$fxa112$,
  $sca112$A 20-year-old patient ate peanut and developed hives and a pressure of 80/40 mm Hg. Epinephrine restored the pressure. A classmate discharges him after 20 minutes because he looks well. He still feels nauseated and the meal was an hour ago. No one is watching him at home for the evening.$sca112$,
  $qua112$Why is 20 minutes the wrong observation?$qua112$,
  $opa112${"options":["Antigen is still being absorbed, so a second drop can come after the first recovery","A restored blood pressure means a food allergen cannot cause a second wave of shock","Nausea an hour after the meal means the allergen is gone and the reaction has ended","Looking well at twenty minutes means home observation is unnecessary and he is safe","Epinephrine prevents any later wave of shock once the blood pressure has returned"],"blueprintTopic":"biphasic-anaphylaxis"}$opa112$,
  $kya112$Antigen is still being absorbed, so a second drop can come after the first recovery$kya112$,
  $exa112$Twenty minutes is the wrong observation, because food is still in the stomach and a second wave can come after he looks well. Antigen is still being absorbed, so a second drop can come after the first recovery. A restored pressure means a food allergen cannot cause a later wave can. Nausea an hour after the meal means the reaction is over means antigen remains. Looking well at 20 minutes means home observation is unnecessary is too short and he is alone. Epinephrine prevents any later wave once the pressure has returned wears off.$exa112$,
  4,
  $dma112$multisystem$dma112$,
  $tpa112$biphasic-anaphylaxis$tpa112$,
  $sua112$https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis$sua112$,
  $sla112$https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis$sla112$,
  $sqa112$A biphasic reaction is recurrence of a reaction without known re-exposure to the offending trigger.$sqa112$,
  $cha112$5d73e2629e35c091999c0245449c76c613901f7c257e7829e10e3f2fdeb31bf3$cha112$,
  true,
  $rfa112$[{"label": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$rfa112$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida113$b4x5a004954d996cd6a39bd6af8$ida113$,
  $fxa113$template_artifact|wrong_blueprint$fxa113$,
  $sca113$A 50-year-old woman has atrial flutter and a blood pressure of 130/80 mm Hg. The QT is prolonged. Potassium is 3.0 mEq/L. She is awake. A colleague prepares ibutilide. Magnesium has not been given.$sca113$,
  $qua113$Why is ibutilide the wrong rhythm drug?$qua113$,
  $opa113${"options":["The QT interval shortens after ibutilide rather than lengthening further","Giving magnesium would make ibutilide more dangerous in this setting","It lengthens repolarization when the QT and the potassium are already unsafe","A low potassium level protects this patient against torsades de pointes","Flutter with a normal blood pressure specifically requires ibutilide now"],"blueprintTopic":"atrial-flutter"}$opa113$,
  $kya113$It lengthens repolarization when the QT and the potassium are already unsafe$kya113$,
  $exa113$Ibutilide prolongs repolarization, so it is the wrong rhythm drug when the QT is already long and the potassium is low. It lengthens repolarization when the QT and the potassium are already unsafe. A low potassium protects against torsades is the opposite. Flutter with a normal blood pressure requires this drug specifically is not true of this ECG. The QT shortens after ibutilide is the wrong direction. Magnesium would make ibutilide more dangerous reverses magnesium's protective role.$exa113$,
  4,
  $dma113$cardiovascular$dma113$,
  $tpa113$atrial-flutter$tpa113$,
  $sua113$https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b7d717ed-022d-4459-b5e6-098c2a8b7427$sua113$,
  $sla113$https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b7d717ed-022d-4459-b5e6-098c2a8b7427$sla113$,
  $sqa113$Before treatment with CORVERT, hypokalemia and hypomagnesemia should be corrected to reduce the potential for proarrhythmia.$sqa113$,
  $cha113$d6199f7a4c1c43eab5b60987bf019f645782a84f8eb0acd62f94224ca7c1dab2$cha113$,
  true,
  $rfa113$[{"label": "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b7d717ed-022d-4459-b5e6-098c2a8b7427", "url": "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b7d717ed-022d-4459-b5e6-098c2a8b7427"}]$rfa113$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida114$b9xdbfd0b2c682325ccaac4f794$ida114$,
  $fxa114$template_artifact|wrong_blueprint$fxa114$,
  $sca114$A 48-year-old patient has flank pain and a urine pH of 5.0. A plain film shows no stone. CT shows a stone in the ureter. A classmate calls it calcium because most stones are calcium. He does not have hypercalcemia. The pain is typical colic.$sca114$,
  $qua114$Why does the acid urine change the invisible stone’s identity?$qua114$,
  $opa114${"options":["Absence of hypercalcemia means this stone cannot be invisible on a plain radiograph","Typical renal colic means every stone of this type is visible on a plain film","Uric acid precipitates in acid urine and is not seen on a plain film, unlike most calcium stones","A plain film that misses the stone means the stone seen on CT must be calcium","A urine pH of 5.0 dissolves uric acid and therefore clears this ureteral stone"],"blueprintTopic":"uric-acid-stone","blueprintSystem":"respiratory-renal"}$opa114$,
  $kya114$Uric acid precipitates in acid urine and is not seen on a plain film, unlike most calcium stones$kya114$,
  $exa114$The stone is invisible on the plain film and the urine is acid, so it is uric acid, not a calcium stone that would have shown up. Uric acid precipitates in acid urine and is not seen on a plain film, unlike most calcium stones. A plain film that misses a stone means the CT stone is calcium is the radiolucent stone. A urine pH of 5.0 dissolves uric acid precipitates it. No hypercalcemia means the stone cannot be radiolucent removes one reason for a calcium stone. Typical colic means the stone is visible on every plain film does not make uric acid visible.$exa114$,
  4,
  $dma114$respiratory-renal$dma114$,
  $tpa114$uric-acid-stone$tpa114$,
  $sua114$https://www.ncbi.nlm.nih.gov/books/NBK560726/$sua114$,
  $sla114$https://www.ncbi.nlm.nih.gov/books/NBK560726/$sla114$,
  $sqa114$Uric acid stones are radiolucent, while calcium-based stones are radioopaque.$sqa114$,
  $cha114$4ee3c7f14d13edf6370d7bc03ec37293dabbabef08991bb69d52a5c778c35e77$cha114$,
  true,
  $rfa114$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK560726/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK560726/"}]$rfa114$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida115$cmqxd0prh006j1yma922hejmb$ida115$,
  $fxa115$rationale$fxa115$,
  $sca115$A 68-year-old man with a history of heart failure and chronic kidney disease presents to the emergency department with worsening dyspnea over the past week. He reports increased swelling in his legs and has been feeling more fatigued. On examination, his blood pressure is 130/85 mm Hg, heart rate is 95 bpm, and he has bilateral crackles on lung auscultation. A chest X-ray shows pulmonary congestion. His serum potassium level is 5.8 mEq/L.$sca115$,
  $qua115$What is the most appropriate next step in management?$qua115$,
  $opa115${"kind":"sequential","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"chf-management","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782624429375","qcScore":8.2,"slotIndex":16,"stepLevel":"step2","examNumber":1375,"generatedAt":"2026-06-28T05:31:49.323Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer furosemide intravenously","Initiate hemodialysis","Start an ACE inhibitor","Administer potassium-sparing diuretics"],"taskCategory":"communication"}$opa115$,
  $kya115$Administer furosemide intravenously$kya115$,
  $exa115$Pulmonary congestion and leg edema from acute decompensated heart failure are treated first with an intravenous loop diuretic. Furosemide treats that volume overload and lowers potassium. The stem describes chronic kidney disease, not acute kidney injury, and gives no creatinine. Hemodialysis is not the first step at a potassium of 5.8 mEq/L without refractory overload or electrocardiographic toxicity. An ACE inhibitor is not the immediate treatment of congestion and can worsen hyperkalemia. A potassium-sparing diuretic would raise the potassium further.$exa115$,
  5,
  $dma115$cardiovascular$dma115$,
  $tpa115$chf-management$tpa115$,
  $sua115$https://www.ncbi.nlm.nih.gov/books/NBK499921/$sua115$,
  $sla115$https://www.ncbi.nlm.nih.gov/books/NBK499921/$sla115$,
  $sqa115$The Food and Drug Administration (FDA) has approved furosemide to treat conditions with volume overload and edema secondary to congestive heart failure exacerbation, liver failure, or renal failure, including the nephrotic syndrome.$sqa115$,
  $cha115$64fd6a05bfe28e608956df71a4d68d517996d134edbfed2c9c99747b40068d84$cha115$,
  true,
  $rfa115$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499921/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499921/"}]$rfa115$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida116$cmr4gwkt6001j1ydepij2m2hu$ida116$,
  $fxa116$rationale|wrong_blueprint$fxa116$,
  $sca116$A 9-year-old girl is brought to the emergency department with a high fever, abdominal pain, and vomiting. She has a history of recurrent urinary tract infections and has been treated with antibiotics multiple times. On examination, her temperature is 39°C (102.2°F), and she has tenderness in the suprapubic area. A urinalysis shows nitrites and leukocyte esterase positive.$sca116$,
  $qua116$Which of the following is the most appropriate initial management?$qua116$,
  $opa116${"options":["Start intravenous antibiotics","Obtain a renal ultrasound","Prescribe oral antibiotics","Perform a bladder catheterization"],"distractorRationale":{"Obtain a renal ultrasound":"This may be necessary for further evaluation but is not the immediate next step.","Prescribe oral antibiotics":"This is insufficient given the severity of her symptoms.","Perform a bladder catheterization":"This is not indicated at this stage."},"clinicalReasoning":"Assess the girl's symptoms and lab findings to identify the severity of her urinary infection. Analyze the need for immediate treatment and integrate the guidelines for managing pyelonephritis to determine that intravenous antibiotics are the best initial management.","keyTakeaways":["When faced with severe symptoms of a urinary tract infection, prioritize intravenous antibiotics over other interventions."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"urinary-tract-infection","blueprintSystem":"pediatrics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783054430164","qcScore":8.1,"slotIndex":56,"stepLevel":"step2","examNumber":9201,"generatedAt":"2026-07-03T04:55:28.738Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"pharmacotherapy"}$opa116$,
  $kya116$Start intravenous antibiotics$kya116$,
  $exa116$She has fever, vomiting, suprapubic tenderness, and a nitrite-positive urinalysis. Oral antibiotics can treat pyelonephritis when a child can take them, but persistent vomiting means she cannot. Start parenteral antibiotics, then change to an oral drug when she can keep medicine down. Ultrasound for recurrent infections can follow; it should not delay antibiotics. Bladder catheterization is not the treatment.$exa116$,
  3,
  $dma116$human-development$dma116$,
  $tpa116$urinary-tract-infection$tpa116$,
  $sua116$https://emedicine.medscape.com/article/969643-treatment$sua116$,
  $sla116$https://emedicine.medscape.com/article/969643-treatment$sla116$,
  $sqa116$Oral antibiotics should not be used in a child who is acutely ill or toxic, has persistent vomiting, or has moderate to severe dehydration.$sqa116$,
  $cha116$147a43f5c0113f4b2a090c9c063758d96377c4b3ef4c17188ef06143a4f95998$cha116$,
  true,
  $rfa116$[{"label": "https://emedicine.medscape.com/article/969643-treatment", "url": "https://emedicine.medscape.com/article/969643-treatment"}]$rfa116$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida117$cmr8al947019o1yr9pcj0cot8$ida117$,
  $fxa117$wrong_blueprint$fxa117$,
  $sca117$A 45-year-old woman presents to the emergency department with a 2-day history of palpitations, tremors, and weight loss. She reports feeling anxious and has experienced increased sweating. On examination, her heart rate is 110 beats per minute, blood pressure is 130/80 mm Hg, and she has a fine tremor in her hands. Laboratory tests reveal a TSH level of 0.1 mIU/L and free T4 of 2.5 ng/dL. These findings are suggestive of a hyperthyroid state.$sca117$,
  $qua117$What is the most likely diagnosis?$qua117$,
  $opa117${"options":["Graves' disease","Hashimoto's thyroiditis","Thyroid carcinoma","Subacute thyroiditis"],"distractorRationale":{"Hashimoto's thyroiditis":"This option is incorrect because Hashimoto's thyroiditis typically leads to hypothyroidism, not hyperthyroidism. Patients usually present with elevated TSH and low T4 levels.","Thyroid carcinoma":"This distractor is misleading as thyroid carcinoma generally does not cause hyperthyroidism and often presents with a thyroid nodule or asymptomatic mass.","Subacute thyroiditis":"This option fails because subacute thyroiditis is usually painful and presents with transient hyperthyroidism, which is not consistent with this patient's symptomatology."},"clinicalReasoning":"The patient's symptoms and lab findings indicate hyperthyroidism. Analyzing the TSH and free T4 levels helps differentiate between possible diagnoses. The presence of anxiety, tremors, and weight loss, along with the lab results, points towards Graves' disease as the most likely diagnosis.","keyTakeaways":["When evaluating hyperthyroidism, remember that Graves' disease is the most common cause and is characterized by specific clinical and laboratory findings."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"graves-disease","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783285795084","qcScore":8.1,"slotIndex":17,"stepLevel":"step2","examNumber":9215,"generatedAt":"2026-07-05T21:13:30.210Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$opa117$,
  $kya117$Graves' disease$kya117$,
  $exa117$Why this answer is correct
The most likely diagnosis is Graves' disease due to autoimmune hyperthyroidism.
Graves' disease is the most common cause of hyperthyroidism.
It presents with low TSH and high free T4 levels.
Symptoms include palpitations, tremors, and weight loss.
In practice: In practice, recognizing Graves' disease early can lead to timely management, preventing complications like thyroid storm. Understanding the autoimmune nature of this condition is crucial for patient education and treatment.
Why the other options are wrong

Hashimoto's thyroiditis
Trap: Students pick this because they associate autoimmune conditions with thyroid issues.
Why it fails here: Hashimoto's thyroiditis typically leads to hypothyroidism, characterized by elevated TSH and low T4 levels, which is the opposite of what this patient presents.
Remember: This highlights the importance of differentiating between autoimmune thyroid conditions based on lab findings.

Thyroid carcinoma
Trap: This option may be chosen due to concerns about malignancy in thyroid disorders.
Why it fails here: Thyroid carcinoma usually does not present with hyperthyroid symptoms and is often asymptomatic until advanced stages, making it an unlikely diagnosis in this case.
Remember: Understanding the typical presentations of thyroid conditions helps avoid misdiagnosis.

Subacute thyroiditis
Trap: Students might confuse this with hyperthyroidism due to transient symptoms.
Why it fails here: Subacute thyroiditis is often associated with pain and tenderness of the thyroid gland, which this patient does not exhibit, making it less likely.
Remember: Recognizing the clinical features of thyroiditis is essential for accurate diagnosis.
Key takeaway
When evaluating hyperthyroidism, remember that Graves' disease is the most common cause and is characterized by specific clinical and laboratory findings.

Memory hook: Think of Graves' disease as the 'classic' hyperthyroid condition: low TSH, high T4, and classic symptoms.$exa117$,
  2,
  $dma117$reproductive-endocrine$dma117$,
  $tpa117$graves-disease$tpa117$,
  $sua117$https://www.ncbi.nlm.nih.gov/books/NBK448195/$sua117$,
  $sla117$https://www.ncbi.nlm.nih.gov/books/NBK448195/$sla117$,
  $sqa117$Graves' disease is the most common cause of hyperthyroidism.$sqa117$,
  $cha117$5404d6a4fec905fdc23435c034f393e4c34e759db953f975ac3d97fa519a24be$cha117$,
  true,
  $rfa117$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK448195/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK448195/"}]$rfa117$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida118$cmrqhflp5002g1ypxtg8jm5u0$ida118$,
  $fxa118$wrong_key|rationale$fxa118$,
  $sca118$A 28-year-old woman presents to the emergency department with acute onset of confusion and hallucinations. She has a history of schizophrenia and has been non-compliant with her antipsychotic medication for the past month. On examination, her blood pressure is 130/85 mm Hg, heart rate is 92 bpm, and she appears disheveled. Laboratory tests reveal a serum sodium level of 128 mEq/L. She is currently on no medications and has no known drug allergies.$sca118$,
  $qua118$What is the most appropriate next step in management?$qua118$,
  $opa118${"kind":"ethics","stepLevel":"step2","blueprintSystem":"psychiatry","blueprintTopic":"schizophrenia-psychosis","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784385833344","qcScore":8,"slotIndex":11,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-18T14:45:51.413Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer intravenous fluids with normal saline","Initiate haloperidol 5 milligrams intramuscularly","Obtain a CT scan of the head","Start lithium therapy"],"taskCategory":"health-maintenance"}$opa118$,
  $kya118$Initiate haloperidol 5 milligrams intramuscularly$kya118$,
  $exa118$Acute hallucinations after a month without an antipsychotic are relapse of schizophrenia, and an antipsychotic is the treatment. Sodium of 128 mEq/L is moderate. Above 125 mEq/L, symptoms are usually minimal, and her blood pressure and heart rate do not show hypovolemia. Euvolemic hyponatremia is managed with fluid restriction, not routine isotonic saline, which does not correct inappropriate antidiuresis. Lithium is not the treatment of schizophrenia and is unsafe when the sodium is low. Head CT is not required without a focal neurologic deficit.$exa118$,
  3,
  $dma118$behavioral-nervous$dma118$,
  $tpa118$schizophrenia-psychosis$tpa118$,
  $sua118$https://www.ncbi.nlm.nih.gov/books/NBK470386/$sua118$,
  $sla118$https://www.ncbi.nlm.nih.gov/books/NBK470386/$sla118$,
  $sqa118$Patients with mild to moderate hyponatremia (greater than 125 mEq/L) or a gradual decrease in sodium levels over more than 48 hours generally have minimal symptoms.$sqa118$,
  $cha118$78ae38815c5e5bd79683db07304f1a48eb310456beee223ba76437de61d61c18$cha118$,
  true,
  $rfa118$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470386/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470386/"}]$rfa118$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida119$cmwfsan1a001ejsepk5fert4s$ida119$,
  $fxa119$difficulty$fxa119$,
  $sca119$A 58-year-old man with diabetes has 10 hours of severe thigh pain after a minor skin nick. The skin is dusky, pain extends beyond the redness, and he is toxic. Temperature is 39.2 C, blood pressure 88/52 mm Hg, pulse 128/min, and lactate is 4.8 mmol/L. Glucose is 240 mg/dL.$sca119$,
  $qua119$Which of the following is the most appropriate next step in management?$qua119$,
  $opa119${"options":["Intravenous antibiotics and a 24-hour check","Emergent operative exploration and debridement","CT scan and discharge if no abscess is seen","Oral antibiotics and warm compresses","Incision and drainage at the bedside tomorrow for this patient"],"kind":"vignette","blueprintSystem":"msk-skin","blueprintTopic":"Operative debridement for necrotizing fasciitis","taskCategory":"clinical-intervention"}$opa119$,
  $kya119$Emergent operative exploration and debridement$kya119$,
  $exa119$Pain out of proportion, dusky skin, and shock are necrotizing fasciitis. Antibiotics are given, but the infection spreads along fascia and the next definitive step is emergent operative debridement. Imaging must not delay the operating room. "Intravenous antibiotics and a 24-hour check" is not the best choice because Antibiotics without surgery leave necrotic fascia in place. "Oral antibiotics and warm compresses" is not the best choice because This is septic shock, not cellulitis for home therapy. "Incision and drainage at the bedside tomorrow for this patient" is not the best choice because A delayed bedside nick is not a fasciotomy or a debridement. "CT scan and discharge if no abscess is seen" is not the best choice because Absence of a drainable abscess does not exclude fascial necrosis, and he is in shock.$exa119$,
  3,
  $dma119$msk-skin$dma119$,
  $tpa119$Operative debridement for necrotizing fasciitis$tpa119$,
  $sua119$https://www.merckmanuals.com/professional/dermatologic-disorders/bacterial-skin-infections/necrotizing-soft-tissue-infection$sua119$,
  $sla119$https://www.merckmanuals.com/professional/dermatologic-disorders/bacterial-skin-infections/necrotizing-soft-tissue-infection$sla119$,
  $sqa119$The diagnosis of NSTI is primarily clinical and is suggested by pain that appears out of proportion to clinical findings.$sqa119$,
  $cha119$ec385ca8ba9300fc3ef59698484d5e1895d9455d090dbda84dfda33545aa9539$cha119$,
  true,
  $rfa119$[{"label": "https://www.merckmanuals.com/professional/dermatologic-disorders/bacterial-skin-infections/necrotizing-soft-tissue-infection", "url": "https://www.merckmanuals.com/professional/dermatologic-disorders/bacterial-skin-infections/necrotizing-soft-tissue-infection"}]$rfa119$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida120$b1x2d6fe9ea2d2b8fa81a1d1bab$ida120$,
  $fxa120$wrong_blueprint$fxa120$,
  $sca120$A 63-year-old man has a week of fatigue and bleeding gums. Hemoglobin is 8 g/dL, platelets are 20,000/mm3, and the leukocyte count is 32,000/mm3 with 60% blasts. Several blasts contain pink needle-shaped cytoplasmic inclusions.$sca120$,
  $qua120$Which lineage do those inclusions mark?$qua120$,
  $opa120${"options":["Myeloid","Lymphoid","Erythroid only","Megakaryocytic only","Plasma cell"],"blueprintTopic":"auer-rods","blueprintSystem":"blood-lymph-immune"}$opa120$,
  $kya120$Myeloid$kya120$,
  $exa120$Auer rods in myeloblasts are acute myeloid leukemia and prove the blasts are myeloid. Myeloid blasts can crystallize primary granules into Auer rods; lymphoid blasts cannot. Lymphoid blasts are TdT positive and lack Auer rods. Erythroid only and Megakaryocytic only are uncommon AML subtypes and do not form Auer rods as their signature. Plasma cell neoplasms show clock-face chromatin and produce a paraprotein, not blasts with needles.$exa120$,
  3,
  $dma120$blood-lymph-immune$dma120$,
  $tpa120$auer-rods$tpa120$,
  $sua120$https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/acute-myeloid-leukemia-aml$sua120$,
  $sla120$https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/acute-myeloid-leukemia-aml$sla120$,
  $sqa120$Auer rods may be seen in the myeloblasts.$sqa120$,
  $cha120$fafbd82a5d7cea8b7e8b635757ee2e6fb894fe3aaa87cc1a598f12abbc0d1b50$cha120$,
  true,
  $rfa120$[{"label": "https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/acute-myeloid-leukemia-aml", "url": "https://www.merckmanuals.com/professional/hematology-and-oncology/leukemias/acute-myeloid-leukemia-aml"}]$rfa120$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida121$b2xe5ceb80cad9ceee325d8695a$ida121$,
  $fxa121$wrong_blueprint|distractor$fxa121$,
  $sca121$A 22-year-old student has nine households earning 40,000 and one earning 2,000,000. She must report a single typical income. The mean sits far above what most households earn. The distribution has a long right tail. She asks which summary the one rich household does not drag.$sca121$,
  $qua121$Which summary does the one high income fail to drag?$qua121$,
  $opa121${"options":["The mean","The range","The standard deviation","The median","The mode, which moves to the single million"],"blueprintTopic":"median-versus-mean","blueprintSystem":"biostats-epi"}$opa121$,
  $kya121$The median$kya121$,
  $exa121$One very high income pulls the mean above what most households earn, so the median stays with the typical household. The median stays near 40,000. The mean is dragged up by the single large income. The range and the standard deviation describe spread, not the typical household. The mode of the million does not exist as a repeated value.$exa121$,
  3,
  $dma121$biostats-epi$dma121$,
  $tpa121$median-versus-mean$tpa121$,
  $sua121$https://www.ncbi.nlm.nih.gov/books/NBK546702/$sua121$,
  $sla121$https://www.ncbi.nlm.nih.gov/books/NBK546702/$sla121$,
  $sqa121$For example, in variables such as income or hospital length of stay, extreme values can distort the mean and suggest a central value not experienced by the majority of individuals, whereas the median, being less affected by outliers, often provides a more accurate estimate of central tendency.$sqa121$,
  $cha121$846c2c93339839225d0140e43b89e36ee8ea24c9a626bdbcc8ad43bd1e5e0d4d$cha121$,
  true,
  $rfa121$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK546702/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK546702/"}]$rfa121$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida122$b4xe4fc851cdb1d841eac718e47$ida122$,
  $fxa122$wrong_blueprint|difficulty$fxa122$,
  $sca122$A 30-year-old woman has a hyperchloremic metabolic acidosis. She has no diarrhea. Urine pH is 6.8 and the urine anion gap is positive. A colleague blames stool bicarbonate loss because the serum bicarbonate is low.$sca122$,
  $qua122$Why does a positive urine anion gap argue against diarrhea?$qua122$,
  $opa122${"options":["Diarrhea makes the urine anion gap positive","A positive gap means the gut is leaking bicarbonate into urine","Ammonium is high whenever the gap is positive","Urine pH of 6.8 proves the loss was from the gut","The kidney is not excreting ammonium with chloride"],"blueprintTopic":"urine-anion-gap","blueprintSystem":"respiratory-renal"}$opa122$,
  $kya122$The kidney is not excreting ammonium with chloride$kya122$,
  $exa122$A positive urine anion gap means the kidney is not excreting ammonium with chloride, which is renal tubular acidosis rather than diarrhea. The kidney is not excreting ammonium with chloride. Diarrhea makes the urine anion gap positive is backward; diarrhea drives a negative gap from ammonium excretion. A positive gap means the gut is leaking bicarbonate into urine invents a route. Ammonium is high whenever the gap is positive is the opposite. Urine pH of 6.8 proves the loss was from the gut is false; that high urine pH during acidosis points at the kidney.$exa122$,
  3,
  $dma122$respiratory-renal$dma122$,
  $tpa122$urine-anion-gap$tpa122$,
  $sua122$https://www.ncbi.nlm.nih.gov/books/NBK519044/$sua122$,
  $sla122$https://www.ncbi.nlm.nih.gov/books/NBK519044/$sla122$,
  $sqa122$Positive gap signifies low NH4Cl excretion which causes decrease chloride in urine along with hyperchloremic metabolic acidosis suggesting RTA.$sqa122$,
  $cha122$7da67b6f3d8039cb2796fcb4a381b6f64078b59a82dad71a189c0b2a21aaeee5$cha122$,
  true,
  $rfa122$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK519044/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK519044/"}]$rfa122$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida123$b7xc8ba55578e4335caa6d1958d$ida123$,
  $fxa123$template_artifact$fxa123$,
  $sca123$In a randomized trial, 20 percent of the drug arm never took the drug and 20 percent of the placebo arm obtained it. An analysis that regroups people by what they actually took makes the drug look better. The assigned-arm analysis is smaller. A 49-year-old patient asks which analysis preserves the coin flip.$sca123$,
  $qua123$Why does regrouping by the drug actually taken break the comparison?$qua123$,
  $opa123${"options":["A smaller assigned-arm effect means the crossover analysis is less biased","Placebo patients who obtain the drug should be counted as proof the drug failed","Never taking the assigned drug removes a person from the trial without bias","Crossovers are no longer random, so the assigned arm is the comparison that still is","Moving people into the arm they preferred repairs the broken randomization"]}$opa123$,
  $kya123$Crossovers are no longer random, so the assigned arm is the comparison that still is$kya123$,
  $exa123$People who crossed over stay in the arm they were assigned, because analyzing the treatment they actually took breaks the randomization. The people who crossed over are no longer random, so the assigned arm is the comparison that still is. Randomization is repaired by moving people into the arm they preferred is what breaks it. A smaller assigned-arm effect means the crossover analysis is less biased is often a larger, biased effect. Placebo patients who obtain the drug should be counted as proof the drug failed stay in the placebo assignment. Never taking the assigned drug removes a person from the trial without bias is a choice that is not random.$exa123$,
  4,
  $dma123$biostats-epi$dma123$,
  $tpa123$study-design-appraisal$tpa123$,
  $sua123$https://pmc.ncbi.nlm.nih.gov/articles/PMC3159210/$sua123$,
  $sla123$https://pmc.ncbi.nlm.nih.gov/articles/PMC3159210/$sla123$,
  $sqa123$ITT analysis maintains prognostic balance generated from the original random treatment allocation.$sqa123$,
  $cha123$e90d7e7ad48da9a1a4e966138e8e5e9a2db1f433e312f3dd6a6de864b11394ca$cha123$,
  true,
  $rfa123$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3159210/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3159210/"}]$rfa123$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida124$cmqd1mz4e00ba1ychegqmr0n0$ida124$,
  $fxa124$wrong_blueprint|template_artifact$fxa124$,
  $sca124$A 67-year-old man with a 40-pack-year smoking history is found unresponsive at home. An autopsy reveals a lung mass with small blue cells that are positive for keratin and chromogranin. He had experienced recent weight loss and cough but did not seek medical attention.$sca124$,
  $qua124$What is the most likely diagnosis?$qua124$,
  $opa124${"options":["Small cell lung carcinoma","Squamous cell carcinoma","Adenocarcinoma","Mesothelioma"],"blueprintTopic":"small-cell-lung-carcinoma","blueprintSystem":"respiratory-renal"}$opa124$,
  $kya124$Small cell lung carcinoma$kya124$,
  $exa124$Why this answer is correct
The diagnosis is small cell lung carcinoma due to its characteristic small blue cells and neuroendocrine markers.
Small cell lung carcinoma is associated with smoking and presents with small blue cells.
It is characterized by chromogranin positivity, indicating neuroendocrine differentiation.
This type of cancer often leads to rapid progression and can result in sudden death.
In practice: In practice, recognizing small cell lung carcinoma is crucial due to its aggressive nature and the need for prompt treatment. Understanding its association with smoking helps in risk assessment and patient education.
Why the other options are wrong

Squamous cell carcinoma (a cancer of squamous cells)
Trap: Students may confuse squamous cell carcinoma with small cell lung carcinoma due to both being lung cancers.
Why it fails here: Squamous cell carcinoma (a cancer of squamous cells) typically shows keratinization and is less likely to express neuroendocrine markers like chromogranin, which are key features of small cell lung carcinoma.
Remember: This highlights the importance of distinguishing between different lung cancer types based on histological features.

Adenocarcinoma
Trap: Some may think adenocarcinoma is the most common lung cancer in smokers.
Why it fails here: While adenocarcinoma can occur in smokers, small cell lung carcinoma is more strongly associated with smoking and presents with small blue cells rather than glandular differentiation.
Remember: This reinforces the need to connect smoking history with the specific lung cancer type.

Mesothelioma
Trap: Students might associate mesothelioma with lung masses without considering the specific exposure history.
Why it fails here: Mesothelioma is primarily linked to asbestos exposure and typically presents with pleural effusions, not small blue cells in a lung mass.
Remember: Understanding the distinct etiologies and presentations of lung cancers is essential for accurate diagnosis.
Key takeaway
When evaluating lung masses in smokers, prioritize small cell lung carcinoma if small blue cells and neuroendocrine markers are present.

Memory hook: Remember: 'Small cells, big smoke' for small cell lung carcinoma.$exa124$,
  4,
  $dma124$respiratory-renal$dma124$,
  $tpa124$small-cell-lung-carcinoma$tpa124$,
  $sua124$https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq$sua124$,
  $sla124$https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq$sla124$,
  $sqa124$Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen.$sqa124$,
  $cha124$6b8e18f44f5a2751e7502e5006a59377c37eb23ee048f5d465bc5accd1f3d780$cha124$,
  true,
  $rfa124$[{"label": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$rfa124$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida125$cmr4kxaih001a1y1ef0n1gwte$ida125$,
  $fxa125$not_single_best|rationale$fxa125$,
  $sca125$A 45-year-old woman presents to the emergency department with a 2-day history of polyuria, polydipsia, and unintentional weight loss. Her vital signs are stable, but her blood glucose level is found to be 350 mg/dL. She has a history of obesity and hypertension but has not been previously diagnosed with diabetes. Laboratory tests reveal a serum bicarbonate level of 18 mEq/L and an anion gap of 15 mEq/L.$sca125$,
  $qua125$Which process best accounts for the anion-gap metabolic acidosis?$qua125$,
  $opa125${"options":["Increased lipolysis leading to ketone body production","Decreased insulin secretion from pancreatic beta cells","Increased renal glucose reabsorption","Decreased hepatic gluconeogenesis"],"distractorRationale":{"Decreased insulin secretion from pancreatic beta cells":"Incorrect because while insulin secretion may be impaired, the metabolic effects of insulin resistance are more relevant in this context.","Increased renal glucose reabsorption":"Incorrect as hyperglycemia leads to glucosuria, not increased reabsorption.","Decreased hepatic gluconeogenesis":"Incorrect because hepatic gluconeogenesis is often increased in insulin-resistant states."},"clinicalReasoning":"Assess the patient's symptoms of polyuria, polydipsia, and weight loss alongside lab findings of hyperglycemia and metabolic acidosis. Analyze the underlying mechanisms of diabetes, particularly the role of insulin in glucose metabolism and fat breakdown. Integrate this knowledge to conclude that increased lipolysis and subsequent ketone production is the primary pathophysiological process at play.","keyTakeaways":["When you see signs of uncontrolled diabetes, think about increased lipolysis and the risk of ketoacidosis first."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"diabetes-pathophysiology","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783061067490","qcScore":8,"slotIndex":47,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-03T06:53:44.932Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$opa125$,
  $kya125$Increased lipolysis leading to ketone body production$kya125$,
  $exa125$Low insulin, absolute or relative, lets hormone-sensitive lipase break down fat. The liver turns the fatty acids into ketoacids, and those unmeasured anions lower bicarbonate and widen the anion gap. Decreased insulin secretion is the upstream cause, but it is not the acid in the gap. At a glucose of 350 mg/dL, filtered glucose exceeds reabsorption, so reabsorption is not increased. Hepatic gluconeogenesis is increased while insulin is low, not decreased.$exa125$,
  2,
  $dma125$reproductive-endocrine$dma125$,
  $tpa125$diabetes-pathophysiology$tpa125$,
  $sua125$https://www.ncbi.nlm.nih.gov/books/NBK534848/$sua125$,
  $sla125$https://www.ncbi.nlm.nih.gov/books/NBK534848/$sla125$,
  $sqa125$An increased anion gap metabolic acidosis occurs when these ketone bodies are present as they are unmeasured anions.$sqa125$,
  $cha125$62b0df90ad1729a791fe0c91b7a85ac9e8396240b68d3e94b423942952d23bb6$cha125$,
  true,
  $rfa125$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK534848/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534848/"}]$rfa125$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida126$cmr89zumj00px1yw27lpvqzm2$ida126$,
  $fxa126$rationale|difficulty$fxa126$,
  $sca126$A 65-year-old man presents to the emergency department with worsening shortness of breath and fatigue over the past week. He has a history of hypertension and hyperlipidemia, and he is currently taking lisinopril and atorvastatin. On examination, his blood pressure is 150/90 mm Hg, heart rate is 98 bpm, and he has bilateral lower extremity edema. An echocardiogram reveals left ventricular hypertrophy and aortic stenosis. Laboratory tests show elevated B-type natriuretic peptide (BNP) levels.$sca126$,
  $qua126$What is the most likely underlying mechanism contributing to this patient's heart failure?$qua126$,
  $opa126${"kind":"biostats","stepLevel":"step1","blueprintSystem":"cardiovascular","blueprintTopic":"valvular-disease-mechanisms","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783284752963","qcScore":8.2,"slotIndex":18,"stepLevel":"step1","examNumber":9109,"generatedAt":"2026-07-05T20:55:31.140Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Increased afterload due to aortic stenosis","Decreased preload from diastolic dysfunction","Increased contractility from sympathetic stimulation","Decreased systemic vascular resistance"],"taskCategory":"professionalism"}$opa126$,
  $kya126$Increased afterload due to aortic stenosis$kya126$,
  $exa126$The stenotic aortic valve raises the pressure the left ventricle must generate, so afterload rises, the ventricle hypertrophies, and heart failure follows. That valvular load is not systemic vascular resistance, and aortic pressure is not what the stenosis increases. Diastolic dysfunction can raise left atrial filling pressure; it does not create this obstruction and it does not lower preload as the cause of the failure. Sympathetic stimulation may increase contractility, but it is not the lesion. A fall in systemic vascular resistance would reduce, not impose, this pressure load.$exa126$,
  3,
  $dma126$cardiovascular$dma126$,
  $tpa126$valvular-disease-mechanisms$tpa126$,
  $sua126$https://www.ncbi.nlm.nih.gov/books/NBK557628/$sua126$,
  $sla126$https://www.ncbi.nlm.nih.gov/books/NBK557628/$sla126$,
  $sqa126$The increased afterload, in addition, to an increase in LV volume overload, leads to an increase in LV mass, ultimately leading to LV dysfunction and failure.$sqa126$,
  $cha126$80bd8436074174defac0cf5ab6f01a5d3c935f1d852535a48ab53c151fb4e2a0$cha126$,
  true,
  $rfa126$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK557628/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557628/"}]$rfa126$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida127$cmr8clos2018t1yw2j5ccdzy2$ida127$,
  $fxa127$wrong_step|wrong_blueprint$fxa127$,
  NULL,
  $qua127$Which mechanism explains how unrestricted oxygen can raise PaCO2 in this disease?$qua127$,
  $opa127${"options":["A larger tiotropium dose is what corrects hypoxemia of this degree","Another dose of prednisone is the treatment that raises arterial oxygen","Antibiotics are required whenever the saturation falls below 90 percent","Loss of hypoxic vasoconstriction can raise PaCO2 when oxygen is unrestricted"],"blueprintTopic":"copd-oxygen-target","blueprintSystem":"respiratory-renal"}$opa127$,
  $kya127$Loss of hypoxic vasoconstriction can raise PaCO2 when oxygen is unrestricted$kya127$,
  $exa127$PaO2 is 50 mm Hg, so he needs oxygen. In COPD, a high inspired oxygen concentration raises alveolar oxygen in poorly ventilated units and releases hypoxic pulmonary vasoconstriction. Blood flow then increases to those units, ventilation-perfusion mismatch worsens, and PaCO2 can rise. Oxygen is therefore titrated, often with a Venturi mask, and the blood gas is rechecked. Raising the maintenance tiotropium dose, repeating prednisone, or starting antibiotics does not explain that gas-exchange risk. Antibiotics are not indicated here because there is no purulent sputum and no infiltrate.$exa127$,
  4,
  $dma127$respiratory-renal$dma127$,
  $tpa127$copd-oxygen-target$tpa127$,
  $sua127$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua127$,
  $sla127$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla127$,
  $sqa127$High flow oxygen systems and mechanical noninvasive ventilation are indicated for patients with COPD and acute respiratory failure.$sqa127$,
  $cha127$6d3835aa135b5adde2c3e1bdd47aee00213be126efd7e11fd28e3ce7abadc350$cha127$,
  true,
  $rfa127$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa127$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida128$cmrpw57vd002n1yrtop44siwc$ida128$,
  $fxa128$wrong_step|wrong_blueprint|template_artifact$fxa128$,
  NULL,
  $qua128$Which mechanism best explains the recurrent stroke risk that anticoagulation is meant to reduce?$qua128$,
  $opa128${"options":["Platelet-rich clot on a ruptured carotid atherosclerotic plaque","Stasis thrombus forming in the fibrillating left atrium","Lipohyalinosis occluding a small penetrating brain artery","Bleeding into the small cortical infarct as the primary event"],"blueprintTopic":"cardioembolic-stroke","blueprintSystem":"cardiovascular"}$opa128$,
  $kya128$Stasis thrombus forming in the fibrillating left atrium$kya128$,
  $exa128$Atrial fibrillation removes effective atrial contraction. Blood stasis, especially in the left atrial appendage, forms thrombus that embolizes to a cortical artery. Carotid duplex shows no stenosis, so this is not plaque embolism. A 1.5-cm cortical infarct is not the small deep lesion of lipohyalinosis, and the MRI showed no hemorrhage. Anticoagulation is used because the source is a fibrin-rich stasis thrombus rather than a platelet plug on an artery.$exa128$,
  3,
  $dma128$cardiovascular$dma128$,
  $tpa128$cardioembolic-stroke$tpa128$,
  $sua128$https://www.ncbi.nlm.nih.gov/books/NBK536990/$sua128$,
  $sla128$https://www.ncbi.nlm.nih.gov/books/NBK536990/$sla128$,
  $sqa128$Similarly, the lack of atrial contractility in atrial fibrillation results in an increased predisposition to clot formation, particularly in the left atrial appendage.$sqa128$,
  $cha128$a9e325b567545b23c665e151a7911a19042c47cb78d8f22c75a19109361607c7$cha128$,
  true,
  $rfa128$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK536990/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK536990/"}]$rfa128$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida129$cmrru3pks00b21y8wf3vhcmqi$ida129$,
  $fxa129$cue|template_artifact|wrong_blueprint$fxa129$,
  NULL,
  $qua129$A 45-year-old woman comes to the emergency department because of blood in her urine and left flank pain for 3 days. She has hypertension treated with lisinopril. Her blood pressure is 150/95 mm Hg. Examination shows left flank tenderness. Urinalysis shows red blood cells without red cell casts. Contrast-enhanced CT scan of the abdomen shows a solid, enhancing 7-cm mass in the left kidney with tumor extending into the left renal vein; the right kidney is normal, and there are no stones or hydronephrosis. Which of the following best explains this patient's presentation?$qua129$,
  $opa129${"options":["Renal cell carcinoma of the renal cortex","Glomerulonephritis with an active urine sediment","Obstruction of the ureter by a calculus","Cyst rupture from polycystic kidney disease"],"blueprintTopic":"renal-cell-carcinoma"}$opa129$,
  $kya129$Renal cell carcinoma of the renal cortex$kya129$,
  $exa129$Hematuria, flank pain, and a solid enhancing renal mass are renal cell carcinoma. Tumor that grows into the renal vein is a classic feature of that cancer. Glomerulonephritis produces red-cell casts, which are absent. A ureteral stone would show the stone and hydronephrosis. Polycystic kidney disease causes many cysts in both kidneys, not one solid mass with a normal opposite kidney.$exa129$,
  2,
  $dma129$respiratory-renal$dma129$,
  $tpa129$renal-cell-carcinoma$tpa129$,
  $sua129$https://www.ncbi.nlm.nih.gov/books/NBK567761/$sua129$,
  $sla129$https://www.ncbi.nlm.nih.gov/books/NBK567761/$sla129$,
  $sqa129$The primary concern for a solid renal mass is renal cell carcinoma, of which there were about 81,000 new cases in 2024 and an estimated 14,000 deaths in the United States, according to the American Cancer Society.$sqa129$,
  $cha129$5c199a2314532d758071b8924e84bbcc7cff0401da4fdc28d56cd96ccaf2badc$cha129$,
  true,
  $rfa129$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK567761/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK567761/"}]$rfa129$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida130$cmrtffjpl000i1yx20v41do98$ida130$,
  $fxa130$wrong_blueprint$fxa130$,
  NULL,
  $qua130$A 45-year-old man with type 2 diabetes and hypertension comes to the clinic with fatigue. He takes metformin and amlodipine and no potassium supplements, ACE inhibitors, ARBs or NSAIDs. Blood pressure is 160/100 mm Hg. Serum potassium is 6.2 mEq/L, creatinine is 1.8 mg/dL, chloride is 112 mEq/L and bicarbonate is 18 mEq/L with a normal anion gap. Plasma renin and aldosterone are both low. ECG shows peaked T waves. Which of the following is the most likely underlying mechanism of his hyperkalemia?$qua130$,
  $opa130${"options":["Aldosterone deficiency","Increased renal tubular secretion of potassium","Excessive potassium intake","Increased cellular uptake of potassium"],"blueprintTopic":"type-4-renal-tubular-acidosis","blueprintSystem":"respiratory-renal"}$opa130$,
  $kya130$Aldosterone deficiency$kya130$,
  $exa130$Correct answer: A. Aldosterone deficiency. A diabetic patient with mild kidney impairment, hyperkalemia, normal anion gap metabolic acidosis and low renin and aldosterone has hyporeninemic hypoaldosteronism (type 4 RTA); lack of aldosterone reduces distal potassium secretion. Why the other options are wrong: B. Increased tubular potassium secretion would lower serum potassium, not raise it. C. He takes no supplements, and intake alone rarely causes hyperkalemia without impaired excretion. D. Shift of potassium into cells lowers serum potassium.$exa130$,
  5,
  $dma130$respiratory-renal$dma130$,
  $tpa130$type-4-renal-tubular-acidosis$tpa130$,
  $sua130$https://www.merckmanuals.com/professional/nephrology/renal-transport-abnormalities/renal-tubular-acidosis$sua130$,
  $sla130$https://www.merckmanuals.com/professional/nephrology/renal-transport-abnormalities/renal-tubular-acidosis$sla130$,
  $sqa130$Type 4 results from aldosterone deficiency or unresponsiveness of the distal tubule to aldosterone.$sqa130$,
  $cha130$5484e705a1b6febec66b60a774981945071fc4a4ab25fe4f924f57f135d3cee3$cha130$,
  true,
  $rfa130$[{"label": "https://www.merckmanuals.com/professional/nephrology/renal-transport-abnormalities/renal-tubular-acidosis", "url": "https://www.merckmanuals.com/professional/nephrology/renal-transport-abnormalities/renal-tubular-acidosis"}]$rfa130$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida131$cmr4e6ict01b61ykyq8xv5dst$ida131$,
  $fxa131$wrong_blueprint|difficulty|template_artifact$fxa131$,
  $sca131$A 50-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of gallstones and is currently on medication for hypertension. On examination, her abdomen is tender in the right upper quadrant, and she has a fever of 101°F. A CBC shows leukocytosis with a WBC count of 15,000/mm³. An abdominal ultrasound reveals gallbladder wall thickening and pericholecystic fluid.$sca131$,
  $qua131$What is the most likely diagnosis?$qua131$,
  $opa131${"options":["Acute cholecystitis","Acute pancreatitis","Acute hepatitis","Bowel obstruction"],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"acute-cholecystitis","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783050080823","qcScore":8.2,"slotIndex":12,"stepLevel":"step3","examNumber":9315,"generatedAt":"2026-07-03T03:42:26.921Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"pharmacotherapy"}$opa131$,
  $kya131$Acute cholecystitis$kya131$,
  $exa131$Why this answer is correct
The patient's symptoms and ultrasound findings confirm acute cholecystitis.
Right upper quadrant pain and fever indicate inflammation.
Leukocytosis (high white blood cell count) suggests an infectious process.
Ultrasound findings of gallbladder wall thickening and pericholecystic fluid are classic signs.
In practice: In practice, recognizing acute cholecystitis is crucial because it is a surgical emergency that requires prompt intervention to prevent complications like perforation.
Why the other options are wrong

Pancreatitis (inflammation of the pancreas)
Trap: Students may confuse the abdominal pain location, thinking it could be pancreatitis.
Why it fails here: Pancreatitis (inflammation of the pancreas) typically presents with epigastric pain rather than localized right upper quadrant pain and is associated with elevated lipase levels, which are not mentioned here.
Remember: Understanding the specific pain location and associated lab findings helps differentiate acute cholecystitis from pancreatitis.

Acute hepatitis
Trap: Some may think fever and abdominal pain could indicate hepatitis.
Why it fails here: Acute hepatitis usually presents with elevated liver enzymes and symptoms like jaundice, which are absent in this case.
Remember: Recognizing the typical lab findings and symptoms of hepatitis is essential to avoid misdiagnosis.

Bowel obstruction
Trap: Students might consider bowel obstruction due to abdominal pain and vomiting.
Why it fails here: Bowel obstruction typically presents with distension, constipation, and different types of abdominal pain, not specifically right upper quadrant tenderness.
Remember: Differentiating between types of abdominal pain and associated symptoms is key in making the correct diagnosis.
Key takeaway
When faced with right upper quadrant pain, fever, and ultrasound findings of gallbladder wall thickening, think acute cholecystitis first.

Memory hook: Remember the '4 Fs' of gallbladder disease: Female, Fat, Forty, Fertile.$exa131$,
  2,
  $dma131$gastrointestinal$dma131$,
  $tpa131$acute-cholecystitis$tpa131$,
  $sua131$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua131$,
  $sla131$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla131$,
  $sqa131$Findings suggestive of acute calculous cholecystitis include a thickened gallbladder wall >3 mm, edema, pericholecystic fluid, and the presence of gallstones.$sqa131$,
  $cha131$d4ab004772eeec79a53c5a4e16641d9c04201584ada68ee12639b57cefe15f5f$cha131$,
  true,
  $rfa131$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa131$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida132$cmr8ccekr00k31yloypct6y07$ida132$,
  $fxa132$not_single_best|wrong_blueprint|template_artifact$fxa132$,
  $sca132$A 50-year-old man with a history of diabetes presents to the clinic for routine follow-up. He reports increased thirst and urination over the past month. His vital signs are stable, and laboratory tests reveal a fasting blood glucose of 180 mg/dL and HbA1c of 8.5%. He is currently on metformin 1000 mg twice daily, the highest dose he tolerates. The physician discusses intensifying his diabetes management.$sca132$,
  $qua132$What is the next best step in management?$qua132$,
  $opa132${"kind":"sequential","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"type-2-diabetes-treatment","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783288792039","qcScore":8.3,"slotIndex":13,"stepLevel":"step3","examNumber":9307,"generatedAt":"2026-07-05T22:00:46.017Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Add a sulfonylurea","Start insulin therapy","Increase the metformin dose further","Initiate a GLP-1 receptor agonist"],"taskCategory":"pharmacotherapy"}$opa132$,
  $kya132$Initiate a GLP-1 receptor agonist$kya132$,
  $exa132$HbA1c is 8.5% on the highest tolerated metformin dose, about 1.5 percentage points above a usual goal near 7%. Add a second agent. A GLP-1 receptor agonist lowers glucose with weight loss and little hypoglycemia. A sulfonylurea can be used but causes hypoglycemia and weight gain, so it is not preferred. Insulin is not required at this glucose and A1c without catabolic features. The metformin dose cannot be increased further.$exa132$,
  2,
  $dma132$reproductive-endocrine$dma132$,
  $tpa132$type-2-diabetes-treatment$tpa132$,
  $sua132$https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment$sua132$,
  $sla132$https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment$sla132$,
  $sqa132$When A1C is ≥1.5% above the individualized glycemic goal, many individuals will require dual-combination therapy or a more potent glucose-lowering agent to achieve and maintain their goal A1C level.$sqa132$,
  $cha132$47aa04d6cdabf42419bdcc54abc909799a6dc5fb94c235be9c5d90dc93786b5c$cha132$,
  true,
  $rfa132$[{"label": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rfa132$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida133$cmr8g7caz01r81ylo178f96rw$ida133$,
  $fxa133$wrong_blueprint|template_artifact$fxa133$,
  NULL,
  $qua133$A 68-year-old man is brought to the emergency department after experiencing sudden onset of right-sided weakness and slurred speech. His blood pressure is 180/95 mm Hg, and he has a history of hypertension and atrial fibrillation. A noncontrast CT scan of the head shows no hemorrhage and no early ischemic changes. He was last known well 90 minutes ago. Fingerstick glucose is 110 mg/dL. He takes no anticoagulant medication; INR is 1.0, and platelet count is 230,000/mm³. What is the most appropriate next step in management?$qua133$,
  $opa133${"options":["Administer intravenous thrombolytics","Initiate aspirin therapy now instead","Perform a carotid endarterectomy","Obtain an MRI of the brain"],"blueprintTopic":"acute-ischemic-stroke","blueprintSystem":"behavioral-nervous"}$opa133$,
  $kya133$Administer intravenous thrombolytics$kya133$,
  $exa133$Correct answer: A. Administer intravenous thrombolytics. He has an acute ischemic stroke with a disabling deficit (right-sided weakness with a speech deficit), was last known well 90 minutes ago (within the 4.5-hour window), and has no contraindication: CT shows no hemorrhage or early ischemic changes, blood pressure is 180/95 mm Hg, glucose is 110 mg/dL, INR is 1.0, and platelet count is 230,000/mm³. IV thrombolysis should be given now without waiting for further imaging. Why the other options are wrong: B. Aspirin does not reperfuse the artery and is not a substitute for thrombolysis in an eligible patient; after IVT it is usually held for 24 hours. C. Carotid endarterectomy is secondary prevention for symptomatic carotid stenosis, not acute reperfusion, and no stenosis has been shown. D. MRI is not needed before IVT; noncontrast CT has excluded hemorrhage, and waiting for MRI delays treatment.$exa133$,
  3,
  $dma133$behavioral-nervous$dma133$,
  $tpa133$acute-ischemic-stroke$tpa133$,
  $sua133$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sua133$,
  $sla133$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sla133$,
  $sqa133$The new treatment guidelines recommend either tPA or TNK within the 4.5-hour treatment window, regardless of NIHSS score, and without advanced imaging.$sqa133$,
  $cha133$52c1ef0cc9c3a1755a804c9f41e3fefe1502bbe483f8e4bb3623de9d50bccb1c$cha133$,
  true,
  $rfa133$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499997/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$rfa133$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida134$cmr8ji8xh02nu1ylov6dodlru$ida134$,
  $fxa134$not_single_best|wrong_blueprint|rationale$fxa134$,
  $sca134$A 62-year-old male with a history of hypertension and diabetes presents to the clinic for routine follow-up. His blood pressure is 150/95 mm Hg, and his HbA1c is 8.5%. He reports occasional headaches but no other symptoms. He is currently taking lisinopril 40 mg daily and metformin.$sca134$,
  $qua134$What is the next best step in management?$qua134$,
  $opa134${"kind":"ethics","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"hypertension-treatment","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783300834887","qcScore":8.2,"slotIndex":41,"stepLevel":"step3","examNumber":9330,"generatedAt":"2026-07-06T01:21:37.919Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Add a thiazide diuretic","Increase the dose of lisinopril","Start insulin therapy","Refer to a dietitian"],"taskCategory":"communication"}$opa134$,
  $kya134$Add a thiazide diuretic$kya134$,
  $exa134$Blood pressure remains 150/95 mm Hg on lisinopril 40 mg daily, a full step-1 ACE-inhibitor dose. For diabetes, the ACE inhibitor is the preferred first drug. The next step is to add either a calcium-channel blocker or a thiazide-like diuretic. A thiazide-like diuretic is an accepted add-on and is the add-on listed here. The lisinopril dose should not be pushed past 40 mg. Insulin is not required for an HbA1c of 8.5% without severe hyperglycemia. Diet counseling helps, but it does not replace the additional blood-pressure drug.$exa134$,
  5,
  $dma134$cardiovascular$dma134$,
  $tpa134$hypertension-treatment$tpa134$,
  $sua134$https://www.nice.org.uk/guidance/ng136/chapter/Recommendations$sua134$,
  $sla134$https://www.nice.org.uk/guidance/ng136/chapter/Recommendations$sla134$,
  $sqa134$If hypertension is not controlled in adults taking step 1 treatment of an ACE inhibitor or ARB, offer the choice of 1 of the following drugs in addition to step 1 treatment:$sqa134$,
  $cha134$c352d8d4c399b8f5567727cbda4a3225e5faa814ba26440ca0c178e51b2d90db$cha134$,
  true,
  $rfa134$[{"label": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$rfa134$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida135$cmr8mluvw00nd1yginl2pje0v$ida135$,
  $fxa135$not_single_best|rationale|wrong_blueprint$fxa135$,
  $sca135$A 29-year-old woman presents to the emergency department with severe abdominal pain and heavy vaginal bleeding 5 days after a spontaneous abortion. She has a history of two previous miscarriages and is currently on no medications. On examination, her blood pressure is 118/74 mm Hg, heart rate is 88 bpm, and she is comfortable between contractions of pain. A transvaginal ultrasound shows retained products of conception.$sca135$,
  $qua135$What is the most appropriate next step in management?$qua135$,
  $opa135${"options":["Administer methotrexate","Perform dilation and curettage (D&C)","Provide supportive care and discharge","Initiate intravenous fluids"],"distractorRationale":{"Administer methotrexate":"This option is incorrect as methotrexate is not indicated for retained products of conception.","Provide supportive care and discharge":"This option fails because it does not address the urgent need to manage retained products.","Initiate intravenous fluids":"This option is inappropriate as the primary concern is the retained products, not fluid resuscitation."},"clinicalReasoning":"Assess the patient's clinical status and ultrasound findings. Analyze the need for surgical intervention based on the presence of retained products. Integrate clinical guidelines for managing complications following miscarriage to determine the best next step.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"retained-products-of-conception","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783305855239","examNumber":9308,"slotIndex":32,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T02:45:32.664Z"}}$opa135$,
  $kya135$Perform dilation and curettage (D&C)$kya135$,
  $exa135$She is bleeding from retained products and her pulse and blood pressure are normal, so the specific treatment is uterine evacuation by dilation and curettage. Intravenous fluids would be required if she were tachycardic or hypotensive; they are not the priority while she is stable. Methotrexate is used for ectopic pregnancy, not for intrauterine retained tissue. Discharge leaves the tissue in place and the bleeding untreated.$exa135$,
  2,
  $dma135$reproductive-endocrine$dma135$,
  $tpa135$retained-products-of-conception$tpa135$,
  $sua135$https://www.ncbi.nlm.nih.gov/books/NBK430793/$sua135$,
  $sla135$https://www.ncbi.nlm.nih.gov/books/NBK430793/$sla135$,
  $sqa135$If the patient exhibits signs of volume depletion, the practitioner must start resuscitation with intravenous crystalloid fluids and assess the volume of blood loss.$sqa135$,
  $cha135$1f1c3be0aea058a597f2487f748620d56ceedb11fb4f29deb14d974bded7ce66$cha135$,
  true,
  $rfa135$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK430793/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430793/"}]$rfa135$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida136$cmr8pvgcz01gm1ygi7vg1vavj$ida136$,
  $fxa136$wrong_blueprint$fxa136$,
  $sca136$A 30-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain and vomiting. She has a history of type 1 diabetes mellitus and reports that she has been unable to keep any food down for the past 24 hours. On examination, her vital signs show a blood pressure of 90/60 mm Hg, heart rate of 120 beats per minute, and she appears dehydrated. Laboratory tests reveal a blood glucose level of 450 mg/dL and a serum bicarbonate level of 12 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$sca136$,
  $qua136$What is the most likely diagnosis?$qua136$,
  $opa136${"kind":"ethics","stepLevel":"step3","blueprintSystem":"reproductive-endocrine","blueprintTopic":"diabetic-ketoacidosis","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783311243693","examNumber":9317,"slotIndex":39,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T04:22:37.281Z"},"options":["Diabetic ketoacidosis","Hyperglycemic hyperosmolar state","Acute pancreatitis","Gastroenteritis"]}$opa136$,
  $kya136$Diabetic ketoacidosis$kya136$,
  $exa136$The patient's presentation is consistent with diabetic ketoacidosis (DKA), characterized by hyperglycemia, metabolic acidosis (evidenced by low bicarbonate), and dehydration. The history of type 1 diabetes and the inability to keep food down contribute to the development of DKA. Hyperglycemic hyperosmolar state (HHS) is less likely due to the presence of acidosis and the patient's younger age. Acute pancreatitis could cause abdominal pain but is not supported by the lab findings. Gastroenteritis typically presents with diarrhea rather than isolated vomiting and dehydration. Understanding the pathophysiology of DKA is crucial for diagnosis and management, as it involves insulin deficiency and increased ketogenesis.

Clinical reasoning: Assess the patient's symptoms and lab results to identify the underlying condition. Analyze the vital signs and laboratory findings, particularly the elevated blood glucose and low bicarbonate levels, which indicate metabolic acidosis. Integrate this information with the patient's history of type 1 diabetes to arrive at the diagnosis of DKA.

Why other options are incorrect:
• Hyperglycemic hyperosmolar state: This condition typically presents with extreme hyperglycemia and dehydration but without significant acidosis, which is present in this case.
• Acute pancreatitis: While it can cause abdominal pain, it usually presents with elevated lipase and amylase levels, which are not mentioned here.
• Gastroenteritis: This condition usually presents with diarrhea and does not typically cause such severe hyperglycemia or acidosis.$exa136$,
  2,
  $dma136$reproductive-endocrine$dma136$,
  $tpa136$diabetic-ketoacidosis$tpa136$,
  $sua136$https://www.ncbi.nlm.nih.gov/books/NBK470282/$sua136$,
  $sla136$https://www.ncbi.nlm.nih.gov/books/NBK470282/$sla136$,
  $sqa136$According to the International Society for Pediatric and Adolescent Diabetes, DKA is defined by the presence of all of the following in a patient with diabetes:$sqa136$,
  $cha136$b4d1f9a747fa183c819b4cce6f0026fe6f665cb3fe8ecffece82f72df9289414$cha136$,
  true,
  $rfa136$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470282/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470282/"}]$rfa136$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida137$cmr99rfpl00xk1ywya8vyrdh8$ida137$,
  $fxa137$template_artifact|wrong_blueprint$fxa137$,
  NULL,
  $qua137$A 28-year-old woman comes to the clinic because of fever, chills, dysuria, and left flank pain for 3 days. She has recurrent urinary tract infections and takes nitrofurantoin daily for prophylaxis. She is not pregnant and is tolerating oral fluids. Her temperature is 38.3°C (101°F), blood pressure is 120/76 mm Hg, and heart rate is 94/min. There is left costovertebral angle tenderness. Urinalysis is positive for leukocyte esterase and nitrites. A urine culture with susceptibility testing has been sent. Local fluoroquinolone resistance among urinary pathogens is below 10%. Which of the following is the most appropriate management while awaiting culture results?$qua137$,
  $opa137${"options":["Stop nitrofurantoin and start oral ciprofloxacin","Intravenous fluids alone, without an antibiotic","Phenazopyridine alone for bladder discomfort","Double the nitrofurantoin dose"],"blueprintTopic":"acute-pyelonephritis","blueprintSystem":"respiratory-renal"}$opa137$,
  $kya137$Stop nitrofurantoin and start oral ciprofloxacin$kya137$,
  $exa137$Correct answer: A. Stop nitrofurantoin and start oral ciprofloxacin. Fever, flank pain and costovertebral angle tenderness indicate pyelonephritis that broke through nitrofurantoin, which does not reach adequate kidney tissue levels; with a culture already sent, local fluoroquinolone resistance below 10% and good oral intake, oral ciprofloxacin is appropriate outpatient therapy. Why the other options are wrong: B. Intravenous fluids do not treat the infection, and she is tolerating oral fluids. C. Phenazopyridine only relieves bladder discomfort and leaves the kidney infection untreated. D. Nitrofurantoin is unsuitable for pyelonephritis at any dose because it does not achieve adequate kidney tissue levels.$exa137$,
  4,
  $dma137$respiratory-renal$dma137$,
  $tpa137$acute-pyelonephritis$tpa137$,
  $sua137$https://www.merckmanuals.com/professional/genitourinary-disorders/urinary-tract-infections-utis/bacterial-urinary-tract-infections$sua137$,
  $sla137$https://www.merckmanuals.com/professional/genitourinary-disorders/urinary-tract-infections-utis/bacterial-urinary-tract-infections$sla137$,
  $sqa137$Ciprofloxacin 500 mg orally twice a day for 7 days or levofloxacin 750 mg orally once a day is an oral regimen for pyelonephritis.$sqa137$,
  $cha137$988aece0b92cf59788894aec094f60f45464999fdb551b854df375b6b8fbc859$cha137$,
  true,
  $rfa137$[{"label": "https://www.merckmanuals.com/professional/genitourinary-disorders/urinary-tract-infections-utis/bacterial-urinary-tract-infections", "url": "https://www.merckmanuals.com/professional/genitourinary-disorders/urinary-tract-infections-utis/bacterial-urinary-tract-infections"}]$rfa137$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida138$cmru8586q004p1yd6u29vhybi$ida138$,
  $fxa138$wrong_blueprint|difficulty$fxa138$,
  $sca138$A 60-year-old man presents to the clinic with worsening fatigue and jaundice over the past month. He has a history of alcohol use disorder and reports drinking heavily for the past 20 years. On examination, he has scleral icterus and hepatomegaly. Laboratory tests reveal elevated AST (120 U/L) and ALT (80 U/L), with a significantly elevated bilirubin level (total bilirubin 5.0 mg/dL).$sca138$,
  $qua138$What is the most likely diagnosis?$qua138$,
  $opa138${"kind":"ethics","stepLevel":"step3","blueprintSystem":"gastrointestinal","blueprintTopic":"alcoholic-hepatitis","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784611860346","examNumber":9302,"slotIndex":53,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-21T05:32:04.185Z"},"options":["Acute viral hepatitis","Chronic hepatitis C","Alcoholic hepatitis","Non-alcoholic fatty liver disease"]}$opa138$,
  $kya138$Alcoholic hepatitis$kya138$,
  $exa138$The correct answer is alcoholic hepatitis, which is characterized by jaundice, elevated liver enzymes, and a history of significant alcohol consumption. The patient's elevated AST and ALT levels, along with a total bilirubin of 5.0 mg/dL, support this diagnosis. Acute viral hepatitis would typically present with different enzyme patterns and a lack of significant alcohol history. Chronic hepatitis C usually has a more insidious onset and is often asymptomatic until advanced liver disease develops. Non-alcoholic fatty liver disease is less likely given the acute presentation and history of heavy alcohol use. 

Key takeaway: Alcoholic hepatitis can present acutely with jaundice and elevated liver enzymes in individuals with a history of significant alcohol intake. 

Memory hook: Remember the 'A's of alcoholic hepatitis: Alcohol history, AST > ALT, and Acute presentation.

Clinical reasoning: The patient's history of heavy alcohol use, along with the acute onset of jaundice and elevated liver enzymes, leads to the diagnosis of alcoholic hepatitis. Analyzing the clinical context and lab findings confirms this conclusion.

Why other options are incorrect:
• Acute viral hepatitis: Fails because it typically presents with different enzyme patterns and lacks a significant alcohol history.
• Chronic hepatitis C: Fails as it usually has a more insidious onset and is often asymptomatic until advanced disease.
• Non-alcoholic fatty liver disease: Fails because this condition is less likely given the acute presentation and significant alcohol use.$exa138$,
  3,
  $dma138$gastrointestinal$dma138$,
  $tpa138$alcoholic-hepatitis$tpa138$,
  $sua138$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$sua138$,
  $sla138$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease$sla138$,
  $sqa138$Elevations of aminotransferases are moderate (< 300 IU/L) and do not reflect the extent of liver damage.$sqa138$,
  $cha138$07557d1df05864524da276a6d61b4c92cd9e5c39f5e853f345b1e8cd556be35e$cha138$,
  true,
  $rfa138$[{"label": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$rfa138$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida139$cmruihp8h002w1ycelgaiewuc$ida139$,
  $fxa139$wrong_blueprint|difficulty$fxa139$,
  $sca139$A 28-year-old woman, G1P0, presents to the labor and delivery unit at 39 weeks of gestation with painful contractions that began 4 hours ago. She reports contractions occurring every 5 minutes and expresses a desire for a natural delivery. Her vital signs are stable, with a blood pressure of 118/76 mmHg, heart rate of 80 bpm, and temperature of 98.4°F.$sca139$,
  $qua139$What is the next best step in the management of this patient?$qua139$,
  $opa139${"options":["Perform a cervical examination","Administer intravenous analgesia","Order fetal ultrasound","Start oxytocin infusion"],"blueprintTopic":"labor-assessment","blueprintSystem":"reproductive-endocrine"}$opa139$,
  $kya139$Perform a cervical examination$kya139$,
  $exa139$In a term pregnant woman with regular contractions, the next step is to perform a cervical examination to assess cervical dilation and effacement. This evaluation is crucial to determine the stage of labor and guide further management, such as admission and pain management. Administering IV analgesia may be appropriate later but is not the immediate next step without assessing labor progress. Ordering a fetal ultrasound is unnecessary at this stage since the patient is in labor, and starting an oxytocin infusion is premature without knowing the cervical status.

Clinical reasoning: The patient is presenting with regular contractions at term, indicating she may be in labor. A cervical examination is essential to assess her progress and guide further management decisions.

Why other options are incorrect:
• Administer intravenous analgesia: While pain management is important, it should be based on the assessment of labor progress, which requires a cervical examination first.
• Order fetal ultrasound: A fetal ultrasound is not indicated at this point since the patient is already in labor and the fetal heart rate can be monitored continuously.
• Start oxytocin infusion: Starting oxytocin is not appropriate without first assessing cervical dilation and effacement to determine if augmentation of labor is necessary.$exa139$,
  2,
  $dma139$reproductive-endocrine$dma139$,
  $tpa139$labor-assessment$tpa139$,
  $sua139$https://www.ncbi.nlm.nih.gov/books/NBK544290/$sua139$,
  $sla139$https://www.ncbi.nlm.nih.gov/books/NBK544290/$sla139$,
  $sqa139$After ruling out placenta previa—via chart review or bedside ultrasound—and prelabor rupture of membranes, a sterile digital examination is typically performed to assess cervical dilation, effacement, and station.$sqa139$,
  $cha139$872190a51e4ba50c22f3dfa7071ddbfa211cb064321ec194b4a09fd18c01fc0f$cha139$,
  true,
  $rfa139$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK544290/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK544290/"}]$rfa139$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida140$cmrvwtu2b003l1ye8he45di2m$ida140$,
  $fxa140$wrong_blueprint|difficulty|rationale$fxa140$,
  $sca140$A 24-year-old male presents to the emergency department with a 2-hour history of severe right lower quadrant abdominal pain, accompanied by nausea and vomiting. On examination, he has a fever of 100.4°F, tachycardia with a heart rate of 110 bpm, and exhibits rebound tenderness and guarding in the right lower quadrant. His blood pressure is stable at 120/80 mmHg, and he is saturating 98% on room air.$sca140$,
  $qua140$What is the next best step in management for this patient?$qua140$,
  $opa140${"options":["Order abdominal ultrasound","Order CT abdomen/pelvis with contrast","Start intravenous fluids and analgesia","Consult surgery"],"blueprintTopic":"acute-appendicitis","blueprintSystem":"gastrointestinal"}$opa140$,
  $kya140$Order CT abdomen/pelvis with contrast$kya140$,
  $exa140$A stable adult with focal peritonitis and a story of appendicitis should have a CT of the abdomen and pelvis with intravenous contrast, which is highly accurate and can show perforation or abscess. Ultrasound is less sensitive in adults. Intravenous fluids and analgesia should be started while imaging is arranged; they do not establish the diagnosis, and the explanation should not say they must wait until after the scan. Surgical consultation follows confirmation in a patient whose blood pressure is normal.$exa140$,
  3,
  $dma140$gastrointestinal$dma140$,
  $tpa140$acute-appendicitis$tpa140$,
  $sua140$https://www.ncbi.nlm.nih.gov/books/NBK493193/$sua140$,
  $sla140$https://www.ncbi.nlm.nih.gov/books/NBK493193/$sla140$,
  $sqa140$An abdominopelvic CT scan with intravenous contrast demonstrates >95% accuracy in diagnosing acute appendicitis in adults.$sqa140$,
  $cha140$e448106115fe9dc61bed09c25c88da8a0f5606016507422f1240759adb0b745d$cha140$,
  true,
  $rfa140$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK493193/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK493193/"}]$rfa140$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida141$cmtpxc5tm00501ymuhqxxrriz$ida141$,
  $fxa141$wrong_blueprint|template_artifact$fxa141$,
  $sca141$A 65-year-old woman presents to the emergency department with shortness of breath and a cough productive of green sputum for the past two days. She has a history of COPD and is currently on tiotropium and albuterol. On examination, her respiratory rate is 24 breaths/min, oxygen saturation is 88% on room air, and she has bilateral wheezing. A chest X-ray shows hyperinflation but no infiltrates. Her laboratory results reveal a white blood cell count of 12,000/mm³ with a left shift.$sca141$,
  $qua141$What is the next best step in management?$qua141$,
  $opa141${"options":["Initiate systemic corticosteroids","Start intravenous antibiotics for this sputum","Administer nebulized bronchodilators","Provide supplemental oxygen"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"copd-exacerbation","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1788705790917","examNumber":9303,"slotIndex":18,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:44:46.626Z"}}$opa141$,
  $kya141$Administer nebulized bronchodilators$kya141$,
  $exa141$The correct answer is to administer nebulized bronchodilators, as this is the immediate step to relieve bronchospasm in a patient with COPD exacerbation. In this case, the patient is experiencing acute respiratory distress and wheezing, indicating bronchoconstriction. While systemic corticosteroids and antibiotics may be necessary later, they are not the immediate priority in this acute setting. Providing supplemental oxygen is important for hypoxemia but does not address the underlying bronchospasm. Therefore, the most appropriate initial management is to administer nebulized bronchodilators to improve airflow and relieve symptoms. According to the USMLE Step 2 CK Content Outline, effective management of acute exacerbations of COPD includes addressing bronchospasm promptly.

Clinical reasoning: The patient presents with acute respiratory distress due to COPD exacerbation. The key symptoms are wheezing and hypoxemia, which indicate bronchospasm. The next best step is to administer nebulized bronchodilators to relieve bronchospasm. After initial bronchodilation, further management may include corticosteroids and antibiotics if indicated.

Why other options are incorrect:
• Initiate systemic corticosteroids: While corticosteroids are important for reducing inflammation in COPD exacerbations, they are not the first step in acute management.
• Start intravenous antibiotics (give antibiotics through a vein): Antibiotics are indicated if there is evidence of bacterial infection, but the immediate management should focus on bronchodilation.
• Provide supplemental oxygen: Oxygen is critical for hypoxemia, but it does not alleviate bronchospasm, which is the primary issue in this acute exacerbation.$exa141$,
  3,
  $dma141$respiratory-renal$dma141$,
  $tpa141$copd-exacerbation$tpa141$,
  $sua141$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua141$,
  $sla141$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla141$,
  $sqa141$SABAs, with or without short-acting anticholinergics, are recommended as the initial bronchodilators to treat moderate/severe exacerbations.$sqa141$,
  $cha141$22de4855593907ae9e3c473906de4a5c856dad54a8a76b6d5575e13c8b330efc$cha141$,
  true,
  $rfa141$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa141$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida142$b10xaf941354e6eb740bdd7beeb8$ida142$,
  $fxa142$template_artifact|wrong_blueprint$fxa142$,
  $sca142$A 64-year-old patient has chest pain and ST depression in several leads. Troponin is rising. A classmate reaches for a thrombolytic because the pain and the troponin mean an occlusion. There is no ST elevation. He is within two hours of pain onset. The blood pressure is stable.$sca142$,
  $qua142$Why is a thrombolytic the wrong drug?$qua142$,
  $opa142${"options":["Pain within two hours makes lysis correct regardless of the tracing","A stable blood pressure means ST elevation is not required before lysis","No ST elevation means the occluding clot is already complete","Depression means flow remains, and lysis is for a fully occluded artery with elevation","A rising troponin with depression means the artery is fully closed"],"blueprintSystem":"cardiovascular"}$opa142$,
  $kya142$Depression means flow remains, and lysis is for a fully occluded artery with elevation$kya142$,
  $exa142$A thrombolytic is the wrong drug because the ST segments are depressed, so the artery is not fully closed. Depression means flow remains, and lysis is for a fully occluded artery with elevation. A rising troponin with depression means the artery is fully closed is partial flow and injury. Pain within two hours makes lysis correct regardless of the tracing does not. A stable pressure means elevation is not required for lysis is not the criterion. No ST elevation means the clot is complete means it is not complete.$exa142$,
  5,
  $dma142$cardiovascular$dma142$,
  $tpa142$acs-management$tpa142$,
  $sua142$https://www.ncbi.nlm.nih.gov/books/NBK513228/$sua142$,
  $sla142$https://www.ncbi.nlm.nih.gov/books/NBK513228/$sla142$,
  $sqa142$Fibrinolytic therapies should not be used in NSTEMI.$sqa142$,
  $cha142$8945134d5fec59e7fe755d7a1ae8ea0b5623bef8b69239fee62737529d212c42$cha142$,
  true,
  $rfa142$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK513228/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK513228/"}]$rfa142$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida143$b1x811514783cff9fe9e9e33672$ida143$,
  $fxa143$wrong_blueprint$fxa143$,
  $sca143$A 32-year-old woman at 38 weeks is in labor. A rectovaginal culture at 36 weeks grew group B streptococcus. She has no penicillin allergy. Membranes ruptured two hours ago. The tracing is reassuring and labor is progressing.$sca143$,
  $qua143$Which plan is the most appropriate next step?$qua143$,
  $opa143${"options":["Cesarean delivery for the culture","Antibiotics after the cord is clamped","Treat her partner and give her nothing","Clindamycin despite no allergy","Intravenous penicillin during labor"],"blueprintTopic":"group-b-streptococcus"}$opa143$,
  $kya143$Intravenous penicillin during labor$kya143$,
  $exa143$A positive group B streptococcus culture is treated with penicillin during labor, not by cesarean delivery for that result alone. Intravenous penicillin during labor is the CDC regimen when she has no allergy. Cesarean delivery for the culture does not replace intrapartum antibiotics and is not indicated by a reassuring tracing. Antibiotics after the cord is clamped miss the window that protects the newborn. Treat her partner and give her nothing does not prevent early-onset disease. Clindamycin despite no allergy is for a high-risk penicillin allergy.$exa143$,
  3,
  $dma143$reproductive-endocrine$dma143$,
  $tpa143$group-b-streptococcus$tpa143$,
  $sua143$https://www.cdc.gov/group-b-strep/hcp/clinical-overview/index.html$sua143$,
  $sla143$https://www.cdc.gov/group-b-strep/hcp/clinical-overview/index.html$sla143$,
  $sqa143$Early-onset GBS disease can be prevented through intrapartum antibiotic prophylaxis.$sqa143$,
  $cha143$3373bbf785af596aaabcae821da5f3d5168bfd7d05a43735f73eeafcbcd0cb8d$cha143$,
  true,
  $rfa143$[{"label": "https://www.cdc.gov/group-b-strep/hcp/clinical-overview/index.html", "url": "https://www.cdc.gov/group-b-strep/hcp/clinical-overview/index.html"}]$rfa143$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida144$b6x7f8ee272e8c71c765f445633$ida144$,
  $fxa144$wrong_blueprint|template_artifact$fxa144$,
  $sca144$A 55-year-old patient signs a form. The trainee who obtained it cannot name the main risk when the patient asks a minute later. The attending knows the risk and is not in the room. A classmate says the signature completes consent.$sca144$,
  $qua144$Why is the signature not consent?$qua144$,
  $opa144${"options":["Asking about the risk waives the need to explain it at all","A minute later is too late for the missing explanation to matter","The person who obtained it could not explain the risk the patient asked about","A signature is consent even if the risk was never understood","The attending's knowledge transfers without a conversation"],"blueprintTopic":"informed-consent","blueprintSystem":"social-sciences"}$opa144$,
  $kya144$The person who obtained it could not explain the risk the patient asked about$kya144$,
  $exa144$A signature is not consent when the person who obtained it cannot explain the main risk. The person who obtained it could not explain the risk the patient asked about. A signature is consent even if the risk was never understood is the classmate's view. The attending's knowledge transfers without a conversation does not reach the patient. Asking the question waives the risk is the moment the gap showed. A minute later is too late to matter is still the same consent conversation.$exa144$,
  4,
  $dma144$social-sciences$dma144$,
  $tpa144$informed-consent$tpa144$,
  $sua144$https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent$sua144$,
  $sla144$https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent$sla144$,
  $sqa144$Patients have the right to receive information and ask questions about recommended treatments so that they can make well-considered decisions about care.$sqa144$,
  $cha144$695e5f9af5415686f5703fe38bbc2659ef50caaf10a7e03a3992705a234fb333$cha144$,
  true,
  $rfa144$[{"label": "https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent", "url": "https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent"}]$rfa144$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida145$cmqxder6600as1ymaxmdguhdu$ida145$,
  $fxa145$rationale|difficulty$fxa145$,
  $sca145$A 5-year-old boy presents to the pediatric emergency department with a high fever of 39.5°C (103.1°F) for the past two days, along with a rash that began on his trunk and has spread to his extremities. His mother reports that he has been unusually irritable and has had a sore throat. On examination, he is alert, drinking fluids, and uncomfortable from the fever, and a maculopapular rash is noted. His vital signs show a heart rate of 120 beats per minute and a respiratory rate of 22 breaths per minute.$sca145$,
  $qua145$Which medication is most appropriate for this patient?$qua145$,
  $opa145${"options":["Ibuprofen","Acyclovir","Amoxicillin","Corticosteroids"],"distractorRationale":{"Acyclovir":"Acyclovir is used for herpes virus infections, not for viral exanthems like this case, making it an inappropriate choice.","Amoxicillin":"Amoxicillin is an antibiotic and would only be appropriate if there was a confirmed bacterial infection, which is not indicated here.","Corticosteroids":"Corticosteroids can suppress the immune response and are not indicated in viral infections, making this option incorrect."},"clinicalReasoning":"The child presents with fever and a rash, common in viral infections. Assessing the symptoms, the most appropriate management is symptomatic care. Analyzing the options, ibuprofen addresses the fever and discomfort effectively. Integrating this with the knowledge of viral infections, ibuprofen is the best choice.","keyTakeaways":["When managing fever in children with viral infections, prioritize symptomatic treatment like ibuprofen for comfort and recovery."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"pediatric-infections","blueprintSystem":"pediatrics","generationMeta":{"model":"gpt-4o-mini","batchId":"increment-step2-1782625221692","qcScore":8,"slotIndex":35,"stepLevel":"step2","examNumber":1692,"generatedAt":"2026-06-28T05:47:00.695Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$opa145$,
  $kya145$Ibuprofen$kya145$,
  $exa145$An alert child who is drinking, with a short fever and a maculopapular rash that started on the trunk, is managed as a viral exanthem. Ibuprofen reduces the fever and the discomfort. Acyclovir is for herpesvirus disease, and there are no vesicles. Amoxicillin is not indicated without a bacterial diagnosis. Corticosteroids are not indicated for an uncomplicated viral exanthem; they are not broadly contraindicated in every viral illness.$exa145$,
  2,
  $dma145$human-development$dma145$,
  $tpa145$pediatric-infections$tpa145$,
  $sua145$https://medlineplus.gov/druginfo/meds/a682159.html$sua145$,
  $sla145$https://medlineplus.gov/druginfo/meds/a682159.html$sla145$,
  $sqa145$Nonprescription ibuprofen is used to reduce fever and to relieve minor aches and pain from headaches, muscle aches, arthritis, menstrual periods, the common cold, toothaches, and backaches.$sqa145$,
  $cha145$7323cc0ffefadc1154bd7cd0f9bb3c5312d920115aff78f5af53f5f75bf828c8$cha145$,
  true,
  $rfa145$[{"label": "https://medlineplus.gov/druginfo/meds/a682159.html", "url": "https://medlineplus.gov/druginfo/meds/a682159.html"}]$rfa145$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida146$cmr4hayu5003f1ydeoga7zdxw$ida146$,
  $fxa146$wrong_blueprint|template_artifact|difficulty$fxa146$,
  $sca146$A 4-year-old boy presents to the pediatric clinic with a 3-day history of fever, cough, and a runny nose. His mother reports that he has been increasingly irritable and has had difficulty sleeping. On examination, his temperature is 101.5°F (38.6°C), respiratory rate is 24 breaths per minute, and he has bilateral wheezing on auscultation. A rapid antigen test for influenza is negative. He received nebulized albuterol an hour ago with little relief, he is using accessory muscles, and his oxygen saturation is 91% on room air.$sca146$,
  $qua146$Which of the following is the most appropriate management?$qua146$,
  $opa146${"options":["Prescribe a short course of oral corticosteroids","Instruct the mother to use a humidifier at home","Order a chest X-ray to rule out pneumonia","Start a course of oral amoxicillin"],"kind":"lab_interpretation","taskCategory":"clinical-intervention","blueprintTopic":"pediatric-asthma-exacerbation","blueprintSystem":"pediatrics","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783054993154","qcScore":8.2,"slotIndex":5,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-03T05:06:16.241Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$opa146$,
  $kya146$Prescribe a short course of oral corticosteroids$kya146$,
  $exa146$Why this answer is correct
Prescribing a short course of oral corticosteroids is the best management for this child's wheezing.
Corticosteroids reduce airway inflammation, improving breathing.
The child likely has an exacerbation of asthma or reactive airway disease.
Wheezing in young children often indicates inflammation, not just infection.
In practice: On the unit, this means promptly addressing airway inflammation can prevent further respiratory distress and improve the child's comfort and recovery.
Why the other options are wrong

Instruct the mother to use a humidifier at home
Trap: Students may think humidifiers help with respiratory symptoms.
Why it fails here: While humidifiers can provide comfort, they do not address the underlying inflammation causing wheezing.
Remember: This option fails to manage the core issue of airway inflammation.

Order a chest X-ray to rule out pneumonia
Trap: There is a tendency to order imaging for respiratory symptoms.
Why it fails here: The clinical presentation suggests a viral illness rather than pneumonia, making a chest X-ray unnecessary at this stage.
Remember: This distractor reflects a common error of over-investigating when clinical signs point elsewhere.

Start a course of amoxicillin (a penicillin antibiotic)
Trap: Students might assume antibiotics are needed for respiratory infections.
Why it fails here: Antibiotics like amoxicillin are ineffective against viral infections and this child shows no signs of a bacterial infection.
Remember: This option highlights the misconception that all respiratory symptoms require antibiotic treatment.
Key takeaway
When you see wheezing in a child, think corticosteroids first to reduce inflammation.

Memory hook: Remember: 'Wheeze' needs 'ease' — corticosteroids help!$exa146$,
  3,
  $dma146$human-development$dma146$,
  $tpa146$pediatric-asthma-exacerbation$tpa146$,
  $sua146$https://www.ncbi.nlm.nih.gov/books/NBK551631/$sua146$,
  $sla146$https://www.ncbi.nlm.nih.gov/books/NBK551631/$sla146$,
  $sqa146$As with outpatient therapy, clinicians should administer glucocorticoids promptly to children with moderate-to-severe asthma exacerbations, as their early administration reduces hospital admission rates.$sqa146$,
  $cha146$a81451025208af8a14ec75039d5d93cc7149f94343aac6b6289f5f5872cf13f2$cha146$,
  true,
  $rfa146$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK551631/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK551631/"}]$rfa146$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida147$cmr87izyi00gi1yr9esbabivh$ida147$,
  $fxa147$rationale$fxa147$,
  $sca147$A 62-year-old woman with a history of chronic obstructive pulmonary disease (COPD) presents to the emergency department with worsening shortness of breath over the past two days. She reports increased sputum production that is yellow-green in color and has a fever of 38.3°C (100.9°F). On examination, her respiratory rate is 28 breaths per minute, and oxygen saturation is 88% on room air. A chest X-ray shows no signs of pneumonia.$sca147$,
  $qua147$What is the most appropriate initial management?$qua147$,
  $opa147${"options":["Intravenous corticosteroids","Oral antibiotics","Nebulized albuterol","Non-invasive positive pressure ventilation"],"distractorRationale":{"Intravenous corticosteroids":"This option is incorrect as corticosteroids are typically used after initial bronchodilator therapy, especially if the patient does not improve.","Oral antibiotics":"This option is incorrect because antibiotics are not indicated unless there is evidence of a bacterial infection, which is not the case here.","Non-invasive positive pressure ventilation":"This option is incorrect as it is reserved for patients in respiratory failure, and this patient has not yet reached that stage."},"clinicalReasoning":"Assess the patient's symptoms, including increased sputum production and fever, which suggest an exacerbation of COPD. Analyze the need for immediate bronchodilation to relieve symptoms and integrate the understanding that nebulized albuterol is the first-line treatment for acute exacerbations.","keyTakeaways":["When managing acute COPD exacerbations, prioritize bronchodilation with nebulized albuterol first."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"copd-asthma-exacerbation","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783280577288","qcScore":8.1,"slotIndex":12,"stepLevel":"step2","examNumber":9206,"generatedAt":"2026-07-05T19:45:31.911Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$opa147$,
  $kya147$Nebulized albuterol$kya147$,
  $exa147$Nebulized short-acting bronchodilator is the initial treatment of a COPD exacerbation with wheeze. Oxygen is titrated to 88% to 92%; she is already at 88%. Systemic corticosteroids are given for a moderate or severe exacerbation, but they are not ahead of the bronchodilator. Yellow-green sputum, increased dyspnea, and fever are a reason to give antibiotics, usually by mouth if she can swallow. The chest radiograph shows no pneumonia, so antibiotics treat the purulent exacerbation rather than a new infiltrate. Noninvasive ventilation is for respiratory acidosis or tiring, which is not shown.$exa147$,
  4,
  $dma147$respiratory-renal$dma147$,
  $tpa147$copd-asthma-exacerbation$tpa147$,
  $sua147$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sua147$,
  $sla147$https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf$sla147$,
  $sqa147$Antibiotics are recommended for a total of 5 days in patients with purulent sputum, prior history of lung infections, etc.$sqa147$,
  $cha147$410ffc3087d05ce23957b7d8e04c1b8745680a4866e35e725e7cbed845266b7c$cha147$,
  true,
  $rfa147$[{"label": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/01/GOLD-Pocket-Guide-2026-v1.1-20Nov2025_WMV2.pdf"}]$rfa147$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida148$cmra6lzf5003ric045lsu60kz$ida148$,
  $fxa148$rationale$fxa148$,
  $sca148$A 6-year-old boy is brought to the clinic because of increasing fatigue and swelling in his legs over the past week. He has had no recent infection. Urinalysis shows 4.2 g/day of protein with a bland sediment, and an antinuclear antibody test is negative. Examination shows bilateral leg edema and normal vital signs.$sca148$,
  $qua148$What is the most likely diagnosis?$qua148$,
  $opa148${"options":["Minimal change disease","IgA nephropathy","Post-streptococcal glomerulonephritis","Renal artery stenosis"],"distractorRationale":{"IgA nephropathy":"However, IgA nephropathy typically presents with **hematuria** (blood in urine) and is less likely to cause nephrotic-range proteinuria without hematuria, which this patient does not have. (This highlights the importance of differentiating between nephrotic and nephritic syndromes based on urine findings.)","Post-streptococcal glomerulonephritis":"Post-streptococcal glomerulonephritis usually follows a **streptococcal infection** and presents with **hematuria** and **hypertension**, neither of which are present here. (Understanding the typical presentation of post-infectious glomerulonephritis is key to accurate diagnosis.)","Renal artery stenosis":"Renal artery stenosis typically presents with **hypertension** and may lead to renal insufficiency, which are not evident in this patient. (Recognizing that renal artery stenosis is associated with hypertension helps differentiate it from nephrotic syndrome.)"},"clinicalReasoning":"The most likely diagnosis is minimal change disease due to nephrotic-range proteinuria and a bland urine sediment. **Nephrotic syndrome** is characterized by significant proteinuria, typically greater than 3.5 g/day. A **bland urine sediment** indicates the absence of inflammatory cells or casts, supporting minimal change disease.","keyTakeaways":["When you see nephrotic-range proteinuria with a bland urine sediment, think minimal change disease first."],"blueprintTopic":"nephrotic-nephritic","blueprintSystem":"internal-medicine"}$opa148$,
  $kya148$Minimal change disease$kya148$,
  $exa148$Sudden nephrotic-range proteinuria, a non-nephritic sediment, normal blood pressure, and edema in a child are the usual presentation of minimal change disease, which causes most childhood nephrotic syndrome. IgA nephropathy and post-streptococcal glomerulonephritis are nephritic patterns with hematuria. Renal artery stenosis presents with hypertension, which he does not have. In an adult, membranous nephropathy and focal segmental glomerulosclerosis are more common, so this vignette is a child.$exa148$,
  4,
  $dma148$respiratory-renal$dma148$,
  $tpa148$nephrotic-nephritic$tpa148$,
  $sua148$https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/minimal-change-disease$sua148$,
  $sla148$https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/minimal-change-disease$sla148$,
  $sqa148$Minimal change disease is the most common cause of nephrotic syndrome in children > 1 year of age (70 to 90% of childhood nephrotic syndrome), but it also occurs in adults (15% of adult nephrotic syndrome).$sqa148$,
  $cha148$9163409f6e2b3641739db9f96dc6ea26bbfae8825b108eae972e45ec35ada754$cha148$,
  true,
  $rfa148$[{"label": "https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/minimal-change-disease", "url": "https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/minimal-change-disease"}]$rfa148$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida149$cmrqhnxof004r1ypxeoo9w37z$ida149$,
  $fxa149$wrong_key|rationale|template_artifact$fxa149$,
  $sca149$A 28-year-old woman visits the emergency department because of 8 months of excessive worry about work, her health, and her family on most days. She cannot control the worry. She reports restlessness, difficulty concentrating, disrupted sleep, and daytime fatigue. Her vital signs are stable, and she has no significant past medical history or current medications. She describes no panic attacks and no recent life stressor.$sca149$,
  $qua149$What is the most likely diagnosis for this patient?$qua149$,
  $opa149${"options":["Generalized Anxiety Disorder","Major Depressive Disorder","Adjustment disorder after an identifiable stressor","Panic disorder with recurrent unexpected attacks"],"taskCategory":"interpretation","blueprintTopic":"anxiety-disorders","blueprintSystem":"psychiatry","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784386139864","qcScore":7.9,"slotIndex":13,"stepLevel":"step2","examNumber":9203,"generatedAt":"2026-07-18T14:51:13.301Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa149$,
  $kya149$Generalized Anxiety Disorder$kya149$,
  $exa149$Generalized anxiety disorder is excessive, hard-to-control worry about several areas of life on more days than not for at least 6 months, plus symptoms such as restlessness, poor concentration, fatigue, and poor sleep. This history is 8 months and has no panic attacks, no identifiable stressor, and no low mood or anhedonia. Major depression, adjustment disorder, and panic disorder are therefore not the diagnosis.$exa149$,
  2,
  $dma149$behavioral-nervous$dma149$,
  $tpa149$anxiety-disorders$tpa149$,
  $sua149$https://www.nimh.nih.gov/health/statistics/generalized-anxiety-disorder$sua149$,
  $sla149$https://www.nimh.nih.gov/health/statistics/generalized-anxiety-disorder$sla149$,
  $sqa149$Generalized anxiety disorder is characterized by excessive anxiety and worry about a variety of events or activities (e.g., work or school performance) that occurs more days than not, for at least 6 months.$sqa149$,
  $cha149$48b89769cb8c60b29fc1297f85b61bbc7ca6f3a504a8c4b997ea8aa23fed265c$cha149$,
  true,
  $rfa149$[{"label": "https://www.nimh.nih.gov/health/statistics/generalized-anxiety-disorder", "url": "https://www.nimh.nih.gov/health/statistics/generalized-anxiety-disorder"}]$rfa149$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida150$cmrtq0tnf00161yqcwaxsnmsj$ida150$,
  $fxa150$wrong_blueprint|template_artifact|rationale$fxa150$,
  $sca150$A 62-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of hypertension and hyperlipidemia, and she takes lisinopril and atorvastatin. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she has tenderness in the right upper quadrant. Laboratory tests reveal an elevated white blood cell count of 15,000/mm³ and liver function tests showing an AST of 120 U/L and ALT of 150 U/L. An abdominal ultrasound shows gallstones and a thickened gallbladder wall.$sca150$,
  $qua150$What is the most appropriate next step in management?$qua150$,
  $opa150${"options":["Start intravenous fluids and initiate broad-spectrum antibiotics","Perform an urgent cholecystectomy","Administer pain management with morphine","Obtain a CT scan of the abdomen before starting treatment"],"kind":"calculation","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"acute-cholecystitis","physicianTask":"professionalism","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9501,"slotIndex":18,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-20T21:08:46.124Z"}}$opa150$,
  $kya150$Start intravenous fluids and initiate broad-spectrum antibiotics$kya150$,
  $exa150$Blood pressure 90/60 mm Hg and heart rate 110 beats per minute mean she needs intravenous fluids now. Acute cholecystitis also needs prompt antibiotics that cover gram-negative rods and anaerobes. Cholecystectomy is the definitive treatment after she is resuscitated, not while she is hypotensive. Morphine may be given for pain; it is not the step that treats shock or infection, and it does not hide an ultrasound diagnosis that is already made. Another CT scan is unnecessary after an ultrasound that shows stones and a thickened gallbladder wall.$exa150$,
  5,
  $dma150$gastrointestinal$dma150$,
  $tpa150$acute-cholecystitis$tpa150$,
  $sua150$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua150$,
  $sla150$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla150$,
  $sqa150$Initial management of acute cholecystitis typically involves intravenous fluid resuscitation and prompt initiation of broad-spectrum antibiotics effective against gram-negative rods and anaerobes.$sqa150$,
  $cha150$d4a163bf81ad061fdf4a1e3ebb783570c6e6ed6281e08b0678c0789ec37743d8$cha150$,
  true,
  $rfa150$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa150$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida151$cmtpvxz6h000g1ylcpu70zerx$ida151$,
  $fxa151$not_single_best|rationale$fxa151$,
  $sca151$A 45-year-old man with a history of HIV presents to the emergency department with a fever of 39.0°C (102.2°F), cough, and shortness of breath for the past three days. He has lost 5 kg (11 lbs) in the last month and reports night sweats. On examination, his respiratory rate is 24 breaths/min, and he has decreased breath sounds on the left side. A chest X-ray shows a left-sided pleural effusion. His CD4 count is 150 cells/mm³.$sca151$,
  $qua151$Which of the following is the most appropriate diagnostic next step?$qua151$,
  $opa151${"options":["Perform a thoracentesis","Start empiric broad-spectrum antibiotics","Initiate antiretroviral therapy","Obtain a sputum culture"],"distractorRationale":{"Start empiric broad-spectrum antibiotics":"This option fails because antibiotics should not be started until the etiology of the pleural effusion is determined.","Initiate antiretroviral therapy":"While important for long-term management, starting ART is not the immediate priority in this acute presentation.","Obtain a sputum culture":"This option is less relevant in this case since the pleural effusion needs to be addressed first to determine its cause."},"clinicalReasoning":"In this case, the patient's symptoms and history suggest a possible opportunistic infection or malignancy related to his HIV status. The presence of a pleural effusion necessitates a thoracentesis to both relieve symptoms and obtain diagnostic fluid for analysis, which is critical in managing patients with compromised immune systems.","kind":"vignette","stepLevel":"step2","blueprintSystem":"blood-lymph-immune","blueprintTopic":"hiv-opportunistic","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788703290753","examNumber":9201,"slotIndex":16,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:05:07.010Z"}}$opa151$,
  $kya151$Perform a thoracentesis$kya151$,
  $exa151$A new pleural effusion in a febrile patient with HIV and a CD4 count of 150 cells/mm3 must be sampled. Thoracentesis distinguishes infection, including tuberculosis, from malignancy and relieves the fluid. Antibiotics are started promptly when infection is suspected; they do not answer the diagnostic question and they should not be delayed until the fluid studies return. Antiretroviral therapy is important soon, but it is not the test for this effusion. Sputum culture is less direct than pleural fluid.$exa151$,
  3,
  $dma151$blood-lymph-immune$dma151$,
  $tpa151$hiv-opportunistic$tpa151$,
  $sua151$https://www.ncbi.nlm.nih.gov/books/NBK441866/$sua151$,
  $sla151$https://www.ncbi.nlm.nih.gov/books/NBK441866/$sla151$,
  $sqa151$Suspected infection: In pleural infections, such as empyema or TB, thoracentesis aids in identifying pathogens through culture and Gram staining of pleural fluid.$sqa151$,
  $cha151$7e9fefc9e8ce616c7b32633e68dd0255159f873ebb3d27e40ec7e29407321f43$cha151$,
  true,
  $rfa151$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK441866/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441866/"}]$rfa151$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida152$b5x0e8336d5ea7d253ffabf11b1$ida152$,
  $fxa152$wrong_blueprint$fxa152$,
  $sca152$A 44-year-old man has a blood pressure of 170/100 mm Hg, a potassium of 3.0 mEq/L, and a high aldosterone. Renin is low. He is not on a diuretic. A colleague says low potassium should have raised renin.$sca152$,
  $qua152$Why is renin low?$qua152$,
  $opa152${"options":["Aldosterone and renin rise together in a primary adrenal tumor","A diuretic is required for this pattern","Pressure of 170/100 mm Hg stimulates renin","The extra volume and pressure are suppressing it","Low potassium directly raises renin"],"blueprintTopic":"primary-aldosteronism","blueprintSystem":"reproductive-endocrine"}$opa152$,
  $kya152$The extra volume and pressure are suppressing it$kya152$,
  $exa152$Primary aldosteronism expands volume and raises pressure, so renin falls even though potassium is low. The extra volume and pressure are suppressing it. Low potassium directly raises renin is not what happened. Aldosterone and renin rise together in a primary adrenal tumor describes secondary aldosteronism. A diuretic is required for this pattern is excluded. Pressure of 170/100 mm Hg stimulates renin is the opposite of the feedback.$exa152$,
  4,
  $dma152$reproductive-endocrine$dma152$,
  $tpa152$primary-aldosteronism$tpa152$,
  $sua152$https://www.ncbi.nlm.nih.gov/books/NBK499983/$sua152$,
  $sla152$https://www.ncbi.nlm.nih.gov/books/NBK499983/$sla152$,
  $sqa152$Autonomous aldosterone production lowers plasma renin, resulting in a high aldosterone-to-renin ratio and low serum renin levels.$sqa152$,
  $cha152$e0458ee974ffaf106ddec3fb6f81e3e301b6f4ae27118aad34c2985c6c097503$cha152$,
  true,
  $rfa152$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499983/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499983/"}]$rfa152$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida153$b8x2ef388fa8398f78163783f88$ida153$,
  $fxa153$rationale|template_artifact|difficulty$fxa153$,
  $sca153$A 46-year-old patient on lithium is prescribed a thiazide. A week later the lithium level is toxic and he is tremulous. He looks volume depleted. The lithium dose was not changed. A classmate expected the thiazide to lower lithium the way it lowers sodium in the urine at the distal tubule.$sca153$,
  $qua153$Why did lithium rise when the dose did not?$qua153$,
  $opa153${"options":["A thiazide blocks proximal tubular reabsorption of lithium","Volume depletion increases lithium excretion","Tremor means the level fell","An unchanged lithium dose means the level cannot change","Proximal reabsorption of lithium increased once the volume fell"]}$opa153$,
  $kya153$Proximal reabsorption of lithium increased once the volume fell$kya153$,
  $exa153$Thiazides inhibit the distal sodium-chloride cotransporter. The natriuresis contracts volume, and the proximal tubule then reabsorbs more sodium and lithium together, so the serum lithium level rises although the dose was not changed. Tremor is a toxic effect of a high level. An unchanged dose does not freeze the level when clearance falls.$exa153$,
  3,
  $dma153$multisystem$dma153$,
  $tpa153$emergency-management$tpa153$,
  $sua153$https://www.ncbi.nlm.nih.gov/books/NBK519062/$sua153$,
  $sla153$https://www.ncbi.nlm.nih.gov/books/NBK519062/$sla153$,
  $sqa153$Concurrent administration of diuretics, particularly thiazide, non-steroidal anti-inflammatory drugs, renin-angiotensin system antagonists, or metronidazole can elevate serum lithium concentrations.$sqa153$,
  $cha153$42db1f1963443ccc7e624cc06885eefe0d7cd19532c340ba282c0f32f9ad1652$cha153$,
  true,
  $rfa153$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK519062/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK519062/"}]$rfa153$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida154$cmqgt4rhq00091y0q52ddvtpd$ida154$,
  $fxa154$not_single_best|template_artifact$fxa154$,
  $sca154$A 28-year-old woman presents to the clinic with complaints of irregular menstrual cycles and difficulty conceiving for the past year. She has a history of obesity and acne. On examination, her blood pressure is 130/85 mm Hg, and she has hirsutism. Laboratory tests reveal elevated serum testosterone levels and an ultrasound shows multiple ovarian cysts.$sca154$,
  $qua154$Which pathophysiologic process best explains these findings?$qua154$,
  $opa154${"kind":"image_based","stepLevel":"step1","blueprintSystem":"reproductive-endocrine","blueprintTopic":"contraception-pharmacology","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-full-2026-06-16-gsuro9","qcScore":8.1,"slotIndex":9,"stepLevel":"step1","examNumber":1,"generatedAt":"2026-06-16T15:25:59.235Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["A prolactin-secreting pituitary macroadenoma","Insulin resistance driving ovarian androgen production","Primary ovarian failure with markedly high FSH","Ovarian hyperthecosis as a postmenopausal disease"],"taskCategory":"pharmacotherapy"}$opa154$,
  $kya154$Insulin resistance driving ovarian androgen production$kya154$,
  $exa154$Obesity, acne, hirsutism, elevated testosterone, irregular cycles, and polycystic ovaries are the insulin-resistant form of polycystic ovary syndrome. Hyperinsulinemia augments ovarian androgen production. A prolactinoma would suppress gonadal function without this androgen picture. Primary ovarian failure raises FSH and does not produce ovarian androgen excess. Ovarian hyperthecosis is an uncommon, usually postmenopausal cause of severe virilization, not this presentation.$exa154$,
  4,
  $dma154$reproductive-endocrine$dma154$,
  $tpa154$contraception-pharmacology$tpa154$,
  $sua154$https://www.ncbi.nlm.nih.gov/books/NBK459251/$sua154$,
  $sla154$https://www.ncbi.nlm.nih.gov/books/NBK459251/$sla154$,
  $sqa154$LH excess is common and necessary for the expression of gonadal steroidogenic enzymes and sex hormone secretion, but is less likely to be the primary cause of ovarian androgen excess due to LH-induced desensitization of theca cells.$sqa154$,
  $cha154$35110a94d5fb37f7d17a542746e2505f314a76262ffb3beece636b05a4e73e57$cha154$,
  true,
  $rfa154$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459251/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459251/"}]$rfa154$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida155$cmr8ayr7700wk1yw2a6vinvin$ida155$,
  $fxa155$wrong_key|rationale$fxa155$,
  $sca155$A 67-year-old woman presents to the emergency department with sudden onset right-sided weakness and slurred speech. Her medical history includes hypertension and hyperlipidemia. On examination, her blood pressure is 180/100 mm Hg, and she has a right-sided hemiparesis with facial droop. A non-contrast CT scan of the head shows no acute hemorrhage. Her NIH Stroke Scale score is 12.$sca155$,
  $qua155$Which of the following best explains the patient's finding?$qua155$,
  $opa155${"options":["Embolic occlusion of the left middle cerebral artery","Thrombotic occlusion of the left anterior cerebral artery","Hypoperfusion from systemic hypotension","Cerebral venous sinus thrombosis"],"kind":"calculation","taskCategory":"interpretation","blueprintTopic":"stroke-localization","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783285915604","qcScore":8,"slotIndex":21,"stepLevel":"step1","examNumber":9111,"generatedAt":"2026-07-05T21:16:00.412Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"interpretation"}$opa155$,
  $kya155$Embolic occlusion of the left middle cerebral artery$kya155$,
  $exa155$Right face and arm weakness is contralateral to a left middle-cerebral-artery lesion. Sudden onset favors embolism. A left anterior-cerebral-artery infarct weakens the leg more than the face and arm. The blood pressure is 180/100 mm Hg, so systemic hypoperfusion is not the mechanism. Cerebral venous thrombosis more often causes headache and signs of raised pressure than this arterial syndrome.$exa155$,
  2,
  $dma155$behavioral-nervous$dma155$,
  $tpa155$stroke-localization$tpa155$,
  $sua155$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sua155$,
  $sla155$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sla155$,
  $sqa155$MCA infarctions classically present with contralateral hemiparesis, facial paralysis, and sensory loss in the face and upper extremities.$sqa155$,
  $cha155$47962c7c77d4ac5dbfcc4f9a06c6f383e4eba993702c7ce93bd5803617ca7628$cha155$,
  true,
  $rfa155$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499997/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$rfa155$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida156$cmr8clr3n019l1yw2k0y96tou$ida156$,
  $fxa156$wrong_blueprint$fxa156$,
  $sca156$A 70-year-old man presents with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg. A CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory.$sca156$,
  $qua156$What is the most likely underlying mechanism for this patient's stroke?$qua156$,
  $opa156${"options":["Embolism from carotid artery stenosis","Thrombosis due to atherosclerosis","Hypoperfusion from systemic hypotension","Venous sinus thrombosis"],"distractorRationale":{"Thrombosis due to atherosclerosis":"This option is incorrect as the acute presentation is more consistent with an embolic event rather than a gradual thrombotic process.","Hypoperfusion from systemic hypotension":"This option fails because systemic hypotension would not typically cause focal neurological deficits as seen here.","Venous sinus thrombosis":"This option is misleading; venous sinus thrombosis is less common and would present with different symptoms."},"clinicalReasoning":"The clinical presentation and imaging findings suggest an embolic stroke, likely originating from carotid artery stenosis, leading to ischemia in the left middle cerebral artery territory.","keyTakeaways":["When evaluating a stroke, prioritize embolism from carotid artery stenosis in cases of acute focal neurological deficits."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"stroke-mechanism","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783289207787","qcScore":8.1,"slotIndex":35,"stepLevel":"step1","examNumber":9115,"generatedAt":"2026-07-05T22:07:43.361Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$opa156$,
  $kya156$Embolism from carotid artery stenosis$kya156$,
  $exa156$Why this answer is correct
The most likely underlying mechanism for this patient's stroke is embolism from carotid artery stenosis.
Embolism is a sudden blockage caused by a traveling clot, often from the carotid arteries.
The left middle cerebral artery supplies critical areas of the brain; blockage here leads to right-sided weakness and speech issues.
The acute onset of symptoms aligns with an embolic stroke rather than a gradual process.
In practice: In practice, recognizing embolic strokes can lead to timely interventions, such as anticoagulation or surgical management of carotid stenosis, to prevent further strokes.
Why the other options are wrong

Thrombosis due to atherosclerosis
Trap: Students may think that atherosclerosis always leads to thrombosis, which can be gradual.
Why it fails here: While atherosclerosis can cause thrombosis, the acute nature of this patient's symptoms suggests an embolic event rather than a slow thrombotic process.
Remember: Understanding the difference between embolism and thrombosis is crucial for diagnosing stroke types.

Hypoperfusion from systemic hypotension
Trap: Some may confuse systemic hypotension with ischemic stroke mechanisms.
Why it fails here: Systemic hypotension typically causes diffuse cerebral hypoperfusion, leading to more generalized symptoms rather than focal neurological deficits like those seen here.
Remember: Recognizing the specific symptoms of focal ischemia helps differentiate between stroke types.

Venous sinus thrombosis
Trap: Students might consider venous sinus thrombosis as a common cause of stroke in older adults.
Why it fails here: Venous sinus thrombosis is rare in this age group and usually presents with different symptoms, such as headache or altered consciousness, rather than acute focal deficits.
Remember: Familiarity with the typical presentations of different stroke types aids in accurate diagnosis.
Key takeaway
When evaluating a stroke, prioritize embolism from carotid artery stenosis in cases of acute focal neurological deficits.

Memory hook: Think 'carotid clots cause quick strokes' to remember the link between carotid artery stenosis and embolic strokes.$exa156$,
  4,
  $dma156$behavioral-nervous$dma156$,
  $tpa156$stroke-mechanism$tpa156$,
  $sua156$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sua156$,
  $sla156$https://www.ncbi.nlm.nih.gov/books/NBK499997/$sla156$,
  $sqa156$MCA infarctions classically present with contralateral hemiparesis, facial paralysis, and sensory loss in the face and upper extremities.$sqa156$,
  $cha156$2ecd11fc7f7e33c8188f4632be8455ea2e02bab75100c95d569708c28084dd54$cha156$,
  true,
  $rfa156$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK499997/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$rfa156$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida157$cmrpvdr3n002l1yncvg2a1m0c$ida157$,
  $fxa157$difficulty$fxa157$,
  $sca157$A 58-year-old man presents to the emergency department with shortness of breath and chest pain that started 30 minutes ago. His vital signs are BP 142/88 mm Hg, heart rate 110 bpm, and respiratory rate 24 breaths/min. An ECG shows ST-segment elevation in leads II, III, and aVF. He has a history of hypertension and hyperlipidemia but is not currently on any medications.$sca157$,
  $qua157$What is the most likely diagnosis?$qua157$,
  $opa157${"options":["Acute inferior ST-elevation myocardial infarction","Unstable angina","Pulmonary embolism (a clot in a pulmonary artery)","Aortic dissection"],"distractorRationale":{"Unstable angina":"Unstable angina may present with chest pain but does not show ST-segment elevation, making it less likely in this scenario.","Pulmonary embolism (a clot in a pulmonary artery)":"Pulmonary embolism (a clot in a pulmonary artery) typically presents with sudden dyspnea and pleuritic pain, not ST-segment elevation.","Aortic dissection":"Aortic dissection usually presents with severe, tearing chest pain and may show different ECG changes, not ST-segment elevation."},"clinicalReasoning":"The patient's symptoms and ECG findings indicate an acute inferior STEMI due to coronary artery occlusion. Recognizing the specific leads involved helps confirm the diagnosis.","keyTakeaways":["When you see ST-segment elevation in specific leads, think acute myocardial infarction first."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"emergency-acls","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784348853328","qcScore":8,"slotIndex":17,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:29:37.903Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$opa157$,
  $kya157$Acute inferior ST-elevation myocardial infarction$kya157$,
  $exa157$Why this answer is correct
The patient's presentation and ECG findings confirm an acute inferior STEMI.
ST-segment elevation in leads II, III, and aVF indicates myocardial injury in the inferior wall of the heart.
This condition is typically caused by occlusion of the right coronary artery due to plaque rupture.
Symptoms like chest pain and shortness of breath align with acute myocardial infarction.
In practice: In practice, recognizing ST-segment elevation on an ECG is crucial for timely intervention in patients with suspected myocardial infarction. This can significantly improve outcomes.
Why the other options are wrong

Unstable angina
Trap: Students may confuse unstable angina with STEMI due to similar symptoms.
Why it fails here: Unstable angina does not cause ST-segment elevation; it may show ST-segment depression or be normal, indicating no myocardial injury.
Remember: Understanding the difference between unstable angina and STEMI is essential for accurate diagnosis and treatment.

Pulmonary embolism (a clot in a pulmonary artery)
Trap: Some may think pulmonary embolism is a likely cause of chest pain and shortness of breath.
Why it fails here: While pulmonary embolism can cause similar symptoms, it typically presents with sudden onset dyspnea, pleuritic chest pain, and does not show ST-segment elevation on ECG.
Remember: Recognizing the specific ECG changes associated with myocardial infarction helps differentiate it from other conditions like pulmonary embolism.

Aortic dissection
Trap: Students might consider aortic dissection due to the acute chest pain presentation.
Why it fails here: Aortic dissection usually presents with tearing chest pain and may show different ECG changes, such as ST-segment changes that do not localize to specific coronary territories.
Remember: Differentiating aortic dissection from myocardial infarction is critical due to the distinct management strategies required for each condition.
Key takeaway
When you see ST-segment elevation in specific leads, think acute myocardial infarction first.

Memory hook: Remember 'Inferior leads for inferior STEMI' to connect the ECG findings to the diagnosis.$exa157$,
  2,
  $dma157$cardiovascular$dma157$,
  $tpa157$emergency-acls$tpa157$,
  $sua157$https://www.ncbi.nlm.nih.gov/books/NBK470572/$sua157$,
  $sla157$https://www.ncbi.nlm.nih.gov/books/NBK470572/$sla157$,
  $sqa157$Inferior MI is associated with ST-segment elevations in the inferior leads (II, III, and aVF).$sqa157$,
  $cha157$c1037c66b0ff41bb21a5c61c32bdf409d36a25952b74f2dea44cdbb7ca2d6a71$cha157$,
  true,
  $rfa157$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK470572/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470572/"}]$rfa157$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida158$cmrpw59ro00361yrt8z5vi5er$ida158$,
  $fxa158$wrong_key|wrong_blueprint$fxa158$,
  $sca158$A 70-year-old man with a history of chronic kidney disease presents to the outpatient clinic with increasing fatigue, pallor, and shortness of breath over the past month. Laboratory tests reveal a hemoglobin level of 8.5 g/dL, a reticulocyte count of 2.5%, and normal iron studies. He denies any recent blood loss or gastrointestinal symptoms.$sca158$,
  $qua158$What is the most likely diagnosis for this patient's anemia?$qua158$,
  $opa158${"options":["Low erythropoietin from chronic kidney disease","Iron deficiency from chronic blood loss","Vitamin B12 deficiency with macrocytosis","Aplastic anemia with pancytopenia"],"taskCategory":"clinical-intervention","blueprintTopic":"anemia-of-chronic-kidney-disease","blueprintSystem":"blood-lymph-immune","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350086595","qcScore":7.6,"slotIndex":35,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-18T04:48:59.212Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa158$,
  $kya158$Low erythropoietin from chronic kidney disease$kya158$,
  $exa158$Chronic kidney disease causes a hypoproliferative anemia mainly because erythropoietin production fails to rise for the degree of anemia. Normal iron studies and the absence of bleeding argue against iron deficiency. There are no neurologic findings or a macrocytic description to support vitamin B12 deficiency, and aplastic anemia presents with pancytopenia rather than an isolated anemia.$exa158$,
  3,
  $dma158$blood-lymph-immune$dma158$,
  $tpa158$anemia-of-chronic-kidney-disease$tpa158$,
  $sua158$https://www.ncbi.nlm.nih.gov/books/NBK539871/$sua158$,
  $sla158$https://www.ncbi.nlm.nih.gov/books/NBK539871/$sla158$,
  $sqa158$Although it shares many similarities with the chronic inflammation aspects of anemia of CKD, a key distinction is the severe erythropoietin deficiency in anemia of CKD.$sqa158$,
  $cha158$70f94e65b8f0741b471a886ce456dbd4b8a9b3881e7ee60ae43127bfe723b341$cha158$,
  true,
  $rfa158$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK539871/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK539871/"}]$rfa158$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida159$cmrth10ff002k1yaxsay1cgiv$ida159$,
  $fxa159$wrong_key|rationale|distractor$fxa159$,
  $sca159$A 62-year-old man with a history of hypertension presents to the clinic for follow-up. He has been experiencing increasing shortness of breath on exertion and has noticed swelling in his legs. On examination, his blood pressure is 150/90 mm Hg, heart rate is 88 bpm, and he has bilateral lower extremity edema. A chest X-ray shows cardiomegaly and pulmonary congestion.$sca159$,
  $qua159$What is the most likely underlying mechanism of this patient's condition?$qua159$,
  $opa159${"kind":"biostats","stepLevel":"step1","blueprintSystem":"focused","blueprintTopic":"emergency-acls","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784566411523","qcScore":8.2,"slotIndex":11,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-20T16:54:39.449Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Volume loss from overdiuresis","Decreased cardiac output due to myocardial infarction","Isolated precapillary pulmonary hypertension","Decreased compliance of the left ventricle"],"taskCategory":"professionalism"}$opa159$,
  $kya159$Decreased compliance of the left ventricle$kya159$,
  $exa159$Long-standing hypertension stiffens the left ventricle. Reduced compliance raises left-sided filling pressure, which is transmitted backward as pulmonary congestion, with secondary fluid retention and leg edema. Cardiomegaly fits that remodeling. There is no acute coronary syndrome, overdiuresis would contract volume rather than cause edema, and precapillary pulmonary hypertension does not flood the alveolar capillaries.$exa159$,
  3,
  $dma159$cardiovascular$dma159$,
  $tpa159$emergency-acls$tpa159$,
  $sua159$https://www.ncbi.nlm.nih.gov/books/NBK599960/$sua159$,
  $sla159$https://www.ncbi.nlm.nih.gov/books/NBK599960/$sla159$,
  $sqa159$These elevations in LVFPs are the result of left ventricular diastolic dysfunction secondary to incomplete myocardial relaxation, increased ventricular stiffness with subsequent decreased ventricular distensibility, and a shift in the Frank-Starling mechanism initially during exercise and eventually at rest.$sqa159$,
  $cha159$89ab304ff1a74a346b19a07dff2d9f38a4a95c8fb5f66e2b83f1fc7b012e0b85$cha159$,
  true,
  $rfa159$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK599960/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK599960/"}]$rfa159$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida160$cmr4eems001fm1yky8mhrhayj$ida160$,
  $fxa160$wrong_blueprint|difficulty$fxa160$,
  $sca160$A 45-year-old male presents to the outpatient clinic for a routine check-up. He has a history of hypertension and is currently taking lisinopril. His blood pressure today is 150/95 mm Hg. Laboratory tests reveal a serum creatinine of 1.2 mg/dL and potassium of 4.5 mEq/L. He reports no symptoms and has no significant family history.$sca160$,
  $qua160$What is the most likely diagnosis?$qua160$,
  $opa160${"kind":"sequential","stepLevel":"step3","blueprintSystem":"cardiovascular","blueprintTopic":"essential-hypertension","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783050426862","qcScore":8.4,"slotIndex":51,"stepLevel":"step3","examNumber":9316,"generatedAt":"2026-07-03T03:48:10.842Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Primary hypertension","Secondary hypertension due to renal artery stenosis","Hypertension due to hyperaldosteronism","White coat hypertension"],"taskCategory":"health-maintenance"}$opa160$,
  $kya160$Primary hypertension$kya160$,
  $exa160$Why this answer is correct
The most likely diagnosis is primary hypertension due to consistent elevated blood pressure readings without secondary causes.
Primary hypertension is characterized by elevated blood pressure without identifiable secondary causes.
The patient's lab results show normal kidney function and potassium levels, ruling out secondary causes.
Absence of symptoms or abnormal findings supports the diagnosis of primary hypertension.
In practice: In practice, this means that the patient can be managed with lifestyle modifications and possibly medication, focusing on long-term blood pressure control.
Why the other options are wrong

Secondary hypertension due to renal artery stenosis
Trap: Students may think this option is correct because renal artery stenosis is a common cause of secondary hypertension.
Why it fails here: However, the patient shows normal creatinine levels and lacks symptoms typically associated with renal artery stenosis, such as flank pain or worsening renal function.
Remember: This highlights the importance of evaluating lab results and clinical presentation when diagnosing hypertension.

Hypertension due to hyperaldosteronism
Trap: This option may be chosen due to the association of hyperaldosteronism with hypertension.
Why it fails here: The key point is that hyperaldosteronism usually presents with hypokalemia (low potassium), while this patient has a normal potassium level.
Remember: Understanding the biochemical markers associated with different causes of hypertension is crucial for accurate diagnosis.

White coat hypertension
Trap: Some may consider this option because the patient is in a clinical setting.
Why it fails here: However, white coat hypertension typically involves elevated readings only in a clinical environment, and this patient has consistently high readings without symptoms.
Remember: Recognizing the difference between situational hypertension and true hypertension is essential for effective management.
Key takeaway
When evaluating hypertension, always consider lab results and patient history to differentiate between primary and secondary causes.

Memory hook: Think 'normal labs, primary hypertension' — if labs are normal, primary is likely!$exa160$,
  3,
  $dma160$cardiovascular$dma160$,
  $tpa160$essential-hypertension$tpa160$,
  $sua160$https://www.ncbi.nlm.nih.gov/books/NBK539859/$sua160$,
  $sla160$https://www.ncbi.nlm.nih.gov/books/NBK539859/$sla160$,
  $sqa160$Most cases of hypertension are idiopathic, which is also known as essential hypertension.$sqa160$,
  $cha160$4da8c93e685754b955b3ab344fd68d6ab96f99ecc9386a5a680d7b6eaf267825$cha160$,
  true,
  $rfa160$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK539859/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK539859/"}]$rfa160$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida161$cmr8ccfcj00kc1ylo5bcs86wm$ida161$,
  $fxa161$not_single_best|rationale$fxa161$,
  $sca161$A 30-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She reports that the pain started suddenly and is located in the right upper quadrant. On examination, she has a fever of 101°F, tenderness in the right upper quadrant, and a positive Murphy's sign. Laboratory tests reveal elevated white blood cell count of 15,000/mm³ and elevated liver enzymes.$sca161$,
  $qua161$Which study is the most appropriate next step to confirm the diagnosis?$qua161$,
  $opa161${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-monitoring-escalation","physicianTask":"communication","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783288792039","qcScore":8.1,"slotIndex":22,"stepLevel":"step3","examNumber":9307,"generatedAt":"2026-07-05T22:00:47.349Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Start intravenous fluids and antibiotics","Obtain an abdominal ultrasound","Perform an urgent laparotomy","Administer analgesics"],"taskCategory":"communication"}$opa161$,
  $kya161$Obtain an abdominal ultrasound$kya161$,
  $exa161$Right-upper-quadrant pain, fever, a positive Murphy sign, and leukocytosis are suspected acute cholecystitis. Abdominal ultrasound is the preferred study to confirm gallstones and gallbladder-wall inflammation. Intravenous fluids and antibiotics are initial treatment and are not held until after imaging. Analgesia is part of that initial care and does not replace imaging. Laparotomy is not the first step before the diagnosis is confirmed in a patient who is not in septic shock.$exa161$,
  3,
  $dma161$multisystem$dma161$,
  $tpa161$pre-post-op-care$tpa161$,
  $sua161$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sua161$,
  $sla161$https://www.ncbi.nlm.nih.gov/books/NBK459171/$sla161$,
  $sqa161$Initial management of acute cholecystitis typically involves intravenous fluid resuscitation and prompt initiation of broad-spectrum antibiotics effective against gram-negative rods and anaerobes.$sqa161$,
  $cha161$0555d6edd2cdb43b51d2e829758d23a06d5510a43d2b3bcc42996d631d5b732c$cha161$,
  true,
  $rfa161$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK459171/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459171/"}]$rfa161$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida162$cmr8hgjg302181ylor4piufzp$ida162$,
  $fxa162$difficulty$fxa162$,
  $sca162$A 10-year-old boy is brought to the emergency department by his mother due to a 3-day history of worsening cough, fever, and difficulty breathing. He has a history of asthma and has been experiencing increased wheezing. On examination, his respiratory rate is 30 breaths per minute, oxygen saturation is 88% on room air, and diffuse wheezing is noted on auscultation. A chest X-ray shows hyperinflation without signs of pneumonia, indicating an asthma exacerbation.$sca162$,
  $qua162$What is the most appropriate next step in the management of this patient?$qua162$,
  $opa162$["Administer oral corticosteroids","Initiate nebulized albuterol","Obtain a blood culture","Start intravenous fluids","Perform a chest CT scan"]$opa162$,
  $kya162$Initiate nebulized albuterol$kya162$,
  $exa162$The correct answer is to initiate nebulized albuterol, which is a bronchodilator that provides rapid relief of bronchospasm in patients experiencing an asthma exacerbation. Given the patient's respiratory distress, wheezing, and low oxygen saturation, immediate bronchodilator therapy is essential. Administering oral corticosteroids may be necessary later for inflammation but is not the immediate step. Obtaining a blood culture is not indicated in this case as there are no signs of pneumonia or systemic infection. Starting intravenous fluids is not a priority in this acute respiratory situation, and a chest CT scan is unnecessary for the management of asthma exacerbation.

Clinical reasoning: In this scenario, the child is in respiratory distress due to an asthma exacerbation, characterized by wheezing and low oxygen saturation. The immediate management should focus on relieving bronchospasm, making nebulized albuterol the most appropriate next step. Other options either do not address the acute need or are not relevant to the current clinical situation.

Why other options are incorrect:
• Administer oral corticosteroids: While corticosteroids are important for reducing inflammation in asthma exacerbations, they are not the immediate treatment for acute bronchospasm.
• Obtain a blood culture: This option is incorrect as there are no clinical signs suggesting a bacterial infection that would warrant a blood culture.
• Start intravenous fluids: This distractor is incorrect because the primary issue is respiratory distress, not dehydration or fluid imbalance.
• Perform a chest CT scan: A chest CT scan is not indicated in this acute setting and does not contribute to the immediate management of asthma.$exa162$,
  3,
  $dma162$human-development$dma162$,
  $tpa162$pediatric-ccs$tpa162$,
  $sua162$https://www.ncbi.nlm.nih.gov/books/NBK551631/$sua162$,
  $sla162$https://www.ncbi.nlm.nih.gov/books/NBK551631/$sla162$,
  $sqa162$Within the first hour, patients then receive 3 treatments of an inhaled SABA like albuterol via a nebulizer or MDI, followed by repeat dosing every 1 to 4 hours.$sqa162$,
  $cha162$b24b5de19cb4a47dcab19d73cfc1cc2eedc13a76744be514d8bdeb280e35aa1b$cha162$,
  true,
  $rfa162$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK551631/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK551631/"}]$rfa162$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida163$cmr8qfn8s01m81ygiwdfyc215$ida163$,
  $fxa163$wrong_key$fxa163$,
  $sca163$A 72-year-old woman is admitted to the surgical ward after a hip replacement surgery. On postoperative day 2, she develops a fever of 101.5°F, tachycardia, and leukocytosis with a white blood cell count of 12,500/mm³. She has no signs of wound infection, and her chest X-ray is clear.$sca163$,
  $qua163$Which of the following is the most likely diagnosis?$qua163$,
  $opa163${"options":["Catheter-associated urinary tract infection","Physiologic inflammatory response to surgery","Deep incisional infection on day two","Pulmonary embolism as the first cause"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"postoperative-fever","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783312326769","examNumber":9319,"slotIndex":2,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-06T04:33:14.397Z"}}$opa163$,
  $kya163$Physiologic inflammatory response to surgery$kya163$,
  $exa163$A temperature of 101.5 F within the first two days after surgery, with a clear chest radiograph and no wound changes, is the expected cytokine response to tissue injury. Urinary infection is less likely without urinary symptoms this early. Wound infection usually appears several days later and would show local signs. Pulmonary embolism can cause fever, but it is not the most likely cause of an early fever when there is no dyspnea, pleuritic pain, or hypoxemia.$exa163$,
  3,
  $dma163$multisystem$dma163$,
  $tpa163$postoperative-fever$tpa163$,
  $sua163$https://www.ncbi.nlm.nih.gov/books/NBK482299/$sua163$,
  $sla163$https://www.ncbi.nlm.nih.gov/books/NBK482299/$sla163$,
  $sqa163$Fever in the first 48 to 72 hours after surgery is usually noninfectious in origin, representing normal physiologic inflammatory responses, anesthetic effects, atelectasis, or other benign mechanisms.$sqa163$,
  $cha163$ffbdd014d90a06d36e12c38663a13dc283d78068a0fa0a12e24d76b8478604f2$cha163$,
  true,
  $rfa163$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK482299/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482299/"}]$rfa163$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida164$cmr9a12ix01131ywyiklp2bg2$ida164$,
  $fxa164$rationale$fxa164$,
  $sca164$A 32-year-old woman presents to the emergency department 2 weeks after a vaginal delivery, complaining of severe abdominal pain and fever. She has a history of gestational diabetes and is currently breastfeeding. On examination, her temperature is 101.5°F, and her abdomen is tender to palpation. A CBC shows leukocytosis with a white blood cell count of 15,000/mm³. Ultrasound reveals a collection of fluid in the uterine cavity.$sca164$,
  $qua164$What is the most likely diagnosis?$qua164$,
  $opa164${"options":["Endometritis","Uterine atony","Retained products of conception","Pelvic thrombophlebitis"],"distractorRationale":{"Uterine atony":"This option is incorrect because uterine atony primarily leads to postpartum hemorrhage rather than fever and abdominal pain.","Retained products of conception":"While this could cause abdominal pain, the presence of fever and leukocytosis strongly indicates an infectious process, making endometritis more likely.","Pelvic thrombophlebitis":"This is a less common condition that typically presents later postpartum and is characterized by fever and abdominal pain without significant leukocytosis."},"clinicalReasoning":"The patient's presentation of fever, abdominal pain, and leukocytosis after delivery suggests an infectious process. The ultrasound findings of fluid in the uterine cavity further support endometritis as the diagnosis. Analyzing the differential diagnoses, uterine atony and retained products of conception were considered, but the clinical signs align more closely with endometritis.","kind":"vignette","stepLevel":"step3","blueprintSystem":"obgyn","blueprintTopic":"postpartum-complications","physicianTask":"health-maintenance","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783345330598","examNumber":9312,"slotIndex":27,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T13:46:21.395Z"}}$opa164$,
  $kya164$Endometritis$kya164$,
  $exa164$Fever, uterine tenderness, and leukocytosis two weeks after vaginal delivery fit late-onset postpartum endometritis, which can present through six weeks. Ultrasound fluid in the uterus is nonspecific and also occurs in the normal postpartum uterus, so it does not by itself separate infection from clot or retained tissue. Uterine atony is an immediate cause of hemorrhage, not a febrile illness at two weeks. Septic pelvic thrombophlebitis is considered when fever persists despite antibiotics, which has not happened here.$exa164$,
  5,
  $dma164$reproductive-endocrine$dma164$,
  $tpa164$postpartum-complications$tpa164$,
  $sua164$https://www.ncbi.nlm.nih.gov/books/NBK553124/$sua164$,
  $sla164$https://www.ncbi.nlm.nih.gov/books/NBK553124/$sla164$,
  $sqa164$Imaging findings in postpartum endometritis are generally nonspecific, and there is a significant overlap with normal postpartum findings.$sqa164$,
  $cha164$09b1b0c440d28fe5aaa98e536174ee0642d7cdfb11a30ad1ee1bdbd6696aae02$cha164$,
  true,
  $rfa164$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK553124/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK553124/"}]$rfa164$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida165$cmru858o1004v1yd6i3oeyllm$ida165$,
  $fxa165$wrong_blueprint$fxa165$,
  $sca165$A 34-year-old woman presents to the emergency department after a motor vehicle collision. She is alert but reports severe abdominal pain and has a blood pressure of 90/60 mm Hg, a heart rate of 120 bpm, and a respiratory rate of 24 breaths per minute. A FAST exam reveals free fluid in the abdominal cavity. She has no known drug allergies and is currently taking oral contraceptives.$sca165$,
  $qua165$What is the most appropriate next step in management?$qua165$,
  $opa165${"kind":"ethics","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"blunt-abdominal-trauma","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784611860346","examNumber":9302,"slotIndex":59,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-21T05:39:53.658Z"},"options":["Administer IV fluids and type & crossmatch for blood transfusion","Perform a laparotomy","Obtain a CT scan of the abdomen","Start intravenous morphine for pain control"]}$opa165$,
  $kya165$Perform a laparotomy$kya165$,
  $exa165$Correct answer: B. Perform a laparotomy. Blunt abdominal trauma with hypotension (BP 90/60) and tachycardia (HR 120; shock index 120/90 = 1.3) plus free intraperitoneal fluid on FAST means a hemodynamically abnormal patient with intra-abdominal hemorrhage. RR 24 adds to the picture of shock. Oral contraceptive use is irrelevant. Bleeding like this is stopped surgically, so the patient goes straight to laparotomy, with balanced blood-product resuscitation running in parallel on the way to the OR (ATLS; European trauma guideline 2023). Why the other options are wrong: A. IV fluids and type and crossmatch: IV access, blood draw for type and crossmatch, and blood products are started at the same time, but they support the patient and do not stop the bleeding. Choosing them as the answer treats resuscitation as if it could replace hemorrhage control, and large crystalloid volumes worsen coagulopathy. C. CT abdomen: CT is only for hemodynamically normal patients. Sending a hypotensive patient to the scanner delays hemorrhage control. D. IV morphine: analgesia is humane and appropriate, but it does not address the hemorrhage. Opioids can also worsen hypotension; if used, titrate them carefully.$exa165$,
  3,
  $dma165$multisystem$dma165$,
  $tpa165$blunt-abdominal-trauma$tpa165$,
  $sua165$https://www.ncbi.nlm.nih.gov/books/NBK557624/$sua165$,
  $sla165$https://www.ncbi.nlm.nih.gov/books/NBK557624/$sla165$,
  $sqa165$Unstable patients who have experienced blunt abdominal trauma should undergo DPL or FAST examination. If either is positive, then the patient should be taken for exploratory laparotomy.$sqa165$,
  $cha165$49b5f1cf66b61a9a71a90eb94858eca0d08060b952ab726c2127040c4c2ed2be$cha165$,
  true,
  $rfa165$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK557624/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557624/"}]$rfa165$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida166$cmruyeuwu000g1y2yn3cwf7om$ida166$,
  $fxa166$template_artifact$fxa166$,
  $sca166$Abstract — Understanding Non-Inferiority Trials
Source: USMLE Step 3
A new anticoagulant drug was tested against the standard therapy in a non-inferiority trial involving 10,000 patients. The trial's primary endpoint was the incidence of stroke over one year. The new drug showed a stroke incidence of 3%, while the standard therapy showed a 3.5% incidence. The confidence interval for the difference was -0.8% to 0.2% with a non-inferiority margin of 0.5%.$sca166$,
  $qua166$What conclusion can be drawn from this trial?$qua166$,
  $opa166${"stepLevel":"step3","kind":"abstract","abstract":{"title":"Understanding Non-Inferiority Trials","source":"USMLE Step 3","body":"A new anticoagulant drug was tested against the standard therapy in a non-inferiority trial involving 10,000 patients. The trial's primary endpoint was the incidence of stroke over one year. The new drug showed a stroke incidence of 3%, while the standard therapy showed a 3.5% incidence. The confidence interval for the difference was -0.8% to 0.2% with a non-inferiority margin of 0.5%."},"structureIds":["lungs","nasal-concha-l"],"options":["The new drug is superior to standard therapy","The new drug is non-inferior to standard therapy","The new drug is inferior to standard therapy","The trial result does not support a conclusion"]}$opa166$,
  $kya166$The new drug is non-inferior to standard therapy$kya166$,
  $exa166$For an adverse-event difference defined as new minus standard, non-inferiority is met when the upper confidence limit stays below the prespecified margin. The upper limit here is 0.2 percent and the margin is 0.5 percent, so the new anticoagulant is non-inferior. The interval still includes zero, so superiority is not shown, and the result is not inconclusive or a finding of inferiority.$exa166$,
  3,
  $dma166$biostats-epi$dma166$,
  $tpa166$pharmaceutical-ads-abstracts$tpa166$,
  $sua166$https://www.fda.gov/media/78504/download$sua166$,
  $sla166$https://www.fda.gov/media/78504/download$sla166$,
  $sqa166$If the upper bound is less than M, non-inferiority of T relative to C is established.$sqa166$,
  $cha166$fc3fbc2678e530ee4e0581005ad7cc80f6dcaa47489c15b0ca28c3baf7b11253$cha166$,
  true,
  $rfa166$[{"label": "https://www.fda.gov/media/78504/download", "url": "https://www.fda.gov/media/78504/download"}]$rfa166$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida167$cmrvwtucd003o1ye87roun8ma$ida167$,
  $fxa167$template_artifact|difficulty$fxa167$,
  $sca167$A 65-year-old male with a history of chronic obstructive pulmonary disease (COPD) is admitted to the inpatient ward due to worsening dyspnea and a productive cough. On examination, his vital signs reveal a temperature of 99.0°F, heart rate of 105 bpm, blood pressure of 130/85 mmHg, respiratory rate of 24/min, and oxygen saturation of 89% on room air. Auscultation reveals bilateral wheezing and decreased breath sounds, indicating potential bronchospasm.$sca167$,
  $qua167$What is the next best step in the management of this patient?$qua167$,
  $opa167${"options":["Start supplemental oxygen by nasal cannula","Order a chest radiograph before treatment","Administer albuterol nebulizer treatment","Prescribe a short course of antibiotics"]}$opa167$,
  $kya167$Administer albuterol nebulizer treatment$kya167$,
  $exa167$Wheezing, dyspnea, and a productive cough in a patient with COPD are an acute exacerbation. Inhaled short-acting beta-agonists are the initial bronchodilators. Oxygen saturation is 89 percent, already inside the usual 88 to 92 percent target, so starting extra oxygen is not the first move. A chest radiograph can look for pneumonia or pneumothorax but does not relieve bronchospasm. Antibiotics are added when infection is likely; they do not open the airway now.$exa167$,
  3,
  $dma167$respiratory-renal$dma167$,
  $tpa167$pneumonia-workup$tpa167$,
  $sua167$https://goldcopd.org/wp-content/uploads/2026/11/GOLD-2027-POCKET-GUIDE-v1.1-20Nov2026_WMV.pdf$sua167$,
  $sla167$https://goldcopd.org/wp-content/uploads/2026/11/GOLD-2027-POCKET-GUIDE-v1.1-20Nov2026_WMV.pdf$sla167$,
  $sqa167$SABAs, with or without short-acting anticholinergics, are recommended as the initial bronchodilators to treat moderate/severe exacerbations.$sqa167$,
  $cha167$096fd9794e8573a54b3957a4f87224f308cdf9262b7ee6b2cb375095877dca8a$cha167$,
  true,
  $rfa167$[{"label": "https://goldcopd.org/wp-content/uploads/2026/11/GOLD-2027-POCKET-GUIDE-v1.1-20Nov2026_WMV.pdf", "url": "https://goldcopd.org/wp-content/uploads/2026/11/GOLD-2027-POCKET-GUIDE-v1.1-20Nov2026_WMV.pdf"}]$rfa167$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida168$cmtpxc6iq00591ymub6okoxkc$ida168$,
  $fxa168$template_artifact$fxa168$,
  $sca168$A 72-year-old woman is admitted to the hospital with acute exacerbation of chronic obstructive pulmonary disease (COPD). She has a history of hypertension and is currently on a regimen of tiotropium and albuterol. On examination, her respiratory rate is 28 breaths per minute, oxygen saturation is 88% on room air, and she is using accessory muscles for breathing. Arterial blood gas analysis reveals pH 7.32, PaCO2 58 mmHg, and PaO2 55 mmHg.$sca168$,
  $qua168$What is the next best step in management?$qua168$,
  $opa168${"options":["Initiate non-invasive positive pressure ventilation","Administer intravenous corticosteroids today","Start high-flow nasal cannula oxygen therapy","Order a chest radiograph before support"],"kind":"vignette","stepLevel":"step3","blueprintSystem":"multisystem","blueprintTopic":"inpatient-orders","physicianTask":"professionalism","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1788705790917","examNumber":9303,"slotIndex":27,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-09-06T14:45:01.075Z"}}$opa168$,
  $kya168$Initiate non-invasive positive pressure ventilation$kya168$,
  $exa168$The correct answer is to initiate non-invasive positive pressure ventilation (NIPPV) for this patient with acute exacerbation of COPD and respiratory acidosis. NIPPV can improve ventilation and oxygenation, reducing the need for intubation. The other options are less effective in this acute setting. Administering intravenous corticosteroids is important but not the immediate next step; it is adjunctive therapy. High-flow nasal cannula oxygen therapy may not adequately address the patient's hypercapnia. A chest X-ray may be useful but does not address the immediate respiratory distress.

Clinical reasoning: Assess the patient's respiratory status and arterial blood gas results to identify respiratory failure. Analyze the need for immediate intervention to improve ventilation and oxygenation. Integrate the understanding of COPD management to determine that NIPPV is the most appropriate next step.

Why other options are incorrect:
• Administer intravenous corticosteroids (give a corticosteroid through a vein): While corticosteroids are important in managing COPD exacerbations, they do not provide immediate respiratory support.
• Start high-flow nasal cannula oxygen therapy: High-flow nasal cannula may not sufficiently correct the patient's hypercapnia and respiratory acidosis.
• Order a chest X-ray: A chest X-ray can help rule out other causes but does not provide immediate management for respiratory failure.$exa168$,
  4,
  $dma168$respiratory-renal$dma168$,
  $tpa168$pe-workup$tpa168$,
  $sua168$https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/$sua168$,
  $sla168$https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/$sla168$,
  $sqa168$We recommend NIV for patients with acute respiratory failure leading to acute or acute-on-chronic respiratory acidosis (pH ≤ 7.35) due to COPD exacerbation.$sqa168$,
  $cha168$ad5cf298bff89e1b5e961f577491034c6c99e9a41860252ff69454c68ffde5e0$cha168$,
  true,
  $rfa168$[{"label": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10208989/"}]$rfa168$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida169$b8xf4bb704331cd755058519ead$ida169$,
  $fxa169$wrong_blueprint$fxa169$,
  $sca169$A 25-year-old patient had a genetic test and said his parents may not have the result. They paid the bill and demand it. He is capacitated and repeats the refusal. A classmate says payment is ownership of the data. The result does not change the parents’ own urgent care.$sca169$,
  $qua169$Why does the bill not transfer the result?$qua169$,
  $opa169${"options":["A paid bill is authorization to release an adult’s result","Repeating the refusal weakens it","Age 25 means parents hold genetic results","No effect on the parents’ care means they have a stronger claim","He is the patient who refused, and payment is not consent"],"blueprintTopic":"confidentiality","blueprintSystem":"social-sciences"}$opa169$,
  $kya169$He is the patient who refused, and payment is not consent$kya169$,
  $exa169$Paying for the test does not open an adult child’s result after he has said no. He is the patient who refused, and payment is not consent. A paid bill is authorization to release an adult’s result is a financial fact. Repeating the refusal weakens it confirms it. Age 25 means parents hold genetic results is his result. No effect on the parents’ care means they have a stronger claim removes a treatment need of their own.$exa169$,
  4,
  $dma169$social-sciences$dma169$,
  $tpa169$confidentiality$tpa169$,
  $sua169$https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html$sua169$,
  $sla169$https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html$sla169$,
  $sqa169$The Privacy Rule standards address the use and disclosure of individuals' health information, called protected health information.$sqa169$,
  $cha169$178f1ca7a47d5745da11d719a408f4fd9786dddbbe609a28f87e9c2e09cac6fb$cha169$,
  true,
  $rfa169$[{"label": "https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html", "url": "https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html"}]$rfa169$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida170$cmpnjhaom001z1ymx6pqd9dwv$ida170$,
  $fxa170$wrong_blueprint$fxa170$,
  $sca170$A 73-year-old man is admitted to the hospital with confusion and significantly decreased urine output. His medical history includes osteoarthritis for which he has been taking NSAIDs, and he has a history of hypertension. Upon examination, he is hypotensive with a blood pressure of 88/54 mmHg and has dry mucous membranes. Laboratory tests reveal an elevated creatinine level of 3.8 mg/dL, BUN of 62 mg/dL, and urinalysis shows muddy brown casts with a fractional excretion of sodium (FENa) of 2.1%.$sca170$,
  $qua170$What is the most appropriate next step in management for this patient?$qua170$,
  $opa170${"options":["Urinalysis with sediment, FENa/FeUrea, and renal ultrasound to assess obstruction","Initiate intravenous fluids and discontinue NSAIDs","Perform a renal biopsy to assess for acute interstitial nephritis","Start broad-spectrum antibiotics for possible infection"],"distractorRationale":{"Urinalysis with sediment, FENa/FeUrea, and renal ultrasound to assess obstruction":"In this case, the patient's clinical presentation strongly indicates AKI due to NSAID use, making immediate treatment more critical than additional diagnostics. (The priority in AKI management is to stabilize the patient rather than delay for tests.)","Perform a renal biopsy to assess for acute interstitial nephritis":"A renal biopsy is not indicated at this stage, as the patient's history and presentation suggest NSAID-induced AKI, which can be managed without invasive procedures. (Management of AKI often focuses on addressing reversible causes rather than obtaining a definitive diagnosis through biopsy.)","Start broad-spectrum antibiotics for possible infection":"While infection can cause confusion and renal impairment, the clinical signs and history point towards AKI from NSAID use, making antibiotics unnecessary at this point. (In this scenario, the immediate need is to manage the volume status and nephrotoxicity rather than treat for infection.)"},"clinicalReasoning":"Initiating intravenous fluids and discontinuing NSAIDs is the best immediate step for this patient. **Acute kidney injury (AKI)** **Hypotension** and dry mucous membranes indicate **volume depletion**.","keyTakeaways":["When managing acute kidney injury, prioritize fluid resuscitation and discontinuation of nephrotoxic agents first."],"blueprintTopic":"acute-kidney-injury","blueprintSystem":"respiratory-renal","generationMeta":{"rationaleModel":"gpt-4o-mini","rationaleEnrichedAt":"2026-07-22T15:22:35.108Z","rationaleQualityScore":100}}$opa170$,
  $kya170$Initiate intravenous fluids and discontinue NSAIDs$kya170$,
  $exa170$Why this answer is correct
Initiating intravenous fluids and discontinuing NSAIDs is the best immediate step for this patient.
Acute kidney injury (AKI)
Hypotension and dry mucous membranes indicate volume depletion.
Discontinuing NSAIDs is crucial as they are nephrotoxic.
In practice: On the unit, this means promptly addressing the patient's volume status can prevent further renal damage and improve overall outcomes.
Clinical pearl
On the unit, this means promptly addressing the patient's volume status can prevent further renal damage and improve overall outcomes.
Why the other options are wrong

Urinalysis with sediment, FENa/FeUrea, and renal ultrasound to assess obstruction
Trap: Students may think that further diagnostic testing is necessary before treatment.
Why it fails here: In this case, the patient's clinical presentation strongly indicates AKI due to NSAID use, making immediate treatment more critical than additional diagnostics.
Remember: The priority in AKI management is to stabilize the patient rather than delay for tests.

Perform a renal biopsy to assess for acute interstitial nephritis
Trap: There may be an assumption that a biopsy is needed to confirm the cause of AKI.
Why it fails here: A renal biopsy is not indicated at this stage, as the patient's history and presentation suggest NSAID-induced AKI, which can be managed without invasive procedures.
Remember: Management of AKI often focuses on addressing reversible causes rather than obtaining a definitive diagnosis through biopsy.

Start broad-spectrum antibiotics for possible infection
Trap: Students might consider infection as a primary cause of the patient's symptoms.
Why it fails here: While infection can cause confusion and renal impairment, the clinical signs and history point towards AKI from NSAID use, making antibiotics unnecessary at this point.
Remember: In this scenario, the immediate need is to manage the volume status and nephrotoxicity rather than treat for infection.
Key takeaway
When managing acute kidney injury, prioritize fluid resuscitation and discontinuation of nephrotoxic agents first.

Memory hook: Think 'FLUIDS first' for AKI management.$exa170$,
  3,
  $dma170$respiratory-renal$dma170$,
  $tpa170$acute-kidney-injury$tpa170$,
  $sua170$https://www.ncbi.nlm.nih.gov/books/NBK507815/$sua170$,
  $sla170$https://www.ncbi.nlm.nih.gov/books/NBK507815/$sla170$,
  $sqa170$Nephrotoxic medications that can lead to acute tubular necrosis should be avoided, including nonsteroidal anti-inflammatory drugs, antibiotics such as amphotericin B, aminoglycosides, vancomycin, piperacillin/tazobactam, and radiocontrast agents.$sqa170$,
  $cha170$8f13a7a64e80153fd6677302575ceeb4b161298c69b648a8f5fb4b92075f9e7e$cha170$,
  true,
  $rfa170$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK507815/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK507815/"}]$rfa170$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida171$cmr886ckh00mr1yr9k8us6bw0$ida171$,
  $fxa171$wrong_key|rationale|wrong_blueprint$fxa171$,
  $sca171$A 1-year-old boy is brought to the clinic for a follow-up visit after being treated for a urinary tract infection. His mother is concerned because he has been having difficulty urinating and has developed a fever of 101°F (38.3°C). On examination, the boy appears dehydrated, and a urinalysis shows leukocyte esterase positive and nitrite positive.$sca171$,
  $qua171$What is the most appropriate next step in management?$qua171$,
  $opa171${"options":["Increase oral fluids alone","Start antibiotic treatment and rehydrate","Give only daily antibiotic prophylaxis","Recheck a urinalysis next week"],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"pediatric-urinary-tract-infection","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783281558607","qcScore":8,"slotIndex":6,"stepLevel":"step2","examNumber":9208,"generatedAt":"2026-07-05T20:00:29.080Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"clinical-intervention"}$opa171$,
  $kya171$Start antibiotic treatment and rehydrate$kya171$,
  $exa171$Fever, dysuria, dehydration, and a nitrite-positive urinalysis are an acute urinary tract infection. Start antibiotics after the urine specimen and rehydrate the child. Prophylaxis does not treat the current infection and is not routine after a urinary infection unless a high-risk urinary anomaly has been defined. Fluids alone and a delayed urinalysis leave the infection untreated.$exa171$,
  4,
  $dma171$respiratory-renal$dma171$,
  $tpa171$pediatric-urinary-tract-infection$tpa171$,
  $sua171$https://www.ncbi.nlm.nih.gov/books/NBK599548/$sua171$,
  $sla171$https://www.ncbi.nlm.nih.gov/books/NBK599548/$sla171$,
  $sqa171$Antibiotics should be empirically initiated in patients with suspected UTIs after UA and before culture results to resolve the infection promptly.$sqa171$,
  $cha171$05e73a5864bf698e2d510116ad2f3e2427efbd184180966d9e23f0c23c4d3ba5$cha171$,
  true,
  $rfa171$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK599548/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK599548/"}]$rfa171$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida172$cmrrvfiys002n1yl8ss1b6wtw$ida172$,
  $fxa172$cue|wrong_blueprint$fxa172$,
  $sca172$A 72-year-old woman presents to the clinic with increasing fatigue and jaundice over the past month. She has a remote history of injection drug use, takes no acetaminophen, and does not drink alcohol. Laboratory tests show AST 200 U/L, ALT 250 U/L, total bilirubin 5.0 mg/dL, and detectable hepatitis C RNA. Abdominal ultrasound shows splenomegaly without biliary obstruction.$sca172$,
  $qua172$What is the most likely diagnosis for this patient's condition?$qua172$,
  $opa172${"options":["Chronic hepatitis C with portal hypertension","Alcoholic hepatitis with an AST much higher than ALT","Autoimmune hepatitis as a separate primary disease","Steatosis without portal hypertension or jaundice"],"taskCategory":"interpretation","blueprintTopic":"chronic-hepatitis-c","blueprintSystem":"gastrointestinal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784469914630","qcScore":7.8,"slotIndex":14,"stepLevel":"step2","examNumber":9202,"generatedAt":"2026-07-19T14:06:03.143Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$opa172$,
  $kya172$Chronic hepatitis C with portal hypertension$kya172$,
  $exa172$Detectable hepatitis C RNA, an ALT greater than AST, jaundice, and splenomegaly indicate chronic hepatitis C with portal hypertension. Alcoholic hepatitis is unlikely without alcohol use and without an AST-to-ALT ratio above 2. Autoimmune hepatitis is not suggested without compatible serology. Steatosis alone does not produce this degree of jaundice and splenomegaly.$exa172$,
  2,
  $dma172$gastrointestinal$dma172$,
  $tpa172$chronic-hepatitis-c$tpa172$,
  $sua172$https://www.ncbi.nlm.nih.gov/books/NBK430897/$sua172$,
  $sla172$https://www.ncbi.nlm.nih.gov/books/NBK430897/$sla172$,
  $sqa172$The effects of chronic infection include cirrhosis, portal hypertension, hepatic decompensation with encephalopathy, and hepatocellular carcinoma.$sqa172$,
  $cha172$29ab0cba1adf5eba1a8a25017644bd2d81fcf5648b3d6213962517124915e2f4$cha172$,
  true,
  $rfa172$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK430897/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430897/"}]$rfa172$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida173$cmrtq47v000261yqcc8j81087$ida173$,
  $fxa173$wrong_key|rationale|difficulty$fxa173$,
  $sca173$A 5-year-old boy is brought to the emergency department with high fever, cough, runny nose, and red eyes for two days. He has been irritable and eating poorly. Temperature is 39.5 C (103 F). A maculopapular rash began on his face at the hairline and has spread to the trunk. He has not received MMR vaccine.$sca173$,
  $qua173$Which of the following is the most likely complication?$qua173$,
  $opa173${"options":["Encephalitis","Pneumonia","Otitis media","Meningitis"],"distractorRationale":{"Pneumonia":"While pneumonia is a common complication of measles, encephalitis is a more severe complication that can occur.","Otitis media":"This is another common complication, but encephalitis is more serious and less common.","Meningitis":"Although meningitis can occur, it is not a typical complication of measles compared to encephalitis."},"clinicalReasoning":"Assess the child's symptoms and vaccination status to determine the most likely diagnosis and associated complications. Analyze the risks of complications from the disease and integrate this information to select the most likely complication.","keyTakeaways":["When assessing complications of measles, prioritize encephalitis in unvaccinated children presenting with symptoms."],"kind":"vignette","stepLevel":"step2","blueprintSystem":"pediatrics","blueprintTopic":"vaccination-schedules","physicianTask":"clinical-intervention","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9502,"slotIndex":13,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8,"generatedAt":"2026-07-20T21:13:36.493Z"}}$opa173$,
  $kya173$Otitis media$kya173$,
  $exa173$This unvaccinated child has the measles prodrome and a rash that started at the hairline. Ear infection is the most common complication, occurring in about 1 in 10 children. Pneumonia is less common, about 1 in 20, although it is the leading cause of measles death. Encephalitis occurs in about 1 in 1,000 and is severe rather than most likely. Meningitis is not a typical measles complication.$exa173$,
  3,
  $dma173$human-development$dma173$,
  $tpa173$pediatric-infections$tpa173$,
  $sua173$https://www.cdc.gov/measles/signs-symptoms/$sua173$,
  $sla173$https://www.cdc.gov/measles/signs-symptoms/$sla173$,
  $sqa173$Ear infections occur in about 1 out of every 10 children with measles.$sqa173$,
  $cha173$629cbe4f43a38a6605037efcf8e22742ae5e3d968881739e3b4eb7bf89eeaa7a$cha173$,
  true,
  $rfa173$[{"label": "https://www.cdc.gov/measles/signs-symptoms/", "url": "https://www.cdc.gov/measles/signs-symptoms/"}]$rfa173$::jsonb
);

INSERT INTO qbi_usmle_audit80b_20261121_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  $ida174$cmtpw0n98002e1ylcr5nrzce0$ida174$,
  $fxa174$wrong_blueprint|difficulty$fxa174$,
  $sca174$A 34-year-old man presents to the emergency department after a motor vehicle accident. He is alert but has severe abdominal pain. His blood pressure is 90/60 mm Hg, heart rate is 120 bpm, and he has rebound tenderness in the right upper quadrant. A FAST exam shows free fluid.$sca174$,
  $qua174$What is the next best step in management?$qua174$,
  $opa174${"kind":"ethics","stepLevel":"step2","blueprintSystem":"multisystem","blueprintTopic":"blunt-abdominal-trauma","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788703609139","examNumber":9202,"slotIndex":5,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-09-06T14:07:14.692Z"},"options":["Immediate exploratory laparotomy","CT scan of the abdomen","Transfusion of packed red blood cells","Observation and re-evaluation"]}$opa174$,
  $kya174$Immediate exploratory laparotomy$kya174$,
  $exa174$The patient's hemodynamic instability, rebound tenderness, and presence of free fluid on FAST exam suggest a significant intra-abdominal injury, likely requiring surgical intervention. A CT scan is contraindicated in unstable patients, and while transfusion may be necessary, it does not address the source of bleeding. Observation is inappropriate given the signs of peritonitis.

Clinical reasoning: The presentation indicates a surgical abdomen with potential hemorrhage, necessitating immediate surgical intervention to prevent further complications.

Why other options are incorrect:
• CT scan of the abdomen: This is not appropriate in a hemodynamically unstable patient as it may delay necessary surgical intervention.
• Transfusion of packed red blood cells: While this may be required, it does not address the need for surgical exploration in the setting of intra-abdominal bleeding.
• Observation and re-evaluation: This is not appropriate given the signs of peritonitis and instability.$exa174$,
  3,
  $dma174$multisystem$dma174$,
  $tpa174$blunt-abdominal-trauma$tpa174$,
  $sua174$https://www.ncbi.nlm.nih.gov/books/NBK557624/$sua174$,
  $sla174$https://www.ncbi.nlm.nih.gov/books/NBK557624/$sla174$,
  $sqa174$Unstable patients who have experienced blunt abdominal trauma should undergo DPL or FAST examination. If either is positive, then the patient should be taken for exploratory laparotomy.$sqa174$,
  $cha174$228a4db16aee182e34c79ed8472acab818b1e5b69f188bec6efe8020a597ff1d$cha174$,
  true,
  $rfa174$[{"label": "https://www.ncbi.nlm.nih.gov/books/NBK557624/", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557624/"}]$rfa174$::jsonb
);

DO $check2$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_stage) <> 175 THEN
    RAISE EXCEPTION 'stage row count %, expected 175',
      (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_stage);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_audit80b_20261121_stage
    WHERE difficulty IS NOT NULL AND (difficulty < 1 OR difficulty > 5)
  ) THEN
    RAISE EXCEPTION 'difficulty outside 1-5';
  END IF;
END
$check2$;
COMMIT;
