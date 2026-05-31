"use client";

import { Suspense, useEffect } from "react";
import { touchReturningVisit } from "@/lib/client/returning-user";
import { LoginModalProvider } from "./LoginModalProvider";
import { SignOutConfirmProvider } from "./SignOutConfirmProvider";

function ReturningUserWarmup() {
  useEffect(() => {
    touchReturningVisit();
  }, []);
  return null;
}

export function LoginModalRoot({ children }: { children: React.ReactNode }) {
  return (
    <SignOutConfirmProvider>
      <Suspense fallback={children}>
        <LoginModalProvider>
          <ReturningUserWarmup />
          {children}
        </LoginModalProvider>
      </Suspense>
    </SignOutConfirmProvider>
  );
}
