"use client";

import dynamic from "next/dynamic";

export const ShareFabLazy = dynamic(
  () => import("./ShareFab").then((m) => m.ShareFab),
  { ssr: false }
);
