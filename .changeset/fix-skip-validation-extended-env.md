---
"@t3-oss/env-core": patch
---

fix: include extended env vars when `skipValidation` is true

Previously, calling `createEnv` with `skipValidation: true` returned only
`runtimeEnv`, silently dropping any variables contributed by the `extends`
array. Extended variables are now merged in (with `runtimeEnv` taking
precedence), matching the behaviour of the normal validation path.
