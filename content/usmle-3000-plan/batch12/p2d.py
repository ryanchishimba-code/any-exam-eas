"""Step 2 items 31-50."""

from lib import s2

KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."

ITEMS = []

ITEMS.append(s2(
    31, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=2, subject="nephrology",
    takeaway="People at risk for CKD are tested with urine albumin and a filtration estimate together. A creatinine alone does not stage the kidney.",
    citation=KDIGO,
    scenario="A 63-year-old patient with longstanding diabetes has a serum creatinine of 1.1 mg/dL. Blood pressure is 128/78 mm Hg. No urine albumin result is on the chart, and no filtration estimate has been calculated. A colleague calls the creatinine normal and therefore proof that the kidneys are unharmed.",
    question="Which pair of tests matches the current CKD standard?",
    correct=("Urine albumin and an estimated filtration rate",
             "Diabetes is a risk state. KDIGO 2024 recommends both urine albumin and eGFR. A creatinine of 1.1 mg/dL can hide albuminuria and does not provide a filtration category."),
    wrongs=[
        ("Creatinine alone is enough, because 1.1 mg/dL excludes chronic kidney disease",
         "A normal creatinine misses albuminuria. The standard is not a single creatinine."),
        ("A 24-hour creatinine clearance only after the creatinine exceeds 2 mg/dL",
         "Waiting for a creatinine of 2 mg/dL delays detection. The standard starts with urine albumin plus eGFR."),
        ("A kidney ultrasound instead of any urine or blood test",
         "Imaging does not replace the albumin and filtration tests used to find and stage CKD."),
        ("A urine dipstick for glucose only",
         "Glycosuria is not the CKD test. Albumin and eGFR are."),
    ],
))

ITEMS.append(s2(
    32, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=2, subject="nephrology",
    takeaway="The current filtration estimate does not use race as a variable.",
    citation=KDIGO,
    scenario="A 58-year-old patient has a creatinine of 1.3 mg/dL. The laboratory still prints two filtration estimates, one of them multiplied by a race coefficient. A drug dose will change if the lower estimate is used. A colleague says to keep the race-adjusted number because it was the historical default.",
    question="Which estimate should decide the dose?",
    correct=("The estimate that does not apply a race coefficient",
             "KDIGO 2024 says race is not used in the eGFR computation. The dose should follow the race-free estimate, not a historical coefficient."),
    wrongs=[
        ("The race-adjusted estimate, because dropping race underestimates filtration",
         "The guideline removes race. It does not keep the coefficient to avoid underestimation."),
        ("Neither estimate. Dose the drug as though filtration were normal",
         "Ignoring a reduced estimate because the report is confusing is not the standard."),
        ("Average the race-adjusted and race-free numbers",
         "Averaging keeps race in the result. The guideline removes it rather than blending it."),
        ("Repeat the creatinine after a month and do not dose today",
         "A dosing decision the number changes should use the current equation now."),
    ],
))

ITEMS.append(s2(
    33, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
    takeaway="When high muscle mass makes a creatinine-based estimate unreliable and the number changes a drug dose, add cystatin C.",
    citation=KDIGO,
    scenario="A 29-year-old patient is a competitive weightlifter. Creatinine is 1.5 mg/dL and the creatinine-only filtration estimate is 58 mL/min/1.73 m2, which would cut the dose of a renally cleared antibiotic. Cystatin C has not been ordered. A colleague doses from the creatinine-only number.",
    question="Which filtration method should decide the antibiotic dose?",
    correct=("Creatinine and cystatin C together",
             "KDIGO 2024 recommends the combined estimate when the creatinine-based number is less accurate and it changes a decision. Muscle mass raises creatinine and can make the creatinine-only estimate falsely low."),
    wrongs=[
        ("Creatinine alone, because muscle mass does not affect creatinine",
         "Creatinine rises with muscle mass. That is why the creatinine-only estimate is the unreliable one here."),
        ("A urine creatine kinase instead of a filtration estimate",
         "Creatine kinase is not a filtration marker. The indicated second marker is cystatin C."),
        ("Ignore filtration and give the full antibiotic dose to every athlete",
         "A full dose is not automatically safe. The combined estimate is how the dose is chosen."),
        ("An inulin infusion before any antibiotic may be given",
         "An exogenous marker is for selected cases. It is not required before creatinine plus cystatin C."),
    ],
))

