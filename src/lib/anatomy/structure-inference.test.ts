import { describe, expect, it } from "vitest";
import { inferAnatomyStructuresFromText } from "./structure-inference";

describe("inferAnatomyStructuresFromText", () => {
  it("matches organ names in clinical stems", () => {
    const hits = inferAnatomyStructuresFromText(
      "A 58-year-old with crushing chest pain and ST elevations in leads V1–V4. Which coronary territory is affected?"
    );
    expect(hits.some((s) => s.id === "heart" || s.id === "heart-coronary-arteries")).toBe(true);
  });

  it("matches skeletal landmarks in MSK vignettes", () => {
    const hits = inferAnatomyStructuresFromText(
      "Tenderness over the sternum after blunt chest trauma — evaluate for sternal fracture."
    );
    expect(hits.some((s) => s.id === "sternum")).toBe(true);
  });

  it("returns empty for unrelated text", () => {
    expect(inferAnatomyStructuresFromText("Calculate the osmolar gap for this toxic alcohol ingestion.")).toEqual(
      []
    );
  });

  it("does not attach clavicle or femur to a pharmacokinetics stem that says long", () => {
    const hits = inferAnatomyStructuresFromText(
      "A patient starts a drug with a long half-life and linear clearance. How long until steady state, and what happens to the volume of distribution if protein binding falls?"
    );
    expect(hits.map((hit) => hit.id)).not.toEqual(expect.arrayContaining(["clavicle", "femur"]));
    expect(hits.some((hit) => /clavicle|femur/i.test(hit.id))).toBe(false);
  });

  it("maps chest pain with ST elevation to the heart", () => {
    const hits = inferAnatomyStructuresFromText(
      "Crushing substernal chest pain with ST elevations — which coronary artery territory?"
    );
    expect(hits.some((hit) => hit.id === "heart" || hit.id === "heart-coronary-arteries")).toBe(true);
  });

  it("hides prostate on a levodopa stem that only mentions male", () => {
    const hits = inferAnatomyStructuresFromText(
      "A 72-year-old male with Parkinson disease takes levodopa and develops nausea. Which finding requires follow-up?"
    );
    expect(hits.some((hit) => hit.id === "prostate")).toBe(false);
  });

  it("hides intermediate cuneiform when the stem never names that bone", () => {
    const stems = [
      "Intermediate teaching for a client with a stroke, terminal cancer, anorexia, and pediatric acetaminophen dosing.",
      "A client with terminal cancer reports anorexia. Which finding requires follow-up?",
      "Pediatric acetaminophen dosing after a stroke. Which instruction is correct?",
    ];
    for (const stem of stems) {
      const hits = inferAnatomyStructuresFromText(stem);
      expect(hits.some((hit) => /cuneiform/i.test(hit.id))).toBe(false);
    }
  });

  it("still matches a named bone in an orthopedic stem", () => {
    const hits = inferAnatomyStructuresFromText(
      "An older adult falls and has a shortened, externally rotated leg. Imaging shows a femoral neck fracture of the femur."
    );
    expect(hits.some((hit) => hit.id === "femur")).toBe(true);
  });
});
