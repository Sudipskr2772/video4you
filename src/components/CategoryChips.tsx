"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryChips({ active }: { active: string }) {
  const norm = (active || "all").toLowerCase();
  return (
    <div className="sticky top-14 z-30 -mx-3 border-b border-white/5 bg-zinc-950/90 px-3 py-2 backdrop-blur-xl sm:top-16">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => {
          const isActive = norm === c.toLowerCase();
          const href = c === "all" ? "/" : `/?q=${encodeURIComponent(c)}`;
          return (
            <Link
              key={c}
              href={href}
              prefetch={false}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition active:scale-95 ${
                isActive
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-950/50"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
