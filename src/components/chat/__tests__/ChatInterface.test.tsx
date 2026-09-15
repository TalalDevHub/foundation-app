import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInterface } from "../ChatInterface";

describe("ChatInterface & Tool Execution Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Designed Empty State
  it("renders the onboarding empty state with interactive quick action triggers", () => {
    render(<ChatInterface />);
    
    expect(
      screen.getByText(/no active conversation/i)
    ).toBeInTheDocument();
    
    expect(
      screen.getByRole("button", { name: /audit a11y primitives/i })
    ).toBeInTheDocument();
  });

  // Test 2: Input Validation & Disabled State
  it("disables the send button when the prompt input is empty or whitespace", async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);

    const sendBtn = screen.getByRole("button", { name: /send/i });
    const input = screen.getByPlaceholderText(/ask question or type/i);

    expect(sendBtn).toBeDisabled();

    await user.type(input, "   ");
    expect(sendBtn).toBeDisabled();

    await user.type(input, "Audit edge runtime");
    expect(sendBtn).toBeEnabled();
  });

  // Test 3: Pending / Skeleton State
  it("displays pending indicator while response stream is awaiting first token", async () => {
    const user = userEvent.setup();

    // Never-resolving fetch mock to hold the pending state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/ask question or type/i);
    const sendBtn = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Inspect system");
    await user.click(sendBtn);

    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  // Test 4: Tool Calling Lifecycle & Output Available
  it("renders a structured audit result card when output-available tool part streams", async () => {
    const user = userEvent.setup();

    const toolPayload = JSON.stringify({
      type: "tool-result",
      state: "output-available",
      toolName: "inspectArchitecture",
      result: {
        moduleName: "a11y-primitives",
        score: 98,
        wcagLevel: "Pass (AA)",
        metrics: {
          keyboardNav: "Fully Compliant",
          coldStartLatencyMs: 12,
          bundleFootprintKb: 4.2,
        },
        findings: ["Focus rings verified", "Contrast meets 4.5:1 ratio"],
        recommendation: "Ready for production deployment",
      },
    });

    const streamChunk = `__TOOL_PART__:${toolPayload}\nAudit finished successfully.`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => {
          let called = false;
          return {
            read: () => {
              if (!called) {
                called = true;
                return Promise.resolve({
                  done: false,
                  value: new TextEncoder().encode(streamChunk),
                });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
      },
    } as any);

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/ask question or type/i);
    await user.type(input, "Audit a11y primitives");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText("a11y-primitives")).toBeInTheDocument();
      expect(screen.getByText("98")).toBeInTheDocument();
      expect(screen.getByText(/focus rings verified/i)).toBeInTheDocument();
    });
  });

  // Test 5: Mid-Stream Error & Scoped Retry Trigger
  it("catches stream severance and mounts an inline retry button", async () => {
    const user = userEvent.setup();

    const streamChunk = "__STREAM_ERROR__:Connection drop simulated mid-stream.\n";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => {
          let called = false;
          return {
            read: () => {
              if (!called) {
                called = true;
                return Promise.resolve({
                  done: false,
                  value: new TextEncoder().encode(streamChunk),
                });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
      },
    } as any);

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/ask question or type/i);
    await user.type(input, "Sabotage mid-stream");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/stream interruption caught/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /retry failed query/i })
      ).toBeInTheDocument();
    });
  });

  // Test 6: Designed Output Error Handling
  it("renders a designed recovery card when tool returns output-error", async () => {
    const user = userEvent.setup();

    const toolErrorPayload = JSON.stringify({
      type: "tool-result",
      state: "output-error",
      toolName: "inspectArchitecture",
      error: "Target module 'invalid-target' not recognized in registry.",
    });

    const streamChunk = `__TOOL_PART__:${toolErrorPayload}\nAudit terminated.`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => {
          let called = false;
          return {
            read: () => {
              if (!called) {
                called = true;
                return Promise.resolve({
                  done: false,
                  value: new TextEncoder().encode(streamChunk),
                });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
      },
    } as any);

    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/ask question or type/i);
    await user.type(input, "Test error state");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/tool execution failure: inspectarchitecture/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/target module 'invalid-target' not recognized/i)
      ).toBeInTheDocument();
    });
  });
});
