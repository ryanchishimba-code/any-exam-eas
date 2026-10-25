"use client";

export function AdminStudyProofExportButton({ userId }: { userId: string }) {
  async function exportProof() {
    const res = await fetch(`/api/admin/users/${userId}/study-proof/export`);
    if (!res.ok) return;
    const body = (await res.json()) as {
      csv: string;
      summary: unknown;
      filenameBase: string;
    };
    const stamp = body.filenameBase;
    const csvBlob = new Blob([body.csv], { type: "text/csv;charset=utf-8" });
    const jsonBlob = new Blob([JSON.stringify(body.summary, null, 2)], {
      type: "application/json",
    });
    const download = (blob: Blob, name: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    };
    download(csvBlob, `${stamp}-timeline.csv`);
    download(jsonBlob, `${stamp}-summary.json`);
  }

  return (
    <button
      type="button"
      onClick={() => void exportProof()}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
    >
      Export proof
    </button>
  );
}
