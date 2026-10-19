# PR #30 nursing near-duplicate dry-run

Production on https://www.anyexameasy.com is READY on deployment `dpl_zxWGALsrtFNnMXcfKvXnHfmkmwxH` (ready 2026-09-23T04:01:51Z). That deployment is aliased to `www.anyexameasy.com` and `anyexameasy.com` and serves main `085539978fd667a4ae7e34f03f55a1cb04f5ed16` (merge of PR #30).

Command (no `--apply`):

```
npm run db:retire-near-duplicates -- --field nursing
```

Mode: dry-run. Rows updated: 0. A recount after the run matched the before counts.

## Totals

| | |
|---|---|
| Flagged active rows scanned | 281 |
| Eligible to retire | **0** |
| Left in the Item QA queue (not near-duplicates) | 31 |
| Skipped near-duplicates | 250 |
| `chain_too_long` | **0** |
| `keeper_inactive` | 250 |
| Other skip reasons | none |
| Full-exam links on eligible rows | 0 |
| Expected published inventory drop | 0 |

## Inventory (unchanged)

| | Before | After |
|---|---|---|
| Nursing active | 7194 | 7194 |
| Nursing published (active + qaPassed) | **6456** | **6456** |
| Nursing active Item QA flags | 281 | 281 |

## Item QA flags still on active nursing rows

| Code | Count |
|---|---|
| `near_duplicate` | 250 |
| `truncated_option` | 28 |
| `empty_stem` | 3 |

The 250 `near_duplicate` rows are the skips. The other 31 flags are the queue left behind (`truncated_option` 28, `empty_stem` 3).

## Keepers vs retires

The planner selected no retire rows, so it recorded no keeper/retire pairs.

Every skipped chain walks queued near-duplicates (longest queued tail: 17 hops; largest cluster: 21 queued ids) and stops on a row that is already inactive with `retiredReason = near_duplicate`. That inactive row is the end the planner treats as the keeper. Those retired rows point one hop further at an active published nursing item, which this dry-run did not use.

| Queued id (not retired) | Inactive end (skip `keeper_inactive`) | Active partner on that inactive row |
|---|---|---|
| `cmrogakt8002u1ymrvrxf2umg` (21 queued in cluster) | `cmr7aw3nn00cp1ybb54t0re3w` | `cmr0t29b100481yfnwg2nnl81` |
| `cmqwqy6xx000h1ys1tq1n112f` (17 queued) | `cmqwm39t600031yqmxfwpw66j` | `cmqwhvhjb00081y5x4powrpoj` |
| `cmrochr7g002d1ybkxw6rodky` (17 queued) | `cmr7aw3ur00cr1ybbuh987fuv` | `cmqwjge8i00091yfpu15o5y9a` |
| `cmrm5gx4r00781ynoowmf4zdd` (16 queued) | `cmrm2a5zl008b1ygaly8madxe` | `cmrm1egej00051ygal1t1xzz8` |
| `cmrmu463300ib1y3jc7zm33zt` (14 queued) | `cmr8lvru8000d1yayz0pouj7m` | `cmr165z3x002z1yy51cmcxrq8` |

The inactive ends are `active = false`, `qaPassed = true`, `review_flag = false`, field `nursing`. The active partners are `active = true`, `qaPassed = true`, and have no Item QA partner.
