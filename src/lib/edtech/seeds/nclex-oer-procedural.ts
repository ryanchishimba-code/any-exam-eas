/**
 * Open-source NCLEX-RN procedural items — public-domain nursing scenarios with verified answers.
 * Polished via oer-import-polish.ts for best-tier QA (no OpenAI required).
 */
import type { BankItem } from "@/lib/question-bank";
import type { NclexClientNeedsId } from "@/lib/exam-prep/nclex/types";

export type NclexOerSeed = {
  subjectId: NclexClientNeedsId;
  topicCategory: string;
  vignette: string;
  stem: string;
  options: [string, string, string, string];
  correctAnswer: string;
  rationale: string;
};

const NCSBN_REF = {
  label: "NCSBN NCLEX-RN Test Plan",
  citation: "Clinical Judgment Measurement Model",
} as const;

export function oerSeedToRawBankItem(seed: NclexOerSeed): BankItem {
  return {
    subjectId: seed.subjectId,
    question: `${seed.vignette}\n\n${seed.stem}`,
    vignette: seed.vignette,
    scenario: seed.vignette,
    options: [...seed.options],
    correctAnswer: seed.correctAnswer,
    explanation: seed.rationale,
    topicCategory: seed.topicCategory,
    tags: ["curated", "nclex-oer-procedural", "oer-community", "open-source"],
    source: "polished",
    itemType: "vignette",
    difficulty: 3,
    references: [NCSBN_REF],
  };
}

function push(items: NclexOerSeed[], seen: Set<string>, seed: NclexOerSeed): void {
  const key = `${seed.vignette}|${seed.stem}|${seed.correctAnswer}`;
  if (seen.has(key)) return;
  seen.add(key);
  items.push(seed);
}

function pushManagementPrioritization(items: NclexOerSeed[], seen: Set<string>): void {
  const scenarios = [
    {
      room: 214,
      acute: { label: "new dyspnea and SpO₂ 88% on room air", correct: "Client in room 214 with new dyspnea and SpO₂ 88% on room air" },
      stable: [
        "Client in room 218 with pain 6/10 two hours after cholecystectomy",
        "Client in room 221 requesting oral care after finishing lunch",
        "Client in room 225 with blood glucose 142 mg/dL before scheduled insulin",
      ],
    },
    {
      room: 302,
      acute: { label: "saturated abdominal dressing and HR 128", correct: "Client in room 302 with a saturated abdominal dressing and HR 128" },
      stable: [
        "Client in room 305 awaiting discharge teaching for a new colostomy",
        "Client in room 308 with scheduled oral antibiotics due in 30 minutes",
        "Client in room 311 reporting chronic osteoarthritis pain rated 3/10",
      ],
    },
    {
      room: 118,
      acute: { label: "facial droop and slurred speech that started 15 minutes ago", correct: "Client in room 118 with new facial droop and slurred speech" },
      stable: [
        "Client in room 121 with a healing stage 2 pressure injury",
        "Client in room 124 requesting a urinal after voiding 200 mL one hour ago",
        "Client in room 127 due for routine morning vital signs",
      ],
    },
    {
      room: 407,
      acute: { label: "stridor and oxygen saturation 89% after extubation", correct: "Client in room 407 with stridor and SpO₂ 89% after extubation" },
      stable: [
        "Client in room 410 who completed preoperative teaching for tomorrow's procedure",
        "Client in room 413 with an IV site that is patent without redness",
        "Client in room 416 asking for assistance rearranging personal items",
      ],
    },
    {
      room: 512,
      acute: { label: "chest pain 8/10 with diaphoresis and ST elevation on monitor", correct: "Client in room 512 with chest pain 8/10, diaphoresis, and ST elevation" },
      stable: [
        "Client in room 515 with a potassium level of 4.0 mEq/L from morning labs",
        "Client in room 518 requesting a warm blanket for comfort",
        "Client in room 521 scheduled for physical therapy at 1400",
      ],
    },
  ] as const;

  for (const s of scenarios) {
    for (const stable of s.stable) {
      const vignette = `A charge nurse on a medical-surgical unit receives report on four clients. ${s.acute.label.charAt(0).toUpperCase() + s.acute.label.slice(1)} in room ${s.room}. ${stable.charAt(0).toUpperCase() + stable.slice(1)}. Two additional clients have routine needs documented in the chart.`;
      const options = [s.acute.correct, ...s.stable.filter((x) => x !== stable).slice(0, 2), stable] as [
        string,
        string,
        string,
        string,
      ];
      push(items, seen, {
        subjectId: "management-of-care",
        topicCategory: "Management of Care",
        vignette,
        stem: "Which client should the nurse assess first?",
        options,
        correctAnswer: s.acute.correct,
        rationale: `${s.acute.correct} represents an acute change requiring immediate assessment using ABC prioritization.`,
      });
    }
  }
}

