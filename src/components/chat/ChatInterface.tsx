"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ArchitectureAuditResult } from "@/lib/ai/tools";

export type ToolLifecycleState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export interface ToolPart {
  type: "tool-call" | "tool-result";
  state: ToolLifecycleState;
  toolName: string;
  input?: Record<string, any>;
  result?: ArchitectureAuditResult;
  error?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolPart?: ToolPart;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollLocked, setIsAutoScrollLocked] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 60;
    setIsAutoScrollLocked(isAtBottom);
    setShowScrollBottom(!isAtBottom);
  };

  useEffect(() => {
    if (isAutoScrollLocked && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isAutoScrollLocked]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsAutoScrollLocked(true);
      setShowScrollBottom(false);
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const sendQuery = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) throw new Error("Stream response failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let activeToolPart: ToolPart | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("__TOOL_PART__:")) {
            try {
              const rawJson = line.replace("__TOOL_PART__:", "");
              activeToolPart = JSON.parse(rawJson);
            } catch (e) {
              console.error("Malformed tool part:", e);
            }
          } else {
            accumulatedText += line;
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedText, toolPart: activeToolPart }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: "Error: Generation failed." }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-900">Architecture & Tools Inspector</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
            tools: inspectArchitecture
          </span>
        </div>
      </div>

      {/* Message & Tool Flow */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative bg-slate-50/20"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3">
              <span className="text-emerald-600 font-bold text-lg">?</span>
            </div>
            <p className="text-sm font-medium text-slate-800">Generative UI &amp; Server-Side Tool Execution</p>
            <p className="text-xs mt-1 text-slate-500 max-w-sm">
              Trigger live server-side audits with Zod validation, morphing tool states, and custom UI components.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => sendQuery("Audit a11y primitives")}
                className="text-xs bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 px-3 py-1.5 rounded-lg shadow-2xs transition"
              >
                ?? Audit A11y Primitives
              </button>
              <button
                type="button"
                onClick={() => sendQuery("Inspect streaming chat")}
                className="text-xs bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 px-3 py-1.5 rounded-lg shadow-2xs transition"
              >
                ?? Inspect Streaming Chat
              </button>
              <button
                type="button"
                onClick={() => sendQuery("Test error state")}
                className="text-xs bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg shadow-2xs transition"
              >
                ?? Trigger Tool Error State
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"} flex-col space-y-2`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "self-end bg-[#0F172A] text-white rounded-br-xs"
                    : "self-start bg-white text-[#0F172A] border border-slate-200/80 rounded-bl-xs shadow-2xs"
                }`}
              >
                {/* Render Tool Lifecycle Part */}
                {message.toolPart && (
                  <div className="mb-3 transition-all duration-200">
                    <ToolPartRenderer toolPart={message.toolPart} />
                  </div>
                )}

                {/* Markdown Content */}
                {message.content && (
                  <div className="prose prose-sm max-w-none text-inherit">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading &&
          messages[messages.length - 1]?.role === "assistant" &&
          !messages[messages.length - 1]?.toolPart &&
          !messages[messages.length - 1]?.content && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
              </div>
            </div>
          )}

        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 shadow-md text-slate-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-slate-50 transition"
          >
            ? Jump to latest
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'Audit a11y primitives' or 'Test error state'..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap"
            >
              Run
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// Visual State Machine Renderer for all 4 Tool Lifecycle States
function ToolPartRenderer({ toolPart }: { toolPart: ToolPart }) {
  const { state, toolName, input, result, error } = toolPart;

  // STATE 1: Input Streaming (Morphing pulse / Preparing tool parameters)
  if (state === "input-streaming") {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs text-slate-600 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
        <span className="font-mono font-medium">Invoking {toolName}...</span>
        <span className="text-[10px] text-slate-400 ml-auto">streaming arguments</span>
      </div>
    );
  }

  // STATE 2: Input Available (Tool calling with verified payload)
  if (state === "input-available") {
    return (
      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/70 text-xs text-sky-900 transition-all duration-200">
        <div className="flex items-center justify-between font-mono font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-spin" />
            Executing: {toolName}()
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-200/80 text-sky-800">
            input locked
          </span>
        </div>
        <div className="bg-white/80 rounded-lg p-2 font-mono text-[11px] text-slate-700 border border-sky-100">
          targetModule: &quot;{input?.targetModule}&quot; | strictA11yCheck: {String(input?.strictA11yCheck)}
        </div>
      </div>
    );
  }

  // STATE 3: Output Available (GENERATIVE UI: Styled Metric & Findings Component)
  if (state === "output-available" && result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900 transition-all duration-200">
        {/* Component Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              Live Tool Result • {toolName}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">{result.moduleName}</h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-emerald-600">{result.score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {result.wcagLevel}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Cold Start</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{result.metrics.coldStartLatencyMs}ms</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Bundle Size</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{result.metrics.bundleFootprintKb} KB</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">A11y Navigation</div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5 truncate">
              {result.metrics.keyboardNav}
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div className="mb-3 space-y-1">
          <div className="text-[11px] font-semibold text-slate-700">Verified Findings:</div>
          <ul className="space-y-1 text-xs text-slate-600">
            {result.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-500 text-sm leading-none">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Recommendation */}
        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2">
          <span className="text-emerald-600 font-bold">??</span>
          <span>{result.recommendation}</span>
        </div>
      </div>
    );
  }

  // STATE 4: Output Error (DESIGNED ERROR STATE - Graceful degradation, no crash)
  if (state === "output-error") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-950 transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
            !
          </div>
          <h4 className="text-xs font-bold font-mono text-rose-900 uppercase tracking-wider">
            Tool Execution Failure: {toolName}
          </h4>
        </div>
        <p className="text-xs text-rose-800 mb-2 leading-relaxed">
          {error || "An unexpected error occurred during execution."}
        </p>
        <div className="bg-white/80 rounded-xl p-2.5 border border-rose-200/80 text-[11px] text-slate-700">
          <span className="font-semibold text-rose-900 block mb-1">Recovery Plan:</span>
          Select an existing registered module: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-800">a11y-primitives</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-800">streaming-chat</code>.
        </div>
      </div>
    );
  }

  return null;
}
