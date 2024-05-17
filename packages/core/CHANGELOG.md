# @t3-oss/env-core

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
