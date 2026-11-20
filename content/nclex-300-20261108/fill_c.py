from make_items import NCSBN, CDC, TJC, AHA, SSC, ADA, ISMP, CDC_VAX, mcq, bow, matrix, ordered, sata, case
R,C,J,H,S,D,I,V=[NCSBN],[CDC,NCSBN],[TJC,NCSBN],[AHA,NCSBN],[SSC,NCSBN],[ADA,NCSBN],[ISMP,NCSBN],[CDC_VAX,NCSBN]

def cs(area, diff, group, step, scenario, question, options, key, why, wrong, refs):
    case(area, "case "+group, diff, group, step, scenario, question, options, key, why, wrong, refs)

G="nclex300-pph"
cs("physiological-adaptation",5,G,1,"A client gave birth 30 minutes ago. The uterus is boggy and a pad is soaked with blood in 15 minutes. The client is dizzy.","What is the first nursing action?",
["Massage the fundus and call for help","Send the client to walk","Give a drink of water","Document the bleeding and recheck in an hour"],
"Massage the fundus and call for help","A boggy uterus and rapid soaking are postpartum hemorrhage. Fundal massage and help come first.","Walking, water, or waiting an hour lets bleeding continue.",H)
cs("pharmacology-nursing",5,G,2,"The fundus firms briefly then bogs again. Oxytocin is infusing. The provider adds methylergonovine if the blood pressure allows. The blood pressure is 168/110.","Which decision about methylergonovine is correct?",
["Give it because bleeding outranks blood pressure","Hold methylergonovine and tell the provider the blood pressure is 168/110","Give a double dose","Give it intravenously as a push without checking pressure"],
"Hold methylergonovine and tell the provider the blood pressure is 168/110","Methylergonovine raises blood pressure and is held when the client is already severely hypertensive.","Giving it, doubling it, or pushing it without a pressure check can cause a hypertensive crisis.",I)
cs("reduction-risk",4,G,3,"The bladder is palpable above the fundus and the client has not voided since birth. The fundus is shifted to the side.","Which action can help the uterus contract?",
["Help the client empty the bladder","Restrict all fluids","Apply a heating pad to the fundus","Give a sedative"],
"Help the client empty the bladder","A full bladder displaces the uterus and worsens bleeding. Emptying it lets the fundus firm.","Fluid restriction, heat, or a sedative does not empty the bladder.",R)
cs("basic-care-comfort",3,G,4,"After the bladder is emptied the client is cold and shaking. Bleeding has slowed. Vital signs are improving.","Which comfort action is appropriate now?",
["Warm blankets and reassurance while monitoring the bleeding","Ice packs on the chest","Trendelenburg for an hour","Nothing by mouth for 24 hours"],
"Warm blankets and reassurance while monitoring the bleeding","Shaking after birth is common once bleeding is controlled. Warmth and continued watching are appropriate.","Chest ice, prolonged Trendelenburg, or a day without oral intake is not required.",R)
cs("safety-infection",4,G,5,"The client is going to a procedure room. The pad count shows 800 mL since birth. Two nurses are needed for the transfer.","Which transfer plan is safe?",
["Transfer with oxygen available, a second nurse, and ongoing fundal checks","Send the client alone in a wheelchair","Walk the client to build strength","Delay the count until after the procedure"],
"Transfer with oxygen available, a second nurse, and ongoing fundal checks","Heavy blood loss needs a supported transfer and continued assessment.","Sending the client alone, walking, or dropping the pad count misses recurrent hemorrhage.",J)
cs("management-of-care",4,G,6,"The partner is filming the soaked pads on a phone and wants to post them. The client is still being resuscitated.","What does the nurse say?",
["Ask them to stop recording and explain that images of care are not for posting","Help them frame the photo","Post it on the unit page","Ignore it until the next shift"],
"Ask them to stop recording and explain that images of care are not for posting","Recording and posting care images violates privacy, especially during an emergency.","Helping with the photo, posting it, or ignoring it allows a disclosure.",R)

