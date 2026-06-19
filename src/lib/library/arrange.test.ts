import { describe, it, expect } from "vitest";
import { groupCardsBySubject, compareCardsWithinSubject, subjectKey } from "./arrange";
import type { MemoryCard } from "./types";

function card(partial: Partial<MemoryCard> & { id: string }): MemoryCard {
  return {
    examSlug: "usmle",
    subject: "Cardiology",
    topic: "ACS",
    title: "Title",
    teaser: "Teaser",
    kind: "fact",
    tags: [],
    body: "Body",
    practiceTopicSlug: "cardiology",
    sortOrder: 1,
    ...partial,
  } as MemoryCard;
}

describe("subjectKey", () => {
  it("produces DOM-safe slugs", () => {
    expect(subjectKey("Infectious Disease")).toBe("infectious-disease");
    expect(subjectKey("Management of Care")).toBe("management-of-care");
    expect(subjectKey("  ")).toBe("other");
  });
});

describe("compareCardsWithinSubject", () => {
  it("orders by topic, then sortOrder, then title", () => {
    const a = card({ id: "a", topic: "Aortic", sortOrder: 5 });
    const b = card({ id: "b", topic: "Bradycardia", sortOrder: 1 });
    expect(compareCardsWithinSubject(a, b)).toBeLessThan(0);

    const c = card({ id: "c", topic: "ACS", sortOrder: 3, title: "Zebra" });
    const d = card({ id: "d", topic: "ACS", sortOrder: 1, title: "Alpha" });
    expect(compareCardsWithinSubject(c, d)).toBeGreaterThan(0);

    const e = card({ id: "e", topic: "ACS", sortOrder: 2, title: "Alpha" });
    const f = card({ id: "f", topic: "ACS", sortOrder: 2, title: "Zebra" });
    expect(compareCardsWithinSubject(e, f)).toBeLessThan(0);
  });
});

describe("groupCardsBySubject", () => {
  it("groups by subject and orders sections alphabetically", () => {
    const cards = [
      card({ id: "1", subject: "Neurology" }),
      card({ id: "2", subject: "Cardiology" }),
      card({ id: "3", subject: "Cardiology" }),
    ];
    const groups = groupCardsBySubject(cards);
    expect(groups.map((g) => g.subject)).toEqual(["Cardiology", "Neurology"]);
    expect(groups[0].cards).toHaveLength(2);
  });

  it("keeps related cards adjacent despite sortOrder collisions", () => {
    const cards = [
      card({ id: "sepsis-1", subject: "Critical Care", topic: "Sepsis", sortOrder: 3 }),
      card({ id: "deleg-1", subject: "Critical Care", topic: "Delegation", sortOrder: 3 }),
      card({ id: "sepsis-2", subject: "Critical Care", topic: "Sepsis", sortOrder: 1 }),
    ];
    const [group] = groupCardsBySubject(cards);
    // Delegation (D) sorts before Sepsis (S); within Sepsis, sortOrder 1 before 3.
    expect(group.cards.map((c) => c.id)).toEqual(["deleg-1", "sepsis-2", "sepsis-1"]);
  });

  it("falls back to an 'Other' bucket for blank subjects", () => {
    const groups = groupCardsBySubject([card({ id: "x", subject: "  " })]);
    expect(groups[0].subject).toBe("Other");
    expect(groups[0].key).toBe("other");
  });

  it("does not drop or duplicate cards", () => {
    const cards = Array.from({ length: 20 }, (_, i) =>
      card({ id: `c${i}`, subject: i % 2 ? "A" : "B", topic: `t${i}` })
    );
    const total = groupCardsBySubject(cards).reduce((n, g) => n + g.cards.length, 0);
    expect(total).toBe(20);
  });
});
