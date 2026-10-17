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
  const url = new URL(`https://example.test/api/quick-bites/${slug}/media`);
  if (part) url.searchParams.set("part", part);
  return GET(new Request(url), { params: Promise.resolve({ slug }) });
}

describe("GET /api/quick-bites/[slug]/media", () => {
  beforeEach(() => {
    signPrivateQuickBiteGet.mockReset();
    getBlob.mockReset();
    signPrivateQuickBiteGet.mockResolvedValue(
      "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-ep02-nclex-works-web.mp4?vercel-blob-signature=test"
    );
  });

  it("gives a paid subscriber a signed video URL and a plan-checked captions URL", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("quick-bites-ep02-nclex-works");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.videoUrl).toContain("vercel-blob-signature=");
    expect(body.videoUrl).not.toBe(
      "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-ep02-nclex-works-web.mp4"
    );
    expect(body.captionsUrl).toBe(
      "/api/quick-bites/quick-bites-ep02-nclex-works/media?part=captions"
    );
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(
      "quick-bites/quick-bites-ep02-nclex-works-web.mp4"
    );
    expect(response.headers.get("cache-control")).toContain("private");
  });

  it("streams captions only after the paid check", async () => {
    asAccess("subscriber", "active", true);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("WEBVTT\n"));
        controller.close();
      },
    });
    getBlob.mockResolvedValue({ statusCode: 200, stream, blob: { contentType: "text/vtt" } });
    const response = await mediaRequest("quick-bites-potassium", "captions");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/vtt");
    expect(await response.text()).toContain("WEBVTT");
    expect(getBlob).toHaveBeenCalledWith("quick-bites/quick-bites-potassium.vtt", {
      access: "private",
    });
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
    const response = await mediaRequest("quick-bites-ep02-nclex-works");
    expect(response.status).toBe(401);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("signs the open episode for a free or trial member and keeps the rest locked", async () => {
    asAccess("free", "trial_expired", false);
    const open = await mediaRequest("quick-bites-ep02-nclex-works");
    expect(open.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(
      "quick-bites/quick-bites-ep02-nclex-works-web.mp4"
    );
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("WEBVTT\n"));
        controller.close();
      },
    });
    getBlob.mockResolvedValue({ statusCode: 200, stream, blob: { contentType: "text/vtt" } });
    const captions = await mediaRequest("quick-bites-ep02-nclex-works", "captions");
    expect(captions.status).toBe(200);
    expect(await captions.text()).toContain("WEBVTT");

    signPrivateQuickBiteGet.mockClear();
    getBlob.mockClear();
    asAccess("trial", "trialing", true);
    const locked = await mediaRequest("quick-bites-ep03-priority");
    expect(locked.status).toBe(403);
    expect(await locked.json()).toMatchObject({ code: "QUICK_BITES_LOCKED" });
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
    expect(getBlob).not.toHaveBeenCalled();
  });

  it("returns 403 for a trial member", async () => {
    asAccess("trial", "trialing", true);
    const response = await mediaRequest("quick-bites-ep03-priority");
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "QUICK_BITES_LOCKED" });
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("returns 403 for a free member, including captions", async () => {
    asAccess("free", "trial_expired", false);
    const video = await mediaRequest("quick-bites-ep08-cardiac");
    const captions = await mediaRequest("quick-bites-ep08-cardiac", "captions");
    expect(video.status).toBe(403);
    expect(captions.status).toBe(403);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
    expect(getBlob).not.toHaveBeenCalled();
  });

  it("signs acid-base and high-alert media for a paid subscriber", async () => {
    asAccess("subscriber", "active", true);
    const video = await mediaRequest("quick-bites-ep07-acid-base");
    expect(video.status).toBe(200);
    expect(signPrivateQuickBiteGet).toHaveBeenCalledWith(
      "quick-bites/quick-bites-ep07-acid-base-web.mp4"
    );
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("WEBVTT\n"));
        controller.close();
      },
    });
    getBlob.mockResolvedValue({ statusCode: 200, stream, blob: { contentType: "text/vtt" } });
    const captions = await mediaRequest("quick-bites-ep12-high-alert-pharm", "captions");
    expect(captions.status).toBe(200);
    expect(await captions.text()).toContain("WEBVTT");
    expect(getBlob).toHaveBeenCalledWith("quick-bites/quick-bites-ep12-high-alert-pharm.vtt", {
      access: "private",
    });
  });

  it("returns 404 for an unknown episode after the paid check", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("../secret");
    expect(response.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });

  it("does not sign a pharmacy episode from the nursing route", async () => {
    asAccess("subscriber", "active", true);
    const response = await mediaRequest("quick-bites-pharm-ep01-anticoagulants");
    expect(response.status).toBe(404);
    expect(signPrivateQuickBiteGet).not.toHaveBeenCalled();
  });
});
