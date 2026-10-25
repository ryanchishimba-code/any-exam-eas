import { beforeEach, describe, expect, it, vi } from "vitest";

const handleUpload = vi.hoisted(() => vi.fn());
const head = vi.hoisted(() => vi.fn());
const authState = vi.hoisted(() => ({ ok: false }));

vi.mock("@vercel/blob/client", () => ({
  handleUpload,
}));

vi.mock("@vercel/blob", () => ({
  head,
  BlobNotFoundError: class BlobNotFoundError extends Error {
    constructor() {
      super("Blob not found");
      this.name = "BlobNotFoundError";
    }
  },
}));

vi.mock("@/lib/quick-bites/fnp-pance-upload-auth", () => ({
  isQbFnpPanceUploadSecret: () => authState.ok,
}));

import { QB_FNP_PANCE_UPLOAD_PATHS } from "@/lib/quick-bites/fnp-pance-upload-plan";
import { GET, POST } from "./route";

const ALLOWED_MP4 = "quick-bites-fnp/v1-20261025/quick-bites-fnp-ep01-screening-web.mp4";
const ALLOWED_VTT = "quick-bites-pance/v1-20261025/quick-bites-pance-ep01-coronary-failure-shock.vtt";

function tokenRequest(pathname: string, type = "blob.generate-client-token") {
  return new Request("https://preview.example/api/internal/qb-fnp-pance-upload", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-qb-upload-secret": authState.ok ? "present" : "",
    },
    body: JSON.stringify({
      type,
      payload: { pathname, clientPayload: "ignore-me", multipart: false },
    }),
  });
}

describe("temporary POST /api/internal/qb-fnp-pance-upload", () => {
  beforeEach(() => {
    authState.ok = false;
    handleUpload.mockReset();
    head.mockReset();
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_do_not_leak";
  });

  it("rejects a missing or wrong secret before minting a token", async () => {
    const response = await POST(tokenRequest(ALLOWED_MP4));
    expect(response.status).toBe(401);
    expect(handleUpload).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("does not accept the upload-completed callback", async () => {
    authState.ok = true;
    const response = await POST(tokenRequest(ALLOWED_MP4, "blob.upload-completed"));
    expect(response.status).toBe(400);
    expect(handleUpload).not.toHaveBeenCalled();
    expect(JSON.stringify(await response.json())).not.toContain("vercel_blob_rw_");
  });

  it("refuses pathnames outside the 76-path plan", async () => {
    authState.ok = true;
    const response = await POST(
      tokenRequest("quick-bites-pharmacy/quick-bites-pharm-ep07-insulin-web.mp4")
    );
    expect(response.status).toBe(400);
    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("mints a client token only with the plan constraints", async () => {
    authState.ok = true;
    handleUpload.mockImplementation(async (options: {
      onBeforeGenerateToken: (pathname: string) => Promise<Record<string, unknown>>;
      onUploadCompleted?: unknown;
    }) => {
      const constraints = await options.onBeforeGenerateToken(ALLOWED_MP4);
      expect(constraints).toEqual({
        allowedContentTypes: ["video/mp4"],
        maximumSizeInBytes: 60 * 1024 * 1024,
        addRandomSuffix: false,
        allowOverwrite: false,
      });
      expect(options.onUploadCompleted).toBeUndefined();
      return { type: "blob.generate-client-token", clientToken: "vercel_blob_client_scoped" };
    });

    const response = await POST(tokenRequest(ALLOWED_MP4));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.clientToken).toBe("vercel_blob_client_scoped");
    expect(JSON.stringify(body)).not.toContain("vercel_blob_rw_");
    expect(JSON.stringify(body)).not.toContain("BLOB_READ_WRITE_TOKEN");
    expect(QB_FNP_PANCE_UPLOAD_PATHS.size).toBe(76);
  });

  it("keeps a server token out of a failed response", async () => {
    authState.ok = true;
    handleUpload.mockRejectedValue(new Error("Invalid BLOB_READ_WRITE_TOKEN vercel_blob_rw_do_not_leak"));
    const response = await POST(tokenRequest(ALLOWED_VTT));
    expect(response.status).toBe(400);
    const text = JSON.stringify(await response.json());
    expect(text).toBe(JSON.stringify({ error: "Upload request failed" }));
    expect(text).not.toContain("do_not_leak");
  });
});

describe("temporary GET /api/internal/qb-fnp-pance-upload", () => {
  beforeEach(() => {
    authState.ok = false;
    head.mockReset();
  });

  it("requires the same secret", async () => {
    const response = await GET(
      new Request(`https://preview.example/api/internal/qb-fnp-pance-upload?pathname=${ALLOWED_MP4}`)
    );
    expect(response.status).toBe(401);
    expect(head).not.toHaveBeenCalled();
  });

  it("does not look up a pathname outside the plan", async () => {
    authState.ok = true;
    const response = await GET(
      new Request(
        "https://preview.example/api/internal/qb-fnp-pance-upload?pathname=quick-bites/quick-bites-ep02-nclex-works-web.mp4"
      )
    );
    expect(response.status).toBe(400);
    expect(head).not.toHaveBeenCalled();
  });

  it("returns size, content type, and access when the store provides it", async () => {
    authState.ok = true;
    head.mockResolvedValue({
      size: 1200,
      contentType: "text/vtt",
      access: "private",
      url: "https://store.private.blob.vercel-storage.com/secret-url",
      downloadUrl: "https://store.private.blob.vercel-storage.com/secret-download",
    });
    const response = await GET(
      new Request(
        `https://preview.example/api/internal/qb-fnp-pance-upload?pathname=${encodeURIComponent(ALLOWED_VTT)}`
      )
    );
    expect(response.status).toBe(200);
    expect(head).toHaveBeenCalledWith(ALLOWED_VTT);
    expect(await response.json()).toEqual({
      size: 1200,
      contentType: "text/vtt",
      access: "private",
    });
  });
});
