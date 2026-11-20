-- Read-only copy of the live Step 2 CK pack. Does not change the database.
COPY (
  SELECT "id", "contentHash", "subjectId", "blueprintDomain", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'usmle-step-2'
    AND "generationVersion" = 'usmle-step2-300-20261108-v1'
) TO STDOUT WITH CSV HEADER;
