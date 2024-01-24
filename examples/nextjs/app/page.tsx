"use client";
import { env } from "~/env";

export default function HomePage() {
  return <div>Client says {env.NEXT_PUBLIC_GREETING}!</div>;
}
