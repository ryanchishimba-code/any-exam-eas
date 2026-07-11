import Link from "next/link";
import {
  ListChecks,
  Quote,
  Share2,
  Youtube,
  ArrowLeft,
  Newspaper,
} from "lucide-react";
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
          Manage marketing content and the question bank — no code required.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={ROUTES.admin.blog}
          className="group rounded-xl border border-indigo-200/60 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-500/20 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <Newspaper className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-zinc-100">
                Blog
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Live at /blog</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Write, publish, and SEO-optimize study guides and product updates.
          </p>
        </Link>

        <Link
          href={ROUTES.admin.testimonials}
          className="group rounded-xl border border-indigo-200/60 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-500/20 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <Quote className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-zinc-100">
                Testimonials
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Live on landing page</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Add quotes, photos, and outcomes. Approve before they appear publicly.
          </p>
        </Link>

        <Link
          href={ROUTES.admin.questions}
          className="group rounded-xl border border-indigo-200/60 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-500/20 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <ListChecks className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-zinc-100">
                Question bank
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">All exams</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Search, filter, bulk-approve, and add MCQs with live student preview.
          </p>
        </Link>

        <Link
          href={ROUTES.admin.social}
          className="group rounded-xl border border-indigo-200/60 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-500/20 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
              <Share2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-zinc-100">
                Social &amp; community
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Moderation &amp; engagement</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Approve community posts, publish official updates, and track share engagement.
          </p>
        </Link>

        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
              <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-zinc-100">YouTube</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Coming soon</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            Curate exam prep videos and embed on Resources.
          </p>
        </section>
      </div>
    </div>
  );
}
