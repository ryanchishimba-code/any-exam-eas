import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import { FNP_QUICK_BITE_EPISODES } from "@/lib/quick-bites/fnp-catalog";
import { PANCE_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pance-catalog";
import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";

/** Nursing episodes render on the NCLEX section only; pharmacy episodes on the NAPLEX section only. */
describe("Quick Bites series separation (rendered)", () => {
  it("the NCLEX section lists every nursing episode and no pharmacy episode, all locked when not paid", () => {
    const { container } = render(
      <VideoQuickBitesSection canPlay={false} upgradeHref="/checkout" upgradeLabel="Subscribe to watch" />
    );
    for (const episode of QUICK_BITE_EPISODES) {
      expect(screen.getByText(episode.title)).toBeInTheDocument();
    }
    const nursingTitles = new Set(QUICK_BITE_EPISODES.map((episode) => episode.title));
    for (const episode of PHARMACY_QUICK_BITE_EPISODES.filter((pharm) => !nursingTitles.has(pharm.title))) {
      expect(screen.queryByText(episode.title)).not.toBeInTheDocument();
    }
    expect(container.innerHTML).not.toContain("quick-bites-pharm-");
    expect(container.innerHTML).not.toContain("/quick-bites-pharmacy/");
    // Only episode 1 is open to signed-in members; every other card, including 17-25, is locked.
    expect(screen.getAllByText("Locked")).toHaveLength(QUICK_BITE_EPISODES.length - 1);
  });

  it("the NAPLEX section lists every pharmacy episode and locks every episode except the sample", () => {
    const { container } = render(
      <VideoQuickBitesSection
        series="pharmacy"
        canPlay={false}
        upgradeHref="/checkout"
        upgradeLabel="Subscribe to watch"
      />
    );
    const nursingOnly = QUICK_BITE_EPISODES.filter(
      (episode) => !PHARMACY_QUICK_BITE_EPISODES.some((pharm) => pharm.title === episode.title)
    );
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(screen.getByText(episode.title)).toBeInTheDocument();
    }
    for (const episode of nursingOnly) {
      expect(screen.queryByText(episode.title)).not.toBeInTheDocument();
    }
    expect(container.innerHTML).not.toMatch(/\/quick-bites\/quick-bites-(?!pharm-)/);
    expect(screen.getAllByText("Locked")).toHaveLength(PHARMACY_QUICK_BITE_EPISODES.length - 1);
  });

  it("the AANP-FNP section lists every FNP episode and locks all when not paid", () => {
    const { container } = render(
      <VideoQuickBitesSection
        series="fnp"
        canPlay={false}
        upgradeHref="/checkout"
        upgradeLabel="Subscribe to watch"
      />
    );
    for (const episode of FNP_QUICK_BITE_EPISODES) {
      expect(screen.getByText(episode.title)).toBeInTheDocument();
    }
    expect(container.innerHTML).not.toContain("quick-bites-pharm-");
    expect(container.innerHTML).not.toContain("quick-bites-pance-");
    expect(screen.getAllByText("Locked")).toHaveLength(FNP_QUICK_BITE_EPISODES.length - 1);
  });

  it("the PANCE section lists every PANCE episode and locks all when not paid", () => {
    const { container } = render(
      <VideoQuickBitesSection
        series="pance"
        canPlay={false}
        upgradeHref="/checkout"
        upgradeLabel="Subscribe to watch"
      />
    );
    for (const episode of PANCE_QUICK_BITE_EPISODES) {
      expect(screen.getByText(episode.title)).toBeInTheDocument();
    }
    expect(container.innerHTML).not.toContain("quick-bites-fnp-");
    expect(screen.getAllByText("Locked")).toHaveLength(PANCE_QUICK_BITE_EPISODES.length - 1);
  });
});
