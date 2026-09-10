import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import LinkedIn from "next-auth/providers/linkedin";
import { authConfig } from "@/auth.config";
import { authenticateCredentials } from "@/lib/user-auth";
import { loginSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateGoogleUser, OAuthLinkBlockedError } from "@/lib/oauth-user";
import { OAuthAccountDisabledError } from "@/lib/account-security";
import {
  scheduleCredentialsLoginSideEffects,
  scheduleOAuthLoginTouch,
} from "@/lib/auth/login-side-effects";
import {
  loadLoginRoutingSnapshot,
  type LoginRoutingSnapshot,
} from "@/lib/auth/login-routing-snapshot";
import {
  checkAndRecordAccountIp,
} from "@/lib/account-ip-limit";
import { formatDisplayName } from "@/lib/display-name";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import type { JWT } from "next-auth/jwt";

function applyLoginRoutingToToken(token: JWT, routing: LoginRoutingSnapshot): void {
  token.hasAccess = routing.hasAccess;
  token.hasAppAccess = routing.hasAppAccess;
  token.subscriptionStatus = routing.status;
  token.trialDaysRemaining = routing.daysRemaining;
  token.examSlug = routing.examSlug;
  token.reactivation = routing.reactivation;
}

class DatabaseUnavailable extends CredentialsSignin {
  code = "database_unavailable";
}

export { registerUser } from "@/lib/user-auth";

class TooManyIpAddresses extends CredentialsSignin {
  code = "too_many_ips";
}

class OAuthOnlyAccount extends CredentialsSignin {
  code = "oauth_only";
}

class PasswordResetRequired extends CredentialsSignin {
  code = "password_reset_required";
}

class AccountDisabled extends CredentialsSignin {
  code = "account_disabled";
}

const SESSION_DAY_SEC = 24 * 60 * 60;
const SESSION_MONTH_SEC = 30 * 24 * 60 * 60;

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

const appleEnabled =
  !!process.env.APPLE_ID && !!process.env.APPLE_SECRET;

const linkedinEnabled =
  !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
  ...(googleEnabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : []),
  ...(appleEnabled
    ? [
        Apple({
          clientId: process.env.APPLE_ID!,
          clientSecret: process.env.APPLE_SECRET!,
        }),
      ]
    : []),
  ...(linkedinEnabled
    ? [
        LinkedIn({
          clientId: process.env.LINKEDIN_CLIENT_ID!,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
      ]
    : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      async authorize(credentials, request) {
        try {
        const { ensureNeonReady } = await import("@/lib/neon-warmup");
        await ensureNeonReady("auth.credentials");

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const authResult = await authenticateCredentials(
          parsed.data.email,
          parsed.data.password
        );
        if (!authResult.ok) {
          if (authResult.reason === "no_password") throw new OAuthOnlyAccount();
          if (authResult.reason === "invalid_hash") throw new PasswordResetRequired();
          if (authResult.reason === "blocked") throw new AccountDisabled();
          return null;
        }
        const user = authResult.user;

        const req = request as Request | undefined;
        const role = user.role ?? "user";

        const [ipCheck, loginRouting] = await Promise.all([
          checkAndRecordAccountIp(user.id, role, req, undefined, user.email),
          loadLoginRoutingSnapshot(user.id, user.email),
        ]);
        if (!ipCheck.ok) throw new TooManyIpAddresses();

        scheduleCredentialsLoginSideEffects(user.id, role, req);

        const rememberMe =
          credentials?.rememberMe === "true" || credentials?.rememberMe === true;

        return {
          id: user.id,
          email: user.email,
          name: formatDisplayName(user.name) ?? user.name,
          role,
          rememberMe,
          loginRouting,
        };
        } catch (err) {
          if (err instanceof DbUnavailableError || isTransientDbError(err)) {
            throw new DatabaseUnavailable();
          }
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      const oauthProviders = ["google", "apple", "linkedin"] as const;
      type OAuthProvider = (typeof oauthProviders)[number];
      const isOAuth = (p?: string): p is OAuthProvider =>
        oauthProviders.includes(p as OAuthProvider);

      if (isOAuth(account?.provider) && user.email) {
        const oauthProfile = profile as { sub?: string } | undefined;
        try {
          const linked = await findOrCreateGoogleUser({
            email: user.email,
            name: user.name,
            image: user.image,
            providerAccountId: oauthProfile?.sub ?? user.email,
            provider: account!.provider as OAuthProvider,
          });
          user.id = linked.id;
          (user as { role?: string }).role = linked.role;

          const [ipCheck, loginRouting] = await Promise.all([
            checkAndRecordAccountIp(
              linked.id,
              linked.role,
              undefined,
              undefined,
              user.email
            ),
            loadLoginRoutingSnapshot(linked.id, user.email),
          ]);
          if (!ipCheck.ok) {
            return `/login?error=${ipCheck.reason}`;
          }
          user.loginRouting = loginRouting;
          scheduleOAuthLoginTouch(linked.id);
        } catch (e) {
          if (e instanceof OAuthLinkBlockedError || e instanceof OAuthAccountDisabledError) {
            return false;
          }
          if (e instanceof DbUnavailableError || isTransientDbError(e)) {
            return "/login?error=database_unavailable";
          }
          throw e;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role ?? "user";
        const remember = user.rememberMe === true;
        const maxAge = remember ? SESSION_MONTH_SEC : SESSION_DAY_SEC;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;

        if (user.loginRouting) {
          applyLoginRoutingToToken(token, user.loginRouting);
        } else {
          // Credentials always attach loginRouting; OAuth should too via signIn.
          // Soft-fill once if missing so post-login still avoids status APIs.
          try {
            const routing = await loadLoginRoutingSnapshot(
              user.id,
              user.email
            );
            applyLoginRoutingToToken(token, routing);
          } catch (error) {
            console.warn(
              "[auth/jwt] login routing snapshot unavailable:",
              error instanceof Error ? error.message : error
            );
          }
        }
      } else if (
        (account?.provider === "google" ||
          account?.provider === "apple" ||
          account?.provider === "linkedin") &&
        token.email &&
        !token.id
      ) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: String(token.email).toLowerCase() },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            const routing = await loadLoginRoutingSnapshot(
              dbUser.id,
              String(token.email)
            );
            applyLoginRoutingToToken(token, routing);
          }
        } catch (error) {
          console.warn(
            "[auth/jwt] user lookup unavailable:",
            error instanceof Error ? error.message : error
          );
        }
      } else if (token.id && token.exp == null) {
        token.exp = Math.floor(Date.now() / 1000) + SESSION_DAY_SEC;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "user";
        if (session.user.name) {
          session.user.name = formatDisplayName(session.user.name) ?? session.user.name;
        }
        if (typeof token.hasAccess === "boolean") {
          session.user.hasAccess = token.hasAccess;
        }
        if (typeof token.hasAppAccess === "boolean") {
          session.user.hasAppAccess = token.hasAppAccess;
        }
        if (token.subscriptionStatus != null) {
          session.user.subscriptionStatus = token.subscriptionStatus;
        }
        if (token.trialDaysRemaining !== undefined) {
          session.user.trialDaysRemaining = token.trialDaysRemaining ?? null;
        }
        if (token.examSlug !== undefined) {
          session.user.examSlug = token.examSlug ?? null;
        }
        if (token.reactivation !== undefined) {
          session.user.reactivation = token.reactivation ?? null;
        }
      }
      return session;
    },
  },
});
