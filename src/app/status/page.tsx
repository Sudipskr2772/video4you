import AppShell from "@/components/AppShell";

export const runtime = "edge";

async function getStatus() {
  // Query upstream directly (no self-HTTP — no absolute host on the edge)
  try {
    const r = await fetch("https://www.eporner.com/api/v2/video/removed/?format=txt", {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    const txt = await r.text();
    const ids = txt.split(/\s+/).map((s) => s.trim()).filter(Boolean);
    return {
      count: ids.length,
      sample: ids.slice(0, 50),
      updatedAt: new Date().toISOString(),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

export default async function StatusPage() {
  const data = await getStatus();
  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-white sm:text-2xl">API Status · Removed videos</h1>
      <p className="mb-4 text-xs leading-5 text-zinc-500">
        Demonstrates the third endpoint <code>/video/removed/</code> (fetched as <code>txt</code>{" "}
        — ~60% smaller than JSON). We use it to show sync health and to prune dead IDs from your
        local My List / History.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Removed IDs</p>
          <p className="mt-1 text-2xl font-extrabold text-white">
            {typeof (data as { count?: number })?.count === "number"
              ? (data as { count: number }).count.toLocaleString()
              : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Endpoints</p>
          <p className="mt-1 text-sm font-semibold text-emerald-400">search · id · removed — live</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Updated</p>
          <p className="mt-1 text-sm font-semibold text-zinc-200">
            {(data as { updatedAt?: string })?.updatedAt || "—"}
          </p>
        </div>
      </div>
      {Array.isArray((data as { sample?: string[] })?.sample) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Sample removed IDs
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(data as { sample: string[] }).sample.slice(0, 30).map((id: string) => (
              <code key={id} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-400">
                {id}
              </code>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-zinc-400">
        <p className="font-bold text-white">How all 3 endpoints are used in this site</p>
        <ul className="mt-1 list-disc pl-5">
          <li><code>/video/search/</code> — home grid, trending, categories, search, infinite scroll, filters (query/order/gay/lq/per_page/page/thumbsize).</li>
          <li><code>/video/id/</code> — watch page details, embed, thumbs gallery, related lookup, active-check.</li>
          <li><code>/video/removed/</code> — this status page + pruning saved/history IDs.</li>
        </ul>
      </div>
    </AppShell>
  );
}
