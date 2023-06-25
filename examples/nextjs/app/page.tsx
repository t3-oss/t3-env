"use client";
import { env } from "./env.mjs";

export default function HomePage() {
  return <div>Client says {env.NEXT_PUBLIC_GREETING}!</div>;
}
