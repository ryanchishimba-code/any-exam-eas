import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem } from "./nclex-bank-audit";

function item(partial: Partial<BankItem>): BankItem {
  return {
    id: "test-1",
    fieldId: "nursing",
    subjectId: "med-surg",
    type: "mcq",
    difficulty: "medium",
    question: "Which action should the nurse take first?",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
    explanation: "Because first action.",
    tags: ["test"],
    ...partial,
  };
}

describe("auditNclexBankItem", () => {
  it("flags stable delegation with unstable vitals", () => {
    const result = auditNclexBankItem(
      item({
        subjectId: "management-of-care",
        vignette:
          "An 8-year-old boy with moderate persistent asthma is stable after initial assessment. SpO2 90%, peak flow 45% of personal best, retractions noted.",
        question: "Which task is appropriate to delegate to the UAP?",
      }),
    );
    expect(result.issues.some((i) => i.code === "stable_unstable_mismatch")).toBe(true);
  });

  it("flags delegation stem with handoff vignette", () => {
    const result = auditNclexBankItem(
      item({
        subjectId: "management-of-care",
        vignette:
          "During shift handoff, the outgoing nurse reports a client with chest pain and diaphoresis.",
        question: "Which task is appropriate to delegate to the UAP?",
      }),
    );
    expect(result.issues.some((i) => i.code === "delegation_handoff_mismatch")).toBe(true);
  });

  it("flags pediatric age mismatch in vignette", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Pediatric unit. An 18-year-old man with moderate persistent asthma is stable after initial assessment.",
        question: "Which action should the nurse take first?",
      }),
    );
    expect(result.issues.some((i) => i.code === "pediatric_age_mismatch")).toBe(true);
    expect(result.ok).toBe(false);
  });

  it("flags finding stem with action-only options", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "A 19-year-old man is admitted with suicidal ideation and a written goodbye note in the bedside drawer.",
        question: "Which finding requires immediate nursing follow-up?",
        options: [
          "Notify the provider immediately and reassess blood pressure",
          "Document the finding and recheck in 4 hours",
          "Delegate reassessment to UAP",
          "Reassure the client that the finding is expected",
        ],
        correctAnswer: "Notify the provider immediately and reassess blood pressure",
      })
    );
    expect(result.issues.some((i) => i.code === "stem_option_category_mismatch")).toBe(true);
  });

  it("passes a coherent delegation item", () => {
    const result = auditNclexBankItem(
      item({
        subjectId: "management-of-care",
        vignette:
          "A 62-year-old woman recovering from hip replacement is stable after initial assessment. She uses a walker and needs assistance with ambulation.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: [
          "Assist with ambulation using a gait belt",
          "Administer PRN opioid",
          "Assess lung sounds",
          "Titrate IV fluids",
        ],
        correctAnswer: "Assist with ambulation using a gait belt",
      }),
    );
    expect(result.ok).toBe(true);
  });

  it("flags bradypnea and pinpoint pupils against stable assertion", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Medical-surgical unit, Room 226. A 58-year-old man is stable after initial assessment. RR 10, SpO₂ 93%, pinpoint pupils, somnolent.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: ["A", "B", "C", "D"],
      })
    );
    expect(result.issues.some((i) => i.code === "stable_unstable_mismatch")).toBe(true);
  });

  it("flags delegation vignette paired with infection stem", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Skilled nursing facility. Room 443. A 76-year-old woman with chronic heart failure is stable after initial assessment. The RN must assign tasks to unlicensed assistive personnel (UAP) while maintaining accountability.",
        question: "Which infection control measure should the nurse implement first?",
        options: [
          "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
          "Use alcohol-based hand rub alone",
          "Droplet precautions only",
          "Airborne precautions for all visitors",
        ],
        correctAnswer:
          "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
      })
    );
    expect(result.issues.some((i) => i.code === "stem_vignette_template_mismatch")).toBe(true);
  });

  it("flags delegation stem on non–management-of-care subject", () => {
    const result = auditNclexBankItem(
      item({
        subjectId: "pharmacology-nursing",
        vignette:
          "Medical-surgical unit. Room 210. A 58-year-old man with type 2 diabetes is stable after initial assessment. The RN must assign tasks to unlicensed assistive personnel (UAP) while maintaining accountability.",
        question: "Which task is appropriate for the nurse to delegate to UAP?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
      })
    );
    expect(result.issues.some((i) => i.code === "delegation_wrong_subject")).toBe(true);
  });

  it("flags phantom diagnosis in delegation distractors", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Medical-surgical unit. Room 468. A 58-year-old man with postoperative day 2 after total knee arthroplasty is stable after initial assessment.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: [
          "Measure and record intake and output on a stable client who is alert and oriented",
          "Teach a newly diagnosed client insulin self-administration and hypoglycemia recognition",
          "Perform the initial comprehensive assessment",
          "Triage four newly admitted clients",
        ],
        correctAnswer:
          "Measure and record intake and output on a stable client who is alert and oriented",
      })
    );
    expect(result.issues.some((i) => i.code === "phantom_client_in_options")).toBe(true);
  });

  it("flags multiple room numbers outside prioritization stems", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Room 226. A 58-year-old man with opioid depression. Room 265. A 57-year-old man with glucose 412 mg/dL and fruity breath.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: ["A", "B", "C", "D"],
      })
    );
    expect(result.issues.some((i) => i.code === "multi_client_vignette")).toBe(true);
  });

  it("flags heart failure vignette with infection-only options", () => {
    const infectionOptions = [
      "Use alcohol-based hand rub alone without soap and water after caring for this client",
      "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
      "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
      "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
    ];
    const result = auditNclexBankItem(
      item({
        vignette:
          "Medical-surgical unit, Room 353. 68-year-old woman with acute decompensated heart failure. BP 88/54, HR 112, crackles bilaterally, weight up 2.5 kg. The nurse must prevent transmission to other clients and staff.",
        question: "Which action demonstrates appropriate transmission-based precautions for this client?",
        options: infectionOptions,
        correctAnswer: infectionOptions[3]!,
      })
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "infection_template_clinical_mismatch")).toBe(true);
  });

  it("fails QA on generic delegation correct answer", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Medical-surgical unit. A 44-year-old woman with cellulitis is stable after initial assessment.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: [
          "Measure and record intake and output on a stable client who is alert and oriented (medical-surgical unit)",
          "Assess lung sounds",
          "Administer IV antibiotic",
          "Develop plan of care",
        ],
        correctAnswer:
          "Measure and record intake and output on a stable client who is alert and oriented (medical-surgical unit)",
      })
    );
    expect(result.issues.some((i) => i.code === "generic_delegation_correct")).toBe(true);
    expect(result.ok).toBe(false);
  });
});
