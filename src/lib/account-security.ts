import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import { isValidPasswordHash } from "@/lib/password-hash";
import { isInternalTestEmail } from "@/lib/test-accounts";

export const RESERVED_EMAIL_MESSAGE =
  "This email domain is reserved for internal testing and cannot be used for public signup.";

export function isReservedInternalEmail(email: string | null | undefined): boolean {
  return isInternalTestEmail(email);
}

/** Staff and seeded test accounts skip subscriber IP/device limits. */
export function canBypassAccountIpLimit(
  email: string | null | undefined,
  role?: string | null
): boolean {
  return isStaffRole(role) || isInternalTestEmail(email);
}

export type CredentialsBlockReason =
  | "deleted"
  | "suspended"
  | "no_password"
  | "invalid_hash";

export function credentialsLoginBlocked(
  user: Pick<User, "accountStatus" | "passwordHash">
): CredentialsBlockReason | null {
  if (isAccountDisabled(user.accountStatus)) {
    return user.accountStatus === "deleted" ? "deleted" : "suspended";
  }
  if (!user.passwordHash) return "no_password";
  if (!isValidPasswordHash(user.passwordHash)) return "invalid_hash";
  return null;
}

export function isAccountDisabled(status: string): boolean {
  return status === "suspended" || status === "deleted";
}

/** Thrown when OAuth targets a suspended or deleted account. */
export class OAuthAccountDisabledError extends Error {
  constructor() {
    super("AccountDisabled");
    this.name = "OAuthAccountDisabledError";
  }
}

/** Public signup and OAuth auto-create must not claim internal test inboxes. */
export function assertPublicSignupEmailAllowed(email: string): void {
  if (isReservedInternalEmail(email)) {
    throw new Error(RESERVED_EMAIL_MESSAGE);
  }
}

/** Drop device/IP session rows after password rotation (limits stale-network lockouts). */
export async function clearAccountDeviceSessions(userId: string): Promise<void> {
  await prisma.userSession.deleteMany({ where: { userId } });
}
