import type { CrosswordGameSave } from "@/lib/crossword/browser-store";

/**
 * A share or challenge link never seeds the grid. Query and hash are accepted
 * so callers have to pass the location, and then discard it.
 */
export function gameToOpen(
  existing: CrosswordGameSave | undefined,
  locationSearch = "",
): CrosswordGameSave | null {
  void locationSearch;
  if (!hasOwnProgress(existing)) return null;
  return {
    fills: { ...existing.fills },
    hints: { ...existing.hints },
    elapsed: existing.elapsed,
    started: existing.started,
    complete: existing.complete,
    hinted: existing.hinted,
  };
}

export function hasOwnProgress(game: CrosswordGameSave | undefined): game is CrosswordGameSave {
  if (!game) return false;
  if (game.complete || game.started || game.elapsed > 0 || game.hinted) return true;
  if (Object.keys(game.fills).length > 0) return true;
  if (Object.keys(game.hints).length > 0) return true;
  return false;
}

/** An empty arrival must not wipe a grid this browser already has. */
export function canReplaceSavedGame(
  previous: CrosswordGameSave | undefined,
  next: CrosswordGameSave,
): boolean {
  if (!hasOwnProgress(previous)) return true;
  return hasOwnProgress(next);
}

const PROGRESS_PARAM =
  /^(fills?|answers?|complete|completed|hints?|revealed|reveal|elapsed|letters|grid|cells|state|solved|streak)$/i;

/** True when a link tries to carry a grid, a reveal, or a finished solve. */
export function shareLocationSeedsGrid(search: string): boolean {
  const raw = search.startsWith("#") ? search.slice(1) : search.replace(/^\?/, "");
  const params = new URLSearchParams(raw);
  for (const key of params.keys()) {
    if (PROGRESS_PARAM.test(key)) return true;
  }
  return false;
}
