import { redirect } from "next/navigation";

/** Legacy hub URL — individual articles remain at /resources/[slug]. */
export default function ResourcesHubRedirect() {
  redirect("/toolkit");
}
