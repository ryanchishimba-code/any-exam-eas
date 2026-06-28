# Performance guidelines — Any Exam Easy

Target: **sub-3s** first meaningful paint for exam selection and question-bank hubs on mobile and desktop, including large banks (AANP/FNP, NCLEX, NAPLEX).

## Database (Neon Postgres)

- **Never OFFSET wide rows** (`options`, `explanation`). Use id-only random start + contiguous id window via `sampleQuestionBankRows` in `src/lib/question-bank/random-sample.ts`.
- **Index serve paths**: `fieldId + active + qaPassed`, `fieldId + subjectId + active + qaPassed`, and partial index on serve-ready rows. See `prisma/migrations/20260623120000_question_bank_perf_indexes/`.
- **Cache counts** in-process (`fieldTotalCache`, `curatedTotalCache`) and via `cacheGetOrSet` (`CACHE_TTL.subjectCatalog`, 30m) for catalog metadata.
- **Prefer pre-composed full exams** (NCLEX/NAPLEX presets) over runtime sampling for timed simulators when possible.

## API

| Route | Purpose |
|-------|---------|
| `GET /api/exams` | Metadata only — no question bodies |
| `GET /api/exams/:slug` | Single exam + topic counts (cached) |
| `GET /api/exams/:slug/questions?page&limit` | Paginated slice; `includeExplanation=1` only when needed |

Rules:

- Return **lite fields** by default; lazy-load explanations and rationales.
- Set `Cache-Control` on public catalog routes; `private, no-store` on authenticated question payloads.
- gzip/brotli is enabled on Vercel — do not disable compression.
- Bound sample pulls (`QUESTION_BANK_SAMPLE_MAX_PULL = 500`, timed exam `maxRounds = 2`).

## Frontend

- **Exam selection**: static `EXAM_CATALOG` list + debounced client search — no full bank fetch.
- **Question bank hub**: SSR seed subject counts via `QuestionBankPracticeLoader`; skip duplicate client fetch when `initialSubjectCountsFieldId` matches.
- **Defer heavy SSR**: avoid `getStudentDashboardData` on question-bank page; load hub stats lazily if needed.
- **Session player**: `dynamic()` import for `StudySessionPlayer`; memoize heavy list components.
- **Timed exams**: `skipRuntimeGate` when items are pre-vetted in `gatherTimedExamBankItems`; cap FullExamSimulator retries at 2.

## Caching layers

1. In-process TTL maps (per server instance)
2. `cacheGetOrSet` (Upstash Redis when configured)
3. HTTP `s-maxage` + `stale-while-revalidate` on catalog APIs
4. Client `force-cache` for subject-count refetch only when SSR seed missing

For cross-instance hot paths (AANP/FNP counts), enable Upstash Redis via existing `src/lib/cache.ts`.

## Adding a new exam bank

1. Add curated where-clause + use `sampleCuratedFieldItems` / `sampleQuestionBankRows`.
2. Extend partial indexes if new filter columns are hot (e.g. `stepLevel`, `patientAgeGroup`).
3. Wire `/api/exams` metadata — never load all questions on hub mount.
4. Add serve-gate tests; run `npm run test -- random-sample`.

## Verification checklist

- [ ] Question bank hub TTFB < 2s for AANP/FNP (logged-in, premium)
- [ ] Subject counts appear without second network round-trip when SSR seeded
- [ ] Timed 150Q exam starts in < 5s (not ~60s)
- [ ] `npm run test` + `npm run build` pass
