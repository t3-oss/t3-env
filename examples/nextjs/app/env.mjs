import { joiAdapter, zodAdapter } from "@t3-oss/env-nextjs";
import Joi from "joi";

export const env = joiAdapter({
  client: {
    NEXT_PUBLIC_GREETING: Joi.string(),
  },
  server: {
    SECRET: Joi.number(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GREETING: "wads",
  },
});
