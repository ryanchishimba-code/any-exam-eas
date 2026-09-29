import type { Metadata } from "next";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: { absolute: "Page not found" },
  robots: { index: false, follow: false },
};

/** Shown when merch is off or no product has a Fourthwall URL. */
export default function MerchNotFound() {
  return <NotFound />;
}
