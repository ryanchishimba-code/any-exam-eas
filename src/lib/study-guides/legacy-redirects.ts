/** Old reader URLs. No app imports, so next.config can load this file. */

export function legacyStudyGuideRedirects(): {
  source: string;
  destination: string;
  statusCode: 301;
}[] {
  const boards = [
    ["nclex", "/nclex-study-guide"],
    ["naplex", "/naplex-study-guide"],
    ["pance", "/pance-study-guide"],
    ["aanp-fnp", "/aanp-fnp-study-guide"],
    ["npte-pt", "/npte-pt-study-guide"],
  ] as const;
  const rules: { source: string; destination: string; statusCode: 301 }[] = [];
  for (const [id, destination] of boards) {
    rules.push({ source: `/${id}/study-guide`, destination, statusCode: 301 });
    rules.push({ source: `/${id}/study-guide/:path*`, destination, statusCode: 301 });
  }
  rules.push({ source: "/usmle/study-guide", destination: "/usmle-study-guide", statusCode: 301 });
  for (const step of ["step-1", "step-2-ck", "step-3"]) {
    rules.push({
      source: `/usmle/study-guide/${step}`,
      destination: `/usmle-study-guide/${step}`,
      statusCode: 301,
    });
    rules.push({
      source: `/usmle/study-guide/${step}/:path*`,
      destination: `/usmle-study-guide/${step}`,
      statusCode: 301,
    });
  }
  rules.push({
    source: "/usmle/study-guide/:path*",
    destination: "/usmle-study-guide",
    statusCode: 301,
  });
  return rules;
}
