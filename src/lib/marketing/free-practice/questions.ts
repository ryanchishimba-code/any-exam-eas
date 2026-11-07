/* Static seed from read-only selects of active, qaPassed, student-eligible bank rows.
 * Question text is the served stem, key, and rationale. Do not invent a citation.
 */
export type FreePracticeQuestion = {
  id: string;
  stem: string;
  options: string[];
  answer: string;
  rationale: string;
  sources: string[];
  difficulty: number;
  topic: string | null;
  step: string | null;
};

export const FREE_PRACTICE_QUESTIONS: Record<
  "nclex" | "naplex" | "pance" | "aanp-fnp" | "usmle" | "npte-pt",
  FreePracticeQuestion[]
> = {
  "nclex": [
    {
      "id": "cmr7j7u2m007t1y66jk9upnts",
      "stem": "A 35-year-old nurse is preparing to enter the room of a client with suspected tuberculosis. The client is in a negative pressure room and has a persistent cough.\n\nWhich nursing action is most appropriate?",
      "options": [
        "Wear a surgical mask before entering the room.",
        "Wear an N95 respirator before entering the room.",
        "Wear a face shield and gloves before entering the room.",
        "Wear a gown and gloves before entering the room."
      ],
      "answer": "Wear an N95 respirator before entering the room.",
      "rationale": "An N95 respirator is required for airborne precautions, which are necessary for clients with suspected tuberculosis. Surgical masks, face shields, and gowns do not provide adequate protection against airborne pathogens.\n\nClinical reasoning: Recognize Cues: Client with suspected TB in negative pressure room. Analyze Cues: TB requires airborne precautions. Prioritize Hypotheses: Prevent airborne transmission. Generate Solutions: Use N95 respirator. Take Action: Wear N95 before entry. Evaluate Outcomes: Reduce risk of TB transmission.\n\nWhy other options are incorrect:\n• Wear a surgical mask before entering the room.: Incorrect — Surgical masks do not provide adequate protection against airborne pathogens.\n• Wear a face shield and gloves before entering the room.: Incorrect — Face shields and gloves do not protect against airborne transmission.\n• Wear a gown and gloves before entering the room.: Incorrect — Gowns and gloves do not protect against airborne transmission.",
      "sources": [
        "OpenStax / LibreTexts — Basic Care & Comfort Open RN Fundamentals textbook chapter practice problems"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8stsej00801y9nupi3h4zs",
      "stem": "A 45-year-old female with a history of type 2 diabetes is admitted for a scheduled cholecystectomy. She is anxious about the surgery and expresses concern about managing her diabetes postoperatively.\n\nWhich nursing action is most appropriate?",
      "options": [
        "Provide reassurance and explain the surgical procedure in detail",
        "Arrange a consultation with a diabetes educator before discharge",
        "Administer a sedative to help the client relax before surgery",
        "Discuss the importance of blood glucose monitoring postoperatively"
      ],
      "answer": "Discuss the importance of blood glucose monitoring postoperatively",
      "rationale": "Discussing the importance of blood glucose monitoring postoperatively is the most appropriate action to address the client's concern about managing diabetes after surgery. This education empowers the client to actively participate in her care and manage her condition effectively. Providing reassurance and explaining the procedure addresses anxiety but does not specifically address diabetes management. Arranging a consultation with a diabetes educator is beneficial but not immediately necessary. Administering a sedative may help with anxiety but does not address the client's specific concern.\n\nClinical reasoning: Recognize Cues: Client's concern about diabetes management. Analyze Cues: Anxiety related to postoperative diabetes control. Prioritize Hypotheses: Need for education on diabetes management. Generate Solutions: Provide education on blood glucose monitoring. Take Action: Educate client on postoperative diabetes care. Evaluate Outcomes: Client demonstrates understanding and readiness for self-care.\n\nWhy other options are incorrect:\n• Provide reassurance and explain the surgical procedure in detail: Incorrect — This addresses anxiety but not the specific concern of diabetes management.\n• Arrange a consultation with a diabetes educator before discharge: Incorrect — Beneficial but not immediately necessary for addressing current concerns.\n• Administer a sedative to help the client relax before surgery: Incorrect — May alleviate anxiety but does not address diabetes management concerns.",
      "sources": [
        "OpenStax / LibreTexts — Management of Care Open RN"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8o3g0000bp1yh60wd8ndk8",
      "stem": "A 45-year-old female client with a history of type 2 diabetes and hypertension is admitted to the medical-surgical unit following a right total knee arthroplasty. She is currently 4 hours post-op and reports severe pain at the surgical site despite receiving scheduled analgesics. Her vital signs are stable, but she appears anxious and requests to speak with the nurse manager about her care.\n\nWhich nursing action is most appropriate?",
      "options": [
        "Discuss the client's concerns and facilitate a meeting with the nurse manager.",
        "Administer an additional dose of pain medication as requested by the client.",
        "Encourage the client to wait until the scheduled time for the next pain medication.",
        "Inform the client that the nurse manager is unavailable and will address concerns later."
      ],
      "answer": "Discuss the client's concerns and facilitate a meeting with the nurse manager.",
      "rationale": "Facilitating a meeting with the nurse manager addresses the client's request and supports client advocacy, ensuring the client's concerns are heard and addressed. Administering additional pain medication without a provider's order is unsafe. Encouraging the client to wait may not address the underlying issue of anxiety or dissatisfaction with care. Informing the client that the manager is unavailable dismisses her concerns and may increase anxiety.\n\nClinical reasoning: Recognize Cues: Client's request to speak with the nurse manager indicates a concern beyond pain management. Analyze Cues: Client's anxiety and dissatisfaction with care need addressing. Prioritize Hypotheses: Advocacy and communication are priorities. Generate Solutions: Facilitate communication with the nurse manager. Take Action: Arrange the meeting. Evaluate Outcomes: Client feels heard and supported.\n\nWhy other options are incorrect:\n• Administer an additional dose of pain medication as requested by the client.: Incorrect — Administering extra medication without an order is unsafe and does not address the client's request for advocacy.\n• Encourage the client to wait until the scheduled time for the next pain medication.: Incorrect — This option does not address the client's immediate concerns and may increase anxiety.\n• Inform the client that the nurse manager is unavailable and will address concerns later.: Incorrect — Dismissing the client's request may lead to increased dissatisfaction and anxiety.",
      "sources": [
        "OpenStax / LibreTexts — Management of Care Open RN Nursing Leadership"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr7hagnu004w1yx3ogpl25gj",
      "stem": "An 82-year-old female client with a history of osteoporosis is admitted to the hospital after a fall at home. She is confused and has a bruise on her right hip. The nurse is preparing to implement fall prevention strategies.\n\nWhich nursing action is most appropriate?",
      "options": [
        "Apply a bed alarm to alert staff if the client attempts to get up.",
        "Keep the side rails up at all times to prevent falls.",
        "Place the client in a wheelchair with a seatbelt to prevent falls.",
        "Encourage the client to use a walker for ambulation."
      ],
      "answer": "Apply a bed alarm to alert staff if the client attempts to get up.",
      "rationale": "Applying a bed alarm is an appropriate fall prevention strategy for a confused client. It alerts staff if the client attempts to get up, allowing for timely assistance and reducing the risk of falls. This intervention respects the client's autonomy and safety.\n\nClinical reasoning: Recognize Cues: Client is confused and has a fall history. Analyze Cues: Risk of falls is high due to confusion and osteoporosis. Prioritize Hypotheses: Preventing falls is critical. Generate Solutions: Implement bed alarm for timely assistance. Take Action: Apply bed alarm. Evaluate Outcomes: Monitor for fall prevention effectiveness.\n\nWhy other options are incorrect:\n• Keep the side rails up at all times to prevent falls.: Incorrect — Full side rails can be considered a restraint and may increase fall risk if the client attempts to climb over them.\n• Place the client in a wheelchair with a seatbelt to prevent falls.: Incorrect — This can be considered a restraint and limits the client's mobility unnecessarily.\n• Encourage the client to use a walker for ambulation.: Incorrect — While beneficial, a walker does not address the immediate risk of falls when the client is confused and in bed.",
      "sources": [
        "OpenStax / LibreTexts — Fall Prevention"
      ],
      "difficulty": 3,
      "topic": "fall prevention",
      "step": null
    },
    {
      "id": "cmr8rum0n00bn1ye3rknlqwd1",
      "stem": "A 72-year-old female client is admitted to the medical-surgical unit following a hip replacement surgery. She is currently on postoperative day 1. Her vital signs are stable, but she reports severe pain in her right hip and is unable to participate in physical therapy. The nurse notes that the client is reluctant to use the incentive spirometer and has diminished breath sounds in the bases bilaterally.\n\nWhich action should the nurse take first?",
      "options": [
        "Administer the prescribed opioid analgesic to manage pain.",
        "Encourage the client to use the incentive spirometer every hour.",
        "Assist the client in ambulating to the bathroom with a walker.",
        "Notify the healthcare provider about the client's diminished breath sounds."
      ],
      "answer": "Administer the prescribed opioid analgesic to manage pain.",
      "rationale": "The correct action is to administer the prescribed opioid analgesic to manage the client's pain. Effective pain management is crucial to enable participation in physical therapy and the use of the incentive spirometer, which are essential for preventing postoperative complications such as atelectasis. While encouraging the use of the incentive spirometer is important, it may not be effective if the client is in severe pain. Assisting with ambulation and notifying the healthcare provider are also important but should follow pain management.\n\nClinical reasoning: Recognize Cues: Severe pain, reluctance to use incentive spirometer, diminished breath sounds. Analyze Cues: Pain is a barrier to effective postoperative recovery. Prioritize Hypotheses: Pain management is the immediate priority to enable participation in recovery activities. Generate Solutions: Administer prescribed analgesics. Take Action: Provide pain relief. Evaluate Outcomes: Assess pain relief and encourage participation in therapy.\n\nWhy other options are incorrect:\n• Encourage the client to use the incentive spirometer every hour.: Incorrect — Without adequate pain control, the client is unlikely to comply with incentive spirometry.\n• Assist the client in ambulating to the bathroom with a walker.: Incorrect — Ambulation is important but may not be possible until pain is managed.\n• Notify the healthcare provider about the client's diminished breath sounds.: Incorrect — While diminished breath sounds are concerning, they are likely due to atelectasis from inadequate incentive spirometry use, which can be addressed by managing pain first.",
      "sources": [
        "Open RN Project"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8otxcc006e1y5nuw771tit",
      "stem": "A 45-year-old female client is admitted to the medical-surgical unit following a cholecystectomy. She is currently on bed rest and has a nasogastric tube in place. Her vital signs are stable, but she reports severe abdominal pain rated 8/10 despite receiving morphine 2 mg IV. The nurse notes that the client's abdomen is distended and firm.\n\nWhich action should the nurse take first?",
      "options": [
        "Assess the nasogastric tube for patency and proper placement",
        "Administer an additional dose of morphine as prescribed",
        "Notify the healthcare provider of the client's abdominal distention",
        "Encourage the client to ambulate to relieve gas pain"
      ],
      "answer": "Assess the nasogastric tube for patency and proper placement",
      "rationale": "The correct action is to assess the nasogastric tube for patency and proper placement. The client's abdominal distention and pain may be due to a blockage or displacement of the tube, which can lead to increased discomfort and potential complications. Ensuring the tube is functioning properly can help alleviate symptoms. Administering more morphine without addressing the underlying issue may mask symptoms but not resolve the problem. Notifying the provider is important if the issue persists, but initial assessment is crucial. Encouraging ambulation may help with gas pain but is not appropriate until the cause of the distention is addressed.\n\nClinical reasoning: Recognize cues: severe pain, distended abdomen, NG tube in place. Analyze cues: potential NG tube blockage or displacement causing symptoms. Prioritize hypotheses: tube malfunction as immediate concern. Generate solutions: assess tube function. Take action: check patency and placement. Evaluate outcomes: symptom relief if tube issue resolved.\n\nWhy other options are incorrect:\n• Administer an additional dose of morphine as prescribed: Incorrect — This option addresses pain but does not resolve the potential underlying issue of NG tube malfunction.\n• Notify the healthcare provider of the client's abdominal distention: Incorrect — Notifying the provider is necessary if the issue persists, but initial assessment of the tube should be prioritized.\n• Encourage the client to ambulate to relieve gas pain: Incorrect — Ambulation may help with gas pain but is not appropriate until the cause of the distention is addressed.",
      "sources": [
        "NCSBN NCLEX-RN Test Plan / Clinical Judgment Measurement Model"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8u24yg00651y0yp0cn67c2",
      "stem": "A 45-year-old male client is admitted to the medical-surgical unit following a motor vehicle accident. He has multiple fractures and is in a cervical collar. The client is alert and oriented but expresses concern about his ability to make decisions if he becomes incapacitated.\n\nWhich action should the nurse take first regarding the client's concern about decision-making?",
      "options": [
        "Provide information about advance directives and assist in completing them",
        "Reassure the client that the healthcare team will make decisions in his best interest",
        "Encourage the client to discuss his concerns with family members",
        "Document the client's concerns in the medical record"
      ],
      "answer": "Provide information about advance directives and assist in completing them",
      "rationale": "The correct action is to provide information about advance directives and assist the client in completing them. This empowers the client to make informed decisions about his future healthcare preferences and ensures his wishes are respected if he becomes incapacitated. Reassuring the client without addressing his concern does not resolve the issue, and while discussing with family is helpful, the priority is ensuring the client understands and can document his wishes. Documentation is important but secondary to addressing the client's immediate concern.\n\nClinical reasoning: Recognize Cues: Client expresses concern about decision-making if incapacitated. Analyze Cues: Client's concern indicates a need for information on advance directives. Prioritize Hypotheses: Client empowerment and autonomy are priorities. Generate Solutions: Provide information on advance directives. Take Action: Assist in completing advance directives. Evaluate Outcomes: Client's wishes are documented and respected.\n\nWhy other options are incorrect:\n• Reassure the client that the healthcare team will make decisions in his best interest: Incorrect — This option does not address the client's concern about personal autonomy and decision-making.\n• Encourage the client to discuss his concerns with family members: Incorrect — While involving family can be supportive, the immediate priority is providing information about advance directives.\n• Document the client's concerns in the medical record: Incorrect — Documentation is important but does not address the client's immediate need for information and decision-making support.",
      "sources": [
        "Open RN Project"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8tu8dg004j1y0y0fg3nrtk",
      "stem": "A 45-year-old female with a history of type 2 diabetes and hypertension is admitted to the medical unit for management of hyperglycemia. She reports feeling fatigued and has been experiencing frequent urination and increased thirst. Her current medications include metformin and lisinopril. Vital signs are stable, but blood glucose is 320 mg/dL.\n\nWhich action should the nurse take first?",
      "options": [
        "Administer the prescribed insulin aspart subcutaneously",
        "Encourage the client to drink water to prevent dehydration",
        "Notify the healthcare provider about the elevated blood glucose",
        "Teach the client about the importance of diet in managing diabetes"
      ],
      "answer": "Administer the prescribed insulin aspart subcutaneously",
      "rationale": "The correct action is to administer the prescribed insulin aspart subcutaneously. This will help to lower the client's blood glucose level, which is critically high at 320 mg/dL. Administering insulin is a priority to prevent complications such as diabetic ketoacidosis. Encouraging fluid intake is important but secondary to insulin administration. Notifying the provider is not immediately necessary as the nurse can manage hyperglycemia with prescribed insulin. Teaching about diet is important but not the immediate priority.\n\nClinical reasoning: Recognize Cues: Elevated blood glucose of 320 mg/dL. Analyze Cues: Risk of hyperglycemia complications. Prioritize Hypotheses: Immediate need to lower blood glucose. Generate Solutions: Administer insulin. Take Action: Administer insulin aspart. Evaluate Outcomes: Monitor blood glucose for improvement.\n\nWhy other options are incorrect:\n• Encourage the client to drink water to prevent dehydration: Incorrect — While preventing dehydration is important, it does not directly address the immediate need to lower blood glucose.\n• Notify the healthcare provider about the elevated blood glucose: Incorrect — The nurse can manage the elevated blood glucose with prescribed insulin without immediate provider notification.\n• Teach the client about the importance of diet in managing diabetes: Incorrect — Education is important for long-term management but is not the immediate priority in acute hyperglycemia.",
      "sources": [
        "OpenStax / LibreTexts — Health Promotion"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr8vubha00791yabw3d10u0h",
      "stem": "A 45-year-old female client is admitted to the medical-surgical unit following a total abdominal hysterectomy. She is receiving postoperative care and has a Foley catheter in place. The nurse notes that the client's urine output has decreased to 20 mL over the past hour, and the client reports feeling bloated and uncomfortable.\n\nWhich intervention is the priority for this client?",
      "options": [
        "Check the patency of the Foley catheter.",
        "Increase the client's oral fluid intake.",
        "Administer prescribed pain medication.",
        "Notify the healthcare provider immediately."
      ],
      "answer": "Check the patency of the Foley catheter.",
      "rationale": "Checking the patency of the Foley catheter is the priority intervention because decreased urine output and a feeling of bloating may indicate a blockage or kink in the catheter. Ensuring the catheter is patent can quickly resolve the issue and prevent further complications. Increasing oral fluid intake is not appropriate until catheter patency is confirmed. Administering pain medication does not address the underlying issue, and notifying the provider is premature without first assessing the catheter.\n\nClinical reasoning: Recognize Cues: Decreased urine output, client discomfort. Analyze Cues: Possible catheter blockage. Prioritize Hypotheses: Blocked catheter is the immediate concern. Generate Solutions: Check catheter patency. Take Action: Assess catheter. Evaluate Outcomes: Urine output should increase if blockage is resolved.\n\nWhy other options are incorrect:\n• Increase the client's oral fluid intake.: Incorrect — Increasing fluid intake is not appropriate until catheter patency is confirmed, as the issue may be mechanical rather than fluid-related.\n• Administer prescribed pain medication.: Incorrect — Pain medication does not address the underlying issue of decreased urine output.\n• Notify the healthcare provider immediately.: Incorrect — Notifying the provider is premature without first assessing and addressing potential catheter issues.",
      "sources": [
        "Open RN Project"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmqwuqmiu00021yx12ngqhxt7",
      "stem": "A nurse is caring for a client who is being treated for a urinary tract infection (UTI). The nurse is preparing to implement standard precautions and is reviewing the client's laboratory results. The client has a positive urine culture for Escherichia coli and is currently receiving antibiotics.\n\nWhich action should the nurse take first?",
      "options": [
        "Ensure the client is wearing a mask",
        "Perform hand hygiene before and after client contact",
        "Use gloves when handling the client's urine specimen",
        "Educate the client about the importance of completing the antibiotic course"
      ],
      "answer": "Perform hand hygiene before and after client contact",
      "rationale": "Performing hand hygiene is the most critical action in preventing the spread of infection. It is the foundation of standard precautions and should always be prioritized before and after any client contact. While the other actions are important, they do not take precedence over hand hygiene.\n\nClinical reasoning: 1. Recognize Cues: Identify the need for infection control measures. 2. Analyze Cues: Understand that hand hygiene is essential in preventing infection transmission. 3. Prioritize Hypotheses: Hand hygiene is the first line of defense against infection. 4. Generate Solutions: Implement hand hygiene protocols. 5. Take Action: Perform hand hygiene consistently. 6. Evaluate Outcomes: Monitor compliance with hand hygiene practices.\n\nWhy other options are incorrect:\n• Ensure the client is wearing a mask: Incorrect — This is not necessary for a UTI unless respiratory symptoms are present.\n• Use gloves when handling the client's urine specimen: Incorrect — While gloves are necessary, they do not replace the need for hand hygiene.\n• Educate the client about the importance of completing the antibiotic course: Incorrect — Education is important but should not take precedence over hand hygiene.",
      "sources": [
        "NCSBN NCLEX-RN Test Plan",
        "Open RN Project"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    }
  ],
  "naplex": [
    {
      "id": "cmr0qtl1d000o1yf94na5gtnz",
      "stem": "A 65-year-old male with chronic kidney disease is prescribed metformin for type 2 diabetes. His current eGFR is 45 mL/min. He expresses concern about the safety of this medication given his renal function.\n\nWhich counseling point is most important?",
      "options": [
        "Counsel that metformin requires renal monitoring and prescriber-guided dosing: it is contraindicated if eGFR is below 30 mL/min/1.73 m²; when eGFR is 30–44 mL/min/1.73 m² use caution with dose reduction (often maximum 1000 mg/day), monitor renal function regularly, and seek care for lactic acidosis symptoms rather than selecting a new mg dose without prescriber input.",
        "Recommend increasing metformin to 1250 mg daily without prescriber approval because glycemic control is the priority.",
        "Advise that metformin is safe at any dose whenever the patient feels well, regardless of eGFR.",
        "Recommend stopping metformin permanently at eGFR 45 mL/min without contacting the prescriber or discussing glycemic alternatives."
      ],
      "answer": "Counsel that metformin requires renal monitoring and prescriber-guided dosing: it is contraindicated if eGFR is below 30 mL/min/1.73 m²; when eGFR is 30–44 mL/min/1.73 m² use caution with dose reduction (often maximum 1000 mg/day), monitor renal function regularly, and seek care for lactic acidosis symptoms rather than selecting a new mg dose without prescriber input.",
      "rationale": "Why this answer is correct\nCounseling on metformin requires careful renal monitoring and prescriber guidance.\n• Metformin is contraindicated if eGFR is below 30 mL/min due to the risk of lactic acidosis.\n• For eGFR between 30–44 mL/min, caution is needed with dosing, often limiting to 1000 mg/day.\n• Regular renal function monitoring is essential to ensure patient safety and effective management.\nIn practice: In practice, this means that pharmacists must ensure that patients with renal impairment are closely monitored to prevent serious complications and maintain effective diabetes control.\nWhy the other options are wrong\n\nRecommend increasing metformin to 1250 mg daily without prescriber approval because glycemic control is the priority.\n• Trap: Students may think that improving glycemic control is always the most important factor.\n• Why it fails here: However, increasing the dose of metformin without considering renal function can lead to serious complications like lactic acidosis, especially in patients with impaired renal clearance.\n• Remember: This highlights the importance of balancing glycemic control with patient safety, particularly in those with renal issues.\n\nAdvise that metformin is safe at any dose whenever the patient feels well, regardless of eGFR.\n• Trap: There is a common belief that patient comfort indicates safety in medication dosing.\n• Why it fails here: In reality, metformin dosing must be guided by renal function, as feeling well does not negate the risk of lactic acidosis in patients with compromised kidney function.\n• Remember: This reinforces the need for careful monitoring and adherence to dosing guidelines based on renal function.\n\nRecommend stopping metformin permanently at eGFR 45 mL/min without contacting the prescriber or discussing glycemic alternatives.\n• Trap: Students might think that discontinuing a medication is always the safest option when renal function declines.\n• Why it fails here: Abruptly stopping metformin without consulting the prescriber can lead to poor glycemic control and does not consider alternative treatment options that may be available.\n• Remember: This emphasizes the importance of communication and collaboration in patient-centered care.\nKey takeaway\nWhen managing medications like metformin in patients with renal impairment, prioritize safety through monitoring and prescriber collaboration.\n\nMemory hook: Remember: Monitor first, dose second — always check renal function before adjusting diabetes medications.",
      "sources": [
        "NABP NAPLEX 2026",
        "American Diabetes Association Standards of Medical Care"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr7ugqe4000j1yt36yzenwi2",
      "stem": "A 76-year-old woman presents to the pharmacy with a prescription for diphenhydramine 25 mg at bedtime for her allergies. She has a history of dementia and is currently taking donepezil 10 mg daily. Her daughter expresses concern about the potential side effects of adding diphenhydramine to her regimen.\n\nWhich finding requires immediate follow-up?",
      "options": [
        "Increased risk of confusion and sedation due to anticholinergic effects",
        "Potential for drug-drug interactions with donepezil",
        "No significant concerns with the current medication regimen",
        "Increased risk of urinary retention"
      ],
      "answer": "Increased risk of confusion and sedation due to anticholinergic effects",
      "rationale": "Why this answer is correct\nThe increased risk of confusion and sedation due to anticholinergic effects is a critical concern for this patient.\n• Anticholinergic effects of diphenhydramine can worsen cognitive function.\n• Elderly patients, especially those with dementia, are more susceptible to these effects.\n• Monitoring for confusion and sedation is essential in this population.\nIn practice: In practice, this means that we must be vigilant about the medications we prescribe to elderly patients, particularly those with cognitive impairments. Recognizing and addressing these risks can prevent further declines in their mental status.\nWhy the other options are wrong\n\nPotential for drug-drug interactions with donepezil\n• Trap: Students may think any new medication poses a significant interaction risk.\n• Why it fails here: While there is a theoretical risk of interactions, diphenhydramine does not have a clinically significant interaction with donepezil that would require immediate concern.\n• Remember: Understanding the specific interactions and their clinical significance is crucial for safe medication management.\n\nNo significant concerns with the current medication regimen\n• Trap: Some may believe that as long as medications are prescribed, there are no immediate concerns.\n• Why it fails here: This option overlooks the serious risks associated with adding diphenhydramine, particularly its anticholinergic effects in a patient with dementia.\n• Remember: Recognizing the potential for harm in elderly patients is vital for patient safety.\n\nIncreased risk of urinary retention\n• Trap: Students might assume that urinary retention is a primary concern with all anticholinergic medications.\n• Why it fails here: While urinary retention can occur, it is not as immediate or severe a concern as the risk of confusion and sedation in this patient with dementia.\n• Remember: Prioritizing the most significant risks helps in effective patient-centered care.\nKey takeaway\nWhen prescribing for elderly patients, prioritize monitoring for anticholinergic effects, especially in those with cognitive impairments.\n\nMemory hook: Think 'Dementia + Diphenhydramine = Danger' to remember the risks of confusion and sedation.",
      "sources": [
        "NABP NAPLEX 2026",
        "Beers Criteria for Potentially Inappropriate Medication Use in Older Adults"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmra7gm5a000f1y3eqjfqg5q0",
      "stem": "A 70-year-old female with a history of atrial fibrillation is on warfarin 5 mg daily. She presents to the clinic for her INR check, and her INR is 4.5. She reports no bleeding but is concerned about the elevated INR. Her renal function is stable with an eGFR of 60 mL/min.\n\nWhich action should the pharmacist take first?",
      "options": [
        "Administer vitamin K 1 mg orally",
        "Hold warfarin and monitor INR",
        "Administer prothrombin complex concentrate",
        "Increase warfarin dose"
      ],
      "answer": "Hold warfarin and monitor INR",
      "rationale": "The correct answer is to hold warfarin and monitor INR, as the INR of 4.5 indicates a moderate risk of bleeding, but there is no active bleeding present. Administering vitamin K or prothrombin complex concentrate is reserved for cases of significant bleeding or higher INR levels. Increasing the warfarin dose is inappropriate given the elevated INR. Continuous monitoring is essential to ensure patient safety.\n\nClinical reasoning: Assess the patient's INR and bleeding risk. Analyze the need for immediate intervention based on INR levels. Recommend holding warfarin and monitoring INR closely. Counsel the patient on signs of bleeding and the importance of follow-up. Monitor INR levels until they return to a safe range.\n\nWhy other options are incorrect:\n• Administer vitamin K 1 mg orally: Vitamin K should only be administered if there is significant bleeding or if INR exceeds 5.\n• Administer prothrombin complex concentrate: This is reserved for life-threatening bleeding and is not indicated in this case.\n• Increase warfarin dose: This is contraindicated due to the elevated INR.",
      "sources": [
        "NABP NAPLEX 2026",
        "American College of Chest Physicians Guidelines on Antithrombotic Therapy"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr4g8iuv000y1yavp9kx59km",
      "stem": "A 50-year-old female presents to the emergency department with severe abdominal pain and nausea after taking an overdose of acetaminophen. She has a history of alcohol use disorder and is currently on disulfiram. Her liver function tests show elevated AST and ALT levels.\n\nWhich alternative therapy is most appropriate?",
      "options": [
        "Activated charcoal",
        "N-acetylcysteine",
        "Sodium bicarbonate",
        "Lactulose"
      ],
      "answer": "N-acetylcysteine",
      "rationale": "Why this answer is correct\nN-acetylcysteine is the antidote for acetaminophen overdose and prevents liver damage.\n• N-acetylcysteine replenishes glutathione, crucial for detoxifying acetaminophen.\n• It is most effective when given within 8 hours of ingestion.\n• Timely administration can significantly reduce the risk of liver failure.\nIn practice: On the unit, administering N-acetylcysteine promptly can save the patient's liver function and improve outcomes in acetaminophen toxicity.\nWhy the other options are wrong\n\nActivated charcoal\n• Trap: Students may think activated charcoal is a universal antidote for all overdoses.\n• Why it fails here: Activated charcoal is only effective if administered within a few hours post-ingestion; in this case, the window may have passed.\n• Remember: Understanding the timing of activated charcoal administration is crucial in overdose management.\n\nSodium bicarbonate\n• Trap: Some may believe sodium bicarbonate can treat any type of toxicity.\n• Why it fails here: Sodium bicarbonate is used for metabolic acidosis, not for treating acetaminophen toxicity specifically.\n• Remember: Recognizing the specific antidote for acetaminophen is essential for effective treatment.\n\nLactulose\n• Trap: Students might confuse lactulose as a treatment for all liver-related issues.\n• Why it fails here: Lactulose is indicated for hepatic encephalopathy, not for acetaminophen overdose, and does not address the toxicity.\n• Remember: It's important to differentiate between treatments for liver conditions versus specific drug overdoses.\nKey takeaway\nWhen managing acetaminophen overdose, prioritize N-acetylcysteine to protect liver function.\n\nMemory hook: Think 'NAC saves the liver' for acetaminophen toxicity.",
      "sources": [
        "NABP NAPLEX 2026",
        "American Association of Poison Control Centers Guidelines"
      ],
      "difficulty": 3,
      "topic": "acetaminophen overdose",
      "step": null
    },
    {
      "id": "cmr7v6yre000v1y2z0ld7z1px",
      "stem": "A 45-year-old female presents to the pharmacy with a prescription for the influenza vaccine. She has a history of asthma and is currently taking albuterol as needed. She reports no known drug allergies and has not received any vaccines this season. Her last asthma exacerbation was three months ago, and she has been stable since then.\n\nWhich counseling point is most important?",
      "options": [
        "Inform her that she should avoid the vaccine if she has a respiratory infection.",
        "Advise her to take her albuterol before receiving the vaccine.",
        "Explain that the vaccine can cause asthma exacerbations.",
        "Reassure her that the vaccine is safe and effective for individuals with asthma."
      ],
      "answer": "Reassure her that the vaccine is safe and effective for individuals with asthma.",
      "rationale": "The correct answer is to reassure the patient that the vaccine is safe and effective for individuals with asthma. Vaccination is particularly important for patients with respiratory conditions, as they are at higher risk for complications from influenza. Avoiding the vaccine because of a respiratory history is not necessary, taking albuterol before the vaccine is not required, and the vaccine does not typically exacerbate asthma.\n\nClinical reasoning: Assess the patient's history of asthma and current medications. Analyze the importance of vaccination in preventing influenza complications in asthmatic patients. Recommend the vaccination while providing reassurance regarding its safety. Counsel the patient on the importance of the vaccine and monitor for any adverse effects post-vaccination.\n\nWhy other options are incorrect:\n• Inform her that she should avoid the vaccine if she has a respiratory infection.: This is incorrect because patients with mild respiratory infections can still receive the vaccine safely.\n• Advise her to take her albuterol before receiving the vaccine.: This is unnecessary; there is no requirement to use albuterol prior to vaccination.\n• Explain that the vaccine can cause asthma exacerbations.: This is misleading as the vaccine is generally safe and does not typically cause exacerbations.",
      "sources": [
        "NABP NAPLEX 2026"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr4fwiwh004j1yro00sv6mco",
      "stem": "A 67-year-old female presents to the pharmacy for a refill of her apixaban (Eliquis) 5 mg twice daily. She has a history of nonvalvular atrial fibrillation and hypertension, and her current medications include lisinopril and metoprolol. Her renal function is stable with a CrCl of 60 mL/min. She mentions she has a dental procedure scheduled in a week and is concerned about her anticoagulation therapy.\n\nWhich counseling point is most important?",
      "options": [
        "Continue apixaban without interruption for the dental procedure.",
        "Stop apixaban 3 days prior to the dental procedure.",
        "Switch to low-dose aspirin for the duration of the procedure.",
        "Consult with the dentist about stopping apixaban before the procedure."
      ],
      "answer": "Continue apixaban without interruption for the dental procedure.",
      "rationale": "Why this answer is correct\nContinuing apixaban without interruption is crucial to prevent thromboembolic events.\n• Anticoagulation therapy should generally be continued during dental procedures unless there is a high bleeding risk.\n• Stopping apixaban increases the risk of stroke in patients with nonvalvular atrial fibrillation.\n• Current guidelines support maintaining anticoagulation to balance the risk of bleeding and thromboembolism.\nWhy the other options are wrong\n\nStop apixaban 3 days prior to the dental procedure.\n• Trap: Students might think that stopping anticoagulation is a safe way to prevent bleeding during dental work.\n• Why it fails here: Stopping apixaban increases the risk of thromboembolic events, particularly in patients with atrial fibrillation, which can lead to serious complications like stroke.\n• Remember: This option fails to recognize the importance of balancing bleeding risk with the risk of thromboembolism.\n\nSwitch to low-dose aspirin for the duration of the procedure.\n• Trap: There is a belief that low-dose aspirin can provide adequate anticoagulation during dental procedures.\n• Why it fails here: Low-dose aspirin does not offer sufficient anticoagulation for patients with atrial fibrillation and could leave them vulnerable to thromboembolic events.\n• Remember: This option overlooks the need for effective anticoagulation in patients with atrial fibrillation.\n\nConsult with the dentist about stopping apixaban before the procedure.\n• Trap: Students may think that consulting the dentist about stopping anticoagulation is the best approach to manage bleeding risk.\n• Why it fails here: While consulting the dentist is important, the primary focus should be on maintaining anticoagulation to prevent thromboembolic complications, as most dental procedures do not require stopping anticoagulants.\n• Remember: This option misplaces the priority of anticoagulation management in the context of dental procedures.\nKey takeaway\nWhen managing anticoagulation for dental procedures, prioritize continuing therapy to prevent thromboembolic risks.\n\nMemory hook: Think 'anticoagulation first' — stopping can lead to strokes!",
      "sources": [
        "American College of Cardiology/American Heart Association Guidelines for Atrial Fibrillation Management"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr05e0b2004r1y2tq78ju94c",
      "stem": "A 50-year-old woman with a history of anxiety and depression is prescribed sertraline. She is currently taking lorazepam as needed for anxiety. During a follow-up visit, she reports feeling more anxious and has difficulty sleeping. She expresses concern about the side effects of her medications.\n\nWhich counseling point is most important for this patient?",
      "options": [
        "Sertraline may take several weeks to show full effects.",
        "Lorazepam should be taken daily to prevent anxiety.",
        "Both medications can cause weight gain.",
        "Sertraline can be stopped abruptly if side effects occur."
      ],
      "answer": "Sertraline may take several weeks to show full effects.",
      "rationale": "Why this answer is correct\nSertraline may take several weeks to show full effects, which is crucial for managing expectations.\n• SSRIs (selective serotonin reuptake inhibitors) like sertraline often require time to achieve their full therapeutic benefits.\n• Understanding this timeline helps the patient manage her anxiety and depression symptoms more effectively.\n• This knowledge can improve adherence to the medication regimen, as patients are less likely to discontinue treatment prematurely.\nIn practice: In practice, this means that patients should be educated about the expected timeline for medication effects, which can alleviate anxiety about immediate results and encourage them to stay on their treatment plan.\nWhy the other options are wrong\n\nLorazepam should be taken daily to prevent anxiety.\n• Trap: Students may think that daily use of lorazepam is necessary for consistent anxiety control.\n• Why it fails here: This option fails because lorazepam is intended for as-needed use to avoid the risk of dependence and tolerance.\n• Remember: Understanding the appropriate use of lorazepam is essential to prevent potential misuse and dependency.\n\nBoth medications can cause weight gain.\n• Trap: Students might believe that discussing side effects like weight gain is a priority in medication counseling.\n• Why it fails here: While it is true that both medications can cause weight gain, this concern is less critical than addressing the timeline for sertraline's effects, which directly impacts the patient's adherence and mental health.\n• Remember: Focusing on the most pressing concerns helps prioritize patient education effectively.\n\nSertraline can be stopped abruptly if side effects occur.\n• Trap: There may be a misunderstanding that patients can discontinue SSRIs at any time without consequences.\n• Why it fails here: This option is incorrect because stopping sertraline abruptly can lead to withdrawal symptoms and a potential worsening of anxiety and depression.\n• Remember: Educating patients about the importance of gradual discontinuation is vital for their safety and well-being.\nKey takeaway\nWhen counseling patients on SSRIs like sertraline, prioritize educating them about the expected time frame for therapeutic effects.\n\nMemory hook: Think 'SSRIs need time' to remember that patience is key for effectiveness.",
      "sources": [
        "NABP NAPLEX 2026",
        "FDA Drug Safety Communication on SSRIs"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr062jco004i1yhok1409t1t",
      "stem": "A 45-year-old woman with a history of major depressive disorder is currently taking sertraline 100 mg daily. She reports feeling more anxious and has had difficulty sleeping. She is considering adding an over-the-counter supplement to help with her anxiety.\n\nWhich counseling point is most important for this patient?",
      "options": [
        "St. John's wort is safe to use with sertraline.",
        "Consider using magnesium for anxiety relief.",
        "Monitor for increased sedation with valerian root.",
        "Avoid using any supplements without consulting a healthcare provider."
      ],
      "answer": "Avoid using any supplements without consulting a healthcare provider.",
      "rationale": "Why this answer is correct\nAvoiding supplements without consulting a healthcare provider is crucial for safety.\n• Supplements can interact with medications, leading to serious side effects.\n• St. John's wort, for example, can increase the risk of serotonin syndrome when taken with SSRIs like sertraline.\n• Consulting a healthcare provider ensures safe and effective treatment options.\n• Patient safety is paramount, especially when managing conditions like anxiety and depression.\nIn practice: In practice, this means that patients should be educated about the potential risks of self-medicating with supplements, especially when they are on medications like sertraline that can interact with these substances.\nWhy the other options are wrong\n\nSt. John's wort is safe to use with sertraline.\n• Trap: Students may think that natural products are always safe and effective.\n• Why it fails here: St. John's wort is known to interact with SSRIs, including sertraline, significantly increasing the risk of serotonin syndrome, a potentially life-threatening condition.\n• Remember: This highlights the importance of understanding drug interactions and the risks associated with combining supplements with prescribed medications.\n\nConsider using magnesium for anxiety relief.\n• Trap: There is a belief that all supplements are beneficial and safe for anxiety management.\n• Why it fails here: While magnesium is generally considered safe, its effectiveness for anxiety relief is not well-established, and it may not address the patient's specific needs or interactions with sertraline.\n• Remember: This underscores the need for evidence-based recommendations and the importance of consulting a healthcare provider before adding any supplement.\n\nMonitor for increased sedation with valerian root.\n• Trap: Students may assume that monitoring for side effects is sufficient without considering the initial risks of combining supplements.\n• Why it fails here: Valerian root can indeed cause sedation, but its use alongside sertraline can lead to unpredictable effects and increased sedation, which may not be safe for this patient.\n• Remember: This emphasizes the need for caution and thorough patient education regarding the use of herbal supplements with prescription medications.\nKey takeaway\nWhen considering supplements, always prioritize safety by consulting a healthcare provider first.\n\nMemory hook: Remember: Supplements + SSRIs = potential interactions; always check first!",
      "sources": [
        "NABP NAPLEX 2026",
        "Mayo Clinic on Supplements and SSRIs"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr05qklu00151yhof88o4pua",
      "stem": "A 70-year-old woman with a history of heart failure and chronic kidney disease (CKD) presents to the pharmacy with a prescription for lisinopril. Her current medications include furosemide and metoprolol. Her serum creatinine is 1.8 mg/dL, and her blood pressure is 135/85 mmHg.\n\nWhich monitoring parameter is most critical for this patient after starting lisinopril?",
      "options": [
        "Potassium levels",
        "Blood glucose levels",
        "Liver function tests",
        "Complete blood count"
      ],
      "answer": "Potassium levels",
      "rationale": "Why this answer is correct\nMonitoring potassium levels is essential after starting lisinopril in this patient.\n• Lisinopril can increase potassium levels, especially in patients with chronic kidney disease (CKD).\n• Hyperkalemia (high potassium) can lead to serious cardiac complications.\n• Regular monitoring helps prevent adverse effects and ensures safe medication use.\nIn practice: In practice, monitoring potassium levels allows for timely intervention if levels rise, reducing the risk of complications like arrhythmias. This is particularly crucial for patients with CKD, who are already at higher risk.\nWhy the other options are wrong\n\nBlood glucose levels\n• Trap: Students may think glucose monitoring is important for all patients on medications.\n• Why it fails here: In this case, blood glucose levels are not directly affected by lisinopril, making them less critical for monitoring.\n• Remember: This highlights the importance of focusing on parameters specifically influenced by the medication.\n\nLiver function tests\n• Trap: There is a common belief that all medications require liver function monitoring.\n• Why it fails here: Lisinopril does not significantly impact liver function, so monitoring these tests is unnecessary for this patient.\n• Remember: Understanding which tests are relevant for specific medications is key to effective patient management.\n\nComplete blood count\n• Trap: Some may assume that a complete blood count (CBC) is needed for all patients on medications.\n• Why it fails here: A CBC is not required for monitoring lisinopril therapy, as it does not affect blood cell counts.\n• Remember: This emphasizes the need to tailor monitoring to the specific medication and patient condition.\nKey takeaway\nWhen starting lisinopril, prioritize potassium monitoring to prevent hyperkalemia, especially in patients with CKD.\n\nMemory hook: Think 'K for Kidney' — monitor potassium in CKD patients on lisinopril.",
      "sources": [
        "NABP NAPLEX Content Outline, exams on/after 5/1/2025"
      ],
      "difficulty": 5,
      "topic": "lisinopril monitoring",
      "step": null
    },
    {
      "id": "cmqvlwaoo001h1yd7th768b1h",
      "stem": "A 70-year-old female with a history of chronic kidney disease (CKD) stage 3 is prescribed metoprolol succinate for hypertension. She is currently taking lisinopril and furosemide. Her blood pressure is 130/80 mm Hg, and her renal function is stable with a creatinine of 1.2 mg/dL. She reports feeling lightheaded upon standing.\n\nWhich finding requires immediate follow-up?",
      "options": [
        "Lightheadedness upon standing.",
        "Blood pressure of 130/80 mm Hg.",
        "Current renal function with creatinine of 1.2 mg/dL.",
        "Use of furosemide with metoprolol."
      ],
      "answer": "Lightheadedness upon standing.",
      "rationale": "Why this answer is correct\nLightheadedness upon standing indicates a potential risk for orthostatic hypotension that needs immediate attention.\n• Lightheadedness can signal inadequate blood pressure control.\n• This symptom may be an adverse effect of her medications.\n• Given her age and renal status, prompt follow-up is crucial.\nIn practice: On the unit, recognizing and addressing symptoms like lightheadedness can prevent falls and further complications. Monitoring for orthostatic hypotension is vital, especially in older patients.\nClinical pearl\nOn the unit, recognizing and addressing symptoms like lightheadedness can prevent falls and further complications. Monitoring for orthostatic hypotension is vital, especially in older patients.\nWhy the other options are wrong\n\nBlood pressure of 130/80 mm Hg.\n• Trap: Students may think any abnormal blood pressure reading requires follow-up.\n• Why it fails here: A blood pressure of 130/80 mm Hg is within an acceptable range for this patient and does not indicate an urgent issue.\n• Remember: Understanding acceptable blood pressure ranges helps prioritize which findings need immediate attention.\n\nCurrent renal function with creatinine of 1.2 mg/dL.\n• Trap: There may be a belief that any creatinine level in a patient with CKD requires follow-up.\n• Why it fails here: A creatinine level of 1.2 mg/dL is stable for this patient and does not necessitate immediate intervention.\n• Remember: Recognizing stable renal function is essential in managing patients with chronic kidney disease.\n\nUse of furosemide with metoprolol.\n• Trap: Students might think that combining these medications is inherently dangerous.\n• Why it fails here: While caution is warranted, the combination can be appropriate if monitored correctly; the key concern here is the patient's lightheadedness.\n• Remember: Understanding drug interactions is important, but patient symptoms take precedence in urgent situations.\nKey takeaway\nWhen you see lightheadedness in an older patient, think orthostatic hypotension first.\n\nMemory hook: Remember: Lightheadedness = potential fall risk.",
      "sources": [
        "NABP NAPLEX 2026",
        "American College of Cardiology Guidelines 2021"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    }
  ],
  "pance": [
    {
      "id": "cmvmjhkdx0009jsaeoi2wmwix",
      "stem": "A 19-year-old man who recently arrived in the United States from a refugee camp is seen in the emergency department with 3 days of sore throat, low-grade fever, malaise, and painful swallowing. He has no record of vaccination. Temperature is 38.0°C (100.4°F), pulse 118/min, blood pressure 112/70 mm Hg. A gray-white membrane adheres firmly to both tonsils and extends onto the soft palate and uvula; gentle attempts to scrape it cause bleeding. There is marked soft-tissue swelling of the anterior neck with tender cervical lymphadenopathy. ECG shows first-degree AV block.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Streptococcal pharyngitis",
        "Respiratory diphtheria",
        "Acute epiglottitis",
        "Peritonsillar abscess",
        "Infectious mononucleosis"
      ],
      "answer": "Respiratory diphtheria",
      "rationale": "Respiratory diphtheria is correct: per CDC clinical guidance, an unvaccinated patient with a gray, tightly adherent pseudomembrane that bleeds when scraped, bull-neck swelling, and toxin-mediated complications such as myocarditis with conduction block is classic for toxigenic Corynebacterium diphtheriae; treat with diphtheria antitoxin plus erythromycin or penicillin, with isolation. Streptococcal pharyngitis is incorrect because its exudate is patchy and wipes off easily, and it does not cause myocarditis this early. Infectious mononucleosis is incorrect because its exudate is not adherent and it causes posterior cervical adenopathy and splenomegaly, not heart block. Peritonsillar abscess is incorrect because it causes unilateral swelling, uvular deviation, and trismus. Epiglottitis is incorrect because it causes drooling, stridor, and tripod positioning with a normal-appearing oropharynx. Takeaway: unvaccinated + adherent gray membrane that bleeds + bull neck = diphtheria; antitoxin.",
      "sources": [
        "CDC. Diphtheria Clinical Features",
        "CDC. Clinical Care and Treatment of Diphtheria"
      ],
      "difficulty": 4,
      "topic": "diphtheria",
      "step": null
    },
    {
      "id": "cmvmrsyzk0000jscog68n840d",
      "stem": "A 38-year-old woman who smokes 1 pack of cigarettes daily has had 4 episodes over 3 weeks of substernal chest tightness that wake her between 4 and 6 AM and resolve within 10 minutes. She has no symptoms with exercise and can run 5 km. During an episode in the emergency department, ECG shows 2-mm ST elevation in leads II, III, and aVF that resolves completely after sublingual nitroglycerin. Serial high-sensitivity troponin levels are normal. Coronary angiography shows no obstructive lesions.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Stable angina from fixed atherosclerotic stenosis",
        "Stress (takotsubo) cardiomyopathy",
        "Acute pericarditis",
        "Spontaneous coronary artery dissection",
        "Vasospastic angina"
      ],
      "answer": "Vasospastic angina",
      "rationale": "Vasospastic angina is correct: recurrent rest angina clustering in the early morning, transient ST elevation that resolves with nitroglycerin, normal troponin, preserved exercise capacity, and nonobstructive coronaries in a smoker are classic. The 2023 AHA/ACC chronic coronary disease guideline recommends calcium channel blockers (with sublingual nitroglycerin and smoking cessation) for vasospastic angina; beta-blockers and triptans can worsen spasm. Pericarditis causes positional pleuritic pain with diffuse ST elevation and PR depression, not transient regional elevation. Takotsubo follows a stressor, raises troponin, and shows apical ballooning. Fixed stenosis causes exertional angina and would appear on angiography. SCAD causes infarction with troponin rise, usually in peripartum or young women, with an angiographic dissection plane. Takeaway: early-morning rest angina + transient STE + clean coronaries = vasospasm; treat with a CCB.",
      "sources": [
        "Virani SS et al. 2023 AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease. J Am Coll Cardiol 2023"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmvmrsz11000gjsco2xzixq9i",
      "stem": "A 29-year-old woman with asthma since childhood has had 3 exacerbations requiring oral prednisone in the past year despite high-dose inhaled corticosteroid-formoterol. She coughs up brownish mucus plugs. Blood eosinophil count is 1100/microL, total serum IgE is 2400 IU/mL, and Aspergillus fumigatus-specific IgE is elevated. Chest CT shows central bronchiectasis with high-attenuation mucus plugging. Sweat chloride testing is normal.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Allergic bronchopulmonary aspergillosis",
        "Chronic eosinophilic pneumonia",
        "Eosinophilic granulomatosis with polyangiitis",
        "Cystic fibrosis",
        "Chronic necrotizing pulmonary aspergillosis"
      ],
      "answer": "Allergic bronchopulmonary aspergillosis",
      "rationale": "ABPA is correct: in a patient with asthma, the revised 2024 ISHAM-ABPA working group criteria require Aspergillus sensitization (positive specific IgE or skin test) and total IgE of at least 500 IU/mL, plus supporting features such as eosinophilia over 500/microL, Aspergillus IgG, and imaging consistent with ABPA; central bronchiectasis and high-attenuation mucus are characteristic. Oral prednisolone or itraconazole is used for active disease. EGPA adds vasculitis (neuropathy, purpura, renal involvement, ANCA). Chronic necrotizing aspergillosis occurs in immunocompromised or structural lung disease with cavitation and tissue invasion. Chronic eosinophilic pneumonia shows peripheral 'photographic negative' infiltrates without bronchiectasis or fungal sensitization. CF is excluded by normal sweat chloride. Takeaway: poorly controlled asthma + brown plugs + IgE >500 + Aspergillus sensitization + central bronchiectasis = ABPA.",
      "sources": [
        "Agarwal R et al. Revised ISHAM-ABPA working group clinical practice guidelines for diagnosing, classifying and treating allergic bronchopulmonary aspergillosis/mycoses. Eur Respir J 2024"
      ],
      "difficulty": 3,
      "topic": "allergic bronchopulmonary aspergillosis",
      "step": null
    },
    {
      "id": "cmvmjhkis001ljsaephzxwxg7",
      "stem": "A 64-year-old man with a 50-pack-year smoking history comes to the clinic with 3 months of difficulty climbing stairs and rising from a chair, dry mouth, constipation, and erectile dysfunction. He notes that his legs feel stronger after he has been walking for a few minutes. Vital signs are normal. Examination shows 4-/5 strength in the hip flexors and shoulder abductors, mild bilateral ptosis, and depressed reflexes at the knees and ankles that become brisker after 10 seconds of maximal muscle contraction. Sensation is normal. CK is normal. Chest CT shows a right hilar mass with mediastinal lymphadenopathy.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Guillain-Barré syndrome",
        "Amyotrophic lateral sclerosis",
        "Polymyositis",
        "Myasthenia gravis",
        "Lambert-Eaton myasthenic syndrome"
      ],
      "answer": "Lambert-Eaton myasthenic syndrome",
      "rationale": "Lambert-Eaton myasthenic syndrome is correct: antibodies against presynaptic P/Q-type voltage-gated calcium channels reduce acetylcholine release, causing proximal leg-predominant weakness that improves briefly with exercise, depressed reflexes that increase after brief contraction, and autonomic symptoms such as dry mouth; about half of cases are paraneoplastic, usually small cell lung cancer. VGCC antibodies and an incremental EMG response confirm it; amifampridine treats it. Myasthenia gravis is incorrect because weakness worsens with use, ocular and bulbar muscles dominate, and reflexes are normal. Polymyositis is incorrect because CK is usually elevated and reflexes and autonomic function are normal. ALS is incorrect because it causes fasciculations and UMN signs without autonomic features. GBS is incorrect because it is acute, ascending, and sensory. Takeaway: smoker + proximal weakness that improves with use + areflexia + dry mouth = LEMS; look for small cell cancer.",
      "sources": [
        "Titulaer MJ et al. Lambert-Eaton myasthenic syndrome. Lancet Neurol 2011"
      ],
      "difficulty": 4,
      "topic": "Lambert Eaton myasthenic syndrome",
      "step": null
    },
    {
      "id": "cmvmq1dbl000ojs21p9a8ukmf",
      "stem": "An 18-year-old woman has 3 weeks of fatigue and jaundice. Her mother notes new clumsiness of handwriting and a tremor that worsens when she holds her arms outstretched. AST is 186 U/L, ALT 98 U/L, alkaline phosphatase 32 U/L (low), and total bilirubin 6.8 mg/dL. Hemoglobin is 9.4 g/dL with elevated LDH and reticulocytes and a negative direct antiglobulin test. Serum ceruloplasmin is 7 mg/dL (low), and a 24-hour urine copper is 210 mcg. Viral hepatitis serologies and ANA are negative.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Wilson disease",
        "Alpha-1 antitrypsin deficiency",
        "Hereditary hemochromatosis",
        "Acute hepatitis A",
        "Autoimmune hepatitis"
      ],
      "answer": "Wilson disease",
      "rationale": "Wilson disease is correct: a young patient with liver disease, neurologic signs (tremor, dysgraphia), Coombs-negative hemolysis, disproportionately low alkaline phosphatase, low ceruloplasmin, and 24-hour urinary copper well above 100 mcg fits ATP7B-related copper overload; the 2022 AASLD Wilson disease practice guidance recommends slit-lamp examination for Kayser-Fleischer rings, ATP7B genetic testing, and chelation with penicillamine or trientine (zinc for maintenance or presymptomatic patients). Autoimmune hepatitis causes elevated IgG and autoantibodies and no copper abnormalities or hemolysis. Hemochromatosis presents later in life with high ferritin and transferrin saturation. Hepatitis A serology is negative and does not cause tremor. Alpha-1 antitrypsin deficiency causes liver and lung disease without hemolysis or movement disorder. Takeaway: young liver disease + neuropsychiatric signs + Coombs-negative hemolysis + low ceruloplasmin = Wilson disease.",
      "sources": [
        "Schilsky ML et al. A multidisciplinary approach to the diagnosis and management of Wilson disease: Executive summary of the 2022 Practice Guidance on Wilson disease from the AASLD. Hepatology 2023"
      ],
      "difficulty": 3,
      "topic": "Wilson disease",
      "step": null
    },
    {
      "id": "cmvmloiro000hjs41mxew0srs",
      "stem": "A 28-year-old man who smokes cigarettes presents with 5 days of hemoptysis, dyspnea, and decreased urine output. Blood pressure is 152/94 mm Hg, respiratory rate 24/min, and oxygen saturation 90% on room air. Chest radiograph shows bilateral alveolar infiltrates. Creatinine is 4.6 mg/dL (normal 2 months ago). Urinalysis shows red cell casts. Serum anti-GBM antibody is strongly positive and ANCA is negative. A kidney biopsy is scheduled for tomorrow; he does not require dialysis today.\n\nWhich of the following is the most appropriate management now?",
      "options": [
        "Begin plasma exchange with cyclophosphamide and glucocorticoids without waiting for the biopsy",
        "Rituximab monotherapy",
        "Glucocorticoids alone",
        "High-dose ACE inhibitor and observation",
        "Wait for kidney biopsy results before starting any immunosuppression"
      ],
      "answer": "Begin plasma exchange with cyclophosphamide and glucocorticoids without waiting for the biopsy",
      "rationale": "Beginning plasma exchange with cyclophosphamide and glucocorticoids now is correct: positive anti-GBM antibodies with pulmonary hemorrhage and rapidly progressive GN is anti-GBM (Goodpasture) disease, and KDIGO recommends cyclophosphamide and glucocorticoids plus plasmapheresis in all such patients except those dialysis-dependent at presentation with 100% crescents and no pulmonary hemorrhage. Treatment starts without delay when suspected. Waiting for the biopsy is incorrect because kidney outcome depends on how quickly therapy starts. Glucocorticoids alone do not remove circulating antibody. Rituximab monotherapy is incorrect because KDIGO reserves rituximab for refractory disease. An ACE inhibitor with observation is incorrect because this is a life-threatening autoimmune emergency. Takeaway: suspect anti-GBM disease, start plasma exchange, cyclophosphamide, and steroids immediately.",
      "sources": [
        "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases (with 2024 chapter updates)",
        "KDIGO 2021 Glomerular Diseases Guideline. Kidney Int 2021 (PubMed)"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmvmmni7y001fjsh8leld0z9e",
      "stem": "A 61-year-old woman has hypercalcemia found on routine testing. She has no kidney stones, fractures, or symptoms. Serum calcium is 10.7 mg/dL (reference 8.5-10.2) on three occasions, PTH is 92 pg/mL (reference 15-65), 25-hydroxyvitamin D is 34 ng/mL, and eGFR is 82 mL/min/1.73 m2. 24-hour urine calcium is 240 mg with a calcium-to-creatinine clearance ratio of 0.025. DXA T-scores are -1.8 at the lumbar spine, -1.6 at the femoral neck, and -2.7 at the distal one-third radius. Kidney imaging shows no nephrocalcinosis.\n\nWhich of the following is the most appropriate management?",
      "options": [
        "Referral for parathyroidectomy",
        "Repeat PTH testing after 6 months of vitamin D restriction",
        "Annual serum calcium and DXA monitoring only",
        "Hydrochlorothiazide to lower urine calcium",
        "Cinacalcet as definitive therapy"
      ],
      "answer": "Referral for parathyroidectomy",
      "rationale": "Referral for parathyroidectomy is correct: the 2022 Fifth International Workshop guidelines recommend surgery for primary hyperparathyroidism, even when asymptomatic, if any criterion is met: serum calcium more than 1 mg/dL above the upper limit, T-score -2.5 or lower at the lumbar spine, hip, or distal one-third radius, vertebral fracture, eGFR below 60, kidney stones or nephrocalcinosis, hypercalciuria (above 250 mg/day in women or 300 mg/day in men), or age below 50. Her distal radius T-score of -2.7 meets the skeletal criterion; the clearance ratio above 0.02 argues against familial hypocalciuric hypercalcemia. Monitoring alone is for patients who meet no criteria or decline surgery. Cinacalcet lowers calcium but does not improve bone density and is not definitive. Thiazides raise serum calcium and are not therapy. Vitamin D restriction is inappropriate; vitamin D should be kept replete. Takeaway: PHPT with T-score ≤-2.5 at any site, including distal radius, = parathyroidectomy.",
      "sources": [
        "Bilezikian JP et al. Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop. J Bone Miner Res 2022"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmvmmni3c0006jsh8wf81msjp",
      "stem": "A 66-year-old man is on postoperative day 7 after total knee arthroplasty and has been receiving unfractionated heparin 5,000 units subcutaneously every 8 hours. His platelet count was 245,000/mm3 preoperatively and is now 98,000/mm3. Today he has new left calf swelling, and duplex ultrasonography shows a femoral-popliteal deep venous thrombosis. He has no bleeding. Creatinine is 1.0 mg/dL.\n\nIn addition to sending a heparin-PF4 antibody immunoassay, which of the following is the most appropriate next step?",
      "options": [
        "Switch to enoxaparin 1 mg/kg subcutaneously every 12 hours",
        "Stop heparin and begin warfarin alone",
        "Stop heparin and start a non-heparin anticoagulant such as argatroban",
        "Transfuse platelets and continue heparin",
        "Stop heparin and observe without anticoagulation until the assay results"
      ],
      "answer": "Stop heparin and start a non-heparin anticoagulant such as argatroban",
      "rationale": "Stopping heparin and starting a non-heparin anticoagulant is correct: a greater than 50% platelet fall beginning 5-10 days after heparin exposure with new thrombosis and no other cause gives a high 4Ts score; the ASH 2018 HIT guideline recommends discontinuing all heparin and starting a non-heparin anticoagulant (argatroban, bivalirudin, fondaparinux, or a DOAC) while the immunoassay is pending. Enoxaparin is incorrect because low-molecular-weight heparin cross-reacts with HIT antibodies. Warfarin alone is incorrect because it can cause venous limb gangrene in acute HIT; it should not be started until platelets have recovered (usually to at least 150,000/mm3) and then overlapped with a non-heparin agent. Platelet transfusion with continued heparin is incorrect and may worsen thrombosis. Observation without anticoagulation is incorrect because thrombotic risk in HIT is high. Takeaway: suspected HIT with intermediate/high 4Ts = stop all heparin and start a non-heparin anticoagulant.",
      "sources": [
        "Cuker A et al. American Society of Hematology 2018 guidelines for management of venous thromboembolism: heparin-induced thrombocytopenia. Blood Adv 2018"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmvmkf3sp0011jst8znfcg528",
      "stem": "A 32-year-old woman with 5 years of psychiatric illness is evaluated. Her records show 3 episodes of mania with decreased sleep and grandiosity and 2 major depressive episodes, each lasting weeks to months; mood episodes have been present for most of her illness. She also has persistent auditory hallucinations of voices commenting and the belief that the government implanted a tracking chip in her teeth. Her family and records confirm that the voices and the chip belief have continued for 4 to 6 weeks at a time during periods when her mood was normal. Urine drug screens have been negative. Physical examination and TSH are normal.\n\nWhich of the following is the most likely diagnosis?",
      "options": [
        "Major depressive disorder with psychotic features",
        "Delusional disorder",
        "Schizophrenia",
        "Schizoaffective disorder, bipolar type",
        "Bipolar I disorder with psychotic features"
      ],
      "answer": "Schizoaffective disorder, bipolar type",
      "rationale": "Schizoaffective disorder, bipolar type, is correct: DSM-5-TR requires an uninterrupted illness with a major mood episode concurrent with schizophrenia criterion A, delusions or hallucinations for 2 or more weeks without a major mood episode, and mood episodes present for the majority of the total illness duration; the bipolar type applies when a manic episode is part of the presentation. Bipolar I with psychotic features is incorrect because psychosis there occurs only during mood episodes. Schizophrenia is incorrect because mood episodes are present for most of her illness rather than briefly. MDD with psychotic features is incorrect because she has had manic episodes and psychosis outside of mood episodes. Delusional disorder is incorrect because she has prominent hallucinations alongside major mood episodes. Takeaway: psychosis 2 weeks or more without mood symptoms + mood episodes for most of the illness = schizoaffective disorder.",
      "sources": [
        "APA. Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR)"
      ],
      "difficulty": 4,
      "topic": "schizoaffective disorder",
      "step": null
    },
    {
      "id": "cmvmloiup001gjs41dqodtbg6",
      "stem": "A one-time ultrasound screening program for ovarian cancer detects 40 cancers among asymptomatic women. Investigators observe that the screen-detected tumors are, on average, lower grade and slower growing than tumors diagnosed in women who present with symptoms between screening rounds (interval cancers), and that screen-detected patients have better 5-year survival.\n\nWhich of the following biases most likely contributes to the better outcomes seen in the screen-detected group?",
      "options": [
        "Observer bias",
        "Hawthorne effect",
        "Length-time bias",
        "Lead-time bias",
        "Attrition bias"
      ],
      "answer": "Length-time bias",
      "rationale": "Length-time bias is correct: periodic screening is more likely to detect slowly progressing tumors because they spend a longer time in the detectable preclinical phase, whereas aggressive tumors grow quickly and surface as symptomatic interval cancers between screens; screen-detected cases are therefore enriched for favorable biology regardless of any benefit of early treatment. Lead-time bias is incorrect because it refers to earlier diagnosis lengthening apparent survival without changing time of death, not to differences in tumor grade or growth rate. Observer bias is incorrect because it arises when outcome assessors' knowledge influences measurement. The Hawthorne effect describes behavior change from being observed. Attrition bias is incorrect because no differential loss of participants is described. Takeaway: screening preferentially finds indolent disease; randomized trials with mortality end points correct for both length-time and lead-time bias.",
      "sources": [
        "NCI PDQ Cancer Screening Overview (Health Professional Version)"
      ],
      "difficulty": 4,
      "topic": "length time bias",
      "step": null
    }
  ],
  "aanp-fnp": [
    {
      "id": "cmr83k1n9004r1yq55xfs5ejf",
      "stem": "A 45-year-old male presents to the clinic with complaints of constipation for the past month. He reports straining during bowel movements and has noticed blood on the toilet paper. He denies any significant weight loss, changes in appetite, or abdominal pain. His vital signs are stable, and a digital rectal exam reveals a hard stool.\n\nWhat is the most appropriate pharmacotherapy?",
      "options": [
        "Polyethylene glycol",
        "Bisacodyl",
        "Docusate sodium",
        "Senna"
      ],
      "answer": "Polyethylene glycol",
      "rationale": "In this case, the patient's symptoms of constipation and straining suggest the need for an osmotic laxative. Polyethylene glycol is effective for treating constipation by drawing water into the stool, making it easier to pass.\n\n- Incorrect because bisacodyl is a stimulant laxative and may not be the best first-line treatment for this patient.\n- Incorrect because docusate sodium is a stool softener and may not provide sufficient relief for this patient's hard stool.\n- Incorrect because senna is also a stimulant laxative and may not be the best choice for this patient.\n\nKey takeaway: Polyethylene glycol is often the first-line treatment for constipation due to its efficacy and safety profile.\n\nMemory hook: Think of polyethylene glycol as the go-to osmotic laxative for constipation.\n\nClinical reasoning: Assess: The patient presents with constipation and straining during bowel movements.\nDiagnose: The hard stool indicates a need for pharmacotherapy.\nPlan: Prescribe polyethylene glycol as the first-line treatment.\nEvaluate: Monitor bowel habits and adjust treatment as necessary.\n\nWhy other options are incorrect:\n• Bisacodyl: Incorrect because bisacodyl is a stimulant laxative and may not be the best first-line treatment for this patient.\n• Docusate sodium: Incorrect because docusate sodium is a stool softener and may not provide sufficient relief for this patient's hard stool.\n• Senna: Incorrect because senna is also a stimulant laxative and may not be the best choice for this patient.",
      "sources": [
        "American Gastroenterological Association Guidelines for Constipation"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr83lsnd00541yq5gua6nyfz",
      "stem": "A 25-year-old woman presents to the primary care clinic with complaints of wheezing and shortness of breath, especially during exercise. She has a history of asthma and uses an albuterol inhaler as needed. Her vital signs are stable, and her peak flow measurement is 75% of her personal best. She reports using her rescue inhaler more than twice a week.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Increase the dose of her albuterol inhaler",
        "Add a low-dose inhaled corticosteroid",
        "Refer to a pulmonologist",
        "Initiate oral corticosteroids"
      ],
      "answer": "Add a low-dose inhaled corticosteroid",
      "rationale": "The patient is experiencing asthma symptoms more frequently than recommended, indicating poor control. According to GINA guidelines, adding a low-dose inhaled corticosteroid is the appropriate next step for patients who use their rescue inhaler more than twice a week.\n- Incorrect because increasing the dose of her albuterol inhaler does not address the underlying inflammation and may lead to over-reliance on rescue medication.\n- Incorrect because referral to a pulmonologist is not necessary at this stage, as her condition can be managed in primary care.\n- Incorrect because initiating oral corticosteroids is not appropriate for chronic management and is reserved for acute exacerbations.\n\nClinical reasoning: Assess: Patient has increased asthma symptoms and poor control. Diagnose: Uncontrolled asthma. Plan: Add a low-dose inhaled corticosteroid. Evaluate: Monitor asthma control and adjust therapy as needed.\n\nWhy other options are incorrect:\n• Increase the dose of her albuterol inhaler: Incorrect because increasing the dose of her albuterol inhaler does not address the underlying inflammation and may lead to over-reliance on rescue medication.\n• Refer to a pulmonologist: Incorrect because referral to a pulmonologist is not necessary at this stage, as her condition can be managed in primary care.\n• Initiate oral corticosteroids: Incorrect because initiating oral corticosteroids is not appropriate for chronic management and is reserved for acute exacerbations.",
      "sources": [
        "GINA Guidelines"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr82kzqe004w1yfvewrwohpx",
      "stem": "A 15-year-old boy with a history of asthma presents to the clinic for a follow-up visit. He has been experiencing increased coughing and shortness of breath, especially at night. His mother reports he has been using his rescue inhaler daily. On examination, his respiratory rate is 22 breaths/min, and his peak flow is 60% of his personal best.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Increase the dose of his inhaled corticosteroid",
        "Start a leukotriene receptor antagonist",
        "Prescribe oral corticosteroids",
        "Add a long-acting beta-agonist"
      ],
      "answer": "Increase the dose of his inhaled corticosteroid",
      "rationale": "The patient is experiencing worsening asthma symptoms and is using his rescue inhaler daily, indicating poor control. The most appropriate next step is to increase the dose of his inhaled corticosteroid, as recommended by GINA guidelines for patients with worsening asthma control.\n- Incorrect because starting a leukotriene receptor antagonist may be considered but is not the immediate next step in this scenario.\n- Incorrect because prescribing oral corticosteroids is typically reserved for severe exacerbations and not for routine management.\n- Incorrect because adding a long-acting beta-agonist should only be done if the inhaled corticosteroid is optimized first.\n\nClinical reasoning: Assess: Patient has worsening asthma symptoms and increased rescue inhaler use. Diagnose: Poorly controlled asthma. Plan: Increase the dose of inhaled corticosteroid. Evaluate: Monitor response to increased medication and adjust as necessary.\n\nWhy other options are incorrect:\n• Start a leukotriene receptor antagonist: Incorrect because this is not the immediate next step; optimizing inhaled corticosteroid therapy is prioritized.\n• Prescribe oral corticosteroids: Incorrect because oral corticosteroids are not appropriate for routine management in this case.\n• Add a long-acting beta-agonist: Incorrect because this should only be done after optimizing the inhaled corticosteroid therapy.",
      "sources": [
        "GINA Guidelines"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr82t5nl009q1yfvtipgc40v",
      "stem": "A 70-year-old man with a history of coronary artery disease presents to the emergency department with chest pain radiating to his left arm. He reports that the pain started suddenly while he was mowing the lawn. His vital signs show BP 150/90 mm Hg, HR 100 bpm, and SpO2 96%. An ECG shows ST-segment elevation in leads II, III, and aVF.\n\nWhat is the most appropriate follow-up plan?",
      "options": [
        "Start aspirin and nitroglycerin",
        "Refer for immediate cardiac catheterization",
        "Administer thrombolytics",
        "Monitor in the emergency department for 24 hours"
      ],
      "answer": "Refer for immediate cardiac catheterization",
      "rationale": "The most appropriate follow-up plan is to refer for immediate cardiac catheterization, as this patient is presenting with ST-segment elevation myocardial infarction (STEMI). This aligns with the current guidelines for the management of acute coronary syndrome. Incorrect because starting aspirin and nitroglycerin is part of the initial management but does not address the need for urgent intervention. Incorrect because administering thrombolytics is not preferred in the setting of a STEMI when catheterization is available. Incorrect because monitoring in the emergency department for 24 hours is not appropriate given the urgency of the situation.\n\nClinical reasoning: Assess: The patient presents with classic symptoms and ECG findings of STEMI. Diagnose: ST-segment elevation myocardial infarction. Plan: Refer for immediate cardiac catheterization. Evaluate: Monitor cardiac status and response to treatment.\n\nWhy other options are incorrect:\n• Start aspirin and nitroglycerin: Incorrect because this is part of the initial management but does not address the need for urgent intervention.\n• Administer thrombolytics: Incorrect because this is not preferred when catheterization is available.\n• Monitor in the emergency department for 24 hours: Incorrect because this is not appropriate given the urgency of the situation.",
      "sources": [
        "AHA/ACC Guidelines for STEMI"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr83k1gc004p1yq5r6bbtzef",
      "stem": "A 10-year-old girl presents to the clinic with a persistent cough and fever for the past 5 days. She has a history of asthma and is currently on a daily inhaled corticosteroid. On examination, her temperature is 101.5°F, respiratory rate is 24 breaths/min, and she has wheezing on auscultation. A chest X-ray shows no infiltrates.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Start oral antibiotics",
        "Increase inhaled corticosteroid dosage",
        "Prescribe a short course of oral corticosteroids",
        "Order a sputum culture"
      ],
      "answer": "Prescribe a short course of oral corticosteroids",
      "rationale": "In this case, the patient's asthma history and current wheezing, along with fever, suggest an exacerbation likely due to viral infection. A short course of oral corticosteroids is appropriate to reduce inflammation and improve airflow.\n\n- Incorrect because starting oral antibiotics is not warranted without evidence of bacterial infection, as the chest X-ray shows no infiltrates.\n- Incorrect because increasing the inhaled corticosteroid dosage may not be sufficient to control the acute exacerbation.\n- Incorrect because ordering a sputum culture is not necessary at this stage, as it will not change the immediate management of an asthma exacerbation.\n\nKey takeaway: In children with asthma exacerbations, consider oral corticosteroids to manage inflammation effectively.\n\nMemory hook: Remember the role of corticosteroids in managing asthma exacerbations.\n\nClinical reasoning: Assess: The child presents with cough, fever, and wheezing.\nDiagnose: Likely asthma exacerbation due to viral infection.\nPlan: Prescribe a short course of oral corticosteroids to reduce inflammation.\nEvaluate: Monitor response to treatment and reassess symptoms.\n\nWhy other options are incorrect:\n• Start oral antibiotics: Incorrect because starting oral antibiotics is not warranted without evidence of bacterial infection, as the chest X-ray shows no infiltrates.\n• Increase inhaled corticosteroid dosage: Incorrect because increasing the inhaled corticosteroid dosage may not be sufficient to control the acute exacerbation.\n• Order a sputum culture: Incorrect because ordering a sputum culture is not necessary at this stage, as it will not change the immediate management of an asthma exacerbation.",
      "sources": [
        "Global Initiative for Asthma (GINA) Guidelines"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr83i3x0002x1yq5uus18zu4",
      "stem": "A 70-year-old man with a history of hypertension and diabetes presents to the clinic for a routine follow-up. He reports feeling more fatigued than usual and has noticed swelling in his legs. His BP is 150/90 mm Hg, HR is 76/min, and he has 2+ pitting edema in both lower extremities. His current medications include lisinopril and metformin.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Increase the dose of lisinopril",
        "Add a diuretic",
        "Order a renal function panel",
        "Schedule a follow-up in 1 month"
      ],
      "answer": "Order a renal function panel",
      "rationale": "In a patient with new-onset edema and fatigue, it is essential to evaluate renal function to rule out any underlying kidney issues, especially given his history of diabetes and hypertension.\n\nIncorrect because:\n- Increase the dose of lisinopril: This may not be appropriate without assessing renal function first.\n- Add a diuretic: This could be considered, but renal function should be evaluated first to avoid complications.\n- Schedule a follow-up in 1 month: This does not address the immediate need to assess renal status.\n\nKey takeaway: Assessing renal function is crucial in patients with new edema and fatigue.\n\nMemory hook: Remember to check renal function in patients with new edema.\n\nClinical reasoning: Assess: 70-year-old man with fatigue and edema. Diagnose: Potential renal issues related to diabetes and hypertension. Plan: Order renal function panel. Evaluate: Monitor renal function and adjust medications as needed.\n\nWhy other options are incorrect:\n• Increase the dose of lisinopril: Incorrect because increasing the dose without assessing renal function could lead to adverse effects.\n• Add a diuretic: Incorrect because diuretics should be used cautiously without knowing the renal status.\n• Schedule a follow-up in 1 month: Incorrect because this does not provide immediate evaluation of the patient's condition.",
      "sources": [
        "JNC 8 Hypertension Guidelines"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr82t4x0009j1yfvwhmyfzgh",
      "stem": "A 10-year-old male presents to the pediatric clinic for his annual wellness visit. He is up to date on his vaccinations and has no significant past medical history. His parents express concern about his weight, noting he has gained 15 pounds since his last visit. His BMI is calculated to be in the 95th percentile. BP is 110/70 mm Hg.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Refer to a pediatric endocrinologist",
        "Initiate a weight management program",
        "Order a fasting insulin level",
        "Discuss dietary modifications and physical activity"
      ],
      "answer": "Discuss dietary modifications and physical activity",
      "rationale": "The correct answer is to discuss dietary modifications and physical activity as the first step in managing obesity in children. This approach aligns with the recommendations from the American Academy of Pediatrics, which emphasizes lifestyle changes before considering referrals or pharmacotherapy. Incorrect because referring to a pediatric endocrinologist is premature without trying lifestyle interventions first. Incorrect because initiating a weight management program may be too formal at this stage without first assessing dietary habits. Incorrect because ordering a fasting insulin level is not necessary at this point and does not address the immediate concern of obesity management.\n\nClinical reasoning: Assess: The child is overweight with a BMI in the 95th percentile. Diagnose: The child is at risk for obesity-related complications. Plan: Discuss lifestyle modifications first. Evaluate: Monitor weight and dietary habits at the next visit.\n\nWhy other options are incorrect:\n• Refer to a pediatric endocrinologist: Incorrect because this referral is premature without trying lifestyle interventions first.\n• Initiate a weight management program: Incorrect because a structured program may be too formal at this stage without assessing dietary habits.\n• Order a fasting insulin level: Incorrect because this test is unnecessary at this point and does not address the immediate concern.",
      "sources": [
        "American Academy of Pediatrics Guidelines"
      ],
      "difficulty": 4,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr83i3bo002r1yq5o5ziohhy",
      "stem": "A 15-year-old female presents to the clinic for a routine check-up. She has been feeling anxious and has difficulty sleeping. Her mother reports that she has lost interest in activities she once enjoyed. The patient denies any suicidal thoughts. BP is 110/70 mm Hg, HR 78/min, and BMI is 22.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Refer for cognitive behavioral therapy",
        "Start fluoxetine",
        "Order a thyroid function test",
        "Schedule a follow-up appointment in 3 months"
      ],
      "answer": "Refer for cognitive behavioral therapy",
      "rationale": "Cognitive behavioral therapy (CBT) is the first-line treatment for anxiety and depression in adolescents. It is essential to address her mental health concerns promptly.\n\nIncorrect because:\n- Start fluoxetine: While fluoxetine can be effective, therapy should be initiated first in mild to moderate cases.\n- Order a thyroid function test: This is unnecessary as there are no signs of thyroid dysfunction.\n- Schedule a follow-up appointment in 3 months: This does not address the patient's current mental health issues.\n\nKey takeaway: Early intervention with therapy is crucial for adolescent mental health issues.\n\nMemory hook: Remember CBT as the first-line treatment for adolescent anxiety and depression.\n\nClinical reasoning: Assess: 15-year-old female with anxiety and depression symptoms. Diagnose: Mild to moderate anxiety/depression. Plan: Refer for cognitive behavioral therapy. Evaluate: Monitor progress and response to therapy.\n\nWhy other options are incorrect:\n• Start fluoxetine: Incorrect because medication is not the first-line treatment for mild to moderate anxiety/depression in adolescents.\n• Order a thyroid function test: Incorrect because there are no clinical signs indicating thyroid dysfunction.\n• Schedule a follow-up appointment in 3 months: Incorrect because this does not provide immediate support for her mental health concerns.",
      "sources": [
        "USPSTF Recommendations on Depression in Adolescents"
      ],
      "difficulty": 5,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr82t5v0009s1yfvcxwvzyke",
      "stem": "An 8-year-old girl presents to the clinic with a 2-day history of fever, dysuria, and abdominal pain. She has a history of recurrent urinary tract infections. On examination, her temperature is 101°F, and a urinalysis shows positive leukocyte esterase and nitrites.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Start oral antibiotics",
        "Obtain a urine culture",
        "Order a renal ultrasound",
        "Prescribe analgesics for pain"
      ],
      "answer": "Obtain a urine culture",
      "rationale": "In cases of recurrent urinary tract infections, obtaining a urine culture is essential to identify the causative organism and guide appropriate antibiotic therapy. Starting antibiotics without culture may lead to inappropriate treatment.\n\nClinical reasoning: Assess: Child presents with fever and urinary symptoms. Diagnose: Likely UTI indicated by urinalysis. Plan: Obtain urine culture to identify pathogen. Evaluate: Monitor response to treatment once initiated.\n\nWhy other options are incorrect:\n• Start oral antibiotics: Incorrect because while antibiotics are needed, a culture should be obtained first to ensure the correct antibiotic is chosen.\n• Order a renal ultrasound: Incorrect because imaging is not indicated at this stage unless there are recurrent infections despite treatment.\n• Prescribe analgesics for pain: Incorrect because while pain management is important, it does not address the underlying infection.",
      "sources": [
        "Pediatric UTI Guidelines"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmr82t59i009m1yfvszvkwtg2",
      "stem": "A 7-year-old girl presents to the clinic with a 2-day history of ear pain and fever. On examination, her right tympanic membrane is bulging and erythematous. She has no known drug allergies and is otherwise healthy. Her temperature is 101.5°F.\n\nWhat is the most appropriate pharmacotherapy?",
      "options": [
        "Amoxicillin",
        "Azithromycin",
        "Ibuprofen",
        "Ciprofloxacin ear drops"
      ],
      "answer": "Amoxicillin",
      "rationale": "The most appropriate pharmacotherapy for this child with acute otitis media is amoxicillin, which is the first-line treatment according to the AAP guidelines. Azithromycin is not first-line and is generally used for penicillin-allergic patients. Ibuprofen is an analgesic and antipyretic but does not treat the underlying infection. Ciprofloxacin ear drops are not indicated for acute otitis media.\n\nClinical reasoning: Assess: The child has signs of acute otitis media. Diagnose: Acute bacterial otitis media. Plan: Initiate treatment with amoxicillin. Evaluate: Monitor symptoms and follow up if no improvement in 48-72 hours.\n\nWhy other options are incorrect:\n• Azithromycin: Incorrect because it is not first-line and is generally used for penicillin-allergic patients.\n• Ibuprofen: Incorrect because it does not treat the underlying infection.\n• Ciprofloxacin ear drops: Incorrect because they are not indicated for acute otitis media.",
      "sources": [
        "AAP Guidelines for Otitis Media"
      ],
      "difficulty": 3,
      "topic": null,
      "step": null
    }
  ],
  "usmle": [
    {
      "id": "cmrpvuvmj00011yh5nyuf41oi",
      "stem": "A 64-year-old woman presents to the emergency department with sudden right-sided weakness and slurred speech. Atrial fibrillation, not anticoagulated; hypertension. Vital signs: BP 178/96 mmHg, HR 88 irregular, RR 16, SpO₂ 98%. Physical examination: Right hemiparesis, right facial droop, dysarthria; NIHSS 12. Laboratory/imaging: Glucose 142 mg/dL, INR 1.1; noncontrast head CT: no hemorrhage.\n\nWhich mechanism best explains this patient's presentation?",
      "options": [
        "Embolic or thrombotic occlusion of cerebral artery (often cardioembolic from AF) → focal ischemia in MCA territory",
        "Lower motor neuron lesion at C5 causing isolated facial and arm weakness only",
        "Demyelinating plaque without vascular risk factors as most likely in hyperacute setting",
        "Metabolic encephalopathy without focal findings"
      ],
      "answer": "Embolic or thrombotic occlusion of cerebral artery (often cardioembolic from AF) → focal ischemia in MCA territory",
      "rationale": "Why this answer is correct\nThe patient's symptoms are best explained by embolic or thrombotic occlusion of a cerebral artery, often due to atrial fibrillation.\n• Atrial fibrillation increases the risk of embolic strokes due to the formation of clots in the heart.\n• The middle cerebral artery (MCA) is commonly affected, leading to focal ischemia.\n• Symptoms like hemiparesis and dysarthria align with MCA territory involvement.\nIn practice: Recognizing the mechanism of ischemic stroke is crucial for timely intervention. On the unit, this means understanding the need for anticoagulation and potential thrombolytic therapy.\nWhy the other options are wrong\n\nLower motor neuron lesion at C5 causing isolated facial and arm weakness only\n• Trap: Students may think this option fits because it describes weakness, but it does not account for the patient's full symptom profile.\n• Why it fails here: This option fails because the patient's symptoms include right hemiparesis and dysarthria, which are not consistent with a C5 lower motor neuron lesion, as that would typically affect only the arm and not cause facial droop.\n• Remember: The presence of facial droop and dysarthria indicates a more complex neurological issue, likely involving the MCA.\n\nDemyelinating plaque without vascular risk factors as most likely in hyperacute setting\n• Trap: This option may seem plausible due to the acute presentation, but it overlooks the patient's significant vascular risk factors.\n• Why it fails here: This fails here because demyelinating diseases like multiple sclerosis would not typically present with sudden onset weakness and speech difficulties without prior symptoms, and the patient's hypertension and atrial fibrillation suggest a vascular event.\n• Remember: Acute ischemic strokes are more likely in patients with vascular risk factors, especially in the context of atrial fibrillation.\n\nMetabolic encephalopathy without focal findings\n• Trap: Students might consider this option due to the patient's altered neurological status, but it does not explain the focal neurological deficits.\n• Why it fails here: This option fails because metabolic encephalopathy would present with diffuse symptoms rather than specific focal deficits like hemiparesis and facial droop.\n• Remember: The focal nature of the patient's symptoms points towards a localized brain injury, such as that seen in ischemic strokes.\nKey takeaway\nWhen assessing sudden neurological deficits, prioritize identifying ischemic strokes, especially in patients with atrial fibrillation.\n\nMemory hook: Think 'AFib = Stroke' to remember that atrial fibrillation can lead to embolic strokes.",
      "sources": [
        "USMLE Content Outline 2026: Hematology and Immunology"
      ],
      "difficulty": 4,
      "topic": null,
      "step": "Step 1"
    },
    {
      "id": "cmrruxu8900m01y8wuxr4h9ab",
      "stem": "A 19-year-old man presents to the emergency department with fever, headache, neck stiffness, and photophobia. College dormitory resident; no recent travel; no immunocompromising conditions. Vital signs: BP 110/68 mmHg, HR 118, RR 20, temp 102.8°F (39.3°C). Physical examination: Nuchal rigidity, Kernig and Brudzinski signs positive; no focal deficits. Laboratory/imaging: WBC 18,000/mm³; lumbar puncture: CSF WBC 1,200/mm³ (90% neutrophils), glucose 28 mg/dL, protein 220 mg/dL.\n\nWhich pathophysiologic process is most likely responsible for this patient's presentation?",
      "options": [
        "Viral lymphocytic pleocytosis with normal CSF glucose",
        "Ruptured berry aneurysm causing xanthochromia without infection",
        "Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein",
        "Autoimmune demyelination as acute febrile meningismus"
      ],
      "answer": "Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein",
      "rationale": "Why this answer is correct\nThe patient's symptoms are due to pathogenic bacteria crossing the blood-brain barrier, leading to neutrophilic pleocytosis, low CSF glucose, and elevated protein.\n• Bacterial meningitis is characterized by a high white blood cell count with a predominance of neutrophils in the cerebrospinal fluid (CSF).\n• In bacterial infections, the blood-brain barrier is compromised, allowing bacteria to invade the central nervous system.\n• This results in low glucose levels in the CSF due to bacterial consumption and elevated protein levels due to inflammation.\nIn practice: Recognizing these signs is crucial for timely diagnosis and treatment of bacterial meningitis, which can lead to serious complications if not addressed quickly.\nWhy the other options are wrong\n\nViral lymphocytic pleocytosis with normal CSF glucose\n• Trap: Students may confuse viral meningitis with bacterial meningitis due to overlapping symptoms.\n• Why it fails here: In viral meningitis, CSF typically shows a lymphocytic pleocytosis with normal glucose levels, which does not match this patient's low glucose and neutrophilic predominance.\n• Remember: Understanding the differences in CSF profiles between viral and bacterial meningitis is essential for accurate diagnosis.\n\nRuptured berry aneurysm causing xanthochromia without infection\n• Trap: This option may seem plausible due to the patient's severe headache and neck stiffness.\n• Why it fails here: A ruptured berry aneurysm would lead to xanthochromia (yellowish discoloration of CSF) and typically presents with a sudden severe headache, not the signs of infection seen here.\n• Remember: Recognizing that xanthochromia is not present in this case helps differentiate between types of neurological emergencies.\n\nAutoimmune demyelination as acute febrile meningismus\n• Trap: Students might think autoimmune conditions can present similarly to infections.\n• Why it fails here: Autoimmune demyelination does not typically cause the marked neutrophilic pleocytosis or low glucose levels seen in this patient’s CSF analysis.\n• Remember: Differentiating between infectious and autoimmune processes is key to understanding the underlying pathology.\nKey takeaway\nWhen evaluating meningitis, prioritize CSF findings: neutrophilic pleocytosis and low glucose suggest bacterial infection.\n\nMemory hook: Remember: Bacterial meningitis = Neutrophils + Low glucose + High protein.",
      "sources": [
        "USMLE Content Outline 2026"
      ],
      "difficulty": 4,
      "topic": null,
      "step": "Step 1"
    },
    {
      "id": "cmqgt4qon00011y0qjb123mqg",
      "stem": "A 28-year-old woman presents to the clinic for a routine check-up. She has a history of irregular menstrual cycles and is currently taking a combined oral contraceptive pill. During the visit, her blood pressure is measured at 150/95 mm Hg. She denies headaches, visual changes, or any other symptoms. Recent lab results show a serum potassium level of 4.5 mEq/L and a serum creatinine level of 0.8 mg/dL.\n\nWhich of the following best explains the patient's finding?",
      "options": [
        "The combined oral contraceptive pill can cause an increase in blood pressure due to estrogen-induced fluid retention.",
        "The patient's elevated blood pressure is likely due to renal artery stenosis, which is common in young women.",
        "The combined oral contraceptive pill directly causes renal dysfunction leading to hypertension.",
        "The patient's blood pressure is elevated due to an underlying hyperaldosteronism unrelated to her contraceptive use."
      ],
      "answer": "The combined oral contraceptive pill can cause an increase in blood pressure due to estrogen-induced fluid retention.",
      "rationale": "Why this answer is correct\nThe combined oral contraceptive pill can cause an increase in blood pressure due to estrogen-induced fluid retention.\n• Estrogen can stimulate the renin-angiotensin-aldosterone system.\n• This leads to sodium and water retention, which increases blood volume.\n• Elevated blood volume can result in increased blood pressure.\nIn practice: On the unit, this means that healthcare providers should monitor blood pressure in women taking combined oral contraceptives, especially those with a history of hypertension or irregular cycles.\nWhy the other options are wrong\n\nThe patient's elevated blood pressure is likely due to renal artery stenosis, which is common in young women.\n• Trap: Students may think renal artery stenosis is a frequent cause of hypertension in young women.\n• Why it fails here: Renal artery stenosis is relatively rare in this demographic and typically presents with specific symptoms such as abdominal or flank pain, and not just isolated hypertension.\n• Remember: Understanding the common causes of hypertension helps differentiate between potential diagnoses.\n\nThe combined oral contraceptive pill directly causes renal dysfunction leading to hypertension.\n• Trap: There is a belief that hormonal contraceptives directly impair kidney function.\n• Why it fails here: The combined oral contraceptive pill does not cause renal dysfunction; rather, it can lead to fluid retention and increased blood pressure without affecting renal function, as indicated by normal creatinine levels.\n• Remember: Recognizing the pharmacological effects of contraceptives is crucial in understanding their impact on blood pressure.\n\nThe patient's blood pressure is elevated due to an underlying hyperaldosteronism unrelated to her contraceptive use.\n• Trap: Students might assume that any case of hypertension in a young woman must be due to a primary endocrine disorder like hyperaldosteronism.\n• Why it fails here: While hyperaldosteronism can cause hypertension, the patient's normal potassium level and lack of symptoms suggest that her elevated blood pressure is more likely related to her contraceptive use rather than an underlying endocrine disorder.\n• Remember: Differentiating between causes of hypertension is essential for appropriate management and understanding of the patient's condition.\nKey takeaway\nWhen evaluating hypertension in women on combined oral contraceptives, consider estrogen's role in fluid retention first.\n\nMemory hook: Think 'Estrogen = Extra Fluid = Elevated Pressure' to remember how combined oral contraceptives can affect blood pressure.",
      "sources": [
        "Pharmacology of contraceptives and their effects on blood pressure"
      ],
      "difficulty": 4,
      "topic": null,
      "step": "Step 1"
    },
    {
      "id": "cmr8atu83000c1ylo3l86gwib",
      "stem": "A 32-year-old woman presents to the emergency department with anaphylaxis after eating peanuts. She has a history of asthma and reports difficulty breathing, hives, and swelling of the lips and tongue. Her vital signs show a blood pressure of 80/50 mm Hg and a heart rate of 120 bpm.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Administer epinephrine intramuscularly",
        "Provide intravenous fluids",
        "Start corticosteroids",
        "Administer antihistamines"
      ],
      "answer": "Administer epinephrine intramuscularly",
      "rationale": "The correct answer is to administer epinephrine intramuscularly, as it is the first-line treatment for anaphylaxis. The patient's severe symptoms and hypotension indicate a life-threatening situation requiring immediate action. Providing intravenous fluids does not treat the reaction. Corticosteroids are not first-line in acute management. Antihistamines are not sufficient alone for anaphylaxis.\n\nClinical reasoning: Assess the patient's presentation of anaphylaxis, including respiratory distress and hypotension. Analyze the need for immediate intervention to stabilize the patient. Integrate the urgency of administering epinephrine to effectively treat the anaphylactic reaction.\n\nWhy other options are incorrect:\n• Provide intravenous fluids: While fluids are important for support, they do not treat the underlying anaphylactic reaction.\n• Start corticosteroids: Corticosteroids are not effective in the acute phase of anaphylaxis and should not delay epinephrine administration.\n• Administer antihistamines: Antihistamines can provide relief but are not adequate treatment for anaphylaxis on their own.",
      "sources": [
        "USMLE Step 2 CK Content Outline 2026"
      ],
      "difficulty": 3,
      "topic": null,
      "step": "Step 3"
    },
    {
      "id": "cmqxdeo7y009y1yma8dfh7bqf",
      "stem": "A 72-year-old man with a history of heart failure presents to the clinic for follow-up. He reports increased shortness of breath and swelling in his legs. His blood pressure is 150/90 mm Hg, and his heart rate is 88 bpm. A recent echocardiogram shows reduced ejection fraction of 35%.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Increase diuretic dose",
        "Start beta-blocker",
        "Initiate ACE inhibitor",
        "Refer for cardiac transplant evaluation"
      ],
      "answer": "Increase diuretic dose",
      "rationale": "Why this answer is correct\nIncreasing the diuretic dose is essential to relieve fluid overload in this patient.\n• Fluid overload is a common issue in heart failure, leading to symptoms like shortness of breath and leg swelling.\n• Diuretics are the first-line treatment for managing congestion in heart failure patients.\n• While other medications like beta-blockers and ACE inhibitors are important, they are not the immediate priority when a patient is symptomatic from fluid retention.\nIn practice: On the unit, this means promptly addressing symptoms of congestion to improve patient comfort and prevent further complications. Managing fluid overload can stabilize the patient before optimizing long-term heart failure therapy.\nWhy the other options are wrong\n\nStart beta-blocker\n• Trap: Students may think beta-blockers are always the first step in heart failure management.\n• Why it fails here: While beta-blockers are crucial for long-term management and reducing mortality, they do not address acute symptoms of fluid overload and can even worsen congestion if started in this situation.\n• Remember: This highlights the importance of prioritizing symptom relief in acute heart failure exacerbations.\n\nInitiate ACE inhibitor\n• Trap: There is a belief that starting ACE inhibitors is always the next step in heart failure management.\n• Why it fails here: ACE inhibitors are vital for heart failure treatment, but initiating them during an episode of fluid overload can lead to hypotension and worsen renal function; thus, they should be started after diuresis.\n• Remember: This reinforces the need to stabilize the patient’s condition before introducing new medications.\n\nRefer for cardiac transplant evaluation\n• Trap: Some may think that referral for transplant is appropriate whenever heart failure is severe.\n• Why it fails here: Referral for transplant evaluation is premature without first optimizing the patient's current medical therapy and addressing acute symptoms; it should be considered only after all medical options have been exhausted.\n• Remember: This emphasizes the importance of maximizing current treatment before considering advanced options like transplantation.\nKey takeaway\nWhen managing heart failure with fluid overload, always prioritize diuresis to relieve symptoms before considering other treatments.\n\nMemory hook: Think 'Diuretics first, then drugs' for heart failure management.",
      "sources": [
        "USMLE Content Outline 2026"
      ],
      "difficulty": 5,
      "topic": null,
      "step": "Step 2 CK"
    },
    {
      "id": "cmqxdeqp600an1ymata96p5ym",
      "stem": "A 62-year-old woman presents to the emergency department with a blood pressure of 180/110 mm Hg and a complaint of severe headache. She has a history of hypertension and is currently taking lisinopril. On examination, she is alert but anxious, and her heart rate is 88 bpm. A fundoscopic exam reveals bilateral retinal hemorrhages.\n\nWhat is the most likely underlying cause?",
      "options": [
        "Chronic kidney disease",
        "Pheochromocytoma",
        "Malignant hypertension",
        "Primary hyperaldosteronism"
      ],
      "answer": "Malignant hypertension",
      "rationale": "Why this answer is correct\nMalignant hypertension is the most likely underlying cause due to its association with severe blood pressure elevation and acute end-organ damage.\n• Malignant hypertension is characterized by extremely high blood pressure (often >180/120 mm Hg) and evidence of end-organ damage.\n• The presence of retinal hemorrhages in this patient indicates acute damage to the eyes, which is a hallmark of malignant hypertension.\n• This condition often occurs in patients with a history of poorly controlled hypertension.\nIn practice: In practice, recognizing malignant hypertension is crucial because it requires immediate intervention to prevent further organ damage. On the unit, this means monitoring for signs of end-organ damage and initiating aggressive blood pressure management.\nWhy the other options are wrong\n\nChronic kidney disease\n• Trap: Students may think chronic kidney disease is a likely cause due to its association with hypertension.\n• Why it fails here: However, chronic kidney disease typically leads to gradual hypertension rather than the acute, severe elevation seen here, and it does not usually present with immediate end-organ damage like retinal hemorrhages.\n• Remember: This highlights the importance of differentiating between chronic conditions and acute hypertensive crises.\n\nPheochromocytoma\n• Trap: This option may be chosen because pheochromocytoma is known to cause hypertension.\n• Why it fails here: Yet, pheochromocytoma usually presents with episodic hypertension and associated symptoms like palpitations or sweating, rather than the sustained severe hypertension and acute retinal findings seen in this case.\n• Remember: Understanding the pattern of blood pressure elevation is key in distinguishing between causes of hypertension.\n\nPrimary hyperaldosteronism\n• Trap: Students might select this due to its role in causing hypertension.\n• Why it fails here: However, primary hyperaldosteronism typically leads to chronic hypertension without the acute end-organ damage evidenced by the retinal hemorrhages in this patient.\n• Remember: Recognizing the acute nature of the symptoms is essential for accurate diagnosis.\nKey takeaway\nWhen faced with severe hypertension and acute end-organ damage, suspect malignant hypertension first.\n\nMemory hook: Remember: Malignant hypertension = Massive pressure + Major damage (like retinal hemorrhages).",
      "sources": [
        "USMLE Content Outline 2026"
      ],
      "difficulty": 4,
      "topic": null,
      "step": "Step 2 CK"
    },
    {
      "id": "cmrqhnxx8004u1ypxafpotgc2",
      "stem": "A 35-year-old woman visits her primary care physician due to concerns about irregular menstrual cycles and excessive hair growth. She has a BMI of 32 kg/m² and reports difficulty losing weight despite following a diet. On examination, her blood pressure is 130/85 mm Hg, and laboratory tests reveal a fasting glucose level of 110 mg/dL. She is worried about her fertility and suspects she may have polycystic ovary syndrome (PCOS).\n\nWhat is the most likely diagnosis for this patient?",
      "options": [
        "Polycystic ovary syndrome (PCOS)",
        "Hypothyroidism",
        "Cushing's syndrome",
        "Hyperprolactinemia",
        "Primary ovarian insufficiency"
      ],
      "answer": "Polycystic ovary syndrome (PCOS)",
      "rationale": "Why this answer is correct\nThe patient's symptoms strongly indicate polycystic ovary syndrome (PCOS).\n• Irregular menstrual cycles\n• Hirsutism (excessive hair growth) is common in PCOS, and is linked to hormonal imbalances.\n• Obesity and mild hyperglycemia are also associated with insulin resistance in PCOS.\n• PCOS can lead to fertility issues, which aligns with the patient's concerns.\nIn practice: On the unit, recognizing PCOS is crucial as it can lead to long-term health issues like diabetes and infertility. Early intervention can help manage symptoms and improve quality of life.\nWhy the other options are wrong\n\nHypothyroidism\n• Trap: Students may think hypothyroidism could explain weight gain and menstrual irregularities.\n• Why it fails here: However, hypothyroidism typically presents with fatigue, cold intolerance, and does not cause hirsutism.\n• Remember: This highlights the importance of distinguishing between hormonal causes of menstrual irregularities.\n\nCushing's syndrome\n• Trap: Some may confuse Cushing's syndrome with PCOS due to weight gain and menstrual irregularities.\n• Why it fails here: Cushing's syndrome usually presents with more pronounced signs of cortisol excess, such as facial rounding and skin changes, which are not mentioned in this case.\n• Remember: Recognizing the distinct features of Cushing's syndrome is essential for accurate diagnosis.\n\nHyperprolactinemia\n• Trap: Students might think hyperprolactinemia is a likely cause of menstrual irregularities.\n• Why it fails here: While it can cause menstrual irregularities, it typically presents with galactorrhea (milk production) and does not cause hirsutism.\n• Remember: This reinforces the need to consider the full symptom profile when diagnosing.\n\nPrimary ovarian insufficiency\n• Trap: Some may consider primary ovarian insufficiency due to irregular cycles.\n• Why it fails here: This condition usually occurs in younger women and presents with amenorrhea rather than irregular cycles, which is not the case here.\n• Remember: Understanding the age-related presentation of ovarian insufficiency is key to accurate diagnosis.\nKey takeaway\nWhen evaluating menstrual irregularities, consider PCOS first if accompanied by hirsutism and obesity.\n\nMemory hook: Think 'PCOS' when you see 'irregular cycles + hirsutism + obesity'!",
      "sources": [
        "USMLE Content Outline 2026"
      ],
      "difficulty": 5,
      "topic": null,
      "step": "Step 2 CK"
    },
    {
      "id": "cmr8e5wm9016z1ylomlk2yqs8",
      "stem": "A 72-year-old woman with a history of chronic obstructive pulmonary disease (COPD) and hypertension presents to the emergency department with severe shortness of breath and a productive cough. She is currently taking a long-acting beta-agonist and a corticosteroid. On examination, her respiratory rate is 28 breaths per minute, oxygen saturation is 85% on room air, and bilateral wheezing is noted. Arterial blood gas analysis reveals a pH of 7.32, PaCO2 of 60 mmHg, and PaO2 of 55 mmHg, indicating acute respiratory failure due to hypercapnia and hypoxemia.\n\nWhat is the most appropriate next step in management?",
      "options": [
        "Initiate non-invasive positive pressure ventilation (NIPPV)",
        "Administer intravenous corticosteroids",
        "Start intravenous antibiotics",
        "Perform intubation"
      ],
      "answer": "Initiate non-invasive positive pressure ventilation (NIPPV)",
      "rationale": "The correct answer is to initiate non-invasive positive pressure ventilation (NIPPV) as this patient is experiencing acute respiratory failure due to COPD exacerbation, evidenced by her hypoxemia and hypercapnia. NIPPV can improve gas exchange and reduce the work of breathing. Administering intravenous corticosteroids is also important but is not the immediate next step in acute respiratory management. Starting intravenous antibiotics is not indicated unless there is evidence of infection, which is not present here. Intubation is a last resort and is not the first-line approach in this scenario where NIPPV can be utilized effectively.\n\nClinical reasoning: Assess the patient's respiratory status and ABG results to identify acute respiratory failure. Analyze the need for immediate intervention to improve oxygenation and ventilation. Integrate the use of NIPPV as a non-invasive method to manage her condition effectively.\n\nWhy other options are incorrect:\n• Administer intravenous corticosteroids: While corticosteroids are crucial in managing COPD exacerbations, they do not address the immediate respiratory failure and are not the first step in this acute setting.\n• Start intravenous antibiotics: There is no evidence of infection in this case, as indicated by the absence of infiltrates on chest X-ray and the clinical presentation, making antibiotics unnecessary.\n• Perform intubation: Intubation is reserved for cases where NIPPV fails or in severe respiratory distress; it is not the first-line intervention in this patient who can potentially benefit from NIPPV.\n\nClinical reasoning: The patient's presentation of severe shortness of breath, hypoxemia, and hypercapnia indicates acute respiratory failure, likely due to a COPD exacerbation. Immediate management should focus on improving ventilation and oxygenation, making NIPPV the most appropriate next step.\n\nWhy other options are incorrect:\n• Administer intravenous corticosteroids: While corticosteroids are important for managing COPD exacerbations, they do not provide immediate relief for respiratory failure and should not be prioritized over NIPPV.\n• Start intravenous antibiotics: There is no clinical evidence of infection, such as infiltrates on chest X-ray, making antibiotics unnecessary at this time.\n• Perform intubation: Intubation is typically reserved for cases where non-invasive measures fail or in extreme respiratory distress; it is not the first-line intervention in this scenario.",
      "sources": [
        "GOLD Guidelines for COPD Management"
      ],
      "difficulty": 3,
      "topic": null,
      "step": "Step 3"
    },
    {
      "id": "cmr4ftfn801z71ykyixvm4ccc",
      "stem": "A 45-year-old woman with a history of major depressive disorder presents to the emergency department after taking an overdose of sertraline, her prescribed selective serotonin reuptake inhibitor. She is alert but exhibits anxiety, with a blood pressure of 130/85 mm Hg and a heart rate of 110 bpm. The physician is concerned about the development of serotonin syndrome due to the overdose, and the patient has no other significant medical history or current medications.\n\nWhat is the most appropriate next step in the management of this patient?",
      "options": [
        "Administer activated charcoal",
        "Initiate intravenous fluids",
        "Start a serotonin antagonist",
        "Monitor in a psychiatric unit",
        "Provide supportive care and observation"
      ],
      "answer": "Provide supportive care and observation",
      "rationale": "Why this answer is correct\nProviding supportive care and observation is the best initial management for this patient.\n• Supportive care is crucial in managing mild cases of overdose, especially when the patient is stable.\n• The patient is alert and has stable vital signs, indicating that aggressive interventions are unnecessary.\n• Monitoring for any progression of symptoms is essential to ensure patient safety.\nIn practice: In practice, this means closely observing the patient for any signs of serotonin syndrome while providing reassurance and comfort. Supportive care can prevent complications and ensure a safe recovery.\nWhy the other options are wrong\n\nAdminister activated charcoal\n• Trap: Students may think activated charcoal is always the first step in overdose management.\n• Why it fails here: Activated charcoal is only indicated if the overdose occurred within the last hour and the patient is not at risk for airway compromise, which is not specified here.\n• Remember: This highlights the importance of assessing the timing of the overdose and the patient's stability before administering activated charcoal.\n\nInitiate intravenous fluids\n• Trap: There is a belief that IV fluids are always necessary in overdose cases.\n• Why it fails here: While IV fluids can be part of supportive care, they are not the primary intervention for a stable patient like this one.\n• Remember: This emphasizes that the patient's current stability allows for observation rather than immediate IV fluid administration.\n\nStart a serotonin antagonist\n• Trap: Students might assume that serotonin antagonists are needed for any case of suspected serotonin syndrome.\n• Why it fails here: Serotonin antagonists are not routinely used in mild cases of serotonin syndrome, especially when the patient is stable.\n• Remember: This reinforces the understanding that treatment should be tailored to the severity of the symptoms.\n\nMonitor in a psychiatric unit\n• Trap: There may be a tendency to think that psychiatric monitoring is the immediate priority in all overdose cases.\n• Why it fails here: While psychiatric monitoring may be necessary later, the immediate focus should be on supportive care and observation for this stable patient.\n• Remember: This illustrates the need to prioritize immediate medical stabilization before considering psychiatric interventions.\nKey takeaway\nWhen managing a stable patient with an overdose, prioritize supportive care and observation first.\n\nMemory hook: Think 'S.O.S.' — Supportive care, Observation, Safety.",
      "sources": [
        "USMLE Content Outline 2026"
      ],
      "difficulty": 4,
      "topic": null,
      "step": "Step 3"
    },
    {
      "id": "cmr4fl4if01we1ykyxdu13ktx",
      "stem": "A 30-year-old woman presents to her primary care physician for a routine check-up. She expresses concern about her weight, noting a BMI of 29, and reports feeling fatigued lately. Her blood pressure is measured at 130/85 mm Hg, and lab results show a fasting glucose of 110 mg/dL and a total cholesterol of 240 mg/dL. She has a family history of type 2 diabetes and cardiovascular disease, which raises her risk for metabolic syndrome.\n\nWhat is the most appropriate initial management for this patient?",
      "options": [
        "Start metformin",
        "Recommend lifestyle modifications",
        "Initiate statin therapy",
        "Order a fasting lipid panel",
        "Refer to a dietitian"
      ],
      "answer": "Recommend lifestyle modifications",
      "rationale": "Why this answer is correct\nRecommending lifestyle modifications is the best initial management for this patient.\n• Lifestyle modifications like diet and exercise are the first-line treatment for metabolic syndrome.\n• They can significantly improve weight, blood glucose, and cholesterol levels.\n• Starting medications like metformin or statins is reserved for when lifestyle changes are insufficient.\nIn practice: In practice, addressing lifestyle factors can lead to substantial health improvements and reduce the risk of diabetes and cardiovascular disease, which is crucial for this patient's long-term health.\nWhy the other options are wrong\n\nStart metformin\n• Trap: Students may think that starting medication is always the first step for elevated glucose levels.\n• Why it fails here: Metformin is typically considered after lifestyle modifications have been attempted and if glucose levels remain high.\n• Remember: This highlights the importance of trying non-pharmacological interventions first in managing metabolic syndrome.\n\nInitiate statin therapy\n• Trap: There may be a belief that high cholesterol levels necessitate immediate statin therapy.\n• Why it fails here: Statin therapy is not indicated without established cardiovascular disease or significantly elevated LDL levels, which this patient does not have.\n• Remember: This reinforces the need to assess the overall clinical picture before starting medications.\n\nOrder a fasting lipid panel\n• Trap: Students might think that additional testing is always required to confirm known lab results.\n• Why it fails here: Since her cholesterol levels are already known and elevated, ordering another lipid panel is unnecessary at this stage.\n• Remember: This emphasizes the importance of using existing data effectively rather than over-testing.\n\nRefer to a dietitian\n• Trap: There can be a tendency to think that specialized dietary advice is the first step in managing weight and metabolic issues.\n• Why it fails here: While a dietitian can provide valuable support, the initial step should be direct lifestyle modifications that the patient can implement immediately.\n• Remember: This illustrates the need to empower patients with actionable changes before seeking specialized help.\nKey takeaway\nWhen managing metabolic syndrome, prioritize lifestyle modifications before considering medications.\n\nMemory hook: Think 'Lifestyles first, meds later' for metabolic health!",
      "sources": [
        "USMLE Step 2 CK Content Outline 2026"
      ],
      "difficulty": 3,
      "topic": null,
      "step": "Step 3"
    }
  ],
  "npte-pt": [
    {
      "id": "cmqgz0bek000y1ybmfw23n2uk",
      "stem": "A 75-year-old female patient with type 2 diabetes presents to the outpatient clinic for a follow-up visit. She reports increased fatigue and difficulty with her daily exercises over the past month. Her blood glucose levels have been fluctuating, and she has a history of peripheral neuropathy. Physical examination reveals decreased sensation in her feet and a BMI of 32.\n\nWhich examination technique is most appropriate to assess the patient's current functional capacity for exercise?",
      "options": [
        "Timed Up and Go test",
        "Six-Minute Walk Test",
        "Berg Balance Scale",
        "Functional Reach Test"
      ],
      "answer": "Six-Minute Walk Test",
      "rationale": "The Six-Minute Walk Test (6MWT) is an effective measure of functional capacity, particularly in older adults with chronic conditions like diabetes. It assesses the distance a patient can walk in six minutes, providing insight into their aerobic capacity and endurance. In this case, the patient's increased fatigue and difficulty with exercises suggest a need to evaluate her functional capacity objectively. The Timed Up and Go test focuses more on balance and mobility rather than endurance. The Berg Balance Scale assesses balance, while the Functional Reach Test evaluates balance stability but does not provide a comprehensive measure of exercise capacity. Therefore, the 6MWT is the most appropriate technique for this patient. (Reference: ATS Statement: Guidelines for the Six-Minute Walk Test.)",
      "sources": [],
      "difficulty": 4,
      "topic": "diabetes exercise",
      "step": null
    },
    {
      "id": "cmqgyx3jb00031yl0llce43fq",
      "stem": "An 80-year-old male recently discharged from the hospital after a myocardial infarction (MI) is referred to cardiac rehabilitation. He reports fatigue and shortness of breath with minimal exertion. The physical therapist is developing a rehabilitation plan to improve his cardiovascular fitness.\n\nWhat is the most appropriate initial intervention for this patient?",
      "options": [
        "Progressive resistance training",
        "Aerobic exercise at low intensity",
        "High-intensity interval training",
        "Stretching exercises"
      ],
      "answer": "Aerobic exercise at low intensity",
      "rationale": "B (Aerobic exercise at low intensity) is correct. He is 80, was recently discharged after a myocardial infarction and has fatigue and shortness of breath with minimal exertion, so cardiac rehabilitation should start with aerobic exercise at a low intensity and progress as his symptoms and tolerance allow; this is what improves cardiovascular fitness. \"Progressive resistance training\" is wrong: resistance work is added once an aerobic base is established, not as the first intervention for a patient who is short of breath on minimal exertion. \"High-intensity interval training\" is wrong: interval training is used in some stable cardiac rehabilitation patients, but it is not a safe starting dose for an 80-year-old who is symptomatic on minimal exertion. \"Stretching exercises\" is wrong: flexibility work can be part of a session, but it does not improve the cardiovascular fitness that the plan is aiming for.",
      "sources": [],
      "difficulty": 4,
      "topic": "post MI rehab",
      "step": null
    },
    {
      "id": "cmqh1jrbv00151yz8vfc18u4s",
      "stem": "A 55-year-old male patient is being treated in an outpatient clinic after a total knee arthroplasty. He is experiencing pain and limited range of motion. The physical therapist is considering the most appropriate examination technique to assess his knee function.\n\nWhat is the most appropriate examination technique to evaluate knee range of motion in this patient?",
      "options": [
        "Goniometry",
        "Visual inspection",
        "Palpation",
        "Functional mobility tests"
      ],
      "answer": "Goniometry",
      "rationale": "Goniometry is the most appropriate examination technique for accurately measuring the range of motion in the knee joint after total knee arthroplasty. This objective measurement allows the therapist to quantify the patient's progress and determine the effectiveness of the rehabilitation program. Visual inspection may provide some insight but is subjective and not as reliable as goniometric measurements. Palpation can help assess joint integrity but does not provide quantitative data on range of motion. Functional mobility tests are useful for assessing overall function but do not specifically measure range of motion.",
      "sources": [],
      "difficulty": 4,
      "topic": "total knee arthroplasty",
      "step": null
    },
    {
      "id": "cmqh086k5000d1yayd1jkz9kz",
      "stem": "A 35-year-old male presents to the outpatient clinic with chronic shoulder pain following a rotator cuff repair 6 months ago. He reports difficulty lifting his arm overhead and has been experiencing stiffness in the shoulder joint. Physical examination reveals limited active range of motion, particularly in external rotation, and tenderness over the greater tuberosity.\n\nWhat is the most appropriate examination technique to assess the integrity of the rotator cuff in this patient?",
      "options": [
        "Empty can test",
        "Hawkins-Kennedy test",
        "Neer test",
        "Cross-body adduction test"
      ],
      "answer": "Empty can test",
      "rationale": "The empty can test assesses the supraspinatus, a key part of the rotator cuff. After a rotator cuff repair, limited overhead reach and tenderness over the greater tuberosity make this the test that matches the question. The Hawkins-Kennedy and Neer tests look for subacromial impingement rather than cuff integrity. The cross-body adduction test assesses the acromioclavicular joint, not the rotator cuff.",
      "sources": [],
      "difficulty": 3,
      "topic": "rotator cuff",
      "step": null
    },
    {
      "id": "cmqxb2ny300011y8g447px6ny",
      "stem": "A 30-year-old male with a spinal cord injury at the C6 level is undergoing rehabilitation. The physical therapist is assessing his functional capabilities. The patient demonstrates some wrist extension but has no hand function. He is motivated to improve his independence.\n\nWhat is the most appropriate outcome measure to assess this patient's progress in rehabilitation?",
      "options": [
        "Functional Independence Measure (FIM)",
        "Berg Balance Scale",
        "Timed Up and Go Test",
        "Spinal Cord Independence Measure (SCIM)"
      ],
      "answer": "Spinal Cord Independence Measure (SCIM)",
      "rationale": "D (Spinal Cord Independence Measure (SCIM)) is correct. He has a C6 spinal cord injury with some wrist extension and no hand function and wants to improve his independence. The SCIM is built for spinal cord injury and rates independence in self-care, respiration and sphincter management, and mobility, so it shows the gains that matter at this level of injury and is the best choice when it is offered. \"Functional Independence Measure (FIM)\" is wrong: the FIM is a valid general measure of disability, but it is not specific to spinal cord injury and is less sensitive to the changes this patient is working on. \"Berg Balance Scale\" is wrong: it scores standing balance tasks and does not measure independence in self-care or mobility. \"Timed Up and Go Test\" is wrong: it times rising, walking and turning, so it measures walking mobility and fall risk rather than overall independence after a cervical injury.",
      "sources": [],
      "difficulty": 3,
      "topic": null,
      "step": null
    },
    {
      "id": "cmqgz5mht002p1y850mcoznsl",
      "stem": "A 30-year-old female athlete presents to the clinic with a laceration on her right forearm sustained during a soccer match. The wound is approximately 5 cm long and has moderate bleeding. The physical therapist is assessing the wound and planning for appropriate management.\n\nWhat is the most appropriate initial management step for this laceration?",
      "options": [
        "Apply a hydrocolloid dressing",
        "Clean the wound with saline and apply pressure",
        "Suture the wound immediately",
        "Apply an antibiotic ointment and cover"
      ],
      "answer": "Clean the wound with saline and apply pressure",
      "rationale": "B (Clean the wound with saline and apply pressure) is correct. She has a 5 cm forearm laceration with moderate bleeding, so the first priority is direct pressure until the bleeding is controlled; once bleeding is controlled the wound is cleaned with saline so that it can be assessed. This option is the only one that includes both bleeding control and cleaning. \"Apply a hydrocolloid dressing\" is wrong: an occlusive dressing is not used on a fresh bleeding laceration that has not been cleaned or assessed. \"Suture the wound immediately\" is wrong: closure is done by a qualified provider after bleeding is controlled and the wound has been cleaned and assessed, and it is not the initial step. \"Apply an antibiotic ointment and cover\" is wrong: covering a wound that has not been cleaned can trap debris, and it does nothing to stop the bleeding.",
      "sources": [],
      "difficulty": 4,
      "topic": "wound care",
      "step": null
    },
    {
      "id": "cmqh05w0t002g1yni8mmdu1ca",
      "stem": "A 55-year-old male patient with a history of lymphedema presents to the clinic for evaluation. He reports swelling in his left leg that worsens throughout the day. The physical examination reveals pitting edema and skin changes.\n\nWhat is the best explanation for the findings observed in this patient?",
      "options": [
        "Venous insufficiency",
        "Lymphatic obstruction",
        "Heart failure",
        "Deep vein thrombosis"
      ],
      "answer": "Lymphatic obstruction",
      "rationale": "B (Lymphatic obstruction) is correct. He is 55, has a known history of lymphedema, and now has swelling of the left leg that worsens throughout the day, with pitting edema and skin changes. With a documented history of lymphedema, impaired lymphatic drainage is the most likely explanation for one-sided leg swelling of this kind. \"Venous insufficiency\" is wrong: it can also cause leg swelling, pitting and skin changes, but it does not account for his known lymphatic disease, so it is the less likely explanation here. \"Heart failure\" is wrong: heart failure usually causes swelling of both legs, not one. \"Deep vein thrombosis\" is wrong: the stem describes swelling that builds through the day in a known lymphedema limb rather than a sudden change, although new or acutely worse one-sided swelling still needs DVT ruled out.",
      "sources": [],
      "difficulty": 4,
      "topic": "lymphedema",
      "step": null
    },
    {
      "id": "cmqh0xw7u001j1ydqm0pg98yn",
      "stem": "A 60-year-old male presents to a physical therapy clinic with complaints of urinary incontinence. He has a history of benign prostatic hyperplasia and has been experiencing increased urgency and frequency of urination. The therapist is developing a treatment plan and is considering the best progression for pelvic floor muscle training.\n\nWhat is the most appropriate progression for this patient's pelvic floor muscle training?",
      "options": [
        "Start with isometric contractions followed by functional tasks",
        "Begin with functional tasks before isometric contractions",
        "Focus solely on relaxation techniques initially",
        "Incorporate high-resistance training immediately"
      ],
      "answer": "Start with isometric contractions followed by functional tasks",
      "rationale": "For this patient with urinary incontinence, starting with isometric contractions of the pelvic floor muscles is the most appropriate progression. This approach allows the patient to develop strength and control of the pelvic floor before moving on to functional tasks that require coordination and integration of these muscles in daily activities. Beginning with functional tasks may overwhelm the patient if they lack the foundational strength. Focusing solely on relaxation techniques does not address the need for muscle strengthening, which is critical for managing incontinence. High-resistance training is not appropriate for initial pelvic floor training, as it may lead to muscle fatigue or injury. Thus, the correct progression is to start with isometric contractions and gradually incorporate functional tasks.",
      "sources": [],
      "difficulty": 4,
      "topic": "incontinence",
      "step": null
    },
    {
      "id": "cmqxb529h000b1y37ftezxw9g",
      "stem": "A 60-year-old male patient in an acute care setting is recovering from hip replacement surgery. The physical therapist is planning to initiate mobility training and needs to ensure safe body mechanics during transfers. The patient is currently using a walker and reports moderate pain during movement.\n\nWhat is the most appropriate progression for this patient’s mobility training?",
      "options": [
        "Begin with sit-to-stand transfers without assistance",
        "Instruct the patient to use a wheelchair for all transfers",
        "Progress to standing balance exercises with minimal support",
        "Encourage ambulation with the walker for short distances"
      ],
      "answer": "Encourage ambulation with the walker for short distances",
      "rationale": "D (Encourage ambulation with the walker for short distances) is correct. He is 60, in acute care after hip replacement surgery, already using a walker and reporting moderate pain with movement. Walking short distances with the walker he already uses gets him moving early while the walker gives stable support, and the distance can be increased as his pain and tolerance allow, so it is the most appropriate progression. \"Begin with sit-to-stand transfers without assistance\" is wrong: removing assistance this early after surgery, with moderate pain on movement, raises the risk of a fall. \"Instruct the patient to use a wheelchair for all transfers\" is wrong: relying on a wheelchair for every transfer limits his mobility and slows his return to functional independence. \"Progress to standing balance exercises with minimal support\" is wrong: reducing support for standing balance work this soon after surgery could lead to instability and falls, and it does not progress his walking.",
      "sources": [],
      "difficulty": 3,
      "topic": "body mechanics",
      "step": null
    },
    {
      "id": "cmqh03mnr00091y1by7skmhet",
      "stem": "A 50-year-old male with Parkinson's disease presents for a follow-up physical therapy session. He reports increased difficulty with balance and coordination, particularly when turning. The therapist notes a shuffling gait pattern and reduced arm swing during ambulation.\n\nWhat is the most appropriate modality parameter to incorporate into this patient's treatment plan?",
      "options": [
        "Electrical stimulation for muscle strengthening",
        "Vestibular rehabilitation exercises",
        "Aquatic therapy for gait training",
        "Visual cueing techniques during ambulation"
      ],
      "answer": "Visual cueing techniques during ambulation",
      "rationale": "Visual cueing techniques help patients with Parkinson disease improve a shuffling gait and reduce freezing. This patient has a shuffling gait, reduced arm swing, and trouble turning, so visual cues during walking match the problem. Electrical stimulation does not address that gait pattern. Vestibular rehabilitation is not the first focus here. Aquatic therapy can help some people, but it is not the specific cue this gait needs. Visual cueing during ambulation is the best choice of the options listed.",
      "sources": [],
      "difficulty": 4,
      "topic": "Parkinson",
      "step": null
    }
  ]
};
