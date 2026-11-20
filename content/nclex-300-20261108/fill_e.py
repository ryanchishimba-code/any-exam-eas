from make_items import NCSBN, CDC, TJC, AHA, ISMP, mcq, sata, bow, matrix, ordered
R,C,J,I,H=[NCSBN],[CDC,NCSBN],[TJC,NCSBN],[ISMP,NCSBN],[AHA,NCSBN]
REFS={"management-of-care":R,"safety-infection":C,"basic-care-comfort":R,"reduction-risk":J,"psychosocial":R,"health-promotion":R,"pharmacology-nursing":I,"physiological-adaptation":H}
LINES = """
safety-infection|4|A client with lice is admitted to a semi-private room.|What does the nurse do?|Use contact precautions and treat close contacts as directed|Use airborne isolation
safety-infection|4|A client is on neutropenic precautions and a nurse with a cold is assigned.|What does the charge nurse do?|Reassign the ill nurse away from that client|Send the ill nurse in without a mask
safety-infection|3|The nurse is opening a sterile kit and the glove touches the side table.|What does the nurse do?|Discard the contaminated glove and start over|Keep going because the table looks clean
safety-infection|4|A client with a sealed radiation implant dislodges the implant into the bed.|What does the nurse do?|Use long forceps to place the implant in the lead container and keep people away|Pick it up with bare hands
safety-infection|5|A client says they will swallow a stash of pills hidden in the room tonight.|What does the nurse do?|Search the room with a witness, remove the means, and increase observation|Leave the pills so the client feels trusted
safety-infection|4|Blood is splashed in a nurse's eye during a draw.|What does the nurse do?|Flush the eye now and report the exposure|Finish the shift and then rinse
basic-care-comfort|4|A client with a new stroke is drooling and the meal tray has arrived.|What does the nurse do?|Hold the meal until swallowing is cleared|Feed thin soup quickly
basic-care-comfort|4|A client with chronic pain uses a heating pad and the skin is now red and blistered.|What does the nurse do?|Remove the heat and assess the burn|Turn the pad higher
basic-care-comfort|3|A client wants to pray before surgery and the team is rushing.|What does the nurse do?|Allow a brief prayer if it does not delay an emergency|Tell the client prayer is not allowed
basic-care-comfort|4|A client with COPD cannot lie flat for a bed bath.|What does the nurse do?|Bathe the client with the head of the bed up|Insist on a flat position
basic-care-comfort|4|A client with diarrhea has red skin around the anus.|What does the nurse do?|Clean gently, apply a barrier, and check for the cause|Leave the skin open to air under a soiled brief
basic-care-comfort|3|A client is NPO and complains of dry mouth.|What does the nurse do?|Provide oral swabs if oral intake is not allowed|Give a full cup of water
reduction-risk|5|A client after tonsillectomy is swallowing repeatedly and the heart rate is rising.|What does the nurse do?|Inspect for bleeding and call the provider|Give ice cream and leave
reduction-risk|4|A client's Jackson-Pratt drain is suddenly full of bright red blood.|What does the nurse do?|Stay with the client, check vitals, and notify the provider|Empty it and ignore the color
reduction-risk|4|A client with a new ostomy has a stoma that is dusky purple.|What does the nurse do?|Notify the provider immediately|Wait for the next morning's rounds
reduction-risk|5|A client reports a rip at the incision and the nurse sees intestine.|What does the nurse do?|Cover it with moist sterile gauze, flex the knees, and call the surgeon|Push the intestine back in
reduction-risk|4|A client on a patient-controlled analgesia pump is hard to arouse and the rate is 8.|What does the nurse do?|Stop the pump, support breathing, and give naloxone if ordered|Press the button for the client
reduction-risk|3|A client is scheduled for surgery and the consent signature does not match the armband name.|What does the nurse do?|Stop and correct the identity before any premedication|Give the sedative so the client relaxes
psychosocial|4|A client newly admitted for depression has a belt and shoelaces.|What does the nurse do?|Remove items that could be used for harm and explain why|Leave them so the client feels normal
psychosocial|4|A client experiencing command hallucinations is becoming agitated.|What does the nurse do?|Reduce stimuli, stay within a safe distance, and offer medicine as ordered|Argue that the voices are fake
psychosocial|3|A family is shouting at each other in the hallway about a client's care.|What does the nurse do?|Move the talk to a private room and set calm limits|Join the argument
psychosocial|5|A client says they took a bottle of acetaminophen two hours ago and now feels fine.|What does the nurse do?|Send the client for emergency evaluation because liver injury can be delayed|Tell the client that feeling fine means no treatment
health-promotion|4|A client at 28 weeks has not felt the baby move as usual today.|What does the nurse do?|Arrange immediate evaluation of fetal movement|Wait until the next routine visit
health-promotion|3|Parents of a toddler ask about poison-proofing.|What does the nurse teach?|Lock medicines and cleaning products up and out of reach and keep the poison number posted|Store cleaners in unmarked food jars
health-promotion|4|A client with obesity asks about a crash diet before surgery next week.|What does the nurse teach?|Avoid a crash diet and follow the preoperative nutrition plan|Skip all food for a week
pharmacology-nursing|4|A client on lithium has vomiting and diarrhea and a new tremor.|What does the nurse do?|Hold the lithium and obtain a level and renal panel as ordered|Give the dose with a sports drink only
pharmacology-nursing|5|A client receiving a blood transfusion develops hives but no breathing change.|What does the nurse do?|Stop the blood, keep the vein open with saline, and notify the provider|Slow the blood and give no notice
pharmacology-nursing|4|A client is prescribed two medicines with look-alike names. The nurse is unsure which was intended.|What does the nurse do?|Call the provider to clarify before giving either|Give the one that is more common
management-of-care|4|A client's condition is declining and the on-call provider does not call back.|What does the nurse do?|Activate the chain of command|Wait until morning
management-of-care|5|An assistive person offers to adjust a dopamine drip because the nurse is busy.|What does the nurse say?|The nurse keeps titration of vasoactive drips|Go ahead if you have watched once
management-of-care|4|A client wants to leave the hospital while a 72-hour hold is in effect for danger to self.|What does the nurse do?|Explain the hold and do not allow the client to leave|Open the door because the client asked
safety-infection|4|A client with influenza is sharing a room with a client who had a stem-cell transplant.|What does the nurse do?|Move one of them so the immunocompromised client is not exposed|Leave them together if the curtain is pulled
basic-care-comfort|4|A client with a feeding tube has a residual of 500 mL and is vomiting.|What does the nurse do?|Stop the feeding and notify the provider|Increase the rate
reduction-risk|4|A client's pulse oximeter reads 82 percent and the client is restless.|What does the nurse do first?|Sit the client up, apply oxygen, and assess the airway|Recalibrate the device for 20 minutes before acting
psychosocial|4|A client recovering from a suicide attempt asks the nurse not to tell the team about a new plan.|What does the nurse do?|Tell the client that safety plans are shared with the team and report the new plan|Promise secrecy
health-promotion|4|A 16-year-old asks for contraception and state law allows confidential care.|What does the nurse do?|Provide confidential counseling consistent with the law|Call the parents before any talk
pharmacology-nursing|4|A client taking spironolactone has a potassium of 5.6 mEq/L.|What does the nurse do?|Hold the dose and notify the provider|Give the dose with a banana
physiological-adaptation|4|A client with a known seizure disorder starts to seize in bed.|What does the nurse do?|Protect the head, turn the client to the side, and time the seizure|Put a tongue blade in the mouth
safety-infection|3|The nurse's hands are visibly soiled after client care.|What does the nurse do?|Wash with soap and water|Use alcohol gel only
basic-care-comfort|4|A client with left-sided weakness is being transferred to a chair.|What does the nurse do?|Transfer toward the stronger side with a gait belt|Pull the client by the weak arm
reduction-risk|5|A client complains of a sudden ripping back pain and the blood pressures in the arms differ by 30 mm Hg.|What does the nurse do?|Activate emergency care for possible aortic dissection and keep the client still|Give a laxative for gas pain
management-of-care|4|A client does not speak English and is being asked to consent. No interpreter has arrived.|What does the nurse do?|Delay nonemergent consent until a qualified interpreter is present|Use the client's child
safety-infection|4|A coworker recaps a used needle.|What does the nurse do?|Stop the practice and remind the coworker that needles are not recapped|Ignore it because no one was hurt yet
basic-care-comfort|3|A client with nausea is offered a meal of fried food.|What does the nurse do?|Offer small bland foods or keep the client NPO if that is ordered|Insist on the fried meal
reduction-risk|4|A client with a femur fracture in traction says the boot is numb and cold.|What does the nurse do?|Check pulses and sensation and notify the provider if perfusion is poor|Add more weight to the traction
psychosocial|4|A client with anorexia is hiding food and the weight is falling.|What does the nurse do?|Supervise meals and report the weight loss|Praise the hidden food as control
health-promotion|3|A client asks how often to check a smoke alarm.|What does the nurse teach?|Test it monthly and change batteries as recommended|Never test it because the noise is harmful
pharmacology-nursing|5|A client on a PCA pump has a family member who keeps pressing the button while the client sleeps.|What does the nurse do?|Stop the family member and explain that only the client presses the button|Thank the family for helping
management-of-care|4|The offgoing nurse reports a critical potassium but did not call the provider.|What does the oncoming nurse do?|Assess the client and notify the provider now|Assume the provider already knows
safety-infection|4|A client with suspected Ebola-level viral hemorrhagic fever is arriving. The hospital has a special-pathogen plan.|What does the nurse do?|Follow the special-pathogen protocol and do not use routine hallway placement|Put the client in a shared room
basic-care-comfort|4|A client with burns has shivering and an open wound during a dressing change.|What does the nurse do?|Pre-medicate as ordered, keep the client warm, and use sterile technique|Change the dressing without pain medicine to finish faster
reduction-risk|4|A client 2 days after hip replacement has a sudden oxygen saturation of 88 percent and chest pain.|What does the nurse do?|Give oxygen and notify the provider for possible embolism|Start the client on a walk
psychosocial|3|A client is ashamed about incontinence.|What does the nurse do?|Protect privacy and start a toileting plan|Scold the client
health-promotion|4|A client who is 70 asks about shingles vaccine.|What does the nurse do?|Offer the recombinant shingles vaccine per the adult schedule if there is no contraindication|Say shingles vaccine is only for children
pharmacology-nursing|4|A client reports a rash after the first dose of a new antibiotic.|What does the nurse do?|Hold the next dose and notify the provider|Give the next dose with diphenhydramine without telling anyone
physiological-adaptation|5|A client in the recovery area has a respiratory rate of 6 after fentanyl.|What does the nurse do?|Support the airway and give naloxone as ordered|Give more fentanyl for comfort
management-of-care|4|A client asks the nurse to witness an advance directive. The client understands it.|What does the nurse do?|Witness according to policy if the nurse is not the one named as agent|Refuse because nurses never witness documents
safety-infection|5|A client with active tuberculosis refuses to stay in the isolation room and walks into the hall coughing.|What does the nurse do?|Mask the client, return the client to airborne isolation, and explain why|Let the client walk because of autonomy without any mask
""".strip().splitlines()

