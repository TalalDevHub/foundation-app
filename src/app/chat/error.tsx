"use client";

import React, { useEffect } from "react";

export default function ChatErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600 text-2xl font-bold">
        !
      </div>
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
        Chat Subsystem Interrupted
      </h2>
      <p className="text-sm text-slate-600 max-w-md mt-1.5 mb-5 leading-relaxed">
        The route encountered an unexpected rendering fault. Application state has been preserved.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-xs"
        >
          Recover and Reload Subsystem
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
        >
          Return to Overview
        </button>
      </div>
    </div>
  );
}
