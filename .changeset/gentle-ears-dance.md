---
"@t3-oss/env-core": minor
---

don't restrict runtimeEnv to just strings

turns out some frameworks inject environment variables as booleans or numbers, this allows you to use those without getting type errors