G="nclex300-chest"
cs("reduction-risk",5,G,1,"A client with a chest tube for a pneumothorax has tracheal deviation away from the tube side, severe dyspnea, and a blood pressure of 82/48. The tubing is kinked under the client.","What is the first action?",
["Unkink the tubing and stay with the client while getting help","Clamp the tube and leave","Sit the client in a chair across the room","Increase the IV pain medication only"],
"Unkink the tubing and stay with the client while getting help","A kink can recreate a tension pneumothorax. Opening the system and staying for shock is first.","Clamping, leaving the client, or only treating pain delays decompression.",J)
cs("basic-care-comfort",4,G,2,"The kink is relieved and breath sounds are returning. The client is anxious and in pain at the insertion site. A PRN analgesic is ordered and blood pressure is now 118/70.","Which comfort action is appropriate?",
["Give the analgesic and coach slow breaths while watching the drainage","Withhold all pain medicine because of the earlier hypotension","Remove the tube to stop the pain","Have the client cough forcefully without supporting the site"],
"Give the analgesic and coach slow breaths while watching the drainage","Once perfusion is restored, ordered analgesia and supported breathing are appropriate.","Withholding all analgesia, pulling the tube, or unsupported hard coughing is not the plan.",R)
cs("safety-infection",4,G,3,"The chest tube dressing is loose and the site is open to air at the edge. The tube is still in place and connected.","What does the nurse do?",
["Reinforce or replace the occlusive dressing with sterile technique","Leave the dressing because it is only loose","Pack the site with a dry washcloth","Cut the tube shorter at the bedside"],
"Reinforce or replace the occlusive dressing with sterile technique","A loose dressing lets air in around the site. It is sealed with sterile technique.","Leaving it, a washcloth, or cutting the tube breaks the seal.",C)
cs("management-of-care",4,G,4,"The client with the chest tube also needs a walk. Assistive personnel offer to take the client and the drainage system.","Which direction does the nurse give?",
["The nurse assesses readiness and keeps the drainage system below the chest, and may delegate the steady walk only after that","Have assistive personnel tip the system above the chest to make walking easier","Disconnect the tube for the walk","Let the client carry the system at shoulder height"],
"The nurse assesses readiness and keeps the drainage system below the chest, and may delegate the steady walk only after that","The system stays below the chest. The nurse decides if the client is stable enough to walk.","Raising, disconnecting, or carrying the system at the shoulder pulls fluid or air the wrong way.",R)
cs("pharmacology-nursing",3,G,5,"The client reports pain of 7 out of 10. Morphine is ordered IV. The respiratory rate is 16 and oxygen saturation is 96 percent.","Which action is appropriate?",
["Give the morphine and reassess rate and sedation","Hold it because the rate is under 20","Give a double dose for chest tubes","Give it by mouth from the IV supply"],
"Give the morphine and reassess rate and sedation","A rate of 16 with a safe saturation allows the ordered dose, followed by reassessment.","Holding for a normal rate, doubling the dose, or using the IV drug by mouth is incorrect.",I)
cs("physiological-adaptation",4,G,6,"Two hours later the water-seal chamber is bubbling continuously and the client is more short of breath.","What does continuous bubbling suggest?",
["An air leak in the system or a persistent pneumothorax that the provider must know about","A normal finding that needs no report","That the suction should be turned to maximum immediately without looking for a leak","That the tube can be removed"],
"An air leak in the system or a persistent pneumothorax that the provider must know about","Continuous bubbling in the water seal is an air leak until the system and the client are checked.","Ignoring it, maxing suction blindly, or pulling the tube misses the leak.",J)

