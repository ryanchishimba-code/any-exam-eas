# AnyExamEasy USMLE Study Guide

Chapter markdown for the in-app reader at `/usmle/study-guide`.

The reader loads published DB chapters when they exist. Until ingest runs, the
same files are served from disk so `/usmle/study-guide` does not 404.

## Ingest

```bash
npm run ingest:usmle-guide
```

## Layout

| Path | Role |
| --- | --- |
| `00`–`07`, `15`, `16` `*.md` | Numbered chapters |
| `README.md` | This file |

**Study aid only.** Not clinical advice. Independent of NBME and FSMB — no affiliation or pass-rate claims.
