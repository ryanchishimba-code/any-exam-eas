# NCLEX Study Guide — manuscript drop folder

Manuscript is loaded from the complete book archive (`NCLEX-Complete-Package-with-Visuals.tar.gz`, Enhanced edition).

## Files that ingest

Only numbered chapters:

```
00-front-matter.md … 16-back-matter.md
```

Run:

```bash
npm run ingest:nclex-guide
```

Image paths `visuals/…` are rewritten to `/nclex-study-guide/visuals/…` (files live in `public/nclex-study-guide/visuals/` and are mirrored here). Figures are `.jpg` in the Enhanced edition; keep filenames lowercase for case-sensitive deploys.

## Do not ingest (reference only)

- `README.md`, `DEV.md`, `CURSOR-DROP-IN.md`, `VISUALS-NEEDED.md`
- `_PASTE-READY-FULL-BOOK.md` (full assembled book — optional; chapters above are the source of truth)

## Expected chapter format

```markdown
# Chapter N — Title

### Section
body markdown…
![caption](visuals/example.png)
```