# Bow-ties: action + two monitors
BOWS = [
("safety-infection",5,"A client pulled out a central line and is short of breath with chest pain on one side. Oxygen saturation is 88 percent.","Suspected air embolism after central line removal",
 ["Place the client on the left side in Trendelenburg and give oxygen","Have the client sit up and walk","Apply a warm compress and observe","Lower the oxygen to 1 L"],
 ["Oxygen saturation","Respiratory effort","Hourly urine glucose","Bowel sounds"],
 "Place the client on the left side in Trendelenburg and give oxygen","Oxygen saturation","Respiratory effort",
 "Left-side Trendelenburg and oxygen are the immediate steps for suspected air embolism. Saturation and work of breathing show if it is working.",
 "Walking, a warm compress, low oxygen, glucose, and bowel sounds do not trap the air or track breathing.",C),
("reduction-risk",5,"A client with a new cast has pain of 10 out of 10 and numbness in the toes that is new.","Possible compartment syndrome",
 ["Notify the provider now and prepare to open the cast","Give two extra opioids and recheck in 4 hours","Elevate the leg on five pillows and leave","Apply ice and a tight bandage"],
 ["Capillary refill of the toes","Ability to move the toes","Daily weight","Skin turgor on the chest"],
 "Notify the provider now and prepare to open the cast","Capillary refill of the toes","Ability to move the toes",
 "New numbness and severe pain need the cast opened. Distal refill and movement show whether perfusion and nerve function return.",
 "More opioid, high elevation alone, a tight bandage, weight, and chest turgor delay or worsen ischemia.",J),
("pharmacology-nursing",4,"A client on a heparin infusion has an aPTT that is four times the control and new nose bleeding.","Heparin effect above the therapeutic range",
 ["Stop the infusion and notify the provider","Increase the infusion to stop the bleeding","Give the next bolus now","Switch to an intramuscular injection"],
 ["Further bleeding","aPTT after the change","Blood glucose","Pupil size"],
 "Stop the infusion and notify the provider","Further bleeding","aPTT after the change",
 "An aPTT far above range with bleeding means the infusion stops. Bleeding and a repeat aPTT show the response.",
 "Increasing the dose, a bolus, an intramuscular injection, glucose, and pupils do not reverse excess anticoagulation.",I),
("physiological-adaptation",5,"A client in ventricular tachycardia with a pulse is dizzy and the blood pressure is 80/50. The defibrillator is in the room.","Unstable ventricular tachycardia",
 ["Prepare for immediate synchronized cardioversion and call for help","Give the client water and recheck in 30 minutes","Start chest compressions while the client is still talking","Have the client bear down only and leave"],
 ["Blood pressure","Level of consciousness","Urine color in 8 hours","Ankle edema"],
 "Prepare for immediate synchronized cardioversion and call for help","Blood pressure","Level of consciousness",
 "A pulse with hypotension and dizziness is unstable tachycardia and needs cardioversion, not a delay.",
 "Water, compressions on a talking client, leaving after a vagal maneuver, urine color, and ankle edema miss the unstable rhythm.",H),
("basic-care-comfort",4,"A client with heart failure has crackles, a weight gain of 2 kg overnight, and orthopnea.","Fluid overload",
 ["Raise the head of the bed and give the prescribed diuretic","Force oral fluids","Lay the client flat","Give a salt tablet"],
 ["Respiratory rate","Urine output after the diuretic","Pupil response","Grip strength"],
 "Raise the head of the bed and give the prescribed diuretic","Respiratory rate","Urine output after the diuretic",
 "Upright position and the ordered diuretic treat overload. Breathing and urine output show the effect.",
 "Fluids, lying flat, salt, pupils, and grip strength worsen or ignore the fluid.",R),
("psychosocial",4,"A client in alcohol withdrawal has a CIWA score in the severe range, a tremor, and a heart rate of 130.","Severe alcohol withdrawal",
 ["Give the protocol benzodiazepine and stay with the client","Discharge the client to the waiting room","Offer coffee and a walk","Apply restraints and give no medication"],
 ["Heart rate","Seizure activity","Weekly weight","Hair loss"],
 "Give the protocol benzodiazepine and stay with the client","Heart rate","Seizure activity",
 "Severe withdrawal is treated with a benzodiazepine at the bedside because seizures can follow.",
 "Discharge, coffee, restraints without medication, weight, and hair loss do not prevent seizures.",R),
("health-promotion",3,"A postpartum client wants to breastfeed and the newborn is 2 hours old and rooting.","Early breastfeeding",
 ["Help the newborn latch skin to skin now","Give a bottle first so the mother can rest all night","Schedule the first feed for tomorrow","Use a pacifier as the only intake"],
 ["Audible swallows","Newborn temperature","Maternal cholesterol","Paternal blood type"],
 "Help the newborn latch skin to skin now","Audible swallows","Newborn temperature",
 "Early skin-to-skin latch supports feeding and temperature. Swallows show milk transfer.",
 "A bottle first, waiting a day, a pacifier as intake, cholesterol, and blood type are not the feeding cues.",V),
("management-of-care",5,"A client with a known anaphylaxis history was just given the wrong antibiotic. Hives and wheezing have started.","Early anaphylaxis after a wrong drug",
 ["Stop the drug, give intramuscular epinephrine, and call for help","Finish the infusion because it is almost done","Give diphenhydramine as the only drug","Document and reassess in an hour"],
 ["Blood pressure","Airway sounds","Daily weight","Stool color"],
 "Stop the drug, give intramuscular epinephrine, and call for help","Blood pressure","Airway sounds",
 "The infusion stops and epinephrine is given. Pressure and airway sounds track shock and swelling.",
 "Finishing the drug, an antihistamine alone, waiting, weight, and stool color leave anaphylaxis untreated.",H),
]
for area, diff, scenario, condition, actions, monitors, action, m1, m2, why, wrong, refs in BOWS:
    bow(area, condition[:48], diff, scenario,
        "Complete the bow-tie: select one action and two parameters to monitor.",
        condition, actions, monitors, action, m1, m2, why, wrong, refs)

