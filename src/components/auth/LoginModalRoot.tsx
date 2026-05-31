"use client";

import { Suspense, useEffect } from "react";
import { touchReturningVisit } from "@/lib/client/returning-user";
import { LoginModalProvider } from "./LoginModalProvider";

function ReturningUserWarmup() {
  useEffect(() => {
    touchReturningVisit();
  }, []);
  return null;
}

export function LoginModalRoot({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <LoginModalProvider>
        <ReturningUserWarmup />
        {children}
      </LoginModalProvider>
    </Suspense>
  );
}
