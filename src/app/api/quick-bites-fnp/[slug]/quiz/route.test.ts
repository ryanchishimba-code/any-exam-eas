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

import { OPEN_FNP_QUICK_BITE_SLUG } from "@/lib/quick-bites/fnp-catalog";
import { getFnpQuickBiteQuiz } from "@/lib/quick-bites/fnp-quiz-data";
import { GET, POST } from "./route";

const SLUG = "quick-bites-fnp-ep01-screening";

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
  return new Request(`https://example.test/api/quick-bites-fnp/${slug}/quiz`, init);
}

describe("GET/POST /api/quick-bites-fnp/[slug]/quiz", () => {
  beforeEach(() => {
    asAccess("subscriber", "active", true);
  });

  it("serves a paid member without keys", async () => {
    const response = await GET(quizRequest(SLUG), { params: Promise.resolve({ slug: SLUG }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.questions).toHaveLength(10);
    const published = JSON.stringify(body);
    expect(published).not.toContain('"keys"');
    expect(published).not.toContain('"explanation"');
  });

  it("serves the sample quiz to a trial member and keeps a non-sample gated", async () => {
    asAccess("trial", "trialing", true);
    const sample = await GET(quizRequest(OPEN_FNP_QUICK_BITE_SLUG), {
      params: Promise.resolve({ slug: OPEN_FNP_QUICK_BITE_SLUG }),
    });
    expect(sample.status).toBe(200);

    const locked = await GET(quizRequest(SLUG), { params: Promise.resolve({ slug: SLUG }) });
    expect(locked.status).toBe(403);
  });

  it("returns 401 when logged out and 403 for free members", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const loggedOut = await GET(quizRequest(SLUG), { params: Promise.resolve({ slug: SLUG }) });
    expect(loggedOut.status).toBe(401);

    asAccess("free", "trial_expired", false);
    const locked = await GET(quizRequest(SLUG), { params: Promise.resolve({ slug: SLUG }) });
    expect(locked.status).toBe(403);
    expect(JSON.stringify(await locked.json())).toContain("FNP_QUICK_BITES_LOCKED");
  });

  it("grades a paid answer with the remapped key", async () => {
    const quiz = getFnpQuickBiteQuiz(SLUG)!;
    const first = quiz.questions[0]!;
    const response = await POST(
      quizRequest(SLUG, {
        method: "POST",
        body: JSON.stringify({ questionId: first.id, selected: first.keys }),
      }),
      { params: Promise.resolve({ slug: SLUG }) }
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ correct: true, keys: first.keys });
  });
});
