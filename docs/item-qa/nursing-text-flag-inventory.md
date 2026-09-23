# Nursing text-flag inventory

Production dry-run on 2026-09-23. No rows were written. `--apply` was not used.

281 active flagged nursing rows were scanned. 31 carry a text flag (`truncated_option` 28, `empty_stem` 3). `letter_only_option` was not stored on any active row. 250 `near_duplicate` rows were left in the queue.

| Action | Rows | What it means |
| --- | --- | --- |
| Retire | 3 | Stem is `Priority?` or `Action?`. Unpublished (`qaPassed` false). Soft-deactivate only. Published inventory drop would be 0. |
| Clear false positive | 28 | 26 NGN items whose stored choices are the letters A–D beside complete bow-tie, matrix, or highlight text, plus 2 published MCQs whose choices end in "to watch for". Clearing does not publish anything and does not change `qaPassed`. |
| Fix content | 0 | No cut-off had a single recoverable completion. |
| Needs human | 0 | Nothing ambiguous remained after those rules. |

Regenerate with `npm run db:remediate-text-flags -- --field nursing`. The tool output follows.


Mode: dry-run
Field: nursing
Subject: all
Retire requested: false
Clear resolved requested: false

Choice text is not rewritten. `qaPassed` is not changed. Rows are not deleted.
Near-duplicate flags stay in the queue.

## Counts

- Retire: 3
- Clear false positive: 28
- Fix content (report only): 0
- Needs human: 0
- Left in the Item QA queue (not these text codes): 250
- Full-exam links on retire rows (not removed): 0

## Inventory

Public inventory is active and qaPassed. Retire sets active=false only.
A clear does not change active or qaPassed, so it does not move the public count.

- Active before: 7194
- Published (active + qaPassed) before: 6456
- Expected active drop if retire is applied: 3
- Expected published inventory drop if retire is applied: 0
- Expected published inventory after retire: 6456

## Retire (3)

### cmra6lxg6002kic04d23f0bho

- Action: **retire** (empty_stem)
- Subject: pediatrics-nursing; type: vignette; qaPassed: false; review: pending
- Codes: empty_stem
- Stem: Priority?
- Scenario: Peds unit: 18mo dehydration, cap refill 4 sec, tears absent, lethargic.
- Flagged choice text: (none)
- Student-facing choices: "Establish IV access and notify provider", "Oral rehydration only now", "Discharge", "Wait 24 hr"
- Why: Stem is too short to be a question ("Priority?"). It is not rewritten from the scenario.
- Stored detail: Question stem is missing or too short.

### cmra6lxic002nic04uztoxfxr

- Action: **retire** (empty_stem)
- Subject: pharmacology-nursing; type: vignette; qaPassed: false; review: pending
- Codes: empty_stem
- Stem: Action?
- Scenario: Home health: client on digoxin, nausea, vision yellow-green, HR 52.
- Flagged choice text: (none)
- Student-facing choices: "Hold digoxin and notify provider", "Take digoxin early", "Double dose", "No action"
- Why: Stem is too short to be a question ("Action?"). It is not rewritten from the scenario.
- Stored detail: Question stem is missing or too short.

### cmra6lxjr002pic04obtf13gr

- Action: **retire** (empty_stem)
- Subject: med-surg; type: vignette; qaPassed: false; review: pending
- Codes: empty_stem
- Stem: Priority?
- Scenario: ICU: ventilated client, peak pressures rising, SpO₂ dropping, absent breath sounds left.
- Flagged choice text: (none)
- Student-facing choices: "Assess for tension pneumothorax; prepare for decompression per protocol", "Increase sedation only", "Extubate", "Call family"
- Why: Stem is too short to be a question ("Priority?"). It is not rewritten from the scenario.
- Stored detail: Question stem is missing or too short.

## Clear false positive (28)

### cmr31dfdv005fjs04as3cz4yr

- Action: **clear_false_positive**
- Subject: physiological-adaptation; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Bow-tie: Select ONE action and TWO findings to monitor.
- Scenario: ED: 71M HFrEF. BP 90/58, HR 110, lungs crackles bilat, 2+ edema, dizzy standing.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Give cautious IV fluid bolus per protocol", "Stop all diuretics now", "Discharge home", "High sodium diet", "Orthostatic vital signs", "Urine output hourly", "Fingerstick only", "Hair loss"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfeq005gjs043jcv6lg9

