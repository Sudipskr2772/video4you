import { NextRequest, NextResponse } from "next/server";
import { buildSearchUrl } from "@/lib/eporner";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const url = buildSearchUrl({
    query: sp.get("query") || "all",
    per_page: Number(sp.get("per_page") || 30),
    page: Number(sp.get("page") || 1),
    thumbsize: (sp.get("thumbsize") as "medium" | "big" | "small") || "medium",
    order: (sp.get("order") as never) || "latest",
    gay: (Number(sp.get("gay") || 0) as 0 | 1 | 2) || 0,
    lq: (Number(sp.get("lq") ?? 1) as 0 | 1 | 2) ?? 1,
  });
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
    if (!r.ok) return NextResponse.json({ error: `upstream ${r.status}` }, { status: 502 });
    const data = await r.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
