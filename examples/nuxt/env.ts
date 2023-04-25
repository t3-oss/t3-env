import { createEnv } from "@t3-oss/env-nuxt";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string(),
  },
  client: {
    NUXT_PUBLIC_GREETING: z.string(),
  },
  runtimeEnv: {
    SECRET: process.env.SECRET,
    NUXT_PUBLIC_GREETING: process.env.NUXT_PUBLIC_GREETING,
  },
});
