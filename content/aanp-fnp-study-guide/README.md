# AnyExamEasy AANP FNP Study Guide

Chapter markdown + visuals for the in-app reader at `/aanp-fnp/study-guide`.

## Ingest

```bash
npm run ingest:aanp-fnp-guide
```

Copies `visuals/` into `public/aanp-fnp-study-guide/visuals/` must stay in sync (already mirrored for this drop-in).

## Layout

| Path | Role |
| --- | --- |
| `00`–`16` `*.md` | Numbered chapters (ingest source) |
| `visuals/` | JPG diagrams referenced as `visuals/...` |
| `CURSOR-DROP-IN.md` | Wiring notes from the book package |
| `VISUALS-NEEDED.md` | Figure catalog (complete) |
| `QA-REPORT.md` | Package QA notes |

**Study aid only.** Not clinical advice. Independent of AANPCB — no affiliation or pass-rate claims.
