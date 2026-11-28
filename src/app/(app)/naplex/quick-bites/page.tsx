import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Quick Bites: Pharmacy — AnyExamEasy" },
  robots: { index: false, follow: false },
};

export default function NaplexQuickBitesPage() {
  return <QuickBitesPage exam="naplex" />;
}
