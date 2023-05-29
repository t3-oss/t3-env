# Typesafe Envs made Simple

Deploying your app with invalid environment variables is a hassle. This package helps you to avoid that.

## Installation

```bash
# Core package, no framework specific features
pnpm add @t3-oss/env-core zod
# or, with options preconfigured for Next.js
pnpm add @t3-oss/env-nextjs zod
```

> Currently only supports Zod (which you'll need to install separately). Bring your own validation library is on the roadmap.

## Usage

> For full documentation, see https://env.t3.gg

This package supports the full power of Zod, meaning you can use `transforms` and `default` values.

### Define your schema

```ts
// src/env.mjs
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
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});
```

### Use the schema in your app with autocompletion and type inference

```ts
// src/app/hello/route.ts
import { env } from "../env.mjs";

export const GET = (req: Request) => {
  const DATABASE_URL = env.DATABASE_URL;
  // use it...
};
```

## Roadmap

- [ ] Bring your own validation library - currently only supports Zod.
