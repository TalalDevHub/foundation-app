"use client";

import React, { useState, useRef } from "react";

export type ButtonLifecycleState = "idle" | "loading" | "success" | "error";

interface SmartLifecycleButtonProps {
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  variant?: "primary" | "secondary";
  onAction?: (outcome: "random" | "success" | "error") => Promise<void>;
}

export function SmartLifecycleButton({
  label = "Run Audit",
  loadingLabel = "Executing...",
  successLabel = "Audit Verified",
  errorLabel = "Execution Failed",
  variant = "primary",
  onAction,
}: SmartLifecycleButtonProps) {
  const [state, setState] = useState<ButtonLifecycleState>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeLifecycle = async (forcedOutcome: "random" | "success" | "error" = "random") => {
    if (state === "loading") return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState("loading");

    try {
      if (onAction) {
        await onAction(forcedOutcome);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const shouldFail =
          forcedOutcome === "error" ? true : forcedOutcome === "success" ? false : Math.random() < 0.2;
        if (shouldFail) throw new Error("Simulated network timeout");
      }

      setState("success");
      timeoutRef.current = setTimeout(() => {
        setState("idle");
      }, 1600);
    } catch {
      setState("error");
      timeoutRef.current = setTimeout(() => {
        setState("idle");
      }, 2000);
    }
  };

  const isPrimary = variant === "primary";

  const getVariantStyles = () => {
    switch (state) {
      case "loading":
        return isPrimary
          ? "bg-emerald-700 text-white border-emerald-800 cursor-wait"
          : "bg-slate-800 text-white border-slate-900 cursor-wait";
      case "success":
        return "bg-teal-600 text-white border-teal-700 shadow-teal-500/20";
      case "error":
        return "bg-rose-600 text-white border-rose-700 shadow-rose-500/20";
      default:
        return isPrimary
          ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white border-emerald-700 shadow-xs"
          : "bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border-slate-300 shadow-xs";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={state === "loading"}
        onClick={() => executeLifecycle("random")}
        aria-live="polite"
        aria-busy={state === "loading"}
        className={`
          relative inline-flex items-center justify-center min-w-[170px] h-11 px-5 rounded-xl text-sm font-semibold border
          transition-colors duration-250 ease-out focus:outline-none focus-visible:ring-3 focus-visible:ring-emerald-400 focus-visible:ring-offset-2
          ${getVariantStyles()}
          ${state === "error" ? "animate-wiggle motion-reduce:animate-none" : ""}
        `}
      >
        <span
          className={`
            inline-flex items-center gap-2 transition-all duration-250 ease-out transform
            ${state === "idle" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none absolute"}
          `}
        >
          <svg className="w-4 h-4 fill-current opacity-80" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          {label}
        </span>

        <span
          className={`
            inline-flex items-center gap-2 transition-all duration-250 ease-out transform
            ${state === "loading" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-2 pointer-events-none absolute"}
          `}
        >
          <svg className="w-4 h-4 animate-spin motion-reduce:animate-pulse text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {loadingLabel}
        </span>

        <span
          className={`
            inline-flex items-center gap-2 transition-all duration-250 ease-out transform
            ${state === "success" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none absolute"}
          `}
        >
          <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {successLabel}
        </span>

        <span
          className={`
            inline-flex items-center gap-2 transition-all duration-250 ease-out transform
            ${state === "error" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none absolute"}
          `}
        >
          <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {errorLabel}
        </span>
      </button>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
        <span>Force:</span>
        <button
          type="button"
          disabled={state === "loading"}
          onClick={() => executeLifecycle("success")}
          className="hover:text-emerald-700 hover:underline disabled:opacity-40"
        >
          Success
        </button>
        <span>/</span>
        <button
          type="button"
          disabled={state === "loading"}
          onClick={() => executeLifecycle("error")}
          className="hover:text-rose-700 hover:underline disabled:opacity-40"
        >
          Failure
        </button>
      </div>
    </div>
  );
}
