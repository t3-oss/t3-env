# Typesafe Envs made Simple

The Nuxt package comes preconfigured for Nuxt, and fills the runtimeEnv option automatically. All you need to do is define your schemas!

## Installation

```bash
npm i @t3-oss/env-nuxt zod
```

## Usage

```ts
// src/env.ts
import { createEnv } from "@t3-oss/env-nuxt";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NUXT_PUBLIC_.
   */
  client: {
    NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
});
```