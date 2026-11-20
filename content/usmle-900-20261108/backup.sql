-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "blueprintDomain", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'usmle-step-1'
    AND "generationVersion" = 'usmle-step1-300-20261108-v1'
) TO STDOUT WITH CSV HEADER;
