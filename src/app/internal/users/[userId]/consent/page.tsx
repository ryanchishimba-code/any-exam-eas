import { NextResponse } from "next/server";
import Link from "next/link";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getUserConsentSnapshot } from "@/lib/legal/consent-record";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";

type Props = { params: Promise<{ userId: string }> };

export default async function UserConsentPage({ params }: Props) {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">Administrator access required to view consent records.</p>
    );
  }

  const { userId } = await params;
  const snapshot = await getUserConsentSnapshot(userId);
  if (!snapshot) {
    return <p className="text-sm text-black/60">User not found.</p>;
  }

  const accepted = new Date(snapshot.acceptedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-black/45">Admin · Consent vault</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{snapshot.email}</h1>
          <p className="mt-1 text-sm text-black/55">
            {LEGAL_ENTITY.productName} · Terms &amp; privacy attestation
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/internal/users/${userId}`}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium hover:bg-black/[0.03]"
          >
            ← User profile
          </Link>
          <a
            href={`/api/internal/users/${userId}/consent?format=html`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/90"
          >
            Open printable record
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black/45">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Name</dt>
              <dd className="font-medium">{snapshot.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Date of birth</dt>
              <dd className="font-medium">{snapshot.dateOfBirth}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">User ID</dt>
              <dd className="font-mono text-xs">{snapshot.userId}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black/45">Consent</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Accepted</dt>
              <dd className="font-medium">{accepted}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Terms version</dt>
              <dd className="font-medium">{snapshot.termsVersion}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Signup method</dt>
              <dd className="font-medium capitalize">{snapshot.signupMethod}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Record</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    snapshot.source === "recorded"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {snapshot.source === "recorded" ? "On file" : "Inferred"}
                </span>
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 text-sm text-black/75">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
          Content provider &amp; exam disclaimer
        </h2>
        <p className="mt-2">{LEGAL_DISCLAIMERS.contentProvider}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.notOfficialExamContent}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.supplementaryStudyRequired}</p>
      </section>

      <section className="rounded-2xl border border-dashed border-black/15 bg-black/[0.02] p-5 text-sm text-black/70">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-black/45">
          Attestations accepted at registration
        </h2>
        <p className="mt-1 text-xs text-black/45">
          Attestation version: {snapshot.attestationVersion}
          {snapshot.source === "inferred" ? " · Inferred record (full text shown for reference)" : ""}
        </p>
        <ol className="mt-3 list-decimal space-y-2.5 pl-5">
          {snapshot.attestations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        {snapshot.ipAddress ? (
          <p className="mt-4 text-xs text-black/45">Captured IP: {snapshot.ipAddress}</p>
        ) : null}
      </section>
    </div>
  );
}
