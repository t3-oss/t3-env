# Typesafe Envs made Simple

The Next.js package comes preconfigured for Next.js and also enforces some extra rules by default to make sure you have out-of-the-box compatibility in all different Next.js runtimes.

> For full documentation, see https://env.t3.gg
> 
## Installation

```bash
# npm
npm i @t3-oss/env-nextjs

# pnpm
pnpm add @t3-oss/env-nextjs

# bun
bun add @t3-oss/env-nextjs

# deno
deno add jsr:@t3-oss/env-nextjs
```

## Usage

> [!NOTE]
>
> You may use any [Standard Schema](https://standardschema.dev) compliant validator of your choice. This example uses Zod

```ts
// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
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
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  /*
   * Specify what values should be validated by your schemas above.
   * 
   * If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
   * For Next.js >= 13.4.4, you can use the experimental__runtimeEnv option and
   * only specify client-side variables.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  },
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
```