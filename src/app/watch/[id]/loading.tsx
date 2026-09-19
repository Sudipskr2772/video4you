import AppShell from "@/components/AppShell";

export default function WatchLoading() {
  return (
    <AppShell>
      <div className="shimmer mb-3 h-4 w-32 rounded" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="shimmer aspect-video w-full rounded-2xl" />
          <div className="shimmer mt-3 h-7 w-3/4 rounded-lg" />
          <div className="mt-2 flex gap-3">
            <div className="shimmer h-4 w-24 rounded" />
            <div className="shimmer h-4 w-20 rounded" />
            <div className="shimmer h-4 w-16 rounded" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="shimmer h-9 w-24 rounded-full" />
            <div className="shimmer h-9 w-24 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-zinc-900">
              <div className="shimmer aspect-video" />
              <div className="shimmer m-3 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
