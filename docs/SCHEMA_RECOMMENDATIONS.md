# Flexible schema recommendations (future)

Current storage remains compatible: `QuestionBankItem.fieldId` + `subjectId` strings, `Exam.content` JSON blob.

## Recommended additions (non-breaking)

```prisma
model AcademicField {
  id          String   @id
  label       String
  category    String
  boardExam   String?
  active      Boolean  @default(true)
  metadata    String?  // JSON: capabilities, oerDomains
  subjects    AcademicSubject[]
}

model AcademicSubject {
  id              String   @id
  fieldId         String
  label           String
  contentArea     String?
  difficultyLevel Int?
  prerequisites   String?  // JSON array of subject ids
  keywords        String?  // JSON array
  field           AcademicField @relation(fields: [fieldId], references: [id])
  bankItems       QuestionBankItem[]
}

model QuestionBankItem {
  // existing fields...
  subjectRefId String?
  subjectRef   AcademicSubject? @relation(fields: [subjectRefId], references: [id])
  schemaVersion Int @default(1)
  metadata      String?  // JSON: templateId, qualityScore, conceptTags
}
```

## JSON question schema (flexible)

```json
{
  "type": "multiple_choice",
  "templateId": "clinical_vignette",
  "stem": "...",
  "options": ["...", "...", "...", "..."],
  "correctAnswer": "...",
  "explanation": "...",
  "metadata": {
    "concepts": ["aki", "hyperkalemia"],
    "difficultyScore": 0.72,
    "highYield": true
  }
}
```

## Migration strategy

1. Seed `AcademicField` / `AcademicSubject` from registered modules (one-time script).
2. Dual-write `fieldId` + `subjectRefId` during transition.
3. Stop duplicating taxonomy in code once DB is source of truth; modules become importers/exporters.

No migration is required for the current refactor; this documents the path to unlimited subjects without rigid medical-only columns.
