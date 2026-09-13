"use client";

import React, { useState, useId } from "react";

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function Disclosure({ summary, children, defaultExpanded = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const panelId = useId();

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <span>{summary}</span>
          <span
            className={`text-slate-500 transform transition-transform duration-200 text-sm ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            ?
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        hidden={!isOpen}
        role="region"
        className="px-4 pb-4 pt-1 text-sm text-slate-600 border-t border-slate-100"
      >
        {children}
      </div>
    </div>
  );
}
