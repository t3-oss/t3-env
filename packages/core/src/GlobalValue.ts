/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

/**
 * The `GlobalValue` module ensures that a single instance of a value is created globally,
 * even when modules are imported multiple times (e.g., due to mixing CommonJS and ESM builds)
 * or during hot-reloading in development environments like Next.js or Remix.
 *
 * It achieves this by using a versioned global store, identified by a unique `Symbol` tied to
 * the current version of the `effect` library. The store holds values that are keyed by an identifier,
 * allowing the reuse of previously computed instances across imports or reloads.
 *
 * This pattern is particularly useful in scenarios where frequent reloading can cause services or
 * single-instance objects to be recreated unnecessarily, such as in development environments with hot-reloading.
 *
 * @license MIT Copyright (c) 2023 Effectful Technologies Inc
 * @source https://github.com/Effect-TS/effect/blob/main/packages/effect/src/GlobalValue.ts
 * @since 2.0.0
 */
import { version } from "../package.json";

const globalStoreId = `effect/GlobalValue/globalStoreId/${version}`;

let globalStore: Map<unknown, any>;

export const globalValue = <A>(id: symbol, compute: (id: symbol) => A): A => {
  if (!globalStore) {
    // @ts-expect-error
    globalThis[globalStoreId] ??= new Map();
    // @ts-expect-error
    globalStore = globalThis[globalStoreId] as Map<unknown, any>;
  }
  if (!globalStore.has(id)) {
    globalStore.set(id, compute(id));
  }
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return globalStore.get(id)!;
};
