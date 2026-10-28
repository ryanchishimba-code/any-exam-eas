import { describe, expect, it } from "vitest";
import { adjacentPlayableEpisode } from "@/lib/quick-bites/adjacent-playable";
import {
  OPEN_QUICK_BITE_SLUG,
  QUICK_BITE_EPISODES,
  isQuickBiteEpisodePlayable,
} from "@/lib/quick-bites/catalog";

describe("adjacentPlayableEpisode", () => {
  const playable = (canPlayLibrary: boolean) => (episode: (typeof QUICK_BITE_EPISODES)[number]) =>
    isQuickBiteEpisodePlayable(episode, canPlayLibrary);

  it("returns the next playable episode in order", () => {
    expect(
      adjacentPlayableEpisode(
        QUICK_BITE_EPISODES,
        OPEN_QUICK_BITE_SLUG,
        "next",
        playable(true)
      )?.slug
    ).toBe("quick-bites-ep03-priority");
  });

  it("returns the previous playable episode in order", () => {
    expect(
      adjacentPlayableEpisode(
        QUICK_BITE_EPISODES,
        "quick-bites-ep03-priority",
        "previous",
        playable(true)
      )?.slug
    ).toBe(OPEN_QUICK_BITE_SLUG);
  });

  it("returns null for previous on the first playable episode", () => {
    expect(
      adjacentPlayableEpisode(QUICK_BITE_EPISODES, OPEN_QUICK_BITE_SLUG, "previous", playable(true))
    ).toBeNull();
  });

  it("returns null for next on the last playable episode", () => {
    expect(
      adjacentPlayableEpisode(
        QUICK_BITE_EPISODES,
        "quick-bites-bonus-labs-examday",
        "next",
        playable(true)
      )
    ).toBeNull();
  });

  it("respects library access when finding neighbors", () => {
    expect(
      adjacentPlayableEpisode(QUICK_BITE_EPISODES, OPEN_QUICK_BITE_SLUG, "next", playable(false))
    ).toBeNull();
  });
});
