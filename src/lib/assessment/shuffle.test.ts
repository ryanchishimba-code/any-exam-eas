import { describe, expect, it } from "vitest";
import { orderForFormat, seededShuffle } from "@/lib/assessment/shuffle";

const OPTIONS = ["a", "b", "c", "d", "e", "f"];

describe("seeded option order", () => {
  it("is deterministic and a permutation", () => {
    const once = seededShuffle(OPTIONS, "attempt-7:C02-S4");
    const twice = seededShuffle(OPTIONS, "attempt-7:C02-S4");
    expect(twice).toEqual(once);
    expect([...once].sort()).toEqual([...OPTIONS].sort());
    expect(once).not.toEqual(OPTIONS);
    expect(seededShuffle(OPTIONS, "attempt-8:C02-S4")).not.toEqual(once);
  });

  it("shuffles choice, dropdown, and bow-tie formats only", () => {
    const seed = "attempt-1:item";
    expect(orderForFormat("mr_sata", OPTIONS, seed)).toEqual(seededShuffle(OPTIONS, seed));
    expect(orderForFormat("bowtie", OPTIONS, seed)).toEqual(seededShuffle(OPTIONS, seed));
    expect(orderForFormat("highlight_text", OPTIONS, seed)).toEqual(OPTIONS);
    expect(orderForFormat("matrix_mc", OPTIONS, seed)).toEqual(OPTIONS);
    expect(orderForFormat("matrix_mr", OPTIONS, seed)).toEqual(OPTIONS);
  });

  it("does not mutate the authored list", () => {
    const authored = ["a", "b", "c", "d"];
    orderForFormat("mc_single", authored, "seed");
    expect(authored).toEqual(["a", "b", "c", "d"]);
  });
});
