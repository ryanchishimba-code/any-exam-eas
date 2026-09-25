import { describe, expect, it } from "vitest";
import { isGuestPreviewPage } from "./guest-preview";
import { isPremiumPage, isStudyGuidePath } from "./premium-routes";

describe("guest preview routes", () => {
  it("opens free-win surfaces for logged-out visitors", () => {
    expect(isGuestPreviewPage("/study/drugs300")).toBe(true);
    expect(isGuestPreviewPage("/anatomy")).toBe(true);
    expect(isGuestPreviewPage("/anatomy/catalog")).toBe(true);
  });

  it("keeps reference books and other paid surfaces closed", () => {
    expect(isGuestPreviewPage("/nclex/study-guide")).toBe(false);
    expect(isGuestPreviewPage("/nclex/study-guide/cardiac")).toBe(false);
    expect(isGuestPreviewPage("/naplex/study-guide")).toBe(false);
    expect(isGuestPreviewPage("/aanp-fnp/study-guide/exam-strategy")).toBe(false);
    expect(isGuestPreviewPage("/dashboard")).toBe(false);
    expect(isGuestPreviewPage("/study")).toBe(false);
    expect(isGuestPreviewPage("/study/practice")).toBe(false);
    expect(isGuestPreviewPage("/question-bank")).toBe(false);
    expect(isGuestPreviewPage("/admin")).toBe(false);
    expect(isGuestPreviewPage("/library")).toBe(false);
  });

  it("treats study guides as premium and leaves other free wins open", () => {
    expect(isStudyGuidePath("/nclex/study-guide")).toBe(true);
    expect(isStudyGuidePath("/dashboard")).toBe(false);
    expect(isPremiumPage("/nclex/study-guide")).toBe(true);
    expect(isPremiumPage("/nclex/study-guide/cardiac")).toBe(true);
    expect(isPremiumPage("/naplex/study-guide")).toBe(true);
    expect(isPremiumPage("/aanp-fnp/study-guide/exam-strategy")).toBe(true);
    expect(isPremiumPage("/study/drugs300")).toBe(false);
    expect(isPremiumPage("/anatomy")).toBe(false);
    expect(isPremiumPage("/study")).toBe(true);
    expect(isPremiumPage("/dashboard")).toBe(true);
    expect(isPremiumPage("/library")).toBe(true);
  });
});
