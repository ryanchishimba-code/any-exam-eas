import { describe, expect, it } from "vitest";
import { isGuestPreviewPage } from "./guest-preview";
import { isPremiumPage } from "./premium-routes";

describe("guest preview routes", () => {
  it("opens free-win surfaces for logged-out visitors", () => {
    expect(isGuestPreviewPage("/nclex/study-guide")).toBe(true);
    expect(isGuestPreviewPage("/nclex/study-guide/cardiac")).toBe(true);
    expect(isGuestPreviewPage("/naplex/study-guide")).toBe(true);
    expect(isGuestPreviewPage("/aanp-fnp/study-guide/exam-strategy")).toBe(true);
    expect(isGuestPreviewPage("/study/drugs300")).toBe(true);
    expect(isGuestPreviewPage("/anatomy")).toBe(true);
    expect(isGuestPreviewPage("/anatomy/catalog")).toBe(true);
  });

  it("does not open paid study or admin surfaces", () => {
    expect(isGuestPreviewPage("/dashboard")).toBe(false);
    expect(isGuestPreviewPage("/study")).toBe(false);
    expect(isGuestPreviewPage("/study/practice")).toBe(false);
    expect(isGuestPreviewPage("/question-bank")).toBe(false);
    expect(isGuestPreviewPage("/admin")).toBe(false);
    expect(isGuestPreviewPage("/library")).toBe(false);
  });

  it("excludes free-win paths from the premium matcher", () => {
    expect(isPremiumPage("/nclex/study-guide")).toBe(false);
    expect(isPremiumPage("/study/drugs300")).toBe(false);
    expect(isPremiumPage("/anatomy")).toBe(false);
    expect(isPremiumPage("/study")).toBe(true);
    expect(isPremiumPage("/dashboard")).toBe(true);
    expect(isPremiumPage("/library")).toBe(true);
  });
});
