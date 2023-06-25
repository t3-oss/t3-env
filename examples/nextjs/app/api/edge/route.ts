import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

export const runtime = "edge";

export function GET() {
  return NextResponse.json({ env, processEnv: process.env });
}