ITEMS.append(s2(
    34, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
    takeaway="An SGLT2 inhibitor is recommended at an eGFR of at least 20 when the urine ACR is at least 200 mg/g, even without diabetes.",
    citation=KDIGO,
    scenario="A 66-year-old patient has no diabetes. The A1c is 5.5 percent. The estimated filtration rate is 34 mL/min/1.73 m2 and the urine albumin-to-creatinine ratio is 410 mg/g. Blood pressure is already treated with an ACE inhibitor. A colleague withholds an SGLT2 inhibitor because there is no diabetes.",
    question="Does the normal A1c remove the SGLT2 inhibitor?",
    correct=("No. The filtration rate and the albumin level already meet the indication",
             "KDIGO 2024 recommends an SGLT2 inhibitor for adults with eGFR at least 20 and urine ACR at least 200 mg/g, with or without diabetes. eGFR 34 and ACR 410 meet that threshold. The ACE inhibitor does not replace it."),
    wrongs=[
        ("Yes. Without diabetes an SGLT2 inhibitor has no kidney indication",
         "The kidney indication in the 2024 guideline does not require diabetes when the albumin and filtration thresholds are met."),
        ("No, but only after the A1c rises above 6.5 percent",
         "Waiting for diabetes withholds a drug indicated by the kidney numbers now."),
        ("Yes, unless the eGFR is above 90",
         "The indication includes eGFR down to 20. A value of 34 is inside the recommended range, not outside it."),
        ("No, and the ACE inhibitor should be stopped when the SGLT2 inhibitor starts",
         "The ACE inhibitor stays. The SGLT2 inhibitor is added."),
    ],
))

ITEMS.append(s2(
    35, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
    takeaway="An early, small, reversible fall in eGFR after an SGLT2 inhibitor is started is not a reason to stop the drug.",
    citation=KDIGO,
    scenario="A 70-year-old patient started an SGLT2 inhibitor two weeks ago for albuminuric kidney disease. The estimated filtration rate fell from 48 to 42 mL/min/1.73 m2. He is drinking normally, a repeat creatinine is stable, and there is no hypotension. A colleague stops the drug because any fall in filtration means kidney injury.",
    question="What should happen to the SGLT2 inhibitor after this fall?",
    correct=("Continue it. This degree of early decline is expected and reversible",
             "KDIGO 2024 says the early decrease is generally reversible and is not by itself a reason to discontinue. A drop from 48 to 42 without illness fits that pattern."),
    wrongs=[
        ("Stop it. Any decline in eGFR is tubular injury and the drug is prohibited",
         "A modest early dip without hypotension or a rising creatinine is the hemodynamic effect the practice point describes, not a mandate to stop."),
        ("Stop it and start a nonsteroidal anti-inflammatory drug for the creatinine rise",
         "A nonsteroidal drug is a nephrotoxin. It is not the replacement for an expected hemodynamic dip."),
        ("Halve the dose every time eGFR falls by 1 mL/min",
         "The guideline does not use a 1-point titration rule. A small early dip is observed, not chased."),
        ("Switch to a DPP-4 inhibitor, which has the same kidney-outcome evidence",
         "A DPP-4 inhibitor does not replace the SGLT2 inhibitor's kidney indication."),
    ],
))

