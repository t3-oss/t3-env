import { createEnv } from "@t3-env/core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    PORT: z.string(),
  },
  client: {
    PUBLIC_API_URL: z.string(),
  },
  processEnv: {
    PORT: import.meta.env.PORT,
    PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
  },
});
