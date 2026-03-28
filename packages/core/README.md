# Typesafe Envs made Simple

![NPM Version](https://img.shields.io/npm/v/%40t3-oss%2Fenv-core)
[![JSR](https://jsr.io/badges/@t3-oss/env-core)](https://jsr.io/@t3-oss/env-core)
[![JSR Score](https://jsr.io/badges/@t3-oss/env-core/score)](https://jsr.io/@t3-oss/env-core)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@t3-oss/env-core)](https://socket.dev/npm/package/@t3-oss/env-core/overview)

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
> You may use any [Standard Schema](https://standardschema.dev) compliant validator of your choice. This example uses Zod.
> See the [documentation](https://env.t3.gg/docs/standard-schema) for more details.

```ts
// src/env.ts
import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.url(),
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

## Experimental worktree support

`worktreeDetection` is an opt-in workaround for local git worktree setups in supported Node and Bun runtimes.

```ts
import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
  },
  runtimeEnv: process.env,
  worktreeDetection: true,
});
```

When enabled, T3 Env will try to treat the main worktree's project-root `.env` as the canonical file for linked worktrees. If the current linked worktree does not already have its own `.env`, T3 Env will try to symlink it to the main worktree's `.env` and load values from there before validation.

This is intentionally conservative:

- It does not move secrets into `.git`.
- It leaves an existing linked-worktree `.env` file in place.
- It warns and falls back if the main worktree `.env` is missing or if the runtime does not support filesystem and git access.
