import { randomBytes } from "node:crypto";
import type { MpjePracticeExamQuestion } from "./practice-exam-config";

type CachedExam = {
  stateCode: string;
  userId: string;
  questions: MpjePracticeExamQuestion[];
  expiresAt: number;
};

const TTL_MS = 3 * 60 * 60 * 1000;

type GlobalCache = typeof globalThis & {
  mpjeExamCache?: Map<string, CachedExam>;
};

function getCache(): Map<string, CachedExam> {
  const g = globalThis as GlobalCache;
  if (!g.mpjeExamCache) g.mpjeExamCache = new Map();
  return g.mpjeExamCache;
}

function prune(cache: Map<string, CachedExam>) {
  const now = Date.now();
  for (const [id, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(id);
  }
}

export function createMpjeExamSession(
  userId: string,
  stateCode: string,
  questions: MpjePracticeExamQuestion[]
): string {
  const cache = getCache();
  prune(cache);
  const examId = randomBytes(16).toString("base64url");
  cache.set(examId, {
    userId,
    stateCode,
    questions,
    expiresAt: Date.now() + TTL_MS,
  });
  return examId;
}

export function getMpjeExamSession(
  examId: string,
  userId: string
): CachedExam | null {
  const cache = getCache();
  const entry = cache.get(examId);
  if (!entry || entry.expiresAt <= Date.now() || entry.userId !== userId) {
    cache.delete(examId);
    return null;
  }
  return entry;
}

export function deleteMpjeExamSession(examId: string): void {
  getCache().delete(examId);
}
