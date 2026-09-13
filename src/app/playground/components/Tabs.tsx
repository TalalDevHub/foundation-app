"use client";

import React, { useState, useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  label: string;
}

export function Tabs({ items, defaultTabId, label }: TabsProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultTabId || items[0]?.id || "");
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = items.length - 1;
    } else {
      return;
    }

    const nextTab = items[nextIndex];
    if (nextTab) {
      setSelectedId(nextTab.id);
      tabRefs.current.get(nextTab.id)?.focus();
    }
  }

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={label}
        className="flex border-b border-slate-200"
      >
        {items.map((tab, idx) => {
          const isSelected = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isSelected
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {items.map((tab) => {
        const isSelected = tab.id === selectedId;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isSelected}
            tabIndex={0}
            className="p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-b-lg bg-white"
          >
            {isSelected && tab.content}
          </div>
        );
      })}
    </div>
  );
}
