import { redirect } from "next/navigation";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

export default function ProgressRedirectPage() {
  redirect(STUDYGUB_PATH);
}
