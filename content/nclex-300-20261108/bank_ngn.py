from make_items import NCSBN, CDC, TJC, AHA, SSC, ADA, ISMP, mcq, sata, bow, matrix, ordered, case
R, C, J, H, S, I = [NCSBN], [CDC, NCSBN], [TJC, NCSBN], [AHA, NCSBN], [SSC, NCSBN], [ISMP, NCSBN]

def cs(area, topic, diff, group, step, scenario, question, options, key, why, wrong, refs):
    case(area, topic, diff, group, step, scenario, question, options, key, why, wrong, refs)

# Case: thyroidectomy airway, management + safety + risk
G = "nclex300-thyroid"
cs("management-of-care","post-thyroidectomy priority",5,G,1,
"0700: A client returned from a thyroidectomy 90 minutes ago. The dressing is dry. The client is hoarse and now makes a harsh sound on inspiration. Another client is asking for pain medication.","Which client does the nurse see first?",
["The client requesting pain medication","The client with the harsh inspiratory sound","The client whose family is on the phone","The client due for a routine antibiotic at 0900"],
"The client with the harsh inspiratory sound","Stridor after neck surgery is an airway emergency.","A pain request, a phone call, and a later antibiotic do not come before airway obstruction.",R)
cs("reduction-risk","equipment at the bedside",4,G,2,
"0710: The nurse is with the client who has stridor after thyroidectomy. A coworker asks what must already be at the bedside.","Which equipment is the priority to have ready?",
["A tracheostomy tray and suction","A walker","A heating pad","An incentive spirometer only"],
"A tracheostomy tray and suction","Swelling can obstruct the airway and the team may need a surgical airway and suction.","A walker, heat, or spirometry does not open an obstructed airway.",R)
cs("physiological-adaptation","hypocalcemia cue",4,G,3,
"0800: The stridor has eased after the rapid response. The client now reports tingling around the mouth and muscle twitching in the hands.","Which laboratory result does the nurse expect to be low?",
["Calcium","Sodium","Glucose","Hemoglobin"],
"Calcium","Parathyroid glands can be stunned during thyroidectomy, dropping calcium.","Sodium, glucose, and hemoglobin do not explain perioral tingling and tetany.",R)
cs("safety-infection","seizure and tetany precautions",4,G,4,
"0810: Calcium is low and the client is twitching. The nurse is setting up the room.","Which added precaution is appropriate?",
["Padded side rails and seizure precautions","Airborne isolation","A rectal tube","Trendelenburg position"],
"Padded side rails and seizure precautions","Severe hypocalcemia can cause seizures. The bed is made safe while calcium is replaced.","Isolation, a rectal tube, and Trendelenburg do not address tetany.",J)
cs("pharmacology-nursing","calcium replacement",5,G,5,
"0820: IV calcium is ordered. The client is on a cardiac monitor. The nurse is about to give the dose.","Which action is required while calcium is infused?",
["Give it as a rapid IV push without a monitor","Infuse it slowly on a cardiac monitor and stop for bradycardia or a sudden rhythm change","Mix it in the same line as bicarbonate","Give it through a feeding tube"],
"Infuse it slowly on a cardiac monitor and stop for bradycardia or a sudden rhythm change","IV calcium can slow the heart and must be given slowly while the rhythm is watched.","A fast unmonitored push, a bicarbonate mixture, or a feeding tube is not how IV calcium is given.",I)
cs("management-of-care","family during an emergency",4,G,6,
"0830: The client's adult child arrives and demands a full update in the hallway while the nurse is still titrating the calcium infusion and watching the monitor.","Which action is appropriate?",
["Leave the bedside to give a detailed hallway update","Stay with the client and arrange a short update after the infusion is stable","Tell the child the calcium value in the hallway","Ask assistive personnel to adjust the calcium rate"],
"Stay with the client and arrange a short update after the infusion is stable","The unstable client is not left for a hallway conference, and the rate is not delegated.","Leaving, announcing a lab in the hall, or delegating the titration breaks safety and privacy.",R)

