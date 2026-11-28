import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/crossword/og-card";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <OgCard
        kicker="FREE DAILY CROSSWORD"
        title="Nursing, pharmacy, and more"
        footer="A new puzzle at midnight, America/Chicago. Not a promise you'll pass."
      />
    ),
    size,
  );
}
