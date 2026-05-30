# Adaptive Learning Engine

Proprietary mastery-driven system that teaches **why**, not just right/wrong.

## Architecture

```
StudySessionPlayer → POST /api/study/attempt
                          ↓
                   processLearningAttempt (engine.ts)
                          ├─ mistake-analysis.ts   (cognitive category)
                          ├─ insights.ts           (explanation payload)
                          ├─ profile-service.ts    (Prisma: attempts + ConceptMastery)
                          └─ recommendations.ts    (remediation URLs)

GET /api/questions?mode=adaptive|weak
                          ↓
                   adaptQuestionOrder → prioritizeForReview (questions/adaptive.ts)
```

## Mastery scoring

Per concept key (`tag:*` or `subject:*`):

- **+8** correct, **−12** incorrect (config in `mastery.ts`)
- Extra penalty for high-confidence misses
- **Readiness** = weighted blend of accuracy, retention, confidence reliability, coverage
- **Retention decay** applied when building profile snapshots

## Remediation algorithm

After each attempt:

1. Classify mistake (`MistakeCategory`)
2. Update `ConceptMastery` rows for all tags on the question
3. Return ranked recommendations: foundational review → weak-area drill → adaptive retry → timed → mock

## Weak-area prioritization

`buildTopicWeakness` aggregates `QuestionAttempt.tagsJson` → `TopicWeakness[]`.

`prioritizeForReview` sorts bank questions: tags with `missRate ≥ 0.4` and `attempts ≥ 2` first.

## AI-ready extension points

| Hook | Location |
|------|----------|
| LLM explanations | Replace/enhance `buildLearningInsight` |
| Semantic concepts | `LearningProfile.metadataJson` |
| Predictive readiness | `computeReadinessScore` weights |
| Auto-label mistakes | `analyzeMistake` return + store |

## Database

- `LearningProfile` — readiness, streak
- `ConceptMastery` — per user/field/concept
- `QuestionAttempt` — `tagsJson`, `mistakeCategory`, `guessedCorrect`

## Phased roadmap

| Phase | Status |
|-------|--------|
| 1 Core engine + attempt API | Done |
| 2 Adaptive question ordering | Done |
| 3 Learner analytics UI | Done (`/study/analytics`) |
| 4 Admin mistake aggregates | Planned |
| 5 LLM insight enrichment | Planned |
| 6 Full question types (SATA, matching) | Planned |
