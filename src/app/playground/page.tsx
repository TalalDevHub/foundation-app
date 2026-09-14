import React from "react";
import { SmartLifecycleButton } from "@/components/ui/SmartLifecycleButton";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-3">
            <span>Week 5: Motion with Intent</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Buttons with a Brain
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Coordinated state choreography across the full interactive lifecycle: idle, hover/focus,
            loading, success, error, and return-to-idle. Built strictly on compositor-friendly properties with zero layout thrash.
          </p>
        </div>

        {/* Live Interactive Canvas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Live Interactive System</h2>
            <p className="text-xs text-slate-500">
              Click either button to execute an async action (with random 20% failure probability), or use the force triggers below each button.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100 items-center justify-center">
            {/* Primary Action Button */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-50/60 border border-slate-100">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4">
                01 / Primary Action (Chat Send / Audit)
              </span>
              <SmartLifecycleButton
                label="Run AI Audit"
                loadingLabel="Synthesizing..."
                successLabel="Score Verified"
                errorLabel="Audit Failed"
                variant="primary"
              />
            </div>

            {/* Secondary Action Button (System Flex) */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-50/60 border border-slate-100">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4">
                02 / Secondary Action (Deploy / Save)
              </span>
              <SmartLifecycleButton
                label="Deploy Revision"
                loadingLabel="Publishing..."
                successLabel="Live on Edge"
                errorLabel="Deploy Refused"
                variant="secondary"
              />
            </div>
          </div>

          {/* Timing & Motion Design Rationale (Required Assignment Note) */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800">
              Motion Architecture & Easing Rationale
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <strong className="text-slate-800">• 250ms Micro-Durations:</strong> Selected to match human optical reaction thresholds (200–300ms). State swaps feel instant without abrupt snap-cuts.
              </li>
              <li>
                <strong className="text-slate-800">• Cubic Out-Easing (`ease-out` / cubic-bezier(0, 0, 0.2, 1)):</strong> Content decelerates into position as it enters, giving responsive tactile feedback during press events.
              </li>
              <li>
                <strong className="text-slate-800">• Compositor-Only Transformations:</strong> Animate exclusively over `transform` (scale, translateY) and `opacity`. Widths are preserved with fixed minimum dimensions to eliminate Cumulative Layout Shift (CLS).
              </li>
              <li>
                <strong className="text-slate-800">• Interruptibility & Spam Guard:</strong> Internal state locks reject redundant click dispatches while an async operation is in-flight, preventing desynchronized state tearing.
              </li>
              <li>
                <strong className="text-slate-800">• Accessible Failure State:</strong> On error, the button executes a single horizontal shake. For users with <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">prefers-reduced-motion</code>, the physical shake is silenced while persistent high-contrast rose colors and text labels guarantee clear visual feedback.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
          <span>Production Route: <code className="text-slate-700">src/components/ui/SmartLifecycleButton.tsx</code></span>
          <a href="/chat" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
            Go to Live Chat Interface →
          </a>
        </div>

      </div>
    </main>
  );
}
