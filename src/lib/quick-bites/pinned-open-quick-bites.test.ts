import { describe, expect, it } from "vitest";
import { buildHubLandingModel } from "@/lib/marketing/board-landing/hub-model";
import { openBoardQuickBite } from "@/lib/marketing/board-landing/model";
import { homeQuickBiteSamples } from "@/lib/marketing/home-quick-bites";
import { boardQuestionUnits } from "@/lib/counts";
import {
  OPEN_QUICK_BITE_SLUG,
  QUICK_BITE_EPISODES,
  getQuickBiteBySlug,
  isOpenQuickBite,
} from "@/lib/quick-bites/catalog";
import {
  FNP_QUICK_BITE_EPISODES,
  OPEN_FNP_QUICK_BITE_SLUG,
  getFnpQuickBiteBySlug,
  isOpenFnpQuickBite,
} from "@/lib/quick-bites/fnp-catalog";
import {
  OPEN_PANCE_QUICK_BITE_SLUG,
  PANCE_QUICK_BITE_EPISODES,
  getPanceQuickBiteBySlug,
  isOpenPanceQuickBite,
} from "@/lib/quick-bites/pance-catalog";
import {
  OPEN_PHARMACY_QUICK_BITE_SLUG,
  PHARMACY_QUICK_BITE_EPISODES,
  getPharmacyQuickBiteBySlug,
  isOpenPharmacyQuickBite,
} from "@/lib/quick-bites/pharmacy-catalog";
import {
  PINNED_OPEN_QUICK_BITES,
  type QuickBiteBoardTrack,
  boardTrackHasOwnQuickBiteLibrary,
  pinnedEpisodeInOwnCatalog,
} from "@/lib/quick-bites/pinned-open-quick-bites";

/** Canonical free-sample slugs. Selection must never use list order, dates, or user state. */
const PINNED = {
  nursing: OPEN_QUICK_BITE_SLUG,
  pharmacy: OPEN_PHARMACY_QUICK_BITE_SLUG,
  fnp: OPEN_FNP_QUICK_BITE_SLUG,
  pance: OPEN_PANCE_QUICK_BITE_SLUG,
} as const;

const BOARD_PAGES: {
  board: string;
  track: QuickBiteBoardTrack;
  hubExamKey?: "pance" | "aanp-fnp" | "usmle" | "npte-pt";
}[] = [
  { board: "NCLEX", track: "nursing" },
  { board: "NAPLEX", track: "pharmacy" },
  { board: "PANCE", track: "pance", hubExamKey: "pance" },
  { board: "AANP FNP", track: "fnp", hubExamKey: "aanp-fnp" },
];

function assertSlugOnlyInOwnCatalog(track: QuickBiteBoardTrack, slug: string) {
  const inNursing = getQuickBiteBySlug(slug);
  const inPharmacy = getPharmacyQuickBiteBySlug(slug);
  const inFnp = getFnpQuickBiteBySlug(slug);
  const inPance = getPanceQuickBiteBySlug(slug);

  const hits = {
    nursing: Boolean(inNursing),
    pharmacy: Boolean(inPharmacy),
    fnp: Boolean(inFnp),
    pance: Boolean(inPance),
  };

  expect(hits[track], `${slug} must exist in ${track} catalog`).toBe(true);
  for (const other of Object.keys(hits) as QuickBiteBoardTrack[]) {
    if (other === track) continue;
    expect(hits[other], `${slug} must not resolve in ${other} catalog`).toBe(false);
  }
}

function openSlugsForTrack(track: keyof typeof PINNED, passes: number): string[] {
  const slugs: string[] = [];
  for (let i = 0; i < passes; i += 1) {
    slugs.push(openBoardQuickBite(track)!.slug);
  }
  return slugs;
}

