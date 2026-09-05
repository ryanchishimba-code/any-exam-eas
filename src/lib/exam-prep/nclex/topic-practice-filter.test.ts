import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  filterItemsForNclexPreset,
  matchesNclexStudyPreset,
} from "./session-preset-filters";
import { getNclexStudyPreset } from "./study-presets";
import {
  filterItemsForNclexTopicPractice,
  matchesNclexTopicPracticeItem,
} from "./topic-practice-filter";
import { matchesNclexBlueprintTopic, filterItemsForNclexBlueprintTopics } from "./topic-blueprint-match";

describe("NCLEX peds-block preset filtering", () => {
  const preset = getNclexStudyPreset("peds-block")!;

  const pediatricItem: BankItem = {
    subjectId: "pediatrics-nursing",
    vignette: "Pediatric unit | 8-month-old infant with fever and decreased wet diapers",
    question: "Which assessment finding requires immediate notification of the provider?",
    options: ["Bulging fontanel", "Dry mucous membranes", "Tachypnea", "Cap refill 3 seconds"],
    correctAnswer: "Bulging fontanel",
    explanation: "Bulging fontanel in an infant suggests increased ICP or meningitis.",
  };

  const adultItem: BankItem = {
    subjectId: "pediatrics-nursing",
    vignette: "Medical-surgical unit | 72-year-old postmenopausal woman with hip fracture",
    question: "Which nursing action is the priority?",
    options: ["Pain assessment", "Fall precautions", "DVT prophylaxis", "Early ambulation"],
    correctAnswer: "Pain assessment",
    explanation: "Postoperative pain control facilitates participation in care.",
  };

  it("includes pediatric vignettes", () => {
    expect(matchesNclexStudyPreset(pediatricItem, preset)).toBe(true);
  });

  it("excludes adult/menopause vignettes from pediatrics sessions", () => {
    expect(matchesNclexStudyPreset(adultItem, preset)).toBe(false);
  });

  it("filterItemsForNclexPreset keeps only pediatric items in strict mode", () => {
    const filtered = filterItemsForNclexPreset([pediatricItem, adultItem], preset, {
      strict: true,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.vignette).toContain("infant");
  });
});

describe("NCLEX blueprint content matching", () => {
  const sepsisItem: BankItem = {
    subjectId: "physiological-adaptation",
    vignette: "ICU. Client with fever, hypotension, and lactic acid 4.2 mmol/L. Suspected sepsis.",
    question: "Which intervention is the priority?",
    options: ["Blood cultures", "IV fluids", "Antibiotics", "Vasopressors"],
    correctAnswer: "IV fluids",
    explanation: "Early fluid resuscitation is key in sepsis.",
  };

  const eriksonItem: BankItem = {
    subjectId: "health-promotion",
    vignette: "Community clinic. Parent asks about Erikson trust vs mistrust stage for infant.",
    question: "Which response is best?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Trust develops through consistent caregiving.",
  };

  it("matches shock-sepsis blueprint by content", () => {
    expect(matchesNclexBlueprintTopic(sepsisItem, "shock-sepsis")).toBe(true);
    expect(matchesNclexBlueprintTopic(sepsisItem, "erikson-stages")).toBe(false);
  });

  it("matches erikson-stages blueprint by content", () => {
    expect(matchesNclexBlueprintTopic(eriksonItem, "erikson-stages")).toBe(true);
    expect(matchesNclexBlueprintTopic(eriksonItem, "shock-sepsis")).toBe(false);
  });
});

describe("NCLEX topic practice combined filter", () => {
  const electrolytesPreset = getNclexStudyPreset("electrolytes-block")!;

  const electrolyteItem: BankItem = {
    subjectId: "physiological-adaptation",
    blueprintTopic: "fluid-balance-io",
    vignette: "Med-surg unit. Client with hypokalemia, potassium 3.1 mEq/L, on IV fluids.",
    question: "Which finding requires immediate action?",
    options: ["Muscle weakness", "Dry skin", "Bradycardia", "Hypertension"],
    correctAnswer: "Muscle weakness",
    explanation: "Hypokalemia can cause life-threatening dysrhythmias.",
  };

  const prioritizationItem: BankItem = {
    subjectId: "physiological-adaptation",
    vignette: "Emergency department. Nurse assigned four clients. Who should be seen first?",
    question: "Which client should the nurse see first?",
    options: ["Chest pain", "Sprained ankle", "Sore throat", "Rash"],
    correctAnswer: "Chest pain",
    explanation: "Unstable cardiac symptoms take priority.",
  };

  it("electrolytes topic keeps electrolyte content only", () => {
    const filtered = filterItemsForNclexTopicPractice(
      [electrolyteItem, prioritizationItem],
      {
        blueprintTopics: ["fluid-balance-io"],
        nclexPreset: electrolytesPreset,
      },
      { strict: true }
    );
    expect(filtered).toHaveLength(1);
    expect(matchesNclexTopicPracticeItem(filtered[0]!, {
      blueprintTopics: ["fluid-balance-io"],
      nclexPreset: electrolytesPreset,
    })).toBe(true);
  });
});

describe("NCLEX blueprint alias matching at serve time", () => {
  it("keeps legacy electrolyte tags when Study Hub asks for fluid-balance-io", () => {
    const legacyTagged: BankItem = {
      subjectId: "med-surg",
      blueprintTopic: "electrolytes",
      vignette: "Med-surg. Client with sodium 128 and confusion.",
      question: "Which finding is the priority?",
      options: ["Confusion", "Dry skin", "Thirst", "Orthostasis"],
      correctAnswer: "Confusion",
      explanation: "Hyponatremia with neuro change is urgent.",
    };
    const offTopic: BankItem = {
      subjectId: "physiological-adaptation",
      blueprintTopic: "prioritization",
      vignette: "ED. Four clients. Who is seen first?",
      question: "Which client first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Unstable first.",
    };

    const filtered = filterItemsForNclexBlueprintTopics(
      [legacyTagged, offTopic],
      ["fluid-balance-io"],
      { contentMatch: false }
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.blueprintTopic).toBe("electrolytes");
  });

  it("includes correctly tagged items even when subjectId is wrong for the topic", () => {
    const misfiled: BankItem = {
      subjectId: "management-of-care",
      blueprintTopic: "shock-sepsis",
      vignette: "ICU. Fever, MAP 55, lactate 4.8.",
      question: "Priority intervention?",
      options: ["Fluids", "Antipyretic", "Culture only", "Wait"],
      correctAnswer: "Fluids",
      explanation: "Resuscitate septic shock.",
    };

    expect(
      filterItemsForNclexBlueprintTopics([misfiled], ["shock-sepsis"], {
        contentMatch: false,
      })
    ).toHaveLength(1);
  });
});
