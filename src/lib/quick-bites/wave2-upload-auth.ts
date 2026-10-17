import { createHash, timingSafeEqual } from "node:crypto";

/**
 * SHA-256 of the trimmed `x-qb-upload-secret` header.
 * The secret itself is not stored in the repo.
 */
export const QB_WAVE2_UPLOAD_SECRET_SHA256 =
  "a781729b3c1f5bf8345fd8b412a2bc7baadce2dca1ef02346076c5cafb6987d8";

const EXPECTED_DIGEST = Buffer.from(QB_WAVE2_UPLOAD_SECRET_SHA256, "hex");

export function isQbWave2UploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256")
    .update((headerValue ?? "").trim(), "utf8")
    .digest();
  return timingSafeEqual(digest, EXPECTED_DIGEST);
}
