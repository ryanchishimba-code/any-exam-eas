"use client";

import { useCallback, useState } from "react";
import { signOutAndCleanup, type SignOutOptions } from "./sign-out";

export function useSignOutConfirm(options: SignOutOptions = {}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const requestSignOut = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const cancelSignOut = useCallback(() => {
    if (signingOut) return;
    setConfirmOpen(false);
  }, [signingOut]);

  const confirmSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    await signOutAndCleanup(options);
    setSigningOut(false);
    setConfirmOpen(false);
  }, [options, signingOut]);

  return {
    confirmOpen,
    signingOut,
    requestSignOut,
    cancelSignOut,
    confirmSignOut,
  };
}
