import { describe, expect, it } from "vitest";
import {
  QB_WAVE2_UPLOAD_SECRET_SHA256,
  isQbWave2UploadSecret,
} from "@/lib/quick-bites/wave2-upload-auth";

describe("Quick Bites wave 2 upload secret", () => {
  it("stores only the approved sha256 and compares digests", () => {
    expect(QB_WAVE2_UPLOAD_SECRET_SHA256).toBe(
      "a781729b3c1f5bf8345fd8b412a2bc7baadce2dca1ef02346076c5cafb6987d8"
    );
    expect(isQbWave2UploadSecret(null)).toBe(false);
    expect(isQbWave2UploadSecret(undefined)).toBe(false);
    expect(isQbWave2UploadSecret("")).toBe(false);
    expect(isQbWave2UploadSecret("   ")).toBe(false);
    expect(isQbWave2UploadSecret("a")).toBe(false);
    expect(isQbWave2UploadSecret("a".repeat(300))).toBe(false);
    expect(isQbWave2UploadSecret(` ${"not-the-secret"} `)).toBe(false);
  });
});
