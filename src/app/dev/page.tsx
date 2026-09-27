import { notFound } from "next/navigation";

/** Dev fixtures are nested routes. The index is not a public page. */
export default function DevIndexPage() {
  notFound();
}
