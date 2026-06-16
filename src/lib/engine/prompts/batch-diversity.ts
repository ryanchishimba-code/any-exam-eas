/** Mandatory anti-repetition rules for USMLE, NAPLEX, COMLEX, MPJE, and all board-style generation. */
export const BATCH_DIVERSITY_RULES = `
BATCH DIVERSITY & ANTI-REPETITION (mandatory — USMLE, NAPLEX, COMLEX, MPJE, and all board exams):
- No two consecutive questions may have similar style, similar answer choices, or similar clinical presentation.
- Questions must vary significantly in structure, lead-in stem type, vignette opening, and overall appearance.
- Within every batch of 10 questions (and every sliding window of 10):
  • Include diverse formats appropriate to the exam (diagnosis, mechanism, next step, counseling, law application, calculation, etc.).
  • Vary answer-choice structure throughout — different diagnoses, drug classes, legal principles, or clinical actions; never reuse the same option template on consecutive items.
  • Spread clinical presentations, pharmacy scenarios, or legal fact patterns — no repeated patient archetypes or clone vignettes in a batch.
  • Rotate demographics, care settings, and vignette openings — avoid identical "presents with..." templates in succession.
- Prevent any repetitive patterns within each batch of 10 questions.
- Self-check the full JSON before output: scan consecutive pairs and each group of 10 for style, option-set, and presentation overlap; revise until diverse.`;

/** Shorter reminder for brief/user-prompt layers. */
export const BATCH_DIVERSITY_USER_REMINDER = `
BATCH DIVERSITY (mandatory): No consecutive similar style, answer choices, or clinical presentation. Every set of 10 questions must use varied formats, varied answer choices, and distinct presentations — no repetitive patterns within each batch.`;
