import { describe, expect, it } from "vitest";
import { sealCatalogQuestionKey } from "./prepare-timed-exam-client-payload";

describe("session item seals", () => {
  it("keeps the same case item id when the same exam reloads", () => {
    const first = sealCatalogQuestionKey("ngn:NC003-S1:v1", "session-a");
    const second = sealCatalogQuestionKey("ngn:NC003-S1:v1", "session-a");
    expect(first).toBe(second);
    expect(first).not.toBe("ngn:NC003-S1:v1");
  });

  it("uses a different id for a different sitting", () => {
    const a = sealCatalogQuestionKey("ngn:NC003-S1:v1", "session-a");
    const b = sealCatalogQuestionKey("ngn:NC003-S1:v1", "session-b");
    expect(a).not.toBe(b);
  });
});
