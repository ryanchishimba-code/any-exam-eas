#!/usr/bin/env python3
"""Build a versioned, disjoint daily crossword bank for every board.

Reads scripts/crossword/banks/*.json and writes src/data/crossword/puzzles.json.
No database. Clinical clues still need human review before launch.
"""

from __future__ import annotations

import json
import random
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK_DIR = ROOT / "scripts" / "crossword" / "banks"
OUT = ROOT / "src" / "data" / "crossword" / "puzzles.json"

BOARDS = ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"]
MIN_PUZZLES = 32
ANSWER_RE = re.compile(r"^[A-Z]{3,11}$")
PASS_PROMISE = re.compile(
    r"you will pass|you'll pass|guaranteed to pass|guarantee you pass|promise you'll pass",
    re.I,
)
EMPTY = "."


def word_in_text(answer: str, text: str) -> bool:
    return re.search(rf"\b{re.escape(answer)}\b", text, re.I) is not None


def load_board(board: str) -> dict[str, dict]:
    paths = []
    direct = BANK_DIR / f"{board}.json"
    if direct.exists():
        paths.append(direct)
    extra = BANK_DIR / f"{board}-extra.json"
    if extra.exists():
        paths.append(extra)
    if not paths:
        raise SystemExit(f"missing bank for {board}")
    merged: dict[str, dict] = {}
    dropped = []
    for path in paths:
        raw = json.loads(path.read_text())
        for answer, entry in raw.items():
            key = str(answer).strip().upper()
            clue = str(entry.get("clue", "")).strip()
            rationale = str(entry.get("rationale", "")).strip()
            topic = str(entry.get("topic", "")).strip() or "High yield"
            if not ANSWER_RE.match(key):
                dropped.append(f"{board} bad answer {answer!r}")
                continue
            if key in merged:
                dropped.append(f"{board} duplicate {key}")
                continue
            if len(clue) < 20 or len(rationale) < 20:
                dropped.append(f"{board} short copy {key}")
                continue
            if word_in_text(key, clue):
                dropped.append(f"{board} clue spoils {key}")
                continue
            blob = f"{clue} {rationale}"
            if PASS_PROMISE.search(blob):
                dropped.append(f"{board} pass promise {key}")
                continue
            merged[key] = {"clue": clue, "rationale": rationale, "topic": topic}
    print(f"{board}: kept {len(merged)} dropped {len(dropped)}")
    for line in dropped[:12]:
        print("  -", line)
    if len(dropped) > 12:
        print(f"  - … {len(dropped) - 12} more")
    return merged


def can_place(grid, word, r, c, d):
    n = len(grid)
    dr, dc = (0, 1) if d == "across" else (1, 0)
    er, ec = r + dr * (len(word) - 1), c + dc * (len(word) - 1)
    if min(r, c, er, ec) < 0 or max(er, ec) >= n:
        return False
    br, bc = r - dr, c - dc
    if 0 <= br < n and 0 <= bc < n and grid[br][bc].isalpha():
        return False
    ar, ac = er + dr, ec + dc
    if 0 <= ar < n and 0 <= ac < n and grid[ar][ac].isalpha():
        return False
    crosses = 0
    for i, ch in enumerate(word):
        rr, cc = r + dr * i, c + dc * i
        cur = grid[rr][cc]
        if cur == ch:
            crosses += 1
            continue
        if cur != EMPTY:
            return False
        if d == "across":
            for sr in (rr - 1, rr + 1):
                if 0 <= sr < n and grid[sr][cc].isalpha():
                    return False
        else:
            for sc in (cc - 1, cc + 1):
                if 0 <= sc < n and grid[rr][sc].isalpha():
                    return False
    has = any(ch.isalpha() for row in grid for ch in row)
    if has and crosses < 1:
        return False
    return True


def do_place(grid, word, r, c, d):
    dr, dc = (0, 1) if d == "across" else (1, 0)
    for i, ch in enumerate(word):
        grid[r + dr * i][c + dc * i] = ch


def options(grid, word, letter_idx):
    n = len(grid)
    pos = defaultdict(list)
    for r in range(n):
        for c in range(n):
            ch = grid[r][c]
            if ch.isalpha():
                pos[ch].append((r, c))
    opts = []
    seen = set()
    for ch, idxs in letter_idx[word].items():
        for gr, gc in pos.get(ch, ()):
            for i in idxs:
                for r, c, d in ((gr, gc - i, "across"), (gr - i, gc, "down")):
                    if (r, c, d) in seen:
                        continue
                    if can_place(grid, word, r, c, d):
                        seen.add((r, c, d))
                        opts.append((r, c, d))
    return opts


