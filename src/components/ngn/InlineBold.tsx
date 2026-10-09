import { Fragment } from "react";
import { splitInlineBold } from "@/lib/questions/inline-bold";

/** Render **word** as bold. Every other character stays a React text node, so HTML is escaped. */
export function InlineBold({ text }: { text: string }) {
  const parts = splitInlineBold(text);
  if (parts.every((part) => !part.bold)) return text;
  return parts.map((part, index) =>
    part.bold ? (
      <strong key={index}>{part.text}</strong>
    ) : (
      <Fragment key={index}>{part.text}</Fragment>
    )
  );
}
