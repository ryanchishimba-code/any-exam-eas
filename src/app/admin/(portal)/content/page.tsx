import Link from "next/link";
import { FileText, Youtube, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Content Management — Admin",
};

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href={ROUTES.admin.root}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to overview
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
          Content management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Blog posts and YouTube resources — CMS integration coming soon.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800">
              <FileText className="h-5 w-5 text-slate-600 dark:text-zinc-300" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-zinc-100">Blog</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Articles & SEO landing pages</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Placeholder — wire to your headless CMS or markdown content repo. Track{" "}
            <code className="text-xs">cta_clicked</code> on publish CTAs when live.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
              <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-zinc-100">YouTube</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Video library & embeds</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Placeholder — curate exam prep videos and embed on Resources. Top-performing content will
            surface in admin analytics once view events are tracked.
          </p>
        </section>
      </div>
    </div>
  );
}
