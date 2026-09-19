import Link from "next/link";
import { Flame, Sparkles, Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";
import VideoGrid from "@/components/VideoGrid";
import { searchVideos, type OrderParam } from "@/lib/eporner";
import { ORDERS } from "@/lib/constants";

interface SP {
  q?: string;
  order?: string;
  gay?: string;
  lq?: string;
  per_page?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const query = (sp.q || "all").trim() || "all";
  const order = (sp.order as OrderParam) || "latest";
  const gay = (sp.gay || "0") as "0" | "1" | "2";
  const lq = (sp.lq ?? "1") as "0" | "1" | "2";
  const perPage = Math.min(Math.max(Number(sp.per_page || 30) || 30, 1), 60);

  let data;
  try {
    data = await searchVideos({
      query,
      order,
      gay: Number(gay) as 0 | 1 | 2,
      lq: Number(lq) as 0 | 1 | 2,
      per_page: perPage,
      page: 1,
      thumbsize: "medium",
    });
  } catch {
    data = { count: 0, start: 0, per_page: perPage, page: 1, total_count: 0, total_pages: 0, videos: [] };
  }

  const isHome = query.toLowerCase() === "all";

  return (
    <AppShell activeCategory={query}>
      {isHome && (
        <section className="relative mb-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950 via-zinc-950 to-zinc-950 p-5 sm:p-8">
          <div
            className="hero-glow pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-600/25 blur-3xl"
            aria-hidden
          />
          <div
            className="hero-glow pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl"
            style={{ animationDelay: "-3.5s" }}
            aria-hidden
          />
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-rose-400">
            <Sparkles className="h-3.5 w-3.5" /> Eporner API v2 · Live
          </p>
          <h1 className="mt-2 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Stream HD videos, trending daily.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Search millions of videos, sort by trending / top-rated / longest, preview thumbnails
            on hover and play instantly with official embeds. Mobile-first &amp; blazing fast.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/?order=top-weekly"
              className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-950/50 transition hover:bg-rose-500 active:scale-95"
            >
              <Flame className="h-3.5 w-3.5" /> Trending now
            </Link>
            <Link
              href="/?order=top-rated"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
            >
              <Trophy className="h-3.5 w-3.5" /> Top rated
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ORDERS.map((o) => (
              <Link
                key={o.value}
                href={o.value === "latest" ? "/" : `/?order=${o.value}`}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                  order === o.value
                    ? "bg-white text-black"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {o.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isHome && (
        <div className="mb-4">
          <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Results for “{query}”
          </h1>
          <p className="text-xs text-zinc-500">
            order: {order} · gay: {gay} · lq: {lq} · {perPage}/page
          </p>
        </div>
      )}

      <VideoGrid
        initial={data.videos}
        query={query}
        order={order}
        gay={String(gay)}
        lq={String(lq)}
        perPage={perPage}
        startPage={1}
        totalPages={data.total_pages || 1}
        totalCount={data.total_count || 0}
        start={data.start || 0}
        timeMs={data.time_ms}
      />
    </AppShell>
  );
}
