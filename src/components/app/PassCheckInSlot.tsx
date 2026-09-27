import { PassCheckInPrompt } from "@/components/app/PassCheckInPrompt";
import { loadPassCheckInPrompt } from "@/lib/learning/pass-check-in-prompt";

export async function PassCheckInSlot({ userId }: { userId: string }) {
  const prompt = await loadPassCheckInPrompt(userId);
  if (!prompt) return null;
  return <PassCheckInPrompt examName={prompt.examName} examSlug={prompt.examSlug} />;
}
