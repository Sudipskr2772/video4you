"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ORDERS, PER_PAGE_OPTIONS } from "@/lib/constants";
import type { OrderParam } from "@/lib/eporner";

export default function FilterBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();

  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(sp.toString());
    if (v === null || v === "") p.delete(k);
    else p.set(k, v);
    p.delete("page");
    router.push(`/?${p.toString()}`);
  };

  const order = (sp.get("order") as OrderParam) || "latest";
  const gay = sp.get("gay") || "0";
  const lq = sp.get("lq") ?? "1";
  const per = sp.get("per_page") || "30";

  if (!open) return null;

  return (
    <div className="fade-in fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop-in max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Filters &amp; Sort</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Sort by</p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {ORDERS.map((o) => (
            <button
              key={o.value}
              onClick={() => set("order", o.value)}
              className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition active:scale-95 ${
                order === o.value ? "bg-rose-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Content</p>
            <div className="space-y-2">
              {[
                ["0", "Straight"],
                ["1", "Straight + Gay"],
                ["2", "Gay only"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => set("gay", v)}
                  className={`w-full rounded-xl px-3 py-2 text-sm font-medium transition ${
                    gay === v ? "bg-white text-black" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Quality</p>
            <div className="space-y-2">
              {[
                ["1", "All quality"],
                ["0", "Hide low quality"],
                ["2", "Low quality only"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => set("lq", v)}
                  className={`w-full rounded-xl px-3 py-2 text-sm font-medium transition ${
                    lq === v ? "bg-white text-black" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Videos per page</p>
        <div className="flex gap-2">
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => set("per_page", String(n))}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${
                per === String(n) ? "bg-rose-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          Show results
        </button>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          Uses <code>/video/search/</code> params: query · order · gay · lq · per_page · page
        </p>
      </div>
    </div>
  );
}
