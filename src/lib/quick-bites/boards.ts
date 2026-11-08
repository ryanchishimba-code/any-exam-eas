/**
 * One Quick Bites library per board. Routes, nav labels, and the old
 * dashboard anchors live here so a new page cannot drift from the sidebar.
 * The free episode for each board stays in that board's catalog.
 */

export type QuickBiteSeriesId = "nursing" | "pharmacy" | "fnp" | "pance";

export type QuickBiteExam = "nclex" | "naplex" | "aanp-fnp" | "pance";

export type QuickBiteBoard = {
  exam: QuickBiteExam;
  series: QuickBiteSeriesId;
  route: string;
  navId: string;
  navLabel: string;
  /** Anchor the dashboard used before Quick Bites had its own page. */
  legacyHash: string;
};

export const QUICK_BITE_BOARDS: Record<QuickBiteExam, QuickBiteBoard> = {
  nclex: {
    exam: "nclex",
    series: "nursing",
    route: "/nclex/quick-bites",
    navId: "quick-bites",
    navLabel: "Video Quick Bites",
    legacyHash: "video-quick-bites",
  },
  naplex: {
    exam: "naplex",
    series: "pharmacy",
    route: "/naplex/quick-bites",
    navId: "quick-bites-pharmacy",
    navLabel: "Quick Bites: Pharmacy",
    legacyHash: "video-quick-bites-pharmacy",
  },
  "aanp-fnp": {
    exam: "aanp-fnp",
    series: "fnp",
    route: "/aanp-fnp/quick-bites",
    navId: "quick-bites-fnp",
    navLabel: "Quick Bites: FNP",
    legacyHash: "video-quick-bites-fnp",
  },
  pance: {
    exam: "pance",
    series: "pance",
    route: "/pance/quick-bites",
    navId: "quick-bites-pance",
    navLabel: "Quick Bites: PANCE",
    legacyHash: "video-quick-bites-pance",
  },
};

export const QUICK_BITE_EXAMS = Object.keys(QUICK_BITE_BOARDS) as QuickBiteExam[];

export function quickBiteBoardForExam(exam: string | null | undefined): QuickBiteBoard | null {
  if (!exam || !(exam in QUICK_BITE_BOARDS)) return null;
  return QUICK_BITE_BOARDS[exam as QuickBiteExam];
}

export function quickBiteRouteBases(): string[] {
  return QUICK_BITE_EXAMS.map((exam) => QUICK_BITE_BOARDS[exam].route);
}

export function isQuickBitePath(path: string): boolean {
  const pathname = (path.split("?")[0] ?? path).replace(/\/$/, "") || "/";
  return quickBiteRouteBases().some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/** Old `/dashboard#video-quick-bites…` links land on the matching page. */
export function quickBiteRouteForLegacyHash(hash: string): string | null {
  const id = hash.replace(/^#/, "");
  if (!id) return null;
  return QUICK_BITE_EXAMS.map((exam) => QUICK_BITE_BOARDS[exam]).find(
    (board) => board.legacyHash === id
  )?.route ?? null;
}