def load():
    for line in LINES:
        area, diff, scenario, question, right, wrong = line.split("|")
        if len(scenario) < 80:
            scenario += " The nurse is choosing the safest next action for this client."
        mcq(area, question[:42], int(diff), scenario, question,
            [right, wrong, "Ask another client to decide", "Wait until tomorrow"],
            right,
            "The action addresses the safety, scope, or precaution in front of the nurse.",
            "Waiting or handing the decision to another client leaves the risk in place.",
            REFS[area])
load()

sata("safety-infection","contact organisms",4,
"The charge nurse is placing newly admitted clients.",
"Which clients need contact precautions? Select all that apply.",
["C. difficile diarrhea","Draining MRSA wound","Influenza only","Closed fracture","Scabies"],
["C. difficile diarrhea","Draining MRSA wound","Scabies"],
"C. difficile, draining MRSA, and scabies spread by contact.",
"Influenza is droplet and a closed fracture needs standard precautions.",
C)
sata("management-of-care","RN-only work",5,
"The team is dividing the assignment.",
"Which tasks must the RN keep? Select all that apply.",
["New admission assessment","IV push opioid","Stable linen change","First teaching on warfarin","Recording a measured urine output"],
["New admission assessment","IV push opioid","First teaching on warfarin"],
"Assessment, IV push, and first teaching stay with the RN.",
"Linen and recording a measured output can be delegated on a stable client.",
R)
sata("reduction-risk","shock findings",5,
"A postoperative client is being assessed.",
"Which findings suggest shock and need immediate action? Select all that apply.",
["Blood pressure 80/46","Heart rate 132","Warm request for a blanket only","Urine output 10 mL in an hour","Pain score of 3"],
["Blood pressure 80/46","Heart rate 132","Urine output 10 mL in an hour"],
"Hypotension, tachycardia, and very low urine output are shock.",
"A blanket request and mild pain are not the shock cluster.",
J)
bow("basic-care-comfort","aspiration bow-tie",4,
"A client with a stroke coughs, has a wet voice after a sip of water, and the oxygen saturation falls from 97 to 90 percent.",
"Complete the bow-tie: one action and two parameters to monitor.",
"Suspected aspiration",
["Stop oral intake and sit the client up","Give more water to clear the throat","Lay the client flat","Start a regular diet"],
["Oxygen saturation","Respiratory rate","Weekly weight","Hair growth"],
"Stop oral intake and sit the client up","Oxygen saturation","Respiratory rate",
"Coughing and a falling saturation mean oral intake stops and the airway is supported.",
"More water, lying flat, a regular diet, weight, and hair growth worsen aspiration.",
R)
bow("pharmacology-nursing","opioid depression bow-tie",5,
"A client received morphine 15 minutes ago. The respiratory rate is 6 and the client does not wake to voice.",
"Complete the bow-tie: one action and two parameters to monitor.",
"Opioid-induced respiratory depression",
["Support breathing and give naloxone as ordered","Give another dose of morphine","Start a benzodiazepine","Offer oral fluids"],
["Respiratory rate","Level of consciousness","Daily weight","Stool frequency"],
"Support breathing and give naloxone as ordered","Respiratory rate","Level of consciousness",
"A rate of 6 and unresponsiveness after morphine is reversed with naloxone while breathing is supported.",
"More morphine, a benzodiazepine, fluids, weight, and stool frequency deepen or ignore the depression.",
I)
ordered("reduction-risk","adult choking",4,
"An adult client is clutching the throat and cannot cough or speak.",
"Place the actions in the safe order.",
["Give abdominal thrusts","Confirm the client cannot speak or cough","Call for help if the client becomes unresponsive","Start CPR if the client becomes unresponsive"],
["Confirm the client cannot speak or cough","Give abdominal thrusts","Call for help if the client becomes unresponsive","Start CPR if the client becomes unresponsive"],
"Severe obstruction is confirmed, thrusts are given, and CPR starts only if the client becomes unresponsive. The screen list is not that order.",
"Starting with thrusts before confirming, or CPR while the client is still standing, is the wrong sequence.",
H)
matrix("safety-infection","precaution matrix two",4,
"Four clients arrive at the same time. None is immunocompromised.",
"For each client, select the transmission precaution.",
["Measles","Influenza","C. difficile","Closed ankle fracture"],
["Airborne","Droplet","Contact","Standard"],
[("Measles","Airborne"),("Influenza","Droplet"),("C. difficile","Contact"),("Closed ankle fracture","Standard")],
"Measles is airborne, influenza is droplet, C. difficile is contact, and a closed fracture uses standard precautions.",
"Swapping those routes isolates the wrong client or exposes roommates.",
C)
sata("basic-care-comfort","pressure relief choices",4,
"A client has a sacral pressure injury and is in bed.",
"Which actions protect the skin? Select all that apply.",
["Turn at least every 2 hours","Float the heels","Massage the reddened sacrum","Keep the skin dry after incontinence","Leave the client on a bedpan for hours"],
["Turn at least every 2 hours","Float the heels","Keep the skin dry after incontinence"],
"Turning, offloading heels, and dry skin reduce pressure injury.",
"Massage of reddened skin and a long time on a bedpan worsen breakdown.",
R)
sata("safety-infection","fall prevention bundle",4,
"An older client received an opioid and needs to toilet.",
"Which actions belong in the fall plan? Select all that apply.",
["Stay with the client during the toilet","Leave the bed in the high position","Keep the call light in reach","Put nonskid footwear on","Turn off the bed alarm to reduce noise"],
["Stay with the client during the toilet","Keep the call light in reach","Put nonskid footwear on"],
"A recently medicated client is not left alone to toilet. The call light and footwear help.",
"A high bed and a disabled alarm increase the chance of a fall.",
J)
sata("management-of-care","handoff essentials",4,
"A client is being transferred to another unit.",
"Which facts must be included in the handoff? Select all that apply.",
["Allergies","Code status","The nurse's lunch order","Current vital-sign concerns","Favorite television channel"],
["Allergies","Code status","Current vital-sign concerns"],
"Allergies, code status, and unstable vitals change the receiving nurse's first actions.",
"Lunch and television are not safety handoff content.",
R)
sata("psychosocial","means restriction",5,
"A client with suicidal intent is admitted from home.",
"Which actions reduce access to means? Select all that apply.",
["Remove belts and shoelaces","Search belongings with a witness","Leave a private locked bathroom","Keep one-to-one observation","Allow the client to keep a pocket knife for comfort"],
["Remove belts and shoelaces","Search belongings with a witness","Keep one-to-one observation"],
"Means are removed and the client is observed. A search is done with respect and a witness.",
"A locked bathroom and a pocket knife keep lethal access.",
R)
sata("pharmacology-nursing","insulin safety",4,
"The nurse is about to give insulin.",
"Which checks are required? Select all that apply.",
["Match the dose to the order and the glucose","Use a second nurse when the policy requires an independent check","Give it without reading the label if the vial color looks right","Know the client's meal status","Borrow another client's insulin pen"],
["Match the dose to the order and the glucose","Use a second nurse when the policy requires an independent check","Know the client's meal status"],
"Dose, glucose, meal status, and a policy double-check prevent insulin errors.",
"Skipping the label or borrowing a pen is a medication error.",
I)
print("fill_e", len(LINES))
