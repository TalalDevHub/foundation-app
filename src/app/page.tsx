import dynamic from "next/dynamic";
import { ContactForm } from "@/components/ContactForm";

const InteractiveScene3D = dynamic(
  () => import("@/components/InteractiveScene3D").then((mod) => mod.InteractiveScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl h-80 mx-auto my-10 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-500 font-mono">
        Mounting 3D Pipeline...
      </div>
    ),
  }
);

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
