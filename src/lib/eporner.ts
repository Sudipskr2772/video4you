// Eporner API v2 — https://www.eporner.com/api/v2/
// Endpoints: /video/search/ , /video/id/ , /video/removed/

export type ThumbSize = "small" | "medium" | "big";
export type OrderParam =
  | "latest"
  | "longest"
  | "shortest"
  | "top-rated"
  | "most-popular"
  | "top-weekly"
  | "top-monthly";

export interface EpornerThumb {
  size: string;
  width: number;
  height: number;
  src: string;
}

export interface EpornerVideo {
  id: string;
  title: string;
  keywords: string;
  views: number;
  rate: string | number;
  url: string;
  added: string;
  length_sec: number;
  length_min: string;
  embed: string;
  default_thumb: EpornerThumb;
  thumbs: EpornerThumb[];
}

export interface SearchParams {
  query?: string;
  per_page?: number;
  page?: number;
  thumbsize?: ThumbSize;
  order?: OrderParam;
  gay?: 0 | 1 | 2;
  lq?: 0 | 1 | 2;
}

export interface SearchResponse {
  count: number;
  start: number;
  per_page: number;
  page: number;
  total_count: number;
  total_pages: number;
  time_ms?: number;
  videos: EpornerVideo[];
}

const BASE = "https://www.eporner.com/api/v2/video";

export function buildSearchUrl(p: SearchParams): string {
  const sp = new URLSearchParams({
    query: p.query?.trim() || "all",
    per_page: String(Math.min(Math.max(p.per_page ?? 30, 1), 100)),
    page: String(Math.max(p.page ?? 1, 1)),
    thumbsize: p.thumbsize ?? "medium",
    order: p.order ?? "latest",
    gay: String(p.gay ?? 0),
    lq: String(p.lq ?? 1),
    format: "json",
  });
  return `${BASE}/search/?${sp.toString()}`;
}

export async function searchVideos(
  params: SearchParams,
  init?: RequestInit
): Promise<SearchResponse> {
  const url = buildSearchUrl(params);
  const res = await fetch(url, {
    ...init,
    next: { revalidate: 300 },
    headers: { "User-Agent": "Mozilla/5.0 NextJS-Eporner-Client", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const data = await res.json();
  // API returns [] when nothing found in some edge cases
  if (Array.isArray(data)) {
    return { count: 0, start: 0, per_page: params.per_page ?? 30, page: params.page ?? 1, total_count: 0, total_pages: 0, videos: [] };
  }
  return {
    ...data,
    total_count: Number(data.total_count ?? data.videos?.length ?? 0),
    total_pages: Number(data.total_pages ?? 1),
    videos: Array.isArray(data.videos) ? data.videos : [],
  };
}

export async function getVideoById(
  id: string,
  thumbsize: ThumbSize = "medium"
): Promise<EpornerVideo | null> {
  if (!id) return null;
  const url = `${BASE}/id/?id=${encodeURIComponent(id)}&thumbsize=${thumbsize}&format=json`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "Mozilla/5.0 NextJS-Eporner-Client" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || Array.isArray(data) || !data.id) return null;
  return data as EpornerVideo;
}

export async function getRemovedIds(format: "json" | "txt" = "json"): Promise<string[]> {
  const url = `${BASE}/removed/?format=${format}`;
  const res = await fetch(url, {
    next: { revalidate: 86400 },
    headers: { "User-Agent": "Mozilla/5.0 NextJS-Eporner-Client" },
  });
  if (!res.ok) throw new Error(`removed failed: ${res.status}`);
  if (format === "txt") {
    const txt = await res.text();
    return txt.split(/\s+/).map((s) => s.trim()).filter(Boolean);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data.map((v: { id: string }) => v.id).filter(Boolean);
  return [];
}
