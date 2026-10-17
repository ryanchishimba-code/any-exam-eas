import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserAccess } from "@/lib/access-control";

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

import { getPharmacyQuickBiteQuiz } from "@/lib/quick-bites/pharmacy-quiz-data";
import { GET, POST } from "./route";

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

function quizRequest(slug: string, init?: RequestInit) {
  return new Request(`https://example.test/api/quick-bites-pharmacy/${slug}/quiz`, init);
}

describe("GET/POST /api/quick-bites-pharmacy/[slug]/quiz", () => {
  beforeEach(() => {
    asAccess("subscriber", "active", true);
  });

  it("serves episode 1 to a paid member without keys", async () => {
    const response = await GET(quizRequest("quick-bites-pharm-ep01-anticoagulants"), {
      params: Promise.resolve({ slug: "quick-bites-pharm-ep01-anticoagulants" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.questions).toHaveLength(10);
    const published = JSON.stringify(body);
    expect(published).not.toContain('"keys"');
    expect(published).not.toContain('"explanation"');
    expect(published).not.toContain("mechanical heart valve");
  });

  it("grades a paid answer with the remapped key", async () => {
    const quiz = getPharmacyQuickBiteQuiz("quick-bites-pharm-ep01-anticoagulants")!;
    const first = quiz.questions[0]!;
    const response = await POST(
      quizRequest("quick-bites-pharm-ep01-anticoagulants", {
        method: "POST",
        body: JSON.stringify({ questionId: first.id, selected: first.keys }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-pharm-ep01-anticoagulants" }) }
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ correct: true, keys: first.keys });
  });

  it("locks episode 1 for a free member and ignores the nursing open episode", async () => {
    asAccess("free", "trial_expired", false);
    const response = await GET(quizRequest("quick-bites-pharm-ep01-anticoagulants"), {
      params: Promise.resolve({ slug: "quick-bites-pharm-ep01-anticoagulants" }),
    });
    expect(response.status).toBe(403);
    const body = JSON.stringify(await response.json());
    expect(body).toContain("PHARMACY_QUICK_BITES_LOCKED");
    expect(body).not.toContain("Warfarin");

    asAccess("subscriber", "active", true);
    const nursing = await GET(quizRequest("quick-bites-ep02-nclex-works"), {
      params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }),
    });
    expect(nursing.status).toBe(404);
  });

  it("returns 401 when logged out", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const response = await GET(quizRequest("quick-bites-pharm-ep01-anticoagulants"), {
      params: Promise.resolve({ slug: "quick-bites-pharm-ep01-anticoagulants" }),
    });
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain("Warfarin");
  });
});
