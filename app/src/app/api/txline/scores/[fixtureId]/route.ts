import { TxlineClient } from "@vericup/txline";
import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ fixtureId: string }> }) {
  const { fixtureId } = await context.params;
  const id = Number(fixtureId);
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid fixture" }, { status: 400 });
  const { TXLINE_ORIGIN, TXLINE_JWT, TXLINE_API_TOKEN } = process.env;
  if (!TXLINE_ORIGIN || !TXLINE_JWT || !TXLINE_API_TOKEN) {
    return NextResponse.json({ error: "TxLINE is not configured" }, { status: 503 });
  }
  try {
    const client = new TxlineClient({ origin: TXLINE_ORIGIN, jwt: TXLINE_JWT, apiToken: TXLINE_API_TOKEN });
    return NextResponse.json(await client.scoreSnapshot(id));
  } catch {
    return NextResponse.json({ error: "TxLINE request failed" }, { status: 502 });
  }
}