# Case: sepsis bundle
G = "nclex300-sepsis"
cs("physiological-adaptation","recognize sepsis",5,G,1,
"A client with a urinary catheter has a temperature of 39.2 C, heart rate 124, blood pressure 86/50 after fluids were not yet given, and new confusion.","Which problem does the nurse recognize?",
["Stable infection","Sepsis with hypotension","Anxiety only","Dehydration that can wait until the next lab draw"],
"Sepsis with hypotension","Fever, tachycardia, hypotension, and new confusion from a urinary source are sepsis with shock until treated.","Calling it stable, anxiety, or a delay misses the time-sensitive bundle.",S)
cs("pharmacology-nursing","cultures then antibiotic",5,G,2,
"The sepsis bundle is starting. Blood cultures are not drawn. The antibiotic is at the bedside.","Which sequence does the nurse use?",
["Give the antibiotic, then draw cultures if time allows","Draw the cultures immediately, then start the antibiotic","Wait for the culture result before any antibiotic","Start a narrow antibiotic tomorrow"],
"Draw the cultures immediately, then start the antibiotic","Cultures come immediately before the antibiotic so treatment is not delayed and the culture is not sterilized.","Skipping cultures or waiting for results delays or ruins the workup.",S)
cs("reduction-risk","lactate",4,G,3,
"The client with suspected septic shock has not had a lactate measured. Fluids are starting.","Which test does the nurse send now?",
["Lactate","Fasting lipid panel","Thyroid panel","Prostate-specific antigen"],
"Lactate","Lactate is part of the early sepsis assessment and guides resuscitation.","A lipid panel, thyroid test, or PSA does not guide this resuscitation.",S)
cs("basic-care-comfort","fluid resuscitation position",3,G,4,
"The hypotensive client is receiving the initial fluid bolus and feels dizzy when the head of the bed is high.","Which position supports perfusion during the bolus?",
["High Fowler's at 90 degrees","Supine with the legs supported, unless breathing is worse lying flat","Trendelenburg for the rest of the day","Prone"],
"Supine with the legs supported, unless breathing is worse lying flat","A flat or low position supports blood pressure during fluids if the client can breathe.","Sitting straight up, prolonged Trendelenburg, or prone is not the perfusion position here.",S)
cs("safety-infection","catheter source",4,G,5,
"The urinary catheter has been in for 6 days and is the suspected source. The client is improving after fluids and antibiotics. A removal order is written.","Which action does the nurse take?",
["Leave the catheter because it is convenient","Remove the catheter and start a voiding trial","Change the catheter weekly without an order","Irrigate the catheter with tap water"],
"Remove the catheter and start a voiding trial","An unneeded catheter is removed once it is the source and the client can be trialed.","Keeping it for convenience, a casual weekly change, or tap-water irrigation continues infection risk.",C)
cs("management-of-care","who stays with the septic client",4,G,6,
"The septic client is still on a norepinephrine infusion. A new graduate asks to take the client plus three other unstable clients.","Which assignment does the charge nurse make?",
["Give the new graduate all four unstable clients","Assign the vasopressor client to an experienced RN and limit the rest of that assignment","Assign the vasopressor to assistive personnel","Ask the LPN to titrate the norepinephrine"],
"Assign the vasopressor client to an experienced RN and limit the rest of that assignment","A titrated vasopressor needs an experienced RN and a workload that allows monitoring.","Four unstable clients, assistive personnel, or an LPN titration is unsafe.",R)

# Stand-alone NGN
bow("safety-infection","fall with anticoagulant",5,
"A client on warfarin has an INR of 4.8, new confusion, and a fresh fall with a bruise behind the ear. Blood pressure is 168/96.","Complete the bow-tie: choose one action and two parameters to monitor.",
"Anticoagulated client with a head strike and a high INR",
["Hold warfarin and obtain an urgent head CT","Give the next warfarin dose now","Encourage ambulation without help","Apply a heating pad to the bruise"],
["Level of consciousness","Pupil size and equality","Hourly blood glucose","Bowel sounds"],
"Hold warfarin and obtain an urgent head CT","Level of consciousness","Pupil size and equality",
"A high INR plus a head strike is intracranial bleeding until imaging says otherwise. Consciousness and pupils are the monitors.",
"Giving more warfarin, unsupervised walking, a heating pad, glucose, and bowel sounds do not evaluate a head bleed.",
J)
bow("management-of-care","hypoglycemia on the unit",4,
"A client with type 2 diabetes is sweaty, confused, and has a fingerstick glucose of 48 mg/dL. The client can swallow.","Complete the bow-tie: choose one action and two parameters to monitor.",
"Hypoglycemia in a client who can swallow",
["Give 15 grams of fast carbohydrate and recheck glucose","Give the scheduled insulin now","Start the client on a regular diet tray only","Have the client walk the hall"],
["Repeat glucose in 15 minutes","Return of orientation","Urine ketones in 24 hours only","Weekly weight"],
"Give 15 grams of fast carbohydrate and recheck glucose","Repeat glucose in 15 minutes","Return of orientation",
"A client who can swallow gets rapid carbohydrate and a recheck. Orientation confirms the brain is recovering.",
"Insulin, a meal tray alone, walking, delayed ketones, and weekly weight do not treat glucose of 48.",
[ADA, NCSBN])
