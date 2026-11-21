"""Step 2 items 1-25. Same decisions as the earlier draft, audited."""

from lib import s2

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."

ITEMS = []

ITEMS.append(s2(
    1, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="When pain began under 12 hours ago and a catheter cannot open the artery within 120 minutes, give a fibrin-specific fibrinolytic and transfer immediately, unless a contraindication is present.",
    citation=ACS,
    scenario="A 54-year-old patient has had pressure-like chest pain and sweating for 40 minutes. Pulse is 96/min, blood pressure is 142/86 mm Hg, and the lungs are clear. The electrocardiogram shows 2 mm of ST-segment elevation in leads II, III, and aVF, plus 1 mm of ST-segment elevation in right-sided lead V4R. This hospital has no catheterization laboratory. The nearest laboratory can open the artery about 150 minutes after first medical contact. He has never bled into the brain, never had a stroke, and takes no anticoagulant.",
    question="Which reperfusion plan fits a 150-minute device time and this tracing?",
    correct=("Give a fibrin-specific fibrinolytic now and transfer immediately",
             "Onset is under 12 hours, 150 minutes exceeds the 120-minute transfer limit, and no absolute contraindication is present. The 2025 ACS guideline recommends fibrinolysis in that setting, then immediate transfer. Right-sided ST elevation is a reason to avoid a nitrate, not a reason to skip reperfusion."),
    wrongs=[
        ("Transfer and withhold a fibrinolytic because 150 minutes is an acceptable device time",
         "A 150-minute delay is longer than 120 minutes. Transfer without a fibrinolytic leaves the artery closed while a drug is indicated."),
        ("Give nitroglycerin until the pain stops, then decide about reperfusion",
         "ST elevation in V4R means right-ventricular infarction is suspected. The same guideline says to avoid nitroglycerin in that setting."),
        ("Observe for 6 hours because inferior ST elevation can wait for a troponin",
         "Inferior ST elevation with ongoing pain is an acute occlusion pattern. A troponin is not required before reperfusion."),
        ("Wait until 12 hours after onset before any reperfusion drug",
         "He is already inside the window. Waiting until the window closes removes the option the guideline is using."),
    ],
))

ITEMS.append(s2(
    2, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=2, subject="cardiology",
    takeaway="At a PCI-capable hospital, ST-elevation infarction within 12 hours is treated with primary PCI when the device can be activated within 90 minutes.",
    citation=ACS,
    scenario="A 61-year-old patient arrives at a hospital that performs coronary intervention. Crushing chest pain began 35 minutes ago. Pulse is 104/min and blood pressure is 138/82 mm Hg. The electrocardiogram shows 3 mm of ST-segment elevation in V2 through V4. The team can activate the device about 40 minutes after first medical contact. A colleague draws up an intravenous clot-dissolving drug because it can be mixed before the team arrives.",
    question="Which reperfusion choice matches a 40-minute device time?",
    correct=("Take him for primary coronary intervention and do not give a clot-dissolving drug",
             "The 2025 guideline recommends primary PCI when first-medical-contact-to-device time is 90 minutes or less. Forty minutes meets that standard, so a fibrinolytic only adds bleeding."),
    wrongs=[
        ("Give the clot-dissolving drug now because any drug that starts first is preferred",
         "Fibrinolysis is for patients who cannot receive timely PCI. A 40-minute device time is timely PCI."),
        ("Wait for a rising troponin before calling the catheterization team",
         "The tracing already shows an acute occlusion. The guideline does not require a troponin before primary PCI."),
        ("Start heparin and repeat the electrocardiogram in 12 hours",
         "Anticoagulation alone is not reperfusion, and 12 hours misses the window."),
        ("Arrange emergency bypass surgery as the first reperfusion method",
         "Bypass is for selected patients when PCI cannot be performed or fails, not the first strategy when timely PCI is available."),
    ],
))

