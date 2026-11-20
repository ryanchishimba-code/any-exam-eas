-- Scoped undo for the four USMLE rows hidden on 2026-11-08 after Ryan said to go.
-- Restores active and qaPassed from usmle_hide4_20261108 only.
-- Does not delete rows and does not touch the earlier clone-hide table.
-- Do not run unless Ryan asks to put these four items back.

UPDATE "QuestionBankItem" AS q
SET active = b.prior_active,
    "qaPassed" = b.prior_qa_passed,
    "updatedAt" = NOW()
FROM usmle_hide4_20261108 AS b
WHERE q.id = b.id;
