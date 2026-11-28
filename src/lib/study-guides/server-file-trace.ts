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
export const STUDY_GUIDE_SERVER_FILES: Record<string, string[]> = {
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
  "/usmle-study-guide": [
    "./content/usmle-study-guide/step-1/**/*",
    "./content/usmle-study-guide/step-2-ck/**/*",
    "./content/usmle-study-guide/step-3/**/*",
    "./public/usmle-study-guide/**/*",
  ],
  "/usmle-study-guide/[step]": [
    "./content/usmle-study-guide/step-1/**/*",
    "./content/usmle-study-guide/step-2-ck/**/*",
    "./content/usmle-study-guide/step-3/**/*",
    "./public/usmle-study-guide/**/*",
  ],
};
