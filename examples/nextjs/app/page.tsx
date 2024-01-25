"use client";
import { env } from "~/env";

export default function HomePage() {
  console.log("Vercel env", env.NEXT_PUBLIC_VERCEL_ENV);
  return <div>Client says {env.NEXT_PUBLIC_GREETING}!</div>;
}
