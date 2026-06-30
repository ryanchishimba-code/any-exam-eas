import { describe, expect, it } from "vitest";
import { generateNaplexProceduralCalcs } from "./naplex-calc-procedural";
import { isNaplexBestQuality } from "./naplex-quality-gate";
import { prepareNaplexBankItem } from "./naplex-serve-gate";

describe("naplex procedural calcs", () => {
  it("generates unique QA-gated calculation items", () => {
    const items = generateNaplexProceduralCalcs(50);
    expect(items.length).toBe(50);
    const hashes = new Set(items.map((i) => `${i.vignette}|${i.correctAnswer}`));
    expect(hashes.size).toBe(50);
    const passing = items.filter((item) =>
      isNaplexBestQuality(prepareNaplexBankItem(item), { source: "seed" })
    );
    expect(passing.length).toBeGreaterThanOrEqual(45);
  });

  it("verifies IV rate math for a known parameter set", () => {
    const items = generateNaplexProceduralCalcs(900);
    const match = items.find(
      (i) =>
        i.vignette?.includes("Dopamine 7 mcg/kg/min") &&
        i.vignette?.includes("Patient 4 kg") &&
        i.vignette?.includes("800 mcg/mL")
    );
    expect(match?.correctAnswer).toBe("2");
  });
});
