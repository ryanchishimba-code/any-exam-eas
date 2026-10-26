import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import { OPEN_PANCE_QUICK_BITE_SLUG, PANCE_QUICK_BITES_MEDIA_VERSION } from "@/lib/quick-bites/pance-catalog";

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

const SLUG = OPEN_PANCE_QUICK_BITE_SLUG;
const VIDEO_PATH = `quick-bites-pance/${PANCE_QUICK_BITES_MEDIA_VERSION}/${SLUG}-web.mp4`;

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
  const url = new URL(`https://example.test/api/quick-bites-pance/${slug}/media`);
  if (part) url.searchParams.set("part", part);
  return GET(new Request(url), { params: Promise.resolve({ slug }) });
}

describe("GET /api/quick-bites-pance/[slug]/media", () => {
  beforeEach(() => {
    signPrivateQuickBiteGet.mockReset();
    getBlob.mockReset();
    signPrivateQuickBiteGet.mockResolvedValue(
      `https://example.private.blob.vercel-storage.com/${VIDEO_PATH}?vercel-blob-signature=test`
    );
  });

  it("signs video for a paid subscriber", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest(SLUG);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.videoUrl).toContain("vercel-blob-signature=");
    expect(body.captionsUrl).toBe(`/api/quick-bites-pance/${SLUG}/media?part=captions`);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(VIDEO_PATH);
  });

  it("signs the public sample for a logged-out visitor, free member, and trial member", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const loggedOut = await mediaRequest(SLUG);
    expect(loggedOut.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(VIDEO_PATH);

    signPrivateQuickBiteGet.mockClear();
    asAccess("free", "trial_expired", false);
    const freeVideo = await mediaRequest(SLUG);
    expect(freeVideo.status).toBe(200);

    signPrivateQuickBiteGet.mockClear();
    asAccess("trial", "trialing", true);
    const trial = await mediaRequest(SLUG);
    expect(trial.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledTimes(1);
  });

  it("keeps a non-sample episode gated for logged-out visitors and free or trial members", async () => {
    authState.result = {
      ok: false,
      userId: "",
      access: {} as UserAccess,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    };
    const loggedOut = await mediaRequest("quick-bites-pance-ep02-rhythms-valves-congenital");
    expect(loggedOut.status).toBe(401);

    asAccess("trial", "trialing", true);
    const trial = await mediaRequest("quick-bites-pance-ep02-rhythms-valves-congenital");
    expect(trial.status).toBe(403);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("returns 404 for a nursing slug", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("quick-bites-ep02-nclex-works");
    expect(response.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });
});
