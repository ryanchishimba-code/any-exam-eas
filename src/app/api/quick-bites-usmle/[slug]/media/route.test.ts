import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import {
  USMLE_VIDEO_QUICK_BITE_EPISODES,
  USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION,
} from "@/lib/quick-bites/usmle-video-catalog";

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

const SLUG = USMLE_VIDEO_QUICK_BITE_EPISODES[0]!.slug;
const VIDEO_PATH = `quick-bites-usmle/${USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION}/${SLUG}-web.mp4`;

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

function loggedOut() {
  authState.result = {
    ok: false,
    userId: "",
    access: {} as UserAccess,
    response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  };
}

function mediaRequest(slug: string) {
  return GET(new Request(`https://example.test/api/quick-bites-usmle/${slug}/media`), {
    params: Promise.resolve({ slug }),
  });
}

describe("GET /api/quick-bites-usmle/[slug]/media", () => {
  beforeEach(() => {
    signPrivateQuickBiteGet.mockReset();
    getBlob.mockReset();
    delete process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC;
    delete process.env.NEXT_PUBLIC_USMLE_VIDEO_QUICK_BITES_PUBLIC;
    signPrivateQuickBiteGet.mockResolvedValue(
      `https://example.private.blob.vercel-storage.com/${VIDEO_PATH}?vercel-blob-signature=test`
    );
  });

  it("hides the video from students while the flag is off", async () => {
    loggedOut();
    expect((await mediaRequest(SLUG)).status).toBe(404);

    asAccess("subscriber", "active", true);
    const paid = await mediaRequest(SLUG);
    expect(paid.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("signs a private URL for staff while the flag is off", async () => {
    asAccess("staff", "none", true);
    const response = await mediaRequest(SLUG);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.videoUrl).toContain("vercel-blob-signature=");
    expect(body.videoUrl).not.toMatch(/private\.blob\.vercel-storage\.com\/[^?]+$/);
    expect(body.captionsUrl).toBe(`/api/quick-bites-usmle/${SLUG}/media?part=captions`);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(VIDEO_PATH);
  });

  it("keeps a paid gate and no free sample once the flag is on", async () => {
    process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC = "1";
    asAccess("subscriber", "active", true);
    const paid = await mediaRequest(SLUG);
    expect(paid.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(VIDEO_PATH);

    signPrivateQuickBiteGet.mockClear();
    asAccess("free", "trial_expired", false);
    expect((await mediaRequest(SLUG)).status).toBe(403);

    asAccess("trial", "trialing", true);
    expect((await mediaRequest(SLUG)).status).toBe(403);

    loggedOut();
    expect((await mediaRequest(SLUG)).status).toBe(401);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("returns 404 for another board's slug", async () => {
    process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC = "1";
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("quick-bites-pance-ep01-coronary-failure-shock");
    expect(response.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });
});
