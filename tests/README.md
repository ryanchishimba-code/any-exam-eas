# AnyExamEasy Test Suite

Vitest powers unit and component tests (Jest-compatible API). Playwright covers end-to-end flows. `@axe-core/playwright` and `vitest-axe` run accessibility checks.

## Folder structure

```
tests/
├── README.md                 # This guide
├── setup/
│   ├── vitest.setup.ts       # jest-dom + vitest-axe matchers (all Vitest projects)
│   └── vitest.component.setup.tsx  # Next.js / next-auth mocks for RTL
├── fixtures/
│   ├── questions.ts          # StudyQuestion samples
│   ├── memory-cards.ts       # MemoryCard samples
│   └── anatomy.ts            # AnatomyStructure samples
├── unit/
│   ├── components/           # RTL component tests (*.test.tsx)
│   └── a11y/                 # vitest-axe component scans
└── e2e/
    ├── fixtures/auth.ts      # Login helpers + authenticatedPage fixture
    ├── helpers/axe.ts        # Playwright axe wrapper
    ├── landing.spec.ts
    ├── auth.spec.ts
    ├── signup-trial-dashboard.spec.ts
    ├── anatomy.spec.ts
    ├── question-bank.spec.ts
    ├── reference.spec.ts
    └── accessibility.spec.ts

src/**/*.test.ts              # Existing lib/unit tests (Vitest node environment)
playwright.config.ts          # Playwright projects + webServer
vitest.config.ts              # Vitest projects: unit (node) + component (jsdom)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run test:unit` | Lib / domain tests (`src/**/*.test.ts`) |
| `npm run test:component` | RTL component + a11y unit tests |
| `npm run test:a11y` | Component axe scans only |
| `npm run test:e2e` | Full Playwright suite |
| `npm run test:e2e:chromium` | Desktop Chrome only (CI default) |
| `npm run test:e2e:install` | Install Playwright browsers |
| `npm run test:all` | Unit + component + E2E (chromium) |

## Local E2E prerequisites

1. `.env` / `.env.local` with a valid `DATABASE_URL` (Playwright loads these automatically)
2. Dev user seeded: `npm run db:seed-user` (also runs in `global-setup` when `DATABASE_URL` is set)
3. Playwright browsers: `npm run test:e2e:install`
4. Optional Stripe E2E: set `STRIPE_SECRET_KEY` and publishable key

Authenticated specs skip automatically when the auth backend is misconfigured.

Environment overrides:

- `PLAYWRIGHT_BASE_URL` — target deployment (default `http://127.0.0.1:3100`)
- `PLAYWRIGHT_PORT` — dev server port when Playwright starts Next.js (default `3100`)
- `PLAYWRIGHT_SKIP_WEBSERVER=1` — reuse an already-running dev server
- `PLAYWRIGHT_BROWSERS_PATH=0` — set automatically in npm scripts (installs browsers under `node_modules`)
- `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` — login credentials

## Adding tests

- **Component**: place `*.test.tsx` under `tests/unit/`; mock Next.js modules via `tests/setup/vitest.component.setup.tsx` or per-file `vi.mock`.
- **Lib**: keep `*.test.ts` next to source under `src/` (node environment).
- **E2E**: one critical user journey per `*.spec.ts`; prefer role/label selectors; use `fixtures/auth.ts` for logged-in flows.
