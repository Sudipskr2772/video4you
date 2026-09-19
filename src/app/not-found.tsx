import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-5xl">😢</p>
        <h1 className="mt-3 text-2xl font-extrabold text-white">Video not found / removed</h1>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          The <code>/video/id/</code> endpoint returned empty — this video was removed.
        </p>
        <Link href="/" className="mt-5 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-500">
          Back home
        </Link>
      </div>
    </AppShell>
  );
}
