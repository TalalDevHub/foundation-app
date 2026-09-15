"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to transmit message.");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-slate-100 my-8">
      <h2 className="text-xl font-semibold mb-2">Send a Message</h2>
      <p className="text-xs text-slate-400 mb-6">Directly delivers to my personal inbox via Resend API.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="your-email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1">Message</label>
          <textarea
            id="message"
            rows={3}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Hey Talal, let's connect..."
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-medium text-sm rounded-lg transition-colors cursor-pointer"
        >
          {status === "loading" ? "Transmitting..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-emerald-400 text-xs text-center font-medium">Message delivered straight to my inbox!</p>
        )}
        {status === "error" && (
          <p className="text-rose-400 text-xs text-center font-medium">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
