/**
 * High-Yield Topics and Library are retired on every board.
 * Old URLs 308 to that board's study hub (`/dashboard?exam=`).
 */

export const RETIRED_STUDY_BOARDS = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type RetiredStudyBoard = (typeof RETIRED_STUDY_BOARDS)[number];

const RETIRED_SOURCES = ["/library", "/dashboard/topics", "/study-hub/topics"] as const;

export function isRetiredStudyBoard(value: string): value is RetiredStudyBoard {
  return (RETIRED_STUDY_BOARDS as readonly string[]).includes(value);
}

/** Study hub for a board. The exam query keeps the old link's board when we know it. */
export function boardStudyToolsPath(exam?: string | null): string {
  if (exam && isRetiredStudyBoard(exam)) {
    return `/dashboard?exam=${encodeURIComponent(exam)}`;
  }
  return "/dashboard";
}

export type RetiredStudyRedirect = {
  source: string;
  destination: string;
  statusCode: 308;
  has?: Array<{ type: "query"; key: string; value: string }>;
};

export function retiredStudyRedirects(): RetiredStudyRedirect[] {
  const rules: RetiredStudyRedirect[] = [];
  for (const source of RETIRED_SOURCES) {
    for (const exam of RETIRED_STUDY_BOARDS) {
      rules.push({
        source,
        has: [{ type: "query", key: "exam", value: exam }],
        destination: boardStudyToolsPath(exam),
        statusCode: 308,
      });
    }
    rules.push({
      source,
      destination: "/dashboard",
      statusCode: 308,
    });
    rules.push({
      source: `${source}/:path*`,
      destination: "/dashboard",
      statusCode: 308,
    });
  }
  return rules;
}
