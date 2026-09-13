"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollLocked, setIsAutoScrollLocked] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Release auto-scroll lock if user scrolls up
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const threshold = 60;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

    setIsAutoScrollLocked(isAtBottom);
    setShowScrollBottom(!isAtBottom);
  };

  // Keep auto-scroll active during stream only when pinned to bottom
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

  return (
    <div className="flex flex-col h-[650px] w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-900">Technical Chat Assistant</h2>
        </div>
        <span className="text-xs font-mono text-slate-500">Claude 3.5 Sonnet</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <p className="text-sm font-medium text-slate-700">Ask about my engineering stack, deployment architecture, or case studies.</p>
            <p className="text-xs mt-1 text-slate-400">Tokens stream directly from the server route via Server-Sent Events.</p>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#0F172A] text-white rounded-br-xs"
                    : "bg-[#F8FAFC] text-[#0F172A] border border-slate-200/80 rounded-bl-xs shadow-xs"
                }`}
              >
                <div className="prose prose-sm max-w-none text-inherit">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking indicator handoff */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
            </div>
          </div>
        )}

        {/* Jump button */}
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

      {/* Input controls */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about architectural standards or case studies..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-500 whitespace-nowrap"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500 whitespace-nowrap"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
