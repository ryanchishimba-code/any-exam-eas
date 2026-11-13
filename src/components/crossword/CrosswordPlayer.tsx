"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addIsoDays,
  formatClock,
  formatCountdown,
  formatCrosswordDate,
  nextChicagoMidnight,
  todayIsoCentral,
} from "@/lib/crossword/schedule";
import {
  challengeText,
  demoPercentile,
  spoilerFreeShareText,
  type ShareMark,
} from "@/lib/crossword/share-text";
import type { CrosswordDirection, CrosswordKey, PublicPuzzle, PublicSlot } from "@/lib/crossword/types";

const STORE_KEY = "aee-crossword-v1";

type GameSave = {
  fills: Record<string, string>;
  hints: Record<string, boolean>;
  elapsed: number;
  started: boolean;
  complete: boolean;
  hinted: boolean;
};

type Store = {
  streaks: Record<string, { last: string; streak: number }>;
  games: Record<string, GameSave>;
};

const EMPTY_STORE: Store = { streaks: {}, games: {} };

function cellKey(r: number, c: number): string {
  return `${r},${c}`;
}

function loadStore(): Store {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "") as Store;
    return {
      streaks: parsed.streaks ?? {},
      games: parsed.games ?? {},
    };
  } catch {
    return EMPTY_STORE;
  }
}

function saveStore(store: Store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function covers(slot: PublicSlot, r: number, c: number): boolean {
  if (slot.dir === "across") return r === slot.r && c >= slot.c && c < slot.c + slot.len;
  return c === slot.c && r >= slot.r && r < slot.r + slot.len;
}

function slotIndexAt(slots: PublicSlot[], r: number, c: number, dir: CrosswordDirection): number {
  const preferred = slots.findIndex((slot) => slot.dir === dir && covers(slot, r, c));
  if (preferred >= 0) return preferred;
  const any = slots.findIndex((slot) => covers(slot, r, c));
  return any >= 0 ? any : 0;
}

function readStreak(board: string, today: string): number {
  const record = loadStore().streaks[board];
  if (!record) return 0;
  if (record.last === today || addIsoDays(record.last, 1) === today) return record.streak;
  return 0;
}

function commitStreak(board: string, today: string): number {
  const store = loadStore();
  const record = store.streaks[board];
  if (record?.last === today) return record.streak;
  const alive = record && addIsoDays(record.last, 1) === today ? record.streak : 0;
  const streak = alive + 1;
  store.streaks[board] = { last: today, streak };
  saveStore(store);
  return streak;
}

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] as const;

