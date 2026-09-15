import { ShaderHero } from "@/components/ShaderHero";
import { InteractiveScene3D } from "@/components/InteractiveScene3D";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start px-4 py-8 sm:py-14 max-w-5xl mx-auto">
      <ShaderHero />
      <InteractiveScene3D />
      <ContactForm />
    </main>
  );
}
