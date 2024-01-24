import { NextResponse } from "next/server";
import { env } from "~/env";

export const runtime = "edge";

export function GET() {
	return NextResponse.json({ env, processEnv: process.env });
}