ITEMS.append(s2(
    3, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="A prior intracranial hemorrhage is an absolute contraindication to fibrinolysis, so the patient is transferred for PCI even when the trip will exceed 120 minutes.",
    citation=ACS,
    scenario="A 68-year-old patient has had chest pain for 70 minutes. Blood pressure is 150/88 mm Hg. The electrocardiogram shows 2 mm of ST-segment elevation in V2 through V5. This hospital cannot perform coronary intervention, and device activation after transfer would be about 170 minutes. Ten years ago he had a spontaneous bleed into the brain and recovered fully. He is not bleeding now. A colleague wants a clot-dissolving drug before the ambulance leaves because the trip is long.",
    question="Which plan respects both the long trip and the old brain bleed?",
    correct=("Transfer for primary coronary intervention and do not give a clot-dissolving drug",
             "The 2025 guideline lists prior intracranial hemorrhage as an absolute reason not to give a fibrinolytic, and it recommends transfer for PCI when fibrinolysis is contraindicated. The 170-minute delay would otherwise have favored a lytic."),
    wrongs=[
        ("Give a clot-dissolving drug now because 170 minutes exceeds the transfer threshold",
         "The time threshold does not override an absolute contraindication. Prior intracranial hemorrhage prohibits the drug."),
        ("Lower the blood pressure below 110 mm Hg and then give the clot-dissolving drug",
         "The pressure is already controlled. Blood-pressure lowering does not remove a prior brain hemorrhage."),
        ("Give a half dose of the clot-dissolving drug because the brain bleed was a decade ago",
         "The guideline does not create a remote-bleed exception or a half-dose workaround."),
        ("Observe locally for 24 hours because neither transfer nor a drug is allowed",
         "Transfer for PCI remains appropriate when a fibrinolytic cannot be used."),
    ],
))

ITEMS.append(s2(
    4, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Fibrinolysis is not given for ST-segment depression alone when a true posterior infarction has been looked for and is not present.",
    citation=ACS,
    scenario="A 59-year-old patient has mild burning chest discomfort that began 90 minutes ago. Pulse is 88/min and blood pressure is 128/76 mm Hg. The electrocardiogram shows 1 mm of horizontal ST-segment depression in V4 through V6. Posterior leads V7 through V9 are flat, and lead V1 has no tall R wave. The first troponin is pending. A colleague prepares a clot-dissolving drug because any ischemic tracing in the first hours should be reperfused pharmacologically.",
    question="Why is a clot-dissolving drug the wrong drug for this tracing?",
    correct=("Only ST-segment depression is present and the extra posterior leads do not show infarction, so a clot-dissolving drug is not indicated",
             "The 2025 guideline says not to give fibrinolytic therapy when the only change is ST-segment depression, unless a true posterior infarction is suspected. These posterior leads are flat."),
    wrongs=[
        ("ST depression in several leads is treated with fibrinolysis whenever pain began within 12 hours",
         "Pharmacologic reperfusion is for ST elevation or suspected true posterior infarction, not for anterior depression with a normal posterior tracing."),
        ("A still-pending troponin permanently excludes an acute coronary syndrome",
         "A pending troponin does not exclude ischemia, but that fact does not create an indication for fibrinolysis."),
        ("Horizontal depression means the artery is already open, so anticoagulation is also unnecessary",
         "Depression can still be an acute coronary syndrome. The error is the fibrinolytic, not a claim that no other therapy could be considered."),
        ("Posterior leads are recorded only after a clot-dissolving drug has been given",
         "Those leads are how a true posterior infarction is sought before a fibrinolytic is chosen."),
    ],
))

ITEMS.append(s2(
    5, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="For ST-elevation infarction treated with primary PCI, prasugrel or ticagrelor is preferred. Clopidogrel is used when those drugs cannot be used.",
    citation=ACS,
    scenario="A 57-year-old patient is on the table for primary stenting. Chest pain began 80 minutes ago, with ST-segment elevation in V2 through V4. He has never had a stroke or a transient neurologic deficit, he is not bleeding, and he takes no anticoagulant. Prasugrel, ticagrelor, and clopidogrel are all in stock. The operator asks which oral platelet drug should accompany aspirin.",
    question="Which oral platelet drug matches primary stenting in this patient?",
    correct=("Prasugrel or ticagrelor",
             "The 2025 guideline says prasugrel or ticagrelor should be given for ST-elevation infarction managed with primary PCI. Clopidogrel is reserved for when those agents are unsuitable, which they are not here."),
    wrongs=[
        ("Clopidogrel, because it is the platelet drug paired with every reperfusion strategy",
         "Clopidogrel is the drug paired with fibrinolysis. He is undergoing primary PCI, and the preferred agents are available."),
        ("Aspirin alone, because a stent removes the need for a second platelet drug",
         "Dual therapy is part of primary PCI. Aspirin alone leaves stent thrombosis unaddressed."),
        ("The fibrinolysis platelet schedule, because any ST elevation uses that schedule",
         "He is not receiving a fibrinolytic. The lytic schedule uses clopidogrel, not prasugrel."),
        ("Ticagrelor only if the first contrast injection shows the artery already open",
         "The platelet choice follows the reperfusion strategy, not whether the artery happens to be open on the first picture."),
    ],
))

