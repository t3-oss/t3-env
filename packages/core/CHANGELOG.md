# @t3-oss/env-core

## 0.13.4

### Patch Changes

- [`9872066`](https://github.com/t3-oss/t3-env/commit/9872066d49b87e3eae350c36563392324c80fd84) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any changes

## 0.13.3

### Patch Changes

- [#337](https://github.com/t3-oss/t3-env/pull/337) [`2231713`](https://github.com/t3-oss/t3-env/commit/2231713170bcbf7f4998d9055bce8f0c0be0e71c) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any changes

## 0.13.2

### Patch Changes

- [#335](https://github.com/t3-oss/t3-env/pull/335) [`91db4ac`](https://github.com/t3-oss/t3-env/commit/91db4ac0c1acea79b486be62bee25948d5d1ea74) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - note: this release does not contain any new changes

## 0.13.1

### Patch Changes

- [#227](https://github.com/t3-oss/t3-env/pull/227) [`567491b`](https://github.com/t3-oss/t3-env/commit/567491b5918b0a1cd57425d4bb03157ce1c8dceb) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - add `VERCEL_PROJECT_PRODUCTION_URL` to vercel preset

## 0.13.0

### Minor Changes

- [#313](https://github.com/t3-oss/t3-env/pull/313) [`35577fc`](https://github.com/t3-oss/t3-env/commit/35577fca8fa0752f2542759ed11d8386d868c2a5) Thanks [@EskiMojo14](https://github.com/EskiMojo14)! - feat!: added ability to customise schema combination

  Combination of schemas can now be customised using the `createFinalSchema` option. This allows further refinement or transformation of the environment variables.

  For 99% of users, this is a non-breaking change. If you were relying on internal types, there's a type-only breaking change:

  - `CreateEnv` now has the signature `CreateEnv<TFinalSchema, TExtends>`, instead of the previous `CreateEnv<TServer, TClient, TShared, TExtends>`.
    - Previous behaviour can be achieved by using `DefaultCombinedSchema<TServer, TClient, TShared>` as the type for `TFinalSchema`.

### Patch Changes

- [#312](https://github.com/t3-oss/t3-env/pull/312) [`00c35f2`](https://github.com/t3-oss/t3-env/commit/00c35f2f26cb4f07ba16680e6c965128bdb5b9a7) Thanks [@Abdalrhman-Almarakeby](https://github.com/Abdalrhman-Almarakeby)! - add preset for upstash redis environment variables

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

- [`bb80923`](https://github.com/t3-oss/t3-env/commit/bb809231d07a089391ed2949e5f1161caf1b3a30) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - update uploadthing preset to v7. add `uploadthingV6` for legacy config

### Patch Changes

- [#279](https://github.com/t3-oss/t3-env/pull/279) [`7c09bc3`](https://github.com/t3-oss/t3-env/commit/7c09bc36592c79cf2776fb57d04884b61de8ab89) Thanks [@thevisioner](https://github.com/thevisioner)! - add netlify preset

- [`bb80923`](https://github.com/t3-oss/t3-env/commit/bb809231d07a089391ed2949e5f1161caf1b3a30) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - add neonVercel preset

## 0.11.1

### Patch Changes

- [#254](https://github.com/t3-oss/t3-env/pull/254) [`2a74b72`](https://github.com/t3-oss/t3-env/commit/2a74b72de710c179edddddae86bd272f05ec57d7) Thanks [@dburdan](https://github.com/dburdan)! - fly.io preset

## 0.11.0

### Minor Changes

- [#239](https://github.com/t3-oss/t3-env/pull/239) [`8737daf`](https://github.com/t3-oss/t3-env/commit/8737daf90eaabe201fdaccdfe418a0f4f8835623) Thanks [@Gomah](https://github.com/Gomah)! - add render preset

- [#253](https://github.com/t3-oss/t3-env/pull/253) [`870608d`](https://github.com/t3-oss/t3-env/commit/870608d1890581edd82a7fc71419b520dab3464b) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - railway preset

## 0.10.2

### Patch Changes

- [#235](https://github.com/t3-oss/t3-env/pull/235) [`204836b`](https://github.com/t3-oss/t3-env/commit/204836be6a47bce1fdbaca7e16c0d249684f9d0c) Thanks [@chribjel](https://github.com/chribjel)! - add `VERCEL_PROJECT_PRODUCTION_URL` to vercel preset

## 0.10.1

### Patch Changes

- [#224](https://github.com/t3-oss/t3-env/pull/224) [`bed246c`](https://github.com/t3-oss/t3-env/commit/bed246c493ad0bc6b6224b9f4dc9e2b47c82036f) Thanks [@colinhacks](https://github.com/colinhacks)! - refactor: add explicit return type to make lib more portable

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

## 0.9.2

### Patch Changes

- [#186](https://github.com/t3-oss/t3-env/pull/186) [`ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3`](https://github.com/t3-oss/t3-env/commit/ff17d1d05b8beb92d4f3a13de18b3a8f99c30ba3) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix exports condition once more...

## 0.9.1

### Patch Changes

- [#184](https://github.com/t3-oss/t3-env/pull/184) [`48dd2b5b4dfbc514b720f41a9362c50e9d4da93b`](https://github.com/t3-oss/t3-env/commit/48dd2b5b4dfbc514b720f41a9362c50e9d4da93b) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: add main field to package json

## 0.9.0

### Minor Changes

- [#182](https://github.com/t3-oss/t3-env/pull/182) [`34d04142b3cb2ba06e76866f05c21e4eeed16dc9`](https://github.com/t3-oss/t3-env/commit/34d04142b3cb2ba06e76866f05c21e4eeed16dc9) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - chore!: drop cjs

## 0.8.0

### Minor Changes

- [#170](https://github.com/t3-oss/t3-env/pull/170) [`9858b2786cc7f05f9d27a4ce325329f55bbb5c89`](https://github.com/t3-oss/t3-env/commit/9858b2786cc7f05f9d27a4ce325329f55bbb5c89) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - feat!: add ability to extend presets. Read more [in the docs](https://env.t3.gg/docs/customization#extending-presets).

  **BREAKING CHANGE**: The required TypeScript version is now ^5.0.0

## 0.7.3

### Patch Changes

- [`25f209536d1efdf6713906c361f213f9c34e12d9`](https://github.com/t3-oss/t3-env/commit/25f209536d1efdf6713906c361f213f9c34e12d9) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: add a prepack to remove worksapce protocol

## 0.7.2

### Patch Changes

- [#160](https://github.com/t3-oss/t3-env/pull/160) [`f4d5aeb98bf415fef18f9818507a38eb1c2ea700`](https://github.com/t3-oss/t3-env/commit/f4d5aeb98bf415fef18f9818507a38eb1c2ea700) Thanks [@Just-Moh-it](https://github.com/Just-Moh-it)! - fix: handle undefined clientPrefix for server env and not throw error

## 0.7.1

### Patch Changes

- [#138](https://github.com/t3-oss/t3-env/pull/138) [`cb72fa9`](https://github.com/t3-oss/t3-env/commit/cb72fa9b4efa19428f33824ac8fccdf803c85c8c) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - move emptyStringAsOptional to base options

## 0.7.0

### Minor Changes

- [#113](https://github.com/t3-oss/t3-env/pull/113) [`4754db7`](https://github.com/t3-oss/t3-env/commit/4754db7160ad8372dd67c445b16d984c708d9699) Thanks [@Zamiell](https://github.com/Zamiell)! - feat: add option `emptyStringAsUndefined`

### Patch Changes

- [#121](https://github.com/t3-oss/t3-env/pull/121) [`c77c240`](https://github.com/t3-oss/t3-env/commit/c77c24009ce34aeedef0e04f1ce47be2e05610d1) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Fixed type infer for empty client config

- [#131](https://github.com/t3-oss/t3-env/pull/131) [`86ea798`](https://github.com/t3-oss/t3-env/commit/86ea798ddd347c6e645b2ec827922acccfe2c78c) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Support React Native Expo

## 0.6.1

### Patch Changes

- [#111](https://github.com/t3-oss/t3-env/pull/111) [`6890765`](https://github.com/t3-oss/t3-env/commit/68907651b6a04dcc459cd21fda2edb20f018ea0f) Thanks [@Zamiell](https://github.com/Zamiell)! - fix: mark type as readonly

## 0.6.0

### Minor Changes

- [#90](https://github.com/t3-oss/t3-env/pull/90) [`1f6de0f`](https://github.com/t3-oss/t3-env/commit/1f6de0fca26160ee67bbb6179e5fc09404766940) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - feat: add `shared` section for shared variables

  shared variables are variables that are available in all runtimes despite them not being prefixed by anything, and is not manually supplied by the user.

## 0.5.1

## 0.5.0

## 0.4.1

### Patch Changes

- [#78](https://github.com/t3-oss/t3-env/pull/78) [`245f6ad`](https://github.com/t3-oss/t3-env/commit/245f6ad1d763f9d5c260f093bd4dfb686333cc4f) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Cleanup types

## 0.4.0

### Minor Changes

- [#64](https://github.com/t3-oss/t3-env/pull/64) [`fd7e659`](https://github.com/t3-oss/t3-env/commit/fd7e659fd31e5bbb07cbfc5bf1077d7177ee8ef3) Thanks [@parnavh](https://github.com/parnavh)! - allow for passing only server or client configuration without needing to fill them with "dummy options"

### Patch Changes

- [#68](https://github.com/t3-oss/t3-env/pull/68) [`b35b8e8`](https://github.com/t3-oss/t3-env/commit/b35b8e87e237ed32d4af3cef3d0d0783fe24f61a) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Prevent client prefix on server

## 0.3.1

## 0.3.0

### Minor Changes

- [`a50e929`](https://github.com/t3-oss/t3-env/commit/a50e92977129ac1b7c1c46e3d0cae43d87842069) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - don't restrict runtimeEnv to just strings

  turns out some frameworks inject environment variables as booleans or numbers, this allows you to use those without getting type errors

### Patch Changes

- [`979cd9a`](https://github.com/t3-oss/t3-env/commit/979cd9ac167677a237bf2a0a440eea94e3e6667a) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - prettify return type with simplify

- [#35](https://github.com/t3-oss/t3-env/pull/35) [`f0bc010`](https://github.com/t3-oss/t3-env/commit/f0bc0109251c355f00d8f432a53134a9ac3c34c5) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Remove process.env usage

- [#51](https://github.com/t3-oss/t3-env/pull/51) [`f0b200c`](https://github.com/t3-oss/t3-env/commit/f0b200c428b732f1421a56bc2b82c51c2fca1767) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - fix: set typescript peerdep to >=4.7

## 0.2.2

### Patch Changes

- [#21](https://github.com/t3-oss/t3-env/pull/21) [`fcf6851`](https://github.com/t3-oss/t3-env/commit/fcf685136b906ceeee05d423ff7549a6f578b277) Thanks [@chungweileong94](https://github.com/chungweileong94)! - Fix empty env object type

## 0.2.1

### Patch Changes

- [#12](https://github.com/t3-oss/t3-env/pull/12) [`c17f462`](https://github.com/t3-oss/t3-env/commit/c17f46205ba676b1a9b139fc4dc3395e4c074862) Thanks [@stefanprobst](https://github.com/stefanprobst)! - add types to package.json exports map

## 0.2.0

### Minor Changes

- [#3](https://github.com/t3-oss/t3-env/pull/3) [`54cd334`](https://github.com/t3-oss/t3-env/commit/54cd3342f0ef9ff4ac2fe8f26eb55e181afbe2cb) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - adds callback functions that allows overriding the default behavior when validation fails or variables are illegally accessed

## 0.1.0

### Minor Changes

- [`8e60f54`](https://github.com/t3-oss/t3-env/commit/8e60f54770315c875bb7e68106f401c1ee06ef40) Thanks [@juliusmarminge](https://github.com/juliusmarminge)! - initial release
