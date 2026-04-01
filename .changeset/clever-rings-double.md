---
"@t3-oss/env-core": patch
"@t3-oss/env-nextjs": patch
"@t3-oss/env-nuxt": patch
---

Migrate the monorepo to Vite+ by switching root workflows to `vp`, rewriting Vitest imports to `vite-plus/test`, and moving library packaging config into package-local `vite.config.ts` files.
