import { describe, expect, it } from "vitest";
import {
  QB_WAVE1V2_UPLOAD_SECRET_SHA256,
  isQbWave1V2UploadSecret,
} from "@/lib/quick-bites/wave1v2-upload-auth";

describe("Quick Bites wave 1 v2 upload secret", () => {
  it("stores only the approved sha256 and compares digests", () => {
    expect(QB_WAVE1V2_UPLOAD_SECRET_SHA256).toBe(
      "90ccab7b7e06aa02c0285e300dba62334c62f2490fbe4920ce7aa6fb85ab88a6"
    );
    expect(isQbWave1V2UploadSecret(null)).toBe(false);
    expect(isQbWave1V2UploadSecret(undefined)).toBe(false);
    expect(isQbWave1V2UploadSecret("")).toBe(false);
    expect(isQbWave1V2UploadSecret("   ")).toBe(false);
    expect(isQbWave1V2UploadSecret("a")).toBe(false);
    expect(isQbWave1V2UploadSecret("a".repeat(300))).toBe(false);
    expect(isQbWave1V2UploadSecret(` ${"not-the-secret"} `)).toBe(false);
  });
});
