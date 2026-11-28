export const DAILY_VITALS_BOARDS = ["nclex", "naplex", "pance", "aanp-fnp"] as const;

export type DailyVitalsBoard = (typeof DAILY_VITALS_BOARDS)[number];

export type DailyVitalsPuzzle = {
  id: string;
  board: DailyVitalsBoard;
  word: string;
  clue: string;
  prompt: string;
  explanation: string;
};

export type DailyVitalsFile = {
  version: string;
  review: string;
  puzzles: DailyVitalsPuzzle[];
};

export type TileMark = "correct" | "present" | "absent";

export type MonitorTone = "alarm" | "warn" | "ok";

export type PublicDailyVitals = {
  id: string;
  date: string;
  dayNumber: number;
  board: DailyVitalsBoard;
  boardLabel: string;
  clue: string;
  prompt: string;
  length: number;
  practiceHref: string;
  trialHref: string;
  trialNote: string;
  dateLabel: string;
  sharePath: string;
  legalLines: string[];
  archive: boolean;
};
