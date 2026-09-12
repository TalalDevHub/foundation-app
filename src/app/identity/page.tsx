export default function IdentityPage() {
  const colors = [
    { name: "Near-White Canvas", hex: "#F8FAFC", border: true },
    { name: "Card Surface", hex: "#FFFFFF", border: true },
    { name: "Primary Text", hex: "#0F172A", text: "#FFFFFF" },
    { name: "Muted Text", hex: "#475569", text: "#FFFFFF" },
    { name: "Emerald Accent", hex: "#059669", text: "#FFFFFF" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Brand Identity Kit</h1>
        <p className="text-[#475569] mt-2">Single-source design system foundation for consistent portfolio builds.</p>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">01. Logo & Monogram</h2>
        <div className="flex items-center gap-8 pt-2">
          <div>
            <span className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Talal<span className="text-[#059669]">.</span>
            </span>
            <p className="text-xs text-slate-500 mt-1">Wordmark (Inter Tight Bold)</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center font-bold text-white text-lg">
              T
            </div>
            <p className="text-xs text-slate-500">Favicon / Monogram</p>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">02. Color Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {colors.map((c) => (
            <div key={c.hex} className="space-y-1.5">
              <div
                className={`h-16 rounded-lg flex items-end p-2 text-xs font-mono font-medium ${c.border ? "border border-slate-200" : ""}`}
                style={{ backgroundColor: c.hex, color: c.text || "#0F172A" }}
              >
                {c.hex}
              </div>
              <p className="text-xs font-medium text-slate-700">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">03. Typography</h2>
        <div className="space-y-3">
          <div>
            <span className="text-2xl font-bold text-[#0F172A]">Inter Tight (Headings)</span>
            <p className="text-sm text-slate-500">Tight tracking, high precision for headers and display titles.</p>
          </div>
          <div>
            <span className="text-base font-normal text-[#0F172A]">Inter (Body Text)</span>
            <p className="text-sm text-slate-500">Screen-optimized rhythm designed for sustained reading across long case studies.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-xs space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">04. Style Note</h2>
        <blockquote className="text-sm leading-relaxed text-slate-200 border-l-2 border-[#059669] pl-4">
          <p><strong>Fonts &amp; Palette:</strong> Inter Tight (headings) &amp; Inter (body); Canvas #F8FAFC, Text #0F172A, Accent #059669.</p>
          <p className="mt-1"><strong>Mood:</strong> Calm, understated technical editorial that recedes into the background so case studies and deliverables are the loudest elements in the room.</p>
        </blockquote>
      </section>
    </div>
  );
}
