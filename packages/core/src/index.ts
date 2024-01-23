import { z, type ZodError, type ZodObject, type ZodType } from "zod";

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

type DisallowDuplicateKeys<
  T extends Record<string, unknown>,
  TExtends extends Record<string, unknown> | undefined
> = {
  [TKey in keyof T]: TKey extends string
    ? TKey extends keyof TExtends
      ? ErrorMessage<`Duplicate key '${TKey}', already defined in the extended env.`>
      : T[TKey]
    : never;
};

type HasClientPrefix<
  TPrefix extends string | undefined,
  TKey extends string
> = TPrefix extends "" | undefined
  ? false
  : TKey extends `${TPrefix}${string}`
  ? true
  : false;

export interface BaseOptions<
  TShared extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Another env that this env extends. This is useful for example when you have a "shared" env
   * that is used by multiple apps and then app-specific envs for each app.
   * This env must not have any conflicting keys with the extended env.
   */
  extends?: TExtends;

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   * Cannot overlap with extended env.
   */
  shared?: DisallowDuplicateKeys<TShared, TExtends>;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

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

export interface LooseOptions<
  TShared extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
> extends BaseOptions<TShared, TExtends> {
  runtimeEnvStrict?: never;

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
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

export interface ClientOptions<
  TPrefix extends string | undefined,
  TClient extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
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
  client: TPrefix extends undefined
    ? ErrorMessage<"clientPrefix is required when client is defined.">
    : TPrefix extends ""
    ? ErrorMessage<"clientPrefix cannot be empty when client is defined.">
    : {
        [TKey in keyof TClient]?: TKey extends string
          ? TKey extends keyof TExtends
            ? ErrorMessage<`Duplicate key '${TKey}', already defined in the extended env.`>
            : HasClientPrefix<TPrefix, TKey> extends true
            ? TClient[TKey]
            : ErrorMessage<`'${TKey}' should be prefixed with '${TPrefix}'.`>
          : never;
      };
}

export interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    [TKey in keyof TServer]?: TKey extends string
      ? TKey extends keyof TExtends
        ? ErrorMessage<`Duplicate key '${TKey}', already defined in the extended env.`>
        : HasClientPrefix<TPrefix, TKey> extends true
        ? ErrorMessage<`'${TKey}' should not be prefixed with '${TPrefix}'.`>
        : TServer[TKey]
      : never;
  };
}

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
> =
  | (ClientOptions<TPrefix, TClient, TExtends> &
      ServerOptions<TPrefix, TServer, TExtends>)
  | (ServerOptions<TPrefix, TServer, TExtends> &
      Impossible<ClientOptions<never, never, never>>)
  | (ClientOptions<TPrefix, TClient, TExtends> &
      Impossible<ServerOptions<never, never, never>>);

export type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
  TExtends extends Record<string, unknown> | undefined
> =
  | (LooseOptions<TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient, TExtends>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient, TExtends>);

export function createEnv<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>,
  TExtends extends Record<string, unknown> | undefined = undefined
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared, TExtends>
): Simplify<
  Readonly<
    z.infer<ZodObject<TShared>> &
      z.infer<ZodObject<TClient>> &
      z.infer<ZodObject<TServer>> &
      // eslint-disable-next-line @typescript-eslint/ban-types
      (TExtends extends undefined ? {} : TExtends)
  >
> {
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};

  if (opts.extends) {
    const duplicateKeys = Object.keys(opts.extends).filter(
      (key) => key in _client || key in _server || key in _shared
    );
    if (duplicateKeys.length > 0) {
      throw new Error(
        `Cannot extend env with duplicate keys: ${duplicateKeys.join(", ")}`
      );
    }
  }

  const client = z.object(_client);
  const server = z.object(_server);
  const shared = z.object(_shared);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const allClient = client.merge(shared);
  const allServer = server.merge(shared).merge(client);
  const parsed = isServer
    ? allServer.safeParse(runtimeEnv) // on server we can validate all env vars
    : allClient.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

  const onValidationError =
    opts.onValidationError ??
    ((error: ZodError) => {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors
      );
      throw new Error("Invalid environment variables");
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    ((_variable: string) => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client"
      );
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const ignoreProp = (prop: string) =>
    prop === "__esModule" ||
    prop === "$$typeof" ||
    ("__vitest_environment__" in globalThis && prop === "nodeType");

  const isServerAccess = (prop: string) =>
    !opts.clientPrefix ||
    (!prop.startsWith(opts.clientPrefix) && !(prop in shared.shape));

  const isValidServerAccess = (prop: string) =>
    isServer || !isServerAccess(prop);

  const isExtendedProp = (prop: string) =>
    opts.extends && Reflect.has(opts.extends, prop);

  const env = new Proxy(
    {
      ...(opts.extends ?? {}),
      ...parsed.data,
    },
    {
      has(target: Record<string, unknown>, prop: string | symbol) {
        if (typeof prop !== "string") return false;
        if (ignoreProp(prop)) return false;
        if (isExtendedProp(prop)) return true;
        if (!isValidServerAccess(prop)) return false;
        return prop in target;
      },
      get(target, prop) {
        if (typeof prop !== "string") return undefined;
        if (ignoreProp(prop)) return undefined;
        if (opts.extends && prop in opts.extends) return opts.extends[prop];
        if (!isValidServerAccess(prop)) return onInvalidAccess(prop);
        return target[prop];
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
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as any;
}
