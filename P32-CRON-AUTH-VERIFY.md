# PR #32 cron auth verification

Checked 2026-09-23 04:12 UTC.

## Result

Production is **not** serving pull request #32. The success checks are not met.

| Check | Result |
| --- | --- |
| `www.anyexameasy.com` READY on `7e52895754dba955dda480ab535c388864613e62` or a later `main` that contains it | No |
| `POST /api/cron/revalidate-inventory` with only `x-vercel-cron: 1` returns 401 | Not sent |
| `POST /api/cron/revalidate-inventory` with no auth headers returns 401 | Not sent |
| Production env has `CRON_SECRET` configured | Yes (value not read) |

## Production

GitHub `main` is `7e52895754dba955dda480ab535c388864613e62` (merge of [#32](https://github.com/ryanchishimba-code/any-exam-eas/pull/32), 2026-09-23 04:02 UTC).

Vercel project `any-exam-eas` (`prj_SE0xEweZIfBMYoNyBx6T9EcMx1IP`), team `ryanchishimba-codes-projects`.

| Deployment | State | Commit | Role |
| --- | --- | --- | --- |
| `dpl_2tY2CyS2436G4vmF9iBmmx58jCey` | ERROR at 2026-09-23 04:04:58 UTC | `7e52895754dba955dda480ab535c388864613e62` | Production build for #32 |
| `dpl_zxWGALsrtFNnMXcfKvXnHfmkmwxH` | READY at 2026-09-23 04:01:51 UTC | `085539978fd667a4ae7e34f03f55a1cb04f5ed16` | Aliased to `www.anyexameasy.com` and `anyexameasy.com` |

`https://www.anyexameasy.com/` returned HTTP 200 (`x-vercel-cache: HIT`). The hostname alias has not moved since 2026-09-23 04:01:51 UTC, before the #32 build finished. That READY deployment is merge #30, which does not contain #32.

The #32 build failed in `npm run vercel-build` with `module_compilation_error`: webpack cannot read `node:crypto` from the client graph.

```
./src/components/marketing/UsmleStepShowcase.tsx
./src/lib/exam-prep/usmle/exam-options.ts
./src/lib/marketing/question-bank-counts.ts
./src/lib/inventory/active-inventory-cache.ts
./src/lib/cron-auth.ts
node:crypto
```

`active-inventory-cache.ts` imported `isCronAuthorized` from `cron-auth.ts`. Marketing pages import the cache constants, so `node:crypto` was compiled for the browser.

## Auth probes

The two production POSTs were not sent.

The aliased deployment still authorizes `x-vercel-cron: 1` when `VERCEL` is set (`isCronSecretAuthorized` on `08553997`). A spoofed cron header on that release would run inventory revalidation. Those requests wait until a READY production deployment includes #32.

## `CRON_SECRET`

Read with decrypt disabled. No secret value is recorded here.

| Target | Env id | Type | Value returned |
| --- | --- | --- | --- |
| production | `10FCOdWIu3cf1KOx` | sensitive | no |
| preview | `CLWZx024ltoBGW8h` | encrypted | ciphertext only; not decrypted |
| development | `QPXr7GDzyYkSFSfp` | encrypted | ciphertext only; not decrypted |

Production `CRON_SECRET` exists and is scoped to production only.

Preview is a separate env record (different id, encrypted, preview target only). It is not the production variable. That split is expected. Plaintext values were not compared.
