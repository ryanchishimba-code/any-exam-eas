-- Hidden Step 1 batch 3 of the 2026-11-28 set.
-- active=false and qaPassed=false. stepLevel is step1.
-- Does not change served items. Go-live SQL is a separate file and is not part of this script.
BEGIN;
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280201', 'usmle-step-1', 'physiology',
  $sc$A 34-year-old woman who teaches chemistry compares two circulating signals. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. One signal is made from cholesterol, does not dissolve in water, and rides on a carrier protein. The other is cleared in about a minute and is derived from an amino acid.$sc$,
  $qu$Which of the following is required for the cholesterol-derived signal to travel in blood?$qu$,
  $op${"options": ["A bound carrier, because this signal is not water-soluble", "A second messenger, because the signal cannot leave the cell", "A membrane receptor, because the signal cannot cross the bilayer", "A sodium-driven pump, the same path thyroid hormone uses", "No carrier, because the signal dissolves freely in plasma"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "steroid-hormone-transport", "taskCategory": "mechanism"}$op$,
  $ky$A bound carrier, because this signal is not water-soluble$ky$,
  $ex$The best choice is "A bound carrier, because this signal is not water-soluble". Steroid hormones come from cholesterol and are hydrophobic, so they travel bound to transport proteins. That binding also lengthens half-life. Cortisol lasts about 60 to 90 minutes, while epinephrine, an amino-acid hormone, lasts about a minute. Her water-insoluble signal is the steroid. "A second messenger, because the signal cannot leave the cell" is not the best choice because A second messenger is how water-soluble hormones signal after binding a surface receptor. It is not how a steroid travels in blood. "A membrane receptor, because the signal cannot cross the bilayer" is not the best choice because Steroids cross the membrane to intracellular receptors. A surface receptor is the water-soluble pattern. "A sodium-driven pump, the same path thyroid hormone uses" is not the best choice because Thyroid hormone uses a carrier-mediated, energy- and sodium-dependent entry. Steroids diffuse through the bilayer. "No carrier, because the signal dissolves freely in plasma" is not the best choice because A steroid does not dissolve freely in plasma. It needs a transport protein.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '29a6119a9296809fe2dead84a22b220a075b2f796a0a163e84b3f68d6f7d4a78', false, NOW(), NOW(), 2,
  'steroid-hormone-transport', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'steroid-hormone-transport', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-201", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "A", "verifiedFact": "Steroid hormones are made from cholesterol, are not water soluble, and travel in blood bound to transport proteins. That binding extends their half-life. Cortisol's half-life is about 60 to 90 minutes. Epinephrine's is about one minute."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280202', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old man who studies cells applies a cholesterol-derived hormone to a target cell. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. The hormone crosses the lipid bilayer without a surface receptor. A water-soluble hormone in the same dish stops at the outer face of the membrane.$sc$,
  $qu$Which of the following receptor does the cholesterol-derived hormone use?$qu$,
  $op${"options": ["A receptor on the outer face of the membrane", "A receptor inside the cell, after crossing the membrane", "A G protein that makes cyclic AMP at the surface", "A sodium-dependent carrier, the thyroid-hormone path", "No receptor, because the hormone acts only in plasma"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "steroid-intracellular-receptor", "taskCategory": "mechanism"}$op$,
  $ky$A receptor inside the cell, after crossing the membrane$ky$,
  $ex$The best choice is "A receptor inside the cell, after crossing the membrane". Steroid hormones diffuse through the bilayer and bind intracellular receptors. His cholesterol-derived hormone crossed without a surface receptor. The water-soluble hormone stopped at the outer face. "A receptor on the outer face of the membrane" is not the best choice because Surface receptors are for water-soluble hormones that cannot cross the bilayer. "A G protein that makes cyclic AMP at the surface" is not the best choice because Cyclic AMP is a second messenger for many water-soluble hormones after a surface receptor activates a G protein. "A sodium-dependent carrier, the thyroid-hormone path" is not the best choice because Thyroid hormone, although from amino acids, crosses by a carrier that needs energy and sodium. Steroids diffuse. "No receptor, because the hormone acts only in plasma" is not the best choice because The hormone binds a receptor inside the cell. It does not act only in plasma.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '977f98952070bd8d29f09e13cfef8104b376c027a2d1fafb82aa80d075845958', false, NOW(), NOW(), 2,
  'steroid-intracellular-receptor', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'steroid-intracellular-receptor', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-202", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "B", "verifiedFact": "Steroid hormones diffuse through the membrane to intracellular receptors. Water-soluble amino-acid hormones, except thyroid hormone, bind surface receptors and use a second messenger."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280203', 'usmle-step-1', 'physiology',
  $sc$A 41-year-old woman who teaches biology adds a water-soluble hormone to liver cells. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. The hormone binds the outer membrane, a G protein turns on, and an enzyme converts ATP into a small intracellular signal. That signal turns on a kinase. The hormone never enters the cell.$sc$,
  $qu$Which of the following is the small intracellular signal made from ATP?$qu$,
  $op${"options": ["The steroid that crossed the bilayer to bind inside the cell", "The calcium released by inositol triphosphate", "The intracellular nucleotide produced from ATP", "The transport protein that carries cortisol in plasma", "The hormone itself, now acting as its own second message"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "camp-second-messenger", "taskCategory": "mechanism"}$op$,
  $ky$The intracellular nucleotide produced from ATP$ky$,
  $ex$The best choice is "The intracellular nucleotide produced from ATP". In the common water-soluble path, a surface receptor activates a G protein, which activates adenylyl cyclase, which makes cyclic AMP from ATP. Cyclic AMP then activates protein kinase. Her hormone stayed outside and ATP was converted into the intracellular signal. "The steroid that crossed the bilayer to bind inside the cell" is not the best choice because A steroid would have entered the cell. This hormone did not. "The calcium released by inositol triphosphate" is not the best choice because Inositol triphosphate releases calcium in the alternative pathway. The vignette specifies a signal made from ATP. "The transport protein that carries cortisol in plasma" is not the best choice because Cortisol's carrier keeps a steroid in the blood. It is not made from ATP inside the cell. "The hormone itself, now acting as its own second message" is not the best choice because The hormone is the first messenger. The small signal made from ATP is the second messenger.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b93680e110e31673bad71c474c94e9f0a048a9b8cd21982c49707c4b90199c97', false, NOW(), NOW(), 3,
  'camp-second-messenger', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'camp-second-messenger', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-203", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "C", "verifiedFact": "Most water-soluble hormones use cAMP. The hormone binds a surface receptor, activates a G protein, which activates adenylyl cyclase, which makes cAMP from ATP. cAMP activates protein kinase. Glucagon, calcitonin, and TSH use this path."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280204', 'usmle-step-1', 'physiology',
  $sc$A 38-year-old man who studies signaling adds a water-soluble hormone that does not raise cyclic AMP. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. A membrane enzyme splits a phospholipid into two pieces. One piece releases calcium from an internal store. The calcium then binds a small regulatory protein.$sc$,
  $qu$Which of the following released the calcium?$qu$,
  $op${"options": ["Cyclic AMP produced directly from ATP", "A steroid diffusing to a receptor in the nucleus", "The carrier protein that holds cortisol in plasma", "The split product that releases the stored cation", "Loss of surface receptors after prolonged exposure"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "ip3-calcium-messenger", "taskCategory": "mechanism"}$op$,
  $ky$The split product that releases the stored cation$ky$,
  $ex$The best choice is "The split product that releases the stored cation". Phospholipase C splits a membrane phospholipid into DAG and IP3. IP3 releases calcium from stores such as the smooth endoplasmic reticulum, and calcium can bind calmodulin. His hormone did not raise cyclic AMP, and calcium came from an internal store. "Cyclic AMP produced directly from ATP" is not the best choice because Cyclic AMP is the other second-messenger path. This hormone did not use it. "A steroid diffusing to a receptor in the nucleus" is not the best choice because A steroid would enter the cell. This hormone is water-soluble and acts through a membrane enzyme. "The carrier protein that holds cortisol in plasma" is not the best choice because Cortisol's carrier is for transport in blood, not for releasing intracellular calcium. "Loss of surface receptors after prolonged exposure" is not the best choice because Downregulation reduces receptor number when a hormone is chronically high. It does not release calcium.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '730f419f0d3edfcee0f386eea758157ce66702ddffd40a90880b4472bec6d10d', false, NOW(), NOW(), 4,
  'ip3-calcium-messenger', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ip3-calcium-messenger', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-204", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "D", "verifiedFact": "Some water-soluble hormones use calcium. Phospholipase C splits a membrane phospholipid into DAG and IP3. DAG activates kinases. IP3 releases calcium from the smooth endoplasmic reticulum. Calcium can bind calmodulin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280205', 'usmle-step-1', 'physiology',
  $sc$A 45-year-old woman who has had a high level of one hormone for months now responds less to it. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Her target cells have fewer receptors for that hormone than they did before the level stayed high. The hormone is still present.$sc$,
  $qu$Which of the following did the target cells do?$qu$,
  $op${"options": ["They increased the number of receptors for the abundant hormone", "They switched the hormone from a surface receptor to a nuclear one", "They lengthened the hormone's half-life to 60 minutes", "They started a positive feedback loop that releases still more", "They reduced the number of receptors for the abundant hormone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "downregulation-receptors", "taskCategory": "mechanism"}$op$,
  $ky$They reduced the number of receptors for the abundant hormone$ky$,
  $ex$The best choice is "They reduced the number of receptors for the abundant hormone". When a hormone stays high, target cells decrease receptor number so they respond less. That is downregulation. Her cells have fewer receptors after months of a high level, and the response has fallen. "They increased the number of receptors for the abundant hormone" is not the best choice because Increasing receptor number is upregulation, which happens when a hormone is chronically low, not high. "They switched the hormone from a surface receptor to a nuclear one" is not the best choice because Receptor location is set by whether the hormone is a steroid or water-soluble. A high level does not move the receptor from the surface to the nucleus. "They lengthened the hormone's half-life to 60 minutes" is not the best choice because Half-life is a property of the hormone's chemistry and binding to carriers, not of receptor count. "They started a positive feedback loop that releases still more" is not the best choice because Positive feedback would increase release further. Her cells became less reactive.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ea99922864b27dc9961c7cba3633099900490a539fbc11cb142b6b55594e3223', false, NOW(), NOW(), 2,
  'downregulation-receptors', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'downregulation-receptors', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-205", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "E", "verifiedFact": "Chronically high hormone levels cause target cells to decrease receptor number, called downregulation. Chronically low levels cause upregulation, an increase in receptor number."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280206', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old woman in labor has contractions that keep getting stronger. Temperature is 37.0°C, pulse is 96/min, respirations are 20/min, and blood pressure is 128/76 mm Hg. Each contraction pushes the fetus down, the cervix stretches, and the pituitary releases more of the same hormone. After the baby is born, that release falls.$sc$,
  $qu$Which of the following kind of loop is this?$qu$,
  $op${"options": ["The response increases the signal until the birth is finished", "The response inhibits the signal once the level is adequate", "Target cells remove receptors because the hormone is high", "Two opposing hormones cancel each other at the liver", "A carrier protein simply prolongs the hormone's half-life"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "oxytocin-positive-feedback", "taskCategory": "mechanism"}$op$,
  $ky$The response increases the signal until the birth is finished$ky$,
  $ex$The best choice is "The response increases the signal until the birth is finished". Oxytocin release in labor is positive feedback. Contractions stretch the cervix, which causes more oxytocin, until birth, when release falls. Her contractions are strengthening through that loop. "The response inhibits the signal once the level is adequate" is not the best choice because Inhibition once the level is adequate is negative feedback, the more common pattern, illustrated by glucocorticoids. "Target cells remove receptors because the hormone is high" is not the best choice because Fewer receptors is downregulation. It would weaken the response, not strengthen the contractions. "Two opposing hormones cancel each other at the liver" is not the best choice because Insulin and glucagon are the opposing pair at the liver. They are not this labor loop. "A carrier protein simply prolongs the hormone's half-life" is not the best choice because A transport protein lengthens steroid half-life. It does not make contractions escalate until birth.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ec5d06c5d387ee0aa0ddd2684b0a51abbe3e027cc047d278ee313fe92fb4367b', false, NOW(), NOW(), 2,
  'oxytocin-positive-feedback', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'oxytocin-positive-feedback', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-206", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "A", "verifiedFact": "Oxytocin in labor is positive feedback. Contractions push the fetus, the cervix stretches, and the pituitary releases more oxytocin until birth, after which release falls."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280207', 'usmle-step-1', 'physiology',
  $sc$A 52-year-old man who keeps books has a rising adrenal hormone that affects metabolism. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 136/82 mm Hg. As the blood level rises, the hypothalamus and pituitary send less drive to the adrenal gland. Secretion then levels off inside a narrow range.$sc$,
  $qu$Which of the following is this control pattern?$qu$,
  $op${"options": ["A rising level causes still more secretion until birth", "A rising level turns off the drive for more secretion", "Target cells add receptors because the level is high", "Two hormones with the same effect multiply the response", "The hormone must bind a plasma carrier to be measured"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glucocorticoid-negative-feedback", "taskCategory": "mechanism"}$op$,
  $ky$A rising level turns off the drive for more secretion$ky$,
  $ex$The best choice is "A rising level turns off the drive for more secretion". Negative feedback inhibits further secretion once the level is adequate. Rising glucocorticoids tell the hypothalamus and pituitary to reduce adrenal drive. His level rises and the upstream signals fall, keeping the hormone in a narrow range. "A rising level causes still more secretion until birth" is not the best choice because Escalating secretion until an endpoint is positive feedback, as with oxytocin in labor. "Target cells add receptors because the level is high" is not the best choice because High levels cause fewer receptors, not more. More receptors happen when the hormone is chronically low. "Two hormones with the same effect multiply the response" is not the best choice because Two hormones amplifying one effect is synergism, such as FSH and estrogen for egg maturation. "The hormone must bind a plasma carrier to be measured" is not the best choice because Carrier binding is how steroids travel. It is not the feedback that reduced adrenal drive.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'eb8db714ce69ece622295ec64c4b85b08bd569d92303b252e2b74bd90844e13b', false, NOW(), NOW(), 2,
  'glucocorticoid-negative-feedback', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'glucocorticoid-negative-feedback', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-207", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "B", "verifiedFact": "Negative feedback is the common pattern. Rising glucocorticoids cause the hypothalamus and pituitary to reduce the signals that tell the adrenal to secrete more."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280208', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old woman who teaches cooking has two pancreatic signals. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. One signal makes the liver store glucose as glycogen and the blood glucose falls. The other breaks that store down and the blood glucose rises. She is fasting, and the second signal dominates.$sc$,
  $qu$Which of the following is the relationship of these two signals?$qu$,
  $op${"options": ["Each one enables the other to act on the liver", "Together they produce a larger effect than either alone", "They push blood glucose in opposite directions", "A high level of either one removes the other's receptors", "Both must bind intracellular receptors to be active"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "insulin-glucagon-antagonism", "taskCategory": "mechanism"}$op$,
  $ky$They push blood glucose in opposite directions$ky$,
  $ex$The best choice is "They push blood glucose in opposite directions". Insulin and glucagon are antagonistic. Insulin stores glucose as glycogen and lowers blood glucose. Glucagon breaks glycogen down and raises it. She is fasting, so the raising signal dominates. "Each one enables the other to act on the liver" is not the best choice because One hormone enabling another is a permissive effect, as with thyroid hormone and some reproductive hormones. "Together they produce a larger effect than either alone" is not the best choice because A combined larger effect is synergism. These two oppose each other. "A high level of either one removes the other's receptors" is not the best choice because Receptor loss from a high level is downregulation of that hormone's own receptors, not this pair's relationship. "Both must bind intracellular receptors to be active" is not the best choice because Both are peptide hormones and use surface receptors. They do not need intracellular steroid receptors.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '7e838cff802d6726a5b57fe362b6e9de309881a831bda3dc5ccfade6747b9c3a', false, NOW(), NOW(), 2,
  'insulin-glucagon-antagonism', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'insulin-glucagon-antagonism', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-208", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "C", "verifiedFact": "Antagonistic hormones oppose each other. Insulin increases liver storage of glucose as glycogen and lowers blood glucose. Glucagon breaks glycogen down and raises blood glucose."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280209', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old woman who is trying to conceive has follicles that do not mature. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. She has ovarian estrogen but almost none of the pituitary signal that must act with it. Egg cells do not finish maturing.$sc$,
  $qu$Which of the following is missing for the egg cells to mature?$qu$,
  $op${"options": ["Insulin, which would store glucose and replace estrogen", "A positive feedback loop of oxytocin on the uterus", "Downregulation of every estrogen receptor", "The glandular partner estrogen needs for egg maturation", "A plasma carrier that would shorten estrogen's half-life"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fsh-estrogen-synergy", "taskCategory": "mechanism"}$op$,
  $ky$The glandular partner estrogen needs for egg maturation$ky$,
  $ex$The best choice is "The glandular partner estrogen needs for egg maturation". Maturation of ova requires both FSH from the pituitary and estrogen from the ovary. She has estrogen and lacks the pituitary partner, so the eggs do not mature. "Insulin, which would store glucose and replace estrogen" is not the best choice because Insulin and glucagon regulate glucose. Insulin does not replace the pituitary signal for egg maturation. "A positive feedback loop of oxytocin on the uterus" is not the best choice because Oxytocin's positive feedback is labor, not follicular maturation. "Downregulation of every estrogen receptor" is not the best choice because Downregulation would remove receptors. Her problem is a missing hormone, not excess receptor loss. "A plasma carrier that would shorten estrogen's half-life" is not the best choice because A carrier lengthens steroid half-life. It does not replace the missing pituitary signal.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9ae3bb1e6f7750fe981aae0cf408722fafe498d314d0532df42285b616d9dcae', false, NOW(), NOW(), 3,
  'fsh-estrogen-synergy', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'fsh-estrogen-synergy', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-209", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": false, "keyLetter": "D", "verifiedFact": "Synergism: FSH from the pituitary and estrogens from the ovary are both required for maturation of ova."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280210', 'usmle-step-1', 'physiology',
  $sc$A 15-year-old girl who eats no seafood or iodized salt has delayed reproductive development. Temperature is 36.4°C, pulse is 58/min, respirations are 12/min, and blood pressure is 100/64 mm Hg. The hormone that contains the missing dietary element is low. Reproductive hormones are present but do not act normally.$sc$,
  $qu$Which of the following best describes the missing hormone's role?$qu$,
  $op${"options": ["It opposes estrogen the way glucagon opposes insulin", "It is the positive feedback signal of labor", "It travels free in plasma because it is a steroid", "It uses cyclic AMP even though it is thyroid hormone", "Those gonadal signals cannot act unless it is there"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "thyroid-permissive-iodine", "taskCategory": "mechanism"}$op$,
  $ky$Those gonadal signals cannot act unless it is there$ky$,
  $ex$The best choice is "Those gonadal signals cannot act unless it is there". Thyroid hormone has a permissive relationship with some reproductive hormones: it must be present for them to act. Iodine is part of thyroid hormone, so a diet without iodine can impair reproductive development. She lacks that dietary element and reproductive hormones are present but ineffective. "It opposes estrogen the way glucagon opposes insulin" is not the best choice because Opposition is antagonism, the insulin-glucagon pattern, not the thyroid relationship. "It is the positive feedback signal of labor" is not the best choice because Labor's escalating signal is oxytocin. "It travels free in plasma because it is a steroid" is not the best choice because Thyroid hormone is lipid-soluble but is not described as a steroid that travels free. Steroids use carriers. "It uses cyclic AMP even though it is thyroid hormone" is not the best choice because Thyroid hormone crosses by a carrier and is not the usual cyclic AMP surface-receptor hormone.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'd8ab8d9a4adedc5e82201e06c8990a8f8c513acd8ad575afec5d602a021e70d8', false, NOW(), NOW(), 3,
  'thyroid-permissive-iodine', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'thyroid-permissive-iodine', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-210", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones", "nutrition": true, "keyLetter": "E", "verifiedFact": "A permissive effect means one hormone allows another to act. Thyroid hormone is permissive for some reproductive hormones. Iodine deficiency can therefore impair reproductive development."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280211', 'usmle-step-1', 'physiology',
  $sc$A 16-year-old girl has just had her first menstrual period. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The egg cells in her ovaries were formed before she was born and have been paused in the first division since then. They now begin to resume that division, one cycle at a time.$sc$,
  $qu$Which of the following is true of those paused cells?$qu$,
  $op${"options": ["They were made in fetal life and then held at the first meiotic stop", "They are made new from stem cells each month after puberty", "They finish both divisions before they leave the ovary", "They are haploid from the moment they are formed", "Their number rises from puberty until menopause"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "oogonia-arrest-meiosis", "taskCategory": "mechanism"}$op$,
  $ky$They were made in fetal life and then held at the first meiotic stop$ky$,
  $ex$The best choice is "They were made in fetal life and then held at the first meiotic stop". Oogonia become primary oocytes in the fetal ovary and arrest in meiosis I until puberty. She has just reached menarche, and those cells were paused since before birth. "They are made new from stem cells each month after puberty" is not the best choice because New oocytes are not produced each month. The pool was set before birth. "They finish both divisions before they leave the ovary" is not the best choice because The secondary oocyte finishes meiosis II only if a sperm penetrates it, which is after ovulation. "They are haploid from the moment they are formed" is not the best choice because Primary oocytes are still diploid while paused in meiosis I. The ovum is a brief haploid stage at fertilization. "Their number rises from puberty until menopause" is not the best choice because The count falls, from about one to two million in infancy to about 400,000 at puberty and to zero by the end of menopause.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'adea3321d345f90d4d91f4ca502819430b926fb85255f0d5e6928686ace7fb14', false, NOW(), NOW(), 3,
  'oogonia-arrest-meiosis', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'oogonia-arrest-meiosis', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-211", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "A", "verifiedFact": "Oogonia form primary oocytes in the fetal ovary before birth and arrest in meiosis I until puberty. Counts fall from 1-2 million in an infant to about 400,000 at puberty to zero at menopause."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280212', 'usmle-step-1', 'physiology',
  $sc$A 26-year-old woman is at midcycle. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 112/70 mm Hg. Estrogen from one follicle is so high that the pituitary releases a large burst of a gonadotropin. That burst restarts division in the egg cell and enzymes weaken the ovary wall so the egg is expelled.$sc$,
  $qu$Which of the following caused the burst of gonadotropin?$qu$,
  $op${"options": ["Low estrogen removed negative feedback and the pituitary stopped", "Extremely high estrogen switched the pituitary to release more", "Progesterone from the corpus luteum started a new follicle", "Falling FSH killed the dominant follicle before release", "Oxytocin released in labor because the cervix stretched"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "lh-surge-ovulation", "taskCategory": "mechanism"}$op$,
  $ky$Extremely high estrogen switched the pituitary to release more$ky$,
  $ex$The best choice is "Extremely high estrogen switched the pituitary to release more". Once only the dominant follicle remains, its very high estrogen switches the pituitary from negative feedback to a large release of LH and FSH. The LH surge restarts meiosis and activates proteases that help the wall rupture. She is at midcycle with that pattern. "Low estrogen removed negative feedback and the pituitary stopped" is not the best choice because Moderate high estrogen reduces GnRH, LH, and FSH. Only the extreme level from the dominant follicle switches to more release. "Progesterone from the corpus luteum started a new follicle" is not the best choice because Progesterone from the corpus luteum keeps GnRH, LH, and FSH low so no new dominant follicle develops. "Falling FSH killed the dominant follicle before release" is not the best choice because A fall in FSH causes most tertiary follicles to die. The dominant follicle survives and then drives the surge. "Oxytocin released in labor because the cervix stretched" is not the best choice because Oxytocin's feedback is labor, not ovulation.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '997e32dc8e498ad8e71e84b779fd27946bbd6824d7b6cf88a8d812a43d76cc78', false, NOW(), NOW(), 3,
  'lh-surge-ovulation', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lh-surge-ovulation', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-212", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "B", "verifiedFact": "Very high estrogen from the dominant follicle switches to positive feedback and causes an LH surge. The surge resumes meiosis and triggers proteases that help the follicle wall rupture."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280213', 'usmle-step-1', 'physiology',
  $sc$A 30-year-old woman is a week past ovulation and is not pregnant. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The collapsed follicle has become a yellowish body that secretes a steroid needed to maintain an early pregnancy. That body will stop secreting and degrade if pregnancy does not start within about 10 to 12 days.$sc$,
  $qu$Which of the following is the main steroid this body secretes?$qu$,
  $op${"options": ["The pituitary drive that made the follicle grow", "The estrogen that caused the midcycle gonadotropin burst", "The luteal product that keeps early gestation going", "Insulin, which stores glucose in the liver as glycogen", "Cortisol secreted by the adrenal cortex"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "corpus-luteum-progesterone", "taskCategory": "mechanism"}$op$,
  $ky$The luteal product that keeps early gestation going$ky$,
  $ex$The best choice is "The luteal product that keeps early gestation going". After ovulation, the remaining cells become the corpus luteum and secrete progesterone, which maintains early pregnancy. Without pregnancy in 10 to 12 days it stops and becomes the corpus albicans. She is a week past ovulation. "The pituitary drive that made the follicle grow" is not the best choice because FSH is the pituitary signal that grows follicles. The yellowish body is ovarian. "The estrogen that caused the midcycle gonadotropin burst" is not the best choice because The dominant follicle's estrogen drives the LH surge before ovulation. After ovulation the luteal cells mainly secrete progesterone. "Insulin, which stores glucose in the liver as glycogen" is not the best choice because Insulin is a pancreatic peptide, not the luteal steroid. "Cortisol secreted by the adrenal cortex" is not the best choice because Cortisol is an adrenal steroid with a 60 to 90 minute half-life. It is not this ovarian product.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9490d07a8c8e926daf6bc035ea935f492c492cb2c2607848ff702e09b4a631c9', false, NOW(), NOW(), 2,
  'corpus-luteum-progesterone', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'corpus-luteum-progesterone', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-213", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "C", "verifiedFact": "After ovulation, LH luteinizes the remaining granulosa and theca cells into the corpus luteum, which secretes large amounts of progesterone. If no pregnancy in 10-12 days, it becomes the corpus albicans."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280214', 'usmle-step-1', 'physiology',
  $sc$A 25-year-old woman is early in the follicular phase. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Several large follicles are making estrogen. The estrogen lowers a pituitary signal those follicles need. All but one of them die.$sc$,
  $qu$Which of the following lets one follicle survive that drop?$qu$,
  $op${"options": ["It switches to progesterone and ignores the pituitary", "It is a primordial follicle with one flat cell layer", "It has already become the whitish nonfunctional body", "It has more cells and more receptors for the falling signal", "It uses oxytocin instead of the falling signal"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "dominant-follicle-fsh", "taskCategory": "mechanism"}$op$,
  $ky$It has more cells and more receptors for the falling signal$ky$,
  $ex$The best choice is "It has more cells and more receptors for the falling signal". High estrogen lowers FSH, and most tertiary follicles die because they need FSH. The survivor is larger, with more granulosa cells and more FSH receptors. She is in that selection step. "It switches to progesterone and ignores the pituitary" is not the best choice because Progesterone is the corpus luteum's product after ovulation, not the signal that saves one growing follicle. "It is a primordial follicle with one flat cell layer" is not the best choice because A primordial follicle has a single flat layer of granulosa cells and is resting. The follicles dying here are tertiary. "It has already become the whitish nonfunctional body" is not the best choice because The corpus albicans is the degraded corpus luteum, not a growing follicle. "It uses oxytocin instead of the falling signal" is not the best choice because Oxytocin is the labor hormone. Follicle survival depends on FSH receptors.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4577ac72d14ddbb97bbd8e12b096279cc3d7f87fe9d16441c07d9657b47d7c5b', false, NOW(), NOW(), 3,
  'dominant-follicle-fsh', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'dominant-follicle-fsh', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-214", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "Rising estrogen from growing follicles lowers FSH. Most tertiary follicles die from the FSH drop. One survives, the dominant follicle, favored by size, granulosa-cell number, and FSH receptors."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280215', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old woman has just ovulated. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. The cell that left the ovary is still diploid and has not finished its second division. That division finishes only if a male gamete gets through its coverings.$sc$,
  $qu$Which of the following must happen before a haploid ovum forms?$qu$,
  $op${"options": ["The yellowish body must later degrade into a whitish body", "FSH must fall so that every tertiary follicle dies", "The cell must finish both divisions while still in the ovary", "Estrogen must stay low for the entire luteal phase", "A sperm cell has to cross the oocyte's outer coats"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "secondary-oocyte-meiosis-ii", "taskCategory": "mechanism"}$op$,
  $ky$A sperm cell has to cross the oocyte's outer coats$ky$,
  $ex$The best choice is "A sperm cell has to cross the oocyte's outer coats". Meiosis II of the secondary oocyte finishes only if a sperm penetrates it. The haploid ovum exists briefly and, at fertilization, becomes the diploid zygote. Her ovulated cell is still waiting for that. "The yellowish body must later degrade into a whitish body" is not the best choice because The corpus albicans forms if there is no pregnancy. It is not the step that finishes meiosis II. "FSH must fall so that every tertiary follicle dies" is not the best choice because An FSH drop selects the dominant follicle earlier. It does not complete the second division. "The cell must finish both divisions while still in the ovary" is not the best choice because The first division resumes just before ovulation. The second finishes only after sperm entry. "Estrogen must stay low for the entire luteal phase" is not the best choice because The luteal phase is dominated by progesterone, not by a requirement for low estrogen to make the ovum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '827ceb61ae78ac1166100498512f57cc2dfdb24b2dbb4c1c17725462ac1c04e6', false, NOW(), NOW(), 3,
  'secondary-oocyte-meiosis-ii', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secondary-oocyte-meiosis-ii', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-215", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "E", "verifiedFact": "The secondary oocyte completes meiosis II only if a sperm penetrates it, producing a haploid ovum that becomes a diploid zygote at fertilization. Polar bodies degrade."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280216', 'usmle-step-1', 'anatomy',
  $sc$A 22-year-old woman has an ovary examined in anatomy lab. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Under a cuboidal surface and a dense connective-tissue coat, follicles sit in the outer tissue. Vessels, lymphatics, and nerves occupy the inner region.$sc$,
  $qu$Which of the following is the inner region of the ovary?$qu$,
  $op${"options": ["The inner region with the blood supply and nerve supply", "The region where the follicles and oocytes develop", "The cuboidal epithelium on the surface", "The dense coat just under that epithelium", "The single flat cell layer of a resting follicle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "ovary-cortex-medulla", "taskCategory": "anatomy"}$op$,
  $ky$The inner region with the blood supply and nerve supply$ky$,
  $ex$The best choice is "The inner region with the blood supply and nerve supply". The ovarian medulla is the inner region and contains blood vessels, lymph vessels, and nerves. Follicles are in the cortex, outside that. "The region where the follicles and oocytes develop" is not the best choice because Oocytes develop in the cortex, the outer portion under the tunica albuginea. "The cuboidal epithelium on the surface" is not the best choice because The surface is cuboidal epithelium, superficial to the tunica albuginea. It is not the inner region. "The dense coat just under that epithelium" is not the best choice because The tunica albuginea is the dense coat under the surface epithelium. "The single flat cell layer of a resting follicle" is not the best choice because A single flat granulosa layer describes a primordial follicle in the cortex, not the medulla.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '281de25835619d36b65b79103bc635eaab7baa502cb58e0b9175d0d0aa086805', false, NOW(), NOW(), 2,
  'ovary-cortex-medulla', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'ovary-cortex-medulla', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-216", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "A", "verifiedFact": "The ovary has surface cuboidal epithelium, then tunica albuginea, then cortex with stroma and follicles, then medulla with vessels, lymph, and nerves."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280217', 'usmle-step-1', 'histology',
  $sc$A 23-year-old woman has a growing follicle with several layers of support cells and a forming fluid space. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The egg cell inside secretes a thin coat with no cells in it. That coat will matter when a sperm arrives.$sc$,
  $qu$Which of the following secreted that coat?$qu$,
  $op${"options": ["The theca cells that make estrogen with the granulosa cells", "The oocyte itself secretes that acellular coat", "The yellowish body left after the oocyte departs", "The cuboidal epithelium on the ovary surface", "The pituitary, as part of the midcycle burst"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "zona-pellucida", "taskCategory": "histology"}$op$,
  $ky$The oocyte itself secretes that acellular coat$ky$,
  $ex$The best choice is "The oocyte itself secretes that acellular coat". In a secondary follicle the primary oocyte secretes the zona pellucida, a thin acellular membrane that is important in fertilization. Her follicle is at that growing stage. "The theca cells that make estrogen with the granulosa cells" is not the best choice because Theca cells, with granulosa cells, produce estrogens. They do not secrete the zona. "The yellowish body left after the oocyte departs" is not the best choice because The yellowish body left after ovulation forms after ovulation from cells left behind. It secretes progesterone. "The cuboidal epithelium on the ovary surface" is not the best choice because Surface epithelium covers the ovary. It does not coat the oocyte. "The pituitary, as part of the midcycle burst" is not the best choice because The LH surge triggers ovulation. It does not secrete the oocyte's coat.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '748d139496eb178364dcb8f016ae6904712d295efe2a22577bef0d1895322785', false, NOW(), NOW(), 2,
  'zona-pellucida', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'histology', 'zona-pellucida', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-217", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "B", "verifiedFact": "In the secondary follicle the primary oocyte secretes the zona pellucida, a thin acellular membrane important in fertilization."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280218', 'usmle-step-1', 'physiology',
  $sc$A 21-year-old woman is in the first half of a 28-day cycle. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The hypothalamus releases a signal, the anterior pituitary releases two gonadotropins, and growing follicles secrete estrogen. Ovulation has not happened.$sc$,
  $qu$Which of the following is this phase of the ovarian cycle?$qu$,
  $op${"options": ["The phase of progesterone from the yellowish body", "The phase after the yellowish body has turned white", "The pre-ovulatory phase of follicle growth and estrogen secretion", "The phase in which labor contractions escalate", "The phase in which no follicles remain, after menopause"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "follicular-phase-estrogen", "taskCategory": "mechanism"}$op$,
  $ky$The pre-ovulatory phase of follicle growth and estrogen secretion$ky$,
  $ex$The best choice is "The pre-ovulatory phase of follicle growth and estrogen secretion". The follicular phase is the growth of tertiary follicles with estrogen secretion, driven by GnRH, FSH, and LH, before ovulation. She is in the first half of the cycle and has not ovulated. "The phase of progesterone from the yellowish body" is not the best choice because Progesterone from the corpus luteum defines the luteal phase, after ovulation. "The phase after the yellowish body has turned white" is not the best choice because The corpus albicans is the degraded corpus luteum if pregnancy does not occur. "The phase in which labor contractions escalate" is not the best choice because Escalating contractions are oxytocin in labor, not the ovarian follicular phase. "The phase in which no follicles remain, after menopause" is not the best choice because Menopause is the end of reproductive function, when follicles are gone. She is cycling.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '25030ea8ce516b234a168233f8b5283ee4f444e4b8da24dec878d726de8b3383', false, NOW(), NOW(), 2,
  'follicular-phase-estrogen', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'follicular-phase-estrogen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-218", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "C", "verifiedFact": "The follicular phase is when tertiary follicles grow and secrete estrogen. GnRH from the hypothalamus makes the anterior pituitary release FSH and LH. FSH grows the follicles. LH stimulates estradiol."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280219', 'usmle-step-1', 'anatomy',
  $sc$A 17-year-old girl asks about a thin membrane that partly covers the vaginal opening. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 108/64 mm Hg. The membrane was already only partial at birth so menstrual fluid can leave. She has never had penile-vaginal intercourse.$sc$,
  $qu$Which of the following is true of that membrane?$qu$,
  $op${"options": ["A complete sheet at birth would still let menses out", "It is the same structure as the greater vestibular glands", "It is the cuboidal covering of the ovary", "Its presence or absence does not prove sexual history", "It closes completely after the first menstrual period"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "hymen-not-virginity", "taskCategory": "anatomy"}$op$,
  $ky$Its presence or absence does not prove sexual history$ky$,
  $ex$The best choice is "Its presence or absence does not prove sexual history". An intact hymen cannot be used as a sign of virginity. Even at birth it is only a partial membrane so menstrual fluid and other secretions can exit. She has that partial membrane. "A complete sheet at birth would still let menses out" is not the best choice because A complete sheet would block exit of menstrual fluid. The membrane is partial for that reason. "It is the same structure as the greater vestibular glands" is not the best choice because Bartholin glands, the greater vestibular glands, open beside the vaginal entrance. They are not the hymen. "It is the cuboidal covering of the ovary" is not the best choice because The ovary's surface is cuboidal epithelium, inside the pelvis, not this membrane. "It closes completely after the first menstrual period" is not the best choice because The hymen does not seal after menarche. Secretions must still be able to leave.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'a8228b5d4d0b70ed9bd6592433a34d3741f506f03ec03e6eccd7c5424443b03c', false, NOW(), NOW(), 2,
  'hymen-not-virginity', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'hymen-not-virginity', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-219", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "The hymen is a thin membrane that sometimes partly covers the vaginal entrance. An intact hymen cannot indicate virginity. Even at birth it is only partial so secretions can exit."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280220', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old woman has regular cycles. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 106/66 mm Hg. A signal from the base of the brain tells the anterior pituitary to release two hormones. Those two reach the ovary in the blood and bind follicle cells.$sc$,
  $qu$Which of the following releases the two hormones that bind the follicle?$qu$,
  $op${"options": ["The yellowish body left after ovulation, as its only products", "The granulosa cells, before any pituitary signal", "The adrenal cortex, as cortisol and aldosterone", "The posterior pituitary, as oxytocin in labor", "The anterior pituitary, after a signal from the brain"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gnrh-gonadotropins", "taskCategory": "mechanism"}$op$,
  $ky$The anterior pituitary, after a signal from the brain$ky$,
  $ex$The best choice is "The anterior pituitary, after a signal from the brain". GnRH from the hypothalamus makes the anterior pituitary release FSH and LH, which bind granulosa and theca cells. Her cycles use that sequence. "The yellowish body left after ovulation, as its only products" is not the best choice because The yellowish body left after ovulation secretes progesterone after ovulation. It is not the source of the two gonadotropins. "The granulosa cells, before any pituitary signal" is not the best choice because Granulosa and theca cells make estrogen in response to LH. They do not release FSH and LH. "The adrenal cortex, as cortisol and aldosterone" is not the best choice because Cortisol and aldosterone are adrenal steroids, not the gonadotropins. "The posterior pituitary, as oxytocin in labor" is not the best choice because Oxytocin in labor is a different feedback loop. FSH and LH come from the anterior pituitary.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '5bd603af753c6cf6e4ad3c8c01ff43b8afebc34fea0ff07167505b8205ca164d', false, NOW(), NOW(), 2,
  'gnrh-gonadotropins', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gnrh-gonadotropins', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-220", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system", "nutrition": false, "keyLetter": "E", "verifiedFact": "The hypothalamus produces GnRH, which signals the anterior pituitary to produce FSH and LH. Those travel in blood to granulosa and theca cells."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280221', 'usmle-step-1', 'histology',
  $sc$A 17-year-old boy who plays soccer tears a piece of the cartilage in his knee. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. The tissue has no blood vessels. Nutrients reach the cells only by moving through the matrix. The tear heals slowly.$sc$,
  $qu$Which of the following explains the slow healing?$qu$,
  $op${"options": ["It has no blood supply, so nutrients cross the ground substance", "Osteoblasts have already replaced the entire cartilage model", "The epiphyseal line has sealed and growth has stopped", "Compact bone cannot form without a cartilage template", "Five to ten percent of the skeleton is remodeled each year"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "cartilage-avascular", "taskCategory": "histology"}$op$,
  $ky$It has no blood supply, so nutrients cross the ground substance$ky$,
  $ex$The best choice is "It has no blood supply, so nutrients cross the ground substance". Cartilage has no blood vessels. Nutrients and wastes move by diffusion through the matrix, so damaged cartilage does not repair as readily as most tissues. His knee cartilage is that tissue. "Osteoblasts have already replaced the entire cartilage model" is not the best choice because Endochondral bone replaces a cartilage model during development. His injury is a tear in existing cartilage. "The epiphyseal line has sealed and growth has stopped" is not the best choice because The epiphyseal line is the remnant after longitudinal growth stops. It does not explain a cartilage tear. "Compact bone cannot form without a cartilage template" is not the best choice because Flat bones of the skull, face, and clavicle form by intramembranous ossification, without a cartilage model. "Five to ten percent of the skeleton is remodeled each year" is not the best choice because Annual remodeling of 5 to 10 percent is adult bone turnover, not the reason cartilage heals slowly.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '09d6a487ff8411333c73299bb823947f45c1aee81adee9ec11dcd426209f69ce', false, NOW(), NOW(), 2,
  'cartilage-avascular', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'histology', 'cartilage-avascular', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-221", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "A", "verifiedFact": "Cartilage is avascular. Nutrients and wastes move by diffusion, which is why damaged cartilage repairs poorly."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280222', 'usmle-step-1', 'anatomy',
  $sc$A newborn's skull and collarbones are not fully hardened, which lets the head and shoulders change shape in the birth canal. Temperature is 36.8°C, pulse is 140/min, respirations are 40/min, and blood pressure is not measured. These bones formed directly from sheets of embryonic connective tissue, not by replacing a cartilage model.$sc$,
  $qu$Which of the following bones form by that direct path?$qu$,
  $op${"options": ["The long bones of the limbs and the skull base", "Most cranial bones, the facial bones, and the collarbones", "Only the epiphyseal plates of growing long bones", "Only articular cartilage that remains at joint surfaces", "The medullary cavity, which is never bone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "intramembranous-skull", "taskCategory": "anatomy"}$op$,
  $ky$Most cranial bones, the facial bones, and the collarbones$ky$,
  $ex$The best choice is "Most cranial bones, the facial bones, and the collarbones". Intramembranous ossification builds bone directly from mesenchyme. Most cranial bones, the flat facial bones, and the clavicles form this way. The newborn's skull and collarbones are those bones. "The long bones of the limbs and the skull base" is not the best choice because Long bones and the base of the skull form by endochondral ossification, replacing hyaline cartilage. "Only the epiphyseal plates of growing long bones" is not the best choice because The epiphyseal plate is hyaline cartilage that lengthens a long bone. It is not the intramembranous path. "Only articular cartilage that remains at joint surfaces" is not the best choice because Articular cartilage remains at joint surfaces. It is not bone formed from mesenchyme. "The medullary cavity, which is never bone" is not the best choice because The medullary cavity is the marrow space inside a long bone, formed as cartilage is replaced.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'f9f118796be922d3305d53908600b2f888029844f3fc529a5741da9236dad395', false, NOW(), NOW(), 2,
  'intramembranous-skull', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'intramembranous-skull', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-222", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "B", "verifiedFact": "Intramembranous ossification forms bone directly from mesenchyme. Flat bones of the face, most cranial bones, and the clavicles form this way."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280223', 'usmle-step-1', 'physiology',
  $sc$A fetal femur at eight weeks is a cartilage model. Temperature is not measured. Blood vessels later enter the model, the central cells die as the matrix hardens, and bone is laid down in their place. The cartilage does not itself become bone. Slide number 14 is the matching section.$sc$,
  $qu$Which of the following describes this replacement?$qu$,
  $op${"options": ["The cartilage cells turn directly into osteocytes", "The bone forms from mesenchyme with no cartilage model", "Bone is laid down where the cartilage model is removed", "Growth in width stops as soon as length stops", "The entire model remains cartilage in the adult"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "endochondral-replaces-cartilage", "taskCategory": "mechanism"}$op$,
  $ky$Bone is laid down where the cartilage model is removed$ky$,
  $ex$The best choice is "Bone is laid down where the cartilage model is removed". Endochondral ossification uses hyaline cartilage as a template that is replaced by bone. Cartilage does not become bone. The fetal femur follows that path. "The cartilage cells turn directly into osteocytes" is not the best choice because Chondrocytes die when the matrix calcifies and nutrients cannot reach them. They do not become osteocytes. "The bone forms from mesenchyme with no cartilage model" is not the best choice because Formation from mesenchyme without cartilage is intramembranous ossification, used by skull, face, and clavicle. "Growth in width stops as soon as length stops" is not the best choice because Appositional growth in diameter can continue after longitudinal growth stops. "The entire model remains cartilage in the adult" is not the best choice because In the adult, cartilage remains at the joint surface and, until growth ends, at the epiphyseal plate. The shaft is bone.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '46295cd4fa4335ac5fdea307f2c30ce021f13dd07dbf4b95858038f70a42375a', false, NOW(), NOW(), 2,
  'endochondral-replaces-cartilage', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'endochondral-replaces-cartilage', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-223", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "C", "verifiedFact": "In endochondral ossification, bone replaces hyaline cartilage. Cartilage does not turn into bone. Long bones and the skull base use this path."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280224', 'usmle-step-1', 'physiology',
  $sc$A 12-year-old boy is growing taller. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. In each long bone a cartilage plate adds new cartilage toward the end of the bone and bone replaces cartilage toward the shaft. When the cartilage cells stop dividing, only a line remains.$sc$,
  $qu$Which of the following lengthens the bone?$qu$,
  $op${"options": ["Bone added only under the periosteum, increasing width", "Osteoclasts widening the marrow cavity with no new bone", "Direct formation from mesenchyme, as in the clavicle", "New cartilage on the end side and bone added on the shaft side", "A cartilage model that never receives blood vessels"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "epiphyseal-plate-length", "taskCategory": "mechanism"}$op$,
  $ky$New cartilage on the end side and bone added on the shaft side$ky$,
  $ex$The best choice is "New cartilage on the end side and bone added on the shaft side". The epiphyseal plate makes cartilage on the epiphyseal side and ossifies it on the diaphyseal side, so the shaft lengthens. When chondrocytes stop proliferating, the plate becomes the epiphyseal line. He is still growing. "Bone added only under the periosteum, increasing width" is not the best choice because Bone under the periosteum with resorption inside is appositional growth in diameter, not length. "Osteoclasts widening the marrow cavity with no new bone" is not the best choice because Osteoclasts resorb the medullary lining during modeling. Length requires the plate. "Direct formation from mesenchyme, as in the clavicle" is not the best choice because The clavicle forms by intramembranous ossification. Long-bone length uses the growth plate. "A cartilage model that never receives blood vessels" is not the best choice because Endochondral growth requires vessels that bring osteoblasts into the calcified zone.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd4e4b461c1b5c29bc0df5887481af471f46e184736cbea91a4dd73226abe7e8c', false, NOW(), NOW(), 2,
  'epiphyseal-plate-length', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'epiphyseal-plate-length', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-224", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "D", "verifiedFact": "The epiphyseal plate lengthens bone. Cartilage forms on the epiphyseal side. Cartilage is ossified on the diaphyseal side. When proliferation stops, the plate becomes the epiphyseal line."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280225', 'usmle-step-1', 'physiology',
  $sc$A 25-year-old man has finished growing taller, but his long-bone shafts are still adding width. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Cells remove bone along the marrow cavity while other cells add bone just under the outer membrane. The marrow space gets wider as the shaft does.$sc$,
  $qu$Which of the following is this growth in width?$qu$,
  $op${"options": ["Cartilage added at the growth plate after it has already sealed", "Replacement of a cartilage model in a fetal long bone", "Formation of the clavicle directly from mesenchyme", "Five to ten percent turnover on the same bone surface", "Removal along the marrow space and new bone under the outer covering"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "appositional-growth", "taskCategory": "mechanism"}$op$,
  $ky$Removal along the marrow space and new bone under the outer covering$ky$,
  $ex$The best choice is "Removal along the marrow space and new bone under the outer covering". Appositional growth widens the shaft: osteoclasts resorb the medullary lining and osteoblasts add bone under the periosteum, so the cavity widens too. It can continue after length growth stops. He has finished growing taller. "Cartilage added at the growth plate after it has already sealed" is not the best choice because A sealed plate is an epiphyseal line and no longer adds length. Width is a different process. "Replacement of a cartilage model in a fetal long bone" is not the best choice because Replacing a fetal cartilage model is endochondral ossification, not adult widening. "Formation of the clavicle directly from mesenchyme" is not the best choice because The clavicle's direct path is intramembranous ossification in development. "Five to ten percent turnover on the same bone surface" is not the best choice because Remodeling replaces bone on the same surface. Modeling during growth deposits and resorbs on different surfaces.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '483ca620d5109bb8a1d4b12c6cf21008cc9550fea3a42dee158e2188ba8ab6e7', false, NOW(), NOW(), 3,
  'appositional-growth', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'appositional-growth', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-225", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "E", "verifiedFact": "Appositional growth increases diameter. Osteoclasts resorb bone lining the medullary cavity. Osteoblasts add bone under the periosteum. The marrow cavity widens too. This can continue after length growth stops."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280226', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old woman who runs has a small region of worn bone. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Cells remove the worn matrix and other cells lay new matrix on that same surface. Even without injury, a few percent of the skeleton is renewed this way each year.$sc$,
  $qu$Which of the following is this replacement on one surface?$qu$,
  $op${"options": ["Old bone is removed and new bone is laid on the same face", "Bone is removed inside and added outside to widen the shaft", "Cartilage at the growth plate is replaced to add length", "A fetal membrane becomes bone with no cartilage step", "Chondrocytes in the reserve zone secure the plate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "remodeling-same-surface", "taskCategory": "mechanism"}$op$,
  $ky$Old bone is removed and new bone is laid on the same face$ky$,
  $ex$The best choice is "Old bone is removed and new bone is laid on the same face". Remodeling resorbs old or damaged bone and deposits new bone on the same surface. About 5 to 10 percent of the skeleton turns over each year even without injury. Her worn region is being replaced that way. "Bone is removed inside and added outside to widen the shaft" is not the best choice because Resorption inside and deposition outside is modeling, which changes shape and diameter during growth. "Cartilage at the growth plate is replaced to add length" is not the best choice because Growth-plate replacement lengthens an immature bone. She is an adult runner. "A fetal membrane becomes bone with no cartilage step" is not the best choice because Membrane bone is intramembranous ossification. "Chondrocytes in the reserve zone secure the plate" is not the best choice because The reserve zone anchors the epiphyseal plate. Its chondrocytes do not participate in growth.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'fd3890aa1e1a80cb0e2628b955be3c698d9c99128fa66ea14af3191a4fc56da0', false, NOW(), NOW(), 2,
  'remodeling-same-surface', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'remodeling-same-surface', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-226", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "A", "verifiedFact": "Remodeling resorbs old or damaged bone and deposits new bone on the same surface. Even without injury, about 5 to 10 percent of the skeleton is remodeled each year."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280227', 'usmle-step-1', 'pathology',
  $sc$A 6-year-old boy has had many fractures from minor bumps. Temperature is 36.6°C, pulse is 90/min, respirations are 18/min, and blood pressure is 96/60 mm Hg. His long bones bow, he is short, his sclerae look blue, and his teeth crack. The matrix protein that gives bone its tensile strength is not made normally. There is no cure.$sc$,
  $qu$Which of the following protein is defective?$qu$,
  $op${"options": ["The hormone that stores glucose as liver glycogen", "The fiber other tissues need for toughness", "The surfactant that keeps alveoli from collapsing", "The catalyst that converts ATP into cyclic AMP", "The plasma carrier that transports cortisol"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "osteogenesis-imperfecta-collagen", "taskCategory": "mechanism"}$op$,
  $ky$The fiber other tissues need for toughness$ky$,
  $ex$The best choice is "The fiber other tissues need for toughness". Osteogenesis imperfecta is a genetic failure of collagen production. Collagen is a critical part of bone matrix, so bones break easily. Blue sclera, brittle teeth, and hearing loss fit because collagen is widespread. He has that picture, and there is no cure. "The hormone that stores glucose as liver glycogen" is not the best choice because Insulin stores glucose. It is not the matrix protein of brittle-bone disease. "The surfactant that keeps alveoli from collapsing" is not the best choice because Surfactant is secreted by type II alveolar cells. It is not a bone-matrix protein. "The catalyst that converts ATP into cyclic AMP" is not the best choice because Adenylyl cyclase makes cyclic AMP for water-soluble hormones. It is not the defective bone protein. "The plasma carrier that transports cortisol" is not the best choice because Cortisol's transport protein extends half-life. It is not the matrix defect.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', 'a72116ac558e69d70282c5e8c4517a4bfabe3529224bdd6c6e4c43c556c31434', false, NOW(), NOW(), 3,
  'osteogenesis-imperfecta-collagen', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'osteogenesis-imperfecta-collagen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-227", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "B", "verifiedFact": "Osteogenesis imperfecta is a genetic defect in collagen production. Bones are fragile. Severe forms cause many fractures, deformity, and short stature. Blue sclera, brittle teeth, and hearing loss can occur. There is no cure."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280228', 'usmle-step-1', 'histology',
  $sc$A fetal clavicle is forming. Temperature is not measured. Cells in an ossification center secrete an uncalcified matrix. Mineral is deposited within a few days and the cells are trapped. The trapped cells then change identity. Slide number 14 is the matching section. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following do the trapped cells become?$qu$,
  $op${"options": ["Cartilage cells that keep dividing at the growth plate", "Cells that resorb the lining of the marrow cavity", "Mature bone cells enclosed in the hardened matrix", "The flat support cells of a resting ovarian follicle", "Red marrow, formed from crowded blood vessels"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "osteoblast-to-osteocyte", "taskCategory": "histology"}$op$,
  $ky$Mature bone cells enclosed in the hardened matrix$ky$,
  $ex$The best choice is "Mature bone cells enclosed in the hardened matrix". Osteoblasts secrete osteoid. When it calcifies they are trapped and become osteocytes. The fetal clavicle is forming by that intramembranous sequence. "Cartilage cells that keep dividing at the growth plate" is not the best choice because Chondrocytes divide in the proliferative zone of the growth plate. They are not trapped osteoblasts. "Cells that resorb the lining of the marrow cavity" is not the best choice because Osteoclasts resorb bone along the medullary cavity during widening. "The flat support cells of a resting ovarian follicle" is not the best choice because Flat granulosa cells surround a primordial follicle. They are not bone cells. "Red marrow, formed from crowded blood vessels" is not the best choice because Crowded vessels condense into red marrow. That is a separate step, not the fate of the trapped cells.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', 'e904547fa2e2c130a46bec49b50e22c522b71d39d11fc84c63cced1a4e8fb129', false, NOW(), NOW(), 2,
  'osteoblast-to-osteocyte', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'histology', 'osteoblast-to-osteocyte', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-228", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "C", "verifiedFact": "In intramembranous ossification, osteoblasts secrete osteoid, which calcifies and traps them. Trapped osteoblasts become osteocytes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280229', 'usmle-step-1', 'physiology',
  $sc$A 10-year-old girl has an open growth plate. Temperature is 36.6°C, pulse is 82/min, respirations are 16/min, and blood pressure is 100/62 mm Hg. The layer of the plate nearest the end of the bone holds small cartilage cells that do not divide to lengthen the bone. They anchor the plate to the end. The next layer toward the shaft is the one that divides.$sc$,
  $qu$Which of the following is the job of the layer nearest the end?$qu$,
  $op${"options": ["It produces new cartilage cells by cell division", "It is where capillaries and osteoblasts lay bone", "It adds width by depositing bone under the periosteum", "It anchors the plate and its cells do not lengthen the bone", "It is the remnant line after growth has finished"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "reserve-zone-no-growth", "taskCategory": "mechanism"}$op$,
  $ky$It anchors the plate and its cells do not lengthen the bone$ky$,
  $ex$The best choice is "It anchors the plate and its cells do not lengthen the bone". The reserve zone, closest to the epiphysis, has small chondrocytes that do not participate in growth. They secure the plate to the epiphysis. The proliferative zone, next toward the shaft, divides. Her open plate has that arrangement. "It produces new cartilage cells by cell division" is not the best choice because Mitosis of new chondrocytes is the proliferative zone, not the reserve zone. "It is where capillaries and osteoblasts lay bone" is not the best choice because Capillaries and osteoblasts invade the zone of calcified matrix, nearest the diaphysis. "It adds width by depositing bone under the periosteum" is not the best choice because Bone under the periosteum widens the shaft. It is not a zone of the growth plate. "It is the remnant line after growth has finished" is not the best choice because The epiphyseal line remains after the plate closes. Her plate is still open.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '5f47de1dd6b99c52f532420b2a1f468f57ea25cd4956f80530697bcf97450f7a', false, NOW(), NOW(), 3,
  'reserve-zone-no-growth', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'reserve-zone-no-growth', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-229", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "D", "verifiedFact": "The reserve zone is closest to the epiphysis. Its small chondrocytes do not participate in growth. They secure the plate to the epiphysis. The proliferative zone makes new chondrocytes by mitosis."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280230', 'usmle-step-1', 'physiology',
  $sc$A fetal long bone in the third month has a bony cuff around the shaft. Temperature is not measured. Vessels have entered the cartilage, the covering membrane now makes bone, and the first center of bone formation sits deep to the cuff. The ends of the model are still cartilage. Slide number 14 is the matching section.$sc$,
  $qu$Which of the following is the first center of bone formation in the shaft?$qu$,
  $op${"options": ["A center in each end, appearing only after birth", "The facial bones forming directly from mesenchyme", "The growth plate after it has become a line", "Articular cartilage that never ossifies", "The center deep to the bony cuff around the shaft"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "primary-ossification-center", "taskCategory": "mechanism"}$op$,
  $ky$The center deep to the bony cuff around the shaft$ky$,
  $ex$The best choice is "The center deep to the bony cuff around the shaft". The primary ossification center forms deep to the periosteal collar after vessels enter and the perichondrium becomes periosteum. That is underway by the second or third fetal month. The ends are still growing as cartilage. "A center in each end, appearing only after birth" is not the best choice because Secondary ossification centers form in the epiphyses after birth. "The facial bones forming directly from mesenchyme" is not the best choice because Facial bones use intramembranous ossification, not a cartilage model with a collar. "The growth plate after it has become a line" is not the best choice because The epiphyseal line is the closed plate of a mature bone. "Articular cartilage that never ossifies" is not the best choice because Articular cartilage remains at the joint. It is not the shaft center.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b7b810d9b3ec67c7bb480d1cd3a2013a4b72fa9a8fd8d6e44e30f2fc8944d02d', false, NOW(), NOW(), 3,
  'primary-ossification-center', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'primary-ossification-center', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-230", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "E", "verifiedFact": "Capillaries penetrate the cartilage, the perichondrium becomes periosteum, a periosteal collar forms, and the primary ossification center appears deep to that collar. This is underway by the second or third fetal month."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280231', 'usmle-step-1', 'physiology',
  $sc$A 20-year-old man puts his hand in shower water. Temperature of the water is hot. His pulse is 80/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. Receptors in the skin change their membrane voltage in proportion to how hot the water is. Only when that change is large enough does a traveling signal start on the axon.$sc$,
  $qu$Which of the following must the receptor voltage reach?$qu$,
  $op${"options": ["The point at which an impulse starts on the axon", "The synapse where acetylcholine meets the muscle", "The precentral gyrus, before any receptor has fired", "A second messenger made from ATP inside a liver cell", "The yellowish body that later secretes progesterone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "graded-potential-threshold", "taskCategory": "mechanism"}$op$,
  $ky$The point at which an impulse starts on the axon$ky$,
  $ex$The best choice is "The point at which an impulse starts on the axon". A thermoreceptor makes a graded potential whose size depends on stimulus strength. If that potential reaches threshold, an action potential starts at the initial segment. His hot water is that stimulus. "The synapse where acetylcholine meets the muscle" is not the best choice because Acetylcholine at the neuromuscular junction is the last step, after a lower motor neuron has fired. "The precentral gyrus, before any receptor has fired" is not the best choice because The precentral gyrus sends the motor command after the cortex has integrated the sensation. "A second messenger made from ATP inside a liver cell" is not the best choice because Cyclic AMP is a hormone second messenger. It is not the sensory threshold. "The yellowish body that later secretes progesterone" is not the best choice because The yellowish body left after ovulation is ovarian. It is not part of this sensory step.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b61dc4b00a017f93dab93cff85fdb5b7409feb41595ce7aa8e3e53d05a0a6349', false, NOW(), NOW(), 2,
  'graded-potential-threshold', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'graded-potential-threshold', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-231", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "A", "verifiedFact": "A sensory receptor produces a graded potential whose size depends on stimulus strength. If it reaches threshold, an action potential starts at the initial segment."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280232', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old woman feels the temperature of water on her hand. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The signal has entered the spinal cord and has been passed to a relay deep in the brain. She is not yet aware of the temperature. Awareness begins only after the next station, the outer gray matter.$sc$,
  $qu$Which of the following is the relay before awareness?$qu$,
  $op${"options": ["The muscle end plate, where acetylcholine is released", "The deep relay that passes sensation on to the outer gray layer", "The descending motor cell in the frontal gyrus", "The lower motor neuron leaving the cord in a nerve", "The receptor itself, which only makes a local voltage"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "thalamus-sensory-relay", "taskCategory": "mechanism"}$op$,
  $ky$The deep relay that passes sensation on to the outer gray layer$ky$,
  $ex$The best choice is "The deep relay that passes sensation on to the outer gray layer". After a spinal synapse, the sensory path reaches the thalamus, which relays it to the cerebral cortex. Conscious perception begins in the cortex. She is not yet aware, so the signal is at the thalamic relay. "The muscle end plate, where acetylcholine is released" is not the best choice because The neuromuscular junction is the motor ending on muscle, after a command has been sent. "The descending motor cell in the frontal gyrus" is not the best choice because The upper motor neuron in the precentral gyrus carries the motor command down the cord. "The lower motor neuron leaving the cord in a nerve" is not the best choice because The lower motor neuron leaves the cord to the muscle. It is not the sensory relay. "The receptor itself, which only makes a local voltage" is not the best choice because The receptor makes the graded potential. Awareness requires the cortex after the thalamic relay.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'e6b4a151d11e910aef05e747b5598f97d0098c31ebe9b2009d0fb5b89583d34e', false, NOW(), NOW(), 2,
  'thalamus-sensory-relay', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'thalamus-sensory-relay', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-232", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "B", "verifiedFact": "The sensory neuron synapses in the spinal cord, the signal goes to the thalamus, and the thalamus relays it to the cerebral cortex, where conscious perception begins."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280233', 'usmle-step-1', 'anatomy',
  $sc$A 55-year-old man decides to step out of a hot shower. Temperature is 36.6°C, pulse is 78/min, respirations are 16/min, and blood pressure is 130/80 mm Hg. The command starts in a strip of frontal cortex and the axon runs all the way down the spinal cord. It ends on a second neuron in the cord's gray matter.$sc$,
  $qu$Which of the following is the cell that starts this command?$qu$,
  $op${"options": ["The skin receptor that sensed the water", "The thalamic cell that relayed temperature", "A cell in the frontal lobe whose axon reaches the cord", "The cord cell whose axon leaves to the muscle", "The muscle fiber, which only receives acetylcholine"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "upper-motor-precentral", "taskCategory": "anatomy"}$op$,
  $ky$A cell in the frontal lobe whose axon reaches the cord$ky$,
  $ex$The best choice is "A cell in the frontal lobe whose axon reaches the cord". The upper motor neuron sits in the precentral gyrus and sends its axon down to a lower motor neuron in the spinal gray matter. His decision to step out uses that descending cell. "The skin receptor that sensed the water" is not the best choice because The thermoreceptor starts the sensory side, not the motor command. "The thalamic cell that relayed temperature" is not the best choice because The thalamus relays sensation to the cortex. It does not send the motor axon down the cord. "The cord cell whose axon leaves to the muscle" is not the best choice because The lower motor neuron is the second cell, in the cord, whose axon leaves to the muscle. "The muscle fiber, which only receives acetylcholine" is not the best choice because The muscle fiber contracts after acetylcholine. It does not start the command.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '90d6177760701773da4b6f197320d35e4f5d52c848ae19460ec8d5dfa812c449', false, NOW(), NOW(), 2,
  'upper-motor-precentral', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'upper-motor-precentral', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-233", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "C", "verifiedFact": "The upper motor neuron is in the precentral gyrus of the frontal cortex. Its axon descends to synapse on a lower motor neuron in the spinal gray matter."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280234', 'usmle-step-1', 'physiology',
  $sc$A 30-year-old woman flexes her elbow. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The neuron that leaves the spinal cord ends on the muscle. A chemical is released there, the muscle membrane produces a large potential, and the fiber contracts.$sc$,
  $qu$Which of the following chemical is released onto the muscle?$qu$,
  $op${"options": ["The second messenger made from ATP by a liver hormone", "Progesterone from the collapsed ovarian follicle", "Surfactant from the type II alveolar cell", "The molecule freed where the nerve meets the fiber", "Collagen, the matrix protein missing in brittle bone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "acetylcholine-nmj", "taskCategory": "mechanism"}$op$,
  $ky$The molecule freed where the nerve meets the fiber$ky$,
  $ex$The best choice is "The molecule freed where the nerve meets the fiber". The lower motor neuron releases acetylcholine at the neuromuscular junction. That causes an end-plate potential, then a muscle action potential, and the fiber contracts. She is flexing her elbow. "The second messenger made from ATP by a liver hormone" is not the best choice because Cyclic AMP is an intracellular hormone messenger, not the neuromuscular transmitter. "Progesterone from the collapsed ovarian follicle" is not the best choice because Progesterone comes from the corpus luteum. It does not trigger muscle contraction. "Surfactant from the type II alveolar cell" is not the best choice because Surfactant lowers alveolar surface tension. It is not released at the nerve-muscle junction. "Collagen, the matrix protein missing in brittle bone" is not the best choice because Collagen is a structural protein. It is not the transmitter at the end plate.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '687f3aadf09300bba05df72c59cb05a979a7f2578a820ef1242fb1be5a0e822d', false, NOW(), NOW(), 2,
  'acetylcholine-nmj', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'acetylcholine-nmj', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-234", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "D", "verifiedFact": "At the neuromuscular junction the lower motor neuron releases acetylcholine, producing an end-plate potential and then a muscle action potential, and the fiber contracts."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280235', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old student traces one sensory cell. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The traveling signal reaches the end bulbs, a chemical is released, and it crosses a narrow gap. The next cell's membrane voltage then changes locally.$sc$,
  $qu$Which of the following crosses the gap?$qu$,
  $op${"options": ["The action potential itself, jumping with no chemical", "Cyclic AMP produced from ATP inside the cleft", "A steroid hormone bound to a plasma carrier", "Calcium liberated from the bone matrix", "A chemical released from the synaptic end bulbs"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "neurotransmitter-synapse", "taskCategory": "mechanism"}$op$,
  $ky$A chemical released from the synaptic end bulbs$ky$,
  $ex$The best choice is "A chemical released from the synaptic end bulbs". At the synaptic end bulbs the arriving action potential releases neurotransmitter. It diffuses across the synapse and binds a receptor, starting a graded potential in the next cell. His tracing is that step. "The action potential itself, jumping with no chemical" is not the best choice because The signal does not jump the gap as the action potential. A chemical carries it. "Cyclic AMP produced from ATP inside the cleft" is not the best choice because Cyclic AMP is made inside a target cell in hormone signaling, not released into a neural cleft. "A steroid hormone bound to a plasma carrier" is not the best choice because Steroid carriers operate in blood. They are not the synaptic chemical. "Calcium liberated from the bone matrix" is not the best choice because Bone calcium is in matrix. Synaptic signaling here is a released transmitter.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '75c000bd4db4de7f358d7cb9bd0b1a28a822190bc869f47dc9f2ea081ba985f1', false, NOW(), NOW(), 2,
  'neurotransmitter-synapse', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'neurotransmitter-synapse', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-235", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "E", "verifiedFact": "When an action potential reaches the synaptic end bulbs, neurotransmitter is released, diffuses across the synapse, and binds a receptor on the next cell, starting a new graded potential."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280236', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old man becomes aware that the shower is too hot. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 124/76 mm Hg. The signal has already passed a deep relay. Awareness starts only when it reaches the outer layer of gray matter. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is required before he is aware?$qu$,
  $op${"options": ["Arrival of the impulse in the outer gray layer of the brain", "Release of the nerve-muscle chemical onto the fiber", "A graded potential that stays below the starting level", "Contraction of the muscle before any sensory cell fires", "Conversion of the leftover follicle into a yellowish body"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "conscious-perception-cortex", "taskCategory": "mechanism"}$op$,
  $ky$Arrival of the impulse in the outer gray layer of the brain$ky$,
  $ex$The best choice is "Arrival of the impulse in the outer gray layer of the brain". Conscious perception begins in the cerebral cortex after the thalamus relays the signal. He becomes aware only when the signal reaches that outer gray matter. "Release of the nerve-muscle chemical onto the fiber" is not the best choice because Acetylcholine at the muscle is the motor ending, after a decision, not the start of awareness. "A graded potential that stays below the starting level" is not the best choice because A graded potential below threshold does not even start an action potential. "Contraction of the muscle before any sensory cell fires" is not the best choice because Muscle contraction is the response. Awareness of temperature comes from the sensory path to cortex. "Conversion of the leftover follicle into a yellowish body" is not the best choice because Luteinization makes the corpus luteum. It is unrelated to temperature awareness.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ce5451c73c4a8bf4cc69e29618f56e8301dc255d65c7c484720198a5a19d56ff', false, NOW(), NOW(), 2,
  'conscious-perception-cortex', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'conscious-perception-cortex', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-236", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "A", "verifiedFact": "Conscious perception of the stimulus begins when the signal reaches the cerebral cortex, the outer gray matter."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280237', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old woman moves her hand away from hot water. Temperature is 36.6°C, pulse is 88/min, respirations are 18/min, and blood pressure is 126/78 mm Hg. A frontal-cortex axon has already synapsed in the cord. The next axon's cell body is in the cord's gray matter, and that axon leaves in a nerve.$sc$,
  $qu$Which of the following is the destination of the axon that leaves the cord?$qu$,
  $op${"options": ["The deep sensory relay inside the brain", "The muscle, at the specialized nerve-muscle junction", "The skin receptor that started the temperature signal", "The precentral gyrus, to begin the command", "The ovary, where a midcycle gonadotropin burst starts"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "lower-motor-muscle", "taskCategory": "mechanism"}$op$,
  $ky$The muscle, at the specialized nerve-muscle junction$ky$,
  $ex$The best choice is "The muscle, at the specialized nerve-muscle junction". The lower motor neuron's axon leaves the cord in a nerve and ends on muscle at the neuromuscular junction. Her hand is moving after that cord cell has been excited. "The deep sensory relay inside the brain" is not the best choice because The thalamus is on the sensory path, before the cortex. "The skin receptor that started the temperature signal" is not the best choice because The skin receptor is the start of sensation, not the target of the axon leaving the cord. "The precentral gyrus, to begin the command" is not the best choice because The precentral gyrus holds the upper motor neuron, which has already synapsed in the cord. "The ovary, where a midcycle gonadotropin burst starts" is not the best choice because An LH burst is ovarian physiology, not the target of a spinal motor axon.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '888e0b3a349bedb03bee61c1ae18d2258a279404e14aeff987cc654748951dbd', false, NOW(), NOW(), 2,
  'lower-motor-muscle', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lower-motor-muscle', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-237", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "B", "verifiedFact": "The lower motor neuron's axon leaves the spinal cord in a nerve and ends at the neuromuscular junction."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280238', 'usmle-step-1', 'physiology',
  $sc$A 22-year-old man feels cold water and also remembers he is late. Temperature is 36.6°C, pulse is 90/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. Several cortical areas combine the temperature with that memory before a movement is chosen. Only then does a command leave the frontal strip.$sc$,
  $qu$Which of the following happens before the motor command?$qu$,
  $op${"options": ["The nerve-muscle chemical is released onto the fiber", "The lower motor neuron has already left the cord", "Higher areas join the sensation to other information", "The muscle contracts and only then is the water sensed", "A steroid binds an intracellular receptor in the muscle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "integration-before-motor", "taskCategory": "mechanism"}$op$,
  $ky$Higher areas join the sensation to other information$ky$,
  $ex$The best choice is "Higher areas join the sensation to other information". The cortex integrates the stimulus with other sensations, emotion, and memory, then the precentral gyrus sends the motor command. He combines the cold water with being late before he moves. "The nerve-muscle chemical is released onto the fiber" is not the best choice because Acetylcholine at the muscle is after the command has traveled down the cord. "The lower motor neuron has already left the cord" is not the best choice because The lower motor neuron fires after the upper motor neuron has synapsed on it. "The muscle contracts and only then is the water sensed" is not the best choice because Sensing the water is the start of the path. Contraction is the end. "A steroid binds an intracellular receptor in the muscle" is not the best choice because Steroid receptors are not the step between sensation and a motor command.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6a85e539f4900c1c578bbd767d93357d8c49367d9f9c6ea5c1dfae12cc4a2941', false, NOW(), NOW(), 3,
  'integration-before-motor', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'integration-before-motor', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-238", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "C", "verifiedFact": "After the cortex receives the sensation, it integrates it with other input, emotion, and memory, then sends a motor command from the precentral gyrus."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280239', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old woman has a sensory axon that has just reached the voltage needed to fire. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The traveling signal begins next to the cell body and runs to the far end of the axon, into the bulbs that will release a chemical.$sc$,
  $qu$Which of the following is the direction of that traveling signal?$qu$,
  $op${"options": ["From the muscle back to the skin receptor", "From the cortex down a motor axon before any sensation", "Across the membrane as a hormone second messenger", "From the start of the axon toward the releasing bulbs", "From the medulla of the ovary into a follicle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "propagation-to-terminals", "taskCategory": "mechanism"}$op$,
  $ky$From the start of the axon toward the releasing bulbs$ky$,
  $ex$The best choice is "From the start of the axon toward the releasing bulbs". Once threshold is reached, the action potential propagates from the axon hillock to the terminals and into the synaptic end bulbs. Her sensory axon has just started that trip. "From the muscle back to the skin receptor" is not the best choice because The sensory path does not run from muscle back to the receptor. "From the cortex down a motor axon before any sensation" is not the best choice because A descending motor axon is a later, separate cell. This vignette is the sensory axon that just fired. "Across the membrane as a hormone second messenger" is not the best choice because A second messenger stays inside a hormone's target cell. It is not this traveling axonal signal. "From the medulla of the ovary into a follicle" is not the best choice because The ovarian medulla holds vessels. It is not an axon.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a5d7fa126fc5d0ba8b6afd334632bb170b92df634a55e1f50a3a0ac2dce77eeb', false, NOW(), NOW(), 2,
  'propagation-to-terminals', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'propagation-to-terminals', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-239", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "D", "verifiedFact": "The action potential propagates from the axon hillock to the axon terminals and into the synaptic end bulbs."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280240', 'usmle-step-1', 'physiology',
  $sc$A 18-year-old student maps one shower reflex. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Skin receptors detect the water, the brain combines that information with other facts, and muscles then move the hand. Those are the three jobs in order.$sc$,
  $qu$Which of the following is the middle job?$qu$,
  $op${"options": ["Detecting the water temperature in the skin", "Contracting the muscle after acetylcholine is released", "Releasing progesterone from the corpus luteum", "Remodeling five to ten percent of the skeleton", "Combining the sensory information before a movement is chosen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "sensation-integration-response", "taskCategory": "mechanism"}$op$,
  $ky$Combining the sensory information before a movement is chosen$ky$,
  $ex$The best choice is "Combining the sensory information before a movement is chosen". The sequence is sensation, then integration, then response. Combining the information in the cortex is the middle job. She mapped that order. "Detecting the water temperature in the skin" is not the best choice because Detection in the skin is sensation, the first job. "Contracting the muscle after acetylcholine is released" is not the best choice because Muscle contraction is the response, the last job. "Releasing progesterone from the corpus luteum" is not the best choice because Progesterone secretion is ovarian, not this neural sequence. "Remodeling five to ten percent of the skeleton" is not the best choice because Bone remodeling is skeletal turnover, not the middle neural job.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a9047eed5360a0fe0b5f8dbd8e88ebfdc0e819d050f77df90e87b98da5bbbaaf', false, NOW(), NOW(), 2,
  'sensation-integration-response', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sensation-integration-response', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-240", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "E", "verifiedFact": "The major functions illustrated are sensation, integration, and response."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280241', 'usmle-step-1', 'ethics',
  $sc$A 26-year-old student plans a study of adult volunteers at a university that receives federal research funds. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. A committee of administrators, scientists, and community members must review the plan. The study is not supposed to start until that committee agrees.$sc$,
  $qu$Which of the following must happen before the study starts?$qu$,
  $op${"options": ["The human-subjects committee must approve the plan", "An animal-care committee must inspect the rodent rooms", "Participants must be debriefed before any consent form", "Parents must sign because every volunteer is under 18", "The study may begin with no review if consent is verbal"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "irb-human-research", "taskCategory": "mechanism"}$op$,
  $ky$The human-subjects committee must approve the plan$ky$,
  $ex$The best choice is "The human-subjects committee must approve the plan". An institution with federal support for human research must have an institutional review board of administrators, scientists, and community members. Approval is generally required before the study proceeds. Her university study of adults needs that approval. "An animal-care committee must inspect the rodent rooms" is not the best choice because An IACUC reviews animal research, not a study of adult volunteers. "Participants must be debriefed before any consent form" is not the best choice because Debriefing comes after a study that used deception. Consent comes before participation. "Parents must sign because every volunteer is under 18" is not the best choice because Parents or guardians sign when participants are under 18. Her volunteers are adults. "The study may begin with no review if consent is verbal" is not the best choice because Verbal consent does not replace IRB review at a federally supported institution.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', '8ba351f1ff03d6e6ef9c8885da04b75e6edc5e02082755d6110cc11e8d780556', false, NOW(), NOW(), 2,
  'irb-human-research', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'irb-human-research', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-241", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "A", "verifiedFact": "Any research institution receiving federal support for human research must have an IRB. The IRB includes administrators, scientists, and community members and must generally approve a proposal before the study proceeds."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280242', 'usmle-step-1', 'ethics',
  $sc$A 34-year-old man is asked to join a psychology study. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The form describes the procedures and the risks. It says he may leave at any time and will not be penalized, and that his data will be kept private.$sc$,
  $qu$Which of the following is he allowed to do after signing?$qu$,
  $op${"options": ["Skip the description of risks and still be fully informed", "Stop participating at any time without a penalty", "Require the team to name him in the published data", "Join even though he is 16 and signs alone", "Avoid a later explanation if the study used deception"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "informed-consent-voluntary", "taskCategory": "mechanism"}$op$,
  $ky$Stop participating at any time without a penalty$ky$,
  $ex$The best choice is "Stop participating at any time without a penalty". Informed consent states that participation is voluntary and can be discontinued without penalty, and that data stay confidential. He may stop after signing. "Skip the description of risks and still be fully informed" is not the best choice because The form must describe risks. Omitting them is not informed consent. "Require the team to name him in the published data" is not the best choice because The form guarantees confidentiality. Publishing his name would break that. "Join even though he is 16 and signs alone" is not the best choice because Participants under 18 need a parent or guardian to sign. "Avoid a later explanation if the study used deception" is not the best choice because If deception was used, a full debriefing is required at the end.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', '2991d7db2fcdcdfa7264c3325a93d01ef34d951f6b1c93bb18763fc7c347cd01', false, NOW(), NOW(), 2,
  'informed-consent-voluntary', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'informed-consent-voluntary', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-242", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "B", "verifiedFact": "Informed consent describes what participants can expect, including risks and implications. Involvement is voluntary and can stop at any time without penalty. Data remain confidential."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280243', 'usmle-step-1', 'ethics',
  $sc$A 15-year-old girl is invited into a school study of study habits. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. She wants to join. The form has a signature line she cannot complete by herself. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following must sign before she joins?$qu$,
  $op${"options": ["Only the student, because the study is at school", "The animal-care committee, because she is a minor", "A parent or legal guardian, along with the required form", "No one, because surveys never need consent", "The journal editor, after the study is published"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "minor-guardian-consent", "taskCategory": "mechanism"}$op$,
  $ky$A parent or legal guardian, along with the required form$ky$,
  $ex$The best choice is "A parent or legal guardian, along with the required form". When participants are under 18, a parent or legal guardian must sign informed consent. She is 15, so her signature alone is not enough. "Only the student, because the study is at school" is not the best choice because Being at school does not let a minor consent alone. "The animal-care committee, because she is a minor" is not the best choice because An IACUC reviews animal protocols. It does not sign a minor's consent. "No one, because surveys never need consent" is not the best choice because Human research still needs consent. A survey of a minor is not exempt from the guardian requirement in this section. "The journal editor, after the study is published" is not the best choice because Publication is not the consent step. Consent comes before participation.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', 'ae806dbd60df624b7b49e31b93c2462dee9a72cd37858481baeebaca07f1addd', false, NOW(), NOW(), 2,
  'minor-guardian-consent', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'minor-guardian-consent', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-243", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "C", "verifiedFact": "If participants are under 18, a parent or legal guardian must sign the informed consent form."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280244', 'usmle-step-1', 'ethics',
  $sc$A 29-year-old man finishes a study of how clothing changes first impressions. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. The consent form did not state the exact question, so his guess would not change his answers. The misdirection was not harmful. The team now owes him a full explanation.$sc$,
  $qu$Which of the following must the team now provide?$qu$,
  $op${"options": ["Nothing further, because he already signed consent", "A guarantee that deception may be harmful if the question requires it", "Permission to skip consent when the next study starts", "The true purpose, the data use, and why the misdirection was needed", "An animal-committee inspection of the interview room"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "deception-requires-debrief", "taskCategory": "mechanism"}$op$,
  $ky$The true purpose, the data use, and why the misdirection was needed$ky$,
  $ex$The best choice is "The true purpose, the data use, and why the misdirection was needed". When deception is used, participants must be debriefed with the purpose, how the data will be used, why deception was necessary, and how to get more information. His clothing study hid the question and now requires that explanation. Deception must not be harmful. "Nothing further, because he already signed consent" is not the best choice because Consent before the study does not replace the debriefing after deception. "A guarantee that deception may be harmful if the question requires it" is not the best choice because Deception is not allowed to the point of harm. "Permission to skip consent when the next study starts" is not the best choice because Each study still needs its own consent. Debriefing does not waive the next consent. "An animal-committee inspection of the interview room" is not the best choice because An IACUC inspects animal facilities. This was a human impression study.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', '2214d04807f55b318354f033ad445b8ad9d3b64a37fa15423301a81b4b699827', false, NOW(), NOW(), 3,
  'deception-requires-debrief', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'deception-requires-debrief', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-244", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "D", "verifiedFact": "Deception may be used so knowledge of the exact question does not change results, but not if it would be harmful. Participants must then be fully debriefed: purpose, data use, why deception was needed, and how to learn more."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280245', 'usmle-step-1', 'ethics',
  $sc$A class reviews a study that began in 1932 among rural Black men. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. Men who tested positive were not told they had the infection. By 1947 an effective drug existed, and it was still not given. The study ended in 1972 after the press exposed it.$sc$,
  $qu$Which of the following made the continued study unacceptable?$qu$,
  $op${"options": ["An institutional review board had approved it in 1932", "The men signed a modern consent form that listed the drug", "Only rodents were used, so human rules did not apply", "Debriefing at the end repaired the withheld treatment", "A cure was withheld and the diagnosis was never shared"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "tuskegee-withheld-treatment", "taskCategory": "mechanism"}$op$,
  $ky$A cure was withheld and the diagnosis was never shared$ky$,
  $ex$The best choice is "A cure was withheld and the diagnosis was never shared". Participants with syphilis were never told the diagnosis. Penicillin was recognized as effective by 1947 and was still withheld, and men were discouraged from seeking care. Exposure in 1972 led to the National Research Act of 1974. That withholding is why the study was unacceptable. "An institutional review board had approved it in 1932" is not the best choice because Modern IRB review did not exist for this study. The section presents it as the abuse that later rules answered. "The men signed a modern consent form that listed the drug" is not the best choice because The men were not given a consent process that disclosed the disease or the drug. "Only rodents were used, so human rules did not apply" is not the best choice because The subjects were men, not research rodents. "Debriefing at the end repaired the withheld treatment" is not the best choice because A debriefing does not undo decades of withheld treatment.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', '43574e5ac814bf3f513bd2d93935120003b18095a8f4826e5316ee0aa110256d', false, NOW(), NOW(), 3,
  'tuskegee-withheld-treatment', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'tuskegee-withheld-treatment', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-245", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "E", "verifiedFact": "In the Tuskegee study, men with syphilis were not told they had it. Penicillin was known to work by 1947 and was still withheld. The study ended in 1972 after the press reported it and led to the National Research Act of 1974."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280246', 'usmle-step-1', 'ethics',
  $sc$A 31-year-old researcher wants to test a drug in rats. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. A committee of administrators, scientists, veterinarians, and community members must approve the plan. The same committee inspects the animal rooms twice a year. He may not start without that approval.$sc$,
  $qu$Which of the following reviews this animal plan?$qu$,
  $op${"options": ["The committee that also checks the housing rooms twice a year", "The human-subjects board, because rats are federal subjects", "Only the researcher, if pain is likely to be brief", "A parent or guardian, because the rats are young", "No committee, because 90 percent of such work uses rodents"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "iacuc-animal-review", "taskCategory": "mechanism"}$op$,
  $ky$The committee that also checks the housing rooms twice a year$ky$,
  $ex$The best choice is "The committee that also checks the housing rooms twice a year". An IACUC of administrators, scientists, veterinarians, and community members reviews animal work, requires humane treatment, and inspects facilities semi-annually. No animal project proceeds without approval. His rat study needs that committee. "The human-subjects board, because rats are federal subjects" is not the best choice because An IRB reviews human research. Animal work goes to the IACUC. "Only the researcher, if pain is likely to be brief" is not the best choice because The researcher cannot approve his own animal protocol. "A parent or guardian, because the rats are young" is not the best choice because Guardian consent is for human participants under 18. "No committee, because 90 percent of such work uses rodents" is not the best choice because The estimate that 90 percent of psychology animal research uses rodents or birds does not remove the approval requirement.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', 'a0a327ea6090be76713c4fa82d3ca2444639674116a7be4c9cd7e2b60ee49cf8', false, NOW(), NOW(), 2,
  'iacuc-animal-review', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'iacuc-animal-review', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-246", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "A", "verifiedFact": "Animal proposals are reviewed by an IACUC of administrators, scientists, veterinarians, and community members. It requires humane treatment and inspects facilities twice a year. No animal project proceeds without approval."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280247', 'usmle-step-1', 'ethics',
  $sc$A 27-year-old student designs a learning study in birds. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The protocol is written so the birds have as little pain and distress as the question allows. Birds and rodents account for most psychology animal studies.$sc$,
  $qu$Which of the following is required in the design?$qu$,
  $op${"options": ["Pain is acceptable if the species is a rodent or a bird", "The plan must keep pain and suffering as low as possible", "Humane treatment applies only to human participants", "Deception of the birds replaces the need to limit pain", "A human-subjects board is the only required review"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "minimize-animal-distress", "taskCategory": "mechanism"}$op$,
  $ky$The plan must keep pain and suffering as low as possible$ky$,
  $ex$The best choice is "The plan must keep pain and suffering as low as possible". Researchers must design animal experiments to minimize pain or distress. Her bird study has to do that. The APA estimate is that about 90 percent of psychology animal research uses rodents or birds, which does not relax the duty. "Pain is acceptable if the species is a rodent or a bird" is not the best choice because Using rodents or birds does not make pain acceptable. Distress must still be minimized. "Humane treatment applies only to human participants" is not the best choice because Humane treatment is required for animal subjects as well as respect for human participants. "Deception of the birds replaces the need to limit pain" is not the best choice because Deception and debriefing are human-research practices. They do not replace minimizing animal pain. "A human-subjects board is the only required review" is not the best choice because Animal work is reviewed by the IACUC, not only by the human IRB.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', '54d7b6638b700239e9e2f81aaacf85af4521bb87be67d39d869a6e83f519f852', false, NOW(), NOW(), 2,
  'minimize-animal-distress', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'minimize-animal-distress', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-247", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "B", "verifiedFact": "Animal researchers must design experiments to minimize pain or distress. About 90 percent of psychology animal research uses rodents or birds."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280248', 'usmle-step-1', 'ethics',
  $sc$A 42-year-old woman finishes a memory study. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. She asks whether her name will be attached to her scores in the data file shared outside the team. The form she signed said the data would be kept private.$sc$,
  $qu$Which of the following did the form promise about her data?$qu$,
  $op${"options": ["Her name will be printed beside each score", "Secrecy would apply only when she is under 18", "The scores stay unnamed outside the study rules", "Secrecy ends if the study used no misdirection", "The housing-review committee may post her scores"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "confidentiality-in-consent", "taskCategory": "mechanism"}$op$,
  $ky$The scores stay unnamed outside the study rules$ky$,
  $ex$The best choice is "The scores stay unnamed outside the study rules". Informed consent guarantees that collected data remain completely confidential. Her form promised that privacy. "Her name will be printed beside each score" is not the best choice because Publishing her name with scores would break confidentiality. "Secrecy would apply only when she is under 18" is not the best choice because Confidentiality is part of consent for participants generally, not only for minors. "Secrecy ends if the study used no misdirection" is not the best choice because Deception changes the need for debriefing. It does not cancel confidentiality. "The housing-review committee may post her scores" is not the best choice because An animal committee does not publish a human participant's scores.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', 'f79bbefb387dc77a74051cd1d0056fd734f24d1a540294639c656126d88476fa', false, NOW(), NOW(), 2,
  'confidentiality-in-consent', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'confidentiality-in-consent', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-248", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "C", "verifiedFact": "Informed consent guarantees that data collected in the experiment will remain completely confidential."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280249', 'usmle-step-1', 'ethics',
  $sc$A 23-year-old student asks why human studies now need a formal ethics review. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The class has just covered a 40-year study in which infected men were not treated even after a cure existed. Public exposure in 1972 produced a federal statute two years later.$sc$,
  $qu$Which of the following did that statute lead to?$qu$,
  $op${"options": ["A rule that animal studies need no committee", "Permission to withhold a known cure if meals are free", "An end to written consent forms for adults", "The strict rules for research on human participants", "A requirement that deception never be explained afterward"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "national-research-act", "taskCategory": "mechanism"}$op$,
  $ky$The strict rules for research on human participants$ky$,
  $ex$The best choice is "The strict rules for research on human participants". The Tuskegee study's exposure led to the National Research Act of 1974 and the strict human-research guidelines in the chapter, including IRB review. She is asking about that consequence. "A rule that animal studies need no committee" is not the best choice because Animal studies still require an IACUC. The statute's lesson in this section is human-research protection. "Permission to withhold a known cure if meals are free" is not the best choice because Withholding penicillin was a reason the study was unethical, not a rule the statute created. "An end to written consent forms for adults" is not the best choice because Adult consent remains required. "A requirement that deception never be explained afterward" is not the best choice because Deception, when used, must be followed by a full debriefing.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', 'f51325197f5938f34887a48c64073b31119adeb2957791c0e1cf5a1a7afa9544', false, NOW(), NOW(), 3,
  'national-research-act', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'national-research-act', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-249", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "D", "verifiedFact": "Outrage over Tuskegee led to the National Research Act of 1974 and the strict guidelines for human research described in the chapter."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280250', 'usmle-step-1', 'ethics',
  $sc$A 36-year-old man was misled about the exact question in a harmless study of first impressions. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. At the end the investigator explains the real question, how the answers will be used, why the misdirection was needed, and where to read more.$sc$,
  $qu$Which of the following is this end-of-study explanation?$qu$,
  $op${"options": ["The consent form he should have signed after the study", "The housing inspection done twice each year", "A waiver that lets the next study skip ethics review", "The statute that followed exposure of the syphilis study", "The account owed after the question was concealed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "social-sciences", "blueprintTopic": "debrief-contents", "taskCategory": "mechanism"}$op$,
  $ky$The account owed after the question was concealed$ky$,
  $ex$The best choice is "The account owed after the question was concealed". A debriefing after deception gives the purpose, the data use, the reason for deception, and how to learn more. He received that full account. The misdirection was not harmful, which is the limit the section allows. "The consent form he should have signed after the study" is not the best choice because Consent is signed before participation, not after. "The housing inspection done twice each year" is not the best choice because Semi-annual inspection is an IACUC duty for animal facilities. "A waiver that lets the next study skip ethics review" is not the best choice because A debriefing does not waive IRB review of a later study. "The statute that followed exposure of the syphilis study" is not the best choice because The National Research Act followed Tuskegee. It is not this end-of-study talk.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "social-sciences", "mechanism", "ethics"]$tg$,
  's1-new-20261128-hidden', 'cde4b667e76930c3de988d90b354c9e38fc42c644648722d30a8121c949f2718', false, NOW(), NOW(), 2,
  'debrief-contents', 'social-sciences', 'vignette',
  $rf$[{"label": "OpenStax. Psychology 2e. Section 2.4 Ethics.", "url": "https://openstax.org/books/psychology-2e/pages/2-4-ethics"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'debrief-contents', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-250", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/psychology-2e/pages/2-4-ethics", "nutrition": false, "keyLetter": "E", "verifiedFact": "Debriefing includes the purpose, how data will be used, why deception was necessary, and how to obtain additional information."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280251', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old student lists what the gut does with a meal. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Food enters at the mouth, is moved along, is broken up physically and chemically, nutrients cross into the body, and the residue leaves.$sc$,
  $qu$Which of the following is the last of those activities?$qu$,
  $op${"options": ["Removal of the undigested residue from the body", "Entry of food into the canal through the mouth", "Waves that move the meal even if the person is inverted", "Uptake of nutrients across the small-bowel lining", "Chewing that increases surface area without a chemical change"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "six-digestive-activities", "taskCategory": "mechanism"}$op$,
  $ky$Removal of the undigested residue from the body$ky$,
  $ex$The best choice is "Removal of the undigested residue from the body". The six activities end with defecation, removal of undigested material as feces. Entry is ingestion, movement is propulsion, chewing is mechanical digestion, and nutrient uptake is absorption. "Entry of food into the canal through the mouth" is not the best choice because Entry at the mouth is ingestion, the first activity. "Waves that move the meal even if the person is inverted" is not the best choice because Movement by peristalsis is propulsion. It continues even if a person is inverted, but it is not the last step. "Uptake of nutrients across the small-bowel lining" is not the best choice because Absorption, mainly in the small intestine, comes before the residue is eliminated. "Chewing that increases surface area without a chemical change" is not the best choice because Chewing is mechanical digestion. It does not change the chemical nature of the food.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c5c589b4f4a273809560e7bdfb581a0e09144f711067a17fa16da52b9efc7a9a', false, NOW(), NOW(), 2,
  'six-digestive-activities', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'six-digestive-activities', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-251", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "A", "verifiedFact": "The six digestive activities are ingestion, propulsion, mechanical digestion, chemical digestion, absorption, and defecation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280252', 'usmle-step-1', 'physiology',
  $sc$A 22-year-old man swallows a bite of bread. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. He chose to start the swallow. After the bite enters the esophagus he cannot choose each later wave. The next act he can choose is elimination.$sc$,
  $qu$Which of the following is the next act he can choose?$qu$,
  $op${"options": ["Each peristaltic wave along the small intestine", "Removal of what was not absorbed, after the involuntary waves", "Secretion of acid once the stomach is already full", "Segmentation, which he can start and stop at will", "Bile release, which he times with each contraction"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "swallowing-last-voluntary", "taskCategory": "mechanism"}$op$,
  $ky$Removal of what was not absorbed, after the involuntary waves$ky$,
  $ex$The best choice is "Removal of what was not absorbed, after the involuntary waves". Swallowing is the last voluntary act until defecation. Peristalsis after that is involuntary. He can next choose elimination, not each wave. "Each peristaltic wave along the small intestine" is not the best choice because Peristalsis is involuntary sequential contraction and relaxation. "Secretion of acid once the stomach is already full" is not the best choice because Acid secretion is a reflex and hormonal response, not the next voluntary act. "Segmentation, which he can start and stop at will" is not the best choice because Segmentation is local circular-muscle mixing. It is not under voluntary start and stop. "Bile release, which he times with each contraction" is not the best choice because Bile release is hormonal and neural. He does not time it himself.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9b42ac91dcde6d8e3c3a174b8e5bfd7c67691634ba0148c6962f0c1678401139', false, NOW(), NOW(), 2,
  'swallowing-last-voluntary', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'swallowing-last-voluntary', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-252", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "B", "verifiedFact": "Swallowing is the last voluntary act of digestion until defecation. Propulsion includes voluntary swallowing and involuntary peristalsis."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280253', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old gymnast swallows water while upside down. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. Alternating waves of contraction and relaxation still carry the water to the stomach. Gravity is not required. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following moves the water in that position?$qu$,
  $op${"options": ["Gravity alone, which is reversed in that position", "Chewing, which changes the chemical bonds in water", "Sequential muscle waves that do not need gravity", "Absorption across the stomach lining before any wave", "A long reflex that starts only after the water is tasted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "peristalsis-works-inverted", "taskCategory": "mechanism"}$op$,
  $ky$Sequential muscle waves that do not need gravity$ky$,
  $ex$The best choice is "Sequential muscle waves that do not need gravity". Peristalsis is alternating contraction and relaxation and can move a swallow into the stomach even if the person is inverted. Gravity is not required. "Gravity alone, which is reversed in that position" is not the best choice because Gravity is reversed when she is upside down, so it cannot be what delivers the water to the stomach. "Chewing, which changes the chemical bonds in water" is not the best choice because Mechanical digestion does not change chemical bonds. Water is not broken down by chewing. "Absorption across the stomach lining before any wave" is not the best choice because Some absorption can occur in the stomach, but the water still has to be propelled there. "A long reflex that starts only after the water is tasted" is not the best choice because Taste can start a long reflex for secretion. It is not the propulsive wave.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4d768b367b3a5b9a351a909ed525e4f465f9086842be15d0f96de9f4ca5c885c', false, NOW(), NOW(), 2,
  'peristalsis-works-inverted', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'peristalsis-works-inverted', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-253", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "C", "verifiedFact": "Peristalsis is sequential waves of contraction and relaxation that propel food. It is powerful enough that swallowed material enters the stomach even if the person is standing on their head."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280254', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old woman chews a piece of bread, then the stomach churns it. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The pieces get smaller and more surface is exposed. The bonds of the starch are not yet split by that churning alone.$sc$,
  $qu$Which of the following did the churning accomplish?$qu$,
  $op${"options": ["Complete breakdown of starch into separate sugars", "Uptake of those sugars into the lymph vessels", "Removal of whatever had never been absorbed", "Finer bits and more area, without breaking chemical bonds", "Secretion of bicarbonate out of the pancreas"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "mechanical-no-chemical-change", "taskCategory": "mechanism"}$op$,
  $ky$Finer bits and more area, without breaking chemical bonds$ky$,
  $ex$The best choice is "Finer bits and more area, without breaking chemical bonds". Mechanical digestion, including chewing and gastric churning, makes pieces smaller and increases surface area. It does not change the chemical nature of the food. Splitting starch is chemical digestion. "Complete breakdown of starch into separate sugars" is not the best choice because Chemical digestion breaks complex molecules into building blocks. Churning alone does not do that. "Uptake of those sugars into the lymph vessels" is not the best choice because Lipids enter lacteals. That is absorption, and it is not what churning itself does. "Removal of whatever had never been absorbed" is not the best choice because Defecation is removal of residue, later and elsewhere. "Secretion of bicarbonate out of the pancreas" is not the best choice because Pancreatic bicarbonate neutralizes acidic chyme. It is not the effect of the churning.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '98dc07c7e6c42ca645c46d79c2b0462d41632950c3d59a84f4d074c157f1d805', false, NOW(), NOW(), 2,
  'mechanical-no-chemical-change', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'mechanical-no-chemical-change', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-254", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "D", "verifiedFact": "Mechanical digestion is physical. It does not change the chemical nature of food. It increases surface area and mobility. Chewing and stomach churning are examples. Chyme is the acidic soup."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280255', 'usmle-step-1', 'physiology',
  $sc$A 31-year-old man has starch breakdown that started in the mouth. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Protein splitting continues after the stomach. The building blocks are finished in the next long segment, not in the colon.$sc$,
  $qu$Which of the following is where chemical breakdown is finished?$qu$,
  $op${"options": ["The mouth, where the process only begins", "The colon, which mainly dries the residue", "The esophagus, which only propels the bolus", "The gallbladder, which stores bile", "The long segment that also absorbs most nutrients"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "chemical-digestion-finished-small-bowel", "taskCategory": "mechanism"}$op$,
  $ky$The long segment that also absorbs most nutrients$ky$,
  $ex$The best choice is "The long segment that also absorbs most nutrients". Chemical digestion begins in the mouth and is completed in the small intestine, which is also where most absorption occurs. The colon is not where chemical breakdown is finished. "The mouth, where the process only begins" is not the best choice because The mouth starts carbohydrate and some lipid breakdown. It does not finish it. "The colon, which mainly dries the residue" is not the best choice because The large intestine absorbs residual water, electrolytes, and bacterial vitamins and propels feces. It is not the site that completes chemical digestion. "The esophagus, which only propels the bolus" is not the best choice because The esophagus propels food to the stomach. It does not finish chemical digestion. "The gallbladder, which stores bile" is not the best choice because The gallbladder stores and concentrates bile. Chemical digestion of the meal is completed in the small intestine.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b09a74180413a8a43f149646fdb172d15f4ebea3f9b98ce5581cd1ad0cdc0d4f', false, NOW(), NOW(), 2,
  'chemical-digestion-finished-small-bowel', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'chemical-digestion-finished-small-bowel', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-255", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "E", "verifiedFact": "Chemical digestion starts in the mouth and is completed in the small intestine. Proteins are broken into amino acids as an example."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280256', 'usmle-step-1', 'physiology',
  $sc$A 36-year-old woman absorbs a fatty meal. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Sugars and amino acids enter blood capillaries in the lining. The fats instead enter blind-ended vessels and reach the blood only later, near the heart.$sc$,
  $qu$Which of the following path do the fats take?$qu$,
  $op${"options": ["Lymph vessels that join the blood near the heart", "The same capillaries that take up the sugars immediately", "The colon, which absorbs most dietary fat", "The stomach, which finishes fat breakdown", "Bile canaliculi, which return fat to the liver at once"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "lipids-enter-lacteals", "taskCategory": "mechanism"}$op$,
  $ky$Lymph vessels that join the blood near the heart$ky$,
  $ex$The best choice is "Lymph vessels that join the blood near the heart". Lipids are absorbed into lacteals and travel in lymph to the bloodstream at the subclavian veins near the heart. Sugars and amino acids enter blood capillaries. She has that split. "The same capillaries that take up the sugars immediately" is not the best choice because Most non-fat nutrients enter blood in the mucosa. Fats do not take that immediate capillary path. "The colon, which absorbs most dietary fat" is not the best choice because The large intestine is not the main site of fat absorption. "The stomach, which finishes fat breakdown" is not the best choice because The stomach begins protein breakdown and absorbs some fat-soluble substances such as alcohol and aspirin. It does not deliver meal fat into lymph. "Bile canaliculi, which return fat to the liver at once" is not the best choice because Bile salts from the liver emulsify lipids. Absorbed fats do not return at once through bile canaliculi.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '77feab5bb3979a9b00b642eb520da846023381176f82e8eea70f1cc38278c02a', false, NOW(), NOW(), 3,
  'lipids-enter-lacteals', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lipids-enter-lacteals', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-256", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "A", "verifiedFact": "Most nutrients cross the mucosa into the blood. Lipids are absorbed into lacteals and travel in lymph to the blood at the subclavian veins near the heart."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280257', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old man smells food and his stomach begins to secrete before he swallows. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. A sensory signal reaches the lower brainstem, which then drives the stomach. Food is not yet in the stomach.$sc$,
  $qu$Which of the following started the secretion?$qu$,
  $op${"options": ["Local stretch of the stomach wall by a meal already there", "A message through the lower brain, before food arrives", "Gastrin released only after protein is in the stomach", "Segmentation mixing chyme in the small bowel", "Elimination, the last act a person can choose"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "long-reflex-sight-of-food", "taskCategory": "mechanism"}$op$,
  $ky$A message through the lower brain, before food arrives$ky$,
  $ex$The best choice is "A message through the lower brain, before food arrives". Sight, smell, and taste start long reflexes. A sensory neuron signals the medulla oblongata, which stimulates gastric secretion before food arrives. His stomach is secreting from the smell alone. "Local stretch of the stomach wall by a meal already there" is not the best choice because Distension of a stomach that already contains food starts a short, local reflex. Food has not arrived. "Gastrin released only after protein is in the stomach" is not the best choice because Gastrin is secreted in response to food in the stomach. The meal is not there yet. "Segmentation mixing chyme in the small bowel" is not the best choice because Segmentation mixes contents in the small intestine. It is not this preparatory secretion. "Elimination, the last act a person can choose" is not the best choice because Defecation eliminates residue. It does not start gastric secretion from a smell.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'fe77b712f2dd736c301b0a0339dfa1128126741fe5cef250ba95f2fe58385a2d', false, NOW(), NOW(), 3,
  'long-reflex-sight-of-food', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'long-reflex-sight-of-food', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-257", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "B", "verifiedFact": "Long reflexes use the central and autonomic nervous systems. Sight, smell, and taste send a signal to the medulla, which stimulates the stomach to secrete before food arrives. Short reflexes are local, as when distension increases secretion."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280258', 'usmle-step-1', 'physiology',
  $sc$A 44-year-old woman has a full stomach. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. Stretch of the wall makes nearby cells secrete more juice. The reflex stays in the wall of the stomach and does not travel to the brainstem.$sc$,
  $qu$Which of the following runs this reflex?$qu$,
  $op${"options": ["A sensory neuron that must reach the medulla first", "Only the sight of food, with an empty stomach", "Nerve plexuses in the wall, without a trip to the brainstem", "The hormone that the duodenum uses to release bicarbonate", "Chewing, which is still happening in the mouth"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "short-reflex-distension", "taskCategory": "mechanism"}$op$,
  $ky$Nerve plexuses in the wall, without a trip to the brainstem$ky$,
  $ex$The best choice is "Nerve plexuses in the wall, without a trip to the brainstem". Short reflexes are intrinsic plexuses in the alimentary wall. Stomach distension increases local secretion without a long trip through the central nervous system. Her full stomach is that stimulus. "A sensory neuron that must reach the medulla first" is not the best choice because A path through the medulla is a long reflex, such as secretion started by sight or smell. "Only the sight of food, with an empty stomach" is not the best choice because Sight of food with an empty stomach is the long reflex, the opposite of wall stretch. "The hormone that the duodenum uses to release bicarbonate" is not the best choice because Secretin from the duodenum causes pancreatic bicarbonate. It is not this local stretch reflex. "Chewing, which is still happening in the mouth" is not the best choice because Chewing is mechanical digestion in the mouth. The stomach is already full.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '64e179eebfc62b78dc8fbc7860753edaa09197c759d11a5abb878f368c048ca6', false, NOW(), NOW(), 2,
  'short-reflex-distension', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'short-reflex-distension', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-258", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "C", "verifiedFact": "Short reflexes are run by nerve plexuses in the gut wall. Distension of the stomach increases local secretion. They do not require the brain."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280259', 'usmle-step-1', 'physiology',
  $sc$A 39-year-old man has sensors in the stomach wall. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. One set responds to stretch, one to the chemical makeup of the meal, and one to how concentrated the liquid is. Those signals drive secretion and mixing.$sc$,
  $qu$Which of the following is sensed by the third set?$qu$,
  $op${"options": ["Only the sight of food, outside the body", "How long a bone is at the growth plate", "The temperature of shower water on the skin", "How strong the dissolved load in the lumen is", "Whether a research subject signed a consent form"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gut-sensors-three-kinds", "taskCategory": "mechanism"}$op$,
  $ky$How strong the dissolved load in the lumen is$ky$,
  $ex$The best choice is "How strong the dissolved load in the lumen is". Osmoreceptors detect osmotic stimuli, including how much liquid is present and its concentration. Mechanoreceptors detect stretch and chemoreceptors detect chemical makeup and nutrient type. His third set is the osmotic one. "Only the sight of food, outside the body" is not the best choice because Sight of food is an external stimulus for a long reflex, not a wall sensor. "How long a bone is at the growth plate" is not the best choice because Growth-plate sensing is not a gastric receptor. "The temperature of shower water on the skin" is not the best choice because Skin thermoreceptors start a sensory neural path. They are not in the stomach wall. "Whether a research subject signed a consent form" is not the best choice because Consent is a research-ethics step, not a gut sensor.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'eca5dca54d76321aee83c6c2f8aac631d4486ce9995c819a6075ba17349f437c', false, NOW(), NOW(), 2,
  'gut-sensors-three-kinds', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gut-sensors-three-kinds', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-259", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "D", "verifiedFact": "The gut wall has mechanoreceptors, chemoreceptors, and osmoreceptors for mechanical, chemical, and osmotic stimuli. They sense stretch, particle size, liquid, and nutrient type."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280260', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old man has food in his stomach. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. A hormone from the stomach lining rises and the cells that make acid increase their secretion. The meal is already present. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following cells increase acid secretion?$qu$,
  $op${"options": ["The pancreatic cells that release bicarbonate", "The liver cells that make bile salts", "The colon cells that absorb residual water", "The duodenal cells that slow gastric emptying", "The cells in the gastric wall that secrete acid"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gastrin-parietal-acid", "taskCategory": "mechanism"}$op$,
  $ky$The cells in the gastric wall that secrete acid$ky$,
  $ex$The best choice is "The cells in the gastric wall that secrete acid". Gastrin, released when food is present, stimulates parietal cells of the stomach mucosa to secrete gastric acid. His meal is already in the stomach and acid secretion rises. "The pancreatic cells that release bicarbonate" is not the best choice because Pancreatic bicarbonate secretion is stimulated by secretin, a duodenal hormone. "The liver cells that make bile salts" is not the best choice because Bile salts are a liver product. Gastrin does not make the liver the acid source. "The colon cells that absorb residual water" is not the best choice because The large intestine absorbs residual water. It is not the acid-secreting target of gastrin. "The duodenal cells that slow gastric emptying" is not the best choice because Gastric inhibitory peptide, from the duodenum, inhibits gastric secretion and slows emptying. It is not the hormone that increased acid.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b617e328ae221f9cc09b2d64c4fa0ed4f40b0df8bca2f3fce14105edb3131dc0', false, NOW(), NOW(), 2,
  'gastrin-parietal-acid', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gastrin-parietal-acid', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-260", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "E", "verifiedFact": "Gastrin is the main stomach hormone, secreted when food is present. It stimulates parietal cells to secrete gastric acid."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280261', 'usmle-step-1', 'physiology',
  $sc$A 37-year-old woman has acidic chyme entering the duodenum. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. A duodenal hormone makes the pancreas release a watery alkaline juice. The acid is neutralized so enzymes can work. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following does the pancreatic juice supply?$qu$,
  $op${"options": ["Alkali that neutralizes the acid coming from the stomach", "The acid itself, secreted by parietal cells", "Bile salts, which emulsify dietary fats", "The gastric factor required for vitamin B12", "The hormone that only slows gastric emptying down"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "secretin-pancreatic-bicarbonate", "taskCategory": "mechanism"}$op$,
  $ky$Alkali that neutralizes the acid coming from the stomach$ky$,
  $ex$The best choice is "Alkali that neutralizes the acid coming from the stomach". Secretin stimulates watery bicarbonate from the pancreas. That bicarbonate neutralizes acidic chyme and gives enzymes a better pH. Her duodenal hormone produced that alkaline juice. "The acid itself, secreted by parietal cells" is not the best choice because Parietal cells secrete gastric acid under gastrin. They are not the pancreatic response. "Bile salts, which emulsify dietary fats" is not the best choice because Bile salts from the liver emulsify lipids. They are not the watery alkaline pancreatic juice. "The gastric factor required for vitamin B12" is not the best choice because The gastric factor required for vitamin B12 is a stomach product, not pancreatic bicarbonate. "The hormone that only slows gastric emptying down" is not the best choice because Gastric inhibitory peptide slows gastric emptying and inhibits gastric secretion. It is not the alkali.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '793c5cd48c637b526968fce2662af442a1efafc1de8ad51b1b9a7034e24e91ce', false, NOW(), NOW(), 2,
  'secretin-pancreatic-bicarbonate', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secretin-pancreatic-bicarbonate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-261", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "A", "verifiedFact": "Secretin from the duodenum stimulates a watery bicarbonate secretion by the pancreas, which neutralizes acidic chyme."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280262', 'usmle-step-1', 'physiology',
  $sc$A 41-year-old man has a fatty meal in the duodenum. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. A duodenal hormone makes the pancreas release enzymes and makes the gallbladder release stored bile. Acid neutralization is a different hormone.$sc$,
  $qu$Which of the following does this hormone release from the gallbladder?$qu$,
  $op${"options": ["Only watery alkali, with neither enzymes nor bile", "Stored bile, along with pancreatic enzymes", "Gastric acid secreted by the parietal cells", "The gastric factor required for vitamin B12", "Mucus whose only job is to ease passage through the colon"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "cck-enzymes-and-bile", "taskCategory": "mechanism"}$op$,
  $ky$Stored bile, along with pancreatic enzymes$ky$,
  $ex$The best choice is "Stored bile, along with pancreatic enzymes". CCK stimulates pancreatic enzymes and bile from the liver, and it releases bile stored in the gallbladder. Secretin is the separate hormone for watery bicarbonate. His fatty meal triggered the bile-and-enzyme hormone. "Only watery alkali, with neither enzymes nor bile" is not the best choice because Watery alkali without enzymes is the secretin response. "Gastric acid secreted by the parietal cells" is not the best choice because Gastric acid is the gastrin effect on parietal cells. "The gastric factor required for vitamin B12" is not the best choice because Intrinsic factor is secreted by the stomach for vitamin B12 absorption. "Mucus whose only job is to ease passage through the colon" is not the best choice because Colonic mucus eases passage of feces. It is not the gallbladder release.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b234ea2207486882c1fdd45a033ef8c08627c8002019840a6511bb6e60c3425b', false, NOW(), NOW(), 3,
  'cck-enzymes-and-bile', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cck-enzymes-and-bile', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-262", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "B", "verifiedFact": "CCK from the duodenum stimulates pancreatic enzyme secretion and bile from the liver, and release of bile from the gallbladder."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280263', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old woman has chyme in the duodenum. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. A duodenal hormone reduces acid secretion and slows the stomach's emptying. The stomach does not rush the rest of the meal forward. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is the effect on the stomach?$qu$,
  $op${"options": ["More acid secretion from parietal cells", "Faster emptying so the duodenum fills at once", "Less acid secretion and slower emptying", "Release of stored bile from the gallbladder", "Completion of chemical digestion inside the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gip-slows-emptying", "taskCategory": "mechanism"}$op$,
  $ky$Less acid secretion and slower emptying$ky$,
  $ex$The best choice is "Less acid secretion and slower emptying". Gastric inhibitory peptide inhibits gastric secretion and slows gastric emptying and motility. Her duodenal hormone held the rest of the meal back and reduced acid. "More acid secretion from parietal cells" is not the best choice because More acid is the gastrin effect, the opposite of this hormone. "Faster emptying so the duodenum fills at once" is not the best choice because This hormone slows emptying. It does not speed it. "Release of stored bile from the gallbladder" is not the best choice because Gallbladder bile release is a CCK effect. "Completion of chemical digestion inside the stomach" is not the best choice because Chemical digestion is completed in the small intestine, not by this braking hormone inside the stomach.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9df2ef1000721b9312b5459230b8dda95e7dd3aa3ba8373551bdae639cfd34b4', false, NOW(), NOW(), 2,
  'gip-slows-emptying', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gip-slows-emptying', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-263", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "C", "verifiedFact": "Gastric inhibitory peptide inhibits gastric secretion and slows gastric emptying and motility."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280264', 'usmle-step-1', 'histology',
  $sc$A 26-year-old student looks at duodenal lining. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Scattered epithelial cells release a hormone. The hormone enters the blood and reaches the pancreas, rather than acting only on the neighboring cell through the lumen.$sc$,
  $qu$Which of the following path does the hormone take?$qu$,
  $op${"options": ["Only across a synapse onto the next neuron", "Into a lacteal, as if it were absorbed fat", "Back into the lumen as an enzyme", "Into the blood, then to the target organ", "Into cartilage, to lengthen a long bone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "endocrinocytes-into-blood", "taskCategory": "histology"}$op$,
  $ky$Into the blood, then to the target organ$ky$,
  $ex$The best choice is "Into the blood, then to the target organ". Endocrinocytes in the stomach and small-intestinal mucosa secrete GI hormones into the bloodstream, which carries them to target organs. The duodenal hormone reached the pancreas that way. "Only across a synapse onto the next neuron" is not the best choice because A neurotransmitter crosses a synapse. These hormones use the blood. "Into a lacteal, as if it were absorbed fat" is not the best choice because Lacteals carry absorbed lipids, not these hormones. "Back into the lumen as an enzyme" is not the best choice because Digestive enzymes are released into the lumen. These hormone-producing cells send their product into the blood. "Into cartilage, to lengthen a long bone" is not the best choice because Bone growth is unrelated to duodenal hormone delivery.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '06523b1450e10c9b6bf45d80f88761e10b28d04fca22ba4a4c8de6e2c817f609', false, NOW(), NOW(), 2,
  'endocrinocytes-into-blood', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'histology', 'endocrinocytes-into-blood', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-264", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "D", "verifiedFact": "GI hormones are secreted by endocrinocytes in the mucosal epithelium of the stomach and small intestine, then enter the bloodstream to reach their targets."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280265', 'usmle-step-1', 'physiology',
  $sc$A 50-year-old man has residue reaching the colon. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 130/82 mm Hg. Most of the remaining water is absorbed there, along with vitamins made by the local bacteria. Mucus helps the residue move toward the rectum.$sc$,
  $qu$Which of the following does this segment absorb besides water?$qu$,
  $op${"options": ["Most dietary glucose on the first pass through", "The fats that already entered lymph vessels upstream", "Fat-emulsifying salts, as if that were its only job", "The gastric factor, which it also secretes", "Cofactors made by the microbes that live there"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "large-bowel-residual-water", "taskCategory": "mechanism"}$op$,
  $ky$Cofactors made by the microbes that live there$ky$,
  $ex$The best choice is "Cofactors made by the microbes that live there". The large intestine absorbs most residual water, electrolytes, and vitamins produced by enteric bacteria, and mucus eases passage. His colon is doing that. "Most dietary glucose on the first pass through" is not the best choice because Most nutrient absorption, including carbohydrate breakdown products, is in the small intestine. "The fats that already entered lymph vessels upstream" is not the best choice because Fats are absorbed into lacteals in the small intestine, not as the colon's main uptake. "Fat-emulsifying salts, as if that were its only job" is not the best choice because Bile-salt handling is a small-intestinal and liver process. The colon's listed jobs are residual water, electrolytes, bacterial vitamins, and feces. "The gastric factor, which it also secretes" is not the best choice because Intrinsic factor is a gastric secretion required for vitamin B12 absorption in the small intestine.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ea52a4fbf1a299ed07fe0a29e080bf500e7ef3fa5cb66d5802c415e90ea514f5', false, NOW(), NOW(), 2,
  'large-bowel-residual-water', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'large-bowel-residual-water', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-265", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "E", "verifiedFact": "The large intestine absorbs most residual water, electrolytes, and vitamins made by enteric bacteria, propels feces, and eliminates them. Mucus eases passage."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280266', 'usmle-step-1', 'embryology',
  $sc$A 30-year-old couple reviews an embryo at six weeks. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The gonads can still become either ovary or testis. A single gene on one sex chromosome must act or the embryo follows the female path.$sc$,
  $qu$Which of the following happens if that gene does not act?$qu$,
  $op${"options": ["The gonads follow the female path", "The gonads become testes by default", "The Wolffian duct grows without any hormone", "Leydig cells secrete testosterone at once", "The glans becomes a penis without testosterone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "sry-directs-testis", "taskCategory": "mechanism"}$op$,
  $ky$The gonads follow the female path$ky$,
  $ex$The best choice is "The gonads follow the female path". Without a functional SRY gene on the Y chromosome, the bipotential gonad follows the female path, with oogonia and primordial follicles. Testes require the SRY cascade. "The gonads become testes by default" is not the best choice because Testes are not the default. They require SRY. "The Wolffian duct grows without any hormone" is not the best choice because The Wolffian duct needs testosterone to grow. Without the male cascade it degrades. "Leydig cells secrete testosterone at once" is not the best choice because Leydig cells secrete testosterone after the testis has formed, which requires SRY. "The glans becomes a penis without testosterone" is not the best choice because The same cells become the glans penis only with testosterone. Without it they become the clitoris.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', '0407e815fa3778dd04b2146e90531a957df9a3fb11eb715e0515449d43c21ec4', false, NOW(), NOW(), 3,
  'sry-directs-testis', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sry-directs-testis', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-266", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "A", "verifiedFact": "Without SRY, an embryo develops as female. SRY on the Y chromosome recruits genes for testis development and suppresses female development. Bipotential gonads can become either ovary or testis."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280267', 'usmle-step-1', 'embryology',
  $sc$A male embryo has testes. Temperature is not measured. Cells in the testis secrete testosterone, and a second secretion from supporting cells removes the duct that would have formed a uterus and tubes. The other duct, which will form the epididymis and ductus deferens, keeps growing. Slide number 14 is the matching section.$sc$,
  $qu$Which of the following keeps that second duct growing?$qu$,
  $op${"options": ["Absence of every secretion, the female default", "Androgen from the cells in the newly formed gonad", "A gene that is present only on two X chromosomes", "Follicle-stimulating hormone from a newborn pituitary", "Progesterone secreted by a yellowish body"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "testosterone-wolffian", "taskCategory": "mechanism"}$op$,
  $ky$Androgen from the cells in the newly formed gonad$ky$,
  $ex$The best choice is "Androgen from the cells in the newly formed gonad". Testosterone from Leydig cells stimulates the Wolffian duct, which becomes the epididymis, ductus deferens, and seminal vesicles. Sustentacular secretions separately degrade the Mullerian duct. His embryo has both of those male signals. "Absence of every secretion, the female default" is not the best choice because Without testosterone the Wolffian duct degrades, and without sustentacular secretion the Mullerian duct develops. That is the female pattern, not this growing male duct. "A gene that is present only on two X chromosomes" is not the best choice because XX embryos lack SRY and follow the female path. They do not grow the Wolffian duct. "Follicle-stimulating hormone from a newborn pituitary" is not the best choice because FSH rises as puberty approaches, years later. It is not the embryonic signal for the Wolffian duct. "Progesterone secreted by a yellowish body" is not the best choice because Progesterone is the corpus luteum's hormone in an adult cycle, not the embryonic duct signal.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', '7f4ff7ba982f960b25f215144f69fa20be8af40866a37fc7c87f1d8365ed9440', false, NOW(), NOW(), 3,
  'testosterone-wolffian', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'testosterone-wolffian', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-267", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "B", "verifiedFact": "Testosterone from Leydig cells grows the Wolffian duct into the male tract. Without testosterone the Wolffian duct degrades. Sustentacular-cell secretions degrade the Mullerian duct in males. Without those secretions the Mullerian duct develops."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280268', 'usmle-step-1', 'embryology',
  $sc$An embryo's external genitals can still follow either path. Temperature is not measured. The same group of cells will form one structure if testosterone is present and a different structure if it is absent. Internal ducts are a separate decision. Slide number 14 is the matching section.$sc$,
  $qu$Which of the following forms if testosterone is absent?$qu$,
  $op${"options": ["The glans penis, treated as the default form", "The epididymis, from the duct that needs androgen", "What those cells become when androgen is absent", "The testes, which form with no gene on the Y", "A uterus, which comes from that same external bud"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glans-bipotential", "taskCategory": "mechanism"}$op$,
  $ky$What those cells become when androgen is absent$ky$,
  $ex$The best choice is "What those cells become when androgen is absent". The bipotential cells become the glans penis with testosterone and the clitoris without it. Absence of testosterone yields the clitoris. "The glans penis, treated as the default form" is not the best choice because The glans penis requires testosterone. It is not the default. "The epididymis, from the duct that needs androgen" is not the best choice because The epididymis comes from the Wolffian duct, which also needs testosterone, but it is not this external bud. "The testes, which form with no gene on the Y" is not the best choice because Testes require SRY. They are not the no-androgen default of this external tissue. "A uterus, which comes from that same external bud" is not the best choice because The uterus develops from the Mullerian duct, an internal duct, not from the external glans cells.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', 'fc4f86ebe6c6095f8b1b06f8c9a1d692a04fe67e56dc455e526124c7ce673c68', false, NOW(), NOW(), 2,
  'glans-bipotential', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'glans-bipotential', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-268", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "C", "verifiedFact": "With testosterone, bipotential cells form the glans penis. Without testosterone the same cells form the clitoris."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280269', 'usmle-step-1', 'embryology',
  $sc$A pregnancy is four weeks along. Temperature of the mother is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. The early gonads are just beginning to form. After birth, this system changes little until the years just before sexual maturity. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is the quiet interval?$qu$,
  $op${"options": ["The first month after conception, when the gonads start", "The midcycle gonadotropin burst that expels an oocyte", "Childbirth, when oxytocin release keeps rising", "From infancy until the years just before reproductive maturity", "The week after ovulation, when progesterone is high"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "primordial-gonads-one-month", "taskCategory": "mechanism"}$op$,
  $ky$From infancy until the years just before reproductive maturity$ky$,
  $ex$The best choice is "From infancy until the years just before reproductive maturity". Primordial gonads start about one month after conception. Between infancy and puberty there is little change in the reproductive system. The vignette names that quiet interval. "The first month after conception, when the gonads start" is not the best choice because The first month is when the gonads begin, not the long quiet interval. "The midcycle gonadotropin burst that expels an oocyte" is not the best choice because The LH surge is an adult ovarian-cycle event. "Childbirth, when oxytocin release keeps rising" is not the best choice because Oxytocin in labor is positive feedback at delivery, not the childhood interval. "The week after ovulation, when progesterone is high" is not the best choice because The luteal progesterone peak is an adult cycle phase.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', 'e842c178fc8096816f5640c0f53f607aa5abbb5091a13bb8f774eb3c19fc9078', false, NOW(), NOW(), 2,
  'primordial-gonads-one-month', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'primordial-gonads-one-month', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-269", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "D", "verifiedFact": "Primordial gonads begin to develop about one month after conception. Little reproductive change occurs between infancy and puberty."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280270', 'usmle-step-1', 'physiology',
  $sc$A 9-year-old child is entering the start of sexual maturation. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 100/62 mm Hg. Before this, a very small amount of sex steroid was enough to shut off the brain signals. Now it takes a higher steroid level to shut them off, and the gonads respond more strongly to the pituitary signals.$sc$,
  $qu$Which of the following changed in the brain's control?$qu$,
  $op${"options": ["A lower steroid level shuts the signals off more easily than before", "The gonads ignore pituitary signals more than they did in childhood", "Childbirth hormone release replaces the pituitary drive", "The growth plate seals and height gain stops at once", "A higher steroid level is now required to turn the drive off"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "puberty-feedback-less-sensitive", "taskCategory": "mechanism"}$op$,
  $ky$A higher steroid level is now required to turn the drive off$ky$,
  $ex$The best choice is "A higher steroid level is now required to turn the drive off". At puberty the hypothalamus and pituitary become less sensitive to negative feedback, so larger sex-steroid concentrations are needed to suppress LH and FSH. The gonads also become more sensitive to those pituitary signals. This child is at that change. "A lower steroid level shuts the signals off more easily than before" is not the best choice because Higher sensitivity, with shutdown by very low steroids, is the prepubertal pattern. "The gonads ignore pituitary signals more than they did in childhood" is not the best choice because The gonads become more responsive to LH and FSH, not less. "Childbirth hormone release replaces the pituitary drive" is not the best choice because Oxytocin is the labor hormone. Puberty is driven by GnRH, LH, FSH, and gonadal steroids. "The growth plate seals and height gain stops at once" is not the best choice because Growth-plate closure ends height gain in early adulthood. It is not the brain change described.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd18c5e9a4b3edb6264e9ebc1f5d3a173ba9813db2ba4f9874cecbeb9daacd3e8', false, NOW(), NOW(), 4,
  'puberty-feedback-less-sensitive', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'puberty-feedback-less-sensitive', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-270", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "E", "verifiedFact": "Before puberty, tiny amounts of sex steroid shut off GnRH, LH, and FSH. At puberty the hypothalamus and pituitary become less sensitive to that negative feedback, and the gonads become more sensitive to LH and FSH."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280271', 'usmle-step-1', 'physiology',
  $sc$An 8-year-old child has no breast development and no growth of the testes. Temperature is 36.6°C, pulse is 78/min, respirations are 16/min, and blood pressure is 98/60 mm Hg. A pituitary hormone is already detectable, mostly during sleep. Body changes will not show for several years.$sc$,
  $qu$Which of the following is already happening?$qu$,
  $op${"options": ["A glandular product can be measured mainly at night", "Cyclic monthly bleeding has already occurred", "Fertile ejaculations are already present by then", "The growth spurt of 4 inches a year is underway", "The growth lines in the long bones have all sealed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "lh-night-before-puberty", "taskCategory": "mechanism"}$op$,
  $ky$A glandular product can be measured mainly at night$ky$,
  $ex$The best choice is "A glandular product can be measured mainly at night". LH becomes detectable around age 8 or 9, mainly at night during sleep, years before physical puberty. This child has no visible changes yet, which fits. "Cyclic monthly bleeding has already occurred" is not the best choice because The beginning of cyclic monthly bleeding follows breast development, hair, and the growth spurt. It has not occurred. "Fertile ejaculations are already present by then" is not the best choice because The first fertile ejaculations are typically around age 15, with wide variation. "The growth spurt of 4 inches a year is underway" is not the best choice because The male growth spurt is near the end of puberty, about ages 11 to 13. This child has no physical signs yet. "The growth lines in the long bones have all sealed" is not the best choice because Open plates are expected in a growing child. Sealed lines mean growth in length has stopped.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '8e3bc08d3fc6acd07a1000db580f165d2fb1ce501071960f3c17a68c47a34f3d', false, NOW(), NOW(), 3,
  'lh-night-before-puberty', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lh-night-before-puberty', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-271", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "A", "verifiedFact": "LH first becomes detectable around age 8 or 9, mainly at night during sleep, several years before physical changes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280272', 'usmle-step-1', 'physiology',
  $sc$A 10-year-old girl has new breast tissue and is growing about 3 inches a year. Temperature is 36.6°C, pulse is 82/min, respirations are 16/min, and blood pressure is 102/64 mm Hg. Axillary and pubic hair are starting. She has not yet had a first menstrual period. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following comes next in the usual sequence?$qu$,
  $op${"options": ["Growth of the testes, as the first physical sign", "Monthly bleeding starts after the growth spurt has begun", "Deepening of the voice from growth of the larynx", "A nocturnal hormone with no later body changes at all", "Sealing of every growth plate in a long bone before any height gain"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "female-puberty-sequence", "taskCategory": "mechanism"}$op$,
  $ky$Monthly bleeding starts after the growth spurt has begun$ky$,
  $ex$The best choice is "Monthly bleeding starts after the growth spurt has begun". The usual female order is breast development, then axillary and pubic hair, a growth spurt from about age 9 to 11 of about 3 inches a year, and then menarche. She has the earlier steps and has not menstruated yet. "Growth of the testes, as the first physical sign" is not the best choice because Testicular growth is the typical first physical sign in males. "Deepening of the voice from growth of the larynx" is not the best choice because Laryngeal growth and a lower voice are male secondary characteristics driven by testosterone. "A nocturnal hormone with no later body changes at all" is not the best choice because Nighttime LH starts years earlier and is followed by body changes. It is not the next step now. "Sealing of every growth plate in a long bone before any height gain" is not the best choice because Height is increasing. Plate closure would stop that gain.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '2f9d4b7d540678f120f6c093a9e657d0ce53876113033ad9a4420297814feb1e', false, NOW(), NOW(), 2,
  'female-puberty-sequence', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'female-puberty-sequence', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-272", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "B", "verifiedFact": "In females the first visible puberty change is breast development, then axillary and pubic hair. The growth spurt starts about age 9 to 11 and can add about 3 inches a year. The beginning of cyclic monthly bleeding comes after that."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280273', 'usmle-step-1', 'physiology',
  $sc$A 13-year-old boy has enlarging testes, a larger scrotum, and new facial and pubic hair. Temperature is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. His voice is dropping. His fastest height gain is happening now, later than the typical girl of the same age.$sc$,
  $qu$Which of the following was the first physical sign in this sequence?$qu$,
  $op${"options": ["Breast development, as in the female sequence", "The beginning of cyclic monthly bleeding", "Enlargement of the male gonads, before the voice drops", "A growth spurt at age 9, before any genital change", "Fertile ejaculations during early infancy"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "male-puberty-sequence", "taskCategory": "mechanism"}$op$,
  $ky$Enlargement of the male gonads, before the voice drops$ky$,
  $ex$The best choice is "Enlargement of the male gonads, before the voice drops". In males the first physical sign is growth of the testes, followed by scrotum and penis, then hair, then laryngeal growth with a lower voice. The growth spurt is later, about ages 11 to 13. His sequence started with the testes. "Breast development, as in the female sequence" is not the best choice because Breast development is the typical first visible change in females. "The beginning of cyclic monthly bleeding" is not the best choice because The beginning of cyclic monthly bleeding is part of female puberty. "A growth spurt at age 9, before any genital change" is not the best choice because The female growth spurt starts about ages 9 to 11. The male spurt is toward the end of puberty. "Fertile ejaculations during early infancy" is not the best choice because Fertile ejaculations typically appear around age 15, not in infancy.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '1ab5e36cedc21846e6e9cd768124857b325959d9c290e0cc1f94cdadbd72a317', false, NOW(), NOW(), 2,
  'male-puberty-sequence', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'male-puberty-sequence', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-273", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "C", "verifiedFact": "In males the first physical sign is testicular growth, then scrotal and penile growth, then hair. The larynx enlarges and the voice drops. Fertile ejaculations are typically around age 15. The growth spurt is later, about ages 11 to 13, up to about 4 inches a year, and can continue into the early 20s."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280274', 'usmle-step-1', 'physiology',
  $sc$A 15-year-old girl who trains as a gymnast has very little body fat and has not had a first menstrual period. Temperature is 36.5°C, pulse is 54/min, respirations are 12/min, and blood pressure is 98/60 mm Hg. A hormone from her fat cells is low. The same delay is described in other extremely lean, active girls.$sc$,
  $qu$Which of the following is the likely reason maturation is delayed?$qu$,
  $op${"options": ["Excess fat, which always delays the first period", "A sealed growth plate, which stops every hormone", "Nighttime hormone release, which prevents puberty", "Very low body fat and a low signal from fat cells", "Absence of a Y chromosome, which blocks ovaries"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "leptin-menarche-fat", "taskCategory": "mechanism"}$op$,
  $ky$Very low body fat and a low signal from fat cells$ky$,
  $ex$The best choice is "Very low body fat and a low signal from fat cells". Leptin from adipose cells and the amount of stored fat are linked to menarche. Extremely lean, highly active girls often have delayed puberty. She is a lean gymnast who has not menstruated. "Excess fat, which always delays the first period" is not the best choice because The section links low fat, not excess fat, to delay. Better nutrition historically moved average menarche earlier, from about 17 years in 1860 to about 12.75 years. "A sealed growth plate, which stops every hormone" is not the best choice because Growth-plate closure ends height gain. It does not explain a missing first period in a lean athlete. "Nighttime hormone release, which prevents puberty" is not the best choice because Nighttime LH is the normal early signal of puberty, not a block. "Absence of a Y chromosome, which blocks ovaries" is not the best choice because Absence of a Y chromosome is the ordinary female path. It does not delay menarche.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '2d8a4728994b89fdc7d826d1c5b602bee58645bc08bfddc44c6190f0a90dc241', false, NOW(), NOW(), 3,
  'leptin-menarche-fat', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'leptin-menarche-fat', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-274", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": true, "keyLetter": "D", "verifiedFact": "Body fat and leptin from adipose cells are linked to menarche. Very lean, highly active girls such as gymnasts often have delayed puberty. Average menarche fell from about 17 years in 1860 to about 12.75 years by 1960 and remains there."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280275', 'usmle-step-1', 'physiology',
  $sc$A 14-year-old girl has a wider pelvis, more fat at the hips and breasts, and new axillary and pubic hair. Temperature is 36.6°C, pulse is 78/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. These changes support reproduction but are not the gonads themselves. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following are these changes?$qu$,
  $op${"options": ["The early gonad becoming a male gonad instead", "The embryonic duct that becomes the epididymis", "The primary ossification center of the femur", "The hormone that rises during childbirth", "Traits with a supporting role, apart from ovary or testis"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "secondary-sex-characteristics", "taskCategory": "mechanism"}$op$,
  $ky$Traits with a supporting role, apart from ovary or testis$ky$,
  $ex$The best choice is "Traits with a supporting role, apart from ovary or testis". Secondary sexual characteristics are physical changes with auxiliary roles in reproduction. In females they include breast and hip fat, breast development, a broader pelvis, and axillary and pubic hair. She has those, distinct from the ovary itself. "The early gonad becoming a male gonad instead" is not the best choice because The bipotential gonad becomes a testis only with SRY. She is describing body-shape changes. "The embryonic duct that becomes the epididymis" is not the best choice because The epididymis is a Wolffian-duct derivative, not these external changes. "The primary ossification center of the femur" is not the best choice because The primary ossification center is fetal bone formation. "The hormone that rises during childbirth" is not the best choice because Oxytocin drives labor contractions. It is not this set of puberty changes.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '2b9a6e6e58edf025a9d574d54e60bd56a44c235a28b86474f68050f2d191acc7', false, NOW(), NOW(), 2,
  'secondary-sex-characteristics', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secondary-sex-characteristics', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-275", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "E", "verifiedFact": "Female secondary characteristics include fat at breasts and hips, breast development, a broader pelvis, and axillary and pubic hair. Male characteristics include a larger larynx and deeper voice, more muscle, and facial, axillary, and pubic hair."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280276', 'usmle-step-1', 'physiology',
  $sc$An embryo at seven weeks is forming bone. Temperature is not measured. Until now the skeleton was membranes and cartilage. Mineralized bone is just starting to replace those models. Slide number 14 is the matching section. The finding was confirmed in the same record. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following has just started?$qu$,
  $op${"options": ["Replacement of membrane and the cartilage model by bone", "Sealing of every growth plate in a long bone", "The adult remodeling rate of a few percent a year", "The beginning of cyclic monthly bleeding", "A positive pregnancy test from a corpus luteum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "ossification-begins-week-six", "taskCategory": "mechanism"}$op$,
  $ky$Replacement of membrane and the cartilage model by bone$ky$,
  $ex$The best choice is "Replacement of membrane and the cartilage model by bone". Ossification begins by the sixth or seventh week, replacing the fibrous membranes and hyaline cartilage of the early skeleton. This embryo is at that start. "Sealing of every growth plate in a long bone" is not the best choice because Growth plates close in early adulthood, not at seven weeks. "The adult remodeling rate of a few percent a year" is not the best choice because Five to ten percent yearly remodeling is an adult process. "The beginning of cyclic monthly bleeding" is not the best choice because The beginning of cyclic monthly bleeding is a puberty event. "A positive pregnancy test from a corpus luteum" is not the best choice because The yellowish body left after ovulation supports early pregnancy. It is not the start of ossification.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ba25f543c5f27db1d9bd56954357689ab0aa1bc618e2806cc14f4fa6555b5ebc', false, NOW(), NOW(), 2,
  'ossification-begins-week-six', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ossification-begins-week-six', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-276", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "A", "verifiedFact": "The embryonic skeleton starts as fibrous membranes and hyaline cartilage. Ossification begins by the sixth or seventh week."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280277', 'usmle-step-1', 'histology',
  $sc$A fetal bone model is still cartilage. Temperature is not measured. The cells secrete a semi-solid matrix of water, a sugar acid, a sulfated sugar, and a strong fiber protein. Once the matrix walls a cell off, the cell's name changes. Slide number 14 is the matching section. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is in that matrix besides water and the fiber protein?$qu$,
  $op${"options": ["The lung lining secreted by alveolar cells", "A sugar acid together with a sulfated chain", "Bile salts, which emulsify dietary fat", "Cyclic AMP used as if it were a structural fiber", "The strong acid secreted in the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "cartilage-matrix-ingredients", "taskCategory": "histology"}$op$,
  $ky$A sugar acid together with a sulfated chain$ky$,
  $ex$The best choice is "A sugar acid together with a sulfated chain". Chondroblasts produce a matrix of hyaluronic acid, chondroitin sulfate, collagen, and water. Walled-off cells are chondrocytes. The sugar acid and sulfated sugar are the non-collagen, non-water parts named here. "The lung lining secreted by alveolar cells" is not the best choice because Surfactant is a lung product, not cartilage matrix. "Bile salts, which emulsify dietary fat" is not the best choice because Bile salts emulsify fat. They are not in the cartilage model. "Cyclic AMP used as if it were a structural fiber" is not the best choice because Cyclic AMP is a second messenger, not a structural matrix fiber. "The strong acid secreted in the stomach" is not the best choice because Gastric acid is not a component of the cartilage model.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '8b9320cfd9037d4b7c46b1de4ccc42658e48a9b53c4c472310ac479501c53e55', false, NOW(), NOW(), 2,
  'cartilage-matrix-ingredients', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'histology', 'cartilage-matrix-ingredients', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-277", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "B", "verifiedFact": "The cartilage model matrix is made by chondroblasts and contains hyaluronic acid, chondroitin sulfate, collagen, and water. Isolated chondroblasts are called chondrocytes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280278', 'usmle-step-1', 'anatomy',
  $sc$A newborn's skull bones are not fused. Temperature is 36.8°C, pulse is 140/min, respirations are 40/min. The gaps let the head change shape during delivery. The flat bones of the face will not reach adult size until the end of the adolescent growth spurt. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is the reason the skull bones are unfused?$qu$,
  $op${"options": ["Because cartilage never forms in the skull", "Because the growth plates of the face have sealed", "So the head can mold while the baby is being born", "Because remodeling has already stopped", "Because the clavicles form by replacing cartilage"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "skull-sutures-open-at-birth", "taskCategory": "anatomy"}$op$,
  $ky$So the head can mold while the baby is being born$ky$,
  $ex$The best choice is "So the head can mold while the baby is being born". At birth the skull and clavicles are not fully ossified and the sutures are open so the head and shoulders can deform in the birth canal. Facial bones finish later, at the end of the adolescent growth spurt. "Because cartilage never forms in the skull" is not the best choice because Most cranial bones do form from membrane, but the open sutures are specifically for passage through the birth canal, not because cartilage is impossible. The skull base uses cartilage. "Because the growth plates of the face have sealed" is not the best choice because Sealed plates would mean growth is finished. The face is still far from adult size. "Because remodeling has already stopped" is not the best choice because Remodeling continues in adult life. It has not stopped. "Because the clavicles form by replacing cartilage" is not the best choice because Clavicles form by intramembranous ossification, not by replacing a cartilage model.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'f0a2009a840928e9ceb8fa96de683b15f1eb8358cb68a05245c436216082e1e7', false, NOW(), NOW(), 2,
  'skull-sutures-open-at-birth', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'skull-sutures-open-at-birth', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-278", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "C", "verifiedFact": "At birth the skull and clavicles are not fully ossified and the sutures are not closed, so the head and shoulders can deform in the birth canal. Facial bones are the last to finish intramembranous ossification, at the end of the adolescent growth spurt."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280279', 'usmle-step-1', 'physiology',
  $sc$A 2-year-old child has bone forming in the ends of the femurs. Temperature is 36.6°C, pulse is 100/min, respirations are 22/min, and blood pressure is 90/56 mm Hg. The shaft center formed before birth. Cartilage remains at the joint surface and in the plate between the end and the shaft.$sc$,
  $qu$Which of the following are the centers now forming in the ends?$qu$,
  $op${"options": ["The first shaft center, which appears before birth", "The facial bones forming directly from embryonic tissue", "The sealed line left after lengthwise growth stops", "The centers that appear in the bone ends after birth", "The marrow cavity, which is not a center of bone formation"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "secondary-ossification-centers", "taskCategory": "mechanism"}$op$,
  $ky$The centers that appear in the bone ends after birth$ky$,
  $ex$The best choice is "The centers that appear in the bone ends after birth". Secondary ossification centers develop in the epiphyses after birth. The primary center is in the shaft before birth. Cartilage remains as articular cartilage and the growth plate. This child has the later centers. "The first shaft center, which appears before birth" is not the best choice because The primary center is the earlier shaft center, deep to the periosteal collar. "The facial bones forming directly from embryonic tissue" is not the best choice because Facial bones use intramembranous ossification. They are not the end-of-femur centers. "The sealed line left after lengthwise growth stops" is not the best choice because The epiphyseal line is what remains after the plate closes, later. "The marrow cavity, which is not a center of bone formation" is not the best choice because The medullary cavity is a space, not an ossification center.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '19a8163be8534c7b01bad07bbea7f7aa1036e483b1e8a17665a45cf03ed148c1', false, NOW(), NOW(), 2,
  'secondary-ossification-centers', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secondary-ossification-centers', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-279", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "D", "verifiedFact": "After birth, secondary ossification centers form in the epiphyses. Cartilage remains as articular cartilage and as the epiphyseal plate."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280280', 'usmle-step-1', 'physiology',
  $sc$A 11-year-old boy has an open growth plate. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. Moving from the end toward the shaft, cartilage cells get older and larger. Nearest the shaft, most of those cells are dead because the matrix has hardened.$sc$,
  $qu$Which of the following zone has the older, larger cells?$qu$,
  $op${"options": ["The reserve layer that only anchors the plate", "The layer that has already become an epiphyseal line", "The outer membrane, where width is added", "The medullary cavity, which contains no cartilage cells", "The zone of enlargement just before the hardened layer"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "hypertrophy-zone", "taskCategory": "mechanism"}$op$,
  $ky$The zone of enlargement just before the hardened layer$ky$,
  $ex$The best choice is "The zone of enlargement just before the hardened layer". The zone of maturation and hypertrophy holds older, larger chondrocytes closer to the diaphysis. The next zone, nearest the shaft, is calcified and its chondrocytes are mostly dead. His plate shows that gradient. "The reserve layer that only anchors the plate" is not the best choice because The reserve zone secures the plate and its small cells do not drive growth. "The layer that has already become an epiphyseal line" is not the best choice because An epiphyseal line means the plate has closed. His plate is open. "The outer membrane, where width is added" is not the best choice because The periosteum adds width by appositional growth. It is not a zone of the plate. "The medullary cavity, which contains no cartilage cells" is not the best choice because The medullary cavity has no columns of growth-plate chondrocytes.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6ae28beb4d5a574f2f395e37400cb1f7488fe18d12191cf56497540120f0597f', false, NOW(), NOW(), 3,
  'hypertrophy-zone', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'hypertrophy-zone', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-280", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "E", "verifiedFact": "In the zone of maturation and hypertrophy, older and larger chondrocytes lie closer to the diaphysis. Length comes from proliferation plus this maturation. The calcified zone nearest the shaft has mostly dead chondrocytes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280281', 'usmle-step-1', 'pathology',
  $sc$A 9-year-old girl with bones that break easily is choosing exercise. Temperature is 36.6°C, pulse is 88/min, respirations are 18/min, and blood pressure is 100/62 mm Hg. Her matrix protein is defective. The safer exercise avoids collisions and compressive force. Extra body weight and smoking would add risk.$sc$,
  $qu$Which of the following exercise fits that advice?$qu$,
  $op${"options": ["Activity in water, where impacts and compression are less likely", "Collision sports, because the bones need impact to harden", "No activity at all, because every movement fractures bone", "Weight gain, because heavier bones do not break", "A cure that replaces the defective protein permanently"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "oi-exercise-and-risk", "taskCategory": "mechanism"}$op$,
  $ky$Activity in water, where impacts and compression are less likely$ky$,
  $ex$The best choice is "Activity in water, where impacts and compression are less likely". Osteogenesis imperfecta has no known cure. Swimming is recommended because the body is less likely to meet collisions or compressive force. Smoking and extra weight are especially risky. She should choose the water exercise. "Collision sports, because the bones need impact to harden" is not the best choice because Impact and collision raise fracture risk. They are not advised. "No activity at all, because every movement fractures bone" is not the best choice because Safe exercise is encouraged so she can stay mobile. Total avoidance is not the recommendation. "Weight gain, because heavier bones do not break" is not the best choice because Extra body weight adds stress on fragile bones. "A cure that replaces the defective protein permanently" is not the best choice because There is no known cure. Treatment limits fractures and supports mobility. Bisphosphonates are being studied, not established here as a cure.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', '684f79a847cf08d295544184e74628c94dfb10f2b0014d526262925015696de6', false, NOW(), NOW(), 2,
  'oi-exercise-and-risk', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'oi-exercise-and-risk', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-281", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "A", "verifiedFact": "For osteogenesis imperfecta there is no cure. Swimming is recommended because collisions and compression are less likely. Smoking and extra weight are especially risky. Bisphosphonates are under study."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280282', 'usmle-step-1', 'physiology',
  $sc$A 21-year-old man tests bath water with his fingers. Pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Sensors in the skin change their membrane voltage according to how hot the water is. A traveling signal starts only if that local change is large enough.$sc$,
  $qu$Which of the following sensors started the local voltage change?$qu$,
  $op${"options": ["Muscle end plates, which release the first sensory chemical", "Skin receptors whose local voltage matches how strong the stimulus is", "Descending motor cells that begin in the frontal lobe", "Sensors of solute concentration in the stomach wall", "Cartilage cells that are stacked in the growth plate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "thermoreceptor-skin", "taskCategory": "mechanism"}$op$,
  $ky$Skin receptors whose local voltage matches how strong the stimulus is$ky$,
  $ex$The best choice is "Skin receptors whose local voltage matches how strong the stimulus is". Thermoreceptors in the skin produce a graded potential proportional to stimulus strength. If it reaches threshold, an action potential starts at the initial segment. His finger test began there. "Muscle end plates, which release the first sensory chemical" is not the best choice because The end plate is where the lower motor neuron meets muscle, at the end of the motor path. "Descending motor cells that begin in the frontal lobe" is not the best choice because Upper motor neurons send the command out after cortical integration. "Sensors of solute concentration in the stomach wall" is not the best choice because Gastric osmoreceptors sense luminal concentration, not bath water on the skin. "Cartilage cells that are stacked in the growth plate" is not the best choice because The sensors here are thermoreceptors. The option that restates a different organ is not the source of this voltage.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '06846419e9097bbdbb73f0b9a6ebb6d8365b2efbc3a72526ae54c9f5f84350f3', false, NOW(), NOW(), 2,
  'thermoreceptor-skin', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'thermoreceptor-skin', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-282", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "B", "verifiedFact": "Thermoreceptors in the skin change membrane voltage in proportion to temperature. That graded potential, if large enough, starts an action potential at the initial segment."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280283', 'usmle-step-1', 'physiology',
  $sc$A 26-year-old woman contracts her biceps. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. A chemical from the nerve produces a large potential at the muscle membrane under the nerve ending. A traveling potential then runs along the muscle fiber, and the fiber shortens.$sc$,
  $qu$Which of the following potential comes first at the muscle?$qu$,
  $op${"options": ["The traveling potential that shortens the fiber, with no prior spike", "A local voltage change inside a skin heat receptor", "The large local voltage beneath the nerve terminal", "The cortical command, as if recorded on the muscle", "A hormone second messenger made from ATP in the liver"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "end-plate-then-muscle-potential", "taskCategory": "mechanism"}$op$,
  $ky$The large local voltage beneath the nerve terminal$ky$,
  $ex$The best choice is "The large local voltage beneath the nerve terminal". Acetylcholine produces an end-plate potential first. The muscle action potential follows, and the fiber contracts. Her biceps showed that order. "The traveling potential that shortens the fiber, with no prior spike" is not the best choice because The traveling muscle potential comes after the large local end-plate potential, not instead of it. "A local voltage change inside a skin heat receptor" is not the best choice because A skin thermoreceptor is the sensory start, not the potential under the nerve ending on muscle. "The cortical command, as if recorded on the muscle" is not the best choice because The cortical command is in the upper motor neuron. It is not a potential recorded as the first event on the muscle. "A hormone second messenger made from ATP in the liver" is not the best choice because Cyclic AMP is a hormone second messenger, not the neuromuscular potential.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '8d69c32411b85989adbc5bfc4a81354f594b03d7c33b5a5b8c82beb24575fb05', false, NOW(), NOW(), 3,
  'end-plate-then-muscle-potential', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'end-plate-then-muscle-potential', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-283", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "C", "verifiedFact": "Acetylcholine at the neuromuscular junction causes an end-plate potential and then a muscle action potential, and the fiber contracts."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280284', 'usmle-step-1', 'anatomy',
  $sc$A 23-year-old man feels a pin on his finger. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The sensory fiber enters the cord and meets the next cell in the cord's gray matter. The path then continues upward. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following is the first meeting place inside the cord?$qu$,
  $op${"options": ["The muscle, before any cord cell is involved", "The outer gray matter of the brain, with no cord stop", "The gallbladder, which releases stored bile", "A contact in the cord's central gray, before the upward path", "The ovary, at the moment an oocyte is released"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "sensory-axon-enters-cord", "taskCategory": "anatomy"}$op$,
  $ky$A contact in the cord's central gray, before the upward path$ky$,
  $ex$The best choice is "A contact in the cord's central gray, before the upward path". The sensory axon enters the spinal cord and synapses on another neuron in the gray matter. The path then continues toward the thalamus and cortex. His pin sensation uses that first cord contact. "The muscle, before any cord cell is involved" is not the best choice because The muscle is the end of the motor path, not the sensory entry. "The outer gray matter of the brain, with no cord stop" is not the best choice because The cortex is where conscious perception begins, after the cord and the thalamus. "The gallbladder, which releases stored bile" is not the best choice because Bile release is a digestive hormone effect, not a sensory synapse. "The ovary, at the moment an oocyte is released" is not the best choice because Ovulation is ovarian. It is not the cord synapse.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '21b250dec85523723ac3112abb727676eccb1be654d5f840c2f8d226c3861fd7', false, NOW(), NOW(), 2,
  'sensory-axon-enters-cord', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'sensory-axon-enters-cord', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-284", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "D", "verifiedFact": "The peripheral sensory axon's process enters the spinal cord and synapses in the gray matter. From there the path continues toward the thalamus."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280285', 'usmle-step-1', 'anatomy',
  $sc$A 45-year-old woman becomes aware of a cold glass in her hand. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The signal has passed the deep relay. Awareness begins in the outer layer of gray matter of the brain. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following layer is required for that awareness?$qu$,
  $op${"options": ["The muscle membrane under the nerve ending", "The cartilage that remains in the growth plate", "The lining that releases the acid-stimulating hormone", "The yellowish body left after ovulation", "The outer gray layer of the cerebral hemispheres"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "cortex-outer-gray", "taskCategory": "anatomy"}$op$,
  $ky$The outer gray layer of the cerebral hemispheres$ky$,
  $ex$The best choice is "The outer gray layer of the cerebral hemispheres". The cerebral cortex is the outermost gray matter of the brain, and conscious perception begins there after the thalamic relay. She becomes aware at that layer. "The muscle membrane under the nerve ending" is not the best choice because The end plate is a motor ending on muscle. "The cartilage that remains in the growth plate" is not the best choice because The growth plate lengthens bone. It does not perceive temperature. "The lining that releases the acid-stimulating hormone" is not the best choice because Gastrin-releasing mucosa is gastric. It is not the site of awareness. "The yellowish body left after ovulation" is not the best choice because The yellowish body left after ovulation secretes progesterone. It is not sensory cortex.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '38fd78933c1de75813c8907ee944e9f967ac5ad58e6ea71a7b084e5dabd539ed', false, NOW(), NOW(), 2,
  'cortex-outer-gray', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'cortex-outer-gray', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-285", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "E", "verifiedFact": "The cerebral cortex is the outermost layer of gray matter, where conscious perception begins."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280286', 'usmle-step-1', 'physiology',
  $sc$A 18-year-old student maps where each digestive job can occur. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. One job happens at a single entrance and nowhere else. Elimination happens at a single exit. Mixing and chemical breakdown occur in more than one organ.$sc$,
  $qu$Which of the following job happens only at the entrance?$qu$,
  $op${"options": ["Taking food into the alimentary canal", "Eliminating what was never absorbed", "Splitting proteins into their amino acids", "Absorbing fats into the lymph vessels", "Neutralizing gastric acid with pancreatic alkali"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "ingestion-only-mouth", "taskCategory": "mechanism"}$op$,
  $ky$Taking food into the alimentary canal$ky$,
  $ex$The best choice is "Taking food into the alimentary canal". Ingestion, the entry of food, occurs only in the mouth. Defecation occurs only at the anus. Chemical digestion, absorption, and neutralization involve other organs. The single-entrance job is ingestion. "Eliminating what was never absorbed" is not the best choice because Elimination of residue is defecation, which occurs at the anus, the exit. "Splitting proteins into their amino acids" is not the best choice because Protein breakdown is chemical digestion. It continues beyond the mouth and is completed in the small intestine. "Absorbing fats into the lymph vessels" is not the best choice because Fat uptake into lacteals is absorption in the small intestine. "Neutralizing gastric acid with pancreatic alkali" is not the best choice because Pancreatic bicarbonate neutralizes acid in the duodenum. It is not ingestion.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4808ccd70b2e64d6ce97054c8f985ba6ad5953dd2d5132ecbafd7cebded9ee83', false, NOW(), NOW(), 2,
  'ingestion-only-mouth', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ingestion-only-mouth', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-286", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "A", "verifiedFact": "Ingestion occurs only in the mouth. Defecation occurs only at the anus. Most other digestive processes involve several organs."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280287', 'usmle-step-1', 'physiology',
  $sc$A 20-year-old man chews a bite of food before swallowing. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The pieces become smaller, more area is exposed to saliva, and a lump of the right size is formed. Saliva has already started to split starch.$sc$,
  $qu$Which of the following is the physical result of the chewing?$qu$,
  $op${"options": ["Complete absorption of the starch into the blood", "Finer bits, more area uncovered, and a lump of the right size", "Removal of whatever had never been absorbed", "Release of stored bile from the gallbladder", "A long reflex that requires the medulla and an empty mouth"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "chewing-increases-surface", "taskCategory": "mechanism"}$op$,
  $ky$Finer bits, more area uncovered, and a lump of the right size$ky$,
  $ex$The best choice is "Finer bits, more area uncovered, and a lump of the right size". Chewing increases surface area and forms an appropriately sized bolus. Saliva also begins carbohydrate breakdown. The physical result is the smaller pieces and the bolus, not absorption or elimination. "Complete absorption of the starch into the blood" is not the best choice because Absorption of nutrients is mainly a small-intestinal step, after chemical breakdown. "Removal of whatever had never been absorbed" is not the best choice because Defecation is the last step, not chewing. "Release of stored bile from the gallbladder" is not the best choice because Bile release is a CCK effect in response to duodenal contents. "A long reflex that requires the medulla and an empty mouth" is not the best choice because A long reflex from taste can start gastric secretion. Chewing itself is the mechanical step in the mouth.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6e82677581fa19c5e03aa81d25efc3d4565466c999d8b9d4bba24c4e81491e50', false, NOW(), NOW(), 2,
  'chewing-increases-surface', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'chewing-increases-surface', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-287", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "B", "verifiedFact": "Chewing increases surface area and produces a bolus of appropriate size. Saliva begins carbohydrate breakdown and lingual lipase begins some lipid breakdown."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280288', 'usmle-step-1', 'physiology',
  $sc$A 46-year-old man takes a fat-soluble pain tablet on an empty stomach. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. A portion of that tablet crosses the stomach lining. Most of a mixed meal's nutrients will still be absorbed farther along.$sc$,
  $qu$Which of the following is true of this tablet?$qu$,
  $op${"options": ["No absorption of any kind can occur before the colon", "The stomach completes chemical digestion of the tablet", "Some of the tablet can cross the gastric wall", "It must enter a lacteal before any of it reaches blood", "Parietal cells secrete it in response to gastrin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "aspirin-absorbed-in-stomach", "taskCategory": "mechanism"}$op$,
  $ky$Some of the tablet can cross the gastric wall$ky$,
  $ex$The best choice is "Some of the tablet can cross the gastric wall". The stomach absorbs some fat-soluble substances, including alcohol and aspirin. Most nutrients are still absorbed in the small intestine. Some of his tablet can cross the stomach lining. "No absorption of any kind can occur before the colon" is not the best choice because Absorption is not delayed until the colon. Some occurs in the stomach, and most nutrient absorption is in the small intestine. "The stomach completes chemical digestion of the tablet" is not the best choice because Chemical digestion is completed in the small intestine. The stomach does not finish it. "It must enter a lacteal before any of it reaches blood" is not the best choice because Lacteals carry absorbed dietary lipids. A fat-soluble drug absorbed in the stomach is not described as requiring a lacteal. "Parietal cells secrete it in response to gastrin" is not the best choice because Parietal cells secrete acid and, in the stomach's other functions, intrinsic factor. They do not secrete the tablet.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '2a7f7ab0fb5f533259fce144279b1fc11e55d6501b76116f7282b9fded494f6f', false, NOW(), NOW(), 2,
  'aspirin-absorbed-in-stomach', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'aspirin-absorbed-in-stomach', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-288", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "C", "verifiedFact": "The stomach absorbs some fat-soluble substances, for example alcohol and aspirin. Most absorption is still in the small intestine."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280289', 'usmle-step-1', 'physiology',
  $sc$A 58-year-old woman has had her acid-secreting stomach cells fail. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. A factor those cells also secrete is missing. Without it, a vitamin cannot be absorbed in the small intestine. She is not yet describing nerve symptoms.$sc$,
  $qu$Which of the following is missing?$qu$,
  $op${"options": ["Pancreatic alkali, which absorbs the vitamin by itself", "Fat-emulsifying salts, treated as the vitamin's only carrier", "Colonic bacteria, which are the only source of the factor", "The gastric factor required for absorption of that vitamin", "Lingual lipase, which splits the vitamin in the mouth"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "intrinsic-factor-b12", "taskCategory": "mechanism"}$op$,
  $ky$The gastric factor required for absorption of that vitamin$ky$,
  $ex$The best choice is "The gastric factor required for absorption of that vitamin". The stomach secretes intrinsic factor, which is required for vitamin B12 absorption in the small intestine. Loss of the gastric cells that participate in that secretion removes the factor. She cannot absorb the vitamin normally. "Pancreatic alkali, which absorbs the vitamin by itself" is not the best choice because Pancreatic bicarbonate neutralizes acid. It is not the factor required for this vitamin. "Fat-emulsifying salts, treated as the vitamin's only carrier" is not the best choice because Bile salts emulsify lipids. They are not described as the carrier for this vitamin. "Colonic bacteria, which are the only source of the factor" is not the best choice because Enteric bacteria make some vitamins absorbed in the colon. They do not replace intrinsic factor. "Lingual lipase, which splits the vitamin in the mouth" is not the best choice because Lingual lipase begins lipid digestion in the mouth. It does not absorb this vitamin.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '3cec7ce23399684b92637aa3a512bcdbb77d8c54468b1576c8a84b6b5e7b98b8', false, NOW(), NOW(), 2,
  'intrinsic-factor-b12', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'intrinsic-factor-b12', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-289", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": true, "keyLetter": "D", "verifiedFact": "The stomach secretes intrinsic factor, required for vitamin B12 absorption in the small intestine."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280290', 'usmle-step-1', 'embryology',
  $sc$A male embryo has testes, but one supporting-cell secretion is absent. Temperature is not measured. Testosterone is present, so the male duct keeps growing. The duct that would form female internal organs is not removed. Slide number 14 is the matching section. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following fails to happen?$qu$,
  $op${"options": ["Growth of the male duct, which still has its hormone", "Formation of the glans penis, which still has androgen", "Start of the gonads at about one month after conception", "Breast development as the first sign of female puberty", "Loss of the duct that would have formed the uterus and tubes"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "sustentacular-mullerian", "taskCategory": "mechanism"}$op$,
  $ky$Loss of the duct that would have formed the uterus and tubes$ky$,
  $ex$The best choice is "Loss of the duct that would have formed the uterus and tubes". Sustentacular-cell secretions degrade the Mullerian duct. Without them that duct persists and can form the uterus, tubes, and part of the vagina. Testosterone is present, so the Wolffian duct still grows. The missing event is removal of the female duct. "Growth of the male duct, which still has its hormone" is not the best choice because The male duct still has testosterone, so its growth is not the failure. "Formation of the glans penis, which still has androgen" is not the best choice because The external glans still has androgen. The vignette's failure is the internal female duct. "Start of the gonads at about one month after conception" is not the best choice because Gonads begin about one month after conception in either path. That timing is not what failed. "Breast development as the first sign of female puberty" is not the best choice because Breast development is a female puberty change, not this embryonic duct step.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', '2dd6b4c46633aedff1d6326f0c0a033dea10fa3ad35f96d41374be230213a385', false, NOW(), NOW(), 3,
  'sustentacular-mullerian', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sustentacular-mullerian', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-290", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "E", "verifiedFact": "Sustentacular cells in the testis secrete a signal that degrades the Mullerian duct. Without that signal the Mullerian duct develops into uterus, tubes, and part of the vagina."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280291', 'usmle-step-1', 'embryology',
  $sc$An embryo has a functional gene on the Y chromosome acting in the early gonad. Temperature is not measured. Germ cells in that gonad take the male path. The follicle-forming path is suppressed. Slide number 14 is the matching section. The finding was confirmed in the same record.$sc$,
  $qu$Which of the following do the germ cells become?$qu$,
  $op${"options": ["The stem cells of the male gamete line", "The stem cells that form follicles in an ovary", "Leydig cells, which are the only germ cells", "The lining that releases gastrin", "Osteocytes trapped in bone matrix"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "sry-spermatogonia", "taskCategory": "mechanism"}$op$,
  $ky$The stem cells of the male gamete line$ky$,
  $ex$The best choice is "The stem cells of the male gamete line". SRY causes germ cells in the bipotential gonad to become spermatogonia and suppresses the female path. Without SRY, oogonia and primordial follicles form. These germ cells take the male path. "The stem cells that form follicles in an ovary" is not the best choice because Oogonia and primordial follicles are the path without SRY. "Leydig cells, which are the only germ cells" is not the best choice because Leydig cells secrete testosterone. They are not the germ cells. "The lining that releases gastrin" is not the best choice because Gastrin comes from stomach endocrine cells, not embryonic germ cells. "Osteocytes trapped in bone matrix" is not the best choice because Osteocytes are trapped bone cells. They are not the germ-cell product of SRY.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "embryology"]$tg$,
  's1-new-20261128-hidden', '74fcddd45ea1964a7e993e4b46e9763fa794fe85100cf18b9a37b5f3ed869aa1', false, NOW(), NOW(), 3,
  'sry-spermatogonia', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sry-spermatogonia', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-291", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "A", "verifiedFact": "With SRY, germ cells in the bipotential gonad become spermatogonia. Without SRY, oogonia form and primordial follicles develop."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280292', 'usmle-step-1', 'physiology',
  $sc$A class compares the average age of first menstruation in the United States. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. In 1860 the average was about 17 years. By 1960 it was about 12.75 years, and it remains near that. The historical change tracks more reliable nutrition.$sc$,
  $qu$Which of the following best accounts for the earlier average?$qu$,
  $op${"options": ["A change in the gene on the Y chromosome", "A steadier food supply across that century", "Earlier fusion of the sutures of the skull", "Loss of the fat-cell signal in well-fed girls", "Withholding of a known antibiotic in a research study"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "menarche-age-nutrition", "taskCategory": "mechanism"}$op$,
  $ky$A steadier food supply across that century$ky$,
  $ex$The best choice is "A steadier food supply across that century". Average menarche fell from about 17 years in 1860 to about 12.75 years by 1960 and remains there. The section ties that historical change to better, more consistent nutrition. Genetics, environment, and stress also affect an individual's timing. "A change in the gene on the Y chromosome" is not the best choice because SRY is a Y-chromosome gene that directs the testis. It does not set the historical age of menarche. "Earlier fusion of the sutures of the skull" is not the best choice because Skull sutures are open at birth so the head can deform. They do not set menarche. "Loss of the fat-cell signal in well-fed girls" is not the best choice because Leptin from fat supports earlier maturation. Loss of leptin is the lean-athlete pattern of delay, not the historical shift. "Withholding of a known antibiotic in a research study" is not the best choice because Withheld penicillin is the Tuskegee ethics failure, not a cause of earlier menarche.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '2b4f4e096a04c821d9fae0edde37af23585e5cbb51f90d1e79808efc419d30a4', false, NOW(), NOW(), 2,
  'menarche-age-nutrition', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'menarche-age-nutrition', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-292", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": true, "keyLetter": "B", "verifiedFact": "Average age of menarche in the United States fell from about 17 years in 1860 to about 12.75 years by 1960, where it remains. Better nutrition is a major reason. Genetics, environment, and stress also affect timing."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280293', 'usmle-step-1', 'physiology',
  $sc$A 12-year-old boy is gaining as much as 4 inches of height a year, near the end of his pubertal sequence. Temperature is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. Testicular growth began earlier. Some of his peers will still be developing into the early 20s.$sc$,
  $qu$Which of the following is the timing of this height gain?$qu$,
  $op${"options": ["At age 8, when a hormone is only detectable at night", "At birth, when the skull sutures are still open", "Toward the end of male puberty, not at the first sign", "In the fetus, when the primary ossification center forms", "After every growth plate has already become a line"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "male-growth-spurt-late", "taskCategory": "mechanism"}$op$,
  $ky$Toward the end of male puberty, not at the first sign$ky$,
  $ex$The best choice is "Toward the end of male puberty, not at the first sign". The male growth spurt occurs toward the end of puberty, about ages 11 to 13, with gains up to about 4 inches a year. Testicular enlargement is the earlier first sign. Some development continues into the early 20s. His timing matches the late spurt. "At age 8, when a hormone is only detectable at night" is not the best choice because Nighttime LH around age 8 precedes physical changes by years. It is not the growth spurt. "At birth, when the skull sutures are still open" is not the best choice because Open sutures at birth allow the head to deform. They are not this height spurt. "In the fetus, when the primary ossification center forms" is not the best choice because The primary ossification center is a fetal shaft event. "After every growth plate has already become a line" is not the best choice because A sealed plate is an epiphyseal line and means length growth has stopped. He is still gaining height.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c4b5a047f118f5cdd31fea1b05371f5c974ed7695af8ae43b54db4a38759bda9', false, NOW(), NOW(), 2,
  'male-growth-spurt-late', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'male-growth-spurt-late', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-293", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "C", "verifiedFact": "The male growth spurt is toward the end of puberty, about ages 11 to 13, and height can increase as much as 4 inches a year. Development can continue into the early 20s. Fertile ejaculations are typically around age 15."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280294', 'usmle-step-1', 'physiology',
  $sc$A growing femur is sectioned at the plate. Temperature is not measured. In the layer next to the shaft, most cartilage cells are dead. Vessels and bone-forming cells enter from the shaft and lay bone on what remains. That layer is what ties the plate to the shaft. Slide number 14 is the matching section.$sc$,
  $qu$Which of the following is the role of that layer?$qu$,
  $op${"options": ["It anchors the plate to the end and does not add length", "It is the remnant line after growth has finished", "It forms the clavicle directly from mesenchyme", "It ties the plate to the shaft where new bone is added", "It resorbs the marrow cavity to increase width"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "calcified-zone-connects-shaft", "taskCategory": "mechanism"}$op$,
  $ky$It ties the plate to the shaft where new bone is added$ky$,
  $ex$The best choice is "It ties the plate to the shaft where new bone is added". The zone of calcified matrix connects the epiphyseal plate to the diaphysis. Dead chondrocytes, invading capillaries, and osteoblasts leave bone added on the shaft side, which is how the bone lengthens. This layer is that connection. "It anchors the plate to the end and does not add length" is not the best choice because Anchoring without growth is the reserve zone, nearest the epiphysis. "It is the remnant line after growth has finished" is not the best choice because The epiphyseal line remains after the plate closes. This plate is still active. "It forms the clavicle directly from mesenchyme" is not the best choice because The clavicle forms by intramembranous ossification, not by this plate layer. "It resorbs the marrow cavity to increase width" is not the best choice because Widening by marrow resorption and periosteal deposition is appositional growth.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f247c9d8c3fb06a6272269bc6a4bbb4effd20c550f404f8949652b0cafcffa29', false, NOW(), NOW(), 3,
  'calcified-zone-connects-shaft', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'calcified-zone-connects-shaft', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-294", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "D", "verifiedFact": "Most chondrocytes in the zone of calcified matrix are dead. Capillaries and osteoblasts from the diaphysis enter, and osteoblasts lay bone on the remaining calcified cartilage. This zone connects the plate to the diaphysis. Length increases when bone is added to the diaphysis."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280295', 'usmle-step-1', 'histology',
  $sc$A student compares a clavicle with a femur. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. One bone formed from a membrane and the other replaced a cartilage model. Under the microscope the mineralized tissue looks like the same kind of bone.$sc$,
  $qu$Which of the following is true of the finished tissue?$qu$,
  $op${"options": ["Bone made from membrane never contains mature bone cells", "Cartilage-model bone remains cartilage in the adult shaft", "Only the clavicle can be remodeled in adult life", "Only the thigh bone has collagen in its matrix", "The completed hard material is the same kind either way"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "msk-skin", "blueprintTopic": "bone-same-either-path", "taskCategory": "histology"}$op$,
  $ky$The completed hard material is the same kind either way$ky$,
  $ex$The best choice is "The completed hard material is the same kind either way". The two osteogenic pathways produce the same bone. A clavicle from mesenchyme and a femur from a cartilage model are the same tissue once formed. "Bone made from membrane never contains mature bone cells" is not the best choice because Osteoblasts trapped in osteoid become osteocytes in intramembranous bone as well. "Cartilage-model bone remains cartilage in the adult shaft" is not the best choice because The cartilage model is replaced. The adult shaft is bone, with cartilage left at the joint and, while growing, at the plate. "Only the clavicle can be remodeled in adult life" is not the best choice because Adult remodeling occurs in the skeleton generally, about 5 to 10 percent a year, not only in the clavicle. "Only the thigh bone has collagen in its matrix" is not the best choice because Collagen is a critical matrix protein in bone generally. It is not limited to the femur.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "msk-skin", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '43f12a6d730a2b063cfd90d5b4bd32141017c1234bc6b6e186dfb69d768be753', false, NOW(), NOW(), 2,
  'bone-same-either-path', 'msk-skin', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development"}]$rf$::jsonb,
  'step1', false,
  'histology', 'bone-same-either-path', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-295", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development", "nutrition": false, "keyLetter": "E", "verifiedFact": "Bone produced by intramembranous ossification and bone produced by endochondral ossification is the same tissue."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280296', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old woman compares warm water with hotter water on her hand. Pulse is 78/min, respirations are 16/min, and blood pressure is 112/70 mm Hg. The local voltage change in the skin sensor is bigger with the hotter water. A traveling signal still starts only if the change is large enough.$sc$,
  $qu$Which of the following does the hotter water produce?$qu$,
  $op${"options": ["A larger local voltage change in the skin receptor", "A smaller local change than the warm water", "Acetylcholine release as the first event in the skin", "An immediate muscle potential with no sensory step", "A steroid crossing into the receptor cell"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "stimulus-strength-graded", "taskCategory": "mechanism"}$op$,
  $ky$A larger local voltage change in the skin receptor$ky$,
  $ex$The best choice is "A larger local voltage change in the skin receptor". Graded-potential size depends on stimulus strength. Hotter water produces a larger local voltage change than warm water. An action potential still requires threshold. "A smaller local change than the warm water" is not the best choice because A weaker stimulus makes a smaller graded potential. The hotter water is the stronger stimulus. "Acetylcholine release as the first event in the skin" is not the best choice because Acetylcholine is released at the neuromuscular junction, not as the first event in the skin sensor. "An immediate muscle potential with no sensory step" is not the best choice because Muscle contraction is the response after a motor command. Sensation starts in the receptor. "A steroid crossing into the receptor cell" is not the best choice because Steroid hormones diffuse into target cells. This voltage change is a sensory graded potential.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '924b10bcf649d4190806f6fc2a9a8e5ae7fecf425ab5ce1f1bc9777d204d1aca', false, NOW(), NOW(), 2,
  'stimulus-strength-graded', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'stimulus-strength-graded', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-296", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "A", "verifiedFact": "The size of the graded potential at a sensory receptor depends on stimulus strength. A stronger stimulus makes a larger local voltage change."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280297', 'usmle-step-1', 'physiology',
  $sc$A 25-year-old man pulls his hand from hot water. Temperature is 36.6°C, pulse is 90/min, respirations are 18/min, and blood pressure is 124/76 mm Hg. Skin sensors have fired, the outer gray matter has combined that information, and a command has reached the muscle. The muscle then shortens.$sc$,
  $qu$Which of the following is the final event in this example?$qu$,
  $op${"options": ["The skin receptor is what detects the water", "The fiber tightens after the nerve chemical arrives", "The deep relay passes the signal toward awareness", "Cortical areas combine the sensation with memory", "A graded potential stays below the level that fires the axon"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "response-is-muscle", "taskCategory": "mechanism"}$op$,
  $ky$The fiber tightens after the nerve chemical arrives$ky$,
  $ex$The best choice is "The fiber tightens after the nerve chemical arrives". The sequence ends with the response: the lower motor neuron releases acetylcholine, a muscle action potential follows, and the fiber contracts. He pulls his hand back, so the final event is the shortening muscle. "The skin receptor is what detects the water" is not the best choice because Detection is sensation, the first step. "The deep relay passes the signal toward awareness" is not the best choice because The thalamic relay is before conscious perception, still on the sensory side. "Cortical areas combine the sensation with memory" is not the best choice because Combining sensation with memory is integration, before the motor command. "A graded potential stays below the level that fires the axon" is not the best choice because A subthreshold graded potential would not start the path that moved his hand.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "behavioral-nervous", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '68189936f851e2a0781310b4c4fdc67c4501a70b425035de96934906363262a3', false, NOW(), NOW(), 2,
  'response-is-muscle', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'response-is-muscle', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-297", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue", "nutrition": false, "keyLetter": "B", "verifiedFact": "The response in the example is muscle contraction after the lower motor neuron releases acetylcholine."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280298', 'usmle-step-1', 'physiology',
  $sc$A 32-year-old woman swallows. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. After the mouth, a short shared passage carries the bolus onward and lubricates it. The next tube then carries it to the stomach. Neither organ is the main site of absorption.$sc$,
  $qu$Which of the following is the job of the short shared passage?$qu$,
  $op${"options": ["It finishes chemical digestion of proteins", "It absorbs most dietary fat into lymph vessels", "It moves the bolus onward and moistens the path", "It secretes the factor required for vitamin B12", "It stores bile and makes it more concentrated"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "pharynx-propels-to-esophagus", "taskCategory": "mechanism"}$op$,
  $ky$It moves the bolus onward and moistens the path$ky$,
  $ex$The best choice is "It moves the bolus onward and moistens the path". The pharynx propels food from the mouth to the esophagus and lubricates food and passageways. The esophagus then propels it to the stomach. Neither is the main site of absorption. "It finishes chemical digestion of proteins" is not the best choice because Chemical digestion of food is completed in the small intestine. "It absorbs most dietary fat into lymph vessels" is not the best choice because Most fat absorption into lacteals occurs in the small intestine. "It secretes the factor required for vitamin B12" is not the best choice because Intrinsic factor is a gastric secretion. "It stores bile and makes it more concentrated" is not the best choice because The gallbladder stores and concentrates bile.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4ee1c19f54b476b77fa79f2bc3b477ec8f3d4ab8a3c71a1fb31e6d4eef877447', false, NOW(), NOW(), 2,
  'pharynx-propels-to-esophagus', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'pharynx-propels-to-esophagus', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-298", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "C", "verifiedFact": "The pharynx propels food from the oral cavity to the esophagus and lubricates food and passageways. The esophagus propels food to the stomach."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280299', 'usmle-step-1', 'physiology',
  $sc$A newborn has a sex-chromosome pattern that is not XX or XY. Temperature is 36.8°C, pulse is 138/min, respirations are 40/min. The extra or missing chromosome came from a failure of chromosomes to separate in meiosis. The clinical name for this group of patterns includes XXY, XYY, and XO.$sc$,
  $qu$Which of the following produced this chromosome pattern?$qu$,
  $op${"options": ["A single gene on the Y acting exactly as usual", "Closure of the growth plate in fetal week six", "An institutional review board decision", "Chromosomes failing to pull apart in gamete formation", "Positive feedback of oxytocin during labor"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chromosomal-intersex", "taskCategory": "mechanism"}$op$,
  $ky$Chromosomes failing to pull apart in gamete formation$ky$,
  $ex$The best choice is "Chromosomes failing to pull apart in gamete formation". Nondisjunction during meiosis can produce XXY, XYY, and XO, which the section calls chromosomal intersex. The newborn's pattern came from that failure of chromosomes to separate. Typical XX and XY determination is a separate statement. "A single gene on the Y acting exactly as usual" is not the best choice because Ordinary SRY action on a Y chromosome directs the testis path. It does not create an XXY, XYY, or XO pattern. "Closure of the growth plate in fetal week six" is not the best choice because Ossification begins around week six or seven. It does not change sex chromosomes. "An institutional review board decision" is not the best choice because An IRB reviews human research. It does not cause a chromosome pattern. "Positive feedback of oxytocin during labor" is not the best choice because Oxytocin feedback drives labor contractions. It does not set sex chromosomes.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "reproductive-endocrine", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'bd9efab4d4c5320447e2074c038342adb9f2a8b7a37d32c4e7482cca455ea0f1', false, NOW(), NOW(), 3,
  'chromosomal-intersex', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'chromosomal-intersex', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-299", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems", "nutrition": false, "keyLetter": "D", "verifiedFact": "XX is typically female and XY typically male. Nondisjunction can produce XXY, XYY, and XO, called chromosomal intersex. Female development is the path without a functional SRY gene."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280300', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old man studies the juices in the gut. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. The juices are mostly water plus enzymes, acids, and salts. They split large food molecules into smaller chemical pieces. That chemical work finishes in the small intestine.$sc$,
  $qu$Which of the following is in a typical digestive juice besides water?$qu$,
  $op${"options": ["Only the salts that emulsify fat, and no enzymes", "Only collagen, chondroitin, and hyaluronic acid", "Lung lining fluid, with no digestive enzymes", "The transmitter released at the nerve-muscle junction", "Enzymes, acids, and dissolved minerals"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "secretions-contain-enzymes-acids", "taskCategory": "mechanism"}$op$,
  $ky$Enzymes, acids, and dissolved minerals$ky$,
  $ex$The best choice is "Enzymes, acids, and dissolved minerals". Digestive secretions typically contain water, enzymes, acids, and salts. They break complex food molecules into chemical building blocks, and that process is completed in the small intestine. "Only the salts that emulsify fat, and no enzymes" is not the best choice because Bile salts emulsify fat, but a typical digestive secretion is not bile salts alone. Enzymes, acids, and dissolved minerals are the listed contents. "Only collagen, chondroitin, and hyaluronic acid" is not the best choice because Hyaluronic acid, chondroitin sulfate, and collagen are the cartilage-model matrix, not digestive juice. "Lung lining fluid, with no digestive enzymes" is not the best choice because Surfactant is secreted by type II alveolar cells. "The transmitter released at the nerve-muscle junction" is not the best choice because Acetylcholine is the neuromuscular transmitter, not a digestive juice.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '0c63efdb413975b9a5e05633cd52ee831140ca1651cab8a3bd134806c6890379', false, NOW(), NOW(), 2,
  'secretions-contain-enzymes-acids', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secretions-contain-enzymes-acids', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 3, "code": "S1N-300", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation", "nutrition": false, "keyLetter": "E", "verifiedFact": "Digestive secretions typically contain water, enzymes, acids, and salts. They break complex molecules into building blocks. The process is completed in the small intestine."}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s1_new_20261128_b03_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's1n202611280201',
    's1n202611280202',
    's1n202611280203',
    's1n202611280204',
    's1n202611280205',
    's1n202611280206',
    's1n202611280207',
    's1n202611280208',
    's1n202611280209',
    's1n202611280210',
    's1n202611280211',
    's1n202611280212',
    's1n202611280213',
    's1n202611280214',
    's1n202611280215',
    's1n202611280216',
    's1n202611280217',
    's1n202611280218',
    's1n202611280219',
    's1n202611280220',
    's1n202611280221',
    's1n202611280222',
    's1n202611280223',
    's1n202611280224',
    's1n202611280225',
    's1n202611280226',
    's1n202611280227',
    's1n202611280228',
    's1n202611280229',
    's1n202611280230',
    's1n202611280231',
    's1n202611280232',
    's1n202611280233',
    's1n202611280234',
    's1n202611280235',
    's1n202611280236',
    's1n202611280237',
    's1n202611280238',
    's1n202611280239',
    's1n202611280240',
    's1n202611280241',
    's1n202611280242',
    's1n202611280243',
    's1n202611280244',
    's1n202611280245',
    's1n202611280246',
    's1n202611280247',
    's1n202611280248',
    's1n202611280249',
    's1n202611280250',
    's1n202611280251',
    's1n202611280252',
    's1n202611280253',
    's1n202611280254',
    's1n202611280255',
    's1n202611280256',
    's1n202611280257',
    's1n202611280258',
    's1n202611280259',
    's1n202611280260',
    's1n202611280261',
    's1n202611280262',
    's1n202611280263',
    's1n202611280264',
    's1n202611280265',
    's1n202611280266',
    's1n202611280267',
    's1n202611280268',
    's1n202611280269',
    's1n202611280270',
    's1n202611280271',
    's1n202611280272',
    's1n202611280273',
    's1n202611280274',
    's1n202611280275',
    's1n202611280276',
    's1n202611280277',
    's1n202611280278',
    's1n202611280279',
    's1n202611280280',
    's1n202611280281',
    's1n202611280282',
    's1n202611280283',
    's1n202611280284',
    's1n202611280285',
    's1n202611280286',
    's1n202611280287',
    's1n202611280288',
    's1n202611280289',
    's1n202611280290',
    's1n202611280291',
    's1n202611280292',
    's1n202611280293',
    's1n202611280294',
    's1n202611280295',
    's1n202611280296',
    's1n202611280297',
    's1n202611280298',
    's1n202611280299',
    's1n202611280300'
);
COMMIT;
