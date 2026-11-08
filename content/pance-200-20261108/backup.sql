-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'pance'
    AND "generationVersion" = 'pance-200-20261108-v1'
) TO STDOUT WITH CSV HEADER;
