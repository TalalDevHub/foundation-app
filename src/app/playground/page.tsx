"use client";

import React, { useState } from "react";
import { Modal } from "./components/Modal";
import { Tabs, TabItem } from "./components/Tabs";
import { Disclosure } from "./components/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData: TabItem[] = [
    {
      id: "tab-1",
      label: "System Status",
      content: <p className="text-sm">All edge functions operating at 100% healthy state.</p>,
    },
    {
      id: "tab-2",
      label: "Access Logs",
      content: <p className="text-sm">No unauthorized requests recorded in the last 24 hours.</p>,
    },
    {
      id: "tab-3",
      label: "CI/CD Metrics",
      content: <p className="text-sm">Build completed in 2.3 seconds with 0 hydration warnings.</p>,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          A11y Component Playground
        </h1>
        <p className="text-slate-600 mt-2">
          Hand-built React + TypeScript components implemented against W3C ARIA Authoring Practices without external UI libraries.
        </p>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          01. Modal Dialog (Focus Trap + Escape + Restore)
        </h2>
        <p className="text-sm text-slate-600">
          Locks background scrolling, traps keyboard focus inside the dialog, closes on Escape, and returns focus to this trigger button on dismiss.
        </p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Open System Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Operational Check"
          description="Are you sure you want to trigger a manual cache invalidation?"
        >
          <div className="space-y-2 text-sm">
            <p>This action updates edge route nodes without service interruption.</p>
            <input
              type="text"
              placeholder="Type notes (Tab test input)..."
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </Modal>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          02. Tabs (Arrow Keys + Roving Tabindex + Home/End)
        </h2>
        <p className="text-sm text-slate-600">
          Tab into the list, navigate across tabs using Arrow keys, jump to ends with Home/End, and activate via keyboard.
        </p>
        <Tabs items={tabsData} label="Platform Metrics" />
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          03. Disclosure (Semantic Heading + State Toggle)
        </h2>
        <p className="text-sm text-slate-600">
          Simple semantic toggle with dynamic aria-expanded and keyboard accessible triggers.
        </p>
        <Disclosure summary="View Deployment Architecture Specifications">
          Next.js App Router deployed on Vercel Edge Runtime with Turbopack bundler, Tailwind CSS 4 theme tokens, and dynamic server components.
        </Disclosure>
      </section>
    </div>
  );
}
