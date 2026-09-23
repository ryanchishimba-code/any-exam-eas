/**
 * Detectable text defects: empty copy, broken markdown, truncated choices,
 * and encoding glitches. Board-generic — no clinical judgment.
 */

export type TextLintIssue = {
  area: "text";
  code:
    | "empty_stem"
    | "empty_option"
    | "empty_explanation"
    | "broken_markdown"
    | "truncated_option"
    | "letter_only_option"
    | "encoding_glitch";
  severity: "error" | "warn";
  message: string;
  option?: string;
};

const REPLACEMENT_OR_CONTROL = /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
const MOJIBAKE =
  /(?:Ã[\u0080-\u00FF]|Â[\u0080-\u00FF]|â€™|â€œ|â€\u009d|â€“|â€”|ï¿½|&amp;|&nbsp;|\\u00[0-9a-fA-F]{2})/;

const TRUNCATION_TAIL =
  /(?:\.{3}|…)\s*$|(?:^|\s)(?:and|or|the|a|an|to|of|with|for)\s*$|[([]\s*$/i;

function push(issues: TextLintIssue[], issue: TextLintIssue) {
  issues.push(issue);
}

function lintEncoding(text: string, where: string, option?: string): TextLintIssue | null {
  if (!text) return null;
  if (REPLACEMENT_OR_CONTROL.test(text) || MOJIBAKE.test(text)) {
    return {
      area: "text",
      code: "encoding_glitch",
      severity: "error",
      message: `${where} has an encoding glitch (replacement character, control character, or mojibake).`,
      option,
    };
  }
  return null;
}

function lintMarkdown(text: string, where: string): TextLintIssue | null {
  if (!text.trim()) return null;
  const fences = text.match(/```/g)?.length ?? 0;
  const bold = text.match(/\*\*/g)?.length ?? 0;
  const unclosedLink = /\[[^\]]*$/.test(text) || /\[[^\]]*\]\([^)]*$/.test(text);
  if (fences % 2 !== 0 || bold % 2 !== 0 || unclosedLink) {
    return {
      area: "text",
      code: "broken_markdown",
      severity: "error",
      message: `${where} has unclosed markdown (bold, code fence, or link).`,
    };
  }
  return null;
}

/**
 * Choice text that is only the letter A–D (optionally "A.", "(B)", "C)").
 * Distinct from a cut-off sentence so letter placeholders can be cleaned up
 * without mixing them into truncated_option.
 */
function letterOnlyChoice(option: string): boolean {
  const trimmed = option.trim();
  return (
    /^[A-D]$/i.test(trimmed) ||
    /^[A-D]\s*[.):]$/i.test(trimmed) ||
    /^[([]\s*[A-D]\s*[)\]]$/i.test(trimmed)
  );
}

function optionLooksTruncated(option: string): boolean {
  const trimmed = option.trim();
  if (!trimmed || letterOnlyChoice(trimmed)) return false;
  if (trimmed.length <= 1 && !/^\d$/.test(trimmed)) return true;
  return TRUNCATION_TAIL.test(trimmed);
}

export function lintItemText(input: {
  stem: string;
  options: readonly string[];
  explanation?: string;
}): TextLintIssue[] {
  const issues: TextLintIssue[] = [];
  const stem = input.stem ?? "";
  const explanation = input.explanation ?? "";

  if (!stem.trim() || stem.trim().length < 12) {
    push(issues, {
      area: "text",
      code: "empty_stem",
      severity: "error",
      message: "Question stem is missing or too short.",
    });
  }

  const stemEncoding = lintEncoding(stem, "The stem");
  if (stemEncoding) push(issues, stemEncoding);
  const stemMarkdown = lintMarkdown(stem, "The stem");
  if (stemMarkdown) push(issues, stemMarkdown);

  input.options.forEach((option, index) => {
    const label = `Option ${index + 1}`;
    if (!option?.trim()) {
      push(issues, {
        area: "text",
        code: "empty_option",
        severity: "error",
        message: `${label} is empty.`,
        option,
      });
      return;
    }
    if (letterOnlyChoice(option)) {
      push(issues, {
        area: "text",
        code: "letter_only_option",
        severity: "error",
        message: `${label} is only the choice letter "${option.trim()}" with no answer text.`,
        option,
      });
    } else if (optionLooksTruncated(option)) {
      push(issues, {
        area: "text",
        code: "truncated_option",
        severity: "error",
        message: `${label} looks truncated (${option.trim().slice(0, 80)}).`,
        option,
      });
    }
    const encoding = lintEncoding(option, label, option);
    if (encoding) push(issues, encoding);
    const markdown = lintMarkdown(option, label);
    if (markdown) push(issues, { ...markdown, option });
  });

  if (!explanation.trim()) {
    push(issues, {
      area: "text",
      code: "empty_explanation",
      severity: "error",
      message: "Explanation is empty.",
    });
  } else {
    const encoding = lintEncoding(explanation, "The explanation");
    if (encoding) push(issues, encoding);
    const markdown = lintMarkdown(explanation, "The explanation");
    if (markdown) push(issues, markdown);
  }

  return issues;
}
