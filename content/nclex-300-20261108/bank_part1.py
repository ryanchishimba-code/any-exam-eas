from make_items import NCSBN, CDC, TJC, AHA, SSC, ADA, ISMP, CDC_VAX, mcq, sata, bow, matrix, ordered, case

R = [NCSBN]
C = [CDC, NCSBN]
J = [TJC, NCSBN]
H = [AHA, NCSBN]
S = [SSC, NCSBN]
D = [ADA, NCSBN]
I = [ISMP, NCSBN]
V = [CDC_VAX, NCSBN]

# --- Management of Care ---
mcq("management-of-care","delegation to assistive personnel",4,
"Four clients are assigned at 0730. One unlicensed assistive person is available. A client who had a stroke yesterday needs a bed bath and has a stable Glasgow score of 15. A second client needs a first postoperative dressing change. A third needs a new IV catheter. A fourth needs intake and output recorded.",
"Which task is appropriate to delegate to the assistive personnel?",
["The first dressing change","Starting the IV catheter","Recording intake and output","Teaching the stroke client about aspiration"],
"Recording intake and output",
"Intake and output is a stable measurement task within assistive-personnel scope when the nurse has assessed the client.",
"A first dressing change, IV insertion, and initial teaching are nursing assessments or invasive skills and stay with the nurse.",
R)
mcq("management-of-care","who to see first",5,
"The nurse has just received report on four clients. One is 2 hours after a thyroidectomy and now has a harsh high-pitched sound on inspiration. One asks for a PRN stool softener. One has a blood glucose of 168 mg/dL before lunch and a sliding-scale order. One wants the discharge papers explained again.",
"Which client does the nurse see first?",
["The client asking for a stool softener","The client with a glucose of 168 mg/dL","The client who wants discharge teaching repeated","The client with the harsh inspiratory sound"],
"The client with the harsh inspiratory sound",
"Stridor after thyroidectomy is airway obstruction until the nurse is at the bedside. Airway comes before routine medications and teaching.",
"A stool softener, a glucose of 168, and repeat teaching are not immediate airway threats.",
R)
mcq("management-of-care","informed consent witness",4,
"A client is scheduled for a cardiac catheterization. The cardiologist has not yet discussed risks. The client asks the nurse to explain the chance of stroke and then sign the consent so the procedure is not delayed.",
"Which action does the nurse take?",
["Explain the stroke risk and sign as the witness","Ask the cardiologist to return and complete the discussion before the nurse witnesses the signature","Have the client sign and write that teaching was deferred","Tell the client the risk is too small to review"],
"Ask the cardiologist to return and complete the discussion before the nurse witnesses the signature",
"The nurse may witness a signature and confirm that the client was informed. The nurse does not replace the practitioner who is responsible for explaining procedure-specific risks.",
"Signing before that discussion, minimizing the risk, or documenting that teaching was skipped leaves the consent incomplete.",
R)
mcq("management-of-care","advance directive versus family",5,
"A client with decision-making capacity has a signed advance directive refusing intubation. The client is now tiring from pneumonia and still refuses a tube. An adult child at the bedside demands that the team intubate.",
"Which action is correct?",
["Intubate because the child is the next of kin","Follow the client's refusal and the advance directive","Ask the child to sign a new consent that overrides the directive","Sedate the client and intubate while the refusal is being discussed"],
"Follow the client's refusal and the advance directive",
"A capacitated client's current refusal controls. An advance directive supports that refusal. Family disagreement does not replace it.",
"Intubation over a current refusal, a child's signature, or sedation to bypass the refusal are not authorized.",
R)
mcq("management-of-care","confidentiality and a caller",4,
"A person who says they are the client's spouse calls the nurses' station and asks for the results of today's biopsy. The client has not authorized any disclosure. The spouse is not listed on the release.",
"Which response is appropriate?",
["Read the biopsy result because spouses are automatically entitled to it","Say that information cannot be released without the client's permission","Leave the result on the spouse's voicemail","Confirm the diagnosis but not the stage"],
"Say that information cannot be released without the client's permission",
"Diagnosis and test results are protected. Relationship alone is not authorization.",
"Reading the result, leaving a voicemail, or confirming the diagnosis still discloses protected information.",
R)
mcq("management-of-care","refusal with capacity",4,
"A client with capacity understands that leaving before antibiotics for pyelonephritis risks sepsis. The client can repeat that risk and still wants to go home. The client is not suicidal.",
"Which action is appropriate?",
["Restrain the client until the next antibiotic dose","Document the discussion, offer prescriptions and return instructions, and let the client leave","Tell the client that leaving cancels all future care","Give the antibiotic by force and then discharge"],
"Document the discussion, offer prescriptions and return instructions, and let the client leave",
"A capacitated refusal is honored after the risk is understood. The nurse documents and keeps a safe way back.",
"Restraints, a ban on future care, and forced medication are not the response to a capacitated refusal.",
R)
mcq("management-of-care","disaster triage",5,
"A nurse is the first clinician at a bus crash. One victim is not breathing after the airway is opened and has no pulse. One has a bleeding thigh that stops with a pressure dressing and can walk after that. One has chest pain and a respiratory rate of 32. One has a broken wrist and is walking.",
"Which victim is tagged immediate, or red?",
["The victim with no pulse after the airway is opened","The walking victim with a broken wrist","The victim with chest pain and a respiratory rate of 32","The victim whose bleeding stopped and who can walk"],
"The victim with chest pain and a respiratory rate of 32",
"In simple triage, a high respiratory rate with signs of shock risk is immediate. A pulseless victim who does not resume breathing after the airway is opened is expectant when resources are overwhelmed. Walking wounded are minimal.",
"Treating the expectant victim first, or the walking wounded, delays the person who can still be saved by immediate care.",
R)
mcq("management-of-care","handoff missing a critical fact",4,
"A nurse receives a telephone handoff that omits the client's allergy and code status. The sending nurse is about to hang up because the ambulance is leaving.",
"Which statement is the best response?",
["Accept the report and look up the allergy later if there is time","Ask the sending nurse to state allergies and code status before the call ends","Document that the handoff was complete","Ask the ambulance driver to recall the code status"],
"Ask the sending nurse to state allergies and code status before the call ends",
"A handoff is not complete until critical safety facts are exchanged. The receiving nurse closes that gap before the source of the information is gone.",
"Deferring the allergy, calling the report complete, or asking the driver substitutes an unreliable source.",
R)
mcq("management-of-care","floating nurse assignment",5,
"A medical-surgical nurse is floated to the postpartum unit for one shift and has not had obstetric orientation. The charge nurse is making assignments.",
"Which assignment is safest?",
["A client who is being admitted in active labor","A stable 1-day postpartum client who needs routine assessments and discharge teaching the obstetric nurse has already started","A client with magnesium sulfate for severe preeclampsia","A client recovering from an emergency cesarean with a draining incision"],
"A stable 1-day postpartum client who needs routine assessments and discharge teaching the obstetric nurse has already started",
"A floated nurse should receive stable clients whose needs match medical-surgical skills. Unstable obstetric complications and active labor stay with obstetric nurses.",
"Labor, magnesium sulfate, and a fresh complicated postoperative course require specialty judgment the float nurse has not been oriented to perform.",
R)
mcq("management-of-care","incident report versus the chart",4,
"A nurse gives 4 units of insulin instead of 2 units. The client's glucose is rechecked and treated, and the client recovers. The nurse is documenting.",
"Which documentation is appropriate?",
["Write the error only in the incident report and leave the medical record blank","Record the dose given, the glucose, and the treatment in the medical record, and complete a separate incident report","Alter the medication administration record to show 2 units","Chart that the client requested the extra dose"],
"Record the dose given, the glucose, and the treatment in the medical record, and complete a separate incident report",
"The record states facts of care. The incident report is the quality tool and is not a substitute for the record, and the record is not altered.",
"Leaving the record blank, changing the dose, or inventing a client request falsifies or hides the event.",
R)

print("part1 constructors ready", len(__import__("make_items").ITEMS))