# Matrices: 4 findings
MATS = [
("safety-infection",4,"A nurse is sorting isolation needs for four clients admitted this hour.",
 ["Client with measles","Client with influenza","Client with C. difficile","Client with a closed fracture and no infection"],
 ["Airborne precautions","Droplet precautions","Contact precautions","Standard precautions"],
 [("Client with measles","Airborne precautions"),("Client with influenza","Droplet precautions"),("Client with C. difficile","Contact precautions"),("Client with a closed fracture and no infection","Standard precautions")],
 "Each organism has a route, and the fracture without infection does not need transmission precautions.",
 "Mixing airborne, droplet, and contact precautions spreads infection or isolates a client who does not need it.",C),
("reduction-risk",5,"A postoperative client has four new findings. Classify each one.",
 ["Oxygen saturation 86 percent","Small serosanguineous spot on the dressing","New calf swelling and chest pain","Bowel sounds absent 2 hours after surgery"],
 ["Intervene now","Expected now","Needs more data"],
 [("Oxygen saturation 86 percent","Intervene now"),("Small serosanguineous spot on the dressing","Expected now"),("New calf swelling and chest pain","Intervene now"),("Bowel sounds absent 2 hours after surgery","Needs more data")],
 "Hypoxia and signs of embolism are acted on now. A small bloody spot can be expected. Absent bowel sounds this early need more data before an emergency call.",
 "Treating the small spot as an emergency or ignoring hypoxia and chest pain reverses the priorities.",J),
("pharmacology-nursing",4,"A nurse is checking whether each medication situation is safe to give right now.",
 ["Apical pulse 48 before digoxin","Potassium 3.0 mEq/L before IV furosemide","Pain 8 out of 10 with a due opioid and a respiratory rate of 16","Blood pressure 86/50 before a new antihypertensive"],
 ["Hold and notify","Give as ordered"],
 [("Apical pulse 48 before digoxin","Hold and notify"),("Potassium 3.0 mEq/L before IV furosemide","Hold and notify"),("Pain 8 out of 10 with a due opioid and a respiratory rate of 16","Give as ordered"),("Blood pressure 86/50 before a new antihypertensive","Hold and notify")],
 "Digoxin at a slow rate, a loop diuretic with severe hypokalemia, and a blood-pressure drug during shock are held. Pain medicine at a safe respiratory rate is given.",
 "Giving the held drugs or holding the opioid at a rate of 16 is the unsafe swap.",I),
("basic-care-comfort",4,"A nurse is matching diets to clients.",
 ["Client who coughed on thin water","Client with a clear-liquid order after nausea has stopped","Client with a bowel obstruction and vomiting","Client cleared by speech therapy for nectar-thick liquids"],
 ["Nothing by mouth","Nectar-thick liquids","Regular thin liquids"],
 [("Client who coughed on thin water","Nothing by mouth"),("Client with a clear-liquid order after nausea has stopped","Regular thin liquids"),("Client with a bowel obstruction and vomiting","Nothing by mouth"),("Client cleared by speech therapy for nectar-thick liquids","Nectar-thick liquids")],
 "Aspiration and obstruction stay nothing by mouth. A stopped nausea with a clear-liquid order can have thin clear liquids. The cleared client gets nectar thickness, not thin water.",
 "Giving thin water to the coughing client or feeding the obstructed client causes aspiration.",R),
("psychosocial",4,"A nurse is sorting safety needs for mental health clients.",
 ["Client with a plan and access to a gun","Client crying about a loss who denies suicidal thoughts","Client hearing voices but eating and contracting for safety","Client pacing and threatening to hit staff"],
 ["One-to-one observation now","Routine checks and therapeutic talk","De-escalation and a safe space"],
 [("Client with a plan and access to a gun","One-to-one observation now"),("Client crying about a loss who denies suicidal thoughts","Routine checks and therapeutic talk"),("Client hearing voices but eating and contracting for safety","Routine checks and therapeutic talk"),("Client pacing and threatening to hit staff","De-escalation and a safe space")],
 "A plan plus a gun needs constant observation. Grief and contracted voices need presence, not the same emergency watch. A threatening client needs de-escalation first.",
 "Using one-to-one for every tear or ignoring the firearm plan is the error.",R),
("management-of-care",4,"The charge nurse is sorting which worker may perform each task.",
 ["Collect a stool sample from a stable client","Give IV push morphine","Teach a new ostomy","Irrigate a new colostomy for the first time"],
 ["Assistive personnel","Registered nurse"],
 [("Collect a stool sample from a stable client","Assistive personnel"),("Give IV push morphine","Registered nurse"),("Teach a new ostomy","Registered nurse"),("Irrigate a new colostomy for the first time","Registered nurse")],
 "A collected specimen from a stable client can be delegated. IV push, first teaching, and a first irrigation stay with the RN.",
 "Delegating the IV push or the first teaching gives away nursing judgment.",R),
]
for area, diff, scenario, rows, cols, pairs, why, wrong, refs in MATS:
    matrix(area, "matrix classification", diff, scenario,
           "For each finding, select the appropriate category.",
           rows, cols, pairs, why, wrong, refs)

