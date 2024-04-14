import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_GREETING: z.string(),
  },
  server: {
    SECRET: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GREETING: process.env.NEXT_PUBLIC_GREETING,
  },
  extends: [vercel()],
});
