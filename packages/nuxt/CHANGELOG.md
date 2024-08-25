# @t3-oss/env-nuxt

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
