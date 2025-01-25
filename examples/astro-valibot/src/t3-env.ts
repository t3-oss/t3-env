import { createEnv } from "@t3-oss/env-core";
import { string } from "valibot";

export const env = createEnv({
  server: {
    PORT: string(),
  },
  client: {
    PUBLIC_API_URL: string(),
  },
  // Astro bundles all environment variables so
  // we don't need to manually destructure them
  runtimeEnv: import.meta.env,
  // process is not available in Astro, so we must set this explicitly
  skipValidation: import.meta.env.SKIP_ENV_VALIDATION === "development",
  clientPrefix: "PUBLIC_",
});
