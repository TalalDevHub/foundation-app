import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6 text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Talal's Portfolio</h1>
        <p className="text-slate-400 text-sm">
          Computer Science & AI-Assisted Development | Full-Stack Applications
        </p>
      </div>

      <ContactForm />
    </main>
  );
}
