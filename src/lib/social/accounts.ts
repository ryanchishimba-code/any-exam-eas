import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret, isSecretBoxConfigured } from "@/lib/crypto/secret-box";

/**
 * Brand social-channel accounts for admin publishing (Phase 2: Ayrshare).
 *
 * Tokens are encrypted at rest with AES-256-GCM. Decryption happens ONLY in
 * server-side publishing code — never surfaced to client components. Phase 1
 * exposes connection metadata so the admin UI can show channel status.
 */

export type SocialAccountStatus = {
  platform: string;
  displayName: string | null;
  connected: boolean;
  hasToken: boolean;
  expiresAt: string | null;
  updatedAt: string;
};

/** Connection status for every configured brand channel (no secrets). */
export async function listSocialAccountStatus(): Promise<SocialAccountStatus[]> {
  const rows = await prisma.socialAccount.findMany({ orderBy: { platform: "asc" } });
  return rows.map((row) => ({
    platform: row.platform,
    displayName: row.displayName,
    connected: row.connected,
    hasToken: Boolean(row.accessTokenCipher),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

/** Upsert a brand channel + encrypt its token. Requires SOCIAL_TOKEN_ENC_KEY. */
export async function connectSocialAccount(params: {
  platform: string;
  displayName?: string | null;
  externalId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  scope?: string | null;
  expiresAt?: Date | null;
  createdById?: string | null;
}): Promise<void> {
  if ((params.accessToken || params.refreshToken) && !isSecretBoxConfigured()) {
    throw new Error("SOCIAL_TOKEN_ENC_KEY must be set before storing social tokens.");
  }

  const accessTokenCipher = params.accessToken ? encryptSecret(params.accessToken) : undefined;
  const refreshTokenCipher = params.refreshToken ? encryptSecret(params.refreshToken) : undefined;

  await prisma.socialAccount.upsert({
    where: { platform: params.platform },
    create: {
      platform: params.platform,
      displayName: params.displayName ?? null,
      externalId: params.externalId ?? null,
      accessTokenCipher: accessTokenCipher ?? null,
      refreshTokenCipher: refreshTokenCipher ?? null,
      scope: params.scope ?? null,
      expiresAt: params.expiresAt ?? null,
      connected: Boolean(params.accessToken),
      createdById: params.createdById ?? null,
    },
    update: {
      displayName: params.displayName ?? undefined,
      externalId: params.externalId ?? undefined,
      ...(accessTokenCipher ? { accessTokenCipher, connected: true } : {}),
      ...(refreshTokenCipher ? { refreshTokenCipher } : {}),
      scope: params.scope ?? undefined,
      expiresAt: params.expiresAt ?? undefined,
    },
  });
}

/**
 * Server-only: fetch a decrypted access token for outbound publishing.
 * Returns null if the channel is not connected. Phase 2 (Ayrshare) consumes this.
 */
export async function getDecryptedAccessToken(platform: string): Promise<string | null> {
  const row = await prisma.socialAccount.findUnique({ where: { platform } });
  if (!row?.accessTokenCipher) return null;
  try {
    return decryptSecret(row.accessTokenCipher);
  } catch {
    return null;
  }
}
