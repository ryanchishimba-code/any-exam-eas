/** Target share of served NCLEX items with delegation/UAP stems (~real exam). */
export const NCLEX_DELEGATION_SERVE_CAP = 0.05;

export const NCLEX_DELEGATION_STEM_RE =
  /delegate|delegation|\bUAP\b|unlicensed assistive personnel|appropriate for (?:the )?(?:UAP|unlicensed)|safely delegated to UAP|assign.*(?:task|activity).*UAP/i;

export const NCLEX_DELEGATION_VIGNETTE_RE =
  /assign tasks to (?:unlicensed assistive personnel|UAP)|maintaining accountability|delegate tasks to UAP/i;

/** Subject id where delegation/UAP scope questions belong on NCLEX. */
export const NCLEX_DELEGATION_SUBJECT_ID = "management-of-care";

export function isNclexDelegationStem(stem: string, scenario?: string | null): boolean {
  const text = [scenario, stem].filter(Boolean).join(" ");
  return NCLEX_DELEGATION_STEM_RE.test(text);
}

export function hasNclexDelegationVignette(text: string): boolean {
  return NCLEX_DELEGATION_VIGNETTE_RE.test(text);
}

export function delegationAllowedForSubject(subjectId: string | undefined | null): boolean {
  return subjectId === NCLEX_DELEGATION_SUBJECT_ID;
}

export function maxDelegationServeCount(totalServed: number): number {
  return Math.max(1, Math.floor(totalServed * NCLEX_DELEGATION_SERVE_CAP));
}
