# Any Exam Easy — UX Guidelines

Design and performance standards for a fast, calm, premium study experience (Apple / Stripe / Linear inspired).

## Principles

1. **Deference** — UI supports the question; it never competes with content.
2. **Clarity** — One primary action per screen; progressive disclosure for depth.
3. **Speed as a feature** — Perceived performance matters as much as raw load time.
4. **Mobile-first** — Touch targets ≥ 44px; thumb-friendly nav; no hover-only affordances.
5. **Accessibility** — WCAG 2.2 AA contrast, focus rings, ARIA on dynamic regions, keyboard parity.

## Design tokens

| Token | Location | Usage |
|-------|----------|--------|
| `--font-sans` | `globals.css` | System stack (SF Pro on Apple) |
| `--color-accent` | `globals.css` | Primary actions, progress |
| `--color-ink` / `--color-ink-muted` | `globals.css` | Body / secondary text |
| `--shadow-apple-*` | `globals.css` | Subtle elevation |
| `studyUi` | `src/lib/study/study-ui.ts` | Study surfaces, session viewer |
| `dbUi` | `src/lib/study/dashboard-ui.ts` | Dashboard / hub |

**Do:** generous whitespace (`max-w-3xl` for questions), soft borders, `rounded-2xl`, 13–14px secondary copy.

**Avoid:** heavy gradients, confetti on routine flows, dense chip rows without scroll affordance.

## Typography

- Headlines: `tracking-tight`, semibold, 22–26px on dashboard.
- Eyebrows: 10px uppercase, `tracking-[0.14em]`, muted.
- Questions: default body 15–16px, `leading-relaxed`.

## Motion

- Use `var(--ease-apple-smooth)` for enters (see `.aee-question-enter`).
- Respect `prefers-reduced-motion` — disable decorative motion (exam selection floats, confetti).
- Progress bars: 200ms width transition only.

## Study session (question viewer)

- **Layout:** `studyUi.sessionShell` + `sessionCard` — immersive, max-width 3xl.
- **Progress:** thin 1px track; no numeric clutter unless timed mode.
- **Rationale:** collapsed preview → “View full explanation” (progressive disclosure).
- **Keyboard:** `1–9` select, `Enter` submit, `J`/`K` (or arrows) navigate after reveal.
- **Loading:** `QuestionSessionSkeleton` — layout-accurate placeholder during code-split.

## Data & caching

- **React Query** (`AppQueryProvider`): subject counts, future list endpoints — 5m stale, 30m gc.
- **Server:** paginated `/api/exams`, id-window sampling — see `docs/performance.md`.
- **Dynamic import:** `StudySessionPlayer` — never block bank UI on session chunk.

## Empty & loading states

- Use `Skeleton` from `src/components/ui/skeleton.tsx` — match final layout dimensions.
- Empty states: dashed border, one sentence + single CTA (`studyUi.emptyState`).

## PWA

- `manifest.webmanifest` + `public/sw.js` — cache static assets, network-first for `/api/*`.
- Register via `PwaRegister` in root layout (production only).

## Core Web Vitals targets

| Metric | Target |
|--------|--------|
| LCP | < 2.0s on 4G |
| INP | < 200ms |
| CLS | < 0.1 |

**Checklist:** stream dashboard sections with Suspense, lazy-load heavy viewers, avoid layout shift in skeletons, compress images under `/public/icons`.

## Component map

| Screen | Primary components |
|--------|-------------------|
| Exam selection | `ExamSelectionScreen`, `ExamCard` |
| Dashboard | `DashboardPageContent`, `dbUi` |
| Question bank | `StudyBankPractice`, `useSubjectCounts` |
| Session | `StudySessionPlayer`, `QuestionRenderer`, `ExplanationPanel` |

## Adding new UI

1. Reuse tokens from `studyUi` / `dbUi` before inventing classes.
2. Add skeleton that mirrors the final layout.
3. Wire server data through React Query when client-refetched.
4. Test keyboard + VoiceOver on macOS/iOS before shipping.
