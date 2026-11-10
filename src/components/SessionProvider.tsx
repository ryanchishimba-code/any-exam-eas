"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <Provider session={session} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      {children}
    </Provider>
  );
}
