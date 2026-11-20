import {
  loadCrosswordStore,
  saveCrosswordStore,
  type CrosswordStore,
} from "@/lib/crossword/browser-store";

/**
 * Send this device's crossword store to the signed-in account and keep the
 * merged copy. A failure leaves localStorage alone so play never blocks on
 * the database. If the player keeps solving during the request, the response
 * is dropped instead of overwriting newer letters.
 */
export async function syncCrosswordProgress(timeoutMs = 2500): Promise<CrosswordStore | null> {
  if (typeof window === "undefined") return null;
  try {
    const sent = loadCrosswordStore();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch("/api/crossword/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sent),
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!response.ok) return null;
    const data = (await response.json()) as { synced?: boolean; store?: CrosswordStore };
    if (!data.synced || !data.store) return null;
    if (JSON.stringify(loadCrosswordStore()) !== JSON.stringify(sent)) return null;
    saveCrosswordStore(data.store);
    return data.store;
  } catch {
    return null;
  }
}
