import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_GREETING: z.string(),
    NEXT_PUBLIC_FOO: z.string().transform((s) => Number(s)),
  },
  runtimeEnv: {
    SECRET: process.env.SECRET,
    NEXT_PUBLIC_GREETING: process.env.NEXT_PUBLIC_GREETING,
    NEXT_PUBLIC_FOO: process.env.NEXT_PUBLIC_FOO,
  },
});
