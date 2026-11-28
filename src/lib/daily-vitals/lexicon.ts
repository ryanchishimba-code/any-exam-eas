/**
 * Guess list. Server only. Puzzle answers are always accepted, plus a common
 * English list and a short clinical list so a real medical word is not rejected.
 */

import english from "@/data/daily-vitals/english-words.json";
import puzzles from "@/data/daily-vitals/puzzles.json";

const CLINICAL = [
  "airway",
  "albumin",
  "amylase",
  "anemia",
  "angina",
  "anuria",
  "apnea",
  "aspirin",
  "asthma",
  "ativan",
  "bolus",
  "bradypnea",
  "cough",
  "coumadin",
  "crackle",
  "cyanosis",
  "dangle",
  "defib",
  "digoxin",
  "drain",
  "droplet",
  "dusky",
  "dyspnea",
  "edema",
  "embolus",
  "emesis",
  "enzyme",
  "febrile",
  "fluids",
  "flush",
  "fowler",
  "gauze",
  "heparin",
  "honey",
  "hypoxic",
  "inhaler",
  "iodine",
  "isolate",
  "lactate",
  "lasix",
  "lateral",
  "lipase",
  "lithium",
  "logroll",
  "lovenox",
  "melena",
  "milk",
  "motrin",
  "murmur",
  "narcan",
  "nausea",
  "nitro",
  "oxygen",
  "pallor",
  "plavix",
  "saline",
  "sepsis",
  "septic",
  "snack",
  "splint",
  "sputum",
  "sterile",
  "steroid",
  "stridor",
  "suction",
  "swallow",
  "syringe",
  "syrup",
  "tachypnea",
  "thyroid",
  "toast",
  "tremor",
  "tylenol",
  "valium",
  "versed",
  "vomit",
  "warfarin",
  "wheeze",
  "xanax",
  "airborne",
  "cider",
  "crutch",
  "isolate",
  "lanoxin",
  "monitor",
  "nadolol",
  "negative",
  "paddles",
  "punch",
  "sotalol",
  "standard",
  "supine",
  "volume",
] as const;

let words: Set<string> | null = null;

function list(): Set<string> {
  if (words) return words;
  const next = new Set<string>();
  for (const word of english as string[]) {
    if (/^[a-z]{5,8}$/.test(word)) next.add(word.toUpperCase());
  }
  for (const word of CLINICAL) {
    if (/^[a-z]{5,8}$/.test(word)) next.add(word.toUpperCase());
  }
  for (const puzzle of puzzles.puzzles) {
    next.add(puzzle.word.toUpperCase());
  }
  words = next;
  return next;
}

export function isAllowedWord(guess: string): boolean {
  return list().has(guess.toUpperCase());
}

export function lexiconSize(): number {
  return list().size;
}
