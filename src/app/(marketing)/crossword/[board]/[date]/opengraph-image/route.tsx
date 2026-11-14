import { ImageResponse } from "next/og";
import { isCrosswordBoard, boardProfile } from "@/lib/crossword/boards";
import { puzzleForDate } from "@/lib/crossword/bank";
import { OgCard, maskFromGrid } from "@/lib/crossword/og-card";
import { formatCrosswordDate, parseCrosswordDate } from "@/lib/crossword/schedule";

const size = { width: 1200, height: 630 };

type Params = { params: Promise<{ board: string; date: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { board, date } = await params;
  if (!isCrosswordBoard(board) || !parseCrosswordDate(date)) {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const puzzle = puzzleForDate(board, date);
  if (!puzzle) {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const profile = boardProfile(board);
  return new ImageResponse(
    (
      <OgCard
        kicker="FREE DAILY CROSSWORD"
        title={profile.titleName}
        footer={`${formatCrosswordDate(date)} · ${profile.spokenName} · Spoiler-free`}
        cells={maskFromGrid(puzzle.grid)}
      />
    ),
    {
      ...size,
      headers: { "Cache-Control": "public, max-age=86400" },
    },
  );
}
