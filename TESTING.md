# Testing Guide — AnyExamEasy.com

This is the single source of truth for how we test AnyExamEasy. It covers the
**automated test suites**, a **prioritized manual QA checklist**, and **CI**.

The north star: protect the journeys that make money and keep students learning —
**subscribe → study → track progress** — plus the admin tooling that feeds them.

---

## 1. Test stack at a glance

| Layer | Tool | Where tests live | Environment |
|-------|------|------------------|-------------|
| Unit (pure logic) | **Vitest** (`unit` project) | `src/**/*.test.ts` (co-located) | `node` |
| Component / integration | **Vitest + React Testing Library** (`component` project) | `tests/unit/**/*.test.tsx` | `jsdom` |
| Accessibility (component) | `vitest-axe` | `tests/unit/a11y/**` | `jsdom` |
| End-to-end | **Playwright** (`@playwright/test`) | `tests/e2e/**/*.spec.ts` | real Chromium / Pixel 7 |
| E2E accessibility | `@axe-core/playwright` | via `tests/e2e/helpers/axe.ts` | real browser |
| Smoke / flows / payments | Node scripts | `scripts/*.mjs` | hits a running server |
| Load | k6 + Node | `loadtests/`, `scripts/*.mjs` | staging/prod |

> **Note on Jest:** the original request mentioned Jest. This repo standardized on
> **Vitest**, which uses a Jest-compatible API (`describe/it/expect`, `vi` instead of
> `jest`). All examples below are real, runnable Vitest tests. Globals are **off**
> (`globals: false`), so always import from `vitest`:
> `import { describe, it, expect, vi } from "vitest";`

Config: [`vitest.config.ts`](./vitest.config.ts), [`playwright.config.ts`](./playwright.config.ts).
Shared setup: [`tests/setup/`](./tests/setup) (mocks `next/link`, `next/dynamic`, `next-auth/react`).

---

## 2. Running tests locally

### Prerequisites

```bash
npm ci
npx prisma generate
# E2E only: install the browser once
npm run test:e2e:install
```

E2E needs a Postgres `DATABASE_URL` (for auth seeding) and an auth secret. The
simplest local setup uses your `.env.local`. The Playwright config auto-loads it.

### Everyday commands

```bash
# Fast feedback (logic + components + smoke) — what most PRs run
npm test

# Just the Vitest projects
npm run test:unit          # node-env logic tests        (src/**/*.test.ts)
npm run test:component      # jsdom React component tests  (tests/unit/**/*.test.tsx)
npm run test:unit:watch     # watch mode
npm run test:component:watch
npm run test:a11y           # component-level axe checks

# Target a single file
npx vitest run --project unit src/lib/admin/testimonials-validators.test.ts
npx vitest run --project component tests/unit/components/TestimonialsManager.test.tsx

# Filter by test name
npx vitest run --project component tests/unit/components/TestimonialsManager.test.tsx -t "creates a testimonial"

# Coverage (text + html report)
npx vitest run --coverage
```

### End-to-end (Playwright)

```bash
# Seed the dev user so authenticated specs run (needs DATABASE_URL)
npm run db:seed-user

# Headless Chromium (recommended locally)
npm run test:e2e:chromium

# All projects (chromium + mobile-chrome)
npm run test:e2e

# Interactive UI runner / headed / debugging
npm run test:e2e:ui
npm run test:e2e:headed

# Reuse a dev server you already have running on :3100
PLAYWRIGHT_REUSE_SERVER=1 npm run test:e2e:chromium

# Run one spec
npm run test:e2e:chromium -- about
npm run test:e2e:chromium -- admin-access
```

**Admin CRUD e2e (optional).** The admin testimonial create/approve/delete flow is
gated behind admin credentials so it auto-skips when absent. To run it:

```bash
npm run db:seed-admin   # upgrades the dev user to super_admin
E2E_ADMIN_EMAIL=dev@anyexameasy.test \
E2E_ADMIN_PASSWORD=DevPassword1! \
npm run test:e2e:chromium -- admin-access
```

### Smoke / flow / load (against a running server)

```bash
npm run test:smoke            # critical pages return 200
npm run test:flows            # feature flows (dev server)
npm run test:payments         # Stripe checkout wiring
npm run test:smoke:prod       # smoke against production
npm run test:load             # 20 concurrent users, local
```

---

## 3. Automated coverage map

What each suite protects today (✅ = added/maintained as part of the recent rollout):

