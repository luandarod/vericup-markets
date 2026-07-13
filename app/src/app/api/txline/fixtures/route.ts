import { NextResponse } from "next/server";
import { txlineServerConfig } from "../../../../lib/txline-server";

const DEMO_FIXTURE_ID = 18175981;

export async function GET() {
  const config = txlineServerConfig();
  if (!config.configured) {
    return NextResponse.json({ error: "TxLINE is not configured", missing: config.missing }, { status: 503 });
  }
  try {
    const response = await fetch(`${config.origin}/api/scores/snapshot/${DEMO_FIXTURE_ID}`, {
      cache: "no-store",
      headers: { Accept: "application/json", Authorization: `Bearer ${config.jwt}`, "X-Api-Token": config.apiToken }
    });
    if (!response.ok) throw new Error("Upstream failure");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "TxLINE request failed" }, { status: 502 });
  }
}
