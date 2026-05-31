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
import { useSearchParams } from "next/navigation";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { LoginModal } from "./LoginModal";

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
  const [callbackUrl, setCallbackUrl] = useState("/study");

  const openLoginModal = useCallback((url = "/study") => {
    setCallbackUrl(url);
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
      <LoginModal
        open={open}
        onClose={closeLoginModal}
        callbackUrl={callbackUrl}
      />
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
