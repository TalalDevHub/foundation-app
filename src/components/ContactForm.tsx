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
    <section aria-labelledby="contact-heading" className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl">
        <h2 id="contact-heading" className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mb-2">
          Get in Touch
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Have an inquiry or project collaboration in mind? Drop a message below and it will deliver directly to my personal inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Talal Shah"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full min-h-[100px] px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
              placeholder="Write your note here..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full min-h-[48px] py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-base rounded-lg shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {status === "loading" ? "Transmitting..." : "Send Message"}
          </button>

          {status === "success" && (
            <div role="status" className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg">
              <p className="text-emerald-300 text-sm font-medium text-center">
                Message delivered straight to my inbox!
              </p>
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-lg">
              <p className="text-rose-300 text-sm font-medium text-center">
                {errorMessage || "Failed to transmit message. Please try again."}
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}