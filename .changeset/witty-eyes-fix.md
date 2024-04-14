---
"@t3-oss/env-nextjs": minor
"@t3-oss/env-core": minor
"@t3-oss/env-nuxt": minor
---

BREAKING: make env presets functions

To migrate:

```diff
  import { vercel } from '@t3-oss/env-core/presets'

  const env = createEnv({
      /** ... */
-     extends: [vercel],
+     extends: [vercel()],
  })
```