ITEMS.append(s2(
    36, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
    takeaway="Hold an SGLT2 inhibitor on the day of major surgery and during prolonged fasting, because ketosis is more likely then.",
    citation=KDIGO,
    scenario="A 64-year-old patient takes an SGLT2 inhibitor for chronic kidney disease. He is admitted for a bowel resection tomorrow and has been ordered nothing by mouth since midnight. Fingerstick glucose is 140 mg/dL and he feels well. The preoperative order set continues every home drug, including the SGLT2 inhibitor, through the morning of surgery.",
    question="What should happen to the SGLT2 inhibitor around this operation?",
    correct=("Hold it for the fast and the operation",
             "KDIGO 2024 says it is reasonable to withhold the drug for surgery, prolonged fasting, or critical illness. A glucose of 140 mg/dL does not rule out ketosis."),
    wrongs=[
        ("Give the morning dose, because a glucose of 140 mg/dL means ketosis is impossible",
         "Glucose can be near normal while ketones accumulate. The fast and the operation are the reasons to hold the drug."),
        ("Double the dose, because surgical stress raises glucose",
         "A higher dose during fasting increases the ketosis risk. The drug is held, not increased."),
        ("Stop it permanently because any operation ends the kidney indication",
         "The hold is temporary. The chronic kidney indication remains after he is eating again."),
        ("Replace it with a sulfonylurea on the morning of surgery",
         "A sulfonylurea during a fast adds hypoglycemia. It is not the perioperative substitute."),
    ],
))

ITEMS.append(s2(
    37, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=2, subject="nephrology",
    takeaway="An ACE inhibitor and an ARB are not combined. One renin-angiotensin drug is titrated to the highest tolerated dose.",
    citation=KDIGO,
    scenario="A 61-year-old patient with diabetes has an estimated filtration rate of 46 mL/min/1.73 m2 and a urine albumin-to-creatinine ratio of 180 mg/g. He takes lisinopril 10 mg. Potassium is 4.6 mEq/L and blood pressure is 138/84 mm Hg. A colleague adds losartan on top of the lisinopril to block the pathway at two points.",
    question="Which renin-angiotensin plan is acceptable?",
    correct=("Raise the lisinopril toward the highest tolerated dose and do not add losartan",
             "KDIGO 2024 recommends an ACE inhibitor or an ARB, not both. Albuminuria with diabetes calls for one drug, titrated up. A potassium of 4.6 is not a reason to add the second class."),
    wrongs=[
        ("Lisinopril plus losartan, because dual blockade protects the kidney more than either drug alone",
         "Dual blockade adds hyperkalemia and acute kidney injury. The guideline recommends against combining the two classes."),
        ("Stop lisinopril and use no renin-angiotensin drug because the potassium is 4.6",
         "A potassium of 4.6 is not a reason to abandon the class. The dose is adjusted with monitoring."),
        ("Add spironolactone and losartan and lisinopril together",
         "Three potassium-raising drugs are not the standard. The error to avoid is combining the ACE inhibitor with the ARB."),
        ("Switch both drugs to a nonsteroidal anti-inflammatory drug",
         "A nonsteroidal drug worsens kidney perfusion and is not a substitute for renin-angiotensin blockade."),
    ],
))

ITEMS.append(s2(
    38, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
    takeaway="A 5-year kidney-failure risk of about 3 to 5 percent supports nephrology referral, together with the filtration rate and the urine albumin.",
    citation=KDIGO,
    scenario="A 67-year-old patient has an estimated filtration rate of 32 mL/min/1.73 m2 and a urine albumin-to-creatinine ratio of 220 mg/g. A validated 5-year kidney-failure risk equation returns 4 percent. He is already on an ACE inhibitor and an SGLT2 inhibitor. A colleague says referral is useful only after the filtration rate falls below 15.",
    question="What does a 4 percent 5-year risk add to the referral decision?",
    correct=("It supports referral now, together with the filtration rate and the albumin level",
             "KDIGO 2024 says a 5-year risk of 3 to 5 percent can be used for nephrology referral in addition to eGFR and urine ACR. Four percent is inside that range. The drugs he already takes do not replace the referral."),
    wrongs=[
        ("Nothing. Referral waits for an eGFR below 15 mL/min/1.73 m2",
         "Waiting for 15 misses the 3 to 5 percent 5-year window the practice point uses."),
        ("It means dialysis should start this week",
         "A 4 percent risk over five years is a referral threshold, not an indication for immediate dialysis."),
        ("It cancels the ACE inhibitor, because referred patients stop renin-angiotensin drugs",
         "Referral does not stop the ACE inhibitor or the SGLT2 inhibitor."),
        ("It is interpretable only if the risk is above 40 percent",
         "A 2-year risk above 40 percent is a later threshold used for planning kidney-replacement therapy. The 5-year 3 to 5 percent figure is the referral range."),
    ],
))

