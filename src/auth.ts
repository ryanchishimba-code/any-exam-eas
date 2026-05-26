import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import { verifyUserPassword, recordUserLogin } from "@/lib/user-auth";
import { loginSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateGoogleUser } from "@/lib/oauth-user";
import {
  trackEvent,
  logActivity,
  startUserSession,
} from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { isStaffRole } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";

export { registerUser } from "@/lib/user-auth";

const SESSION_DAY_SEC = 24 * 60 * 60;
const SESSION_MONTH_SEC = 30 * 24 * 60 * 60;

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
  ...(googleEnabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
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
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await verifyUserPassword(
          parsed.data.email,
          parsed.data.password
        );
        if (!user) return null;

        if (user.accountStatus === "suspended") return null;

        await recordUserLogin(user.id);

        const req = request as Request | undefined;
        const sessionId = await startUserSession(user.id, req);
        trackEvent({
          userId: user.id,
          sessionId,
          eventType: EVENT_TYPES.USER_LOGIN,
          category: "auth",
          req,
        });
        void logActivity({
          userId: user.id,
          action: "login",
          summary: "Signed in with email and password",
        });

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        const role = dbUser?.role ?? "user";

        if (isStaffRole(role)) {
          void logAdminAction({
            actorId: user.id,
            action: "STAFF_LOGIN",
            req,
            metadata: { method: "credentials" },
          });
        }

        const rememberMe =
          credentials?.rememberMe === "true" || credentials?.rememberMe === true;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
          rememberMe,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        const googleProfile = profile as { sub?: string } | undefined;
        const linked = await findOrCreateGoogleUser({
          email: user.email,
          name: user.name,
          image: user.image,
          providerAccountId: googleProfile?.sub ?? user.email,
        });
        const dbUser = await prisma.user.findUnique({
          where: { id: linked.id },
          select: { accountStatus: true },
        });
        if (dbUser?.accountStatus === "suspended") return false;
        user.id = linked.id;
        (user as { role?: string }).role = linked.role;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        const remember = (user as { rememberMe?: boolean }).rememberMe === true;
        const maxAge = remember ? SESSION_MONTH_SEC : SESSION_DAY_SEC;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      } else if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: String(token.email).toLowerCase() },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
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
      }
      return session;
    },
  },
});
