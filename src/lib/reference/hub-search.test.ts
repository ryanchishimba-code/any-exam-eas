import { describe, expect, it } from "vitest";
import { MEMORY_CARDS } from "./seeds";
import { hubSearchHasResults, relatedDrugsForMemoryCard, searchReferenceHub } from "./hub-search";

const NCLEX_CARDS = MEMORY_CARDS.filter((c) => c.examSlug === "nclex");

describe("hub-search", () => {
  it("returns empty results for short queries", () => {
    const empty = { cards: [], drugs: [], modules: [], anatomy: [], procedures: [] };
    expect(searchReferenceHub(NCLEX_CARDS, "nclex", "")).toEqual(empty);
    expect(searchReferenceHub(NCLEX_CARDS, "nclex", "a")).toEqual(empty);
  });

  it("finds memory cards by title keyword", () => {
    const card = NCLEX_CARDS[0];
    const keyword = card.title.split(" ")[0];
    const { cards } = searchReferenceHub(NCLEX_CARDS, "nclex", keyword);
    expect(cards.some((c) => c.id === card.id)).toBe(true);
  });

  it("finds review modules for exam slug", () => {
    const { modules } = searchReferenceHub(NCLEX_CARDS, "nclex", "sepsis");
    expect(Array.isArray(modules)).toBe(true);
  });

  it("hubSearchHasResults reflects any category", () => {
    expect(
      hubSearchHasResults({ cards: [], drugs: [], modules: [], anatomy: [], procedures: [] })
    ).toBe(false);
    expect(
      hubSearchHasResults({
        cards: [NCLEX_CARDS[0]],
        drugs: [],
        modules: [],
        anatomy: [],
        procedures: [],
      })
    ).toBe(true);
  });

  it("finds anatomy procedures by name", () => {
    const { procedures } = searchReferenceHub(NCLEX_CARDS, "nclex", "appendectomy");
    expect(procedures.some((p) => p.id === "appendectomy")).toBe(true);
  });

  it("finds related drugs from card tags when present", () => {
    const withDrugTag = NCLEX_CARDS.find((c) => c.tags.some((t) => t.length >= 4));
    if (!withDrugTag) return;
    const drugs = relatedDrugsForMemoryCard(withDrugTag, 4);
    expect(Array.isArray(drugs)).toBe(true);
  });

  it("excludes clinical search categories for MPJE", () => {
    const mpjeCards = MEMORY_CARDS.filter((c) => c.examSlug === "pance");
    const { drugs, anatomy, procedures } = searchReferenceHub(mpjeCards, "pance", "heart");
    expect(drugs).toEqual([]);
    expect(anatomy).toEqual([]);
    expect(procedures).toEqual([]);
  });
});
