# Question system

## Overview

Study questions flow through a reusable **study engine** (`src/lib/questions/`) and a single UI surface **`StudySessionPlayer`**. Legacy paginated `ExamQuiz` pages are replaced by one-question-at-a-time sessions with shuffled order and answer choices.

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Types | `types.ts` | `StudyQuestion`, `StudySessionState`, modes |
| Stem | `stem.ts` | Strip robotic openers (`Case:`, long vignettes) |
| Prepare | `prepare.ts` | `examQuestionToStudy`, shuffle, correctness |
| Session | `session-engine.ts` | Create, record answers, advance, summarize |
| Adaptive | `adaptive.ts` | Weak-topic prioritization (scaffold) |
| Storage | `storage.ts` | `localStorage` resume |
| Analytics | `analytics-server.ts` | `QuestionAttempt` / overview queries |

## Question flow

1. Raw `ExamQuestion` or bank items enter `prepareQuestionsForSession`.
2. Stems normalized via `normalizeStem`; options shuffled per item.
3. Session order shuffled unless `shuffleOrder: false`.
4. User answers in `StudySessionPlayer` → attempts POST `/api/study/attempt`, state POST `/api/study/session`.

## Study modes

- **practice** — Check → explanation → confidence (1–5) → next
- **rapid** — Tap option → instant feedback → auto-advance
- **timed** — 45s per question, auto-submit on timeout

## Entry points

- **AI exams** — `/generate` → `ExamGenerator` → `ExamQuiz` → `StudySessionFromExam`
- **Bank review** — `/study/practice` → `StudyBankPractice` → `GET /api/questions`
- **Quilt quiz tiles** — `QuiltTileViewer` (aligned styling, stem normalization)

## Generation prompts

`UNIVERSAL_EXAM_SYSTEM` and subject prompts discourage repetitive clinical vignettes and favor direct, natural stems. Pipeline uses `toQuizletStyleQuestion` → `formatQuestionLabel` → `normalizeStem`.

## Database

- `QuestionAttempt` — per-answer telemetry (correct, confidence, duration, field, bank id)
- `StudySession` — persisted session JSON for resume

Run after schema changes:

```bash
npx prisma db push
```

## Internal analytics

Staff: **Internal → Questions** (`/internal/questions`), API `GET /api/internal/questions/analytics?days=30`.

Requires permission `analytics.view_education`.

## Extending question types

Add to `StudyQuestionType` and branch in `prepare.ts` + `StudySessionPlayer` renderers. Types planned in product spec (matching, drag-drop, image) can plug into the same session engine once represented in `StudyQuestion`.

## Keyboard & mobile

- Keys `1`–`4` select options; `Enter` submits
- Swipe left/right for next/previous when answer revealed