| Area | Suite | File |
|------|-------|------|
| Conversion tracking (GA4 + internal DB) ✅ | component | `tests/unit/analytics/track-conversion.test.tsx` |
| Admin nav visibility by role | component | `tests/unit/components/AdminNavLink.test.tsx` |
| Testimonials admin form (CRUD, preview, moderation) ✅ | component | `tests/unit/components/TestimonialsManager.test.tsx` |
| Testimonial validators (input rules) ✅ | unit | `src/lib/admin/testimonials-validators.test.ts` |
| Question bank seed quality | unit | `src/lib/exam-prep/*.test.ts` (`npm run test:qa:questions`) |
| Landing hero + CTAs + a11y | e2e | `tests/e2e/landing.spec.ts` |
| About page content + charts + a11y ✅ | e2e | `tests/e2e/about.spec.ts` |
| Admin access control (+ gated CRUD) ✅ | e2e | `tests/e2e/admin-access.spec.ts` |
| Signup → trial → dashboard | e2e | `tests/e2e/signup-trial-dashboard.spec.ts` |
| Question bank access | e2e | `tests/e2e/question-bank.spec.ts` |
| Auth (login/logout/guards) | e2e | `tests/e2e/auth.spec.ts` |
| Reference hub / anatomy / dashboard | e2e | `tests/e2e/{reference,anatomy,dashboard}.spec.ts` |
| Sitewide accessibility | e2e | `tests/e2e/accessibility.spec.ts` |

**Where to add new tests** (auto-discovered by the config globs):
- Pure logic / data mapping → `src/<area>/<thing>.test.ts`
- React component behavior → `tests/unit/<area>/<Component>.test.tsx`
- A user journey across pages → `tests/e2e/<journey>.spec.ts`

---

## 4. Manual QA checklist (prioritized by user journey)

Run top-to-bottom before any production release. **P0 blocks release.** Test on
desktop Chrome + mobile (real device or DevTools device toolbar).

### P0 — Revenue path: Subscribe → Study → Track

- [ ] **Pricing clarity** — `/pricing` loads; the trial/price callout is prominent
      and consistent with the homepage and exam pages.
- [ ] **Start trial CTA** — Homepage + About + exam pages "Start free trial" links
      all go to `/signup?plan=trial&interval=yearly`.
- [ ] **Signup** — Create account succeeds; validation errors show for bad email /
      weak password / mismatched fields; no double-submit.
- [ ] **Checkout** — Pricing → Stripe Checkout opens with the right plan/interval;
      cancel returns cleanly; success lands the user in onboarding/dashboard.
- [ ] **Trial state** — A trialing user can reach the dashboard and study material.
- [ ] **Study — Question Bank** — `/study` (or exam picker) lists the 6 exams;
      selecting one loads questions; answering reveals rationale; navigation between
      questions works; sequencing isn't visibly clustered (NAPLEX especially).
- [ ] **Strong features reachable** — Roadmaps, Deep Dives, Reference Hub, and the
      Top 503 Drugs surface load and link correctly.
- [ ] **Track progress — Analytics** — Student analytics/progress reflects answered
      questions and accuracy.

### P0 — Auth & access

- [ ] Login with valid creds → dashboard.
- [ ] Login with wrong password → inline error, no crash, no infinite spinner.
- [ ] **Password reset** — request email arrives; reset link sets a new password;
      old password no longer works; new password logs in.
- [ ] Logout clears the session; protected routes redirect to login.
- [ ] Free/expired users are correctly gated from premium study material.

### P1 — Public pages & content

- [ ] **Homepage** — hero, value prop (6 exams / one subscription), social proof,
      pricing/trial callout, footer links.
- [ ] **About Us** (`/about`) — hero, mission, cost + feature comparison charts
      render, "obvious clear winner" verdict, clinician trust points, final CTA.
- [ ] **Testimonials** — render on the landing page; approved DB testimonials appear,
      otherwise curated defaults show (no empty state in public view).
- [ ] **Pricing**, **Resources/Blog**, **Videos** — load, links work, no 404s.
- [ ] **SEO** — each page has a sensible `<title>` and meta description.

### P1 — Admin dashboard

- [ ] **Access control** — non-admin / logged-out users are redirected away from
      `/admin`, `/admin/testimonials`, `/admin/questions`.
- [ ] **Testimonials** — add (with photo upload), edit, approve/reject, feature
      toggle, soft-delete + **Undo**; live preview matches the public card; success
      messages appear; only **approved** items go public.
- [ ] **Questions** — filter by exam/category, search, paginate, add/edit (stem,
      options, correct answer, rationale, tags, difficulty), preview; bulk actions.
- [ ] **Analytics overview** — internal conversion table/charts load; GA4 summary
      surfaces; key metrics (trials, signups, CTA clicks) are visible.

### P1 — Analytics & tracking

