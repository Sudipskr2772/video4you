import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  const thumbsize = req.nextUrl.searchParams.get("thumbsize") || "medium";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const url = `https://www.eporner.com/api/v2/video/id/?id=${encodeURIComponent(id)}&thumbsize=${thumbsize}&format=json`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
    const data = await r.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
