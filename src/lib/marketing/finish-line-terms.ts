import { readFileSync } from "node:fs";
import { join } from "node:path";
import { markdownToSimpleHtml } from "@/lib/nclex-study-guide/markdown";

const TERMS_PATH = join(process.cwd(), "src/content/finish-line-refund-terms.md");

const DRAFT_BANNER_RE =
  /^>\s*\*\*DRAFT[\s\S]*?(?:NOT FOR PUBLICATION\.\*\*|REQUIRED\.\*\*)\s*$/gim;

function stripDraftBanners(markdown: string): string {
  return markdown.replace(DRAFT_BANNER_RE, "").trim();
}

/** Replace attorney placeholders; any remaining bracket becomes TBC. */
export function resolveFinishLineTermsPlaceholders(text: string): string {
  let out = text.replace(/\[[^\]]*\]/g, "To be confirmed");
  if (/\[[^\]]*\]/.test(out)) {
    out = out.replace(/\[[^\]]*\]/g, "To be confirmed");
  }
  return out;
}

function loadRawTermsMarkdown(): string {
  return readFileSync(TERMS_PATH, "utf8");
}

export function buildFinishLineTermsHtml(): string {
  const raw = stripDraftBanners(loadRawTermsMarkdown());
  const resolved = resolveFinishLineTermsPlaceholders(raw);
  return markdownToSimpleHtml(resolved);
}
