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

export interface BaseOptions<TShared extends Record<string, ZodType>> {
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

export interface LooseOptions<TShared extends Record<string, ZodType>>
  extends BaseOptions<TShared> {
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
  TShared extends Record<string, ZodType>
> extends BaseOptions<TShared> {
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
  TClient extends Record<string, ZodType>
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

export interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>
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

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>
> =
  | (LooseOptions<TShared> & ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared> &
      ServerClientOptions<TPrefix, TServer, TClient>);

export function createEnv<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared>
): Readonly<
  Simplify<
    z.infer<ZodObject<TServer>> &
      z.infer<ZodObject<TClient>> &
      z.infer<ZodObject<TShared>>
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

  const env = new Proxy(parsed.data, {
    get(target, prop) {
      if (
        typeof prop !== "string" ||
        prop === "__esModule" ||
        prop === "$$typeof"
      )
        return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix) &&
        shared.shape[prop as keyof typeof shared.shape] === undefined
      ) {
        return onInvalidAccess(prop);
      }
      return target[prop as keyof typeof target];
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as any;
}
