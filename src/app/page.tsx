import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start px-4 py-12 sm:py-20">
      <div className="max-w-2xl w-full space-y-6 text-center mb-10">
        <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
          Software Developer & CS Student
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Talal Shah
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          I build full-stack web applications and AI-assisted engineering workflows with Next.js, TypeScript, and automated CI/CD pipelines.
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

      <ContactForm />
    </main>
  );
}
