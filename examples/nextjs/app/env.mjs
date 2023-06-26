import { createEnv } from "@t3-oss/env-nextjs";
import Joi from "joi";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_GREETING: Joi.string(),
  },
  server: {
    SECRET: Joi.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GREETING: "wds",
  },
  validator: "joi",
});
