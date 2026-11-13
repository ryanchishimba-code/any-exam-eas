import type { ExamSlug } from "@/types/edtech";

export type CrosswordDirection = "across" | "down";

export type CrosswordSlot = {
  dir: CrosswordDirection;
  r: number;
  c: number;
  num: number;
  answer: string;
  clue: string;
  rationale: string;
  topic: string;
};

/** Full stored puzzle. Server and tests only — answers included. */
export type CrosswordPuzzle = {
  id: string;
  rows: number;
  cols: number;
  /** One string per row. `#` is a block; other characters are letters. */
  grid: string[];
  slots: CrosswordSlot[];
};

export type CrosswordFile = {
  version: string;
  review: string;
  boards: Record<ExamSlug, CrosswordPuzzle[]>;
};

export type PublicCell = {
  block: boolean;
  num?: number;
};

export type PublicSlot = {
  dir: CrosswordDirection;
  r: number;
  c: number;
  num: number;
  len: number;
  clue: string;
  topic: string;
};

/** What the browser receives for today's puzzle. No letters and no rationales. */
export type PublicPuzzle = {
  id: string;
  board: ExamSlug;
  date: string;
  rows: number;
  cols: number;
  cells: PublicCell[][];
  slots: PublicSlot[];
  shareUrl: string;
  quizHref: string;
  signupHref: string;
  boardLabel: string;
  examName: string;
  /** Past archive days do not change the daily streak. */
  archive: boolean;
};

export type CrosswordKeySlot = {
  dir: CrosswordDirection;
  num: number;
  answer: string;
  rationale: string;
  topic: string;
};

export type CrosswordKey = {
  slots: CrosswordKeySlot[];
};
