"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function AgeGate() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setOk(localStorage.getItem("ep_age_ok") === "1");
    } catch {
      setOk(false);
    }
  }, []);

  if (ok === null || ok) return null;

  return (
    <div className="fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
      <div className="pop-in w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600/15 text-rose-500">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">18+ Adults Only</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          This site streams adult videos via the public Eporner API v2. You must be 18 or older (or
          the legal age in your country) to continue.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="https://www.google.com"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            I&apos;m under 18
          </a>
          <button
            onClick={() => {
              try {
                localStorage.setItem("ep_age_ok", "1");
              } catch {}
              setOk(true);
            }}
            className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500 active:scale-95"
          >
            I&apos;m 18+ — Enter
          </button>
        </div>
        <p className="mt-4 text-[11px] text-zinc-600">
          By entering you agree to our Terms · Privacy · 2257 / DMCA info in the footer.
        </p>
      </div>
    </div>
  );
}
