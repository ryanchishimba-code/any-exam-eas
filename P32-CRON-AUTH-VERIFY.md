# PR #32 cron auth verification

Checked 2026-09-23 04:18 UTC.

## Result

Production is live with pull request #32. A spoofed cron header alone returns 401. Production `CRON_SECRET` is configured.

| Check | Result |
| --- | --- |
| `www.anyexameasy.com` READY on `7e52895754dba955dda480ab535c388864613e62` or a later `main` that contains it | Yes. Serving `8ea5c0db1f7e0bca777052df8ac93b946eb52380`, which contains #32 |
| `POST /api/cron/revalidate-inventory` with only `x-vercel-cron: 1` | **401** `{"error":"Unauthorized"}` |
| `POST /api/cron/revalidate-inventory` with no auth headers | **401** `{"error":"Unauthorized"}` |
| Production env has `CRON_SECRET` configured | Yes (value not read) |

## Production

Vercel project `any-exam-eas` (`prj_SE0xEweZIfBMYoNyBx6T9EcMx1IP`), team `ryanchishimba-codes-projects`.

| Deployment | State | Commit | Role |
| --- | --- | --- | --- |
| `dpl_CC5ZgvR29tL9NXSx1HzYNRcBtUgf` | READY 2026-09-23 04:18:01 UTC | `8ea5c0db1f7e0bca777052df8ac93b946eb52380` | Aliased to `www.anyexameasy.com` and `anyexameasy.com` |
| `dpl_2tY2CyS2436G4vmF9iBmmx58jCey` | ERROR 2026-09-23 04:04:58 UTC | `7e52895754dba955dda480ab535c388864613e62` | First production build of #32. Webpack failed because `active-inventory-cache.ts` imported `node:crypto` through `cron-auth.ts` |
| `dpl_zxWGALsrtFNnMXcfKvXnHfmkmwxH` | READY 2026-09-23 04:01:51 UTC | `085539978fd667a4ae7e34f03f55a1cb04f5ed16` | Previous live release (pull request #30). Superseded |

`8ea5c0db` is the merge of [#34](https://github.com/ryanchishimba-code/any-exam-eas/pull/34) and is a descendant of [#32](https://github.com/ryanchishimba-code/any-exam-eas/pull/32) (`7e528957`). #34 keeps cron authorization in `src/lib/cron-auth.ts` and stops the inventory cache module from importing it, so the client bundle no longer compiles `node:crypto`.

The hostname alias list on the READY deployment includes `www.anyexameasy.com`. `aliasError` is null.

## Auth probes

Both requests were `POST https://www.anyexameasy.com/api/cron/revalidate-inventory`. No `Authorization` header was sent. No secret was used.

| Request | Status | Body |
| --- | --- | --- |
| Header `x-vercel-cron: 1` only | 401 | `{"error":"Unauthorized"}` |
| No auth headers | 401 | `{"error":"Unauthorized"}` |

`x-matched-path` was `/api/cron/revalidate-inventory` on both. Neither response revalidated the inventory cache.

The earlier live release (`08553997`) still treated `x-vercel-cron: 1` as authorization, so those probes were held until this READY deployment was aliased.

## `CRON_SECRET`

Read with decrypt disabled. No secret value is recorded here.

| Target | Env id | Type | Value returned |
| --- | --- | --- | --- |
| production | `10FCOdWIu3cf1KOx` | sensitive | no |
| preview | `CLWZx024ltoBGW8h` | encrypted | ciphertext only; not decrypted |
| development | `QPXr7GDzyYkSFSfp` | encrypted | ciphertext only; not decrypted |

Production `CRON_SECRET` exists and is scoped to production only.

Preview is a separate env record (different id, encrypted, preview target only). It is not the production variable. That split is expected. Plaintext values were not compared.
