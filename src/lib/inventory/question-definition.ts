/**
 * Copy-only inventory wording. Kept out of the database module so client
 * bundles can fall back to this sentence without loading Neon.
 */
export const ACTIVE_QUESTION_DEFINITION =
  "A question is one student-eligible bank row: active, qa-passed, and past the student-serving gate. Code-level hidden ids are not counted. Published NGN catalog items are counted separately and are not added to this total. Drafts, memory cards, and library case sets are not included.";
