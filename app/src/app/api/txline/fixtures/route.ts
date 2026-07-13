import { NextResponse } from "next/server";
import { txlineServerConfig } from "../../../../lib/txline-server";

export async function GET() {
  const config = txlineServerConfig();
  if (!config.configured) {
    return NextResponse.json({ error: "TxLINE is not configured", missing: config.missing }, { status: 503 });
  }
  try {
    const response = await fetch(`${config.origin}/api/fixtures`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${config.jwt}`, "X-Api-Token": config.apiToken }
    });
    if (!response.ok) throw new Error("Upstream failure");
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "TxLINE request failed" }, { status: 502 });
  }
}
