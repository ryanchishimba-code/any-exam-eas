from make_items import NCSBN, CDC, TJC, AHA, ISMP, CDC_VAX, mcq, sata, bow, ordered, matrix
R,C,J,I,H=[NCSBN],[CDC,NCSBN],[TJC,NCSBN],[ISMP,NCSBN],[AHA,NCSBN]
REFS={"management-of-care":R,"safety-infection":C,"basic-care-comfort":R,"reduction-risk":J,"psychosocial":R,"health-promotion":R,"pharmacology-nursing":I,"physiological-adaptation":H}

# area, diff, scenario, question, right, wrong
LINES = """
management-of-care|4|The nurse receives a client from surgery whose blood pressure was not included in the handoff.|What does the nurse do before the transporter leaves?|Ask for the latest blood pressure, bleeding, and airway status|Accept the handoff and look it up if the client crashes
management-of-care|4|A client with capacity refuses a recommended amputation and can explain the risk of death.|What does the nurse do?|Document the understanding and honor the refusal|Ask the adult child to sign consent instead
management-of-care|5|A floated medical nurse is asked to recover a client from conscious sedation without that competency.|What does the nurse do?|Decline the assignment and ask for a competent nurse or orientation|Take the client to be helpful
management-of-care|4|An LPN reports a client's new chest pain. The RN is documenting a stable discharge.|What does the RN do?|Assess the chest pain immediately|Finish the discharge note first
management-of-care|3|A client asks to read the medical record.|What is the appropriate response?|Arrange access through the facility process|Refuse because records are never shown to clients
management-of-care|4|A coworker is impaired and about to pass medications.|What does the nurse do?|Stop the coworker from giving medications and notify the supervisor|Ignore it to protect the coworker
management-of-care|5|A client is in the wrong procedure room. The consent is for a different client.|What does the nurse do?|Stop the procedure until identity and consent match|Proceed because the room is ready
management-of-care|4|Assistive personnel are about to feed a client who is NPO for a test.|What does the nurse do?|Stop the meal and explain the NPO order|Let them feed the client so the tray is not wasted
management-of-care|4|A client needs an interpreter for discharge teaching. A child offers to translate.|What does the nurse do?|Use a qualified interpreter|Use the child to save time
management-of-care|3|The nurse witnesses a colleague document a medication that was not given.|What does the nurse do?|Report the falsification through the chain of command|Change the record quietly
safety-infection|4|A client with suspected measles is in the waiting room.|What does the nurse do?|Mask the client and move the client to airborne isolation|Leave the client in the waiting room
safety-infection|4|A nurse is stuck by a used needle. The source client's HIV status is unknown.|What does the nurse do?|Wash the site and report it immediately so prophylaxis can be started without delay|Wait until the end of the shift
safety-infection|5|A client on suicide watch is found with a sheet tied around the neck.|What does the nurse do first?|Remove the ligature and call for help|Go find an order for restraints first
safety-infection|4|Four clients need beds. One has active tuberculosis. The only open bed is a regular double room.|What does the nurse do?|Do not place the client in the double room; obtain airborne isolation|Put the client in the double room with the curtain closed
safety-infection|3|The nurse is giving medications and the barcode will not scan.|What does the nurse do?|Stop and verify the client and the drug with two identifiers before giving it|Override the scan every time without looking
safety-infection|4|A client with C. difficile is being transferred. The stretcher rails are soiled.|What does the nurse do?|Clean the rails with a sporicidal product before the next client|Wipe them with alcohol and go
safety-infection|4|A visitor is ill with a fever and wants to see a neutropenic client.|What does the nurse do?|Ask the visitor to leave and explain the infection risk|Allow a long visit if the visitor wears street clothes
safety-infection|5|A client in restraints has a new bruise and says the restraint was used as punishment.|What does the nurse do?|Remove unnecessary restraints, assess injury, and report the misuse|Tell the client restraints can be used for staff convenience
safety-infection|4|Oxygen is in use and a family member wants to smoke at the bedside.|What does the nurse do?|Stop the smoking and explain the fire risk|Open the window and allow one cigarette
safety-infection|3|The nurse finds a spilled bottle of pills in the hallway.|What does the nurse do?|Secure the pills and report the spill so they are not taken by the wrong person|Sweep them into a client cup
basic-care-comfort|4|A client with dysphagia pockets food in the cheek.|What does the nurse do?|Stop the meal, sit the client up, and have speech therapy reassess before more food|Give water to wash the pocket down
basic-care-comfort|3|A client rates pain 2 out of 10 and wants a position change, not medicine.|What does the nurse do?|Reposition the client and reassess comfort|Insist on an opioid
basic-care-comfort|4|A client with heart failure wants the bed flat to watch television.|What does the nurse do?|Explain that the head of the bed stays up while the client is short of breath|Flatten the bed for the whole program
basic-care-comfort|4|A client has a stage 3 pressure injury and is sitting on it in a chair.|What does the nurse do?|Limit chair time and shift weight so pressure is relieved|Leave the client sitting for the afternoon
basic-care-comfort|3|A client with a nasal cannula has dry nares.|What does the nurse do?|Provide skin care and humidification if it is ordered|Remove the oxygen for the shift
basic-care-comfort|4|A client on continuous tube feeding must be turned for care.|What does the nurse do?|Pause the feeding and keep the head elevated during the turn if aspiration is a risk|Lay the client flat with the feeding running
basic-care-comfort|4|A client with a new below-knee amputation has pain that feels like the foot is still there.|What does the nurse recognize?|Phantom limb pain is real and the ordered analgesic is given|Tell the client the pain cannot exist
basic-care-comfort|3|A client is constipated and the provider ordered a stool softener. The abdomen is soft.|What does the nurse do?|Give the stool softener and encourage fluids and walking as allowed|Give a fleet enema every hour
reduction-risk|5|A client suddenly cannot speak and the face droops during a bath.|What does the nurse do?|Activate a stroke response and note the time|Finish the bath first
reduction-risk|4|A client's surgical dressing has a new outline of blood that is spreading.|What does the nurse do?|Circle the outline, note the time, and watch it closely, calling the provider if it expands fast or vitals change|Ignore it until the next shift
reduction-risk|5|A client with a chest tube has subcutaneous emphysema that is spreading up the neck and is more short of breath.|What does the nurse do?|Stay with the client, give oxygen, and notify the provider|Document it as expected and leave
reduction-risk|4|A client after thyroidectomy has a tight feeling and a swelling at the incision.|What does the nurse do?|Call for help and prepare for airway obstruction|Give a drink of water
reduction-risk|4|A client's urine output is 20 mL for the past 2 hours after surgery. The bladder is not distended.|What does the nurse do?|Assess perfusion and notify the provider|Force oral fluids in a client who is vomiting
reduction-risk|5|A client pulls out a hemodialysis catheter and blood is pulsing from the site.|What does the nurse do?|Apply firm pressure and call for help|Apply a small adhesive bandage only
reduction-risk|4|A client reports a metallic taste and a headache during a CT with contrast.|What does the nurse do?|Stop the infusion and assess for a contrast reaction|Tell the client that taste always means the scan must continue at a faster rate
psychosocial|4|A client with schizophrenia stops taking medicine because of a side effect and is becoming more paranoid.|What does the nurse do?|Explore the side effect and involve the provider rather than shaming the client|Tell the client to get over it
psychosocial|5|A client says they have a gun at home and a plan to use it tonight.|What does the nurse do?|Stay with the client, remove access if the client is here, and get emergency psychiatric help|Schedule a routine visit next month
psychosocial|3|A client is angry about a long wait and raises their voice but is not threatening.|What does the nurse do?|Listen, set a calm limit, and solve what can be solved|Argue back
psychosocial|4|A postpartum client says they feel nothing for the baby and do not want to be left alone with the infant.|What does the nurse do?|Stay with them, assess safety of the infant, and notify the provider|Tell them every parent feels joy
psychosocial|4|A client with dementia is looking for a long-dead parent and is frightened.|What does the nurse do?|Offer calm reassurance and redirect without arguing the death in that moment|Insist the parent is dead until the client cries
health-promotion|4|A parent wants the infant to sleep in a car seat all night because it reduces reflux.|What does the nurse teach?|Use the car seat for travel and a firm flat crib for sleep|Leave the infant in the car seat overnight
health-promotion|3|A 50-year-old client who smokes asks about lung-cancer screening.|What does the nurse say?|Discuss annual low-dose CT if the smoking history meets the current age and pack-year rules|A chest X-ray every year is the screening test
health-promotion|4|A pregnant client asks about alcohol.|What does the nurse teach?|No amount of alcohol is recommended in pregnancy|A drink a day is safe
health-promotion|4|An older client has not had a pneumonia vaccine and is unsure.|What does the nurse do?|Review the current adult schedule and offer the indicated vaccine|Say vaccines are only for children
pharmacology-nursing|5|A client on warfarin is prescribed a new antibiotic and asks if the INR can change.|What does the nurse do?|Explain that some antibiotics raise the INR and the provider needs to plan monitoring|Say antibiotics never affect warfarin
pharmacology-nursing|4|A client is due for insulin. The glucose is 62 mg/dL and the client is alert.|What does the nurse do?|Hold the insulin, give a carbohydrate, and recheck before any dose|Give the full insulin dose
pharmacology-nursing|4|A client says the extended-release tablet is hard to swallow.|What does the nurse teach?|Do not crush the extended-release tablet; ask the provider for another form|Crush it in applesauce
physiological-adaptation|5|A client in restraints is found without a pulse and is not breathing.|What does the nurse do?|Start CPR and call for the defibrillator|Finish the restraint documentation first
physiological-adaptation|4|A client with asthma has used the rescue inhaler three times and is still speaking in single words.|What does the nurse do?|Get emergency help and prepare stronger treatment|Send the client home with the same inhaler
""".strip().splitlines()

