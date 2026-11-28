import { describe, expect, it } from "vitest";
import {
  USMLE_VIDEO_QUICK_BITE_EPISODES,
  rememberedUsmleVideoStep,
  usmleVideoEpisodesForStep,
  usmleVideoStepFromQuery,
  usmleVideoStepHref,
} from "@/lib/quick-bites/usmle-video-catalog";

describe("USMLE video steps", () => {
  it("tags every episode, including Step 3", () => {
    expect(USMLE_VIDEO_QUICK_BITE_EPISODES).toHaveLength(53);
    expect(USMLE_VIDEO_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true)).toHaveLength(53);
    expect(USMLE_VIDEO_QUICK_BITE_EPISODES.every((episode) => episode.examStep)).toBe(true);
    expect(usmleVideoEpisodesForStep("step-1")).toHaveLength(18);
    expect(usmleVideoEpisodesForStep("step-2-ck")).toHaveLength(18);
    expect(usmleVideoEpisodesForStep("step-3").map((episode) => episode.number)).toEqual([
      23, 28, 29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    ]);
    expect(usmleVideoEpisodesForStep("step-1").map((episode) => episode.number)).toContain(21);
    expect(usmleVideoEpisodesForStep("step-1").map((episode) => episode.number)).toContain(22);
    expect(usmleVideoEpisodesForStep("step-2-ck").map((episode) => episode.number)).toEqual(
      expect.arrayContaining([16, 18, 19, 20, 24, 25, 26, 27, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40])
    );
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
