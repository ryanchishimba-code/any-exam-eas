import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TourPreview } from "@/components/onboarding/TourPreview";

export const metadata = {
  title: "Tour preview",
  robots: { index: false, follow: false },
};

/** Local/dev fixture for tour screenshots. Not available in production. */
export default function TourPreviewPage() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <TourPreview />
    </Suspense>
  );
}
