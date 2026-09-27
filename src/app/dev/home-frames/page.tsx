import { notFound } from "next/navigation";
import { HomeFrames } from "./frames";

export const metadata = {
  title: "Home frame capture",
  robots: { index: false, follow: false },
};

/** Local capture route for homepage product images. Not a public page. */
export default function HomeFramesPage() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }
  return <HomeFrames />;
}
