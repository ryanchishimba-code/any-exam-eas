import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

/**
 * Symmetric secret box (AES-256-GCM) for encrypting sensitive values at rest —
 * e.g. brand social channel tokens in `social_accounts`.
 *
 * Key material comes from SOCIAL_TOKEN_ENC_KEY (any length; stretched with
 * scrypt to 32 bytes). Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * Ciphertext format (single base64 string): iv(12) | authTag(16) | ciphertext.
 * NEVER log plaintext or send decrypted tokens to client components.
 */

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
// Static salt — fine here because the env key is already high-entropy; scrypt is
// used only to normalize arbitrary key strings to a 32-byte buffer.
const KEY_SALT = "anyexameasy.social.v1";

function getKey(): Buffer {
  const secret = process.env.SOCIAL_TOKEN_ENC_KEY;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SOCIAL_TOKEN_ENC_KEY is missing or too short — set a 32-byte random key to store social tokens."
    );
  }
  return scryptSync(secret, KEY_SALT, 32);
}

/** Returns true when a key is configured (use to gate token features gracefully). */
export function isSecretBoxConfigured(): boolean {
  return Boolean(process.env.SOCIAL_TOKEN_ENC_KEY && process.env.SOCIAL_TOKEN_ENC_KEY.length >= 16);
}

export function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptSecret(payload: string): string {
  const key = getKey();
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, IV_BYTES);
  const tag = raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const data = raw.subarray(IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
