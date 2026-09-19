import { NextResponse } from "next/server";

export async function GET() {
  // Use txt (60% smaller) then map to array — demonstrates /removed/ endpoint
  try {
    const r = await fetch("https://www.eporner.com/api/v2/video/removed/?format=txt", {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    const txt = await r.text();
    const ids = txt.split(/\s+/).map((s) => s.trim()).filter(Boolean);
    return NextResponse.json(
      { count: ids.length, sample: ids.slice(0, 50), updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
