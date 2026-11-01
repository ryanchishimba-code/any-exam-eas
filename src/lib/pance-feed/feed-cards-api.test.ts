import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import { loadPanceFeedCards, loadStudyFeedCards, resetPanceFeedCardCache } from "@/lib/pance-feed/load-cards";
import { trialFlashcardSliceCount } from "@/lib/pance-feed/trial-slice";

const authState = vi.hoisted(() => ({
  result: {
    ok: true as boolean,
    userId: "user-1",
    access: {} as Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription">,
    response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  },
}));

vi.mock("@/lib/api-access", () => ({
  requireAuthenticatedApi: async () => authState.result,
}));

import { GET as getPanceCards } from "@/app/api/pance-feed/cards/route";
import { GET as getPanceCard } from "@/app/api/pance-feed/cards/[id]/route";
import { GET as getStudyCards } from "@/app/api/study-feed/[exam]/cards/route";
import { GET as getStudyCard } from "@/app/api/study-feed/[exam]/cards/[id]/route";

function asAccess(
  role: UserAccess["role"],
  status: UserAccess["subscription"]["status"],
  hasPremiumAccess: boolean
) {
  authState.result = {
    ok: true,
    userId: "user-1",
    access: {
      role,
      hasPremiumAccess,
      subscription: { status } as UserAccess["subscription"],
    },
    response: new Response(null, { status: 401 }),
  };
}

const boards = [
  {
    name: "pance",
    list: () => getPanceCards(),
    one: (id: string) => getPanceCard(new Request("https://example.test"), { params: Promise.resolve({ id }) }),
    cards: () => loadPanceFeedCards(),
  },
  {
    name: "naplex",
    list: () => getStudyCards(new Request("https://example.test"), { params: Promise.resolve({ exam: "naplex" }) }),
    one: (id: string) =>
      getStudyCard(new Request("https://example.test"), { params: Promise.resolve({ exam: "naplex", id }) }),
    cards: () => loadStudyFeedCards("naplex"),
  },
  {
    name: "nclex",
    list: () => getStudyCards(new Request("https://example.test"), { params: Promise.resolve({ exam: "nclex" }) }),
    one: (id: string) =>
      getStudyCard(new Request("https://example.test"), { params: Promise.resolve({ exam: "nclex", id }) }),
    cards: () => loadStudyFeedCards("nclex"),
  },
  {
    name: "fnp",
    list: () => getStudyCards(new Request("https://example.test"), { params: Promise.resolve({ exam: "aanp-fnp" }) }),
    one: (id: string) =>
      getStudyCard(new Request("https://example.test"), { params: Promise.resolve({ exam: "aanp-fnp", id }) }),
    cards: () => loadStudyFeedCards("aanp-fnp"),
  },
] as const;

describe("flashcard feed payloads", () => {
  beforeEach(() => {
    resetPanceFeedCardCache();
  });

  it.each(boards)("$name gives a trial the first 10% and withholds the rest", async (board) => {
    const deck = board.cards();
    const sliceCount = trialFlashcardSliceCount(deck.length);
    const locked = deck[sliceCount]!;
    asAccess("trial", "trialing", true);

    const list = await board.list();
    expect(list.status).toBe(200);
    const body = await list.json();
    expect(body.trialLimited).toBe(true);
    expect(body.total).toBe(deck.length);
    expect(body.accessible).toBe(sliceCount);
    expect(body.cards).toHaveLength(sliceCount);
    expect(body.cards.map((card: { id: string }) => card.id)).toEqual(
      deck.slice(0, sliceCount).map((card) => card.id)
    );
    expect(body.cards[0].front).toBe(deck[0]!.front);
    const packed = JSON.stringify(body);
    expect(packed).not.toContain(locked.front);
    expect(packed).not.toContain(locked.bottom);
    expect(packed).not.toContain(locked.bullets.clue);
    expect(packed).not.toContain(locked.bullets.treat);
    expect(packed).not.toContain(locked.bullets.trap);

    const hidden = await board.one(locked.id);
    expect(hidden.status).toBe(403);
    const hiddenBody = JSON.stringify(await hidden.json());
    expect(hiddenBody).not.toContain(locked.front);
    expect(hiddenBody).not.toContain(locked.bottom);
    expect(hiddenBody).not.toContain("<svg");
    expect(hiddenBody).not.toContain(locked.bullets.trap);
  });

  it.each(boards)("$name gives a paid plan every card", async (board) => {
    const deck = board.cards();
    const last = deck.at(-1)!;
    asAccess("subscriber", "active", true);

    const list = await board.list();
    expect(list.status).toBe(200);
    const body = await list.json();
    expect(body.trialLimited).toBe(false);
    expect(body.cards).toHaveLength(deck.length);
    expect(body.cards.at(-1).front).toBe(last.front);

    const card = await board.one(last.id);
    expect(card.status).toBe(200);
    const one = await card.json();
    expect(one.front).toBe(last.front);
    expect(one.bottom).toBe(last.bottom);
  });

  it("does not send naplex cards to a post-trial account", async () => {
    const deck = loadStudyFeedCards("naplex");
    asAccess("free", "trial_expired", false);
    const list = await getStudyCards(new Request("https://example.test"), {
      params: Promise.resolve({ exam: "naplex" }),
    });
    expect(list.status).toBe(403);
    const body = JSON.stringify(await list.json());
    expect(body).not.toContain(deck[0]!.front);
    expect(body).not.toContain(deck[20]!.front);
  });
});
