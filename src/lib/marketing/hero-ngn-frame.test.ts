import { describe, expect, it } from "vitest";
import { toHeroNgnFrame } from "./hero-ngn-frame";

const sources = [{ id: "LABEL_NALOXONE", title: "Naloxone HCl injection label (DailyMed)", url: "https://dailymed.nlm.nih.gov" }];

const complete = {
  id: "B01",
  stem: "The nurse is caring for a client on POD 1 after knee arthroplasty.",
  payload: {
    condition: { options: [{ id: "c1", text: "Opioid toxicity" }], keys: ["c1"] },
    actions: { options: [{ id: "a1", text: "Administer naloxone" }], keys: ["a1"] },
    monitor: { options: [{ id: "m1", text: "Respiratory rate" }], keys: ["m1"] },
  },
  exhibit: { title: "Nurses' Notes", text: "POD 1, 0300. Client is difficult to arouse." },
  rationale: { short: "The findings fit opioid toxicity. Naloxone is the reversal agent." },
  references: [{ src: "LABEL_NALOXONE", locator: "Indications" }],
  sources,
};

describe("toHeroNgnFrame", () => {
  it("maps a complete published bow-tie, including keyed options and sources", () => {
    const frame = toHeroNgnFrame(complete);
    expect(frame?.itemId).toBe("B01");
    expect(frame?.columns).toHaveLength(3);
    expect(frame?.columns[0]?.options[0]).toEqual({ text: "Opioid toxicity", keyed: true });
    expect(frame?.sources[0]?.title).toBe("Naloxone HCl injection label (DailyMed)");
    expect(frame?.rationale).toMatch(/naloxone/i);
  });

  it("returns null when a bow-tie column or the rationale is missing", () => {
    expect(toHeroNgnFrame({ ...complete, rationale: { short: "  " } })).toBeNull();
    expect(
      toHeroNgnFrame({
        ...complete,
        payload: { condition: complete.payload.condition, actions: complete.payload.actions },
      })
    ).toBeNull();
  });

  it("returns null when the item has no resolvable source", () => {
    expect(toHeroNgnFrame({ ...complete, references: [], sources: [] })).toBeNull();
  });
});
