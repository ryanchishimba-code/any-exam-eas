import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireDb } from "@/db";
import { crosswordProgress } from "@/db/schema";
import { respondDbUnavailable } from "@/lib/api-db-error";
import type { CrosswordGameSave, CrosswordStore } from "@/lib/crossword/browser-store";
import { CROSSWORD_BOARDS, isCrosswordBoard } from "@/lib/crossword/boards";
import { gamesByBoard, mergeCrosswordStores, sanitizeCrosswordStore } from "@/lib/crossword/merge-progress";
import { todayIsoCentral } from "@/lib/crossword/schedule";
import { withDrizzle } from "@/lib/db-resilience";
import { createId } from "@/lib/id";

export const runtime = "nodejs";

const MAX_BODY = 150_000;

/**
 * Merge this browser's crossword streak and grids into the signed-in account.
 * Missing table (migration not applied yet) returns synced:false so play stays
 * on localStorage and never 500s the page that called it.
 */
export async function PUT(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ synced: false }, { status: 401 });

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return NextResponse.json({ synced: false }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ synced: false }, { status: 400 });
  }

  try {
    const local = sanitizeCrosswordStore(body);
    const store = await withDrizzle("crossword.progress.merge", () => mergeAccountProgress(userId, local));
    return NextResponse.json({ synced: true, store });
  } catch (error) {
    if (isMissingProgressTable(error)) return NextResponse.json({ synced: false });
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/crossword/progress] merge failed:", error);
    return NextResponse.json({ synced: false }, { status: 500 });
  }
}

async function mergeAccountProgress(userId: string, local: CrosswordStore): Promise<CrosswordStore> {
  const db = requireDb();
  const rows = await db
    .select()
    .from(crosswordProgress)
    .where(eq(crosswordProgress.userId, userId));
  const remote = rowsToStore(rows);
  const merged = mergeCrosswordStores(local, remote, todayIsoCentral());
  const now = new Date();
  for (const board of CROSSWORD_BOARDS) {
    const streak = merged.streaks[board];
    const games = gamesByBoard(merged, board);
    if (!streak && Object.keys(games).length === 0) continue;
    await db
      .insert(crosswordProgress)
      .values({
        id: createId(),
        userId,
        board,
        lastDate: streak?.last ?? null,
        streak: streak?.streak ?? 0,
        games,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [crosswordProgress.userId, crosswordProgress.board],
        set: {
          lastDate: streak?.last ?? null,
          streak: streak?.streak ?? 0,
          games,
          updatedAt: now,
        },
      });
  }
  return merged;
}

function rowsToStore(
  rows: {
    board: string;
    lastDate: string | null;
    streak: number;
    games: unknown;
  }[],
): CrosswordStore {
  const streaks: CrosswordStore["streaks"] = {};
  const games: CrosswordStore["games"] = {};
  for (const row of rows) {
    if (!isCrosswordBoard(row.board)) continue;
    if (row.lastDate && row.streak > 0) streaks[row.board] = { last: row.lastDate, streak: row.streak };
    if (!row.games || typeof row.games !== "object") continue;
    for (const [date, game] of Object.entries(row.games as Record<string, CrosswordGameSave>)) {
      games[`${row.board}:${date}`] = game;
    }
  }
  return sanitizeCrosswordStore({ streaks, games });
}

function isMissingProgressTable(error: unknown): boolean {
  const parts = [error instanceof Error ? error.message : String(error)];
  if (error && typeof error === "object" && "cause" in error) parts.push(String(error.cause));
  return /CrosswordProgress|42P01/i.test(parts.join(" "));
}
