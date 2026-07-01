/**
 * Community NCLEX-RN practice pack (40 items) — OER-style stems with brief rationales.
 * Imported via scripts/ingest-nclex-community-pack.ts → AI elevation for best-tier QA.
 */
import type { BankItem } from "@/lib/question-bank";

export type CommunityNclexItem = {
  subjectId: string;
  topicCategory: string;
  question: string;
  options: [string, string, string, string];
  correctLetter: "A" | "B" | "C" | "D";
  rationale: string;
};

/** Retired after import QA — AI curation yields duplicate_vignette_in_stem / weak rationales. */
export const COMMUNITY_NCLEX_PRACTICE_RETIRED_INDICES = new Set([2, 7, 37]);

export const COMMUNITY_NCLEX_PRACTICE_40: CommunityNclexItem[] = [
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question:
      "A nurse is caring for a client who is 2 days postoperative following abdominal surgery. Which finding should the nurse report to the provider immediately?",
    options: [
      "Temperature of 100.4°F (38°C)",
      "Serosanguinous drainage on the dressing",
      "Absent bowel sounds in all quadrants",
      "Client reports incisional pain rated 4/10",
    ],
    correctLetter: "C",
    rationale: "Absent bowel sounds may indicate ileus and require provider notification.",
  },
  {
    subjectId: "basic-care-comfort",
    topicCategory: "Basic Care & Comfort",
    question:
      "A client with a new colostomy is being discharged. Which statement by the client indicates a need for further teaching?",
    options: [
      "I will change the pouch when it is one-third full.",
      "I should avoid foods like popcorn and nuts.",
      "I will empty the pouch when it is half full.",
      "I can shower with the pouch on.",
    ],
    correctLetter: "C",
    rationale: "The pouch should be emptied when one-third full to prevent leakage.",
  },
  {
    subjectId: "management-of-care",
    topicCategory: "Management of Care",
    question: "The nurse is delegating tasks to assistive personnel. Which task is appropriate to delegate?",
    options: [
      "Teaching a client how to use an incentive spirometer",
      "Performing a sterile dressing change",
      "Assisting a client with ambulation after surgery",
      "Administering oral medications",
    ],
    correctLetter: "C",
    rationale: "Ambulation assistance is an appropriate delegated task for assistive personnel.",
  },
  {
    subjectId: "basic-care-comfort",
    topicCategory: "Basic Care & Comfort",
    question: "A nurse is assessing a client with a pressure injury. Which characteristic describes a Stage 3 pressure injury?",
    options: [
      "Non-blanchable erythema",
      "Full-thickness skin loss with visible subcutaneous fat",
      "Full-thickness tissue loss with exposed bone",
      "Partial-thickness loss involving epidermis and dermis",
    ],
    correctLetter: "B",
    rationale: "Stage 3 pressure injuries involve full-thickness skin loss with visible subcutaneous fat.",
  },
  {
    subjectId: "basic-care-comfort",
    topicCategory: "Basic Care & Comfort",
    question:
      "The nurse is preparing to administer a tube feeding via nasogastric tube. Which action is essential before starting the feeding?",
    options: [
      "Position the client in high Fowler's",
      "Verify tube placement with pH testing",
      "Flush the tube with 30 mL of water",
      "Aspirate 10 mL of gastric residual",
    ],
    correctLetter: "B",
    rationale: "Tube placement must be confirmed before enteral feeding to prevent aspiration.",
  },
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question:
      "A client is receiving oxygen at 6 L/min via nasal cannula. Which finding indicates the need to decrease the flow rate?",
    options: [
      "Respiratory rate of 24 breaths/min",
      "Oxygen saturation of 96%",
      "Nasal mucosa is dry and cracked",
      "Client complains of headache",
    ],
    correctLetter: "C",
    rationale: "Dry, cracked nasal mucosa suggests excessive oxygen flow via nasal cannula.",
  },
  {
    subjectId: "safety-infection",
    topicCategory: "Safety & Infection Control",
    question: "The nurse is teaching a client about hand hygiene. Which statement is correct?",
    options: [
      "Use alcohol-based sanitizer when hands are visibly soiled.",
      "Wash hands for at least 20 seconds with soap and water.",
      "Hot water is more effective than warm water.",
      "Antibacterial soap is required for all handwashing.",
    ],
    correctLetter: "B",
    rationale: "Handwashing with soap and water for at least 20 seconds is the standard.",
  },
  {
    subjectId: "management-of-care",
    topicCategory: "Management of Care",
    question: "Which client has the highest priority for the nurse to assess first?",
    options: [
      "A client who is 1 day postoperative and reports pain 6/10",
      "A client with COPD who has an oxygen saturation of 90% on room air",
      "A client with diabetes whose blood glucose is 250 mg/dL",
      "A client with a new cast who reports tingling in the fingers",
    ],
    correctLetter: "D",
    rationale: "Tingling with a new cast suggests neurovascular compromise — highest priority.",
  },
  {
    subjectId: "safety-infection",
    topicCategory: "Safety & Infection Control",
    question: "A nurse is caring for a client on contact precautions. Which action is appropriate?",
    options: [
      "Wear a gown and gloves when entering the room",
      "Place the client in a negative-pressure room",
      "Use an N95 respirator",
      "Keep the door closed at all times",
    ],
    correctLetter: "A",
    rationale: "Contact precautions require gown and gloves for room entry.",
  },
  {
    subjectId: "safety-infection",
    topicCategory: "Safety & Infection Control",
    question: "The nurse is evaluating a client's understanding of fall prevention. Which action demonstrates correct understanding?",
    options: [
      "Keeps the bed in the lowest position",
      "Uses the call light only when necessary",
      "Wears non-skid socks only at night",
      "Keeps the room lights off at night",
    ],
    correctLetter: "A",
    rationale: "Keeping the bed in the lowest position reduces fall risk.",
  },
  {
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "A client is prescribed digoxin 0.125 mg daily. Which finding should the nurse report before administering the dose?",
    options: [
      "Apical heart rate of 58 bpm",
      "Potassium level of 3.8 mEq/L",
      "Blood pressure of 118/76 mmHg",
      "Client reports nausea",
    ],
    correctLetter: "A",
    rationale: "Hold digoxin when apical heart rate is below 60 bpm.",
  },
  {
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question: "The nurse is administering vancomycin IV. Which action is essential?",
    options: [
      "Give the dose over 30 minutes",
      "Monitor for red-man syndrome",
      "Administer via IM injection if IV is unavailable",
      "Mix with heparin in the same line",
    ],
    correctLetter: "B",
    rationale: "Red-man syndrome is a key adverse effect of rapid vancomycin infusion.",
  },
  {
    subjectId: "reduction-risk",
    topicCategory: "Reduction of Risk Potential",
    question:
      "A client is receiving a blood transfusion. After 15 minutes, the client develops chills and a temperature rise of 1.8°F. What is the first action?",
    options: [
      "Slow the transfusion rate",
      "Stop the transfusion",
      "Notify the provider",
      "Administer acetaminophen",
    ],
    correctLetter: "B",
    rationale: "Stop the transfusion first when a reaction is suspected.",
  },
  {
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question: "The nurse is teaching a client prescribed warfarin. Which food should the client limit?",
    options: ["Bananas", "Leafy green vegetables", "Eggs", "Whole grains"],
    correctLetter: "B",
    rationale: "Vitamin K in leafy greens can affect INR stability on warfarin.",
  },
  {
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question: "A client with heart failure is prescribed furosemide. Which laboratory value should the nurse monitor?",
    options: ["Sodium", "Potassium", "Calcium", "Magnesium"],
    correctLetter: "B",
    rationale: "Loop diuretics increase potassium loss — monitor potassium closely.",
  },
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question:
      "A client with a suspected pulmonary embolism suddenly becomes dyspneic and anxious. Which action should the nurse take first?",
    options: ["Administer oxygen", "Notify the provider", "Place in Trendelenburg", "Obtain vital signs"],
    correctLetter: "A",
    rationale: "Airway and breathing support with oxygen is the first priority (ABCs).",
  },
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question: "The nurse is caring for a client with a chest tube. Which finding indicates an air leak?",
    options: [
      "Tidaling in the water seal chamber",
      "Bubbling in the suction control chamber",
      "Continuous bubbling in the water seal chamber",
      "Fluctuation with respirations",
    ],
    correctLetter: "C",
    rationale: "Continuous bubbling in the water seal chamber suggests an air leak.",
  },
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question: "A client with acute pancreatitis is NPO. Which intervention is most important?",
    options: [
      "Provide frequent mouth care",
      "Encourage clear liquids",
      "Position in low Fowler's",
      "Administer pain medication every 4 hours PRN",
    ],
    correctLetter: "A",
    rationale: "Mouth care maintains comfort while the client is NPO.",
  },
  {
    subjectId: "physiological-adaptation",
    topicCategory: "Physiological Adaptation",
    question: "The nurse is assessing a client with suspected meningitis. Which finding is most concerning?",
    options: [
      "Positive Kernig's sign",
      "Photophobia",
      "Nuchal rigidity",
      "Altered level of consciousness",
    ],
    correctLetter: "D",
    rationale: "Altered level of consciousness suggests increased ICP or neurologic decline.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A client with diabetes mellitus has a foot ulcer. Which instruction is most important?",
    options: [
      "Soak feet in warm water daily",
      "Apply lotion between the toes",
      "Inspect feet daily",
      "Wear open-toed shoes",
    ],
    correctLetter: "C",
    rationale: "Daily foot inspection helps detect injury early in diabetes.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A newborn is 24 hours old and has a bilirubin level of 12 mg/dL. Which action should the nurse anticipate?",
    options: [
      "Initiate phototherapy",
      "Encourage frequent feedings",
      "Prepare for exchange transfusion",
      "Place under bili lights immediately",
    ],
    correctLetter: "B",
    rationale: "Frequent feedings help reduce bilirubin in early newborn jaundice.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A laboring client at 38 weeks gestation has a fetal heart rate of 90 bpm. What is the priority action?",
    options: [
      "Reposition to left lateral",
      "Administer oxygen at 10 L/min",
      "Notify the provider",
      "Perform a vaginal exam",
    ],
    correctLetter: "A",
    rationale: "Left lateral positioning improves uteroplacental perfusion for fetal bradycardia.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A 6-month-old infant is admitted with dehydration. Which finding indicates moderate dehydration?",
    options: [
      "Sunken fontanels",
      "Normal skin turgor",
      "Moist mucous membranes",
      "Urine output 2 mL/kg/hr",
    ],
    correctLetter: "A",
    rationale: "Sunken fontanels are a sign of moderate dehydration in infants.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "The nurse is teaching a new mother about breastfeeding. Which statement indicates understanding?",
    options: [
      "I should feed every 4 hours.",
      "I should alternate breasts each feeding.",
      "I can use a pacifier between feedings.",
      "I should burp the baby after each breast.",
    ],
    correctLetter: "D",
    rationale: "Burping after each breast helps prevent gastric distention and fussiness.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A toddler is diagnosed with otitis media. Which teaching point is most important?",
    options: [
      "Complete the full course of antibiotics",
      "Use a cotton swab to clean ears",
      "Keep the child in a supine position",
      "Apply warm compresses continuously",
    ],
    correctLetter: "A",
    rationale: "Completing antibiotics prevents recurrence and resistance.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question:
      'A client with schizophrenia tells the nurse, "The FBI is listening to my conversations." Which response is therapeutic?',
    options: [
      "That must be very frightening for you.",
      "The FBI is not listening to you.",
      "Why do you think that?",
      "Let's change the subject.",
    ],
    correctLetter: "A",
    rationale: "Acknowledge feelings without reinforcing the delusion.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "The nurse is caring for a client with major depressive disorder. Which intervention is priority?",
    options: [
      "Encourage participation in group therapy",
      "Assess for suicidal ideation",
      "Promote expression of feelings",
      "Teach relaxation techniques",
    ],
    correctLetter: "B",
    rationale: "Suicide risk assessment is priority with major depressive disorder.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "A client in the emergency department reports domestic violence. What is the nurse's priority action?",
    options: [
      "Document the injuries with photographs",
      "Ensure the client's safety",
      "Refer to a shelter",
      "Call the police",
    ],
    correctLetter: "B",
    rationale: "Client safety is the immediate priority in domestic violence.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "The nurse is planning discharge for a client with hypertension. Which goal is most appropriate?",
    options: [
      "Client will lose 10 pounds in one month",
      "Client will verbalize two strategies to reduce sodium intake",
      "Client will exercise 60 minutes daily",
      "Client will check blood pressure weekly",
    ],
    correctLetter: "B",
    rationale: "Specific, measurable teaching goals support hypertension self-management.",
  },
  {
    subjectId: "pharmacology-nursing",
    topicCategory: "Pharmacological Therapies",
    question:
      "A client with alcohol use disorder is admitted. Which medication is most likely prescribed to prevent withdrawal seizures?",
    options: ["Disulfiram", "Naltrexone", "Chlordiazepoxide", "Acamprosate"],
    correctLetter: "C",
    rationale: "Benzodiazepines such as chlordiazepoxide treat alcohol withdrawal.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "The nurse is caring for a client experiencing a panic attack. Which action is most appropriate?",
    options: [
      "Leave the client alone to calm down",
      "Stay with the client and use calm, short statements",
      "Encourage deep breathing immediately",
      "Administer PRN lorazepam before symptoms peak",
    ],
    correctLetter: "B",
    rationale: "Staying with the client and calm communication reduces panic.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "A school-age child is being evaluated for ADHD. Which behavior supports the diagnosis?",
    options: [
      "Easily distracted and difficulty sustaining attention",
      "Prefers solitary play",
      "Excessive fear of separation",
      "Frequent nightmares",
    ],
    correctLetter: "A",
    rationale: "Inattention and distractibility are core ADHD symptoms.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "The community health nurse is planning an education session on immunizations. Which group should be prioritized?",
    options: [
      "Elderly clients over 65",
      "Parents of infants and toddlers",
      "Adolescents",
      "Pregnant women",
    ],
    correctLetter: "B",
    rationale: "Parents of young children are key for routine childhood immunization.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question:
      'A client with terminal cancer tells the nurse, "I\'m not ready to die." Which therapeutic response is best?',
    options: [
      "Would you like me to call the chaplain?",
      "Everyone feels that way at first.",
      "Tell me more about how you're feeling.",
      "You still have time to get your affairs in order.",
    ],
    correctLetter: "C",
    rationale: "Open-ended therapeutic communication encourages expression.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "The nurse is assessing a client with suspected anorexia nervosa. Which finding is expected?",
    options: ["Lanugo", "Tachycardia", "Hypertension", "Elevated body temperature"],
    correctLetter: "A",
    rationale: "Lanugo is a common finding in anorexia nervosa.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "A client is admitted involuntarily to the psychiatric unit. Which right does the client retain?",
    options: [
      "The right to refuse medications",
      "The right to leave against medical advice",
      "The right to refuse treatment",
      "The right to informed consent for procedures",
    ],
    correctLetter: "D",
    rationale: "Informed consent rights remain even with involuntary admission.",
  },
  {
    subjectId: "safety-infection",
    topicCategory: "Safety & Infection Control",
    question:
      "The nurse is teaching a client with tuberculosis about infection control. Which statement indicates understanding?",
    options: [
      "I should cover my mouth with my hand when coughing.",
      "I will wear a mask when around others for the first 2 weeks of treatment.",
      "I can stop isolation once I feel better.",
      "I should stay home until my sputum is negative.",
    ],
    correctLetter: "D",
    rationale: "Negative sputum cultures guide when transmission risk is reduced.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question:
      'A postpartum client is crying and states, "I feel like a terrible mother." This is most consistent with:',
    options: [
      "Postpartum blues",
      "Postpartum depression",
      "Postpartum psychosis",
      "Normal adjustment",
    ],
    correctLetter: "A",
    rationale: "Transient crying and mood lability are common in postpartum blues.",
  },
  {
    subjectId: "psychosocial",
    topicCategory: "Psychosocial Integrity",
    question: "The nurse is caring for a client with Alzheimer's disease. Which intervention is most effective for wandering?",
    options: [
      "Use physical restraints during the day",
      "Provide a safe, structured environment with visual cues",
      "Administer a sedative at bedtime",
      "Keep the client in bed most of the day",
    ],
    correctLetter: "B",
    rationale: "Structured, safe environments reduce wandering in dementia.",
  },
  {
    subjectId: "health-promotion",
    topicCategory: "Health Promotion",
    question: "A client with HIV is being discharged. Which teaching point is most critical?",
    options: [
      "Avoid all contact with family members",
      "Practice safe sex and hand hygiene",
      "Discontinue antiretroviral therapy when CD4 count improves",
      "Share needles only with known partners",
    ],
    correctLetter: "B",
    rationale: "Safe sex and hand hygiene prevent HIV transmission.",
  },
];

export function getActiveCommunityNclexPracticeItems(): CommunityNclexItem[] {
  return COMMUNITY_NCLEX_PRACTICE_40.filter((_, i) => !COMMUNITY_NCLEX_PRACTICE_RETIRED_INDICES.has(i));
}

export function communityItemToBankItem(row: CommunityNclexItem): BankItem {
  const idx = row.correctLetter.charCodeAt(0) - 65;
  const correctAnswer = row.options[idx]!;
  return {
    subjectId: row.subjectId,
    question: row.question,
    options: [...row.options],
    correctAnswer,
    explanation: row.rationale,
    topicCategory: row.topicCategory,
    tags: ["curated", "community-pack-40", "nclex-practice-import", "oer-community"],
    source: "ai-curated",
    itemType: "vignette",
    difficulty: 3,
    references: [{ label: "NCSBN NCLEX-RN Test Plan", citation: "Clinical Judgment Measurement Model" }],
  };
}
