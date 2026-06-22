import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/testimonials/TestimonialsManager";

export const metadata: Metadata = {
  title: "Testimonials · Admin",
  robots: { index: false, follow: false },
};

// Auth is enforced by the (portal) layout's AdminStaffGate — no per-page check needed.
export default function AdminTestimonialsPage() {
  return <TestimonialsManager />;
}
