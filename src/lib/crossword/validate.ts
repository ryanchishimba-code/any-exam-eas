import type { CrosswordPuzzle, CrosswordSlot } from "@/lib/crossword/types";

export function slotLength(slot: Pick<CrosswordSlot, "answer">): number {
  return slot.answer.length;
}

export function cellsFor(slot: Pick<CrosswordSlot, "dir" | "r" | "c" | "answer">): [number, number][] {
  const cells: [number, number][] = [];
  for (let index = 0; index < slot.answer.length; index += 1) {
    if (slot.dir === "across") cells.push([slot.r, slot.c + index]);
    else cells.push([slot.r + index, slot.c]);
  }
  return cells;
}

/** Machine-check a stored puzzle. Returns human-readable issues. */
export function validatePuzzle(puzzle: CrosswordPuzzle): string[] {
  const issues: string[] = [];
  const { rows, cols, grid, slots } = puzzle;
  if (rows < 5 || cols < 5 || grid.length !== rows) {
    issues.push("grid size");
    return issues;
  }
  if (grid.some((row) => row.length !== cols)) {
    issues.push("ragged grid");
    return issues;
  }

  const runs: { dir: "across" | "down"; r: number; c: number; word: string }[] = [];
  for (const across of [true, false]) {
    const outer = across ? rows : cols;
    const inner = across ? cols : rows;
    for (let i = 0; i < outer; i += 1) {
      let start: number | null = null;
      for (let j = 0; j <= inner; j += 1) {
        let white = false;
        if (j < inner) {
          const r = across ? i : j;
          const c = across ? j : i;
          white = grid[r]![c] !== "#";
        }
        if (white) {
          if (start === null) start = j;
        } else if (start !== null) {
          const length = j - start;
          if (length === 2) issues.push("two-letter run");
          if (length >= 3) {
            const cells: [number, number][] = [];
            for (let k = 0; k < length; k += 1) {
              cells.push(across ? [i, start + k] : [start + k, i]);
            }
            const word = cells.map(([r, c]) => grid[r]![c]).join("");
            runs.push({
              dir: across ? "across" : "down",
              r: cells[0]![0],
              c: cells[0]![1],
              word,
            });
          }
          start = null;
        }
      }
    }
  }

  const stored = new Set(slots.map((slot) => `${slot.dir}:${slot.r}:${slot.c}:${slot.answer}`));
  const found = new Set(runs.map((run) => `${run.dir}:${run.r}:${run.c}:${run.word}`));
  for (const key of found) {
    if (!stored.has(key)) issues.push(`missing slot ${key}`);
  }
  for (const key of stored) {
    if (!found.has(key)) issues.push(`extra slot ${key}`);
  }

  const letters = new Map<string, string>();
  const answers = new Set<string>();
  for (const slot of slots) {
    if (!/^[A-Z]{3,11}$/.test(slot.answer)) issues.push(`bad answer ${slot.answer}`);
    if (answers.has(slot.answer)) issues.push(`duplicate ${slot.answer}`);
    answers.add(slot.answer);
    if (slot.clue.trim().length < 20) issues.push(`short clue ${slot.answer}`);
    if (slot.rationale.trim().length < 20) issues.push(`short rationale ${slot.answer}`);
    if (new RegExp(`\\b${slot.answer}\\b`, "i").test(slot.clue)) {
      issues.push(`clue spoils ${slot.answer}`);
    }
    cellsFor(slot).forEach(([r, c], index) => {
      const letter = slot.answer[index]!;
      const cell = grid[r]?.[c];
      if (cell !== letter) issues.push(`${slot.answer} mismatches ${r},${c}`);
      const prev = letters.get(`${r},${c}`);
      if (prev && prev !== letter) issues.push(`crossing conflict ${r},${c}`);
      letters.set(`${r},${c}`, letter);
    });
  }

  const whites: [number, number][] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r]![c] !== "#") whites.push([r, c]);
    }
  }
  for (const [r, c] of whites) {
    if (!letters.has(`${r},${c}`)) issues.push(`uncovered ${r},${c}`);
  }

  if (whites.length) {
    const seen = new Set<string>([`${whites[0]![0]},${whites[0]![1]}`]);
    const stack = [whites[0]!];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      for (const [dr, dc] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ] as const) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr]![nc] === "#" || seen.has(key)) {
          continue;
        }
        seen.add(key);
        stack.push([nr, nc]);
      }
    }
    if (seen.size !== whites.length) issues.push("disconnected");
  }

  const expected = expectedNumbers(slots);
  slots.forEach((slot, index) => {
    if (slot.num !== expected[index]) issues.push(`number ${slot.answer}`);
  });

  return issues;
}

function expectedNumbers(slots: CrosswordSlot[]): number[] {
  const starts = new Map<string, CrosswordSlot[]>();
  for (const slot of slots) {
    const key = `${slot.r},${slot.c}`;
    const group = starts.get(key) ?? [];
    group.push(slot);
    starts.set(key, group);
  }
  const rows = Math.max(...slots.map((slot) => slot.r + (slot.dir === "down" ? slot.answer.length : 1)));
  const cols = Math.max(...slots.map((slot) => slot.c + (slot.dir === "across" ? slot.answer.length : 1)));
  const numbers = new Map<CrosswordSlot, number>();
  let num = 1;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const group = starts.get(`${r},${c}`);
      if (!group) continue;
      for (const slot of group) numbers.set(slot, num);
      num += 1;
    }
  }
  return slots.map((slot) => numbers.get(slot) ?? -1);
}

export function windowRepeats(puzzles: CrosswordPuzzle[], window = 14): string[] {
  const issues: string[] = [];
  const count = puzzles.length;
  for (let start = 0; start < count; start += 1) {
    const seen = new Set<string>();
    for (let step = 0; step < window; step += 1) {
      const puzzle = puzzles[(start + step) % count]!;
      for (const slot of puzzle.slots) {
        if (seen.has(slot.answer)) {
          issues.push(`${slot.answer} repeats within ${window} days of index ${start}`);
          return issues;
        }
        seen.add(slot.answer);
      }
    }
  }
  return issues;
}
