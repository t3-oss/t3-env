/**
 * This is the core package of t3-env.
 * It contains the `createEnv` function that you can use to create your schema.
 * @module
 */
import type { StandardSchemaDictionary, StandardSchemaV1 } from "./standard.ts";
import { ensureSynchronous, parseWithDictionary } from "./standard.ts";

export type {
  /**
   * The Standard Schema Interface
   * @see https://github.com/standard-schema/standard-schema
   * @internal
   */
  StandardSchemaV1,
  /**
   * A record with values being Standard Schema validators
   * @see https://github.com/standard-schema/standard-schema
   * @internal
   */
  StandardSchemaDictionary,
};

/**
 * Symbol for indicating type errors
 * @internal
 */
type ErrorMessage<T extends string> = T;

/**
 * Simplify a type
 * @internal
 */
type Simplify<T> = {
  [P in keyof T]: T[P];
} & {};

/**
 * Get the keys of the possibly undefined values
 * @internal
 */
type PossiblyUndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Make the keys of the type possibly undefined
 * @internal
 */
type UndefinedOptional<T> = Partial<Pick<T, PossiblyUndefinedKeys<T>>> &
  Omit<T, PossiblyUndefinedKeys<T>>;

/**
 * Make the keys of the type impossible
 * @internal
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

/**
 * Reverse a Readonly object to be mutable
 * @internal
 */
type Mutable<T> = T extends Readonly<infer U> ? U : T;

/**
 * Reduce an array of records to a single object where later keys override earlier ones
 * @internal
 */
type Reduce<
  TArr extends Record<string, unknown>[],
  TAcc = object,
> = TArr extends []
  ? TAcc
  : TArr extends [infer Head, ...infer Tail]
    ? Tail extends Record<string, unknown>[]
      ? Mutable<Head> & Omit<Reduce<Tail, TAcc>, keyof Head>
      : never
    : never;

/**
 * The options that can be passed to the `createEnv` function.
 */
export interface BaseOptions<
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared;

  /**
   * Extend presets
   */
  extends?: TExtends;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (issues: readonly StandardSchemaV1.Issue[]) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined?: boolean;
}

/**
 * Using this interface doesn't validate all environment variables are specified
 * in the `runtimeEnv` object. You may want to use `StrictOptions` instead if
 * your framework performs static analysis and tree-shakes unused variables.
 */
export interface LooseOptions<
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  runtimeEnvStrict?: never;

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

/**
 * Using this interface validates all environment variables are specified
 * in the `runtimeEnv` object. If you miss one, you'll get a type error. Useful
 * if you want to make sure all environment variables are set for frameworks that
 * perform static analysis and tree-shakes unused variables.
 */
export interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
  TClient extends StandardSchemaDictionary,
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof TClient]: TPrefix extends undefined
          ? never
          : TKey extends `${TPrefix}${string}`
            ? TKey
            : never;
      }[keyof TClient]
    | {
        [TKey in keyof TServer]: TPrefix extends undefined
          ? TKey
          : TKey extends `${TPrefix}${string}`
            ? never
            : TKey;
      }[keyof TServer]
    | {
        [TKey in keyof TShared]: TKey extends string ? TKey : never;
      }[keyof TShared],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

/**
 * This interface is used to define the client-side environment variables.
 * It's used in conjunction with the `clientPrefix` option to ensure
 * that all client-side variables are prefixed with the same string.
 * Common examples of prefixes are `NEXT_PUBLIC_`, `NUXT_PUBLIC` or `PUBLIC_`.
 */
export interface ClientOptions<
  TPrefix extends string | undefined,
  TClient extends StandardSchemaDictionary,
> {
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  }>;
}

/**
 * This interface is used to define the schema for your
 * server-side environment variables.
 */
export interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends undefined
      ? TServer[TKey]
      : TPrefix extends ""
        ? TServer[TKey]
        : TKey extends `${TPrefix}${string}`
          ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
              ? TKey
              : never} should not prefixed with ${TPrefix}.`>
          : TServer[TKey];
  }>;
}

export interface CreateSchemaOptions<
  TServer extends StandardSchemaDictionary,
  TClient extends StandardSchemaDictionary,
  TShared extends StandardSchemaDictionary,
  TFinalSchema extends StandardSchemaV1<{}, {}>,
> {
  /**
   * A custom function to combine the schemas.
   * Can be used to add further refinement or transformation.
   */
  createFinalSchema?: (
    shape: TServer & TClient & TShared,
    isServer: boolean,
  ) => TFinalSchema;
}

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
  TClient extends StandardSchemaDictionary,
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
  TClient extends StandardSchemaDictionary,
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
  TFinalSchema extends StandardSchemaV1<{}, {}>,
> = (
  | (LooseOptions<TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>)
) &
  CreateSchemaOptions<TServer, TClient, TShared, TFinalSchema>;

type TPrefixFormat = string | undefined;
type TServerFormat = StandardSchemaDictionary;
type TClientFormat = StandardSchemaDictionary;
type TSharedFormat = StandardSchemaDictionary;
type TExtendsFormat = Array<Record<string, unknown>>;

export type DefaultCombinedSchema<
  TServer extends TServerFormat,
  TClient extends TClientFormat,
  TShared extends TSharedFormat,
> = StandardSchemaV1<
  {},
  UndefinedOptional<
    StandardSchemaDictionary.InferOutput<TServer & TClient & TShared>
  >
>;

export type CreateEnv<
  TFinalSchema extends StandardSchemaV1<{}, {}>,
  TExtends extends TExtendsFormat,
> = Readonly<
  Simplify<Reduce<[StandardSchemaV1.InferOutput<TFinalSchema>, ...TExtends]>>
>;

export function createEnv<
  TPrefix extends TPrefixFormat,
  TServer extends TServerFormat = NonNullable<unknown>,
  TClient extends TClientFormat = NonNullable<unknown>,
  TShared extends TSharedFormat = NonNullable<unknown>,
  const TExtends extends TExtendsFormat = [],
  TFinalSchema extends StandardSchemaV1<{}, {}> = DefaultCombinedSchema<
    TServer,
    TClient,
    TShared
  >,
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared, TExtends, TFinalSchema>,
): CreateEnv<TFinalSchema, TExtends> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false;
  if (emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === "") {
        delete runtimeEnv[key];
      }
    }
  }

  const skip = !!opts.skipValidation;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};
  const isServer =
    opts.isServer ?? (typeof window === "undefined" || "Deno" in window);

  const finalSchemaShape = isServer
    ? {
        ..._server,
        ..._shared,
        ..._client,
      }
    : {
        ..._client,
        ..._shared,
      };

  const parsed =
    opts
      .createFinalSchema?.(finalSchemaShape as never, isServer)
      ["~standard"].validate(runtimeEnv) ??
    parseWithDictionary(finalSchemaShape, runtimeEnv);

  ensureSynchronous(parsed, "Validation must be synchronous");

  const onValidationError =
    opts.onValidationError ??
    ((issues) => {
      console.error("❌ Invalid environment variables:", issues);
      throw new Error("Invalid environment variables");
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    (() => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client",
      );
    });

  if (parsed.issues) {
    return onValidationError(parsed.issues);
  }

  const isServerAccess = (prop: string) => {
    if (!opts.clientPrefix) return true;
    return !prop.startsWith(opts.clientPrefix) && !(prop in _shared);
  };
  const isValidServerAccess = (prop: string) => {
    return isServer || !isServerAccess(prop);
  };
  const ignoreProp = (prop: string) => {
    return prop === "__esModule" || prop === "$$typeof";
  };

  // a map of keys to the preset we got them from
  const presetsByKey: Record<string, Record<string, unknown> | undefined> = {};

  const extendedObj = (opts.extends ?? []).reduce((acc, curr) => {
    for (const key in curr) {
      presetsByKey[key] = curr;
      acc[key] = curr[key];
    }
    return acc;
  }, {});
  const fullObj = Object.assign(extendedObj, parsed.value);

  const env = new Proxy(fullObj, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // pass off handling to the original proxy from the preset
      const preset = presetsByKey[prop];
      if (preset) return preset[prop];
      if (ignoreProp(prop)) return undefined;
      if (!isValidServerAccess(prop)) return onInvalidAccess(prop);
      return Reflect.get(target, prop);
    },
    // Maybe reconsider this in the future:
    // https://github.com/t3-oss/t3-env/pull/111#issuecomment-1682931526
    // set(_target, prop) {
    //   // Readonly - this is the error message you get from assigning to a frozen object
    //   throw new Error(
    //     typeof prop === "string"
    //       ? `Cannot assign to read only property ${prop} of object #<Object>`
    //       : `Cannot assign to read only property of object #<Object>`
    //   );
    // },
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return env as any;
}
