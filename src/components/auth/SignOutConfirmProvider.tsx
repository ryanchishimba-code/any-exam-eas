"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SignOutConfirmDialog } from "@/components/auth/SignOutConfirmDialog";
import { signOutAndCleanup, type SignOutOptions } from "@/lib/client/sign-out";

type SignOutConfirmContextValue = {
  signingOut: boolean;
  requestSignOut: (options?: SignOutOptions) => void;
};

const SignOutConfirmContext = createContext<SignOutConfirmContextValue | null>(null);

const DEFAULT_OPTIONS: SignOutOptions = { callbackUrl: "/", redirect: true };

export function SignOutConfirmProvider({ children }: { children: ReactNode }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const optionsRef = useRef<SignOutOptions>(DEFAULT_OPTIONS);

  const requestSignOut = useCallback((options?: SignOutOptions) => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options };
    setConfirmOpen(true);
  }, []);

  const cancelSignOut = useCallback(() => {
    if (signingOut) return;
    setConfirmOpen(false);
  }, [signingOut]);

  const confirmSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    await signOutAndCleanup(optionsRef.current);
    setSigningOut(false);
    setConfirmOpen(false);
  }, [signingOut]);

  const value = useMemo(
    () => ({ signingOut, requestSignOut }),
    [requestSignOut, signingOut]
  );

  return (
    <SignOutConfirmContext.Provider value={value}>
      {children}
      <SignOutConfirmDialog
        open={confirmOpen}
        loading={signingOut}
        onCancel={cancelSignOut}
        onConfirm={() => void confirmSignOut()}
      />
    </SignOutConfirmContext.Provider>
  );
}

export function useSignOutConfirm(options: SignOutOptions = DEFAULT_OPTIONS) {
  const ctx = useContext(SignOutConfirmContext);
  if (!ctx) {
    throw new Error("useSignOutConfirm must be used within SignOutConfirmProvider");
  }

  const callbackUrl = options.callbackUrl ?? DEFAULT_OPTIONS.callbackUrl;
  const redirect = options.redirect ?? DEFAULT_OPTIONS.redirect;

  const requestSignOut = useCallback(() => {
    ctx.requestSignOut({ callbackUrl, redirect });
  }, [callbackUrl, ctx, redirect]);

  return {
    signingOut: ctx.signingOut,
    requestSignOut,
  };
}
