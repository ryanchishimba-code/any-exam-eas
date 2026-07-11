"use client";

const RELOAD_KEY = "aee_chunk_reload";

export function isStaleChunkError(message: string) {
  return (
    /Loading chunk \d+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Cannot read properties of undefined \(reading 'call'\)/i.test(message) ||
    /ChunkLoadError/i.test(message)
  );
}

/** Clear SW + Cache Storage so a reload cannot keep serving dead Webpack chunks. */
export async function clearStaleClientCaches(): Promise<void> {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    /* private mode */
  }

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    /* ignore */
  }

  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
  } catch {
    /* ignore */
  }
}

export async function hardReloadAfterStaleChunk(): Promise<void> {
  await clearStaleClientCaches();
  const url = new URL(window.location.href);
  url.searchParams.set("_aee_r", String(Date.now()));
  window.location.replace(url.toString());
}

export { RELOAD_KEY };
