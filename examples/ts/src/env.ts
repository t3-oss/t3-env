import z from "zod";
import dotenv from "dotenv";
import { createEnv } from "@t3-oss/env-core";
dotenv.config();

export const env = createEnv({
  server: {
    EXAMPLE_TOKEN: z.string(),
    WORKER_POOL_COUNT: z
      .string()
      .regex(/^\d+$/, { message: "Invalid int string" })
      .transform(Number),
  },

  // client can't be undefined, must be empty object if no environment variable ex. `client: {}`
  client: {},
  // clientPrefix can't be undefined, must be empty string
  clientPrefix: "",

  // Don't need to manually destructure in vanilla node
  runtimeEnv: process.env,
});
