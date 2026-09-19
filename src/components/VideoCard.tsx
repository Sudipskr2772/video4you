"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Bookmark, Eye, Play, Star } from "lucide-react";
import type { EpornerVideo } from "@/lib/eporner";
import { formatRating, formatViews, timeAgo } from "@/lib/format";

export function saveToggle(id: string) {
  try {
    const raw = localStorage.getItem("ep_saved") || "[]";
    const arr = JSON.parse(raw) as string[];
    const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    localStorage.setItem("ep_saved", JSON.stringify(next));
    return next.includes(id);
  } catch {
    return false;
  }
}

export default function VideoCard({ v, index = 0 }: { v: EpornerVideo; index?: number }) {
  const [thumb, setThumb] = useState(v.default_thumb?.src);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idx = useRef(0);

  const startPreview = () => {
    if (!v.thumbs?.length) return;
    timer.current = setInterval(() => {
      idx.current = (idx.current + 1) % v.thumbs.length;
      setThumb(v.thumbs[idx.current]?.src);
    }, 450);
  };
  const stopPreview = () => {
    if (timer.current) clearInterval(timer.current);
    setThumb(v.default_thumb?.src);
  };

  return (
    <Link
      href={`/watch/${v.id}`}
      prefetch={false}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      style={{ animationDelay: `${Math.min(index % 20, 19) * 35}ms` }}
      className="card-in group min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-xl hover:shadow-rose-950/30 active:scale-[0.98]"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        <Image
          src={thumb}
          alt={v.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          loading="lazy"
          decoding="async"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur">
          {v.length_min}
        </span>
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-amber-300 backdrop-blur">
          <Star className="h-3 w-3 fill-amber-300" /> {formatRating(v.rate)}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/25 group-hover:opacity-100">
          <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-rose-600/95 shadow-xl transition duration-200 group-hover:scale-100">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          </span>
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved(saveToggle(v.id));
          }}
          aria-label="Save"
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 backdrop-blur transition hover:bg-rose-600 focus:opacity-100 group-hover:opacity-100"
        >
          <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
        </button>
      </div>
      <div className="p-2.5 sm:p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 text-zinc-100 group-hover:text-white sm:text-sm">
          {v.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-500 sm:text-xs">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {formatViews(v.views)}
          </span>
          <span aria-hidden>•</span>
          <span className="truncate">{timeAgo(v.added)}</span>
        </div>
      </div>
    </Link>
  );
}
