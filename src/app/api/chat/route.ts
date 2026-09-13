import { streamText } from "ai";
import { CAPSTONE_MODEL, SYSTEM_PROMPT } from "@/lib/ai/config";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: CAPSTONE_MODEL,
      system: SYSTEM_PROMPT,
      messages,
      abortSignal: req.signal,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat route streaming error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process stream" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
