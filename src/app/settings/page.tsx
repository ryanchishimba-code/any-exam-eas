import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export const metadata = {
  title: "Settings — Any Exam Easy",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/settings");

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="apple-display text-2xl">Settings</h1>
      <ul className="mt-8 space-y-3 text-sm">
        <li>
          <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">
            Subscription & billing
          </Link>
        </li>
        <li>
          <Link href="/studygub" className="text-[var(--color-accent)] hover:underline">
            StudyGub
          </Link>
        </li>
      </ul>
    </div>
  );
}
