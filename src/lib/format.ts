export function formatViews(n: number | string): string {
  const num = typeof n === "string" ? parseInt(n, 10) || 0 : n || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${num}`;
}

export function formatRating(r: string | number): string {
  const num = typeof r === "string" ? parseFloat(r) : r;
  if (Number.isNaN(num)) return "–";
  return num.toFixed(2).replace(/\.?0+$/, "");
}

export function timeAgo(dateStr: string): string {
  const t = new Date(dateStr.replace(" ", "T") + "Z").getTime();
  if (Number.isNaN(t)) return dateStr;
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function tagsOf(keywords: string, max = 12): string[] {
  if (!keywords) return [];
  return Array.from(
    new Set(
      keywords
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 1 && s.length < 28)
    )
  ).slice(0, max);
}
