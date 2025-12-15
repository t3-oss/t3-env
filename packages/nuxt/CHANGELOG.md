# @t3-oss/env-nuxt

## 0.13.10

### Patch Changes

- Updated dependencies [[`a778bf3`](https://github.com/t3-oss/t3-env/commit/a778bf30450b74b74a902d2c6ccae6ec4b320c91)]:
  - @t3-oss/env-core@0.13.10

## 0.13.9

### Patch Changes

- Updated dependencies [[`5987d5a`](https://github.com/t3-oss/t3-env/commit/5987d5a68fc445ed7ba3485e7a847dca5593607a)]:
  - @t3-oss/env-core@0.13.9

## 0.13.8

### Patch Changes

- [#353](https://github.com/t3-oss/t3-env/pull/353) [`31202b8`](https://github.com/t3-oss/t3-env/commit/31202b8d0131ae4da366e26aa3782766c7c23cac) Thanks [@mmikhan](https://github.com/mmikhan)! - feat: add Vite preset (https://vite.dev/guide/env-and-mode)

- [#362](https://github.com/t3-oss/t3-env/pull/362) [`21d6d95`](https://github.com/t3-oss/t3-env/commit/21d6d950eac16bf30b72e037683ee94d50fc4663) Thanks [@mmikhan](https://github.com/mmikhan)! - feat: add WXT preset (https://wxt.dev/guide/essentials/config/environment-variables.html#built-in-environment-variables)

- Updated dependencies [[`31202b8`](https://github.com/t3-oss/t3-env/commit/31202b8d0131ae4da366e26aa3782766c7c23cac), [`21d6d95`](https://github.com/t3-oss/t3-env/commit/21d6d950eac16bf30b72e037683ee94d50fc4663)]:
  - @t3-oss/env-core@0.13.8

## 0.13.7

### Patch Changes

- [#357](https://github.com/t3-oss/t3-env/pull/357) [`216bc2d`](https://github.com/t3-oss/t3-env/commit/216bc2df4d391f44311273873f74e2f8dfd2011e) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - feat: add arktype presets

- [#354](https://github.com/t3-oss/t3-env/pull/354) [`221bdb5`](https://github.com/t3-oss/t3-env/commit/221bdb56e51ec6aa80a3bf751abb8f66822298bd) Thanks [@mmikhan](https://github.com/mmikhan)! - feat: add supabase vercel preset (https://vercel.com/marketplace/supabase)

- Updated dependencies [[`216bc2d`](https://github.com/t3-oss/t3-env/commit/216bc2df4d391f44311273873f74e2f8dfd2011e), [`221bdb5`](https://github.com/t3-oss/t3-env/commit/221bdb56e51ec6aa80a3bf751abb8f66822298bd)]:
  - @t3-oss/env-core@0.13.7

## 0.13.6

### Patch Changes

- Updated dependencies [[`aa245ed`](https://github.com/t3-oss/t3-env/commit/aa245edf2b80f0449c5537ade19630c88c08db35)]:
  - @t3-oss/env-core@0.13.6

## 0.13.5

### Patch Changes

- Updated dependencies [[`73e90f5`](https://github.com/t3-oss/t3-env/commit/73e90f563f8e6cc6621f4c59fe0229d0d336767a)]:
  - @t3-oss/env-core@0.13.5

## 0.13.4

### Patch Changes

- [`9872066`](https://github.com/t3-oss/t3-env/commit/9872066d49b87e3eae350c36563392324c80fd84) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any changes

- Updated dependencies [[`9872066`](https://github.com/t3-oss/t3-env/commit/9872066d49b87e3eae350c36563392324c80fd84)]:
  - @t3-oss/env-core@0.13.4

## 0.13.3

### Patch Changes

- [#337](https://github.com/t3-oss/t3-env/pull/337) [`2231713`](https://github.com/t3-oss/t3-env/commit/2231713170bcbf7f4998d9055bce8f0c0be0e71c) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any changes

- Updated dependencies [[`2231713`](https://github.com/t3-oss/t3-env/commit/2231713170bcbf7f4998d9055bce8f0c0be0e71c)]:
  - @t3-oss/env-core@0.13.3

## 0.13.2

### Patch Changes

- [#335](https://github.com/t3-oss/t3-env/pull/335) [`91db4ac`](https://github.com/t3-oss/t3-env/commit/91db4ac0c1acea79b486be62bee25948d5d1ea74) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any new changes

- Updated dependencies [[`91db4ac`](https://github.com/t3-oss/t3-env/commit/91db4ac0c1acea79b486be62bee25948d5d1ea74)]:
  - @t3-oss/env-core@0.13.2

## 0.13.1

### Patch Changes

- Updated dependencies [[`567491b`](https://github.com/t3-oss/t3-env/commit/567491b5918b0a1cd57425d4bb03157ce1c8dceb)]:
  - @t3-oss/env-core@0.13.1

## 0.13.0

### Minor Changes

- [#313](https://github.com/t3-oss/t3-env/pull/313) [`35577fc`](https://github.com/t3-oss/t3-env/commit/35577fca8fa0752f2542759ed11d8386d868c2a5) Thanks [@EskiMojo14](https://github.com/EskiMojo14)! - feat!: added ability to customise schema combination

  Combination of schemas can now be customised using the `createFinalSchema` option. This allows further refinement or transformation of the environment variables.

  For 99% of users, this is a non-breaking change. If you were relying on internal types, there's a type-only breaking change:

  - `CreateEnv` now has the signature `CreateEnv<TFinalSchema, TExtends>`, instead of the previous `CreateEnv<TServer, TClient, TShared, TExtends>`.
    - Previous behaviour can be achieved by using `DefaultCombinedSchema<TServer, TClient, TShared>` as the type for `TFinalSchema`.

### Patch Changes

- Updated dependencies [[`35577fc`](https://github.com/t3-oss/t3-env/commit/35577fca8fa0752f2542759ed11d8386d868c2a5), [`00c35f2`](https://github.com/t3-oss/t3-env/commit/00c35f2f26cb4f07ba16680e6c965128bdb5b9a7)]:
  - @t3-oss/env-core@0.13.0

## 0.12.0

### Minor Changes

- [#299](https://github.com/t3-oss/t3-env/pull/299) [`b13d46b`](https://github.com/t3-oss/t3-env/commit/b13d46b84cdeed816b0b7b28a1c50b953064f7d6) Thanks [@EskiMojo14](https://github.com/EskiMojo14)! - feat!: support standard schema

  Validators can now be any validator that supports [Standard Schema](https://github.com/standard-schema/standard-schema),
  for example Zod & Valibot.

  This feature comes with some breaking changes:

  - If using Zod, the minimum required version is now 3.24.
  - `onValidationError` now gets `StandardSchemaV1.Issue[]` instead of `ZodError`

- [#310](https://github.com/t3-oss/t3-env/pull/310) [`eb37304`](https://github.com/t3-oss/t3-env/commit/eb373046ed9f11f71df8acf3ddc2b8671faee95a) Thanks [@EskiMojo14](https://github.com/EskiMojo14)! - feat!: add valibot presets

  Presets using Valibot are now available using the `/presets-valibot` entrypoint.

  This feature comes with some breaking changes:

  - Zod presets have now been moved to `/presets-zod`.

### Patch Changes

- Updated dependencies [[`b13d46b`](https://github.com/t3-oss/t3-env/commit/b13d46b84cdeed816b0b7b28a1c50b953064f7d6), [`7c09bc3`](https://github.com/t3-oss/t3-env/commit/7c09bc36592c79cf2776fb57d04884b61de8ab89), [`eb37304`](https://github.com/t3-oss/t3-env/commit/eb373046ed9f11f71df8acf3ddc2b8671faee95a), [`bb80923`](https://github.com/t3-oss/t3-env/commit/bb809231d07a089391ed2949e5f1161caf1b3a30), [`bb80923`](https://github.com/t3-oss/t3-env/commit/bb809231d07a089391ed2949e5f1161caf1b3a30)]:
  - @t3-oss/env-core@0.12.0

## 0.11.1

### Patch Changes

- Updated dependencies [[`2a74b72`](https://github.com/t3-oss/t3-env/commit/2a74b72de710c179edddddae86bd272f05ec57d7)]:
  - @t3-oss/env-core@0.11.1

## 0.11.0

### Patch Changes

- Updated dependencies [[`8737daf`](https://github.com/t3-oss/t3-env/commit/8737daf90eaabe201fdaccdfe418a0f4f8835623), [`870608d`](https://github.com/t3-oss/t3-env/commit/870608d1890581edd82a7fc71419b520dab3464b)]:
  - @t3-oss/env-core@0.11.0

## 0.10.2

### Patch Changes

- Updated dependencies [[`204836b`](https://github.com/t3-oss/t3-env/commit/204836be6a47bce1fdbaca7e16c0d249684f9d0c)]:
  - @t3-oss/env-core@0.10.2

## 0.10.1

### Patch Changes

- [#224](https://github.com/t3-oss/t3-env/pull/224) [`bed246c`](https://github.com/t3-oss/t3-env/commit/bed246c493ad0bc6b6224b9f4dc9e2b47c82036f) Thanks [@colinhacks](https://github.com/colinhacks)! - refactor: add explicit return type to make lib more portable

- Updated dependencies [[`bed246c`](https://github.com/t3-oss/t3-env/commit/bed246c493ad0bc6b6224b9f4dc9e2b47c82036f)]:
  - @t3-oss/env-core@0.10.1

## 0.10.0

### Minor Changes

- [#215](https://github.com/t3-oss/t3-env/pull/215) [`5363e99`](https://github.com/t3-oss/t3-env/commit/5363e997327269d9d6158f79e18bf511a5f603f4) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - BREAKING: make env presets functions

  To migrate:

  ```diff
    import { vercel } from '@t3-oss/env-core/presets'

    const env = createEnv({
        /** ... */
  -     extends: [vercel],
  +     extends: [vercel()],
    })
  ```

### Patch Changes

- [`78585f3`](https://github.com/t3-oss/t3-env/commit/78585f30513294bb46e39fb9a8e64cbfff32df1e) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: support zod@3.23

- Updated dependencies [[`78585f3`](https://github.com/t3-oss/t3-env/commit/78585f30513294bb46e39fb9a8e64cbfff32df1e), [`5363e99`](https://github.com/t3-oss/t3-env/commit/5363e997327269d9d6158f79e18bf511a5f603f4)]:
  - @t3-oss/env-core@0.10.0

## 0.9.2

### Patch Changes

- [#186](https://github.com/t3-oss/t3-env/pull/186) [`ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3`](https://github.com/t3-oss/t3-env/commit/ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix exports condition once more...

- Updated dependencies [[`ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3`](https://github.com/t3-oss/t3-env/commit/ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3)]:
  - @t3-oss/env-core@0.9.2

## 0.9.1

### Patch Changes

- [#184](https://github.com/t3-oss/t3-env/pull/184) [`48dd2b5b4dfbc514b720f41a9362c50e9d4da93b`](https://github.com/t3-oss/t3-env/commit/48dd2b5b4dfbc514b720f41a9362c50e9d4da93b) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: add main field to package json

- Updated dependencies [[`48dd2b5b4dfbc514b720f41a9362c50e9d4da93b`](https://github.com/t3-oss/t3-env/commit/48dd2b5b4dfbc514b720f41a9362c50e9d4da93b)]:
  - @t3-oss/env-core@0.9.1

## 0.9.0

### Minor Changes

- [#182](https://github.com/t3-oss/t3-env/pull/182) [`34d04142b3cb2ba06e76866f05c21e4eeed16dc9`](https://github.com/t3-oss/t3-env/commit/34d04142b3cb2ba06e76866f05c21e4eeed16dc9) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - chore!: drop cjs

### Patch Changes

- Updated dependencies [[`34d04142b3cb2ba06e76866f05c21e4eeed16dc9`](https://github.com/t3-oss/t3-env/commit/34d04142b3cb2ba06e76866f05c21e4eeed16dc9)]:
  - @t3-oss/env-core@0.9.0

## 0.8.0

### Minor Changes

- [#170](https://github.com/t3-oss/t3-env/pull/170) [`9858b2786cc7f05f9d27a4ce325329f55bbb5c89`](https://github.com/t3-oss/t3-env/commit/9858b2786cc7f05f9d27a4ce325329f55bbb5c89) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - feat!: add ability to extend presets. Read more [in the docs](https://env.t3.gg/docs/customization#extending-presets).

  **BREAKING CHANGE**: The required TypeScript version is now ^5.0.0

### Patch Changes

- Updated dependencies [[`9858b2786cc7f05f9d27a4ce325329f55bbb5c89`](https://github.com/t3-oss/t3-env/commit/9858b2786cc7f05f9d27a4ce325329f55bbb5c89)]:
  - @t3-oss/env-core@0.8.0

## 0.7.3

### Patch Changes

- [`25f209536d1efdf6713906c361f213f9c34e12d9`](https://github.com/t3-oss/t3-env/commit/25f209536d1efdf6713906c361f213f9c34e12d9) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: add a prepack to remove worksapce protocol

- Updated dependencies [[`25f209536d1efdf6713906c361f213f9c34e12d9`](https://github.com/t3-oss/t3-env/commit/25f209536d1efdf6713906c361f213f9c34e12d9)]:
  - @t3-oss/env-core@0.7.3

## 0.7.2

### Patch Changes

- Updated dependencies [[`f4d5aeb98bf415fef18f9818507a38eb1c2ea700`](https://github.com/t3-oss/t3-env/commit/f4d5aeb98bf415fef18f9818507a38eb1c2ea700)]:
  - @t3-oss/env-core@0.7.2

## 0.7.1

### Patch Changes

- [#122](https://github.com/t3-oss/t3-env/pull/122) [`632d183`](https://github.com/t3-oss/t3-env/commit/632d1831dca827bf76a82d9a50a0b11125bd21a6) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Remove `any` type

- Updated dependencies [[`cb72fa9`](https://github.com/t3-oss/t3-env/commit/cb72fa9b4efa19428f33824ac8fccdf803c85c8c)]:
  - @t3-oss/env-core@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [[`c77c240`](https://github.com/t3-oss/t3-env/commit/c77c24009ce34aeedef0e04f1ce47be2e05610d1), [`4754db7`](https://github.com/t3-oss/t3-env/commit/4754db7160ad8372dd67c445b16d984c708d9699), [`86ea798`](https://github.com/t3-oss/t3-env/commit/86ea798ddd347c6e645b2ec827922acccfe2c78c)]:
  - @t3-oss/env-core@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [[`6890765`](https://github.com/t3-oss/t3-env/commit/68907651b6a04dcc459cd21fda2edb20f018ea0f)]:
  - @t3-oss/env-core@0.6.1

## 0.6.0

### Minor Changes

- [#90](https://github.com/t3-oss/t3-env/pull/90) [`1f6de0f`](https://github.com/t3-oss/t3-env/commit/1f6de0fca26160ee67bbb6179e5fc09404766940) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - feat: add `shared` section for shared variables

  shared variables are variables that are available in all runtimes despite them not being prefixed by anything, and is not manually supplied by the user.

### Patch Changes

- Updated dependencies [[`1f6de0f`](https://github.com/t3-oss/t3-env/commit/1f6de0fca26160ee67bbb6179e5fc09404766940)]:
  - @t3-oss/env-core@0.6.0

## 0.5.1

### Patch Changes

- Updated dependencies []:
  - @t3-oss/env-core@0.5.1

## 0.5.0

### Patch Changes

- Updated dependencies []:
  - @t3-oss/env-core@0.5.0

## 0.4.1

### Patch Changes

- Updated dependencies [[`245f6ad`](https://github.com/t3-oss/t3-env/commit/245f6ad1d763f9d5c260f093bd4dfb686333cc4f)]:
  - @t3-oss/env-core@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [[`b35b8e8`](https://github.com/t3-oss/t3-env/commit/b35b8e87e237ed32d4af3cef3d0d0783fe24f61a), [`fd7e659`](https://github.com/t3-oss/t3-env/commit/fd7e659fd31e5bbb07cbfc5bf1077d7177ee8ef3)]:
  - @t3-oss/env-core@0.4.0

## 0.3.1

### Patch Changes

- [`4473a06`](https://github.com/t3-oss/t3-env/commit/4473a0654d951557255162310b65099d41b2f6a5) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - add missing types field to packagejson.exports

- Updated dependencies []:
  - @t3-oss/env-core@0.3.1

## 0.3.0

### Minor Changes

- [#4](https://github.com/t3-oss/t3-env/pull/4) [`c82430e`](https://github.com/t3-oss/t3-env/commit/c82430e5e3039a5a1bcb58c924b8d1b8e4faed76) Thanks [@nexxeln](https://github.com/nexxeln)! - initial release of nuxt adapter

### Patch Changes

- Updated dependencies [[`979cd9a`](https://github.com/t3-oss/t3-env/commit/979cd9ac167677a237bf2a0a440eea94e3e6667a), [`a50e929`](https://github.com/t3-oss/t3-env/commit/a50e92977129ac1b7c1c46e3d0cae43d87842069), [`f0bc010`](https://github.com/t3-oss/t3-env/commit/f0bc0109251c355f00d8f432a53134a9ac3c34c5), [`f0b200c`](https://github.com/t3-oss/t3-env/commit/f0b200c428b732f1421a56bc2b82c51c2fca1767)]:
  - @t3-oss/env-core@0.3.0