# Ordered responses: display is intentionally not the correct sequence
ordered("safety-infection","fire order",3,
"The nurse finds a small fire in a wastebasket and a client is in the room.",
"Place the actions in the safe order.",
["Pull the alarm","Rescue the client","Confine the fire by closing the door","Extinguish if it is safe"],
["Rescue the client","Pull the alarm","Confine the fire by closing the door","Extinguish if it is safe"],
"Rescue is first when a person is in the room, then alarm, confine, and extinguish.",
"Alarm before rescue leaves the client in the fire.",R)
ordered("pharmacology-nursing","blood culture and antibiotic",5,
"A client in septic shock needs cultures and an antibiotic that is already at the bedside.",
"Place the steps in the safe order.",
["Start the antibiotic","Label the culture bottles at the bedside","Draw the blood cultures","Hang the fluid bolus"],
["Draw the blood cultures","Label the culture bottles at the bedside","Hang the fluid bolus","Start the antibiotic"],
"Cultures are drawn and labeled before the antibiotic. Fluids and the antibiotic then follow without a long delay.",
"Starting the antibiotic first can sterilize the culture.",S)
ordered("reduction-risk","donning protective equipment",4,
"The nurse is entering the room of a client on contact and droplet precautions.",
"Place the donning steps in order.",
["Gloves","Gown","Mask","Hand hygiene"],
["Hand hygiene","Gown","Mask","Gloves"],
"Hands are cleaned first, then gown and mask, and gloves last so the gloves cover the cuffs.",
"Gloves first contaminate the rest of the equipment.",C)
ordered("physiological-adaptation","adult CPR",5,
"A nurse finds an adult client unresponsive on the floor. The client is not breathing and has no pulse. Help is in the hall.",
"Place the actions in order.",
["Start chest compressions","Shout for help and activate the emergency response","Open the airway and give breaths after compressions have started","Attach the defibrillator when it arrives"],
["Shout for help and activate the emergency response","Start chest compressions","Attach the defibrillator when it arrives","Open the airway and give breaths after compressions have started"],
"Help is activated, compressions start immediately, the defibrillator is attached as soon as it arrives, and breaths are added without delaying compressions.",
"Breaths or a search for equipment before activating help and compressions delays circulation.",H)
ordered("management-of-care","telephone order",4,
"A provider is giving a telephone order for a new opioid.",
"Place the safety steps in order.",
["Administer the drug","Write the order","Read the drug, dose, route, and frequency back","Ask the provider to confirm the read-back"],
["Write the order","Read the drug, dose, route, and frequency back","Ask the provider to confirm the read-back","Administer the drug"],
"The order is written, read back, confirmed, and only then given.",
"Giving the drug before the read-back skips the safety check.",I)

