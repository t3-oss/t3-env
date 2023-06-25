---
"@t3-oss/env-nextjs": minor
---

introduce a new `experimental__runtimeEnv` that only requires manual destruction of client side variables.

next.js 13.4.4 dropped the static analysis of serverside environment variables, which means that the manual destruction is no longer necessary for serverside variables
