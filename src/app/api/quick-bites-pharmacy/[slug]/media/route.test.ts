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

const signPrivateQuickBiteGet = vi.hoisted(() => vi.fn());
const getBlob = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requireAuthenticatedApi: async () => authState.result,
}));

vi.mock("@/lib/quick-bites/sign-media", () => ({
  signPrivateQuickBiteGet,
}));

vi.mock("@vercel/blob", () => ({
  get: getBlob,
}));

import { GET } from "./route";

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

function mediaRequest(slug: string, part?: string) {
  const url = new URL(`https://example.test/api/quick-bites-pharmacy/${slug}/media`);
  if (part) url.searchParams.set("part", part);
  return GET(new Request(url), { params: Promise.resolve({ slug }) });
}

describe("GET /api/quick-bites-pharmacy/[slug]/media", () => {
  beforeEach(() => {
    signPrivateQuickBiteGet.mockReset();
    getBlob.mockReset();
    signPrivateQuickBiteGet.mockResolvedValue(
      "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites-pharmacy/quick-bites-pharm-ep01-anticoagulants-web.mp4?vercel-blob-signature=test"
    );
  });

  it("signs episode 1 only for a paid subscriber", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("quick-bites-pharm-ep01-anticoagulants");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.videoUrl).toContain("vercel-blob-signature=");
    expect(body.captionsUrl).toBe(
      "/api/quick-bites-pharmacy/quick-bites-pharm-ep01-anticoagulants/media?part=captions"
    );
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(
      "quick-bites-pharmacy/quick-bites-pharm-ep01-anticoagulants-web.mp4"
    );
  });

  it("signs the public sample for a logged-out visitor and a free member", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const loggedOut = await mediaRequest("quick-bites-pharm-ep01-anticoagulants");
    expect(loggedOut.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(
      "quick-bites-pharmacy/quick-bites-pharm-ep01-anticoagulants-web.mp4"
    );

    signPrivateQuickBiteGet.mockClear();
    asAccess("free", "trial_expired", false);
    const freeVideo = await mediaRequest("quick-bites-pharm-ep01-anticoagulants");
    expect(freeVideo.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledTimes(1);
  });

  it("keeps a non-sample episode gated for logged-out visitors and free or trial members", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const loggedOut = await mediaRequest("quick-bites-pharm-ep02-raas");
    expect(loggedOut.status).toBe(401);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();

    asAccess("free", "trial_expired", false);
    const freeVideo = await mediaRequest("quick-bites-pharm-ep02-raas");
    const freeCaptions = await mediaRequest("quick-bites-pharm-ep02-raas", "captions");
    expect(freeVideo.status).toBe(403);
    expect(freeCaptions.status).toBe(403);
    expect(await freeVideo.json()).toMatchObject({ code: "PHARMACY_QUICK_BITES_LOCKED" });

    asAccess("trial", "trialing", true);
    const trial = await mediaRequest("quick-bites-pharm-ep26-antidotes");
    expect(trial.status).toBe(403);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
    expect(getBlob).not.toHaveBeenCalled();
  });

  it("returns 404 for a nursing slug", async () => {
    asAccess("subscriber", "active", true);
    const nursing = await mediaRequest("quick-bites-ep02-nclex-works");
    expect(nursing.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });
});
