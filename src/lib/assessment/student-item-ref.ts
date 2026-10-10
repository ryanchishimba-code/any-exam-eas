import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from "node:crypto";

/**
 * Opaque ids for one practice session. The browser never sees catalog slot
 * ids (NC003-S1, C01). Scoring and attempt history decrypt them on the server.
 */
const ALGO = "aes-256-gcm";
const SALT = "anyexameasy.student-item.v1";

type KeyCache = { secret: string; key: Buffer };
let cached: KeyCache | null = null;

function secretMaterial(): string {
  const configured = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
  if (configured.length >= 16) return configured;
  if (process.env.VITEST) return "vitest-student-item-ref-key";
  throw new Error("AUTH_SECRET is required to issue student item ids.");
}

function key(): Buffer {
  const secret = secretMaterial();
  if (cached?.secret === secret) return cached.key;
  const next = scryptSync(secret, SALT, 32);
  cached = { secret, key: next };
  return next;
}

export type StudentItemRef = { id: string; version: number };

/**
 * A new ciphertext each call, so the same slot is not recognizable across sessions.
 * Pass `stable` to keep one sitting's id fixed across reloads. The value should
 * include the session id so a different sitting still gets a different seal.
 */
export function sealStudentRef(ref: StudentItemRef, stable?: string): string {
  const iv = stable
    ? createHmac("sha256", key()).update(stable).digest().subarray(0, 12)
    : randomBytes(12);
  const cipher = createCipheriv(ALGO, key(), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify({ i: ref.id, v: ref.version }), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return ["s1", iv.toString("base64url"), tag.toString("base64url"), body.toString("base64url")].join(".");
}

export function openStudentRef(token: string): StudentItemRef | null {
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "s1") return null;
  const iv = parts[1];
  const tag = parts[2];
  const body = parts[3];
  if (!iv || !tag || !body) return null;
  try {
    const decipher = createDecipheriv(ALGO, key(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const json = Buffer.concat([
      decipher.update(Buffer.from(body, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(json) as { i?: unknown; v?: unknown };
    if (typeof parsed.i !== "string" || !parsed.i.trim()) return null;
    if (typeof parsed.v !== "number" || !Number.isInteger(parsed.v) || parsed.v < 1) return null;
    return { id: parsed.i, version: parsed.v };
  } catch {
    return null;
  }
}
