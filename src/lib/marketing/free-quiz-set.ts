import type { BoardMarketingSlug } from "@/lib/landing/tokens";

/**
 * Stable id echoed by GET `/api/marketing/free-quiz` and required by POST `/grade`.
 * The public set does not change by day.
 */
export const FREE_QUIZ_ROTATION_KEY = "fixed";

/**
 * One fixed public free-quiz set per board (see FREE_QUIZ_QUESTION_COUNT).
 * Chosen 2026-10-24 with read-only SELECTs: active, qaPassed, reviewStatus approved,
 * not student-eligibility suppressed, not retired, not on the hidden key-review list,
 * vignette (single-select), text-only (no image/exhibit), full scenario, keyed option match.
 */
export const FREE_QUIZ_QUESTION_IDS: Record<BoardMarketingSlug, readonly string[]> = {
  nclex: [
    "cmqwnb0v0000f1ynhuwd1l383",
    "cmroe7z5p000n1ybzgo9s7vkm",
    "cmr74893v00261ywu4ayv3ud5",
    "cmqwrppm0000e1yb3uj6pxhyp",
    "cmsex6zn700dp1y56nm4jipeu",
    "cmqwnb0il000b1ynh10vm3wha",
    "cmr0zcc6l004l1ybafd33aooz",
    "cmr7gipox00b81y596o0pulpa",
    "cmr7esdld00a11y9tpxmzd5x1",
    "cmr8pmdz8000t1yvfe4axf5ld",
  ],
  naplex: [
    "cmqvja7rw000k1yxk9s67i3r6",
    "cmqvjabbb001l1yxknd54q8p0",
    "cmqvk1kxu001q1yvdqgkjfcsz",
    "cmr81kr2m001k1yto7kl96n4x",
    "cmqw7d7hd001d1yfanxpg72cu",
    "cmroglomi00281yt07vx6enjb",
    "cmroh2kxv005l1yt0703xecu5",
    "cmqvja9zo00171yxkj22uu62s",
    "cmr0oxe0a001j1y8x88vslpqd",
    "cmra72a7k004r1ybj9kql64j9",
  ],
  usmle: [
    "cmr4mo9sj009t1y1eo3gubk02",
    "cmr88v6e000h91yw27dp8uvml",
    "cmrrv66a500oj1y8w856pot3z",
    "cmr8bg3hm010n1yw2phgk7n8u",
    "cmqxdesqt00b81ymag1dgdikg",
    "cmrrw4zqa00gt1yl8z0zvsqc6",
    "cmr86ycu300aw1yr9i0zogpdu",
    "cmtpwlg1s00181y6hhgqf2gjv",
    "cmr8cnatd00nz1ylo3wtx8tj7",
    "cmr8gr3av01tf1yloypgi8o2o",
  ],
  "aanp-fnp": [
    "cmqgtrmhz000r1yfggjknteny",
    "cmqgdxosl00021y26qk5sg5z5",
    "cmqgdxoja00001y26ag3943gb",
    "cmr8594go004k1y9ij1zwowwb",
    "cmtwfe7jw00691ysoamoorjy5",
    "cmr85949d004i1y9i2w6993m7",
    "cmtwfe7c100671ysomuvb8o7i",
    "cmtwfe6zt00641ysobejsfwy7",
    "cmr8592vl00421y9i1qykw0z7",
    "cmtwfe79a00661yso0gp9fd12",
  ],
  pance: [
    "cmqgdhw0r00051yr8ap2l03oh",
    "cmqgdhvhz00001yr8ngjgwd40",
    "cmqgdhvxc00041yr8s7oufad9",
    "cmqgdhvtz00031yr8h4h10sk0",
    "cmqgdhwbs00071yr8qoy6lnzn",
    "cmr81xawt00201y54uv1jm836",
    "cmqwulj3b00351yze9r3a1fgf",
    "cmqwulmh8003t1yze2j6gk2kz",
    "cmqwuu4bc00el1yzeqgb100ns",
    "cmqwbirjc00941yuzcmeeermm",
  ],
  "npte-pt": [
    "cmqhlr0jj0000jm0444az9m14",
    "cmqhlr0kb0001jm047rcpye4g",
    "cmqhlr0mu000ajm04auoxozij",
    "cmqhlr0rr000tjm04rk6jt20s",
    "cmqhlr0zm001qjm04jxwdybth",
    "cmqhlr0sz000yjm04duaxwqdf",
    "cmqhlr0po000ljm04w6aajaw6",
    "cmqhlr0kn0002jm04cyrr6dmt",
    "cmqhlr0mb0008jm04f40oa0wn",
    "cmqhlr0ll0005jm04627fibyw",
  ],
};
