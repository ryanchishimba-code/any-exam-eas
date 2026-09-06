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

  it("finds STEMI figure by topic slug", () => {
    const figs = findApprovedFiguresForTopic("acute-coronary-syndrome", "cardiovascular");
    expect(figs.some((f) => f.id === "ecg-anterior-stemi-schematic")).toBe(true);
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
