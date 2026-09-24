# Distractor reason proposal sample

Shape example for `npm run db:propose-distractor-reasons`. These fixtures show how a stored explanation is classified. They are not a production allowlist, and they are not an id file for `--apply`.

The published Management of Care queue of 19 ids (active, `qaPassed`, code `missing_distractor_reason`) classifies as **0 auto_extract**, **18 needs_human**, and **1 skipped near-duplicate**.

`auto_extract` means every missing wrong option has a quote from a labeled incorrect line or from expert `whyIncorrect`. `needs_human` means at least one missing option has no quote. Generic “Plausible nursing action but not the FIRST priority” lines are not assigned to options. An option the teaching summary describes as appropriate is not given an invented reason.

## Auto extract (synthetic shapes)

These four shapes are not in the live queue. They show a quote the schema’s same-line split does not already accept.

| Id | Class | Proposed reason |
| --- | --- | --- |
| shape-adjacent-incorrect | auto_extract | A warm blanket does not treat hypotension and leaves the client unmonitored. |
| shape-because-clause | auto_extract | a blanket does not treat hypotension in this client. |
| shape-hyphen-normalized | auto_extract | Tuberculosis requires airborne isolation in a negative-pressure room. |
| shape-expert-incomplete | auto_extract | A warm blanket does not treat hypotension and leaves the client unmonitored. |

`shape-adjacent-incorrect` stores the option on its own line and `Incorrect —` on the next line. `shape-because-clause` uses “is incorrect because”. `shape-hyphen-normalized` matches `negative-pressure` to `negative pressure`. `shape-expert-incomplete` quotes `whyIncorrect.correction` when the expert record has no why-correct headline, so the schema ignores it.

## Needs human (Management of Care)

| Id | Class | Why no auto write |
| --- | --- | --- |
| cmrcz3rag00001y720tsildn6 | needs_human | Generic placeholder lines do not name the room options. |
| cmrcz3rvw00071y72vnnvrlyq | needs_human | Generic placeholder lines do not name the refusal options. |
| cmto78puf00001yy4ptvahxzr | needs_human | Generic START / MCI placeholder lines. |
| cmto78pyl00011yy4v5lg1l8i | needs_human | Generic START / MCI placeholder lines. |
| cmto78q1c00021yy43oigtwm7 | needs_human | Generic START / MCI placeholder lines. |
| cmto78q4000031yy49x3jo7e9 | needs_human | Generic START / MCI placeholder lines. |
| cmto78q6p00041yy4ro2lqs1q | needs_human | Generic START / MCI placeholder lines. |
| cmto78q9e00051yy4golp7cwj | needs_human | Generic START / MCI placeholder lines. |
| cmto78qc400061yy44bx8oc3o | needs_human | Generic START / MCI placeholder lines. |
| cmto78qey00071yy4r1r80ts3 | needs_human | Generic START / MCI placeholder lines. |
| cmto78qhr00081yy4wma1wj2x | needs_human | Generic START / MCI placeholder lines. |
| cmto78qkm00091yy4efmg69q3 | needs_human | Generic START / MCI placeholder lines. |
| cmr8lvs91000h1yayp3vttz0n | needs_human | Pursed-lip breathing is described as helpful, but the key does not mark it correct. |
| cmr8p5bza009o1y5nob3doqc1 | needs_human | The N95 option is described as appropriate, but the key is only the negative-pressure room. |
| cmra6zr1300551ylwu4a9fyet | needs_human | Vital signs are described as within UAP scope, but the key is only transport. |
| cmrlz5b8b00121yf1tez6nh6n | needs_human | Private room, hand hygiene, and gloves are not each named by an incorrect line. |
| cmrlzjrpc002z1yf1aagt2654 | needs_human | Surgical mask on the client, gown and gloves, and a closed door are described as appropriate. |
| cmrmtcvkt002b1y3jki2940ey | needs_human | Reassess respiratory status is not named by an incorrect line. |

## Skipped near-duplicate

| Id | Class | Why |
| --- | --- | --- |
| cmrm08rnm006u1yf1nbt3cahm | skipped near-duplicate | Item QA codes include `near_duplicate` (and `missing_distractor_reason`). `--apply` does not write it. |

Apply still waits for a reviewed id file. Do not pass `--apply` against production from an unreviewed dry-run.
