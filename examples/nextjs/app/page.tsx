"use client";
import { env } from "./env.mjs";

export default function HomePage() {
  console.log(env);
  return <div>Client says {env.NEXT_PUBLIC_GREETING}!</div>;
}
