# Question Bank Quality & Organization

This document covers the cross-exam quality tooling added in the "validate & arrange all
exam questions" effort. It builds on the existing two-layer QA system (batch `qaPassed`
gates + runtime serve gates) rather than replacing it.

## 1. Canonical cross-exam taxonomy

`src/lib/subjects/canonical-taxonomy.ts` introduces a **shared topic vocabulary** so the
same clinical/science area can be referenced across exams whose `subjectId`s diverge
(`cardiology` on USMLE, `cardiovascular` on PANCE/FNP, `cardiovascular-pulmonary` on NPTE).

- `CANONICAL_TOPICS` — the ontology (basic sciences, organ systems, populations, process
  axes, practice axes). Content-bearing topics carry keyword signals; process/practice
  axes (e.g. "Assess", "Pharmacy Law") are marked `contentBearing: false`.
- `SUBJECT_CROSSWALK` — maps every registered `(fieldId, subjectId)` → one canonical id.
- Helpers: `getCanonicalTopic`, `getFieldSubjectsForCanonical` (powers "show Cardiovascular
  across every exam"), `validateCrosswalkCoverage`.

**Drift protection:** `canonical-taxonomy.test.ts` runs `validateCrosswalkCoverage` against
the live subject registry. If a new `subjectId` is added without a crosswalk entry, the
test fails. Run it after any change to `src/lib/subjects/*/subjects.ts`:

```bash
npx vitest run src/lib/subjects/canonical-taxonomy.test.ts
```

## 2. Subject / content-match audit (read-only)

`scripts/audit-subject-content-match.ts` never writes to the bank. It cross-checks each
active item against its classification and emits `artifacts/subject-content-match-audit.json`.

```bash
npm run db:audit-subject-match                          # all 8 board fields
npm run db:audit-subject-match -- --field usmle-step-1  # one field
npm run db:audit-subject-match -- --limit 2000          # cap rows per field
npm run db:audit-subject-match -- --llm                 # verify mismatches with OpenAI (bounded)
npm run db:audit-subject-match -- --json                # also print JSON to stdout
```

Flag types:

| Flag | Meaning |
|------|---------|
| `orphan_subject` | `subjectId` is not a registered subject for the field — it never appears in the topic picker and silently skews counts. |
| `subject_content_mismatch` | Content has zero keyword signal for its assigned content-bearing topic but ≥2 signals for a different one (suggested topic included). |
| `usmle_step_mismatch` | (USMLE only) the rule-based `classifyUsmleStep` classifier infers a different Step with high confidence than the row's field/`stepLevel`. |

The heuristic is intentionally conservative (only content-bearing topics, zero assigned
signal required) to keep false positives low. `--llm` is bounded to 60 calls/run and uses
the central `getOpenAiClient("curation")`; set `OPENAI_CLASSIFY_MODEL` to override the model.

## 3. Recommended staged remediation loop

Treat the audit as triage, then use the **existing** per-exam gates to remediate. Do USMLE
and NCLEX first (highest usage). Nothing here deploys.

1. `npm run db:audit-subject-match -- --field usmle-step-1` → review `artifacts/…json`.
2. Reclassify Step mis-files: `npm run` the USMLE step classifier
   (`scripts/classify-usmle-step-level.ts`, `--llm` for low-confidence ties).
3. Fix orphan/mislabeled `subjectId`s in source/seed data, then re-sync.
4. Re-run the per-exam "best" QA gate (e.g. `db:qa-gate-usmle-serve`) to refresh `qaPassed`.
5. Confirm serve alignment with `npm run db:audit-bank-quality` and the served-alignment audits.
6. Repeat for `nursing`, then `pharmacy`, `pance`, `aanp-fnp`, `npte-pt`.

## 4. Filtering correctness fixes

- `practiceTopicHref` now resolves USMLE **basic-science** topics (anatomy, physiology,
  pathology, pharmacology, biochemistry, microbiology) to `usmle-step-1` instead of the
  catalog default `usmle-step-2`, fixing 400s from Anatomy Explorer / basic-science deep links.
- `practiceTopicHref` translates the `"mixed"` pseudo-topic to the API's `__mixed__`
  sentinel, fixing the broken "mixed" CTAs (Library hub, quick tools).
- `LibraryHubClient` only deep-links a weak-topic slug when it is a real bank subject,
  otherwise it falls back to a valid mixed session.
