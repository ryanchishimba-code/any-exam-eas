/**
 * Validates SEO JSON-LD builders for Rich Results eligibility.
 * Run: node scripts/validate-seo-jsonld.mjs
 */
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Minimal env for getSiteUrl()
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.anyexameasy.com";

async function main() {
  // Dynamic import compiled TS via tsx if available; fallback: read built output
  let builders;
  try {
    const { register } = await import("tsx/esm/api");
    register();
    builders = await import("../src/lib/seo/marketing-metadata.ts");
    const seo = await import("../src/lib/seo.ts");
    const { getResourceArticle } = await import("../src/lib/seo/resources-content.ts");

    const cases = [
      { label: "/pricing", data: builders.buildPricingJsonLd() },
      { label: "/nclex", data: builders.buildExamJsonLd("nclex") },
      {
        label: "/resources/uworld-alternative-multi-exam-prep-2026",
        data: builders.buildArticleJsonLd(
          getResourceArticle("uworld-alternative-multi-exam-prep-2026")
        ),
      },
      { label: "/ (home)", data: seo.buildHomeJsonLd() },
    ];

    const types = (graph) => {
      const g = graph["@graph"] ?? [graph];
      return g.map((n) => n["@type"]).filter(Boolean);
    };

    let ok = true;
    for (const { label, data } of cases) {
      const found = types(data);
      console.log(`\n=== ${label} ===`);
      console.log("Types:", found.join(", "));
      const required = {
        "/pricing": ["BreadcrumbList", "Product", "FAQPage"],
        "/nclex": ["BreadcrumbList", "Course", "FAQPage", "HowTo"],
        "/resources/uworld-alternative-multi-exam-prep-2026": ["BreadcrumbList", "Article"],
        "/ (home)": ["Organization", "WebSite", "SoftwareApplication", "Product", "HowTo"],
      };
      for (const t of required[label] ?? []) {
        if (!found.includes(t)) {
          console.error(`  MISSING: ${t}`);
          ok = false;
        } else {
          console.log(`  ✓ ${t}`);
        }
      }
    }

    console.log(ok ? "\n✅ All required schema types present." : "\n❌ Validation failed.");
    process.exit(ok ? 0 : 1);
  } catch (e) {
    console.error("Run with: npx tsx scripts/validate-seo-jsonld.mjs");
    console.error(e.message);
    process.exit(1);
  }
}

main();
