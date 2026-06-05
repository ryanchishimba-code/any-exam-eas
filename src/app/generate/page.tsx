import { redirect } from "next/navigation";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

export default function GenerateRedirectPage() {
  redirect(STUDYGUB_PATH);
}
