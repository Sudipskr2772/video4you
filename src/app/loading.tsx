import AppShell from "@/components/AppShell";
import { CardSkeletonGrid } from "@/components/VideoGrid";

export default function Loading() {
  return (
    <AppShell>
      <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 sm:p-8">
        <div className="shimmer h-4 w-32 rounded-full" />
        <div className="shimmer mt-3 h-8 w-3/4 rounded-xl" />
        <div className="shimmer mt-2 h-4 w-1/2 rounded-lg" />
        <div className="mt-4 flex gap-2">
          <div className="shimmer h-9 w-28 rounded-full" />
          <div className="shimmer h-9 w-28 rounded-full" />
        </div>
      </div>
      <CardSkeletonGrid n={10} />
    </AppShell>
  );
}
