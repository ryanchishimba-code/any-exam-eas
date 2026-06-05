import { redirect } from "next/navigation";

/** Legacy research-exam route — question bank practice replaced this flow. */
export default function GeneratePage() {
  redirect("/study/practice?mode=bank");
}
