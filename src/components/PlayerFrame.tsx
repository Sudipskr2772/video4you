"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RectangleHorizontal } from "lucide-react";

export default function PlayerFrame({
  embed,
  title,
  theater,
  onToggleTheater,
}: {
  embed: string;
  title: string;
  theater: boolean;
  onToggleTheater: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFull = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await boxRef.current?.requestFullscreen();
        // Best-effort orientation lock to landscape on phones
        const orient = screen.orientation as unknown as {
          lock?: (o: string) => Promise<void>;
        };
        orient.lock?.("landscape").catch(() => {});
      }
    } catch {
      /* older browsers — the embed's own fullscreen button still works */
    }
  }, []);

  return (
    <div
      ref={boxRef}
      className="player-frame group/player relative aspect-video w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
    >
      <iframe
        key={embed}
        src={embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
      {/* custom controls — always fit inside phone width */}
      <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover/player:opacity-100">
        <button
          onClick={onToggleTheater}
          aria-label="Theater mode"
          title="Theater mode"
          className={`rounded-full p-2 backdrop-blur transition active:scale-90 ${
            theater ? "bg-rose-600 text-white" : "bg-black/70 text-white hover:bg-black/90"
          }`}
        >
          <RectangleHorizontal className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFull}
          aria-label="Fullscreen"
          title="Fullscreen"
          className="rounded-full bg-black/70 p-2 text-white backdrop-blur transition hover:bg-black/90 active:scale-90"
        >
          {isFull ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
