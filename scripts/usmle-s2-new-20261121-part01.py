# Executed by build-usmle-s2-new-20261121.py with add, person, and vitals in scope.

def _g(age, sex, job, setting, lead, extra, t, p, r, sbp, dbp, data):
    return " ".join(
        [
            person(age, sex, job, setting, lead),
            extra,
            vitals(t, p, r, sbp, dbp),
            data,
        ]
    )


# --- Gestational diabetes, one-step 75-g test (ADA 2025 Table 2.8) ---

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-fasting-alone",
    task="diagnosis",
    difficulty=2,
    src="ada-dx",
    nutrition=True,
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        27, "woman", "school librarian", "prenatal clinic",
        "at 26 weeks of gestation for a scheduled glucose tolerance test",
        "She has no personal history of diabetes. Body mass index is 27 kg/m2. She fasted for 10 hours overnight. The fetal heart rate is 148/min.",
        36.7, 82, 16, 114, 70,
        "Plasma glucose on the 75-g test is 97 mg/dL fasting, 164 mg/dL at 1 hour, and 141 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "One fasting result at or above 92 mg/dL makes the diagnosis on this test",
        "The test is normal because two of the three results must be high",
        "The fasting result meets nonpregnant criteria for diabetes at 126 mg/dL",
        "A 100-g test is required before any diagnosis is made",
        "The 1-hour result is the only value that can establish the diagnosis",
    ],
    key=0,
    whys=[
        "On the one-step 75-g test at 24 to 28 weeks, the diagnosis is made when any one value meets or exceeds fasting 92 mg/dL, 1-hour 180 mg/dL, or 2-hour 153 mg/dL. Fasting glucose is 97 mg/dL. The other two results are below their cutoffs, and a single abnormal result is enough.",
        "Requiring two abnormal values is the rule for the 100-g test in the two-step strategy, not for this 75-g test.",
        "Nonpregnant diabetes uses a fasting cutoff of 126 mg/dL. This fasting result is 97 mg/dL.",
        "The one-step 75-g test is itself diagnostic. A 100-g test belongs to the other strategy.",
        "Any one of the three thresholds is sufficient. The abnormal result here is the fasting value, not the 1-hour value.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-one-hour-alone",
    task="diagnosis",
    difficulty=3,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        33, "woman", "graphic designer", "obstetric office",
        "at 27 weeks of gestation after an overnight fast",
        "Her first-trimester fasting glucose was 84 mg/dL and she was not treated with a glucose-lowering drug. She feels well. The fetal heart rate is 152/min.",
        36.8, 88, 14, 118, 74,
        "On a morning 75-g test, plasma glucose is 88 mg/dL fasting, 186 mg/dL at 1 hour, and 146 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "The 1-hour result alone meets the one-step diagnostic threshold",
        "The test is nondiagnostic until the 2-hour result also exceeds 153 mg/dL",
        "Fasting glucose below 92 mg/dL cancels an elevated 1-hour result",
        "The 1-hour cutoff on this test is 140 mg/dL, so 186 mg/dL is expected",
        "A result in this range should be ignored until after 32 weeks",
    ],
    key=0,
    whys=[
        "The one-step criteria are fasting 92 mg/dL, 1-hour 180 mg/dL, and 2-hour 153 mg/dL, and any one value at or above its cutoff makes the diagnosis. The 1-hour value is 186 mg/dL. Fasting and 2-hour values are below their cutoffs.",
        "A second abnormal value is not required on the 75-g one-step test.",
        "Each threshold stands on its own. A normal fasting result does not erase a 1-hour result at or above 180 mg/dL.",
        "140 mg/dL is a 1-hour treatment goal after the diagnosis, and it is also one of the 50-g screen thresholds. It is not the 1-hour diagnostic cutoff on the 75-g test.",
        "Screening for this diagnosis is done at 24 to 28 weeks, which is when this test was performed.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-two-hour-alone",
    task="diagnosis",
    difficulty=3,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        29, "woman", "pharmacy technician", "community prenatal clinic",
        "at 25 weeks of gestation for a 75-g tolerance test",
        "She fasted for 9 hours. She has no polydipsia. Fundal height matches the stated dates, and the fetal heart rate is 146/min.",
        36.6, 76, 16, 110, 68,
        "Plasma glucose is 90 mg/dL fasting, 172 mg/dL at 1 hour, and 159 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "The 2-hour result at or above 153 mg/dL establishes the diagnosis",
        "All three results must exceed their cutoffs before the test is positive",
        "The 2-hour cutoff on this test is 140 mg/dL, so 159 mg/dL is borderline normal",
        "A 2-hour result matters only when the fasting result exceeds 126 mg/dL",
        "The test should be repeated next week before any diagnosis is recorded",
    ],
    key=0,
    whys=[
        "On the one-step 75-g test, a 2-hour plasma glucose at or above 153 mg/dL is diagnostic even when the fasting and 1-hour values are below 92 and 180 mg/dL. This 2-hour result is 159 mg/dL.",
        "One abnormal value is sufficient on this strategy.",
        "140 mg/dL is the lower end of the nonpregnant impaired-glucose range and a pregnancy treatment target, not the 2-hour diagnostic cutoff of 153 mg/dL.",
        "The 2-hour threshold is independent of the fasting result.",
        "An abnormal one-step test does not need a confirmatory repeat before the diagnosis is made.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-all-below",
    task="diagnosis",
    difficulty=2,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        24, "woman", "restaurant server", "prenatal clinic",
        "at 26 weeks of gestation after a 12-hour overnight fast",
        "Body mass index is 24 kg/m2. She takes a prenatal vitamin and no glucose-lowering medication. The fetal heart rate is 144/min.",
        36.5, 80, 14, 108, 66,
        "The 75-g test shows plasma glucose of 84 mg/dL fasting, 154 mg/dL at 1 hour, and 128 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "None of the three results meets a one-step diagnostic cutoff",
        "The 1-hour result above 140 mg/dL makes the diagnosis",
        "The 2-hour result above 120 mg/dL makes the diagnosis",
        "Fasting glucose above 80 mg/dL is abnormal in pregnancy",
        "A 100-g test is the required next step after every 75-g test",
    ],
    key=0,
    whys=[
        "The one-step cutoffs are fasting 92 mg/dL, 1-hour 180 mg/dL, and 2-hour 153 mg/dL. All three results are below those cutoffs, so the test does not make the diagnosis.",
        "140 mg/dL is a post-diagnosis 1-hour treatment goal, not the diagnostic cutoff of 180 mg/dL.",
        "120 mg/dL is a 2-hour treatment goal after diagnosis, not the diagnostic cutoff of 153 mg/dL.",
        "There is no 80 mg/dL fasting diagnostic threshold in this strategy.",
        "A normal one-step test does not move the patient into the 100-g pathway.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-fasting-just-under",
    task="diagnosis",
    difficulty=4,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        36, "woman", "accountant", "maternal-fetal clinic",
        "at 28 weeks of gestation for a 75-g tolerance test",
        "She fasted for 11 hours. A first-trimester hemoglobin A1C was 5.2%. The fetal heart rate is 140/min.",
        36.7, 78, 15, 122, 76,
        "Plasma glucose is 91 mg/dL fasting, 179 mg/dL at 1 hour, and 152 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "Each result is just below its cutoff, so the test is not diagnostic",
        "Fasting glucose of 91 mg/dL exceeds the 90 mg/dL pregnancy cutoff",
        "The 1-hour result of 179 mg/dL exceeds the 140 mg/dL diagnostic cutoff",
        "The 2-hour result of 152 mg/dL exceeds the 140 mg/dL diagnostic cutoff",
        "Values this close to the cutoffs should be treated as a positive test",
    ],
    key=0,
    whys=[
        "The diagnosis requires a value at or above fasting 92 mg/dL, 1-hour 180 mg/dL, or 2-hour 153 mg/dL. Results of 91, 179, and 152 mg/dL are each 1 mg/dL below the corresponding cutoff.",
        "The fasting cutoff is 92 mg/dL, not 90 mg/dL.",
        "The 1-hour diagnostic cutoff is 180 mg/dL. 140 mg/dL is a treatment goal used after the diagnosis.",
        "The 2-hour diagnostic cutoff is 153 mg/dL, not 140 mg/dL.",
        "The criteria use 'met or exceeded.' A result below the cutoff is not a positive test.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-onestep-short-fast",
    task="interpretation",
    difficulty=4,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        31, "woman", "flight attendant", "prenatal clinic",
        "at 26 weeks of gestation",
        "She ate breakfast 3 hours before the visit and then drank the 75-g glucose load. She has no vomiting. The fetal heart rate is 150/min.",
        36.9, 90, 16, 116, 72,
        "Plasma glucose is 101 mg/dL before the load, 188 mg/dL at 1 hour, and 160 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate next step?",
    options=[
        "Repeat a 75-g test after an overnight fast of at least 8 hours",
        "Accept the results because any elevated value is diagnostic",
        "Start insulin today on the basis of the 1-hour result",
        "Order a hemoglobin A1C and use it as the pregnancy diagnostic test",
        "Schedule the next glucose test for 36 weeks",
    ],
    key=0,
    whys=[
        "The one-step 75-g test is performed in the morning after an overnight fast of at least 8 hours. A test done 3 hours after breakfast does not meet that condition, so it should be repeated after a proper fast.",
        "The numeric thresholds apply to a correctly performed fasting test, not to a test done after a recent meal.",
        "Treatment follows a valid diagnosis. This test was not performed after an adequate fast.",
        "Because of increased red-cell turnover, A1C is not the diagnostic test for this mid-pregnancy evaluation, and estimated A1C methods are not used in pregnancy.",
        "Screening is scheduled at 24 to 28 weeks. Waiting until 36 weeks delays a test that can still be performed correctly now.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-early-iadpsg-not-for-first-trimester",
    task="diagnosis",
    difficulty=5,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        30, "woman", "software engineer", "obstetric clinic",
        "at 12 weeks of gestation",
        "Body mass index is 33 kg/m2. She has no symptoms of hyperglycemia. She fasted for 10 hours. The fetal heart rate is 158/min.",
        36.6, 84, 14, 118, 74,
        "A 75-g test shows plasma glucose of 94 mg/dL fasting, 170 mg/dL at 1 hour, and 148 mg/dL at 2 hours.",
    ),
    stem="Which of the following is the most appropriate interpretation?",
    options=[
        "The 24-to-28-week one-step cutoffs should not be used to label this early test",
        "Fasting glucose of 94 mg/dL at 12 weeks meets the one-step diagnosis",
        "Early testing with these cutoffs replaces the 24-to-28-week test",
        "A fasting value under 126 mg/dL rules out all later testing",
        "Insulin should be started because the fasting value exceeds 92 mg/dL",
    ],
    key=0,
    whys=[
        "ADA states that the IADPSG 75-g diagnostic criteria and the two-step criteria were not derived from data in the first half of pregnancy and should not be used for early screening. Before 15 weeks, testing looks for abnormal glucose metabolism and undiagnosed diabetes, not these later cutoffs.",
        "The fasting cutoff of 92 mg/dL belongs to the 24-to-28-week one-step strategy, which should not be applied at 12 weeks.",
        "If early testing does not show diabetes, screening is still performed at 24 to 28 weeks.",
        "A fasting glucose under 126 mg/dL does not meet nonpregnant diabetes criteria, but it does not cancel the later screen.",
        "Insulin is not started from an early test that should not be interpreted with the 24-to-28-week cutoffs.",
    ],
)