- [ ] **GA4** — with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set, open GA4 **DebugView** and
      confirm `page_view`, `cta_clicked`, `pricing_viewed`, `plan_selected`,
      `trial_started`, `signup_completed` fire with expected params.
- [ ] **Internal DB** — after triggering events, `Admin → Traffic & analytics →
      Conversions` shows rows (or `SELECT * FROM "ConversionEvent" ORDER BY "createdAt" DESC`).
- [ ] CTA clicks log to **both** GA4 and the DB; server-logged events aren't
      double-counted (the `persist: false` path).

### P2 — Edge cases, performance, a11y

- [ ] **Mobile** — nav (hamburger), exam scroll-picker, forms, and CTAs work on
      narrow viewports; no horizontal scroll; tap targets adequate.
- [ ] **Loading states** — spinners/skeletons for slow fetches; no layout shift flash
      of the admin nav link before auth resolves.
- [ ] **Error handling** — failed network requests show a recoverable message, not a
      blank screen; form validation is clear and specific.
- [ ] **Accessibility** — keyboard-only navigation reaches all CTAs; visible focus;
      images have alt text; headings are ordered; color contrast is acceptable.
- [ ] **Empty/large data** — admin lists with 0 and with many items behave (search,
      pagination, undo).

---

## 5. Test patterns & conventions

### Component test (Vitest + RTL, jsdom)

Lives in `tests/unit/**/*.test.tsx`. Globals are off — import from `vitest`. The
shared setup already mocks `next/link`, `next/dynamic`, and `next-auth/react`.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("does the thing on click", async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });
});
```

For components that call the API, stub `fetch` with `vi.stubGlobal("fetch", ...)`
and route by URL + method — see `tests/unit/components/TestimonialsManager.test.tsx`.

### Unit test (Vitest, node)

Co-located as `src/**/*.test.ts`. Great for validators, mappers, sequencing logic —
deterministic, no DOM. See `src/lib/admin/testimonials-validators.test.ts`.

### E2E test (Playwright)

Lives in `tests/e2e/**/*.spec.ts`. Reuse helpers:
- `tests/e2e/fixtures/auth.ts` → `authenticatedPage` fixture + `loginWithCredentials`.
- `tests/e2e/helpers/axe.ts` → `expectNoA11yViolations(page, { seriousOnly: true })`.
- Gate flows that need special accounts with `test.skip(!hasCreds, "reason")`.

Prefer role/text queries and assert on `href` for client-side links (dev-mode
navigations can be flaky). See `tests/e2e/about.spec.ts`.

---

## 6. CI integration (GitHub Actions)

Two workflows already gate `main`/`master` and every PR — new tests are picked up
automatically by the config globs, so **no workflow changes are needed to add tests**.

- **`.github/workflows/ci.yml`** — `npm ci` → `prisma generate` → lint →
  `test:qa:questions` → `test:unit` → `test:component` → `build`.
- **`.github/workflows/e2e.yml`** — spins up a Postgres service, `prisma db push`,
  seeds the dev user, installs Chromium, runs `test:e2e:chromium`, and uploads the
  Playwright HTML report on failure.

### Suggested enhancements

1. **A11y gate in CI** — add `npm run test:a11y` to `ci.yml` after component tests.
2. **Mobile e2e** — add a matrix entry running `--project=mobile-chrome` for the P0
   revenue specs (signup-trial, question-bank).
3. **Admin CRUD e2e in CI** — set `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` secrets and
   run `db:seed-admin` so the gated admin spec executes instead of skipping.
4. **Coverage trend** — `npx vitest run --coverage` and upload `coverage/` (or post a
   PR comment) to watch regressions in `src/lib` and `src/components`.
5. **Required checks** — mark CI + E2E as required status checks on the default branch.

Minimal snippet to add the a11y step to `ci.yml`:

```yaml
      - name: Accessibility (component)
        run: npm run test:a11y
```

---

## 7. Troubleshooting

- **`vi is not defined` / `describe is not defined`** — globals are off; import them
  from `vitest`.
- **Component test can't find an element** — many strings (e.g. "approved") appear in
  both helper copy and a textarea value; scope with `within(...)` or match a unique
  variant (the public preview wraps quotes in `“…”`).
- **E2E auth specs skipped** — auth storage is missing; run `npm run db:seed-user`
  with a valid `DATABASE_URL`, then re-run.
- **Playwright can't start the server** — another process holds `:3100`; set
  `PLAYWRIGHT_REUSE_SERVER=1` or change `PLAYWRIGHT_PORT`.
- **GA4 events not in DebugView** — confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and
  you're using the GA Debugger extension / `?debug_mode=1`.
```
