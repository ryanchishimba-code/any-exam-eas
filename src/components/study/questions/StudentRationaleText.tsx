import { cleanStudentRationale } from "@/lib/questions/student-display-text";

/** Renders student rationale: bold markers become emphasis, repeated labels collapse. */
export function StudentRationaleText({ text }: { text: string }) {
  const cleaned = cleanStudentRationale(text);
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={index} className="font-semibold text-[var(--color-ink)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