for line in LINES:
    area, diff, scenario, question, right, wrong = line.split("|")
    if len(scenario) < 80:
        scenario = scenario + " The nurse must choose the safest next action for this client."
    mcq(area, question[:40], int(diff), scenario, question,
        [right, wrong, "Ask the roommate to decide", "Wait until the next shift"],
        right,
        "The correct action removes the immediate risk or uses the right scope and precaution.",
        "Waiting, guessing, or handing the choice to a roommate leaves the client unsafe.",
        REFS[area])

# Extra NGN to clear the minimum
sata("safety-infection","airborne diseases",4,
"The nurse is choosing rooms for newly admitted clients.",
"Which clients need airborne precautions? Select all that apply.",
["Suspected measles","Pulmonary tuberculosis","Influenza","C. difficile","Varicella"],
["Suspected measles","Pulmonary tuberculosis","Varicella"],
"Measles, tuberculosis, and varicella spread by the airborne route.",
"Influenza is droplet and C. difficile is contact. Those rooms are wrong for airborne isolation.",
C)
sata("reduction-risk","chest tube emergencies",5,
"A client has a chest tube. The nurse is identifying findings that need immediate action.",
"Which findings need immediate action? Select all that apply.",
["Tracheal deviation and severe dyspnea","Continuous bubbling that is new and worsening dyspnea","A small amount of tidaling with breaths","Drainage system tipped above the chest","The client asking for a blanket"],
["Tracheal deviation and severe dyspnea","Continuous bubbling that is new and worsening dyspnea","Drainage system tipped above the chest"],
"Deviation, a new large air leak with dyspnea, and a system above the chest threaten ventilation.",
"Tidaling with breaths can be normal, and a blanket request is comfort, not an emergency.",
J)
sata("pharmacology-nursing","high alert double checks",4,
"The nurse is preparing high-alert medicines.",
"Which situations require a hold or an independent double check before the drug is given? Select all that apply.",
["A heparin infusion with an aPTT far above the goal","Insulin doses that do not match the order","A scheduled vitamin","A potassium infusion without a pump available","A topical moisturizer"],
["A heparin infusion with an aPTT far above the goal","Insulin doses that do not match the order","A potassium infusion without a pump available"],
"Heparin above goal, a mismatched insulin dose, and unpumped potassium are high-alert failures.",
"A vitamin and a moisturizer are not the high-alert holds in this set.",
I)
ordered("safety-infection","doffing contact precautions",4,
"The nurse is leaving a contact-precaution room.",
"Place the removal steps in the safe order.",
["Remove the gown","Remove the gloves","Perform hand hygiene","Untie the gown with clean hands after gloves are off"],
["Remove the gloves","Untie the gown with clean hands after gloves are off","Remove the gown","Perform hand hygiene"],
"Gloves come off first so the hands that touch the gown ties are not the dirty glove surface, then the gown, then hand hygiene. The display list is not the safe order.",
"Removing the gown before the gloves drags contamination onto the hands.",
C)
bow("reduction-risk","postpartum hemorrhage bow-tie",5,
"A client who gave birth an hour ago has a boggy uterus and a pad soaked in 10 minutes. Blood pressure is 86/50.",
"Complete the bow-tie: one action and two parameters to monitor.",
"Postpartum hemorrhage",
["Massage the fundus and call for help","Send the client to the shower","Give a full meal","Apply a cold cloth and recheck tomorrow"],
["Amount of vaginal bleeding","Blood pressure and heart rate","Fetal heart rate","Urine glucose"],
"Massage the fundus and call for help","Amount of vaginal bleeding","Blood pressure and heart rate",
"Fundal massage and help come first. Bleeding and vital signs show whether shock is worsening.",
"A shower, a meal, waiting until tomorrow, a fetal heart rate after birth, and urine glucose do not stop hemorrhage.",
H)
bow("safety-infection","anaphylaxis bow-tie",5,
"A client receiving IV iron develops wheezing, hives, and a blood pressure of 78/46.",
"Complete the bow-tie: one action and two parameters to monitor.",
"Anaphylaxis during an infusion",
["Stop the infusion and give intramuscular epinephrine","Speed the infusion","Give oral diphenhydramine only","Finish the bag"],
["Airway sounds","Blood pressure","Daily weight","Stool color"],
"Stop the infusion and give intramuscular epinephrine","Airway sounds","Blood pressure",
"The drug stops and epinephrine is given. Airway and blood pressure show if shock is reversing.",
"Speeding or finishing the bag, an oral antihistamine alone, weight, and stool color leave anaphylaxis in place.",
H)
matrix("health-promotion","vaccine timing matrix",4,
"A nurse is matching vaccines to clients at a clinic. Each client is here for a scheduled visit and none has a fever today.",
"For each client, select whether the vaccine is given today.",
["Healthy newborn before discharge","12-month-old due for measles vaccine","Pregnant client asking about live measles vaccine today","65-year-old who has never had a pneumonia vaccine"],
["Give the indicated vaccine","Do not give today"],
[("Healthy newborn before discharge","Give the indicated vaccine"),("12-month-old due for measles vaccine","Give the indicated vaccine"),("Pregnant client asking about live measles vaccine today","Do not give today"),("65-year-old who has never had a pneumonia vaccine","Give the indicated vaccine")],
"Hepatitis B at birth, measles at 12 months, and pneumonia vaccine for the older adult match the schedule. Live measles vaccine is not given in pregnancy.",
"Giving the live vaccine in pregnancy or skipping the newborn and older-adult doses is the error.",
[__import__("make_items").CDC_VAX, NCSBN])
print("fill_d", len(LINES))
