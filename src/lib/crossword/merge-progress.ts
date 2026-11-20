import { isCrosswordBoard, type CrosswordBoard } from "@/lib/crossword/boards";
import type { CrosswordGameSave, CrosswordStore } from "@/lib/crossword/browser-store";
import { addIsoDays } from "@/lib/crossword/schedule";
import { mergeStreakRecords, type CrosswordStreakRecord } from "@/lib/crossword/streak";

const MAX_CELLS = 80;
const MAX_ELAPSED_MS = 6 * 60 * 60 * 1000;
const MAX_GAMES_PER_BOARD = 40;
const LETTER = /^[A-Z]$/;
const CELL = /^\d{1,2},\d{1,2}$/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeCrosswordStore(input: unknown): CrosswordStore {
  const source = input && typeof input === "object" ? (input as { streaks?: unknown; games?: unknown }) : {};
  const streaks: CrosswordStore["streaks"] = {};
  if (source.streaks && typeof source.streaks === "object") {
    for (const [board, value] of Object.entries(source.streaks as Record<string, unknown>)) {
      if (!isCrosswordBoard(board)) continue;
      const record = value as Partial<CrosswordStreakRecord> | null;
      const last = typeof record?.last === "string" ? record.last : "";
      const streak = typeof record?.streak === "number" ? record.streak : 0;
      const merged = mergeStreakRecords({ last, streak }, undefined);
      if (merged) streaks[board] = merged;
    }
  }
  const games: CrosswordStore["games"] = {};
  if (source.games && typeof source.games === "object") {
    for (const [key, value] of Object.entries(source.games as Record<string, unknown>)) {
      const split = key.indexOf(":");
      if (split <= 0) continue;
      const board = key.slice(0, split);
      const date = key.slice(split + 1);
      if (!isCrosswordBoard(board) || !ISO.test(date)) continue;
      const game = sanitizeGame(value);
      if (game) games[`${board}:${date}`] = game;
    }
  }
  return { streaks, games };
}

export function mergeCrosswordStores(local: CrosswordStore, remote: CrosswordStore, today: string): CrosswordStore {
  const boards = new Set<string>([...Object.keys(local.streaks), ...Object.keys(remote.streaks)]);
  for (const key of [...Object.keys(local.games), ...Object.keys(remote.games)]) {
    const board = key.slice(0, key.indexOf(":"));
    if (board) boards.add(board);
  }
  const streaks: CrosswordStore["streaks"] = {};
  for (const board of boards) {
    if (!isCrosswordBoard(board)) continue;
    const merged = mergeStreakRecords(local.streaks[board], remote.streaks[board]);
    if (merged) streaks[board] = merged;
  }
  const games: CrosswordStore["games"] = {};
  const keys = new Set([...Object.keys(local.games), ...Object.keys(remote.games)]);
  for (const key of keys) {
    const board = key.slice(0, key.indexOf(":"));
    if (!isCrosswordBoard(board)) continue;
    const merged = mergeGame(local.games[key], remote.games[key]);
    if (merged) games[key] = merged;
  }
  return { streaks, games: pruneGames(games, today) };
}

export function gamesByBoard(store: CrosswordStore, board: CrosswordBoard): Record<string, CrosswordGameSave> {
  const prefix = `${board}:`;
  const games: Record<string, CrosswordGameSave> = {};
  for (const [key, game] of Object.entries(store.games)) {
    if (!key.startsWith(prefix)) continue;
    games[key.slice(prefix.length)] = game;
  }
  return games;
}

function mergeGame(a: CrosswordGameSave | undefined, b: CrosswordGameSave | undefined): CrosswordGameSave | undefined {
  if (!a) return b;
  if (!b) return a;
  if (a.complete !== b.complete) return a.complete ? a : b;
  if (a.complete && b.complete) {
    const longer = a.elapsed >= b.elapsed ? a : b;
    return {
      ...longer,
      hinted: a.hinted || b.hinted,
      hints: { ...a.hints, ...b.hints },
    };
  }
  const aScore = Object.keys(a.fills).length * 1_000_000 + a.elapsed;
  const bScore = Object.keys(b.fills).length * 1_000_000 + b.elapsed;
  return aScore >= bScore ? a : b;
}

function sanitizeGame(value: unknown): CrosswordGameSave | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Partial<CrosswordGameSave>;
  const fills: Record<string, string> = {};
  if (source.fills && typeof source.fills === "object") {
    for (const [cell, letter] of Object.entries(source.fills)) {
      if (Object.keys(fills).length >= MAX_CELLS) break;
      if (!CELL.test(cell) || typeof letter !== "string" || !LETTER.test(letter)) continue;
      fills[cell] = letter;
    }
  }
  const hints: Record<string, boolean> = {};
  if (source.hints && typeof source.hints === "object") {
    for (const [cell, used] of Object.entries(source.hints)) {
      if (Object.keys(hints).length >= MAX_CELLS) break;
      if (!CELL.test(cell) || used !== true) continue;
      hints[cell] = true;
    }
  }
  const elapsed = typeof source.elapsed === "number" && Number.isFinite(source.elapsed) ? source.elapsed : 0;
  return {
    fills,
    hints,
    elapsed: Math.max(0, Math.min(MAX_ELAPSED_MS, Math.round(elapsed))),
    started: source.started === true || elapsed > 0 || Object.keys(fills).length > 0,
    complete: source.complete === true,
    hinted: source.hinted === true || Object.keys(hints).length > 0,
  };
}

function pruneGames(games: CrosswordStore["games"], today: string): CrosswordStore["games"] {
  const grouped = new Map<string, [string, CrosswordGameSave, number][]>();
  for (const [key, game] of Object.entries(games)) {
    const date = key.slice(key.indexOf(":") + 1);
    const age = daysBefore(today, date);
    if (age === null || age < 0 || age > 60) continue;
    if (!game.complete && age > 21) continue;
    const board = key.slice(0, key.indexOf(":"));
    const list = grouped.get(board) ?? [];
    list.push([key, game, age]);
    grouped.set(board, list);
  }
  const kept: CrosswordStore["games"] = {};
  for (const list of grouped.values()) {
    list.sort((a, b) => a[2] - b[2]);
    for (const [key, game] of list.slice(0, MAX_GAMES_PER_BOARD)) kept[key] = game;
  }
  return kept;
}

function daysBefore(today: string, earlier: string): number | null {
  if (!ISO.test(today) || !ISO.test(earlier)) return null;
  let cursor = earlier;
  for (let age = 0; age <= 61; age += 1) {
    if (cursor === today) return age;
    cursor = addIsoDays(cursor, 1);
  }
  return null;
}
