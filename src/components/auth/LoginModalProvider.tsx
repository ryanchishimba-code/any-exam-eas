"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DEFAULT_AUTH_CALLBACK, sanitizeCallbackUrl } from "@/lib/client/auth-routes";

// This provider wraps every route, so a static import put the modal's
// framer-motion dependency in the shared entry chunk for visitors who never
// open it. Load on first open instead, then keep it mounted so AnimatePresence
// can still play the exit animation.
const LoginModal = dynamic(() => import("./LoginModal").then((m) => m.LoginModal), {
  ssr: false,
});

type LoginModalContextValue = {
  open: boolean;
  openLoginModal: (callbackUrl?: string) => void;
  closeLoginModal: () => void;
  callbackUrl: string;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState(DEFAULT_AUTH_CALLBACK);

  const openLoginModal = useCallback((url = DEFAULT_AUTH_CALLBACK) => {
    setCallbackUrl(url);
    setMounted(true);
    setOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      openLoginModal(
        sanitizeCallbackUrl(searchParams.get("callbackUrl"))
      );
    }
  }, [searchParams, openLoginModal]);

  const value = useMemo(
    () => ({ open, openLoginModal, closeLoginModal, callbackUrl }),
    [open, openLoginModal, closeLoginModal, callbackUrl]
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      {mounted ? (
        <LoginModal
          open={open}
          onClose={closeLoginModal}
          callbackUrl={callbackUrl}
        />
      ) : null}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return ctx;
}

/** Safe hook when provider may be absent (optional use). */
export function useLoginModalOptional() {
  return useContext(LoginModalContext);
}
