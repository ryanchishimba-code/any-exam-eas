import { describe, expect, it } from "vitest";
import {
  findApprovedNclexFiguresForTopic,
  getApprovedNclexFigureById,
  NCLEX_FIGURE_CATALOG,
  attachNclexFigureRefToNgn,
  nclexFigureFitsItem,
  selectNclexFigureForItem,
} from "./figure-assets";
import { normalizeNclexExhibitPayload } from "./normalize-exhibit";
import type { BankItem } from "@/lib/question-bank";

describe("NCLEX figure catalog", () => {
  it("exposes approved nursing teaching SVGs", () => {
    expect(NCLEX_FIGURE_CATALOG.length).toBeGreaterThanOrEqual(6);
    for (const fig of NCLEX_FIGURE_CATALOG) {
      expect(fig.reviewStatus).toBe("approved");
      expect(fig.url.startsWith("data:image/svg+xml")).toBe(true);
      expect(fig.id.startsWith("nclex-")).toBe(true);
    }
  });

  it("finds fetal monitoring figure by exact topic", () => {
    const figs = findApprovedNclexFiguresForTopic("labor-fetal-monitoring");
    expect(figs[0]?.id).toBe("nclex-fetal-late-decels");
  });

  it("does not match short substring topics like labor alone", () => {
    expect(findApprovedNclexFiguresForTopic("labor")).toEqual([]);
  });

  it("skips multi-client priority stems even if insulin is mentioned", () => {
    const item = {
      vignette:
        "Four clients require attention. Room 354: diabetes, missed insulin 2 days. Room 360: chest pain.",
      question: "Which client is the highest priority for the nurse to see first?",
      blueprintTopic: "endocrine-meds",
    };
    expect(selectNclexFigureForItem(item)).toBeUndefined();
  });

  it("does not attach late-decels figure for prenatal FHR tones without late decelerations", () => {
    expect(
      selectNclexFigureForItem({
        vignette:
          "A pregnant client at 28 weeks presents for prenatal care. Fetal heart tones are 140 bpm.",
        question: "Which finding is the highest priority during this visit?",
        blueprintTopic: "labor-fetal-monitoring",
      })
    ).toBeUndefined();
  });

  it("attaches late-decels figure when stem tests late decelerations", () => {
    expect(
      selectNclexFigureForItem({
        vignette:
          "Oxytocin is infusing. The fetal monitor shows late decelerations with each contraction.",
        question: "Which action should the nurse take first?",
        blueprintTopic: "labor-fetal-monitoring",
      })?.id
    ).toBe("nclex-fetal-late-decels");
  });

  it("does not attach insulin timing chart for DKA infusion without peak/onset language", () => {
    expect(
      selectNclexFigureForItem({
        vignette:
          "Client with DKA is on an insulin infusion. Blood glucose is 250 mg/dL.",
        question: "Which action should the nurse take first?",
        blueprintTopic: "endocrine-meds",
      })
    ).toBeUndefined();
  });

  it("attaches insulin timing when the item tests peak hypoglycemia risk", () => {
    expect(
      selectNclexFigureForItem({
        vignette: "Regular insulin was given at 0730.",
        question:
          "At which time is the client at greatest risk for hypoglycemia related to the peak effect?",
        blueprintTopic: "endocrine-meds",
      })?.id
    ).toBe("nclex-insulin-timing");
  });

  it("does not attach PPE figure for isolation without donning/doffing order", () => {
    expect(
      selectNclexFigureForItem({
        vignette: "Client with C. difficile is on contact precautions.",
        question: "Which room assignment is most appropriate?",
        blueprintTopic: "ppe-donning-doffing",
      })
    ).toBeUndefined();
  });

  it("attaches PPE figure when donning order is tested", () => {
    expect(
      selectNclexFigureForItem({
        vignette: "Nurse prepares to enter a contact-precaution room.",
        question: "In which order should the nurse don PPE?",
        blueprintTopic: "ppe-donning-doffing",
      })?.id
    ).toBe("nclex-ppe-donning");
  });

  it("attaches without overwriting NGN kind", () => {
    const fig = getApprovedNclexFigureById("nclex-ppe-donning")!;
    const next = attachNclexFigureRefToNgn({ kind: "bow_tie", condition: "x" }, fig);
    expect(next.kind).toBe("bow_tie");
    expect((next.media as unknown[]).length).toBe(1);
  });
});

describe("normalizeNclexExhibitPayload", () => {
  it("attaches VT figure only when stem mentions VT", () => {
    const item = {
      subjectId: "med-surg",
      vignette:
        "Telemetry shows ventricular tachycardia at 180 bpm. Client is unresponsive and pulseless.",
      question: "Which action should the nurse take first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "vignette",
      blueprintTopic: "cardiac-emergencies",
      ngnPayload: { kind: "vignette" },
    } as BankItem;

    const next = normalizeNclexExhibitPayload(item);
    expect((next.ngnPayload?.media as { id: string }[])[0]?.id).toBe("nclex-ecg-vt-schematic");
  });

  it("does not attach VT figure for generic cardiac-emergencies CHF stem", () => {
    const item = {
      subjectId: "med-surg",
      vignette: "Client with acute decompensated heart failure, crackles, SpO2 91%.",
      question: "Which finding requires follow-up?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "vignette",
      blueprintTopic: "cardiac-emergencies",
      ngnPayload: { kind: "vignette" },
    } as BankItem;

    expect(selectNclexFigureForItem(item)).toBeUndefined();
    const next = normalizeNclexExhibitPayload(item);
    expect(next.ngnPayload?.media).toBeUndefined();
  });

  it("prunes misfit media and keeps NGN kind when normalizing labs", () => {
    const item = {
      subjectId: "med-surg",
      vignette: "Client with stage 3 pressure injury on the sacrum.",
      question: "Which nursing action is most appropriate?",
      options: ["A", "B", "C"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "select_all",
      blueprintTopic: "pressure-injury-staging",
      ngnPayload: {
        kind: "select_all",
        media: [
          {
            id: "nclex-ecg-vt-schematic",
            kind: "ecg",
            url: "data:image/svg+xml,x",
            alt: "VT",
            reviewStatus: "approved",
            topics: [],
            license: "x",
            sourceNote: "x",
            organSystem: "x",
          },
        ],
        exhibit: {
          title: "Labs",
          findings: [{ label: "K+", value: "2.8", reference: "3.5–5.0", abnormal: true }],
        },
      },
    } as BankItem;

    const next = normalizeNclexExhibitPayload(item);
    expect(next.ngnPayload?.kind).toBe("select_all");
    expect((next.ngnPayload?.table as { rows: string[][] }).rows[0][0]).toBe("K+");
    expect((next.ngnPayload?.media as { id: string }[])[0]?.id).toBe(
      "nclex-pressure-injury-stages"
    );
  });
});
