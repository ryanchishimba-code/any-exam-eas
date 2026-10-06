import { describe, expect, it } from "vitest";
import {
  fullExamSubmitEndedEarly,
  shouldOfferFullExamReviewSubmit,
} from "@/lib/full-exam/submit-intent";

describe("shouldOfferFullExamReviewSubmit", () => {
  it("enables review on the last item of a fixed exam", () => {
    expect(
      shouldOfferFullExamReviewSubmit({
        isCat: false,
        index: 224,
        servedCount: 225,
        catAlreadyComplete: false,
        catStopsAfterCurrent: false,
      })
    ).toBe(true);
  });

  it("enables review on the CAT item that stops the session", () => {
    expect(
      shouldOfferFullExamReviewSubmit({
        isCat: true,
        index: 149,
        servedCount: 150,
        catAlreadyComplete: false,
        catStopsAfterCurrent: true,
      })
    ).toBe(true);
    expect(
      shouldOfferFullExamReviewSubmit({
        isCat: true,
        index: 90,
        servedCount: 91,
        catAlreadyComplete: false,
        catStopsAfterCurrent: true,
      })
    ).toBe(true);
  });

  it("keeps Next while the CAT still has another item", () => {
    expect(
      shouldOfferFullExamReviewSubmit({
        isCat: true,
        index: 10,
        servedCount: 11,
        catAlreadyComplete: false,
        catStopsAfterCurrent: false,
      })
    ).toBe(false);
  });
});

describe("fullExamSubmitEndedEarly", () => {
  it("does not call a finished 225-item exam early", () => {
    expect(
      fullExamSubmitEndedEarly({
        requestedEarly: true,
        servedCount: 225,
        answeredCount: 225,
        plannedCount: 225,
        catNaturalStop: false,
      })
    ).toBe(false);
  });

  it("does not call a finished 150-item CAT early", () => {
    expect(
      fullExamSubmitEndedEarly({
        requestedEarly: true,
        servedCount: 150,
        answeredCount: 150,
        plannedCount: 150,
        catNaturalStop: true,
      })
    ).toBe(false);
  });

  it("does not call a confidence stop early", () => {
    expect(
      fullExamSubmitEndedEarly({
        requestedEarly: false,
        servedCount: 91,
        answeredCount: 91,
        plannedCount: 150,
        catNaturalStop: true,
      })
    ).toBe(false);
  });

  it("keeps a true early end", () => {
    expect(
      fullExamSubmitEndedEarly({
        requestedEarly: true,
        servedCount: 40,
        answeredCount: 40,
        plannedCount: 150,
        catNaturalStop: false,
      })
    ).toBe(true);
    expect(
      fullExamSubmitEndedEarly({
        requestedEarly: true,
        servedCount: 225,
        answeredCount: 40,
        plannedCount: 225,
        catNaturalStop: false,
      })
    ).toBe(true);
  });
});