- Action: **clear_false_positive**
- Subject: pharmacology-nursing; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Bow-tie: ONE priority action and TWO monitoring priorities.
- Scenario: Med-surg: Client on warfarin, INR 5.1, gums bleeding, started TMP-SMX yesterday.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Hold warfarin and notify provider", "Give next warfarin dose", "Leafy greens only", "No follow-up", "Signs of bleeding", "INR recheck", "Weekly weights only", "Vision changes only"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dffi005hjs04p84mc5ug

- Action: **clear_false_positive**
- Subject: maternal-child; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Bow-tie: ONE action and TWO assessments.
- Scenario: L&D: 1 hr postpartum, fundus boggy above umbilicus, pad soaked q15min, HR 120, BP 90/55.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Fundal massage and uterotonic per protocol", "Early ambulation now", "Ice chips only", "Remove IV", "Lochia amount", "Vital signs", "Fetal heart tones", "Diet orders"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfg9005ijs04lw006c3e

- Action: **clear_false_positive**
- Subject: pediatrics-nursing; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Bow-tie: ONE action and TWO monitors.
- Scenario: PICU: 4yo asthma exacerbation. RR 40, retractions, SpO₂ 89% on 2L NC, speaking short phrases.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Nebulized bronchodilator per protocol", "Discharge home", "Oral fluids only", "Sedate without assessment", "Respiratory effort", "SpO₂ trend", "Daily weight", "Bowel sounds"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfh3005jjs04pyem8tb6

- Action: **clear_false_positive**
- Subject: psychosocial; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Bow-tie: ONE immediate action and TWO safety monitors.
- Scenario: Psych unit: Client states intent to overdose tonight; has pills in room.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "1:1 observation and remove harmful items", "Routine room checks q4h only", "Unsupervised passes", "Discharge planning first", "Suicidal ideation", "Risk of self-harm", "Appetite only", "Sleep pattern only"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfm0005pjs04wt5qxm5s

- Action: **clear_false_positive**
- Subject: physiological-adaptation; type: ngn_highlight; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Highlight findings that indicate highest priority.
- Scenario: Emergency department triage after a motor vehicle collision: GCS 14, open femur fracture, cool clammy skin, heart rate 126/min, blood pressure 86/58 mm Hg.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "cool clammy skin", "HR 126", "BP 86/58"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfmr005qjs04yjndc5u4

- Action: **clear_false_positive**
- Subject: safety-infection; type: ngn_highlight; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Highlight cues requiring immediate infection-control action.
- Scenario: Isolation room: C. diff, watery stools ×3, abdominal cramping.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "C. diff diagnosis", "watery stools ×3"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfnk005rjs04q3nvzwe8

- Action: **clear_false_positive**
- Subject: pediatrics-nursing; type: ngn_highlight; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Highlight findings requiring urgent escalation.
- Scenario: 6-week infant: temp 38.9°C, lethargic, poor feeding 24 hr.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "temp 38.9°C", "lethargic", "poor feeding 24 hr"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfq4005ujs04rn51anv4

- Action: **clear_false_positive**
- Subject: med-surg; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: For each finding, select the best column.
- Scenario: POD2 abdominal surgery.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "SpO₂ 87% on RA", "Serosanguineous dressing drainage", "New chest pain", "Absent bowel sounds", "Intervene now", "Expected", "Needs more data"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfqy005vjs04y47kkbe3

- Action: **clear_false_positive**
- Subject: safety-infection; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match each action to the correct category.
- Scenario: C. diff isolation room.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Soap and water hand wash", "Alcohol gel only", "Dedicated commode", "Ignore signage", "Required", "Not sufficient", "Incorrect"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfrp005wjs04934l5kbl

- Action: **clear_false_positive**
- Subject: med-surg; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Expected vs needs intervention?
- Scenario: New chest tube after pneumothorax.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Gentle bubbling in water seal", "Sudden stop of bubbling + crepitus", "Mild incision pain", "Tidaling with breathing", "Expected", "Intervene now", "More data"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfsf005xjs0416xog9td

- Action: **clear_false_positive**
- Subject: management-of-care; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Best assignment match for each client?
- Scenario: Charge nurse — shift assignments.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "New trach hour 1", "Stable d/c teaching", "Unstable chest pain", "Paperwork only new admit", "Experienced RN", "UAP with RN check", "Oriented float OK"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dft7005yjs04rqk53fe8

