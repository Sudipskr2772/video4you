"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";

const TRENDING = [
  "teen", "milf", "anal", "lesbian", "amateur", "asian", "ebony",
  "latina", "threesome", "pov", "hardcore", "creampie", "blowjob", "massage",
];

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (term: string) => {
    const t = term.trim();
    router.push(t ? `/?q=${encodeURIComponent(t)}` : "/");
  };

  return (
    <AppShell>
      <h1 className="text-xl font-extrabold text-white sm:text-2xl">Search</h1>
      <p className="mb-4 text-xs text-zinc-500">
        Powered by <code>/video/search/?query=…</code> — try any keyword.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type and hit enter… e.g. 'japanese', 'redhead', '4k'"
          className="h-13 w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-rose-500/60"
        />
      </form>
      <p className="mb-2 mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
        <TrendingUp className="h-3.5 w-3.5" /> Popular right now
      </p>
      <div className="flex flex-wrap gap-2">
        {TRENDING.map((t) => (
          <button
            key={t}
            onClick={() => go(t)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold capitalize text-zinc-200 transition hover:bg-rose-600 hover:text-white active:scale-95"
          >
            {t}
          </button>
        ))}
      </div>
    </AppShell>
  );
}