export function CrosswordPlayer({ puzzle }: { puzzle: PublicPuzzle }) {
  const gameKey = `${puzzle.board}:${puzzle.date}`;
  const [fills, setFills] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [marks, setMarks] = useState<Record<string, "ok" | "bad">>({});
  const [dir, setDir] = useState<CrosswordDirection>("across");
  const [active, setActive] = useState(() => firstCell(puzzle));
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState("");
  const [countdown, setCountdown] = useState("—:—:—");
  const [ready, setReady] = useState(false);
  const [key, setKey] = useState<CrosswordKey | null>(null);
  const [keyError, setKeyError] = useState(false);
  const startedAt = useRef<number | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const fillsRef = useRef(fills);
  const hintsRef = useRef(hints);
  fillsRef.current = fills;
  hintsRef.current = hints;

  useEffect(() => {
    const today = todayIsoCentral();
    setStreak(readStreak(puzzle.board, today));
    const saved = loadStore().games[gameKey];
    if (saved) {
      setFills(saved.fills);
      setHints(saved.hints);
      setElapsed(saved.elapsed);
      setComplete(saved.complete);
      setHinted(saved.hinted);
      setShowDone(saved.complete);
      if (saved.started && !saved.complete) {
        startedAt.current = Date.now() - saved.elapsed;
        setRunning(true);
      }
    }
    setReady(true);
  }, [gameKey, puzzle.board]);

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(nextChicagoMidnight() - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancel = false;
    fetch(`/api/crossword/${puzzle.board}/${puzzle.date}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("key"))))
      .then((payload: CrosswordKey) => {
        if (!cancel) setKey(payload);
      })
      .catch(() => {
        if (!cancel) setKeyError(true);
      });
    return () => {
      cancel = true;
    };
  }, [puzzle.board, puzzle.date]);

  useEffect(() => {
    if (!running || complete) return;
    const id = window.setInterval(() => {
      if (startedAt.current != null) setElapsed(Date.now() - startedAt.current);
    }, 250);
    return () => window.clearInterval(id);
  }, [running, complete]);

  useEffect(() => {
    if (!ready) return;
    const store = loadStore();
    store.games[gameKey] = { fills, hints, elapsed, started: running || elapsed > 0, complete, hinted };
    saveStore(store);
  }, [ready, gameKey, fills, hints, elapsed, running, complete, hinted]);

  const slotPos = slotIndexAt(puzzle.slots, active.r, active.c, dir);
  const slot = puzzle.slots[slotPos] ?? puzzle.slots[0];

  const answerAt = useCallback(
    (r: number, c: number) => {
      if (!key) return null;
      for (const entry of puzzle.slots) {
        if (!covers(entry, r, c)) continue;
        const match = key.slots.find((item) => item.dir === entry.dir && item.num === entry.num);
        if (!match) continue;
        const offset = entry.dir === "across" ? c - entry.c : r - entry.r;
        return match.answer[offset] ?? null;
      }
      return null;
    },
    [key, puzzle.slots],
  );

  const startTimer = useCallback(() => {
    if (complete || running) return;
    startedAt.current = Date.now() - elapsed;
    setRunning(true);
  }, [complete, elapsed, running]);

  const finish = useCallback(
    (nextFills: Record<string, string>, nextHints: Record<string, boolean>) => {
      if (!key || complete) return;
      for (let r = 0; r < puzzle.rows; r += 1) {
        for (let c = 0; c < puzzle.cols; c += 1) {
          if (puzzle.cells[r]?.[c]?.block) continue;
          const expected = answerAt(r, c);
          if (!expected || nextFills[cellKey(r, c)] !== expected) return;
        }
      }
      setComplete(true);
      setRunning(false);
      const today = todayIsoCentral();
      if (!puzzle.archive && puzzle.date === today) {
        setStreak(commitStreak(puzzle.board, today));
      }
      setShowDone(true);
      const anyHint = Object.values(nextHints).some(Boolean);
      setHinted(anyHint);
    },
    [answerAt, complete, key, puzzle],
  );

  useEffect(() => {
    if (!key || complete) return;
    finish(fillsRef.current, hintsRef.current);
  }, [key, complete, finish]);

  const typeLetter = useCallback(
    (letter: string) => {
      if (complete || !slot) return;
      const keyName = cellKey(active.r, active.c);
      if (hints[keyName]) return;
      startTimer();
      const next = { ...fills, [keyName]: letter };
      setFills(next);
      setMarks((current) => {
        const copy = { ...current };
        delete copy[keyName];
        return copy;
      });
      const nextCell = slot.dir === "across" ? { r: active.r, c: active.c + 1 } : { r: active.r + 1, c: active.c };
      if (covers(slot, nextCell.r, nextCell.c)) setActive(nextCell);
      finish(next, hints);
    },
    [active, complete, fills, finish, hints, slot, startTimer],
  );

  const backspace = useCallback(() => {
    if (complete || !slot) return;
    const keyName = cellKey(active.r, active.c);
    if (fills[keyName] && !hints[keyName]) {
      const next = { ...fills };
      delete next[keyName];
      setFills(next);
      return;
    }
    const prev = slot.dir === "across" ? { r: active.r, c: active.c - 1 } : { r: active.r - 1, c: active.c };
    if (!covers(slot, prev.r, prev.c) || hints[cellKey(prev.r, prev.c)]) return;
    setActive(prev);
    const next = { ...fills };
    delete next[cellKey(prev.r, prev.c)];
    setFills(next);
  }, [active, complete, fills, hints, slot]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (showHelp) {
        if (event.key === "Escape") setShowHelp(false);
        return;
      }
      if (showDone && event.key === "Escape") {
        setShowDone(false);
        return;
      }
      if (showDone) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        typeLetter(event.key.toUpperCase());
      } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const nextDir: CrosswordDirection = event.key === "ArrowLeft" || event.key === "ArrowRight" ? "across" : "down";
        setDir(nextDir);
        const delta =
          event.key === "ArrowLeft" ? [0, -1] : event.key === "ArrowRight" ? [0, 1] : event.key === "ArrowUp" ? [-1, 0] : [1, 0];
        let r = active.r + delta[0]!;
        let c = active.c + delta[1]!;
        while (r >= 0 && c >= 0 && r < puzzle.rows && c < puzzle.cols) {
          if (!puzzle.cells[r]?.[c]?.block) {
            setActive({ r, c });
            break;
          }
          r += delta[0]!;
          c += delta[1]!;
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        setDir((current) => (current === "across" ? "down" : "across"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, backspace, puzzle.cells, puzzle.cols, puzzle.rows, showDone, showHelp, typeLetter]);

  useEffect(() => {
    if (showDone) doneRef.current?.focus();
  }, [showDone]);

  const checkGrid = () => {
    if (!key) return;
    const next: Record<string, "ok" | "bad"> = {};
    for (let r = 0; r < puzzle.rows; r += 1) {
      for (let c = 0; c < puzzle.cols; c += 1) {
        if (puzzle.cells[r]?.[c]?.block) continue;
        const value = fills[cellKey(r, c)];
        if (!value) continue;
        const expected = answerAt(r, c);
        if (expected) next[cellKey(r, c)] = value === expected ? "ok" : "bad";
      }
    }
    setMarks(next);
    finish(fills, hints);
  };

  const revealCell = (r: number, c: number, nextFills: Record<string, string>, nextHints: Record<string, boolean>) => {
    const expected = answerAt(r, c);
    if (!expected) return;
    nextFills[cellKey(r, c)] = expected;
    nextHints[cellKey(r, c)] = true;
  };

  const revealLetter = () => {
    if (!key || complete) return;
    const nextFills = { ...fills };
    const nextHints = { ...hints };
    revealCell(active.r, active.c, nextFills, nextHints);
    setFills(nextFills);
    setHints(nextHints);
    setHinted(true);
    finish(nextFills, nextHints);
  };

  const revealWord = () => {
    if (!key || complete || !slot) return;
    const nextFills = { ...fills };
    const nextHints = { ...hints };
    for (let index = 0; index < slot.len; index += 1) {
      const r = slot.dir === "across" ? slot.r : slot.r + index;
      const c = slot.dir === "across" ? slot.c + index : slot.c;
      revealCell(r, c, nextFills, nextHints);
    }
    setFills(nextFills);
    setHints(nextHints);
    setHinted(true);
    finish(nextFills, nextHints);
  };

  const shareMarks: ShareMark[] = puzzle.slots.map((entry) => {
    let usedHint = false;
    let filled = true;
    for (let index = 0; index < entry.len; index += 1) {
      const r = entry.dir === "across" ? entry.r : entry.r + index;
      const c = entry.dir === "across" ? entry.c + index : entry.c;
      const name = cellKey(r, c);
      if (!fills[name]) filled = false;
      if (hints[name]) usedHint = true;
    }
    if (!complete || !filled) return "open";
    return usedHint ? "hint" : "clean";
  });

  const sharePayload = spoilerFreeShareText({
    boardLabel: puzzle.boardLabel,
    dateLabel: formatCrosswordDate(puzzle.date),
    elapsedLabel: formatClock(elapsed),
    streak,
    hinted,
    complete,
    marks: shareMarks,
    challengeUrl: puzzle.shareUrl,
  });

  const copyText = async (text: string, message: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${puzzle.boardLabel} crossword`, text, url: puzzle.shareUrl });
        setToast("Share sheet opened.");
        return;
      }
      await navigator.clipboard.writeText(text);
      setToast(message);
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setToast(message);
      } catch {
        setToast("Copy this result from the screen if sharing is blocked.");
      }
    }
  };

  const downloadCard = () => {
    const canvas = drawShareCard({
      board: puzzle.boardLabel,
      date: puzzle.date,
      elapsed: formatClock(elapsed),
      streak,
      hinted,
      cells: puzzle.cells,
      hints,
    });
    const link = document.createElement("a");
    link.download = `anyexameasy-${puzzle.board}-crossword-${puzzle.date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const across = puzzle.slots.filter((entry) => entry.dir === "across");
  const down = puzzle.slots.filter((entry) => entry.dir === "down");
  const percent = demoPercentile(elapsed);

  return (
    <div className="xw-play">
      <div className="xw-meta">
        <span className="xw-pill">
          Streak <strong>{streak}</strong>
        </span>
        <span className="xw-pill">
          Next puzzle <strong>{countdown}</strong>
        </span>
        <button type="button" className="xw-btn" onClick={() => setShowHelp(true)}>
          How to play
        </button>
      </div>
      <div className="xw-stage">
        <div className="xw-board">
          <div className="xw-toolbar">
            <div className="xw-timer" aria-live="polite">
              {formatClock(elapsed)}
            </div>
            <div className="xw-actions">
              <button type="button" className="xw-btn xw-btn-primary" onClick={checkGrid} disabled={!key}>
                Check
              </button>
              <button type="button" className="xw-btn" onClick={revealLetter} disabled={!key || complete}>
                Reveal letter
              </button>
              <button type="button" className="xw-btn" onClick={revealWord} disabled={!key || complete}>
                Reveal word
              </button>
            </div>
          </div>
          {keyError ? <p className="xw-fine">Checking is unavailable right now. You can still fill the grid.</p> : null}
          <div className="xw-cluebar">
            <button type="button" aria-label="Previous clue" onClick={() => moveClue(puzzle.slots, slotPos, -1, setActive, setDir)}>
              ‹
            </button>
            <div>
              <div className="xw-clue-kicker">
                {slot ? `${slot.num} ${slot.dir}` : "Clue"}
              </div>
              <p className="xw-clue-text">{slot?.clue}</p>
            </div>
            <button type="button" aria-label="Next clue" onClick={() => moveClue(puzzle.slots, slotPos, 1, setActive, setDir)}>
              ›
            </button>
          </div>
          <div className="xw-grid-wrap">
            <div
              className="xw-grid"
              role="grid"
              aria-label={`${puzzle.boardLabel} crossword`}
              style={{
                ["--xw-rows" as string]: puzzle.rows,
                ["--xw-cols" as string]: puzzle.cols,
                gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${puzzle.rows}, minmax(0, 1fr))`,
              }}
            >
              {puzzle.cells.map((row, r) =>
                row.map((cell, c) => {
                  const name = cellKey(r, c);
                  const inWord = slot ? covers(slot, r, c) : false;
                  const className = [
                    "xw-cell",
                    cell.block ? "xw-cell-block" : "",
                    !cell.block && inWord ? "xw-cell-word" : "",
                    !cell.block && active.r === r && active.c === c ? "xw-cell-active" : "",
                    hints[name] ? "xw-cell-hint" : "",
                    !hints[name] && marks[name] === "ok" ? "xw-cell-ok" : "",
                    !hints[name] && marks[name] === "bad" ? "xw-cell-bad" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  if (cell.block) {
                    return <div key={name} className={className} role="presentation" />;
                  }
                  return (
                    <button
                      key={name}
                      type="button"
                      className={className}
                      role="gridcell"
                      aria-selected={active.r === r && active.c === c}
                      onClick={() => {
                        if (active.r === r && active.c === c) {
                          setDir((current) => (current === "across" ? "down" : "across"));
                        } else {
                          setActive({ r, c });
                        }
                      }}
                    >
                      {cell.num ? <span className="xw-num">{cell.num}</span> : null}
                      {fills[name] ?? ""}
                    </button>
                  );
                }),
              )}
            </div>
          </div>
        </div>
        <div className="xw-clues">
          <ClueCard
            title="Across"
            entries={across}
            active={slot}
            fills={fills}
            hints={hints}
            marks={marks}
            onPick={(entry) => selectSlot(entry, setActive, setDir)}
          />
          <ClueCard
            title="Down"
            entries={down}
            active={slot}
            fills={fills}
            hints={hints}
            marks={marks}
            onPick={(entry) => selectSlot(entry, setActive, setDir)}
          />
        </div>
      </div>

      <div className="xw-kbd" aria-label="Letter keyboard">
        {KEY_ROWS.map((row) => (
          <div key={row} className="xw-kbd-row">
            {row === "ZXCVBNM" ? (
              <button type="button" className="xw-key xw-key-wide" onClick={() => setDir((current) => (current === "across" ? "down" : "across"))}>
                {dir === "across" ? "Across" : "Down"}
              </button>
            ) : null}
            {[...row].map((letter) => (
              <button key={letter} type="button" className="xw-key" onClick={() => typeLetter(letter)}>
                {letter}
              </button>
            ))}
            {row === "ZXCVBNM" ? (
              <button type="button" className="xw-key xw-key-wide" onClick={backspace}>
                Delete
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {showHelp ? (
        <div className="xw-modal-back" role="presentation" onClick={() => setShowHelp(false)}>
          <div className="xw-modal" role="dialog" aria-modal="true" aria-labelledby="xw-help-title" onClick={(event) => event.stopPropagation()}>
            <div className="xw-modal-body">
              <h2 id="xw-help-title">How to play</h2>
              <ol className="xw-steps">
                <li>Fill the grid from the clues. The timer starts on your first letter.</li>
                <li>Check the grid, or reveal a letter or word if you are stuck. Hints show on your share card.</li>
                <li>Finish to read a one-line rationale, then try free questions. This is practice, not a promise you&apos;ll pass.</li>
              </ol>
              <p className="xw-fine">A new puzzle unlocks at midnight, America/Chicago. Streaks stay in this browser.</p>
              <button type="button" className="xw-btn xw-btn-primary" onClick={() => setShowHelp(false)}>
                Back to the grid
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDone ? (
        <div className="xw-modal-back" role="presentation">
          <div className="xw-modal" role="dialog" aria-modal="true" aria-labelledby="xw-done-title">
            <div className="xw-modal-body">
              <h2 id="xw-done-title" tabIndex={-1} ref={doneRef}>
                Puzzle complete
              </h2>
              <p className="xw-lede">
                You finished the {puzzle.boardLabel} crossword. Review the rationales, share a spoiler-free result, then try free questions.
              </p>
              <div className="xw-stats">
                <div className="xw-stat">
                  <b>{formatClock(elapsed)}</b>
                  <span>Solve time</span>
                </div>
                <div className="xw-stat">
                  <b>{streak}</b>
                  <span>Day streak</span>
                </div>
                <div className="xw-stat">
                  <b>{percent}%</b>
                  <span>Preview percentile</span>
                </div>
              </div>
              <p className="xw-demo">
                Faster than {percent}% of solvers today is a demo preview, not a live ranking.
              </p>
              {puzzle.archive ? <p className="xw-fine">Archive puzzle. Today&apos;s streak is unchanged.</p> : null}
              <p className="xw-fine">Next puzzle in {countdown} (midnight, America/Chicago).</p>
              <ol className="xw-answer-list">
                {(key?.slots ?? []).map((entry) => (
                  <li key={`${entry.dir}-${entry.num}`}>
                    <strong>
                      {entry.num} {entry.dir === "across" ? "Across" : "Down"} · {entry.answer}
                    </strong>
                    <p>{entry.rationale}</p>
                  </li>
                ))}
              </ol>
              <div className="xw-cta-row" style={{ marginTop: "0.9rem" }}>
                <a className="xw-btn xw-btn-primary" href={puzzle.quizHref}>
                  Try 10 free {puzzle.boardLabel} questions
                </a>
                <a className="xw-btn" href={puzzle.signupHref}>
                  Create a free account
                </a>
                <button type="button" className="xw-btn" onClick={() => void copyText(sharePayload, "Copied a spoiler-free result.")}>
                  Share result
                </button>
                <button type="button" className="xw-btn" onClick={downloadCard}>
                  Download share image
                </button>
                <button
                  type="button"
                  className="xw-btn"
                  onClick={() =>
                    void copyText(
                      challengeText({
                        boardLabel: puzzle.boardLabel,
                        dateLabel: formatCrosswordDate(puzzle.date),
                        challengeUrl: puzzle.shareUrl,
                      }),
                      "Copied a challenge link.",
                    )
                  }
                >
                  Challenge a friend
                </button>
                <button type="button" className="xw-btn" onClick={() => setShowDone(false)}>
                  Close
                </button>
              </div>
              <p className="xw-toast" role="status">
                {toast}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function firstCell(puzzle: PublicPuzzle): { r: number; c: number } {
  for (let r = 0; r < puzzle.rows; r += 1) {
    for (let c = 0; c < puzzle.cols; c += 1) {
      if (!puzzle.cells[r]?.[c]?.block) return { r, c };
    }
  }
  return { r: 0, c: 0 };
}

function selectSlot(
  entry: PublicSlot,
  setActive: (cell: { r: number; c: number }) => void,
  setDir: (dir: CrosswordDirection) => void,
) {
  setDir(entry.dir);
  setActive({ r: entry.r, c: entry.c });
}

function moveClue(
  slots: PublicSlot[],
  index: number,
  delta: number,
  setActive: (cell: { r: number; c: number }) => void,
  setDir: (dir: CrosswordDirection) => void,
) {
  const next = slots[(index + delta + slots.length) % slots.length];
  if (next) selectSlot(next, setActive, setDir);
}

function ClueCard({
  title,
  entries,
  active,
  fills,
  hints,
  marks,
  onPick,
}: {
  title: string;
  entries: PublicSlot[];
  active?: PublicSlot;
  fills: Record<string, string>;
  hints: Record<string, boolean>;
  marks: Record<string, "ok" | "bad">;
  onPick: (entry: PublicSlot) => void;
}) {
  return (
    <section className="xw-card" aria-label={title}>
      <h2>{title}</h2>
      <ul className="xw-clue-list">
        {entries.map((entry) => {
          const done = wordSolved(entry, fills, hints, marks);
          return (
            <li key={`${entry.dir}-${entry.num}`}>
              <button
                type="button"
                className={done ? "xw-clue is-done" : "xw-clue"}
                aria-current={active?.dir === entry.dir && active.num === entry.num}
                onClick={() => onPick(entry)}
              >
                <b>{entry.num}</b>
                <span>{entry.clue}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function wordSolved(
  entry: PublicSlot,
  fills: Record<string, string>,
  hints: Record<string, boolean>,
  marks: Record<string, "ok" | "bad">,
): boolean {
  for (let index = 0; index < entry.len; index += 1) {
    const r = entry.dir === "across" ? entry.r : entry.r + index;
    const c = entry.dir === "across" ? entry.c + index : entry.c;
    const name = cellKey(r, c);
    if (!fills[name]) return false;
    if (!hints[name] && marks[name] !== "ok") return false;
  }
  return true;
}

function drawShareCard(input: {
  board: string;
  date: string;
  elapsed: string;
  streak: number;
  hinted: boolean;
  cells: PublicPuzzle["cells"];
  hints: Record<string, boolean>;
}) {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8fffd");
  gradient.addColorStop(1, "#e6fffb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0f766e";
  roundRect(ctx, 64, 48, 64, 64, 16);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 36px sans-serif";
  ctx.fillText("A", 82, 92);
  ctx.fillStyle = "#0a2540";
  ctx.font = "800 42px sans-serif";
  ctx.fillText("AnyExamEasy", 148, 94);
  ctx.fillStyle = "#0f766e";
  ctx.font = "700 24px sans-serif";
  ctx.fillText(`${input.board.toUpperCase()} DAILY CROSSWORD`, 64, 156);
  ctx.fillStyle = "#475569";
  ctx.font = "600 28px sans-serif";
  ctx.fillText(input.date, 64, 198);
  ctx.fillStyle = "#0a2540";
  ctx.font = "800 40px sans-serif";
  ctx.fillText(`Completed in ${input.elapsed}`, 64, 520);
  ctx.fillStyle = "#0f766e";
  ctx.font = "700 26px sans-serif";
  ctx.fillText(`${input.hinted ? "Used hints" : "No hints"} · ${input.streak}-day streak`, 64, 564);
  ctx.fillStyle = "#0a2540";
  ctx.fillRect(0, height - 56, width, 56);
  ctx.fillStyle = "#99f6e4";
  ctx.font = "700 22px sans-serif";
  ctx.fillText("Practice, not a promise you'll pass · anyexameasy.com/crossword", 64, height - 22);

  const rows = input.cells.length;
  const cols = input.cells[0]?.length ?? 1;
  const board = 360;
  const gap = 4;
  const cell = (board - gap * (Math.max(rows, cols) - 1)) / Math.max(rows, cols);
  const gridW = cols * cell + (cols - 1) * gap;
  const gridH = rows * cell + (rows - 1) * gap;
  const x0 = width - gridW - 72;
  const y0 = (height - 56 - gridH) / 2;
  input.cells.forEach((row, r) => {
    row.forEach((cellInfo, c) => {
      const x = x0 + c * (cell + gap);
      const y = y0 + r * (cell + gap);
      ctx.fillStyle = cellInfo.block ? "#0a2540" : input.hints[`${r},${c}`] ? "#fbbf24" : "#0f766e";
      roundRect(ctx, x, y, cell, cell, 6);
      ctx.fill();
    });
  });
  return canvas;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