def finalize(grid, bank):
    n = len(grid)
    square = [["#" if grid[r][c] == EMPTY else grid[r][c] for c in range(n)] for r in range(n)]
    whites = [(r, c) for r in range(n) for c in range(n) if square[r][c] != "#"]
    if not whites:
        return None
    r0 = min(r for r, _ in whites)
    r1 = max(r for r, _ in whites)
    c0 = min(c for _, c in whites)
    c1 = max(c for _, c in whites)
    square = [row[c0 : c1 + 1] for row in square[r0 : r1 + 1]]
    rows, cols = len(square), len(square[0])
    if rows < 5 or cols < 5 or rows > 13 or cols > 13:
        return None
    found = []
    for across in (True, False):
        outer = rows if across else cols
        inner = cols if across else rows
        for i in range(outer):
            start = None
            for j in range(inner + 1):
                white = False
                if j < inner:
                    r, c = (i, j) if across else (j, i)
                    white = square[r][c] != "#"
                if white:
                    if start is None:
                        start = j
                elif start is not None:
                    length = j - start
                    if length == 2:
                        return None
                    if length >= 3:
                        cells = (
                            [(i, start + k) for k in range(length)]
                            if across
                            else [(start + k, i) for k in range(length)]
                        )
                        word = "".join(square[r][c] for r, c in cells)
                        if word not in bank:
                            return None
                        found.append(
                            {
                                "dir": "across" if across else "down",
                                "r": cells[0][0],
                                "c": cells[0][1],
                                "answer": word,
                                "cells": cells,
                            }
                        )
                    start = None
    if not (8 <= len(found) <= 12):
        return None
    answers = [slot["answer"] for slot in found]
    if len(set(answers)) != len(answers):
        return None
    cover = defaultdict(int)
    for slot in found:
        for cell in slot["cells"]:
            cover[cell] += 1
    ww = [(r, c) for r in range(rows) for c in range(cols) if square[r][c] != "#"]
    if any(cover[cell] < 1 for cell in ww):
        return None
    seen = set()
    stack = [ww[0]]
    seen.add(ww[0])
    while stack:
        r, c = stack.pop()
        for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and square[nr][nc] != "#" and (nr, nc) not in seen:
                seen.add((nr, nc))
                stack.append((nr, nc))
    if len(seen) != len(ww):
        return None
    crossings = sum(1 for cell in ww if cover[cell] >= 2)
    if crossings < len(found) - 1:
        return None
    starts = defaultdict(list)
    for slot in found:
        starts[(slot["r"], slot["c"])].append(slot)
    numbered = []
    num = 1
    for r in range(rows):
        for c in range(cols):
            group = starts.get((r, c))
            if not group:
                continue
            group.sort(key=lambda slot: 0 if slot["dir"] == "across" else 1)
            for slot in group:
                meta = bank[slot["answer"]]
                numbered.append(
                    {
                        "dir": slot["dir"],
                        "r": slot["r"],
                        "c": slot["c"],
                        "num": num,
                        "answer": slot["answer"],
                        "clue": meta["clue"],
                        "rationale": meta["rationale"],
                        "topic": meta["topic"],
                    }
                )
            num += 1
    return {
        "rows": rows,
        "cols": cols,
        "grid": ["".join(row) for row in square],
        "slots": numbered,
        "crossings": crossings,
        "words": frozenset(answers),
    }


