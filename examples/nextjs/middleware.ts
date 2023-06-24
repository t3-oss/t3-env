import { NextResponse } from "next/server";
import { env } from "./app/env.mjs";

export default function mdwr(req: Request) {
  console.log("middleware.ts");
  console.log(env);
  return NextResponse.next();
}
