"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clapperboard, Eye, Play, Search, SlidersHorizontal, Sparkles, User, X } from "lucide-react";
import type { EpornerVideo } from "@/lib/eporner";
import type { SuggestKeyword, SuggestPerformer } from "@/app/api/eporner/suggest/route";
import { formatViews } from "@/lib/format";

/** Highlight query match inside a label, like the main site's <b class="qsmatch"> */
function Hi({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.trim().toLowerCase());
  if (i < 0 || !q.trim()) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <b className="text-rose-400">{text.slice(i, i + q.trim().length)}</b>
      {text.slice(i + q.trim().length)}
    </>
  );
}

interface SuggestState {
  videos: EpornerVideo[];
  performers: SuggestPerformer[];
  keywords: SuggestKeyword[];
  open: boolean;
  setOpen: (v: boolean) => void;
  hi: number;
  setHi: (f: (h: number) => number) => void;
  /** flat keyboard-navigable rows: models first, then videos */
  navCount: number;
}

function useSuggestions(q: string, enabled: boolean): SuggestState {
  const [videos, setVideos] = useState<EpornerVideo[]>([]);
  const [performers, setPerformers] = useState<SuggestPerformer[]>([]);
  const [keywords, setKeywords] = useState<SuggestKeyword[]>([]);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);

  useEffect(() => {
    if (!enabled || q.trim().length < 2) {
      setVideos([]);
      setPerformers([]);
      setKeywords([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const term = q.trim();
        const [rv, rs] = await Promise.all([
          fetch(
            `/api/eporner/search?${new URLSearchParams({
              query: term,
              per_page: "5",
              page: "1",
              order: "most-popular",
              gay: "0",
              lq: "1",
              thumbsize: "small",
            })}`,
            { signal: ctrl.signal }
          ),
          fetch(`/api/eporner/suggest?${new URLSearchParams({ q: term })}`, {
            signal: ctrl.signal,
          }),
        ]);
        const dv = await rv.json();
        const ds = await rs.json();
        setVideos(Array.isArray(dv.videos) ? dv.videos.slice(0, 5) : []);
        setPerformers(Array.isArray(ds.performers) ? ds.performers : []);
        setKeywords(Array.isArray(ds.keywords) ? ds.keywords : []);
        setOpen(true);
        setHi(-1);
      } catch {
        /* aborted or offline — stay silent */
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, enabled]);

  return {
    videos,
    performers,
    keywords,
    open,
    setOpen,
    hi,
    setHi,
    navCount: performers.length + videos.length,
  };
}

function SuggestBox({
  s,
  q,
  onSearchModel,
  onClose,
}: {
  s: SuggestState;
  q: string;
  onSearchModel: (name: string) => void;
  onClose: () => void;
}) {
  const { videos, performers, keywords, hi } = s;
  if (!performers.length && !videos.length && !keywords.length) return null;
  return (
    <div className="drop-in absolute inset-x-0 top-full z-50 mt-2 max-h-[70dvh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
      {/* Models — like the main site: photo, name, counts, Profile */}
      {performers.length > 0 && (
        <div className="border-b border-white/5 py-1">
          <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <Sparkles className="h-3 w-3" /> Models
          </p>
          {performers.map((p, i) => (
            <button
              key={p.name + i}
              onClick={() => onSearchModel(p.name)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                i === hi ? "bg-rose-600/20" : "hover:bg-white/5"
              }`}
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-rose-600/40 to-orange-500/30 font-extrabold text-rose-200">
                {p.img ? (
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="40px"
                    loading="lazy"
                    className="object-cover"
                  />
                ) : (
                  <span aria-hidden>{p.name.charAt(0).toUpperCase()}</span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-[13px] font-semibold text-zinc-100">
                  <Hi text={p.name} q={q} />
                </span>
                <span className="mt-0.5 block text-[11px] text-zinc-500">
                  {p.videos ? `${p.videos} videos · ${p.photos} photos` : "Model · tap to search videos"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-zinc-200">
                <User className="h-3 w-3" /> Profile
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Videos */}
      {videos.map((v, i) => {
        const idx = performers.length + i;
        return (
          <Link
            key={v.id}
            href={`/watch/${v.id}`}
            prefetch={false}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 transition ${
              idx === hi ? "bg-rose-600/20" : "hover:bg-white/5"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.default_thumb?.src}
              alt=""
              loading="lazy"
              className="h-10 w-[72px] shrink-0 rounded-lg object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 block text-[13px] font-semibold text-zinc-100">
                {v.title}
              </span>
              <span className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {formatViews(v.views)}
                </span>
                <span>{v.length_min}</span>
              </span>
            </span>
            <Play className="h-4 w-4 shrink-0 text-zinc-600" />
          </Link>
        );
      })}

      {/* Keyword quick picks */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2.5">
          {keywords.slice(0, 5).map((k) => (
            <button
              key={k.label}
              onClick={() => onSearchModel(k.label)}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Hi text={k.label} q={q} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ onOpenFilters }: { onOpenFilters: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [mobileSearch, setMobileSearch] = useState(false);
  const desk = useSuggestions(q, !mobileSearch);
  const mob = useSuggestions(q, mobileSearch);
  const boxRef = useRef<HTMLFormElement>(null);

  useEffect(() => setQ(sp.get("q") || ""), [sp]);

  // close suggestions on outside tap
  useEffect(() => {
    const fn = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        desk.setOpen(false);
        mob.setOpen(false);
      }
    };
    document.addEventListener("pointerdown", fn);
    return () => document.removeEventListener("pointerdown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goSearch = (term: string) => {
    const t = term.trim();
    const params = new URLSearchParams(sp.toString());
    if (t) params.set("q", t);
    else params.delete("q");
    params.delete("page");
    desk.setOpen(false);
    mob.setOpen(false);
    setMobileSearch(false);
    router.push(`/?${params.toString()}`);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    goSearch(q);
  };

  const onKey = (e: React.KeyboardEvent, s: SuggestState) => {
    if (!s.open || s.navCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      s.setHi((h) => (h + 1) % s.navCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      s.setHi((h) => (h - 1 + s.navCount) % s.navCount);
    } else if (e.key === "Enter" && s.hi >= 0) {
      e.preventDefault();
      if (s.hi < s.performers.length) goSearch(s.performers[s.hi].name);
      else {
        const v = s.videos[s.hi - s.performers.length];
        s.setOpen(false);
        setMobileSearch(false);
        router.push(`/watch/${v.id}`);
      }
    } else if (e.key === "Escape") {
      s.setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-orange-500 shadow-lg shadow-rose-900/40 transition-transform hover:scale-105 active:scale-95">
            <Clapperboard className="h-4 w-4 text-white" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-white sm:block">
            Videos<span className="text-rose-500">4You</span>
            <span className="ml-1.5 hidden rounded-md bg-white/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-zinc-300 md:inline">
              EPORNER API v2
            </span>
          </span>
          <span className="text-lg font-extrabold text-white sm:hidden">
            V<span className="text-rose-500">4Y</span>
          </span>
        </Link>

        {/* desktop search + suggestions */}
        <form
          ref={boxRef}
          onSubmit={submit}
          className="relative mx-auto hidden w-full max-w-xl flex-1 sm:block"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => q.trim().length >= 2 && desk.setOpen(true)}
            onKeyDown={(e) => onKey(e, desk)}
            placeholder="Search videos or models… try 'riley reid'"
            className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-rose-500/60 focus:bg-white/10 focus:ring-2 focus:ring-rose-500/20"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {desk.open && (
            <SuggestBox s={desk} q={q} onSearchModel={goSearch} onClose={() => desk.setOpen(false)} />
          )}
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <button
            onClick={() => setMobileSearch((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 active:scale-90 sm:hidden"
            aria-label="Search"
          >
            {mobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <button
            onClick={onOpenFilters}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <Link
            href="/saved"
            className="hidden h-9 items-center rounded-full bg-rose-600 px-4 text-xs font-bold text-white shadow-lg shadow-rose-950/50 transition hover:bg-rose-500 active:scale-95 md:flex"
          >
            My List
          </Link>
        </div>
      </div>

      {/* mobile expanding search + suggestions */}
      {mobileSearch && (
        <form onSubmit={submit} className="fade-in relative border-t border-white/10 px-3 py-2 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => onKey(e, mob)}
              placeholder="Search videos or models…"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-rose-500/60"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {mob.open && (
            <div className="relative pb-1">
              <SuggestBox s={mob} q={q} onSearchModel={goSearch} onClose={() => mob.setOpen(false)} />
            </div>
          )}
        </form>
      )}
    </header>
  );
}