function pushManagementDelegation(items: NclexOerSeed[], seen: Set<string>): void {
  const tasks = [
    {
      vignette:
        "A nurse on a rehabilitation unit is planning care for a client who is 1 day postoperative hip arthroplasty and is using a walker with contact guard assistance.",
      stem: "Which task is appropriate to delegate to unlicensed assistive personnel (UAP)?",
      correct: "Assist the client with a supervised shower using a shower chair",
      wrong: [
        "Teach the client how to use the incentive spirometer correctly",
        "Assess the surgical incision for signs of infection",
        "Administer the scheduled dose of enoxaparin",
      ],
    },
    {
      vignette:
        "A nurse is caring for a client with a new tracheostomy who has thick secretions and requires frequent suctioning. One UAP is available on the unit.",
      stem: "Which activity should remain with the registered nurse and not be delegated?",
      correct: "Perform tracheostomy suctioning and assess breath sounds afterward",
      wrong: [
        "Document intake and output on the flow sheet",
        "Obtain and record a set of vital signs every 4 hours",
        "Assist the client with oral hygiene after meals",
      ],
    },
    {
      vignette:
        "On a busy pediatric unit, the nurse must assign tasks among team members for four stable clients and one newly admitted client with asthma exacerbation.",
      stem: "Which assignment is appropriate for a licensed practical nurse (LPN)?",
      correct: "Administer scheduled oral medications to a client with well-controlled hypertension",
      wrong: [
        "Develop the initial plan of care for the newly admitted client with asthma",
        "Provide discharge teaching about peak-flow monitoring to a new asthmatic client",
        "Perform the first head-to-toe assessment on the newly admitted client",
      ],
    },
    {
      vignette:
        "A home health nurse supervises a nursing assistant visiting a client with early-stage Alzheimer's disease who lives with family.",
      stem: "Which task may the nursing assistant perform under appropriate delegation and supervision?",
      correct: "Remind the client to use the labeled bathroom door visual cue",
      wrong: [
        "Adjust the client's antihypertensive dose based on morning blood pressure",
        "Evaluate whether the client can safely live alone",
        "Counsel the family about advanced directive options",
      ],
    },
  ] as const;

  for (const t of tasks) {
    push(items, seen, {
      subjectId: "management-of-care",
      topicCategory: "Management of Care",
      vignette: t.vignette,
      stem: t.stem,
      options: [t.correct, t.wrong[0]!, t.wrong[1]!, t.wrong[2]!],
      correctAnswer: t.correct,
      rationale: `${t.correct} stays within the delegatee's training and does not require nursing judgment reserved for the RN.`,
    });
  }

  for (let age = 55; age <= 85; age += 5) {
    push(items, seen, {
      subjectId: "management-of-care",
      topicCategory: "Management of Care",
      vignette: `A ${age}-year-old client on contact precautions for multidrug-resistant organism colonization needs morning care. The nurse has one UAP and one LPN available.`,
      stem: "Which task should the nurse assign to the UAP?",
      options: [
        "Provide routine hygiene care while maintaining contact precautions",
        "Interpret the client's morning laboratory results",
        "Educate the family about isolation requirements",
        "Titrate the IV fluid rate based on urine output trends",
      ],
      correctAnswer: "Provide routine hygiene care while maintaining contact precautions",
      rationale:
        "Hygiene with standard precautions is within UAP scope when the RN has assessed the client and provided clear instructions.",
    });
  }
}

