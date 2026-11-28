-- Hidden Step 1 batch 1 of the 2026-11-28 set.
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
  's1n202611280001', 'usmle-step-1', 'physiology',
  $sc$A 46-year-old woman who packs produce at a grocery warehouse comes to the clinic because of cramping pain that starts about 30 minutes after large meals. She has not vomited. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The abdomen is soft. A biopsy from the jejunal wall shows an intact network of neurons lying between the inner circular smooth-muscle layer and the outer longitudinal layer.$sc$,
  $qu$Which of the following is the principal function of this nerve network?$qu$,
  $op${"options": ["Setting the rhythm and force of muscularis contractions", "Regulating digestive secretions inside the submucosa", "Carrying sharp pain from the parietal peritoneum", "Absorbing digested lipid into lymphatic capillaries", "Secreting alkaline mucus onto the surface epithelium"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "myenteric-plexus-motility", "taskCategory": "mechanism"}$op$,
  $ky$Setting the rhythm and force of muscularis contractions$ky$,
  $ex$The best choice is "Setting the rhythm and force of muscularis contractions". These neurons sit in the muscularis between the circular and longitudinal layers, which is the plexus that sets the rhythm and force of muscularis contraction. The biopsy shows that network intact. "Regulating digestive secretions inside the submucosa" is not the best choice because Secretion is regulated by the plexus in the submucosa, not by neurons lying between the two muscle layers. "Carrying sharp pain from the parietal peritoneum" is not the best choice because The biopsy is an intramural nerve network. It is not a somatic pain fiber from the parietal peritoneum. "Absorbing digested lipid into lymphatic capillaries" is not the best choice because Lipid absorption is a function of lymphatic capillaries in villi, not of neurons between muscle layers. "Secreting alkaline mucus onto the surface epithelium" is not the best choice because Surface mucus is secreted by epithelial cells. The structure in the biopsy is a nerve network in the muscle wall.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4a204b5132d0d92ecd105373bbcf386b641076a183f76a10ec2d363e37d55614', false, NOW(), NOW(), 2,
  'myenteric-plexus-motility', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'myenteric-plexus-motility', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-001", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "A", "verifiedFact": "The myenteric plexus lies in the muscularis and is responsible for motility, especially the rhythm and force of muscularis contractions."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280002', 'usmle-step-1', 'physiology',
  $sc$A 38-year-old man who repairs elevators is evaluated for watery diarrhea that began 6 weeks ago. He has lost 2 kg. Temperature is 36.9°C, pulse is 88/min, respirations are 16/min, and blood pressure is 122/70 mm Hg. Stool studies show no leukocytes. A duodenal biopsy shows preserved epithelium and a dense nerve network located in the connective-tissue layer directly beneath the mucosa, above the muscle coat.$sc$,
  $qu$Which of the following functions is controlled by the nerve network in this layer?$qu$,
  $op${"options": ["Rhythm and force of contraction in the outer muscle coat", "Control of glandular secretion when food is in the lumen", "Voluntary closure of the skeletal ring at the anus", "Carriage of absorbed sugars into the lymph capillary", "Engulfment of bacteria along the channels of the liver"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "submucosal-plexus-secretion", "taskCategory": "mechanism"}$op$,
  $ky$Control of glandular secretion when food is in the lumen$ky$,
  $ex$The best choice is "Control of glandular secretion when food is in the lumen". The nerve network immediately beneath the mucosa is the submucosal plexus, which regulates digestive secretions and reacts to food. The biopsy places it in that layer. "Rhythm and force of contraction in the outer muscle coat" is not the best choice because Rhythm and force of muscularis contraction are controlled by the plexus inside the muscle coat, not by the network above that coat. "Voluntary closure of the skeletal ring at the anus" is not the best choice because The external anal sphincter is skeletal muscle under voluntary control. This biopsy is from the duodenal wall. "Carriage of absorbed sugars into the lymph capillary" is not the best choice because Sugars enter blood capillaries in villi. Lacteals carry lipids. Neither is a nerve network under the mucosa. "Engulfment of bacteria along the channels of the liver" is not the best choice because Phagocytic cells in liver sinusoids are not a duodenal submucosal nerve network.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a8f78f55aeda6973f944aa66e6f2c8c8b752e72cb44ea204d5a89195fa1e2cee', false, NOW(), NOW(), 2,
  'submucosal-plexus-secretion', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'submucosal-plexus-secretion', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-002", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "B", "verifiedFact": "The submucosal plexus lies in the submucosa and regulates digestive secretions and the response to food."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280003', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old woman who drives an ambulance is brought in 20 minutes after a highway crash in which she was the uninjured driver of a second vehicle. She is pale, anxious, and has not eaten for 9 hours. Temperature is 36.8°C, pulse is 118/min, respirations are 22/min, and blood pressure is 148/90 mm Hg. Bowel sounds are scarce. Her hands are cold. No abdominal tenderness is present.$sc$,
  $qu$Which of the following best accounts for the quiet bowel sounds?$qu$,
  $op${"options": ["Rest-and-digest signals increase enteric secretion and motility", "A mucosal ulcer has spilled acid into the peritoneum", "Fight-or-flight signals restrict enteric neuron activity", "The pyloric sphincter is being relaxed by gastrin", "Bile salts are being reabsorbed from the terminal ileum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "sympathetic-slows-gut", "taskCategory": "mechanism"}$op$,
  $ky$Fight-or-flight signals restrict enteric neuron activity$ky$,
  $ex$The best choice is "Fight-or-flight signals restrict enteric neuron activity". She is tachycardic, pale, and cold-handed after a frightening crash, the fight-or-flight state. That state restricts enteric neurons and decreases secretion and motility, which fits scarce bowel sounds. The abdomen is not tender. "Rest-and-digest signals increase enteric secretion and motility" is not the best choice because Rest-and-digest signals increase secretion and motility. That would make bowel sounds more active, not scarce, and it does not fit this pulse and blood pressure. "A mucosal ulcer has spilled acid into the peritoneum" is not the best choice because Chemical peritonitis follows a breach of the gut wall. She has no abdominal tenderness and was not injured. "The pyloric sphincter is being relaxed by gastrin" is not the best choice because Gastrin promotes gastric emptying and intestinal contraction. It does not silence bowel sounds in an uneaten, frightened patient. "Bile salts are being reabsorbed from the terminal ileum" is not the best choice because Ileal reabsorption of bile salts is a normal digestive step. She has not eaten for 9 hours, and that step does not quiet the bowel.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9467fa5764421391b99706ae0c3638aa3654aaeb0ea40707da29b3e272dc1287', false, NOW(), NOW(), 2,
  'sympathetic-slows-gut', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sympathetic-slows-gut', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-003", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "C", "verifiedFact": "Sympathetic activation restricts enteric neurons and decreases GI secretion and motility. Parasympathetic activation increases both."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280004', 'usmle-step-1', 'physiology',
  $sc$A 52-year-old man who cooks in a hotel kitchen is seen for greasy, pale stools and a 4-kg weight loss over 2 months. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. A small-bowel biopsy shows normal enterocytes. The lymphatic capillary in the core of each villus is distorted, and the blood capillaries in the same villi look open.$sc$,
  $qu$Which of the following is the most likely consequence of this villus finding?$qu$,
  $op${"options": ["Amino acids cannot enter the villus blood capillary", "Glucose absorption stops because the brush border is gone", "Pepsin remains active throughout the duodenal lumen", "Digested fats fail to leave the mucosa through lymph", "Bicarbonate secretion from the stomach surface increases"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "lacteal-lipid-absorption", "taskCategory": "mechanism"}$op$,
  $ky$Digested fats fail to leave the mucosa through lymph$ky$,
  $ex$The best choice is "Digested fats fail to leave the mucosa through lymph". Lipid breakdown products leave the intestine through the lymphatic capillary in the villus. That channel is distorted, and the greasy pale stools fit failed fat absorption. The blood capillaries are described as open, and the enterocytes are normal. "Amino acids cannot enter the villus blood capillary" is not the best choice because Amino acids enter the villus blood capillary. Those capillaries are open, so this finding does not block them. "Glucose absorption stops because the brush border is gone" is not the best choice because The enterocytes are normal, so the brush border is not described as absent. Glucose uses the blood capillary, which is open. "Pepsin remains active throughout the duodenal lumen" is not the best choice because Pepsin is a gastric enzyme inactivated when duodenal pH rises. The biopsy is about villus lymphatics, not luminal pH. "Bicarbonate secretion from the stomach surface increases" is not the best choice because Surface bicarbonate mucus is a gastric barrier function. It is not the lymphatic capillary inside a villus.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'e95b7379ddc49fc7a8e1d67794c80bb6b8b0d8ec28597c7900ed87d4f93f9a66', false, NOW(), NOW(), 3,
  'lacteal-lipid-absorption', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lacteal-lipid-absorption', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-004", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": true, "keyLetter": "D", "verifiedFact": "Carbohydrate and protein breakdown products enter villus blood capillaries. Lipid breakdown products are absorbed by lacteals and travel through lymph."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280005', 'usmle-step-1', 'anatomy',
  $sc$A 19-year-old man who lifeguards at a lake is evaluated after 3 days of cramping and nonbloody diarrhea. Temperature is 37.4°C, pulse is 90/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. The abdomen is soft. A biopsy labeled as distal ileum shows large lymphoid aggregates in the loose connective tissue directly under the epithelium, inside the mucosa.$sc$,
  $qu$Which of the following is the layer and site that normally contain these large lymphoid aggregates?$qu$,
  $op${"options": ["Slippery outer coat on the front wall of the stomach", "Extra inner muscle layer found only in the stomach", "Dense collagen sheath around the thoracic esophagus", "A layer the sac under the liver does not possess", "Supporting coat of the lining in the final small-bowel part"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "peyer-patches-ileum", "taskCategory": "histology"}$op$,
  $ky$Supporting coat of the lining in the final small-bowel part$ky$,
  $ex$The best choice is "Supporting coat of the lining in the final small-bowel part". The large lymphoid aggregates under the epithelium are the clusters housed in the lamina propria, and they are particularly substantial in the distal ileum. The specimen is labeled distal ileum and shows them in that mucosal connective tissue. "Slippery outer coat on the front wall of the stomach" is not the best choice because The serosa is the outer peritoneal coat. These aggregates are inside the mucosa, under the epithelium. "Extra inner muscle layer found only in the stomach" is not the best choice because The oblique muscle is an extra gastric muscle layer. It is not a lymphoid aggregate in the ileal mucosa. "Dense collagen sheath around the thoracic esophagus" is not the best choice because The esophagus is wrapped in adventitia rather than serosa. That sheath is not ileal mucosal lymphoid tissue. "A layer the sac under the liver does not possess" is not the best choice because The gallbladder wall has no submucosa. The biopsy is ileal mucosa, not gallbladder.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "anatomy"]$tg$,
  's1-new-20261128-hidden', '31a3167a95ecd5a843c5c525df31d43ff7b84322b453ef4beba4bdc646482126', false, NOW(), NOW(), 2,
  'peyer-patches-ileum', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'histology', 'peyer-patches-ileum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-005", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "E", "verifiedFact": "Lymphocyte clusters in the lamina propria are especially large in the distal ileum, where they are Peyer patches."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280006', 'usmle-step-1', 'anatomy',
  $sc$A 61-year-old man who teaches high-school woodshop has a 2-cm mass removed from the esophageal wall during an operation. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 134/80 mm Hg. The pathologist notes that the outermost layer of this specimen is a dense collagen sheath, and that a slippery peritoneal coat is absent. The mass itself is separate from that layer.$sc$,
  $qu$Which of the following best explains the outer layer of this specimen?$qu$,
  $op${"options": ["The esophagus is anchored by adventitia rather than serosa", "The stomach's outer coat is adventitia along both curvatures", "The jejunum lacks a peritoneal coat because it is retroperitoneal", "The transverse colon is fixed by adventitia to the diaphragm", "The gallbladder wall uses adventitia in place of a mucosa"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "esophagus-adventitia", "taskCategory": "anatomy"}$op$,
  $ky$The esophagus is anchored by adventitia rather than serosa$ky$,
  $ex$The best choice is "The esophagus is anchored by adventitia rather than serosa". The mouth, pharynx, and esophagus have a dense collagen sheath called adventitia instead of serosa. This esophageal specimen shows that sheath and no peritoneal coat. "The stomach's outer coat is adventitia along both curvatures" is not the best choice because The abdominal stomach is covered by serosa. Adventitia replaces serosa in the esophagus, not along the gastric curvatures. "The jejunum lacks a peritoneal coat because it is retroperitoneal" is not the best choice because The jejunum and ileum are tethered by mesentery and have a peritoneal coat. The duodenum, not the jejunum, is the retroperitoneal part of the small intestine. "The transverse colon is fixed by adventitia to the diaphragm" is not the best choice because The transverse colon is tethered by mesocolon and is intraperitoneal. Adventitia is the esophageal outer layer. "The gallbladder wall uses adventitia in place of a mucosa" is not the best choice because The gallbladder has a mucosa and a smooth-muscle coat, with visceral peritoneum as its outer coat. It does not replace mucosa with adventitia.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'ee17b630258b716b56c5613e8406ecebf18cc6471f6112ca2fe435bfa2acba59', false, NOW(), NOW(), 3,
  'esophagus-adventitia', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'esophagus-adventitia', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-006", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "A", "verifiedFact": "The mouth, pharynx, and esophagus have adventitia, a dense collagen sheath, instead of serosa. Serosa is the visceral peritoneum on the abdominal alimentary canal."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280007', 'usmle-step-1', 'anatomy',
  $sc$A 44-year-old woman who manages a florist shop undergoes resection of a 3-cm gastric mass. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. The muscular wall of the specimen has the usual circular and longitudinal layers plus a third smooth-muscle layer lying closest to the lumen. The small-bowel margin of the same specimen has only two muscle layers.$sc$,
  $qu$Which of the following is the function added by that third muscle layer?$qu$,
  $op${"options": ["Voluntary control of swallowing in the upper esophagus", "Vigorous churning that mixes food with gastric juice", "Formation of haustra by three longitudinal bands", "Concentration of bile by absorbing water from it", "Secretion of intrinsic factor into the gland lumen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gastric-oblique-muscle", "taskCategory": "anatomy"}$op$,
  $ky$Vigorous churning that mixes food with gastric juice$ky$,
  $ex$The best choice is "Vigorous churning that mixes food with gastric juice". The stomach adds an inner oblique smooth-muscle layer so it can churn and mechanically break food down. The specimen shows that third layer only in the gastric wall. "Voluntary control of swallowing in the upper esophagus" is not the best choice because Skeletal muscle in the mouth, pharynx, and upper esophagus gives voluntary control of swallowing. The extra layer here is smooth muscle in the stomach. "Formation of haustra by three longitudinal bands" is not the best choice because Haustra are pouches made by the three teniae coli of the colon. The small-bowel margin has two layers, and the third layer is gastric. "Concentration of bile by absorbing water from it" is not the best choice because The gallbladder mucosa concentrates bile by absorbing water. That is not a gastric muscle layer. "Secretion of intrinsic factor into the gland lumen" is not the best choice because Intrinsic factor is secreted by parietal cells, not by a muscle layer.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'cc33b24503894d390603526aaf001816b4693e258fe374421ec1d11a9da762e7', false, NOW(), NOW(), 2,
  'gastric-oblique-muscle', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'gastric-oblique-muscle', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-007", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "B", "verifiedFact": "Besides circular and longitudinal layers, the gastric muscularis has an inner oblique smooth-muscle layer that lets the stomach churn food."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280008', 'usmle-step-1', 'anatomy',
  $sc$A 57-year-old man who installs kitchen cabinets develops sudden upper abdominal pain after a 4-meter fall from a ladder, striking his left side. Temperature is 36.8°C, pulse is 104/min, respirations are 20/min, and blood pressure is 98/64 mm Hg. Imaging shows fluid around a gland that lies behind the stomach, with its head in the C-shaped curve of the duodenum and its tapered end at the splenic hilum.$sc$,
  $qu$Which of the following describes the position of this gland?$qu$,
  $op${"options": ["It hangs in the greater omentum in front of the colon", "It is suspended from the liver by the falciform ligament", "It lies outside the peritoneal cavity, posterior to that organ", "It sits inside the peritoneal cavity wrapped in mesentery", "It is an intraperitoneal pouch attached to the cecum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "retroperitoneal-pancreas", "taskCategory": "anatomy"}$op$,
  $ky$It lies outside the peritoneal cavity, posterior to that organ$ky$,
  $ex$The best choice is "It lies outside the peritoneal cavity, posterior to that organ". The gland behind the stomach, with its head in the duodenal curve and its tail at the splenic hilum, is the pancreas. It lies in the retroperitoneum. "It hangs in the greater omentum in front of the colon" is not the best choice because The greater omentum is an apron over the small intestine and transverse colon. The pancreas is behind the stomach, not inside that apron. "It is suspended from the liver by the falciform ligament" is not the best choice because The falciform ligament anchors the liver to the anterior abdominal wall. It does not suspend the pancreas. "It sits inside the peritoneal cavity wrapped in mesentery" is not the best choice because Jejunum and ileum are wrapped by mesentery inside the peritoneal cavity. The pancreas is retroperitoneal. "It is an intraperitoneal pouch attached to the cecum" is not the best choice because The appendix is the winding tube attached to the cecum. The described gland spans from the duodenum to the spleen.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '174d98b6bc3befa80f2b9e6a70620ee7f8461fb435dabaeed0699cf06fc6f458', false, NOW(), NOW(), 3,
  'retroperitoneal-pancreas', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'retroperitoneal-pancreas', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-008", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "C", "verifiedFact": "The pancreas lies transversely in the retroperitoneum behind the stomach. Its tail ends at the hilum of the spleen. The duodenum, ascending and descending colon, and rectum are also retroperitoneal."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280009', 'usmle-step-1', 'anatomy',
  $sc$A 63-year-old man who keeps bees has severe epigastric pain 40 minutes after a large meal. Temperature is 36.7°C, pulse is 96/min, respirations are 18/min, and blood pressure is 158/88 mm Hg. Angiography shows a tight narrowing of the unpaired artery that leaves the abdominal aorta just below the diaphragm and sends branches toward the liver, the stomach, and the first part of the small intestine. The arteries to the jejunum are patent.$sc$,
  $qu$Which of the following organs is supplied by the narrowed artery?$qu$,
  $op${"options": ["The jejunum, the ileum, and the ascending colon", "The descending colon, sigmoid colon, and rectum", "The spleen alone, with no branches to the stomach", "The liver, the stomach, and the duodenum", "The kidneys and both suprarenal glands alone"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "celiac-trunk-foregut", "taskCategory": "anatomy"}$op$,
  $ky$The liver, the stomach, and the duodenum$ky$,
  $ex$The best choice is "The liver, the stomach, and the duodenum". The unpaired artery just below the diaphragm that serves the liver, stomach, and duodenum is the celiac trunk. The jejunal arteries are described as patent, so the pain pattern follows the narrowed trunk. "The jejunum, the ileum, and the ascending colon" is not the best choice because The remaining small intestine and much of the colon are supplied by the mesenteric arteries. Those jejunal arteries are patent. "The descending colon, sigmoid colon, and rectum" is not the best choice because The distal colon is supplied by the inferior mesenteric artery, not by the trunk to the liver, stomach, and duodenum. "The spleen alone, with no branches to the stomach" is not the best choice because The same trunk that reaches the liver and stomach also participates in splenic supply, but the stem's artery is defined by branches to liver, stomach, and duodenum, not by spleen alone. "The kidneys and both suprarenal glands alone" is not the best choice because The kidneys are supplied by paired renal arteries, not by the unpaired artery to the liver, stomach, and duodenum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '0522863aa09f8836b2867efa1fc20fd12fc980a403422c9155c141f9313ef37c', false, NOW(), NOW(), 3,
  'celiac-trunk-foregut', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'celiac-trunk-foregut', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-009", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "The celiac trunk supplies the liver, stomach, and duodenum. The superior and inferior mesenteric arteries supply the remaining small and large intestines."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280010', 'usmle-step-1', 'anatomy',
  $sc$A 34-year-old woman who designs costumes is undergoing laparoscopy for a 2-cm liver-surface nodule. Temperature is 36.5°C, pulse is 78/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The surgeon identifies a peritoneal fold that anchors the liver to the anterior abdominal wall and the diaphragm and separates the right and left lobes on the front of the liver. A cord in its free edge runs toward the umbilicus.$sc$,
  $qu$Which of the following is the developmental origin of that cord?$qu$,
  $op${"options": ["A remnant of the vitelline duct", "A remnant of the allantoic urachus", "A remnant of the ductus arteriosus", "A remnant of the septum transversum only", "A remnant of the umbilical vein"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "falciform-umbilical-vein", "taskCategory": "anatomy"}$op$,
  $ky$A remnant of the umbilical vein$ky$,
  $ex$The best choice is "A remnant of the umbilical vein". The fold that anchors the liver to the anterior wall and diaphragm and separates the lobes anteriorly is the falciform ligament. It and the round ligament in its free edge are remnants of the umbilical vein. "A remnant of the vitelline duct" is not the best choice because A vitelline-duct remnant is the explanation for a Meckel diverticulum on the ileum, not for the cord on the anterior liver. "A remnant of the allantoic urachus" is not the best choice because A urachal remnant runs from the bladder dome toward the umbilicus. This cord is in the liver's anterior peritoneal fold. "A remnant of the ductus arteriosus" is not the best choice because The ductus arteriosus connects the pulmonary trunk to the aorta in fetal life. It is not a cord on the liver. "A remnant of the septum transversum only" is not the best choice because The liver's peritoneal attachments are not described as a remnant of the septum transversum alone. The opened source identifies this cord as an umbilical-vein remnant.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'ef4ae4eab96bfe1016b08500dfe6e05e87f973466c3a6be5f92c1c55385aeed1', false, NOW(), NOW(), 3,
  'falciform-umbilical-vein', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'falciform-umbilical-vein', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-010", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "E", "verifiedFact": "The falciform ligament and the ligamentum teres hepatis are remnants of the umbilical vein and separate the right and left lobes anteriorly."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280011', 'usmle-step-1', 'physiology',
  $sc$A 58-year-old man who grinds coffee beans reports burning epigastric pain for 5 weeks. Temperature is 36.8°C, pulse is 82/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. A gastric biopsy from the body of the stomach shows large cells in the middle region of the glands. Special stains mark those cells as the source of both the acid in the lumen and a glycoprotein needed for vitamin B12 absorption.$sc$,
  $qu$Which of the following pairs of products comes from these cells?$qu$,
  $op${"options": ["Hydrochloric acid and intrinsic factor", "Pepsinogen and a small amount of gastric lipase", "Gastrin and the hormone that stimulates hunger", "Alkaline surface mucus and bicarbonate only", "Secretin and cholecystokinin together"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "parietal-cell-products", "taskCategory": "mechanism"}$op$,
  $ky$Hydrochloric acid and intrinsic factor$ky$,
  $ex$The best choice is "Hydrochloric acid and intrinsic factor". The large cells in the middle of the fundic and body glands that make hydrochloric acid and intrinsic factor are parietal cells. The biopsy marks both products in those cells, and intrinsic factor is required for vitamin B12 absorption. "Pepsinogen and a small amount of gastric lipase" is not the best choice because Pepsinogen is secreted by chief cells, which sit mainly in the basal region of the glands, not in the middle region marked here. "Gastrin and the hormone that stimulates hunger" is not the best choice because Gastrin comes mainly from G cells in the pyloric antrum. The hunger hormone ghrelin comes mainly from the fundus mucosa, not from these acid-producing cells. "Alkaline surface mucus and bicarbonate only" is not the best choice because Alkaline mucus is the surface epithelial barrier. These cells are mid-gland cells that also make the B12-related glycoprotein. "Secretin and cholecystokinin together" is not the best choice because Secretin and cholecystokinin are released by cells of the small intestine, not by the mid-gland gastric cells in this biopsy.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'cf6dbca2728afa1ee072cfb85aa0ce3f21bf73e8104142643039793b2d9638a2', false, NOW(), NOW(), 2,
  'parietal-cell-products', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'parietal-cell-products', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-011", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "A", "verifiedFact": "Parietal cells, located mainly in the middle of the gastric glands of the fundus and body, produce both hydrochloric acid and intrinsic factor."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280012', 'usmle-step-1', 'physiology',
  $sc$A 41-year-old woman who tunes pianos has had epigastric discomfort for 8 weeks. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. A biopsy of the gastric body shows cells clustered at the base of the glands. They contain granules of an inactive protein-digesting proenzyme. The lumen pH of a sample taken the same morning is 2.0.$sc$,
  $qu$Which of the following converts this stored proenzyme into its active form?$qu$,
  $op${"options": ["Bile salts delivered from the gallbladder", "Hydrochloric acid already present in the lumen", "Enteropeptidase on the duodenal brush border", "The alkaline mucus made by surface cells", "Salivary amylase that remains active at this pH"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "chief-cell-pepsinogen", "taskCategory": "mechanism"}$op$,
  $ky$Hydrochloric acid already present in the lumen$ky$,
  $ex$The best choice is "Hydrochloric acid already present in the lumen". Chief cells at the base of gastric glands store pepsinogen. Hydrochloric acid converts it to pepsin. The lumen pH is 2.0, which is inside the acid range of gastric contents. "Bile salts delivered from the gallbladder" is not the best choice because Bile salts emulsify lipids in the small intestine. They do not activate the gastric proenzyme in this biopsy. "Enteropeptidase on the duodenal brush border" is not the best choice because Enteropeptidase activates trypsinogen in the duodenum. The proenzyme here is in basal gastric gland cells. "The alkaline mucus made by surface cells" is not the best choice because Alkaline surface mucus neutralizes acid at the epithelium. It does not convert the proenzyme to its active form. "Salivary amylase that remains active at this pH" is not the best choice because Salivary amylase continues only until food mixes with acid, which inactivates it. A lumen pH of 2.0 is that acid environment, so amylase is not the activator.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd46f43f14b7be48fd2c4d06c8c12101c4e67c62eebc03533436feb57289a634a', false, NOW(), NOW(), 2,
  'chief-cell-pepsinogen', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'chief-cell-pepsinogen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-012", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "B", "verifiedFact": "Chief cells, mainly in the basal gastric glands, secrete pepsinogen. Hydrochloric acid converts pepsinogen to pepsin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280013', 'usmle-step-1', 'physiology',
  $sc$A 49-year-old man who sells farm equipment eats a large steak and develops epigastric fullness 25 minutes later. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 124/78 mm Hg. A catheter sample from veins draining the pyloric antrum shows a sharp rise in a peptide hormone. At the same time, acid secretion and the rate of emptying both increase. Fundic vein samples do not show this rise.$sc$,
  $qu$Which of the following cells released the hormone that rose in the antral blood?$qu$,
  $op${"options": ["Acid-producing cells in the middle of fundic glands", "Proenzyme cells at the base of fundic glands", "Hormone-releasing cells in the gastric outlet", "Enzyme-secreting cells at the tail of the pancreas", "Liver cells arranged around a central vein"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "g-cell-gastrin-antrum", "taskCategory": "mechanism"}$op$,
  $ky$Hormone-releasing cells in the gastric outlet$ky$,
  $ex$The best choice is "Hormone-releasing cells in the gastric outlet". Peptides and amino acids in the stomach release gastrin mainly from G cells of the pyloric antrum. Gastrin increases gastric-gland secretion and promotes emptying. The rise is in antral venous blood, not fundic blood, after a protein meal. "Acid-producing cells in the middle of fundic glands" is not the best choice because Parietal cells secrete acid and intrinsic factor. They respond to the hormone; they are not the antral source of the rise. "Proenzyme cells at the base of fundic glands" is not the best choice because Chief cells secrete pepsinogen. They sit in the fundus and body, and the fundic vein sample did not rise. "Enzyme-secreting cells at the tail of the pancreas" is not the best choice because Pancreatic acini secrete digestive enzymes when stimulated by a duodenal hormone. They are not in the pyloric antrum. "Liver cells arranged around a central vein" is not the best choice because Hepatocytes make bile and process portal blood. They are not the source of an antral peptide that rises after a steak.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '5d2f7639c9b8173c9c63359568d597f4ea34b75d1a847670734886c6a1db4e05', false, NOW(), NOW(), 2,
  'g-cell-gastrin-antrum', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'g-cell-gastrin-antrum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-013", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "C", "verifiedFact": "Gastrin is released mainly by enteroendocrine G cells of the pyloric antrum when peptides and amino acids are present. It increases gastric-gland secretion and promotes gastric emptying."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280014', 'usmle-step-1', 'physiology',
  $sc$A 67-year-old man who used to weld ship hulls had his entire stomach removed 3 years ago for a 5-cm mass. He eats regular meals and has not had diarrhea. Temperature is 36.6°C, pulse is 92/min, respirations are 16/min, and blood pressure is 118/70 mm Hg. Hemoglobin is 8.4 g/dL with large red cells, and he has numbness in both feet. He has not received any injections since the operation.$sc$,
  $qu$Which of the following lost gastric product best accounts for both findings?$qu$,
  $op${"options": ["The acid that converts pepsinogen into pepsin", "The mucus barrier that lines the gastric surface", "The hormone released from the fundus during a fast", "The glycoprotein required for vitamin B12 absorption", "The oblique muscle layer that churns a solid meal"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "intrinsic-factor-essential", "taskCategory": "mechanism"}$op$,
  $ky$The glycoprotein required for vitamin B12 absorption$ky$,
  $ex$The best choice is "The glycoprotein required for vitamin B12 absorption". Intrinsic factor is the one gastric product required for life because vitamin B12 cannot be absorbed without it. B12 is needed for mature red cells and for nerve function. He has large red cells and foot numbness 3 years after the whole stomach was removed, and he has had no replacement injections. He eats regular meals without diarrhea, so loss of acid or churning does not explain this pair of findings. "The acid that converts pepsinogen into pepsin" is not the best choice because Loss of acid impairs activation of pepsin. He has no diarrhea and eats normally, and acid loss does not by itself produce large red cells and numb feet. "The mucus barrier that lines the gastric surface" is not the best choice because The mucus barrier prevents self-digestion. There is no remaining stomach to protect, and barrier loss does not cause this blood and nerve picture. "The hormone released from the fundus during a fast" is not the best choice because Ghrelin from the fundus acts on hunger. Loss of that signal does not produce large red cells and distal numbness. "The oblique muscle layer that churns a solid meal" is not the best choice because The oblique muscle churns food. He tolerates regular meals, so loss of churning is not the cause of the anemia and numbness.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '7229dc59490406444be13587041bb60db35aa899999014da51ede33163bcd0b2', false, NOW(), NOW(), 3,
  'intrinsic-factor-essential', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'intrinsic-factor-essential', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-014", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": true, "keyLetter": "D", "verifiedFact": "The only stomach function necessary for life is intrinsic factor, required for intestinal absorption of vitamin B12. After total gastrectomy, B12 injections replace that function."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280015', 'usmle-step-1', 'physiology',
  $sc$A 26-year-old woman who illustrates children's books is studied before a test meal. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Acid output rises within 2 minutes after she smells and looks at a piece of warm bread, and the bread has not yet been swallowed. On a second day she is tearful, says she has no appetite, and the same smell produces no rise in acid.$sc$,
  $qu$Which of the following best explains the rise on the first day and its absence on the second?$qu$,
  $op${"options": ["Stretch of the stomach wall by the swallowed bread", "Peptides in the duodenum releasing intestinal gastrin", "A fall in antral pH that stops further acid output", "Fat in the duodenum slowing emptying for 6 hours", "A conditioned reflex before food arrives, lost with appetite"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "cephalic-phase-before-food", "taskCategory": "mechanism"}$op$,
  $ky$A conditioned reflex before food arrives, lost with appetite$ky$,
  $ex$The best choice is "A conditioned reflex before food arrives, lost with appetite". The cephalic phase is the brief secretion that occurs before food enters the stomach, triggered by smell, taste, sight, or thought of wanted food. The bread was not swallowed. The same stimulus failed when she had lost her appetite, which suppresses this reflex. "Stretch of the stomach wall by the swallowed bread" is not the best choice because Stretch of the stomach is part of the gastric phase, after food arrives. Nothing was swallowed. "Peptides in the duodenum releasing intestinal gastrin" is not the best choice because Intestinal gastrin is released when partially digested food fills the duodenum. The bread never left the plate. "A fall in antral pH that stops further acid output" is not the best choice because A low antral pH restrains acid secretion. That does not explain a rise that starts from the smell of food she has not eaten. "Fat in the duodenum slowing emptying for 6 hours" is not the best choice because Fatty meals leave the stomach slowly. No meal was eaten, so emptying time is not the finding.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ebddb724dd6eafff4862e662e2b0e4e009f9e1b852d4a41b5d89c665a60d1aa0', false, NOW(), NOW(), 3,
  'cephalic-phase-before-food', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cephalic-phase-before-food', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-015", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "E", "verifiedFact": "The cephalic phase occurs before food enters the stomach. Smell, taste, sight, or thought of food triggers vagal signals that increase gastric secretion. Depression and loss of appetite can suppress it."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280016', 'usmle-step-1', 'physiology',
  $sc$A 36-year-old man who lays brick is studied 90 minutes after a 900-mL meal. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The duodenum is distended. Acid secretion falls, and the sphincter at the outlet of the stomach closes so that little further chyme leaves. The stomach itself is not empty.$sc$,
  $qu$Which of the following best accounts for the closed outlet and the fall in acid?$qu$,
  $op${"options": ["Duodenal distention inhibits further gastric emptying", "The sight of food is still driving the earliest secretory phase", "An empty fundus is releasing the hormone that causes hunger", "Bile salts are being stored in a relaxed gallbladder", "The external anal sphincter has been voluntarily contracted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "enterogastric-reflex-pylorus", "taskCategory": "mechanism"}$op$,
  $ky$Duodenal distention inhibits further gastric emptying$ky$,
  $ex$The best choice is "Duodenal distention inhibits further gastric emptying". Distention of the duodenum with chyme triggers the enterogastric reflex, which inhibits secretion and closes the pyloric sphincter. The duodenum is distended, acid has fallen, and the outlet is closed while the stomach still contains the meal. "The sight of food is still driving the earliest secretory phase" is not the best choice because The cephalic phase is brief and occurs before food arrives. This recording is 90 minutes after a 900-mL meal. "An empty fundus is releasing the hormone that causes hunger" is not the best choice because Ghrelin rises in the fasting state, before meals. He is 90 minutes after a large meal, and the fundus is not described as empty. "Bile salts are being stored in a relaxed gallbladder" is not the best choice because Between meals the gallbladder stores bile. That does not close the pylorus or lower acid during duodenal distention. "The external anal sphincter has been voluntarily contracted" is not the best choice because The external anal sphincter is skeletal muscle at the anus. It does not control the gastric outlet.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '83f7f3821b14417824b03c004ac314cf061bdd728706205e2abae71417dbf1e7', false, NOW(), NOW(), 3,
  'enterogastric-reflex-pylorus', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'enterogastric-reflex-pylorus', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-016", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "A", "verifiedFact": "When the duodenum is distended with chyme, the enterogastric reflex inhibits gastric secretion and closes the pyloric sphincter, limiting further emptying."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280017', 'usmle-step-1', 'physiology',
  $sc$A 53-year-old woman who binds library books has taken six aspirin tablets a day for 3 weeks for a sore knee. Temperature is 36.9°C, pulse is 88/min, respirations are 16/min, and blood pressure is 126/78 mm Hg. Endoscopy shows a shallow break in the gastric lining. Biopsy of nearby intact lining shows a thick mucus coat, and the epithelial cells meet at sealing contacts. The surface cells of a labeled control slide are said to be replaced every 3 to 6 days.$sc$,
  $qu$Which of the following is the role of the thick mucus coat on the intact lining?$qu$,
  $op${"options": ["It activates pepsinogen inside the basal gland cells", "Bicarbonate in that coat neutralizes acid at the surface", "It absorbs vitamin B12 farther down, in the ileum", "It emulsifies triglyceride droplets in the duodenum", "It concentrates bile by removing water from it"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "mucosal-barrier-bicarbonate", "taskCategory": "mechanism"}$op$,
  $ky$Bicarbonate in that coat neutralizes acid at the surface$ky$,
  $ex$The best choice is "Bicarbonate in that coat neutralizes acid at the surface". The surface coat is bicarbonate-rich mucus. The bicarbonate neutralizes acid, and the mucus is a physical barrier. The intact lining in the biopsy still has that coat. Aspirin use is one of the two common reasons that coat fails, which fits the shallow break. "It activates pepsinogen inside the basal gland cells" is not the best choice because Pepsinogen is activated by hydrochloric acid, not by the surface mucus. The mucus protects the surface from that acid. "It absorbs vitamin B12 farther down, in the ileum" is not the best choice because Vitamin B12 absorption requires intrinsic factor and occurs in the small intestine, not in the gastric mucus coat. "It emulsifies triglyceride droplets in the duodenum" is not the best choice because Emulsification is the job of bile salts and phospholipids. Gastric mucus does not do that. "It concentrates bile by removing water from it" is not the best choice because The gallbladder mucosa concentrates bile. Gastric mucus does not.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '1bb435c6443d3503f2effd425d1ea8f10ad6623a0e3e9a6f4a79d1ad53f28442', false, NOW(), NOW(), 2,
  'mucosal-barrier-bicarbonate', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'mucosal-barrier-bicarbonate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-017", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "B", "verifiedFact": "The stomach is protected by bicarbonate-rich mucus, tight junctions between epithelial cells, and replacement of the surface epithelium every 3 to 6 days."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280018', 'usmle-step-1', 'physiology',
  $sc$A 45-year-old man who drives a city bus is studied 1 hour after a mixed meal. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. A local chemical messenger in the gastric mucosa is elevated. Blocking that messenger cuts acid output sharply, while pepsinogen granules in the basal gland cells remain.$sc$,
  $qu$Which of the following is the acid-producing target of this messenger?$qu$,
  $op${"options": ["Chief cells storing an inactive proenzyme", "Goblet cells of the colonic surface", "Parietal cells in the gastric glands", "Acinar cells secreting active lipase", "Kupffer cells along the hepatic sinusoids"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "histamine-parietal-acid", "taskCategory": "mechanism"}$op$,
  $ky$Parietal cells in the gastric glands$ky$,
  $ex$The best choice is "Parietal cells in the gastric glands". Histamine released from the stomach mucosa when food is present stimulates parietal cells to secrete hydrochloric acid. Blocking it cuts acid output. The basal pepsinogen granules are unchanged, so the target is the acid cell, not the proenzyme cell. "Chief cells storing an inactive proenzyme" is not the best choice because Chief cells store pepsinogen. Those granules remained, and the block affected acid, which parietal cells secrete. "Goblet cells of the colonic surface" is not the best choice because Colonic goblet cells secrete mucus that eases passage of feces. They are not the gastric target of this meal-related acid signal. "Acinar cells secreting active lipase" is not the best choice because Pancreatic lipase is secreted already active. It is not the gastric cell whose acid fell. "Kupffer cells along the hepatic sinusoids" is not the best choice because Kupffer cells phagocytose material in liver sinusoids. They do not secrete gastric acid.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '1789e3664022ecc37409e0f35b7fd2b33b6e6a910b5668e57611216944d3a447', false, NOW(), NOW(), 2,
  'histamine-parietal-acid', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'histamine-parietal-acid', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-018", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "C", "verifiedFact": "Histamine from the stomach mucosa, released when food is present, stimulates parietal cells to release hydrochloric acid."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280019', 'usmle-step-1', 'physiology',
  $sc$A 62-year-old woman who audits freight invoices is found to have a 1.2-cm antral endocrine tumor. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 138/82 mm Hg. Fasting acid output is very low, the stomach empties slowly, and pancreatic enzyme output is also low. The tumor cells match the antral cells that restrain all of those processes.$sc$,
  $qu$Which of the following is the expected action of the hormone these cells release?$qu$,
  $op${"options": ["Stimulation of hunger by an action on the hypothalamus", "Conversion of pepsinogen to pepsin inside the lumen", "Emulsification of fat within the duodenal lumen", "Restriction of acid, motility, emptying, and enzymes", "Activation of trypsinogen on the intestinal brush border"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "somatostatin-restrains-acid", "taskCategory": "mechanism"}$op$,
  $ky$Restriction of acid, motility, emptying, and enzymes$ky$,
  $ex$The best choice is "Restriction of acid, motility, emptying, and enzymes". Somatostatin from the pyloric antrum restricts gastric secretions, motility, and emptying, and it also restricts pancreatic secretions. Her tumor is antral, acid is low, emptying is slow, and pancreatic enzymes are low. "Stimulation of hunger by an action on the hypothalamus" is not the best choice because Ghrelin, mainly from the fundus, stimulates hunger through the hypothalamus. It does not suppress acid, emptying, and pancreatic enzymes together. "Conversion of pepsinogen to pepsin inside the lumen" is not the best choice because Hydrochloric acid converts pepsinogen to pepsin. A hormone that lowers acid would not be that converter. "Emulsification of fat within the duodenal lumen" is not the best choice because Bile salts emulsify fat. They are not the antral hormone that restrains acid and pancreatic juice. "Activation of trypsinogen on the intestinal brush border" is not the best choice because Enteropeptidase on the brush border activates trypsinogen. It is not an antral tumor product.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a82c849d312587ea5afb88d030523d8241537686a090a60019a3b234980c1c7f', false, NOW(), NOW(), 3,
  'somatostatin-restrains-acid', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'somatostatin-restrains-acid', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-019", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "D", "verifiedFact": "Somatostatin from the pyloric antrum and duodenum restricts gastric secretions, motility, and emptying, and also restricts pancreatic secretion."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280020', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old man who stocks warehouses skips breakfast and is studied at 11 a.m., just before he is allowed to eat. Temperature is 36.6°C, pulse is 64/min, respirations are 12/min, and blood pressure is 110/68 mm Hg. He reports intense hunger. A hormone measured in blood from the gastric fundus is high and falls 40 minutes after he eats a 700-kcal meal.$sc$,
  $qu$Which of the following is the main action of the hormone that was high before the meal?$qu$,
  $op${"options": ["Neutralization of acid by surface bicarbonate", "Activation of trypsin from trypsinogen", "Reabsorption of bile salts in the ileum", "Contraction of the external anal sphincter", "Stimulation of hunger through the hypothalamus"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "ghrelin-fasting-hunger", "taskCategory": "mechanism"}$op$,
  $ky$Stimulation of hunger through the hypothalamus$ky$,
  $ex$The best choice is "Stimulation of hunger through the hypothalamus". Ghrelin comes mainly from the fundus, rises in the fasting state just before meals, and stimulates hunger through the hypothalamus. His fundic hormone is high while he is hungry and falls after the meal. "Neutralization of acid by surface bicarbonate" is not the best choice because Surface bicarbonate is part of the gastric mucus barrier. It is not a fundic hormone that falls after eating. "Activation of trypsin from trypsinogen" is not the best choice because Enteropeptidase activates trypsinogen in the duodenum. It does not rise in fundic blood before a meal. "Reabsorption of bile salts in the ileum" is not the best choice because Bile-salt reabsorption is an ileal transport step, not a pre-meal fundic hormone. "Contraction of the external anal sphincter" is not the best choice because The external anal sphincter is voluntary skeletal muscle. It is not driven by a fundic hormone that tracks hunger.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'b5aadea5638eedf2731b6cf2ecb01c9be05602888ff23549945de43a15b4a57e', false, NOW(), NOW(), 2,
  'ghrelin-fasting-hunger', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ghrelin-fasting-hunger', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-020", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": true, "keyLetter": "E", "verifiedFact": "Ghrelin is produced mainly by the fundus in the fasting state, with levels rising just before meals, and it acts on the hypothalamus to stimulate hunger."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280021', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old man who bakes bread is studied after swallowing a starchy roll. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. For several minutes the bolus sits in the fundus and starch digestion continues. Once mixing waves fold it into the acid chyme, starch digestion by the salivary enzyme stops and triglyceride breakdown by a mouth-derived lipase begins.$sc$,
  $qu$Which of the following best explains both changes after mixing?$qu$,
  $op${"options": ["Acid inactivates the salivary enzyme and activates the lipase", "Bile salts emulsify starch and stop all lipase activity", "Secretin converts the salivary enzyme into an active lipase", "Gastrin from the antrum digests starch inside the fundus", "The brush border finishes starch digestion inside the fundus"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "acid-stops-salivary-amylase", "taskCategory": "mechanism"}$op$,
  $ky$Acid inactivates the salivary enzyme and activates the lipase$ky$,
  $ex$The best choice is "Acid inactivates the salivary enzyme and activates the lipase". While food remains in the fundus, salivary amylase continues. Mixing with acid chyme inactivates that amylase and activates lingual lipase, which then splits triglycerides. Both changes in the study follow that mixing. "Bile salts emulsify starch and stop all lipase activity" is not the best choice because Bile salts emulsify lipids in the intestine. They do not turn off salivary starch digestion in the stomach, and they do not stop lipase. "Secretin converts the salivary enzyme into an active lipase" is not the best choice because Secretin drives pancreatic bicarbonate. It does not convert salivary amylase into a lipase. "Gastrin from the antrum digests starch inside the fundus" is not the best choice because Gastrin increases acid secretion and emptying. It is not itself the enzyme that digests starch. "The brush border finishes starch digestion inside the fundus" is not the best choice because Brush-border enzymes finish carbohydrate digestion on small-intestinal microvilli. The bolus is still in the fundus.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '9da1008f8d41b21c3a22fe0e9406eecc954510866198dd8f9c113e4f22ce6339', false, NOW(), NOW(), 3,
  'acid-stops-salivary-amylase', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'acid-stops-salivary-amylase', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-021", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "A", "verifiedFact": "Salivary amylase keeps digesting starch in the fundus until acid mixes in and inactivates it. That same acid activates lingual lipase."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280022', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old woman who teaches swimming eats three test breakfasts on separate days, each 500 kcal. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. The starch meal is gone from the stomach first, the egg-white meal is next, and the cream meal is still present at 6 hours. She has no pain and no ulcer on endoscopy.$sc$,
  $qu$Which of the following best explains why the cream meal remains longest?$qu$,
  $op${"options": ["Starch is held until salivary amylase is used up", "Intestinal fat digestion is slow, so emptying waits", "Protein meals close the pylorus for the full 6 hours", "Cream stimulates hunger hormone release from the antrum", "The cream meal is absorbed entirely by the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "fat-empties-slowest", "taskCategory": "mechanism"}$op$,
  $ky$Intestinal fat digestion is slow, so emptying waits$ky$,
  $ex$The best choice is "Intestinal fat digestion is slow, so emptying waits". Carbohydrate meals empty fastest, protein meals next, and high-triglyceride meals stay longest because enzymes in the small intestine digest fats slowly. The cream meal is the fat meal and is still present at 6 hours, which matches that order. Endoscopy shows no ulcer. "Starch is held until salivary amylase is used up" is not the best choice because Starch left first in this study. It is not held until amylase is gone. "Protein meals close the pylorus for the full 6 hours" is not the best choice because The protein meal left before the cream meal. Protein does not keep the pylorus closed for 6 hours. "Cream stimulates hunger hormone release from the antrum" is not the best choice because Ghrelin comes mainly from the fundus in the fasting state, not from the antrum in response to cream. "The cream meal is absorbed entirely by the stomach" is not the best choice because Little nutrient absorption occurs in the stomach, aside from substances such as alcohol and aspirin. A cream meal is not absorbed there.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '814ab6edace287ebd9051940e39a5816b99592a4dd87cae6ac2d6a9d4de95e22', false, NOW(), NOW(), 2,
  'fat-empties-slowest', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'fat-empties-slowest', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-022", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": true, "keyLetter": "B", "verifiedFact": "Carbohydrate-heavy foods leave the stomach fastest, then high-protein foods. High-triglyceride meals stay longest, sometimes 6 hours or more, because intestinal fat digestion is slow."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280023', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old man who refinishes furniture takes two tablets for a headache and a sip of whiskey on an empty stomach. Temperature is 36.8°C, pulse is 86/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Thirty minutes later, before any meal has been eaten, both the drug and the alcohol are already measurable in his blood. He has no diarrhea.$sc$,
  $qu$Which of the following best accounts for the early appearance of both substances in blood?$qu$,
  $op${"options": ["All nutrient absorption normally occurs in the stomach", "Lacteals are required before either substance enters blood", "The stomach can absorb alcohol and this analgesic", "Bile salts must emulsify both substances first", "The colon reabsorbs both during the next 12 hours"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "stomach-absorbs-aspirin", "taskCategory": "mechanism"}$op$,
  $ky$The stomach can absorb alcohol and this analgesic$ky$,
  $ex$The best choice is "The stomach can absorb alcohol and this analgesic". Nearly all absorption is in the small intestine, but the stomach does absorb some drugs, including alcohol and aspirin. Both are in his blood at 30 minutes on an empty stomach, before a meal. "All nutrient absorption normally occurs in the stomach" is not the best choice because The stomach is a holding chamber. Little nutrient absorption occurs there. The exception relevant here is drugs such as alcohol and aspirin, not nutrients in general. "Lacteals are required before either substance enters blood" is not the best choice because Lacteals carry lipid breakdown products. Alcohol and this analgesic are already in blood, and lipids are not the substances measured. "Bile salts must emulsify both substances first" is not the best choice because Bile salts emulsify lipids in the duodenum. They are not required for gastric absorption of alcohol and aspirin. "The colon reabsorbs both during the next 12 hours" is not the best choice because The colon absorbs remaining water over 12 to 24 hours. These levels were measured at 30 minutes.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '93b407b3d23bb0f1f5165a85c245e4e9b2f514364847e2c86fc63f3009a9752c', false, NOW(), NOW(), 3,
  'stomach-absorbs-aspirin', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'stomach-absorbs-aspirin', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-023", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "C", "verifiedFact": "Almost all absorption occurs in the small intestine. The stomach does absorb some drugs, including alcohol and aspirin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280024', 'usmle-step-1', 'anatomy',
  $sc$A 22-year-old woman who runs cross-country has an upper endoscopy at 7 a.m. after a 12-hour fast. Temperature is 36.4°C, pulse is 58/min, respirations are 12/min, and blood pressure is 104/64 mm Hg. The gastric lumen is small, and the lining is thrown into large folds. After she drinks 400 mL of water, the same folds flatten.$sc$,
  $qu$Which of the following best describes these folds?$qu$,
  $op${"options": ["Permanent circular ridges that end in the mid-ileum", "Three longitudinal muscle bands that pouch the colon", "Microscopic projections that form the brush border", "Mucosa and submucosa thrown up in an empty stomach", "Transverse rectal shelves that separate gas from stool"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "rugae-empty-stomach", "taskCategory": "anatomy"}$op$,
  $ky$Mucosa and submucosa thrown up in an empty stomach$ky$,
  $ex$The best choice is "Mucosa and submucosa thrown up in an empty stomach". In the absence of food the stomach deflates and its mucosa and submucosa fall into rugae. She has fasted 12 hours, the lumen is small, and the folds flatten after 400 mL of water. "Permanent circular ridges that end in the mid-ileum" is not the best choice because Circular folds are permanent ridges of the small intestine that begin in the duodenum and end near the mid-ileum. They do not flatten after a drink of water in the stomach. "Three longitudinal muscle bands that pouch the colon" is not the best choice because Teniae coli are three colonic muscle bands that create haustra. This endoscopy is of the fasting stomach. "Microscopic projections that form the brush border" is not the best choice because Microvilli are 1-micrometer apical projections that make the brush border. They are not macroscopic folds that flatten when the stomach fills. "Transverse rectal shelves that separate gas from stool" is not the best choice because Rectal valves are transverse folds that help keep gas and feces apart. They are not gastric folds after a fast.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'e0f803020f45b53a9adc1dd4f2edc6490c663819f45118c4f8eaa0d9c231e0f6', false, NOW(), NOW(), 2,
  'rugae-empty-stomach', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'rugae-empty-stomach', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-024", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "D", "verifiedFact": "When the stomach is empty it deflates, and the mucosa and submucosa fall into large folds called rugae."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280025', 'usmle-step-1', 'physiology',
  $sc$A 48-year-old man who paints houses has pale, greasy stools after his gallbladder was removed and a stone was found blocking the duct that enters the duodenum. Temperature is 36.9°C, pulse is 84/min, respirations are 16/min, and blood pressure is 132/80 mm Hg. Duodenal fluid contains almost no bile salts. Pancreatic lipase in the same fluid is present and active.$sc$,
  $qu$Which of the following is the missing step that leaves fat undigested?$qu$,
  $op${"options": ["Hydrolysis of triglyceride by the pancreatic enzyme", "Conversion of pepsinogen to pepsin by acid", "Absorption of glucose through villus capillaries", "Secretion of intrinsic factor by parietal cells", "Breaking large fat globules into tiny droplets"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "bile-salts-emulsify", "taskCategory": "mechanism"}$op$,
  $ky$Breaking large fat globules into tiny droplets$ky$,
  $ex$The best choice is "Breaking large fat globules into tiny droplets". Bile salts and phospholipids break large lipid globules into tiny droplets so lipase has surface to work on. Bile salts are absent and the stools are greasy, while lipase is present and active, so the missing step is that breakup, not the enzyme. "Hydrolysis of triglyceride by the pancreatic enzyme" is not the best choice because Pancreatic lipase is present and active in the duodenal fluid. The hydrolysis enzyme is not the missing piece. "Conversion of pepsinogen to pepsin by acid" is not the best choice because Acid activation of pepsin is a gastric step in protein digestion. It does not explain greasy stools with absent bile salts. "Absorption of glucose through villus capillaries" is not the best choice because Glucose enters villus blood capillaries. Fat, not glucose, is the nutrient in the greasy stools. "Secretion of intrinsic factor by parietal cells" is not the best choice because Intrinsic factor is required for vitamin B12 absorption. It does not disperse fat globules.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '1ac0aa72d8c89555315cdc4944e96456fca2040617dd47ab6889c0a1cc8adadb', false, NOW(), NOW(), 2,
  'bile-salts-emulsify', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bile-salts-emulsify', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-025", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": true, "keyLetter": "E", "verifiedFact": "Bile salts and phospholipids emulsify large lipid globules into tiny fragments. They do not themselves hydrolyze triglyceride. Lipase then acts on the increased surface."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280026', 'usmle-step-1', 'physiology',
  $sc$A 39-year-old woman who coaches rowing had the last 80 cm of small intestine removed after an injury. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The duodenum and jejunum remain. Six weeks later her stools are greasy, and the bile-salt concentration in new hepatic bile is low. The liver cells themselves look normal on biopsy.$sc$,
  $qu$Which of the following recycling route was interrupted?$qu$,
  $op${"options": ["Ileal uptake of bile salts and return in portal blood", "Colonic synthesis of vitamin K by luminal bacteria", "Gastric absorption of alcohol across the fundus", "Storage of concentrated bile inside the gallbladder", "Brush-border digestion of lactose in the duodenum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "bile-salt-ileal-recycle", "taskCategory": "mechanism"}$op$,
  $ky$Ileal uptake of bile salts and return in portal blood$ky$,
  $ex$The best choice is "Ileal uptake of bile salts and return in portal blood". Once bile salts reach the ileum they are absorbed and returned to the liver in portal blood, then secreted again. The last 80 cm of small intestine is the ileum. It was removed, new bile is poor in bile salts, the liver cells look normal, and the stools are greasy. "Colonic synthesis of vitamin K by luminal bacteria" is not the best choice because Colonic bacteria synthesize vitamin K. That does not restock bile salts, and the removed segment is small intestine. "Gastric absorption of alcohol across the fundus" is not the best choice because The stomach absorbs some alcohol. That route does not return bile salts to the liver. "Storage of concentrated bile inside the gallbladder" is not the best choice because The gallbladder stores and concentrates bile between meals. Her liver cells are normal and the deficit follows ileal resection, not gallbladder loss. "Brush-border digestion of lactose in the duodenum" is not the best choice because Lactase is a brush-border enzyme for milk sugar. Losing it causes gas and diarrhea after dairy, not a fall in bile-salt concentration in hepatic bile.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'bab2ffe30ac4351286016af330991c392dd2d74990cc8bf8d6ae908326eefbec', false, NOW(), NOW(), 3,
  'bile-salt-ileal-recycle', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bile-salt-ileal-recycle', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-026", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": true, "keyLetter": "A", "verifiedFact": "Bile salts are absorbed in the ileum and returned to the liver in portal blood, then secreted again into bile."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280027', 'usmle-step-1', 'physiology',
  $sc$A 43-year-old man who repairs bicycles is studied as acidic chyme first enters the duodenum. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Duodenal pH is 3.5. Juice collected from pancreatic ducts is watery and rich in bicarbonate, while enzyme output from the acini has not yet risen. No fat has reached the duodenum.$sc$,
  $qu$Which of the following hormone actions fits this ductal juice?$qu$,
  $op${"options": ["Fat in the duodenum drives enzyme release from acini", "Acid in the duodenum drives bicarbonate from duct cells", "A fasting fundus hormone stimulates hypothalamic hunger", "Antral acid cells release the inactive protein proenzyme", "Ileal lymphoid aggregates sample luminal bacteria"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "secretin-ductal-bicarbonate", "taskCategory": "mechanism"}$op$,
  $ky$Acid in the duodenum drives bicarbonate from duct cells$ky$,
  $ex$The best choice is "Acid in the duodenum drives bicarbonate from duct cells". Acidic chyme releases secretin, and secretin causes duct cells to release bicarbonate-rich juice. Duodenal pH is 3.5, the duct juice is watery and bicarbonate-rich, and enzyme output has not risen. No fat has arrived. "Fat in the duodenum drives enzyme release from acini" is not the best choice because CCK is released by proteins and fats and stimulates enzyme-rich juice from acini. Fat has not arrived, and acinar enzyme output has not risen. "A fasting fundus hormone stimulates hypothalamic hunger" is not the best choice because Ghrelin from the fasting fundus stimulates hunger. It does not produce bicarbonate-rich duct juice when acid enters the duodenum. "Antral acid cells release the inactive protein proenzyme" is not the best choice because Chief cells release pepsinogen. They are not the source of pancreatic ductal bicarbonate. "Ileal lymphoid aggregates sample luminal bacteria" is not the best choice because Peyer patches sample luminal antigen. They do not secrete pancreatic bicarbonate.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '35ece4ba3f132e14f97b588fcc2bb7fe2e9ef0deb9031fbaf003a563404c683b', false, NOW(), NOW(), 2,
  'secretin-ductal-bicarbonate', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secretin-ductal-bicarbonate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-027", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "B", "verifiedFact": "Acidic chyme in the duodenum releases secretin, which causes pancreatic duct cells to secrete bicarbonate-rich juice. Proteins and fats release CCK, which stimulates enzyme-rich juice from acini."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280028', 'usmle-step-1', 'physiology',
  $sc$A 51-year-old woman who edits film is studied after a meal of eggs and butter reaches the duodenum. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Duodenal pH is already 7.2. Enzyme-rich juice pours from pancreatic acini, and bile flow from the liver increases. A watery bicarbonate phase had occurred earlier, when the pH was low.$sc$,
  $qu$Which of the following best accounts for the enzyme-rich juice and the rise in bile flow?$qu$,
  $op${"options": ["Acid alone is still driving duct-cell bicarbonate secretion", "The antrum is releasing the hormone that only increases acid", "Fat and protein in the duodenum signal the acini and the liver", "Colonic bacteria are synthesizing vitamin K and biotin", "Surface mucus cells are replacing themselves every few days"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "cck-acinar-enzymes", "taskCategory": "mechanism"}$op$,
  $ky$Fat and protein in the duodenum signal the acini and the liver$ky$,
  $ex$The best choice is "Fat and protein in the duodenum signal the acini and the liver". Proteins and fats release cholecystokinin, which stimulates enzyme-rich juice from acini and increases bile production when fatty chyme enters the duodenum. The meal is eggs and butter, pH is already 7.2, enzymes and bile flow have risen, and the bicarbonate phase was earlier. "Acid alone is still driving duct-cell bicarbonate secretion" is not the best choice because Secretin and ductal bicarbonate respond to acid. The pH is now 7.2, and that watery phase already occurred. "The antrum is releasing the hormone that only increases acid" is not the best choice because Gastrin from the antrum increases gastric acid and emptying. It does not explain enzyme-rich pancreatic juice plus increased bile flow after a fatty meal. "Colonic bacteria are synthesizing vitamin K and biotin" is not the best choice because Colonic bacteria make vitamin K and biotin. They do not release acinar enzymes. "Surface mucus cells are replacing themselves every few days" is not the best choice because Gastric surface cells turn over every 3 to 6 days. That renewal is not the signal for this enzyme and bile response.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'e10c3801b27c92a4d5eb69be1903e6d25bae96785c48e831f1049b8540d050fb', false, NOW(), NOW(), 2,
  'cck-acinar-enzymes', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cck-acinar-enzymes', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-028", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "C", "verifiedFact": "Proteins and fats in the duodenum release cholecystokinin, which stimulates acini to secrete enzyme-rich pancreatic juice and enhances secretin. Fatty chyme also increases bile production through cholecystokinin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280029', 'usmle-step-1', 'biochemistry',
  $sc$A 7-year-old boy who lives on a dairy farm has bulky stools and poor weight gain of 1.5 kg over the past year. Temperature is 36.7°C, pulse is 92/min, respirations are 18/min, and blood pressure is 96/60 mm Hg. Duodenal juice contains trypsinogen, chymotrypsinogen, and procarboxypeptidase, all still inactive. Amylase and lipase in the same juice are active. The brush-border enzyme that normally starts this protein-enzyme cascade is missing.$sc$,
  $qu$Which of the following is the first activation blocked by that missing enzyme?$qu$,
  $op${"options": ["Amylase activation, so starch digestion cannot start", "Lipase activation, so triglyceride hydrolysis cannot start", "Pepsinogen conversion by acid inside the stomach", "The first protease precursor, leaving the others inactive", "Bile-salt synthesis inside each individual liver cell"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "enteropeptidase-trypsinogen", "taskCategory": "mechanism"}$op$,
  $ky$The first protease precursor, leaving the others inactive$ky$,
  $ex$The best choice is "The first protease precursor, leaving the others inactive". Brush-border enteropeptidase activates trypsinogen to trypsin, and trypsin then activates the other pancreatic proteases. Those three proteases are still inactive, while amylase and lipase, which are secreted already active, are active. The missing brush-border enzyme therefore blocks the first protease step. "Amylase activation, so starch digestion cannot start" is not the best choice because Amylase is secreted in active form and is active in this juice. Starch digestion by amylase is not the blocked step. "Lipase activation, so triglyceride hydrolysis cannot start" is not the best choice because Lipase is secreted active and is active here. Fat hydrolysis by lipase is not waiting on this brush-border enzyme. "Pepsinogen conversion by acid inside the stomach" is not the best choice because Pepsinogen is activated by gastric acid. The inactive enzymes in the duodenal juice are the pancreatic protease precursors. "Bile-salt synthesis inside each individual liver cell" is not the best choice because Hepatocytes make bile. The missing protein is a brush-border enzyme, and bile salts are not the inactive proteins listed in the juice.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "biochemistry"]$tg$,
  's1-new-20261128-hidden', '551cd16842f512adda33280a6d24f56a9d6440aab23206a91fcd04e31d19767c', false, NOW(), NOW(), 3,
  'enteropeptidase-trypsinogen', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'enteropeptidase-trypsinogen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-029", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "D", "verifiedFact": "Enteropeptidase on the intestinal brush border activates trypsin from trypsinogen. Trypsin then activates chymotrypsinogen and procarboxypeptidase. Amylase, lipase, and nuclease are secreted already active."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280030', 'usmle-step-1', 'anatomy',
  $sc$A 55-year-old man who cleans fish markets has had fever for 4 days after a deep cut. Temperature is 38.6°C, pulse is 108/min, respirations are 20/min, and blood pressure is 102/64 mm Hg. Blood culture grows gram-negative rods. A liver biopsy shows star-shaped cells along the porous vascular channels that have engulfed bacterial debris. Hepatocytes and bile ductules are intact.$sc$,
  $qu$Which of the following is the normal role of the star-shaped cells?$qu$,
  $op${"options": ["Secretion of bile into the canals between hepatocytes", "Storage and concentration of bile between meals", "Release of enzyme-rich juice from pancreatic acini", "Absorption of bile salts by the terminal ileum", "Phagocytosis of bacteria and worn blood cells in sinusoids"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "kupffer-sinusoid-phagocytes", "taskCategory": "histology"}$op$,
  $ky$Phagocytosis of bacteria and worn blood cells in sinusoids$ky$,
  $ex$The best choice is "Phagocytosis of bacteria and worn blood cells in sinusoids". Star-shaped cells in the hepatic sinusoids are the phagocytes that remove dead blood cells, bacteria, and other foreign material. The biopsy shows them along those channels, full of bacterial debris, with hepatocytes and ductules intact. "Secretion of bile into the canals between hepatocytes" is not the best choice because Hepatocytes secrete bile into canaliculi. Those cells are intact and are not the star-shaped phagocytes. "Storage and concentration of bile between meals" is not the best choice because The gallbladder stores and concentrates bile. It is not a star-shaped cell inside a liver sinusoid. "Release of enzyme-rich juice from pancreatic acini" is not the best choice because Pancreatic acini secrete enzymes. They are not in the liver sinusoids. "Absorption of bile salts by the terminal ileum" is not the best choice because Ileal enterocytes absorb bile salts. They are not the phagocytes in this liver biopsy.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "anatomy"]$tg$,
  's1-new-20261128-hidden', '872e080efc3dc61956827b05e9ab6d31af01b47bdb316c85dd9eadc69f4b78b5', false, NOW(), NOW(), 2,
  'kupffer-sinusoid-phagocytes', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'histology', 'kupffer-sinusoid-phagocytes', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-030", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "E", "verifiedFact": "Kupffer cells are star-shaped phagocytes in the hepatic sinusoids. They remove dead red and white cells, bacteria, and other foreign material."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280031', 'usmle-step-1', 'anatomy',
  $sc$A 60-year-old woman who catalogues maps has a liver biopsy for a 6-month rise in enzymes. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. At the corner of each lobule the slide shows three structures traveling together: a small duct, a small thick-walled arterial vessel, and a wider thin-walled venous vessel. The central veins are patent.$sc$,
  $qu$Which of the following is the normal contents of that three-part corner?$qu$,
  $op${"options": ["A bile duct, a hepatic artery, and a portal vein", "A central vein, a lacteal, and a pancreatic duct", "An islet, an acinus, and the accessory pancreatic duct", "A tenia, a haustral pouch, and a fat-filled tag", "A pylorus, a gastric fold, and an oblique muscle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "portal-triad-contents", "taskCategory": "histology"}$op$,
  $ky$A bile duct, a hepatic artery, and a portal vein$ky$,
  $ex$The best choice is "A bile duct, a hepatic artery, and a portal vein". The portal triad at the lobule edge is a bile duct, a hepatic artery branch, and a hepatic portal vein branch. The biopsy shows a small duct, a thick-walled arterial vessel, and a wider thin-walled vein at that corner. "A central vein, a lacteal, and a pancreatic duct" is not the best choice because The central vein is in the middle of the lobule and is described as patent, not as one of the three corner structures. A lacteal is in an intestinal villus. "An islet, an acinus, and the accessory pancreatic duct" is not the best choice because Islets and acini are pancreas. The accessory duct enters the duodenum. They are not the corner of a liver lobule. "A tenia, a haustral pouch, and a fat-filled tag" is not the best choice because Teniae, haustra, and epiploic appendages are gross features of the colon, not a microscopic liver corner. "A pylorus, a gastric fold, and an oblique muscle" is not the best choice because Pylorus, rugae, and oblique muscle are gastric. They do not travel together at the edge of a hepatic lobule.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "anatomy"]$tg$,
  's1-new-20261128-hidden', '9a4796c892cd40a372d11552c711a74bc059018ad369ef21319e46c1418d8b71', false, NOW(), NOW(), 2,
  'portal-triad-contents', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'histology', 'portal-triad-contents', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-031", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "A", "verifiedFact": "A portal triad at the edge of a lobule contains a bile duct, a hepatic artery branch, and a hepatic portal vein branch."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280032', 'usmle-step-1', 'physiology',
  $sc$A 47-year-old man who surveys roads has a liver biopsy read with the class. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Dye injected into the canals between hepatocytes moves toward the duct at the lobule edge. Labeled red cells in the porous vascular channels move toward the vein in the center of the same lobule.$sc$,
  $qu$Which of the following best describes these two flows?$qu$,
  $op${"options": ["Bile and blood both drain first into the central vein", "Bile and sinusoidal blood move in opposite directions", "Bile and blood both exit through the cystic duct", "Bile enters the sinusoid and blood enters the canaliculus", "Both streams cross the brush border of the ileum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "bile-blood-opposite-flow", "taskCategory": "mechanism"}$op$,
  $ky$Bile and sinusoidal blood move in opposite directions$ky$,
  $ex$The best choice is "Bile and sinusoidal blood move in opposite directions". Bile in canaliculi flows toward the bile ducts, while sinusoidal blood flows to the central vein. The dye and the red cells in this lobule move those two ways, so the streams are opposite. "Bile and blood both drain first into the central vein" is not the best choice because Blood reaches the central vein. Bile does not. The dye moved toward the duct at the edge. "Bile and blood both exit through the cystic duct" is not the best choice because The cystic duct drains the gallbladder. It is not the exit for sinusoidal blood. "Bile enters the sinusoid and blood enters the canaliculus" is not the best choice because Bile is excreted into canaliculi, and blood stays in sinusoids. They do not swap compartments. "Both streams cross the brush border of the ileum" is not the best choice because The ileal brush border absorbs bile salts after bile has already reached the intestine. This slide is a liver lobule.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6240149c8cedb9c43f7554ba75d0a15f0ccd4625b715934cedfa5779462791de', false, NOW(), NOW(), 3,
  'bile-blood-opposite-flow', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bile-blood-opposite-flow', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-032", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "B", "verifiedFact": "Bile flows from canaliculi toward bile ducts at the portal triad. Sinusoidal blood flows toward the central vein. Blood and bile therefore flow in opposite directions."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280033', 'usmle-step-1', 'physiology',
  $sc$A 66-year-old man who carves decoys has had pale, greasy stools and dark urine for 2 weeks. Temperature is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. A stone blocks the duct that should deliver bile into the duodenum. Intestinal bacteria are present on stool culture, but the stool has no brown pigment.$sc$,
  $qu$Which of the following pigment step failed to occur?$qu$,
  $op${"options": ["Gastric conversion of pepsinogen into pepsin by luminal acid", "Skin synthesis of vitamin D during ordinary sun exposure", "Bacterial conversion of bile pigment into brown stool color", "Hepatic storage of glycogen after a carbohydrate meal", "Colonic absorption of most of the water ingested each day"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "bilirubin-stercobilin-color", "taskCategory": "mechanism"}$op$,
  $ky$Bacterial conversion of bile pigment into brown stool color$ky$,
  $ex$The best choice is "Bacterial conversion of bile pigment into brown stool color". Bilirubin excreted in bile is converted by intestinal bacteria to stercobilin, which makes stool brown. Bile is not reaching the duodenum, the stool is pale and greasy, and bacteria are present but have no bile pigment to convert. "Gastric conversion of pepsinogen into pepsin by luminal acid" is not the best choice because Pepsin activation is a gastric acid step. It does not color the stool, and the blocked duct is the bile duct. "Skin synthesis of vitamin D during ordinary sun exposure" is not the best choice because Vitamin D can be made in sun-exposed skin. That does not supply the brown stool pigment. "Hepatic storage of glycogen after a carbohydrate meal" is not the best choice because Glycogen storage does not pigment stool. The missing material is bile. "Colonic absorption of most of the water ingested each day" is not the best choice because The small intestine absorbs about 90 percent of ingested water, and the colon absorbs most of the rest. Water handling does not create the brown pigment.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '634abe822fc08960545038018b28961741977cb170672b880322ece4ccff28bc', false, NOW(), NOW(), 3,
  'bilirubin-stercobilin-color', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bilirubin-stercobilin-color', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-033", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "C", "verifiedFact": "Bilirubin from degraded red cells is excreted in bile and converted by intestinal bacteria to stercobilin, the brown pigment of stool. If bile does not enter the intestine, stool is pale and fatty."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280034', 'usmle-step-1', 'anatomy',
  $sc$A 42-year-old woman who designs quilts has a 1.5-cm stone removed from a muscular sac on the underside of the right hepatic lobe. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Between meals the sac's lining absorbs water from the fluid stored inside, and the fluid becomes about 8 times more concentrated. The wall has epithelium and muscle but no separate submucosal layer.$sc$,
  $qu$Which of the following is the normal effect of that water absorption?$qu$,
  $op${"options": ["Pancreatic lipase is converted to an inactive proenzyme", "Salivary amylase is protected from gastric acid", "Vitamin B12 is bound and absorbed at this site", "Fluid in this sac loses water and occupies less volume", "The pyloric sphincter is held closed for 6 hours"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gallbladder-concentrates-bile", "taskCategory": "mechanism"}$op$,
  $ky$Fluid in this sac loses water and occupies less volume$ky$,
  $ex$The best choice is "Fluid in this sac loses water and occupies less volume". The gallbladder mucosa absorbs water and ions and concentrates bile by as much as tenfold. This sac on the underside of the right lobe concentrated its fluid about eightfold and has no submucosa, which matches that wall. "Pancreatic lipase is converted to an inactive proenzyme" is not the best choice because Lipase is secreted already active. Concentrating bile does not inactivate it. "Salivary amylase is protected from gastric acid" is not the best choice because Gastric acid inactivates salivary amylase. Gallbladder water absorption does not protect it. "Vitamin B12 is bound and absorbed at this site" is not the best choice because Vitamin B12 absorption needs intrinsic factor and occurs in the small intestine, not in this sac. "The pyloric sphincter is held closed for 6 hours" is not the best choice because The pylorus controls gastric emptying. It is not the sac that concentrates bile.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'f8255cdc9b3bfd4e0e54bed6383b21f022ccc22f0efa28ae1498179cc811442c', false, NOW(), NOW(), 2,
  'gallbladder-concentrates-bile', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gallbladder-concentrates-bile', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-034", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "D", "verifiedFact": "The gallbladder mucosa absorbs water and ions and can concentrate bile up to tenfold. Its wall has no submucosa."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280035', 'usmle-step-1', 'physiology',
  $sc$A 37-year-old man who installs windows has a biopsy of the first part of the small intestine. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Mucus-secreting glands sit in the submucosa and make an alkaline secretion. A biopsy from the jejunum, taken at the same procedure, has no glands in that layer. Duodenal pH on entry of chyme is 3.8.$sc$,
  $qu$Which of the following is the role of the alkaline mucus from these glands?$qu$,
  $op${"options": ["Emulsifying fat in place of bile salts", "Activating trypsinogen on the brush border", "Absorbing lipid into the villus lacteal", "Producing the brown pigment of normal stool", "Buffering acidic chyme as it leaves the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "brunner-glands-duodenum", "taskCategory": "histology"}$op$,
  $ky$Buffering acidic chyme as it leaves the stomach$ky$,
  $ex$The best choice is "Buffering acidic chyme as it leaves the stomach". Brunner glands are limited to the duodenal submucosa and secrete bicarbonate-rich mucus that buffers acidic chyme. These glands are in the submucosa of the first small-bowel segment, are absent in the jejunum, and the entering pH is 3.8. "Emulsifying fat in place of bile salts" is not the best choice because Bile salts emulsify fat. Alkaline mucus does not replace them. "Activating trypsinogen on the brush border" is not the best choice because Enteropeptidase activates trypsinogen. It is a brush-border enzyme, not the submucosal mucus gland. "Absorbing lipid into the villus lacteal" is not the best choice because Lacteals absorb lipids. Mucus glands do not. "Producing the brown pigment of normal stool" is not the best choice because Intestinal bacteria convert bilirubin to the brown stool pigment. Duodenal mucus does not.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c37bc3fd169454f6272587f6f9b2984f05fcd9a069c961d37bbe7528941de42f', false, NOW(), NOW(), 3,
  'brunner-glands-duodenum', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'histology', 'brunner-glands-duodenum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-035", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "E", "verifiedFact": "Brunner glands are found only in the duodenal submucosa and secrete bicarbonate-rich mucus that buffers acidic chyme."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280036', 'usmle-step-1', 'physiology',
  $sc$A 16-year-old boy who works a summer produce stand has 2 days of watery diarrhea. Temperature is 37.6°C, pulse is 96/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. A jejunal biopsy shows granule-filled cells at the base of the crypts. The granules contain a bactericidal enzyme, and some of the same cells contain engulfed bacterial fragments.$sc$,
  $qu$Which of the following is the function of these crypt-base cells?$qu$,
  $op${"options": ["Release of a bacteria-killing protein and engulfment of debris", "Release of the fat-meal hormone from duodenal cells", "Secretion of alkaline mucus limited to the duodenum", "Production of the cofactor required for vitamin B12 uptake", "Removal of water so stored bile occupies less volume"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "paneth-cell-lysozyme", "taskCategory": "histology"}$op$,
  $ky$Release of a bacteria-killing protein and engulfment of debris$ky$,
  $ex$The best choice is "Release of a bacteria-killing protein and engulfment of debris". Paneth cells at the base of intestinal crypts secrete lysozyme and can phagocytose. The biopsy shows crypt-base cells with a bactericidal enzyme and engulfed bacteria. "Release of the fat-meal hormone from duodenal cells" is not the best choice because I cells of the duodenum secrete cholecystokinin. They are not the crypt-base cells full of a bactericidal enzyme. "Secretion of alkaline mucus limited to the duodenum" is not the best choice because Brunner glands, in the duodenal submucosa only, secrete bicarbonate mucus. These cells are in jejunal crypts. "Production of the cofactor required for vitamin B12 uptake" is not the best choice because Parietal cells in the stomach make intrinsic factor. They are not jejunal crypt cells. "Removal of water so stored bile occupies less volume" is not the best choice because The gallbladder concentrates bile. It is not the source of these crypt granules.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "physiology"]$tg$,
  's1-new-20261128-hidden', '20cea2b69bdc4241e3efc7b7ef9c071af373af92692c88ee629e690cd2197d42', false, NOW(), NOW(), 3,
  'paneth-cell-lysozyme', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'histology', 'paneth-cell-lysozyme', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-036", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "A", "verifiedFact": "Paneth cells in the intestinal crypts secrete lysozyme, a bactericidal enzyme, and can phagocytose."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280037', 'usmle-step-1', 'anatomy',
  $sc$A 31-year-old woman who teaches violin has a biopsy of the proximal jejunum for a 3-kg weight loss. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The specimen shows tall vascular projections and a fuzzy apical border on the epithelial cells. A colon biopsy from the same week has neither the projections nor the fuzzy border, and it has no circular ridges.$sc$,
  $qu$Which of the following is the purpose of the projections and the fuzzy border?$qu$,
  $op${"options": ["Voluntary control of the external anal sphincter", "A large increase in the surface available for absorption", "Storage of bile between meals on the liver's underside", "Churning of food by a third gastric muscle layer", "Phagocytosis of bacteria inside hepatic sinusoids"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "villus-surface-adaptations", "taskCategory": "anatomy"}$op$,
  $ky$A large increase in the surface available for absorption$ky$,
  $ex$The best choice is "A large increase in the surface available for absorption". Circular folds, villi, and microvilli expand small-bowel absorptive surface more than 600-fold and are richest in the proximal two-thirds. The jejunal biopsy has the projections and the fuzzy border. The colon, which lacks folds and villi, does not. "Voluntary control of the external anal sphincter" is not the best choice because The external anal sphincter is skeletal muscle. It is not a mucosal projection. "Storage of bile between meals on the liver's underside" is not the best choice because The gallbladder stores bile. It does not form jejunal villi. "Churning of food by a third gastric muscle layer" is not the best choice because The oblique gastric muscle churns food. It is not the fuzzy apical border of jejunal cells. "Phagocytosis of bacteria inside hepatic sinusoids" is not the best choice because Kupffer cells phagocytose in liver sinusoids. They are not jejunal surface projections.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '02011995013504b702cb059599c031534e81ce5332ef7ec63ba4d4ec0d44d2e4', false, NOW(), NOW(), 2,
  'villus-surface-adaptations', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'villus-surface-adaptations', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-037", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "B", "verifiedFact": "Circular folds, villi, and microvilli increase small-bowel absorptive surface more than 600-fold and are most abundant in the proximal two-thirds, where most absorption occurs."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280038', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old man who installs solar panels is studied 2 hours after lunch. Temperature is 36.8°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. Rings of small-bowel muscle contract and relax about 12 times per minute in the segment just beyond the stomach, shoving chyme back and forth against the lining. The meal has not advanced to the colon. A distal segment contracts only 8 times per minute.$sc$,
  $qu$Which of the following is the main result of these back-and-forth contractions?$qu$,
  $op${"options": ["A strong wave that empties the colon into the rectum", "Voluntary opening of the external anal sphincter", "Mixing of chyme with juices and contact with the mucosa", "Concentration of bile stored under the liver", "Release of intrinsic factor from gastric glands"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "segmentation-mixes-not-propels", "taskCategory": "mechanism"}$op$,
  $ky$Mixing of chyme with juices and contact with the mucosa$ky$,
  $ex$The best choice is "Mixing of chyme with juices and contact with the mucosa". Segmentation shoves chyme back and forth, mixing it with digestive juices and pressing it on the mucosa. It does not propel the meal. The rate is about 12 per minute in the duodenum and about 8 in the ileum, which matches this study, and the meal has not reached the colon. "A strong wave that empties the colon into the rectum" is not the best choice because Mass movements are strong colonic waves that move contents toward the rectum. These contractions are in the small bowel and do not advance the meal. "Voluntary opening of the external anal sphincter" is not the best choice because The external anal sphincter is voluntary skeletal muscle. These are involuntary mixing rings. "Concentration of bile stored under the liver" is not the best choice because The gallbladder concentrates bile. It does not contract 12 times per minute in the small bowel. "Release of intrinsic factor from gastric glands" is not the best choice because Intrinsic factor comes from gastric parietal cells, not from intestinal mixing contractions.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'e6e84ff0452187dcbf33bc65cbaa64197fa7099c5767d9c42bffbd0edd6fd774', false, NOW(), NOW(), 3,
  'segmentation-mixes-not-propels', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'segmentation-mixes-not-propels', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-038", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "C", "verifiedFact": "Segmentation mixes chyme and presses it against the mucosa. It does not propel chyme along the intestine. Duodenal segmentation is about 12 times per minute and ileal segmentation about 8."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280039', 'usmle-step-1', 'physiology',
  $sc$A 35-year-old woman who archives photographs is studied late after a meal, when the small-bowel wall is no longer distended. Temperature is 36.6°C, pulse is 66/min, respirations are 12/min, and blood pressure is 108/66 mm Hg. A hormone from the duodenal mucosa rises. Sweeping contractions then begin in the duodenum and restart a little farther along, reaching the end of the ileum in 100 minutes.$sc$,
  $qu$Which of the following best describes the wave started by this hormone?$qu$,
  $op${"options": ["Back-and-forth mixing that does not move chyme onward", "A colonic mass movement triggered by gastric distention", "Hunger signaling from the fundus just before a meal", "A housekeeping sweep after most of the meal is absorbed", "Closure of the pylorus because the duodenum is overfilled"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "motilin-migrating-complex", "taskCategory": "mechanism"}$op$,
  $ky$A housekeeping sweep after most of the meal is absorbed$ky$,
  $ex$The best choice is "A housekeeping sweep after most of the meal is absorbed". When the intestine is no longer distended, motilin from the duodenal mucosa starts the migrating motility complex. The complex begins in the duodenum and reaches the end of the ileum in about 90 to 120 minutes. This study shows that pattern at 100 minutes after distention has ended. "Back-and-forth mixing that does not move chyme onward" is not the best choice because Segmentation mixes chyme and does not propel it. These waves advance along the bowel. "A colonic mass movement triggered by gastric distention" is not the best choice because The gastrocolic reflex increases colonic mass movements during or just after eating. This recording is late, in the small bowel, after distention has fallen. "Hunger signaling from the fundus just before a meal" is not the best choice because Ghrelin from the fasting fundus stimulates hunger. It does not start a duodenal-to-ileal sweep over 100 minutes. "Closure of the pylorus because the duodenum is overfilled" is not the best choice because The enterogastric reflex closes the pylorus when the duodenum is distended. Here the wall is no longer distended, and the wave is a sweep, not pyloric closure.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '72ae07495a7248f346d3a3a53fb0ed102213c8f7c163ba02e795c634cf40217d', false, NOW(), NOW(), 4,
  'motilin-migrating-complex', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'motilin-migrating-complex', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-039", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "D", "verifiedFact": "After most chyme is absorbed, motilin from the duodenal mucosa starts the migrating motility complex, which sweeps remaining material to the end of the ileum over about 90 to 120 minutes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280040', 'usmle-step-1', 'physiology',
  $sc$A 21-year-old man who clerks in a grocery store has cramps, bloating, and watery diarrhea within 2 hours after a 400-mL glass of milk. Temperature is 36.7°C, pulse is 82/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Cheese-free meals do not cause symptoms. After a dairy challenge, exhaled hydrogen rises. Stool contains no blood and no leukocytes.$sc$,
  $qu$Which of the following best explains the hydrogen in his breath?$qu$,
  $op${"options": ["Gastric acid converts a proenzyme and releases hydrogen", "Hepatic bile pigment is changed into the brown stool color", "Fundic endocrine cells release the pre-meal hunger signal", "Pancreatic duct cells secrete bicarbonate into the duodenum", "Colonic bacteria ferment sugar his intestine did not split"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "lactase-hydrogen-breath", "taskCategory": "mechanism"}$op$,
  $ky$Colonic bacteria ferment sugar his intestine did not split$ky$,
  $ex$The best choice is "Colonic bacteria ferment sugar his intestine did not split". Without enough lactase, lactose stays in the lumen and colonic bacteria ferment it, making gas, cramps, bloating, and diarrhea. Hydrogen from that fermentation is exhaled. Symptoms follow milk, spare dairy-free meals, and the stool has no blood or leukocytes. "Gastric acid converts a proenzyme and releases hydrogen" is not the best choice because Acid activates pepsinogen. That reaction is not the source of exhaled hydrogen after milk. "Hepatic bile pigment is changed into the brown stool color" is not the best choice because Bacteria make stercobilin from bilirubin. That colors stool. It does not explain hydrogen breath after milk. "Fundic endocrine cells release the pre-meal hunger signal" is not the best choice because Ghrelin signals hunger before meals. It does not rise as exhaled hydrogen after dairy. "Pancreatic duct cells secrete bicarbonate into the duodenum" is not the best choice because Ductal bicarbonate buffers acid. It does not generate breath hydrogen after milk.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '6c7f90ca6b30e0f608f18401f6414565f9713ca22c43cf5353833afbeaf7598e', false, NOW(), NOW(), 2,
  'lactase-hydrogen-breath', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lactase-hydrogen-breath', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-040", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": true, "keyLetter": "E", "verifiedFact": "If lactase is insufficient, colonic bacteria ferment undigested lactose, producing gas, cramps, bloating, and diarrhea. The hydrogen breath test detects hydrogen made by that fermentation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280041', 'usmle-step-1', 'anatomy',
  $sc$A 58-year-old man who repairs docks has a 12-cm segment of colon removed for a 2-cm polyp. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. The outer longitudinal muscle is gathered into three narrow bands, and tonic shortening of those bands pouches the wall. Small fat-filled tags of peritoneum hang from the bands. The rectal margin of the specimen has a complete longitudinal muscle coat and no pouches.$sc$,
  $qu$Which of the following produces the pouches along this colonic segment?$qu$,
  $op${"options": ["Tone in three longitudinal bands bunching the wall", "An inner oblique layer that is present only in the stomach", "Permanent circular ridges that spiral chyme in the jejunum", "A third muscle layer that churns food with acid", "Water absorption that concentrates fluid tenfold"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "teniae-coli-haustra", "taskCategory": "anatomy"}$op$,
  $ky$Tone in three longitudinal bands bunching the wall$ky$,
  $ex$The best choice is "Tone in three longitudinal bands bunching the wall". The three teniae coli are the longitudinal muscle of the colon. Their tone creates haustra. The specimen has three bands, pouches, and fat tags on the bands. The rectum lacks teniae and haustra, matching the rectal margin. "An inner oblique layer that is present only in the stomach" is not the best choice because The oblique layer is gastric. This specimen is colon, and the bands are longitudinal. "Permanent circular ridges that spiral chyme in the jejunum" is not the best choice because Circular folds are small-intestinal ridges. They are not three outer muscle bands. "A third muscle layer that churns food with acid" is not the best choice because Gastric oblique muscle churns food. It does not pouch the colon. "Water absorption that concentrates fluid tenfold" is not the best choice because The gallbladder concentrates bile. Colonic pouches are muscular, not a concentration effect.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '27d70785ec8cf8dc907c7a7c19400a4624e1daccb6e98a8723880e6259ba0231', false, NOW(), NOW(), 2,
  'teniae-coli-haustra', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'teniae-coli-haustra', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-041", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "A", "verifiedFact": "Teniae coli are three longitudinal muscle bands. Their tone pulls the colon into haustra. Epiploic appendages are fat-filled peritoneal sacs on the teniae."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280042', 'usmle-step-1', 'anatomy',
  $sc$A 70-year-old man who keeps a hardware store cannot delay stool once it reaches the last 4 cm of the canal, but he can still squeeze and hold if he concentrates. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 140/82 mm Hg. Examination shows the inner ring of the canal opening without his effort, while the outer ring remains under his control.$sc$,
  $qu$Which of the following muscle types form these two rings?$qu$,
  $op${"options": ["Inner skeletal muscle he can control, outer smooth muscle he cannot", "Inner smooth muscle he cannot control, outer skeletal muscle he can", "Two skeletal rings, and both are under voluntary control", "Two smooth rings, and neither is under voluntary control", "An inner cardiac-muscle ring plus an outer smooth-muscle ring"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "anal-sphincters-control", "taskCategory": "anatomy"}$op$,
  $ky$Inner smooth muscle he cannot control, outer skeletal muscle he can$ky$,
  $ex$The best choice is "Inner smooth muscle he cannot control, outer skeletal muscle he can". The internal anal sphincter is involuntary smooth muscle, and the external anal sphincter is voluntary skeletal muscle. His inner ring opens without effort and his outer ring still obeys him, over the last few centimeters of the canal. "Inner skeletal muscle he can control, outer smooth muscle he cannot" is not the best choice because That pairing reverses the two muscles. The inner ring is the one he cannot control. "Two skeletal rings, and both are under voluntary control" is not the best choice because Only the outer ring is skeletal. The inner ring opened without his effort. "Two smooth rings, and neither is under voluntary control" is not the best choice because The outer ring is still under his control, so it is not smooth muscle. "An inner cardiac-muscle ring plus an outer smooth-muscle ring" is not the best choice because Cardiac muscle is limited to the heart. Neither anal ring is cardiac muscle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '99ba057a40dc866af535da76d2d0eb4e79afe99644a6ddae4e86787bc09548ed', false, NOW(), NOW(), 2,
  'anal-sphincters-control', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'anal-sphincters-control', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-042", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "B", "verifiedFact": "The internal anal sphincter is smooth muscle and involuntary. The external anal sphincter is skeletal muscle and voluntary. Both stay closed except during defecation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280043', 'usmle-step-1', 'anatomy',
  $sc$A 46-year-old woman who grooms horses has a 6-mm lesion in the anal canal. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. A jagged line circles the canal just below the anal sinuses. Touch above that line is poorly felt. The same touch below the line is sharply painful. The lesion itself sits above the line.$sc$,
  $qu$Which of the following best explains the difference in pain across the line?$qu$,
  $op${"options": ["Somatic fibers supply the upper side and visceral fibers the lower side", "Both sides use the same visceral fibers, so pain should match", "Visceral fibers supply the upper side and somatic fibers the lower side", "Both sides use skeletal motor fibers, so pain should match", "The upper side is peritoneum and the lower side is colonic serosa"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "pectinate-line-sensation", "taskCategory": "anatomy"}$op$,
  $ky$Visceral fibers supply the upper side and somatic fibers the lower side$ky$,
  $ex$The best choice is "Visceral fibers supply the upper side and somatic fibers the lower side". The pectinate line divides hindgut mucosa above, innervated by visceral sensory fibers and relatively insensitive, from skin-side mucosa below, innervated by somatic sensory fibers and very sensitive. Touch above her line is dull and touch below is sharp, and the lesion is above the line. "Somatic fibers supply the upper side and visceral fibers the lower side" is not the best choice because That assignment reverses the fibers. The poorly felt side is the upper side. "Both sides use the same visceral fibers, so pain should match" is not the best choice because The two sides feel different, so they do not share one sensory supply. "Both sides use skeletal motor fibers, so pain should match" is not the best choice because Skeletal motor fibers move the external sphincter. They are not the sensory explanation for this line. "The upper side is peritoneum and the lower side is colonic serosa" is not the best choice because The anal canal is in the perineum, outside the abdominopelvic cavity. The line is not a peritoneal boundary.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '8fa56d00d23f341cbb39d7919785cdd2444db4dde18e654a8d9796d79117f986', false, NOW(), NOW(), 4,
  'pectinate-line-sensation', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'pectinate-line-sensation', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-043", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "C", "verifiedFact": "The pectinate line is the hindgut-skin junction. Mucosa above it is supplied by visceral sensory fibers and is relatively insensitive. Mucosa below it is supplied by somatic sensory fibers and is sensitive."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280044', 'usmle-step-1', 'microbiology',
  $sc$A 64-year-old woman who binds sheet music received a 10-day antibiotic course and then noted easy bruising. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 126/72 mm Hg. She eats green vegetables daily. A stool culture shows marked loss of the usual colonic organisms. Platelet count is 240,000/µL. A vitamin measured in blood, one normally made by those organisms, is low.$sc$,
  $qu$Which of the following vitamins depends on those colonic organisms?$qu$,
  $op${"options": ["The vitamin synthesized in sun-exposed skin", "The vitamin stored only in muscle as glycogen", "The vitamin that parietal cells secrete into the lumen", "The vitamin used for clotting-factor formation", "The vitamin absorbed only after gastric emulsification"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "colon-flora-vitamin-k", "taskCategory": "mechanism"}$op$,
  $ky$The vitamin used for clotting-factor formation$ky$,
  $ex$The best choice is "The vitamin used for clotting-factor formation". Colonic flora synthesize vitamin K, biotin, and pantothenic acid, and colonic enterocytes absorb those vitamins. Her flora are depleted after antibiotics, she bruises despite eating greens, and platelets are normal, so the missing bacterial vitamin is the one used in clotting. "The vitamin synthesized in sun-exposed skin" is not the best choice because Vitamin D is synthesized in skin exposed to sunlight. Colonic bacteria are not its source. "The vitamin stored only in muscle as glycogen" is not the best choice because Glycogen is a carbohydrate store, not a vitamin, and it is not made by colonic bacteria. "The vitamin that parietal cells secrete into the lumen" is not the best choice because Parietal cells secrete intrinsic factor, a glycoprotein, not a vitamin. Vitamin B12 comes from animal foods. "The vitamin absorbed only after gastric emulsification" is not the best choice because Fat-soluble vitamins are absorbed with lipids after bile salts emulsify fat. Emulsification is not gastric, and the low vitamin here tracks loss of colonic organisms.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology", "nutrition"]$tg$,
  's1-new-20261128-hidden', '36d736387a222404580f9ec7b6177b4f0bf2cfceff765bfb69e99883fcba965f', false, NOW(), NOW(), 2,
  'colon-flora-vitamin-k', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'colon-flora-vitamin-k', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-044", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": true, "keyLetter": "D", "verifiedFact": "Colonic bacteria synthesize biotin, pantothenic acid, and vitamin K. Enterocytes of the large intestine absorb vitamins those bacteria produce."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280045', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old man who loads moving vans feels a strong urge to pass stool within 15 minutes after he starts a large lunch. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Recordings show a powerful wave beginning in the mid-transverse colon and pushing contents toward the rectum. The same wave is absent on a morning when he skips breakfast.$sc$,
  $qu$Which of the following initiates this wave?$qu$,
  $op${"options": ["Back-and-forth small-bowel mixing that does not propel contents", "A pre-meal fundic hormone acting on the hypothalamus", "Voluntary skeletal contraction of the internal anal ring", "Acid inactivation of salivary starch digestion in the fundus", "A meal-related reflex that increases strong colonic contractions"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gastrocolic-mass-movement", "taskCategory": "mechanism"}$op$,
  $ky$A meal-related reflex that increases strong colonic contractions$ky$,
  $ex$The best choice is "A meal-related reflex that increases strong colonic contractions". Mass movements are strong waves that start about midway in the transverse colon and move contents toward the rectum, usually during or just after meals. The gastrocolic reflex is driven by gastric distention and small-bowel digestion. His wave matches that timing and is absent when he skips the meal. "Back-and-forth small-bowel mixing that does not propel contents" is not the best choice because Segmentation mixes small-bowel contents and does not propel them. This wave is a powerful colonic push. "A pre-meal fundic hormone acting on the hypothalamus" is not the best choice because Ghrelin rises before meals and stimulates hunger. It does not start a transverse-colon wave after lunch begins. "Voluntary skeletal contraction of the internal anal ring" is not the best choice because The internal anal sphincter is involuntary smooth muscle. It is not the colonic wave. "Acid inactivation of salivary starch digestion in the fundus" is not the best choice because Acid turns off salivary amylase in the stomach. That does not move the colon.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4046b6191b7776e9d208391a631bf38e7a1137687d6aefbb8974d12aaae262dc', false, NOW(), NOW(), 3,
  'gastrocolic-mass-movement', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gastrocolic-mass-movement', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-045", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "E", "verifiedFact": "Mass movements are strong colonic waves, usually three or four times a day during or just after meals. The gastrocolic reflex, provoked by gastric distention and by digestion in the small intestine, increases them."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280046', 'usmle-step-1', 'physiology',
  $sc$A 54-year-old woman who restores furniture has had the colon removed and a pouch made from small intestine. Temperature is 36.8°C, pulse is 82/min, respirations are 16/min, and blood pressure is 116/70 mm Hg. She stays well hydrated on an ordinary diet. Before the operation, studies showed that nine-tenths of the water she drank left the lumen before intestinal contents reached the cecum.$sc$,
  $qu$Which of the following best explains why she remains hydrated without a colon?$qu$,
  $op${"options": ["Most ingested water was already absorbed before the cecum", "The stomach absorbs nearly all ingested water with meals", "The gallbladder reabsorbs the water secreted in bile", "Colonic bacteria must be present or water cannot be absorbed", "The esophagus absorbs water across its stratified lining"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "small-bowel-absorbs-most-water", "taskCategory": "mechanism"}$op$,
  $ky$Most ingested water was already absorbed before the cecum$ky$,
  $ex$The best choice is "Most ingested water was already absorbed before the cecum". The small intestine absorbs about 90 percent of ingested water, and the colon absorbs most of what remains. Her preoperative study showed nine-tenths absorbed before the cecum, so removing the colon leaves the main water-absorbing organ in place. "The stomach absorbs nearly all ingested water with meals" is not the best choice because Little nutrient absorption, and not the bulk of water absorption, occurs in the stomach. The study placed the absorption before the cecum, which is the small bowel. "The gallbladder reabsorbs the water secreted in bile" is not the best choice because The gallbladder concentrates bile by absorbing some water from bile. It does not recover ingested drinking water. "Colonic bacteria must be present or water cannot be absorbed" is not the best choice because She remains hydrated after the colon, and its bacteria, were removed. The small bowel did the bulk of the absorption. "The esophagus absorbs water across its stratified lining" is not the best choice because The esophagus conducts food. It is not the site that absorbed nine-tenths of her water.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '3f0607a1741ca3e03281bb450d647ecb74fbd53bd936ea352285cb2f9e26ad5c', false, NOW(), NOW(), 3,
  'small-bowel-absorbs-most-water', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'small-bowel-absorbs-most-water', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-046", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "A", "verifiedFact": "The small intestine absorbs about 90 percent of ingested water. The large intestine absorbs most of the remainder. Of about 500 mL entering the cecum daily, about 150 mL remains as feces."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280047', 'usmle-step-1', 'nutrition',
  $sc$A 17-year-old boy who buses tables has trouble seeing when he walks home after dark. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. He avoids vegetables, eggs, milk, and liver. Daytime vision is intact, stools are not greasy, and a skin check shows dry rough patches on both forearms.$sc$,
  $qu$Which of the following deficient vitamin best fits the night vision and the skin?$qu$,
  $op${"options": ["A water-soluble vitamin used to make collagen", "A fat-soluble vitamin used for eye and epithelial health", "A water-soluble vitamin used to synthesize NAD", "A fat-soluble vitamin used for clotting-factor synthesis", "A water-soluble vitamin used as a cofactor in carboxylation"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "vitamin-a-night-blindness", "taskCategory": "mechanism"}$op$,
  $ky$A fat-soluble vitamin used for eye and epithelial health$ky$,
  $ex$The best choice is "A fat-soluble vitamin used for eye and epithelial health". Vitamin A is fat-soluble, supports eye development and epithelial health, and its deficiency causes night blindness and epithelial changes. He cannot see well in the dark, has rough dry skin, and avoids the foods that supply it, without greasy stools. "A water-soluble vitamin used to make collagen" is not the best choice because Vitamin C is water-soluble and is required for collagen. Deficiency causes bleeding gums and poor wound healing, not night blindness. "A water-soluble vitamin used to synthesize NAD" is not the best choice because Niacin is used to make NAD. Deficiency causes the dermatitis-diarrhea-dementia picture, not isolated night blindness. "A fat-soluble vitamin used for clotting-factor synthesis" is not the best choice because Vitamin K is used for clotting. Deficiency causes bleeding, not night blindness. "A water-soluble vitamin used as a cofactor in carboxylation" is not the best choice because Biotin is a water-soluble cofactor in carboxylation reactions. Deficiency is rare and is not night blindness. The option names a cofactor role that is not this patient's finding.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '759694c6af747ef9f77b8998fb4327455795fecc9f6604338c967e532f66d57d', false, NOW(), NOW(), 2,
  'vitamin-a-night-blindness', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vitamin-a-night-blindness', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-047", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "B", "verifiedFact": "Vitamin A supports eye and bone development and immune function. Deficiency causes night blindness and epithelial changes. It is fat-soluble and absorbed with lipids in chylomicrons. The body can make it from beta-carotene."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280048', 'usmle-step-1', 'nutrition',
  $sc$A 3-year-old girl who lives in a basement apartment has bowed legs and wrist swelling. Temperature is 36.7°C, pulse is 100/min, respirations are 22/min, and blood pressure is 90/56 mm Hg. She is rarely taken outside, drinks little milk, and has bone pain when she walks. Stools are formed and not greasy. Serum calcium is low.$sc$,
  $qu$Which of the following missing actions best explains the bone findings?$qu$,
  $op${"options": ["Cross-linking of collagen required for capillary strength", "Synthesis of clotting factors in hepatocytes", "Aid of calcium absorption needed for bone growth", "A cofactor used for DNA and protein synthesis", "Oxidation of fatty acids inside nerve membranes"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "vitamin-d-rickets", "taskCategory": "mechanism"}$op$,
  $ky$Aid of calcium absorption needed for bone growth$ky$,
  $ex$The best choice is "Aid of calcium absorption needed for bone growth". Vitamin D promotes calcium absorption and bone growth. Deficiency produces rickets, bone pain, and muscle weakness. She has bowed legs, wrist swelling, bone pain, low calcium, little sun, and little milk, with formed stools. "Cross-linking of collagen required for capillary strength" is not the best choice because Vitamin C is required for collagen. Deficiency causes bleeding gums and poor healing, not bowed legs with low calcium. "Synthesis of clotting factors in hepatocytes" is not the best choice because Vitamin K supports clotting factors. Deficiency causes bleeding, not rickets. "A cofactor used for DNA and protein synthesis" is not the best choice because Folate is required for DNA and protein synthesis. This child has bowed bones and low calcium, not a failure of DNA synthesis. "Oxidation of fatty acids inside nerve membranes" is not the best choice because Vitamin B12 supports fatty-acid oxidation and nerve function. This child has bone deformity and low calcium, not a nerve finding.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '073dafba1be6c1a62f845fd528307595dcee566375c59396dffcfa0d1cc06beb', false, NOW(), NOW(), 2,
  'vitamin-d-rickets', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vitamin-d-rickets', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-048", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "C", "verifiedFact": "Vitamin D aids calcium absorption and bone growth. Deficiency causes rickets, bone pain, and muscle weakness. It is obtained from diet and synthesized in sun-exposed skin. It is fat-soluble."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280049', 'usmle-step-1', 'nutrition',
  $sc$A 4-day-old boy born at home has oozing from the umbilical stump and a bruise over the scalp. Temperature is 36.9°C, pulse is 150/min, respirations are 40/min, and blood pressure is 70/40 mm Hg. He has not received an injection of any vitamin. His mother eats a mixed diet. Platelet count is 280,000/µL, and the stool is not pale.$sc$,
  $qu$Which of the following deficient vitamin best accounts for the bleeding?$qu$,
  $op${"options": ["A water-soluble vitamin required to build collagen", "A fat-soluble vitamin required for vision in dim light", "A water-soluble vitamin required to make NAD", "A fat-soluble vitamin required to build clotting factors", "A water-soluble vitamin required for thymidine synthesis"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "vitamin-k-bleeding", "taskCategory": "mechanism"}$op$,
  $ky$A fat-soluble vitamin required to build clotting factors$ky$,
  $ex$The best choice is "A fat-soluble vitamin required to build clotting factors". Vitamin K is required for clotting. Deficiency is a cause of hemorrhagic disease in newborns and is uncommon in adults who eat a mixed diet. This 4-day-old boy is bleeding, platelets are normal, and he has not received the vitamin. "A water-soluble vitamin required to build collagen" is not the best choice because Vitamin C is required for collagen. Scurvy is not the bleeding pattern of an untreated newborn with normal platelets. "A fat-soluble vitamin required for vision in dim light" is not the best choice because Vitamin A deficiency causes night blindness and epithelial change, not umbilical oozing. "A water-soluble vitamin required to make NAD" is not the best choice because Niacin deficiency causes pellagra. It does not produce this neonatal bleeding. "A water-soluble vitamin required for thymidine synthesis" is not the best choice because Folate is required for DNA synthesis, including thymidine. Deficiency impairs cell division rather than causing this clotting-factor pattern.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '340c2a099d4e7d6819e4c329ed0a14f12f6ca7a4af12e6dee96faffdae9cdacf', false, NOW(), NOW(), 2,
  'vitamin-k-bleeding', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vitamin-k-bleeding', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-049", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "D", "verifiedFact": "Vitamin K, a fat-soluble vitamin from leafy vegetables, is used for blood clotting and bone health. Deficiency causes bleeding and is uncommon in adults; newborns can develop hemorrhagic disease."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280050', 'usmle-step-1', 'nutrition',
  $sc$A 59-year-old man who lives alone eats mostly corn grits. Temperature is 36.8°C, pulse is 84/min, respirations are 16/min, and blood pressure is 128/74 mm Hg. He has a scaly rash on both forearms where the sun hits, three loose stools a day, and he no longer recognizes his sister. Hemoglobin is 13 g/dL. There is no night blindness.$sc$,
  $qu$Which of the following missing cofactor roles best fits all three problems?$qu$,
  $op${"options": ["Synthesis of collagen, with failure of wound strength", "Synthesis of clotting factors, with failure of hemostasis", "Absorption of calcium, with failure of bone mineralization", "Oxidation of odd-chain fatty acids inside myelin", "Synthesis of NAD, with failure of skin, gut, and cognition"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "niacin-pellagra", "taskCategory": "mechanism"}$op$,
  $ky$Synthesis of NAD, with failure of skin, gut, and cognition$ky$,
  $ex$The best choice is "Synthesis of NAD, with failure of skin, gut, and cognition". Niacin is required for NAD. Deficiency produces cracked scaly skin, diarrhea, and dementia together. He has the sun-exposed rash, loose stools, and failure to recognize his sister, without anemia or night blindness. "Synthesis of collagen, with failure of wound strength" is not the best choice because Vitamin C is required for collagen. Deficiency causes bleeding gums and poor healing, not this three-part picture. "Synthesis of clotting factors, with failure of hemostasis" is not the best choice because Vitamin K is required for clotting factors. He is not described as bleeding. "Absorption of calcium, with failure of bone mineralization" is not the best choice because Vitamin D is required for calcium absorption and bone. He has no bone finding. "Oxidation of odd-chain fatty acids inside myelin" is not the best choice because Vitamin B12 supports fatty-acid oxidation and nerves, and its deficiency causes large red cells. His hemoglobin is 13 g/dL, and the rash plus diarrhea are not the B12 picture.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '3b741b27525951ce7c51a1e5d83e20e53084bf4da5be15e663fe090b7f69788b', false, NOW(), NOW(), 2,
  'niacin-pellagra', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'niacin-pellagra', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-050", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "E", "verifiedFact": "Niacin is used to synthesize NAD and supports nerve function. Deficiency causes cracked scaly skin, dementia, and diarrhea, called pellagra."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280051', 'usmle-step-1', 'nutrition',
  $sc$A 52-year-old man who unloads freight has eaten polished rice and little else for 4 months. Temperature is 36.7°C, pulse is 96/min, respirations are 18/min, and blood pressure is 108/70 mm Hg. His legs are weak, the ankle reflexes are absent, and he is short of breath when he walks across the room. Memory for the morning's events is poor. Glucose in a random sample is 96 mg/dL.$sc$,
  $qu$Which of the following pathways loses its cofactor in this deficiency?$qu$,
  $op${"options": ["Carbohydrate metabolism, with the nerve picture of beriberi", "Collagen cross-linking, with bleeding from the gums", "Clotting-factor gamma-carboxylation in the liver", "NAD synthesis, with rash, diarrhea, and confusion together", "Calcium absorption from the lumen of the small intestine"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "thiamine-beriberi", "taskCategory": "mechanism"}$op$,
  $ky$Carbohydrate metabolism, with the nerve picture of beriberi$ky$,
  $ex$The best choice is "Carbohydrate metabolism, with the nerve picture of beriberi". Thiamine is required for carbohydrate metabolism. Deficiency produces beriberi and the Wernicke-Korsakoff picture. He has leg weakness, lost reflexes, breathlessness on walking, and poor memory on a polished-rice diet, with a normal random glucose. "Collagen cross-linking, with bleeding from the gums" is not the best choice because Vitamin C deficiency impairs collagen and causes gum bleeding and poor healing. Those are not his findings. "Clotting-factor gamma-carboxylation in the liver" is not the best choice because Vitamin K deficiency impairs clotting. He is not bleeding. "NAD synthesis, with rash, diarrhea, and confusion together" is not the best choice because Niacin deficiency causes pellagra, the rash-diarrhea-dementia triad. He has no scaly sun rash or diarrhea. "Calcium absorption from the lumen of the small intestine" is not the best choice because Vitamin D deficiency impairs calcium absorption and bone. He has nerve and exertional findings, not bone pain or bowed bones.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '0730fb6274aee92b255f832c600e6d6e7285ec3565c420e3839e97575e6db18e', false, NOW(), NOW(), 2,
  'thiamine-beriberi', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'thiamine-beriberi', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-051", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "A", "verifiedFact": "Thiamine is a cofactor in carbohydrate metabolism. Deficiency causes beriberi and Wernicke-Korsakoff syndrome."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280052', 'usmle-step-1', 'nutrition',
  $sc$A 28-year-old woman who is 10 weeks pregnant has eaten almost no greens or beans because of nausea. Temperature is 36.6°C, pulse is 88/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. Hemoglobin is 9.1 g/dL with large red cells. A smear shows no hypersegmented-neutrophil count reported, and she has no numbness. She asked which dietary factor is required for making DNA.$sc$,
  $qu$Which of the following is the role of the vitamin missing from her diet?$qu$,
  $op${"options": ["Carboxylation of clotting factors in hepatocytes", "A cofactor required for synthesis of DNA and protein", "Absorption of calcium from the intestinal lumen", "Cross-linking of collagen in capillary walls", "Emulsification of dietary triglyceride in the duodenum"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "folate-dna-synthesis", "taskCategory": "mechanism"}$op$,
  $ky$A cofactor required for synthesis of DNA and protein$ky$,
  $ex$The best choice is "A cofactor required for synthesis of DNA and protein". Folate is required for DNA and protein synthesis and is found in greens, beans, and enriched grains. She has avoided those foods, is early in pregnancy, and has large red cells without numbness. The question she asked is the DNA-synthesis role. "Carboxylation of clotting factors in hepatocytes" is not the best choice because Vitamin K is used to carboxylate clotting factors. She is not bleeding, and that vitamin is not the one tied to DNA synthesis. "Absorption of calcium from the intestinal lumen" is not the best choice because Vitamin D promotes calcium absorption. Her finding is large red cells, not bone disease. "Cross-linking of collagen in capillary walls" is not the best choice because Vitamin C is required for collagen cross-linking. She has no scurvy findings. "Emulsification of dietary triglyceride in the duodenum" is not the best choice because Bile salts emulsify triglyceride. They are not a vitamin required for DNA.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', '632465b39cb3a967f4fc0094537ddb5f2ce63c97875a34a7d257afdc18c17615', false, NOW(), NOW(), 3,
  'folate-dna-synthesis', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'folate-dna-synthesis', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-052", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "B", "verifiedFact": "Folate is required for DNA and protein synthesis. Deficiency causes poor growth and gastrointestinal problems, among other findings. It is water-soluble."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280053', 'usmle-step-1', 'nutrition',
  $sc$A 71-year-old woman who keeps archives has numbness in both feet and a hemoglobin of 8.8 g/dL with large red cells. Temperature is 36.5°C, pulse is 90/min, respirations are 16/min, and blood pressure is 132/74 mm Hg. She eats meat and eggs daily. Antibodies have destroyed the gastric cells that make the glycoprotein required for absorption of this vitamin. A separate vitamin used for DNA synthesis is normal.$sc$,
  $qu$Which of the following absorption failure explains the nerves and the red cells?$qu$,
  $op${"options": ["Lack of sunlight blocking synthesis of this vitamin in skin", "Absence of colonic bacteria that normally synthesize this vitamin", "Loss of the stomach product required to absorb this vitamin", "Failure of bile salts to emulsify this water-soluble vitamin", "Block of duodenal duct cells that secrete this vitamin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "b12-needs-intrinsic-factor", "taskCategory": "mechanism"}$op$,
  $ky$Loss of the stomach product required to absorb this vitamin$ky$,
  $ex$The best choice is "Loss of the stomach product required to absorb this vitamin". Vitamin B12 is required for red-cell production and nerve function, and deficiency damages nerves and causes pernicious anemia. Absorption requires intrinsic factor from gastric parietal cells. She eats animal foods, has numb feet and large red cells, and antibodies have removed the cells that make that glycoprotein. The DNA-synthesis vitamin, folate, is normal. "Lack of sunlight blocking synthesis of this vitamin in skin" is not the best choice because Vitamin D is synthesized in sun-exposed skin. B12 is not. "Absence of colonic bacteria that normally synthesize this vitamin" is not the best choice because Colonic bacteria synthesize vitamin K, biotin, and pantothenic acid, not the vitamin whose loss causes this nerve and red-cell picture in the presence of a normal diet. "Failure of bile salts to emulsify this water-soluble vitamin" is not the best choice because Bile salts emulsify fats and aid absorption of fat-soluble vitamins. B12 is water-soluble and depends on intrinsic factor. "Block of duodenal duct cells that secrete this vitamin" is not the best choice because Pancreatic duct cells secrete bicarbonate. They do not secrete this vitamin.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'd34e22853232e4950b6d65eff79c8fa092dcc7408fb193c27feab8adb8ec9b72', false, NOW(), NOW(), 3,
  'b12-needs-intrinsic-factor', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'b12-needs-intrinsic-factor', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-053", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "C", "verifiedFact": "Vitamin B12 supports red-cell production and nerve-cell function. Deficiency causes pernicious anemia and nerve damage. Section 23.4 states that intestinal absorption of B12 requires intrinsic factor."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280054', 'usmle-step-1', 'nutrition',
  $sc$A 44-year-old man who crews a fishing boat has eaten no fruit or vegetables for 5 months. Temperature is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. His gums bleed when he brushes, a 1-cm cut on his hand from 3 weeks ago is still open, and he bruises after light bumps. Night vision is normal, and the stool is brown.$sc$,
  $qu$Which of the following missing synthetic role best fits these findings?$qu$,
  $op${"options": ["Production of NAD for redox reactions in many cells", "Production of clotting factors that need gamma-carboxylation", "Production of rhodopsin for vision in dim light", "Production of collagen for connective tissue and wound repair", "Production of the brown pigment of stool by gut bacteria"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "vitamin-c-collagen", "taskCategory": "mechanism"}$op$,
  $ky$Production of collagen for connective tissue and wound repair$ky$,
  $ex$The best choice is "Production of collagen for connective tissue and wound repair". Vitamin C is required for collagen in connective tissue and for wound healing. Deficiency causes bleeding gums, slow healing, easy bruising, and scurvy. He has all three tissue findings after months without fruit or vegetables, with normal night vision and brown stool. "Production of NAD for redox reactions in many cells" is not the best choice because Niacin is required for NAD. Deficiency adds diarrhea and dementia to a rash. He does not have that picture. "Production of clotting factors that need gamma-carboxylation" is not the best choice because Vitamin K is required for clotting-factor carboxylation. His stool is brown, so bile pigment is reaching the gut, and the findings are gum bleeding plus a wound that will not heal, the collagen pattern. "Production of rhodopsin for vision in dim light" is not the best choice because Vitamin A is required for dim-light vision. His night vision is normal. "Production of the brown pigment of stool by gut bacteria" is not the best choice because Bacteria convert bilirubin to stercobilin. His stool is already brown, so that step is occurring.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'c687285d13fa1530e604d6b8a7ac491bc058bf70c53a6d9838cbc56c414daaad', false, NOW(), NOW(), 2,
  'vitamin-c-collagen', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vitamin-c-collagen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-054", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "D", "verifiedFact": "Vitamin C is required to produce collagen for connective tissue, teeth, and wound healing. Deficiency causes bleeding gums, poor healing, easy bruising, and scurvy. It is water-soluble."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280055', 'usmle-step-1', 'nutrition',
  $sc$A 36-year-old woman who coaches diving has taken 20 times the usual dose of a fat-soluble vitamin capsule every day for 8 months. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The vitamin is absorbed only when dietary fat is absorbed. A different capsule, a water-soluble vitamin she also overuses, is largely recovered in a 24-hour urine collection.$sc$,
  $qu$Which of the following best explains the different fates of the two vitamins?$qu$,
  $op${"options": ["The water-soluble vitamin is stored in body fat for months", "Both leave only in bile and neither can accumulate", "Both need a gastric cofactor and neither appears in urine", "The fat-soluble vitamin is made only by colonic bacteria", "The fat-soluble vitamin can accumulate in body fat"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "fat-soluble-stored", "taskCategory": "mechanism"}$op$,
  $ky$The fat-soluble vitamin can accumulate in body fat$ky$,
  $ex$The best choice is "The fat-soluble vitamin can accumulate in body fat". Fat-soluble vitamins A, D, E, and K are absorbed with lipids and can accumulate in fat stores, so excess can cause hypervitaminosis. Water-soluble B vitamins and vitamin C are excreted in urine and are not stored. Her fat-soluble capsule depends on fat absorption, and the water-soluble one appears in the 24-hour urine. "The water-soluble vitamin is stored in body fat for months" is not the best choice because Water-soluble vitamins are not stored in fat. They move into body water and excess leaves in urine. "Both leave only in bile and neither can accumulate" is not the best choice because The urine collection recovered the water-soluble vitamin, so it is not true that neither can leave in urine or that both leave only in bile. "Both need a gastric cofactor and neither appears in urine" is not the best choice because Intrinsic factor is required for vitamin B12, not for every vitamin. The water-soluble vitamin was recovered in urine. "The fat-soluble vitamin is made only by colonic bacteria" is not the best choice because Colonic bacteria synthesize vitamin K, biotin, and pantothenic acid. A capsule absorbed with dietary fat is not defined as a bacterial product.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "nutrition", "nutrition"]$tg$,
  's1-new-20261128-hidden', 'd74a5bd292ed1dcbaf853dfd1163ad1275fbb8b14427534d7159a10786a95a36', false, NOW(), NOW(), 3,
  'fat-soluble-stored', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'fat-soluble-stored', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-055", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet", "nutrition": true, "keyLetter": "E", "verifiedFact": "Vitamins A, D, E, and K are absorbed with lipids in chylomicrons and can accumulate in body fat, so excess can cause hypervitaminosis. B vitamins and vitamin C are excreted in urine and are not stored, so excess is rarely toxic except from supplements."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280056', 'usmle-step-1', 'microbiology',
  $sc$A 23-year-old woman who waits tables and four coworkers develop vomiting 3 hours after a picnic. Temperature is 36.8°C, pulse is 90/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. The potato salad sat in the sun for 5 hours. No one is still febrile the next morning, and symptoms fade within 24 hours. Culture of the salad grows a gram-positive coccus, but reheating the salad to boiling does not destroy the activity that caused the vomiting.$sc$,
  $qu$Which of the following best classifies this illness?$qu$,
  $op${"options": ["Toxin was already formed in the food before anyone ate it", "The organism had to colonize the colon before making toxin", "A virus invaded the epithelium and then made an exotoxin", "A preformed toxin required 3 days of bacterial growth in the ileum", "The illness required invasion of the bloodstream before vomiting"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "intoxication-versus-infection", "taskCategory": "mechanism"}$op$,
  $ky$Toxin was already formed in the food before anyone ate it$ky$,
  $ex$The best choice is "Toxin was already formed in the food before anyone ate it". Intoxication means the toxin was produced in the food before ingestion. Vomiting began at 3 hours, the salad sat warm for 5 hours, several people were affected, symptoms faded within a day, and boiling did not destroy the activity. That is preformed toxin, not a requirement for colonization. "The organism had to colonize the colon before making toxin" is not the best choice because Infection means the organism is ingested, colonizes, and then makes toxin. A 3-hour onset in several people, with toxin that survives boiling, is the foodborne pattern instead. "A virus invaded the epithelium and then made an exotoxin" is not the best choice because The culture grew a gram-positive coccus. A virus does not grow as that colony, and the activity survived boiling in the food. "A preformed toxin required 3 days of bacterial growth in the ileum" is not the best choice because The vomiting started at 3 hours, so the toxin did not need 3 days of growth after ingestion. "The illness required invasion of the bloodstream before vomiting" is not the best choice because Vomiting at 3 hours with a negative bloodstream story is not bacteremia. The source of illness is the food.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', 'e9d8d2d807a0d824960ec71fee28668caade9ac5517cdd54360ebe354210dd00', false, NOW(), NOW(), 3,
  'intoxication-versus-infection', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'intoxication-versus-infection', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-056", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "A", "verifiedFact": "In an intoxication, toxin is made in the food before it is eaten. In an infection, the organism colonizes the gut and then makes toxin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280057', 'usmle-step-1', 'microbiology',
  $sc$A 19-year-old man who works a deli eats ham that was sliced, left at room temperature for 6 hours, and then boiled. Temperature is 36.9°C, pulse is 88/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Vomiting starts 2 hours later. No gram-positive cocci grow from the boiled ham, but a protein extracted from it still provokes vomiting and drives widespread T-cell proliferation in a lab assay.$sc$,
  $qu$Which of the following best explains the vomiting after the bacteria were killed?$qu$,
  $op${"options": ["Live organisms must still be invading the colonic mucosa", "A heat-stable protein toxin remains and can activate many T cells", "A heat-labile toxin increased cyclic AMP and was destroyed by boiling", "Shiga toxin blocked the large ribosomal subunit in the endothelium", "A spore germinated in the intestine and then made a new toxin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "staph-enterotoxin-heat-stable", "taskCategory": "mechanism"}$op$,
  $ky$A heat-stable protein toxin remains and can activate many T cells$ky$,
  $ex$The best choice is "A heat-stable protein toxin remains and can activate many T cells". Staphylococcal enterotoxins resist acid and boiling at 100°C. The bacteria can be dead while the toxin still causes vomiting, and at least part of the effect is superantigen-driven T-cell proliferation. No cocci grew after boiling, the protein remained active, and the assay showed T-cell proliferation. "Live organisms must still be invading the colonic mucosa" is not the best choice because No organisms grew from the boiled ham, so live mucosal invasion is not required for this vomiting. "A heat-labile toxin increased cyclic AMP and was destroyed by boiling" is not the best choice because A heat-labile cyclic AMP toxin would not survive boiling. This protein did. "Shiga toxin blocked the large ribosomal subunit in the endothelium" is not the best choice because Shiga toxin inhibits protein synthesis in endothelial cells. It is not the protein that drove T-cell proliferation in this ham extract. "A spore germinated in the intestine and then made a new toxin" is not the best choice because Spore-forming rods such as Bacillus or Clostridium are a different mechanism. This extract is a protein that survived boiling and activated T cells, with no growth of cocci.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', 'b4fd3572187c7d682ab2b27379574f3ccd84da5f4239b690577286ec7540bf28', false, NOW(), NOW(), 3,
  'staph-enterotoxin-heat-stable', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'staph-enterotoxin-heat-stable', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-057", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "B", "verifiedFact": "Staphylococcal enterotoxins are acid-resistant and heat-stable at 100\u00b0C. The organism may be killed while the toxin still causes vomiting. At least some symptoms come from superantigen activity."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280058', 'usmle-step-1', 'microbiology',
  $sc$A 6-year-old boy who attends day camp has fever, cramps, and stool that contains blood and mucus. Temperature is 38.9°C, pulse is 120/min, respirations are 24/min, and blood pressure is 96/60 mm Hg. A gram-negative rod invades epithelial cells, leaves the phagosome, and multiplies in the cytoplasm, then spreads to the next cell. Its toxin binds a surface glycolipid and stops protein synthesis by acting on the large ribosomal subunit.$sc$,
  $qu$Which of the following is the intracellular behavior of this organism?$qu$,
  $op${"options": ["It remains inside the macrophage phagosome and does not escape", "It never enters cells and only makes toxin in food", "It exits the vesicle and moves into the neighboring cell", "It is limited to the stomach, where urease makes ammonia", "It forms a pedestal and does not make a ribosomal toxin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "shigella-escapes-phagosome", "taskCategory": "mechanism"}$op$,
  $ky$It exits the vesicle and moves into the neighboring cell$ky$,
  $ex$The best choice is "It exits the vesicle and moves into the neighboring cell". Shigella invades epithelium, escapes the phagosome, multiplies in the cytoplasm, and moves into adjacent cells. Its Shiga toxin binds a glycosphingolipid and inhibits protein synthesis on the large ribosomal subunit. The boy's bloody mucus stool and this cell behavior match that description. "It remains inside the macrophage phagosome and does not escape" is not the best choice because Salmonella can persist inside phagosomes. This organism leaves the phagosome. "It never enters cells and only makes toxin in food" is not the best choice because A preformed food toxin does not invade cells or escape a phagosome. This rod does both. "It is limited to the stomach, where urease makes ammonia" is not the best choice because Helicobacter lives in the stomach and makes urease. This illness is invasive colitis with a ribosomal toxin. "It forms a pedestal and does not make a ribosomal toxin" is not the best choice because Enteropathogenic E. coli forms pedestals and lacks Shiga toxin. This organism makes a toxin that hits the large ribosomal subunit.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '82ceb9be0f7eabc45f2968af72f59cbe137889c50903dd4d805333b386dda7d6', false, NOW(), NOW(), 4,
  'shigella-escapes-phagosome', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'shigella-escapes-phagosome', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-058", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "C", "verifiedFact": "Shigella invades epithelium, escapes the phagosome, and lives in the cytoplasm or moves into adjacent cells. Shiga toxin binds a glycosphingolipid and inhibits protein synthesis on the large ribosomal subunit."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280059', 'usmle-step-1', 'microbiology',
  $sc$A 14-year-old girl who feeds the family chickens has fever and nonbloody diarrhea 18 hours after a raw egg. Temperature is 38.4°C, pulse is 104/min, respirations are 18/min, and blood pressure is 104/66 mm Hg. A gram-negative rod crosses the epithelium through cells overlying lymphoid aggregates, then survives inside the phagosomes of macrophages. It does not escape into the cytoplasm.$sc$,
  $qu$Which of the following is the entry and survival pattern shown here?$qu$,
  $op${"options": ["Escape from the phagosome out into the cytoplasm", "Toxin made in the kitchen before the egg was eaten", "Urease activity that neutralizes acid inside the stomach", "Entry across the lymphoid dome and persistence in the vesicle", "A chloride-channel toxin that does not invade cells"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "salmonella-m-cell-phagosome", "taskCategory": "mechanism"}$op$,
  $ky$Entry across the lymphoid dome and persistence in the vesicle$ky$,
  $ex$The best choice is "Entry across the lymphoid dome and persistence in the vesicle". Salmonella crosses the mucosa via M cells over lymphoid tissue and can persist inside macrophage phagosomes. She ate a raw egg, and the rod uses that entry and stays in the phagosome. "Escape from the phagosome out into the cytoplasm" is not the best choice because Escape into the cytoplasm is the Shigella pattern. This organism does not leave the phagosome. "Toxin made in the kitchen before the egg was eaten" is not the best choice because Preformed toxin causes rapid vomiting without this intracellular survival. Onset here is 18 hours with fever and cellular invasion. "Urease activity that neutralizes acid inside the stomach" is not the best choice because Urease is how Helicobacter tolerates gastric acid. This rod is invading intestinal epithelium. "A chloride-channel toxin that does not invade cells" is not the best choice because Cholera toxin opens a chloride channel and does not use this invasive phagosome pattern.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', 'e6f37904082b8f69ddcfeeaf6b63e2e92fa0a02751433494020a8a7120f63267', false, NOW(), NOW(), 3,
  'salmonella-m-cell-phagosome', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'salmonella-m-cell-phagosome', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-059", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "D", "verifiedFact": "Nontyphoidal Salmonella penetrates the mucosa through M cells and can persist inside macrophage phagosomes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280060', 'usmle-step-1', 'microbiology',
  $sc$A 32-year-old man who is visiting relatives has sudden watery diarrhea so large that the stool looks like cloudy water, beginning 1 day after he drank untreated river water. Temperature is 36.4°C, pulse is 124/min, respirations are 22/min, and blood pressure is 88/54 mm Hg. A curved gram-negative rod makes an A-B toxin. Inside enterocytes cyclic AMP rises, a chloride channel opens, and water follows the ions into the lumen. There is no blood in the stool.$sc$,
  $qu$Which of the following is the direct result of the rise in cyclic AMP?$qu$,
  $op${"options": ["The large ribosomal subunit stops making protein", "Many T cells proliferate as if a superantigen were present", "The organism escapes the phagosome and spreads laterally", "Ammonia is released and gastric acid is neutralized", "Salt ions exit and water is drawn into the bowel lumen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "cholera-camp-chloride", "taskCategory": "mechanism"}$op$,
  $ky$Salt ions exit and water is drawn into the bowel lumen$ky$,
  $ex$The best choice is "Salt ions exit and water is drawn into the bowel lumen". Cholera toxin acts through adenylate cyclase, raises cyclic AMP, opens a chloride channel, and water follows into the lumen. He has massive watery stool without blood, a curved gram-negative rod, and that sequence. "The large ribosomal subunit stops making protein" is not the best choice because Shiga toxin inhibits protein synthesis on the large ribosomal subunit. It does not raise cyclic AMP. "Many T cells proliferate as if a superantigen were present" is not the best choice because Staphylococcal enterotoxin can act as a superantigen. It does not open an enterocyte chloride channel. "The organism escapes the phagosome and spreads laterally" is not the best choice because Shigella escapes the phagosome. Cholera toxin acts from organisms that attach and secrete toxin, and this stool is watery rather than invasive. "Ammonia is released and gastric acid is neutralized" is not the best choice because Helicobacter urease generates ammonia in the stomach. It does not produce this cyclic AMP diarrhea.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '0c63ffad07d003c096a491cd38d1de4f471ed9daf6a8233c6a9c0f448659ef1d', false, NOW(), NOW(), 3,
  'cholera-camp-chloride', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cholera-camp-chloride', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-060", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "E", "verifiedFact": "Cholera toxin is an A-B toxin that acts through adenylate cyclase, raises cAMP, opens a chloride channel, and pulls water into the lumen."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280061', 'usmle-step-1', 'microbiology',
  $sc$A 5-year-old girl who visited a petting zoo has bloody diarrhea without fever. Temperature is 37.2°C, pulse is 110/min, respirations are 22/min, and blood pressure is 100/64 mm Hg. The stool isolate is a gram-negative rod that does not ferment sorbitol and carries a toxin gene obtained from a dysentery organism. The toxin gene sits in a prophage. A resident asks why an antibiotic might make kidney failure more likely.$sc$,
  $qu$Which of the following is the reason an antibiotic can worsen this illness?$qu$,
  $op${"options": ["Killing the bacteria releases more of the phage-encoded toxin", "The drug increases cyclic AMP and opens a chloride channel", "The drug is itself a superantigen that activates T cells", "The drug destroys colonic bacteria that make vitamin K", "The drug blocks intrinsic factor and causes nerve injury"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "ehec-toxin-release-hus", "taskCategory": "mechanism"}$op$,
  $ky$Killing the bacteria releases more of the phage-encoded toxin$ky$,
  $ex$The best choice is "Killing the bacteria releases more of the phage-encoded toxin". EHEC carries Shiga-like toxin genes that came from Shigella by transduction, and the toxin is phage-encoded. Antibiotics are not recommended because killing the bacteria releases toxin and can worsen hemolytic uremic syndrome. She has bloody diarrhea, a non-sorbitol-fermenting rod, and that toxin gene. "The drug increases cyclic AMP and opens a chloride channel" is not the best choice because Cyclic AMP and a chloride channel describe cholera toxin, which causes watery diarrhea, not this bloody illness. "The drug is itself a superantigen that activates T cells" is not the best choice because Superantigen activity is a feature of staphylococcal enterotoxin. It is not why an antibiotic worsens this infection. "The drug destroys colonic bacteria that make vitamin K" is not the best choice because Loss of vitamin K-producing flora can affect clotting after a long antibiotic course. It is not the reason this toxin-mediated kidney injury worsens. "The drug blocks intrinsic factor and causes nerve injury" is not the best choice because Intrinsic factor is a gastric glycoprotein. Antibiotics do not block it, and the risk named here is toxin release.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '72a4042f27d02e5296a5c4646708e465b9e72198529f808227d3fd0aba038aa9', false, NOW(), NOW(), 4,
  'ehec-toxin-release-hus', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ehec-toxin-release-hus', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-061", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "A", "verifiedFact": "EHEC makes Shiga-like toxin acquired from Shigella. Antibiotics are not recommended because killing the bacteria releases toxin and may worsen hemolytic uremic syndrome."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280062', 'usmle-step-1', 'microbiology',
  $sc$A 47-year-old man who drives a snowplow has burning epigastric pain for 2 months. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. Endoscopy shows a 1-cm duodenal ulcer. He swallows urea labeled with a carbon isotope. Labeled carbon dioxide appears in his breath 20 minutes later. Gastric mucus over the ulcer is thin.$sc$,
  $qu$Which of the following bacterial activity produced the labeled carbon dioxide?$qu$,
  $op${"options": ["Raising cyclic AMP and opening a chloride channel", "Splitting urea to ammonia, which also buffers local acid", "Blocking protein synthesis on the large ribosomal subunit", "Acting as a superantigen after surviving boiling", "Invading through M cells and staying in the phagosome"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "h-pylori-urease", "taskCategory": "mechanism"}$op$,
  $ky$Splitting urea to ammonia, which also buffers local acid$ky$,
  $ex$The best choice is "Splitting urea to ammonia, which also buffers local acid". Helicobacter urease splits urea, releases ammonia that neutralizes acid, and the carbon from urea leaves as carbon dioxide that a breath test detects. He has a duodenal ulcer, thin mucus, and labeled carbon dioxide after labeled urea. "Raising cyclic AMP and opening a chloride channel" is not the best choice because Cholera toxin raises cyclic AMP. It does not liberate labeled carbon dioxide from swallowed urea. "Blocking protein synthesis on the large ribosomal subunit" is not the best choice because Shiga toxin blocks the ribosome. It does not split urea. "Acting as a superantigen after surviving boiling" is not the best choice because Staphylococcal enterotoxin can resist boiling and activate T cells. It is not a gastric urease. "Invading through M cells and staying in the phagosome" is not the best choice because Salmonella uses M cells and phagosomes. It does not explain a urea breath test.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '8061912e9d34272e9187efe58c853105fac0670487755d409be75cd04109382c', false, NOW(), NOW(), 2,
  'h-pylori-urease', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'h-pylori-urease', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-062", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "B", "verifiedFact": "H. pylori makes urease, which generates ammonia and neutralizes local acid, and it damages mucus-producing cells. A urea breath test detects labeled carbon dioxide from that reaction."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280063', 'usmle-step-1', 'microbiology',
  $sc$A 78-year-old woman who lives in a nursing home finished a 14-day antibiotic course 5 days ago and now has watery diarrhea and cramps. Temperature is 38.3°C, pulse is 102/min, respirations are 18/min, and blood pressure is 108/64 mm Hg. Colonoscopy shows yellow-white plaques of fibrin, dead epithelial cells, and leukocytes. The organism's toxins inactivate small GTP-binding proteins, actin condenses, and the cells round up and die.$sc$,
  $qu$Which of the following allowed this organism to overgrow?$qu$,
  $op${"options": ["A preformed toxin was boiled into leftover ham salad earlier", "Urease created an alkaline niche inside the stomach", "Antibiotics disrupted the flora that normally hold it in check", "A chloride-channel toxin was swallowed in river water", "M cells carried it into macrophages, where it stayed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "c-diff-gtpase-toxin", "taskCategory": "mechanism"}$op$,
  $ky$Antibiotics disrupted the flora that normally hold it in check$ky$,
  $ex$The best choice is "Antibiotics disrupted the flora that normally hold it in check". C. difficile can live quietly until antibiotics disrupt the normal flora, after which it overgrows. TcdA and TcdB inactivate small GTP-binding proteins, condense actin, and kill epithelium, producing a pseudomembrane of fibrin, dead cells, and leukocytes. She just finished 14 days of antibiotics and has those plaques. "A preformed toxin was boiled into leftover ham salad earlier" is not the best choice because Preformed staphylococcal toxin causes rapid vomiting. It does not form colonic plaques days after antibiotics. "Urease created an alkaline niche inside the stomach" is not the best choice because Urease is the Helicobacter mechanism in the stomach, not this colonic toxin. "A chloride-channel toxin was swallowed in river water" is not the best choice because Cholera toxin opens a chloride channel. It does not inactivate small GTP-binding proteins or form plaques. "M cells carried it into macrophages, where it stayed" is not the best choice because Salmonella survival in phagosomes is a different invasive pattern. This illness follows antibiotics and shows a toxin that collapses actin.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '7ca1bd5410f427fc0b66c47958823bc1ebea2fa9488a0a9edddcb015422d859e', false, NOW(), NOW(), 4,
  'c-diff-gtpase-toxin', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'c-diff-gtpase-toxin', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-063", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "C", "verifiedFact": "After antibiotics disrupt the flora, C. difficile overgrows. Toxins TcdA and TcdB inactivate small GTP-binding proteins, condense actin, kill cells, and can form a pseudomembrane."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280064', 'usmle-step-1', 'microbiology',
  $sc$A 20-year-old man who cooks in a dorm kitchen eats fried rice that was boiled, left on the counter for 8 hours, and then quickly reheated. Temperature is 36.6°C, pulse is 84/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Vomiting starts 2 hours later. The rice grows a gram-positive rod that forms spores. Two different toxins are identified, one linked to vomiting and one linked to diarrhea.$sc$,
  $qu$Which of the following best explains the illness after reheating?$qu$,
  $op${"options": ["A heat-stable coccal toxin was the only protein in the rice", "The rod had to escape a phagosome before any toxin was made", "Urease from a gastric organism alkalinized the rice", "Spores survived cooking and toxin formed while the rice sat out", "A phage-encoded ribosomal toxin was released by an antibiotic"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "bacillus-cereus-rice-spores", "taskCategory": "mechanism"}$op$,
  $ky$Spores survived cooking and toxin formed while the rice sat out$ky$,
  $ex$The best choice is "Spores survived cooking and toxin formed while the rice sat out". Bacillus cereus spores survive cooking. When rice is left warm, the organism makes toxins, one causing vomiting and one causing diarrhea. The rice was boiled, left out 8 hours, reheated, and grew a spore-forming gram-positive rod with both toxins. "A heat-stable coccal toxin was the only protein in the rice" is not the best choice because Staphylococcal toxin is from a gram-positive coccus, not a spore-forming rod, and this rice grew a rod. "The rod had to escape a phagosome before any toxin was made" is not the best choice because Phagosome escape is the Shigella invasion pattern. This illness is toxin formed in food. "Urease from a gastric organism alkalinized the rice" is not the best choice because Urease is a gastric Helicobacter enzyme. It does not explain toxins in reheated rice. "A phage-encoded ribosomal toxin was released by an antibiotic" is not the best choice because Phage-encoded Shiga-like toxin is an EHEC mechanism, and no antibiotic was given.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', '9b74f3ad9026f04dbf23b5ec7c0f8235cf8274e41f155802140412bfb9b8bf49', false, NOW(), NOW(), 2,
  'bacillus-cereus-rice-spores', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bacillus-cereus-rice-spores', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-064", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "D", "verifiedFact": "B. cereus spores survive cooking. In rice and other foods left warm, the organism makes enterotoxins. One toxin causes vomiting and another causes diarrhea."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280065', 'usmle-step-1', 'microbiology',
  $sc$A 25-year-old man who grills chicken has fever and diarrhea for 3 days. Temperature is 38.2°C, pulse is 96/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. A curved gram-negative rod grows at 42°C in low oxygen. Ten days after the diarrhea ends, both legs become weak and the reflexes disappear. The organism's toxin is a DNase that permanently damages host-cell DNA.$sc$,
  $qu$Which of the following is the action of the toxin described here?$qu$,
  $op${"options": ["A rise in enterocyte cyclic AMP after ADP-ribosylation", "Inactivation of small GTP-binding proteins with actin collapse", "Superantigen-driven proliferation of many T cells", "Cleavage of ribosomal RNA that stops protein synthesis", "Irreversible damage to host-cell DNA by a nuclease"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "campylobacter-cdt-dnase", "taskCategory": "mechanism"}$op$,
  $ky$Irreversible damage to host-cell DNA by a nuclease$ky$,
  $ex$The best choice is "Irreversible damage to host-cell DNA by a nuclease". Campylobacter cytolethal distending toxin is a DNase that irreversibly damages host DNA. The organism is a curved gram-negative rod that grows at 42°C in low oxygen, and the illness is associated with later Guillain-Barré syndrome. His diarrhea, culture conditions, toxin, and later paralysis fit that organism. "A rise in enterocyte cyclic AMP after ADP-ribosylation" is not the best choice because Raising cyclic AMP is cholera toxin. It does not nick host DNA. "Inactivation of small GTP-binding proteins with actin collapse" is not the best choice because Inactivating small GTP-binding proteins is the C. difficile toxin mechanism. "Superantigen-driven proliferation of many T cells" is not the best choice because Superantigen activity describes staphylococcal enterotoxin, not this DNase. "Cleavage of ribosomal RNA that stops protein synthesis" is not the best choice because Halting protein synthesis on the ribosome is Shiga toxin, not a DNase.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "microbiology"]$tg$,
  's1-new-20261128-hidden', 'e81e892c91ac3e1c16c52b719d52b2a9be0a9acbdc99f1d2977828380840b64e', false, NOW(), NOW(), 4,
  'campylobacter-cdt-dnase', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.", "url": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'campylobacter-cdt-dnase', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-065", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract", "nutrition": false, "keyLetter": "E", "verifiedFact": "Campylobacter jejuni is linked to Guillain-Barr\u00e9 syndrome. Many strains make cytolethal distending toxin, a DNase that irreversibly damages host DNA."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280066', 'usmle-step-1', 'anatomy',
  $sc$A 63-year-old man who upholsters chairs has laparoscopy for a 2-cm abdominal-wall hernia. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 134/80 mm Hg. A fatty peritoneal apron lies in front of the small intestine and the transverse colon. It is not the fold that ties the liver to the anterior abdominal wall.$sc$,
  $qu$Which of the following is this fatty apron?$qu$,
  $op${"options": ["The fold lying in front of the intestine and transverse colon", "The fold that anchors the liver to the anterior wall", "The vertical band that tethers jejunum and ileum posteriorly", "The fold from the liver to the lesser curvature of the stomach", "The mesentery of the transverse and sigmoid colon only"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "greater-omentum-apron", "taskCategory": "anatomy"}$op$,
  $ky$The fold lying in front of the intestine and transverse colon$ky$,
  $ex$The best choice is "The fold lying in front of the intestine and transverse colon". The greater omentum is the apron superficial to the small intestine and transverse colon and a place where fat is stored. The surgeon sees that apron and has already excluded the liver's anterior fold. "The fold that anchors the liver to the anterior wall" is not the best choice because The falciform ligament anchors the liver to the anterior abdominal wall. The vignette says this apron is not that fold. "The vertical band that tethers jejunum and ileum posteriorly" is not the best choice because The mesentery is the vertical band that anchors jejunum and ileum. It is not an apron in front of the transverse colon. "The fold from the liver to the lesser curvature of the stomach" is not the best choice because The lesser omentum runs from the liver to the lesser curvature. It is not the fatty apron over the intestine. "The mesentery of the transverse and sigmoid colon only" is not the best choice because The mesocolon attaches the transverse and sigmoid colon. It is not the apron lying superficial to them.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'b9bb1f911dcb82aa6e2369832065d4c5504848221e8eadecbd2f3799fa8ffb09', false, NOW(), NOW(), 2,
  'greater-omentum-apron', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'greater-omentum-apron', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-066", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "A", "verifiedFact": "The greater omentum is an apron-like fold superficial to the small intestine and transverse colon and a site of fat storage."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280067', 'usmle-step-1', 'anatomy',
  $sc$A 41-year-old woman who teaches ceramics has a 3-cm mass at the start of the small intestine, just after the stomach. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. At operation that first segment lies behind the peritoneum and is fixed. A loop 40 cm farther along is free and hung from a vertical peritoneal band attached to the posterior wall.$sc$,
  $qu$Which of the following accounts for the difference between the two segments?$qu$,
  $op${"options": ["Both segments hang inside the fatty apron over the bowel", "Only the first segment stays fixed outside the peritoneal sac", "The free loop is fixed by the liver's anterior fold", "The first segment is mobile and the downstream loop is not", "Both segments lack any peritoneal attachment at all"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "mesentery-jejunum-ileum", "taskCategory": "anatomy"}$op$,
  $ky$Only the first segment stays fixed outside the peritoneal sac$ky$,
  $ex$The best choice is "Only the first segment stays fixed outside the peritoneal sac". The duodenum is retroperitoneal, and the mesentery anchors the rest of the small intestine. The mass is in the first segment, which is fixed behind the peritoneum, while the loop 40 cm downstream hangs from the posterior band. "Both segments hang inside the fatty apron over the bowel" is not the best choice because The greater omentum is an apron over the intestine. It is not the band that frees one segment and fixes the other. "The free loop is fixed by the liver's anterior fold" is not the best choice because The falciform ligament anchors the liver, not a jejunal loop. "The first segment is mobile and the downstream loop is not" is not the best choice because The first segment is the fixed, retroperitoneal one. The downstream loop is the mobile one. "Both segments lack any peritoneal attachment at all" is not the best choice because The downstream loop has a peritoneal band. It is not unattached.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '558889f4f16cfd8095103af9c9044e3b6fcb2538dc739dbed0a5cceb7ee42b82', false, NOW(), NOW(), 3,
  'mesentery-jejunum-ileum', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'mesentery-jejunum-ileum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-067", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "B", "verifiedFact": "The mesentery anchors all of the small intestine except the duodenum. The duodenum, pancreas, ascending colon, descending colon, and rectum are retroperitoneal."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280068', 'usmle-step-1', 'anatomy',
  $sc$A 68-year-old man who repairs watches has pain 30 minutes after meals and a 5-kg weight loss. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 150/86 mm Hg. Angiography shows a tight narrowing of the artery that is the main supply of the jejunum and ileum. The artery to the liver and stomach is open. Veins beside the narrowed artery still join a vessel that enters the liver.$sc$,
  $qu$Which of the following is the main territory of the narrowed artery?$qu$,
  $op${"options": ["Liver and stomach, with no direct supply to the jejunum", "Descending colon and rectum, and not the small bowel", "Jejunum and ileum, with venous blood still reaching the liver", "Both kidneys and both ureters, rather than a gut artery", "The spleen alone, by way of the short gastric branches"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "sma-small-bowel", "taskCategory": "anatomy"}$op$,
  $ky$Jejunum and ileum, with venous blood still reaching the liver$ky$,
  $ex$The best choice is "Jejunum and ileum, with venous blood still reaching the liver". The superior mesenteric artery is the main supply of the small intestine, and the superior mesenteric vein drains into the portal vein and the liver. The liver-and-stomach artery is open, and the narrowed vessel is the one to jejunum and ileum. "Liver and stomach, with no direct supply to the jejunum" is not the best choice because The celiac trunk supplies liver and stomach and is described as open. "Descending colon and rectum, and not the small bowel" is not the best choice because The inferior mesenteric artery supplies the distal colon. The vignette specifies jejunum and ileum. "Both kidneys and both ureters, rather than a gut artery" is not the best choice because Renal arteries are paired and do not drain into the portal vein. "The spleen alone, by way of the short gastric branches" is not the best choice because Short gastric arteries are not the main supply of the jejunum and ileum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '39b142d4ceb0c8cdd879d1d83e3c7df4fa35b7edd6771f7bef1f9e1c33dd7447', false, NOW(), NOW(), 3,
  'sma-small-bowel', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'sma-small-bowel', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-068", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "C", "verifiedFact": "The superior mesenteric artery is the main arterial supply of the small intestine. Its veins drain to the superior mesenteric vein and then the hepatic portal vein."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280069', 'usmle-step-1', 'pathology',
  $sc$A 52-year-old man who drives a cement mixer has sudden severe abdominal pain. Temperature is 38.1°C, pulse is 118/min, respirations are 24/min, and blood pressure is 96/60 mm Hg. The abdomen is rigid. An upright film shows free air under the diaphragm. At operation a hole in the anterior stomach wall is spilling acidic fluid into the peritoneal cavity. The fluid has no blood.$sc$,
  $qu$Which of the following is the immediate cause of the rigid abdomen?$qu$,
  $op${"options": ["Blood filling that same space from a ruptured spleen", "Lymphoid aggregates enlarging in the final small-bowel part", "Failure of bile salts to be taken up in the final segment", "Gastric juice spilled onto the serosal lining around the organs", "Loss of the extra inner muscle layer of the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "perforated-ulcer-peritonitis", "taskCategory": "mechanism"}$op$,
  $ky$Gastric juice spilled onto the serosal lining around the organs$ky$,
  $ex$The best choice is "Gastric juice spilled onto the serosal lining around the organs". When an ulcer perforates, gastric juice spills into the peritoneal cavity and causes chemical peritonitis. He has free air, a hole in the stomach, acidic fluid in the peritoneum, and a rigid abdomen. The fluid has no blood. "Blood filling that same space from a ruptured spleen" is not the best choice because Hemorrhagic peritonitis follows blood in the peritoneum, as from splenic injury. This fluid is acidic and bloodless. "Lymphoid aggregates enlarging in the final small-bowel part" is not the best choice because Peyer patches are lymphoid aggregates in the ileum. They do not spill acid or put free air under the diaphragm. "Failure of bile salts to be taken up in the final segment" is not the best choice because Loss of ileal bile-salt uptake causes greasy stools over time. It does not perforate the stomach. "Loss of the extra inner muscle layer of the stomach" is not the best choice because The oblique layer churns food. Its absence would not put free air and acid in the peritoneum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', '5727603930c432eca18308802f0d862293d9b21d6625673d1e0de02d7d824500', false, NOW(), NOW(), 2,
  'perforated-ulcer-peritonitis', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'perforated-ulcer-peritonitis', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-069", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "Chemical peritonitis follows a breach of the alimentary canal, for example when a gastric ulcer perforates and spills gastric juice into the peritoneal cavity."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280070', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old woman who designs typefaces is studied after a protein meal. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. When luminal pH in the stomach reaches 1.6, acid secretion stops and mucus secretion rises. Parietal cells are still present on biopsy.$sc$,
  $qu$Which of the following is this response to the very low pH?$qu$,
  $op${"options": ["Acid secretion rises further until the pH reaches 0.5", "Pepsinogen granules are released from parietal cells", "The hunger hormone from the fundus increases further", "Bile salts are newly synthesized inside chief cells", "Acid secretion pauses and mucus secretion increases"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "low-ph-stops-acid", "taskCategory": "mechanism"}$op$,
  $ky$Acid secretion pauses and mucus secretion increases$ky$,
  $ex$The best choice is "Acid secretion pauses and mucus secretion increases". When pH falls too low, the stomach suspends hydrochloric acid secretion and increases mucus. Her pH is 1.6, acid output has stopped, mucus has risen, and parietal cells are still present, so the cells were not lost. "Acid secretion rises further until the pH reaches 0.5" is not the best choice because The observed change is a stop in acid secretion, not a further rise. "Pepsinogen granules are released from parietal cells" is not the best choice because Chief cells, not parietal cells, store pepsinogen. The response described is about acid and mucus. "The hunger hormone from the fundus increases further" is not the best choice because Ghrelin rises in the fasting state. A luminal pH of 1.6 after a protein meal is not a fasting signal. "Bile salts are newly synthesized inside chief cells" is not the best choice because Hepatocytes make bile salts. Chief cells do not.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'bfcd052ea1ca5a4d27d8ba93ce9ac9ae0290d2280d32700c9022e9af1b6fc3c3', false, NOW(), NOW(), 3,
  'low-ph-stops-acid', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'low-ph-stops-acid', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-070", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "E", "verifiedFact": "When luminal pH falls too low, the stomach suspends hydrochloric acid secretion and increases mucus secretion."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280071', 'usmle-step-1', 'physiology',
  $sc$A 15-year-old boy who plays clarinet has a 1.1-cm mass in the tail of a gland that lies behind the stomach. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. The mass is a cluster of endocrine cells scattered among enzyme-secreting acini. The endocrine cells are the source of the hormone that lowers blood glucose, plus three other hormones from the same clusters.$sc$,
  $qu$Which of the following sets of products comes from these endocrine clusters?$qu$,
  $op${"options": ["Insulin, glucagon, somatostatin, and pancreatic polypeptide", "Amylase, lipase, trypsinogen, and ductal bicarbonate", "Pepsinogen, hydrochloric acid, and intrinsic factor", "Bile salts, bilirubin, and the phospholipid lecithin", "Gastrin, ghrelin, and histamine from the gastric mucosa"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "islet-hormones", "taskCategory": "mechanism"}$op$,
  $ky$Insulin, glucagon, somatostatin, and pancreatic polypeptide$ky$,
  $ex$The best choice is "Insulin, glucagon, somatostatin, and pancreatic polypeptide". The islets make insulin, glucagon, somatostatin, and pancreatic polypeptide. They sit among the enzyme-secreting acini. Insulin is the hormone that lowers blood glucose, and the mass is in the pancreatic tail. "Amylase, lipase, trypsinogen, and ductal bicarbonate" is not the best choice because Amylase, lipase, and trypsinogen come from acini, and bicarbonate from duct cells. Those are the exocrine products surrounding the cluster, not the endocrine set. "Pepsinogen, hydrochloric acid, and intrinsic factor" is not the best choice because Pepsinogen, acid, and intrinsic factor are gastric. This mass is in the gland behind the stomach. "Bile salts, bilirubin, and the phospholipid lecithin" is not the best choice because Bile salts, bilirubin, and lecithin are components of bile made by the liver. "Gastrin, ghrelin, and histamine from the gastric mucosa" is not the best choice because Gastrin, ghrelin, and histamine are gastric mucosal signals, not the four islet products.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '79112dae916efeeea273587629d696b8218347a0d42f1a597a62a02c605f17b3', false, NOW(), NOW(), 2,
  'islet-hormones', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'islet-hormones', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-071", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "A", "verifiedFact": "Islets of Langerhans produce insulin, glucagon, somatostatin, and pancreatic polypeptide. Acini produce the digestive enzymes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280072', 'usmle-step-1', 'anatomy',
  $sc$A 49-year-old woman who leads museum tours has pain and a dilated duct system after a fatty meal. Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 126/78 mm Hg. Imaging shows that the bile duct and the main pancreatic duct meet in the duodenal wall, and a smooth muscle ring at that meeting point does not open. Neither bile nor pancreatic juice enters the duodenum. The gallbladder wall itself contracts.$sc$,
  $qu$Which of the following is the role of the muscle ring that failed to open?$qu$,
  $op${"options": ["It controls only gastric emptying into the duodenum", "It controls release of both bile and pancreatic juice", "It is the voluntary outer ring of the anal canal", "It concentrates bile by absorbing water from it", "It secretes bicarbonate from pancreatic duct cells"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "sphincter-of-oddi", "taskCategory": "anatomy"}$op$,
  $ky$It controls release of both bile and pancreatic juice$ky$,
  $ex$The best choice is "It controls release of both bile and pancreatic juice". The hepatopancreatic sphincter controls flow of bile and pancreatic juice from their shared ampulla into the duodenum. Both fluids are blocked, the ducts meet in the duodenal wall, and the gallbladder is still able to contract. "It controls only gastric emptying into the duodenum" is not the best choice because The pyloric sphincter controls gastric emptying. It does not sit where the bile duct meets the pancreatic duct. "It is the voluntary outer ring of the anal canal" is not the best choice because The external anal sphincter is voluntary skeletal muscle at the anus. "It concentrates bile by absorbing water from it" is not the best choice because The gallbladder mucosa concentrates bile. The vignette says the gallbladder does contract. The blocked ring is at the duodenal meeting point. "It secretes bicarbonate from pancreatic duct cells" is not the best choice because Duct cells secrete bicarbonate. They are not the muscle ring that failed to open.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '263f59af6341b3cf4cfea2ba70305cf70473d0b62443d080138b7e962b784eb1', false, NOW(), NOW(), 3,
  'sphincter-of-oddi', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'sphincter-of-oddi', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-072", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "B", "verifiedFact": "The hepatopancreatic sphincter regulates flow of both bile and pancreatic juice from the ampulla into the duodenum."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280073', 'usmle-step-1', 'anatomy',
  $sc$A 28-year-old man who builds bicycles has a scan after a minor abdominal injury. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The main pancreatic duct joins the bile duct at the major papilla. A second, smaller duct from the same gland enters the duodenum on its own, about 2.5 cm proximal to that papilla. No stone is seen.$sc$,
  $qu$Which of the following best describes the smaller duct?$qu$,
  $op${"options": ["The cystic duct draining the gallbladder into the bile duct", "The common hepatic duct before it meets the cystic duct", "A developmental remnant that can enter above the main opening", "The duct that carries bile salts back from the ileum", "A colonic crypt that secretes mucus into the lumen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "santorini-accessory-duct", "taskCategory": "anatomy"}$op$,
  $ky$A developmental remnant that can enter above the main opening$ky$,
  $ex$The best choice is "A developmental remnant that can enter above the main opening". The accessory pancreatic duct, when present, runs into the duodenum about an inch above the main ampulla and is a remnant of pancreatic development. This smaller duct enters about 2.5 cm proximal to the major papilla, separate from the bile duct. "The cystic duct draining the gallbladder into the bile duct" is not the best choice because The cystic duct connects the gallbladder to the bile duct. It does not enter the duodenum on its own above the papilla. "The common hepatic duct before it meets the cystic duct" is not the best choice because The common hepatic duct is formed by the right and left hepatic ducts and has not yet met the cystic duct. It is not a second opening into the duodenum. "The duct that carries bile salts back from the ileum" is not the best choice because Bile salts return from the ileum in portal blood, not in a duct that opens above the papilla. "A colonic crypt that secretes mucus into the lumen" is not the best choice because Colonic crypts secrete mucus. They are not a pancreatic duct.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '167aaf05f0d6d639f35df5b068a4fda0746d5b96f8846ca4fe53bfcc0d8a2f88', false, NOW(), NOW(), 4,
  'santorini-accessory-duct', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'santorini-accessory-duct', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-073", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "C", "verifiedFact": "The accessory pancreatic duct, when present, enters the duodenum about an inch above the hepatopancreatic ampulla and is a remnant of pancreatic development."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280074', 'usmle-step-1', 'anatomy',
  $sc$A 57-year-old woman who catalogs fossils has adhesions mapped before a second operation. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 124/74 mm Hg. The colon that runs up the right side and the colon that runs down the left side are fixed behind the peritoneum. The segment that crosses the upper abdomen and the S-shaped pelvic segment both hang from peritoneal folds.$sc$,
  $qu$Which of the following segments are the fixed ones?$qu$,
  $op${"options": ["The transverse colon together with the sigmoid colon", "The jejunum together with the ileum on their mesentery", "The stomach along its greater and lesser curvatures", "The ascending colon together with the descending colon", "The cecum alone, while the ascending colon stays free"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "which-colon-is-retroperitoneal", "taskCategory": "anatomy"}$op$,
  $ky$The ascending colon together with the descending colon$ky$,
  $ex$The best choice is "The ascending colon together with the descending colon". The ascending and descending colon, and the rectum, lie behind the peritoneum. The transverse and sigmoid colon are hung by mesocolon. Her right-sided upward segment and left-sided downward segment are the fixed ones. "The transverse colon together with the sigmoid colon" is not the best choice because Those two segments are the ones described as hanging from folds, so they are not the fixed pair. "The jejunum together with the ileum on their mesentery" is not the best choice because Jejunum and ileum are suspended by mesentery. They are not the right and left colonic segments. "The stomach along its greater and lesser curvatures" is not the best choice because The stomach is covered by peritoneum and held by omenta. It is not fixed behind the peritoneum on both sides of the abdomen. "The cecum alone, while the ascending colon stays free" is not the best choice because The ascending colon is one of the fixed segments, not a free one.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'c27492798f2953fce78a17f0d995837af09c4ea5c0e5d09c8a28e56b9e20cce7', false, NOW(), NOW(), 3,
  'which-colon-is-retroperitoneal', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'which-colon-is-retroperitoneal', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-074", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "D", "verifiedFact": "The ascending colon, descending colon, and rectum are retroperitoneal. The transverse and sigmoid colon are suspended by mesocolon."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280075', 'usmle-step-1', 'histology',
  $sc$A 62-year-old man who teaches drafting has biopsies labeled A and B. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Slide A shows tall vascular projections and a fuzzy apical border. Slide B shows a flat simple columnar lining, no projections, and glands packed with mucus cells. Almost no enzyme-secreting cells are on slide B.$sc$,
  $qu$Which of the following is slide B?$qu$,
  $op${"options": ["Proximal jejunum, where most nutrient absorption occurs", "Gastric body, with acid cells midway in the glands", "Gallbladder lining, which concentrates stored bile", "Esophagus, lined by several layers of flat cells", "Large intestine, which lubricates and makes almost no enzymes"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "colon-no-villi", "taskCategory": "histology"}$op$,
  $ky$Large intestine, which lubricates and makes almost no enzymes$ky$,
  $ex$The best choice is "Large intestine, which lubricates and makes almost no enzymes". The colon lacks circular folds and villi, has abundant goblet cells that secrete mucus, and has few enzyme-secreting cells. Slide B is flat, full of mucus cells, and poor in enzyme cells. Slide A, with projections and a fuzzy border, is small intestine. "Proximal jejunum, where most nutrient absorption occurs" is not the best choice because The proximal jejunum has villi and a brush border, which is slide A, not slide B. "Gastric body, with acid cells midway in the glands" is not the best choice because The gastric body has parietal cells and pits, not a flat mucosa dominated by mucus glands without villi in this paired comparison. "Gallbladder lining, which concentrates stored bile" is not the best choice because The gallbladder has rugae and no submucosa and concentrates bile. It is not the enzyme-poor glandular mucosa contrasted with villi. "Esophagus, lined by several layers of flat cells" is not the best choice because The esophagus is stratified squamous. Slide B is simple columnar.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '99a56166f821d476efe9f6e35053f638d9b41e667d2e84ac18b40d4cec0b48b2', false, NOW(), NOW(), 2,
  'colon-no-villi', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'histology', 'colon-no-villi', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-075", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "E", "verifiedFact": "The colon has no circular folds or villi. Its glands are rich in goblet cells, which secrete mucus. Few enzyme-secreting cells are present."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280076', 'usmle-step-1', 'physiology',
  $sc$A 73-year-old man who keeps score at a bowling alley feels stool enter the rectum. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 138/78 mm Hg. The rectal wall stretches. The sigmoid and rectum contract, the inner anal ring relaxes, and the outer ring tightens for a few seconds until he decides to let it open.$sc$,
  $qu$Which of the following conducts this reflex from the stretch?$qu$,
  $op${"options": ["Parasympathetic signals through the spinal cord", "Sympathetic signals that quiet the entire colon", "A fundic hormone that stimulates hypothalamic hunger", "Somatic motor fibers that relax the inner smooth-muscle ring", "Vagal signals that increase gastric acid before a meal"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "defecation-reflex-internal-sphincter", "taskCategory": "mechanism"}$op$,
  $ky$Parasympathetic signals through the spinal cord$ky$,
  $ex$The best choice is "Parasympathetic signals through the spinal cord". Stretch of the rectum triggers a parasympathetic spinal reflex that contracts the sigmoid and rectum, relaxes the internal sphincter, and initially contracts the external sphincter. He can then choose to open the outer ring. That sequence is what he feels. "Sympathetic signals that quiet the entire colon" is not the best choice because Sympathetic activity decreases GI motility. It does not produce this coordinated rectal contraction and inner-ring relaxation. "A fundic hormone that stimulates hypothalamic hunger" is not the best choice because Ghrelin stimulates hunger. It does not run the rectal reflex. "Somatic motor fibers that relax the inner smooth-muscle ring" is not the best choice because The inner ring is smooth muscle. Somatic fibers supply the outer skeletal ring, which tightened and then could be opened by choice. "Vagal signals that increase gastric acid before a meal" is not the best choice because The cephalic phase raises gastric acid before food arrives. It is not a rectal stretch reflex.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '5161397d215186cd414195bf0058f3138e5338fe67f78a59a8a85c38818669b8', false, NOW(), NOW(), 3,
  'defecation-reflex-internal-sphincter', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'defecation-reflex-internal-sphincter', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-076", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "A", "verifiedFact": "The defecation reflex is a parasympathetic spinal reflex. It contracts the sigmoid and rectum, relaxes the internal anal sphincter, and initially contracts the external sphincter, which can then be opened voluntarily."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280077', 'usmle-step-1', 'physiology',
  $sc$A 48-year-old woman who proofs legal briefs drinks 300 mL of a glucose solution. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. As glucose contacts the small-bowel lining, a hormone from mucosal K cells rises, and insulin in portal blood rises with it. The same glucose given by vein, bypassing the gut, produces a smaller insulin rise.$sc$,
  $qu$Which of the following is the gut hormone's action in this study?$qu$,
  $op${"options": ["It inhibits all gastric secretion, motility, and emptying", "It prompts release of the hormone that lowers blood sugar", "It emulsifies triglyceride in the duodenal lumen", "It activates trypsinogen on the brush border", "It concentrates bile by absorbing water from it"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gip-stimulates-insulin", "taskCategory": "mechanism"}$op$,
  $ky$It prompts release of the hormone that lowers blood sugar$ky$,
  $ex$The best choice is "It prompts release of the hormone that lowers blood sugar". K cells secrete glucose-dependent insulinotropic peptide, which stimulates insulin release. Oral glucose raised this mucosal hormone and insulin, and intravenous glucose, which skipped the gut, raised insulin less. "It inhibits all gastric secretion, motility, and emptying" is not the best choice because Somatostatin restricts gastric secretion, motility, and emptying. It is not the K-cell signal that rose with oral glucose. "It emulsifies triglyceride in the duodenal lumen" is not the best choice because Bile salts emulsify fat. They are not a hormone that augments insulin after oral glucose. "It activates trypsinogen on the brush border" is not the best choice because Enteropeptidase activates trypsinogen. It does not explain the insulin difference between oral and intravenous glucose. "It concentrates bile by absorbing water from it" is not the best choice because The gallbladder concentrates bile. It does not release a hormone from small-bowel K cells.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '7a252b99a78c057261ce963e33f483266acd1fba5bb9a1e00dd9259765a37b3a', false, NOW(), NOW(), 3,
  'gip-stimulates-insulin', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gip-stimulates-insulin', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-077", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "B", "verifiedFact": "K cells secrete glucose-dependent insulinotropic peptide, which stimulates insulin release."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280078', 'usmle-step-1', 'histology',
  $sc$A 39-year-old man who cuts glass has a gastric biopsy after a week of aspirin use. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. A shallow erosion is already covered by new surface cells. The pathologist notes that stem cells at the junction of pits and glands replace the entire surface lining on a cycle of 3 to 6 days.$sc$,
  $qu$Which of the following is the source of the new surface cells?$qu$,
  $op${"options": ["Basal gland cells that store the protein-digesting precursor", "Pancreatic acini that secrete already-active lipase", "Stem cells where the glands open into the gastric pits", "Liver cells arranged in plates around the central vein", "Mucus cells that pack the glands of the large intestine"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gastric-epithelium-renewal", "taskCategory": "histology"}$op$,
  $ky$Stem cells where the glands open into the gastric pits$ky$,
  $ex$The best choice is "Stem cells where the glands open into the gastric pits". Stem cells at the junction of gastric glands and pits replace damaged surface cells, and the surface is fully replaced every 3 to 6 days. The erosion is already covered, and the note gives that cycle and that location. "Basal gland cells that store the protein-digesting precursor" is not the best choice because Chief cells secrete pepsinogen. They are not the stem cells that resurface the pits. "Pancreatic acini that secrete already-active lipase" is not the best choice because Pancreatic acini secrete enzymes. They do not replace gastric surface cells. "Liver cells arranged in plates around the central vein" is not the best choice because Hepatocytes process portal blood and make bile. They are not in the gastric pits. "Mucus cells that pack the glands of the large intestine" is not the best choice because Colonic goblet cells secrete mucus. They are not the stem cells of the gastric surface.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '78d8d37cb5532c1960cf37c5c504367301661ec08fdca7f3a1329c6bed79ab8f', false, NOW(), NOW(), 2,
  'gastric-epithelium-renewal', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach"}]$rf$::jsonb,
  'step1', false,
  'histology', 'gastric-epithelium-renewal', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-078", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach", "nutrition": false, "keyLetter": "C", "verifiedFact": "Stem cells where gastric glands join the pits replace the surface epithelium, which is completely renewed every 3 to 6 days."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280079', 'usmle-step-1', 'histology',
  $sc$A 50-year-old woman who archives newspapers has two biopsies. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. The esophageal biopsy shows many layers of flat surface cells that are not keratinized. The gastric biopsy, taken 3 cm beyond the junction, shows a single layer of tall cells with mucus on the surface.$sc$,
  $qu$Which of the following pairings matches these two linings?$qu$,
  $op${"options": ["A single tall-cell layer in the esophagus, layered flat cells in the stomach", "Layered flat cells throughout both the esophagus and the stomach", "A single tall-cell layer in both the esophagus and the stomach", "Layered flat cells in the esophagus, a single tall-cell layer in the stomach", "Keratinized skin in the esophagus and transitional cells in the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "squamous-versus-columnar-lining", "taskCategory": "histology"}$op$,
  $ky$Layered flat cells in the esophagus, a single tall-cell layer in the stomach$ky$,
  $ex$The best choice is "Layered flat cells in the esophagus, a single tall-cell layer in the stomach". The esophagus is lined by nonkeratinized stratified squamous epithelium, and the stomach by simple columnar epithelium. Her esophageal biopsy is many layers of flat cells without keratin, and the gastric biopsy is one layer of tall mucus-covered cells. "A single tall-cell layer in the esophagus, layered flat cells in the stomach" is not the best choice because That pairing reverses the two organs. "Layered flat cells throughout both the esophagus and the stomach" is not the best choice because The stomach biopsy is a single tall-cell layer, not layered flat cells. "A single tall-cell layer in both the esophagus and the stomach" is not the best choice because The esophageal biopsy is layered, not a single tall-cell layer. "Keratinized skin in the esophagus and transitional cells in the stomach" is not the best choice because The esophageal cells are not keratinized, and the stomach is not transitional epithelium.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '39cf42327b3a3f91ef42c2d847803ffc0ccde107f36995bdf8f6de5fb4606959', false, NOW(), NOW(), 2,
  'squamous-versus-columnar-lining', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'histology', 'squamous-versus-columnar-lining', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-079", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "The epithelium is nonkeratinized stratified squamous in the mouth, pharynx, esophagus, and anal canal. It is simple columnar in the stomach and intestines."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280080', 'usmle-step-1', 'physiology',
  $sc$A 44-year-old man who tunes organs is studied as chyme enters the duodenum. Temperature is 36.7°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Gastric pH is 2.0 and a protein-digesting enzyme from the stomach is active. After bicarbonate-rich pancreatic juice mixes in, duodenal pH is 7.6 and that gastric enzyme stops working. Intestinal enzymes in the same fluid become active.$sc$,
  $qu$Which of the following does the alkaline pancreatic juice do to the gastric enzyme?$qu$,
  $op${"options": ["It converts the enzyme from pepsinogen into its active form", "It emulsifies fat so the gastric enzyme can digest triglyceride", "It is the brush-border enzyme that activates trypsinogen", "It stimulates hunger by an action on the hypothalamus", "It raises the pH and shuts off that stomach enzyme"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "pancreatic-juice-inactivates-pepsin", "taskCategory": "mechanism"}$op$,
  $ky$It raises the pH and shuts off that stomach enzyme$ky$,
  $ex$The best choice is "It raises the pH and shuts off that stomach enzyme". Bicarbonate makes pancreatic juice alkaline, about pH 7.1 to 8.2, which buffers acid and inactivates pepsin. Gastric pH was 2.0 with the enzyme active, and at duodenal pH 7.6 that enzyme stopped while intestinal enzymes worked. "It converts the enzyme from pepsinogen into its active form" is not the best choice because Acid, not alkaline juice, converts pepsinogen to pepsin. Alkali does the opposite to the active enzyme. "It emulsifies fat so the gastric enzyme can digest triglyceride" is not the best choice because Bile salts emulsify fat. Pancreatic alkalinity does not assign the gastric protein enzyme to triglycerides. "It is the brush-border enzyme that activates trypsinogen" is not the best choice because Enteropeptidase activates trypsinogen. The change here is loss of activity of the gastric enzyme as pH rises. "It stimulates hunger by an action on the hypothalamus" is not the best choice because Ghrelin stimulates hunger. It is not pancreatic juice.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4f611efbc81e71b85830fdbbe9b717a20c399be3437a743fc4ec913527900ebf', false, NOW(), NOW(), 3,
  'pancreatic-juice-inactivates-pepsin', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'pancreatic-juice-inactivates-pepsin', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-080", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "E", "verifiedFact": "Pancreatic juice is alkaline, about pH 7.1 to 8.2, because of bicarbonate. That alkalinity buffers gastric acid, inactivates pepsin, and suits the intestinal enzymes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280081', 'usmle-step-1', 'physiology',
  $sc$A 36-year-old woman who designs maps is studied after a large meal. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Venous blood leaving the stomach is alkaline while acid is being secreted into the lumen. At the same time, venous blood leaving the pancreas is acidic as bicarbonate is secreted into the ducts. Blood reaching the liver has a normal pH.$sc$,
  $qu$Which of the following best explains the normal pH of blood reaching the liver?$qu$,
  $op${"options": ["Acidic pancreatic venous blood offsets alkaline gastric venous blood", "The liver adds bicarbonate until both venous streams are alkaline", "Colonic bacteria generate the acid that cancels the gastric stream", "Bile salts buffer the gastric venous blood inside the portal vein", "Intrinsic factor binds the excess alkali before it leaves the stomach"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "alkaline-tide-balanced", "taskCategory": "mechanism"}$op$,
  $ky$Acidic pancreatic venous blood offsets alkaline gastric venous blood$ky$,
  $ex$The best choice is "Acidic pancreatic venous blood offsets alkaline gastric venous blood". Hydrogen ions enter the blood when pancreatic duct cells secrete bicarbonate, so pancreatic venous blood is acidic and balances the alkaline venous blood leaving the stomach during acid secretion. Her two streams match that pair, and hepatic inflow pH is normal. "The liver adds bicarbonate until both venous streams are alkaline" is not the best choice because The pancreas is already supplying the acidic stream. The liver is not described as adding more bicarbonate to both. "Colonic bacteria generate the acid that cancels the gastric stream" is not the best choice because Colonic bacteria make gas and some vitamins. They are not the source of the acidic pancreatic venous blood. "Bile salts buffer the gastric venous blood inside the portal vein" is not the best choice because Bile salts emulsify fat in the intestine. They do not buffer gastric venous blood. "Intrinsic factor binds the excess alkali before it leaves the stomach" is not the best choice because Intrinsic factor binds vitamin B12. It does not neutralize an alkaline tide.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a7ea8c2941bc6681e17ee07c4b5a75149a8fd545483af495e8e3e0c7de67c700', false, NOW(), NOW(), 4,
  'alkaline-tide-balanced', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'alkaline-tide-balanced', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-081", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "A", "verifiedFact": "When the pancreas secretes bicarbonate, hydrogen ions enter the blood. That acidic pancreatic venous blood balances the alkaline blood leaving the stomach."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280082', 'usmle-step-1', 'physiology',
  $sc$A 30-year-old man who installs flooring is studied as a meal enters the stomach. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Segmentation in the last part of the small intestine becomes stronger, and the sphincter into the cecum relaxes. A hormone from the antrum is elevated. The colon is still empty.$sc$,
  $qu$Which of the following links the meal in the stomach to the ileal change?$qu$,
  $op${"options": ["Strong colonic waves are pushing stool toward the rectum", "A stomach reflex plus an antral peptide speeds the last segment", "The duodenum is overfilled and has shut the gastric outlet", "Fat in the last segment is being dispersed by new bile", "The outer anal ring has been opened by a voluntary act"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "gastroileal-reflex", "taskCategory": "mechanism"}$op$,
  $ky$A stomach reflex plus an antral peptide speeds the last segment$ky$,
  $ex$The best choice is "A stomach reflex plus an antral peptide speeds the last segment". Gastric digestive activity triggers the gastroileal reflex, increasing ileal segmentation, and gastrin from the antrum also increases ileal motility and relaxes the ileocecal sphincter. The meal is in the stomach, the antral hormone is up, the distal small bowel is more active, and the cecal sphincter is relaxed. The colon is empty. "Strong colonic waves are pushing stool toward the rectum" is not the best choice because Mass movements are colonic and move contents toward the rectum. The colon is empty, and the change is in the distal small intestine. "The duodenum is overfilled and has shut the gastric outlet" is not the best choice because The enterogastric reflex closes the pylorus when the duodenum is distended. Here the meal has just entered the stomach. "Fat in the last segment is being dispersed by new bile" is not the best choice because Bile salts emulsify fat. That chemistry does not relax the sphincter into the cecum when a meal hits the stomach. "The outer anal ring has been opened by a voluntary act" is not the best choice because The external anal sphincter is at the anus. It is not the sphincter between ileum and cecum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a9fcb38a30fba8c56ecaa762f6795b1cd5b6086b193d51bda0e572d6f0e623f0', false, NOW(), NOW(), 3,
  'gastroileal-reflex', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'gastroileal-reflex', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-082", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "B", "verifiedFact": "Digestive activity in the stomach provokes the gastroileal reflex, which increases ileal segmentation. Gastrin also increases ileal motility and relaxes the ileocecal sphincter."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280083', 'usmle-step-1', 'pathology',
  $sc$A 69-year-old man who repairs violins has a 4-cm mass in the cecum and three new masses in the liver. Temperature is 36.9°C, pulse is 82/min, respirations are 16/min, and blood pressure is 130/78 mm Hg. The lung fields are clear. Veins from the cecum join the stream that enters the liver before any of that blood reaches the heart.$sc$,
  $qu$Which of the following best explains why the new masses appeared in the liver first?$qu$,
  $op${"options": ["The hepatic artery is the only route out of the cecum", "Bile flows from the liver back into the cecal veins", "Venous blood from the gut reaches the liver before the heart", "Lymph from the gut drains only into the thoracic duct and lungs", "The masses crossed the peritoneum as free air under the diaphragm"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "portal-vein-metastasis", "taskCategory": "mechanism"}$op$,
  $ky$Venous blood from the gut reaches the liver before the heart$ky$,
  $ex$The best choice is "Venous blood from the gut reaches the liver before the heart". Portal blood from the alimentary canal all passes through the liver before returning to the heart, so cancers that start in the gut most often seed the liver. His cecal veins join that stream, the liver has the new masses, and the lungs are clear. "The hepatic artery is the only route out of the cecum" is not the best choice because The hepatic artery brings arterial blood to the liver. It is not the venous exit from the cecum. "Bile flows from the liver back into the cecal veins" is not the best choice because Bile flows through ducts into the duodenum, not backward into cecal veins. "Lymph from the gut drains only into the thoracic duct and lungs" is not the best choice because The lungs are clear, and the route described is venous blood to the liver, not a lymph path that skips the liver. "The masses crossed the peritoneum as free air under the diaphragm" is not the best choice because Free air under the diaphragm is a sign of perforation. It is not how solid masses reach the liver.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', '2c5006c09828c3f28f3567dd79f277049f3d282f0ee3a4076a6fac4dadee9002', false, NOW(), NOW(), 2,
  'portal-vein-metastasis', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'portal-vein-metastasis', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-083", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder", "nutrition": false, "keyLetter": "C", "verifiedFact": "All blood from the alimentary canal passes through the liver in the portal vein, which is why the liver is the most common site for metastasis of cancers that start in the alimentary canal."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280084', 'usmle-step-1', 'histology',
  $sc$A 45-year-old woman who teaches pottery has a full-thickness jejunal biopsy. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. From the lumen outward the slide shows epithelium with its supporting connective tissue and a thin muscle strip, then a broader connective-tissue layer with a nerve network, then two smooth-muscle layers, then a slippery outer coat.$sc$,
  $qu$Which of the following is the order of these layers from the lumen?$qu$,
  $op${"options": ["Serosa, muscularis, submucosa, then mucosa", "Mucosa, muscularis, serosa, then submucosa", "Submucosa, mucosa, serosa, then muscularis", "Mucosa, submucosa, muscularis, then serosa", "Adventitia, mucosa, serosa, then muscularis"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "four-gut-layers", "taskCategory": "histology"}$op$,
  $ky$Mucosa, submucosa, muscularis, then serosa$ky$,
  $ex$The best choice is "Mucosa, submucosa, muscularis, then serosa". From the lumen the layers are mucosa, submucosa, muscularis, and serosa. The mucosa on this slide is epithelium plus its connective tissue and thin muscle, then the nerve-bearing connective tissue, then the two muscle layers, then the slippery coat. "Serosa, muscularis, submucosa, then mucosa" is not the best choice because That list is the reverse of the lumen-outward order. "Mucosa, muscularis, serosa, then submucosa" is not the best choice because Serosa is the outer coat, not the third layer, and submucosa is not last. "Submucosa, mucosa, serosa, then muscularis" is not the best choice because The epithelium-bearing layer is first, so submucosa is not the luminal layer. "Adventitia, mucosa, serosa, then muscularis" is not the best choice because Jejunum has serosa, not adventitia. Adventitia replaces serosa in the esophagus.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "histology", "histology"]$tg$,
  's1-new-20261128-hidden', '0e20e6380fbd19ce7d49c61f34f1076db1d3817f3b6b35cc7a20046e1a1204c9', false, NOW(), NOW(), 2,
  'four-gut-layers', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system"}]$rf$::jsonb,
  'step1', false,
  'histology', 'four-gut-layers', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-084", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system", "nutrition": false, "keyLetter": "D", "verifiedFact": "From the lumen outward the gut wall is mucosa, submucosa, muscularis, and serosa. The mucosa includes epithelium, lamina propria, and muscularis mucosae."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280085', 'usmle-step-1', 'anatomy',
  $sc$A 61-year-old man who coaches chess has a scope of the last 20 cm of the bowel. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. Three transverse shelves project into the lumen. He can pass gas without stool. The shelves are proximal to the anal canal, and the lining above them is simple columnar.$sc$,
  $qu$Which of the following is the role of these three shelves?$qu$,
  $op${"options": ["They churn a meal using an extra inner gastric muscle", "They remove water so bile occupies a smaller volume", "They mark where visceral sensation changes to somatic pain", "They house the stem cells that replace the gastric surface", "They help keep flatus and stool from passing together"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "gastrointestinal", "blueprintTopic": "rectal-valves-separate-gas", "taskCategory": "anatomy"}$op$,
  $ky$They help keep flatus and stool from passing together$ky$,
  $ex$The best choice is "They help keep flatus and stool from passing together". The rectal valves are three transverse folds that help separate feces from gas. He can pass gas without stool, and the shelves are in the last 20 cm, proximal to the anal canal. "They churn a meal using an extra inner gastric muscle" is not the best choice because The oblique muscle is gastric. These shelves are rectal. "They remove water so bile occupies a smaller volume" is not the best choice because The gallbladder concentrates bile. It is not a set of rectal shelves. "They mark where visceral sensation changes to somatic pain" is not the best choice because The pectinate line, lower in the anal canal, separates visceral and somatic sensation. These shelves are proximal to the anal canal. "They house the stem cells that replace the gastric surface" is not the best choice because Gastric stem cells sit where pits meet glands. They are not rectal shelves.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "gastrointestinal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '96c5c84786fab99c82e26ca1f69638d3bbe5f5b2a51468f16dcad1ff5de487bc', false, NOW(), NOW(), 3,
  'rectal-valves-separate-gas', 'gastrointestinal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'rectal-valves-separate-gas', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-085", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines", "nutrition": false, "keyLetter": "E", "verifiedFact": "Three transverse rectal folds, the rectal valves, help separate feces from gas so they are not passed together."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280086', 'usmle-step-1', 'immunology',
  $sc$A 2-week-old girl is exclusively fed her mother's milk. Temperature is 36.8°C, pulse is 140/min, respirations are 36/min, and blood pressure is 70/40 mm Hg. Milk contains a dimeric antibody that also appears in saliva and tears. A different antibody, transferred before birth across the placenta, is already in her serum and is not the one found in the milk.$sc$,
  $qu$Which of the following is the antibody in the milk?$qu$,
  $op${"options": ["The dimeric class that guards mucosal surfaces", "The pentamer that dominates the first serum response", "The class bound to mast cells in allergic responses", "The monomer that crosses the placenta before birth", "The class coexpressed on naive B cells but not secreted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "iga-secretions-milk", "taskCategory": "mechanism"}$op$,
  $ky$The dimeric class that guards mucosal surfaces$ky$,
  $ex$The best choice is "The dimeric class that guards mucosal surfaces". Dimeric IgA is the antibody of mucous secretions, saliva, tears, and breast milk, and it protects body surfaces. The milk antibody is dimeric and is also in saliva and tears. The antibody already in serum from the placenta is a different class. "The pentamer that dominates the first serum response" is not the best choice because IgM is the pentamer of the early serum response. It is not the dimeric milk antibody. "The class bound to mast cells in allergic responses" is not the best choice because IgE binds mast cells and is linked to allergy. It is not the dimeric mucosal antibody. "The monomer that crosses the placenta before birth" is not the best choice because IgG is the monomer that crosses the placenta. The vignette says that class is already in serum and is not the milk antibody. "The class coexpressed on naive B cells but not secreted" is not the best choice because IgD is on naive B cells with IgM and is not the secreted milk antibody.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '9faef5488b4415d7be203a5ee180a49af988b802516cdcab60414393e55d519c', false, NOW(), NOW(), 2,
  'iga-secretions-milk', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'iga-secretions-milk', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-086", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "A", "verifiedFact": "Dimeric IgA is the antibody in mucous secretions, saliva, tears, and breast milk. It is the antibody that protects body surfaces. IgG, not IgA, is the one that crosses the placenta."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280087', 'usmle-step-1', 'immunology',
  $sc$A 9-year-old boy who visits a bakery wheezes and develops hives 10 minutes after a peanut candy. Temperature is 36.9°C, pulse is 130/min, respirations are 32/min, and blood pressure is 78/46 mm Hg. The antibody class involved is the one found at the lowest level in his serum, because its tail is already stuck to receptors on cells that release histamine.$sc$,
  $qu$Which of the following is the reason this antibody is scarce in serum?$qu$,
  $op${"options": ["It is a five-unit antibody too large to stay in the blood", "Its tail sits on the cells that release the itch mediator", "It is secreted only into milk, saliva, tears, and mucus", "It crosses the placenta and leaves the child's circulation", "It is displayed on naive B cells and is never secreted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ige-mast-cell", "taskCategory": "mechanism"}$op$,
  $ky$Its tail sits on the cells that release the itch mediator$ky$,
  $ex$The best choice is "Its tail sits on the cells that release the itch mediator". IgE is the lowest-concentration antibody in blood because its Fc region binds strongly to receptors on mast cells. Allergen cross-linking then causes degranulation. He has rapid wheeze, hives, and low blood pressure after peanut, and the antibody is the one parked on histamine-releasing cells. "It is a five-unit antibody too large to stay in the blood" is not the best choice because IgM is the pentamer. Size is not why this allergy antibody is scarce in serum. "It is secreted only into milk, saliva, tears, and mucus" is not the best choice because Dimeric IgA is the antibody of milk, saliva, and tears. It is not the one fixed on histamine-releasing cells. "It crosses the placenta and leaves the child's circulation" is not the best choice because IgG crosses the placenta. That transfer is not why an allergy antibody is scarce in a 9-year-old's serum. "It is displayed on naive B cells and is never secreted" is not the best choice because IgD stays on naive B cells. The antibody here is bound to histamine-releasing cells and triggered by peanut.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '4566f08f176b81ed1480513b1de5c6fe5de3244103fb376f7cc1f46f6ba49ad9', false, NOW(), NOW(), 2,
  'ige-mast-cell', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ige-mast-cell', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-087", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "B", "verifiedFact": "IgE is present at the lowest concentration in blood because its Fc region binds Fc receptors on mast cells. Allergen then triggers degranulation and can cause anaphylaxis."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280088', 'usmle-step-1', 'immunology',
  $sc$A 21-year-old woman who lifeguards has fever 6 days after a first-time bacterial skin infection. Temperature is 38.4°C, pulse is 100/min, respirations are 18/min, and blood pressure is 110/68 mm Hg. The only antibody to the organism so far is a very large molecule with 10 identical binding sites. It fixes complement strongly. She has never been infected with this organism before.$sc$,
  $qu$Which of the following best describes this first antibody?$qu$,
  $op${"options": ["A single-unit antibody that appears only on a later exposure", "A dimer secreted onto mucosal surfaces and into milk", "A five-unit antibody made early and strong at starting the cascade", "A class fixed on mast cells before the antigen arrives", "A cell-surface class that is not secreted in this response"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "igm-first-pentamer", "taskCategory": "mechanism"}$op$,
  $ky$A five-unit antibody made early and strong at starting the cascade$ky$,
  $ex$The best choice is "A five-unit antibody made early and strong at starting the cascade". IgM is usually the first antibody of a primary response. It is a pentamer with 10 binding sites and activates complement well. This is her first infection, at day 6, and the only antibody is that large complement-fixing molecule. "A single-unit antibody that appears only on a later exposure" is not the best choice because IgG is the main antibody of secondary responses and of late primary responses. She has not had this organism before, and the molecule has 10 binding sites, so it is not a monomer. "A dimer secreted onto mucosal surfaces and into milk" is not the best choice because Dimeric IgA guards mucosa and is in milk. It does not have 10 binding sites. "A class fixed on mast cells before the antigen arrives" is not the best choice because IgE is fixed on mast cells. It is not the early pentamer of a first infection. "A cell-surface class that is not secreted in this response" is not the best choice because IgD is a surface receptor and is not the secreted early antibody.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '4fd2f65df0d56c17de7398700da480536bb805ba4965d4aae7474de9c1cace03', false, NOW(), NOW(), 2,
  'igm-first-pentamer', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'igm-first-pentamer', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-088", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "C", "verifiedFact": "IgM is the first antibody of a primary response. It is a pentamer with 10 antigen-binding sites and activates complement well."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280089', 'usmle-step-1', 'immunology',
  $sc$A newborn boy, 2 hours old, has antibody to an organism his mother recovered from last year. Temperature is 36.8°C, pulse is 140/min, respirations are 40/min, and blood pressure is 68/40 mm Hg. He has not nursed yet. The antibody in his cord blood is a monomer, and it is the class his mother made in large amount when she met the organism the second time. No pentamer to that organism is in the cord blood.$sc$,
  $qu$Which of the following allowed this antibody to reach him before birth?$qu$,
  $op${"options": ["This pentamer crosses the placenta in the first week of infection", "A mucosal dimer crossed the placenta in place of milk", "Mast-cell antibody crossed the placenta and coated his mast cells", "This single-unit antibody crossed from her circulation before birth", "A surface-only class was secreted into the cord for the first time"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "igg-crosses-placenta", "taskCategory": "mechanism"}$op$,
  $ky$This single-unit antibody crossed from her circulation before birth$ky$,
  $ex$The best choice is "This single-unit antibody crossed from her circulation before birth". IgG crosses the placenta and is the main blood antibody of secondary responses. He has not nursed, the cord antibody is a monomer, and it is the class his mother made on second exposure. No pentamer is present. "This pentamer crosses the placenta in the first week of infection" is not the best choice because IgM is the pentamer and is not the class described in the cord blood. "A mucosal dimer crossed the placenta in place of milk" is not the best choice because Dimeric IgA reaches the infant in milk, not across the placenta, and he has not nursed. "Mast-cell antibody crossed the placenta and coated his mast cells" is not the best choice because IgE is the mast-cell antibody. It is not the monomer of a secondary serum response in cord blood. "A surface-only class was secreted into the cord for the first time" is not the best choice because IgD is a surface receptor on naive B cells and is not the secreted cord-blood antibody.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', 'dd4116d2778c25c6e4399ce0dd50706795fcf77ede5a4a3f223260ce71093dac', false, NOW(), NOW(), 2,
  'igg-crosses-placenta', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'igg-crosses-placenta', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-089", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "D", "verifiedFact": "IgG is the main antibody of secondary responses in blood, and it is the class that crosses the placenta to protect the fetus."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280090', 'usmle-step-1', 'immunology',
  $sc$A 19-year-old man who stocks shelves has a blood study of lymphocytes that have never met antigen. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Each of these cells displays two antibody classes on its surface, both specific for the same shape. When the cells finally respond, only one of those two classes is released into the blood.$sc$,
  $qu$Which of the following pair is on these inexperienced cells?$qu$,
  $op${"options": ["Five secreted classes, with none remaining on the cell surface", "Only the allergy class, already fixed on granule-filled cells", "A mucosal dimer and a prenatal monomer, both secreted", "One secreted five-unit antibody and no surface antibody", "Two surface classes of one specificity, only one later secreted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "naive-b-igm-igd", "taskCategory": "mechanism"}$op$,
  $ky$Two surface classes of one specificity, only one later secreted$ky$,
  $ex$The best choice is "Two surface classes of one specificity, only one later secreted". Mature naive B cells express IgM and IgD with the same antigen specificity. Only IgM is secreted. These cells have not met antigen and display two classes of one specificity, of which only one is later released. "Five secreted classes, with none remaining on the cell surface" is not the best choice because Plasma cells secrete antibody and are not the inexperienced cells that still display two surface classes. "Only the allergy class, already fixed on granule-filled cells" is not the best choice because IgE on mast cells is the allergy pattern, not the pair on a naive B cell. "A mucosal dimer and a prenatal monomer, both secreted" is not the best choice because IgA and IgG are secreted classes with different jobs. They are not the dual surface display of an inexperienced B cell. "One secreted five-unit antibody and no surface antibody" is not the best choice because A secreted pentamer without surface antibody describes a plasma-cell product, not a naive cell.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '11f6e61a6fa614fa2b5334c05fb4e9e65653fa48a8e305d4665b1eae6c2c798e', false, NOW(), NOW(), 3,
  'naive-b-igm-igd', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'naive-b-igm-igd', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-090", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "E", "verifiedFact": "Naive B cells that leave the marrow express both IgM and IgD with the same specificity. Only IgM is secreted. No other secreted function of IgD is known."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280091', 'usmle-step-1', 'immunology',
  $sc$A 24-year-old woman who catalogs seeds is studied after a first injection of a protein. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. One lymphocyte binds the protein in its original folded shape, with no requirement that another cell display a cut peptide. A second lymphocyte binds only a peptide fragment held in a surface groove of another cell.$sc$,
  $qu$Which of the following lymphocytes binds the intact folded protein?$qu$,
  $op${"options": ["The cell that recognizes native antigen without a presenting groove", "The cell that recognizes only a peptide in a presenting groove", "A red-cell precursor that carries no antigen receptor", "A platelet that releases granules but does not bind antigen", "A liver phagocyte that engulfs debris in a sinusoid"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "b-cell-native-antigen", "taskCategory": "mechanism"}$op$,
  $ky$The cell that recognizes native antigen without a presenting groove$ky$,
  $ex$The best choice is "The cell that recognizes native antigen without a presenting groove". B cells bind native, unprocessed antigen and do not need MHC or an antigen-presenting cell to recognize it. The first lymphocyte bound the folded protein with no peptide display. The second lymphocyte, which needs a peptide in a groove, is the T cell pattern. "The cell that recognizes only a peptide in a presenting groove" is not the best choice because That description is the second lymphocyte, not the one that bound the intact protein. "A red-cell precursor that carries no antigen receptor" is not the best choice because Red-cell precursors do not bind native antigen through an antibody receptor. "A platelet that releases granules but does not bind antigen" is not the best choice because Platelets are not the lymphocyte that recognized folded protein. "A liver phagocyte that engulfs debris in a sinusoid" is not the best choice because Kupffer cells phagocytose in liver sinusoids. They are not the lymphocyte in this comparison.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '1c3e7c64f51f545ef6a069c6e8c1ec859247fdb2fed7a5ac8f915a4b1851be09', false, NOW(), NOW(), 3,
  'b-cell-native-antigen', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'b-cell-native-antigen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-091", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "A", "verifiedFact": "B cells recognize native, unprocessed antigen and do not require MHC molecules or antigen-presenting cells to bind it."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280092', 'usmle-step-1', 'immunology',
  $sc$A 17-year-old boy who clerks in a pharmacy is followed after a first vaccine dose and a second dose 8 weeks later. Temperature is 36.5°C, pulse is 66/min, respirations are 14/min, and blood pressure is 108/64 mm Hg. Early antibody is a pentamer. Later antibody is a monomer. Both grab the same site on the vaccine protein, and the binding loops have not changed.$sc$,
  $qu$Which of the following changed between the early and later antibody?$qu$,
  $op${"options": ["The binding site changed, and the class stayed a pentamer", "The class changed, and the binding site stayed the same", "Both the antibody class and the binding site changed", "Neither the class nor the binding site changed", "The antibody became a T-cell receptor with a new groove"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "class-switch-same-specificity", "taskCategory": "mechanism"}$op$,
  $ky$The class changed, and the binding site stayed the same$ky$,
  $ex$The best choice is "The class changed, and the binding site stayed the same". Class switching replaces one antibody class with another while specificity and the antigen-binding sites stay the same. His early antibody is a pentamer and the later one is a monomer, and both bind the same site with unchanged loops. "The binding site changed, and the class stayed a pentamer" is not the best choice because The binding loops did not change, and the later antibody is a monomer, not still a pentamer. "Both the antibody class and the binding site changed" is not the best choice because The binding site stayed the same, so both features did not change. "Neither the class nor the binding site changed" is not the best choice because The class did change from pentamer to monomer. "The antibody became a T-cell receptor with a new groove" is not the best choice because The molecule is still antibody. It did not become a T-cell receptor.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', 'b3546e3b0d8aa305fda615c56bb51d55ac0022154aba2fd4f748a0c7d2f3192e', false, NOW(), NOW(), 3,
  'class-switch-same-specificity', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'class-switch-same-specificity', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-092", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "B", "verifiedFact": "Class switching changes the antibody class. Specificity and the antigen-binding sites stay the same."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280093', 'usmle-step-1', 'immunology',
  $sc$A 30-year-old man who guides river trips receives an injection of antibody after a possible exposure. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. He makes no antibody of his own to this organism. Protection is gone by 8 weeks. A coworker who received a vaccine instead still has a rapid rise in her own antibody when tested at 8 weeks.$sc$,
  $qu$Which of the following best explains why his protection ended?$qu$,
  $op${"options": ["The vaccine he received failed to take because he was already immune", "His own pentamer switched to a monomer and then stopped", "Transferred antibody faded, and he formed no lasting response", "Mast-cell antibody consumed the injection within 10 minutes", "Colonic bacteria destroyed the antibody in the first hour"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "passive-antibody-no-memory", "taskCategory": "mechanism"}$op$,
  $ky$Transferred antibody faded, and he formed no lasting response$ky$,
  $ex$The best choice is "Transferred antibody faded, and he formed no lasting response". Passive immunization gives antibody without an immune response in the recipient, so no immunological memory forms. Protection lasts only until the transferred antibody degrades. He made none of his own, and protection was gone at 8 weeks. His coworker received a vaccine, which is active immunization and still shows her own rapid response. "The vaccine he received failed to take because he was already immune" is not the best choice because He received antibody, not a vaccine. The coworker is the one who was vaccinated. "His own pentamer switched to a monomer and then stopped" is not the best choice because Class switching is part of an active response. He made no antibody of his own. "Mast-cell antibody consumed the injection within 10 minutes" is not the best choice because The loss of protection is at 8 weeks, not in 10 minutes, and he is not described as having an allergic consumption of the dose. "Colonic bacteria destroyed the antibody in the first hour" is not the best choice because Colonic bacteria are not the reason transferred antibody disappears over weeks.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', 'f5c4fe5d0815c0bad3101ef24e3c1d30524ae8e6165d0a26d33964a86f37372c', false, NOW(), NOW(), 3,
  'passive-antibody-no-memory', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'passive-antibody-no-memory', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-093", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "C", "verifiedFact": "Passive immunity transfers antibody without the recipient making a response, so no memory develops. The protection lasts only until the transferred antibody degrades. A vaccine is active immunity and does generate memory."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280094', 'usmle-step-1', 'immunology',
  $sc$A 4-year-old girl who attends preschool has a vaccine made only of a repeating sugar from a bacterial capsule. Temperature is 36.8°C, pulse is 100/min, respirations are 20/min, and blood pressure is 90/56 mm Hg. Her B cells bind many identical sugars at once and begin to make antibody even though helper T cells are not providing cytokines. A protein vaccine given the same day does not activate B cells unless those helper cells join in.$sc$,
  $qu$Which of the following lets the sugar vaccine activate B cells alone?$qu$,
  $op${"options": ["The sugar is presented on a class II groove to a helper cell first", "The sugar must switch from IgM to IgG before any activation", "Mast cells must release histamine before the B cell responds", "Repeating units cross-link surface antibody without T-cell help", "The sugar crosses the placenta and returns as passive antibody"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "t-independent-polysaccharide", "taskCategory": "mechanism"}$op$,
  $ky$Repeating units cross-link surface antibody without T-cell help$ky$,
  $ex$The best choice is "Repeating units cross-link surface antibody without T-cell help". Repeating carbohydrates cross-link B-cell surface antibody and activate the cell without T-cell cytokines. Her sugar vaccine did that. The protein vaccine given the same day still needed helper T cells, which is the T-dependent pattern. "The sugar is presented on a class II groove to a helper cell first" is not the best choice because Peptide display on class II MHC is how a B cell gets help for a protein antigen. The sugar vaccine activated B cells without that help. "The sugar must switch from IgM to IgG before any activation" is not the best choice because Class switching happens after activation. It is not required before the sugar can cross-link the receptor. "Mast cells must release histamine before the B cell responds" is not the best choice because Mast-cell histamine is an IgE effector event, not the trigger for this capsular-sugar vaccine. "The sugar crosses the placenta and returns as passive antibody" is not the best choice because Placental transfer is passive IgG. She is 4 years old and received a vaccine.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', 'e7573cdb763542c821895e70c8e3325d50b67ef90bfe7239c021ec5a39bec0af', false, NOW(), NOW(), 4,
  't-independent-polysaccharide', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 't-independent-polysaccharide', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-094", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "D", "verifiedFact": "T cell-independent antigens are typically repeating carbohydrates on bacterial walls. They cross-link surface antibody and activate the B cell without T-cell cytokines. Proteins usually need helper T cells."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280095', 'usmle-step-1', 'immunology',
  $sc$A developing B cell in a 6-year-old boy's marrow binds strongly to a protein displayed on the surface of neighboring marrow cells. Temperature is 36.7°C, pulse is 88/min, respirations are 18/min, and blood pressure is 96/60 mm Hg. The immature cell then dies by apoptosis and never leaves the marrow. A second immature cell that meets only a soluble self protein becomes unresponsive but is not killed.$sc$,
  $qu$Which of the following is the fate of the cell that bound the surface self protein?$qu$,
  $op${"options": ["It leaves and secretes high-affinity antibody to self", "It becomes a memory cell aimed at that self molecule", "It changes class and enters the mucosal secretions", "It only becomes unresponsive, which is the second cell's fate", "Programmed cell death removes it before it can exit that organ"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "clonal-deletion-bone-marrow", "taskCategory": "mechanism"}$op$,
  $ky$Programmed cell death removes it before it can exit that organ$ky$,
  $ex$The best choice is "Programmed cell death removes it before it can exit that organ". Strong binding of an immature B cell to self antigen on tissues in the marrow signals apoptosis, which is clonal deletion. This cell bound a surface self protein and died before leaving. The second cell, exposed to soluble self protein, is the one that becomes unresponsive without being killed. "It leaves and secretes high-affinity antibody to self" is not the best choice because Deletion removes the cell. It does not leave and secrete self antibody. "It becomes a memory cell aimed at that self molecule" is not the best choice because Memory cells come from clonal expansion after a foreign antigen, not from a cell that died in the marrow. "It changes class and enters the mucosal secretions" is not the best choice because Class switching to IgA is a later response to foreign antigen, not the fate of a deleted immature cell. "It only becomes unresponsive, which is the second cell's fate" is not the best choice because Unresponsiveness without death is the fate of the second cell, which met soluble antigen. The first cell was killed.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '2b848ff17a6e51d9c416a0fed3feda0af78931b6e886bff3134e21b95514bda7', false, NOW(), NOW(), 3,
  'clonal-deletion-bone-marrow', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'clonal-deletion-bone-marrow', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-095", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "E", "verifiedFact": "Central tolerance deletes or inactivates self-reactive B cells in the bone marrow. Strong binding to self antigen on tissues causes clonal deletion by apoptosis. Soluble self antigen causes anergy instead."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280096', 'usmle-step-1', 'immunology',
  $sc$A 26-year-old woman who illustrates maps has a marrow sample 2 weeks after a booster vaccine. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The sample contains cells that have left the lymph node, make large amounts of antibody, show almost no surface antibody, and are not expected to divide further. They die after the secretory period.$sc$,
  $qu$Which of the following best describes these marrow cells?$qu$,
  $op${"options": ["Terminally differentiated cells devoted to antibody secretion", "Naive cells displaying two surface classes and secreting neither", "Memory cells that wait without secreting until the next exposure", "Helper cells that must display peptide to finish B-cell activation", "Phagocytes that line hepatic sinusoids and clear bacteria"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "plasma-cell-terminal", "taskCategory": "mechanism"}$op$,
  $ky$Terminally differentiated cells devoted to antibody secretion$ky$,
  $ex$The best choice is "Terminally differentiated cells devoted to antibody secretion". Plasma cells often return to the marrow, secrete antibody, lack surface antibody, and die after that secretory period because they do not maintain themselves. They are terminally differentiated. These cells match that description 2 weeks after a booster. "Naive cells displaying two surface classes and secreting neither" is not the best choice because Naive B cells display IgM and IgD and have not yet responded. These cells are secreting and have almost no surface antibody. "Memory cells that wait without secreting until the next exposure" is not the best choice because Memory cells are the ones that persist for a faster later response. The cells here are secreting and then die. "Helper cells that must display peptide to finish B-cell activation" is not the best choice because Helper T cells provide cytokines. They are not the marrow cells packed with antibody secretion. "Phagocytes that line hepatic sinusoids and clear bacteria" is not the best choice because Kupffer cells are liver phagocytes, not antibody-secreting marrow cells.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '32db901c82922fc20c17df3fb6c70f0c7b545033bc25a52b656c6f44df4b2eed', false, NOW(), NOW(), 2,
  'plasma-cell-terminal', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'plasma-cell-terminal', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-096", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "A", "verifiedFact": "After activation, B cells become plasma cells, which often return to the bone marrow, secrete antibody, and then die. They are terminally differentiated and do not maintain themselves."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280097', 'usmle-step-1', 'immunology',
  $sc$A 22-year-old man who repairs bikes receives antigen A on day 0 and again on day 60, and antigen B for the first time on day 60. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Antibody to A is low and delayed after the first dose, then rises immediately and much higher after the second dose. Antibody to B, given once, is low and delayed.$sc$,
  $qu$Which of the following best explains the immediate high rise to antigen A only?$qu$,
  $op${"options": ["Antigen B is a repeating sugar and needs no helper-cell signal", "He has already met A, so the next exposure is prompt and larger", "Both antigens are crossing the placenta in a newborn", "Antigen A is bound to mast cells and antigen B is not", "Both responses are passive transfers of someone else's antibody"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "secondary-response-faster", "taskCategory": "mechanism"}$op$,
  $ky$He has already met A, so the next exposure is prompt and larger$ky$,
  $ex$The best choice is "He has already met A, so the next exposure is prompt and larger". A second encounter with the same antigen produces antibody without the delay of the primary response, and in larger amount. A different antigen starts a new primary response, low and delayed. A was given twice and rose immediately the second time. B was given once and stayed in the delayed low pattern. "Antigen B is a repeating sugar and needs no helper-cell signal" is not the best choice because Nothing in the study says B is a repeating sugar. Its curve is a first exposure. "Both antigens are crossing the placenta in a newborn" is not the best choice because He is 22 years old. Placental transfer is not this paired immunization. "Antigen A is bound to mast cells and antigen B is not" is not the best choice because Mast-cell binding is the IgE allergy pattern. It does not explain the two laboratory curves. "Both responses are passive transfers of someone else's antibody" is not the best choice because He made the responses after the antigens were given to him. They are not a transfer of another person's antibody.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '4e87cd7da160928b72ac84d814308f60bc092fc61f928fa832a2029c88c106a1', false, NOW(), NOW(), 2,
  'secondary-response-faster', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'secondary-response-faster', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-097", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "B", "verifiedFact": "The primary antibody response is delayed several days and is lower. A second exposure to the same antigen has no delay and produces much more antibody. A new antigen starts another primary response."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280098', 'usmle-step-1', 'immunology',
  $sc$A 33-year-old woman who teaches violin has bacteria in a blood culture. Temperature is 38.6°C, pulse is 108/min, respirations are 20/min, and blood pressure is 100/62 mm Hg. Antibody coats the organisms. A phagocyte grabs the organisms only when its receptor binds the tail of that antibody, the portion made by the two heavy chains, not the antigen-binding end.$sc$,
  $qu$Which of the following part of the antibody did the phagocyte bind?$qu$,
  $op${"options": ["The antigen-binding end, which is made only of light chain", "A secreted pentamer's extra J piece and nothing else", "The heavy-chain tail, not the antigen-binding end", "The groove of a class II molecule on the phagocyte", "A T-cell receptor that the phagocyte borrowed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "fc-region-effector-cells", "taskCategory": "mechanism"}$op$,
  $ky$The heavy-chain tail, not the antigen-binding end$ky$,
  $ex$The best choice is "The heavy-chain tail, not the antigen-binding end". The Fc portion is formed by the two heavy chains and is what Fc receptors on effector cells bind, allowing those cells to grab antibody-coated pathogens. The phagocyte bound the tail made by the heavy chains, not the antigen-binding end. "The antigen-binding end, which is made only of light chain" is not the best choice because The antigen-binding sites are at the other end of the molecule and include both heavy and light chain. The phagocyte did not bind that end. "A secreted pentamer's extra J piece and nothing else" is not the best choice because IgM is a pentamer, but the vignette identifies the bound piece as the heavy-chain tail, not a J chain. "The groove of a class II molecule on the phagocyte" is not the best choice because Class II MHC displays peptide to T cells. The phagocyte bound antibody tail on a coated organism. "A T-cell receptor that the phagocyte borrowed" is not the best choice because The phagocyte used its own receptor for the antibody tail. It did not borrow a T-cell receptor.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '61b76d194fdee704ce87bff5b2d53907dfbb14c239f42ec811447d8147dec820', false, NOW(), NOW(), 3,
  'fc-region-effector-cells', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'fc-region-effector-cells', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-098", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "C", "verifiedFact": "The Fc region is formed by the two heavy chains and is bound by Fc receptors on effector cells, which can then attach to antibody-coated pathogens."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280099', 'usmle-step-1', 'immunology',
  $sc$A 15-year-old boy who folds maps receives a pure protein vaccine. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 106/64 mm Hg. His B cells bind the intact protein, internalize it, and display a peptide fragment. Antibody appears only after a helper cell recognizes that fragment and releases cytokines onto the B cell. Without the helper cell, contact alone does not finish activation.$sc$,
  $qu$Which of the following pair of signals finished the activation?$qu$,
  $op${"options": ["Cross-linking by a repeating sugar, without helper cells", "A single signal consisting of mast-cell histamine", "Passive transfer of antibody without a B-cell event", "Intact-protein binding plus a helper-cell chemical signal", "Removal of the B cell because the protein was self"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "t-dependent-two-signals", "taskCategory": "mechanism"}$op$,
  $ky$Intact-protein binding plus a helper-cell chemical signal$ky$,
  $ex$The best choice is "Intact-protein binding plus a helper-cell chemical signal". Protein antigens usually need two signals: surface immunoglobulin binding native antigen, and cytokines from a helper T cell that saw peptide on class II MHC. His B cells bound and displayed the protein, and antibody appeared only after the helper cell released cytokines. Binding alone was not enough. "Cross-linking by a repeating sugar, without helper cells" is not the best choice because Repeating sugar can activate B cells without help. This vaccine is a pure protein, and help was required. "A single signal consisting of mast-cell histamine" is not the best choice because Histamine release is an allergic effector step, not the second signal for this protein vaccine. "Passive transfer of antibody without a B-cell event" is not the best choice because He made antibody after a helper cell joined. That is not passive transfer. "Removal of the B cell because the protein was self" is not the best choice because Marrow deletion removes self-reactive immature cells. This protein vaccine activated a response rather than deleting the clone.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', '8c4ad24ee4bf155fc8225efdc177625eb72ec8fdb8987f4e574af63f359c3963', false, NOW(), NOW(), 4,
  't-dependent-two-signals', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 't-dependent-two-signals', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-099", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "D", "verifiedFact": "A protein antigen usually does not cross-link B-cell antibody enough. Full activation needs two signals: surface immunoglobulin binding native antigen, and cytokines from a helper T cell that recognized peptide on class II MHC."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280100', 'usmle-step-1', 'immunology',
  $sc$A mature B cell in a 40-year-old man's lymph node binds one of his own proteins. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. No helper cell that recognizes the same protein provides a cytokine signal. The B cell then dies. A neighboring B cell that binds a foreign protein and does receive the helper signal goes on to secrete antibody.$sc$,
  $qu$Which of the following caused the self-binding cell to die?$qu$,
  $op${"options": ["It bound a repeating bacterial sugar and was fully activated", "It received helper cytokines and therefore underwent class switching", "It was a plasma cell that had already finished secreting", "It crossed the placenta as already-made maternal antibody", "It recognized a self molecule and never got help from a T cell"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "peripheral-tolerance-needs-t-help", "taskCategory": "mechanism"}$op$,
  $ky$It recognized a self molecule and never got help from a T cell$ky$,
  $ex$The best choice is "It recognized a self molecule and never got help from a T cell". Most protein antigens need a helper T-cell signal. A mature B cell that binds self antigen and does not receive that signal is driven to apoptosis. This cell bound his own protein, got no helper cytokine, and died. The neighbor that bound foreign protein and did get help secreted antibody. "It bound a repeating bacterial sugar and was fully activated" is not the best choice because A repeating sugar can activate a B cell without help. This cell bound a self protein and died, so it was not activated by a sugar. "It received helper cytokines and therefore underwent class switching" is not the best choice because Helper cytokines would have pushed the cell toward antibody, as happened to the neighbor. This cell did not receive them. "It was a plasma cell that had already finished secreting" is not the best choice because Plasma cells are already secreting and then die after that work. This cell died because help never came, before secretion. "It crossed the placenta as already-made maternal antibody" is not the best choice because Placental transfer moves IgG, not a lymph-node B cell.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "blood-lymph-immune", "mechanism", "immunology"]$tg$,
  's1-new-20261128-hidden', 'bfbab6d6ca8b672662144d64fc5430a67e4c37d793d11c8b947e98c726de432e', false, NOW(), NOW(), 4,
  'peripheral-tolerance-needs-t-help', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'peripheral-tolerance-needs-t-help', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 1, "code": "S1N-100", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies", "nutrition": false, "keyLetter": "E", "verifiedFact": "Peripheral tolerance: a mature B cell that binds self antigen but receives no helper T-cell signal undergoes apoptosis. Most protein antigens need that Th2 signal."}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s1_new_20261128_b01_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's1n202611280001',
    's1n202611280002',
    's1n202611280003',
    's1n202611280004',
    's1n202611280005',
    's1n202611280006',
    's1n202611280007',
    's1n202611280008',
    's1n202611280009',
    's1n202611280010',
    's1n202611280011',
    's1n202611280012',
    's1n202611280013',
    's1n202611280014',
    's1n202611280015',
    's1n202611280016',
    's1n202611280017',
    's1n202611280018',
    's1n202611280019',
    's1n202611280020',
    's1n202611280021',
    's1n202611280022',
    's1n202611280023',
    's1n202611280024',
    's1n202611280025',
    's1n202611280026',
    's1n202611280027',
    's1n202611280028',
    's1n202611280029',
    's1n202611280030',
    's1n202611280031',
    's1n202611280032',
    's1n202611280033',
    's1n202611280034',
    's1n202611280035',
    's1n202611280036',
    's1n202611280037',
    's1n202611280038',
    's1n202611280039',
    's1n202611280040',
    's1n202611280041',
    's1n202611280042',
    's1n202611280043',
    's1n202611280044',
    's1n202611280045',
    's1n202611280046',
    's1n202611280047',
    's1n202611280048',
    's1n202611280049',
    's1n202611280050',
    's1n202611280051',
    's1n202611280052',
    's1n202611280053',
    's1n202611280054',
    's1n202611280055',
    's1n202611280056',
    's1n202611280057',
    's1n202611280058',
    's1n202611280059',
    's1n202611280060',
    's1n202611280061',
    's1n202611280062',
    's1n202611280063',
    's1n202611280064',
    's1n202611280065',
    's1n202611280066',
    's1n202611280067',
    's1n202611280068',
    's1n202611280069',
    's1n202611280070',
    's1n202611280071',
    's1n202611280072',
    's1n202611280073',
    's1n202611280074',
    's1n202611280075',
    's1n202611280076',
    's1n202611280077',
    's1n202611280078',
    's1n202611280079',
    's1n202611280080',
    's1n202611280081',
    's1n202611280082',
    's1n202611280083',
    's1n202611280084',
    's1n202611280085',
    's1n202611280086',
    's1n202611280087',
    's1n202611280088',
    's1n202611280089',
    's1n202611280090',
    's1n202611280091',
    's1n202611280092',
    's1n202611280093',
    's1n202611280094',
    's1n202611280095',
    's1n202611280096',
    's1n202611280097',
    's1n202611280098',
    's1n202611280099',
    's1n202611280100'
);
COMMIT;
