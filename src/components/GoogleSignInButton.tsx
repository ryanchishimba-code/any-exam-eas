"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/Button";

export function GoogleSignInButton({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      onClick={() => void signIn("google", { callbackUrl })}
    >
      Continue with Google
    </Button>
  );
}
