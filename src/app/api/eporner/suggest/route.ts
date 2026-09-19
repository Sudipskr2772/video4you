import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export interface SuggestPerformer {
  name: string;
  href: string;
  img: string;
  videos: string;
  photos: string;
}

export interface SuggestKeyword {
  label: string;
  href: string;
  videos: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function fetchHtml(q: string): Promise<string | null> {
  // one automatic retry — upstream occasionally resets rapid connections
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(
        `https://www.eporner.com/suggest/${encodeURIComponent(q)}/all/?layout=sections`,
        {
          headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" },
          cache: "no-store",
        }
      );
      if (r.ok) return await r.text();
    } catch {
      /* retry */
    }
    await new Promise((res) => setTimeout(res, 400));
  }
  return null;
}

/** Fallback: JSON name list (no photos) from the upload-form autocomplete. */
async function fetchPornstarNames(q: string): Promise<SuggestPerformer[]> {
  try {
    const r = await fetch(
      `https://www.eporner.com/pornstar_get_suggest/?q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": UA, Accept: "application/json" }, cache: "no-store" }
    );
    if (!r.ok) return [];
    const data: unknown = await r.json();
    if (!Array.isArray(data)) return [];
    return (data as { id?: number; name?: string }[])
      .filter((p) => typeof p?.name === "string" && p.name.trim().length > 0)
      .slice(0, 6)
      .map((p) => ({
        name: (p.name as string).trim(),
        href: `/pornstar/${(p.name as string).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`,
        img: "",
        videos: "",
        photos: "",
      }));
  } catch {
    return [];
  }
}

/**
 * Proxy for Eporner's official site autocomplete:
 *   GET /suggest/{query}/all/?layout=sections
 * Same data the main site shows under its search box — keyword
 * suggestions plus pornstar (performer) profiles with photos and
 * video/photo counts. Parsed server-side into light JSON.
 * Falls back to /pornstar_get_suggest/ (names only) if the HTML
 * feed is unreachable.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 40);
  if (q.length < 2) {
    return NextResponse.json({ keywords: [], performers: [] as SuggestPerformer[] });
  }
  const html = await fetchHtml(q);
  let keywords: SuggestKeyword[] = [];
  let performers: SuggestPerformer[] = [];

  if (html) {
    keywords = Array.from(
      html.matchAll(
        /<li[^>]*class="qsliac"[^>]*>[\s\S]*?<a href="([^"]+)" title="([^"]*)"[\s\S]*?<span class="qslabel">(.*?)<\/span>[\s\S]*?title="Videos: ([\d,]+)"/g
      )
    )
      .slice(0, 6)
      .map((m) => ({ label: strip(m[3]), href: m[1], videos: m[4] }))
      .filter((k) => k.label.length > 0);

    performers = Array.from(
      html.matchAll(
        /<li[^>]*class="qsliacstar"[^>]*>[\s\S]*?<a href="([^"]+)" title="([^"]*)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<span class="qsstarname">(.*?)<\/span>[\s\S]*?title="Videos: ([\d,]+)"[\s\S]*?title="Photos: ([\d,]+)"/g
      )
    )
      .slice(0, 5)
      .map((m) => ({
        name: strip(m[4]),
        href: m[1],
        img: m[3],
        videos: m[5],
        photos: m[6],
      }))
      .filter((p) => p.name.length > 0 && p.img.startsWith("http"));
  }

  // fallback so model names still appear even if the HTML feed hiccups
  if (performers.length === 0) {
    performers = await fetchPornstarNames(q);
  }

  return NextResponse.json(
    { keywords, performers },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" } }
  );
}

function strip(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
