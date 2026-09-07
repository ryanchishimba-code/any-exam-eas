import { describe, expect, it } from "vitest";
import {
  attachFigureRefToNgn,
  findApprovedFiguresForTopic,
  getApprovedFigureById,
  USMLE_FIGURE_CATALOG,
} from "./figure-assets";

describe("USMLE figure catalog", () => {
  it("exposes only approved educational SVG assets", () => {
    expect(USMLE_FIGURE_CATALOG.length).toBeGreaterThanOrEqual(5);
    for (const fig of USMLE_FIGURE_CATALOG) {
      expect(fig.reviewStatus).toBe("approved");
      expect(fig.url.startsWith("data:image/svg+xml")).toBe(true);
      expect(fig.alt.length).toBeGreaterThan(10);
      expect(fig.license).toContain("AnyExamEasy");
    }
  });

  it("finds STEMI figure by topic slug and content gate prefers STEMI stems", () => {
    const figs = findApprovedFiguresForTopic("acute-coronary-syndrome", "cardiovascular");
    expect(figs.some((f) => f.id === "ecg-anterior-stemi-schematic")).toBe(true);
  });

  it("selectUsmleFigureForItem requires content keywords", async () => {
    const { selectUsmleFigureForItem } = await import("./figure-assets");
    expect(
      selectUsmleFigureForItem({
        blueprintTopic: "acute-coronary-syndrome",
        vignette: "Patient with reflux after spicy food.",
        question: "Next step?",
      })
    ).toBeUndefined();
    expect(
      selectUsmleFigureForItem({
        blueprintTopic: "acute-coronary-syndrome",
        vignette: "Crushing chest pain; troponin pending. ECG pending.",
        question: "Next step in management?",
      })
    ).toBeUndefined();
    expect(
      selectUsmleFigureForItem({
        blueprintTopic: "acute-coronary-syndrome",
        vignette: "Crushing chest pain with ST elevation in V2–V4 and rising troponin.",
        question: "Next step in management?",
      })?.id
    ).toBe("ecg-anterior-stemi-schematic");
  });

  it("selects AFib figure by content even when topic is ACS", async () => {
    const { selectUsmleFigureForItem } = await import("./figure-assets");
    expect(
      selectUsmleFigureForItem({
        blueprintTopic: "acs-management",
        question:
          "A 62-year-old woman with atrial fibrillation presents with sudden right-sided weakness. Next step?",
      })?.id
    ).toBe("ecg-afib-schematic");
  });

  it("prunes misfit STEMI media from stroke stems", async () => {
    const { normalizeUsmleExhibitPayload } = await import("./normalize-exhibit");
    const next = normalizeUsmleExhibitPayload({
      subjectId: "internal-medicine",
      question:
        "A 62-year-old woman presents with sudden right-sided weakness and slurred speech. Atrial fibrillation, not anticoagulated. Next step?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test explanation long enough",
      itemType: "exhibit",
      blueprintTopic: "acs-management",
      ngnPayload: {
        kind: "exhibit",
        media: [
          {
            id: "ecg-anterior-stemi-schematic",
            kind: "ecg",
            url: "data:image/svg+xml,x",
            alt: "STEMI",
            reviewStatus: "approved",
            topics: [],
            license: "x",
            sourceNote: "x",
            organSystem: "x",
          },
          {
            id: "pathway-acs-initial",
            kind: "pathway",
            url: "data:image/svg+xml,y",
            alt: "ACS",
            reviewStatus: "approved",
            topics: [],
            license: "x",
            sourceNote: "x",
            organSystem: "x",
          },
        ],
      },
    } as import("@/lib/question-bank").BankItem);
    const ids = ((next.ngnPayload?.media as { id: string }[]) ?? []).map((m) => m.id);
    expect(ids).toContain("ecg-afib-schematic");
    expect(ids).not.toContain("ecg-anterior-stemi-schematic");
    expect(ids).not.toContain("pathway-acs-initial");
  });

  it("finds pneumothorax schematic", () => {
    const figs = findApprovedFiguresForTopic("pneumothorax");
    expect(figs[0]?.id).toBe("cxr-ptx-schematic");
  });

  it("attaches figure idempotently by id", () => {
    const fig = getApprovedFigureById("ecg-afib-schematic")!;
    const once = attachFigureRefToNgn({ kind: "exhibit" }, fig);
    const twice = attachFigureRefToNgn(once, fig);
    expect((once.media as unknown[]).length).toBe(1);
    expect((twice.media as unknown[]).length).toBe(1);
  });
});
