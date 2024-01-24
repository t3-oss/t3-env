import { NextResponse } from "next/server";
import { env } from "~/env";

export function GET(_request: Request) {
    return NextResponse.json({ env, processEnv: process.env });
}
