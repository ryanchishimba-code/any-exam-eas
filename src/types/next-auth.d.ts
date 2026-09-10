import "next-auth";
import type { LoginReactivationSnapshot, LoginRoutingSnapshot } from "@/lib/auth/login-routing-snapshot";

declare module "next-auth" {
  interface User {
    role?: string;
    rememberMe?: boolean;
    /** Populated at authorize / OAuth link — copied onto the JWT once. */
    loginRouting?: LoginRoutingSnapshot;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      hasAccess?: boolean;
      hasAppAccess?: boolean;
      subscriptionStatus?: string;
      trialDaysRemaining?: number | null;
      examSlug?: string | null;
      reactivation?: LoginReactivationSnapshot | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    hasAccess?: boolean;
    hasAppAccess?: boolean;
    subscriptionStatus?: string;
    trialDaysRemaining?: number | null;
    examSlug?: string | null;
    reactivation?: LoginReactivationSnapshot | null;
  }
}
