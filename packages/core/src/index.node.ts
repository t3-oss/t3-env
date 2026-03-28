/**
 * This is the Node runtime entrypoint of t3-env.
 * It contains the `createEnv` function that you can use to create your schema.
 * @module
 */
import type { StandardSchemaDictionary, StandardSchemaV1 } from "./standard.ts";
import { ensureSynchronous, parseWithDictionary } from "./standard.ts";
import { resolveWorktreeRuntimeEnv } from "./worktree.node.ts";

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

type ErrorMessage<T extends string> = T;
type Simplify<T> = { [P in keyof T]: T[P] } & {};
type PossiblyUndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
type UndefinedOptional<T> = Partial<Pick<T, PossiblyUndefinedKeys<T>>> &
  Omit<T, PossiblyUndefinedKeys<T>>;
type Impossible<T extends Record<string, any>> = Partial<Record<keyof T, never>>;
type Mutable<T> = T extends Readonly<infer U> ? U : T;
type Reduce<TArr extends Record<string, unknown>[], TAcc = object> = TArr extends []
  ? TAcc
  : TArr extends [infer Head, ...infer Tail]
    ? Tail extends Record<string, unknown>[]
      ? Mutable<Head> & Omit<Reduce<Tail, TAcc>, keyof Head>
      : never
    : never;

export interface BaseOptions<
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> {
  isServer?: boolean;
  shared?: TShared;
  extends?: TExtends;
  onValidationError?: (issues: readonly StandardSchemaV1.Issue[]) => never;
  onInvalidAccess?: (variable: string) => never;
  skipValidation?: boolean;
  emptyStringAsUndefined?: boolean;
  worktreeDetection?: boolean;
}

export interface LooseOptions<
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  runtimeEnvStrict?: never;
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
  TClient extends StandardSchemaDictionary,
  TShared extends StandardSchemaDictionary,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
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

export interface ClientOptions<
  TPrefix extends string | undefined,
  TClient extends StandardSchemaDictionary,
> {
  clientPrefix: TPrefix;
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string ? TKey : never} is not prefixed with ${TPrefix}.`>;
  }>;
}

export interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends StandardSchemaDictionary,
> {
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
  createFinalSchema?: (shape: TServer & TClient & TShared, isServer: boolean) => TFinalSchema;
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
  | (LooseOptions<TShared, TExtends> & ServerClientOptions<TPrefix, TServer, TClient>)
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
  UndefinedOptional<StandardSchemaDictionary.InferOutput<TServer & TClient & TShared>>
>;

export type CreateEnv<
  TFinalSchema extends StandardSchemaV1<{}, {}>,
  TExtends extends TExtendsFormat,
> = Readonly<Simplify<Reduce<[StandardSchemaV1.InferOutput<TFinalSchema>, ...TExtends]>>>;

export function createEnv<
  TPrefix extends TPrefixFormat,
  TServer extends TServerFormat = NonNullable<unknown>,
  TClient extends TClientFormat = NonNullable<unknown>,
  TShared extends TSharedFormat = NonNullable<unknown>,
  const TExtends extends TExtendsFormat = [],
  TFinalSchema extends StandardSchemaV1<{}, {}> = DefaultCombinedSchema<TServer, TClient, TShared>,
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared, TExtends, TFinalSchema>,
): CreateEnv<TFinalSchema, TExtends> {
  let runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  if (opts.worktreeDetection) {
    runtimeEnv = resolveWorktreeRuntimeEnv(runtimeEnv);
  }

  const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false;
  if (emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === "") {
        delete runtimeEnv[key];
      }
    }
  }

  const skip = !!opts.skipValidation;
  if (skip) {
    if (opts.extends) {
      for (const preset of opts.extends) {
        preset.skipValidation = true;
      }
    }

    // biome-ignore lint/suspicious/noExplicitAny: preserve current return type behavior
    return runtimeEnv as any;
  }

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};
  const isServer = opts.isServer ?? (typeof window === "undefined" || "Deno" in window);

  const finalSchemaShape = isServer
    ? { ..._server, ..._shared, ..._client }
    : { ..._client, ..._shared };

  const finalSchema = opts.createFinalSchema?.(finalSchemaShape as never, isServer);
  const parsed =
    finalSchema?.["~standard"].validate(runtimeEnv) ??
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
      throw new Error("❌ Attempted to access a server-side environment variable on the client");
    });

  if (parsed.issues) {
    return onValidationError(parsed.issues);
  }

  const isServerAccess = (prop: string) => {
    if (!opts.clientPrefix) return true;
    return !prop.startsWith(opts.clientPrefix) && !(prop in _shared);
  };
  const isValidServerAccess = (prop: string) => isServer || !isServerAccess(prop);
  const ignoreProp = (prop: string) => prop === "__esModule" || prop === "$$typeof";

  const extendedObj = (opts.extends ?? []).reduce((acc, curr) => Object.assign(acc, curr), {});
  const fullObj = Object.assign(extendedObj, parsed.value);

  const env = new Proxy(fullObj, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (ignoreProp(prop)) return undefined;
      if (!isValidServerAccess(prop)) return onInvalidAccess(prop);
      return Reflect.get(target, prop);
    },
  });

  return env as any;
}
