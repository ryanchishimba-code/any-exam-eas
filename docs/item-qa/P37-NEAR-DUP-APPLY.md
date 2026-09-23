# P37 nursing near-duplicate apply

Production soft-retire on 2026-09-23 after merge commit `8f43367c` (PR #37, walk past inactive near-duplicate keepers). Nursing field only. Ryan authorized apply of all 250 eligible rows.

Checkout used for the planner: `main` at `8f43367c`. Production deploy of that commit (`dpl_3KX87NnTHJojHyjtFHPDDs4YHJFP`) was READY before verification. The retire itself is a CLI against the database.

Writes were `active=false` plus `curationMeta.itemQa.retiredReason = near_duplicate`. No rows were deleted. `qaPassed` was not rewritten.

## Dry-run

`npm run db:retire-near-duplicates -- --field nursing --dry-run`

| Check | Result |
| --- | --- |
| Flagged active rows | 250 |
| Eligible | 250 |
| Skipped | 0 (`keeper_inactive` 0) |
| Distinct active keepers | 28, all `fieldId=nursing`, all `active`, all `qaPassed` |
| Retire ids that are also keepers | 0 |
| Not `qaPassed` among eligible | 36 |
| Published drop | 214 |
| Published before → expected after | 6,457 → 6,243 |
| Full-exam links on eligible rows | 86 (left in place) |

The pre-apply estimate was ~6,456 → ~6,242. Live published inventory was 6,457, one higher than that estimate. The drop is still 214 (250 eligible, 36 not `qaPassed`). Safety gates matched, so apply proceeded.

## Apply

`npm run db:retire-near-duplicates -- --field nursing --apply`

- Rows updated: **250** / 250
- Active nursing: 7,196 → 6,946
- Published nursing (`active` + `qaPassed`): 6,457 → **6,243**
- Script exit code 1 after the writes, only because inventory revalidation had no `CRON_SECRET`

## After (SQL / Prisma)

| Check | Result |
| --- | --- |
| Published nursing (`active` + `qaPassed`) | 6,243 |
| Active nursing | 6,946 |
| Nursing rows still present (no hard delete of the bank) | 10,828 |
| Planned retire ids still in the table | 250 / 250 |
| Those rows still `active` | 0 |
| Those rows with `retiredReason` other than `near_duplicate` | 0 |
| Those rows whose `qaPassed` changed | 0 |
| Those rows that still carry code `near_duplicate` | 0 |
| Active nursing rows whose `curation_meta.itemQa.codes` contains `near_duplicate` | **0** |
| Keepers inactive or in another field | 0 / 28 |

## Sample keeper chain

Largest cluster: 21 queued copies kept `cmr0t29b100481yfnwg2nnl81`.

One queued row, `cmr7cs6tr000d1yvxf5u57pm4` (`management-of-care`, `qaPassed` true), stored partner `cmr7aw3nn00cp1ybb54t0re3w`. That partner was already inactive with `retiredReason: near_duplicate` and pointed at the active keeper. The planner walked past it. All 250 eligible rows had an immediate partner that was not the root keeper.

After apply:

| Id | Role | active | qaPassed | retiredReason |
| --- | --- | --- | --- | --- |
| `cmr7cs6tr000d1yvxf5u57pm4` | retired this run | false | true | `near_duplicate` |
| `cmr7aw3nn00cp1ybb54t0re3w` | already inactive hop | false | true | `near_duplicate` |
| `cmr0t29b100481yfnwg2nnl81` | keeper | true | true | none |

The keeper is still active. The retire write stores the root keeper id as `partnerId` on the newly retired row.

## Revalidate

Did not succeed. Production `CRON_SECRET` is a sensitive Vercel env var and the API does not return its value, so this run did not send `Authorization: Bearer`. `x-vercel-cron` was not used.

Coordinator retry:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://www.anyexameasy.com/api/cron/revalidate-inventory
```

Tool report (gitignored): `artifacts/retire-near-duplicates-nursing.md` and `.json`.