- Action: **clear_false_positive**
- Subject: pharmacology-nursing; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match monitoring to category.
- Scenario: Client starting gentamicin IV.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Peak/trough levels", "Notify ototoxicity symptoms", "Skip levels if feeling well", "Assess renal function", "Required", "Incorrect"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dftz005zjs04bb1dt1r0

- Action: **clear_false_positive**
- Subject: psychosocial; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match right to category.
- Scenario: Voluntary psych admission — rights education.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Refuse medications (if competent)", "Leave AMA with process", "Seclusion without order", "Privacy during visits", "Client right", "Violation"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfux0060js045jyaigga

- Action: **clear_false_positive**
- Subject: maternal-child; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Classify each finding.
- Scenario: Labor: FHR tracing review.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Late decels with contractions", "Moderate variability", "Variable decels with cord compression pattern", "Accelerations present", "Reassuring", "Intervene now"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfvo0061js046xtu0qrd

- Action: **clear_false_positive**
- Subject: pediatrics-nursing; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match teaching point to category.
- Scenario: School-age child with T1DM — parent asks about sick-day rules.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Check glucose q3-4h", "Hold all insulin if not eating", "Small sips if alert", "Ignore ketones", "Required", "Incorrect"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfwg0062js0414oc07ox

- Action: **clear_false_positive**
- Subject: reduction-risk; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match intervention to category.
- Scenario: Older adult fall risk assessment.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Bed alarm", "Slippery socks only", "Routine toileting schedule", "Restraints for convenience", "Fall precaution", "Increases risk", "Violation"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr31dfx90063js04czsypwz6

- Action: **clear_false_positive**
- Subject: physiological-adaptation; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Match finding to priority.
- Scenario: DKA resolving: glucose 240, K+ 3.2, pH improving.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Potassium 3.2", "Continue IV fluids", "Stop all insulin", "Discharge now", "Replace per protocol", "Continue", "Incorrect"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gtguo000kib041sypo4mm

- Action: **clear_false_positive**
- Subject: physiological-adaptation; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: A 68-year-old with HFrEF returns after diuretic adjustment. BP 92/58, HR 112, bilateral crackles, 2+ edema, weight +2 kg, dizziness on standing. Complete the bow-tie: select ONE a…
- Scenario: A 68-year-old with HFrEF returns after diuretic adjustment. BP 92/58, HR 112, bilateral crackles, 2+ edema, weight +2 kg, dizziness on standing.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Administer IV bolus per protocol", "Increase fluid restriction only", "Stop all diuretics", "High-Fowler's without assessment", "Orthostatic hypotension", "Daily weights and I/O", "Blood glucose q6h", "Deep tendon reflexes"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gtgvl000lib04prftv0mk

- Action: **clear_false_positive**
- Subject: reduction-risk; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Post-operative day 2 after abdominal surgery. For each finding, indicate whether the nurse should intervene immediately.
- Scenario: Post-operative day 2 after abdominal surgery.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Hypoxia SpO₂ 88% on room air", "Serosanguineous drainage on dressing", "New onset chest pain", "Absent bowel sounds", "Intervene immediately", "Expected finding", "Requires further data"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gtgw9000mib04jt5c3syl

- Action: **clear_false_positive**
- Subject: pharmacology-nursing; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: A nurse reviews a client on warfarin with INR 4.8, gums bleeding, and recent antibiotic course for UTI. Bow-tie: select ONE priority action and TWO findings to monitor.
- Scenario: A nurse reviews a client on warfarin with INR 4.8, gums bleeding, and recent antibiotic course for UTI.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Hold warfarin and notify provider per protocol", "Administer next scheduled dose", "Encourage leafy greens only", "Discharge without follow-up", "Signs of bleeding", "INR trend", "Blood pressure only weekly", "Hair growth"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gtgxf000oib04cqegq4en

- Action: **clear_false_positive**
- Subject: safety-infection; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Contact precautions room — client with C. difficile. Match each action to the correct category.
- Scenario: Contact precautions room — client with C. difficile.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Hand washing with soap and water", "Alcohol-based gel alone", "Dedicated equipment when possible", "Ignore isolation signage", "Required", "Insufficient", "Incorrect"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gtgzn000rib047a87rklm