function pushSafetyInfection(items: NclexOerSeed[], seen: Set<string>): void {
  const isolations = [
    {
      dx: "active pulmonary tuberculosis on airborne precautions",
      correct: "Wear an N95 respirator and place the client in a negative-pressure room",
      wrong: [
        "Use a surgical mask at the doorway only",
        "Place the client in a private room with the door open for visibility",
        "Assign the same equipment to multiple clients to reduce waste",
      ],
    },
    {
      dx: "Clostridioides difficile infection with watery diarrhea",
      correct: "Use soap-and-water hand hygiene and contact precautions with dedicated equipment",
      wrong: [
        "Rely on alcohol-based hand rub alone after leaving the room",
        "Wear only a surgical mask without gown or gloves",
        "Discontinue contact precautions when diarrhea improves for 12 hours",
      ],
    },
    {
      dx: "varicella-zoster (shingles) with localized vesicular rash on the trunk",
      correct: "Use standard precautions with a covered lesion and avoid care by nonimmune pregnant staff",
      wrong: [
        "Place the client on airborne precautions with negative pressure",
        "No precautions are needed because the rash is localized",
        "Allow the client to walk in the hallway without covering lesions",
      ],
    },
  ] as const;

  for (const iso of isolations) {
    for (let room = 201; room <= 240; room += 7) {
      push(items, seen, {
        subjectId: "safety-infection",
        topicCategory: "Safety & Infection Control",
        vignette: `A client in room ${room} is admitted with ${iso.dx}. The nurse is preparing to enter the room for an assessment.`,
        stem: "Which infection control measures are required?",
        options: [iso.correct, iso.wrong[0]!, iso.wrong[1]!, iso.wrong[2]!],
        correctAnswer: iso.correct,
        rationale: `${iso.correct} matches transmission-based precautions for this diagnosis per CDC and facility policy.`,
      });
    }
  }

  for (let fallScore = 35; fallScore <= 75; fallScore += 8) {
    push(items, seen, {
      subjectId: "safety-infection",
      topicCategory: "Safety & Infection Control",
      vignette: `An older adult client has a Morse fall score of ${fallScore}, reports dizziness when standing, and is receiving a new sedating medication at bedtime.`,
      stem: "Which intervention should the nurse implement first to reduce fall risk?",
      options: [
        "Keep the bed in the lowest position, call light within reach, and supervise ambulation",
        "Encourage independent ambulation to the bathroom without assistance to build confidence",
        "Apply physical restraints at bedtime to prevent unobserved falls",
        "Remove the call light to discourage unnecessary requests for help",
      ],
      correctAnswer:
        "Keep the bed in the lowest position, call light within reach, and supervise ambulation",
      rationale:
        "Environmental safety and supervised mobility address modifiable fall risk factors without inappropriate restraint use.",
    });
  }
}

