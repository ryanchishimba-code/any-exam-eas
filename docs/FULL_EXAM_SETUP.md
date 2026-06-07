# Full Simulated Exam — Setup & Integration

Premium board exam simulator at `/full-exam/[examSlug]`.

## User flow

1. **Study Hub** → "Full Simulated Exam" card → `/full-exam/nclex` (or usmle, naplex, mpje)
2. Choose **50 / 100 / Full-length adaptive** and **Timed vs Untimed**
3. **Start exam** → creates `exam_sessions` row → `/full-exam/[slug]/[sessionId]`
4. Complete → `/full-exam/[slug]/[sessionId]/results` with score, topic breakdown, rationales

## Key files

| Piece | Path |
|-------|------|
| Launcher UI | `src/components/exam/FullExamLauncher.tsx` |
| Exam interface | `src/components/exam/FullExamSimulator.tsx` |
| Timer (reusable) | `src/components/exam/Timer.tsx` |
| Results | `src/components/exam/FullExamResults.tsx` |
| Start API | `src/app/api/full-exam/start/route.ts` |
| Config / time math | `src/lib/full-exam/config.ts` |
| Types | `src/types/full-exam.ts` |

## Database

Uses existing **`exam_sessions`** table (Drizzle + Prisma):

- `questionCount`, `timeLimitSec`, `answers` (JSON array, auto-saved per question)
- `analysis.sessionConfig` — length, timed mode, adaptive flag
- `analysis.questionSnapshots` — stems + rationales for post-exam review
- `analysis.topicBreakdown` — per-topic score on completion

No new migration required.

## Questions

Questions load from `/api/questions?field=…&mode=timed&scope=field&limit=N`.

Ensure the bank is populated:

```bash
npm run db:seed-edtech
npm run db:sync-questions
```

## Timer behavior

- **Desktop**: fixed left sidebar with countdown ring (green → amber → red in final 10 min)
- **Mobile (<768px)**: collapsed by default; tap to expand/collapse
- **Pause**: confirmation modal; timer stops (practice mode only)
- **Time up**: warning modal; submit after current question or immediately

## Keyboard shortcuts (during exam)

| Key | Action |
|-----|--------|
| `1`–`4` | Select answer choice |
| `F` | Toggle flag |
| `←` / `→` | Previous / next question |
| `Space` / `Enter` | Next question |

## Study Hub integration

`StudyHubDashboard` links the Full Simulated Exam card to `simulatedExamHref(examSlug)` → `/full-exam/[slug]`.

## Premium gating

`/full-exam` is listed in `src/lib/premium-routes.ts` and requires an active subscription via `requirePremiumPage`.
