import { InteractiveScene3D } from "@/components/InteractiveScene3D";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start px-4 py-12 sm:py-20">
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
      </div>

      <InteractiveScene3D />
      <ContactForm />
    </main>
  );
}