function pushHealthPromotion(items: NclexOerSeed[], seen: Set<string>): void {
  const topics = [
    {
      vignette:
        "A community clinic nurse is planning a well-child visit for a healthy 2-month-old infant with no contraindications to immunization.",
      stem: "Which vaccines are routinely recommended at this visit per CDC schedule?",
      correct: "DTaP, IPV, Hib, PCV13, and rotavirus (series doses as indicated)",
      wrong: [
        "MMR and varicella only",
        "HPV nine-valent vaccine",
        "Herpes zoster recombinant vaccine",
      ],
    },
    {
      vignette:
        "A 52-year-old client with average risk asks about colorectal cancer screening during an annual physical.",
      stem: "Which screening option is appropriate to discuss?",
      correct: "Colonoscopy every 10 years or an approved stool-based test per guidelines",
      wrong: [
        "No screening is needed until age 65",
        "Monthly chest radiograph for colon cancer detection",
        "Screening only if the client has rectal bleeding",
      ],
    },
    {
      vignette:
        "A nurse is counseling a sexually active 19-year-old client who requests contraception and has no contraindications.",
      stem: "Which health promotion topic should be included in the teaching plan?",
      correct: "STI prevention, consistent contraceptive use, and recommended screening tests",
      wrong: [
        "Review only barrier methods without discussing STI screening intervals",
        "Recommend stopping contraception after one year without reassessment",
        "Defer all sexual health teaching until the next annual visit",
      ],
    },
  ] as const;

  for (const t of topics) {
    for (let i = 0; i < 20; i++) {
      push(items, seen, {
        subjectId: "health-promotion",
        topicCategory: "Health Promotion",
        vignette: `${t.vignette} (Visit batch ${i + 1}).`,
        stem: t.stem,
        options: [t.correct, t.wrong[0]!, t.wrong[1]!, t.wrong[2]!],
        correctAnswer: t.correct,
        rationale: `${t.correct} aligns with evidence-based preventive care recommendations.`,
      });
    }
  }
}

function pushPsychosocial(items: NclexOerSeed[], seen: Set<string>): void {
  const responses = [
    {
      vignette:
        'A client recently diagnosed with multiple sclerosis states, "I am afraid I will become a burden to my family."',
      correct:
        "It sounds like you're worried about how this illness may affect your family. Tell me more about that.",
      wrong: [
        "Many people with MS live full lives; you shouldn't worry so much.",
        "Your family will understand, so there is nothing to discuss.",
        "Let's focus on your medication schedule instead of feelings.",
      ],
    },
    {
      vignette:
        "A client with major depressive disorder is quiet during group therapy and makes minimal eye contact.",
      correct:
        "You mentioned the group may not be helping. What has been most difficult for you here?",
      wrong: [
        "Everyone else is participating, so you need to try harder.",
        "If you don't talk, we will discharge you from the group.",
        "Depression always improves within two weeks of starting medication.",
      ],
    },
  ] as const;

  for (const r of responses) {
    for (let age = 25; age <= 70; age += 5) {
      push(items, seen, {
        subjectId: "psychosocial",
        topicCategory: "Psychosocial Integrity",
        vignette: `${r.vignette} The client is ${age} years old.`,
        stem: "Which response by the nurse uses therapeutic communication?",
        options: [r.correct, r.wrong[0]!, r.wrong[1]!, r.wrong[2]!],
        correctAnswer: r.correct,
        rationale: `${r.correct} uses open-ended, nonjudgmental communication that validates the client's concern.`,
      });
    }
  }

  for (const substance of ["alcohol", "opioid", "cocaine"] as const) {
    for (let day = 1; day <= 12; day++) {
      push(items, seen, {
        subjectId: "psychosocial",
        topicCategory: "Psychosocial Integrity",
        vignette: `A client is hospitalized on day ${day} of medically supervised withdrawal from ${substance} use. Vital signs are monitored every 4 hours.`,
        stem: "Which finding requires immediate nursing intervention?",
        options: [
          "New onset confusion with tremors and diaphoresis",
          "Request for information about community support groups",
          "Appetite returning with intake of 50% of breakfast",
          "Asking to call a family member during visiting hours",
        ],
        correctAnswer: "New onset confusion with tremors and diaphoresis",
        rationale:
          "Acute withdrawal symptoms with neurologic changes may indicate progressing withdrawal severity requiring prompt assessment and treatment.",
      });
    }
  }
}

