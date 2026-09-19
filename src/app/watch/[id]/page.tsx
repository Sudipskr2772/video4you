import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import WatchView from "@/components/WatchView";
import { getVideoById, searchVideos } from "@/lib/eporner";
import { tagsOf } from "@/lib/format";

export const runtime = "edge";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await getVideoById(id, "big").catch(() => null);
  if (!video) notFound();

  const firstTag = tagsOf(video.keywords, 1)[0] || video.title.split(" ").slice(0, 2).join(" ");
  let related: Awaited<ReturnType<typeof searchVideos>>["videos"] = [];
  try {
    const r = await searchVideos({ query: firstTag, per_page: 12, page: 1, order: "most-popular" });
    related = (r.videos || []).filter((v) => v.id !== video.id).slice(0, 10);
  } catch {}

  return (
    <AppShell>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-zinc-400 hover:text-white">
        ← Back to browse
      </Link>
      <WatchView video={video} related={related} relatedLabel={firstTag} />
    </AppShell>
  );
}
