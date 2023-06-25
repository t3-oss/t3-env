import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).optional(),
    SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_GREETING: z.string(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_GREETING: process.env.NEXT_PUBLIC_GREETING,
  },
});