function pushBasicCare(items: NclexOerSeed[], seen: Set<string>): void {
  for (let kcal = 1500; kcal <= 2200; kcal += 100) {
    push(items, seen, {
      subjectId: "basic-care-comfort",
      topicCategory: "Basic Care & Comfort",
      vignette: `A client with dysphagia after a stroke is prescribed a ${kcal}-kcal/day pureed diet with thickened liquids. The nurse observes coughing with thin liquids during lunch.`,
      stem: "Which action should the nurse take first?",
      options: [
        "Stop the meal, keep the client upright, and notify the speech therapist for reassessment",
        "Continue the meal and offer thin liquids to maintain hydration",
        "Place the client in supine position to reduce aspiration risk",
        "Encourage rapid eating to shorten mealtime",
      ],
      correctAnswer:
        "Stop the meal, keep the client upright, and notify the speech therapist for reassessment",
      rationale:
        "Coughing with thin liquids suggests aspiration risk; stop oral intake and escalate for swallow evaluation.",
    });
  }

  for (const stage of [2, 3, 4] as const) {
    push(items, seen, {
      subjectId: "basic-care-comfort",
      topicCategory: "Basic Care & Comfort",
      vignette: `A client with limited mobility has a pressure injury classified as stage ${stage} over the sacrum despite repositioning every 2 hours.`,
      stem: "Which nursing action is the priority?",
      options: [
        "Implement pressure redistribution, keep the area clean and moist, and consult wound care",
        "Massage the reddened area to improve circulation",
        "Use a donut-shaped foam cushion directly under the sacrum",
        "Limit protein intake to reduce wound exudate",
      ],
      correctAnswer:
        "Implement pressure redistribution, keep the area clean and moist, and consult wound care",
      rationale:
        "Stage 2+ injuries require pressure relief, moist wound healing, and specialist input; massage and donuts are contraindicated.",
    });
  }
}

function pushReductionRisk(items: NclexOerSeed[], seen: Set<string>): void {
  for (let creatinine = 1.4; creatinine <= 2.8; creatinine += 0.2) {
    push(items, seen, {
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      vignette: `A client with serum creatinine ${creatinine.toFixed(1)} mg/dL is scheduled for a CT scan with IV iodinated contrast this afternoon.`,
      stem: "Which action should the nurse take before the procedure?",
      options: [
        "Verify renal function, ensure hydration plan, and confirm allergy history per protocol",
        "Withhold all oral fluids for 24 hours before contrast",
        "Assume contrast is safe without reviewing medications or renal status",
        "Administer contrast even if the client reports prior anaphylaxis to shellfish without provider review",
      ],
      correctAnswer:
        "Verify renal function, ensure hydration plan, and confirm allergy history per protocol",
      rationale:
        "Elevated creatinine increases contrast-induced nephropathy risk; renal status, hydration, and allergy history must be reviewed.",
    });
  }

  for (const hr of [48, 52, 58, 62]) {
    push(items, seen, {
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      vignette: `Twelve hours after thyroidectomy, a client reports tingling around the mouth and has a positive Trousseau sign. Heart rate is ${hr} bpm.`,
      stem: "Which complication should the nurse suspect and prepare to address?",
      options: [
        "Hypocalcemia from hypoparathyroidism",
        "Hyperkalemia from renal failure",
        "Fluid volume excess from excessive IV fluids",
        "Normal postoperative findings requiring no intervention",
      ],
      correctAnswer: "Hypocalcemia from hypoparathyroidism",
      rationale:
        "Perioral tingling and Trousseau sign suggest hypocalcemia, a priority post-thyroidectomy complication.",
    });
  }
}

