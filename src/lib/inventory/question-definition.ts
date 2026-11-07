/**
 * Copy-only inventory wording. Kept out of the database module so client
 * bundles can fall back to this sentence without loading Neon.
 */
export const ACTIVE_QUESTION_DEFINITION =
  "Each question in this count is one practice item a student can study. It is live, it has passed review, and it has cleared the checks that keep flawed questions out of a session. Questions held back by a fixed list in our review rules are not counted. Published Next Generation NCLEX items are counted on their own and are not added to this total. Drafts, memory cards, and library case sets are not included.";
