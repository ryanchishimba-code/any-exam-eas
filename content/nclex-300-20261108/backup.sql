-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "itemType", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'nursing'
    AND "generationVersion" = 'nclex-300-20261108-v1'
) TO STDOUT WITH CSV HEADER;
