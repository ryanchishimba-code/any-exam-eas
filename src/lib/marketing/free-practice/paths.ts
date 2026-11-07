export const FREE_PRACTICE_PATH = "/free-practice-questions";

export const FREE_PRACTICE_BOARDS = [
  { slug: "nclex", label: "NCLEX", href: "/nclex", prepLabel: "NCLEX prep", h2: "Free NCLEX practice questions" },
  { slug: "naplex", label: "NAPLEX", href: "/naplex", prepLabel: "NAPLEX prep", h2: "Free NAPLEX practice questions" },
  { slug: "pance", label: "PANCE", href: "/pance", prepLabel: "PANCE prep", h2: "Free PANCE practice questions" },
  { slug: "aanp-fnp", label: "AANP FNP", href: "/aanp-fnp", prepLabel: "AANP FNP prep", h2: "Free AANP FNP practice questions" },
  { slug: "usmle", label: "USMLE", href: "/usmle", prepLabel: "USMLE prep", h2: "Free USMLE practice questions" },
  { slug: "npte-pt", label: "NPTE-PT", href: "/npte-pt", prepLabel: "NPTE-PT prep", h2: "Free NPTE-PT practice questions" },
] as const;

export type FreePracticeBoardSlug = (typeof FREE_PRACTICE_BOARDS)[number]["slug"];

export function freePracticeHref(slug?: FreePracticeBoardSlug): string {
  return slug ? `${FREE_PRACTICE_PATH}#${slug}` : FREE_PRACTICE_PATH;
}

export function isFreePracticeBoardSlug(value: string): value is FreePracticeBoardSlug {
  return FREE_PRACTICE_BOARDS.some((board) => board.slug === value);
}
