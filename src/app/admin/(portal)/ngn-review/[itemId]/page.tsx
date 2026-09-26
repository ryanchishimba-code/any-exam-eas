import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { RationalePanel } from "@/components/ngn/RationalePanel";
import { SourcesDisclosure } from "@/components/ngn/SourcesDisclosure";
import { ReviewForm } from "@/components/ngn/review/ReviewForm";
import { StandalonePreview } from "@/components/ngn/review/StandalonePreview";
import { isNgnPilotEnabled } from "@/lib/assessment/pilot-flag";
import { loadItemReview } from "@/lib/assessment/ngn-store";
import { perfect } from "@/lib/assessment/scoring/registry";
import { sourceRegistry } from "@/lib/assessment/sources";
import type { NgnItem } from "@/lib/assessment/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "NGN item review · Admin",
  robots: { index: false, follow: false },
};

function KeyBlock({ item }: { item: NgnItem }) {
  let ideal: unknown = null;
  try {
    ideal = perfect(item);
  } catch {
    ideal = null;
  }
  return (
    <pre className="overflow-x-auto rounded-2xl bg-[#f4f6f8] p-4 text-sm leading-6 text-[#0A2540]">
      {JSON.stringify(ideal, null, 2)}
    </pre>
  );
}

export default async function NgnItemReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<{ version?: string }>;
}) {
  if (!isNgnPilotEnabled()) notFound();
  const { itemId } = await params;
  const query = await searchParams;
  const version = Number(query.version ?? "1");
  if (!Number.isInteger(version) || version < 1) notFound();
  const detail = await loadItemReview(decodeURIComponent(itemId), version);
  if (!detail.ok && detail.reason === "missing") notFound();

  if (!detail.ok) {
    return <p className="rounded-3xl border border-[#e2e8f0] bg-white p-6 text-sm text-[#0A2540]">{detail.message}</p>;
  }

  const sourcesById = sourceRegistry(detail.sources);
  const stepIndex = Math.max(0, (detail.item.caseStep ?? 1) - 1);
  let keyed: unknown = undefined;
  try {
    keyed = perfect(detail.item);
  } catch {
    keyed = undefined;
  }

  return (
    <div className="space-y-6 text-[#0A2540]">
      <Link href="/admin/ngn-review" className="text-sm font-medium underline decoration-[#00D4C8] underline-offset-4">
        All NGN items
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#334155]">
            {detail.item.itemType} · {detail.item.responseFormat} · {detail.item.status}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{detail.item.id}</h1>
        </div>
        <div className="rounded-3xl bg-[#0A2540] px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00D4C8]">Publish gate</p>
          <p className="mt-1 text-lg font-semibold">{detail.gate.ok ? "Open" : "Closed"}</p>
          <p className="text-sm text-white/90">
            {detail.gate.approvalCount} of 2 licensed approvals
            {detail.gate.validatorsGreen ? " · validators green" : " · validators need attention"}
          </p>
          <p className="mt-2 text-xs text-white/80">Read only. There is no publish button.</p>
        </div>
      </header>

      {detail.caseDoc ? (
        <CaseStudyPlayer
          caseDoc={detail.caseDoc}
          items={detail.siblings}
          mode="review"
          initialStep={stepIndex}
          attemptSeed={`review-${detail.item.id}`}
          sourcesById={sourcesById}
        />
      ) : (
        <StandalonePreview item={detail.item} sourcesById={sourcesById} />
      )}

      <SourcesDisclosure
        itemReferences={detail.item.references}
        caseReferences={detail.caseDoc?.references}
        sourcesById={sourcesById}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Keyed response</h2>
          <KeyBlock item={detail.item} />
          <h2 className="text-lg font-semibold">RN flags</h2>
          {detail.item.rnFlags.length === 0 ? (
            <p className="text-sm text-[#334155]">No flags.</p>
          ) : (
            <ul className="space-y-2">
              {detail.item.rnFlags.map((flag) => (
                <li key={flag} className="rounded-2xl bg-[#E5FBF9] px-4 py-3 text-sm leading-6">
                  {flag}
                </li>
              ))}
            </ul>
          )}
          <RationalePanel
            item={detail.item}
            response={keyed}
            sourcesById={sourcesById}
            caseReferences={detail.caseDoc?.references}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reviews</h2>
          {detail.reviews.length === 0 ? (
            <p className="text-sm text-[#334155]">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {detail.reviews.map((review) => (
                <li key={review.id} className="rounded-3xl border border-[#e2e8f0] bg-white p-4 text-sm leading-6">
                  <p className="font-semibold">
                    {review.reviewerName} · {review.decision}
                  </p>
                  <p className="text-[#334155]">
                    {review.licenseType} {review.licenseNumber} · {review.licenseState}
                    {review.multistateNlc ? " · NLC" : ""}
                  </p>
                  <p className="text-[#334155]">
                    Nursys {review.nursysVerifiedOn}: {review.nursysResult}
                  </p>
                  <p>{review.minutesSpent} minutes</p>
                  {review.comments ? <p className="mt-2">{review.comments}</p> : null}
                </li>
              ))}
            </ul>
          )}
          {!detail.gate.validatorsGreen ? (
            <ul className="space-y-1 text-sm text-[#9f1239]">
              {detail.gate.errors.slice(0, 8).map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
          <ReviewForm itemId={detail.item.id} itemVersion={detail.item.version} flags={detail.item.rnFlags} />
        </div>
      </section>
    </div>
  );
}
