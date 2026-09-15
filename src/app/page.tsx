import { InteractiveScene3D } from "@/components/InteractiveScene3D";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 sm:py-20">
        <div className="max-w-2xl w-full space-y-6 text-center mb-6">
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Software Developer & CS Student
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Talal Shah
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Full-stack web applications, real-time 3D browser graphics, and AI-assisted workflows built with Next.js and TypeScript.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <h2 className="text-sm font-semibold text-white mb-1">Architecture & Testing</h2>
              <p className="text-xs text-slate-400">
                6 Vitest component tests, Playwright E2E suites, and GitHub Actions CI blocking failed merges.
              </p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <h2 className="text-sm font-semibold text-white mb-1">Dynamic Integrations</h2>
              <p className="text-xs text-slate-400">
                End-to-end serverless API routes on Vercel backed by Resend email dispatch.
              </p>
            </div>
          </div>
        </div>

        <InteractiveScene3D />
        <ContactForm />
      </main>

      {/* Launch Footer with FlyRank Graduate Badge */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-slate-400">
            <p className="font-medium text-slate-300">© 2026 Talal Shah. All rights reserved.</p>
            <p>Built with Next.js, Three.js, and automated CI pipelines.</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://internship-badge.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition text-xs text-slate-200 font-medium group"
              aria-label="View FlyRank Graduate Verification Badge"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FlyRank AI Fluency Graduate</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}