/**
 * Manuscripts and figure files copied into each public study-guide function.
 *
 * Regeneration calls `readdir` on these paths. The file tracer does not follow
 * the directory switch in `load-public-guide.ts`, so a function built from the
 * bundle alone throws ENOENT for `/var/task/content/<guide>`. NPTE has no
 * entry: that page builds its outline in code.
 *
 * `/usmle-study-guide` also matches the step route under picomatch `contains`.
 * The `[step]` key is listed so that function still gets the books if matching
 * is exact.
 */
const USMLE_TRACE = [
  "./content/usmle-study-guide/step-1/**/*",
  "./content/usmle-study-guide/step-2-ck/**/*",
  "./content/usmle-study-guide/step-3/**/*",
  "./public/usmle-study-guide/**/*",
];

const BOARD_TRACE = {
  "/nclex-study-guide": [
    "./content/nclex-study-guide/**/*",
    "./public/nclex-study-guide/visuals/**/*",
  ],
  "/naplex-study-guide": [
    "./content/naplex-study-guide/**/*",
    "./public/naplex-study-guide/visuals/**/*",
  ],
  "/pance-study-guide": [
    "./content/pance-study-guide/**/*",
    "./public/pance-study-guide/visuals/**/*",
  ],
  "/aanp-fnp-study-guide": [
    "./content/aanp-fnp-study-guide/**/*",
    "./public/aanp-fnp-study-guide/visuals/**/*",
  ],
} satisfies Record<string, string[]>;

/**
 * Manuscripts and figure files copied into each public study-guide function.
 *
 * Regeneration calls `readdir` on these paths. The file tracer does not follow
 * the directory switch in `load-public-guide.ts`, so a function built from the
 * bundle alone throws ENOENT for `/var/task/content/<guide>`. NPTE has no
 * entry: that page builds its outline in code.
 *
 * `/usmle-study-guide` also matches the step route under picomatch `contains`.
 * The `[step]` and `[chapter]` keys are listed so those functions still get the
 * books if matching is exact. The sitemap readdirs the same manuscripts when
 * it lists chapter URLs.
 */
export const STUDY_GUIDE_SERVER_FILES: Record<string, string[]> = {
  ...BOARD_TRACE,
  "/nclex-study-guide/[chapter]": [...BOARD_TRACE["/nclex-study-guide"]],
  "/naplex-study-guide/[chapter]": [...BOARD_TRACE["/naplex-study-guide"]],
  "/aanp-fnp-study-guide/[chapter]": [...BOARD_TRACE["/aanp-fnp-study-guide"]],
  "/usmle-study-guide": [...USMLE_TRACE],
  "/usmle-study-guide/[step]": [...USMLE_TRACE],
  "/usmle-study-guide/[step]/[chapter]": [...USMLE_TRACE],
  "/sitemap.xml": [
    "./content/nclex-study-guide/**/*",
    "./content/naplex-study-guide/**/*",
    "./content/pance-study-guide/**/*",
    "./content/aanp-fnp-study-guide/**/*",
    "./content/usmle-study-guide/step-1/**/*",
    "./content/usmle-study-guide/step-2-ck/**/*",
    "./content/usmle-study-guide/step-3/**/*",
  ],
  "/sitemap/[id]": [
    "./content/nclex-study-guide/**/*",
    "./content/naplex-study-guide/**/*",
    "./content/pance-study-guide/**/*",
    "./content/aanp-fnp-study-guide/**/*",
    "./content/usmle-study-guide/step-1/**/*",
    "./content/usmle-study-guide/step-2-ck/**/*",
    "./content/usmle-study-guide/step-3/**/*",
  ],
};
