-- Read-only copy of the live Step 3 pack. Does not change the database.
COPY (
  SELECT "id", "contentHash", "subjectId", "blueprintDomain", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'usmle-step-3'
    AND "generationVersion" = 'usmle-step3-300-20261108-v1'
) TO STDOUT WITH CSV HEADER;
