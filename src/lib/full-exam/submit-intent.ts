/**
 * Last-item primary action. A fixed form's last item, and a CAT item that
 * ends the session, offer Review & submit. That control is not disabled
 * just because it is the last item.
 */
export function shouldOfferFullExamReviewSubmit(input: {
  isCat: boolean;
  index: number;
  servedCount: number;
  catAlreadyComplete: boolean;
  catStopsAfterCurrent: boolean;
}): boolean {
  if (input.servedCount <= 0 || input.index < 0) return false;
  const onLastServed = input.index >= input.servedCount - 1;
  if (!onLastServed) return false;
  if (!input.isCat) return true;
  return input.catAlreadyComplete || input.catStopsAfterCurrent;
}

/**
 * "You ended the exam early" is for stopping before the form or the CAT
 * engine is done. Finishing every planned item, or a CAT confidence/max stop,
 * is a normal submit even if the student used End exam on the last item.
 */
export function fullExamSubmitEndedEarly(input: {
  requestedEarly: boolean;
  servedCount: number;
  answeredCount: number;
  plannedCount: number;
  catNaturalStop: boolean;
}): boolean {
  if (input.catNaturalStop) return false;
  const finishedFixed =
    input.plannedCount > 0 &&
    input.servedCount >= input.plannedCount &&
    input.answeredCount >= input.servedCount &&
    input.servedCount > 0;
  if (finishedFixed) return false;
  return input.requestedEarly;
}
