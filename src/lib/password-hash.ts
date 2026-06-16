import bcrypt from "bcryptjs";

export const BCRYPT_ROUNDS = 12;
export const PASSWORD_ALGO = "bcrypt_12" as const;

const BCRYPT_HASH_RE = /^\$2[aby]\$\d{2}\$.{53}$/;

export function isValidPasswordHash(hash: string | null | undefined): boolean {
  return typeof hash === "string" && BCRYPT_HASH_RE.test(hash);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string | null | undefined
): Promise<boolean> {
  if (!plain || !isValidPasswordHash(hash)) return false;
  try {
    return await bcrypt.compare(plain, hash!);
  } catch {
    return false;
  }
}

export function passwordCredentialFields(passwordHash: string): {
  passwordHash: string;
  passwordAlgo: typeof PASSWORD_ALGO;
  passwordUpdatedAt: Date;
} {
  return {
    passwordHash,
    passwordAlgo: PASSWORD_ALGO,
    passwordUpdatedAt: new Date(),
  };
}