describe("pinned open Quick Bite samples", () => {
  it("keeps one explicit slug per board (not catalog position)", () => {
    expect(PINNED).toEqual({
      nursing: "quick-bites-ep02-nclex-works",
      pharmacy: "quick-bites-pharm-ep01-anticoagulants",
      fnp: "quick-bites-fnp-ep03-diabetes",
      pance: "quick-bites-pance-ep01-coronary-failure-shock",
    });

    expect(QUICK_BITE_EPISODES.filter((episode) => isOpenQuickBite(episode.slug))).toEqual([
      expect.objectContaining({ slug: PINNED.nursing }),
    ]);
    expect(PHARMACY_QUICK_BITE_EPISODES.filter((episode) => isOpenPharmacyQuickBite(episode.slug))).toEqual([
      expect.objectContaining({ slug: PINNED.pharmacy }),
    ]);
    expect(FNP_QUICK_BITE_EPISODES.filter((episode) => isOpenFnpQuickBite(episode.slug))).toEqual([
      expect.objectContaining({ slug: PINNED.fnp }),
    ]);
    expect(PANCE_QUICK_BITE_EPISODES.filter((episode) => isOpenPanceQuickBite(episode.slug))).toEqual([
      expect.objectContaining({ slug: PINNED.pance }),
    ]);

    // FNP trial sample is ep03, not the first row in the catalog.
    expect(FNP_QUICK_BITE_EPISODES[0]!.slug).not.toBe(PINNED.fnp);
  });

  it("returns the same landing sample slug on every call (reload/session-stable)", () => {
    for (const track of Object.keys(PINNED) as (keyof typeof PINNED)[]) {
      const slugs = openSlugsForTrack(track, 48);
      expect(new Set(slugs)).toEqual(new Set([PINNED[track]]));
    }
  });

  it("matches home NCLEX/NAPLEX samples to the same pinned slugs", () => {
    const samples = homeQuickBiteSamples();
    expect(samples.map((sample) => sample.slug)).toEqual([PINNED.nursing, PINNED.pharmacy]);
    for (let i = 0; i < 24; i += 1) {
      const again = homeQuickBiteSamples();
      expect(again.map((sample) => sample.slug)).toEqual([PINNED.nursing, PINNED.pharmacy]);
    }
  });

  it("uses the pinned slug for hub landings (PANCE and AANP FNP)", () => {
    expect(openBoardQuickBite("pance")?.slug).toBe(PINNED.pance);
    expect(openBoardQuickBite("fnp")?.slug).toBe(PINNED.fnp);
    const panceRuns = openSlugsForTrack("pance", 32);
    const fnpRuns = openSlugsForTrack("fnp", 32);
    expect(panceRuns.every((slug) => slug === PINNED.pance)).toBe(true);
    expect(fnpRuns.every((slug) => slug === PINNED.fnp)).toBe(true);
  });

  it("pins each board landing sample to its own series (no cross-board fallback)", () => {
    for (const { board, track, hubExamKey } of BOARD_PAGES) {
      expect(boardTrackHasOwnQuickBiteLibrary(track), `${board} must have its own library`).toBe(
        true
      );
      const pinned = PINNED_OPEN_QUICK_BITES[track];
      expect(pinnedEpisodeInOwnCatalog(track)?.slug).toBe(pinned.slug);

      const bite = openBoardQuickBite(track);
      expect(bite, `${board} landing sample`).not.toBeNull();
      expect(bite!.track).toBe(track);
      expect(bite!.slug).toBe(pinned.slug);
      expect(bite!.mediaUrl).toBe(`${pinned.mediaApiBase}/${pinned.slug}/media`);

      assertSlugOnlyInOwnCatalog(track, bite!.slug);

      if (hubExamKey === "pance" || hubExamKey === "aanp-fnp") {
        const hub = buildHubLandingModel({
          examKey: hubExamKey,
          degraded: false,
          units: boardQuestionUnits({
            slug: hubExamKey,
            bankItems: 100,
            formats: { mcq: 100, ngn: 0, case: 0 },
          }),
        });
        expect(hub.quickBite?.track).toBe(track);
        expect(hub.quickBite?.slug).toBe(pinned.slug);
        expect(hub.quickBite?.mediaUrl).toBe(`${pinned.mediaApiBase}/${pinned.slug}/media`);
      }
    }

    const usmle = buildHubLandingModel({
      examKey: "usmle",
      degraded: false,
      units: boardQuestionUnits({
        slug: "usmle",
        bankItems: 100,
        formats: { mcq: 100, ngn: 0, case: 0 },
      }),
    });
    expect(usmle.quickBite).toBeNull();
  });
});
