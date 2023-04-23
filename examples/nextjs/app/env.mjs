import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_GREETING: z.string(),
  },
  processEnv: {
    SECRET: process.env.SECRET,
    NEXT_PUBLIC_GREETING: process.env.NEXT_PUBLIC_GREETING,
  },
});
