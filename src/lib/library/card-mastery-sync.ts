import type { ExamSlug } from "@/types/edtech";
import type { CardMasteryStatus } from "./card-mastery";

export type MasteryEntry = {
  status: CardMasteryStatus;
  updatedAt: string;
};

export type MasteryStore = Record<string, MasteryEntry>;

/** Merge two mastery stores — latest `updatedAt` wins per card. */
export function mergeMasteryStores(a: MasteryStore, b: MasteryStore): MasteryStore {
  const merged: MasteryStore = { ...a };
  for (const [cardId, entry] of Object.entries(b)) {
    const existing = merged[cardId];
    if (!existing || entry.updatedAt > existing.updatedAt) {
      merged[cardId] = entry;
    }
  }
  return merged;
}

export function masteryStoreFromDtos(
  rows: Array<{ cardId: string; status: CardMasteryStatus; updatedAt: string }>
): MasteryStore {
  const store: MasteryStore = {};
  for (const row of rows) {
    store[row.cardId] = { status: row.status, updatedAt: row.updatedAt };
  }
  return store;
}

export function masteryDtosFromStore(store: MasteryStore): Array<{
  cardId: string;
  status: CardMasteryStatus;
  updatedAt: string;
}> {
  return Object.entries(store).map(([cardId, entry]) => ({
    cardId,
    status: entry.status,
    updatedAt: entry.updatedAt,
  }));
}

/** Entries in `local` that are newer than server (or missing on server). */
export function findLocalMasteryDeltas(
  local: MasteryStore,
  server: MasteryStore
): Array<{ cardId: string; status: CardMasteryStatus; updatedAt: string }> {
  const deltas: Array<{ cardId: string; status: CardMasteryStatus; updatedAt: string }> = [];
  for (const [cardId, entry] of Object.entries(local)) {
    const remote = server[cardId];
    if (!remote || entry.updatedAt > remote.updatedAt) {
      deltas.push({ cardId, status: entry.status, updatedAt: entry.updatedAt });
    }
  }
  return deltas;
}

export type SyncMasteryOptions = {
  examSlug: ExamSlug;
  readLocal: (examSlug: ExamSlug) => MasteryStore;
  writeLocal: (examSlug: ExamSlug, store: MasteryStore) => void;
  onMerged?: (examSlug: ExamSlug) => void;
};

export async function syncCardMasteryForExam({
  examSlug,
  readLocal,
  writeLocal,
  onMerged,
}: SyncMasteryOptions): Promise<void> {
  const local = readLocal(examSlug);

  let res: Response;
  try {
    res = await fetch(`/api/library/mastery?exam=${encodeURIComponent(examSlug)}`);
  } catch {
    return;
  }
  if (!res.ok) return;

  const data = (await res.json()) as {
    mastery?: Array<{ cardId: string; status: CardMasteryStatus; updatedAt: string }>;
  };
  const server = masteryStoreFromDtos(data.mastery ?? []);
  const merged = mergeMasteryStores(local, server);
  writeLocal(examSlug, merged);
  onMerged?.(examSlug);

  const deltas = findLocalMasteryDeltas(local, server);
  if (deltas.length === 0) return;

  try {
    const pushRes = await fetch("/api/library/mastery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examSlug, entries: deltas }),
    });
    if (!pushRes.ok) return;
    const pushed = (await pushRes.json()) as {
      mastery?: Array<{ cardId: string; status: CardMasteryStatus; updatedAt: string }>;
    };
    writeLocal(examSlug, masteryStoreFromDtos(pushed.mastery ?? masteryDtosFromStore(merged)));
    onMerged?.(examSlug);
  } catch {
    /* offline — local merge is enough until next visit */
  }
}

export async function persistCardMasteryToServer(
  examSlug: ExamSlug,
  cardId: string,
  status: CardMasteryStatus
): Promise<void> {
  try {
    await fetch("/api/library/mastery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examSlug, cardId, status }),
    });
  } catch {
    /* local state already saved */
  }
}
