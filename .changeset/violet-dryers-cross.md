---
"@t3-oss/env-nextjs": minor
"@t3-oss/env-core": minor
"@t3-oss/env-nuxt": minor
---

feat!: added ability to customise schema combination

Combination of schemas can now be customised using the `createFinalSchema` option. This allows further refinement or transformation of the environment variables.

For 99% of users, this is a non-breaking change. If you were relying on internal types, there's a type-only breaking change:

- `CreateEnv` now has the signature `CreateEnv<TFinalSchema, TExtends>`, instead of the previous `CreateEnv<TServer, TClient, TShared, TExtends>`.
  - Previous behaviour can be achieved by using `DefaultCombinedSchema<TServer, TClient, TShared>` as the type for `TFinalSchema`.
