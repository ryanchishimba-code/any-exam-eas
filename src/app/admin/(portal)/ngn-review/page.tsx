import Link from "next/link";
import { notFound } from "next/navigation";
import { isNgnPilotEnabled } from "@/lib/assessment/pilot-flag";
import { loadReviewIndex } from "@/lib/assessment/ngn-store";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "NGN review · Admin",
  robots: { index: false, follow: false },
};

type Search = { batch?: string; status?: string; progress?: string };

export default async function NgnReviewPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  if (!isNgnPilotEnabled()) notFound();
  const params = await searchParams;
  const data = await loadReviewIndex({
    batchId: params.batch || undefined,
    status: params.status || undefined,
    progress: params.progress || undefined,
  });

  return (
    <div className="space-y-6 text-[#0A2540]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#334155]">Internal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">NGN review</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#334155]">
          Draft clinical cases for licensed RN review. Students do not see this page, and nothing here is published.
        </p>
      </header>

      {!data.ok ? (
        <p className="rounded-3xl border border-[#e2e8f0] bg-white p-6 text-sm leading-6" role="status">
          {data.message}
        </p>
      ) : (
        <>
          <form method="get" className="flex flex-wrap items-end gap-3 rounded-3xl border border-[#e2e8f0] bg-white p-4">
            <label className="text-sm font-medium">
              Batch
              <select name="batch" defaultValue={params.batch ?? ""} className="mt-1 block min-h-11 rounded-xl border border-[#e2e8f0] bg-white px-3">
                <option value="">All</option>
                {data.batches.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {batch.batchId} ({batch.itemCount})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Status
              <select name="status" defaultValue={params.status ?? ""} className="mt-1 block min-h-11 rounded-xl border border-[#e2e8f0] bg-white px-3">
                <option value="">All</option>
                {["draft", "in_review", "approved", "pilot", "published", "retired"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Reviewer progress
              <select name="progress" defaultValue={params.progress ?? ""} className="mt-1 block min-h-11 rounded-xl border border-[#e2e8f0] bg-white px-3">
                <option value="">All</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="in_review">In review</option>
                <option value="ready">Gate open</option>
              </select>
            </label>
            <button type="submit" className="min-h-11 rounded-full bg-[#0A2540] px-4 text-sm font-medium text-white">
              Apply
            </button>
          </form>

          {data.rows.length === 0 ? (
            <p className="rounded-3xl border border-[#e2e8f0] bg-white p-6 text-sm leading-6 text-[#334155]">
              No NGN items match these filters. The seed script has not been applied in this database unless a batch is listed above.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-[#e2e8f0] bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-[#334155]">
                    <th scope="col" className="px-4 py-3 font-medium">Item</th>
                    <th scope="col" className="px-4 py-3 font-medium">Format</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">Approvals</th>
                    <th scope="col" className="px-4 py-3 font-medium">Gate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={`${row.id}-${row.version}`} className="border-b border-[#e2e8f0] last:border-0">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link
                          href={`/admin/ngn-review/${encodeURIComponent(row.id)}?version=${row.version}`}
                          className="underline decoration-[#00D4C8] decoration-2 underline-offset-4"
                        >
                          {row.id}
                        </Link>
                        <span className="mt-1 block font-normal text-[#334155]">{row.label}</span>
                      </th>
                      <td className="px-4 py-3">{row.responseFormat}</td>
                      <td className="px-4 py-3">{row.status}</td>
                      <td className="px-4 py-3">
                        {row.approvalCount} of 2
                        <span className="block text-[#334155]">{row.reviewCount} reviews</span>
                      </td>
                      <td className="px-4 py-3">{row.canPublish ? "Open" : "Closed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
