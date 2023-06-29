import { joiAdapter, zodAdapter } from "@t3-oss/env-nuxt";
import Joi from "joi";

export const env = joiAdapter({
  client: {
    NUXT_PUBLIC_GREETING: Joi.string(),
  },
  server: {
    SECRET: Joi.number(),
  },
});
