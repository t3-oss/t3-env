# @t3-oss/env-core

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
