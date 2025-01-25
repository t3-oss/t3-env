---
"@t3-oss/env-nextjs": minor
"@t3-oss/env-core": minor
"@t3-oss/env-nuxt": minor
---

feat!: support standard schema

Validators can now be any validator that supports [Standard Schema](https://github.com/standard-schema/standard-schema),
for example Zod & Valibot.

This feature comes with some breaking changes:

- If using Zod, the minimum required version is now 3.24.
- `onValidationError` now gets `StandardSchemaV1.Issue[]` instead of `ZodError`
