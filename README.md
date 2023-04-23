# Typesafe Envs made Simple

Deploying your app with invalid environment variables is a hassle. This package helps you to avoid that.

## Installation

```bash
# Core package, no framework specific features
pnpm add @t3-oss/env-core
# or, with options preconfigured for Next.js
pnpm add @t3-oss/env-nextjs
```

> Currently only supports Zod (which you'll need to install separately). Bring your own validation library is on the roadmap.

## Usage

This package supports the full power of Zod, meaning you can use `transforms` and `default` values.

### With Next.js

```ts
// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";

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
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get typeerrors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});

// src/app/hello/route.ts
import { env } from "../env.mjs";

export const GET = (req: Request) => {
  const DATABASE_URL = env.DATABASE_URL;
  // use it...
};
```

### With any framework

Below is an example of Astro, but in principle it should work with any framework.

```ts
// src/env.mjs
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: "ASTRO_PUBLIC_",
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
  },
  client: {
    ASTRO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  /*
   * Astro bundles all environment variables, so we don't need to destructure them manually.
   */
  runtimeEnv: import.meta.env,
  /*
   * Default skipValidation uses `process` which is not avaialble,
   * set it manually to a preferred expression.
   */
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
});
```

### Recipes

This library supports the full power of Zod, so you can use `default` and `transform` to transform your environment variables and perform even more granular validation.

> **Warning**
> All environment variables are strings, so make sure that the first `ZodType` is a `z.string()`. This will be enforced on type-level in the future.

```ts
export const env = createEnv({
  server: {
    SOME_NUMBER: z
      .string()
      // transform to number
      .transform((s) => parseInt(s, 10))
      // make sure transform worked
      .pipe(z.number()),

    COERCED_BOOLEAN: z
      .string()
      // transform to boolean using preferred coercion logic
      .transform((s) => s !== "false" && s !== "0"),

    ONLY_BOOLEAN: z
      .string()
      // only allow "true" or "false"
      .refine((s) => s === "true" || s === "false")
      // transform to boolean
      .transform((s) => s === "true"),
  },
  // ...
});
```

### Options

#### `clientPrefix`

Prefix to export environemnt variables to the client. This should be set depending on your framework, e.g. `NEXT_PUBLIC_` for Next.js or `PUBLIC_` for Astro.

#### `server`

Zod schema for server-side environment variables.

#### `client`

Zod schema for client-side environment variables.

#### `runtimeEnv`

Environment variables available at runtime. This is usually `process.env` or `import.meta.env`.

#### `runtimeEnvStrict`

A more strict version of `runtimeEnv` which will type-error that all variables from the `server` and `client` schemas are included. Useful for frameworks that don't bundle all environment variables unless they're explicitly accesses such as Next.js.

> **Note 1:** Exact one of `runtimeEnv` and `runtimeEnvStrict` should be set.

> **Note 2:** `runtimeEnv` is strict by default in `@t3-oss/env-nextjs`.

#### `isServer` (optional)

How to determine if we're on the server or client. Defaults to `typeof window === 'undefined'`.

#### `skipValidation` (optional)

Condition to skip validation. Defaults to `!!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== "false" && process.env.SKIP_ENV_VALIDATION !== "0"`.

> **Note:** Since this uses `process` by default, you'll get errors if not overriding it in environments where `process` isn't available.

## Roadmap

- [ ] Bring your own validation library - currently only supports Zod.
- [ ] Validate that all `_input` fields are strings to begin with, transforms may be applied on strings.
