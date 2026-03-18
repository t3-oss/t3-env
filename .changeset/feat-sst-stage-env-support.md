---
"@t3-oss/env-core": minor
"@t3-oss/env-nextjs": minor
---

feat: add SST stage-specific env file support

When using SST (Serverless Stack) with Next.js, environment variables are loaded
from stage-specific files like `.env.dev`, `.env.staging`, `.env.prod` rather than
the default `.env` that Next.js loads automatically. This caused t3-env validation
to fail because `process.env` never contained those stage-scoped variables.

This change adds two new utilities exported from `@t3-oss/env-core/sst` (and
re-exported from `@t3-oss/env-nextjs/sst`):

- **`loadSSTEnv(options?)`** — reads `SST_STAGE` from `process.env` and merges
  the corresponding `.env.<stage>` file into the runtime env object.
- **`loadEnvFile(filePath, cwd?)`** — generic helper that parses any dotenv-style
  file and returns a key-value record; silently returns `{}` if the file is absent.

Both functions are Node.js-only (use `node:fs`) and must not be imported in edge
or browser contexts.

A new `sst()` preset is also available in all three flavours
(`presets-zod`, `presets-valibot`, `presets-arktype`) to validate and type the
built-in SST env vars `SST_APP` and `SST_STAGE`.

### Usage

```ts
// env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { loadSSTEnv } from "@t3-oss/env-nextjs/sst";
import { sst } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    MY_SECRET: z.string(),
  },
  extends: [sst()],
  runtimeEnv: {
    ...process.env,
    ...loadSSTEnv(), // merges .env.${SST_STAGE} automatically
  },
});
```