- Action: **clear_false_positive**
- Subject: maternal-child; type: ngn_bowtie; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Postpartum hour 1: fundus boggy above umbilicus, heavy lochia, HR 118, BP 88/50. Bow-tie: select ONE action and TWO assessments.
- Scenario: Postpartum hour 1: fundus boggy above umbilicus, heavy lochia, HR 118, BP 88/50.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Massage fundus and administer uterotonic per protocol", "Ambulate immediately", "Discharge early", "Withhold fluids", "Vital signs and bleeding", "Fundus tone", "Fetal heart rate", "Diet tolerance"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gth08000sib04arw7jpz2

- Action: **clear_false_positive**
- Subject: med-surg; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Client with new chest tube after pneumothorax. Indicate expected vs requires immediate intervention.
- Scenario: Client with new chest tube after pneumothorax.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "Continuous gentle bubbling in water seal chamber", "Sudden cessation of bubbling with crepitus", "Mild discomfort at site", "Tidaling with respiration", "Expected finding", "Intervene immediately", "Requires further data"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gth1f000uib04lon214wv

- Action: **clear_false_positive**
- Subject: fundamentals; type: ngn_highlight; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Emergency department triage note: 22-year-old after MVC. GCS 13, open femur fracture, cool clammy skin, HR 128, BP 88/60. Highlight the findings that indicate the highest priority…
- Scenario: Emergency department triage note: 22-year-old after MVC. GCS 13, open femur fracture, cool clammy skin, HR 128, BP 88/60.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "cool clammy skin", "HR 128", "BP 88/60"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr4gth2s000vib04qukk7zvs

- Action: **clear_false_positive**
- Subject: management-of-care; type: ngn_matrix; qaPassed: false; review: pending
- Codes: truncated_option
- Stem: Charge nurse assigning four clients at shift start. Match each client to the most appropriate assignment consideration.
- Scenario: Charge nurse assigning four clients at shift start.
- Flagged choice text: "A", "B", "C", "D"
- Student-facing choices: "New tracheostomy on hour 1 post-op", "Stable med-surg discharge teaching", "Unstable chest pain rule-out", "New admission routine paperwork only", "Experienced nurse", "Assistive personnel with RN oversight", "Appropriate for float without orientation"
- Why: Letter placeholders are not the student-facing choices. The structured choices are complete.
- Stored detail: Option 1 looks truncated (A). Option 2 looks truncated (B). Option 3 looks truncated (C). Option 4 looks truncated (D).

### cmr7d3ep4004d1yvxqkbcy1t3

- Action: **clear_false_positive**
- Subject: pharmacology-nursing; type: vignette; qaPassed: true; review: approved
- Codes: truncated_option
- Stem: Which action should the nurse take first?
- Scenario: A 68-year-old female with a history of atrial fibrillation is admitted for anticoagulation therapy. She is prescribed warfarin and her INR is 1.8. The client is concerned about he…
- Flagged choice text: "Educate the client about signs of bleeding to watch for"
- Student-facing choices: "Educate the client about signs of bleeding to watch for", "Reassure the client that her INR is within therapeutic range", "Administer the next dose of warfarin as prescribed", "Notify the provider about the INR level"
- Why: Choice text is complete. A trailing function word such as "watch for" is not a cut-off.
- Stored detail: Option 1 looks truncated (Educate the client about signs of bleeding to watch for).

### cmr7fgo5n001r1y59fiijko31

- Action: **clear_false_positive**
- Subject: management-of-care; type: vignette; qaPassed: true; review: approved
- Codes: truncated_option
- Stem: Which intervention is the priority for this client to ensure continuity of care?
- Scenario: A 45-year-old female client with a history of hypertension and diabetes is admitted to the medical-surgical unit following a laparoscopic cholecystectomy. She is alert and oriente…
- Flagged choice text: "Educate the client on signs of infection to watch for"
- Student-facing choices: "Ensure the client has all her medications before discharge", "Provide a detailed report to the rehabilitation facility nurse", "Educate the client on signs of infection to watch for", "Arrange for a follow-up appointment with her primary care provider"
- Why: Choice text is complete. A trailing function word such as "watch for" is not a cut-off.
- Stored detail: Option 3 looks truncated (Educate the client on signs of infection to watch for).

## Fix content (0)

None.

## Needs human (0)

None.
