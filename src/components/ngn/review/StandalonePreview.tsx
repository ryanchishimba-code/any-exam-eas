"use client";

import { useState } from "react";
import { ItemRenderer } from "@/components/ngn/ItemRenderer";
import type { NgnItem, SourceRef } from "@/lib/assessment/types";

export function StandalonePreview({
  item,
  sourcesById,
}: {
  item: NgnItem;
  sourcesById: Record<string, Pick<SourceRef, "title" | "url">>;
}) {
  const [response, setResponse] = useState<unknown>(undefined);
  return (
    <section className="rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6">
      <h2 className="text-[19px] font-semibold leading-7 text-[#0A2540]">{item.stem}</h2>
      <div className="mt-5">
        <ItemRenderer
          item={item}
          seed={`review-${item.id}`}
          response={response}
          onChange={setResponse}
          sourcesById={sourcesById}
        />
      </div>
    </section>
  );
}
