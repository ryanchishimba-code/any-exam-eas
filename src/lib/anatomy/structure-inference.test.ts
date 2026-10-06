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

  it("does not attach clavicle or femur to a pharmacokinetics stem that says long", () => {
    const hits = inferAnatomyStructuresFromText(
      "A patient starts a drug with a long half-life and linear clearance. How long until steady state, and what happens to the volume of distribution if protein binding falls?"
    );
    expect(hits.map((hit) => hit.id)).not.toEqual(expect.arrayContaining(["clavicle", "femur"]));
    expect(hits.some((hit) => /clavicle|femur/i.test(hit.id))).toBe(false);
  });

  it("still matches a named bone in an orthopedic stem", () => {
    const hits = inferAnatomyStructuresFromText(
      "An older adult falls and has a shortened, externally rotated leg. Imaging shows a femoral neck fracture of the femur."
    );
    expect(hits.some((hit) => hit.id === "femur")).toBe(true);
  });
});
