export const dynamic = "force-dynamic";

interface HealthStatus {
  status: string;
  uptime: number;
  environment: string;
  timestamp: string;
}

async function getHealthStatus(): Promise<HealthStatus> {
  return {
    status: "healthy",
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  };
}

export default async function HealthPage() {
  const data = await getHealthStatus();

  return (
    <section className="max-w-md mx-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h1 className="text-xl font-bold text-slate-800">System Status</h1>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-emerald-800">
          {data.status}
        </span>
      </div>

      <dl className="mt-4 divide-y divide-slate-100 text-sm">
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Environment</dt>
          <dd className="font-mono text-slate-900">{data.environment}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Uptime</dt>
          <dd className="font-mono text-slate-900">{data.uptime}s</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Server Time</dt>
          <dd className="font-mono text-slate-900">{data.timestamp}</dd>
        </div>
      </dl>
    </section>
  );
}
