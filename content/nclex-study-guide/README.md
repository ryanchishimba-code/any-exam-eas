# NCLEX Study Guide — manuscript drop folder

Paste the **full manuscript** here as one or more `.md` files.

## Expected format

```markdown
# Guide Title

## Chapter 1 — Chapter title pending

### Section label
Body pending.

## Chapter 2 — Next chapter title
Body pending.
```

Rules:
- Split chapters on lines matching `## Chapter …`
- Do **not** invent clinical content in this repo — only paste the real manuscript
- After pasting, run:

```bash
npx tsx scripts/ingest-nclex-guide.ts
```

The ingest script upserts `sg_chapters` from these files. It never fabricates text.

## Placeholder

`00-manuscript-pending.md` is a stub so the reader can render before the real book arrives.
