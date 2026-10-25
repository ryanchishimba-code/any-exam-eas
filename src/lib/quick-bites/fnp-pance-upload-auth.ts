import { createHash, timingSafeEqual } from "node:crypto";

/**
 * SHA-256 of the trimmed `x-qb-upload-secret` header.
 * The secret itself is not stored in the repo.
 */
export const QB_FNP_PANCE_UPLOAD_SECRET_SHA256 =
  "33a3fd7ae91662c4ba3d0f25243aa2d1be38eeeba1726c86f65ca8094fd31133";

const EXPECTED_DIGEST = Buffer.from(QB_FNP_PANCE_UPLOAD_SECRET_SHA256, "hex");

export function isQbFnpPanceUploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256")
    .update((headerValue ?? "").trim(), "utf8")
    .digest();
  return timingSafeEqual(digest, EXPECTED_DIGEST);
}
