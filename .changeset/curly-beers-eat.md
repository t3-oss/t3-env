---
"@t3-oss/env-nextjs": minor
---

make `runtimeEnv` optional. next.js 13.4.4 dropped the static analysis of environment variables, which means we no longer need to destructure the process.env object manually.
