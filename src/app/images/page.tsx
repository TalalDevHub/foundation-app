export default function ImagesPage() {
  const keepers = [
    {
      location: "Hero / Identity",
      name: "Author Portrait",
      call: "Real Photo",
      reason: "Authentic portrait; builds human trust and personal accountability without synthetic artifacts."
    },
    {
      location: "Case Study: Core App",
      name: "Live Dashboard Capture",
      call: "Real Screenshot",
      reason: "Crisp crop of real production UI. Shows actual data tables and verified system states."
    },
    {
      location: "Case Study: Workflow",
      name: "Deployment & Terminal Log",
      call: "Real Screenshot",
      reason: "Unedited capture of build checks and Git status; confirms functional engineering competency."
    },
    {
      location: "Hero Ambient Surface",
      name: "Subtle Blueprint Grid",
      call: "AI-Generated Accent",
      reason: "Uniform 2D architectural grid held at 5% opacity to add tactile texture without competing with typography."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Curated Image Set & Discernment</h1>
        <p className="text-[#475569] mt-2">Editorial decisions balancing concrete proof against intentional generative texture.</p>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">01. The Keepers (Image Manifest)</h2>
        <div className="divide-y divide-slate-100">
          {keepers.map((item) => (
            <div key={item.name} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="space-y-1">
                <span className="font-semibold text-[#0F172A] text-base">{item.name}</span>
                <span className="block text-xs font-mono text-slate-500">{item.location}</span>
                <p className="text-sm text-[#475569]">{item.reason}</p>
              </div>
              <span className={`inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                item.call === "Real Photo" ? "bg-amber-100 text-amber-800" :
                item.call === "Real Screenshot" ? "bg-emerald-100 text-emerald-800" :
                "bg-slate-100 text-slate-800"
              }`}>
                {item.call}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">02. Where Real Captures Beat Generation</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#475569]">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="block text-slate-900 mb-1">Authentic Portraiture</strong>
            Synthetic portraits possess an uncanny gloss that damages professional trust. A genuine headshot creates authentic human context.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="block text-slate-900 mb-1">Actual UI vs. Mockup Hallucinations</strong>
            Generated mockups invent nonsense buttons and unbalanced text. Real screenshots demonstrate actual typographic rhythm and responsive execution.
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">03. Curatorial Discernment: Rejected Images</h2>
        
        <div className="space-y-3 text-sm">
          <div className="border-l-2 border-red-400 pl-4 space-y-1">
            <p className="font-medium text-white">Rejected: 3D Glossy Floating Interface Isometric Render</p>
            <p className="text-slate-300">
              <strong>Why it failed:</strong> Produced aggressive purple and cyan lens-flare gradients that broke the #059669 emerald palette. It competed loudly with the content rather than serving as quiet scaffolding.
            </p>
          </div>

          <div className="border-l-2 border-red-400 pl-4 space-y-1">
            <p className="font-medium text-white">Rejected: AI-Generated "Software Engineer at Minimal Desk"</p>
            <p className="text-slate-300">
              <strong>Why it failed:</strong> Read immediately as stock clip art. Replaced with an authentic high-resolution terminal capture that provides verifiable engineering proof.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
