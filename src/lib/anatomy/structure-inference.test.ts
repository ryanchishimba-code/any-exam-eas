import { describe, expect, it } from "vitest";
import { inferAnatomyStructuresFromText } from "./structure-inference";

describe("inferAnatomyStructuresFromText", () => {
  it("matches organ names in clinical stems", () => {
    const hits = inferAnatomyStructuresFromText(
      "A 58-year-old with crushing chest pain and ST elevations in leads V1–V4. Which coronary territory is affected?"
    );
    expect(hits.some((s) => s.id === "heart")).toBe(true);
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
});
