"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, ExternalLink, Share2 } from "lucide-react";
import type { EpornerVideo } from "@/lib/eporner";

export default function WatchActions({ video }: { video: EpornerVideo }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("ep_saved") || "[]") as string[];
      setSaved(s.includes(video.id));
      // push history
      const h = JSON.parse(localStorage.getItem("ep_history") || "[]") as string[];
      const next = [video.id, ...h.filter((x) => x !== video.id)].slice(0, 100);
      localStorage.setItem("ep_history", JSON.stringify(next));
      localStorage.setItem(
        `ep_meta_${video.id}`,
        JSON.stringify({
          id: video.id,
          title: video.title,
          thumb: video.default_thumb?.src,
          length_min: video.length_min,
          views: video.views,
          rate: video.rate,
        })
      );
    } catch {}
  }, [video]);

  const toggleSave = () => {
    try {
      const s = JSON.parse(localStorage.getItem("ep_saved") || "[]") as string[];
      const next = s.includes(video.id) ? s.filter((x) => x !== video.id) : [...s, video.id];
      localStorage.setItem("ep_saved", JSON.stringify(next));
      localStorage.setItem(
        `ep_meta_${video.id}`,
        JSON.stringify({
          id: video.id,
          title: video.title,
          thumb: video.default_thumb?.src,
          length_min: video.length_min,
          views: video.views,
          rate: video.rate,
        })
      );
      setSaved(next.includes(video.id));
    } catch {}
  };

  const share = async () => {
    const url = `${location.origin}/watch/${video.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={toggleSave}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${
          saved ? "bg-rose-600 text-white" : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        onClick={share}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Share"}
      </button>
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
      >
        <ExternalLink className="h-3.5 w-3.5" /> Eporner
      </a>
    </div>
  );
}
