import { isCrosswordBoard } from "@/lib/crossword/boards";
import { toKey } from "@/lib/crossword/bank";

type Params = { params: Promise<{ board: string; date: string }> };

/** Public answer key for check/reveal. Not indexed. No database. */
export async function GET(_request: Request, { params }: Params) {
  const { board, date } = await params;
  if (!isCrosswordBoard(board)) {
    return Response.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const key = toKey(board, date);
  if (!key) {
    return Response.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(key, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
