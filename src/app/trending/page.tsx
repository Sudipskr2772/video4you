import AppShell from "@/components/AppShell";
import VideoGrid from "@/components/VideoGrid";
import { searchVideos } from "@/lib/eporner";

export default async function TrendingPage() {
  const [weekly, monthly] = await Promise.all([
    searchVideos({ query: "all", order: "top-weekly", per_page: 24, page: 1 }).catch(() => null),
    searchVideos({ query: "all", order: "top-monthly", per_page: 24, page: 1 }).catch(() => null),
  ]);

  return (
    <AppShell activeCategory="all">
      <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
        🔥 Trending this week
      </h1>
      <p className="mb-4 text-xs text-zinc-500">
        order=top-weekly · {weekly?.total_count?.toLocaleString() || "—"} videos
      </p>
      {weekly && (
        <VideoGrid
          initial={weekly.videos}
          query="all"
          order="top-weekly"
          gay="0"
          lq="1"
          perPage={24}
          totalPages={weekly.total_pages || 1}
          totalCount={weekly.total_count || 0}
        />
      )}

      <h2 className="mb-1 mt-10 text-xl font-extrabold tracking-tight text-white">
        📅 Trending this month
      </h2>
      <p className="mb-4 text-xs text-zinc-500">order=top-monthly</p>
      {monthly && (
        <VideoGrid
          initial={monthly.videos}
          query="all"
          order="top-monthly"
          gay="0"
          lq="1"
          perPage={24}
          totalPages={monthly.total_pages || 1}
          totalCount={monthly.total_count || 0}
        />
      )}
    </AppShell>
  );
}
