"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Eye, Play, ShieldCheck, Star, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { formatRating, formatViews } from "@/lib/format";

interface Meta {
  id: string;
  title: string;
  thumb: string;
  length_min: string;
  views: number;
  rate: string | number;
}

function useMetaList(key: string) {
  const [ids, setIds] = useState<string[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      setIds(arr);
      setMetas(
        arr
          .map((id) => {
            try {
              return JSON.parse(localStorage.getItem(`ep_meta_${id}`) || "null") as Meta | null;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as Meta[]
      );
    } catch {}
  }, [key]);
  const clear = () => {
    localStorage.setItem(key, "[]");
    setIds([]);
    setMetas([]);
  };
  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id);
    localStorage.setItem(key, JSON.stringify(next));
    setIds(next);
    setMetas((p) => p.filter((m) => m.id !== id));
  };
  const reload = () => {
    try {
      const arr = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      setIds(arr);
      setMetas(
        arr
          .map((id) => {
            try {
              return JSON.parse(localStorage.getItem(`ep_meta_${id}`) || "null") as Meta | null;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as Meta[]
      );
    } catch {}
  };
  return { ids, metas, clear, remove, reload };
}

/** Remove IDs that the /video/removed/ endpoint reports as deleted. */
async function pruneRemoved(key: string): Promise<number> {
  const r = await fetch("/api/eporner/removed");
  const data = await r.json();
  // /removed/ returns { count, sample } (first 50) — full pruning needs the
  // upstream txt feed; sample-based prune + per-item /video/id/ check:
  const dead = new Set<string>(Array.isArray(data.sample) ? data.sample : []);
  let pruned = 0;
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const keep: string[] = [];
    for (const id of arr) {
      if (dead.has(id)) {
        pruned++;
        continue;
      }
      // verify liveness via /video/id/ (empty = removed, per docs)
      try {
        const v = await fetch(`/api/eporner/video?id=${encodeURIComponent(id)}`);
        const j = await v.json();
        if (!j || Array.isArray(j) || !j.id) {
          pruned++;
          continue;
        }
      } catch {
        /* offline — keep it */
      }
      keep.push(id);
    }
    localStorage.setItem(key, JSON.stringify(keep));
  } catch {}
  return pruned;
}

function PruneButton({ storageKey, onDone }: { storageKey: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <span className="flex items-center gap-2">
      {msg && <span className="text-[11px] text-emerald-400">{msg}</span>}
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMsg(null);
          const n = await pruneRemoved(storageKey).catch(() => 0);
          setBusy(false);
          setMsg(n > 0 ? `Removed ${n} dead` : "All links alive ✓");
          onDone();
          setTimeout(() => setMsg(null), 3000);
        }}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        {busy ? "Checking…" : "Prune removed"}
      </button>
    </span>
  );
}

function MetaGrid({
  metas,
  onRemove,
  empty,
}: {
  metas: Meta[];
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (!metas.length)
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-zinc-500">
        {empty}
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
      {metas.map((m) => (
        <div key={m.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60">
          <Link href={`/watch/${m.id}`} prefetch={false} className="relative block aspect-video bg-zinc-800">
            <Image
              src={m.thumb}
              alt={m.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading="lazy"
              decoding="async"
              className="object-cover"
            />
            <span className="absolute bottom-[4.7rem] right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-white sm:bottom-[4.9rem]">
              {m.length_min}
            </span>
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600">
                <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
              </span>
            </span>
          </Link>
          <div className="p-2.5">
            <p className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold text-zinc-100">{m.title}</p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(m.views)}</span>
              <span className="flex items-center gap-1 text-amber-300"><Star className="h-3 w-3 fill-amber-300" />{formatRating(m.rate)}</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(m.id)}
            aria-label="Remove"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-zinc-300 hover:bg-rose-600 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function SavedPageInner() {
  const { metas, clear, remove, reload } = useMetaList("ep_saved");
  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-white sm:text-2xl">❤️ My List</h1>
          <p className="text-xs text-zinc-500">{metas.length} saved · stored locally</p>
        </div>
        <span className="flex items-center gap-2">
          {metas.length > 0 && <PruneButton storageKey="ep_saved" onDone={reload} />}
          {metas.length > 0 && (
            <button onClick={clear} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10">
              Clear all
            </button>
          )}
        </span>
      </div>
      <MetaGrid metas={metas} onRemove={remove} empty="Nothing saved yet — tap the bookmark on any video." />
    </AppShell>
  );
}

export function HistoryPageInner() {
  const { metas, clear, remove, reload } = useMetaList("ep_history");
  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-white sm:text-2xl">🕘 History</h1>
          <p className="text-xs text-zinc-500">{metas.length} watched · stored locally</p>
        </div>
        <span className="flex items-center gap-2">
          {metas.length > 0 && <PruneButton storageKey="ep_history" onDone={reload} />}
          {metas.length > 0 && (
            <button onClick={clear} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10">
              Clear all
            </button>
          )}
        </span>
      </div>
      <MetaGrid metas={metas} onRemove={remove} empty="No history yet — videos you open will appear here." />
    </AppShell>
  );
}
