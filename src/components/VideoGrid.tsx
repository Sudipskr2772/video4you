"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { EpornerVideo } from "@/lib/eporner";
import VideoCard from "./VideoCard";

interface Props {
  initial: EpornerVideo[];
  query: string;
  order: string;
  gay: string;
  lq: string;
  perPage: number;
  startPage?: number;
  totalPages: number;
  totalCount: number;
  /** Docs field `start` — first video number of page 1 */
  start?: number;
  /** Docs field `time_ms` — API execution time (not always present) */
  timeMs?: number;
}

export default function VideoGrid({
  initial,
  query,
  order,
  gay,
  lq,
  perPage,
  startPage = 1,
  totalPages,
  totalCount,
  start = 0,
  timeMs,
}: Props) {
  const [videos, setVideos] = useState<EpornerVideo[]>(initial);
  const [page, setPage] = useState(startPage);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(startPage >= totalPages || initial.length === 0);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideos(initial);
    setPage(startPage);
    setDone(startPage >= totalPages || initial.length === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, order, gay, lq, perPage]);

  useEffect(() => {
    if (done) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loading) return;
        setLoading(true);
        try {
          const next = page + 1;
          const u = new URLSearchParams({
            query: query || "all",
            per_page: String(perPage),
            page: String(next),
            order,
            gay,
            lq,
            thumbsize: "medium",
          });
          const r = await fetch(`/api/eporner/search?${u.toString()}`);
          const data = await r.json();
          const list: EpornerVideo[] = data.videos || [];
          if (!list.length || next >= (data.total_pages || totalPages)) setDone(true);
          setVideos((p) => [...p, ...list]);
          setPage(next);
        } catch {
          setDone(true);
        } finally {
          setLoading(false);
        }
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, done, loading, query, order, gay, lq, perPage]);

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-lg font-bold text-white">No videos found</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Try a different keyword, clear filters, or check the word spelling. The API returns an
          empty list when nothing matches.
        </p>
      </div>
    );
  }

  const shownFrom = start + 1;
  const shownTo = start + videos.length;

  return (
    <>
      <p className="mb-3 text-xs text-zinc-500">
        <span className="font-bold text-zinc-300">{Number(totalCount).toLocaleString()}</span>{" "}
        results · showing {shownFrom.toLocaleString()}–{shownTo.toLocaleString()}
        {typeof timeMs === "number" && <span> · {timeMs} ms</span>} · page {page} of{" "}
        {Number(totalPages).toLocaleString()} · infinite scroll on
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {videos.map((v, i) => (
          <VideoCard key={v.id + v.title} v={v} index={i} />
        ))}
      </div>
      <div ref={sentinel} className="flex items-center justify-center py-8">
        {loading ? (
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading more…
          </span>
        ) : done ? (
          <span className="text-xs text-zinc-600">You&apos;ve reached the end</span>
        ) : (
          <span className="text-xs text-zinc-600">Scroll for more</span>
        )}
      </div>
    </>
  );
}

export function CardSkeletonGrid({ n = 10 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900">
          <div className="shimmer aspect-video" />
          <div className="space-y-2 p-3">
            <div className="shimmer h-3 rounded" />
            <div className="shimmer h-3 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
