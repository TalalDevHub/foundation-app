import {
  inspectArchitectureSchema,
  executeInspectArchitecture,
} from "@/lib/ai/tools";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userPrompt = (lastMessage?.content || "").trim().toLowerCase();

    // Sabotage Case 1: Simulated Rate Limit / Server Overload (429)
    if (userPrompt.includes("sabotage 429") || userPrompt.includes("rate limit")) {
      return new Response(
        JSON.stringify({
          error: "RateLimitExceeded",
          message: "API rate limit reached (429 Too Many Requests). The server is currently throttled.",
          retryAfterSec: 4,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sabotage Case 2: Server-Side Fatal Failure before stream (500)
    if (userPrompt.includes("sabotage 500") || userPrompt.includes("fatal error")) {
      return new Response(
        JSON.stringify({
          error: "InternalServerError",
          message: "Fatal upstream connection failure to inference cluster.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Sabotage Case 3: Mid-Stream Severance / Connection Drop
        if (userPrompt.includes("sabotage mid-stream") || userPrompt.includes("break stream")) {
          const partial = "Processing your architecture inspection request: connecting to edge nodes...";
          for (const char of partial) {
            controller.enqueue(encoder.encode(char));
            await new Promise((r) => setTimeout(r, 20));
          }
          await new Promise((r) => setTimeout(r, 400));
          // Emit error token and abruptly abort stream
          controller.enqueue(
            encoder.encode(
              "\n\n__STREAM_ERROR__:Connection terminated unexpectedly by upstream host during active token generation."
            )
          );
          controller.close();
          return;
        }

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

            // State 3: Output Available
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
                `\n\n⚠️ The inspection tool encountered an execution failure while auditing the requested module. See the error card above for diagnostics.`
              )
            );
          }
        } else {
          // Standard response stream
          const defaultReply =
            "I am your Technical Architecture Assistant. You can run system diagnostics or sabotage tests to observe resilient recovery:\n\n" +
            "• **Audit A11y Primitives**: Evaluates W3C keyboard navigation and contrast ratios.\n" +
            "• **Inspect Streaming Chat**: Audits client-side stream consumer performance.\n" +
            "• **Sabotage Mid-Stream**: Simulates an interrupted connection with auto-retry.\n" +
            "• **Sabotage 429**: Simulates server throttling with retry countdown.";

          for (const char of defaultReply) {
            controller.enqueue(encoder.encode(char));
            await new Promise((r) => setTimeout(r, 10));
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
