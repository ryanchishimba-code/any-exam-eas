import { describe, expect, it } from "vitest";
import {
  QB_FNP_PANCE_UPLOAD_SECRET_SHA256,
  isQbFnpPanceUploadSecret,
} from "@/lib/quick-bites/fnp-pance-upload-auth";

describe("Quick Bites FNP/PANCE upload secret", () => {
  it("stores only the approved sha256 and compares digests", () => {
    expect(QB_FNP_PANCE_UPLOAD_SECRET_SHA256).toBe(
      "33a3fd7ae91662c4ba3d0f25243aa2d1be38eeeba1726c86f65ca8094fd31133"
    );
    expect(isQbFnpPanceUploadSecret(null)).toBe(false);
    expect(isQbFnpPanceUploadSecret(undefined)).toBe(false);
    expect(isQbFnpPanceUploadSecret("")).toBe(false);
    expect(isQbFnpPanceUploadSecret("   ")).toBe(false);
    expect(isQbFnpPanceUploadSecret("a")).toBe(false);
    expect(isQbFnpPanceUploadSecret("a".repeat(300))).toBe(false);
    expect(isQbFnpPanceUploadSecret(` ${"not-the-secret"} `)).toBe(false);
  });
});
