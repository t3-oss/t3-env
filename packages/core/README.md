# Typesafe Envs made Simple

This is the framework agnostic core package of t3-env.

> For full documentation, see https://env.t3.gg


## Installation

```bash
# npm
npm i @t3-oss/env-core

# pnpm
pnpm add @t3-oss/env-core

# bun
bun add @t3-oss/env-core

# deno
deno add jsr:@t3-oss/env-core
```

## Usage

> [!NOTE]
>
> You may use any [Standard Schema](https://standardschema.dev) compliant validator of your choice. This example uses Zod

```ts
// src/env.ts
import { createEnv } from "@t3-oss/env-core";
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
   * 💡 You'll get type errors if these are not prefixed with PUBLIC_.
   */
  clientPrefix: 'PUBLIC_',
  client: {
    PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  /*
   * Specify what values should be validated by your schemas above.
   */
  runtimeEnv: process.env,
});
```