ITEMS.append(s2(
    39, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
    takeaway="At or after 37 weeks, new hypertension with proteinuria and no severe feature is delivered rather than observed until 39 weeks.",
    citation=ACOG,
    scenario="A 32-year-old patient is at 37 weeks and 2 days. Blood pressures 4 hours apart are 148/96 and 146/94 mm Hg. The urine protein-to-creatinine ratio is 0.4. Platelets are 210,000, creatinine is 0.6 mg/dL, and liver enzymes are normal. She has no headache, no visual change, and no pulmonary edema. The fetal tracing is reassuring. A colleague plans weekly visits until 39 weeks.",
    question="Which delivery timing matches 37 weeks and these results?",
    correct=("Deliver now rather than continue expectant care until 39 weeks",
             "ACOG Practice Bulletin 222 recommends delivery rather than expectant management at or beyond 37 0/7 weeks when this pressure and proteinuria are present without severe features. The protein ratio does not dictate a cesarean."),
    wrongs=[
        ("Wait until 39 weeks because no severe feature is present",
         "Absence of severe features is why delivery is chosen at 37 weeks rather than earlier. It is not a reason to wait until 39."),
        ("Start magnesium and send her home until 40 weeks",
         "Magnesium is for severe features or seizures, which she does not have. Outpatient delay to 40 weeks is not the recommendation."),
        ("Deliver only if the platelet count falls below 100,000",
         "A low platelet count would be a severe feature. Its absence at 37 weeks does not justify waiting."),
        ("Immediate cesarean because vaginal birth is contraindicated by the protein ratio",
         "The decision is timing of delivery, not a mandatory cesarean."),
    ],
))

ITEMS.append(s2(
    40, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
    takeaway="At or after 34 weeks, severe-range pressure or platelets below 100,000 are delivered after the mother is stabilized. Steroids do not delay that delivery, and magnesium is used to prevent seizures.",
    citation=ACOG,
    scenario="A 27-year-old patient is at 35 weeks and 0 days. Blood pressure is 170/112 mm Hg and remains 166/110 mm Hg 20 minutes later. Platelets are 90,000 per microliter. She is alert, the lungs are clear, and the fetal tracing is reassuring. A colleague wants to wait 48 hours so a steroid course for the fetus can finish before any delivery.",
    question="What is done with delivery and with seizure prevention?",
    correct=("Stabilize her, start magnesium, and deliver without waiting for steroids to finish",
             "She is past 34 0/7 weeks with severe-range pressure and platelets below 100,000. ACOG recommends delivery after stabilization and says not to delay for steroids in the late preterm period. Magnesium is for seizure prevention."),
    wrongs=[
        ("Delay delivery for 48 hours so the steroid course can be completed",
         "The bulletin specifically says delivery is not delayed for steroids once severe features are present at or after 34 weeks."),
        ("Discharge on oral labetalol and recheck in a week",
         "Severe-range pressure and thrombocytopenia are not an outpatient plan."),
        ("Magnesium only, with delivery postponed until 37 weeks",
         "Magnesium is indicated, but expectant care until 37 weeks is not the plan at 35 weeks with severe features."),
        ("Platelet transfusion as the only therapy, because the pressure can wait",
         "Transfusion alone does not replace stabilization, magnesium, and delivery."),
    ],
))
