# Typesafe Envs made Simple

Deploying your app with invalid environment variables is a hassle. This package helps you to avoid that.

> For full documentation, see https://env.t3.gg

## Installation

> [!NOTE]
>
> This is an ESM only package that requires a tsconfig with a module resolution that can read package.json#exports (`NodeNext` if transpiling with `tsc`, `Bundler` if using a bundler).

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
> You may use any Standard Schema compliant validator of your choice. This example uses Zod


This package supports the full power of Zod/Valibot etc, meaning you can use `transforms` and `default` values.

### Define your schema

```ts
// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs"; // or core package
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

## Contributing

This project uses [Bun](https://bun.sh) as its package manager. To install:

```sh
# Linux & macOS
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

To get started, clone the repo:

```sh
git clone https://github.com/t3-oss/t3-env.git
```

It is recommended to use VSCode (or a fork like [Cursor](https://www.cursor.com) or [Windsurf](https://windsurf.com)) with the [recommended extensions](./.vscode/extensions.json) installed.

Then, install the project dependencies:

```sh
cd t3-env
bun i
```

Checkout a feature branch for the change you're about to make:

```sh
git checkout <branch_name>
```

Implement your changes, then submit a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) describing your changes.

### General Guidelines

- When developing changes, checkout a feature branch. **DO NOT** create pull requests from your main branch as these are sometimes protected from maintainer edits.
- Start the build watchers using `bun run dev`. This will recompile the necessary packages whenever you make changes.
- Make as many changes as possible in the [core](./packages/core) package, re-export framework specific code from the respective package.
- Add tests (both runtime and types) to verify your changes.
- Add a changeset using `bun changeset` to ensure your changes trigger a release with appropriate changelog.

### When it's time to commit

- Run the linters using `bun lint` (`bun lint:fix` to fix auto-fixable issues)
- Run the tests using `bun run test`. Alternatively, you can use the test explorer in VSCode to target individual tests.
- Commit with whatever commit message you want. We squash PRs so the individual commit messages does not matter.
  - For bug fixes, it's a good practise to first add a failing regression test in one commit, and then implement the fix in another. This helps the review process as it's easy to see what was failing before, and how it succeeded after your change. 
- Add a pull request description explaining your changes. Link any relevant issues (e.g. by including `Closes #123` in the description).
- If some change might require extra consideration, a quick self-review can help maintainers more easily review your code and get it merged faster.

Please note that this repo is maintained by individuals with full-time jobs as their primary source of income. Please allow for appropriate time to review as this is done on their spare time. If you have not received a review in a week, you may tag `@juliusmarminge` to bump the issue.

## License

[MIT](./LICENSE.md) License © 2025 [Julius Marminge](https://github.com/juliusmarminge)
