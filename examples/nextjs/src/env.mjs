import { createEnv } from "@t3-env/nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
  },
  processEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