ITEMS.append(s2(
    6, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Prasugrel is avoided after a stroke or a transient ischemic attack. Ticagrelor can still be used for primary PCI.",
    citation=ACS,
    scenario="A 64-year-old patient is being prepared for primary stenting of an occluded anterior artery. ST-segment elevation has been present for one hour. Three years ago he had an hour of aphasia that was diagnosed as a transient ischemic attack. He has no history of bleeding into the brain. A colleague reaches for prasugrel because the case is primary PCI.",
    question="Which platelet choice avoids the drug this history prohibits?",
    correct=("Ticagrelor rather than prasugrel",
             "The 2025 guideline says to avoid prasugrel after a stroke or a transient ischemic attack. Ticagrelor remains an appropriate P2Y12 inhibitor for primary PCI."),
    wrongs=[
        ("Prasugrel, because primary PCI outranks a remote neurologic event",
         "Primary PCI does not cancel the prasugrel prohibition after a transient ischemic attack."),
        ("Aspirin alone until a neurologist clears every second platelet drug",
         "The remote event prohibits prasugrel. It does not prohibit dual therapy with an alternative agent during primary PCI."),
        ("Half-dose prasugrel, because the neurologic event resolved",
         "The guideline does not offer a reduced prasugrel dose after a stroke or a transient ischemic attack."),
        ("No aspirin, because any prior cerebral ischemia makes aspirin the harmful drug",
         "The drug to avoid is prasugrel. Aspirin remains part of the acute regimen."),
    ],
))

ITEMS.append(s2(
    7, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="When fibrinolysis is the reperfusion strategy, clopidogrel is the P2Y12 inhibitor given with it. Under age 75 that includes a loading dose.",
    citation=ACS,
    scenario="A 63-year-old patient at a hospital without a catheterization laboratory has had chest pain for two hours. The electrocardiogram shows ST-segment elevation in II, III, and aVF. Transfer would delay device activation by about three hours. Blood pressure is 136/80 mm Hg, and he has no bleeding history and no stroke. A fibrin-specific fibrinolytic is about to be given. He is 63 years old. The admitting clinician asks which oral platelet drug should be given at the same time.",
    question="Which oral platelet drug is paired with the fibrinolytic?",
    correct=("Clopidogrel, with a loading dose because he is younger than 75 years",
             "The 2025 guideline recommends clopidogrel concurrently with a fibrinolytic. Under age 75 the described schedule is a 300 mg load, then 75 mg daily."),
    wrongs=[
        ("Prasugrel as the loading drug, because it is preferred whenever ST elevation is present",
         "Prasugrel is a primary-PCI drug. It is not the drug given concurrently with a fibrinolytic."),
        ("No second platelet drug until the artery is imaged the next day",
         "Clopidogrel is given with the fibrinolytic, not deferred until angiography."),
        ("A full ticagrelor load at the same minute as the fibrinolytic at every age",
         "The concurrent recommendation with the fibrinolytic is clopidogrel, not a ticagrelor load at the same minute."),
        ("High-dose aspirin without a second platelet drug, because the fibrinolytic replaces it",
         "Fibrinolysis does not replace the P2Y12 inhibitor. Clopidogrel is added to aspirin."),
    ],
))