def build_once(rng, pool, letter_idx, bank, n=13, target=10):
    grid = [[EMPTY] * n for _ in range(n)]
    starters = [w for w in pool if 6 <= len(w) <= n]
    if len(starters) < 8:
        return None
    rng.shuffle(starters)
    start = starters[0]
    r = n // 2
    c = max(0, (n - len(start)) // 2)
    if not can_place(grid, start, r, c, "across"):
        return None
    do_place(grid, start, r, c, "across")
    placed = {start}
    rest = [w for w in pool if w != start]
    for _ in range(8):
        progressed = False
        rng.shuffle(rest)
        for word in list(rest):
            if len(placed) >= target:
                break
            opts = options(grid, word, letter_idx)
            if not opts:
                continue

            def score(opt, word=word):
                rr, cc, direc = opt
                dr, dc = (0, 1) if direc == "across" else (1, 0)
                crosses = sum(
                    1 for i, ch in enumerate(word) if grid[rr + dr * i][cc + dc * i] == ch
                )
                end_r = rr + dr * (len(word) - 1)
                end_c = cc + dc * (len(word) - 1)
                whites = [
                    (r, c)
                    for r in range(n)
                    for c in range(n)
                    if grid[r][c].isalpha()
                ]
                whites.append((rr, cc))
                whites.append((end_r, end_c))
                r0 = min(r for r, _ in whites)
                r1 = max(r for r, _ in whites)
                c0 = min(c for _, c in whites)
                c1 = max(c for _, c in whites)
                area = (r1 - r0 + 1) * (c1 - c0 + 1)
                center = abs((rr + end_r) / 2 - n / 2) + abs((cc + end_c) / 2 - n / 2)
                return (-crosses, area, center)

            opts.sort(key=score)
            choice = opts[0] if rng.random() < 0.85 else opts[rng.randrange(min(3, len(opts)))]
            do_place(grid, word, *choice)
            placed.add(word)
            rest.remove(word)
            progressed = True
        if not progressed or len(placed) >= target:
            break
    return finalize(grid, bank)


def pack(board: str, bank: dict, want: int = MIN_PUZZLES) -> list[dict]:
    words = list(bank)
    letter_idx = {w: defaultdict(list) for w in words}
    for word in words:
        for i, ch in enumerate(word):
            letter_idx[word][ch].append(i)
    best: list[dict] = []
    for trial in range(24):
        selected: list[dict] = []
        used: set[str] = set()
        order = words[:]
        random.Random(trial + 11).shuffle(order)
        for seed in range(700):
            avail = [w for w in order if w not in used]
            if len(avail) < 16:
                break
            rng = random.Random(trial * 100_000 + seed)
            target = 8 + (seed % 2)
            size = 13 if seed % 2 == 0 else 11
            got = build_once(rng, avail, letter_idx, bank, n=size, target=target)
            if not got:
                continue
            selected.append(got)
            used |= set(got["words"])
            if len(selected) >= want:
                break
        print(f"  {board} trial {trial}: {len(selected)} puzzles, {len(used)} words")
        if len(selected) > len(best):
            best = selected
        if len(selected) >= want:
            return selected[:want]
    return best


def generate_pool(bank: dict, letter_idx, limit: int = 280) -> list[dict]:
    words = list(bank)
    found: list[dict] = []
    seen = set()
    for seed in range(4000):
        if len(found) >= limit:
            break
        rng = random.Random(seed * 17 + 3)
        pool = words[:]
        rng.shuffle(pool)
        got = build_once(
            rng,
            pool,
            letter_idx,
            bank,
            n=13 if seed % 2 == 0 else 11,
            target=8 + (seed % 2),
        )
        if not got:
            continue
        sig = tuple(sorted(got["words"]))
        if sig in seen:
            continue
        seen.add(sig)
        found.append(got)
    return found


def schedule_gap(candidates: list[dict], length: int = MIN_PUZZLES, gap: int = 14) -> list[dict] | None:
    if len(candidates) < length:
        return None
    for attempt in range(250):
        rng = random.Random(attempt + 5)
        order = candidates[:]
        rng.shuffle(order)
        selected: list[dict] = []
        used = set()
        while len(selected) < length:
            placed = False
            for index, puzzle in enumerate(order):
                if index in used:
                    continue
                if any(
                    not puzzle["words"].isdisjoint(prev["words"])
                    for dist, prev in enumerate(reversed(selected), start=1)
                    if dist < gap
                ):
                    continue
                trial = selected + [puzzle]
                if len(trial) == length:
                    words_ok = True
                    for start in range(length):
                        seen: set[str] = set()
                        for step in range(gap):
                            for word in trial[(start + step) % length]["words"]:
                                if word in seen:
                                    words_ok = False
                                    break
                                seen.add(word)
                            if not words_ok:
                                break
                        if not words_ok:
                            break
                    if not words_ok:
                        continue
                selected.append(puzzle)
                used.add(index)
                placed = True
                break
            if not placed:
                break
        if len(selected) == length:
            return selected
    return None


def circular_repeats(puzzles: list[dict], window: int = 14) -> list[str]:
    issues = []
    n = len(puzzles)
    for start in range(n):
        seen: dict[str, int] = {}
        for step in range(window):
            puzzle = puzzles[(start + step) % n]
            for slot in puzzle["slots"]:
                answer = slot["answer"]
                if answer in seen:
                    issues.append(f"{answer} repeats inside a {window}-day window at {start}")
                    return issues
                seen[answer] = start + step
    return issues


def main() -> None:
    payload = {
        "version": "2026-11-13.1",
        "review": "Clinical clues need human expert review before launch. Do not treat this bank as a final medical authority.",
        "boards": {},
    }
    for board in BOARDS:
        print(f"building {board}")
        bank = load_board(board)
        puzzles = pack(board, bank)
        if len(puzzles) < MIN_PUZZLES:
            print(f"  {board} disjoint pack {len(puzzles)}; trying spaced reuse")
            letter_idx = {word: defaultdict(list) for word in bank}
            for word in bank:
                for index, char in enumerate(word):
                    letter_idx[word][char].append(index)
            pool = generate_pool(bank, letter_idx)
            print(f"  {board} candidate pool {len(pool)}")
            scheduled = schedule_gap(pool)
            if scheduled:
                puzzles = scheduled
        if len(puzzles) < 30:
            raise SystemExit(f"{board} only produced {len(puzzles)} puzzles")
        cleaned = []
        for index, puzzle in enumerate(puzzles, start=1):
            cleaned.append(
                {
                    "id": f"{board}-{index:02d}",
                    "rows": puzzle["rows"],
                    "cols": puzzle["cols"],
                    "grid": puzzle["grid"],
                    "slots": puzzle["slots"],
                }
            )
        issues = circular_repeats(cleaned)
        if issues:
            raise SystemExit(f"{board} schedule failed: {issues[0]}")
        payload["boards"][board] = cleaned
        print(f"{board}: scheduled {len(cleaned)} puzzles")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
