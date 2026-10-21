---
"@t3-oss/env-nextjs": patch
"@t3-oss/env-nuxt": patch
---

Don't read `process.env` when `process` is not defined, so the framework wrappers no longer throw `process is not defined` in browsers.
