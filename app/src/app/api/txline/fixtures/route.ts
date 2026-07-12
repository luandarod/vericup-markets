import { NextResponse } from "next/server";

export async function GET() {
  const { TXLINE_ORIGIN, TXLINE_JWT, TXLINE_API_TOKEN } = process.env;
  if (!TXLINE_ORIGIN || !TXLINE_JWT || !TXLINE_API_TOKEN) {
    return NextResponse.json({ error: "TxLINE is not configured" }, { status: 503 });
  }
  try {
    const response = await fetch(`${TXLINE_ORIGIN.replace(/\/$/, "")}/api/fixtures`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${TXLINE_JWT}`, "X-Api-Token": TXLINE_API_TOKEN }
    });
    if (!response.ok) throw new Error("Upstream failure");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "TxLINE request failed" }, { status: 502 });
  }
}