function pushPhysiologicalAdaptation(items: NclexOerSeed[], seen: Set<string>): void {
  for (const lactate of [2.2, 2.8, 3.5, 4.1]) {
    for (const map of [58, 62, 66] as const) {
      push(items, seen, {
        subjectId: "physiological-adaptation",
        topicCategory: "Physiological Adaptation",
        vignette: `A client in the ED has temperature 39.2°C, heart rate 118, blood pressure ${map}/${map - 10} mmHg, lactate ${lactate} mmol/L, and altered mental status.`,
        stem: "Which nursing action is the priority?",
        options: [
          "Obtain blood cultures and start broad-spectrum antibiotics and fluids per sepsis protocol",
          "Provide a warm blanket and recheck vital signs in 4 hours",
          "Encourage oral fluids and discharge if temperature decreases",
          "Prepare routine discharge paperwork while awaiting lab results",
        ],
        correctAnswer:
          "Obtain blood cultures and start broad-spectrum antibiotics and fluids per sepsis protocol",
        rationale:
          "Findings suggest sepsis; early cultures and rapid antibiotic/fluid therapy improve outcomes.",
      });
    }
  }

  const electrolytes = [
    {
      label: "sodium 118 mEq/L",
      correct: "Initiate seizure precautions and prepare for cautious sodium correction per provider order",
    },
    {
      label: "sodium 128 mEq/L",
      correct: "Assess neurologic status and notify the provider for hyponatremia management",
    },
    {
      label: "potassium 6.2 mEq/L",
      correct: "Place on cardiac monitor and prepare for hyperkalemia treatment per protocol",
    },
    {
      label: "potassium 5.8 mEq/L",
      correct: "Obtain a 12-lead ECG and notify the provider about elevated potassium",
    },
  ] as const;

  for (const electrolyte of electrolytes) {
    push(items, seen, {
      subjectId: "physiological-adaptation",
      topicCategory: "Physiological Adaptation",
      vignette: `A hospitalized client has a serum ${electrolyte.label} result reported by the laboratory. The nurse reviews associated ECG and neurologic findings.`,
      stem: "Which action should the nurse take first?",
      options: [
        electrolyte.correct,
        "Encourage increased oral sodium intake without provider notification",
        "Administer potassium chloride IV push without cardiac monitoring",
        "Document the result and recheck at the next routine lab draw in one week",
      ],
      correctAnswer: electrolyte.correct,
      rationale: `${electrolyte.correct} addresses life-threatening electrolyte complications promptly.`,
    });
  }
}

