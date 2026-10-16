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

import { getQuickBiteQuiz } from "@/lib/quick-bites/quiz-data";
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
  return new Request(`https://example.test/api/quick-bites/${slug}/quiz`, init);
}

describe("GET/POST /api/quick-bites/[slug]/quiz", () => {
  beforeEach(() => {
    asAccess("subscriber", "active", true);
  });

  it("gives a paid subscriber the questions without keys or explanations", async () => {
    const response = await GET(quizRequest("quick-bites-ep02-nclex-works"), {
      params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("private");
    const body = await response.json();
    expect(body.questions).toHaveLength(10);
    expect(body.questions[0]).toMatchObject({
      id: "ep02-nclex-works-q01",
      type: "single-answer",
      videoTimestamp: "1:09",
    });
    expect(body.questions[0]).not.toHaveProperty("keys");
    expect(body.questions[0]).not.toHaveProperty("explanation");
    expect(JSON.stringify(body)).not.toContain("the computer was confident");
    expect(body.questions.some((question: { type: string }) => question.type === "sata")).toBe(true);
  });

  it("locks the explanation until the answer is submitted", async () => {
    const quiz = getQuickBiteQuiz("quick-bites-ep02-nclex-works")!;
    const single = quiz.questions[0]!;
    const sata = quiz.questions.find((question) => question.id === "ep02-nclex-works-q09")!;
    const wrongOption = sata.options.find((option) => !sata.keys.includes(option.id))!;

    const correct = await POST(
      quizRequest("quick-bites-ep02-nclex-works", {
        method: "POST",
        body: JSON.stringify({ questionId: single.id, selected: single.keys }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }) }
    );
    expect(correct.status).toBe(200);
    expect(await correct.json()).toMatchObject({
      correct: true,
      keys: single.keys,
    });

    const wrong = await POST(
      quizRequest("quick-bites-ep02-nclex-works", {
        method: "POST",
        body: JSON.stringify({ questionId: sata.id, selected: [wrongOption.id] }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }) }
    );
    const wrongBody = await wrong.json();
    expect(wrongBody.correct).toBe(false);
    expect(wrongBody.explanation).toContain("bow-tie");

    const exact = await POST(
      quizRequest("quick-bites-ep02-nclex-works", {
        method: "POST",
        body: JSON.stringify({
          questionId: sata.id,
          selected: [...sata.keys].reverse(),
        }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }) }
    );
    expect((await exact.json()).correct).toBe(true);
  });

  it("returns 401 when logged out", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    };
    const response = await GET(quizRequest("quick-bites-ep02-nclex-works"), {
      params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }),
    });
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain("nursing board exam");
  });

  it("returns 403 for trial and free members, including answer checks", async () => {
    asAccess("trial", "trialing", true);
    const trial = await GET(quizRequest("quick-bites-ep03-priority"), {
      params: Promise.resolve({ slug: "quick-bites-ep03-priority" }),
    });
    expect(trial.status).toBe(403);
    expect(await trial.json()).toMatchObject({ code: "QUICK_BITES_LOCKED" });

    asAccess("free", "trial_expired", false);
    const free = await POST(
      quizRequest("quick-bites-ep02-nclex-works", {
        method: "POST",
        body: JSON.stringify({ questionId: "ep02-nclex-works-q01", selected: ["C"] }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }) }
    );
    expect(free.status).toBe(403);
    expect(await free.text()).not.toContain("the computer was confident");
  });

  it("serves acid-base and high-alert quizzes to a paid subscriber", async () => {
    const highAlert = await GET(quizRequest("quick-bites-ep12-high-alert-pharm"), {
      params: Promise.resolve({ slug: "quick-bites-ep12-high-alert-pharm" }),
    });
    expect(highAlert.status).toBe(200);
    const highAlertBody = await highAlert.json();
    expect(highAlertBody.questions).toHaveLength(10);
    expect(highAlertBody.questions[0]).not.toHaveProperty("keys");
    expect(highAlertBody.questions[0]).not.toHaveProperty("explanation");

    const acidBase = getQuickBiteQuiz("quick-bites-ep07-acid-base")!;
    const first = acidBase.questions[0]!;
    const posted = await POST(
      quizRequest("quick-bites-ep07-acid-base", {
        method: "POST",
        body: JSON.stringify({ questionId: first.id, selected: first.keys }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep07-acid-base" }) }
    );
    expect(posted.status).toBe(200);
    expect(await posted.json()).toMatchObject({ correct: true, keys: first.keys });
  });

  it("returns 404 for an unknown episode and 400 for a bad answer", async () => {
    const missing = await GET(quizRequest("not-an-episode"), {
      params: Promise.resolve({ slug: "not-an-episode" }),
    });
    expect(missing.status).toBe(404);

    const bad = await POST(
      quizRequest("quick-bites-ep02-nclex-works", {
        method: "POST",
        body: JSON.stringify({ questionId: "ep02-nclex-works-q01", selected: ["A", "B"] }),
      }),
      { params: Promise.resolve({ slug: "quick-bites-ep02-nclex-works" }) }
    );
    expect(bad.status).toBe(400);
    expect(await bad.text()).not.toContain("the computer was confident");
  });
});
