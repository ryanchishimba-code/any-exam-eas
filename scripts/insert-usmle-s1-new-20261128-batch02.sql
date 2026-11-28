-- Hidden Step 1 batch 2 of the 2026-11-28 set.
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
  's1n202611280101', 'usmle-step-1', 'physiology',
  $sc$A 58-year-old man who repairs clocks has a pulse of 78/min at rest. Temperature is 36.6°C, respirations are 14/min, and blood pressure is 128/76 mm Hg. Mapping shows the earliest electrical signal arising in the superior posterior right atrium, next to the superior vena cava. No other site fires before it. He takes no heart medicine.$sc$,
  $qu$Which of the following best describes the site that fires first?$qu$,
  $op${"options": ["The conducting cells with the fastest inherent rate", "The node that pauses about 100 ms before the ventricles", "The fibers that carry the impulse from the apex upward", "The contractile cells that form 99 percent of the myocardium", "The band that reaches the right papillary muscle early"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "sa-node-pacemaker", "taskCategory": "mechanism"}$op$,
  $ky$The conducting cells with the fastest inherent rate$ky$,
  $ex$The best choice is "The conducting cells with the fastest inherent rate". The SA node in the superior posterior right atrium beside the superior vena cava has the highest inherent rate and sets the rhythm. His earliest signal is at that site, and nothing fires before it. "The node that pauses about 100 ms before the ventricles" is not the best choice because The AV node is the pause of about 100 ms. It is not the first site to fire. "The fibers that carry the impulse from the apex upward" is not the best choice because Purkinje fibers spread the impulse from the apex toward the base after the ventricles are reached. They are not the first site. "The contractile cells that form 99 percent of the myocardium" is not the best choice because Contractile cells are 99 percent of the atrial and ventricular muscle and wait for an impulse. They do not set the earliest signal. "The band that reaches the right papillary muscle early" is not the best choice because The moderator band carries the impulse to the right papillary muscle. It is not the origin next to the superior vena cava.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '1fb7487f265a0059c37c556727e5ee5472757ff2261f66e02878efa3b6cda1d2', false, NOW(), NOW(), 2,
  'sa-node-pacemaker', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sa-node-pacemaker', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-101", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "A", "verifiedFact": "The SA node, in the superior posterior right atrium near the SVC, has the highest inherent depolarization rate and is the pacemaker."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280102', 'usmle-step-1', 'physiology',
  $sc$A 46-year-old woman who teaches flute has a tracing in which atrial contraction finishes before the ventricles begin to contract. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. The pause between those two events is about 100 ms. The connective tissue of the cardiac skeleton blocks any direct muscle-to-muscle spread into the ventricles.$sc$,
  $qu$Which of the following is the purpose of that pause?$qu$,
  $op${"options": ["The ventricles repolarize before the atria have depolarized", "The atria empty into the ventricles before ventricular contraction", "The papillary muscles relax so the valves can prolapse", "Calcium entry during the plateau is prevented entirely", "The fastest atrial cells are stopped from firing at all"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "av-node-delay", "taskCategory": "mechanism"}$op$,
  $ky$The atria empty into the ventricles before ventricular contraction$ky$,
  $ex$The best choice is "The atria empty into the ventricles before ventricular contraction". The roughly 100 ms delay through the AV node lets atrial contraction finish pumping blood into the ventricles before the ventricular impulse. The cardiac skeleton blocks a direct path, so the pause is the only route, and her tracing shows atrial emptying first. "The ventricles repolarize before the atria have depolarized" is not the best choice because Ventricular repolarization is the T wave, after the QRS. The pause here is before ventricular contraction, not a reversal of that order. "The papillary muscles relax so the valves can prolapse" is not the best choice because Papillary muscles are timed to tense the chordae just before ventricular ejection. The pause is not for them to relax. "Calcium entry during the plateau is prevented entirely" is not the best choice because The plateau depends on calcium entry. The AV delay does not abolish that entry. "The fastest atrial cells are stopped from firing at all" is not the best choice because The fastest cells, in the SA node, are what start the impulse. The pause does not silence them.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '186c297fde4f3bd86794746829d2e86706a7ae24d8abd21dddef97eb07c3f38b', false, NOW(), NOW(), 2,
  'av-node-delay', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'av-node-delay', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-102", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "The impulse takes about 100 ms to pass the AV node, so the atria finish pumping blood into the ventricles before the ventricles are stimulated."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280103', 'usmle-step-1', 'physiology',
  $sc$A 63-year-old man who lays brick has ventricular contraction that begins at the apex and moves toward the base. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 134/78 mm Hg. The electrical signal reaches the ventricular muscle cells in about 75 ms after it leaves the bundle branches. Stroke volume on the study is 70 mL.$sc$,
  $qu$Which of the following does this apex-to-base sequence accomplish?$qu$,
  $op${"options": ["The atria fill from the venae cavae during systole", "The AV valves are forced open by ventricular contraction", "Blood is ejected into the aorta and pulmonary trunk", "Atrial repolarization is drawn as its own separate wave", "The atrial pacemaker is reset to the ventricular rate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "purkinje-apex-to-base", "taskCategory": "mechanism"}$op$,
  $ky$Blood is ejected into the aorta and pulmonary trunk$ky$,
  $ex$The best choice is "Blood is ejected into the aorta and pulmonary trunk". Because the impulse starts at the apex and travels toward the base, contraction squeezes the ventricles from the bottom and ejects blood into the aorta and pulmonary trunk. His contraction follows that direction, and the 75 ms spread matches the fast ventricular conducting fibers. "The atria fill from the venae cavae during systole" is not the best choice because Atrial filling from the venae cavae is not produced by the apex-to-base ventricular squeeze. "The AV valves are forced open by ventricular contraction" is not the best choice because Ventricular contraction closes the AV valves. It does not force them open. "Atrial repolarization is drawn as its own separate wave" is not the best choice because Atrial repolarization is hidden inside the QRS. The apex-to-base squeeze does not create a separate wave for it. "The atrial pacemaker is reset to the ventricular rate" is not the best choice because The SA node remains the fastest pacemaker. Ventricular conduction does not reset it to the ventricular rate.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '41d1062c8cab4ff32f5ef02e8f288a4cd9edeb12eaf5a128954ae1a82bfd8ca7', false, NOW(), NOW(), 3,
  'purkinje-apex-to-base', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'purkinje-apex-to-base', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-103", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "Purkinje fibers spread the impulse from the apex toward the base so ventricular contraction squeezes blood out into the aorta and pulmonary trunk, like squeezing a tube from the bottom."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280104', 'usmle-step-1', 'physiology',
  $sc$A 51-year-old woman who edits film has a ventricular muscle-cell recording. Temperature is 36.5°C, pulse is 68/min, respirations are 12/min, and blood pressure is 122/74 mm Hg. After a rapid rise to about +30 mV, the membrane stays depolarized for about 175 ms while calcium enters and little potassium leaves. A second stimulus during that time produces no new action potential.$sc$,
  $qu$Which of the following accounts for the long depolarized interval?$qu$,
  $op${"options": ["A stable sodium leak from minus 60 mV with no calcium", "Potassium exit alone, with calcium channels kept shut", "Chloride entry from the plasma into the myocyte", "Slow calcium entry while few potassium channels are open", "Opening of fast sodium channels for the entire 175 ms"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "contractile-plateau-calcium", "taskCategory": "mechanism"}$op$,
  $ky$Slow calcium entry while few potassium channels are open$ky$,
  $ex$The best choice is "Slow calcium entry while few potassium channels are open". The contractile-cell plateau lasts about 175 ms because slow calcium channels are open and few potassium channels are open. A second stimulus fails during that time, which is the long refractory period this plateau creates. The recording matches that interval and that ion pattern. "A stable sodium leak from minus 60 mV with no calcium" is not the best choice because A slow sodium rise from about −60 mV is the pacemaker prepotential, not this 175 ms plateau after a spike to +30 mV. "Potassium exit alone, with calcium channels kept shut" is not the best choice because Potassium exit repolarizes the cell. If calcium channels stayed shut, there would be no prolonged depolarized interval. "Chloride entry from the plasma into the myocyte" is not the best choice because The plateau is not described as chloride entry. "Opening of fast sodium channels for the entire 175 ms" is not the best choice because Fast sodium channels open for the 3–5 ms spike and then close. They are not open for the whole 175 ms.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'dc8f4cfbe6d2379705d1684d9759bba9f044b5fbdee14bd00244b34f1f7edaad', false, NOW(), NOW(), 3,
  'contractile-plateau-calcium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'contractile-plateau-calcium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-104", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "D", "verifiedFact": "In contractile cells the plateau lasts about 175 ms because slow calcium channels let calcium in while few potassium channels are open. That long plateau creates a long refractory period."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280105', 'usmle-step-1', 'physiology',
  $sc$A 44-year-old man who tunes pianos has a ventricular cell study. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. During the long depolarized phase, calcium entering from outside supplies about one-fifth of the calcium used for contraction. The rest comes from an internal store. Cross-bridge cycling then starts.$sc$,
  $qu$Which of the following is the internal store and the trigger protein?$qu$,
  $op${"options": ["Mitochondrial calcium, then binding to myosin heads", "Extracellular calcium only, with no internal store", "Nuclear calcium, then binding to actin monomers", "T-tubule sodium, then binding to tropomyosin alone", "Sarcoplasmic reticulum calcium, then binding to troponin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "calcium-troponin-and-sr", "taskCategory": "mechanism"}$op$,
  $ky$Sarcoplasmic reticulum calcium, then binding to troponin$ky$,
  $ex$The best choice is "Sarcoplasmic reticulum calcium, then binding to troponin". About 20 percent of contraction calcium enters during the plateau. The remaining 80 percent is released from the sarcoplasmic reticulum. Calcium binds troponin, moving tropomyosin so myosin can cross-bridge with actin. The study shows the one-fifth outside fraction and an internal store. "Mitochondrial calcium, then binding to myosin heads" is not the best choice because The internal store named for this calcium is the sarcoplasmic reticulum, not mitochondria, and the regulatory protein is troponin, not the myosin head itself. "Extracellular calcium only, with no internal store" is not the best choice because Outside calcium is only about 20 percent. Most comes from the internal store. "Nuclear calcium, then binding to actin monomers" is not the best choice because The nucleus is not the calcium store for the power stroke, and calcium does not bind actin monomers to start the bridge. "T-tubule sodium, then binding to tropomyosin alone" is not the best choice because T tubules carry the impulse inward. The ion that binds the regulatory protein is calcium, not sodium.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c22d668d88d7af46710a670bab46b7c82171c40c9227748e4656fe1c365c8424', false, NOW(), NOW(), 3,
  'calcium-troponin-and-sr', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'calcium-troponin-and-sr', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-105", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "E", "verifiedFact": "About 20 percent of the calcium for contraction enters during the plateau. The rest is released from the sarcoplasmic reticulum. Calcium binds troponin and allows myosin to cross-bridge with actin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280106', 'usmle-step-1', 'physiology',
  $sc$A 36-year-old woman who coaches swimming has a 12-lead tracing. Temperature is 36.6°C, pulse is 64/min, respirations are 12/min, and blood pressure is 110/68 mm Hg. A small deflection comes first, then a large sharp deflection, then a broader deflection. Atrial recovery is not seen as its own wave. The ventricles start contracting as the large deflection reaches its peak.$sc$,
  $qu$Which of the following is the large sharp deflection?$qu$,
  $op${"options": ["Depolarization of the ventricular muscle mass", "Depolarization of the thinner atrial muscle", "Repolarization of the ventricular muscle mass", "Repolarization of atrial muscle shown by itself", "Only the pause spent inside the lower atrial node"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "ecg-p-qrs-t", "taskCategory": "mechanism"}$op$,
  $ky$Depolarization of the ventricular muscle mass$ky$,
  $ex$The best choice is "Depolarization of the ventricular muscle mass". The QRS complex is the large deflection of ventricular depolarization, large because the ventricular muscle mass is large. Contraction begins as it reaches the R-wave peak. Her tracing has that large sharp wave, and atrial recovery is not its own wave. "Depolarization of the thinner atrial muscle" is not the best choice because Atrial depolarization is the small first deflection, not the large one. "Repolarization of the ventricular muscle mass" is not the best choice because Ventricular repolarization is the broader wave after the large deflection. "Repolarization of atrial muscle shown by itself" is not the best choice because Atrial repolarization occurs during the large deflection and is masked. It is not drawn as its own wave. "Only the pause spent inside the lower atrial node" is not the best choice because The AV-node delay is measured by the interval from the start of the small wave to the start of the large one. It is not the large deflection itself.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'b3915fa208438b0c2942076d733e54dbfeae8c5c9c0d0e88e5d9f933d66b8238', false, NOW(), NOW(), 2,
  'ecg-p-qrs-t', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ecg-p-qrs-t', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-106", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "A", "verifiedFact": "The P wave is atrial depolarization. The QRS is ventricular depolarization. The T wave is ventricular repolarization. Atrial repolarization is hidden in the QRS."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280107', 'usmle-step-1', 'physiology',
  $sc$A 70-year-old man who keeps a hardware store has a tracing in which the time from the start of atrial depolarization to the start of the ventricular deflection is prolonged. Temperature is 36.7°C, pulse is 54/min, respirations are 14/min, and blood pressure is 146/70 mm Hg. The ventricular deflection itself is narrow. He is not taking a sodium-channel blocker.$sc$,
  $qu$Which of the following conduction step is prolonged?$qu$,
  $op${"options": ["Spread through the ventricular muscle after the apex", "Passage from the atrial pacemaker to the AV node", "Repolarization of the ventricles after contraction", "Filling of the atria from the venae cavae", "Ejection from the apex into the great arteries"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "pr-interval-av-delay", "taskCategory": "mechanism"}$op$,
  $ky$Passage from the atrial pacemaker to the AV node$ky$,
  $ex$The best choice is "Passage from the atrial pacemaker to the AV node". The PR interval starts at the beginning of atrial depolarization and ends at the start of the QRS. A delay from the SA node to the AV node lengthens it. His ventricular deflection is narrow, so the delay is before the ventricles, not inside ventricular muscle. "Spread through the ventricular muscle after the apex" is not the best choice because Ventricular spread after the apex is inside the QRS. That deflection is narrow. "Repolarization of the ventricles after contraction" is not the best choice because Ventricular repolarization is the T wave, after the QRS, not the interval that starts atrial depolarization. "Filling of the atria from the venae cavae" is not the best choice because Atrial filling is a mechanical event. The prolonged measurement is electrical, from atrial depolarization to the ventricular deflection. "Ejection from the apex into the great arteries" is not the best choice because Ejection is mechanical and follows the QRS. It is not the interval that ends when the QRS begins.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '43f0dca437df3e77dfb26e0a5a35f8adaeb79a894ba913aa54b438e3d75ffe95', false, NOW(), NOW(), 3,
  'pr-interval-av-delay', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'pr-interval-av-delay', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-107", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "The PR interval runs from the start of the P wave to the start of the QRS and shows delay from the SA node to the AV node."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280108', 'usmle-step-1', 'physiology',
  $sc$A 76-year-old woman who catalogues stamps has no electrical activity from the usual atrial pacemaker. Temperature is 36.5°C, pulse is 48/min, respirations are 16/min, and blood pressure is 108/60 mm Hg. The ventricles still follow a regular atrial signal that starts lower in the right atrium, inside the septum. There is a pause before each ventricular deflection. She is awake and talking.$sc$,
  $qu$Which of the following rate range fits this backup site?$qu$,
  $op${"options": ["About 80 to 100 spontaneous impulses each minute", "About 15 to 20 spontaneous impulses each minute", "About 40 to 60 spontaneous impulses each minute", "About 20 to 30 spontaneous impulses each minute", "A rate faster than the silenced atrial pacemaker"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "escape-av-rate", "taskCategory": "mechanism"}$op$,
  $ky$About 40 to 60 spontaneous impulses each minute$ky$,
  $ex$The best choice is "About 40 to 60 spontaneous impulses each minute". If the SA node is silent, the AV node, low in the right atrium within the septum, fires at about 40–60 per minute and still imposes a pause before the ventricles. Her pulse is 48 and the signal starts at that septal site. "About 80 to 100 spontaneous impulses each minute" is not the best choice because 80–100 per minute is the inherent SA-node rate, which is silent here. "About 15 to 20 spontaneous impulses each minute" is not the best choice because 15–20 per minute is the Purkinje rate, too slow for a pulse of 48 with an atrial signal still present. "About 20 to 30 spontaneous impulses each minute" is not the best choice because 20–30 per minute is the bundle-branch rate, below her observed rate and not an atrial septal start. "A rate faster than the silenced atrial pacemaker" is not the best choice because Backup sites are slower than the SA node, not faster. The fastest site is the one that was silenced.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'dc7d1478206dadbc12674ddd6655200cca9d7e1cce97879b37fcab88ed5457b4', false, NOW(), NOW(), 3,
  'escape-av-rate', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'escape-av-rate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-108", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "Without the SA node, the AV node fires at about 40\u201360 per minute. The AV bundle fires at about 30\u201340, bundle branches at 20\u201330, and Purkinje fibers at 15\u201320."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280109', 'usmle-step-1', 'physiology',
  $sc$A 59-year-old man who sands floors has a mucus plug blocking one group of alveoli. Temperature is 37.1°C, pulse is 96/min, respirations are 22/min, and blood pressure is 138/82 mm Hg. Oxygen in those alveoli falls. Arterioles serving them narrow, and blood flow shifts toward neighboring alveoli that still receive air. Airway diameter does not change in the plugged region.$sc$,
  $qu$Which of the following is the purpose of the narrowed arterioles?$qu$,
  $op${"options": ["All pulmonary arterioles dilate when alveolar oxygen falls", "Bronchioles constrict so carbon dioxide is retained", "Oxygen is pumped across the membrane using ATP", "Blood is sent to alveoli that are still being ventilated", "Nitrogen dissolves into plasma in large amounts"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "hypoxic-pulmonary-vasoconstriction", "taskCategory": "mechanism"}$op$,
  $ky$Blood is sent to alveoli that are still being ventilated$ky$,
  $ex$The best choice is "Blood is sent to alveoli that are still being ventilated". Poorly ventilated alveoli have low oxygen, and the arterioles serving them constrict so blood is redirected to alveoli that are ventilated. His plug drops alveolar oxygen, those arterioles narrow, and flow moves to aerated neighbors. The airways themselves are not the vessels that changed. "All pulmonary arterioles dilate when alveolar oxygen falls" is not the best choice because High alveolar oxygen dilates pulmonary arterioles. A fall in oxygen does the opposite in the plugged region. "Bronchioles constrict so carbon dioxide is retained" is not the best choice because High alveolar carbon dioxide widens bronchioles. The change described is arteriolar narrowing, not airway constriction. "Oxygen is pumped across the membrane using ATP" is not the best choice because Oxygen crosses the respiratory membrane by diffusion down a partial-pressure gradient. The membrane step does not use ATP. "Nitrogen dissolves into plasma in large amounts" is not the best choice because Nitrogen solubility in blood is very low at ordinary pressures. That is not why these arterioles narrowed.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '92ee5c57198500769bd6d60d28a889d74c12654212174df076f75593d636150c', false, NOW(), NOW(), 3,
  'hypoxic-pulmonary-vasoconstriction', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'hypoxic-pulmonary-vasoconstriction', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-109", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "D", "verifiedFact": "When an alveolus is poorly ventilated, pulmonary arterioles to that alveolus constrict and blood is redirected to better ventilated alveoli. High alveolar oxygen dilates those arterioles."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280110', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old woman who teaches chemistry compares two gradients at the alveolar membrane. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. The oxygen difference between alveolus and incoming capillary blood is about 64 mm Hg. The carbon dioxide difference is only about 5 mm Hg. Similar amounts of the two gases still cross.$sc$,
  $qu$Which of the following lets carbon dioxide cross despite the smaller gradient?$qu$,
  $op${"options": ["It is actively pumped by a membrane ATPase", "It binds troponin and is carried that way", "It moves only when nitrogen solubility is high", "It uses the same gradient direction as tissue oxygen", "It is far more soluble in blood and alveolar fluid"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "co2-more-soluble-than-o2", "taskCategory": "mechanism"}$op$,
  $ky$It is far more soluble in blood and alveolar fluid$ky$,
  $ex$The best choice is "It is far more soluble in blood and alveolar fluid". Carbon dioxide's partial-pressure difference is only about 5 mm Hg, versus about 64 mm Hg for oxygen, but carbon dioxide is about 20 times more soluble in blood and alveolar fluid. Similar amounts therefore cross. Her two gradients match those figures. "It is actively pumped by a membrane ATPase" is not the best choice because Both gases cross by simple diffusion. No ATP is used at the respiratory membrane. "It binds troponin and is carried that way" is not the best choice because Troponin binds calcium in muscle. It is not the carrier that explains carbon dioxide diffusion. "It moves only when nitrogen solubility is high" is not the best choice because Nitrogen solubility in blood is very low. Carbon dioxide movement does not depend on nitrogen being highly soluble. "It uses the same gradient direction as tissue oxygen" is not the best choice because At the tissues, oxygen leaves the blood. At the alveolus, carbon dioxide leaves the blood. Those are not the same gradient direction for oxygen.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '0923de5d4e035f0c17cd70e7149867844a36569e7ae22a5bbceacbc7aeeddf1b', false, NOW(), NOW(), 4,
  'co2-more-soluble-than-o2', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'co2-more-soluble-than-o2', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-110", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "E", "verifiedFact": "The CO2 partial-pressure difference from capillary to alveolus is only about 5 mm Hg (45 vs 40), versus about 64 mm Hg for oxygen (104 vs 40). CO2 is about 20 times more soluble, so similar amounts of the two gases still cross."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280111', 'usmle-step-1', 'physiology',
  $sc$A 49-year-old man who flies cargo planes has both atria depolarizing together. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 126/74 mm Hg. A specialized band carries the impulse from the right atrium straight across to the left atrium. The ventricles have not yet been activated.$sc$,
  $qu$Which of the following is the job of that interatrial band?$qu$,
  $op${"options": ["It conducts the signal from one upper chamber to the other", "It delays the impulse for about 100 ms at the septum", "It spreads the impulse from the apex toward the base", "It tenses the right papillary muscle before ejection", "It blocks all conduction across the cardiac skeleton"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "bachmann-left-atrium", "taskCategory": "anatomy"}$op$,
  $ky$It conducts the signal from one upper chamber to the other$ky$,
  $ex$The best choice is "It conducts the signal from one upper chamber to the other". Bachmann's bundle conducts the impulse directly from the right atrium to the left atrium. Both atria are depolarizing, the ventricles are not yet active, and the band runs between the atria. "It delays the impulse for about 100 ms at the septum" is not the best choice because The 100 ms delay is at the AV node, not in the band between the atria. "It spreads the impulse from the apex toward the base" is not the best choice because Apex-to-base spread is the ventricular conducting-fiber pattern, after the ventricles are reached. "It tenses the right papillary muscle before ejection" is not the best choice because The moderator band supplies the right papillary muscle. It is not the path between the atria. "It blocks all conduction across the cardiac skeleton" is not the best choice because The cardiac skeleton blocks direct spread into the ventricles. It does not describe a band that connects the two atria.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "physiology"]$tg$,
  's1-new-20261128-hidden', 'dc08be57c2c8fc56c2d6ad4dd0745a8175fe19a161edb5225846ffa3112d998f', false, NOW(), NOW(), 3,
  'bachmann-left-atrium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'bachmann-left-atrium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-111", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "A", "verifiedFact": "Bachmann's bundle, the interatrial band, conducts the impulse directly from the right atrium to the left atrium."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280112', 'usmle-step-1', 'physiology',
  $sc$A 41-year-old woman who restores furniture has a right ventricular study. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. A muscle band from the septum to the right ventricular wall carries the impulse to a papillary muscle, which tenses just before the rest of that ventricle contracts. The left ventricle has no matching band.$sc$,
  $qu$Which of the following is the point of stimulating that papillary muscle early?$qu$,
  $op${"options": ["The left ventricle gets the impulse before the right", "Tension develops in the chordae before the ventricle ejects", "The aortic valve is held open during atrial systole", "Atrial repolarization becomes visible after the QRS", "The pacemaker rate rises above 100 beats per minute"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "moderator-band-papillary", "taskCategory": "mechanism"}$op$,
  $ky$Tension develops in the chordae before the ventricle ejects$ky$,
  $ex$The best choice is "Tension develops in the chordae before the ventricle ejects". The moderator band delivers the impulse to the right papillary muscle at about the same time as the other papillary muscle, just before the rest of the ventricular muscle, so tension is already on the chordae tendineae. She has that right-sided band, and the left ventricle has none. "The left ventricle gets the impulse before the right" is not the best choice because The left bundle is larger because the left ventricle is larger, but this band is a right-sided structure. It does not make the left ventricle fire first. "The aortic valve is held open during atrial systole" is not the best choice because The aortic valve opens when ventricular pressure exceeds aortic pressure. The papillary timing is about the AV-valve chordae, not the aortic valve. "Atrial repolarization becomes visible after the QRS" is not the best choice because Atrial repolarization stays hidden in the QRS. Papillary timing does not unmask it. "The pacemaker rate rises above 100 beats per minute" is not the best choice because The SA node inherent rate is about 80–100. This band does not raise the pacemaker above that.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd1f155f6ddb49178af641b7f950faf6603f1dc543a208bf98e6e5108beca51ee', false, NOW(), NOW(), 3,
  'moderator-band-papillary', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'moderator-band-papillary', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-112", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "Part of the right bundle branch runs in the moderator band to the right papillary muscle, so that muscle is stimulated with the other papillary muscle just before the rest of the right ventricle. There is no left-sided moderator band."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280113', 'usmle-step-1', 'physiology',
  $sc$A 66-year-old man who drives a gravel truck has 40 minutes of crushing chest pressure. Temperature is 36.8°C, pulse is 98/min, respirations are 20/min, and blood pressure is 150/90 mm Hg. The tracing shows the segment between the ventricular depolarization and the ventricular recovery wave sitting above the baseline in several chest leads. He is sweaty and nauseated.$sc$,
  $qu$Which of the following is the tracing pattern just described?$qu$,
  $op${"options": ["The T wave is the only finding and it is taller", "The PR interval is the only interval that widened", "That interval sits above the tracing's reference line", "The P wave is inverted in every limb lead", "The QRS has become a flat isoelectric line"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "st-elevation-acute-mi", "taskCategory": "mechanism"}$op$,
  $ky$That interval sits above the tracing's reference line$ky$,
  $ex$The best choice is "That interval sits above the tracing's reference line". Elevation of the ST segment above baseline is often seen in acute myocardial infarction. His segment between ventricular depolarization and the recovery wave is above baseline during crushing chest pressure. "The T wave is the only finding and it is taller" is not the best choice because Flat T waves are described when the myocardium gets too little oxygen. The finding specified is the segment sitting above baseline, not an isolated taller T wave. "The PR interval is the only interval that widened" is not the best choice because A long PR interval points to delay getting from the SA node to the AV node. That interval was not the one described. "The P wave is inverted in every limb lead" is not the best choice because An inverted P wave is not the segment between the QRS and the T wave. "The QRS has become a flat isoelectric line" is not the best choice because A flat line would be absent ventricular depolarization. He has a ventricular complex with the following segment elevated.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'acbc280dd7d84e389bb8e7c03cc833d123bb04c771fc9a375a7c1839908942a5', false, NOW(), NOW(), 2,
  'st-elevation-acute-mi', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'st-elevation-acute-mi', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-113", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "OpenStax 19.2 states that ST-segment elevation above baseline is often seen in acute myocardial infarction, and that T waves often flatten when the myocardium receives too little oxygen."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280114', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old man who bikes to work is at rest. Temperature is 36.6°C, pulse is 62/min, respirations are 12/min, and blood pressure is 114/70 mm Hg. Oxygen moves from alveolar air into capillary blood, and carbon dioxide moves the other way. No ATP is consumed at that membrane. A second exchange, at his exercising muscle, runs in the opposite direction for oxygen.$sc$,
  $qu$Which of the following names the alveolar exchange?$qu$,
  $op${"options": ["Diffusion between systemic capillaries and active muscle", "Active transport of oxygen across the alveolar wall", "Binding of calcium to troponin inside cardiomyocytes", "Diffusion between alveolar air and pulmonary capillary blood", "Filtration of plasma at the glomerular capillaries"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "external-vs-internal-respiration", "taskCategory": "mechanism"}$op$,
  $ky$Diffusion between alveolar air and pulmonary capillary blood$ky$,
  $ex$The best choice is "Diffusion between alveolar air and pulmonary capillary blood". External respiration is exchange at the alveoli: oxygen enters capillary blood and carbon dioxide leaves. It is simple diffusion and uses no ATP. His first exchange matches that direction at the lung. "Diffusion between systemic capillaries and active muscle" is not the best choice because Exchange at active muscle is internal respiration. Oxygen there leaves the blood, which is the second exchange, not the alveolar one. "Active transport of oxygen across the alveolar wall" is not the best choice because Neither oxygen nor carbon dioxide is pumped by ATP at the respiratory membrane. "Binding of calcium to troponin inside cardiomyocytes" is not the best choice because Calcium binding to troponin starts cardiac cross-bridges. It is not alveolar gas exchange. "Filtration of plasma at the glomerular capillaries" is not the best choice because Glomerular filtration is a renal capillary process, not the alveolar gas step.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '81456991ab5641ab7db3d803fc348e61b58989807346f42e96d9f0a54b68162d', false, NOW(), NOW(), 2,
  'external-vs-internal-respiration', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'external-vs-internal-respiration', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-114", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "D", "verifiedFact": "External respiration is gas exchange in the alveoli. Internal respiration is gas exchange in the tissues. Both are simple diffusion and do not require ATP."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280115', 'usmle-step-1', 'physiology',
  $sc$A 22-year-old woman who swims distance has bright red blood leaving her lungs. Temperature is 36.5°C, pulse is 58/min, respirations are 12/min, and blood pressure is 108/66 mm Hg. Only a little of the oxygen that crossed the alveolar membrane is dissolved in plasma. The rest is bound inside red cells. That blood returns to the heart in the pulmonary veins.$sc$,
  $qu$Which of the following carries most of the oxygen she just picked up?$qu$,
  $op${"options": ["Dissolved plasma gas, with almost none inside red cells", "White cells marginated along the pulmonary endothelium", "Platelets aggregated in the pulmonary capillaries", "Nitrogen dissolved in plasma at ordinary air pressure", "A protein inside red cells, not the dissolved plasma fraction"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "hemoglobin-carries-most-oxygen", "taskCategory": "mechanism"}$op$,
  $ky$A protein inside red cells, not the dissolved plasma fraction$ky$,
  $ex$The best choice is "A protein inside red cells, not the dissolved plasma fraction". Most oxygen that crosses into pulmonary capillary blood binds hemoglobin inside red cells. Only a small amount dissolves in plasma. Bound hemoglobin is what makes the blood bright red, and that blood returns in the pulmonary veins. "Dissolved plasma gas, with almost none inside red cells" is not the best choice because The dissolved fraction is the small one. Most of the oxygen is inside red cells. "White cells marginated along the pulmonary endothelium" is not the best choice because White cells are not the oxygen-binding protein that colors arterial blood. "Platelets aggregated in the pulmonary capillaries" is not the best choice because Platelets do not carry the oxygen that crossed the alveolar membrane. "Nitrogen dissolved in plasma at ordinary air pressure" is not the best choice because Nitrogen solubility in blood is very low at ordinary pressure, and nitrogen is not the gas that turned the blood bright red.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '59292ce95985939a4249c924a544d781e9dc0fa7e4c4d0333acbf097588eb29e', false, NOW(), NOW(), 2,
  'hemoglobin-carries-most-oxygen', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'hemoglobin-carries-most-oxygen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-115", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "E", "verifiedFact": "A small amount of oxygen dissolves in plasma. Most oxygen is bound to hemoglobin in red cells. Oxygenated blood returns to the heart in the pulmonary veins."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280116', 'usmle-step-1', 'physiology',
  $sc$A 57-year-old man who repairs clocks is studied at rest. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Before the atria contract, the ventricles are already about three-quarters full. The atrioventricular valves are open and the semilunar valves are closed.$sc$,
  $qu$Which of the following accounts for most of that filling?$qu$,
  $op${"options": ["Passive inflow while the atria and ventricles are relaxed", "Atrial contraction pushing the final fifth of the volume", "Ventricular contraction with the semilunar valves shut", "Backflow from the aorta after the semilunar valves close", "Coronary sinus drainage directly into the left ventricle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "passive-ventricular-filling", "taskCategory": "mechanism"}$op$,
  $ky$Passive inflow while the atria and ventricles are relaxed$ky$,
  $ex$The best choice is "Passive inflow while the atria and ventricles are relaxed". While both chambers are relaxed, blood flows from the veins into the atria and through open AV valves. About 70 to 80 percent of ventricular filling happens this way, before atrial contraction. The ventricles are already about three-quarters full, and the semilunar valves are closed. "Atrial contraction pushing the final fifth of the volume" is not the best choice because Atrial contraction adds only the remaining 20 to 30 percent. It is not most of the filling. "Ventricular contraction with the semilunar valves shut" is not the best choice because Ventricular contraction with the semilunar valves still shut is isovolumic contraction. Volume does not rise then. "Backflow from the aorta after the semilunar valves close" is not the best choice because After the semilunar valves close, backflow is stopped. That does not fill the ventricle. "Coronary sinus drainage directly into the left ventricle" is not the best choice because The coronary sinus empties into the right atrium, not the left ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '096984e1bb66d0e569fd936ef3c8d8f2e4d061ae91ae665d81715b29c530ac0b', false, NOW(), NOW(), 2,
  'passive-ventricular-filling', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'passive-ventricular-filling', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-116", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "A", "verifiedFact": "About 70 to 80 percent of ventricular filling occurs while both chambers are in diastole, before atrial contraction. The atrial kick adds the remaining 20 to 30 percent."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280117', 'usmle-step-1', 'physiology',
  $sc$A 48-year-old woman who teaches violin is in the first moments of ventricular contraction. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Ventricular pressure has risen above atrial pressure, so the AV valves have shut. Pressure is still below aortic and pulmonary pressure. Ventricular volume on the tracing does not change.$sc$,
  $qu$Which of the following best describes this interval?$qu$,
  $op${"options": ["The aortic valve is open and stroke volume is leaving", "All valves are shut and ventricular volume is constant", "The mitral valve is open and the atrium is still filling the ventricle", "The semilunar valves are open and the AV valves are open too", "Ventricular pressure is falling and the T wave is under way"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "isovolumic-contraction", "taskCategory": "mechanism"}$op$,
  $ky$All valves are shut and ventricular volume is constant$ky$,
  $ex$The best choice is "All valves are shut and ventricular volume is constant". When ventricular pressure exceeds atrial pressure, the AV valves close. Until ventricular pressure also exceeds aortic and pulmonary pressure, the semilunar valves stay shut, so volume cannot change. That is the early part of ventricular systole. Her tracing shows a flat volume. "The aortic valve is open and stroke volume is leaving" is not the best choice because Ejection starts only after ventricular pressure exceeds the great-artery pressure. That threshold has not been reached. "The mitral valve is open and the atrium is still filling the ventricle" is not the best choice because The AV valves have already shut because ventricular pressure is above atrial pressure. "The semilunar valves are open and the AV valves are open too" is not the best choice because The semilunar valves are still closed, and the AV valves have just closed. They are not all open. "Ventricular pressure is falling and the T wave is under way" is not the best choice because Falling ventricular pressure and the T wave mark the start of relaxation, not this early contraction.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c2589f488b17595a68a588c6f13c5004cf071cd0e26c237fe45a8210eafc569a', false, NOW(), NOW(), 3,
  'isovolumic-contraction', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'isovolumic-contraction', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-117", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "B", "verifiedFact": "Early ventricular systole closes the AV valves when ventricular pressure exceeds atrial pressure, but the semilunar valves are still closed, so ventricular volume stays constant. This is isovolumic contraction."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280118', 'usmle-step-1', 'physiology',
  $sc$A 62-year-old man who surveys roads has a resting study. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. Each ventricle ejects 75 mL. Peak pressure in the left ventricle is far above peak pressure in the right ventricle. The aortic valve and the pulmonary valve both open during ejection.$sc$,
  $qu$Which of the following explains the pressure difference with equal ejected volumes?$qu$,
  $op${"options": ["The left ventricle ejects more blood than the right ventricle", "The right ventricle must overcome systemic arterial pressure", "The aorta resists outflow more than the pulmonary trunk does", "The pulmonary valve stays shut while the aortic valve opens", "Only the left ventricle receives the atrial topping-up"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "equal-stroke-higher-left-pressure", "taskCategory": "mechanism"}$op$,
  $ky$The aorta resists outflow more than the pulmonary trunk does$ky$,
  $ex$The best choice is "The aorta resists outflow more than the pulmonary trunk does". Both ventricles pump the same volume, here 75 mL, within the usual 70 to 80 mL. Left ventricular pressure is higher because pressure in the aorta is much higher than pressure in the pulmonary trunk. Both semilunar valves open. "The left ventricle ejects more blood than the right ventricle" is not the best choice because The ejected volumes are equal, 75 mL from each side. "The right ventricle must overcome systemic arterial pressure" is not the best choice because Systemic pressure is what the left ventricle overcomes. The right ventricle faces the lower-pressure pulmonary trunk. "The pulmonary valve stays shut while the aortic valve opens" is not the best choice because Both the aortic and pulmonary valves open during ejection in this study. "Only the left ventricle receives the atrial topping-up" is not the best choice because Atrial contraction contributes to filling of both ventricles, not only the left.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'be069a32f553ac7ea2685436daa9c7cf1590a85d5ebea24df5f863c64aa61402', false, NOW(), NOW(), 3,
  'equal-stroke-higher-left-pressure', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'equal-stroke-higher-left-pressure', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-118", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "C", "verifiedFact": "Both ventricles eject the same stroke volume, normally about 70 to 80 mL. Left ventricular pressure is higher because aortic pressure is higher than pulmonary trunk pressure."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280119', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old woman who runs cross-country has two heart sounds and no extra sounds. Temperature is 36.5°C, pulse is 60/min, respirations are 12/min, and blood pressure is 108/64 mm Hg. The first sound occurs as the ventricles begin to contract and the valves between the atria and ventricles shut. The second sound comes as relaxation begins.$sc$,
  $qu$Which of the following produces the first sound?$qu$,
  $op${"options": ["Closure of both the aortic and the pulmonary valves", "Atrial contraction pushing blood into a stiff ventricle", "Blood oscillating in the ventricle in early filling", "Shutting of the cusps that separate the upper and lower chambers", "Turbulent flow across a narrowed aortic valve"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "s1-av-valve-closure", "taskCategory": "mechanism"}$op$,
  $ky$Shutting of the cusps that separate the upper and lower chambers$ky$,
  $ex$The best choice is "Shutting of the cusps that separate the upper and lower chambers". S1 is the sound of the AV valves closing during ventricular contraction. Her first sound is at the start of ventricular contraction, when those valves shut. She has only the two normal sounds. "Closure of both the aortic and the pulmonary valves" is not the best choice because Closure of both the aortic and the pulmonary valves is S2, at the start of ventricular relaxation. "Atrial contraction pushing blood into a stiff ventricle" is not the best choice because Atrial contraction pushing blood into a stiff ventricle is S4, which occurs before S1 and is not part of her two-sound exam. "Blood oscillating in the ventricle in early filling" is not the best choice because Blood moving in the ventricle can contribute to S3, which is not one of her two sounds. "Turbulent flow across a narrowed aortic valve" is not the best choice because A murmur is turbulent flow. She has no extra sound, and the first sound is valve closure, not a narrowed valve.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'aa24500fb00d233d676d3882b0778e2bd138a630bf36ff6b22bc9c598b157329', false, NOW(), NOW(), 2,
  's1-av-valve-closure', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 's1-av-valve-closure', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-119", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "D", "verifiedFact": "S1 is the first heart sound, produced by closure of the AV valves during ventricular contraction. S2 is closure of the semilunar valves during ventricular diastole."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280120', 'usmle-step-1', 'physiology',
  $sc$A 71-year-old man who binds books has a low extra sound just before the first heart sound. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 158/92 mm Hg. The left ventricular wall is thick. The extra sound is timed to atrial contraction. He does not have the extra sound that can be normal in young athletes.$sc$,
  $qu$Which of the following produces this extra sound?$qu$,
  $op${"options": ["Semilunar valves closing at the start of relaxation", "AV valves closing at the start of ventricular contraction", "Rapid early filling of a normal young ventricle", "Inspiration increasing flow only on the right side", "Atrial contraction pushing blood into a stiff ventricle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "s4-stiff-ventricle", "taskCategory": "mechanism"}$op$,
  $ky$Atrial contraction pushing blood into a stiff ventricle$ky$,
  $ex$The best choice is "Atrial contraction pushing blood into a stiff ventricle". S4 comes from atrial contraction pushing blood into a stiff or hypertrophic ventricle, and it occurs before S1. His wall is thick, the sound is just before the first sound, and it is timed to atrial contraction. "Semilunar valves closing at the start of relaxation" is not the best choice because Semilunar closure is S2, after ventricular contraction, not before S1. "AV valves closing at the start of ventricular contraction" is not the best choice because AV closure is S1 itself, not the extra sound just before it. "Rapid early filling of a normal young ventricle" is not the best choice because S3 can be heard in youth and athletes. He is 71, the sound is before S1, and the ventricle is thick. "Inspiration increasing flow only on the right side" is not the best choice because Inspiration can make a right-sided murmur louder. It does not create a presystolic sound from a thick ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '436112fb7bf88b3da2909d2a676af6636253d58e793b32403c079c8ae970ee89', false, NOW(), NOW(), 3,
  's4-stiff-ventricle', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 's4-stiff-ventricle', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-120", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "E", "verifiedFact": "S4 is produced when atrial contraction pushes blood into a stiff or hypertrophic ventricle. It occurs before S1."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280121', 'usmle-step-1', 'anatomy',
  $sc$A 4-day-old boy is examined because a flap in the wall between the atria has just sealed. Temperature is 36.9°C, pulse is 140/min, respirations are 40/min, and blood pressure is 70/40 mm Hg. Before birth, blood crossed that opening from the right atrium into the left atrium and skipped the lungs. The lungs are now the route for that blood.$sc$,
  $qu$Which of the following was the prenatal direction through that opening?$qu$,
  $op${"options": ["From the right atrium into the left atrium, bypassing the lungs", "From the left atrium into the right atrium, toward the lungs", "From the aorta across into the pulmonary trunk", "From the pulmonary trunk across into the aorta", "From the left ventricle into the right ventricle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "fossa-ovalis-fetal-shunt", "taskCategory": "anatomy"}$op$,
  $ky$From the right atrium into the left atrium, bypassing the lungs$ky$,
  $ex$The best choice is "From the right atrium into the left atrium, bypassing the lungs". The foramen ovale let fetal blood pass from the right atrium to the left atrium, bypassing the pulmonary circuit. The septum primum closes it after birth. This newborn's atrial flap has just sealed, and the prenatal path skipped the lungs. "From the left atrium into the right atrium, toward the lungs" is not the best choice because The prenatal shunt across that opening is right atrium to left atrium, not the reverse. "From the aorta across into the pulmonary trunk" is not the best choice because Aorta-to-pulmonary-trunk flow is the direction through a patent ductus arteriosus, a different fetal vessel. "From the pulmonary trunk across into the aorta" is not the best choice because Pulmonary-trunk-to-aorta flow is the prenatal ductus arteriosus direction in fetal life, not the opening in the atrial wall. "From the left ventricle into the right ventricle" is not the best choice because A ventricular septal opening is not the atrial flap that closed after birth.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '040c768555328c55badc02724120fe169dbd2ee1bac93583af6706cec5b6df60', false, NOW(), NOW(), 2,
  'fossa-ovalis-fetal-shunt', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'fossa-ovalis-fetal-shunt', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-121", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "A", "verifiedFact": "The fossa ovalis is the adult remnant of the foramen ovale, which let fetal blood pass from the right atrium to the left atrium and bypass the lungs. The septum primum closes it after birth."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280122', 'usmle-step-1', 'pathology',
  $sc$A 3-week-old girl has fast breathing and poor weight gain. Temperature is 37.0°C, pulse is 168/min, respirations are 62/min, and blood pressure is 90/40 mm Hg. A vessel that should have closed still connects the aorta to the pulmonary trunk. Flow across it is continuous. Her pulse pressure is wide.$sc$,
  $qu$Which of the following is the direction of flow through that vessel?$qu$,
  $op${"options": ["From the pulmonary trunk across into the aorta", "From the aorta across into the pulmonary trunk", "From the right atrium into the left atrium", "From the left ventricle into the right ventricle", "From the coronary sinus into the left atrium"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "patent-ductus-aorta-to-pulmonary", "taskCategory": "mechanism"}$op$,
  $ky$From the aorta across into the pulmonary trunk$ky$,
  $ex$The best choice is "From the aorta across into the pulmonary trunk". When the ductus arteriosus stays open, blood flows from the higher-pressure aorta into the lower-pressure pulmonary trunk. That extra flow toward the lungs raises pulmonary pressure and makes breathing difficult. She is tachypneic, gaining poorly, and has a wide pulse pressure. "From the pulmonary trunk across into the aorta" is not the best choice because Fetal ductus flow is toward the aorta, but after birth aortic pressure is higher, so a vessel that stays open runs from aorta to pulmonary trunk. "From the right atrium into the left atrium" is not the best choice because Right-to-left atrial flow is the foramen ovale, not a vessel between the aorta and the pulmonary trunk. "From the left ventricle into the right ventricle" is not the best choice because A ventricular septal defect is an opening in the ventricular septum, not this vessel. "From the coronary sinus into the left atrium" is not the best choice because The coronary sinus drains to the right atrium, not across a vessel joining the great arteries.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', '9a8772630a8b03a5fdfa81fdc10cff0336be0881c023f8c05c9ca793d481efa5', false, NOW(), NOW(), 3,
  'patent-ductus-aorta-to-pulmonary', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'patent-ductus-aorta-to-pulmonary', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-122", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "B", "verifiedFact": "If the ductus arteriosus stays open, blood flows from the higher-pressure aorta into the lower-pressure pulmonary trunk, raising pulmonary pressure."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280123', 'usmle-step-1', 'anatomy',
  $sc$A 34-year-old man who installs windows has a normal heart on imaging. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The wall of one ventricle is much thicker than the other. Each side ejects 72 mL per beat. The thicker chamber faces the higher-resistance circuit.$sc$,
  $qu$Which of the following is the thicker chamber?$qu$,
  $op${"options": ["The ventricle that ejects into the pulmonary trunk", "The atrium that receives the venae cavae", "The ventricle that pumps into the systemic arteries", "The atrium that receives the pulmonary veins", "The atrial appendage on the right side"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "left-ventricle-thicker", "taskCategory": "anatomy"}$op$,
  $ky$The ventricle that pumps into the systemic arteries$ky$,
  $ex$The best choice is "The ventricle that pumps into the systemic arteries". The left ventricular wall is thicker because that chamber must generate more pressure against systemic resistance. Both ventricles eject the same volume, here 72 mL. The thicker chamber is the one ejecting into the systemic arteries. "The ventricle that ejects into the pulmonary trunk" is not the best choice because The right ventricle ejects into the pulmonary trunk and has the thinner wall. "The atrium that receives the venae cavae" is not the best choice because The right atrium receives the venae cavae. It is not the thick ventricular wall. "The atrium that receives the pulmonary veins" is not the best choice because The left atrium receives the pulmonary veins. Atrial walls are not the thick ventricular myocardium described. "The atrial appendage on the right side" is not the best choice because The auricle is a thin-walled atrial appendage, not the thick pumping chamber.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '2a0197df920ad5e2d5d24dfcba3ed5880563244289a2ce9d0ef860ce799ba243', false, NOW(), NOW(), 2,
  'left-ventricle-thicker', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'left-ventricle-thicker', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-123", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "C", "verifiedFact": "The left ventricular myocardium is much thicker than the right. Both pump the same volume, but the left must generate higher pressure against systemic resistance."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280124', 'usmle-step-1', 'anatomy',
  $sc$A 60-year-old woman who catalogs maps has venous blood from the heart muscle returning to a chamber. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. The vein opens on the posterior right atrium, just above the inferior vena cava opening. It does not enter the left atrium.$sc$,
  $qu$Which of the following chamber receives this cardiac venous blood?$qu$,
  $op${"options": ["The left atrium, with the four pulmonary veins", "The right ventricle, through the tricuspid valve", "The left ventricle, through the mitral valve", "The right atrium, near the inferior vena cava", "The pulmonary trunk, before the lungs"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "coronary-sinus-right-atrium", "taskCategory": "anatomy"}$op$,
  $ky$The right atrium, near the inferior vena cava$ky$,
  $ex$The best choice is "The right atrium, near the inferior vena cava". The coronary sinus returns most coronary venous blood to the right atrium, opening just superior to the inferior vena cava. Her vessel opens on the posterior right atrium at that site and does not enter the left atrium. "The left atrium, with the four pulmonary veins" is not the best choice because The four pulmonary veins enter the left atrium with oxygenated lung blood, not myocardial venous blood. "The right ventricle, through the tricuspid valve" is not the best choice because Coronary venous blood reaches the right ventricle only after it has entered the right atrium. "The left ventricle, through the mitral valve" is not the best choice because The mitral valve is between the left atrium and left ventricle. Coronary veins do not drain there. "The pulmonary trunk, before the lungs" is not the best choice because The pulmonary trunk carries right-ventricular output to the lungs, not myocardial venous return.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'bc566dd6fbb931675b75da3710cb68513a1e20fb0b49164e52893252fa55b9c2', false, NOW(), NOW(), 2,
  'coronary-sinus-right-atrium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'coronary-sinus-right-atrium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-124", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "D", "verifiedFact": "The coronary sinus drains most of the coronary veins into the right atrium, near the inferior vena cava opening."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280125', 'usmle-step-1', 'anatomy',
  $sc$A 45-year-old man who teaches drafting has the heart wall described from the outside inward. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The outer layer of the wall is also the inner layer of the sac, and it secretes fluid into the space around the heart. The thick middle layer is muscle. The inner lining covers the valves.$sc$,
  $qu$Which of the following is that outer wall layer?$qu$,
  $op${"options": ["The muscle layer that pumps blood into the arteries", "The lining that is continuous with vessel endothelium", "The tough outer sac that anchors the heart in the chest", "The fluid space between the sac and the heart surface", "The layer of the wall that is also the inner sac layer"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "epicardium-is-visceral-pericardium", "taskCategory": "anatomy"}$op$,
  $ky$The layer of the wall that is also the inner sac layer$ky$,
  $ex$The best choice is "The layer of the wall that is also the inner sac layer". The epicardium is the outer layer of the heart wall and the visceral layer of the serous pericardium. It secretes the lubricating fluid. The description matches that shared layer, with muscle deep to it and a lining on the valves. "The muscle layer that pumps blood into the arteries" is not the best choice because The myocardium is the thick middle muscle layer, not the outer wall layer that secretes the fluid. "The lining that is continuous with vessel endothelium" is not the best choice because The endocardium is the inner lining, continuous with vascular endothelium, and it covers the valves. It is the deepest layer, not the outer one. "The tough outer sac that anchors the heart in the chest" is not the best choice because The fibrous pericardium is the tough outer sac that anchors the heart. It is not a layer of the heart wall. "The fluid space between the sac and the heart surface" is not the best choice because The pericardial cavity is the fluid space. It is not a layer of the wall.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'a095fdae6f93d746bf87d18cc34ae70660f49e3e620956563c4593156936d195', false, NOW(), NOW(), 2,
  'epicardium-is-visceral-pericardium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'epicardium-is-visceral-pericardium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-125", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "E", "verifiedFact": "The heart wall from superficial to deep is epicardium, myocardium, and endocardium. The epicardium is the visceral pericardium. The fibrous pericardium anchors the heart. Serous fluid in the pericardial cavity reduces friction."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280126', 'usmle-step-1', 'physiology',
  $sc$A 26-year-old man who climbs indoor walls takes a quiet breath. Temperature is 36.6°C, pulse is 64/min, respirations are 12/min, and blood pressure is 116/70 mm Hg. The diaphragm descends, the rib cage enlarges, and alveolar pressure falls below the pressure of the room air. Air then enters. Room temperature does not change during the breath.$sc$,
  $qu$Which of the following makes air enter after the chest enlarges?$qu$,
  $op${"options": ["Alveolar pressure falls below the pressure of room air", "Alveolar pressure rises above the pressure of room air", "Intrapleural pressure becomes higher than alveolar pressure", "The lungs contract and pull air in by their own muscle", "Carbon dioxide is pumped into the alveoli by ATP"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "boyle-inspiration", "taskCategory": "mechanism"}$op$,
  $ky$Alveolar pressure falls below the pressure of room air$ky$,
  $ex$The best choice is "Alveolar pressure falls below the pressure of room air". At constant temperature, increasing volume lowers gas pressure. When the chest enlarges, alveolar pressure falls below atmospheric pressure and air flows in. His diaphragm descended, the cage enlarged, and alveolar pressure fell before air entered. "Alveolar pressure rises above the pressure of room air" is not the best choice because Pressure above room air drives air out, which is expiration, not this inspiratory breath. "Intrapleural pressure becomes higher than alveolar pressure" is not the best choice because Intrapleural pressure stays lower than alveolar pressure. It does not rise above it to cause inflow. "The lungs contract and pull air in by their own muscle" is not the best choice because The lungs are passive. They are pulled open by the chest wall and pleural fluid. They do not contain the muscle that enlarges the chest. "Carbon dioxide is pumped into the alveoli by ATP" is not the best choice because Gas movement here follows a pressure gradient. ATP is not used to pump carbon dioxide in during this breath.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ffe8d26582433aaaf8880e546304cc77b3b2620e654d9ed44fad01b297483600', false, NOW(), NOW(), 2,
  'boyle-inspiration', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'boyle-inspiration', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-126", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "A", "verifiedFact": "Boyle's law: at constant temperature, gas pressure is inversely proportional to volume. Inspiration increases thoracic volume, lowers alveolar pressure below atmospheric pressure, and air flows in."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280127', 'usmle-step-1', 'physiology',
  $sc$A 31-year-old woman who proofs manuscripts is breathing quietly at rest. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. After each breath in, the diaphragm and the outer rib muscles relax. The lungs recoil, pressure inside them rises above room air, and air leaves. She is not singing or exercising.$sc$,
  $qu$Which of the following drives this outflow?$qu$,
  $op${"options": ["Contraction of the abdominal wall and internal rib muscles", "Elastic recoil after the inspiratory muscles relax", "Active shortening of muscle inside the lung itself", "A fall of alveolar pressure to a level below room air", "Scalene contraction lifting the rib cage farther"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "quiet-expiration-passive", "taskCategory": "mechanism"}$op$,
  $ky$Elastic recoil after the inspiratory muscles relax$ky$,
  $ex$The best choice is "Elastic recoil after the inspiratory muscles relax". Quiet expiration does not require energy to push air out. After the diaphragm and external intercostals relax, elastic recoil shrinks the lungs, intrapulmonary pressure rises above atmospheric pressure, and air leaves. She is at rest, not forcing the breath. "Contraction of the abdominal wall and internal rib muscles" is not the best choice because Abdominal muscles and internal intercostals are used in forced expiration, as in exercise or singing. She is doing neither. "Active shortening of muscle inside the lung itself" is not the best choice because Lung tissue itself is passive. It recoils. It does not contain the muscle of breathing. "A fall of alveolar pressure to a level below room air" is not the best choice because Alveolar pressure below room air causes inflow. Outflow requires pressure inside the lung above room air. "Scalene contraction lifting the rib cage farther" is not the best choice because Scalene contraction lifts the chest for a forced inspiration, the opposite of this quiet outflow.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f02f4e953aef85e48684f2accdfa6c654723676bd9ef83f8726e97b47649eb75', false, NOW(), NOW(), 2,
  'quiet-expiration-passive', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'quiet-expiration-passive', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-127", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "B", "verifiedFact": "Quiet expiration is passive. Elastic recoil of the lung, after the diaphragm and external intercostals relax, raises intrapulmonary pressure above atmospheric pressure and air leaves. No energy is required to push the air out."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280128', 'usmle-step-1', 'physiology',
  $sc$A 2-hour-old boy born at 27 weeks has stiff lungs and repeated alveolar collapse at the end of each breath. Temperature is 36.4°C, pulse is 160/min, respirations are 70/min, and blood pressure is 48/28 mm Hg. The cells that should release the substance that mixes with the water film on the alveolar lining are immature. Inspired oxygen fraction is 0.4.$sc$,
  $qu$Which of the following is missing from the alveolar lining?$qu$,
  $op${"options": ["The muscle that actively expands each alveolus", "Carbonic anhydrase that makes bicarbonate in red cells", "The substance that lowers surface tension of the water film", "The protein that binds four oxygen molecules on heme", "The negative intrapleural pressure of about 4 mm Hg"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "surfactant-type-ii", "taskCategory": "mechanism"}$op$,
  $ky$The substance that lowers surface tension of the water film$ky$,
  $ex$The best choice is "The substance that lowers surface tension of the water film". Type II alveolar cells secrete surfactant, which mixes with the water lining and lowers surface tension. Without it, alveoli collapse on expiration. This premature infant's collapse at the end of each breath fits missing surfactant from immature cells. "The muscle that actively expands each alveolus" is not the best choice because Alveoli are not expanded by muscle inside them. The chest wall and diaphragm enlarge the lung. "Carbonic anhydrase that makes bicarbonate in red cells" is not the best choice because Carbonic anhydrase is in red cells and converts carbon dioxide to carbonic acid. It is not the missing alveolar-lining substance. "The protein that binds four oxygen molecules on heme" is not the best choice because Hemoglobin binds oxygen. It does not stop alveoli from collapsing. "The negative intrapleural pressure of about 4 mm Hg" is not the best choice because Intrapleural pressure is about 4 mm Hg below alveolar pressure in the intact chest. The problem named here is the water film on the alveoli.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'cb7851ab82a05f429af1317f7bc1c437e552f4136177f51b5b22633bf6a6b9fe', false, NOW(), NOW(), 2,
  'surfactant-type-ii', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'surfactant-type-ii', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-128", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "C", "verifiedFact": "Type II alveolar cells secrete pulmonary surfactant, which mixes with water and lowers alveolar surface tension. Without it, alveoli collapse during expiration."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280129', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old man who installs flooring has pleural and alveolar pressures recorded. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Throughout the cycle, pressure in the pleural space stays about 4 mm Hg below pressure inside the alveoli. The lung tissue itself pulls inward.$sc$,
  $qu$Which of the following keeps the pleural pressure below alveolar pressure?$qu$,
  $op${"options": ["Alveolar pressure held 4 mm Hg above room air at all times", "Active contraction of smooth muscle in the alveolar wall", "Surfactant raising surface tension so the lung pulls outward", "Inward lung recoil slightly exceeded by the outward chest pull", "The diaphragm pushing abdominal contents into the chest"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "intrapleural-negative", "taskCategory": "mechanism"}$op$,
  $ky$Inward lung recoil slightly exceeded by the outward chest pull$ky$,
  $ex$The best choice is "Inward lung recoil slightly exceeded by the outward chest pull". Elastic recoil and alveolar surface tension pull the lung inward. The chest wall and pleural fluid pull outward, and the outward pull is slightly greater, leaving intrapleural pressure about 4 mm Hg below alveolar pressure. His tracing shows that 4 mm Hg gap, and the lung pulls inward. "Alveolar pressure held 4 mm Hg above room air at all times" is not the best choice because Alveolar pressure is not held above room air for the whole cycle. It falls below room air on inspiration. "Active contraction of smooth muscle in the alveolar wall" is not the best choice because The lung is passive during breathing. Alveolar walls are not the muscle creating this pressure gap. "Surfactant raising surface tension so the lung pulls outward" is not the best choice because Surfactant lowers surface tension. It does not raise it to pull the lung outward. "The diaphragm pushing abdominal contents into the chest" is not the best choice because On inspiration the diaphragm moves down, away from the chest, enlarging the thorax. It does not push abdominal contents into the chest.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '0a3aa16317da584bcf78d15b85125420a70031c461b933005728ad240b460cf5', false, NOW(), NOW(), 3,
  'intrapleural-negative', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'intrapleural-negative', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-129", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "D", "verifiedFact": "Intrapleural pressure stays about 4 mm Hg below intra-alveolar pressure throughout the cycle. Lung elastic recoil and alveolar surface tension pull inward. The chest wall and pleural fluid pull outward slightly more."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280130', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old man who sings in a choir pushes out a long loud phrase. Temperature is 36.7°C, pulse is 88/min, respirations are 18/min, and blood pressure is 122/70 mm Hg. His abdominal wall tightens and the ribs are pulled downward and inward. Air leaves faster than during quiet speech. He is not inhaling.$sc$,
  $qu$Which of the following muscles are doing that work?$qu$,
  $op${"options": ["The diaphragm and the external muscles between the ribs", "Only the scalene muscles lifting the upper ribs", "Smooth muscle lying in the alveolar ducts alone", "The thick ventricular muscle, which does not move the ribs", "Abdominal muscles and the internal muscles between the ribs"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "forced-expiration-muscles", "taskCategory": "mechanism"}$op$,
  $ky$Abdominal muscles and the internal muscles between the ribs$ky$,
  $ex$The best choice is "Abdominal muscles and the internal muscles between the ribs". Forced expiration, as in singing, uses abdominal muscles such as the obliques to push the diaphragm up, and internal intercostals to compress the rib cage. His abdomen tightens and the ribs move down and in while air leaves. "The diaphragm and the external muscles between the ribs" is not the best choice because The diaphragm and external intercostals contract for inspiration, including quiet inspiration. He is pushing air out. "Only the scalene muscles lifting the upper ribs" is not the best choice because Scalenes lift the chest for forced inspiration, not for this expiratory push. "Smooth muscle lying in the alveolar ducts alone" is not the best choice because Alveolar ducts are not the muscles emptying the chest in a sung phrase. "The thick ventricular muscle, which does not move the ribs" is not the best choice because The heart does not provide the expiratory muscle effort described.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '72231cb0666e0dde862606f2e87b50a63dde04f6b11bd8e2a780ab2906c5ecb3', false, NOW(), NOW(), 2,
  'forced-expiration-muscles', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'forced-expiration-muscles', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-130", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "E", "verifiedFact": "Forced expiration uses abdominal muscles, including the obliques, which push abdominal organs up against the diaphragm, and the internal intercostals, which compress the rib cage."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280131', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old woman who teaches swimming exhales as far as she can after a normal quiet breath of about 500 mL. Temperature is 36.6°C, pulse is 66/min, respirations are 12/min, and blood pressure is 112/68 mm Hg. Some air remains in the lungs. That leftover air is not included when the movable volumes are added together.$sc$,
  $qu$Which of the following is the air that remains after the maximal exhalation?$qu$,
  $op${"options": ["The volume left behind that keeps alveoli from collapsing", "The quiet breath of about 500 mL that she just took", "The extra air she could still inhale after a quiet breath", "The sum of every movable volume, including that leftover air", "Air moved only when the scalene muscles contract"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "tidal-versus-residual", "taskCategory": "mechanism"}$op$,
  $ky$The volume left behind that keeps alveoli from collapsing$ky$,
  $ex$The best choice is "The volume left behind that keeps alveoli from collapsing". Residual volume is what remains after a maximal exhalation. It makes breathing easier by keeping alveoli from collapsing, and vital capacity excludes it. She has exhaled as far as she can, and air is still there. "The quiet breath of about 500 mL that she just took" is not the best choice because About 500 mL is the quiet tidal breath, which she already exhaled past. "The extra air she could still inhale after a quiet breath" is not the best choice because Air that can still be inhaled after a quiet breath is the inspiratory reserve, not the air left after a maximal exhalation. "The sum of every movable volume, including that leftover air" is not the best choice because Total lung capacity includes residual volume. Vital capacity, the sum of the movable volumes, leaves residual volume out. The question asks for the air that remains. "Air moved only when the scalene muscles contract" is not the best choice because Scalene contraction is a forced inspiratory effort. It does not name the volume left after maximal exhalation.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '0e70ddf58e8204c45b0c36f0001c373944b6aa87e843216987a663c6a9ed0489', false, NOW(), NOW(), 2,
  'tidal-versus-residual', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'tidal-versus-residual', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-131", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "A", "verifiedFact": "Tidal volume is about 500 mL, the quiet breath. Residual volume is the air left after a maximal exhalation and helps keep alveoli from collapsing. Vital capacity is tidal volume plus inspiratory and expiratory reserve, and excludes residual volume."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280132', 'usmle-step-1', 'physiology',
  $sc$A 55-year-old man who keeps archives has a brainstem map of breathing. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. One medullary cell group fires, the diaphragm contracts, and air enters. When that firing stops, the diaphragm relaxes and air leaves. A second group receives stretch signals and only adjusts the rhythm.$sc$,
  $qu$Which of the following is the group whose firing starts the breath in?$qu$,
  $op${"options": ["The medullary group that only receives stretch and chemical signals", "The medullary group that drives the diaphragm and outer rib muscles", "Peripheral sensors in the carotid arteries and aortic arch", "Type II alveolar cells secreting the anti-collapse substance", "The atrial pacemaker firing 80 to 100 times a minute"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "vrg-sets-rhythm", "taskCategory": "mechanism"}$op$,
  $ky$The medullary group that drives the diaphragm and outer rib muscles$ky$,
  $ex$The best choice is "The medullary group that drives the diaphragm and outer rib muscles". The ventral respiratory group maintains the rhythm by stimulating the diaphragm and external intercostals. When it stops, those muscles relax and expiration follows. His first group matches that on-off pattern. "The medullary group that only receives stretch and chemical signals" is not the best choice because The dorsal respiratory group receives stretch-receptor and chemoreceptor input and modifies the ventral group. It is the second group, not the one that directly starts inspiration. "Peripheral sensors in the carotid arteries and aortic arch" is not the best choice because Carotid and aortic sensors are peripheral chemoreceptors. They inform the dorsal group. They are not the medullary cells whose firing starts the breath. "Type II alveolar cells secreting the anti-collapse substance" is not the best choice because Type II cells secrete surfactant. They do not pace the diaphragm. "The atrial pacemaker firing 80 to 100 times a minute" is not the best choice because The SA node paces the heart near 80 to 100 beats per minute without nervous input. It does not pace breathing.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '1872d1a3cf0bf496fef0b21f96e91af1a61164bdee4d62d942a9fe951ac6ac81', false, NOW(), NOW(), 3,
  'vrg-sets-rhythm', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vrg-sets-rhythm', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-132", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "B", "verifiedFact": "The ventral respiratory group in the medulla sets the rhythm by stimulating the diaphragm and external intercostals. When that activity stops, those muscles relax and expiration occurs. The dorsal group receives stretch and chemoreceptor input and modifies the rhythm."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280133', 'usmle-step-1', 'physiology',
  $sc$A 47-year-old woman who designs maps is breathing room air. Temperature is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. Her arterial oxygen pressure is 95 mm Hg. A small rise in the waste gas from metabolism increases her breathing, while a matched change in oxygen alone does not. The rise is sensed after that gas crosses into brain extracellular fluid.$sc$,
  $qu$Which of the following is the gas driving the increase in breathing?$qu$,
  $op${"options": ["Oxygen, because arterial oxygen is the main drive at rest", "Nitrogen, which makes up most of ordinary room air", "The metabolic waste gas that crosses into brain fluid", "Carbon monoxide bound tightly to heme iron", "Extra dissolved nitrogen acquired during a deep dive"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "co2-main-respiratory-drive", "taskCategory": "mechanism"}$op$,
  $ky$The metabolic waste gas that crosses into brain fluid$ky$,
  $ex$The best choice is "The metabolic waste gas that crosses into brain fluid". The main stimulus to breathe is carbon dioxide, not oxygen. Rising carbon dioxide crosses into brain extracellular fluid and is sensed by central chemoreceptors. Her oxygen is 95 mm Hg, and the breathing increase follows the waste gas, not a matched oxygen change. "Oxygen, because arterial oxygen is the main drive at rest" is not the best choice because Oxygen is not the main drive at rest. The vignette says a matched oxygen change does not increase her breathing. "Nitrogen, which makes up most of ordinary room air" is not the best choice because Nitrogen is most of atmospheric air, about 78.6 percent, but it is not the chemical drive to breathe. "Carbon monoxide bound tightly to heme iron" is not the best choice because Carbon monoxide binds heme much more tightly than oxygen. It is not the waste gas of metabolism that crosses into brain fluid. "Extra dissolved nitrogen acquired during a deep dive" is not the best choice because Extra dissolved nitrogen is a high-pressure diving problem. She is breathing room air.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '872d0530c388bf9eb7642800443bfc1ed2b6487b699c1b43a4c1369ef393571c', false, NOW(), NOW(), 3,
  'co2-main-respiratory-drive', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'co2-main-respiratory-drive', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-133", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "C", "verifiedFact": "The main chemical drive to breathe is carbon dioxide, not oxygen. Rising CO2 diffuses into brain extracellular fluid, and central chemoreceptors respond. Peripheral chemoreceptors sit in the carotid arteries and aortic arch."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280134', 'usmle-step-1', 'physiology',
  $sc$A 68-year-old man who had a stroke pauses his breathing for 15 seconds while asleep, with no effort of the chest. Temperature is 36.8°C, pulse is 80/min, respirations are 10/min when he breathes, and blood pressure is 146/84 mm Hg. The waste gas in his blood is rising during each pause, but the brainstem centers do not answer by driving the diaphragm. Airflow is not blocked by the tongue.$sc$,
  $qu$Which of the following best explains the pauses?$qu$,
  $op${"options": ["The tongue blocks the airway while the diaphragm still pulls", "Type II cells stop secreting the anti-collapse substance", "Pulmonary arterioles all dilate and waste the next breath", "The medullary drive ignores the climbing waste-gas level", "The pleural space fills with air and the lung recoils shut"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "central-sleep-apnea-co2", "taskCategory": "mechanism"}$op$,
  $ky$The medullary drive ignores the climbing waste-gas level$ky$,
  $ex$The best choice is "The medullary drive ignores the climbing waste-gas level". Central sleep apnea means the respiratory centers do not respond properly to rising carbon dioxide, so they do not stimulate the diaphragm and intercostals. Stroke can damage the pons or medulla. His chest makes no effort, the waste gas rises, and the airway is not blocked. "The tongue blocks the airway while the diaphragm still pulls" is not the best choice because Effort against a blocked airway is the obstructive pattern. His chest makes no effort, and the tongue is not blocking flow. "Type II cells stop secreting the anti-collapse substance" is not the best choice because Missing surfactant collapses alveoli. It does not make the brainstem ignore a rising waste-gas signal. "Pulmonary arterioles all dilate and waste the next breath" is not the best choice because Poorly ventilated alveoli constrict their arterioles. That does not stop the brainstem from driving the diaphragm. "The pleural space fills with air and the lung recoils shut" is not the best choice because Air in the pleural space is not described. The failure is the brainstem response.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '68dab979088358951d3550b1118aa43fd9b440e3fc92b60e1ba515d8c312ebe0', false, NOW(), NOW(), 3,
  'central-sleep-apnea-co2', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'central-sleep-apnea-co2', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-134", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "D", "verifiedFact": "In central sleep apnea the respiratory centers do not respond properly to rising carbon dioxide, so they do not regularly stimulate the diaphragm and intercostals. Morphine can also depress those centers."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280135', 'usmle-step-1', 'physiology',
  $sc$A 38-year-old woman who archives photographs finishes a normal quiet exhalation and stops. Temperature is 36.6°C, pulse is 70/min, respirations are 13/min, and blood pressure is 114/70 mm Hg. She has not forced any more air out. The volume still in the lungs is the sum of what she could still force out and what would remain even after that forced effort.$sc$,
  $qu$Which of the following two volumes make up the air still in her lungs?$qu$,
  $op${"options": ["The quiet breath, plus the extra she could still inhale", "Only the quiet 500 mL breath she just finished", "Every lung volume, including the air she can still inhale", "The inspiratory reserve alone, after a maximal inhalation", "What she could still force out, plus air she cannot exhale"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "functional-residual-capacity", "taskCategory": "mechanism"}$op$,
  $ky$What she could still force out, plus air she cannot exhale$ky$,
  $ex$The best choice is "What she could still force out, plus air she cannot exhale". After a normal tidal expiration, the remaining air is the functional residual capacity, which is expiratory reserve plus residual volume. She stopped after a quiet exhalation, and the description matches those two leftover parts. "The quiet breath, plus the extra she could still inhale" is not the best choice because Tidal volume plus inspiratory reserve is inspiratory capacity, the air that can be inhaled after a quiet expiration, not the air still inside. "Only the quiet 500 mL breath she just finished" is not the best choice because The quiet breath is what she just exhaled. It is not the volume remaining. "Every lung volume, including the air she can still inhale" is not the best choice because The sum of all volumes is total lung capacity, which includes air she could still inhale. She is at the end of a quiet exhalation. "The inspiratory reserve alone, after a maximal inhalation" is not the best choice because Inspiratory reserve is extra inhaled air, measured from a quiet inspiration, not the air left after a quiet exhalation.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '29360dcbac3ee68913050310a08487ea82fc549441285e9dff93d09cd1befa89', false, NOW(), NOW(), 4,
  'functional-residual-capacity', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'functional-residual-capacity', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-135", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "E", "verifiedFact": "Functional residual capacity is the air left after a normal tidal expiration. It is expiratory reserve volume plus residual volume."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280136', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old man who sprints stairs has acid collecting in working muscle. Temperature is 37.4°C, pulse is 140/min, respirations are 28/min, and blood pressure is 150/70 mm Hg. Local pH falls. Oxygen leaves hemoglobin more readily there than it does in a resting muscle at the same oxygen pressure of 40 mm Hg.$sc$,
  $qu$Which of the following makes oxygen leave hemoglobin more readily here?$qu$,
  $op${"options": ["A more acidic pH at the working muscle", "A more alkaline pH at the working muscle", "A lower temperature inside the working muscle", "Less 2,3-bisphosphoglycerate in the red cells", "Fetal hemoglobin replacing adult hemoglobin"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "bohr-effect-acid", "taskCategory": "mechanism"}$op$,
  $ky$A more acidic pH at the working muscle$ky$,
  $ex$The best choice is "A more acidic pH at the working muscle". The Bohr effect is that a lower, more acidic pH promotes oxygen dissociation from hemoglobin. His working muscle is acidic, and oxygen leaves more readily than in resting muscle at the same oxygen pressure. "A more alkaline pH at the working muscle" is not the best choice because A higher pH inhibits dissociation. That would hold oxygen on hemoglobin, the opposite of this muscle. "A lower temperature inside the working muscle" is not the best choice because A higher temperature promotes dissociation. A lower temperature inhibits it. Working muscle is the warmer case, but the comparison he was given is the fall in pH. "Less 2,3-bisphosphoglycerate in the red cells" is not the best choice because More 2,3-bisphosphoglycerate, not less, promotes oxygen dissociation. "Fetal hemoglobin replacing adult hemoglobin" is not the best choice because Fetal hemoglobin has a higher affinity for oxygen than adult hemoglobin, so it holds oxygen more tightly. He is an adult sprinter.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '84c18c0edb4cf8484e5bbc5053f3a98855a38048c2891ca497735b80f09b033b', false, NOW(), NOW(), 3,
  'bohr-effect-acid', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bohr-effect-acid', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-136", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "A", "verifiedFact": "The Bohr effect: a lower, more acidic pH promotes oxygen dissociation from hemoglobin. A higher pH inhibits dissociation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280137', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old woman who is pregnant has red cells making more of a glycolytic byproduct. Temperature is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 112/68 mm Hg. Her red cells have no mitochondria. The byproduct makes oxygen leave hemoglobin more readily at a given oxygen pressure.$sc$,
  $qu$Which of the following is true of the cells that make this byproduct?$qu$,
  $op${"options": ["They use mitochondria and oxidative phosphorylation", "They make ATP only by glycolysis, because they lack mitochondria", "They are type II alveolar cells secreting the anti-collapse film", "They are medullary neurons that set the breathing rhythm", "They are the pacemaker cells beside the vena cava"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "bpg-dissociation", "taskCategory": "mechanism"}$op$,
  $ky$They make ATP only by glycolysis, because they lack mitochondria$ky$,
  $ex$The best choice is "They make ATP only by glycolysis, because they lack mitochondria". Red cells have no mitochondria, so glycolysis is their only ATP source. 2,3-bisphosphoglycerate is a glycolytic byproduct and promotes oxygen release from hemoglobin. Her red cells are making more of it. "They use mitochondria and oxidative phosphorylation" is not the best choice because The byproduct comes from glycolysis. These cells do not use mitochondria. "They are type II alveolar cells secreting the anti-collapse film" is not the best choice because Type II alveolar cells secrete surfactant. They are not the cells whose missing mitochondria define this pathway. "They are medullary neurons that set the breathing rhythm" is not the best choice because Medullary respiratory neurons pace breathing. They are not the source of this red-cell byproduct. "They are the pacemaker cells beside the vena cava" is not the best choice because The SA node paces the heart. It does not make the glycolytic byproduct that shifts oxygen off hemoglobin.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '048fa79d321a128883d1ae1c0994f89860d57f9e9e07e67c25dde2b11e334f89', false, NOW(), NOW(), 4,
  'bpg-dissociation', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bpg-dissociation', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-137", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "B", "verifiedFact": "Erythrocytes lack mitochondria and make ATP only by glycolysis. 2,3-bisphosphoglycerate, a glycolytic byproduct, promotes oxygen dissociation from hemoglobin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280138', 'usmle-step-1', 'physiology',
  $sc$A 32-week fetus is oxygenated across the placenta. Temperature of the pregnant woman is 36.7°C, her pulse is 90/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. Oxygen pressure on the maternal side of the placenta is 40 mm Hg, and on the fetal side it is 20 mm Hg. The fetus still loads oxygen onto its red-cell protein.$sc$,
  $qu$Which of the following lets the fetus load oxygen at that low pressure?$qu$,
  $op${"options": ["Its hemoglobin holds oxygen less tightly than adult hemoglobin", "Maternal arterial oxygen pressure at the placenta is 104 mm Hg", "Its hemoglobin holds oxygen more tightly than adult hemoglobin", "Fetal red cells bind oxygen to globin amino acids, not to iron", "The placenta pumps oxygen with an ATP-driven carrier"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "fetal-hemoglobin-affinity", "taskCategory": "mechanism"}$op$,
  $ky$Its hemoglobin holds oxygen more tightly than adult hemoglobin$ky$,
  $ex$The best choice is "Its hemoglobin holds oxygen more tightly than adult hemoglobin". Fetal hemoglobin has a greater affinity for oxygen than adult hemoglobin because two subunits differ. That lets the fetus load oxygen even though placental maternal oxygen pressure is only about 35 to 50 mm Hg and fetal pressure is about 20 mm Hg. The values here are 40 and 20. "Its hemoglobin holds oxygen less tightly than adult hemoglobin" is not the best choice because Lower affinity would release oxygen, which is the adult response in tissues, not how the fetus loads oxygen at low pressure. "Maternal arterial oxygen pressure at the placenta is 104 mm Hg" is not the best choice because About 104 mm Hg is alveolar oxygen pressure, not the oxygen pressure of maternal blood at the placenta. "Fetal red cells bind oxygen to globin amino acids, not to iron" is not the best choice because Carbon dioxide binds globin amino acids. Oxygen binds the iron in heme, in both fetal and adult hemoglobin. "The placenta pumps oxygen with an ATP-driven carrier" is not the best choice because Gas exchange at the chorion, like the lung, follows partial-pressure gradients. It is not an ATP pump.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6743d332b1c2f9b3f06e56e10cbd310a88b0642825a291cca1197a54a9002599', false, NOW(), NOW(), 3,
  'fetal-hemoglobin-affinity', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'fetal-hemoglobin-affinity', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-138", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "C", "verifiedFact": "Fetal hemoglobin has a higher oxygen affinity than adult hemoglobin because two of its four subunits differ. Placental maternal PO2 is about 35 to 50 mm Hg and fetal PO2 is about 20 mm Hg."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280139', 'usmle-step-1', 'physiology',
  $sc$A 42-year-old man who teaches chemistry follows a labeled carbon dioxide molecule from muscle into blood. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Most such molecules are carried in a converted ionic form. A red-cell enzyme joins the gas to water as the first step of that conversion.$sc$,
  $qu$Which of the following is the main way this gas is carried?$qu$,
  $op${"options": ["Dissolved in plasma, which accounts for most of the load", "Bound to the iron of heme, the same site oxygen uses", "Bound to globin, which accounts for most of the load", "As bicarbonate after a red-cell enzyme joins it to water", "Inside neutrophils as a carbamino compound"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "co2-mostly-bicarbonate", "taskCategory": "mechanism"}$op$,
  $ky$As bicarbonate after a red-cell enzyme joins it to water$ky$,
  $ex$The best choice is "As bicarbonate after a red-cell enzyme joins it to water". About 70 percent of carbon dioxide travels as bicarbonate. Carbonic anhydrase in red cells joins carbon dioxide to water to make carbonic acid, which splits into bicarbonate and hydrogen. His molecule follows that majority path. "Dissolved in plasma, which accounts for most of the load" is not the best choice because Only about 7 to 10 percent is dissolved in plasma. That is not most of the load. "Bound to the iron of heme, the same site oxygen uses" is not the best choice because Oxygen binds heme iron. Carbon dioxide does not use that site. "Bound to globin, which accounts for most of the load" is not the best choice because About 20 percent binds globin as carbaminohemoglobin. That is not the majority. "Inside neutrophils as a carbamino compound" is not the best choice because The carbamino compound is on hemoglobin in red cells, not in neutrophils.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '899cf22035dde15d5ed4463dac879d3d015871cedf4ff1cbccc20eae0ce8cc25', false, NOW(), NOW(), 2,
  'co2-mostly-bicarbonate', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'co2-mostly-bicarbonate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-139", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "D", "verifiedFact": "About 70 percent of carbon dioxide is transported as bicarbonate, about 20 percent as carbaminohemoglobin, and about 7 to 10 percent dissolved. Carbonic anhydrase in red cells forms carbonic acid."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280140', 'usmle-step-1', 'physiology',
  $sc$A 36-year-old woman who edits film has red cells studied as they pass a working muscle. Temperature is 36.7°C, pulse is 80/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Bicarbonate builds up inside the red cells and then leaves. A different negative ion enters one-for-one, and the cell's charge does not change.$sc$,
  $qu$Which of the following ion enters as bicarbonate leaves?$qu$,
  $op${"options": ["Sodium, so the interior becomes more positive", "Potassium, leaving the cell even more negative", "Calcium, to bind troponin in the red cell", "Bicarbonate itself, in the same direction", "Chloride, one negative ion exchanged for another"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "chloride-shift", "taskCategory": "mechanism"}$op$,
  $ky$Chloride, one negative ion exchanged for another$ky$,
  $ex$The best choice is "Chloride, one negative ion exchanged for another". The chloride shift is bicarbonate leaving the red cell in exchange for chloride. One negative ion replaces another, so the charge of the cell and of the plasma does not change. Bicarbonate is leaving her red cells at the muscle. "Sodium, so the interior becomes more positive" is not the best choice because Sodium entry would change the charge. The exchange is arranged so the charge does not change. "Potassium, leaving the cell even more negative" is not the best choice because Potassium is not the ion traded for bicarbonate in this exchange. "Calcium, to bind troponin in the red cell" is not the best choice because Calcium binding to troponin is a muscle mechanism. Red cells are not contracting. "Bicarbonate itself, in the same direction" is not the best choice because Bicarbonate is the ion leaving. The ion that enters is chloride.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'de29f701a2d975dc0333d4ac122c7ca9645b076a5fb563d45e9219d7c0a1cae7', false, NOW(), NOW(), 4,
  'chloride-shift', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'chloride-shift', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-140", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "E", "verifiedFact": "Bicarbonate leaves the red cell in exchange for chloride, the chloride shift, so the cell's charge does not change. At the lung the exchange reverses."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280141', 'usmle-step-1', 'physiology',
  $sc$A 50-year-old man who sands floors has two blood samples. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Sample A is leaving the lungs, nearly full of oxygen, and it binds little carbon dioxide. Sample B is in a working muscle, oxygen-poor, and it binds carbon dioxide readily.$sc$,
  $qu$Which of the following explains the difference between the samples?$qu$,
  $op${"options": ["Oxygen-loaded hemoglobin binds carbon dioxide poorly", "Oxygen-loaded hemoglobin binds carbon dioxide more tightly", "Only dissolved carbon dioxide can bind oxygen-loaded hemoglobin", "Carbon dioxide binds heme iron whenever oxygen is bound", "The chloride shift runs only in oxygen-rich blood"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "haldane-effect", "taskCategory": "mechanism"}$op$,
  $ky$Oxygen-loaded hemoglobin binds carbon dioxide poorly$ky$,
  $ex$The best choice is "Oxygen-loaded hemoglobin binds carbon dioxide poorly". The Haldane effect is that hemoglobin saturated with oxygen does not readily bind carbon dioxide, while deoxygenated hemoglobin binds it more readily. Sample A has just left the lungs full of oxygen. Sample B is oxygen-poor in muscle. "Oxygen-loaded hemoglobin binds carbon dioxide more tightly" is not the best choice because The relationship is the opposite. Oxygen saturation lowers the affinity for carbon dioxide. "Only dissolved carbon dioxide can bind oxygen-loaded hemoglobin" is not the best choice because Dissolved carbon dioxide is a separate fraction, about 7 to 10 percent. It is not the condition for binding to hemoglobin. "Carbon dioxide binds heme iron whenever oxygen is bound" is not the best choice because Carbon dioxide binds globin amino acids, not heme iron, and it binds better when oxygen is absent. "The chloride shift runs only in oxygen-rich blood" is not the best choice because The chloride shift accompanies bicarbonate exit at the tissues and reverses in the lung. It is not limited to oxygen-rich blood.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f1da9e0cf87c73b3198fdfb19e39df3d62c3f72766a5d12fb98b2747ce1c8e66', false, NOW(), NOW(), 4,
  'haldane-effect', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'haldane-effect', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-141", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "A", "verifiedFact": "The Haldane effect: hemoglobin saturated with oxygen does not readily bind carbon dioxide. When oxygen is not bound and oxygen pressure is low, hemoglobin binds carbon dioxide more readily."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280142', 'usmle-step-1', 'physiology',
  $sc$A 21-year-old woman who rows has hemoglobin studied as it loads oxygen in the lung. Temperature is 36.5°C, pulse is 58/min, respirations are 12/min, and blood pressure is 108/66 mm Hg. After the first oxygen attaches, the next oxygen attaches more easily. Each protein can hold several oxygen molecules, one at each iron-containing site.$sc$,
  $qu$Which of the following describes that loading pattern?$qu$,
  $op${"options": ["The first oxygen makes the next oxygen harder to bind", "The first oxygen makes the next oxygen easier to bind", "Oxygen binds amino acids of globin, not the iron", "Only one oxygen can bind, and further binding stops", "Loading that requires ATP at each heme iron"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "cooperative-oxygen-binding", "taskCategory": "mechanism"}$op$,
  $ky$The first oxygen makes the next oxygen easier to bind$ky$,
  $ex$The best choice is "The first oxygen makes the next oxygen easier to bind". Binding the first oxygen changes hemoglobin so the next oxygen binds more readily, until all four heme sites are filled. Her loading shows that facilitation, at iron-containing sites. "The first oxygen makes the next oxygen harder to bind" is not the best choice because Facilitation is the observed pattern, not hindrance, as successive oxygens bind. "Oxygen binds amino acids of globin, not the iron" is not the best choice because Carbon dioxide binds globin. Oxygen binds the iron in heme. "Only one oxygen can bind, and further binding stops" is not the best choice because Each hemoglobin can carry up to four oxygen molecules, not one. "Loading that requires ATP at each heme iron" is not the best choice because Oxygen binding to heme is not described as an ATP-consuming step.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '4d44ca4005e7a946bb66f9e0537b844b611d7507de29bb309fccce4fca8b2798', false, NOW(), NOW(), 3,
  'cooperative-oxygen-binding', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cooperative-oxygen-binding', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-142", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "B", "verifiedFact": "Each hemoglobin has four iron-containing heme groups and can carry four oxygen molecules. Binding of the first oxygen makes the next easier to bind."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280143', 'usmle-step-1', 'physiology',
  $sc$A 45-year-old man who runs a garage is found confused after working with a running engine. Temperature is 36.8°C, pulse is 110/min, respirations are 22/min, and blood pressure is 130/78 mm Hg. A gas in the exhaust occupies the oxygen-binding sites because the red-cell protein holds that gas much more tightly than oxygen. He is placed in a chamber where the surrounding pressure is raised and he breathes added oxygen.$sc$,
  $qu$Which of the following is the point of the high-pressure oxygen?$qu$,
  $op${"options": ["The exhaust gas is oxidized to carbon dioxide by heme iron", "Surfactant production rises and collapsed alveoli reopen", "More oxygen dissolves and displaces the exhaust gas from heme", "The ventral medullary group is directly stimulated", "Bicarbonate is converted back to the exhaust gas"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "carbon-monoxide-affinity", "taskCategory": "mechanism"}$op$,
  $ky$More oxygen dissolves and displaces the exhaust gas from heme$ky$,
  $ex$The best choice is "More oxygen dissolves and displaces the exhaust gas from heme". Hemoglobin binds carbon monoxide much more tightly than oxygen, so carbon monoxide replaces oxygen. Raised atmospheric pressure in a hyperbaric chamber dissolves more oxygen and that oxygen displaces carbon monoxide from hemoglobin. He was exposed to engine exhaust and is treated that way. "The exhaust gas is oxidized to carbon dioxide by heme iron" is not the best choice because The treatment does not oxidize carbon monoxide to carbon dioxide on heme. It displaces it by raising dissolved oxygen. "Surfactant production rises and collapsed alveoli reopen" is not the best choice because Surfactant reopens alveoli that lack it. That is not the exhaust-gas problem. "The ventral medullary group is directly stimulated" is not the best choice because The ventral respiratory group paces breathing. The chamber is used to move the gas off hemoglobin. "Bicarbonate is converted back to the exhaust gas" is not the best choice because Bicarbonate is the carriage form of carbon dioxide, not of the exhaust gas on heme.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a94ee724780c90a28bfcf9e1c4f30f48ac7f2be16210456f240ab324e2d06059', false, NOW(), NOW(), 3,
  'carbon-monoxide-affinity', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'carbon-monoxide-affinity', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-143", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "C", "verifiedFact": "Hemoglobin's affinity for carbon monoxide is much stronger than its affinity for oxygen, so carbon monoxide replaces oxygen. Hyperbaric oxygen raises dissolved oxygen and displaces carbon monoxide from hemoglobin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280144', 'usmle-step-1', 'physiology',
  $sc$A 53-year-old woman who teaches pottery has one lung region with a high carbon dioxide pressure in the alveoli. Temperature is 36.7°C, pulse is 82/min, respirations are 18/min, and blood pressure is 126/74 mm Hg. The small airways to that region widen. The arterioles there do not widen, because oxygen in those alveoli is not high.$sc$,
  $qu$Which of the following widened the small airways?$qu$,
  $op${"options": ["A high oxygen pressure inside those same alveoli", "Low carbon dioxide pressure inside those alveoli", "Constriction of every pulmonary arteriole in that region", "High carbon dioxide pressure inside those alveoli", "A fall in pleural pressure to 4 mm Hg above alveolar pressure"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "bronchioles-co2-dilate", "taskCategory": "mechanism"}$op$,
  $ky$High carbon dioxide pressure inside those alveoli$ky$,
  $ex$The best choice is "High carbon dioxide pressure inside those alveoli". A higher partial pressure of carbon dioxide in the alveoli widens bronchioles so carbon dioxide can be exhaled faster. Her small airways widened where alveolar carbon dioxide is high, and the arterioles did not widen because oxygen there is not high. "A high oxygen pressure inside those same alveoli" is not the best choice because High alveolar oxygen dilates pulmonary arterioles, not the bronchioles. The vignette says the arterioles did not widen. "Low carbon dioxide pressure inside those alveoli" is not the best choice because Low alveolar carbon dioxide would not be the stimulus that increases airway diameter. "Constriction of every pulmonary arteriole in that region" is not the best choice because Arteriole constriction redirects blood away from poorly ventilated alveoli. It is not what widened the airways. "A fall in pleural pressure to 4 mm Hg above alveolar pressure" is not the best choice because Intrapleural pressure stays below alveolar pressure, about 4 mm Hg lower, not 4 mm Hg higher.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'be7aac774a3d1fe08e630e2177d379d66140382216364072e48838efcd0e3d4d', false, NOW(), NOW(), 3,
  'bronchioles-co2-dilate', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'bronchioles-co2-dilate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-144", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "D", "verifiedFact": "Bronchiolar diameter responds to alveolar carbon dioxide. Higher alveolar carbon dioxide widens bronchioles. Higher alveolar oxygen widens pulmonary arterioles."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280145', 'usmle-step-1', 'physiology',
  $sc$A 34-year-old man who dives for salvage breathes compressed air at depth. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Nitrogen, which barely dissolves at sea-level pressure, now dissolves in his blood in a much larger amount. He ascends without stopping.$sc$,
  $qu$Which of the following explains the extra dissolved nitrogen?$qu$,
  $op${"options": ["Nitrogen becomes highly soluble only because he is colder", "Hemoglobin binds nitrogen at the same iron site as oxygen", "Carbonic anhydrase converts nitrogen into bicarbonate", "Type II cells secrete nitrogen into the alveolar water film", "A higher nitrogen pressure drives more of it into the blood"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "henry-nitrogen-dive", "taskCategory": "mechanism"}$op$,
  $ky$A higher nitrogen pressure drives more of it into the blood$ky$,
  $ex$The best choice is "A higher nitrogen pressure drives more of it into the blood". Henry's law says the amount of gas dissolved is proportional to partial pressure and solubility. Nitrogen solubility is low, but the high nitrogen pressure in compressed air at depth dissolves more of it. He breathed that air and ascended without a stop. "Nitrogen becomes highly soluble only because he is colder" is not the best choice because The source of the extra dissolved nitrogen is the raised partial pressure, not a change in body temperature. "Hemoglobin binds nitrogen at the same iron site as oxygen" is not the best choice because Hemoglobin's iron site binds oxygen. Nitrogen's problem here is dissolved gas, not heme binding. "Carbonic anhydrase converts nitrogen into bicarbonate" is not the best choice because Carbonic anhydrase handles carbon dioxide and water, not nitrogen. "Type II cells secrete nitrogen into the alveolar water film" is not the best choice because Type II cells secrete surfactant. They do not secrete nitrogen into the lining film.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '8e985123d82fa7664c71bd6e626ba09dcf51fa892750d05648a08986c3b55b13', false, NOW(), NOW(), 3,
  'henry-nitrogen-dive', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'henry-nitrogen-dive', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-145", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "E", "verifiedFact": "Henry's law: gas dissolved in a liquid is proportional to its partial pressure and solubility. Nitrogen is poorly soluble at ordinary pressure, but high nitrogen pressure in scuba air dissolves more nitrogen in blood."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280146', 'usmle-step-1', 'physiology',
  $sc$A 52-year-old man who stands to teach has 130 mL in each ventricle at the end of filling, just before contraction. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. He then ejects 75 mL. The 130 mL figure is the resting standing value.$sc$,
  $qu$Which of the following is that 130 mL volume?$qu$,
  $op${"options": ["The filled ventricular volume just before contraction", "The volume ejected from the ventricle in one beat", "The volume remaining in the ventricle after ejection", "The atrial contribution alone, about a fifth of filling", "Myocardial venous return collected over one minute"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "end-diastolic-volume-preload", "taskCategory": "mechanism"}$op$,
  $ky$The filled ventricular volume just before contraction$ky$,
  $ex$The best choice is "The filled ventricular volume just before contraction". End-diastolic volume, about 130 mL at rest while standing, is the ventricular blood volume at the end of filling, also called preload. He is at 130 mL just before contraction and then ejects 75 mL. "The volume ejected from the ventricle in one beat" is not the best choice because The ejected volume is stroke volume, here 75 mL, normally 70 to 80 mL. "The volume remaining in the ventricle after ejection" is not the best choice because The volume remaining after ejection is the end-systolic volume, about 50 to 60 mL, not 130 mL. "The atrial contribution alone, about a fifth of filling" is not the best choice because Atrial contraction adds about 20 to 30 percent of filling, not the whole 130 mL. "Myocardial venous return collected over one minute" is not the best choice because The coronary sinus returns myocardial venous blood to the right atrium. It is not this ventricular filling volume.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '34522046bf758bb7c9d47a35434887d111f9ba3e9b8a2be94c8ca0d97eb7cf7e', false, NOW(), NOW(), 2,
  'end-diastolic-volume-preload', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'end-diastolic-volume-preload', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-146", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "A", "verifiedFact": "End-diastolic volume, about 130 mL in a resting adult standing, is the ventricular volume at the end of filling and is preload."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280147', 'usmle-step-1', 'physiology',
  $sc$A 59-year-old woman who catalogs seeds is at the start of ventricular relaxation. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. Ventricular pressure has fallen below aortic pressure. A small notch appears on the arterial tracing as flow briefly reverses. The valves between atria and ventricles are still shut, and ventricular volume does not change.$sc$,
  $qu$Which of the following produces the notch?$qu$,
  $op${"options": ["Opening of the mitral valve as atrial pressure wins", "Brief backflow that shuts the aortic and pulmonary valves", "Atrial contraction topping up a stiff ventricle", "The start of ejection while all valves are open", "Coronary flow entering the left ventricle directly"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "isovolumic-relaxation-dicrotic", "taskCategory": "mechanism"}$op$,
  $ky$Brief backflow that shuts the aortic and pulmonary valves$ky$,
  $ex$The best choice is "Brief backflow that shuts the aortic and pulmonary valves". When ventricular pressure drops below aortic and pulmonary pressure, blood flows back toward the heart and the semilunar valves close. That brief reversal is the dicrotic notch. The AV valves are still closed, so volume stays constant. Her tracing shows the notch as pressure falls and volume is flat. "Opening of the mitral valve as atrial pressure wins" is not the best choice because The mitral valve opens later, when ventricular pressure falls below atrial pressure. It is still shut. "Atrial contraction topping up a stiff ventricle" is not the best choice because Atrial contraction pushing blood into a stiff ventricle is S4, not this arterial notch at the start of relaxation. "The start of ejection while all valves are open" is not the best choice because Ejection requires the semilunar valves open and the AV valves closed. This moment is the closing of the semilunar valves. "Coronary flow entering the left ventricle directly" is not the best choice because Coronary venous blood enters the right atrium, not the left ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'e45d082d22ddfdb688e5fedfb428e336db93f353bb739406688d6ce6c182001a', false, NOW(), NOW(), 3,
  'isovolumic-relaxation-dicrotic', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'isovolumic-relaxation-dicrotic', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-147", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "B", "verifiedFact": "Early ventricular diastole: when ventricular pressure falls below aortic and pulmonary pressure, blood starts back and the semilunar valves close, causing the dicrotic notch. AV valves are still closed, so volume stays constant. This is isovolumic relaxation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280148', 'usmle-step-1', 'physiology',
  $sc$A 18-year-old man who plays soccer has a murmur that gets louder when he breathes in and softer when he breathes out. Temperature is 36.6°C, pulse is 64/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The murmur is heard best at the left upper sternal border. A second murmur, heard at the apex, does the reverse.$sc$,
  $qu$Which of the following does breathing in do to right-sided flow?$qu$,
  $op${"options": ["It increases flow into the left side of the heart", "It closes the aortic valve for the whole breath", "It increases flow into the right side of the heart", "It sends blood from the aorta into the pulmonary trunk", "It stops venous return until expiration begins"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "inspiration-right-murmur", "taskCategory": "mechanism"}$op$,
  $ky$It increases flow into the right side of the heart$ky$,
  $ex$The best choice is "It increases flow into the right side of the heart". Inhalation increases blood flow into the right heart and can amplify right-sided murmurs. His murmur grows on inspiration and is loudest at the upper left sternal border. The apical murmur that does the opposite fits a left-sided sound, which expiration can amplify. "It increases flow into the left side of the heart" is not the best choice because Increased left-sided flow is not the effect of inspiration. Expiration is the maneuver that can make left-sided murmurs louder. "It closes the aortic valve for the whole breath" is not the best choice because The aortic valve still opens and closes with each beat. Inspiration does not keep it shut. "It sends blood from the aorta into the pulmonary trunk" is not the best choice because Aorta-to-pulmonary-trunk flow is a patent ductus, not an effect of one breath. "It stops venous return until expiration begins" is not the best choice because Inspiration increases right-heart filling. It does not stop venous return.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '995a7447d2ce506fab6a22639ea8505b7580ed9911bcc692632a2495b898525d', false, NOW(), NOW(), 3,
  'inspiration-right-murmur', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'inspiration-right-murmur', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-148", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "C", "verifiedFact": "Inhalation increases blood flow into the right heart and can make right-sided murmurs louder. Expiration can make left-sided murmurs louder."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280149', 'usmle-step-1', 'anatomy',
  $sc$A 43-year-old woman who restores pottery has four vessels entering one atrium. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The blood in those vessels has just left the lungs and is oxygen-rich. The venae cavae enter the other atrium.$sc$,
  $qu$Which of the following chamber receives these four vessels?$qu$,
  $op${"options": ["The atrium that sends blood into the pulmonary ventricle", "The ventricle that ejects into the pulmonary trunk", "The ventricle that ejects its blood into the aorta", "The atrium that sends blood into the systemic ventricle", "The coronary vein opening beside the inferior vena cava"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "pulmonary-veins-left-atrium", "taskCategory": "anatomy"}$op$,
  $ky$The atrium that sends blood into the systemic ventricle$ky$,
  $ex$The best choice is "The atrium that sends blood into the systemic ventricle". The four pulmonary veins return oxygenated blood to the left atrium, which empties into the left ventricle, the systemic pump. The venae cavae enter the other atrium, matching her study. "The atrium that sends blood into the pulmonary ventricle" is not the best choice because The right atrium receives systemic venous blood and sends it toward the right ventricle and the lungs. "The ventricle that ejects into the pulmonary trunk" is not the best choice because The right ventricle receives blood from the right atrium, not from the four pulmonary veins. "The ventricle that ejects its blood into the aorta" is not the best choice because The left ventricle receives blood from the left atrium through the mitral valve. The four vessels enter the atrium first. "The coronary vein opening beside the inferior vena cava" is not the best choice because The coronary sinus opens into the right atrium near the inferior vena cava. It is one vessel, not four from the lungs.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'f32ca0c8a55ef40efd6e821e353499bcac4155a8e855a01026e578adaa5f8ae1', false, NOW(), NOW(), 2,
  'pulmonary-veins-left-atrium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'pulmonary-veins-left-atrium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-149", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "D", "verifiedFact": "Four pulmonary veins empty oxygenated blood into the left atrium. The venae cavae and coronary sinus empty into the right atrium."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280150', 'usmle-step-1', 'anatomy',
  $sc$A 66-year-old man who drives a bus has three venous openings into one chamber. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 140/82 mm Hg. One opening brings blood from above the diaphragm, one from below the diaphragm, and one brings blood that has perfused the heart muscle. The chamber then sends blood across a three-cusp valve.$sc$,
  $qu$Which of the following chamber has these three openings?$qu$,
  $op${"options": ["The atrium that receives the four pulmonary veins", "The ventricle that ejects its blood into the aorta", "The ventricle that ejects into the pulmonary trunk", "The fluid-filled sac that surrounds the heart", "The atrium that empties across the three-cusp valve"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "right-atrium-three-inflows", "taskCategory": "anatomy"}$op$,
  $ky$The atrium that empties across the three-cusp valve$ky$,
  $ex$The best choice is "The atrium that empties across the three-cusp valve". The right atrium receives the superior vena cava from above the diaphragm, the inferior vena cava from below it, and the coronary sinus from the heart muscle. It empties through the tricuspid valve. His three openings and the three-cusp valve match. "The atrium that receives the four pulmonary veins" is not the best choice because The left atrium receives four pulmonary veins, not these three systemic and coronary veins. "The ventricle that ejects its blood into the aorta" is not the best choice because The left ventricle ejects into the aorta. It does not receive the venae cavae. "The ventricle that ejects into the pulmonary trunk" is not the best choice because The right ventricle receives blood only after it has passed the tricuspid valve. The three veins open into the atrium. "The fluid-filled sac that surrounds the heart" is not the best choice because The pericardial cavity contains serous fluid, not these three venous openings.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'b02382187362f1a383f487035edb2ad1eee6ebfe53c6f351ad9eac779d4ee4ed', false, NOW(), NOW(), 2,
  'right-atrium-three-inflows', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'right-atrium-three-inflows', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-150", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "E", "verifiedFact": "The right atrium receives the superior vena cava, the inferior vena cava, and the coronary sinus."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280151', 'usmle-step-1', 'anatomy',
  $sc$A 50-year-old woman who teaches piano has atrial and ventricular muscle separated by a fibrous ring. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. An impulse in the atrial muscle cannot jump straight into the ventricular muscle. The only muscular bridge is a node low in the right atrium, and passage there takes about 100 ms.$sc$,
  $qu$Which of the following is the effect of that fibrous ring?$qu$,
  $op${"options": ["It forces the impulse through the delaying nodal bridge", "It speeds the impulse from atrial muscle into ventricular muscle", "It is the pacemaker with the fastest inherent rate", "It carries the impulse from the apex up the ventricular walls", "It returns coronary venous blood to the right atrium"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "cardiac-skeleton-blocks-spread", "taskCategory": "mechanism"}$op$,
  $ky$It forces the impulse through the delaying nodal bridge$ky$,
  $ex$The best choice is "It forces the impulse through the delaying nodal bridge". The cardiac skeleton's connective tissue blocks direct spread from atrial muscle into ventricular muscle, so the impulse must use the AV node. Passage through that node takes about 100 ms. Her fibrous ring and the 100 ms bridge match. "It speeds the impulse from atrial muscle into ventricular muscle" is not the best choice because The ring prevents direct spread. It does not speed a muscle-to-muscle jump. "It is the pacemaker with the fastest inherent rate" is not the best choice because The fastest pacemaker is the SA node, not the fibrous ring. "It carries the impulse from the apex up the ventricular walls" is not the best choice because Apex-to-base spread is the job of the Purkinje fibers after the impulse has reached the ventricles. "It returns coronary venous blood to the right atrium" is not the best choice because The coronary sinus, not the fibrous ring, returns myocardial venous blood.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'a643732d95fbbf63377e96958ab59950fde83ef854df7206c0326b5190372aeb', false, NOW(), NOW(), 3,
  'cardiac-skeleton-blocks-spread', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'cardiac-skeleton-blocks-spread', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-151", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "A", "verifiedFact": "Connective tissue of the cardiac skeleton prevents the impulse from spreading from atrial muscle directly into ventricular muscle. The impulse must pass through the AV node."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280152', 'usmle-step-1', 'physiology',
  $sc$A 37-year-old man who drinks four cups of coffee has a single early beat, then a normal rhythm. Temperature is 36.6°C, pulse is 82/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The early beat starts from ventricular muscle, not from the usual atrial pacemaker. It does not recur over the next 10 minutes.$sc$,
  $qu$Which of the following best describes this single early beat?$qu$,
  $op${"options": ["The usual pacemaker fired at its fastest inherent rate", "A site other than the usual pacemaker fired once", "The AV node took over at 40 to 60 beats per minute", "Fibrillation, an uncoordinated quiver, has begun", "The fibrous ring blocked every path into the ventricles"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "ectopic-focus", "taskCategory": "mechanism"}$op$,
  $ky$A site other than the usual pacemaker fired once$ky$,
  $ex$The best choice is "A site other than the usual pacemaker fired once". An ectopic focus is any site other than the SA node that starts an impulse and a premature contraction. Caffeine is one stimulus. A single early beat from ventricular muscle that does not continue is the transient pattern, not a chronic rhythm. "The usual pacemaker fired at its fastest inherent rate" is not the best choice because The usual pacemaker did not start this beat. Ventricular muscle did. "The AV node took over at 40 to 60 beats per minute" is not the best choice because An AV nodal escape is a sustained slower rhythm when the SA node is silent, not one early ventricular beat. "Fibrillation, an uncoordinated quiver, has begun" is not the best choice because Fibrillation is uncoordinated beating. One early beat that returns to normal is not fibrillation. "The fibrous ring blocked every path into the ventricles" is not the best choice because The fibrous skeleton blocks direct atrial-to-ventricular muscle spread. It did not create this early ventricular beat, and the ventricles were activated.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '447664fa20ef2bfe4605b91f3080b96d0ebfa3774094a3e0f43da121ae61f6f6', false, NOW(), NOW(), 3,
  'ectopic-focus', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ectopic-focus', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-152", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "An ectopic focus is a site other than the SA node that starts an impulse and a premature contraction. Occasional ectopic beats are usually transient. A chronic ectopic focus can cause arrhythmia or fibrillation."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280153', 'usmle-step-1', 'physiology',
  $sc$A 69-year-old woman who has chest pressure on walking has a tracing taken during pain. Temperature is 36.8°C, pulse is 96/min, respirations are 18/min, and blood pressure is 148/86 mm Hg. The recovery wave of the ventricles is flat. The segment before that wave is not elevated. Pain stops after 5 minutes of rest.$sc$,
  $qu$Which of the following is the usual meaning of that flat recovery wave?$qu$,
  $op${"options": ["The upper chambers of the heart are enlarged", "An acute infarction is elevating the preceding segment", "Too little oxygen is reaching the heart muscle", "The impulse is delayed inside the lower atrial node", "The usual atrial pacemaker has gone silent"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "flat-t-low-oxygen", "taskCategory": "mechanism"}$op$,
  $ky$Too little oxygen is reaching the heart muscle$ky$,
  $ex$The best choice is "Too little oxygen is reaching the heart muscle". T waves often look flatter when the myocardium is not getting enough oxygen. Her recovery wave is flat during exertional pain, and the preceding segment is not elevated. "The upper chambers of the heart are enlarged" is not the best choice because An amplified P wave may indicate atrial enlargement. The abnormal wave here is the ventricular recovery wave. "An acute infarction is elevating the preceding segment" is not the best choice because ST elevation above baseline is the pattern often seen in acute infarction. That segment is not elevated. "The impulse is delayed inside the lower atrial node" is not the best choice because Delay from the SA node to the AV node lengthens the PR interval. That interval is not the finding. "The usual atrial pacemaker has gone silent" is not the best choice because A silent SA node would hand the rhythm to a slower backup site. The finding is the shape of the recovery wave.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'cd4657d79b6f8043344f19758e7dfbfbd5111cb529a9e519556f6420e211ebbf', false, NOW(), NOW(), 2,
  'flat-t-low-oxygen', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'flat-t-low-oxygen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-153", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "T waves often flatten when too little oxygen is delivered to the myocardium."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280154', 'usmle-step-1', 'anatomy',
  $sc$A 40-year-old man who teaches biology compares two heart-cell types. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. One type makes up almost all of the atrial and ventricular muscle and contains the contracting filaments. The other type is scarce, smaller, and poor in those filaments.$sc$,
  $qu$Which of the following is the scarce cell type?$qu$,
  $op${"options": ["The cells that form almost all of the pumping muscle", "The cells that secrete pericardial fluid", "The endothelial cells lining the chambers", "The cells that start and spread the electrical impulse", "The red cells that bind oxygen in the coronary blood"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "conducting-versus-contractile-cells", "taskCategory": "histology"}$op$,
  $ky$The cells that start and spread the electrical impulse$ky$,
  $ex$The best choice is "The cells that start and spread the electrical impulse". Conducting cells are about 1 percent of heart cells. They are smaller and have few myofibrils. Their job is to start and spread the action potential. The scarce, filament-poor cells are that type. "The cells that form almost all of the pumping muscle" is not the best choice because Contractile cells are about 99 percent and contain the filaments that pump. They are the abundant type. "The cells that secrete pericardial fluid" is not the best choice because Pericardial fluid is secreted by the mesothelium of the epicardium, not by a scarce myocardial cell. "The endothelial cells lining the chambers" is not the best choice because Endocardium is the endothelial lining. It is not the scarce filament-poor myocardial cell. "The red cells that bind oxygen in the coronary blood" is not the best choice because Red cells carry oxygen. They are not a myocardial cell type.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "histology", "anatomy"]$tg$,
  's1-new-20261128-hidden', '4610929858f47f8cb313ccc6e152f02d0a0eb3e6414729c5bc49679b03a19151', false, NOW(), NOW(), 2,
  'conducting-versus-contractile-cells', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'histology', 'conducting-versus-contractile-cells', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-154", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "D", "verifiedFact": "Contractile myocardial cells are about 99 percent of atrial and ventricular cells and do the pumping. Conducting cells are about 1 percent, are smaller, have few myofibrils, and initiate and spread the action potential."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280155', 'usmle-step-1', 'physiology',
  $sc$A 30-year-old woman who swims distance is denervated in a thought experiment based on her tracing. Temperature is 36.5°C, pulse is 52/min, respirations are 12/min, and blood pressure is 104/64 mm Hg. With the nerves and circulating hormones removed, the usual atrial pacemaker would fire faster than her current pulse. Her current pulse is still above 50.$sc$,
  $qu$Which of the following is that pacemaker's rate with nerves and hormones removed?$qu$,
  $op${"options": ["Nearly 40 to 60 beats each minute from the lower node", "Nearly 15 to 20 beats each minute from the terminal fibers", "A rate below 50, called bradycardia for most adults", "The same 52 beats each minute that she has now", "Nearly 80 to 100 beats each minute without outside drive"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "sa-inherent-rate", "taskCategory": "mechanism"}$op$,
  $ky$Nearly 80 to 100 beats each minute without outside drive$ky$,
  $ex$The best choice is "Nearly 80 to 100 beats each minute without outside drive". Isolated from nerves and hormones, the SA node fires about 80 to 100 times per minute. Her resting pulse of 52 is slower than that intrinsic rate, and 52 is still above the 50-per-minute line used for bradycardia in most people. "Nearly 40 to 60 beats each minute from the lower node" is not the best choice because 40 to 60 per minute is the AV node if the SA node is absent. "Nearly 15 to 20 beats each minute from the terminal fibers" is not the best choice because 15 to 20 per minute is the Purkinje fiber rate. "A rate below 50, called bradycardia for most adults" is not the best choice because Bradycardia for most people is a rate below 50. Her pulse is 52, and the intrinsic SA rate is faster, not slower. "The same 52 beats each minute that she has now" is not the best choice because 52 is her current pulse with innervation. The intrinsic pacemaker rate is higher.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '7a1a83db81c8fd0997c5bcc66c7c0e02dee2924823a571f760eb990582bd5d61', false, NOW(), NOW(), 2,
  'sa-inherent-rate', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'sa-inherent-rate', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-155", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "E", "verifiedFact": "Without nervous or endocrine input, the SA node would fire about 80 to 100 times per minute. Rates below 50 per minute are bradycardia for most people."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280156', 'usmle-step-1', 'physiology',
  $sc$A 54-year-old man who stands at a lectern ejects 75 mL from a ventricle that held 130 mL at the end of filling. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. Blood remains in the chamber after the ejection. He is standing, at rest, and not in failure.$sc$,
  $qu$Which of the following is the volume still in the ventricle?$qu$,
  $op${"options": ["About 50 to 60 mL remaining after the beat", "The entire 130 mL that was present before the beat", "The 75 mL that just left the ventricular chamber", "Only the 20 to 30 percent added by atrial contraction", "The coronary venous return of one minute"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "end-systolic-volume", "taskCategory": "mechanism"}$op$,
  $ky$About 50 to 60 mL remaining after the beat$ky$,
  $ex$The best choice is "About 50 to 60 mL remaining after the beat". End-systolic volume is what remains after ejection. From about 130 mL, a stroke volume of 70 to 80 mL leaves about 50 to 60 mL. He ejected 75 mL from 130 mL, so about 55 mL remains. "The entire 130 mL that was present before the beat" is not the best choice because 130 mL is the volume before contraction, not what remains. "The 75 mL that just left the ventricular chamber" is not the best choice because 75 mL is what left. The question asks for what is still inside. "Only the 20 to 30 percent added by atrial contraction" is not the best choice because The atrial contribution is a fraction of filling, not the post-ejection remainder. "The coronary venous return of one minute" is not the best choice because Coronary sinus flow is venous return to the right atrium, not this ventricular remainder.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '0156c297f87bd719b615d91cabdf560b5bc1eacfce071f875859f53126e7002c', false, NOW(), NOW(), 2,
  'end-systolic-volume', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'end-systolic-volume', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-156", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "A", "verifiedFact": "After a stroke volume of about 70 to 80 mL from an end-diastolic volume of about 130 mL, about 50 to 60 mL remains. That remainder is the end-systolic volume."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280157', 'usmle-step-1', 'physiology',
  $sc$A 72-year-old man who no longer walks a block has a soft extra sound in early filling, after the second heart sound. Temperature is 36.7°C, pulse is 96/min, respirations are 20/min, and blood pressure is 150/88 mm Hg. He is not an athlete and not pregnant. The sound is not the one that comes just before the first heart sound.$sc$,
  $qu$Which of the following is the concern when this sound appears at his age?$qu$,
  $op${"options": ["It is the normal sound of semilunar valve closure", "It may mark congestive heart failure and needs more testing", "It is the normal sound made by AV valve closure", "It is expected in every healthy older adult", "It means the usual atrial pacemaker has stopped"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "s3-later-life-failure", "taskCategory": "mechanism"}$op$,
  $ky$It may mark congestive heart failure and needs more testing$ky$,
  $ex$The best choice is "It may mark congestive heart failure and needs more testing". S3 in early filling can be normal in youth, athletes, and pregnancy. Heard later in life, it may indicate congestive heart failure and warrants further tests. He is 72, limited by walking, and the sound is after S2, not before S1. "It is the normal sound of semilunar valve closure" is not the best choice because Semilunar closure is S2, the second sound, not the extra sound after it. "It is the normal sound made by AV valve closure" is not the best choice because AV closure is S1. "It is expected in every healthy older adult" is not the best choice because S3 is rarely heard in healthy adults and is not expected in every older person. "It means the usual atrial pacemaker has stopped" is not the best choice because A silent SA node changes the pacemaker. It does not create an early-filling sound.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd452158858f7a7a36808f842d0c6349c09124c3d12df39da101152b5f98f0e67', false, NOW(), NOW(), 3,
  's3-later-life-failure', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 's3-later-life-failure', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-157", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "B", "verifiedFact": "S3 may be heard in youth, athletes, and pregnancy. Heard later in life, it may indicate congestive heart failure."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280158', 'usmle-step-1', 'anatomy',
  $sc$A 22-year-old man who plays drums has the lower tip of the heart felt just left of the sternum, between the fourth and fifth ribs. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The great vessels attach higher, at the third costal cartilage.$sc$,
  $qu$Which of the following is the lower tip that was felt?$qu$,
  $op${"options": ["The superior end where the great vessels attach", "The right atrial appendage beside the vena cava", "The inferior end of the heart, left of the sternum", "The fibrous sac that anchors the heart", "The sinus that returns myocardial venous blood"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "apex-left-fifth-rib", "taskCategory": "anatomy"}$op$,
  $ky$The inferior end of the heart, left of the sternum$ky$,
  $ex$The best choice is "The inferior end of the heart, left of the sternum". The apex is the inferior tip, just left of the sternum between the fourth and fifth ribs. That is where the impulse was felt. The great vessels attach at the base, higher up. "The superior end where the great vessels attach" is not the best choice because The base is the superior surface at the third costal cartilage, where the great vessels attach. "The right atrial appendage beside the vena cava" is not the best choice because The auricle is an atrial appendage, not the inferior tip between the fourth and fifth ribs. "The fibrous sac that anchors the heart" is not the best choice because The fibrous pericardium is the anchoring sac, not the tip of the heart. "The sinus that returns myocardial venous blood" is not the best choice because The coronary sinus is a vein opening into the right atrium.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'ca696c5bfa81afd397bf5d3255a128aaddd520aa7c1cfe2f478700afbc8fb85c', false, NOW(), NOW(), 2,
  'apex-left-fifth-rib', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'apex-left-fifth-rib', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-158", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "C", "verifiedFact": "The apex is the inferior tip, just to the left of the sternum between the fourth and fifth ribs near their costal cartilages. The base, where the great vessels attach, is at the third costal cartilage."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280159', 'usmle-step-1', 'anatomy',
  $sc$A 39-year-old woman who teaches dance has a thin film of fluid in the space around the heart. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The film is secreted by the outer layer of the heart wall. With each beat the heart slides in that space.$sc$,
  $qu$Which of the following is the role of this fluid film?$qu$,
  $op${"options": ["It is the muscle layer that ejects the stroke volume", "It is the pacemaker with the fastest inherent rate", "It carries oxygen bound to four heme groups", "It lets the heart beat with less rubbing on the sac", "It closes the foramen between the atria after birth"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "pericardial-fluid-friction", "taskCategory": "mechanism"}$op$,
  $ky$It lets the heart beat with less rubbing on the sac$ky$,
  $ex$The best choice is "It lets the heart beat with less rubbing on the sac". Serous fluid in the pericardial cavity, secreted by the epicardial mesothelium, reduces friction as the heart contracts. Her film is in that space and is secreted by the outer wall layer. "It is the muscle layer that ejects the stroke volume" is not the best choice because The myocardium is the muscle. The fluid is not a muscle layer. "It is the pacemaker with the fastest inherent rate" is not the best choice because The SA node is the pacemaker. Fluid does not set the heart rate. "It carries oxygen bound to four heme groups" is not the best choice because Hemoglobin in red cells carries oxygen. Pericardial fluid does not. "It closes the foramen between the atria after birth" is not the best choice because The septum primum closes the foramen ovale. Pericardial fluid does not.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'fca256ccd9882b961c3422021c2697e93f0cdf428e06319400ad97af77713e1c', false, NOW(), NOW(), 2,
  'pericardial-fluid-friction', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'pericardial-fluid-friction', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-159", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "D", "verifiedFact": "The mesothelium of the epicardium secretes serous fluid into the pericardial cavity, which reduces friction as the heart beats."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280160', 'usmle-step-1', 'anatomy',
  $sc$A 48-year-old man who binds books has the inner lining of a ventricle biopsied. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The lining is a single layer of flat cells. The same kind of lining continues into the aorta without a break, and it also covers the valve cusps.$sc$,
  $qu$Which of the following is this inner lining?$qu$,
  $op${"options": ["The thick muscle that generates systolic pressure", "The outer wall layer that also lines the sac", "The tough connective tissue that anchors the heart", "The fluid film in the space around the heart", "A flat-cell layer continuous with the vessel lining"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "endocardium-endothelium", "taskCategory": "histology"}$op$,
  $ky$A flat-cell layer continuous with the vessel lining$ky$,
  $ex$The best choice is "A flat-cell layer continuous with the vessel lining". The endocardium is simple squamous endothelium lining the chambers and covering the valves, continuous with vascular endothelium. His biopsy is one flat-cell layer that continues into the aorta and covers the cusps. "The thick muscle that generates systolic pressure" is not the best choice because The myocardium is the thick muscle, deep to which lies this lining. "The outer wall layer that also lines the sac" is not the best choice because The epicardium is the outer wall layer and the visceral pericardium. "The tough connective tissue that anchors the heart" is not the best choice because The fibrous pericardium is the anchoring sac, outside the heart wall. "The fluid film in the space around the heart" is not the best choice because Pericardial fluid occupies the cavity around the heart. It is not the cellular lining of the chamber.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "histology", "anatomy"]$tg$,
  's1-new-20261128-hidden', '671cb961f23beff6b0dc120ac227879cc2bc9b99aceb7e41adcbf5944fd7e43f', false, NOW(), NOW(), 2,
  'endocardium-endothelium', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'histology', 'endocardium-endothelium', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-160", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "E", "verifiedFact": "The endocardium lines the chambers and covers the valves. It is simple squamous endothelium continuous with the lining of the blood vessels."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280161', 'usmle-step-1', 'pathology',
  $sc$A 16-year-old boy who plays soccer faints after sprints. Temperature is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 150/90 mm Hg in the arms and 100/70 mm Hg in the legs. Imaging shows a narrow segment of the aorta where a fetal vessel used to join the pulmonary trunk. That fetal vessel is now a cord.$sc$,
  $qu$Which of the following is the cord at the narrow segment?$qu$,
  $op${"options": ["The remnant of the fetal channel from the pulmonary trunk", "The remnant of the opening between the two atria", "The band from the right atrium across to the left atrium", "The band that reaches the right papillary muscle", "The sinus that returns myocardial venous blood"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "coarctation-at-ligamentum", "taskCategory": "anatomy"}$op$,
  $ky$The remnant of the fetal channel from the pulmonary trunk$ky$,
  $ex$The best choice is "The remnant of the fetal channel from the pulmonary trunk". The ligamentum arteriosum is the remnant of the ductus arteriosus, and coarctation is typically at that insertion. His aortic narrowing is where that fetal vessel joined, and the vessel is now a cord. Arm pressure is higher than leg pressure. "The remnant of the opening between the two atria" is not the best choice because The fossa ovalis is the remnant of the foramen ovale in the atrial septum, not a cord on the aorta. "The band from the right atrium across to the left atrium" is not the best choice because Bachmann's bundle connects the right atrium to the left atrium. "The band that reaches the right papillary muscle" is not the best choice because The moderator band reaches the right papillary muscle. "The sinus that returns myocardial venous blood" is not the best choice because The coronary sinus returns myocardial venous blood to the right atrium.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "pathology"]$tg$,
  's1-new-20261128-hidden', 'bc01c26eb7eec4607bcb6279c967b016df188d990bf71bec2a75ac1fe7f8d215', false, NOW(), NOW(), 3,
  'coarctation-at-ligamentum', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'coarctation-at-ligamentum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-161", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "A", "verifiedFact": "Coarctation is a congenital narrowing of the aorta, normally at the ligamentum arteriosum, the remnant of the ductus arteriosus."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280162', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old woman who studies muscle compares heart muscle with limb muscle. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Invaginations of the surface membrane in the heart cell occur only at the Z lines. The internal calcium store in those heart cells holds little calcium.$sc$,
  $qu$Which of the following follows from where those invaginations sit?$qu$,
  $op${"options": ["Heart cells have twice as many of them as limb-muscle cells", "Heart cells have half as many of them as limb-muscle cells", "They sit at the A-I junction, as they do in limb muscle", "They store most of the calcium used for contraction", "They are absent, so calcium cannot enter from outside"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "t-tubules-at-z-disc", "taskCategory": "histology"}$op$,
  $ky$Heart cells have half as many of them as limb-muscle cells$ky$,
  $ex$The best choice is "Heart cells have half as many of them as limb-muscle cells". Cardiac T tubules are only at the Z discs, whereas skeletal ones are at the A-I junction, so cardiac muscle has half as many. The sarcoplasmic reticulum stores little calcium, which matches her finding that the internal store holds little. "Heart cells have twice as many of them as limb-muscle cells" is not the best choice because The count is half, not twice, because they occur at only one site per sarcomere region instead of the A-I sites. "They sit at the A-I junction, as they do in limb muscle" is not the best choice because The A-I junction is the skeletal location. Cardiac invaginations are at the Z lines. "They store most of the calcium used for contraction" is not the best choice because The invaginations carry the impulse inward. The internal calcium store is the sarcoplasmic reticulum, and it holds little calcium in heart cells. "They are absent, so calcium cannot enter from outside" is not the best choice because The invaginations are present. Outside calcium is required precisely because the internal store is small.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "histology", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ff1006b286426fc0429e51261d0b99ac61b393e5bec9a220d1e246af68fdea4a', false, NOW(), NOW(), 4,
  't-tubules-at-z-disc', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'histology', 't-tubules-at-z-disc', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-162", "hidden": true, "physicianTask": "histology", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "Cardiac T tubules occur only at the Z discs, so there are half as many as in skeletal muscle, where they occur at the A-I junction. The sarcoplasmic reticulum stores little calcium, so most calcium must enter from outside."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280163', 'usmle-step-1', 'physiology',
  $sc$A 46-year-old man who repairs violins has a ventricular cell that has just fired. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. A second shock during the long depolarized phase produces no new spike. The cell finishes shortening before it can respond.$sc$,
  $qu$Which of the following is the point of that unresponsive interval?$qu$,
  $op${"options": ["The cell can summate twitches the way limb muscle can", "Atrial filling is blocked until the next P wave", "The cell finishes contracting before it can fire again", "The semilunar valves stay open for the whole interval", "Calcium is kept out so the twitch is brief"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "refractory-period-plateau", "taskCategory": "mechanism"}$op$,
  $ky$The cell finishes contracting before it can fire again$ky$,
  $ex$The best choice is "The cell finishes contracting before it can fire again". The long plateau creates a long absolute refractory period so the contractile cell can finish pumping before another action potential. His second shock fails, and shortening completes before the cell can respond. "The cell can summate twitches the way limb muscle can" is not the best choice because Summation of twitches is a skeletal-muscle behavior. The cardiac refractory period prevents a second firing during contraction. "Atrial filling is blocked until the next P wave" is not the best choice because Atrial filling continues on its own timetable. The refractory interval is about the ventricular cell that just fired. "The semilunar valves stay open for the whole interval" is not the best choice because Semilunar valves are open only during ejection, not for a reason tied to a failed second shock. "Calcium is kept out so the twitch is brief" is not the best choice because Calcium entry during the plateau is what prolongs the depolarization. Calcium is not kept out.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '8f41f10bb5b793f8062263e267ad91f9d2c43bee925f3f9e3409c9b181e6b001', false, NOW(), NOW(), 3,
  'refractory-period-plateau', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'refractory-period-plateau', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-163", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "The long plateau and absolute refractory period let the contractile cell finish its contraction before it can fire again."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280164', 'usmle-step-1', 'physiology',
  $sc$A 33-year-old woman who teaches chemistry watches one cycle. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. While the chambers are relaxed, venous pressure exceeds atrial pressure and blood enters the atria. Later, ventricular pressure exceeds aortic pressure and blood leaves the left ventricle.$sc$,
  $qu$Which of the following is the rule both movements follow?$qu$,
  $op${"options": ["Blood moves from the lower pressure toward the higher pressure", "Blood leaves the ventricle only while ventricular pressure is falling", "Blood enters the atrium only while the atrium is contracting", "Blood moves from the higher pressure toward the lower pressure", "Both movements require the semilunar valves to be closed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "pressure-gradient-flow", "taskCategory": "mechanism"}$op$,
  $ky$Blood moves from the higher pressure toward the lower pressure$ky$,
  $ex$The best choice is "Blood moves from the higher pressure toward the lower pressure". Flow follows a pressure gradient, from higher pressure to lower pressure. Venous pressure above atrial pressure fills the atrium in diastole. Ventricular pressure above aortic pressure ejects blood. Both of her observations follow that rule. "Blood moves from the lower pressure toward the higher pressure" is not the best choice because Flow does not go toward the higher pressure. "Blood leaves the ventricle only while ventricular pressure is falling" is not the best choice because Ejection happens while ventricular pressure is high enough to open the aortic valve, not while it is falling below aortic pressure. Falling pressure closes that valve. "Blood enters the atrium only while the atrium is contracting" is not the best choice because Most filling of the ventricle, and venous entry into the atrium, occurs while the chambers are relaxed. "Both movements require the semilunar valves to be closed" is not the best choice because Ejection requires the semilunar valves open. They are closed during filling, so both movements do not share closed semilunar valves.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd5ca85b27b8b0443f9427f26bf1b61206349b526b5d0c5bd98f5be038213ffbe', false, NOW(), NOW(), 2,
  'pressure-gradient-flow', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'pressure-gradient-flow', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-164", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "D", "verifiedFact": "Blood flows from higher pressure to lower pressure. In diastole it enters the atria from the veins, then moves into the ventricles. In ventricular systole it is ejected into the pulmonary trunk and the aorta."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280165', 'usmle-step-1', 'anatomy',
  $sc$A 58-year-old man who flies cargo planes has a thin-walled pouch on the outside of each upper chamber. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Each pouch can fill with blood and then empty into its upper chamber. The pouches are not the thick pumping walls.$sc$,
  $qu$Which of the following is this pouch?$qu$,
  $op${"options": ["The thick wall of the systemic ventricle", "The fibrous sac that anchors the heart in the chest", "The cord left where a fetal artery used to run", "The vein that returns blood from the heart muscle", "A thin-walled extension that empties into the atrium"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "auricle-atrial-appendage", "taskCategory": "anatomy"}$op$,
  $ky$A thin-walled extension that empties into the atrium$ky$,
  $ex$The best choice is "A thin-walled extension that empties into the atrium". Auricles are thin-walled, ear-shaped atrial extensions that fill and empty into the atria. He has one on each upper chamber, and they are not the thick pumping walls. "The thick wall of the systemic ventricle" is not the best choice because The left ventricular wall is thick myocardium, not a thin pouch on the atrium. "The fibrous sac that anchors the heart in the chest" is not the best choice because The fibrous pericardium is the anchoring sac around the whole heart. "The cord left where a fetal artery used to run" is not the best choice because The ligamentum arteriosum is the remnant of the ductus arteriosus on the great arteries. "The vein that returns blood from the heart muscle" is not the best choice because The coronary sinus is a vein opening into the right atrium, not a pouch on both atria.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'd24993b96fd88ea958f6be19c65ee61922134bbaf2c64bcaa1fc7f23d0243984', false, NOW(), NOW(), 2,
  'auricle-atrial-appendage', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'auricle-atrial-appendage', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-165", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "E", "verifiedFact": "An auricle is a thin-walled, ear-shaped extension of each atrium that can fill and empty into that atrium."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280166', 'usmle-step-1', 'physiology',
  $sc$A 44-year-old woman who edits film has atrial contraction timed at about a tenth of a second. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. It ends before the ventricles contract and adds the last fraction of ventricular filling. Most of the filling has already occurred.$sc$,
  $qu$Which of the following is that brief atrial contraction?$qu$,
  $op${"options": ["The brief topping-up that finishes ventricular volume", "The constant-volume phase while all valves are shut", "The ejection of 70 to 80 mL into the great arteries", "The closure of the aortic and pulmonary valves", "The long unresponsive phase of a ventricular cell"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "atrial-systole-duration", "taskCategory": "mechanism"}$op$,
  $ky$The brief topping-up that finishes ventricular volume$ky$,
  $ex$The best choice is "The brief topping-up that finishes ventricular volume". Atrial systole lasts about 100 ms, ends before ventricular systole, and supplies the remaining 20 to 30 percent of filling. Her atrial contraction is that short topping-up, after most filling has already happened. "The constant-volume phase while all valves are shut" is not the best choice because Constant volume with all valves shut is isovolumic contraction, which is ventricular, not this atrial topping-up. "The ejection of 70 to 80 mL into the great arteries" is not the best choice because Ejection of 70 to 80 mL is ventricular stroke volume. "The closure of the aortic and pulmonary valves" is not the best choice because Aortic and pulmonary closure is S2, at the start of ventricular relaxation. "The long unresponsive phase of a ventricular cell" is not the best choice because The long unresponsive phase is the ventricular refractory period, not atrial contraction.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f0d4038cfb151c95163354c1123055d118415f54bfee293ab84a28e3de886304', false, NOW(), NOW(), 2,
  'atrial-systole-duration', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'atrial-systole-duration', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-166", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "A", "verifiedFact": "Atrial systole lasts about 100 ms and ends before ventricular systole. It contributes the last 20 to 30 percent of ventricular filling."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280167', 'usmle-step-1', 'anatomy',
  $sc$A 61-year-old man who repairs docks has the outer sac of the heart opened. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. The outer layer of the sac is tough connective tissue. It holds the heart in position. A more delicate layer inside it faces the fluid space.$sc$,
  $qu$Which of the following is that tough outer layer?$qu$,
  $op${"options": ["The muscle layer that ejects the stroke volume", "The layer that protects the heart and holds its position", "The flat-cell lining continuous with the aorta", "The thin pouch on the outside of each atrium", "The fluid that reduces rubbing during each beat"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "fibrous-pericardium-anchors", "taskCategory": "anatomy"}$op$,
  $ky$The layer that protects the heart and holds its position$ky$,
  $ex$The best choice is "The layer that protects the heart and holds its position". The fibrous pericardium is tough dense connective tissue. It protects the heart and maintains its position. His outer sac layer is that tough tissue, with a more delicate layer facing the fluid space. "The muscle layer that ejects the stroke volume" is not the best choice because The myocardium is the muscle of the wall, not the outer sac. "The flat-cell lining continuous with the aorta" is not the best choice because The endocardium is the endothelial lining of the chambers. "The thin pouch on the outside of each atrium" is not the best choice because The auricle is the atrial appendage, not the sac. "The fluid that reduces rubbing during each beat" is not the best choice because The serous fluid is what the space contains. It is not the tough outer layer.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '0ce6c45eb6ec8f2eb10db918350095c87e60fe76217e6ae90cb61915ecd15207', false, NOW(), NOW(), 2,
  'fibrous-pericardium-anchors', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'fibrous-pericardium-anchors', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-167", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "B", "verifiedFact": "The fibrous pericardium is tough dense connective tissue that protects the heart and holds it in place in the thorax."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280168', 'usmle-step-1', 'anatomy',
  $sc$A 27-year-old man who teaches drums has the heart sitting in the middle of the chest, between the lungs, in its own sac. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The back of the heart is near the vertebral bodies. The front is deep to the breastbone.$sc$,
  $qu$Which of the following is this middle-chest location between the lungs?$qu$,
  $op${"options": ["The pleural space, with pressure 4 mm Hg below the alveoli", "The peritoneal cavity that lies behind the stomach", "The central compartment, with the heart in its own sac", "The cranial cavity, beside the respiratory neurons", "The retroperitoneal space, beside the pancreas"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "heart-in-mediastinum", "taskCategory": "anatomy"}$op$,
  $ky$The central compartment, with the heart in its own sac$ky$,
  $ex$The best choice is "The central compartment, with the heart in its own sac". The heart lies in the mediastinum, medial between the lungs, inside the pericardium. The dorsal surface is near the vertebrae and the anterior surface is deep to the sternum. His description matches. "The pleural space, with pressure 4 mm Hg below the alveoli" is not the best choice because The pleural cavity is around the lungs, not the compartment that contains the heart in its sac. "The peritoneal cavity that lies behind the stomach" is not the best choice because The pancreas lies in the retroperitoneum behind the stomach. That is not the chest. "The cranial cavity, beside the respiratory neurons" is not the best choice because Respiratory neurons are in the medulla, not the compartment between the lungs. "The retroperitoneal space, beside the pancreas" is not the best choice because The pancreas is retroperitoneal. The heart is in the chest.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'e4b2d0423fbe411b1231b251c831c1ee86657a94f168adb7e87f8bc6ce49b63c', false, NOW(), NOW(), 2,
  'heart-in-mediastinum', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'heart-in-mediastinum', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-168", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "C", "verifiedFact": "The heart lies in the mediastinum, between the lungs. The pericardium separates it from other mediastinal structures. The base is posterior toward the vertebrae. The anterior surface is deep to the sternum."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280169', 'usmle-step-1', 'pathology',
  $sc$A 25-year-old woman who runs road races has a soft murmur and an echocardiogram. Temperature is 36.6°C, pulse is 62/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The flap that should have sealed the opening between the atria after birth did not fuse. She has no cyanosis and no exercise limit. The opening is small.$sc$,
  $qu$Which of the following is the usual next recognition of this small opening?$qu$,
  $op${"options": ["It always requires immediate surgery in an asymptomatic adult", "It is the vessel that still joins the aorta to the pulmonary trunk", "It is a narrow aorta at the site of a fetal arterial cord", "It was heard as a murmur and confirmed by ultrasound of the heart", "It is an extra sound just before the first heart sound"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "patent-foramen-not-closed", "taskCategory": "mechanism"}$op$,
  $ky$It was heard as a murmur and confirmed by ultrasound of the heart$ky$,
  $ex$The best choice is "It was heard as a murmur and confirmed by ultrasound of the heart". Patent foramen ovale is failure of the septum primum to close the foramen ovale. It is often silent. It is typically detected as a murmur and confirmed by echocardiography. She is unlimited, not cyanotic, and the opening is small, so monitoring rather than immediate surgery fits the benign form. "It always requires immediate surgery in an asymptomatic adult" is not the best choice because The source says that in non-life-threatening cases it is better to monitor than to operate. Immediate surgery is not the usual step for a small silent opening. "It is the vessel that still joins the aorta to the pulmonary trunk" is not the best choice because A vessel between the aorta and the pulmonary trunk is a patent ductus arteriosus. "It is a narrow aorta at the site of a fetal arterial cord" is not the best choice because A narrow aorta at the ligamentum arteriosum is coarctation. "It is an extra sound just before the first heart sound" is not the best choice because A sound just before S1 is S4, from atrial contraction into a stiff ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "pathology"]$tg$,
  's1-new-20261128-hidden', '11c11626150e54218cf921b5e710c3601c79829fbea6b6f1875aead8fad18113', false, NOW(), NOW(), 3,
  'patent-foramen-not-closed', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'patent-foramen-not-closed', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-169", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "D", "verifiedFact": "Patent foramen ovale occurs when the septum primum does not close the foramen ovale after birth. It may be silent. It is usually found by a murmur and confirmed by echocardiography."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280170', 'usmle-step-1', 'physiology',
  $sc$A 58-year-old man who walks a mail route has occasional palpitations that never appear in the office. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 132/80 mm Hg. He is given a small battery-powered recorder to wear through a full day and night of his usual route.$sc$,
  $qu$Which of the following is this recorder for?$qu$,
  $op${"options": ["A single 10-second office tracing and nothing more", "Blood pressure only, with no electrical recording", "The lung volumes measured during one forced exhalation", "The oxygen saturation of hemoglobin in fetal blood", "Heart electrical activity through a full day of ordinary activity"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "holter-twenty-four-hours", "taskCategory": "mechanism"}$op$,
  $ky$Heart electrical activity through a full day of ordinary activity$ky$,
  $ex$The best choice is "Heart electrical activity through a full day of ordinary activity". A Holter monitor records cardiac electrical activity continuously, typically for 24 hours, during ordinary activity. His palpitations are absent in the office, so a full day on his route is the matching test. "A single 10-second office tracing and nothing more" is not the best choice because A standard office ECG is a short tracing. It has already missed his symptoms. "Blood pressure only, with no electrical recording" is not the best choice because The recorder is for electrical activity, not blood pressure alone. "The lung volumes measured during one forced exhalation" is not the best choice because Lung volumes are spirometry, not a wearable heart-rhythm recorder. "The oxygen saturation of hemoglobin in fetal blood" is not the best choice because Fetal hemoglobin affinity is a laboratory property, not this wearable recording.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ea016fe745acd1f42383e958019617933da5531c0d4411eda4cb6fdb2c1ee380', false, NOW(), NOW(), 2,
  'holter-twenty-four-hours', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'holter-twenty-four-hours', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-170", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "E", "verifiedFact": "A Holter monitor is a portable recorder of the heart's electrical activity, typically worn for 24 hours during ordinary activity."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280171', 'usmle-step-1', 'anatomy',
  $sc$A 63-year-old woman who teaches piano has fat-filled grooves on the heart surface. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. One deep groove circles between the upper and lower chambers. Another runs down the front between the two lower chambers. The main arteries to the heart muscle travel in these grooves.$sc$,
  $qu$Which of the following travels in these grooves?$qu$,
  $op${"options": ["The vessels that nourish the myocardium", "The four veins that return blood from the lungs", "The pacemaker cells with the fastest inherent rate", "The fibrous sac that anchors the heart", "The flap that seals the opening between the atria"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "coronary-vessels-in-sulci", "taskCategory": "anatomy"}$op$,
  $ky$The vessels that nourish the myocardium$ky$,
  $ex$The best choice is "The vessels that nourish the myocardium". Major coronary vessels lie in the fat-filled sulci. The deep coronary sulcus is between atria and ventricles, and the anterior interventricular sulcus is on the front between the ventricles. Her grooves match, and the heart-muscle arteries run there. "The four veins that return blood from the lungs" is not the best choice because The four pulmonary veins enter the left atrium. They are not the vessels in the surface grooves between the chambers. "The pacemaker cells with the fastest inherent rate" is not the best choice because The SA node is in the superior posterior right atrium, not a vessel in a surface groove. "The fibrous sac that anchors the heart" is not the best choice because The fibrous pericardium is the outer sac. "The flap that seals the opening between the atria" is not the best choice because The septum primum is the flap of the foramen ovale, inside the atrial septum.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '563c64374b978bc098cdffae2bae06ca15f341e2ae922f3334ed7762819aafa2', false, NOW(), NOW(), 2,
  'coronary-vessels-in-sulci', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'coronary-vessels-in-sulci', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-171", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "A", "verifiedFact": "Major coronary vessels lie in fat-filled grooves, the sulci. The coronary sulcus is between the atria and ventricles. The anterior interventricular sulcus is on the front between the ventricles."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280172', 'usmle-step-1', 'physiology',
  $sc$A 41-year-old man who studies vessels has peptides released by the lining of the heart chambers and by the capillaries inside the heart muscle. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The peptides strongly narrow arterioles. In health they are balanced by peptides that widen arterioles.$sc$,
  $qu$Which of the following cells release these narrowing peptides?$qu$,
  $op${"options": ["The contractile muscle cells that form most of the wall", "The endothelial cells of the inner surface and the small vessels", "The scarce cells that start the electrical impulse", "The mesothelial cells that secrete the fluid around the heart", "The type II cells that lower alveolar surface tension"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "endothelin-vasoconstrictor", "taskCategory": "mechanism"}$op$,
  $ky$The endothelial cells of the inner surface and the small vessels$ky$,
  $ex$The best choice is "The endothelial cells of the inner surface and the small vessels". Endothelium of the endocardium and of the coronary capillaries releases endothelins, potent vasoconstrictors that normally balance dilators. His peptides come from the chamber lining and the heart-muscle capillaries and narrow arterioles. "The contractile muscle cells that form most of the wall" is not the best choice because Contractile myocardial cells pump blood. They are not the lining source of these peptides. "The scarce cells that start the electrical impulse" is not the best choice because Conducting cells start the impulse. They are not the endothelial source. "The mesothelial cells that secrete the fluid around the heart" is not the best choice because Epicardial mesothelium secretes pericardial fluid, not these vasoconstrictor peptides. "The type II cells that lower alveolar surface tension" is not the best choice because Type II alveolar cells secrete surfactant in the lung.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f31b379a6806733505f2c919470a6a5ae064da1fe9e15c7ec1c51a3d81822eaa', false, NOW(), NOW(), 3,
  'endothelin-vasoconstrictor', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'endothelin-vasoconstrictor', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-172", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "B", "verifiedFact": "Endothelial cells of the endocardium and coronary capillaries release endothelins, which are potent vasoconstrictors and normally balance other constrictors and dilators."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280173', 'usmle-step-1', 'physiology',
  $sc$A 56-year-old woman who catalogs maps has six stickers on the chest and one sticker on each limb. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. The machine records twelve voltage differences. Each recorded difference is between two stickers, not a picture of one sticker alone.$sc$,
  $qu$Which of the following is one recorded voltage difference?$qu$,
  $op${"options": ["The pressure generated inside the left ventricle", "The oxygen saturation of arterial hemoglobin", "The potential measured across a pair of skin contacts", "The volume moved by one quiet breath at rest", "The sound of the atrioventricular valves closing"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "twelve-lead-ten-electrodes", "taskCategory": "mechanism"}$op$,
  $ky$The potential measured across a pair of skin contacts$ky$,
  $ex$The best choice is "The potential measured across a pair of skin contacts". A lead is the voltage difference between two electrodes. A 12-lead recording uses 10 electrodes, six on the chest and four on the limbs, and produces twelve such differences. Her sticker count and twelve recordings match. "The pressure generated inside the left ventricle" is not the best choice because Left ventricular pressure is a catheter measurement, not a voltage between skin electrodes. "The oxygen saturation of arterial hemoglobin" is not the best choice because Oxygen saturation is oximetry, not an electrocardiographic lead. "The volume moved by one quiet breath at rest" is not the best choice because A quiet breath is tidal volume, about 500 mL. "The sound of the atrioventricular valves closing" is not the best choice because AV valve closure is the first heart sound.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '47d1646bc2dd3b5b7411288ae52a5d65cc5808865124e20037c629d016e09ec9', false, NOW(), NOW(), 2,
  'twelve-lead-ten-electrodes', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'twelve-lead-ten-electrodes', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-173", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "C", "verifiedFact": "A 12-lead electrocardiograph uses 10 electrodes: six on the chest and four on the limbs. A lead is the voltage between two electrodes."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280174', 'usmle-step-1', 'physiology',
  $sc$A 35-year-old man who rows has ventricular contraction timed from the large electrical deflection until relaxation begins. Temperature is 36.5°C, pulse is 58/min, respirations are 12/min, and blood pressure is 118/70 mm Hg. That contraction interval is shorter than the relaxation that follows it. Relaxation starts as the recovery wave begins.$sc$,
  $qu$Which of the following is the longer interval?$qu$,
  $op${"options": ["Ventricular contraction, beginning after the large deflection", "Atrial contraction, the brief topping-up of the ventricles", "The brief pause inside the lower atrial node", "The T-deflection interval, which outlasts contraction", "The spread from the apex through the ventricular muscle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "ventricular-systole-duration", "taskCategory": "mechanism"}$op$,
  $ky$The T-deflection interval, which outlasts contraction$ky$,
  $ex$The best choice is "The T-deflection interval, which outlasts contraction". Ventricular diastole lasts about 430 ms and starts with the T wave. Ventricular systole lasts about 270 ms and follows the QRS. Relaxation is the longer interval, and it begins with the recovery wave, as in his tracing. "Ventricular contraction, beginning after the large deflection" is not the best choice because Ventricular contraction is the shorter of the two, about 270 ms. "Atrial contraction, the brief topping-up of the ventricles" is not the best choice because Atrial systole is about 100 ms, a brief topping-up, not the long relaxation. "The brief pause inside the lower atrial node" is not the best choice because The AV-node pause is about 100 ms. "The spread from the apex through the ventricular muscle" is not the best choice because Spread through ventricular muscle after the bundle branches is about 75 ms.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'd02aa0f7ad6dd45ed230c089eb1c0b478f7693d1673c50311cc99cd8ff0fd1ad', false, NOW(), NOW(), 3,
  'ventricular-systole-duration', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'ventricular-systole-duration', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-174", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "D", "verifiedFact": "Ventricular systole lasts about 270 ms and follows the QRS. Ventricular diastole lasts about 430 ms and begins with the T wave."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280175', 'usmle-step-1', 'physiology',
  $sc$A 20-year-old woman who plays flute has a murmur at the apex that gets louder when she breathes out and softer when she breathes in. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. A different murmur at the upper left sternal edge does the opposite.$sc$,
  $qu$Which of the following side is suggested by the murmur that grows as she breathes out?$qu$,
  $op${"options": ["The right-sided chambers of the heart", "Only the vein that drains the heart muscle", "Only the thin pouches on the two atria", "The pericardial sac, outside the chambers", "The left-sided chambers of the heart"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "expiration-left-murmur", "taskCategory": "mechanism"}$op$,
  $ky$The left-sided chambers of the heart$ky$,
  $ex$The best choice is "The left-sided chambers of the heart". Expiration can make left-sided murmurs louder. Her apical murmur grows when she breathes out, so it is the left-sided one. The upper-sternal murmur that does the opposite fits the right side, which inspiration can amplify. "The right-sided chambers of the heart" is not the best choice because Right-sided murmurs get louder on inspiration, which is the other murmur, not the apical one. "Only the vein that drains the heart muscle" is not the best choice because The coronary sinus is a vein. It is not localized by this breathing maneuver. "Only the thin pouches on the two atria" is not the best choice because Auricles are atrial appendages. The maneuver separates right-sided from left-sided murmurs. "The pericardial sac, outside the chambers" is not the best choice because Pericardial rub is not the breathing pattern that separates right-heart from left-heart murmurs.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '31838f30e5d58b5dc95a00647fcfd5a8d91fb349ec119a0183910b8933bb2635', false, NOW(), NOW(), 3,
  'expiration-left-murmur', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'expiration-left-murmur', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-175", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "E", "verifiedFact": "Expiration can amplify left-sided murmurs. Inspiration increases right-heart flow and can amplify right-sided murmurs."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280176', 'usmle-step-1', 'physiology',
  $sc$A 23-year-old man who sits to study takes a normal breath at rest. Temperature is 36.6°C, pulse is 64/min, respirations are 12/min, and blood pressure is 112/68 mm Hg. One muscle descends toward the abdomen. Muscles between the ribs lift the cage up and out. He is not using his neck muscles.$sc$,
  $qu$Which of the following muscles are doing this quiet breath in?$qu$,
  $op${"options": ["The diaphragm and the outer muscles between the ribs", "The abdominal wall and the inner muscles between the ribs", "Only the neck muscles that lift the upper ribs", "Smooth muscle lying inside each individual alveolus", "The thick muscle layer of the ventricles"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "quiet-inspiration-muscles", "taskCategory": "mechanism"}$op$,
  $ky$The diaphragm and the outer muscles between the ribs$ky$,
  $ex$The best choice is "The diaphragm and the outer muscles between the ribs". Quiet inspiration uses the diaphragm, which moves inferiorly, and the external intercostals, which raise the ribs. He is at rest, the diaphragm descends, the ribs rise, and the neck muscles are not in use. "The abdominal wall and the inner muscles between the ribs" is not the best choice because Abdominal muscles and internal intercostals are for forced expiration. "Only the neck muscles that lift the upper ribs" is not the best choice because Scalenes are accessory muscles for forced inspiration. He is not using the neck. "Smooth muscle lying inside each individual alveolus" is not the best choice because Alveoli have no muscle that expands them. The chest wall does that. "The thick muscle layer of the ventricles" is not the best choice because The heart muscle does not enlarge the thorax for a quiet breath.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '6701c1abfb729ea368e6548a3005a69761611b0d88bbbcc40e9d8a5429355c45', false, NOW(), NOW(), 2,
  'quiet-inspiration-muscles', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'quiet-inspiration-muscles', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-176", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "A", "verifiedFact": "Quiet inspiration uses the diaphragm, which moves down, and the external intercostals, which lift the ribs up and out."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280177', 'usmle-step-1', 'physiology',
  $sc$A 30-year-old woman who teaches violin has the chest wall move outward. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The lung follows the wall even though the lung itself has no role in creating that movement. A thin fluid layer sticks the lung surface to the wall.$sc$,
  $qu$Which of the following makes the lung follow the wall?$qu$,
  $op${"options": ["Muscle inside the lung contracting with the diaphragm", "The fluid layer sticking the lung surface to the chest wall", "Surfactant increasing surface tension on purpose", "Carbon dioxide pumped into the alveoli by ATP", "The aortic valve opening during inspiration"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "lungs-are-passive", "taskCategory": "mechanism"}$op$,
  $ky$The fluid layer sticking the lung surface to the chest wall$ky$,
  $ex$The best choice is "The fluid layer sticking the lung surface to the chest wall". The lungs are passive. Pleural fluid adheres the lung to the thoracic wall, so outward wall movement pulls the lung open and recoil compresses it. Her lung follows the wall without making the movement itself. "Muscle inside the lung contracting with the diaphragm" is not the best choice because There is no breathing muscle inside the lung. The diaphragm and intercostals move the wall. "Surfactant increasing surface tension on purpose" is not the best choice because Surfactant lowers surface tension so alveoli do not collapse. It does not stick the lung to the chest wall. "Carbon dioxide pumped into the alveoli by ATP" is not the best choice because Airflow follows pressure. ATP does not pump carbon dioxide in as the wall moves. "The aortic valve opening during inspiration" is not the best choice because The aortic valve is a cardiac valve. It does not couple the lung to the chest wall.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '33b227fb902b383ff89a73476fc8e917d1d170741bc4e910998a3305cd7cc4da', false, NOW(), NOW(), 2,
  'lungs-are-passive', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'lungs-are-passive', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-177", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "B", "verifiedFact": "The lungs are passive during breathing. Pleural fluid sticks the lung to the chest wall, so the lung is pulled open when the wall moves out and is compressed when the wall recoils."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280178', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old man who sprints the last 100 meters lifts his upper chest with the muscles of his neck. Temperature is 37.2°C, pulse is 160/min, respirations are 32/min, and blood pressure is 148/70 mm Hg. The extra lift enlarges the thorax beyond a quiet breath. He is breathing in, not pushing air out.$sc$,
  $qu$Which of the following is the role of those neck muscles?$qu$,
  $op${"options": ["They compress the ribs to force air out", "They are the only muscles used in quiet breathing", "They lift the chest wall for a deeper breath in", "They secrete the film that keeps alveoli open", "They set the heart rate at 80 to 100 beats per minute"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "scalenes-forced-inspiration", "taskCategory": "mechanism"}$op$,
  $ky$They lift the chest wall for a deeper breath in$ky$,
  $ex$The best choice is "They lift the chest wall for a deeper breath in". During forced inspiration the scalenes and other neck muscles lift the thoracic wall and increase lung volume. He is sprinting and breathing in, with the neck lifting the upper chest. "They compress the ribs to force air out" is not the best choice because Compressing the ribs to force air out is the internal intercostals and abdominal muscles during forced expiration. "They are the only muscles used in quiet breathing" is not the best choice because Quiet inspiration uses the diaphragm and external intercostals, not the neck. "They secrete the film that keeps alveoli open" is not the best choice because Type II alveolar cells secrete surfactant. "They set the heart rate at 80 to 100 beats per minute" is not the best choice because The SA node, not neck muscles, has an intrinsic rate near 80 to 100.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'c95bce0209d68a722f568bb7cc360fb19f0ccc2652291440bea6f8345713b43f', false, NOW(), NOW(), 2,
  'scalenes-forced-inspiration', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'scalenes-forced-inspiration', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-178", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "C", "verifiedFact": "Forced inspiration uses neck muscles, including the scalenes, which lift the chest wall and increase lung volume."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280179', 'usmle-step-1', 'physiology',
  $sc$A 28-year-old man who plays trumpet moves as much air as he can, from a full breath in to a full breath out. Temperature is 36.6°C, pulse is 68/min, respirations are 12/min, and blood pressure is 118/72 mm Hg. The volume he moves is the quiet breath plus the extra he can inhale plus the extra he can exhale. Air that can never be exhaled is not included. The moved volume is 4.6 L.$sc$,
  $qu$Which of the following volumes are included?$qu$,
  $op${"options": ["Only the air that remains after a maximal exhalation", "The quiet breath plus the air that can never leave", "Every volume the lung can hold, including trapped air", "The quiet breath and both extra volumes he can still move", "Only the half-liter moved by one quiet breath"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "vital-capacity-excludes-residual", "taskCategory": "mechanism"}$op$,
  $ky$The quiet breath and both extra volumes he can still move$ky$,
  $ex$The best choice is "The quiet breath and both extra volumes he can still move". Vital capacity is tidal volume plus inspiratory reserve plus expiratory reserve, and it excludes residual volume. His 4.6 L is inside the stated 4000 to 5000 mL range, and he left out the air that can never be exhaled. "Only the air that remains after a maximal exhalation" is not the best choice because Air remaining after a maximal exhalation is residual volume, which is excluded. "The quiet breath plus the air that can never leave" is not the best choice because Adding residual volume to the quiet breath is not vital capacity. "Every volume the lung can hold, including trapped air" is not the best choice because The sum of all volumes, including residual volume, is total lung capacity. "Only the half-liter moved by one quiet breath" is not the best choice because About 500 mL is tidal volume alone, far below the 4.6 L he moved.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a8384525a57796b858f41d693f96b4f62326b7f3d4c177ecca3429e4b0ce59a9', false, NOW(), NOW(), 3,
  'vital-capacity-excludes-residual', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'vital-capacity-excludes-residual', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-179", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "D", "verifiedFact": "Vital capacity is tidal volume plus inspiratory reserve plus expiratory reserve. It excludes residual volume. It is about 4000 to 5000 mL."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280180', 'usmle-step-1', 'physiology',
  $sc$A 46-year-old man who teaches anatomy has sensors that sample blood going to the head and blood just as it leaves the left ventricle into the great artery. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Those sensors report to the brainstem. A different set of sensors sits inside the brain itself.$sc$,
  $qu$Which of the following sensors are outside the brain in this description?$qu$,
  $op${"options": ["Sensors that sit inside the brain and the brainstem", "Type II alveolar cells on the lining of the alveoli", "The pacemaker cells beside the superior vena cava", "The stretch receptors only, with no chemical role", "Sensors on the arteries to the head and the great artery"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "peripheral-chemoreceptor-site", "taskCategory": "anatomy"}$op$,
  $ky$Sensors on the arteries to the head and the great artery$ky$,
  $ex$The best choice is "Sensors on the arteries to the head and the great artery". Peripheral chemoreceptors are in the carotid arteries and the aortic arch, outside the brain. Central chemoreceptors are in the brain and brainstem. His outside sensors sample blood to the head and blood leaving into the great artery. "Sensors that sit inside the brain and the brainstem" is not the best choice because Sensors inside the brain are the central chemoreceptors, which he distinguished from the outside set. "Type II alveolar cells on the lining of the alveoli" is not the best choice because Type II cells secrete surfactant. They are not the arterial chemical sensors. "The pacemaker cells beside the superior vena cava" is not the best choice because The SA node is the cardiac pacemaker, not a chemoreceptor. "The stretch receptors only, with no chemical role" is not the best choice because Lung stretch receptors inform the dorsal respiratory group, but the sensors he located are on arteries.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "anatomy", "physiology"]$tg$,
  's1-new-20261128-hidden', '25ee3a9a7da41b05dede723cce48f3d6f846af1c81d9dc35d70f06c845246eef', false, NOW(), NOW(), 2,
  'peripheral-chemoreceptor-site', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'peripheral-chemoreceptor-site', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-180", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "E", "verifiedFact": "Peripheral chemoreceptors are in the carotid arteries and the aortic arch. Central chemoreceptors are in the brain and brainstem."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280181', 'usmle-step-1', 'physiology',
  $sc$A 40-year-old man who is postoperative is hard to arouse. Temperature is 36.4°C, pulse is 62/min, respirations are 6/min, and blood pressure is 100/60 mm Hg. He received a drug known to blunt the brainstem centers that drive the diaphragm. His chest still moves when he does breathe, and the airway is open.$sc$,
  $qu$Which of the following is the drug effect on breathing?$qu$,
  $op${"options": ["The brainstem centers fire less often, so the rate falls", "The tongue blocks the airway while the centers fire normally", "Type II cells stop making the anti-collapse film", "Hemoglobin holds carbon monoxide instead of oxygen", "The pleural space pressure rises above alveolar pressure"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "morphine-slows-breathing", "taskCategory": "mechanism"}$op$,
  $ky$The brainstem centers fire less often, so the rate falls$ky$,
  $ex$The best choice is "The brainstem centers fire less often, so the rate falls". Morphine can depress the respiratory centers and slow the rate. He is hard to arouse, the rate is 6/min, the chest still moves when he breathes, and the airway is open, so the failure is the drive, not obstruction. "The tongue blocks the airway while the centers fire normally" is not the best choice because An open airway and absent effort point away from a tongue-blocked airway with a normal drive. "Type II cells stop making the anti-collapse film" is not the best choice because Surfactant loss collapses alveoli. It is not this drug effect on the brainstem. "Hemoglobin holds carbon monoxide instead of oxygen" is not the best choice because Carbon monoxide occupies heme. It is not the drug that blunted his respiratory centers. "The pleural space pressure rises above alveolar pressure" is not the best choice because Intrapleural pressure normally stays below alveolar pressure. That is not the drug effect described.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '81f9b1c472d4a6a2d438837925cfc1ca86c693472c49beed04f744a1e991ee6c', false, NOW(), NOW(), 3,
  'morphine-slows-breathing', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'morphine-slows-breathing', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-181", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "A", "verifiedFact": "Morphine can depress the respiratory centers and decrease the respiratory rate."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280182', 'usmle-step-1', 'physiology',
  $sc$A 24-year-old woman who rows has one muscle much warmer than a resting muscle. Temperature of that muscle is 38.5°C, pulse is 150/min, respirations are 30/min, and blood pressure is 146/68 mm Hg. At the same oxygen pressure and the same pH, oxygen leaves hemoglobin faster in the warmer muscle.$sc$,
  $qu$Which of the following does the extra warmth do?$qu$,
  $op${"options": ["It makes oxygen bind hemoglobin more tightly", "It makes oxygen leave hemoglobin more readily", "It is the Bohr effect, which is a pH change", "It raises hemoglobin's affinity the way fetal blood does", "It converts carbon dioxide into nitrogen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "warmth-unloads-oxygen", "taskCategory": "mechanism"}$op$,
  $ky$It makes oxygen leave hemoglobin more readily$ky$,
  $ex$The best choice is "It makes oxygen leave hemoglobin more readily". A higher temperature promotes dissociation of oxygen from hemoglobin. Her warmer muscle unloads oxygen faster at the same oxygen pressure and the same pH, so the effect is heat, not acidity. "It makes oxygen bind hemoglobin more tightly" is not the best choice because A lower temperature inhibits dissociation, which would hold oxygen on hemoglobin. "It is the Bohr effect, which is a pH change" is not the best choice because The Bohr effect is the pH effect. pH was the same in the comparison. "It raises hemoglobin's affinity the way fetal blood does" is not the best choice because Fetal hemoglobin has a higher affinity and holds oxygen more tightly. Warmth does the opposite. "It converts carbon dioxide into nitrogen" is not the best choice because Nothing in the transport pathway converts carbon dioxide into nitrogen.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '5985624e92d3b7f26b7119e7bf1bfd787db8ece5f1f86c41787369e16bfd8ed4', false, NOW(), NOW(), 3,
  'warmth-unloads-oxygen', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'warmth-unloads-oxygen', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-182", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "B", "verifiedFact": "A higher temperature promotes oxygen dissociation from hemoglobin. A lower temperature inhibits it. Active tissues release more heat."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280183', 'usmle-step-1', 'physiology',
  $sc$A 39-year-old man who teaches chemistry tracks carbon dioxide inside a red cell. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. About a fifth of the carbon dioxide is attached to the protein portion of hemoglobin. It is not attached to the iron. Oxygen is using the iron sites.$sc$,
  $qu$Which of the following is where this fraction of carbon dioxide attaches?$qu$,
  $op${"options": ["The iron in heme, the same site oxygen uses", "The plasma only, as dissolved gas, for this fifth", "Amino acids of the protein part, not the iron", "The alveolar type II cell, as surfactant", "The chloride channel, in exchange for bicarbonate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "co2-binds-globin-not-iron", "taskCategory": "mechanism"}$op$,
  $ky$Amino acids of the protein part, not the iron$ky$,
  $ex$The best choice is "Amino acids of the protein part, not the iron". About 20 percent of carbon dioxide binds amino acid groups on globin to form carbaminohemoglobin. It does not bind heme iron. Oxygen is on the iron in his red cell, and about a fifth of the carbon dioxide is on the protein part. "The iron in heme, the same site oxygen uses" is not the best choice because The iron site is for oxygen. Carbon dioxide uses globin. "The plasma only, as dissolved gas, for this fifth" is not the best choice because Dissolved carbon dioxide is about 7 to 10 percent, a different fraction from this protein-bound fifth. "The alveolar type II cell, as surfactant" is not the best choice because Surfactant is secreted by type II cells. It is not a carbon dioxide binding site. "The chloride channel, in exchange for bicarbonate" is not the best choice because The chloride shift exchanges chloride for bicarbonate. It is not where this protein-bound fraction attaches.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '50c445e76df31caa98398e94fdd2fce688a1b5e8e8efac451591e7e340ac63cd', false, NOW(), NOW(), 3,
  'co2-binds-globin-not-iron', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'co2-binds-globin-not-iron', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-183", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "C", "verifiedFact": "About 20 percent of carbon dioxide binds amino acids on globin, not the iron of heme, forming carbaminohemoglobin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280184', 'usmle-step-1', 'physiology',
  $sc$A 22-year-old woman who swims distance has arterial blood drawn. Temperature is 36.5°C, pulse is 56/min, respirations are 12/min, and blood pressure is 106/64 mm Hg. A tiny share of the oxygen is free in the plasma. Nearly all of the oxygen is attached to the iron-containing protein in red cells. Saturation of that protein is 98 percent.$sc$,
  $qu$Which of the following is the tiny share free in plasma?$qu$,
  $op${"options": ["Most of the oxygen, with little left on the protein", "Most of the carbon dioxide, carried in ionic form", "The nitrogen load that appears during an ordinary breath", "A small minority of the oxygen, the rest being protein-bound", "The carbon monoxide that occupies heme after exhaust exposure"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "dissolved-oxygen-small-fraction", "taskCategory": "mechanism"}$op$,
  $ky$A small minority of the oxygen, the rest being protein-bound$ky$,
  $ex$The best choice is "A small minority of the oxygen, the rest being protein-bound". Only about 1.5 percent of oxygen is dissolved. The rest is on hemoglobin. Her plasma fraction is the tiny share, saturation is 98 percent, and the protein in red cells holds nearly all of it. "Most of the oxygen, with little left on the protein" is not the best choice because The protein-bound fraction is the large one, not the plasma fraction. "Most of the carbon dioxide, carried in ionic form" is not the best choice because About 70 percent of carbon dioxide travels as bicarbonate. That is a different gas. "The nitrogen load that appears during an ordinary breath" is not the best choice because Nitrogen dissolves very little at ordinary pressure. It is not this oxygen fraction. "The carbon monoxide that occupies heme after exhaust exposure" is not the best choice because Carbon monoxide is an abnormal occupant of heme, not the normal dissolved share of oxygen.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'a579022d879b4b55750fc5c8990f3ec13936dc006b53fcd73319af6bf58618b5', false, NOW(), NOW(), 2,
  'dissolved-oxygen-small-fraction', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'dissolved-oxygen-small-fraction', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-184", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "D", "verifiedFact": "Only about 1.5 percent of oxygen is dissolved in blood. The rest is carried on hemoglobin."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280185', 'usmle-step-1', 'physiology',
  $sc$A 19-year-old man who studies weather measures room air at sea level. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Nitrogen, oxygen, water, and carbon dioxide each push independently. Added together, those pushes equal 760 mm Hg.$sc$,
  $qu$Which of the following is the rule he is using?$qu$,
  $op${"options": ["Only oxygen pushes, and the other gases do not", "Pressure rises when the volume of a gas rises", "A gas dissolves in proportion to how cold the liquid is", "Oxygen leaves hemoglobin faster when pH rises", "Each gas pushes on its own, and the pushes add to the total"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "dalton-partial-pressures", "taskCategory": "mechanism"}$op$,
  $ky$Each gas pushes on its own, and the pushes add to the total$ky$,
  $ex$The best choice is "Each gas pushes on its own, and the pushes add to the total". Dalton's law says each gas exerts its own partial pressure and the total is the sum. Sea-level atmospheric pressure is 760 mm Hg. His gases add to that total. "Only oxygen pushes, and the other gases do not" is not the best choice because Nitrogen, water, and carbon dioxide also exert partial pressures. Oxygen is not the only gas. "Pressure rises when the volume of a gas rises" is not the best choice because Boyle's law is the inverse of volume and pressure. Pressure does not rise when volume rises. "A gas dissolves in proportion to how cold the liquid is" is not the best choice because Henry's law ties dissolved amount to partial pressure and solubility, not simply to cold. "Oxygen leaves hemoglobin faster when pH rises" is not the best choice because A higher pH inhibits oxygen dissociation. A lower pH promotes it. That is not the adding of gas pressures.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '37342db7a4a81d0f720416b5c7833bc00cc0f40cfe57d2f2c89f7be5a68991d9', false, NOW(), NOW(), 2,
  'dalton-partial-pressures', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'dalton-partial-pressures', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-185", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "E", "verifiedFact": "Dalton's law: each gas in a mixture exerts its own partial pressure, and the total pressure is the sum of the partial pressures. Atmospheric pressure at sea level is 760 mm Hg."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280186', 'usmle-step-1', 'physiology',
  $sc$A 31-year-old woman who bikes to class has alveolar air and incoming lung-capillary blood compared. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Oxygen pressure in the alveoli is much higher than oxygen pressure in the blood just arriving from the right heart. Oxygen moves into that blood.$sc$,
  $qu$Which of the following drives oxygen into the arriving blood?$qu$,
  $op${"options": ["Higher oxygen pressure in the alveoli than in that blood", "Higher oxygen pressure in that blood than in the alveoli", "An ATP-driven pump sitting in the alveolar lining", "Binding of oxygen onto amino acids of the globin", "Constriction of bronchioles by high alveolar oxygen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "alveolar-oxygen-gradient", "taskCategory": "mechanism"}$op$,
  $ky$Higher oxygen pressure in the alveoli than in that blood$ky$,
  $ex$The best choice is "Higher oxygen pressure in the alveoli than in that blood". Alveolar oxygen is about 104 mm Hg and incoming capillary oxygen is about 40 mm Hg, a difference of about 64 mm Hg. Oxygen diffuses from the higher alveolar pressure into the blood. Her comparison shows that direction. "Higher oxygen pressure in that blood than in the alveoli" is not the best choice because If blood oxygen pressure were higher, oxygen would not enter the blood from the alveoli. "An ATP-driven pump sitting in the alveolar lining" is not the best choice because Diffusion across the respiratory membrane does not use ATP. "Binding of oxygen onto amino acids of the globin" is not the best choice because Oxygen binds heme iron, not globin. Globin is the carbon dioxide site. Binding is not what sets the direction across the membrane. "Constriction of bronchioles by high alveolar oxygen" is not the best choice because High alveolar oxygen dilates pulmonary arterioles. It is not a signal that constricts bronchioles.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '484da14a46edc2f9a7d03dd987c9b847631750e0a55efbbecbf2c7303abc4597', false, NOW(), NOW(), 3,
  'alveolar-oxygen-gradient', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'alveolar-oxygen-gradient', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-186", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "A", "verifiedFact": "Alveolar oxygen partial pressure is about 104 mm Hg. Oxygen in the incoming pulmonary capillary blood is about 40 mm Hg. The difference of about 64 mm Hg drives oxygen into the blood."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280187', 'usmle-step-1', 'anatomy',
  $sc$A 16-year-old boy who is learning circulation follows blood that has just left the right ventricle. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The blood is oxygen-poor. It is heading toward the alveolar capillaries. After the exchange, oxygen-rich blood returns to the left atrium.$sc$,
  $qu$Which of the following vessel carries the oxygen-poor blood he is following?$qu$,
  $op${"options": ["The veins that return blood from the lungs to the left atrium", "The artery that runs from the right ventricle toward the lungs", "The aorta after the blood leaves the left ventricle", "The coronary sinus, as it enters the right atrium", "The vessel that should have closed between the great arteries"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "pulmonary-artery-deoxygenated", "taskCategory": "anatomy"}$op$,
  $ky$The artery that runs from the right ventricle toward the lungs$ky$,
  $ex$The best choice is "The artery that runs from the right ventricle toward the lungs". The pulmonary artery carries deoxygenated blood from the right ventricle into the lungs. He is following oxygen-poor blood that just left the right ventricle toward the alveoli. "The veins that return blood from the lungs to the left atrium" is not the best choice because The pulmonary veins carry oxygenated blood back to the left atrium, which is the return trip, not the oxygen-poor trip. "The aorta after the blood leaves the left ventricle" is not the best choice because The aorta carries oxygenated systemic blood from the left ventricle. "The coronary sinus, as it enters the right atrium" is not the best choice because The coronary sinus returns myocardial venous blood to the right atrium. It is not the path from the right ventricle to the alveoli. "The vessel that should have closed between the great arteries" is not the best choice because A patent ductus joins the aorta and the pulmonary trunk. It is not the normal path of oxygen-poor blood out of the right ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', '8565fc80582ae029f64953f30491dda28010a88fe3dbfaf657d8b83239169646', false, NOW(), NOW(), 2,
  'pulmonary-artery-deoxygenated', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'pulmonary-artery-deoxygenated', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-187", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "B", "verifiedFact": "The pulmonary artery carries deoxygenated blood from the heart to the lungs. Pulmonary veins return oxygenated blood to the heart."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280188', 'usmle-step-1', 'physiology',
  $sc$A 25-year-old woman who is healthy has a finger probe reading 98 percent while breathing room air. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. Hemoglobin concentration is normal. The reading is the share of available iron sites that have oxygen.$sc$,
  $qu$Which of the following is a usual reading in this setting?$qu$,
  $op${"options": ["About 70 percent, the share carried as bicarbonate", "About 1.5 percent, the share dissolved in plasma", "Between 95 and 99 percent of iron sites occupied", "About 20 percent, the share of carbon dioxide on globin", "Below 50 percent, because she is at rest"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "hemoglobin-saturation-range", "taskCategory": "mechanism"}$op$,
  $ky$Between 95 and 99 percent of iron sites occupied$ky$,
  $ex$The best choice is "Between 95 and 99 percent of iron sites occupied". Healthy saturation with normal hemoglobin is generally 95 to 99 percent. One hundred percent would mean every heme is occupied. Her 98 percent on room air is inside that range. "About 70 percent, the share carried as bicarbonate" is not the best choice because About 70 percent is the share of carbon dioxide carried as bicarbonate, not oxygen saturation. "About 1.5 percent, the share dissolved in plasma" is not the best choice because About 1.5 percent is the dissolved fraction of oxygen, not the percent of heme sites occupied. "About 20 percent, the share of carbon dioxide on globin" is not the best choice because About 20 percent is carbaminohemoglobin's share of carbon dioxide. "Below 50 percent, because she is at rest" is not the best choice because Resting arterial blood is highly saturated. A value below 50 percent is not the healthy room-air reading.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '17629e537717223f8e5e9ecd22021b0a41e874b01c0ed916ab71290d5b7831c2', false, NOW(), NOW(), 2,
  'hemoglobin-saturation-range', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'hemoglobin-saturation-range', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-188", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "C", "verifiedFact": "In a healthy person with normal hemoglobin, saturation is generally 95 to 99 percent. One hundred percent means every heme is occupied."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280189', 'usmle-step-1', 'physiology',
  $sc$A 27-year-old man who studies blood has two hemoglobin samples from the same draw. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Sample A has every iron site occupied. Sample B has only two of the four iron sites occupied. He is healthy and at rest.$sc$,
  $qu$Which of the following describes sample B?$qu$,
  $op${"options": ["Every iron site on the protein holds oxygen", "Oxygen is bound to globin instead of iron", "It is the dissolved plasma fraction of oxygen", "Only some of the iron sites on the protein hold oxygen", "It is carbon dioxide traveling as bicarbonate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "partial-versus-full-saturation", "taskCategory": "mechanism"}$op$,
  $ky$Only some of the iron sites on the protein hold oxygen$ky$,
  $ex$The best choice is "Only some of the iron sites on the protein hold oxygen". Hemoglobin with one to three of four heme sites occupied is partially saturated. Sample B has two of four iron sites occupied, so only some sites hold oxygen. "Every iron site on the protein holds oxygen" is not the best choice because Every site occupied is the fully saturated state, which is sample A. "Oxygen is bound to globin instead of iron" is not the best choice because Oxygen binds heme iron, not globin. Globin is where carbon dioxide binds. "It is the dissolved plasma fraction of oxygen" is not the best choice because Dissolved oxygen is the roughly 1.5 percent plasma fraction, not a count of iron sites. "It is carbon dioxide traveling as bicarbonate" is not the best choice because Bicarbonate is the main carriage form of carbon dioxide, not a description of iron sites.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f8d02b2d5ae9e1df6c3a2f7c57e7f98cf1caa9ea2b7ec74c85b5493110ab2302', false, NOW(), NOW(), 2,
  'partial-versus-full-saturation', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'partial-versus-full-saturation', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-189", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "D", "verifiedFact": "Hemoglobin is saturated when all four heme sites hold oxygen. It is partially saturated when one to three sites are occupied."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280190', 'usmle-step-1', 'anatomy',
  $sc$A 20-year-old man who studies anatomy compares the two valves between atria and ventricles. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The valve on the side that receives the venae cavae has three cusps. The valve on the side that receives the pulmonary veins has two.$sc$,
  $qu$Which of the following is the two-cusp valve?$qu$,
  $op${"options": ["The valve into the ventricle that ejects to the lungs", "The valve at the entrance of the pulmonary trunk", "The valve guarding the entrance of the aorta", "The flap that seals the opening between the atria", "The valve into the ventricle that ejects to the body"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "av-valve-cusp-count", "taskCategory": "anatomy"}$op$,
  $ky$The valve into the ventricle that ejects to the body$ky$,
  $ex$The best choice is "The valve into the ventricle that ejects to the body". The left AV valve is the mitral, or bicuspid, valve. The left ventricle ejects into the systemic arteries. The side that receives the pulmonary veins is the left side, and that valve has two cusps. "The valve into the ventricle that ejects to the lungs" is not the best choice because The right AV valve, on the side of the venae cavae, is the tricuspid valve, with three cusps. That ventricle ejects toward the lungs. "The valve at the entrance of the pulmonary trunk" is not the best choice because The pulmonary valve is a semilunar valve at the pulmonary trunk, not the two-cusp valve between atrium and ventricle. "The valve guarding the entrance of the aorta" is not the best choice because The aortic valve is the other semilunar valve. "The flap that seals the opening between the atria" is not the best choice because The septum primum is the flap of the foramen ovale, not an atrioventricular valve.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'e6518df4cbbbbddc44ecde6b7e18e63916a35359db27247b985208e2ed1c58be', false, NOW(), NOW(), 2,
  'av-valve-cusp-count', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'av-valve-cusp-count', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-190", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy", "nutrition": false, "keyLetter": "E", "verifiedFact": "The right atrioventricular valve is the tricuspid valve. The left atrioventricular valve is the mitral, or bicuspid, valve."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280191', 'usmle-step-1', 'physiology',
  $sc$A 32-year-old woman who rows has the spread of one impulse timed. Temperature is 36.5°C, pulse is 60/min, respirations are 12/min, and blood pressure is 110/68 mm Hg. The clock starts at the usual atrial pacemaker and stops when the ventricular muscle depolarizes. The elapsed time is a bit under a quarter of a second.$sc$,
  $qu$Which of the following is that elapsed time?$qu$,
  $op${"options": ["About 225 ms from the atrial pacemaker to the ventricles", "About 75 ms, only the spread through ventricular muscle", "About 100 ms, only the pause in the lower atrial node", "About 50 ms, only the trip between the two atrial nodes", "About 430 ms, the length of ventricular relaxation"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "total-conduction-time", "taskCategory": "mechanism"}$op$,
  $ky$About 225 ms from the atrial pacemaker to the ventricles$ky$,
  $ex$The best choice is "About 225 ms from the atrial pacemaker to the ventricles". The total time from the SA-node impulse until ventricular depolarization is about 225 ms. Her clock runs that whole path, a bit under a quarter of a second. "About 75 ms, only the spread through ventricular muscle" is not the best choice because About 75 ms is only the spread from the bundle branches through the ventricular muscle. "About 100 ms, only the pause in the lower atrial node" is not the best choice because About 100 ms is the AV-node delay alone. "About 50 ms, only the trip between the two atrial nodes" is not the best choice because About 50 ms is the trip from the SA node to the AV node. "About 430 ms, the length of ventricular relaxation" is not the best choice because About 430 ms is ventricular diastole, a mechanical interval, not this conduction time.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '3cdf6692f28c719e5b9bedd992286cdf4544dd5f22e4038680ff9f34f36d9a36', false, NOW(), NOW(), 3,
  'total-conduction-time', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'total-conduction-time', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-191", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "A", "verifiedFact": "From the start of the impulse in the SA node until ventricular depolarization is about 225 ms."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280192', 'usmle-step-1', 'anatomy',
  $sc$A 47-year-old man who teaches drafting compares the two divisions of the conduction path in the wall between the ventricles. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The division to the thicker ventricle is considerably larger than the division to the thinner ventricle.$sc$,
  $qu$Which of the following division is the larger one?$qu$,
  $op${"options": ["The division that supplies the thinner lung ventricle", "The division that supplies the thicker systemic ventricle", "The band that reaches only the right papillary muscle", "The band that crosses from the right atrium to the left", "The node with the fastest inherent firing rate"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "left-bundle-larger", "taskCategory": "anatomy"}$op$,
  $ky$The division that supplies the thicker systemic ventricle$ky$,
  $ex$The best choice is "The division that supplies the thicker systemic ventricle". The left bundle branch supplies the left ventricle and is larger because the left ventricle is larger. The thicker ventricle is the systemic one, so the larger division is the one that supplies it. "The division that supplies the thinner lung ventricle" is not the best choice because The right bundle branch supplies the right ventricle and is the smaller division. "The band that reaches only the right papillary muscle" is not the best choice because The moderator band is a right-sided path to the papillary muscle, not the larger of the two bundle divisions. "The band that crosses from the right atrium to the left" is not the best choice because Bachmann's bundle connects the atria. It is not a ventricular bundle branch. "The node with the fastest inherent firing rate" is not the best choice because The SA node is the fastest pacemaker. It is not a bundle branch in the interventricular wall.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "anatomy", "anatomy"]$tg$,
  's1-new-20261128-hidden', 'ff8485bb2564bbc7ecb1d000d48c59624b6acbe91006f9a58598923eecc74e3c', false, NOW(), NOW(), 3,
  'left-bundle-larger', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity"}]$rf$::jsonb,
  'step1', false,
  'anatomy', 'left-bundle-larger', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-192", "hidden": true, "physicianTask": "anatomy", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity", "nutrition": false, "keyLetter": "B", "verifiedFact": "The left bundle branch supplies the left ventricle and is larger than the right bundle branch because the left ventricle is larger. The right bundle branch supplies the right ventricle."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280193', 'usmle-step-1', 'physiology',
  $sc$A 17-year-old woman who runs track has a normal two-sound exam. Temperature is 36.6°C, pulse is 64/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The second sound occurs as the ventricles start to relax and the valves guarding the aorta and the pulmonary trunk shut.$sc$,
  $qu$Which of the following produces the second sound?$qu$,
  $op${"options": ["Closure of the valves between the atria and the ventricles", "Atrial contraction pushing blood into a stiff ventricle", "Shutting of the outflow valves as relaxation starts", "Early filling that can be normal in a young athlete", "Turbulent flow across a valve that is narrowed"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "s2-semilunar-closure", "taskCategory": "mechanism"}$op$,
  $ky$Shutting of the outflow valves as relaxation starts$ky$,
  $ex$The best choice is "Shutting of the outflow valves as relaxation starts". S2 is closure of the semilunar valves at the start of ventricular diastole. Her second sound is at the start of relaxation, when the aortic and pulmonary valves shut. "Closure of the valves between the atria and the ventricles" is not the best choice because AV valve closure is S1, the first sound, at the start of ventricular contraction. "Atrial contraction pushing blood into a stiff ventricle" is not the best choice because Atrial contraction pushing blood into a stiff ventricle is S4, before S1. "Early filling that can be normal in a young athlete" is not the best choice because S3 can be heard in young athletes during early filling. She has only the two normal sounds, and the question is the second of those. "Turbulent flow across a valve that is narrowed" is not the best choice because Turbulent flow is a murmur, not S2.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'ccf018518020fe332aba638db9258466c0e766a43182c68fadcaf3e01787cb7f', false, NOW(), NOW(), 2,
  's2-semilunar-closure', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 's2-semilunar-closure', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-193", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "C", "verifiedFact": "S2 is the second heart sound, produced by closure of the semilunar valves as ventricular diastole begins."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280194', 'usmle-step-1', 'physiology',
  $sc$A 49-year-old man who teaches history is studied just as the atria begin to contract. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. The ventricles are already about three-quarters full. The atrial contraction will add what is still missing.$sc$,
  $qu$Which of the following will the atrial contraction add?$qu$,
  $op${"options": ["The first three-quarters of ventricular filling", "The entire stroke volume of 70 to 80 mL", "The volume that remains after ejection", "The remaining fifth to third of ventricular filling", "Coronary venous blood directly into the left ventricle"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "cardiovascular", "blueprintTopic": "most-filling-before-atrial-kick", "taskCategory": "mechanism"}$op$,
  $ky$The remaining fifth to third of ventricular filling$ky$,
  $ex$The best choice is "The remaining fifth to third of ventricular filling". By the start of atrial systole the ventricles already hold about 70 to 80 percent of their filling. Atrial contraction adds the remaining 20 to 30 percent. His ventricles are about three-quarters full, so the contraction adds the rest. "The first three-quarters of ventricular filling" is not the best choice because The first three-quarters entered passively, before the atria contracted. "The entire stroke volume of 70 to 80 mL" is not the best choice because Stroke volume is what is later ejected, not what atrial contraction adds. "The volume that remains after ejection" is not the best choice because The post-ejection remainder is end-systolic volume. "Coronary venous blood directly into the left ventricle" is not the best choice because The coronary sinus enters the right atrium, not the left ventricle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "cardiovascular", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '7774cdbbe79f85452b2e2f67822511846ea30c853a964674fb79b2fb13af47b4', false, NOW(), NOW(), 2,
  'most-filling-before-atrial-kick', 'cardiovascular', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'most-filling-before-atrial-kick', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-194", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle", "nutrition": false, "keyLetter": "D", "verifiedFact": "At the start of atrial systole the ventricles are already about 70 to 80 percent full. Atrial contraction adds the rest."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280195', 'usmle-step-1', 'physiology',
  $sc$A 26-year-old woman who sings is compared at rest and while holding a long note. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 118/70 mm Hg. At rest only the diaphragm and the outer rib muscles contract, and outflow is recoil. While she sings, neck and abdominal muscles join in, and both the breath in and the breath out are muscular.$sc$,
  $qu$Which of the following is the singing pattern?$qu$,
  $op${"options": ["Only the diaphragm contracts, and outflow is pure recoil", "The lungs themselves contract to push the air out", "Neck muscles are used, but the abdomen stays relaxed", "Breathing stops because carbon dioxide is ignored", "Accessory muscles work while breathing in and breathing out"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "eupnea-versus-hyperpnea", "taskCategory": "mechanism"}$op$,
  $ky$Accessory muscles work while breathing in and breathing out$ky$,
  $ex$The best choice is "Accessory muscles work while breathing in and breathing out". Forced breathing, as in singing, uses accessory muscles so that both inspiration and expiration are active. Her neck and abdominal muscles join, and both phases are muscular. Quiet breathing uses only the diaphragm and external intercostals, with passive outflow. "Only the diaphragm contracts, and outflow is pure recoil" is not the best choice because Diaphragm-only inspiration with passive outflow is the quiet pattern, which she shows at rest, not while singing. "The lungs themselves contract to push the air out" is not the best choice because The lungs are passive. They do not contract to push air out. "Neck muscles are used, but the abdomen stays relaxed" is not the best choice because Forced expiration uses the abdominal muscles. They do not stay relaxed during the sung note. "Breathing stops because carbon dioxide is ignored" is not the best choice because Ignoring carbon dioxide is central apnea. She is singing, not pausing without effort.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '7e223351f910a25878da22e199cfa0231652e3d7a498a307be7557f913252d15', false, NOW(), NOW(), 2,
  'eupnea-versus-hyperpnea', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'eupnea-versus-hyperpnea', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-195", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "E", "verifiedFact": "Eupnea is quiet breathing at rest and uses the diaphragm and external intercostals. Hyperpnea is forced breathing, as in exercise or singing, and uses accessory muscles for both inspiration and expiration."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280196', 'usmle-step-1', 'physiology',
  $sc$A 34-year-old man who teaches yoga takes a deep breath that moves the abdomen outward, then a shallow breath that moves only the ribs. Temperature is 36.6°C, pulse is 64/min, respirations are 10/min, and blood pressure is 114/70 mm Hg. The deep breath uses the muscle that descends toward the abdomen. The shallow breath uses the muscles between the ribs.$sc$,
  $qu$Which of the following muscle does the deep breath use?$qu$,
  $op${"options": ["The muscle that descends and enlarges the vertical chest", "Only the muscles that lie between the ribs", "The abdominal muscles that force air out", "The scalenes, which are required for every quiet breath", "Smooth muscle lying in the alveolar walls"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "diaphragmatic-versus-costal", "taskCategory": "mechanism"}$op$,
  $ky$The muscle that descends and enlarges the vertical chest$ky$,
  $ex$The best choice is "The muscle that descends and enlarges the vertical chest". A deep, diaphragmatic breath is produced by contraction of the diaphragm, which moves inferiorly and enlarges the chest. His deep breath moves the abdomen and uses that descending muscle. The shallow breath is the intercostal one. "Only the muscles that lie between the ribs" is not the best choice because Intercostal contraction is the shallow, costal pattern, not the deep breath. "The abdominal muscles that force air out" is not the best choice because Abdominal muscles are used to force air out, not to take the deep breath in. "The scalenes, which are required for every quiet breath" is not the best choice because Scalenes are for forced inspiration. They are not required for every quiet breath, and the deep breath here is the diaphragm. "Smooth muscle lying in the alveolar walls" is not the best choice because Alveoli do not contain the muscle of a deep breath.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'f38a6b830256cb779d0c042d13cd23e079347f3e5eae0864ef4a9ed8e1f1c8ed', false, NOW(), NOW(), 2,
  'diaphragmatic-versus-costal', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'diaphragmatic-versus-costal', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-196", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing", "nutrition": false, "keyLetter": "A", "verifiedFact": "Diaphragmatic breathing is a deep breath driven by diaphragm contraction. Costal breathing is a shallow breath driven by the intercostal muscles."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280197', 'usmle-step-1', 'physiology',
  $sc$A 29-year-old woman who hikes at altitude has a lower oxygen pressure in arterial blood than she does at sea level. Temperature is 36.6°C, pulse is 92/min, respirations are 18/min, and blood pressure is 118/74 mm Hg. Fewer of the iron sites on her hemoglobin are occupied than on the same day at sea level. pH and temperature are unchanged.$sc$,
  $qu$Which of the following explains the fewer occupied iron sites?$qu$,
  $op${"options": ["A lower oxygen pressure fills every iron site", "A lower oxygen pressure leaves fewer sites occupied", "A lower pH is required for any change in binding", "Fetal hemoglobin has replaced her adult hemoglobin", "Carbon dioxide has taken the iron sites from oxygen"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "low-po2-less-saturation", "taskCategory": "mechanism"}$op$,
  $ky$A lower oxygen pressure leaves fewer sites occupied$ky$,
  $ex$The best choice is "A lower oxygen pressure leaves fewer sites occupied". The dissociation curve shows that a lower partial pressure of oxygen leaves fewer oxygen molecules bound to heme. Her arterial oxygen pressure is lower at altitude, pH and temperature are unchanged, and fewer iron sites are occupied. "A lower oxygen pressure fills every iron site" is not the best choice because Lower oxygen pressure does not fill every site. Higher pressure binds more oxygen. "A lower pH is required for any change in binding" is not the best choice because pH also shifts the curve, but her pH is unchanged. The pressure change is sufficient. "Fetal hemoglobin has replaced her adult hemoglobin" is not the best choice because Adult hemoglobin does not become fetal hemoglobin at altitude. "Carbon dioxide has taken the iron sites from oxygen" is not the best choice because Carbon dioxide binds globin, not the iron sites oxygen uses.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '038d9a3d5c890002670258907d60db2c5d2b287e959fa3d8671a67d19611369e', false, NOW(), NOW(), 2,
  'low-po2-less-saturation', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'low-po2-less-saturation', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-197", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "B", "verifiedFact": "As oxygen partial pressure falls, fewer oxygen molecules stay bound to heme. As it rises, more are bound."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280198', 'usmle-step-1', 'physiology',
  $sc$A 21-year-old man who is sprinting has oxygen pressure inside the working muscle far below the oxygen pressure in the capillaries, which remains near 100 mm Hg. Temperature is 37.6°C, pulse is 170/min, respirations are 36/min, and blood pressure is 150/68 mm Hg. More oxygen leaves hemoglobin here than in a resting fat pad, where tissue oxygen pressure stays higher.$sc$,
  $qu$Which of the following is the result of the large pressure difference?$qu$,
  $op${"options": ["Less oxygen leaves hemoglobin than in the resting fat pad", "Oxygen is pumped in by ATP because the gradient is uphill", "More oxygen leaves hemoglobin and enters the working muscle", "Carbon dioxide binds heme iron in place of oxygen", "The bronchioles constrict because muscle oxygen is low"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "active-muscle-po2", "taskCategory": "mechanism"}$op$,
  $ky$More oxygen leaves hemoglobin and enters the working muscle$ky$,
  $ex$The best choice is "More oxygen leaves hemoglobin and enters the working muscle". Active tissue can drop oxygen pressure to about 20 mm Hg while capillary oxygen stays near 100 mm Hg, a gradient near 80 mm Hg. More oxygen then dissociates and enters the tissue. His working muscle unloads more than resting fat, where tissue oxygen pressure stays higher. "Less oxygen leaves hemoglobin than in the resting fat pad" is not the best choice because The resting fat pad unloads less, because its oxygen pressure stays higher. The working muscle unloads more. "Oxygen is pumped in by ATP because the gradient is uphill" is not the best choice because The gradient is downhill into the muscle. Diffusion does not require ATP. "Carbon dioxide binds heme iron in place of oxygen" is not the best choice because Carbon dioxide binds globin, not heme iron. "The bronchioles constrict because muscle oxygen is low" is not the best choice because Bronchiolar diameter responds to alveolar carbon dioxide, not to oxygen pressure inside a limb muscle.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'de7f980f3a4e53333aae2afeb2f8c793eb5192114a98552559c2001d880a511d', false, NOW(), NOW(), 3,
  'active-muscle-po2', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'active-muscle-po2', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-198", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "C", "verifiedFact": "Highly active tissue can lower its oxygen partial pressure to about 20 mm Hg, while capillary oxygen is about 100 mm Hg, so the gradient is about 80 mm Hg and more oxygen unloads."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280199', 'usmle-step-1', 'physiology',
  $sc$A 18-year-old woman who studies gases compares room air with air sampled from an alveolus. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The alveolar sample contains much more water. The airway has warmed and moistened the incoming breath.$sc$,
  $qu$Which of the following explains the extra water in the alveolar sample?$qu$,
  $op${"options": ["Type II cells secrete water as their only product", "Hemoglobin releases water when it binds oxygen", "The pleural space leaks water into the alveoli", "The airway humidifies air before it reaches the alveoli", "Nitrogen is converted into water at the membrane"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "alveolar-water-vapor", "taskCategory": "mechanism"}$op$,
  $ky$The airway humidifies air before it reaches the alveoli$ky$,
  $ex$The best choice is "The airway humidifies air before it reaches the alveoli". The airway humidifies inspired air, so alveolar air has more water vapor than atmospheric air. Alveolar water pressure is about 47 mm Hg. Her alveolar sample is wetter because the airway moistened the breath. "Type II cells secrete water as their only product" is not the best choice because Type II cells secrete surfactant, which mixes with the water film. They are not the reason inspired air gains water vapor. "Hemoglobin releases water when it binds oxygen" is not the best choice because Hemoglobin binds and releases oxygen. It does not release water as the source of alveolar humidity. "The pleural space leaks water into the alveoli" is not the best choice because Pleural fluid is in the pleural cavity, not the source of alveolar water vapor. "Nitrogen is converted into water at the membrane" is not the best choice because Nitrogen is not converted into water at the respiratory membrane.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', '596226d956fd09778b4ceb735c4a09473f0a51030004ed03b167a91f7d35950c', false, NOW(), NOW(), 3,
  'alveolar-water-vapor', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'alveolar-water-vapor', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-199", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange", "nutrition": false, "keyLetter": "D", "verifiedFact": "Alveolar air has more water vapor than dry atmospheric air because the airway humidifies inspired air. Alveolar water partial pressure is about 47 mm Hg, versus about 3 mm Hg in the atmospheric table."}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's1n202611280200', 'usmle-step-1', 'physiology',
  $sc$A 45-year-old man who teaches chemistry separates three fractions of carbon dioxide in venous blood. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. One fraction is simply dissolved. It is the smallest of the three. The largest fraction is an ion, and the middle fraction is bound to the protein part of hemoglobin.$sc$,
  $qu$Which of the following is the smallest fraction?$qu$,
  $op${"options": ["The share carried as an ion after joining with water", "The share bound to the protein part of hemoglobin", "The share that is bound onto heme iron", "The share that has been converted into nitrogen", "The share that stays dissolved and was never converted"], "kind": "vignette", "stepLevel": "step1", "blueprintSystem": "respiratory-renal", "blueprintTopic": "dissolved-co2-fraction", "taskCategory": "mechanism"}$op$,
  $ky$The share that stays dissolved and was never converted$ky$,
  $ex$The best choice is "The share that stays dissolved and was never converted". About 7 to 10 percent of carbon dioxide is dissolved, the smallest share. About 70 percent is bicarbonate, the ion, and about 20 percent is bound to globin. His ordering matches dissolved, then protein-bound, then the ion as the largest. "The share carried as an ion after joining with water" is not the best choice because The ionic share, bicarbonate, is the largest, about 70 percent. "The share bound to the protein part of hemoglobin" is not the best choice because The globin-bound share is about 20 percent, the middle fraction. "The share that is bound onto heme iron" is not the best choice because Carbon dioxide does not bind heme iron. Oxygen does. "The share that has been converted into nitrogen" is not the best choice because Carbon dioxide is not converted into nitrogen in transport.$ex$,
  $tg$["usmle-s1-new-20261128", "hidden", "step1", "respiratory-renal", "mechanism", "physiology"]$tg$,
  's1-new-20261128-hidden', 'bbd3266c9b75a7041884b33e97153f11a2a59b06e188e96a4be613a8000b66f2', false, NOW(), NOW(), 2,
  'dissolved-co2-fraction', 'respiratory-renal', 'vignette',
  $rf$[{"label": "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.", "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases"}]$rf$::jsonb,
  'step1', false,
  'mechanism', 'dissolved-co2-fraction', 'usmle-s1-new-20261128', 'pending',
  $gm${"batchId": "usmle-s1-new-20261128", "batchNumber": 2, "code": "S1N-200", "hidden": true, "physicianTask": "mechanism", "sourceUrl": "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases", "nutrition": false, "keyLetter": "E", "verifiedFact": "About 7 to 10 percent of carbon dioxide is dissolved in plasma. About 70 percent is bicarbonate and about 20 percent is carbaminohemoglobin."}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s1_new_20261128_b02_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's1n202611280101',
    's1n202611280102',
    's1n202611280103',
    's1n202611280104',
    's1n202611280105',
    's1n202611280106',
    's1n202611280107',
    's1n202611280108',
    's1n202611280109',
    's1n202611280110',
    's1n202611280111',
    's1n202611280112',
    's1n202611280113',
    's1n202611280114',
    's1n202611280115',
    's1n202611280116',
    's1n202611280117',
    's1n202611280118',
    's1n202611280119',
    's1n202611280120',
    's1n202611280121',
    's1n202611280122',
    's1n202611280123',
    's1n202611280124',
    's1n202611280125',
    's1n202611280126',
    's1n202611280127',
    's1n202611280128',
    's1n202611280129',
    's1n202611280130',
    's1n202611280131',
    's1n202611280132',
    's1n202611280133',
    's1n202611280134',
    's1n202611280135',
    's1n202611280136',
    's1n202611280137',
    's1n202611280138',
    's1n202611280139',
    's1n202611280140',
    's1n202611280141',
    's1n202611280142',
    's1n202611280143',
    's1n202611280144',
    's1n202611280145',
    's1n202611280146',
    's1n202611280147',
    's1n202611280148',
    's1n202611280149',
    's1n202611280150',
    's1n202611280151',
    's1n202611280152',
    's1n202611280153',
    's1n202611280154',
    's1n202611280155',
    's1n202611280156',
    's1n202611280157',
    's1n202611280158',
    's1n202611280159',
    's1n202611280160',
    's1n202611280161',
    's1n202611280162',
    's1n202611280163',
    's1n202611280164',
    's1n202611280165',
    's1n202611280166',
    's1n202611280167',
    's1n202611280168',
    's1n202611280169',
    's1n202611280170',
    's1n202611280171',
    's1n202611280172',
    's1n202611280173',
    's1n202611280174',
    's1n202611280175',
    's1n202611280176',
    's1n202611280177',
    's1n202611280178',
    's1n202611280179',
    's1n202611280180',
    's1n202611280181',
    's1n202611280182',
    's1n202611280183',
    's1n202611280184',
    's1n202611280185',
    's1n202611280186',
    's1n202611280187',
    's1n202611280188',
    's1n202611280189',
    's1n202611280190',
    's1n202611280191',
    's1n202611280192',
    's1n202611280193',
    's1n202611280194',
    's1n202611280195',
    's1n202611280196',
    's1n202611280197',
    's1n202611280198',
    's1n202611280199',
    's1n202611280200'
);
COMMIT;
