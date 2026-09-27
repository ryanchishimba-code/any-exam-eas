/**
 * Copy-only inventory wording. Kept out of the database module so client
 * bundles can fall back to this sentence without loading Neon.
 */
export const ACTIVE_QUESTION_DEFINITION =
  "A question is one scored item: a student-eligible bank row, a published standalone NGN item, or a published item inside a published case study. The case study itself is not an extra question. Active means published and not retired. Drafts, hidden items, memory cards, and library case sets are not included.";