ITEMS.append(s2(
    8, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=2, subject="cardiology",
    takeaway="Every patient with an acute coronary syndrome receives high-intensity statin therapy without waiting for a baseline LDL cholesterol.",
    citation=ACS,
    scenario="A 52-year-old patient underwent stenting this morning for chest pain with ST-segment elevation. He is now pain-free. No lipid panel has returned, and the chart has no prior cholesterol values. A colleague says to withhold a lipid drug until the LDL cholesterol is known, and to start one only if that value is above 190 mg/dL.",
    question="Which lipid plan matches an acute coronary syndrome when the LDL cholesterol is unknown?",
    correct=("Start high-intensity statin therapy now, without waiting for a baseline LDL cholesterol",
             "The 2025 guideline recommends high-intensity statin therapy for all patients with an acute coronary syndrome. The primary-prevention threshold of 190 mg/dL is not the rule after this event."),
    wrongs=[
        ("Wait for the lipid panel and start a drug only if LDL cholesterol exceeds 190 mg/dL",
         "That threshold is a primary-prevention rule. Waiting leaves the acute indication untreated."),
        ("Start a low-intensity statin and raise it only if a later LDL cholesterol is high",
         "The recommendation is high-intensity therapy, not a low dose pending a number."),
        ("Use a fibrate first because the triglyceride value changes early events",
         "A fibrate is not the lipid drug the ACS guideline recommends for every patient."),
        ("Defer any lipid drug until a routine clinic visit a month from now",
         "The statin is an in-hospital recommendation, not a therapy that waits a month."),
    ],
))

ITEMS.append(s2(
    9, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Nitroglycerin is avoided when right-ventricular infarction is suspected, even if systolic pressure is still above 90 mm Hg.",
    citation=ACS,
    scenario="A 66-year-old patient has had chest pain for one hour. Blood pressure is 118/74 mm Hg, essentially unchanged from 122/76 mm Hg in the ambulance. The lungs are clear and the neck veins are distended. The electrocardiogram shows ST-segment elevation in II, III, and aVF and in right-sided V4R. A colleague orders nitroglycerin because the pain continues and the systolic pressure is above 90 mm Hg.",
    question="Why is nitroglycerin the wrong drug despite a systolic pressure of 118 mm Hg?",
    correct=("Right-sided ST elevation means right-ventricular infarction is suspected, and nitroglycerin is avoided in that setting",
             "The 2025 guideline lists three separate reasons to avoid nitroglycerin: suspected right-ventricular infarction, systolic pressure below 90 mm Hg, or a drop of more than 30 mm Hg. Only the first is present, and it is enough."),
    wrongs=[
        ("A systolic pressure above 100 mm Hg makes nitroglycerin mandatory in every inferior tracing",
         "Pressure above 90 mm Hg removes only one of the reasons to avoid the drug. Suspected right-ventricular infarction is an independent reason."),
        ("Clear lungs mean he is volume overloaded, so a nitrate is the safest first drug",
         "Clear lungs with distended neck veins and this tracing point away from left-sided fluid overload."),
        ("Nitroglycerin is unsafe only after systolic pressure has already fallen below 70 mm Hg",
         "The stated pressure threshold is 90 mm Hg, and the right-ventricular pattern is a separate contraindication. The guideline does not wait for 70."),
        ("Pain relief with a nitrate should be completed before the right-sided leads are recorded",
         "The right-sided lead is what identifies the contraindication. Giving the nitrate first reverses that order."),
    ],
))

ITEMS.append(s2(
    10, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=2, subject="cardiology",
    takeaway="Radial artery access is preferred over femoral access for PCI in an acute coronary syndrome because it reduces bleeding, vascular complications, and death.",
    citation=ACS,
    scenario="A 70-year-old patient is about to undergo stenting for an acute coronary syndrome. Both wrists have a strong pulse, and ultrasound shows a patent radial artery on the right. The femoral arteries are also easy to palpate. He is not in shock. An operator who usually uses the leg asks whether the access site changes outcomes enough to matter.",
    question="Which access site does the acute coronary syndrome standard prefer when both are available?",
    correct=("The radial artery, because it reduces bleeding, vascular complications, and death compared with the femoral artery",
             "That is a class recommendation in the 2025 ACS guideline for PCI, and this patient's radial artery is patent. Habit is not the selection rule."),
    wrongs=[
        ("The femoral artery, because it is faster in every acute coronary syndrome",
         "The guideline recommends radial rather than femoral access when it is feasible. Speed of an old habit is not the rule."),
        ("Either site, because access-site bleeding does not change mortality once a stent is placed",
         "The guideline cites a reduction in death as well as in bleeding. The sites are not interchangeable."),
        ("A brachial cutdown, because a surgical artery is required for acute stenting",
         "Brachial cutdown is not the recommended default. Percutaneous radial access is preferred."),
        ("The femoral artery with a closure device, which the guideline treats as equivalent to radial access",
         "A closure device is not listed as erasing the benefit of radial access."),
    ],
))
