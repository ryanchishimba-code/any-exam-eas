import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Video Quick Bites — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default function NclexQuickBitesPage() {
  return <QuickBitesPage exam="nclex" />;
}
