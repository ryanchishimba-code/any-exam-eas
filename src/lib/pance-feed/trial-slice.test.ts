import { describe, expect, it } from "vitest";
import { TRIAL_FLASHCARD_FEED_FRACTION, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  isTrialFlashcardAllowed,
  trialFlashcardSlice,
  trialFlashcardSliceCount,
} from "./trial-slice";

describe("trial flashcard slice", () => {
  it("keeps the 10% fraction next to the question cap, without changing that cap", () => {
    expect(TRIAL_FLASHCARD_FEED_FRACTION).toBe(0.1);
    expect(TRIAL_LIFETIME_QUESTIONS).toBe(100);
  });

  it("takes the first ceil(10%) in catalog order", () => {
    expect(trialFlashcardSliceCount(200)).toBe(20);
    expect(trialFlashcardSliceCount(201)).toBe(21);
    expect(trialFlashcardSliceCount(1)).toBe(1);
    expect(trialFlashcardSliceCount(0)).toBe(0);
    const ids = Array.from({ length: 200 }, (_, index) => `naplex-${String(index + 1).padStart(3, "0")}`);
    expect(trialFlashcardSlice(ids)).toEqual(ids.slice(0, 20));
    expect(isTrialFlashcardAllowed(ids, "naplex-020")).toBe(true);
    expect(isTrialFlashcardAllowed(ids, "naplex-021")).toBe(false);
  });
});