add(
    domain="reproductive-endocrine",
    subject="obstetrics",
    topic="gdm-screen-window-24-28",
    task="health-maintenance",
    difficulty=2,
    src="ada-dx",
    forbid=["gestational diabetes", "gdm"],
    vignette=_g(
        26, "woman", "elementary teacher", "prenatal clinic",
        "at 16 weeks of gestation for a routine visit",
        "Early fasting plasma glucose was 86 mg/dL and hemoglobin A1C was 5.1%. She has no personal history of diabetes. The fetal heart rate is 156/min.",
        36.6, 80, 14, 112, 68,
        "Urinalysis shows no glucose. Fundal height is consistent with dates.",
    ),
    stem="Which of the following is the most appropriate glucose testing plan?",
    options=[
        "Perform the routine glucose test at 24 to 28 weeks",
        "No further glucose testing is needed after a normal early result",
        "Start the 75-g diagnostic cutoffs at this 16-week visit",
        "Postpone all glucose testing until the postpartum visit",
        "Repeat hemoglobin A1C monthly and skip a tolerance test",
    ],
    key=0,
    whys=[
        "If early testing has not shown diabetes or high-risk abnormal glucose metabolism, ADA recommends screening at 24 to 28 weeks. A normal early fasting glucose and A1C do not replace that screen.",
        "A normal early evaluation is followed by the 24-to-28-week screen.",
        "The one-step diagnostic cutoffs are for 24 to 28 weeks and are not applied as the early-screening method.",
        "Waiting until after birth misses the antepartum screen.",
        "A1C is less useful as a pregnancy diagnostic test because red-cell turnover increases, and it does not replace the 24-to-28-week glucose test.",
    ],
)
