# AnyExamEasy PANCE Study Guide

Chapter markdown + visuals for the in-app reader at `/pance/study-guide`.

## Ingest

```bash
npm run ingest:pance-guide
```

`visuals/` is mirrored in `public/pance-study-guide/visuals/`. Ingest rewrites `visuals/...` to that public prefix and stamps width and height.

## Layout

| Path | Role |
| --- | --- |
| `00`–`21` `*.md` | Numbered chapters (ingest source) |
| `visuals/` | SVG diagrams referenced as `visuals/...` |

The claims table (C1–C60) is not in the manuscript. Exam-fact sources stay in the back-matter chapter, the same place other books keep an official-source section.

**Study aid only.** Not clinical advice. Independent of NCCPA — no affiliation or pass-rate claims.
