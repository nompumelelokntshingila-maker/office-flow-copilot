import { streamText } from "ai";
import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

export async function runPrompt(prompt: string): Promise<{ text: string }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app.");

  const gateway = createLovableAiGatewayProvider(apiKey);
  const result = streamText({
    model: gateway(AI_MODEL),
    prompt,
  });

  const text = await result.text;
  return { text: text.trim() };
}