# Select-all
sata("safety-infection","suicide room hazards",5,
"A client on suicide precautions is moving into a room. The nurse is removing hazards.",
"Which items must be removed or locked away? Select all that apply.",
["Trash-can liners","IV tubing not in use","A plastic spoon with a meal tray that staff will observe","A belt left in the closet","The hospital pillowcase"],
["Trash-can liners","IV tubing not in use","A belt left in the closet"],
"Liners, tubing, and a belt can be used for self-harm and are removed.",
"An observed plastic spoon and a pillowcase are not the same class of hazard and are not the items this question is removing.",R)
sata("pharmacology-nursing","hold parameters",4,
"A nurse is deciding which findings require holding the drug and calling the provider.",
"Which findings require a hold? Select all that apply.",
["Apical pulse 50 before digoxin","Potassium 3.0 before IV furosemide","Respiratory rate 16 before a prescribed opioid","Blood pressure 84/48 before carvedilol","Pain score 7 before a nonopioid analgesic"],
["Apical pulse 50 before digoxin","Potassium 3.0 before IV furosemide","Blood pressure 84/48 before carvedilol"],
"A slow pulse before digoxin, severe hypokalemia before a loop diuretic, and shock-range pressure before a beta blocker are holds.",
"A respiratory rate of 16 and pain of 7 are not reasons to hold those particular doses.",I)
sata("reduction-risk","hemorrhage signs",4,
"A client is 1 hour after surgery. The nurse is identifying signs that need an immediate call.",
"Which findings need an immediate call? Select all that apply.",
["Heart rate 130 and blood pressure 86/50","Dressing saturated with bright blood","Client asking for water","Urine output 15 mL for the hour","Client rating pain 4 out of 10"],
["Heart rate 130 and blood pressure 86/50","Dressing saturated with bright blood","Urine output 15 mL for the hour"],
"Shock vitals, a soaked dressing, and very low urine output are bleeding or perfusion problems.",
"Thirst and moderate pain are expected and are not the emergency cluster.",J)
sata("basic-care-comfort","aspiration precautions",4,
"A client has dysphagia. The nurse is setting up the meal.",
"Which actions reduce aspiration? Select all that apply.",
["Sit the client upright","Give thin water through a straw","Stay with the client while eating","Offer nectar-thick liquids only if speech therapy ordered them","Lay the client flat immediately after two bites"],
["Sit the client upright","Stay with the client while eating","Offer nectar-thick liquids only if speech therapy ordered them"],
"Upright position, supervision, and the ordered thickness reduce aspiration.",
"A straw with thin liquids and lying flat push fluid toward the airway.",R)
sata("psychosocial","suicide assessment",5,
"A client says life is not worth living. The nurse is completing the immediate assessment.",
"Which questions are required now? Select all that apply.",
["Are you thinking of killing yourself?","Do you have a plan?","Do you have the means?","What is your favorite color?","Did you like breakfast?"],
["Are you thinking of killing yourself?","Do you have a plan?","Do you have the means?"],
"Intent, plan, and means decide how close the danger is.",
"Color and breakfast preferences do not assess suicide risk.",R)
sata("management-of-care","tasks that stay with the RN",4,
"The team includes an RN, an LPN, and assistive personnel. The nurse is keeping the tasks that cannot be delegated.",
"Which tasks stay with the RN? Select all that apply.",
["The admission assessment","IV push lorazepam","A stable client's bed bath","The first teaching about a new anticoagulant","Recording intake that assistive personnel already measured"],
["The admission assessment","IV push lorazepam","The first teaching about a new anticoagulant"],
"Assessment, IV push, and first teaching are RN responsibilities.",
"A stable bath and recording measured intake can be delegated.",R)

