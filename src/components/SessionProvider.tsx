"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { initialClientSession } from "@/lib/auth/client-session";

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <Provider session={initialClientSession(session)} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      {children}
    </Provider>
  );
}
