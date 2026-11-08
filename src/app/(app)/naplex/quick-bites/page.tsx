import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quick Bites: Pharmacy — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default function NaplexQuickBitesPage() {
  return <QuickBitesPage exam="naplex" />;
}
