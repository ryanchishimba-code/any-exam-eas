import { describe, expect, it } from "vitest";
import {
  USMLE_VIDEO_QUICK_BITE_EPISODES,
  rememberedUsmleVideoStep,
  usmleVideoEpisodesForStep,
  usmleVideoStepFromQuery,
  usmleVideoStepHref,
} from "@/lib/quick-bites/usmle-video-catalog";

describe("USMLE video steps", () => {
  it("tags every episode and leaves Step 3 empty", () => {
    expect(USMLE_VIDEO_QUICK_BITE_EPISODES.every((episode) => episode.examStep)).toBe(true);
    expect(usmleVideoEpisodesForStep("step-1").map((episode) => episode.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17,
    ]);
    expect(usmleVideoEpisodesForStep("step-2-ck").map((episode) => episode.slug)).toEqual([
      "quick-bites-usmle-ep16-poisons-fat-embolus",
      "quick-bites-usmle-ep18-consent-decisions",
      "quick-bites-usmle-ep19-minutes-in-the-head",
      "quick-bites-usmle-ep20-acs-afib",
    ]);
    expect(usmleVideoEpisodesForStep("step-3")).toEqual([]);
  });

  it("reads the step query and remembers a saved choice", () => {
    expect(usmleVideoStepFromQuery(undefined)).toBeNull();
    expect(usmleVideoStepFromQuery("2ck")).toBe("step-2-ck");
    expect(usmleVideoStepFromQuery("3")).toBe("step-3");
    expect(usmleVideoStepHref("step-1")).toBe("/usmle/quick-bites");
    expect(usmleVideoStepHref("step-2-ck")).toBe("/usmle/quick-bites?step=2ck");
    expect(rememberedUsmleVideoStep("step-3")).toBe("step-3");
    expect(rememberedUsmleVideoStep("nope")).toBe("step-1");
  });
});
