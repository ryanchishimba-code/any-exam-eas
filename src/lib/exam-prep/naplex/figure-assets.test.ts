import { describe, expect, it } from "vitest";
import {
  findApprovedNaplexFiguresForTopic,
  getApprovedNaplexFigureById,
  NAPLEX_FIGURE_CATALOG,
  attachNaplexFigureRefToNgn,
  selectNaplexFigureForItem,
} from "./figure-assets";
import { normalizeNaplexExhibitPayload } from "./normalize-exhibit";
import type { BankItem } from "@/lib/question-bank";

describe("NAPLEX figure catalog", () => {
  it("exposes approved pharmacy teaching SVGs", () => {
    expect(NAPLEX_FIGURE_CATALOG.length).toBeGreaterThanOrEqual(5);
    for (const fig of NAPLEX_FIGURE_CATALOG) {
      expect(fig.reviewStatus).toBe("approved");
      expect(fig.url.startsWith("data:image/svg+xml")).toBe(true);
      expect(fig.id.startsWith("naplex-")).toBe(true);
    }
  });

  it("finds inhaler figure by topic", () => {
    const figs = findApprovedNaplexFiguresForTopic("asthma-copd-inhalers");
    expect(figs[0]?.id).toBe("naplex-inhaler-mdi-steps");
  });

  it("does not attach inhaler figure for ambient inhaler refill stems", () => {
    expect(
      selectNaplexFigureForItem({
        vignette:
          "A 70-year-old with COPD presents for a refill of tiotropium inhaler. A1c is 7.2%.",
        question: "Which laboratory value warrants a therapeutic change?",
        blueprintTopic: "asthma-copd-inhalers",
      })
    ).toBeUndefined();
  });

  it("attaches inhaler figure when technique counseling is tested", () => {
    expect(
      selectNaplexFigureForItem({
        vignette: "Patient is started on an ICS/LABA MDI and asks how to use the inhaler.",
        question: "Which counseling points describe correct inhaler technique?",
        blueprintTopic: "asthma-copd-inhalers",
      })?.id
    ).toBe("naplex-inhaler-mdi-steps");
  });

  it("attaches CrCl formula when Cockcroft calculation is tested", () => {
    expect(
      selectNaplexFigureForItem({
        vignette: "72 yo woman, 60 kg, SCr 1.4 mg/dL.",
        question: "What is the estimated CrCl using Cockcroft-Gault?",
        blueprintTopic: "calculations-creatinine-clearance",
      })?.id
    ).toBe("naplex-crcl-formula");
  });

  it("does not attach CrCl formula when stem only cites a CrCl value for DOAC dosing", () => {
    expect(
      selectNaplexFigureForItem({
        vignette:
          "A 58-year-old with atrial fibrillation is prescribed rivaroxaban. He has a CrCl of 45 mL/min.",
        question: "What is the most appropriate action regarding the rivaroxaban prescription?",
        blueprintTopic: "anticoagulation",
      })
    ).toBeUndefined();
  });

  it("attaches without overwriting constructed kind", () => {
    const fig = getApprovedNaplexFigureById("naplex-crcl-formula")!;
    const next = attachNaplexFigureRefToNgn(
      { kind: "constructed", unit: "mL/min" },
      fig
    );
    expect(next.kind).toBe("constructed");
    expect((next.media as unknown[]).length).toBe(1);
  });
});

describe("normalizeNaplexExhibitPayload", () => {
  it("attaches vanco TDM figure for trough adjustment stems", () => {
    const item = {
      subjectId: "pharmacology",
      vignette:
        "Patient on vancomycin; steady-state trough concentration is 28 mcg/mL. SCr stable.",
      question: "What is the most appropriate vancomycin dose adjustment?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "vignette",
      blueprintTopic: "tdm-monitoring",
      ngnPayload: { kind: "vignette" },
    } as BankItem;

    const next = normalizeNaplexExhibitPayload(item);
    expect((next.ngnPayload?.media as { id: string }[])[0]?.id).toBe(
      "naplex-vanco-tdm-pathway"
    );
  });

  it("does not attach insulin timing without peak/onset language", () => {
    const item = {
      subjectId: "pharmacology",
      vignette: "Patient with T2DM is prescribed insulin glargine 20 units at bedtime.",
      question: "Which monitoring parameter is most appropriate?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "vignette",
      blueprintTopic: "insulin-diabetes-management",
      ngnPayload: { kind: "vignette" },
    } as BankItem;

    expect(selectNaplexFigureForItem(item)).toBeUndefined();
    const next = normalizeNaplexExhibitPayload(item);
    expect(next.ngnPayload?.media).toBeUndefined();
  });

  it("prunes misfit media and keeps constructed kind when normalizing labs", () => {
    const item = {
      subjectId: "pharmacology",
      vignette: "72 yo woman, wt 60 kg, SCr 1.8 mg/dL. Use Cockcroft-Gault.",
      question: "Calculate the CrCl for renal dosing.",
      options: [],
      correctAnswer: "45",
      explanation: "test",
      itemType: "constructed_response",
      blueprintTopic: "calculations-creatinine-clearance",
      ngnPayload: {
        kind: "constructed",
        unit: "mL/min",
        media: [
          {
            id: "naplex-inhaler-mdi-steps",
            kind: "diagram",
            url: "data:image/svg+xml,x",
            alt: "inhaler",
            reviewStatus: "approved",
            topics: [],
            license: "x",
            sourceNote: "x",
            organSystem: "x",
          },
        ],
        exhibit: {
          title: "Labs",
          findings: [{ label: "SCr", value: "1.8", reference: "0.6–1.2", abnormal: true }],
        },
      },
    } as BankItem;

    const next = normalizeNaplexExhibitPayload(item);
    expect(next.ngnPayload?.kind).toBe("constructed");
    expect((next.ngnPayload?.table as { rows: string[][] }).rows[0][0]).toBe("SCr");
    expect((next.ngnPayload?.media as { id: string }[])[0]?.id).toBe("naplex-crcl-formula");
  });
});
