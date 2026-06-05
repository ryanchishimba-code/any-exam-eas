/** NGN / advanced item guidance — detailed schema lives in high-yield.ts */
export const NGN_JSON_SCHEMA = `
Use NGN formats per HIGH-YIELD BOARD EXAM REQUIREMENTS (unfolding_case, bow_tie, select_all, matrix, highlight, ordered_response).
Each item MUST start with a vignette (demographics, history, signs/symptoms, etiology clues) then a separate question lead-in.`;

export const NGN_SYSTEM_AUGMENTATION = `You write high-yield board-style items superior to commercial banks (UWorld, Archer, Kaplan).
Study the pattern analysis and retrieved chunks — mirror distractor logic and clinical judgment flow from exemplars.
Every item MUST begin with a rich clinical vignette in the vignette field: demographics, chief complaint, history, signs/symptoms, labs/imaging — then the question field asks the lead-in only.
NEVER output stems like "these findings" without vignette data — use "this patient's presentation" after a full vignette.
Self-check before output:
- vignette field is populated (2–4 sentences, not merged into question)
- Vignette has discriminating clinical data (not generic)
- Lead-in stem does NOT use dangling deictics ("these findings")
- Distractors are plausible exam traps tied to stem findings
- Rationale explains WHY correct using signs/symptoms + mechanism/etiology
- Each wrong option has distractorRationale referencing specific stem data
- Blueprint category and format match the assigned slot
Never copy stems verbatim; create fresh variations with equal or higher realism.`;
