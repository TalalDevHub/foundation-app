import { tool } from "ai";
import { CAPSTONE_MODEL, SYSTEM_PROMPT } from "@/lib/ai/config";
import {
  inspectArchitectureSchema,
  executeInspectArchitecture,
} from "@/lib/ai/tools";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content?.toLowerCase() || "";

    // Stream responses with tool invocation support
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const shouldAudit =
          userPrompt.includes("audit") ||
          userPrompt.includes("inspect") ||
          userPrompt.includes("score") ||
          userPrompt.includes("test error");

        if (shouldAudit) {
          const isErrorTest = userPrompt.includes("error");
          const target = isErrorTest
            ? "invalid-target"
            : userPrompt.includes("chat")
            ? "streaming-chat"
            : userPrompt.includes("edge")
            ? "edge-runtime"
            : "a11y-primitives";

          // State 1: Input Streaming
          controller.enqueue(
            encoder.encode(
              `__TOOL_PART__:${JSON.stringify({
                type: "tool-call",
                state: "input-streaming",
                toolName: "inspectArchitecture",
                input: { targetModule: "..." },
              })}\n`
            )
          );

          await new Promise((r) => setTimeout(r, 400));

          // State 2: Input Available
          controller.enqueue(
            encoder.encode(
              `__TOOL_PART__:${JSON.stringify({
                type: "tool-call",
                state: "input-available",
                toolName: "inspectArchitecture",
                input: { targetModule: target, strictA11yCheck: true },
              })}\n`
            )
          );

          try {
            const auditResult = await executeInspectArchitecture({
              targetModule: target as any,
              strictA11yCheck: true,
            });

            // State 3: Output Available (Success with structured data)
            controller.enqueue(
              encoder.encode(
                `__TOOL_PART__:${JSON.stringify({
                  type: "tool-result",
                  state: "output-available",
                  toolName: "inspectArchitecture",
                  result: auditResult,
                })}\n`
              )
            );

            // Stream descriptive LLM summary text
            controller.enqueue(
              encoder.encode(
                `\n\nI have completed the automated architectural audit for **${auditResult.moduleName}**. The module passed with an aggregate score of **${auditResult.score}/100** under strict WCAG and performance criteria.`
              )
            );
          } catch (err: any) {
            // State 4: Output Error (Designed error state)
            controller.enqueue(
              encoder.encode(
                `__TOOL_PART__:${JSON.stringify({
                  type: "tool-result",
                  state: "output-error",
                  toolName: "inspectArchitecture",
                  error: err.message || "Failed to execute architecture inspection tool.",
                })}\n`
              )
            );

            controller.enqueue(
              encoder.encode(
                `\n\n?? The inspection tool encountered an execution failure while auditing the requested module. See the error card above for diagnostics.`
              )
            );
          }
        } else {
          // Standard text stream fallback
          const defaultReply = `I am your Technical Architecture Assistant. You can ask me about my engineering stack or run live diagnostics on my code. Try typing **"Audit a11y primitives"**, **"Inspect streaming chat"**, or **"Test error state"** to watch the server tools execute live.`;
          for (const char of defaultReply) {
            controller.enqueue(encoder.encode(char));
            await new Promise((r) => setTimeout(r, 12));
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Chat route streaming error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process stream" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
