# Platform redesign — premium exam preparation

## Current architecture (baseline)

| Layer | Location | Role |
|-------|----------|------|
| Subject plugins | `src/lib/subjects/{field}/` | Discipline intelligence: areas, prompts, validation |
| Registry | `src/lib/subjects/registry.ts` | Resolves `fieldId` → `SubjectModule` |
| UI fields | `src/lib/fields.ts` | Derived from registry (not hardcoded list) |
| Catalog | `src/lib/subjects/catalog.ts` | Marketing + landing metadata per field |
| Question engine | `src/lib/questions/*` | Session state, grading, adaptive ordering |
| Study UI | `src/components/study/StudySessionPlayer.tsx` | Single-question player |
| Bank / AI | `question-bank-db.ts`, `api/exams/generate` | Static + generated items |
| Analytics | `QuestionAttempt`, `/progress`, `/internal/*` | Learner + staff |

### UX weaknesses addressed

1. Landing showed 3 health pills only — no subject discovery.
2. Navigation led with “Flashcards” — misaligned with exam-first product.
3. No dentistry, math, biology, chemistry modules.
4. Question types were MCQ-only in practice; modes limited to practice/rapid/timed.
5. Adaptive logic existed (`adaptive.ts`) but was not exposed as user-facing modes.
6. Learner analytics were thin vs internal dashboards.

---

## Target architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Landing / Dashboard / Study hub (exam-first CTAs)          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Subject catalog (display) ←→ Subject registry (plugins)        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Exam modes (timed, tutor, adaptive, mock, weak-area, …)      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Question engine: prepare → session-engine → attempt API      │
│  Types: MCQ, SATA, matching, ordered, fill, calc, image, …    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Adaptive layer: weakness tags, difficulty, confidence        │
│  Remediation sessions + recommendations                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Postgres: QuestionBankItem, StudySession, QuestionAttempt    │
└─────────────────────────────────────────────────────────────┘
```

---

## Adaptive testing logic

1. **Attempt ingestion** — Each answer writes `QuestionAttempt` with `tags`, `correct`, `durationMs`, `confidence`.
2. **Weakness model** — `prioritizeForReview()` ranks items where tag `missRate ≥ 0.4` and `attempts ≥ 2`.
3. **Difficulty loop** — `adjustDifficulty()` steps easy ↔ medium ↔ hard when rolling accuracy crosses 85% / 45%.
4. **Mode mapping**
   - *Adaptive exam* — weak tags first, then unseen, difficulty adjusted every N questions.
   - *Weak-area mode* — only items matching weak tags.
   - *Rapid review* — short session, no timer, high shuffle.
   - *Timed / mock* — fixed clock, no feedback until end (tutor mode = immediate explanations).
5. **Recommendations** — Dashboard surfaces fields with lowest accuracy and suggests `/generate?field=&subject=&mode=adaptive`.

---

## Subject scalability strategy

- **Do not** hardcode subject lists in UI components — use `getSubjectCatalog()`, `STUDY_FIELDS`, `getSubjectsForFieldId()`.
- **Add a discipline:** create `src/lib/subjects/{id}/` via `createSubjectModule()`, register in `registry.ts`, add catalog entry in `catalog.ts` (optional display overrides).
- **Subject areas** live in `{field}/subjects.ts` — DB stores `fieldId` + `subjectId` strings only.
- **Prompts / validation** stay inside the module; core pipeline stays field-agnostic.

---

## Phased roadmap

| Phase | Scope | Status |
|-------|--------|--------|
| **1** | Catalog + 7 fields, landing redesign, exam-first nav, exam modes types, `/api/catalog/subjects` | In progress |
| **2** | Extended question types in player (SATA, matching, ordered, fill, calc), explanation panels | Planned |
| **3** | Exam mode hub (`/study/exams`), timed/mock/tutor/adaptive UX, keyboard shortcuts, mark-for-review | Planned |
| **4** | Learner analytics dashboard (readiness, heatmap, weak areas) | Planned |
| **5** | Admin bulk upload, missed-question analytics, remediation builder | Planned |
| **6** | LaTeX (math), image interpretation, offline recovery | Planned |

---

## Question design rules (generation)

Enforced in `src/lib/engine/prompts/base.ts` and per-module prompts:

- Ban repetitive openers (“A patient presents…”, “Case:”, “Scenario:”).
- Mix direct recall, application, and analysis stems.
- Vary length and cognitive level within a block.
- SATA / calculation / diagram types use template-specific prompt fragments.

See `docs/QUESTION_SYSTEM.md` for engine details.