# More MCQs to reach category targets
extra = [
("safety-infection",4,"A client on droplet precautions is walking in the hall without a mask.","What does the nurse do?","Place a surgical mask on the client and return the client to the room","Ignore it because the hall is wide","Switch the client to airborne isolation only","Remove all precautions"),
("safety-infection",4,"A nurse's gloves tear while cleaning a C. difficile client.","What does the nurse do?","Remove the torn gloves, wash with soap and water, and put on a new pair","Use alcohol gel and continue","Wipe the gloves on the gown and keep them","Double the torn glove"),
("safety-infection",3,"The nurse is about to give a medication and the armband is missing.","What does the nurse do?","Stop and identify the client with two identifiers before giving the drug","Give it because the room number matches","Ask the roommate to confirm the name","Give it and replace the band later"),
("safety-infection",4,"A client with neutropenia has a fever of 38.3 C.","What does the nurse do?","Obtain cultures as ordered and start the antibiotic promptly, and keep the client protected from visitors who are ill","Wait until the next morning's lab draw","Give acetaminophen only and do not report the fever","Move an ill roommate into the room"),
("safety-infection",5,"A client is in restraints and the nurse finds the hand pale and cool.","What does the nurse do?","Release the restraint, stay with the client, and restore circulation","Tighten it so the hand stays still","Document the color and leave the restraint","Cover the hand and recheck in 2 hours"),
("basic-care-comfort",4,"A client with COPD is using pursed-lip breathing incorrectly and is panicked.","What does the nurse teach in the moment?","Breathe in through the nose and out slowly through pursed lips while sitting upright","Hold the breath as long as possible","Breathe rapidly through the mouth","Lie flat and take shallow gasps"),
("basic-care-comfort",3,"A client has dry mouth from oxygen by mask.","Which comfort measure is appropriate?","Provide oral moisture and care, and humidify the oxygen if ordered","Remove the oxygen so the mouth recovers","Give thin water if the client is on aspiration precautions without an order","Turn the oxygen above the ordered rate"),
("basic-care-comfort",4,"A client with a hip fracture is being positioned.","Which position is used before surgical repair if the provider has not ordered otherwise?","Keep the leg aligned and avoid extreme flexion and adduction","Cross the legs at the ankles","Sit the client in a low soft chair for hours","Flex the hip past 90 degrees for comfort"),
("basic-care-comfort",4,"A client receiving a tube feeding is coughing and the oxygen saturation falls.","What does the nurse do first?","Stop the feeding and sit the client up, then assess the airway","Speed the feeding","Lower the head of the bed","Give water through the tube"),
("reduction-risk",4,"A client's IV site is swollen, cool, and painful during a potassium infusion.","What does the nurse do?","Stop the infusion and assess for infiltration before restarting elsewhere","Slow the rate and leave the catheter","Flush the line hard","Apply heat and continue the same site"),
("reduction-risk",4,"A client after cardiac catheterization has a groin hematoma that is expanding.","What does the nurse do?","Apply direct pressure and call the provider","Have the client flex the hip repeatedly","Sit the client up and walk","Document and recheck at the end of the shift"),
("reduction-risk",5,"A client with a femur fracture suddenly becomes confused and has a petechial rash on the chest.","What does the nurse suspect and do?","Suspect fat embolism, give oxygen, and notify the provider","Start a high-fat meal","Ambulate the client immediately","Give a sedative and leave"),
("reduction-risk",4,"A client is 8 hours after a transurethral resection and the bladder irrigation is not flowing. The client has severe bladder pain.","What does the nurse do?","Check for kinks and clots and irrigate only as ordered, and notify the provider if pain and obstruction continue","Tell the client the pain is expected for a day","Remove the catheter","Speed the irrigation without looking at the tubing"),
("psychosocial",4,"A client with depression says the new antidepressant is not working on day 2.","Which teaching is accurate?","Many of these medicines take weeks, and the nurse will keep checking mood and suicidal thoughts","Stop the medicine today","Double the dose","The medicine should have worked within an hour"),
("psychosocial",4,"A manic client has not slept in two nights and is giving away money in the day room.","Which intervention is appropriate?","Decrease stimulation, offer finger foods and rest, and set simple limits","Encourage a group debate to use the energy","Give the client other clients' valuables to organize","Leave the client unsupervised in the gift shop"),
("psychosocial",3,"A client is crying after a new cancer diagnosis.","Which response is therapeutic?","Sit with the client and allow silence","Tell the client to be positive","Change the subject to discharge forms","Say that other clients have it worse"),
("psychosocial",5,"A client under a legal hold says they will leave and harm a named person tonight and has a specific plan.","What does the nurse do?","Notify the provider and the team so the threatened person and police can be warned as the law requires, and do not let the client leave","Keep the secret","Drive the client to the person's house","Document and do nothing else"),
("health-promotion",4,"A 66-year-old client who has never been screened asks about a bone-density test.","Which teaching is consistent with screening practice?","A bone-density test is recommended for women 65 and older","Screening starts at age 30 for everyone","A single X-ray of the hand replaces the test","Screening is useless after menopause"),
("health-promotion",3,"Parents ask how to reduce infant sleep deaths.","Which teaching is correct?","Supine sleep on a firm surface in the parents' room, not in the parents' bed","Prone sleep on a pillow","A soft bumper and a blanket","Sleeping on a couch"),
("health-promotion",4,"A client who smokes asks the single best step to lower heart risk.","Which advice does the nurse give?","Stop smoking, and offer help to quit","Switch to a low-tar brand and continue","Exercise once a month and keep smoking","Cut smoking only on weekends"),
("health-promotion",4,"An older adult's home has loose rugs and a dark hallway. The client has fallen once.","Which change does the nurse recommend first?","Remove the rugs, add a night light, and review medicines that cause dizziness","Buy a hospital bed before any other change","Restrict all walking","Use sedation at night so the client does not get up"),
("pharmacology-nursing",4,"A client on warfarin has an INR of 5.2 and no bleeding.","What does the nurse expect to do?","Hold warfarin and notify the provider rather than giving the dose","Give the dose with vitamin K food only","Double the next dose","Give an intramuscular injection of the same dose"),
("pharmacology-nursing",5,"A client taking an MAOI ate aged cheese and now has a blood pressure of 210/120 and a severe headache.","What does the nurse do?","Activate emergency care for hypertensive crisis and do not give more of the interacting food or drug","Have the client lie down at home and eat more cheese","Give a dose of the MAOI early","Offer a salty snack"),
("physiological-adaptation",4,"A client with asthma has a silent chest after loud wheezing, and is drowsy.","What does the nurse recognize?","Impending respiratory failure that needs immediate help and oxygen or ventilation support","Improvement because the wheeze stopped","A reason to start a walk","A reason to give a sedative"),
("management-of-care",4,"A nurse is unsure how to perform a new device skill. The client needs it this shift.","What does the nurse do?","Get a competent colleague or training before performing the skill","Try it alone to learn faster","Ask the client to do it","Skip the treatment"),
("management-of-care",5,"Two clients need the one remaining negative-pressure room. One has suspected tuberculosis. One has a closed fracture.","Who gets the room?","The client with suspected tuberculosis","The client with the fracture","Neither, leave the room empty","Whoever arrived first"),
("safety-infection",4,"A client with suspected tuberculosis is coughing in a regular clinic room.","What does the nurse do?","Place a surgical mask on the client and move the client to airborne isolation","Leave the door open for air","Seat the client in the waiting room","Use contact precautions only"),
("basic-care-comfort",3,"A client with a fever is shivering under one sheet.","Which comfort measure is appropriate?","Light covers and the ordered antipyretic, not heavy blankets that trap heat","Five heavy blankets","An ice bath without an order","No fluids at all"),
("reduction-risk",4,"A client reports sudden chest pain during a transfusion of the second unit. The first unit finished an hour ago.","What does the nurse do?","Stop the transfusion and assess airway, breathing, and circulation","Speed the unit","Ignore it because the first unit was fine","Give the pain pill and continue"),
]
for area, diff, scenario, question, right, wrong, wrong2, wrong3 in extra:
    mcq(area, scenario[:42], diff, scenario, question,
        [right, wrong, wrong2, wrong3],
        right, "This is the action that matches the risk in front of the nurse.",
        "The other choices delay care or increase harm.",
        R if area in ("management-of-care","psychosocial","basic-care-comfort","health-promotion") else (C if area=="safety-infection" else (I if area=="pharmacology-nursing" else (H if area=="physiological-adaptation" else J))))

print("fill_c done")
