"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { loadCrosswordStore, saveCrosswordStore } from "@/lib/crossword/browser-store";
import {
  formatClock,
  formatCountdown,
  formatCrosswordDate,
  nextChicagoMidnight,
  todayIsoCentral,
} from "@/lib/crossword/schedule";
import { drawShareCard } from "@/lib/crossword/share-card";
import {
  challengeText,
  spoilerFreeShareText,
  type ShareMark,
} from "@/lib/crossword/share-text";
import { canReplaceSavedGame, gameToOpen } from "@/lib/crossword/shared-open";
import { nextStreak, visibleStreak } from "@/lib/crossword/streak";
import { syncCrosswordProgress } from "@/lib/crossword/sync-progress";
import type { CrosswordDirection, CrosswordKey, PublicPuzzle, PublicSlot } from "@/lib/crossword/types";

function cellKey(r: number, c: number): string {
  return `${r},${c}`;
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

function commitStreak(board: string, today: string): number {
  const store = loadCrosswordStore();
  const next = nextStreak(store.streaks[board], today);
  store.streaks[board] = next;
  saveCrosswordStore(store);
  return next.streak;
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
  const [previewReady, setPreviewReady] = useState(false);
  const { status } = useSession();
  const [key, setKey] = useState<CrosswordKey | null>(null);
  const [keyError, setKeyError] = useState(false);
  const startedAt = useRef<number | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const fillsRef = useRef(fills);
  const hintsRef = useRef(hints);
  const syncTimer = useRef<number | null>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef(puzzle.board);
  fillsRef.current = fills;
  hintsRef.current = hints;
  boardRef.current = puzzle.board;

  const applySaved = useCallback(
    (store: ReturnType<typeof loadCrosswordStore>) => {
      const today = todayIsoCentral();
      setStreak(visibleStreak(store.streaks[puzzle.board], today));
      const locationSearch =
        typeof window === "undefined" ? "" : `${window.location.search}${window.location.hash}`;
      const saved = gameToOpen(store.games[gameKey], locationSearch);
      setFills(saved?.fills ?? {});
      setHints(saved?.hints ?? {});
      setElapsed(saved?.elapsed ?? 0);
      setComplete(Boolean(saved?.complete));
      setHinted(Boolean(saved?.hinted));
      setShowDone(Boolean(saved?.complete));
      if (saved?.started && !saved.complete) {
        startedAt.current = Date.now() - saved.elapsed;
        setRunning(true);
      } else {
        startedAt.current = null;
        setRunning(false);
      }
    },
    [gameKey, puzzle.board],
  );

  useEffect(() => {
    let cancel = false;
    applySaved(loadCrosswordStore());
    if (status === "loading") return () => {
      cancel = true;
    };
    if (status !== "authenticated") {
      setReady(true);
      return () => {
        cancel = true;
      };
    }
    setReady(false);
    void syncCrosswordProgress(8000).then((merged) => {
      if (cancel) return;
      if (merged) applySaved(merged);
      setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, [applySaved, status]);

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
    const store = loadCrosswordStore();
    const next = { fills, hints, elapsed, started: running || elapsed > 0, complete, hinted };
    if (!canReplaceSavedGame(store.games[gameKey], next)) return;
    store.games[gameKey] = next;
    saveCrosswordStore(store);
    if (status !== "authenticated") return;
    if (syncTimer.current) window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => {
      void syncCrosswordProgress(8000).then((merged) => {
        if (!merged) return;
        setStreak(visibleStreak(merged.streaks[boardRef.current], todayIsoCentral()));
      });
    }, 700);
  }, [ready, gameKey, fills, hints, elapsed, running, complete, hinted, status]);

  useEffect(() => {
    return () => {
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
    };
  }, []);

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
      if (!ready || complete || !slot) return;
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
    [active, complete, fills, finish, hints, ready, slot, startTimer],
  );

  const backspace = useCallback(() => {
    if (!ready || complete || !slot) return;
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
  }, [active, complete, fills, hints, ready, slot]);

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
      if (!ready || showDone) return;
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
  }, [active, backspace, puzzle.cells, puzzle.cols, puzzle.rows, ready, showDone, showHelp, typeLetter]);

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
    boardLabel: puzzle.spokenName,
    dateLabel: formatCrosswordDate(puzzle.date),
    elapsedLabel: formatClock(elapsed),
    streak,
    hinted,
    complete,
    marks: shareMarks,
    challengeUrl: puzzle.shareUrl,
  });

  const shareInput = useMemo(
    () => ({
      spokenName: puzzle.spokenName,
      examName: puzzle.examName,
      dateLabel: formatCrosswordDate(puzzle.date),
      elapsedLabel: formatClock(elapsed),
      streak,
      hinted,
      complete,
      cells: puzzle.cells,
      hints,
    }),
    [complete, elapsed, hinted, hints, puzzle.cells, puzzle.date, puzzle.examName, puzzle.spokenName, streak],
  );

  const copyText = async (text: string, message: string, withImage = false) => {
    const title = `AnyExamEasy ${puzzle.spokenName} crossword`;
    try {
      if (withImage) {
        const canvas = drawShareCard(shareInput);
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((value) => resolve(value), "image/png"));
        const file = blob ? new File([blob], `anyexameasy-${puzzle.board}-crossword.png`, { type: "image/png" }) : null;
        if (file && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title, text, url: puzzle.shareUrl, files: [file] });
          setToast("Share sheet opened.");
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title, text, url: puzzle.shareUrl });
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

  const downloadCard = (shape: "wide" | "square") => {
    const canvas = drawShareCard(shareInput, shape);
    const link = document.createElement("a");
    const suffix = shape === "square" ? "-square" : "";
    link.download = `anyexameasy-${puzzle.board}-crossword-${puzzle.date}${suffix}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    if (!showDone) return;
    let cancel = false;
    setPreviewReady(false);
    void document.fonts.ready.then(() => {
      if (cancel) return;
      const source = drawShareCard(shareInput);
      const target = previewRef.current;
      if (!target) return;
      target.width = source.width;
      target.height = source.height;
      target.getContext("2d")?.drawImage(source, 0, 0);
      setPreviewReady(true);
    });
    return () => {
      cancel = true;
    };
  }, [showDone, shareInput]);

  const across = puzzle.slots.filter((entry) => entry.dir === "across");
  const down = puzzle.slots.filter((entry) => entry.dir === "down");

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
              <p className="xw-fine">A new puzzle unlocks at midnight, America/Chicago. A streak stays on this device until you create a free account.</p>
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
                You finished the {puzzle.spokenName} crossword in {formatClock(elapsed)}
                {streak > 0 ? ` with a ${streak}-day streak` : ""}. Review the rationales and share a spoiler-free result. {puzzle.trialLabel}. No card needed.
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
              </div>
              {status === "unauthenticated" && streak >= 1 ? (
                <p className="xw-streak-note">
                  Your streak lives only on this device. <a href={puzzle.trialHref}>Create a free account</a> to keep it.
                </p>
              ) : null}
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
              <canvas
                ref={previewRef}
                className="xw-share-preview"
                data-ready={previewReady ? "true" : "false"}
                role="img"
                aria-label={`Spoiler-free AnyExamEasy share card. ${formatClock(elapsed)} solve time, ${streak}-day streak. No answers.`}
              />
              <div className="xw-cta-row" style={{ marginTop: "0.9rem" }}>
                {status === "authenticated" ? null : (
                  <a className="xw-btn xw-btn-primary" href={puzzle.trialHref}>
                    {puzzle.trialLabel} — no card needed
                  </a>
                )}
                <a className={status === "authenticated" ? "xw-btn xw-btn-primary" : "xw-btn"} href={puzzle.quizHref}>
                  Try 10 free questions
                </a>
                <button type="button" className="xw-btn" onClick={() => void copyText(sharePayload, "Copied a spoiler-free result.", true)}>
                  Share result
                </button>
                <button type="button" className="xw-btn" onClick={() => downloadCard("wide")}>
                  Download share image
                </button>
                <button type="button" className="xw-btn" onClick={() => downloadCard("square")}>
                  Square image
                </button>
                <button
                  type="button"
                  className="xw-btn"
                  onClick={() =>
                    void copyText(
                      challengeText({
                        boardLabel: puzzle.spokenName,
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

