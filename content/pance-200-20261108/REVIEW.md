# Keyless review of the reused 200 drafts

The blind sheet was answered before the provided keys were opened. 199 of 200 stems were complete. All 199 matched the supplied key (100% of scored items). Item 101 was cut off in the blind sheet before the dobutamine result, so it was not scored and was not reused.

The drafts are not the inserted set. Their labeled difficulty was 1 in 14, 2 in 62, 3 in 101, 4 in 21, and 5 in 2, so only 23 were already difficulty 4 or 5. Raising that label would not have made them hard. Topic wording also overlapped the served bank. The pack below is newly written. At least 120 items are difficulty 4 or 5 because the decision is a threshold, an exception, or a near-miss drug, not because an easy stem was renumbered.

No database write was run. `insert.rollback-only.sql` begins a transaction and ends in `ROLLBACK`. Rows are `active = false` and `qaPassed = false`. `undo.sql` deletes only `fieldId = pance` and `generationVersion = pance-200-20261108-v1` that are still inactive and not qa-passed.