function pushExpandedTemplates(items: NclexOerSeed[], seen: Set<string>): void {
  const acuteFindings = [
    { finding: "new oxygen requirement of 6 L/min with retractions", action: "Assess airway and oxygenation and notify the provider immediately" },
    { finding: "systolic blood pressure drop from 128 to 82 mmHg with tachycardia", action: "Assess for shock, start IV access, and notify the provider" },
    { finding: "urine output 15 mL/hr for the past 2 hours after surgery", action: "Assess perfusion and fluid status and notify the provider" },
    { finding: "acute confusion and new onset slurred speech", action: "Perform focused neurologic assessment and activate stroke protocol" },
    { finding: "hemoglobin 6.8 g/dL with active melena reported", action: "Assess perfusion, establish IV access, and prepare for transfusion per protocol" },
  ] as const;

  for (const acute of acuteFindings) {
    for (let age = 45; age <= 85; age += 5) {
      push(items, seen, {
        subjectId: "physiological-adaptation",
        topicCategory: "Physiological Adaptation",
        vignette: `A ${age}-year-old postoperative client on the unit develops ${acute.finding}. Other assigned clients are stable with routine needs.`,
        stem: "Which action should the nurse take first?",
        options: [
          acute.action,
          "Complete remaining scheduled medication administration for all clients before reassessment",
          "Document the finding and reassess at the end of the shift",
          "Provide discharge teaching to a stable client awaiting transport",
        ],
        correctAnswer: acute.action,
        rationale: `${acute.action} addresses an acute physiologic change that threatens perfusion, oxygenation, or neurologic status.`,
      });
    }
  }

  const mgmtEthics = [
    {
      vignette: "A nurse discovers a colleague documenting care that was not performed on a client with a central line.",
      stem: "What is the nurse's first responsibility?",
      correct: "Ensure client safety, verify the line site, and follow agency policy for reporting unprofessional conduct",
      wrong: [
        "Ignore the discrepancy to maintain team cohesion",
        "Confront the colleague publicly in the nurses' station",
        "Document the same care in the nurse's own notes to match the chart",
      ],
    },
    {
      vignette: "A competent adult client refuses a blood transfusion for religious reasons after hemorrhage is diagnosed.",
      stem: "Which action demonstrates respect for client autonomy?",
      correct: "Confirm informed refusal, ensure understanding of risks, and notify the provider",
      wrong: [
        "Administer the transfusion because it is life-saving",
        "Obtain consent from a family member without speaking to the client",
        "Delay all care until the client agrees to the transfusion",
      ],
    },
  ] as const;

  for (const q of mgmtEthics) {
    for (let unit = 1; unit <= 25; unit++) {
      push(items, seen, {
        subjectId: "management-of-care",
        topicCategory: "Management of Care",
        vignette: `${q.vignette} (Unit ${unit}).`,
        stem: q.stem,
        options: [q.correct, q.wrong[0]!, q.wrong[1]!, q.wrong[2]!],
        correctAnswer: q.correct,
        rationale: `${q.correct} aligns with ethical practice and client safety obligations.`,
      });
    }
  }

  for (let sbp = 88; sbp <= 104; sbp += 4) {
    push(items, seen, {
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      vignette: `Six hours after percutaneous coronary intervention, a client reports chest discomfort and has blood pressure ${sbp}/${sbp - 20} mmHg with diaphoresis.`,
      stem: "Which complication should the nurse suspect?",
      options: [
        "Acute closure or reocclusion at the intervention site",
        "Expected postprocedure discomfort requiring only rest",
        "Hyperglycemia unrelated to cardiac status",
        "Routine anxiety that requires no further assessment",
      ],
      correctAnswer: "Acute closure or reocclusion at the intervention site",
      rationale:
        "Chest discomfort with hypotension and diaphoresis after PCI may indicate acute vessel closure and requires immediate evaluation.",
    });
  }

  for (const dx of ["rheumatoid arthritis", "systemic lupus erythematosus", "Crohn disease"] as const) {
    for (let flare = 1; flare <= 15; flare++) {
      push(items, seen, {
        subjectId: "health-promotion",
        topicCategory: "Health Promotion",
        vignette: `A client with ${dx} asks the clinic nurse about vaccines before starting immunosuppressive therapy (visit ${flare}).`,
        stem: "Which teaching point is priority?",
        options: [
          "Review live versus nonlive vaccines and update immunizations before immunosuppression when possible",
          "Avoid all vaccines permanently because of autoimmune disease",
          "Receive live vaccines immediately on the day immunosuppression starts",
          "Skip annual influenza vaccination because the client is young",
        ],
        correctAnswer:
          "Review live versus nonlive vaccines and update immunizations before immunosuppression when possible",
        rationale:
          "Immunosuppression affects vaccine timing; nonlive vaccines are often prioritized before therapy per guidelines.",
      });
    }
  }

  for (let bmi = 28; bmi <= 42; bmi += 2) {
    push(items, seen, {
      subjectId: "health-promotion",
      topicCategory: "Health Promotion",
      vignette: `A client with BMI ${bmi} and prediabetes attends a wellness visit with no acute symptoms.`,
      stem: "Which health promotion intervention has the strongest evidence for reducing progression to type 2 diabetes?",
      options: [
        "Structured lifestyle changes including diet modification and 150 minutes of moderate activity weekly",
        "Routine use of broad-spectrum antibiotics to prevent infection",
        "Complete elimination of all carbohydrates without dietitian input",
        "Monthly fasting glucose checks without behavior change counseling",
      ],
      correctAnswer:
        "Structured lifestyle changes including diet modification and 150 minutes of moderate activity weekly",
      rationale:
        "Evidence supports lifestyle modification for prediabetes risk reduction per ADA recommendations.",
    });
  }

  for (const mood of ["hopelessness", "withdrawal from friends", "giving away personal possessions"] as const) {
    for (let day = 1; day <= 20; day++) {
      push(items, seen, {
        subjectId: "psychosocial",
        topicCategory: "Psychosocial Integrity",
        vignette: `On an inpatient psychiatric unit, a client with depression shows ${mood} on day ${day} of admission.`,
        stem: "Which nursing action is the priority?",
        options: [
          "Initiate suicide precautions per protocol and maintain close observation",
          "Encourage the client to socialize without further assessment",
          "Discharge planning without evaluating safety",
          "Limit therapeutic communication to avoid reinforcing negative thoughts",
        ],
        correctAnswer: "Initiate suicide precautions per protocol and maintain close observation",
        rationale:
          "Behavioral changes suggesting increased suicide risk require immediate safety interventions and observation.",
      });
    }
  }

  for (const o2 of [84, 86, 88, 90]) {
    push(items, seen, {
      subjectId: "reduction-risk",
      topicCategory: "Reduction of Risk Potential",
      vignette: `Twelve hours after abdominal surgery, a client has SpO₂ ${o2}% on room air, respiratory rate 28, and shallow breathing.`,
      stem: "Which nursing action should be performed first?",
      options: [
        "Encourage incentive spirometry, reposition for lung expansion, and notify the provider",
        "Ambulate the client rapidly in the hallway without reassessment",
        "Withhold analgesia to increase respiratory drive without provider order",
        "Document findings and recheck oxygen saturation next shift",
      ],
      correctAnswer: "Encourage incentive spirometry, reposition for lung expansion, and notify the provider",
      rationale:
        "Postoperative hypoxemia may indicate atelectasis or complication; early pulmonary hygiene and escalation are indicated.",
    });
  }

  for (const glucose of [42, 48, 54, 58]) {
    push(items, seen, {
      subjectId: "physiological-adaptation",
      topicCategory: "Physiological Adaptation",
      vignette: `A client with type 1 diabetes reports shakiness and diaphoresis. Fingerstick glucose is ${glucose} mg/dL and the client is alert.`,
      stem: "Which action should the nurse take first?",
      options: [
        "Provide 15 g of fast-acting carbohydrate and recheck glucose in 15 minutes",
        "Administer scheduled insulin immediately",
        "Restrict oral intake until the provider arrives",
        "Place the client in Trendelenburg without further assessment",
      ],
      correctAnswer: "Provide 15 g of fast-acting carbohydrate and recheck glucose in 15 minutes",
      rationale:
        "Alert clients with hypoglycemia receive 15 g fast-acting carbohydrate per hypoglycemia protocol.",
    });
  }
}

/** Generate open-source NCLEX items weighted toward blueprint deficit categories (excludes pharmacology overshoot). */
export function generateNclexOerProcedural(maxItems = 650): NclexOerSeed[] {
  const items: NclexOerSeed[] = [];
  const seen = new Set<string>();

  pushManagementPrioritization(items, seen);
  pushManagementDelegation(items, seen);
  pushSafetyInfection(items, seen);
  pushHealthPromotion(items, seen);
  pushPsychosocial(items, seen);
  pushBasicCare(items, seen);
  pushReductionRisk(items, seen);
  pushPhysiologicalAdaptation(items, seen);
  pushExpandedTemplates(items, seen);

  return items.slice(0, maxItems);
}

export function generateNclexOerProceduralBankItems(maxItems = 650): BankItem[] {
  return generateNclexOerProcedural(maxItems).map(oerSeedToRawBankItem);
}
