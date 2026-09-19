import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-zinc-950 pb-24 sm:pb-8">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 text-sm text-zinc-400 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-extrabold text-white">
            Videos<span className="text-rose-500">4You</span>
          </p>
          <p className="mt-2 max-w-md text-xs leading-5 text-zinc-500">
            A modern, mobile-first streaming front-end powered entirely by the public Eporner API
            v2 — <code>/video/search/</code> for listing &amp; search, <code>/video/id/</code> for
            details &amp; playback, <code>/video/removed/</code> for sync &amp; status — plus the
            official site autocomplete for model profiles. No videos are hosted here; playback uses
            official Eporner embeds.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Explore</p>
          <div className="flex flex-col gap-1.5">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/trending" className="hover:text-white">Trending</Link>
            <Link href="/saved" className="hover:text-white">My List</Link>
            <Link href="/history" className="hover:text-white">History</Link>
            <Link href="/status" className="hover:text-white">API Status / Removed</Link>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Legal</p>
          <div className="flex flex-col gap-1.5">
            <a href="https://www.eporner.com/api/v2/" target="_blank" rel="noreferrer" className="hover:text-white">API docs (eporner.com/api/v2)</a>
            <a href="https://www.eporner.com/terms/" target="_blank" rel="noreferrer" className="hover:text-white">Terms · Privacy · 2257</a>
            <a href="https://www.eporner.com/dmca/" target="_blank" rel="noreferrer" className="hover:text-white">DMCA / Removal</a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/5 py-4 text-center text-[11px] text-zinc-600">
        18+ only · © 2026 Videos4You · Built with Next.js + Tailwind
      </p>
    </footer>
  );
}
