"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, Eye, Star, Timer } from "lucide-react";
import PlayerFrame from "./PlayerFrame";
import VideoCard from "./VideoCard";
import WatchActions from "./WatchActions";
import type { EpornerVideo } from "@/lib/eporner";
import { formatRating, formatViews, tagsOf } from "@/lib/format";

export default function WatchView({
  video,
  related,
  relatedLabel,
}: {
  video: EpornerVideo;
  related: EpornerVideo[];
  relatedLabel: string;
}) {
  const [theater, setTheater] = useState(false);
  const tags = tagsOf(video.keywords, 14);

  return (
    <div className={`grid min-w-0 gap-5 ${theater ? "grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_340px]"}`}>
      {/* main column — min-w-0 keeps the embed locked to phone width */}
      <div className="min-w-0 max-w-full">
        <PlayerFrame
          embed={video.embed}
          title={video.title}
          theater={theater}
          onToggleTheater={() => setTheater((t) => !t)}
        />

        <h1 className="mt-3 break-words text-lg font-extrabold leading-6 tracking-tight text-white sm:text-2xl">
          {video.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {formatViews(video.views)} views
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <Star className="h-4 w-4 fill-amber-300" /> {formatRating(video.rate)} / 5
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="h-4 w-4" /> {video.length_min}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {video.added}
          </span>
        </div>

        <div className="mt-3">
          <WatchActions video={video} />
        </div>

        {tags.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/?q=${encodeURIComponent(t)}`}
                  prefetch={false}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium capitalize text-zinc-300 transition hover:scale-105 hover:bg-white/10 hover:text-white active:scale-95"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        )}

        {video.thumbs?.length > 0 && (
          <div className="mt-5 min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Preview frames · via <code>/video/id/</code>
            </p>
            <div className="thumb-strip -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {video.thumbs.slice(0, 15).map((t) => (
                <img
                  key={t.src}
                  src={t.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-28 shrink-0 rounded-lg border border-white/10 object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* related column */}
      <aside className="min-w-0">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Related · “{relatedLabel}”
        </p>
        <div
          className={`grid grid-cols-2 gap-2.5 ${
            theater ? "sm:grid-cols-3 lg:grid-cols-4" : "lg:grid-cols-1 xl:grid-cols-2"
          }`}
        >
          {related.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
        {related.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-zinc-500">
            No related videos right now.
          </p>
        )}
      </aside>
    </div>
  );
}
