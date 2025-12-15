# Typesafe Envs made Simple

![NPM Version](https://img.shields.io/npm/v/%40t3-oss%2Fenv-core)
[![JSR](https://jsr.io/badges/@t3-oss/env-core)](https://jsr.io/@t3-oss/env-core)
[![JSR Score](https://jsr.io/badges/@t3-oss/env-core/score)](https://jsr.io/@t3-oss/env-core)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@t3-oss/env-core)](https://socket.dev/npm/package/@t3-oss/env-core/overview)

The Nuxt package comes preconfigured for Nuxt, and fills the runtimeEnv option automatically. All you need to do is define your schemas!

> For full documentation, see https://env.t3.gg

## Installation

```bash
# npm
npm i @t3-oss/env-nuxt

# pnpm
pnpm add @t3-oss/env-nuxt

# bun
bun add @t3-oss/env-nuxt

# deno
deno add jsr:@t3-oss/env-nuxt
```

## Usage

> [!NOTE]
>
> You may use any [Standard Schema](https://standardschema.dev) compliant validator of your choice. This example uses Zod

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
