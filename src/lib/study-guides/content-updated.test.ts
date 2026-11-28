import { describe, expect, it } from "vitest";
import { clampChicagoDate, contentUpdatedOn, formatChicagoDate } from "@/lib/study-guides/content-updated";
import { readingTimeLabel } from "@/lib/study-guides/present-html";

describe("study guide stats", () => {
  it("says hours once the read is about an hour or longer", () => {
    expect(readingTimeLabel(182)).toBe("About 3 hours to read");
    expect(readingTimeLabel(131)).toBe("About 2 hours to read");
    expect(readingTimeLabel(60)).toBe("About 1 hour to read");
    expect(readingTimeLabel(20)).toBe("About 20 minutes to read");
  });

  it("uses the manuscript commit day in Chicago and never a future day", () => {
    const now = new Date("2026-11-27T20:36:00-06:00");
    const nclex = contentUpdatedOn(["content/nclex-study-guide"], now);
    expect(nclex.iso).toBe("2026-11-07");
    expect(nclex.label).toBe("Nov 7, 2026");
    expect(nclex.iso <= "2026-11-27").toBe(true);

    expect(clampChicagoDate("2026-11-28", now)).toBe("2026-11-27");
    expect(formatChicagoDate("2026-11-07")).toBe("Nov 7, 2026");
  });
});
